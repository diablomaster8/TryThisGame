/**
 * R0522 (SOUL-02): the personality on the stats sheet: a small pixel icon, the word and a
 * one-line blurb; for a child, its leaning ("Leaning: Shy?", faded, R0523). Tapping the
 * chip opens a short list of what that personality tends to do. Colour is never the only
 * signal: every chip has its icon and its word. Reads the world only.
 */
import { PERSONALITY_LABELS } from '../config/strings';
import {
  PERSONALITY_BLURBS,
  PERSONALITY_CHIP_TEXT,
  PERSONALITY_TENDENCIES,
} from '../config/strings-fun-r7';
import { PALETTE } from '../render/sprites/palette';
import { leaningPersonality } from '../sim/personality';
import type { Nubbin, Personality } from '../sim/types';
import { el } from './dom';

/** 8×8 icons, one letter per pixel: a face for each personality. '.' is clear. */
const ICONS: Record<Personality, { rows: string[]; ink: Record<string, number> }> = {
  // A sun face.
  cheerful: {
    rows: [
      'y..yy..y',
      '.yyyyyy.',
      'yyKyyKyy',
      'yyyyyyyy',
      'yKyyyyKy',
      'yyKKKKyy',
      '.yyyyyy.',
      'y..yy..y',
    ],
    ink: { y: 20, K: 0 },
  },
  // Two hands over the eyes.
  shy: {
    rows: [
      '..pppp..',
      '.pppppp.',
      'hhhphhhh',
      'hhhphhhh',
      'pppppppp',
      'pppKKppp',
      '.pppppp.',
      '..pppp..',
    ],
    ink: { p: 25, h: 15, K: 0 },
  },
  // A grin and a wink.
  mischievous: {
    rows: [
      '..gggg..',
      '.gggggg.',
      'gKKggKgg',
      'gggggggg',
      'gKggggKg',
      'ggKKKKgg',
      '.ggRRgg.',
      '..gggg..',
    ],
    ink: { g: 10, K: 0, R: 24 },
  },
  // A flop with a Z.
  lazy: {
    rows: [
      '.....ZZZ',
      '......Z.',
      '.....ZZZ',
      '.llllll.',
      'llllllll',
      'lKKllKKl',
      'llllllll',
      '.llllll.',
    ],
    ink: { l: 28, K: 0, Z: 6 },
  },
};

/** The icon as a small pixelated canvas. */
export function personalityIcon(p: Personality): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 8;
  c.className = 'personality-icon';
  c.setAttribute('aria-hidden', 'true');
  const ctx = c.getContext('2d');
  if (ctx) {
    const icon = ICONS[p];
    icon.rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        const i = icon.ink[ch];
        if (i === undefined) return;
        ctx.fillStyle = PALETTE[i] ?? '#000';
        ctx.fillRect(x, y, 1, 1);
      }),
    );
  }
  return c;
}

export class PersonalityChip {
  readonly root: HTMLButtonElement;
  /** The card that opens under the chip. */
  readonly details: HTMLDivElement;
  private shown: string | null = null;

  constructor() {
    this.root = el('button', 'personality-chip');
    this.root.type = 'button';
    this.details = el('div', 'personality-card');
    this.details.hidden = true;
    this.root.addEventListener('click', () => {
      this.details.hidden = !this.details.hidden;
      this.root.setAttribute('aria-expanded', String(!this.details.hidden));
    });
  }

  update(n: Nubbin): void {
    const p = leaningPersonality(n);
    const forming = !n.personality;
    const key = `${n.id}:${n.stage}:${p}:${forming}`;
    if (key === this.shown) return;
    this.shown = key;
    this.details.hidden = true;
    this.root.innerHTML = '';
    this.details.innerHTML = '';
    this.root.classList.toggle('forming', forming);
    this.root.hidden = n.stage === 'egg' || n.stage === 'cocoon';
    if (!p) {
      this.root.append(el('span', 'personality-word', PERSONALITY_CHIP_TEXT.none));
      this.root.disabled = true;
      return;
    }
    this.root.disabled = false;
    const word = PERSONALITY_LABELS[p];
    this.root.append(
      personalityIcon(p),
      el('span', 'personality-word', forming ? PERSONALITY_CHIP_TEXT.leaning(word) : word),
      el(
        'span',
        'personality-blurb',
        forming ? PERSONALITY_CHIP_TEXT.leaningHelp : PERSONALITY_BLURBS[p],
      ),
    );
    this.details.append(el('strong', undefined, PERSONALITY_CHIP_TEXT.tends));
    const list = el('ul');
    for (const t of PERSONALITY_TENDENCIES[p]) list.appendChild(el('li', undefined, t));
    this.details.appendChild(list);
  }
}
