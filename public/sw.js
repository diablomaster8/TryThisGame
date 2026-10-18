/* Grove service worker: install-to-home-screen and offline play after the first load.
   The cache name carries the build id, which the `sw-build-id` plugin in vite.config.ts
   writes in at build time, so every deploy installs a new worker and drops the old cache.
   Navigations go to the network first, so a deploy is picked up on the next load; the
   cached shell is only the offline fallback. Other same-origin GETs are hashed chunks or
   static files and are served stale-while-revalidate. */
const CACHE = 'grove-__GROVE_BUILD_ID__';
const SHELL = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  // Only our own caches: anything else on the origin is not ours to delete.
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k.startsWith('grove-') && k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(req.mode === 'navigate' ? navigate(req) : staleWhileRevalidate(req));
});

/** Network first; the cached page, then the cached shell, only when offline. */
async function navigate(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const cached = (await cache.match(req)) ?? (await cache.match('./index.html'));
    return cached ?? new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => undefined);
  if (cached) {
    void network;
    return cached;
  }
  const res = await network;
  return res ?? new Response('Offline', { status: 503, statusText: 'Offline' });
}
