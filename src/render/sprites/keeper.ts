import type { TrainerLook } from '../../sim/trainers';
import { CLIPS, frameKey } from './animations';
import { DRAWN_ANGLES, type DrawnAngle } from './angles';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C, lightOf, shadeOf } from './palette';
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

function drawKeeper(
  angle: DrawnAngle,
  clip: 'idle' | 'walk',
  frame: number,
  col: KeeperColors,
): PixelCanvas {
  const pc = new PixelCanvas(KEEPER_SIZE, KEEPER_SIZE);
  // Walk: six frames, contact → push-off → passing for each foot.
  const phase = clip === 'walk' ? frame % 6 : 0;
  const bob = clip === 'walk' && (phase === 2 || phase === 5) ? -1 : 0;
  const breathe = clip === 'idle' && frame % 8 >= 2 && frame % 8 <= 5 ? 1 : 0;
  const blink = clip === 'idle' && frame % 8 === 7;
  const feetY = 30;
  const step = clip === 'walk' ? ([2, 1, 0, -2, -1, 0][phase] ?? 0) : 0;

  const pantsShade = shadeOf(col.pants);
  const bootLight = lightOf(col.boots);
  const skinShade = shadeOf(col.skin);

  // Legs / boots, with a seam and a lit sole.
  const legY = feetY - 5 + bob;
  if (angle === 'side') {
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
  const torsoTop = legY - 7 + breathe;
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

  // Arms with cuffs and hands.
  const armY = torsoTop + 1;
  const swing = clip === 'walk' ? (phase < 3 ? 1 : -1) : 0;
  if (angle === 'side') {
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

  // Head: face with whites in the eyes, a brow, a mouth, a jaw shadow, hair under the hat.
  const headCy = torsoTop - 4;
  const headCx = 16;
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

  drawHat(pc, col, headCx, headCy);

  pc.finish(col.outline, [col.outline, C.white]);
  return pc;
}

export function buildKeeperSheet(col: KeeperColors): SpriteSheet {
  const atlas = new AtlasBuilder(KEEPER_SIZE, KEEPER_SIZE, 10);
  for (const clip of ['idle', 'walk'] as const) {
    for (const angle of DRAWN_ANGLES) {
      for (let f = 0; f < CLIPS[clip].frames; f++) {
        atlas.add(frameKey(clip, angle, f), drawKeeper(angle, clip, f, col));
      }
    }
  }
  return atlas.build();
}

/** The raw drawer, for previews. */
export const drawKeeperFrame = drawKeeper;
