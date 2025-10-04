// app/api/docsafe/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const UP = process.env.DOCSAFE_API_URL!;            // ex: https://docsafe-backend-beta-1.onrender.com
const API_KEY = process.env.DOCSAFE_API_KEY || "";  // optionnel

// Ping non bloquant (réveille Render)
async function warm() {
  try { await fetch(`${UP}/health`, { cache: "no-store" }); } catch {}
}

// petit retry (gère cold start)
async function retry<T>(fn: () => Promise<T>, n = 3, step = 1000): Promise<T> {
  let last: any;
  for (let i = 0; i < n; i++) {
    try { return await fn(); }
    catch (e) { last = e; await new Promise(r => setTimeout(r, step * (i + 1))); }
  }
  throw last;
}

export async function POST(req: Request) {
  try {
    if (!UP) return Response.json({ error: "DOCSAFE_API_URL not set" }, { status: 500 });
    await warm();

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const lang = String(form.get("lang") ?? "auto");
    const strictPdf = String(form.get("strictPdf") ?? "false");

    if (!file) return Response.json({ error: "Missing file" }, { status: 400 });

    // 👉 V1 uniquement
    const endpoint = `${UP}/clean`;

    const upstreamForm = new FormData();
    upstreamForm.set("file", file, file.name);
    upstreamForm.set("lang", lang);
    upstreamForm.set("strictPdf", strictPdf);

    const r = await retry(() =>
      fetch(endpoint, {
        method: "POST",
        body: upstreamForm,
        headers: { ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
        cache: "no-store",
      }),
      3, 1200
    );

    const ct = r.headers.get("content-type") || "";
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return new Response(txt || `Upstream ${r.status}`, {
        status: r.status || 502,
        headers: { "content-type": ct || "text/plain; charset=utf-8" },
      });
    }

    if (!ct.startsWith("application/zip") && !ct.startsWith("application/octet-stream")) {
      const txt = await r.text().catch(() => "");
      return new Response(txt || "Unexpected upstream content-type", {
        status: 502,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // On lit pour éviter un “ZIP fantôme”
    const reader = r.body!.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) { chunks.push(value); total += value.length; }
    }
    if (total < 2048) {
      let txt = "";
      try { txt = new TextDecoder().decode(Buffer.concat(chunks as any)); } catch {}
      return new Response(txt || "Upstream returned a tiny file (likely cold start/timeout).", {
        status: 502, headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    const zip = new Blob(chunks, { type: ct });
    const cd = r.headers.get("content-disposition")
      || `attachment; filename="docsafe_v1_result.zip"`;

    return new Response(zip.stream(), {
      headers: {
        "content-type": ct,
        "content-disposition": cd,
        "cache-control": "no-store",
      },
    });
  } catch (e: any) {
    return Response.json({ error: e?.message || "Proxy failed (timeout?)" }, { status: 504 });
  }
}


