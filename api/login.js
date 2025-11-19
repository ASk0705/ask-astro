export async function onRequestPost({ request, env }) {
  const { email, password } = await request.json().catch(()=>({}));
  if (!email || !password) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 });
  const storedRaw = await env.USERS.get(email);
  if (!storedRaw) return new Response(JSON.stringify({ error: 'invalid' }), { status: 401 });
  const stored = JSON.parse(storedRaw);
  const hash = await sha256Hex(password);
  if (hash !== stored.password_hash) return new Response(JSON.stringify({ error: 'invalid' }), { status: 401 });
  const token = crypto.randomUUID();
  await env.SESSIONS.put(token, email, { expirationTtl: 60*60*24*7 });
  const cookie = `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60*60*24*7}`;
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Set-Cookie': cookie, 'Content-Type':'application/json' }});
}
async function sha256Hex(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
