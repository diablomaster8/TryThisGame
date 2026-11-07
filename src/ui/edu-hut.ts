import '../edu-desks.css';
import { EDU_HUT, EDU_HUT_TEXT } from '../config/edu-hut';
import type { Game } from '../game';
import { regionOf } from '../sim/regions';
import type { Nubbin, Vec2, World } from '../sim/types';
import { nubbinPortrait } from './battle-party-pick';
import { el } from './dom';

/** A spot and how close counts as "at it". */
export interface HutSpot {
  x: number;
  z: number;
  r: number;
}

/** The hut's door spot, from config. */
export const HUT_DOOR: HutSpot = { x: EDU_HUT.x, z: EDU_HUT.z, r: EDU_HUT.enterR };

/**
 * One look at the Keeper against the hut. `inside` is the new "at the door" state (with a
 * wider ring to leave than to enter, so standing on the edge does not flicker); `fire` is true
 * only on the look where the Keeper arrives from outside.
 */
export function hutEntered(
  keeper: Vec2,
  hut: HutSpot,
  wasInside: boolean,
): { inside: boolean; fire: boolean } {
  const d = Math.hypot(keeper.x - hut.x, keeper.z - hut.z);
  const inside = wasInside ? d <= hut.r + EDU_HUT.leaveExtra : d <= hut.r;
  return { inside, fire: inside && !wasInside };
}

export interface HutWatch {
  inside: boolean;
}

/**
 * One poll. Starts "inside" so a Keeper loaded or left standing at the door does not trigger;
 * it must walk away and back. Never fires in the main game (no `edu`), away from the Grove, or
 * while a panel or scene is open, and an arrival while busy is swallowed (the Keeper must
 * leave and return), so the picker never pops up when a dialog closes.
 */
export function hutStep(
  watch: HutWatch,
  world: Pick<World, 'edu' | 'keeper' | 'location'>,
  busy: boolean,
  hut: HutSpot = HUT_DOOR,
): boolean {
  if (!world.edu || regionOf(world.location) !== 'grove') {
    watch.inside = true;
    return false;
  }
  const r = hutEntered(world.keeper.pos, hut, watch.inside);
  watch.inside = r.inside;
  return r.fire && !busy;
}

/**
 * Who sits at a desk: the child's own Nubbin first (the first hatched one that is not the
 * campaign's guest, as the break card tucks in), then the others in roster order. At most
 * `max`; eggs and cocoons stay home.
 */
export function deskNubbins(
  world: Pick<World, 'nubbins' | 'campaign'>,
  max: number = EDU_HUT.maxDesks,
): Nubbin[] {
  const sable = world.campaign?.sableId;
  const hatched = world.nubbins.filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon');
  const own = hatched.find((n) => n.id !== sable);
  const rest = hatched.filter((n) => n !== own);
  return (own ? [own, ...rest] : rest).slice(0, max);
}

/** The desk row: each Nubbin's portrait over a little desk. Null if nobody has hatched. */
export function renderDesks(g: Game): HTMLElement | null {
  const who = deskNubbins(g.world);
  if (who.length === 0) return null;
  const row = el('div', 'edu-desks');
  row.setAttribute('role', 'img');
  row.setAttribute('aria-label', EDU_HUT_TEXT.desks);
  who.forEach((n, i) => {
    const desk = el('div', i === 0 ? 'edu-desk own' : 'edu-desk');
    const pic = nubbinPortrait(g, n);
    pic.classList.add('edu-desk-pupil');
    desk.append(pic, el('div', 'edu-desk-top'));
    row.appendChild(desk);
  });
  return row;
}

/**
 * Keep the desk row at the foot of the round card while a round is open. `edu.ts` rebuilds the
 * card's children every round, so this watches the card (children) and its screen (hidden) and
 * puts the row back; it is idempotent and takes the row away on the picker and the results.
 */
export function mountEduDesks(root: HTMLElement, game: () => Game | null): void {
  const card = root.querySelector<HTMLElement>('.edu > .edu-card');
  const screen = card?.parentElement;
  if (!card || !screen) return;
  let queued = false;
  const sync = (): void => {
    queued = false;
    const g = game();
    const existing = card.querySelector(':scope > .edu-desks');
    const inRound = !!g?.world.edu && !screen.hidden && !!card.querySelector('.edu-progress');
    if (!inRound) {
      existing?.remove();
      return;
    }
    if (existing || !g) return;
    const row = renderDesks(g);
    if (row) card.appendChild(row);
  };
  const queue = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sync);
  };
  const mo = new MutationObserver(queue);
  mo.observe(card, { childList: true });
  mo.observe(screen, { attributes: true, attributeFilter: ['hidden'] });
}

/**
 * Walk the Keeper to the Kindergarten hut's door in a Learning Grove and `open` the Play and
 * learn picker (R0742). In the main game (no `edu`) it never fires.
 */
export function mountEduHut(
  game: () => Game | null,
  opts: { open: () => void; busy: () => boolean },
): void {
  const watch: HutWatch = { inside: true };
  window.setInterval(() => {
    const g = game();
    if (!g) return;
    if (hutStep(watch, g.world, opts.busy())) opts.open();
  }, EDU_HUT.pollMs);
}
