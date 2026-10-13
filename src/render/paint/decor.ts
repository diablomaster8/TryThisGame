import { Rng } from '../../sim/rng';
import { frameKey } from '../sprites/animations';
import type { SpriteSheet } from '../sprites/atlas';
import { RasterAtlas } from './atlas';
import { stamp } from './buildings';
import { fbm, ridged, vnoise } from './noise';
import { bush, LEAF, rock } from './props';
import { hex, mix, Raster, rimObjects, shade, type RGB } from './raster';

/**
 * Painted props: everything small that sits on the grass. Items, toys, placed garden
 * pieces, ground dressing, orchard trees and crop rows by stage, the memorial flower.
 * Painted at 32 texels per world unit, which is the sprite batch's native scale, so a
 * frame's width in texels is its width on the ground in units.
 */
const PPU = 32;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function begin(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

function finish(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

/** A noise-edged blob of one material, shaded from the upper left. */
function blob(
  r: Raster,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  light: RGB,
  dark: RGB,
  salt: number,
): void {
  for (let y = Math.floor(cy - ry - 2); y <= cy + ry + 2; y++) {
    for (let x = Math.floor(cx - rx - 2); x <= cx + rx + 2; x++) {
      const a = Math.atan2((y - cy) / ry, (x - cx) / rx);
      const disp = (fbm(Math.cos(a) * 2 + salt, Math.sin(a) * 2, 2, salt) - 0.5) * 0.4;
      const d = Math.hypot((x - cx) / rx, (y - cy) / ry) - disp;
      if (d > 1) continue;
      const lit = clamp01(
        0.65 -
          ((x - cx) / rx) * 0.25 -
          ((y - cy) / ry) * 0.4 +
          (fbm(x / 3, y / 3, 2, salt + 1) - 0.5) * 0.5,
      );
      r.set(x, y, mix(dark, light, lit));
    }
  }
}

// ---------------------------------------------------------------- items

function fruit(tint: [RGB, RGB] = [hex('#ff9a3a'), hex('#b5461f')]): Raster {
  const r = begin(PPU, PPU);
  blob(r, 16, 19, 9, 9, tint[0], tint[1], 3);
  r.ellipse(12.5, 15, 3, 2, mix(tint[0], hex('#ffffff'), 0.55), 0.85);
  r.line(16, 10, 17, 5, hex('#4a2e18'));
  r.line(16, 10, 17.5, 5, hex('#6e4525'));
  r.ellipse(19.5, 6, 3, 1.6, hex('#4a9c42'));
  r.set(18.5, 5.5, hex('#8fd262'));
  return finish(r);
}

const FLAVOUR_TINTS: Record<string, [RGB, RGB]> = {
  swim: [hex('#5ab0f0'), hex('#1f4f8f')],
  fly: [hex('#bfe0ff'), hex('#5a8ac8')],
  run: [hex('#ffe066'), hex('#c98a1a')],
  power: [hex('#ff6b8a'), hex('#8a1f3a')],
  stamina: [hex('#7cc4a4'), hex('#2f6b5a')],
  sun: [hex('#fff1b8'), hex('#e0b84a')],
  moon: [hex('#c9a0ff'), hex('#5b3a8f')],
};

function flower(): Raster {
  const r = begin(PPU, PPU);
  r.line(16, 30, 16, 16, hex('#2f6f32'));
  r.line(17, 30, 17, 16, hex('#4a9c42'));
  r.ellipse(12, 25, 4, 1.6, hex('#3f8f3c'));
  r.ellipse(20.5, 22, 4, 1.6, hex('#4a9c42'));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    r.ellipse(
      16 + Math.cos(a) * 5,
      12 + Math.sin(a) * 5,
      3.4,
      2.6,
      i % 2 ? hex('#ffd4e6') : hex('#ffb3d1'),
    );
  }
  r.disc(16, 12, 2.6, hex('#ffe066'));
  r.set(15, 11, hex('#fff6c0'));
  return finish(r);
}

function ball(): Raster {
  const r = begin(PPU, PPU);
  blob(r, 16, 18, 10, 10, hex('#f4f0e8'), hex('#9a8aa8'), 5);
  for (let y = 8; y <= 28; y++) {
    for (let x = 6; x <= 26; x++) {
      const d = Math.hypot((x - 16) / 10, (y - 18) / 10);
      if (d > 1) continue;
      const band = Math.sin((x - 16) * 0.35 + (y - 18) * 0.2) > 0.55;
      if (band)
        r.set(
          x,
          y,
          mix(hex('#e04a6a'), hex('#ff8ab0'), clamp01(0.6 - (x - 16) / 20 - (y - 18) / 20)),
        );
    }
  }
  r.ellipse(12, 13, 3, 2, hex('#ffffff'), 0.7);
  return finish(r);
}

function notebook(): Raster {
  const r = begin(PPU, PPU);
  for (let y = 10; y < 26; y++) {
    for (let x = 7; x < 25; x++) {
      let c = mix(hex('#7a4f2d'), hex('#a0703a'), vnoise(x / 4, y / 4, 7));
      if (x < 10) c = shade(c, 0.7);
      r.set(x, y + (x - 7) * 0.08, c);
    }
  }
  r.rect(11, 12, 12, 1, hex('#f3e2b6'));
  r.rect(11, 15, 12, 1, hex('#f3e2b6'));
  r.rect(11, 18, 12, 1, hex('#f3e2b6'));
  r.rect(13, 20, 6, 1, hex('#5a3a1f'));
  return finish(r);
}

function radio(): Raster {
  const r = begin(PPU, PPU);
  r.rect(6, 12, 20, 14, hex('#b5461f'));
  for (let y = 12; y < 26; y++)
    for (let x = 6; x < 26; x++)
      r.set(x, y, shade(r.get(x, y), 0.85 + fbm(x / 3, y / 3, 2, 9) * 0.3));
  r.rect(8, 14, 8, 8, hex('#2a2030'));
  r.disc(12, 18, 3, hex('#4a4a56'));
  r.disc(12, 18, 1.3, hex('#1a1624'));
  r.rect(18, 15, 6, 2, hex('#f3e2b6'));
  r.rect(18, 19, 6, 2, hex('#f3e2b6'));
  r.disc(21, 23.5, 1.4, hex('#e0b84a'));
  r.line(22, 12, 28, 2, hex('#4a4a56'));
  r.set(28, 2, hex('#ffffff'));
  r.rect(7, 25, 18, 1, hex('#5a2a12'));
  return finish(r);
}

function blocks(): Raster {
  const r = begin(PPU, PPU);
  const cube = (x: number, y: number, c: RGB) => {
    r.rect(x, y, 10, 10, c);
    r.rect(x, y, 10, 2, shade(c, 1.3));
    r.rect(x, y, 2, 10, shade(c, 1.15));
    r.rect(x + 8, y, 2, 10, shade(c, 0.7));
    r.rect(x, y + 8, 10, 2, shade(c, 0.6));
    r.rect(x + 4, y + 4, 2, 2, shade(c, 0.5));
  };
  cube(4, 18, hex('#e04a6a'));
  cube(16, 18, hex('#3a6ea8'));
  cube(10, 8, hex('#f2d34c'));
  return finish(r);
}

function mirror(): Raster {
  const r = begin(PPU, PPU);
  r.rect(13, 24, 6, 5, hex('#7a4f2d'));
  r.rect(10, 28, 12, 2, hex('#5a3a1f'));
  for (let y = 4; y <= 24; y++) {
    for (let x = 6; x <= 26; x++) {
      const d = Math.hypot((x - 16) / 9, (y - 14) / 11);
      if (d > 1) continue;
      if (d > 0.82) r.set(x, y, mix(hex('#c9944a'), hex('#f3d088'), vnoise(x / 3, y / 3, 11)));
      else
        r.set(
          x,
          y,
          mix(hex('#7fb0e0'), hex('#e8f6ff'), clamp01(0.4 - (x - 16) / 18 - (y - 14) / 22)),
        );
    }
  }
  r.line(11, 10, 14, 6, hex('#ffffff'));
  return finish(r);
}

function tv(): Raster {
  const r = begin(PPU, PPU);
  r.rect(4, 9, 24, 17, hex('#3a3346'));
  for (let y = 9; y < 26; y++)
    for (let x = 4; x < 28; x++)
      r.set(x, y, shade(r.get(x, y), 0.85 + fbm(x / 3, y / 3, 2, 12) * 0.3));
  r.rect(6, 11, 16, 13, hex('#1f3a6e'));
  for (let y = 11; y < 24; y++)
    for (let x = 6; x < 22; x++)
      r.set(x, y, mix(hex('#1f3a6e'), hex('#9ad0ff'), fbm(x / 3, y / 2, 2, 13) * 0.8), 0.9);
  r.rect(7, 12, 8, 3, hex('#dff2ff'), 0.6);
  r.disc(25, 14, 1.4, hex('#e0b84a'));
  r.disc(25, 19, 1.4, hex('#e04a3a'));
  r.rect(8, 26, 16, 3, hex('#2a2030'));
  r.line(10, 9, 6, 2, hex('#4a4a56'));
  r.line(20, 9, 24, 2, hex('#4a4a56'));
  return finish(r);
}

// ---------------------------------------------------------------- dressing

function tuft(): Raster {
  const r = begin(PPU, PPU);
  const rng = new Rng(21);
  for (let i = 0; i < 14; i++) {
    const x = 10 + rng.float(0, 12);
    const h = 5 + rng.float(0, 9);
    const c = mix(hex('#357f36'), hex('#8fd262'), rng.next());
    r.line(x, 30, x + rng.float(-3, 3), 30 - h, c);
  }
  return finish(r);
}

function daisy(): Raster {
  const r = begin(PPU, PPU);
  const rng = new Rng(22);
  for (let k = 0; k < 3; k++) {
    const x = 9 + k * 7 + rng.float(-1, 1);
    const y = 22 + rng.float(-6, 4);
    r.line(x, 30, x, y, hex('#3f8f3c'));
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      r.ellipse(x + Math.cos(a) * 2.6, y + Math.sin(a) * 2.6, 1.8, 1.4, hex('#ffffff'));
    }
    r.disc(x, y, 1.6, hex('#ffe066'));
  }
  return finish(r);
}

function bluebell(): Raster {
  const r = begin(PPU, PPU);
  const rng = new Rng(23);
  for (let k = 0; k < 3; k++) {
    const x = 10 + k * 6 + rng.float(-1, 1);
    const top = 12 + rng.float(-4, 4);
    r.line(x, 30, x + 1.5, top, hex('#3f8f3c'));
    for (let b = 0; b < 3; b++) {
      const y = top + 4 + b * 5;
      r.ellipse(
        x + 1.5 + (b % 2 ? 2 : -2),
        y,
        2.2,
        2.8,
        mix(hex('#5b3a8f'), hex('#c9a0ff'), 0.4 + b * 0.2),
      );
      r.set(x + 1.5 + (b % 2 ? 2 : -2) - 1, y - 1, hex('#e0d0ff'));
    }
  }
  return finish(r);
}

function pebble(): Raster {
  const r = begin(PPU, 20);
  rock(r, 11, 12, 7, 4, 31);
  rock(r, 23, 13, 5, 3, 32);
  return finish(r);
}

function mushroom(): Raster {
  const r = begin(PPU, PPU);
  const cap = (x: number, y: number, rx: number, ry: number, salt: number) => {
    r.rect(x - 2, y, 4, 9, hex('#f3e2b6'));
    r.rect(x - 2, y, 1, 9, hex('#c9ad7c'));
    blob(r, x, y, rx, ry, hex('#ff6b5a'), hex('#8a1f2a'), salt);
    r.set(x - rx * 0.4, y - ry * 0.3, hex('#fff6f0'));
    r.set(x + rx * 0.3, y + ry * 0.2, hex('#fff6f0'));
    r.set(x + 1, y - ry * 0.5, hex('#fff6f0'));
  };
  cap(12, 18, 8, 5, 41);
  cap(23, 22, 5, 3.5, 42);
  return finish(r);
}

function stump(): Raster {
  const r = begin(PPU, PPU);
  for (let y = 14; y < 29; y++) {
    for (let x = 7; x < 25; x++) {
      const edge = Math.abs(x - 16) / 9;
      if (edge > 1 + (vnoise(y / 4, 0, 43) - 0.5) * 0.15) continue;
      r.set(
        x,
        y,
        shade(
          mix(hex('#4a2e18'), hex('#8a5a32'), ridged(x / 4, y / 3, 2, 44)),
          0.7 + (1 - edge) * 0.4,
        ),
      );
    }
  }
  for (let y = 9; y <= 19; y++) {
    for (let x = 6; x <= 26; x++) {
      const d = Math.hypot((x - 16) / 10, (y - 14) / 5);
      if (d > 1) continue;
      r.set(x, y, mix(hex('#d9a76a'), hex('#8a5a32'), Math.abs(Math.sin(d * 11)) * 0.6 + 0.1));
    }
  }
  r.ellipse(22, 26, 4, 2, hex('#4f8a3a'), 0.7);
  return finish(r);
}

function sign(): Raster {
  const r = begin(PPU, PPU);
  for (let i = 0; i < 18; i++)
    stamp(
      r,
      16 + (vnoise(i / 6, 3, 45) - 0.5) * 1.2,
      30 - i,
      1.4,
      mix(hex('#4a2e18'), hex('#8a5a32'), ridged(16, i / 3, 2, 46)),
    );
  for (let y = 6; y < 18; y++) {
    for (let x = 5; x < 27; x++) {
      r.set(x, y, mix(hex('#c9944a'), hex('#e3c48b'), ridged(x / 5, y / 2, 2, 47)));
    }
  }
  r.rect(4, 5, 24, 1, hex('#4a3018'));
  r.rect(4, 18, 24, 1, hex('#4a3018'));
  r.rect(4, 5, 1, 14, hex('#4a3018'));
  r.rect(27, 5, 1, 14, hex('#4a3018'));
  r.rect(8, 9, 10, 1, hex('#5a3a1f'));
  r.rect(8, 12, 14, 1, hex('#5a3a1f'));
  r.rect(8, 15, 7, 1, hex('#5a3a1f'));
  return finish(r);
}

function reed(): Raster {
  const r = begin(PPU, 44);
  const rng = new Rng(48);
  for (let i = 0; i < 5; i++) {
    const x = 9 + i * 3.5 + rng.float(-1, 1);
    const h = 22 + rng.float(0, 16);
    r.line(x, 42, x + rng.float(-3, 3), 42 - h, hex('#3a6b2a'));
    r.ellipse(x + rng.float(-1, 1), 42 - h, 1.3, 3.5, hex('#6b4a2a'));
  }
  return finish(r);
}

function tallgrass(): Raster {
  const r = begin(PPU, PPU);
  const rng = new Rng(49);
  for (let i = 0; i < 22; i++) {
    const x = 6 + rng.float(0, 20);
    const h = 10 + rng.float(0, 18);
    const c = mix(hex('#27602c'), hex('#8fd262'), rng.next());
    r.line(x, 30, x + rng.float(-5, 5), 30 - h, c);
  }
  return finish(r);
}

function lily(): Raster {
  const r = begin(PPU, 20);
  for (let y = 3; y <= 16; y++) {
    for (let x = 3; x <= 29; x++) {
      const rr = Math.hypot((x - 16) / 13, (y - 10) / 6) + (fbm(x / 4, y / 3, 2, 50) - 0.5) * 0.3;
      if (rr > 1 || (x > 20 && Math.abs(y - 10) < 1.5 + (x - 20) * 0.3)) continue;
      r.set(
        x,
        y,
        mix(
          hex('#2f7a33'),
          hex('#8fd262'),
          clamp01(0.5 - (x - 16) / 30 - (y - 10) / 14 + (fbm(x / 3, y / 3, 2, 51) - 0.5) * 0.4),
        ),
      );
    }
  }
  r.disc(12, 8, 2, hex('#ffb3d1'));
  r.set(11, 7, hex('#ffffff'));
  return finish(r);
}

// ---------------------------------------------------------------- placed pieces

function fence(): Raster {
  const r = begin(PPU, PPU);
  for (const px of [8, 24]) {
    for (let i = 0; i < 20; i++) {
      stamp(
        r,
        px + (vnoise(i / 6, px, 52) - 0.5) * 1.2,
        30 - i,
        1.6,
        mix(hex('#6a4525'), hex('#d9a76a'), ridged(px / 3, i / 5, 2, 53) * 0.8 - i / 60),
      );
    }
  }
  for (const ry of [15, 23]) {
    for (let x = 4; x < 28; x++) {
      const g = ridged(x / 5, ry / 2, 2, 54);
      r.set(x, ry + Math.sin((x / 24) * Math.PI) * 0.8, mix(hex('#8a5a32'), hex('#e0b070'), g));
      r.set(x, ry + 1 + Math.sin((x / 24) * Math.PI) * 0.8, mix(hex('#6a4525'), hex('#b4884a'), g));
    }
  }
  return finish(r);
}

function flowerbed(): Raster {
  const r = begin(40, 26);
  const rng = new Rng(55);
  for (let y = 10; y < 24; y++) {
    for (let x = 2; x < 38; x++) {
      const edge = x < 4 || x > 35 || y > 21;
      r.set(
        x,
        y,
        edge ? hex('#5a3a1f') : mix(hex('#3a2616'), hex('#6e4a2a'), fbm(x / 4, y / 4, 2, 56)),
      );
    }
  }
  for (let i = 0; i < 16; i++) {
    const x = 5 + rng.float(0, 30);
    const y = 8 + rng.float(0, 11);
    r.line(x, y + 4, x, y, hex('#3f8f3c'));
    r.disc(
      x,
      y - 1,
      1.8,
      [hex('#ff8ab0'), hex('#ffe066'), hex('#ffffff'), hex('#c9a0ff'), hex('#ff6b5a')][i % 5]!,
    );
    r.set(x - 0.5, y - 1.5, hex('#fff6f0'), 0.7);
  }
  return finish(r);
}

function bench(): Raster {
  const r = begin(44, 30);
  for (const px of [8, 36]) {
    for (let i = 0; i < 12; i++)
      stamp(r, px, 28 - i, 1.4, mix(hex('#4a2e18'), hex('#8a5a32'), ridged(px, i / 3, 2, 57)));
  }
  for (const [y, h] of [
    [14, 3],
    [18, 3],
  ] as const) {
    for (let x = 3; x < 41; x++) {
      for (let yy = 0; yy < h; yy++)
        r.set(
          x,
          y + yy,
          shade(
            mix(hex('#8a5a32'), hex('#d9a76a'), ridged(x / 5, (y + yy) / 2, 2, 58)),
            yy === h - 1 ? 0.7 : 1,
          ),
        );
    }
  }
  for (let x = 6; x < 38; x++)
    for (let yy = 0; yy < 3; yy++)
      r.set(
        x,
        8 + yy,
        shade(mix(hex('#8a5a32'), hex('#d9a76a'), ridged(x / 5, yy, 2, 59)), yy === 2 ? 0.7 : 1),
      );
  for (const px of [9, 35]) r.rect(px, 8, 2, 7, hex('#5a3a1f'));
  return finish(r);
}

function statue(): Raster {
  const r = begin(32, 50);
  for (let y = 38; y < 49; y++) {
    for (let x = 5; x < 27; x++) {
      const edge = ridged(x / 3, y / 3, 2, 60) > 0.84;
      r.set(
        x,
        y,
        edge
          ? hex('#45454f')
          : mix(hex('#8f8f9a'), hex('#c6c6d0'), vnoise(Math.floor(x / 6), Math.floor(y / 4), 61)),
      );
    }
  }
  r.rect(3, 37, 26, 2, hex('#b4b4bf'));
  // A little Nubbin in stone.
  const stone = (x: number, y: number, rx: number, ry: number) =>
    blob(r, x, y, rx, ry, hex('#d0d0d8'), hex('#6f6f7a'), 62);
  stone(16, 28, 7, 7);
  stone(16, 16, 7, 7);
  r.ellipse(16, 8, 3, 2.6, hex('#d0d0d8'));
  r.disc(16, 4, 1.8, hex('#d0d0d8'));
  r.set(13, 15, hex('#45454f'));
  r.set(19, 15, hex('#45454f'));
  r.ellipse(9, 29, 2, 3, hex('#b4b4bf'));
  r.ellipse(23, 29, 2, 3, hex('#b4b4bf'));
  return finish(r);
}

function pathTile(): Raster {
  const r = begin(PPU, PPU);
  for (let y = 4; y < 28; y++) {
    for (let x = 4; x < 28; x++) {
      const d = Math.hypot((x - 16) / 12, (y - 16) / 12) + (fbm(x / 4, y / 4, 2, 63) - 0.5) * 0.4;
      if (d > 1) continue;
      let c = mix(hex('#7a7a88'), hex('#c2c2cc'), fbm(x / 5, y / 5, 2, 64));
      if (ridged(x / 4, y / 4, 2, 65) > 0.85) c = shade(c, 0.6);
      if (d > 0.9) c = shade(c, 0.75);
      r.set(x, y, c);
    }
  }
  return finish(r);
}

function lanternSmall(): Raster {
  const r = begin(PPU, 40);
  for (let i = 0; i < 24; i++)
    stamp(r, 16 + (vnoise(i / 8, 9, 66) - 0.5) * 1.2, 38 - i, 1.1, hex('#2a2030'));
  r.rect(11, 8, 10, 8, hex('#3a2a30'));
  r.rect(12, 9, 8, 6, hex('#fff1b8'));
  r.tri(9, 8, 23, 8, 16, 3, hex('#2a2030'));
  r.rect(13, 16, 6, 1, hex('#2a2030'));
  return finish(r);
}

function rockPile(): Raster {
  const r = begin(44, 34);
  rock(r, 14, 22, 11, 8, 71);
  rock(r, 30, 24, 10, 7, 72);
  rock(r, 22, 13, 9, 7, 73);
  return finish(r);
}

function thicket(): Raster {
  const r = begin(64, 44);
  bush(
    r,
    new Rng(74),
    32,
    40,
    1.2,
    LEAF.map((c) => shade(c, 0.78)),
  );
  return finish(r);
}

// ---------------------------------------------------------------- plants by stage

function treeStage(stage: number): Raster {
  const size = 32 + stage * 16;
  const r = begin(size, size);
  const cx = size / 2;
  const base = size - 3;
  if (stage === 0) {
    r.ellipse(cx, base - 1, 6, 2.5, hex('#4a2e18'));
    r.line(cx, base - 2, cx, base - 8, hex('#3f8f3c'));
    r.ellipse(cx - 2, base - 9, 2.5, 1.8, hex('#8fd262'));
    r.ellipse(cx + 2, base - 8, 2.5, 1.8, hex('#68b94f'));
    return finish(r);
  }
  const trunkH = 8 + stage * 6;
  for (let i = 0; i < trunkH; i++) {
    stamp(
      r,
      cx + (vnoise(i / 6, 1, 75) - 0.5) * 1.5,
      base - i,
      1 + stage * 0.6,
      mix(hex('#4a2e18'), hex('#8a5a32'), ridged(cx, i / 3, 2, 76)),
    );
  }
  const rng = new Rng(77 + stage);
  const rad = 7 + stage * 5;
  for (let i = 0; i < rad * rad * 1.6; i++) {
    const a = rng.float(0, Math.PI * 2);
    const d = Math.sqrt(rng.float(0, 1)) * rad;
    const px = cx + Math.cos(a) * d;
    const py = base - trunkH - rad * 0.3 + Math.sin(a) * d * 0.85;
    if (fbm(px / 6, py / 6, 2, 78) < 0.38 + (d / rad) * 0.3) continue;
    const lightness = clamp01(
      0.4 -
        (Math.sin(a) * d) / (rad * 1.6) -
        (Math.cos(a) * d) / (rad * 3) +
        (fbm(px / 3, py / 3, 2, 79) - 0.5) * 0.7,
    );
    const k = Math.min(LEAF.length - 1, Math.floor(lightness * LEAF.length));
    r.ellipse(px, py, 1.2 + rng.float(0, 0.6), 1, LEAF[k]!, 0.9);
  }
  if (stage === 3) {
    for (let i = 0; i < 5; i++) {
      const a = rng.float(0, Math.PI * 2);
      const d = rng.float(rad * 0.3, rad * 0.8);
      r.disc(
        cx + Math.cos(a) * d,
        base - trunkH - rad * 0.3 + Math.sin(a) * d * 0.85,
        2,
        hex('#ff9a3a'),
      );
    }
  }
  return finish(r);
}

function cropStage(stage: number): Raster {
  const r = begin(PPU, PPU);
  for (let y = 22; y < 29; y++) {
    for (let x = 3; x < 29; x++) {
      r.set(x, y, mix(hex('#3a2616'), hex('#6e4a2a'), fbm(x / 4, y / 4, 2, 80)));
    }
  }
  r.rect(3, 22, 26, 1, hex('#8a6a40'));
  for (const x of [8, 16, 24]) {
    if (stage === 0) {
      r.set(x, 23, hex('#e3c48b'));
      continue;
    }
    const h = 4 + stage * 4;
    r.line(x, 23, x, 23 - h, hex('#4a9c42'));
    if (stage >= 2) {
      r.ellipse(x - 2.5, 23 - h * 0.5, 2.5, 1.4, hex('#8fd262'));
      r.ellipse(x + 2.5, 23 - h * 0.7, 2.5, 1.4, hex('#68b94f'));
    }
    if (stage === 3) {
      r.disc(x, 22 - h, 2.4, hex('#ff9a3a'));
      r.set(x - 1, 21 - h, hex('#ffd0a0'));
    }
  }
  return finish(r);
}

export function buildPaintedProps(): SpriteSheet {
  const atlas = new RasterAtlas(2048);
  const add = (key: string, raster: Raster) => atlas.add(frameKey(key, 'front', 0), raster);
  add('fruit', fruit());
  for (const [f, tint] of Object.entries(FLAVOUR_TINTS)) add(`fruit-${f}`, fruit(tint));
  add('flower', flower());
  add('toy', ball());
  add('notebook', notebook());
  add('radio', radio());
  add('blocks', blocks());
  add('mirror', mirror());
  add('tv', tv());
  add('tuft', tuft());
  add('daisy', daisy());
  add('bluebell', bluebell());
  add('pebble', pebble());
  add('mushroom', mushroom());
  add('stump', stump());
  add('sign', sign());
  add('reed', reed());
  add('tallgrass', tallgrass());
  add('lily', lily());
  add('fence', fence());
  add('flowerbed', flowerbed());
  add('bench', bench());
  add('statue', statue());
  add('pathTile', pathTile());
  add('lanternSmall', lanternSmall());
  add('rockPile', rockPile());
  add('thicket', thicket());
  for (let s = 0; s < 4; s++) {
    add(`treeStage${s}`, treeStage(s));
    add(`cropStage${s}`, cropStage(s));
  }
  return atlas.build();
}
