/**
 * Lane C round 13 (R0630): the journal's Areas page lists Pixel's cabinet and the rift, with
 * progress read from the side saves.
 */
export const CAMP13C_TEXT = {
  fromCabinet: 'From Pixel’s cabinet',
  fromRift: 'From the rift',
  worldHelp: 'Read from that world’s own save. Nothing here is copied into the Grove.',
  lineState: (done: boolean, finished: number, begun: number) =>
    done ? '✓ Finished' : begun === 0 ? 'Not started' : `${finished}/${begun} quests`,
} as const;
