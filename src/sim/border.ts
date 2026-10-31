/**
 * WORLD-67: what stands at each stretch of the home Grove's edge (±`SIM.worldHalf`). Every
 * border point is one of three kinds: an `exit` (a way out to a region that is open), a
 * `notYet` (a way out to one that isn't, or still locked: a fallen tree lies across it), or
 * `natural` (the hedge that rings the rest). The renderers draw the blockers from
 * `borderBlockers()`, and walking into the edge raises `borderPushed` once per stretch.
 */
import { BORDER } from '../config/tuning-r9d2';
import { REGIONS } from '../config/regions';
import { SIM } from '../config/tuning';
import type { SimEvent, Vec2, World } from './types';

export type BorderKind = 'exit' | 'natural' | 'notYet';
export type BorderSide = 'n' | 'e' | 's' | 'w';

export interface BorderEdge {
  kind: BorderKind;
  side: BorderSide;
  /** A stable name for the stretch: the exit's id, or the side for the hedge. */
  stretch: string;
}

interface BorderWay {
  id: string;
  side: BorderSide;
  /** Where along the edge the way is centred (x on n/s, z on e/w). */
  at: number;
  to: keyof typeof REGIONS;
  unlock?: string;
}

/** The side a point lies nearest, and where along it. */
function sideOf(x: number, z: number): { side: BorderSide; along: number } {
  if (Math.abs(z) >= Math.abs(x)) return { side: z < 0 ? 'n' : 's', along: x };
  return { side: x < 0 ? 'w' : 'e', along: z };
}

/** The Grove's exits whose square reaches the edge (the ways out to other regions). */
export const BORDER_WAYS: readonly BorderWay[] = REGIONS.grove.exits.flatMap((e) => {
  const h = SIM.worldHalf;
  const cx = e.rect.x + e.rect.w / 2;
  const cz = e.rect.z + e.rect.h / 2;
  const reach = Math.max(Math.abs(cx), Math.abs(cz));
  if (reach < h - 1) return [];
  const { side, along } = sideOf(cx, cz);
  const way: BorderWay = { id: e.id, side, at: along, to: e.to };
  if (e.unlock) way.unlock = e.unlock;
  return [way];
});

function wayOpen(way: BorderWay, world?: World): boolean {
  if (!REGIONS[way.to].built) return false;
  return !way.unlock || !!world?.campaign?.flags[way.unlock];
}

/** What stands at the border nearest (x, z). */
export function borderEdge(x: number, z: number, world?: World): BorderEdge {
  const { side, along } = sideOf(x, z);
  const way = BORDER_WAYS.find((w) => w.side === side && Math.abs(w.at - along) <= BORDER.exitHalf);
  if (way) return { kind: wayOpen(way, world) ? 'exit' : 'notYet', side, stretch: way.id };
  return { kind: 'natural', side, stretch: side };
}

export interface BorderBlocker {
  kind: 'hedge' | 'log';
  x: number;
  z: number;
  /** Yaw for a log (lies along the edge); bushes ignore it. */
  yaw: number;
}

let blockers: BorderBlocker[] | null = null;

/**
 * The blockers that stand just outside the edge: hedge bushes along every natural stretch
 * and a fallen log across each way out that isn't open. Exits are left clear. Fixed layout
 * (the not-yet logs are listed whatever the flags; a renderer may skip opened ones).
 */
export function borderBlockers(): readonly BorderBlocker[] {
  if (blockers) return blockers;
  const h = SIM.worldHalf;
  const out: BorderBlocker[] = [];
  const sides: Array<[BorderSide, (a: number, off: number) => Vec2, number]> = [
    ['n', (a, o) => ({ x: a, z: -h - o }), 0],
    ['s', (a, o) => ({ x: a, z: h + o }), 0],
    ['w', (a, o) => ({ x: -h - o, z: a }), Math.PI / 2],
    ['e', (a, o) => ({ x: h + o, z: a }), Math.PI / 2],
  ];
  for (const [side, at, yaw] of sides) {
    const ways = BORDER_WAYS.filter((w) => w.side === side);
    for (let a = -h; a <= h + 1e-6; a += BORDER.step) {
      if (ways.some((w) => Math.abs(w.at - a) <= BORDER.exitHalf)) continue;
      out.push({ kind: 'hedge', ...at(a, BORDER.bushOut), yaw: 0 });
    }
    for (const w of ways)
      if (!REGIONS[w.to].built || w.unlock)
        out.push({ kind: 'log', ...at(w.at, BORDER.logOut), yaw });
  }
  blockers = out;
  return out;
}

/** The stretches already spoken for this visit, per world (not saved). */
const spoken = new WeakMap<World, Set<string>>();

/**
 * After the Keeper's step: when it stands at the edge and is still heading out (keys held
 * outward, or a tap on the edge itself; `tapped` is the tap a stand-in target stands for),
 * say once why it can go no further.
 */
export function noteBorderPush(world: World, events: SimEvent[], tapped?: Vec2): void {
  if (world.location !== 'grove') return;
  const k = world.keeper;
  const h = SIM.worldHalf;
  const p = k.pos;
  const said = spoken.get(world) ?? new Set<string>();
  spoken.set(world, said);
  const inside = h - Math.max(Math.abs(p.x), Math.abs(p.z));
  if (inside >= BORDER.rearm) {
    said.clear();
    return;
  }
  if (inside > BORDER.tapNear) return;
  // A tap past the edge walks to a stand-in a little inside it; the tap itself says where.
  const t = tapped ?? k.moveTarget;
  const out = (v: number, inp: number, tv: number | undefined) =>
    (h - Math.abs(v) <= BORDER.near && inp !== 0 && Math.sign(inp) === Math.sign(v)) ||
    (h - Math.abs(v) <= BORDER.tapNear &&
      tv !== undefined &&
      Math.abs(tv) >= h - 1e-3 &&
      Math.sign(tv) === Math.sign(v));
  if (!out(p.x, k.input.x, t?.x) && !out(p.z, k.input.z, t?.z)) return;
  const edge = borderEdge(p.x, p.z, world);
  if (edge.kind === 'exit' || said.has(edge.stretch)) return;
  said.add(edge.stretch);
  events.push({ kind: 'borderPushed', edge: edge.kind, stretch: edge.stretch });
}
