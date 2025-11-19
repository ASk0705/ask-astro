export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(()=>({}));
  if (!body || !Array.isArray(body.cart)) return new Response(JSON.stringify({ error: 'bad' }), { status: 400 });
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/session=([^;]+)/);
  const session = m ? m[1] : null;
  if (!session) return new Response(JSON.stringify({ error: 'not_authenticated' }), { status: 401 });
  const email = await env.SESSIONS.get(session);
  if (!email) return new Response(JSON.stringify({ error: 'not_authenticated' }), { status: 401 });
  const key = `cart:${email}`;
  await env.CARTS.put(key, JSON.stringify(body.cart));
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type':'application/json' }});
}
export async function onRequestGet({ request, env }) {
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/session=([^;]+)/);
  const session = m ? m[1] : null;
  if (!session) return new Response(JSON.stringify({ error: 'not_authenticated' }), { status: 401 });
  const email = await env.SESSIONS.get(session);
  if (!email) return new Response(JSON.stringify({ error: 'not_authenticated' }), { status: 401 });
  const key = `cart:${email}`;
  const raw = await env.CARTS.get(key);
  return new Response(JSON.stringify({ cart: raw ? JSON.parse(raw) : [] }), { headers: { 'Content-Type':'application/json' }});
}
