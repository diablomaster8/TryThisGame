/**
 * R0728 (KIDS-60): edits to a sibling's Learning Grove save from the grown-up area. Pure:
 * JSON in, JSON out; the UI writes the result to that child's slot. The child in play is
 * changed through the live world instead, since its autosave would overwrite a slot edit.
 */
import type { EduLimits } from './types';
import { deserialize, serialize } from './save';

/** The settings "copy to all children" carries: limits and session length, never progress. */
export interface CopiedSettings {
  limits: EduLimits | undefined;
  sessionMinutes: number;
}

export function renameChildJson(json: string, name: string, nowWallMs: number): string | null {
  const file = deserialize(json);
  const edu = file.world.edu;
  if (!edu) return null;
  edu.childName = name.trim().slice(0, 20);
  return serialize(file.world, nowWallMs);
}

export function copySettingsJson(
  json: string,
  from: CopiedSettings,
  nowWallMs: number,
): string | null {
  const file = deserialize(json);
  const edu = file.world.edu;
  if (!edu) return null;
  edu.sessionMinutes = from.sessionMinutes;
  if (from.limits) edu.limits = { ...from.limits, unlockUntilMs: undefined };
  else delete edu.limits;
  return serialize(file.world, nowWallMs);
}
