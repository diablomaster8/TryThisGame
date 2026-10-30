import { beforeEach, describe, expect, it, vi } from 'vitest';

const played: string[] = [];
vi.mock('../../src/platform/audio', async (orig) => {
  const real = await orig<typeof import('../../src/platform/audio')>();
  return { ...real, playSound: (n: string) => played.push(n) };
});

import { battleSfx, battleSong } from '../../src/ui/battle-sfx';
import { playSound, isAudioUnlocked } from '../../src/platform/audio';
import type { BattleEvent } from '../../src/sim/battle/types';

/** Battle sound (recs FIGHT-76): each event kind triggers its sound once, silent before a tap. */
const hit = (move: string): BattleEvent => ({
  k: 'hit',
  by: 'a',
  to: 'b',
  dmg: 3,
  strong: false,
  guarded: false,
  move,
});

describe('battle sound effects', () => {
  beforeEach(() => (played.length = 0));

  it('each event kind triggers its own sound exactly once', () => {
    const events: BattleEvent[] = [
      hit('bonk'),
      hit('bubble-blow'),
      hit('zip-zap'),
      { k: 'boing', who: 'a', dmg: 1 },
      { k: 'tuckered', who: 'b', side: 1 },
      { k: 'turnEnd', n: 1 },
    ];
    for (const e of events) {
      const s = battleSfx(e);
      if (s) playSound(s);
    }
    expect(played).toEqual(['woodblock', 'splash', 'patter', 'boing', 'yawn']);
    expect(battleSfx(hit('gust-pat'))).toBe('swish');
  });

  it('is silent before the first tap: the real player needs an unlocked context', async () => {
    const real = await vi.importActual<typeof import('../../src/platform/audio')>(
      '../../src/platform/audio',
    );
    expect(isAudioUnlocked()).toBe(false);
    expect(() => real.playSound('woodblock')).not.toThrow();
    expect(() => real.playSong('battle')).not.toThrow();
    expect(real.SONG_NAMES).toEqual(expect.arrayContaining(['battle', 'circuit', 'calm']));
  });

  it('picks the Circuit fanfare, the calm lullaby or the battle theme', () => {
    expect(battleSong(null)).toBe('battle');
    expect(battleSong({ context: { kind: 'circuit' }, sides: [[], []] } as never)).toBe('circuit');
    expect(battleSong({ context: { kind: 'dojo' }, gentle: 'all', sides: [[], []] } as never)).toBe(
      'calm',
    );
  });
});

describe('the bout postcard (recs FIGHT-100)', () => {
  it('names the funniest moment', async () => {
    const { postcardLine } = await import('../../src/ui/battle-postcard');
    const c = (id: string, name: string) => ({ id, name, foeName: 0 });
    const s = {
      sides: [[c('a', 'Dew')], [c('b', 'Puff')]],
      log: [
        { k: 'hit', by: 'a', to: 'b', dmg: 4, strong: false, guarded: false, move: 'bonk' },
        { k: 'boing', who: 'b', dmg: 2 },
      ],
    } as never;
    expect(postcardLine(s)).toContain('Puff spun round');
  });
});
