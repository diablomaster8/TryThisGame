/**
 * Fun quests Q86–Q95: The Hodja's Donkey (Nasreddin Hodja tales; Turkey, Iran and Central Asia).
 *
 * Source and rights: traditional folk tales told from the Balkans to China (Nasreddin Hoca,
 * Molla Nasreddin, Afandi, Juha). Public domain. Verbatim lines come only from George Borrow's
 * translation, The Turkish Jester; or, The Pleasantries of Cogia Nasr Eddin Effendi (Ipswich,
 * 1884; Project Gutenberg #16244). Borrow writes "Cogia"; the game says "the Hodja". Recheck
 * punctuation against #16244 before release. Quoted lines, by quest:
 *   Q86 "It is not my fault ... but the horse's, for the horse is left-handed."
 *   Q87 "Welcome, my pelisse, please to eat, my lord." (our own line "Eat, my coat, eat!" is a
 *       common rendering of the Turkish "Ye kürküm ye", not Borrow)
 *   Q88 "You believe the ass, but will not believe a grey-bearded man like me."
 *   Q89 "the cauldron has borne a child" / "the cauldron is dead." / "as you believed it could bear
 *       a child, why should you not believe that it can die?" (the pot is Byte's jam pan in the scene)
 *   Q90 "The moon has fallen into the well, I must pull it out." / "I have suffered much pain, but
 *       the moon has got to its place again."
 *   Q92 "do ye not know what I am going to say to you?" (set at the schoolhouse, not a mosque)
 * Riding backwards for his pupils, the seven donkeys, the smell of soup, the yoghurt pond and
 * "you are right, too" are not in Borrow; they are told in our own words.
 *
 * Audience 'all'. The frame: the Hodja rides up the lane after Chapter 3, settles under the big
 * tree by the pond and teaches whoever sits down. Nubbins and animals do not speak; the donkey
 * brays (narrated) and never says a word. All quests are optional, one time only, never reset,
 * and never set a campaign flag. They do not appear during Chapters 9–11.
 *
 * Grove flags read: none. Flags written: only the cosmetic, quest-prefixed `q87-gift`
 * ('seat' | 'coat' | 'watch'), set by the choice in Q87 and read by Q91 and Q95 through
 * `QUESTS_HODJA_VARIANTS`. It has no other effect.
 *
 * Care notes: he belongs to no one country and says so in Q86. He is a Muslim teacher; faith is
 * never the joke (no mosque, prayer or Qur'an gags). Draw him as Turkish pictures do (beard, robe,
 * big round turban); no fez gags, no "bazaar" caricature. Gentle tales only; the donkey never dies.
 * Advisers: Turkish, Iranian and Central Asian.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** Narrator. */
const N = say('narrator');
/** The player. */
const Y = say('you');
const SP = say('sparks');
const PX = say('pixel');
const BY = say('byte');
const HO = say('hodja');
const LA = say('soup-keeper');

const WHEN_OPEN = 'once Chapter 3 is done (never during Chapters 9–11)';
const WHEN_AFTER = 'once the one before it is done (never during Chapters 9–11)';

// ---------------------------------------------------------------- speakers

const HODJA: Speaker = {
  id: 'hodja',
  name: 'The Hodja',
  kind: 'other',
  basedOn: 'Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia)',
};
const PIXEL: Speaker = { id: 'pixel', name: 'Pixel', kind: 'keeper' };
const BYTE: Speaker = { id: 'byte', name: 'Byte', kind: 'keeper' };
const SPARKS: Speaker = { id: 'sparks', name: 'Sparks', kind: 'keeper' };
const LADLE: Speaker = {
  id: 'soup-keeper',
  name: 'Merrow Ladle',
  kind: 'other',
  basedOn: 'The stall-keeper in the tale of the smell of soup (traditional)',
};

export const QUESTS_HODJA: Quest[] = [
  // ------------------------------------------------------------------ Q86
  {
    id: 'q86',
    code: 'Q86',
    title: 'Riding Backwards',
    source:
      'Nasreddin Hodja tales: the rider who faces the tail (Borrow, 1884, for the left-handed horse)',
    audience: 'all',
    trigger: { where: 'The lane by the pond, on an afternoon', when: WHEN_OPEN },
    speakers: [HODJA, BYTE],
    steps: [
      {
        id: 'q86-s1',
        goal: 'Help the Hodja down from his donkey.',
        hint: 'Walk up to the donkey by the pond and use Talk on the rider.',
        check: 'talk:hodja:dismount',
        scene: {
          id: 'q86-intro',
          lines: [
            N(
              'A grey donkey plods up the lane with a crowd of valley children trailing behind. Its rider sits facing the tail.',
            ),
            N(
              'He has a round white turban the size of a cartwheel. He nods to you politely, which from that angle means nodding at the lane.',
            ),
            BY('Excuse me. You’re on backwards.'),
            HO('I am not. The donkey is.', 'happy'),
            N(
              'The donkey considers this and brays. It sounds like a door being opened by someone with opinions.',
            ),
            Y('Where have you come from?'),
            HO('Akşehir. Also Bukhara. Also wherever you like, I am not fussy.'),
            HO(
              'Now, help me down, please. It is not my fault, but the horse’s, for the horse is left-handed.',
              'think',
            ),
            BY('That’s a donkey.'),
            HO('Then it is doubly his fault.', 'happy'),
          ],
          choices: [
            {
              id: 'hand-up',
              label: 'Offer him your arm.',
              then: [HO('A good arm. Sturdy. I will remember it, in case I need another.')],
            },
            {
              id: 'ask-why',
              label: 'Why do you ride backwards?',
              then: [
                HO('I am a teacher. A teacher should not turn his back on his pupils.'),
                N(
                  'The children grin. One of them has clearly heard this before and mouths it along with him.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'q86-down',
          lines: [
            N(
              'He lands on both feet, wobbles, and pats his turban back into the middle of his head.',
            ),
            HO(
              'Thank you. The ground is exactly where I left it. That is very reassuring.',
              'happy',
            ),
          ],
        },
      },
      {
        id: 'q86-s2',
        goal: 'Give the donkey water and a place under the big tree.',
        hint: 'Fill a bucket at the pond and use Give on the donkey, then lead it to the shade.',
        check: 'give:item:water:hodja-donkey',
        scene: {
          id: 'q86-water',
          lines: [
            HO(
              'He has walked a long way for a donkey who is only carrying a man and a few opinions.',
            ),
            N(
              'The donkey looks at the pond, and your Nubbin looks at the donkey, and a friendship begins on the spot.',
            ),
            HO(
              'If there is water and a patch of shade, we may stay a while. A tree like that deserves a class.',
              'soft',
            ),
            Y('You want to teach under the big tree?'),
            HO(
              'I want to sit under it. The teaching will follow. It always does, like the donkey.',
            ),
          ],
        },
        done: {
          id: 'q86-drank',
          lines: [
            N(
              'The donkey drinks for a long time and then stands in the shade with its eyes half closed.',
            ),
            N('Your Nubbin climbs up on its back, facing the tail, and nobody objects.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q86-complete',
      lines: [
        N(
          'The Hodja spreads his coat on the roots of the big tree and sits down. The valley children settle around him like ducklings.',
        ),
        HO(
          'Whoever wishes to learn something may sit. Whoever wishes to learn nothing may sit as well. The tree is wide.',
        ),
        N(
          'By the evening he has already contradicted himself twice, and the children are delighted.',
        ),
        BY('Does he always do that?'),
        HO('Only when I am awake.', 'happy'),
        N(
          'The donkey stays tied beside the pond. Your Nubbin visits it first thing every morning.',
        ),
      ],
    },
    rewards: [
      {
        id: 'backwards-riding',
        kind: 'feature',
        label: 'Backwards Riding',
        description: 'Your Keeper can sit facing the tail on any rideable.',
      },
    ],
    childLines: {
      'q86-intro#7': 'Please help me down. It is not my fault. The donkey is left-handed.',
    },
    notes:
      'The Hodja (big round turban, long robe) rides the grey donkey facing the tail; the donkey is a new rideable with a ' +
      'bray. Valley children trail behind in a loose line. After the quest the Hodja sits under the big tree by the pond and ' +
      'the donkey is tied beside the pond. Feature: Keeper "sit backwards" toggle on every rideable. ' +
      'The Borrow quote is kept verbatim ("horse"); Byte corrects it to donkey, which is the joke.',
  },

  // ------------------------------------------------------------------ Q87
  {
    id: 'q87',
    code: 'Q87',
    title: 'Eat, My Coat, Eat!',
    source: 'Nasreddin Hodja tales: the feast and the fur coat (Borrow, 1884, "my pelisse")',
    audience: 'all',
    trigger: { where: 'The Harvest Supper tables (autumn)', when: WHEN_AFTER },
    requires: ['Q86'],
    speakers: [HODJA, BYTE],
    steps: [
      {
        id: 'q87-s1',
        goal: 'Notice the Hodja at the Harvest Supper and decide what to do.',
        hint: 'Talk to the Hodja at the edge of the Supper tables.',
        check: 'talk:hodja:supper',
        scene: {
          id: 'q87-intro',
          lines: [
            N(
              'The Harvest Supper is in full swing. Lanterns, long tables, the good bowls, the big pots of soup.',
            ),
            N(
              'The Hodja arrives straight from digging, in his old patched coat. Nobody offers him a seat or a bowl.',
            ),
            BY('Is it me, or is everyone suddenly very interested in their soup?'),
            HO('Do not trouble yourself. The soup is very interesting.', 'soft'),
            N(
              'He stands at the end of the bench and waits, as politely as a man can wait with mud on his knees.',
            ),
          ],
          choices: [
            {
              id: 'seat',
              label: 'Give him your own seat and bowl.',
              set: { 'q87-gift': 'seat' },
              then: [
                HO('You are a good host. I will remember your bowl.'),
                N('He sits down. A few people look at their spoons.'),
              ],
            },
            {
              id: 'coat',
              label: 'Fetch him a cleaner coat from your cottage.',
              set: { 'q87-gift': 'coat' },
              then: [
                HO('A coat! It is kind of you. I will look after it very well.'),
                N(
                  'You run to the cottage and back. He puts it on over his own, which makes him look rather round.',
                ),
              ],
            },
            {
              id: 'watch',
              label: 'Wait and see what he does.',
              set: { 'q87-gift': 'watch' },
              then: [
                HO('Ah. A patient friend. That is also a gift.', 'happy'),
                N('You stay where you are. Your Nubbin looks at you rather hard.'),
              ],
            },
          ],
        },
        done: {
          id: 'q87-slipout',
          lines: [
            N('The Hodja slips out of the lantern light and is gone for some time.'),
            N(
              'When he comes back, he is wearing a magnificent fur coat. The whole table stands up.',
            ),
          ],
        },
      },
      {
        id: 'q87-s2',
        goal: 'Watch what the Hodja does with his soup.',
        hint: 'Sit near the top of the table and use Watch.',
        check: 'watch:hodja:feed-coat',
        scene: {
          id: 'q87-feast',
          lines: [
            N(
              'Now he is led to the top of the table at once. Someone pulls out a chair, and someone else brings a bowl with a flourish.',
            ),
            HO('Thank you. This is a lovely supper.', 'happy'),
            N(
              'He dips the sleeve of the fur coat into the soup. Then he lifts a piece of bread and holds it to the collar.',
            ),
            HO('Eat, my coat, eat!', 'happy'),
            N('The table goes quiet.'),
            HO('Welcome, my pelisse, please to eat, my lord.', 'think'),
            HO('It was my coat that was invited. I only came along to carry it.', 'soft'),
            N(
              'Nobody says anything. Then Byte starts to laugh, and it spreads down the table, and some people look at their shoes.',
            ),
          ],
        },
        done: {
          id: 'q87-laughed',
          lines: [
            N(
              'The mayor gets up and offers him a proper seat, a proper bowl and, after a pause, an apology.',
            ),
            HO('Thank you. The coat accepts it. I am only here for the soup.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q87-complete',
      lines: [
        N(
          'By the end of the Supper the old patched coat is back on his shoulders and the fur one has gone to sleep on a bench.',
        ),
        HO(
          'You see? A fine coat is welcome at any table. A fine man in an old coat has to be introduced.',
        ),
        BY('I think we’ve all been introduced now.'),
        HO('Excellent. Next time I will not need the fur at all. Probably.', 'happy'),
        N(
          'He hands you the digging coat to mend, and then, after a look at your face, hands you a tiny pair of patches too.',
        ),
      ],
    },
    rewards: [
      {
        id: 'patched-digging-coat',
        kind: 'cosmetic',
        label: 'Patched Digging Coat',
        description:
          'The Hodja’s old digging coat, patched at both elbows. A cosmetic for your Keeper.',
      },
    ],
    childLines: {
      'q87-feast#3': 'Eat up, coat! Everyone was so pleased to see you.',
      'q87-feast#5': 'Eat up, coat! Everyone was so pleased to see you.',
    },
    notes:
      'The choice sets q87-gift (seat | coat | watch), a cosmetic, quest-prefixed flag that only Q91 and Q95 read (see ' +
      'QUESTS_HODJA_VARIANTS). If the choice is skipped, treat q87-gift as "watch". Staging: lanterns, long tables, an old patched coat and a magnificent fur coat that the Hodja fetches ' +
      'off-screen (cut away; no tailor scene). Q87 plays only at the Harvest Supper (autumn). Reuse "Eat up, coat!" only once ' +
      'in the Learning Grove (the second line is a duplicate childLine on purpose so the Borrow line is never shown to children).',
  },

  // ------------------------------------------------------------------ Q88
  {
    id: 'q88',
    code: 'Q88',
    title: 'Whom Do You Believe?',
    source: 'Nasreddin Hodja tales: the lent donkey that is "out" (Borrow, 1884)',
    audience: 'all',
    trigger: {
      where: 'The big tree by the pond, when you are carrying a heavy load of fruit',
      when: WHEN_AFTER,
    },
    requires: ['Q87'],
    speakers: [HODJA],
    steps: [
      {
        id: 'q88-s1',
        goal: 'Ask the Hodja if you may borrow his donkey for your fruit.',
        hint: 'Pick a heavy load of fruit, then talk to the Hodja under the big tree.',
        check: 'talk:hodja:borrow-donkey',
        scene: {
          id: 'q88-intro',
          lines: [
            N(
              'You have more fruit than arms. A great heap of it wobbles in the basket, and a pear is trying to escape.',
            ),
            Y('Hodja, may I borrow your donkey for the afternoon?'),
            HO('Ah. I am very sorry. He is out today.', 'sad'),
            N('Behind the big tree, quite close, the donkey brays. It is not a quiet bray.'),
            N(
              'Your Nubbin looks at the tree, and then at the Hodja. The Hodja studies his hands for a moment.',
            ),
            HO('You believe the ass, but will not believe a grey-bearded man like me.', 'angry'),
            N('He folds his arms and looks offended. His eyebrows are doing most of the work.'),
          ],
          choices: [
            {
              id: 'sorry',
              label: 'I’m sorry. I believe you.',
              then: [
                HO(
                  'Too late. You have hurt me twice. Once with your ears, and once with your eyes.',
                  'sad',
                ),
              ],
            },
            {
              id: 'ask-nicely',
              label: 'Please, Hodja. I have a lot of pears.',
              then: [HO('That is a different question, and a much better one.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q88-lent',
          lines: [
            N(
              'He laughs, a big round laugh that shakes the turban, and goes to untie the donkey himself.',
            ),
            HO(
              'Since you asked nicely. Also, he was never out. He was only hiding from the fruit.',
              'happy',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'q88-complete',
      lines: [
        N(
          'The donkey carries the basket and an extra one besides. It walks slowly, with great dignity, as if it carried the fruit for fun.',
        ),
        N('Your Nubbin rides on top of the pears.'),
        HO(
          'If you want, you may borrow him again. Just do not ask the donkey. He says yes to everything.',
        ),
        N('The donkey brays once, loudly, and agrees.'),
      ],
    },
    rewards: [
      {
        id: 'donkey-rides',
        kind: 'feature',
        label: 'Donkey Rides',
        description: 'The donkey carries one extra basket of fruit for you.',
      },
    ],
    childLines: {
      'q88-intro#5': 'Who will you believe? Me, or a donkey? Hee-haw.',
    },
    notes:
      'Triggers only when the player is carrying a heavy fruit load (fruit-count threshold in the sim). One-time unlock: the ' +
      'donkey is a carrier with one extra basket slot; it is not a chore and has no cooldown. The donkey brays from behind ' +
      'the tree; it never speaks. Borrow quote kept verbatim, "ass" included.',
  },

  // ------------------------------------------------------------------ Q89
  {
    id: 'q89',
    code: 'Q89',
    title: 'The Pot That Gave Birth',
    source: 'Nasreddin Hodja tales: the cauldron that bore a child (Borrow, 1884)',
    audience: 'all',
    trigger: { where: 'Byte’s kitchen, then the big tree by the pond', when: WHEN_AFTER },
    requires: ['Q88'],
    speakers: [HODJA, BYTE],
    steps: [
      {
        id: 'q89-s1',
        goal: 'Carry Byte’s big jam pan to the Hodja.',
        hint: 'Take the big jam pan from Byte and give it to the Hodja under the big tree.',
        check: 'give:item:jam-pan:hodja',
        scene: {
          id: 'q89-intro',
          lines: [
            HO(
              'Byte, I am cooking soup for the children and I have no pan large enough. May I borrow yours?',
            ),
            BY('The big jam pan? It’s the only one I’ve got.'),
            HO('I will take great care of it. I will bring it back before the jam is missed.'),
            N(
              'Byte sighs and puts it in your arms. It is very large, and rather sticky on one side.',
            ),
            BY('Carry that. And tell him I want it back.'),
          ],
        },
        done: {
          id: 'q89-lent',
          lines: [
            N('The Hodja takes the pan with both hands, as if it were a sleeping child.'),
            HO('Thank you. I promise to look after it. More than that I cannot promise.', 'soft'),
          ],
        },
      },
      {
        id: 'q89-s2',
        goal: 'Take the returned pan to Byte, and the little one inside it.',
        hint: 'Collect the big pan from the Hodja and bring it to Byte.',
        check: 'deliver:item:jam-pan:byte',
        scene: {
          id: 'q89-baby',
          lines: [
            N(
              'The Hodja brings the big pan back the next day. Inside it, snug and clean, sits a small milk pan.',
            ),
            HO('Your cauldron has borne a child.', 'happy'),
            BY('It’s a jam pan.'),
            HO('A pan that big is only a cauldron with good manners.'),
            BY('And a pan can’t have a baby.'),
            HO('And yet here it is.', 'soft'),
            N(
              'Byte does not believe a word of it, but he keeps both pans. They are, in fairness, both his now.',
            ),
          ],
        },
      },
      {
        id: 'q89-s3',
        goal: 'Tell Byte that the big pan has not come back from the Hodja.',
        hint: 'Talk to Byte again after the Hodja asks for the big pan.',
        check: 'talk:byte:pan-dead',
        scene: {
          id: 'q89-dead',
          lines: [
            N(
              'Some days later the Hodja borrows the big pan again. This time he does not bring it back.',
            ),
            N('Byte comes looking, with a spoon in one hand and a very short temper.'),
            HO('I have bad news. The cauldron is dead.', 'sad'),
            BY('Dead? It’s a pan! Pans can’t die!', 'angry'),
            HO(
              'Hm. As you believed it could bear a child, why should you not believe that it can die?',
              'think',
            ),
            N('Byte opens his mouth, shuts it again and goes very quiet.'),
            N('Then, slowly, the corner of his mouth begins to twitch.'),
            BY('You absolute…', 'happy'),
            N(
              'He laughs until he has to sit down on a stump, and the Hodja pats him sympathetically on the head.',
            ),
          ],
          choices: [
            {
              id: 'laugh-along',
              label: 'Laugh with them.',
              then: [
                N('Your Nubbin laughs too, in the way Nubbins do, which is with its entire body.'),
              ],
            },
            {
              id: 'pat-byte',
              label: 'Pat Byte on the shoulder.',
              then: [BY('Don’t. I’m grieving.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q89-complete',
      lines: [
        N(
          'The little milk pan sits on a shelf in Byte’s kitchen with a ribbon on its handle. He refuses to say who tied it.',
        ),
        BY('I know it’s ridiculous. I’ve started talking to it.'),
        HO('That is entirely normal. I talk to the big one every night.', 'soft'),
        BY('You said it was dead!'),
        HO('The dead are good listeners.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'little-milk-pan',
        kind: 'decor',
        label: 'The Little Milk Pan',
        description:
          'A small milk pan with a ribbon on its handle. A decoration. (The big pan comes back in Q94.)',
      },
    ],
    childLines: {
      'q89-baby#1': 'Your big pan has had a baby!',
      'q89-dead#4': 'You believed a pan could have a baby. Why not believe it could die?',
    },
    notes:
      'The big pan leaves the game with the Hodja during step 3 and returns spotless in Q94. "Dead" is only a joke about a ' +
      'pan; keep it light, no funeral beat. Step 2 and step 3 are separated by a few in-game days of story time, not a real-time ' +
      'timer; step 3 begins as soon as step 2 is done and the player next visits Byte. In the Learning Grove line the second ' +
      'quote ("the cauldron is dead.") is replaced by Hodja: "I have bad news. The big pan has gone." The Borrow "cauldron" is ' +
      'kept in the main text, with Byte objecting that it is a jam pan.',
  },

  // ------------------------------------------------------------------ Q90
  {
    id: 'q90',
    code: 'Q90',
    title: 'The Moon in the Well',
    source: 'Nasreddin Hodja tales: the moon in the well (Borrow, 1884)',
    audience: 'all',
    trigger: { where: 'The old well behind the Workshop, on a full-moon night', when: WHEN_AFTER },
    requires: ['Q89'],
    speakers: [HODJA],
    steps: [
      {
        id: 'q90-s1',
        goal: 'Find a rope and a hook for the Hodja.',
        hint: 'Craft a rope at the Workshop and take a hook from the shed by the well.',
        check: 'find:item:well-rope-hook',
        scene: {
          id: 'q90-intro',
          lines: [
            N(
              'A full moon sits over the Workshop, round and bright as a plate. The Hodja is at the old well with his bucket.',
            ),
            HO('Come quickly. The moon has fallen into the well, I must pull it out.', 'shock'),
            N('You look down. There it is, small and silver, wobbling at the bottom.'),
            Y('Hodja, that’s only the reflection.'),
            HO('Look at it. It is clearly the moon. And somebody has to rescue it.', 'soft'),
            N('Your Nubbin peers over the edge and gasps. It does not need convincing.'),
          ],
          choices: [
            {
              id: 'explain',
              label: 'Try to explain reflections.',
              then: [
                HO('I know. It is a reflection. But what if it is also the moon?', 'think'),
                N('You cannot argue with that. You have tried.'),
              ],
            },
            {
              id: 'help',
              label: 'Fetch a rope and hook.',
              then: [HO('The best answer. It is also the only one with a rope.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q90-gear',
          lines: [
            N(
              'You fetch a long rope and a heavy iron hook from the shed. The Hodja ties it with a knot that looks more optimistic than secure.',
            ),
            HO('There. Now we lower it, slowly, so we do not frighten her.', 'soft'),
          ],
        },
      },
      {
        id: 'q90-s2',
        goal: 'Pull on the rope with the Hodja, and then lie down and look up.',
        hint: 'Use Pull on the rope, then Sit beside the Hodja.',
        check: 'sit:hodja:well-moon',
        scene: {
          id: 'q90-pull',
          lines: [
            N(
              'The hook goes down into the dark. It scrapes on something, and the Hodja leans back.',
            ),
            HO('She is heavy. Pull!', 'angry'),
            N(
              'You pull, your Nubbin pulls, and the donkey, tied to a post, also pulls, in the wrong direction.',
            ),
            N(
              'The hook has caught a stone. The rope goes tight, and tighter, and then snaps with a twang.',
            ),
            N(
              'The Hodja goes over backwards and lands flat on the grass, with his turban over one eye.',
            ),
            HO('I have suffered much pain, but the moon has got to its place again.', 'happy'),
          ],
        },
        done: {
          id: 'q90-sky',
          lines: [
            N(
              'The moon is up there, calmly shining, exactly where she always is. He looks at her for a long time.',
            ),
            N('Your Nubbin lies down on the grass beside him to look too.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q90-complete',
      lines: [
        N(
          'You lie there for a while, the three of you. The grass is cool, and the moon is very bright.',
        ),
        HO(
          'Hard work. But worth it. A night without a moon is a night someone has to answer for.',
          'soft',
        ),
        N('Down in the well the little silver moon is still there, shaking gently.'),
        HO('Another one. Fine. I will fetch it tomorrow.', 'happy'),
        N(
          'He does not. But he does hang the bucket from the old rope, and the moon sits in it on full-moon nights.',
        ),
      ],
    },
    rewards: [
      {
        id: 'moon-well-bucket',
        kind: 'decor',
        label: 'The Moon Bucket',
        description: 'A well-bucket decoration. On full-moon nights, the moon shows in the water.',
      },
    ],
    childLines: {
      'q90-intro#1': 'Come quickly! The moon has fallen into the well!',
      'q90-pull#5': 'Look! I got it out. It’s all the way back up in the sky.',
    },
    notes:
      'Plays only on a full-moon night in the Free Grove or campaign (never during Chapters 9–11). The well is behind the ' +
      'Workshop. The reflection is a small bright disc in the water, with a gentle wobble. The rope snaps off-screen after the ' +
      'hook sticks; the Hodja lands on his back on the grass. Keep it light: no injury, no fall into the well. The bucket ' +
      'decoration shows a moon disc in the water only when the sim moon is full.',
  },

  // ------------------------------------------------------------------ Q91
  {
    id: 'q91',
    code: 'Q91',
    title: 'The Smell of Soup',
    source: 'Nasreddin Hodja tales: the smell of soup and the sound of coins (traditional)',
    audience: 'all',
    trigger: { where: 'The new soup stall at the lane’s end, on a market day', when: WHEN_AFTER },
    requires: ['Q90'],
    speakers: [HODJA, LADLE],
    steps: [
      {
        id: 'q91-s1',
        goal: 'Walk the stall-keeper and the traveller to the Hodja.',
        hint: 'Talk to the stall-keeper at the soup stall, then take both to the big tree.',
        check: 'escort:soup-keeper:hodja',
        scene: {
          id: 'q91-intro',
          lines: [
            N(
              'A new soup stall has opened at the end of the lane, with a striped awning and a pot the size of a bath.',
            ),
            N(
              'Beside it, a thin traveller sits on a milk crate with a heel of dry bread. He holds it up to the steam with great concentration.',
            ),
            LA('You! That will be two shells.', 'angry'),
            N('The traveller blinks. He has not bought any soup.'),
            LA(
              'You ate bread next to my soup. You smelled it. Nothing here is free, not even the air near the pot.',
            ),
            Y('He’s only had dry bread.'),
            LA('Flavoured with my steam! Two shells, or I fetch the Hodja.'),
            N(
              'This turns out to be a mistake on her part. The Hodja is already walking down the lane.',
            ),
          ],
          choices: [
            {
              id: 'bring-them',
              label: 'Take them both to the big tree.',
              then: [HO('Excellent. A dispute. I have not had one since breakfast.', 'happy')],
            },
            {
              id: 'pay-self',
              label: 'Offer to pay the two shells yourself.',
              then: [
                HO('Generous. But not yet. Let the matter have its day.', 'soft'),
                LA('I want a judge, not a donation.', 'angry'),
              ],
            },
          ],
        },
        done: {
          id: 'q91-arrived',
          lines: [
            N(
              'A small crowd gathers under the big tree. The Hodja hears both sides with his chin in his hand and his eyes closed.',
            ),
            N(
              'At the end of the traveller’s side, he opens one eye, and at the end of the stall-keeper’s side he opens the other.',
            ),
          ],
        },
      },
      {
        id: 'q91-s2',
        goal: 'Stand by while the Hodja judges the smell of the soup.',
        hint: 'Watch the Hodja’s judgement at the big tree.',
        check: 'watch:hodja:soup-judgement',
        scene: {
          id: 'q91-judge',
          lines: [
            HO('So. The traveller has smelled the soup. And the soup has a price.', 'think'),
            LA('Two shells!'),
            N(
              'The Hodja takes a small leather purse out of his sleeve. He holds it up to the stall-keeper’s ear and gives it a good, slow jingle.',
            ),
            N('Coins chime. The crowd goes very still.'),
            HO('You sold him a smell. He pays you with a sound. Fair is fair.', 'happy'),
            LA('But that’s only the sound!', 'angry'),
            HO('And his was only the smell. Besides, these are my coins. I am keeping them. Sound is free.'),
            N(
              'The crowd, who have been waiting for exactly this, break into applause. The stall-keeper looks at her pot, and then, to her credit, laughs.',
            ),
            LA('All right. I didn’t think of it like that.', 'soft'),
          ],
        },
        done: {
          id: 'q91-bowl',
          lines: [
            N(
              'She fills a bowl of soup, and then another, and puts them in front of the traveller and the Hodja.',
            ),
            LA('Free. The smell was worth it.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q91-complete',
      lines: [
        N(
          'The traveller eats the soup slowly, with his eyes closed, and says nothing for a long time.',
        ),
        N(
          'Then he thanks everyone, three times, and goes on his way with a bag of bread under his arm.',
        ),
        HO(
          'The soup was very good. I can say so with confidence, having heard it a great deal in the last hour.',
        ),
        N(
          'The stall-keeper keeps the purse for the rest of the day, jingling it whenever somebody sniffs.',
        ),
      ],
    },
    rewards: [
      {
        id: 'soup-pot-stall',
        kind: 'decor',
        label: 'Soup-Pot Stall',
        description: 'A little striped stall with a big soup pot. A decoration.',
      },
    ],
    notes:
      'Payoff of Q87: if q87-gift is "seat", replace the Q91 step 2 scene q91-judge with the variant scene ' +
      '"q91-judge-seat" (QUESTS_HODJA_VARIANTS): the Hodja asks the player to sit beside him as the second judge. ' +
      'Otherwise (coat, watch) play q91-judge as written. The judgement is told in our own words; the traditional point is ' +
      'that the sound of coins pays for the smell of soup. No timers; the stall is permanent after the quest. ' +
      'The stall-keeper "Merrow Ladle" is a valley character who does not appear elsewhere in the pack.',
  },

  // ------------------------------------------------------------------ Q92
  {
    id: 'q92',
    code: 'Q92',
    title: 'Do You Know What I’ll Say?',
    source:
      'Nasreddin Hodja tales: do ye not know what I am going to say (Borrow, 1884; set at the schoolhouse)',
    audience: 'all',
    trigger: { where: 'The schoolhouse, on a quiet afternoon', when: WHEN_AFTER },
    requires: ['Q91'],
    speakers: [HODJA, SPARKS],
    steps: [
      {
        id: 'q92-s1',
        goal: 'Help Sparks set out the benches and welcome the Hodja to the schoolhouse.',
        hint: 'Carry the benches in and talk to Sparks.',
        check: 'place:decor:school-bench:schoolhouse',
        scene: {
          id: 'q92-intro',
          lines: [
            N(
              'The valley wants a proper talk from the Hodja, and the schoolhouse has been swept for the occasion.',
            ),
            SP(
              'I organised it. Everybody’s coming. If he says no, I’ve told them it’s a surprise.',
              'happy',
            ),
            N(
              'Benches are being carried in. Your Nubbin is standing in the middle of one, directing.',
            ),
            SP('You do the benches. I’ll do the speech of welcome. It’s very short. It has to be.'),
          ],
        },
        done: {
          id: 'q92-ready',
          lines: [
            N(
              'A dozen benches, a slate on an easel, a vase of late asters. The Hodja arrives with his donkey, and ties it to the porch.',
            ),
            HO('A fine room. Thank you. I will try not to waste it.', 'soft'),
          ],
        },
      },
      {
        id: 'q92-s2',
        goal: 'Keep a straight face through the Hodja’s three talks.',
        hint: 'Sit at the back and use Listen. Try not to laugh.',
        check: 'sit:schoolhouse:hodja-talk',
        scene: {
          id: 'q92-talk',
          lines: [
            N(
              'The room is packed. The Hodja climbs onto the little platform, turns around twice, and clears his throat.',
            ),
            HO('Friends. Before I begin: do ye not know what I am going to say to you?', 'think'),
            N(
              'A murmur. Someone at the back calls out “No!” Sparks is sitting very upright, mouth pressed shut.',
            ),
            HO('Then there is no point in my telling you. Good afternoon.', 'happy'),
            N(
              'He climbs down, collects his donkey and goes home. The room is silent for quite some time.',
            ),
            N('The next afternoon they all shout “Yes!” before he has finished the question.'),
            HO('Then you do not need me. Good afternoon.'),
            N('Sparks has her hand over her mouth. Her shoulders are shaking.'),
            N(
              'On the third afternoon the room is split. Half the benches shout “Yes!” and the other half shout “No!”',
            ),
            HO('Wonderful. Those who know can tell those who do not. I will have a nap.', 'happy'),
          ],
          choices: [
            {
              id: 'straight-face',
              label: 'Keep a perfectly straight face.',
              then: [SP('How are you doing that? You’re not even blinking.', 'happy')],
            },
            {
              id: 'poke-sparks',
              label: 'Nudge Sparks, very gently.',
              then: [SP('Don’t! I’m the chair of this meeting!', 'shock')],
            },
          ],
        },
        done: {
          id: 'q92-nap',
          lines: [
            N(
              'The Hodja goes out on to the porch, takes off his turban and puts it over his face.',
            ),
            N(
              'Behind him, the audience turns to one another, and the people who know begin to teach the ones who do not.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'q92-complete',
      lines: [
        N(
          'By sunset, the whole schoolhouse is full of small conversations. The slate has a drawing of a donkey on it.',
        ),
        SP('I think that was the best talk I’ve ever heard. And he didn’t say anything.', 'happy'),
        HO('That is the best kind. Nobody can say you were wrong.', 'soft'),
        N(
          'Sparks hangs a little brass bell on the porch, to call people in, and gives it a small ring.',
        ),
        N('The donkey brays, as if it were part of the plan.'),
      ],
    },
    rewards: [
      {
        id: 'schoolhouse-bell',
        kind: 'decor',
        label: 'The Schoolhouse Bell',
        description: 'A little brass bell for the schoolhouse porch. A decoration.',
      },
    ],
    childLines: {
      'q92-talk#1': 'Friends. Before I begin: do you know what I am going to say?',
      'q92-talk#9': 'Half of you know? Wonderful. Teach the other half. I’ll nap.',
    },
    notes:
      'Set in the schoolhouse (not a mosque, and no prayer or sermon imagery). The three talks play in one scene; stage them ' +
      'as a short cut-away montage over three days of story time, not three real weeks and not a timer. Sparks keeps a ' +
      'straight face through the first and loses it by the third. The donkey is on the porch and brays at the wrong moment. ' +
      'The Borrow quote is trimmed to "do ye not know what I am going to say to you?"',
  },

  // ------------------------------------------------------------------ Q93
  {
    id: 'q93',
    code: 'Q93',
    title: 'Counting the Donkeys',
    source: 'Nasreddin Hodja tales: the donkeys he forgets to count (traditional)',
    audience: 'all',
    trigger: { where: 'The lane from the market, on a market day', when: WHEN_AFTER },
    requires: ['Q92'],
    speakers: [HODJA],
    steps: [
      {
        id: 'q93-s1',
        goal: 'Count the Hodja’s donkeys with him.',
        hint: 'Stand beside the Hodja on the lane and use Count.',
        check: 'puzzle:count:hodja-donkeys',
        scene: {
          id: 'q93-intro',
          lines: [
            N(
              'The Hodja has bought seven donkeys at market to carry the valley’s apples. He rides home on the first, and the rest follow in a line.',
            ),
            HO('One, two, three, four, five, six. Six! Where has one gone?', 'shock'),
            N(
              'The donkey he is riding looks round at him, and at its six companions, and says nothing.',
            ),
            Y('Hodja, can I count them?'),
            HO(
              'Please. I have counted three times and I get six every time. It is most distressing.',
            ),
            N(
              'You count. One, two, three, four, five, six, and then, one more: the one under the Hodja.',
            ),
          ],
          choices: [
            {
              id: 'seven',
              label: 'Seven. You’re sitting on the seventh.',
              then: [HO('Nonsense. I would know it if I were sitting on one.', 'think')],
            },
            {
              id: 'point',
              label: 'Count them out loud, pointing.',
              then: [
                HO(
                  'You say seven. But I have not got seven, I have got six, and a very sore conscience.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'q93-seven',
          lines: [
            N(
              'Seven, every time. Your Nubbin counts them too, on its fingers, and then on its toes, to be safe.',
            ),
            HO('Remarkable. I will get down and look.', 'think'),
          ],
        },
      },
      {
        id: 'q93-s2',
        goal: 'Count again once he is back on foot, and tell him which donkey is missing.',
        hint: 'Count again when the Hodja has dismounted. Then tell him which donkey is the lost one.',
        check: 'puzzle:count:hodja-donkeys:solve',
        scene: {
          id: 'q93-again',
          lines: [
            N(
              'He climbs down, walks along the line, and counts them carefully, tapping each one with his finger.',
            ),
            HO('One, two, three, four, five, six, seven. Seven! They are all here.', 'happy'),
            N(
              'He climbs up again, settles on the back of the first donkey and counts once more, looking back along the line.',
            ),
            HO('Six. Six! They have gone again.', 'shock'),
            N('He gets down and counts seven, then gets up and counts six.'),
            HO(
              'I see. It is a very clever arrangement. When I ride, I lose a donkey. When I walk, I gain one.',
              'think',
            ),
            HO('Riding is a luxury I cannot afford. I will walk.', 'happy'),
          ],
          choices: [
            {
              id: 'tell-him',
              label: 'Tell him he forgets the donkey he’s sitting on.',
              then: [
                HO(
                  'You think I forgot? I am a teacher! I forget nothing. I only misplace.',
                  'soft',
                ),
              ],
            },
            {
              id: 'let-him',
              label: 'Say nothing. Let him walk.',
              then: [
                N(
                  'Your Nubbin climbs onto the lead donkey, facing backwards, as if it had been doing it all its life.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'q93-walk',
          lines: [
            N('The Hodja walks home with seven donkeys behind him, whistling.'),
            N('Your Nubbin rides on the first one, and counts them again, just in case.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q93-complete',
      lines: [
        N('The apples are carried down to the cellars on the backs of seven very patient donkeys.'),
        HO(
          'You may tell the children I am a genius. Or you may tell them to count. Both are true.',
          'happy',
        ),
        N(
          'The valley children go home counting everything in sight: chickens, windows, each other’s noses.',
        ),
        N(
          'That evening one of them hands the Hodja a row of wooden toy donkeys. There are six, and a half-finished seventh.',
        ),
        HO(
          'Six and a half. Better than nothing. It is the most honest count I have had all day.',
          'soft',
        ),
      ],
    },
    rewards: [
      {
        id: 'donkey-train',
        kind: 'decor',
        label: 'The Donkey Train',
        description: 'A line of six (and a half) wooden toy donkeys. A decoration.',
      },
    ],
    notes:
      'Works as a simple counting puzzle: the player counts seven, the Hodja counts six. The missing donkey is always the one ' +
      'he is sitting on, so the player can work it out each time. The donkey line is a new set of identical donkeys, one of ' +
      'which the Hodja rides; keep them gentle and slow. Told in our own words (no Borrow).',
  },

  // ------------------------------------------------------------------ Q94
  {
    id: 'q94',
    code: 'Q94',
    title: 'What If It Takes?',
    source: 'Nasreddin Hodja tales: the yoghurt pond, "what if it takes?" (traditional)',
    audience: 'all',
    trigger: { where: 'The edge of the pond', when: WHEN_AFTER },
    requires: ['Q93'],
    speakers: [HODJA, BYTE],
    steps: [
      {
        id: 'q94-s1',
        goal: 'Find out what the Hodja is doing at the pond.',
        hint: 'Go to the pond and talk to the Hodja.',
        check: 'talk:hodja:yoghurt-pond',
        scene: {
          id: 'q94-intro',
          lines: [
            N(
              'The Hodja is at the edge of the pond with a spoon in one hand and Byte’s big jam pan in the other.',
            ),
            N(
              'The pan is full of thick white yoghurt. He is tipping it into the water, a spoonful at a time.',
            ),
            Y('Hodja, what are you doing?'),
            HO(
              'I am making a pond of yoghurt. A little goes in, and the rest should follow.',
              'soft',
            ),
            BY('That’s my pan! The dead one! And a pond can’t set!', 'angry'),
            HO('Shh. It is resting.', 'soft'),
            HO('I know. It will not work.', 'think'),
            HO('But just imagine if it did!', 'happy'),
          ],
          choices: [
            {
              id: 'explain',
              label: 'Explain how yoghurt really works.',
              then: [
                HO('A little live yoghurt, warm milk, patience. Yes. I know. I am a teacher.'),
                HO('But a cold pond is a cold pond, and a hopeful man is a hopeful man.', 'soft'),
              ],
            },
            {
              id: 'join-in',
              label: 'Hold the pan while he spoons.',
              then: [HO('A good assistant. You may have a share of the lake.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q94-spooned',
          lines: [
            N(
              'The last of the yoghurt goes in. It spreads over the surface in a thin pale cloud and sinks.',
            ),
            HO('Now we wait. Very still. Very quiet.', 'soft'),
          ],
        },
      },
      {
        id: 'q94-s2',
        goal: 'Sit still by the pond and watch the water.',
        hint: 'Stay sitting beside the pond for a while.',
        check: 'sit:pond:watch-water',
        scene: {
          id: 'q94-wait',
          lines: [
            N(
              'Your Nubbin sits at the edge of the water with its chin on its knees and watches for a very long time.',
            ),
            N('A dragonfly lands on the water, and takes off again. The yoghurt has gone.'),
            HO('Still there? Anything?', 'think'),
            N('Your Nubbin shakes its head, very slowly, and carries on watching.'),
            HO('No. It has not set. But look at the ripples.', 'soft'),
            HO('And what if it had? Imagine that. A whole pond of it.', 'happy'),
          ],
        },
        done: {
          id: 'q94-ripples',
          lines: [
            N(
              'The pond is clear and cool and exactly the same as it was this morning. Possibly it is a little more delicious.',
            ),
            BY('If you’ve finished, I’d like my pan back.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q94-complete',
      lines: [
        N(
          'Byte has his big jam pan again. It has been washed in the pond until it shines like a mirror.',
        ),
        BY('It’s spotless. It’s cleaner than it was when I bought it.'),
        HO('The dead are always cleaner. It is a known fact.', 'happy'),
        BY('You said it was dead!'),
        HO('It has been resurrected. The pond is a very forgiving place.', 'soft'),
        N(
          'Byte puts the pan under his arm and the little milk pan on top, and walks back up the hill muttering.',
        ),
        N('He is smiling. He thinks nobody can see.'),
      ],
    },
    rewards: [
      {
        id: 'what-if-emote',
        kind: 'cosmetic',
        label: '“What If” Emote',
        description: 'Your Keeper crosses their fingers and looks hopeful.',
      },
    ],
    childLines: {
      'q94-intro#7': 'I know it won’t work. But just imagine if it did!',
    },
    notes:
      'Byte’s big jam pan returns here, spotless, after "dying" in Q89. The yoghurt is a white cloud on the pond surface, ' +
      'nothing more; the pond must never be left looking spoiled. The Hodja knows it will not work; that is the whole joke. ' +
      'The traditional punchline is "what if it takes?" (Turkish "Ya tutarsa?"), in our own wording.',
  },

  // ------------------------------------------------------------------ Q95
  {
    id: 'q95',
    code: 'Q95',
    title: 'You Are Right, Too',
    source: 'Nasreddin Hodja tales: "you are right, too" (traditional)',
    audience: 'all',
    trigger: { where: 'The dojo, then the big tree by the pond', when: WHEN_AFTER },
    requires: ['Q94'],
    speakers: [HODJA, SPARKS, PIXEL],
    steps: [
      {
        id: 'q95-s1',
        goal: 'Walk Sparks and Pixel to the Hodja.',
        hint: 'Talk to Sparks and Pixel at the dojo, then take them to the big tree.',
        check: 'escort:sparks:hodja',
        scene: {
          id: 'q95-intro',
          lines: [
            SP('It’s my turn on the practice mat. I booked it on Tuesday.', 'angry'),
            PX('You said you’d be there at six. I got there at six. It’s my turn.', 'angry'),
            N(
              'They have been going round this for ten minutes. Your Nubbin has long since sat down.',
            ),
            SP('We need someone to decide. Someone with no stake.'),
            PX('Someone with a donkey.'),
          ],
        },
        done: {
          id: 'q95-arrive',
          lines: [
            N(
              'You steer them under the big tree. The Hodja listens to all of it, nodding, and stirring his tea.',
            ),
          ],
        },
      },
      {
        id: 'q95-s2',
        goal: 'Stay and hear the Hodja’s judgement.',
        hint: 'Sit down and listen to the Hodja.',
        check: 'sit:hodja:judgement',
        scene: {
          id: 'q95-judge',
          lines: [
            HO('Sparks. You have told me what happened. You are right.', 'soft'),
            SP('Thank you!', 'happy'),
            HO('Pixel. You have told me what happened. You are right.'),
            PX('Thank you!', 'happy'),
            Y('They can’t both be right.', 'think'),
            HO('You are right, too.', 'happy'),
            N(
              'Sparks and Pixel look at one another. Pixel’s mouth starts to twitch, and then Sparks’s.',
            ),
            SP('That is the worst judgement I’ve ever heard.', 'happy'),
            PX('Take turns?', 'happy'),
            SP('Take turns. I’ll go first. No, you.', 'soft'),
          ],
          choices: [
            {
              id: 'protest',
              label: 'It’s still not logical.',
              then: [HO('Logic is a fine thing. It cannot carry a bucket of tea.', 'soft')],
            },
            {
              id: 'accept',
              label: 'Laugh and accept it.',
              then: [
                HO(
                  'A wise answer. It means you have understood nothing, and yet everything.',
                  'happy',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'q95-tea',
          lines: [
            N(
              'Sparks and Pixel go off arm in arm to the dojo, arguing over who should hold the door.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'q95-complete',
      lines: [
        N(
          'The Hodja pours another cup of tea and pats the roots of the big tree as if it were a friend.',
        ),
        HO(
          'Well. I have decided to stay. The tree is comfortable, the pond is useful, and the children have not learned anything yet.',
        ),
        Y('Nothing?'),
        HO('Not a single thing. Which means there is plenty left to teach.', 'happy'),
        N(
          'The donkey brays on cue, from the shade, and your Nubbin climbs up to ride it backwards, facing the tree.',
        ),
      ],
    },
    rewards: [
      {
        id: 'hodja-parting-gift',
        kind: 'cosmetic',
        label: 'The Hodja’s Gift',
        description:
          'A cosmetic for your Keeper, chosen by how you treated him at the Supper (Q87): his fur coat if you gave your seat, a mended coat if you fetched one, or a single fur button if you watched.',
      },
    ],
    childLines: {
      'q95-judge#5': 'You’re right. And you’re right. And so are you. Who wants tea?',
    },
    notes:
      'Payoff of Q87: after the complete scene, play one of the variant scenes "q95-gift-seat", "q95-gift-coat" or ' +
      '"q95-gift-watch" (QUESTS_HODJA_VARIANTS), chosen by q87-gift. The three gifts are cosmetic only. The Hodja is a resident ' +
      'under the big tree by the pond after this quest (idle lines and one-liners for the valley children; nothing repeats as a ' +
      'task). In the Learning Grove, the line "You are right, too." is kept in the main text as the signature joke; ' +
      'the childLine replaces the whole judgement beat with "You’re right. And you’re right. And so are you. Who wants tea?"',
  },
];

// ---------------------------------------------------------------- variants

/**
 * Variant scenes chosen by the cosmetic flag `q87-gift` ('seat' | 'coat' | 'watch').
 * - `q91-judge-seat` replaces `q91-judge` when q87-gift is 'seat'.
 * - `q95-gift-*` plays right after `q95-complete`, one per value.
 */
export const QUESTS_HODJA_VARIANTS: Scene[] = [
  {
    id: 'q91-judge-seat',
    lines: [
      HO('So. The traveller has smelled the soup. And the soup has a price.', 'think'),
      HO(
        'Friend, you gave me your seat at the Supper, when I had mud on my knees. Please. Sit beside me. We will judge it together.',
        'soft',
      ),
      N(
        'A bench is pulled out. You sit next to the Hodja, and your Nubbin climbs on your lap to look serious.',
      ),
      LA('Two shells!'),
      N(
        'The Hodja takes a small leather purse out of his sleeve and holds it up to the stall-keeper’s ear. He gives it a good, slow jingle.',
      ),
      HO('You sold him a smell. He pays you with a sound. Fair is fair.', 'happy'),
      LA('But that’s only the sound!', 'angry'),
      HO('And his was only the smell. What does my second judge say?'),
      Y('I say the sound is fair.', 'happy'),
      N(
        'The crowd, who have been waiting for exactly this, break into applause. The stall-keeper looks at her pot, and then, to her credit, laughs.',
      ),
      LA('All right. I didn’t think of it like that.', 'soft'),
    ],
  },
  {
    id: 'q95-gift-seat',
    lines: [
      HO(
        'One more thing. At the Supper you gave me your seat, and your bowl, and a fine coat grew out of it.',
        'soft',
      ),
      N('He takes off the magnificent fur coat and holds it out to you, with both hands.'),
      HO('It has eaten enough.', 'happy'),
      N('You put it on. It is very warm, and smells a little of soup.'),
    ],
  },
  {
    id: 'q95-gift-coat',
    lines: [
      HO('One more thing. At the Supper you fetched me a coat. Here it is.', 'soft'),
      N(
        'He hands you the clean coat you gave him. It has been mended at the elbow, with very small, very careful stitches.',
      ),
      HO('I looked after it, as I said. A little, and with a needle.', 'happy'),
      N('You put it on. It fits better than it ever did.'),
    ],
  },
  {
    id: 'q95-gift-watch',
    lines: [
      HO(
        'One more thing. At the Supper you only watched. That was patient. It deserves something.',
        'soft',
      ),
      N(
        'He snips a single round button off the sleeve of the fur coat and presses it into your palm.',
      ),
      HO('One fur button. The rest of the coat is still eating.', 'happy'),
      N('Your Nubbin looks at the button, and then at the coat, with great respect.'),
    ],
  },
];

export const QUESTS_HODJA_FLAGS: string[] = ['q87-gift'];

export const QUESTS_HODJA_CHECKS: string[] = [
  'talk:hodja:dismount',
  'give:item:water:hodja-donkey',
  'talk:hodja:supper',
  'watch:hodja:feed-coat',
  'talk:hodja:borrow-donkey',
  'give:item:jam-pan:hodja',
  'deliver:item:jam-pan:byte',
  'talk:byte:pan-dead',
  'find:item:well-rope-hook',
  'sit:hodja:well-moon',
  'escort:soup-keeper:hodja',
  'watch:hodja:soup-judgement',
  'place:decor:school-bench:schoolhouse',
  'sit:schoolhouse:hodja-talk',
  'puzzle:count:hodja-donkeys',
  'puzzle:count:hodja-donkeys:solve',
  'talk:hodja:yoghurt-pond',
  'sit:pond:watch-water',
  'escort:sparks:hodja',
  'sit:hodja:judgement',
];
