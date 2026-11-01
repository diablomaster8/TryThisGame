/**
 * Sector streaming for an act's field in Full 3D (lane B r10, R0147, DUNG-07): the field is
 * cut into square sectors of `FIELD_R10.sector` cells, and a big mesh's triangles are
 * written sector by sector, column-major (all of sector column 0 top to bottom, then
 * column 1, ...). The 3×3 sectors round the Keeper's then lie in one run of the index
 * buffer whenever the field is at most three sectors tall (the 128×96 field is 4×3), so
 * showing only them is a draw-range change: no rebuild, no upload, no new draw calls. On a
 * taller field the run also holds the sector rows above and below the window in those
 * columns, which is never less than the window.
 *
 * Pure and Three-free, so the tests can reach it.
 */

export interface SectorWindow {
  sx0: number;
  sx1: number;
  sy0: number;
  sy1: number;
}

/** The sectors (inclusive) within one of cell (cx, cy)'s sector, clamped to the field. */
export function sectorWindow(
  cols: number,
  rows: number,
  size: number,
  cx: number,
  cy: number,
): SectorWindow {
  const nx = Math.ceil(cols / size);
  const ny = Math.ceil(rows / size);
  const sx = Math.min(nx - 1, Math.max(0, Math.floor(cx / size)));
  const sy = Math.min(ny - 1, Math.max(0, Math.floor(cy / size)));
  return {
    sx0: Math.max(0, sx - 1),
    sx1: Math.min(nx - 1, sx + 1),
    sy0: Math.max(0, sy - 1),
    sy1: Math.min(ny - 1, sy + 1),
  };
}

/**
 * Collects a mesh's triangle indices into per-sector buckets as they are made, then lays
 * them out column-major and answers the index range for a Keeper's cell.
 */
export class SectorIndex {
  readonly nx: number;
  readonly ny: number;
  private readonly buckets: number[][];
  /** Where each sector's indices start in the laid-out buffer (one past the end last). */
  private start: Int32Array = new Int32Array(0);

  constructor(
    private readonly cols: number,
    private readonly rows: number,
    readonly size: number,
  ) {
    this.nx = Math.ceil(cols / size);
    this.ny = Math.ceil(rows / size);
    this.buckets = Array.from({ length: this.nx * this.ny }, () => []);
  }

  /** The bucket for cell (cx, cy): push its triangles' indices here. */
  at(cx: number, cy: number): number[] {
    const sx = Math.min(this.nx - 1, Math.max(0, Math.floor(cx / this.size)));
    const sy = Math.min(this.ny - 1, Math.max(0, Math.floor(cy / this.size)));
    return this.buckets[sx * this.ny + sy]!;
  }

  /** The whole index buffer, column-major by sector. */
  finish(): number[] {
    const out: number[] = [];
    this.start = new Int32Array(this.buckets.length + 1);
    this.buckets.forEach((b, i) => {
      this.start[i] = out.length;
      for (const v of b) out.push(v);
    });
    this.start[this.buckets.length] = out.length;
    return out;
  }

  /** Into `out`: the index range [start, count) that draws the window round cell (cx, cy). */
  range(cx: number, cy: number, out: { start: number; count: number }): void {
    const w = sectorWindow(this.cols, this.rows, this.size, cx, cy);
    const a = this.start[w.sx0 * this.ny + w.sy0] ?? 0;
    const b = this.start[w.sx1 * this.ny + w.sy1 + 1] ?? 0;
    out.start = a;
    out.count = b - a;
  }

  /** The sector key of cell (cx, cy), to tell when the Keeper has crossed into another. */
  key(cx: number, cy: number): number {
    const sx = Math.min(this.nx - 1, Math.max(0, Math.floor(cx / this.size)));
    const sy = Math.min(this.ny - 1, Math.max(0, Math.floor(cy / this.size)));
    return sx * this.ny + sy;
  }
}
