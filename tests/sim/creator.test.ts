import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { COSMETICS } from '../../src/config/cosmetics';
import {
  CREATOR_LOOKS,
  creatorGrant,
  creatorTransform,
  creatorUnlock,
  isCreatorCode,
  pickProblem,
  sha256Hex,
  type CreatorPick,
} from '../../src/sim/creator';
import { isSinglePocket, stageInfo } from '../../src/sim/growth-stage';
import { hasRoom } from '../../src/sim/roster';
import { SPECIES } from '../../src/sim/species';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

const MIN = 60_000;

describe('sha256Hex', () => {
  it('matches the published vectors', () => {
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(sha256Hex('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('matches node:crypto on long and multi-block input', () => {
    const long = 'x7Q-'.repeat(250);
    expect(long).toHaveLength(1000);
    expect(sha256Hex(long)).toBe(createHash('sha256').update(long).digest('hex'));
    for (const len of [55, 56, 63, 64, 65, 119, 120]) {
      const s = 'a'.repeat(len);
      expect(sha256Hex(s)).toBe(createHash('sha256').update(s).digest('hex'));
    }
    const uni = 'héllo ✓';
    expect(sha256Hex(uni)).toBe(createHash('sha256').update(uni).digest('hex'));
  });
});

describe('isCreatorCode', () => {
  it('rejects wrong codes, empties, near misses, share codes and junk', () => {
    const bad = [
      '',
      '   ',
      'grove',
      'GROVE-',
      'GROVE-12345678',
      'GROVE-ABCDEFGH',
      'GROVE-CREATOR',
      'GROVE-0000-0000-0000',
      'GROVE1.AAAA',
      'GROVE1.' + 'A'.repeat(60),
      'letmein',
      'GROVE-' + 'A'.repeat(41),
      'x'.repeat(5000),
      'GROVE-ABCD EFGH',
    ];
    for (const c of bad) expect(isCreatorCode(c), c.slice(0, 20)).toBe(false);
  });

  it('is case-insensitive and trims, so a wrong code stays wrong in any case', () => {
    expect(isCreatorCode('  grove-abcd-efgh  ')).toBe(false);
    expect(isCreatorCode('\tGROVE-ABCD-EFGH\n')).toBe(false);
  });
});

describe('creatorUnlock', () => {
  it('a wrong code leaves the flag false and pushes no event', () => {
    const w = createWorld(3, 0);
    const events: SimEvent[] = [];
    expect(creatorUnlock(w, 'GROVE-NOT-THE-CODE', events)).toBe(false);
    expect(w.creator).toBe(false);
    expect(events).toEqual([]);
    applyCommand(w, { kind: 'creatorUnlock', code: 'wrong' }, events);
    expect(w.creator).toBe(false);
    expect(events).toEqual([]);
  });
});

describe('locked creator commands', () => {
  it('grant and transform refuse while world.creator is false', () => {
    const w = createWorld(3, 0);
    const events: SimEvent[] = [];
    const count = w.nubbins.length;
    const before = JSON.stringify(w.nubbins[0]);
    const pick: CreatorPick = { species: 'chao', stage: 'radiant', band: 'sun', type: 'power' };
    expect(creatorGrant(w, pick, events)).toBe(false);
    expect(creatorTransform(w, w.nubbins[0]!.id, pick, events)).toBe(false);
    applyCommand(w, { kind: 'creatorGrant', pick }, events);
    applyCommand(w, { kind: 'creatorTransform', nubbinId: w.nubbins[0]!.id, pick }, events);
    expect(w.nubbins).toHaveLength(count);
    expect(JSON.stringify(w.nubbins[0])).toBe(before);
    expect(events).toEqual([]);
  });
});

function open(seed = 4): World {
  const w = createWorld(seed, 0);
  w.nubbins = [];
  w.creator = true;
  return w;
}

function grant(w: World, pick: CreatorPick): Nubbin {
  const events: SimEvent[] = [];
  applyCommand(w, { kind: 'creatorGrant', pick }, events);
  expect(events.map((e) => e.kind)).toEqual(['creatorApplied']);
  return w.nubbins[w.nubbins.length - 1]!;
}

function settle(w: World, minutes = 3): void {
  for (let i = 0; i < minutes; i++) stepWorld(w, MIN);
}

const pocketBaby = SPECIES.find((s) => s.family === 'pocket' && s.stage === 'baby' && s.evolve)!;
const pocketFinal = SPECIES.find(
  (s) => s.family === 'pocket' && !s.evolve && !isSinglePocket(s.id),
)!;
const single = SPECIES.find((s) => isSinglePocket(s.id))!;
const digiBaby = SPECIES.find((s) => s.family === 'digi' && s.stage === 'baby')!;
const digiUltimate = SPECIES.find((s) => s.family === 'digi' && !s.evolve)!;

describe('creatorGrant is exact', () => {
  // Known src bug: applyPick treats a Chao (no `evolve` rule) as `later`, so a first-form pick
  // gets form.second set and reads as the second form. Expected failure; flip to `it` on fix.
  it('Chao first form: sun/power (stays young)', () => {
    const w = open();
    const n = grant(w, { species: 'chao', stage: 'first', band: 'sun', type: 'power' });
    expect(n.species).toBe('chao');
    expect(n.stage).toBe('adult');
    expect(n.form).toMatchObject({ band: 'sun', type: 'power' });
    expect(n.form?.radiant).toBeFalsy();
    expect(n.eternal).toBeNull();
    expect(stageInfo(n).key).toBe('young');
    settle(w);
    expect(stageInfo(n).key).toBe('young');
    expect(n.form).toMatchObject({ band: 'sun', type: 'power' });
  });

  it('Chao second form: moon/fly/swim', () => {
    const w = open();
    const n = grant(w, {
      species: 'chao',
      stage: 'second',
      band: 'moon',
      type: 'fly',
      second: 'swim',
    });
    expect(n.form).toMatchObject({ band: 'moon', type: 'fly', second: 'swim' });
    expect(stageInfo(n).key).toBe('grown');
    settle(w);
    expect(n.form).toMatchObject({ band: 'moon', type: 'fly', second: 'swim' });
    expect(stageInfo(n).key).toBe('grown');
  });

  it('Chao radiant: neutral/run', () => {
    const w = open();
    const n = grant(w, { species: 'chao', stage: 'radiant', band: 'neutral', type: 'run' });
    expect(n.form).toMatchObject({ band: 'neutral', type: 'run', radiant: true });
    expect(stageInfo(n).key).toBe('radiant');
    settle(w);
    expect(stageInfo(n).key).toBe('radiant');
  });

  it('Chao eternal: moon', () => {
    const w = open();
    const n = grant(w, { species: 'chao', stage: 'eternal', band: 'moon' });
    expect(n.eternal).toBe('moon');
    expect(n.form?.radiant).toBeFalsy();
    expect(stageInfo(n).key).toBe('eternal');
    settle(w);
    expect(n.eternal).toBe('moon');
    expect(stageInfo(n).key).toBe('eternal');
  });

  it('colour variants: jewel egg, two-tone, shiny, character look', () => {
    const w = open();
    const jewel = grant(w, { species: 'chao', stage: 'child', eggColor: 'ruby' });
    expect(jewel.eggColor).toBe('ruby');
    expect(jewel.stage).toBe('child');
    const two = grant(w, { species: 'chao', stage: 'child', eggColor: 'sky', tone: 'rose' });
    expect([two.eggColor, two.tone]).toEqual(['sky', 'rose']);
    const shiny = grant(w, { species: 'chao', stage: 'child', shiny: true });
    expect(shiny.shiny).toBe(true);
    const look = CREATOR_LOOKS[0]!;
    const dressed = grant(w, { species: 'chao', stage: 'child', look });
    expect(dressed.hat).toBe(look);
    settle(w);
    expect(jewel.eggColor).toBe('ruby');
    expect(two.tone).toBe('rose');
    expect(shiny.shiny).toBe(true);
    expect(dressed.hat).toBe(look);
  });

  it('an egg pick is an egg', () => {
    const w = open();
    const n = grant(w, { species: 'chao', stage: 'egg', eggColor: 'gold' });
    expect(n.stage).toBe('egg');
    expect(n.form).toBeNull();
    expect(n.eggColor).toBe('gold');
  });

  it.each([
    ['pocket', pocketBaby.id, 'child', 'hatchling'],
    ['pocket', pocketFinal.id, 'adult', null],
    ['pocket', pocketFinal.id, 'radiant', 'radiant'],
    ['pocket single', single.id, 'child', 'hatchling'],
    ['pocket single', single.id, 'radiant', 'radiant'],
    ['digi', digiBaby.id, 'child', null],
    ['digi', digiUltimate.id, 'adult', null],
  ] as const)('%s %s at %s', (_f, species, stage, key) => {
    const w = open();
    const n = grant(w, { species, stage });
    expect(n.species).toBe(species);
    expect(n.stage).toBe(stage === 'child' ? 'child' : 'adult');
    if (stage === 'radiant') expect(n.form?.radiant).toBe(true);
    else expect(n.form?.radiant).toBeFalsy();
    if (key) expect(stageInfo(n).key).toBe(key);
    const info = stageInfo(n);
    settle(w);
    expect(n.species).toBe(species);
    expect(stageInfo(n)).toEqual(info);
  });

  it('transform changes the Nubbin in place', () => {
    const w = open();
    const n = grant(w, { species: 'chao', stage: 'child' });
    const events: SimEvent[] = [];
    applyCommand(
      w,
      {
        kind: 'creatorTransform',
        nubbinId: n.id,
        pick: { species: pocketFinal.id, stage: 'radiant' },
      },
      events,
    );
    expect(w.nubbins).toHaveLength(1);
    expect(n.species).toBe(pocketFinal.id);
    expect(n.form?.radiant).toBe(true);
    expect(events.map((e) => e.kind)).toEqual(['creatorApplied']);
    expect(creatorTransform(w, 'nope', { species: 'chao', stage: 'child' }, [])).toBe(false);
  });

  it('respects the roster cap', () => {
    const w = open();
    let guard = 0;
    while (hasRoom(w) && guard++ < 50) grant(w, { species: 'chao', stage: 'child' });
    const full = w.nubbins.length;
    expect(full).toBeGreaterThan(0);
    const events: SimEvent[] = [];
    expect(creatorGrant(w, { species: 'chao', stage: 'child' }, events)).toBe(false);
    expect(w.nubbins).toHaveLength(full);
    expect(events).toEqual([]);
  });
});

describe('pickProblem', () => {
  const ok = (p: CreatorPick) => expect(pickProblem(p)).toBeNull();
  const bad = (p: CreatorPick) => expect(pickProblem(p)).not.toBeNull();

  it('accepts valid picks', () => {
    ok({ species: 'chao', stage: 'radiant' });
    ok({ species: pocketFinal.id, stage: 'radiant' });
    ok({ species: digiUltimate.id, stage: 'adult' });
  });

  it('rejects an unknown species', () => bad({ species: 'nope', stage: 'child' }));

  it('rejects Chao-only stages on other families', () => {
    for (const stage of ['first', 'second', 'eternal'] as const) {
      bad({ species: pocketFinal.id, stage });
      bad({ species: digiBaby.id, stage });
    }
  });

  it('rejects radiant on a digital species and on one that still evolves', () => {
    bad({ species: digiUltimate.id, stage: 'radiant' });
    bad({ species: pocketBaby.id, stage: 'radiant' });
  });

  it('rejects stage mismatches for non-Chao species', () => {
    bad({ species: pocketFinal.id, stage: 'child' });
    bad({ species: pocketBaby.id, stage: 'adult' });
    bad({ species: 'chao', stage: 'adult' });
  });

  it('rejects unknown colours, looks, bands and types', () => {
    bad({ species: 'chao', stage: 'child', eggColor: 'chartreuse' });
    bad({ species: 'chao', stage: 'child', tone: 'chartreuse' });
    bad({ species: 'chao', stage: 'child', look: 'look-nonexistent' });
    bad({ species: 'chao', stage: 'child', look: 'hat-plain' });
    bad({ species: 'chao', stage: 'first', band: 'void' as never });
    bad({ species: 'chao', stage: 'first', type: 'magic' as never });
    bad({ species: 'chao', stage: 'second', second: 'magic' as never });
  });

  it('every listed look is a real cosmetic', () => {
    expect(CREATOR_LOOKS.length).toBeGreaterThan(0);
    for (const l of CREATOR_LOOKS) expect(COSMETICS.some((c) => c.id === l)).toBe(true);
  });
});
