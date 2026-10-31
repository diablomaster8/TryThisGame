/**
 * Lane B round 9, helper c: the one per-step hook `stepDungeon` calls after the party has
 * moved. It runs the party's personality moments (R0167), the hired friend (R0181) and the act
 * quests (R0166), and keeps the lifetime list of secret rooms found (R0165's Journal row).
 *
 * Pure sim: no DOM.
 */
import type { Floor } from './dungeon';
import { stepFriend } from './dungeon-friends';
import { levelIdOf } from './dungeon-levels';
import { stepMoods } from './dungeon-moods';
import { stepActQuests } from './dungeon-quests';
import type { DungeonRun, Nubbin, SimEvent, World } from './types';

/** How many found secret rooms the Journal remembers (oldest out). */
const SECRETS_KEPT = 200;

export function stepRoundNineC(
  world: World,
  run: DungeonRun,
  f: Floor,
  dtMs: number,
  events: SimEvent[],
): void {
  const party = run.party
    .map((id) => world.nubbins.find((n) => n.id === id))
    .filter((n): n is Nubbin => !!n && n.stage !== 'egg' && n.stage !== 'cocoon');
  const fresh: SimEvent[] = [];
  stepMoods(world, run, party, dtMs, events, fresh);
  stepFriend(world, run, f, party, dtMs, fresh);
  stepActQuests(world, run, f, fresh);
  for (const e of events)
    if (e.kind === 'hollowSecret' && e.how !== 'wiggle') {
      const id = `${levelIdOf(run)}:${e.id}`;
      const list = (world.hollow.secrets ??= []);
      if (!list.includes(id)) list.push(id);
      if (list.length > SECRETS_KEPT) list.shift();
    }
  events.push(...fresh);
}
