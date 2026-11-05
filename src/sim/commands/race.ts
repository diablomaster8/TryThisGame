/**
 * Command handlers: race, training and minigame results (TECH-35, moved out of world.ts).
 */
import { BATTLE } from '../../config/tuning-battle';
import { recordKarate } from '../battle/rewards';
import { karatePrize } from '../battle';
import { clampToWorld } from '../behavior';
import { noteCampaign } from '../campaign';
import { noteSecondCare } from '../personality';
import { trainResult } from '../gym';
import { isFree } from '../nubbin';
import { noteQuest } from '../quests';
import { courseById, prizeFor } from '../race';
import { racePrizeMultiplier } from '../seasons';
import { hasSkill } from '../skills';
import { addRecruit, festivalPrizeMultiplier } from '../town';
import { isWary } from '../trust';
import { findNubbin, withRng } from '../world';
import type { Handlers } from './types';

export const handlers: Handlers = {
  raceResult(world, cmd, events) {
    // The UI reports the result, so the sim checks it: a known course, a tier that is open,
    // no more shells than the placement pays, and a hat only for a win (review C, 28).
    const course = courseById(cmd.course);
    const won = world.races[cmd.course] ?? 0;
    if (!course || !Number.isInteger(cmd.tier) || cmd.tier < 1 || cmd.tier > Math.min(3, won + 1))
      return;
    world.raceRuns += 1;
    const shells = Math.min(Math.max(0, cmd.shells), prizeFor(cmd.placement, cmd.tier));
    const prize =
      racePrizeMultiplier(world) *
      festivalPrizeMultiplier(world) *
      (hasSkill(world, 'cheerLeader') ? 1.1 : 1);
    world.inventory.shells += Math.round(shells * prize);
    if (cmd.placement === 1) {
      noteQuest(world, 'race', events);
      events.push({
        kind: 'raceWon',
        nubbinId: cmd.nubbinId,
        course: cmd.course,
        tier: cmd.tier,
      });
      if (cmd.rival) addRecruit(world, cmd.rival.name, cmd.rival.species, events);
    }
    noteCampaign(world, 'raceEntered');
    if (cmd.hat && cmd.placement === 1 && !world.inventory.hats.includes(cmd.hat))
      world.inventory.hats.push(cmd.hat);
    if (cmd.placement === 1) {
      world.races[cmd.course] = Math.max(world.races[cmd.course] ?? 0, cmd.tier);
      noteCampaign(world, 'raceWin');
    }
    return;
  },
  playCatch(world, cmd, events) {
    const k = world.keeper;
    const now = world.timeMs;
    const n = findNubbin(world, cmd.nubbinId);
    const toy = world.items.find((i) => i.kind === 'toy');
    if (!n || !toy || !isFree(n) || isWary(n)) return;
    // The ball flies from the Keeper's hands; the Nubbin runs after it.
    withRng(world, (rng) => {
      const a = k.facing + rng.float(-0.5, 0.5);
      toy.pos.x = k.pos.x + Math.sin(a) * rng.float(3, 5);
      toy.pos.z = k.pos.z + Math.cos(a) * rng.float(3, 5);
      clampToWorld(toy.pos);
    });
    n.behavior.state = 'fetch';
    n.behavior.sinceMs = now;
    delete n.behavior.progress;
    n.behavior.untilMs = now + 20_000;
    n.behavior.itemId = toy.id;
    n.behavior.target = { x: toy.pos.x, z: toy.pos.z };
    noteSecondCare(n, 'bold');
    events.push({ kind: 'fetching', nubbinId: n.id });
    return;
  },
  karateResult(world, cmd, events) {
    // Lane C: kept one release for old screens and story tests. The Shells come from the
    // tier, never the screen (recs FIGHT-02); `battleStart` also checks the belt.
    if (!Number.isInteger(cmd.tier) || cmd.tier < 1 || cmd.tier > BATTLE.karate.tiers) return;
    world.battleRuns = (world.battleRuns ?? 0) + 1;
    world.inventory.shells += karatePrize(cmd.tier, cmd.won);
    recordKarate(world, cmd.nubbinId, cmd.won, cmd.tier, cmd.rival ?? null, events);
    return;
  },
  trainResult(world, cmd, events) {
    trainResult(world, cmd.nubbinId, cmd.stat, cmd.hits, events);
    return;
  },
  tankResult(world, cmd, events) {
    world.inventory.shells += Math.max(0, cmd.shells);
    world.inventory.wood += Math.max(0, cmd.wood);
    world.inventory.stone += Math.max(0, cmd.stone);
    world.tank.runs += 1;
    world.tank.best = Math.max(world.tank.best, cmd.shells);
    events.push({
      kind: 'tankDone',
      shells: cmd.shells,
      wood: cmd.wood,
      stone: cmd.stone,
      won: cmd.won,
    });
    return;
  },
};
