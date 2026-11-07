/**
 * R0345 (FUN-56): the localisation extraction. Writes one JSON catalogue per audience (main,
 * all, teen, adult, sprout, reader and so on) with a source entry for every scripted line,
 * keyed by its frozen voice-over id (`vo-export.ts`, so the rows and their ids are shared with
 * the recording script), plus the UI's ICU catalogue (`config/messages-en.ts`). Each entry
 * carries the speaker, the mood and, when the line has one, the translator note `tn`.
 *
 *   npx tsx tests/tools/l10n-extract.ts --out l10n         one JSON file per audience
 *   npx tsx tests/tools/l10n-extract.ts --stats            only the counts
 *
 * First slice only: the XLIFF form, the `tn` and `pun` tags on the wordplay lines, and the
 * conversion of the other UI templates are still to do (see PROGRESS.md).
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MESSAGES_EN, MESSAGE_NOTES } from '../../src/config/messages-en';
import { voRows, type VoRow } from './vo-export';

export interface Unit {
  source: string;
  speaker: string;
  mood: string;
  tn?: string;
  /** The joke rests on English wordplay; a translator may replace it. */
  pun?: boolean;
}

/** The units per audience, keyed by id. A line's `vo.note` doubles as its note until `tn` lands. */
export function extract(rows: readonly VoRow[] = voRows()): Record<string, Record<string, Unit>> {
  const out: Record<string, Record<string, Unit>> = {};
  for (const r of rows) {
    const unit: Unit = { source: r.text, speaker: r.speaker, mood: r.mood };
    const tn = r.tn ?? r.note;
    if (tn) unit.tn = tn;
    if (r.pun) unit.pun = true;
    (out[r.audience] ??= {})[r.id] = unit;
  }
  return out;
}

/** The UI catalogue as translator units. */
export function uiUnits(): Record<string, { source: string; tn?: string }> {
  const out: Record<string, { source: string; tn?: string }> = {};
  for (const [k, v] of Object.entries(MESSAGES_EN)) {
    const tn = MESSAGE_NOTES[k as keyof typeof MESSAGES_EN];
    out[`ui.${k}`] = tn ? { source: v, tn } : { source: v };
  }
  return out;
}

if (/l10n-extract\.ts$/.test(process.argv[1] ?? '')) {
  const by = extract();
  const stats = Object.entries(by).map(([a, m]) => `${a} ${Object.keys(m).length}`);
  console.log(`audiences: ${stats.join(', ')}; ui messages ${Object.keys(uiUnits()).length}`);
  const at = process.argv.indexOf('--out');
  if (at > 0) {
    const dir = path.resolve(process.argv[at + 1] ?? 'l10n');
    fs.mkdirSync(dir, { recursive: true });
    for (const [a, m] of Object.entries(by))
      fs.writeFileSync(path.join(dir, `${a}.json`), JSON.stringify(m, null, 1) + '\n');
    fs.writeFileSync(path.join(dir, 'ui.json'), JSON.stringify(uiUnits(), null, 1) + '\n');
    console.log(`wrote ${dir}`);
  }
}
