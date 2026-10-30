/**
 * The Learning Grove's lookups, over whichever band data is to hand. `edu.ts` builds them over
 * every band at once (tests and tools); the game loads one band's chunk at a time (see
 * `loadEduScripts` in sim/story-scenes.ts) and builds them over just what it has loaded, so a
 * sprout slot never downloads the reader scripts. A band with no data reads as empty.
 */
import type { EduBand, EduCampaign, EduChapterText, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';

export const EDU_BANDS: readonly EduBand[] = ['sprout', 'reader'];

/** One band's educational scripts: campaign slices, quest versions and variant scenes. */
export interface EduBandSet {
  campaign: EduCampaign[];
  quests: EduQuest[];
  variants: EduScene[];
}

/** The band data the lookups read; a missing band has nothing. */
export type EduSets = Partial<Record<EduBand, EduBandSet>>;

/** Join band sets in order (a band's chunk, then its Atlas and Arcade chunk). */
export function joinBandSets(...sets: EduBandSet[]): EduBandSet {
  return {
    campaign: sets.flatMap((s) => s.campaign),
    quests: sets.flatMap((s) => s.quests),
    variants: sets.flatMap((s) => s.variants),
  };
}

const EMPTY: EduBandSet = { campaign: [], quests: [], variants: [] };

export interface EduApi {
  /** Every educational scene of a band, keyed by the ORIGINAL scene id. */
  eduScenes(band: EduBand): Map<string, EduScene>;
  eduSceneFor(band: EduBand, originalId: string): EduScene | undefined;
  /**
   * The band's reader glossary for one scene: lower-case word → meaning. A word is underlined
   * in the scene that introduces it (its entry's `scene`), not every time it comes up.
   */
  eduGlossary(band: EduBand, sceneId: string): Map<string, string>;
  /** The band's journal text for a campaign chapter, if a slice covers it. */
  eduChapterText(
    band: EduBand,
    n: number,
  ): EduChapterText | undefined;
  /** The band's journal goal for a quest step (by original quest id and step id). */
  eduGoal(
    band: EduBand,
    questId: string,
    stepId: string,
  ): { goal: string; hint: string } | undefined;
  /** The band's title for a quest, when it has its own. */
  eduQuestTitle(band: EduBand, questId: string): string | undefined;
  /** A lesson by id, in any loaded band, for the grown-up progress view. */
  eduLesson(id: string): Lesson | undefined;
}

const NO_WORDS = new Map<string, string>();

/** The lookups over `sets`, each cached on first use. */
export function eduApi(sets: EduSets): EduApi {
  const of = (band: EduBand): EduBandSet => sets[band] ?? EMPTY;

  const eduScenes = (band: EduBand): Map<string, EduScene> => {
    const m = new Map<string, EduScene>();
    const set = of(band);
    for (const c of set.campaign) for (const s of c.scenes) m.set(s.of, s);
    for (const q of set.quests) for (const s of q.scenes) m.set(s.of, s);
    for (const s of set.variants) m.set(s.of, s);
    return m;
  };

  const cache = new Map<EduBand, Map<string, EduScene>>();
  const glossaryCache = new Map<EduBand, Map<string, Map<string, string>>>();
  const lessonCache = new Map<string, Lesson>();

  return {
    eduScenes,
    eduSceneFor(band, originalId) {
      let m = cache.get(band);
      if (!m) cache.set(band, (m = eduScenes(band)));
      return m.get(originalId);
    },
    eduGlossary(band, sceneId) {
      let byScene = glossaryCache.get(band);
      if (!byScene) {
        const scenes = new Map<string, Map<string, string>>();
        byScene = scenes;
        glossaryCache.set(band, scenes);
        const add = (g: GlossaryEntry[] | undefined) => {
          for (const e of g ?? []) {
            // Entries name their scene either by the original id or as `<band>:<id>`.
            const scene = e.scene.replace(/^(sprout|reader):/, '');
            let m = scenes.get(scene);
            if (!m) scenes.set(scene, (m = new Map()));
            if (!m.has(e.word.toLowerCase())) m.set(e.word.toLowerCase(), e.meaning);
          }
        };
        for (const c of of(band).campaign) add(c.glossary);
        for (const q of of(band).quests) add(q.glossary);
      }
      return byScene.get(sceneId) ?? NO_WORDS;
    },
    eduChapterText(band, n) {
      for (const c of of(band).campaign) if (c.chapters[n]) return c.chapters[n];
      return undefined;
    },
    eduGoal(band, questId, stepId) {
      return of(band).quests.find((q) => q.of === questId)?.goals[stepId];
    },
    eduQuestTitle(band, questId) {
      return of(band).quests.find((q) => q.of === questId)?.title;
    },
    eduLesson(id) {
      if (lessonCache.size === 0)
        for (const band of EDU_BANDS)
          for (const s of eduScenes(band).values())
            for (const l of s.lessons) lessonCache.set(l.id, l);
      return lessonCache.get(id);
    },
  };
}
