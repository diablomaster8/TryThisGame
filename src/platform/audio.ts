/**
 * Sound: synthesized effects and an original score, so there are nothing to license.
 * Starts muted and only turns on after the first tap or click (browser policy and
 * CLAUDE.md). Music and effects have separate switches; both live in the save.
 *
 * The score is a small sequencer over Web Audio: each song is a few tracks of notes in a
 * readable notation, played by synth instruments (lead, pluck, bass, pad, bell, drums)
 * through a delay, a generated reverb and a compressor. The pieces are written in the
 * spirit of the cozy garden games and the big adventure scores Maor named: a warm
 * waltz by day, a hushed music-box at night, a rising brass motif on the title screen,
 * a driving race theme, a bouncy expedition tune and a sparse story cue. All original.
 */
import { AUDIO_MIX, CHIRP_VOICE, MUSIC_DUCK, SONG_TRIM_DB } from '../config/tuning-r8d-audio';
import { PLAIN_VOICE, type ChirpVoice } from './chirp-voice';
import { playSfxVoices } from './audio-sfx';
import { SONGS, type Inst, type Note, type Song, type Track } from './audio-songs';
export type SoundName =
  | 'tap'
  | 'pickup'
  | 'jump'
  | 'hit'
  | 'hatch'
  | 'evolve'
  | 'pet'
  | 'buy'
  | 'cheer'
  | 'win'
  | 'sad'
  | 'drip'
  // MOVE-21/25: the Keeper's jump (a boop), double jump (a higher bip), landing (a pat) and
  // a long fall's soft plop (a "hup").
  | 'hop'
  | 'hopAir'
  | 'pat'
  | 'plop'
  // MOVE-35: a soft bonk when a tap cannot be reached.
  | 'bonk'
  // MOVE-46: footsteps on a deck (a hollow tok) and on stone (a light tap).
  | 'stepDeck'
  | 'stepStone'
  | 'stepWade'
  | 'eggHey'
  // MOVE-57: a spring mushroom's boing.
  | 'boing'
  // R0301 (FUN-12): the comic palette.
  | 'squeak'
  | 'slideDown'
  | 'slideUp'
  | 'pop'
  | 'sneeze'
  | 'hiccup'
  | 'gulp'
  | 'raspberry'
  | 'giggle'
  // Round 5 (R0304, R0310): a gate creak and the sprout sound words' own noises.
  | 'creak'
  | 'munch'
  | 'whoosh'
  | 'splash'
  | 'ding'
  // R0450 round 11: a guarded blow's dull clunk, a critical hit's bright crack, and the panel ticks.
  | 'guardClunk'
  | 'critHit'
  | 'tickOpen'
  | 'tickClose'
  // Lane C round 6 (FIGHT-76): battle hits by type, and a tuckered-out yawn.
  | 'woodblock'
  | 'swish'
  | 'patter'
  | 'yawn'
  // Lane D round 8 (R0450, TECH-08): the Expedition's high jump, essence sparkle, critter
  // bubble pop and results fanfare, and the Grove's fruit thup, tree rustle, throw whee, eat
  // nom and can't-reach hmm.
  | 'jumpHigh'
  | 'sparkle'
  | 'bubblePop'
  | 'fanfare'
  | 'thup'
  | 'rustle'
  | 'whee'
  | 'nom'
  | 'hmm'
  // Lane A r9 (R0546): a glutton's full-belly burp.
  | 'burp'
  // Lane A r9 (R0552): a napping Nubbin's snore and two buddies' chat chirp.
  | 'snore'
  | 'chirp'
  // Lane E r10 (R0326): a Hollow stray's tiptoe, four soft plucked steps.
  | 'sneak';

/** R0301: the comic sounds, for the debug panel's test row. */
export const COMIC_SOUNDS: readonly SoundName[] = [
  'boing',
  'bonk',
  'squeak',
  'slideDown',
  'slideUp',
  'pop',
  'sneeze',
  'hiccup',
  'gulp',
  'raspberry',
  'giggle',
  'burp',
];
// R0301: comic sounds never pile up: at most one per 100 ms.
let lastComicAt = -Infinity;

export type SongName =
  | 'title'
  | 'grove'
  | 'night'
  | 'race'
  | 'expedition'
  | 'story'
  | 'sorrow'
  | 'tense'
  | 'hollow'
  | 'karate'
  // Lane C round 6 (FIGHT-76): the bouts' own pieces.
  | 'battle'
  | 'circuit'
  | 'calm';

/** Every piece in the score, for the jukebox. */
export const SONG_NAMES: readonly SongName[] = [
  'title',
  'grove',
  'night',
  'race',
  'expedition',
  'story',
  'sorrow',
  'tense',
  'hollow',
  'karate',
  'battle',
  'circuit',
  'calm',
];

let ctx: AudioContext | null = null;
let unlocked = false;
let sfxEnabled = true;
let musicEnabled = true;
let musicVolume: number = AUDIO_MIX.defaultMusic;
let sfxVolume: number = AUDIO_MIX.defaultSfx;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
let delaySend: GainNode | null = null;
let reverbSend: GainNode | null = null;

/**
 * Call from user gestures: pointerup, touchend, click and keydown (iOS Safari does not
 * count pointerdown as one). Safe on every gesture: it builds the context once, then only
 * resumes it when it is not running, which also brings sound back after an interruption
 * (a phone call, Siri, another app's audio).
 */
export function unlockAudio(): void {
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      buildGraph(ctx);
      ctx.addEventListener('statechange', onStateChange);
    } catch {
      ctx = null;
      return;
    }
  }
  resumeAudio();
}

/**
 * Resume a context that is not running, for example when the tab comes back. Sound
 * counts as unlocked only once the context really runs: resume() can fail, or be refused
 * outside a gesture, and the next gesture tries again.
 */
export function resumeAudio(): void {
  const ac = ctx;
  if (!ac || ac.state === 'running' || ac.state === 'closed') return;
  ac.resume().then(onStateChange, () => undefined);
}

/**
 * The tab is hidden: suspend the context and stop the music scheduler and the bird timer,
 * so nothing plays or wakes the CPU in a background tab (review D, bug 43). `resumeAudio`
 * on show brings it back, and `onStateChange` restarts the timers once it runs.
 */
export function suspendAudio(): void {
  const ac = ctx;
  if (!ac || ac.state !== 'running') return;
  if (current) {
    clearInterval(current.timer);
    current.timer = 0;
  }
  window.clearTimeout(birdTimer);
  ac.suspend().catch(() => undefined);
}

function onStateChange(): void {
  if (ctx?.state !== 'running') return;
  if (!unlocked) {
    unlocked = true;
    if (pendingSong) playSong(pendingSong);
  }
  // Back from a hidden tab: carry on the song where it paused, and the birds.
  const p = current;
  if (p && !p.timer) {
    schedule(p);
    p.timer = window.setInterval(() => schedule(p), 60);
  }
  scheduleBird();
}

function buildGraph(ac: AudioContext): void {
  // R0464: every gain, delay and reverb number comes from AUDIO_MIX in tuning.
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = AUDIO_MIX.compThresholdDb;
  comp.ratio.value = AUDIO_MIX.compRatio;
  master = ac.createGain();
  master.gain.value = AUDIO_MIX.masterGain;
  master.connect(comp).connect(ac.destination);
  musicBus = ac.createGain();
  musicBus.gain.value = musicGainTarget();
  musicBus.connect(master);
  sfxBus = ac.createGain();
  sfxBus.gain.value = sfxEnabled ? sfxVolume : 0;
  sfxBus.connect(master);
  // Echo.
  const delay = ac.createDelay(1.0);
  delay.delayTime.value = AUDIO_MIX.delaySec;
  const fb = ac.createGain();
  fb.gain.value = AUDIO_MIX.delayFeedback;
  const dlp = ac.createBiquadFilter();
  dlp.type = 'lowpass';
  dlp.frequency.value = AUDIO_MIX.delayLowpassHz;
  delay.connect(dlp).connect(fb).connect(delay);
  delaySend = ac.createGain();
  delaySend.gain.value = AUDIO_MIX.delaySend;
  delaySend.connect(delay);
  delay.connect(musicBus);
  // A small hall: exponentially decaying noise as the impulse.
  const seconds = AUDIO_MIX.hallSec;
  const rate = ac.sampleRate;
  const impulse = ac.createBuffer(2, Math.floor(rate * seconds), rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] =
        (Math.random() * 2 - 1) *
        Math.pow(1 - t, AUDIO_MIX.hallDecayPow) *
        (ch === 0 ? 1 : AUDIO_MIX.hallRightLevel);
    }
  }
  const reverb = ac.createConvolver();
  reverb.buffer = impulse;
  reverbSend = ac.createGain();
  reverbSend.gain.value = AUDIO_MIX.hallSend;
  reverbSend.connect(reverb).connect(musicBus);
}

export function setSoundEnabled(on: boolean): void {
  sfxEnabled = on;
  if (sfxBus && ctx) sfxBus.gain.setTargetAtTime(on ? sfxVolume : 0, ctx.currentTime, 0.05);
}

export function setMusicEnabled(on: boolean): void {
  musicEnabled = on;
  applyMusicGain(0.2);
  if (on && unlocked && !current && pendingSong) playSong(pendingSong);
}

/** 0..1 sliders from Settings. */
export function setMusicVolume(v: number): void {
  musicVolume = Math.max(0, Math.min(1, v));
  if (musicEnabled) applyMusicGain(0.1);
}

// ---------------------------------------------------------------- music duck (R0464)

/** Held ducks by source (the dialogue box, a read-aloud line), each a level 0..1. */
const duckHolds = new Map<string, number>();
/** A short dip under a sting; 1 when none is running. */
let duckPulse = 1;
let duckPulseTimer: ReturnType<typeof setTimeout> | null = null;

/** The quietest active duck, as a share of the music slider (1: no duck). */
export function musicDuckLevel(): number {
  let level = duckPulse;
  for (const v of duckHolds.values()) level = Math.min(level, v);
  return level;
}

/** What the music bus is heading for now: the slider times the duck, 0 with music off. */
export function musicGainTarget(): number {
  return musicEnabled ? musicVolume * musicDuckLevel() : 0;
}

function applyMusicGain(tau: number = MUSIC_DUCK.tau): void {
  if (musicBus && ctx) musicBus.gain.setTargetAtTime(musicGainTarget(), ctx.currentTime, tau);
}

/** Hold the music down while `source` is on (the dialogue box, a read-aloud line). */
export function holdMusicDuck(source: 'dialogue' | 'speech', on: boolean): void {
  const had = duckHolds.has(source);
  if (on) duckHolds.set(source, MUSIC_DUCK[source]);
  else duckHolds.delete(source);
  if (had !== on) applyMusicGain();
}

/** Dip the music to `level` for `ms`, then let it come back (a hatch, an evolve, a win). */
export function duckMusic(level: number, ms: number): void {
  duckPulse = Math.min(duckPulse, Math.max(0, Math.min(1, level)));
  applyMusicGain();
  if (duckPulseTimer !== null) clearTimeout(duckPulseTimer);
  duckPulseTimer = setTimeout(() => {
    duckPulseTimer = null;
    duckPulse = 1;
    applyMusicGain();
  }, ms);
}

export function setSfxVolume(v: number): void {
  sfxVolume = Math.max(0, Math.min(1, v));
  if (sfxBus && ctx && sfxEnabled) sfxBus.gain.setTargetAtTime(sfxVolume, ctx.currentTime, 0.05);
}

/** True once the first tap or click has turned sound on (read-aloud waits for it too). */
export function isAudioUnlocked(): boolean {
  return unlocked;
}

export function isSoundEnabled(): boolean {
  return sfxEnabled;
}

export function isMusicEnabled(): boolean {
  return musicEnabled;
}

// ---------------------------------------------------------------- sequencer

interface Playing {
  name: SongName;
  song: Song;
  gain: GainNode;
  startTime: number;
  nextBeat: number;
  timer: number;
}

let current: Playing | null = null;
let pendingSong: SongName | null = null;

/** Switch songs with a short crossfade. The same song keeps playing. */
export function playSong(name: SongName): void {
  pendingSong = name;
  if (!ctx || !musicBus || !unlocked) return;
  if (current?.name === name) return;
  if (current) fadeOut(current);
  const song = SONGS[name];
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  // R0507: each song fades up to its own trim, so the pieces sit level with one another.
  const trim = Math.pow(10, (SONG_TRIM_DB[name] ?? 0) / 20);
  gain.gain.exponentialRampToValueAtTime(trim, ctx.currentTime + 1.2);
  gain.connect(musicBus);
  const p: Playing = {
    name,
    song,
    gain,
    startTime: ctx.currentTime + 0.1,
    nextBeat: 0,
    timer: 0,
  };
  current = p;
  schedule(p);
  p.timer = window.setInterval(() => schedule(p), 60);
}

export function stopMusic(): void {
  pendingSong = null;
  if (current) fadeOut(current);
  current = null;
}

function fadeOut(p: Playing): void {
  clearInterval(p.timer);
  if (!ctx) return;
  p.gain.gain.cancelScheduledValues(ctx.currentTime);
  p.gain.gain.setValueAtTime(p.gain.gain.value, ctx.currentTime);
  p.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
  const g = p.gain;
  window.setTimeout(() => g.disconnect(), 1200);
  if (current === p) current = null;
}

/** Schedule every note that starts within the look-ahead window. */
function schedule(p: Playing): void {
  if (!ctx || current !== p) return;
  const secPerBeat = 60 / p.song.bpm;
  const horizon = ctx.currentTime + 0.25;
  while (p.startTime + p.nextBeat * secPerBeat < horizon) {
    const beatInLoop = p.nextBeat % p.song.beats;
    const beatTime = p.startTime + p.nextBeat * secPerBeat;
    for (const track of p.song.tracks) {
      for (const n of track.notes) {
        if (n.t !== beatInLoop) continue;
        play(track, n, beatTime, n.d * secPerBeat, p.gain);
      }
    }
    p.nextBeat += 1;
  }
}

const mtof = (m: number): number => 440 * Math.pow(2, (m - 69) / 12);

function play(track: Track, n: Note, t0: number, dur: number, out: GainNode): void {
  if (!ctx) return;
  const ac = ctx;
  switch (track.inst) {
    case 'kick': {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.frequency.setValueAtTime(150, t0);
      o.frequency.exponentialRampToValueAtTime(45, t0 + 0.12);
      g.gain.setValueAtTime(track.gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
      o.connect(g).connect(out);
      o.start(t0);
      o.stop(t0 + 0.3);
      return;
    }
    case 'snare':
    case 'hat': {
      const len = track.inst === 'hat' ? 0.05 : 0.14;
      const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * len), ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const src = ac.createBufferSource();
      src.buffer = buf;
      const f = ac.createBiquadFilter();
      f.type = track.inst === 'hat' ? 'highpass' : 'bandpass';
      f.frequency.value = track.inst === 'hat' ? 7000 : 1800;
      const g = ac.createGain();
      g.gain.setValueAtTime(track.gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
      src.connect(f).connect(g).connect(out);
      src.start(t0);
      if (track.inst === 'snare') {
        const o = ac.createOscillator();
        const og = ac.createGain();
        o.frequency.setValueAtTime(190, t0);
        og.gain.setValueAtTime(track.gain * 0.6, t0);
        og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
        o.connect(og).connect(out);
        o.start(t0);
        o.stop(t0 + 0.12);
      }
      return;
    }
    default:
      break;
  }
  for (const pitch of n.p) voice(track.inst, mtof(pitch), t0, dur, track.gain, out);
}

/** A tuned voice: oscillators, a filter, an envelope, and sends to the echo and hall. */
function voice(
  inst: Inst,
  freq: number,
  t0: number,
  dur: number,
  gain: number,
  out: GainNode,
): void {
  if (!ctx) return;
  const ac = ctx;
  const g = ac.createGain();
  const f = ac.createBiquadFilter();
  f.type = 'lowpass';
  const oscs: OscillatorNode[] = [];
  const add = (type: OscillatorType, mult: number, detune: number, level: number) => {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.value = freq * mult;
    o.detune.value = detune;
    const og = ac.createGain();
    og.gain.value = level;
    o.connect(og).connect(f);
    oscs.push(o);
  };
  let attack = 0.01;
  let release = 0.12;
  let sustain = 0.7;
  let hold = dur;
  let echo = 0;
  let hall = 0.4;
  switch (inst) {
    case 'lead':
      add('triangle', 1, -4, 0.6);
      add('square', 1, 4, 0.18);
      f.frequency.value = 2600;
      attack = 0.02;
      release = 0.18;
      echo = 0.5;
      break;
    case 'pluck':
      add('sawtooth', 1, 0, 0.35);
      add('triangle', 2, 0, 0.15);
      f.frequency.setValueAtTime(3200, t0);
      f.frequency.exponentialRampToValueAtTime(600, t0 + 0.25);
      attack = 0.004;
      release = 0.25;
      sustain = 0.15;
      hold = Math.min(dur, 0.3);
      echo = 0.35;
      break;
    case 'bass':
      add('sine', 1, 0, 0.7);
      add('triangle', 1, 0, 0.3);
      add('square', 0.5, 0, 0.08);
      f.frequency.value = 500;
      attack = 0.01;
      release = 0.1;
      sustain = 0.8;
      hall = 0.1;
      break;
    case 'pad':
      add('sawtooth', 1, -7, 0.18);
      add('sawtooth', 1, 7, 0.18);
      add('triangle', 2, 0, 0.08);
      f.frequency.value = 900;
      attack = Math.min(0.8, dur * 0.4);
      release = 0.9;
      sustain = 0.9;
      hall = 0.7;
      break;
    case 'bell':
      add('sine', 1, 0, 0.6);
      add('sine', 2.76, 0, 0.18);
      add('sine', 5.4, 0, 0.06);
      f.frequency.value = 6000;
      attack = 0.003;
      release = 1.2;
      sustain = 0.1;
      hold = Math.min(dur, 0.25);
      echo = 0.4;
      hall = 0.8;
      break;
    case 'brass':
      add('sawtooth', 1, -5, 0.3);
      add('sawtooth', 1, 5, 0.3);
      add('square', 0.5, 0, 0.1);
      f.frequency.setValueAtTime(700, t0);
      f.frequency.linearRampToValueAtTime(2400, t0 + 0.12);
      attack = 0.06;
      release = 0.2;
      sustain = 0.85;
      hall = 0.6;
      break;
    default:
      add('triangle', 1, 0, 0.5);
      break;
  }
  const peak = gain;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.setTargetAtTime(peak * sustain, t0 + attack, 0.08);
  const end = t0 + hold;
  g.gain.setValueAtTime(peak * sustain, end);
  g.gain.exponentialRampToValueAtTime(0.0001, end + release);
  f.connect(g);
  g.connect(out);
  if (echo > 0 && delaySend) {
    const s = ac.createGain();
    s.gain.value = echo;
    g.connect(s).connect(delaySend);
  }
  if (hall > 0 && reverbSend) {
    const s = ac.createGain();
    s.gain.value = hall;
    g.connect(s).connect(reverbSend);
  }
  for (const o of oscs) {
    o.start(t0);
    o.stop(end + release + 0.05);
  }
}

// ---------------------------------------------------------------- effects

function tone(
  freq: number,
  startMs: number,
  durMs: number,
  type: OscillatorType = 'square',
  gain = 0.08,
  slideTo?: number,
): void {
  if (!ctx || !sfxBus) return;
  const t0 = ctx.currentTime + startMs / 1000;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + durMs / 1000);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
  osc.connect(g).connect(sfxBus);
  osc.start(t0);
  osc.stop(t0 + durMs / 1000 + 0.02);
}

/**
 * A Hollow crystal's chime when someone brushes it (item 44): a soft sine bell and its
 * fifth, `pitch` a share 0..1 that picks the note from a pentatonic run, so neighbours
 * sound well together. Silent until the first tap unlocks sound, as every effect is.
 */
export function playChime(pitch: number): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  const notes = [1047, 1175, 1319, 1568, 1760, 2093];
  const f = notes[Math.min(notes.length - 1, Math.floor(pitch * notes.length))]!;
  try {
    tone(f, 0, 900, 'sine', 0.045);
    tone(f * 1.5, 30, 700, 'sine', 0.018);
    tone(f * 2, 0, 300, 'triangle', 0.01);
  } catch {
    // Audio is a nicety; a failed node never stops the game.
  }
}

/**
 * R0322 (FUN-33): a squeak raised `step` semitones (two per rapid tap), so a run of taps on
 * a Nubbin climbs like a toy. Not throttled with the comic sounds: the taps set the pace.
 */
export function playSqueakStep(step: number): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  const f = 700 * Math.pow(2, Math.min(step, 24) / 12);
  try {
    tone(f, 0, 90, 'sawtooth', 0.025, f * 1.5);
  } catch {
    // As above.
  }
}

/** A Hollow sconce catching from the Keeper's lamp: a soft rising whoosh. */
export function playKindle(): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    tone(220, 0, 260, 'triangle', 0.05, 520);
    tone(660, 120, 220, 'sine', 0.03, 880);
  } catch {
    // As above.
  }
}

/**
 * R0507 (TECH-64): render one sound effect through the real bus graph into an offline
 * context and hand back its samples (mono mix), for the `?audiolab` dev page. It swaps the
 * module's live graph for the offline one for the length of the render and then puts the
 * live one back, so call it only from the lab, never during play.
 */
export async function renderSoundOffline(
  name: SoundName,
  seconds = 2,
  rate = 44100,
): Promise<Float32Array | null> {
  const Off =
    typeof OfflineAudioContext !== 'undefined'
      ? OfflineAudioContext
      : (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext })
          .webkitOfflineAudioContext;
  if (!Off) return null;
  const saved = { ctx, unlocked, sfxEnabled, master, musicBus, sfxBus, delaySend, reverbSend };
  const off = new Off(1, Math.floor(seconds * rate), rate);
  try {
    ctx = off as unknown as AudioContext;
    unlocked = true;
    sfxEnabled = true;
    lastComicAt = -1e9;
    buildGraph(ctx);
    playSound(name);
    const buf = await off.startRendering();
    return buf.getChannelData(0);
  } catch {
    return null;
  } finally {
    ({ ctx, unlocked, sfxEnabled, master, musicBus, sfxBus, delaySend, reverbSend } = saved);
  }
}

/**
 * R0507 (TECH-64): render a song through the real bus graph (and its trim) into an offline
 * context for `seconds` and hand back the samples. The score scheduler is tied to the live
 * clock and timers, so this walks every beat up front instead. Lab use only, as above.
 */
export async function renderSongOffline(
  name: SongName,
  seconds = 30,
  rate = 44100,
): Promise<Float32Array | null> {
  const Off =
    typeof OfflineAudioContext !== 'undefined'
      ? OfflineAudioContext
      : (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext })
          .webkitOfflineAudioContext;
  if (!Off) return null;
  const saved = { ctx, unlocked, master, musicBus, sfxBus, delaySend, reverbSend, musicEnabled };
  const off = new Off(1, Math.floor(seconds * rate), rate);
  try {
    ctx = off as unknown as AudioContext;
    unlocked = true;
    musicEnabled = true;
    buildGraph(ctx);
    const song = SONGS[name];
    const gain = ctx.createGain();
    gain.gain.value = Math.pow(10, (SONG_TRIM_DB[name] ?? 0) / 20);
    gain.connect(musicBus!);
    const secPerBeat = 60 / song.bpm;
    for (let beat = 0; beat * secPerBeat < seconds; beat++) {
      const inLoop = beat % song.beats;
      for (const track of song.tracks)
        for (const n of track.notes)
          if (n.t === inLoop) play(track, n, beat * secPerBeat, n.d * secPerBeat, gain);
    }
    const buf = await off.startRendering();
    return buf.getChannelData(0);
  } catch {
    return null;
  } finally {
    ({ ctx, unlocked, master, musicBus, sfxBus, delaySend, reverbSend, musicEnabled } = saved);
  }
}

export function playSound(name: SoundName): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  if (COMIC_SOUNDS.includes(name)) {
    const now = ctx.currentTime * 1000;
    if (now - lastComicAt < 100) return;
    lastComicAt = now;
  }
  // R0464: a big sting dips the song so it is heard.
  if (MUSIC_DUCK.stingSounds.includes(name)) duckMusic(MUSIC_DUCK.sting, MUSIC_DUCK.stingMs);
  try {
    playSfxVoices(name, tone, burst);
  } catch {
    // Audio problems must never break the game.
  }
}

/** For tests: the parsed songs. */
export const SCORE: Readonly<Record<SongName, Song>> = SONGS;

// ---------------------------------------------------------------- ambience

/** What the garden sounds like right now. */
export interface AmbienceScene {
  phase: 'day' | 'night';
  weather: 'clear' | 'rain' | 'snow';
  /** Near the stream or the falls. */
  stream: boolean;
}

let ambienceEnabled = true;
let ambienceBus: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let streamGain: GainNode | null = null;
let rainGain: GainNode | null = null;
let cricketGain: GainNode | null = null;
let birdTimer = 0;
let currentScene: AmbienceScene | null = null;

/**
 * R0302 (FUN-13): one typewriter blip in a speaker's voice. Quiet, short, and silent with
 * SFX off or before the first tap unlocks sound.
 */
export function playBlip(hz: number, wave: OscillatorType, ms: number): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    tone(hz, 0, ms, wave, 0.018);
  } catch {
    // A blip is never worth an error.
  }
}

/** R0301: a short filtered noise burst (the sneeze's "choo"). */
function burst(startMs: number, durMs: number, gain: number, cutoff: number): void {
  if (!ctx || !sfxBus) return;
  const t0 = ctx.currentTime + startMs / 1000;
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = cutoff;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
  src.connect(f).connect(g).connect(sfxBus);
  src.start(t0);
  src.stop(t0 + durMs / 1000 + 0.02);
}

function noise(ac: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const seconds = 2;
  const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * seconds), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

function ensureAmbience(): boolean {
  if (!ctx || !sfxBus) return false;
  if (ambienceBus) return true;
  const ac = ctx;
  ambienceBus = ac.createGain();
  ambienceBus.gain.value = ambienceEnabled ? 1 : 0;
  ambienceBus.connect(sfxBus);
  // The stream: band-passed noise with a slow wobble.
  const stream = ac.createBufferSource();
  stream.buffer = noise(ac);
  stream.loop = true;
  const sbp = ac.createBiquadFilter();
  sbp.type = 'bandpass';
  sbp.frequency.value = 700;
  sbp.Q.value = 0.7;
  streamGain = ac.createGain();
  streamGain.gain.value = 0;
  const lfo = ac.createOscillator();
  lfo.frequency.value = 0.23;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain).connect(streamGain.gain);
  lfo.start();
  stream.connect(sbp).connect(streamGain).connect(ambienceBus);
  stream.start();
  // Rain: bright hissing noise.
  const rain = ac.createBufferSource();
  rain.buffer = noise(ac);
  rain.loop = true;
  const rhp = ac.createBiquadFilter();
  rhp.type = 'highpass';
  rhp.frequency.value = 2200;
  rainGain = ac.createGain();
  rainGain.gain.value = 0;
  rain.connect(rhp).connect(rainGain).connect(ambienceBus);
  rain.start();
  // Crickets: a high tone pulsed at about thirty times a second.
  const cricket = ac.createOscillator();
  cricket.type = 'triangle';
  cricket.frequency.value = 4300;
  const pulse = ac.createOscillator();
  pulse.type = 'square';
  pulse.frequency.value = 29;
  const pulseGain = ac.createGain();
  pulseGain.gain.value = 0.5;
  const am = ac.createGain();
  am.gain.value = 0.5;
  pulse.connect(pulseGain).connect(am.gain);
  cricketGain = ac.createGain();
  cricketGain.gain.value = 0;
  cricket.connect(am).connect(cricketGain).connect(ambienceBus);
  cricket.start();
  pulse.start();
  return true;
}

function birdCall(): void {
  if (!ctx || !ambienceBus || !ambienceEnabled) return;
  const ac = ctx;
  const t0 = ac.currentTime + 0.02;
  const notes = 2 + Math.floor(Math.random() * 3);
  const base = 2000 + Math.random() * 900;
  for (let i = 0; i < notes; i++) {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    const start = t0 + i * 0.11;
    osc.frequency.setValueAtTime(base, start);
    osc.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.2), start + 0.06);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.03, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
    osc.connect(g).connect(ambienceBus);
    osc.start(start);
    osc.stop(start + 0.1);
  }
}

function scheduleBird(): void {
  window.clearTimeout(birdTimer);
  if (!currentScene || currentScene.phase !== 'day' || currentScene.weather === 'rain') return;
  birdTimer = window.setTimeout(
    () => {
      birdCall();
      scheduleBird();
    },
    1800 + Math.random() * 4200,
  );
}

function ramp(g: GainNode | null, v: number): void {
  if (!g || !ctx) return;
  g.gain.cancelScheduledValues(ctx.currentTime);
  g.gain.setTargetAtTime(v, ctx.currentTime, 0.8);
}

/** Set the ambient layer: birds by day, crickets at night, rain, the stream. Null silences it. */
export function setAmbience(scene: AmbienceScene | null): void {
  const changed =
    !scene ||
    !currentScene ||
    scene.phase !== currentScene.phase ||
    scene.weather !== currentScene.weather ||
    scene.stream !== currentScene.stream;
  currentScene = scene ? { ...scene } : null;
  if (!unlocked || !ensureAmbience()) return;
  if (!changed) return;
  try {
    ramp(streamGain, scene?.stream ? 0.05 : 0);
    ramp(rainGain, scene?.weather === 'rain' ? 0.045 : 0);
    ramp(cricketGain, scene?.phase === 'night' && scene.weather !== 'rain' ? 0.012 : 0);
    scheduleBird();
  } catch {
    // Audio problems must never break the game.
  }
}

export function setAmbienceEnabled(on: boolean): void {
  ambienceEnabled = on;
  if (ambienceBus && ctx) ambienceBus.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.3);
  if (!on) window.clearTimeout(birdTimer);
  else scheduleBird();
}

/** One chirp note, as `tone` takes it: Hz, start ms, length ms, wave, gain, slide target. */
export type ChirpNote = [number, number, number, OscillatorType, number, number?];

/**
 * A little voice per family when a Nubbin reacts. R0462 (TECH-65): `voice` (from
 * platform/chirp-voice.ts) gives each Nubbin its own pitch, pace, rise and loudness.
 */
export function chirpNotes(
  family: 'chao' | 'pocket' | 'digi',
  happy: boolean,
  voice: ChirpVoice = PLAIN_VOICE,
): ChirpNote[] {
  const base: ChirpNote[] = [];
  if (family === 'chao') {
    base.push([happy ? 880 : 520, 0, 70, 'sine', 0.05, happy ? 1320 : 400]);
    if (happy) base.push([1180, 80, 90, 'sine', 0.04, 1500]);
  } else if (family === 'pocket') {
    base.push([happy ? 700 : 450, 0, 90, 'triangle', 0.05, happy ? 900 : 380]);
    base.push([happy ? 950 : 380, 100, 110, 'triangle', 0.04]);
  } else {
    base.push([happy ? 600 : 400, 0, 50, 'square', 0.035, happy ? 1000 : 300]);
    base.push([happy ? 1000 : 300, 60, 50, 'square', 0.035]);
    if (happy) base.push([1400, 120, 70, 'square', 0.03]);
  }
  const last = base.length - 1;
  const notes = base.map(([f, at, ms, wave, g, slide], i): ChirpNote => {
    const len = (ms / voice.speed) * (i === last ? voice.tail : 1);
    const to = (slide ?? f) * (1 + voice.wobble) * voice.pitch;
    return [f * voice.pitch, at / voice.speed, len, wave, g * voice.gain, to];
  });
  // A mischievous voice ends on a quick rising trill.
  if (voice.wobble >= CHIRP_VOICE.trillAt) {
    const [f, at, ms, wave, g] = notes[last]!;
    notes.push([f * 1.26, at + ms * 0.7, ms * 0.6, wave, g * 0.7, f * 1.6]);
  }
  return notes;
}

export function playChirp(
  family: 'chao' | 'pocket' | 'digi',
  happy = true,
  voice: ChirpVoice = PLAIN_VOICE,
): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    for (const [f, at, ms, wave, g, to] of chirpNotes(family, happy, voice)) {
      tone(f, at, ms, wave, g, to);
    }
  } catch {
    // Audio problems must never break the game.
  }
}

/** R0525 (lane A r10): each level's four-note song (Hz), sung in a chirp. */
export const PERFORM_MELODIES: readonly (readonly number[])[] = [
  [523, 659, 784, 659],
  [784, 659, 1047, 784],
  [523, 784, 1319, 1047],
];

/** R0589 (lane A r11): the pentatonic degrees (semitones above the root) a motif draws from. */
const MOTIF_SCALE = [0, 2, 4, 7, 9, 12, 14] as const;

/**
 * A Nubbin's own four-note motif, from its seed: the same notes every time, different for
 * different Nubbins. Frequencies in Hz before the voice pitch. Pure; no lyrics, no tune borrowed.
 */
export function motifOf(seed: number): number[] {
  let h = (seed ^ 0x9e3779b9) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < 4; i++) {
    h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d) >>> 0;
    const deg = MOTIF_SCALE[h % MOTIF_SCALE.length]!;
    out.push(Math.round(392 * Math.pow(2, deg / 12)));
  }
  return out;
}

/** R0589: hum or sing the motif; `harmony` adds a friend a third above, singing alongside. */
export function playMotif(seed: number, pitch = 1, harmony = false): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    motifOf(seed).forEach((f, i) => {
      tone(f * pitch, i * 300, 260, 'sine', 0.035, f * pitch * 1.01);
      if (harmony) tone(f * pitch * 1.26, i * 300, 260, 'sine', 0.02, f * pitch * 1.27);
    });
  } catch {
    // Audio problems must never break the game.
  }
}

/**
 * R0554 (lane A r11): the wider classes' own sounds, each a few quiet notes of its own shape.
 * Returns false for a variant that has no voice of its own (it then falls back to its family).
 */
function playVariantSound(id: string, pitch: number): boolean {
  switch (id) {
    case 'instrument:maracas':
      for (let i = 0; i < 6; i++) burst(i * 90, 60, 0.03, 6000);
      return true;
    case 'instrument:tambourine':
      for (let i = 0; i < 3; i++) {
        burst(i * 200, 80, 0.035, 7500);
        tone(2800 * pitch, i * 200, 60, 'triangle', 0.015);
      }
      return true;
    case 'instrument:flute':
      [880, 988, 1175, 988].forEach((f, i) =>
        tone(f * pitch, i * 280, 300, 'sine', 0.035, f * pitch),
      );
      return true;
    case 'dance:twist':
      for (let i = 0; i < 4; i++) tone((i % 2 ? 330 : 440) * pitch, i * 150, 110, 'square', 0.015);
      return true;
    case 'dance:ra-ra':
      for (let i = 0; i < 3; i++) tone(660 * pitch, i * 180, 120, 'triangle', 0.04, 880 * pitch);
      burst(540, 200, 0.03, 5000);
      return true;
    case 'dance:shake':
      for (let i = 0; i < 6; i++) tone(180 + (i % 2) * 40, i * 90, 70, 'sine', 0.05, 120);
      return true;
    case 'song:lullaby':
      [392, 330, 294].forEach((f, i) => tone(f * pitch, i * 420, 520, 'sine', 0.035, f * pitch));
      return true;
    case 'song:march':
      [262, 262, 330, 392].forEach((f, i) => tone(f * pitch, i * 200, 130, 'square', 0.02));
      return true;
    case 'song:silly':
      [600, 900, 500, 1000].forEach((f, i) =>
        tone(f * pitch, i * 170, 150, 'triangle', 0.035, f * pitch * 1.5),
      );
      return true;
    case 'exercise:stretch':
      tone(220 * pitch, 0, 900, 'sine', 0.035, 440 * pitch);
      return true;
    case 'manners:bow':
      tone(659 * pitch, 0, 260, 'sine', 0.035);
      tone(523 * pitch, 320, 360, 'sine', 0.035);
      return true;
    default:
      return false;
  }
}

/**
 * R0525 (SOUL-07): the sound of a lesson performed: a four-note song that grows with the
 * level, a stomp-and-squeak dance, a crayon's scratch, or the instrument it was handed (a
 * ringing bell, a drum's thump, a little trumpet fanfare). Quiet, under the sound setting.
 */
export function playPerform(
  lesson: 'drawing' | 'singing' | 'dance' | 'instrument',
  level: number,
  instrument: 'bell' | 'drum' | 'trumpet' = 'bell',
  pitch = 1,
  variant?: string,
): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  const lv = Math.max(1, Math.min(3, level));
  try {
    if (variant && playVariantSound(variant, pitch)) return;
    if (lesson === 'singing') {
      PERFORM_MELODIES[lv - 1]!.forEach((f, i) =>
        tone(f * pitch, i * 260, 230, 'sine', 0.04, f * pitch * 1.03),
      );
    } else if (lesson === 'dance') {
      for (let i = 0; i < lv + 1; i++) tone(95, i * 300, 120, 'sine', 0.07, 60);
      tone(1200 * pitch, (lv + 1) * 300, 90, 'triangle', 0.03, 1600 * pitch);
    } else if (lesson === 'drawing') {
      for (let i = 0; i < 3; i++) burst(i * 140, 90, 0.025, 3500);
    } else if (instrument === 'bell') {
      tone(1568, 0, 1100, 'triangle', 0.04);
      tone(2350, 0, 600, 'sine', 0.015);
      if (lv > 1) tone(1319, 380, 900, 'triangle', 0.03);
    } else if (instrument === 'drum') {
      for (let i = 0; i < lv + 1; i++) {
        tone(140, i * 260, 160, 'sine', 0.09, 55);
        burst(i * 260, 60, 0.03, 900);
      }
    } else {
      const notes = [392, 523, 659, 784].slice(0, lv + 1);
      notes.forEach((f, i) => tone(f, i * 180, 170, 'sawtooth', 0.018, f * 1.01));
    }
  } catch {
    // Audio problems must never break the game.
  }
}

// ---------------------------------------------------------------- Hollow cues (lane B r7)

/**
 * R0199 (DUNG-56): the Hollow's encounter cues, all synthesised here like every other sound,
 * muted until the first tap and under the sound setting like the rest. `drop:<rarity>` rises
 * with the tier (a tick, a ting, two notes, an arpeggio, a chord); `boss:<act>` is a short
 * sting on its own root for each act.
 */
export type HollowCue =
  | 'notice'
  | 'poof'
  | 'shrine'
  | 'waypoint'
  | `drop:${'plain' | 'shiny' | 'fancy' | 'legendary' | 'set'}`
  | `boss:${number}`;

export function playHollowCue(cue: HollowCue): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    if (cue === 'notice') {
      tone(1400, 0, 60, 'square', 0.035);
      tone(1800, 70, 80, 'square', 0.03);
    } else if (cue === 'poof') {
      tone(300, 0, 260, 'sine', 0.05, 1200);
      for (let i = 0; i < 3; i++) tone(1800 + i * 300, 200 + i * 60, 50, 'triangle', 0.025);
    } else if (cue === 'shrine') {
      tone(220, 0, 700, 'sine', 0.04);
      tone(330, 80, 620, 'sine', 0.025);
    } else if (cue === 'waypoint') {
      tone(180, 0, 380, 'triangle', 0.05, 900);
      tone(900, 300, 200, 'sine', 0.025, 1300);
    } else if (cue === 'drop:plain') {
      tone(1000, 0, 30, 'square', 0.025);
    } else if (cue === 'drop:shiny') {
      tone(1760, 0, 140, 'triangle', 0.04);
    } else if (cue === 'drop:fancy') {
      tone(1175, 0, 90, 'triangle', 0.05);
      tone(1568, 90, 160, 'triangle', 0.05);
    } else if (cue === 'drop:legendary') {
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 70, 160, 'triangle', 0.05));
    } else if (cue === 'drop:set') {
      for (const f of [523, 659, 784, 1047]) tone(f, 0, 600, 'triangle', 0.035);
    } else if (cue.startsWith('boss:')) {
      const root = [110, 98, 123, 87, 73][Number(cue.slice(5))] ?? 110;
      tone(root, 0, 500, 'sawtooth', 0.05);
      tone(root * 1.5, 120, 380, 'sawtooth', 0.04);
      tone(root * 2, 260, 520, 'square', 0.035, root * 1.89);
    }
  } catch {
    // As above.
  }
}

// ---------------------------------------------------------------- R0139 (lane D r9): biome beds

/**
 * Where a biome sound bed (platform/biome-beds.ts) plugs in: the running context, the
 * ambience bus (so the Ambience setting, the SFX volume and mute all govern it) and the shared
 * noise buffer. Null until the first tap unlocks sound, so nothing is built or heard before.
 */
export function ambienceOut(): { ctx: AudioContext; bus: GainNode; noise: AudioBuffer } | null {
  if (!unlocked || !ctx || !ensureAmbience() || !ambienceBus) return null;
  return { ctx, bus: ambienceBus, noise: noise(ctx) };
}
