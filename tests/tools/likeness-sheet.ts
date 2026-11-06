/**
 * LOOK-68 (R0436): prints the likeness reference sheet (`render/sprites/likeness.ts`) as a
 * plain-text contact sheet, one block per figure: silhouette, key colours, must-have parts
 * and body plan. No dependencies beyond the repo. An artist or agent tuning a species runs it
 * and checks the drawing against the block.
 *
 *   npx tsx tests/tools/likeness-sheet.ts                 every species and Chao form
 *   npx tsx tests/tools/likeness-sheet.ts --family chao   one family: chao, pocket, digi
 *   npx tsx tests/tools/likeness-sheet.ts --filter fire   ids or names containing "fire"
 *   npx tsx tests/tools/likeness-sheet.ts --ids gengar,first-sun-run
 *   add --colour for truecolour swatches in a terminal
 */
import { likenessOf } from '../../src/render/sprites/likeness';
import { chaoLikenessIds } from '../../src/render/sprites/likeness-chao';
import { SPECIES } from '../../src/sim/species';
import { SPECIES_LABELS } from '../../src/config/strings';

export interface SheetOptions {
  family?: string;
  filter?: string;
  ids?: string[];
  colour?: boolean;
}

interface Entry {
  id: string;
  family: string;
  label: string;
}

/** Every figure a sheet can be printed for: the species, then the Chao forms. */
export function sheetEntries(): Entry[] {
  const out: Entry[] = [];
  for (const s of SPECIES) {
    if (s.id === 'chao') continue;
    if (likenessOf(s.id))
      out.push({ id: s.id, family: s.family, label: SPECIES_LABELS[s.id] ?? s.id });
  }
  for (const id of chaoLikenessIds())
    out.push({ id, family: 'chao', label: id.replace(/-/g, ' ') });
  return out;
}

const swatch = (hex: string, colour: boolean): string => {
  if (!colour) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `\x1b[48;2;${n >> 16};${(n >> 8) & 255};${n & 255}m  \x1b[0m ${hex}`;
};

/** The printed sheet, as lines. Pure, so the test reads it. */
export function likenessSheet(opts: SheetOptions = {}): string[] {
  const want = opts.filter?.toLowerCase();
  const lines: string[] = [];
  let n = 0;
  for (const e of sheetEntries()) {
    if (opts.family && e.family !== opts.family) continue;
    if (opts.ids && !opts.ids.includes(e.id)) continue;
    if (want && !`${e.id} ${e.label}`.toLowerCase().includes(want)) continue;
    const l = likenessOf(e.id)!;
    n++;
    lines.push(
      `== ${e.id}  (${e.label}; ${e.family}) ==`,
      `  silhouette: ${l.silhouette.join(', ')}`,
      `  colours:    ${l.keyColours.map((c) => swatch(c, !!opts.colour)).join('  ')}`,
      `  must have:  ${l.mustHave.join('; ')}`,
      `  plan:       ${l.plan}`,
      '',
    );
  }
  lines.push(`${n} figure${n === 1 ? '' : 's'}`);
  return lines;
}

function main(): void {
  const a = process.argv.slice(2);
  const arg = (k: string): string | undefined => {
    const i = a.indexOf(`--${k}`);
    return i >= 0 ? a[i + 1] : undefined;
  };
  const ids = arg('ids');
  console.log(
    likenessSheet({
      family: arg('family'),
      filter: arg('filter'),
      ids: ids ? ids.split(',') : undefined,
      colour: a.includes('--colour'),
    }).join('\n'),
  );
}

const entry = (process.argv[1] ?? '').split(String.fromCharCode(92)).join('/');
if (entry.endsWith('/likeness-sheet.ts')) main();
