/**
 * Lane C round 11 (R0598, CAMP-05), stage A: a save in the unified shape, pure. Hazel's
 * Grove is the spine (`world.campaign`, storyline null) and every other questline lives in
 * `world.lines`. A Hazel's Grove save, a Free Grove save and a Learning Grove save are in that
 * shape already (v13 gave them `lines`), so they come through untouched. A separate-campaign
 * save (`campaign.storyline` set) becomes a not-yet-begun spine (chapter 0) with its whole
 * campaign state kept, unchanged, as `lines[storyline]`.
 *
 * This is not a save-version migration: the game still plays a separate campaign from its
 * own slot, so the conversion runs only when stage B copies saves into unified slots
 * (platform/migrate-unified.ts, behind `SAVE_LAYOUT.unifiedSlots`). Nothing is dropped: the
 * line keeps every field, and `lineOfUnified` gives back exactly what went in.
 */
import { freshCampaignState } from './campaign';
import type { CampaignState, World } from './types';

/** Which kind of save a world is, for the unified slots. */
export type SaveShape = 'hazel' | 'line' | 'free' | 'edu';

export function shapeOf(world: World): SaveShape {
  if (world.edu) return 'edu';
  if (!world.campaign) return 'free';
  return world.campaign.storyline === null ? 'hazel' : 'line';
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/**
 * Pure: the world in unified shape (a deep copy; the input is not touched). A separate
 * campaign's line keeps its storyline id and ending, so the journal shows it as walked.
 */
export function unifyWorld(world: World): World {
  const w = clone(world);
  w.lines ??= {};
  if (shapeOf(w) !== 'line') return w;
  const line = w.campaign as CampaignState;
  const id = line.storyline as string;
  // Dawn and Dusk are one save but two lines: the save's own side is the key.
  w.lines[id] = line;
  // The spine starts at chapter 0: Hazel's Grove has not begun in this Grove.
  w.campaign = freshCampaignState(line.chapterStartMs);
  return w;
}

/** Pure: the separate campaign a unified world was built from, or null. */
export function lineOfUnified(world: World): { id: string; line: CampaignState } | null {
  if (!world.campaign || world.campaign.storyline !== null || world.campaign.chapter !== 0)
    return null;
  const entries = Object.entries(world.lines ?? {});
  if (entries.length !== 1) return null;
  const [id, line] = entries[0]!;
  return line.storyline === id ? { id, line } : null;
}

/**
 * Pure: "Combine endings" (stage B step 7, CAMP-07). A separate campaign's ending and
 * keepsakes are copied into a Hazel's Grove save: the line joins `lines` as ended (only if
 * that save has no such line yet) and its keepsakes join the inventory. The roster, the
 * Grove and everything else of the Hazel save stay as they are. Returns a new world.
 */
export function combineEndings(hazel: World, other: World): World {
  const out = clone(hazel);
  const from = shapeOf(other) === 'line' ? (other.campaign as CampaignState) : null;
  if (!from || from.ending === null || shapeOf(out) !== 'hazel') return out;
  const id = from.storyline as string;
  out.lines ??= {};
  if (!out.lines[id]) out.lines[id] = clone(from);
  const have = new Set(out.inventory.keepsakes);
  for (const k of other.inventory.keepsakes) if (!have.has(k)) out.inventory.keepsakes.push(k);
  return out;
}
