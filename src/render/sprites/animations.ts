// Animation clips shared by every sprite sheet. Frame keys are `${clip}:${angle}:${index}`.

export type ClipName =
  'idle' | 'walk' | 'happy' | 'sad' | 'sleep' | 'eat' | 'swim' | 'flap' | 'love' | 'tumble';

export interface Clip {
  frames: number;
  /** Milliseconds per frame. */
  ms: number;
  loop: boolean;
}

export const CLIPS: Record<ClipName, Clip> = {
  idle: { frames: 8, ms: 150, loop: true },
  walk: { frames: 6, ms: 100, loop: true },
  happy: { frames: 2, ms: 180, loop: true },
  sad: { frames: 2, ms: 500, loop: true },
  sleep: { frames: 2, ms: 800, loop: true },
  eat: { frames: 3, ms: 170, loop: true },
  swim: { frames: 2, ms: 320, loop: true },
  flap: { frames: 2, ms: 110, loop: true },
  // Parity with the 3D poses: a bashful sway with blushing cheeks, and a head-over-heels roll.
  love: { frames: 2, ms: 260, loop: true },
  tumble: { frames: 4, ms: 90, loop: true },
};

export const CLIP_NAMES = Object.keys(CLIPS) as ClipName[];

export function frameKey(clip: string, angle: string, index: number): string {
  return `${clip}:${angle}:${index}`;
}

/** Which frame of `clip` shows at `elapsedMs` since the clip started. */
export function frameAt(clip: Clip, elapsedMs: number): number {
  const i = Math.floor(Math.max(0, elapsedMs) / clip.ms);
  return clip.loop ? i % clip.frames : Math.min(clip.frames - 1, i);
}
