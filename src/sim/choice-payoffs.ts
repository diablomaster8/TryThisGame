/**
 * Payoffs for the small choices in S1–S5 (review 2026-10-18, goal 9). Each of
 * those choices set a flag nothing read; here each one is remembered by a single line in a
 * scene three or more stories later, so every choice changes something the player sees.
 * The lines go in through the same line swaps as the scene notes' (`sceneFor`), with words
 * for the Learning Grove's two bands, whose S1–S5 versions set the same flags.
 *
 *   s1-pace      (walk | offered | asked)   S19, Moss riding up the pass in your coat
 *   s1-sat       / s1-asked-why             S26, Moss on Hush's bench
 *   s2-early     (fed | shooed | waited)    s2-night, Luna on the first week
 *   s2-carried   (true | false)             s2-night, the bitten hand
 *   s3-seat      (gap | sun | moon)         S30, Dimple's party
 *   s3-byte      (science | nicely)         S28, the Nubbin at Byte's door
 *   s3-shown     (together | apart)         S23, Ember's kitchen
 *   s4-swim      (with | trust)             S19, Marina in the tide pool
 *   s4-gate      (lift-push | nubbin | note) S10, the stuck gate on Hazel's first morning home
 *   s5-carry     (egg | shoulder)           S18, Dusty at the cliff
 *   s5-holder    (yours | marina)           S18, Marina at the rock pools
 *   c4-lamps     (remember | home | together | dunno) c10-dawn, the fourth lantern lights itself
 *   c5-race      (want | win | home)          c9-open, Corvin in his garden
 *   lj3-race     (fair | head | sparks)       lj3-s2-done, after the counting race
 *   lj4-bento    (beans | cucumber | lettuce) lj4-s1-done, when the box is opened
 *   s7-lever     (true)                     s7-week, Pixel has thought about it all week
 *   s7-watch-down (true)                    s7-lap, Byte steps over the stopwatch, twice
 *   s12-solo     (hum | alone | gaps)       s12-complete, the hive's dusk tune
 *   s10-racer    (fast | slow)              s10-cheer, how your runner finishes
 *   s13-rats     (fed | crept)              s13-sluice, Tobin on the rats' cheese rind
 *   s16-tired    (grove | morale | wild)    s16-week, the five a week on; s10-step, Hazel's first evening
 *   s17-approach (wait | sneak)             s17-hatching, how soon Nightjar makes room
 *   s18-entry    (free | shells)            s18-complete, the door on opening day
 *   s19-with     (moss)                     s19-sit, Moss waiting beside you
 *   s20-cry      (fort | mittens | gordon)  s20-counters, your battle cry in round three
 *   s20-merge    (gate | carried)           s20-count, Tilly on how the forts became one
 *   s20-round2   (waited | pressed)         s24-badges, a badge Tilly earned (if s14Done)
 *   s14-lair     (rolled | asked)           s24-stowaway-knows, Tilly's greeting (replaces "sat")
 *   s21-lesson   (step | sit)               s27-carry-clank, Clank at the foot of the ladder
 *   s21-byte     (fair | unfair)            s28-logged (and -unverified, -none), Byte's columns
 *   s24-cage     (argue | sit)              s24-proof, Fairweather answers it
 *   s22-chimney  (true)                     s24-cairn, Nova turns your Chimney words round
 *   s22-chimney  (look)                     s24-rock, Nova looks at you, not the drop
 *   s26-bulbs    (snowdrops | crocus | mix) s26-snowdrops (and -lifted), Linnet's bed in winter
 *   s26-hello    (asked | agree | walk)     s26-complete (and -post, -door), Linnet's mum
 *   s26-plot     (sun | rose | hers)        c12-wall-garden (spliced into c12-open), Hazel finds the bed
 *   q46-cart     (bell)                     q46-complete, the bell goes TING (wide, low: as written)
 *   q47-tuk-pemba (true)                    q47-complete, Pemba tells everybody about the hand
 *   q48-truth    (kept | told)              q48-complete, Nalu on the promise (kept) or her "Pemba!" swapped (told)
 *   q55-reaction (boo | cheer | storm)      q55-complete, the Players' greeting at the stage door
 *   s27-sold     (true)                     s27-tam, you know Nine's other name
 */
import type { Line } from '../config/story';
import type { CampaignState } from './types';

/** One line's words in every band; a band without its own reads the main ones. */
interface BandText {
  main: string;
  sprout?: string;
  reader?: string;
}

/** The part of the scene's line swapper a payoff uses. */
export interface PayoffSwaps {
  /** The band being built, for a line only one band has room for (S24's look at the cage). */
  readonly band: 'main' | 'sprout' | 'reader';
  insertAfter(anchor: string | BandText, text: BandText, who?: string, mood?: Line['mood']): void;
  insertBefore(anchor: string | BandText, text: BandText, who?: string, mood?: Line['mood']): void;
  /** Replace the text of the line starting with this band's anchor (speaker and mood stay). */
  swapText(anchor: BandText, text: BandText): void;
}

type Payoff = (c: CampaignState, s: PayoffSwaps) => void;

/** The text for whichever value the flag holds, if any. */
function by<T>(value: unknown, table: Record<string, T>): T | undefined {
  return typeof value === 'string' ? table[value] : undefined;
}

const S1_PACE: Record<string, BandText> = {
  walk: {
    main: 'At the lanterns you walked at my pace. Now I ride at yours. Fair is fair.',
    sprout: 'You walked slowly with me once. Now I ride with you.',
    reader: 'At the lanterns you walked at my pace. Now I ride at yours. That seems fair.',
  },
  offered: {
    main: 'You offered to carry me once, at the lanterns. I said ask me another year. You didn’t have to ask.',
    sprout: 'You offered to carry me once. I said no. Now I say yes.',
    reader:
      'You offered to carry me once, at the lanterns. I said ask again another year. You didn’t even need to ask.',
  },
  asked: {
    main: 'You asked which post came first, at the lanterns. This is the last one. There’s no post up here at all.',
    sprout: 'You asked which lantern came first. This is the last place. No lantern here.',
    reader:
      'At the lanterns you asked which post came first. This is the last one, and there’s no post up here at all.',
  },
};

/** SR-20261026-1036: how you met Wisp, remembered the night Luna and Clover argue over him. */
const S2_EARLY: Record<string, BandText> = {
  fed: {
    main: 'He ate both your piles in about a minute, by the way. Thorough, for a thief.',
    sprout: 'He ate both piles of fruit. Very fast, for a thief!',
  },
  shooed: {
    main: 'You clapped at him, that first week. He still flinches whenever Sparks applauds. Sparks applauds a lot.',
    sprout: 'You clapped at him once. He still jumps when Sparks claps.',
  },
  waited: {
    main: 'You sat there till he ran out of hiss. I didn’t know anything could run out of hiss.',
    sprout: 'You sat so still, he ran out of hiss!',
  },
};

const S3_SEAT: Record<string, BandText> = {
  gap: {
    main: 'You sit in the middle of the bench, between the Sun lot and the Moon lot. Nobody remarks on it any more.',
    sprout: 'You sit in the middle, between Sun and Moon. Nobody minds now.',
  },
  sun: {
    main: 'Sparks has saved you the seat beside hers. There is a sun drawn on your paper plate.',
    sprout: 'Sparks saved you a seat. Your plate has a sun on it.',
  },
  moon: {
    main: 'Byte has saved you a seat on the Moon side of the table. It has a label.',
    sprout: 'Byte saved you a seat on the Moon side. It has a label.',
  },
};

const S3_BYTE: Record<string, BandText> = {
  science: {
    main: 'Unless it’s for science. You said that once, about the plates. It worked then, I suppose.',
    sprout: 'Is it for science? You said that once. It worked.',
  },
  nicely: {
    main: 'And don’t tell me somebody asked nicely. Last time you said that, you owned up at once.',
    sprout: 'Don’t say someone asked nicely. Last time, they hadn’t.',
  },
};

const S3_SHOWN: Record<string, BandText> = {
  together: {
    main: 'Fern sits across the table. Since you showed them the plates together, they don’t do the hard things apart.',
    sprout: 'Fern sits with her. They do hard things together now.',
    reader:
      'Fern sits across the table. Ever since you showed them the plates together, they do the hard things side by side.',
  },
  apart: {
    main: 'Fern came by earlier and left a pie on the step. She knocked, and didn’t wait. Some things they still do one at a time.',
    sprout: 'Fern left a pie on the step. She knocked, and went home.',
    reader:
      'Fern came by earlier and left a pie on the step. She knocked and didn’t wait. Some things they still do one at a time.',
  },
};

const S4_SWIM: Record<string, BandText> = {
  with: {
    // SR-20261026-1169: no socks here; Marina's two-pairs gag comes three lines later.
    main: 'You waded in after your Nubbins once, in spring, and came out blue. I’ve been waiting to bring that up.',
    sprout: 'You jumped in the cold water once. You went blue!',
  },
  trust: {
    main: 'You stayed on the bank once and let your Nubbin swim. Up there you trust the rope the same way.',
    sprout: 'You trusted your Nubbin to swim. Up there, trust the rope.',
  },
};

const S4_GATE: Record<string, BandText> = {
  'lift-push': {
    main: 'It swings at once. You opened a sluice that way, once. A gate is easy after a sluice.',
    sprout: 'It swings open at once. You know how.',
  },
  nubbin: {
    main: 'Your strongest Nubbin leans on it with you, and lifts it by accident, the way it did at the dam.',
    sprout: 'Your strongest Nubbin helps. It lifts the gate by accident.',
  },
  note: {
    main: 'Pinned to the post is your old note from the dam, sent back. Under it, in a very tidy hand: “Received.”',
    sprout: 'Your old note from the dam is on the post. It says: “Received.”',
  },
};

const S5_CARRY: Record<string, BandText> = {
  egg: {
    main: 'You carried her like an egg, that last day. Both hands. She liked that.',
    sprout: 'You held her like an egg that day. She liked it.',
  },
  shoulder: {
    main: 'You let her ride your shoulder, that last day. She looked as if she owned the valley.',
    sprout: 'She rode on your shoulder that day, like a queen.',
  },
};

const S5_HOLDER: Record<string, BandText> = {
  yours: {
    main: 'Your swimmer held Fossil up, that last swim. Paw under the chin. I still think about it.',
    sprout: 'Your Nubbin held Fossil in the water. I remember.',
  },
  marina: {
    main: 'I held Fossil up, her last swim. Same as always. I’m glad it was me.',
    sprout: 'I held Fossil in the water, the last time. I’m glad.',
  },
};

/** S4's gate on Hazel's first morning home, unless Open took the gate away. */
const stuckGate: Payoff = (c, s) => {
  if (c.flags.letThemGo) return;
  const t = by(c.flags['s4-gate'], S4_GATE);
  if (t) s.insertAfter('Morning. Your Nubbins are up before you. The gate is stuck.', t);
};

/** Chapter 4's "what are the lanterns for?", remembered when the fourth lantern lights itself. */
const C4_LAMPS: Record<string, BandText> = {
  remember: {
    main: 'You told Moss the lanterns were for remembering. Somebody, somewhere, has remembered the way.',
    sprout: 'You said lanterns help us remember. Someone remembered the way.',
  },
  home: {
    main: 'You told Moss the lanterns were so people could find their way home. That is the side they would come from.',
    sprout: 'You said lanterns help people find home. Someone is coming home.',
  },
  together: {
    main: 'You told Moss the lanterns were so nobody stands in the dark alone. Ember still hasn’t let go of the post.',
    sprout: 'You said nobody should be alone in the dark. Ember holds on tight.',
  },
  dunno: {
    main: 'You told Moss you didn’t know what the lanterns were for. The knowing comes after, he said. It has.',
    sprout: 'You did not know what lanterns were for. Now you do.',
  },
};

/** Chapter 5's "what matters in a race?", quoted back by Corvin in his garden. */
const C5_RACE: Record<string, BandText> = {
  want: {
    main: 'You told me they should want to. Look at them. Not one has wanted anything in years. It’s very restful.',
    sprout: 'You said they should want to. Mine want nothing. It is very quiet.',
  },
  win: {
    main: 'You told me winning was the point. So we agree. That ought to worry you more than it does.',
    sprout: 'You said winning matters. So we agree. That should worry you.',
  },
  home: {
    main: '“That they come home afterwards.” I have thought about that answer more than I would like.',
    sprout: 'You said they should come home. I think about that a lot.',
  },
};

const c9Race: Payoff = (c, s) => {
  const t = by(c.flags['c5-race'], C5_RACE);
  if (t)
    s.insertAfter(
      {
        main: 'Look at them. Not one has ever thrown a race',
        sprout: 'You came.',
        reader: 'Look at them. Not one has ever bitten a judge',
      },
      t,
      'corvin',
    );
};

/** The Japanese questline's two choices (lj3's race, lj4's bentō), remembered in the done scenes. */
const LJ3_RACE: Record<string, { text: BandText; who: string }> = {
  fair: {
    who: 'byte',
    text: {
      main: 'Zero false starts. Hana: one lean. Logged as a lean.',
      sprout: 'No false starts. Hana leaned once. I wrote it down.',
    },
  },
  head: {
    who: 'hana',
    text: {
      main: 'The head start was strategic. I’d have won anyway. Strategically.',
      sprout: 'My head start was a plan. I would have won anyway.',
    },
  },
  sparks: {
    who: 'sparks',
    text: {
      main: 'I CAME SECOND. I’M TELLING EVERYONE I CAME FIRST.',
      sprout: 'I CAME SECOND. I TELL EVERYONE I CAME FIRST.',
    },
  },
};

const LJ4_BENTO: Record<string, { text: BandText; who: string }> = {
  beans: {
    who: 'hana',
    text: {
      main: 'We packed twelve beans. There are three. Nobody do the sum.',
      sprout: 'We packed twelve beans. Now there are three.',
    },
  },
  cucumber: {
    who: 'fern',
    text: {
      main: 'I’d like it noted my cucumber made the box. So did Dumpling. I’d like that noted less.',
      sprout: 'My cucumber made the box. So did Dumpling.',
    },
  },
  lettuce: {
    who: 'hana',
    text: {
      main: 'The lettuce wall held. Nothing touched anything. Except Dumpling, who touched everything.',
      sprout: 'The lettuce wall held. Only Dumpling touched everything.',
    },
  },
};

/** SR-20261026-1099: Solo's choice, heard once in the hive's dusk tune. */
const S12_SOLO: Record<string, { text: BandText; who: string }> = {
  hum: {
    who: 'narrator',
    text: {
      main: 'One note in the tune is a hair fuller than the rest. You decide it is Solo’s.',
      sprout: 'One note in the tune is a little fuller. You decide it is Solo’s.',
    },
  },
  alone: {
    who: 'narrator',
    text: {
      main: 'From the gatepost, one flat note joins in. It is a beat late, on purpose.',
      sprout: 'From the gatepost, one tiny note joins in. A bit late, on purpose.',
    },
  },
  gaps: {
    who: 'solo',
    text: {
      main: 'In for supper. Out for the stars. Is that allowed? I have decided it is.',
      sprout: 'In for supper. Out for the stars. I decided that’s allowed.',
    },
  },
};

/** SR-20261026-1102: the runner you brought, at the finish. */
const S10_RACER: Record<string, BandText> = {
  fast: {
    main: 'For the fast one, its own good time is very quick indeed. Hazel is hoarse, as threatened, and delighted about it.',
    sprout: 'The fast one zooms in first! Gran cheers till she squeaks.',
  },
  slow: {
    main: 'The slow one did stop at the last bend, to inspect a daisy. Hazel is on her second pie, as promised, and has no complaints.',
    sprout: 'The slow one stopped to sniff a daisy. Gran had a second pie!',
  },
};

/** SR-20261026-1104: how you got past the rats, as Tobin sees it. */
const S13_RATS: Record<string, BandText> = {
  fed: {
    main: 'You paid them a plum for it. They consider the matter closed.',
    sprout: 'You gave the rats a plum for it. Fair is fair!',
    reader: 'You paid them in plums for it. They consider the matter closed.',
  },
  crept: {
    main: 'One of them’s still on your boot. It’s decided it’s guarding you now.',
    sprout: 'One rat is still on your boot! Now it guards you.',
  },
};

/** SR-20261026-1141: what became of S16's five tired Nubbins, a week on in the Workyard. */
const S16_WEEK: Record<string, { text: BandText; who: string; mood?: Line['mood'] }> = {
  grove: {
    who: 'brisk',
    mood: 'happy',
    text: {
      main: 'Lug walks down to your pond every evening to check on the five. Carries nothing. Comes back humming.',
      sprout: 'Lug visits your pond every evening. He comes back humming.',
      reader:
        'Lug walks down to your pond every evening to see the five. He carries nothing. He comes back humming.',
    },
  },
  morale: {
    who: 'narrator',
    text: {
      main: 'The five lie in the hammock under a sign, MORALE OFFICERS, stacked like small lords. Morale is noticeably up.',
      sprout: 'The five snooze in the hammock. Its label says: MORALE OFFICERS.',
      reader:
        'The five lie in the hammock under a sign: MORALE OFFICERS. They are stacked like small lords. Everyone is cheerful.',
    },
  },
  wild: {
    who: 'narrator',
    text: {
      main: 'Far up the river, five small shapes sit in the reeds in the sun. Brisk lifts a hand; one lifts a paw back, and he pretends it was the wind.',
      sprout: 'Far up the river, five wild Nubbins sit in the sun. One waves!',
      reader:
        'Far up the river, five small shapes sit in the reeds in the sun. Brisk waves. One waves back, and he pretends it was the wind.',
    },
  },
};

/** SR-20261026-1141: the same five, as Hazel sees them on her first evening home. */
const S16_HAZEL: Record<string, BandText> = {
  grove: {
    main: 'Five strays asleep by my pond, doing nothing at all, and doing it beautifully. You’ve kept them well.',
    sprout: 'Five sleepy Nubbins by my pond. Good.',
  },
  morale: {
    main: 'Coming down the river path I saw Brisk Hollins’s new sign. MORALE OFFICERS. Somebody taught that man sense. I suspect you.',
    sprout: 'Brisk has a new sign. It says MORALE OFFICERS. I laughed.',
  },
  wild: {
    main: 'Coming down the valley I passed five wild Nubbins in the reeds, belonging to nobody. They looked very pleased about it.',
    sprout: 'I saw five wild Nubbins by the river. They looked happy.',
  },
};

/**
 * SR-20261026-1164: Nightjar remembers how you came up the cliff. It goes before the line
 * where she shifts off the egg, so she makes room for you first and for the egg after.
 */
const S17_APPROACH: Record<string, BandText> = {
  wait: {
    main: 'Nightjar makes room for you on the ledge before you have even sat down. Owls remember faces, and yours waited.',
    sprout: 'Nightjar makes room for you at once. She remembers you waited.',
  },
  sneak: {
    main: 'Nightjar makes you wait a long time before she makes room. Owls remember faces, and yours tried to sneak up while she was out.',
    sprout: 'Nightjar makes you wait a long time. She remembers you sneaking.',
  },
};

/** SR-20261026-1189: the museum door, free or two Shells, on opening day. */
const S18_ENTRY: Record<string, BandText> = {
  free: {
    main: 'By the door, Delve’s jar sits beside the guest book. Nobody has been seen putting anything in. Somehow it is half full.',
    sprout: 'Delve’s jar sits by the door. Nobody puts anything in. It’s half full!',
  },
  shells: {
    main: 'Children shorter than the door handle wave their free tickets like flags. Delve measures each one anyway.',
    sprout: 'Small children get in free. Delve measures every one anyway.',
  },
};

/** SR-20261026-1153: your fort's battle cry, back for round three (Gordon answers his). */
const S20_CRY: Record<string, BandText> = {
  fort: {
    main: 'Then, all together: “FOR THE FORT!” Pixel nods: still classic.',
    sprout: 'Then, all together: “FOR THE FORT!” Pixel nods.',
  },
  mittens: {
    main: 'Then, all together: “FOR WREN’S NAN’S GOOD MITTENS!” Wren holds up both thumbs.',
    sprout: 'Then, all together: “FOR WREN’S NAN’S MITTENS!” Wren holds up her thumbs.',
  },
  gordon: { main: 'Then, all together: “REMEMBER GORDON!”' },
};

/** SR-20261026-1154: how the forts became one shelter, in Tilly's (or Bodge's) words. */
const S20_MERGE: Record<string, BandText> = {
  gate: {
    main: 'You kicked in your own wall. For us. I’m putting that in the rules.',
    sprout: 'You kicked your own wall down. For us. That’s going in the rules.',
  },
  carried: {
    main: 'You carried a whole wall across a war. In mittens. That’s showing off.',
    sprout: 'You carried a whole wall here. In mittens. That’s showing off.',
  },
};

/** SR-20261026-1152: S20's round two, as one of Tilly's home-made badges. */
const S20_ROUND2: Record<string, { text: BandText; mood: Line['mood'] }> = {
  waited: {
    mood: 'happy',
    text: {
      main: 'And Honour. It’s worth one point. Pixel wrote it on page forty-two, so it counts.',
      sprout: 'I nearly got Honour, at the snow fort. Pixel gave me one point.',
    },
  },
  pressed: {
    mood: 'think',
    text: {
      main: 'And Sore Loser. I made that one myself, after the snow fort. I’ve stopped wearing it. Mostly.',
      sprout: 'I made a Sore Loser badge at the snow fort. I don’t wear it.',
    },
  },
};

/** SR-20261026-1151: how the Lair ended, in Tilly's greeting ("sat" keeps the written line). */
const S14_LAIR: Record<string, BandText> = {
  rolled: {
    main: 'It’s you. From Keeps & Critters. You rolled the torn die. It still isn’t a number.',
    sprout: 'It’s you! You rolled my torn die! It’s still not a number.',
  },
  asked: {
    main: 'It’s you. From Keeps & Critters. You asked what the dragon wanted. I worked it out. Me.',
    sprout: 'It’s you! You asked what my dragon wanted. I know now. Me.',
  },
};

/** SR-20261026-1144: the shed lesson, as Clank holds Spindle's ladder. */
const S21_LESSON: Record<string, BandText> = {
  step: {
    main: 'Announcement: you said everybody needs a hand with a step. A ladder is a lot of steps. I am the hand.',
    sprout: 'You said everyone needs help with steps. I’ll be the help!',
    reader:
      'Announcement: you said everybody needs help with a step. A ladder is a lot of steps. I am the help.',
  },
  sit: {
    main: 'Announcement: you said just being here is the whole thing. I have checked. It still is. Also, I am holding a ladder.',
    sprout: 'You said just being here is enough. So I’m here. Holding a ladder!',
    reader:
      'Announcement: you said just being here was the whole thing. I checked. It still is. Also, I am holding a ladder.',
  },
};

/** SR-20261026-1150: your verdict on Byte in S21, kept as a column in his log. */
const S21_BYTE: Record<string, BandText> = {
  fair: {
    main: 'You told me once I had a point about Clank. I keep a column for points now. It’s short. That’s the idea.',
    sprout: 'You said I was right about Clank. I keep a list of those.',
    reader:
      'You told me once that I had a point about Clank. Now I keep a column for points. It is short, on purpose.',
  },
  unfair: {
    main: 'You told me once I wasn’t fair to Clank. I added a column. It says: days old, factor in.',
    sprout: 'You said I wasn’t fair to Clank. Now I ask how old things are.',
    reader:
      'You told me once that I was not fair to Clank. So I added a column. It says: how many days old? Count that in.',
  },
};

/** S28's three log scenes open on the same line; Byte's column goes straight after it. */
const byteLog: Payoff = (c, s) => {
  const t = by(c.flags['s21-byte'], S21_BYTE);
  if (t)
    s.insertAfter(
      {
        main: 'That night Byte writes it up.',
        reader: 'That night Byte writes it up.',
        sprout: 'That night, Byte writes in his notebook.',
      },
      t,
      'byte',
      'think',
    );
};

/** SR-20261027-1196: what you did at the cage, answered by Fairweather once she has her proof. */
const S24_CAGE: Record<
  string,
  Array<{ text: BandText; who: string; mood?: Line['mood']; mainOnly?: boolean }>
> = {
  argue: [
    {
      text: {
        main: 'Somebody told me tonight that the bird owed nobody proof. I was cross about it for an hour.',
        reader:
          'You told me the bird owed nobody proof. I was cross about it for an hour. You were right.',
        sprout: 'You said the bird owes nobody proof. You were right.',
      },
      who: 'augusta',
      mood: 'soft',
    },
  ],
  sit: [
    // Main has room for her look first (`mainOnly`); the bands fold it into her line.
    {
      text: {
        main: 'She looks at you. You sat by her cage and said nothing, and she has clearly been arguing with that all night.',
      },
      who: 'narrator',
      mainOnly: true,
    },
    {
      text: {
        main: 'Most annoying argument I ever lost.',
        reader:
          'You sat by my cage and said nothing. I argued with that all night. Most annoying argument I ever lost.',
        sprout: 'You sat by the cage and said nothing. That was the best answer.',
      },
      who: 'augusta',
      mood: 'soft',
    },
  ],
};

/** SR-20261027-1250: what you said to Nova halfway up S22's Chimney, back on S24's far ridge. */
const S22_CHIMNEY_CAIRN: BandText = {
  // On the Chimney it was "isn't a reason to let go"; at the cairn she turns it round.
  main: 'She’s gone. That’s true. It still isn’t a reason to hang on. You said it the other way round, halfway up a chimney.',
  sprout: 'Gran Hazel is gone. That’s true. Up here, it’s all right to let go.',
};
const S22_CHIMNEY_ROCK: BandText = {
  main: 'She looks up. Not at the drop. At you, the way she did halfway up the Tooth.',
  // The reader's lesson sits between the anchor and this line, so it names her.
  reader: 'Nova looks up. Not at the drop. At you, the way she did halfway up the Tooth.',
  sprout: 'Nova looks up. Not at the dark. At you.',
};

/** SR-20261027-1200: S26's bulbs, come up (or not) in Linnet's bed. Narration, then Linnet. */
const S26_BULBS: Record<string, Array<{ text: BandText; who: string; mood?: Line['mood'] }>> = {
  snowdrops: [
    {
      text: {
        main: 'In Linnet’s bed they stand in a dead straight row, exactly where she put them.',
        sprout: 'Linnet’s snowdrops stand in a straight row.',
      },
      who: 'narrator',
    },
    {
      text: {
        main: 'First. Told you. Before anybody was ready for them.',
        sprout: 'First! I told you!',
      },
      who: 'linnet',
      mood: 'happy',
    },
  ],
  crocus: [
    {
      text: {
        main: 'Linnet’s crocuses have not come up, not one. She has had words with the bed.',
        reader: 'Linnet’s purple crocuses have not come up yet, not one. She has told the bed off.',
        sprout: 'Linnet’s crocuses are not up yet.',
      },
      who: 'narrator',
    },
    {
      text: {
        main: 'They’re purple and they’re late. They’ll be loud when they get here.',
        sprout: 'They are late. They will be loud!',
      },
      who: 'linnet',
      mood: 'think',
    },
  ],
  mix: [
    {
      text: {
        main: 'In Linnet’s bed the snowdrops have won by a month. She has declared it a heat.',
        reader:
          'In Linnet’s bed the snowdrops came up first, a month ahead. She says that was only the first race.',
        sprout: 'In Linnet’s bed, the snowdrops won the race!',
      },
      who: 'narrator',
    },
  ],
};

/**
 * The bed lines go after the Nubbin's scattered snowdrops, not straight after "Snowdrops.":
 * there the main scene's next line, "The rest are everywhere", would read as the crocuses.
 * The reader's lifted scene and the sprout's have no Nubbin line, so they name their own.
 */
const bulbs =
  (reader: string, sprout: string): Payoff =>
  (c, s) => {
    const t = by(c.flags['s26-bulbs'], S26_BULBS);
    if (!t) return;
    const anchor = { main: 'Your Nubbin’s. It can’t count and it can’t plant', reader, sprout };
    // Each insert lands straight after the anchor, so the last line goes in first.
    for (const l of [...t].reverse()) s.insertAfter(anchor, l.text, l.who, l.mood);
  };

/** SR-20261027-1201: how you first met Linnet, seen in her mum on the garden's last day. */
const S26_HELLO: Record<string, { text: BandText; who: string; mood?: Line['mood'] }> = {
  asked: {
    text: {
      main: 'Her mum reaches for the chair handles, stops, and asks first. Linnet looks at you as if you taught her that.',
      reader:
        'Linnet’s mum reaches for the chair handles, then stops and asks first. Linnet looks at you as if you taught her that.',
      sprout: 'Linnet’s mum asks before she pushes. Linnet looks at you and smiles.',
    },
    who: 'narrator',
  },
  agree: {
    text: {
      main: 'Mum. Nothing in this valley is flat. The Keeper agrees. It’s official.',
      sprout: 'Mum, nothing here is flat. The Keeper says so too!',
    },
    who: 'linnet',
    mood: 'happy',
  },
  walk: {
    text: {
      main: 'Her mum starts to say “Mind yourself”, looks at Linnet, and says “Nice ramp” instead.',
      reader:
        'Linnet’s mum starts to say “Mind yourself”. Then she looks at Linnet, and says “Nice ramp” instead.',
      sprout: 'Linnet’s mum nearly says “Be careful!” She says “Nice ramp!” instead.',
    },
    who: 'narrator',
  },
};

const linnetHello: Payoff = (c, s) => {
  const t = by(c.flags['s26-hello'], S26_HELLO);
  if (t)
    s.insertBefore(
      {
        main: 'Linnet’s mum sits on Hush’s bench with Tobin',
        reader: 'Linnet’s mum sits on Hush’s bench with Tobin',
        // The sprout scenes have no chin line; hers goes before the robin.
        sprout: 'The robin lives with you now.',
      },
      t.text,
      t.who,
      t.mood,
    );
};

/** SR-20261027-1201: the bit of earth you gave Linnet, as Hazel finds it in chapter 12. */
const S26_PLOT: Record<string, BandText> = {
  sun: {
    main: 'In the sunny corner, a bed strung out dead straight. Hazel approves of the string.',
    reader:
      'In the sunny corner there is a little bed, marked out with dead straight string. Hazel likes the string.',
    sprout: 'A little bed in the sunny corner. Hazel likes it.',
  },
  rose: {
    main: 'Under the oldest rose, a bed strung out dead straight, keeping it company.',
    reader:
      'Under the oldest rose there is a little bed, marked out with straight string, keeping the rose company.',
    sprout: 'A little bed sits by the oldest rose.',
  },
  hers: {
    main: 'A stick in the sunny corner says MINE. Underneath, smaller: SOMEBODY SAID SO.',
    sprout: 'A stick in the corner says MINE.',
  },
};

/** c12-wall-garden plays spliced into c12-open, so both keys carry it (the anchor is found by its words). */
const linnetPlot: Payoff = (c, s) => {
  const t = by(c.flags['s26-plot'], S26_PLOT);
  if (t)
    s.insertAfter(
      {
        main: 'Bare roses, pruned. Snowdrops round the bench',
        reader: 'Bare roses, pruned. Snowdrops round the bench',
        sprout: 'Roses. Snowdrops. A bench. A robin!',
      },
      t,
    );
};

/** SR-20261027-1276: the lead player's greeting after Q55's finale. */
const Q55_REACTION: Record<string, BandText> = {
  boo: {
    main: 'You! The booer! Take the sad mask. You’ve earned it.',
    sprout: 'You booed! Have the sad mask.',
  },
  cheer: {
    main: 'Our fan! Take both masks. Take three. We only have two.',
    sprout: 'Our fan! Have both masks!',
  },
  storm: {
    main: 'Our new ending! Next week the Keeper doesn’t slip. Well. Slips less.',
    sprout: 'Next week, the Keeper does not slip!',
  },
};

export const CHOICE_PAYOFFS: Record<string, Payoff> = {
  's7-week': (c, s) => {
    // SR-20261026-1088: the player who asked about the lever, before it is pulled.
    if (c.flags['s7-lever'] === true)
      s.insertAfter(
        {
          main: 'It isn’t something he wanted to be right about.',
          reader: 'It isn’t something he wanted to be right about.',
          sprout: 'Moss told me. And I didn’t listen.',
        },
        {
          main: 'You asked about the lever. Nobody asks about the lever. I’ve thought about that all week.',
          sprout: 'You asked about the lever. Nobody asks! I thought about it all week.',
        },
        'pixel',
        'sad',
      );
  },
  's7-lap': (c, s) => {
    // SR-20261026-1137: the stopwatch you had him put down, still in the grass.
    if (c.flags['s7-watch-down'] === true)
      s.insertBefore(
        {
          main: 'Near dark, Null comes back',
          reader: 'Near dark, at quarter past seven',
          sprout: 'Near dark, Null climbs',
        },
        {
          main: 'The stopwatch is still face down in the grass. Byte steps over it, then goes back and steps over it again, more carefully.',
          sprout: 'The stopwatch is still face down in the grass. Byte steps over it. Twice!',
        },
      );
  },
  's12-complete': (c, s) => {
    const t = by(c.flags['s12-solo'], S12_SOLO);
    if (t)
      s.insertAfter(
        {
          main: 'At dusk it hums a tune you know',
          reader: 'At dusk it hums a tune you know',
          sprout: 'A little clay hive. It hums a tune you know!',
        },
        t.text,
        t.who,
        t.who === 'solo' ? 'happy' : undefined,
      );
  },
  's10-cheer': (c, s) => {
    const t = by(c.flags['s10-racer'], S10_RACER);
    if (t)
      s.insertAfter(
        {
          main: 'Your Nubbin crosses the line in its own good time.',
          reader: 'Your Nubbin crosses the line in its own good time.',
          sprout: 'Your Nubbin crosses the line. Gran cheers',
        },
        t,
      );
  },
  's13-sluice': (c, s) => {
    const t = by(c.flags['s13-rats'], S13_RATS);
    if (t)
      s.insertAfter(
        {
          main: 'And the cheese rind the rats were guarding.',
          reader: 'And the cheese rind the rats were guarding.',
          sprout: 'A cheese rind. The Cheese Rind of Being Brave',
        },
        t,
        'tobin',
      );
  },
  'c9-open': c9Race,
  'c9-open-sold': c9Race,
  'lj3-s2-done': (c, s) => {
    const t = by(c.flags['lj3-race'], LJ3_RACE);
    if (t)
      s.insertAfter(
        { main: 'That was a practice one.', sprout: 'That was a practice one.' },
        t.text,
        t.who,
      );
  },
  'lj4-s1-done': (c, s) => {
    const t = by(c.flags['lj4-bento'], LJ4_BENTO);
    if (t)
      s.insertAfter(
        {
          main: 'You lift the lid to check one last time. Dumpling is in the box.',
          sprout: 'You lift the lid to check. Dumpling is in the box',
          reader: 'Dumpling is in the box.',
        },
        t.text,
        t.who,
      );
  },
  'c10-dawn': (c, s) => {
    const t = by(c.flags['c4-lamps'], C4_LAMPS);
    if (t)
      s.insertAfter(
        {
          main: 'Nobody lit it.',
          sprout: '…glows. Brighter. Brighter!',
          reader: '…steadies. Brightens. Burns. Nobody lit it.',
        },
        t,
      );
  },
  's2-night': (c, s) => {
    // The reader band's s2-night doesn't line up with main's, so it names its own anchors.
    const t = by(c.flags['s2-early'], S2_EARLY);
    if (t)
      s.insertAfter(
        {
          main: 'Get down. Listen.',
          reader: 'Get down. Listen.',
          sprout: 'Night in Luna’s garden.',
        },
        t,
        'luna',
        'think',
      );
    if (c.flags['s2-carried'] === true)
      s.insertAfter(
        {
          main: 'He bit the hand that carried him, Clover.',
          reader: 'He bit the hand that carried him, Clover.',
          sprout: 'Wisp is cold and scared.',
        },
        {
          main: 'She points at your hand. You put it in your pocket.',
          sprout: 'Luna points at your hand. Wisp bit it once!',
        },
      );
    else if (c.flags['s2-carried'] === false)
      s.insertAfter(
        {
          main: 'He was cold. I’d have bitten too.',
          reader: 'He was cold. I’d have bitten too.',
          sprout: 'Wisp is cold and scared.',
        },
        {
          main: 'I’ve decided the mark is a badge.',
          sprout: 'Wisp bit me once. I call it my badge.',
        },
        'clover',
        'happy',
      );
  },
  's19-climb': (c, s) => {
    const t = by(c.flags['s1-pace'], S1_PACE);
    if (t) s.insertAfter('He rides inside, against your chest', t, 'moss', 'soft');
  },
  's26-bench': (c, s) => {
    if (c.flags['s1-asked-why'])
      s.insertAfter(
        'Linnet puts her brake on',
        {
          main: 'You asked me once why I chose Hazel. She fidgeted a whole winter and never asked me to speak. You’re doing it now.',
          sprout: 'You asked why I chose Hazel. She waited. You are waiting too.',
          reader:
            'You asked me once why I chose Hazel. She fidgeted all winter and never asked me to speak. You are doing the same.',
        },
        'moss',
        'soft',
      );
    else if (c.flags['s1-sat'])
      s.insertAfter(
        'Linnet puts her brake on',
        {
          main: 'You sat in Hazel’s place by the pond, once, without fuss. You have the knack of benches.',
          sprout: 'You sat in Hazel’s spot once. You are good at sitting.',
        },
        'moss',
        'happy',
      );
  },
  's30-party': (c, s) => {
    const t = by(c.flags['s3-seat'], S3_SEAT);
    if (t) s.insertAfter('Your Nubbin copies every bounce', t);
  },
  's28-for-byte': (c, s) => {
    const t = by(c.flags['s3-byte'], S3_BYTE);
    if (t) s.insertAfter('That’s a Nubbin. Why have you brought me a Nubbin?', t, 'byte', 'think');
  },
  's23-stove': (c, s) => {
    const t = by(c.flags['s3-shown'], S3_SHOWN);
    if (t) s.insertAfter('Ember’s kitchen, tonight', t);
  },
  's19-marina': (c, s) => {
    const t = by(c.flags['s4-swim'], S4_SWIM);
    if (t) s.insertAfter('The high pass? In midwinter?', t, 'marina', 'happy');
  },
  's10-letter': stuckGate,
  's10-letter-told': stuckGate,
  's18-fossils': (c, s) => {
    const t = by(c.flags['s5-carry'], S5_CARRY);
    if (t) s.insertAfter('Fossil used to sit right there while I dug.', t, 'dusty', 'soft');
  },
  's18-shore': (c, s) => {
    const t = by(c.flags['s5-holder'], S5_HOLDER);
    if (t)
      s.insertAfter('And the tide comes back whether you’re ready or not.', t, 'marina', 'soft');
  },
  's16-week': (c, s) => {
    // The reader band folds the first two lines into one, so every band names its anchor.
    const t = by(c.flags['s16-tired'], S16_WEEK);
    if (t)
      s.insertAfter(
        {
          main: 'The saws stop for fruit at eleven and at three.',
          reader: 'A week later the Workyard is louder, and slower. The saws stop',
          sprout: 'Someone has hung up a hammock!',
        },
        t.text,
        t.who,
        t.mood,
      );
  },
  's10-step': (c, s) => {
    const t = by(c.flags['s16-tired'], S16_HAZEL);
    if (t)
      s.insertAfter(
        {
          main: 'Sit. Not there. There. I like to see the pond.',
          reader: 'Sit. Not there. There. I like to see the pond.',
          sprout: 'Sit. There. I like to see the pond.',
        },
        t,
        'hazel',
        'happy',
      );
  },
  's17-hatching': (c, s) => {
    const t = by(c.flags['s17-approach'], S17_APPROACH);
    if (t)
      s.insertBefore(
        {
          main: 'The wind has dropped.',
          reader: 'The wind has dropped.',
          sprout: 'The egg is rocking.',
        },
        t,
      );
  },
  's18-complete': (c, s) => {
    const t = by(c.flags['s18-entry'], S18_ENTRY);
    if (t)
      s.insertAfter(
        {
          main: 'Children press their noses to the trilobite.',
          reader: 'Children press their noses to the trilobite.',
          sprout: 'Children press their noses on the trilobite',
        },
        t,
      );
  },
  's19-sit': (c, s) => {
    // SR-20261026-1190: s19-sit plays on every route; Moss is only there on his.
    if (c.flags['s19-with'] === 'moss')
      s.insertAfter(
        {
          main: 'You wait. Your feet go cold, then numb',
          reader: 'Your feet go cold.',
          sprout: 'You wait. Your feet get cold.',
        },
        {
          main: 'Beside you, Moss does what he does when he is very still, which is look like a stone with opinions.',
          sprout: 'Beside you, Moss sits still as a stone. A stone with opinions.',
        },
      );
  },
  's20-counters': (c, s) => {
    const cry = c.flags['s20-cry'];
    const t = by(cry, S20_CRY);
    if (!t) return;
    const anchor = {
      main: 'Your fort answers with its battle cries.',
      reader: 'Your fort answers with its battle cries.',
      sprout: 'Your fort shouts back:',
    };
    // Each insert goes straight after the anchor, so Gordon's answer goes in first.
    if (cry === 'gordon') s.insertAfter(anchor, { main: 'Still here.' }, 'gordon');
    s.insertAfter(anchor, t);
  },
  's20-count': (c, s) => {
    // Without S14 the other commander is Bodge, who plays Tilly's lines; these fit both.
    const t = by(c.flags['s20-merge'], S20_MERGE);
    if (t)
      s.insertAfter(
        {
          main: 'That’s my wall, in our roof.',
          reader: 'That’s my wall, in our roof.',
          sprout: 'That bit of the roof is mine.',
        },
        t,
        'tilly',
      );
  },
  's24-badges': (c, s) => {
    // Tilly was the other commander at the snow fort only if S14 came first; else Bodge.
    if (!c.flags.s14Done) return;
    const t = by(c.flags['s20-round2'], S20_ROUND2);
    if (t)
      s.insertAfter(
        {
          main: 'I need a badge. I’ve got Knots (Mostly)',
          reader: 'I need a badge. I’ve got Knots (Mostly)',
          // The sprout lesson counts four badges, so this goes after the list, not in it.
          sprout: 'Knots. Brave at the Dentist.',
        },
        t.text,
        'tilly',
        t.mood,
      );
  },
  's24-stowaway-knows': (c, s) => {
    const t = by(c.flags['s14-lair'], S14_LAIR);
    if (t)
      s.swapText(
        {
          main: 'It’s you. From Keeps & Critters. You sat next to the dragon.',
          sprout: 'It’s you! You played my dragon game!',
        },
        t,
      );
  },
  's27-carry-clank': (c, s) => {
    const t = by(c.flags['s21-lesson'], S21_LESSON);
    if (t)
      s.insertAfter(
        {
          main: 'Announcement! I cannot climb!',
          reader: 'Announcement! I cannot climb!',
          sprout: 'I can’t climb! I have one wheel!',
        },
        t,
        'clank',
        'happy',
      );
  },
  's24-proof': (c, s) => {
    const t = by(c.flags['s24-cage'], S24_CAGE);
    if (!t) return;
    const anchor = {
      main: 'Fairweather’s hand comes up off her knee',
      reader: 'Fairweather’s hand comes up off her knee',
      sprout: 'Fairweather lifts her hand.',
    };
    // Each insert lands straight after the anchor, so the last line goes in first.
    for (const l of [...t].reverse())
      if (!l.mainOnly || s.band === 'main') s.insertAfter(anchor, l.text, l.who, l.mood);
  },
  's24-cairn': (c, s) => {
    if (c.flags['s22-chimney'] === 'true')
      s.insertAfter(
        {
          main: 'I’m leaving them here. Up here, where she never got to.',
          reader: 'I’m leaving them here. Up here, where she never got to.',
          sprout: 'I’ll leave them here, in a pile of stones.',
        },
        S22_CHIMNEY_CAIRN,
        'nova',
        'soft',
      );
  },
  's24-rock': (c, s) => {
    if (c.flags['s22-chimney'] === 'look')
      s.insertAfter(
        {
          main: 'I grabbed the pack. She was right there',
          reader: 'I grabbed the pack. Tilly was right there',
          sprout: 'I grabbed my bag, not Tilly.',
        },
        S22_CHIMNEY_ROCK,
      );
  },
  's26-snowdrops': bulbs('Your Nubbin’s. It can’t count', 'Your Nubbin hid those.'),
  's26-snowdrops-lifted': bulbs(
    'Snowdrops, all round Hush’s bench, and wherever',
    'Snowdrops! Little white flowers, all round the bench.',
  ),
  's26-complete': linnetHello,
  's26-complete-post': linnetHello,
  's26-complete-door': linnetHello,
  'c12-wall-garden': linnetPlot,
  'c12-open': linnetPlot,
  's27-tam': (c, s) => {
    // SR-20261027-1199: on the sold path Nine was yours. After the trough line, so "either"
    // has something to follow; the sprout's second line doesn't repeat its anchor's words.
    if (c.flags['s27-sold'] !== true) return;
    const anchor = {
      main: 'He fills Nine’s trough, and Nine doesn’t look round.',
      reader: 'He fills Nine’s trough, and Nine doesn’t look round.',
      sprout: 'Hob fills Nine’s bowl. Nine doesn’t look round.',
    };
    s.insertAfter(anchor, {
      main: 'Nine doesn’t look round for that, either.',
      sprout: 'Nine stays quiet. Maybe it heard. Maybe not.',
    });
    s.insertAfter(anchor, {
      main: 'You know its other name. You say it under your breath.',
      sprout: 'You know its real name. You say it very quietly.',
    });
  },
  's28-logged': byteLog,
  's28-logged-unverified': byteLog,
  's28-logged-none': byteLog,
  // Avatar pack (review 2026-10-27-2): fun-quest flags, read only inside the same pack.
  'q46-complete': (c, s) => {
    // SR-20261027-1275: the warning-bell cart finally gets to ring.
    if (c.flags['q46-cart'] !== 'bell') return;
    s.insertAfter(
      {
        main: 'He bounces off. The cart doesn’t move.',
        reader: 'He bounces off. The cart doesn’t move.',
        sprout: 'Boing! He bounces off.',
      },
      {
        main: 'The bell goes TING. The merchant puts a hand on his heart: thirty-one carts, and not one of them ever said TING.',
        reader: 'The bell goes TING. Thirty-one carts, and not one of them ever said TING before.',
        sprout: 'The bell goes TING! The merchant is very happy.',
      },
    );
  },
  'q47-complete': (c, s) => {
    // SR-20261027-1273: Pemba does tell everyone. Last line in first.
    if (c.flags['q47-tuk-pemba'] !== true) return;
    const anchor = {
      main: 'Strategically.',
      reader: 'Strategically.',
      sprout: 'I hummed to be brave.',
    };
    s.insertAfter(
      anchor,
      { main: 'Both hands. Strategically.', sprout: 'That was a plan.' },
      'tuk',
    );
    s.insertAfter(
      anchor,
      {
        main: 'And you held my hand! Everybody! Tuk held my hand!',
        sprout: 'And you held my hand! Everybody!',
      },
      'pemba',
      'happy',
    );
  },
  'q48-complete': (c, s) => {
    // SR-20261027-1272: the promise to tell the clans, or Nalu catching up with them.
    const truth = c.flags['q48-truth'];
    if (truth !== 'kept' && truth !== 'told') return;
    const anchor = {
      main: 'What? They’re sharing socks now.',
      reader: 'What? They’re sharing socks now.',
      sprout: 'Look! They’re sharing socks now!',
    };
    if (truth === 'told') {
      // The clans already know, so Nalu's "Pemba!" becomes her catching up. The sprout
      // scene has no Nalu line; its narrator says it instead.
      s.swapText(
        { main: 'Pemba!', reader: 'Pemba!', sprout: 'They talk and laugh.' },
        {
          main: 'They knew all along, and they kept it anyway. I need to sit down.',
          sprout: 'They talk and laugh. They knew it was pretend all along!',
        },
      );
      return;
    }
    s.insertAfter(
      anchor,
      { main: 'After the bridge. Maybe after the pudding.', sprout: 'After the pudding.' },
      'pemba',
    );
    s.insertAfter(
      anchor,
      { main: 'Pemba! You promised to tell them.', sprout: 'You promised, Pemba!' },
      'nalu',
    );
  },
  'q55-complete': (c, s) => {
    // SR-20261027-1276: the Players greet you by how you took their finale.
    const t = by(c.flags['q55-reaction'], Q55_REACTION);
    if (!t) return;
    s.insertAfter(
      {
        main: 'Take a mask or two!',
        reader: 'Take a mask or two!',
        sprout: 'Take a mask! We do the show again',
      },
      t,
      'ember-bay-players',
    );
  },
};
