/**
 * Asks the browser to keep the Grove's storage (`navigator.storage.persist()`), once, at
 * the first gesture after a hatch. The answer is kept in `grove.persist` so the request is
 * never repeated. Everything is feature-detected and wrapped.
 */
const KEY = 'grove.persist';
let armed = false;

function alreadyAsked(): boolean {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return true; // No storage to record in: do not ask on every hatch.
  }
}

/** Called on a hatch: the next pointer gesture makes the request. */
export function armPersistRequest(): void {
  if (armed || alreadyAsked()) return;
  armed = true;
  const go = (): void => {
    window.removeEventListener('pointerup', go);
    window.removeEventListener('keydown', go);
    void requestPersist();
  };
  window.addEventListener('pointerup', go, { passive: true });
  window.addEventListener('keydown', go, { passive: true });
}

async function requestPersist(): Promise<void> {
  try {
    if (alreadyAsked() || typeof navigator === 'undefined' || !navigator.storage?.persist) return;
    const granted = await navigator.storage.persist();
    try {
      localStorage.setItem(KEY, granted ? 'granted' : 'denied');
    } catch {
      // Unrecorded: it may be asked once more next session.
    }
  } catch {
    // Unsupported or refused.
  }
}

/** Whether the browser promises to keep the storage; null when it cannot say. */
export async function persisted(): Promise<boolean | null> {
  try {
    if (typeof navigator === 'undefined' || !navigator.storage?.persisted) return null;
    return await navigator.storage.persisted();
  } catch {
    return null;
  }
}
