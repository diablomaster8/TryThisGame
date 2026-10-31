import { DRESS_D } from '../config/tuning-d';
import { SHELF_CAP, keepsakeLook } from '../config/keepsake-looks';
import { markAt } from '../config/stage-marks';
import type { SceneStage } from '../config/story';
import type { World } from '../sim/types';
import { stageFlags } from './scene-stage';
import { camp10dDressItems } from './dress-camp10d';

/**
 * Which of package d's props and items stand now, and where (campaign graphics H11, M1,
 * M2, M7, M12, M17, N1, N4). Both renderers draw this one list: the pixel view as 16 px
 * sprites, Full 3D as kit-built meshes. A scene's `stage.props` wins over the defaults
 * here: 'hide' removes a prop, any other word shows it ('lit' lights a lamp). Pure: it
 * reads the world and writes nothing.
 */
export type DressShape =
  | 'kettle'
  | 'cup'
  | 'pie'
  | 'teacup'
  | 'signpost'
  | 'eggShelf'
  | 'board'
  | 'shrine'
  | 'bell'
  | 'notebook'
  | 'tin'
  | 'visor'
  | 'lever'
  | 'lens'
  | 'porchLight'
  | 'keepShelf'
  | 'chair'
  | 'bench'
  | 'none';

export interface DressItem {
  key: string;
  shape: DressShape;
  /** Whose coordinates: the home Grove's, or Corvin's garden's. */
  place: 'grove' | 'corvin';
  x: number;
  z: number;
  yaw: number;
  /** A star glint hangs over it, and it bobs when motion is allowed. */
  glint: boolean;
  /** Offset of the glint from the item's foot. */
  glintAt: readonly [number, number, number];
  /** A lamp is lit (shrine, porch). */
  lit: boolean;
  /** A count: cards on the board, 1 when the signpost holds its letter, 1 for the bell's new rope. */
  n: number;
  /** Stands by the cottage, whose painted front is nearer the wall in the pixel view. */
  cottage: boolean;
  /** The keepsake ids on the shelf. */
  ids?: readonly string[];
}

const HIGH = DRESS_D.glint.lift;

/** Where keepsake slot `i` sits on the shelf, in the shelf's own frame (it faces +z). */
export function shelfSlot(i: number): { x: number; y: number } {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return { x: (col - 1.5) * DRESS_D.shelf.colGap, y: 0.98 - row * DRESS_D.shelf.rowGap };
}

/** The keepsake ids that stand on the shelf: objects only, in the order kept. */
export function shelfKeepsakes(world: World): string[] {
  return world.inventory.keepsakes.filter((id) => keepsakeLook(id) !== null).slice(0, SHELF_CAP);
}

/** A stable text for an item, so a renderer rebuilds a model only when it changed. */
export function itemSignature(it: DressItem): string {
  return `${it.shape}|${it.lit ? 1 : 0}|${it.n}|${it.ids ? it.ids.join(',') : ''}`;
}

export function dressItems(world: World, stage: SceneStage, darkness: number): DressItem[] {
  const f = stageFlags(world, stage);
  const out: DressItem[] = [];
  if (!world.campaign || f.chapter === 0) return out;
  const sp = stage.props ?? {};
  const want = (key: string, dflt: boolean): boolean => (sp[key] ? sp[key] !== 'hide' : dflt);
  const keeps = world.inventory.keepsakes;
  const seen = world.campaign.seen;
  const hazel = f.storyline === null;

  const add = (
    key: string,
    shape: DressShape,
    place: 'grove' | 'corvin',
    mark: string,
    dx: number,
    dz: number,
    o: Partial<DressItem> = {},
  ): void => {
    const m = markAt(place, mark);
    if (!m) return;
    out.push({
      key,
      shape,
      place,
      x: m.x + dx,
      z: m.z + dz,
      yaw: m.yaw,
      glint: false,
      glintAt: [0, HIGH, 0],
      lit: false,
      n: 0,
      cottage: place === 'grove' && (mark === 'step' || mark === 'porch' || mark === 'window'),
      ...o,
    });
  };

  if (f.location === 'grove') {
    // Chapter 1: the cold kettle, the upturned cup, eggshells in the window, the letter.
    if (hazel && f.chapter === 1) {
      const v = DRESS_D.vignette;
      if (want('kettle', true)) add('kettle', 'kettle', 'grove', 'step', v.kettle.dx, v.kettle.dz);
      if (want('cup', true)) add('cup', 'cup', 'grove', 'step', v.cup.dx, v.cup.dz);
      if (want('sunrise-shelf', true))
        add('window-shelf', 'eggShelf', 'grove', 'window', v.shelf.dx, v.shelf.dz, {
          yaw: 0,
          n: 5,
        });
      const unread = f.sceneId === 'c1-letter' || !seen.includes('c1-letter');
      if (want('signpost', unread))
        add('signpost', 'signpost', 'grove', 'signpost', DRESS_D.signpost.dx, DRESS_D.signpost.dz, {
          n: 1,
          glint: true,
          glintAt: [0.2, 1.1, 0.14],
        });
    }
    // Step scenes: a teacup of cold tea (ch3), Fern's pie (ch9).
    const dish = DRESS_D.stepDish;
    if (hazel && want('step-teacup', f.sceneId === 'c3-open'))
      add('step-teacup', 'teacup', 'grove', 'step', dish.dx, dish.dz);
    if (hazel && want('step-pie', f.sceneId === 'c9-close'))
      add('step-pie', 'pie', 'grove', 'step', dish.dx, dish.dz);
    // The porch light, lit from dusk.
    const lit =
      sp['porch'] === 'lit' || (sp['porch'] !== 'out' && darkness > DRESS_D.porchLight.darkness);
    if (want('porch', true))
      add(
        'porch-light',
        'porchLight',
        'grove',
        'porch',
        DRESS_D.porchLight.dx,
        DRESS_D.porchLight.dz,
        {
          yaw: 0,
          lit,
        },
      );
    // The keepsake shelf by the porch, and a glint on the newest keepsake.
    const shelf = shelfKeepsakes(world);
    if (want('keepsake-shelf', shelf.length > 0)) {
      const s = DRESS_D.shelf;
      add('keepsake-shelf', 'keepShelf', 'grove', 'porch', s.dx, s.dz, { yaw: 0, ids: shelf });
      const newest = keeps[keeps.length - 1];
      const slot = newest ? shelf.indexOf(newest) : -1;
      if (slot >= 0) {
        const p = shelfSlot(slot);
        add('keepsake-glint', 'none', 'grove', 'porch', s.dx + p.x, s.dz + 0.04, {
          yaw: 0,
          glint: true,
          glintAt: [0, p.y + 0.12, 0],
        });
      }
    }
    // Hazel's notebook (chapter 8) on the porch boards.
    if (hazel && want('notebook', f.chapter === 8))
      add('notebook', 'notebook', 'grove', 'porch', -0.2, 0.5, {
        glint: true,
        glintAt: [0, 0.2, 0],
      });
    // Hazel's bench on the hill, from the shock of chapter 9 on.
    if (hazel && want('hazels-bench', f.chapter >= 9))
      add('hill-bench', 'bench', 'grove', 'hill-top', DRESS_D.hillBench.dx, DRESS_D.hillBench.dz, {
        yaw: Math.PI,
      });
    // Dawn & Dusk: the shrine lamp and cracked lens at dawn, the bell at dusk.
    if (f.half === 'dawn') {
      const sc = f.storyChapter ?? 0;
      const lamp = sp['shrine'] === 'lit' || (sp['shrine'] !== 'out' && sc >= 1);
      add('shrine', 'shrine', 'grove', 'shrine', 0, 0, {
        lit: lamp,
        glint: true,
        glintAt: [0, 1.1, 0],
      });
      add('lens', 'lens', 'grove', 'shrine', 0.8, 0.5, { glint: true, glintAt: [0, 0.22, 0] });
    }
    if (f.half === 'dusk')
      add('bell', 'bell', 'grove', 'bell', 0, 0, {
        n: (f.storyChapter ?? 0) >= 1 ? 1 : 0,
        glint: true,
        glintAt: [0, 1.0, 0],
      });
    // Logged In: the message board with a card for each open request, and the visor.
    if (f.storyline === 'logged') {
      const open = world.quests.filter((q) => !q.claimed).length;
      add('board', 'board', 'grove', 'board', 0, 0, { n: Math.min(DRESS_D.boardCards, open) });
      add('visor', 'visor', 'grove', 'lobby', 1.3, 0.8, { glint: true, glintAt: [0, 0.3, 0] });
    }
    // The Beetle Road: Vane's notebook at the guard house and the lever by the cart.
    if (f.storyline === 'beetle') {
      add('vane-notebook', 'notebook', 'grove', 'guardhouse', 0.9, 0.6, {
        glint: true,
        glintAt: [0, 0.2, 0],
      });
      add('lever', 'lever', 'grove', 'cart', -0.9, 0.2, { glint: true, glintAt: [0, 0.7, 0] });
    }
  }
  if (f.location === 'corvin' && hazel) {
    // Chapter 9's shard tin by the gate; Corvin's chair by his door once the story is his.
    if (want('shard-tin', f.chapter === 9))
      add('shard-tin', 'tin', 'corvin', 'corvin-gate', 0.9, -0.7, {
        glint: true,
        glintAt: [0, 0.3, 0],
      });
    if (want('corvins-chair', f.chapter >= 9 || keeps.includes('s9-chair')))
      add('corvins-chair', 'chair', 'corvin', 'corvin-door', DRESS_D.chair.dx, DRESS_D.chair.dz, {
        yaw: Math.PI * 0.85,
      });
  }
  // Lane C r10 agent D (R0607, R0639): the notice board and the lines' Grove changes.
  out.push(...camp10dDressItems(world, stage));
  return out;
}
