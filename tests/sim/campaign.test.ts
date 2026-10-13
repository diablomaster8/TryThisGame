import { describe, expect, it } from 'vitest';
import { CHAPTERS, SCENES } from '../../src/config/story';
import { SIM, TRUST } from '../../src/config/tuning';
import { chapterDef, endingFor, FINAL_CHAPTER, sceneById } from '../../src/sim/campaign';
import { hatch } from '../../src/sim/lifecycle';
import type { CampaignState, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** A world with the campaign started. */
function campaignWorld(trainer = 'fern'): { world: World; events: SimEvent[] } {
  const world = createWorld(11, 0);
  const events: SimEvent[] = [];
  applyCommand(world, { kind: 'setTrainer', id: trainer }, events);
  applyCommand(world, { kind: 'campaignStart' }, events);
  return { world, events };
}

function c(world: World): CampaignState {
  return world.campaign!;
}

/** Keep everyone fed and rested so trust does not drift during long runs. */
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

/** Answer every queued scene, picking `choices[scene]` where given. */
function playScenes(
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

function sable(world: World) {
  return world.nubbins.find((n) => n.id === c(world).sableId);
}

function moss(world: World) {
  return world.nubbins.find((n) => n.id === c(world).mossId);
}

/** Meet the chapter's goal directly, the way play would. */
function meetGoal(world: World, events: SimEvent[]): void {
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

/** Play the whole campaign with the given scene choices and per-chapter hooks. */
function runCampaign(
  choices: Record<string, string>,
  hooks: Partial<Record<number, (world: World, events: SimEvent[]) => void>> = {},
  trainer = 'fern',
): { world: World; ending: string; events: SimEvent[] } {
  const { world, events } = campaignWorld(trainer);
  const hooked = new Set<number>();
  let guard = 0;
  // One scene or one goal per pass, so chapter hooks run the moment a chapter begins.
  while (guard++ < 400) {
    const st = c(world);
    if (!hooked.has(st.chapter)) {
      hooked.add(st.chapter);
      hooks[st.chapter]?.(world, events);
    }
    if (st.queue.length > 0) {
      const id = st.queue[0]!;
      const scene = sceneById(id)!;
      const choice = scene.choices ? (choices[id] ?? scene.choices[0]!.id) : null;
      applyCommand(world, { kind: 'sceneDone', scene: id, choice }, events);
      if (id.startsWith('end-')) break;
    } else if (st.chapter <= FINAL_CHAPTER && st.step === 1) {
      meetGoal(world, events);
    }
    tick(world, events, 1.1);
  }
  return { world, ending: c(world).ending ?? '', events };
}

describe('story data', () => {
  it('has twelve chapters whose scenes all exist', () => {
    expect(CHAPTERS.length).toBe(12);
    for (const ch of CHAPTERS) {
      expect(sceneById(ch.opening), ch.opening).toBeDefined();
      expect(sceneById(ch.closing), ch.closing).toBeDefined();
    }
    const ids = SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SCENES) for (const l of s.lines) expect(l.text.length).toBeGreaterThan(0);
  });
});

describe('campaign', () => {
  it('starts with Moss on the hill and the visiting Keepers', () => {
    const { world } = campaignWorld('sparks');
    expect(c(world).chapter).toBe(1);
    expect(c(world).queue[0]).toBe('c1-letter');
    expect(moss(world)?.eternal).toBe('neutral');
    expect(world.npcs.some((n) => n.trainer === 'sparks')).toBe(false);
    expect(world.npcs.length).toBe(9);
  });

  it('advances chapter by chapter as goals are met', () => {
    const { world, events } = campaignWorld();
    playScenes(world, events);
    expect(c(world).step).toBe(1);
    // Hatch and pet: the real way.
    for (const n of world.nubbins) if (n.stage === 'egg') hatch(n, events, world.timeMs);
    const kid = world.nubbins.find((n) => n.id !== c(world).mossId)!;
    c(world).stats.hatched = 1;
    world.keeper.pos = { ...kid.pos };
    applyCommand(world, { kind: 'pet', nubbinId: kid.id }, events);
    tick(world, events, 2);
    expect(c(world).stats.pets).toBeGreaterThanOrEqual(1);
    expect(c(world).queue[0]).toBe('c1-close');
    playScenes(world, events);
    expect(c(world).chapter).toBe(2);
  });

  it('spawns Sable as a wary Shadow stray in chapter 3', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    const s = sable(world)!;
    expect(s.shadow).toBe(true);
    expect(s.stray).toBe(true);
    expect(s.trust).toBeLessThan(TRUST.wary);
    playScenes(world, events, { 'c3-open': 'slow' });
    expect(s.trust).toBeCloseTo(16, 0);
  });

  it('reaches Hazel’s Grove: bonded Sable, reconciled Corvin, loved Moss', () => {
    const { ending, world } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
        },
        9: (w) => {
          moss(w)!.needs.affection = 80;
        },
      },
    );
    expect(ending).toBe('hazels-grove');
    expect(world.campaign!.seen).toContain('end-hazels-grove');
  });

  it('reaches The Shadow’s Keeper when Corvin is not reconciled', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'force', 'c12-open': 'keep' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
        },
        9: (w) => {
          moss(w)!.needs.affection = 80;
        },
      },
    );
    expect(ending).toBe('shadow-keeper');
  });

  it('reaches Moss Sleeps when Moss was left unloved', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
        },
        9: (w) => {
          moss(w)!.needs.affection = 10;
        },
      },
    );
    expect(ending).toBe('moss-sleeps');
  });

  it('reaches Wild Grove by force and an open gate', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'force', 'c12-open': 'free' },
      { 7: (w) => (sable(w)!.trust = 50) },
    );
    expect(ending).toBe('wild-grove');
  });

  it('reaches The Empty Lantern when Sable is gone', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        11: (w) => {
          // She ran away and never came back.
          w.nubbins = w.nubbins.filter((n) => n.id !== c(w).sableId);
        },
      },
    );
    expect(ending).toBe('empty-lantern');
  });

  it('reaches The Collector after selling a Nubbin', () => {
    const { ending, world } = runCampaign(
      { 'c2-corvin': 'sell', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        1: (w, e) => {
          for (const n of w.nubbins) if (n.stage === 'egg') hatch(n, e, 0);
        },
      },
    );
    expect(ending).toBe('collector');
    expect(world.inventory.shells).toBeGreaterThanOrEqual(200);
    expect(world.strays.length).toBe(1);
  });

  it('buying back in chapter 9 escapes The Collector', () => {
    const { ending, world } = runCampaign(
      { 'c2-corvin': 'sell', 'c3-open': 'slow', 'c9-open': 'bargain', 'c12-open': 'keep' },
      {
        1: (w, e) => {
          for (const n of w.nubbins) if (n.stage === 'egg') hatch(n, e, 0);
        },
        7: (w) => (sable(w)!.trust = 50),
      },
    );
    expect(ending).toBe('long-road');
    expect(world.strays.length).toBe(0);
  });

  it('reaches Eternal Dawn when one of yours becomes Eternal', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
          c(w).flags.eternalRaised = true;
        },
      },
    );
    expect(ending).toBe('eternal-dawn');
  });

  it('reaches The Long Road by default', () => {
    const { ending } = runCampaign({
      'c2-corvin': 'refuse',
      'c3-open': 'slow',
      'c9-open': 'confront',
      'c12-open': 'keep',
    });
    expect(ending).toBe('long-road');
  });

  it('decides endings from flags in priority order', () => {
    const { world } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, []);
    const st = c(world);
    st.flags.soldNubbin = true;
    expect(endingFor(world, st)).toBe('collector');
    st.flags.boughtBack = true;
    expect(endingFor(world, st)).toBe('long-road');
  });

  it('survives a save round-trip mid-story', async () => {
    const { deserialize, serialize } = await import('../../src/sim/save');
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    const copy = deserialize(serialize(world, 0)).world;
    expect(copy.campaign?.chapter).toBe(3);
    expect(copy.npcs.length).toBe(world.npcs.length);
    expect(copy.nubbins.find((n) => n.id === copy.campaign?.sableId)?.shadow).toBe(true);
  });
});
