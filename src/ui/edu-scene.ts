import { GROVE_SHAPES, GROVE_VIEW, type GroveProp } from '../config/edu-grove-shapes';

const NS = 'http://www.w3.org/2000/svg';

function node(tag: string, attrs: Record<string, string | number>): SVGElement {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

function propShape(p: GroveProp): SVGElement {
  const stroke = { stroke: '#1b1326', 'stroke-width': 1.4 };
  switch (p.shape) {
    case 'circle':
      return node('ellipse', {
        cx: p.x + p.w / 2,
        cy: p.y + p.h / 2,
        rx: p.w / 2,
        ry: p.h / 2,
        fill: p.colour,
        ...stroke,
      });
    case 'triangle':
      return node('polygon', {
        points: `${p.x + p.w / 2},${p.y} ${p.x + p.w},${p.y + p.h} ${p.x},${p.y + p.h}`,
        fill: p.colour,
        ...stroke,
      });
    default:
      return node('rect', { x: p.x, y: p.y, width: p.w, height: p.h, fill: p.colour, ...stroke });
  }
}

/**
 * R0733: the Grove still for the shape hunt: sky, hills, a cottage wall and every prop of
 * `GROVE_SHAPES` drawn as its plain shape. Pure drawing, so it never touches the renderer or
 * the world.
 */
export function groveStill(): SVGSVGElement {
  const svg = node('svg', {
    viewBox: `0 0 ${GROVE_VIEW.w} ${GROVE_VIEW.h}`,
    class: 'edu-grove-still',
    'aria-hidden': 'true',
  }) as SVGSVGElement;
  svg.append(
    node('rect', { x: 0, y: 0, width: GROVE_VIEW.w, height: GROVE_VIEW.h, fill: '#bfe3f5' }),
    node('ellipse', { cx: 40, cy: 70, rx: 90, ry: 30, fill: '#6fbf5a' }),
    node('ellipse', { cx: 160, cy: 66, rx: 80, ry: 26, fill: '#5aa84c' }),
    node('rect', { x: 0, y: 70, width: GROVE_VIEW.w, height: 50, fill: '#7ccb62' }),
    node('rect', {
      x: 92,
      y: 54,
      width: 52,
      height: 42,
      fill: '#f1e2c4',
      stroke: '#1b1326',
      'stroke-width': 1.4,
    }),
  );
  for (const p of GROVE_SHAPES) svg.appendChild(propShape(p));
  return svg;
}
