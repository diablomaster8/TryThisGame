import { TEAMS } from '../config/tuning';
import { Rng } from './rng';
import type { SimEvent, TeamId, World } from './types';

/**
 * Guard teams: join Dawn, Dusk or Dew; the team sets a short run of missions for the
 * Expedition, the races and karate, one after another and each once; finishing one earns
 * team points and, every so often, a rank. Nothing renews by date (no weekly chores,
 * canon 22). A seeded local board shows how the team's rivals are doing.
 */
export const TEAM_LIST: ReadonlyArray<{ id: TeamId; leader: string }> = [
  { id: 'dawn', leader: 'Marina' },
  { id: 'dusk', leader: 'Luna' },
  { id: 'dew', leader: 'Fern' },
];

export type MissionKind = 'expeditions' | 'shells' | 'raceWin' | 'karateWin';

/** The missions, in the order the team sets them. */
const MISSIONS: ReadonlyArray<{ kind: MissionKind; target: number }> = TEAMS.missions;

export const MISSION_COUNT = MISSIONS.length;

export function joinTeam(world: World, team: TeamId, events: SimEvent[]): void {
  // Joining again would wipe the points and rank already earned; the UI hides the choice,
  // and the sim refuses it too, so a stale or replayed command cannot reset a team.
  if (world.team) return;
  world.team = { id: team, rank: 0, points: 0, week: '', mission: null };
  events.push({ kind: 'teamJoined', team });
}

/** How many missions this Keeper has finished, read from the points they earned. */
function missionsDone(world: World): number {
  return Math.floor((world.team?.points ?? 0) / TEAMS.pointsPerMission);
}

export function stepTeams(world: World, events: SimEvent[]): void {
  const t = world.team;
  if (!t) return;
  // The next mission follows a finished one; after the last there are no more.
  if ((!t.mission || t.mission.done) && missionsDone(world) < MISSION_COUNT) {
    const m = MISSIONS[missionsDone(world)]!;
    t.mission = { kind: m.kind, target: m.target, progress: 0, done: false };
  }
  const m = t.mission;
  if (!m || m.done) return;
  for (const e of events) {
    if (m.kind === 'expeditions' && e.kind === 'rewards') m.progress += 1;
    else if (m.kind === 'shells' && e.kind === 'rewards') m.progress += e.rewards.shells;
    else if (m.kind === 'raceWin' && e.kind === 'raceWon') m.progress += 1;
    else if (m.kind === 'karateWin' && e.kind === 'karate' && e.won) m.progress += 1;
  }
  if (m.progress >= m.target) {
    m.done = true;
    t.points += TEAMS.pointsPerMission;
    const rank = Math.floor(t.points / TEAMS.rankEvery);
    if (rank > t.rank) t.rank = rank;
    events.push({ kind: 'missionDone', team: t.id, points: t.points });
  }
}

/** The team's board: four seeded rivals and the Keeper, sorted by points. */
export function teamBoard(
  world: World,
): Array<{ name: string; team: TeamId; points: number; you: boolean }> {
  const rng = Rng.fromSeed(`board:${world.team?.id ?? 'none'}`);
  const names = ['Wren', 'Tam', 'Juno', 'Sorrel'];
  const rows = names.map((name) => ({
    name,
    team: rng.pick(['dawn', 'dusk', 'dew'] as const) as TeamId,
    points: rng.int(0, 60),
    you: false,
  }));
  if (world.team)
    rows.push({ name: 'You', team: world.team.id, points: world.team.points, you: true });
  return rows.sort((a, b) => b.points - a.points);
}
