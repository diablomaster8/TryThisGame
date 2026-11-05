/**
 * Command handlers: the shop and rewards (TECH-35, moved out of world.ts).
 */
import { noteCampaign } from '../campaign';
import { noteSecondCare } from '../personality';
import { craft, gather } from '../craft';
import type { RecipeId } from '../craft';
import { townBuy } from '../dungeon-towns';
import { buyAcorns } from '../dungeon-travel';
import { payService } from '../kindergarten';
import { neighbourGift } from '../neighbourhood';
import { claimQuest } from '../quests';
import { buyPlot } from '../roster';
import { addRewards, buy } from '../shop';
import { buySkill, hasSkill } from '../skills';
import type { DyeColor } from '../types';
import { findNubbin, withRng } from '../world';
import type { Handlers } from './types';

export const handlers: Handlers = {
  addRewards(world, cmd, events) {
    const r = {
      ...cmd.rewards,
      shells: Math.round(cmd.rewards.shells * (hasSkill(world, 'lightFeet') ? 1.1 : 1)),
    };
    if (hasSkill(world, 'seedPocket')) {
      r.seeds = { ...(r.seeds ?? {}) };
      r.seeds.sun = (r.seeds.sun ?? 0) + 1;
    }
    addRewards(world, r, events);
    noteCampaign(world, 'expedition');
    // R0529: an expedition is a bold outing for every child at home.
    for (const c of world.nubbins) noteSecondCare(c, 'bold');
    return;
  },
  buy(world, cmd, events) {
    withRng(world, (rng) => buy(world, cmd.item, rng, events, cmd.pick));
    return;
  },
  payService(world, cmd, events) {
    const n = findNubbin(world, cmd.nubbinId);
    if (n) payService(world, cmd.service, n, events);
    return;
  },
  townBuy(world, cmd, events) {
    townBuy(world, cmd.item, events);
    return;
  },
  buyAcorns(world, cmd, events) {
    buyAcorns(world, events);
    return;
  },
  craft(world, cmd, events) {
    const [recipe, dyeColor] = cmd.recipe.split(':');
    craft(world, recipe as RecipeId, events, dyeColor as DyeColor | undefined);
    return;
  },
  gather(world, cmd, events) {
    gather(world, cmd.what, events);
    return;
  },
  buyPlot(world, cmd, events) {
    buyPlot(world, events);
    return;
  },
  setTitle(world, cmd) {
    world.title = cmd.title;
    return;
  },
  claimQuest(world, cmd, events) {
    withRng(world, (rng) => claimQuest(world, cmd.id, rng, events));
    return;
  },
  neighbourGift(world, cmd, events) {
    neighbourGift(world, events);
    return;
  },
  buySkill(world, cmd, events) {
    buySkill(world, cmd.id, events);
    return;
  },
};
