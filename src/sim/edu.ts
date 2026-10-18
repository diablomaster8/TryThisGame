import {
  EDU,
  EDU_GAMES,
  EDU_READER_GAMES,
  EDU_RECOMMENDED,
  type EduAge,
  type EduGameId,
} from '../config/edu';
import type { EduBand } from '../content/types';
import type { EduState, SimEvent, World } from './types';

/**
 * Educational mode state: the age band, which games are switched on (the recommended
 * set to start, then whatever the grown-up chooses), session length, the child's name
 * for the letter games, and progress per game. Results arrive from the screen as
 * stars; the sim pays Shells and counts stickers.
 */
export function recommendedGames(age: EduAge): Record<EduGameId, boolean> {
  const out = {} as Record<EduGameId, boolean>;
  for (const g of EDU_GAMES) out[g] = EDU_RECOMMENDED[age].includes(g);
  return out;
}

export function createEdu(age: EduAge, band: EduBand = 'sprout'): EduState {
  const progress = {} as EduState['progress'];
  for (const g of EDU_GAMES) progress[g] = { plays: 0, stars: 0 };
  return {
    age,
    games: recommendedGames(age),
    sessionMinutes: EDU.sessionMinutes,
    childName: '',
    progress,
    stickers: 0,
    playedMs: 0,
    band,
    storyLanguage: 'learning',
    lessons: {},
    readAloud: true,
    words: {},
    courses: { hebrew: false, japanese: false },
  };
}

export function eduStart(
  world: World,
  age: EduAge,
  events: SimEvent[],
  band: EduBand = 'sprout',
): void {
  world.edu = createEdu(age, band);
  events.push({ kind: 'eduStarted', age });
}

export function eduSetAge(world: World, age: EduAge, resetGames: boolean): void {
  if (!world.edu) return;
  world.edu.age = age;
  if (resetGames) world.edu.games = recommendedGames(age);
}

export function eduSetGame(world: World, game: EduGameId, on: boolean): void {
  if (!world.edu) return;
  world.edu.games[game] = on;
}

export function eduSetSession(world: World, minutes: number): void {
  if (!world.edu) return;
  const [lo, hi] = EDU.sessionRange;
  world.edu.sessionMinutes = Math.round(Math.min(hi, Math.max(lo, minutes)));
}

export function eduSetName(world: World, name: string): void {
  if (!world.edu) return;
  world.edu.childName = name.slice(0, 20);
}

/** A finished round: stars earned, Shells and fruit paid, stickers counted. */
export function eduResult(world: World, game: EduGameId, stars: number, events: SimEvent[]): void {
  const e = world.edu;
  if (!e) return;
  const s = Math.max(0, Math.min(3, Math.round(stars)));
  const p = e.progress[game];
  p.plays += 1;
  p.stars += s;
  const before = e.stickers;
  const total = Object.values(e.progress).reduce((sum, x) => sum + x.stars, 0);
  e.stickers = Math.floor(total / EDU.starsPerSticker);
  world.inventory.shells += s * EDU.shellsPerStar;
  if (s === 3) world.inventory.fruit += 1;
  events.push({ kind: 'eduResult', game, stars: s, sticker: e.stickers > before });
}

/** Which games the child can open right now. */
export function enabledGames(world: World): EduGameId[] {
  const e = world.edu;
  if (!e) return [];
  return gamesForBand(e.band).filter((g) => e.games[g]);
}

/** The games a band is offered: readers skip the preschool ones (review C, item 18). */
export function gamesForBand(band: EduBand): readonly EduGameId[] {
  return band === 'reader' ? EDU_READER_GAMES : EDU_GAMES;
}

/** Track live play time toward the break screen. */
export function stepEdu(world: World, dtMs: number): void {
  if (world.edu) world.edu.playedMs += dtMs;
}

export function eduBreakDue(world: World): boolean {
  const e = world.edu;
  return !!e && e.playedMs >= e.sessionMinutes * 60_000;
}

export function eduResetSession(world: World): void {
  if (world.edu) world.edu.playedMs = 0;
}

/**
 * A lesson beat finished in a story scene. Every beat counts once; a later play of the same
 * beat keeps the first answer, so the grown-up view shows what the child did first time.
 */
export function eduLesson(world: World, id: string, best: boolean | null): void {
  const e = world.edu;
  if (!e || e.lessons[id]) return;
  e.lessons[id] = { best };
}
