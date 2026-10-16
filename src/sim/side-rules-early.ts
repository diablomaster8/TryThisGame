import { STORY } from '../config/tuning';
import {
  closesAtChapter,
  dawnSince,
  dawnsAfter,
  duskSince,
  isMorning,
  morningAfterScene,
  nextAt,
  openedToday,
  type StoryRule,
} from './side-rule-kit';
import { nextDawn, nextDusk, sableOf, seen, seenAt } from './story-state';
import type { CampaignState, World } from './types';

/**
 * The side stories that open in chapters 3 to 5: S21, S25, S2, S1, S3, S29, S4, S11 and
 * S15. Each rule follows its story's TIMING and VARIANTS notes in src/content. Step
 * indexes are 0-based: "step 3" in the notes is `i === 2` here.
 */

const flag = (c: CampaignState, k: string): string | number | boolean | undefined => c.flags[k];

/** Sun and Moon Keepers, for S3's two camps. */
const SUN = ['fern', 'marina', 'sparks', 'clover', 'pixel'];
const MOON = ['luna', 'ember', 'byte', 'dusty', 'nova'];

// S21 CL-4NK: chapter 3, steps on separate days, closes unfinished at chapter 6.
const S21: StoryRule = {
  id: 's21',
  opens: (w, c) => c.chapter >= 3 && c.chapter <= 5 && morningAfterScene(w, c, 'c3-open'),
  closes: closesAtChapter(6),
  gate: (w, _c, st, i) => i === 0 || dawnSince(w, st),
  autoOnly: [4],
};

// S25 Real: chapter 3 to chapter 8; the toy's fate shapes the last steps.
const S25: StoryRule = {
  id: 's25',
  opens: (_w, c) => c.chapter >= 3 && c.chapter <= 8 && seen(c, 'c3-open'),
  closes: closesAtChapter(9),
  gate: (w, c, st, i) => {
    switch (i) {
      case 0:
        return true;
      case 2:
        return seen(c, 'c4-open') && dawnSince(w, st);
      case 7: {
        // Clank or Byte brings the page: Byte is first met at Lantern Night, and S21
        // decides which of them it is, so wait for S21 while it can still finish.
        if (!seen(c, 'c4-close')) return false;
        const s21 = c.side.s21;
        if (s21?.status === 'open' && c.chapter < 6) return false;
        return dawnSince(w, st);
      }
      case 9:
        return seen(c, 'c6-close') && dawnSince(w, st);
      case 11:
        return true;
      case 12: {
        const at = seenAt(c, 'c8-nova');
        return at !== null && w.timeMs >= nextDusk(Math.max(at, st.sinceMs));
      }
      default:
        return dawnSince(w, st);
    }
  },
  autoOnly: [11],
  variant: (w, c, scene) => {
    const kept = flag(c, 's25-toy') === 'kept';
    switch (scene) {
      case 's25-sill':
        return seen(c, 'c4-open') ? 's25-sill-late' : scene;
      case 's25-storm': {
        const sable = sableOf(w, c);
        return !sable || sable.stray || sable.trust < 20 ? 's25-storm-nosable' : scene;
      }
      case 's25-clank':
        return c.flags.s21Done ? scene : 's25-byte';
      case 's25-page':
        return c.flags.s21Done ? scene : 's25-page-byte';
      case 's25-shed':
        return kept ? 's25-shed-kept' : scene;
      case 's25-dew':
        return kept ? 's25-line' : scene;
      case 's25-gap':
        return kept ? 's25-line-dry' : scene;
      case 's25-falls':
        return kept ? 's25-falls-kept' : scene;
      case 's25-twice':
        return kept ? 's25-twice-kept' : scene;
      default:
        return scene;
    }
  },
};

// S2 Wisp: chapter 3 to the chapter 7 night; the decision sets `wisp`.
const S2: StoryRule = {
  id: 's2',
  // The morning after the first fruit is left for Sable: the first morning of chapter 3.
  opens: (w, c) => c.chapter >= 3 && c.chapter <= 7 && morningAfterScene(w, c, 'c3-open'),
  closes: (w, c, st) => {
    if (c.chapter >= 8 && st.step < 3) return true;
    // Sable gone for good before the chapter 7 night: the story stops and wisp stays unset.
    return st.step < 3 && sableOf(w, c) === undefined;
  },
  // Wisp can only be found in the chapter 6 rain.
  canAct: (_w, c, _st, i) => i !== 1 || c.chapter >= 6,
  auto: (w, c, st, i) => i === 2 && seen(c, 'c7-close') && duskSince(w, st),
  autoOnly: [0, 2],
  completeGate: (w, _c, st) => dawnSince(w, st),
  variant: (_w, c, scene) => {
    if (scene !== 's2-complete') return scene;
    if (c.flags.wisp === 'sable') return 's2-complete-sable';
    if (c.flags.wisp === 'driven') return 's2-complete-driven';
    return scene;
  },
};

// S1 The Wardens' Walk: one memory an evening from Lantern Night; Cinder's after chapter 9.
const S1: StoryRule = {
  id: 's1',
  opens: (_w, c) => seen(c, 'c4-close') && c.chapter <= 9,
  // The three memories stay open until chapter 10 begins; Cinder's then follows at once.
  closes: (_w, c, st) => c.chapter >= 10 && st.step < 4,
  gate: (w, _c, st, i) => (i === 2 || i === 3 ? duskSince(w, st) : true),
  autoOnly: [4],
};

// S3 The Cycle: a journal entry at Lantern Night; the Circuit in chapter 5; the Moot in 11.
const S3: StoryRule = {
  id: 's3',
  opens: (_w, c) => seen(c, 'c4-close') && c.chapter <= 11,
  closes: closesAtChapter(12),
  gate: (_w, c, _st, i) => {
    if (i === 0) return seen(c, 'c5-open');
    if (i === 1) return c.chapter >= 6;
    if (i === 3) return c.chapter === 11 && seen(c, 'c11-open');
    return true;
  },
  // Step 1: ask one Keeper from each side.
  note: (w, c, _st, i, cmd) => {
    if (i !== 0 || cmd.kind !== 'talk') return;
    const npc = w.npcs.find((n) => n.id === cmd.npcId);
    if (!npc) return;
    if (SUN.includes(npc.trainer)) c.flags['s3-asked-sun'] = true;
    if (MOON.includes(npc.trainer)) c.flags['s3-asked-moon'] = true;
  },
  auto: (_w, c, _st, i) =>
    i === 0 && Boolean(c.flags['s3-asked-sun']) && Boolean(c.flags['s3-asked-moon']),
};

// S29 The Gates of Dawn: the week after Lantern Night to chapter 8, gated by chapter.
const S29: StoryRule = {
  id: 's29',
  opens: (w, c) => c.chapter >= 4 && c.chapter <= 7 && morningAfterScene(w, c, 'c4-close'),
  closes: closesAtChapter(8),
  gate: (w, c, st, i) => {
    switch (i) {
      case 4:
        return seen(c, 'c5-open') && duskSince(w, st);
      case 7:
        return seen(c, 'c6-close') && dawnSince(w, st);
      case 10:
        return w.timeMs >= dawnsAfter(st.sinceMs, 2);
      case 13:
        return seen(c, 'c7-open') && w.timeMs >= nextAt(st.sinceMs, STORY.morningEndsAt);
      case 14:
        return dawnSince(w, st);
      default:
        return true;
    }
  },
  variant: (_w, c, scene) => {
    const gift = flag(c, 's29-gift');
    const suffix = gift === 'ribbon' ? '-ribbon' : gift === 'bell' ? '-bell' : '';
    switch (scene) {
      case 's29-kitchen':
        return seen(c, 'c6-open') ? 's29-kitchen-after' : scene;
      case 's29-low-river':
        return c.flags.s4Done ? 's29-low-river-full' : scene;
      case 's29-supper':
        return c.flags.s5Done ? 's29-supper-walk' : scene;
      case 's29-night':
      case 's29-ford':
        return scene + suffix;
      case 's29-complete': {
        const way = flag(c, 's29-wayfarer');
        return way === 'sat'
          ? 's29-complete-sat'
          : way === 'pencil'
            ? 's29-complete-pencil'
            : scene;
      }
      default:
        return scene;
    }
  },
};

// S4 The Wellspring: after Fossil's farewell, never S5's morning, closes at chapter 8.
const S4: StoryRule = {
  id: 's4',
  opens: (w, c) =>
    c.chapter >= 6 && c.chapter <= 7 && seen(c, 'c6-open') && !openedToday(w, c, 's5'),
  closes: closesAtChapter(8),
};

/** A morning in chapter 5 or later, after c5-open, and not a morning another story took. */
function laterMorning(w: World, c: CampaignState, ...others: string[]): boolean {
  if (c.chapter < 5 || !seen(c, 'c5-open')) return false;
  const at = seenAt(c, 'c5-open');
  if (at === null || w.timeMs < nextDawn(at)) return false;
  return isMorning(w.timeMs) && !openedToday(w, c, 's5', ...others);
}

// S11 The Blight: a chapter 5 morning that is not S5's; "a week later" is three days.
const S11: StoryRule = {
  id: 's11',
  opens: (w, c) => c.chapter <= 7 && laterMorning(w, c),
  closes: closesAtChapter(8),
  completeGate: (w, _c, st) => w.timeMs >= dawnsAfter(st.sinceMs, 3),
};

// S15 Lucky Eggs: a market morning in chapter 5 that is not S5's or S11's.
const S15: StoryRule = {
  id: 's15',
  opens: (w, c) => c.chapter <= 7 && laterMorning(w, c, 's11'),
  closes: closesAtChapter(8),
};

export const EARLY_RULES: StoryRule[] = [S21, S25, S2, S1, S3, S29, S4, S11, S15];
