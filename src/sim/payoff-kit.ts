/**
 * The small kit every choice payoff is written with: words per Learning Grove band, the part of
 * the line swapper a payoff may use, and a lookup by flag value. Split out of choice-payoffs.ts
 * so the fun-quest packs can keep their payoffs in files of their own.
 */
import type { Line } from '../config/story';
import type { CampaignState } from './types';

/** One line's words in every band; a band without its own reads the main ones. */
export interface BandText {
  main: string;
  sprout?: string;
  reader?: string;
}

/** The part of the scene's line swapper a payoff uses. */
export interface PayoffSwaps {
  /** The band being built, for a line only one band has room for (S24's look at the cage). */
  readonly band: 'main' | 'sprout' | 'reader';
  insertAfter(anchor: string | BandText, text: BandText, who?: string, mood?: Line['mood']): void;
  insertBefore(anchor: string | BandText, text: BandText, who?: string, mood?: Line['mood']): void;
  /** Replace the text of the line starting with this band's anchor (speaker and mood stay). */
  swapText(anchor: BandText, text: BandText): void;
}

export type Payoff = (c: CampaignState, s: PayoffSwaps) => void;

/** The text for whichever value the flag holds, if any. */
export function by<T>(value: unknown, table: Record<string, T>): T | undefined {
  return typeof value === 'string' ? table[value] : undefined;
}
