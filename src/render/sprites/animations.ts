// Animation clips shared by every sprite sheet. Frame keys are `${clip}:${angle}:${index}`.

export type ClipName =
  | 'idle'
  | 'walk'
  | 'happy'
  | 'sad'
  | 'sleep'
  | 'eat'
  | 'swim'
  | 'flap'
  | 'love'
  | 'tumble'
  | BattleClipName;

/** R0239: the battle verbs, drawn for the front and side angles only (the stage shows the side). */
export const BATTLE_CLIP_NAMES = [
  'windup',
  'bonk',
  'splash',
  'hit',
  'dodge',
  'cheer',
  'tuckered',
  'wave',
] as const;
export type BattleClipName = (typeof BATTLE_CLIP_NAMES)[number];
export const BATTLE_CLIP_ANGLES = ['front', 'side'] as const;
export function isBattleClip(c: string): c is BattleClipName {
  return (BATTLE_CLIP_NAMES as readonly string[]).includes(c);
}

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
  windup: { frames: 2, ms: 160, loop: false },
  bonk: { frames: 2, ms: 110, loop: false },
  splash: { frames: 2, ms: 140, loop: false },
  hit: { frames: 1, ms: 300, loop: false },
  dodge: { frames: 2, ms: 130, loop: false },
  cheer: { frames: 2, ms: 220, loop: true },
  tuckered: { frames: 2, ms: 600, loop: false },
  wave: { frames: 2, ms: 240, loop: true },
};

export const CLIP_NAMES = Object.keys(CLIPS) as ClipName[];

/**
 * PERF: the keys are looked up for every sprite every frame (about 37 kB of strings a frame
 * on a phone); the set of clips, angles and frames is small and fixed, so each key is built
 * once and reused.
 */
const FRAME_KEYS = new Map<string, Map<string, string[]>>();

export function frameKey(clip: string, angle: string, index: number): string {
  let byAngle = FRAME_KEYS.get(clip);
  if (!byAngle) FRAME_KEYS.set(clip, (byAngle = new Map()));
  let row = byAngle.get(angle);
  if (!row) byAngle.set(angle, (row = []));
  return (row[index] ??= `${clip}:${angle}:${index}`);
}

/** Which frame of `clip` shows at `elapsedMs` since the clip started. */
export function frameAt(clip: Clip, elapsedMs: number): number {
  const i = Math.floor(Math.max(0, elapsedMs) / clip.ms);
  return clip.loop ? i % clip.frames : Math.min(clip.frames - 1, i);
}
