import { describe, expect, it } from 'vitest';
import { parseSession, toRework } from './playtest-tally';

const sheet = (aud: string, marks: string): string =>
  `Audience: ${aud}\n\n| # | Moment | Mark | Notes |\n| --- | --- | --- | --- |\n${marks}`;

describe('playtest tally (R0346)', () => {
  it('ignores an unfilled template and reads marks', () => {
    expect(parseSession('t.md', sheet('adult | parent-child', '| 1 | Gate | - | |'))).toBeNull();
    const s = parseSession('a.md', sheet('adult', '| 1 | Gate | L | |\n| 2 | Stone | n | |'))!;
    expect(s.marks.get(1)).toBe('L');
    expect(s.marks.get(2)).toBe('N');
  });

  it('flags a moment marked N in 3 sessions', () => {
    const mk = (m: string) =>
      parseSession('x.md', sheet('adult', `| 4 | Sneeze | ${m} | |\n| 5 | Rule | S | |`))!;
    expect(toRework([mk('N'), mk('N'), mk('S'), mk('N'), mk('L')])).toEqual([4]);
    expect(toRework([mk('N'), mk('N'), mk('S')])).toEqual([]);
  });
});
