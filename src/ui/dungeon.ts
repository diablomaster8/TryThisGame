import { ACTS } from '../config/dungeon-acts';
import { ACT_TEXT, DUNGEON_TEXT, HOLLOW_TEXT, UI_TEXT } from '../config/strings';
import { actOpen } from '../sim/dungeon-acts';
import type { Game } from '../game';
import { partyPreview } from '../sim/dungeon';
import type { World } from '../sim/types';
import { button, el, modal } from './dom';
import { HollowMap } from './hollow-map';

/**
 * The Hollow Below: the menu at the cave mouth (today's shared cave or a fresh one,
 * who comes along, the best depth so far) and the bar shown underground (floor, haul,
 * and the way home).
 */
export class DungeonMenu {
  private readonly dialog;
  private readonly info: HTMLDivElement;
  private readonly bar: HTMLDivElement;
  private readonly barText: HTMLSpanElement;
  private readonly map: HollowMap;
  private readonly acts: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, DUNGEON_TEXT.title, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', DUNGEON_TEXT.help));
    this.info = el('div', 'shop-note');
    this.dialog.body.appendChild(this.info);
    const list = el('div', 'shop-list');
    for (const [label, help, daily] of [
      [DUNGEON_TEXT.today, DUNGEON_TEXT.todayHelp, true],
      [DUNGEON_TEXT.fresh, DUNGEON_TEXT.freshHelp, false],
    ] as const) {
      const row = el('div', 'shop-row');
      const text = el('div');
      text.append(el('strong', undefined, label), el('small', undefined, help));
      row.append(
        text,
        button(DUNGEON_TEXT.go, () => this.enter(daily), 'btn btn-small btn-primary'),
      );
      list.appendChild(row);
    }
    this.dialog.body.appendChild(list);
    // The five acts (R0145): each opens once the boss above it is beaten.
    this.dialog.body.appendChild(el('h3', undefined, HOLLOW_TEXT.actsTitle));
    this.acts = el('div', 'shop-list');
    this.dialog.body.appendChild(this.acts);

    this.bar = el('div', 'hollow-bar');
    this.bar.hidden = true;
    this.barText = el('span');
    this.bar.append(
      this.barText,
      button(
        DUNGEON_TEXT.leave,
        () => this.game()?.send({ kind: 'leaveDungeon' }),
        'btn btn-small',
      ),
    );
    // The minimap: its button sits in the bar, its panel is the bar's last row.
    this.map = new HollowMap(this.bar);
    this.bar.insertBefore(this.map.toggle, this.map.panel);
    parent.appendChild(this.bar);
  }

  open(): void {
    const g = this.game();
    if (!g) return;
    if (g.world.location !== 'grove') return;
    const names = partyPreview(g.world);
    this.info.textContent = `${DUNGEON_TEXT.best(g.world.hollow.best, g.world.hollow.runs)} · ${DUNGEON_TEXT.party(names)}`;
    this.listActs(g.world);
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  /** Called every frame by the HUD: the underground bar follows the run. */
  refresh(world: World): void {
    const run = world.location === 'dungeon' ? world.dungeon : null;
    this.bar.hidden = !run;
    // The overlay map turns with the camera (R0154).
    this.map.refresh(world, this.game()?.camera.currentYaw ?? 0);
    if (!run) return;
    this.barText.textContent = `${DUNGEON_TEXT.floor(run.depth)} · ${DUNGEON_TEXT.haul(run.haul.shells, run.haul.items)}`;
  }

  private listActs(world: World): void {
    this.acts.replaceChildren();
    ACTS.forEach((act, i) => {
      const text = ACT_TEXT[act.id]!;
      const open = actOpen(world, i);
      const beaten = world.hollow.acts[i]?.bossDefeated === true;
      const row = el('div', 'shop-row');
      const info = el('div');
      const note = !open ? HOLLOW_TEXT.actLocked : beaten ? HOLLOW_TEXT.actCleared : text.blurb;
      info.append(el('strong', undefined, text.name), el('small', undefined, note));
      const go = button(
        DUNGEON_TEXT.go,
        () => {
          this.close();
          this.game()?.send({ kind: 'enterAct', act: i });
        },
        'btn btn-small btn-primary',
      );
      go.disabled = !open;
      row.append(info, go);
      this.acts.appendChild(row);
    });
  }

  private enter(daily: boolean): void {
    const g = this.game();
    if (!g) return;
    this.close();
    g.send({ kind: 'enterDungeon', daily });
  }
}
