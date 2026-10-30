/**
 * R0676 (KIDS-05): the "Show me" guide. For a pre-reader it points a bouncing hand at the
 * next thing to tap in the Grove (an egg, the Nubbin, a tree, a fruit), then at the right
 * button on the stats sheet, and says the step aloud. It reads the world and the renderer's
 * camera only, never changes either, and works the same in Pixel and Full 3D because both
 * project through `toScreen`. `guideTarget` is pure so the tests can follow it.
 */
import { EDU_GUIDE_PLANS } from '../config/edu';
import { GUIDE_TEXT } from '../config/strings-kids';
import { EDU_GUIDE } from '../config/tuning-kids';
import { NEEDS } from '../config/tuning';
import type { Game } from '../game';
import { PIXEL_VIEW, toScreen } from '../render/stage-api';
import { chapterDef } from '../sim/campaign';
import { textBandOf } from '../sim/story-scenes';
import type { Nubbin, Vec2, World } from '../sim/types';
import { el } from './dom';
import { speakLine } from './lesson';

export type GuideKind = keyof typeof GUIDE_TEXT.say;

export interface GuideTarget {
  kind: GuideKind;
  /** The world thing pointed at, or the Nubbin whose sheet button is pointed at. */
  id: string;
  /** World position for egg, nubbin, tree and fruit; absent for a sheet button. */
  pos?: Vec2;
}

const dist2 = (a: Vec2, b: Vec2) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2;

function nearest<T extends { pos: Vec2 }>(list: readonly T[], from: Vec2): T | undefined {
  let best: T | undefined;
  for (const t of list) if (!best || dist2(t.pos, from) < dist2(best.pos, from)) best = t;
  return best;
}

/** The Keeper's own Nubbins (Sable is a guest whose trust is a different lesson). */
function own(world: World): Nubbin[] {
  const sable = world.campaign?.sableId;
  return world.nubbins.filter((n) => n.id !== sable);
}

/** A Nubbin, or its sheet button once its sheet is the one open. */
function atNubbin(n: Nubbin, sheetFor: string | null, button: GuideKind): GuideTarget {
  return sheetFor === n.id ? { kind: button, id: n.id } : { kind: 'nubbin', id: n.id, pos: n.pos };
}

/**
 * The next thing to point at, or null when the guide has nothing to show. `sheetFor` is the
 * Nubbin whose stats sheet is open, if any. Before the story starts it follows hatch-and-pet.
 */
export function guideTarget(world: World, sheetFor: string | null): GuideTarget | null {
  const c = world.campaign;
  const goal = c && !c.storyline ? chapterDef(c.chapter)?.goal : undefined;
  const plan = goal ? EDU_GUIDE_PLANS[goal] : c ? undefined : 'hatch-pet';
  if (!plan) return null;
  const from = world.keeper.pos;
  const mine = own(world);
  const hatched = mine.filter((n) => n.stage === 'child' || n.stage === 'adult');
  if (plan === 'hatch-pet') {
    if ((c?.stats.hatched ?? 0) < 1 && hatched.length === 0) {
      const egg = nearest(
        mine.filter((n) => n.stage === 'egg'),
        from,
      );
      if (!egg) return null;
      // A shake only works on a held egg: Pick up first, then Shake.
      if (sheetFor !== egg.id) return { kind: 'egg', id: egg.id, pos: egg.pos };
      // A held egg hatches only once it is set down again.
      const held = world.keeper.carrying === egg.id;
      if (held && egg.hatchRemainingMs <= 0) return { kind: 'putdown', id: egg.id };
      return { kind: held ? 'shake' : 'pickup', id: egg.id };
    }
    // Before the story starts there is no pet count: a raised affection means a pet landed.
    const petted = c
      ? c.stats.pets >= 1
      : hatched.some((n) => n.needs.affection > NEEDS.affectionStart);
    if (petted) return null;
    const n = nearest(hatched, from);
    return n ? atNubbin(n, sheetFor, 'pet') : null;
  }
  const n = nearest(hatched, from);
  if (!n) return null;
  if (world.inventory.fruit > 0) return atNubbin(n, sheetFor, 'feed');
  const fruit = nearest(
    world.items.filter((i) => i.kind === 'fruit'),
    from,
  );
  if (fruit) return { kind: 'fruit', id: fruit.id, pos: fruit.pos };
  const tree = nearest(world.trees, from);
  return tree ? { kind: 'tree', id: tree.id, pos: tree.pos } : null;
}

/** A step's identity: the hand speaks again only when this changes. */
export function guideKey(t: GuideTarget | null): string {
  return t ? `${t.kind}:${t.id}` : '';
}

export class Guide {
  private readonly hand: HTMLDivElement;
  private until = 0;
  private lastKey = '';
  private progressKey = '';
  private progressAt = performance.now();
  private pulsed: HTMLElement | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly sheetFor: () => string | null,
  ) {
    this.hand = el('div', 'guide-hand', '👆');
    this.hand.hidden = true;
    this.hand.setAttribute('aria-hidden', 'true');
    parent.appendChild(this.hand);
  }

  /** "Show me": point now and say the step, or say the goal is somewhere else in the Grove. */
  show(): void {
    const g = this.game();
    if (!g) return;
    const t = guideTarget(g.world, this.sheetFor());
    this.until = performance.now() + EDU_GUIDE.showMs;
    this.lastKey = '';
    if (!t) speakLine(GUIDE_TEXT.nothing);
  }

  hide(): void {
    this.until = 0;
    this.hand.hidden = true;
    this.unpulse();
  }

  /** Per frame from the HUD; `busy` is anything covering the Grove. */
  update(busy: boolean): void {
    const g = this.game();
    const now = performance.now();
    if (!g?.world.edu || busy) {
      if (!this.hand.hidden || this.pulsed) {
        this.hand.hidden = true;
        this.unpulse();
      }
      return;
    }
    const t = guideTarget(g.world, this.sheetFor());
    const key = guideKey(t);
    // A sprout who has not moved on for a while gets the hand by itself.
    if (key !== this.progressKey) {
      this.progressKey = key;
      this.progressAt = now;
    } else if (
      t &&
      now > this.until &&
      textBandOf(g.world) === 'sprout' &&
      now - this.progressAt > EDU_GUIDE.idleMs
    ) {
      this.progressAt = now;
      this.until = now + EDU_GUIDE.showMs;
      this.lastKey = '';
    }
    if (!t || now > this.until) {
      this.hand.hidden = true;
      this.unpulse();
      return;
    }
    if (key !== this.lastKey) {
      // A new step keeps the hand up a while longer and says what to do.
      this.lastKey = key;
      this.until = Math.max(this.until, now + EDU_GUIDE.showMs);
      if (g.world.edu.readAloud) speakLine(GUIDE_TEXT.say[t.kind]);
    }
    this.point(g, t);
  }

  isShowing(): boolean {
    return !this.hand.hidden;
  }

  private point(g: Game, t: GuideTarget): void {
    if (!t.pos) {
      // A sheet button: pulse it and hold the hand under it.
      const b = document.querySelector<HTMLElement>(
        `[data-guide="${t.kind === 'putdown' ? 'pickup' : t.kind}"]`,
      );
      if (!b || b.hidden || b.offsetParent === null) {
        this.hand.hidden = true;
        return;
      }
      this.pulse(b);
      const r = b.getBoundingClientRect();
      this.place(r.left + r.width / 2, r.top + r.height);
      return;
    }
    this.unpulse();
    const lift = EDU_GUIDE.lift[t.kind as keyof typeof EDU_GUIDE.lift] ?? 0.5;
    const camera = g.scene3d?.camera ?? PIXEL_VIEW.camera;
    const p = toScreen(camera, t.pos.x, lift, t.pos.z);
    if (!p) {
      this.hand.hidden = true;
      return;
    }
    this.place(p.x, p.y);
  }

  /** The fingertip sits on the point; the hand hangs below it. */
  private place(x: number, y: number): void {
    this.hand.hidden = false;
    this.hand.style.left = `${Math.round(x - 20)}px`;
    this.hand.style.top = `${Math.round(y)}px`;
  }

  private pulse(b: HTMLElement): void {
    if (this.pulsed === b) return;
    this.unpulse();
    this.pulsed = b;
    b.classList.add('guide-pulse');
  }

  private unpulse(): void {
    this.pulsed?.classList.remove('guide-pulse');
    this.pulsed = null;
  }
}
