// app/api/docsafe/route.ts
export const runtime = "nodejs";         // streaming + FormData côté Node
export const dynamic = "force-dynamic";  // pas de cache
export const maxDuration = 60;           // si ton proxy peut prendre du temps

function extFromName(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1) : "bin";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const mode = String(form.get("mode") ?? "correct"); // "correct" (V1) | "rephrase" (V2)
    const lang = String(form.get("lang") ?? "auto");    // optionnel

    if (!file) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    const upstreamForm = new FormData();
    upstreamForm.set("file", file, file.name);
    upstreamForm.set("mode", mode);
    upstreamForm.set("lang", lang);

    const upstream = await fetch(
      `${process.env.DOCSAFE_API_URL}/api/process`, // adapte à ton endpoint
      {
        method: "POST",
        headers: {
          ...(process.env.DOCSAFE_API_KEY
            ? { "x-api-key": process.env.DOCSAFE_API_KEY }
            : {}),
        },
        body: upstreamForm,
      }
    );

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return Response.json(
        { error: text || `Upstream error ${upstream.status}` },
        { status: upstream.status }
      );
    }

    // Cas 1 : ton backend renvoie un FICHIER (synchrone)
    // -> on stream la réponse telle quelle + Content-Disposition pour le download
    const ct = upstream.headers.get("content-type") ?? "application/octet-stream";
    const cd =
      upstream.headers.get("content-disposition") ??
      `attachment; filename="docsafe_${mode}.${extFromName(file.name)}"`;

    // Si ton backend renvoie plutôt du JSON (jobId), dé-commente ce bloc et adapte :
    // const data = await upstream.json();
    // return Response.json(data);

    return new Response(upstream.body, {
      headers: {
        "content-type": ct,
        "content-disposition": cd,
      },
    });
  } catch (err: any) {
    return Response.json({ error: err?.message ?? "Proxy failed" }, { status: 500 });
  }
}
