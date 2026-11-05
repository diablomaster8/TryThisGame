/**
 * Small HUD actions that start things: the Expedition, the beetle tank, the Grove cycle, and
 * place names (TECH-24: split out of hud.ts).
 */
import { UI } from '../config/tuning';
import { UI_TEXT, TRAINER_LABELS as TL } from '../config/strings';
import { WORLD_TEXT } from '../config/strings-world';
import type { Game } from '../game';
import type { GroveKind, Nubbin } from '../sim/types';
import type { ExpeditionScreen } from '../minigames/expedition/screen';
import type { TankScreen } from '../minigames/tank/screen';
import type { StatsSheet } from './stats-sheet';
import { nextTip } from './tips';

export interface ActionCtx {
  game: () => Game | null;
  pickRunner: () => Nubbin | null;
  toast: (text: string, ms?: number) => void;
  sheet: StatsSheet;
  expedition: ExpeditionScreen;
  tank: TankScreen;
}

/** A place name, including a neighbour's Grove. */
export function locationLabel(loc: string): string {
  if (loc.startsWith('visit:')) {
    const t = loc.slice('visit:'.length);
    return `${TL[t]?.name ?? t}’s Grove`;
  }
  // R11 lane D: a drawn region says its own name.
  if (loc.startsWith('region:'))
    return (WORLD_TEXT.regions as Record<string, string>)[loc.slice(7)] ?? loc;
  return (UI_TEXT.location as Record<string, string>)[loc] ?? loc;
}

export function startExpedition(c: ActionCtx): void {
  const { game, pickRunner, toast, sheet, expedition } = c;
  const g = game();
  if (!g || expedition.isOpen) return;
  const runner = pickRunner();
  if (!runner) {
    toast(UI_TEXT.expeditionNeedsNubbin, UI.toastLongMs);
    return;
  }
  sheet.close();
  g.renderPaused = true;
  // R0318: a tip while the stage loads.
  expedition.loadTip = nextTip(g.world);
  expedition.start(
    runner,
    g.view.sheets.forNubbin(runner),
    Date.now() % 2147483647,
    (rewards) => {
      g.renderPaused = false;
      g.send({ kind: 'addRewards', rewards });
    },
    g.world.location === 'hollow' || g.world.campaign?.chapter === 8 ? 'hollow' : 'meadow',
    g.graphics,
    g.scene3d,
  );
}

export function cycleGrove(game: () => Game | null): void {
  const g = game();
  if (!g) return;
  const order: GroveKind[] = ['main'];
  if (g.world.unlocks.sunGrove) order.push('sun');
  if (g.world.unlocks.moonGrove) order.push('moon');
  const i = order.indexOf(g.world.grove);
  g.send({ kind: 'setGrove', grove: order[(i + 1) % order.length] ?? 'main' });
}

export function startTank(c: ActionCtx): void {
  const { game, sheet, tank } = c;
  const g = game();
  if (!g || tank.isOpen) return;
  sheet.close();
  g.renderPaused = true;
  tank.start(Date.now() % 2147483647, (s) => {
    g.renderPaused = false;
    g.send({
      kind: 'tankResult',
      shells: s.cargo.shells,
      wood: s.cargo.wood,
      stone: s.cargo.stone,
      won: s.won,
    });
  });
}
