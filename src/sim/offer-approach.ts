import { C12C } from '../config/tuning-more/story-quest-markers';
import { STORY } from '../config/tuning';
import type { Quest } from '../content/types';
import { EXTRA_LOOKS } from './extra-looks';
import { offerSpawnAngle, spawnOfferGuest } from './scene-cast';
import { sideStory } from './story-scenes';
import type { Npc, QuestBook, Vec2, World } from './types';

/**
 * R0651 (CAMP-59): arrival beats. When a quest is offered, its giver walks up to the Keeper
 * (to about 2.5 units) before the card shows; the `!` marker over the giver (render/quest-
 * markers.ts) is the emote. One at a time; never while the Keeper carries or throws a Nubbin,
 * nor within `gapMs` of another offer; if the giver cannot come (not spawnable, or no room),
 * the card shows at once and the board carries the `!`. State is `questBook.approach`, which
 * the offer card reads to wait. Nothing here is rolled by chance, so no seeded rng is needed.
 */

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

/** The speaker who gives `quest`: its first person speaker (not a crowd, a voice or a Nubbin). */
export function offerGiver(quest: Quest): string | null {
  for (const s of quest.speakers) {
    if (STORY.guestSkip.includes(s.id) || s.id.startsWith('young-')) continue;
    // A Nubbin speaker gives only with a body of its own (the hooded pair of Q1).
    if (s.kind === 'nubbin' && !EXTRA_LOOKS[s.id]) continue;
    return s.id;
  }
  return null;
}

/** The giver's body in the Grove now (a valley Keeper, a visiting guest or an approaching one). */
export function giverNpc(world: World, quest: Quest): Npc | null {
  const who = offerGiver(quest);
  return who ? (world.npcs.find((n) => n.trainer === who) ?? null) : null;
}

function busyHands(world: World): boolean {
  return (
    world.keeper.carrying !== null ||
    world.nubbins.some(
      (n) =>
        n.behavior.state === 'held' ||
        n.behavior.state === 'thrown' ||
        n.behavior.state === 'carried',
    )
  );
}

/** Start the giver's walk for the offer just made, if the rules allow; else do nothing. */
export function beginApproach(world: World, book: QuestBook, id: string): boolean {
  const quest = sideStory(id);
  const now = world.timeMs;
  if (!quest || book.approach || world.location !== 'grove' || busyHands(world)) return false;
  if ((world.campaign?.queue.length ?? 0) > 0) return false;
  for (const [other, e] of Object.entries(book.entries))
    if (other !== id && now - e.offeredMs < C12C.approach.gapMs) return false;
  const who = offerGiver(quest);
  if (!who) return false;
  const k = world.keeper;
  let npc = giverNpc(world, quest);
  if (!npc) {
    const reach = C12C.approach.spawnAt;
    npc = spawnOfferGuest(
      world,
      who,
      offerSpawnAngle(world, reach, C12C.approach.viewAngle),
      reach,
    );
  }
  if (dist(npc.pos, k.pos) <= C12C.approach.arriveWithin) return false;
  // Aim short of the Keeper on the line from them to the giver.
  const d = dist(npc.pos, k.pos);
  const f = C12C.approach.stopAt / d;
  npc.target = { x: k.pos.x + (npc.pos.x - k.pos.x) * f, z: k.pos.z + (npc.pos.z - k.pos.z) * f };
  npc.waitMs = 0;
  book.approach = { quest: id, giver: npc.id, startMs: now };
  return true;
}

/**
 * Once a sim second: end the walk on arrival, on the timeout, or when the offer or place changed,
 * and send an offer guest home once its offer has been answered.
 */
export function stepApproach(world: World, book: QuestBook): void {
  const a = book.approach;
  if (a) {
    const npc = world.npcs.find((n) => n.id === a.giver);
    const live = book.offer?.quest === a.quest && world.location === 'grove' && !!npc;
    if (
      !live ||
      busyHands(world) ||
      dist(npc!.pos, world.keeper.pos) <= C12C.approach.arriveWithin ||
      world.timeMs - a.startMs >= C12C.approach.timeoutMs
    ) {
      delete book.approach;
      if (npc) {
        npc.target = null;
        npc.facing = Math.atan2(world.keeper.pos.x - npc.pos.x, world.keeper.pos.z - npc.pos.z);
      }
    }
  }
  // An offer guest stays while its offer is on the card and goes once it is answered.
  if (!book.approach && world.npcs.some((n) => n.id.startsWith('offer-'))) {
    const keep = book.offer ? sideStory(book.offer.quest) : undefined;
    const keepWho = keep ? offerGiver(keep) : null;
    world.npcs = world.npcs.filter((n) => !n.id.startsWith('offer-') || n.trainer === keepWho);
  }
}
