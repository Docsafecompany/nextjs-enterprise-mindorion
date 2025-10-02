// app/api/docsafe/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function extFromName(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "bin";
}

// IMPORTANT: set DOCSAFE_API_URL in Vercel (e.g. https://docsafe-backend-beta-1.onrender.com)
const BACKEND = process.env.DOCSAFE_API_URL;

export async function POST(req: Request) {
  if (!BACKEND) {
    return Response.json(
      { error: "DOCSAFE_API_URL env var is missing on the frontend" },
      { status: 500 }
    );
  }

  try {
    const formIn = await req.formData();
    const file = formIn.get("file") as File | null;
    if (!file) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    // Choose the upstream endpoint:
    // /clean       -> V1 (clean only)
    // /clean-v2    -> V2 (clean + rephrase + report)
    const upstreamUrl = `${BACKEND.replace(/\/+$/, "")}/clean-v2`;

    // Build the upstream multipart form
    const fd = new FormData();
    fd.set("file", file, file.name);
    // Optional flags:
    // - strictPdf: 'true' | 'false'
    fd.set("strictPdf", "false");

    const headers: Record<string, string> = {};
    if (process.env.DOCSAFE_API_KEY) {
      headers["x-api-key"] = process.env.DOCSAFE_API_KEY!;
    }

    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers,
      body: fd,
    });

    // If upstream failed -> return error text/JSON to the client (no forced download)
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      // Try to JSON-ify if possible
      try {
        const maybe = JSON.parse(text);
        return Response.json(maybe, { status: upstream.status });
      } catch {
        return Response.json(
          {
            error:
              text ||
              `Upstream error ${upstream.status} (see Render logs for details)`,
          },
          { status: upstream.status }
        );
      }
    }

    // Upstream OK -> stream the body and forward headers so the browser downloads it
    const ct =
      upstream.headers.get("content-type") || "application/octet-stream";
    // If backend didn’t set a filename, generate one
    const cd =
      upstream.headers.get("content-disposition") ||
      `attachment; filename="docsafe_v2_result.zip"`;

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "content-type": ct,
        "content-disposition": cd,
        // Passing through caching headers is fine; this route is forced-dynamic anyway.
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Proxy failed" },
      { status: 500 }
    );
  }
}

