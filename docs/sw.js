const CACHE_NAME = "blodsukkerdagbok-v10";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

function skyBlueTheme(text) {
  return text
    .replaceAll("#126b63", "#38bdf8")
    .replaceAll("#0b4f49", "#0284c7")
    .replaceAll("rgba(18,107,99,.14)", "rgba(56,189,248,.18)")
    .replaceAll("#b7d9d4", "#bae6fd")
    .replaceAll("#eff9f7", "#f0f9ff")
    .replaceAll("#e8f4f2", "#e0f2fe")
    .replaceAll("#8bc8bf", "#7dd3fc")
    .replaceAll("#f4fbfa", "#f0f9ff")
    .replaceAll("#16836f", "#0284c7");
}

async function themedResponse(response) {
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;
  const text = skyBlueTheme(await response.text());
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(text, { status: response.status, statusText: response.statusText, headers });
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    try {
      const network = await fetch(event.request);
      const response = await themedResponse(network);
      if (event.request.url.startsWith(self.location.origin)) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    } catch {
      const cached = await caches.match(event.request) || await caches.match("./index.html");
      return cached ? themedResponse(cached) : Response.error();
    }
  })());
});
