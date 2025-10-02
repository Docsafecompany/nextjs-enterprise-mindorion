// app/api/docsafe/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// IMPORTANT: configure dans Vercel -> DOCSAFE_API_URL = https://docsafe-backend-beta-1.onrender.com
const BACKEND = process.env.DOCSAFE_API_URL;

export async function POST(req: Request) {
  if (!BACKEND) {
    return Response.json(
      { error: "DOCSAFE_API_URL env var is missing on the frontend" },
      { status: 500 }
    );
  }

  try {
    const inForm = await req.formData();
    const file = inForm.get("file") as File | null;
    if (!file) return Response.json({ error: "Missing file" }, { status: 400 });

    // on cible la V2 (clean + rephrase + report)
    const upstreamUrl = `${BACKEND.replace(/\/+$/, "")}/clean-v2`;

    const fd = new FormData();
    fd.set("file", file, file.name);
    fd.set("strictPdf", "false");

    const headers: Record<string, string> = {};
    if (process.env.DOCSAFE_API_KEY) headers["x-api-key"] = process.env.DOCSAFE_API_KEY!;

    const upstream = await fetch(upstreamUrl, { method: "POST", headers, body: fd });

    // Si status non OK -> renvoyer erreur texte/JSON (surtout pas download)
    if (!upstream.ok) {
      const txt = await upstream.text().catch(() => "");
      try {
        const j = JSON.parse(txt);
        return Response.json(j, { status: upstream.status });
      } catch {
        return new Response(
          txt || `Upstream error ${upstream.status} (see backend logs)`,
          { status: upstream.status, headers: { "content-type": "text/plain; charset=utf-8" } }
        );
      }
    }

    // Vérifier que c'est bien un ZIP/téléchargeable avant de forcer le download
    const ct = upstream.headers.get("content-type") || "";
    const cd = upstream.headers.get("content-disposition") || "";

    const isZipish =
      /\bapplication\/(zip|octet-stream)\b/i.test(ct) ||
      /filename\s*=\s*"?[^"]+\.zip"?/i.test(cd);

    if (!isZipish) {
      // Pas un zip -> renvoyer contenu lisible (JSON/texte)
      const buf = await upstream.arrayBuffer();
      const bytes = new Uint8Array(buf);

      // Essayer texte
      let txt = "";
      try {
        txt = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      } catch {}
      if (txt) {
        try {
          const j = JSON.parse(txt);
          return Response.json(j, { status: 502 });
        } catch {
          return new Response(txt, {
            status: 502,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }
      }
      // fallback binaire
      return new Response("Unexpected upstream response (not a ZIP)", {
        status: 502,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // OK -> streamer le zip tel quel
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "content-type": ct || "application/zip",
        "content-disposition":
          cd || `attachment; filename="docsafe_v2_result.zip"`,
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Proxy failed" },
      { status: 500 }
    );
  }
}


