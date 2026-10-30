/**
 * R0360 (FUN-71): a dry editorial line under the name on the stats sheet, for the main band
 * only. Every caption in `SHEET_CAPTIONS` has a rule here saying when it fits (by grade,
 * personality and the counts the save already keeps); one fitting caption is picked per
 * opening, in turn, so the sheet never says the same thing twice running. Reads only.
 */
import { SHEET_CAPTIONS } from '../config/strings-fun-r7';
import { GRADES, STAT_KEYS, type Nubbin, type World } from '../sim/types';
import { toastBand } from './fun-toasts';

const g = (n: Nubbin, k: (typeof STAT_KEYS)[number]): number => GRADES.indexOf(n.stats[k].grade);

const RULES: Record<string, (n: Nubbin) => boolean> = {
  swimsStone: (n) => g(n, 'swim') <= 1,
  swimsFish: (n) => g(n, 'swim') >= 4,
  fliesNot: (n) => g(n, 'fly') <= 1,
  fliesWell: (n) => g(n, 'fly') >= 4,
  runsSlow: (n) => g(n, 'run') <= 1,
  runsFast: (n) => g(n, 'run') >= 4,
  strong: (n) => g(n, 'power') >= 4,
  weak: (n) => g(n, 'power') === 0,
  staminaHigh: (n) => g(n, 'stamina') >= 4,
  allE: (n) => STAT_KEYS.every((k) => g(n, k) === 0),
  hasS: (n) => STAT_KEYS.some((k) => n.stats[k].grade === 'S'),
  fedLots: (n) => n.childCare.feeds >= 10,
  pettedLots: (n) => n.childCare.pets >= 20,
  neverThrown: (n) => n.childCare.throws === 0 && n.stage !== 'egg',
  thrownSome: (n) => n.childCare.throws > 0,
  karateWins: (n) => n.karate.wins > 0,
  karateLosses: (n) => n.karate.losses > 1,
  friendsMany: (n) => Object.keys(n.friends).length >= 3,
  friendsNone: (n) => Object.keys(n.friends).length === 0 && n.stage === 'adult',
  reborn: (n) => n.rebirths > 0,
  slipsNone: (n) => n.slipCount === 0 && n.ageMs > 30 * 60_000,
  slipsSome: (n) => n.slipCount >= 2,
  cheerful: (n) => n.personality === 'cheerful',
  shy: (n) => n.personality === 'shy',
  mischievous: (n) => n.personality === 'mischievous',
  lazy: (n) => n.personality === 'lazy',
  hatted: (n) => !!n.hat,
  glasses: (n) => n.glasses,
  shadow: (n) => n.shadow && !n.bond,
  eternal: (n) => !!n.eternal,
  child: (n) => n.stage === 'child',
  adult: (n) => n.stage === 'adult' && !n.eternal,
};

let turn = 0;

/** Every caption that fits this Nubbin now, filled in. */
export function fittingCaptions(n: Nubbin): string[] {
  const vars: Record<string, string> = {
    n: n.name,
    pets: String(n.childCare.pets),
    feeds: String(n.childCare.feeds),
    throws: String(n.childCare.throws),
    wins: String(n.karate.wins),
    losses: String(n.karate.losses),
    friends: String(Object.keys(n.friends).length),
    lives: String(n.rebirths + 1),
    slips: String(n.slipCount),
  };
  return Object.entries(SHEET_CAPTIONS)
    .filter(([k]) => RULES[k]?.(n))
    .map(([, t]) => t.replace(/\{(\w+)\}/g, (_, v: string) => vars[v] ?? ''));
}

/** One caption for this opening of the sheet, or null (other bands, eggs, nothing fits). */
export function sheetCaption(world: World, n: Nubbin): string | null {
  if (toastBand(world) !== 'main' || n.stage === 'egg' || n.stage === 'cocoon') return null;
  const fits = fittingCaptions(n);
  if (!fits.length) return null;
  return fits[turn++ % fits.length]!;
}
