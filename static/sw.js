const CACHE_NAME = "desk-v6";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
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

      if (cached) return cached;

      const response = await fetch(event.request);
      const url = new URL(event.request.url);

      if (
        url.origin === self.location.origin &&
        response.status === 200 &&
        !event.request.headers.has("range")
      ) {
        try {
          await cache.put(event.request, response.clone());
        } catch (error) {
          console.warn("Could not cache response", event.request.url, error);
        }
      }

      return response;
    })(),
  );
});
