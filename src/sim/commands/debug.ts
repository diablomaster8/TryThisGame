/**
 * Command handlers: the debug panel's cheats and forced checks (TECH-35, moved out of
 * world.ts). Debug builds send these; a normal game never does.
 */
import { NUBBIN_TYPES } from '../types';
import { debugSet } from '../debug-set';
import { evolve, secondEvolve } from '../lifecycle';
import { WILD_CRITTERS } from '../critters';
import { createEgg, EGG_COLORS } from '../nubbin';
import { hasRoom } from '../roster';
import { lifespanMs } from '../slips';
import { SPECIES } from '../species';
import { setWeather } from '../weather';
import { findNubbin, newId, uniqueName, withRng } from '../world';
import type { Handlers } from './types';

export const handlers: Handlers = {
  // R0118 (lane D r9): force a season (null: back to the calendar), applied at once.
  debugSeason(world, cmd) {
    if (cmd.season) {
      world.debugSeason = cmd.season;
      world.season = cmd.season;
    } else delete world.debugSeason;
    return;
  },
  debugSet(world, cmd) {
    debugSet(world, cmd.path, cmd.value);
    return;
  },
  debugGive(world, cmd) {
    if (cmd.what === 'shells') world.inventory.shells += cmd.amount;
    else if (cmd.what === 'fruit') world.inventory.fruit += cmd.amount;
    else if (cmd.what === 'egg') {
      // Fill the roster for checks: free eggs of every family up to the cap.
      withRng(world, (rng) => {
        const babies = SPECIES.filter((s) => s.stage === 'baby');
        for (let i = 0; i < cmd.amount && hasRoom(world); i++) {
          const egg = createEgg(
            newId(world, 'nub'),
            { x: rng.float(-4, 4), z: rng.float(-3, 3) },
            rng,
            rng.pick(EGG_COLORS),
            rng.pick(babies).id,
          );
          egg.name = uniqueName(world, egg.name, rng);
          world.nubbins.push(egg);
        }
      });
    } else if (cmd.what === 'critter') {
      withRng(world, (rng) => {
        for (let i = 0; i < cmd.amount; i++) {
          const s = rng.pick(WILD_CRITTERS).id;
          world.inventory.critters[s] = (world.inventory.critters[s] ?? 0) + 1;
        }
      });
    } else {
      withRng(world, (rng) => {
        for (let i = 0; i < cmd.amount; i++) {
          const t = rng.pick(NUBBIN_TYPES);
          world.inventory.essences[t] = (world.inventory.essences[t] ?? 0) + 1;
        }
      });
    }
    return;
  },
  debugFillNeeds(world, cmd) {
    const n = findNubbin(world, cmd.nubbinId);
    if (!n) return;
    n.needs.hunger = 1;
    n.needs.energy = 1;
    return;
  },
  debugForceEvolve(world, cmd, events) {
    const n = findNubbin(world, cmd.nubbinId);
    if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
    if (n.stage === 'adult') {
      if (n.form && n.form.second === null) secondEvolve(n, events);
      return;
    }
    evolve(n, events, world);
    return;
  },
  debugForceEndOfLife(world, cmd) {
    const n = findNubbin(world, cmd.nubbinId);
    if (!n || n.stage !== 'adult') return;
    n.eternal = null;
    // The Nubbin's own lifespan: slips shorten it and some storylines lengthen it.
    n.stageMs = lifespanMs(n);
    return;
  },
  debugWeather(world, cmd, events) {
    withRng(world, (rng) => setWeather(world, cmd.weather, rng, events));
    return;
  },
  debugHatchNow(world, cmd) {
    const n = findNubbin(world, cmd.nubbinId);
    if (n && n.stage === 'egg') n.hatchRemainingMs = 0;
    return;
  },
};
