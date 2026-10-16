import { SCENES, type Line, type Scene } from '../config/story';
import type { EduBand, Quest, Reward } from '../content/types';
import type { CampaignState, World } from './types';

/**
 * Every scene the Grove's story can queue: the campaign's, and (once registered) every
 * Grove side story's steps, done and complete scenes, and their variant scenes. `sceneFor`
 * applies the line swaps the scene notes ask for, read from flags when the scene is shown.
 */

/** The side-story scripts, loaded as their own chunk (see `loadSideStories`). */
export interface SideStoryContent {
  quests: Quest[];
  variants: Scene[];
}

/** The Grove's side stories S1–S31, by quest id ('s9'). Empty until registered. */
export const GROVE_SIDE_STORIES: Quest[] = [];

const QUEST_BY_ID = new Map<string, Quest>();

export function sideStory(id: string): Quest | undefined {
  return QUEST_BY_ID.get(id);
}

const SCENE_BY_ID = new Map<string, Scene>();
const REWARD_BY_ID = new Map<string, { quest: string; reward: Reward }>();

/** A side-story or fun-quest reward by its id, with the quest that gives it. */
export function rewardById(id: string): { quest: string; reward: Reward } | undefined {
  return REWARD_BY_ID.get(id);
}
function add(s: Scene | undefined): void {
  if (s && !SCENE_BY_ID.has(s.id)) SCENE_BY_ID.set(s.id, s);
}
for (const s of SCENES) add(s);

/**
 * Add the side stories' quests, step scenes and variant scenes to the registry. The app
 * calls it (through `loadSideStories`) before a save loads, since save.ts drops queued
 * scene ids the registry does not know; tests call it straight away. Safe to repeat.
 */
export function registerSideStories(content: SideStoryContent): void {
  if (GROVE_SIDE_STORIES.length) return;
  GROVE_SIDE_STORIES.push(...content.quests);
  for (const q of content.quests) {
    QUEST_BY_ID.set(q.id, q);
    for (const step of q.steps) {
      add(step.scene);
      add(step.done);
    }
    add(q.complete);
    for (const r of q.rewards) REWARD_BY_ID.set(r.id, { quest: q.id, reward: r });
  }
  for (const s of content.variants) add(s);
}

let loading: Promise<void> | null = null;

/** Load the side-story chunk once and register it. */
export function loadSideStories(): Promise<void> {
  loading ??= import('./side-story-content').then((m) => registerSideStories(m.SIDE_STORY_CONTENT));
  return loading;
}

export function sceneById(id: string): Scene | undefined {
  return SCENE_BY_ID.get(id);
}

/** A band of the text: the main game, or one of the Learning Grove's two bands. */
export type TextBand = 'main' | EduBand;

/** One line's text in every band; a band without its own words reads the main ones. */
interface BandText {
  main: string;
  sprout?: string;
  reader?: string;
}

const textFor = (t: BandText, band: TextBand): string =>
  band === 'sprout' ? (t.sprout ?? t.main) : band === 'reader' ? (t.reader ?? t.main) : t.main;

/**
 * The Learning Grove's scenes, by band and original id. The edu content is its own
 * chunk (CV2), so the lookup is registered by whoever loads it; until then every band
 * reads the main scene.
 */
let eduLookup: ((band: EduBand, id: string) => { lines: Line[] } | undefined) | null = null;
export function registerEduScenes(
  lookup: (band: EduBand, id: string) => { lines: Line[] } | undefined,
): void {
  eduLookup = lookup;
}

/** The line swaps the scene notes ask for, by scene: each works from the campaign flags. */
const SWAPS: Record<string, (c: CampaignState, s: Swapper) => void> = {
  'c11-close': (c, s) => {
    // The days read as the ones before s9-ask; and S8's youngest has gone home.
    if (c.seen.includes('s9-ask'))
      s.insertAt(0, {
        main: 'Then comes the evening Corvin asks at the gate.',
        sprout: 'Then one evening, Corvin comes to the gate.',
      });
    if (c.flags.s8Done)
      s.swap('The thin grey Nubbin wakes', {
        main: 'Hazel’s arm is empty now. She keeps it crooked anyway, out of habit.',
        sprout: 'Hazel’s arm is empty now. She still holds it bent, from habit.',
      });
  },
  'c12-open': (c, s) => {
    // S26's walled garden, spliced in as Hazel walks the posts.
    if (c.flags.hushGarden) s.spliceScene('Hazel walks the Grove. Slowly.', 'c12-wall-garden');
  },
  's10-letter': (c, s) => openLetter(c, s),
  's10-letter-told': (c, s) => openLetter(c, s),
  's6-fern': (c, s) => {
    if (c.flags['s18-centre'] === 'register')
      s.replaceAt(8, {
        main: 'It’s on your table. Delve brought it back from his museum this morning, wrapped in a scarf.',
        sprout: 'It’s on your table. Delve brought it back this morning, wrapped in a scarf.',
      });
  },
  's6-register': (c, s) => {
    if (c.flags['s18-centre'] === 'register')
      s.replaceAt(0, {
        main: 'On the cottage table: a fat ledger, soft at the corners, with a card tucked in the front. On the cover, in Hazel’s hand: “EGGS.”',
        sprout:
          'On the table: a fat old book with soft corners. On the cover, Hazel wrote: “EGGS.”',
      });
  },
  's17-complete': (c, s) => {
    if (c.flags['s17-nursery'] === 'open')
      s.insertAt(2, {
        main: 'On the nursery roof a lantern burns every night now. Some nights a grey shape sits beside it, very still.',
        sprout:
          'A lantern burns on the nursery roof each night. Some nights a grey shape sits by it.',
      });
    else if (c.flags['s17-nursery'] === 'shut')
      s.insertAt(2, {
        main: 'Some nights a grey shape sits on the cottage roof and looks down the chimney. Luna leaves a mouse on the step.',
        sprout: 'Some nights a grey shape sits on the roof. Luna leaves a mouse on the step.',
      });
  },
  's3-moot': (c, s) => {
    // S8 owns what became of Bramble: she came home.
    if (c.flags.s8Done)
      s.insertAfter(
        'Bramble went over that rail',
        { main: 'And she came home anyway. She still hates flags.' },
        'fern',
        'happy',
      );
  },
};

/** S10's letter with Open: there is no gate to stick. */
function openLetter(c: CampaignState, s: Swapper): void {
  if (!c.flags.letThemGo) return;
  s.swap('Morning. Your Nubbins are up before you. The gate is stuck.', {
    main: 'Morning. Your Nubbins are up before you. There is no gate to stick. You lift and push at the air anyway.',
    sprout: 'Morning. Your Nubbins are up first. There is no gate now. You push the air anyway.',
  });
  s.edit('The Keepers are already at the gate.', (t) =>
    t.replace('at the gate.', 'at the gateposts.'),
  );
}

/** S24 with the kept stone: the Grove's Nubbins are stilled, so yours walks, never runs. */
const S24_STILL: Array<[string, string, string]> = [
  [
    's24-tea',
    'Your Nubbin runs to her, then back to you, then to her again, to check you are both still there.',
    'Your Nubbin goes and sits by her, grey and quiet, and doesn’t move again until you do.',
  ],
  [
    's24-pack',
    'Your Nubbin is already halfway up the first stretch of scree, looking back to see why you are all so slow.',
    'Your Nubbin waits at the foot of the scree, quite still, until you start. Then it climbs at your heel.',
  ],
  [
    's24-falls-top',
    'Your Nubbin finds the dry ones. It runs up, waits on each, runs back to you, and goes up again.',
    'Your Nubbin finds the dry ones, slowly, and waits on each until you catch up.',
  ],
  [
    's24-rock',
    'Your Nubbin is off up the ridge into the dark before you can call it. A moment later it comes back, calm, and sits at your feet.',
    'Your Nubbin goes a little way up the ridge into the dark, slowly, and comes back calm, and sits at your feet.',
  ],
  [
    's24-whistle',
    'Your Nubbin runs ahead into the dark, and back, and ahead, as if it is pulling you along on a string.',
    'Your Nubbin walks ahead into the dark, slowly, and waits for the lantern at every turn.',
  ],
];

/**
 * Applies swaps to one band's lines, finding each anchor in the main scene so a band's
 * rewritten lines are matched by position (the bands keep the main scene's line order).
 */
class Swapper {
  lines: Line[];
  /** Each current line's index in the main scene, or -1 for a line an earlier swap added. */
  private origins: number[];
  constructor(
    private readonly main: Line[],
    private readonly band: TextBand,
    base: Line[],
  ) {
    this.lines = base;
    this.origins = base.map((_, i) => i);
  }

  /** Where the main scene's line at `anchor` sits in the current lines (-1 if nowhere). */
  private index(anchor: string | number): number {
    const i =
      typeof anchor === 'number' ? anchor : this.main.findIndex((l) => l.text.startsWith(anchor));
    return i < 0 ? -1 : this.origins.indexOf(i);
  }

  private insert(at: number, extra: Line[]): void {
    this.lines = [...this.lines.slice(0, at + 1), ...extra, ...this.lines.slice(at + 1)];
    this.origins = [
      ...this.origins.slice(0, at + 1),
      ...extra.map(() => -1),
      ...this.origins.slice(at + 1),
    ];
  }

  /** Replace the whole text of the line at `anchor`. */
  swap(anchor: string | number, text: BandText): void {
    const i = this.index(anchor);
    if (i < 0) return;
    this.lines = this.lines.map((l, j) => (j === i ? { ...l, text: textFor(text, this.band) } : l));
  }

  replaceAt(i: number, text: BandText): void {
    this.swap(i, text);
  }

  /** Rewrite the text of the line at `anchor` in place (the same edit in every band). */
  edit(anchor: string, fn: (text: string) => string): void {
    const i = this.index(anchor);
    if (i < 0) return;
    this.lines = this.lines.map((l, j) => (j === i ? { ...l, text: fn(l.text) } : l));
  }

  insertAt(i: number, text: BandText): void {
    const at = this.index(i);
    if (at < 0) return;
    this.insert(at, [{ who: 'narrator', text: textFor(text, this.band) }]);
  }

  insertAfter(anchor: string, text: BandText, who = 'narrator', mood?: Line['mood']): void {
    const at = this.index(anchor);
    if (at < 0) return;
    this.insert(at, [{ who, text: textFor(text, this.band), ...(mood ? { mood } : {}) }]);
  }

  /** Splice another scene's lines (the band's version where it has one) after `anchor`. */
  spliceScene(anchor: string, id: string): void {
    const at = this.index(anchor);
    const main = SCENE_BY_ID.get(id);
    if (at < 0 || !main) return;
    const band = this.band !== 'main' ? eduLookup?.(this.band, id) : undefined;
    this.insert(at, band?.lines ?? main.lines);
  }
}

/**
 * The scene as it should be shown now, in the given band: the Learning Grove's lines
 * where the band has them (else the main lines), with the line swaps from the scene
 * notes applied to that band's text.
 */
export function sceneFor(world: World, id: string, band: TextBand = 'main'): Scene | undefined {
  const scene = SCENE_BY_ID.get(id);
  const c = world.campaign;
  if (!scene) return undefined;
  const edu = band !== 'main' ? eduLookup?.(band, id) : undefined;
  const base = edu ? { ...scene, lines: edu.lines } : scene;
  if (!c) return base;
  const s = new Swapper(scene.lines, band, base.lines);
  SWAPS[id]?.(c, s);
  if (c.flags.keptStone) {
    for (const [prefix, from, to] of S24_STILL)
      if (id === prefix || id.startsWith(`${prefix}-`)) s.swap(from, { main: to });
  }
  return s.lines === base.lines ? base : { ...base, lines: s.lines };
}
