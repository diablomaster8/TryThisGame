import { describe, expect, it } from 'vitest';
import { DUNGEON } from '../../src/config/tuning';
import { floorOf, type Floor } from '../../src/sim/dungeon';
import { shelfRise } from '../../src/sim/dungeon-shelves';
import { ledgeGeometry, ledgeLift } from '../../src/render/hollow-ledges';
import { drawRaised, raisedKinds, type Ctx2D } from '../../src/ui/hollow-map';

// R0031 (lane A r14): terrace ledges in the Pixel view and on the corner map.

function ledgeFloor(): Floor {
  for (let s = 0; s < 200; s++) {
    const f = floorOf(9100 + s * 104_729, 3, 4);
    if ((f.shelves ?? []).some((x) => x.ledge)) return f;
  }
  throw new Error('no ledge floor in 200 seeds');
}

const world = (f: Floor, c: { x: number; y: number }) => ({
  x: (c.x + 0.5 - f.cols / 2) * DUNGEON.cell,
  z: (c.y + 0.5 - f.rows / 2) * DUNGEON.cell,
});

describe('Hollow ledges, Pixel geometry', () => {
  it('lifts the Keeper by half a unit on a ledge and not at all beside it', () => {
    const f = ledgeFloor();
    const led = f.shelves!.find((x) => x.ledge)!;
    const c = led.cells[0]!;
    const p = world(f, c);
    expect(ledgeLift(f, p.x, p.z)).toBeCloseTo(0.5, 5);
    expect(ledgeLift(f, p.x, p.z)).toBe(shelfRise(f, c));
    expect(ledgeLift(null, 0, 0)).toBe(0);
    // Stairs up are never raised.
    const s = world(f, f.stairsUp);
    expect(ledgeLift(f, s.x, s.z)).toBe(0);
  });

  it('builds a top quad per raised cell and front faces only on the open sides', () => {
    const f = ledgeFloor();
    const cells = f.shelves!.reduce((n, s) => n + s.cells.length, 0);
    const g = ledgeGeometry(f);
    expect(g.count).toBe(cells);
    expect(g.top.getAttribute('position').count).toBe(cells * 6);
    const faces = g.sides.getAttribute('position').count / 6;
    expect(faces).toBeGreaterThan(0);
    // A solid block of w x h has at most 2(w+h) faces: fewer than four per cell.
    expect(faces).toBeLessThan(cells * 4);
    // Every vertex of a ledge top sits at 0.5 u (or a shelf's own rise).
    const pos = g.top.getAttribute('position');
    for (let i = 0; i < pos.count; i++) expect(pos.getY(i)).toBeGreaterThan(0.4);
  });

  it('gives a floor with no raised block no geometry', () => {
    const f = floorOf(77, 1, 4);
    expect(ledgeGeometry({ ...f, shelves: [] }).count).toBe(0);
  });
});

describe('Hollow ledges, corner map', () => {
  it('lists ledges and shelves for the legend', () => {
    const f = ledgeFloor();
    expect(raisedKinds(f).ledge).toBe(true);
    expect(raisedKinds({ ...f, shelves: [] })).toEqual({ ledge: false, shelf: false });
  });

  it('draws a ledge cell with a thick pale lip and a shelf with a thin pink one', () => {
    const f = ledgeFloor();
    const calls: string[] = [];
    const widths: number[] = [];
    let style = '';
    const g = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      fillRect: () => calls.push('fill'),
      beginPath: () => calls.push('begin'),
      moveTo: () => calls.push('move'),
      lineTo: () => calls.push('line'),
      stroke() {
        calls.push('stroke');
        widths.push(this.lineWidth);
        style = this.strokeStyle as string;
      },
    } as unknown as Ctx2D;
    const led = f.shelves!.find((x) => x.ledge)!;
    drawRaised(g, f, led.cells[0]!.x, led.cells[0]!.y, 6);
    expect(calls).toContain('line');
    expect(widths[0]).toBeGreaterThanOrEqual(2);
    expect(style).toBe('#ffe9a8');
    // Off every block, nothing is drawn.
    calls.length = 0;
    const open = { x: f.stairsUp.x, y: f.stairsUp.y };
    drawRaised(g, f, open.x, open.y, 6);
    expect(calls).toEqual([]);
    // A shelf cell (made by hand) gets the thin pink lip.
    const sf = { ...f, shelves: [{ cells: [{ x: 5, y: 5 }], find: 'x' }] } as Floor;
    drawRaised(g, sf, 5, 5, 6);
    expect(style).toBe('#ff9ac8');
    expect(widths[widths.length - 1]).toBeLessThan(2);
  });
});
