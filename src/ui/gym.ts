import { STAT_LABELS, TEN_TEXT, UI_TEXT } from '../config/strings';
import { GYM } from '../config/tuning';
import type { Game } from '../game';
import { canTrain, STATIONS } from '../sim/gym';
import type { Nubbin, StatKey } from '../sim/types';
import { button, el, modal } from './dom';

/**
 * The training gym: pick a station and a Nubbin, then a twenty-second timing game on
 * a card. A bar sweeps back and forth; tapping inside the zone is a hit. Hits go to
 * the sim as a training result.
 */
export class GymMenu {
  private readonly dialog;
  private readonly list: HTMLDivElement;
  readonly screen: GymScreen;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
    private readonly pick: () => Nubbin | null,
  ) {
    this.dialog = modal(parent, TEN_TEXT.gym, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', TEN_TEXT.gymHelp));
    this.list = el('div', 'shop-list');
    this.dialog.body.appendChild(this.list);
    this.screen = new GymScreen(parent);
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

  private refresh(): void {
    const g = this.game();
    if (!g) return;
    this.list.innerHTML = '';
    const n = this.pick();
    this.list.appendChild(el('div', 'shop-note', n ? `${n.name}` : UI_TEXT.expeditionNeedsNubbin));
    for (const s of STATIONS) {
      const row = el('div', 'shop-row');
      const text = el('div');
      text.append(
        el('strong', undefined, TEN_TEXT.stationNames[s.id] ?? s.id),
        el('small', undefined, STAT_LABELS[s.stat]),
      );
      const b = button(TEN_TEXT.train, () => this.start(s.stat), 'btn btn-small btn-primary');
      b.disabled = !n;
      row.append(text, b);
      this.list.appendChild(row);
    }
  }

  private start(stat: StatKey): void {
    const g = this.game();
    const n = this.pick();
    if (!g || !n) return;
    const why = canTrain(g.world, n.id);
    if (why === 'tired') {
      this.toast(TEN_TEXT.tooTired);
      return;
    }
    if (why) return;
    this.close();
    g.renderPaused = true;
    this.screen.start(n.name, STAT_LABELS[stat], (hits) => {
      g.renderPaused = false;
      g.send({ kind: 'trainResult', nubbinId: n.id, stat, hits });
    });
  }
}

export class GymScreen {
  private readonly root: HTMLDivElement;
  private readonly title: HTMLDivElement;
  private readonly bar: HTMLDivElement;
  private readonly marker: HTMLDivElement;
  private readonly zone: HTMLDivElement;
  private readonly hitsText: HTMLDivElement;
  private readonly timeText: HTMLDivElement;
  private readonly tapBtn: HTMLButtonElement;
  private readonly quitBtn: HTMLButtonElement;
  private rafId = 0;
  private startMs = 0;
  private hits = 0;
  private lastTapAt = -1;
  private zoneStart = 0.4;
  private onDone: ((hits: number) => void) | null = null;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'gym');
    this.root.hidden = true;
    const card = el('div', 'gym-card');
    this.title = el('div', 'edu-prompt');
    this.bar = el('div', 'gym-bar');
    this.zone = el('div', 'gym-zone');
    this.marker = el('div', 'gym-marker');
    this.bar.append(this.zone, this.marker);
    this.hitsText = el('div', 'edu-feedback');
    this.timeText = el('div', 'edu-progress');
    this.tapBtn = button(TEN_TEXT.gymTap, () => this.tap(), 'btn btn-primary edu-next');
    this.quitBtn = button(UI_TEXT.quitMinigame, () => this.finish(), 'btn btn-small');
    card.append(this.title, this.timeText, this.bar, this.hitsText, this.tapBtn, this.quitBtn);
    this.root.appendChild(card);
    this.root.addEventListener('pointerdown', (e) => {
      if (e.target === this.bar || this.bar.contains(e.target as Node)) this.tap();
    });
    parent.appendChild(this.root);
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  start(name: string, statLabel: string, onDone: (hits: number) => void): void {
    this.onDone = onDone;
    this.hits = 0;
    this.lastTapAt = -1;
    this.title.textContent = `${name} · ${statLabel}`;
    this.root.hidden = false;
    this.startMs = performance.now();
    this.placeZone();
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.frame);
  }

  private placeZone(): void {
    this.zoneStart = 0.1 + Math.random() * (0.9 - GYM.zone - 0.1);
    this.zone.style.left = `${this.zoneStart * 100}%`;
    this.zone.style.width = `${GYM.zone * 100}%`;
  }

  /** The marker sweeps back and forth once per sweep. */
  private position(now: number): number {
    const t = ((now - this.startMs) % (GYM.sweepMs * 2)) / GYM.sweepMs;
    return t <= 1 ? t : 2 - t;
  }

  private readonly frame = (now: number): void => {
    const elapsed = now - this.startMs;
    const left = Math.max(0, GYM.roundMs - elapsed);
    this.marker.style.left = `${this.position(now) * 100}%`;
    this.timeText.textContent = `${Math.ceil(left / 1000)}s`;
    this.hitsText.textContent = TEN_TEXT.gymHits(this.hits);
    if (left <= 0) {
      this.finish();
      return;
    }
    this.rafId = requestAnimationFrame(this.frame);
  };

  private tap(): void {
    if (this.root.hidden) return;
    const now = performance.now();
    if (now - this.lastTapAt < 180) return;
    this.lastTapAt = now;
    const p = this.position(now);
    const hit = p >= this.zoneStart && p <= this.zoneStart + GYM.zone;
    if (hit) {
      this.hits += 1;
      this.bar.classList.add('hit');
      setTimeout(() => this.bar.classList.remove('hit'), 120);
      this.placeZone();
    } else {
      this.bar.classList.add('miss');
      setTimeout(() => this.bar.classList.remove('miss'), 120);
    }
  }

  private finish(): void {
    cancelAnimationFrame(this.rafId);
    this.root.hidden = true;
    const done = this.onDone;
    this.onDone = null;
    done?.(this.hits);
  }
}
