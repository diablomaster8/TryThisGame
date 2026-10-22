/**
 * The campaign: "Hazel's Grove". Twelve chapters, eight endings. Every line here is
 * player-facing text; the rules that drive it live in sim/campaign.ts.
 *
 * Speakers: the ten Keepers (by trainer id), Moss the old Eternal, Sable the Shadow
 * Nubbin, Corvin Vale, Gran Hazel, Wisp, the chorus and the narrator. The player's own
 * Keeper is "you"; the Keeper picked on the title screen only sets the player's sprite.
 */

export type Mood = 'neutral' | 'happy' | 'sad' | 'angry' | 'think' | 'shock' | 'soft';

export interface Line {
  who: string;
  text: string;
  mood?: Mood;
}

export interface Choice {
  id: string;
  label: string;
  /** Flags to set when picked. */
  set?: Record<string, number | boolean | string>;
  /** Friendship changes per Keeper id. */
  friendship?: Record<string, number>;
  /** Lines shown after picking, before the scene ends. */
  then?: Line[];
}

export interface Scene {
  id: string;
  lines: Line[];
  choices?: Choice[];
  /** Flags to set when the scene ends. */
  set?: Record<string, number | boolean | string>;
  /** How the renderers draw it (render/scene-stage.ts). The sim never reads it. */
  stage?: SceneStage;
}

/** The named places a scene can be staged at; marks live in config/stage-marks.ts. */
export type StagePlace =
  | 'grove'
  | 'hollow'
  | 'corvin'
  | 'hill'
  | 'gate'
  | 'step'
  | 'pond'
  | 'falls'
  | 'ledge'
  | 'fold'
  | 'green'
  | 'guardhouse'
  | 'rootNode';

/** One figure on a mark: who (a speaker id), where, facing whom, doing what. */
export interface StageCast {
  who: string;
  /** A mark name from config/stage-marks.ts. */
  mark: string;
  /** A speaker id to turn to ('you' is the Keeper); else the mark's own yaw. */
  face?: string;
  pose?: 'stand' | 'sit' | 'kneel' | 'walk';
  carry?: 'lantern' | 'bucket' | 'bag' | 'pie';
}

export type ShotKind = 'establish' | 'wide' | 'two' | 'close' | 'over';

/**
 * Per-scene staging (campaign graphics C1). Drawing only: a missing field means "do as
 * today". Read through render/scene-stage.ts, which also merges config/scene-stages.ts.
 */
export interface SceneStage {
  /** Where: a named mark set, so scripts never carry coordinates. */
  place?: StagePlace;
  /** Hour 0–24 to draw at (C2); else hourOf(narration); else the clock. */
  hour?: number;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  weather?: 'clear' | 'rain' | 'snow' | 'frost' | 'wind';
  /** Who stands where, facing whom, doing what (C5, M6, H4). */
  cast?: StageCast[];
  /** Camera (H8, H14). `focus` defaults to the speakers; `yaw` is radians, world frame. */
  shot?: { kind: ShotKind; focus?: string[]; yaw?: number };
  /** Props to show or set (story props, the gate, the shelf, bowls…). */
  props?: Record<string, 'show' | 'hide' | 'open' | 'shut' | 'lit' | 'out'>;
  /** Named lights (H3): lantern-1..4, windows, the porch. */
  lights?: Record<string, 'lit' | 'out' | 'flicker'>;
  /** Held effects (H6, M5): no pulsing; each has a still form under reduced motion. */
  fx?: Array<'fallsStill' | 'stoneGlow' | 'goldWater' | 'fireflies' | 'seed' | 'breath'>;
  /** Campaign look override (H18), e.g. ch9–11 grey-blue. */
  grade?: string;
  /** How to arrive: cut (default) or a short fade. */
  transition?: 'cut' | 'fade';
}

export interface Chapter {
  n: number;
  title: string;
  opening: string;
  /** Goal id (sim/campaign.ts decides when it is met) and the journal text. */
  goal: string;
  goalText: string;
  hint: string;
  closing: string;
}

export const SPEAKERS: Record<string, { name: string; kind: 'keeper' | 'nubbin' | 'other' }> = {
  you: { name: 'You', kind: 'keeper' },
  narrator: { name: '', kind: 'other' },
  moss: { name: 'Moss', kind: 'nubbin' },
  sable: { name: 'Sable', kind: 'nubbin' },
  corvin: { name: 'Corvin Vale', kind: 'keeper' },
  hazel: { name: 'Gran Hazel', kind: 'keeper' },
  fern: { name: 'Fern', kind: 'keeper' },
  marina: { name: 'Marina', kind: 'keeper' },
  sparks: { name: 'Sparks', kind: 'keeper' },
  clover: { name: 'Clover', kind: 'keeper' },
  pixel: { name: 'Pixel', kind: 'keeper' },
  luna: { name: 'Luna', kind: 'keeper' },
  ember: { name: 'Ember', kind: 'keeper' },
  byte: { name: 'Byte', kind: 'keeper' },
  dusty: { name: 'Dusty', kind: 'keeper' },
  nova: { name: 'Nova', kind: 'keeper' },
  // The campaign adds its own (Wisp) when its chunk registers (`registerCampaign`).
};

/**
 * The campaign v2 (src/content/campaign.ts): twelve chapters, their scenes and the eight
 * endings. The script is its own chunk, so these start empty and `registerCampaign` in
 * sim/story-scenes.ts fills them before boot (tests register it up front).
 */
export const CHAPTERS: Chapter[] = [];
export const SCENES: Scene[] = [];
export const ENDINGS: Record<string, { title: string; how: string }> = {};

export const STORY_TEXT = {
  campaign: 'Campaign',
  freeGrove: 'Free Grove',
  title: 'Hazel’s Grove',
  tagline: 'A story about slow hands.',
  newCampaign: 'New campaign',
  continueCampaign: 'Continue campaign',
  continueGrove: 'Continue Grove',
  newGrove: 'New Grove',
  chooseKeeper: 'Choose your Keeper',
  journal: 'Journal',
  chapter: (n: number, title: string) => `Chapter ${n}: ${title}`,
  goal: 'Goal',
  hint: 'Hint',
  paths: 'Paths',
  pathsHelp: 'Eight endings. Here is how to reach each one.',
  reached: 'Reached',
  friends: 'Friends',
  sideStories: 'Stories',
  memories: 'Memories',
  funQuests: 'Capers',
  wispName: 'Wisp',
  memoriesHelp: 'What the stories left you.',
  keepsakeKept: (label: string) => `Kept: ${label}`,
  doStep: 'Do it',
  waitStep: 'When the time comes, it will.',
  registerOnLoan:
    'Professor Delve has brought the register back from the museum. It’s on the cottage table.',
  trust: 'Trust',
  shadow: 'Shadow',
  bonded: 'Bonded',
  stray: 'Stray',
  tapToContinue: 'Tap to continue',
  theEnd: 'The End',
  endingReached: (title: string) => `Ending: ${title}`,
  playOn: 'Keep playing',
  chapterStarted: (n: number, title: string) => `Chapter ${n}: ${title}`,
  turnedShadow: (name: string) => `${name} has gone Shadow.`,
  shadowBonded: (name: string) => `${name} loves you again.`,
  ranAway: (name: string) => `${name} has run away.`,
  strayReturned: (name: string) => `${name} is back at the edge of the Grove.`,
  lanternLit: 'Lantern lit',
  talkedTo: (name: string) => `You talked with ${name}.`,
  newGroveConfirm: 'Erase the Free Grove and start a new one?',
  resetCampaign: 'Reset campaign',
  resetCampaignConfirm: 'Erase the campaign and start the story over?',
} as const;
