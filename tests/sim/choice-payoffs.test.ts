/**
 * The ten S1–S5 choice flags the review found unread (2026-10-18): each value now adds one
 * line to a scene three or more stories later, in the main game and in both Learning
 * Grove bands. A payoff whose anchor line is missing would fail silently in play, so every
 * anchor is checked here.
 */
import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import { registerEduContent, registerSideStories, sceneFor } from '../../src/sim/story-scenes';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { c, campaignWorld } from './campaign-driver';

registerSideStories(SIDE_STORY_CONTENT);
registerEduContent(EDU);

/**
 * Extra rules for a case: `lines` is how many lines each value adds (s20-counters' Gordon
 * cry gets his reply too, so it is per value); `swap` means the payoff rewrites one line
 * instead of adding one; `quiet` values must leave the scene as written; `setup` flags are
 * set first (s24-badges pays off only if S14 came before S20).
 */
interface CaseOpts {
  lines?: Record<string, number>;
  swap?: boolean;
  quiet?: Array<string | boolean>;
  setup?: Record<string, string | boolean>;
}

const CASES: Array<
  [scene: string, flag: string, values: Array<string | boolean>, opts?: CaseOpts]
> = [
  ['s2-night', 's2-early', ['fed', 'shooed', 'waited']],
  ['s2-night', 's2-carried', [true, false]],
  ['s19-climb', 's1-pace', ['walk', 'offered', 'asked']],
  ['s26-bench', 's1-sat', [true]],
  ['s26-bench', 's1-asked-why', [true]],
  ['s30-party', 's3-seat', ['gap', 'sun', 'moon']],
  ['s28-for-byte', 's3-byte', ['science', 'nicely']],
  ['s23-stove', 's3-shown', ['together', 'apart']],
  ['s19-marina', 's4-swim', ['with', 'trust']],
  ['s10-letter', 's4-gate', ['lift-push', 'nubbin', 'note']],
  ['s10-letter-told', 's4-gate', ['lift-push', 'nubbin', 'note']],
  ['s18-fossils', 's5-carry', ['egg', 'shoulder']],
  ['s18-shore', 's5-holder', ['yours', 'marina']],
  ['c10-dawn', 'c4-lamps', ['remember', 'home', 'together', 'dunno']],
  ['c9-open', 'c5-race', ['want', 'win', 'home']],
  ['c9-open-sold', 'c5-race', ['want', 'win', 'home']],
  ['lj3-s2-done', 'lj3-race', ['fair', 'head', 'sparks']],
  ['lj4-s1-done', 'lj4-bento', ['beans', 'cucumber', 'lettuce']],
  ['s7-week', 's7-lever', [true]],
  ['s7-lap', 's7-watch-down', [true]],
  ['s12-complete', 's12-solo', ['hum', 'alone', 'gaps']],
  ['s10-cheer', 's10-racer', ['fast', 'slow']],
  ['s13-sluice', 's13-rats', ['fed', 'crept']],
  ['s16-week', 's16-tired', ['grove', 'morale', 'wild']],
  ['s10-step', 's16-tired', ['grove', 'morale', 'wild']],
  ['s17-hatching', 's17-approach', ['wait', 'sneak']],
  ['s18-complete', 's18-entry', ['free', 'shells']],
  ['s19-sit', 's19-with', ['moss'], { quiet: ['sable', 'alone'] }],
  ['s20-counters', 's20-cry', ['fort', 'mittens', 'gordon'], { lines: { gordon: 2 } }],
  ['s20-count', 's20-merge', ['gate', 'carried'], { quiet: ['middle'] }],
  ['s24-badges', 's20-round2', ['waited', 'pressed'], { setup: { s14Done: true } }],
  ['s24-stowaway-knows', 's14-lair', ['rolled', 'asked'], { swap: true, quiet: ['sat'] }],
  ['s27-carry-clank', 's21-lesson', ['step', 'sit']],
  ['s28-logged', 's21-byte', ['fair', 'unfair']],
  ['s28-logged-unverified', 's21-byte', ['fair', 'unfair']],
  ['s28-logged-none', 's21-byte', ['fair', 'unfair']],
];

describe('S1–S5 choices pay off later', () => {
  for (const [scene, flag, values, opts = {}] of CASES) {
    it(`${flag} in ${scene}`, () => {
      for (const band of ['main', 'sprout', 'reader'] as const) {
        const { world } = campaignWorld();
        Object.assign(c(world).flags, opts.setup);
        const plain = sceneFor(world, scene, band)!;
        expect(plain, `${scene} ${band}`).toBeDefined();
        for (const v of opts.quiet ?? []) {
          c(world).flags[flag] = v;
          expect(sceneFor(world, scene, band)!.lines, `${scene} ${band} ${flag}=${v}`).toEqual(
            plain.lines,
          );
        }
        const added = new Set<string>();
        for (const v of values) {
          c(world).flags[flag] = v;
          const lines = sceneFor(world, scene, band)!.lines;
          const n = opts.swap ? 0 : (opts.lines?.[String(v)] ?? 1);
          expect(lines.length, `${scene} ${band} ${flag}=${v}`).toBe(plain.lines.length + n);
          const extras = lines.filter((l) => !plain.lines.some((p) => p.text === l.text));
          expect(extras.length, `${scene} ${band} ${flag}=${v}`).toBe(n || 1);
          for (const extra of extras) {
            expect(extra.text.length).toBeLessThanOrEqual(160);
            if (band === 'sprout') expect(extra.text.split(/\s+/).length).toBeLessThanOrEqual(14);
            if (band === 'reader') expect(extra.text.split(/\s+/).length).toBeLessThanOrEqual(30);
          }
          added.add(extras.map((l) => l.text).join(' | '));
        }
        // Each value reads differently.
        expect(added.size).toBe(values.length);
        delete c(world).flags[flag];
      }
    });
  }

  it('leaves the gate alone when Open took it away', () => {
    const { world } = campaignWorld();
    c(world).flags.letThemGo = true;
    const open = sceneFor(world, 's10-letter')!.lines.length;
    c(world).flags['s4-gate'] = 'note';
    expect(sceneFor(world, 's10-letter')!.lines.length).toBe(open);
  });

  it('gives Tilly no snow-fort badge when Bodge commanded the other fort', () => {
    const { world } = campaignWorld();
    const plain = sceneFor(world, 's24-badges')!.lines.length;
    c(world).flags['s20-round2'] = 'waited';
    expect(sceneFor(world, 's24-badges')!.lines.length).toBe(plain);
  });
});

describe('c10-wisp names the stone’s bearer (review SR-20261022-54)', () => {
  it('in main and reader, and leaves sprout alone', () => {
    for (const band of ['main', 'sprout', 'reader'] as const) {
      const { world } = campaignWorld();
      const plain = sceneFor(world, 'c10-wisp', band)!.lines.map((l) => l.text);
      for (const [bearer, name] of [
        ['sable', 'Sable'],
        ['moss', 'Moss'],
      ] as const) {
        c(world).flags.stoneBearer = bearer;
        const lines = sceneFor(world, 'c10-wisp', band)!.lines.map((l) => l.text);
        const named = lines.filter((t) => t.startsWith(`In the shallows, ${name} stands`));
        if (band === 'sprout') expect(lines).toEqual(plain);
        else expect(named, `${band} ${bearer}`).toHaveLength(1);
      }
    }
  });
});
