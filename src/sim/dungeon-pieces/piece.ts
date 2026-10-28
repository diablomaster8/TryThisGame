/**
 * The authored room pieces generator version 3 snaps together (R0144, DUNG-04). A piece is
 * an ASCII stamp: `#` wall, `.` floor, `~` water, `D` door socket (floor on the piece's
 * edge), `S` spawn spot, `L` loot spot, `X` shrine socket, `B` boss socket, `^` raised floor.
 * Sockets are read from the `D` runs on the border, so a stamp is the whole truth; the
 * assembler rotates pieces and walls up the sockets it does not use.
 */
export type PieceTag =
  'hub' | 'corridor' | 'deadEnd' | 'treasure' | 'boss' | 'entry' | 'exit' | 'secret';

export type Side = 'n' | 'e' | 's' | 'w';

export interface PieceSocket {
  dir: Side;
  /** First cell of the run along its side (x for n/s, y for e/w). */
  offset: number;
  width: number;
}

export interface Piece {
  id: string;
  tileset: string;
  size: [number, number];
  sockets: PieceSocket[];
  tags: PieceTag[];
  weight: number;
  /** The stamp, one string per row, all `size[0]` long. */
  rows: string[];
}

export const PIECE_CHARS = '#.~DSLXB^';

/** The sockets of a stamp: each run of `D` along a border. */
export function socketsOf(rows: readonly string[]): PieceSocket[] {
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  const out: PieceSocket[] = [];
  const scan = (dir: Side, len: number, at: (i: number) => string | undefined) => {
    for (let i = 0; i < len; i++) {
      if (at(i) !== 'D' || at(i - 1) === 'D') continue;
      let n = 0;
      while (at(i + n) === 'D') n++;
      out.push({ dir, offset: i, width: n });
    }
  };
  scan('n', w, (i) => rows[0]?.[i]);
  scan('s', w, (i) => rows[h - 1]?.[i]);
  scan('w', h, (i) => rows[i]?.[0]);
  scan('e', h, (i) => rows[i]?.[w - 1]);
  return out;
}

/** Build a piece from a stamp written as a template string (blank lines and indent ignored). */
export function piece(
  id: string,
  tileset: string,
  tags: PieceTag[],
  weight: number,
  stamp: string,
): Piece {
  const rows = stamp
    .split('\n')
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
  return {
    id,
    tileset,
    size: [rows[0]?.length ?? 0, rows.length],
    sockets: socketsOf(rows),
    tags,
    weight,
    rows,
  };
}

/** The stamp turned a quarter clockwise `turns` times. */
export function rotateRows(rows: readonly string[], turns: number): string[] {
  let out = [...rows];
  for (let t = 0; t < ((turns % 4) + 4) % 4; t++) {
    const h = out.length;
    const w = out[0]!.length;
    const next: string[] = [];
    for (let x = 0; x < w; x++) {
      let row = '';
      for (let y = h - 1; y >= 0; y--) row += out[y]![x]!;
      next.push(row);
    }
    out = next;
  }
  return out;
}

/** What is wrong with a piece, or [] (content tests and the assembler's own checks). */
export function pieceProblems(p: Piece, maxSize: number): string[] {
  const out: string[] = [];
  const [w, h] = p.size;
  if (w < 3 || h < 3 || w > maxSize || h > maxSize) out.push(`size ${w}x${h}`);
  p.rows.forEach((r, y) => {
    if (r.length !== w) out.push(`row ${y} is ${r.length} wide`);
    for (const ch of r) if (!PIECE_CHARS.includes(ch)) out.push(`bad char '${ch}' in row ${y}`);
  });
  for (let y = 1; y < h - 1; y++) {
    const r = p.rows[y]!;
    if (r.slice(1, -1).includes('D')) out.push(`socket inside the piece on row ${y}`);
  }
  if (p.sockets.length === 0) out.push('no sockets');
  for (const s of p.sockets) if (s.width < 2 || s.width > 3) out.push(`socket width ${s.width}`);
  // Every open cell reaches every other one.
  const open = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < w && y < h && p.rows[y]![x] !== '#';
  let first: [number, number] | null = null;
  let total = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (open(x, y)) {
        total++;
        first ??= [x, y];
      }
  if (first) {
    const seen = new Set<number>([first[1] * w + first[0]]);
    const stack = [first];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (!open(nx, ny) || seen.has(ny * w + nx)) continue;
        seen.add(ny * w + nx);
        stack.push([nx, ny]);
      }
    }
    if (seen.size !== total) out.push(`${total - seen.size} open cells cut off`);
  }
  // The middle cell is open: the landmark and the stairs look for it.
  if (!open(Math.floor(w / 2), Math.floor(h / 2))) out.push('closed centre');
  return out;
}
