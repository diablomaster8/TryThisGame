/** R0744 (KIDS-76): the optional "I heard you!" listener. Names live here, not in code. */
export const LISTEN_TEXT = {
  label: 'Listen for "say it" turns',
  help: 'Off by default. On browsers that can hear (Chrome, Edge), the microphone listens for 3 seconds after a "say it" turn and answers "I heard you!" for any voice. It never checks the words, never records or stores anything, and never blocks the game. Where the browser supports it, listening stays on this device.',
  heard: 'I heard you!',
  listening: 'Listening…',
  unsupported: 'This browser cannot listen, so the game keeps its pause instead.',
} as const;

export const LISTEN_TUNING = { listenMs: 3000, storeKey: 'grove.listenOptIn' } as const;
