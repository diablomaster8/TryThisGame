import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

export const PARTICLE_SIZE = 8;

/**
 * Tiny sprites for the particle layer: dust puffs, falling leaves, sparkles,
 * fireflies, water ripples, hearts, petals and drops. All 8×8, on the palette,
 * drawn once and shared through the mega atlas.
 */
export type ParticleKind =
  | 'dust'
  | 'leaf'
  | 'sparkle'
  | 'firefly'
  | 'ripple'
  | 'heart'
  | 'petal'
  | 'drop'
  | 'crumb'
  | 'rain'
  | 'snow'
  | 'note'
  | 'splash';

export const PARTICLE_FRAMES: Record<ParticleKind, number> = {
  dust: 3,
  leaf: 2,
  sparkle: 3,
  firefly: 2,
  ripple: 3,
  heart: 2,
  petal: 2,
  drop: 1,
  crumb: 1,
  rain: 1,
  snow: 2,
  note: 2,
  splash: 2,
};

function draw(kind: ParticleKind, f: number): PixelCanvas {
  const pc = new PixelCanvas(PARTICLE_SIZE, PARTICLE_SIZE);
  const c = 4;
  switch (kind) {
    case 'dust':
      // A soft puff that thins out over its three frames.
      if (f === 0) {
        pc.disc(c, c, 2.4, C.sand);
        pc.px(c - 1, c - 1, C.cream);
      } else if (f === 1) {
        pc.disc(c - 1, c, 1.6, C.sand);
        pc.disc(c + 2, c - 1, 1.2, C.sand);
      } else {
        pc.px(c - 2, c, C.sand);
        pc.px(c + 2, c - 2, C.sand);
        pc.px(c + 1, c + 1, C.sand);
      }
      break;
    case 'leaf':
      pc.tri(1, 5, 6, 1, 7, 5, f === 0 ? C.leaf : C.sprout);
      pc.px(4, 3, f === 0 ? C.sprout : C.leaf);
      pc.px(2, 5, C.forest);
      break;
    case 'sparkle':
      if (f === 0) {
        pc.px(c, c, C.white);
      } else if (f === 1) {
        pc.line(c, c - 2, c, c + 2, C.sunLight);
        pc.line(c - 2, c, c + 2, c, C.sunLight);
        pc.px(c, c, C.white);
      } else {
        pc.line(c, c - 3, c, c + 3, C.sunYellow);
        pc.line(c - 3, c, c + 3, c, C.sunYellow);
        pc.px(c - 1, c - 1, C.sunLight);
        pc.px(c + 1, c + 1, C.sunLight);
        pc.px(c + 1, c - 1, C.sunLight);
        pc.px(c - 1, c + 1, C.sunLight);
        pc.px(c, c, C.white);
      }
      break;
    case 'firefly':
      if (f === 0) {
        pc.px(c, c, C.sunYellow);
      } else {
        pc.disc(c, c, 1.4, C.sunLight);
        pc.px(c, c, C.white);
      }
      break;
    case 'ripple': {
      // Three growing rings, drawn flat on the water.
      const r = 1.5 + f * 1.1;
      pc.ellipse(c, c, r, r * 0.6, C.skyLight);
      // Hollow it out so only the ring remains.
      const ir = r - 1;
      for (let y = 0; y < PARTICLE_SIZE; y++) {
        for (let x = 0; x < PARTICLE_SIZE; x++) {
          const dx = (x + 0.5 - c) / ir;
          const dy = (y + 0.5 - c) / (ir * 0.6);
          if (dx * dx + dy * dy <= 1) pc.erase(x, y);
        }
      }
      break;
    }
    case 'heart':
      pc.disc(c - 1.3, c - 1, 1.4, C.rose);
      pc.disc(c + 1.3, c - 1, 1.4, C.rose);
      pc.tri(c - 2.8, c - 0.6, c + 2.8, c - 0.6, c, c + 3, C.rose);
      pc.px(c - 2, c - 2, C.blush);
      if (f === 1) pc.px(c + 1, c - 2, C.blush);
      break;
    case 'petal':
      pc.ellipse(c, c, 2.2, 1.3, f === 0 ? C.blush : C.roseLight);
      pc.px(c - 1, c - 1, C.white);
      break;
    case 'drop':
      pc.px(c, c - 1, C.skyLight);
      pc.px(c, c, C.shallows);
      pc.px(c, c + 1, C.shallows);
      break;
    case 'crumb':
      pc.px(c, c, C.orange);
      pc.px(c + 1, c + 1, C.ember);
      break;
    case 'rain':
      pc.thinLine(c + 1, 0, c - 1, 7, C.skyLight);
      pc.dot(c + 1, 0.5, C.white);
      break;
    case 'snow':
      pc.px(c, c, C.white);
      if (f === 1) {
        pc.dot(c - 0.5, c, C.pale);
        pc.dot(c + 1, c + 0.5, C.pale);
      }
      break;
    case 'note':
      pc.disc(c - 1, c + 1.5, 1.2, C.sunYellow);
      pc.thinLine(c, c + 1.5, c, c - 2.5, C.sunYellow);
      pc.thinLine(c, c - 2.5, c + 2, c - 1.8, C.sunYellow);
      if (f === 1) pc.dot(c + 2.5, c - 1, C.white);
      break;
    case 'splash':
      pc.ellipse(c, c + 1, f === 0 ? 1.4 : 2.6, 0.7, C.skyLight);
      pc.dot(c - 1, c - 1, C.white);
      pc.dot(c + 1.5, c - 0.5, C.white);
      break;
  }
  return pc;
}

export function buildParticleSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(PARTICLE_SIZE, PARTICLE_SIZE, 8);
  for (const kind of Object.keys(PARTICLE_FRAMES) as ParticleKind[]) {
    for (let f = 0; f < PARTICLE_FRAMES[kind]; f++) {
      atlas.add(frameKey(kind, 'front', f), draw(kind, f));
    }
  }
  return atlas.build();
}
