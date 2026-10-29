import type { SectionKind } from '../sim/race';
import { SECTION_LABELS } from './strings';

/** Text for the race's hurdles section (R0047). */
export const HURDLE_TEXT = {
  /** The sign over the section, as the track shows it. */
  label: 'HOP',
  /** The emote drawn over a racer that clipped a fence. */
  dizzyEmote: '@',
} as const;

/** The sign for any section kind, hurdles included. */
export function sectionLabel(kind: SectionKind): string {
  return kind === 'hurdles' ? HURDLE_TEXT.label : SECTION_LABELS[kind];
}
