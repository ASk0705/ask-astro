export async function onRequestPost() {
  const cookie = `session=deleted; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Set-Cookie': cookie, 'Content-Type':'application/json' }});
}
