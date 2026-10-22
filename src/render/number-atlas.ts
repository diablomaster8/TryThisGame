import { CG_C } from '../config/tuning-c';

/**
 * One atlas of painted numbers (campaign graphics H15), shared by both renderers: the
 * pixel view takes it as a sprite sheet, the 3D view as one texture with a UV offset per
 * instance. Numbers 1..`count` sit in a grid of cells, each a chalky number on a pale
 * grey patch, drawn from a 3x5 bitmap font so the digits stay crisp at any size and the
 * look does not depend on an installed font.
 */
const DIGITS: Record<string, readonly string[]> = {
  '0': ['111', '101', '101', '101', '111'],
  '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'],
  '3': ['111', '001', '111', '001', '111'],
  '4': ['101', '101', '111', '001', '001'],
  '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'],
  '7': ['111', '001', '010', '010', '010'],
  '8': ['111', '101', '111', '101', '111'],
  '9': ['111', '101', '111', '001', '111'],
};

export const NUMBER_CELL = { w: 24, h: 16, columns: 8 } as const;

/** Where number `n` sits in the atlas: the grid column and row (row 0 at the top). */
export function numberCell(n: number): { col: number; row: number } {
  const i = Math.max(0, Math.min(CG_C.corvin.numbers.count - 1, n - CG_C.corvin.numbers.first));
  return { col: i % NUMBER_CELL.columns, row: Math.floor(i / NUMBER_CELL.columns) };
}

/** The atlas's pixel size. */
export function numberAtlasSize(): { width: number; height: number } {
  const rows = Math.ceil(CG_C.corvin.numbers.count / NUMBER_CELL.columns);
  return { width: NUMBER_CELL.columns * NUMBER_CELL.w, height: rows * NUMBER_CELL.h };
}

/** Paint the atlas on a canvas (null where there is no 2D canvas, as in tests). */
export function paintNumberAtlas(): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const { width, height } = numberAtlasSize();
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  const g = cv.getContext('2d');
  if (!g) return null;
  const { first, count } = CG_C.corvin.numbers;
  for (let i = 0; i < count; i++) {
    const n = first + i;
    const x0 = (i % NUMBER_CELL.columns) * NUMBER_CELL.w;
    const y0 = Math.floor(i / NUMBER_CELL.columns) * NUMBER_CELL.h;
    // A pale patch with a darker rim: the paint a number sits on.
    g.fillStyle = '#8f93a3';
    g.fillRect(x0 + 1, y0 + 1, NUMBER_CELL.w - 2, NUMBER_CELL.h - 2);
    g.fillStyle = '#c9ccd8';
    g.fillRect(x0 + 2, y0 + 2, NUMBER_CELL.w - 4, NUMBER_CELL.h - 4);
    const s = String(n);
    const gw = 3;
    const unit = 2;
    const total = s.length * gw * unit + (s.length - 1) * unit;
    let x = x0 + Math.round((NUMBER_CELL.w - total) / 2);
    const y = y0 + Math.round((NUMBER_CELL.h - 5 * unit) / 2);
    g.fillStyle = '#2a2c3a';
    for (const ch of s) {
      const rows = DIGITS[ch];
      if (rows)
        rows.forEach((row, ry) =>
          [...row].forEach((bit, rx) => {
            if (bit === '1') g.fillRect(x + rx * unit, y + ry * unit, unit, unit);
          }),
        );
      x += (gw + 1) * unit;
    }
  }
  return cv;
}
