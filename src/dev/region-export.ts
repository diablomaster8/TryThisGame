/**
 * R0141 (WORLD-75): the export half of the region editor. Turns a `RegionDef` into formatted
 * TypeScript for `config/region-<id>.ts`, so a region laid out by dragging pieces can be saved
 * as data. Pure and dev-only (nothing in the game imports it, so it never ships). The
 * drag-to-place view that feeds it is not built yet.
 */
import type { PoiDef, RegionDef, RegionExit } from '../config/regions';

const n = (v: number): string => String(Math.round(v * 100) / 100);

function exitTs(x: RegionExit): string {
  const r = x.rect;
  const unlock = x.unlock ? `, unlock: '${x.unlock}'` : '';
  return (
    `    { id: '${x.id}', rect: { x: ${n(r.x)}, z: ${n(r.z)}, w: ${n(r.w)}, h: ${n(r.h)} }, to: '${x.to}', ` +
    `arrive: { x: ${n(x.arrive.x)}, z: ${n(x.arrive.z)} }, facing: ${n(x.facing)}, kind: '${x.kind}'${unlock} },`
  );
}

function poiTs(p: PoiDef): string {
  const extra = `${p.landmark ? `, landmark: '${p.landmark}'` : ''}${p.tier ? `, tier: '${p.tier}'` : ''}`;
  return `    { id: '${p.id}', x: ${n(p.x)}, z: ${n(p.z)}${extra} },`;
}

/** The region's exits and POIs as a TypeScript module body (stable order: by id). */
export function regionToTs(def: RegionDef): string {
  const exits = [...def.exits].sort((a, b) => a.id.localeCompare(b.id));
  const pois = [...def.pois].sort((a, b) => a.id.localeCompare(b.id));
  const name = def.id.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
  return [
    `import type { PoiDef, RegionExit } from './regions';`,
    ``,
    `export const ${name.toUpperCase()}_EXITS: readonly RegionExit[] = [`,
    ...exits.map(exitTs),
    `];`,
    ``,
    `export const ${name.toUpperCase()}_POIS: readonly PoiDef[] = [`,
    ...pois.map(poiTs),
    `];`,
    ``,
  ].join('\n');
}
