import { EDU_LIMITS_TEXT } from '../config/strings';
import { EDU_LIMITS } from '../config/tuning-kids';
import type { Game } from '../game';
import { writeKidsLock } from '../platform/kids-lock';
import { currentSlot } from '../platform/storage';
import { eduLimitReason, eduLimits } from '../sim/edu-limits';
import { button, el } from './dom';
import { clipPortrait, sleeperOf } from './edu';
import { speakLine } from './lesson';

/**
 * R0695 (KIDS-27): the sleeping-Grove card a grown-up's limits put up (the day's minutes are
 * used, or it is quiet hours), the grown-up area's limit settings, and the boot lock that sends
 * a reload straight into this Learning Grove slot.
 */
export class LimitCard {
  private readonly root: HTMLDivElement;
  private readonly why: HTMLElement;
  private readonly pic: HTMLElement;
  private shown: 'daily' | 'quiet' | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly ask: () => Promise<boolean>,
  ) {
    this.root = el('div', 'edu-break edu-limit');
    this.root.hidden = true;
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');
    const card = el('div', 'edu-break-card');
    this.pic = el('div', 'edu-break-sleeper');
    this.why = el('p', 'help');
    card.append(
      el('h2', undefined, EDU_LIMITS_TEXT.title),
      this.pic,
      this.why,
      button(
        EDU_LIMITS_TEXT.unlock,
        () => {
          void this.ask().then((ok) => {
            if (ok) this.game()?.send({ kind: 'eduUnlockLimits' });
          });
        },
        'btn btn-small',
      ),
    );
    this.root.appendChild(card);
    parent.appendChild(this.root);
  }

  /** Per-frame: show or hide by the limits. */
  update(nowMs: number): void {
    const g = this.game();
    const reason = g ? eduLimitReason(g.world, nowMs) : null;
    if (reason === this.shown) return;
    this.shown = reason;
    this.root.hidden = !reason;
    if (!g || !reason) return;
    this.why.textContent = EDU_LIMITS_TEXT.why[reason];
    this.pic.textContent = '';
    const n = sleeperOf(g);
    if (n) this.pic.appendChild(clipPortrait(g, n, 'sleep', 'edu-break-pic'));
    else this.pic.appendChild(el('div', 'edu-big', '😴'));
    if (g.world.edu?.readAloud) speakLine(EDU_LIMITS_TEXT.say[reason]);
  }

  isOpen(): boolean {
    return this.shown !== null;
  }
}

/** Keep the boot lock in step with the save's setting. Never throws. */
export function syncKidsLock(g: Game): void {
  const slot = currentSlot();
  if (slot.mode !== 'edu') return;
  const key = `${slot.index}:${eduLimits(g.world).lockToSlot}`;
  // Called every frame: touch storage only when the setting changed.
  if (key === lastLock) return;
  lastLock = key;
  writeKidsLock(slot.index, eduLimits(g.world).lockToSlot);
}

let lastLock = '';

/** The grown-up area's limit rows: minutes a day, quiet hours, and the boot lock. */
export function limitSettings(body: HTMLElement, g: Game): void {
  const l = eduLimits(g.world);
  body.appendChild(el('h3', undefined, EDU_LIMITS_TEXT.heading));
  body.appendChild(el('p', 'help', EDU_LIMITS_TEXT.help));
  const num = (
    label: string,
    value: number | null,
    min: number,
    max: number,
    send: (v: number | null) => void,
  ) => {
    const row = el('label', 'field-row');
    const input = el('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.min = String(min);
    input.max = String(max);
    input.placeholder = EDU_LIMITS_TEXT.none;
    input.value = value === null ? '' : String(value);
    input.addEventListener('change', () =>
      send(input.value.trim() === '' ? null : Number(input.value)),
    );
    row.append(el('strong', undefined, label), input);
    body.appendChild(row);
  };
  const [lo, hi] = EDU_LIMITS.dailyRange;
  num(EDU_LIMITS_TEXT.daily, l.dailyMinutes, lo, hi, (v) =>
    g.send({ kind: 'eduSetLimits', limits: { dailyMinutes: v } }),
  );
  num(EDU_LIMITS_TEXT.quietFrom, l.quietFrom, 0, 23, (v) =>
    g.send({ kind: 'eduSetLimits', limits: { quietFrom: v } }),
  );
  num(EDU_LIMITS_TEXT.quietTo, l.quietTo, 0, 23, (v) =>
    g.send({ kind: 'eduSetLimits', limits: { quietTo: v } }),
  );
  const row = el('label', 'check-row');
  const cb = el('input');
  cb.type = 'checkbox';
  cb.checked = l.lockToSlot;
  cb.addEventListener('change', () => {
    g.send({ kind: 'eduSetLimits', limits: { lockToSlot: cb.checked } });
    window.setTimeout(() => syncKidsLock(g), 100);
  });
  const text = el('span');
  text.append(
    el('strong', undefined, EDU_LIMITS_TEXT.lock),
    el('small', undefined, EDU_LIMITS_TEXT.lockHelp),
  );
  row.append(cb, text);
  body.appendChild(row);
}
