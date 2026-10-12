// Guest notes for the invitation, stored in Netlify Blobs (no database to set up).
import { getStore } from "@netlify/blobs";

const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, n);

export default async (req) => {
  const store = getStore("de-palma-notes");
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (req.method === "GET") {
    const notes = (await store.get("all", { type: "json" })) || [];
    return new Response(JSON.stringify({ notes }), { headers });
  }
  if (req.method === "POST") {
    let body = {};
    try { body = await req.json(); } catch (e) {}
    const text = clean(body.text, 280);
    if (!text) return new Response(JSON.stringify({ error: "empty" }), { status: 400, headers });
    const note = { id: clean(body.id, 40) || Date.now().toString(36), text, name: clean(body.name, 40), t: Date.now() };
    const notes = (await store.get("all", { type: "json" })) || [];
    notes.unshift(note);
    await store.setJSON("all", notes.slice(0, 500));
    return new Response(JSON.stringify({ note }), { headers });
  }
  if (req.method === "DELETE") {
    /* owner only: set ADMIN_KEY in Netlify → Site configuration → Environment variables */
    const key = (globalThis.Netlify && Netlify.env.get("ADMIN_KEY")) || process.env.ADMIN_KEY || "";
    if (!key || req.headers.get("x-admin-key") !== key) return new Response(JSON.stringify({ error: "key" }), { status: 401, headers });
    const id = new URL(req.url).searchParams.get("id");
    const notes = (await store.get("all", { type: "json" })) || [];
    await store.setJSON("all", notes.filter((n) => n.id !== id));
    return new Response(JSON.stringify({ ok: true }), { headers });
  }
  return new Response("Method not allowed", { status: 405 });
};
