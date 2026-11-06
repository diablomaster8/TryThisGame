/**
 * R0707: the tracing book in Nova's postcard. Every Hebrew letter and kana met so far in a
 * word is listed in course order and can be traced at any time, with no quest. UI only; it
 * sends nothing to the sim (the trace opens with an empty quest id).
 */
import { TRACE_BOOK_TEXT } from '../config/strings-trace-book';
import type { VocabItem } from '../content/types';
import type { Game } from '../game';
import { langCourses } from '../sim/lang';
import { button, el } from './dom';
import { HEBREW_STROKES } from './hebrew-strokes';
import { KANA_STROKES } from './kana-strokes';
import { TraceGame } from './trace';

export interface BookGlyph {
  glyph: string;
  lang: 'he' | 'ja';
}

/** Glyphs with stroke guides that appear in the native script of the given words, once each. */
export function metGlyphs(words: readonly VocabItem[]): BookGlyph[] {
  const seen = new Set<string>();
  const out: BookGlyph[] = [];
  for (const w of words) {
    for (const ch of w.native) {
      const table = w.lang === 'he' ? HEBREW_STROKES : KANA_STROKES;
      if (!table[ch] || seen.has(ch)) continue;
      seen.add(ch);
      out.push({ glyph: ch, lang: w.lang });
    }
  }
  return out;
}

/** The words the child has heard, over every course, in course order. */
export function metWords(g: Game): VocabItem[] {
  const heard = g.world.edu?.words ?? {};
  return langCourses().flatMap((c) => c.vocab.filter((w) => (heard[w.id]?.heard ?? 0) > 0));
}

export class TraceBook {
  private readonly tracer: TraceGame;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.tracer = new TraceGame(parent, game);
  }

  /** Fill `body` with the book: a grid of glyph buttons, and a way back. */
  render(body: HTMLElement, back: () => void): void {
    const g = this.game();
    body.textContent = '';
    body.appendChild(el('h3', undefined, TRACE_BOOK_TEXT.title));
    const glyphs = g ? metGlyphs(metWords(g)) : [];
    if (glyphs.length === 0) body.appendChild(el('p', 'help', TRACE_BOOK_TEXT.none));
    else {
      body.appendChild(el('p', 'help', TRACE_BOOK_TEXT.help));
      const grid = el('div', 'lang-tiles trace-book');
      for (const { glyph, lang } of glyphs) {
        const b = button(
          glyph,
          () => this.tracer.open('', { lang, glyphs: [glyph] }, () => undefined),
          'btn lang-tile trace-book-glyph',
        );
        b.lang = lang;
        b.setAttribute('aria-label', TRACE_BOOK_TEXT.letterLabel(glyph));
        grid.appendChild(b);
      }
      body.appendChild(grid);
    }
    body.appendChild(button(`← ${TRACE_BOOK_TEXT.back}`, back, 'btn'));
  }
}
