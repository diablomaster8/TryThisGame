/**
 * R0342 (FUN-53): the read-aloud voice's shaping, kept apart from the lesson widgets so it
 * can be tested without a page. Each speaker gets a pitch and rate (`VOICE_TTS`); a shouted
 * word is said lowercased, in a chunk of its own with a pitch bump, so no engine spells
 * "HEY" out letter by letter; the device's best English voice is picked once and kept; and
 * the word being said is reported back so the dialogue box can light it (karaoke).
 */
import { READ_ALOUD, VOICE_TTS } from '../config/tuning-fun-r7';

/** One utterance: its text, whether it is a shout, and where it starts in the said line. */
export interface SayChunk {
  text: string;
  shout: boolean;
  at: number;
}

/** A word of two or more capitals (allowing a trailing "!" run), not "I" and not "OK". */
const SHOUT = /\b[A-Z][A-Z']*[A-Z]\b/g;
const KEEP_CAPS = new Set(['OK', 'TV', 'UK', 'DJ']);

/** The speaker's pitch and rate; narration and anyone unlisted get the default. */
export function voiceFor(speaker: string | null | undefined): { pitch: number; rate: number } {
  return (speaker && VOICE_TTS[speaker]) || VOICE_TTS.default!;
}

/**
 * A line cut round its shouted words: plain runs as they are, each shout lowercased in a
 * chunk of its own. `at` is the chunk's offset in `text`, for the word highlight.
 */
export function shoutChunks(text: string): SayChunk[] {
  const out: SayChunk[] = [];
  let last = 0;
  for (const m of text.matchAll(SHOUT)) {
    if (KEEP_CAPS.has(m[0])) continue;
    const at = m.index ?? 0;
    if (text.slice(last, at).trim())
      out.push({ text: text.slice(last, at), shout: false, at: last });
    out.push({ text: m[0].toLowerCase(), shout: true, at });
    last = at + m[0].length;
  }
  if (text.slice(last).trim()) out.push({ text: text.slice(last), shout: false, at: last });
  return out.length ? out : [{ text, shout: false, at: 0 }];
}

/** The pause after a line before anything follows it: a beat after a "!" for the comedy. */
export function pauseAfterLine(text: string): number {
  return /!["”’)]*\s*$/.test(text) ? READ_ALOUD.bangPauseMs : 0;
}

let chosen: SpeechSynthesisVoice | null | undefined;

/**
 * The best English voice on the device, picked once: British first, then any English; among
 * those, one whose name says it is a better engine ("Natural", "Neural" and so on).
 */
export function bestVoice(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (chosen !== undefined && chosen !== null) return chosen;
  if (!voices.length) return null;
  const en = voices.filter((v) => /^en/i.test(v.lang));
  const gb = en.filter((v) => /GB/i.test(v.lang));
  const rank = (v: SpeechSynthesisVoice): number => {
    const i = READ_ALOUD.bestVoice.findIndex((w) => v.name.includes(w));
    return i < 0 ? READ_ALOUD.bestVoice.length : i;
  };
  const pool = gb.length ? gb : en;
  chosen = [...pool].sort((a, b) => rank(a) - rank(b))[0] ?? null;
  return chosen;
}

/** For tests: forget the chosen voice. */
export function resetVoiceChoice(): void {
  chosen = undefined;
}

/**
 * R0342: the karaoke light over the dialogue text, through the CSS Custom Highlight API so
 * the typed text and its glossary spans are never rebuilt. Each word said lights its next
 * match after the last one lit; a browser without the API simply shows no light.
 */
export class WordLight {
  private node = 0;
  private offset = 0;

  constructor(private readonly box: HTMLElement) {}

  /** A new line: start again from its first word, and clear the light. */
  reset(): void {
    this.node = 0;
    this.offset = 0;
    registry()?.delete('read-aloud');
  }

  light(word: string): void {
    const reg = registry();
    if (!reg || typeof Highlight === 'undefined') return;
    const want = word.toLowerCase();
    const walker = document.createTreeWalker(this.box, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
    for (let i = this.node; i < nodes.length; i++) {
      const t = nodes[i]!.data.toLowerCase();
      const at = t.indexOf(want, i === this.node ? this.offset : 0);
      if (at < 0) continue;
      const r = document.createRange();
      r.setStart(nodes[i]!, at);
      r.setEnd(nodes[i]!, at + want.length);
      reg.set('read-aloud', new Highlight(r));
      this.node = i;
      this.offset = at + want.length;
      return;
    }
  }
}

function registry(): HighlightRegistry | null {
  try {
    return typeof CSS !== 'undefined' && 'highlights' in CSS ? CSS.highlights : null;
  } catch {
    return null;
  }
}
