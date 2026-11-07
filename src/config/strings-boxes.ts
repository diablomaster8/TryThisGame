import { fmt } from './icu';
import { MESSAGES_EN } from './messages-en';
/** R0718 (KIDS-33): the grown-up report's "words by box" view. */
export const BOXES_TEXT = {
  heading: 'Words by box',
  help: 'Each word moves up a box when the child picks it right in review, and back to box 1 when not. Higher boxes come up less often.',
  box: (n: number, count: number) => fmt(MESSAGES_EN.boxWords, { n, count }),
  unseen: (count: number) => `Not yet reviewed: ${count}`,
  none: 'No words met yet.',
} as const;
