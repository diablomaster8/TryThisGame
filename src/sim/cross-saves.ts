/**
 * Read-only lookups across saves (canon 21). The Grove reads the Atlas and the Arcade to
 * show keepsakes and unlock its festivals; the side saves read the Grove to vary their
 * own scenes. A `CrossSaves` is a frozen snapshot taken from storage by the platform
 * layer, so no lookup here can write anything, to any save.
 */
import { parseArcade, parseAtlas, type ArcadeSave, type AtlasSave } from './side-saves';

export interface CrossSaves {
  readonly atlas: Readonly<AtlasSave>;
  readonly arcade: Readonly<ArcadeSave>;
  /** True once any Hazel's Grove save has seen the Long-Grass lantern relight. */
  readonly lanternLit: boolean;
}

/** The chapter 10 dawn scene, where the Long-Grass lantern lights on its own. */
export const LANTERN_SCENE = 'c10-dawn';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) deepFreeze(v);
    Object.freeze(value);
  }
  return value;
}

/** Whether a Grove save's JSON has seen the lantern scene. Unreadable saves read as no. */
export function groveLanternLit(json: string): boolean {
  try {
    const data = JSON.parse(json) as { world?: { campaign?: { seen?: unknown } | null } };
    const seen = data.world?.campaign?.seen;
    return Array.isArray(seen) && seen.includes(LANTERN_SCENE);
  } catch {
    return false;
  }
}

/** Pure: a snapshot from the side saves' JSON and every Grove save's JSON. */
export function crossSavesFrom(
  atlasJson: string | null,
  arcadeJson: string | null,
  groveJsons: readonly string[],
): CrossSaves {
  return deepFreeze({
    atlas: parseAtlas(atlasJson),
    arcade: parseArcade(arcadeJson),
    lanternLit: groveJsons.some(groveLanternLit),
  });
}

export const EMPTY_CROSS_SAVES: CrossSaves = crossSavesFrom(null, null, []);

/** An Atlas page ('A15') is finished, or one quest in it ('a15-03' or its code 'A15-3'). */
export function atlasDone(x: CrossSaves, id: string): boolean {
  const page = x.atlas.pages[id];
  if (page) return page.done;
  for (const p of Object.values(x.atlas.pages)) {
    if (p.quests[id]?.stage === 'finished') return true;
  }
  return false;
}

/** A flag one Atlas page set, or undefined. */
export function atlasFlag(
  x: CrossSaves,
  page: string,
  flag: string,
): number | boolean | string | undefined {
  return x.atlas.pages[page]?.flags[flag];
}

export function arcadeDone(x: CrossSaves, id: string): boolean {
  return x.arcade.carts[id]?.done ?? false;
}

export function longGrassLantern(x: CrossSaves): boolean {
  return x.lanternLit;
}

/** The finished Atlas pages, for the Grove's keepsake shelf. */
export function atlasPagesDone(x: CrossSaves): string[] {
  return Object.keys(x.atlas.pages).filter((id) => x.atlas.pages[id]!.done);
}
