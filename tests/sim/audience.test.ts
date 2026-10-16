import { describe, expect, it } from 'vitest';
import {
  audienceAllowed,
  funQuestBlocked,
  isFunQuestCode,
  matureControlVisible,
  questAvailable,
  riftNeedsConfirmation,
  type Audience,
} from '../../src/sim/audience';
import { deserialize, serialize } from '../../src/sim/save';
import type { MatureContent } from '../../src/sim/types';
import { applyCommand, createWorld, defaultSettings } from '../../src/sim/world';

const AUDIENCES: Audience[] = ['all', 'main', 'teen', 'adult'];
const SETTINGS: MatureContent[] = ['off', 'teen', 'adult'];

describe('audience filter', () => {
  it('defaults the setting to Off', () => {
    expect(defaultSettings().matureContent).toBe('off');
    expect(createWorld(1, 0).settings.matureContent).toBe('off');
  });

  it('offers each audience at the right setting in the main game', () => {
    const expected: Record<MatureContent, Audience[]> = {
      off: ['all', 'main'],
      teen: ['all', 'main', 'teen'],
      adult: ['all', 'main', 'teen', 'adult'],
    };
    for (const matureContent of SETTINGS) {
      const offered = AUDIENCES.filter((a) =>
        audienceAllowed(a, { matureContent, learningGrove: false }),
      );
      expect(offered).toEqual(expected[matureContent]);
    }
  });

  it('offers only `all` in the Learning Grove, whatever the setting', () => {
    for (const matureContent of SETTINGS) {
      const offered = AUDIENCES.filter((a) =>
        audienceAllowed(a, { matureContent, learningGrove: true }),
      );
      expect(offered).toEqual(['all']);
    }
  });

  it('hides the control in the Learning Grove only', () => {
    expect(matureControlVisible({ learningGrove: true })).toBe(false);
    expect(matureControlVisible({ learningGrove: false })).toBe(true);
  });

  it('never offers fun quests in chapters 9 to 11', () => {
    const ctx = { matureContent: 'adult' as const, learningGrove: false };
    for (let chapter = 1; chapter <= 12; chapter++) {
      const blocked = chapter >= 9 && chapter <= 11;
      expect(funQuestBlocked(chapter)).toBe(blocked);
      expect(questAvailable({ code: 'Q10', audience: 'all' }, ctx, chapter)).toBe(!blocked);
      expect(questAvailable({ code: 'Q31', audience: 'adult' }, ctx, chapter)).toBe(!blocked);
    }
  });

  it('does not block non-fun quests in chapters 9 to 11', () => {
    const ctx = { matureContent: 'off' as const, learningGrove: false };
    expect(isFunQuestCode('Q65')).toBe(true);
    expect(isFunQuestCode('Q66')).toBe(false);
    expect(isFunQuestCode('S9')).toBe(false);
    expect(questAvailable({ code: 'S9', audience: 'main' }, ctx, 10)).toBe(true);
  });

  it('hides a quest when the setting is lowered and shows it again when raised', () => {
    const quest = { code: 'Q31', audience: 'adult' as const };
    const at = (matureContent: MatureContent) =>
      questAvailable(quest, { matureContent, learningGrove: false }, 4);
    expect(at('adult')).toBe(true);
    expect(at('teen')).toBe(false);
    expect(at('adult')).toBe(true);
  });
});

describe('setting persistence', () => {
  it('migrates a version 2 save to Off with no rift confirmation', () => {
    const v2 = JSON.parse(serialize(createWorld(3, 0), 0)) as Record<string, unknown>;
    v2.version = 2;
    const settings = (v2.world as { settings: Record<string, unknown> }).settings;
    delete settings.matureContent;
    delete settings.riftConfirmed;
    const file = deserialize(JSON.stringify(v2));
    expect(file.world.settings.matureContent).toBe('off');
    expect(file.world.settings.riftConfirmed).toBe(false);
  });

  it('replaces an invalid stored value with Off', () => {
    const save = JSON.parse(serialize(createWorld(3, 0), 0)) as Record<string, unknown>;
    (save.world as { settings: Record<string, unknown> }).settings.matureContent = 'everything';
    expect(deserialize(JSON.stringify(save)).world.settings.matureContent).toBe('off');
  });

  it('round-trips the setting through export and import', () => {
    const world = createWorld(5, 0);
    world.settings.matureContent = 'teen';
    const loaded = deserialize(serialize(world, 0)).world;
    expect(loaded.settings.matureContent).toBe('teen');
    expect(JSON.stringify(deserialize(serialize(loaded, 0)).world)).toBe(JSON.stringify(loaded));
  });
});

describe('rift confirmation', () => {
  it('asks once, then turns on 18+ and never asks again', () => {
    const world = createWorld(2, 0);
    expect(riftNeedsConfirmation(world.settings)).toBe(true);
    applyCommand(world, { kind: 'confirmRift' }, []);
    expect(world.settings.riftConfirmed).toBe(true);
    expect(world.settings.matureContent).toBe('adult');
    expect(riftNeedsConfirmation(world.settings)).toBe(false);
    const loaded = deserialize(serialize(world, 0)).world;
    expect(riftNeedsConfirmation(loaded.settings)).toBe(false);
  });

  it('changes nothing until the player confirms', () => {
    const world = createWorld(2, 0);
    expect(world.settings.riftConfirmed).toBe(false);
    expect(world.settings.matureContent).toBe('off');
  });
});
