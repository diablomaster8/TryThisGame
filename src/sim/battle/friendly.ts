import { decodeNubbin } from '../share';
import type { SimEvent, World } from '../types';
import { combatantOf } from './derive';
import { onceOf } from './rewards';
import type { BattleContext, BattleState, Combatant } from './types';

/**
 * Pass-and-play friendly bouts (recs FIGHT-96): two Keepers on one device. The first plays
 * the slot's Nubbins in `ids`; the second plays up to three more of the slot's Nubbins
 * (`foeIds`), or a team loaded from share codes (`guests`), which is a read-only copy: it is
 * decoded into the bout's own combatants and never joins, or writes, the receiving world.
 * Each side picks its moves in turn (the screen hides the first side's picks while the
 * second chooses). No Shells, records or points: the only prize is a "Good game" sticker.
 */
export type FriendlyContext = Extract<BattleContext, { kind: 'friendly' }>;

export const FRIENDLY_STICKER = 'good-game';

/** The second Keeper's side: the slot's own Nubbins, else the share-code guests. */
export function friendlyFoes(world: World, c: FriendlyContext): Combatant[] {
  const ok = (id: string) =>
    world.nubbins.find(
      (n) => n.id === id && n.stage !== 'egg' && n.stage !== 'cocoon' && !c.ids.includes(n.id),
    );
  const slot = (c.foeIds ?? []).map(ok).filter((n): n is NonNullable<typeof n> => !!n);
  const guests = (c.guests ?? [])
    .map((code) => decodeNubbin(code))
    .filter((n): n is NonNullable<typeof n> => !!n && n.stage !== 'egg' && n.stage !== 'cocoon');
  const team = (slot.length ? slot : guests).slice(0, 3);
  // A guest is a copy: deep-cloned so nothing the bout derives can reach the decoded data.
  return team.map((n, i) => {
    const copy = JSON.parse(JSON.stringify(n)) as typeof n;
    const c1 = combatantOf(copy, world);
    return { ...c1, id: `foe-${i}`, side: 1, nubbinId: null, foeName: -1 };
  });
}

/** Pays a finished friendly bout: the sticker once, nothing else. */
export function settleFriendly(world: World, s: BattleState, events: SimEvent[]): void {
  if (s.context.kind !== 'friendly' || !s.result || s.settled) return;
  s.settled = true;
  const once = (world.battleOnce ??= onceOf(world));
  if (!once.keepsakes.includes(FRIENDLY_STICKER)) once.keepsakes.push(FRIENDLY_STICKER);
  events.push({
    kind: 'battleEnd',
    context: 'friendly',
    source: 'friendly',
    key: '',
    winner: s.result.winner,
    reason: s.result.reason,
    shells: 0,
  });
}
