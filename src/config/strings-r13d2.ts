/** Round 13, helper d2: words for the Learning Grove's signposts (R0099). */
export const EDU_SIGNPOST_TEXT = {
  label: (place: string): string => `Walk to ${place}`,
  home: 'Walk home',
  names: { lane: 'the lane', sunlands: 'the sunny hill' } as Readonly<Record<string, string>>,
} as const;
