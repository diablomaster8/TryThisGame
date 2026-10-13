import type { TrainerLook } from '../../sim/trainers';
import { CLIPS, frameKey } from './animations';
import { DRAWN_ANGLES, type DrawnAngle } from './angles';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
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

  // Legs / boots.
  const legY = feetY - 5 + bob;
  if (angle === 'side') {
    pc.rect(14 + step, legY, 3, 5, col.pants);
    pc.rect(15 - step, legY, 3, 5, col.pants);
    pc.rect(13 + step, feetY - 1, 4, 2, col.boots);
    pc.rect(15 - step, feetY - 1, 4, 2, col.boots);
  } else {
    pc.rect(12, legY + (step > 0 ? 0 : 1), 3, 5 - (step > 0 ? 0 : 1), col.pants);
    pc.rect(17, legY + (step < 0 ? 0 : 1), 3, 5 - (step < 0 ? 0 : 1), col.pants);
    pc.rect(11, feetY - 1, 5, 2, col.boots);
    pc.rect(16, feetY - 1, 5, 2, col.boots);
  }

  // Torso.
  const torsoTop = legY - 7 + breathe;
  const tx = angle === 'side' ? 12 : 11;
  const tw = angle === 'side' ? 8 : 10;
  pc.rect(tx, torsoTop, tw, 7 - breathe, col.shirt);
  pc.rect(tx + tw - 3, torsoTop + 1, 3, 6 - breathe, col.shirtShade);
  if (angle === 'front' || angle === 'frontQuarter') {
    pc.rect(tx + 2, torsoTop + 1, 2, 5 - breathe, col.shirtShade);
  }

  // Arms.
  const armY = torsoTop + 1;
  const swing = clip === 'walk' ? (phase < 3 ? 1 : -1) : 0;
  if (angle === 'side') {
    pc.rect(16 + swing, armY + 1, 2, 5, col.shirt);
    pc.px(17 + swing, armY + 6, col.skin);
  } else {
    pc.rect(tx - 2, armY + 1 + swing, 2, 5, col.shirt);
    pc.rect(tx + tw, armY + 1 - swing, 2, 5, col.shirt);
    pc.px(tx - 2, armY + 6 + swing, col.skin);
    pc.px(tx + tw + 1, armY + 6 - swing, col.skin);
  }

  // Head.
  const headCy = torsoTop - 4;
  const headCx = 16;
  pc.ellipse(headCx, headCy, 4.5, 4, col.skin);
  if (angle !== 'back' && blink) {
    pc.px(headCx - 2, headCy, col.skin);
  } else if (angle !== 'back') {
    const eyeY = headCy;
    if (angle === 'front') {
      pc.px(headCx - 2, eyeY, col.outline);
      pc.px(headCx + 2, eyeY, col.outline);
    } else if (angle === 'frontQuarter') {
      pc.px(headCx - 1, eyeY, col.outline);
      pc.px(headCx + 3, eyeY, col.outline);
    } else if (angle === 'side') {
      pc.px(headCx + 3, eyeY, col.outline);
    }
  } else {
    pc.ellipse(headCx, headCy - 1, 4.5, 3, col.hair);
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
