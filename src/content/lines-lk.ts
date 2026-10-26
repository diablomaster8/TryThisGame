/**
 * Learning Grove line LK1–LK10: Mouse-Deer (Part M, rank 39).
 *
 * SOURCE. The Sang Kancil (Malay) / Si Kancil (Indonesian) tales: traditional folk tales of the
 * mouse-deer, told across Malaysia, Indonesia, Singapore and Brunei. Rights: traditional, public
 * domain. Every tale is retold in our own words; no written edition, translation, film or
 * picture book is followed or quoted.
 *
 * AUDIENCE. 'all'. This is a Learning Grove line: it is offered only when the Learning Grove is
 * on, and there is no main-game version. The base script (LINE_LK) is the plain, warm telling the
 * sim falls back to; LINE_LK_EDU carries the two bands (sprout 3–6, reader 7–10) for every
 * scene, and LINE_LK_EDU_VARIANTS the bands' versions of the six variant scenes.
 *
 * FRAME. At summer's end, after chapter 6, two old friends arrive with a shadow screen and a box
 * of leather puppets: Mak Cik Siti from Melaka (Malaysia) and Bu Wulan from Yogyakarta
 * (Indonesia), whose puppets are in the style of wayang kancil, the Javanese mouse-deer shadow
 * theatre. They set up by the pond at dusk and tell one tale per quest, in order. You are the
 * stagehand and the audience. Your Nubbin plays Kancil behind the screen, silent; Siti and Wulan
 * voice every animal, so no animal speaks in the Grove: the puppets do (speaker ids lk-kancil,
 * lk-buaya and so on are the puppets, voiced by whichever teller is telling). In LK3 and LK10 the
 * Grove's Nubbins float in a line across the stream as the crocodiles, and your Nubbin hops along
 * them. Pixel (she/her) rigs a second lamp for the last night (LK10), and her husband Byte (he/him,
 * canon 38) brings a bucket of sand and the word "Probably"; they are guests here, Pixel is not
 * player two: this line is not an Arcade cartridge.
 *
 * GROVE FLAGS READ: none (the outline's "Reads: none").
 *
 * FLAGS WRITTEN (all prefixed lk-; never a Grove flag):
 *   - lk-first = siti | wulan (LK1, lk01-names): whose way you hear the tales first. Pays off in
 *     LK7 (the other teller tells the cucumber tale: lk07-garden for siti, lk07-garden-wulan for
 *     wulan, where Siti tells it) and LK10 (the count's leading language: lk10-count for siti,
 *     lk10-count-wulan). Variant ids carry the flag VALUE they answer (src/sim/atlas.ts variantFor).
 *   - lk-croc = thanks | sorry | laughed (LK3, lk03-turn): the signature choice. Pays off in LK4
 *     (lk04-grab-laughed for laughed, lk04-grab-sorry for sorry) and, seven quests later, in LK10 (lk10-line-laughed: the
 *     Nubbin crocodiles won't line up until you help Kancil ask nicely). Sprout leaves out
 *     "laughed" (defaultChoice thanks).
 *   - lk-pit = pit-stuck | pit-ramp (LK9, lk09-ending): the old ending or the helping one. Reader
 *     keeps both; sprout always helps (defaultChoice ramp). It plays out inside LK9 and is read once
 *     more in LK10 (lk10-complete-pit-ramp for pit-ramp; lk10-complete, with the girl's twig ramp,
 *     for pit-stuck). The values are prefixed so S26's s26-steps = ramp can never pick an LK variant.
 *   - lk-done (LK10 complete).
 *
 * LIFTED TEXT: none. The tales are traditional and retold in our own words; the Learning Grove
 * never quotes, so no childLines are needed. Language on screen (to check with Malay and
 * Indonesian advisers): the numbers 1–10 in Malay (8 = lapan) and Indonesian (8 = delapan);
 * Sang Kancil / Si Kancil; buaya (crocodile, both); Pak Tani (Mr Farmer, Indonesian); Mak Cik
 * (auntie, Malay) and Bu (from Ibu, Indonesian); kuih (Malay) and kue (Indonesian); wayang,
 * wayang kancil and wayang kulit (Kelantan).
 *
 * CARE NOTES.
 *   - Kancil belongs to both countries, and to Singapore and Brunei too. He is never called only
 *     Malaysian or only Indonesian. Siti and Wulan disagree warmly, and both are right.
 *   - Some versions have Kancil act for King Sulaiman (the Prophet Solomon). The puppets only say
 *     "the King", and no king is ever shown or voiced. In LK8 Kancil warns of "a tiger in the
 *     pool" rather than "the King in the river", so a king is never pictured as a reflection.
 *   - Siti wears a tudung. Food at the shows is kuih (Siti) and kue (Wulan); no pork anywhere.
 *     Clothes, the lamp and the puppets need advisers from both countries; wayang is shown with
 *     respect, never as a costume.
 *   - Sprout keeps peril to a splash: crocodiles are hungry and grumpy, never shown biting (they
 *     "catch" or "hold" a leg), the tiger only gets wet, and the pit ends with everyone out.
 *   - Tricks are discussed, not celebrated: every tale has a thinking question about fairness.
 */
import type {
  EduBand,
  EduDomain,
  EduQuest,
  EduScene,
  GlossaryEntry,
  Lesson,
  LessonOption,
  Quest,
  QuestStep,
  Reward,
  Speaker,
} from './types';
import type { Choice, Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');
const PX = say('pixel');
const BY = say('byte');
const SI = say('lk-siti');
const WU = say('lk-wulan');
const KA = say('lk-kancil');
const BU = say('lk-buaya');
const KE = say('lk-kerbau');
const SN = say('lk-siput');
const HA = say('lk-harimau');
const GA = say('lk-gajah');
const PT = say('lk-pak-tani');

// ---------------------------------------------------------------- speakers

const SPEAKERS_LK: Speaker[] = [
  { id: 'pixel', name: 'Pixel', kind: 'keeper' },
  { id: 'byte', name: 'Byte', kind: 'keeper' },
  {
    id: 'lk-siti',
    name: 'Mak Cik Siti',
    kind: 'other',
    basedOn: 'A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition',
  },
  {
    id: 'lk-wulan',
    name: 'Bu Wulan',
    kind: 'other',
    basedOn: 'A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)',
  },
  { id: 'lk-kancil', name: 'Kancil', kind: 'other', basedOn: 'Sang Kancil / Si Kancil, the mouse-deer (a puppet)' },
  { id: 'lk-buaya', name: 'Crocodile', kind: 'other', basedOn: 'Buaya, the crocodile of the Kancil tales (a puppet)' },
  { id: 'lk-kerbau', name: 'Buffalo', kind: 'other', basedOn: 'Kerbau, the water buffalo of the Kancil tales (a puppet)' },
  { id: 'lk-siput', name: 'Snail', kind: 'other', basedOn: 'The snail who races Kancil (a puppet)' },
  { id: 'lk-harimau', name: 'Tiger', kind: 'other', basedOn: 'Harimau, the tiger of the Kancil tales (a puppet)' },
  { id: 'lk-gajah', name: 'Elephant', kind: 'other', basedOn: 'Gajah, the elephant in the pit tale (a puppet)' },
  { id: 'lk-pak-tani', name: 'Pak Tani', kind: 'other', basedOn: 'Pak Tani, the farmer in Kancil and the cucumbers (a puppet)' },
];

// ---------------------------------------------------------------- main-script helpers

/** Every main scene (and variant) by id, so the edu bands can reuse their lines and choices. */
const MAIN = new Map<string, Scene>();
const sc = (id: string, lines: Line[], choices?: Choice[]): Scene => {
  const s: Scene = choices ? { id, lines, choices } : { id, lines };
  MAIN.set(id, s);
  return s;
};
const mainScene = (id: string): Scene => {
  const s = MAIN.get(id);
  if (!s) throw new Error(`lines-lk: no main scene ${id}`);
  return s;
};
const step = (id: string, goal: string, hint: string, check: string, scene: Scene, done?: Scene): QuestStep =>
  done ? { id, goal, hint, check, scene, done } : { id, goal, hint, check, scene };
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const WHERE = 'The pond at dusk, by the shadow screen (Learning Grove only)';
const WHEN =
  'After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats';

const quest = (
  n: number,
  title: string,
  tale: string,
  steps: QuestStep[],
  complete: Scene,
  notes: string,
  rewards: Reward[] = [],
  sets?: Quest['sets'],
): Quest => ({
  id: `lk${String(n).padStart(2, '0')}`,
  code: `LK${n}`,
  title,
  source: `Sang Kancil tales (traditional; Malaysia and Indonesia): ${tale}`,
  audience: 'all',
  trigger: { where: WHERE, when: WHEN },
  ...(n > 1 ? { requires: [`LK${n - 1}`] } : {}),
  speakers: SPEAKERS_LK,
  steps,
  complete,
  rewards,
  ...(sets ? { sets } : {}),
  notes,
});

// ================================================================ LK1 The Shadow Screen
const LK1 = quest(
  1,
  'The Shadow Screen',
  'the storytellers and the mouse-deer',
  [
    step(
      'lk01-s1',
      'Help Siti and Wulan put up their shadow screen by the pond.',
      'Take the second pole by the pond and hold it steady while the cloth is tied.',
      'build:lk-shadow-screen',
      sc('lk01-dusk', [
        N('Summer is nearly over. At dusk, two women come down the lane with a long roll of white cloth and a wooden box.'),
        N('They stop at the pond and study it the way builders study a wall.'),
        SI('This is the spot. Flat ground, still water, and a bank for the children to sit on.', 'happy'),
        SI('I’m Siti. The little ones call me Mak Cik Siti, which means Auntie Siti. I’m from Melaka, in Malaysia.'),
        WU('And I’m Wulan. Bu Wulan, to be polite. I’m from Yogyakarta, in Indonesia.'),
        WU('We met on a boat forty years ago, and we’ve argued ever since.', 'happy'),
        SI('Lovingly.'),
        WU('Mostly lovingly. Will you hold that pole while Siti ties the cloth?'),
        N('Your Nubbin takes the other pole without being asked. The pole is taller than it by quite a lot.'),
      ]),
      sc('lk01-lamp', [
        N('The screen goes up. Wulan lights a lamp behind it, and the cloth glows warm gold.'),
        SI('There. Tight as a drum.', 'happy'),
        WU('It sags on the left.'),
        SI('It does not sag.'),
        N('It sags, a little, on the left. Your Nubbin tilts its head to match.'),
        N('Your Nubbin walks between the lamp and the cloth. Its shadow stretches across the screen, enormous.'),
        N('It stares at the giant shadow, then waves. The shadow waves back.'),
        WU('Shadows are honest. They copy you exactly, only bigger or smaller.'),
        WU('Here. Try it with a puppet.'),
      ]),
    ),
    step(
      'lk01-s2',
      'Meet the mouse-deer puppet and choose whose way to hear the tales first.',
      'Talk to Siti or Wulan by the screen.',
      'choose:lk-first-teller',
      sc(
        'lk01-names',
        [
          N('Siti opens the box. Inside are flat leather puppets on sticks: a crocodile, a tiger, an elephant, a snail.'),
          N('Last of all she lifts out a tiny deer with thin legs and a clever face. It fits in her hand.'),
          SI('This is Sang Kancil, the mouse-deer. The smallest animal in the forest, and the cleverest.', 'happy'),
          WU('Si Kancil.', 'think'),
          SI('Sang Kancil. That’s what my grandmother called him.'),
          WU('And mine called him Si Kancil, and she was never wrong about anything, including the weather.'),
          SI('He belongs to both of us. To Singapore and Brunei too. To every child who ever heard him.', 'soft'),
          WU('Fine. But somebody has to tell the first tale.'),
          N('They both look at you. So does your Nubbin, which has climbed into the puppet box.'),
        ],
        [
          ch(
            'siti',
            'Siti’s way first: Sang Kancil.',
            [SI('Sang Kancil it is. Wulan, you may sulk.', 'happy'), WU('I never sulk. I wait.', 'think')],
            { 'lk-first': 'siti' },
          ),
          ch(
            'wulan',
            'Wulan’s way first: Si Kancil.',
            [
              WU('Si Kancil it is. Siti, you can do the crocodile voices.', 'happy'),
              SI('I always do the crocodile voices. Nobody else can.', 'think'),
            ],
            { 'lk-first': 'wulan' },
          ),
        ],
      ),
    ),
  ],
  sc('lk01-complete', [
    N('Wulan hands the little puppet to your Nubbin. It holds it up to the lamp very carefully, as if it might wake.'),
    WU('One tale at a time. Your Nubbin will be Kancil behind the screen. Small, quick, and no talking.'),
    SI('We’ll do the talking. We’re very good at it.', 'happy'),
    N('Your Nubbin nods, solemn. It has never been better suited to a part.'),
    WU('Come back at dusk. Bring the children. Bring the whole valley, if it fits on the bank.'),
    SI('And bring an appetite. I make kuih.', 'happy'),
  ]),
  'Staging: dusk by the pond. The screen is a white cloth on two bamboo poles with a lamp behind; the ' +
    'shadow puppets are flat, cut leather on sticks in the wayang kancil style (adviser needed for the ' +
    'puppets, the lamp and both women’s clothes; Siti wears a tudung). The lk-first choice decides who ' +
    'tells LK7’s cucumber tale and which language leads LK10’s count. The Kancil puppet becomes a held ' +
    'item for your Nubbin.',
  [
    {
      id: 'lk-kancil-puppet',
      kind: 'item',
      label: 'Kancil shadow puppet',
      description: 'A small leather mouse-deer on a stick. Your Nubbin can “play” it by any lamp. One-time.',
    },
  ],
);

// ================================================================ LK2 Kancil Is Hungry
const LK2 = quest(
  2,
  'Kancil Is Hungry',
  'Kancil and the fruit across the river',
  [
    step(
      'lk02-s1',
      'Watch the first tale from the bank: Kancil is hungry.',
      'Come to the pond at dusk and sit on the bank.',
      'watch:lk-shadow-play:hungry',
      sc('lk02-hungry', [
        N('Dusk again. The lamp is lit, and the bank is full of valley children sitting on their hands to keep still.'),
        SI('Long ago, in the forest, when the rains were late, Kancil woke up hungry.', 'soft'),
        N('Your Nubbin trots the puppet across the screen. Its shadow hops, quick and light.'),
        KA('My tummy is growling louder than a tiger. Somebody find me breakfast.', 'sad'),
        WU('Kancil looked everywhere. The bushes were bare. The berries were gone.'),
        KA('And over there, across the river, the trees are heavy with fruit. Ripe and sweet and swinging.', 'happy'),
        SI('But the river was wide, and Kancil was small. And the river was full of crocodiles.', 'think'),
        N('Siti slides a long, lumpy shadow along the bottom of the screen, then another. The children go very quiet.'),
      ]),
      sc('lk02-ripples', [
        N('Wulan flicks water from the pond onto the screen. The shadow river ripples.'),
        WU('Rivers in the forest are never empty. Fish, frogs, birds and crocodiles, all of them hungry too.'),
        KA('Then I shall have to be clever. Being big isn’t an option.', 'think'),
      ]),
    ),
    step(
      'lk02-s2',
      'Go and look at the stream with your Nubbin: how could a small deer get across?',
      'Walk down to the stream that runs into the pond.',
      'explore:lk-stream',
      sc('lk02-plan', [
        N('The tale stops there. Wulan leans out from behind the screen.'),
        WU('Every good tale has a question in the middle. How does a very small deer cross a very big river?'),
        SI('Don’t tell them, Wulan.'),
        WU('I’m not telling them. I’m asking them.', 'happy'),
        N('A boy at the front says Kancil should swim, and a girl says build a boat. Somebody says “ask a bird”.'),
        SI('All good ideas. Come back at dusk and see what Kancil does.', 'happy'),
        N('Your Nubbin is already at the stream, staring at the far side the way Kancil stared at the fruit.'),
      ]),
    ),
  ],
  sc('lk02-complete', [
    N('The children walk home arguing about boats.'),
    SI('That’s how you know a tale is working. They take it home with them.', 'soft'),
    WU('My grandmother stopped every tale on a question. We never slept.', 'happy'),
    N('Your Nubbin is still at the stream, counting something on its fingers.'),
  ]),
  'Staging: the river is a strip of blue-grey shadow along the bottom of the screen; Wulan flicks real ' +
    'pond water at it for ripples. The tale deliberately stops on the question; LK3 answers it.',
);

// ================================================================ LK3 Counting the Crocodiles
const LK3 = quest(
  3,
  'Counting the Crocodiles',
  'Kancil counts the crocodiles',
  [
    step(
      'lk03-s1',
      'Watch Kancil call the crocodiles to the bank.',
      'Sit on the bank at dusk for the second tale.',
      'watch:lk-shadow-play:crocodiles',
      sc('lk03-river', [
        SI('Kancil walked right up to the edge of the river, where the water was dark and still.', 'soft'),
        KA('Crocodiles! Crocodiles of the river! Wake up! I have a message from the King!', 'happy'),
        N('Siti raises the crocodile puppet. It has a great many leather teeth and a very grumpy eye.'),
        BU('Who is shouting? Some of us were asleep. Some of us were dreaming about lunch.', 'angry'),
        KA('The King wants to know how many crocodiles live in this river. Every single one. I’ve come to count you.'),
        BU('Count us? Nobody has ever counted us.', 'think'),
        KA('Then line up from this bank to that one, nose to tail, so I don’t miss anyone.'),
        BU('Hmm. Well. If it’s for the King.', 'think'),
        N('One by one, shadow crocodiles slide out across the screen, until there is a bumpy bridge from side to side.'),
      ]),
      sc('lk03-lined', [
        N('Siti stops. She looks out at the pond, then at the Grove’s Nubbins splashing in the shallows.'),
        SI('Do you know, I think this tale wants to be played for real.', 'happy'),
        N('The Nubbins look at each other. Then, one at a time, they float out into the stream and line up, nose to tail.'),
      ]),
    ),
    step(
      'lk03-s2',
      'Count the crocodiles as your Nubbin hops across the line.',
      'Your Nubbin hops from back to back across the stream; count each hop.',
      'walk:lk-crocodile-line:10',
      sc('lk03-count', [
        N('Ten Nubbins bob in a line across the stream, all pretending very hard to be crocodiles.'),
        N('One of them practises a grumpy face. It mostly looks sleepy.'),
        WU('Kancil steps onto the first back. Count with him, everyone!'),
        N('Your Nubbin hops onto the first Nubbin, wobbles and holds out its arms. Then it hops again.'),
        SI('One, two, three, four, five!', 'happy'),
        WU('Six, seven, eight, nine, ten!', 'happy'),
        N('Ten hops, and your Nubbin lands on the far bank with a squelch and a look of enormous pride.'),
        SI('Now in my language. Satu, dua, tiga, empat, lima, enam, tujuh, lapan, sembilan, sepuluh!'),
        WU('Mine is the same, all but one. Satu, dua, tiga, empat, lima, enam, tujuh, delapan, sembilan, sepuluh!'),
        SI('Lapan.', 'think'),
        WU('Delapan.', 'think'),
        N('The children shout both, very loudly, at once.'),
      ]),
      sc('lk03-over', [
        KA('Ten crocodiles! The King will be delighted. And look at that, I seem to be on the other side.', 'happy'),
        BU('Wait. Was that counting? Or was that crossing?', 'shock'),
        N('Behind the screen, Siti laughs so hard the crocodile puppet shakes.'),
      ]),
    ),
    step(
      'lk03-s3',
      'Decide what Kancil does on the far bank.',
      'Talk to Siti and Wulan by the screen.',
      'choose:lk-croc',
      sc(
        'lk03-turn',
        [
          WU('So. Kancil is safe on the far bank, with the fruit trees right behind him.', 'soft'),
          WU('And ten crocodiles are in the water, slowly working out that there was no count, and no King waiting.'),
          SI('Our grandmothers told this next part differently. So does everybody.'),
          SI('So you tell us. What does Kancil do?', 'think'),
          N('Your Nubbin stands on the far bank holding the puppet, waiting to be told.'),
          N('Out in the stream, ten Nubbins wait too, still being crocodiles.'),
        ],
        [
          ch(
            'thanks',
            'Kancil turns back and says thank you.',
            [
              KA('Thank you, crocodiles! That was the best bridge in the whole forest.', 'happy'),
              BU('Well. You’re welcome, I suppose.', 'think'),
              N('In the stream, the Nubbin crocodiles look very pleased with themselves.'),
            ],
            { 'lk-croc': 'thanks' },
          ),
          ch(
            'sorry',
            'Kancil says sorry for the trick.',
            [
              KA('Crocodiles, I’m sorry. There was no count. I was hungry and scared, and I tricked you.', 'sad'),
              BU('Hmph. At least you said so.', 'think'),
              N('The Nubbin crocodiles bob about, thinking it over.'),
            ],
            { 'lk-croc': 'sorry' },
          ),
          ch(
            'laughed',
            'Kancil laughs and runs off into the trees.',
            [
              KA('Ha! Silly crocodiles! Too slow, too slow!', 'happy'),
              BU('Come back here, you little...!', 'angry'),
              N('The Nubbin crocodiles splash, very offended. One of them sulks under a lily pad.'),
            ],
            { 'lk-croc': 'laughed' },
          ),
        ],
      ),
    ),
  ],
  sc('lk03-complete', [
    N('The Nubbins paddle back to the shallows, very pleased with themselves for being such good crocodiles.'),
    SI('Ten crocodiles, ten hops. Some tales are made of numbers.', 'happy'),
    WU('Leave a bridge across the stream. The children will want to count it again.', 'happy'),
    N('By morning someone has painted ten flat stones with grumpy crocodile faces and set them in a line across the stream.'),
    N('Your Nubbin crosses on them twice, nodding once at every stone.'),
  ]),
  'The centrepiece, a big scene. Staging for lk03-count: ten Grove Nubbins float in a line across the ' +
    'stream (pull extra from the roster or the wild if fewer than ten live in the Grove) and the player’s ' +
    'Nubbin hops back to back; each hop ticks the counter. The Malay and Indonesian counts need native-' +
    'speaker audio. lk-croc is the signature choice: laughed changes LK4 (lk04-grab-laughed) and LK10 ' +
    '(lk10-line-laughed). Sprout offers only thanks and sorry.',
  [
    {
      id: 'lk-croc-stones',
      kind: 'decor',
      label: 'Crocodile stepping-stones',
      description: 'Ten flat stones painted with grumpy crocodile faces, set across the Grove’s stream. One-time.',
    },
  ],
);

// ================================================================ LK4 The Crocodile Remembers
const LK4 = quest(
  4,
  'The Crocodile Remembers',
  'Kancil and the stick',
  [
    step(
      'lk04-s1',
      'Watch Kancil go down to the river for a drink.',
      'Sit on the bank at dusk for the third tale.',
      'watch:lk-shadow-play:stick',
      sc('lk04-grab', [
        WU('Some days later, Kancil was thirsty, so he went down to the river for a drink.'),
        N('Your Nubbin bends the puppet down to the shadow water. Its little nose nearly touches the ripples.'),
        N('A long shadow slides up underneath, and snap! The crocodile puppet has Kancil by the leg.', 'shock'),
        BU('I remember you. You’re the one who counted us.', 'think'),
        BU('You were polite about it, I’ll give you that. But a crocodile still has to eat.', 'think'),
        KA('Oh, crocodile. Is that my leg you’ve caught?', 'think'),
        KA('That isn’t my leg at all! That’s an old stick. Silly crocodile, you’ve caught a stick!', 'happy'),
        N('The crocodile lets go, quick as anything, and snaps at a stick floating past.'),
      ]),
      sc('lk04-free', [
        N('Kancil is up the bank and gone before the crocodile notices it’s chewing a stick.'),
        BU('...This is a stick.', 'shock'),
        SI('It certainly is.', 'happy'),
        N('The crocodile spits out the stick and glares at it, as if the stick had lied.'),
      ]),
    ),
    step(
      'lk04-s2',
      'Find a stick by the pond and lay it beside your Nubbin’s leg.',
      'Sticks wash up at the edge of the pond. Pick one up and bring it to the screen.',
      'find:lk-stick:long',
      sc('lk04-stick', [
        N('After the tale, Wulan holds up the crocodile puppet and looks it in the eye.'),
        WU('Poor thing. Tricked twice. I’d be cross too.', 'soft'),
        SI('Kancil had to save himself. A crocodile had him by the leg!', 'think'),
        WU('I didn’t say he was wrong. I said I’d be cross.'),
        N('The children argue about it all down the bank. Your Nubbin goes looking for a stick to compare with its own leg.'),
        SI('Bring it here. Let’s see if a crocodile could really mix them up.', 'happy'),
      ]),
    ),
  ],
  sc('lk04-complete', [
    N('Your Nubbin lays the stick beside its leg. The stick is much longer, and a lot less wriggly.'),
    WU('So it wasn’t a very good stick to mistake for a leg.', 'happy'),
    SI('The crocodile was hungry. Hungry makes everyone silly.'),
    N('The crocodile puppet goes back into the box looking, if anything, slightly embarrassed.'),
  ]),
  'VARIANT: if lk-croc = laughed, play lk04-grab-laughed (LINE_LK_VARIANTS) in place of lk04-grab: the ' +
    'crocodile is much crosser. If lk-croc = sorry, lk04-grab-sorry: the apology has been bothering it ever ' +
    'since. Otherwise (thanks) lk04-grab, where it grumbles that Kancil was polite. ' +
    'Staging: the crocodile “has” the leg; no teeth meet anything, and no biting is shown.',
);

// ================================================================ LK5 The Buffalo and the Crocodile
const LK5 = quest(
  5,
  'The Buffalo and the Crocodile',
  'Kancil judges between the buffalo and the crocodile',
  [
    step(
      'lk05-s1',
      'Watch the buffalo help the crocodile out from under a log.',
      'Sit on the bank at dusk for the fourth tale.',
      'watch:lk-shadow-play:log',
      sc('lk05-log', [
        SI('One day a great storm blew through the forest, and a tree fell across the riverbank.', 'soft'),
        N('Siti drops a long shadow log across the screen. Underneath it, the crocodile puppet thrashes its tail.'),
        N('Tonight Wulan does the crocodile. It comes out as a very small squeak.'),
        BU('Help! Help! I’m stuck under this log and I can’t get out!', 'sad'),
        SI('Wulan. We have talked about this.', 'think'),
        WU('It’s a frightened crocodile.'),
        SI('It’s a frightened mouse.'),
        WU('It’s a crocodile having a mouse sort of day.', 'happy'),
        N('Wulan brings on the buffalo, slow and heavy, with wide curved horns.'),
        KE('Poor crocodile. Hold still. I’ll get you out.', 'soft'),
        N('The buffalo wedges a long branch under the log and leans on the other end with its horns. The log rolls away.'),
        BU('Free! Thank you, buffalo. I promise I will never forget this.', 'happy'),
        N('Snap! The crocodile grabs the buffalo by the leg.', 'shock'),
        KE('You promised!', 'shock'),
        BU('I promised not to forget. I haven’t. I remember you perfectly. You look delicious.', 'think'),
      ]),
      sc('lk05-judge', [
        N('Your Nubbin trots Kancil onto the screen, and the children cheer as if he were a famous footballer.'),
        KE('Kancil! Kancil! Tell this crocodile it isn’t fair!', 'sad'),
        KA('Hmm. I can’t judge something I haven’t seen. Show me exactly how it was, from the beginning.', 'think'),
      ]),
    ),
    step(
      'lk05-s2',
      'Help Kancil see exactly how things were: put the log back where it lay.',
      'Roll the shadow log back across the screen when the crocodile is in place.',
      'place:lk-log:screen',
      sc('lk05-before', [
        BU('It was like this. I was lying here, and the log was on top of me.', 'think'),
        KA('On top of you? Show me. I can’t picture it.', 'think'),
        N('Grumbling, the crocodile lets go of the buffalo’s leg and crawls back to where it was.'),
        KA('And the log? Where exactly was the log?'),
        N('The buffalo rolls the log back, right on top of the crocodile. Thump.'),
        BU('Like this! You see? Now judge!', 'angry'),
        KA('I see perfectly. Buffalo, you may go home. Crocodile, you were stuck when this began, so stay as you began.', 'think'),
        N('The buffalo walks home slowly, on all four legs. The crocodile thinks it over under the log.'),
      ]),
    ),
  ],
  sc('lk05-complete', [
    WU('Kancil didn’t trick anyone in that one. He only asked to see it properly.', 'think'),
    SI('The crocodile tricked itself. It was so sure it was right, it climbed back under.', 'happy'),
    N('A small girl asks if the crocodile stays there forever.'),
    WU('Until somebody kind comes along. Let’s hope it says thank you properly that time.', 'soft'),
  ]),
  'Staging: the log is a long shadow on a stick that the player rolls back in step 2. The branch used as a ' +
    'lever in lk05-log should be visible: the reader band’s lesson is about it.',
);

// ================================================================ LK6 The Race with the Snails
const LK6 = quest(
  6,
  'The Race with the Snails',
  'Kancil races the snails',
  [
    step(
      'lk06-s1',
      'Watch Kancil boast to a snail.',
      'Sit on the bank at dusk for the fifth tale.',
      'watch:lk-shadow-play:snail',
      sc('lk06-boast', [
        WU('Kancil had begun to boast. He was getting rather pleased with himself. Too pleased.', 'think'),
        KA('I am the cleverest animal in the forest. And the fastest. Probably the handsomest.', 'happy'),
        N('Wulan holds up the snail puppet. It is round and patient and very, very small.'),
        KA('Look at you, snail. You’re so slow, the moss grows on you while you walk!', 'happy'),
        N('On the bank some children laugh, and a few don’t. A small boy at the back looks down at his own feet.'),
        SN('I may be slow. But I’ll race you, Kancil. Along the river, all the way to the big rock.', 'think'),
        KA('Race me? A snail? This will take no time at all.', 'happy'),
      ]),
      sc('lk06-line', [
        N('Behind the screen, Wulan whispers something to the snail puppet. Siti hides a smile.'),
        SI('That night the snail told all its cousins. And every snail in the river came out to help.', 'soft'),
      ]),
    ),
    step(
      'lk06-s2',
      'Watch the race along the riverbank.',
      'Help Siti set the ten snail puppets along the bottom of the screen.',
      'watch:lk-shadow-play:race',
      sc('lk06-race', [
        N('Siti sets ten little snail puppets along the bottom of the screen, far apart, like posts in a fence.'),
        KA('Ready, snail? Go!', 'happy'),
        N('Your Nubbin whips the Kancil puppet along the screen. After a while it stops for breath.'),
        KA('Ha! Where are you, slow snail?', 'happy'),
        SN('Here I am, just ahead of you!', 'happy'),
        N('Your Nubbin runs again, faster and further.'),
        KA('Where are you now, snail?', 'shock'),
        SN('Still ahead of you!', 'happy'),
        N('Ten times Kancil runs, and ten times a snail answers just ahead of him, until he flops down on the bank, worn out.'),
        KA('All right. All right! You win. I give up.', 'sad'),
      ]),
    ),
  ],
  sc('lk06-complete', [
    WU('Ten snails along the bank, and not one of them moved a step.', 'happy'),
    SI('Kancil tricked the crocodiles with counting. The snails tricked Kancil with counting. It comes round, doesn’t it?', 'think'),
    N('The small boy at the back is smiling now. He has been helping Wulan move the snails.'),
    WU('Slow isn’t silly. Slow is just slow. And a lot of slow friends together can be very quick indeed.', 'soft'),
  ]),
  'Staging: the ten snails sit at even spacing (the reader band treats them as one every 5 metres, 5 m to ' +
    '50 m). Every snail is a different snail; each answers from just ahead of Kancil.',
);

// ================================================================ LK7 The Cucumber Garden
const LK7 = quest(
  7,
  'The Cucumber Garden',
  'Kancil and Pak Tani’s cucumbers',
  [
    step(
      'lk07-s1',
      'Watch the tale of the cucumber garden.',
      'Sit on the bank at dusk for the sixth tale.',
      'watch:lk-shadow-play:cucumbers',
      sc('lk07-garden', [
        N('Tonight Wulan sits at the lamp. She has brought a new puppet: a farmer in a wide straw hat.'),
        WU('Five tales of waiting. I did not sulk once.', 'happy'),
        SI('She sulked on Tuesday.'),
        WU('I waited loudly on Tuesday. This is the tale I heard before any other. Kancil and the cucumbers.', 'soft'),
        WU('There was a farmer called Pak Tani, and he grew the best cucumbers in the whole village.'),
        PT('My cucumbers! Somebody has been eating my cucumbers again!', 'angry'),
        N('Your Nubbin creeps the Kancil puppet along the bottom of the screen, nibbling an invisible cucumber.'),
        WU('So Pak Tani made a scarecrow, and he painted it all over with sticky sap from a tree.'),
        KA('Who’s this, standing in the garden? Out of my way, please. I’m busy eating.', 'happy'),
        N('Kancil pushes the scarecrow, and his hoof sticks. He pushes with the other, and that sticks too.', 'shock'),
        PT('Got you, cucumber thief!', 'angry'),
        N('A small brown dog trots in, sits down, and watches with great interest.'),
        SI('Wait, wait. That’s not how my grandmother told it.', 'think'),
      ]),
      sc('lk07-endings', [
        N('The two of them have a short, polite, very fierce whisper behind the screen.'),
        WU('In the old tale, Kancil tricks the farmer’s dog into getting stuck in his place. Then off he runs.', 'think'),
        SI('And now, mostly, children hear it the other way. Kancil says sorry and helps put the garden right.'),
        WU('Both are true. One is just older.', 'soft'),
      ]),
    ),
    step(
      'lk07-s2',
      'Help Kancil put the garden right: plant cucumber seeds by the screen.',
      'Take the seed pot by the lamp and plant it beside the screen.',
      'place:lk-cucumber-vine',
      sc('lk07-sorry', [
        SI('Tonight we’ll end it the new way.'),
        N('Kancil is still stuck fast to the scarecrow. Pak Tani stands over him with his hands on his hips.'),
        PT('Well? What have you got to say for yourself?', 'angry'),
        KA('I’m sorry, Pak Tani. I was hungry, and I took what wasn’t mine.', 'sad'),
        PT('Hmph. Sorry doesn’t grow cucumbers.', 'think'),
        KA('Then let me help you plant some more. I’m small, but I’m good at digging.', 'soft'),
        N('Pak Tani unsticks him, one hoof at a time. Together they plant three rows of seeds, four in each row.'),
        N('Behind the screen, your Nubbin is pressing real seeds into a pot by the lamp.'),
      ]),
    ),
  ],
  sc('lk07-complete', [
    N('Siti and Wulan build a little trellis of split bamboo beside the screen for the vine to climb.'),
    SI('The old ending is clever. The new ending is kind.', 'soft'),
    WU('My grandmother would say Kancil got off lightly. Then she’d give him a cucumber anyway.', 'happy'),
    N('Within a few days the vine has climbed halfway up. There is one small cucumber on it, and nobody touches it.'),
  ]),
  'PAYOFF of LK1: whoever told second tells this tale. If lk-first = siti, play lk07-garden (Wulan tells, ' +
    'Siti objects). If lk-first = wulan, play lk07-garden-wulan (LINE_LK_VARIANTS) in its place: Siti tells ' +
    'Wulan’s tale and Wulan objects. lk07-endings fits both. The old ending (the dog) is told, not shown; ' +
    'the dog itself is shown arriving in the garden so the old ending has a set-up.',
  [
    {
      id: 'lk-cucumber-trellis',
      kind: 'decor',
      label: 'Cucumber-vine trellis',
      description: 'A split-bamboo trellis by the shadow screen with a cucumber vine climbing it. One-time.',
    },
  ],
);

// ================================================================ LK8 The Tiger at the River
const LK8 = quest(
  8,
  'The Tiger at the River',
  'Kancil and the tiger in the pool',
  [
    step(
      'lk08-s1',
      'Watch the tiger corner Kancil by the water.',
      'Sit on the bank at dusk for the seventh tale.',
      'watch:lk-shadow-play:tiger',
      sc('lk08-tiger', [
        SI('Late one afternoon, Kancil was walking beside a still, quiet pool.', 'soft'),
        N('Wulan brings on the tiger puppet. It is striped and enormous, and its shadow fills half the screen.'),
        HA('Well, well. A mouse-deer. Just the right size for supper.', 'happy'),
        N('Your Nubbin backs the Kancil puppet right up to the edge of the shadow water.'),
        KA('You could eat me, tiger. But I’d be careful if I were you.', 'think'),
        HA('Careful? Of you?', 'happy'),
        KA('Not of me. Of the tiger who lives in this pool. He’s bigger than you, and he’s been watching you all along.', 'think'),
      ]),
      sc('lk08-look', [
        HA('Nonsense. Show me this tiger.', 'angry'),
        N('The tiger leans over the shadow pool. Wulan tips a second tiger puppet upside down beneath it, nose to nose.'),
        HA('Who are you? Stop copying me. ...Stop it. ...I said STOP it!', 'angry'),
        N('The tiger shakes a paw. The tiger in the water shakes a paw back.'),
        HA('Rude. And he’s got terrible manners as well.', 'angry'),
      ]),
    ),
    step(
      'lk08-s2',
      'Look at your Nubbin’s reflection in the still pond.',
      'Walk to the pond’s edge where the water is calm, and look in.',
      'inspect:lk-pond:reflection',
      sc('lk08-splash', [
        N('The tiger roars at the tiger in the water. The tiger in the water roars back, exactly the same.'),
        HA('Right. That does it.', 'angry'),
        N('Splash, the tiger leaps into the pool! Wulan flicks a cupful of real pond water over the screen.'),
        N('The tiger climbs out, soaked from ears to tail. The other tiger has vanished.'),
        HA('Where did he go? And where did that mouse-deer go?', 'shock'),
        SI('Kancil was long gone, home before the tiger had even shaken his ears.', 'happy'),
        N('On the bank, the children want to know how the second tiger came and went. Wulan points at the pond.'),
        WU('Look in. Very still. Don’t splash.', 'soft'),
      ]),
    ),
  ],
  sc('lk08-complete', [
    N('Your Nubbin leans over the edge of the pond, and another Nubbin leans up to meet it.'),
    N('It waves, and the other one waves back. It pokes the water, and the other Nubbin wobbles away in rings.'),
    WU('The tiger was fighting himself. Plenty of people do that.', 'soft'),
    SI('Nobody was hurt. The tiger only got wet, and a little embarrassed.', 'happy'),
  ]),
  'Care: in some tellings Kancil says “the King” is in the river. Here he warns of “a tiger who lives in this ' +
    'pool”, so no king is ever pictured, even as a reflection. Staging: the second tiger is the same puppet ' +
    'flipped upside down under the water line. The tiger only gets wet.',
);

// ================================================================ LK9 The Pit
const LK9 = quest(
  9,
  'The Pit',
  'Kancil, the elephant and the falling sky',
  [
    step(
      'lk09-s1',
      'Watch Kancil fall into the hunters’ pit.',
      'Sit on the bank at dusk for the eighth tale.',
      'watch:lk-shadow-play:pit',
      sc('lk09-pit', [
        SI('Kancil was running through the forest, not looking where he was going. And then, whoomp.', 'shock'),
        N('Siti sweeps a deep, dark hole across the screen. Your Nubbin drops the Kancil puppet into it.'),
        SI('It was a pit, dug by hunters, and the sides were steep and slippery.'),
        KA('Help! Hello? Anybody? Oh, this is not good.', 'sad'),
        N('Kancil jumps and jumps, but he is much too small to reach the top.'),
        N('Then the ground thumps. Wulan brings on the elephant, huge and grey, with ears like washing on a line.'),
        GA('What are you doing down there, little one?', 'think'),
        KA('Haven’t you heard, Elephant? The sky is falling! This pit is the only safe place in the forest!', 'shock'),
        GA('The sky? Falling? Make room! Make room!', 'shock'),
      ]),
      sc('lk09-out', [
        N('Thump: the elephant climbs into the pit. Kancil hops onto its back, then onto its head, and out.'),
        KA('Thank you, Elephant! Do stay as long as you like!', 'happy'),
        N('The elephant sits in the pit, looking up at the sky, which isn’t falling at all.'),
      ]),
    ),
    step(
      'lk09-s2',
      'Decide how the tale ends.',
      'Talk to Siti by the screen.',
      'choose:lk-pit-ending',
      sc(
        'lk09-ending',
        [
          N('Siti stops. She lowers the puppets and looks at them for a moment.'),
          SI('In my grandmother’s tale, it ends there. Kancil runs off, and the elephant stays in the pit.', 'soft'),
          WU('And then?', 'think'),
          SI('And then nothing. That’s where she stopped.', 'soft'),
          N('A little girl on the bank puts her hand up. She wants to know what happens to the elephant.'),
          SI('So. Do we end it the old way, or help Kancil find a way to get Elephant out?', 'think'),
        ],
        [
          ch(
            'stuck',
            'End it the old way. It’s Siti’s grandmother’s tale.',
            [
              SI('Then it ends there. Kancil was clever, and the elephant was trusting, and that was all.', 'soft'),
              N('The little girl thinks about it for a long time. Then she asks to hold the elephant puppet, and Siti lets her.'),
              WU('Old tales don’t always comfort you. Sometimes they tell you to be careful who you trust.', 'think'),
              WU('I like to think somebody kind came by later, with a rope. And a banana.', 'soft'),
            ],
            { 'lk-pit': 'pit-stuck' },
          ),
          ch(
            'ramp',
            'Help Kancil get Elephant out.',
            [
              KA('Elephant! I’m sorry. The sky isn’t falling. Wait there, I’ll get help!', 'sad'),
              N('Your Nubbin rolls six logs from the woodpile and leans them in a ramp against the shadow pit.'),
              N('The elephant climbs out, one big step at a time, while the children count the logs out loud.'),
            ],
            { 'lk-pit': 'pit-ramp' },
          ),
        ],
      ),
    ),
  ],
  sc('lk09-complete', [
    WU('That’s a hard one. A clever trick can be a cruel one, if you never look back.', 'think'),
    SI('My grandmother told it to make us careful. The children here tell it to put things right. Both are good reasons.', 'soft'),
    N('Your Nubbin puts the elephant puppet back in the box, very gently, on top of everything else.'),
  ]),
  'lk-pit: the reader band keeps both endings; sprout always helps (defaultChoice ramp, six logs). In the ' +
    'old ending nothing bad is shown happening to the elephant; the tale simply stops. Hunters are never seen.',
);

// ================================================================ LK10 The Night of Stories
const LK10 = quest(
  10,
  'The Night of Stories',
  'the last crossing',
  [
    step(
      'lk10-s1',
      'Line up the Grove’s Nubbins across the stream for the last crossing.',
      'Call your Nubbins to the stream by the shadow screen.',
      'place:lk-nubbins:crocodile-line',
      sc('lk10-line', [
        N('The last evening of summer. The whole valley is on the bank, with mats and cushions and far too much food.'),
        SI('Kuih! Who wants kuih? I made the green ones and the stripy ones.', 'happy'),
        WU('And kue from me. Same idea, different spelling, better coconut.', 'happy'),
        N('Pixel, who mends everything in the Grove, brings a second lamp. Her husband Byte follows with a bucket of sand.'),
        PX('I’ve rigged a second lamp so the people at the back can see. It won’t blow up.', 'happy'),
        BY('Probably.', 'think'),
        N('Your Nubbin is Kancil tonight, for real: no puppet, just itself in the lamplight.'),
        WU('Crocodiles! The last crossing! Line up, please!'),
        N('The Grove’s Nubbins slide into the stream at once. They remember that Kancil was kind to them.'),
        N('There are a great many of them this time: two lines side by side, nose to tail, from bank to bank.'),
      ]),
    ),
    step(
      'lk10-s2',
      'Cross the stream with your Nubbin and count every crocodile.',
      'Your Nubbin hops along one line and back along the other; count every hop.',
      'walk:lk-crocodile-line:20',
      sc('lk10-count', [
        SI('We count the way you heard it first. Ready? Satu!', 'happy'),
        N('Your Nubbin hops. The whole bank counts with it.'),
        SI('Dua, tiga, empat, lima, enam, tujuh...'),
        N('At eight the children all shout “Delapan!”, the Indonesian word, as loud as they can. Wulan bows.', 'happy'),
        SI('Lapan. Sembilan, sepuluh! And back along the second line!', 'happy'),
        N('Your Nubbin hops back along the second line, ten more, and lands on the home bank with a squelch.'),
        WU('Twenty crocodiles. The King would be delighted.', 'happy'),
      ]),
    ),
  ],
  sc('lk10-complete', [
    N('Afterwards the children sit in a heap on the bank, full of kuih and kue, and nobody wants to go home.'),
    SI('So. What did Kancil learn this summer?', 'think'),
    N('A boy says be clever, and a girl says say thank you. The small boy who helped the snails says don’t laugh at slow people.'),
    WU('All true. My grandmother would have liked you lot.', 'soft'),
    N('The little girl who held the elephant puppet has it again. It sits on a ramp she made herself, out of six twigs.'),
    WU('Siti’s grandmother stopped the tale in the pit. She never said nobody could build a ramp later.', 'soft'),
    SI('My grandmother would be furious. And then she’d help.', 'happy'),
    SI('We’re leaving the screen by the pond. It belongs here now.', 'soft'),
    WU('And we’re staying a while. We like your valley. It argues nearly as well as we do.', 'happy'),
    N('Your Nubbin sits by the screen with the little Kancil puppet and makes it hop, one, two, three, all on its own.'),
  ]),
  'PAYOFFS. LK9: if lk-pit = pit-ramp, play lk10-complete-pit-ramp in place of lk10-complete (the snail boy’s ' +
    'answer is the elephant); for pit-stuck, lk10-complete gives the elephant its twig ramp. LK3: if lk-croc = laughed, play lk10-line-laughed in place of lk10-line (the Nubbins won’t line ' +
    'up until you help Kancil ask nicely). LK1: if lk-first = wulan, play lk10-count-wulan in place of ' +
    'lk10-count (Indonesian leads; the bank shouts “Lapan!” at eight). Both variants are in LINE_LK_VARIANTS. ' +
    'Staging: twenty Nubbins in two lines (fill from wild Nubbins if the Grove has fewer). AFTER THE LINE: Siti ' +
    'and Wulan stay in the valley and can be found by the screen in the evenings, with idle lines in both ' +
    'languages (to write with the advisers, e.g. greetings, “Selamat petang” for good evening, and a count to ' +
    'ten); the screen and the stepping-stones stay. No timers: the idle lines are unlimited and give nothing.',
  [
    {
      id: 'lk-shadow-screen',
      kind: 'decor',
      label: 'The shadow screen',
      description: 'Siti and Wulan’s white screen and lamp, left by the pond for good. One-time.',
    },
    {
      id: 'lk-storytellers',
      kind: 'feature',
      label: 'Siti and Wulan stay',
      description: 'The two storytellers stay in the valley; find them by the screen in the evenings.',
    },
  ],
  { 'lk-done': true },
);

export const LINE_LK: Quest[] = [LK1, LK2, LK3, LK4, LK5, LK6, LK7, LK8, LK9, LK10];

// ---------------------------------------------------------------- variants

export const LINE_LK_VARIANTS: Scene[] = [
  // LK10, lk-pit = pit-ramp: in place of lk10-complete.
  sc('lk10-complete-pit-ramp', [
    N('Afterwards the children sit in a heap on the bank, full of kuih and kue, and nobody wants to go home.'),
    SI('So. What did Kancil learn this summer?', 'think'),
    N('A boy says be clever, and a girl says say thank you. The small boy who helped the snails says go back for the elephant.'),
    WU('All true. My grandmother would have liked you lot. The elephant one most of all.', 'soft'),
    SI('We’re leaving the screen by the pond. It belongs here now.', 'soft'),
    WU('And we’re staying a while. We like your valley. It argues nearly as well as we do.', 'happy'),
    N('Your Nubbin sits by the screen with the little Kancil puppet and makes it hop, one, two, three, all on its own.'),
  ]),
  // LK4, lk-croc = laughed: in place of lk04-grab.
  sc('lk04-grab-laughed', [
    WU('Some days later, Kancil was thirsty, so he went down to the river for a drink.'),
    N('Your Nubbin bends the puppet down to the shadow water. Its little nose nearly touches the ripples.'),
    N('A long shadow slides up underneath, and snap! The crocodile puppet has Kancil by the leg.', 'shock'),
    BU('I remember you. You’re the one who laughed at us.', 'angry'),
    BU('I’ve waited at this spot every evening since, and I haven’t stopped being cross once.', 'angry'),
    KA('Oh, crocodile. Is that my leg you’ve caught?', 'think'),
    KA('That isn’t my leg at all! That’s an old stick. Silly crocodile, you’ve caught a stick!', 'happy'),
    N('The crocodile lets go, quick as anything, and snaps at a stick floating past.'),
  ]),
  // LK4, lk-croc = sorry: in place of lk04-grab.
  sc('lk04-grab-sorry', [
    WU('Some days later, Kancil was thirsty, so he went down to the river for a drink.'),
    N('Your Nubbin bends the puppet down to the shadow water. Its little nose nearly touches the ripples.'),
    N('A long shadow slides up underneath, and snap! The crocodile puppet has Kancil by the leg.', 'shock'),
    BU('I remember you. You’re the one who said sorry.', 'think'),
    BU('Nobody says sorry to a crocodile. I’ve thought about it every day. It’s very annoying.', 'think'),
    BU('I still have to eat you. But I’ll feel odd about it.', 'sad'),
    KA('Oh, crocodile. Is that my leg you’ve caught?', 'think'),
    KA('That isn’t my leg at all! That’s an old stick. Silly crocodile, you’ve caught a stick!', 'happy'),
    N('The crocodile lets go, quick as anything, and snaps at a stick floating past.'),
  ]),
  // LK7, lk-first = wulan (Wulan's way came first, so Siti tells this one): in place of lk07-garden.
  sc('lk07-garden-wulan', [
    N('Tonight Siti sits at the lamp. She has borrowed Wulan’s new puppet: a farmer in a wide straw hat.'),
    SI('This is Wulan’s tale really. But her way came first all summer, so tonight it’s mine.', 'happy'),
    WU('There’s no crocodile in it. She’s been practising the farmer in the bath.', 'think'),
    SI('There was a farmer, Pak Tani, as Wulan calls him, and he grew the best cucumbers in the whole village.'),
    PT('My cucumbers! Somebody has been eating my cucumbers again!', 'angry'),
    N('Your Nubbin creeps the Kancil puppet along the bottom of the screen, nibbling an invisible cucumber.'),
    SI('So Pak Tani made a scarecrow, and he painted it all over with sticky sap from a tree.'),
    KA('Who’s this, standing in the garden? Out of my way, please. I’m busy eating.', 'happy'),
    N('Kancil pushes the scarecrow, and his hoof sticks. He pushes with the other, and that sticks too.', 'shock'),
    PT('Got you, cucumber thief!', 'angry'),
    N('A small brown dog trots in, sits down, and watches with great interest.'),
    WU('Wait, wait. That’s not how my grandmother told it.', 'think'),
  ]),
  // LK10, lk-croc = laughed: in place of lk10-line.
  sc('lk10-line-laughed', [
    N('The last evening of summer. The whole valley is on the bank, with mats and cushions and far too much food.'),
    SI('Kuih! Who wants kuih? I made the green ones and the stripy ones.', 'happy'),
    WU('And kue from me. Same idea, different spelling, better coconut.', 'happy'),
    N('Pixel, who mends everything in the Grove, brings a second lamp. Her husband Byte follows with a bucket of sand.'),
    PX('I’ve rigged a second lamp so the people at the back can see. It won’t blow up.', 'happy'),
    BY('Probably.', 'think'),
    N('Your Nubbin is Kancil tonight, for real: no puppet, just itself in the lamplight.'),
    WU('Crocodiles! The last crossing! Line up, please!'),
    N('The Grove’s Nubbins float in the shallows with their arms folded. Nobody lines up.'),
    SI('Ah. They remember the last time. Kancil laughed at them and ran.', 'think'),
    N('Your Nubbin looks at you. It can’t say a word, and tonight it needs some.'),
    Y('Kancil is sorry he laughed. Will you be his bridge one more time, please?', 'soft'),
    N('A long pause. Then, one by one, the Nubbins slide into two lines across the stream.'),
  ]),
  // LK10, lk-first = wulan: in place of lk10-count.
  sc('lk10-count-wulan', [
    WU('We count the way you heard it first. Ready? Satu!', 'happy'),
    N('Your Nubbin hops. The whole bank counts with it.'),
    WU('Dua, tiga, empat, lima, enam, tujuh...'),
    N('At eight the children all shout “Lapan!”, the Malay word, as loud as they can. Siti bows.', 'happy'),
    WU('Delapan. Sembilan, sepuluh! And back along the second line!', 'happy'),
    N('Your Nubbin hops back along the second line, ten more, and lands on the home bank with a squelch.'),
    SI('Twenty crocodiles. The King would be delighted.', 'happy'),
  ]),
];

export const LINE_LK_FLAGS: string[] = ['lk-first', 'lk-croc', 'lk-pit', 'lk-done'];

export const LINE_LK_CHECKS: string[] = [
  ...new Set(LINE_LK.flatMap((q) => q.steps.map((s) => s.check))),
];

// ================================================================ the Learning Grove bands

interface Meta {
  domain: EduDomain;
  skill: string;
  standard?: string;
  parentNote: string;
}
type LessonIn = Omit<Lesson, 'id'>;

/** Lesson metadata: domain, plain skill, grown-up note, and an approved standard if one fits. */
const m = (domain: EduDomain, skill: string, parentNote: string, standard?: string): Meta =>
  standard ? { domain, skill, standard, parentNote } : { domain, skill, parentNote };
const ask = (after: number, meta: Meta, prompt: Line[], options: LessonOption[]): LessonIn => ({
  ...meta,
  kind: 'ask',
  after,
  prompt,
  options,
});
const notice = (after: number, meta: Meta, lines: Line[]): LessonIn => ({ ...meta, kind: 'notice', after, lines });
const act = (after: number, meta: Meta, check: string, lines: Line[]): LessonIn => ({
  ...meta,
  kind: 'do',
  after,
  check,
  lines,
});
/** The answer the lesson teaches. */
const best = (label: string, ...reply: Line[]): LessonOption => ({ label, best: true, reply });
/** Any other answer, or any answer to a think question. */
const opt = (label: string, ...reply: Line[]): LessonOption => ({ label, reply });

const edu = (
  band: EduBand,
  of: string,
  lines: Line[],
  lessons: LessonIn[],
  choices?: Choice[],
  defaultChoice?: string,
): EduScene => {
  if (!MAIN.has(of)) throw new Error(`lines-lk: edu scene for unknown ${of}`);
  return {
    id: `${band}:${of}`,
    of,
    band,
    lines,
    ...(choices ? { choices } : {}),
    ...(defaultChoice ? { defaultChoice } : {}),
    lessons: lessons.map((l, i) => ({ id: `${band}:${of}-l${i + 1}`, ...l })),
  };
};
/** Sprout: its own short read-aloud lines. */
const sp = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[], defaultChoice?: string): EduScene =>
  edu('sprout', of, lines, lessons, choices, defaultChoice);
/** Reader: the base script's lines and every choice, with lessons woven in. */
const rd = (of: string, lessons: LessonIn[]): EduScene => {
  const s = mainScene(of);
  return edu('reader', of, s.lines, lessons, s.choices);
};
const eq = (
  band: EduBand,
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary?: GlossaryEntry[],
): EduQuest => ({ id: `${band}:${of}`, of, band, title, goals, scenes, ...(glossary ? { glossary } : {}) });
const g = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

// ---------------------------------------------------------------- sprout (3–6, read aloud)

const SPROUT: EduQuest[] = [
  eq(
    'sprout',
    'lk01',
    'The Shadow Screen',
    {
      'lk01-s1': { goal: 'Help Siti and Wulan put up the screen.', hint: 'Hold the pole by the pond.' },
      'lk01-s2': { goal: 'Meet the little mouse-deer.', hint: 'Choose who tells the first story.' },
    },
    [
      sp(
        'lk01-dusk',
        [
          N('It is evening. The sun is going down.'),
          N('Two ladies come down the lane with a big white cloth.'),
          SI('Hello! I am Mak Cik Siti. I come from Malaysia.', 'happy'),
          WU('And I am Bu Wulan. I come from Indonesia.', 'happy'),
          SI('Mak Cik means auntie.'),
          WU('And Bu is a polite name, a bit like Mrs.'),
          SI('We are old friends. We tell stories with shadows.'),
          WU('Can you hold the pole, please?'),
          N('Your Nubbin holds the other pole. The pole is much taller!'),
        ],
        [
          notice(3, m('social-studies', 'countries are places on a map', 'Your child heard about two countries, Malaysia and Indonesia, that are neighbours across the sea.', 'D2.Geo.2.K-2'), [
            SI('Malaysia and Indonesia are neighbours, with sea in between.'),
            WU('They are warm places with big green forests.', 'happy'),
          ]),
        ],
      ),
      sp(
        'lk01-lamp',
        [
          N('Up goes the screen. It is tight like a drum.'),
          N('Wulan lights a lamp behind it. The cloth glows gold.'),
          N('Your Nubbin walks past the lamp. A big shadow walks too!'),
          N('Your Nubbin waves. The shadow waves back.'),
          SI('Shadows copy you. They do what you do.', 'happy'),
        ],
        [
          act(4, m('science', 'shadows get bigger near the light', 'Your child moved a puppet nearer and further from a lamp and put the shadows in size order.', '1-PS4-2'), 'edu:order:shadows:size', [
            WU('Move the puppet near the lamp. Big shadow!'),
            WU('Now move it far from the lamp. Small shadow!'),
            N('(Help your child put the shadows in order: small, middle, big.)'),
          ]),
        ],
      ),
      sp(
        'lk01-names',
        [
          N('Siti opens a box of flat puppets on sticks.'),
          N('Here is a tiny deer with thin legs. It fits in her hand.'),
          SI('This is Sang Kancil, the mouse-deer!', 'happy'),
          WU('We say Si Kancil!', 'happy'),
          SI('Both are right. He belongs to lots of children.', 'soft'),
          WU('Who will tell the first story?'),
        ],
        [
          notice(2, m('science', 'animals live where they can find food and hide', 'Your child learned that the real mouse-deer is a tiny forest animal, not a mouse and not a deer.', 'K-ESS3-1'), [
            WU('Real mouse-deer live in warm forests. They are as small as a rabbit.'),
            SI('A mouse-deer is not a mouse or a deer. It is its own animal!', 'happy'),
          ]),
        ],
        [
          ch('siti', 'Siti tells first.', [SI('Sang Kancil it is!', 'happy'), WU('I can wait. I am good at waiting.')], {
            'lk-first': 'siti',
          }),
          ch('wulan', 'Wulan tells first.', [WU('Si Kancil it is!', 'happy'), SI('Then I will do the crocodile voices.')], {
            'lk-first': 'wulan',
          }),
        ],
      ),
      sp(
        'lk01-complete',
        [
          N('Wulan gives the little puppet to your Nubbin.'),
          N('Your Nubbin holds it up to the lamp. Very gently.'),
          WU('Your Nubbin can be Kancil. No talking. Just hopping.'),
          SI('We will do the talking. We love talking!', 'happy'),
          N('They say different names, and they are still friends.'),
        ],
        [
          ask(4, m('sel', 'friends can disagree kindly', 'Your child thought about how friends can say things differently and still be friends.', 'CASEL: Relationship skills'), [N('Siti and Wulan say different names. Are they still friends?')], [
            best('Yes, still friends!', WU('Yes! Friends can say things differently and still be friends.', 'happy')),
            opt('No, not friends.', SI('We are still friends! We just say it our own way.', 'soft')),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk02',
    'Kancil Is Hungry',
    {
      'lk02-s1': { goal: 'Watch the first story.', hint: 'Sit on the bank when the lamp is lit.' },
      'lk02-s2': { goal: 'Look at the stream with your Nubbin.', hint: 'Walk down to the water.' },
    },
    [
      sp(
        'lk02-hungry',
        [
          N('It is story time. Children sit on the bank.'),
          SI('Once upon a time, Kancil woke up hungry.', 'soft'),
          N('Your Nubbin makes the puppet hop. Hop, hop, hop.'),
          KA('My tummy is rumbling! Rumble, rumble!', 'sad'),
          WU('Across the river, the fruit is ripe and sweet.'),
          SI('But the river is wide. And it is full of crocodiles!', 'think'),
        ],
        [
          ask(3, m('science', 'what animals need to live', 'Your child named what animals need: food, water and a safe place.', 'K-LS1-1'), [WU('What does Kancil need to stay well?')], [
            best('Food, water and a safe place.', SI('Yes! Food, water and a safe place. Just like you.', 'happy')),
            opt('A hat.', WU('A hat is fun! But Kancil needs food, water and a safe place.', 'happy')),
            opt('A toy.', SI('Toys are lovely. But Kancil needs food, water and a safe place.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk02-ripples',
        [
          N('Wulan flicks pond water on the screen. Splish!'),
          N('Now the shadow river wiggles.'),
          WU('Rivers are full of life. Fish, frogs, birds and crocodiles.'),
          KA('I am small. I will have to be clever.', 'think'),
        ],
        [
          notice(2, m('science', 'animals live where they find what they need', 'Your child heard that river animals live there because the river gives them water and food.', 'K-ESS3-1'), [
            WU('Fish live in the river. It gives them water and food.'),
            N('(Ask: what lives in the water near you?)'),
          ]),
        ],
      ),
      sp(
        'lk02-plan',
        [
          WU('How can a small deer cross a big river?', 'think'),
          N('One child says swim. One says build a boat.'),
          N('One child says ask a bird to carry him.'),
          SI('Good ideas! Thank you for sharing them.', 'happy'),
          N('Your Nubbin looks at the stream. It is thinking too.'),
        ],
        [
          ask(3, m('sel', 'listening to other people’s ideas', 'Your child practised listening to everyone’s ideas, not just their own.', 'CASEL: Relationship skills'), [WU('Three children had three ideas. What do good friends do?')], [
            best('Listen to them all.', SI('Yes! We listen to every idea. Then we think.', 'happy')),
            opt('Only listen to mine.', WU('Your idea matters. Other ideas matter too. Let’s listen to them all.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk02-complete',
        [
          N('The children walk home, talking about boats.'),
          SI('That means the story is working!', 'happy'),
          N('Your Nubbin sits by the stream. It counts on its fingers.'),
          WU('Come back at dusk. Kancil has a plan.', 'happy'),
        ],
        [
          act(2, m('maths', 'count to answer how many', 'Your child counted three ideas on their fingers.', 'K.CC.B.5'), 'edu:count:ideas:3', [
            N('Swim. A boat. A bird. How many ideas?'),
            N('(Count them on your fingers together: one, two, three.)'),
            WU('Three ideas! And Kancil has another one.', 'happy'),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk03',
    'Counting the Crocodiles',
    {
      'lk03-s1': { goal: 'Watch Kancil call the crocodiles.', hint: 'Sit on the bank when the lamp is lit.' },
      'lk03-s2': { goal: 'Count the crocodiles as your Nubbin hops.', hint: 'One hop, one crocodile. Count them all!' },
      'lk03-s3': { goal: 'Choose what Kancil says.', hint: 'Talk to Siti and Wulan.' },
    },
    [
      sp(
        'lk03-river',
        [
          SI('Kancil walks up to the river.', 'soft'),
          KA('Crocodiles! Wake up! I have a message from the King!', 'happy'),
          N('Up comes a crocodile puppet. Lots of teeth, and a grumpy face.'),
          BU('Who is shouting? I was asleep!', 'angry'),
          KA('The King wants to count you. Line up, bank to bank!'),
          BU('Count us? Oh! Well, if it is for the King.', 'think'),
        ],
        [
          notice(3, m('literacy', 'a new word in another language', 'Your child learned buaya, the word for crocodile in Malay and Indonesian.', 'ELOF: Language and Communication'), [
            SI('In my language, crocodile is buaya. Boo-AH-yah.'),
            WU('In mine it is buaya too! The same word.', 'happy'),
            N('(Say it together: buaya.)'),
          ]),
        ],
      ),
      sp(
        'lk03-lined',
        [
          SI('I think this story wants to be played for real!', 'happy'),
          N('The Grove’s Nubbins float out into the stream.'),
          N('They line up, nose to tail, from bank to bank.'),
          N('One Nubbin tries a grumpy face. It looks sleepy.'),
        ],
        [
          notice(2, m('sel', 'working together', 'Your child saw that friends together can do what one alone cannot.', 'CASEL: Relationship skills'), [
            WU('Look! All the Nubbins together make a bridge.'),
            SI('One Nubbin can’t do it. Together they can!', 'happy'),
          ]),
        ],
      ),
      sp(
        'lk03-count',
        [
          N('Ten Nubbins bob in a line. They are pretend crocodiles.'),
          WU('Kancil hops on the first back. Count with him!'),
          N('Your Nubbin hops. Wobble! Hop again!'),
          N('Ten hops. Your Nubbin lands on the far bank. Squelch!'),
          SI('Now my way. Satu, dua, tiga, empat, lima!', 'happy'),
          SI('Enam, tujuh, lapan, sembilan, sepuluh!', 'happy'),
          WU('My way is the same. But eight is delapan!', 'happy'),
          N('Lapan! Delapan! The children shout both.'),
        ],
        [
          act(3, m('maths', 'count to ten', 'Your child counted ten crocodiles, one for each hop.', 'K.CC.B.5'), 'edu:count:crocodiles:10', [
            N('(Count the crocodiles together, one for each hop.)'),
            N('One, two, three, four, five, six, seven, eight, nine, ten!'),
            SI('Ten crocodiles!', 'happy'),
          ]),
          notice(6, m('literacy', 'numbers in Malay and Indonesian', 'Your child heard the numbers one to ten in Malay and Indonesian, where only eight is different.', 'ELOF: Language and Communication'), [
            SI('In Malay, eight is lapan.'),
            WU('In Indonesian, eight is delapan. The other numbers are the same!', 'happy'),
            N('(Try counting to ten in Malay together.)'),
          ]),
        ],
      ),
      sp(
        'lk03-over',
        [
          KA('Ten crocodiles! And look, I am on the other side!', 'happy'),
          BU('Wait. Was that counting? Or crossing?', 'shock'),
          N('Siti laughs so much, the puppet shakes.'),
          N('The crocodile’s mouth falls open. Oh!'),
        ],
        [
          ask(1, m('sel', 'noticing how someone else feels', 'Your child named the crocodile’s feeling: surprised.', 'CASEL: Social awareness'), [N('How does the crocodile feel now?')], [
            best('Surprised!', WU('Yes. Surprised, and a bit silly. He was tricked.', 'soft')),
            opt('Sleepy.', SI('He was sleepy before! Now his mouth is open. He is surprised.', 'happy')),
          ]),
        ],
      ),
      sp(
        'lk03-turn',
        [
          WU('Kancil is safe on the far bank.', 'soft'),
          WU('The crocodiles are in the water. They are working it out.'),
          SI('Kancil tricked them. What will he say now?', 'think'),
          N('Your Nubbin waits on the bank with the puppet.'),
        ],
        [
          notice(3, m('sel', 'thank you and sorry are kind words', 'Your child thought about saying thank you or sorry after a trick.', 'CASEL: Responsible decision-making'), [
            SI('Thank you and sorry are kind words.'),
            WU('Kind words help after a trick.', 'soft'),
          ]),
        ],
        [
          ch('thanks', 'Kancil says thank you.', [KA('Thank you, crocodiles! Best bridge ever!', 'happy'), BU('Oh. You are welcome.', 'think')], {
            'lk-croc': 'thanks',
          }),
          ch(
            'sorry',
            'Kancil says sorry.',
            [KA('Sorry, crocodiles. I tricked you. I was hungry.', 'sad'), BU('Hmph. Thank you for saying so.', 'think')],
            { 'lk-croc': 'sorry' },
          ),
        ],
        'thanks',
      ),
      sp(
        'lk03-complete',
        [
          N('The Nubbins paddle back. They were very good crocodiles.'),
          N('Next morning, there are ten flat stones in the stream.'),
          N('Each stone has a grumpy crocodile face painted on it.'),
          N('Your Nubbin hops across. One, two, three...'),
        ],
        [
          ask(3, m('maths', 'same, more or fewer', 'Your child matched ten Nubbins to ten stones and saw they were the same.', 'K.CC.C.6'), [WU('Ten Nubbins. Ten stones. More, fewer, or the same?')], [
            best('The same!', SI('The same! Ten and ten match.', 'happy')),
            opt('More stones.', WU('Let’s match them, one Nubbin for each stone. Ten and ten. The same!', 'soft')),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk04',
    'The Crocodile Remembers',
    {
      'lk04-s1': { goal: 'Watch Kancil go for a drink.', hint: 'Sit on the bank when the lamp is lit.' },
      'lk04-s2': { goal: 'Find a stick by the pond.', hint: 'Sticks float at the edge of the water.' },
    },
    [
      sp(
        'lk04-grab',
        [
          WU('One day, Kancil is thirsty. He goes to the river.'),
          N('Kancil puts his nose down to drink.'),
          N('Oh no! The crocodile catches his leg!', 'shock'),
          BU('I remember you. You were polite. But I am hungry.', 'think'),
          KA('Silly crocodile! That is not my leg. That is a stick!', 'happy'),
          N('The crocodile lets go. It grabs a stick instead.'),
        ],
        [
          notice(5, m('literacy', 'who and where in a story', 'Your child named the characters and the setting of the story.', 'RL.K.3'), [
            SI('Who is in this story? Kancil and the crocodile.'),
            WU('Where are they? By the river.', 'happy'),
            N('(Point to the river on the screen.)'),
          ]),
        ],
      ),
      sp(
        'lk04-free',
        [
          N('Kancil runs up the bank. Gone!'),
          BU('Hmm. This is a stick.', 'shock'),
          SI('It certainly is!', 'happy'),
          N('The crocodile is cross. His tail goes swish, swish.'),
        ],
        [
          ask(3, m('sel', 'naming feelings', 'Your child read the crocodile’s body to name a feeling: cross.', 'CASEL: Self-awareness'), [N('Look at his tail. Swish, swish! How does he feel?')], [
            best('Cross.', WU('Cross! He feels tricked. That is a cross feeling.', 'soft')),
            opt('Happy.', SI('A happy tail wags. A cross tail swishes. He is cross.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk04-stick',
        [
          WU('Poor crocodile. Tricked two times.', 'soft'),
          SI('But Kancil had to get away!', 'think'),
          N('Your Nubbin finds a stick by the pond.'),
          N('It puts the stick next to its leg.'),
          N('The stick sticks out past its foot. Wobble!'),
        ],
        [
          ask(4, m('maths', 'long and short', 'Your child compared a stick and a leg and said which was longer.', 'K.MD.A.2'), [SI('Which is longer, the stick or the leg?')], [
            best('The stick!', WU('Yes! The stick is long. The leg is short.', 'happy')),
            opt('The leg.', SI('Look again. The stick goes further. The stick is longer!', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk04-complete',
        [
          N('The stick is long. The leg is short. And wriggly!'),
          WU('So the stick was not much like a leg!', 'happy'),
          SI('The crocodile was hungry. Hungry makes us silly.'),
          N('The crocodile puppet goes back in the box.'),
        ],
        [
          notice(2, m('health', 'hunger can make us grumpy', 'Your child talked about how being hungry feels, and what helps.', 'CASEL: Self-management'), [
            WU('When I am hungry, I get grumpy too.'),
            SI('A snack and a sit-down help.', 'happy'),
            N('(Ask: how do you feel when you are hungry?)'),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk05',
    'The Buffalo and the Crocodile',
    {
      'lk05-s1': { goal: 'Watch the buffalo help the crocodile.', hint: 'Sit on the bank when the lamp is lit.' },
      'lk05-s2': { goal: 'Put the log back, just as it was.', hint: 'Roll the shadow log across the screen.' },
    },
    [
      sp(
        'lk05-log',
        [
          SI('A big storm blows. A tree falls down.', 'soft'),
          N('The crocodile is stuck under the log!'),
          BU('Help! Help! I can’t get out!', 'sad'),
          N('Here comes the buffalo. Big and slow, with curly horns.'),
          KE('I will help you. Push, push!', 'soft'),
          N('The log rolls away. The crocodile is free!'),
          BU('Free! Thank you, buffalo!', 'happy'),
          N('Then the crocodile holds on to the buffalo’s leg!', 'shock'),
          KE('But I helped you!', 'sad'),
        ],
        [
          ask(8, m('social-studies', 'saying thank you to helpers', 'Your child thought about thanking someone who helps, and being kind back.', 'D2.Civ.8.K-2'), [SI('The buffalo helped. What do we do when someone helps us?')], [
            best('Say thank you!', WU('Yes! Say thank you, and be kind back.', 'happy')),
            opt('Grab their leg.', SI('No! That is what the crocodile did. We say thank you instead.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk05-judge',
        [
          N('Here comes Kancil! The children cheer.'),
          KE('Kancil! Please help! It isn’t fair!', 'sad'),
          N('The crocodile and the buffalo both talk at once.'),
          KA('I must see what happened first. Show me!', 'think'),
        ],
        [
          notice(3, m('literacy', 'a new word: judge', 'Your child learned the word judge: someone who decides what is fair.'), [
            SI('A judge is someone who decides what is fair.'),
            WU('A good judge looks and listens first.', 'soft'),
          ]),
        ],
      ),
      sp(
        'lk05-before',
        [
          BU('I was lying here. The log was on top of me.', 'think'),
          KA('On top? Show me!', 'think'),
          N('The crocodile lets go of the buffalo. It crawls back.'),
          N('Thump! The log goes back on top of the crocodile.'),
          KA('Buffalo, you may go home. Crocodile, stay where you started.', 'think'),
          N('The buffalo walks home. Clip, clop.'),
        ],
        [
          ask(3, m('maths', 'positions: on top and under', 'Your child used the words on top and under.', 'K.G.A.1'), [WU('Where is the crocodile now?')], [
            best('Under the log.', SI('Yes! The crocodile is under. The log is on top.', 'happy')),
            opt('On the log.', WU('Look again. The log is on top. The crocodile is under it.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk05-complete',
        [
          N('Kancil did not trick anyone this time. He just looked carefully.'),
          N('A small girl asks: will the crocodile stay there forever?'),
          WU('No. Someone kind will come. I hope he says thank you then!', 'soft'),
          SI('Helping is kind. Saying thank you is kind too.', 'happy'),
        ],
        [
          notice(3, m('sel', 'being kind back to helpers', 'Your child thought about someone who helped them today.', 'CASEL: Relationship skills'), [
            N('(Ask: who helped you today? Did you say thank you?)'),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk06',
    'The Race with the Snails',
    {
      'lk06-s1': { goal: 'Watch Kancil meet a snail.', hint: 'Sit on the bank when the lamp is lit.' },
      'lk06-s2': { goal: 'Watch the big race.', hint: 'Help Siti put the snails along the screen.' },
    },
    [
      sp(
        'lk06-boast',
        [
          WU('Kancil is very pleased with himself. Too pleased!', 'think'),
          KA('I am the cleverest! I am the fastest!', 'happy'),
          N('Here is a snail. Small and round and slow.'),
          KA('Ha! Snail, you are so slow!', 'happy'),
          N('A little boy looks at his feet. He feels sad.'),
          SN('I am slow. But I will race you, Kancil.', 'think'),
        ],
        [
          ask(4, m('sel', 'laughing at someone hurts', 'Your child thought about why laughing at someone for being slow is unkind.', 'CASEL: Social awareness'), [SI('Is it kind to laugh at someone for being slow?')], [
            best('No, it hurts.', WU('Yes, it hurts. Look at the little boy. We can be kind instead.', 'soft')),
            opt('Yes, it is funny.', SI('Look at the boy. He is sad. Laughing at someone hurts.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk06-line',
        [
          N('Wulan whispers to the snail. Shh!'),
          SI('That night, the snail tells all its cousins.', 'soft'),
          N('Snails come out from everywhere. Slow, slow, slow.'),
          N('They carry their houses on their backs.'),
        ],
        [
          notice(3, m('science', 'snails carry their shells', 'Your child learned that a snail’s shell is its home and that it slides on one big foot.', 'ELOF: Scientific Reasoning'), [
            WU('A snail’s shell is its home. It goes everywhere with it.'),
            SI('A snail slides on one big foot. It leaves a shiny trail.', 'happy'),
          ]),
        ],
      ),
      sp(
        'lk06-race',
        [
          N('Siti puts ten snails along the river.'),
          N('Each snail hides in a different spot.'),
          KA('Ready? Go!', 'happy'),
          N('Kancil runs and runs. Then he stops.'),
          KA('Where are you, snail?', 'happy'),
          SN('Here I am! Just ahead of you!', 'happy'),
          KA('Where are you now?', 'shock'),
          SN('Still ahead of you!', 'happy'),
          N('Kancil runs ten times. He is so tired! He gives up.'),
          SI('A different snail every time! Kancil only looks for one.', 'happy'),
          N('Ten snails wave. Very slowly.'),
        ],
        [
          act(10, m('maths', 'count to ten', 'Your child counted the ten snails along the riverbank.', 'K.CC.B.5'), 'edu:count:snails:10', [
            N('(Count the snails on the screen together.)'),
            SI('Ten snails! Each one waited in its place.', 'happy'),
          ]),
        ],
      ),
      sp(
        'lk06-complete',
        [
          WU('Ten snails. Not one of them ran!', 'happy'),
          N('The little boy smiles. He helped move the snails.'),
          WU('Slow is not silly. Slow is just slow.', 'soft'),
          SI('Say it with me: Where are you? Here I am!', 'happy'),
        ],
        [
          notice(3, m('literacy', 'repeated lines in a story', 'Your child joined in with a line that repeats in the story.', 'RL.2.4'), [
            N('(Say it together: “Where are you?” “Here I am!”)'),
            WU('Stories love words that come again and again.'),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk07',
    'The Cucumber Garden',
    {
      'lk07-s1': { goal: 'Watch the cucumber story.', hint: 'Sit on the bank when the lamp is lit.' },
      'lk07-s2': { goal: 'Plant cucumber seeds by the screen.', hint: 'Take the seed pot by the lamp.' },
    },
    [
      sp(
        'lk07-garden',
        [
          WU('This is my favourite story. Kancil and the cucumbers.', 'soft'),
          WU('Pak Tani is a farmer. Pak Tani means Mr Farmer.'),
          PT('Who ate my cucumbers?', 'angry'),
          N('Kancil creeps in. Nibble, nibble, crunch!'),
          WU('Pak Tani makes a scarecrow. It is very sticky!'),
          N('Kancil pushes it. Stuck! He pushes again. Stuck again!', 'shock'),
          SI('Wait! My grandma told it differently!', 'think'),
        ],
        [
          notice(1, m('science', 'plants need water and light', 'Your child heard that cucumber plants need water and sun to grow.', '2-LS2-1'), [
            WU('Cucumbers need water and sun to grow.'),
            N('(Ask: what do plants need? Water and sun!)'),
          ]),
        ],
      ),
      sp(
        'lk07-endings',
        [
          N('Siti and Wulan whisper behind the screen.'),
          WU('In the old story, Kancil is sneaky. Somebody else gets stuck!', 'think'),
          SI('In the new story, Kancil says sorry.', 'soft'),
          WU('Both are stories. One is just older.', 'soft'),
        ],
        [
          notice(3, m('social-studies', 'stories change over time', 'Your child heard that old stories change a little each time they are told.', 'D2.His.2.K-2'), [
            SI('Grandmas told stories long ago. We tell them today.'),
            WU('Each time, a story can change a little.', 'happy'),
          ]),
        ],
      ),
      sp(
        'lk07-sorry',
        [
          PT('Well, Kancil? What do you say?', 'angry'),
          KA('I am sorry, Pak Tani. I took your cucumbers.', 'sad'),
          KA('Can I help you plant more?', 'soft'),
          N('Pak Tani unsticks Kancil. One hoof. Two hooves.'),
          N('They plant seeds together. Dig, drop, pat!'),
        ],
        [
          ask(0, m('sel', 'choosing kind words', 'Your child chose kind words for Kancil to say after doing wrong.', 'CASEL: Responsible decision-making'), [SI('What should Kancil say?')], [
            opt('Sorry.', WU('Sorry is a good start. It means: I know I did wrong.', 'soft')),
            opt('Can I help?', SI('Helping fixes things. That is kind.', 'happy')),
            opt('I won’t do it again.', WU('A promise! That is kind too.', 'happy')),
          ]),
        ],
      ),
      sp(
        'lk07-complete',
        [
          N('Siti and Wulan build a little fence for the vine to climb.'),
          N('Your Nubbin plants seeds in a pot.'),
          SI('The old ending is clever. The new ending is kind.', 'soft'),
          N('Soon there is one small cucumber. Nobody eats it!'),
        ],
        [
          act(1, m('maths', 'count objects one by one', 'Your child counted five seeds into a pot, one at a time.', 'K.CC.B.4'), 'edu:count:seeds:5', [
            N('(Count the seeds into the pot together: one, two, three, four, five.)'),
            WU('Five seeds! Maybe five little plants.', 'happy'),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk08',
    'The Tiger at the River',
    {
      'lk08-s1': { goal: 'Watch Kancil meet the tiger.', hint: 'Sit on the bank when the lamp is lit.' },
      'lk08-s2': { goal: 'Look into the still pond.', hint: 'Find a calm spot at the edge and look in.' },
    },
    [
      sp(
        'lk08-tiger',
        [
          SI('Kancil walks by a still, quiet pool.', 'soft'),
          N('Here comes the tiger! Big and stripy.'),
          HA('A mouse-deer! Just right for supper!', 'happy'),
          N('Kancil is scared. But he takes a big breath.'),
          KA('Careful, tiger. A bigger tiger lives in this pool!', 'think'),
        ],
        [
          notice(3, m('sel', 'a big breath helps when we are scared', 'Your child practised a calming breath, like Kancil.', 'CASEL: Self-management'), [
            WU('When you are scared, take a big breath. In... and out.'),
            N('(Take a big breath together.)'),
            SI('A calm mind can think of a plan.', 'soft'),
          ]),
        ],
      ),
      sp(
        'lk08-look',
        [
          HA('Show me this tiger!', 'angry'),
          N('The tiger looks in the pool.'),
          N('There is a tiger in the water! It looks back at him.'),
          HA('Grrr! Go away!', 'angry'),
        ],
        [
          notice(2, m('science', 'still water shows a reflection', 'Your child learned that still water works like a mirror.', '1-PS4-2'), [
            WU('Still water is like a mirror. You can see yourself.'),
            SI('That tiger in the water is his reflection!', 'happy'),
          ]),
        ],
      ),
      sp(
        'lk08-splash',
        [
          N('The tiger roars. The water tiger roars too.'),
          N('Splash! The tiger jumps in the pool!'),
          N('Wulan flicks real water on the screen. Splish!'),
          N('The tiger climbs out. He is very wet!'),
          HA('Where did that mouse-deer go?', 'shock'),
          SI('Kancil is home already!', 'happy'),
        ],
        [
          ask(0, m('maths', 'above and below', 'Your child used the words above and below.', 'K.G.A.1'), [WU('The real tiger is on the bank. Where is the water tiger?')], [
            best('Below, in the water.', SI('Yes! Below, and upside down.', 'happy')),
            opt('Up in a tree.', WU('Not in a tree! Look down. He is below, in the water.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk08-complete',
        [
          N('Your Nubbin looks into the pond.'),
          N('Another Nubbin looks back! It waves. Wave, wave!'),
          N('Your Nubbin pokes the water. Plip! The picture wiggles away.'),
          SI('Nobody was hurt. The tiger only got wet!', 'happy'),
        ],
        [
          ask(3, m('literacy', 'rhyming words', 'Your child found a word that rhymes with splash.', 'RF.K.2'), [WU('Splash! What rhymes with splash?')], [
            best('Crash!', SI('Splash, crash! Yes, they rhyme.', 'happy')),
            opt('Tiger.', WU('Splash, tiger? No. Splash, crash! Splash, dash!', 'happy')),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk09',
    'The Pit',
    {
      'lk09-s1': { goal: 'Watch Kancil fall into a hole.', hint: 'Sit on the bank when the lamp is lit.' },
      'lk09-s2': { goal: 'Help the elephant get out.', hint: 'Roll the logs from the woodpile.' },
    },
    [
      sp(
        'lk09-pit',
        [
          SI('Kancil is running. He is not looking. Whoomp!', 'shock'),
          N('Kancil falls into a deep hole.'),
          KA('Help! I can’t get out!', 'sad'),
          N('Kancil jumps and jumps. He is too small.'),
          N('Thump, thump. Here comes the elephant!'),
          GA('What are you doing down there, little one?', 'think'),
          KA('The sky is falling! This hole is the safe place!', 'shock'),
          N('Kancil is fibbing. The sky is not falling. Shh!'),
          GA('Oh no! Make room!', 'shock'),
          N('Whump! The elephant jumps in and sits down.'),
          N('The hole is very full.'),
          GA('Cosy!', 'happy'),
        ],
        [
          ask(3, m('sel', 'asking for help', 'Your child thought about asking for help when they are stuck.', 'CASEL: Relationship skills'), [WU('Kancil is stuck. What can you do when you are stuck?')], [
            best('Ask for help.', SI('Yes! Ask for help. Call out, or tell a grown-up.', 'happy')),
            opt('Hide.', WU('Hiding keeps you stuck. Asking for help gets you out.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk09-out',
        [
          N('Kancil is squashed. But he has an idea!'),
          N('First, Kancil hops on its back. Next, on its head. Last, out!'),
          KA('Thank you, Elephant!', 'happy'),
          N('But the elephant is still in the hole.'),
        ],
        [
          ask(1, m('literacy', 'first, next, last', 'Your child put the story in order: first, next, last.', 'RL.K.3'), [SI('What did Kancil do first?')], [
            best('Hopped on the back.', WU('Yes! First the back, next the head, last out!', 'happy')),
            opt('Climbed out.', SI('That was last! First he hopped on the elephant’s back.', 'soft')),
          ]),
        ],
      ),
      sp(
        'lk09-ending',
        [
          SI('Oh dear. Poor Elephant is stuck.', 'soft'),
          KA('Elephant, I am sorry! The sky is not falling. I will help!', 'sad'),
          N('Your Nubbin rolls logs to the screen. Roll, roll!'),
          N('The logs make a ramp. A slope to climb!'),
          N('The elephant climbs out. Step, step, step!', 'happy'),
        ],
        [
          act(3, m('maths', 'count objects to say how many', 'Your child counted six logs to build a ramp.', 'K.CC.B.4'), 'edu:count:logs:6', [
            N('(Count the logs together as they go down.)'),
            N('One, two, three, four, five, six!'),
            WU('Six logs make a good ramp.', 'happy'),
          ]),
        ],
        undefined,
        'ramp',
      ),
      sp(
        'lk09-complete',
        [
          N('Everyone is out of the hole. Everyone is safe.'),
          WU('That was a tricky one.', 'think'),
          SI('Kancil said sorry. Then he helped. That made it right.', 'soft'),
          N('Your Nubbin puts the elephant puppet in the box. Very gently.'),
        ],
        [
          notice(2, m('sel', 'sorry and helping go together', 'Your child heard that saying sorry and then helping makes things right.', 'CASEL: Relationship skills'), [
            WU('Sorry is a word. Helping is doing. Both together are best.', 'soft'),
          ]),
        ],
      ),
    ],
  ),
  eq(
    'sprout',
    'lk10',
    'The Night of Stories',
    {
      'lk10-s1': { goal: 'Line up the Nubbins across the stream.', hint: 'Call your Nubbins to the water.' },
      'lk10-s2': { goal: 'Count every crocodile!', hint: 'One hop, one crocodile. Count them all.' },
    },
    [
      sp(
        'lk10-line',
        [
          N('It is the last night of summer. Everyone is here!'),
          SI('Kuih! Who wants kuih?', 'happy'),
          WU('And kue from me! Coconut, yum!', 'happy'),
          N('Pixel brings a second lamp.'),
          N('Her husband Byte brings a bucket. Just in case!'),
          PX('I made a second lamp. So everyone can see!', 'happy'),
          N('Tonight your Nubbin is Kancil. No puppet. Just itself!'),
          WU('Crocodiles! Line up, please!'),
          N('The Nubbins float into the stream. Two lines, side by side!'),
        ],
        [
          notice(2, m('social-studies', 'food from two countries', 'Your child heard about kuih and kue, little cakes from Malaysia and Indonesia.'), [
            SI('Kuih are little cakes from Malaysia.'),
            WU('Kue are little cakes from Indonesia. Nearly the same word!', 'happy'),
          ]),
        ],
      ),
      sp(
        'lk10-count',
        [
          SI('We count my way first. Satu!', 'happy'),
          N('Your Nubbin hops. Everyone counts!'),
          SI('Dua, tiga, empat, lima, enam, tujuh...'),
          N('At eight, the children shout: Delapan!', 'happy'),
          SI('Lapan! Sembilan, sepuluh!', 'happy'),
          N('Ten more hops back on the other line. Squelch!'),
          WU('Two lines of crocodiles! Hooray!', 'happy'),
        ],
        [
          act(5, m('maths', 'count to ten, twice', 'Your child counted one line of ten crocodiles, then the other.', 'K.CC.A.1'), 'edu:count:crocodiles:20', [
            N('(Count one line together, from one to ten.)'),
            N('(Then count the other line. Ten and ten. That’s twenty crocodiles!)'),
          ]),
        ],
      ),
      sp(
        'lk10-complete',
        [
          N('The children sit on the bank, full of kuih and kue.'),
          SI('What did Kancil learn this summer?', 'think'),
          WU('We are leaving the screen by the pond. It lives here now.', 'soft'),
          SI('And we are staying for a while!', 'happy'),
          N('Your Nubbin makes the little puppet hop. One, two, three.'),
        ],
        [
          ask(1, m('sel', 'thinking about what we learned', 'Your child said what Kancil learned over the summer of stories.', 'CASEL: Self-awareness'), [N('(What do you think? Wait for an answer.)')], [
            opt('Be clever.', WU('Yes! Thinking hard helps when you are small.', 'happy')),
            opt('Say thank you.', SI('Yes! Kind words help a lot.', 'soft')),
            opt('Don’t laugh at slow friends.', WU('Yes. Slow is just slow. Be kind.', 'soft')),
          ]),
        ],
      ),
    ],
  ),
];

const SPROUT_VARIANTS: EduScene[] = [
  sp(
    'lk10-complete-pit-ramp',
    [
      N('The children sit on the bank, full of kuih and kue.'),
      SI('What did Kancil learn this summer?', 'think'),
      N('A small boy says: go back and help the elephant!'),
      WU('Yes! That one most of all.', 'soft'),
      WU('We are leaving the screen by the pond. It lives here now.', 'soft'),
      N('Your Nubbin makes the little puppet hop. One, two, three.'),
    ],
    [
      ask(2, m('sel', 'putting things right', 'Your child said why going back to help the elephant mattered.', 'CASEL: Relationship skills'), [N('Why did Kancil go back for the elephant?')], [
        best('To put it right.', WU('Yes. A trick is better when you go back and help.', 'soft')),
        opt('He was bored.', SI('Ha! No. He went back to put things right.', 'soft')),
      ]),
    ],
  ),
  sp(
    'lk04-grab-laughed',
    [
      WU('One day, Kancil is thirsty. He goes to the river.'),
      N('Kancil puts his nose down to drink.'),
      N('Oh no! The crocodile catches his leg!', 'shock'),
      BU('You laughed at us! I am very cross!', 'angry'),
      KA('Silly crocodile! That is not my leg. That is a stick!', 'happy'),
      N('The crocodile lets go. It grabs a stick instead.'),
    ],
    [
      ask(3, m('sel', 'being laughed at hurts', 'Your child thought about why the crocodile felt cross after being laughed at.', 'CASEL: Social awareness'), [N('Why is the crocodile so cross?')], [
        best('Kancil laughed at him.', WU('Yes. Being laughed at hurts. That makes him cross.', 'soft')),
        opt('He likes sticks.', SI('Ha! Maybe. But he is cross because Kancil laughed.', 'soft')),
      ]),
    ],
  ),
  sp(
    'lk04-grab-sorry',
    [
      WU('One day, Kancil is thirsty. He goes to the river.'),
      N('Kancil puts his nose down to drink.'),
      N('Oh no! The crocodile catches his leg!', 'shock'),
      BU('I remember you. You said sorry.', 'think'),
      BU('Nobody says sorry to a crocodile! I think about it every day.', 'think'),
      BU('I am still hungry. But I feel a bit odd about it.', 'sad'),
      KA('Silly crocodile! That is not my leg. That is a stick!', 'happy'),
      N('The crocodile lets go. It grabs a stick instead.'),
    ],
    [
      ask(5, m('sel', 'saying sorry is remembered', 'Your child thought about why the crocodile still remembers Kancil’s sorry.', 'CASEL: Relationship skills'), [N('Why does the crocodile remember Kancil?')], [
        best('Kancil said sorry.', WU('Yes. A sorry stays with people. Even with crocodiles.', 'soft')),
        opt('He likes sticks.', SI('Ha! Maybe. But he remembers because Kancil said sorry.', 'soft')),
      ]),
    ],
  ),
  sp(
    'lk07-garden-wulan',
    [
      SI('My turn! This is Wulan’s story, but I will tell it.', 'happy'),
      WU('There is no crocodile in it, Siti.', 'think'),
      SI('Pak Tani is a farmer. Pak Tani means Mr Farmer.'),
      PT('Who ate my cucumbers?', 'angry'),
      N('Kancil creeps in. Nibble, nibble, crunch!'),
      SI('Pak Tani makes a scarecrow. It is very sticky!'),
      N('Kancil pushes it. Stuck! He pushes again. Stuck again!', 'shock'),
      WU('Wait! My grandma told it differently!', 'think'),
    ],
    [
      notice(2, m('science', 'plants need water and light', 'Your child heard that cucumber plants need water and sun to grow.', '2-LS2-1'), [
        SI('Cucumbers need water and sun to grow.'),
        N('(Ask: what do plants need? Water and sun!)'),
      ]),
    ],
  ),
  sp(
    'lk10-line-laughed',
    [
      N('It is the last night of summer. Everyone is here!'),
      WU('Crocodiles! Line up, please!'),
      N('The Nubbins fold their arms. Nobody moves.'),
      SI('They remember. Kancil laughed at them.', 'think'),
      N('Your Nubbin can’t talk. It needs your help.'),
      Y('Kancil is sorry. Please will you help him?', 'soft'),
      N('The Nubbins smile. They make two lines!', 'happy'),
    ],
    [
      ask(4, m('sel', 'saying sorry and asking nicely', 'Your child chose kind words to mend a friendship.', 'CASEL: Relationship skills'), [SI('What words could help?')], [
        best('Sorry, and please.', WU('Yes! Sorry and please are kind words.', 'happy')),
        opt('Hurry up!', SI('Hmm. That might make them crosser. Try sorry and please.', 'soft')),
      ]),
    ],
  ),
  sp(
    'lk10-count-wulan',
    [
      WU('We count my way first. Satu!', 'happy'),
      N('Your Nubbin hops. Everyone counts!'),
      WU('Dua, tiga, empat, lima, enam, tujuh...'),
      N('At eight, the children shout: Lapan!', 'happy'),
      WU('Delapan! Sembilan, sepuluh!', 'happy'),
      N('Ten more hops back on the other line. Squelch!'),
      SI('Two lines of crocodiles! Hooray!', 'happy'),
    ],
    [
      act(5, m('maths', 'count to ten, twice', 'Your child counted one line of ten crocodiles, then the other.', 'K.CC.A.1'), 'edu:count:crocodiles:20', [
        N('(Count one line together, from one to ten.)'),
        N('(Then count the other line. Ten and ten. That’s twenty crocodiles!)'),
      ]),
    ],
  ),
];

// ---------------------------------------------------------------- reader (7–10)

const READER: EduQuest[] = [
  eq(
    'reader',
    'lk01',
    'The Shadow Screen',
    {
      'lk01-s1': { goal: 'Help Siti and Wulan put up their shadow screen by the pond.', hint: 'Hold the second pole steady while the cloth is tied.' },
      'lk01-s2': { goal: 'Meet the mouse-deer and choose whose way to hear the tales first.', hint: 'Talk to Siti or Wulan by the screen.' },
    },
    [
      rd('lk01-dusk', [
        notice(4, m('social-studies', 'finding Malaysia and Indonesia on a map', 'Your child placed Melaka and Yogyakarta on a map and saw the two countries are neighbours.', 'D2.Geo.2.3-5'), [
          SI('Melaka is an old port town on the coast of Malaysia. Ships have stopped there for hundreds of years.'),
          WU('Yogyakarta is on Java, one of the thousands of islands that make up Indonesia.'),
          WU('Between us is the sea. On a map, we’re neighbours.', 'happy'),
        ]),
        notice(8, m('art', 'shadow-puppet theatre', 'Your child learned about wayang, the shadow-puppet theatre of Indonesia and Malaysia.'), [
          WU('In Java, shadow-puppet theatre is called wayang. My puppets are wayang kancil: tales of the mouse-deer.'),
          SI('We have shadow puppets in Malaysia too, called wayang kulit. Kelantan is famous for them.'),
        ]),
      ]),
      rd('lk01-lamp', [
        act(8, m('science', 'how shadows form and change size', 'Your child moved a puppet between a lamp and a screen and ordered the shadows by size.', '5-ESS1-2'), 'edu:order:shadows:size', [
          WU('Hold the puppet close to the lamp. It blocks a lot of light, so the shadow is huge.'),
          WU('Move it close to the screen. It blocks less light, and the shadow shrinks.'),
          N('Put three puppet shadows in order, from smallest to largest.'),
        ]),
      ]),
      rd('lk01-names', [
        notice(1, m('science', 'body parts that help the mouse-deer survive', 'Your child learned what a real mouse-deer is: a tiny hoofed forest animal of South-East Asia.', '4-LS1-1'), [
          WU('Real mouse-deer live in the forests of South-East Asia. They’re about the size of a rabbit and weigh about 2 kilograms.'),
          SI('They’re among the smallest hoofed animals in the world. Not a mouse, and not quite a deer.'),
          WU('Thin legs make them quick, and their brown coat hides them among dead leaves.'),
        ]),
      ]),
      rd('lk01-complete', [
        ask(3, m('sel', 'two people can both be right', 'Your child thought about how two people can say something differently and both be right.', 'CASEL: Social awareness'), [N('Siti says Sang Kancil. Wulan says Si Kancil. Can they both be right?')], [
          opt('Yes, both.', SI('That’s what we think too. Different places, different words, the same little deer.', 'happy')),
          opt('No, only one.', WU('Lots of people think so at first. But a name can be right in two languages at once.', 'soft')),
          opt('It doesn’t matter.', SI('Maybe not to Kancil! But it matters to us, because our grandmothers said it.', 'soft')),
        ]),
      ]),
    ],
    [
      g('wayang', 'Shadow-puppet theatre from Indonesia and Malaysia, with flat puppets behind a lit screen.', 'lk01-dusk'),
      g('mouse-deer', 'A tiny forest animal with hooves, about the size of a rabbit; not a mouse and not a true deer.', 'lk01-names'),
    ],
  ),
  eq(
    'reader',
    'lk02',
    'Kancil Is Hungry',
    {
      'lk02-s1': { goal: 'Watch the first tale from the bank: Kancil is hungry.', hint: 'Come to the pond at dusk and sit on the bank.' },
      'lk02-s2': { goal: 'Look at the stream with your Nubbin: how could a small deer get across?', hint: 'Walk down to the stream that runs into the pond.' },
    },
    [
      rd('lk02-hungry', [
        ask(3, m('literacy', 'a word with two meanings', 'Your child worked out what “growling” means for a tummy, not a tiger.', 'L.3.4'), [WU('A tiger growls to warn you off. What does “growling” mean for Kancil’s tummy?')], [
          best('It rumbles because it’s empty.', SI('Yes. Same word, different job. A tiger growls on purpose; a tummy growls when it wants breakfast.', 'happy')),
          opt('His tummy is angry.', WU('Ha! Close. The tummy isn’t cross, just empty. The rumble sounds like a growl.', 'soft')),
        ]),
      ]),
      rd('lk02-ripples', [
        notice(1, m('science', 'why rainforest rivers are full of life', 'Your child learned why warm, wet rainforests support so many animals.', '3-LS4-3'), [
          WU('A rainforest is warm and wet all year, so plants grow fast and never stop.'),
          WU('Lots of plants means lots of food, so the rivers are crowded with fish, frogs, birds and crocodiles.'),
          SI('Each of them has found its habitat: the place that gives it what it needs.'),
        ]),
      ]),
      rd('lk02-plan', [
        ask(4, m('science', 'comparing solutions to a problem', 'Your child compared three ways to cross a river and weighed up each one.', '3-5-ETS1-2'), [WU('Swim, build a boat, or ask a bird. Which plan would you try?')], [
          opt('Swim', SI('Brave! But a small deer in a crocodile river is risky. What would make it safer?', 'think')),
          opt('Build a boat', WU('Clever. It takes time and tools, though, and Kancil is hungry now.', 'think')),
          opt('Ask a bird', SI('Nice idea. Could a bird carry a deer? Maybe a very big bird!', 'happy')),
        ]),
      ]),
      rd('lk02-complete', [
        ask(2, m('sel', 'waiting for something you want', 'Your child thought about what helps them wait.', 'CASEL: Self-management'), [SI('The tale stops on a question, and you have to wait for the answer. What helps you wait?')], [
          opt('Guessing what happens', WU('Good one. Guessing turns waiting into a game.', 'happy')),
          opt('Doing something else', SI('Wise. Busy hands make waiting shorter.', 'happy')),
          opt('Waiting is hard', WU('It is hard. That’s all right. Grown-ups find it hard too.', 'soft')),
        ]),
      ]),
    ],
    [
      g('ripe', 'Ready to eat: soft, sweet and fully grown.', 'lk02-hungry'),
      g('habitat', 'The natural home of an animal or plant, where it finds food, water and shelter.', 'lk02-ripples'),
    ],
  ),
  eq(
    'reader',
    'lk03',
    'Counting the Crocodiles',
    {
      'lk03-s1': { goal: 'Watch Kancil call the crocodiles to the bank.', hint: 'Sit on the bank at dusk for the second tale.' },
      'lk03-s2': { goal: 'Count the crocodiles as your Nubbin hops across the line.', hint: 'Count each hop: once in ones, then in twos.' },
      'lk03-s3': { goal: 'Decide what Kancil does on the far bank.', hint: 'Talk to Siti and Wulan by the screen.' },
    },
    [
      rd('lk03-river', [
        notice(2, m('science', 'body parts that help crocodiles survive', 'Your child learned why a crocodile’s eyes and nostrils sit on top of its head.', '4-LS1-1'), [
          SI('A real crocodile’s eyes and nostrils sit high on top of its head.'),
          WU('So it can lie almost under the water, still seeing and still breathing, and hardly anyone notices.'),
        ]),
      ]),
      rd('lk03-lined', [
        notice(2, m('sel', 'working as a team', 'Your child saw how a team of small helpers can do something none could do alone.', 'CASEL: Relationship skills'), [
          WU('Look at that. Not one Nubbin could make a bridge alone. Ten of them can.'),
          SI('A team is just a lot of small helps, all lined up.', 'happy'),
        ]),
      ]),
      rd('lk03-count', [
        act(6, m('maths', 'counting in twos as equal groups', 'Your child counted ten crocodiles in twos: five pairs.', '3.OA.A.1'), 'edu:count:crocodiles:10', [
          WU('Count the line again in twos this time: two, four, six, eight, ten.'),
          SI('Oh, look! Four more Nubbins swim up to join. The line is full, so they swim off again, very offended.'),
          N('Still ten, then. Count in twos once more: two, four, six, eight, ten.'),
          WU('Five twos make ten. Five pairs of crocodiles, and four offended Nubbins on the bank.', 'happy'),
        ]),
        notice(11, m('literacy', 'the same numbers in two languages', 'Your child heard the numbers one to ten in Malay and Indonesian, where only eight differs.'), [
          SI('In Malay, eight is lapan. In Indonesian, it’s delapan.'),
          WU('All the other numbers from one to ten are the same in both. Our languages are close cousins.', 'happy'),
        ]),
      ]),
      rd('lk03-over', [
        ask(2, m('maths', 'dividing into equal groups', 'Your child shared ten crocodiles into pairs: 10 ÷ 2 = 5, with none left over.', '3.OA.A.3'), [WU('Ten crocodiles, two in each pair. How many pairs?')], [
          best('Five pairs', SI('Five! Ten shared into twos is five pairs, and nobody left over. That makes ten an even number.', 'happy')),
          opt('Two pairs', WU('Two is how many in each pair. Count the pairs: two, four, six, eight, ten. That’s five pairs.', 'soft')),
        ]),
      ]),
      rd('lk03-turn', [
        ask(3, m('literacy', 'a character’s motive', 'Your child named the reason behind Kancil’s trick.', 'RL.3.3'), [SI('Before you choose: why did Kancil trick the crocodiles?')], [
          best('He was hungry and needed to cross.', WU('That’s his motive: the reason he did it. Hunger, and a river in the way.', 'think')),
          opt('He wanted to be mean.', SI('Maybe a bit cheeky! But the tale says he was hungry. That was his reason.', 'soft')),
        ]),
      ]),
      rd('lk03-complete', [
        notice(2, m('social-studies', 'how stories carry the past', 'Your child learned that the Kancil tales were passed down by word of mouth for generations.', 'D2.His.2.3-5'), [
          SI('Families in Malaysia, Indonesia, Singapore and Brunei have told this tale for generations.'),
          WU('It travelled from mouth to ear, grandmother to grandchild. That’s called an oral tradition.'),
        ]),
      ]),
    ],
    [
      g('nostrils', 'The two openings in the nose that air goes in and out of.', 'lk03-river'),
      g('even', 'A number that can be split into pairs with none left over, like 2, 4, 6, 8 and 10.', 'lk03-over'),
      g('motive', 'The reason someone does something.', 'lk03-turn'),
      g('tradition', 'Something people have done or told for a very long time, passed from older people to younger ones.', 'lk03-complete'),
    ],
  ),
  eq(
    'reader',
    'lk04',
    'The Crocodile Remembers',
    {
      'lk04-s1': { goal: 'Watch Kancil go down to the river for a drink.', hint: 'Sit on the bank at dusk for the third tale.' },
      'lk04-s2': { goal: 'Find a stick by the pond and lay it beside your Nubbin’s leg.', hint: 'Sticks wash up at the pond’s edge.' },
    },
    [
      rd('lk04-grab', [
        ask(4, m('literacy', 'why a character acts', 'Your child worked out why the crocodile was waiting for Kancil.', 'RL.3.3'), [WU('Why do you think the crocodile was waiting at that spot?')], [
          best('It remembered Kancil’s trick.', SI('Yes. Crocodiles in our tales have long memories, and an empty tummy helps.', 'think')),
          opt('It just wanted a drink.', WU('Maybe! But it said “I remember you”. It was waiting for Kancil.', 'soft')),
        ]),
      ]),
      rd('lk04-free', [
        notice(3, m('science', 'animals’ senses', 'Your child learned that crocodiles feel tiny ripples with sense organs on their jaws.', '4-LS1-2'), [
          SI('Real crocodiles have tiny bumps along their jaws that feel the smallest ripple in the water.'),
          WU('A drinking mouse-deer makes ripples. That’s how a crocodile knows someone has arrived.'),
        ]),
      ]),
      rd('lk04-stick', [
        ask(4, m('sel', 'was the trick fair?', 'Your child weighed up whether a trick to escape danger is fair.', 'CASEL: Responsible decision-making'), [WU('So. Was Kancil’s stick trick fair?')], [
          opt('Yes, he had to escape.', SI('That’s a fair answer. When someone grabs you, getting free matters most.', 'think')),
          opt('No, it was a fib.', WU('That’s fair too. It was a fib, even if it was a fib to save his leg.', 'think')),
          opt('A bit of both.', SI('That’s what I think, most days. A trick can be clever and unfair at once.', 'soft')),
        ]),
      ]),
      rd('lk04-complete', [
        ask(1, m('maths', 'comparing lengths by subtracting', 'Your child found the difference between two lengths by subtracting.', '4.MD.A.2'), [N('The stick is 60 centimetres long. Your Nubbin’s leg is 15 centimetres. How much longer is the stick?')], [
          best('45 centimetres', WU('Yes! 60 take away 15 is 45. That’s a lot of extra stick.', 'happy')),
          opt('75 centimetres', SI('That’s adding them together. To compare, take away: 60 minus 15 is 45.', 'soft')),
          opt('15 centimetres', WU('That’s the leg. The difference is 60 minus 15, which is 45.', 'soft')),
        ]),
      ]),
    ],
    [g('sense', 'One of the ways a body finds out about the world, like seeing, hearing or feeling.', 'lk04-free')],
  ),
  eq(
    'reader',
    'lk05',
    'The Buffalo and the Crocodile',
    {
      'lk05-s1': { goal: 'Watch the buffalo help the crocodile out from under a log.', hint: 'Sit on the bank at dusk for the fourth tale.' },
      'lk05-s2': { goal: 'Help Kancil see exactly how things were: put the log back where it lay.', hint: 'Roll the shadow log back when the crocodile is in place.' },
    },
    [
      rd('lk05-log', [
        notice(10, m('science', 'a lever helps lift heavy things', 'Your child learned how a long branch used as a lever lifts a heavy log.', '3-PS2-1'), [
          WU('See how the buffalo used a branch? A long branch pushed under a heavy log is called a lever.'),
          SI('Push down on the long end, and the short end lifts far more than you could lift alone.'),
        ]),
      ]),
      rd('lk05-judge', [
        notice(2, m('social-studies', 'fairness: hear both sides', 'Your child learned that a fair judge listens to both sides and looks at the facts first.', 'D2.Civ.8.3-5'), [
          WU('That’s what a good judge does. Listen to both sides and look at the facts before deciding.'),
          SI('Deciding first and looking afterwards is how unfair things happen.'),
        ]),
      ]),
      rd('lk05-before', [
        ask(2, m('literacy', 'a character’s motive', 'Your child explained why the crocodile walked into Kancil’s plan.', 'RL.3.3'), [SI('Why did the crocodile agree to go back under the log?')], [
          best('It was sure it would win.', WU('Yes. It was so sure it was right, it didn’t stop to think.', 'think')),
          opt('It liked it under there.', SI('Nobody likes being under a log! It went back because it wanted to win the argument.', 'soft')),
        ]),
      ]),
      rd('lk05-complete', [
        ask(1, m('sel', 'was the judgement fair?', 'Your child weighed up whether Kancil’s judgement was fair to everyone.', 'CASEL: Responsible decision-making'), [WU('Was Kancil’s judgement fair?')], [
          opt('Yes. The crocodile broke its promise.', SI('That’s fair reasoning. The crocodile turned a kindness into a trap.', 'think')),
          opt('No. It was another trick.', WU('That’s a fair answer too. He did let the crocodile trick itself.', 'think')),
          opt('Fair to the buffalo, hard on the crocodile.', SI('That’s very thoughtful. Being fair to one can feel hard to another.', 'soft')),
        ]),
      ]),
    ],
    [
      g('lever', 'A long bar or branch that turns on a point to help lift something heavy.', 'lk05-log'),
      g('judge', 'To decide what is fair or true after looking carefully; also the person who decides.', 'lk05-judge'),
    ],
  ),
  eq(
    'reader',
    'lk06',
    'The Race with the Snails',
    {
      'lk06-s1': { goal: 'Watch Kancil boast to a snail.', hint: 'Sit on the bank at dusk for the fifth tale.' },
      'lk06-s2': { goal: 'Watch the race along the riverbank.', hint: 'Help Siti set the ten snail puppets along the screen.' },
    },
    [
      rd('lk06-boast', [
        ask(4, m('sel', 'why laughing at someone is unkind', 'Your child thought about how it feels to be laughed at for being slow.', 'CASEL: Social awareness'), [SI('Why is it unkind to laugh at someone for being slow?')], [
          opt('It makes them feel small.', WU('Yes. And small is how that boy at the back looks right now.', 'soft')),
          opt('Everyone is slow at something.', SI('So true. Even Kancil. He just hasn’t found his slow thing yet.', 'think')),
          opt('It’s only a joke.', WU('Jokes are only funny if everyone’s laughing. Look at the boy at the back. He isn’t.', 'soft')),
        ]),
      ]),
      rd('lk06-line', [
        notice(1, m('science', 'body parts that help snails survive', 'Your child learned how a snail’s shell and muscly foot help it survive.', '4-LS1-1'), [
          WU('A snail’s shell protects its soft body, and it can pull right inside when danger comes.'),
          SI('It glides on one muscly foot over a ribbon of slime, which helps it cross rough ground.'),
        ]),
      ]),
      rd('lk06-race', [
        act(9, m('maths', 'counting in fives; distance word problems', 'Your child counted snails placed every 5 metres to find how many there were and how long the race was.', '3.OA.A.3'), 'edu:count:snails:10', [
          WU('The snails sat one every 5 metres, from 5 metres all the way to 50.'),
          SI('So how many snails were there? And how long was the race?'),
          N('Count in fives: 5, 10, 15… up to 50. That’s 10 snails, and a race of 50 metres.'),
        ]),
      ]),
      rd('lk06-complete', [
        ask(3, m('literacy', 'how a character responds to events', 'Your child described how Kancil felt when he lost the race.', 'RL.3.3'), [SI('How did Kancil feel when he flopped down and gave up?')], [
          best('Tired, and a bit silly.', WU('Yes. Tired legs and a red face. He’d learned something.', 'think')),
          opt('Proud.', SI('Not this time! He’d boasted and lost. He felt tired and silly.', 'soft')),
        ]),
      ]),
    ],
    [g('boast', 'To talk proudly about how good you are, to show off.', 'lk06-boast')],
  ),
  eq(
    'reader',
    'lk07',
    'The Cucumber Garden',
    {
      'lk07-s1': { goal: 'Watch the tale of the cucumber garden.', hint: 'Sit on the bank at dusk for the sixth tale.' },
      'lk07-s2': { goal: 'Help Kancil put the garden right: plant cucumber seeds by the screen.', hint: 'Take the seed pot by the lamp.' },
    },
    [
      rd('lk07-garden', [
        notice(4, m('science', 'why a climbing vine does well', 'Your child learned that a vine climbs towards the light, which helps it grow well where it lives.', '3-LS4-3'), [
          WU('Cucumber vines drink water through their roots, and their leaves use sunlight to make food.'),
          SI('That’s why the vines climb. A vine that reaches the sun grows better than one left in the shade.'),
        ]),
      ]),
      rd('lk07-endings', [
        ask(3, m('sel', 'which ending is better?', 'Your child compared a clever ending with a kind one and said which they prefer and why.', 'CASEL: Responsible decision-making'), [WU('Which ending is better: the old trick or the new sorry? Why?')], [
          opt('The trick. It’s clever.', SI('That’s fair. It shows how quick he is. Was it fair to the dog, though?', 'think')),
          opt('Sorry. It’s kind.', WU('That’s fair. The new ending mends what he broke.', 'soft')),
          opt('Both, for different reasons.', SI('That’s what we think. One teaches you to be quick, one teaches you to be good.', 'happy')),
        ]),
      ]),
      rd('lk07-sorry', [
        ask(6, m('maths', 'multiplication as equal groups', 'Your child worked out 3 rows of 4 seeds as 12.', '3.OA.A.1'), [N('Kancil and Pak Tani plant 3 rows, with 4 seeds in each row. How many seeds?')], [
          best('12', WU('Twelve! Three groups of four: 4, 8, 12.', 'happy')),
          opt('7', SI('That’s 3 add 4. But it’s 3 rows OF 4: 4, 8, 12. Twelve seeds.', 'soft')),
        ]),
      ]),
      rd('lk07-complete', [
        notice(2, m('social-studies', 'how stories change over time', 'Your child learned that tales passed by word of mouth change a little with each teller.', 'D2.His.2.3-5'), [
          WU('Tales passed on by word of mouth change a little with each teller.'),
          SI('That isn’t a mistake. It’s how old stories stay alive.', 'soft'),
        ]),
      ]),
    ],
    [g('sap', 'The sticky liquid inside a tree or plant.', 'lk07-garden')],
  ),
  eq(
    'reader',
    'lk08',
    'The Tiger at the River',
    {
      'lk08-s1': { goal: 'Watch the tiger corner Kancil by the water.', hint: 'Sit on the bank at dusk for the seventh tale.' },
      'lk08-s2': { goal: 'Look at your Nubbin’s reflection in the still pond.', hint: 'Find a calm spot at the pond’s edge and look in.' },
    },
    [
      rd('lk08-tiger', [
        notice(1, m('science', 'stripes as camouflage', 'Your child learned how a tiger’s stripes help it hide, and where tigers live in Malaysia and Indonesia.', '4-LS1-1'), [
          SI('Tigers really do live in the forests of Malaysia and Indonesia.'),
          WU('Their stripes break up their shape in long grass and shadow. That’s called camouflage.'),
        ]),
      ]),
      rd('lk08-look', [
        notice(4, m('science', 'light travels and bounces', 'Your child learned that light travels from the tiger to the water and bounces back to his eyes.', '4-PS3-2'), [
          WU('Light travels from the tiger down to the pool. Still water is smooth, so the light bounces straight back up.'),
          SI('It reaches his eyes and makes a picture: a reflection. He’s being rude to some bounced light.', 'happy'),
          WU('Ripples scatter the light in all directions, and the picture breaks up.'),
        ]),
      ]),
      rd('lk08-splash', [
        act(7, m('maths', 'lines of symmetry', 'Your child found the line of symmetry where a reflection meets the real thing.', '4.G.A.3'), 'edu:tap:shape:reflection', [
          WU('Look at a tree and its reflection together. There’s a line where the water meets the bank.'),
          SI('Tap that line. Everything above it is mirrored below it.'),
          N('That’s a line of symmetry: fold along it, and both halves match.'),
        ]),
      ]),
      rd('lk08-complete', [
        ask(2, m('sel', 'noticing when we are cross for no reason', 'Your child thought about getting cross at something that isn’t really there.', 'CASEL: Self-awareness'), [WU('The tiger got cross with a tiger who wasn’t really there. Have you ever been cross at nothing much?')], [
          opt('Yes, sometimes.', SI('Most of us have. Noticing it is the first step to letting it go.', 'soft')),
          opt('No, never.', WU('Lucky you! Watch out for it. It sneaks up on everyone.', 'happy')),
          opt('I’m not sure.', SI('That’s honest. Next time you’re cross, ask: is the thing really there?', 'soft')),
        ]),
      ]),
    ],
    [
      g('camouflage', 'Colours or patterns that help an animal blend in with what is around it.', 'lk08-tiger'),
      g('reflection', 'The picture you see in a mirror or in still water.', 'lk08-look'),
      g('symmetry', 'When one half of a shape is a mirror image of the other half.', 'lk08-splash'),
    ],
  ),
  eq(
    'reader',
    'lk09',
    'The Pit',
    {
      'lk09-s1': { goal: 'Watch Kancil fall into the hunters’ pit.', hint: 'Sit on the bank at dusk for the eighth tale.' },
      'lk09-s2': { goal: 'Decide how the tale ends.', hint: 'Talk to Siti by the screen.' },
    },
    [
      rd('lk09-pit', [
        notice(5, m('science', 'an elephant’s trunk', 'Your child learned what an elephant’s trunk is and that Asian elephants live in Malaysia and Indonesia.', '4-LS1-1'), [
          WU('Asian elephants live in the forests of Malaysia and Indonesia too.'),
          SI('A trunk is a nose and an upper lip joined together. It can lift a log or pick up a single fruit.'),
        ]),
      ]),
      rd('lk09-out', [
        ask(2, m('literacy', 'describing a character’s traits', 'Your child chose a word to describe the elephant: trusting.', 'RL.3.3'), [SI('Which word describes the elephant best?')], [
          best('Trusting', WU('Yes. He believed Kancil at once, and climbed right in.', 'think')),
          opt('Sneaky', SI('That’s Kancil! The elephant was trusting. He believed every word.', 'soft')),
        ]),
      ]),
      rd('lk09-ending', [
        ask(5, m('science', 'defining a problem and finding solutions', 'Your child named the real problem (steep sides) and compared two ways to solve it.', '3-5-ETS1-2'), [WU('What exactly is the problem? And what are two ways to solve it?')], [
          best('The sides are too steep. A ramp, or ropes.', SI('Exactly. Name the problem first: steep, slippery sides. Then a log ramp, or ropes to pull with.', 'happy')),
          opt('Elephant is too big.', WU('He is big! But the real problem is the steep sides. A ramp would fix that.', 'soft')),
        ]),
      ]),
      rd('lk09-complete', [
        ask(1, m('sel', 'choosing how to tell a story', 'Your child chose which ending they would tell a younger child, and why.', 'CASEL: Responsible decision-making'), [WU('If you told this tale to a little brother or sister, which ending would you choose?')], [
          opt('The old one.', SI('That’s fair. It warns them to be careful who they trust.', 'think')),
          opt('The new one.', WU('That’s fair. It shows a trick can be put right.', 'soft')),
          opt('I’d let them choose.', SI('Now that’s a storyteller talking.', 'happy')),
        ]),
      ]),
    ],
    [g('trusting', 'Ready to believe what someone tells you.', 'lk09-out')],
  ),
  eq(
    'reader',
    'lk10',
    'The Night of Stories',
    {
      'lk10-s1': { goal: 'Line up the Grove’s Nubbins across the stream for the last crossing.', hint: 'Call your Nubbins to the stream by the screen.' },
      'lk10-s2': { goal: 'Cross the stream with your Nubbin and count every crocodile.', hint: 'Along one line and back along the other.' },
    },
    [
      rd('lk10-line', [
        notice(2, m('social-studies', 'shared food and words', 'Your child learned that kuih and kue are snacks shared by Malaysia and Indonesia.', 'D2.Geo.2.3-5'), [
          SI('Kuih is the Malay word for small cakes and snacks, sweet or savoury.'),
          WU('In Indonesia we say kue. Same idea, different spelling, and we argue about the coconut.', 'happy'),
        ]),
      ]),
      rd('lk10-count', [
        act(5, m('maths', 'adding tens', 'Your child added two lines of ten crocodiles to make twenty.', '3.OA.A.1'), 'edu:count:crocodiles:20', [
          WU('Two lines of ten crocodiles. How many crocodiles in all?'),
          SI('Ten and ten make twenty. Or two tens, if you like your times tables.', 'happy'),
        ]),
      ]),
      rd('lk10-complete', [
        ask(2, m('literacy', 'finding the theme', 'Your child named the big idea running through the Kancil tales.', 'RL.4.2'), [SI('What did Kancil learn this summer? What is the big idea of all his tales?')], [
          opt('Being small is fine if you think.', WU('That’s a strong theme. Brains beat size, over and over.', 'happy')),
          opt('Clever isn’t enough. Be kind too.', SI('That’s the one I’d pick. Every trick needed a thank you after.', 'soft')),
          opt('Don’t boast.', WU('The snails would agree with you.', 'happy')),
        ]),
        ask(8, m('sel', 'reflecting on your own learning', 'Your child said what they learned over the summer of tales.', 'CASEL: Self-awareness'), [WU('And you? What did you learn this summer?')], [
          opt('Counting in Malay and Indonesian.', SI('Satu, dua, tiga! You’ll never forget lapan and delapan now.', 'happy')),
          opt('That stories change.', WU('They do. And you’ll change them too, when you tell them.', 'soft')),
          opt('Something else.', SI('Tell us. We like hearing what people take home.', 'soft')),
        ]),
      ]),
    ],
    [g('theme', 'The big idea or message that runs through a story.', 'lk10-complete')],
  ),
];

const READER_VARIANTS: EduScene[] = [
  rd('lk10-complete-pit-ramp', [
    ask(2, m('literacy', 'finding the theme', 'Your child named the big idea running through the Kancil tales, elephant and all.', 'RL.4.2'), [SI('What did Kancil learn this summer? What is the big idea of all his tales?')], [
      opt('Being small is fine if you think.', WU('That’s a strong theme. Brains beat size, over and over.', 'happy')),
      opt('Clever isn’t enough. Go back and put it right.', SI('That’s the one I’d pick. You gave the tale its new ending yourselves.', 'soft')),
      opt('Don’t boast.', WU('The snails would agree with you.', 'happy')),
    ]),
    ask(5, m('sel', 'reflecting on your own learning', 'Your child said what they learned over the summer of tales.', 'CASEL: Self-awareness'), [WU('And you? What did you learn this summer?')], [
      opt('Counting in Malay and Indonesian.', SI('Satu, dua, tiga! You’ll never forget lapan and delapan now.', 'happy')),
      opt('That stories change.', WU('They do. You changed one. The elephant got out.', 'soft')),
      opt('Something else.', SI('Tell us. We like hearing what people take home.', 'soft')),
    ]),
  ]),
  rd('lk04-grab-laughed', [
    ask(4, m('literacy', 'why a character acts', 'Your child worked out why the crocodile was so cross with Kancil.', 'RL.3.3'), [WU('Why is the crocodile so much crosser this time?')], [
      best('Kancil laughed at it.', SI('Yes. Being laughed at stings for a long time, even for a crocodile.', 'think')),
      opt('It’s hungrier.', WU('Maybe! But it says it remembers being laughed at. That’s what made it cross.', 'soft')),
    ]),
  ]),
  rd('lk04-grab-sorry', [
    ask(5, m('literacy', 'why a character acts', 'Your child worked out why Kancil’s sorry still bothers the crocodile.', 'RL.3.3'), [WU('Why can’t the crocodile stop thinking about Kancil?')], [
      best('Kancil said sorry, and nobody ever does.', SI('Yes. A real sorry is hard to forget, even for a crocodile.', 'think')),
      opt('It’s just hungry.', WU('It is hungry! But it says the sorry is what it keeps thinking about.', 'soft')),
    ]),
  ]),
  rd('lk07-garden-wulan', [
    notice(3, m('science', 'why a climbing vine does well', 'Your child learned that a vine climbs towards the light, which helps it grow well where it lives.', '3-LS4-3'), [
      SI('Cucumber vines drink water through their roots, and their leaves use sunlight to make food.'),
      WU('That’s why the vines climb. A vine that reaches the sun grows better than one left in the shade.'),
    ]),
  ]),
  rd('lk10-line-laughed', [
    ask(10, m('sel', 'mending a friendship', 'Your child thought about what helps someone trust you again after you hurt them.', 'CASEL: Relationship skills'), [SI('What could help the Nubbins trust Kancil again?')], [
      best('Say sorry and ask nicely.', WU('Yes. A real sorry, and a please. Then let them decide.', 'soft')),
      opt('Order them to line up.', SI('Orders don’t mend things. A sorry and a please might.', 'soft')),
    ]),
  ]),
  rd('lk10-count-wulan', [
    act(5, m('maths', 'adding tens', 'Your child added two lines of ten crocodiles to make twenty.', '3.OA.A.1'), 'edu:count:crocodiles:20', [
      WU('Two lines of ten crocodiles. How many crocodiles in all?'),
      SI('Ten and ten make twenty. Or two tens, if you like your times tables.', 'happy'),
    ]),
  ]),
];

/** The Learning Grove versions of every LK scene, per band. */
export const LINE_LK_EDU: Record<EduBand, EduQuest[]> = { sprout: SPROUT, reader: READER };

/** The bands' versions of the six variant scenes in LINE_LK_VARIANTS. */
export const LINE_LK_EDU_VARIANTS: Record<EduBand, EduScene[]> = { sprout: SPROUT_VARIANTS, reader: READER_VARIANTS };

/** Every `edu:` check used by the bands' lessons. */
export const LINE_LK_EDU_CHECKS: string[] = [
  ...new Set(
    [...SPROUT.flatMap((q) => q.scenes), ...READER.flatMap((q) => q.scenes), ...SPROUT_VARIANTS, ...READER_VARIANTS]
      .flatMap((s) => s.lessons)
      .flatMap((l) => (l.check ? [l.check] : [])),
  ),
];
