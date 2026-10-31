/**
 * Lane B round 9, helper c ("party, quests, camp"): the player-facing text for the party's
 * personalities underground (R0167), the Hollow's requests and Journal rows (R0165), today's
 * act chain and share codes (R0185), the act quests (R0166) and the friends for hire (R0181).
 * Numbers live in `dungeon-r9-c.ts`.
 */
import type { RequestVoice } from './strings-requests';

export const HOLLOW_R9C_TEXT = {
  // R0167: personality moments (the hop and the hide show on the Nubbin itself).
  borrow: (name: string) => `${name} "borrows" a Shell back from the stray. Cheeky.`,
  nap: (name: string) => `${name} has found the comfiest spot on the whole level.`,
  napRest: (name: string) => `${name}'s doze was catching. Everyone feels a bit fresher.`,

  // R0165: the Journal's "The Hollow" rows.
  journalSecrets: (n: number) =>
    n > 0 ? `✧ Secret rooms found: ${n}` : '✧ Secret rooms found: none yet',
  journalQuests: (done: number, total: number) => `! Act quests done: ${done} of ${total}`,

  // R0185: today's chain and the share code.
  dailyChain: (act: string) => `Today's Hollow: five levels of ${act}, with a boss at the bottom.`,
  shareCode: (code: string) => `Code: ${code}`,
  compareLabel: "A friend's code",
  comparePlaceholder: 'H1-…',
  compareButton: 'Compare',
  compareResult: (deepest: number, time: string, finds: number, sameDay: boolean) =>
    `${sameDay ? 'Same day' : 'Another day'}: deepest ${deepest} · best time ${time} · finds ${finds}`,
  compareBad: 'That code does not look right. Check it and try again.',

  // R0166: the act quests.
  questTitle: 'Quests',
  questTake: 'Take it on',
  questActive: 'Under way',
  questDoneMark: '✓ Done',
  questTaken: (name: string) => `Quest taken: ${name}. Look for the ! on the map.`,
  questDone: (name: string, shells: number) => `Quest done: ${name}! +${shells} Shells.`,
  questChip: (goal: string) => `! ${goal}`,
  quests: {
    sneezes: {
      name: 'The Den of Sneezes',
      goal: 'Calm every pack on level 1',
      ask: 'Level 1 is all sniffles and sneezes. Settle every pack down there, would you?',
    },
    teaspoon: {
      name: 'Lost Teaspoon',
      goal: "Find Gran's teaspoon in level 2's chest",
      ask: 'Gran lost a teaspoon down here once. I would bet my boots it is in a chest on level 2.',
    },
    bells: {
      name: 'Hush the Bells',
      goal: 'Beat Count Compost on level 2',
      ask: 'Count Compost rings the cloister bells at all hours. Win on level 2 for some peace.',
    },
    shears: {
      name: "The Gardener's Shears",
      goal: "Find the shears in level 3's chest",
      ask: 'The old gardener left good shears at the bottom. Level 3, in the big chest.',
    },
    sandglass: {
      name: 'The Sandglass',
      goal: "Find the sandglass in level 2's chest",
      ask: 'Our sandglass went missing. Level 2 has a chest that looks suspicious.',
    },
    'napping-king': {
      name: 'Tomb of the Napping King',
      goal: 'Calm every pack on level 3',
      ask: 'The king is napping on level 3 and his guards are grumpy. Calm them all.',
    },
    penguins: {
      name: 'Rescue the Penguin Choir',
      goal: 'Reach the far end of level 2',
      ask: 'The penguin choir went for a waddle and got lost. Far end of level 2. Bring them home.',
    },
    recipe: {
      name: 'The Frozen Recipe',
      goal: "Find the recipe in level 3's chest",
      ask: 'Gran wrote a soup recipe and the ice ate it. Level 3, in a chest. Mind your fingers.',
    },
    hearths: {
      name: 'Warm the Hush',
      goal: 'Calm every pack on level 2',
      ask: 'The hearths on level 2 went cold. Calm the packs so we can light them again.',
    },
    'third-hush': {
      name: 'The Least Hush',
      goal: 'Warm up Hush the Least on level 2',
      ask: 'Hush the Least keeps the lamps from lighting. Win it round on level 2 and the dark eases.',
    },
  } as Record<string, { name: string; goal: string; ask: string }>,
  questReward: (shells: number, acorns: number) =>
    acorns > 0 ? `+${shells} Shells and a Homing Acorn` : `+${shells} Shells`,

  // R0181: friends for hire.
  hireTitle: 'Friends for hire',
  hireHelp: (cost: number) =>
    `A friend walks with you for one trip, cheers in every fight and brings a gift. ${cost} Shells.`,
  hireButton: (cost: number) => `Hire · ${cost} 🐚`,
  hireAlong: (name: string) => `${name} is coming along for this trip.`,
  hireSendHome: 'Send home',
  hired: (name: string) => `${name} joins the trip.`,
  friendLeft: (name: string) => `${name} waves and heads back to camp.`,
  friendHeal: (name: string) => `${name} hands out snacks. The party perks up.`,
  aura: {
    sight: { name: 'Bright Eyes', help: 'Sees more of each level.' },
    fetch: { name: 'Helping Hands', help: 'The party reaches further for loot.' },
    brave: { name: 'Pep Talk', help: 'Extra cheer in every fight.' },
    heal: { name: 'Snack Bag', help: 'Once a level, a tired party gets a snack.' },
  } as Record<string, { name: string; help: string }>,
  /** A friend's line on the hire board (they are people, so they may talk). */
  hireLine: {
    fern: 'I packed sandwiches. Also a spare pair of socks. Also more sandwiches.',
    marina: 'Rule four: never go down a hole alone. I made that one up just now.',
    sparks: 'Race you to the bottom! Kidding. Mostly.',
    clover: 'I brought a candle and my lucky thimble, dear.',
    pixel: 'I mapped half of this already. In my head. It counts.',
    ember: 'Guard up, chin up. I will be right behind you.',
    byte: 'Logging everything. Floors, finds, snacks eaten.',
    dusty: 'Old stones have stories. I would like to hear these ones.',
    nova: 'The stars are up there somewhere. I will keep us pointed the right way.',
    luna: 'I will walk slowly. You will thank me later.',
  } as Record<string, string>,
} as const;

/** R0165: the three Hollow requests on the board, in the request board's words. */
export const HOLLOW_R9C_QUEST_TEXT = {
  hollowBoss: () => 'Beat Big Grumblecap at the bottom of the Rootways',
  hollowSecret: () => 'Find a secret room in the Hollow',
  hollowSet: () => 'Wear a full Hollow set',
};

/** R0165: their voiced asks and thanks (the fallback pair, and the narrated Nubbin pair). */
export const HOLLOW_R9C_VOICES: Record<string, RequestVoice> = {
  hollowBoss: {
    fallback: {
      ask: 'Something big grumbles at the bottom of the Rootways. Could you quiet it?',
      thanks: 'It has gone quiet down there. Lovely work.',
    },
    nubbin: {
      ask: '{name} points down the Hollow steps and puffs up, very brave.',
      thanks: '{name} does a proud little march round the well.',
    },
    by: {},
  },
  hollowSecret: {
    fallback: {
      ask: 'They say the Hollow has rooms nobody has found. Find one?',
      thanks: 'A secret room! I knew it. Well, I hoped it.',
    },
    nubbin: {
      ask: '{name} taps on a wall and listens, ear pressed flat.',
      thanks: '{name} keeps tapping walls, just in case.',
    },
    by: {},
  },
  hollowSet: {
    fallback: {
      ask: 'Wear a whole matching set from the Hollow. For the look of the thing.',
      thanks: 'Very smart. Everything matches. Even the dust.',
    },
    nubbin: {
      ask: '{name} holds up two odd boots and looks at you hopefully.',
      thanks: '{name} admires the set from every side.',
    },
    by: {},
  },
};
