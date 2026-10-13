/**
 * Five environment samples at rising effort, one vignette each (cottage, tree, path,
 * pond corner, fence, bush), so the art direction can be chosen by eye:
 *
 *   PREVIEW_ENV=path/to/dir npx vitest run tests/tools/env-samples.test.ts
 *
 * Writes env-1.png … env-5.png at 3× and a strip env-all.png.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { C } from '../../src/render/sprites/palette';
import { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { Rng } from '../../src/sim/rng';
import { encodePng, solid } from './png';
import { hexToRgb } from '../../src/render/sprites/pixel-canvas';
import { PALETTE } from '../../src/render/sprites/palette';

/** Blit every physical pixel (the fine grid), unlike png.ts which samples design pixels. */
function blitFine(
  rgba: Uint8Array,
  width: number,
  pc: PixelCanvas,
  ox: number,
  oy: number,
  scale: number,
): void {
  for (let y = 0; y < pc.height; y++) {
    for (let x = 0; x < pc.width; x++) {
      const idx = pc.getFine(x, y);
      if (idx < 0) continue;
      const [r, g, b] = hexToRgb(PALETTE[idx] ?? '#000000');
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          rgba.set([r, g, b, 255], ((oy + y * scale + dy) * width + ox + x * scale + dx) * 4);
        }
      }
    }
  }
}

const W = 176;
const H = 120;

type Level = 1 | 2 | 3 | 4 | 5;

/** A hash-noise helper for dither and scatter that is stable between runs. */
function noise(x: number, y: number, salt = 0): number {
  let h = (x * 374761393 + y * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// ---------------------------------------------------------------- ground

function ground(pc: PixelCanvas, lv: Level): void {
  pc.rect(0, 0, W, H, C.grass);
  if (lv >= 2) {
    // Three-tone drifts and tufts.
    const rng = new Rng(11);
    for (let i = 0; i < 26; i++) {
      pc.ellipse(rng.int(0, W), rng.int(0, H), rng.int(8, 22), rng.int(4, 9), C.leaf);
    }
    for (let i = 0; i < 14; i++) {
      pc.ellipse(rng.int(0, W), rng.int(0, H), rng.int(5, 12), rng.int(3, 6), C.leafLight);
    }
    if (lv >= 3) {
      for (let y = 0; y < H; y += 1) {
        for (let x = 0; x < W; x += 1) {
          if (noise(x, y, 1) < 0.015) pc.dot(x, y, C.deepGreen);
        }
      }
    }
    for (let i = 0; i < (lv >= 3 ? 240 : 120); i++) {
      const x = rng.int(0, W - 1);
      const y = rng.int(0, H - 1);
      const dark = rng.chance(0.5);
      pc.thinLine(x, y, x, y - (lv >= 3 ? 1.5 : 1), dark ? C.deepGreen : C.sprout);
      if (lv >= 3) pc.thinLine(x + 0.5, y, x + 1, y - 1, dark ? C.forest : C.leafLight);
    }
    // Clover and flowers.
    for (let i = 0; i < (lv >= 3 ? 40 : 14); i++) {
      const x = rng.int(2, W - 3);
      const y = rng.int(2, H - 3);
      if (rng.chance(0.5)) {
        pc.dot(x, y, C.white);
        pc.dot(x, y - 0.5, C.sunYellow);
        if (lv >= 3) {
          pc.dot(x - 0.5, y, C.white);
          pc.dot(x + 0.5, y, C.white);
        }
      } else {
        pc.dot(x, y, C.leafLight);
        pc.dot(x + 0.5, y + 0.5, C.sprout);
      }
    }
  }
}

function path(pc: PixelCanvas, lv: Level): void {
  // A curving path from the bottom left to the cottage door, then off right.
  const pts: Array<[number, number]> = [];
  for (let t = 0; t <= 1; t += 0.02) {
    const x = 10 + t * 150;
    const y = 112 - Math.sin(t * Math.PI) * 38 - t * 6;
    pts.push([x, y]);
  }
  const width = 9;
  if (lv >= 2) {
    for (const [x, y] of pts) pc.ellipse(x, y, width / 2 + 1.5, width / 2 - 0.5, C.deepGreen);
  }
  for (const [x, y] of pts) pc.ellipse(x, y, width / 2, width / 2 - 1.5, C.sand);
  if (lv >= 2) {
    for (const [x, y] of pts) pc.ellipse(x, y, width / 2 - 2, width / 2 - 3, C.sandLight);
  }
  if (lv >= 3) {
    // Pebbles and a worn centre.
    const rng = new Rng(3);
    for (const [x, y] of pts) {
      if (rng.chance(0.45)) pc.dot(x + rng.float(-3, 3), y + rng.float(-1.5, 1.5), C.sandDeep);
      if (rng.chance(0.25)) pc.dot(x + rng.float(-3, 3), y + rng.float(-1.5, 1.5), C.greyLight);
    }
  }
  if (lv >= 5) {
    // Flagstones laid into the path near the door, and grass blades over the edge.
    const rng = new Rng(9);
    for (let i = 20; i < 34; i += 2) {
      const [x, y] = pts[i]!;
      pc.ellipse(x, y, 2.6, 1.6, C.greyLight);
      pc.ellipse(x - 0.5, y - 0.5, 1.8, 1, C.pale);
      pc.thinLine(x - 2.4, y + 1.4, x + 2.4, y + 1.4, C.greyDeep);
    }
    for (const [x, y] of pts) {
      if (rng.chance(0.5)) pc.thinLine(x - 5, y - 2, x - 4.5, y - 3.5, C.leaf);
      if (rng.chance(0.5)) pc.thinLine(x + 5, y + 2, x + 5.5, y + 0.5, C.leaf);
    }
  }
}

function pond(pc: PixelCanvas, lv: Level): void {
  const cx = 150;
  const cy = 108;
  const rx = 40;
  const ry = 22;
  if (lv >= 2) pc.ellipse(cx, cy, rx + 4, ry + 3, C.sand);
  if (lv >= 4) pc.ellipse(cx, cy, rx + 2, ry + 1.5, C.sandDeep);
  pc.ellipse(cx, cy, rx, ry, C.water);
  if (lv >= 2) pc.ellipse(cx + 4, cy + 4, rx - 10, ry - 7, C.deepWater);
  if (lv >= 3) {
    // Shallows ring and wave crests.
    pc.ellipse(cx, cy, rx - 1, ry - 1, C.shallows);
    pc.ellipse(cx, cy, rx - 3, ry - 2.5, C.water);
    pc.ellipse(cx + 4, cy + 4, rx - 10, ry - 7, C.deepWater);
    for (let i = 0; i < 8; i++) {
      const x = cx - rx + 8 + i * 8;
      const y = cy - 8 + ((i * 7) % 11);
      pc.thinLine(x, y, x + 4, y, C.shallows);
      pc.dot(x + 5, y - 0.5, C.white);
    }
  }
  if (lv >= 4) {
    // Reflections of the sky and a lit rim on the sun side.
    pc.thinLine(cx - rx + 6, cy - ry + 3, cx - 4, cy - ry + 1, C.skyLight);
    pc.thinLine(cx - rx + 12, cy - ry + 6, cx - 10, cy - ry + 4, C.skyLight);
  }
  if (lv >= 5) {
    // Foam line at the bank, lily pads, reeds, a dragonfly.
    for (let a = 0; a < Math.PI * 2; a += 0.12) {
      const x = cx + Math.cos(a) * (rx - 0.5);
      const y = cy + Math.sin(a) * (ry - 0.5);
      if (noise(Math.round(x), Math.round(y), 5) < 0.55) pc.dot(x, y, C.white);
    }
    for (const [x, y] of [
      [cx - 14, cy - 4],
      [cx - 6, cy + 2],
      [cx - 20, cy + 6],
    ] as const) {
      pc.ellipse(x, y, 3, 1.8, C.leaf);
      pc.ellipse(x - 0.5, y - 0.5, 2, 1, C.leafLight);
      pc.dot(x + 2.5, y, C.water);
    }
    pc.disc(cx - 10, cy - 2.5, 1, C.rose);
    for (const x of [cx - rx + 4, cx - rx + 7, cx - rx + 10]) {
      pc.thinLine(x, cy - 2, x + 1, cy - 14, C.forest);
      pc.ellipse(x + 1, cy - 14, 0.8, 2.2, C.bark);
    }
  }
}

// ---------------------------------------------------------------- cottage

function cottage(pc: PixelCanvas, lv: Level): void {
  const x0 = 48;
  const y0 = 18;
  const w = 56;
  const h = 58;
  const roofH = 24;
  const sun = lv >= 4;
  // Ground shadow / pad.
  if (lv >= 2) pc.ellipse(x0 + w / 2, y0 + h + 2, w / 2 + 8, 7, C.leaf);
  if (sun) pc.ellipse(x0 + w / 2 + 6, y0 + h + 3, w / 2 + 6, 5, C.deepGreen);
  if (lv >= 3) pc.ellipse(x0 + w / 2, y0 + h + 1, w / 2 + 5, 5, C.greyLight);
  // Walls.
  pc.rect(x0, y0 + roofH, w, h - roofH, C.cream);
  if (lv >= 2) {
    pc.rect(x0, y0 + roofH, 1, h - roofH, C.bark);
    pc.rect(x0 + w - 1, y0 + roofH, 1, h - roofH, C.bark);
    pc.rect(x0, y0 + h - 1, w, 1, C.bark);
    pc.rect(x0, y0 + roofH, w, 1, C.bark);
    for (let x = x0 + 8; x < x0 + w - 4; x += 12) pc.thinLine(x, y0 + roofH, x, y0 + h - 1, C.bark);
  }
  if (lv >= 3) {
    // Stone base course and plaster texture.
    for (let x = x0; x < x0 + w; x += 4) {
      pc.rect(x, y0 + h - 6, 3.5, 2.5, C.greyLight);
      pc.rect(x + 2 * ((x / 4) % 2), y0 + h - 3.5, 3.5, 2.5, C.greyDeep);
    }
    for (let i = 0; i < 40; i++) {
      const x = x0 + 2 + noise(i, 1, 7) * (w - 4);
      const y = y0 + roofH + 2 + noise(i, 2, 7) * (h - roofH - 9);
      pc.dot(x, y, C.sandLight);
    }
    // Diagonal braces.
    pc.thinLine(x0 + 2, y0 + h - 8, x0 + 8, y0 + roofH + 2, C.bark);
    pc.thinLine(x0 + w - 3, y0 + h - 8, x0 + w - 9, y0 + roofH + 2, C.bark);
  }
  if (sun) {
    // Shade under the eaves and on the far side.
    pc.rect(x0, y0 + roofH + 1, w, 3, C.sand);
    pc.rect(x0 + w - 6, y0 + roofH + 1, 5, h - roofH - 2, C.sand);
    pc.rect(x0 + w - 2, y0 + roofH + 1, 1, h - roofH - 2, C.sandDeep);
  }
  // Roof.
  pc.tri(x0 - 4, y0 + roofH, x0 + w + 4, y0 + roofH, x0 + w / 2, y0 - 2, C.ember);
  pc.rect(x0 - 4, y0 + roofH - 2, w + 8, 3, C.berry);
  if (lv >= 2) {
    for (let y = y0 + 2; y < y0 + roofH; y += 3) {
      const inset = ((y - y0 + 2) / (roofH + 2)) * (w / 2 + 4);
      pc.thinLine(x0 + w / 2 - inset + 1, y, x0 + w / 2 + inset - 1, y, C.berry);
    }
  }
  if (lv >= 3) {
    // Individual shingles.
    for (let y = y0 + 2; y < y0 + roofH; y += 3) {
      const inset = ((y - y0 + 2) / (roofH + 2)) * (w / 2 + 4);
      const off = ((y - y0) / 3) % 2 === 0 ? 0 : 2;
      for (let x = x0 + w / 2 - inset + 1 + off; x < x0 + w / 2 + inset - 2; x += 4) {
        pc.dot(x, y + 1.5, C.berry);
        pc.dot(x + 1.5, y + 0.5, C.orange);
      }
    }
    // Ridge and chimney.
    pc.thinLine(x0 + w / 2 - 1, y0 - 2, x0 + w / 2 + 1, y0 - 2, C.berry);
    pc.rect(x0 + w - 16, y0 + 2, 6, 10, C.greyDeep);
    pc.rect(x0 + w - 16, y0 + 1, 6, 2, C.greyLight);
    pc.dot(x0 + w - 14, y0 + 5, C.greyLight);
  }
  if (sun) {
    // Lit side of the roof, warm highlight along the eave, cool shade on the far side.
    pc.tri(x0 - 4, y0 + roofH, x0 + w / 2, y0 + roofH, x0 + w / 2, y0 - 2, C.orange);
    for (let y = y0 + 2; y < y0 + roofH; y += 3) {
      const inset = ((y - y0 + 2) / (roofH + 2)) * (w / 2 + 4);
      const off = ((y - y0) / 3) % 2 === 0 ? 0 : 2;
      for (let x = x0 + w / 2 - inset + 1 + off; x < x0 + w / 2; x += 4) {
        pc.dot(x, y + 1.5, C.ember);
        pc.dot(x + 1.5, y + 0.5, C.sunLight);
      }
    }
    pc.thinLine(x0 - 3, y0 + roofH - 2, x0 + w / 2, y0 - 1, C.sunLight);
    pc.tri(x0 + w / 2, y0 + roofH, x0 + w + 4, y0 + roofH, x0 + w / 2, y0 - 2, C.berry);
    for (let y = y0 + 2; y < y0 + roofH; y += 3) {
      const inset = ((y - y0 + 2) / (roofH + 2)) * (w / 2 + 4);
      const off = ((y - y0) / 3) % 2 === 0 ? 0 : 2;
      for (let x = x0 + w / 2 + off; x < x0 + w / 2 + inset - 2; x += 4) {
        pc.dot(x, y + 1.5, C.plum);
        pc.dot(x + 1.5, y + 0.5, C.ember);
      }
    }
    // Smoke.
    if (lv >= 5) {
      pc.ellipse(x0 + w - 12, y0 - 3, 2.2, 1.6, C.pale);
      pc.ellipse(x0 + w - 9, y0 - 7, 2.8, 2, C.pale);
      pc.ellipse(x0 + w - 5, y0 - 11, 3.2, 2.4, C.white);
      pc.dot(x0 + w - 7, y0 - 12, C.pale);
    }
  }
  // Door.
  const dx = x0 + w / 2 - 6;
  const dy = y0 + h - 18;
  pc.rect(dx, dy, 12, 17, C.bark);
  pc.ellipse(dx + 6, dy, 6, 4, C.bark);
  if (lv >= 2) {
    pc.rect(dx + 1, dy + 1, 10, 15, C.wood);
    pc.ellipse(dx + 6, dy + 1, 5, 3, C.wood);
    pc.dot(dx + 9, dy + 9, C.sunYellow);
  }
  if (lv >= 3) {
    for (let y = dy + 3; y < dy + 16; y += 3) pc.thinLine(dx + 2, y, dx + 10, y, C.bark);
    pc.thinLine(dx + 6, dy + 1, dx + 6, dy + 16, C.bark);
    // Step.
    pc.rect(dx - 2, dy + 17, 16, 2, C.greyLight);
    pc.rect(dx - 2, dy + 18.5, 16, 1, C.greyDeep);
  }
  if (sun) pc.rect(dx + 1, dy + 1, 3, 15, C.darkBark);
  // Windows.
  for (const wx of [x0 + 8, x0 + w - 20]) {
    const wy = y0 + roofH + 8;
    pc.rect(wx, wy, 12, 11, C.bark);
    pc.rect(wx + 1, wy + 1, 10, 9, lv >= 4 ? C.skyDeep : C.skyLight);
    if (lv >= 2) {
      pc.thinLine(wx + 6, wy + 1, wx + 6, wy + 10, C.bark);
      pc.thinLine(wx + 1, wy + 5.5, wx + 11, wy + 5.5, C.bark);
    }
    if (lv >= 3) {
      pc.rect(wx - 1, wy + 11, 14, 2, C.bark);
      pc.rect(wx - 1, wy - 1, 14, 1, C.sandLight);
      // Flower box.
      pc.rect(wx, wy + 12, 12, 4, C.wood);
      for (let i = 0; i < 5; i++) {
        pc.dot(wx + 1.5 + i * 2.4, wy + 11.5, i % 2 ? C.rose : C.sunYellow);
        pc.dot(wx + 1 + i * 2.4, wy + 12.5, C.leaf);
      }
      // Shutters.
      pc.rect(wx - 4, wy, 3, 11, C.teal);
      pc.rect(wx + 13, wy, 3, 11, C.teal);
      pc.thinLine(wx - 3, wy + 2, wx - 3, wy + 9, C.tealDeep);
      pc.thinLine(wx + 14, wy + 2, wx + 14, wy + 9, C.tealDeep);
    }
    if (sun) {
      // Glass reflection and warm interior glow.
      pc.thinLine(wx + 2, wy + 3, wx + 4, wy + 1.5, C.white);
      pc.rect(wx + 7, wy + 6.5, 3.5, 3, C.sunLight);
    }
  }
  if (lv >= 5) {
    // A lantern by the door, a signpost, a stacked crate and a cat on the step.
    pc.rect(dx - 8, dy + 4, 1, 14, C.darkBark);
    pc.rect(dx - 10, dy + 2, 5, 5, C.greyDeep);
    pc.rect(dx - 9, dy + 3, 3, 3, C.sunYellow);
    pc.dot(dx - 8.5, dy + 3.5, C.white);
    pc.rect(dx + 18, dy + 8, 7, 9, C.wood);
    pc.thinLine(dx + 18, dy + 8, dx + 25, dy + 17, C.bark);
    pc.thinLine(dx + 25, dy + 8, dx + 18, dy + 17, C.bark);
    pc.rect(dx + 18, dy + 8, 7, 1, C.sandLight);
  }
}

// ---------------------------------------------------------------- tree

function tree(pc: PixelCanvas, lv: Level, cx: number, base: number, size: number): void {
  const r = size;
  if (lv >= 2)
    pc.ellipse(cx + (lv >= 4 ? 6 : 0), base + 1, r * 1.1, r * 0.4, lv >= 4 ? C.deepGreen : C.leaf);
  // Trunk.
  pc.rect(cx - 3, base - r * 1.3, 6, r * 1.3, C.bark);
  if (lv >= 2) {
    pc.rect(cx - 3, base - r * 1.3, 2, r * 1.3, C.darkBark);
    pc.rect(cx - 6, base - 4, 4, 4, C.bark);
    pc.rect(cx + 2, base - 5, 4, 5, C.bark);
    pc.rect(cx - 6, base - 4, 2, 4, C.darkBark);
  }
  if (lv >= 3) {
    for (let y = base - r * 1.2; y < base - 2; y += 3)
      pc.thinLine(cx - 1, y, cx - 0.5, y + 1.5, C.darkBark);
    pc.thinLine(cx + 1.5, base - r * 1.2, cx + 2, base - 4, C.wood);
  }
  // Canopy lobes.
  const lobes: Array<[number, number, number]> = [
    [cx - r * 0.55, base - r * 1.6, r * 0.7],
    [cx + r * 0.55, base - r * 1.6, r * 0.7],
    [cx, base - r * 2.1, r * 0.8],
    [cx - r * 0.3, base - r * 2.5, r * 0.55],
    [cx + r * 0.35, base - r * 2.45, r * 0.55],
  ];
  for (const [x, y, rr] of lobes) {
    pc.ellipse(x, y + rr * 0.25, rr, rr * 0.8, C.leafDeep);
    pc.ellipse(x, y, rr * 0.95, rr * 0.8, C.leaf);
    if (lv >= 2) pc.ellipse(x - rr * 0.25, y - rr * 0.3, rr * 0.55, rr * 0.42, C.leafLight);
  }
  if (lv >= 3) {
    // Leaf clusters and highlights.
    for (let i = 0; i < 70; i++) {
      const [x, y, rr] = lobes[i % lobes.length]!;
      const a = noise(i, 3, 2) * Math.PI * 2;
      const d = noise(i, 4, 2) * rr * 0.85;
      const px = x + Math.cos(a) * d;
      const py = y + Math.sin(a) * d * 0.8;
      const lit = py < y;
      pc.dot(px, py, lit ? C.sprout : C.deepGreen);
      if (lit && noise(i, 5, 2) < 0.4) pc.dot(px + 0.5, py - 0.5, C.leafLight);
    }
    // Fruit.
    for (const [x, y] of [
      [cx - r * 0.7, base - r * 1.5],
      [cx + r * 0.6, base - r * 1.8],
      [cx + r * 0.1, base - r * 2.3],
    ] as const) {
      pc.disc(x, y, 1.3, C.orange);
      pc.dot(x - 0.5, y - 0.5, C.sunLight);
    }
  }
  if (lv >= 4) {
    // Sun from the upper left: lit caps, dark undersides, dapple on the ground.
    for (const [x, y, rr] of lobes) {
      pc.ellipse(x + rr * 0.3, y + rr * 0.45, rr * 0.7, rr * 0.35, C.forest);
      pc.ellipse(x - rr * 0.35, y - rr * 0.42, rr * 0.38, rr * 0.26, C.sprout);
    }
    for (let i = 0; i < 18; i++) {
      const px = cx - r * 0.6 + noise(i, 6, 3) * r * 2.2;
      const py = base - 2 + noise(i, 7, 3) * 6;
      pc.dot(px, py, C.leafLight);
    }
  }
  if (lv >= 5) {
    // Birds and a hanging swing.
    pc.thinLine(cx + r * 1.2, base - r * 2.9, cx + r * 1.4, base - r * 3.1, C.darkPlum);
    pc.thinLine(cx + r * 1.4, base - r * 3.1, cx + r * 1.6, base - r * 2.9, C.darkPlum);
    pc.thinLine(cx + r * 0.9, base - r * 1.3, cx + r * 0.9, base - 8, C.bark);
    pc.thinLine(cx + r * 1.3, base - r * 1.3, cx + r * 1.3, base - 8, C.bark);
    pc.rect(cx + r * 0.9 - 1, base - 8, r * 0.4 + 2, 2, C.wood);
  }
}

function bush(pc: PixelCanvas, lv: Level, cx: number, base: number): void {
  if (lv >= 2) pc.ellipse(cx + (lv >= 4 ? 2 : 0), base, 10, 3, lv >= 4 ? C.deepGreen : C.leaf);
  pc.ellipse(cx, base - 4, 10, 4, C.leafDeep);
  for (const [x, y, rr] of [
    [cx - 5, base - 6, 5],
    [cx + 5, base - 6, 5],
    [cx, base - 9, 6],
  ] as const) {
    pc.ellipse(x, y, rr, rr * 0.8, C.leaf);
    if (lv >= 2) pc.ellipse(x - 1.5, y - 1.5, rr * 0.5, rr * 0.4, C.leafLight);
  }
  if (lv >= 3) {
    for (let i = 0; i < 18; i++) {
      const px = cx - 9 + noise(i, 8, 4) * 18;
      const py = base - 12 + noise(i, 9, 4) * 9;
      pc.dot(px, py, py < base - 8 ? C.sprout : C.deepGreen);
    }
    for (const [x, y] of [
      [cx - 6, base - 7],
      [cx + 4, base - 10],
      [cx + 1, base - 5],
    ] as const) {
      pc.disc(x, y, 1.1, C.berry);
      pc.dot(x - 0.5, y - 0.5, C.rose);
    }
  }
  if (lv >= 4) pc.ellipse(cx + 3, base - 4, 7, 2.5, C.forest);
}

function fence(pc: PixelCanvas, lv: Level, x0: number, y: number, n: number): void {
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 7;
    pc.rect(x, y - 9, 2, 9, C.wood);
    if (lv >= 2) {
      pc.rect(x, y - 9, 1, 9, C.sandLight);
      pc.tri(x - 0.5, y - 9, x + 2.5, y - 9, x + 1, y - 11, C.wood);
    }
    if (lv >= 3) pc.dot(x + 1, y - 1, C.bark);
    if (lv >= 4) pc.rect(x + 1, y - 9, 1, 9, C.bark);
  }
  pc.rect(x0 - 1, y - 7, n * 7 - 4, 1.5, C.wood);
  pc.rect(x0 - 1, y - 4, n * 7 - 4, 1.5, C.wood);
  if (lv >= 3) {
    pc.thinLine(x0 - 1, y - 6.5, x0 + n * 7 - 5, y - 6.5, C.bark);
    pc.thinLine(x0 - 1, y - 3.5, x0 + n * 7 - 5, y - 3.5, C.bark);
  }
  if (lv >= 4) {
    // Shadow on the grass behind the rails.
    pc.rect(x0, y - 2.5, n * 7 - 5, 1, C.deepGreen);
  }
  if (lv >= 5) {
    // Climbing vine and a bird on a post.
    pc.thinLine(x0 + 2, y - 2, x0 + 7, y - 9, C.leaf);
    pc.dot(x0 + 4, y - 5, C.leafLight);
    pc.dot(x0 + 6, y - 8, C.rose);
    pc.ellipse(x0 + n * 7 - 6, y - 12.5, 1.6, 1.2, C.skyDeep);
    pc.dot(x0 + n * 7 - 4.5, y - 13, C.orange);
  }
}

// ---------------------------------------------------------------- the five

function sample(lv: Level): PixelCanvas {
  const pc = new PixelCanvas(W, H);
  ground(pc, lv);
  path(pc, lv);
  pond(pc, lv);
  tree(pc, lv, 20, 60, 14);
  cottage(pc, lv);
  bush(pc, lv, 126, 70);
  fence(pc, lv, 112, 44, 6);
  bush(pc, lv, 36, 96);
  if (lv >= 5) {
    // Wildflower drifts and a stone border along the far side of the path.
    const rng = new Rng(21);
    for (let i = 0; i < 24; i++) {
      const x = rng.int(100, 172);
      const y = rng.int(10, 40);
      pc.dot(x, y, rng.pick([C.rose, C.violet, C.sunYellow, C.white]));
      pc.dot(x, y + 1, C.leaf);
    }
  }
  if (lv >= 4) {
    // Outline the sprites softly against the ground so they read like the batch does.
    pc.outlineColored(C.grass);
  } else {
    pc.outline(C.darkPlum);
  }
  return pc;
}

it.skipIf(!process.env.PREVIEW_ENV)('writes five environment samples at rising effort', () => {
  const dir = process.env.PREVIEW_ENV!;
  mkdirSync(dir, { recursive: true });
  const scale = 3;
  const strip = solid(W * 2 * scale * 5 + 8 * 6, H * 2 * scale + 16, '#1b1326');
  for (let lv = 1 as Level; lv <= 5; lv = (lv + 1) as Level) {
    const pc = sample(lv);
    const rgba = solid(pc.width * scale, pc.height * scale, '#1b1326');
    blitFine(rgba, pc.width * scale, pc, 0, 0, scale);
    writeFileSync(join(dir, `env-${lv}.png`), encodePng(pc.width * scale, pc.height * scale, rgba));
    blitFine(strip, W * 2 * scale * 5 + 8 * 6, pc, 8 + (lv - 1) * (W * 2 * scale + 8), 8, scale);
  }
  writeFileSync(
    join(dir, 'env-all.png'),
    encodePng(W * 2 * scale * 5 + 8 * 6, H * 2 * scale + 16, strip),
  );
  expect(true).toBe(true);
});
