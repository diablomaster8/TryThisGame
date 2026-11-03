import { GATES } from '../config/gates';
import { VALLEY_FAIR } from '../config/tuning-camp11c';
import { evalGateId } from './gates';
import type { Line } from '../config/story';
import { queueScene } from './story-state';
import type { World } from './types';

/**
 * R0600 (CAMP-07): the Valley Fair, a grand epilogue that changes no ending. It is open once
 * Hazel's Grove has ended and at least `VALLEY_FAIR.minLines` of the lines beside it have. The
 * callback text is data (`content/epilogue.ts`, loaded with the other scripts and registered
 * here); the scene `epilogue-fair` is built from the endings this save reached.
 */
export const FAIR_SCENE = 'epilogue-fair';

export interface EpilogueData {
  callbacks: Record<string, Record<string, string>>;
  frame: { open: readonly string[]; close: readonly string[] };
}

let DATA: EpilogueData | null = null;

export function registerEpilogue(data: EpilogueData): void {
  DATA = data;
}

/** The lines (storyline ids) that have ended in this world, with their ending ids. */
export function endedLines(world: World): Array<[string, string]> {
  return Object.entries(world.lines ?? {}).flatMap(([id, l]) => (l.ending ? [[id, l.ending]] : []));
}

/** Has the spine (Hazel's Grove) ended in this world. */
export function spineEnded(world: World): boolean {
  const c = world.campaign;
  return !!c && c.storyline === null && c.ending !== null;
}

/** The fair opens: the spine has ended and enough lines have too. */
export function epilogueReady(world: World): boolean {
  return spineEnded(world) && endedLines(world).length >= VALLEY_FAIR.minLines;
}

/** Whether the keeper has been to the fair. */
export function fairSeen(world: World): boolean {
  return world.campaign?.seen.includes(FAIR_SCENE) ?? false;
}

/** The scene's lines: the opening, one callback per finished ending (spine first), the close. */
export function epilogueLines(world: World): Line[] {
  const n = (text: string): Line => ({ who: 'narrator', text });
  if (!DATA) return [n('The valley fair.')];
  const out: Line[] = DATA.frame.open.map(n);
  const spine = world.campaign?.ending;
  const hazel = spine ? DATA.callbacks.hazel?.[spine] : undefined;
  if (hazel) out.push(n(hazel));
  for (const [line, ending] of endedLines(world)) {
    const text = DATA.callbacks[line]?.[ending];
    if (text) out.push(n(text));
  }
  out.push(...DATA.frame.close.map(n));
  return out;
}

/** The `playFair` command: queue the fair (again, if it has been seen) when it is open. */
export function playFair(world: World): boolean {
  const c = world.campaign;
  if (!c || !epilogueReady(world)) return false;
  c.seen = c.seen.filter((s) => s !== FAIR_SCENE);
  return queueScene(c, FAIR_SCENE);
}

/**
 * R0657 (CAMP-65): once the spine has ended the Grove is "After the Long Night". What the objective
 * chip suggests there: the Valley Fair when it is open and unseen, else the first line not yet
 * begun whose gate is open (the table in `config/gates.ts`), else nothing. Never forced: it is a
 * suggestion, and E1 to E3 are offers (`decline: 'free'`), not scenes pushed on the player.
 */
export function afterStoryNext(
  world: World,
  lineIds: readonly string[],
): { kind: 'fair' } | { kind: 'line'; id: string } | null {
  if (!spineEnded(world)) return null;
  if (epilogueReady(world) && !fairSeen(world)) return { kind: 'fair' };
  for (const id of lineIds) {
    if (world.lines?.[id]) continue;
    if (evalGateId(world, id, GATES)) return { kind: 'line', id };
  }
  return null;
}
