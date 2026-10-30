import { describe, expect, it } from 'vitest';
import { BATTLE_QUIPS, type BattleLang, type QuipKind } from '../../src/config/strings-battle';
import { BATTLE_MOVE_TEXT } from '../../src/config/strings-battle-moves';
import { createBattle } from '../../src/sim/battle';
import { quipFor, quipIndex } from '../../src/sim/battle/lines';
import { hatch } from '../../src/sim/lifecycle';
import { createWorld } from '../../src/sim/world';

/** Round 5 (recs FIGHT-75): the comedy lines, at least two per event, picked from the seed. */
const LANGS: BattleLang[] = ['en', 'he', 'ja'];

describe('comedy lines (recs FIGHT-75)', () => {
  it('every kind has two lines or more in every language; tuck-ins three per personality', () => {
    for (const lang of LANGS)
      for (const [kind, lines] of Object.entries(BATTLE_QUIPS[lang]) as [QuipKind, string[]][]) {
        expect(lines.length, `${lang} ${kind}`).toBeGreaterThanOrEqual(2);
        if (kind.startsWith('tuckered') && kind !== 'tuckered' && lang === 'en')
          expect(lines.length, kind).toBeGreaterThanOrEqual(3);
      }
    expect(Object.keys(BATTLE_QUIPS.he).sort()).toEqual(Object.keys(BATTLE_QUIPS.en).sort());
    expect(Object.keys(BATTLE_QUIPS.ja).sort()).toEqual(Object.keys(BATTLE_QUIPS.en).sort());
  });

  it('lines stay short, with no em dashes', () => {
    for (const lang of LANGS)
      for (const lines of Object.values(BATTLE_QUIPS[lang]))
        for (const l of lines) {
          expect(l.length, l).toBeLessThanOrEqual(100);
          expect(l.includes('—'), l).toBe(false);
        }
  });

  it('picks by the seed and the log place: stable, and spread over the variants', () => {
    expect(quipIndex(7, 3, 'miss', 3)).toBe(quipIndex(7, 3, 'miss', 3));
    const seen = new Set(Array.from({ length: 40 }, (_, i) => quipIndex(7, i, 'miss', 3)));
    expect(seen.size).toBe(3);
  });

  it('a tuckered ally gets its personality line; a rival goes home; a wild one too', () => {
    const w = createWorld(9, 0);
    hatch(w.nubbins[0]!, [], 0);
    const s = createBattle(w, { kind: 'dojo', tier: 1, ids: [w.nubbins[0]!.id] }, 4)!;
    const me = s.sides[0][0]!;
    const foe = s.sides[1][0]!;
    me.personality = 'lazy';
    s.log = [
      { k: 'tuckered', who: me.id, side: 0 },
      { k: 'tuckered', who: foe.id, side: 1 },
      { k: 'miss', by: me.id, to: foe.id },
      { k: 'turnEnd', n: 1 },
    ];
    const name = (id: string) => (id === me.id ? 'Nono' : 'Tusk');
    const fill = (l: string) => l.replaceAll('{a}', 'Nono').replaceAll('{b}', 'Tusk');
    const foeFill = (l: string) => l.replaceAll('{a}', 'Tusk');
    expect(BATTLE_QUIPS.en.tuckeredLazy.map(fill)).toContain(quipFor(s, 0, name));
    expect(BATTLE_QUIPS.en.foeHome.map(foeFill)).toContain(quipFor(s, 1, name));
    expect(BATTLE_QUIPS.en.miss.map(fill)).toContain(quipFor(s, 2, name));
    expect(quipFor(s, 3, name)).toBeNull();
    foe.calm = 0;
    expect(BATTLE_QUIPS.en.wildHome.map(foeFill)).toContain(quipFor(s, 1, name));
    expect(quipFor(s, 0, name, 'ja')).toMatch(/Nono/);
  });

  it('the comedy move names are all there', () => {
    const names = [
      ...['Bonk', 'Noogie', 'Raspberry', 'Tickle Storm', 'Belly Flop', 'Pillow Fort'],
      ...['Nap Attack', 'Splash Back', 'Zoomies', 'Hug of Doom', 'Snack Attack'],
      ...['Polite Shove', 'Dramatic Gasp', 'Stare Contest'],
    ];
    const all = Object.values(BATTLE_MOVE_TEXT).map((t) => t.name);
    for (const n of names) expect(all, n).toContain(n);
  });
});
