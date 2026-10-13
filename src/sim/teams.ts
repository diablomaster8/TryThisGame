import { TEAMS } from '../config/tuning';
import { Rng } from './rng';
import type { SimEvent, TeamId, World } from './types';

/**
 * Guard teams: join Dawn, Dusk or Dew; each real week the team sets a mission for the
 * Expedition and the races; finishing it earns team points and, every so often, a
 * rank. A seeded local board shows how the week's rivals are doing.
 */
export const TEAM_LIST: ReadonlyArray<{ id: TeamId; leader: string }> = [
  { id: 'dawn', leader: 'Marina' },
  { id: 'dusk', leader: 'Luna' },
  { id: 'dew', leader: 'Fern' },
];

export type MissionKind = 'expeditions' | 'shells' | 'raceWin' | 'karateWin';

const MISSIONS: ReadonlyArray<{ kind: MissionKind; target: [number, number] }> = [
  { kind: 'expeditions', target: [2, 4] },
  { kind: 'shells', target: [150, 400] },
  { kind: 'raceWin', target: [1, 2] },
  { kind: 'karateWin', target: [1, 2] },
];

/** ISO-ish week key from wall time. */
export function weekKey(wallMs: number): string {
  const d = new Date(wallMs);
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.floor((d.getTime() - start.getTime()) / (7 * 86_400_000));
  return `${d.getFullYear()}-w${week}`;
}

export function joinTeam(world: World, team: TeamId, events: SimEvent[]): void {
  world.team = { id: team, rank: 0, points: 0, week: '', mission: null };
  events.push({ kind: 'teamJoined', team });
}

function newMission(world: World, week: string): void {
  if (!world.team) return;
  const rng = Rng.fromSeed(`${week}:${world.team.id}`);
  const m = rng.pick([...MISSIONS]);
  world.team.week = week;
  world.team.mission = {
    kind: m.kind,
    target: rng.int(m.target[0], m.target[1]),
    progress: 0,
    done: false,
  };
}

export function stepTeams(world: World, wallMs: number | undefined, events: SimEvent[]): void {
  const t = world.team;
  if (!t) return;
  if (wallMs !== undefined) {
    const week = weekKey(wallMs);
    if (t.week !== week) newMission(world, week);
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

/** The week's board: four seeded rivals and the Keeper, sorted by points. */
export function teamBoard(
  world: World,
  wallMs: number,
): Array<{ name: string; team: TeamId; points: number; you: boolean }> {
  const week = weekKey(wallMs);
  const rng = Rng.fromSeed(`board:${week}`);
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
