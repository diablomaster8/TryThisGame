/**
 * The two read-aloud switches, apart from the music and the sound effects: "story" (the
 * dialogue's lines, the story's choices and chapter cards) and "ui" (everything else the game
 * says: menus, cards, captions, prompts). Every device-voice or recorded-voice line goes
 * through `speakLine`, which asks `isVoiceOn(channel)` first, so one switch gates a whole
 * channel however many call sites there are.
 *
 * Defaults: both off in the main game; both on in a Learning Grove save that reads aloud
 * (the sprout band, or the reader band with "read to me"). An explicit choice in Settings
 * (`Settings.voicesStory`, `Settings.voicesUi`) always wins. Pure resolution plus a tiny
 * module-level state, so it can be unit tested without a browser.
 */

export type VoiceChannel = 'story' | 'ui';

/** The slice of a world this needs. */
export interface VoiceSettings {
  voicesStory?: boolean | undefined;
  voicesUi?: boolean | undefined;
}

export interface VoiceEdu {
  band: string;
  readToMe?: boolean | undefined;
}

export interface VoiceState {
  story: boolean;
  ui: boolean;
}

/** Whether a save reads aloud by default: the read-aloud age, or a grown-up's opt-in. */
export function readsAloudByDefault(edu: VoiceEdu | null | undefined): boolean {
  return !!edu && (edu.band === 'sprout' || edu.readToMe === true);
}

/** What a world wants: the explicit choice, else the default for its mode and band. */
export function resolveVoices(
  settings: VoiceSettings,
  edu: VoiceEdu | null | undefined,
): VoiceState {
  const dflt = readsAloudByDefault(edu);
  return { story: settings.voicesStory ?? dflt, ui: settings.voicesUi ?? dflt };
}

const KEY = 'grove-voices-last';

/** The last applied state, so the title screen (before any save loads) follows it. */
function readMirror(): VoiceState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<VoiceState>;
      return { story: v.story === true, ui: v.ui === true };
    }
  } catch {
    // Storage may be blocked; the default is silent.
  }
  return { story: false, ui: false };
}

function writeMirror(s: VoiceState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // A nicety only.
  }
}

let state: VoiceState | null = null;
let speaking: VoiceChannel | null = null;
const stoppers = new Set<() => void>();

function current(): VoiceState {
  state ??= readMirror();
  return state;
}

export function isVoiceOn(channel: VoiceChannel): boolean {
  return current()[channel];
}

/** `speakLine` says which channel is talking, so turning that one off can cut it short. */
export function noteSpeaking(channel: VoiceChannel | null): void {
  speaking = channel;
}

/** Something that stops spoken audio (the device voice, a recorded clip). */
export function onVoiceStop(fn: () => void): void {
  stoppers.add(fn);
}

function stopAll(): void {
  speaking = null;
  for (const f of stoppers) {
    try {
      f();
    } catch {
      // Nothing to stop.
    }
  }
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // No speech engine.
  }
}

/** Apply a state. A channel that goes off cuts its own speech in progress at once. */
export function setVoices(next: VoiceState): void {
  const prev = current();
  if (prev.story === next.story && prev.ui === next.ui) return;
  state = { ...next };
  writeMirror(state);
  if (speaking && prev[speaking] && !next[speaking]) stopAll();
}

export function applyVoices(settings: VoiceSettings, edu: VoiceEdu | null | undefined): void {
  setVoices(resolveVoices(settings, edu));
}

/**
 * The master mute (the HUD speaker, the kid sheet): off silences both read-aloud switches
 * with an explicit choice; on clears them back to the mode's default.
 */
export function masterMuteSettings<T extends VoiceSettings>(settings: T, on: boolean): T {
  const next: T = { ...settings };
  if (on) {
    delete next.voicesStory;
    delete next.voicesUi;
  } else {
    next.voicesStory = false;
    next.voicesUi = false;
  }
  return next;
}

/** Test hook: forget the module state. */
export function resetVoicesForTest(next: VoiceState | null = null): void {
  state = next;
  speaking = null;
  stoppers.clear();
}
