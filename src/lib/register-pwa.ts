function isBlockedHost(hostname: string) {
  return hostname.startsWith("id-preview--") || hostname.startsWith("preview--") || hostname === "lovableproject.com" || hostname.endsWith(".lovableproject.com") || hostname === "lovableproject-dev.com" || hostname.endsWith(".lovableproject-dev.com") || hostname === "beta.lovable.dev" || hostname.endsWith(".beta.lovable.dev");
}

async function unregister() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.filter((r) => r.active?.scriptURL.endsWith("/sw.js") || r.installing?.scriptURL.endsWith("/sw.js") || r.waiting?.scriptURL.endsWith("/sw.js")).map((r) => r.unregister()));
}

export async function registerPwa() {
  if (!("serviceWorker" in navigator)) return;
  const blocked = !import.meta.env.PROD || window.self !== window.top || isBlockedHost(window.location.hostname) || new URLSearchParams(window.location.search).has("sw") && new URLSearchParams(window.location.search).get("sw") === "off";
  if (blocked) { await unregister(); return; }
  await navigator.serviceWorker.register("/sw.js");
}