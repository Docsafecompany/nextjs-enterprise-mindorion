// app/api/feedback/route.ts
import { NextResponse } from "next/server";

// ✅ Nodemailer requiert le runtime Node (pas Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  rating?: number;
  message?: string;
  email?: string;
};

function getEnv(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}

function sanitizeText(s: string) {
  // Petite sanitation pour éviter l'injection HTML basique
  return s.replace(/[<>&"]/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
  }[c] as string));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const rawMessage = String(body?.message ?? "").trim();
    const fromEmail = String(body?.email ?? "").trim();
    const ratingNum = Number(body?.rating ?? 5);
    const safeRating = Math.max(1, Math.min(Number.isFinite(ratingNum) ? ratingNum : 5, 5));

    if (!rawMessage || rawMessage.length < 3) {
      return NextResponse.json({ error: "Message is too short." }, { status: 400 });
    }

    // 🔐 SMTP depuis variables d'env (Vercel: Project → Settings → Environment Variables)
    const host = getEnv("SMTP_HOST");
    const port = Number(getEnv("SMTP_PORT", "587"));
    const user = getEnv("SMTP_USER");
    const pass = getEnv("SMTP_PASS");
    const from = getEnv("SMTP_FROM", user);
    const to = getEnv("FEEDBACK_TO") || getEnv("SMTP_TO") || user;

    if (!host || !user || !pass || !from || !to) {
      return NextResponse.json(
        {
          error:
            "SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM and FEEDBACK_TO.",
        },
        { status: 501 }
      );
    }

    // ⚠️ Import dynamique pour éviter une résolution au build côté client
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true si 465 (SSL)
      auth: { user, pass },
    });

    const ua = req.headers.get("user-agent") || "-";
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "-";

    const stars = "★".repeat(safeRating);
    const safeMsg = sanitizeText(rawMessage);
    const safeFrom = sanitizeText(fromEmail || "(not provided)");

    const subject = `DocSafe feedback ${stars} from ${fromEmail || "anonymous"}`;
    const html = `
      <h2>New DocSafe feedback</h2>
      <p><strong>Rating:</strong> ${stars}</p>
      <p><strong>From:</strong> ${safeFrom}</p>
      <p><strong>Message:</strong><br>${safeMsg.replace(/\n/g, "<br>")}</p>
      <hr>
      <small>
        Sent at ${new Date().toISOString()}<br>
        UA: ${sanitizeText(ua)}<br>
        IP: ${sanitizeText(ip)}
      </small>
    `;
    const text = [
      "New DocSafe feedback",
      `Rating: ${safeRating}`,
      `From: ${fromEmail || "(not provided)"}`,
      "Message:",
      rawMessage,
      "",
      `Sent at ${new Date().toISOString()}`,
      `UA: ${ua}`,
      `IP: ${ip}`,
    ].join("\n");

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
      replyTo: fromEmail || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to send email" }, { status: 500 });
  }
}

