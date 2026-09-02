const CACHE_NAME = "desk-v2";
const PRECACHE_MANIFEST = "/precache.json";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const response = await fetch(PRECACHE_MANIFEST);

      if (!response.ok) {
        throw new Error("Could not load the precache manifest");
      }

      const urls = await response.json();
      await cache.addAll([PRECACHE_MANIFEST, ...urls]);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => name.startsWith("desk-") && name !== CACHE_NAME).map((name) => caches.delete(name)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  );
});
