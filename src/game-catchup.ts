/** Offline catch-up and checkpoint keeping (TECH-37), split out of game.ts. */
import { SIM } from './config/tuning';
import { currentSlot } from './platform/storage';
import { catchUpInChunks } from './sim/offline';
import { serialize } from './sim/save';
import type { SimEvent } from './sim/types';
import { slotId } from './platform/storage';
import { armPersistRequest } from './platform/persist';
import { takeBackup, writeCheckpoint } from './platform/save-backups';
import { chapterKeysOf, hasCheckpoint } from './sim/story-marks';
import { currentChapterKeys } from './sim/chapter-select';
import type { Game } from './game';

/**
 * Catch the world up in chunks, yielding to the browser between them so the indicator
 * paints and a week away does not freeze the page (review C, item 12). The sim does not
 * step and nothing is saved until it finishes, so a half-done catch-up is never written.
 */
export async function runCatchUp(g: Game, elapsedMs: number, now: number): Promise<void> {
  const world = g.world;
  if (elapsedMs < 5000) {
    world.lastWallMs = now;
    return;
  }
  g.catchingUp = true;
  const start = performance.now();
  let shown = false;
  // Lane C r11 (R0619): chapters begun while away get a checkpoint too (the snapshot
  // taken once catch-up ends: the first one this device has of them).
  const chaptersBefore = currentChapterKeys(world);
  try {
    const run = catchUpInChunks(world, elapsedMs, now);
    let sliceStart = start;
    for (;;) {
      const next = run.next();
      if (next.done) {
        // A quick reload is not "being away": only report real absences or actual news.
        const report = next.value;
        if (report.simulatedMs > 0 && (report.events.length > 0 || elapsedMs > SIM.coarseAfterMs)) {
          // Nubbins waiting for the Keeper meet their end-of-life check in front of the
          // player, not under this screen: the sim holds the checks until it closes.
          g.send({ kind: 'holdEndOfLife', hold: true });
          g.hooks.onAway(report, () => g.send({ kind: 'holdEndOfLife', hold: false }));
        } else if (report.simulatedMs === 0) {
          g.hooks.onBreak?.(elapsedMs);
        }
        break;
      }
      // Most catch-ups finish in one slice; past a short budget, show the indicator and
      // give the browser a frame to paint it before carrying on.
      if (performance.now() - sliceStart < SIM.catchUpSliceMs) continue;
      if (!shown) {
        shown = true;
        g.hooks.onCatchUpStart();
      }
      await nextPaint();
      sliceStart = performance.now();
    }
  } finally {
    g.catchingUp = false;
    if (shown) g.hooks.onCatchUpEnd();
  }
  const begun = currentChapterKeys(world).filter((k) => !chaptersBefore.includes(k));
  if (begun.length > 0) keepCheckpoints(g, [], begun);
}

/**
 * Lane C r10 agent B (R0619, CAMP-27): the first snapshot of each chapter goes to
 * IndexedDB, with a backup beside it; the sim records the key once the write succeeded.
 * Without IndexedDB nothing is kept and the game runs on.
 */
export function keepCheckpoints(g: Game, events: SimEvent[], begun?: string[]): void {
  if (g.holdSaves || g.crashed || g.visiting) return;
  // R0623 (CAMP-31): past the first chapter, ask the browser to keep the storage (once).
  if (events.some((e) => e.kind === 'chapter' && e.chapter >= 2)) armPersistRequest();
  const keys = (begun ?? chapterKeysOf(events, g.world)).filter((k) => !hasCheckpoint(g.world, k));
  if (keys.length === 0) return;
  const slot = slotId(currentSlot());
  const json = serialize(g.world, Date.now());
  void takeBackup(slot, json, Date.now(), true);
  for (const key of keys)
    void writeCheckpoint(slot, key, json).then((id) => {
      if (id) g.send({ kind: 'checkpointKept', key, id });
    });
}

/**
 * Resolves after the browser has had a chance to paint: the next animation frame, or a
 * short timeout in a hidden tab where frames never come.
 */
function nextPaint(): Promise<void> {
  return new Promise((done) => {
    let settled = false;
    const finish = (): void => {
      if (settled) return;
      settled = true;
      setTimeout(done, 0);
    };
    requestAnimationFrame(finish);
    setTimeout(finish, 50);
  });
}
