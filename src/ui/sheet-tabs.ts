/**
 * TECH-07: what the stats sheet shows for each stage, as plain rules the sheet follows. An egg
 * gets no tabs (name, hatch ring, Pick up / Shake). A child gets Care (faces for its needs and
 * Pet, Feed, Pick up, with the gentler plays behind "More ways to play", arriving over its
 * childhood) and Inside (the numeric meters, stats, accessories, rebirth). After the first
 * evolution a Grow tab takes the stats, accessories, rebirth and the Bout card.
 */
import { SHEET_TABS_TEXT } from '../config/strings-r8d';
import { EGG } from '../config/tuning';
import { SHEET_TABS } from '../config/tuning-r8d';
import type { Interaction, Nubbin } from '../sim/types';

export type SheetTab = 'care' | 'inside' | 'grow';

/** The plays under "More ways to play", in the order a child discovers them. */
export const PLAYS: readonly Interaction[] = [
  'tickle',
  'hug',
  'groom',
  'highFive',
  'praise',
  'tuckIn',
];

/** The tabs this Nubbin's sheet has; none for an egg. */
export function sheetTabsFor(n: Pick<Nubbin, 'stage' | 'form'>): SheetTab[] {
  if (n.stage === 'egg') return [];
  return n.form ? ['care', 'inside', 'grow'] : ['care', 'inside'];
}

/**
 * How many of `PLAYS` show. A grown or reborn Nubbin has them all; a first-life child starts
 * with a couple and finds one more every little while of its age.
 */
export function playsUnlocked(n: Pick<Nubbin, 'form' | 'rebirths' | 'ageMs'>): number {
  if (n.form || n.rebirths > 0) return PLAYS.length;
  const more = Math.floor(Math.max(0, n.ageMs) / SHEET_TABS.playEveryMs);
  return Math.min(PLAYS.length, SHEET_TABS.playsAtHatch + more);
}

export type FaceBand = 'good' | 'ok' | 'low';

/** A need (0..1) as a face band. */
export function faceBand(v: number): FaceBand {
  return v >= SHEET_TABS.goodAt ? 'good' : v >= SHEET_TABS.okAt ? 'ok' : 'low';
}

/** The three needs a child shows as faces, each 0..1. */
export function careFaces(n: Pick<Nubbin, 'needs'>): Array<{
  key: 'hunger' | 'energy' | 'happiness';
  band: FaceBand;
  text: string;
  label: string;
}> {
  const vals = {
    hunger: n.needs.hunger,
    energy: n.needs.energy,
    happiness: (n.needs.happiness + 100) / 200,
  } as const;
  return (['hunger', 'energy', 'happiness'] as const).map((key) => {
    const band = faceBand(vals[key]);
    return {
      key,
      band,
      text: `${SHEET_TABS_TEXT.needs[key]} ${SHEET_TABS_TEXT.faces[band]}`,
      label: `${SHEET_TABS_TEXT.needs[key].replace(/^\S+\s/, '')}: ${SHEET_TABS_TEXT.faceWords[band]}`,
    };
  });
}

/** How far an egg is toward hatching, 0..1, for the ring timer. */
export function hatchFraction(n: Pick<Nubbin, 'hatchRemainingMs'>): number {
  const total = Math.max(EGG.hatchMs, n.hatchRemainingMs);
  return Math.min(1, Math.max(0, 1 - n.hatchRemainingMs / total));
}
