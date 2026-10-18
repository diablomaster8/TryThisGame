import { describe, expect, it } from 'vitest';
import { eduSceneFor } from '../../src/content/edu';
import { registerEduScenes, sceneFor } from '../../src/sim/story-scenes';
import { c, campaignWorld } from './campaign-driver';

/**
 * The line swaps from the scene notes, in the main game and in both Learning Grove
 * bands. A band's rewritten scene is matched line by line, so a swap lands at the same
 * place; a band without that scene reads the main one.
 */
registerEduScenes(eduSceneFor);

function lateWorld() {
  const { world } = campaignWorld();
  const st = c(world);
  st.chapter = 11;
  return { world, st };
}

describe('line swaps in every band', () => {
  it('c11-close: S8’s empty arm and the evening Corvin asks, in main and reader', () => {
    const { world, st } = lateWorld();
    st.flags.s8Done = true;
    st.seen.push('s9-ask');
    const main = sceneFor(world, 'c11-close')!;
    expect(main.lines[1]!.text).toBe('Then comes the evening Corvin asks at the gate.');
    expect(main.lines.some((l) => l.text.startsWith('Hazel’s arm is empty now.'))).toBe(true);
    expect(main.lines.some((l) => l.text.startsWith('The thin grey Nubbin wakes'))).toBe(false);
    const reader = sceneFor(world, 'c11-close', 'reader')!;
    expect(reader.lines).not.toEqual(main.lines);
    expect(reader.lines[1]!.text).toBe('Then comes the evening Corvin asks at the gate.');
    expect(reader.lines.some((l) => l.text.startsWith('Hazel’s arm is empty now.'))).toBe(true);
    // Sprout has no c11-close of its own: it reads the main scene, swapped, with its words.
    const sprout = sceneFor(world, 'c11-close', 'sprout')!;
    expect(sprout.lines[1]!.text).toBe('Then one evening, Corvin comes to the gate.');
  });

  it('c12-open splices the walled garden in every band', () => {
    const { world, st } = lateWorld();
    for (const band of ['main', 'sprout', 'reader'] as const) {
      st.flags.hushGarden = false;
      const before = sceneFor(world, 'c12-open', band)!;
      st.flags.hushGarden = true;
      const scene = sceneFor(world, 'c12-open', band)!;
      // Each band splices its own telling of the garden, right after Hazel starts walking.
      const garden = sceneFor(world, 'c12-wall-garden', band)!;
      expect(scene.lines.length, band).toBe(before.lines.length + garden.lines.length);
      const at = scene.lines.findIndex((l) => l.text === garden.lines[0]!.text);
      expect(at, band).toBeGreaterThan(0);
      expect(scene.lines[at - 1]!.text, band).toMatch(/^(Gran )?Hazel walks/);
    }
  });

  it('s3-moot gains Fern’s line about Bramble once S8 is done', () => {
    const { world, st } = lateWorld();
    const before = sceneFor(world, 's3-moot')!;
    expect(before.lines.some((l) => l.text.startsWith('And she came home anyway.'))).toBe(false);
    st.flags.s8Done = true;
    for (const band of ['main', 'reader'] as const) {
      const lines = sceneFor(world, 's3-moot', band)!.lines;
      const rail = lines.findIndex((l) => l.text.startsWith('Bramble went over that rail'));
      const i = lines.findIndex((l) => l.text.startsWith('And she came home anyway.'));
      expect(i, band).toBeGreaterThan(-1);
      if (rail >= 0) expect(i).toBe(rail + 1);
      expect(lines[i]!.who).toBe('fern');
    }
  });

  it('the kept stone stills your Nubbin through S24', () => {
    const { world, st } = lateWorld();
    const free = sceneFor(world, 's24-tea')!;
    expect(free.lines.some((l) => l.text.startsWith('Your Nubbin runs to her'))).toBe(true);
    st.flags.keptStone = true;
    for (const id of ['s24-tea', 's24-tea-moss-stayed', 's24-pack', 's24-rock']) {
      const lines = sceneFor(world, id)!.lines;
      expect(
        lines.some((l) => /Your Nubbin (runs|is off|is already)/.test(l.text)),
        id,
      ).toBe(false);
    }
    expect(
      sceneFor(world, 's24-tea')!.lines.some((l) =>
        l.text.startsWith('Your Nubbin goes and sits by her'),
      ),
    ).toBe(true);
  });

  it('S6’s register on loan and S17’s nursery line keep their place in each band', () => {
    const { world, st } = lateWorld();
    st.flags['s18-centre'] = 'register';
    st.flags['s17-nursery'] = 'open';
    for (const band of ['main', 'sprout', 'reader'] as const) {
      expect(sceneFor(world, 's6-register', band)!.lines[0]!.text.startsWith('On the')).toBe(true);
      const nursery = sceneFor(world, 's17-complete', band)!.lines[3]!.text;
      expect(nursery.includes('lantern') && nursery.includes('roof')).toBe(true);
    }
  });
});
