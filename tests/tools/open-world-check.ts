/**
 * Lane C r11 (R0645 CAMP-53, R0613 CAMP-21, R0600 CAMP-07, R0634 CAMP-42): the content checker's
 * rules for the open world, kept in one place and called from content-check.ts. Pure: it returns
 * problems (which fail the run), warnings and the printed gate graph.
 */
import { GATES } from '../../src/config/gates';
import { QUEST_OFFERS } from '../../src/config/tuning';
import { QUESTS_CHILD } from '../../src/config/tuning-camp11c';
import { EPILOGUE_CALLBACKS } from '../../src/content/epilogue';
import type { Scene } from '../../src/config/story';
import type { Quest, Storyline } from '../../src/content/types';
import { checkGates } from '../../src/sim/gates';

const SEASON_WORDS = /\b(spring|summer|autumn|winter)\b/i;

function sentences(text: string): number {
  return text.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 0).length;
}

export interface OpenWorldInput {
  quests: readonly Quest[];
  storylines: readonly Storyline[];
  campaignEndings: readonly string[];
  /** Ids of every campaign scene, for collisions with the lines'. */
  campaignSceneIds: ReadonlySet<string>;
}

export function openWorldChecks(input: OpenWorldInput): {
  problems: string[];
  warnings: string[];
  graph: string[];
} {
  const problems: string[] = [];
  const warnings: string[] = [];
  const { quests, storylines } = input;

  // Summaries: at most 160 characters and two sentences (the skip card's text).
  for (const q of quests)
    for (const st of q.steps) {
      if (st.summary && st.summary.length > 160)
        problems.push(`${q.id}#${st.id}: summary over 160 characters`);
      if (st.summary && sentences(st.summary) > 2)
        problems.push(`${q.id}#${st.id}: summary over two sentences`);
    }

  // R0629: a sprout pitch is short enough to read aloud.
  for (const q of quests)
    if (q.pitchChild && q.pitchChild.trim().split(/\s+/).length > QUESTS_CHILD.sproutPitchWords)
      problems.push(`${q.id}: pitchChild over ${QUESTS_CHILD.sproutPitchWords} words`);

  // Declines: a campaign-changing story is listed, and the list names real quests.
  const ids = new Set(quests.map((q) => q.id));
  for (const id of Object.keys(QUEST_OFFERS.decline))
    if (!ids.has(id)) problems.push(`decline rule for unknown quest ${id}`);

  // Scene ids: unique across every line, and clear of the campaign and quest scenes.
  const owner = new Map<string, string>();
  const questScenes = new Set(
    quests.flatMap((q) => [
      q.complete.id,
      ...q.steps.flatMap((s) => [s.scene.id, ...(s.done ? [s.done.id] : [])]),
    ]),
  );
  const linesScenes: Array<[string, Scene]> = [];
  for (const s of storylines) {
    const all: Scene[] = [
      ...s.chapters.flatMap((c) => [c.opening, c.closing, ...(c.beats ?? []).map((b) => b.scene)]),
      ...s.extra,
    ];
    for (const sc of all) {
      linesScenes.push([s.id, sc]);
      const prev = owner.get(sc.id);
      if (prev !== undefined && prev !== s.id)
        problems.push(`scene id ${sc.id} appears in lines ${prev} and ${s.id}`);
      owner.set(sc.id, s.id);
      if (input.campaignSceneIds.has(sc.id) || questScenes.has(sc.id))
        problems.push(`line ${s.id}: scene id ${sc.id} collides with a campaign or quest scene`);
    }
  }

  // R0634: a line scene that names a season should carry a `season` gate (warning).
  let seasonLines = 0;
  for (const [line, sc] of linesScenes) {
    if (sc.season) continue;
    sc.lines.forEach((l, i) => {
      if (!SEASON_WORDS.test(l.text)) return;
      seasonLines++;
      warnings.push(`season word without a gate ${line}/${sc.id}#${i}: ${l.text.slice(0, 80)}`);
    });
  }
  if (seasonLines > 0) warnings.push(`season-named line lines without a gate: ${seasonLines}`);

  // R0613: the gate graph, checked for cycles and unreachable terms.
  const universe = {
    lines: new Set(storylines.map((s) => s.id)),
    endings: Object.fromEntries(storylines.map((s) => [s.id, Object.keys(s.endings)])),
    quests: new Set(quests.map((q) => q.id)),
    unlocks: new Set(['sunGrove', 'moonGrove']),
  };
  const gates = checkGates(GATES, universe);
  problems.push(...gates.problems);

  // R0600: every ending has one callback of at most 160 characters, and none is spare.
  const expected: Record<string, string[]> = {
    hazel: [...input.campaignEndings],
    ...universe.endings,
  };
  for (const [line, endings] of Object.entries(expected))
    for (const e of endings) {
      const t = EPILOGUE_CALLBACKS[line]?.[e];
      if (!t) problems.push(`epilogue: no callback for ${line}/${e}`);
      else if (t.length > 160) problems.push(`epilogue: ${line}/${e} over 160 characters`);
    }
  for (const [line, map] of Object.entries(EPILOGUE_CALLBACKS))
    for (const e of Object.keys(map))
      if (!expected[line]?.includes(e))
        problems.push(`epilogue: callback for unknown ${line}/${e}`);

  return { problems, warnings, graph: gates.graph };
}
