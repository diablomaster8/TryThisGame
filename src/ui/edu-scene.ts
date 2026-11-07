import { EDU_COLOUR_HEX } from '../config/edu';
import { GROVE_SHAPES, GROVE_VIEW, type GroveProp } from '../config/edu-grove-shapes';
import { C, color } from '../render/sprites/palette';

const NS = 'http://www.w3.org/2000/svg';
const INK = color(C.ink);

function node(tag: string, attrs: Record<string, string | number>): SVGElement {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

const line = (x1: number, y1: number, x2: number, y2: number, w = 1): SVGElement =>
  node('line', { x1, y1, x2, y2, stroke: INK, 'stroke-width': w, 'stroke-linecap': 'round' });

/** A prop's outline (the shape being hunted) plus the little details that make it the thing. */
function propShape(p: GroveProp, fill: string): SVGElement {
  const g = node('g', { 'data-prop': p.id });
  const stroke = { stroke: INK, 'stroke-width': 1.4 };
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  switch (p.shape) {
    case 'circle':
      if (p.id === 'pond') {
        // The pond: a sandy shore round a round pool with two ripples.
        g.append(
          node('ellipse', {
            cx,
            cy,
            rx: p.w / 2 + 3,
            ry: p.h / 2 + 3,
            fill: color(C.sand),
            stroke: INK,
            'stroke-width': 1,
          }),
          node('ellipse', { cx, cy, rx: p.w / 2, ry: p.h / 2, fill, ...stroke }),
          node('ellipse', {
            cx: cx - 4,
            cy: cy - 1,
            rx: 7,
            ry: 3,
            fill: 'none',
            stroke: color(C.white),
            'stroke-width': 1,
          }),
          node('ellipse', {
            cx: cx + 6,
            cy: cy + 4,
            rx: 4,
            ry: 1.8,
            fill: 'none',
            stroke: color(C.white),
            'stroke-width': 1,
          }),
        );
      } else {
        // The sun: a round face with short rays.
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          g.appendChild(
            line(
              cx + Math.cos(a) * (p.w / 2 + 1.5),
              cy + Math.sin(a) * (p.h / 2 + 1.5),
              cx + Math.cos(a) * (p.w / 2 + 4.5),
              cy + Math.sin(a) * (p.h / 2 + 4.5),
              1.6,
            ),
          );
        }
        g.appendChild(node('ellipse', { cx, cy, rx: p.w / 2, ry: p.h / 2, fill, ...stroke }));
      }
      break;
    case 'triangle':
      g.appendChild(
        node('polygon', {
          points: `${cx},${p.y} ${p.x + p.w},${p.y + p.h} ${p.x},${p.y + p.h}`,
          fill,
          ...stroke,
          'stroke-linejoin': 'round',
        }),
      );
      // The tent has a door slit; the roof has a chimney behind it.
      if (p.id === 'tent') g.appendChild(line(cx, p.y + p.h * 0.45, cx, p.y + p.h, 1.2));
      else
        g.insertBefore(
          node('rect', {
            x: p.x + p.w * 0.7,
            y: p.y - 4,
            width: 6,
            height: 12,
            fill: color(C.greyDeep),
            ...stroke,
          }),
          g.firstChild,
        );
      break;
    default:
      g.appendChild(node('rect', { x: p.x, y: p.y, width: p.w, height: p.h, fill, ...stroke }));
      if (p.id === 'window') {
        // A square window with four panes.
        g.append(line(cx, p.y, cx, p.y + p.h), line(p.x, cy, p.x + p.w, cy));
      } else if (p.id === 'crate') {
        g.append(line(p.x, p.y, p.x + p.w, p.y + p.h, 1), line(p.x + p.w, p.y, p.x, p.y + p.h, 1));
      } else if (p.id === 'door') {
        g.appendChild(node('circle', { cx: p.x + p.w - 3, cy, r: 1.3, fill: color(C.sunYellow) }));
      } else if (p.id === 'sign') {
        // The signpost: a post under the board.
        g.insertBefore(
          node('rect', {
            x: cx - 1.5,
            y: p.y + p.h,
            width: 3,
            height: 14,
            fill: color(C.darkBark),
          }),
          g.firstChild,
        );
      }
  }
  return g;
}

export interface GroveStillOpts {
  /** Colour name (an `EDU_COLOUR_HEX` key) per prop id; props not named keep their own. */
  colours?: Record<string, string>;
  /** A shape whose props are left out unless they are in `keep`: they would be fair answers too. */
  without?: { shape: string; keep: readonly string[] } | undefined;
}

/**
 * R0733: the Grove still for the shape hunt, drawn from the shared palette: sky, hills, a
 * path, the cottage wall and every prop of `GROVE_SHAPES` as its plain shape. The still is
 * a fallback-safe drawing: it never touches the renderer or the world. (A snapshot of the
 * live Grove was judged not feasible; see edu-things-hunt.test.ts.)
 */
export function groveStill(opts: GroveStillOpts = {}): SVGSVGElement {
  const svg = node('svg', {
    viewBox: `0 0 ${GROVE_VIEW.w} ${GROVE_VIEW.h}`,
    class: 'edu-grove-still',
    'aria-hidden': 'true',
  }) as SVGSVGElement;
  svg.append(
    node('rect', {
      x: 0,
      y: 0,
      width: GROVE_VIEW.w,
      height: GROVE_VIEW.h,
      fill: color(C.skyLight),
    }),
    node('ellipse', { cx: 40, cy: 70, rx: 90, ry: 30, fill: color(C.leaf) }),
    node('ellipse', { cx: 160, cy: 66, rx: 80, ry: 26, fill: color(C.grass) }),
    node('rect', { x: 0, y: 70, width: GROVE_VIEW.w, height: 50, fill: color(C.sprout) }),
    node('path', {
      d: 'M118 96 C110 104 80 108 70 120 L100 120 C108 112 130 106 134 96 Z',
      fill: color(C.sand),
    }),
    node('rect', {
      x: 92,
      y: 54,
      width: 52,
      height: 42,
      fill: color(C.cream),
      stroke: INK,
      'stroke-width': 1.4,
    }),
  );
  for (const p of GROVE_SHAPES) {
    const w = opts.without;
    if (w && p.shape === w.shape && !w.keep.includes(p.id)) continue;
    const name = opts.colours?.[p.id];
    svg.appendChild(propShape(p, (name && EDU_COLOUR_HEX[name]) || p.colour));
  }
  return svg;
}
