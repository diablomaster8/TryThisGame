/**
 * localStorage behind try/catch. Private browsing, blocked storage and quota errors
 * must never crash the game; they just mean nothing is kept.
 *
 * Saves live in slots: three per mode (the campaign, the Free Grove, the Learning
 * Grove). Slot 1 of each mode keeps the key the game used before slots existed, so
 * nobody loses a Grove.
 */
export type SaveMode = 'free' | 'campaign' | 'edu';

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
    const campaign = (w.campaign ?? null) as { chapter?: unknown } | null;
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
