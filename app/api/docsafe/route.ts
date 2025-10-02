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
    const rawMode = String(form.get("mode") ?? "correct").toLowerCase(); // "correct" | "rephrase"
    const lang = String(form.get("lang") ?? "auto");
    const strictPdf = String(form.get("strictPdf") ?? "false"); // "true" | "false"

    if (!file) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    // === Upstream config
    const base = process.env.DOCSAFE_API_URL?.replace(/\/+$/, "");
    if (!base) {
      return Response.json(
        { error: "DOCSAFE_API_URL is not set" },
        { status: 500 }
      );
    }

    // Mappe le "mode" client vers tes vraies routes backend
    //   - correct  -> /clean
    //   - rephrase -> /clean-v2
    const upstreamPath = rawMode === "rephrase" ? "/clean-v2" : "/clean";
    const url = `${base}${upstreamPath}`;

    // Construit le FormData pour l’amont
    const upstreamForm = new FormData();
    upstreamForm.set("file", file, file.name);
    upstreamForm.set("strictPdf", strictPdf); // utilisé par tes routes /clean /clean-v2
    // (tu n’utilises pas "lang" côté backend, on peut l’ignorer ou le conserver)
    upstreamForm.set("lang", lang);

    const headers: Record<string, string> = {};
    if (process.env.DOCSAFE_API_KEY) {
      headers["x-api-key"] = process.env.DOCSAFE_API_KEY;
    }

    const upstream = await fetch(url, {
      method: "POST",
      headers,
      body: upstreamForm,
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return Response.json(
        {
          error: text || `Upstream error ${upstream.status}`,
          upstream: url,
          status: upstream.status,
        },
        { status: 502 }
      );
    }

    // Tes routes renvoient un ZIP ou un binaire -> on stream tel quel
    const ct =
      upstream.headers.get("content-type") ?? "application/octet-stream";
    const cd =
      upstream.headers.get("content-disposition") ??
      `attachment; filename="docsafe_result.${extFromName(file.name)}"`;

    return new Response(upstream.body, {
      headers: {
        "content-type": ct,
        "content-disposition": cd,
        "x-upstream-url": url,
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Proxy failed" },
      { status: 500 }
    );
  }
}

