/**
 * Grove side story S27, "Some Nubbin" (Part M, rank 12).   ch5 → before ch9   CHANGES THE CAMPAIGN (Tier 1)
 *
 * SOURCE. After *Charlotte’s Web* by E. B. White (1952). Rights holder: the E. B. White estate; US publisher
 * HarperCollins (first published by Harper & Brothers, New York, 1952). Under copyright. An original Grove story
 * inspired by the book: a small life saved by words, and a friend who writes them and then dies, in her season.
 *
 * AUDIENCE. 'all' (the main game and the Learning Grove). The two lifted lines have childLines.
 *
 * FRAME. High summer to the first autumn dawns, mostly at Corvin’s Circuit: the runners’ pens, the finishing straight
 * and the old lantern shed, the one corner Corvin has never had swept. A grey-brown spider in the shed window, whom
 * Sparks names Spindle, writes words in her web; at dawn the Circuit’s summer frost rimes the silk and the words show
 * white. You are the go-between: you carry her, fetch her words and sit with her. Spindle never speaks. She writes.
 * On the sold path the Nubbin she saves is your own (soldId, painted “9”); otherwise it is a runner the stable lad
 * calls Nine. A spring scene in the Grove closes it, post-game.
 *
 * GROVE FLAGS READ, AND WHAT CHANGES.
 *   soldNubbin, soldId, boughtBack  the path. Sold path = soldNubbin && !boughtBack (in practice soldNubbin: nothing
 *                                   else can set boughtBack before chapter 9). Plays the -sold variants and s27-home.
 *   wisp                            spared | sable → Wisp carries the egg sac (s27-carry-wisp). Also gates step 12:
 *                                   it waits until wisp is set, or until chapter 8 opens if S2 never settled it.
 *   s21Done                         if Wisp does not carry it, Clank holds the ladder (s27-carry-clank).
 *   s27-truth (own)                 step 6’s answer decides step 10’s night (s27-midnight or s27-midnight-shield).
 *   s27-carrier (own)               which spring scene plays (s27-spring or s27-spring-wisp).
 *
 * FLAGS WRITTEN.
 *   boughtBack: true   Tier 1, sold path only, by either choice in s27-home (the campaign hook; see notes, SIM).
 *   s27Done            on completion.
 *   s27-truth          shield | frost | silent (s27-was-it-you).
 *   s27-nine-name      runner path only: the name you give Nine (s27-words). Tansy | Button | typed by the player.
 *   s27-paid           sold path only: shells | hat (s27-home).
 *   s27-carrier        nubbin | wisp (s27-carry, s27-carry-clank, s27-carry-wisp).
 *   The outline’s s27Truth and s27Carrier are written s27-truth and s27-carrier, to match the repo’s local-flag style.
 *
 * LIFTED TEXT. *Charlotte’s Web*, E. B. White (Harper & Brothers, 1952). Two one-sentence quotes, exactly as the
 * outline lists them, each used once in the main text, each with a childLines replacement:
 *   1. “You have been my friend.” (Charlotte to Wilbur.) Here the Keeper says it to Spindle: s27-last-evening#6.
 *   2. “It is not often that someone comes along who is a true friend and a good writer.” (The narrator, near the
 *      end.) The spring scene’s last narration, followed by our own “Spindle was both.”: s27-spring#9, s27-spring-wisp#9.
 *   Every web word is new: EVENING, WAIT, the name, SOMEBODY’S, WARM, HOME, ABOVE, PLEASE, WELL. None of White’s four.
 *
 * CARE NOTES. Spindle dies of old age, in her season, offscreen: the empty web carries it; no body is shown and nobody
 * tidies it away. The threat is being sold over the pass, never anything worse. Mr Tull the dealer is a businessman,
 * not a monster. Corvin is embarrassed into doing right, never humiliated. Spindle, the runners and every Nubbin stay
 * silent; Wisp’s whisper is a Shadow’s half-voice (canon 17); Clank is a robot, not a Nubbin (canon 31). The third
 * rule is echoed (Spindle’s WAIT; you sit by the window) but never quoted (canon 14). No chores, no timers.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const Y = say('you');
const C = say('corvin');
const SP = say('sparks');
const FE = say('fern');
const CL = say('clover');
const LU = say('luna');
const BY = say('byte');

// ---------------------------------------------------------------- new and shared speakers
/** Never has a line: her web words are narrated, and drawn as web text (see notes, ART). Declared for the cast list. */
const SPINDLE: Speaker = {
  id: 's27-spindle',
  name: 'Spindle',
  kind: 'other',
  basedOn: 'Charlotte A. Cavatica (Charlotte’s Web, E. B. White); she writes and never talks',
};
const TAM: Speaker = {
  id: 's27-tam',
  name: 'Tam',
  kind: 'other',
  basedOn: 'Lurvy, the hired man (Charlotte’s Web), loosely: Corvin’s stable lad',
};
const TULL: Speaker = {
  id: 's27-tull',
  name: 'Mr Tull',
  kind: 'other',
  basedOn: 'An original character: the dealer from over the pass (the book’s threat, made a businessman)',
};
/** The existing Wisp (S2). Shared id. Shadows whisper with the shard’s echo; lowercase is his half-voice. */
const WISP: Speaker = {
  id: 'wisp',
  name: 'Wisp',
  kind: 'nubbin',
  basedOn: 'Templeton the rat (Charlotte’s Web), in this story only: the hoarder who carries the egg sac',
};
/** The existing Clank (S21). Shared id. A robot, not a Nubbin, so he may speak. */
const CLANK: Speaker = { id: 'clank', name: 'Clank', kind: 'other', basedOn: 'Claptrap (Borderlands), reference only' };

const TA = say('s27-tam');
const TU = say('s27-tull');
const W = say('wisp');
const CK = say('clank');

// ================================================================== shared pieces
/** The morning after the Show: shared by s27-letgo (runner path) and s27-home (sold path). 9 lines. */
const S27_MORNING: Line[] = [
  N('By breakfast half the valley is at the Circuit fence. Nobody arranged it; people just came.'),
  N('Along the whole finishing straight, in letters as tall as a Nubbin, the frost says: HOME.'),
  FE('HOME. Look at the size of it. She must have run out of rail.', 'happy'),
  N('Mr Tull is at the gate with his cart. He reads the rail, and then the faces along the fence.'),
  TU('Morning, Mr Vale. I’ve come for whatever didn’t place. But I’ll not take that one.', 'think'),
  TU('Its name’s been up on your rails all summer. I’d have half this valley at my gate by Sunday, asking after it.'),
  TU('I sell runners. I don’t sell the ones people ask after. Good day to you.'),
  N('He tips his hat to the fence, quite politely, and drives away over the pass. His cart is lighter by one.'),
  N('Corvin stands at the end of the straight with his hands in his pockets. He reads the rail one more time.'),
];

/** The sold Nubbin walking out, appended to both s27-home choices. */
const S27_HOME_TAIL: Line[] = [
  N('Tam opens the pen. Your Nubbin steps out, and stops, and looks at you across the sand.'),
  N('Then it comes. The whole way, not hurrying, the 9 still white on its side.'),
  N('It leans its weight against your shin, the way it did the week it hatched. It is cold, and it is yours.'),
];

/** The four words, gathered. Shared by s27-words (runner path, then the naming choice) and s27-words-sold. 13 lines. */
const S27_WORD_HUNT: Line[] = [
  N('Fern is up a ladder in her orchard, losing an argument with a plum tree.'),
  FE('A word? For a spider? Oh, I’ve got one. Somebody’s. As in, this one is somebody’s.'),
  FE('When Bramble went, people said “it’s only a Nubbin.” She wasn’t only. She was mine. Somebody’s.', 'sad'),
  N('Clover listens with her head on one side, the way she listens to the shy ones.'),
  CL('Warm. You can’t make a grey one not grey. But you can make it warm. Warm is allowed.', 'soft'),
  N('Luna is in her night garden at noon, asleep in a deckchair. She answers without opening her eyes.'),
  LU('Home. Everything in my garden grows towards it in the dark. Even the moonflowers. Especially them.', 'soft'),
  N('Byte takes the question very seriously, and goes away, and comes back with a sheet of paper.'),
  BY('“Statistically above average.” It’s accurate. It’s kind. It’s the nicest thing I know how to say about anybody.', 'think'),
  N('You read the four words to the shed window. Spindle listens to each, legs folded, exactly like a judge.'),
  N('At Byte’s she goes very still for a long moment. Then she points one leg, delicately, at the length of the rail.'),
  SP('She’s saying it won’t fit. I’d tell him gently. He’s sensitive about his adjectives.', 'happy'),
  N('Spindle spins three short threads and pulls them tight, the way someone squares a pile of letters on a desk.'),
];

/** The egg sac comes down: base and Clank versions. */
const S27_LADDER: Line[] = [
  N('Sparks carries her long ladder in from the yard, sideways, swearing gently at the door frame.'),
  SP('Rafters are your job. I’ve got the knees of an eighty-year-old and the opinions to match.'),
  N('Your Nubbin looks at the ladder, and at the sac, and at you. Then it climbs, one rung at a time, with enormous care.'),
];
const S27_LADDER_DOWN: Line[] = [
  N('It comes down backwards with the sac held against its chest, the way you’d carry an egg that might still hatch today.'),
  N('Spindle watches every rung, and doesn’t breathe out until it is on the floor. You don’t either.'),
  SP('Grove lantern shed. Top shelf, over the warm pipe. Nothing up there ever freezes, not even my tea.'),
  N('You carry it home down the valley in your two cupped hands. Spindle stays in her window; she has done her part.'),
];

// ================================================================== the quest
export const SIDE_STORY_S27: Quest[] = [
  {
    id: 's27',
    code: 'S27',
    title: 'Some Nubbin',
    source:
      'Charlotte’s Web (E. B. White, 1952): a spider who saves a small life with words written in her web, and dies in her season. Adapted as an original Grove story; two short approved quotes.',
    audience: 'all',
    trigger: {
      where: 'Corvin’s Circuit: the old lantern shed, the runners’ pens and the finishing straight (the spring scene is in the Grove)',
      when: 'Opens in chapter 5, on the first visit to the Circuit after c5-close (and c5-sold, if it plays). The Show waits for chapter 7; the egg sac for wisp or chapter 8. Closes before chapter 9 opens.',
    },
    speakers: [SPINDLE, TAM, TULL, WISP, CLANK],
    steps: [
      // ------------------------------------------------ 1. the lantern shed (outline quest 1)
      {
        id: 's27-step1',
        goal: 'Fetch a coil of wire for Sparks from the Circuit’s old lantern shed.',
        hint: 'The shed is behind the finishing straight. Bottom drawer of the cabinet under the window.',
        check: 'find:s27-wire-coil',
        scene: {
          id: 's27-wire',
          lines: [
            N('High summer at the Circuit. The sand is hot enough to fry on, and the white railings are furred with frost.'),
            N('Sparks is on her back under the start lamp, with a screwdriver in her teeth.'),
            SP('Start lamp’s gone again. I need wire. Copper, thin, a coil about so big.', 'angry'),
            SP('There’s a cabinet of mine in the old lantern shed, behind the straight. Bottom drawer. Be a love.'),
            SP('He doesn’t like people in there. He’s never been in there himself, mind. Not once in eleven years.', 'think'),
            SP('It’s the only place up here with dust in it. I love it. Don’t tell him.'),
            N('Your Nubbin climbs into your coat pocket for the walk. It doesn’t like the cold rails either.'),
          ],
        },
        done: {
          id: 's27-evening',
          lines: [
            N('The lantern shed smells of paraffin and warm wood. Dust turns slowly in the light from one small window.'),
            N('Under the window stands Sparks’s cabinet, every drawer labelled in her square capitals: FUSES, WICKS, SPARE, EVENING LAMPS.'),
            N('You find the wire. When you stand up, there is a web across the corner of the window that wasn’t there a moment ago.'),
            N('It isn’t a new web; you just hadn’t looked. And in the middle of it, very small, is a word.'),
            N('EVENING.'),
            N('A grey-brown spider no bigger than a fingernail sits beside it. She lifts two front legs at you, politely.'),
            N('It is eleven in the morning. You find, to your own surprise, that you lift a hand back.'),
          ],
        },
      },
      // ------------------------------------------------ 2. the one at the end of the row (outline quest 2)
      {
        id: 's27-step2',
        goal: 'Ask the stable lad about the little grey runner at the end of the row.',
        hint: 'Tam does the buckets by the pens. He’s the only one up here who whistles.',
        check: 'talk:s27-tam',
        scene: {
          id: 's27-row',
          lines: [
            N('Through the shed window, past the spider and her word, you can see the runners’ pens.'),
            N('One pen to each runner, in a straight row, every rail white with frost. Every runner grey, and none of them moving.'),
            N('At the very end of the row is the smallest. It is the only one facing the wrong way.'),
            N('It isn’t looking at anything in particular. It is just looking out, down the valley, the way you might look at weather coming.'),
            N('There is a number painted on its side in neat white paint. 9.'),
            N('Outside, a lad with two buckets goes along the pens, whistling. He stops whistling at the end of the row.'),
          ],
        },
        done: {
          id: 's27-tam',
          lines: [
            TA('That’s Nine. Smallest we’ve got. Last every time. Not slow, exactly. It just doesn’t see the point.', 'think'),
            TA('I’m Tam. I do the buckets. I’m not meant to whistle. I forget.'),
            N('He fills Nine’s trough, and Nine doesn’t look round. Tam stands there a moment longer than the trough needs.'),
            TA('Autumn Show’s at the first frost that isn’t his. Anything that doesn’t place goes over the pass.', 'sad'),
            TA('There’s a dealer comes for them. Mr Tull. He’s all right, as dealers go. They don’t come back, is all.'),
            TA('Nine’s never placed. Not once.', 'sad'),
            N('In the shed window behind you, the spider has gone very still in the middle of her web.'),
          ],
        },
      },
      // ------------------------------------------------ 3. WAIT (outline quest 3)
      {
        id: 's27-step3',
        goal: 'Sit down by the shed window, and wait with the spider.',
        hint: 'Sit on the upturned crate by the window and don’t do anything. It takes as long as it takes.',
        check: 'sit:s27-shed-window',
        scene: {
          id: 's27-wait',
          lines: [
            N('The next time you come up to the Circuit, the first thing you do is go to the shed. You didn’t decide to.'),
            N('EVENING has gone. In its place, in the middle of the web, is a new word.'),
            N('WAIT.'),
            N('The spider sits at the edge of the web with her legs drawn in. She isn’t looking at you; she is thinking.'),
            N('You know that kind of thinking. You’ve watched someone in your family do it on a cottage step for hours.'),
            N('There is an upturned crate under the window. It is exactly the right height for sitting next to someone.'),
          ],
        },
        done: {
          id: 's27-spindle',
          lines: [
            N('You sit, and the spider thinks, and the dust turns in the light. Your Nubbin falls asleep in your pocket.'),
            N('After a long time, the door bangs open, and Sparks comes in to find out where her wire went.'),
            SP('There you are. I’ve been holding a lamp together with my— oh.', 'shock'),
            N('She looks at you, and the crate, and the web, and the word. She sits down on the floor without being asked.'),
            SP('She writes. Course she writes. She’s been living on my drawer labels for years. Look at her, the little clerk.', 'soft'),
            SP('She wants a name. Anyone who can spell wants a name. Spindle. All legs and she winds things. Spindle.'),
            N('The spider considers this. Then she lifts two legs, politely, once at Sparks and once at you.'),
            SP('That’s a yes. That’s definitely a yes. I’m going to cry and then I’m going to fix the start lamp.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 4. words, please (outline quest 4)
      {
        id: 's27-step4',
        goal: 'Ask Fern, Clover, Luna and Byte for one word each, and bring them back to Spindle.',
        hint: 'Fern is in her orchard, Clover by the pond, Luna in her night garden and Byte wherever there is a clipboard.',
        check: 'collect:s27-words:4',
        scene: {
          id: 's27-labels',
          lines: [
            N('Over the next few days Spindle practises. FUSES appears in the web, and then WICKS, and then SPARE.'),
            N('They are very good, and the S’s in particular are beautiful. They are also no use to anybody.'),
            SP('That’s the trouble with learning off a cabinet. She can tell you where everything is, but not how anyone feels.'),
            N('Spindle spins a short line, and then cuts it, and then sits looking at the gap where a word ought to go.'),
            N('Then she looks through the window at the end of the row, and back at you, and lifts one leg. Just one.'),
            SP('She wants words. Proper ones. And she can’t exactly go down the valley asking.', 'think'),
            SP('Ask round. Everyone’s got one word they’d save for something that mattered. Bring them up here.'),
          ],
        },
        done: {
          id: 's27-words',
          lines: [
            ...S27_WORD_HUNT,
            N('Then she does something she hasn’t done before. She points at you, and then at the end of the row.'),
            SP('She’s asking what it’s called. Nine isn’t a name. Nine’s a number. You can’t save a number.', 'think'),
            N('The little grey runner is still looking down the valley. It has never had a name to look up at.'),
          ],
          choices: [
            {
              id: 'tansy',
              label: '“Tansy.” Small, yellow, and very hard to get rid of.',
              set: { 's27-nine-name': 'Tansy' },
              then: [
                SP('Tansy. Grows in the cracks where nobody planted it. Oh, that’s good. That’s really good.', 'happy'),
                N('Spindle writes it once, small, in the corner of the window, to practise. She gets it right first time.'),
              ],
            },
            {
              id: 'button',
              label: '“Button.” Because it’s small, and it holds things together.',
              set: { 's27-nine-name': 'Button' },
              then: [
                SP('Button. You’re soft. I like that. Never let anyone at this Circuit find out.', 'happy'),
                N('Spindle writes it once, small, in the corner of the window, to practise. She gets it right first time.'),
              ],
            },
            {
              id: 'own',
              label: 'Give it a name of your own.',
              set: { 's27-nine-name': '' },
              then: [
                N('You think about it properly, the way you’d name anything you meant to keep. Then you say it out loud.'),
                SP('…Yeah. That’s its name. You can tell. It sounds like it was always waiting there.', 'soft'),
                N('Spindle writes it once, small, in the corner of the window, to practise. She gets it right first time.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 5. the first word (outline quest 5)
      {
        id: 's27-step5',
        goal: 'Be at the pens at first light, to see what Spindle wrote in the night.',
        hint: 'Come up the valley before dawn. Stand by the shed: the frost shows the silk only for the first hour.',
        check: 'watch:s27-pen-railing:dawn',
        scene: {
          id: 's27-first-night',
          lines: [
            N('At dusk Spindle comes to the edge of the web and waits, quite plainly, to be carried.'),
            N('You hold out a matchbox. She walks into it the way a duchess gets into a carriage.'),
            N('You carry her across the yard in the blue light to the last pen in the row, and open the box on the rail.'),
            N('The rail is so cold it smokes. Spindle steps out onto it without a moment’s fuss.'),
            N('Inside the pen the little grey runner watches the spider. It is the first thing you have seen it watch.'),
            N('You go home. It is the hardest part, it turns out: going home and leaving someone to work.'),
          ],
        },
        done: {
          id: 's27-first-word',
          lines: [
            N('First light. Your Nubbin keeps watch with you from your pocket, nose out, and your breath hangs in the air.'),
            N('The Circuit’s summer frost has come down in the night as it always does. Every rail is white.'),
            N('And on the rail of the last pen, every thread of Spindle’s web has caught the frost, and stands out white as chalk.'),
            N('It isn’t a number. It is a name, in letters the height of your hand: its name.'),
            N('Fern has come up the valley with you to see. Fern reads it out first, loudly, and then again, louder.'),
            FE('That’s its NAME. Look. It’s got a NAME. Everybody, it’s got a—', 'happy'),
            N('Inside the pen, the little grey runner turns round. For the first time, it is facing the right way.'),
            N('Corvin’s runners have numbers. This one has a name, and now everybody knows it.'),
          ],
        },
      },
      // ------------------------------------------------ 6. frost does odd things; was it you? (outline quests 6 and 7)
      {
        id: 's27-step6',
        goal: 'Corvin wants a word with you by the pens.',
        hint: 'He’s at the end of the row, by the rail with the name on it.',
        check: 'talk:corvin:s27-pens',
        scene: {
          id: 's27-odd-things',
          lines: [
            N('Corvin comes out of the house at seven, as he always does, with his ledger under his arm.'),
            N('He stops at the end of the row. He looks at the rail for a long time.'),
            C('Frost does odd things.', 'think'),
            N('He writes something in the ledger, and goes in.'),
            N('By noon there are people at the Circuit fence who have never come up the valley before.'),
            N('Two children from the lane, holding hands. A man with a bicycle, who says he was only passing, and stays all afternoon.'),
            N('By then the frost is long gone from the rail. They have come to look at a small grey runner whose name they know.'),
            N('Corvin comes out again and looks at the fence. Then he looks across the yard, at you.'),
          ],
        },
        done: {
          id: 's27-was-it-you',
          lines: [
            N('He walks over without hurrying. His hands are bare and blue at the knuckles.'),
            C('Hazel’s heir. A straight question, and I’d like a straight answer, since she always gave me one.'),
            C('Somebody wrote on my rail in the night. I don’t care for things written on my rails. Was it you?'),
            N('Behind you, through the shed window, you can feel a very small person holding very still.'),
          ],
          choices: [
            {
              id: 'shield',
              label: '“Yes. It was me.”',
              set: { 's27-truth': 'shield' },
              then: [
                Y('Yes. It was me.'),
                C('In frost. At four in the morning. In letters a hand high, in a spider’s silk.', 'think'),
                Y('I’ve got very steady hands.'),
                N('Corvin looks at you for a long moment, the way he looks at a runner that has started late.'),
                C('Hazel used to lie like that. Badly, and always for somebody else. I’ll be watching my rails, then.'),
              ],
            },
            {
              id: 'frost',
              label: '“Ask the frost.”',
              set: { 's27-truth': 'frost' },
              then: [
                Y('Ask the frost. It’s yours, isn’t it? It’s been on your rails all summer.'),
                N('Corvin’s hand goes to his breast pocket, and stops halfway, and comes down again.'),
                C('…Frost doesn’t spell.', 'think'),
                Y('This frost does.'),
                N('He looks past you, at the shed he has never once been into. He doesn’t say anything else; he doesn’t need to.'),
              ],
            },
            {
              id: 'silent',
              label: 'Say nothing. Just wait.',
              set: { 's27-truth': 'silent' },
              then: [
                N('You say nothing, and Corvin waits. You have learned waiting from better people than him, and he can tell.'),
                N('After a while he stops looking at you, and looks past you, at the shed window, for a long time.'),
                C('Hm.', 'think'),
                N('He goes back to the house. He doesn’t write anything in the ledger this time.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 7. SOMEBODY’S (outline quest 8, first half)
      {
        id: 's27-step7',
        goal: 'At dusk, carry Spindle to the main railing by the finishing straight.',
        hint: 'Bring the matchbox. The main railing runs along the straight, opposite the stands.',
        check: 'carry:s27-spindle:main-railing',
        scene: {
          id: 's27-second-night',
          lines: [
            N('Spindle has been working on the second word all day. You can tell from the look of the web: well used, a little ragged.'),
            N('She points one leg, quite firmly, past the pens and out at the finishing straight.'),
            SP('The main rail? With the stands right there? She’s not shy, is she. I love her. I’m terrified.', 'shock'),
            N('Somewhere in the house a lamp is lit in an upstairs window. It stays lit.'),
            N('At dusk, Spindle walks into her matchbox. You put it in your inside pocket, against your shirt, where it’s warm.'),
            N('You cross the yard to the straight in the last of the light, as if you were only going for a walk.'),
          ],
        },
        done: {
          id: 's27-somebodys',
          lines: [
            N('Dawn. All along the main rail, opposite the empty stands, in white: SOMEBODY’S.'),
            N('Fern’s word. Fern, at the fence, has both hands over her mouth.'),
            N('That morning a cart comes over the pass a week early. Mr Tull gets down and walks along the rail, reading it.'),
            TU('Mr Vale. I heard you had a runner with a name. I didn’t think you held with names.', 'think'),
            C('I don’t. It’s the frost. It does odd things up here.'),
            TU('So I see. It’s a lot of odd, for one rail.'),
            N('He doesn’t stay. He climbs back onto his cart and looks at the fence, and the people at it, and frowns all the way up the pass.'),
            N('By noon, the little grey runner has been moved out of the row to a pen behind the house, where the public can’t see.'),
          ],
        },
      },
      // ------------------------------------------------ 8. the toolbox; WARM (outline quests 8, second half, and 9)
      {
        id: 's27-step8',
        goal: 'Carry Spindle in Sparks’s toolbox to the inside pen behind the house.',
        hint: 'Walk slowly past the house. Nobody stops someone carrying a toolbox.',
        check: 'carry:s27-spindle:inside-pen',
        scene: {
          id: 's27-toolbox',
          lines: [
            SP('Behind the house? That’s the coldest pen up here. The tap’s frozen in August. He’s hiding it.', 'angry'),
            SP('Right. Nobody looks twice at a toolbox. Toolboxes are invisible. I’ve walked into the judges’ tent with one.'),
            N('She empties the top tray of her toolbox and lines it with a clean rag, which is the first clean rag you have ever seen her own.'),
            N('Spindle walks in. She settles between a spool of fuse wire and a very small spanner, as if she has always travelled this way.'),
            N('You go past the house at dusk with the toolbox swinging. The lamp in the upstairs window is still lit.'),
            N('Nobody stops you. Sparks was right: nobody looks twice at a toolbox.'),
          ],
        },
        done: {
          id: 's27-warm',
          lines: [
            N('Behind the house the frost is thickest. The inside pen’s rail is so cold your breath crackles on it.'),
            N('At first light, across it, the third word: WARM.'),
            N('Corvin comes round the corner of the house in his shirtsleeves, as if he had been waiting up.'),
            N('He stands at the rail. Then he lays his bare hand flat on the word.'),
            N('You wait for the frost to melt under his palm. It doesn’t, not a single letter.'),
            N('He takes his hand away and looks at it. Then he touches his breast pocket, once, and goes back inside.'),
          ],
        },
      },
      // ------------------------------------------------ 9. getting ready; the Autumn Show (outline quests 10 and 11)
      {
        id: 's27-step9',
        goal: 'Go up to the Circuit for the Autumn Show.',
        hint: 'The Show is on the first autumn morning. Spindle rides in your hat brim. Don’t bend down suddenly.',
        check: 'watch:s27-autumn-show',
        scene: {
          id: 's27-ready',
          lines: [
            N('The first autumn dawn. The frost in the Grove is real frost now, and the leaves have started to let go.'),
            N('Clover comes up the valley with you, and helps you brush the little grey runner through the rail of its pen.'),
            CL('Gently. Grey ones are thin-skinned. Long strokes, and stop when it leans in. That means more.', 'soft'),
            N('It leans in. Clover stops brushing and lets it.'),
            N('Byte is at the rail with his clipboard. His newest stopwatch has a very small web across the strap, and in it, one word: ABOVE.'),
            BY('It isn’t accurate. There’s no data. I’m keeping it.', 'think'),
            BY('I’ve worked out its chances of placing. To three decimal places.'),
            BY('I’m not going to tell you the number.', 'sad'),
            N('Spindle will not be left in the shed. She makes this extremely clear by walking up your sleeve.'),
            N('In the end she rides in the brim of your hat, which is the best seat at the Circuit, and she knows it.'),
          ],
        },
        done: {
          id: 's27-show',
          lines: [
            N('The Autumn Show. Flags, a brass band of three, and more people at the fence than the Circuit has ever had.'),
            N('Most of them aren’t here for the racing. They are here to see a small grey runner with a name.'),
            N('Corvin’s champion, the big grey Number One, wins as it always does. It doesn’t look at the crowd; it never has.'),
            N('The little grey runner comes last. It isn’t slow, exactly: it spends the whole race looking at the people who came.'),
            N('It doesn’t place. The judge pins the three rosettes on three grey runners who don’t look down at them.'),
            N('Mr Tull’s cart is waiting by the gate. He is eating a sandwich, and looks as if he wishes he weren’t there.'),
            N('In your hat brim, Spindle sits very still. Then she taps the brim twice, which you have learned means: tonight.'),
          ],
        },
      },
      // ------------------------------------------------ 10. HOME (outline quest 12, and the night of quest 13)
      {
        id: 's27-step10',
        goal: 'Hold the lantern low for Spindle while she writes her last word.',
        hint: 'Stay by the finishing straight and keep the light steady. She’ll tell you when she’s done.',
        check: 'wait:s27-spindle:home-word',
        scene: {
          id: 's27-home-word',
          lines: [
            N('That night Spindle doesn’t walk into the matchbox. She walks onto your hand, and stays there.'),
            N('You carry her to the very start of the finishing straight. She looks down the whole length of the rail.'),
            N('Then she starts: not one letter, but one stroke of one letter, from the top rail to the bottom.'),
            N('It is going to be the biggest word she has ever written. It is going to take all night.'),
            N('You hold the lantern low, so she can see, and walk beside her down the rail, a step at a time.'),
            N('Your Nubbin falls asleep in your pocket, and wakes, and sleeps again. The lantern hisses.'),
          ],
        },
        done: {
          id: 's27-midnight',
          lines: [
            N('At midnight the house door opens. You shutter the lantern and step back into the shed doorway, out of the light.'),
            N('Corvin comes down the straight in his coat, with a lamp. He is looking for something, and he finds it.'),
            N('Halfway along the rail, in the lamplight, a grey-brown spider is halfway through a letter.'),
            N('He stands over her for a long time. Then he lifts his hand, the cold one, over the web.'),
            N('He holds it there, and you don’t breathe. Spindle doesn’t stop working, not for a single thread.'),
            N('He lowers his hand.'),
            C('Spell it right, then.', 'soft'),
            N('He goes back to the house, and the door shuts quietly. It is the first right thing you have seen him do.'),
            N('You come out of the shed, and open the lantern, and hold it low again. She works on until nearly dawn.'),
          ],
        },
      },
      // ------------------------------------------------ 11. let go, or bought back (outline quests 13 and 14)
      {
        id: 's27-step11',
        goal: 'Walk the little grey runner home to the Grove.',
        hint: 'Go slowly. It has never walked further than the end of the straight.',
        check: 'escort:s27-nine:grove',
        scene: {
          id: 's27-letgo',
          lines: [
            ...S27_MORNING,
            N('Tam is at the pen behind the house. He opens his mouth to say “Nine”, and stops, and says its name instead.'),
            N('He says it carefully, like a word in another language. Corvin pretends not to hear.'),
            C('Take it. It’s no use to me famous.'),
            N('He says it to the rail, not to you. Then he goes back to the house without looking round.'),
            N('The little grey runner looks at the open pen for a long time. Then it follows you to the road, three steps behind.'),
          ],
        },
        done: {
          id: 's27-gate',
          lines: [
            N('At the Grove gate you lift and push. The little grey runner stops on the threshold.'),
            N('It looks at the gate as if a gate is a thing that might shut on it.'),
            N('Your Nubbin hops out of your pocket, goes through, and sits on the far side, waiting.'),
            N('After a long while, the runner comes through too. It sits down by the gatepost and looks at everything.'),
          ],
        },
      },
      // ------------------------------------------------ 12. the egg sac (outline quest 15)
      {
        id: 's27-step12',
        goal: 'Get Spindle’s egg sac down from the shed rafters, and take it somewhere warm for the winter.',
        hint: 'It’s too high to reach from the crate. Somebody small and careful will have to climb.',
        check: 'carry:s27-egg-sac:grove',
        scene: {
          id: 's27-egg-sac',
          lines: [
            N('Autumn comes on properly. Up at the Circuit the shed window has fogged at the corners, and the swallows have gone.'),
            N('Spindle is slower now. She sits in the sun on the sill more than she sits in her web.'),
            N('High in the rafters, where the roof meets the wall, there is something new: a little round sac of silk, the colour of straw.'),
            N('It is the best thing she has ever made. You can see that from the floor.'),
            SP('Her eggs. Hundreds, likely. They sleep in that all winter and come out in the spring.', 'soft'),
            SP('But it’ll freeze up there. Everything up here freezes, come winter. And she can’t carry it. Not now.'),
            N('In the web, very small, a new word: PLEASE.'),
          ],
        },
        done: {
          id: 's27-carry',
          set: { 's27-carrier': 'nubbin' },
          lines: [...S27_LADDER, ...S27_LADDER_DOWN],
        },
      },
      // ------------------------------------------------ 13. the last evening (outline quest 16)
      {
        id: 's27-step13',
        goal: 'Sit with Spindle in the shed window.',
        hint: 'Take the crate by the window. There’s nothing to do. That’s the point.',
        check: 'sit:s27-last-evening',
        scene: {
          id: 's27-last-evening',
          lines: [
            N('The next evening you go up to the shed with nothing to fetch and nowhere to be.'),
            N('Spindle is on the sill in the last of the sun, with her legs drawn in. She lifts one, to say hello, and puts it down again.'),
            N('You sit on the crate. The light goes orange, and then gold, and then the colour of the inside of a shell.'),
            N('You want to say something. You think of everything she did with words, and how few you have.'),
            N('Hazel would know what to say. You think Hazel would also say: say the true thing, and say it plainly.'),
            N('So you do.'),
            Y('You have been my friend.', 'soft'),
            N('Spindle is quiet for a long time. Then she climbs, very slowly, to the corner of her web.'),
            N('She writes one more word. It is very small, the smallest she has ever written, and it is just for you.'),
            N('WELL.'),
          ],
        },
        done: {
          id: 's27-walk-home',
          lines: [
            N('You walk home in the dark with your Nubbin asleep in your pocket.'),
            N('You don’t look back at the window. You think she would prefer it that way; she was always very polite.'),
          ],
        },
      },
      // ------------------------------------------------ 14. the empty web (outline quest 17)
      {
        id: 's27-step14',
        goal: 'Tell Sparks.',
        hint: 'She’s at the start lamp. She already knows. Tell her anyway.',
        check: 'talk:sparks:s27-empty-web',
        scene: {
          id: 's27-empty-web',
          lines: [
            N('In the morning the frost is on the rails as usual. You go to the shed first.'),
            N('The web in the window is still there. The sun comes through it and lays a pattern on the bench.'),
            N('It is empty. The last word is still in the corner, very small: WELL.'),
            N('Your Nubbin climbs out of your pocket onto the bench, and sits under the web, and looks up at it.'),
            N('It doesn’t do anything. It just sits next to it, the way you sat next to her.'),
            N('You stand in the doorway for a while. Then you go to find Sparks.'),
          ],
        },
        done: {
          id: 's27-leave-it',
          lines: [
            N('Sparks doesn’t say anything for a long time, which for Sparks is a very long time.'),
            SP('Leave it.', 'sad'),
            SP('The web. Leave it up. Nobody sweeps that window. Nobody touches it. Not ever.', 'sad'),
            N('Nobody does. It stays in the corner of the shed window, empty, catching the light, and Corvin never has it swept.'),
          ],
        },
      },
    ],
    complete: {
      id: 's27-complete',
      lines: [
        N('A week later Sparks comes down the valley with something in her fist. She opens it on your kitchen table.'),
        N('It is a drawer label off her old cabinet, in her square capitals. SPARE.'),
        SP('She learned her S’s off that one. Every S she ever wrote. Somebody’s. That one.', 'soft'),
        N('Fern has sewn SOMEBODY’S onto a strip of ribbon, a bit crooked, and given one to anybody who stood at the fence.'),
        N('Pixel has made a pane for the Grove lantern shed window. On frosty mornings, a name comes up on it in white.'),
        N('Up at the Circuit, Tam has started calling the runners by names. He makes them up, and some of them are terrible.'),
        N('Corvin pretends not to notice. Once, passing the pens, he is heard to say “morning, Gravel” to the third from the end.'),
      ],
    },
    rewards: [
      {
        id: 's27-frost-window',
        kind: 'decor',
        label: 'The Frost-Web Window',
        description:
          'A pane for the Grove lantern shed. On winter mornings the frost picks out a web on it, and in the web, in white, the name Spindle wrote.',
      },
      {
        id: 's27-ribbon',
        kind: 'cosmetic',
        label: 'SOMEBODY’S Ribbon',
        description: 'A strip of ribbon with SOMEBODY’S sewn on it, a bit crooked, by Fern. For any Nubbin who is.',
      },
      {
        id: 's27-label',
        kind: 'item',
        label: 'Spindle’s Drawer Label: “SPARE”',
        description:
          'A keepsake for the journal. The label off Sparks’s cabinet drawer that Spindle learned her S’s from.',
      },
      {
        id: 's27-three',
        kind: 'feature',
        label: 'Spindle’s three',
        description:
          'From the first spring, three tiny spiders live in the Grove lantern shed. They write very small words now and then. Ambient only: no care, no chores.',
      },
      {
        id: 's27-boughtback',
        kind: 'flag',
        label: 'boughtBack',
        description:
          'Sold path only. Your sold Nubbin comes home, and the Collector ending can now come only from keeping the stone.',
      },
    ],
    sets: { s27Done: true },
    childLines: {
      's27-last-evening#6': 'I’m so glad it was you in the window, Spindle.',
      's27-spring#9': 'Not many friends can spell, and not many spellers stay up all night for a friend.',
      's27-spring-wisp#9': 'Not many friends can spell, and not many spellers stay up all night for a friend.',
    },
    notes:
      'THEME. A small life saved by words, and a friend who writes them and then dies, as everything does, in her season. ' +
      'The gentlest answer to Corvin, who keeps Nubbins quiet and numbered: a spider gives one a name the whole valley can ' +
      'read, written in the very frost that stills his runners. Corvin is the man the valley embarrassed into doing right. ' +
      'SIGNATURE CHOICE (s27-was-it-you, step 6 done; s27-truth): shield (“Yes, it was me”), frost (“Ask the frost”: the ' +
      'truth, slantwise) or silent. PAYOFF four steps later in step 10’s done scene: frost or silent plays s27-midnight ' +
      '(Corvin finds Spindle mid-letter at midnight, lifts his cold hand over her, lowers it: “Spell it right, then.” His first ' +
      'right act in the story); shield plays s27-midnight-shield (VARIANTS: Corvin watches YOU all night from his window and ' +
      'never once looks at the rail; he never learns about Spindle). Both are fine; neither changes the outcome. ' +
      'OUTLINE MAPPING. 18 outline quests in 14 steps: q1→1, q2→2, q3→3, q4→4, q5→5, q6+q7→6, q8→7 and 8 (split: the word, ' +
      'then the move), q9→8 done, q10+q11→9, q12 and q13’s night→10, q13’s morning+q14→11, q15→12, q16→13, q17→14, ' +
      'q18→the spring VARIANTS (post-game). ' +
      'TIMING. A step’s scene plays the moment the previous step’s check is met; its done scene plays when its own check is ' +
      'met. Exceptions: s27-wire plays on the first visit to the Circuit (Races, or the road up the valley) after c5-close and ' +
      'c5-sold; s27-wait plays on the NEXT Circuit visit after s27-tam (a real day between); s27-first-night and ' +
      's27-second-night play at the next dusk at the Circuit; done scenes marked dawn play at the next first light the ' +
      'player is at the Circuit (no fail state, no timer: the frost is there every dawn until it is seen). Steps 1–8 belong ' +
      'to chapters 5–6 (high summer to summer’s end; frost on the rails in August). s27-ready (step 9) waits until c7-open ' +
      'has played (the first autumn dawn). s27-egg-sac (step 12) waits until wisp is set (S2 settled) OR chapter 8 has opened ' +
      '(S2 never played, or closed unfinished). CLOSING. The line must close before chapter 9 opens. If c8-close has played ' +
      'and step 11 is not done, the story closes unfinished: no boughtBack, no Nine, no rewards; chapter 9 runs as before. ' +
      'If step 11 is done but steps 12–14 are not, they close unfinished too (no s27Done, no rewards, no spring scene), but ' +
      'boughtBack and the Nubbin that came home stay. ' +
      'PATHS. Sold path = soldNubbin && !boughtBack when S27 opens (in practice soldNubbin). The runner at the end of the row ' +
      'is painted “9” on both paths, so most scenes are shared: on the sold path it is your sold Nubbin (soldId; c5-sold ' +
      'already showed its painted number), on the runner path a new runner Tam calls Nine. Sold-path replacements ' +
      '(VARIANTS): s27-row-sold for s27-row; s27-words-sold for s27-words (no naming choice: it already has the name you ' +
      'gave it); s27-home for s27-letgo (THE CAMPAIGN HOOK, below); s27-gate-sold for s27-gate. ' +
      'CARRIER (step 12 done). wisp = spared or sable → s27-carry-wisp (sets s27-carrier = wisp; Wisp has trailed you up the ' +
      'valley after the sun-warm sac; he keeps it warm under the cottage step, where he lives, until spring). Otherwise, if ' +
      's21Done → s27-carry-clank; else s27-carry (both set s27-carrier = nubbin: your current Nubbin climbs Sparks’s ladder; ' +
      'the sac winters on the warmest shelf of the Grove lantern shed). ' +
      'SPRING (post-game). In the first spring after the ending, the first morning the player is in the Grove, play ' +
      's27-spring (s27-carrier = nubbin) or s27-spring-wisp (s27-carrier = wisp). Only if s27Done. It is ambient and ' +
      'ending-neutral; queue it after any epilogue and after S24 if both are due that morning. Then spawn Spindle’s three ' +
      '(see REWARDS). ' +
      'CAMPAIGN HOOK: s27-home (Tier 1). Plays INSTEAD of s27-letgo, as step 11’s scene, on the sold path. Corvin names his ' +
      'price, which is what he paid you: 200 Shells. Choices: pay (set boughtBack: true, s27-paid: shells) or hat (the ' +
      'Keepers pass a hat; Fern puts in a button; set boughtBack: true, s27-paid: hat). Readers of boughtBack, unchanged: ' +
      'endingFor (the Collector ending can now come only from keptStone); c9-partner, c9-open-sold and c9-shard-collector ' +
      '(they no longer play: chapter 9 opens with c9-open and the shard scene follows the corvin flag); end-collector-sold ' +
      '(can no longer play; end-collector-kept still can). c5-sold has already played. A later c9-open bargain sets ' +
      'boughtBack again, which is harmless: its 200 Shells are Ash’s price. ' +
      'SIM: (1) In applyChoice, add a side effect for scene s27-home, choice pay or hat, only if soldNubbin && !boughtBack ' +
      'before the choice’s set is applied (guard: snapshot the flag first, since choice.set writes boughtBack). pay: ' +
      'shells = max(0, shells − 200), as c9-open’s bargain does; hat: no Shells change. Then bring the soldId stray home ' +
      'exactly as c9-open’s bargain does: find it in world.strays by soldId; if hasRoom(world), remove it from strays, put it ' +
      'beside the keeper, trust = 20, stray = false, behavior.state = sit, push it to world.nubbins. (2) IF THE GROVE IS FULL: ' +
      'leave it in strays but set its nubbin.trust = 20 and its returnsAtMs = world.timeMs, so the existing stray-return loop ' +
      'in sim/trust.ts brings it to the gate as soon as there is room (it arrives as a stray; that ' +
      'loop’s Math.max(n.trust, 8) keeps the 20). s27-gate-sold is written to work either way. ' +
      '(3) If soldNubbin is true but no soldId stray exists (it was lost some other way), still set boughtBack (the story ' +
      'happened) and take the Shells; skip the homecoming. (4) It stays grey (shadow = true); the painted 9 is cosmetic and ' +
      'fades by the first spring if the renderer can show it. (5) RUNNER PATH: when s27-letgo ends, create a new Nubbin for ' +
      'Nine: adult, grey (shadow = true), run-leaning stats, trust 20, named from flag s27-nine-name; push it to world.strays ' +
      'with returnsAtMs = world.timeMs so it arrives at the gate as a stray you can recruit (feed or pet to settle it). If ' +
      's27-nine-name is the empty string (choice own), open the existing naming box at that choice and write the typed name ' +
      'into s27-nine-name; if left blank, use Tansy. (6) Render the name on the rail in s27-first-word from s27-nine-name ' +
      '(runner) or the soldId Nubbin’s name (sold); the dialogue text never prints it, so no placeholder is needed. ' +
      '(7) The Frost-Web Window decor shows the same name. (8) Spindle’s three: three tiny ambient spider sprites in the Grove ' +
      'lantern shed from the spring scene on; now and then a tiny web word (EVENING, WAIT, WELL, WARM, HOME) appears in the ' +
      'shed window at dawn. No needs, no care, no chores. (9) Tier 2: Spindle’s empty web stays in the Circuit shed window ' +
      'for the rest of the game; Tam uses names after the Show. ' +
      'ART. Web words are drawn as silk letters; at dawn they rime white. Spindle is a grey-brown garden spider no bigger ' +
      'than a fingernail, drawn kindly: round body, neat legs, no fangs. The little grey runner (Nine) is the smallest grey ' +
      'runner, with a white painted 9. Sound: the lantern’s hiss in s27-home-word; silence in s27-empty-web. ' +
      'CANON. Spindle never speaks: every web word is narrated. Nubbins and the runners never speak. Wisp whispers in his ' +
      'S2 lowercase half-voice (“mine. warm. mine.”). Clank speaks (S21; a robot). Hazel is away all through this story: she ' +
      'is only remembered, never present, and her whereabouts are never said. The third rule is echoed (WAIT; the crate by the ' +
      'window) but never quoted. Fern’s word recalls Bramble, whom she lost (seeded in chapter 1); S8 is not referenced. ' +
      'Corvin’s shard is never named: his cold hand, his breast pocket and the frost that doesn’t melt carry it. ' +
      'LEARNING GROVE (for the edu writer). Spiders have eight legs and make silk; some spin egg sacs, and spiderlings ' +
      '“balloon” away on threads in the wind. Frost forms when water in the air freezes on cold surfaces, which is why a web ' +
      'turns white. Reading and spelling with a spider: build each web word letter by letter (WAIT, WARM, HOME, WELL). Life ' +
      'cycles: autumn endings, spring beginnings. Spindle’s death stays offscreen in both bands.',
  },
];

// ================================================================== variants
export const SIDE_STORY_S27_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- sold path: replaces s27-row (step 2 scene)
  {
    id: 's27-row-sold',
    lines: [
      N('Through the shed window, past the spider and her word, you can see the runners’ pens.'),
      N('One pen to each runner, in a straight row, every rail white with frost. Every runner grey, and none of them moving.'),
      N('At the very end of the row is one facing the wrong way. It is looking down the valley, towards the Grove.'),
      N('You know the shape of it. You knew it before you knew you were looking.'),
      N('It was yours, and you sold it in the spring for two hundred Shells. There is a number painted on its side: 9.'),
      N('Outside, a lad with two buckets goes along the pens, whistling. He stops whistling at the end of the row.'),
    ],
  },
  // ---------------------------------------------------------------- sold path: replaces s27-words (step 4 done)
  {
    id: 's27-words-sold',
    lines: [
      ...S27_WORD_HUNT,
      N('Then she points at you, and then at the end of the row, and waits.'),
      SP('She wants to know what it’s called. Its real name. Not the paint.', 'think'),
      N('You tell her the name you gave it the day it hatched. It is strange to say it out loud up here.'),
      N('Spindle writes it once, small, in the corner of the window, to practise. She gets it right first time.'),
    ],
  },
  // ---------------------------------------------------------------- truth = shield: replaces s27-midnight (step 10 done)
  {
    id: 's27-midnight-shield',
    lines: [
      N('At midnight a lamp comes on in the upstairs window of the house, and stays on.'),
      N('Corvin is sitting at the window. He is watching you: Hazel’s heir, with a lantern, at his rail, in the middle of the night.'),
      N('He watches you all night. He watches your hands, and the lantern, and the way you walk the rail a step at a time.'),
      N('He never once looks at the rail itself: he thinks he knows who is writing on it. He is wrong, and you let him be.'),
      N('Spindle works on below the lantern, a thread at a time, and Corvin never sees her. Up here, she is your secret.'),
      N('Near dawn the upstairs lamp goes out, and Spindle ties off the last thread. You can’t feel your fingers.'),
    ],
  },
  // ---------------------------------------------------------------- sold path: replaces s27-letgo (step 11 scene). THE CAMPAIGN HOOK.
  {
    id: 's27-home',
    lines: [
      ...S27_MORNING,
      N('Tam is at the pen behind the house. He opens his mouth to say “Nine”, and stops, and says its name instead.'),
      N('Its real name, the one you gave it. He says it carefully, like a word in another language.'),
      C('It was yours, I believe. Before.', 'think'),
      C('Two hundred Shells. What I gave you for it. Not a Shell more. I’ll not have it said I made a profit off Hazel’s heir.'),
    ],
    choices: [
      {
        id: 'pay',
        label: 'Count out two hundred Shells.',
        set: { boughtBack: true, 's27-paid': 'shells' },
        then: [
          N('You count the Shells into his cold palm. He doesn’t close his hand until the last one.'),
          C('Paid in full. It’s yours.'),
          N('It was always yours. Neither of you says so.'),
          ...S27_HOME_TAIL,
        ],
      },
      {
        id: 'hat',
        label: 'Let the Keepers pass a hat.',
        set: { boughtBack: true, 's27-paid': 'hat' },
        then: [
          SP('Hat. HAT. Somebody give me a hat. Mine’s full of fuses.', 'happy'),
          N('Sparks borrows Byte’s and goes along the fence with it, and it comes back heavy. Fern puts in a button.'),
          FE('It’s a good button. It’s off my good coat.'),
          N('Corvin counts the hat out on the rail, in silence. Two hundred Shells exactly, and a button.'),
          C('…There’s a button.', 'think'),
          FE('It’s a very good button.'),
          N('He looks at it. Then he puts it in his coat pocket: not the breast pocket, the other one.'),
          ...S27_HOME_TAIL,
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- sold path: replaces s27-gate (step 11 done)
  {
    id: 's27-gate-sold',
    lines: [
      N('At the Grove gate, before you can lift and push, your old Nubbin noses at the bottom bar, the way it used to.'),
      N('It remembers the gate sticks. It remembers.'),
      N('It sits down by the gatepost and looks at the Grove for a long time, as if checking it is all still there.'),
      N('The 9 on its side will wash off by the spring. You don’t hurry it.'),
    ],
  },
  // ---------------------------------------------------------------- step 12 done, if s21Done and Wisp is not carrying
  {
    id: 's27-carry-clank',
    set: { 's27-carrier': 'nubbin' },
    lines: [
      N('Clank has followed you up the valley, because somebody said the word “ladder” in his hearing.'),
      CK('Announcement! I cannot climb! I have one wheel! But I am VERY good at steady!', 'happy'),
      ...S27_LADDER,
      N('At the bottom, Clank holds the ladder with both arms and does not move one single bolt.'),
      CK('Steady. Steady. Announcement, but quietly: steady.', 'soft'),
      ...S27_LADDER_DOWN,
    ],
  },
  // ---------------------------------------------------------------- step 12 done, if wisp = spared or sable
  {
    id: 's27-carry-wisp',
    set: { 's27-carrier': 'wisp' },
    lines: [
      N('Something grey drops from the shed beam beside the sac, so quietly that Sparks yelps.'),
      N('Wisp. He has trailed you up the valley, three hedges behind, the way he follows anything warm.'),
      N('He has his torn ear against the sac. It has been in the sun on that beam all afternoon.'),
      W('warm. sun-warm.', 'soft'),
      W('mine. warm. mine.', 'soft'),
      Y('Not yours. Hers. But you could keep it warm for her. Under your step, all winter. Till spring.'),
      N('Wisp thinks about this with his whole body. It is the kind of bargain he understands: you get to hold the warm thing.'),
      W('…keep it warm. warm is keeping. yes.', 'soft'),
      N('He takes it down the wall in his mouth, the way you would carry the last warm thing in the world.'),
      N('Spindle watches every step he takes, then lifts two legs at him, politely. Wisp hisses, and is pleased.'),
    ],
  },
  // ---------------------------------------------------------------- post-game spring, s27-carrier = nubbin
  {
    id: 's27-spring',
    lines: [
      N('The first spring. The snow has gone from the lane, and the wind comes up the valley smelling of wet earth.'),
      N('On the warm shelf in the lantern shed, the little straw-coloured sac has opened.'),
      N('Out come spiders, hundreds of them. Each is smaller than a crumb, and perfectly sure of itself.'),
      N('They climb the shed wall, and the gatepost, and the top bar of the gate that sticks. They line up along it.'),
      N('Then, one by one, each lets out a thread into the wind, and lifts, and floats away over the valley.'),
      N('You stand at the gate and watch them go until they are just glints. It takes all morning, and you don’t mind.'),
      N('Three stay.'),
      N('The next morning, in the corner of the lantern shed window, there is a web no bigger than a thumbnail. It says EVENING.'),
      N('You laugh out loud, on your own, in the shed. Then you say it back: “Evening.”'),
      N('It is not often that someone comes along who is a true friend and a good writer.'),
      N('Spindle was both.'),
    ],
  },
  // ---------------------------------------------------------------- post-game spring, s27-carrier = wisp
  {
    id: 's27-spring-wisp',
    lines: [
      N('The first spring. The snow has gone from the lane, and the wind comes up the valley smelling of wet earth.'),
      N('Under the cottage step, where Wisp has hoarded it all winter like treasure, the little straw-coloured sac has opened.'),
      N('The first thing the spiders see is a grey head with one torn ear, very close, watching them with enormous care.'),
      N('Wisp lets them climb over his nose, and does not hiss once. Then they climb the gate, and line up along the top bar.'),
      N('One by one, each lets out a thread into the wind, and lifts, and floats away over the valley.'),
      N('Wisp watches them go until they are just glints. Then he goes back under the step and sulks, magnificently.'),
      N('Three stay.'),
      N('The next morning, in the corner of the lantern shed window, there is a web no bigger than a thumbnail. It says EVENING.'),
      N('You laugh out loud, on your own, in the shed. Then you say it back: “Evening.”'),
      N('It is not often that someone comes along who is a true friend and a good writer.'),
      N('Spindle was both.'),
    ],
  },
];

/** Every flag S27 sets. (Read only: soldNubbin, soldId, wisp, s21Done; boughtBack is also read, before it is set.) */
export const SIDE_STORY_S27_FLAGS: string[] = [
  'boughtBack', // true: s27-home, either choice (sold path only; Tier 1, existing flag)
  's27Done', // on completion
  's27-truth', // shield | frost | silent (s27-was-it-you)
  's27-nine-name', // runner path: Tansy | Button | the player’s own (s27-words)
  's27-paid', // shells | hat (s27-home)
  's27-carrier', // nubbin | wisp (s27-carry, s27-carry-clank, s27-carry-wisp)
];

export const SIDE_STORY_S27_CHECKS: string[] = [
  'find:s27-wire-coil',
  'talk:s27-tam',
  'sit:s27-shed-window',
  'collect:s27-words:4',
  'watch:s27-pen-railing:dawn',
  'talk:corvin:s27-pens',
  'carry:s27-spindle:main-railing',
  'carry:s27-spindle:inside-pen',
  'watch:s27-autumn-show',
  'wait:s27-spindle:home-word',
  'escort:s27-nine:grove',
  'carry:s27-egg-sac:grove',
  'sit:s27-last-evening',
  'talk:sparks:s27-empty-web',
];
