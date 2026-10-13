/**
 * localStorage behind try/catch. Private browsing, blocked storage and quota errors
 * must never crash the game; they just mean nothing is kept.
 */
export type SaveSlot = 'free' | 'campaign';

const KEYS: Record<SaveSlot, string> = { free: 'grove.save.v1', campaign: 'grove.save.campaign' };

let SAVE_KEY = KEYS.free;

/** Which save the game reads and writes: the Free Grove or the campaign. */
export function setSaveSlot(slot: SaveSlot): void {
  SAVE_KEY = KEYS[slot];
}

export function hasSave(slot: SaveSlot): boolean {
  try {
    return localStorage.getItem(KEYS[slot]) !== null;
  } catch {
    return false;
  }
}

export function clearSlot(slot: SaveSlot): boolean {
  try {
    localStorage.removeItem(KEYS[slot]);
    return true;
  } catch {
    return false;
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
