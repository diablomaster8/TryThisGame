import { Vector3 } from 'three';
import { C, color } from './sprites/palette';

/**
 * Time of day from the real clock (a pet game should feel like now), with a debug
 * override. Each phase sets the sky, the light rig, the grade and whether lanterns and
 * fireflies are out. Phases blend so dusk and dawn are gradual.
 */
export type Phase = 'dawn' | 'day' | 'dusk' | 'night';

export interface Daylight {
  phase: Phase;
  /** 0..1 blend toward the next phase. */
  t: number;
  sky: string;
  hemiIntensity: number;
  hemiColor: string;
  sunIntensity: number;
  sunColor: string;
  tint: Vector3;
  tintAmount: number;
  bloom: number;
  lanterns: boolean;
  fireflies: boolean;
  /** 0 day … 1 night, for sprite dimming. */
  darkness: number;
}

const KEY: Record<Phase, Omit<Daylight, 'phase' | 't'>> = {
  day: {
    sky: color(C.nightBlue),
    hemiIntensity: 1.5,
    hemiColor: color(C.shallows),
    sunIntensity: 1.1,
    sunColor: color(C.cream),
    tint: new Vector3(1, 1, 1),
    tintAmount: 0,
    bloom: 0.3,
    lanterns: false,
    fireflies: false,
    darkness: 0,
  },
  dusk: {
    sky: color(C.moonPurple),
    hemiIntensity: 1.1,
    hemiColor: color(C.orange),
    sunIntensity: 0.9,
    sunColor: color(C.orange),
    tint: new Vector3(1.05, 0.85, 0.75),
    tintAmount: 0.45,
    bloom: 0.45,
    lanterns: true,
    fireflies: true,
    darkness: 0.35,
  },
  night: {
    sky: color(C.ink),
    hemiIntensity: 0.75,
    hemiColor: color(C.violet),
    sunIntensity: 0.4,
    sunColor: color(C.lavender),
    tint: new Vector3(0.55, 0.62, 1.0),
    tintAmount: 0.6,
    bloom: 0.7,
    lanterns: true,
    fireflies: true,
    darkness: 0.8,
  },
  dawn: {
    sky: color(C.violet),
    hemiIntensity: 1.2,
    hemiColor: color(C.blush),
    sunIntensity: 0.9,
    sunColor: color(C.roseLight),
    tint: new Vector3(1.05, 0.9, 0.95),
    tintAmount: 0.35,
    bloom: 0.4,
    lanterns: false,
    fireflies: false,
    darkness: 0.2,
  },
};

/** Hour (0..24, fractional) → phase and blend. */
export function phaseAt(hour: number): { phase: Phase; t: number } {
  const h = ((hour % 24) + 24) % 24;
  if (h >= 6 && h < 8) return { phase: 'dawn', t: (h - 6) / 2 };
  if (h >= 8 && h < 18) return { phase: 'day', t: 0 };
  if (h >= 18 && h < 20) return { phase: 'dusk', t: (h - 18) / 2 };
  return { phase: 'night', t: 0 };
}

export function daylightAt(hour: number): Daylight {
  const { phase, t } = phaseAt(hour);
  const next: Phase = phase === 'dawn' ? 'day' : phase === 'dusk' ? 'night' : phase;
  const a = KEY[phase];
  const b = KEY[next];
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    phase,
    t,
    sky: t < 0.5 ? a.sky : b.sky,
    hemiIntensity: mix(a.hemiIntensity, b.hemiIntensity),
    hemiColor: t < 0.5 ? a.hemiColor : b.hemiColor,
    sunIntensity: mix(a.sunIntensity, b.sunIntensity),
    sunColor: t < 0.5 ? a.sunColor : b.sunColor,
    tint: a.tint.clone().lerp(b.tint, t),
    tintAmount: mix(a.tintAmount, b.tintAmount),
    bloom: mix(a.bloom, b.bloom),
    lanterns: a.lanterns || (t > 0.5 && b.lanterns),
    fireflies: a.fireflies || (t > 0.5 && b.fireflies),
    darkness: mix(a.darkness, b.darkness),
  };
}

/** The current real-time hour with minutes as a fraction. */
export function localHour(date = new Date()): number {
  return date.getHours() + date.getMinutes() / 60;
}
