/**
 * The one-shot sound effects (TECH-37, moved out of audio.ts): each `SoundName` is a few
 * oscillator blips and noise bursts. `audio.ts` owns the Web Audio graph and passes in the
 * two voices it draws with, so this file has no state of its own.
 */
import type { SoundName } from './audio';

export type ToneFn = (
  freq: number,
  startMs: number,
  durMs: number,
  type?: OscillatorType,
  gain?: number,
  slideTo?: number,
) => void;
export type BurstFn = (startMs: number, durMs: number, gain: number, cutoff: number) => void;

/** Play `name` through `tone` and `burst`. */
export function playSfxVoices(name: SoundName, tone: ToneFn, burst: BurstFn): void {
  switch (name) {
    case 'squeak':
      tone(900, 0, 90, 'sawtooth', 0.025, 1400);
      break;
    case 'slideDown':
      tone(1200, 0, 600, 'sine', 0.05, 300);
      break;
    case 'slideUp':
      tone(300, 0, 600, 'sine', 0.05, 1200);
      break;
    case 'pop':
      tone(500, 0, 40, 'sine', 0.07, 1100);
      break;
    case 'sneeze':
      // A little in-breath whistle, then the "choo".
      tone(700, 0, 220, 'sine', 0.02, 1100);
      burst(260, 140, 0.09, 1800);
      break;
    case 'hiccup':
      tone(500, 0, 50, 'square', 0.04, 900);
      break;
    case 'gulp':
      tone(320, 0, 70, 'sine', 0.06, 160);
      tone(260, 70, 60, 'sine', 0.04, 130);
      break;
    case 'raspberry':
      for (let i = 0; i < 6; i++) tone(110 + (i % 2) * 18, i * 45, 50, 'sawtooth', 0.025);
      break;
    case 'snore':
      // A slow, soft in-breath and a low buzz out.
      tone(220, 0, 500, 'sine', 0.02, 260);
      tone(90, 520, 600, 'sawtooth', 0.015, 70);
      break;
    case 'chirp':
      tone(1300, 0, 60, 'sine', 0.03, 1600);
      tone(1100, 110, 70, 'sine', 0.03, 1500);
      break;
    case 'burp':
      // A low, round, falling rasp.
      tone(150, 0, 260, 'sawtooth', 0.04, 80);
      tone(95, 40, 220, 'sine', 0.05, 60);
      break;
    case 'giggle':
      for (let i = 0; i < 3; i++) tone(900 + i * 160, i * 90, 70, 'sine', 0.04, 1200 + i * 160);
      break;
    case 'tap':
      tone(660, 0, 50, 'square', 0.04);
      break;
    case 'pickup':
      tone(880, 0, 60);
      tone(1320, 60, 90);
      break;
    case 'jump':
      tone(300, 0, 120, 'square', 0.06, 600);
      break;
    case 'hit':
      tone(160, 0, 160, 'sawtooth', 0.07, 60);
      break;
    case 'hatch':
      tone(523, 0, 90);
      tone(659, 90, 90);
      tone(784, 180, 160);
      break;
    case 'evolve':
      tone(523, 0, 110);
      tone(659, 110, 110);
      tone(784, 220, 110);
      tone(1047, 330, 320, 'triangle', 0.1);
      break;
    case 'pet':
      tone(900, 0, 70, 'sine', 0.06, 1200);
      break;
    case 'buy':
      tone(700, 0, 60, 'triangle');
      tone(1050, 70, 100, 'triangle');
      break;
    case 'cheer':
      tone(500, 0, 60, 'square', 0.06);
      tone(750, 60, 60, 'square', 0.06);
      tone(1000, 120, 120, 'square', 0.06);
      break;
    case 'win':
      tone(659, 0, 100);
      tone(784, 100, 100);
      tone(988, 200, 100);
      tone(1319, 300, 300, 'triangle', 0.1);
      break;
    case 'drip':
      tone(1500, 0, 50, 'sine', 0.03, 700);
      tone(1100, 70, 80, 'sine', 0.015, 600);
      break;
    case 'sad':
      tone(440, 0, 160, 'triangle', 0.06, 330);
      tone(330, 180, 240, 'triangle', 0.06, 220);
      break;
    case 'hop':
      tone(420, 0, 90, 'sine', 0.05, 640);
      break;
    case 'hopAir':
      tone(700, 0, 80, 'sine', 0.05, 1050);
      break;
    case 'pat':
      tone(180, 0, 45, 'triangle', 0.05, 120);
      break;
    case 'bonk':
      tone(220, 0, 70, 'triangle', 0.05, 150);
      break;
    case 'boing':
      tone(160, 0, 90, 'sine', 0.06, 440);
      tone(440, 80, 180, 'sine', 0.04, 300);
      break;
    case 'stepDeck':
      tone(210, 0, 40, 'triangle', 0.035, 170);
      break;
    case 'stepStone':
      tone(1400, 0, 18, 'triangle', 0.012);
      break;
    // R0351: a muffled "hey" from inside a shaken egg: two low, soft rising notes.
    case 'eggHey':
      tone(330, 0, 70, 'sine', 0.03, 420);
      tone(392, 80, 90, 'sine', 0.025, 520);
      break;
    // R0001: a soft slosh for each stride waded through the stream.
    case 'stepWade':
      burst(0, 140, 0.025, 1800);
      tone(520, 20, 80, 'sine', 0.012, 300);
      break;
    case 'plop':
      tone(260, 0, 70, 'sine', 0.06, 160);
      tone(520, 90, 90, 'sine', 0.05, 660);
      break;
    case 'creak':
      // A sticky hinge: a slow wobbling saw, low and dry.
      for (let i = 0; i < 4; i++)
        tone(140 + (i % 2) * 40, i * 110, 140, 'sawtooth', 0.02, 120 + i * 12);
      break;
    case 'munch':
      for (let i = 0; i < 3; i++) burst(i * 120, 60, 0.05, 900);
      break;
    case 'whoosh':
      burst(0, 380, 0.05, 1200);
      tone(300, 0, 380, 'sine', 0.02, 900);
      break;
    case 'splash':
      burst(0, 260, 0.08, 2400);
      tone(900, 40, 120, 'sine', 0.03, 400);
      break;
    // FIGHT-76: a hollow wood block for a Power or Normal hit.
    case 'woodblock':
      tone(880, 0, 45, 'triangle', 0.07, 760);
      tone(1320, 0, 25, 'sine', 0.03);
      break;
    // A Fly hit: a quick airy swish.
    case 'swish':
      burst(0, 160, 0.05, 5200);
      tone(1400, 0, 140, 'sine', 0.015, 600);
      break;
    // A Run hit: three little footsteps.
    // R0326 (lane E r10): a stray tiptoes up: four soft, plucked, creeping steps.
    case 'sneak':
      for (let i = 0; i < 4; i++) tone(i % 2 ? 660 : 587, i * 140, 40, 'triangle', 0.025, 520);
      break;
    case 'patter':
      for (let i = 0; i < 3; i++) tone(520 + i * 40, i * 55, 35, 'square', 0.03, 380);
      break;
    // Tuckered out: a long, sleepy downward yawn.
    case 'yawn':
      tone(520, 0, 520, 'sine', 0.05, 180);
      tone(260, 380, 300, 'sine', 0.03, 140);
      break;
    case 'guardClunk':
      tone(180, 0, 110, 'triangle', 0.05, 120);
      tone(300, 0, 60, 'square', 0.02, 200);
      break;
    case 'critHit':
      tone(880, 0, 70, 'square', 0.04, 1500);
      tone(1320, 60, 160, 'triangle', 0.04, 1800);
      break;
    case 'tickOpen':
      tone(1100, 0, 28, 'sine', 0.02, 1300);
      break;
    case 'tickClose':
      tone(800, 0, 28, 'sine', 0.02, 640);
      break;
    case 'ding':
      tone(1568, 0, 500, 'sine', 0.05);
      tone(2093, 0, 300, 'triangle', 0.015);
      break;
    // R0450 (TECH-08): the high jump's second, higher tone after the jump's own.
    case 'jumpHigh':
      tone(600, 0, 90, 'square', 0.045, 900);
      tone(900, 90, 120, 'square', 0.04, 1350);
      break;
    case 'sparkle':
      for (let i = 0; i < 4; i++) tone(1760 + i * 330, i * 45, 120, 'sine', 0.025);
      break;
    case 'bubblePop':
      tone(400, 0, 35, 'sine', 0.06, 1400);
      burst(30, 40, 0.03, 4000);
      break;
    case 'fanfare':
      tone(523, 0, 120, 'triangle', 0.07);
      tone(659, 120, 120, 'triangle', 0.07);
      tone(784, 240, 120, 'triangle', 0.07);
      tone(1047, 360, 420, 'triangle', 0.08);
      tone(784, 360, 420, 'sine', 0.03);
      break;
    case 'thup':
      tone(140, 0, 80, 'sine', 0.07, 80);
      burst(0, 40, 0.025, 600);
      break;
    case 'rustle':
      for (let i = 0; i < 3; i++) burst(i * 70, 110, 0.03, 3200);
      break;
    // The comedic hook: a rising, wobbly "wheee".
    case 'whee':
      tone(500, 0, 420, 'sine', 0.045, 1300);
      tone(1000, 40, 380, 'triangle', 0.012, 2400);
      break;
    case 'nom':
      tone(330, 0, 70, 'triangle', 0.045, 260);
      tone(330, 150, 70, 'triangle', 0.04, 250);
      break;
    case 'hmm':
      tone(260, 0, 260, 'sine', 0.04, 240);
      tone(240, 280, 240, 'sine', 0.03, 200);
      break;
  }
}
