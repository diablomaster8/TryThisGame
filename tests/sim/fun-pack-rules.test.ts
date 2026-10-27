import { describe, expect, it } from 'vitest';
import {
  QUESTS_SUNNY,
  QUESTS_SUNNY_FLAGS,
  QUESTS_SUNNY_PAYOFFS,
  QUESTS_SUNNY_VARIANT_FLAGS,
} from '../../src/content/index';
import { EDU_VARIANTS } from '../../src/content/edu';
import { FUN_PACK_RULES, SUNNY_PAYOFFS, SUNNY_VARIANT_FLAGS } from '../../src/sim/fun-pack-rules';
import { sideVariant } from '../../src/sim/side-stories';
import { sceneById } from '../../src/sim/story-scenes';
import type { CampaignState, World } from '../../src/sim/types';
import { c, campaignWorld } from './campaign-driver';

/**
 * Run 23's wiring (SR-20261027-1304 and the fix-A, fix-B, fix-D reports): the Python, Bean
 * and Sunny variants and payoff scenes are picked by their own pack's flags, and S30's ring
 * and S31's refused witness pick their written variants.
 */
const world = {} as World;
const camp = (flags: Record<string, string | boolean>, fun: Record<string, unknown> = {}) =>
  ({ flags, fun }) as unknown as CampaignState;
const variantOf = (quest: string, flags: Record<string, string | boolean>, scene: string) =>
  FUN_PACK_RULES[quest]!.variant!(world, camp(flags), scene);

describe('the Python and Bean variants', () => {
  it('replace each complete scene by the choice it answers, in both bands too', () => {
    const cases: [string, Record<string, string | boolean>, string, string][] = [
      ['q04', { 'q04-kept': true }, 'q04-complete', 'q04-complete-kept'],
      ['q04', { 'q04-shared': true }, 'q04-complete', 'q04-complete-shared'],
      ['q06', { 'q06-shouted': true, 'q06-laughed': true }, 'q06-complete', 'q06-complete-shouted'],
      ['q06', { 'q06-laughed': true }, 'q06-complete', 'q06-complete-laughed'],
      ['q06', { 'q06-knocked': true }, 'q06-complete', 'q06-complete-knocked'],
      ['q09', { 'q09-ruling': 'themselves' }, 'q09-complete', 'q09-complete-themselves'],
      ['q09', { 'q09-ruling': 'both' }, 'q09-complete', 'q09-complete-pebble'],
      ['q09', { 'q09-ruling': 'neither' }, 'q09-complete', 'q09-complete-pebble'],
      ['q27', { 'q27-wanted-to-tell': true }, 'q27-complete', 'q27-complete-told'],
    ];
    for (const [quest, flags, scene, want] of cases) {
      expect(variantOf(quest, flags, scene), want).toBe(want);
      expect(sceneById(want), want).toBeDefined();
      for (const band of ['sprout', 'reader'] as const)
        expect(
          EDU_VARIANTS[band].some((e) => e.of === want),
          `${band}:${want}`,
        ).toBe(true);
    }
    // No flag, or another scene: the scene as written.
    for (const q of ['q04', 'q06', 'q09', 'q27'])
      expect(variantOf(q, {}, `${q}-complete`)).toBe(`${q}-complete`);
    expect(variantOf('q04', { 'q04-kept': true }, 'q04-intro')).toBe('q04-intro');
  });
});

describe('the Sunny payoffs', () => {
  it('copy the script’s tables exactly', () => {
    expect(SUNNY_VARIANT_FLAGS).toEqual(QUESTS_SUNNY_VARIANT_FLAGS);
    expect(SUNNY_PAYOFFS).toEqual(QUESTS_SUNNY_PAYOFFS);
  });

  it('pick the variant scenes by their flag', () => {
    expect(variantOf('q37', { 'q37-calm': 'rook' }, 'q37-sun-keeper')).toBe('q37-sun-keeper-rook');
    expect(variantOf('q37', { 'q37-calm': 'mags' }, 'q37-finale')).toBe('q37-finale-mags');
    expect(variantOf('q45', { 'q31-deal': 'warned' }, 'q45-practice-done')).toBe(
      'q45-practice-done-warned',
    );
    expect(variantOf('q45', { 'q45-hedge': 'doubled' }, 'q45-complete')).toBe(
      'q45-complete-doubled',
    );
    // q45-complete's base reading is 'quiet': no such scene is written, so the runner
    // (variantOf in side-stories.ts) falls back to the scene as written.
    const quiet = variantOf('q45', { 'q45-hedge': 'quiet' }, 'q45-complete');
    expect(sceneById(quiet)).toBeUndefined();
    for (const id of ['q45-complete-exposed', 'q45-complete-doubled', 'q37-finale-dabney'])
      expect(sceneById(id), id).toBeDefined();
  });

  it('give Q39 its poster once Q35 is done', () => {
    const r = FUN_PACK_RULES.q39!.variant!;
    expect(r(world, camp({}), 'q39-complete')).toBe('q39-complete');
    expect(r(world, camp({}, { q35: { status: 'done' } }), 'q39-complete')).toBe(
      'q39-complete-poster',
    );
    expect(sceneById('q39-complete-poster')).toBeDefined();
  });

  it('play `<flag>-is-<value>` before and after steps, in list order', () => {
    const q33 = FUN_PACK_RULES.q33!.before!;
    expect(q33(world, camp({ 'q33-label': 'spin', 'q33-drink': 'sip' }), 2)).toEqual([
      'q33-drink-is-sip',
      'q33-label-is-spin',
    ]);
    expect(q33(world, camp({ 'q33-drink': 'sip' }), 1)).toEqual([]);
    expect(FUN_PACK_RULES.q42!.after!(world, camp({ 'q42-believe': false }), 2)).toEqual([
      'q42-believe-is-false',
    ]);
    // A value with no written scene is left out rather than holding the step.
    expect(q33(world, camp({ 'q33-drink': 'nonsense' }), 2)).toEqual([]);
  });

  it('have a written scene for every value of every choice flag the tables name', () => {
    const values = new Map<string, Set<string>>();
    for (const q of QUESTS_SUNNY)
      for (const s of [...q.steps.flatMap((x) => [x.scene, x.done]), q.complete])
        for (const ch of s?.choices ?? [])
          for (const [k, v] of Object.entries(ch.set ?? {}))
            (values.get(k) ?? values.set(k, new Set()).get(k)!).add(String(v));
    const named = Object.values(SUNNY_PAYOFFS).flatMap((p) =>
      [...Object.values(p.before ?? {}), ...Object.values(p.after ?? {})].flat(),
    );
    for (const f of named)
      for (const v of values.get(f) ?? [])
        expect(sceneById(`${f}-is-${v}`), `${f}-is-${v}`).toBeDefined();
    // Every Sunny choice flag is read by a variant or a payoff.
    const read = new Set([...named, ...Object.values(SUNNY_VARIANT_FLAGS), 'q35-spirit']);
    for (const f of QUESTS_SUNNY_FLAGS) expect(read.has(f), f).toBe(true);
  });
});

describe('S30 and S31 variants', () => {
  it('close S30 by the ring answer', () => {
    const { world: w } = campaignWorld();
    expect(sideVariant(w, c(w), 's30', 's30-complete')).toBe('s30-complete');
    for (const ring of ['broke', 'sat', 'helped']) {
      c(w).flags['s30-ring'] = ring;
      expect(sideVariant(w, c(w), 's30', 's30-complete')).toBe(`s30-complete-${ring}`);
    }
    // Only 'helped' changes the earlier scenes.
    c(w).flags['s30-ring'] = 'broke';
    expect(sideVariant(w, c(w), 's30', 's30-hill')).toBe('s30-hill');
  });

  it('change S31’s kick and rock when you refused to witness', () => {
    const { world: w } = campaignWorld();
    expect(sideVariant(w, c(w), 's31', 's31-kick')).toBe('s31-kick');
    expect(sideVariant(w, c(w), 's31', 's31-rock')).toBe('s31-rock');
    c(w).flags['s31-witness'] = 'refused';
    expect(sideVariant(w, c(w), 's31', 's31-kick')).toBe('s31-kick-refused');
    expect(sideVariant(w, c(w), 's31', 's31-rock')).toBe('s31-rock-refused');
    for (const id of ['s31-kick-refused', 's31-rock-refused', 's30-complete-broke'])
      for (const band of ['sprout', 'reader'] as const)
        expect(
          EDU_VARIANTS[band].some((e) => e.of === id),
          `${band}:${id}`,
        ).toBe(true);
  });
});
