import { piece, type Piece } from './piece';

/**
 * The pure half of the debug panel's piece editor (R0210, DUNG-65): paint a stamp cell by
 * cell, rebuild the piece (sockets are re-read from the `D` runs), and export it as JSON in
 * the shape `src/sim/dungeon-pieces/*.ts` holds. The panel itself is `ui/debug-pieces.ts`.
 */

/** The stamp with one cell changed (out-of-range cells leave it as it was). */
export function paintCell(rows: readonly string[], x: number, y: number, ch: string): string[] {
  const out = [...rows];
  const row = out[y];
  if (row === undefined || x < 0 || x >= row.length || ch.length !== 1) return out;
  out[y] = row.slice(0, x) + ch + row.slice(x + 1);
  return out;
}

/** A piece from edited rows, keeping the source piece's tileset, tags and weight. */
export function editedPiece(base: Piece, rows: readonly string[], id = base.id): Piece {
  return piece(id, base.tileset, [...base.tags], base.weight, rows.join('\n'));
}

/** A blank hub to start from: walls round open floor, a two-wide door in each side. */
export function blankPiece(w: number, h: number, tileset = 'rootways'): Piece {
  const mid = (n: number) => Math.floor(n / 2) - 1;
  const rows: string[] = [];
  for (let y = 0; y < h; y++) {
    let r = '';
    for (let x = 0; x < w; x++) {
      const edgeY = y === 0 || y === h - 1;
      const edgeX = x === 0 || x === w - 1;
      const doorX = (x === mid(w) || x === mid(w) + 1) && edgeY && !edgeX;
      const doorY = (y === mid(h) || y === mid(h) + 1) && edgeX && !edgeY;
      r += doorX || doorY ? 'D' : edgeX || edgeY ? '#' : '.';
    }
    rows.push(r);
  }
  return piece(`dev-blank-${w}x${h}`, tileset, ['hub'], 1, rows.join('\n'));
}

/** The piece as JSON, ready to paste into a tileset file or a bug report. */
export function pieceJson(p: Piece): string {
  const { id, tileset, size, sockets, tags, weight, rows } = p;
  return JSON.stringify({ id, tileset, size, sockets, tags, weight, rows }, null, 2);
}
