/**
 * Lane C r10 agent D (R0604, CAMP-12): plays a questline beside Hazel's Grove to one of its
 * endings, for the reachability bot. Each line's own test (`storyline-*.test.ts`) plays its
 * goals for real; here the bot plays every scene the line queues and, where a chapter's goal
 * waits on play the bot can't do (a Hollow run, a party bout, a scan), meets the goal's first
 * alternative directly, as the journal's Skip-goal does for the spine (lines refuse that
 * command). What this proves is the wiring in one shared world: every chapter's opening,
 * beats and closing play, the region gate lets the line move, and an ending scene queues.
 */
import { SCANS, STORY } from '../../src/config/tuning';
import { regionOfLine } from '../../src/config/story-regions';
import { sceneById } from '../../src/sim/campaign';
import { storyChapter } from '../../src/sim/storyline';
import { checkMet, storyPartner } from '../../src/sim/storyline-checks';
import type { CampaignState, SimEvent, World } from '../../src/sim/types';
import { applyCommand, stepWorld } from '../../src/sim/world';
import { SIM } from '../../src/config/tuning';

function tick(world: World, events: SimEvent[], seconds: number): void {
  const steps = Math.ceil((seconds * 1000) / SIM.stepMs);
  for (let i = 0; i < steps; i++) {
    for (const n of world.nubbins) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
    }
    events.push(...stepWorld(world, SIM.stepMs));
  }
}

/** The number in a `>=N` (or bare N) comparison; 1 when there is none. */
const atLeast = (spec: string | undefined): number => {
  const m = /(-?\d+(?:\.\d+)?)$/.exec(spec ?? '');
  return m
    ? Math.ceil(Number(m[1]) + (spec?.startsWith('>') && !spec.startsWith('>=') ? 1 : 0))
    : 1;
};

/** Meet one goal term for line `l` directly. Returns false for a term it doesn't know. */
function meetTerm(world: World, l: CampaignState, text: string, events: SimEvent[]): boolean {
  const t = text.trim().split(':');
  const line = l.storyline!;
  const flag = (k: string, v: number) => (l.flags[k] = Number(l.flags[k] ?? 0) + v);
  switch (t[0]) {
    case 'any':
      return true;
    case 'flag':
    case 'choice':
      l.flags[t[1]!] = t.length > 2 ? t[2]! : true;
      return true;
    case 'act':
      applyCommand(world, { kind: 'storyAct', label: t[1]!, line }, events);
      return true;
    case 'area':
      applyCommand(world, { kind: 'storyArea', area: t[1]!, line }, events);
      return true;
    case 'count':
      flag(`n:${t[1]}`, atLeast(t[2]));
      return true;
    case 'fused':
      flag('n:fused', atLeast(t[1]));
      return true;
    case 'stat': {
      const k = t[1] as keyof CampaignState['stats'];
      l.stats[k] = Math.max(l.stats[k] ?? 0, atLeast(t[2]));
      return true;
    }
    case 'days':
      l.chapterStartMs -= atLeast(t[1]) * STORY.dayMs;
      return true;
    case 'recruits':
      while (world.town.recruits.length < atLeast(t[1]))
        world.town.recruits.push({
          name: `Bot ${world.town.recruits.length}`,
          species: 'chao',
          role: 'stall',
          atMs: world.timeMs,
        });
      return true;
    case 'prosperity':
      world.town.prosperity = Math.max(world.town.prosperity, atLeast(t[1]));
      return true;
    case 'hollow':
      if (t[1] === 'best') world.hollow.best = Math.max(world.hollow.best, atLeast(t[2]));
      else world.hollow.runs = Math.max(world.hollow.runs, atLeast(t[2]));
      return true;
    case 'tank':
      if (t[1] === 'best') world.tank.best = Math.max(world.tank.best, atLeast(t[2]));
      else world.tank.runs = Math.max(world.tank.runs, atLeast(t[2]));
      return true;
    case 'team':
      if (!world.team) applyCommand(world, { kind: 'joinTeam', team: 'dawn' }, events);
      return world.team !== null;
    case 'karate':
      if (t[1] === 'belt') world.karate.belt = Math.max(world.karate.belt, atLeast(t[2]));
      else world.karate.wins = Math.max(world.karate.wins, atLeast(t[2]));
      return true;
    case 'scans': {
      const need = atLeast(t[2] ?? t[1]);
      for (let i = 0; i < need; i++) world.scans[`bot-scan-${i}`] = SCANS.full;
      return true;
    }
    case 'partner': {
      const p = storyPartner(world, l);
      if (!p) return false;
      if (t[1] === 'adult') {
        p.stage = 'adult';
        p.form ??= {
          band: 'neutral',
          type: 'run',
          second: null,
          leanAtEvolution: { ...p.typeLean },
        };
      } else if (t[1] === 'stage') p.stage = t[2] as typeof p.stage;
      else if (t[1] === 'trust') p.trust = Math.max(p.trust, atLeast(t[2]));
      else return false;
      return true;
    }
    default:
      return false;
  }
}

/** Meet line `l`'s current chapter goal by its first alternative. Returns the unknown terms. */
function meetGoal(world: World, l: CampaignState, events: SimEvent[]): string[] {
  const def = storyChapter(l);
  if (!def) return [];
  const first = def.goal.split('|')[0]!;
  return first.split('&').filter((term) => !meetTerm(world, l, term, events));
}

export interface LineRun {
  ending: string | null;
  /** Goal terms the bot did not know how to meet (empty when the line ended). */
  stuck: string[];
  chapters: number;
}

/**
 * Start line `id` (the caller checked `lineRefusal`), go to its region and play it to an
 * ending: scenes answered with their first choice, goals met when nothing else moves.
 */
export function playLineToEnding(world: World, events: SimEvent[], id: string): LineRun {
  // A line before may have ended underground (the Beetle Road); its region is entered from the Grove.
  if (world.location === 'dungeon') applyCommand(world, { kind: 'leaveDungeon' }, events);
  applyCommand(world, { kind: 'storylineStart', id }, events);
  const region = regionOfLine(id);
  if (region) applyCommand(world, { kind: 'storyRegion', region }, events);
  const stuck: string[] = [];
  let idle = 0;
  for (let i = 0; i < 2000; i++) {
    const l = world.lines[id];
    if (!l) break;
    const spine = world.campaign!;
    const head = spine.queue[0];
    if (head) {
      const scene = sceneById(head)!;
      applyCommand(
        world,
        { kind: 'sceneDone', scene: head, choice: scene.choices?.[0]?.id ?? null },
        events,
      );
      idle = 0;
    } else if (l.ending !== null && l.queue.length === 0) break;
    else if (l.step === 1 && ++idle > 3) {
      const def = storyChapter(l);
      if (def && !checkMet(world, l, def.goal)) stuck.push(...meetGoal(world, l, events));
      idle = 0;
    }
    if (region && world.storyRegion !== region)
      applyCommand(world, { kind: 'storyRegion', region }, events);
    tick(world, events, 1.1);
  }
  const l = world.lines[id];
  return { ending: l?.ending ?? null, stuck: [...new Set(stuck)], chapters: l?.chapter ?? 0 };
}
