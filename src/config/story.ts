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
  /**
   * A canned gesture the speaker plays on this line (campaign graphics 4, K7): render only,
   * a nod, a shrug, a pointing arm, eyes down or a hand to the chest.
   */
  gesture?: LineGesture;
  /**
   * R0303 (FUN-14): comic stage directions, render only and never read by the sim. `beat`
   * holds this many ms before the line types; `sfx` plays a sound as it starts; `shake`
   * nudges the screen (never under reduced motion); `gag` marks a punchline for counting.
   */
  beat?: number;
  sfx?: LineSfx;
  shake?: 'small' | 'big';
  gag?: true;
  /**
   * R0303 (FUN-14): a stage actor reacts as the line starts, render only: `who` is
   * 'nubbin' (the scene's Nubbin), 'you', or a speaker id. R0368 infers one for narration
   * like "Your Nubbin sneezes" when none is set.
   */
  react?: { who: string; as: LineReaction };
  /**
   * R0304 (FUN-15): an interactive beat after this line: the scene waits for the player to
   * play it (`gate`: hold to lift, push twice; `cup`: one tap). It can never fail; a played
   * act may set the flag in `LINE_ACT_FLAGS`.
   */
  act?: LineAct;
  /** R0323 (FUN-34): a sprout join-in refrain on this line (an id in `config/edu.ts`). */
  refrain?: string;
}

/** R0303: what a stage actor can do on a line: an emote over it, or a little particle burst. */
export type LineReaction =
  | 'spark'
  | 'heart'
  | 'surprised'
  | 'dizzy'
  | 'happy'
  | 'sad'
  | 'sneeze'
  | 'giggle'
  | 'hide'
  | 'lean'
  | 'yawn'
  | 'hiccup';

/** R0304: the interactive beats a line can wait on. */
export type LineAct = 'gate' | 'cup';

/** R0304: the flag a played act sets (the cup turned over is a callback for chapter 12). */
export const LINE_ACT_FLAGS: Partial<Record<LineAct, string>> = {
  cup: 'c1-cup-turned',
  gate: 'c1-gate-pushed',
};

/** R0303: the sounds a line may cue (a subset of the game's sound names). */
export type LineSfx =
  | 'boing'
  | 'bonk'
  | 'squeak'
  | 'slideDown'
  | 'slideUp'
  | 'pop'
  | 'sneeze'
  | 'hiccup'
  | 'gulp'
  | 'raspberry'
  | 'giggle'
  | 'creak';

export type LineGesture = 'nod' | 'shrug' | 'point' | 'down' | 'chest';

export interface Choice {
  id: string;
  label: string;
  /** Flags to set when picked. */
  set?: Record<string, number | boolean | string>;
  /** Friendship changes per Keeper id. */
  friendship?: Record<string, number>;
  /** Lines shown after picking, before the scene ends. */
  then?: Line[];
  /** R0677: one emoji shown big on the sprout band's choice button (a number if absent). */
  icon?: string;
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
  | 'rootNode'
  /** The Beetle Road's Hollow Below scenes (C4): a set drawn over the Grove's ground. */
  | 'below'
  /** Hazel ch12's festival ring round the picnic (H9). */
  | 'festival'
  /** An interior set (K10): `inside-<id>`, drawn as an exclusive room. */
  | `inside-${string}`;

/** One figure on a mark: who (a speaker id), where, facing whom, doing what. */
export interface StageCast {
  /** Any speaker id: Hazel's ('fern', 'moss'…), a storyline's ('b-hob'…) or 'you'. */
  who: string;
  /** A mark name from config/stage-marks.ts. */
  mark: string;
  /** A speaker id to turn to ('you' is the Keeper); else the mark's own yaw. */
  face?: string;
  /** `sit` and `kneel` (K1) drop the hips to the mark's `seatY` when it has one. */
  pose?: 'stand' | 'sit' | 'kneel' | 'walk';
  /** A mark to walk on from (K5): render only; under reduced motion they start on `mark`. */
  from?: string;
  carry?: 'lantern' | 'bucket' | 'bag' | 'pie' | 'broom' | 'notebook' | 'egg' | 'keys';
  /** A look over the figure (C6): 'weathered' greys it, as Moss while "the grey shape". */
  tint?: 'weathered';
}

/**
 * The cast id of the player's partner Nubbin (K40): `world.partners[0]`, else `[1]`, else
 * the selected Nubbin. With no entry naming it, the stager still resolves a default spot
 * beside the Keeper (`SceneStager.partner`).
 */
export const PARTNER_CAST = 'partner';

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
  /**
   * Camera (H8, H14). `focus` defaults to the speakers; `yaw` is radians, world frame.
   * `then` (H5) is the shot after the first line advance: default 'two' after an
   * 'establish'. `fit` (H4) fits every focus point inside the HUD-safe area: default true
   * for 'establish' and 'wide'.
   */
  shot?: { kind: ShotKind; focus?: string[]; yaw?: number; then?: ShotKind; fit?: boolean };
  /**
   * Props to show or set (story props, the gate, the shelf, bowls…). Keys added for the
   * second pass: pondIce, hush, banners, cart, chair, shutters, lanternString, board
   * (which takes 'final'), door. Fourth pass: windowFigures (K18), risingLanterns (K42),
   * wreath (K43).
   */
  props?: Record<string, 'show' | 'hide' | 'open' | 'shut' | 'lit' | 'out' | 'final'>;
  /** Named lights (H3): lantern-1..4, `windows` (C5, M6), the porch. */
  lights?: Record<string, 'lit' | 'out' | 'flicker'> & { windows?: 'lit' | 'out' };
  /**
   * Draw only the set (C3, C4): the renderers hide the Grove's terrain, buildings,
   * scenery, water and every NPC not in `cast`, so a dressing can draw a void or a cave.
   */
  exclusive?: boolean;
  /** A campaign's landmark kit (H3): Grove-only buildings (config/stage-sets.ts) hide. */
  set?: 'fold' | 'logged' | 'beetle' | 'dawndusk';
  /** A kit id for the close-up cutaway (M9). */
  item?: string;
  /** Seconds of postcard hold before the first line (N1). */
  hold?: number;
  /** Held effects (H6, M5): no pulsing; each has a still form under reduced motion. */
  fx?: Array<'fallsStill' | 'stoneGlow' | 'goldWater' | 'fireflies' | 'seed' | 'breath'>;
  /** Campaign look override (H18), e.g. ch9–11 grey-blue; 'crisp' for cold mornings (M10). */
  grade?: string;
  /** How to arrive: cut (default) or a short fade. */
  transition?: 'cut' | 'fade';
  /** A told tale (K11, K38): the scene is drawn as a remembered or told story. */
  tale?: boolean;
  /**
   * A turning point (K15): held letterbox bars, the HUD hidden, auto-advance 25% slower, a
   * slow 2 s push in 3D (a cut under reduced motion).
   */
  grave?: boolean;
  /** The moon's phase in the night sky (K24). */
  moon?: 'new' | 'crescent' | 'half' | 'full';
}

export interface Chapter {
  n: number;
  title: string;
  opening: string;
  /** Goal id (sim/campaign.ts decides when it is met) and the journal text. */
  goal: string;
  goalText: string;
  hint: string;
  /**
   * R0319 (FUN-30): a longer how-to, one short step at a time; the chip shows the next step
   * and ticks it off when the step's event (a sim event kind) happens.
   */
  howTo?: readonly ChapterStep[];
  closing: string;
}

/** R0319: one how-to step and the sim event that completes it. */
export interface ChapterStep {
  text: string;
  on: string;
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
