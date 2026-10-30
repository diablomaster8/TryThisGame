/**
 * Player-facing text for lane C round 5's battle screens: the pre-bout sheet (recs FIGHT-86),
 * Settings → Bouts and "Steady hands" (FIGHT-71, FIGHT-79), the timing ring (FIGHT-87), the
 * doubles "Who?" pick (FIGHT-60), the results card's spoils (FIGHT-74), the "Inspect foe" card
 * (FIGHT-77) and the debug panel's battle tools (FIGHT-80, debug only, plain English).
 */
import type { AlignmentBand, StatKey } from '../sim/types';
import type { BoutDifficulty } from '../sim/battle/types';

export const PREBOUT_TEXT = {
  title: 'Ready for a bout?',
  objective: 'Objective',
  objDojo: (tier: number) => `🥋 Win to earn the Tier ${tier} belt.`,
  objStory: '💾 Get the party past Glitch, Proxy and Null.',
  objCircuit: (name: string) => `🎀 Win ${name}'s ribbon.`,
  objChampion: (name: string) => `🏆 Beat ${name} at their very best.`,
  objOther: '⭐ Win the bout.',
  recommended: (lv: number) => `Rivals are about Lv ${lv}.`,
  party: 'Party',
  changeParty: 'Change party',
  mode: 'Mode',
  modes: { turn: 'Turn', atb: 'Command' } as Record<'turn' | 'atb', string>,
  modeHelp: {
    turn: 'Take turns and pick every move.',
    atb: 'Your Nubbin fights by itself; you call out orders.',
  } as Record<'turn' | 'atb', string>,
  difficulty: 'Difficulty',
  levels: { gentle: 'Gentle', normal: 'Normal', spicy: 'Spicy' } as Record<BoutDifficulty, string>,
  levelHelp: {
    gentle: 'Foes go easy and nobody is tuckered.',
    normal: 'A fair bout.',
    spicy: 'Rivals play like a Champion. Prizes ×1.25.',
  } as Record<BoutDifficulty, string>,
  kidMode: 'Gentle bouts are always on in the Learning Grove.',
  play: "Let's play!",
  skip: 'Skip this bout',
  skipHelp: 'It counts as won for the story, with half the Shells.',
  back: '‹ Back',
  skipped: (shells: number, currency: string) =>
    `Bout skipped. It counts as won. +${shells} ${currency}`,
} as const;

export const BOUTS_SETTING_TEXT = {
  label: 'Bouts',
  help: 'How story bouts play. Circuit ribbons are always played.',
  options: {
    play: 'Play them',
    gentle: 'Gentle (kid mode)',
    skip: 'Skip story bouts',
  } as Record<'play' | 'gentle' | 'skip', string>,
  steady: 'Steady hands',
  steadyHelp: 'No timing ring in bouts: every Bonk hits a steady ×1.1.',
} as const;

export const RING_TEXT = {
  tap: 'Tap when the dot is in the ring!',
  nice: 'Nice!',
  label: 'Timing ring',
} as const;

export const WHO_TEXT = {
  foe: 'Who? Pick a foe.',
  ally: 'Who? Pick a friend.',
  both: 'Hits both foes (×0.75 each).',
} as const;

export const SPOILS_TEXT = {
  points: (name: string, list: string) => `${name}: ${list}`,
  stat: (label: string, n: number) => `+${Math.round(n)} ${label}`,
  hat: (hat: string) => `🎩 New hat: ${hat}`,
  cards: (n: number) => `🃏 ${n} new move card${n === 1 ? '' : 's'}`,
} as const;

/** Shown beside a stat in the spoils list. */
export const STAT_SHORT: Record<StatKey, string> = {
  swim: 'Swim',
  fly: 'Fly',
  run: 'Run',
  power: 'Power',
  stamina: 'Stamina',
};

export const INSPECT_TEXT = {
  title: (name: string) => `About ${name}`,
  inspect: (name: string) => `Inspect ${name}`,
  type: 'Type',
  band: 'Leaning',
  bands: {
    sun: { icon: '☀', name: 'Sun' },
    moon: { icon: '🌙', name: 'Moon' },
    neutral: { icon: '◐', name: 'Neutral' },
  } as Record<AlignmentBand, { icon: string; name: string }>,
  moves: 'Moves seen',
  noMoves: 'Nothing yet. Watch closely!',
  status: 'Status',
  fine: 'Feeling fine.',
  close: 'Close',
} as const;

/** Debug panel only: kept short and plain. */
export const BATTLE_DEBUG_TEXT = {
  title: 'Battle',
  start: 'Start',
  noBout: 'No bout running.',
  hp: 'Set HP',
  status: 'Status',
  clear: 'Clear',
  win: 'Force win',
  lose: 'Force loss',
  simulate: 'Simulate 100 bouts',
  winRate: (won: number, n: number, ms: number) =>
    `Won ${won}/${n} (${Math.round((100 * won) / Math.max(1, n))}%) in ${Math.round(ms)} ms`,
  copy: 'Copy replay',
  copied: 'Replay JSON copied below.',
  paste: 'Paste a replay JSON here',
  run: 'Replay',
  same: (n: number) => `Same log: ${n} events match.`,
  differs: (at: number) => `Log differs at event ${at}.`,
  bad: 'Not a replay JSON.',
  replayed: (n: number) => `Replayed: ${n} events (no live bout with that seed).`,
} as const;
