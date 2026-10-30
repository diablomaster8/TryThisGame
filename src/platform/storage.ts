/**
 * localStorage behind try/catch. Private browsing, blocked storage and quota errors
 * must never crash the game; they just mean nothing is kept.
 *
 * Saves live in slots: three per mode (the campaign, the Free Grove, the Learning
 * Grove). Slot 1 of each mode keeps the key the game used before slots existed, so
 * nobody loses a Grove.
 */
import { SAVE_SAFETY } from '../config/tuning';
import type { SideWorld } from '../sim/side-saves';
import { mirrorDelete, mirrorReadAll, mirrorWrite, newerCopy } from './save-mirror';

export type SaveMode = 'free' | 'campaign' | 'edu' | StorylineMode;

/** The separate campaigns' modes (sim/storyline.ts): S1, S2, S3 and S4's two halves. */
export type StorylineMode = 'hundred' | 'logged' | 'beetle' | 'dawndusk';
export const STORYLINE_MODES: readonly StorylineMode[] = [
  'hundred',
  'logged',
  'beetle',
  'dawndusk',
];

export function isStorylineMode(mode: SaveMode): mode is StorylineMode {
  return (STORYLINE_MODES as readonly string[]).includes(mode);
}

export const SLOTS_PER_MODE = 3;

export interface SaveSlot {
  mode: SaveMode;
  /** 1-based. */
  index: number;
}

const LEGACY_KEYS: Record<SaveMode, string> = {
  free: 'grove.save.v1',
  campaign: 'grove.save.campaign',
  edu: 'grove.save.edu',
  hundred: 'grove.save.hundred',
  logged: 'grove.save.logged',
  beetle: 'grove.save.beetle',
  dawndusk: 'grove.save.dawndusk',
};

export function slotKey(slot: SaveSlot): string {
  const index = Math.max(1, Math.min(SLOTS_PER_MODE, Math.floor(slot.index) || 1));
  return index === 1 ? LEGACY_KEYS[slot.mode] : `grove.save.${slot.mode}.${index}`;
}

let current: SaveSlot = { mode: 'free', index: 1 };
let SAVE_KEY = slotKey(current);

/** Which save the game reads and writes. */
export function setSaveSlot(slot: SaveSlot): void {
  current = { mode: slot.mode, index: slot.index };
  SAVE_KEY = slotKey(current);
}

export function currentSlot(): SaveSlot {
  return { ...current };
}

export function hasSave(slot: SaveSlot): boolean {
  try {
    return localStorage.getItem(slotKey(slot)) !== null;
  } catch {
    return false;
  }
}

function mirrorKey(slot: SaveSlot): string {
  return `${slot.mode}:${Math.max(1, Math.min(SLOTS_PER_MODE, Math.floor(slot.index) || 1))}`;
}

/**
 * Once at boot, before any slot is read: puts back any IndexedDB copy that is newer than
 * (or missing from) localStorage, which a browser may have cleared. Never throws.
 */
export async function restoreFromMirror(): Promise<number> {
  let restored = 0;
  try {
    for (const { key, json } of await mirrorReadAll()) {
      const [mode, idx] = key.split(':');
      const index = Number(idx);
      if (!mode || !(mode in LEGACY_KEYS) || !Number.isInteger(index)) continue;
      try {
        const lsKey = slotKey({ mode: mode as SaveMode, index });
        if (newerCopy(localStorage.getItem(lsKey), json) === 'mirror') {
          localStorage.setItem(lsKey, json);
          restored += 1;
        }
      } catch {
        // Blocked localStorage: nothing to restore into.
      }
    }
  } catch {
    // No mirror.
  }
  return restored;
}

export function clearSlot(slot: SaveSlot): boolean {
  mirrorDelete(mirrorKey(slot));
  try {
    localStorage.removeItem(slotKey(slot));
    return true;
  } catch {
    return false;
  }
}

/** Copy one slot's save over another (same mode or not). */
export function copySlot(from: SaveSlot, to: SaveSlot): boolean {
  try {
    const json = localStorage.getItem(slotKey(from));
    if (json === null) return false;
    localStorage.setItem(slotKey(to), json);
    mirrorWrite(mirrorKey(to), json);
    return true;
  } catch {
    return false;
  }
}

/** What the title screen shows for a slot, read from the save without loading it. */
export interface SaveSummary {
  savedAtWallMs: number;
  nubbins: number;
  /** The first few Nubbin names. */
  names: string[];
  trainer: string | null;
  chapter: number | null;
  /** A separate campaign's id and its ending, once reached. */
  storyline: string | null;
  ending: string | null;
  eduAge: number | null;
  /** The Learning Grove band: a `reader` save shows 7–10, not its games' top age. */
  eduBand: string | null;
  /** Sim time lived in this Grove. */
  playMs: number;
  /** Lane C r8 (R0648): the questlines beside Hazel's Grove, and side stories and capers done. */
  lines?: Record<string, 'active' | 'done'>;
  questsDone?: number;
}

/** R0648: the lines and the finished quests a save holds, read defensively from its JSON. */
function storySummary(w: Record<string, unknown>): Pick<SaveSummary, 'lines' | 'questsDone'> {
  const lines: Record<string, 'active' | 'done'> = {};
  const raw = (w.lines ?? {}) as Record<string, { ending?: unknown } | null>;
  if (raw && typeof raw === 'object')
    for (const [id, l] of Object.entries(raw))
      if (l && typeof l === 'object') lines[id] = typeof l.ending === 'string' ? 'done' : 'active';
  const c = (w.campaign ?? null) as { side?: unknown; fun?: unknown } | null;
  let questsDone = 0;
  for (const store of [c?.side, c?.fun])
    if (store && typeof store === 'object')
      for (const st of Object.values(store as Record<string, { status?: unknown }>))
        if (st?.status === 'done') questsDone += 1;
  return { lines, questsDone };
}

/** Pure: a summary from a save's JSON, or null when it cannot be read. */
export function summarize(json: string): SaveSummary | null {
  try {
    const data = JSON.parse(json) as { savedAtWallMs?: unknown; world?: unknown };
    const w = (data.world ?? null) as Record<string, unknown> | null;
    if (!w || typeof w !== 'object') return null;
    const nubbins = Array.isArray(w.nubbins) ? (w.nubbins as Array<{ name?: unknown }>) : [];
    const campaign = (w.campaign ?? null) as {
      chapter?: unknown;
      storyline?: unknown;
      ending?: unknown;
    } | null;
    const edu = (w.edu ?? null) as { age?: unknown; band?: unknown } | null;
    return {
      savedAtWallMs: typeof data.savedAtWallMs === 'number' ? data.savedAtWallMs : 0,
      nubbins: nubbins.length,
      names: nubbins
        .map((n) => (typeof n.name === 'string' ? n.name : ''))
        .filter((n) => n.length > 0)
        .slice(0, 3),
      trainer: typeof w.trainer === 'string' ? w.trainer : null,
      chapter: campaign && typeof campaign.chapter === 'number' ? campaign.chapter : null,
      storyline: campaign && typeof campaign.storyline === 'string' ? campaign.storyline : null,
      ending: campaign && typeof campaign.ending === 'string' ? campaign.ending : null,
      eduAge: edu && typeof edu.age === 'number' ? edu.age : null,
      eduBand: edu && typeof edu.band === 'string' ? edu.band : null,
      playMs: typeof w.timeMs === 'number' ? w.timeMs : 0,
      ...storySummary(w),
    };
  } catch {
    return null;
  }
}

export function readSlotSummary(slot: SaveSlot): SaveSummary | null {
  try {
    const json = localStorage.getItem(slotKey(slot));
    return json === null ? null : summarize(json);
  } catch {
    return null;
  }
}

/** Has storyline `id` reached an ending in any slot of `mode` (Dawn unlocks Dusk and back). */
export function storylineFinished(mode: SaveMode, id: string): boolean {
  for (let index = 1; index <= SLOTS_PER_MODE; index++) {
    const s = readSlotSummary({ mode, index });
    if (s && s.storyline === id && s.ending !== null) return true;
  }
  return false;
}

export function readSave(): string | null {
  try {
    return localStorage.getItem(SAVE_KEY);
  } catch {
    return null;
  }
}

export function writeSave(json: string): boolean {
  try {
    localStorage.setItem(SAVE_KEY, json);
    mirrorWrite(mirrorKey(current), json);
    return true;
  } catch {
    return false;
  }
}

export function clearSave(): boolean {
  mirrorDelete(mirrorKey(current));
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

// ---------- unreadable saves ----------

/**
 * A save that fails to load (corrupt, or from a newer version of the game) is copied
 * beside its slot before the game starts fresh, so the autosave never destroys the only
 * copy. Fixed rotating keys rather than timestamps: no key listing is needed, and a
 * reload of the same broken save does not push an older copy out.
 */
export function unreadableKey(slot: SaveSlot, n: number): string {
  return `${slotKey(slot)}.unreadable.${n}`;
}

/** Keep `json` as the newest unreadable copy for `slot`. False when storage refused it. */
export function backupUnreadable(slot: SaveSlot, json: string): boolean {
  try {
    if (localStorage.getItem(unreadableKey(slot, 1)) === json) return true;
    for (let n = SAVE_SAFETY.unreadableKept; n > 1; n--) {
      const older = localStorage.getItem(unreadableKey(slot, n - 1));
      if (older !== null) localStorage.setItem(unreadableKey(slot, n), older);
    }
    localStorage.setItem(unreadableKey(slot, 1), json);
    return true;
  } catch {
    return false;
  }
}

/** The unreadable copies kept for `slot`, newest first. */
export function readUnreadable(slot: SaveSlot): string[] {
  const out: string[] = [];
  for (let n = 1; n <= SAVE_SAFETY.unreadableKept; n++) {
    try {
      const json = localStorage.getItem(unreadableKey(slot, n));
      if (json !== null) out.push(json);
    } catch {
      // Blocked storage reads as nothing kept.
    }
  }
  return out;
}

/**
 * Pure: which mode a save's world belongs to, so an import cannot put a campaign into a
 * Learning Grove slot. The Learning Grove wins over its own story; a separate campaign
 * names its storyline (Dawn and Dusk share one mode); any other story is Hazel's Grove.
 */
export function modeOfWorld(world: {
  edu?: unknown;
  campaign?: { storyline?: unknown } | null;
}): SaveMode {
  if (world.edu) return 'edu';
  const campaign = world.campaign;
  if (!campaign) return 'free';
  const storyline = campaign.storyline;
  if (storyline === 'dawn' || storyline === 'dusk') return 'dawndusk';
  if (typeof storyline === 'string' && isStorylineMode(storyline as SaveMode)) {
    return storyline as StorylineMode;
  }
  return 'campaign';
}

/**
 * Calls `onChange` when another tab writes or clears the slot this tab plays (the browser
 * fires `storage` only in the other tabs). Returns a function that stops listening.
 */
export function watchOtherTabs(onChange: () => void): () => void {
  const listener = (e: StorageEvent): void => {
    // A null key means another tab cleared all of storage.
    if (e.key === SAVE_KEY || e.key === null) onChange();
  };
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}

/**
 * Lane C r7 (R0658): say "this slot is mine" to every other tab of the game, at once rather
 * than after the first autosave. A tab already on the same slot hears it and calls `onTaken`
 * (it stops saving and says so); tabs on other slots ignore it. The newest tab wins, so two
 * tabs on one slot never both write. Without BroadcastChannel the storage-event watch above
 * still covers it.
 */
export function claimSlot(onTaken: () => void): () => void {
  if (typeof BroadcastChannel === 'undefined') return () => undefined;
  let channel: BroadcastChannel;
  try {
    channel = new BroadcastChannel('grove-slots');
  } catch {
    return () => undefined;
  }
  const me = `${Date.now()}-${Math.floor(performance.now() * 1000)}`;
  channel.onmessage = (e: MessageEvent<{ key?: string; from?: string }>) => {
    if (e.data?.key === SAVE_KEY && e.data.from !== me) onTaken();
  };
  try {
    channel.postMessage({ key: SAVE_KEY, from: me });
  } catch {
    // A closed or unavailable channel leaves the storage-event watch in charge.
  }
  return () => channel.close();
}

export function storageAvailable(): boolean {
  try {
    const probe = `${SAVE_KEY}.probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Offer a text file for download. */
export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Ask the user for a file and read it as text. Resolves null if cancelled. */
export function pickTextFile(accept = 'application/json,.json'): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      file
        .text()
        .then((t) => resolve(t))
        .catch(() => resolve(null));
    });
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

// ---------- device-wide preferences ----------

const GRAPHICS_KEY = 'grove.graphics';

/**
 * The renderer chosen on the title screen: a device-wide preference, because it is
 * picked before any save is open. The save's `settings.graphics` mirrors it.
 */
const RESUME_KEY = 'grove.resume';

/**
 * Remember the slot in play across one reload (a Graphics change), so the game comes back
 * to it instead of the title. Session storage: it never outlives the tab.
 */
export function markResumeSlot(slot: SaveSlot): void {
  try {
    sessionStorage.setItem(RESUME_KEY, JSON.stringify(slot));
  } catch {
    // No session storage: the reload lands on the title, as before.
  }
}

/** The slot marked before a reload, once; null when there is none or it is not a real slot. */
export function takeResumeSlot(): SaveSlot | null {
  try {
    const raw = sessionStorage.getItem(RESUME_KEY);
    sessionStorage.removeItem(RESUME_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<SaveSlot>;
    if (typeof s.mode !== 'string' || !(s.mode in LEGACY_KEYS) || typeof s.index !== 'number')
      return null;
    const slot = { mode: s.mode as SaveMode, index: s.index };
    return hasSave(slot) ? slot : null;
  } catch {
    return null;
  }
}

/**
 * The renderer picked in this page's life. With storage blocked the pick cannot be written,
 * but the game it starts must still use it, not silently fall back to Pixel (review D, 13).
 */
let graphicsChoice: 'pixel' | '3d' | null = null;

export function readGraphicsPref(): 'pixel' | '3d' {
  if (graphicsChoice) return graphicsChoice;
  try {
    return localStorage.getItem(GRAPHICS_KEY) === '3d' ? '3d' : 'pixel';
  } catch {
    return 'pixel';
  }
}

export function writeGraphicsPref(mode: 'pixel' | '3d'): boolean {
  graphicsChoice = mode;
  try {
    localStorage.setItem(GRAPHICS_KEY, mode);
    return true;
  } catch {
    return false;
  }
}

// ---------- the side saves (canon 21, 29, 30) ----------

/**
 * The Atlas, Pixel's Arcade, the Multiverse and Neopia each keep one save of their own on this
 * device, apart from every Grove slot above. They may read a Grove save; nothing here
 * ever writes one.
 */
export type SideSave = SideWorld;

export const SIDE_SAVES: readonly SideSave[] = ['atlas', 'arcade', 'multiverse', 'neopia'];

export function sideKey(which: SideSave): string {
  return `grove.side.${which}`;
}

export function readSide(which: SideSave): string | null {
  try {
    return localStorage.getItem(sideKey(which));
  } catch {
    return null;
  }
}

export function writeSide(which: SideSave, json: string): boolean {
  try {
    localStorage.setItem(sideKey(which), json);
    return true;
  } catch {
    return false;
  }
}

export function clearSide(which: SideSave): boolean {
  try {
    localStorage.removeItem(sideKey(which));
    return true;
  } catch {
    return false;
  }
}

/** Every Grove save on this device that a side save may read (never the Learning Grove). */
export function readGroveSaves(): string[] {
  const out: string[] = [];
  for (const mode of ['free', 'campaign'] as const) {
    for (let index = 1; index <= SLOTS_PER_MODE; index++) {
      try {
        const json = localStorage.getItem(slotKey({ mode, index }));
        if (json !== null) out.push(json);
      } catch {
        // Blocked storage reads as no save.
      }
    }
  }
  return out;
}
