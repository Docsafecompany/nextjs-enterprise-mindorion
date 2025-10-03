export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// mets le plus haut possible (Pro = 60s ; Enterprise peut monter)
export const maxDuration = 60;

const UP = process.env.DOCSAFE_API_URL!; // ex: https://docsafe-backend-beta-1.onrender.com
const API_KEY = process.env.DOCSAFE_API_KEY || "";

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1) : "bin";
}

// petit “réveil” Render (ne bloque pas si ça échoue)
async function warmUp() {
  try { await fetch(`${UP}/health`, { cache: "no-store" }); } catch {}
}

// retry util
async function withRetries<T>(fn: () => Promise<T>, tries = 3, backoffMs = 1200): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } 
    catch (e) { lastErr = e; await new Promise(r => setTimeout(r, backoffMs * (i + 1))); }
  }
  throw lastErr;
}

export async function POST(req: Request) {
  try {
    await warmUp();

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const lang = String(form.get("lang") ?? "auto");
    const strictPdf = String(form.get("strictPdf") ?? "false");
    // on force V2 (clean + rephrase) côté backend ; change vers /clean si tu veux que V1 only
    const endpoint = `${UP}/clean-v2`;

    if (!file) return Response.json({ error: "Missing file" }, { status: 400 });

    // on forward tel quel
    const upstreamForm = new FormData();
    upstreamForm.set("file", file, file.name);
    upstreamForm.set("lang", lang);
    upstreamForm.set("strictPdf", strictPdf);

    const upstream = await withRetries(() =>
      fetch(endpoint, {
        method: "POST",
        headers: { ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
        body: upstreamForm,
        // IMPORTANT: pas de cache / pas d’abort côté Next
        cache: "no-store",
      }),
      3
    );

    // Si Render renvoie une erreur JSON/HTML → propage proprement
    const ct = upstream.headers.get("content-type") || "";
    if (!upstream.ok || (!ct.startsWith("application/zip") && !ct.startsWith("application/octet-stream"))) {
      const text = await upstream.text().catch(() => "");
      return new Response(text || `Upstream error ${upstream.status}`, {
        status: upstream.status || 502,
        headers: { "content-type": ct || "text/plain; charset=utf-8" },
      });
    }

    // stream direct vers le browser (déclenche le download)
    const cd =
      upstream.headers.get("content-disposition") ||
      `attachment; filename="docsafe_v2_result.${extOf(file.name) === "pdf" ? "zip" : "zip"}"`;

    return new Response(upstream.body, {
      headers: {
        "content-type": ct,
        "content-disposition": cd,
        // utile pour Chrome
        "cache-control": "no-store",
      },
    });
  } catch (err: any) {
    // si ça a quand même timeout côté Vercel, on renvoie un message clair au client
    return Response.json(
      { error: err?.message || "Proxy failed (timeout/Render cold start?)" },
      { status: 504 }
    );
  }
}

