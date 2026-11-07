// was tuning-camp11ui; campaign engine, round 11 agent UI
/** Lane C round 11, helper ui (re-exported through tuning.ts): journal tabs, markers, ledger. */

export const C11_UI = {
  /** Rows shown collapsed on the Now tab before "Show more". */
  nowRows: 5,
  /** R0651: an arrival beat shows at most this many times an hour, and never within this gap. */
  beatsPerHour: 6,
  beatGapMs: 10_000,
  /** R0640: the first hour of play (sim ms) keeps the Full pace whatever the setting. */
  firstHourMs: 3_600_000,
};

/**
 * R0667: the signature choices a slot summary keeps (their flags are named in
 * `sim/choice-payoffs.ts`), so two slots can be compared without reading either save whole.
 */
export const C11_CHOICE_FLAGS: readonly string[] = [
  's1-pace',
  's1-sat',
  's2-early',
  's2-carried',
  's3-seat',
  's3-byte',
  's3-shown',
  's4-swim',
  's4-gate',
  's5-carry',
  's5-holder',
  'c4-lamps',
  'c5-race',
  'lj3-race',
  'lj4-bento',
  's7-lever',
  's7-watch-down',
  's12-solo',
  's10-racer',
  's13-rats',
  's16-tired',
  's17-approach',
  's18-entry',
  's19-with',
  's20-cry',
  's20-merge',
  's20-round2',
  's14-lair',
  's21-lesson',
  's21-byte',
  's24-cage',
  's22-chimney',
  's26-bulbs',
  's26-hello',
  's26-plot',
  'q46-cart',
  'q47-tuk-pemba',
  'q48-truth',
  'q55-reaction',
  's27-sold',
];
