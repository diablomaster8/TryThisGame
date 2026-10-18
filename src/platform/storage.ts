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

export function clearSlot(slot: SaveSlot): boolean {
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
  /** Sim time lived in this Grove. */
  playMs: number;
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
    const edu = (w.edu ?? null) as { age?: unknown } | null;
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
      playMs: typeof w.timeMs === 'number' ? w.timeMs : 0,
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
    return true;
  } catch {
    return false;
  }
}

export function clearSave(): boolean {
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
export function readGraphicsPref(): 'pixel' | '3d' {
  try {
    return localStorage.getItem(GRAPHICS_KEY) === '3d' ? '3d' : 'pixel';
  } catch {
    return 'pixel';
  }
}

export function writeGraphicsPref(mode: 'pixel' | '3d'): boolean {
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
