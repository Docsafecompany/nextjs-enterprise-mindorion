// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { rating, message, email } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length < 3) {
      return NextResponse.json({ error: "Message is too short." }, { status: 400 });
    }
    const safeRating = Math.max(1, Math.min(Number(rating) || 5, 5));

    // SMTP depuis .env.local
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to   = process.env.FEEDBACK_TO;

    if (!host || !user || !pass || !to) {
      return NextResponse.json({ error: "SMTP not configured on server." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true si 465
      auth: { user, pass },
    });

    const subject = `DocSafe feedback ${"★".repeat(safeRating)} from ${email || "anonymous"}`;
    const html = `
      <h2>New DocSafe feedback</h2>
      <p><strong>Rating:</strong> ${"★".repeat(safeRating)}</p>
      <p><strong>From:</strong> ${email || "(not provided)"} </p>
      <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      <hr>
      <small>Sent ${new Date().toISOString()}</small>
    `;

    await transporter.sendMail({
      from: `"DocSafe Feedback" <${user}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to send email" }, { status: 500 });
  }
}

