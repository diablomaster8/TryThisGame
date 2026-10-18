import { describe, expect, it } from 'vitest';
import { SCENES } from '../../src/config/story';
import * as EDU from '../../src/content/edu';
import type { EduBand } from '../../src/content/types';
import { deserialize, serialize } from '../../src/sim/save';
import {
  choiceToSend,
  GROVE_SIDE_STORIES,
  registerEduContent,
  registerEduScenes,
  sceneById,
  sceneFor,
} from '../../src/sim/story-scenes';
import type { World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, runCampaign } from './campaign-driver';

/**
 * CV2, the Learning Grove's language switch: each band plays its own lines, choices and
 * lessons while the sim applies the original scene's flags; sprout never reaches the
 * Collector; quests without an edu version read their childLines; the band settings save.
 */
registerEduContent(EDU);

/** Every scene id the story can play that offers a choice in the main game. */
function choiceScenes(): string[] {
  const ids = new Set<string>();
  for (const s of SCENES) if (s.choices?.length) ids.add(s.id);
  for (const q of GROVE_SIDE_STORIES)
    for (const s of [...q.steps.flatMap((st) => [st.scene, st.done]), q.complete])
      if (s?.choices?.length) ids.add(s.id);
  return [...ids];
}

/** What a band lets the child end a scene with: its offered choices, or its default. */
function allowed(world: World, id: string, band: EduBand): string[] {
  const play = sceneFor(world, id, band)!;
  const offered = (play.choices ?? []).map((ch) => ch.id);
  return offered.length > 0 ? offered : [choiceToSend(play, null)!];
}

function eduWorld(band: EduBand): World {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'eduStart', age: band === 'reader' ? 6 : 4, band }, events);
  return world;
}

describe('Learning Grove story (CV2)', () => {
  it('every band ends each scene with a real choice and sets the same flags as main', () => {
    const base = campaignWorld().world;
    const ids = choiceScenes();
    expect(ids.length).toBeGreaterThan(20);
    for (const band of ['sprout', 'reader'] as const) {
      for (const id of ids) {
        const original = new Set(sceneById(id)!.choices!.map((ch) => ch.id));
        for (const pick of allowed(base, id, band)) {
          expect(original.has(pick), `${band} ${id} → ${pick}`).toBe(true);
          const main = structuredClone(base);
          const edu = structuredClone(base);
          applyCommand(main, { kind: 'sceneDone', scene: id, choice: pick }, []);
          applyCommand(edu, { kind: 'sceneDone', scene: id, choice: pick }, []);
          expect(c(edu).flags, `${band} ${id}`).toEqual(c(main).flags);
        }
      }
    }
  });

  it('plays the band’s lines, choices and lessons in place of the original', () => {
    const world = eduWorld('sprout');
    const play = sceneFor(world, 'c1-letter')!;
    expect(play.lines).toEqual(EDU.eduSceneFor('sprout', 'c1-letter')!.lines);
    expect(play.lessons.length).toBeGreaterThan(0);
    // Standard story language: the main lines, no lessons.
    applyCommand(world, { kind: 'eduSetLanguage', language: 'standard' }, []);
    const std = sceneFor(world, 'c1-letter')!;
    expect(std.lines).toEqual(sceneById('c1-letter')!.lines);
    expect(std.lessons).toEqual([]);
  });

  it('sprout never offers a choice that leads to the Collector', () => {
    const base = campaignWorld().world;
    for (const id of choiceScenes()) {
      const choices = sceneById(id)!.choices!;
      for (const pick of allowed(base, id, 'sprout')) {
        const set = choices.find((ch) => ch.id === pick)?.set ?? {};
        expect(set.soldNubbin, `sprout ${id} → ${pick}`).not.toBe(true);
        expect(set.keptStone, `sprout ${id} → ${pick}`).not.toBe(true);
      }
    }
    // The Collector run's own picks, as far as sprout allows them, still miss it.
    const want: Record<string, string> = {
      'c2-corvin': 'sell',
      'c3-open': 'grab',
      'c10-edge': 'keep',
      'c12-open': 'keep',
    };
    const picks: Record<string, string> = {};
    for (const id of choiceScenes()) {
      const ok = allowed(base, id, 'sprout');
      picks[id] = want[id] && ok.includes(want[id]) ? want[id] : ok[ok.length - 1]!;
    }
    const { ending, world } = runCampaign(picks);
    expect(ending).not.toBe('');
    expect(ending).not.toBe('collector');
    expect(c(world).flags.soldNubbin).not.toBe(true);
    expect(c(world).flags.keptStone).not.toBe(true);
  });

  it('applies childLines to an all-audience quest scene without an edu version', () => {
    // Every all-audience side story now has its own edu version, so hide each scene's
    // edu copy in turn to exercise the childLines fallback the engine still provides.
    const world = eduWorld('sprout');
    let checked = 0;
    try {
      for (const q of GROVE_SIDE_STORIES) {
        if (q.audience !== 'all') continue;
        for (const [key, text] of Object.entries(q.childLines ?? {})) {
          const [id, at] = key.split('#') as [string, string];
          if (!sceneById(id)) continue;
          registerEduScenes((band, sid) => (sid === id ? undefined : EDU.eduSceneFor(band, sid)));
          expect(sceneFor(world, id)!.lines[Number(at)]?.text).toBe(text);
          // The main game never sees them.
          expect(sceneFor(campaignWorld().world, id)!.lines[Number(at)]?.text).not.toBe(text);
          checked++;
        }
      }
    } finally {
      registerEduScenes(EDU.eduSceneFor);
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('keeps each lesson on its line when a swap adds a line before it', () => {
    const world = eduWorld('sprout');
    const plain = sceneFor(world, 'c11-close')!;
    c(world).seen.push('s9-ask');
    const swapped = sceneFor(world, 'c11-close')!;
    expect(swapped.lines.length).toBe(plain.lines.length + 1);
    expect(plain.lessons.length).toBeGreaterThan(0);
    for (const [i, l] of plain.lessons.entries())
      expect(swapped.lines[swapped.lessons[i]!.after]).toBe(plain.lines[l.after]);
  });

  it('saves the band, the story language, read-aloud and the lessons played', () => {
    const world = eduWorld('reader');
    applyCommand(world, { kind: 'eduSetLanguage', language: 'standard' }, []);
    applyCommand(world, { kind: 'eduSetReadAloud', on: false }, []);
    applyCommand(world, { kind: 'eduLesson', id: 'reader:c1-letter-l1', best: true }, []);
    applyCommand(world, { kind: 'eduLesson', id: 'reader:c1-letter-l1', best: false }, []);
    const back = deserialize(serialize(world, 0)).world.edu!;
    expect(back.band).toBe('reader');
    expect(back.storyLanguage).toBe('standard');
    expect(back.readAloud).toBe(false);
    expect(back.lessons).toEqual({ 'reader:c1-letter-l1': { best: true } });
  });

  it('fills the CV2 fields into an older Learning Grove save', () => {
    const world = eduWorld('sprout');
    const old = JSON.parse(serialize(world, 0)) as { world: { edu: Record<string, unknown> } };
    delete old.world.edu.band;
    delete old.world.edu.storyLanguage;
    delete old.world.edu.lessons;
    delete old.world.edu.readAloud;
    const e = deserialize(JSON.stringify(old)).world.edu!;
    expect([e.band, e.storyLanguage, e.readAloud, e.lessons]).toEqual([
      'sprout',
      'learning',
      true,
      {},
    ]);
  });
});
