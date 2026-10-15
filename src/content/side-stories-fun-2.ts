/**
 * Side stories S6–S8 for "Hazel’s Grove" (story bible v2): the for-fun ones.
 *
 * S6 Ash’s True Name · S7 Unverified · S8 The Warren in the Hollow.
 *
 * None of these changes the campaign. Each sets only its own done flag (s6Done, s7Done,
 * s8Done) and a few harmless local flags prefixed s6- / s7- / s8-. No campaign flag is
 * read or written here; where a trigger depends on campaign state, the quest’s
 * `trigger` and `notes` say so for the implementer.
 *
 * All dialogue is original. No outside quotes are used, so there are no childLines.
 * Audience 'all' throughout.
 *
 * Branching: Scene and Choice have no condition fields, so a branch is a separate scene in
 * SIDE_STORIES_FUN_2_VARIANTS (as in side-stories-main.ts). The quest’s `notes` say which variant
 * replaces which scene, and when. New id: s8-complete-dawn (S8).
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const Y = say('you');
const E = say('ember');
const F = say('fern');
const H = say('hazel');
const M = say('moss');
const B = say('byte');
const P = say('pixel');
const NO = say('nova');

// ---------------------------------------------------------------- side speakers
const ASH: Speaker = { id: 'ash', name: 'Ash', kind: 'nubbin' };
const NULL_: Speaker = { id: 'null', name: 'Null', kind: 'nubbin' };
const BRAMBLE: Speaker = { id: 'bramble', name: 'Bramble', kind: 'nubbin' };

const A = say('ash');
const NU = say('null');
const BR = say('bramble');

// ================================================================== S8 shared pieces
/** The end of S8’s complete scene, shared by s8-complete and its variant s8-complete-dawn. */
const S8_COMPLETE_TAIL: Line[] = [
  H('Take this one home, then, love. Nothing’s mine. I only carry things for a bit.'),
  N('At the ring the thin one wakes in your arms, sees her mother, and goes stiff all over with joy.'),
  N('Bramble washes her, ear to ear. Then she noses the old brown ribbon off her folded ear and drops it at your feet.'),
  N('Behind her, three strays stand up and look at you, as if waiting to see where you go next.'),
  NO('That’s you invited. Come whenever you like. Bring soft fruit.', 'soft'),
];

export const SIDE_STORIES_FUN_2: Quest[] = [
  // ================================================================== S6
  {
    id: 's6',
    code: 'S6',
    title: 'Ash’s True Name',
    source: 'Original (Hazel’s Grove story bible v2): a first sound kept in a ledger, and a name given back',
    audience: 'all',
    trigger: {
      where: 'Ember’s house; then the cottage bookshelf and the pond; ends in Ember’s kitchen',
      when:
        'The morning after chapter 9 closes (c9-close), only if Ash left Corvin’s garden in chapter 9 ' +
        '(corvin is reconciled, bargained or forced). Never offered on the collector route.',
    },
    speakers: [ASH],
    steps: [
      // ------------------------------------------------ 1. Ember’s kitchen
      {
        id: 's6-s1',
        goal: 'Ember has asked you over. Go and see Ash.',
        hint: 'Ember’s house is past the dojo on the Moon side. Knock; she’ll pretend she wasn’t waiting.',
        check: 'talk:ember:s6-kitchen',
        scene: {
          id: 's6-kitchen',
          lines: [
            N('A note under your door at dawn: COME OVER. Then PLEASE, crossed out, and written again.'),
            N('Ember’s house is tidy the way a house gets when someone cleans because they’re angry. It is very tidy.'),
            E('She’s out. Don’t ask how. I don’t care how, and I’m never going to care how.'),
            N('A grey Nubbin sits in the corner of the kitchen, facing the wall. Beside her is a full bowl.'),
            E('Ash.'),
            E('Ash, love. It’s me. Ash.', 'soft'),
            N('The grey Nubbin does not turn. A drip falls from the tap, and she does not turn for that either.'),
            E('Four hundred and twelve times since yesterday. I counted. Tell Byte I counted and I’ll deny it.'),
            E('She eats when I leave the room. She sleeps standing up. It isn’t her name any more. It’s just a noise.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit on the floor near Ash, and wait.',
              friendship: { ember: 1 },
              then: [
                N('You sit, for a long time. Ash doesn’t look at you, but she stops pressing quite so hard into the wall.'),
                E('…Hazel used to do that. Sit on the floor like it was a chair. It drove me mad.', 'soft'),
              ],
            },
            {
              id: 'say-it',
              label: 'Say “Ash” yourself, gently.',
              then: [
                N('Ash doesn’t turn. Ember lets out a breath that might be relief.'),
                E('See? It’s not me. It isn’t just me.', 'sad'),
              ],
            },
            {
              id: 'what-called',
              label: 'Ask what Corvin called her.',
              then: [
                E('Nothing. He didn’t call them anything. He just stood where they could see him.', 'angry'),
                E('Years of nobody saying her name. You’d forget too.'),
              ],
            },
          ],
        },
        done: {
          id: 's6-egg',
          lines: [
            N('Ember puts the kettle on and doesn’t make any tea.'),
            E('When she was tiny she answered to everything. Her name, my name, the kettle.'),
            E('I named her Ash a week after I got her. Before that she was just the egg from Hazel’s.', 'think'),
            E('Go home. Thanks for coming. Don’t make it a thing.'),
          ],
        },
      },
      // ------------------------------------------------ 2. the hatch register
      {
        id: 's6-s2',
        goal: 'Look for anything Hazel wrote about the egg she gave Ember.',
        hint: 'Inside the cottage, tap the bookshelf by the stove. Hazel kept her ledgers on the bottom shelf.',
        check: 'find:item:hatch-register:cottage-bookshelf',
        scene: {
          id: 's6-fern',
          lines: [
            N('Fern is leaning on the fence between your gardens, eating an apple she has clearly taken from your tree.'),
            F('You’ve been at Ember’s. You’ve got the look. It’s the look of someone told not to make it a thing.', 'think'),
            Y('Ash won’t answer to her name.'),
            F('Ember asked you over? Ember doesn’t like anyone. She doesn’t like me, and I’m delightful.', 'shock'),
            F('…Poor Ash. Poor Ember. Don’t tell her I said “poor”.', 'sad'),
            Y('Ash came from one of Hazel’s eggs.'),
            F('Then she’s in the book. Hazel wrote down every egg she ever gave away. And the first noise each one made.', 'think'),
            F('“For the record,” she said. Whose record, I said. “Theirs,” she said.'),
            F('Bottom shelf, behind the jam. Don’t eat the jam. Nobody knows what the jam was.'),
          ],
        },
        done: {
          id: 's6-register',
          lines: [
            N('Behind the jam: a fat ledger, soft at the corners. On the cover, in Hazel’s hand: “EGGS.”'),
            N('Underneath, smaller: “Do not lend this to Byte.”'),
            N('Halfway through, a section starts under a heading underlined twice: “Given away.”'),
            N('Forty years of eggs, in pencil, with the weather. You can’t help reading the others on the way.'),
            H('“Egg 7. Given to Sparks, aged six. First sound: a bang. Not from the egg. From Sparks.”', 'happy'),
            H('“Egg 23. Given to Byte, who asked for a receipt. Gave him one. First sound: a hiccup. He wrote that down too.”', 'think'),
            H('“Egg 41. Given to Ember, aged fifteen, very serious. Promised to feed it before herself. Meant it.”', 'soft'),
            H('“First sound: three notes. Low, high, and a little one at the end, like a question.”'),
            N('Hazel has drawn the notes as three dots: low, high, and a tiny one trailing upwards.'),
          ],
        },
      },
      // ------------------------------------------------ 3. practice by the pond
      {
        id: 's6-s3',
        goal: 'Take the register to Ember, and practise the three notes by the pond.',
        hint: 'Pick the pattern Hazel wrote down. There’s no timer, and a wrong try costs nothing.',
        check: 'choose:s6-notes:low-high-question',
        scene: {
          id: 's6-practise',
          lines: [
            N('Ember reads the page twice. Then she shuts the book on her own thumb, on purpose.'),
            E('And if I do it and she doesn’t turn round?', 'sad'),
            E('Right now she’s lost. If I call her real name and she still doesn’t turn, she’s gone. I’d rather have lost.'),
            N('She follows you to the pond anyway, with the register under her arm, scowling at the water.'),
            E('I can’t sing. Don’t ask me to sing. I can whistle.'),
            E('You first. I’m not doing it till I know it doesn’t sound stupid.'),
            N('Your Nubbins gather on the bank to watch. It is the most interesting thing to happen all week.'),
            E('Low, high, little one. Like a question. If a duck answers, we’re stopping.'),
            N('There are no ducks on the pond. Ember checks anyway.'),
          ],
          choices: [
            {
              id: 'high-low-question',
              label: 'Whistle: high, low, a little one.',
              then: [
                N('One of your Nubbins sneezes. Ember laughs once, before she can stop it.'),
                E('That was a duck. Again.', 'happy'),
              ],
            },
            {
              id: 'low-question-high',
              label: 'Whistle: low, a little one, high.',
              then: [
                N('The last note goes up and keeps going, like a kettle.'),
                E('That’s not a question. That’s a complaint. Again.', 'happy'),
              ],
            },
            {
              id: 'low-high-question',
              label: 'Whistle: low, high, and a little one at the end.',
              set: { 's6-notes': true },
              friendship: { ember: 2 },
              then: [
                N('Low, high, and a small one tipped up at the end, like a question.'),
                N('Every Nubbin on the bank turns its head at once. Your first one trots over to see who called.'),
                E('…Oh.', 'soft'),
                E('Again. Slower. I want to hear it.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 's6-ember-tries',
          lines: [
            N('Ember puts two fingers in her mouth and whistles the three notes, quietly, to nobody.'),
            N('Your Nubbins don’t come to her; they don’t know her.'),
            N('From the far side of the pond, a duck nobody has ever seen before answers, loudly.'),
            E('No.', 'angry'),
            N('Ember glares at the duck until it leaves. It takes a while. It is a very confident duck.'),
            N('It doesn’t matter. She heard herself do it.'),
            E('Tonight. Before I can think about it. You’re coming, and you’re not saying anything.'),
          ],
        },
      },
      // ------------------------------------------------ 4. the whistle
      {
        id: 's6-s4',
        goal: 'Be in Ember’s kitchen when she whistles to Ash.',
        hint: 'Go to Ember’s house after dark. Stand by the door and let her do it.',
        check: 'watch:ember:whistle:ash',
        scene: {
          id: 's6-whistle',
          lines: [
            N('Ember’s kitchen after dark, with one lamp lit. Ash is in the corner, facing the wall.'),
            N('Ember kneels a little way off, not too close. She has thought about the distance.'),
            E('If this doesn’t work, you walk me to the pond and we don’t talk. Agreed?'),
            Y('Agreed.'),
            N('She puts two fingers to her mouth. For a moment nothing comes out at all.'),
            N('Then three notes. Low, high, and a small one at the end, like a question.'),
            N('Ash’s ear moves. One ear, a very little.'),
            N('Ember whistles it again, slower. Her hands are shaking, so it wobbles, but it is still the right shape.'),
            N('Ash turns round.'),
            A('…pip. wirr. a?', 'soft'),
            N('She crosses the kitchen one careful step at a time and puts her grey head against Ember’s knee.'),
            E('Hello, you. It’s me. It was always me.', 'soft'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay by the door, very quietly.',
              then: [
                N('You stay. Ember cries without making any noise at all, which you suspect she has practised.'),
                N('Ash lets her.'),
              ],
            },
            {
              id: 'leave',
              label: 'Let yourself out. This part is theirs.',
              friendship: { ember: 2 },
              then: [
                N('You lift the latch slowly so it doesn’t click.'),
                N('Behind you Ember whistles the three notes again, and again, and every time, Ash answers.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 's6-complete',
      lines: [
        N('Next morning Ember is at your gate. She lifts and pushes without thinking; she’s known the trick since she was fifteen.'),
        N('Ash walks so close to Ember’s boots that Ember has to walk carefully. She is still grey.'),
        E('Clover says the grey stays. Clover says you can only make it lighter.', 'think'),
        E('She ate breakfast with me in the room. That’s lighter.'),
        E('She answers to both now. The whistle’s hers. Ash is the one I gave her. She can keep both.', 'soft'),
        E('This was her first ribbon. I kept it in a drawer for years like an idiot. Give it to one of yours.'),
        E('And this. Two fingers, like that. Now blow. No. Less spit.'),
        N('It takes four tries. On the fifth your whistle carries across the Grove, and three of your Nubbins come running.'),
        E('Don’t tell anyone I like you. I’ve got a reputation.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 's6-whistle-reward',
        kind: 'cosmetic',
        label: 'Ember’s Whistle (emote)',
        description:
          'The two-fingered whistle Ember taught you. Use it from the emote wheel: nearby Nubbins look up and come to you.',
      },
      {
        id: 's6-ribbon',
        kind: 'cosmetic',
        label: 'Ash’s Ribbon',
        description:
          'Ash’s first ribbon, rust-red and frayed at one end, kept in Ember’s drawer for years. Any of your Nubbins can wear it.',
      },
      {
        id: 's6-ember',
        kind: 'feature',
        label: 'Ember’s Friendship',
        description:
          '+5 friendship with Ember on top of any from choices. She says hello first now, which for Ember is a great deal.',
      },
    ],
    sets: { s6Done: true },
    notes:
      'TRIGGER. Offered the morning after c9-close when Ash left Corvin’s garden: corvin = reconciled (he lets her go), ' +
      'bargained (bought back) or forced (she ran with the stampede; Ember fetched her). The scenes never say which, so one ' +
      'script serves all three. Never on the collector route. There is NO option in chapter 9 itself: S6 starts after it. ' +
      'TIMING. Playable during the three days before the Long Night or any time after it. No scene mentions the date, the ' +
      'vigil, Hazel’s whereabouts or Moss, so it reads the same before or after chapter 10. ' +
      'STEPS. Step 1 in Ember’s house (a small kitchen; Ash faces the corner, full bowl). Step 2: Fern at the fence, then ' +
      'the cottage bookshelf (new readable item: Hazel’s hatch register, Egg 41 page). Step 3 at the pond: a no-timer, ' +
      'no-fail note choice; the two wrong patterns play their lines and re-offer all three choices until the right one is ' +
      'picked (it sets s6-notes). Step 4 in Ember’s kitchen after dark. ' +
      'SOUND. Ash’s first sound is a three-note motif: low, high, short rising. The same motif is Ember’s whistle and the ' +
      'player’s new whistle emote. Show the notes in the UI as three dots plus the label text. ' +
      'ART. Ash stays grey (Shadow palette) after the quest; she follows Ember closely in the overworld. Ash’s ribbon is ' +
      'rust-red, frayed. REWARDS. Apply +5 Ember friendship on completion. Sets only s6Done (and s6-notes locally). ' +
      'MINI-GAME (choose:s6-notes:low-high-question): the whistle. Each choice plays its three notes as real SFX through ' +
      'the whistle emote sound, so the player can hear the difference; the wrong ones get a laugh (a sneeze, a kettle). ' +
      'In the complete scene the player learns the whistle themselves (four tries, then it carries), which is the reward. ' +
      'RUNNING GAG: the duck. Ember dreads “if a duck answers” in s6-practise; a duck does answer in s6-ember-tries. ' +
      'The hatch register (s6-register) shows two other eggs for comedy (Sparks’s, Byte’s) before Egg 41. ' +
      'Ember was fifteen when Hazel gave her the egg (chapter 5). ' +
      'THE REGISTER ON LOAN. If S18 put the register in the museum’s centre case (s18-centre = register), Professor ' +
      'Delve has brought it back to the cottage table when this step starts. Then the step 2 hint becomes “Professor ' +
      'Delve has brought the register back from the museum. It’s on the cottage table.”; in s6-fern, Fern’s last line ' +
      '(index 8) becomes F “It’s on your table. Delve brought it back from his museum this morning, wrapped in a scarf.”; ' +
      'and in s6-register the first line (index 0) becomes N “On the cottage table: a fat ledger, soft at the corners, ' +
      'with a card tucked in the front. On the cover, in Hazel’s hand: “EGGS.”” The rest plays as written.',
  },

  // ================================================================== S7
  {
    id: 's7',
    code: 'S7',
    title: 'Unverified',
    source: 'Original (Hazel’s Grove story bible v2): a clever man reinvents the Stillness with a clock',
    audience: 'all',
    trigger: {
      where: 'The wall by the long grass; then Pixel’s workbench behind the lantern shed, and Byte’s house',
      when:
        'Chapter 7, after Moss explains the Stillness (c7-close). Meant to finish before chapter 10 opens (c10-open).',
    },
    speakers: [NULL_],
    steps: [
      // ------------------------------------------------ 1. chapter 7: unverified
      {
        id: 's7-s1',
        goal: 'Find Byte after Moss’s talk and hear what he’s writing.',
        hint: 'Byte stayed behind on the low wall by the long grass, with his notebook.',
        check: 'talk:byte:s7-unverified',
        scene: {
          id: 's7-unverified',
          lines: [
            N('After Moss’s talk the Keepers drift home in twos and threes. Byte stays on the wall, writing very small and very fast.'),
            N('Beside him sits a pale blue Nubbin with a flat, tidy ball above its head. It is watching the notebook.'),
            B('This is Null. Adult. Four years and some weeks. I know the weeks. Pixel says saying the weeks is unsettling.'),
            B('Moss says a Nubbin loved enough becomes an Eternal. “Enough.” That isn’t a unit.', 'think'),
            N('He shows you the page. Under everything Moss said tonight, in neat capitals: UNVERIFIED.'),
            B('Fossil thinned and everybody just sat there. Sitting isn’t a method.', 'sad'),
            B('Enough is a quantity. Quantities can be scheduled. Pixel’s timer runs four lanterns to the second.'),
            B('Before you say it: no stone. I’m not Cinder. I’m using a clock. Completely different.'),
            M('Your shoelace is untied.'),
            N('Byte looks down. It is; it always is.'),
            N('He goes very quiet.'),
            M('Things on a timer learn to wait for the bell, Byte. Safe is not the same as well.', 'think'),
            N('Byte writes it down carefully. Then, next to it: UNVERIFIED.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'I’ll help. What do you need?',
              friendship: { byte: 2 },
              then: [B('Fruit, a bed and a witness. You can be the witness. Witnesses don’t touch anything.', 'happy')],
            },
            {
              id: 'moss-right',
              label: 'Moss is usually right, Byte.',
              then: [
                B('“Usually” is a percentage. I’d like to know which percentage.'),
                N('On the wall, Moss appears to be asleep. He is very bad at appearing to be asleep.'),
              ],
            },
            {
              id: 'pet-null',
              label: 'Pet Null.',
              then: [
                N('Null leans into your hand, surprised, and then leans harder.'),
                B('Don’t, you’ll skew the… fine. Fine. Once.', 'think'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 2. the Minder
      {
        id: 's7-s2',
        goal: 'See the timer Pixel has built for Null.',
        hint: 'Pixel’s workbench is behind the lantern shed. Follow the ticking.',
        check: 'inspect:device:s7-minder',
        scene: {
          id: 's7-minder',
          lines: [
            N('Pixel’s workbench: a clock face, three little brass bells, a feeding chute and a very small bed.'),
            P('Hi. So. It’s my lantern timer, basically. Four lanterns or one Nubbin, same maths, Byte says.', 'happy'),
            P('Bell one, fruit drops. Bell two, bed warms. Bell three, ninety seconds of petting. Byte does the petting.'),
            B('Ninety-one seconds was too many. I tested it.', 'think'),
            P('He wanted to call it the Accelerator. I wanted the Nap Box. We settled on the Minder, which neither of us likes.'),
            N('The clock ticks. The chute fires a plum across the shed and hits Byte squarely in the clipboard.'),
            P('That was calibration.', 'think'),
            B('That was a plum.'),
            N('On the next tick a piece of fruit drops into the bowl, exactly on the beat.'),
            P('I built the clock. Clocks don’t care what they count down to. I’m trying to care on its behalf.', 'sad'),
            B('Null eats on the bell, sleeps on the bell, is loved on the bell. If enough is a quantity, this is enough.'),
          ],
          choices: [
            {
              id: 'hungry',
              label: 'What if Null’s hungry before the bell?',
              then: [
                B('Null won’t be. The bell’s calibrated.'),
                P('…I asked him that too. It sounded better when he said it to me.', 'think'),
              ],
            },
            {
              id: 'lever',
              label: 'Does it have an off switch?',
              set: { 's7-lever': true },
              friendship: { pixel: 2 },
              then: [
                P('Lever. Left side. I always put a lever on.', 'happy'),
                P('Nobody ever asks about the lever. Thank you for asking about the lever.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 's7-first-bell',
          lines: [
            N('Byte sets Null in the little bed, and the first bell rings.'),
            N('Null looks at Byte, then at the bell, then eats.'),
            B('Day one. Logging begins. Come back in a week.'),
            P('It’s going to be fine. It’s a clock. Clocks are fine.', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 3. a week of bells
      {
        id: 's7-s3',
        goal: 'After a week of bells, go and see how Null is doing.',
        hint: 'Visit Byte’s house once the journal says a week has passed.',
        check: 'talk:byte:s7-week',
        scene: {
          id: 's7-week',
          lines: [
            N('A week later, Byte’s front room is all clipboards. Null sits in the little bed, perfectly upright, waiting.'),
            B('Best week of data I’ve ever had. Run, Swim, Power, all up. It’s never eaten so tidily.', 'happy'),
            P('Watch this.', 'sad'),
            N('Pixel rolls a ball across the floor, the way you would for any Nubbin. Null watches it go by and doesn’t move.'),
            N('The bell rings, and Null eats. It doesn’t look at the fruit, only at the bell.'),
            N('Its blue has gone thin at the edges, like a shirt washed too often. Not grey: paler.'),
            B('It used to chase that ball into the stove. Why doesn’t it play?', 'shock'),
            P('Byte. I think it’s waiting to be told.', 'sad'),
            N('Byte turns his notebook back a week. There is Moss’s line, in his own neat capitals, and beside it: UNVERIFIED.'),
            B('He told me. In plain words. And I wrote “unverified” next to it.', 'sad'),
            N('He crosses it out and writes VERIFIED. Then he crosses that out too.'),
            N('It isn’t something he wanted to be right about.'),
          ],
          choices: [
            {
              id: 'lever',
              label: 'Pull the lever.',
              set: { 's7-stopped': true },
              then: [
                N('Pixel pulls it before you’ve finished saying it. The ticking stops, and the quiet is enormous.'),
                P('I always put a lever on.', 'soft'),
              ],
            },
            {
              id: 'rule-three',
              label: 'Sit down next to Null, Byte. And wait.',
              set: { 's7-stopped': true },
              friendship: { byte: 1 },
              then: [
                B('For how long?'),
                Y('Until it isn’t waiting for the bell.'),
                B('That isn’t a duration.', 'think'),
                N('But he reaches over and pulls the lever himself.'),
              ],
            },
          ],
        },
        done: {
          id: 's7-same-graph',
          lines: [
            B('I wasn’t trying to own it. I was trying to keep it. Apparently those are the same graph.', 'sad'),
            N('Null sits in the bed and waits for a bell that isn’t coming. For the first time it looks a little lost.'),
            P('Tomorrow evening. No clock. We’ll all just sit there. We’re very good at sitting there.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 4. no clock
      {
        id: 's7-s4',
        goal: 'Spend an evening with Byte and Null, timer off. Pet Null when it comes to you, and don’t count.',
        hint: 'Sit near Null in Byte’s garden and wait. Only pet Null once it comes close on its own.',
        check: 'pet:nubbin:null:timer-off',
        scene: {
          id: 's7-no-clock',
          lines: [
            N('Evening in Byte’s garden, and no bells. The Minder sits under a cloth on the step with its lever down.'),
            N('Byte has brought his stopwatch. He holds it the way some people hold a habit they’ve given up.'),
            B('I’m not timing. I’m just holding it. In case.', 'think'),
            Y('In case of what?'),
            B('Unverified.'),
            N('For a long time, nothing. Null sits in the grass, looking at the place where the bell used to be.'),
            N('Then a moth goes past, and Null’s head turns. It watches the moth all the way to the hedge.'),
            B('Did you see that? That isn’t on any schedule.', 'shock'),
            N('Null takes one step after the moth, then looks back at you, as if checking that’s allowed.'),
          ],
          choices: [
            {
              id: 'go-on',
              label: 'Nod. “Go on.”',
              then: [
                N('Null goes. It doesn’t catch the moth, but it falls into the hedge and comes out with a leaf on its head.'),
                NU('…prrp!', 'happy'),
              ],
            },
            {
              id: 'stopwatch',
              label: 'Put the stopwatch down, Byte.',
              friendship: { byte: 2 },
              then: [
                N('Byte looks at it for a long moment. Then he lays it face down in the grass.'),
                B('It’s still running. I just can’t see it. That’s a start.'),
              ],
            },
          ],
        },
        done: {
          id: 's7-lap',
          lines: [
            N('Near dark, Null comes back, climbs into Byte’s lap without being asked, and falls asleep at once.'),
            N('Byte doesn’t move for an hour. You know it’s an hour because he doesn’t check.'),
            B('Its edges are bluer. Don’t tell me if I’m imagining it.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 's7-complete',
      lines: [
        N('A few evenings later Pixel knocks on your door and says nothing, which is how you know.'),
        N('Null has curled up under Byte’s hedge, and the air around it has begun to glow.'),
        B('End-of-life check. Four years, eleven weeks, two days. I said I wouldn’t say the days.', 'sad'),
        N('Byte sits by the cocoon with his hand on it, and doesn’t count. You can see how hard that is.'),
        N('The cocoon doesn’t thin. It glows warm and gold, and opens on an egg: small, blue, humming.'),
        B('Not Eternal. Reborn. It gets to start again, with someone who remembers it.', 'soft'),
        B('Here. My stopwatch. Keep it, please. I’ll only look at it.'),
        P('And the timer, with the bells off. It only counts lanterns now.', 'soft'),
        N('On your way home you notice Byte’s shoelace is tied. Nobody had to tell him. It won’t last.'),
      ],
    },
    rewards: [
      {
        id: 's7-stopwatch',
        kind: 'cosmetic',
        label: 'Byte’s Stopwatch Charm',
        description:
          'Byte’s brass stopwatch, worn as a charm. It is still running. It doesn’t time anything any more; Byte says that’s the point.',
      },
      {
        id: 's7-lantern-timer',
        kind: 'decor',
        label: 'Pixel’s Lantern Timer',
        description:
          'Pixel’s clock with the feeding bells taken off. Place it beside a lantern post: it ticks, and chimes once at dusk.',
      },
      {
        id: 's7-null',
        kind: 'feature',
        label: 'Null Reborn',
        description:
          'Null’s egg hatches in Byte’s garden into a new Null who knows Byte. It visits your Grove to play, and chases moths.',
      },
    ],
    sets: { s7Done: true },
    notes:
      'NO SHARD. Byte rebuilds the Stillness with timing alone: feed on the bell, sleep on the bell, pet on the bell. ' +
      'The point of the story is that Moss’s chapter 7 warning (“safe is not the same as well”) turns out to be true without ' +
      'any stone. Never mention the fourth shard’s location or Corvin’s pocket. ' +
      'TIMING. Step 1 follows the chapter 7 Stillness scene (c7-close). Step 2 any time after, in chapter 7 or 8. Step 3 ' +
      'needs seven in-game days after step 2 (the journal says when). Step 4 the evening after step 3. Complete a few days ' +
      'later. Meant to finish before c10-open; a journal reminder at c9-close. If still open at c10-open, it pauses and ' +
      'resumes after chapter 10 unchanged (only step 1 uses Moss, so later steps never need him). ' +
      'MOSS. Step 1 replays the shoelace joke from chapter 4 directly between Moss and Byte. The complete scene nods to it ' +
      '(Byte has tied his own lace, and it won’t last); the joke stays open for chapter 10’s dawn and Hazel’s letter. ' +
      'PROPS. The Minder: brass clock face, three little bells, feeding chute, small bed, a lever on the left side. ' +
      'NULL. Pale blue, flat tidy ball. During the bell week its colour is desaturated at the edges (not the Shadow palette). ' +
      'Its end-of-life check in the complete scene is forced to rebirth. Null speaks only small sounds. ' +
      'Local flags: s7-lever (asked about the lever), s7-stopped. Sets only s7Done. ' +
      'MINI-GAME (pet:nubbin:null:timer-off): the anti-timer. No clock, no meter, no prompt on screen. Null wanders the ' +
      'garden (moths, the hedge, a leaf). If the player walks to Null or pets it before it comes over on its own, Null ' +
      'freezes and looks round for a bell, and the wait starts again (no fail, no message). If the player sits still near ' +
      'Byte, Null arrives in a minute or two of real time and the pet prompt appears. Byte’s stopwatch ticks faintly in the ' +
      'mix until the stopwatch choice; after it, the tick is gone. ' +
      'COMEDY: Pixel and Byte bicker like an old married workshop; the Minder’s first demo fires a plum at Byte. ' +
      'REWARD MOMENT: the cocoon opens on an egg instead of thinning. Byte’s tied shoelace is a nod, not a close: the ' +
      'joke runs on to chapter 10 and S10’s letter.',
  },

  // ================================================================== S8
  {
    id: 's8',
    code: 'S8',
    title: 'The Warren in the Hollow',
    source: 'Original (Hazel’s Grove story bible v2): the strays’ own home in the wild, and a Keeper who finds what she lost',
    audience: 'all',
    trigger: {
      where: 'The Hollow, past Hazel’s camp; Fern’s gate; Hazel’s bench by the pond',
      when: 'Chapter 8, after you find Hazel’s notebook (c8-close). Closes in chapter 11, after Hazel comes home.',
    },
    speakers: [BRAMBLE],
    steps: [
      // ------------------------------------------------ 1. further in
      {
        id: 's8-s1',
        goal: 'Follow Nova and the fireflies past Hazel’s camp.',
        hint: 'Walk when the fireflies drift; stop when they settle. They lead on past the flat stone.',
        check: 'follow:fireflies:hollow:ring-of-roots',
        scene: {
          id: 's8-further',
          lines: [
            N('You are still by the flat stone with the notebook when Nova steps out of the trees. She doesn’t say hello.'),
            NO('That’s the camp. It isn’t the whole of it.', 'think'),
            NO('“Fed nineteen today.” Did you count her bowls? Twelve.'),
            NO('Twelve bowls, nineteen mouths. She wasn’t feeding them here. She was carrying it further in.'),
            N('A firefly lands on the notebook, sits a moment, and lifts off into the dark beyond the camp. Then another.'),
            NO('They go the same way every night. I followed them once, years back. I look in whenever I pass.'),
            NO('I’ve never brought anyone. Bring fruit. Walk slowly. Slower than that.'),
          ],
          choices: [
            {
              id: 'lead',
              label: 'Lead on.',
              then: [NO('I don’t lead. I follow fireflies. You can follow me following them.')],
            },
            {
              id: 'nubbin',
              label: 'Should my Nubbin wait here?',
              friendship: { nova: 1 },
              then: [NO('No. They need to see you came with one that trusts you. It’s the only introduction that works.')],
            },
          ],
        },
        done: {
          id: 's8-ring',
          lines: [
            N('The fireflies stop above a ring of old roots, knotted out of the ground like a fence nobody built.'),
            N('Inside sit dozens of grey Nubbins: not in rows, in a ring, facing in. Some of them are touching.'),
            N('In the middle sits an old grey Nubbin whose left ear folds over at the tip. A scrap of faded ribbon is tied round it.'),
            NO('They aren’t lost. They know exactly where they are. It’s everyone else they’ve lost track of.', 'soft'),
            NO('That one’s in charge. I call her the Old Girl. She’s never told me what she calls herself.'),
          ],
        },
      },
      // ------------------------------------------------ 2. the edge of the ring
      {
        id: 's8-s2',
        goal: 'Leave fruit at the edge of the ring, a little at a time, until the Old Girl lets you in.',
        hint: 'Bring twelve pieces of fruit over three evenings. Set them down at the roots and step back.',
        check: 'deliver:fruit:hollow:warren:12',
        scene: {
          id: 's8-edge',
          lines: [
            N('You take one step towards the roots. Every grey head in the ring turns at once, and you stop.'),
            NO('Nobody crosses. Not me. You don’t walk into someone’s house just because the door is made of roots.'),
            Y('Then how did Hazel feed them?'),
            NO('She left it at the edge and stepped back. Then she came again the next night. That’s the whole trick.'),
            N('The Old Girl watches you. Her dark ball hangs very still above her head.'),
            N('Close at her side sits a grey Nubbin thinner than all the rest. Its ear folds over at the tip, like hers.'),
            NO('Her youngest, I think. Doesn’t eat much. The others leave it the soft fruit.', 'soft'),
          ],
          choices: [
            {
              id: 'soft-fruit',
              label: 'Leave the softest fruit nearest the thin one.',
              set: { 's8-soft-fruit': true },
              friendship: { nova: 1 },
              then: [NO('…That’s what Hazel did. Exactly that.', 'shock')],
            },
            {
              id: 'sit-off',
              label: 'Put the fruit down, and sit a little way off.',
              then: [
                N('You sit. After a long time a grey Nubbin creeps out, takes one piece, and carries it to the middle.'),
                NO('Good. Now do that for three nights.'),
              ],
            },
          ],
        },
        done: {
          id: 's8-gap',
          lines: [
            N('On the third evening the Old Girl gets up, slowly, and steps aside. There is a gap in the ring one Keeper wide.'),
            NO('Every time I’ve passed through, I’ve come and sat at these roots. She never did that for me.', 'shock'),
            N('Up close, her ribbon was brown once, with a leaf stitched on it. Five points, one curled stem.'),
            N('You have seen that leaf before. It is on Fern’s gloves, Fern’s gate, and Fern’s tea cosy.'),
            NO('Hazel’s notebook. “The brown one let me touch her ear.” She isn’t brown. Her ribbon was.', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 3. Fern’s gate
      {
        id: 's8-s3',
        goal: 'Bring Fern to the ring of roots in the Hollow.',
        hint: 'Fern is at her gate next door. Walk her past the falls to the Hollow; she’ll keep up.',
        check: 'escort:fern:hollow:ring-of-roots',
        scene: {
          id: 's8-fern-gate',
          lines: [
            N('Fern is leaning on her gate, stitching a leaf onto a glove that already has three.'),
            F('You’re staring at my glove. It’s a leaf. I put them on everything.'),
            F('I put one on a ribbon once. Long time ago.', 'think'),
            N('She pulls the thread tight, and keeps pulling after it’s tight.'),
            F('Six years. Midsummer race. She went over the rail on the cliff bend and I stood at the bottom till dark.', 'sad'),
            F('Everyone said she couldn’t have lived. Everyone was very kind about it. I hated it.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Fern. I think I’ve found her.',
              set: { 's8-told': true },
              friendship: { fern: 1 },
              then: [
                F('Don’t.', 'sad'),
                F('Don’t say that unless…', 'sad'),
                Y('Bring fruit. Soft fruit.'),
                N('She is through her own gate before you’ve finished, still holding the needle.'),
              ],
            },
            {
              id: 'ask',
              label: 'Will you help me carry fruit to the Hollow tonight?',
              set: { 's8-told': false },
              then: [
                F('The Hollow? At night? With you?', 'think'),
                F('…Fine. Someone has to carry things badly.'),
                N('She doesn’t ask why. You don’t tell her, not yet.'),
              ],
            },
          ],
        },
        done: {
          id: 's8-arrive',
          lines: [
            N('The fireflies go ahead of you both, low over the path, as if they know who you’ve brought.'),
            F('Is it always this dark? How did Hazel do this every night? She couldn’t see her own feet.', 'think'),
            N('Fern walks into a tree, apologises to it, and walks into the same tree again.'),
            F('I’m carrying the soft fruit. I insisted. I have sat on two of them.', 'sad'),
            F('They’re still soft. Softer, if anything. That has to count.', 'think'),
            N('At the stream she takes her boots off, wades across, and puts them back on the wrong feet. She doesn’t notice for a mile.'),
            N('Then the path dips, the fireflies settle low, and for the first time all night Fern stops talking.'),
          ],
        },
      },
      // ------------------------------------------------ 4. Fern finds her
      {
        id: 's8-s4',
        goal: 'Sit at the edge of the ring with Fern, and let the Old Girl come to her.',
        hint: 'Sit down by the roots with Fern and wait. Don’t reach in.',
        check: 'wait:fern:bramble:ring-edge',
        scene: {
          id: 's8-reunion',
          set: { s8Reunited: true },
          lines: [
            N('Fern stops at the roots, and every grey head turns.'),
            N('She doesn’t notice them. She is looking at the middle.'),
            N('The Old Girl is already standing. Her folded ear is up, and the scrap of brown ribbon hangs from it, leaf and all.'),
            F('Oh.', 'shock'),
            F('Bramble? …Oh, you’ve gone grey. That’s all right, love. So have I.', 'soft'),
            N('For a long moment nobody in the ring moves.'),
            N('Then Bramble walks out through the gap, one careful step at a time, all the way to Fern’s boots.'),
            BR('…', 'soft'),
            F('I stood at the bottom of that cliff till dark. I thought I’d left you there.', 'sad'),
            F('I’m sorry I stopped looking. I’m so sorry I stopped looking.', 'sad'),
            N('Bramble sits down on Fern’s boots, both of them, and stays there.'),
            F('Right. Good. I’m going to cry now. Somebody hold my gloves.', 'happy'),
          ],
          choices: [
            {
              id: 'gloves',
              label: 'Hold her gloves.',
              friendship: { fern: 2 },
              then: [
                N('You hold them. Fern sits down in the mud with Bramble in her lap and cries for a long time.'),
                N('Bramble lets her.'),
              ],
            },
            {
              id: 'new-ribbon',
              label: 'Hand Fern a ribbon from your pocket.',
              set: { 's8-new-ribbon': true },
              friendship: { fern: 3 },
              then: [
                F('You carry ribbons? Course you do. You’re Hazel’s.', 'think'),
                N('Fern stitches a leaf onto it there and then, with shaking hands, and ties it under the old one.'),
                F('She keeps both. She always was greedy.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 's8-one-short',
          lines: [
            N('Later, Bramble walks back to the middle of the ring. She has a job, and she goes back to it.'),
            F('She always did like being in charge.', 'soft'),
            N('Bramble sits down and looks past you all, up the dark path, the way she looked the first night.'),
            NO('The thin one. Her youngest. It isn’t at the ring tonight.', 'think'),
            F('Then we leave the soft fruit at the edge till it is.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 's8-complete',
      lines: [
        N('Hazel sits on the bench by the pond, the thin grey Nubbin asleep in the crook of her arm.'),
        H('This one? Found her at the edge of a ring of roots, too tired to stand. So I carried her.', 'think'),
        H('Her mother runs the place. Ear folds over at the tip. Opinions. I gather you’ve met.'),
        Y('Fern found her. Her name’s Bramble.'),
        H('Did she. Oh, Fern. Did she.', 'soft'),
        ...S8_COMPLETE_TAIL,
      ],
    },
    rewards: [
      {
        id: 's8-strays',
        kind: 'feature',
        label: 'Warren Strays',
        description:
          'Bramble’s strays can now be recruited one at a time from the ring, with patience and soft fruit. They stay grey, and can be loved.',
      },
      {
        id: 's8-ribbon',
        kind: 'cosmetic',
        label: 'Bramble’s Ribbon',
        description:
          'The faded brown ribbon with Fern’s stitched leaf that Bramble wore for six years. Any of your Nubbins can wear it.',
      },
      {
        id: 's8-hollow',
        kind: 'feature',
        label: 'The Hollow',
        description:
          'A new map section past the falls: the ring of roots, where you can visit any time to leave fruit and sit with the warren.',
      },
    ],
    sets: { s8Done: true },
    notes:
      'FLAG s8Reunited is set when s8-reunion plays (Fern finds Bramble). If that happens before the Long Night, the chapter 10 dawn plays c10-bramble (campaign-book3.ts): the thin grey Nubbin in Hazel’s arm is Bramble’s youngest. ' +
      'TIMING. Step 1 follows c8-close (the player is still at the flat stone). Steps 2–4 can be played from chapter 8 ' +
      'onwards; step 2 needs three separate evenings. The complete scene plays in chapter 11, after c11-open, once step 4 ' +
      'is done; if step 4 is done later in chapter 11, the complete scene follows straight on. It belongs to chapter ' +
      '11’s few days (bible), so it plays before c11-close; c11-close swaps its thin-Nubbin line once S8 is done (see ' +
      'the c11-close note in campaign-book3.ts). If S8 is not finished by c12-open it closes unfinished. ' +
      'VARIANT. s8-complete is for a reunion after the Long Night, when Hazel is hearing the news for the first time. If ' +
      'c10-bramble played (s8Reunited was set before the Long Night, so Fern has already recognised the ear at dawn), ' +
      'play s8-complete-dawn (SIDE_STORIES_FUN_2_VARIANTS) instead: it skips Hazel’s account and her surprise, which ' +
      'c10-bramble has already given. Both end with the same lines (S8_COMPLETE_TAIL). ' +
      'NOVA. She has passed through the valley before and looks in at the ring when she does, but she has not been ' +
      'coming for months on end, and chapter 8 is the first time she asks anyone for anything (bible). ' +
      'NO SPOILERS. Before chapter 10’s dawn, nothing in S8 says where Hazel is. The youngest is simply missing from the ' +
      'ring (step 4 done). The payoff is Hazel’s line in the complete scene. Nothing here says how Bramble survived the ' +
      'Midsummer fall or how she reached the Hollow (that belongs to S3, which S8 does not need). ' +
      'CHAPTER 10 DAWN. Settled by the bible (conflict 19): the dawn reads s8Reunited, not s8Done. The complete scene here ' +
      'works whether or not the dawn showed Bramble’s youngest. ' +
      'MINI-GAME (follow:fireflies:hollow:ring-of-roots): a firefly-follow game. The swarm drifts, then settles; walk only ' +
      'while it drifts and stand still when it settles. Moving while they settle scatters them back to the last stop (no ' +
      'fail). Nova follows a step behind you. The escort (s8-s3) reuses it with Fern, who keeps walking into things. ' +
      'COMEDY: Fern in the dark on the way out (s8-arrive) is the story’s comic set piece, right before the reunion; play ' +
      'it brisk so the silence at the roots lands. ' +
      'ART. The ring: old roots knotted out of the ground in a circle, dozens of grey Nubbins facing in, touching. Bramble: ' +
      'old, grey, her left ear folded over at the tip (never torn: Wisp is the one with the torn ear), a faded brown ' +
      'ribbon with a five-point stitched leaf tied round it. She is “the Old Girl” in all text until ' +
      'Fern names her; the Bramble speaker is used only in the reunion. The youngest is very thin and grey, and its ear ' +
      'folds over at the tip in the same way (that is how Fern knows it at dawn). Bramble greets Fern by sitting on her ' +
      'boots; leaning her whole weight on a shin is Sable’s gesture, not hers. ' +
      'The forced route in chapter 9 sends Corvin’s grey runners into the Hollow; no S8 line depends on it. ' +
      'Local flags: s8-soft-fruit, s8-told, s8-new-ribbon. Sets only s8Done.',
  },
];

// ================================================================== variant scenes
/** Branch scenes. Each replaces the named scene when its condition holds (see the quest’s notes). */
export const SIDE_STORIES_FUN_2_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- S8: replaces s8-complete if c10-bramble played
  {
    id: 's8-complete-dawn',
    lines: [
      N('Hazel sits on the bench by the pond, the thin grey Nubbin asleep in the crook of her arm.'),
      N('Fern is beside her, and has been all morning.'),
      H('Fern’s told me. Twice. Once crying.', 'happy'),
      ...S8_COMPLETE_TAIL,
    ],
  },
];

export const CHECKS: string[] = [
  // S6
  'talk:ember:s6-kitchen',
  'find:item:hatch-register:cottage-bookshelf',
  'choose:s6-notes:low-high-question',
  'watch:ember:whistle:ash',
  // S7
  'talk:byte:s7-unverified',
  'inspect:device:s7-minder',
  'talk:byte:s7-week',
  'pet:nubbin:null:timer-off',
  // S8
  'follow:fireflies:hollow:ring-of-roots',
  'deliver:fruit:hollow:warren:12',
  'escort:fern:hollow:ring-of-roots',
  'wait:fern:bramble:ring-edge',
];
