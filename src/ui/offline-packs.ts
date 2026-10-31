/**
 * R0461 (TECH-20): "Keep for offline play". The build writes `offline-manifest.json` (see
 * vite.config.ts `offlineManifest`): per pack (Story, Learning Grove, Story worlds), the
 * files it needs and their bytes. Ticking a pack hands that list to the service worker
 * (`cache-urls`, public/sw.js), which downloads what it lacks and answers how many it now
 * holds; unticking sends `drop-urls`. The ticked packs are a device preference, posted
 * again on every load so a new build's hashed files are kept too, together with the pack
 * the slot in play needs (a Learning Grove save keeps its band, a story save its scripts).
 */
import { OFFLINE_PACK_TEXT } from '../config/strings-r10d4';
import { OFFLINE_PACKS } from '../config/tuning-r10d4';
import { el } from './dom';

/** `core` (the workers and the sprite manifest) is always kept and has no tick box. */
export type PackId = 'story' | 'edu' | 'worlds' | 'core';
const PACK_IDS: readonly PackId[] = ['story', 'edu', 'worlds'];
const KEY = 'grove.offlinePacks';

interface Manifest {
  packs: Partial<Record<PackId, { files: string[]; bytes: number }>>;
}

let manifest: Promise<Manifest | null> | null = null;

function loadManifest(): Promise<Manifest | null> {
  // Offline there is nothing to download, so not even the list is asked for.
  if (navigator.onLine === false) return Promise.resolve(null);
  manifest ??= fetch(`${import.meta.env.BASE_URL}offline-manifest.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : null))
    .catch(() => null)
    .then((m) => {
      // Not there (dev) or offline: ask again next time.
      if (!m) manifest = null;
      return m;
    });
  return manifest;
}

export function keptPacks(): PackId[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]') as unknown;
    return Array.isArray(raw) ? PACK_IDS.filter((p) => raw.includes(p)) : [];
  } catch {
    return [];
  }
}

function writeKept(ids: PackId[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Storage blocked: the tick lasts this page only.
  }
}

function urlsOf(m: Manifest, id: PackId): string[] {
  const base = new URL(import.meta.env.BASE_URL, location.origin);
  return (m.packs[id]?.files ?? []).map((f) => new URL(f, base).href);
}

function worker(): ServiceWorker | null {
  return typeof navigator !== 'undefined' ? (navigator.serviceWorker?.controller ?? null) : null;
}

/** Hand one pack to the worker; resolves to how many of its files the cache holds. */
function post(
  id: PackId,
  m: Manifest,
  sw: ServiceWorker | null = worker(),
): Promise<{ held: number; of: number } | null> {
  const urls = urlsOf(m, id);
  if (!sw || urls.length === 0) return Promise.resolve(null);
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => resolve(null), OFFLINE_PACKS.replyMs);
    channel.port1.onmessage = (e: MessageEvent<{ held?: number; of?: number }>) => {
      window.clearTimeout(timer);
      resolve({ held: Number(e.data?.held) || 0, of: Number(e.data?.of) || urls.length });
    };
    try {
      sw.postMessage({ type: 'cache-urls', urls }, [channel.port2]);
    } catch {
      window.clearTimeout(timer);
      resolve(null);
    }
  });
}

/**
 * On each load (main.ts, once the worker is in control): keep the ticked packs and the
 * one the slot in play needs. Quiet: nothing shows, and offline it does nothing.
 */
export function refreshOfflinePacks(sw: ServiceWorker | null, slotNeeds: PackId | null): void {
  // On a first visit the worker is active but not yet in control: post to it directly.
  if (!sw || navigator.onLine === false) return;
  const ids = new Set<PackId>(['core', ...keptPacks()]);
  if (slotNeeds) ids.add(slotNeeds);
  void loadManifest().then((m) => {
    if (!m) return;
    // One pack at a time, so the worker's fetches never compete with play for long.
    void [...ids].reduce<Promise<unknown>>(
      (p, id) => p.then(() => post(id, m, sw)),
      Promise.resolve(),
    );
  });
}

/** The Settings > Saves rows: one tick box per pack, with its size and state. */
export function mountOfflinePacks(parent: HTMLElement): void {
  const box = el('div', 'offline-packs');
  box.append(
    el('strong', undefined, OFFLINE_PACK_TEXT.heading),
    el('p', 'help', OFFLINE_PACK_TEXT.help),
  );
  const note = el('p', 'help', OFFLINE_PACK_TEXT.unavailable);
  note.hidden = true;
  box.appendChild(note);
  parent.appendChild(box);
  const kept = new Set(keptPacks());
  const rows: { id: PackId; input: HTMLInputElement; state: HTMLElement }[] = [];
  for (const id of PACK_IDS) {
    const row = el('label', 'check-row');
    const input = el('input');
    input.type = 'checkbox';
    input.checked = kept.has(id);
    input.dataset.pack = id;
    const text = el('span');
    const size = el('small');
    const state = el('small', 'offline-pack-state');
    text.append(el('strong', undefined, OFFLINE_PACK_TEXT.packs[id] ?? id), size, state);
    row.append(input, text);
    box.appendChild(row);
    rows.push({ id, input, state });
    input.addEventListener('change', () => void toggle(id, input, state));
  }
  const sync = (m: Manifest | null): void => {
    const usable = !!m && !!worker();
    note.hidden = usable;
    for (const r of rows) {
      r.input.disabled = !usable;
      const bytes = m?.packs[r.id]?.bytes;
      const small = r.state.previousElementSibling;
      if (small) small.textContent = bytes ? OFFLINE_PACK_TEXT.size(bytes / 1048576) : '';
      if (usable && r.input.checked && !r.state.textContent)
        r.state.textContent = OFFLINE_PACK_TEXT.kept;
    }
  };
  sync(null);
  void loadManifest().then(sync);
}

async function toggle(id: PackId, input: HTMLInputElement, state: HTMLElement): Promise<void> {
  const ids = new Set(keptPacks());
  const m = await loadManifest();
  if (!m) return;
  if (!input.checked) {
    ids.delete(id);
    writeKept([...ids]);
    state.textContent = '';
    worker()?.postMessage({ type: 'drop-urls', urls: urlsOf(m, id) });
    return;
  }
  ids.add(id);
  writeKept([...ids]);
  state.textContent = OFFLINE_PACK_TEXT.saving;
  const res = await post(id, m);
  if (!input.checked) return;
  state.textContent =
    res && res.held >= res.of
      ? OFFLINE_PACK_TEXT.kept
      : OFFLINE_PACK_TEXT.partial(res?.held ?? 0, res?.of ?? urlsOf(m, id).length);
}
