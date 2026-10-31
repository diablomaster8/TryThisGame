/**
 * Lane E round 10 (R0718 KIDS-50): the grown-up area, behind the sum gate, as four tabs
 * instead of one long scroll. Child (who they are, story band, reading and touch), Time
 * (session, limits, this week's minutes, attention), Content (games, places, the loss
 * chapters) and Progress (the report, with standards in plain words and a print button).
 * `GrownUpPanel` in edu.ts owns the dialog and the gate; this draws what is behind them.
 */
import '../access-r10.css';
import { EDU, EDU_AGES, EDU_DOMAIN, EDU_RECOMMENDED, type EduAge } from '../config/edu';
import { EDU_TEXT, NAMES } from '../config/strings';
import { ACCESS_TEXT, GROWN_UP_TEXT } from '../config/strings-access-r10';
import { EDU_REBORN_TEXT, EDU_ROUNDS_TEXT } from '../config/strings-kids';
import { KIDS_R10_TEXT } from '../config/strings-kids-r10';
import { KIDS_R10_TUNING } from '../config/tuning-kids-r10';
import type { Game } from '../game';
import { eduRounds, gamesForBand } from '../sim/edu';
import { mountAccessSettings } from './access-r10';
import { button, el } from './dom';
import { gameBlurb, gameName } from './edu';
import { masteryReport } from './edu-mastery';
import { placesSettings } from './edu-places';
import { limitSettings } from './edu-limits';
import { attentionReport, gameStandards, printButton, weekChart } from './edu-report';
import { storyProgress, storySettings } from './edu-story';
import { tipsDeckPanel } from './edu-tips-deck';
import { tagRows } from './kids-tag-rows';
import { langProgress } from './lang';
import { lossSettings } from './loss-notice';

export type GrownUpTab = 'child' | 'time' | 'content' | 'progress';
const TABS: readonly GrownUpTab[] = ['child', 'time', 'content', 'progress'];

/** The tab last shown, so a re-render after a change stays where the grown-up was. */
let current: GrownUpTab = 'child';

export function renderGrownUp(
  body: HTMLElement,
  g: Game,
  game: () => Game | null,
  rerender: () => void,
): void {
  body.textContent = '';
  body.classList.add('grown-up');
  body.appendChild(el('p', 'help', EDU_TEXT.parentHelp));
  const bar = el('div', 'grown-up-tabs');
  bar.setAttribute('role', 'tablist');
  bar.setAttribute('aria-label', GROWN_UP_TEXT.tabsLabel);
  const panel = el('div', 'grown-up-panel');
  panel.setAttribute('role', 'tabpanel');
  const buttons = new Map<GrownUpTab, HTMLButtonElement>();
  const show = (tab: GrownUpTab, focus = false) => {
    current = tab;
    for (const [t, b] of buttons) {
      const on = t === tab;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      b.classList.toggle('is-on', on);
    }
    panel.setAttribute('aria-labelledby', `grown-up-tab-${tab}`);
    panel.dataset.tab = tab;
    panel.textContent = '';
    DRAW[tab](panel, g, game, rerender);
    if (focus) buttons.get(tab)?.focus();
  };
  for (const t of TABS) {
    const b = button(GROWN_UP_TEXT.tabs[t], () => show(t), 'btn btn-small grown-up-tab');
    b.id = `grown-up-tab-${t}`;
    b.setAttribute('role', 'tab');
    b.addEventListener('keydown', (ev) => {
      const i = TABS.indexOf(t);
      const step = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      ev.preventDefault();
      show(TABS[(i + step + TABS.length) % TABS.length]!, true);
    });
    buttons.set(t, b);
    bar.appendChild(b);
  }
  body.append(bar, panel);
  show(current);
}

type Draw = (body: HTMLElement, g: Game, game: () => Game | null, rerender: () => void) => void;

const DRAW: Record<GrownUpTab, Draw> = {
  child: drawChild,
  time: drawTime,
  content: drawContent,
  progress: drawProgress,
};

/** Child: age (the band follows), name, tag, story band and voice, reading and touch. */
function drawChild(body: HTMLElement, g: Game, game: () => Game | null, rerender: () => void) {
  const e = g.world.edu;
  if (!e) return;
  const ageRow = el('label', 'field-row');
  const ageSel = el('select');
  for (const a of EDU_AGES) {
    const o = el('option', undefined, String(a));
    o.value = String(a);
    ageSel.appendChild(o);
  }
  ageSel.value = String(e.age);
  ageSel.addEventListener('change', () => {
    g.send({ kind: 'eduSetAge', age: Number(ageSel.value) as EduAge, resetGames: true });
    setTimeout(rerender, 100);
  });
  ageRow.append(el('strong', undefined, EDU_TEXT.ageLabel), ageSel);
  // R0735: a reader's games stay at their top age; the band is the real choice for 7–10.
  // Lane E r10: the reader's own select, 7 to 10, which the slot and this row then show.
  if (e.band === 'reader') {
    const readerSel = el('select');
    if (e.readerAge === undefined) {
      const o = el('option', undefined, KIDS_R10_TEXT.readerAgeUnset);
      o.value = '';
      readerSel.appendChild(o);
    }
    for (const a of KIDS_R10_TUNING.readerAges) {
      const o = el('option', undefined, String(a));
      o.value = String(a);
      readerSel.appendChild(o);
    }
    readerSel.value = e.readerAge === undefined ? '' : String(e.readerAge);
    readerSel.addEventListener('change', () => {
      const age = Number(readerSel.value);
      if (age === 7 || age === 8 || age === 9 || age === 10)
        g.send({ kind: 'eduSetReaderAge', age });
      setTimeout(rerender, 100);
    });
    ageRow.replaceChildren(el('strong', undefined, EDU_TEXT.ageLabel), readerSel);
  }
  body.appendChild(ageRow);
  const nameRow = el('label', 'field-row');
  const name = el('input');
  name.type = 'text';
  name.maxLength = 20;
  name.value = e.childName;
  name.addEventListener('change', () => g.send({ kind: 'eduSetName', name: name.value }));
  nameRow.append(el('strong', undefined, EDU_TEXT.childName), name);
  body.appendChild(nameRow);
  // Lane E r10, R0696: the slot's animal and colour can be changed here too.
  body.appendChild(tagRows(g, e.icon ?? null, e.tagColour ?? null));
  storySettings(body, g);
  // Lane E r10 (R0709, R0710): reading and touch.
  body.appendChild(el('h3', undefined, ACCESS_TEXT.heading));
  mountAccessSettings(body, game)(g);
  body.appendChild(el('p', 'help', ACCESS_TEXT.textSizeHint));
}

/** Time: session length, daily limits and quiet hours, the week's minutes, attention. */
function drawTime(body: HTMLElement, g: Game) {
  const e = g.world.edu;
  if (!e) return;
  const sessRow = el('label', 'field-row');
  const sess = el('input');
  sess.type = 'number';
  sess.inputMode = 'numeric';
  sess.min = String(EDU.sessionRange[0]);
  sess.max = String(EDU.sessionRange[1]);
  sess.value = String(e.sessionMinutes);
  sess.addEventListener('change', () =>
    g.send({ kind: 'eduSetSession', minutes: Number(sess.value) || EDU.sessionMinutes }),
  );
  sessRow.append(el('strong', undefined, EDU_TEXT.sessionLabel), sess);
  body.appendChild(sessRow);
  body.appendChild(el('p', 'help', EDU_TEXT.sessionHelp));
  // R0695: daily minutes, quiet hours and the boot lock.
  limitSettings(body, g);
  weekChart(body, g);
  attentionReport(body, g);
}

/** Content: rounds, games, what comes back, places, and the loss chapters. */
function drawContent(body: HTMLElement, g: Game, _game: () => Game | null, rerender: () => void) {
  const e = g.world.edu;
  if (!e) return;
  // R0746: how many rounds a game lasts, 3 to 10 (by age until a grown-up picks).
  const roundsRow = el('label', 'field-row');
  const roundsSel = el('select');
  for (let k = EDU.minRounds; k <= EDU.maxRounds; k++) {
    const o = el('option', undefined, String(k));
    o.value = String(k);
    roundsSel.appendChild(o);
  }
  roundsSel.value = String(eduRounds(e));
  roundsSel.addEventListener('change', () =>
    g.send({ kind: 'eduSetRounds', rounds: Number(roundsSel.value) }),
  );
  roundsRow.append(el('strong', undefined, EDU_ROUNDS_TEXT.label), roundsSel);
  body.appendChild(roundsRow);
  // R0691: sprouts always get their Nubbin back; for a reader it is the grown-up's call.
  if (e.band === 'reader') {
    const row = el('label', 'check-row');
    const cb = el('input');
    cb.type = 'checkbox';
    cb.checked = !!e.alwaysReborn;
    cb.addEventListener('change', () => g.send({ kind: 'eduSetAlwaysReborn', on: cb.checked }));
    const t = el('span');
    t.append(
      el('strong', undefined, EDU_REBORN_TEXT.toggle),
      el('small', undefined, EDU_REBORN_TEXT.toggleHelp),
    );
    row.append(cb, t);
    body.appendChild(row);
  }
  body.appendChild(el('h3', undefined, EDU_TEXT.gamesLabel));
  const reader = e.band === 'reader';
  for (const id of gamesForBand(e.band)) {
    const row = el('label', 'check-row');
    const cb = el('input');
    cb.type = 'checkbox';
    cb.checked = e.games[id];
    cb.addEventListener('change', () => g.send({ kind: 'eduSetGame', game: id, on: cb.checked }));
    const text = el('span');
    const rec = EDU_RECOMMENDED[e.age].includes(id);
    text.append(
      el('strong', undefined, `${EDU_TEXT.gameIcons[id]} ${gameName(id, reader)}`),
      el(
        'small',
        undefined,
        `${gameBlurb(id, reader)}${rec && !reader ? ` · ${EDU_TEXT.recommended(e.age)}` : ''}`,
      ),
    );
    row.append(cb, text);
    body.appendChild(row);
  }
  body.appendChild(
    button(
      EDU_TEXT.resetRecommended,
      () => {
        g.send({ kind: 'eduSetAge', age: e.age, resetGames: true });
        setTimeout(rerender, 100);
      },
      'btn btn-small',
    ),
  );
  // R0680: which places the ⋯ Places menu shows.
  placesSettings(body, g);
  // Lane E r10 (R0694): the loss chapters.
  lossSettings(body, g);
  body.appendChild(el('p', 'help', GROWN_UP_TEXT.matureNote));
}

/** Progress: by area, the item grids, the games' standards, stories, words, tips, print. */
function drawProgress(body: HTMLElement, g: Game) {
  const e = g.world.edu;
  if (!e) return;
  printButton(body, g);
  body.appendChild(el('h3', undefined, EDU_TEXT.progressLabel));
  const list = el('div', 'shop-list');
  const byDomain = new Map<string, { plays: number; stars: number }>();
  // R0735: only the games this band is offered, so a reader sees no empty Animals row.
  for (const id of gamesForBand(e.band)) {
    const d = EDU_DOMAIN[id];
    const cur = byDomain.get(d) ?? { plays: 0, stars: 0 };
    cur.plays += e.progress[id]?.plays ?? 0;
    cur.stars += e.progress[id]?.stars ?? 0;
    byDomain.set(d, cur);
  }
  for (const [d, p] of byDomain) {
    const row = el('div', 'shop-row');
    const t = el('div');
    t.append(
      el('strong', undefined, EDU_TEXT.domains[d as keyof typeof EDU_TEXT.domains]),
      el('small', undefined, EDU_TEXT.progressRow(p.plays, p.stars)),
    );
    row.appendChild(t);
    list.appendChild(row);
  }
  body.appendChild(list);
  // R0682 / R0683: letters, numbers, colours and shapes known, and each game's rung.
  masteryReport(body, g.world);
  // R0717: what the games practise, in plain words.
  gameStandards(body, g);
  storyProgress(body, g);
  langProgress(body, g);
  body.appendChild(el('p', 'help', EDU_TEXT.stickers(e.stickers)));
  // R0740: the co-play tips deck.
  tipsDeckPanel(body, g);
  body.appendChild(el('p', 'help', `🐚 ${g.world.inventory.shells} ${NAMES.currency}`));
}
