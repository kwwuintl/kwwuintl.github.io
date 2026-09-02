const CACHE_NAME = "desk-v3";
const PRECACHE_MANIFEST = "/precache.json";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const response = await fetch(PRECACHE_MANIFEST, { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Could not load the precache manifest");
      }

      const manifest = await response.clone().json();

      if (!Array.isArray(manifest) || !manifest.every((url) => typeof url === "string")) {
        throw new TypeError("The precache manifest must be an array of URLs");
      }

      const urls = [...new Set(manifest)].filter((url) => url !== PRECACHE_MANIFEST);
      await cache.put(PRECACHE_MANIFEST, response);
      await cache.addAll(urls);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      const obsoleteNames = names.filter(
        (name) => name.startsWith("desk-") && name !== CACHE_NAME,
      );

      await Promise.all(obsoleteNames.map((name) => caches.delete(name)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request, {
        ignoreSearch: event.request.mode === "navigate",
      });

      return cached || fetch(event.request);
    })(),
  );
});
