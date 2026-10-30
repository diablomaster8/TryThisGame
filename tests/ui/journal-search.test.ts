import { describe, expect, it } from 'vitest';
import {
  endingShelf,
  filterRows,
  lineMinutesLeft,
  matchesQuery,
  type JournalChip,
  type QuestRow,
} from '../../src/ui/journal-search';

const row = (over: Partial<QuestRow>): QuestRow => ({
  id: 'x',
  title: 'A Quest',
  giver: 'Someone',
  area: 'The Falls',
  kind: 'story',
  audience: 'all',
  state: 'open',
  ...over,
});

const rows: QuestRow[] = [
  row({ id: 'q1', title: 'Bring Me a Shrubbery', giver: 'The Tall Hood', kind: 'caper' }),
  row({ id: 's1', title: 'The Lost Lamb', giver: 'Fern', area: 'Valley Square' }),
  row({ id: 's2', title: 'Night Fishing', audience: 'teen', state: 'done' }),
  row({ id: 'q9', title: 'A Late Caper', kind: 'caper', audience: 'adult' }),
  row({ id: 'e1', title: 'Feed 3 Nubbins', giver: 'Hazel', area: '', kind: 'errand' }),
];

const ids = (q: string, chips: JournalChip[] = []) =>
  filterRows(rows, q, new Set(chips)).map((r) => r.id);

describe('journal search (R0665)', () => {
  it('finds Q1 by part of its title, case and accents aside', () => {
    expect(ids('shrub')).toEqual(['q1']);
    expect(ids('SHRÚB')).toEqual(['q1']);
  });

  it('matches the giver and the area, every word', () => {
    expect(ids('fern')).toEqual(['s1']);
    expect(ids('valley lamb')).toEqual(['s1']);
    expect(ids('valley fishing')).toEqual([]);
    expect(matchesQuery(rows[0]!, '   ')).toBe(true);
  });

  it('chips of a group widen, groups narrow', () => {
    expect(ids('', ['caper'])).toEqual(['q1', 'q9']);
    expect(ids('', ['caper', 'errand'])).toEqual(['q1', 'q9', 'e1']);
    expect(ids('', ['caper', 'adult'])).toEqual(['q9']);
    expect(ids('', ['teen', 'adult'])).toEqual(['s2', 'q9']);
    expect(ids('', ['done'])).toEqual(['s2']);
    expect(ids('', [])).toHaveLength(rows.length);
  });
});

describe('a line’s time left (R0635)', () => {
  it('counts the current chapter and the rest', () => {
    expect(lineMinutesLeft(2, 10, 3)).toBe(27);
    expect(lineMinutesLeft(10, 10, 3)).toBe(3);
    expect(lineMinutesLeft(12, 10, 3)).toBe(3);
  });
});

describe('the endings shelf (R0642)', () => {
  const spine = Object.fromEntries(
    ['long-road', 'a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id) => [
      id,
      { title: `T ${id}`, how: `how ${id}` },
    ]),
  );
  const hundred = Object.fromEntries(
    ['w', 'x', 'y', 'z'].map((id) => [id, { title: `T ${id}`, how: `how ${id}` }]),
  );

  it('after long-road: 1/8 with 7 hints; an unended road has no hints', () => {
    const [s, h] = endingShelf([
      { id: 'hazel', title: 'Hazel', endings: spine, reached: new Set(['long-road']) },
      { id: 'hundred', title: 'Hundred', endings: hundred, reached: new Set() },
    ]);
    expect([s!.got, s!.of]).toEqual([1, 8]);
    expect(s!.items.filter((i) => i.hint).length).toBe(7);
    expect(s!.items.find((i) => i.id === 'long-road')).toMatchObject({
      reached: true,
      title: 'T long-road',
      hint: null,
    });
    expect(s!.items.find((i) => i.id === 'a')).toMatchObject({ title: null, hint: 'how a' });
    expect([h!.got, h!.of]).toEqual([0, 4]);
    expect(h!.items.every((i) => i.hint === null && i.title === null)).toBe(true);
  });
});
