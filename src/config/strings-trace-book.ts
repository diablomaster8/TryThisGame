/** R0707: the tracing book's words. Kept apart so the postcard strings stay small. */
export const TRACE_BOOK_TEXT = {
  open: '✍️ Tracing book',
  title: 'Tracing book',
  help: 'Tap a letter to trace it. No quest needed.',
  none: 'No letters yet. They appear here as you meet words.',
  back: 'Back',
  letterLabel: (g: string) => `Trace ${g}`,
} as const;
