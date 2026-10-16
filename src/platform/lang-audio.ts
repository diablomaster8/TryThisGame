/**
 * The audio hooks for the language courses (CV3). Every course word names a clip
 * (`VocabItem.audio`, e.g. `he/shalom`) that a native speaker records; until then each
 * word plays the shared placeholder chime, which has no voice. These words are never
 * spoken by a synthetic voice (the read-aloud skips them). Clips play only once sound is
 * unlocked by the first tap and switched on, like every other sound.
 */
import { isAudioUnlocked, isSoundEnabled } from './audio';

/**
 * Clip ids with a real recording at `audio/lang/<id>.mp3`. Add an id here when its file
 * lands (see `public/audio/lang/README.md`).
 */
export const RECORDED: ReadonlySet<string> = new Set<string>([]);

export interface Clip {
  url: string;
  placeholder: boolean;
}

const base = (): string => {
  try {
    return import.meta.env.BASE_URL ?? '/';
  } catch {
    return '/';
  }
};

/** Where a word's clip lives: its recording, or the placeholder chime. */
export function clipFor(id: string): Clip {
  return RECORDED.has(id)
    ? { url: `${base()}audio/lang/${id}.mp3`, placeholder: false }
    : { url: `${base()}audio/lang/placeholder.wav`, placeholder: true };
}

let current: HTMLAudioElement | null = null;

/** Play a word's clip, cutting off the one before. Silent until sound is on. */
export function playWord(id: string): void {
  if (!isAudioUnlocked() || !isSoundEnabled()) return;
  try {
    current?.pause();
    current = new Audio(clipFor(id).url);
    void current.play().catch(() => undefined);
  } catch {
    // No audio element on this device: the word still shows its romanisation.
  }
}
