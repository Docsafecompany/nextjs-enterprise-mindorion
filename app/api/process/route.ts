export const runtime = 'nodejs';
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export async function POST(req: Request) {
  if (!BACKEND) return new Response(JSON.stringify({ error: 'Missing NEXT_PUBLIC_BACKEND_URL' }), { status: 500 });
  const inForm = await req.formData();
  const mode = String(inForm.get('mode') || 'v1').toLowerCase();
  const strictPdf = String(inForm.get('strictPdf') || 'true');

  const out = new FormData();
  for (const [k, v] of inForm.entries()) if (k === 'file' && v instanceof File) out.append('file', v, v.name);
  out.append('strictPdf', strictPdf);

  const endpoint = mode === 'v2' ? '/clean-v2' : '/clean';
  const resp = await fetch(`${BACKEND}${endpoint}`, { method: 'POST', body: out, cache: 'no-store' });
  if (!resp.ok) {
    const text = await resp.text();
    return new Response(JSON.stringify({ error: text || `HTTP ${resp.status}` }), { status: 500 });
  }
  const headers = new Headers(resp.headers);
  headers.set('Cache-Control', 'no-store');
  return new Response(resp.body, { status: 200, headers });
}
