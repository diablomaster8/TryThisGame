import { SPEAKERS } from '../config/story';
import { STORY } from '../config/tuning';
import { clampToWorld } from './behavior';
import { walkPath } from './nav';
import { heightAt } from './height';
import { spawnNpc } from './npcs';
import { resolve } from './obstacles';
import { sceneById, sideStory } from './story-scenes';
import { sceneOwner } from './story-state';
import { TRAINERS } from './trainers';
import type { CampaignState, Npc, Season, Vec2, World } from './types';

/**
 * Who stands in the Grove while Hazel's Grove plays (review 2026-10-24, item 3), and the
 * season it is. Every one of the ten valley Keepers is always there, the one the player
 * picked included: the player is Hazel's grandchild, not that Keeper. A scene's other
 * speakers who come to the Grove in person (Corvin at the gate, a side story's visitor, a
 * fun quest's guest, Ori or Hana) get a body beside the Keeper while their scene is queued
 * and leave once it has played. Renderers read `world.npcs`; a guest has `guest: true` and
 * its speaker id as `trainer`.
 */

/** The Grove's season for this chapter of Hazel's Grove (item 2): the script's own. */
export function campaignSeason(c: CampaignState): Season {
  if (c.chapter > STORY.chapterSeasons.length) return STORY.postGameSeason;
  return STORY.chapterSeasons[Math.max(1, c.chapter) - 1] ?? STORY.postGameSeason;
}

/** All ten valley Keepers, always (an old save, or one that skipped the player's own). */
export function ensureTrainers(world: World): void {
  for (const t of TRAINERS) {
    if (!world.npcs.some((n) => n.trainer === t.id && !n.guest)) spawnNpc(world, t.id);
  }
}

/** The speakers of scene `id` who need a body for it: people, not yet in the Grove. */
export function sceneGuests(world: World, id: string): string[] {
  const scene = sceneById(id);
  if (!scene) return [];
  const quest = sideStory(sceneOwner(id));
  const lines = [...scene.lines, ...(scene.choices ?? []).flatMap((ch) => ch.then ?? [])];
  const out: string[] = [];
  for (const { who } of lines) {
    if (out.includes(who) || STORY.guestSkip.includes(who) || who.startsWith('young-')) continue;
    if (TRAINERS.some((t) => t.id === who)) continue;
    const kind = quest?.speakers.find((s) => s.id === who)?.kind ?? SPEAKERS[who]?.kind;
    if (kind !== 'keeper' && kind !== 'other') continue;
    if (world.npcs.some((n) => n.trainer === who && !n.guest)) continue;
    out.push(who);
    if (out.length >= STORY.guestMax) break;
  }
  return out;
}

/**
 * Bring the queued scene's guests in beside the Keeper and send the last scene's away.
 * Nobody is brought into the Hollow Below, where scenes wait (item 4).
 */
export function syncSceneGuests(world: World, c: CampaignState): void {
  const head = c.queue[0];
  const wanted = head && world.location !== 'dungeon' ? sceneGuests(world, head) : [];
  // R0651: an offer's giver (`offer-<who>`) stays until the offer is answered (offer-approach.ts).
  const stale = (n: Npc): boolean =>
    !!n.guest && !n.id.startsWith('offer-') && !wanted.includes(n.trainer);
  if (world.npcs.some(stale)) world.npcs = world.npcs.filter((n) => !stale(n));
  const k = world.keeper;
  wanted.forEach((who, i) => {
    if (world.npcs.some((n) => n.trainer === who)) return;
    // A small arc in front of the Keeper, facing them.
    const a = k.facing + (i - (wanted.length - 1) / 2) * (STORY.guestSpread / STORY.guestReach);
    const pos = {
      x: k.pos.x + Math.sin(a) * STORY.guestReach,
      z: k.pos.z + Math.cos(a) * STORY.guestReach,
    };
    clampToWorld(pos);
    resolve(pos, world);
    const npc: Npc = spawnNpc(world, who);
    npc.id = `guest-${who}`;
    npc.pos = pos;
    npc.home = { ...pos };
    npc.facing = Math.atan2(k.pos.x - pos.x, k.pos.z - pos.z);
    npc.target = null;
    npc.guest = true;
  });
}

/**
 * R0651: a quest giver who is not in the Grove yet, brought in `reach` units from the Keeper in
 * direction `angle`, as a guest (`offer-<who>`) that walks up to them. `syncSceneGuests` leaves
 * it alone until the offer is answered.
 */
export function spawnOfferGuest(world: World, who: string, angle: number, reach: number): Npc {
  const k = world.keeper;
  const pos = guestSpot(world, angle, reach);
  const npc: Npc = spawnNpc(world, who);
  npc.id = `offer-${who}`;
  npc.pos = pos;
  npc.home = { ...pos };
  npc.facing = Math.atan2(k.pos.x - pos.x, k.pos.z - pos.z);
  npc.target = null;
  npc.guest = true;
  return npc;
}

/** The ground `reach` units from the Keeper in direction `angle`, pushed out of anything solid. */
export function guestSpot(world: World, angle: number, reach: number): Vec2 {
  const k = world.keeper;
  const pos = { x: k.pos.x + Math.sin(angle) * reach, z: k.pos.z + Math.cos(angle) * reach };
  clampToWorld(pos);
  resolve(pos, world);
  return pos;
}

/**
 * R0608: the direction an offer guest comes from. Of eight compass points it takes the one on
 * the camera's side of the Keeper (the default view looks from `towardView`), unless that ground
 * is solid (it would be pushed far off its spot) or a hill stands there (the guest would be
 * hidden behind its terrace); so the walker is in sight from the first step.
 */
export function offerSpawnAngle(world: World, reach: number, towardView: number): number {
  const k = world.keeper;
  const base = heightAt(world.location, k.pos.x, k.pos.z);
  let best = towardView;
  let bestScore = Infinity;
  for (let i = 0; i < 8; i++) {
    const a = towardView + (i * Math.PI) / 4;
    const raw = { x: k.pos.x + Math.sin(a) * reach, z: k.pos.z + Math.cos(a) * reach };
    const spot = guestSpot(world, a, reach);
    const moved = Math.hypot(spot.x - raw.x, spot.z - raw.z);
    const rise = heightAt(world.location, spot.x, spot.z) - base;
    const away = Math.cos(a - towardView);
    // Lower is better: toward the view first, but never blocked, up a hill or behind a rise.
    const score =
      -away +
      (moved > 1 ? 10 : 0) +
      (rise > 0.6 ? 10 : 0) +
      (walkPath(world, spot, k.pos, 'keeper').length > 0 ? 2 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best;
}

/**
 * Corners a staged walk-on takes from `from` to `to` (R0036): empty when the straight line
 * crosses no solid, or the place has no Grove colliders (the Hollow, Corvin's garden).
 * Computed here, once per walk at scene start; the stagers only read the result.
 */
export function walkOnRoute(world: World, from: Vec2, to: Vec2): Vec2[] {
  const loc = world.location;
  if (loc !== 'grove' && !loc.startsWith('visit:')) return [];
  return walkPath(world, from, to, 'keeper');
}
