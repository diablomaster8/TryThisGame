/**
 * R0294 (FUN-05): the micro-games' screen. One overlay, one game at a time, one thumb, never
 * failable: a dropped stack re-stacks, a decoy is a joke, a missed catch rolls away and
 * another falls. Built so far: balance (carry and deliver), hunt (find and inspect) and
 * catch (collect). `onDone` runs once when the game is won or skipped; the caller then does
 * what the plain "Do it" button did. Rules and seeded setups are in `sim/micro.ts`.
 */
import { MICRO_TEXT } from '../../config/strings-fun-r5';
import { playSound } from '../../platform/audio';
import { balanceSetup, catchSetup, huntSetup, type MicroKind } from '../../sim/micro';
import { button, dialogFocus, el } from '../../ui/dom';
import '../../fun.css';

const HUNT_ICONS: Record<string, string> = {
  bush: '🌿',
  barrel: '🛢',
  crate: '📦',
  pot: '🏺',
  hay: '🌾',
  log: '🪵',
};
const STACK_ICONS = ['📦', '🍎', '🥧', '🎁', '🍐'];
const FALL_ICONS = ['🐚', '🍎', '✨', '🌰', '🍐'];

export class MicroScreen {
  private readonly root: HTMLDivElement;
  private readonly card: HTMLDivElement;
  private readonly title: HTMLHeadingElement;
  private readonly help: HTMLParagraphElement;
  private readonly stage: HTMLDivElement;
  private readonly status: HTMLParagraphElement;
  private readonly row: HTMLDivElement;
  private readonly focus: ReturnType<typeof dialogFocus>;
  private raf = 0;
  private done: (() => void) | null = null;
  private reduce = false;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'modal micro');
    this.root.hidden = true;
    this.card = el('div', 'modal-card micro-card');
    this.title = el('h2');
    this.help = el('p', 'help');
    this.stage = el('div', 'micro-stage');
    this.status = el('p', 'micro-status');
    this.status.setAttribute('aria-live', 'polite');
    this.row = el('div', 'micro-row');
    this.card.append(this.title, this.help, this.stage, this.status, this.row);
    this.root.append(this.card);
    this.focus = dialogFocus(this.root, this.card, this.title, () => this.finish());
    parent.append(this.root);
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  /** Play `kind`; `flavour` is the step's goal, shown as the dressing. */
  open(
    kind: MicroKind,
    flavour: string,
    seed: number,
    reduceMotion: boolean,
    onDone: () => void,
  ): void {
    this.done = onDone;
    this.reduce = reduceMotion;
    this.stage.textContent = '';
    this.status.textContent = flavour;
    this.row.replaceChildren(
      button(MICRO_TEXT.skip, () => this.finish(), 'btn btn-small micro-skip'),
    );
    this.root.hidden = false;
    this.focus.opened();
    if (kind === 'balance') this.balance(seed);
    else if (kind === 'hunt') this.hunt(seed);
    else this.catchGame(seed);
  }

  private win(text: string): void {
    cancelAnimationFrame(this.raf);
    playSound('win');
    this.status.textContent = text;
    this.row.replaceChildren(
      button(MICRO_TEXT.finish, () => this.finish(), 'btn btn-primary micro-go'),
    );
  }

  private finish(): void {
    cancelAnimationFrame(this.raf);
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.focus.closed();
    const d = this.done;
    this.done = null;
    d?.();
  }

  // ---------------------------------------------------------------- balance

  private balance(seed: number): void {
    const t = MICRO_TEXT.balance;
    const setup = balanceSetup(seed);
    this.title.textContent = t.title;
    this.help.textContent = t.help;
    const tray = el('div', 'micro-tray');
    const stack = el('div', 'micro-stack');
    for (let i = 0; i < setup.stack; i++)
      stack.append(el('span', 'micro-item', STACK_ICONS[i % STACK_ICONS.length]!));
    tray.append(stack);
    const bar = el('div', 'micro-bar');
    const fill = el('span');
    bar.append(fill);
    this.stage.append(tray, bar);
    let angle = 0;
    let drift = 0;
    let push = 0;
    let progress = 0;
    let fallenUntil = 0;
    let last = performance.now();
    const wobble = setup.wobble * (this.reduce ? 0.5 : 1);
    let dragX: number | null = null;
    this.stage.onpointerdown = (e) => {
      dragX = e.clientX;
      this.stage.setPointerCapture?.(e.pointerId);
    };
    this.stage.onpointermove = (e) => {
      if (dragX === null) return;
      push += (e.clientX - dragX) * 0.012;
      dragX = e.clientX;
    };
    this.stage.onpointerup = () => (dragX = null);
    this.stage.onpointercancel = () => (dragX = null);
    this.stage.tabIndex = 0;
    this.stage.onkeydown = (e) => {
      if (e.key === 'ArrowLeft') push -= 0.15;
      if (e.key === 'ArrowRight') push += 0.15;
    };
    let rng = seed * 9301 + 49297;
    const frame = (now: number): void => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (now < fallenUntil) {
        this.raf = requestAnimationFrame(frame);
        return;
      }
      stack.classList.remove('micro-fallen');
      // A slow random lean the player leans against.
      rng = (rng * 9301 + 49297) % 233280;
      drift += ((rng / 233280 - 0.5) * wobble - drift * 0.6) * dt * 3;
      angle += (drift + angle * 0.8) * dt - push;
      push = 0;
      if (Math.abs(angle) > 0.55) {
        playSound('plop');
        this.status.textContent = t.plop;
        stack.classList.add('micro-fallen');
        angle = 0;
        drift = 0;
        fallenUntil = now + 900;
      } else if (Math.abs(angle) < 0.3) progress += dt / 10;
      stack.style.transform = `rotate(${angle}rad)`;
      fill.style.width = `${Math.min(100, progress * 100)}%`;
      if (progress >= 1) {
        this.win(t.done);
        return;
      }
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- hunt

  private hunt(seed: number): void {
    const t = MICRO_TEXT.hunt;
    const setup = huntSetup(seed);
    this.title.textContent = t.title;
    this.help.textContent = t.help;
    const grid = el('div', 'micro-hunt');
    let found = 0;
    let decoy = seed % t.decoys.length;
    setup.things.forEach((thing, i) => {
      const b = button(
        HUNT_ICONS[thing] ?? '❓',
        () => {
          if (b.disabled) return;
          b.disabled = true;
          if (setup.hot.includes(i)) {
            found += 1;
            b.classList.add('micro-hot');
            b.textContent = '⭐';
            playSound('ding');
            this.status.textContent = t.found(found);
            if (found === 3) this.win(t.done);
          } else {
            b.classList.add('micro-decoy');
            playSound('boing');
            this.status.textContent = t.decoys[decoy % t.decoys.length]!;
            decoy += 1;
          }
        },
        'btn micro-spot',
      );
      b.setAttribute('aria-label', thing);
      grid.append(b);
    });
    this.stage.append(grid);
  }

  // ---------------------------------------------------------------- catch

  private catchGame(seed: number): void {
    const t = MICRO_TEXT.catch;
    const setup = catchSetup(seed);
    this.title.textContent = t.title;
    this.help.textContent = t.help;
    const field = el('div', 'micro-catch');
    const lanes: HTMLButtonElement[] = [];
    let basketLane = 1;
    for (let i = 0; i < 3; i++) {
      const lane = button(
        '',
        () => {
          basketLane = i;
          place();
        },
        'btn micro-lane',
      );
      lane.setAttribute('aria-label', `Lane ${i + 1}`);
      lanes.push(lane);
      field.append(lane);
    }
    const basket = el('span', 'micro-basket', '🧺');
    const fall = el('span', 'micro-fall', '');
    field.append(basket, fall);
    this.stage.append(field);
    const place = (): void => {
      basket.style.left = `${basketLane * 33.3 + 16.6}%`;
    };
    place();
    let caught = 0;
    let n = 0;
    let y = 0;
    let lane = setup.lanes[0]!;
    let last = performance.now();
    const speed = this.reduce ? 0.35 : 0.5;
    const drop = (): void => {
      lane = setup.lanes[n % setup.lanes.length]!;
      n += 1;
      y = 0;
      fall.textContent = FALL_ICONS[n % FALL_ICONS.length]!;
      fall.style.left = `${lane * 33.3 + 16.6}%`;
    };
    drop();
    const frame = (now: number): void => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      y += dt * speed;
      fall.style.top = `${y * 80}%`;
      if (y >= 1) {
        if (lane === basketLane) {
          caught += 1;
          playSound('pop');
          this.status.textContent = t.caught(caught);
          if (caught >= 5) {
            fall.textContent = '';
            this.win(t.done);
            return;
          }
        } else {
          playSound('bonk');
          this.status.textContent = t.miss;
        }
        drop();
      }
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }
}
