import { describe, expect, it } from 'vitest';
import { slotsFor } from '../../src/platform/storage';
import { copySettingsJson, renameChildJson } from '../../src/sim/edu-children';
import { deserialize, serialize } from '../../src/sim/save';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld } from './campaign-driver';

function eduSave(): string {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'eduStart', age: 5, band: 'sprout' }, events);
  return serialize(world, 1);
}

describe('R0728 children on a device', () => {
  it('allows six child profiles, at least the four the brief needs', () => {
    expect(slotsFor('edu')).toBeGreaterThanOrEqual(4);
    expect(slotsFor('edu')).toBe(6);
  });
  it('renames a sibling without touching its progress', () => {
    const json = eduSave();
    const out = renameChildJson(json, '  Nono  ', 2)!;
    const was = deserialize(json).world.edu!;
    const edu = deserialize(out).world.edu!;
    expect(edu.childName).toBe('Nono');
    expect(edu.progress).toEqual(was.progress);
  });
  it('copies limits and session length only', () => {
    const json = eduSave();
    const out = copySettingsJson(
      json,
      {
        sessionMinutes: 12,
        limits: { dailyMinutes: 30, quietFrom: 19, quietTo: 7, lockToSlot: true },
      },
      3,
    )!;
    const edu = deserialize(out).world.edu!;
    expect(edu.sessionMinutes).toBe(12);
    expect(edu.limits?.dailyMinutes).toBe(30);
    expect(edu.age).toBe(5);
  });
});
