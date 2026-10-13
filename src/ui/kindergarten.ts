import { NAMES, PERSONALITY_LABELS, TYPE_LABELS, UI_TEXT } from '../config/strings';
import { LESSONS, SERVICES } from '../config/tuning';
import type { Game } from '../game';
import { canTakeLesson, doctorReport, fortune, LESSON_IDS, lessonLevel } from '../sim/kindergarten';
import type { Nubbin } from '../sim/types';
import { button, el, modal } from './dom';

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
    this.body.appendChild(el('pre', 'debug-values reading'));
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
    const out = this.body.querySelector('.reading');
    if (!out) return;
    if (kind === 'doctor') {
      const r = doctorReport(n);
      out.textContent = [
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
    } else {
      const f = fortune(n);
      const band =
        f.band === 'sun'
          ? NAMES.alignmentSun
          : f.band === 'moon'
            ? NAMES.alignmentMoon
            : NAMES.alignmentNeutral;
      out.textContent = [
        `"${f.line}"`,
        `I see a ${band} ${TYPE_LABELS[f.type as keyof typeof TYPE_LABELS] ?? f.type} ahead.`,
        `A ${(PERSONALITY_LABELS as Record<string, string>)[f.personality] ?? f.personality} soul.`,
        f.rebirthLikely ? UI_TEXT.rebirthLikely : UI_TEXT.rebirthUnlikely,
      ].join('\n');
    }
  }
}
