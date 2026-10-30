/**
 * Every player-facing word of the grid-tactics mode (recs FIGHT-50 to FIGHT-65), kept apart
 * from `strings-battle.ts`; that file re-exports it. Jobs, tile cards and objectives each get a
 * word and an icon, so colour is never the only signal. Nobody is knocked out: a unit at 0 HP
 * is tuckered out, and failing an objective is "this time", never game over.
 */
import type { TacticsEvent, JobId, ObjectiveKind } from '../sim/battle/tactics/types';
import type { TerrainKind } from '../sim/battle/tactics/terrain';
import type { ComboId } from '../sim/battle/tactics/combos';

export const JOB_TEXT: Record<JobId, { icon: string; name: string; blurb: string }> = {
  tumbler: { icon: '🌱', name: 'Tumbler', blurb: 'Small, brave and still learning.' },
  puddler: { icon: '💧', name: 'Puddler', blurb: 'Heals and soaks; mends in water.' },
  glider: { icon: '🪶', name: 'Glider', blurb: 'Reaches far from high ground; jumps higher.' },
  dasher: { icon: '💨', name: 'Dasher', blurb: 'Moves further; loves a sneaky back hit.' },
  bonker: { icon: '💪', name: 'Bonker', blurb: 'Sturdy; bonks foes back a tile.' },
  helper: { icon: '🤝', name: 'Helper', blurb: 'Cheers friends on and starts combos.' },
  lanternKeeper: {
    icon: '🏮',
    name: 'Lantern Keeper',
    blurb: 'Its glow lifts every friend beside it.',
  },
};

export const JOB_LAYER_TEXT = {
  sunny: { icon: '☀', name: 'Sunny', blurb: 'Kinder heals; brighter in lantern light.' },
  moony: { icon: '☾', name: 'Moony', blurb: 'Trickier tricks; bolder in the shade.' },
} as const;

export const TERRAIN_TEXT: Record<TerrainKind, { icon: string; name: string; blurb: string }> = {
  grass: { icon: '🌿', name: 'Grass', blurb: 'Plain, soft ground.' },
  tall: { icon: '🌾', name: 'Tall grass', blurb: 'Harder to hit; hidden from far away.' },
  path: { icon: '👣', name: 'Path', blurb: 'Quick going: half a step.' },
  mud: { icon: '🟫', name: 'Mud', blurb: 'Squelchy: two steps.' },
  shallow: {
    icon: '💦',
    name: 'Shallows',
    blurb: 'Soggy for non-swimmers; Swim moves splash harder.',
  },
  deep: { icon: '🌊', name: 'Deep water', blurb: 'Swimmers only, two steps a tile.' },
  lantern: { icon: '🏮', name: 'Lantern', blurb: 'Lights the tiles around it.' },
  light: { icon: '✨', name: 'Lantern light', blurb: 'Sun moves shine; wakes the drowsy.' },
  shade: { icon: '🌑', name: 'Shade', blurb: 'Moon moves deepen; keeps eyes brave.' },
  crystal: { icon: '💎', name: 'Crystal', blurb: 'Throws back a quarter of splashes.' },
  tree: { icon: '🌳', name: 'Fruit tree', blurb: 'Shake it to drop a fruit.' },
  wall: { icon: '🪨', name: 'Rock', blurb: 'Nobody gets through.' },
  plot: { icon: '🥕', name: 'Crop plot', blurb: 'Keep foes off it.' },
  exit: { icon: '🚪', name: 'Way out', blurb: 'Where the lost one is going.' },
};

export const OBJECTIVE_TEXT: Record<ObjectiveKind, { icon: string; goal: string; fail: string }> = {
  tuckerAll: { icon: '😴', goal: 'Tucker them all out', fail: 'Your team needs a nap. Try again?' },
  calmBoss: { icon: '💗', goal: 'Calm the leader', fail: 'Too much rough-and-tumble this time!' },
  escort: {
    icon: '🐾',
    goal: 'Lead the lost one out',
    fail: 'The little one got scared this time.',
  },
  holdLanterns: {
    icon: '🏮',
    goal: 'Keep the lanterns lit',
    fail: 'They blew the lanterns out this time!',
  },
  gather: { icon: '🍎', goal: 'Gather the fruit', fail: 'They got the fruit this time!' },
  reach: { icon: '🚩', goal: 'Reach the flag', fail: 'Not this time. Try another way?' },
  protectPlot: {
    icon: '🥕',
    goal: 'Guard the crop plot',
    fail: 'They trampled the plot this time!',
  },
  surviveRounds: { icon: '⏳', goal: 'Hold out', fail: 'Not this time. Try again?' },
};

export const COMBO_TEXT: Record<ComboId, string> = {
  rainDanceHug: 'Rain Dance Hug',
  wheelbarrowCharge: 'Wheelbarrow Charge',
  highFive: 'High Five',
  splashParade: 'Splash Parade',
  loopTheLoop: 'Loop the Loop',
  relayRush: 'Relay Rush',
  bigSquish: 'Big Squish',
  slipSlide: 'Slip and Slide',
  geyserToss: 'Geyser Toss',
  dustDevil: 'Dust Devil',
  dropBonk: 'Drop Bonk',
};

export const TACTICS_TEXT = {
  title: 'Rumble room',
  move: 'Move',
  act: 'Act',
  wait: 'Wait',
  undo: 'Undo',
  go: 'Go',
  confirm: 'Confirm',
  cancel: 'Back',
  together: 'Together!',
  shake: 'Shake tree',
  relight: 'Light lantern',
  faceHint: 'Which way to face?',
  tapTile: 'Tap a tile, then tap it again (or Go).',
  tapTarget: 'Tap a target to see what happens.',
  back: 'Back hit!',
  side: 'Side hit',
  higher: 'High ground',
  lower: 'Low ground',
  pile: 'Pile-on!',
  hitPct: (p: number) => `${Math.round(p * 100)}% to hit`,
  dmg: (n: number) => `${n} damage`,
  heal: (n: number) => `+${n} HP`,
  height: (h: number) => `Height ${h}`,
  win: 'Rumble won!',
  lose: 'Rumble over.',
  draw: 'Everyone is too tired to go on.',
  retry: 'Try again',
  skip: 'Skip',
  close: 'Done',
  prize: (shells: number) => `+${shells} Shells and a crystal`,
  start: 'Rumble room (3v3 tactics)',
  forfeit: 'Leave',
  yourTurn: (name: string) => `${name}'s turn`,
  theirTurn: (name: string) => `${name} is thinking…`,
  pups: ['Pip-pup', 'Scamp', 'Dusk'] as readonly string[],
  leader: 'Old Shadow',
} as const;

/** One line for the tactics log, or null for events the log skips. */
export function formatTactics(e: TacticsEvent, name: (id: string) => string): string | null {
  switch (e.k) {
    case 'step':
      return null;
    case 'charge':
      return `${name(e.who)} winds up…`;
    case 'fall':
      return `${name(e.who)} tumbles off the ledge! (−${e.dmg})`;
    case 'facing':
      return e.side === 'back' ? TACTICS_TEXT.back : null;
    case 'pileOn':
      return TACTICS_TEXT.pile;
    case 'combo':
      return `${name(e.a)} and ${name(e.b)}: ${COMBO_TEXT[e.combo as ComboId] ?? e.combo}!`;
    case 'reflect':
      return `The crystal splashes back at ${name(e.who)}! (−${e.dmg})`;
    case 'knock':
      return `${name(e.who)} is bonked back a step.`;
    case 'splash':
      return `${name(e.who)} is bonked into the pond. Splash! Out again, dripping.`;
    case 'fruit':
      return 'A fruit drops!';
    case 'pick':
      return `${name(e.who)} picks up a fruit.`;
    case 'lantern':
      return e.lit ? 'A lantern glows again.' : 'A lantern goes out!';
    case 'hit':
      return `${name(e.by)} hits ${name(e.to)} (−${e.dmg})`;
    case 'miss':
      return `${name(e.by)} misses ${name(e.to)}.`;
    case 'tuckered':
      return `${name(e.who)} is tuckered out.`;
    case 'calm':
      return `${name(e.to)} looks calmer.`;
    case 'rally':
      return `${name(e.by)} feels better (+${e.heal}).`;
    default:
      return null;
  }
}
