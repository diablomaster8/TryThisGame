/**
 * R0472 (TECH-30): the long-press info card. A touch or pen held still on an item or a
 * villager names it and says what a tap does, beside the finger, for a couple of seconds.
 * Input fires the event (input/press-kind.ts); this reads the world and sends nothing.
 * It only touches the DOM when a card opens or closes, never per frame.
 */
import { SHOP_ITEMS, TRAINER_LABELS } from '../config/strings';
import { INSPECT_TEXT } from '../config/strings-r10d2';
import { INSPECT_CARD } from '../config/tuning-r10d2';
import type { Game } from '../game';
import { INSPECT_EVENT, type InspectDetail } from '../input/press-kind';
import type { World } from '../sim/types';

/** The card's two lines for a pressed thing, or null when it is gone. */
export function inspectLines(world: World, kind: string, id: string): [string, string] | null {
  if (kind === 'item') {
    const it = world.items.find((x) => x.id === id);
    if (!it) return null;
    const t = it.kind === 'notebook' ? INSPECT_TEXT.notebook : SHOP_ITEMS[it.kind];
    return [t.name, `${t.help} ${INSPECT_TEXT.tapItem}`];
  }
  if (kind === 'npc') {
    const n = world.npcs.find((x) => x.id === id);
    if (!n) return null;
    const t = TRAINER_LABELS[n.trainer];
    return t
      ? [t.name, `${t.blurb} ${INSPECT_TEXT.tapNpc}`]
      : [INSPECT_TEXT.visitor, INSPECT_TEXT.tapNpc];
  }
  return null;
}

export class PressInfo {
  private readonly root: HTMLDivElement;
  private readonly title: HTMLElement;
  private readonly body: HTMLElement;
  private timer = 0;

  constructor(parent: HTMLElement, game: () => Game | null) {
    this.root = document.createElement('div');
    this.root.className = 'press-info';
    this.root.hidden = true;
    this.root.setAttribute('role', 'status');
    this.title = document.createElement('strong');
    this.body = document.createElement('span');
    this.root.append(this.title, this.body);
    parent.appendChild(this.root);
    window.addEventListener(INSPECT_EVENT, (e) => {
      const d = (e as CustomEvent<InspectDetail>).detail;
      const g = game();
      const lines = g ? inspectLines(g.world, d.kind, d.id) : null;
      if (lines) this.show(lines, d.x, d.y);
    });
    window.addEventListener('pointerdown', () => this.hide(), { capture: true });
  }

  private show([name, help]: [string, string], x: number, y: number): void {
    this.title.textContent = name;
    this.body.textContent = help;
    const w = Math.min(INSPECT_CARD.widthPx, innerWidth - 16);
    this.root.style.width = `${w}px`;
    this.root.style.left = `${Math.round(Math.max(8, Math.min(innerWidth - w - 8, x - w / 2)))}px`;
    // Above the finger, so the hand does not cover it; below when there is no room.
    const above = y - INSPECT_CARD.liftPx;
    this.root.style.top = `${Math.round(above > 60 ? above : y + INSPECT_CARD.dropPx)}px`;
    this.root.hidden = false;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.hide(), INSPECT_CARD.showMs);
  }

  private hide(): void {
    if (this.root.hidden) return;
    window.clearTimeout(this.timer);
    this.root.hidden = true;
  }
}
