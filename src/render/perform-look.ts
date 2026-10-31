/**
 * R0525 (SOUL-07), lane A round 10: how a lesson looks when performed, shared by the Pixel
 * and Full 3D views so both tell the four apart without a label. Drawing sits and scribbles
 * with a crayon (the doodle itself is sim state); singing opens its mouth (the happy clip)
 * with notes rising; dance has a style per level (a sway, a stomp, a spin); an instrument is
 * held (bell, drum or trumpet) and played on the beat. Pure maths, render-side only. Reduced
 * motion keeps the props and the notes but drops the spin, the hops and the quick flips.
 */
import { PERFORM } from '../config/tuning';
import { instrumentOf, lessonLevel } from '../sim/kindergarten';
import { isLesson } from '../sim/perform';
import type { LessonId, Nubbin } from '../sim/types';

export type PerformProp = 'crayon' | 'bell' | 'drum' | 'trumpet';
export const PERFORM_PROPS: readonly PerformProp[] = ['crayon', 'bell', 'drum', 'trumpet'];

export interface PerformLook {
  lesson: LessonId;
  level: number;
  /** The body clip (both renderers have these three). */
  clip: 'sit' | 'happy' | 'idle';
  prop: PerformProp | null;
  /** Squash and nudge for the body this frame (world units for dx, dy). */
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  /** Extra turn about the vertical (radians): the spin. */
  turn: number;
  /** The held prop's own wiggle (world units, camera-right and up). */
  propDx: number;
  propDy: number;
  /** Rising notes for a song or a tune. */
  notes: boolean;
}

const out: PerformLook = {
  lesson: 'dance',
  level: 1,
  clip: 'happy',
  prop: null,
  sw: 1,
  sh: 1,
  dx: 0,
  dy: 0,
  turn: 0,
  propDx: 0,
  propDy: 0,
  notes: false,
};

/** 0..1 impulse at the start of every beat, easing out. */
const beatPulse = (t: number, beat: number): number => {
  const f = (t % beat) / beat;
  return Math.max(0, 1 - f * 3);
};

/**
 * The look of a lesson performance `t` ms in (`simMs` is the interpolated sim time), or null
 * when the Nubbin is not performing a lesson. The returned object is reused: read it at once.
 */
export function performLook(n: Nubbin, simMs: number, reduce: boolean): PerformLook | null {
  const b = n.behavior;
  if (b.state !== 'perform' || !isLesson(b.itemId)) return null;
  const t = Math.max(0, simMs - b.sinceMs);
  const level = Math.min(3, Math.max(1, lessonLevel(n, b.itemId)));
  const o = out;
  o.lesson = b.itemId;
  o.level = level;
  o.sw = o.sh = 1;
  o.dx = o.dy = o.turn = o.propDx = o.propDy = 0;
  o.notes = false;
  o.prop = null;
  switch (b.itemId) {
    case 'drawing': {
      // Sat down, scribbling a small loop on the ground in front.
      o.clip = 'sit';
      o.prop = 'crayon';
      const a = t / 140;
      o.propDx = Math.cos(a) * 0.1;
      o.propDy = -0.28 + Math.sin(a) * 0.05;
      if (!reduce) o.sh = 1 + Math.sin(t / 140) * 0.02;
      break;
    }
    case 'singing': {
      // Mouth open, chest swelling with each note.
      o.clip = 'happy';
      o.notes = true;
      const beat = PERFORM.noteEveryMs;
      const p = beatPulse(t, beat);
      o.sh = 1 + 0.08 * p;
      o.sw = 1 - 0.03 * p;
      if (!reduce) o.dx = Math.sin(t / 600) * 0.05;
      break;
    }
    case 'dance': {
      o.clip = 'happy';
      const beat = PERFORM.danceBeatMs[level - 1]!;
      const p = beatPulse(t, beat);
      if (reduce) {
        o.dx = Math.sin((t / beat) * Math.PI) * 0.04;
        break;
      }
      if (level === 1) {
        // A side-to-side sway, turning a little each way.
        o.dx = Math.sin((t / beat) * Math.PI) * 0.1;
        o.turn = Math.sin((t / beat) * Math.PI) * 0.6;
      } else if (level === 2) {
        // A stomp: squash on the beat, a hop between.
        o.sw = 1 + 0.16 * p;
        o.sh = 1 - 0.2 * p;
        o.dy = Math.abs(Math.sin((t / beat) * Math.PI)) * 0.14;
      } else {
        // A spin: one turn every two beats, with a hop each beat.
        o.turn = ((t / (beat * 2)) % 1) * Math.PI * 2;
        o.dy = Math.abs(Math.sin((t / beat) * Math.PI)) * 0.1;
        o.sh = 1 - 0.1 * p;
      }
      break;
    }
    case 'instrument': {
      const kind = instrumentOf(n);
      o.prop = kind;
      o.clip = kind === 'trumpet' ? 'happy' : 'idle';
      o.notes = true;
      const beat = PERFORM.noteEveryMs;
      const p = beatPulse(t, beat);
      if (kind === 'drum') {
        // A bang on the beat: the drum dips and the body squashes.
        o.propDy = -0.08 * p;
        o.sh = 1 - 0.08 * p;
        o.sw = 1 + 0.05 * p;
      } else if (kind === 'bell') {
        o.propDy = Math.sin(t / 60) * 0.05 * (reduce ? 0.3 : 1);
        o.propDx = Math.sin(t / 90) * 0.04 * (reduce ? 0.3 : 1);
      } else {
        // The trumpet points up and the cheeks puff on each note.
        o.propDy = 0.12;
        o.sw = 1 + 0.06 * p;
      }
      break;
    }
  }
  return o;
}

/** Note particles: true once per note beat per Nubbin (render-side memory only). */
const lastNote = new Map<string, number>();

export function noteDue(id: string, look: PerformLook, simMs: number, sinceMs: number): boolean {
  if (!look.notes) return false;
  const k = Math.floor((simMs - sinceMs) / PERFORM.noteEveryMs);
  if (lastNote.get(id) === k) return false;
  if (lastNote.size > 64) lastNote.clear();
  lastNote.set(id, k);
  return true;
}

/** The body clip for a lesson performance (no time needed), or null for anything else. */
export function performClip(n: Nubbin): PerformLook['clip'] | null {
  const b = n.behavior;
  if (b.state !== 'perform' || !isLesson(b.itemId)) return null;
  if (b.itemId === 'drawing') return 'sit';
  if (b.itemId === 'instrument') return instrumentOf(n) === 'trumpet' ? 'happy' : 'idle';
  return 'happy';
}

/** The emote ball over a performer: a note for a song or a tune, a star for a dance. */
export function performEmote(n: Nubbin): 'note' | 'star' | 'heart' | null {
  const b = n.behavior;
  if (b.state !== 'perform' || !isLesson(b.itemId)) return null;
  if (b.itemId === 'singing' || b.itemId === 'instrument') return 'note';
  return b.itemId === 'drawing' ? 'heart' : 'star';
}
