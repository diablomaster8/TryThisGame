/**
 * R0675 (KIDS-03): the clips of the Sounds and Animals games ("Who says moo?", "Which one
 * starts like cat?"). Same rules as `lang-audio.ts`: nothing plays until the first tap has
 * unlocked sound and the effects switch is on.
 *
 * One function, `resolveClip(id)`, says where a clip comes from, in this order:
 *   1. a recording at `public/<EDU_CLIPS[id]>` once its id is listed in `EDU_RECORDED`;
 *   2. for an animal or a first sound, its code-made recipe (`edu-synth.ts`);
 *   3. for a whole word, the device's speech voice.
 * A recording that fails to load falls back to 2 or 3, so a missing file is never silence.
 */
import { EDU_CLIPS } from '../config/edu';
import { planUiClips, uiClipFile } from '../config/edu-clips';
import { isAudioUnlocked, isSoundEnabled, sfxOut } from './audio';
import { EDU_RECIPES, recipeLength, renderRecipe, type Seg } from './edu-synth';

/** Clip ids with a real recording under `public/audio/edu/`. Add an id when its file lands. */
export const EDU_RECORDED: ReadonlySet<string> = new Set<string>([]);

export type ClipSource =
  | { kind: 'file'; id: string; url: string }
  | { kind: 'synth'; id: string; recipe: readonly Seg[] }
  | { kind: 'speech'; id: string; text: string };

const base = (): string => {
  try {
    return import.meta.env.BASE_URL ?? '/';
  } catch {
    return '/';
  }
};

/** Where a clip id comes from, or null for an id nothing knows. */
export function resolveClip(
  id: string,
  recorded: ReadonlySet<string> = EDU_RECORDED,
): ClipSource | null {
  const file = EDU_CLIPS[id];
  if (!file) return null;
  if (recorded.has(id)) return { kind: 'file', id, url: `${base()}${file}` };
  const recipe = EDU_RECIPES[id];
  if (recipe && recipe.length > 0) return { kind: 'synth', id, recipe };
  if (id.startsWith('word/')) return { kind: 'speech', id, text: id.slice('word/'.length) };
  return null;
}

let current: HTMLAudioElement | null = null;
let token = 0;

function speak(text: string, done: () => void): void {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return done();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 0.8;
    u.onend = done;
    u.onerror = done;
    synth.speak(u);
  } catch {
    done();
  }
}

function playSynth(recipe: readonly Seg[], done: () => void): void {
  const out = sfxOut();
  if (!out) return done();
  try {
    renderRecipe(out, recipe);
  } catch {
    return done();
  }
  window.setTimeout(done, Math.ceil(recipeLength(recipe) * 1000) + 120);
}

function playOne(id: string, done: () => void): void {
  const run = (s: ClipSource | null, fallback: () => void): void => {
    if (!s) return done();
    if (s.kind === 'synth') return playSynth(s.recipe, done);
    if (s.kind === 'speech') return speak(s.text, done);
    try {
      const a = new Audio(s.url);
      current = a;
      a.onended = done;
      a.onerror = fallback;
      void a.play().catch(fallback);
    } catch {
      fallback();
    }
  };
  const synthFallback = (): void => {
    const s = resolveClip(id, new Set());
    run(s && s.kind !== 'file' ? s : null, done);
  };
  run(resolveClip(id), synthFallback);
}

/** Play a clip, cutting off the one before. Silent until sound is on. */
export function playEduClip(id: string, onDone?: () => void): void {
  playEduClips([id], onDone);
}

/** Play clips one after another (the cue word, then its first sound). */
export function playEduClips(ids: readonly string[], onDone?: () => void): void {
  if (!isAudioUnlocked() || !isSoundEnabled()) return;
  const mine = ++token;
  try {
    current?.pause();
    window.speechSynthesis?.cancel();
  } catch {
    // No audio on this device: the round still shows its picture and words.
  }
  const step = (i: number): void => {
    if (mine !== token) return;
    if (i >= ids.length) return onDone?.();
    playOne(ids[i]!, () => window.setTimeout(() => step(i + 1), 250));
  };
  step(0);
}

/**
 * R0699 (KIDS-31): ids of the fixed-line clips (`config/edu-clips.ts`) whose recording has
 * landed under `public/audio/edu/ui/<id>.mp3`. Add an id when its file arrives; until every
 * clip a line needs is listed, the line is spoken by the device voice as before.
 */
export const EDU_UI_RECORDED: ReadonlySet<string> = new Set<string>([]);

let uiAudio: { pause(): void } | null = null;
let uiToken = 0;

/** Stop a fixed-line clip that is playing (the next line, or the story, took over). */
export function stopUiClips(): void {
  uiToken++;
  try {
    uiAudio?.pause();
  } catch {
    // Nothing to stop.
  }
  uiAudio = null;
}

/**
 * Say `text` from recordings when it is one of the fixed lines and all its clips are
 * recorded. Returns false when it is not (the caller speaks it). A clip that fails to load
 * speaks the whole line with the device voice instead, so a missing file is never silence.
 * `make` lets a test stand in for `Audio`.
 */
export function playUiText(
  text: string,
  onDone?: () => void,
  recorded: ReadonlySet<string> = EDU_UI_RECORDED,
  make: (url: string) => HTMLAudioElement = (url) => new Audio(url),
): boolean {
  if (!isAudioUnlocked() || !isSoundEnabled()) return false;
  const ids = planUiClips(text, recorded);
  if (!ids) return false;
  stopUiClips();
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // No speech engine: nothing to cut off.
  }
  const mine = uiToken;
  const fallback = (): void => {
    if (mine === uiToken) speak(text, () => onDone?.());
  };
  const step = (i: number): void => {
    if (mine !== uiToken) return;
    if (i >= ids.length) return onDone?.();
    try {
      const a = make(`${base()}${uiClipFile(ids[i]!)}`);
      uiAudio = a;
      a.onended = () => step(i + 1);
      a.onerror = fallback;
      void a.play().catch(fallback);
    } catch {
      fallback();
    }
  };
  step(0);
  return true;
}
