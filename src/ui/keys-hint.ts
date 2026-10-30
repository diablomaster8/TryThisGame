/**
 * TECH-60: the desktop keys hint goes for good once the player has used the keys it teaches
 * (moving, turning the camera, the zoom wheel), or after 90 s on screen. The answer is kept
 * per device in `grove.keysHintSeen`; storage failures just mean it can show again.
 */
const KEY = 'grove.keysHintSeen';
const SHOW_MS = 90_000;

let done = ((): boolean => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
})();

export function keysHintDone(): boolean {
  return done;
}

function finish(): void {
  done = true;
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // Not remembered: it shows again next visit.
  }
}

/** Start watching for the three kinds of use. */
export function watchKeysHint(target: Window = window): void {
  if (done) return;
  const used = { move: false, turn: false, zoom: false };
  const check = (): void => {
    if (used.move && used.turn && used.zoom) stop();
  };
  const onKey = (e: KeyboardEvent): void => {
    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k))
      used.move = true;
    if (k === 'q' || k === 'e') used.turn = true;
    check();
  };
  const onWheel = (): void => {
    used.zoom = true;
    check();
  };
  const timer = target.setTimeout(() => stop(), SHOW_MS);
  function stop(): void {
    finish();
    target.clearTimeout(timer);
    target.removeEventListener('keydown', onKey);
    target.removeEventListener('wheel', onWheel);
  }
  target.addEventListener('keydown', onKey);
  target.addEventListener('wheel', onWheel, { passive: true });
}
