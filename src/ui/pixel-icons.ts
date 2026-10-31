/**
 * TECH-61 (R0502): the top bar's and action bar's icons as pixel art from the shared palette,
 * in place of emoji (which every system draws differently, and which do not match the pixel
 * HUD). Each icon is a 12 x 12 grid written as text, one letter a palette colour; it is drawn
 * once to a canvas and kept as a data URL, so nothing is drawn per frame. A glyph with no
 * icon here keeps its emoji. The button keeps its text label and aria name.
 */
import { C, color } from '../render/sprites/palette';

/** One letter per palette colour; '.' is clear. */
const INK: Record<string, number> = {
  k: C.ink,
  p: C.darkPlum,
  w: C.white,
  c: C.cream,
  s: C.sand,
  S: C.sandDeep,
  b: C.bark,
  B: C.darkBark,
  y: C.sunYellow,
  Y: C.sunDeep,
  o: C.orange,
  r: C.berry,
  R: C.roseDeep,
  g: C.leaf,
  G: C.leafDeep,
  t: C.teal,
  T: C.tealDeep,
  l: C.skyLight,
  d: C.skyDeep,
  v: C.violet,
  V: C.violetDeep,
  m: C.lavender,
  e: C.greyLight,
  E: C.greyDeep,
};

/* prettier-ignore */
const ICONS: Record<string, readonly string[]> = {
  // Journal: an open book.
  '📖': [
    '............',
    '.kkkk..kkkk.',
    'kccccckcccck',
    'kcsssckcsssk',
    'kcccccbcccck',
    'kcsssckcsssk',
    'kcccccbcccck',
    'kcsssckcsssk',
    'kcccccbcccck',
    'kkkkkkbkkkkk',
    '.RRRRRRRRRR.',
    '............',
  ],
  // Roster: a clipboard with lines.
  '📋': [
    '....kkkk....',
    '.bbkeeeekbb.',
    '.bkkkkkkkkb.',
    '.bkwwwwwwkb.',
    '.bkwEEEEwkb.',
    '.bkwwwwwwkb.',
    '.bkwEEEwwkb.',
    '.bkwwwwwwkb.',
    '.bkwEEEEwkb.',
    '.bkwwwwwwkb.',
    '.bkkkkkkkkb.',
    '.bbbbbbbbbb.',
  ],
  // More: three dots.
  '⋯': [
    '............',
    '............',
    '............',
    '............',
    '.kk..kk..kk.',
    'kcckkcckkcck',
    'kcckkcckkcck',
    '.kk..kk..kk.',
    '............',
    '............',
    '............',
    '............',
  ],
  // Explore: a compass.
  '🧭': [
    '....kkkk....',
    '..kkYyyYkk..',
    '.kYccrcccYk.',
    '.kcccrrccck.',
    'kYcccrrcccYk',
    'kyccckkcccyk',
    'kycccEEcccyk',
    'kYcccEEcccYk',
    '.kcccccccck.',
    '.kYccccccYk.',
    '..kkYyyYkk..',
    '....kkkk....',
  ],
  // Races: a chequered flag.
  '🏁': [
    'kk..........',
    'kbkkkkkkkkk.',
    'kbwkwkwkwkk.',
    'kbkwkwkwkwk.',
    'kbwkwkwkwkk.',
    'kbkwkwkwkwk.',
    'kbkkkkkkkkk.',
    'kb..........',
    'kb..........',
    'kb..........',
    'kb..........',
    'kk..........',
  ],
  // Shop: a basket of fruit.
  '🛒': [
    '............',
    '...rr..gg...',
    '..rrrrggoo..',
    '..rRrgGooo..',
    'kkkkkkkkkkkk',
    'kSssSssSssSk',
    '.kssSssSssk.',
    '.kSssSssSsk.',
    '..kssSssSk..',
    '..kSssSssk..',
    '...kkkkkk...',
    '............',
  ],
  // Keeper, Sun: a sun.
  '☀': [
    '.....y......',
    '..y..y..y...',
    '...y.y.y....',
    '....YYY.....',
    'yyyYyyyYyyy.',
    '...YyyyyY...',
    '....YYY.....',
    '...y.y.y....',
    '..y..y..y...',
    '.....y......',
    '............',
    '............',
  ],
  // Keeper, Moon: a crescent with a star.
  '☾': [
    '....mmm.....',
    '..mmVV......',
    '.mmV........',
    '.mV.....y...',
    'mmV....yyy..',
    'mV......y...',
    'mV..........',
    'mmV.........',
    '.mmV.....mm.',
    '.mmmVV.mmm..',
    '..mmmmmmm...',
    '....mmm.....',
  ],
  // Settings: a gear.
  '⚙': [
    '....eeee....',
    '.e..eEEe..e.',
    '.eeeeeeeeee.',
    '..eeeEEeee..',
    'eeeeE..Eeeee',
    'eEeE....EeEe',
    'eEeE....EeEe',
    'eeeeE..Eeeee',
    '..eeeEEeee..',
    '.eeeeeeeeee.',
    '.e..eEEe..e.',
    '....eeee....',
  ],
  // Learning Grove: a mortarboard.
  '🎓': [
    '............',
    '............',
    '.....kk.....',
    '...kkVVkk...',
    '.kkVVVVVVkk.',
    'kVVVVVVVVVVk',
    '.kkVVVVVVkky',
    '...kVVVVk..y',
    '...kVVVVk..y',
    '...kkkkkk.yy',
    '............',
    '............',
  ],
  // Sprout roster: a hatching chick.
  '🐣': [
    '............',
    '....kkkk....',
    '...kyyyyk...',
    '..kyykyyok..',
    '..kyyyyyook.',
    '..kyyyyyk...',
    '.kwkwkwkwk..',
    '.kwwwwwwwwk.',
    '.kwwswwswwk.',
    '..kwwwwwwk..',
    '...kkkkkk...',
    '............',
  ],
  // Sprout more: a folded map.
  '🗺': [
    '............',
    'kkkkkkkkkkkk',
    'ksggsgsgglsk',
    'kgsgglggllsk',
    'ksgglllgslgk',
    'kgglllggsggk',
    'kgllrgggsgsk',
    'kslgggsgsggk',
    'ksggsgsglggk',
    'kkkkkkkkkkkk',
    '............',
    '............',
  ],
  // Sound on: a speaker and waves.
  '🔊': [
    '............',
    '.....k...t..',
    '....kk.t..t.',
    'kkkkek..t.t.',
    'keeeekt.t..t',
    'keeeek.t.t.t',
    'keeeek.t.t.t',
    'keeeekt.t..t',
    'kkkkek..t.t.',
    '....kk.t..t.',
    '.....k...t..',
    '............',
  ],
  // Sound off: a speaker and a cross.
  '🔇': [
    '............',
    '.....k......',
    '....kk......',
    'kkkkek......',
    'keeeek.r...r',
    'keeeek..r.r.',
    'keeeek...r..',
    'keeeek..r.r.',
    'kkkkek.r...r',
    '....kk......',
    '.....k......',
    '............',
  ],
};

const urls = new Map<string, string | null>();

/** The icon for an emoji glyph as a data URL, or null to keep the emoji. */
export function pixelIcon(glyph: string): string | null {
  const known = urls.get(glyph);
  if (known !== undefined) return known;
  const rows = ICONS[glyph];
  let url: string | null = null;
  if (rows && typeof document !== 'undefined') {
    try {
      const c = document.createElement('canvas');
      c.width = 12;
      c.height = 12;
      const ctx = c.getContext('2d');
      if (ctx) {
        rows.forEach((row, y) => {
          for (let x = 0; x < 12; x++) {
            const ink = INK[row[x] ?? '.'];
            if (ink === undefined) continue;
            ctx.fillStyle = color(ink);
            ctx.fillRect(x, y, 1, 1);
          }
        });
        url = c.toDataURL();
      }
    } catch {
      url = null;
    }
  }
  urls.set(glyph, url);
  return url;
}

/** For tests: every icon is a 12 x 12 grid of known letters. */
export function iconGridProblems(): string[] {
  const out: string[] = [];
  for (const [g, rows] of Object.entries(ICONS)) {
    if (rows.length !== 12) out.push(`${g}: ${rows.length} rows`);
    rows.forEach((r, i) => {
      if (r.length !== 12) out.push(`${g} row ${i}: ${r.length} wide`);
      for (const ch of r) if (ch !== '.' && INK[ch] === undefined) out.push(`${g} row ${i}: '${ch}'`);
    });
  }
  return out;
}

/** Put a glyph on an icon span: the pixel icon when there is one, else the emoji text. */
export function setIconGlyph(span: Element, glyph: string): void {
  const url = pixelIcon(glyph);
  const el = span as HTMLElement;
  if (el.dataset.glyph === glyph) return;
  el.dataset.glyph = glyph;
  if (url) {
    el.textContent = '';
    el.classList.add('px-icon');
    el.style.backgroundImage = `url(${url})`;
  } else {
    el.classList.remove('px-icon');
    el.style.backgroundImage = '';
    el.textContent = glyph;
  }
}
