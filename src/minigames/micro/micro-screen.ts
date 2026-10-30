/**
 * R0294 (FUN-05): the micro-games' screen. One overlay, one game at a time, one thumb, never
 * failable: a dropped stack re-stacks, a decoy is a joke, a missed catch rolls away and
 * another falls. Eight games: balance (carry), hunt (find), catch (collect), and since round
 * 6 escort, climb, puzzle, survive and explore, whose misses are slapstick and never a loss. `onDone` runs once when the game is won or skipped; the caller then does
 * what the plain "Do it" button did. Rules and seeded setups are in `sim/micro.ts`.
 */
import { MICRO_TEXT } from '../../config/strings-fun-r5';
import { MICRO6_TEXT } from '../../config/strings-fun-r6';
import { playSound } from '../../platform/audio';
import {
  balanceSetup,
  catchSetup,
  climbSetup,
  escortSetup,
  exploreSetup,
  huntSetup,
  puzzleSetup,
  surviveSetup,
  type MicroKind,
} from '../../sim/micro';
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
    else if (kind === 'escort') this.escort(seed);
    else if (kind === 'climb') this.climb(seed);
    else if (kind === 'puzzle') this.puzzle(seed);
    else if (kind === 'survive') this.survive(seed);
    else if (kind === 'explore') this.explore(seed);
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

  // ---------------------------------------------------------------- escort

  private escort(seed: number): void {
    const t = MICRO6_TEXT.escort;
    const setup = escortSetup(seed);
    this.title.textContent = t.title;
    this.help.textContent = t.help;
    const path = el('div', 'micro-path');
    const walker = el('span', 'micro-walker', '🐣');
    const flag = el('span', 'micro-flag', '🏁');
    path.append(walker, flag);
    const bar = el('div', 'micro-bar');
    const fill = el('span');
    bar.append(fill);
    let pos = 0;
    let stopped = -1;
    let next = 0;
    let last = performance.now();
    const call = button(
      t.call,
      () => {
        if (stopped < 0) return;
        stopped = -1;
        playSound('pop');
        this.status.textContent = t.walking;
        call.disabled = true;
      },
      'btn btn-primary micro-call',
    );
    call.disabled = true;
    this.stage.append(path, bar, call);
    const speed = this.reduce ? 0.07 : 0.09;
    const frame = (now: number): void => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (stopped < 0) {
        pos += dt * speed;
        if (next < setup.stops.length && pos >= setup.stops[next]!) {
          stopped = next;
          next += 1;
          playSound('boing');
          this.status.textContent = t.stops[(seed + stopped) % t.stops.length]!;
          call.disabled = false;
          call.focus();
        }
      }
      walker.style.left = `${Math.min(1, pos) * 85}%`;
      fill.style.width = `${Math.min(100, pos * 100)}%`;
      if (pos >= 1) {
        call.remove();
        this.win(t.done);
        return;
      }
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- climb

  private climb(seed: number): void {
    const t = MICRO6_TEXT.climb;
    const setup = climbSetup(seed);
    this.title.textContent = t.title;
    this.help.textContent = t.help;
    const wall = el('div', 'micro-wall');
    const climber = el('span', 'micro-climber', '🐣');
    const ring = el('span', 'micro-ring');
    wall.append(climber);
    let height = 0;
    const start = performance.now();
    const beat = setup.beatMs * (this.reduce ? 1.3 : 1);
    // The ring is "gold" in the middle 40% of each beat: generous for one thumb.
    const inWindow = (now: number): boolean => {
      const phase = ((now - start) % beat) / beat;
      return phase > 0.3 && phase < 0.7;
    };
    const place = (): void => {
      climber.style.bottom = `${(height / setup.steps) * 80}%`;
    };
    const tap = button(
      t.tap,
      () => {
        if (height >= setup.steps) return;
        if (inWindow(performance.now())) {
          height += 1;
          playSound('hop');
          this.status.textContent = t.step(height, setup.steps);
          if (height >= setup.steps) {
            place();
            tap.remove();
            ring.remove();
            this.win(t.done);
            return;
          }
        } else if (height > 0) {
          height -= 1;
          playSound('slideDown');
          this.status.textContent = t.slip;
        } else playSound('boing');
        place();
      },
      'btn btn-primary micro-call',
    );
    this.stage.append(wall, ring, tap);
    place();
    const frame = (now: number): void => {
      ring.classList.toggle('micro-ring-on', inWindow(now));
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- puzzle

  private puzzle(seed: number): void {
    const t = MICRO6_TEXT.puzzle;
    const setup = puzzleSetup(seed);
    this.title.textContent = t.title;
    this.help.textContent = t.help;
    const slots = el('div', 'micro-slots');
    const tray = el('div', 'micro-pieces');
    let held: number | null = null;
    let placed = 0;
    const pieceBtns: HTMLButtonElement[] = [];
    for (let i = 0; i < setup.pieces; i++) {
      const slot = button(
        String(i + 1),
        () => {
          if (held === null || slot.disabled) return;
          const piece = pieceBtns[held]!;
          piece.classList.remove('micro-held');
          if (held === i) {
            slot.disabled = true;
            slot.classList.add('micro-hot');
            slot.textContent = `🧩${i + 1}`;
            piece.remove();
            placed += 1;
            playSound('pat');
            this.status.textContent = t.placed(placed, setup.pieces);
            if (placed === setup.pieces) this.win(t.done);
          } else {
            playSound('boing');
            this.status.textContent = t.wrong;
          }
          held = null;
        },
        'btn micro-slot',
      );
      slot.setAttribute('aria-label', `Slot ${i + 1}`);
      slots.append(slot);
    }
    for (const n of setup.order) {
      const piece = button(
        `🧩${n + 1}`,
        () => {
          for (const p of pieceBtns) p.classList.remove('micro-held');
          held = n;
          piece.classList.add('micro-held');
          playSound('tap');
        },
        'btn micro-piece',
      );
      piece.setAttribute('aria-label', `Piece ${n + 1}`);
      pieceBtns[n] = piece;
      tray.append(piece);
    }
    this.stage.append(slots, tray);
  }

  // ---------------------------------------------------------------- survive

  private survive(seed: number): void {
    const t = MICRO6_TEXT.survive;
    const setup = surviveSetup(seed);
    this.title.textContent = t.title;
    this.help.textContent = t.help;
    const ring = el('div', 'micro-ring-fight');
    const foe = el('span', 'micro-foe', '🥊');
    const me = el('span', 'micro-me', '🐣');
    ring.append(foe, me);
    const guards = el('div', 'micro-guards');
    let round = 0;
    let swing = 0;
    const show = (): void => {
      const side = setup.swings[round]![swing]!;
      foe.dataset.side = String(side);
      this.status.textContent = `${t.round(round + 1)} ${t.swing[side]}`;
    };
    t.guards.forEach((g, i) => {
      guards.append(
        button(
          g,
          () => {
            if (round >= 3) return;
            const side = setup.swings[round]![swing]!;
            const ok = side === i;
            playSound(ok ? 'pat' : 'bonk');
            me.classList.toggle('micro-wobble', !ok && !this.reduce);
            swing += 1;
            if (swing === 3) {
              swing = 0;
              round += 1;
            }
            if (round >= 3) {
              guards.remove();
              this.win(t.done);
              return;
            }
            show();
            this.status.textContent = `${ok ? t.blocked : t.bonk} ${this.status.textContent}`;
          },
          'btn micro-guard',
        ),
      );
    });
    this.stage.append(ring, guards);
    show();
  }

  // ---------------------------------------------------------------- explore

  private explore(seed: number): void {
    const t = MICRO6_TEXT.explore;
    const setup = exploreSetup(seed);
    this.title.textContent = t.title;
    this.help.textContent = t.help;
    const grid = el('div', 'micro-field');
    let at: [number, number] = [...setup.start];
    let silly = seed % t.sillies.length;
    const cells: HTMLButtonElement[] = [];
    const draw = (): void => {
      cells.forEach((c, i) => {
        const x = i % 5;
        const y = Math.floor(i / 5);
        const here = x === at[0] && y === at[1];
        const goal = x === setup.goal[0] && y === setup.goal[1];
        c.textContent = here ? '🐣' : goal ? '✕' : '';
        c.classList.toggle('micro-near', Math.abs(x - at[0]) + Math.abs(y - at[1]) === 1);
      });
    };
    for (let i = 0; i < 25; i++) {
      const x = i % 5;
      const y = Math.floor(i / 5);
      const c = button(
        '',
        () => {
          if (Math.abs(x - at[0]) + Math.abs(y - at[1]) !== 1) {
            playSound('boing');
            return;
          }
          at = [x, y];
          playSound('stepStone');
          draw();
          if (x === setup.goal[0] && y === setup.goal[1]) {
            this.win(t.done);
            for (const b of cells) b.disabled = true;
            return;
          }
          // Every third step finds something on the way: the walk is the joke, not a test.
          if ((x + y + seed) % 3 === 0) {
            this.status.textContent = t.sillies[silly % t.sillies.length]!;
            silly += 1;
          }
        },
        'btn micro-cell',
      );
      c.setAttribute('aria-label', `Square ${x + 1}, ${y + 1}`);
      cells.push(c);
      grid.append(c);
    }
    this.stage.append(grid);
    draw();
  }
}
