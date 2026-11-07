/**
 * A 5×7 bitmap font for text drawn inside the game canvases (races, Expedition,
 * karate, pocket mode), so numbers and names sit on the same pixel grid as the art.
 * Glyphs are rows of '#' and '.'; unknown characters draw as a box.
 */
const GLYPHS: Record<string, string[]> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '####.', '#...#', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '####.', '#....', '#....', '#....', '#####'],
  F: ['#####', '#....', '####.', '#....', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#..##', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#####', '#...#', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['....#', '....#', '....#', '....#', '#...#', '#...#', '.###.'],
  K: ['#...#', '#..#.', '###..', '#..#.', '#...#', '#...#', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '####.', '#....', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '####.', '#.#..', '#..#.', '#...#', '#...#'],
  S: ['.####', '#....', '.###.', '....#', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '.#.#.', '..#..', '..#..', '..#..', '.#.#.', '#...#'],
  Y: ['#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#..##', '#.#.#', '##..#', '#...#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '..##.', '.#...', '#....', '#####'],
  '3': ['####.', '....#', '.###.', '....#', '....#', '....#', '####.'],
  '4': ['#...#', '#...#', '#####', '....#', '....#', '....#', '....#'],
  '5': ['#####', '#....', '####.', '....#', '....#', '....#', '####.'],
  '6': ['.###.', '#....', '####.', '#...#', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '..#..', '..#..', '..#..'],
  '8': ['.###.', '#...#', '.###.', '#...#', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  ',': ['.....', '.....', '.....', '.....', '.##..', '..#..', '.#...'],
  ':': ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....'],
  '!': ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..'],
  '?': ['.###.', '#...#', '....#', '..##.', '..#..', '.....', '..#..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  '%': ['##..#', '##..#', '...#.', '..#..', '.#...', '#..##', '#..##'],
  "'": ['..#..', '..#..', '.#...', '.....', '.....', '.....', '.....'],
  '·': ['.....', '.....', '.....', '..#..', '.....', '.....', '.....'],
  '(': ['...#.', '..#..', '.#...', '.#...', '.#...', '..#..', '...#.'],
  ')': ['.#...', '..#..', '...#.', '...#.', '...#.', '..#..', '.#...'],
  '♥': ['.#.#.', '#####', '#####', '#####', '.###.', '..#..', '.....'],
  '★': ['..#..', '..#..', '#####', '.###.', '.###.', '#...#', '.....'],
};

const BOX = ['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'];

export const FONT_W = 5;
export const FONT_H = 7;

/** Text width in pixels at `scale`. */
export function measureText(text: string, scale = 1): number {
  return text.length * (FONT_W + 1) * scale - scale;
}

/**
 * Draw `text` with its top-left at (x, y). Lower-case letters draw as capitals; letters
 * with accents fall back to their base where easy. `align` moves the anchor.
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  scale = 1,
  align: 'left' | 'center' | 'right' = 'left',
): void {
  const width = measureText(text, scale);
  let cx = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  cx = Math.round(cx);
  ctx.fillStyle = color;
  // PERF: the whole string is one path, built from each glyph's pixel runs (cached), not a
  // fillRect per lit pixel and an NFD normalise per letter every frame. The runs are disjoint
  // whole-pixel rectangles, so the fill is the same picture, translucent colours included.
  ctx.beginPath();
  for (const raw of text) {
    for (const [c, r, len] of runsOf(raw))
      ctx.rect(cx + c * scale, y + r * scale, len * scale, scale);
    cx += (FONT_W + 1) * scale;
  }
  ctx.fill();
}

/** A glyph's lit pixels as horizontal runs: [column, row, length]. */
const RUNS = new Map<string, ReadonlyArray<readonly [number, number, number]>>();

function runsOf(raw: string): ReadonlyArray<readonly [number, number, number]> {
  let runs = RUNS.get(raw);
  if (runs) return runs;
  const ch = raw.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  const g = GLYPHS[ch] ?? BOX;
  const out: Array<readonly [number, number, number]> = [];
  for (let r = 0; r < FONT_H; r++) {
    const row = g[r] ?? '';
    let c = 0;
    while (c < FONT_W) {
      if (row[c] !== '#') {
        c++;
        continue;
      }
      let end = c;
      while (end < FONT_W && row[end] === '#') end++;
      out.push([c, r, end - c]);
      c = end;
    }
  }
  runs = out;
  RUNS.set(raw, runs);
  return runs;
}

/** Text with a one-pixel dark shadow, the usual HUD look. */
export function drawShadowText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  shadow: string,
  scale = 1,
  align: 'left' | 'center' | 'right' = 'left',
): void {
  drawText(ctx, text, x + scale, y + scale, shadow, scale, align);
  drawText(ctx, text, x, y, color, scale, align);
}
