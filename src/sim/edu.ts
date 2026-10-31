import {
  EDU,
  EDU_CLIMB,
  EDU_GAMES,
  EDU_LADDER,
  EDU_MASTERY,
  EDU_READER_GAMES,
  EDU_RECOMMENDED,
  ladderStart,
  type EduAge,
  type EduGameId,
} from '../config/edu';
import type { EduBand } from '../content/types';
import type { EduItem, EduState, SimEvent, World } from './types';
import { localDayKey, tzOf } from './local-time';
import { noteDaily } from './edu-report';

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
    breakUntilMs: 0,
    todayMs: 0,
    todayKey: '',
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

/**
 * Lane E r10, R0735 (KIDS-67): a reader's age, 7 to 10. Only a reader save keeps one; the
 * games stay at their top rung (the band is what changes them), so this is the child's age as
 * the grown-up gave it, shown on the slot and in the grown-up area.
 */
export function eduSetReaderAge(world: World, age: number): void {
  if (!world.edu || world.edu.band !== 'reader') return;
  if (age !== 7 && age !== 8 && age !== 9 && age !== 10) return;
  world.edu.readerAge = age;
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
export function eduResult(
  world: World,
  game: EduGameId,
  stars: number,
  events: SimEvent[],
  item?: string,
  first?: boolean,
): void {
  const e = world.edu;
  if (!e) return;
  const s = Math.max(0, Math.min(3, Math.round(stars)));
  eduClimb(world, game, s, !!first);
  if (item) eduSeen(world, item, s === 3);
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

/** Local YYYY-MM-DD for a wall-clock time in the Keeper's time zone (TECH-45). */
export function dayKey(wallMs: number, tzMin = 0): string {
  return localDayKey(wallMs, tzMin);
}

/**
 * Track live play time toward the break screen. Catch-up, a hidden tab and debug time
 * scales pass `skip`: that time is not play. A new day starts the day's count again.
 */
export function stepEdu(world: World, dtMs: number, wallMs?: number, skip = false): void {
  const e = world.edu;
  if (!e || skip) return;
  if (wallMs !== undefined) {
    const key = dayKey(wallMs, tzOf(world));
    if (e.todayKey !== key) {
      e.todayKey = key;
      e.todayMs = 0;
      e.playedMs = 0;
    }
  }
  e.playedMs += dtMs;
  e.todayMs += dtMs;
  // Lane E r10 (R0718): the week's minutes for the grown-up chart.
  noteDaily(e);
}

/** True while the break is locking play. */
export function eduBreakActive(world: World, nowMs: number): boolean {
  return !!world.edu && world.edu.breakUntilMs > nowMs;
}

/** Start the break: play is locked for the break length and the session count restarts. */
export function eduStartBreak(world: World): void {
  const e = world.edu;
  if (!e) return;
  e.breakUntilMs = world.lastWallMs + EDU.breakMinutes * 60_000;
  e.playedMs = 0;
}

/** A grown-up's "more time": the break ends now. */
export function eduEndBreak(world: World): void {
  if (!world.edu) return;
  world.edu.breakUntilMs = 0;
  world.edu.playedMs = 0;
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

/**
 * R0691 (KIDS-23): in a sprout save every end of life is a rebirth, so a young child who
 * drifted away for a week never comes back to a Nubbin gone for good. A reader save does the
 * same when a grown-up switched it on. The 10% carry-over and the Eternal rules are unchanged.
 */
export function eduAlwaysReborn(world: World): boolean {
  const e = world.edu;
  if (!e) return false;
  return e.band === 'sprout' ? EDU.alwaysRebornSprout : !!e.alwaysReborn;
}

/** R0724 (KIDS-56): the last two minutes before the break, when the Grove starts to yawn. */
export function eduBreakSoon(world: World): boolean {
  const e = world.edu;
  if (!e) return false;
  const left = e.sessionMinutes * 60_000 - e.playedMs;
  return left > 0 && left <= EDU.breakWarnMinutes * 60_000;
}

/**
 * R0724: start the break now? A round, scene or tracing still open gets to finish, up to
 * `EDU.breakGraceMinutes` past time; then the break comes anyway.
 */
export function eduBreakShouldStart(world: World, busy: boolean): boolean {
  const e = world.edu;
  if (!e || !eduBreakDue(world)) return false;
  if (!busy) return true;
  return e.playedMs >= (e.sessionMinutes + EDU.breakGraceMinutes) * 60_000;
}

/** R0746: a rounds count kept within what the grown-up area offers. */
export function clampRounds(n: number): number {
  return Math.max(EDU.minRounds, Math.min(EDU.maxRounds, Math.round(n) || EDU.roundsPerGame));
}

/**
 * R0746 (KIDS-78): rounds per game. A grown-up's pick, or by age: 3 at age 3, 5 at 4–5,
 * 6 at 6, and 8 for a reader.
 */
export function eduRounds(e: EduState): number {
  if (e.roundsPerGame !== undefined) return clampRounds(e.roundsPerGame);
  if (e.band === 'reader') return EDU.roundsReader;
  return EDU.roundsByAge[e.age] ?? EDU.roundsPerGame;
}

/** R0682: the rung a game is on: the saved one, or where the child's age starts it. */
export function eduRung(world: World, game: EduGameId): number {
  const e = world.edu;
  if (!e) return 0;
  const top = EDU_LADDER[game].length - 1;
  const lvl = e.skills?.[game]?.level ?? ladderStart(game, e.age);
  return Math.max(0, Math.min(top, lvl));
}

/**
 * R0682 (KIDS-14): a round's stars move the ladder. Three first-try rights in a row go up a
 * rung; a second shown answer (one star) in one sitting goes down one. Never more than one
 * move a sitting; `first` starts a new sitting. Readers play their own rounds: no ladder.
 */
export function eduClimb(world: World, game: EduGameId, stars: number, first: boolean): void {
  const e = world.edu;
  if (!e || e.band === 'reader') return;
  e.skills ??= {};
  const sk = (e.skills[game] ??= {
    level: eduRung(world, game),
    streak: 0,
    misses: 0,
    moved: false,
  });
  if (first) {
    sk.misses = 0;
    sk.moved = false;
  }
  sk.streak = stars === 3 ? sk.streak + 1 : 0;
  if (stars <= 1) sk.misses += 1;
  if (sk.moved) return;
  const top = EDU_LADDER[game].length - 1;
  if (sk.streak >= EDU_CLIMB.upStreak && sk.level < top) {
    sk.level += 1;
    sk.streak = 0;
    sk.moved = true;
  } else if (sk.misses >= EDU_CLIMB.downShown && sk.level > 0) {
    sk.level -= 1;
    sk.misses = 0;
    sk.moved = true;
  }
}

/** R0683: count an asked item, and whether it was right first time. */
export function eduSeen(world: World, id: string, firstTry: boolean): void {
  const e = world.edu;
  if (!e) return;
  e.items ??= {};
  const it = (e.items[id] ??= { seen: 0, firstTry: 0, lastMs: 0 });
  it.seen += 1;
  if (firstTry) it.firstTry += 1;
  it.lastMs = world.lastWallMs;
}

/**
 * R0683 (KIDS-15): how strongly the round generators favour an item: weaker items more,
 * an item asked a moment ago less. Unseen items weigh 1.
 */
export function eduItemWeight(it: EduItem | undefined, nowMs: number): number {
  if (!it || it.seen === 0) return 1;
  let w = 1 + EDU_MASTERY.miss * (1 - it.firstTry / it.seen);
  if (nowMs - it.lastMs < EDU_MASTERY.recentMs) w *= EDU_MASTERY.recentFactor;
  return w;
}

/** R0683: a grown-up's view of an item: known, learning, or not met yet. */
export function eduMastery(it: EduItem | undefined): 'known' | 'learning' | 'new' {
  if (!it || it.seen === 0) return 'new';
  return it.seen >= EDU_MASTERY.knownSeen && it.firstTry / it.seen >= EDU_MASTERY.knownShare
    ? 'known'
    : 'learning';
}

/** R0683: the weight function the round generators take for this save. */
export function eduWeigher(world: World): (id: string) => number {
  const items = world.edu?.items ?? {};
  const now = world.lastWallMs;
  return (id) => eduItemWeight(items[id], now);
}
