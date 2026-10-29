/**
 * Player-facing text for the ATB "Command" bout (recs FIGHT-40, FIGHT-41): the four order
 * buttons in `ATB_COMMANDS` order, the lines for an order called out and for the personality
 * gag when a Nubbin ignores one, and the "Paused" veil shown while the tab was hidden.
 */
import type { AtbCommand, AtbGag } from '../sim/battle/types';

export const ATB_TEXT = {
  orders: {
    go: { icon: '💥', name: 'Go for it!' },
    careful: { icon: '🛡', name: 'Careful!' },
    switch: { icon: '🔀', name: 'Switch it up!' },
    back: { icon: '↩', name: 'Come back!' },
  } as Record<AtbCommand, { icon: string; name: string }>,
  ordersLabel: 'Call out an order',
  ready: 'ready',
  wait: (s: number) => `${s.toFixed(1)} s`,
  gauge: (name: string, n: number) => `${name}: ${Math.round(n)}%`,
  /** An order called out; `obeyed` says whether the Nubbin listened. */
  order: (name: string, cmd: AtbCommand, obeyed: boolean) =>
    obeyed ? `${name} heard "${ATB_TEXT.orders[cmd].name}" and nods.` : `${name} has other ideas.`,
  gags: {
    sit: '{a} sits down for a little think.',
    raspberry: '{a} blows a raspberry at you.',
    hide: '{a} hides behind your legs.',
    wave: '{a} waves at the crowd instead.',
  } as Record<AtbGag, string>,
  gag: (name: string, gag: AtbGag) => ATB_TEXT.gags[gag].replace('{a}', name),
  paused: 'Paused',
  pausedHelp: 'The bout waits while the game is in the background.',
  resume: 'Carry on',
} as const;
