/**
 * R12 d2: the small, still things set in the open world that the renderers draw as marks: the
 * collectibles still lying about, the traces not yet looked at, the photo frame and the build
 * plot's corner posts of the region the Keeper is in. One list, cached until the Keeper changes
 * region or picks something up, so a frame costs no allocation. Region local.
 */
import type { RegionId } from '../config/regions';
import { PLOT_NEAR, type DrawnId } from '../config/region-content-r12d2';
import { openHere } from './collectibles';
import { photoSpotAt } from './photo-spots';
import { drawnRegionOf } from './region-walk';
import { roomNear } from './region-spots';
import { plotPieces } from './region-plots';
import { ghostShipHere } from './region-weather-play';
import { seasonHere, seasonKeepsakeTaken, seasonSpots } from './region-season-props';
import { openTraces } from './regions-trace';
import type { World } from './types';

export type MarkKind =
  'petal' | 'postcard' | 'key' | 'trace' | 'photo' | 'plot' | 'decor' | 'ghost' | 'season';

export interface Mark {
  kind: MarkKind;
  id: string;
  /** For a plot piece, the decoration kind. */
  decor?: string;
  region: RegionId;
  x: number;
  z: number;
}

/** Bumped when a pick-up or look changes what is open (the cache below drops on it). */
let rev = 0;
export function bumpMarks(): void {
  rev++;
}

const plots = new Map<RegionId, { x: number; z: number } | null>();

/** Where a region's 8 x 8 build plot is centred (R0136), or null for a region with none. */
export function plotAt(region: RegionId): { x: number; z: number } | null {
  const want = PLOT_NEAR[region as DrawnId];
  if (!want) return null;
  if (!plots.has(region)) plots.set(region, roomNear(region, want.x, want.z, 4));
  return plots.get(region)!;
}

let cache: {
  loc: string;
  collected: unknown;
  plot: unknown;
  plotN: number;
  ghost: boolean;
  season: string;
  rev: number;
  list: readonly Mark[];
} | null = null;
const NONE: readonly Mark[] = [];

/** The marks of the drawn region the Keeper is in (none in the Grove, whose props are its own). */
export function regionMarks(world: World): readonly Mark[] {
  const region = drawnRegionOf(world.location);
  if (!region) return NONE;
  const c = cache;
  const plotN = plotPieces(world, region).length;
  const ship = ghostShipHere(world);
  const sn = seasonHere(world, region);
  const season = sn + (seasonKeepsakeTaken(world, region, sn) ? '+' : '');
  if (
    c &&
    c.loc === world.location &&
    c.collected === world.collected &&
    c.plot === world.plotDecor &&
    c.plotN === plotN &&
    c.ghost === !!ship &&
    c.season === season &&
    c.rev === rev
  )
    return c.list;
  const list: Mark[] = [];
  for (const k of openHere(world)) list.push({ kind: k.kind, id: k.id, region, x: k.x, z: k.z });
  for (const t of openTraces(world)) list.push({ kind: 'trace', id: t.id, region, x: t.x, z: t.z });
  const photo = photoSpotAt(region);
  if (photo) list.push({ kind: 'photo', id: `photo:${region}`, region, ...photo });
  const plot = plotAt(region);
  if (plot) list.push({ kind: 'plot', id: `plot:${region}`, region, ...plot });
  for (const d of plotPieces(world, region))
    list.push({ kind: 'decor', id: d.id, decor: d.kind, region, x: d.pos.x, z: d.pos.z });
  for (const sp of seasonSpots(region, sn))
    list.push({
      kind: 'season',
      id: 'season:' + region + ':' + sp.n,
      decor: sp.kind,
      region,
      x: sp.x,
      z: sp.z,
    });
  if (ship) list.push({ kind: 'ghost', id: 'ghost-ship', region, x: ship.x, z: ship.z });
  cache = {
    loc: world.location,
    collected: world.collected,
    plot: world.plotDecor,
    plotN,
    ghost: !!ship,
    season,
    rev,
    list,
  };
  return list;
}
