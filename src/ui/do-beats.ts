/**
 * Lane E r10, R0700 (KIDS-32): the six small interactions behind a lesson's `do` beat, in
 * place of one "We did it!" button the child learns to press. Which one opens is decided by
 * `do-plan.ts` from the check string. Each beat is a few big targets (64 px and up), says
 * its instruction aloud when read-aloud is on, and shows "All done!" only once the child has
 * done the thing. Sorting works by drag or by tap-then-tap (the motor alternative); counting
 * in Hebrew or Japanese plays each number's native-speaker clip (`playWord`), never TTS.
 */
import '../kids-r10.css';
import { EDU_STORY_TEXT } from '../config/strings';
import { KIDS_R10_TEXT } from '../config/strings-kids-r10';
import { KIDS_R10_TUNING } from '../config/tuning-kids-r10';
import { playSound } from '../platform/audio';
import { playWord } from '../platform/lang-audio';
import { langCourses } from '../sim/lang';
import type { VocabItem } from '../content/types';
import { button, el } from './dom';
import { DO_COLOURS, doWords, type DoBeat, type DoLang } from './do-plan';
import { speakLine } from './lesson';

const T = KIDS_R10_TEXT.beats;
const L = KIDS_R10_TEXT.beatLabels;

export interface BeatOptions {
  /** Say the instructions and counts aloud (the sprout band's read-aloud). */
  speak: boolean;
}

/** Draw `beat` into `box`; `onDone` runs when the child taps "All done!". */
export function renderBeat(
  box: HTMLElement,
  beat: DoBeat,
  opts: BeatOptions,
  onDone: () => void,
): void {
  const card = el('div', `do-beat do-beat-${beat.kind}`);
  box.appendChild(card);
  const say = (text: string): void => {
    if (opts.speak) speakLine(text);
  };
  const finish = (line?: string): void => {
    if (card.querySelector('.do-beat-done')) return;
    if (line) {
      card.appendChild(el('p', 'do-beat-cheer', line));
      say(line);
    }
    playSound('ding');
    const b = button(
      `✔ ${T.done}`,
      () => {
        box.innerHTML = '';
        onDone();
      },
      'btn btn-primary edu-option do-beat-done',
    );
    card.appendChild(b);
    b.focus({ preventScroll: true });
  };
  const ask = (text: string): void => {
    card.appendChild(el('p', 'do-beat-ask', text));
    say(text);
  };
  switch (beat.kind) {
    case 'count':
      return countBeat(card, beat, ask, say, finish);
    case 'sort':
      return sortBeat(card, beat.groups, ask, say, finish);
    case 'order':
      return orderBeat(card, beat.items, ask, say, finish);
    case 'paint':
      return paintBeat(card, beat.colour, ask, finish);
    case 'draw':
      return drawBeat(card, beat.thing, ask, say, finish);
    case 'find':
      return findBeat(card, beat, ask, finish);
    case 'say':
      return sayBeat(card, ask, finish);
    case 'body':
      // The child's own body is the task: the honour button stays.
      card.appendChild(
        button(
          EDU_STORY_TEXT.weDidIt,
          () => {
            box.innerHTML = '';
            onDone();
          },
          'btn btn-primary edu-option',
        ),
      );
      return;
  }
}

type Ask = (text: string) => void;
type Finish = (line?: string) => void;

/** The course's number words, 1 to 10, by number (empty when no course is loaded). */
function numberWords(lang: DoLang): Map<number, VocabItem> {
  const out = new Map<number, VocabItem>();
  if (!lang) return out;
  for (const c of langCourses())
    if (c.lang === lang)
      for (const v of c.vocab) {
        if (v.topic !== 'numbers') continue;
        const n = Number(/\d+/.exec(v.english)?.[0]);
        if (Number.isInteger(n) && !out.has(n)) out.set(n, v);
      }
  return out;
}

/** A thing's token colour, so plums look like plums and stars like stars. */
const THING_COLOURS: Readonly<Record<string, string>> = {
  plums: 'purple',
  berries: 'red',
  apples: 'red',
  stars: 'yellow',
  acorns: 'brown',
  leaves: 'green',
  eggs: 'white',
  fish: 'blue',
  koi: 'orange',
};

function countBeat(
  card: HTMLElement,
  beat: Extract<DoBeat, { kind: 'count' }>,
  ask: Ask,
  say: (t: string) => void,
  finish: Finish,
): void {
  const thing = doWords(beat.thing) || T.countThing;
  ask(T.count(thing, beat.n));
  const words = numberWords(beat.lang);
  const tally = el('p', 'do-beat-tally', '0');
  tally.setAttribute('aria-live', 'polite');
  const row = el('div', 'do-beat-tokens');
  const colour = DO_COLOURS[THING_COLOURS[beat.thing] ?? ''] ?? '#c58a4a';
  let n = 0;
  for (let i = 0; i < beat.n; i++) {
    const t = button(
      '',
      () => {
        if (t.classList.contains('do-on')) return;
        n += 1;
        t.classList.add('do-on');
        t.textContent = String(n);
        t.disabled = true;
        const w = words.get(n);
        if (w) {
          // The number in the course's language, heard from its clip and shown in its script.
          playWord(w.audio);
          tally.textContent = `${n} · ${w.native} (${w.roman})`;
        } else {
          tally.textContent = String(n);
          say(String(n));
        }
        if (n === beat.n) window.setTimeout(() => finish(T.counted(beat.n)), 600);
      },
      'btn do-token',
    );
    t.style.setProperty('--tok', colour);
    if (beat.thing === 'stars') t.classList.add('do-token-star');
    t.setAttribute('aria-label', L.token(i + 1));
    row.appendChild(t);
  }
  card.append(row, tally);
}

/** A colour word's chip: the colour and its name, so colour is never the only signal. */
function chip(word: string): HTMLElement {
  const c = el('span', 'do-chip', doWords(word));
  const css = DO_COLOURS[word];
  if (css) c.style.setProperty('--chip', css);
  else c.classList.add('do-chip-word');
  return c;
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function sortBeat(
  card: HTMLElement,
  groups: string[],
  ask: Ask,
  say: (t: string) => void,
  finish: Finish,
): void {
  ask(T.sort);
  const tray = el('div', 'do-beat-tray');
  const baskets = el('div', 'do-beat-baskets');
  const items = shuffle(
    Array.from({ length: KIDS_R10_TUNING.sortItems }, (_, i) => groups[i % groups.length]!),
  );
  let held: HTMLButtonElement | null = null;
  let left = items.length;
  const drop = (item: HTMLButtonElement, basket: HTMLElement): void => {
    if (item.dataset.group !== basket.dataset.group) {
      basket.classList.remove('do-shake');
      void basket.offsetWidth;
      basket.classList.add('do-shake');
      return;
    }
    item.classList.remove('do-held');
    item.disabled = true;
    basket.querySelector('.do-basket-in')?.appendChild(item);
    held = null;
    left -= 1;
    if (left === 0) finish(T.sorted);
  };
  for (const g of groups) {
    const b = el('div', 'do-basket');
    b.dataset.group = g;
    b.setAttribute('role', 'button');
    b.tabIndex = 0;
    b.setAttribute('aria-label', L.basket(doWords(g)));
    b.append(el('span', 'do-basket-name', '🧺'), chip(g), el('div', 'do-basket-in'));
    const take = (): void => {
      if (held) drop(held, b);
    };
    b.addEventListener('click', take);
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') take();
    });
    baskets.appendChild(b);
  }
  for (const g of items) {
    const it = el('button', 'btn do-item');
    it.type = 'button';
    it.dataset.group = g;
    it.appendChild(chip(g));
    // Tap to pick up, then tap a basket.
    it.addEventListener('click', () => {
      if (it.disabled) return;
      held?.classList.remove('do-held');
      held = it;
      it.classList.add('do-held');
      say(T.sortPick(doWords(g)));
    });
    // Or drag it onto a basket.
    it.addEventListener('pointerdown', (e) => {
      if (it.disabled) return;
      const sx = e.clientX;
      const sy = e.clientY;
      let moved = false;
      const move = (ev: PointerEvent): void => {
        if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
        moved = true;
        it.style.transform = `translate(${ev.clientX - sx}px, ${ev.clientY - sy}px)`;
      };
      const up = (ev: PointerEvent): void => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        it.style.transform = '';
        if (!moved) return;
        const under = document.elementFromPoint(ev.clientX, ev.clientY);
        const basket = under?.closest<HTMLElement>('.do-basket');
        if (basket) drop(it, basket);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
    tray.appendChild(it);
  }
  card.append(tray, baskets);
}

function orderBeat(
  card: HTMLElement,
  items: string[],
  ask: Ask,
  say: (t: string) => void,
  finish: Finish,
): void {
  ask(T.order);
  const strip = el('div', 'do-beat-strip');
  const row = el('div', 'do-beat-tray');
  let next = 0;
  for (const word of shuffle([...items])) {
    const b = button(
      '',
      () => {
        if (word !== items[next]) {
          b.classList.remove('do-shake');
          void b.offsetWidth;
          b.classList.add('do-shake');
          return;
        }
        next += 1;
        b.disabled = true;
        strip.appendChild(b);
        if (next === items.length) finish(T.ordered);
        else say(T.orderNext(doWords(items[next]!)));
      },
      'btn do-item',
    );
    b.appendChild(chip(word));
    row.appendChild(b);
  }
  card.append(strip, row);
}

function paintBeat(card: HTMLElement, colour: string, ask: Ask, finish: Finish): void {
  ask(T.paint(colour));
  const fence = el('div', 'do-beat-fence');
  fence.style.setProperty('--paint', DO_COLOURS[colour] ?? DO_COLOURS.yellow!);
  let left = 3;
  for (let i = 0; i < 3; i++) {
    const p = button(
      '',
      () => {
        if (p.classList.contains('do-on')) return;
        p.classList.add('do-on');
        p.disabled = true;
        playSound('pop');
        left -= 1;
        if (left === 0) finish(T.painted);
      },
      'btn do-plank',
    );
    p.setAttribute('aria-label', L.plank(i + 1));
    fence.appendChild(p);
  }
  card.appendChild(fence);
}

function drawBeat(
  card: HTMLElement,
  thing: string,
  ask: Ask,
  say: (t: string) => void,
  finish: Finish,
): void {
  ask(T.draw(doWords(thing)));
  const canvas = el('canvas', 'do-beat-canvas');
  canvas.width = 320;
  canvas.height = 220;
  canvas.setAttribute('aria-label', L.canvas);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fbf6e9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#3b5aa8';
  }
  const started = performance.now();
  let inked = 0;
  const show = button(
    T.drawWait,
    () => {
      show.remove();
      say(T.shown);
      card.appendChild(el('p', 'do-beat-cheer', T.shown));
      finish();
    },
    'btn btn-primary do-beat-show',
  );
  show.disabled = true;
  const ready = (): void => {
    if (!show.disabled || inked < 20) return;
    const wait = KIDS_R10_TUNING.drawMinMs - (performance.now() - started);
    if (wait > 0) {
      window.setTimeout(ready, wait + 50);
      return;
    }
    show.disabled = false;
    show.textContent = `🐣 ${T.showNubbin}`;
  };
  const at = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [
      ((e.clientX - r.left) / r.width) * canvas.width,
      ((e.clientY - r.top) / r.height) * canvas.height,
    ];
  };
  let last: [number, number] | null = null;
  canvas.addEventListener('pointerdown', (e) => {
    last = at(e);
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Capture is a nicety.
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!last || !ctx) return;
    const p = at(e);
    ctx.beginPath();
    ctx.moveTo(last[0], last[1]);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();
    inked += Math.hypot(p[0] - last[0], p[1] - last[1]);
    last = p;
  });
  const end = (): void => {
    last = null;
    ready();
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  card.append(canvas, show);
}

function findBeat(
  card: HTMLElement,
  beat: Extract<DoBeat, { kind: 'find' }>,
  ask: Ask,
  finish: Finish,
): void {
  const row = el('div', 'do-beat-tray');
  if (beat.colour) {
    // Find the named colour(s) among the others, each chip with its name.
    const others = shuffle(Object.keys(DO_COLOURS).filter((c) => !beat.targets.includes(c)));
    const all = shuffle([...beat.targets, ...others.slice(0, 6 - beat.targets.length)]);
    let left = beat.targets.length;
    ask(T.findColour(beat.targets.join(', ')));
    for (const c of all) {
      const b = button(
        '',
        () => {
          if (!beat.targets.includes(c)) {
            b.classList.remove('do-shake');
            void b.offsetWidth;
            b.classList.add('do-shake');
            return;
          }
          b.classList.add('do-on');
          b.disabled = true;
          left -= 1;
          if (left === 0) finish(T.found);
        },
        'btn do-item',
      );
      b.appendChild(chip(c));
      row.appendChild(b);
    }
    card.appendChild(row);
    return;
  }
  // Something hides behind one of the bushes (each target behind its own).
  const n = KIDS_R10_TUNING.findBushes;
  const spots = shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, beat.targets.length);
  let left = beat.targets.length;
  ask(T.findHidden(beat.targets.map(doWords).join(', ')));
  for (let i = 0; i < n; i++) {
    const hid = spots.indexOf(i);
    const b = button(
      '🌳',
      () => {
        b.disabled = true;
        if (hid < 0) {
          b.textContent = '🍃';
          return;
        }
        b.textContent = '';
        b.appendChild(chip(beat.targets[hid]!));
        b.classList.add('do-on');
        left -= 1;
        if (left === 0) finish(T.found);
      },
      'btn do-item do-bush',
    );
    b.setAttribute('aria-label', L.bush(i + 1));
    row.appendChild(b);
  }
  card.appendChild(row);
}

function sayBeat(card: HTMLElement, ask: Ask, finish: Finish): void {
  ask(T.say);
  const ring = el('div', 'do-beat-ring', T.sayWait);
  ring.style.setProperty('--say', `${KIDS_R10_TUNING.sayMs}ms`);
  card.appendChild(ring);
  // No microphone: the pause is the child's turn, then the beat goes on.
  window.setTimeout(() => {
    ring.classList.add('do-on');
    finish();
  }, KIDS_R10_TUNING.sayMs);
}
