/**
 * The audio hooks for the language courses (CV3). Every course word names a clip
 * (`VocabItem.audio`, e.g. `he/shalom`) that a native speaker records; until then each
 * word plays the shared placeholder chime, which has no voice. These words are never
 * spoken by a synthetic voice (the read-aloud skips them). Clips play only once sound is
 * unlocked by the first tap and switched on, like every other sound.
 */
import { isAudioUnlocked, isSoundEnabled } from './audio';
import { CLIP_TEXT } from '../config/strings-r11d6';

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
let noteEl: HTMLElement | null = null;
let noteTimer = 0;
let lastNoteAt = -1e9;

/**
 * R0445: tapping a word that has no recording yet plays the chime, and says so in a small
 * line at the bottom of the screen, so nobody thinks the chime is the word. At most one
 * note every few seconds, and it is a polite status line for screen readers.
 */
function sayMissing(): void {
  if (typeof document === 'undefined') return;
  const now = Date.now();
  if (now - lastNoteAt < CLIP_TEXT.noteEveryMs) return;
  lastNoteAt = now;
  if (!noteEl) {
    const n = document.createElement('div');
    n.setAttribute('role', 'status');
    n.className = 'lang-clip-note';
    n.style.cssText =
      'position:fixed;left:50%;bottom:max(16px,env(safe-area-inset-bottom));transform:translateX(-50%);' +
      'max-width:min(90vw,420px);padding:10px 14px;border-radius:12px;background:rgba(30,40,50,.92);' +
      'color:#fff;font:14px/1.35 system-ui,sans-serif;text-align:center;z-index:60;pointer-events:none';
    document.body.appendChild(n);
    noteEl = n;
  }
  noteEl.textContent = CLIP_TEXT.tapNote;
  noteEl.style.display = 'block';
  window.clearTimeout(noteTimer);
  noteTimer = window.setTimeout(() => {
    if (noteEl) noteEl.style.display = 'none';
  }, CLIP_TEXT.noteMs);
}

/** Every course clip id with no recording yet (the check script and the tests list these). */
export function missingClips(ids: Iterable<string>): string[] {
  const out: string[] = [];
  for (const id of ids) if (!RECORDED.has(id)) out.push(id);
  return out;
}

/** Play a word's clip, cutting off the one before. Silent until sound is on. */
export function playWord(id: string): void {
  if (!isAudioUnlocked() || !isSoundEnabled()) return;
  try {
    current?.pause();
    const clip = clipFor(id);
    if (clip.placeholder) sayMissing();
    current = new Audio(clip.url);
    void current.play().catch(() => undefined);
  } catch {
    // No audio element on this device: the word still shows its romanisation.
  }
}

/**
 * R0344 (FUN-55): recorded voice-over for scripted lines. A line's stable id (`Line.id`) is
 * listed here once its file lands at `audio/vo/<id>.mp3`; until then the read-aloud falls
 * back to the device voice. Hazel's letter and sprout chapter 1 are recorded first.
 */
export const VO_RECORDED: ReadonlySet<string> = new Set<string>([]);

let voCurrent: HTMLAudioElement | null = null;

/** Play a line's recording; false when there is none (the caller speaks it instead). */
export function playVoClip(id: string | undefined, onEnded?: () => void): boolean {
  if (!id || !VO_RECORDED.has(id) || !isAudioUnlocked() || !isSoundEnabled()) return false;
  try {
    voCurrent?.pause();
    voCurrent = new Audio(`${base()}audio/vo/${id}.mp3`);
    if (onEnded) voCurrent.addEventListener('ended', onEnded, { once: true });
    void voCurrent.play().catch(() => undefined);
    return true;
  } catch {
    return false;
  }
}

export function stopVoClip(): void {
  try {
    voCurrent?.pause();
  } catch {
    // Nothing was playing.
  }
}
