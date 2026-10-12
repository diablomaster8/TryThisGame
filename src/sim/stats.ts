import { STATS } from '../config/tuning';
import type { Rng } from './rng';
import { GRADES, STAT_KEYS, type Grade, type StatBlock, type StatKey } from './types';

export function gradeMultiplier(grade: Grade): number {
  return STATS.gradeMultiplier[grade];
}

export function rollGrade(rng: Rng): Grade {
  return rng.weighted(STATS.gradeWeights);
}

export function rollStats(rng: Rng): Record<StatKey, StatBlock> {
  const out = {} as Record<StatKey, StatBlock>;
  for (const key of STAT_KEYS) out[key] = { points: 0, grade: rollGrade(rng) };
  return out;
}

export const MAX_POINTS = STATS.maxLevel * STATS.pointsPerLevel;

export function levelOf(points: number): number {
  return Math.min(STATS.maxLevel, Math.floor(points / STATS.pointsPerLevel));
}

/** Add raw points; the grade multiplies them and the 99 cap holds. */
export function addPoints(stat: StatBlock, rawPoints: number): number {
  const gained = rawPoints * gradeMultiplier(stat.grade);
  stat.points = Math.min(MAX_POINTS, stat.points + gained);
  return gained;
}

export function nextGrade(grade: Grade): Grade {
  const i = GRADES.indexOf(grade);
  return GRADES[Math.min(GRADES.length - 1, i + 1)] ?? grade;
}
