/**
 * Five more buildings for other places, each with a different roof material, on a
 * grass patch in the organic style:
 *
 *   PREVIEW_BUILDINGS=path/to/dir npx vitest run tests/tools/buildings.test.ts
 *
 * Writes building-1.png … building-5.png and buildings-all.png.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { Rng } from '../../src/sim/rng';
import {
  cone,
  eaveShadow,
  flowerBox,
  groundShadow,
  plankDoor,
  plankWall,
  plasterWall,
  roofDome,
  roofShingles,
  roofSlate,
  roofTiles,
  stoneStep,
  stoneWall,
  timber,
  windowPane,
} from './buildings';
import { fbm, ridged, vnoise, warped } from './noise';
import { encodePng } from './png';
import { bloom, grade, hex, mix, Raster, rimObjects, shade, vignette } from './raster';

const CW = 220;
const CH = 190;

function grassPatch(r: Raster, salt: number): void {
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const n = warped(x / 70, y / 70, 0.8, salt);
      const fine = fbm(x / 9, y / 9, 3, salt + 1);
      let c = mix(hex('#3f7f33'), hex('#7bb954'), Math.max(0, Math.min(1, (n - 0.3) * 1.8)));
      c = shade(c, 0.86 + fine * 0.3);
      r.set(x, y, c);
    }
  }
  const rng = new Rng(salt);
  for (let i = 0; i < 2600; i++) {
    const x = rng.int(0, r.w - 1);
    const y = rng.int(0, r.h - 1);
    if (rng.next() > fbm(x / 22, y / 22, 3, salt + 2) * 1.3) continue;
    const base = r.get(x, y);
    r.line(x, y, x + rng.float(-1, 1), y - 1 - Math.round(rng.next() * 2), shade(base, 1.22), 0.9);
  }
}

// ---------------------------------------------------------------- 1. the school hut

/** A round stone hut with a slate cone, a bell gable and a painted sign. */
function schoolHut(r: Raster, rng: Rng): void {
  const cx = CW / 2;
  const base = 150;
  groundShadow(r, cx + 6, base + 2, 62, 10, 1);
  // Round wall: stone, curving away at the sides.
  for (let y = base - 56; y <= base; y++) {
    for (let x = cx - 50; x <= cx + 50; x++) {
      const dx = (x - cx) / 50;
      const curve = Math.sqrt(Math.max(0, 1 - dx * dx));
      if (curve < 0.08) continue;
      const row = Math.floor((y - (base - 56)) / 7);
      const col = Math.floor((x * curve + (row % 2) * 5) / 10);
      const edge = ridged(x / 3, y / 3, 2, 11) > 0.84;
      let c = mix(
        hex('#8f8f9a'),
        hex('#c6c6d0'),
        vnoise(col * 1.7, row * 1.3, 12) * 0.8 + fbm(x / 4, y / 4, 2, 13) * 0.3,
      );
      c = shade(c, 0.55 + curve * 0.5 - dx * 0.15);
      if (edge) c = shade(c, 0.5);
      if (fbm(x / 5, y / 5, 2, 14) > 0.66 && y > base - 14) c = mix(c, hex('#5f8a3a'), 0.4);
      r.set(x, y, c);
    }
  }
  // Slate cone with a soft sag at the eave, and a bell gable on top.
  roofSlate(r, cone(cx, base - 110, base - 52, 62, 4), 15);
  eaveShadow(r, cx - 48, base - 50, 96, 8);
  r.rect(cx - 7, base - 122, 14, 14, hex('#3a2a18'));
  r.tri(cx - 10, base - 122, cx + 10, base - 122, cx, base - 132, hex('#2d3448'));
  r.rect(cx - 5, base - 120, 10, 10, hex('#1a1624'));
  r.ellipse(cx, base - 114, 3, 3.5, hex('#e0b84a'));
  r.set(cx, base - 110, hex('#8a6a20'));
  // Door, window, sign.
  plankDoor(r, cx - 10, base - 30, 20, 30, 16);
  stoneStep(r, cx - 12, base, 24);
  windowPane(r, cx + 18, base - 40, 16, 14, 17);
  windowPane(r, cx - 34, base - 40, 16, 14, 18);
  flowerBox(r, rng, cx + 17, base - 24, 18);
  flowerBox(r, rng, cx - 35, base - 24, 18);
  r.rect(cx - 54, base - 36, 2, 36, hex('#4a3018'));
  r.rect(cx - 70, base - 46, 34, 14, hex('#d9a85a'));
  r.rect(cx - 69, base - 45, 32, 12, hex('#f3d088'));
  for (let i = 0; i < 4; i++)
    r.rect(
      cx - 66 + i * 8,
      base - 41,
      5,
      4,
      [hex('#e04a6a'), hex('#3a6ea8'), hex('#f2d34c'), hex('#3f9a3c')][i]!,
    );
}

// ---------------------------------------------------------------- 2. the dojo

/** A timber hall on a raised floor with a double tiled roof, shoji panels and a noren. */
function dojo(r: Raster, rng: Rng): void {
  const x0 = 24;
  const w = CW - 48;
  const base = 156;
  groundShadow(r, x0 + w / 2 + 8, base + 2, w / 2 + 10, 9, 2);
  // Raised floor on posts.
  r.rect(x0 + 6, base - 10, w - 12, 10, hex('#3a2616'));
  for (let x = x0 + 10; x < x0 + w - 6; x += 14) r.rect(x, base - 10, 3, 10, hex('#241608'));
  r.rect(x0 + 2, base - 12, w - 4, 3, hex('#6e4525'));
  // Wall: dark timber frame with shoji paper between the posts.
  plasterWall(r, x0 + 4, base - 62, w - 8, 50, 21, hex('#f4ecd8'));
  for (let x = x0 + 4; x < x0 + w - 4; x += 1) {
    for (let y = base - 62; y < base - 12; y++) {
      const gx = (x - x0 - 4) % 9 === 0;
      const gy = (y - (base - 62)) % 11 === 0;
      if (gx || gy) r.set(x, y, hex('#5a3a1f'), 0.75);
    }
  }
  for (const px of [x0 + 4, x0 + w / 3, x0 + (2 * w) / 3, x0 + w - 7])
    timber(r, px, base - 64, px, base - 12, 2, 22);
  timber(r, x0, base - 62, x0 + w, base - 62, 1.6, 23);
  // Entry: a dark opening with a noren curtain and two lanterns.
  const ex = x0 + w / 2 - 16;
  r.rect(ex, base - 50, 32, 38, hex('#1a1208'));
  for (let i = 0; i < 3; i++) {
    const cx2 = ex + 2 + i * 10;
    for (let y = base - 50; y < base - 30; y++)
      r.rect(
        cx2,
        y + (vnoise(y / 6, i, 24) - 0.5) * 2,
        8,
        1,
        mix(hex('#1f3a6e'), hex('#2f5a9e'), vnoise(cx2, y / 5, 25)),
      );
  }
  r.rect(ex, base - 51, 32, 2, hex('#6e4525'));
  for (const lx of [ex - 10, ex + 42]) {
    r.rect(lx - 4, base - 44, 8, 11, hex('#e04a3a'));
    r.rect(lx - 3, base - 43, 6, 9, hex('#ff8a5a'));
    r.rect(lx - 2, base - 41, 4, 2, hex('#ffd0a0'));
    r.rect(lx - 1, base - 48, 2, 4, hex('#3a2616'));
  }
  // Lower and upper tiled roofs.
  roofTiles(
    r,
    {
      x0: x0 - 10,
      x1: x0 + w + 10,
      eaveY: base - 66,
      rx0: x0 + 10,
      rx1: x0 + w - 10,
      ridgeY: base - 84,
    },
    26,
  );
  eaveShadow(r, x0 + 4, base - 64, w - 8, 9);
  plasterWall(r, x0 + 28, base - 110, w - 56, 26, 27, hex('#f4ecd8'));
  for (const px of [x0 + 28, x0 + w / 2, x0 + w - 31])
    timber(r, px, base - 110, px, base - 84, 1.6, 28);
  windowPane(r, x0 + w / 2 - 8, base - 104, 16, 12, 29);
  roofTiles(
    r,
    {
      x0: x0 + 12,
      x1: x0 + w - 12,
      eaveY: base - 112,
      rx0: x0 + 60,
      rx1: x0 + w - 60,
      ridgeY: base - 134,
    },
    30,
  );
  eaveShadow(r, x0 + 28, base - 110, w - 56, 7);
  void rng;
}

// ---------------------------------------------------------------- 3. the workshop

/** A plank barn with a shingle roof, an open front with a bench and tools, a stone chimney. */
function workshop(r: Raster, rng: Rng): void {
  const x0 = 30;
  const w = CW - 60;
  const base = 158;
  groundShadow(r, x0 + w / 2 + 8, base + 2, w / 2 + 8, 9, 3);
  plankWall(r, x0, base - 70, w, 70, 31);
  // Open front: a dark bay with a workbench, shelves and tools.
  const bx = x0 + 18;
  r.rect(bx, base - 58, 74, 58, hex('#1e1308'));
  for (let y = base - 58; y < base; y++) {
    for (let x = bx; x < bx + 74; x++)
      r.set(x, y, hex('#3a2616'), fbm(x / 12, y / 12, 2, 32) * 0.5);
  }
  r.rect(bx + 4, base - 24, 62, 5, hex('#8a5a32'));
  r.rect(bx + 4, base - 19, 62, 2, hex('#4a2e18'));
  r.rect(bx + 6, base - 19, 3, 19, hex('#4a2e18'));
  r.rect(bx + 61, base - 19, 3, 19, hex('#4a2e18'));
  r.rect(bx + 10, base - 48, 54, 2, hex('#6e4525'));
  for (let i = 0; i < 5; i++)
    r.rect(
      bx + 14 + i * 10,
      base - 54,
      5,
      6,
      [hex('#9a9aa6'), hex('#c98d4f'), hex('#5f5f6a'), hex('#e0b84a'), hex('#9a9aa6')][i]!,
    );
  r.rect(bx + 20, base - 44, 3, 18, hex('#9a9aa6'));
  r.rect(bx + 18, base - 44, 7, 4, hex('#c6c6d0'));
  r.rect(bx + 40, base - 36, 10, 10, hex('#6e4525'));
  r.rect(bx + 40, base - 36, 10, 2, hex('#9a6a3c'));
  r.ellipse(bx + 50, base - 29, 2.5, 2.5, hex('#5f5f6a'));
  // Doors folded open on either side of the bay.
  plankDoor(r, bx - 12, base - 58, 12, 58, 33, false);
  plankDoor(r, bx + 74, base - 58, 12, 58, 34, false);
  // A barrel and a log pile outside.
  for (let y = base - 18; y < base; y++) {
    const half = 7 + Math.sin(((y - (base - 18)) / 18) * Math.PI) * 1.5;
    r.rect(
      x0 + w - 24 - half,
      y,
      half * 2,
      1,
      mix(hex('#5a3a1f'), hex('#9a6a3c'), ridged((x0 + w - 24) / 3, y / 3, 2, 35)),
    );
  }
  r.rect(x0 + w - 32, base - 14, 16, 2, hex('#3a3a46'));
  r.rect(x0 + w - 32, base - 6, 16, 2, hex('#3a3a46'));
  for (let i = 0; i < 6; i++) {
    const lx = x0 - 14 + (i % 3) * 7;
    const ly = base - 4 - Math.floor(i / 3) * 6;
    r.ellipse(lx, ly, 3.5, 3, hex('#8a5a32'));
    r.ellipse(lx, ly, 2, 1.6, hex('#d9a76a'));
  }
  // Roof: shingles, with a stone chimney and smoke.
  roofShingles(
    r,
    {
      x0: x0 - 10,
      x1: x0 + w + 10,
      eaveY: base - 72,
      rx0: x0 + w / 2 - 8,
      rx1: x0 + w / 2 + 8,
      ridgeY: base - 112,
    },
    36,
  );
  eaveShadow(r, x0, base - 70, w, 9);
  stoneWall(r, x0 + w - 42, base - 124, 14, 36, 37, false, true);
  r.rect(x0 + w - 44, base - 126, 18, 3, hex('#45454f'));
  for (let i = 0; i < 4; i++)
    r.ellipse(
      x0 + w - 35 + i * 3,
      base - 134 - i * 7,
      3 + i,
      2.2 + i * 0.6,
      hex('#e8e2ee'),
      0.55 - i * 0.1,
    );
  void rng;
}

// ---------------------------------------------------------------- 4. the bathhouse

/** A stone bathhouse with a copper dome gone green, a round window, a steaming tub outside. */
function bathhouse(r: Raster, rng: Rng): void {
  const x0 = 40;
  const w = CW - 80;
  const base = 156;
  groundShadow(r, x0 + w / 2 + 8, base + 2, w / 2 + 12, 9, 4);
  stoneWall(r, x0, base - 62, w, 62, 41, true);
  // Cornice and the dome on a short drum.
  r.rect(x0 - 4, base - 66, w + 8, 5, hex('#6a6a76'));
  r.rect(x0 - 4, base - 66, w + 8, 1, hex('#b4b4bf'));
  stoneWall(r, x0 + 18, base - 80, w - 36, 14, 42, true);
  roofDome(r, x0 + w / 2, base - 80, w / 2 - 12, 34, 43);
  eaveShadow(r, x0, base - 61, w, 7);
  // Round window with a rim, a door with a lintel.
  for (let y = -11; y <= 11; y++) {
    for (let x = -11; x <= 11; x++) {
      const d = Math.hypot(x, y);
      if (d > 11) continue;
      const wx = x0 + w / 2 + x;
      const wy = base - 40 + y;
      if (d > 9) r.set(wx, wy, hex('#4a3018'));
      else r.set(wx, wy, mix(hex('#9ad0ff'), hex('#dff2ff'), vnoise(x / 4 + 3, y / 3, 44)));
      if (Math.abs(x) < 1 || Math.abs(y) < 1) r.set(wx, wy, hex('#4a3018'), d < 9 ? 1 : 0);
    }
  }
  plankDoor(r, x0 + 14, base - 32, 18, 32, 45, false);
  r.rect(x0 + 12, base - 35, 22, 3, hex('#6a6a76'));
  stoneStep(r, x0 + 12, base, 22);
  windowPane(r, x0 + w - 36, base - 44, 18, 12, 46, true);
  // The tub, water, steam, a towel on the rail.
  const tx = x0 + w + 2;
  for (let y = base - 16; y < base; y++) {
    const half = 11 + Math.sin(((y - (base - 16)) / 16) * Math.PI) * 1;
    r.rect(
      tx - half,
      y,
      half * 2,
      1,
      mix(hex('#5a3a1f'), hex('#9a6a3c'), ridged(tx / 3, y / 3, 2, 47)),
    );
  }
  r.ellipse(tx, base - 16, 11, 3.5, hex('#4a3018'));
  r.ellipse(tx, base - 16, 9, 2.5, hex('#8ad0f0'));
  r.ellipse(tx - 2, base - 16.5, 4, 1, hex('#dff2ff'), 0.8);
  for (let i = 0; i < 5; i++)
    r.ellipse(
      tx - 6 + i * 3,
      base - 24 - i * 5,
      3 + i * 0.6,
      2 + i * 0.5,
      hex('#eef4ff'),
      0.4 - i * 0.05,
    );
  r.rect(x0 - 16, base - 30, 2, 30, hex('#4a3018'));
  r.rect(x0 - 16, base - 30, 18, 2, hex('#4a3018'));
  for (let y = base - 28; y < base - 10; y++)
    r.rect(
      x0 - 12,
      y,
      9 + (vnoise(y / 4, 2, 48) - 0.5) * 2,
      1,
      mix(hex('#e8a0b8'), hex('#fff0f4'), vnoise(y / 3, 0, 49)),
    );
  void rng;
}

// ---------------------------------------------------------------- 5. the windmill

/** A tapering stone tower with a shingled cap and four lattice sails. */
function windmill(r: Raster, rng: Rng): void {
  const cx = CW / 2 + 10;
  const base = 164;
  groundShadow(r, cx + 6, base + 2, 36, 8, 5);
  // Tapered tower.
  for (let y = base - 96; y <= base; y++) {
    const t = (y - (base - 96)) / 96;
    const half = 18 + t * 14;
    for (let x = cx - half; x <= cx + half; x++) {
      const dx = (x - cx) / half;
      const curve = Math.sqrt(Math.max(0.1, 1 - dx * dx));
      const row = Math.floor((y - (base - 96)) / 6);
      const col = Math.floor((x * curve + (row % 2) * 4) / 8);
      const edge = ridged(x / 3, y / 3, 2, 51) > 0.84;
      let c = mix(
        hex('#8c8c96'),
        hex('#d0d0d8'),
        vnoise(col * 1.9, row * 1.1, 52) * 0.8 + fbm(x / 4, y / 4, 2, 53) * 0.3,
      );
      c = shade(c, 0.5 + curve * 0.55 - dx * 0.15);
      if (edge) c = shade(c, 0.5);
      if (fbm(x / 5, y / 5, 2, 54) > 0.66 && y > base - 16) c = mix(c, hex('#5f8a3a'), 0.4);
      r.set(x, y, c);
    }
  }
  // Cap: a wooden drum and a shingled cone.
  plankWall(r, cx - 20, base - 112, 40, 16, 55, hex('#7a5230'));
  roofShingles(r, cone(cx, base - 140, base - 112, 24, 3), 56);
  eaveShadow(r, cx - 19, base - 111, 38, 6);
  // Sails: four lattice frames on a hub, one tilted.
  const hx = cx + 2;
  const hy = base - 104;
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + 0.35;
    const ex = hx + Math.cos(a) * 54;
    const ey = hy + Math.sin(a) * 54;
    r.line(hx, hy, ex, ey, hex('#3a2616'));
    r.line(hx + 1, hy, ex + 1, ey, hex('#5a3a1f'));
    const px = -Math.sin(a);
    const py = Math.cos(a);
    for (let s = 10; s < 50; s += 2) {
      const sx = hx + Math.cos(a) * s;
      const sy = hy + Math.sin(a) * s;
      const open = Math.floor(s / 8) % 2 === 0;
      r.line(
        sx,
        sy,
        sx + px * 11,
        sy + py * 11,
        open ? hex('#e8e2ee') : hex('#6e4525'),
        open ? 0.85 : 1,
      );
    }
    r.line(
      hx + Math.cos(a) * 10 + px * 11,
      hy + Math.sin(a) * 10 + py * 11,
      ex + px * 11,
      ey + py * 11,
      hex('#3a2616'),
    );
  }
  r.disc(hx, hy, 3.5, hex('#3a2616'));
  r.disc(hx, hy, 1.5, hex('#e0b84a'));
  // Door, a small window, sacks and flowers.
  plankDoor(r, cx - 8, base - 26, 16, 26, 57);
  stoneStep(r, cx - 10, base, 20);
  windowPane(r, cx - 6, base - 60, 12, 10, 58);
  for (let i = 0; i < 3; i++)
    r.ellipse(cx + 34 + i * 9, base - 5, 5, 4.5, mix(hex('#c9a46a'), hex('#e3c48b'), i / 2));
  for (let i = 0; i < 3; i++) r.rect(cx + 33 + i * 9, base - 10, 3, 3, hex('#8a5a32'));
  flowerBox(r, rng, cx - 40, base - 2, 24);
}

// ---------------------------------------------------------------- sheet

it.skipIf(!process.env.PREVIEW_BUILDINGS)('writes five building samples', () => {
  const dir = process.env.PREVIEW_BUILDINGS!;
  mkdirSync(dir, { recursive: true });
  const makers = [schoolHut, dojo, workshop, bathhouse, windmill];
  const sheet = new Raster(CW * 5 + 24, CH + 8, hex('#1b1326'));
  makers.forEach((make, i) => {
    const r = new Raster(CW, CH, hex('#5f9e3c'));
    grassPatch(r, 100 + i);
    r.tracking = true;
    make(r, new Rng(300 + i));
    r.tracking = false;
    rimObjects(r);
    bloom(r, 0.72, 3, 0.25);
    grade(r, hex('#a8b8d0'), hex('#fff4e0'));
    vignette(r, 0.5);
    const o = r.toRgba(3);
    writeFileSync(join(dir, `building-${i + 1}.png`), encodePng(o.width, o.height, o.rgba));
    for (let y = 0; y < CH; y++)
      for (let x = 0; x < CW; x++) sheet.set(4 + i * (CW + 4) + x, 4 + y, r.get(x, y));
  });
  const s = sheet.toRgba(2);
  writeFileSync(join(dir, 'buildings-all.png'), encodePng(s.width, s.height, s.rgba));
  expect(makers).toHaveLength(5);
});
