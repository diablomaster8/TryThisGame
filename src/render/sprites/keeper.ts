import type { NpcLook } from '../../config/npc-looks';
import type { TrainerLook } from '../../sim/trainers';
import { CLIPS, frameKey } from './animations';
import { DRAWN_ANGLES, type DrawnAngle } from './angles';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C, lightOf, shadeOf } from './palette';
import { drawFace, type Expression } from './faces';
import { PixelCanvas } from './pixel-canvas';

export const KEEPER_SIZE = 32;

/** Keeper looks are trainer looks: palette plus a hat style. */
export type KeeperColors = TrainerLook;

export const SUN_KEEPER: KeeperColors = {
  skin: C.sand,
  hat: C.cream,
  hatBand: C.orange,
  shirt: C.sunYellow,
  shirtShade: C.orange,
  pants: C.teal,
  boots: C.bark,
  hair: C.wood,
  outline: C.darkPlum,
  hatStyle: 'sun',
};

export const MOON_KEEPER: KeeperColors = {
  skin: C.sand,
  hat: C.plum,
  hatBand: C.violet,
  shirt: C.moonPurple,
  shirtShade: C.darkPlum,
  pants: C.nightBlue,
  boots: C.ink,
  hair: C.darkBark,
  outline: C.ink,
  hatStyle: 'hood',
};

function drawHat(pc: PixelCanvas, col: KeeperColors, headCx: number, headCy: number): void {
  const brimY = headCy - 3;
  switch (col.hatStyle) {
    case 'sun':
      pc.rect(headCx - 8, brimY, 17, 2, col.hat);
      pc.rect(headCx - 8, brimY + 1, 17, 1, col.hatBand);
      pc.ellipse(headCx, brimY - 2, 5, 3, col.hat);
      pc.rect(headCx - 5, brimY - 1, 11, 1, col.hatBand);
      break;
    case 'cap':
      pc.ellipse(headCx, brimY - 1, 5, 3.5, col.hat);
      pc.rect(headCx - 2, brimY + 1, 9, 2, col.hatBand);
      pc.px(headCx, brimY - 4, col.hatBand);
      break;
    case 'beanie':
      pc.ellipse(headCx, brimY - 1, 5.5, 4, col.hat);
      pc.rect(headCx - 5, brimY + 1, 11, 2, col.hatBand);
      pc.disc(headCx, brimY - 5, 1.6, col.hatBand);
      break;
    case 'hood':
      pc.ellipse(headCx, headCy - 1, 6.5, 6, col.hat);
      pc.ellipse(headCx, headCy, 4.5, 4.2, col.skin);
      pc.px(headCx, headCy - 6, col.hatBand);
      break;
    case 'band':
      pc.ellipse(headCx, brimY - 1, 5, 2.5, col.hair);
      pc.rect(headCx - 5, brimY + 1, 11, 2, col.hatBand);
      pc.px(headCx + 4, brimY, col.hat);
      break;
    case 'none':
      pc.ellipse(headCx, brimY, 5, 3, col.hair);
      pc.px(headCx - 3, brimY + 2, col.hair);
      break;
  }
}

/**
 * H12: a named Keeper's silhouette prop, drawn on the 32 px grid over the body. The coat is
 * a long flare (a different shape from the plain tee and shorts, not only a grey one); the
 * bucket hangs from the right hand; the satchel crosses the chest to a hip bag; the shawl
 * is a cape over the shoulders with a fringe.
 */
function drawCoat(
  pc: PixelCanvas,
  angle: DrawnAngle,
  top: number,
  hem: number,
  tx: number,
  tw: number,
): void {
  const side = angle === 'side';
  const cx = tx + tw / 2;
  for (let y = top; y <= hem; y++) {
    const k = (y - top) / Math.max(1, hem - top);
    const half = (side ? tw / 2 + 1 : tw / 2 + 1) + k * (side ? 2.5 : 4.5);
    const row = y >= hem - 1 ? C.greyDeep : C.dusk;
    pc.rect(Math.round(cx - half), y, Math.round(half * 2), 1, row);
    pc.px(Math.round(cx - half), y, C.ink);
    pc.px(Math.round(cx + half) - 1, y, C.greyDeep);
  }
  if (angle === 'front' || angle === 'frontQuarter') {
    pc.thinLine(cx, top + 1, cx, hem - 1, C.greyDeep);
    pc.thinLine(cx - 2.5, top, cx - 0.5, top + 4, C.greyLight);
    pc.thinLine(cx + 2.5, top, cx + 0.5, top + 4, C.greyLight);
  }
  // A high collar.
  pc.rect(Math.round(cx - 3), top - 1, 6, 2, C.greyDeep);
}

function drawBucket(pc: PixelCanvas, hx: number, hy: number): void {
  pc.thinLine(hx, hy, hx - 2, hy + 2, C.darkBark);
  pc.thinLine(hx, hy, hx + 2, hy + 2, C.darkBark);
  pc.rect(hx - 3, hy + 2, 6, 5, C.wood);
  pc.rect(hx - 3, hy + 2, 6, 1, C.sandLight);
  pc.rect(hx + 1, hy + 3, 2, 4, C.bark);
  pc.thinLine(hx - 3, hy + 4, hx + 2, hy + 4, C.darkBark);
}

function drawBasket(
  pc: PixelCanvas,
  angle: DrawnAngle,
  tx: number,
  armY: number,
  swing: number,
): void {
  // A wide woven basket on the left arm, flowers over its rim; the handle is an arc.
  const hx = angle === 'side' ? 14 : tx - 2;
  const y = armY + 5 + swing;
  pc.thinLine(hx - 3, y + 1, hx - 1, y - 2, C.darkBark);
  pc.thinLine(hx - 1, y - 2, hx + 2, y + 1, C.darkBark);
  pc.rect(hx - 5, y + 1, 8, 5, C.wood);
  pc.rect(hx - 5, y + 1, 8, 1, C.sandLight);
  pc.thinLine(hx - 5, y + 3, hx + 2, y + 3, C.darkBark);
  pc.dot(hx - 4, y, C.berry);
  pc.dot(hx - 2, y - 0.5, C.sunYellow);
  pc.dot(hx, y, C.rose);
}

function drawSatchel(
  pc: PixelCanvas,
  angle: DrawnAngle,
  top: number,
  hipY: number,
  tx: number,
  tw: number,
): void {
  const back = angle === 'back' || angle === 'backQuarter';
  if (!back) pc.thinLine(tx + tw - 1, top, tx + 1, hipY - 1, C.darkBark);
  const bx = angle === 'side' ? tx - 1 : tx - 3;
  pc.rect(bx, hipY - 3, 5, 5, C.sandDeep);
  pc.rect(bx, hipY - 3, 5, 1, C.sandLight);
  pc.px(bx + 2, hipY - 1, C.bark);
}

function drawShawl(
  pc: PixelCanvas,
  angle: DrawnAngle,
  top: number,
  hipY: number,
  tx: number,
  tw: number,
): void {
  const cx = tx + tw / 2;
  const back = angle === 'back' || angle === 'backQuarter';
  pc.ellipse(cx, top + 1, tw / 2 + 3.5, 3.2, C.violet);
  pc.thinLine(cx - tw / 2 - 2, top + 3, cx + tw / 2 + 2, top + 3, C.violetLight);
  if (back) {
    for (let y = top + 3; y < hipY; y++) {
      const half = tw / 2 + 3 - (y - top - 3) * 0.35;
      pc.rect(
        Math.round(cx - half),
        y,
        Math.round(half * 2),
        1,
        y % 3 === 0 ? C.violetDeep : C.violet,
      );
    }
  } else {
    // The two ends hang to the waist at the front.
    pc.rect(Math.round(cx - 3.5), top + 3, 2, hipY - top - 3, C.violet);
    pc.rect(Math.round(cx + 1.5), top + 3, 2, hipY - top - 3, C.violetDeep);
  }
  // Fringe.
  for (let x = Math.round(cx - tw / 2 - 3); x <= Math.round(cx + tw / 2 + 2); x += 2)
    pc.px(x, top + 4, C.roseLight);
}

/** Where the figure's parts sit on the 32 px grid this frame, for the accessory drawers. */
interface Rig {
  angle: DrawnAngle;
  torsoTop: number;
  legY: number;
  tx: number;
  tw: number;
  headCx: number;
  headCy: number;
  armY: number;
  swing: number;
}

const isBack = (a: DrawnAngle): boolean => a === 'back' || a === 'backQuarter';

/**
 * M1 and C2: accessories that sit on the body, drawn before the arms so a sleeve crosses
 * them. Each has its own outline (the portrait never leans on colour alone).
 */
function drawBodyAccessory(pc: PixelCanvas, look: NpcLook, g: Rig): void {
  const { angle, torsoTop, legY, tx, tw } = g;
  const cx = tx + tw / 2;
  const [main, trim] = look.pal ?? [C.sandLight, C.bark];
  const side = angle === 'side';
  const back = isBack(angle);
  switch (look.accessory) {
    case 'apron': {
      // A bib to the knee with a pocket; on the back only its ties show.
      if (back) {
        pc.thinLine(tx, torsoTop + 4, tx + tw, torsoTop + 4, trim);
        pc.rect(Math.round(cx) - 1, torsoTop + 4, 2, 2, trim);
        break;
      }
      const w = side ? 3 : tw - 2;
      const x = side ? tx + tw - 3 : tx + 1;
      pc.rect(x, torsoTop + 2, w, legY - torsoTop + 3, main);
      if (!side) {
        pc.thinLine(tx + 1.5, torsoTop + 1, tx + 3, torsoTop + 2, trim);
        pc.thinLine(tx + tw - 1.5, torsoTop + 1, tx + tw - 3, torsoTop + 2, trim);
        pc.rect(Math.round(cx) - 2, legY, 4, 2, trim);
      }
      pc.thinLine(x, legY + 3, x + w, legY + 3, trim);
      break;
    }
    case 'scarf': {
      // Wound at the neck, one long tail down to the knee.
      pc.rect(tx - 1, torsoTop - 1, tw + 2, 2, C.violet);
      pc.thinLine(tx - 1, torsoTop, tx + tw + 1, torsoTop, C.violetLight);
      const tailX = side ? tx + 1 : tx + tw - 2;
      pc.rect(tailX, torsoTop, 3, legY - torsoTop + 5, C.lavender);
      pc.thinLine(tailX + 1, torsoTop + 1, tailX + 1, legY + 3, C.violet);
      for (let x = tailX; x < tailX + 3; x++) pc.px(x, legY + 5, C.violetLight);
      break;
    }
    case 'cloak': {
      // A cape: shoulders and a long back that hangs to the knee.
      pc.ellipse(cx, torsoTop + 1, tw / 2 + 3, 3, C.moonPurple);
      const half = back ? tw / 2 + 3 : tw / 2 + 4;
      for (let y = torsoTop + 2; y < legY + 4; y++) {
        const h = half + (y - torsoTop) * 0.2;
        const x0 = Math.round(cx - h);
        const w = Math.round(h * 2);
        if (back) pc.rect(x0, y, w, 1, y % 4 === 0 ? C.darkPlum : C.moonPurple);
        else {
          pc.rect(x0, y, 2, 1, C.moonPurple);
          pc.rect(x0 + w - 2, y, 2, 1, C.darkPlum);
        }
      }
      pc.dot(cx, torsoTop + 1.5, C.sunYellow);
      break;
    }
    case 'scroll': {
      // A map tube slung across the back: its capped ends show over each shoulder.
      pc.thinLine(tx + tw + 2, torsoTop - 3, tx - 2, legY + 2, C.cream);
      pc.thinLine(tx + tw + 2.5, torsoTop - 3, tx - 1.5, legY + 2, C.sandLight);
      pc.rect(tx + tw + 1, torsoTop - 4, 3, 2, C.bark);
      pc.rect(tx - 3, legY + 1, 3, 2, C.bark);
      if (!back) pc.thinLine(tx + tw - 1, torsoTop, tx + 1, legY - 1, C.darkBark);
      break;
    }
    case 'pack': {
      // A tinker's bundle high on the back with a pot and a ladle hung from it.
      if (back) {
        pc.ellipse(cx, torsoTop + 3, tw / 2 + 3, 5.5, C.bark);
        pc.ellipse(cx, torsoTop + 1.5, tw / 2 + 2, 3, C.wood);
        pc.disc(cx + 3, torsoTop + 7, 2.2, C.greyLight);
        pc.thinLine(cx - 4, torsoTop + 5, cx - 4, torsoTop + 11, C.greyDeep);
      } else {
        pc.ellipse(cx, torsoTop - 1, tw / 2 + 1.5, 3, C.bark);
        pc.disc(side ? tx - 1 : tx - 3, torsoTop + 6, 2.2, C.greyLight);
        pc.thinLine(side ? tx - 1 : tx - 3, torsoTop + 3, cx - 2, torsoTop + 1, C.greyDeep);
      }
      break;
    }
    case 'backpack': {
      // A tall rucksack with a top flap and a pocket; the straps cross the chest.
      if (back) {
        pc.rect(tx - 1, torsoTop - 1, tw + 2, legY - torsoTop + 3, C.berry);
        pc.rect(tx - 1, torsoTop - 1, tw + 2, 3, C.roseDeep);
        pc.rect(tx + 1, torsoTop + 6, tw - 2, 3, C.roseLight);
        pc.dot(cx, torsoTop + 2.5, C.sunYellow);
      } else {
        pc.rect(tx - 2, torsoTop - 1, 2, 7, C.berry);
        pc.rect(tx + tw, torsoTop - 1, 2, 7, C.roseDeep);
        if (!side) {
          pc.thinLine(tx + 2, torsoTop, tx + 2, torsoTop + 6, C.sunYellow);
          pc.thinLine(tx + tw - 2, torsoTop, tx + tw - 2, torsoTop + 6, C.sunYellow);
        }
      }
      break;
    }
    case 'sling': {
      // A big messenger bag on the right hip, a strap over the left shoulder, a star on the flap.
      const bx = side ? tx + tw - 1 : tx + tw - 3;
      if (!back) pc.thinLine(tx + 1, torsoTop, bx + 2, legY - 3, C.tealDeep);
      pc.rect(bx, legY - 4, 6, 7, C.teal);
      pc.rect(bx, legY - 4, 6, 2, C.tealDeep);
      pc.dot(bx + 3, legY - 0.5, C.sunYellow);
      break;
    }
    case 'notebook': {
      // A notebook hung from the belt on a cord.
      const bx = tx - 3;
      pc.thinLine(tx, legY - 1, bx + 2, legY, C.darkBark);
      pc.rect(bx, legY, 4, 6, C.berry);
      pc.rect(bx + 3, legY, 1, 6, C.cream);
      pc.thinLine(bx + 1, legY + 2, bx + 2.5, legY + 2, C.cream);
      break;
    }
    default:
      break;
  }
}

/** M1 and C2: the accessories that sit on the head or stand above it, drawn after the hat. */
function drawHeadAccessory(pc: PixelCanvas, look: NpcLook, g: Rig): void {
  const { angle, headCx, headCy, tx, tw, legY } = g;
  const brimY = headCy - 3;
  const side = angle === 'side';
  const back = isBack(angle);
  switch (look.accessory) {
    case 'goggles': {
      // Big round lenses over the eyes on a strap that circles the head.
      pc.rect(headCx - 5, headCy - 1, 11, 1, C.darkBark);
      if (back) break;
      const lens = (x: number) => {
        pc.disc(x, headCy, 2.2, C.ink);
        pc.disc(x, headCy, 1.4, C.skyLight);
        pc.dot(x - 0.5, headCy - 0.8, C.white);
      };
      if (side) lens(headCx + 3);
      else if (angle === 'front') {
        lens(headCx - 2.4);
        lens(headCx + 2.4);
      } else {
        lens(headCx - 1);
        lens(headCx + 3);
      }
      break;
    }
    case 'headphones': {
      // A band over the crown and a big cup over each ear.
      for (let a = 0; a <= 8; a++) {
        const t = (a / 8) * Math.PI;
        pc.px(headCx - 5 * Math.cos(t), headCy - 1 - 6 * Math.sin(t), C.ink);
      }
      pc.rect(headCx - 7, headCy - 2, 3, 5, C.berry);
      pc.rect(headCx + 4, headCy - 2, 3, 5, C.berry);
      pc.rect(headCx - 7, headCy - 2, 1, 5, C.roseLight);
      pc.rect(headCx + 4, headCy - 2, 1, 5, C.roseLight);
      break;
    }
    case 'visor': {
      // A glowing band across the eyes, a moderator's visor.
      const x = side ? headCx : headCx - 5;
      const w = side ? 6 : 11;
      pc.rect(x, headCy - 1, w, 3, C.ink);
      if (!back) pc.rect(x + 1, headCy, w - 2, 1, C.skyLight);
      break;
    }
    case 'widehat': {
      // A brim wider than the shoulders and a shallow crown.
      pc.ellipse(headCx, brimY + 1, 9.5, 2.4, C.sandDeep);
      pc.ellipse(headCx, brimY - 1.5, 4.8, 3, C.sandDeep);
      pc.rect(headCx - 5, brimY - 0.5, 11, 1, C.bark);
      pc.thinLine(headCx - 8, brimY, headCx + 8, brimY, C.sandLight);
      break;
    }
    case 'cap': {
      // A long peak that sticks out the front (or across the brow from the front).
      if (back) break;
      if (side) pc.rect(headCx + 3, brimY + 1, 7, 2, C.ink);
      else pc.rect(headCx - 5, brimY + 2, 11, 2, C.ink);
      pc.thinLine(headCx - 4, brimY, headCx + 4, brimY, C.mint);
      break;
    }
    case 'bloom': {
      // A big flower pinned over one ear.
      const fx = side ? headCx - 2 : headCx - 5;
      const fy = brimY + 1;
      for (const [dx, dy] of [
        [0, -2],
        [2, -0.6],
        [1.2, 1.8],
        [-1.2, 1.8],
        [-2, -0.6],
      ] as const)
        pc.disc(fx + dx, fy + dy, 1.3, C.sunYellow);
      pc.disc(fx, fy, 1.1, C.orange);
      break;
    }
    case 'antenna': {
      // A thin stalk with a glowing bulb above the head.
      pc.thinLine(headCx, brimY - 1, headCx, brimY - 7, C.lilacGrey);
      pc.disc(headCx, brimY - 8, 1.7, C.mint);
      pc.dot(headCx - 0.5, brimY - 8.5, C.white);
      break;
    }
    case 'broom': {
      // A broom shouldered: its handle rises past the head to a bundle of bristles.
      pc.thinLine(tx + tw + 1, legY - 1, tx + tw + 5, 4, C.bark);
      pc.thinLine(tx + tw + 1.5, legY - 1, tx + tw + 5.5, 4, C.wood);
      pc.tri(tx + tw + 3, 1, tx + tw + 8, 1, tx + tw + 5.5, 6, C.sandDeep);
      pc.thinLine(tx + tw + 5.5, 2, tx + tw + 5.5, 5, C.sandLight);
      break;
    }
    case 'notebook': {
      // A pencil behind the ear.
      if (!back) pc.thinLine(headCx + 4, headCy - 1, headCx + 7, headCy - 5, C.sunYellow);
      break;
    }
    default:
      break;
  }
}

/** M13: two darker patches at the sleeves' elbows. */
function drawPatches(pc: PixelCanvas, g: Rig): void {
  const { angle, tx, tw, armY, swing } = g;
  if (angle === 'side') {
    pc.rect(16 + swing, armY + 3, 2, 2, C.violetDeep);
    return;
  }
  pc.rect(tx - 2, armY + 3 + swing, 2, 2, C.violetDeep);
  pc.rect(tx + tw, armY + 3 - swing, 2, 2, C.violetDeep);
}

/** A nearest-neighbour shrink about the feet, for a smaller figure (Hazel in chapter 11). */
function shrink(src: PixelCanvas, k: number): PixelCanvas {
  const dst = new PixelCanvas(KEEPER_SIZE, KEEPER_SIZE);
  const w = src.width;
  const h = src.height;
  const cx = (w - 1) / 2;
  for (let y = 0; y < h; y++) {
    const sy = Math.round(h - 1 - (h - 1 - y) / k);
    if (sy < 0) continue;
    for (let x = 0; x < w; x++) {
      const sx = Math.round(cx + (x - cx) / k);
      if (sx < 0 || sx >= w) continue;
      dst.data[y * w + x] = src.data[sy * w + sx] ?? 0;
    }
  }
  return dst;
}

/**
 * Campaign graphics 4, package a1: the stage clips on every Keeper sheet, with their frame
 * counts. `sit` (K1) breathes over two frames, `kneel` (K1) is one; each line gesture (K7,
 * `g-nod`...) and the item-get (K39, `itemget`) is one held frame.
 */
export const KEEPER_STAGE_CLIPS = {
  sit: 2,
  kneel: 1,
  itemget: 1,
  'g-nod': 1,
  'g-shrug': 1,
  'g-point': 1,
  'g-down': 1,
  'g-chest': 1,
} as const;
export type KeeperClip = 'idle' | 'walk' | keyof typeof KEEPER_STAGE_CLIPS;

/**
 * K1: the legs of a seated or kneeling figure, drawn where the standing legs would be. The
 * body has dropped 3 px; the boots stay on the ground line.
 */
function drawLowLegs(
  pc: PixelCanvas,
  angle: DrawnAngle,
  kneel: boolean,
  legY: number,
  col: KeeperColors,
): void {
  const pantsShade = shadeOf(col.pants);
  const bootLight = lightOf(col.boots);
  if (angle === 'side') {
    if (kneel) {
      // The back knee on the ground, its shin along the grass; the front thigh forward.
      pc.rect(13, legY, 3, 3, col.pants);
      pc.rect(10, 30, 4, 1, col.pants);
      pc.rect(8, 30, 2, 2, col.boots);
      pc.rect(15, legY, 5, 2, col.pants);
      pc.rect(18, legY + 2, 2, 1, col.pants);
      pc.rect(18, 30, 4, 2, col.boots);
      pc.thinLine(18, 30, 21.5, 30, bootLight);
      return;
    }
    // A thigh straight out in front and the shin hanging from the knee.
    pc.rect(14, legY, 7, 2, col.pants);
    pc.thinLine(14, legY + 1.5, 20.5, legY + 1.5, pantsShade);
    pc.rect(19, legY + 2, 2, 1, col.pants);
    pc.rect(19, 30, 4, 2, col.boots);
    pc.thinLine(19, 30, 22.5, 30, bootLight);
    return;
  }
  const back = angle === 'back' || angle === 'backQuarter';
  if (kneel) {
    // Left knee down (a square of trouser on the ground), right knee up with its boot in front.
    pc.rect(11, legY, 4, 3, col.pants);
    if (!back) pc.thinLine(11, legY + 2.5, 14.5, legY + 2.5, pantsShade);
    pc.rect(17, legY - 1, 4, 2, col.pants);
    pc.rect(17, legY + 1, 3, 1, col.pants);
    pc.rect(16, 30, 5, 2, col.boots);
    pc.thinLine(16, 30, 20, 30, bootLight);
    return;
  }
  // Seated, seen from the front: the knees come toward you, the boots below them.
  pc.rect(11, legY, 4, 2, col.pants);
  pc.rect(17, legY, 4, 2, col.pants);
  if (!back) {
    pc.thinLine(11.5, legY + 0.5, 14, legY + 0.5, lightOf(col.pants));
    pc.thinLine(17.5, legY + 0.5, 20, legY + 0.5, lightOf(col.pants));
  }
  pc.rect(11, 30, 5, 2, col.boots);
  pc.rect(16, 30, 5, 2, col.boots);
  pc.thinLine(11, 30, 15, 30, bootLight);
  pc.thinLine(16, 30, 20, 30, bootLight);
}

/**
 * K7 and K39: the arms of a gesture or the item-get; false for the stock arms. Each has its
 * own shape (arms out, one arm pointing, hands to the chest, both arms up), not a colour.
 */
function drawPoseArms(
  pc: PixelCanvas,
  clip: KeeperClip,
  angle: DrawnAngle,
  tx: number,
  tw: number,
  armY: number,
  col: KeeperColors,
): boolean {
  const side = angle === 'side';
  const hand = col.skin;
  switch (clip) {
    case 'g-shrug':
      if (side) {
        pc.rect(16, armY + 1, 2, 3, col.shirt);
        pc.rect(18, armY, 3, 2, col.shirt);
        pc.px(21, armY - 1, hand);
        return true;
      }
      // Elbows out, forearms up and open, palms up.
      pc.rect(tx - 3, armY + 1, 2, 3, col.shirt);
      pc.rect(tx - 5, armY - 1, 2, 3, col.shirt);
      pc.px(tx - 5, armY - 2, hand);
      pc.rect(tx + tw + 1, armY + 1, 2, 3, col.shirt);
      pc.rect(tx + tw + 3, armY - 1, 2, 3, col.shirt);
      pc.px(tx + tw + 4, armY - 2, hand);
      return true;
    case 'g-point':
      if (side) {
        pc.rect(16, armY + 1, 7, 2, col.shirt);
        pc.px(23, armY + 1, hand);
        pc.px(24, armY + 1, hand);
        return true;
      }
      // The left arm hangs; the right reaches straight out with a finger.
      pc.rect(tx - 2, armY + 1, 2, 5, col.shirt);
      pc.px(tx - 2, armY + 6, hand);
      pc.rect(tx + tw, armY + 1, 6, 2, col.shirt);
      pc.thinLine(tx + tw, armY + 2.5, tx + tw + 5.5, armY + 2.5, col.shirtShade);
      pc.px(tx + tw + 6, armY + 1, hand);
      pc.px(tx + tw + 7, armY + 1, hand);
      return true;
    case 'g-chest':
      if (side) {
        pc.rect(16, armY + 1, 2, 3, col.shirt);
        pc.rect(17, armY + 3, 3, 2, col.shirt);
        pc.px(19, armY + 2, hand);
        return true;
      }
      // Both forearms folded in, the hands meeting over the heart.
      pc.rect(tx - 2, armY + 1, 2, 3, col.shirt);
      pc.rect(tx - 1, armY + 3, 5, 2, col.shirt);
      pc.rect(tx + tw, armY + 1, 2, 3, col.shirt);
      pc.rect(tx + tw - 4, armY + 3, 5, 2, col.shirt);
      pc.px(Math.round(tx + tw / 2) - 1, armY + 2, hand);
      pc.px(Math.round(tx + tw / 2), armY + 2, hand);
      return true;
    case 'itemget':
      if (side) {
        pc.rect(16, armY - 9, 2, 10, col.shirt);
        pc.px(16, armY - 10, hand);
        pc.px(17, armY - 10, hand);
        return true;
      }
      // Both arms straight up beside the head, the hands at the item's corners.
      pc.rect(tx - 2, armY - 9, 2, 10, col.shirt);
      pc.rect(tx + tw, armY - 9, 2, 10, col.shirt);
      pc.px(tx - 2, armY - 10, hand);
      pc.px(tx + tw + 1, armY - 10, hand);
      return true;
    default:
      return false;
  }
}

/** K39: the found thing held overhead: a pale card with a fold line and a glint. */
function drawHeldItem(pc: PixelCanvas, angle: DrawnAngle, top: number): void {
  const x = angle === 'side' ? 13 : 10;
  const w = angle === 'side' ? 7 : 13;
  pc.rect(x, top, w, 4, C.sandLight);
  pc.thinLine(x + 1, top + 2, x + w - 1.5, top + 2, C.bark);
  pc.px(x + w - 2, top + 1, C.white);
}

function drawKeeper(
  angle: DrawnAngle,
  clip: KeeperClip,
  frame: number,
  col: KeeperColors,
  look?: NpcLook,
  expr?: Expression,
  kid = false,
): PixelCanvas {
  const pc = new PixelCanvas(KEEPER_SIZE, KEEPER_SIZE);
  const sitting = clip === 'sit';
  const kneeling = clip === 'kneel';
  const low = sitting || kneeling;
  // K7: a nod and a look down drop the head; a shrug sinks it between the shoulders.
  const headDrop = clip === 'g-down' ? 2 : clip === 'g-nod' || clip === 'g-shrug' ? 1 : 0;
  // Walk: six frames, contact → push-off → passing for each foot.
  const phase = clip === 'walk' ? frame % 6 : 0;
  const bob = (clip === 'walk' && (phase === 2 || phase === 5) ? -1 : 0) + (low ? 3 : 0);
  const breathe =
    (clip === 'idle' && frame % 8 >= 2 && frame % 8 <= 5) || (sitting && frame % 2 === 1) ? 1 : 0;
  const blink = (clip === 'idle' && frame % 8 === 7) || clip === 'g-nod' || clip === 'g-down';
  const feetY = 30;
  const step = clip === 'walk' ? ([2, 1, 0, -2, -1, 0][phase] ?? 0) : 0;

  const pantsShade = shadeOf(col.pants);
  const bootLight = lightOf(col.boots);
  const skinShade = shadeOf(col.skin);

  // Legs / boots, with a seam and a lit sole. Hazel's grandchild is a child: shorter legs,
  // a shorter body and a bigger head.
  const legY = feetY - (kid ? 4 : 5) + bob;
  if (low) {
    drawLowLegs(pc, angle, kneeling, legY, col);
  } else if (angle === 'side') {
    pc.rect(14 + step, legY, 3, 5, col.pants);
    pc.rect(15 - step, legY, 3, 5, col.pants);
    pc.thinLine(16.5 + step, legY, 16.5 + step, legY + 4, pantsShade);
    pc.rect(13 + step, feetY - 1, 4, 2, col.boots);
    pc.rect(15 - step, feetY - 1, 4, 2, col.boots);
    pc.thinLine(13 + step, feetY - 1, 16.5 + step, feetY - 1, bootLight);
  } else {
    pc.rect(12, legY + (step > 0 ? 0 : 1), 3, 5 - (step > 0 ? 0 : 1), col.pants);
    pc.rect(17, legY + (step < 0 ? 0 : 1), 3, 5 - (step < 0 ? 0 : 1), col.pants);
    pc.thinLine(14.5, legY + 1, 14.5, legY + 4, pantsShade);
    pc.thinLine(19.5, legY + 1, 19.5, legY + 4, pantsShade);
    pc.rect(11, feetY - 1, 5, 2, col.boots);
    pc.rect(16, feetY - 1, 5, 2, col.boots);
    pc.thinLine(11, feetY - 1, 15, feetY - 1, bootLight);
    pc.thinLine(16, feetY - 1, 20, feetY - 1, bootLight);
  }

  // Torso: shirt with a lit side, a shaded side, a collar and a belt.
  const torsoTop = legY - (kid ? 6 : 7) + breathe;
  const tx = angle === 'side' ? 12 : 11;
  const tw = angle === 'side' ? 8 : 10;
  pc.rect(tx, torsoTop, tw, 7 - breathe, col.shirt);
  pc.rect(tx + tw - 3, torsoTop + 1, 3, 6 - breathe, col.shirtShade);
  pc.thinLine(tx + 0.5, torsoTop + 1, tx + 0.5, torsoTop + 5 - breathe, lightOf(col.shirt));
  if (angle === 'front' || angle === 'frontQuarter') {
    pc.rect(tx + 2, torsoTop + 1, 2, 5 - breathe, col.shirtShade);
    pc.thinLine(tx + 3, torsoTop, tx + tw - 3, torsoTop, col.shirtShade);
    pc.dot(tx + tw / 2, torsoTop + 0.5, col.skin);
  }
  // Belt.
  pc.rect(tx, legY - 1, tw, 1, col.boots);
  pc.dot(tx + tw / 2, legY - 0.5, C.sunYellow);
  if (look?.accessory === 'coat') drawCoat(pc, angle, torsoTop, feetY - 4, tx, tw);
  // The grandchild's neckerchief, in the role's hat colour with the side's trim at the knot.
  if (kid && angle !== 'back') {
    const nx = angle === 'side' ? tx + tw - 4 : tx + tw / 2;
    pc.tri(nx - 3, torsoTop, nx + 3, torsoTop, nx, torsoTop + 3, col.hat);
    pc.rect(nx - 1, torsoTop, 2, 1, col.hatBand);
  } else if (kid) {
    pc.rect(tx + 1, torsoTop, tw - 2, 1, col.hat);
  }
  const swing = clip === 'walk' ? (phase < 3 ? 1 : -1) : 0;
  const rig: Rig = {
    angle,
    torsoTop,
    legY,
    tx,
    tw,
    headCx: 16,
    headCy: torsoTop - (kid ? 5 : 4) + headDrop,
    armY: torsoTop + 1,
    swing,
  };
  if (look) drawBodyAccessory(pc, look, rig);

  // Arms with cuffs and hands.
  const armY = torsoTop + 1;
  if (drawPoseArms(pc, clip, angle, tx, tw, armY, col)) {
    // K7, K39: the gesture's arms are drawn.
  } else if (angle === 'side') {
    pc.rect(16 + swing, armY + 1, 2, 5, col.shirt);
    pc.thinLine(16 + swing, armY + 5, 18 + swing, armY + 5, col.shirtShade);
    pc.px(17 + swing, armY + 6, col.skin);
  } else {
    pc.rect(tx - 2, armY + 1 + swing, 2, 5, col.shirt);
    pc.rect(tx + tw, armY + 1 - swing, 2, 5, col.shirt);
    pc.thinLine(tx - 2, armY + 5 + swing, tx, armY + 5 + swing, col.shirtShade);
    pc.thinLine(tx + tw, armY + 5 - swing, tx + tw + 2, armY + 5 - swing, col.shirtShade);
    pc.px(tx - 2, armY + 6 + swing, col.skin);
    pc.px(tx + tw + 1, armY + 6 - swing, col.skin);
  }

  if (look?.patches) drawPatches(pc, rig);
  if (look?.accessory === 'basket') drawBasket(pc, angle, tx, armY, swing);
  if (look?.accessory === 'bucket')
    drawBucket(
      pc,
      angle === 'side' ? 17 + swing : tx + tw + 1,
      armY + 6 - (angle === 'side' ? 0 : swing),
    );
  if (look?.accessory === 'satchel') drawSatchel(pc, angle, torsoTop, legY, tx, tw);
  if (look?.accessory === 'shawl') drawShawl(pc, angle, torsoTop, legY, tx, tw);

  // Head: face with whites in the eyes, a brow, a mouth, a jaw shadow, hair under the hat.
  const headCy = torsoTop - (kid ? 5 : 4) + headDrop;
  const headCx = 16;
  if (kid) {
    drawGrandchildHead(pc, angle, headCx, headCy, col, blink);
    if (expr && angle === 'front') drawFace(pc, headCx, headCy + 2, col, expr);
    if (clip === 'itemget') drawHeldItem(pc, angle, armY - 14);
    pc.finish(col.outline, [col.outline, C.white]);
    return pc;
  }
  pc.ellipse(headCx, headCy, 4.5, 4, col.skin);
  pc.ellipse(headCx + 1, headCy + 1.5, 3.5, 2.2, skinShade);
  pc.ellipse(headCx, headCy, 3.8, 3.4, col.skin);
  // Hair showing around the hat line and over the ears.
  pc.ellipse(headCx, headCy - 2.2, 4.6, 1.6, col.hair);
  pc.rect(headCx - 5, headCy - 1.5, 1, 3, col.hair);
  pc.rect(headCx + 4, headCy - 1.5, 1, 3, col.hair);
  if (angle !== 'back' && blink) {
    pc.thinLine(headCx - 2.5, headCy, headCx - 1, headCy, col.outline);
    pc.thinLine(headCx + 1, headCy, headCx + 2.5, headCy, col.outline);
  } else if (angle !== 'back') {
    const eyeY = headCy;
    const eye = (ex: number) => {
      pc.rect(ex - 0.5, eyeY - 0.5, 1.5, 1.5, C.white);
      pc.dot(ex + 0.5, eyeY + 0.5, col.outline);
      pc.dot(ex + 0.5, eyeY, col.outline);
      pc.thinLine(ex - 0.5, eyeY - 1, ex + 1, eyeY - 1, shadeOf(col.hair));
    };
    if (angle === 'front') {
      eye(headCx - 2);
      eye(headCx + 2);
      pc.thinLine(headCx - 0.5, headCy + 2.5, headCx + 1, headCy + 2.5, skinShade);
    } else if (angle === 'frontQuarter') {
      eye(headCx - 1);
      eye(headCx + 3);
      pc.thinLine(headCx + 1, headCy + 2.5, headCx + 2.5, headCy + 2.5, skinShade);
    } else if (angle === 'side') {
      eye(headCx + 3);
      pc.dot(headCx + 4.5, headCy + 2.5, skinShade);
    }
  } else {
    pc.ellipse(headCx, headCy - 1, 4.5, 3, col.hair);
    pc.thinLine(headCx - 3, headCy, headCx + 3, headCy, shadeOf(col.hair));
  }
  if (angle === 'backQuarter') pc.ellipse(headCx - 1, headCy - 1, 4, 3, col.hair);

  // K8: a portrait expression repaints the front face before the hat goes on.
  if (expr && angle === 'front') drawFace(pc, headCx, headCy, col, expr);
  drawHat(pc, col, headCx, headCy);
  if (look) drawHeadAccessory(pc, look, rig);
  if (clip === 'itemget') drawHeldItem(pc, angle, armY - 14);

  const out = look?.scale && look.scale < 1 ? shrink(pc, look.scale) : pc;
  out.finish(col.outline, [col.outline, C.white]);
  return out;
}

export function buildKeeperSheet(col: KeeperColors, look?: NpcLook, kid = false): SpriteSheet {
  const atlas = new AtlasBuilder(KEEPER_SIZE, KEEPER_SIZE, 10);
  for (const clip of ['idle', 'walk'] as const) {
    for (const angle of DRAWN_ANGLES) {
      for (let f = 0; f < CLIPS[clip].frames; f++) {
        atlas.add(frameKey(clip, angle, f), drawKeeper(angle, clip, f, col, look, undefined, kid));
      }
    }
  }
  for (const [clip, frames] of Object.entries(KEEPER_STAGE_CLIPS) as Array<[KeeperClip, number]>)
    for (const angle of DRAWN_ANGLES)
      for (let f = 0; f < frames; f++)
        atlas.add(frameKey(clip, angle, f), drawKeeper(angle, clip, f, col, look, undefined, kid));
  return atlas.build();
}

/**
 * Hazel's grandchild, the player's own avatar (fix pass 2026-10-25): a child's round head
 * with a mop of auburn hair cut in a way no trainer wears (a heavy fringe, a cowlick sprouting at
 * the crown, tufts over the ears), big bright eyes, freckles and rosy cheeks, and no hat.
 * Skin and hair are the grandchild's own (`GRANDCHILD`); only the outfit follows the role.
 */
function drawGrandchildHead(
  pc: PixelCanvas,
  angle: DrawnAngle,
  cx: number,
  cy: number,
  col: KeeperColors,
  blink: boolean,
): void {
  const skinShade = shadeOf(col.skin);
  const hairLight = lightOf(col.hair);
  pc.ellipse(cx, cy, 5.2, 4.8, col.skin);
  pc.ellipse(cx + 1, cy + 2, 4, 2.6, skinShade);
  pc.ellipse(cx, cy + 0.5, 4.6, 4.2, col.skin);
  const back = angle === 'back';
  const side = angle === 'side';
  // The mop: a full round cap of hair over the top half of the head.
  pc.ellipse(cx, cy - 2.4, 5.8, 3.4, col.hair);
  pc.rect(cx - 6, cy - 2, 2, 4, col.hair);
  pc.rect(cx + 4, cy - 2, 2, side ? 2 : 4, col.hair);
  // The cowlick: a curl sprouting from the crown, leaning back.
  const ck = side ? cx - 2 : cx + 1;
  pc.px(ck, cy - 7, col.hair);
  pc.px(ck + (side ? -1 : 1), cy - 8, col.hair);
  pc.px(ck + (side ? -2 : 2), cy - 8, col.hair);
  if (back) {
    pc.ellipse(cx, cy - 0.5, 5.6, 4.4, col.hair);
    pc.thinLine(cx - 3, cy + 1, cx + 3, cy + 1, shadeOf(col.hair));
    return;
  }
  if (angle === 'backQuarter') {
    pc.ellipse(cx - 0.5, cy, 5.4, 4.6, col.hair);
    pc.px(cx + 4, cy + 1, col.skin);
    return;
  }
  // A lit strand across the mop, then the fringe: jagged bangs over the brow.
  pc.thinLine(cx - 3, cy - 4.5, cx + 1, cy - 5, hairLight);
  const fx0 = side ? cx - 2 : cx - 5;
  const fx1 = side ? cx + 5 : cx + 5;
  for (let x = fx0; x < fx1; x += 2)
    pc.rect(x, cy - 1.5, 1, 1 + ((x - fx0) % 4 === 0 ? 1 : 0), col.hair);
  // Big eyes, each with a glint; freckles and rosy cheeks.
  const eye = (ex: number) => {
    if (blink) {
      pc.thinLine(ex - 0.5, cy + 1, ex + 1.5, cy + 1, col.outline);
      return;
    }
    pc.rect(ex - 0.5, cy - 0.5, 2, 2.5, col.outline);
    pc.dot(ex, cy, C.white);
  };
  const cheek = (x: number) => {
    pc.px(x, cy + 2, C.blush);
    pc.dot(x + 0.5, cy + 1.5, C.sandDeep);
  };
  if (angle === 'front') {
    eye(cx - 2.5);
    eye(cx + 1.5);
    cheek(cx - 4);
    cheek(cx + 3);
    pc.thinLine(cx - 1, cy + 3, cx + 1, cy + 3, C.roseDeep);
  } else if (angle === 'frontQuarter') {
    eye(cx - 1);
    eye(cx + 3);
    cheek(cx + 4);
    pc.thinLine(cx + 1, cy + 3, cx + 2.5, cy + 3, C.roseDeep);
  } else {
    eye(cx + 3);
    cheek(cx + 3);
    pc.dot(cx + 5, cy + 2.5, skinShade);
  }
}

/**
 * The grandchild's own skin and hair (a lighter skin and a wine-dark auburn mop, a
 * pairing none of the ten trainers wears), dressed in the role's outfit with the side's trim.
 */
export const GRANDCHILD = { skin: C.sandLight, hair: C.berry } as const;

export function grandchildLook(outfit: KeeperColors): KeeperColors {
  return { ...outfit, skin: GRANDCHILD.skin, hair: GRANDCHILD.hair, hatStyle: 'none' };
}

/** The player's avatar sheet: the grandchild in `outfit` (`keeperOutfit`'s colours). */
export function buildGrandchildSheet(outfit: KeeperColors): SpriteSheet {
  return buildKeeperSheet(grandchildLook(outfit), undefined, true);
}

/** The raw drawer, for previews. */
export const drawKeeperFrame = drawKeeper;

/**
 * H4: the hand lantern, a 2-frame overlay on the same 32 px grid as a Keeper (so it lines
 * up whatever the Keeper's size): the lantern hangs from the right-hand side of the screen,
 * sways one pixel between frames and carries its own glow ('hand-halo', drawn faint).
 */
export function buildHandLanternSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(KEEPER_SIZE, KEEPER_SIZE, 4);
  for (let f = 0; f < 2; f++) {
    const pc = new PixelCanvas(KEEPER_SIZE, KEEPER_SIZE);
    const x = 23 + f;
    pc.thinLine(x + 1.5, 22, x + 1.5, 25, C.darkBark);
    pc.rect(x, 25, 4, 1, C.darkBark);
    pc.rect(x, 26, 4, 4, f === 0 ? C.sunYellow : C.sunLight);
    pc.rect(x + 1, 27, 2, 2, C.cream);
    pc.rect(x, 30, 4, 1, C.darkBark);
    pc.px(x, 26, C.darkBark);
    pc.px(x + 3, 26, C.darkBark);
    pc.finish(C.ink, [C.cream, C.sunYellow, C.sunLight]);
    atlas.add(`hand-${f}`, pc);
  }
  for (const [key, cx, cy, r] of [
    ['hand-halo', 25, 28, 8],
    ['post-halo', 16, 16, 15],
    ['post-halo-small', 16, 16, 8],
  ] as const) {
    const pc = new PixelCanvas(KEEPER_SIZE, KEEPER_SIZE);
    pc.disc(cx, cy, r, C.sunLight);
    atlas.add(key, pc);
  }
  return atlas.build();
}

/**
 * N3: what a cast member holds in the hand on the viewer's right (the hand lantern's place
 * on the same 32 px grid, so it lines up whatever the figure's size). One frame each:
 * `carry-broom`, `carry-notebook`, `carry-egg`, `carry-keys`.
 */
export function buildCarrySheet(): SpriteSheet {
  const atlas = new AtlasBuilder(KEEPER_SIZE, KEEPER_SIZE, 4);
  const frame = (key: string, draw: (pc: PixelCanvas) => void): void => {
    const pc = new PixelCanvas(KEEPER_SIZE, KEEPER_SIZE);
    draw(pc);
    pc.finish(C.ink, [C.cream, C.sunYellow, C.white]);
    atlas.add(key, pc);
  };
  // A broom stood on its bristles: a long handle past the shoulder, bristles at the foot.
  frame('carry-broom', (pc) => {
    pc.thinLine(24.5, 9, 24.5, 26, C.bark);
    pc.thinLine(25, 9, 25, 26, C.wood);
    pc.rect(22, 26, 6, 4, C.sandDeep);
    pc.rect(22, 26, 6, 1, C.sandLight);
    pc.thinLine(23, 28, 23, 30, C.bark);
    pc.thinLine(26, 28, 26, 30, C.bark);
  });
  // A notebook held open at the hip, a ribbon hanging from the spine.
  frame('carry-notebook', (pc) => {
    pc.rect(22, 22, 7, 6, C.berry);
    pc.rect(23, 23, 5, 4, C.cream);
    pc.thinLine(25.5, 22, 25.5, 28, C.roseDeep);
    pc.thinLine(23.5, 24.5, 25, 24.5, C.lilacGrey);
    pc.thinLine(26, 25.5, 27.5, 25.5, C.lilacGrey);
    pc.thinLine(28, 27, 28, 30, C.sunYellow);
  });
  // An egg cradled in the palm, speckled, with the light on its shoulder.
  frame('carry-egg', (pc) => {
    pc.ellipse(24.5, 21, 2.6, 3.4, C.cream);
    pc.ellipse(25.2, 22, 1.8, 2.4, C.sandLight);
    pc.dot(23.6, 19.5, C.white);
    pc.dot(25, 22, C.sandDeep);
    pc.dot(24, 23, C.sandDeep);
    pc.thinLine(22, 24.5, 27.5, 24.5, C.sand);
  });
  // A key ring on a finger, three keys hanging.
  frame('carry-keys', (pc) => {
    pc.thinLine(24.5, 21, 24.5, 24, C.greyDeep);
    pc.disc(24.5, 25, 2, C.sunYellow);
    pc.disc(24.5, 25, 1, C.ink);
    pc.rect(22, 27, 1, 3, C.sunLight);
    pc.rect(24, 28, 1, 3, C.sunYellow);
    pc.rect(26, 27, 1, 3, C.sunLight);
    pc.dot(22, 29.5, C.sunDeep);
    pc.dot(26, 29.5, C.sunDeep);
  });
  return atlas.build();
}
