/**
 * R0344 (FUN-55): the voice-over script as CSV, one row per line: id, speaker, mood, text,
 * note, audience. A line's own `id` wins; otherwise its id is the frozen one from
 * `docs/vo-ids.json` (`vo-freeze.ts`), which follows the line's text through edits and inserts. The casting sheet is `docs/vo-casting.md`.
 *
 *   npx tsx tests/tools/vo-export.ts > vo.csv          the whole script
 *   npx tsx tests/tools/vo-export.ts --who hazel       one speaker
 */
import { allScenes, assignIds, loadManifest, type Manifest } from './vo-freeze';

export interface VoRow {
  id: string;
  speaker: string;
  mood: string;
  text: string;
  note: string;
  audience: string;
}

/** Every scripted line in the campaign, the quest packs and both Learning Grove bands, with frozen ids. */
export function voRows(manifest: Manifest = loadManifest()): VoRow[] {
  return allScenes().flatMap((s) => {
    const { ids } = assignIds(s.id, s.lines, manifest.scenes[s.id]);
    return s.lines.map((l, n) => ({
      id: ids[n]!,
      speaker: l.who,
      mood: l.mood ?? 'neutral',
      text: l.text,
      note: l.vo?.note ?? '',
      audience: s.audience,
    }));
  });
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
