import { LIFECYCLE } from '../config/tuning';
import { COSMETICS } from '../config/cosmetics';
import { createEgg, EGG_COLORS, JEWEL_EGG_COLORS } from './nubbin';
import { hasRoom } from './roster';
import { SPECIES, speciesOf } from './species';
import { isSinglePocket, lineRoot } from './growth-stage';
import type { AlignmentBand, Nubbin, NubbinType, SimEvent, World } from './types';
import { NUBBIN_TYPES } from './types';
import { newId, withRng } from './world';

/**
 * Lane F r11 (EVO): the creator code (Maor only). Typed into the roster's code box, it sets
 * `world.creator`, which unlocks a picker that grants or transforms a Nubbin into any species,
 * form, stage and colour variant. The source keeps only a salted SHA-256 of the code; the check
 * runs here in the sim on the `creatorUnlock` command, and the picker's two commands refuse
 * unless the flag is set.
 */
/** A picked Sun or Moon band's alignment: past an Eternal's 0.8, so the band holds. */
const CREATOR_ALIGN = 0.9;
const SALT = '8a5ab3bdca45e046fcafa1e807580a6e';
const HASH = '28904de2d4c059b94512f98a1fba4928edb1b5f6cfd5f2831318828b8b5836e0';

/** The stage a pick lands on. `first`, `second`, `radiant` and `eternal` are Chao forms. */
export type CreatorStage = 'egg' | 'child' | 'first' | 'second' | 'radiant' | 'eternal' | 'adult';

export interface CreatorPick {
  species: string;
  stage: CreatorStage;
  band?: AlignmentBand;
  type?: NubbinType;
  second?: NubbinType;
  eggColor?: string;
  tone?: string | null;
  shiny?: boolean;
  /** A character look id (`look-fox`...), or null for none. */
  look?: string | null;
}

/** The character looks a pick may wear. */
export const CREATOR_LOOKS: readonly string[] = COSMETICS.map((c) => c.id).filter((id) =>
  id.startsWith('look-'),
);
export const CREATOR_COLOURS: readonly string[] = [...EGG_COLORS, ...JEWEL_EGG_COLORS];

/** Whether a typed code is the creator code: case and spaces at the ends do not matter. */
export function isCreatorCode(code: string): boolean {
  const clean = code.trim().toUpperCase();
  if (!/^GROVE-[A-Z0-9-]{8,40}$/.test(clean)) return false;
  return sha256Hex(`${SALT}:${clean}`) === HASH;
}

/** Unlock the picker. Returns whether the code was right. */
export function creatorUnlock(world: World, code: string, events: SimEvent[]): boolean {
  if (!isCreatorCode(code)) return false;
  world.creator = true;
  events.push({ kind: 'creatorUnlocked' });
  return true;
}

/** Why a pick cannot be applied, or null when it can. */
export function pickProblem(p: CreatorPick): string | null {
  const s = SPECIES.find((x) => x.id === p.species);
  if (!s) return 'species';
  if (p.band && !['sun', 'moon', 'neutral'].includes(p.band)) return 'band';
  if (p.type && !NUBBIN_TYPES.includes(p.type)) return 'type';
  if (p.second && !NUBBIN_TYPES.includes(p.second)) return 'second';
  if (p.eggColor !== undefined && !CREATOR_COLOURS.includes(p.eggColor)) return 'egg';
  if (p.tone != null && !CREATOR_COLOURS.includes(p.tone)) return 'tone';
  if (p.look != null && !CREATOR_LOOKS.includes(p.look)) return 'look';
  const chaoOnly: CreatorStage[] = ['first', 'second', 'eternal'];
  if (s.family !== 'chao' && chaoOnly.includes(p.stage)) return 'stage';
  if (s.family === 'chao' && p.stage === 'adult') return 'stage';
  if (s.family === 'digi' && p.stage === 'radiant') return 'stage';
  // A non-Chao child is a baby species, or a single's juvenile; anything later is an adult.
  if (s.family !== 'chao' && p.stage === 'child' && s.stage !== 'baby') return 'stage';
  if (s.family !== 'chao' && p.stage === 'radiant' && s.evolve) return 'stage';
  if (s.family !== 'chao' && p.stage === 'adult' && s.stage === 'baby' && !isSinglePocket(s.id))
    return 'stage';
  return null;
}

/** Put a Nubbin into the picked species, form, stage and colours. */
export function applyPick(n: Nubbin, p: CreatorPick, world: World): void {
  const s = speciesOf(p.species);
  n.species = s.id;
  n.lineage = s.family === 'chao' ? 'chao' : lineRoot(s.id);
  if (p.eggColor !== undefined) n.eggColor = p.eggColor;
  if (p.tone !== undefined) n.tone = p.tone;
  if (p.shiny !== undefined) n.shiny = p.shiny;
  if (p.look !== undefined) n.hat = p.look;
  n.eternal = null;
  n.awaitingKeeper = false;
  n.graceMs = null;
  n.restNoticed = false;
  n.cocoonKind = null;
  n.hatchRemainingMs = 0;
  const band = p.band ?? 'neutral';
  // The hidden alignment follows a picked band, so the sheet's word and later steps agree.
  if (p.band)
    n.alignment = p.band === 'sun' ? CREATOR_ALIGN : p.band === 'moon' ? -CREATOR_ALIGN : 0;
  const type = p.type ?? s.type;
  const lean = { ...n.typeLean };
  switch (p.stage) {
    case 'egg':
      n.stage = 'egg';
      n.stageMs = 0;
      n.form = null;
      n.hatchRemainingMs = 1000;
      return;
    case 'child':
      n.stage = 'child';
      n.stageMs = 0;
      n.form = null;
      return;
    default:
      break;
  }
  n.stage = 'adult';
  if (p.stage === 'eternal') {
    n.form = { band, type: 'normal', second: 'normal', leanAtEvolution: lean };
    n.eternal = band;
    n.stageMs = LIFECYCLE.secondEvolutionMs;
    return;
  }
  // Past a stage's timer, so the natural steps do not undo the pick; a form with steps left
  // (a grown pocket species, a digital champion) still takes them on time.
  const later =
    p.stage === 'second' ||
    p.stage === 'radiant' ||
    (s.family !== 'chao' && (!s.evolve || s.stage === 'champion'));
  n.form = {
    band,
    type,
    second: later ? (p.second ?? (s.family === 'chao' ? type : 'normal')) : null,
    leanAtEvolution: lean,
    ...(p.stage === 'radiant' ? { radiant: true as const } : {}),
  };
  n.stageMs =
    p.stage === 'radiant' ? LIFECYCLE.thirdEvolutionMs : later ? LIFECYCLE.secondEvolutionMs : 0;
  n.ageMs = Math.max(n.ageMs, LIFECYCLE.childMs + n.stageMs);
  void world;
}

/** Grant a new Nubbin from a pick, beside the Keeper. */
export function creatorGrant(world: World, p: CreatorPick, events: SimEvent[]): boolean {
  if (!world.creator || pickProblem(p) || !hasRoom(world)) return false;
  const pos = { x: world.keeper.pos.x + 1, z: world.keeper.pos.z + 1 };
  const n = withRng(world, (rng) =>
    createEgg(newId(world, 'nub'), pos, rng, p.eggColor ?? 'plain', speciesOf(p.species).id),
  );
  applyPick(n, p, world);
  world.nubbins.push(n);
  events.push({ kind: 'creatorApplied', nubbinId: n.id });
  return true;
}

/** Transform a Nubbin in the Grove into a pick. */
export function creatorTransform(
  world: World,
  nubbinId: string,
  p: CreatorPick,
  events: SimEvent[],
): boolean {
  if (!world.creator || pickProblem(p)) return false;
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n) return false;
  if (world.keeper.carrying === n.id && p.stage === 'egg') world.keeper.carrying = null;
  applyPick(n, p, world);
  events.push({ kind: 'creatorApplied', nubbinId: n.id });
  return true;
}

// ---- SHA-256 (FIPS 180-4), small and synchronous so the sim can check the code ----

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

export function sha256Hex(text: string): string {
  const msg = new TextEncoder().encode(text);
  const len = Math.ceil((msg.length + 9) / 64) * 64;
  const buf = new Uint8Array(len);
  buf.set(msg);
  buf[msg.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(len - 4, msg.length * 8);
  view.setUint32(len - 8, Math.floor((msg.length * 8) / 0x100000000));
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const w = new Uint32Array(64);
  const rot = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < len; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const a = w[i - 15]!;
      const b = w[i - 2]!;
      const s0 = rot(a, 7) ^ rot(a, 18) ^ (a >>> 3);
      const s1 = rot(b, 17) ^ rot(b, 19) ^ (b >>> 10);
      w[i] = (w[i - 16]! + s0 + w[i - 7]! + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h as unknown as number[];
    for (let i = 0; i < 64; i++) {
      const t1 =
        (hh! +
          (rot(e!, 6) ^ rot(e!, 11) ^ rot(e!, 25)) +
          ((e! & f!) ^ (~e! & g!)) +
          K[i]! +
          w[i]!) >>>
        0;
      const t2 =
        ((rot(a!, 2) ^ rot(a!, 13) ^ rot(a!, 22)) + ((a! & b!) ^ (a! & c!) ^ (b! & c!))) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d! + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    const out = [a, b, c, d, e, f, g, hh];
    for (let i = 0; i < 8; i++) h[i] = (h[i]! + out[i]!) >>> 0;
  }
  return Array.from(h, (x) => x.toString(16).padStart(8, '0')).join('');
}
