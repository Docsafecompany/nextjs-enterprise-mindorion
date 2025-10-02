// app/api/docsafe/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extFromName(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1) : "bin";
}

export async function POST(req: Request) {
  try {
    // Accept browser FormData
    const form = await req.formData();
    const mode = String(form.get("mode") ?? "correct").toLowerCase(); // "correct" | "rephrase"
    const lang = String(form.get("lang") ?? "auto");
    const strictPdf = String(form.get("strictPdf") ?? "false");

    // Build forwarding FormData
    const upstreamForm = new FormData();
    // Copy file fields: some clients use "file", some "files[]"
    for (const entry of form.entries()) {
      const [k, v] = entry as [string, any];
      if (v instanceof File) {
        upstreamForm.append("file", v, v.name);
      } else if (typeof v === "string") {
        // preserve fields
        upstreamForm.append(k, v);
      }
    }

    // Decide endpoint on your Render backend
    const backendBase = process.env.DOCSAFE_BACKEND || process.env.DOCSAFE_API_URL;
    if (!backendBase) {
      return new Response(JSON.stringify({ error: "DOCSAFE_BACKEND not configured" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    // Choose the route
    const endpoint = mode === "rephrase" || mode === "v2" ? "/clean-v2" : "/clean";
    const upstreamUrl = new URL(endpoint, backendBase).toString();

    // Forward request
    const headers: Record<string, string> = {};
    if (process.env.DOCSAFE_API_KEY) {
      headers["x-api-key"] = String(process.env.DOCSAFE_API_KEY);
    }

    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers,
      body: upstreamForm as unknown as BodyInit,
    });

    // If upstream returned error text/json, forward it with same status
    if (!upstream.ok) {
      const ct = upstream.headers.get("content-type") ?? "text/plain";
      const bodyText = await upstream.text().catch(() => "");
      return new Response(bodyText || `Upstream error ${upstream.status}`, {
        status: upstream.status,
        headers: { "content-type": ct },
      });
    }

    // Stream the upstream response back preserving important headers
    const resHeaders: Record<string, string> = {};
    const ct = upstream.headers.get("content-type");
    const cd = upstream.headers.get("content-disposition");
    if (ct) resHeaders["content-type"] = ct;
    if (cd) resHeaders["content-disposition"] = cd;

    return new Response(upstream.body, { status: 200, headers: resHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

