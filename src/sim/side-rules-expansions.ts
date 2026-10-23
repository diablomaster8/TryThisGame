import { EXPANSIONS, LIFECYCLE } from '../config/tuning';
import { dayCount } from './curfew';
import { hatch } from './lifecycle';
import { addRecruit } from './town';
import { createEgg } from './nubbin';
import { spawnNpc } from './npcs';
import { hasRoom } from './roster';
import { postGameMorning, type StoryRule } from './side-rule-kit';
import { seen } from './story-state';
import { checkMet, counter } from './storyline-checks';
import { sideStory } from './story-scenes';
import type { CampaignState, Nubbin, SideStoryState, SimEvent, World } from './types';
import { newId, uniqueName, withRng } from './world';

/**
 * The post-ending expansions E1–E3 (plan G12): the square, Nova's season and the twine.
 * They run on the side-story runner like S1–S31, opening after Hazel's Grove has reached
 * an ending. Their checks are the storyline grammar (storyline-checks.ts), met by the
 * world alone, so the journal never offers a Do-it for them except E1's first walk.
 */

/** Step `i`'s check, read with the storyline grammar. */
const byWorld =
  (id: string) =>
  (w: World, c: CampaignState, _st: SideStoryState, i: number): boolean => {
    const check = sideStory(id)?.steps[i]?.check;
    return check ? checkMet(w, c, check) : false;
  };

/** The Corvin ending: reconciled, and Hazel's Grove reached. */
function corvinEarned(c: CampaignState): boolean {
  return c.flags.corvin === 'reconciled' && c.ending === 'hazels-grove';
}

// E1 The Square: the first post-game morning; the town system meets steps 2–7.
const E1: StoryRule = {
  id: 'e1',
  opens: (w, c) => postGameMorning(w, c),
  auto: byWorld('e1'),
  autoOnly: [1, 2, 3, 4, 5, 6],
  variant: (_w, c, scene) => {
    if (scene === 'e1-attendant-done' && corvinEarned(c)) return 'e1-attendant-corvin';
    // Hazel's "slow" answer at the square earns its own ending lines.
    if (scene === 'e1-complete' && c.flags['e1-hazel'] === 'slow') return 'e1-complete-slow';
    return scene;
  },
  sceneDone: (w, _c, scene, events) => {
    if (scene !== 'e1-attendant-corvin') return;
    // Corvin comes back as a reformed recruit: an NPC in the Grove and a name on the square.
    if (!w.npcs.some((n) => n.trainer === 'corvin')) spawnNpc(w, 'corvin');
    addRecruit(w, 'Corvin', 'keeper', events);
  },
};

function e2Nubbin(w: World, c: CampaignState): Nubbin | undefined {
  const id = c.flags['e2-nubbin'];
  return typeof id === 'string' ? w.nubbins.find((n) => n.id === id) : undefined;
}

function e2Day(w: World, c: CampaignState): number {
  const n = e2Nubbin(w, c);
  return n && n.stage !== 'egg' ? dayCount(n).day : 0;
}

/** Once the story's Nubbin has left the roster, or come back as an egg, the outcome is known. */
function e2Outcome(w: World, c: CampaignState): 'reborn' | 'departed' | null {
  const id = c.flags['e2-nubbin'];
  if (typeof id !== 'string') return null;
  const n = w.nubbins.find((x) => x.id === id);
  if (!n) return w.memorials.some((m) => m.name === c.flags['e2-name']) ? 'departed' : null;
  return n.rebirths > 0 ? 'reborn' : null;
}

// E2 Nova's Season: a twelve-day life, gated by Dandy's day on the lifespan clock.
const E2: StoryRule = {
  id: 'e2',
  opens: (w, c) => postGameMorning(w, c) && c.side.e1 !== undefined && hasRoom(w),
  adjust: (w, c) => {
    if (c.flags['e2-nubbin'] || !seen(c, 'e2-egg') || !hasRoom(w)) return;
    withRng(w, (rng) => {
      const egg = createEgg(newId(w, 'nub'), { x: 0, z: 6 }, rng, 'plain');
      egg.name = uniqueName(w, 'Dandy', rng);
      egg.spanScale = EXPANSIONS.novaSpanScale;
      w.nubbins.push(egg);
      c.flags['e2-nubbin'] = egg.id;
      c.flags['e2-name'] = egg.name;
    });
  },
  gate: (w, c, _st, i) => {
    if (i === 1) return e2Day(w, c) >= EXPANSIONS.novaDays[0];
    if (i === 2) return e2Day(w, c) >= EXPANSIONS.novaDays[1];
    if (i === 3) return e2Day(w, c) >= EXPANSIONS.novaDays[2];
    if (i === 4) return e2Outcome(w, c) !== null;
    return true;
  },
  auto: (w, c, _st, i) => {
    if (i === 0) {
      const n = e2Nubbin(w, c);
      return n !== undefined && n.stage !== 'egg';
    }
    if (i === 4) {
      const outcome = e2Outcome(w, c);
      if (outcome) c.flags['e2-outcome'] = outcome;
      return outcome !== null;
    }
    return false;
  },
  autoOnly: [0, 4],
  variant: (w, c, scene) => {
    const n = e2Nubbin(w, c);
    if (scene === 'e2-day4' && (n?.slipCount ?? 0) >= EXPANSIONS.novaSlipsForVariant)
      return 'e2-day4-slips';
    if (scene === 'e2-day8' && n?.moody) return 'e2-day8-moody';
    if (scene === 'e2-complete-reborn') {
      const end = c.flags['e2-outcome'] === 'departed' ? 'e2-complete-departed' : scene;
      // The "short" answer on day 1 changes what Nova says back at the end.
      return c.flags['e2-answer'] === 'short' ? `${end}-short` : end;
    }
    return scene;
  },
};

// E3 The Twine: strays, partners, twine, the merge, then the bracket.
const E3: StoryRule = {
  id: 'e3',
  opens: (w, c) =>
    postGameMorning(w, c) &&
    c.side.e1 !== undefined &&
    w.nubbins.filter((n) => n.stage !== 'egg').length >= 2,
  gate: (_w, c, _st, i) => {
    // The bracket goes up: remember the dojo wins so far.
    if (i === 4 && typeof c.flags['e3-wins-at'] !== 'number')
      c.flags['e3-wins-at'] = counter(c, 'karateWon');
    return true;
  },
  auto: (w, c, st, i) => {
    if (i === 4) {
      const since = counter(c, 'karateWon') - Number(c.flags['e3-wins-at'] ?? 0);
      if (since > 0 && w.merge) c.flags['e3-merged-win'] = true;
      return since >= EXPANSIONS.tournamentWins;
    }
    return byWorld('e3')(w, c, st, i);
  },
  autoOnly: [0, 1, 2, 3, 4],
  variant: (_w, c, scene) => {
    if (scene === 'e3-tournament-done' && c.flags['e3-merged-win'])
      return 'e3-tournament-done-merged';
    // Telling Dusty "the two strongest" earns the merge a wobble before it holds.
    if (scene === 'e3-merge-done' && c.flags['e3-pick'] === 'strong') return 'e3-merge-done-strong';
    return scene;
  },
};

export const EXPANSION_RULES: StoryRule[] = [E1, E2, E3];

/** For the tests and the debug panel: hatch the E2 egg now and move it to `day` of its clock. */
export function debugE2Day(w: World, c: CampaignState, day: number, events: SimEvent[]): void {
  const n = e2Nubbin(w, c);
  if (!n) return;
  if (n.stage === 'egg') hatch(n, events, w.timeMs);
  n.ageMs = Math.max(n.ageMs, (day - 1) * (LIFECYCLE.adultMs / 5) + 1);
}
