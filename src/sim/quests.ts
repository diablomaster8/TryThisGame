import { QUESTS } from '../config/tuning';
import { dayKey } from './daily';
import { createEgg, EGG_COLORS } from './nubbin';
import { hasRoom } from './roster';
import type { Rng } from './rng';
import { TRAINERS } from './trainers';
import type { Quest, SimEvent, World } from './types';
import { newId, uniqueName } from './world';

/**
 * The daily board: three requests from Nubbins and visiting Keepers, refreshed each real
 * day, paid in Shells and sometimes a rare egg. Progress is counted from sim events.
 */
interface Template {
  id: string;
  target: [number, number];
  shells: number;
  egg?: boolean;
  /** Needs a parameter: a species or a flavour. */
  param?: 'species';
}

const TEMPLATES: Template[] = [
  { id: 'pet', target: [5, 12], shells: 20 },
  { id: 'feed', target: [3, 8], shells: 25 },
  { id: 'fruit', target: [4, 10], shells: 20 },
  { id: 'race', target: [1, 2], shells: 40 },
  { id: 'karate', target: [1, 1], shells: 40 },
  { id: 'lanterns', target: [4, 4], shells: 30 },
  { id: 'photo', target: [1, 1], shells: 30, param: 'species' },
  { id: 'visit', target: [1, 2], shells: 35 },
  { id: 'craft', target: [1, 3], shells: 30 },
  { id: 'water', target: [2, 5], shells: 20 },
  { id: 'hug', target: [3, 6], shells: 25 },
  { id: 'lesson', target: [1, 2], shells: 35, egg: true },
  { id: 'expedition', target: [1, 2], shells: 30 },
  { id: 'gather', target: [3, 8], shells: 25 },
  { id: 'hollow', target: [1, 2], shells: 35 },
];

export function refreshQuests(world: World, rng: Rng, events: SimEvent[]): void {
  const pool = [...TEMPLATES];
  const quests: Quest[] = [];
  const names = world.nubbins.map((n) => n.name);
  for (let i = 0; i < QUESTS.perDay && pool.length > 0; i++) {
    const t = pool.splice(rng.int(0, pool.length - 1), 1)[0]!;
    const fromKeeper = rng.chance(0.5) || names.length === 0;
    const from = fromKeeper
      ? rng.pick(TRAINERS.filter((x) => x.id !== world.trainer)).id
      : rng.pick(names);
    const species = world.nubbins.find((n) => n.stage !== 'egg')?.species ?? 'chao';
    const target = rng.int(t.target[0], t.target[1]);
    quests.push({
      id: newId(world, 'quest'),
      template: t.id,
      from,
      param: t.param === 'species' ? species : null,
      target,
      progress: 0,
      rewardShells: t.shells + Math.round(QUESTS.baseShells * (target / t.target[1])),
      rewardEgg: Boolean(t.egg) && rng.chance(0.6),
      claimed: false,
    });
  }
  world.quests = quests;
  events.push({ kind: 'questsRefreshed' });
}

function bump(world: World, template: string, events: SimEvent[], n = 1, param?: string): void {
  for (const q of world.quests) {
    if (q.template !== template || q.claimed || q.progress >= q.target) continue;
    if (q.param && param && q.param !== param) continue;
    q.progress = Math.min(q.target, q.progress + n);
    if (q.progress >= q.target) events.push({ kind: 'questDone', id: q.id });
  }
}

/** Per step: refresh on a new real day; count the step's events. */
/** Events produced by commands, waiting for the next step's count. */
const queued = new WeakMap<World, SimEvent[]>();

export function queueQuestEvents(world: World, events: SimEvent[]): void {
  const list = queued.get(world) ?? [];
  list.push(...events);
  queued.set(world, list);
}

export function stepQuests(
  world: World,
  wallMs: number | undefined,
  rng: Rng,
  events: SimEvent[],
): void {
  if (wallMs !== undefined) {
    const day = dayKey(new Date(wallMs));
    if (world.questDay !== day) {
      world.questDay = day;
      refreshQuests(world, rng, events);
    }
  }
  const pending = queued.get(world);
  queued.delete(world);
  for (const e of pending ? [...pending, ...events] : events) {
    switch (e.kind) {
      case 'reaction':
        if (e.reaction === 'love') bump(world, 'pet', events);
        break;
      case 'interacted':
        if (e.ok && e.action === 'hug') bump(world, 'hug', events);
        break;
      case 'ate':
        bump(world, 'feed', events);
        break;
      case 'collected':
        bump(world, 'fruit', events);
        break;
      case 'karate':
        if (e.won) bump(world, 'karate', events);
        break;
      case 'lanternLit':
        bump(world, 'lanterns', events);
        break;
      case 'crafted':
        if (e.ok) bump(world, 'craft', events);
        break;
      case 'watered':
        bump(world, 'water', events);
        break;
      case 'lessonDone':
        bump(world, 'lesson', events);
        break;
      case 'gathered':
        bump(world, 'gather', events, e.count);
        break;
      case 'visiting':
        if (e.trainer) bump(world, 'visit', events);
        break;
      case 'rewards':
        bump(world, 'expedition', events);
        break;
      case 'descended':
        if (e.daily) bump(world, 'hollow', events);
        break;
      default:
        break;
    }
  }
}

/** Race wins and photos arrive as commands, not events. */
export function noteQuest(
  world: World,
  template: 'race' | 'photo',
  events: SimEvent[],
  param?: string,
): void {
  bump(world, template, events, 1, param);
}

export function claimQuest(world: World, id: string, rng: Rng, events: SimEvent[]): boolean {
  const q = world.quests.find((x) => x.id === id);
  if (!q || q.claimed || q.progress < q.target) return false;
  q.claimed = true;
  world.inventory.shells += q.rewardShells;
  let egg = false;
  if (q.rewardEgg && hasRoom(world)) {
    const colours = EGG_COLORS.filter((c) => c !== 'plain');
    const e = createEgg(
      newId(world, 'nub'),
      { x: world.keeper.pos.x + 1, z: world.keeper.pos.z },
      rng,
      rng.pick(colours),
    );
    e.shiny = rng.chance(0.3);
    e.name = uniqueName(world, e.name, rng);
    world.nubbins.push(e);
    egg = true;
  }
  events.push({ kind: 'questClaimed', id, shells: q.rewardShells, egg });
  return true;
}
