// app/api/docsafe/route.ts
export const runtime = "nodejs";         // streaming + FormData côté Node
export const dynamic = "force-dynamic";  // pas de cache
export const maxDuration = 60;

import { cookies } from "next/headers";

const COOKIE_KEY = "docsafe_free_used";
const FREE_LIMIT = 3;

function extFromName(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1) : "bin";
}

export async function POST(req: Request) {
  try {
    // --- Free quota (anonymous) ---
    const cookieStore = cookies();
    const usedRaw = cookieStore.get(COOKIE_KEY)?.value ?? "0";
    const used = Number.isNaN(parseInt(usedRaw, 10)) ? 0 : parseInt(usedRaw, 10);

    if (used >= FREE_LIMIT) {
      return new Response("Free limit reached", { status: 402 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const mode = String(form.get("mode") ?? "correct"); // "correct" | "rephrase"
    const lang = String(form.get("lang") ?? "auto");

    if (!file) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    // Build upstream form
    const upstreamForm = new FormData();
    upstreamForm.set("file", file, file.name);
    upstreamForm.set("mode", mode);
    upstreamForm.set("lang", lang);

    const upstreamUrl = process.env.DOCSAFE_API_URL
      ? `${process.env.DOCSAFE_API_URL.replace(/\/$/, "")}/api/process`
      : "";

    // If you have a real backend, proxy to it
    if (upstreamUrl) {
      const upstream = await fetch(upstreamUrl, {
        method: "POST",
        headers: {
          ...(process.env.DOCSAFE_API_KEY ? { "x-api-key": process.env.DOCSAFE_API_KEY } : {}),
        },
        body: upstreamForm,
      });

      if (!upstream.ok) {
        const text = await upstream.text().catch(() => "");
        return Response.json(
          { error: text || `Upstream error ${upstream.status}` },
          { status: upstream.status }
        );
      }

      // Success → increment cookie and stream back
      const next = used + 1;
      const ct = upstream.headers.get("content-type") ?? "application/octet-stream";
      const cd =
        upstream.headers.get("content-disposition") ??
        `attachment; filename="docsafe_${mode}.${extFromName(file.name)}"`;

      const res = new Response(upstream.body, {
        status: 200,
        headers: {
          "content-type": ct,
          "content-disposition": cd,
        },
      });
      res.headers.append(
        "Set-Cookie",
        `${COOKIE_KEY}=${next}; Path=/; Max-Age=${60 * 60 * 24 * 2}; SameSite=Lax`
      );
      return res;
    }

    // Stub success when no backend configured
    const next = used + 1;
    const res = Response.json({ ok: true, note: "stub-processing" }, { status: 200 });
    res.headers.append(
      "Set-Cookie",
      `${COOKIE_KEY}=${next}; Path=/; Max-Age=${60 * 60 * 24 * 2}; SameSite=Lax`
    );
    return res;
  } catch (err: any) {
    return Response.json({ error: err?.message ?? "Proxy failed" }, { status: 500 });
  }
}
