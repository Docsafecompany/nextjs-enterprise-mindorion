// app/api/docsafe/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function extFromName(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "zip";
}

export async function POST(req: Request) {
  try {
    // 1) Lire le formulaire venant du navigateur
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return new Response(JSON.stringify({ error: "Missing file" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // (V1 uniquement) paramètres
    const strictPdf = String(form.get("strictPdf") ?? "false");

    // 2) Recomposer le FormData à envoyer au backend Render (/clean)
    const upstreamForm = new FormData();
    upstreamForm.set("file", file, file.name);
    upstreamForm.set("strictPdf", strictPdf);

    const backend = process.env.DOCSAFE_BACKEND_URL;
    if (!backend) {
      return new Response(JSON.stringify({ error: "Missing DOCSAFE_BACKEND_URL" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const headers: Record<string, string> = {};
    if (process.env.DOCSAFE_API_KEY) headers["x-api-key"] = process.env.DOCSAFE_API_KEY;

    // 3) Appel Render /clean (V1)
    const upstream = await fetch(`${backend}/clean`, {
      method: "POST",
      headers,
      body: upstreamForm,
    });

    // 4) En cas d’erreur côté backend, renvoyer le texte d’erreur
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return new Response(text || `Upstream error ${upstream.status}`, {
        status: upstream.status,
        headers: { "content-type": "text/plain" },
      });
    }

    // 5) Récupérer type + disposition renvoyés par le backend (zip)
    const ct =
      upstream.headers.get("content-type") ||
      "application/zip";
    const cdHeader =
      upstream.headers.get("content-disposition") || "";

    // Tenter de récupérer un nom de fichier propre
    let filename = "";
    const m = /filename\*?=(?:UTF-8'')?([^;]+)|filename="([^"]+)"/i.exec(cdHeader || "");
    if (m) {
      try {
        filename = decodeURIComponent((m[1] || m[2] || "").trim());
      } catch {
        filename = (m[1] || m[2] || "").trim();
      }
    }
    if (!filename) {
      // fallback: docsafe_v1_result.zip
      const ext = extFromName(file.name);
      filename = `docsafe_v1_result.zip`;
    }

    // 6) Streamer la réponse telle quelle -> le navigateur télécharge
    const headersOut = new Headers();
    headersOut.set("content-type", ct);
    headersOut.set("content-disposition", `attachment; filename="${filename}"`);
    // utile pour le streaming sur Vercel/Edge
    headersOut.set("cache-control", "no-store");

    return new Response(upstream.body, { headers: headersOut });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Proxy failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

