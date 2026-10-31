/**
 * R0139 (WORLD-73): a looping sound bed per biome, built from WebAudio nodes on the ambience
 * bus (the same graph as the stream, rain and crickets in platform/audio.ts): filtered noise
 * that breathes on a slow wobble, plus a quiet pulsed tone for the chimes, crickets and drips.
 * A bed is built the first time its biome is heard and then only faded, so walking between
 * biomes cross-fades over `BIOME_BEDS.crossfadeSec` with both beds sounding meanwhile (no gap,
 * and each is quiet enough that the overlap never clips). Nothing exists before the first tap.
 */
import type { Biome } from '../config/regions';
import { BIOME_BEDS, type BedSpec } from '../config/tuning-r9d4';
import { ambienceOut } from './audio';

interface Bed {
  out: GainNode;
}

const beds = new Map<Biome, Bed>();
let want: Biome | null = null;

function build(ac: AudioContext, bus: GainNode, noise: AudioBuffer, spec: BedSpec): Bed {
  const out = ac.createGain();
  out.gain.value = 0;
  out.connect(bus);
  const src = ac.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  // Start each bed at its own point in the loop so two beds never phase together.
  const f = ac.createBiquadFilter();
  f.type = spec.noise.type;
  f.frequency.value = spec.noise.hz;
  f.Q.value = spec.noise.q;
  const g = ac.createGain();
  g.gain.value = spec.noise.gain;
  const lfo = ac.createOscillator();
  lfo.frequency.value = spec.lfo.hz;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = spec.lfo.depth;
  lfo.connect(lfoGain).connect(g.gain);
  src.connect(f).connect(g).connect(out);
  lfo.start();
  src.start(0, (beds.size * 0.37) % 1.5);
  const t = spec.tone;
  if (t) {
    const osc = ac.createOscillator();
    osc.type = t.wave;
    osc.frequency.value = t.hz;
    const tg = ac.createGain();
    tg.gain.value = t.gain;
    const pulse = ac.createOscillator();
    pulse.frequency.value = t.pulseHz;
    const pg = ac.createGain();
    pg.gain.value = t.pulseDepth;
    pulse.connect(pg).connect(tg.gain);
    osc.connect(tg).connect(out);
    osc.start();
    pulse.start();
  }
  return { out };
}

/** Fade the beds toward `biome` (null: all quiet, as under a dialogue or a minigame). */
export function setBiomeBed(biome: Biome | null): void {
  const io = ambienceOut();
  if (!io) return;
  if (biome === want && (!biome || beds.has(biome))) return;
  want = biome;
  try {
    if (biome && !beds.has(biome))
      beds.set(biome, build(io.ctx, io.bus, io.noise, BIOME_BEDS.beds[biome]));
    const tau = BIOME_BEDS.crossfadeSec / 4;
    for (const [b, bed] of beds) {
      const g = bed.out.gain;
      g.cancelScheduledValues(io.ctx.currentTime);
      g.setTargetAtTime(b === biome ? 1 : 0, io.ctx.currentTime, tau);
    }
  } catch {
    // Audio problems must never break the game.
  }
}

/** The biome a bed is fading toward (for checks). */
export function biomeBedNow(): Biome | null {
  return want;
}
