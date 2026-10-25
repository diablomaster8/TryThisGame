import { SPEAKERS } from '../config/story';
import { STORY } from '../config/tuning';
import { clampToWorld } from './behavior';
import { spawnNpc } from './npcs';
import { resolve } from './obstacles';
import { sceneById, sideStory } from './story-scenes';
import { sceneOwner } from './story-state';
import { TRAINERS } from './trainers';
import type { CampaignState, Npc, Season, World } from './types';

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
  if (world.npcs.some((n) => n.guest && !wanted.includes(n.trainer)))
    world.npcs = world.npcs.filter((n) => !n.guest || wanted.includes(n.trainer));
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
