import { SPECIES } from './species';
import { EGG_COLORS, JEWEL_EGG_COLORS, isJewel } from './nubbin';
import { ALL_CRITTERS } from './critters';
import { COSMETICS } from '../config/cosmetics';
import type { Nubbin, SimEvent, World } from './types';

/**
 * The collection book: every species and every Chao form the Keeper has seen hatch,
 * grow or evolve in their Grove. Keys are species ids for the pocket and digital
 * lines, and `chao:<band>:<type>` / `chao:eternal:<band>` for the Chao line.
 *
 * LOOK-55 widened it to every form, look and colour: second evolutions
 * `chao:<band>:<type>:<second>`, character looks `look:<id>`, egg colours `colour:<egg>`
 * with `:shiny` and `:twotone:<b>` variants, jewels `jewel:<id>`, critter parts
 * `part:<critter>:<slot>` and wearables `hat:<id>`. A page also keeps the name of the
 * Nubbin that first showed it (`world.seenBy`), and each tab pays out once when complete.
 */
export function formKey(n: Nubbin): string {
  if (n.species !== 'chao') return n.species;
  if (n.stage === 'egg') return 'chao:egg';
  if (n.stage === 'child') return 'chao:child';
  if (n.eternal) return `chao:eternal:${n.eternal}`;
  if (n.form) return `chao:${n.form.band}:${n.form.type}`;
  return 'chao:child';
}

const isLook = (id: string): boolean => id.startsWith('look-');

/** Every book key a Nubbin shows right now (its form, colour, parts and what it wears). */
export function keysOf(n: Nubbin): string[] {
  if (n.stage === 'egg') return [];
  const keys = [formKey(n)];
  if (n.species === 'chao' && n.form?.second && !n.eternal)
    keys.push(`chao:${n.form.band}:${n.form.type}:${n.form.second}`);
  if (isJewel(n.eggColor)) keys.push(`jewel:${n.eggColor}`);
  else {
    keys.push(`colour:${n.eggColor}`);
    if (n.shiny) keys.push(`colour:${n.eggColor}:shiny`);
    if (n.tone) keys.push(`colour:${n.eggColor}:twotone:${n.tone}`);
  }
  for (const [slot, critter] of Object.entries(n.parts))
    if (critter) keys.push(`part:${critter}:${slot}`);
  if (n.hat) keys.push(isLook(n.hat) ? `look:${n.hat}` : `hat:${n.hat}`);
  return keys;
}

export function noteSeen(world: World, key: string, events: SimEvent[], by?: string): void {
  if (world.seen[key] !== undefined) return;
  world.seen[key] = world.timeMs;
  if (by) (world.seenBy ??= {})[key] = by;
  events.push({ kind: 'firstSeen', key });
}

/** Note everything a Nubbin shows, then pay any book tab it completed. */
export function noteNubbin(world: World, n: Nubbin, events: SimEvent[]): void {
  const before = Object.keys(world.seen).length;
  for (const key of keysOf(n)) if (allKeySet().has(key)) noteSeen(world, key, events, n.name);
  if (Object.keys(world.seen).length !== before) checkTabs(world);
}

export type BookTab = 'forms' | 'pocket' | 'digital' | 'colours' | 'looks' | 'parts' | 'hats';
export const BOOK_TABS: readonly BookTab[] = [
  'forms',
  'pocket',
  'digital',
  'colours',
  'looks',
  'parts',
  'hats',
];

const FAMILY = new Map(SPECIES.map((s) => [s.id, s.family]));

/** Which tab a key's page is on. */
export function tabOf(key: string): BookTab {
  if (key.startsWith('chao:')) return 'forms';
  if (key.startsWith('colour:') || key.startsWith('jewel:')) return 'colours';
  if (key.startsWith('look:')) return 'looks';
  if (key.startsWith('part:')) return 'parts';
  if (key.startsWith('hat:')) return 'hats';
  return FAMILY.get(key) === 'digi' ? 'digital' : 'pocket';
}

let keyCache: readonly string[] | null = null;
let keySet: ReadonlySet<string> | null = null;

const BANDS = ['sun', 'moon', 'neutral'] as const;
const TYPES = ['normal', 'swim', 'fly', 'run', 'power'] as const;

/** Every key the book can hold, in display order. Built once: the list never changes. */
export function allKeys(): readonly string[] {
  if (keyCache) return keyCache;
  const keys: string[] = ['chao:child'];
  for (const band of BANDS) for (const type of TYPES) keys.push(`chao:${band}:${type}`);
  for (const band of BANDS) keys.push(`chao:eternal:${band}`);
  for (const band of BANDS)
    for (const type of TYPES)
      for (const second of TYPES) if (second !== type) keys.push(`chao:${band}:${type}:${second}`);
  for (const s of SPECIES) if (s.id !== 'chao') keys.push(s.id);
  const tones = EGG_COLORS.filter((c) => c !== 'plain');
  for (const c of EGG_COLORS) {
    keys.push(`colour:${c}`, `colour:${c}:shiny`);
    for (const b of tones) if (b !== c) keys.push(`colour:${c}:twotone:${b}`);
  }
  for (const j of JEWEL_EGG_COLORS) keys.push(`jewel:${j}`);
  for (const c of COSMETICS) if (isLook(c.id)) keys.push(`look:${c.id}`);
  for (const cr of ALL_CRITTERS) for (const slot of cr.parts) keys.push(`part:${cr.id}:${slot}`);
  for (const c of COSMETICS) if (!isLook(c.id)) keys.push(`hat:${c.id}`);
  keyCache = keys;
  return keys;
}

function allKeySet(): ReadonlySet<string> {
  return (keySet ??= new Set(allKeys()));
}

/** Seen and total per tab. */
export function tabProgress(world: World, tab: BookTab): { seen: number; total: number } {
  let seen = 0;
  let total = 0;
  for (const k of allKeys())
    if (tabOf(k) === tab) {
      total++;
      if (world.seen[k] !== undefined) seen++;
    }
  return { seen, total };
}

/** Record each newly completed tab once; its reward (a golden photo frame) is the record. */
function checkTabs(world: World): void {
  for (const tab of BOOK_TABS) {
    if (world.bookTabs?.includes(tab)) continue;
    const p = tabProgress(world, tab);
    if (p.total > 0 && p.seen === p.total) (world.bookTabs ??= []).push(tab);
  }
}

/** Events after which a Nubbin may show something new. */
const NOTE_ON = new Set<SimEvent['kind']>([
  'hatched',
  'evolved',
  'secondEvolved',
  'speciesGrew',
  'eternal',
  'reborn',
  'critterGiven',
]);

/**
 * Fold sim events from index `from` on into the book; new `firstSeen` events are appended.
 * Live steps and coarse steps (catch-up and the high-speed fallback) both call it.
 */
export function stepCollection(world: World, events: SimEvent[], from = 0): void {
  const end = events.length;
  for (let i = from; i < end; i++) {
    const e = events[i]!;
    if (NOTE_ON.has(e.kind) && 'nubbinId' in e) {
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (n) noteNubbin(world, n, events);
    }
  }
}
