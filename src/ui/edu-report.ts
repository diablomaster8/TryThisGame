/**
 * Lane E round 10: the grown-up report's pieces. R0717 (KIDS-49) standards in plain words
 * with the code in small print, for the story lessons and for the six games; R0718 (KIDS-50)
 * this week's minutes as a bar chart and a print button; R0745 (KIDS-77) how long each game
 * holds the child's attention. All local; nothing is sent anywhere.
 */
import '../access-r10.css';
import { EDU_ROUND_STANDARDS } from '../config/edu-standards-r10';
import type { EduGameId } from '../config/edu';
import { EDU_TEXT } from '../config/strings';
import { GROWN_UP_TEXT, standardLabel } from '../config/strings-access-r10';
import type { Game } from '../game';
import { gamesForBand } from '../sim/edu';
import { averageSeconds, weekMinutes } from '../sim/edu-report';
import { button, el } from './dom';

/** Rows of standards: the plain label, then the code and a count in small print. */
export function standardsList(body: HTMLElement, title: string, rows: [string, number?][]): void {
  body.appendChild(el('strong', undefined, title));
  const box = el('div', 'shop-list edu-standards');
  for (const [code, n] of rows) {
    const row = el('div', 'shop-row');
    const t = el('div');
    t.append(
      el('strong', undefined, standardLabel(code)),
      el('small', 'edu-standard-code', n === undefined ? code : `${code} · ${n}`),
    );
    row.appendChild(t);
    box.appendChild(row);
  }
  body.appendChild(box);
}

/** R0717: what each of this band's games practises. */
export function gameStandards(body: HTMLElement, g: Game): void {
  const e = g.world.edu;
  if (!e) return;
  body.appendChild(el('h3', undefined, GROWN_UP_TEXT.gameStandardsTitle));
  const list = el('div', 'shop-list edu-standards');
  for (const id of gamesForBand(e.band) as readonly EduGameId[]) {
    const row = el('div', 'shop-row');
    const t = el('div');
    t.append(
      el('strong', undefined, `${EDU_TEXT.gameIcons[id]} ${EDU_TEXT.gameNames[id]}`),
      el('span', undefined, EDU_ROUND_STANDARDS[id].map(standardLabel).join('; ')),
      el('small', 'edu-standard-code', EDU_ROUND_STANDARDS[id].join(' · ')),
    );
    row.appendChild(t);
    list.appendChild(row);
  }
  body.appendChild(list);
}

function weekday(key: string, today: string): string {
  if (key === today) return GROWN_UP_TEXT.today;
  const d = new Date(`${key}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? key.slice(5)
    : d.toLocaleDateString(undefined, { weekday: 'short' });
}

/** R0718: the last seven days' minutes as bars, each with its number (never colour alone). */
export function weekChart(body: HTMLElement, g: Game, wallMs = Date.now()): void {
  const days = weekMinutes(g.world, wallMs);
  body.appendChild(el('h3', undefined, GROWN_UP_TEXT.weekTitle));
  if (days.every((d) => d.minutes === 0)) {
    body.appendChild(el('p', 'help', GROWN_UP_TEXT.weekNone));
    return;
  }
  const max = Math.max(1, ...days.map((d) => d.minutes));
  const today = days[days.length - 1]!.day;
  const chart = el('div', 'edu-week');
  chart.setAttribute('role', 'list');
  for (const d of days) {
    const label = weekday(d.day, today);
    const col = el('div', 'edu-week-col');
    col.setAttribute('role', 'listitem');
    col.setAttribute('aria-label', GROWN_UP_TEXT.weekBar(label, d.minutes));
    const bar = el('div', 'edu-week-bar');
    bar.style.height = `${Math.round((d.minutes / max) * 100)}%`;
    const track = el('div', 'edu-week-track');
    track.appendChild(bar);
    col.append(el('small', 'edu-week-n', String(d.minutes)), track, el('small', undefined, label));
    chart.appendChild(col);
  }
  body.appendChild(chart);
}

/** R0745: per game, about how long a sitting lasts, and how many were finished or left. */
export function attentionReport(body: HTMLElement, g: Game): void {
  const e = g.world.edu;
  if (!e) return;
  body.appendChild(el('h3', undefined, GROWN_UP_TEXT.attentionTitle));
  body.appendChild(el('p', 'help', GROWN_UP_TEXT.attentionHelp));
  const name = e.childName.trim() || GROWN_UP_TEXT.yourChild;
  const list = el('div', 'shop-list');
  for (const id of gamesForBand(e.band) as readonly EduGameId[]) {
    const a = e.attention?.[id];
    const secs = averageSeconds(a);
    if (!a || secs === null) continue;
    const row = el('div', 'shop-row');
    const t = el('div');
    t.append(
      el('strong', undefined, GROWN_UP_TEXT.attentionRow(name, EDU_TEXT.gameNames[id], secs)),
      el('small', undefined, GROWN_UP_TEXT.attentionCounts(a.opens, a.completes, a.quits)),
    );
    row.appendChild(t);
    list.appendChild(row);
  }
  if (list.childElementCount === 0) body.appendChild(el('p', 'help', GROWN_UP_TEXT.attentionNone));
  else body.appendChild(list);
}

/** R0718: print the Progress tab alone (the print sheet hides everything else). */
export function printButton(body: HTMLElement, g: Game): void {
  const b = button(
    GROWN_UP_TEXT.printButton,
    () => {
      const was = document.title;
      document.title = GROWN_UP_TEXT.printTitle(g.world.edu?.childName.trim() ?? '');
      document.documentElement.classList.add('grown-up-printing');
      const done = () => {
        document.documentElement.classList.remove('grown-up-printing');
        document.title = was;
        window.removeEventListener('afterprint', done);
      };
      window.addEventListener('afterprint', done);
      try {
        window.print();
      } catch {
        done();
      }
    },
    'btn btn-small grown-up-print',
  );
  body.appendChild(b);
}
