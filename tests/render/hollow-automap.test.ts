import { describe, expect, it } from 'vitest';
import { HOLLOW_AUTOMAP_TEXT } from '../../src/config/strings';
import { FLOOR, WALL, type Floor } from '../../src/sim/dungeon';
import {
  drawOverlay,
  MARKS,
  overlayScale,
  wallEdges,
  type Ctx2D,
  type Mark,
  type MarkKind,
} from '../../src/ui/hollow-map';

/** The automap (R0154): markers, the wall outline, and the redraw budget. */

/** A 2D context that only counts calls, so the timing is the map's own work. */
function fakeCtx(): Ctx2D & { calls: number } {
  let calls = 0;
  const op = () => void calls++;
  return {
    get calls() {
      return calls;
    },
    setTransform: op,
    clearRect: op,
    beginPath: op,
    moveTo: op,
    lineTo: op,
    closePath: op,
    stroke: op,
    fill: op,
    arc: op,
    fillRect: op,
    strokeRect: op,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineJoin: 'miter',
    globalAlpha: 1,
  } as Ctx2D & { calls: number };
}

/** A synthetic floor: open ground with a lattice of rock pillars, so it has many edges. */
function floor(cols: number, rows: number): Floor {
  const cells = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const border = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
      const pillar = x % 3 === 0 && y % 3 === 0;
      cells[y * cols + x] = border || pillar ? WALL : FLOOR;
    }
  return { cols, rows, cells } as unknown as Floor;
}

describe('automap markers', () => {
  it('every marker has its own shape, its own icon and a legend line', () => {
    const kinds = Object.keys(MARKS) as MarkKind[];
    expect(kinds).toEqual(
      expect.arrayContaining(['you', 'party', 'up', 'down', 'chest', 'waypoint', 'portal']),
    );
    expect(kinds).toEqual(expect.arrayContaining(['shrine', 'unique', 'quest']));
    expect(new Set(kinds.map((k) => MARKS[k].shape)).size).toBe(kinds.length);
    expect(new Set(kinds.map((k) => MARKS[k].icon)).size).toBe(kinds.length);
    for (const k of kinds) expect(HOLLOW_AUTOMAP_TEXT[k].length).toBeGreaterThan(0);
    expect(HOLLOW_AUTOMAP_TEXT.way.length).toBeGreaterThan(0);
  });
});

describe('the wall outline', () => {
  it('outlines each seen open cell where it meets rock, and nothing unseen', () => {
    // 3 x 3 with one open cell in the middle: four sides.
    const f = floor(3, 3);
    f.cells.fill(WALL);
    f.cells[4] = FLOOR;
    const all = new Uint8Array(9).fill(1);
    expect(Array.from(wallEdges(f, all))).toEqual([1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2]);
    expect(wallEdges(f, new Uint8Array(9)).length).toBe(0);
  });
});

describe('the overlay redraw', () => {
  it('takes under 2 ms on a 96 x 72 floor, fully explored', () => {
    const f = floor(96, 72);
    const mask = new Uint8Array(f.cols * f.rows).fill(1);
    const edges = wallEdges(f, mask);
    expect(edges.length).toBeGreaterThan(4 * 1000);
    const marks: Mark[] = [
      { kind: 'up', x: 4.5, y: 4.5 },
      { kind: 'down', x: 90.5, y: 66.5 },
      { kind: 'chest', x: 50.5, y: 30.5 },
      { kind: 'party', x: 10.2, y: 11.7 },
      { kind: 'party', x: 11.2, y: 10.7 },
      { kind: 'you', x: 10.5, y: 10.5 },
    ];
    const g = fakeCtx();
    const view = { w: 375, h: 812, dpr: 2, scale: overlayScale(f, 375, 812), yaw: 0.7 };
    const run = () =>
      drawOverlay(g, view, edges, marks, { x: 10.5, y: 10.5 }, { x: 90.5, y: 66.5 });
    for (let i = 0; i < 20; i++) run();
    const times: number[] = [];
    for (let i = 0; i < 30; i++) {
      const t0 = performance.now();
      run();
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    expect(times[Math.floor(times.length / 2)]).toBeLessThan(2);
    expect(g.calls).toBeGreaterThan(0);
  });

  it('fits the floor to a phone within the tuned cell size', () => {
    const s = overlayScale(floor(96, 72), 375, 812);
    expect(s).toBeGreaterThanOrEqual(4);
    expect(s).toBeLessThanOrEqual(9);
  });
});
