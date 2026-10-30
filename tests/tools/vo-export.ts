/**
 * R0344 (FUN-55): the voice-over script as CSV, one row per line: id, speaker, mood, text,
 * note, audience. A line's own `id` wins; otherwise it is keyed `<scene id>-<n>` by its
 * place in the scene (choice replies follow the main lines), so ids hold while a scene's
 * lines are only edited, not added or moved. The casting sheet is `docs/vo-casting.md`.
 *
 *   npx tsx tests/tools/vo-export.ts > vo.csv          the whole script
 *   npx tsx tests/tools/vo-export.ts --who hazel       one speaker
 */
import * as C from '../../src/content/index';
import type { Line, Scene } from '../../src/config/story';
import type { Quest } from '../../src/content/types';
import { packs } from './quest-packs';

export interface VoRow {
  id: string;
  speaker: string;
  mood: string;
  text: string;
  note: string;
  audience: string;
}

function sceneRows(s: Scene, audience: string): VoRow[] {
  const ls: Line[] = [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])];
  return ls.map((l, n) => ({
    id: l.id ?? `${s.id}-${n}`,
    speaker: l.who,
    mood: l.mood ?? 'neutral',
    text: l.text,
    note: l.vo?.note ?? '',
    audience,
  }));
}

function questScenes(q: Quest): Scene[] {
  return [...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]), q.complete];
}

/** Every scripted line in the campaign and the quest packs. */
export function voRows(): VoRow[] {
  const rows: VoRow[] = [];
  for (const s of C.CAMPAIGN_SCENES) rows.push(...sceneRows(s, 'main'));
  for (const list of Object.values(packs))
    for (const q of list) for (const s of questScenes(q)) rows.push(...sceneRows(s, q.audience));
  return rows;
}

const cell = (v: string): string => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function voCsv(rows: readonly VoRow[]): string {
  const head = 'id,speaker,mood,text,note,audience';
  return [
    head,
    ...rows.map((r) => [r.id, r.speaker, r.mood, r.text, r.note, r.audience].map(cell).join(',')),
  ].join('\n');
}

if (/vo-export\.ts$/.test(process.argv[1] ?? '')) {
  const at = process.argv.indexOf('--who');
  const who = at > 0 ? process.argv[at + 1] : undefined;
  const rows = voRows().filter((r) => !who || r.speaker === who);
  process.stdout.write(voCsv(rows) + '\n');
}
