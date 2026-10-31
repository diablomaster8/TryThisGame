/**
 * The loot rarities' shapes (R0163, DUNG-23) drawn as paths, shared by the Pixel and Full 3D
 * gear pops: ● plain, ◆ shiny, ⬟ fancy, ★ legendary, ✿ set, ⬢ charm. They were font glyphs,
 * which depend on the fonts a device has and blur together at pop size (⬟ beside ⬢); as
 * paths each tier keeps its own silhouette on every device, and a colour-blind player tells
 * them apart by shape alone. The set's flower and the charm's hexagon carry a hole, so the
 * two many-sided shapes differ in more than their corners.
 */

/** Points of a regular polygon (or a star when `inner` is given), first point straight up. */
function poly(
  cx: number,
  cy: number,
  r: number,
  n: number,
  inner?: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  const k = inner === undefined ? n : n * 2;
  for (let i = 0; i < k; i++) {
    const rr = inner !== undefined && i % 2 === 1 ? inner : r;
    const t = -Math.PI / 2 + (i * Math.PI * 2) / k;
    pts.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]);
  }
  return pts;
}

function path(g: CanvasRenderingContext2D, pts: Array<[number, number]>): void {
  g.moveTo(pts[0]![0], pts[0]![1]);
  for (const [x, y] of pts.slice(1)) g.lineTo(x, y);
  g.closePath();
}

/**
 * Fill rarity `id`'s shape centred on (cx, cy) with radius `r` in `fill`, with a dark
 * outline; an unknown id draws as plain. Holes wind the other way (non-zero rule).
 */
export function drawRarityShape(
  g: CanvasRenderingContext2D,
  id: string,
  cx: number,
  cy: number,
  r: number,
  fill: string,
): void {
  g.beginPath();
  switch (id) {
    case 'shiny':
      path(g, [
        [cx, cy - r],
        [cx + r * 0.72, cy],
        [cx, cy + r],
        [cx - r * 0.72, cy],
      ]);
      break;
    case 'fancy':
      path(g, poly(cx, cy + r * 0.06, r * 0.95, 5));
      break;
    case 'legendary':
      path(g, poly(cx, cy + r * 0.08, r * 1.05, 5, r * 0.45));
      break;
    case 'set':
      // Five round petals about a hollow centre.
      for (let i = 0; i < 5; i++) {
        const t = -Math.PI / 2 + (i * Math.PI * 2) / 5;
        const px = cx + Math.cos(t) * r * 0.55;
        const py = cy + Math.sin(t) * r * 0.55;
        g.moveTo(px + r * 0.42, py);
        g.arc(px, py, r * 0.42, 0, Math.PI * 2);
      }
      g.moveTo(cx + r * 0.22, cy);
      g.arc(cx, cy, r * 0.22, 0, Math.PI * 2, true);
      break;
    case 'charm': {
      // A hexagon on its side with a hexagonal hole: a nut, never a fancy's pentagon.
      const t = (i: number) => (i * Math.PI) / 3;
      path(
        g,
        [0, 1, 2, 3, 4, 5].map((i) => [cx + Math.cos(t(i)) * r, cy + Math.sin(t(i)) * r * 0.9]),
      );
      path(
        g,
        [0, 5, 4, 3, 2, 1].map((i) => [
          cx + Math.cos(t(i)) * r * 0.42,
          cy + Math.sin(t(i)) * r * 0.38,
        ]),
      );
      break;
    }
    default:
      g.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
  }
  g.fillStyle = fill;
  g.fill();
  g.lineWidth = Math.max(1, r * 0.12);
  g.strokeStyle = 'rgba(20, 16, 36, 0.9)';
  g.stroke();
}
