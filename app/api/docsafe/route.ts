import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Récupère le backend défini dans .env.local
    const backendUrl =
      process.env.NEXT_PUBLIC_DOCSAFE_BACKEND_URL ||
      process.env.DOCSAFE_BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_DOCSAFE_BACKEND_URL" },
        { status: 500 }
      );
    }

    // Récupère le form data envoyé par le frontend
    const formData = await req.formData();
    const file = formData.get("file");
    const mode = formData.get("mode") || "correct";
    const lang = formData.get("lang") || "auto";
    const strictPdf = formData.get("strictPdf") || "false";

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing or invalid file in form data" },
        { status: 400 }
      );
    }

    // Envoie vers ton backend Render (V1 uniquement ici)
    const upstream = `${backendUrl}/clean`;

    const upstreamForm = new FormData();
    upstreamForm.append("file", file);
    upstreamForm.append("lang", lang);
    upstreamForm.append("strictPdf", strictPdf);

    const res = await fetch(upstream, {
      method: "POST",
      body: upstreamForm,
    });

    // Gestion d’erreur backend
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Backend error: ${res.status} - ${errText}` },
        { status: res.status }
      );
    }

    // Retourne le ZIP (cleaned + report)
    const blob = await res.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="docsafe_v1_result.zip"',
      },
    });
  } catch (err: any) {
    console.error("DocSafe API proxy error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // simple route de ping pour tester la connexion backend
  const backendUrl =
    process.env.NEXT_PUBLIC_DOCSAFE_BACKEND_URL ||
    process.env.DOCSAFE_BACKEND_URL;

  return NextResponse.json({
    ok: true,
    backend: backendUrl || null,
  });
}


