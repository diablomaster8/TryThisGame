/**
 * S23 Three Visitors: a Grove side story for "Hazel’s Grove" (Part M). Tier 1: it changes the campaign.
 *
 * SOURCE. Charles Dickens, A Christmas Carol (Chapman & Hall, 1843). Public domain worldwide; there is no rights
 *   holder. A cold man is warned by his dead partner, shown his life by three spirits, and wakes able to keep
 *   Christmas. Lifted text is from the 1843 text as given in Project Gutenberg #46 (see LIFTED TEXT below).
 *
 * AUDIENCE. 'main': all ages in the main game, never the Learning Grove (it leans on Book Three’s shard plot and on
 *   ghosts). So no childLines.
 *
 * FRAME. The three nights between c9-close and c10-open. The shard is out of Corvin’s pocket for the first time in
 *   twenty-two years, and the wardens’ echoes come to his cottage up the valley: Briar (what was), Hush (what is) and
 *   Cinder (what will be), after a first caller (Thimble, or his father Aldous if S13 is done). He still can’t feel;
 *   he watches his life like a ledger, and writes each night down: “Nothing felt.” It lands at the Long Night. You are
 *   his witness in the second chair. Your Nubbin sits on his boots. Corvin never comes down to the Grove gate in this
 *   story; his first arrival there after the Long Night stays S9’s s9-dusk.
 *
 * GROVE FLAGS READ, AND WHAT CHANGES (all by variant scenes; see the quest notes for exact rules):
 *   corvin            reconciled | bargained | forced: the note (s23-note*) and the garden at dusk (s23-dusk*).
 *   soldNubbin, boughtBack
 *                     Collector route = soldNubbin && !boughtBack when S23 opens (after chapter 9, so corvin is
 *                     reconciled or forced: bargain always sets boughtBack). Collector variants: the note, Briar
 *                     turns to you, Ember’s stove, your sold Nubbin in the Hollow, you in the snow, a last warning.
 *   s13Done           Aldous is the first caller (s23-caller-aldous), the boy at the mill window plays (s23-window),
 *                     and the winter scene loses Thimble’s greying (s23-cold-one-aldous). Otherwise Thimble comes.
 *   millLetter        kept: you carry Aldous’s letter all three nights and can’t give it yet (s23-coat-letter,
 *                     s23-letter-back). Giving it stays S9’s scene.
 *   s6Done            Ash lifts her head at her true name, the whistle (s23-ash-named).
 *   s8Reunited        the thin grey under the root has an ear that folds over at the tip (s23-root-ear).
 *   keptStone         chapter 10 lane scene (c10-dawn-lane or c10-kept-lane) and the epilogue (-kept).
 *   cinder            epilogue only (end-epi-visitors-cinder), since S19 comes later.
 *
 * FLAGS WRITTEN. visitors (true) and s23Done (true), both on completion. Local: s23-stay (step | home | insist),
 *   s23-answer (maybe | keep-on | sat).
 *
 * LIFTED TEXT. A Christmas Carol, 1843 text, Project Gutenberg #46 (rechecked 2026-10-14 for Staves One to Three).
 *   Only the outline’s verified lines are quoted verbatim:
 *   1. “I wear the chain I forged in life,” / “I made it link by link, and yard by yard;” (Stave One; Aldous, in
 *      s23-caller-aldous; end punctuation made full stops).
 *   2. “No. Your past.” (Stave Two; Briar, s23-briar) and “Look upon me!” (Stave Three; Hush, s23-hush).
 *   3. “Your lip is trembling,” … “And what is that upon your cheek?” (Stave Two; Briar, s23-cold-one).
 *   4. “The happiness he gives, is quite as great as if it cost a fortune.” (Stave Two; Corvin, s23-lantern-night,
 *      with “she gives”; the comma is Dickens’s.)
 *   5. “Another idol has displaced me” (Stave Two; young Hazel, s23-cold-one), then the adapted exchange “What idol?”
 *      / “A cold one.”
 *   Lines 6–8 of the outline (Stave Four’s “Men’s courses…”, “I will live in the Past, the Present, and the Future”,
 *   and Stave Five’s “keep Christmas well”) are marked [unverified], so they are paraphrased in our own words
 *   (s23-pass, s23-complete*, end-epi-visitors*). No other words are Dickens’s. Cinder’s rhyme (s23-rhyme) is the
 *   story bible’s own, with Corvin’s name in it.
 *
 * CARE NOTES. Eerie, never gory. No Nubbin death is shown: the thin grey under the root is the one Hazel carries
 *   down the hill at dawn in chapter 10 (she finds it the next night); the lantern moving away between the trees is
 *   hers, and her face and name are never shown in the Hollow. Echoes (Thimble, Aldous, young Hazel, young Corvin)
 *   use the S1 memory treatment: gold filter, silhouette, no portrait. Thimble never speaks (Nubbins don’t). Briar
 *   and Hush speak a little, as Eternals do; Cinder never speaks here (she will in S19). The third rule is never
 *   named. The Collector route never buys anyone back (that is S27’s job): it is a warning before the water’s edge.
 */
import type { Choice, Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const Y = say('you');
const C = say('corvin');
const FE = say('fern');
const EM = say('ember');
const SP = say('sparks');
const PX = say('pixel');
const BY = say('byte');
const CL = say('clover');

// ---------------------------------------------------------------- new speakers (ids shared with S1 and S13)
const BRIAR: Speaker = {
  id: 'briar',
  name: 'Briar',
  kind: 'nubbin',
  basedOn: 'the Ghost of Christmas Past (A Christmas Carol); here the sun warden’s echo',
};
const HUSH: Speaker = {
  id: 'hush',
  name: 'Hush',
  kind: 'nubbin',
  basedOn: 'the Ghost of Christmas Present (A Christmas Carol); here the moon warden’s echo',
};
const ALDOUS: Speaker = {
  id: 'aldous',
  name: 'Aldous Vale',
  kind: 'other',
  basedOn: 'Jacob Marley’s ghost (A Christmas Carol); Corvin’s father from S13',
};
const YOUNG_HAZEL: Speaker = {
  id: 'young-hazel',
  name: 'Young Hazel',
  kind: 'keeper',
  basedOn: 'Fezziwig’s ball and Belle’s farewell (A Christmas Carol), in this story’s memories only',
};
const YOUNG_CORVIN: Speaker = {
  id: 'young-corvin',
  name: 'Corvin, at twenty-two',
  kind: 'keeper',
  basedOn: 'young Scrooge (A Christmas Carol)',
};

const BR = say('briar');
const HU = say('hush');
const AL = say('aldous');
const YH = say('young-hazel');
const YC = say('young-corvin');

// ================================================================== shared pieces
/** Fern over the fence, after the note (every route that gets a note). */
const NOTE_FERN: Line[] = [
  N('Next door, Fern is pretending to prune something over the fence, in December, when there is nothing to prune.'),
  FE('Is that from him? Up the valley? Don’t go.', 'shock'),
  FE('…You’re going. You’ve got the chin out. Take a scarf. Take two.', 'think'),
];

const DUSK_KNOCK = N('There is a light in one window. When you knock, the door opens before you’ve finished.');

/** The end of the first caller’s scene, whoever came. */
const CALLER_TAIL: Line[] = [
  N('Corvin takes out a ledger and a pencil, and writes down the time. Under it, in the same square hand: “Nothing felt.”'),
  C('Thank you. You’ve witnessed it. You can go home now.'),
  N('He says it kindly, and he means it. It is the first thing he has asked of you that isn’t a price.'),
];

/** Q4: go home, or stay? Pays off twelve quests later, in s23-drip / -home / -insist. */
const STAY_CHOICES: Choice[] = [
  {
    id: 'step',
    label: 'Go out, and sit on his step instead.',
    set: { 's23-stay': 'step' },
    then: [
      N('You go out and sit on his front step in the frost, with your back to his door.'),
      N('After a while the latch clicks behind you: not opening, just checking that you’re there.'),
      N('Inside, the clock begins to strike one.'),
    ],
  },
  {
    id: 'home',
    label: 'Go home, as he asks.',
    set: { 's23-stay': 'home' },
    then: [
      N('You go. The lane is white and silent, and your breath walks on ahead of you.'),
      N('At the bend you look back. One window is lit, and inside, very faintly, a clock begins to strike one.'),
    ],
  },
  {
    id: 'insist',
    label: 'Tell him flatly you’re staying.',
    set: { 's23-stay': 'insist' },
    then: [
      Y('I’m staying.'),
      C('…I see.', 'think'),
      N('He looks at you for a long moment, like a sum that won’t come out. Then he gets up and fills the kettle.'),
      N('The clock begins to strike one.'),
    ],
  },
];

/** Briar’s arrival, before the Collector route’s extra lines. */
const BRIAR_ARRIVES: Line[] = [
  N('One o’clock. A small warm light comes up the lane, bobbing, with a laugh in it somewhere.'),
  N('It doesn’t matter where you were: lane, step or chair. When it comes in at the nailed door, you are in the room to meet it.'),
  N('It is a Nubbin, or the shape of one, made of morning. Light springs up off the crown of her head like water from a spring.'),
  C('Who are you?'),
  BR('Briar. What was.', 'happy'),
  C('Long ago?', 'think'),
  BR('No. Your past.'),
  N('She laughs, not unkindly: the laugh of someone who has just noticed how serious everybody is being.'),
  C('You’re the one in the song. The stream lantern. You’ve been gone longer than this cottage has stood.'),
];
const BRIAR_LEAVES: Line[] = [
  N('She takes his hand, and his hand doesn’t notice. Her other paw she holds out to you, and it is like holding a patch of sun.'),
  N('The back wall of the cottage goes thin as paper, and then it isn’t there at all.'),
];

/** Q8, the winter of the method: the parts both callers share. */
const COLD_START: Line[] = [
  N('The music stops, and the light goes cold and blue. It is winter in the Grove, and very quiet.'),
  N('Too quiet: the Nubbins sit in the frosted grass in a row, not touching. None of them looks up.'),
];
const COLD_END: Line[] = [
  N('Hazel is in the cottage doorway, with snow on her shoulders. She doesn’t shout; she is past shouting.'),
  YH('Another idol has displaced me.', 'sad'),
  YC('What idol?'),
  YH('A cold one.', 'soft'),
  N('That is all. She goes in and shuts the door, and the snow keeps coming.'),
  N('Later, in the dark, the gate opens. That is all the vision shows: a gate, opening, and the dark.'),
  N('Corvin claps his hand over Briar’s light, hard, the way you’d put out a candle. It shines straight through his fingers.'),
  BR('Your lip is trembling. And what is that upon your cheek?', 'soft'),
  N('Nothing: there is nothing on his cheek. His face is perfectly dry.'),
  N('That is the worst of it.'),
];

/** Q12: the root in the Hollow. */
const ROOT_START: Line[] = [
  N('Past the falls, where the paths stop. The Hollow, tonight, under a hard bright frost.'),
  N('At the edge of a ring of old roots, under one root, alone, there is a very thin grey Nubbin.'),
];
const ROOT_END: Line[] = [
  N('It isn’t eating; there is nothing near it to not eat. It isn’t doing anything at all.'),
  N('Far off between the trees, a lantern is moving. Away from you, slowly, stopping now and then.'),
  C('Who keeps a lantern out here?', 'think'),
  N('Hush doesn’t say.'),
  C('Will it live?'),
  N('Hush only looks at the root.'),
  N('In his own garden Corvin would have known exactly what to do with a thin one. He would have made it quiet.'),
];
const CLOAK: Line[] = [
  N('Then Hush opens her grey cloak.'),
  N('Underneath, huddled against her, are two grey Nubbins. They are thinner than the one under the root, older, and very still.'),
  HU('This one is Fear.', 'soft'),
  HU('This one is Hurry.', 'soft'),
  N('Corvin looks at the second one for a long time.'),
  C('I know that one.', 'soft'),
  N('At dawn she is gone, and the cottage is only the cottage.'),
  N('He writes it down: “Hush, 1 to 7. Nothing felt.”'),
];

/** Q15: the high pass and the hill, before the choice. */
const PASS_START: Line[] = [
  N('Then snow, and wind. The high pass above the valley, very far off, as if seen from the bottom of a well.'),
  N('Up there, alone, someone sits hunched over a little light: a cold ember, barely red, cupped in two hands.'),
];
const PASS_HILL: Line[] = [
  N('Then the hill, at home, in some spring. Every flower is out: Briar’s yellow one, and the rest, leaning together.'),
];
const PASS_PLEA: Line[] = [
  N('Corvin kneels by it. You hear his knees crack on the frozen ground.'),
  C('Where a man’s heading tells you where he’ll end up. If he keeps on.', 'sad'),
  C('But he can turn off the road, and then the end moves. Say that’s what this is. Say that’s what you’re showing me.', 'sad'),
];
const ANSWER_CHOICES: Choice[] = [
  {
    id: 'maybe',
    label: '“It may be.”',
    set: { 's23-answer': 'maybe' },
    then: [Y('It may be.'), N('He nods, as if you’ve given him a figure he can work with.')],
  },
  {
    id: 'keep-on',
    label: '“Only if you keep on.”',
    set: { 's23-answer': 'keep-on' },
    then: [
      Y('Only if you keep on.'),
      N('He nods slowly. Keeping on is the one thing he has always known how to do.'),
    ],
  },
  {
    id: 'sat',
    label: 'Say nothing. Sit down in the snow beside him.',
    set: { 's23-answer': 'sat' },
    then: [
      N('You don’t answer. You sit down in the snow next to him, close enough that your shoulders touch.'),
      N('He doesn’t move away. You stay like that until the snow stops.'),
    ],
  },
];

/** Q16: the morning before the Long Night, before the Q4 payoff. */
const DRIP_START: Line[] = [
  N('The morning before the Long Night. You walk up the valley one more time, because it seems wrong not to.'),
  N('Something is different about the sound of Corvin’s garden. Then you have it: dripping.'),
  N('His railings are dripping. All along the fence, in the low sun, the frost is coming off them one bead at a time.'),
  N('Corvin is at his gate in his shirtsleeves, watching it, holding a pan with a lid on.'),
  C('Somebody left soup on my step last night. In a pan with a fern scratched on the lid.', 'think'),
  C('I didn’t know what to do with it. So I ate it.'),
  C('First time since summer, the railings. The tin’s been out of my pocket four days. They’ve only just noticed.'),
];

/** Q16: the vow, before your Q15 answer shapes his reply. */
const VOW: Line[] = [
  N('He goes in and comes back with the ledger. He reads the last three pages to himself, moving his lips.'),
  C('Briar. Hush. Cinder. What was, what is, and what’s coming.', 'think'),
  C('I’ll keep all three. I’ll live in all of them at once, and I won’t shut the door on any of them again.'),
  C('I don’t feel a word of it. I’m saying it anyway. That’s allowed, isn’t it?'),
];
/** Q16: the vigil, after his reply. */
const VIGIL_ASK: Line[] = [
  C('Tonight. Where do people stand, at a vigil? I’ve never been to one. I’ve only ever been the reason for one.', 'think'),
  Y('The gate sticks.'),
  Y('But the lane’s anybody’s.'),
  N('He thinks about that. Then he tears the three pages out of the ledger, folds them once, and gives them to you.'),
  C('For your records. And take the dressing gown off the back of the door, and the cap. You sat up three nights. Dress for it.'),
  N('Behind him the railings drip, and drip, and the sound goes all the way down the valley.'),
];

/** The epilogue’s first line, shared by end-epi-visitors and its two versions. */
const EPI_CHAIRS = N('Every year, on the three nights before the Long Night, Corvin sits up with two chairs.');
const EPI_KEEPS = N('They say of him now that nobody in the valley keeps the Long Night better. He says that’s a low bar, and keeps it.');

// ================================================================== the quest
export const SIDE_STORY_S23: Quest[] = [
  {
    id: 's23',
    code: 'S23',
    title: 'Three Visitors',
    source:
      'A Christmas Carol (Charles Dickens, 1843): Marley’s warning, the three spirits, Fezziwig’s ball, Belle, Fred’s ' +
      'guessing game, Ignorance and Want, the unmourned grave and the vow. Public domain; lifted lines from the 1843 text ' +
      '(Project Gutenberg #46), listed in the file header',
    audience: 'main',
    trigger: {
      where: 'A note under your door; then Corvin Vale’s cottage up the valley, and wherever the visitors walk',
      when:
        'The morning after c9-close, on every chapter 9 route (the Collector partner route included). It runs over the ' +
        'three nights before the Long Night and closes when c10-open plays.',
    },
    speakers: [BRIAR, HUSH, ALDOUS, YOUNG_HAZEL, YOUNG_CORVIN],
    steps: [
      // ------------------------------------------------ 1. A Note Under the Door; Up the Valley at Dusk (Q1–Q2)
      {
        id: 's23-step1',
        goal: 'Go up the valley to Corvin’s cottage at dusk.',
        hint: 'Take the road past the bridge, where the frost starts. His is the square garden.',
        check: 'visit:s23-cottage:dusk',
        scene: {
          id: 's23-note',
          lines: [
            N('The morning after the shard came home, there is a note on the mat inside your door.'),
            N('Very good paper. A very neat hand, every letter standing up straight, as if somebody were checking.'),
            C('“Something came last night. I’d like a witness. C.V.”', 'think'),
            N('On the back, smaller, as if it were added at the door: “Dusk.”'),
            ...NOTE_FERN,
          ],
        },
        done: {
          id: 's23-dusk',
          lines: [
            N('Dusk, up the valley. Corvin’s garden is empty, and the gate stands open, the way he left it.'),
            N('Nothing has come back. The rows are only lines of bare earth in the frost, very straight.'),
            DUSK_KNOCK,
          ],
        },
      },
      // ------------------------------------------------ 2. the two chairs (Q2)
      {
        id: 's23-step2',
        goal: 'Sit up with Corvin until midnight.',
        hint: 'Take the second chair. Don’t light the stove: he’d rather you didn’t.',
        check: 'sit:s23-second-chair:midnight',
        scene: {
          id: 's23-chairs',
          lines: [
            N('Inside, the cottage is clean and silent and nearly empty. The stove is laid, and not lit.'),
            N('In front of it are two chairs, set square, a little apart. One has a cushion that has never been sat on.'),
            C('You came. Good. Sit. The one with the cushion. I bought it for visitors. There haven’t been any.'),
            N('He sits in the other, his left hand flat on his coat over the breast pocket. The pocket is empty.'),
            N('He keeps his hand there anyway. Now and then he presses, as if to check.'),
            C('Last night, at midnight, something knocked. Not at the front.', 'think'),
            C('At that one.'),
            N('He nods at a second door in the back wall. It is nailed shut, and the nails have rusted into the frame.'),
            C('That door hasn’t opened in twenty-two years. It faces the valley. I didn’t care for the view.'),
            C('I didn’t answer. I sat here, and I felt nothing. I’d like that confirmed by somebody else.'),
            N('Your Nubbin climbs onto his boots and settles there, the way it sits on yours. He looks down at it.'),
            C('It’s warm. I can see that it’s warm. I can’t feel that it is. Do you understand the difference?', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 3. The First Caller; Go Home, or Stay? (Q3–Q4)
      {
        id: 's23-step3',
        goal: 'Wait for the first of the three.',
        hint: 'Wherever you chose to be, stay there. One o’clock comes on its own.',
        check: 'wait:s23-first-night:one-oclock',
        scene: {
          id: 's23-caller',
          lines: [
            N('Midnight. The clock strikes, and the nailed door doesn’t open, and someone comes in through it anyway.'),
            N('Small and round, gold at the edges the way old memories are, and grey all through. You can see the nails through him.'),
            C('…Thimble.', 'shock'),
            C('Hazel’s. One of hers. He was the first one I—', 'soft'),
            N('He doesn’t finish. Thimble crosses the floor without a sound and sits on Corvin’s other boot.'),
            N('Then he goes to the window and touches the frosted glass: once, twice, three times. Three small prints.'),
            N('He looks at you, in the second chair, as if making sure the witness is counted. Then at Corvin.'),
            C('Three.', 'think'),
            C('And I’m to sit up for them.'),
            N('When you look back at the window, Thimble has gone. The three prints are still there.'),
            ...CALLER_TAIL,
          ],
          choices: STAY_CHOICES,
        },
      },
      // ------------------------------------------------ 4. Night One: Briar (Q5)
      {
        id: 's23-step4',
        goal: 'Walk with Briar and Corvin into what was.',
        hint: 'Keep close to her light. Visions don’t wait, but they don’t hurry either.',
        check: 'walk:s23-briar:what-was',
        scene: {
          id: 's23-briar',
          lines: [
            ...BRIAR_ARRIVES,
            BR('Gone. Yes. Up you get, Corvin Vale. You too, witness.', 'happy'),
            ...BRIAR_LEAVES,
          ],
        },
      },
      // ------------------------------------------------ 5. Lantern Night, Twenty-Two Years Ago (Q7; Q6 is an add-on)
      {
        id: 's23-step5',
        goal: 'Watch Lantern Night, twenty-two years ago.',
        hint: 'Stay by the pond. When the fiddle starts, nobody minds where you stand.',
        check: 'watch:s23-lantern-night:reel',
        scene: {
          id: 's23-lantern-night',
          lines: [
            N('Then it is summer, all at once: the Grove at dusk, twenty-two years ago, on Lantern Night.'),
            N('The gate opens at a touch, like any gate. You have never once seen it do that.'),
            N('A young man stands just inside it in a thin coat, as if he isn’t sure he’s allowed any further.'),
            N('A woman comes down the path with a lantern in each hand, laughing at someone behind her. She isn’t old yet.'),
            YH('Corvin. Hold this. No, by the handle, you’ll have your eyebrows off.', 'happy'),
            N('She gives him her lantern, and he holds it as if it might go off. Nobody has ever handed him anything lit before.'),
            N('Then there is a fiddle, and a reel on the grass by the pond, and the whole valley dancing it badly.'),
            N('Corvin dances it worst. He goes left when everyone goes right, and treads on Hazel twice.'),
            N('She laughs. Not at him: with him, until he laughs too, helplessly, bent over with his hands on his knees.'),
            BR('Such a little thing. A field, some candles, a man with a fiddle.', 'happy'),
            N('Beside you, the older Corvin watches his younger self laugh. His own face doesn’t move.'),
            C('It cost her nothing. Some candles. A field she already had.', 'think'),
            C('The happiness she gives, is quite as great as if it cost a fortune.'),
            N('He says it flat, like a clerk reading back a sum. As if he has found it written down in someone else’s hand.'),
          ],
        },
        done: {
          id: 's23-reel',
          lines: [
            N('The reel comes round again. Briar tugs at your sleeve until you join in at the bottom of the set.'),
            N('You learn it the way everyone did: wrong, then less wrong, then not caring. Young Hazel spins past without seeing you.'),
            N('Corvin doesn’t dance. He stands where his younger self stood, by the gate, holding nothing.'),
          ],
        },
      },
      // ------------------------------------------------ 6. A Cold One (Q8)
      {
        id: 's23-step6',
        goal: 'See the winter that ended it.',
        hint: 'There is nothing to do but watch. That’s the hard part.',
        check: 'watch:s23-winter:gate',
        scene: {
          id: 's23-cold-one',
          lines: [
            ...COLD_START,
            N('The smallest sits on young Corvin’s boot, the way yours sat on his tonight. It is Thimble, and the grey is coming up through him like damp through paper.'),
            N('Young Corvin doesn’t look down. His hand is flat on his coat, over a pocket that isn’t empty yet.'),
            ...COLD_END,
          ],
        },
        done: {
          id: 's23-dawn-one',
          lines: [
            N('Then it is the cottage again, and the clock says a quarter past two. Briar has gone.'),
            N('The room smells of summer for a moment, and then it doesn’t.'),
            N('Corvin opens the ledger and writes, in the square hand: “Briar, 1 to 2.15. Nothing felt.”'),
            C('Same time tomorrow. If you’re coming.', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 7. Night Two: Hush (Q9)
      {
        id: 's23-step7',
        goal: 'Follow Hush into what is.',
        hint: 'She only shows tonight. Everything you see is happening right now, somewhere in the valley.',
        check: 'walk:s23-hush:what-is',
        scene: {
          id: 's23-hush',
          lines: [
            N('The second night. Corvin is in his chair before you arrive, with the ledger open on his knee.'),
            N('Neither of you says anything for three hours. It isn’t comfortable, and it isn’t meant to be.'),
            N('At one o’clock the cottage goes quiet. Not silent: quiet, as if every sound has been gently put away.'),
            N('She is in the corner, though nobody saw her come. Tall for a Nubbin, moon-pale, wrapped in her own grey like a cloak.'),
            N('It is the quietest thing you have ever seen. Even the clock seems to tick more carefully.'),
            C('Hush.', 'soft'),
            C('The old wall. The one who sat with the still ones.', 'think'),
            HU('Look upon me!', 'soft'),
            N('She says it so quietly it is hardly more than a breath. Then nothing more.'),
            N('He looks, and so do you. There isn’t much to see: a pale shape, a grey cloak, patience all the way down.'),
            N('Then she turns to the nailed door, and it lets her through, and both of you after her, into tonight.'),
          ],
        },
      },
      // ------------------------------------------------ 8. Ember’s Stove (Q10)
      {
        id: 's23-step8',
        goal: 'See what is happening in Ember’s kitchen tonight.',
        hint: 'Hush takes you in through the wall. Ember can’t see you. Don’t try to help.',
        check: 'watch:s23-ember:stove',
        scene: {
          id: 's23-stove',
          lines: [
            N('Ember’s kitchen, tonight, by the light of one lamp. The stove is lit and the kettle is on, and nobody is drinking anything.'),
            N('Ash lies by the stove, grey, facing the corner.'),
            N('Ember puts a bowl down beside her. Ash doesn’t turn, and Ember doesn’t wait to see if she will.'),
            EM('I hope he’s cold.', 'angry'),
            EM('I hope he’s sitting up there in that clean house, cold to the bone, and nobody comes.', 'angry'),
            N('In the dark of her kitchen, Corvin stands very straight and listens to himself being hoped about.'),
            N('Ember stares at the stove for a long time.'),
            EM('…No.', 'soft'),
            EM('I hope he’s cold exactly as long as it takes.', 'soft'),
            N('She doesn’t say as long as what takes. She gets up and puts another log on, which wasn’t needed.'),
            C('That’s fair. That’s more than fair.', 'think'),
          ],
        },
        done: {
          id: 's23-ash',
          lines: [
            EM('Ash.', 'soft'),
            N('Nothing. Ash faces the corner.'),
            EM('Ash, love.', 'soft'),
            N('Nothing. Ember says it again anyway, the way you’d leave a light on for someone.'),
          ],
        },
      },
      // ------------------------------------------------ 9. The Lantern Shed (Q11)
      {
        id: 's23-step9',
        goal: 'Look in on the lantern shed.',
        hint: 'The Keepers are getting ready for the Long Night. They can’t see you. Just listen.',
        check: 'watch:s23-lantern-shed:guessing-game',
        scene: {
          id: 's23-shed',
          lines: [
            N('The lantern shed, tonight, well past midnight. It is full of people, wire and the smell of lamp oil.'),
            N('The Keepers are readying the lanterns for the Long Night. Nobody has gone home, or seems to have thought of it.'),
            SP('Right. Guessing game. I’m thinking of an animal. Sort of an animal.', 'happy'),
            BY('Is it a badger? It’s always a badger.', 'think'),
            SP('Not a badger. It lives up the valley. It growls. It has extremely clean railings.', 'happy'),
            PX('Is it a cold animal?'),
            SP('VERY cold. Never laughs. Thinks laughing is a waste of breath.', 'happy'),
            FE('Is it… Corvin?'),
            SP('YES! Fern gets a biscuit!', 'happy'),
            N('Everyone laughs. Among them, in the lamp smoke, Corvin nods slowly.'),
            C('Accurate.', 'think'),
            N('Fern stops laughing first. She turns her biscuit over in her hands.'),
            FE('Somebody should take him soup. He’s up there on his own, with all that.', 'soft'),
            SP('…Bags not.', 'think'),
            FE('No. I know. I’ll do it.', 'soft'),
          ],
        },
        done: {
          id: 's23-pond-chair',
          lines: [
            N('Hush leads you both out, and not by the gate. She goes over the old wall by her own post, the way the quiet ones go.'),
            N('By the pond there is an old chair with a cushion on it, flattened in the shape of someone who sat there for years.'),
            C('Whose is that?'),
            N('Hush doesn’t answer.'),
            N('You know whose, and so does he. He doesn’t ask again.'),
          ],
        },
      },
      // ------------------------------------------------ 10. Under a Root (Q12)
      {
        id: 's23-step10',
        goal: 'Go with Hush to the Hollow.',
        hint: 'Follow her past the falls. Touch nothing there: you are only seeing it.',
        check: 'walk:s23-hush:hollow',
        scene: {
          id: 's23-root',
          lines: [...ROOT_START, ...ROOT_END],
        },
        done: {
          id: 's23-cloak',
          lines: CLOAK,
        },
      },
      // ------------------------------------------------ 11. Night Three: Cinder (Q13)
      {
        id: 's23-step11',
        goal: 'Look where Cinder points.',
        hint: 'She won’t speak. Follow her paw, not her face.',
        check: 'watch:s23-cinder:later-spring',
        scene: {
          id: 's23-cinder',
          lines: [
            N('The third night. The ledger is open on his knee before you’ve sat down.'),
            N('At one o’clock the room goes red at the edges, like a page held too near a candle.'),
            N('She doesn’t come in by any door. She is simply there, by the cold stove, as if she always had been.'),
            N('A Nubbin-shape of embers, burning low and fierce, even now. She doesn’t look at either of you.'),
            C('…Cinder.', 'shock'),
            N('She says nothing. She will say nothing, all night.'),
            N('She raises one paw, and points.'),
            N('The Grove, in some later spring. Every Nubbin in it sits in the sun, quite still, quite safe.'),
            N('Nothing is hungry or frightened, and nothing runs into the dark. Nobody has gone up the hill in years.'),
            N('The gate opens by itself, and makes no sound at all.'),
            C('Whose Grove is that?', 'think'),
            N('Cinder doesn’t answer. She only keeps pointing, until he is the one who looks away.'),
          ],
        },
      },
      // ------------------------------------------------ 12. The Rhyme (Q14)
      {
        id: 's23-step12',
        goal: 'Walk the lane on a Lantern Night that hasn’t happened yet.',
        hint: 'Keep to the verge. The children won’t see you.',
        check: 'walk:s23-cinder:lane',
        scene: {
          id: 's23-rhyme',
          lines: [
            N('Then a lane at dusk, on a Lantern Night years from now, with lanterns on every gatepost and children skipping in the road.'),
            N('They chant it the way children chant old things, flat and fast. You know the tune; one word is new.'),
            N('“Corvin held them close and tight, / kept them warm one winter night;”'),
            N('“when the morning came to call, / they did not move at all.”'),
            N('The children shriek and scatter, laughing the way you laugh at something that can’t catch you any more.'),
            N('Corvin stands in the road where they skipped, his lips moving. He is saying it over, checking it.'),
            C('Close and tight. Winter night. Came to call. Not at all.', 'think'),
            C('They’ve got the words right.'),
            N('A long pause.'),
            C('They’ve got me right, too.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 13. The High Pass (Q15)
      {
        id: 's23-step13',
        goal: 'Go where Cinder points, the last time.',
        hint: 'The high pass, then the hill. When he asks, the answer is yours, not hers.',
        check: 'watch:s23-cinder:high-pass',
        scene: {
          id: 's23-pass',
          lines: [
            ...PASS_START,
            N('It is a man, in a good coat gone thin. It is Corvin, sitting where she sat, keeping what she kept.'),
            ...PASS_HILL,
            N('There is no flower for him. Only a bare patch by the path, where the frost stays after everything else has thawed.'),
            ...PASS_PLEA,
            N('Cinder looks at him a long time. Then she holds out a paw to him.'),
            N('He takes it. It is warm: the only warm thing in three nights.'),
            N('She doesn’t answer him; she can’t, or won’t. So he looks up at you instead.'),
          ],
          choices: ANSWER_CHOICES,
        },
        done: {
          id: 's23-dawn-three',
          lines: [
            N('Dawn, in the cottage: the stove still unlit, the ledger open on his knee.'),
            N('He writes: “Cinder, 1 to 8.” And then, after a long time, the same as every night: “Nothing felt.”'),
            N('But he underlines it, as if it were a figure he no longer trusts.'),
          ],
        },
      },
      // ------------------------------------------------ 14. The Drip (Q16)
      {
        id: 's23-step14',
        goal: 'Hear Corvin out, at his gate.',
        hint: 'He’ll talk if you stand there long enough. Don’t hurry him.',
        check: 'talk:corvin:s23-railings',
        scene: {
          id: 's23-drip',
          lines: [
            ...DRIP_START,
            C('The first night. Three in the morning. I came out, and you were asleep on my step in the frost.', 'think'),
            C('I put my coat over you. I didn’t decide to. My hands did it.'),
            N('You remember waking under a coat that wasn’t yours. You thought Briar must have left it.'),
            C('I don’t know what that was. I’m only reporting it.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 's23-complete',
      lines: [
        ...VOW,
        C('You said “it may be.” On the hill.', 'think'),
        C('That isn’t a promise. I’ve been made a great many promises. I’d rather have “it may be”.', 'soft'),
        ...VIGIL_ASK,
      ],
    },
    rewards: [
      {
        id: 's23-visitors',
        kind: 'flag',
        label: 'visitors',
        description:
          'Set when all three nights have played. A sixth S9 “family” condition; Corvin stands in the lane with a lantern during the vigil; adds an epilogue line.',
      },
      {
        id: 's23-nightcap',
        kind: 'cosmetic',
        label: 'Corvin’s nightcap and dressing gown',
        description:
          'A long grey nightcap and a heavy dressing gown from the back of Corvin’s door. For sitting up in. Your Keeper looks very awake in them.',
      },
      {
        id: 's23-reel',
        kind: 'cosmetic',
        label: 'Lantern Night reel (emote)',
        description:
          'The reel from young Hazel’s Lantern Night, danced badly with great commitment. Nearby Nubbins join in at the bottom of the set.',
      },
      {
        id: 's23-pages',
        kind: 'item',
        label: '“Three Nights” journal pages',
        description:
          'Three pages torn from Corvin’s ledger, in his square hand: each visitor, the hours, and “Nothing felt”, the last one underlined.',
      },
    ],
    sets: { visitors: true, s23Done: true },
    notes:
      'THEME. Dickens wrote a cold man shown his life on three nights who wakes able to feel. Here the visitors come while ' +
      'Corvin still can’t feel anything, so he watches his whole life like a ledger (“Nothing felt”, every night), and it ' +
      'only lands at the Long Night, when the stone is unmade. The second step of his redemption: chapter 9, S23, ' +
      'chapter 10, S13, S9. You are the witness; the visitors do the persuading. ' +
      'SIGNATURE CHOICE. Q4 (s23-caller: step | home | insist, flag s23-stay) pays off in Q16, twelve quests later: ' +
      's23-drip (step: he put his coat over you at three in the morning, “My hands did it”), s23-drip-home (he left the ' +
      'door unlatched on nights two and three, “Don’t read into it”), s23-drip-insist (two cups of tea every night, his ' +
      'never drunk). Q15 (s23-pass: maybe | keep-on | sat, flag s23-answer) shapes his closing reply: s23-complete, ' +
      's23-complete-keep-on, s23-complete-sat. ' +
      'TIMING. Opens the morning after c9-close, on every chapter 9 route. Step 1 at dusk; steps 2–6 are night one, 7–10 ' +
      'night two, 11–13 night three, 14 the morning before the Long Night. A step’s scene plays the moment the previous ' +
      'check is met; its done scene when its own check is met. The nights are story nights: each advances on its checks, ' +
      'not on a clock (no timers). Corvin’s cottage scenes are always at night; S6 and other day stories can play by day. ' +
      'If c10-open plays before step 13’s check, the story closes unfinished: no rewards, and visitors stays unset. If ' +
      'step 13 is done, play s23-drip and s23-complete before c10-open (they are the morning before the Long Night). ' +
      'VARIANTS (SIDE_STORY_S23_VARIANTS). Collector route = soldNubbin && !boughtBack when S23 opens. ' +
      '(1) s23-note → s23-note-bargained (corvin = bargained), s23-note-forced (corvin = forced, not Collector), ' +
      's23-note-collector (Collector; wins over the corvin variants). ' +
      '(2) s23-dusk → s23-dusk-bargained (bargained: the rows still full) or s23-dusk-forced (forced, Collector or not: the ' +
      'pens wrecked). Reconciled, Collector or not, keeps s23-dusk (the garden is empty, as c9-shard-reconciled leaves it). ' +
      '(3) s23-caller → s23-caller-aldous when s13Done. ' +
      '(4) s23-briar → s23-briar-collector (Collector). ' +
      '(5) s23-cold-one → s23-cold-one-aldous when s13Done (Thimble’s winter is cut, since he never came). ' +
      '(6) s23-stove → s23-stove-collector (Collector). (7) s23-ash → s23-ash-named when s6Done. ' +
      '(8) s23-root → s23-root-ear when s8Reunited. (9) s23-cloak → s23-cloak-collector (Collector). ' +
      '(10) s23-pass → s23-pass-collector (Collector). (11) s23-drip → s23-drip-home (s23-stay = home) or s23-drip-insist ' +
      '(insist); step keeps s23-drip. (12) s23-complete → s23-complete-keep-on or s23-complete-sat by s23-answer; maybe keeps ' +
      's23-complete. ' +
      'ADD-ONS (also in VARIANTS). s23-coat-letter: straight after s23-note (any version) when millLetter = kept. ' +
      's23-window: when s13Done, straight after the walk:s23-briar:what-was check, before s23-lantern-night (Q6: the boy at ' +
      'the mill window and Tobin’s lamp). s23-partner: on the Collector route, after the talk:corvin:s23-railings check, ' +
      'before s23-complete*. s23-letter-back: after s23-complete* when millLetter = kept. ' +
      'CAMPAIGN HOOKS (VARIANTS, exact places). ' +
      'c10-vigil-corvin: if visitors, after c10-vigil (after c10-vigil-wisp when that plays), before the timed vigil step. ' +
      'Narration only: Corvin in the lane beyond the gate with a lantern. Nobody goes to him or sends him off; he doesn’t ' +
      'try the latch; nothing is gated by it; it is not his arrival (that stays s9-dusk). ' +
      'c10-dawn-lane: if visitors and keptStone false, straight after c10-dawn, before the Moss scene (c10-moss-stays | ' +
      'c10-moss-fades | c10-moss-mourned). He went home at first light, so s9-dusk is still his first arrival. ' +
      'c10-kept-lane: if visitors and keptStone true, straight after c10-kept, before c10-close. ' +
      'Epilogue: end-epi-visitors (visitors, keptStone false, cinder unset), end-epi-visitors-cinder (visitors and cinder ' +
      'set: it replaces end-epi-visitors, with the red-flower line added), end-epi-visitors-kept (visitors and keptStone: ' +
      'replaces it). Exactly one plays, after end-epi-gate-* and before end-epi-mill-*, in every ending. ' +
      'S9. visitors is the sixth “family” condition (S9’s notes already count it). ' +
      'TIER 2. After s23-complete, Corvin’s railings stop frosting (art: wet, dripping, then plain iron), even before the ' +
      'stone is unmade. Fern did take the soup up (s23-drip); Ember gains s23-ember-soup in her talk pool from chapter 11. ' +
      'ART AND SOUND. Echoes (Thimble, Aldous, young Hazel, young Corvin) use S1’s memory treatment: gold filter, ' +
      'silhouette, no portrait. Briar: warm gold light springing from her crown. Hush: tall, moon-pale, grey cloak, all ' +
      'sound damped while she is on screen. Cinder: ember-red, the screen red at the edges, no voice SFX. Night two shows ' +
      'the Keepers as they are tonight; they can’t see you (no interaction). The Long Night’s present-day Keepers are ' +
      'unchanged. The ledger is a readable prop. The three window prints stay on Corvin’s glass for the rest of S23. ' +
      'CANON. Never show Hazel’s face or name in the Hollow; the moving lantern is hers, and the thin grey is the one she ' +
      'carries down at dawn (she finds it the next night). Nothing here says where Hazel is. The third rule is never ' +
      'named. Corvin never comes to the Grove gate: Hush brings the vision in over the old wall. The Collector route never ' +
      'buys anyone back; do not make the numbered Nubbin recruitable here. ' +
      'REWARDS. All given at s23-complete (the reel emote unlocks then too, though you learn it in s23-reel). ' +
      'SIM: (a) new flags visitors and s23Done (approved), local s23-stay and s23-answer; (b) the closing rule above (c10-open ' +
      'waits for s23-drip and s23-complete once step 13 is done); (c) variant and add-on selection as listed; (d) the ' +
      'railing art state after s23Done; (e) s23-ember-soup in Ember’s chapter 11 talk pool when s23Done.',
  },
];

// ================================================================== variants, add-ons, campaign hooks and epilogues
export const SIDE_STORY_S23_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- Q1: the note, by route (replace s23-note)
  {
    id: 's23-note-bargained',
    lines: [
      N('The morning after the shard came home, there is a note on the mat inside your door.'),
      N('Very good paper. A very neat hand, every letter standing up straight, as if somebody were checking.'),
      C('“I’d like to hire a witness. Three nights. Rates negotiable.”', 'think'),
      C('“Something came last night. I’d like it seen by someone who isn’t me. C.V.”'),
      N('On the back, smaller, as if it were added at the door: “Dusk.”'),
      ...NOTE_FERN,
    ],
  },
  {
    id: 's23-note-forced',
    lines: [
      N('No note comes. Ember comes instead, early, and stands at your gate without lifting the latch.'),
      N('Ash is three steps behind her, grey, looking at nobody.'),
      EM('His lights were on all night. Up the valley. Every window. I could see them from the bridge.', 'think'),
      EM('Somebody should check he isn’t dead.', 'angry'),
      EM('Not me.'),
      N('She goes. Halfway down the lane she stops, without turning round.'),
      EM('Dusk’s when it’s worst. If anyone’s going. Which I’m not saying they should.'),
    ],
  },
  {
    id: 's23-note-collector',
    lines: [
      N('The morning after the shard came home, there is a note on the mat inside your door, like the last one.'),
      N('Very good paper, and a very neat hand. It is much shorter than the last one.'),
      C('“Partner. Sit up with me. C.V.”', 'soft'),
      N('No “come and see”, and no price. You read it three times, looking for the catch, and can’t find one.'),
      ...NOTE_FERN,
    ],
  },
  // ---------------------------------------------------------------- Q2: the garden at dusk, by route (replace s23-dusk)
  {
    id: 's23-dusk-bargained',
    lines: [
      N('Dusk, up the valley. Corvin’s garden is still full: grey Nubbins in grey rows, not touching.'),
      N('In the third row there is a gap where Ash stood. Nobody has closed it up.'),
      DUSK_KNOCK,
    ],
  },
  {
    id: 's23-dusk-forced',
    lines: [
      N('Dusk, up the valley. Corvin’s garden is wrecked: pens hanging open, rails down, the ground churned and frozen hard.'),
      N('He hasn’t mended any of it. A rake lies where it was dropped, with frost on the handle.'),
      N('There is a light in every window. When you knock, the door opens before you’ve finished.'),
    ],
  },
  // ---------------------------------------------------------------- Q3: Aldous, when s13Done (replaces s23-caller)
  {
    id: 's23-caller-aldous',
    lines: [
      N('Midnight. The clock strikes, and the nailed door doesn’t open, and someone comes in through it anyway.'),
      N('A big man in a miller’s apron, gold at the edges the way old memories are. You can see the nails of the door through him.'),
      N('He is wound round and round with chain: the mill’s drive chain, black and heavy, dragging on the boards behind him.'),
      C('…Father.', 'shock'),
      N('Aldous Vale looks at his son. Then at the clock, out of habit, as if checking the shift.'),
      C('That’s the drive chain. From the wheel. Why are you—', 'think'),
      AL('I wear the chain I forged in life. I made it link by link, and yard by yard.'),
      AL('Three will come, boy. One a night. Sit up for them.'),
      AL('Don’t count the hours. I counted the hours.', 'soft'),
      N('He looks at you in the second chair, as if making sure there is a witness. Then the chain draws him back through the door.'),
      ...CALLER_TAIL,
    ],
    choices: STAY_CHOICES,
  },
  // ---------------------------------------------------------------- Q5: Briar turns to you too (replaces s23-briar)
  {
    id: 's23-briar-collector',
    lines: [
      ...BRIAR_ARRIVES,
      BR('Gone. Yes. Up you get, Corvin Vale.', 'happy'),
      BR('And you. Partner.'),
      N('Her light lands on you, and for a moment you are at your own gate in early summer, with two hundred Shells in your hand.'),
      N('Then it moves on, and you aren’t.'),
      BR('Yours later. His first.', 'soft'),
      ...BRIAR_LEAVES,
    ],
  },
  // ---------------------------------------------------------------- Q6: the boy at the window, when s13Done (add-on)
  {
    id: 's23-window',
    lines: [
      N('Below the falls, before dawn, the river is loud. The old mill’s wheel is turning hard, and every window is dark but one.'),
      N('At that window, a boy of twelve is working: sacks, a ledger, a lamp turned down low to save oil.'),
      N('Down at the mill gate another lamp is burning on a post. A young man with a hook is trimming its wick, slowly, looking up at the window.'),
      C('Night shift. Output up a third.', 'think'),
      N('He says it the way you read off a total. Then he watches the lamp at the gate for a long time.'),
      C('Tobin. He always did that one last, so I’d have light till the end of the shift. I thought it was just his route.', 'soft'),
      C('I’d forgotten the lamp.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- Q8 without Thimble, when s13Done (replaces s23-cold-one)
  {
    id: 's23-cold-one-aldous',
    lines: [
      ...COLD_START,
      N('Young Corvin stands at the end of the row like a man checking a shelf. His hand is flat on his coat, over a pocket that isn’t empty yet.'),
      ...COLD_END,
    ],
  },
  // ---------------------------------------------------------------- Q10: Ember turns to you too (replaces s23-stove)
  {
    id: 's23-stove-collector',
    lines: [
      N('Ember’s kitchen, tonight, by the light of one lamp. The stove is lit and the kettle is on, and nobody is drinking anything.'),
      N('Ash lies by the stove, grey, facing the corner.'),
      N('Ember puts a bowl down beside her. Ash doesn’t turn, and Ember doesn’t wait to see if she will.'),
      EM('I hope he’s cold. Him, and his partner.', 'angry'),
      EM('Two hundred Shells. I hope it bought something warm.', 'angry'),
      N('Beside you, Corvin doesn’t look at you. You are grateful, and then ashamed of being grateful.'),
      N('Ember stares at the stove for a long time.'),
      EM('…No.', 'soft'),
      EM('I hope they’re cold exactly as long as it takes. Both of them.', 'soft'),
      N('She doesn’t say as long as what takes. She gets up and puts another log on, which wasn’t needed.'),
      C('That’s fair. For both of us.', 'think'),
    ],
  },
  // ---------------------------------------------------------------- Q10: Ash’s true name, when s6Done (replaces s23-ash)
  {
    id: 's23-ash-named',
    lines: [
      N('Ember puts two fingers to her mouth and whistles, very softly: low, high, and a little one at the end, like a question.'),
      N('Ash lifts her head.'),
      N('She doesn’t get up; she doesn’t need to. Ember goes and sits on the floor beside her, as if it were a chair.'),
      C('…What was that? The whistle.', 'think'),
      N('Hush doesn’t answer, and neither do you. It isn’t yours to tell.'),
    ],
  },
  // ---------------------------------------------------------------- Q12: the folded ear, when s8Reunited (replaces s23-root)
  {
    id: 's23-root-ear',
    lines: [
      ...ROOT_START,
      N('One of its ears folds over at the tip, as if it were listening to something very small.'),
      ...ROOT_END,
    ],
  },
  // ---------------------------------------------------------------- Q12: your sold Nubbin, Collector (replaces s23-cloak)
  {
    id: 's23-cloak-collector',
    lines: [
      N('Further in, between two roots, something grey stands very straight, in a row of one.'),
      N('It has a number on its side in neat white paint. It was yours, and it is waiting for someone to tell it that it may move.'),
      Y('That one was mine.'),
      C('Ask me after. I can’t do it cold.', 'sad'),
      ...CLOAK,
    ],
  },
  // ---------------------------------------------------------------- Q15: the figure is you, Collector (replaces s23-pass)
  {
    id: 's23-pass-collector',
    lines: [
      ...PASS_START,
      N('It wears Corvin’s coat, the good one gone thin. But it isn’t Corvin.'),
      N('It is you.'),
      ...PASS_HILL,
      N('There is no flower for you. Only a bare patch by the path, where the frost stays after everything else has thawed.'),
      ...PASS_PLEA,
      C('Say it for my partner, if you won’t say it for me.', 'sad'),
      N('Cinder looks at you, not at him. Then she holds out a paw to you.'),
      N('You take it. It is warm: the only warm thing in three nights.'),
      N('She doesn’t answer him. So he looks up at you instead.'),
    ],
    choices: ANSWER_CHOICES,
  },
  // ---------------------------------------------------------------- Q16: the Q4 payoff (replace s23-drip)
  {
    id: 's23-drip-home',
    lines: [
      ...DRIP_START,
      C('You went home, when I asked. Nobody does what I ask any more. It was refreshing.', 'think'),
      C('Nights two and three, I left the door unlatched. I have latched that door every night for twenty-two years.'),
      C('Don’t read into it.'),
      N('You don’t say anything. You do read into it.'),
    ],
  },
  {
    id: 's23-drip-insist',
    lines: [
      ...DRIP_START,
      C('You stayed. I told you to go, and you said no, exactly like her. It was unbearable.', 'think'),
      C('Every night I made two cups of tea. Yours and mine. I never drank mine.'),
      C('I don’t know why I made it. I think I wanted there to be two.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- Q16: the warning, Collector (add-on)
  {
    id: 's23-partner',
    lines: [
      C('What she showed you on the pass. The coat.', 'think'),
      C('I won’t say this as your partner. I haven’t got a partner. I’m saying it as the man whose coat that was.'),
      C('Don’t let it be you.', 'soft'),
      N('He doesn’t say what “it” is; he doesn’t need to. Your hand has gone to your coat, over a pocket with nothing in it.'),
    ],
  },
  // ---------------------------------------------------------------- Q16: his reply, by your Q15 answer (replace s23-complete)
  {
    id: 's23-complete-keep-on',
    lines: [
      ...VOW,
      C('You said “only if you keep on.” So I will. I know how to keep on. It’s the one thing I was ever good at.', 'think'),
      C('I’ll just keep on in the other direction.', 'soft'),
      ...VIGIL_ASK,
    ],
  },
  {
    id: 's23-complete-sat',
    lines: [
      ...VOW,
      C('You didn’t answer, on the hill. You sat down in the snow and stayed there.', 'think'),
      C('I’ve been trying to work out what that was. I think it was the answer.', 'soft'),
      ...VIGIL_ASK,
    ],
  },
  // ---------------------------------------------------------------- Aldous’s letter, when millLetter = kept (add-ons)
  {
    id: 's23-coat-letter',
    lines: [
      N('Before you go, you take Aldous Vale’s letter out of the tin box under your bed, and put it inside your coat.'),
      N('In case, you think. You don’t ask yourself in case of what.'),
      N('You won’t take it out, not yet. Cold hands can’t hold a thing like that.'),
    ],
  },
  {
    id: 's23-letter-back',
    lines: [
      N('At home you take Aldous’s letter out of your coat, and put it back in the tin box beside Hazel’s.'),
      N('Not yet. But the railings were dripping.'),
    ],
  },
  // ---------------------------------------------------------------- Tier 2: Ember’s talk pool from chapter 11, when s23Done
  {
    id: 's23-ember-soup',
    lines: [
      EM('Somebody took soup up the valley. Fern’s missing a pan. I’m not saying anything.', 'think'),
      EM('I’m saying I noticed.'),
    ],
  },

  // ---------------------------------------------------------------- chapter 10: the vigil lane line (visitors)
  {
    id: 'c10-vigil-corvin',
    lines: [
      N('Out past the gate, in the lane, there is a lantern nobody here lit.'),
      N('A man is holding it. He stands well back, the way you stand back from a door you haven’t knocked on.'),
      N('He doesn’t try the latch. Nobody goes out to him, and nobody tells him to go.'),
      N('Each time the cold comes, his flame lies down flat with all the others. Each time, it stands up again with them.'),
    ],
  },
  // ---------------------------------------------------------------- chapter 10: after c10-dawn (visitors, stone unmade)
  {
    id: 'c10-dawn-lane',
    lines: [
      N('Out in the lane, by your gatepost, a lantern stands on the road, burnt down to nothing.'),
      N('Beside it is a patch of bare road in the shape of a man sitting. The frost went from there first, hours before anywhere else.'),
      CL('Round about the turn of the night he sat down in the road and made a noise I’ve never heard a man make.', 'soft'),
      CL('He stayed till first light. Then he went home.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- chapter 10: after c10-kept (visitors, stone kept)
  {
    id: 'c10-kept-lane',
    lines: [
      N('He is still out there in the lane, with his lantern burnt down to the stub. He has stood there all night.'),
      N('Corvin looks at your face. Then at your hand, resting on your coat, over the pocket.'),
      N('He looks at it for a long time. Then he turns and walks away down the lane, and doesn’t look back.'),
    ],
  },
  // ---------------------------------------------------------------- epilogue (after end-epi-gate-*, before end-epi-mill-*)
  {
    id: 'end-epi-visitors',
    lines: [EPI_CHAIRS, EPI_KEEPS],
  },
  {
    id: 'end-epi-visitors-cinder',
    lines: [EPI_CHAIRS, EPI_KEEPS, N('On the third night he carries one chair up the hill, and sits with the red flower.')],
  },
  {
    id: 'end-epi-visitors-kept',
    lines: [EPI_CHAIRS, N('He leaves the door unlatched, in case you come.'), N('You don’t.')],
  },
];

/** Every flag S23 sets. (Reads are listed in the header: corvin, soldNubbin, boughtBack, s13Done, millLetter,
 *  s6Done, s8Reunited, keptStone, cinder; the hooks also read visitors.) */
export const SIDE_STORY_S23_FLAGS: string[] = [
  'visitors', // true, on completion (approved Grove flag)
  's23Done', // true, on completion
  's23-stay', // step | home | insist (s23-caller / s23-caller-aldous); picks s23-drip*
  's23-answer', // maybe | keep-on | sat (s23-pass / s23-pass-collector); picks s23-complete*
];

export const SIDE_STORY_S23_CHECKS: string[] = [
  'visit:s23-cottage:dusk',
  'sit:s23-second-chair:midnight',
  'wait:s23-first-night:one-oclock',
  'walk:s23-briar:what-was',
  'watch:s23-lantern-night:reel',
  'watch:s23-winter:gate',
  'walk:s23-hush:what-is',
  'watch:s23-ember:stove',
  'watch:s23-lantern-shed:guessing-game',
  'walk:s23-hush:hollow',
  'watch:s23-cinder:later-spring',
  'walk:s23-cinder:lane',
  'watch:s23-cinder:high-pass',
  'talk:corvin:s23-railings',
];
