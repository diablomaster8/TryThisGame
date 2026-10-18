/**
 * Payoffs for the small choices in S1, S3, S4 and S5 (review 2026-10-18, goal 9). Each of
 * those choices set a flag nothing read; here each one is remembered by a single line in a
 * scene three or more stories later, so every choice changes something the player sees.
 * The lines go in through the same line swaps as the scene notes' (`sceneFor`), with words
 * for the Learning Grove's two bands, whose S1–S5 versions set the same flags.
 *
 *   s1-pace      (walk | offered | asked)   S19, Moss riding up the pass in your coat
 *   s1-sat       / s1-asked-why             S26, Moss on Hush's bench
 *   s3-seat      (gap | sun | moon)         S30, Dimple's party
 *   s3-byte      (science | nicely)         S28, the Nubbin at Byte's door
 *   s3-shown     (together | apart)         S23, Ember's kitchen
 *   s4-swim      (with | trust)             S19, Marina in the tide pool
 *   s4-gate      (lift-push | nubbin | note) S10, the stuck gate on Hazel's first morning home
 *   s5-carry     (egg | shoulder)           S18, Dusty at the cliff
 *   s5-holder    (yours | marina)           S18, Marina at the rock pools
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
  insertAfter(anchor: string, text: BandText, who?: string, mood?: Line['mood']): void;
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

export const CHOICE_PAYOFFS: Record<string, Payoff> = {
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
