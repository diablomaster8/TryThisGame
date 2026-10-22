import { DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, type Texture } from 'three';
import type { InteriorId } from '../config/stage-marks';
import { CG4_C4 } from '../config/tuning';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { interiorOf, ROOM_FURNITURE, roomOrigin, wallsShown } from './interior-layout';
import { floorTexture, furnitureSheet, IU, wallTexture } from './paint/interiors';
import type { SpriteSheet } from './sprites/atlas';

/**
 * Campaign graphics 4, package c4, pixel renderer (see render/dressings.ts):
 *
 * - K10, interiors: a stage at `place: 'inside-<id>'` draws its room, a painted card set
 *   round `CG4_C4.room.origin` (`paint/interiors.ts`): the floor, the back (feature) wall
 *   and the side walls, with the wall nearest the camera left out so the room opens toward
 *   the view, and the furniture as billboards. Lamp-warm at night (the tint, no flicker).
 *   The room is built the first time it is shown. Marks: `config/stage-marks.ts`.
 */

interface Room {
  group: Group;
  /** N, E, S, W. */
  walls: Mesh[];
  mats: MeshBasicMaterial[];
}

let ctx: PixelDressCtx | null = null;
const rooms = new Map<InteriorId, Room>();
let sheet: SpriteSheet | null = null;

function plane(c: PixelDressCtx, w: number, h: number, map: Texture | null): Mesh {
  const geo = new PlaneGeometry(w, h);
  const mat = new MeshBasicMaterial({
    color: '#ffffff',
    ...(map ? { map } : {}),
    side: DoubleSide,
    toneMapped: false,
  });
  c.track(geo);
  c.track(mat);
  if (map) c.track(map);
  return new Mesh(geo, mat);
}

function buildRoom(c: PixelDressCtx, id: InteriorId): Room {
  const R = CG4_C4.room;
  const o = roomOrigin();
  const group = new Group();
  group.name = `dress-c4-${id}`;
  group.position.set(o.x, 0, o.z);
  const floor = plane(c, R.w, R.d, floorTexture(id, R.w, R.d));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.01;
  group.add(floor);
  // N (the feature wall), E, S, W: each faces into the room.
  const spec: Array<[number, number, number, number, boolean]> = [
    [0, -R.d / 2, 0, R.w, true],
    [R.w / 2, 0, -Math.PI / 2, R.d, false],
    [0, R.d / 2, Math.PI, R.w, false],
    [-R.w / 2, 0, Math.PI / 2, R.d, false],
  ];
  const walls = spec.map(([x, z, ry, len, feature]) => {
    const m = plane(c, len, R.h, wallTexture(id, len, R.h, feature));
    m.position.set(x, R.h / 2, z);
    m.rotation.y = ry;
    group.add(m);
    return m;
  });
  const mats = [floor, ...walls].map((m) => m.material as MeshBasicMaterial);
  group.visible = false;
  c.scene.add(group);
  return { group, walls, mats };
}

/** The camera's ground direction from the room, read through the pixel camera. */
function camDir(c: PixelDressCtx): { x: number; z: number } {
  const o = roomOrigin();
  const s0 = c.camera.toScreen(o.x, 0, o.z);
  const sx = c.camera.toScreen(o.x + 1, 0, o.z);
  const sz = c.camera.toScreen(o.x, 0, o.z + 1);
  // Down the screen is toward the camera.
  if (!s0 || !sx || !sz) return { x: 0, z: 1 };
  return { x: sx.y - s0.y, z: sz.y - s0.y };
}

export const dressC4: PixelDressing = {
  id: 'c4',
  build(c) {
    ctx = c;
    rooms.clear();
    sheet = null;
  },
  update(world, stage, daylight) {
    if (!ctx) return;
    const id = interiorOf(stage);
    for (const [k, r] of rooms) r.group.visible = k === id;
    if (!id || typeof document === 'undefined') return;
    let room = rooms.get(id);
    if (!room) {
      room = buildRoom(ctx, id);
      rooms.set(id, room);
    }
    room.group.visible = true;
    const shown = wallsShown(camDir(ctx));
    room.walls.forEach((w, i) => (w.visible = shown[i]!));
    // Daylight through the windows by day; lamp-warm by night, never dark.
    const L = CG4_C4.light;
    const k = Math.min(1, daylight.darkness / 0.7);
    const r = 1 - k * (1 - L.nightTint[0]);
    const g = 1 - k * (1 - L.nightTint[1]);
    const b = 1 - k * (1 - L.nightTint[2]);
    for (const m of room.mats) m.color.setRGB(r * L.day, g * L.day, b * L.day);
    const sp = ctx.sprites;
    if (!sp) return;
    sheet ??= furnitureSheet();
    if (!sheet) return;
    const o = roomOrigin();
    const tint = L.day * (1 - k * 0.12);
    const draw = (key: string, x: number, z: number, y = 0, opacity = 1) => {
      const f = sheet!.frames.get(key);
      if (!f) return;
      sp.batch.draw({
        sheet: sheet!,
        rect: f,
        flip: false,
        x: o.x + x,
        y,
        z: o.z + z,
        mode: 'billboard',
        w: f.w / IU,
        h: f.h / IU,
        tint,
        opacity,
      });
    };
    for (const p of ROOM_FURNITURE[id]) draw(p.kind, p.x, p.z, p.y ?? 0);
    // The Fold: the light through the hole in the roof, still under reduced motion too.
    if (id === 'fold') draw('shaft', 0.55, -0.6, 0, 0.9);
  },
  dispose() {
    for (const r of rooms.values()) r.group.removeFromParent();
    rooms.clear();
    sheet?.dispose();
    sheet = null;
    ctx = null;
  },
};
