/**
 * Lane C r10 agent B (R0649, CAMP-57): a save slot's name and colour tag. The label lives in
 * the world (`world.slotLabel`) so it travels with an export, a backup and a restore, and the
 * slot index carries a copy so the title never parses the save to show it. Pure.
 */
import { SLOT_LABEL } from '../config/tuning';
import { SLOT_TAGS, type SlotLabel, type SlotTag } from './types';

// eslint-disable-next-line no-control-regex
const UNSAFE = /[\u0000-\u001f\u007f<>]/g;

/** Trim, fold whitespace, drop control and markup characters, and cap at SLOT_LABEL.nameMax. */
export function cleanSlotName(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const plain = raw.replace(UNSAFE, '').replace(/\s+/g, ' ').trim();
  return [...plain].slice(0, SLOT_LABEL.nameMax).join('').trim();
}

export function isSlotTag(t: unknown): t is SlotTag {
  return typeof t === 'string' && (SLOT_TAGS as readonly string[]).includes(t);
}

/** A sound label from anything (a save, the index, the dialog), or null when it says nothing. */
export function cleanSlotLabel(raw: unknown): SlotLabel | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as { name?: unknown; tag?: unknown };
  const name = cleanSlotName(r.name);
  const tag = isSlotTag(r.tag) ? r.tag : null;
  if (!name && !tag) return null;
  return tag ? { name, tag } : { name };
}
