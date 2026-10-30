/**
 * Player text for lane B round 8, "party and run UI": party roles (R0167, R0168), the boss
 * scroll (R0207), the Hollow guide (R0208), the ghost line (R0187), today's share card
 * (R0185) and the Homing Acorn shop row (R0150). Re-exported from `strings.ts`.
 */
import type { HollowRole } from '../sim/types';

export const HOLLOW_ROLE_TEXT: Record<HollowRole, { icon: string; name: string; help: string }> = {
  fetch: { icon: '🧺', name: 'Fetch', help: 'Runs further for finds and brings them back.' },
  fight: { icon: '🥊', name: 'Fight', help: 'Walks in front and leads the play-fights.' },
  light: { icon: '🏮', name: 'Light', help: 'Carries a glow orb: you see more of the floor.' },
  scout: { icon: '👀', name: 'Scout', help: 'Spots a pack before it spots you.' },
  swim: { icon: '🌊', name: 'Swim', help: 'Swims out to finds on little islands.' },
};

export const HOLLOW_R8_TEXT = {
  roleButton: (icon: string, name: string) => `${icon} ${name}`,
  roleAria: (who: string, name: string) => `${who}'s role: ${name}. Tap to change.`,
  roleAuto: 'auto',
  partyHelp: (n: number) => `Tap a card to choose up to ${n}; tap the role to change it.`,
  scoutSpotted: (who: string) => `👀 ${who} points: a pack up ahead, not looking yet!`,

  // R0207: the "Story so far" scroll, once per act boss.
  scrollTitle: '📜 The story so far',
  scrollClose: 'Roll it up',
  scroll: {
    rootways: [
      'Big Grumblecap sits down with a thump that shakes the toadstools.',
      'It turns out it only wanted everyone to stop stomping past its door.',
      'You tiptoe out. The Rootways go quiet, in a pleased sort of way.',
    ],
    cloister: [
      'The Topiary Knight lowers its leafy sword and has a little lie-down.',
      'Someone had been trimming it crooked for a hundred years. You promise to say something.',
      'The herb gardens smell of thyme and relief.',
    ],
    sandglass: [
      'Pharaoh Fluffhotep yawns, turns over the great hourglass and starts again.',
      'It was never guarding treasure. It was guarding a nap.',
      'The sand slides hiss softly behind you, like a cat settling.',
    ],
    frostbell: [
      'Yeti Spaghetti sneezes, and every bell-icicle in the cave rings at once.',
      'It only wanted a scarf. Your party finds it a very long one.',
      'The ice bridges creak, friendly now, all the way home.',
    ],
    gloom: [
      'The Hushkeeper does not fall so much as settle, like dust in a sunbeam.',
      'It was cold for a long time, and it kept the cold from spreading.',
      'Your Nubbins sit beside it a while. Nobody says anything. That seems right.',
    ],
  } as Record<string, readonly string[]>,

  // R0208: the Hollow guide.
  guideOn: '👣 Show me the way: on',
  guideOff: '👣 Show me the way: off',
  guideHelp: 'Soft footprints on the map lead to the stairs, or to somewhere not yet seen.',
  guideStairs: (arrow: string) => `👣 Stairs ${arrow}`,
  guideExplore: (arrow: string) => `👣 Explore ${arrow}`,
  guideLegend: 'Footprints: the way',

  // R0187: the ghost line.
  ghostLegend: '⏱ Best run',

  // R0185: today's share card.
  shareButton: '📤 Share today',
  shareTitle: "Today's Hollow",
  shareCopy: 'Copy',
  shareCopied: 'Copied!',
  shareCopyFailed: 'Could not copy: select the text and copy it by hand.',
  shareText: (day: string, deepest: number, time: string, finds: number) =>
    `Grove · Today's Hollow ${day}: deepest level ${deepest} · best time ${time} · ` +
    `${finds} finds 🌰`,
  shareNone: "No trip into today's Hollow yet. Go down and see how deep you get!",

  // R0150: the Homing Acorn in the Grove shop.
  acornShopName: '🌰 Homing Acorns',
  acornShopHelp: (bundle: number) =>
    `${bundle} acorns. Plant one underground to pop home and come back later.`,
  acornShopNote: (count: number) => `×${count}`,
};
