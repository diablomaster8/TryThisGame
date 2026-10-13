import { hasRoom } from './roster';
import type { Nubbin, SimEvent, World } from './types';
import { newId, uniqueName } from './world';
import { withRng } from './world';

/**
 * Share codes: a Nubbin packed into a short text so a friend can import it as a guest
 * or a trade, with no server. The code is a checksum plus base64 of a compact JSON.
 */
const PREFIX = 'GROVE1.';

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
    const n = JSON.parse(payload) as Nubbin;
    if (!n || typeof n !== 'object' || typeof n.name !== 'string' || !n.stats) return null;
    return n;
  } catch {
    return null;
  }
}

/** Take a shared Nubbin into the Grove with a fresh id and a free name. */
export function receiveNubbin(world: World, incoming: Nubbin, events: SimEvent[]): boolean {
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
  if (!n) return null;
  world.nubbins = world.nubbins.filter((x) => x.id !== id);
  if (world.selected === id) world.selected = null;
  if (world.keeper.carrying === id) world.keeper.carrying = null;
  events.push({ kind: 'traded', name: n.name });
  return n;
}
