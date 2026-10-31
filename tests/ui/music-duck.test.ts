import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  duckMusic,
  holdMusicDuck,
  musicDuckLevel,
  musicGainTarget,
  setMusicVolume,
} from '../../src/platform/audio';
import { AUDIO_MIX, MUSIC_DUCK } from '../../src/config/tuning-r8d-audio';
import { createWorld } from '../../src/sim/world';

/** R0464 (TECH-22): the music ducks under dialogue, read-aloud and big stings. */
describe('music duck', () => {
  afterEach(() => {
    holdMusicDuck('dialogue', false);
    holdMusicDuck('speech', false);
    vi.useRealTimers();
  });

  it('starts from the new defaults: music 0.6 under SFX 0.8', () => {
    expect(musicGainTarget()).toBeCloseTo(AUDIO_MIX.defaultMusic);
    expect(AUDIO_MIX.defaultMusic).toBe(0.6);
    expect(createWorld(1, 0).settings.musicVolume).toBe(AUDIO_MIX.defaultMusic);
  });

  it('holds the bus ≤0.36 with the dialogue open and ≤0.21 under a read-aloud line', () => {
    setMusicVolume(1);
    holdMusicDuck('dialogue', true);
    expect(musicGainTarget()).toBeLessThanOrEqual(0.36);
    holdMusicDuck('speech', true);
    expect(musicGainTarget()).toBeLessThanOrEqual(0.21);
    holdMusicDuck('speech', false);
    expect(musicGainTarget()).toBeCloseTo(MUSIC_DUCK.dialogue);
    holdMusicDuck('dialogue', false);
    expect(musicGainTarget()).toBe(1);
    setMusicVolume(AUDIO_MIX.defaultMusic);
  });

  it('dips for a sting and comes back, within 0.5 s of the duck ending', () => {
    vi.useFakeTimers();
    duckMusic(MUSIC_DUCK.sting, MUSIC_DUCK.stingMs);
    expect(musicDuckLevel()).toBe(MUSIC_DUCK.sting);
    vi.advanceTimersByTime(MUSIC_DUCK.stingMs);
    expect(musicDuckLevel()).toBe(1);
    // setTargetAtTime is within 1% of its target after 5τ.
    expect(5 * MUSIC_DUCK.tau).toBeLessThanOrEqual(0.5);
  });
});
