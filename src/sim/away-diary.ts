import { AWAY_DIARY, type ToastBand } from '../config/strings-fun-r5';
import { hashSeed, Rng } from './rng';
import type { AwayReport, World } from './types';

/**
 * R0316 (FUN-27): the comic diary on "While you were away": up to four lines picked with a
 * seeded generator from what the catch-up counted (fruit eaten, naps, an hour or more by the
 * pond, the weather, Fern's visit in Hazel's Grove). Pure: reads the report and the world,
 * never writes. Only Nubbins still in the Grove are named, and no line is about leaving.
 */
const MAX_LINES = 4;

export function awayDiary(
  report: AwayReport,
  world: World,
  band: ToastBand,
  seed: number,
): string[] {
  const rng = new Rng(hashSeed(`${seed}:${report.elapsedMs}:${report.simulatedMs}`));
  const here = world.nubbins.filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon');
  const pick = <T>(xs: readonly T[]): T => xs[rng.int(0, xs.length - 1)]!;
  const fill = (t: string, name: string, k = 0): string =>
    t
      .replaceAll('{n}', name)
      .replaceAll('{k}', String(k))
      .replaceAll('{j}', String(Math.max(1, k - 2)));
  const cands: string[] = [];
  const tally = report.tally;
  const named = (counts: Record<string, number> | undefined, min: number) =>
    here
      .map((n) => ({ n, k: counts?.[n.id] ?? 0 }))
      .filter((x) => x.k >= min)
      .sort((a, b) => b.k - a.k)[0];
  const eater = named(tally?.ate, 3);
  if (eater) cands.push(fill(pick(AWAY_DIARY.ate[band]), eater.n.name, eater.k));
  const napper = named(tally?.naps, 2);
  if (napper) cands.push(fill(pick(AWAY_DIARY.napped[band]), napper.n.name, napper.k));
  if (here.length > 0 && report.simulatedMs >= 3_600_000)
    cands.push(fill(pick(AWAY_DIARY.pond[band]), pick(here).name));
  if (tally?.rained && here.length > 0)
    cands.push(fill(pick(AWAY_DIARY.rain[band]), pick(here).name));
  const c = world.campaign;
  if (c && !c.storyline && c.chapter >= 2) cands.push(pick(AWAY_DIARY.fern[band]));
  // Shuffle, then keep a few; with nothing to tell, one quiet line.
  for (let i = cands.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [cands[i], cands[j]] = [cands[j]!, cands[i]!];
  }
  const out = cands.slice(0, rng.int(Math.min(2, cands.length), Math.min(MAX_LINES, cands.length)));
  if (out.length === 0) {
    const n = here[0]?.name;
    const quiet = AWAY_DIARY.quiet[band].filter((t) => n || !t.includes('{n}'));
    if (quiet.length) out.push(fill(pick(quiet), n ?? ''));
  }
  return out;
}
