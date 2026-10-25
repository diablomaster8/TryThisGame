import { describe, expect, it } from 'vitest';
import * as C from '../../src/content/index';
import { SPEAKERS } from '../../src/config/story';
import { STORY_ONLY_LOOKS, storyId } from '../../src/config/npc-looks';
import { trainerLook } from '../../src/render/keeper-look';
import { CREATURE_SPEAKERS, creatureLook, generatedLook } from '../../src/render/portraits';
import { TRAINERS, type TrainerLook } from '../../src/sim/trainers';

/** Every speaker the content declares, with its kind. */
function allSpeakers(): Map<string, string> {
  const ids = new Map<string, string>();
  for (const v of Object.values(C)) {
    if (!Array.isArray(v)) continue;
    for (const q of v as unknown[]) {
      const sp = (q as { speakers?: { id: string; kind: string }[] } | null)?.speakers;
      if (Array.isArray(sp)) for (const s of sp) ids.set(s.id, s.kind);
    }
  }
  for (const [id, s] of Object.entries(C.CAMPAIGN_SPEAKERS)) ids.set(id, s.kind);
  for (const [id, s] of Object.entries(SPEAKERS)) ids.set(id, s.kind);
  return ids;
}

const same = (a: TrainerLook, b: TrainerLook): boolean =>
  (Object.keys(a) as (keyof TrainerLook)[]).every((k) => a[k] === b[k]);

/** The ids the dialogue draws from a Nubbin, not a person (see `portraitFrame`). */
const NUBBIN_DRAWN = new Set(['moss', 'sable', 'wisp']);

describe('speaker portraits (r1025 item 5)', () => {
  const speakers = allSpeakers();
  const fern = TRAINERS.find((t) => t.id === 'fern')!.look;
  const fernStory = STORY_ONLY_LOOKS['fern-story']!.trainer;

  it('reads hundreds of speakers from the content', () => {
    expect(speakers.size).toBeGreaterThan(500);
  });

  it("gives no speaker but Fern Fern's look", () => {
    const wearingFern: string[] = [];
    for (const id of speakers.keys()) {
      if (id === 'fern' || id === 'you' || id === 'narrator' || id === 'chorus') continue;
      if (NUBBIN_DRAWN.has(id) || CREATURE_SPEAKERS.has(id)) continue;
      const look = trainerLook(storyId(id));
      if (same(look, fern) || same(look, fernStory)) wearingFern.push(id);
    }
    expect(wearingFern).toEqual([]);
  });

  it('draws every creature speaker as a Nubbin, and only those', () => {
    const creatures = [...speakers].filter(([, k]) => k === 'nubbin').map(([id]) => id);
    for (const id of creatures)
      expect(NUBBIN_DRAWN.has(id) || CREATURE_SPEAKERS.has(id)).toBe(true);
    for (const id of CREATURE_SPEAKERS) expect(speakers.get(id)).toBe('nubbin');
  });

  it('is deterministic, varied and never a selectable trainer', () => {
    const ids = [...speakers.keys()];
    expect(generatedLook('pa2-misty')).toEqual(generatedLook('pa2-misty'));
    expect(creatureLook('briar')).toEqual(creatureLook('briar'));
    const keys = new Set(ids.map((id) => JSON.stringify(generatedLook(id))));
    expect(keys.size / ids.length).toBeGreaterThan(0.95);
    for (const id of ids)
      for (const t of TRAINERS) expect(same(generatedLook(id), t.look)).toBe(false);
  });
});
