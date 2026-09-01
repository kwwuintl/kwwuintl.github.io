const CACHE_NAME = "desk-v2";
const PRECACHE_MANIFEST = "/precache.json";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const response = await fetch(PRECACHE_MANIFEST, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load the precache manifest");

      const urls = await response.json();
      await cache.addAll([PRECACHE_MANIFEST, ...urls]);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith("desk-") && name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(async (cached) => {
      if (cached) return cached;

      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      }
      return response;
    }),
  );
});
