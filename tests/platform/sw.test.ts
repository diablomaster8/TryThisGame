import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

/**
 * TECH-43: `public/sw.js` run against a hand-made ServiceWorkerGlobalScope (Node already has
 * Request, Response and URL). The fakes keep only what the worker touches: a Map-backed
 * CacheStorage, a fetch spy, and events that record `respondWith` and `waitUntil`.
 */
const ORIGIN = 'https://grove.test';
const SRC = readFileSync(join(__dirname, '..', '..', 'public', 'sw.js'), 'utf8').replaceAll(
  '__GROVE_BUILD_ID__',
  'new',
);
const HASHED_URL = `${ORIGIN}/assets/index-B2x9fQ1a.js`;

const urlOf = (r: Request | string): string =>
  typeof r === 'string' ? new URL(r, `${ORIGIN}/`).href : r.url;

class FakeCache {
  readonly store = new Map<string, Response>();
  match(r: Request | string): Promise<Response | undefined> {
    return Promise.resolve(this.store.get(urlOf(r))?.clone());
  }
  put(r: Request | string, res: Response): Promise<void> {
    this.store.set(urlOf(r), res);
    return Promise.resolve();
  }
  addAll(rs: Request[]): Promise<void> {
    for (const r of rs) this.store.set(urlOf(r), new Response('shell'));
    return Promise.resolve();
  }
  keys(): Promise<Request[]> {
    return Promise.resolve([...this.store.keys()].map((u) => new Request(u)));
  }
}

function boot(opts: { active?: boolean; network?: (req: Request) => Promise<Response> } = {}) {
  const caches = new Map<string, FakeCache>();
  const storage = {
    open: (n: string) => {
      if (!caches.has(n)) caches.set(n, new FakeCache());
      return Promise.resolve(caches.get(n)!);
    },
    keys: () => Promise.resolve([...caches.keys()]),
    delete: (n: string) => Promise.resolve(caches.delete(n)),
  };
  const listeners = new Map<string, (e: unknown) => void>();
  const self = {
    location: { origin: ORIGIN },
    registration: { active: opts.active ? {} : null },
    skipWaiting: vi.fn(() => Promise.resolve()),
    clients: { claim: vi.fn(() => Promise.resolve()) },
    addEventListener: (type: string, fn: (e: unknown) => void) => listeners.set(type, fn),
  };
  const fetch = vi.fn(
    (r: Request | string) =>
      opts.network?.(typeof r === 'string' ? new Request(r) : r) ??
      Promise.resolve(new Response('net')),
  );
  // A worker resolves relative URLs against its own location; Node's Request needs a base.
  class ScopedRequest extends Request {
    constructor(url: string, init?: RequestInit) {
      super(new URL(url, `${ORIGIN}/`).href, init);
    }
  }
  new Function('self', 'caches', 'fetch', 'Request', SRC)(self, storage, fetch, ScopedRequest);

  /** Fires one event; resolves once every waitUntil and respondWith promise has settled. */
  async function fire(type: string, extra: Record<string, unknown> = {}) {
    const waits: Promise<unknown>[] = [];
    let response: Promise<Response> | undefined;
    listeners.get(type)!({
      ...extra,
      waitUntil: (p: Promise<unknown>) => waits.push(p),
      respondWith: (p: Promise<Response>) => (response = p),
    });
    const res = response ? await response : undefined;
    await Promise.allSettled(waits);
    return res;
  }
  const get = (url: string, init: RequestInit = {}, mode = 'no-cors') => {
    const request = new Request(url, init);
    Object.defineProperty(request, 'mode', { value: mode });
    return fire('fetch', { request });
  };
  return { caches, self, fetch, fire, get };
}

describe('service worker (TECH-43)', () => {
  it('names its cache after the build and takes over at once only as the first worker', async () => {
    const first = boot();
    await first.fire('install');
    expect([...first.caches.keys()]).toEqual(['grove-new']);
    expect(first.caches.get('grove-new')!.store.has(`${ORIGIN}/index.html`)).toBe(true);
    expect(first.self.skipWaiting).toHaveBeenCalledTimes(1);

    const update = boot({ active: true });
    await update.fire('install');
    expect(update.self.skipWaiting).not.toHaveBeenCalled();
    await update.fire('message', { data: { type: 'skip-waiting' } });
    expect(update.self.skipWaiting).toHaveBeenCalledTimes(1);
  });

  it('serves navigations network first, and the cached shell only when offline', async () => {
    let online = true;
    const sw = boot({
      network: () =>
        online ? Promise.resolve(new Response('fresh')) : Promise.reject(new Error()),
    });
    await sw.fire('install');
    expect(await (await sw.get(`${ORIGIN}/`, {}, 'navigate'))!.text()).toBe('fresh');
    online = false;
    const offline = await sw.get(`${ORIGIN}/?debug`, {}, 'navigate');
    expect(await offline!.text()).toBe('shell');
  });

  it('serves hashed chunks cache first, without touching the network', async () => {
    const sw = boot();
    const cache = new FakeCache();
    await cache.put(HASHED_URL, new Response('cached chunk'));
    sw.caches.set('grove-new', cache);
    const res = await sw.get(HASHED_URL);
    expect(await res!.text()).toBe('cached chunk');
    expect(sw.fetch).not.toHaveBeenCalled();
  });

  it('leaves range requests, other origins and non-GETs to the browser', async () => {
    const sw = boot();
    expect(await sw.get(`${ORIGIN}/music/theme.ogg`, { headers: { range: 'bytes=0-' } })).toBe(
      undefined,
    );
    expect(await sw.get('https://elsewhere.test/a.js')).toBe(undefined);
    expect(await sw.get(`${ORIGIN}/x`, { method: 'POST' })).toBe(undefined);
    expect(sw.fetch).not.toHaveBeenCalled();
  });

  it('never stores a partial (206) answer', async () => {
    const sw = boot({ network: () => Promise.resolve(new Response('part', { status: 206 })) });
    await sw.get(HASHED_URL);
    expect(sw.caches.get('grove-new')?.store.has(HASHED_URL)).toBe(false);
  });

  it('carries hashed chunks over from the old cache, drops it, and spares foreign caches', async () => {
    const sw = boot({ active: true });
    const old = new FakeCache();
    await old.put(HASHED_URL, new Response('old chunk'));
    await old.put(`${ORIGIN}/index.html`, new Response('old shell'));
    sw.caches.set('grove-old', old);
    sw.caches.set('someone-else', new FakeCache());
    await sw.fire('activate');
    expect([...sw.caches.keys()].sort()).toEqual(['grove-new', 'someone-else']);
    const now = sw.caches.get('grove-new')!;
    expect(await (await now.match(HASHED_URL))!.text()).toBe('old chunk');
    expect(now.store.has(`${ORIGIN}/index.html`)).toBe(false);
    expect(sw.self.clients.claim).toHaveBeenCalled();
  });
});
