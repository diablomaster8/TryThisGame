/* Grove service worker: install-to-home-screen and offline play after the first load.
   The cache name carries the build id, which the `sw-build-id` plugin in vite.config.ts
   writes in at build time, so every deploy installs a new worker and drops the old cache.
   Navigations go to the network first, so a deploy is picked up on the next load; the
   cached shell is only the offline fallback. Hashed build chunks under assets/ never change
   under the same name, so they are served cache-first; other static files are served
   stale-while-revalidate. The shell is precached with cache: 'reload' so the install never
   stores a stale copy from the HTTP cache. */
const CACHE = 'grove-__GROVE_BUILD_ID__';
const SHELL = ['./', './index.html', './manifest.webmanifest'];
/** Vite's content-hashed output, e.g. assets/index-B2x9fQ1a.js. */
const HASHED = /\/assets\/[^/]+-[\w-]{8,}\.\w+$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache
          .addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })))
          .catch(() => undefined),
      )
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
  // Range requests (audio, video) get partial 206 answers: the cache can neither store nor
  // serve those, so they go straight to the network.
  if (req.headers.has('range')) return;
  if (req.mode === 'navigate') event.respondWith(navigate(event, req));
  else if (HASHED.test(new URL(req.url).pathname)) event.respondWith(cacheFirst(event, req));
  else event.respondWith(staleWhileRevalidate(event, req));
});

/** Network first; the cached page, then the cached shell, only when offline. */
async function navigate(event, req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    store(event, cache, req, res);
    return res;
  } catch {
    const cached = (await cache.match(req)) ?? (await cache.match('./index.html'));
    return cached ?? new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

/** A hashed chunk's content never changes, so the cached copy is always right. */
async function cacheFirst(event, req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    store(event, cache, req, res);
    return res;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(event, req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      store(event, cache, req, res);
      return res;
    })
    .catch(() => undefined);
  // The refresh outlives the answer when a cached copy is served: keep the worker up for it.
  event.waitUntil(network);
  if (cached) {
    return cached;
  }
  const res = await network;
  return res ?? new Response('Offline', { status: 503, statusText: 'Offline' });
}

/**
 * Keep a copy of a whole, good answer. A failed write (quota, a 206 partial answer) must
 * never reject the fetch or go unhandled, and the worker stays alive until it is done.
 */
function store(event, cache, req, res) {
  if (!res || !res.ok || res.status === 206) return;
  const put = cache.put(req, res.clone()).catch(() => undefined);
  try {
    event.waitUntil(put);
  } catch {
    // The event has already settled; the write still finishes while the worker is up.
  }
}
