/**
 * R0130 (WORLD-64): the World overview. Every place in the region graph is a painted blob in
 * its own palette colour with its landmark icon and name, joined to its neighbours by the
 * graph's exits; places not found yet show as fog with a "?". Tapping a found place opens its
 * map. Built from `REGIONS` (the graph) and `OVERVIEW_NODES` (the layout), reading the world only.
 */
import { REGIONS, type RegionId } from '../config/regions';
import { WORLD_TEXT } from '../config/strings-world';
import { OVERVIEW_TEXT } from '../config/strings-r11d6';
import { OVERVIEW_NODES } from '../config/tuning-r11d6';
import { regionOf, regionsFound } from '../sim/regions';
import type { World } from '../sim/types';
import { el } from './dom';

type Id = keyof typeof OVERVIEW_NODES;
const NS = 'http://www.w3.org/2000/svg';

/** The graph's links, each pair once, among the places on the sheet. */
export function overviewLinks(): Array<[Id, Id]> {
  const seen = new Set<string>();
  const out: Array<[Id, Id]> = [];
  for (const id of Object.keys(OVERVIEW_NODES) as Id[]) {
    for (const x of REGIONS[id].exits) {
      const to = x.to as Id;
      if (!(to in OVERVIEW_NODES)) continue;
      const key = [id, to].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([id, to]);
    }
  }
  return out;
}

function svg(tag: string, attrs: Record<string, string>): SVGElement {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}

export function worldOverview(
  world: World,
  onPick: (id: RegionId) => void,
  onFogged: () => void,
): HTMLElement {
  const root = el('div', 'wm-overview');
  root.append(el('h3', undefined, OVERVIEW_TEXT.title), el('p', 'help', OVERVIEW_TEXT.help));
  const found = new Set<RegionId>(regionsFound(world));
  const here = regionOf(world.location);
  const sheet = svg('svg', { viewBox: '0 0 100 100', class: 'wm-overview-sheet', role: 'group' });
  sheet.setAttribute('aria-label', OVERVIEW_TEXT.title);
  sheet.setAttribute('style', 'width:100%;max-width:520px;display:block;margin:0 auto');
  for (const [a, b] of overviewLinks()) {
    const p = OVERVIEW_NODES[a];
    const q = OVERVIEW_NODES[b];
    const both = found.has(a) && found.has(b);
    sheet.appendChild(
      svg('line', {
        x1: String(p.x),
        y1: String(p.y),
        x2: String(q.x),
        y2: String(q.y),
        stroke: '#a06a3b',
        'stroke-width': '1.4',
        'stroke-linecap': 'round',
        'stroke-dasharray': both ? 'none' : '1.5 2',
        opacity: both ? '1' : '0.5',
      }),
    );
  }
  for (const id of Object.keys(OVERVIEW_NODES) as Id[]) {
    const n = OVERVIEW_NODES[id];
    const known = found.has(id);
    const g = svg('g', { tabindex: '0', role: 'button', 'data-region': id });
    g.setAttribute(
      'aria-label',
      known ? OVERVIEW_TEXT.open(WORLD_TEXT.regions[id]) : OVERVIEW_TEXT.fogged,
    );
    g.setAttribute('style', 'cursor:pointer');
    g.appendChild(
      svg('ellipse', {
        cx: String(n.x),
        cy: String(n.y),
        rx: '9',
        ry: '7',
        fill: known ? n.fill : '#cdb1f0',
        opacity: known ? '1' : '0.45',
        stroke: id === here ? '#e0562e' : '#2b2440',
        'stroke-width': id === here ? '1.6' : '0.6',
      }),
    );
    const icon = svg('text', {
      x: String(n.x),
      y: String(n.y + 2),
      'text-anchor': 'middle',
      'font-size': '6',
    });
    icon.textContent = known ? n.icon : '?';
    g.appendChild(icon);
    const label = svg('text', {
      x: String(n.x),
      y: String(n.y + 12),
      'text-anchor': 'middle',
      'font-size': '3.4',
      fill: 'currentColor',
    });
    label.textContent = known ? WORLD_TEXT.regions[id] : OVERVIEW_TEXT.fogged;
    g.appendChild(label);
    if (id === here) {
      const you = svg('text', {
        x: String(n.x),
        y: String(n.y - 8.5),
        'text-anchor': 'middle',
        'font-size': '3.2',
        fill: 'currentColor',
      });
      you.textContent = `▼ ${OVERVIEW_TEXT.here}`;
      g.appendChild(you);
    }
    const act = () => (known ? onPick(id) : onFogged());
    g.addEventListener('click', act);
    g.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        act();
      }
    });
    sheet.appendChild(g);
  }
  root.appendChild(sheet);
  return root;
}
