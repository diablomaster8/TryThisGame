/* Grove service worker: install-to-home-screen and offline play after the first load.
   The cache name carries the build id, which the `sw-build-id` plugin in vite.config.ts
   writes in at build time, so every deploy installs a new worker and drops the old cache.
   Navigations go to the network first, so a deploy is picked up on the next load; the
   cached shell is only the offline fallback. Hashed build chunks under assets/ never change
   under the same name, so they are served cache-first; other static files are served
   stale-while-revalidate. The shell is precached with cache: 'reload' so the install never
   stores a stale copy from the HTTP cache.
   Updates apply on the next load, never mid-play: the first worker takes over at once, but
   a new one waits while open pages run on the old worker and its cache (so their lazy
   chunks keep loading), and takes over only when a freshly loaded page, already running
   the new build, posts 'skip-waiting' (main.ts `applyWaitingWorker`). On taking over it
   carries the hashed chunks over from the old cache, which are the same files by name. */
const CACHE = 'grove-__GROVE_BUILD_ID__';
const SHELL = ['./', './index.html', './manifest.webmanifest'];
/** Vite's content-hashed output, e.g. assets/index-B2x9fQ1a.js. */
const HASHED = /\/assets\/[^/]+-[\w-]{8,}\.\w+$/;
/**
 * Hashed chunks never change under one name, so a stored copy fits any request for it: a
 * host's `Vary: Origin` would otherwise miss when a crossorigin module script asks for a
 * copy that was stored from a plain fetch.
 */
const ANY = { ignoreVary: true };

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache
          .addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })))
          .catch(() => undefined),
      )
      // Only the very first worker takes over straight away; an update waits (see above).
      .then(() => (self.registration.active ? undefined : self.skipWaiting())),
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'skip-waiting') self.skipWaiting();
  // The page lists the build chunks it loaded before this worker was in control.
  else if (data.type === 'cache-urls' && Array.isArray(data.urls)) {
    event.waitUntil(cacheUrls(data.urls));
  }
  // R0520: the page asks which of its lazy chunks this cache holds, so it can grey out the
  // story worlds that cannot open offline. Each entry is a full URL, or a hashed chunk's
  // stem ending in '-' (".../assets/atlas-catalogue-"), which matches any hash of it.
  else if (data.type === 'has-urls' && Array.isArray(data.urls) && event.ports[0]) {
    const port = event.ports[0];
    event.waitUntil(
      hasUrls(data.urls).then(
        (has) => port.postMessage({ type: 'has-urls', has }),
        () => port.postMessage({ type: 'has-urls', has: null }),
      ),
    );
  }
});

/** For each asked URL or stem, whether this worker's cache holds it. */
async function hasUrls(urls) {
  const cache = await caches.open(CACHE);
  const keys = (await cache.keys()).map((r) => r.url);
  return urls.slice(0, 50).map((u) => {
    if (typeof u !== 'string') return false;
    if (!u.endsWith('-')) return keys.includes(u);
    return keys.some((k) => k.startsWith(u) && HASHED.test(new URL(k).pathname));
  });
}

/** Fetch and keep the listed hashed chunks this cache does not hold yet (same origin only). */
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE);
  for (const url of urls.slice(0, 400)) {
    try {
      const u = new URL(url);
      if (u.origin !== self.location.origin || !HASHED.test(u.pathname)) continue;
      if (await cache.match(u.href, ANY)) continue;
      const res = await fetch(u.href);
      if (res.ok && res.status !== 206) await cache.put(u.href, res);
    } catch {
      // Offline or gone: it is fetched again the next time the page asks for it.
    }
  }
}

self.addEventListener('activate', (event) => {
  // Only our own caches: anything else on the origin is not ours to delete.
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        const old = keys.filter((k) => k.startsWith('grove-') && k !== CACHE);
        return carryOver(old).then(() => Promise.all(old.map((k) => caches.delete(k))));
      })
      .then(() => self.clients.claim()),
  );
});

/** Copy the old caches' hashed chunks (same name, same bytes) so offline play keeps them. */
async function carryOver(oldNames) {
  const cache = await caches.open(CACHE);
  for (const name of oldNames) {
    try {
      const old = await caches.open(name);
      for (const req of await old.keys()) {
        if (!HASHED.test(new URL(req.url).pathname) || (await cache.match(req, ANY))) continue;
        const res = await old.match(req, ANY);
        if (res) await cache.put(req, res).catch(() => undefined);
      }
    } catch {
      // A cache that cannot be read is simply dropped.
    }
  }
}

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
  const cached = await cache.match(req, ANY);
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
