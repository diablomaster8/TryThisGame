#!/usr/bin/env node
/* global console */
/**
 * TECH-36 codemod: moves the pass-letter tuning satellites (`src/config/tuning-<pass>.ts`) into
 * `src/config/tuning-more/<domain>-<topic>.ts`, and rewrites every import specifier (static,
 * dynamic, `vi.mock`, `require`) plus path mentions in src/, tests/ and the root configs.
 *
 *   node tests/tools/rename-config.mjs            # do it (idempotent: moved files are skipped)
 *   node tests/tools/rename-config.mjs --dry-run  # list what would move
 *
 * The first line of each moved file records the old name and the review pass.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DRY = process.argv.includes('--dry-run');
const CFG = 'src/config';
const DEST = `${CFG}/tuning-more`;

/** old basename (without `tuning-`) -> new basename */
export const MAP = {
  a: 'campaign-light-grade',
  a1: 'campaign4-stage-poses',
  a2: 'campaign4-walkons',
  b: 'campaign-gate-fold',
  b4: 'campaign4-people-tale-grade',
  c: 'campaign-story-places',
  c4: 'campaign4-shadow-interiors',
  d: 'campaign-props-items',
  d4: 'campaign4-hush-depth',
  e: 'campaign-people-lanterns',
  e4: 'campaign4-world-detail',
  f: 'campaign-looks-titles',
  f2: 'campaign2-staging',
  f4: 'campaign4-fit-shots',
  k: 'campaign2-landmarks',
  p: 'campaign2-actors-pip',
  s: 'campaign2-white-room',
  u: 'campaign2-cards-postcards',
  u4: 'campaign4-keepsakes-boards',
  w: 'campaign2-winter-water',
  x: 'campaign2-lychgate',
  y: 'campaign2-night-grade',
  'access-r10': 'sim-access',
  'battle-r5': 'battle-doors',
  'battle-r6': 'battle-ladder-fusion',
  'battle-r9': 'battle-champions',
  camp10: 'story-camp-agents',
  camp10a: 'story-regions',
  camp10b: 'story-save-backups',
  camp10c: 'story-pace-skip',
  camp10d: 'story-shells-props',
  'camp11-profiles': 'story-profiles-packs',
  'camp11-save': 'story-save-layout',
  camp11c: 'story-open-lines',
  camp11ui: 'story-journal-ui',
  camp12c: 'story-quest-markers',
  camp9: 'story-quest-flow',
  camp9r: 'story-rest-saves',
  r10b1: 'dungeon-tour-tiles',
  r10b2: 'dungeon-field-streaming',
  r10b3: 'dungeon-poof-kid-mode',
  r10b4: 'dungeon-champions-wires',
  'fun-r10': 'fun-keeper-gags',
  'fun-r11e': 'fun-coop-gags',
  'fun-r7': 'fun-voice-antics',
  'kids-r10': 'kids-screens',
  'kids-r11e': 'kids-noticing',
  'look-r9e': 'kids-session-flow',
  'look-r10e': 'look-creature-fx',
  'move-r10': 'move-keeper-ui',
  'move-r10b': 'move-npc-colliders',
  r10d1: 'perf-view-cache',
  r10d4: 'perf-offline-packs',
  r11d3: 'perf-catchup',
  r12d3: 'perf-heap-pool',
  'r8d-perf': 'perf-tiers',
  'r8d-plat': 'perf-platform',
  'r8d-audio': 'audio-mix',
  r8d: 'ui-shake-sheet',
  r9d2: 'ui-tap-prints-border',
  r9d3: 'ui-shake-hint',
  r9d4: 'ui-world-hints',
  r10d2: 'ui-inspect-egg',
  r11d4: 'ui-first-loop',
  r13d3: 'ui-system-throttle',
  r11d1: 'world-region-engine',
  r11d2: 'world-camera-terrain',
  r11d6: 'world-overview-puddles',
  r11d7: 'world-region-lands',
  r11d8: 'world-region-sky',
  r12d1: 'world-region-moves',
  r12d2: 'world-content-tables',
  r13d1: 'world-region-content',
  r13d2: 'world-backdrops',
  r14d2: 'world-edu-trail-ice',
  'soul-r10': 'soul-friends-rivals',
  'soul-r10b': 'soul-kindergarten-emotes',
  'soul-r11': 'soul-quirks-gait',
  'soul-r11a': 'soul-toy-pairs',
  'soul-r11b': 'soul-wider-kindergarten',
  'soul-r11g': 'soul-ambient-games',
  'soul-r11h': 'soul-old-souls',
  'soul-r12a': 'soul-hum-fond',
  'soul-r8': 'soul-likes-moods',
  'soul-r9': 'soul-traits',
  'story-r11e': 'story-read-aloud',
};

function passNote(old) {
  if (/^[a-z]\d?$/.test(old)) return `campaign-graphics package ${old.toUpperCase()}`;
  const c = /^camp(\d+)([a-z]*)$/.exec(old);
  if (c) return `campaign engine, round ${c[1]}${c[2] ? ` agent ${c[2].toUpperCase()}` : ''}`;
  const c2 = /^camp(\d+)-/.exec(old);
  if (c2) return `campaign engine, round ${c2[1]}`;
  const r = /r(\d+)([a-z]+)?(\d+)?/.exec(old);
  if (r) return `review pass R${r[1]}${r[2] ? ` ${r[2].toUpperCase()}${r[3] ?? ''}` : ''}`;
  return 'review pass';
}

const stripExt = (p) => p.replace(/\.(ts|tsx|js|mjs|cjs)$/, '');

// old abs path (no ext) -> new abs path (no ext)
const moves = new Map();
for (const [o, n] of Object.entries(MAP)) {
  if (existsSync(`${CFG}/tuning-${o}.ts`)) moves.set(`${CFG}/tuning-${o}`, `${DEST}/${n}`);
}
if (new Set(Object.values(MAP)).size !== Object.keys(MAP).length) throw new Error('duplicate new names');
console.log(`${moves.size} files to move`);
if (DRY) process.exit(0);

const files = execFileSync(
  'git',
  ['ls-files', 'src', 'tests', 'vite.config.ts', 'eslint.config.js', 'eslint-local-rules.js', '.github'],
  { encoding: 'utf8', maxBuffer: 1 << 28 },
)
  .split('\n')
  .filter((f) => /\.(ts|tsx|js|mjs|cjs|yml|json)$/.test(f) && existsSync(f));

const oldNames = Object.keys(MAP).sort((a, b) => b.length - a.length);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const proseRe = new RegExp(
  '(?<=[/`\'" (])tuning-(' + oldNames.map(esc).join('|') + ')(?![\\w-])',
  'g',
);
const specRe = /(['"`])(\.{1,2}\/[^'"`\n]*)\1/g;

const out = new Map();
let rewrites = 0;
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const m = moves.get(stripExt(f));
  const newF = m ? `${m}.ts` : f;
  const dirOld = path.posix.dirname(f);
  const dirNew = path.posix.dirname(newF);
  let t = text.replace(specRe, (all, q, spec) => {
    const extM = /\.(ts|tsx|js)$/.exec(spec);
    const abs = path.posix.normalize(path.posix.join(dirOld, stripExt(spec)));
    const target = moves.get(abs) ?? abs;
    if (target === abs && dirNew === dirOld) return all;
    let r = path.posix.relative(dirNew, target);
    if (!r.startsWith('.')) r = `./${r}`;
    if (extM) r += extM[0];
    if (r === spec) return all;
    rewrites++;
    return `${q}${r}${q}`;
  });
  t = t.replace(proseRe, (_m, o) => {
    rewrites++;
    return `tuning-more/${MAP[o]}`;
  });
  if (newF !== f) {
    const old = path.posix.basename(f, '.ts').slice(7);
    t = `// was tuning-${old}; ${passNote(old)}\n${t}`;
  }
  out.set(f, { text: t, orig: text, newF });
}

mkdirSync(DEST, { recursive: true });
for (const [f, { newF }] of out) if (newF !== f) execFileSync('git', ['mv', f, newF]);
for (const { text, orig, newF } of out.values()) {
  if (text !== orig) writeFileSync(newF, text, { encoding: 'utf8' });
}
console.log(`moved ${moves.size}, ${rewrites} specifier/path rewrites`);
