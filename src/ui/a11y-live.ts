/**
 * TECH-28: the Grove for a screen reader. A visually hidden live region says which Nubbin is
 * selected and how it is ("Pebble, child, happy, a little hungry"), and with the canvas
 * focused Tab and Shift+Tab step through the Nubbins and Enter opens the selected one's sheet.
 * It reads the world and sends only `select`, the same command a tap sends.
 *
 * TECH-72 (R0514): once Tab has picked a Nubbin (nearest the Keeper first), P pets, F feeds and
 * Space lifts or puts it down, the commands the sheet's buttons send; arrows walk the Keeper
 * with it. A ring marks the pick while the canvas has keyboard focus: a DOM overlay projected
 * through `toScreen`, so both renderers show it with no draw call. A pointer press on the
 * canvas leaves keyboard mode, so F (fullscreen) and Space (jump) keep working for the mouse.
 */
import { KB_CARE_TEXT } from '../config/strings-r10d2';
import { A11Y_TEXT } from '../config/strings-r9d3';
import { UI } from '../config/tuning';
import { careKey } from '../input/keys';
import { PIXEL_VIEW, toScreen } from '../render/stage-api';
import { STAGE_LABELS } from '../config/strings';
import { NEEDS } from '../config/tuning';
import { A11Y_SUMMARY } from '../config/tuning-r9d3';
import type { Game } from '../game';
import type { Nubbin, World } from '../sim/types';

/** One short spoken line for a Nubbin: name, stage, mood, and any pressing need. */
export function selectionSummary(n: Nubbin): string {
  const parts: string[] = [n.name, STAGE_LABELS[n.stage].toLowerCase()];
  if (n.stage === 'egg') {
    if (n.hatchRemainingMs <= 0) parts.push(A11Y_TEXT.ready);
    return parts.join(', ');
  }
  const h = n.needs.happiness;
  const m = A11Y_TEXT.mood;
  parts.push(
    h >= A11Y_SUMMARY.happyFrom
      ? m.happy
      : h >= 0
        ? m.content
        : h > A11Y_SUMMARY.glumAbove
          ? m.glum
          : m.sad,
  );
  if (n.needs.hunger <= NEEDS.starvingThreshold) parts.push(A11Y_TEXT.starving);
  else if (n.needs.hunger <= NEEDS.hungryThreshold) parts.push(A11Y_TEXT.hungry);
  if (n.needs.energy < A11Y_SUMMARY.sleepyBelow) parts.push(A11Y_TEXT.sleepy);
  return parts.join(', ');
}

/** The Nubbin Tab (or Shift+Tab) moves to, or null to let focus leave the canvas. */
export function cycleNubbin(world: World, back: boolean): string | null {
  const list = nearestFirst(world);
  if (list.length === 0) return null;
  const at = list.findIndex((n) => n.id === world.selected);
  if (at < 0) return (back ? list[list.length - 1] : list[0])?.id ?? null;
  const next = at + (back ? -1 : 1);
  return list[next]?.id ?? null;
}

/** The Nubbins by distance from the Keeper (list order breaks ties, or without a Keeper). */
export function nearestFirst(world: World): Nubbin[] {
  const k = world.keeper?.pos;
  if (!k) return world.nubbins;
  const d = (n: Nubbin) => (n.pos.x - k.x) ** 2 + (n.pos.z - k.z) ** 2;
  return world.nubbins
    .map((n, i) => ({ n, i, d: d(n) }))
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .map((e) => e.n);
}

export class SelectionLive {
  private readonly region: HTMLDivElement;
  private said = '';
  /** Tab picked the selection; a pointer press on the canvas clears it. */
  private keyboard = false;
  private readonly ring: HTMLDivElement;
  private ringAt = '';
  private readonly canvas: HTMLElement | null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    openSheet: (id: string) => void,
  ) {
    this.region = document.createElement('div');
    this.region.className = 'sr-only sel-live';
    this.region.setAttribute('aria-live', 'polite');
    this.region.setAttribute('aria-atomic', 'true');
    parent.appendChild(this.region);
    this.ring = document.createElement('div');
    this.ring.className = 'kb-ring';
    this.ring.hidden = true;
    parent.appendChild(this.ring);
    const canvas = document.getElementById('game');
    this.canvas = canvas;
    if (!canvas) return;
    if (!canvas.hasAttribute('tabindex')) canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', KB_CARE_TEXT.canvas);
    canvas.addEventListener('pointerdown', () => (this.keyboard = false));
    canvas.addEventListener('keydown', (e) => {
      const g = this.game();
      if (!g || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Tab') {
        const id = cycleNubbin(g.world, e.shiftKey);
        if (!id) return;
        e.preventDefault();
        this.keyboard = true;
        g.send({ kind: 'select', id });
      } else if (this.keyboard && g.world.selected && this.care(g, e)) {
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === 'Enter' && g.world.selected) {
        // Enter is also a jump key; on the focused canvas it opens the sheet instead.
        e.preventDefault();
        e.stopPropagation();
        openSheet(g.world.selected);
      }
    });
  }

  /** TECH-72: a care key on the picked Nubbin; true when the key was used. */
  private care(g: Game, e: KeyboardEvent): boolean {
    const what = careKey(e);
    const n = g.world.nubbins.find((x) => x.id === g.world.selected);
    if (!what || !n) return false;
    let say: string;
    if (what === 'pet') {
      g.send({ kind: 'pet', nubbinId: n.id });
      say = KB_CARE_TEXT.petted(n.name);
    } else if (what === 'lift') {
      const held = g.world.keeper.carrying === n.id;
      g.send(held ? { kind: 'putDown' } : { kind: 'pickUp', nubbinId: n.id });
      say = held ? KB_CARE_TEXT.putDown(n.name) : KB_CARE_TEXT.lifted(n.name);
    } else if (n.stage === 'egg') say = KB_CARE_TEXT.egg;
    else if (n.needs.hunger >= UI.feedFullAt) say = KB_CARE_TEXT.full(n.name);
    else if (g.world.inventory.fruit <= 0) say = KB_CARE_TEXT.noFruit;
    else {
      g.send({ kind: 'feed', nubbinId: n.id });
      say = KB_CARE_TEXT.fed(n.name);
    }
    this.region.textContent = say;
    return true;
  }

  /** Per frame; touches the DOM only when the spoken line or the ring's place changes. */
  update(world: World, g?: Game, busy = false): void {
    this.placeRing(world, g, busy);
    const n = world.selected ? world.nubbins.find((x) => x.id === world.selected) : undefined;
    const line = n ? selectionSummary(n) : '';
    if (line === this.said) return;
    this.said = line;
    this.region.textContent = line;
  }

  private placeRing(world: World, g: Game | undefined, busy: boolean): void {
    // A keyboard player whose focus fell to the page (a story line or panel closed) gets the
    // canvas back, so Tab and the care keys keep working without a mouse. No write otherwise.
    if (
      this.keyboard &&
      !busy &&
      document.activeElement === document.body &&
      !document.documentElement.classList.contains('dialogue-open')
    )
      this.canvas?.focus({ preventScroll: true });
    const n =
      g && !busy && this.keyboard && document.activeElement === this.canvas && world.selected
        ? world.nubbins.find((x) => x.id === world.selected)
        : undefined;
    const p = n ? toScreen(g?.scene3d?.camera ?? PIXEL_VIEW.camera, n.pos.x, n.y, n.pos.z) : null;
    if (!p) {
      if (!this.ring.hidden) this.ring.hidden = true;
      this.ringAt = '';
      return;
    }
    const at = `${Math.round(p.x)},${Math.round(p.y)}`;
    if (at !== this.ringAt) {
      this.ringAt = at;
      this.ring.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)`;
    }
    if (this.ring.hidden) this.ring.hidden = false;
  }
}
