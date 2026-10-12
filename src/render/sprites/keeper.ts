import { CLIPS, frameKey } from './animations';
import { DRAWN_ANGLES, type DrawnAngle } from './angles';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

export const KEEPER_SIZE = 32;

/** The Keeper: a small gardener in a sun hat. Sun and Moon Keepers differ by palette. */
export interface KeeperColors {
  skin: number;
  hat: number;
  hatBand: number;
  shirt: number;
  shirtShade: number;
  pants: number;
  boots: number;
  hair: number;
  outline: number;
}

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
};

function drawKeeper(
  angle: DrawnAngle,
  clip: 'idle' | 'walk',
  frame: number,
  col: KeeperColors,
): PixelCanvas {
  const pc = new PixelCanvas(KEEPER_SIZE, KEEPER_SIZE);
  const bob = clip === 'walk' && frame % 2 === 1 ? -1 : 0;
  const breathe = clip === 'idle' && frame === 1 ? 1 : 0;
  const feetY = 30;
  const step = clip === 'walk' ? (frame % 2 === 0 ? 2 : -2) : 0;

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
    // Apron strap.
    pc.rect(tx + 2, torsoTop + 1, 2, 5 - breathe, col.shirtShade);
  }

  // Arms.
  const armY = torsoTop + 1;
  const swing = clip === 'walk' ? (frame % 2 === 0 ? 1 : -1) : 0;
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
  const headCx = angle === 'side' ? 16 : 16;
  pc.ellipse(headCx, headCy, 4.5, 4, col.skin);
  if (angle !== 'back') {
    // Hair fringe and eyes.
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

  // Sun hat: wide brim, domed top.
  const brimY = headCy - 3;
  pc.rect(headCx - 8, brimY, 17, 2, col.hat);
  pc.rect(headCx - 8, brimY + 1, 17, 1, col.hatBand);
  pc.ellipse(headCx, brimY - 2, 5, 3, col.hat);
  pc.rect(headCx - 5, brimY - 1, 11, 1, col.hatBand);

  pc.outline(col.outline);
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
