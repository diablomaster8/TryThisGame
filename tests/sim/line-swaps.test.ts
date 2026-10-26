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

  // Review 2026-10-26 (SR-1043, 1046, 1057, 1059, 1060, 1069, 1070): each flag value changes
  // exactly the expected line in every band, and nothing changes while the flag is unset.
  const FLAGGED: Array<{
    id: string;
    set: (st: ReturnType<typeof c>) => void;
    // The changed or added line's opening words, by band (null: that band is untouched).
    want: Record<'main' | 'sprout' | 'reader', string | null>;
    added: boolean;
  }> = [
    {
      id: 's3-moot',
      set: (st) => (st.flags['s3-seat'] = 'gap'),
      want: { main: 'I hear somebody', sprout: 'I hear you sat', reader: 'I hear somebody' },
      added: true,
    },
    {
      id: 's1-boats',
      set: (st) => (st.flags['s1-boat'] = 'sail'),
      want: {
        main: 'Moss’s boat, you notice',
        sprout: 'Moss’s boat has a sail',
        reader: 'Moss’s boat, you notice',
      },
      added: true,
    },
    {
      id: 's1-cinder',
      set: (st) => (st.flags['s1-pace'] = 'offered'),
      want: {
        main: 'All four home. You offered',
        sprout: 'All four are home. You offered',
        reader: 'All four home. You offered',
      },
      added: false,
    },
    {
      id: 'c10-dawn',
      set: (st) => (st.flags.mossReturned = false),
      want: {
        main: 'Somebody laughs, once',
        sprout: 'Someone laughs, then stops',
        reader: 'It goes a very long way. Somebody laughs',
      },
      added: false,
    },
    {
      id: 'c10-kept',
      set: (st) => (st.flags.stoneBearer = 'sable'),
      want: { main: 'Sable walks home', sprout: 'Sable walks home', reader: 'Sable walks home' },
      added: true,
    },
    ...['end-hazels-grove', 'end-hazels-grove-open'].map((id) => ({
      id,
      set: (st: ReturnType<typeof c>) => (st.flags.stoneBearer = 'moss'),
      want: { main: 'You never wonder', sprout: null, reader: 'Some nights, half asleep' },
      added: false,
    })),
    {
      id: 'end-moss-sleeps',
      set: () => undefined,
      want: {
        main: 'Some evenings you think',
        sprout: 'Some evenings you see',
        reader: 'Some evenings you think',
      },
      added: false,
    },
  ];

  for (const { id, set, want, added } of FLAGGED) {
    it(`${id} swaps its flagged line in each band`, () => {
      for (const band of ['main', 'sprout', 'reader'] as const) {
        const { world, st } = lateWorld();
        // end-moss-sleeps keeps Sable's light only when the player saw it arrive.
        if (id === 'end-moss-sleeps') st.seen.push('c10-moss-light');
        const plain = sceneFor(world, id, band)!.lines.map((l) => l.text);
        const opening = want[band];
        if (id === 'end-moss-sleeps') st.seen.pop();
        set(st);
        const lines = sceneFor(world, id, band)!.lines.map((l) => l.text);
        if (!opening) {
          expect(lines, `${id} ${band}`).toEqual(plain);
          continue;
        }
        expect(lines.length, `${id} ${band}`).toBe(plain.length + (added ? 1 : 0));
        const changed = lines.filter((t) => !plain.includes(t));
        expect(changed.length, `${id} ${band}`).toBeGreaterThan(0);
        expect(changed[0]!.startsWith(opening), `${id} ${band}: ${changed[0]}`).toBe(true);
        for (const t of changed) expect(t.length).toBeLessThanOrEqual(160);
      }
    });
  }

  it('end-hazels-grove no longer asks “which one” once Moss bore the stone', () => {
    const { world, st } = lateWorld();
    st.flags.stoneBearer = 'moss';
    for (const band of ['main', 'reader'] as const)
      expect(
        sceneFor(world, 'end-hazels-grove', band)!.lines.some((l) => l.text.includes('which one')),
      ).toBe(false);
    st.flags.stoneBearer = 'sable';
    expect(
      sceneFor(world, 'end-hazels-grove')!.lines.some((l) => l.text.includes('which one')),
    ).toBe(true);
  });

  it('end-moss-sleeps drops the floating light in main when it was never seen', () => {
    const { world } = lateWorld();
    const lines = sceneFor(world, 'end-moss-sleeps')!.lines.map((l) => l.text);
    expect(lines.some((t) => t.startsWith('It floats beside hers'))).toBe(false);
    expect(lines).toContain('Then she turns her head, and it’s only the lantern.');
  });

  it('s3-moot: Hazel’s gap line follows Fern’s, and the Bramble line still follows the rail', () => {
    const { world, st } = lateWorld();
    st.flags['s3-seat'] = 'gap';
    st.flags.s8Done = true;
    const lines = sceneFor(world, 's3-moot')!.lines;
    const again = lines.findIndex((l) => l.text.startsWith('She’s done it again.'));
    expect(lines[again + 1]!.who).toBe('hazel');
    const rail = lines.findIndex((l) => l.text.startsWith('Bramble went over that rail'));
    expect(lines[rail + 1]!.text.startsWith('And she came home anyway.')).toBe(true);
  });
});
