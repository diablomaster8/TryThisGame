/**
 * R0309 (FUN-20): the joke-density report behind `content-check.ts --comedy`. A gag is a
 * line tagged `gag: true` (R0303). Each scene gets a type, each type a target (gags per
 * line, the table in `src/content/STYLE.md`), and the report lists the thinnest scenes per
 * type. Sprout scenes are measured by sound words instead (`config/edu-sounds.ts`, R0310),
 * which is also what the sprout coverage figure in the summary counts. Report only: nothing
 * here is a problem, so the checker's `problems: 0` never depends on it.
 */
import * as C from '../../src/content/index';
import type { Line, Scene } from '../../src/config/story';
import type { Quest } from '../../src/content/types';
import { soundWordsIn } from '../../src/config/edu-sounds';
import { packs } from './quest-packs';

type SceneType =
  | 'campaign-everyday'
  | 'campaign-turning'
  | 'side'
  | 'fun'
  | 'adult'
  | 'neopia'
  | 'atlas'
  | 'reader'
  | 'sprout';

/** Target gags per line (the low end of each range in STYLE.md); sprout: sound-word scenes. */
export const COMEDY_TARGETS: Record<SceneType, { perLine: number; note: string }> = {
  'campaign-everyday': { perLine: 1 / 6, note: '1 per 4–6 lines, none in Moss’s tales' },
  'campaign-turning': { perLine: 0, note: '0–1 per scene, relief only' },
  side: { perLine: 1 / 5, note: '1 per 5 lines' },
  fun: { perLine: 1 / 3, note: '1 per 2–3 lines, plus a physical gag per step' },
  adult: { perLine: 1 / 3, note: '1 per 2–3 lines, plus a running gag per quest' },
  neopia: { perLine: 1 / 3, note: '1 per 3 lines' },
  atlas: { perLine: 1 / 6, note: '1 per 6 lines, the Nubbin business is the gag' },
  reader: { perLine: 1 / 5, note: '1 per 5 lines' },
  sprout: { perLine: 0, note: '≥1 silly beat and ≥1 sound word per scene' },
};

const PACK_TYPE: Array<[RegExp, SceneType]> = [
  [/^(python|bean|avatar|sideFun\d*)$/, 'fun'],
  [/^(sunny|im|ca|ff|ul|mk|sp|db|ts|eg)$/, 'adult'],
  [/^np/, 'neopia'],
  [/^(a\d\d|pa\d*)$/, 'atlas'],
  [/^lang/, 'side'],
];

interface Row {
  id: string;
  type: SceneType;
  lines: number;
  gags: number;
  sounds: number;
}

const gagsIn = (ls: readonly Line[]): number => ls.filter((l) => l.gag).length;

function sceneRow(s: Scene, type: SceneType): Row {
  const ls = [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])];
  return {
    id: s.id,
    type,
    lines: ls.length,
    gags: gagsIn(ls),
    sounds: ls.reduce((n, l) => n + soundWordsIn(l.text).length, 0),
  };
}

function questScenes(q: Quest): Scene[] {
  return [...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]), q.complete];
}

export function comedyRows(): Row[] {
  const rows: Row[] = [];
  for (const s of C.CAMPAIGN_SCENES) {
    const ch = Number(/^c(\d+)-/.exec(s.id)?.[1] ?? 0);
    const turning = s.id.startsWith('end-') || (ch >= 9 && ch <= 11);
    rows.push(sceneRow(s, turning ? 'campaign-turning' : 'campaign-everyday'));
  }
  for (const [pack, list] of Object.entries(packs)) {
    const type = PACK_TYPE.find(([re]) => re.test(pack))?.[1] ?? 'side';
    for (const q of list) {
      const t: SceneType = /^Q\d/.test(q.code) ? 'fun' : type;
      for (const s of questScenes(q)) rows.push(sceneRow(s, t));
    }
  }
  for (const band of C.EDU_BANDS) {
    const all = [
      ...C.EDU_CAMPAIGN[band].flatMap((c) => c.scenes),
      ...C.EDU_QUESTS[band].flatMap((q) => q.scenes),
      ...C.EDU_VARIANTS[band],
    ];
    for (const e of all) {
      const ls = [...e.lines, ...(e.choices ?? []).flatMap((c) => c.then ?? [])];
      rows.push({
        id: e.id,
        type: band === 'sprout' ? 'sprout' : 'reader',
        lines: ls.length,
        gags: gagsIn(ls),
        sounds: ls.reduce((n, l) => n + soundWordsIn(l.text).length, 0),
      });
    }
  }
  return rows;
}

/** How far under target a scene is (bigger is thinner); 0 when it meets it. */
function shortfall(r: Row): number {
  if (r.type === 'sprout') return (r.sounds > 0 ? 0 : 1) + (r.gags > 0 ? 0 : 1);
  const want = COMEDY_TARGETS[r.type].perLine * r.lines;
  return Math.max(0, want - r.gags);
}

/** The printed report: per type totals, then the 20 thinnest scenes of each type. */
export function comedyReport(top = 20): string {
  const rows = comedyRows();
  const out: string[] = ['comedy report (gag: true per line; sprout: sound words per scene)'];
  for (const type of Object.keys(COMEDY_TARGETS) as SceneType[]) {
    const of = rows.filter((r) => r.type === type);
    if (of.length === 0) continue;
    const lines = of.reduce((n, r) => n + r.lines, 0);
    const gags = of.reduce((n, r) => n + r.gags, 0);
    const under = of.filter((r) => shortfall(r) > 0);
    const extra =
      type === 'sprout'
        ? ` · sound-word scenes ${of.filter((r) => r.sounds > 0).length}/${of.length} (${pct(of.filter((r) => r.sounds > 0).length, of.length)})`
        : '';
    out.push(
      `\n${type}: ${of.length} scenes, ${gags} gags in ${lines} lines (${pct(gags, lines)}), ` +
        `${under.length} under target [${COMEDY_TARGETS[type].note}]${extra}`,
    );
    for (const r of [...under].sort((a, b) => shortfall(b) - shortfall(a)).slice(0, top))
      out.push(`  ${r.id}: ${r.gags} gags / ${r.lines} lines, ${r.sounds} sound words`);
  }
  return out.join('\n');
}

/** Share of sprout scenes with a sound word (the R0310 target is 95%). */
export function sproutSoundCoverage(): number {
  const of = comedyRows().filter((r) => r.type === 'sprout');
  return of.length ? of.filter((r) => r.sounds > 0).length / of.length : 1;
}

const pct = (a: number, b: number): string => `${b ? ((100 * a) / b).toFixed(1) : '0'}%`;
