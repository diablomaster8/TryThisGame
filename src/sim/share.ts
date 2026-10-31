import { hasRoom, storyNubbin } from './roster';
import { nubbinProblem } from './save';
import type { Nubbin, SimEvent, World } from './types';
import { newId, uniqueName } from './world';
import { withRng } from './world';

/**
 * Share codes: a Nubbin packed into a short text so a friend can import it as a guest
 * or a trade, with no server. The code is a checksum plus base64 of a compact JSON.
 */
const PREFIX = 'GROVE1.';
/** The rename command's cap; a code may not carry a longer name. */
const NAME_MAX = 16;

function checksum(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36).padStart(7, '0').slice(-7);
}

function toBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeNubbin(n: Nubbin): string {
  const payload = JSON.stringify(n);
  return `${PREFIX}${checksum(payload)}.${toBase64(payload)}`;
}

export function decodeNubbin(code: string): Nubbin | null {
  try {
    const trimmed = code.trim();
    if (!trimmed.startsWith(PREFIX)) return null;
    const rest = trimmed.slice(PREFIX.length);
    const dot = rest.indexOf('.');
    if (dot < 0) return null;
    const sum = rest.slice(0, dot);
    const payload = fromBase64(rest.slice(dot + 1));
    if (checksum(payload) !== sum) return null;
    const n: unknown = JSON.parse(payload);
    // The checksum is public, so a code is as untrusted as an imported file: the same deep
    // check, or one crafted code would crash the render loop on every load.
    if (nubbinProblem(n)) return null;
    const nub = n as Nubbin;
    nub.name = nub.name.trim().slice(0, NAME_MAX);
    return nub.name ? nub : null;
  } catch {
    return null;
  }
}

/**
 * R0185 (lane B round 9): today's Hollow results as a short code a Keeper can paste to a
 * friend, `H1-YYMMDD-deepest-seconds-finds-check` (numbers in base 36), so two Keepers can
 * compare the same day's cave off-platform. No server, no account, nothing stored.
 */
export interface TodayResult {
  day: string;
  deepest: number;
  bestMs: number;
  finds: number;
}

const TODAY_PREFIX = 'H1';

export function encodeTodayCode(t: TodayResult): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t.day);
  if (!m) return null;
  const body = [
    `${m[1]!.slice(2)}${m[2]}${m[3]}`,
    Math.max(0, Math.round(t.deepest)).toString(36),
    Math.max(0, Math.round(t.bestMs / 1000)).toString(36),
    Math.max(0, Math.round(t.finds)).toString(36),
  ].join('-');
  return `${TODAY_PREFIX}-${body}-${checksum(body).slice(-2)}`.toUpperCase();
}

export function decodeTodayCode(code: string): TodayResult | null {
  const parts = code.trim().toLowerCase().split('-');
  if (parts.length !== 6 || parts[0] !== TODAY_PREFIX.toLowerCase()) return null;
  const [, day, deep, secs, finds, check] = parts as [
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  const body = [day, deep, secs, finds].join('-');
  if (checksum(body).slice(-2) !== check || !/^\d{6}$/.test(day)) return null;
  const num = (s: string) => (/^[0-9a-z]{1,7}$/.test(s) ? parseInt(s, 36) : NaN);
  const d = num(deep);
  const s = num(secs);
  const f = num(finds);
  if (![d, s, f].every(Number.isFinite)) return null;
  return {
    day: `20${day.slice(0, 2)}-${day.slice(2, 4)}-${day.slice(4, 6)}`,
    deepest: d,
    bestMs: s * 1000,
    finds: f,
  };
}

/**
 * Whether a Nubbin belongs to the story (Moss, Sable): never traded, fused or given away.
 * The UI uses this to hide the Trade away button.
 */
export function isStoryNubbin(world: World, id: string): boolean {
  return storyNubbin(world, id);
}

/** Take a shared Nubbin into the Grove with a fresh id and a free name. */
export function receiveNubbin(world: World, incoming: Nubbin, events: SimEvent[]): boolean {
  // The UI decodes with the same check; this guards any other path into the command.
  if (nubbinProblem(incoming)) return false;
  // A code of this Grove's own Moss or Sable would make a second copy of a story Nubbin.
  if (storyNubbin(world, incoming.id)) {
    events.push({ kind: 'received', name: incoming.name, ok: false });
    return false;
  }
  if (!hasRoom(world)) {
    events.push({ kind: 'received', name: incoming.name, ok: false });
    return false;
  }
  const n: Nubbin = { ...incoming };
  n.id = newId(world, 'nub');
  withRng(world, (rng) => {
    n.name = uniqueName(world, n.name, rng);
  });
  n.pos = { x: world.keeper.pos.x + 1, z: world.keeper.pos.z + 1 };
  n.y = 0;
  n.vel = { x: 0, y: 0, z: 0 };
  n.behavior = {
    state: 'sit',
    sinceMs: world.timeMs,
    untilMs: world.timeMs + 3000,
    target: null,
    itemId: null,
    reaction: null,
  };
  n.stray = false;
  n.lowTrustSinceMs = -1;
  n.courtingUntilMs = 0;
  world.nubbins.push(n);
  events.push({ kind: 'received', name: n.name, ok: true });
  return true;
}

/** Give a Nubbin away: it leaves the Grove for good (the code is its ticket). */
export function tradeAway(world: World, id: string, events: SimEvent[]): Nubbin | null {
  const n = world.nubbins.find((x) => x.id === id);
  if (!n || storyNubbin(world, id)) return null;
  world.nubbins = world.nubbins.filter((x) => x.id !== id);
  if (world.selected === id) world.selected = null;
  if (world.keeper.carrying === id) world.keeper.carrying = null;
  events.push({ kind: 'traded', name: n.name });
  return n;
}
