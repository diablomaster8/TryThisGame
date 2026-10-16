import {
  chapterBegun,
  dawnSince,
  duskSince,
  isNight,
  morningAfterScene,
  postGameMorning,
  type StoryRule,
} from './side-rule-kit';
import { collectorRoute, mossInWorld, sableBonded, seen } from './story-state';
import type { CampaignState } from './types';

/**
 * The side stories of chapters 9 to 12 and after: S6, S23, S19, S20, S26 and S24. Each
 * rule follows its story's TIMING and VARIANTS notes in src/content. Step indexes are
 * 0-based: "step 3" in the notes is `i === 2` here. S6 and S23 live in the three nights
 * between chapter 9's close and the Long Night (side-stories.ts holds c10-open for them).
 */

const flag = (c: CampaignState, k: string): string | number | boolean | undefined => c.flags[k];

/** Ash left Corvin's garden in chapter 9, on any route but the Collector's. */
function ashLeft(c: CampaignState): boolean {
  const corvin = c.flags.corvin;
  return (
    (corvin === 'reconciled' || corvin === 'bargained' || corvin === 'forced') && !collectorRoute(c)
  );
}

// S6 Ash's True Name: the morning after chapter 9, any time from then.
const S6: StoryRule = {
  id: 's6',
  opens: (w, c) => ashLeft(c) && morningAfterScene(w, c, 'c9-close'),
  // Step 4 is in Ember's kitchen after dark.
  gate: (w, _c, st, i) => i !== 3 || duskSince(w, st),
  autoOnly: [2],
};

// S23 Three Visitors: the three nights before the Long Night; visitors on completion.
const S23: StoryRule = {
  id: 's23',
  opens: (w, c) => c.chapter === 10 && !chapterBegun(c, 10) && morningAfterScene(w, c, 'c9-close'),
  closes: (_w, c, st) => chapterBegun(c, 10) && st.step < 13,
  gate: (w, c, st, i) => {
    // The Collector route is read once, as the story opens.
    if (c.flags['s23-collector'] === undefined) c.flags['s23-collector'] = collectorRoute(c);
    if (i === 6 || i === 10) return duskSince(w, st); // nights two and three
    if (i === 13) return dawnSince(w, st); // the morning before the Long Night
    return true;
  },
  // The first step is a visit to Corvin's cottage at dusk.
  canAct: (w, _c, _st, i) => i !== 0 || isNight(w.timeMs),
  autoOnly: [1, 2],
  before: (_w, c, i) => {
    if (i === 4 && c.flags.s13Done) return ['s23-window'];
    if (i === 14 && c.flags['s23-collector']) return ['s23-partner'];
    return [];
  },
  after: (_w, c, i) => {
    if (c.flags.millLetter !== 'kept') return [];
    if (i === 0) return ['s23-coat-letter'];
    if (i === 14) return ['s23-letter-back'];
    return [];
  },
  variant: (_w, c, scene) => {
    const collector = Boolean(c.flags['s23-collector']);
    const corvin = c.flags.corvin;
    switch (scene) {
      case 's23-note':
        if (collector) return 's23-note-collector';
        if (corvin === 'bargained') return 's23-note-bargained';
        if (corvin === 'forced') return 's23-note-forced';
        return scene;
      case 's23-dusk':
        if (corvin === 'bargained') return 's23-dusk-bargained';
        if (corvin === 'forced') return 's23-dusk-forced';
        return scene;
      case 's23-caller':
      case 's23-cold-one':
        return c.flags.s13Done ? `${scene}-aldous` : scene;
      case 's23-briar':
      case 's23-stove':
      case 's23-cloak':
      case 's23-pass':
        return collector ? `${scene}-collector` : scene;
      case 's23-ash':
        return c.flags.s6Done ? 's23-ash-named' : scene;
      case 's23-root':
        return c.flags.s8Reunited ? 's23-root-ear' : scene;
      case 's23-drip': {
        const stay = flag(c, 's23-stay');
        return stay === 'home' ? 's23-drip-home' : stay === 'insist' ? 's23-drip-insist' : scene;
      }
      case 's23-complete': {
        const answer = flag(c, 's23-answer');
        if (answer === 'keep-on') return 's23-complete-keep-on';
        if (answer === 'sat') return 's23-complete-sat';
        return scene;
      }
      default:
        return scene;
    }
  },
};

const S19_VERSIONED = ['s19-warmth', 's19-climb', 's19-hollow', 's19-question', 's19-fade'];

// S19 Cinder's Last Light: the first chapter 11 morning, if the stone was unmade.
const S19: StoryRule = {
  id: 's19',
  opens: (w, c) => c.chapter === 11 && !c.flags.keptStone && morningAfterScene(w, c, 'c11-open'),
  // The final choice arriving first: cinder stays unset.
  closes: (_w, c) => seen(c, 'c12-open'),
  gate: (w, c, st, i) => {
    if (i === 0 && c.flags['s19-with'] === undefined)
      c.flags['s19-with'] = mossInWorld(c) ? 'moss' : sableBonded(w, c) ? 'sable' : 'alone';
    return i !== 1 || dawnSince(w, st); // the climb is first light tomorrow
  },
  autoOnly: [2, 3],
  variant: (_w, c, scene) => {
    const w = c.flags['s19-with'];
    if (!S19_VERSIONED.includes(scene) || w === 'moss' || w === undefined) return scene;
    return `${scene}-${w}`;
  },
};

// S20 Fort Night: chapter 11, the first clear morning after the Long Night.
const S20: StoryRule = {
  id: 's20',
  opens: (w, c) => c.chapter === 11 && morningAfterScene(w, c, 'c11-open'),
  closes: (_w, c) => seen(c, 'c12-open'),
};

// S26 The Walled Garden: late summer to chapter 8, a pause, then chapter 11's days.
const S26: StoryRule = {
  id: 's26',
  opens: (_w, c) => c.chapter >= 6 && c.chapter <= 8 && seen(c, 'c6-close'),
  closes: (_w, c, st) =>
    (chapterBegun(c, 9) && st.step < 10) || (seen(c, 'c12-open') && st.step < 13),
  gate: (_w, c, _st, i) => {
    if (i === 8) return c.chapter >= 7; // autumn bulbs
    if (i >= 10) return c.chapter === 11 && seen(c, 'c11-open');
    return true;
  },
  autoOnly: [4, 5, 7],
  variant: (_w, c, scene) => {
    switch (scene) {
      case 's26-door':
        return c.flags.s12Done ? 's26-door-thrums' : scene;
      case 's26-tobin-bench':
        return c.flags.s13Done ? 's26-tobin-bench-cellar' : scene;
      case 's26-snowdrops':
        return c.flags['s26-steps'] === 'lift' ? 's26-snowdrops-lifted' : scene;
      case 's26-complete': {
        const key = flag(c, 's26-key');
        return key === 'post' ? 's26-complete-post' : key === 'door' ? 's26-complete-door' : scene;
      }
      default:
        return scene;
    }
  },
};

// S24 The Adventure Book: the spring after the ending; its inserts read the ending.
const S24: StoryRule = {
  id: 's24',
  opens: postGameMorning,
  gate: (w, _c, st, i) => !(i >= 1 && i <= 3) || dawnSince(w, st),
  autoOnly: [0, 5, 7, 9],
  before: (_w, c, i) => {
    if (i !== 4) return [];
    if (c.ending === 'moss-sleeps') return ['s24-bun-moss'];
    if (c.ending === 'eternal-dawn') return ['s24-eternal-watch'];
    return [];
  },
  after: (_w, c, i) => {
    const walk = c.flags.walk;
    if (i === 0) return c.flags.keptStone && walk !== 'moss' ? ['s24-moss-kept'] : [];
    if (i === 13) {
      if (walk === 'moss' && !c.flags.keptStone) return ['s24-shelf-moss'];
      if (walk === 'sable') return ['s24-shelf-sable'];
    }
    if (i === 15) return walk === 'corvin' ? ['s24-home-corvin'] : [];
    return [];
  },
  variant: (_w, c, scene) => {
    const walk = c.flags.walk;
    switch (scene) {
      case 's24-tea':
        if (walk === 'moss') return c.flags.keptStone ? 's24-tea-moss-stayed' : 's24-tea-moss';
        if (walk === 'sable') return 's24-tea-sable';
        return scene;
      case 's24-lantern':
        return walk === 'corvin' ? 's24-lantern-corvin' : scene;
      case 's24-stowaway':
        return c.flags.s14Done ? 's24-stowaway-knows' : scene;
      case 's24-home':
        return c.ending === 'eternal-dawn' ? 's24-home-eternal' : scene;
      default:
        return scene;
    }
  },
};

export const LATE_RULES: StoryRule[] = [S6, S23, S19, S20, S26, S24];
