/**
 * Side story S28 for "Hazel’s Grove": Please Look After This Nubbin (Part M outline, S28).
 *
 *   S28 Please Look After This Nubbin   ch8 → ch11   Tier 2 (for fun; changes no campaign flag)
 *       A polite, marmalade-mad stray arrives on the carrier’s cart with a tag in Hazel’s hand,
 *       “For Byte. H.”, and moves in with Byte, of all people.
 *
 * SOURCE AND RIGHTS. After Michael Bond’s Paddington books (A Bear Called Paddington, 1958, and
 * sequels; rights: Paddington and Company Ltd) and the films Paddington (2014) and Paddington 2
 * (2017; StudioCanal and Heyday Films). Homage only: Parcel is an original Nubbin, not the bear.
 * Part M’s rights note stands: Paddington needs a licence to ship; the quote limit covers the text,
 * not the characters.
 *
 * AUDIENCE. 'all' (the main game and the Learning Grove). Both lifted lines have childLines.
 *
 * FRAME. A Grove side story, one Quest of 13 steps. Steps 1–10 run from the morning after
 * chapter 8’s notebook into early winter, all before chapter 9 opens (the cart-stop and glasshouse
 * scenes sit in early winter so they never clash with S23’s three nights). Steps 11–13 run in
 * chapter 11’s “few days”. Hazel is not seen, and nobody learns how she is, until dawn in chapter 10.
 *
 * GROVE FLAGS READ (through variants and notes only):
 *   - s7Done (with S7’s own progress, see notes): step 6. Done: reborn Null adopts Parcel and
 *     steals the marmalade off its sandwich (s28-null). Minder still ticking: Parcel waits for the
 *     bell beside Null and Byte goes pale (s28-null-minder).
 *   - s8Reunited: colour only, step 11. If Bramble’s youngest came down with Hazel, she is the one
 *     Parcel shares its sandwich with, by name (s28-bench-bramble).
 * FLAGS WRITTEN: s28-told (step 1), s28-column (step 4), s28-offer (step 8), s28Done (complete).
 *   Line-local except s28Done. Never writes a campaign flag.
 *
 * LIFTED TEXT (copyrighted source: two one-sentence quotes, each used once, as the outline lists):
 *   1. The tag, adapted from Bond’s label “Please look after this bear. Thank you.” (A Bear Called
 *      Paddington, Collins, 1958, chapter 1): “Please look after this one. Thank you.” In s28-cart.
 *   2. “If we’re kind and polite, the world will be right.” Paddington quoting Aunt Lucy in
 *      Paddington 2 (2017). Byte reads it off the back of Hazel’s recipe card in s28-kitchen.
 *   Both rechecked 2026-10-14 against secondary sources (see Part M). All other words are original.
 *
 * CARE NOTES. Bond had the wartime evacuees with labels in mind; the echo is real, so keep it warm
 * and never sad for effect (Moss gives it one line in s28-elevenses). Parcel never speaks: it is
 * polite by bow, stare and gesture only. Nubbins and animals don’t talk. Parcel is never in danger in
 * the snow for long. Mr Grue is a grump, not a villain. No Paddington name, hat or duffle coat in the
 * art. Marmalade-making is a one-time quest step; afterwards marmalade is unlimited, never required.
 *
 * Timing convention (as in the other side-story files): a step’s `scene` plays the moment the
 * previous step’s `check` is met; its `done` plays when its own `check` is met. Exceptions are in
 * the notes.
 *
 * Branching: Scene and Choice have no condition fields, so every branch is a separate scene in
 * SIDE_STORY_S28_VARIANTS. The base scenes assume s7Done (Null reborn), s28-told = true,
 * s28-column = good and s28-offer = jar. The quest notes say which variant replaces which scene.
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
const BY = say('byte');
const M = say('moss');
const PX = say('pixel');
const HZ = say('hazel');

// ---------------------------------------------------------------- new speakers
/** Never speaks: declared for the name card and portrait only. Polite by bow, stare and gesture. */
const PARCEL: Speaker = {
  id: 's28-parcel',
  name: 'Parcel',
  kind: 'nubbin',
  basedOn: 'Paddington Bear (Michael Bond), homage only: a small brown Nubbin, never the bear',
};
const GRUE: Speaker = {
  id: 'mr-grue',
  name: 'Mr Grue',
  kind: 'other',
  basedOn: 'Mr Curry, the Browns’ grumpy next-door neighbour (Michael Bond’s Paddington books), reference only',
};
const CARTER: Speaker = { id: 's28-carter', name: 'The carter', kind: 'other' };
const DOT: Speaker = { id: 's28-dot', name: 'Dot Amblin', kind: 'other' };
/** The existing Granny Brock (S29). Shared id. She says less than anyone, and always comes back with soup. */
const GRANNY_BROCK: Speaker = { id: 'granny-brock', name: 'Granny Brock', kind: 'other' };

const GB = say('granny-brock');
const GR = say('mr-grue');
const CA = say('s28-carter');
const DO = say('s28-dot');

// ================================================================== shared pieces
/** Step 10: the second half of Byte’s sentence. Ends both cart-stop choices. */
const S28_KEEPING: Line[] = [
  BY('…and I’m keeping it.', 'soft'),
  BY('That was the end of the sentence. I never asked for it, and I’m keeping it. You left before the end.', 'soft'),
  N('He takes the tag, gently, turns it over, and writes on the blank back with the pencil from behind his ear.'),
  N('His own name and his own house, “Next to Mr Grue’s”, and under it, in neat capitals: RECEIVED.'),
  N('Parcel looks at the back of its tag for a long time. Then it bows, and lets Byte carry it home inside his coat.'),
];

/** Step 8: what you offer Mr Grue for his oranges. Pays off in step 13 (s28-grue-back-*). */
const S28_OFFER: Choice[] = [
  {
    id: 'jar',
    label: 'Promise him the first jar of marmalade.',
    set: { 's28-offer': 'jar' },
    then: [
      Y('The first jar we make. It’s yours.'),
      GR('The first jar. Not the second. I’ll know.', 'think'),
      N('He puts five oranges in a paper bag, then a sixth, scowling at it as if it went in on its own.'),
    ],
  },
  {
    id: 'weed',
    label: 'Offer to weed his glasshouse for a morning.',
    set: { 's28-offer': 'weed' },
    then: [
      Y('I’ll weed the glasshouse. A whole morning.'),
      GR('There aren’t any weeds. …There are some weeds. Saturday. Early.', 'think'),
      N('He fills a paper bag with oranges, then holds the lamp for you all the way back to the hedge.'),
    ],
  },
  {
    id: 'stare',
    label: 'Give him a hard stare of your own.',
    set: { 's28-offer': 'stare' },
    then: [
      N('You look at Mr Grue, long and level. You think about lighthouses.'),
      GR('Oh, not you as well.', 'shock'),
      N('He gets to six seconds. Then he pushes a bag of oranges into Byte’s hands and goes in, muttering about the youth of today.'),
    ],
  },
];

/** Step 13 complete: the log is read, then the gifts. The first lines are shared by all three versions. */
const S28_LOG_OPEN: Line[] = [
  N('When the cake is crumbs, Byte stands up with his notebook, PARCEL: INCIDENTS. It has got quite fat since the autumn.'),
  BY('I’m going to read the log. It’s procedure. Also, I want to.', 'think'),
  BY(
    'Incidents. Bath, flood. Fence, Grue. Pyramid, jam. Glasshouse, oranges. Snow. Watch, eleven pieces.',
    'think',
  ),
  N('Beside his two columns Pixel has added a third, in green pencil, headed NOTES FROM HOME.'),
  PX(
    'I annotate his log. He pretends not to read it. He has never once rubbed out a note.',
    'happy',
  ),
];
const S28_GIFTS: Line[] = [
  N('Parcel climbs down off its chair and gives you Hazel’s jar from the Hollow, the empty one, washed. Then it bows.'),
  N('Byte gives your Nubbin a rain hat with room under it for half a sandwich. Parcel already has one: parity.'),
  N('And a luggage tag on string, lettered by Byte in neat capitals: RECEIVED.'),
  N('At the door, Mr Grue gives you a cutting from the orange tree in damp newspaper, and says it probably won’t take.'),
  N('It will. You can tell from how carefully he wrapped it.'),
];

// ================================================================== the quest
export const SIDE_STORY_S28: Quest[] = [
  {
    id: 's28',
    code: 'S28',
    title: 'Please Look After This Nubbin',
    source:
      'Paddington (Michael Bond’s books from 1958, and the films Paddington and Paddington 2): the polite stranger with a label round his neck, the grumpy neighbour, the marmalade and the hard stare (homage; two approved one-sentence quotes)',
    audience: 'all',
    trigger: {
      where:
        'The Grove gate (the carrier’s cart); Byte’s house, with Mr Grue’s house and glasshouse next door; the market square; the cart stop on the valley road; the bench by Hazel’s cottage door',
      when:
        'Opens the morning after chapter 8’s notebook (c8-close). Steps 1–10 run from early autumn into early winter, all before chapter 9 opens. Steps 11–13 run in chapter 11, after c11-open. Closes before chapter 12.',
    },
    speakers: [PARCEL, GRUE, CARTER, DOT, GRANNY_BROCK],
    steps: [
      // ------------------------------------------------ 1. the carrier’s cart (outline quest 1)
      {
        id: 's28-step1',
        goal: 'Take the stray from the carrier’s cart to Byte’s house.',
        hint: 'Walk slowly and it will follow you. Byte’s house is the one with the very straight hedge, next to the glasshouse.',
        check: 'escort:s28-parcel:byte-house',
        scene: {
          id: 's28-cart',
          lines: [
            N('The morning after the Hollow. You slept badly, with Hazel’s notebook under your pillow.'),
            N('Hooves in the lane. The carrier’s cart pulls up at the gate, and the carter leans down without getting off.'),
            CA('Morning. Got a passenger for this end of the valley. Wouldn’t give its name.'),
            N('On a crate in the back sits a small brown Nubbin, very upright, with a basket on its knees.'),
            N('It sees you, and bows. Not a nod: a proper bow, from the middle.'),
            N('Round its neck, on a piece of string, hangs a luggage tag.'),
            // Adapted from Bond’s label (A Bear Called Paddington, Collins, 1958, ch. 1). childLines s28-cart#6.
            N('“Please look after this one. Thank you.”'),
            N('Underneath, smaller: “For Byte. H.”'),
            CA('Never saw who put it on. It was sat on the milestone at the ford, with a plum on its head for the fare.'),
            CA('Plum was very fair. I’ve had worse off people.', 'happy'),
            N('You know that handwriting. You have read a letter in it so many times the folds have gone soft.'),
            N('The ink has run a little, in some old rain. It doesn’t say where she is, or how she is.'),
            N('The Nubbin climbs down off the cart with great care, one step at a time, and waits by your boot.'),
          ],
        },
        done: {
          id: 's28-for-byte',
          lines: [
            N('Byte opens his door before you knock. He has a pencil behind each ear, in case one runs out.'),
            BY('That’s a Nubbin. Why have you brought me a Nubbin? I didn’t order a Nubbin.', 'shock'),
            N('The Nubbin bows to him, from the middle. After a long moment Byte bows back, very slightly, in case it’s a trick.'),
            N('He reads the tag, then the back of the tag, which is blank, then the front again.'),
            BY('“For Byte. H.” Who’s H.?', 'think'),
          ],
          choices: [
            {
              id: 'told',
              label: 'Tell him it’s Hazel’s hand.',
              set: { 's28-told': true },
              friendship: { byte: 1 },
              then: [
                Y('It’s Hazel’s writing. I’d know it anywhere.'),
                N('Byte goes very still. He holds the tag up to the window, as if her hand might show through the card.'),
                BY('She’s been gone since the snow. Where did it get on?', 'shock'),
                Y('The ford. That’s all the carter knows.'),
                BY('Then that’s all we know. Right. I’ll want to work out the rest.', 'think'),
              ],
            },
            {
              id: 'kept',
              label: 'Keep it to yourself for now.',
              set: { 's28-told': false },
              then: [
                N('You let the question go by. It’s only an initial; there must be dozens of H’s in the valley.'),
                BY('Unknown sender. I’ll make a list of everyone with an H. It’ll be a short list.', 'think'),
                N('It won’t be. He will be very thorough about it.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 2. one jar (outline quest 2)
      {
        id: 's28-step2',
        goal: 'Fetch Hazel’s marmalade from her pantry for the stray.',
        hint: 'The jars are on the top shelf of the pantry in Hazel’s cottage. Carry them to Byte’s house.',
        check: 'carry:s28-jars:byte-house',
        scene: {
          id: 's28-one-jar',
          lines: [
            N('In the Nubbin’s basket there is a scarf, a dried apple ring and an empty jar, licked very clean.'),
            N('The jar has a label, in the same leaning hand: “Marmalade. Hollow. Last of.”'),
            BY('It’s lived on this. All the way down the valley. On one jar.', 'think'),
            BY('Nubbins eat fruit. Fruit. It’s in every book. Nobody writes “marmalade” in a book.'),
            N('The Nubbin holds the jar out to him upside down, to show him it’s empty. Then it waits, politely, in case he has another.'),
            N('You remember a shelf in Hazel’s pantry. Jars with paper lids and string, all in a row, all the same orange.'),
            Y('I think I know where there’s more.'),
            BY('How many?'),
            Y('Some.'),
            BY('“Some” isn’t a number. Go and get “some”. I’ll make a note.', 'think'),
          ],
        },
        done: {
          id: 's28-received',
          lines: [
            N('Six jars, with paper lids and string. Under the sixth, a recipe card in Hazel’s hand, spotted with old orange.'),
            N('Byte files the card under R, then counts the jars. Then he counts them again, in case one moved.'),
            BY('Six. Right. And you’re… one. Received.', 'think'),
            BY('Parcel. That’s your name. Parcel, received. I’ll sign for you.', 'soft'),
            N('He writes PARCEL in his notebook and underlines it. Parcel bows.'),
            N('Your own Nubbin has its face in the open jar. When it comes out it looks alarmed, and goes straight back in.'),
            BY('That’s one spoon unaccounted for already.', 'shock'),
          ],
        },
      },
      // ------------------------------------------------ 3. hot water (outline quest 3)
      {
        id: 's28-step3',
        goal: 'Help Byte with Parcel’s bath, and then with the water.',
        hint: 'Mop from the bathroom outwards, towards the front door. The water is heading for the garden fence.',
        check: 'minigame:clear:s28-mop-up',
        scene: {
          id: 's28-bath',
          lines: [
            N('Parcel came down from the Hollow on a cart, and a good deal of the Hollow came with it.'),
            BY('It’s muddy to the knees. Has it got knees? It’s muddy to where knees would be.', 'think'),
            BY('Bath. Standard procedure. I’ll run it. You find a towel.'),
            N('Byte puts the plug in, shows Parcel the taps, and goes to look for the bath thermometer.'),
            N('Parcel, wishing to be helpful, turns both taps on full.'),
            N('Then it sits on the edge of the bath, very upright, and waits to be told when to stop.'),
            N('Nobody tells it.'),
            N('By the time you find a towel, the bath is full. By the time Byte finds the thermometer, so is the landing.'),
            BY('WHY IS THE HALL WET?', 'shock'),
            N('The water goes down the stairs, along the hall, under the front door and out into the garden. It keeps going.'),
            N('Next door is a very tidy garden, and water likes a tidy garden. It goes under the fence to see.'),
          ],
        },
        done: {
          id: 's28-nubbin',
          lines: [
            N('A head comes up over the fence, then the rest of a man: a cardigan, a moustache and an expression.'),
            GR('NUBBIN!', 'angry'),
            N('Mr Grue, from next door. He doesn’t say anything else, and he doesn’t need to.'),
            GR('Send it back where it came from!', 'angry'),
            BY('It stays until I’ve verified the sender. That’s procedure.', 'think'),
            N('Upstairs, Parcel has turned the taps off by itself. It appears at the bathroom window, clean and pleased, and bows to Mr Grue.'),
            GR('Don’t you bow at me.', 'angry'),
          ],
        },
      },
      // ------------------------------------------------ 4. the hard stare, and Byte’s log (outline quests 4 and 5)
      {
        id: 's28-step4',
        goal: 'Be at Byte’s when Mr Grue comes round about his garden.',
        hint: 'Go to Byte’s house in the morning. You won’t have to do anything. Probably.',
        check: 'watch:s28-hard-stare',
        scene: {
          id: 's28-compensation',
          lines: [
            N('Next morning Mr Grue is on Byte’s step, with a sheet of paper, a pencil and his best cardigan.'),
            GR('I’ve made a list.', 'angry'),
            BY('So have I. Mine’s longer. Go on.', 'think'),
            GR('Item. Lettuces, drowned. Item. Path, unlevelled. Item. One pair of slippers, left on the step to air, now soup.'),
            GR('Item. My peace of mind. I’ll want something for that. I’ll be generous. I’ll take it in coal.', 'angry'),
            N('Parcel comes out from behind Byte’s legs. It stands on the step, very upright, and looks at Mr Grue.'),
            N('It doesn’t blink or move. It just looks, long and level, the way a lighthouse looks at the sea.'),
            N('Byte, without taking his eyes off it, starts counting under his breath.'),
          ],
        },
        done: {
          id: 's28-eleven-seconds',
          lines: [
            N('Mr Grue stops. Mr Grue starts again, and stops.'),
            GR('Well. I…', 'shock'),
            N('He folds the list and puts it in his cardigan pocket. He goes home, and shuts his gate very quietly.'),
            BY('Eleven seconds.', 'shock'),
            BY('Eleven. I’ve never seen anybody hold one past four. Not even Ember.'),
            N('That evening Byte opens a fresh notebook and writes on the cover, in neat capitals: PARCEL: INCIDENTS.'),
            N('Inside, he rules a column, INCIDENT, and a second, TIME. Then he looks at you over the top of it.'),
            BY('Any other columns? I don’t usually ask. I’m asking.', 'think'),
          ],
          choices: [
            {
              id: 'good',
              label: 'Suggest a column called “Good things”.',
              set: { 's28-column': 'good' },
              then: [
                BY('“Good things.” That isn’t a measurement.', 'think'),
                N('He rules it anyway, at the end, narrower than the others. You notice he leaves room to widen it.'),
              ],
            },
            {
              id: 'unverified',
              label: 'Suggest a column called “Unverified”.',
              set: { 's28-column': 'unverified' },
              then: [
                BY('Yes. Good. For anything I can’t prove yet.', 'happy'),
                N('He rules it wide, and letters it in his best capitals. It is, you suspect, his favourite word.'),
              ],
            },
            {
              id: 'none',
              label: 'Leave it. It’s his log.',
              set: { 's28-column': 'none' },
              then: [
                Y('It’s your log, Byte.'),
                BY('…Yes. It is. Right.', 'soft'),
                N('He looks at his two columns for a while, as if one were missing and he couldn’t think which.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 5. elevenses (outline quest 6)
      {
        id: 's28-step5',
        goal: 'Follow Parcel when it sets off at eleven with half a sandwich.',
        hint: 'Walk behind Parcel, not beside it: it likes to lead. It goes towards the foot of the hill.',
        check: 'walk:s28-parcel:low-wall',
        scene: {
          id: 's28-sandwich',
          lines: [
            N('A week on, Parcel has a routine. Byte has written it down, with times.'),
            BY('Up at seven. Bows to the kettle. Marmalade. Tidies its basket. Bows to the kettle again.', 'think'),
            BY('And at eleven it makes a sandwich, cuts it in half, and goes out with one half. Comes back without it.'),
            BY('I’ve followed it twice. It loses me at the wall. I think it does it on purpose.', 'think'),
            N('The clock in the hall says five to eleven. In the kitchen, a knife goes down.'),
            N('Parcel comes out with half a marmalade sandwich held in front of it in both paws, like a tray. It bows to you on the way past.'),
            BY('Go on. You’re less noticeable than me. Everyone’s less noticeable than me.'),
          ],
        },
        done: {
          id: 's28-elevenses',
          lines: [
            N('The low wall at the foot of the hill, in the thin autumn sun. Moss is sitting on it, and these days you can see a little of the wall through him.'),
            N('Parcel climbs up beside him, sets the half sandwich on the stone between them, very precisely, and bows.'),
            M('Elevenses.', 'soft'),
            M('It brings one every morning. I don’t eat. It knows that. It brings one anyway. Somebody raised it properly.', 'soft'),
            M('The robins have them, after. We sit, and I tell it things. The winter the pond froze with a duck in it. It bows at the end.', 'happy'),
            M('Plenty have come down that road with a label and a small case, you know. Most of the good ones did.', 'soft'),
            M('People think precious things shine. Mostly they’re a bit worn. They’ve been held a lot.', 'soft'),
            N('Footsteps. Byte comes round the end of the wall at four minutes past eleven, out of breath.'),
            M('His lace.'),
            N('You look at Byte. You don’t say anything; you don’t have to.'),
            BY('It’s untied, isn’t it. He’s said it. You’ve got the face.', 'think'),
            N('Byte ties it. Moss watches him tie it with great interest.'),
            M('Other one.'),
          ],
        },
      },
      // ------------------------------------------------ 6. Null (outline quest 7; reads s7Done)
      {
        id: 's28-step6',
        goal: 'See how Parcel gets on with Null.',
        hint: 'Null is at Byte’s house. Sit back and watch: Parcel will do the introducing.',
        check: 'watch:s28-parcel:null',
        scene: {
          id: 's28-null',
          lines: [
            N('Byte’s garden, late afternoon. Null comes out of the hedge after a moth with a leaf on its head, as usual.'),
            BY('Null, this is Parcel. Parcel, Null. Null chases things. Parcel bows at things. You’ll have a lot to talk about.', 'think'),
            N('Parcel bows. Null has never been bowed at: it thinks about it, and falls over backwards, which is nearly the same.'),
            N('Then Null sees the sandwich: cut into triangles, on a saucer, carried out by Parcel to share.'),
            N('Null doesn’t want the bread. It takes only the marmalade, off the top, in one long lick, and runs.'),
            N('Parcel looks at the bare bread, then at Null, long and level. Null looks straight back, chewing.'),
            N('Nobody has ever held the stare before, and Parcel seems delighted. It gives Null the rest of the bread.'),
            BY('They’ve adopted each other. I couldn’t tell you which one did it first. I wasn’t quick enough.', 'happy'),
          ],
        },
        done: {
          id: 's28-logged',
          lines: [
            N('That night Byte writes it up. He lets you watch over his shoulder, which is new.'),
            N('He writes it under INCIDENT. Then he stops, and writes it again, smaller, under GOOD THINGS.'),
            BY('It can be both. I’ve checked. There’s nothing in the rules.', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 7. a shopping expedition (outline quest 8)
      {
        id: 's28-step7',
        goal: 'Go to market day with Byte to buy Parcel a coat, and keep an eye on Parcel.',
        hint: 'Follow the noise across the square. Parcel likes looking at the tops of things.',
        check: 'find:s28-parcel:market',
        scene: {
          id: 's28-market',
          lines: [
            N('Market day. The square below the bridge is all awnings and shouting and the smell of hot chestnuts.'),
            BY('It shivers in the mornings. I’ve logged it. It needs a coat. Something with fastenings it can manage.', 'think'),
            BY('I’ve put the stalls in order of efficiency. We’ll do them in that order.'),
            N('You do the first stall in that order. When you turn round from the second, Parcel isn’t there.'),
            BY('Where is it? It was there. I had it in my peripheral vision. I have very good peripheral vision.', 'shock'),
            N('Somewhere across the square there is a noise like a xylophone falling downstairs.'),
            N('Your Nubbin is off towards it already, nose first. It knows that smell: oranges, boiled with sugar.'),
          ],
        },
        done: {
          id: 's28-jam-stall',
          lines: [
            N('A preserves stall. There was a pyramid of jars on it, very tall, very proud, with one orange-coloured jar on top.'),
            N('There is now a slope of jars. Parcel is at the bottom, holding the top jar up in both paws, unbroken.'),
            N('Nothing has broken. Everything has simply rolled, very far, in every direction.'),
            DO('My PYRAMID. Three hours, that pyramid took!', 'angry'),
            N(
              'A crowd has gathered, so Parcel bows to it. The crowd claps, and starts picking up jars, and paying for them.',
            ),
            DO(
              'Well. That’s the bramble jelly gone. And the damson. Oh, go on, then, take the plum.',
              'shock',
            ),
            N(
              'By noon the stall has sold out. Dot Amblin sits on her empty table with her cash tin, looking at Parcel as if it were weather.',
            ),
            DO(
              'Keep that one, little one. Apricot. On the house. Come back next market, and bring your bow.',
              'happy',
            ),
            N(
              'Byte buys a knitted coat with toggles, brown, Parcel-sized. Then a second, smaller, for your Nubbin.',
            ),
            BY(
              'Parity. If one of them has a coat, they both have a coat. I’ve done the maths on fair.',
              'think',
            ),
            N(
              'Granny Brock goes past with a sack of charcoal, and stops to look at Parcel in its new coat.',
            ),
            GB(
              'A Nubbin in a coat. Fine. Coat off, when it’s warm. Not the toggles. It likes the toggles.',
            ),
          ],
        },
      },
      // ------------------------------------------------ 8. the last jar, and Mr Grue’s glasshouse (outline quests 9 and 10)
      {
        id: 's28-step8',
        goal: 'Find Parcel. It wasn’t in its basket at bedtime.',
        hint: 'Look for a light next door. Mr Grue keeps a lamp burning in his glasshouse in winter.',
        check: 'find:s28-parcel:glasshouse',
        scene: {
          id: 's28-graph',
          lines: [
            N('Early winter, and frost on Byte’s very straight hedge. He meets you at the door with a sheet of squared paper.'),
            BY('Six jars, one spoon a day. That gets you to midwinter with a spoon to spare. I worked it out the week it came.', 'think'),
            BY('This is what actually happened.'),
            N('The line on the graph goes down like a dropped scarf. In the margin, in capitals: MOSS, ROBINS, YOUR NUBBIN (TWICE), MR GRUE’S STEP???'),
            BY('It shares. It feeds everyone before it feeds itself. That isn’t in any book either.', 'sad'),
            N('You know that rule. You have it in a letter, in the same leaning hand as the tag.'),
            N('On the kitchen table stands the last jar: empty, washed, its lid beside it. Parcel has put it there very neatly.'),
            BY('It washed it and put it out. Like a milk bottle. In case somebody comes.', 'sad'),
            N('That night, Parcel isn’t in its basket.'),
          ],
        },
        done: {
          id: 's28-glasshouse',
          lines: [
            N('At the bottom of Mr Grue’s tidy garden the glasshouse is lit. Steam on the glass, and a lamp held up.'),
            N('Inside, a tree in a tub: dark leaves, and small, rough, bright oranges. The only one in the valley.'),
            N('Parcel is under it with an orange in both paws. Over it stands Mr Grue, with the lamp.'),
            GR('Thief. In my glasshouse. In the night. I’ll have the—', 'angry'),
            N('Byte comes through the gap in the hedge in his dressing gown and slippers, and steps between them.'),
            BY('It’s in my care. Anything it’s done is my responsibility. Invoice me.', 'angry'),
            N('You have never seen Byte stand in front of anything that wasn’t a number. From his face, neither has Byte.'),
            GR('…Those are Seville. Bitter. You can’t eat them raw. It’s in for a nasty surprise.', 'think'),
            GR('My mother brought the pip over the pass in her coat pocket. Grew it in a teacup. Sixty years, and nobody’s ever wanted them.', 'soft'),
            GR('Well? What’s on offer? I’m not giving them away.', 'angry'),
          ],
          choices: S28_OFFER,
        },
      },
      // ------------------------------------------------ 9. the setting point (outline quest 11)
      {
        id: 's28-step9',
        goal: 'Make marmalade with Byte and Parcel from Mr Grue’s oranges.',
        hint: 'Follow Hazel’s card or Byte’s thermometer: either works. Test the set before you pour it into jars.',
        check: 'craft:s28-marmalade',
        scene: {
          id: 's28-kitchen',
          lines: [
            N('Byte’s kitchen, on a Saturday. Oranges cut, pips in a muslin bag, and the whole house smelling like a brighter house.'),
            BY('Setting point is a hundred and four and a half degrees. I’ve calibrated the thermometer. Twice.', 'think'),
            N('Hazel’s recipe card leans on the sugar bag. Under “boil hard” she has written: “Cold saucer, push it, see if it wrinkles.”'),
            BY('“See if it wrinkles.” That isn’t a test. That’s a feeling.', 'think'),
            N('Parcel has put a saucer out on the frosty windowsill. It sits beside it, guarding it, in case someone steals the cold.'),
            N('Byte turns the card over, looking for the rest of the method. On the back, in the same hand, in quotation marks, is one line.'),
            // Paddington 2 (2017), Paddington quoting Aunt Lucy. Hazel copied it. childLines s28-kitchen#6.
            BY('“If we’re kind and polite, the world will be right.”', 'think'),
            BY('That isn’t a recipe. It isn’t even hers. Somebody’s quoting somebody.'),
            Y('It’s on the recipe card.'),
            BY('Then it’s an ingredient. Unverified.', 'think'),
            N('He props the card back against the sugar bag. Quote side out.'),
          ],
        },
        done: {
          id: 's28-wrinkle',
          lines: [
            N('The thermometer says a hundred and four and a half. At the same moment, on the cold saucer, the marmalade wrinkles under Parcel’s paw.'),
            BY('They agree. The feeling and the thermometer agree.', 'shock'),
            BY('I don’t know how I feel about that.', 'think'),
            N('Nine jars glow on the table like a row of small windows. Parcel bows to each one.'),
            N('The first jar goes over the hedge to Mr Grue, promised or not. He takes it at arm’s length.'),
            GR('I’m taking this as evidence.', 'angry'),
            N('He doesn’t carry it home at arm’s length. He carries it the way you’d carry an egg.'),
          ],
        },
      },
      // ------------------------------------------------ 10. gone to the cart stop (outline quest 12)
      {
        id: 's28-step10',
        goal: 'Find Parcel in the snow.',
        hint: 'Small prints, close together, going down the lane towards the valley road. Follow them before the snow fills them in.',
        check: 'find:s28-parcel:cart-stop',
        scene: {
          id: 's28-first-snow',
          lines: [
            N('The first snow comes in the night, quietly, the way it always means to.'),
            N('In the morning Byte is at the fence with Mr Grue. They are both pretending to talk about the weather.'),
            GR('So it’s staying, then, your delivery. You’ve verified your sender.', 'think'),
            BY('No. I haven’t. I never asked for it, Mr Grue. It just came. I never asked for it—'),
            N('Behind him, on the step, Parcel puts down its half sandwich. It picks up its basket.'),
            N('By the time Byte has found the end of his sentence, there is nobody on the step to hear it.'),
            GR('Your… it’s gone. Down the lane. Had that tag held out in front of it, like a ticket.', 'shock'),
            GR('Well, don’t stand there! Go on! It’s snowing!', 'angry'),
            BY('I hadn’t finished. I hadn’t FINISHED.', 'shock'),
          ],
        },
        done: {
          id: 's28-cart-stop',
          lines: [
            N('The cart stop on the valley road is a sign, a bench and a milestone. The cart doesn’t run in the snow.'),
            N('Parcel is under the sign, very upright, with snow on its head. It is holding its tag out, to be sent back.'),
            N('It sees you both, and bows. It doesn’t put the tag down.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down in the snow beside Parcel.',
              then: [
                N(
                  'You sit. The snow is very cold, very fast; Parcel looks at you, then at the road, and doesn’t move away.',
                ),
                N(
                  'After a moment Byte sits down on its other side, in the snow, in his good trousers.',
                ),
                N(
                  'Parcel unbuttons a toggle and puts half a sandwich in your hand. It has never done that for anyone.',
                ),
                ...S28_KEEPING,
              ],
            },
            {
              id: 'back',
              label: 'Hang back. Let Byte go.',
              then: [
                N('You stop at the bend. Byte doesn’t: he goes all the way to the sign and crouches in the snow, in his good trousers.'),
                ...S28_KEEPING,
                BY('You stayed at the bend. That was right. I’d have been embarrassed.', 'soft'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 11. the coldest hour, and Hazel’s bench (outline quests 13 and 14)
      {
        id: 's28-step11',
        goal: 'Follow Parcel up to the cottage.',
        hint: 'Parcel has seen the smoke from Hazel’s chimney. Walk with Byte; it is heading for the bench by the cottage door.',
        check: 'escort:s28-parcel:hazel-bench',
        scene: {
          id: 's28-crust',
          lines: [
            N('The second morning after the Long Night. The Grove is soft with snow, and nobody has slept enough yet.'),
            N('Byte is at your gate, early, with Parcel in its coat and a matchbox in his hand.'),
            BY('I want to tell you something. It isn’t data. I’m going to say it anyway.', 'think'),
            BY('Three hours and twelve minutes in. The third cold. The one where nobody talked.'),
            BY('My hands were shaking so hard I couldn’t write. I couldn’t write anything down. That has never happened.', 'sad'),
            BY('And Parcel came along the line of us, at knee height. With half a sandwich. It gave it to me.', 'soft'),
            BY('And my hands stopped. I don’t know why. It doesn’t make sense. I’ve stopped needing it to.', 'soft'),
            N('He opens the matchbox. Inside, on cotton wool, is a sandwich crust.'),
            BY('I’ve kept it. Don’t say anything.', 'soft'),
            N('You don’t. Parcel looks up the lane at Hazel’s chimney, smoking, and sets off without either of you.'),
          ],
        },
        done: {
          id: 's28-bench',
          lines: [
            N('Hazel is on the bench by the cottage door, in three coats, awake. The thin grey Nubbin sleeps in the crook of her arm.'),
            N('Parcel walks up the path, stops at her boot, and bows. Lower than it has ever bowed to anyone.'),
            HZ('Hello again, you. Look at that coat. Somebody’s been looking after you.', 'soft'),
            N('Parcel undoes one toggle, takes out half a sandwich, and holds it up to the thin grey Nubbin.'),
            N('The thin grey Nubbin wakes and sniffs. It takes one corner, very carefully, and eats it.'),
            HZ('Two days it took me, with an apple. You turn up with a sandwich and do it in one go. Show-off.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 12. why him (outline quest 14; reads s28-told)
      {
        id: 's28-step12',
        goal: 'Stay with Byte while he talks to Hazel.',
        hint: 'Sit on the step by the bench. There’s no hurry.',
        check: 'sit:s28-step:hazel',
        scene: {
          id: 's28-why',
          lines: [
            N('Byte has been standing at the gate. Now he comes up the path with his notebook held in front of him, like a ticket.'),
            BY('Hazel. I’ve a theory. Can I say it before you say anything? It’s tidier.', 'think'),
            HZ('Go on, love.', 'soft'),
            BY('You couldn’t keep it. Not where you were. You knew you might not be there to see it fed.', 'think'),
            BY('So you needed it written down. Every day, every spoon. By somebody who’d notice if a day went missing.'),
            BY('So you sent it to the one person in the valley who writes everything down.'),
            N('Hazel looks at him for a long time. Then she nods, once.'),
            HZ('You count things, love. I needed someone who’d count this one.', 'soft'),
            N('Byte opens his notebook, finds the page, and writes VERIFIED. He doesn’t cross it out.'),
            N('Then he sits down on the step, not suddenly. He has had since the autumn to get used to the idea.'),
          ],
        },
        done: {
          id: 's28-on-the-step',
          lines: [
            N('You sit on the step beside Byte, with Parcel between you. Nobody says anything for a while, which is the best thing anyone says all morning.'),
            N('Hazel falls asleep in the middle of looking at the three of you. The thin grey Nubbin falls asleep in the middle of her.'),
            BY('I’m going to throw it a party. A welcome party.', 'soft'),
            BY('It’s very late for a welcome party. I’ve checked. There’s no rule.', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 13. a disappearing trick (outline quest 15; reads s28-offer, then s28-column)
      {
        id: 's28-step13',
        goal: 'Get Mr Grue’s watch back together after Parcel’s trick.',
        hint: 'Gather every piece from the napkin, the floor and the jam, and take them to Pixel at the kitchen table.',
        check: 'deliver:s28-watch:pixel',
        scene: {
          id: 's28-party',
          lines: [
            N('Byte’s front room, decorated: bunting cut from squared paper, and a cake with PARCEL on it, iced in very straight capitals.'),
            PX('Hi! I brought a cake stand. It rotates. You don’t have to use the rotate.', 'happy'),
            N('Mr Grue has come “for procedure”, in his best cardigan. He sits on the edge of his chair as if it might go off.'),
            BY('And now. Parcel has prepared a trick. I wasn’t told what. I’m finding that difficult.', 'think'),
            N('Parcel walks up to Mr Grue and bows. Then it holds out one paw towards his waistcoat pocket, and waits.'),
            GR('My watch? What does it want my watch for?', 'think'),
            N('Everyone looks at him, so he hands the watch over. It was his father’s, he says, twice, on the way.'),
            N('Parcel wraps the watch in a napkin, taps the napkin with a spoon, and unwraps it. The watch has gone.'),
            N('Applause, and a whistle from Pixel. Mr Grue claps three times, against his will.'),
            N('Parcel taps the napkin again and unwraps it. The watch is back, in eleven pieces.'),
            BY('Eleven.', 'shock'),
            GR('MY FATHER’S WATCH!', 'angry'),
            N('Mr Grue goes out of the front door so hard that the bunting comes down.'),
            PX('Give me all the bits. All of them. Nobody sneeze.', 'think'),
          ],
        },
        done: {
          id: 's28-grue-back',
          lines: [
            N('Half an hour later the watch is ticking in Pixel’s palm. It was losing four minutes a day, she says, and it isn’t now.'),
            N('There is a knock. Mr Grue is on the step, holding a paper bag.'),
            GR('I’ve come for the marmalade. That’s all. Not the party.', 'angry'),
            N('He holds out the bag. Oranges, small and rough and bright, from the tree that started in a teacup.'),
            GR('For the next lot. You’ll want to start early. Don’t read anything into it.', 'think'),
            N('Pixel hands Mr Grue the watch. He holds it to his ear for a long time, then sits down, properly, all the way back in the chair.'),
          ],
        },
      },
    ],
    complete: {
      id: 's28-complete',
      lines: [
        ...S28_LOG_OPEN,
        N('Then he turns the notebook sideways. The last column has grown so wide that it runs onto the facing page.'),
        BY('Good things. Bowed to the kettle. Took Moss elevenses. Shared. Shared. Shared. Washed the jar. Gave me half a sandwich.', 'soft'),
        BY('The good column is longer. I measured it. It’s longer by a page and a half.', 'soft'),
        ...S28_GIFTS,
      ],
    },
    rewards: [
      {
        id: 's28-tag',
        kind: 'cosmetic',
        label: 'Luggage Tag (“Please look after this one”)',
        description:
          'A luggage tag on string for your Nubbin, after Parcel’s. Byte lettered yours himself, in neat capitals: RECEIVED.',
      },
      {
        id: 's28-coat',
        kind: 'cosmetic',
        label: 'Knitted Coat with Toggles',
        description: 'Brown wool, toggles your Nubbin can manage by itself. Byte bought two, for parity. Given at the market (s28-jam-stall).',
      },
      {
        id: 's28-rain-hat',
        kind: 'cosmetic',
        label: 'Rain Hat with Room for a Sandwich',
        description: 'A wide-brimmed rain hat with a space under the crown for half a sandwich, in case of emergencies.',
      },
      {
        id: 's28-hollow-jar',
        kind: 'decor',
        label: 'Hazel’s Hollow Jar',
        description: 'An empty jar, washed, labelled in Hazel’s hand: “Marmalade. Hollow. Last of.” Put it on a sill and it catches the light.',
      },
      {
        id: 's28-orange-cutting',
        kind: 'decor',
        label: 'Bitter-Orange Cutting',
        description: 'A cutting from Mr Grue’s Seville orange tree, in a pot. He said it wouldn’t take. It takes.',
      },
      {
        id: 's28-byte-house',
        kind: 'feature',
        label: 'Byte’s House',
        description:
          'Byte’s house becomes a place you can visit, with Parcel living there, Null in the hedge and Mr Grue over the fence.',
      },
      {
        id: 's28-mr-grue',
        kind: 'feature',
        label: 'Mr Grue and His Orange Tree',
        description: 'Mr Grue joins the valley, with the only bitter-orange tree in it. He will complain about you. He will also give you oranges.',
      },
      {
        id: 's28-marmalade',
        kind: 'item',
        label: 'Marmalade',
        description:
          'Make it in Byte’s kitchen from Mr Grue’s oranges and Hazel’s recipe card, as often as you like. Nubbins who try it get, alarmingly, quite keen.',
      },
      {
        id: 's28-log',
        kind: 'feature',
        label: 'Journal: Parcel, Incidents',
        description: 'Byte’s log becomes a page in your journal, written in his neat capitals, columns and all.',
      },
    ],
    sets: { s28Done: true },
    childLines: {
      's28-cart#6': '“Please be kind to this small one. It has come a long way.”',
      's28-kitchen#6': '“Be gentle, say thank you, and share what you’ve got.”',
    },
    notes:
      'THEME. A stranger with a label, taken in by the one Keeper who most needs something he can’t measure. Byte’s whole ' +
      'thread is verifying the sender, and the story ends with him verifying the one thing his columns can’t hold. ' +
      'SIGNATURE CHOICES. (1) s28-told (step 1, s28-for-byte) pays off in step 12: told plays s28-why (Byte’s theory, and ' +
      'he is right); not told plays s28-why-untold (he works out that H. is Hazel there and then, and sits down on the ' +
      'step). (2) s28-column (step 4, s28-eleven-seconds) gets a nod in step 6 (s28-logged / -unverified / -none) and pays ' +
      'off in the complete scene: good = s28-complete, unverified = s28-complete-unverified, none = s28-complete-none. (3) ' +
      's28-offer (step 8, s28-glasshouse) pays off in step 13’s done: jar = s28-grue-back (a bag of oranges), weed = ' +
      's28-grue-back-weed (he brings a chair), stare = s28-grue-back-stare (he brings nothing, but stays to the end). ' +
      'Mr Grue gets the first jar in step 9 whatever was offered. ' +
      'VARIANTS (all in SIDE_STORY_S28_VARIANTS). Step 6’s scene: s28-null by default; s28-null-minder replaces it when ' +
      'Pixel’s Minder is still ticking, that is when S7 has reached its Minder (check inspect:device:s7-minder met) and ' +
      'neither s7Done nor s7-stopped is true. If S7 is done, or its lever has been pulled, or S7 never got as far as the ' +
      'Minder, play s28-null (Null playing). Step 6’s done: s28-logged (good), s28-logged-unverified, s28-logged-none, by ' +
      's28-column. Step 11’s done: s28-bench-bramble replaces s28-bench when s8Reunited is true (colour only). Step 12’s ' +
      'scene: s28-why-untold when s28-told is false. Step 13’s done and the complete scene as above. s28-byte-barks is not ' +
      'a played scene: it is a pool of idle lines for Byte after s28Done (one at random when you talk to him at his house). ' +
      'TIMING. Opens the morning after c8-close: the carrier’s cart stops at the gate (the first story offered that day). ' +
      'Steps 1–7 in autumn, any pace. Step 8 waits for the first winter day on the game clock (or follows step 7 at once ' +
      'if the clock has no seasons). Steps 8–10 must finish before c9-open; the cart-stop and glasshouse scenes sit in early ' +
      'winter so they never clash with S23’s three nights. Step 11 opens the second morning after the Long Night (after ' +
      'c11-open); steps 11–13 fit inside chapter 11’s few days, before c12-open. Step 5’s scene plays at five to eleven in ' +
      'the morning, game time, on the first morning after step 4 (Parcel’s habit is daily; the step is not). ' +
      'CANON. Parcel never speaks; it bows, stares and gestures. Nubbins and animals don’t talk; the robins only eat. Moss ' +
      'takes the Mr Gruber role (elevenses, stories, quiet wisdom). Byte cannot hear Moss until dawn in chapter 10 ' +
      '(c10-moss-stays), so in s28-elevenses Moss speaks to you and Byte reads your face. Moss is kept out of the chapter 11 ' +
      'scenes, so they are neutral to every Moss outcome. Hazel is not seen until c10-close: before then only her handwriting ' +
      'appears (tag, jar label, recipe card), and nothing says where she is or how she is (the ink is old). Steps 11–13 are ' +
      'route-neutral, including keptStone. Hazel speaks only in s28-bench(-bramble) and s28-why(-untold); her line “You ' +
      'count things, love. I needed someone who’d count this one.” is the outline’s, and original. ' +
      'PROPS AND ART. Parcel: a small brown Nubbin, very upright, a basket, a luggage tag on string. No bear features, no ' +
      'duffle coat, no bush hat. Its coat is knitted, with toggles; its rain hat is a sou’wester shape. Mr Grue: cardigan, ' +
      'moustache, slippers; a glasshouse with one bitter-orange tree in a tub; a pocket watch. Byte’s house: a very straight ' +
      'hedge, a gap in it on Mr Grue’s side. The hard stare (step 4): hold on Parcel for a beat with no input; Byte counts ' +
      'under his breath; cut at eleven. Step 10: snow falls throughout; Parcel’s prints are small and close together. ' +
      'MINI-GAME (minigame:clear:s28-mop-up). Mop the water from the bathroom out towards the front door before it reaches ' +
      'the fence. No fail state: if it reaches the fence, it does, and the done scene plays anyway. ' +
      'SIM: (1) Byte’s house becomes a visitable location from step 1 (Parcel lives there as an NPC Nubbin, not ownable). ' +
      '(2) Mr Grue and his glasshouse join the valley at step 3. (3) Optional, no lines: during the vigil (c10-vigil), if ' +
      'step 3 is done, show Parcel beside Byte; this is what step 11 remembers. (4) After s28Done, Byte uses the ' +
      's28-byte-barks pool at his house. (5) Marmalade (s28-marmalade) is craftable at Byte’s kitchen from Mr Grue’s ' +
      'oranges, unlimited, never required; Nubbins may eat it as a treat. (6) The journal page shows Byte’s log with the ' +
      'columns the player chose (none, good or unverified). (7) Steps 8–10 hold c9-open while S28 is open between step 1 and ' +
      'step 10’s done, using the same backlog rule that holds c5-close for S5 and c11-close for S9. If the player never ' +
      'begins S28 before c9-open, it is withdrawn (the cart does not run in winter). If c12-open arrives before step 13 is ' +
      'done, S28 closes unfinished: the rewards already given stay, s28Done stays unset. ' +
      'LEARNING GROVE. Two childLines replace the lifted lines. The edu version (neighbours, sorry and thank you, kitchen ' +
      'measuring and the cold-saucer test, Seville oranges, what labels and addresses are for, children who travelled with ' +
      'labels) is a separate pass.',
  },
];

// ================================================================== variants
export const SIDE_STORY_S28_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- step 6 scene: the Minder is still ticking
  {
    id: 's28-null-minder',
    lines: [
      N('Byte’s front room. The Minder ticks on the shelf: the clock face, the three little bells, the chute.'),
      N('Null sits in the little bed under it, perfectly upright, waiting. Its blue has gone thin at the edges.'),
      BY('This is Null. It’s on a schedule. Don’t mind the clock. It’s an experiment. It’s going very well.', 'think'),
      N('Parcel bows to Null, but Null doesn’t look up. It is watching the bell.'),
      N('Parcel considers this. Then it climbs into the bed beside Null, folds its paws, sits very upright, and waits for the bell too.'),
      N('Byte goes pale, then paler. You didn’t know he had another shade in him.'),
      BY('No. Not that one. That one isn’t…', 'shock'),
      BY('It isn’t mine. It’s on loan. You don’t put a thing that isn’t yours on a clock.', 'sad'),
      N('He lifts Parcel out, gently, and carries it into the kitchen. Then he comes back and stands looking at the lever on the side of the Minder.'),
      N('He doesn’t pull it, not yet. But he looks at it for a long time.'),
    ],
  },
  // ---------------------------------------------------------------- step 6 done: by s28-column
  {
    id: 's28-logged-unverified',
    lines: [
      N('That night Byte writes it up. He lets you watch over his shoulder, which is new.'),
      N('He writes it under INCIDENT. Then, after a while, he writes it again under UNVERIFIED, and underlines it twice.'),
      BY('Twice means I hope it’s true. Once means I’m checking. Don’t tell anyone that.', 'soft'),
    ],
  },
  {
    id: 's28-logged-none',
    lines: [
      N('That night Byte writes it up. He lets you watch over his shoulder, which is new.'),
      N('He writes it under INCIDENT, in very small letters, as if it might not count.'),
      BY('It isn’t really an incident. There isn’t a column for what it is.', 'think'),
    ],
  },
  // ---------------------------------------------------------------- step 11 done: if s8Reunited (colour only)
  {
    id: 's28-bench-bramble',
    lines: [
      N('Hazel is on the bench by the cottage door, in three coats, awake. Bramble’s youngest sleeps in the crook of her arm.'),
      N('Parcel walks up the path, stops at her boot, and bows. Lower than it has ever bowed to anyone.'),
      HZ('Hello again, you. Look at that coat. Somebody’s been looking after you.', 'soft'),
      N('Parcel undoes one toggle, takes out half a sandwich, and holds it up to the little grey one with the folded ear.'),
      N('Bramble’s youngest wakes and sniffs. It takes one corner, very carefully, and eats it.'),
      HZ('Two days it took me, with an apple. You turn up with a sandwich and do it in one go. Show-off.', 'happy'),
      HZ('Fern will want to hear about this. Fern wants to hear about everything this one does.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- step 12 scene: if s28-told is false
  {
    id: 's28-why-untold',
    lines: [
      N('Byte has been standing at the gate. Now he comes up the path slowly, looking from Parcel to Hazel and back.'),
      N('Hazel sees the tag round Parcel’s neck, with Byte’s writing on the back of hers, and smiles at it.'),
      HZ('Byte. I hoped it’d be you that read it.', 'soft'),
      N('Byte looks at the tag: at the H, at the leaning hand. Then at Hazel’s hand, resting on the thin grey Nubbin’s back.'),
      BY('H.', 'shock'),
      BY('I had a list. Forty-one people. I had Mr Grue on it. His first name’s Horace. I interviewed him.', 'shock'),
      N('He sits down on the step all at once, as if somebody had taken the step away and put it back lower.'),
      BY('Why me? I don’t… I count things. That’s all I do.'),
      HZ('You count things, love. I needed someone who’d count this one.', 'soft'),
      N('Byte puts his face in his notebook for a while. Nobody minds.'),
    ],
  },
  // ---------------------------------------------------------------- step 13 done: by s28-offer
  {
    id: 's28-grue-back-weed',
    lines: [
      N('Half an hour later the watch is ticking in Pixel’s palm. It was losing four minutes a day, she says, and it isn’t now.'),
      N('There is a knock. Mr Grue is on the step, holding a kitchen chair.'),
      GR('I’ve come for the marmalade. That’s all. Not the party.', 'angry'),
      GR('Brought my own chair. Yours are all too low. You weeded round my tree as if it mattered. I’ll sit at the back.', 'think'),
      N('Pixel hands Mr Grue the watch. He holds it to his ear for a long time.'),
      N('Then he puts his chair at the front, and sits down in it, properly, all the way back.'),
    ],
  },
  {
    id: 's28-grue-back-stare',
    lines: [
      N('Half an hour later the watch is ticking in Pixel’s palm. It was losing four minutes a day, she says, and it isn’t now.'),
      N('There is a knock. Mr Grue is on the step, empty-handed.'),
      GR('I’ve come for the marmalade. That’s all. Not the party.', 'angry'),
      N('He hasn’t brought anything. He takes his watch from Pixel, holds it to his ear, and says nothing at all.'),
      N('But he stays. Right to the end, past the last of the cake, and he helps Byte put the bunting back up.'),
    ],
  },
  // ---------------------------------------------------------------- complete: by s28-column
  {
    id: 's28-complete-unverified',
    lines: [
      ...S28_LOG_OPEN,
      BY('Unverified. Kind to Moss. Shares on purpose. Was missed, when it went.', 'think'),
      N('He stops, and with the pencil from behind his ear crosses out UNVERIFIED by the first one. Then the next, and then all of them, one by one.'),
      BY('There. Verified. All of it. I should have done that in the autumn.', 'soft'),
      ...S28_GIFTS,
    ],
  },
  {
    id: 's28-complete-none',
    lines: [
      ...S28_LOG_OPEN,
      N('He reads three pages of incidents. It takes a while, and Mr Grue checks his watch, which works now, twice.'),
      N('Then Byte stops, and looks at the page for a long time. He rules a new column down the edge, there and then.'),
      BY('Good things. It needed one. I didn’t know what to call it in the autumn.', 'soft'),
      N('He fills it in while you all watch. It takes longer than the incidents did.'),
      ...S28_GIFTS,
    ],
  },
  // ---------------------------------------------------------------- bark pool (not a played scene): Byte after s28Done
  {
    id: 's28-byte-barks',
    lines: [
      BY('Parcel bowed to the gatepost this morning. I bowed back. Don’t log that.'),
      BY('I’ve stopped timing Parcel’s naps. I know roughly. Roughly is, it turns out, fine.'),
      BY('Mr Grue says hello. He didn’t. But he meant to. I could tell.'),
      BY('Marmalade? It’s the good batch. They’re all the good batch.'),
      BY('I’ve started leaving a bit of room at the end of every page. In case.'),
      BY('Parcel shared its breakfast with a robin. Then the robin brought its friends. I’ve ordered more bread.'),
    ],
  },
];

/** Every flag S28 sets. Read only (through variants and notes): s7Done, s7-stopped, s8Reunited, s28-told, s28-column, s28-offer. */
export const SIDE_STORY_S28_FLAGS: string[] = [
  's28-told', // true | false (step 1, s28-for-byte); picks s28-why or s28-why-untold in step 12
  's28-column', // good | unverified | none (step 4, s28-eleven-seconds); picks step 6’s done and the complete scene
  's28-offer', // jar | weed | stare (step 8, s28-glasshouse); picks step 13’s done
  's28Done',
];

export const SIDE_STORY_S28_CHECKS: string[] = [
  'escort:s28-parcel:byte-house',
  'carry:s28-jars:byte-house',
  'minigame:clear:s28-mop-up',
  'watch:s28-hard-stare',
  'walk:s28-parcel:low-wall',
  'watch:s28-parcel:null',
  'find:s28-parcel:market',
  'find:s28-parcel:glasshouse',
  'craft:s28-marmalade',
  'find:s28-parcel:cart-stop',
  'escort:s28-parcel:hazel-bench',
  'sit:s28-step:hazel',
  'deliver:s28-watch:pixel',
];
