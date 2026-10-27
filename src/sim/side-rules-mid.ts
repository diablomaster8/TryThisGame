import { STORY } from '../config/tuning';
import {
  chapterBegun,
  closesAtChapter,
  dawnSince,
  dawnsAfter,
  duskAfterScene,
  duskSince,
  isAfternoon,
  isNight,
  morningAfterScene,
  nextAt,
  type StoryRule,
} from './side-rule-kit';
import { nextDawn, sableOf, seen, seenAt, wispSaved } from './story-state';
import type { CampaignState, SideStoryState, World } from './types';

/**
 * The side stories that open in chapters 6 to 8: S12, S16, S18, S30, S7, S13, S17, S31,
 * S14, S8 and S22. Each rule follows its story's TIMING and VARIANTS notes in src/content.
 * Step indexes are 0-based: "step 3" in the notes is `i === 2` here.
 */

const flag = (c: CampaignState, k: string): string | number | boolean | undefined => c.flags[k];

/** "A week later", in story days. */
const weekSince = (w: World, st: SideStoryState): boolean =>
  w.timeMs >= dawnsAfter(st.sinceMs, STORY.weekDays);

/** The first dawn after both the step began and scene `id` was seen. */
function dawnAfterBoth(w: World, c: CampaignState, st: SideStoryState, id: string): boolean {
  const at = seenAt(c, id);
  return at !== null && w.timeMs >= nextDawn(Math.max(at, st.sinceMs));
}

// S12 The Hum: a chapter 6 evening; the sit on Luna's bench runs to dawn; closes at 10.
const S12: StoryRule = {
  id: 's12',
  opens: (w, c) => c.chapter >= 6 && !chapterBegun(c, 10) && duskAfterScene(w, c, 'c6-open'),
  closes: closesAtChapter(10),
  // Lying by the bottom stone at dusk; the sit from dark.
  canAct: (w, _c, _st, i) => i !== 1 || isNight(w.timeMs),
  autoOnly: [2],
};

// S16 The Workyard: after the chapter 6 rain; the fair week is a story week; closes at 9.
const S16: StoryRule = {
  id: 's16',
  opens: (w, c) => c.chapter >= 6 && c.chapter <= 8 && morningAfterScene(w, c, 'c6-close'),
  closes: closesAtChapter(9),
  canAct: (w, _c, st, i) => i !== 3 || weekSince(w, st),
};

// S18 The Grove Museum: four wings from chapter 6, the centre case from chapter 9; closes at 12.
const S18: StoryRule = {
  id: 's18',
  opens: (w, c) => c.chapter >= 6 && c.chapter <= 11 && morningAfterScene(w, c, 'c6-close'),
  closes: closesAtChapter(12),
  gate: (w, c, _st, i) => {
    if (i === 1) return c.chapter >= 7 && isNight(w.timeMs); // the autumn moth
    if (i === 3) return isNight(w.timeMs); // a clear night for the stars
    if (i === 4) return seen(c, 'c9-open');
    return true;
  },
};

// S30 What Sad Is For: chapter 6 to 8; its last day holds chapter 9 once begun.
const S30: StoryRule = {
  id: 's30',
  opens: (w, c) => c.chapter >= 6 && c.chapter <= 8 && morningAfterScene(w, c, 'c6-close'),
  closes: (_w, c, st) => c.chapter >= 9 && st.step < 9,
  holdsNext: (_w, c, st) => c.chapter === 8 && st.step >= 9,
  gate: (w, c, st, i) => {
    if (i === 6) return dawnAfterBoth(w, c, st, 'c7-stillness-3');
    if (i === 7 || i === 8) return seen(c, 'c7-open');
    if (i === 9) return seen(c, 'c8-open') && dawnAfterBoth(w, c, st, 'c8-open');
    return true;
  },
  before: (_w, c, i) => {
    if (!c.flags.s5Done) return [];
    if (i === 5) return ['s30-hole-youngest'];
    if (i === 11) return ['s30-hollow-youngest'];
    return [];
  },
  variant: (_w, c, scene) => {
    const helped = flag(c, 's30-ring') === 'helped';
    switch (scene) {
      case 's30-wall':
        return seen(c, 's1-hush') ? 's30-wall-s1' : scene;
      case 's30-trail':
        return c.flags.s5Done ? 's30-trail-s5' : scene;
      case 's30-gone':
      case 's30-hollow':
      case 's30-hill':
        return helped ? `${scene}-helped` : scene;
      case 's30-complete': {
        // The ring's three answers each close the story their own way (SR-20261027-1258).
        const ring = flag(c, 's30-ring');
        return ring === 'helped' || ring === 'broke' || ring === 'sat' ? `${scene}-${ring}` : scene;
      }
      default:
        return scene;
    }
  },
};

// S7 Unverified: after the Stillness tale; a week's watch; pauses through chapter 10.
const S7: StoryRule = {
  id: 's7',
  opens: (_w, c) => c.chapter >= 7 && seen(c, 'c7-close'),
  gate: (w, c, st, i) => {
    if (c.chapter === 10 && chapterBegun(c, 10)) return false;
    if (i === 2) return weekSince(w, st);
    if (i === 3) return duskSince(w, st);
    return true;
  },
  completeGate: (w, c, st) =>
    !(c.chapter === 10 && chapterBegun(c, 10)) && w.timeMs >= dawnsAfter(st.sinceMs, 2),
};

/** Moss was removed at the Long Night (he faded, or carried the stone in and stayed). */
const mossGone = (c: CampaignState): boolean =>
  seen(c, 'c10-moss-fades') || seen(c, 'c10-bank-moss-gone');

// S13 The Mill Cellar: chapter 7 on; the bottom level after the notebook; the letter before 12.
const S13: StoryRule = {
  id: 's13',
  opens: (_w, c) => c.chapter >= 7 && c.chapter <= 11,
  closes: closesAtChapter(12),
  gate: (_w, c, _st, i) => i !== 3 || Boolean(c.flags.notebookFound),
  // The choice in the letter scene settles it; the resolve is staging.
  auto: (_w, c, _st, i) => i === 4 && typeof c.flags.millLetter === 'string',
  autoOnly: [4],
  variant: (_w, c, scene) => {
    const gone = mossGone(c);
    if (scene === 's13-letter') return gone ? 's13-letter-nomoss' : scene;
    if (scene === 's13-settled-kept') {
      if (c.flags.millLetter === 'burned') return 's13-settled-burned';
      if (c.flags.millLetter === 'grave')
        return gone ? 's13-settled-grave-nomoss' : 's13-settled-grave';
    }
    return scene;
  },
};

// S17 Nightjar: the first chapter 7 morning, with a nursery; the fledgling waits weeks.
const S17: StoryRule = {
  id: 's17',
  opens: (w, c) =>
    c.chapter === 7 &&
    morningAfterScene(w, c, 'c7-open') &&
    w.placed.some((p) => p.kind === 'nursery'),
  closes: (_w, c, st) => chapterBegun(c, 10) && st.step < 4,
  adjust: (_w, c, st) => {
    // Chapter 10 before the hatching: the story completes without the fledgling.
    if (chapterBegun(c, 10) && st.step === 4 && st.stage !== 'done') {
      st.step = 5;
      st.stage = 'complete';
      st.pending = null;
    }
  },
  gate: (w, _c, st, i) => i !== 4 || (weekSince(w, st) && isNight(w.timeMs)),
};

/** Gourd Night has begun: s31-dusk played and the night's steps are not done. */
const gourdNight = (st: SideStoryState): boolean =>
  st.step > 6 || (st.step === 6 && st.stage !== 'wait');

// S31 The Great Gourd: after the Stillness; Gourd Night runs in one night and holds chapter 8.
const S31: StoryRule = {
  id: 's31',
  opens: (_w, c) => c.chapter === 7 && seen(c, 'c7-stillness'),
  closes: (_w, c, st) => c.chapter >= 8 && !gourdNight(st),
  holdsNext: (_w, c, st) => c.chapter === 7 && gourdNight(st) && st.step <= 12,
  holdsClose: (_w, c, st) => c.chapter === 7 && gourdNight(st) && st.step <= 12,
  gate: (w, c, st, i) => {
    if (i === 3) return dawnSince(w, st);
    if (i === 6) {
      if (!duskSince(w, st)) return false;
      // Snapshot Sable's trust as the night begins.
      const sable = sableOf(w, c);
      c.flags['s31-sable30'] = Boolean(sable && sable.trust >= 30);
      return true;
    }
    if (i === 13) return w.timeMs >= nextAt(st.sinceMs, STORY.morningEndsAt);
    return true;
  },
  autoOnly: [7, 10, 11, 12],
  completeGate: (w, _c, st) => dawnSince(w, st),
  variant: (_w, c, scene) => {
    const night = flag(c, 's31-night');
    const away = night === 'guise' || night === 'party';
    const sable = Boolean(c.flags['s31-sable30']) && !away;
    switch (scene) {
      case 's31-guising':
        return night === 'sat'
          ? 's31-guising-sat'
          : night === 'party'
            ? 's31-guising-party'
            : scene;
      case 's31-if':
        return away ? 's31-if-away' : scene;
      case 's31-midnight':
        return wispSaved(c) ? 's31-midnight-wisp' : scene;
      case 's31-shape':
      case 's31-four':
        return away ? `${scene}-away` : sable ? `${scene}-sable` : scene;
      case 's31-light':
        return sable ? 's31-light-sable' : scene;
      case 's31-promise':
        return away ? 's31-promise-went' : scene;
      // Refusing to be Ned's witness (s31-witness) changes the kick and who gives the rock
      // (SR-20261027-1257).
      case 's31-kick':
      case 's31-rock':
        return flag(c, 's31-witness') === 'refused' ? `${scene}-refused` : scene;
      case 's31-complete': {
        const letter = flag(c, 's31-letter');
        return letter === 'strays'
          ? 's31-complete-strays'
          : letter === 'busy'
            ? 's31-complete-busy'
            : scene;
      }
      default:
        return scene;
    }
  },
};

// S14 Tilly's Tabletop: wet autumn afternoons after the notebook; closes at 10.
const S14: StoryRule = {
  id: 's14',
  opens: (w, c) => !chapterBegun(c, 10) && seen(c, 'c8-close') && isAfternoon(w.timeMs),
  closes: closesAtChapter(10),
  // Sessions on separate afternoons.
  gate: (w, _c, st, i) => i === 0 || i === 4 || w.timeMs >= nextAt(st.sinceMs, STORY.morningEndsAt),
  autoOnly: [4],
};

// S8 The Warren in the Hollow: from the flat stone to Hazel's bench in chapter 11.
const S8: StoryRule = {
  id: 's8',
  opens: (_w, c) => c.chapter >= 8 && seen(c, 'c8-close'),
  closes: (_w, c, st) => seen(c, 'c12-open') && st.stage !== 'complete',
  // The fruit goes to the warren by evening.
  canAct: (w, _c, _st, i) => i !== 1 || isNight(w.timeMs),
  completeGate: (_w, c) => c.chapter === 11 && seen(c, 'c11-open'),
  // Its complete scene belongs to chapter 11's few days, before c11-close.
  holdsClose: (_w, c, st) => c.chapter === 11 && st.stage === 'complete',
  variant: (_w, c, scene) =>
    scene === 's8-complete' && seen(c, 'c10-bramble') ? 's8-complete-dawn' : scene,
};

// S22 The Climb: once Nova has asked for help; never during the Long Night; closes at 12.
const S22: StoryRule = {
  id: 's22',
  opens: (_w, c) => c.chapter >= 8 && c.chapter <= 11 && seen(c, 'c8-open'),
  closes: closesAtChapter(12),
  gate: (_w, c) => !(c.chapter === 10 && chapterBegun(c, 10)),
  canAct: (_w, c) => !(c.chapter === 10 && chapterBegun(c, 10)),
};

export const MID_RULES: StoryRule[] = [S12, S16, S18, S30, S7, S13, S17, S31, S14, S8, S22];
