import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AUDIO_MIX, MUSIC_DUCK } from '../../src/config/tuning';
import { FakeAudioContext, FakeNode, fakeTimers, timerApi, type Timers } from './fake-audio';

/**
 * R0485 (TECH-43): the sound engine against a recording Web Audio fake: the mix graph, every
 * one-shot sound, the song sequencer, the duck, the ambience layer and the offline renders.
 * What is checked is what the player would hear: a source starts, stops, and is wired to the
 * speakers; a muted engine makes no nodes; a duck moves the music bus and gives it back.
 */

let timers: Timers;
let contexts: FakeAudioContext[] = [];

beforeEach(() => {
  vi.resetModules();
  timers = fakeTimers();
  contexts = [];
  const Ctor = function () {
    const c = new FakeAudioContext();
    contexts.push(c);
    return c;
  } as unknown as typeof AudioContext;
  const api = timerApi(timers);
  vi.stubGlobal('window', { AudioContext: Ctor, ...api });
  vi.stubGlobal('setInterval', api.setInterval);
  vi.stubGlobal('clearInterval', api.clearInterval);
  vi.stubGlobal('setTimeout', api.setTimeout);
  vi.stubGlobal('clearTimeout', api.clearTimeout);
});
afterEach(() => vi.unstubAllGlobals());

type Audio = typeof import('../../src/platform/audio');

async function boot(): Promise<{ audio: Audio; ctx: FakeAudioContext }> {
  const audio = await import('../../src/platform/audio');
  audio.unlockAudio();
  await Promise.resolve();
  const ctx = contexts[0]!;
  return { audio, ctx };
}

/** Sources (oscillators and buffer sources) a context has made, in order. */
const sources = (ctx: FakeAudioContext): FakeNode[] =>
  ctx.nodes.filter((n) => n.kind === 'Oscillator' || n.kind === 'BufferSource');

/** The `SoundName` union, read from the source so a new sound is covered the day it is added. */
function soundNames(): string[] {
  const src = readFileSync('src/platform/audio.ts', 'utf8');
  const body = src.slice(src.indexOf('export type SoundName ='), src.indexOf('export const COMIC'));
  return [...body.matchAll(/\|\s*'([A-Za-z0-9]+)'/g)].map((m) => m[1]!);
}

describe('the mix graph', () => {
  it('builds nothing before a gesture, then wires master -> compressor -> speakers', async () => {
    const audio = await import('../../src/platform/audio');
    expect(contexts).toHaveLength(0);
    audio.playSound('pop');
    expect(contexts).toHaveLength(0);
    audio.unlockAudio();
    await Promise.resolve();
    const ctx = contexts[0]!;
    expect(audio.isAudioUnlocked()).toBe(true);
    const [master, musicBus, sfxBus] = ctx.all('Gain');
    const comp = ctx.all('DynamicsCompressor')[0]!;
    expect(master!.out).toContain(comp);
    expect(comp.out).toContain(ctx.destination);
    expect(musicBus!.reaches(ctx.destination)).toBe(true);
    expect(sfxBus!.reaches(ctx.destination)).toBe(true);
    expect(comp.param('threshold').value).toBe(AUDIO_MIX.compThresholdDb);
    expect(master!.param('gain').value).toBe(AUDIO_MIX.masterGain);
  });

  it('gives the hall a two-channel impulse and the echo a feedback loop', async () => {
    const { ctx } = await boot();
    const hall = ctx.buffers[0]!;
    expect(hall.length).toBe(Math.floor(ctx.sampleRate * AUDIO_MIX.hallSec));
    const left = hall.getChannelData(0);
    const right = hall.getChannelData(1);
    expect(left.some((v) => v !== 0)).toBe(true);
    expect(right.some((v) => v !== 0)).toBe(true);
    // The tail dies away: the last tenth is quieter than the first tenth.
    const energy = (a: Float32Array, from: number, to: number) =>
      a.slice(from, to).reduce((s, v) => s + v * v, 0);
    const tenth = Math.floor(left.length / 10);
    expect(energy(left, left.length - tenth, left.length)).toBeLessThan(energy(left, 0, tenth));
    const delay = ctx.all('Delay')[0]!;
    expect(delay.out.some((n) => n.out.some((m) => m.out.includes(delay)))).toBe(true);
  });

  it('reports sound off and music off through the getters', async () => {
    const { audio } = await boot();
    audio.setSoundEnabled(false);
    audio.setMusicEnabled(false);
    expect(audio.isSoundEnabled()).toBe(false);
    expect(audio.isMusicEnabled()).toBe(false);
    expect(audio.musicGainTarget()).toBe(0);
    audio.setMusicEnabled(true);
    audio.setMusicVolume(2);
    expect(audio.musicGainTarget()).toBe(1);
    audio.setMusicVolume(-1);
    expect(audio.musicGainTarget()).toBe(0);
  });

  it('moves the effects bus with the SFX setting and its volume slider', async () => {
    const { audio, ctx } = await boot();
    const sfxBus = ctx.all('Gain')[2]!;
    audio.setSoundEnabled(false);
    expect(sfxBus.param('gain').events.at(-1)).toMatchObject({ kind: 'target', value: 0 });
    audio.setSoundEnabled(true);
    audio.setSfxVolume(0.4);
    expect(sfxBus.param('gain').events.at(-1)).toMatchObject({ kind: 'target', value: 0.4 });
    const n = sfxBus.param('gain').events.length;
    audio.setSfxVolume(0.4); // unchanged: no new write
    expect(sfxBus.param('gain').events.length).toBe(n);
    audio.setSfxVolume(9);
    expect(sfxBus.param('gain').events.at(-1)).toMatchObject({ value: 1 });
  });
});

describe('one-shot sounds', () => {
  it('plays every sound as a started, stopped source wired to the speakers', async () => {
    const names = soundNames();
    expect(names.length).toBeGreaterThan(30);
    const { audio, ctx } = await boot();
    for (const name of names) {
      const before = ctx.nodes.length;
      ctx.currentTime += 1; // clear the comic-sound debounce
      audio.playSound(name as never);
      const made = sources(ctx).filter((n) => ctx.nodes.indexOf(n) >= before);
      expect(made.length, name).toBeGreaterThan(0);
      for (const s of made) {
        expect(s.started.length, name).toBe(1);
        expect(s.stopped.length, name).toBe(1);
        expect(s.stopped[0]!, name).toBeGreaterThan(s.started[0]!);
        expect(s.reaches(ctx.destination), name).toBe(true);
      }
    }
  });

  it('makes no nodes with sound off, and drops a comic sound repeated within 100 ms', async () => {
    const { audio, ctx } = await boot();
    audio.setSoundEnabled(false);
    const before = ctx.nodes.length;
    audio.playSound('pop');
    audio.playBlip(440, 'sine', 30);
    audio.playChirp('chao');
    expect(ctx.nodes.length).toBe(before);
    audio.setSoundEnabled(true);
    ctx.currentTime = 5;
    audio.playSound('squeak');
    const once = sources(ctx).length;
    ctx.currentTime = 5.05; // 50 ms later: swallowed
    audio.playSound('squeak');
    expect(sources(ctx).length).toBe(once);
    ctx.currentTime = 5.2;
    audio.playSound('squeak');
    expect(sources(ctx).length).toBeGreaterThan(once);
  });

  it('dips the music under a big sting and brings it back after', async () => {
    const { audio, ctx } = await boot();
    const musicBus = ctx.all('Gain')[1]!;
    const sting = MUSIC_DUCK.stingSounds[0]!;
    const slider = audio.musicGainTarget();
    audio.playSound(sting as never);
    const dip = musicBus.param('gain').events.at(-1)!;
    expect(dip.kind).toBe('target');
    expect(dip.value).toBeCloseTo(slider * MUSIC_DUCK.sting);
    expect(audio.musicDuckLevel()).toBe(MUSIC_DUCK.sting);
    timers.flush();
    expect(audio.musicDuckLevel()).toBe(1);
  });

  it('plays a blip at its pitch, a chime from the pentatonic run, a kindle and a squeak step', async () => {
    const { audio, ctx } = await boot();
    audio.playBlip(660, 'triangle', 40);
    const blip = ctx.all('Oscillator').at(-1)!;
    expect(blip.props.type).toBe('triangle');
    expect(blip.param('frequency').events[0]).toMatchObject({ kind: 'set', value: 660 });
    for (const fn of [
      () => audio.playChime(0),
      () => audio.playChime(0.99),
      () => audio.playKindle(),
      () => audio.playSqueakStep(2),
    ]) {
      const n = sources(ctx).length;
      fn();
      expect(sources(ctx).length).toBeGreaterThan(n);
    }
    const low = ctx.all('Oscillator');
    expect(low.some((o) => o.param('frequency').events[0]?.value === 1047)).toBe(true);
    expect(low.some((o) => o.param('frequency').events[0]?.value === 2093)).toBe(true);
  });
});

describe('voices of the lessons, chirps, motifs and Hollow cues', () => {
  it('gives each chirp family its own waveform, and a happy chirp more notes than a sad one', async () => {
    const { audio, ctx } = await boot();
    const wave = (family: 'chao' | 'pocket' | 'digi') => {
      const before = ctx.all('Oscillator').length;
      audio.playChirp(family, true);
      return ctx
        .all('Oscillator')
        .slice(before)
        .map((o) => o.props.type);
    };
    expect(new Set(wave('chao'))).toEqual(new Set(['sine']));
    expect(new Set(wave('pocket'))).toEqual(new Set(['triangle']));
    expect(new Set(wave('digi'))).toEqual(new Set(['square']));
    expect(audio.chirpNotes('digi', true).length).toBeGreaterThan(
      audio.chirpNotes('digi', false).length,
    );
    // A voice scales pitch: the same chirp an octave up has doubled frequencies.
    const plain = audio.chirpNotes('chao', false);
    const high = audio.chirpNotes('chao', false, { ...audioVoice(), pitch: 2 });
    expect(high[0]![0]).toBeCloseTo(plain[0]![0] * 2);
  });

  function audioVoice() {
    return { pitch: 1, speed: 1, tail: 1, gain: 1, wobble: 0 };
  }

  it('hums a Nubbin its own motif, the same every time, with a harmony voice on request', async () => {
    const { audio, ctx } = await boot();
    expect(audio.motifOf(7)).toEqual(audio.motifOf(7));
    expect(audio.motifOf(7)).not.toEqual(audio.motifOf(8));
    expect(audio.motifOf(7)).toHaveLength(4);
    const n0 = ctx.all('Oscillator').length;
    audio.playMotif(7);
    const solo = ctx.all('Oscillator').length - n0;
    audio.playMotif(7, 1, true);
    const duet = ctx.all('Oscillator').length - n0 - solo;
    expect(solo).toBe(4);
    expect(duet).toBe(8);
  });

  it('sounds every lesson, instrument, variant, jam layer and Hollow cue', async () => {
    const { audio, ctx } = await boot();
    const run = (label: string, fn: () => void) => {
      const n = sources(ctx).length;
      fn();
      expect(sources(ctx).length, label).toBeGreaterThan(n);
    };
    for (const lesson of ['drawing', 'singing', 'dance', 'instrument'] as const)
      for (const level of [1, 2, 3])
        run(`${lesson} ${level}`, () => audio.playPerform(lesson, level));
    for (const inst of ['bell', 'drum', 'trumpet'] as const)
      for (const level of [1, 3])
        run(`${inst} ${level}`, () => audio.playPerform('instrument', level, inst));
    for (const v of [
      'instrument:maracas',
      'instrument:tambourine',
      'instrument:flute',
      'dance:twist',
      'dance:ra-ra',
      'dance:shake',
      'song:lullaby',
      'song:march',
      'song:silly',
      'exercise:stretch',
      'manners:bow',
    ])
      run(v, () => audio.playPerform('singing', 1, 'bell', 1, v));
    // An unknown variant falls back to the lesson's own sound.
    run('fallback', () => audio.playPerform('singing', 2, 'bell', 1, 'song:unknown'));
    for (const inst of ['bell', 'drum', 'trumpet'] as const) {
      run(`jam ${inst}`, () => audio.playJamLayer(1, inst));
      run(`jam2 ${inst}`, () => audio.playJamLayer(2, inst, 1.2));
    }
    const n = sources(ctx).length;
    audio.playJamLayer(0);
    expect(sources(ctx).length).toBe(n);
    for (const cue of [
      'notice',
      'poof',
      'pop',
      'shrine',
      'waypoint',
      'drop:plain',
      'drop:shiny',
      'drop:fancy',
      'drop:legendary',
      'drop:set',
      'boss:0',
      'boss:3',
      'boss:9',
    ] as const)
      run(cue, () => audio.playHollowCue(cue));
  });

  it('keeps every performed note inside the fixed sets (no lyrics, no stray tune)', async () => {
    const { audio } = await boot();
    expect(audio.PERFORM_MELODIES).toHaveLength(3);
    for (const m of audio.PERFORM_MELODIES) expect(m).toHaveLength(4);
  });
});

describe('the song sequencer', () => {
  it('schedules each song’s notes through its own gain, faded up to its trim', async () => {
    const { audio, ctx } = await boot();
    const musicBus = ctx.all('Gain')[1]!;
    for (const name of audio.SONG_NAMES) {
      audio.playSong(name);
      const songGain = ctx.all('Gain').at(-1);
      // The song's own gain sits between its voices and the music bus.
      const mine = ctx.all('Gain').filter((g) => g.out.includes(musicBus));
      expect(mine.length, name).toBeGreaterThan(0);
      expect(songGain).toBeDefined();
      expect(timers.intervals.size, name).toBe(1);
      const before = ctx.nodes.length;
      for (let i = 0; i < 60; i++) {
        ctx.currentTime += 0.25;
        timers.tick();
      }
      const made = ctx.nodes.slice(before);
      expect(
        made.some((n) => n.kind === 'Oscillator' || n.kind === 'BufferSource'),
        name,
      ).toBe(true);
      audio.stopMusic();
      expect(timers.intervals.size, name).toBe(0);
      timers.flush();
    }
  });

  it('crossfades to another song and ignores the one already playing', async () => {
    const { audio, ctx } = await boot();
    const musicBus = ctx.all('Gain')[1]!;
    audio.playSong('calm');
    const first = ctx
      .all('Gain')
      .filter((g) => g.out.includes(musicBus))
      .at(-1)!;
    const nodes = ctx.nodes.length;
    audio.playSong('calm');
    expect(ctx.nodes.length).toBe(nodes);
    audio.playSong('battle');
    const events = first.param('gain').events;
    expect(events.some((e) => e.kind === 'exp' && e.value === 0.0001)).toBe(true);
    expect(first.disconnected).toBe(false);
    timers.flush();
    expect(first.disconnected).toBe(true);
    expect(timers.intervals.size).toBe(1);
  });

  it('lets go of beats that went by during a stall instead of playing a smear', async () => {
    const { audio, ctx } = await boot();
    audio.playSong('calm');
    const before = sources(ctx).length;
    ctx.currentTime += 60; // a hidden tab: a minute of beats missed
    timers.tick();
    const burst = sources(ctx).length - before;
    audio.stopMusic();
    // Only the notes within the look-ahead after the stall are built, not a minute of them.
    expect(burst).toBeLessThan(60);
  });

  it('holds a song asked for before the first tap and starts it when sound unlocks', async () => {
    const audio = await import('../../src/platform/audio');
    audio.playSong('calm');
    expect(contexts).toHaveLength(0);
    audio.unlockAudio();
    await Promise.resolve();
    expect(timers.intervals.size).toBe(1);
  });

  it('stops the scheduler when the tab hides and picks the song up when it returns', async () => {
    const { audio, ctx } = await boot();
    audio.playSong('calm');
    expect(timers.intervals.size).toBe(1);
    audio.suspendAudio();
    expect(ctx.suspends).toBe(1);
    expect(timers.intervals.size).toBe(0);
    audio.resumeAudio();
    expect(ctx.resumes).toBeGreaterThan(1);
    expect(timers.intervals.size).toBe(1);
    audio.suspendAudio(); // hiding again, twice over, only suspends once
    audio.suspendAudio();
    expect(ctx.suspends).toBe(2); // once on the first hide, once more after the return
  });
});

describe('the music duck', () => {
  it('holds the music down for the dialogue box and releases it', async () => {
    const { audio, ctx } = await boot();
    const musicBus = ctx.all('Gain')[1]!;
    const slider = audio.musicGainTarget();
    audio.holdMusicDuck('dialogue', true);
    expect(audio.musicDuckLevel()).toBe(MUSIC_DUCK.dialogue);
    expect(audio.musicGainTarget()).toBeCloseTo(slider * MUSIC_DUCK.dialogue);
    expect(musicBus.param('gain').events.at(-1)!.value).toBeCloseTo(slider * MUSIC_DUCK.dialogue);
    const writes = musicBus.param('gain').events.length;
    audio.holdMusicDuck('dialogue', true); // already held: the HUD's every-frame call is free
    expect(musicBus.param('gain').events.length).toBe(writes);
    audio.holdMusicDuck('speech', true);
    expect(audio.musicDuckLevel()).toBe(Math.min(MUSIC_DUCK.dialogue, MUSIC_DUCK.speech));
    audio.holdMusicDuck('dialogue', false);
    audio.holdMusicDuck('speech', false);
    expect(audio.musicDuckLevel()).toBe(1);
    expect(musicBus.param('gain').events.at(-1)!.value).toBeCloseTo(slider);
  });

  it('dips for a pulse of the given length, clamped to 0..1, then returns', async () => {
    const { audio } = await boot();
    audio.duckMusic(5, 500);
    expect(audio.musicDuckLevel()).toBe(1);
    audio.duckMusic(-3, 500);
    expect(audio.musicDuckLevel()).toBe(0);
    expect([...timers.timeouts.values()].some((t) => t.ms === 500)).toBe(true);
    timers.flush();
    expect(audio.musicDuckLevel()).toBe(1);
  });
});

describe('the ambience layer', () => {
  const scene = (
    over: Partial<{
      phase: 'day' | 'night';
      weather: 'clear' | 'rain' | 'snow';
      stream: boolean;
    }> = {},
  ) => ({
    phase: 'day' as const,
    weather: 'clear' as const,
    stream: false,
    ...over,
  });

  it('builds its beds once, silent, and brings in the stream, rain and crickets by scene', async () => {
    const { audio, ctx } = await boot();
    audio.setAmbience(scene());
    const gains = ctx.all('Gain');
    const bus = gains.find(
      (g) => g.param('gain').value === 1 && g.out.length > 0 && g.reaches(ctx.destination),
    )!;
    expect(bus).toBeDefined();
    const made = ctx.nodes.length;
    audio.setAmbience(scene({ stream: true }));
    expect(ctx.nodes.length).toBe(made); // the beds are built once
    const targets = (g: FakeNode) =>
      g
        .param('gain')
        .events.filter((e) => e.kind === 'target')
        .map((e) => e.value);
    const bedGains = ctx
      .all('Gain')
      .filter((g) => g.param('gain').events.some((e) => e.kind === 'target'));
    expect(bedGains.flatMap(targets)).toContain(0.05); // the stream
    audio.setAmbience(scene({ weather: 'rain' }));
    expect(ctx.all('Gain').flatMap(targets)).toContain(0.045); // rain
    audio.setAmbience(scene({ phase: 'night' }));
    expect(ctx.all('Gain').flatMap(targets)).toContain(0.012); // crickets
  });

  it('calls birds by day in dry weather and not in rain or at night, and stops when switched off', async () => {
    const { audio, ctx } = await boot();
    audio.setAmbience(scene());
    expect(timers.timeouts.size).toBe(1);
    const before = ctx.all('Oscillator').length;
    timers.flush(); // the bird timer fires: a call of two to four notes, and the next is booked
    const notes = ctx.all('Oscillator').length - before;
    expect(notes).toBeGreaterThanOrEqual(2);
    expect(notes).toBeLessThanOrEqual(4);
    expect(timers.timeouts.size).toBe(1);
    audio.setAmbience(scene({ weather: 'rain' }));
    expect(timers.timeouts.size).toBe(0);
    audio.setAmbience(scene({ phase: 'night' }));
    expect(timers.timeouts.size).toBe(0);
    audio.setAmbience(scene());
    expect(timers.timeouts.size).toBe(1);
    audio.setAmbienceEnabled(false);
    expect(timers.timeouts.size).toBe(0);
    audio.setAmbienceEnabled(true);
    expect(timers.timeouts.size).toBe(1);
    audio.setAmbience(null);
    expect(timers.timeouts.size).toBe(0);
  });

  it('plugs the effects bus and the ambience bus into the other platform files', async () => {
    const audio = await import('../../src/platform/audio');
    expect(audio.sfxOut()).toBeNull();
    expect(audio.ambienceOut()).toBeNull();
    audio.unlockAudio();
    await Promise.resolve();
    const sfx = audio.sfxOut()!;
    expect((sfx.bus as unknown as FakeNode).reaches(contexts[0]!.destination as never)).toBe(true);
    expect(sfx.noise).toBeDefined();
    const amb = audio.ambienceOut()!;
    expect(amb.bus).not.toBe(sfx.bus);
    expect((amb.bus as unknown as FakeNode).reaches(contexts[0]!.destination as never)).toBe(true);
  });
});

describe('offline renders', () => {
  class FakeOffline extends FakeAudioContext {
    constructor(
      readonly channels: number,
      readonly length: number,
      rate: number,
    ) {
      super();
      this.sampleRate = rate;
    }
    startRendering(): Promise<{ getChannelData: (c: number) => Float32Array }> {
      return Promise.resolve({ getChannelData: () => new Float32Array(this.length) });
    }
  }

  it('returns null where the browser has no offline context', async () => {
    const audio = await import('../../src/platform/audio');
    expect(await audio.renderSoundOffline('pop')).toBeNull();
    expect(await audio.renderSongOffline('calm')).toBeNull();
  });

  it('renders a sound and a whole song through the real bus graph, and puts the live engine back', async () => {
    vi.stubGlobal('OfflineAudioContext', FakeOffline);
    const { audio, ctx } = await boot();
    const liveNodes = ctx.nodes.length;
    const sound = await audio.renderSoundOffline('pop', 1, 8000);
    expect(sound).toBeInstanceOf(Float32Array);
    expect(sound!.length).toBe(8000);
    const song = await audio.renderSongOffline('calm', 2, 8000);
    expect(song!.length).toBe(16000);
    expect(ctx.nodes.length).toBe(liveNodes); // nothing leaked into the live context
    ctx.currentTime = 10; // (the offline render left the comic debounce at its own t = 0)
    audio.playSound('pop'); // still works on the live context afterwards
    expect(ctx.nodes.length).toBeGreaterThan(liveNodes);
  });
});
