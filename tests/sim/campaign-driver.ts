/** Drives a campaign the way a player would, for the campaign tests. */
import { SIM } from '../../src/config/tuning';
import { chapterDef, FINAL_CHAPTER, goalMet, sceneById } from '../../src/sim/campaign';
import { RUNNER_STORIES, sideActable } from '../../src/sim/side-stories';
import type { CampaignState, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** A world with the campaign started. */
export function campaignWorld(trainer = 'fern'): { world: World; events: SimEvent[] } {
  const world = createWorld(11, 0);
  const events: SimEvent[] = [];
  applyCommand(world, { kind: 'setTrainer', id: trainer }, events);
  applyCommand(world, { kind: 'campaignStart' }, events);
  return { world, events };
}

export function c(world: World): CampaignState {
  return world.campaign!;
}

/** Keep everyone fed and rested so trust does not drift during long runs. */
export function tick(world: World, events: SimEvent[], seconds: number): void {
  const steps = Math.ceil((seconds * 1000) / SIM.stepMs);
  for (let i = 0; i < steps; i++) {
    for (const n of world.nubbins) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
    }
    events.push(...stepWorld(world, SIM.stepMs));
  }
}

/** Answer every queued scene, picking `choices[scene]` where given. */
export function playScenes(
  world: World,
  events: SimEvent[],
  choices: Record<string, string> = {},
): string[] {
  const seen: string[] = [];
  let guard = 0;
  while (c(world).queue.length > 0 && guard++ < 20) {
    const id = c(world).queue[0]!;
    const scene = sceneById(id)!;
    const choice = scene.choices ? (choices[id] ?? scene.choices[0]!.id) : null;
    applyCommand(world, { kind: 'sceneDone', scene: id, choice }, events);
    seen.push(id);
    tick(world, events, 1.1);
  }
  return seen;
}

export function goalMetNow(world: World): boolean {
  return goalMet(world, c(world));
}

export function sable(world: World) {
  return world.nubbins.find((n) => n.id === c(world).sableId);
}

export function moss(world: World) {
  return world.nubbins.find((n) => n.id === c(world).mossId);
}

/** Meet the chapter's goal directly, the way play would. */
export function meetGoal(world: World, events: SimEvent[]): void {
  const st = c(world);
  const def = chapterDef(st.chapter)!;
  switch (def.goal) {
    case 'firstHatch':
      st.stats.hatched = 1;
      st.stats.pets = 1;
      break;
    case 'feedTwice':
      st.stats.feeds = 2;
      break;
    case 'sableTrust20':
      sable(world)!.trust = 25;
      break;
    case 'lanternsAndMoss':
      st.flags.mossPetted = true;
      for (let i = 1; i <= 4; i++)
        applyCommand(world, { kind: 'lightLantern', id: `lantern-${i}` }, events);
      break;
    case 'winRace':
      applyCommand(
        world,
        {
          kind: 'raceResult',
          nubbinId: 'n1',
          course: 'meadow',
          tier: 1,
          placement: 1,
          shells: 10,
          hat: null,
        },
        events,
      );
      break;
    case 'talkDusty': {
      const npc = world.npcs.find((n) => n.trainer === 'dusty')!;
      world.keeper.pos = { ...npc.pos };
      applyCommand(world, { kind: 'talk', npcId: npc.id }, events);
      break;
    }
    case 'sableTrust45':
      sable(world)!.trust = 50;
      break;
    case 'expedition':
      applyCommand(
        world,
        { kind: 'addRewards', rewards: { shells: 1, essences: {}, critters: {} } },
        events,
      );
      break;
    case 'notebook':
      st.flags.notebookFound = true;
      break;
    case 'corvinChoice':
      break; // made in the opening scene
    case 'lanternsAgain':
      for (let i = 1; i <= 4; i++)
        applyCommand(world, { kind: 'lightLantern', id: `lantern-${i}` }, events);
      break;
    case 'threeFriends':
      for (const t of ['fern', 'marina', 'sparks', 'clover']) {
        const npc = world.npcs.find((n) => n.trainer === t);
        if (!npc) continue;
        world.keeper.pos = { ...npc.pos };
        applyCommand(world, { kind: 'talk', npcId: npc.id }, events);
      }
      break;
    case 'finalChoice':
      break; // made in the opening scene
  }
}

/** How a driven run behaves. */
export interface DriveOptions {
  /** Side stories whose journal steps the player never takes. */
  skip?: string[];
  /** While this holds, the player leaves the chapter goal alone. */
  holdGoal?: (world: World) => boolean;
  /** Stop as soon as this holds (checked between passes). */
  until?: (world: World) => boolean;
}

/**
 * Nothing queued: do what a player would. Relight the vigil lanterns, take the side
 * story steps the journal offers, meet the chapter goal, or let story time pass.
 */
export function idle(world: World, events: SimEvent[], opts: DriveOptions = {}): void {
  const st = c(world);
  if (st.vigil && !st.vigil.done) {
    for (let i = 1; i <= 4; i++)
      applyCommand(world, { kind: 'lightLantern', id: 'lantern-' + i }, events);
  }
  let acted = false;
  for (const id of RUNNER_STORIES) {
    if (opts.skip?.includes(id)) continue;
    if (sideActable(world, st, id)) {
      applyCommand(world, { kind: 'sideAct', story: id }, events);
      acted = true;
    }
  }
  if (acted) return;
  const hold = opts.holdGoal?.(world) ?? false;
  if (!hold && st.chapter <= FINAL_CHAPTER && st.step === 1 && !goalMetNow(world)) {
    meetGoal(world, events);
    return;
  }
  tick(world, events, 5);
}

/** Answer the queued scene, picking choices[scene] where given. */
function answer(world: World, events: SimEvent[], choices: Record<string, string>): void {
  const id = c(world).queue[0]!;
  const scene = sceneById(id)!;
  const choice = scene.choices ? (choices[id] ?? scene.choices[0]!.id) : null;
  applyCommand(world, { kind: 'sceneDone', scene: id, choice }, events);
}

/** Keep playing an existing world until the ending has played or opts.until holds. */
export function drive(
  world: World,
  events: SimEvent[],
  choices: Record<string, string>,
  hooks: Partial<Record<number, (world: World, events: SimEvent[]) => void>> = {},
  opts: DriveOptions = {},
): void {
  const hooked = new Set<number>();
  // One scene or one action per pass, so chapter hooks run the moment a chapter begins.
  for (let guard = 0; guard < 8000; guard++) {
    if (opts.until?.(world)) return;
    const st = c(world);
    if (!hooked.has(st.chapter)) {
      hooked.add(st.chapter);
      hooks[st.chapter]?.(world, events);
    }
    if (st.queue.length > 0) answer(world, events, choices);
    else if (st.chapter > FINAL_CHAPTER) return;
    else idle(world, events, opts);
    tick(world, events, 1.1);
  }
  throw new Error(`run stalled in chapter ${c(world).chapter}, step ${c(world).step}`);
}

/** Play the whole campaign with the given scene choices and per-chapter hooks. */
export function runCampaign(
  choices: Record<string, string>,
  hooks: Partial<Record<number, (world: World, events: SimEvent[]) => void>> = {},
  opts: DriveOptions = {},
): { world: World; ending: string; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  drive(world, events, choices, hooks, opts);
  return { world, ending: c(world).ending ?? '', events };
}
