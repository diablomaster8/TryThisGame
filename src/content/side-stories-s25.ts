/**
 * Grove side story S25, "Real" (Part M outline, S25; Tier 2, does not change the campaign).
 *
 *   S25 Real    chapter 3 (after c3-open) → chapter 8 (after c8-nova); closes when chapter 9 opens.
 *               Spring coda after the campaign.
 *
 * SOURCE AND RIGHTS. After *The Velveteen Rabbit, or How Toys Become Real* by Margery Williams
 * (1922). Public domain: Williams died in 1944, so the text is out of copyright in the UK and the
 * USA. William Nicholson’s illustrations are not used, described or imitated.
 *
 * AUDIENCE. 'all' (the main game and the Learning Grove). Every lifted line has a childLines
 * replacement, written new.
 *
 * FRAME. Hazel knitted you a toy Nubbin when you were three; it has waited in the cottage loft
 * ever since, with the picture book she read you. Your Nubbin loves it the way the Boy loved the
 * Rabbit. The toy is the hero. You are the helper who finds it, gives it away and decides what
 * happens to it. Moss plays the Skin Horse, and quotes the book’s horse because Hazel read it
 * aloud under his window ledge one wet August. Nothing ever dies in this story.
 *
 * MOSS AND CHAPTER 4. Moss first speaks in c4-open. Steps 1–2 can play in chapter 3, so in them he
 * is only “the little grey one” on the hill, never named and never speaking. From step 3 on
 * (which waits for c4-open) he speaks, but only you can hear him: Clank, Byte, Fern and Clover
 * never hear him, and you pass his words on, as in the campaign.
 *
 * GROVE FLAGS READ, AND WHAT CHANGES (all by variant scene; see the quest notes):
 *   - c4-open seen: step 2’s done plays s25-sill-late (Moss named) instead of s25-sill.
 *   - Sable trust 20 or more, and Sable in the Grove: step 4 opens with Sable lying down within a
 *     tail’s length of the toy (s25-storm). Otherwise s25-storm-nosable. Read only.
 *   - s21Done: Clank asks whether a made thing can become Real (s25-clank, s25-page). Without it,
 *     Byte asks whether Real is measurable (s25-byte, s25-page-byte).
 *   - a13-clank-word (the Atlas save; A13’s “Clank’s word” scene has played): Clank says he has
 *     already found his word (s25-page-found replaces s25-page). Read only; see SIM.
 *   - s25-toy (this story’s own choice): steps 11–13, the spring coda and the idle lines.
 *   - s25-name (this story’s own choice): the spring coda (six variants, name × fate).
 *
 * FLAGS WRITTEN. s25Done (on completion), and local choice flags s25-name (button | bobble |
 * mister), s25-ask (hurt | when | sit, flavour only) and s25-toy (gone | kept). Nothing else.
 * No affection for Moss, no trust for Sable, no evolution, rebirth or alignment rule changes.
 * S25 is a hint toward `eternalRaised`, never a shortcut to it.
 *
 * LIFTED TEXT. *The Velveteen Rabbit*, 1922 text, Project Gutenberg eBook #11757; the eight
 * passages the outline marks as rechecked against #11757 on 2026-10-14, verbatim except where
 * marked. Moss speaks the Skin Horse’s lines without the “said the Skin Horse” tags.
 *   1. s25-real    Moss: “Real isn’t how you are made… It’s a thing that happens to you.”
 *   2. s25-real    Moss: “When someone loves you for a long, long time…” (adapted, as the outline
 *                  marks: “a child” becomes “someone”).
 *   3. s25-hurt    Moss: “Sometimes. When you are Real you don’t mind being hurt.”
 *   4. s25-hurt    Moss: “It doesn’t happen all at once… You become. It takes a long time.”
 *   5. s25-hurt    Moss: “That’s why it doesn’t happen often to people who break easily…”
 *   6. s25-page and s25-page-found   You read the book aloud: “…and he knew that they were only
 *                  toys, and would never turn into anything else.”
 *   7. s25-fern    You: “He isn’t a toy. He’s REAL!”
 *   8. s25-shabby  Moss: “…when you are Real shabbiness doesn’t matter.”
 * The book is never named on screen; it is “Hazel’s book”, “the book with the rabbit on it”.
 *
 * CARE NOTES.
 *   - The book’s scarlet fever and bonfire are gone. Step 10 is a summer chill, and Clover says it
 *     is only a chill in her first line. Full recovery by morning. The toy goes out with the rags
 *     for the rag cart, never into a fire.
 *   - Step 10 comes straight after Fossil’s farewell (c6-close), so it is brief and light.
 *   - Nothing dies. The let-go branch is a small light going into the long grass; the kept branch
 *     is a toy on a bed. Neither is the sad one.
 *   - Nubbins and wild Nubbins never speak; Moss reads the wild ones’ manner, not their words.
 *     Sable never speaks. Your Nubbin squeaks.
 *   - Clank is he/him, Pixel she/her, Byte he/him, Sable she/her, Moss he/him.
 *
 * Timing convention (as in the other side-story files): a step’s `scene` plays the moment the
 * previous step’s `check` is met (straight after the previous `done`); its `done` scene plays when
 * its own `check` is met. The exceptions (steps 3, 10 and 13 wait for a chapter point) are in the
 * quest notes.
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
const M = say('moss');
const FE = say('fern');
const SP = say('sparks');
const PX = say('pixel');
const CL = say('clover');
const BY = say('byte');

// ---------------------------------------------------------------- speakers declared here
/** The same Clank as S21 (side-stories-new-4.ts); shared id. */
const CLANK: Speaker = {
  id: 'clank',
  name: 'Clank',
  kind: 'other',
  basedOn: 'Claptrap, the CL4P-TP unit (Borderlands), reference only',
};
const CK = say('clank');

// ================================================================== shared pieces
/** Step 4, after the Sable beat (or the no-Sable beat): the storm. */
const STORM: Line[] = [
  N('Then, at the end of a hot week, a storm. It comes over the hill at bedtime all at once, like a dropped tray.'),
  N('Your Nubbin won’t settle. It goes from the basket to the hearth to the door and back, ears flat at every bang.'),
  N('You look for the old sock it likes, and can’t find it. You warm a stone at the hearth, and it pushes the stone away.'),
  N('Thunder, right overhead. The window seat lights up white, and the knitted toy on its sill with it.'),
];

/** Step 8: the wet afternoon that opens both the Clank and the Byte versions. */
const WET_AFTERNOON: Line[] = [
  N('A wet afternoon. Moss is on the window ledge again; he says the hill is too damp for his knees.'),
  N('You were not aware he had knees. You decide not to raise it.'),
];

/** Step 8: the page about the clockwork toys, read aloud (lifted text 6). */
const READ_THE_PAGE: Line[] = [
  N('There is a page about the clockwork toys in the nursery, and an old horse who has watched them come and go. You read it to him.'),
  Y('“…and he knew that they were only toys, and would never turn into anything else.”'),
];

/** Step 13: what you tell Moss, in both versions. */
const WELLSPRING: Line[] = [
  Y('There’s a pool behind the falls. Warm. Steaming a bit. Lit from underneath, by nothing.'),
  M('The Wellspring. Yes.', 'soft'),
  M('The first ones came up out of the warm water as small lights. Nobody ever told me where the lights came from.', 'think'),
];

/** The spring coda, one per remembered name and fate (built below). */
type ToyName = 'button' | 'bobble' | 'mister';
const NAMES: Record<ToyName, { said: string; stitched: string }> = {
  button: { said: 'Button?', stitched: 'BUTTON' },
  bobble: { said: 'Bobble?', stitched: 'BOBBLE' },
  mister: { said: 'Mister?', stitched: 'MISTER' },
};

const codaWild = (name: ToyName): Scene => ({
  id: `s25-coda-wild-${name}`,
  lines: [
    N('Spring. The flowers on the hill are open, and the long grass at the edge of the Grove is new and green and full of wild ones.'),
    N('One of them is sitting right at the edge, where the mown grass stops. You haven’t seen it before.'),
    N('Its coat is grey-brown and soft and faintly lumpy, like something knitted by somebody who dropped a stitch every night.'),
    N('The tuft on top of its head is a little crooked. One of its eyes catches the light like a button.'),
    Y(NAMES[name].said, 'soft'),
    N('It turns its head.'),
    N('It doesn’t come in, and it doesn’t run either. It looks at you the way you look at someone you’re nearly sure you know.'),
    N('Then it hops, twice, high and neat, as if to show you that it can.'),
    N('It goes back into the long grass. In the mornings, after that, it is often at the edge.'),
  ],
});

const codaCoat = (name: ToyName): Scene => ({
  id: `s25-coda-coat-${name}`,
  lines: [
    N('Spring. Fern and Clover come up the lane together with a parcel, which is suspicious, because they never agree about wrapping.'),
    FE('We couldn’t decide whose idea it was. So it was both of ours, and any mistakes are Clover’s.', 'happy'),
    CL('There aren’t any mistakes. There are three, and they’re on purpose.'),
    N('Inside is a knitted coat, Nubbin-sized, in grey-brown wool, with a crooked bobble on the hood. It has one brown button.'),
    N('It’s the toy’s own pattern. Clover counted the stitches off him while he was drying on the line.'),
    FE('Inside the collar. Look.'),
    N(`Stitched inside the collar, in Fern’s wobbly red cross-stitch: ${NAMES[name].stitched}.`),
    N('Your Nubbin puts it on, and goes and sits on its bed beside the toy, so that everybody can see they match.'),
    CL('Matching. Oh, I could cry. I am crying. Don’t look.', 'soft'),
  ],
});

// ================================================================== the quest
export const SIDE_STORY_S25: Quest[] = [
  {
    id: 's25',
    code: 'S25',
    title: 'Real',
    source:
      'The Velveteen Rabbit, or How Toys Become Real (Margery Williams, 1922; public domain; Project Gutenberg #11757): the toy, the Boy, the Skin Horse and the nursery magic, retold in the valley',
    audience: 'all',
    trigger: {
      where: 'Hazel’s cottage: the loft, the window seat, the lawn and the long grass, and the shed',
      when: 'From chapter 3 (after c3-open) to chapter 8. Step 3 waits for c4-open, step 10 for c6-close, step 13 for c8-nova. Closes when chapter 9 opens.',
    },
    speakers: [CLANK],
    steps: [
      // ------------------------------------------------ 1. The Loft, and A Name (outline Q1–Q2)
      {
        id: 's25-step1',
        goal: 'Open the parcel in Hazel’s hand under the loft eaves.',
        hint: 'It’s on the trunk under the little window. Pull the right end of the string; there is only one right end.',
        check: 'inspect:s25-parcel',
        scene: {
          id: 's25-loft',
          lines: [
            N('Early-summer rain, steady and warm. The loft lamp has died, and Sparks says it’s the small, fiddly kind of broken.'),
            N('Small and fiddly is Pixel’s department. Pixel is coming after lunch.'),
            N('You go up the ladder first, to clear a space, and because you were never once allowed up there.'),
            N('The loft smells of apples, dust and mothballs. Rain ticks on the slates a hand’s breadth above your head.'),
            N('Hazel’s things are up here, in the order of someone who knew exactly where everything was and told nobody.'),
            N('Seed trays, a broken umbrella labelled STILL GOOD, and forty years of Lantern Night programmes tied up with string.'),
            N('Your Nubbin climbs up behind you, sneezes at the dust, and sets off to investigate a hatbox.'),
            N('Under the eaves, on a trunk, is a parcel in brown paper, soft and gone pale where the sun from the little window has reached it for years.'),
            N('On the front, in her hand: “For when they come back. (They’ll have grown. It won’t mind.)”'),
            N('The writing doesn’t lean. She wrote this a long time ago, before her words began to walk uphill.'),
            N('The string is tied in her bow: the one that falls open if you pull the right end, and never if you pull the wrong one.'),
          ],
        },
        done: {
          id: 's25-name',
          lines: [
            N('Inside, in tissue: a knitted Nubbin, lumpy, in grey-brown wool. The bobble on top is a little crooked.'),
            N('One button eye is sewn on tight. The other hangs on a long loose thread, as if it were looking at something far off.'),
            N('Under it is a thin book with a rabbit on the cover, its spine mended twice with brown tape.'),
            N('You remember, though not all at once. The smell comes first, wool and peppermint, then her kitchen, and being three, and holding it by the bobble.'),
            N('She made it for you, and you took it everywhere for one summer. Then you went home and grew, and it stayed.'),
            N('You called it something. You’re nearly sure you did.'),
          ],
          choices: [
            {
              id: 'button',
              label: '“Button.” For the eye.',
              set: { 's25-name': 'button' },
              then: [
                N('Button. You said it all that summer, mostly to the eye that was loose.'),
                N('Your Nubbin looks at the toy’s loose eye, then checks its own two.'),
              ],
            },
            {
              id: 'bobble',
              label: '“Bobble.” For the bobble.',
              set: { 's25-name': 'bobble' },
              then: [
                N(
                  'Bobble. You carried it by the bobble everywhere, which is why the bobble is crooked.',
                ),
                N(
                  'Your Nubbin looks at the bobble, then pats the top of its own head, doubtfully.',
                ),
              ],
            },
            {
              id: 'mister',
              label: '“Mister.” Just Mister.',
              set: { 's25-name': 'mister' },
              then: [
                N(
                  'Mister. Hazel called the postman Mister, and at three you thought it was the most respectful word there was.',
                ),
                N('Your Nubbin stands up straighter, in case it is being inspected.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 2. The Shelf (outline Q3)
      {
        id: 's25-step2',
        goal: 'Help Pixel get the loft lamp working.',
        hint: 'Hold the lamp steady while Pixel winds. Pass her the small cog, not the shiny one; the shiny one is hers.',
        check: 'craft:s25-loft-lamp',
        scene: {
          id: 's25-lamp',
          lines: [
            N('After lunch Pixel comes up the ladder with a toolbox in her teeth and a biscuit tin under each arm.'),
            PX('Afternoon. Don’t touch the tins. Nothing in them is dangerous. Some of it is just enthusiastic.'),
            PX('The lamp’s fine. It’s the winder. It’s lost the will to wind. I’ve brought it some friends.', 'think'),
            N('Out of the tins come her bits: a clockwork moth, a brass fan the size of a thumbnail, a cog that turns itself when it’s warm.'),
            N('Sparks and Fern come up the ladder too, because three people in a loft is an event.'),
            SP('Ooh. Does any of it explode?', 'happy'),
            PX('Not on purpose.'),
            N('The moth whirrs up off Pixel’s palm, flies one wobbly circle round the rafters, and lands on Fern’s head.'),
            FE('Oh. Oh, it’s beautiful. I can’t keep a moth alive and you’ve gone and made one.', 'happy'),
            N('Your Nubbin chases the flashes off the brass fan across the floorboards, squeaking at every one.'),
            N('On the trunk, where you put it down to make room, the knitted toy watches all of it with its one good eye.'),
          ],
        },
        done: {
          id: 's25-sill',
          lines: [
            N('The lamp comes on: a warm ring of light, and a small, satisfied tick every second, like something counting sheep.'),
            N('Everyone goes down the ladder talking about the moth. You go last, with the toy and the book, and set them on the window seat for now.'),
            N('For now turns into a week, and then a fortnight. The toy sits on the sill and gets the afternoon sun.'),
            N('Nobody looks at it. You don’t either, though you mean to.'),
            N('Out of the window, on top of the western hill, the little grey one is looking this way.'),
          ],
        },
      },
      // ------------------------------------------------ 3. What Is Real? and Does It Hurt? (outline Q4–Q5)
      {
        id: 's25-step3',
        goal: 'Stay on the window seat until Moss has finished.',
        hint: 'Don’t get up, and don’t tap anything else. He’s slow, and he’s nearly done.',
        check: 'sit:s25-window-seat:moss',
        scene: {
          id: 's25-real',
          lines: [
            N('One morning the top of the western hill is empty.'),
            N('Moss is on the outside ledge of the window seat, in the sun, by the open window. The toy is on the inside sill.'),
            N('It is a long way down from the hill for him. He must have set out before it was light.'),
            M('Don’t mention it. I’m not here.'),
            N('You sit on the window seat, because that is the rule, and you wait. A bee comes in, considers them both, and leaves.'),
            M('She knitted that in a week, with her feet on the fender. She dropped a stitch every night and said words I won’t repeat.', 'happy'),
            M('You were three. You carried it by the bobble and you wouldn’t let anyone else hold it. Not even her.', 'soft'),
            M('She read you that book on this seat, every night of one wet August. I sat on this ledge. I heard every word.'),
            M('The horse in it talks a great deal of sense, for a horse.'),
            N('He turns, not to you, but to the toy.'),
            M('Real isn’t how you are made. It’s a thing that happens to you.', 'soft'),
            M('When someone loves you for a long, long time, not just to play with, but REALLY loves you, then you become Real.', 'soft'),
            N('The toy, being knitted, takes this well.'),
          ],
          choices: [
            {
              id: 'hurt',
              label: 'Ask him: does it hurt?',
              set: { 's25-ask': 'hurt' },
              then: [Y('Does it hurt?'), N('Moss doesn’t answer you. He answers the toy.')],
            },
            {
              id: 'when',
              label: 'Ask him: does it happen all at once?',
              set: { 's25-ask': 'when' },
              then: [Y('Does it happen all at once?'), N('Moss doesn’t answer you. He answers the toy.')],
            },
            {
              id: 'sit',
              label: 'Say nothing. Sit with them both.',
              set: { 's25-ask': 'sit' },
              then: [N('You say nothing. After a while Moss nods, very slightly, and goes on as if somebody had asked.')],
            },
          ],
        },
        done: {
          id: 's25-hurt',
          lines: [
            M('Sometimes. When you are Real you don’t mind being hurt.', 'soft'),
            M('It doesn’t happen all at once. You become. It takes a long time.'),
            M('That’s why it doesn’t happen often to people who break easily, or have sharp edges, or who have to be carefully kept.', 'think'),
            N('Then he climbs down off the ledge, one careful foot at a time, and sets off back to the hill. It will take him until supper.'),
            M('He has a good face, your toy. Don’t let him be carefully kept.'),
          ],
        },
      },
      // ------------------------------------------------ 4. The Night It Couldn't Sleep (outline Q5 end, Q6)
      {
        id: 's25-step4',
        goal: 'Give your Nubbin something to hold.',
        hint: 'Take the knitted toy off the window seat and put it in the basket.',
        check: 'give:s25-toy:nubbin',
        scene: {
          id: 's25-storm',
          lines: [
            N('Later that week, Sable comes past the window seat on her way to nowhere in particular.'),
            N('She stops. She looks up at the toy on the sill for a long time, with her ears flat.'),
            N('Sharp edges, Moss said. She has them.'),
            N('Then she lies down on the path under the window, a tail’s length from it, and goes to sleep. She doesn’t take it.'),
            N('In the morning there is frost on the path where she lay, and none at all on the toy.'),
            ...STORM,
          ],
        },
        done: {
          id: 's25-sleeps',
          lines: [
            N('You put the toy in the basket. Your Nubbin looks at it, then climbs in and curls all the way round it, nose to tail.'),
            N('Thunder. It doesn’t even twitch.'),
            N('In the morning it is still curled round the toy, which is damp at one ear where it was held all night.'),
            N('From then on, the toy is your Nubbin’s.'),
          ],
        },
      },
      // ------------------------------------------------ 5. Everywhere (outline Q7)
      {
        id: 's25-step5',
        goal: 'Find the toy before it gets too dark. Your Nubbin won’t sleep without it.',
        hint: 'Take a lantern. Your Nubbin had it on the lawn by the pond after supper, so start there.',
        check: 'find:s25-toy:lawn',
        scene: {
          id: 's25-everywhere',
          lines: [
            N('From then on the toy goes everywhere. It is carried by one ear, or the bobble, or not at all when it’s been dropped.'),
            N('It goes to the pond, and comes back wet to the knees, if a toy has knees.'),
            N('It goes to Sparks’s picnic and comes home with jam on it, like everybody else.'),
            N('It has its bath when your Nubbin has its bath. It has views about cats, according to your Nubbin.'),
            N('Then one dusk, at bedtime, the basket has your Nubbin in it, standing up, and nothing else.'),
            N('It looks at you, and at the door. It does not lie down.'),
            N('The toy is out in the Grove somewhere. It’s getting dark, and the dew is coming down.'),
          ],
        },
        done: {
          id: 's25-lantern',
          lines: [
            N('You find it face down in the grass by the pond, soaked with dew, its loose eye trailing.'),
            N('Your Nubbin is still standing up in the basket when you get back, as if it never once doubted you.'),
            N('It takes the toy in both arms, lies down, and is asleep before you’ve blown out the lantern.'),
          ],
        },
      },
      // ------------------------------------------------ 6. Not a Toy (outline Q8)
      {
        id: 's25-step6',
        goal: 'Go back to Fern’s for tea, with the toy, so she can apologise properly.',
        hint: 'Let your Nubbin carry him in. It will insist.',
        check: 'visit:fern:s25-apology',
        scene: {
          id: 's25-fern',
          lines: [
            N('You take your Nubbin round to Fern’s for tea, and the toy comes too. The toy always comes too.'),
            N('Your Nubbin climbs onto Fern’s good chair and sets the toy upright beside it, as if it were company.'),
            FE('Oh, not on the cushion, love. It’s only a toy. It can go on the floor with the shoes.'),
            N('She reaches for it. Your Nubbin makes a sound you have never heard it make: a squeak so fierce the cups rattle.'),
            N('Fern takes her hand back. Your Nubbin stands in front of the toy, very small and very large, and looks at you.'),
            Y('He isn’t a toy. He’s REAL!'),
            N('There is a short silence. In it, Fern looks at the toy properly for the first time.'),
            FE('…Right. Yes. I see. Then I owe him an apology. Possibly several.', 'think'),
            FE('And I’m going to do it properly, because Hazel would have, and because your Nubbin is looking at me like that.'),
            FE('Come round for tea, and bring him. I’m getting the good cups out.'),
          ],
        },
        done: {
          id: 's25-apology',
          lines: [
            N('Fern has the good cups out, a cushion on the good chair, and a very small cup on the cushion.'),
            FE('Sir. I said you were only a toy. That was wrong, and rude, and in front of your friend. I apologise unreservedly.'),
            FE('I am, as everybody knows, only a neighbour. You are clearly a great deal more than that.'),
            N('Your Nubbin considers this. Then it sets him on the cushion, and accepts a biscuit on his behalf.'),
            FE('Hazel made me do this once. With a cat. I was in the wrong that time too.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 7. The Wild Ones (outline Q9)
      {
        id: 's25-step7',
        goal: 'Let the wild Nubbins have a look at the toy.',
        hint: 'Stand back by Moss and keep still. Wild ones won’t come near a Keeper who’s moving.',
        check: 'watch:s25-wild-nubbins:long-grass',
        scene: {
          id: 's25-grass',
          lines: [
            N('A hot, still afternoon. Your Nubbin carries the toy down to the edge of the long grass, where the wild ones live, to show him off.'),
            N('Moss has come as far as the flat stone at the foot of the hill. He looks as though he’s been there for a century.'),
            M('I have not. I came down this morning. It only feels like a century, at my speed.'),
            N('Your Nubbin sets the toy down in the grass, upright, facing outwards, and steps back.'),
            M('Go on, then. Let them look. They’ll be rude. They’re young.'),
            N('The grass moves, here and there, with no wind in it.'),
          ],
        },
        done: {
          id: 's25-wild',
          lines: [
            N('Three wild Nubbins come out of the grass. They sniff the toy, bounce away, come back, and sniff him again.'),
            M('That one says he can’t hop. That one says he smells of indoors.', 'think'),
            M('That one wants to know what he’s for. It doesn’t mean it unkindly. It really wants to know.'),
            N('They lose interest all at once, the way young ones do, and are gone. Your Nubbin picks the toy up and holds him tighter.'),
            M('They think Real is hopping. I thought so too, at their age. I gave up hopping a long time ago.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 8. Clank Asks (outline Q10; Byte without S21)
      {
        id: 's25-step8',
        goal: 'Find the right page in Hazel’s book.',
        hint: 'The book is on the window seat. The page you want has the old horse on it.',
        check: 'find:s25-book:page',
        scene: {
          id: 's25-clank',
          lines: [
            ...WET_AFTERNOON,
            N('Something squeaks up the path, whistling, and stops under the window. It’s Clank, with a watering can, in the rain.'),
            CK('Announcement: I am watering the rain! It is going very well!', 'happy'),
            CK('Announcement: what is THAT? On the sill. Is it a Nubbin? Is it a new best friend?', 'happy'),
            Y('It’s a toy. Hazel knitted him. He’s a toy, mostly. It’s complicated.'),
            CK('Knitted. Somebody made him. Like Pixel made me.', 'think'),
            N('Clank rolls closer, until his chimney nearly touches the glass. His whistle goes very quiet.'),
            CK('Is there a book? There’s a book. Is there a me in it?', 'soft'),
          ],
        },
        done: {
          id: 's25-page',
          lines: [
            ...READ_THE_PAGE,
            N('Clank’s whistle drops, all the way down, like a kettle taken off the heat.'),
            M('The horse was wrong about that. I’m older than the horse.'),
            N('You pass it on, word for word. Clank’s chimney-light comes up one notch.'),
            CK('Is Real the word? The one I couldn’t find?', 'soft'),
            M('No. It lives next door to it. Keep looking.'),
            N('You pass that on too. Clank thinks about it for so long that the rain stops.'),
            CK('Next door. Announcement: I am going to look next door.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 9. Loved Shabby (outline Q11)
      {
        id: 's25-step9',
        goal: 'Hold the toy steady while Clover darns his elbow.',
        hint: 'Your Nubbin won’t let go of him, so hold them both. Clover is quick; it only feels slow.',
        check: 'craft:s25-darn',
        scene: {
          id: 's25-shabby',
          lines: [
            N('High summer goes by, carried by one ear. The toy goes grey at the seams, and his bobble is loved clean off.'),
            N('Clover comes by with a basket of wool, sees him, and puts her hand over her mouth.'),
            CL('Oh, look at him. Look at his poor seams. He’s gone right through at the elbow, if that’s an elbow.', 'sad'),
            CL('I could knit you a new one. Same pattern. I’ve got wool in the exact grey. I keep it for… well. I keep it.'),
            N('Your Nubbin looks at the new wool. Then it sits down on the old toy, firmly, and looks at nothing.'),
            N('Up on the window ledge, Moss makes a small dry sound that might be a laugh.'),
            M('…when you are Real shabbiness doesn’t matter.', 'soft'),
            N('Clover can’t hear him, and doesn’t need to. She looks at your Nubbin sitting on its toy, and puts the wool away.'),
            CL('No. You’re right. Nobody’s getting a new one.', 'soft'),
            CL('But I’ll mend his elbow, if he’ll let me. In grey. So he doesn’t feel he has to match.'),
          ],
        },
        done: {
          id: 's25-darned',
          lines: [
            N('Clover darns his elbow in grey, in small neat stitches, with your Nubbin watching every one.'),
            N('She knots it, bites the thread, and gives him back. Your Nubbin checks the elbow all over, and decides to allow it.'),
            CL('There. Mended isn’t the same as new. It’s better. Hazel told me that over a teacup. I didn’t believe her either.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 10. The Chill (outline Q12; after c6-close)
      {
        id: 's25-step10',
        goal: 'Sit up with your Nubbin through the night.',
        hint: 'Stay by the basket, and give it water when it wakes. Clover will look in.',
        check: 'sit:s25-basket:night',
        scene: {
          id: 's25-chill',
          lines: [
            N('A few days after the rain on the hill, your Nubbin sneezes at breakfast. Then again.'),
            N('It is warm to the touch and droopy, and it doesn’t want its plum.'),
            N('You have your boots on to fetch somebody before you know you’re doing it. Clover is already at the gate.'),
            CL('It’s a chill. Only a chill. I’m saying it first, so you don’t have to wonder.', 'soft'),
            CL('After a wet week they all get them. I’ve seen a hundred. Warm, quiet, water little and often, and somebody to sit up with it.'),
            CL('It’ll be right as rain by morning. Well. Right as the day after rain.', 'happy'),
            N('Your Nubbin climbs into its basket with the toy, curls round him, and shuts its eyes.'),
          ],
        },
        done: {
          id: 's25-better',
          lines: [
            N('Clover looks in at midnight with a cup of something, and again at two, and at four, passing by each time, she says.'),
            N('By morning your Nubbin is cool and hungry and cross about it. It eats two plums and half of yours.'),
            CL('Told you. Right as the day after rain.', 'happy'),
            CL('Now. Everything it slept on gets boiled. Hazel’s rule, and her mother’s, and frankly mine.'),
          ],
        },
      },
      // ------------------------------------------------ 11. The Bundle (outline Q13, the signature choice)
      {
        id: 's25-step11',
        goal: 'Carry the rag bundle out to the shed.',
        hint: 'The rag bundle goes by the shed door for the rag cart, whatever you decided about the toy.',
        check: 'carry:s25-bundle:shed',
        scene: {
          id: 's25-bundle',
          lines: [
            N('The copper in the wash-house is lit by ten. In go the blankets, the basket cushion, and the old sock, which turns up at last.'),
            N('Then Clover holds her hand out for the toy, and stops.'),
            CL('Oh. Oh, no. Not him. Old wool in a hot copper comes out the size of a walnut. Felted solid. I did it to a jumper once.', 'sad'),
            CL('What we can’t boil goes out with the rags, by the shed. The rag cart takes it. That’s how Hazel always did it.'),
            CL('Or. Cold water, by hand, a whole evening, and you never wring him. He’d come out smaller. But he’d come out.', 'think'),
            N('Your Nubbin is better, and asleep in the sun on the step, with nothing in its arms for the first time since the storm.'),
            N('The toy is in your hands. He is grey at the seams, darned at one elbow, and his loose eye turns slowly on its thread.'),
          ],
          choices: [
            {
              id: 'gone',
              label: 'Let him go with the bundle.',
              set: { 's25-toy': 'gone' },
              then: [
                N('You put him on top of the rag bundle, the right way up, with his good eye to the sky.'),
                CL('That’s a kind way to do it. Hazel always put the soft things on top, too.', 'soft'),
              ],
            },
            {
              id: 'kept',
              label: 'Wash him yourself, by hand, in cold water.',
              set: { 's25-toy': 'kept' },
              then: [
                N('Clover fills the tin bath from the pump, sits on the step, and tells you what not to do, which is most things.'),
                CL('Squeeze. Don’t wring. Don’t rush him. You’ll want to rush him. Don’t.'),
              ],
            },
          ],
        },
        done: {
          id: 's25-shed',
          lines: [
            N('You carry the bundle out and set it by the shed door, the toy on top. The sun goes down behind the hill.'),
            N('Your Nubbin, asleep on the step, doesn’t wake. You don’t wake it.'),
          ],
        },
      },
      // ------------------------------------------------ 12. The Tear, or the Line (outline Q14)
      {
        id: 's25-step12',
        goal: 'See the night through, and go and look in the morning.',
        hint: 'Stay at the window seat until it’s light.',
        check: 'wait:s25-bundle:morning',
        scene: {
          id: 's25-dew',
          lines: [
            N('That night you can’t sleep. You sit on the window seat in the dark, where he used to sit, and look out at the shed.'),
            N('The dew comes down. The bundle by the shed door goes silver at the edges.'),
            N('A drop of it runs off his button eye, slowly, and falls into the wet grass.'),
            N('Where it lands, something small and pale lifts out of the grass: a light, no bigger than a thimble.'),
            N('It rises the way Moss says the first ones came up out of the spring: not quickly, as if it had been asked.'),
            N('It goes low across the lawn, past the pond, and into the long grass, and is gone among the wild ones.'),
            N('You don’t go out, and you don’t know why not. It seems like something you aren’t meant to follow.'),
          ],
        },
        done: {
          id: 's25-gap',
          lines: [
            N('In the morning there is a gap in the top of the rag bundle, the shape of a small lumpy Nubbin. Nothing else is disturbed.'),
            N('In the wet grass by the shed is a button on a long loose thread. You put it in your pocket.'),
            N('After breakfast your Nubbin goes to the edge of the long grass and sits there a while. Then it comes back and eats its plum.'),
            N('It doesn’t look sad. It looks like somebody who has just waved somebody off.'),
            N('Up on the hill, Moss is looking at the long grass. He doesn’t say anything all day.'),
          ],
        },
      },
      // ------------------------------------------------ 13. Twice Round (outline Q15; after c8-nova)
      {
        id: 's25-step13',
        goal: 'Tell Moss about the warm water behind the falls.',
        hint: 'Sit on the window seat beside his ledge. He’ll listen.',
        check: 'talk:moss:s25-wellspring',
        scene: {
          id: 's25-falls',
          lines: [
            N('You come home from the Hollow with the notebook inside your coat. It’s late, and the cottage smells of cold ashes.'),
            N('Moss is on the window ledge. He doesn’t ask about the notebook, and you don’t tell him yet.'),
            N('On the window seat, where the toy used to sit, there is a patch of faded cushion the shape of a small lumpy Nubbin.'),
            N('There is one thing you do want to tell him.'),
            N('You went along the ledge behind the falls today. You put your hand on the rock, and the rock was warm.'),
          ],
        },
        done: {
          id: 's25-twice',
          lines: [
            ...WELLSPRING,
            N('He looks out across the dark lawn, past the pond, to the long grass.'),
            M('I’ve a guess.', 'soft'),
            N('He doesn’t say what it is. You think you know where he’s looking.'),
          ],
        },
      },
    ],
    complete: {
      id: 's25-complete',
      lines: [
        N('He asks you to write it down, so you do: a new page in the journal, on the window seat, by the last of the lamplight.'),
        N('At the top, in capitals: HOW TOYS BECOME REAL.'),
        N('Underneath, what Moss said, as near as you can get it.'),
        M('Twice round, and loved the whole way, and settled in itself.', 'soft'),
        Y('What does that mean?'),
        M('It means what it says. I am old, and it is late, and the hill is a long way up.'),
        N('He climbs down off the ledge and sets off into the dark. It will take him until morning, and he says he likes it.'),
        N('The page says nothing more. You leave the next one blank, in case.'),
      ],
    },
    rewards: [
      {
        id: 's25-knitted-toy',
        kind: 'item',
        label: 'Hazel’s knitted toy',
        description:
          'A lumpy knitted Nubbin your Nubbin carries everywhere and sleeps curled round. Kept for good if you washed him by hand (s25-toy = kept).',
      },
      {
        id: 's25-velveteen',
        kind: 'cosmetic',
        label: 'Velveteen coat colour',
        description:
          'A rare soft grey-brown coat, faintly knitted-looking. In spring, either a Velveteen wild Nubbin sits at the edge of the long grass, or Fern and Clover knit the toy’s pattern into a coat for your Nubbin.',
      },
      {
        id: 's25-button-charm',
        kind: 'cosmetic',
        label: 'Button-eye charm',
        description:
          'One brown button on a thread, worn by your Nubbin: the toy’s loose eye, found in the grass by the shed, or Clover’s spare from her tin, so they match.',
      },
      {
        id: 's25-journal',
        kind: 'feature',
        label: '“How Toys Become Real” journal page',
        description: 'Moss’s words, in your hand. “Twice round, and loved the whole way, and settled in itself.” It says nothing more.',
      },
    ],
    sets: { s25Done: true },
    childLines: {
      // lifted text 1–2 (Moss as the Skin Horse)
      's25-real#10': 'Real isn’t in the stitches. It grows on you slowly, the way moss grows on a wall.',
      's25-real#11': 'Somebody has to love you for ages and ages, properly, and not just for games. That’s how it starts.',
      // lifted text 3–5
      's25-hurt#0': 'Sometimes it does. But once you’re Real, a little hurt doesn’t frighten you so much.',
      's25-hurt#1': 'It isn’t quick. It’s slow, like a tree getting tall. You hardly see it happening.',
      's25-hurt#2': 'It takes longer for anyone with sharp edges, or anyone kept up on a high shelf where nobody can hug them.',
      // lifted text 7 (you)
      's25-fern#5': 'He’s not just a toy! He’s Real, to us!',
      // lifted text 6 (you, reading the book aloud): both versions
      's25-page#1': '“…and the clockwork toys were sure they would stay clockwork for ever, and never be anything more.”',
      's25-page-found#1': '“…and the clockwork toys were sure they would stay clockwork for ever, and never be anything more.”',
      // lifted text 8 (Moss)
      's25-shabby#6': 'Once you’re Real, the worn-out bits stop mattering. They’re just where the love went.',
    },
    notes:
      'THEME. Real is not how you are made; it is what being loved for a long time does to you. It does not happen to ' +
      'things that have to be carefully kept (Moss, s25-hurt), which is the Grove’s “safe is not the same as well” in a ' +
      'nursery. The lore underneath is the Eternals: a Nubbin loved enough stops fading. S25 hints at that and nothing ' +
      'more. It never says the toy became a Nubbin, and it is never a route to eternalRaised. ' +
      'SIGNATURE CHOICES. (1) s25-name in step 1 (button | bobble | mister) pays off twelve steps later in the spring coda: ' +
      'the wild one turns its head at the name, or the name is cross-stitched inside the coat collar. (2) s25-toy in step 11 ' +
      '(gone | kept) decides step 11’s done, steps 12 and 13, the coda and the idle lines. Moss frames it in step 3 (“Don’t ' +
      'let him be carefully kept”) and answers it in step 12 (“It’s the better ending, mostly”). Neither branch is the sad ' +
      'one. RUNNING THREADS. The wild ones say he can’t hop (step 7); in the let-go coda the Velveteen wild one hops twice, ' +
      'to show you. The narration calls the toy “it” until you say “He isn’t a toy” at Fern’s (step 6), and “he” from then ' +
      'on. Clover darns in grey “so he doesn’t feel he has to match” (her c3-close blanket line), and in the kept coda the ' +
      'coat is knitted to match him. ' +
      'MOSS. Steps 1–2 can play in chapter 3, before Moss first speaks in c4-open, so there he is only “the little grey ' +
      'one” on the hill (s25-sill), never named and never speaking. If c4-open has already played when step 2’s done ' +
      'fires, play s25-sill-late (he is named, still silent). Step 3 waits for c4-open. Only you hear Moss: Clank, Byte, ' +
      'Fern and Clover never do, and you pass his words on. He walks to the cottage window ledge and back (slowly; the text ' +
      'says so). Give him no affection from this story beyond ordinary petting (his chapter 10 threshold is fixed). ' +
      'TIMING. Opens after c3-open (the loft lamp has died; step 1 starts the next time the player enters the cottage). ' +
      'Steps 1–2 from chapter 3. Step 3’s scene waits until c4-open has played, then plays the next morning the player ' +
      'is at the cottage. Steps 4–9 are summer, one per day or so, in order. Step 10’s scene waits until c6-close has ' +
      'played, then a few in-game days, so it never lands on the day of Fossil’s farewell. Steps 11–12 follow it directly ' +
      '(the next day and that night). Step 13’s scene waits until c8-nova has played (chapter 8’s walk home), then plays ' +
      'that night at the cottage. If chapter 9 opens with the story unfinished, it closes: no rewards, no coda, s25Done ' +
      'unset. The toy, if your Nubbin already has it, stays as scenery on its bed. ' +
      'YOUR NUBBIN. “Your Nubbin” is the Nubbin the toy is given to in step 4 (the youngest in the Grove at that moment, ' +
      'not Sable, not Moss). Store it as the toy’s holder. If it leaves the Grove before step 10, the holder becomes your ' +
      'next youngest; the text never names it. ' +
      'VARIANTS (all in SIDE_STORY_S25_VARIANTS). Step 2 done: s25-sill-late replaces s25-sill if c4-open has played. ' +
      'Step 4 scene: s25-storm-nosable replaces s25-storm if Sable’s trust is under 20 or Sable is not in the Grove (read ' +
      'only; this story never changes her trust). Step 8: with s21Done, s25-clank and its done s25-page play, and ' +
      's25-page-found replaces s25-page if a13-clank-word is true (Atlas save). Without s21Done, s25-byte replaces s25-clank ' +
      'and s25-page-byte replaces s25-page. If S21 is still open (started, not done) and chapter 6 hasn’t opened, hold ' +
      'step 8’s scene until S21 closes or chapter 6 opens, then read s21Done. Step 8 also waits until c4-close has played (Byte, who may come instead of Clank, is first met at Lantern Night). Step 11 done: s25-shed is for gone; ' +
      's25-shed-kept for kept. Step 12: s25-dew and s25-gap are for gone; s25-line and s25-line-dry replace them for kept. ' +
      'Step 13: s25-falls and s25-twice are for gone; s25-falls-kept and s25-twice-kept replace them for kept. ' +
      'SPRING CODA. In the first spring after the campaign’s ending (post-game, when the memorial flowers open), the first ' +
      'time the player is in the Grove by day, play s25-coda-wild-<s25-name> (gone) or s25-coda-coat-<s25-name> (kept). ' +
      'It plays whatever the ending, and Moss is not in it, so it works if he has faded. It needs s25Done. ' +
      'IDLE LINES (Tier 2). After s25Done, the first time the player taps Moss (while he is in the world) play ' +
      's25-moss-kept or s25-moss-gone, once. If s21Done and s25Done, the first time the player taps Clank play ' +
      's25-clank-next-door, once. ' +
      'CHECKS. inspect:s25-parcel (tap the parcel in the loft); craft:s25-loft-lamp (a hold-steady and pass-the-cog beat ' +
      'with Pixel); sit:s25-window-seat:moss (sit, no input, about 20 s); give:s25-toy:nubbin (carry the toy from the sill ' +
      'to the basket during the storm); find:s25-toy:lawn (a short lantern search at dusk; the toy is always by the pond); ' +
      'visit:fern:s25-apology (go to Fern’s with the toy); watch:s25-wild-nubbins:long-grass (stand still near Moss while ' +
      'three wild Nubbins approach); find:s25-book:page (turn the book’s pages to the horse); craft:s25-darn (hold steady ' +
      'while Clover darns); sit:s25-basket:night (sit by the basket; offer water twice; Clover looks in); ' +
      'carry:s25-bundle:shed (carry the rag bundle to the shed door); wait:s25-bundle:morning (stay at the window seat ' +
      'until dawn; in the kept branch the toy lies on a towel by the range); talk:moss:s25-wellspring (tap Moss on the ' +
      'ledge). No check can fail. ' +
      'STAGING. The window seat is downstairs in the front room, under a low window facing the lawn and the western hill; ' +
      'the toy sits on its inside sill, Moss on the outside ledge, with the window open between them. Storm (step 4): one ' +
      'scripted night of rain and thunder, cosmetic only. The chill (step 10) is narration only: no sim illness, no stat, ' +
      'mood, affection or lifespan change, no risk. The light in s25-dew is the same small pale light as the Wellspring ' +
      'art in c4-tale and c8-ledge, thimble-sized, rising slowly; play it with no music. ' +
      'REWARDS. The knitted toy becomes a carryable from step 4 (your Nubbin holds it; it sleeps curled round it); in the ' +
      'gone branch it leaves at s25-gap, in the kept branch it stays for good. The button-eye charm is given at s25-gap ' +
      '(the loose eye) or s25-line-dry (Clover’s spare). The journal page is given at s25-complete. The Velveteen coat ' +
      'colour arrives in the spring coda: a Velveteen wild Nubbin at the edge of the long grass (gone), or the knitted coat ' +
      'as a cosmetic for your Nubbin (kept). ' +
      'SIM: (1) A carryable toy item that a Nubbin holds and sleeps with (new item behaviour). (2) A new rare coat colour, ' +
      '“Velveteen”, available only through this story. (3) Gone branch: in the coda spring, spawn one wild Nubbin with the ' +
      'Velveteen coat that lingers at the edge of the long grass; it follows the ordinary stray rules and can be invited ' +
      'in like any stray. It is an ordinary child Nubbin: zero rebirths, no stat bonus, no Eternal flag, no special ' +
      'evolution. (4) Kept branch: a knitted Velveteen coat cosmetic for the toy’s holder. (5) Read a13-clank-word from the ' +
      'Atlas save: true once A13’s “Clank’s word” scene has played (which needs s21Done when A13 is played). If A13’s ' +
      'script names it differently, map it here. (6) Read Sable’s trust and presence at step 4 only. (7) A held-scene rule ' +
      'for step 8 while S21 is open (above). (8) No change to rebirth, evolution, alignment, the Eternal rule, Moss’s ' +
      'affection threshold or Sable’s trust. ' +
      'REWARDS ARE ONE-TIME. Nothing repeats daily or per visit. ' +
      'LEARNING GROVE. The outline wants a version (caring for things we love and mending them; how knitting works; why we ' +
      'wash bedding after someone is ill; love makes old things precious). The childLines above cover the lifted lines; ' +
      'the edu versions are a separate job.',
  },
];

// ================================================================== variant scenes
export const SIDE_STORY_S25_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- step 2 done, if c4-open has played
  {
    id: 's25-sill-late',
    lines: [
      N('The lamp comes on: a warm ring of light, and a small, satisfied tick every second, like something counting sheep.'),
      N('Everyone goes down the ladder talking about the moth. You go last, with the toy and the book, and set them on the window seat for now.'),
      N('For now turns into a week, and then a fortnight. The toy sits on the sill and gets the afternoon sun.'),
      N('Nobody looks at it. You don’t either, though you mean to.'),
      N('Out of the window, on top of the western hill, Moss is looking this way. He would tell you he was looking at the weather.'),
    ],
  },
  // ---------------------------------------------------------------- step 4 scene, if Sable’s trust is under 20 or she is gone
  {
    id: 's25-storm-nosable',
    lines: [
      N('Later that week your Nubbin finds the toy on the sill. It sniffs it, sneezes, and goes off after a moth.'),
      N('Not yet, then.'),
      ...STORM,
    ],
  },
  // ---------------------------------------------------------------- step 8 done, with s21Done and a13-clank-word
  {
    id: 's25-page-found',
    lines: [
      ...READ_THE_PAGE,
      N('Clank listens with his chimney-light steady. His whistle doesn’t drop at all.'),
      M('The horse was wrong about that. I’m older than the horse.'),
      N('You pass it on. Clank does a small spin on his one wheel, the way he does when he knew something already.'),
      CK('Announcement: I found my word already. In Nova’s book. Next to a wooden boy.', 'happy'),
      CK('Is Real the same word? I don’t think it is the same word.', 'think'),
      M('No. It lives next door to it. He’s already knocked.'),
      N('You pass that on. Clank’s whistle rises, just a little, and holds.'),
      CK('Next door. Announcement: I have a neighbour.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- step 8 scene, without s21Done
  {
    id: 's25-byte',
    lines: [
      ...WET_AFTERNOON,
      N('Byte comes up the path under an umbrella, with his clipboard in a plastic bag, to return a pencil Hazel lent him nine years ago.'),
      BY('She said bring it back when I’d finished with it. I’ve finished with it. It took longer than projected.', 'think'),
      N('He sees the toy on the sill, and stops.'),
      BY('Fern says your Nubbin made her apologise to that. Formally. With the good cups.'),
      BY('And that you said it was Real. I’d like to know what you meant. Ideally in a unit.'),
      BY('Hazel had a book for everything. Is there a book?'),
    ],
  },
  // ---------------------------------------------------------------- step 8 done, without s21Done
  {
    id: 's25-page-byte',
    lines: [
      N('You find the page where the old horse explains it, and read it out. Byte writes it all down.'),
      N('Then he reads back what he’s written, and frowns at it.'),
      BY('There isn’t a single number on this page. Not one. How is anybody meant to check it?', 'think'),
      BY('Can it be measured? Ask him. I know you can hear him. I’ve stopped pretending I think you can’t.'),
      M('Tell him to try.'),
      N('You tell him. Byte looks at the toy for a long time, then at his clipboard, then turns to a clean page.'),
      BY('Fine. A log. Hours held. Times carried. Times dropped, and gone back for in the dark. I’ll let you know.'),
    ],
  },
  // ---------------------------------------------------------------- step 11 done, s25-toy = kept
  {
    id: 's25-shed-kept',
    lines: [
      N('You carry the bundle out to the shed without him. He is in the tin bath, under the cold water, waiting for your hands.'),
      N('A whole slow evening: cold water, a sliver of soap, and squeezing, and never wringing. Clover checks, and says “again”.'),
      N('Your hands go numb, and then they go patient.'),
    ],
  },
  // ---------------------------------------------------------------- step 12 scene, s25-toy = kept
  {
    id: 's25-line',
    lines: [
      N('It is past dark when Clover says that will do. Your fingers are white and wrinkled, and you can’t feel them.'),
      N('You roll him in a towel and press, and never twist. Clover nods, which from Clover is a medal.'),
      CL('Now you leave him. Overnight, flat, by the range. Not too near. Wool doesn’t like being rushed any more than the rest of us.'),
      N('His loose eye came off in the rinse. Clover holds out her palm for it.'),
      CL('I’ll sew it back tomorrow, with proper thread. It’ll outlast both of us.'),
      N('Your Nubbin wakes on the step, looks round for him, and finds him on the towel by the range.'),
      N('It lies down beside the towel: not on it, beside it.'),
    ],
  },
  // ---------------------------------------------------------------- step 12 done, s25-toy = kept
  {
    id: 's25-line-dry',
    lines: [
      N('In the morning you peg him on the line by his ears. By noon he’s dry: a size smaller, lumpier, and somehow more himself.'),
      N('Clover sews his eye back on, tight, and gives you a spare button from her tin, the same brown, for your Nubbin to wear.'),
      N('He goes back on your Nubbin’s bed, and stays there for good.'),
      N('At teatime Moss comes down to the ledge and looks through the window at him on the bed for a long while.'),
      M('Then it’s Real to you. That’s how it ends for most of them. It’s the better ending, mostly.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- step 13 scene, s25-toy = kept
  {
    id: 's25-falls-kept',
    lines: [
      N('You come home from the Hollow with the notebook inside your coat. It’s late, and the cottage smells of cold ashes.'),
      N('Moss is on the window ledge. He doesn’t ask about the notebook, and you don’t tell him yet.'),
      N('On your Nubbin’s bed the toy is waiting, a size smaller, with both eyes on tight.'),
      N('There is one thing you do want to tell him.'),
      N('You went along the ledge behind the falls today. You put your hand on the rock, and the rock was warm.'),
    ],
  },
  // ---------------------------------------------------------------- step 13 done, s25-toy = kept
  {
    id: 's25-twice-kept',
    lines: [
      ...WELLSPRING,
      N('He looks through the window at your Nubbin, asleep on its bed with its arms round the toy.'),
      M('I’ve a guess. It’s only a guess.', 'soft'),
      M('He can stay where he is while I think about it.'),
    ],
  },
  // ---------------------------------------------------------------- the spring coda (post-game), by fate and name
  codaWild('button'),
  codaWild('bobble'),
  codaWild('mister'),
  codaCoat('button'),
  codaCoat('bobble'),
  codaCoat('mister'),
  // ---------------------------------------------------------------- idle lines after s25Done (once each)
  {
    id: 's25-moss-kept',
    lines: [
      N('Moss is watching your Nubbin drag the toy through the daisies by one ear.'),
      M('He’s getting shabbier. Good. Keep it up.', 'happy'),
    ],
  },
  {
    id: 's25-moss-gone',
    lines: [
      N('Moss is looking at the long grass again.'),
      M('Nothing. I’m only looking. I’m allowed to look at grass. It is most of what I do.', 'soft'),
    ],
  },
  {
    id: 's25-clank-next-door',
    lines: [
      CK('Announcement: I live next door to a word. Moss says so.', 'happy'),
      CK('Next door is a very good place to live. You can wave.', 'soft'),
    ],
  },
];

/** Every flag this story sets. */
export const SIDE_STORY_S25_FLAGS: string[] = [
  's25-name', // button | bobble | mister (s25-name); picks the coda variant
  's25-ask', // hurt | when | sit (s25-real); flavour only
  's25-toy', // gone | kept (s25-bundle); picks steps 11–13, the coda and the idle lines
  's25Done',
];
// Read, never written: s21Done (step 8: Clank or Byte); a13-clank-word (Atlas save, step 8);
// Sable’s trust and presence (step 4); c4-open, c6-close and c8-nova seen (step timing).

export const SIDE_STORY_S25_CHECKS: string[] = [
  'inspect:s25-parcel',
  'craft:s25-loft-lamp',
  'sit:s25-window-seat:moss',
  'give:s25-toy:nubbin',
  'find:s25-toy:lawn',
  'visit:fern:s25-apology',
  'watch:s25-wild-nubbins:long-grass',
  'find:s25-book:page',
  'craft:s25-darn',
  'sit:s25-basket:night',
  'carry:s25-bundle:shed',
  'wait:s25-bundle:morning',
  'talk:moss:s25-wellspring',
];

