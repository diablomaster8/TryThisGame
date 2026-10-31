import { CAMP10D } from '../config/tuning';
import { markAt } from '../config/stage-marks';
import { STORY_REGIONS } from '../config/story-regions';
import type { SceneStage } from '../config/story';
import { boardState } from '../sim/quest-offers';
import { storyRegionHere } from '../sim/story-regions';
import type { World } from '../sim/types';
import type { DressItem, DressShape } from './dress-d-rules';

/**
 * Lane C r10 agent D: two kinds of prop added to package d's shared list (`dressItems`), so
 * both renderers draw them with the art they already have, painted once into the dress sheet
 * (Pixel) or built once per signature (Full 3D), never uploaded per frame.
 *
 * - R0607 (CAMP-15): the notice board in each hub, one card per quest waiting on it
 *   (offered, put off, or an errand). The Grove's stands inside the gate, and the Sun and
 *   Moon Groves' beside their shrine. Logged In's server already has its message board.
 * - R0639 (CAMP-47): the Grove change a finished line leaves (its `grove-*` keepsake): a
 *   signpost to the Fold by the gate, a glowing lamp at Pixel's workbench, a lit shrine at the
 *   Hollow stairs, and the Dawn & Dusk lens on the green.
 *
 * Pure: it reads the world and writes nothing. A scene's `stage.props` may hide any of them by
 * key ('hide'), as with package d's own props.
 */

/** Cards on the board: quests waiting on it in the book, plus errands not yet claimed. */
export function boardCards(world: World): number {
  const c = world.campaign;
  let n = world.quests.filter((q) => !q.claimed).length;
  if (c)
    for (const id of Object.keys(world.questBook?.entries ?? {}))
      if (boardState(world, c, id) === 'available') n += 1;
  return n;
}

function item(
  key: string,
  shape: DressShape,
  x: number,
  z: number,
  yaw: number,
  o: Partial<DressItem> = {},
): DressItem {
  return {
    key,
    shape,
    place: 'grove',
    x,
    z,
    yaw,
    glint: false,
    glintAt: [0, 0, 0],
    lit: false,
    n: 0,
    cottage: false,
    ...o,
  };
}

/** Where a prop stands: a stage mark (or a region's entrance) plus an offset. */
function at(
  mark: string | { x: number; z: number },
  off: readonly [number, number],
): { x: number; z: number; yaw: number } | null {
  const m = typeof mark === 'string' ? markAt('grove', mark) : { ...mark, yaw: 0 };
  return m ? { x: m.x + off[0], z: m.z + off[1], yaw: m.yaw } : null;
}

/** The notice board and Grove-change items standing now, in the home Grove only. */
export function camp10dDressItems(world: World, stage: SceneStage): DressItem[] {
  const out: DressItem[] = [];
  if (!world.campaign || world.location !== 'grove' || world.edu !== null) return out;
  const sp = stage.props ?? {};
  const want = (key: string): boolean => sp[key] !== 'hide';
  const T = CAMP10D.props;
  const push = (
    key: string,
    shape: DressShape,
    p: { x: number; z: number; yaw: number } | null,
    o: Partial<DressItem> = {},
  ): void => {
    // Only near the Keeper (the camera follows them), so far views such as the 3D farOrchard
    // spot, which sits close to its draw-call cap, never pay for them.
    const k = world.keeper.pos;
    if (p && Math.hypot(p.x - k.x, p.z - k.z) > T.nearKeeper) return;
    if (p && want(key)) out.push(item(key, shape, p.x, p.z, p.yaw, o));
  };

  // R0607: the hub's notice board, from the chapter the board opens.
  const region = storyRegionHere(world);
  if (world.campaign.chapter >= T.boardFromChapter) {
    const n = Math.min(T.boardCardsMax, boardCards(world));
    if (region === null || region === 'fold')
      push('notice-board', 'board', at(T.groveBoard.mark, T.groveBoard.off), { n });
    else if (region === 'sun' || region === 'moon')
      push('notice-board', 'board', at(STORY_REGIONS[region].at, T.shrineBoard.off), { n });
  }

  // R0639: what each finished line left in the Grove, seen from home (not inside a region).
  if (region !== null) return out;
  const keeps = world.inventory.keepsakes;
  for (const [id, g] of Object.entries(T.groveChange)) {
    if (!keeps.includes(id)) continue;
    const mark = g.region ? STORY_REGIONS[g.region].at : g.mark;
    push(`grove-change-${id}`, g.shape, at(mark, g.off), {
      lit: g.lit,
      glint: g.glint,
      glintAt: g.glintAt,
    });
  }
  return out;
}
