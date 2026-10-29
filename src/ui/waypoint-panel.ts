import '../dungeon.css';
import { ACTS, actStartDepth } from '../config/dungeon-acts';
import { ACT_TEXT, HOLLOW_TEXT } from '../config/strings-dungeon';
import { UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { actOpen } from '../sim/dungeon-acts';
import { hasWaypoint, levelIdOf } from '../sim/dungeon-levels';
import { HOLLOW_ZONE_TEXT } from '../config/strings';
import { button, el, modal } from './dom';

/**
 * The waypoint list (R0148, DUNG-08): every stone in the open acts, grouped by act, each with
 * a ◆ and a word for awake (✓) or not found yet (○), so colour is never the only signal.
 * Opened from the stone the Keeper stands on or from the cave mouth; a tap travels, with a
 * second of leaf-green sparkle (a plain fade under reduced motion).
 */
export class WaypointPanel {
  private readonly dialog;
  private readonly list: HTMLDivElement;
  private readonly sparkle: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, HOLLOW_TEXT.waypointsTitle, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', HOLLOW_TEXT.waypointsHelp));
    this.list = el('div', 'shop-list waypoint-list');
    this.dialog.body.appendChild(this.list);
    this.sparkle = el('div', 'waypoint-sparkle');
    this.sparkle.hidden = true;
    parent.appendChild(this.sparkle);
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  close(): void {
    this.dialog.hide();
  }

  open(): void {
    const w = this.game()?.world;
    if (!w) return;
    this.list.replaceChildren();
    const here = w.location === 'dungeon' && w.dungeon ? levelIdOf(w.dungeon) : null;
    const awake = w.hollow.waypoints;
    if (awake.length === 0) this.list.appendChild(el('p', 'help', HOLLOW_TEXT.waypointsNone));
    ACTS.forEach((act, i) => {
      if (!actOpen(w, i)) return;
      this.list.appendChild(el('h3', undefined, ACT_TEXT[act.id]?.name ?? act.id));
      // The camp and the fields first (R0152, R0147), then the act's levels.
      const ids: Array<[string, string]> = [
        [`${act.id}.town`, HOLLOW_ZONE_TEXT.townWaypoint],
        [`${act.id}.field`, HOLLOW_ZONE_TEXT.fieldWaypoint],
      ];
      for (let level = 1; level <= act.levels.length; level++)
        if (hasWaypoint(i, level))
          ids.push([
            levelIdOf({ act: i, depth: actStartDepth(i) + level - 1 }),
            HOLLOW_TEXT.waypointLevel(level),
          ]);
      for (const [id, label] of ids) {
        const on = awake.includes(id);
        const row = el('div', `shop-row waypoint-row${on ? ' awake' : ''}`);
        const info = el('div');
        const note =
          id === here
            ? HOLLOW_TEXT.waypointHere
            : on
              ? HOLLOW_TEXT.waypointAwake
              : HOLLOW_TEXT.waypointAsleep;
        info.append(el('strong', undefined, `◆ ${label}`), el('small', undefined, note));
        const go = button(HOLLOW_TEXT.portalGo, () => this.travel(id), 'btn btn-small btn-primary');
        go.textContent = '➜';
        go.setAttribute('aria-label', `${ACT_TEXT[act.id]?.name ?? ''} ${label}`);
        go.disabled = !on || id === here;
        row.append(info, go);
        this.list.appendChild(row);
      }
    });
    this.dialog.show();
  }

  private travel(id: string): void {
    const g = this.game();
    if (!g) return;
    this.close();
    this.sparkle.hidden = false;
    // Restart the animation each time.
    this.sparkle.classList.remove('on');
    void this.sparkle.offsetWidth;
    this.sparkle.classList.add('on');
    g.send({ kind: 'waypointTravel', id });
    window.setTimeout(() => (this.sparkle.hidden = true), 1000);
  }
}
