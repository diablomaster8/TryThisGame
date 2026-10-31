/**
 * TECH-46: named starting states for development and tests. Each builder is pure: a seed
 * and a wall time in, a World out, made from `createWorld`, sim steps and direct field sets,
 * so the same state can open in the browser (`?debug&scenario=<name>`, or the debug panel's
 * Scenario row) and seed a Vitest spec. Nothing here ships to players: main.ts and the
 * debug panel load it lazily, and only under `?debug` or a dev build.
 */
import { LIFECYCLE } from '../config/tuning';
import { createEgg } from '../sim/nubbin';
import { hatch } from '../sim/lifecycle';
import { lifespanMs } from '../sim/slips';
import {
  NUBBIN_TYPES,
  type Nubbin,
  type NubbinType,
  type SimEvent,
  type World,
} from '../sim/types';
import { createWorld, newId, stepWorld, withRng } from '../sim/world';

type Band = 'sun' | 'moon' | 'neutral';
const BANDS: readonly Band[] = ['sun', 'moon', 'neutral'];
const ALIGNMENT: Record<Band, number> = { sun: 0.9, moon: -0.9, neutral: 0 };

/** Hatch every egg now. */
function hatchAll(w: World): void {
  const events: SimEvent[] = [];
  for (const n of w.nubbins) if (n.stage === 'egg') hatch(n, events, w.timeMs);
}

/** Lay extra eggs in a ring round the Keeper until the Grove holds `count` Nubbins. */
function fillTo(w: World, count: number): void {
  while (w.nubbins.length < count) {
    const a = (w.nubbins.length / count) * Math.PI * 2;
    const pos = { x: Math.cos(a) * 6, z: 4 + Math.sin(a) * 6 };
    w.nubbins.push(withRng(w, (rng) => createEgg(newId(w, 'nub'), pos, rng)));
  }
}

/** Set a child up so its evolution lands a few seconds after load, toward band and type. */
function aboutToEvolve(n: Nubbin, band: Band, type: NubbinType): void {
  n.stageMs = LIFECYCLE.childMs - 5_000;
  n.alignment = ALIGNMENT[band];
  for (const t of NUBBIN_TYPES) n.typeLean[t] = 0;
  if (type !== 'normal') n.typeLean[type] = 100;
}

/** Hatch everyone and step the sim through evolution, so they are adults by the rules. */
function growAll(w: World, wallMs: number): void {
  hatchAll(w);
  for (const n of w.nubbins) n.stageMs = LIFECYCLE.childMs - 100;
  const until = LIFECYCLE.cocoonMs + 1_000;
  for (let t = 0; t < until; t += 100) stepWorld(w, 100, wallMs + t);
}

type Builder = (seed: number, wallMs: number) => World;

const BUILDERS: Record<string, Builder> = {
  fresh: (seed, wallMs) => createWorld(seed, wallMs),
  'hatch-ready': (seed, wallMs) => {
    const w = createWorld(seed, wallMs);
    for (const n of w.nubbins) n.hatchRemainingMs = 2_000;
    return w;
  },
  'eternal-ready': (seed, wallMs) => {
    const w = createWorld(seed, wallMs);
    hatchAll(w);
    const n = w.nubbins[0]!;
    aboutToEvolve(n, 'sun', 'normal');
    n.rebirths = 2;
    return w;
  },
  'end-of-life-away': (seed, wallMs) => {
    const w = createWorld(seed, wallMs);
    growAll(w, wallMs);
    // The state catch-up leaves with departures off: frozen at the end, waiting for play.
    const n = w.nubbins[0]!;
    n.stageMs = lifespanMs(n);
    n.awaitingKeeper = true;
    return w;
  },
  'eight-nubbins': (seed, wallMs) => {
    const w = createWorld(seed, wallMs);
    fillTo(w, 8);
    growAll(w, wallMs);
    return w;
  },
};
for (const band of BANDS) {
  for (const type of NUBBIN_TYPES) {
    BUILDERS[`child-about-to-evolve:${band}:${type}`] = (seed, wallMs) => {
      const w = createWorld(seed, wallMs);
      hatchAll(w);
      aboutToEvolve(w.nubbins[0]!, band, type);
      return w;
    };
  }
}

/** Every scenario name, in the order the debug panel lists them. */
export const SCENARIOS: readonly string[] = Object.keys(BUILDERS);

/** Build a scenario, or null for an unknown name. */
export function buildScenario(name: string, seed: number, wallMs: number): World | null {
  const build = BUILDERS[name];
  return build ? build(seed, wallMs) : null;
}
