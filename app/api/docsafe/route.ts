// app/api/docsafe/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function extFromName(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1) : "bin";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    // option: strictPdf cochable côté UI (par défaut false)
    const strictPdf = String(form.get("strictPdf") ?? "false");

    if (!file) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    // Build multipart form for upstream (/clean = V1)
    const upstreamForm = new FormData();
    upstreamForm.set("file", file, file.name);
    upstreamForm.set("strictPdf", strictPdf);

    const baseUrl = process.env.DOCSAFE_API_URL; // ex: https://docsafe-backend-beta-1.onrender.com
    if (!baseUrl) {
      return Response.json({ error: "DOCSAFE_API_URL not set" }, { status: 500 });
    }

    const upstream = await fetch(`${baseUrl.replace(/\/+$/, "")}/clean`, {
      method: "POST",
      body: upstreamForm,
      // (si tu utilises une clé: headers: { "x-api-key": process.env.DOCSAFE_API_KEY! } )
    });

    // Si le backend renvoie une erreur → remonter le détail au front
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return new Response(text || `Upstream ${upstream.status}`, {
        status: upstream.status,
        headers: { "content-type": upstream.headers.get("content-type") || "text/plain" },
      });
    }

    // Pass-through du ZIP (ou d’un autre fichier) avec Content-Disposition
    const ct = upstream.headers.get("content-type") ?? "application/zip";
    const cd =
      upstream.headers.get("content-disposition") ??
      `attachment; filename="docsafe_v1_result.zip"`;

    return new Response(upstream.body, {
      headers: {
        "content-type": ct,
        "content-disposition": cd,
        // utile pour forcer le téléchargement dans quelques navigateurs
        "cache-control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return Response.json({ error: err?.message ?? "Proxy failed" }, { status: 500 });
  }
}
