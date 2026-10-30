import { battleAct } from './core';
import type { BattleAction, BattleEvent, BattleState } from './types';

/**
 * Replays a bout: a fresh state (as `createBattle` made it) plus the actions, in order. The
 * state is cloned through JSON first, which is also what the save does, so a replay checks
 * both that the core is deterministic and that a saved bout resumes to the same result.
 */
export function replay(start: BattleState, actions: readonly BattleAction[]): BattleState {
  const s = JSON.parse(JSON.stringify(start)) as BattleState;
  for (const a of actions) battleAct(s, a);
  return s;
}

// ---- Round 6: replay codes and the bout's funniest moment (recs FIGHT-100) ----

/** What a replay code carries: the bout as it started and every action, in order. */
export interface ReplayRecord {
  seed: number;
  start: BattleState;
  actions: { atMs: number; a: BattleAction }[];
}

const CODE_PREFIX = 'GRB1:';
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function toBase64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!;
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    const n = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    out += B64[(n >> 18) & 63]! + B64[(n >> 12) & 63]!;
    out += b === undefined ? '=' : B64[(n >> 6) & 63]!;
    out += c === undefined ? '=' : B64[n & 63]!;
  }
  return out;
}

function fromBase64(text: string): Uint8Array | null {
  const clean = text.replace(/\s+/g, '').replace(/=+$/, '');
  const out: number[] = [];
  let acc = 0;
  let bits = 0;
  for (const ch of clean) {
    const v = B64.indexOf(ch);
    if (v < 0) return null;
    acc = (acc << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((acc >> bits) & 255);
    }
  }
  return Uint8Array.from(out);
}

/** A pasteable replay code: base64 of the seed, the teams (the start state) and the actions. */
export function encodeReplayCode(r: ReplayRecord): string {
  return CODE_PREFIX + toBase64(new TextEncoder().encode(JSON.stringify(r)));
}

/** The record in a replay code (or in plain replay JSON), or null when it isn't one. */
export function decodeReplayCode(code: string): ReplayRecord | null {
  const text = code.trim();
  let json = text;
  if (text.startsWith(CODE_PREFIX)) {
    const bytes = fromBase64(text.slice(CODE_PREFIX.length));
    if (!bytes) return null;
    json = new TextDecoder().decode(bytes);
  }
  try {
    const r = JSON.parse(json) as ReplayRecord;
    if (!r || typeof r.seed !== 'number' || !r.start || !Array.isArray(r.actions)) return null;
    return r;
  } catch {
    return null;
  }
}

/** The moment a postcard shows: the biggest crit, else a Dizzy self-bonk, else the biggest hit. */
export type FunnyMoment =
  | { kind: 'crit'; by: string; to: string; dmg: number; move: string | undefined }
  | { kind: 'boing'; who: string; dmg: number }
  | { kind: 'hit'; by: string; to: string; dmg: number; move: string | undefined };

export function funniestMoment(log: readonly BattleEvent[]): FunnyMoment | null {
  let crit: FunnyMoment | null = null;
  let boing: FunnyMoment | null = null;
  let hit: FunnyMoment | null = null;
  for (const e of log) {
    if (e.k === 'hit' && e.crit && (!crit || e.dmg > crit.dmg))
      crit = { kind: 'crit', by: e.by, to: e.to, dmg: e.dmg, move: e.move };
    else if (e.k === 'boing' && (!boing || e.dmg > boing.dmg))
      boing = { kind: 'boing', who: e.who, dmg: e.dmg };
    else if (e.k === 'hit' && (!hit || e.dmg > hit.dmg))
      hit = { kind: 'hit', by: e.by, to: e.to, dmg: e.dmg, move: e.move };
  }
  return crit ?? boing ?? hit;
}
