/**
 * Lane E r9 (R0737 KIDS-69): Ori and Hana's next visit as a picture of the time. Between two
 * language quests the postcard's course card shows a little sun-and-moon clock with its hand
 * on the sun ("comes back in the morning" or "very soon"), and a sprout hears the line. The
 * grown-up area gets "Skip to Grove morning", which lets the next visit come now: Grove time,
 * not a daily chore. UI only: reads `world`, sends commands.
 */
import { KIDS_READ_TEXT } from '../config/strings-look-r9e';
import type { Game } from '../game';
import { langNextVisit, type LangWait } from '../sim/lang-wait';
import type { LangCourseId } from '../sim/types';
import { button, el } from './dom';
import { speakLine } from './lesson';

const NS = 'http://www.w3.org/2000/svg';

/**
 * The clock: a day-and-night dial (sun at the top, moon at the bottom) with the hand on the
 * sun. "Soon" draws the hand already there; "morning" draws it on the night side, heading up.
 */
function clock(wait: LangWait): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 56 56');
  svg.setAttribute('class', 'lang-wait-clock');
  svg.setAttribute('aria-hidden', 'true');
  const add = (tag: string, attrs: Record<string, string>) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.appendChild(n);
    return n;
  };
  // Day half on top, night half below.
  add('path', { d: 'M4 28 A24 24 0 0 1 52 28 Z', fill: '#ffe9a8' });
  add('path', { d: 'M4 28 A24 24 0 0 0 52 28 Z', fill: '#3a4a7a' });
  add('circle', {
    cx: '28',
    cy: '28',
    r: '24',
    fill: 'none',
    stroke: '#2b2b2b',
    'stroke-width': '2',
  });
  // The sun, with rays.
  add('circle', { cx: '28', cy: '13', r: '5', fill: '#f2b632' });
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    add('line', {
      x1: String(28 + Math.cos(a) * 7),
      y1: String(13 + Math.sin(a) * 7),
      x2: String(28 + Math.cos(a) * 9),
      y2: String(13 + Math.sin(a) * 9),
      stroke: '#f2b632',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
    });
  }
  // The moon: a crescent cut by a circle in the night colour.
  add('circle', { cx: '28', cy: '43', r: '5', fill: '#f4f1d0' });
  add('circle', { cx: '30.5', cy: '41.5', r: '4.2', fill: '#3a4a7a' });
  // The hand: on the sun when the visit is near, on the night side (heading up) before.
  const angle = wait === 'soon' ? -90 : 160;
  const r = (angle * Math.PI) / 180;
  add('line', {
    x1: '28',
    y1: '28',
    x2: String(28 + Math.cos(r) * 15),
    y2: String(28 + Math.sin(r) * 15),
    stroke: '#c0392b',
    'stroke-width': '3',
    'stroke-linecap': 'round',
  });
  add('circle', { cx: '28', cy: '28', r: '2.5', fill: '#c0392b' });
  return svg;
}

/** The wait line for a friend, or null when nothing waits. */
export function langWaitLine(
  g: Game,
  course: LangCourseId,
  quests: readonly string[],
  friend: string,
): string | null {
  const wait = langNextVisit(g.world, course, quests);
  if (!wait) return null;
  return wait === 'soon' ? KIDS_READ_TEXT.backSoon(friend) : KIDS_READ_TEXT.backMorning(friend);
}

/** The course card's clock row, or null when nothing waits. */
export function langWaitCard(
  g: Game,
  course: LangCourseId,
  quests: readonly string[],
  friend: string,
): HTMLElement | null {
  const wait = langNextVisit(g.world, course, quests);
  if (!wait) return null;
  const line = langWaitLine(g, course, quests, friend)!;
  const row = el('div', 'lang-wait');
  row.setAttribute('role', 'img');
  row.setAttribute('aria-label', line);
  row.append(clock(wait), el('strong', undefined, `${wait === 'soon' ? '⏰' : '☀️'} ${line}`));
  return row;
}

/** Say the wait aloud for a sprout with read-aloud on. */
export function sayLangWait(g: Game, lines: readonly string[]): void {
  const e = g.world.edu;
  if (lines.length === 0 || e?.band !== 'sprout' || !e.readAloud) return;
  speakLine(lines.join('. '));
}

/** The grown-up area's "Skip to Grove morning" (shown only while a visit waits). */
export function langSkipRow(
  g: Game,
  waiting: boolean,
  toast?: (t: string) => void,
): HTMLElement | null {
  if (!waiting) return null;
  const row = el('div', 'lang-skip');
  row.append(
    button(
      `☀️ ${KIDS_READ_TEXT.skipMorning}`,
      () => {
        g.send({ kind: 'langSkipWait' });
        toast?.(KIDS_READ_TEXT.skipMorningDone);
        row.replaceChildren(el('p', 'help', KIDS_READ_TEXT.skipMorningDone));
      },
      'btn',
    ),
    el('p', 'help', KIDS_READ_TEXT.skipMorningHelp),
  );
  return row;
}
