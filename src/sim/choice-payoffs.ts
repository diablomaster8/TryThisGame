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
  insertAfter(anchor: string | BandText, text: BandText, who?: string, mood?: Line['mood']): void;
  insertBefore(anchor: string | BandText, text: BandText, who?: string, mood?: Line['mood']): void;
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
    main: 'You waded in after your Nubbins once, in spring, and came out blue. Wear the socks.',
    sprout: 'You jumped in the cold water once. Wear warm socks!',
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
};
