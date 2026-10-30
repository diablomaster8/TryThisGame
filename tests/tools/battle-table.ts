/**
 * The move list for writers (recs FIGHT-70): every move with its name, blurb, type, numbers
 * for both modes and where it is learned, as one Markdown table. It is a scratch document,
 * never part of the repo: it writes to the path given on the command line, or to the OS temp
 * folder.
 *
 *   npx tsx tests/tools/battle-table.ts [out.md]
 */
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BATTLE_MOVE_TEXT } from '../../src/config/strings-battle-moves';
import { MOVES, ctBonusOf, moveProblems } from '../../src/sim/battle/moves';
import { STATUS_DEFS } from '../../src/sim/battle/status';
import { STATUS_IDS } from '../../src/sim/battle/types';

const cell = (v: unknown): string => String(v ?? '').replaceAll('|', '\\|');

function effect(m: (typeof MOVES)[number]): string {
  const out: string[] = [];
  if (m.status) out.push(`${m.status.id} ${Math.round(m.status.chance * 100)}%`);
  if (m.mood)
    out.push(`${m.mood.who} ${m.mood.stat} ${m.mood.delta > 0 ? '+' : ''}${m.mood.delta}`);
  if (m.heal) out.push(`heal ${Math.round(m.heal * 100)}%`);
  if (m.special) out.push(m.special);
  if (m.ground) out.push('ground');
  return out.join(', ');
}

const head =
  '| id | name | blurb | type | kind | power | acc | puff | prio | target | grid range | aoe | CT | anim | source | effect |';
const rows = MOVES.map((m) => {
  const t = BATTLE_MOVE_TEXT[m.id];
  const ct = (m.grid.ct ?? 0) + ctBonusOf(m);
  const bad = moveProblems(m);
  return [
    m.id,
    t?.name ?? '**missing**',
    t?.blurb ?? '**missing**',
    m.type,
    m.kind,
    m.power,
    m.acc,
    m.puff,
    m.priority,
    m.target,
    m.grid.range.join('–'),
    m.grid.aoe,
    ct,
    m.anim,
    m.source,
    effect(m) + (bad.length ? ` **${bad.join('; ')}**` : ''),
  ]
    .map(cell)
    .join(' | ');
});

const statuses = STATUS_IDS.map((id) => {
  const d = STATUS_DEFS[id];
  return `| ${id} | ${d.turns.join('–')} | ${d.ctTicks.join('–')} | ${d.cure.join(', ')} |`;
});

const md = [
  '# Grove moves',
  '',
  `${MOVES.length} moves. CT is the grid charge plus the priority bonus (+10 a step).`,
  '',
  head,
  `|${' --- |'.repeat(16)}`,
  ...rows.map((r) => `| ${r} |`),
  '',
  '## Statuses',
  '',
  '| id | turns | CT ticks | cured by |',
  '| --- | --- | --- | --- |',
  ...statuses,
  '',
].join('\n');

const out = resolve(process.argv[2] ?? join(tmpdir(), 'grove-battle-moves.md'));
// A writers' scratch file: never let it land inside the repo by accident.
const repo = fileURLToPath(new URL('../..', import.meta.url));
const rel = relative(repo, out);
if (!rel.startsWith('..') && !isAbsolute(rel)) {
  console.error(`Refusing to write inside the repo: ${out}`);
  process.exit(1);
}
writeFileSync(out, md, 'utf8');
console.log(`wrote ${MOVES.length} moves to ${out}`);
