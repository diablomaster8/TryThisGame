/**
 * R0525 (SOUL-07), lane A round 10: the performance props (a crayon, a bell, a drum, a
 * trumpet) and the twelve crayon doodles a drawing leaves on the ground (a sun, the Keeper, a
 * fruit, a friend, a heart, a flower, a star, a fish, a house, a tree, a moon, a cloud).
 * Drawn once into one small sheet on a 16-pixel grid; both renderers use it (the Full 3D view
 * maps the same texture onto its sprites and decals).
 */
import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';
import type { PerformProp } from '../perform-look';

export const PERFORM_CELL = 16;
export const DOODLE_COUNT = 12;

function prop(kind: PerformProp): PixelCanvas {
  const pc = new PixelCanvas(PERFORM_CELL, PERFORM_CELL);
  switch (kind) {
    case 'crayon':
      // A fat red crayon held point-down, with its paper wrap.
      pc.line(5, 3, 10, 11, C.roseDeep);
      pc.line(6, 3, 11, 11, C.rose);
      pc.line(5, 4, 10, 12, C.rose);
      pc.line(6, 6, 8, 9, C.cream);
      pc.px(11, 12, C.roseDeep);
      pc.px(12, 13, C.ink);
      break;
    case 'bell':
      // A brass hand bell on a wooden handle.
      pc.rect(7, 2, 2, 4, C.wood);
      pc.disc(8, 9, 3.5, C.sunDeep);
      pc.rect(4, 9, 9, 3, C.sunDeep);
      pc.disc(7.4, 8.4, 2.4, C.sunYellow);
      pc.px(6, 7, C.sunLight);
      pc.disc(8, 13, 1.2, C.darkBark);
      break;
    case 'drum':
      // A little red drum with a pale skin and a stick.
      pc.ellipse(8, 7, 5.5, 2, C.cream);
      pc.rect(3, 7, 11, 6, C.roseDeep);
      pc.ellipse(8, 13, 5.5, 1.5, C.roseDeep);
      pc.line(3, 8, 13, 12, C.sunYellow);
      pc.line(3, 12, 13, 8, C.sunYellow);
      pc.ellipse(8, 7, 4.5, 1.3, C.white);
      pc.line(11, 1, 14, 5, C.wood);
      pc.disc(10.5, 1, 1, C.cream);
      break;
    case 'trumpet':
      // A gold trumpet pointing up and out, bell at the top.
      pc.line(3, 13, 10, 5, C.sunDeep);
      pc.line(4, 13, 11, 5, C.sunYellow);
      pc.disc(12, 3.5, 2.8, C.sunDeep);
      pc.disc(12, 3.5, 1.6, C.sunLight);
      pc.rect(6, 9, 3, 2, C.sunDeep);
      pc.px(7, 8, C.white);
      break;
  }
  pc.outline(C.darkPlum);
  return pc;
}

/** A crayon line: two pixels wide, so it reads at the far zoom. */
function stroke(pc: PixelCanvas, pts: number[], col: number): void {
  for (let i = 0; i + 3 < pts.length; i += 2) {
    pc.line(pts[i]!, pts[i + 1]!, pts[i + 2]!, pts[i + 3]!, col);
    pc.line(pts[i]! + 1, pts[i + 1]!, pts[i + 2]! + 1, pts[i + 3]!, col);
  }
}

function ring(pc: PixelCanvas, cx: number, cy: number, r: number, col: number): void {
  const pts: number[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    pts.push(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r));
  }
  stroke(pc, pts, col);
}

function doodle(i: number): PixelCanvas {
  const pc = new PixelCanvas(PERFORM_CELL, PERFORM_CELL);
  switch (i) {
    case 0: // the sun
      ring(pc, 8, 8, 3, C.sunYellow);
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        stroke(
          pc,
          [8 + Math.cos(a) * 5, 8 + Math.sin(a) * 5, 8 + Math.cos(a) * 7, 8 + Math.sin(a) * 7].map(
            Math.round,
          ),
          C.orange,
        );
      }
      break;
    case 1: // the Keeper: a stick figure with a hat
      ring(pc, 8, 4, 2, C.nightBlue);
      stroke(pc, [8, 6, 8, 11, 5, 14], C.nightBlue);
      stroke(pc, [8, 11, 11, 14], C.nightBlue);
      stroke(pc, [4, 8, 12, 8], C.nightBlue);
      stroke(pc, [5, 2, 11, 2], C.roseDeep);
      break;
    case 2: // a fruit
      ring(pc, 8, 9, 4, C.rose);
      stroke(pc, [8, 5, 9, 2], C.darkBark);
      stroke(pc, [9, 3, 12, 2], C.leaf);
      break;
    case 3: // a friend: a round Nubbin with a crown point and two eyes
      ring(pc, 8, 9, 4, C.skyDeep);
      stroke(pc, [8, 5, 8, 2], C.skyDeep);
      pc.rect(6, 8, 1, 2, C.ink);
      pc.rect(10, 8, 1, 2, C.ink);
      stroke(pc, [6, 12, 10, 12], C.rose);
      break;
    case 4: // a heart
      stroke(pc, [8, 13, 3, 7, 4, 4, 6, 3, 8, 6, 10, 3, 12, 4, 13, 7, 8, 13], C.rose);
      break;
    case 5: // a flower
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        ring(pc, 8 + Math.cos(a) * 3, 6 + Math.sin(a) * 3, 1.5, C.violet);
      }
      pc.disc(8, 6, 1.2, C.sunYellow);
      stroke(pc, [8, 9, 8, 15], C.leaf);
      break;
    case 6: // a star
      stroke(
        pc,
        [8, 1, 10, 6, 15, 6, 11, 9, 13, 14, 8, 11, 3, 14, 5, 9, 1, 6, 6, 6, 8, 1],
        C.sunDeep,
      );
      break;
    case 7: // a fish
      stroke(pc, [2, 8, 5, 5, 10, 5, 13, 8, 10, 11, 5, 11, 2, 8], C.teal);
      stroke(pc, [13, 8, 15, 5, 15, 11, 13, 8], C.teal);
      pc.px(5, 7, C.ink);
      break;
    case 8: // a house
      stroke(pc, [3, 8, 8, 3, 13, 8], C.roseDeep);
      stroke(pc, [4, 8, 4, 14, 12, 14, 12, 8], C.bark);
      stroke(pc, [7, 14, 7, 11, 9, 11, 9, 14], C.sunDeep);
      break;
    case 9: // a tree
      ring(pc, 8, 6, 4, C.leaf);
      stroke(pc, [8, 10, 8, 15], C.bark);
      break;
    case 10: // a moon
      stroke(pc, [10, 2, 6, 3, 4, 7, 5, 11, 9, 14, 12, 13, 9, 11, 8, 7, 10, 2], C.lavender);
      break;
    default: // a cloud with rain
      ring(pc, 6, 6, 2.5, C.skyDeep);
      ring(pc, 10, 6, 3, C.skyDeep);
      stroke(pc, [5, 11, 4, 13], C.water);
      stroke(pc, [9, 11, 8, 13], C.water);
      stroke(pc, [12, 11, 11, 13], C.water);
      break;
  }
  return pc;
}

export const doodleKey = (i: number): string => frameKey('doodle', 'front', i);
export const propKey = (p: PerformProp): string => frameKey(`prop-${p}`, 'front', 0);

export function buildPerformSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(PERFORM_CELL, PERFORM_CELL, 8);
  for (const p of ['crayon', 'bell', 'drum', 'trumpet'] as const) atlas.add(propKey(p), prop(p));
  for (let i = 0; i < DOODLE_COUNT; i++) atlas.add(doodleKey(i), doodle(i));
  return atlas.build();
}
