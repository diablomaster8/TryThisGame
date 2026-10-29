import { ACTS } from '../../config/dungeon-acts';
import { TOWN_CAST } from '../../config/dungeon-zones';
import { cellCentre, type Floor } from '../../sim/dungeon';
import { trainerOf, type TrainerLook } from '../../sim/trainers';
import { PALETTE } from '../sprites/palette';
import { hex, mix, Raster, rimObjects, shade, type RGB } from './raster';

/**
 * Pixel props for the act camps and fields (R0152, R0147): the camp's stalls, table, board
 * and signpost, the people who keep them (drawn from their trainer look, `sim/trainers.ts`,
 * or the act local's own), and the rock arch over each cave mouth. Frames join the Hollow
 * props sheet (`buildDungeonProps`); `zoneSprites` places them as standing billboards, the
 * way the landmarks are (`landmarkSprites`, cave-ambience.ts).
 */

/** The act locals' looks (no trainer of their own), by act id. */
const LOCAL_LOOK: Record<string, Partial<Record<keyof TrainerLook, string>>> = {
  rootways: { shirt: '#7a8a4a', pants: '#5a4630', hat: '#c8a060', hair: '#d8d8d0' },
  cloister: { shirt: '#6a5a8a', pants: '#3a3046', hat: '#6a5a8a', hair: '#8a6a4a' },
  sandglass: { shirt: '#e0c080', pants: '#8a6a3a', hat: '#f2e2b0', hair: '#2a1a10' },
  frostbell: { shirt: '#5a8ac0', pants: '#3a4a6a', hat: '#e8eef8', hair: '#e8d090' },
  gloom: { shirt: '#4a4060', pants: '#2a2436', hat: '#8a7aa8', hair: '#c0b8d8' },
};

const pal = (i: number): RGB => hex(PALETTE[i] ?? '#888888');

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

/** A standing camp keeper, 20×36: boots, legs, shirt, arms, head, hair and hat. */
function person(
  look: TrainerLook | null,
  local?: Partial<Record<keyof TrainerLook, string>>,
): Raster {
  const c = (k: keyof TrainerLook, fallback: string): RGB =>
    local?.[k] ? hex(local[k]) : look ? pal(look[k] as number) : hex(fallback);
  const skin = c('skin', '#e8b890');
  const shirt = c('shirt', '#7a8a4a');
  const pants = c('pants', '#4a3a2a');
  const boots = c('boots', '#3a2a1a');
  const hair = c('hair', '#5a3a20');
  const hat = c('hat', '#c8a060');
  const r = begin(20, 36);
  r.rect(6, 31, 3, 4, boots);
  r.rect(11, 31, 3, 4, boots);
  r.rect(6, 23, 3, 8, pants);
  r.rect(11, 23, 3, 8, pants);
  r.rect(5, 13, 10, 11, shirt);
  r.rect(5, 13, 10, 1, mix(shirt, [1, 1, 1], 0.3));
  r.rect(3, 14, 2, 8, shade(shirt, 0.8));
  r.rect(15, 14, 2, 8, shade(shirt, 0.8));
  r.rect(3, 22, 2, 2, skin);
  r.rect(15, 22, 2, 2, skin);
  r.disc(10, 8, 4.6, skin);
  r.rect(5, 4, 10, 3, hair);
  r.rect(5, 7, 2, 4, hair);
  r.rect(13, 7, 2, 4, hair);
  r.set(8, 8, hex('#2a2030'));
  r.set(12, 8, hex('#2a2030'));
  const style = look?.hatStyle ?? 'sun';
  if (style !== 'none') {
    if (style === 'sun') r.rect(2, 4, 16, 2, hat);
    r.rect(5, 1, 10, style === 'band' ? 2 : 4, hat);
  }
  return finish(r);
}

function stall(awning: RGB, goods: RGB[]): Raster {
  const r = begin(44, 40);
  for (let x = 0; x < 44; x += 6) r.rect(x, 4, 6, 9, (x / 6) % 2 ? hex('#f4ecd8') : awning);
  r.rect(0, 13, 44, 1, shade(awning, 0.6));
  r.rect(3, 13, 2, 26, hex('#6a4a2c'));
  r.rect(39, 13, 2, 26, hex('#6a4a2c'));
  r.rect(2, 26, 40, 13, hex('#8a5a32'));
  r.rect(2, 26, 40, 2, hex('#b07c34'));
  goods.forEach((g, i) => r.disc(9 + i * 9, 23, 3.4, g));
  return finish(r);
}

function table(): Raster {
  const r = begin(40, 30);
  r.rect(2, 10, 36, 6, hex('#9a6a3a'));
  r.rect(2, 10, 36, 1, hex('#c8945a'));
  for (const x of [4, 33]) r.rect(x, 16, 3, 13, hex('#5a3a20'));
  r.rect(8, 6, 8, 4, hex('#8a8a96'));
  r.line(22, 9, 30, 3, hex('#c0c0cc'));
  r.rect(29, 2, 4, 3, hex('#6a6a78'));
  return finish(r);
}

function board(): Raster {
  const r = begin(36, 44);
  for (const x of [5, 29]) r.rect(x, 18, 3, 25, hex('#5a3a20'));
  r.rect(2, 2, 32, 22, hex('#8a5a32'));
  r.rect(4, 4, 28, 18, hex('#c8a070'));
  for (const [x, y] of [
    [7, 7],
    [19, 6],
    [10, 14],
    [22, 14],
  ] as const)
    r.rect(x, y, 8, 6, hex('#f4ecd8'));
  return finish(r);
}

function signpost(): Raster {
  const r = begin(30, 44);
  r.rect(13, 8, 4, 35, hex('#5a3a20'));
  r.tri(2, 10, 26, 6, 26, 16, hex('#c8945a'));
  r.rect(6, 22, 22, 7, hex('#b07c34'));
  r.disc(15, 5, 4, hex('#ffd060'));
  r.set(14, 4, hex('#fff6c0'));
  return finish(r);
}

/** A rock arch over a cave mouth, dark inside. */
function mouth(): Raster {
  const r = begin(52, 44);
  r.ellipse(26, 30, 25, 22, hex('#6a6050'));
  r.ellipse(26, 26, 22, 18, hex('#8a7e68'));
  r.ellipse(26, 34, 14, 14, hex('#141018'));
  r.rect(12, 34, 28, 10, hex('#141018'));
  r.ellipse(26, 30, 9, 9, hex('#0a080e'));
  for (const x of [10, 40]) r.disc(x, 12, 4, hex('#74b04a'));
  return finish(r);
}

/** Every camp and field frame, by key, for the Hollow props sheet. */
export function townFrames(add: (key: string, r: Raster) => void): void {
  add('town-vendor', stall(hex('#c04a3a'), [hex('#e05050'), hex('#f2c040'), hex('#8ad060')]));
  add('town-gamble', stall(hex('#5a4aa8'), [hex('#f2d34c'), hex('#e8e0d0'), hex('#f2d34c')]));
  add('town-craft', table());
  add('town-hire', board());
  add('town-quest', signpost());
  add('town-mouth', mouth());
  const keepers = new Set<string>();
  for (const cast of Object.values(TOWN_CAST))
    for (const k of Object.values(cast)) if (k !== 'local') keepers.add(k);
  for (const k of keepers) add(`npc-${k}`, person(trainerOf(k).look));
  for (const act of ACTS) add(`npc-local-${act.id}`, person(null, LOCAL_LOOK[act.id]));
}

/** The camp's and field's standing props, placed like landmark sprites. */
export function zoneSprites(f: Floor): Array<{ key: string; x: number; z: number; r: number }> {
  const out: Array<{ key: string; x: number; z: number; r: number }> = [];
  const actId = ACTS[f.act ?? 0]!.id;
  for (const s of f.services ?? []) {
    if (s.kind === 'stash') continue;
    const p = cellCentre(f, s.cell);
    // The stall stands on the service cell; its keeper just in front, to the left.
    out.push({ key: `town-${s.kind}`, x: p.x, z: p.z - 0.35, r: 0.6 });
    const who = s.keeper === 'local' ? `local-${actId}` : s.keeper;
    out.push({ key: `npc-${who}`, x: p.x - 0.55, z: p.z + 0.25, r: 0.25 });
  }
  for (const m of f.mouths ?? []) {
    const p = cellCentre(f, m);
    out.push({ key: 'town-mouth', x: p.x, z: p.z - 0.9, r: 0.9 });
  }
  return out;
}
