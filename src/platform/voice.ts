/**
 * R0698 (KIDS-30): which device voice reads aloud. `pickVoice` prefers the grown-up's saved
 * choice, else a local (on-device) voice over a network one, English-British first, then any
 * English, and among those the names that say a better engine ("Natural", "Enhanced",
 * "Premium", "Neural"). The pick is made again when the browser reports its voices
 * (`voiceschanged`), since many browsers have none at first. The choice is stored in the
 * browser (never in the save: voices differ per device). Pure helpers plus two guarded
 * storage calls.
 */
import { READ_ALOUD } from '../config/tuning-fun-r7';

const KEY = 'grove-voice';

/** The saved voice name, or null. Storage may be blocked, so every call is guarded. */
export function savedVoiceName(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Save the grown-up's choice (null clears it). */
export function saveVoiceName(name: string | null): void {
  try {
    if (name) window.localStorage.setItem(KEY, name);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage is a nicety; the default pick still works.
  }
}

type VoiceLike = Pick<SpeechSynthesisVoice, 'name' | 'lang' | 'localService'>;

/** Lower is better. */
function rank<T extends VoiceLike>(v: T): number {
  const engine = READ_ALOUD.bestVoice.findIndex((w) => v.name.includes(w));
  const quality = engine < 0 ? READ_ALOUD.bestVoice.length : engine;
  const local = v.localService ? 0 : 1;
  const region = /GB/i.test(v.lang) ? 0 : 1;
  // Local first (a network voice fails offline), then the region, then the engine's name.
  return local * 100 + region * 10 + quality;
}

/** The English voices, best first. */
export function englishVoices<T extends VoiceLike>(voices: readonly T[]): T[] {
  return voices.filter((v) => /^en/i.test(v.lang)).sort((a, b) => rank(a) - rank(b));
}

/** The voice to read with: the saved one if the device still has it, else the best English. */
export function pickVoice<T extends VoiceLike>(
  voices: readonly T[],
  saved: string | null = savedVoiceName(),
): T | null {
  if (saved) {
    const own = voices.find((v) => v.name === saved);
    if (own) return own;
  }
  return englishVoices(voices)[0] ?? null;
}

/** The pick for this device, made again whenever the voice list changes. */
let current: SpeechSynthesisVoice | null = null;
let wired = false;

export function currentVoice(): SpeechSynthesisVoice | null {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return null;
    if (!wired) {
      wired = true;
      synth.addEventListener?.('voiceschanged', () => {
        current = pickVoice(synth.getVoices());
      });
    }
    current ??= pickVoice(synth.getVoices?.() ?? []);
    return current;
  } catch {
    return null;
  }
}

/** The grown-up chose a voice (or null for the automatic pick). */
export function chooseVoice(name: string | null): void {
  saveVoiceName(name);
  current = null;
}
