/**
 * R0344 (FUN-55): freezes the voice-over line ids. A recording is named for a line's id, so
 * the id must outlive edits. This keeps `docs/vo-ids.json`, a manifest of every scripted
 * line's frozen id (`<scene id>-<n>`, n handed out once and never reused), and rewrites it
 * so that ids follow their text: a line whose text is still in the scene keeps its id even if
 * lines were added or moved; an edited line keeps its id when it is the only change; a new
 * line gets the scene's next number. It also writes `src/content/vo-frozen.ts`, the ids for
 * the lines recorded first (Hazel's letter and sprout chapter 1), which the game looks up by
 * text so a clip plays only while the line still says what was recorded.
 *
 *   npx tsx tests/tools/vo-freeze.ts            report what would change
 *   npx tsx tests/tools/vo-freeze.ts --write    update the manifest and the recorded-first table
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as C from '../../src/content/index';
import type { Line, Scene } from '../../src/config/story';
import type { EduScene, Quest } from '../../src/content/types';
import { lineHash } from '../../src/content/vo-hash';
import { packs } from './quest-packs';

export interface SceneLines {
  id: string;
  audience: string;
  lines: Line[];
}

/** Manifest entry: the next number to hand out, and `hash:n` for each line in play order. */
export interface Entry {
  next: number;
  lines: string[];
}
export type Manifest = { version: 1; scenes: Record<string, Entry> };

const linesOf = (s: { lines: Line[]; choices?: { then?: Line[] }[] | undefined }): Line[] => [
  ...s.lines,
  ...(s.choices ?? []).flatMap((c) => c.then ?? []),
];

function questScenes(q: Quest): Scene[] {
  return [...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]), q.complete];
}

/** Every scripted scene: the campaign, the quest packs, and both Learning Grove bands. */
export function allScenes(): SceneLines[] {
  const out: SceneLines[] = [];
  for (const s of C.CAMPAIGN_SCENES) out.push({ id: s.id, audience: 'main', lines: linesOf(s) });
  for (const list of Object.values(packs))
    for (const q of list)
      for (const s of questScenes(q))
        out.push({ id: s.id, audience: q.audience, lines: linesOf(s) });
  for (const band of C.EDU_BANDS) {
    const all: EduScene[] = [
      ...C.EDU_CAMPAIGN[band].flatMap((c) => c.scenes),
      ...C.EDU_QUESTS[band].flatMap((q) => q.scenes),
      ...C.EDU_VARIANTS[band],
    ];
    for (const e of all) out.push({ id: e.id, audience: band, lines: linesOf(e) });
  }
  return out;
}

/**
 * The frozen ids for a scene's lines now, given its old entry (or none): exact text matches
 * first, then edited lines paired in order when as many old lines vanished as new ones came,
 * then fresh numbers. Returns the ids in play order and the updated entry.
 */
export function assignIds(
  sceneId: string,
  lines: readonly Line[],
  old: Entry | undefined,
): { ids: string[]; entry: Entry } {
  const hashes = lines.map((l) => lineHash(l.text));
  const ids: (string | null)[] = lines.map((l) => l.id ?? null);
  let next = old?.next ?? 0;
  const pool = new Map<string, number[]>();
  const oldList = (old?.lines ?? []).map((e) => {
    const [h, n] = e.split(':');
    return { h: h!, n: Number(n) };
  });
  for (const o of oldList) pool.set(o.h, [...(pool.get(o.h) ?? []), o.n]);
  const used = new Set<number>();
  const free = (i: number): boolean => ids[i] === null;
  // 1. Same text keeps its number (in order, for repeated lines).
  hashes.forEach((h, i) => {
    if (!free(i)) return;
    const n = pool.get(h)?.shift();
    if (n !== undefined) {
      ids[i] = `${sceneId}-${n}`;
      used.add(n);
    }
  });
  // 2. Edited lines: the old numbers that vanished pair with the new texts, in order, only when
  // the counts agree (so an insert or a delete never hands a line the wrong recording).
  const vanished = oldList.filter((o) => !used.has(o.n));
  const fresh = hashes.map((_, i) => i).filter(free);
  if (vanished.length === fresh.length) {
    fresh.forEach((i, k) => {
      ids[i] = `${sceneId}-${vanished[k]!.n}`;
      used.add(vanished[k]!.n);
    });
  }
  // 3. The rest are new.
  hashes.forEach((_, i) => {
    if (!free(i)) return;
    ids[i] = `${sceneId}-${next++}`;
  });
  const number = (id: string): number => Number(id.slice(id.lastIndexOf('-') + 1));
  const entry: Entry = {
    next: Math.max(next, ...ids.map((id) => number(id!) + 1), 0),
    lines: ids.map((id, i) => `${hashes[i]}:${number(id!)}`),
  };
  return { ids: ids as string[], entry };
}

export const MANIFEST = path.resolve('docs/vo-ids.json');

export function loadManifest(file = MANIFEST): Manifest {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as Manifest;
  } catch {
    return { version: 1, scenes: {} };
  }
}

/** The manifest as it should be now (scenes that were removed keep their entry). */
export function refreshed(scenes: readonly SceneLines[], old: Manifest): Manifest {
  const next: Manifest = { version: 1, scenes: { ...old.scenes } };
  for (const s of scenes) next.scenes[s.id] = assignIds(s.id, s.lines, old.scenes[s.id]).entry;
  return next;
}

/** Hazel's letter and sprout chapter 1: the lines recorded first. */
export function recordedFirst(scenes: readonly SceneLines[]): SceneLines[] {
  return scenes.filter(
    (s) => s.id === 'c1-letter' || (s.audience === 'sprout' && /^sprout:c1-/.test(s.id)),
  );
}

function frozenTable(scenes: readonly SceneLines[], m: Manifest): string {
  const rows: string[] = [];
  const seen = new Set<string>();
  for (const s of recordedFirst(scenes)) {
    const { ids } = assignIds(s.id, s.lines, m.scenes[s.id]);
    s.lines.forEach((l, i) => {
      const h = lineHash(l.text);
      if (seen.has(h)) return;
      seen.add(h);
      rows.push(`  '${h}': '${ids[i]}',`);
    });
  }
  return [
    '/**',
    " * R0344 (FUN-55): frozen voice-over ids for the lines recorded first (Hazel's letter and",
    ' * sprout chapter 1), by the hash of the line text. Generated by `tests/tools/vo-freeze.ts',
    ' * --write`; do not edit by hand. The game looks a line up by its text, so a clip plays only',
    ' * while the line still says what was recorded.',
    ' */',
    'export const VO_FROZEN: Record<string, string> = {',
    ...rows,
    '};',
    '',
  ].join('\n');
}

if (/vo-freeze\.ts$/.test(process.argv[1] ?? '')) {
  const scenes = allScenes();
  const old = loadManifest();
  const next = refreshed(scenes, old);
  const count = (m: Manifest): number =>
    Object.values(m.scenes).reduce((n, e) => n + e.lines.length, 0);
  console.log(`scenes ${scenes.length}; frozen lines ${count(old)} -> ${count(next)}`);
  if (process.argv.includes('--write')) {
    fs.writeFileSync(MANIFEST, JSON.stringify(next) + '\n');
    fs.writeFileSync(path.resolve('src/content/vo-frozen.ts'), frozenTable(scenes, next));
    console.log('wrote docs/vo-ids.json and src/content/vo-frozen.ts');
  }
}
