/**
 * R0522 (SOUL-02): the personality on the stats sheet: a small pixel icon, the word and a
 * one-line blurb; for a child, its leaning ("Leaning: Shy?", faded, R0523). Tapping the
 * chip opens a short list of what that personality tends to do. Colour is never the only
 * signal: every chip has its icon and its word. Reads the world only.
 */
import { PERSONALITY_LABELS } from '../config/strings';
import { SPROUT_TEXT } from '../config/strings-soul-r11h';
import {
  PERSONALITY_BLURBS,
  PERSONALITY_CHIP_TEXT,
  PERSONALITY_TENDENCIES,
  FORMING_TEXT,
} from '../config/strings-fun-r7';
import { PALETTE } from '../render/sprites/palette';
import { PERSONALITIES, leanShares, leaningPersonality } from '../sim/personality';
import { LIFECYCLE } from '../config/tuning';
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
  // R0529: the second four. Curious: wide eyes and a question mark.
  curious: {
    rows: [
      '.....tt.',
      '..ccc..t',
      '.ccccct.',
      'cKKccKKc',
      'cKKccKKc',
      'ccccccct',
      'cccKKccc',
      '.cccccc.',
    ],
    ink: { c: 30, K: 0, t: 0 },
  },
  // Gentle: closed, smiling eyes and a heart.
  gentle: {
    rows: [
      '..bbbb..',
      '.bbbbbb.',
      'bKKbbKKb',
      'bbbbbbbb',
      'bbbbbbbb',
      'bbKbbKbb',
      '.bbKKbr.',
      '..bbbrrr',
    ],
    ink: { b: 34, K: 0, r: 24 },
  },
  // Bold: a stern brow and a big grin.
  bold: {
    rows: [
      '..oooo..',
      '.oooooo.',
      'oKKooKKo',
      'ooKooKoo',
      'oooooooo',
      'oKKKKKKo',
      '.oK66Ko.',
      '..oooo..',
    ],
    ink: { o: 21, K: 0, '6': 6 },
  },
  // Dreamy: half-shut eyes and a little star.
  dreamy: {
    rows: [
      's.vvvv..',
      '.vvvvvv.',
      'vvvvvvvv',
      'vKKvvKKv',
      'vvvvvvvv',
      'vvvKKvvv',
      '.vvvvvv.',
      '..vvvv..',
    ],
    ink: { v: 19, K: 0, s: 20 },
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
      if (this.say) {
        this.onSay?.(this.say);
        return;
      }
      this.details.hidden = !this.details.hidden;
      this.root.setAttribute('aria-expanded', String(!this.details.hidden));
    });
  }

  /**
   * `sprout` (R0567): the Learning Grove's youngest band sees the face icon alone, with a
   * read-aloud line ("Pip feels shy today") and no word or blurb.
   */
  update(n: Nubbin, sprout = false): void {
    const p = leaningPersonality(n);
    const forming = !n.personality;
    const key = `${n.id}:${n.stage}:${p}:${forming}:${sprout}`;
    if (key === this.shown) return;
    this.shown = key;
    this.details.hidden = true;
    this.root.innerHTML = '';
    this.details.innerHTML = '';
    this.root.classList.toggle('forming', forming);
    this.root.hidden = n.stage === 'egg' || n.stage === 'cocoon';
    this.say = '';
    if (!p) {
      this.root.append(el('span', 'personality-word', PERSONALITY_CHIP_TEXT.none));
      this.root.disabled = true;
      return;
    }
    this.root.disabled = false;
    const word = PERSONALITY_LABELS[p];
    if (sprout) {
      const icon = personalityIcon(p);
      this.root.setAttribute('aria-label', SPROUT_TEXT.chipLabel(word));
      this.root.append(icon);
      this.say = SPROUT_TEXT.feels(n.name, word);
      return;
    }
    this.root.removeAttribute('aria-label');
    this.say = '';
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
    // R0578: what moves a child's leaning, under its tendencies.
    if (forming) {
      const hints = el('ul', 'forming-hints');
      for (const h of FORMING_TEXT.hints) hints.appendChild(el('li', undefined, h));
      this.details.appendChild(hints);
    }
  }

  /**
   * R0578 (SOUL-61): a child's forming meter: four bars with their icons, filled by the
   * share of each leaning, and when it locks. Kids see no minutes. Redrawn every refresh.
   */
  meter(n: Nubbin, kids: boolean): void {
    const child = n.stage === 'child' && !n.personality;
    this.forming.hidden = !child;
    if (!child) return;
    const shares = leanShares(n);
    this.forming.innerHTML = '';
    const row = el('div', 'forming-bars');
    // R0529: the first four always; the second four once their own care has begun, so a
    // phone sheet is not eight thin bars from the start.
    const shown = PERSONALITIES.filter((p, i) => i < 4 || shares[p] > 0);
    for (const p of shown) {
      const bar = el('div', 'forming-bar');
      bar.setAttribute('role', 'img'); // TECH-28: an aria-label needs a role to be read.
      bar.setAttribute('aria-label', `${PERSONALITY_LABELS[p]} ${Math.round(shares[p] * 100)}%`);
      bar.title = PERSONALITY_LABELS[p];
      const fill = el('div', 'forming-fill');
      fill.style.height = `${Math.round(shares[p] * 100)}%`;
      bar.append(fill);
      const cell = el('div', 'forming-cell');
      cell.append(bar, personalityIcon(p));
      row.appendChild(cell);
    }
    const left = Math.max(0, Math.ceil((LIFECYCLE.childMs - n.stageMs) / 60_000));
    this.forming.append(
      row,
      el(
        'small',
        'forming-label',
        kids ? FORMING_TEXT.locksSoon(n.name) : FORMING_TEXT.locks(n.name, left),
      ),
    );
  }

  /** The read-aloud line for the sprout band's icon chip (empty elsewhere). */
  say = '';
  /** Set by the sheet: speaks a line when a read-aloud world is on. */
  onSay: ((text: string) => void) | null = null;

  /** The forming meter's box, shown under the chip for a child. */
  readonly forming: HTMLDivElement = el('div', 'personality-forming');
}
