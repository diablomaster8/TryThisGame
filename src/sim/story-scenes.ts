import {
  CHAPTERS,
  ENDINGS,
  SCENES,
  SPEAKERS,
  type Chapter,
  type Line,
  type Scene,
} from '../config/story';
import type {
  EduBand,
  EduScene,
  LanguageCourse,
  Lesson,
  Quest,
  Reward,
  Storyline,
} from '../content/types';
import {
  EDU_BANDS,
  eduApi,
  joinBandSets,
  type EduApi,
  type EduBandSet,
  type EduSets,
} from '../content/edu-kit';
import { CHOICE_PAYOFFS } from './choice-payoffs';
import { registerLangCourses, registerLangQuests } from './lang';
import type { CampaignState, World } from './types';

/**
 * Every scene the Grove's story can queue, once registered: the campaign's, and every
 * Grove side story's steps, done and complete scenes, and their variant scenes. `sceneFor`
 * applies the line swaps the scene notes ask for, read from flags when the scene is shown.
 */

/** The campaign v2 script, loaded as its own chunk (see `loadStoryScripts`). */
export interface CampaignContent {
  chapters: Chapter[];
  scenes: Scene[];
  endings: Record<string, { title: string; how: string }>;
  speakers: typeof SPEAKERS;
}

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
/** The quest each quest scene belongs to, for its speakers' name plates. */
const QUEST_OF_SCENE = new Map<string, Quest>();

function add(s: Scene | undefined, quest?: Quest): void {
  if (s && !SCENE_BY_ID.has(s.id)) SCENE_BY_ID.set(s.id, s);
  if (s && quest && !QUEST_OF_SCENE.has(s.id)) QUEST_OF_SCENE.set(s.id, quest);
}

/**
 * Pure: the name plate for `who` in the scene `sceneId`, from the quests' own speaker lists.
 * The quest that owns the scene wins (by `owner`, else the longest `<quest id>-` prefix),
 * then any quest of the same family (the id's first part: `a13`, `s24`, `q21`), then any
 * quest at all. Undefined when no quest declares it; content-check fails such a line.
 */
export function speakerNameIn(
  quests: Iterable<Quest>,
  sceneId: string,
  who: string,
  owner?: Quest,
): string | undefined {
  const list = [...quests];
  let quest = owner;
  if (!quest) {
    for (const q of list) {
      if (sceneId.startsWith(`${q.id}-`) && (!quest || q.id.length > quest.id.length)) quest = q;
    }
  }
  const own = quest?.speakers.find((s) => s.id === who)?.name;
  if (own !== undefined) return own;
  const family = sceneId.split('-')[0];
  let any: string | undefined;
  for (const q of list) {
    const name = q.speakers.find((s) => s.id === who)?.name;
    if (name === undefined) continue;
    if (q.id.split('-')[0] === family) return name;
    any ??= name;
  }
  return any;
}

/** The name plate the registered quests give `who` in the Grove scene `sceneId`. */
export function questSpeakerName(sceneId: string, who: string): string | undefined {
  return speakerNameIn(QUEST_BY_ID.values(), sceneId, who, QUEST_OF_SCENE.get(sceneId));
}

/**
 * Fill the campaign's chapters, scenes, endings and speakers (config/story.ts) and add its
 * scenes to the registry. It runs before the side stories register, so a campaign scene
 * wins any shared id, as it did when the script was synchronous. Safe to repeat.
 */
export function registerCampaign(content: CampaignContent): void {
  if (SCENES.length) return;
  CHAPTERS.push(...content.chapters);
  SCENES.push(...content.scenes);
  Object.assign(ENDINGS, content.endings);
  Object.assign(SPEAKERS, content.speakers);
  for (const s of SCENES) add(s);
}

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
      add(step.scene, q);
      add(step.done, q);
    }
    add(q.complete, q);
    for (const r of q.rewards) REWARD_BY_ID.set(r.id, { quest: q.id, reward: r });
    if (q.audience === 'all')
      for (const [key, text] of Object.entries(q.childLines ?? {})) CHILD_LINES.set(key, text);
  }
  for (const s of content.variants) add(s);
}

const STORYLINE_BY_ID = new Map<string, Storyline>();

/** A separate campaign's script by id ('hundred', 'logged', 'beetle', 'dawn', 'dusk'). */
export function storylineById(id: string): Storyline | undefined {
  return STORYLINE_BY_ID.get(id);
}

/** Every registered storyline, in script order (for the title screen). */
export function storylines(): Storyline[] {
  return [...STORYLINE_BY_ID.values()];
}

/**
 * Add the separate campaigns' chapters, beats, endings and extra scenes to the registry,
 * their speakers to SPEAKERS, and their endings to ENDINGS under `<id>-<ending>` so the
 * dialogue box's end card finds them. Safe to repeat.
 */
export function registerStorylines(list: Storyline[]): void {
  for (const s of list) {
    if (STORYLINE_BY_ID.has(s.id)) continue;
    STORYLINE_BY_ID.set(s.id, s);
    for (const ch of s.chapters) {
      add(ch.opening);
      add(ch.closing);
      for (const b of ch.beats ?? []) add(b.scene);
    }
    for (const x of s.extra) add(x);
    for (const sp of s.speakers) SPEAKERS[sp.id] ??= { name: sp.name, kind: sp.kind };
    for (const [id, e] of Object.entries(s.endings)) ENDINGS[`${s.id}-${id}`] ??= e;
  }
}

let loading: Promise<void> | null = null;

/**
 * Load the campaign and side-story chunks once (both fetches start together) and register
 * them, campaign first. The app awaits this before a save loads.
 */
export function loadStoryScripts(): Promise<void> {
  loading ??= Promise.all([
    import('../content/campaign'),
    import('./side-story-content'),
    import('./storyline-content'),
  ]).then(([campaign, side, lines]) => {
    registerCampaign(campaignContent(campaign));
    registerSideStories(side.SIDE_STORY_CONTENT);
    registerStorylines(lines.STORYLINE_CONTENT);
  });
  // A failed fetch (offline, or a deploy removed the chunk) must not stick: the next
  // call tries again, and the caller shows the reload notice.
  loading.catch(() => {
    loading = null;
  });
  return loading;
}

/** The Learning Grove's lookups (lines, lessons, glossary, journal text) over what is loaded. */
export type EduContent = EduApi;

/** A whole edu module as `registerEduContent` takes it: the lookups and the language lines. */
export interface EduModule extends EduApi {
  EDU_LANG_QUESTS: Quest[];
  EDU_LANG_COURSES: LanguageCourse[];
}

let eduModule: EduContent | null = null;

/** The loaded edu lookups, or null outside a Learning Grove save (or before a band loads). */
export function eduContent(): EduContent | null {
  return eduModule;
}

/** Register an edu module holding every band straight away (tests and tools). */
export function registerEduContent(m: EduModule): void {
  eduModule = m;
  registerEduScenes(m.eduSceneFor);
  registerLanguageQuests(m.EDU_LANG_QUESTS, m.EDU_LANG_COURSES);
}

/**
 * The language questlines (CV3): their quests and scenes join the registry like the side
 * stories, and the courses join `sim/lang.ts`. Only the edu chunks carry them, so the
 * main game never knows they exist. Safe to repeat.
 */
export function registerLanguageQuests(quests: Quest[], courses: LanguageCourse[]): void {
  registerLangCourses(courses);
  registerLangQuests(quests);
  for (const q of quests) {
    if (QUEST_BY_ID.has(q.id)) continue;
    QUEST_BY_ID.set(q.id, q);
    // Ori and Hana are not campaign speakers; their name plates come from the quest.
    for (const s of q.speakers) SPEAKERS[s.id] ??= { name: s.name, kind: s.kind };
    for (const step of q.steps) {
      add(step.scene, q);
      add(step.done, q);
    }
    add(q.complete, q);
    for (const r of q.rewards) REWARD_BY_ID.set(r.id, { quest: q.id, reward: r });
  }
}

/**
 * The edu chunks: each band's scripts (the campaign, side stories, fun quests, language
 * lines, LB and LK), and apart from them its Atlas and Arcade versions ("worlds"), which no
 * Learning Grove screen opens yet. A band's chunk carries the language questlines too.
 */
type EduPart = 'core' | 'worlds';
interface EduChunk {
  set: EduBandSet;
  lang?: { quests: Quest[]; courses: LanguageCourse[] };
}
const EDU_CHUNKS: Record<EduBand, Record<EduPart, () => Promise<EduChunk>>> = {
  sprout: {
    core: () =>
      import('../content/edu-sprout').then((m) => ({
        set: m.EDU_SPROUT,
        lang: { quests: m.EDU_LANG_QUESTS, courses: m.EDU_LANG_COURSES },
      })),
    worlds: () =>
      import('../content/edu-sprout-worlds').then((m) => ({ set: m.EDU_SPROUT_WORLDS })),
  },
  reader: {
    core: () =>
      import('../content/edu-reader').then((m) => ({
        set: m.EDU_READER,
        lang: { quests: m.EDU_LANG_QUESTS, courses: m.EDU_LANG_COURSES },
      })),
    worlds: () =>
      import('../content/edu-reader-worlds').then((m) => ({ set: m.EDU_READER_WORLDS })),
  },
};

/** The parts loaded so far, by band, and the loads in flight (`<band>:<part>`). */
const eduParts: Partial<Record<EduBand, Partial<Record<EduPart, EduBandSet>>>> = {};
const eduLoads = new Map<string, Promise<void>>();

/** Atlas page and Arcade cartridge scene ids (`a02-…`, `pa1-…`), whose versions are "worlds". */
const WORLD_SCENE = /^(a\d+|pa\d+)-/;

function loadEduPart(band: EduBand, part: EduPart): Promise<void> {
  const key = `${band}:${part}`;
  let p = eduLoads.get(key);
  if (p) return p;
  p = EDU_CHUNKS[band][part]().then((chunk) => {
    (eduParts[band] ??= {})[part] = chunk.set;
    if (chunk.lang) registerLanguageQuests(chunk.lang.quests, chunk.lang.courses);
    rebuildEdu();
  });
  eduLoads.set(key, p);
  // A failed fetch (offline, or a deploy removed the chunk) must not stick: the next
  // call tries again, and the caller shows the reload notice.
  p.catch(() => {
    if (eduLoads.get(key) === p) eduLoads.delete(key);
  });
  return p;
}

/**
 * Something asked the loaded bands for what they do not have: start loading the part that
 * would hold it (a band the grown-ups just switched to, an Atlas or Arcade scene, a lesson
 * from the other band). Until it arrives the scene reads its main lines, as before any edu
 * chunk loads. Only once the band loader is in use: tests that register every band skip it.
 */
function wantEdu(band: EduBand, id: string): void {
  const parts = eduParts[band];
  const part: EduPart | null = !parts?.core
    ? 'core'
    : !parts.worlds && WORLD_SCENE.test(id)
      ? 'worlds'
      : null;
  if (part) loadEduPart(band, part).catch(() => undefined);
}

/** Rebuild the lookups over every loaded part (in a fixed order, so a later load never reorders). */
function rebuildEdu(): void {
  const sets: EduSets = {};
  for (const band of EDU_BANDS) {
    const parts = eduParts[band];
    const have = [parts?.core, parts?.worlds].filter((s) => s !== undefined);
    if (have.length > 0) sets[band] = joinBandSets(...have);
  }
  const api = eduApi(sets);
  const loaded: EduContent = {
    ...api,
    eduSceneFor(band, id) {
      const scene = api.eduSceneFor(band, id);
      if (!scene) wantEdu(band, id);
      return scene;
    },
    eduLesson(id) {
      const lesson = api.eduLesson(id);
      const band = /^(sprout|reader):/.exec(id)?.[1] as EduBand | undefined;
      if (!lesson && band) wantEdu(band, id.slice(band.length + 1));
      return lesson;
    },
  };
  eduModule = loaded;
  registerEduScenes(loaded.eduSceneFor);
}

/**
 * Load the Learning Grove's educational scenes for `bands` (by default both), each band its
 * own chunk, and register them. Only a Learning Grove save asks, and only for its own band
 * (and any band its lessons came from), so the main game never downloads them and a sprout
 * slot never downloads the reader scripts. Each band's Atlas and Arcade part loads on demand.
 */
export function loadEduScripts(bands: readonly EduBand[] = EDU_BANDS): Promise<void> {
  return Promise.all(bands.map((b) => loadEduPart(b, 'core'))).then(() => undefined);
}

/** Whether a band's main edu chunk is loaded (tests, and the boot's band choice). */
export function eduBandLoaded(band: EduBand): boolean {
  return eduParts[band]?.core !== undefined;
}

/** The campaign module's exports as the registry takes them. */
export function campaignContent(m: {
  CAMPAIGN_CHAPTERS: Chapter[];
  CAMPAIGN_SCENES: Scene[];
  CAMPAIGN_ENDINGS: CampaignContent['endings'];
  CAMPAIGN_SPEAKERS: CampaignContent['speakers'];
}): CampaignContent {
  return {
    chapters: m.CAMPAIGN_CHAPTERS,
    scenes: m.CAMPAIGN_SCENES,
    endings: m.CAMPAIGN_ENDINGS,
    speakers: m.CAMPAIGN_SPEAKERS,
  };
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
let eduLookup: ((band: EduBand, id: string) => EduScene | undefined) | null = null;
export function registerEduScenes(
  lookup: (band: EduBand, id: string) => EduScene | undefined,
): void {
  eduLookup = lookup;
}

/**
 * The Learning Grove's single-line replacements (`Quest.childLines`), by
 * `"<scene id>#<line index>"`, from every audience-'all' quest. They apply to a scene that
 * has no educational version, so quests scripted after the edu pass still read gently.
 */
const CHILD_LINES = new Map<string, string>();

/**
 * The text a world's story plays in: the main game's, or (in a Learning Grove save with the
 * story language on Learning) the save's band.
 */
export function textBandOf(world: World): TextBand {
  const e = world.edu;
  const band = e && e.storyLanguage === 'learning' ? e.band : 'main';
  // A band the grown-ups just switched to starts loading as soon as its text is asked for.
  if (band !== 'main' && eduLoads.size > 0) wantEdu(band, '');
  return band;
}

/** A scene ready to play: its lines, the band's choices, and the lessons pinned to lines. */
export interface PlayScene extends Scene {
  /** Each lesson's `after` is the index in `lines` it plays after, after the line swaps. */
  lessons: Lesson[];
  /** The choice the sim takes when this version offers none of the original's. */
  defaultChoice?: string;
}

/** The choice id to report when a scene ends: the one picked, else the band's default. */
export function choiceToSend(scene: PlayScene, picked: string | null): string | null {
  return picked ?? scene.defaultChoice ?? null;
}

/** The line swaps the scene notes ask for, by scene: each works from the campaign flags. */
const SWAPS: Record<string, (c: CampaignState, s: Swapper) => void> = {
  'c10-wisp': (c, s) => {
    // The bearer is written neutrally; name whoever carried the stone. The sprout band has
    // no bearer line, so only a line that is the bearer's is rewritten.
    const who =
      c.flags.stoneBearer === 'sable'
        ? ['Sable', 'her']
        : c.flags.stoneBearer === 'moss'
          ? ['Moss', 'his']
          : null;
    if (!who) return;
    const [name, pos] = who;
    s.edit('In the shallows, the one who carried it', (t) => {
      if (!/^In the shallows, the (one who carried it|stone’s bearer)/.test(t)) return t;
      return t.includes('. The frost')
        ? `In the shallows, ${name} stands blinking. The frost is melting off ${pos} face, drip by drip.`
        : `In the shallows, ${name} stands blinking, the frost melting off ${pos} face, drip by drip.`;
    });
  },
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
    // The sprout and reader bands' c12-open lines don't line up with main's, so each anchors on its own line.
    if (c.flags.hushGarden)
      s.spliceScene(
        {
          main: 'Hazel walks the Grove. Slowly.',
          sprout: 'Gran Hazel walks slowly.',
          reader: 'Gran Hazel walks the Grove slowly.',
        },
        'c12-wall-garden',
      );
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

/**
 * S24 with the kept stone: the Grove's Nubbins are stilled, so yours walks, never runs. Each
 * band's lines are rewritten, so each names its own line by its opening words.
 */
type StillLine = [from: string, to: string];
const S24_STILL: Array<{ scene: string; main: StillLine; sprout?: StillLine; reader?: StillLine }> =
  [
    {
      scene: 's24-tea',
      main: [
        'Your Nubbin runs to her, then back to you, then to her again, to check you are both still there.',
        'Your Nubbin goes and sits by her, grey and quiet, and doesn’t move again until you do.',
      ],
      sprout: [
        'Your Nubbin runs to Nova. Then back to you.',
        'Your Nubbin sits by Nova, grey and quiet. It does not move.',
      ],
    },
    {
      scene: 's24-pack',
      main: [
        'Your Nubbin is already halfway up the first stretch of scree, looking back to see why you are all so slow.',
        'Your Nubbin waits at the foot of the scree, quite still, until you start. Then it climbs at your heel.',
      ],
      sprout: [
        'Your Nubbin runs ahead up the stones.',
        'Your Nubbin waits at the bottom. Then it walks at your heel.',
      ],
      reader: [
        'Then your Nubbin is halfway up the first stretch of stones',
        'Then your Nubbin waits at the foot of the stones, quite still, until you start. Then it climbs at your heel.',
      ],
    },
    {
      scene: 's24-falls-top',
      main: [
        'Your Nubbin finds the dry ones. It runs up, waits on each, runs back to you, and goes up again.',
        'Your Nubbin finds the dry ones, slowly, and waits on each until you catch up.',
      ],
      sprout: [
        'Your Nubbin finds the dry stones. Run up, wait, run back!',
        'Your Nubbin finds the dry stones, slowly. It waits for you.',
      ],
      reader: [
        'This slope of loose, broken stone is called scree. Your Nubbin finds the dry stones.',
        'This slope of loose, broken stone is called scree. Your Nubbin finds the dry stones, slowly, and waits on each.',
      ],
    },
    {
      scene: 's24-rock',
      main: [
        'Your Nubbin is off up the ridge into the dark before you can call it. A moment later it comes back, calm, and sits at your feet.',
        'Your Nubbin goes a little way up the ridge into the dark, slowly, and comes back calm, and sits at your feet.',
      ],
      sprout: [
        'Your Nubbin runs up the hill into the dark.',
        'Your Nubbin walks a little way into the dark. It comes back, calm.',
      ],
    },
    {
      scene: 's24-whistle',
      main: [
        'Your Nubbin runs ahead into the dark, and back, and ahead, as if it is pulling you along on a string.',
        'Your Nubbin walks ahead into the dark, slowly, and waits for the lantern at every turn.',
      ],
      sprout: [
        'Your Nubbin runs ahead, and back, and ahead again.',
        'Your Nubbin walks ahead, slowly. It waits at every turn.',
      ],
    },
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

  insertAfter(
    anchor: string | BandText,
    text: BandText,
    who = 'narrator',
    mood?: Line['mood'],
  ): void {
    // As in spliceScene: a band whose lines don't line up with main's names its own anchor.
    const own = typeof anchor === 'string' || this.band === 'main' ? undefined : anchor[this.band];
    const at = own
      ? this.lines.findIndex((l) => l.text.startsWith(own))
      : this.index(typeof anchor === 'string' ? anchor : anchor.main);
    if (at < 0) return;
    this.insert(at, [{ who, text: textFor(text, this.band), ...(mood ? { mood } : {}) }]);
  }

  /** S24's kept-stone line for this band, found by its opening words (bands rewrite it). */
  stillLine(still: { main: StillLine; sprout?: StillLine; reader?: StillLine }): void {
    const [from, to] = (this.band === 'main' ? undefined : still[this.band]) ?? still.main;
    const i = this.lines.findIndex((l) => l.text.startsWith(from));
    if (i < 0) return;
    this.lines = this.lines.map((l, j) => (j === i ? { ...l, text: to } : l));
  }

  /** Where the base line `i` sits now (lines added after it come later). */
  position(i: number): number {
    const at = this.origins.indexOf(i);
    return at < 0 ? i : at;
  }

  /** Splice another scene's lines (the band's version where it has one) after `anchor`. */
  spliceScene(anchor: string | BandText, id: string): void {
    // A band that cut lines from the scene loses the positional match, so it can name
    // its own anchor line and be searched by text instead.
    const own = typeof anchor === 'string' || this.band === 'main' ? undefined : anchor[this.band];
    const at = own
      ? this.lines.findIndex((l) => l.text.startsWith(own))
      : this.index(typeof anchor === 'string' ? anchor : anchor.main);
    const main = SCENE_BY_ID.get(id);
    if (at < 0 || !main) return;
    const band = this.band !== 'main' ? eduLookup?.(this.band, id) : undefined;
    this.insert(at, band?.lines ?? main.lines);
  }
}

/**
 * The scene as it should be shown now, in the given band (by default the world's own; see
 * `textBandOf`): the Learning Grove's lines, choices and lessons where the band has them,
 * else the main lines (with `childLines` in a Learning Grove save), with the line swaps
 * from the scene notes applied to that band's text. Flags are not here: `sceneDone` always
 * applies the ORIGINAL scene's `set` and choice flags, so every band sets the same ones.
 */
export function sceneFor(
  world: World,
  id: string,
  band: TextBand = textBandOf(world),
): PlayScene | undefined {
  const scene = SCENE_BY_ID.get(id);
  const c = world.campaign;
  if (!scene) return undefined;
  const edu = band !== 'main' ? eduLookup?.(band, id) : undefined;
  const base: PlayScene = edu
    ? {
        ...scene,
        lines: edu.lines,
        choices: edu.choices ?? [],
        lessons: edu.lessons,
        ...(edu.defaultChoice !== undefined ? { defaultChoice: edu.defaultChoice } : {}),
      }
    : { ...scene, lines: world.edu ? childLinesOf(id, scene.lines) : scene.lines, lessons: [] };
  if (!c) return base;
  const s = new Swapper(scene.lines, band, base.lines);
  SWAPS[id]?.(c, s);
  CHOICE_PAYOFFS[id]?.(c, s);
  if (c.flags.keptStone) {
    for (const still of S24_STILL)
      if (id === still.scene || id.startsWith(`${still.scene}-`)) s.stillLine(still);
  }
  if (s.lines === base.lines) return base;
  // A swap may add lines; each lesson still plays after the line it was written for.
  const lessons = base.lessons.map((l) => ({ ...l, after: s.position(l.after) }));
  return { ...base, lines: s.lines, lessons };
}

/** The main lines with the Learning Grove's single-line replacements for this scene. */
function childLinesOf(id: string, lines: Line[]): Line[] {
  if (CHILD_LINES.size === 0) return lines;
  let out = lines;
  lines.forEach((l, i) => {
    const text = CHILD_LINES.get(`${id}#${i}`);
    if (text === undefined) return;
    if (out === lines) out = [...lines];
    out[i] = { ...l, text };
  });
  return out;
}
