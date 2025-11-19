export async function onRequestPost({ request, env }) {
  const { email, password } = await request.json().catch(()=>({}));
  if (!email || !password) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 });
  const pwHash = await sha256Hex(password);
  const existing = await env.USERS.get(email);
  if (existing) return new Response(JSON.stringify({ error: 'exists' }), { status: 409 });
  const user = { email, password_hash: pwHash, created_at: new Date().toISOString() };
  await env.USERS.put(email, JSON.stringify(user));
  return new Response(JSON.stringify({ ok: true }), { status: 201, headers: { 'Content-Type':'application/json' }});
}
async function sha256Hex(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
