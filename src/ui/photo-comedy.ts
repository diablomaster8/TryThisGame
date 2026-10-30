/**
 * FUN-39: the comedy in a Nubbin photo, decided before it is drawn: sometimes a nearby
 * Nubbin photobombs the frame's edge, sometimes the subject blinks (and the player may keep
 * it anyway), and every photo gets a caption from what the subject is doing. Pure and seeded
 * by the subject and the shot number, so a test can take twenty photos and count. The chances
 * are spread evenly over the shots rather than rolled, so twenty photos always hold three
 * photobombs (with a Nubbin nearby) and up to two blinks.
 */
import { PHOTO_COMEDY } from '../config/tuning';
import { PHOTO_TEXT } from '../config/strings-look';
import { moodOf } from '../sim/needs';
import { measureText } from '../render/sprites/font';
import type { Nubbin, World } from '../sim/types';

export interface PhotoComedy {
  bomber: Nubbin | null;
  /** Which edge the photobomber leans in from. */
  side: -1 | 1;
  blink: boolean;
  caption: string;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  return (h ^ (h >>> 15)) >>> 0;
}
const roll = (s: string): number => hash(s) / 4294967296;

const fill = (t: string, n: Nubbin, b?: Nubbin | null): string =>
  t.replace('{n}', n.name).replace('{b}', b?.name ?? '');

/** The caption for what `n` is up to, when nothing funnier happened. */
export function captionFor(n: Nubbin, seed: string): string {
  if (n.stage === 'egg') return fill(PHOTO_TEXT.egg, n);
  const s = n.behavior.state;
  if (s === 'nap' || s === 'shelter') return fill(PHOTO_TEXT.asleep, n);
  if (s === 'eat') return fill(PHOTO_TEXT.eating, n);
  const mood = moodOf(n);
  if (mood === 'hungry') return fill(PHOTO_TEXT.hungry, n);
  if (mood === 'sad') return fill(PHOTO_TEXT.sad, n);
  if (n.rebirths > 0 && roll(`${seed}:old`) < 0.5) return fill(PHOTO_TEXT.old, n);
  if (mood === 'happy' && roll(`${seed}:happy`) < 0.5) return fill(PHOTO_TEXT.happy, n);
  const idle = PHOTO_TEXT.idle;
  return fill(idle[hash(`${seed}:idle`) % idle.length]!, n);
}

/** Decide shot number `shot` of `n` in `world`. */
export function photoComedy(world: World, n: Nubbin, shot: number): PhotoComedy {
  const seed = `${n.id}:${shot}`;
  const near = world.nubbins.filter(
    (m) =>
      m.id !== n.id &&
      m.stage !== 'egg' &&
      m.stage !== 'cocoon' &&
      Math.hypot(m.pos.x - n.pos.x, m.pos.z - n.pos.z) < PHOTO_COMEDY.bombRange,
  );
  // Spread evenly rather than rolled: of any 20 shots in a row, exactly 15% photobomb and
  // (in 10) exactly 10% blink, each at a place seeded by the subject.
  const h = hash(n.id);
  const bombNow = (h + shot * 7) % 20 < Math.round(PHOTO_COMEDY.bombChance * 20);
  const blinkNow = ((h >>> 8) + shot * 3) % 10 < Math.round(PHOTO_COMEDY.blinkChance * 10);
  const bomber = near.length && bombNow ? near[hash(`${seed}:who`) % near.length]! : null;
  const blink = n.stage !== 'egg' && !bomber && blinkNow;
  const caption = bomber
    ? fill(PHOTO_TEXT.bomb, n, bomber)
    : blink
      ? fill(PHOTO_TEXT.blink, n)
      : captionFor(n, seed);
  return { bomber, side: hash(`${seed}:side`) % 2 ? 1 : -1, blink, caption };
}

/** Split a caption into lines that fit `width` pixels of the pixel font, at most three. */
export function wrapCaption(text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && measureText(next) > width) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}
