/** Lane C round 7 (R0595): the content check's rule that a line reads only its own flags. */
import { describe, expect, it } from 'vitest';
import { CAMPAIGN_FLAGS } from '../../src/content/campaign';
import type { Storyline } from '../../src/content/types';
import { STORYLINE_CONTENT } from '../../src/sim/storyline-content';
import { lineFlagProblems, ruleFlags } from '../tools/line-flags';

describe('line flag namespace', () => {
  it('the shipped lines pass', () => {
    const rules = { hundred: ruleFlags("c.flags['hush-beaten'] = true;") };
    const problems = lineFlagProblems(STORYLINE_CONTENT, rules, new Set(CAMPAIGN_FLAGS));
    // Only rule-set flags are missing from this cut-down rule map; none reads Hazel's.
    expect(problems.filter((p) => p.includes("Hazel's"))).toEqual([]);
  });

  it("flags a line that reads one of Hazel's flags, and accepts spine:", () => {
    const hundred = STORYLINE_CONTENT.find((s) => s.id === 'hundred')!;
    const broken: Storyline = {
      ...hundred,
      chapters: [{ ...hundred.chapters[0]!, goal: 'flag:wisp&spine:wisp' }],
    };
    const problems = lineFlagProblems([broken], {}, new Set(CAMPAIGN_FLAGS));
    expect(CAMPAIGN_FLAGS).toContain('wisp');
    expect(problems).toEqual(["hundred: reads Hazel's flag wisp (use spine:wisp)"]);
  });

  it('reads rule-set flags from source, template prefixes included', () => {
    const f = ruleFlags("c.flags.area = 'x'; c.flags['l-end'] = e; c.flags[`b-wins-at-${n}`] = 1;");
    expect([...f].sort()).toEqual(['area', 'b-wins-at-*', 'l-end']);
  });
});
