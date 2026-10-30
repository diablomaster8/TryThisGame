import type { SimEvent, World } from '../types';
import { end, onField } from './damage';
import { grantRewards } from './rewards';

/**
 * Save and resume mid-battle (recs FIGHT-64). A turn bout lives in `world.battle` and a tactics
 * bout in `world.tactics`, both plain JSON, so the autosave keeps them; on load the HUD asks
 * "Resume the bout? / Call it a draw". Resuming starts again at the start of the current
 * turn's picks: any half-made choices are dropped, so a pick never lands twice. A draw ends
 * the bout with nobody winning and pays as a draw does.
 */

/** Whether a load found a bout still going (turn or tactics). */
export function openBout(world: World): 'turn' | 'tactics' | null {
  if (world.battle && !world.battle.result && world.battle.mode === 'turn') return 'turn';
  if (world.tactics && !world.tactics.result) return 'tactics';
  return null;
}

/** Back to the start of the turn's picks: the Keeper chooses again for every ally. */
export function resumeBattleCmd(world: World): void {
  const s = world.battle;
  if (!s || s.result || s.mode !== 'turn' || s.atb) return;
  if (s.phase !== 'choose') return;
  s.choices = {};
  if (s.passPlay) s.passPlay.choosing = 0;
  const first = s.sides[0].findIndex((c) => onField(s, c));
  if (first >= 0) s.active = first;
}

/** "Call it a draw": the open turn bout ends with no winner. */
export function drawBattleCmd(world: World, events: SimEvent[]): void {
  const s = world.battle;
  if (!s || s.result) return;
  end(s, { k: 'end', winner: null, reason: 'time' });
  grantRewards(world, s, events);
}

/**
 * While a bout is live (turn or tactics), its party's needs are held where they were when it
 * started (FIGHT-64, FIGHT-85): the Grove keeps running behind the bout, but a Nubbin mid-fight
 * neither starves nor tires. Runs every step, live and offline, so a closed game holds them too.
 */
export function holdBattleNeeds(world: World): void {
  const live =
    world.battle && !world.battle.result
      ? world.battle.context.kind === 'karate'
        ? [world.battle.context.nubbinId]
        : world.battle.context.ids
      : world.tactics && !world.tactics.result
        ? world.tactics.context.kind === 'karate'
          ? []
          : world.tactics.context.ids
        : null;
  if (!live || world.battle?.context.kind === 'world') {
    if (world.battleHeld) delete world.battleHeld;
    return;
  }
  const held = (world.battleHeld ??= {});
  for (const id of live) {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n) continue;
    const h = held[id];
    if (!h) held[id] = { hunger: n.needs.hunger, energy: n.needs.energy };
    else {
      n.needs.hunger = h.hunger;
      n.needs.energy = h.energy;
    }
  }
}
