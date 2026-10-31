import {
  DOCTOR_TEXT,
  FORTUNE_TEXT,
  NAMES,
  PERSONALITY_LABELS,
  TYPE_LABELS,
  UI_TEXT,
} from '../config/strings';
import { DOCTOR, LESSONS, SERVICES } from '../config/tuning';
import type { Game } from '../game';
import {
  canTakeLesson,
  doctorNotes,
  doctorReport,
  fortune,
  LESSON_IDS,
  lessonLevel,
  reading,
} from '../sim/kindergarten';
import type { Nubbin } from '../sim/types';
import { nubbinPortrait } from './battle-party-pick';
import { button, el, modal } from './dom';
import { doctorNoteText, fortuneLines } from './kinder-text';

/** Lessons, the doctor and the fortune teller, for the selected Nubbin. */
export class KindergartenMenu {
  private readonly dialog;
  private readonly body: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly selected: () => string | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.kindergarten, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.kindergartenHelp));
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private pupil(): Nubbin | null {
    const g = this.game();
    if (!g) return null;
    const id = this.selected();
    const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
    if (n && n.stage !== 'egg' && n.stage !== 'cocoon') return n;
    return g.world.nubbins.find((x) => x.stage === 'child' || x.stage === 'adult') ?? null;
  }

  refresh(): void {
    const g = this.game();
    this.body.innerHTML = '';
    if (!g) return;
    const n = this.pupil();
    if (!n) {
      this.body.appendChild(el('p', 'help', UI_TEXT.pickNubbinFirst));
      return;
    }
    this.body.appendChild(el('div', 'btn-name', `${n.name} · 🐚 ${g.world.inventory.shells}`));

    const lessons = el('div', 'shop-list');
    lessons.appendChild(el('div', 'sheet-give-title', UI_TEXT.lessons));
    for (const id of LESSON_IDS) {
      const row = el('div', 'shop-row');
      const text = el('div');
      text.append(
        el('strong', undefined, UI_TEXT.lessonNames[id]),
        el('small', undefined, UI_TEXT.lessonLevel(lessonLevel(n, id), LESSONS.maxLevel)),
      );
      const why = canTakeLesson(g.world, n, id);
      const b = button(
        why === 'busy'
          ? UI_TEXT.lessonBusy
          : why === 'max'
            ? UI_TEXT.lessonMax
            : `${LESSONS.price} ${NAMES.currency}`,
        () => {
          g.send({ kind: 'startLesson', nubbinId: n.id, lesson: id });
          this.toast(UI_TEXT.lessonStarted(n.name, UI_TEXT.lessonNames[id]));
          setTimeout(() => this.refresh(), 150);
        },
        'btn btn-small',
      );
      b.disabled = why !== null;
      row.append(text, b);
      lessons.appendChild(row);
    }
    this.body.appendChild(lessons);

    const services = el('div', 'shop-list');
    const doctorRow = el('div', 'shop-row');
    const dText = el('div');
    dText.append(
      el('strong', undefined, UI_TEXT.doctor),
      el('small', undefined, UI_TEXT.doctorHelp),
    );
    const dBtn = button(
      `${SERVICES.doctor} ${NAMES.currency}`,
      () => this.service('doctor', n),
      'btn btn-small',
    );
    dBtn.disabled = g.world.inventory.shells < SERVICES.doctor;
    doctorRow.append(dText, dBtn);
    const fortuneRow = el('div', 'shop-row');
    const fText = el('div');
    fText.append(
      el('strong', undefined, UI_TEXT.fortuneTeller),
      el('small', undefined, UI_TEXT.fortuneHelp),
    );
    const fBtn = button(
      `${SERVICES.fortune} ${NAMES.currency}`,
      () => this.service('fortune', n),
      'btn btn-small',
    );
    fBtn.disabled = g.world.inventory.shells < SERVICES.fortune;
    fortuneRow.append(fText, fBtn);
    services.append(doctorRow, fortuneRow);
    this.body.appendChild(services);
    this.body.appendChild(el('div', 'reading'));
  }

  private service(kind: 'doctor' | 'fortune', n: Nubbin): void {
    const g = this.game();
    if (!g) return;
    const price = SERVICES[kind];
    if (g.world.inventory.shells < price) {
      this.toast(UI_TEXT.needShells(price));
      return;
    }
    g.send({ kind: 'payService', service: kind, nubbinId: n.id });
    const out = this.body.querySelector<HTMLElement>('.reading');
    if (!out) return;
    out.innerHTML = '';
    if (kind === 'doctor') this.checkUp(out, g, n);
    else this.fortuneCard(out, g, n);
  }

  /** R0556 (lane A r10): a little check-up, then a card of icon bars and two plain notes. */
  private checkUp(out: HTMLElement, g: Game, n: Nubbin): void {
    const calm = g.reduceMotion;
    const scene = el('div', 'kg-checkup');
    const pic = el('div', 'kg-patient');
    try {
      pic.appendChild(nubbinPortrait(g, n));
    } catch {
      // A portrait is a nicety; the check-up reads fine without one.
    }
    const say = el('div', 'kg-say');
    scene.append(pic, say);
    out.appendChild(scene);
    const card = this.doctorCard(g, n);
    const steps = DOCTOR_TEXT.steps;
    if (calm) {
      say.textContent = steps.map((s) => `${s.icon} ${s.say}`).join('  ');
      out.appendChild(card);
      return;
    }
    let i = 0;
    const next = (): void => {
      if (!out.isConnected) return;
      if (i >= steps.length) {
        scene.classList.remove('kg-tongue', 'kg-kick', 'kg-listen');
        out.appendChild(card);
        return;
      }
      const s = steps[i]!;
      say.textContent = `${s.icon} ${s.say}`;
      scene.classList.remove('kg-listen', 'kg-tongue', 'kg-kick');
      scene.classList.add(['kg-listen', 'kg-tongue', 'kg-kick'][i]!);
      i++;
      setTimeout(next, DOCTOR.stepMs);
    };
    next();
  }

  private doctorCard(g: Game, n: Nubbin): HTMLElement {
    const sprout = g.world.edu?.band === 'sprout';
    const T = DOCTOR_TEXT;
    const card = el('div', 'kg-card');
    card.appendChild(el('strong', undefined, T.title(n.name)));
    const bar = (icon: string, label: string, v: number, lean = false): void => {
      const row = el('div', 'kg-bar');
      row.setAttribute('role', 'meter');
      row.setAttribute('aria-label', label);
      row.setAttribute('aria-valuenow', String(Math.round(v * 100)));
      const track = el('div', lean ? 'kg-track kg-lean' : 'kg-track');
      const fill = el('div', 'kg-fill');
      fill.style.width = `${Math.round(Math.max(0, Math.min(1, v)) * 100)}%`;
      track.appendChild(fill);
      row.append(el('span', 'kg-icon', icon), el('span', 'kg-label', label), track);
      if (lean) row.appendChild(el('span', 'kg-icon', T.bars.lean.moon));
      card.appendChild(row);
    };
    const B = T.bars;
    bar(B.happiness.icon, B.happiness.label, (n.needs.happiness + 100) / 200);
    bar(B.affection.icon, B.affection.label, n.needs.affection / 100);
    bar(B.hunger.icon, B.hunger.label, n.needs.hunger);
    bar(B.energy.icon, B.energy.label, n.needs.energy);
    if (n.shadow) bar(B.trust.icon, B.trust.label, n.trust / 100);
    // Sun on the left filling toward the Moon: never a raw number for the youngest.
    bar(B.lean.icon, B.lean.label, (1 - n.alignment) / 2, true);
    for (const note of doctorNotes(n, g.world))
      card.appendChild(el('p', 'kg-note', doctorNoteText(note, n.name)));
    if (!sprout) {
      const raw = el('pre', 'debug-values');
      raw.hidden = true;
      raw.textContent = this.numbers(n);
      const toggle = button(
        T.showNumbers,
        () => {
          raw.hidden = !raw.hidden;
          toggle.textContent = raw.hidden ? T.showNumbers : T.hideNumbers;
        },
        'btn btn-small',
      );
      card.append(toggle, raw);
    }
    return card;
  }

  private numbers(n: Nubbin): string {
    const r = doctorReport(n);
    return [
      `${n.name}: trust ${r.trust}  alignment ${r.alignment}`,
      `happiness ${r.happiness} (lifetime ${r.lifetimeHappiness})  affection ${r.affection}`,
      `hunger ${r.hunger}%  energy ${r.energy}%`,
      `lean ${Object.entries(r.lean)
        .map(([k, v]) => `${TYPE_LABELS[k as keyof typeof TYPE_LABELS] ?? k} ${v}`)
        .join('  ')}`,
      `grades ${Object.entries(n.stats)
        .map(([k, s]) => `${k} ${s.grade}`)
        .join('  ')}`,
    ].join('\n');
  }

  /** R0557 (lane A r10): the character, the road ahead and one like it has kept to itself. */
  private fortuneCard(out: HTMLElement, g: Game, n: Nubbin): void {
    const r = reading(n, g.world.timeMs);
    const f = fortune(n);
    const band =
      f.band === 'sun'
        ? NAMES.alignmentSun
        : f.band === 'moon'
          ? NAMES.alignmentMoon
          : NAMES.alignmentNeutral;
    const card = el('div', 'kg-card kg-fortune');
    for (const line of fortuneLines(r)) card.appendChild(el('p', 'kg-note', `"${line}"`));
    card.appendChild(
      el(
        'p',
        'kg-note',
        `I see a ${band} ${TYPE_LABELS[f.type as keyof typeof TYPE_LABELS] ?? f.type} ahead. ` +
          `A ${(PERSONALITY_LABELS as Record<string, string>)[f.personality] ?? f.personality} soul.`,
      ),
    );
    card.appendChild(
      el('p', 'kg-note', f.rebirthLikely ? UI_TEXT.rebirthLikely : UI_TEXT.rebirthUnlikely),
    );
    out.appendChild(card);
    if (r.reveal) this.toast(FORTUNE_TEXT.revealed(n.name));
  }
}
