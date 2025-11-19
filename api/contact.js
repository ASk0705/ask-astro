export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(()=>({}));
  if (!body || !body.email || !body.message) return new Response(JSON.stringify({ error: 'invalid' }), { status: 400 });
  const id = crypto.randomUUID();
  await env.CARTS.put(`contact:${id}`, JSON.stringify({ id, ...body, created_at: new Date().toISOString() }));
  const listRaw = await env.CARTS.get('contacts_index');
  const list = listRaw ? JSON.parse(listRaw) : [];
  list.push(id);
  await env.CARTS.put('contacts_index', JSON.stringify(list));
  return new Response(JSON.stringify({ ok:true, id }), { headers: { 'Content-Type':'application/json' }});
}
