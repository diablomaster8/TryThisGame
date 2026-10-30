/**
 * R0563 (SOUL-46): what each Nubbin did lately, for the stats sheet's "Recently" lines: its
 * favourite fruit found, a trip or a sneeze, a pat for a sad friend (given or received), a
 * "boo" (given or received), a new friend, a slip and a bonk. The last five per Nubbin,
 * newest last, in the save as an optional field (no version bump). Live play only.
 */
import { DIARY } from '../config/tuning';
import type { Nubbin, SimEvent, World } from './types';

export type DiaryKind =
  | 'yum'
  | 'bleh'
  | 'trip'
  | 'sneeze'
  | 'hiccup'
  | 'comforted'
  | 'wasComforted'
  | 'pranked'
  | 'wasPranked'
  | 'friend'
  | 'bonked'
  | 'cheeredUp';

export interface DiaryEntry {
  kind: DiaryKind;
  otherId?: string;
  atMs: number;
}

function note(world: World, id: string, kind: DiaryKind, otherId?: string): void {
  const n = world.nubbins.find((x) => x.id === id);
  if (!n) return;
  const d = (n.diary ??= []);
  const last = d.at(-1);
  // The same thing twice in a row inside a minute is one line.
  if (last && last.kind === kind && last.otherId === otherId && world.timeMs - last.atMs < 60_000)
    return;
  d.push({ kind, ...(otherId ? { otherId } : {}), atMs: world.timeMs });
  if (d.length > DIARY.keep) d.splice(0, d.length - DIARY.keep);
}

/** Note this step's events in the diaries they belong to. */
export function stepDiary(world: World, events: readonly SimEvent[], offline: boolean): void {
  if (offline) return;
  for (const e of events) {
    switch (e.kind) {
      case 'fruitTaste':
        note(world, e.nubbinId, e.taste);
        break;
      case 'antic':
        if (e.antic !== 'chaseTail') note(world, e.nubbinId, e.antic);
        break;
      case 'comforted':
        note(world, e.nubbinId, 'comforted', e.markId);
        note(world, e.markId, 'wasComforted', e.nubbinId);
        break;
      case 'pranked':
        note(world, e.nubbinId, 'pranked', e.markId);
        note(world, e.markId, 'wasPranked', e.nubbinId);
        break;
      case 'friendsMade':
        note(world, e.a, 'friend', e.b);
        note(world, e.b, 'friend', e.a);
        break;
      case 'bonked':
        note(world, e.nubbinId, 'bonked');
        break;
      case 'moodyCleared':
        note(world, e.nubbinId, 'cheeredUp');
        break;
    }
  }
}

/** The last `count` entries, newest first. */
export function recently(n: Nubbin, count: number = DIARY.show): DiaryEntry[] {
  return (n.diary ?? []).slice(-count).reverse();
}
