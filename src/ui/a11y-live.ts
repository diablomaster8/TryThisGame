/**
 * TECH-28: the Grove for a screen reader. A visually hidden live region says which Nubbin is
 * selected and how it is ("Pebble, child, happy, a little hungry"), and with the canvas
 * focused Tab and Shift+Tab step through the Nubbins and Enter opens the selected one's sheet.
 * It reads the world and sends only `select`, the same command a tap sends.
 */
import { A11Y_TEXT } from '../config/strings-r9d3';
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
  const list = world.nubbins;
  if (list.length === 0) return null;
  const at = list.findIndex((n) => n.id === world.selected);
  if (at < 0) return (back ? list[list.length - 1] : list[0])?.id ?? null;
  const next = at + (back ? -1 : 1);
  return list[next]?.id ?? null;
}

export class SelectionLive {
  private readonly region: HTMLDivElement;
  private said = '';

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    openSheet: (id: string) => void,
  ) {
    this.region = document.createElement('div');
    this.region.className = 'sr-only';
    this.region.setAttribute('aria-live', 'polite');
    this.region.setAttribute('aria-atomic', 'true');
    parent.appendChild(this.region);
    const canvas = document.getElementById('game');
    if (!canvas) return;
    if (!canvas.hasAttribute('tabindex')) canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', A11Y_TEXT.canvas);
    canvas.addEventListener('keydown', (e) => {
      const g = this.game();
      if (!g || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Tab') {
        const id = cycleNubbin(g.world, e.shiftKey);
        if (!id) return;
        e.preventDefault();
        g.send({ kind: 'select', id });
      } else if (e.key === 'Enter' && g.world.selected) {
        // Enter is also a jump key; on the focused canvas it opens the sheet instead.
        e.preventDefault();
        e.stopPropagation();
        openSheet(g.world.selected);
      }
    });
  }

  /** Per frame; touches the DOM only when the spoken line changes. */
  update(world: World): void {
    const n = world.selected ? world.nubbins.find((x) => x.id === world.selected) : undefined;
    const line = n ? selectionSummary(n) : '';
    if (line === this.said) return;
    this.said = line;
    this.region.textContent = line;
  }
}
