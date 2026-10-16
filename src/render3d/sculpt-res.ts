import { SCULPT_RES } from '../config/tuning';
import { sculptData } from '../samples/sculpt-spec';
import { speciesSurfaces, surfaceData } from '../samples/species';
import { NUBBIN_SPEC } from '../samples/species-data';
import { SculptFarm } from './sculpt-farm';

/**
 * Pick the sculpt resolution for this device. Marching cost grows with a power of the
 * grid (`SCULPT_RES.exponent`), so one small march on the page (the Nubbin's torso at a coarse grid, a few tens
 * of ms even on a phone) predicts the whole opening build at each candidate grid. The
 * finest grid whose prediction fits the budget wins; the save keeps it, so this runs once.
 */

/** Predicted opening build in ms at `res`, from the benchmark time and the worker count. */
export function predictBuildMs(benchMs: number, res: number, workers: number): number {
  const scale = (res / SCULPT_RES.benchRes) ** SCULPT_RES.exponent;
  return (benchMs * SCULPT_RES.openingWork * scale) / Math.max(1, workers);
}

/** The finest step whose predicted build fits the budget; the coarsest when none does. */
export function resForBenchmark(benchMs: number, workers: number): number {
  for (const res of SCULPT_RES.steps) {
    if (predictBuildMs(benchMs, res, workers) <= SCULPT_RES.budgetMs) return res;
  }
  return SCULPT_RES.steps[SCULPT_RES.steps.length - 1]!;
}

/**
 * Time one march of the benchmark surface, in ms: the fastest of four after two warm-ups
 * (at boot the marching code is not compiled yet), since a stray garbage collection or a
 * busy core only ever makes a run slower.
 */
export function benchmarkSculpt(): number {
  const torso = speciesSurfaces(NUBBIN_SPEC)[0]!;
  const data = surfaceData(NUBBIN_SPEC, { ...torso, res: SCULPT_RES.benchRes });
  sculptData(data).dispose();
  sculptData(data).dispose();
  let best = Infinity;
  for (let i = 0; i < 4; i++) {
    const t0 = performance.now();
    sculptData(data).dispose();
    best = Math.min(best, performance.now() - t0);
  }
  return best;
}

/** The share of the authored grid a torso resolution means. */
export const qualityForRes = (res: number): number =>
  Math.min(1, Math.max(0.3, res / SCULPT_RES.authored));

let picked: number | null = null;

/** Benchmark once per page and pick the grid (the Game stores it in the save). */
export function pickSculptRes(): number {
  if (picked === null) {
    const ms = benchmarkSculpt();
    picked = resForBenchmark(ms, SculptFarm.defaultCount());
    console.info(`[3d] sculpt benchmark ${ms.toFixed(1)} ms: grid ${picked}`);
  }
  return picked;
}
