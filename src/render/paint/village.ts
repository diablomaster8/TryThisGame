import { hex, mix, Raster, rimObjects, shade, type RGB } from './raster';
import { RasterAtlas } from './atlas';
import { ROLE_COLOURS } from '../../config/region-village';
import type { SpriteSheet } from '../sprites/atlas';

/**
 * R0095 (WORLD-32): the village square's pieces in the painted pixel style, about 24 texels a
 * world unit with the foot on the bottom row, in their own small atlas (built on first use):
 * the four service buildings beyond the stall (which reuses the scenery's stall), the
 * fountain, the paving, the dressing pieces and a recruit figure in six role colours with
 * two walking frames. Drawn by `render/region-village.ts`.
 */
const WOOD = hex('#8a5a32');
const DARK = hex('#4a2e18');
const PALE = hex('#d9a76a');
const CREAM = hex('#f4efe6');
const STONE = hex('#b9b4aa');
const DSTONE = hex('#6d685e');
const WATER = hex('#8fd0f0');
const FLAGS = ['#e04a4a', '#f2c84a', '#4aa0e0', '#7ac04a', '#e07ac0', '#ffffff'].map(hex);

function canvas(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

function finish(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

/** A gabled house front: walls `w` wide and `wallH` tall, roof `roof` in colour `rc`. */
function house(w: number, wallH: number, roofH: number, wall: RGB, rc: RGB): Raster {
  const r = canvas(w + 8, wallH + roofH + 4);
  const base = r.h - 1;
  const x0 = 4;
  r.gradient(x0, base - wallH, w, wallH, shade(wall, 1.05), shade(wall, 0.85));
  r.rect(x0, base - 3, w, 3, shade(DSTONE, 0.9));
  // The roof: a triangle over the walls with eaves and a darker underside line.
  const top = base - wallH - roofH;
  r.tri(x0 - 4, base - wallH + 1, x0 + w + 4, base - wallH + 1, x0 + w / 2, top, rc);
  r.tri(x0 - 4, base - wallH + 1, x0 + w / 2, top, x0 + w / 2, base - wallH + 1, shade(rc, 1.15));
  r.rect(x0 - 4, base - wallH, w + 8, 2, shade(rc, 0.6));
  return r;
}

function door(r: Raster, cx: number, w: number, h: number, c: RGB): void {
  r.rect(cx - w / 2, r.h - 1 - h, w, h, c);
  r.rect(cx - w / 2, r.h - 1 - h, w, 1, shade(c, 1.4));
}

function paintGym(): Raster {
  const r = house(84, 40, 26, CREAM, hex('#c8203c'));
  const cx = r.w / 2;
  door(r, cx, 18, 28, DARK);
  // The dumbbell sign over the door.
  r.rect(cx - 16, r.h - 40, 32, 10, PALE);
  r.rect(cx - 10, r.h - 36, 20, 2, DSTONE);
  r.disc(cx - 11, r.h - 35, 4, DSTONE);
  r.disc(cx + 11, r.h - 35, 4, DSTONE);
  for (const wx of [cx - 32, cx + 22]) {
    r.rect(wx, r.h - 30, 10, 10, hex('#7ab0d0'));
    r.rect(wx, r.h - 30, 10, 1, CREAM);
  }
  return finish(r);
}

function paintBathhouse(): Raster {
  const r = house(78, 36, 24, CREAM, hex('#3f78c0'));
  const cx = r.w / 2;
  // The chimney, with a puff of steam.
  r.rect(cx + 18, r.h - 70, 8, 16, DSTONE);
  r.disc(cx + 24, r.h - 76, 4, hex('#eef4f8'), 0.8);
  r.disc(cx + 28, r.h - 82, 3, hex('#eef4f8'), 0.6);
  door(r, cx, 20, 24, DARK);
  for (let i = 0; i < 4; i++) r.rect(cx - 9 + i * 5, r.h - 25, 4, 15, hex('#4fb0b8'));
  r.disc(cx + 18, r.h - 18, 3, hex('#ffe6a0'));
  return finish(r);
}

function paintFortuneTent(): Raster {
  const r = canvas(64, 70);
  const base = r.h - 1;
  const cx = r.w / 2;
  const purple = hex('#7a4aa8');
  r.tri(cx - 28, base - 2, cx + 28, base - 2, cx, 6, purple);
  r.tri(cx, base - 2, cx + 28, base - 2, cx, 6, shade(purple, 0.8));
  for (let i = 0; i < 3; i++) r.line(cx - 14 + i * 14, base - 2, cx, 8, shade(purple, 1.25));
  r.tri(cx - 7, base - 2, cx + 7, base - 2, cx, base - 22, DARK);
  r.disc(cx, 5, 4, hex('#f2c84a'));
  // The little table and its crystal ball, out front.
  r.rect(cx + 14, base - 10, 14, 2, WOOD);
  r.rect(cx + 20, base - 8, 2, 8, DARK);
  r.disc(cx + 21, base - 14, 4, hex('#b8e4ff'));
  r.set(cx + 20, base - 16, CREAM);
  return finish(r);
}

function paintStage(): Raster {
  const r = canvas(110, 66);
  const base = r.h - 1;
  for (const px of [6, r.w - 10]) r.rect(px, base - 60, 4, 60, DARK);
  r.rect(6, base - 60, r.w - 12, 10, hex('#c8203c'));
  for (let i = 0; i < 5; i++) r.disc(18 + i * 18, base - 46, 4, FLAGS[i]!);
  // The platform: planks with a lit edge.
  r.gradient(2, base - 14, r.w - 4, 14, PALE, WOOD);
  for (let x = 10; x < r.w - 4; x += 12) r.rect(x, base - 14, 1, 14, DARK);
  r.rect(2, base - 14, r.w - 4, 1, shade(PALE, 1.2));
  return finish(r);
}

function paintFountain(): Raster {
  const r = canvas(64, 52);
  const base = r.h - 1;
  const cx = r.w / 2;
  r.ellipse(cx, base - 8, 28, 9, DSTONE);
  r.ellipse(cx, base - 12, 28, 9, STONE);
  r.ellipse(cx, base - 12, 24, 7, WATER);
  r.ellipse(cx - 6, base - 13, 8, 2, shade(WATER, 1.2));
  r.rect(cx - 3, base - 38, 6, 26, STONE);
  r.ellipse(cx, base - 38, 11, 4, DSTONE);
  r.ellipse(cx, base - 40, 10, 3, WATER);
  // The spout's arc of water.
  for (const s of [-1, 1])
    for (let i = 0; i < 12; i++)
      r.set(cx + s * i * 1.4, base - 44 + (i * i) / 6, shade(WATER, 1.15));
  r.disc(cx, base - 45, 3, shade(WATER, 1.2));
  return finish(r);
}

/** The square's paving as a flat ground decal, round, 6.2 u in radius. */
function paintPaving(): Raster {
  const R = 74;
  const r = new Raster(R * 2, R * 2, null);
  r.tracking = true;
  for (let y = 0; y < R * 2; y++)
    for (let x = 0; x < R * 2; x++) {
      const dx = x - R + 0.5;
      const dy = y - R + 0.5;
      const d = Math.hypot(dx, dy);
      if (d > R) continue;
      // Rings of cobbles: lighter stones with dark joints.
      const ring = Math.floor(d / 7);
      const a = Math.atan2(dy, dx) * (ring + 2);
      const joint = d % 7 < 1 || Math.abs(Math.sin(a * 1.6)) < 0.08;
      const c = joint ? DSTONE : mix(STONE, CREAM, ((ring * 7 + Math.floor(a)) % 5) / 10);
      r.set(x, y, d > R - 3 ? shade(DSTONE, 1.1) : c);
    }
  return r;
}

function paintBunting(): Raster {
  const r = canvas(48, 64);
  r.rect(22, 2, 3, 62, DARK);
  r.line(0, 6, 47, 6, DARK);
  for (let i = 0; i < 6; i++) r.tri(i * 8 + 1, 7, i * 8 + 7, 7, i * 8 + 4, 15, FLAGS[i]!);
  return finish(r);
}

function paintFlowerBox(): Raster {
  const r = canvas(24, 16);
  r.rect(1, 9, 22, 7, WOOD);
  r.rect(1, 9, 22, 1, PALE);
  for (let i = 0; i < 5; i++) r.disc(4 + i * 4, 6 + (i % 2), 2, FLAGS[(i + 2) % 6]!);
  return finish(r);
}

function paintPennant(): Raster {
  const r = canvas(30, 88);
  r.rect(2, 2, 3, 86, PALE);
  r.tri(5, 4, 28, 10, 5, 16, FLAGS[0]!);
  return finish(r);
}

function paintLamp(): Raster {
  const r = canvas(14, 46);
  r.rect(6, 6, 2, 40, DARK);
  r.disc(7, 6, 4, hex('#ffd27a'));
  r.disc(6, 5, 1, CREAM);
  return finish(r);
}

function paintArch(): Raster {
  const r = canvas(70, 72);
  const cx = r.w / 2;
  const base = r.h - 1;
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.PI;
    const x = cx - Math.cos(t) * 30;
    const y = base - Math.sin(t) * 64;
    r.disc(x, y, 3, hex('#5f9a3e'));
    if (i % 4 === 0) r.disc(x, y - 1, 2, FLAGS[(i / 4) % 6]!);
  }
  return finish(r);
}

/** A recruit: a round body in its role colour, eyes and a little crown; frame 1 bobs. */
function paintFigure(c: RGB, frame: number): Raster {
  const r = canvas(24, 30);
  const base = r.h - 1;
  const lift = frame;
  r.ellipse(12, base - 7 - lift, 9, 7, c);
  r.ellipse(10, base - 9 - lift, 4, 3, shade(c, 1.2));
  r.disc(12, base - 17 - lift, 6, shade(c, 1.05));
  r.set(10, base - 17 - lift, DARK);
  r.set(14, base - 17 - lift, DARK);
  r.tri(10, base - 22 - lift, 14, base - 22 - lift, 12, base - 28 - lift, shade(c, 1.3));
  // Feet.
  r.rect(7 + frame * 2, base - 1, 4, 2, shade(c, 0.6));
  r.rect(13 - frame * 2, base - 1, 4, 2, shade(c, 0.6));
  return finish(r);
}

let sheet: SpriteSheet | null = null;

/** The village atlas, painted the first time the village is drawn. */
export function villageSheet(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(1024);
  atlas.add('gym', paintGym());
  atlas.add('attendant', paintBathhouse());
  atlas.add('fortune', paintFortuneTent());
  atlas.add('festival', paintStage());
  atlas.add('fountain', paintFountain());
  atlas.add('paving', paintPaving());
  atlas.add('bunting', paintBunting());
  atlas.add('flowers', paintFlowerBox());
  atlas.add('pennants', paintPennant());
  atlas.add('lanterns', paintLamp());
  atlas.add('arch', paintArch());
  for (const [role, c] of Object.entries(ROLE_COLOURS))
    for (const f of [0, 1]) atlas.add(`figure-${role}-${f}`, paintFigure(hex(c), f));
  sheet = atlas.build();
  return sheet;
}
