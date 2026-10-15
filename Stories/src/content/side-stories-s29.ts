/**
 * Grove side story S29: The Gates of Dawn (Part M, rank 15).
 *
 *   S29 The Gates of Dawn   ch4 (after Lantern Night) → closes when chapter 8 opens   Tier 2, for fun
 *       s29Done (local: s29-gift = bead | ribbon | bell, s29-wayfarer = held | sat | pencil)
 *
 * SOURCE. Kenneth Grahame, The Wind in the Willows (Methuen, London, 1908). Grahame died in 1932;
 * the text is in the public domain in the UK, the US and everywhere life + 70 or shorter applies.
 * No rights holder. The E. H. Shepard illustrations (1931) are NOT public domain in the UK: use no
 * Shepard image, pose or design. Nothing from any film, stage or TV version is used.
 *
 * AUDIENCE. 'all'. Every lifted line has a `childLines` replacement for the Learning Grove.
 *
 * FRAME. You are the third in the boat. Marina plays the Water Rat and Dusty (they/them) plays the
 * Mole. Animals don't speak in the Grove, so the Badger becomes Granny Brock, a gruff old
 * charcoal-burner who is a person. The otters are real otters and never speak: Portly and his
 * father act only through narration. The Sea Rat becomes a passing seafarer (a person). Toad is
 * left out. Your Nubbin sits in the bow, swims (Marina taught it) and, at dawn, glows. The island
 * at dawn stays ambiguous: no figure, no name, no god, and everyone forgets it afterwards.
 *
 * GROVE FLAGS READ (variants, never writes):
 *   - s4Done (step 8, the river's height): unset plays s29-low-river (a hand too low, carry over the
 *     shallows); set plays s29-low-river-full (row clean up to the weir).
 *   - s5Done (step 10, the supper): unset plays s29-supper; set plays s29-supper-walk, where Dusty
 *     remembers the walk you took with Fossil in S5.
 *   - Chapter state (not a flag): if c6-open (Fossil's farewell) has already played when step 6
 *     completes, s29-kitchen-after replaces s29-kitchen (one line changes).
 *
 * FLAGS WRITTEN: s29Done (on completion); local s29-gift (step 4) and s29-wayfarer (step 14).
 * No campaign flag is written. Tier 1: none.
 *
 * LIFTED TEXT (verbatim, from the 1908 Methuen text as given in Part M, checked there against
 * Project Gutenberg #27805, the 1913 Scribner's text, and Lit2Go's 1908 text; "the Mole" → Dusty,
 * "the Rat" → Marina):
 *   1. "Bother!" and "O blow!" (Ch. I). Dusty, s29-digging#4.
 *   2. "Hang spring-cleaning!" (Ch. I), adapted to "Hang digging!". Dusty, s29-digging#7.
 *   3. "Believe me, my young friend, there is nothing—absolute nothing—half so much worth doing as
 *      simply messing about in boats." (Ch. I; "nothing" is italic in the source). Marina, s29-boats#6.
 *   4. "O stop, stop!" … "This is too much!" (Ch. I). Dusty, at the basket, s29-picnic#3.
 *   5. "Then the faces began." (Ch. III). Narration, s29-wildwood#6.
 *   6. A fragment of 3, "Nothing half so—", called back by Dusty in s29-packing#5.
 * Part M marks four Chapter V and VII lines [unverified] (the capital little house, Portly missing
 * again, the old otter watching "on the chance", and "Afraid! Of HIM?"). Those beats are
 * paraphrased in our own words (s29-cliffhouse#1, s29-missing#2–4, s29-ford-watch#2, s29-island#5–7)
 * and nothing from them is quoted. The field-mice's carol is not used (it is a song); the valley
 * children sing a verse of the bible's own Lantern Song, as written. Homage, not lift: the
 * boot-scraper and doormat before the Badger's door, the catalogue picnic (our own list), and the
 * Wayfarers chapter (the seafarer's talk is all new).
 *
 * CARE NOTES. Every water scene has Marina in it and everyone in cork vests (from the first trip,
 * not only after the capsize). The Wild Wood is spooky, not violent, and the faces are never shown
 * clearly. The dawn presence is deliberately unexplained and adds nothing to canon; it suits all
 * faiths and none. Fossil's absence is a tender beat, kept short, and she is never named before
 * chapter 6 could have introduced her. Nobody leaves the valley (bible conflict 9): Marina stays in
 * every branch. Hazel's third rule is not quoted (the "sit" choice acts it out without the words).
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
const MA = say('marina');
const DU = say('dusty');

// ---------------------------------------------------------------- new speakers
const GRANNY_BROCK: Speaker = {
  id: 'granny-brock',
  name: 'Granny Brock',
  kind: 'other',
  basedOn: 'Mr Badger (Kenneth Grahame, The Wind in the Willows, 1908), recast as an old charcoal-burner',
};
const SEAFARER: Speaker = {
  id: 's29-seafarer',
  name: 'The seafarer',
  kind: 'other',
  basedOn: 'the Sea Rat ("Wayfarers All", The Wind in the Willows, 1908), recast as a person',
};
const CHILDREN: Speaker = {
  id: 's29-children',
  name: 'Valley children',
  kind: 'other',
  basedOn: 'the field-mice carol singers ("Dulce Domum", The Wind in the Willows, 1908)',
};

const GB = say('granny-brock');
const SF = say('s29-seafarer');
const CH = say('s29-children');

// ================================================================== shared pieces
// ---------------------------------------------------------------- step 6: the kitchen
const kitchenLines = (dustyListens: Line): Line[] => [
  N('The door opens a crack. An old woman with a candle glares out: a quilted dressing gown, and a soot-black apron over it.'),
  GB('Who’s ringing my bell at this hour? Nobody rings it at any hour. That’s why it’s there.', 'angry'),
  MA('Granny Brock. It’s Marina, from the river. We’re lost, and this one’s frozen.'),
  GB('Marina. Hm. And a frozen one. And somebody’s grandchild, by the chin on it. And a… what is that, in your coat?', 'think'),
  N('Your Nubbin looks out at her, and she looks back. Neither of them blinks first, and something is settled.'),
  GB('In. All of you. Boots off. Not you, you’ve not got boots. In.'),
  N('The passage runs back into the bank and opens into a kitchen older than the Wood: stone flags, a red fire, hams on hooks.'),
  N('The walls are carved with bits of words nobody can read now. It is the ruin of a house older than anyone’s grandmother.'),
  GB('Sit. Eat. Then talk, if you must. Better if you mustn’t.'),
  N('She feeds you soup, and bread, and more soup. She puts Dusty nearest the fire and drops a blanket on them without looking.'),
  GB('The Wood? It looks. That’s all it does. It looks at folk who don’t belong to it, and they run, and that’s their lookout.', 'think'),
  GB('My people burned charcoal in this wood before your grandmothers were born. There was a town here once. Now there’s me.'),
  GB('People come and go. The Wood stays. So do I.'),
  dustyListens,
  N('When the fire gets low, Granny Brock puts another log on without being asked. Nobody goes to sleep for a long time.'),
];

// ---------------------------------------------------------------- step 8: up to the weir
const RIVER_START: Line[] = [
  N('Summer’s end. Since the rain on the hill, Dusty has been sleeping in Marina’s boathouse, and nobody has said a word about it.'),
  N('Marina wants to show you the top of the river before the weather turns. Dusty takes an oar without being asked, and sits down first.'),
  MA('Look at that. Sitting down. I’ve made a sailor of you.', 'happy'),
];

// ---------------------------------------------------------------- step 10: the supper
const SUPPER_START: Line[] = [
  N('You come back with your arms full. Soon the stove is roaring, the room has gone gold, and even the dust looks cosy.'),
  N('Marina lays out biscuits, onions and tea on an upturned crate as if it were a banquet. Your Nubbin sits as close to the stove as it dares.'),
  N('Beside the stove there is a round basket with a cushion in it, flattened in the middle. Nobody sits on that side of the stove.'),
];
const SUPPER_END: Line[] = [
  MA('Leave it where it is. It’s hers. It can be hers and still be in your house.', 'soft'),
  N('Outside: feet on the cliff path, whispering, and a great deal of shushing. A lantern on a pole bobs up past the window.'),
  N('Dusty opens the door. Half the valley’s children are on the step in their wellies, red-nosed, holding the lantern up high.'),
  CH('We heard you were home. It’s not Lantern Night, we know. We practised one verse anyway.'),
  CH('Light one for the ones who went up the rise', 'soft'),
  CH('with the morning sun in their sleeping eyes;', 'soft'),
  CH('we are made of the ones who remember us here,', 'soft'),
  CH('so we gather, we gather, we gather each year.', 'soft'),
  DU('…Thank you. Thank you. Come in, all of you. There’s biscuits. They’re very old.', 'soft'),
  N('That night Dusty sleeps at home, in their own bed, with the stove ticking and the basket where it always was.'),
];

// ---------------------------------------------------------------- step 12: up the river by night
const NIGHT_END: Line[] = [
  N('You haul the boat up the old slipway beside the weir and put her in again above it. Up here the water is very still.'),
  N('Then you hear it. Not music, exactly.'),
  N('Like wind in reeds, if wind could mean something. Like the weir, if the weir could sing.'),
  N('Marina stops rowing. The oars drip, and she doesn’t notice.'),
  MA('Do you hear that?', 'soft'),
  N('Your Nubbin is standing up in the bow, facing upstream. It isn’t frightened; it is listening with its whole body.'),
  N('Ahead, where the river splits to go round the island, the sky has gone the colour of the inside of a shell. It is nearly dawn.'),
];

// ---------------------------------------------------------------- step 13: home to the ford
const FORD_START: Line[] = [
  N('The sun is up when you come round the bend to the ford. The old otter is still on his stone, just as you left him, and so is Dusty.'),
  N('Portly wakes all at once, sees where he is, and goes over the side in one wriggle.'),
  N('Two brown heads in the shallows, close together, turning round and round each other. The old otter makes no sound at all.'),
  DU('Oh. Oh, look at them.', 'soft'),
  N('Marina is wiping her face with her sleeve, again and again. It doesn’t seem to be working.'),
  MA('Don’t know what’s the matter with me. Must’ve been the early start.', 'soft'),
];
const FORD_END: Line[] = [
  DU('He’s giving it back. That’s a thank-you, that is.', 'soft'),
  MA('That’s him saying he’s done with it. Same thing, with otters.', 'happy'),
  DU('Where was he, in the end?'),
  MA('On the island. Asleep in the grass. That’s all.', 'think'),
  N('She says it as if there was something else, a moment ago, that she has put down somewhere and can’t think where.'),
  N('The old otter looks at you once from the water. Then the two of them go off downstream, under the bank, and the river closes over.'),
];

// ---------------------------------------------------------------- step 15: laid up
const COMPLETE_START: Line[] = [
  N('Under the willows you turn her over, gently, and lay her keel-up on the trestles where Marina was painting her in the summer.'),
  N('The three of you stand and look at her. She looks like a beetle having a rest.'),
];
const COMPLETE_END: Line[] = [
  MA('Here. Take the rug. It’s got gherkin on it. It’ll always have gherkin on it.', 'happy'),
  MA('Her little sister’s in the boathouse: the flat one, for winter water. Take her out whenever you like. Vests on.', 'think'),
  DU('Same time next summer?', 'soft'),
  MA('Before. March, if it’s mild. You get the vests down from the loft and smell them. That’s the first day of the year.', 'happy'),
  N('Down at the ford a brown head comes up, looks at the three of you for a while, and goes under without a ripple.'),
];

// ---------------------------------------------------------------- step 14: the choice
const WAYFARER_CHOICES: Choice[] = [
  {
    id: 'held',
    label: 'Hold on to her, Dusty’s way, and don’t let go.',
    set: { 's29-wayfarer': 'held' },
    then: [
      N('Dusty sits down on the bag. You take one of Marina’s arms, and Dusty takes the other.'),
      MA('Let go. Let GO. I mean it. You don’t understand, either of you.', 'angry'),
      N('She pulls, and you hold. She pulls harder, and you hold, and Dusty holds, and nobody says anything.'),
      N('Then all at once she sits down on the floor between the two of you, and the grey-green goes out of her eyes.'),
      MA('…What was I doing? What was I doing with that bag?', 'shock'),
    ],
  },
  {
    id: 'sat',
    label: 'Sit down beside her. Don’t say anything.',
    set: { 's29-wayfarer': 'sat' },
    then: [
      N('You sit down on the end of her bed, next to the bag, and say nothing at all.'),
      N('Marina folds another jumper, and another. Then she stops with one half folded, and looks at you sitting there.'),
      N('Dusty sits down on her other side. The three of you sit while the light goes, and nobody lights the lamp.'),
      MA('…Hazel used to do that. Just sit. It used to drive me spare.', 'soft'),
      N('After a long time, she puts the jumper down.'),
    ],
  },
  {
    id: 'pencil',
    label: 'Put a pencil in her hand. Ask her to draw you the tide pools.',
    set: { 's29-wayfarer': 'pencil' },
    then: [
      N('You find a pencil on the windowsill and the brown paper off a parcel, and put them both in her hands.'),
      Y('Draw me the tide pools. Before you go. I’ll never remember them right.'),
      MA('Now? It’s getting dark. I’ll do it when I… fine. Fine. Quickly.', 'think'),
      N('She draws the top pool, then the next, then the one with the anemone that never shuts and the crab under the green stone.'),
      N('By the bottom pool she is drawing slowly, and her eyes are her own colour again. She has forgotten the bag.'),
      MA('There’s one I’ve never drawn. Hang on. Pass me another sheet.', 'happy'),
    ],
  },
];

// ================================================================== the quest
export const SIDE_STORY_S29: Quest[] = [
  {
    id: 's29',
    code: 'S29',
    title: 'The Gates of Dawn',
    source:
      'Kenneth Grahame, The Wind in the Willows (Methuen, 1908; public domain): the river, the Wild Wood, Badger’s kitchen, Dulce Domum, The Piper at the Gates of Dawn and Wayfarers All',
    audience: 'all',
    trigger: {
      where: 'The stream below the Grove; later Marina’s river beyond the ridge, the Wild Wood under the Circuit and Dusty’s cliff',
      when:
        'Opens after c4-close (the week after Lantern Night). Steps are gated by chapter (see notes) and run to chapter 7. Closes when chapter 8 opens.',
    },
    speakers: [GRANNY_BROCK, SEAFARER, CHILDREN],
    steps: [
      // ------------------------------------------------ 1. Hang Digging (outline quest 1)
      {
        id: 's29-step1',
        goal: 'Help Marina carry her mended boat down to the water.',
        hint: 'The boat is upside down on the bank below the Grove. Take one end; Marina takes the other, and tells you which is which.',
        check: 'carry:s29-boat:stream',
        scene: {
          id: 's29-digging',
          lines: [
            N('The week after Lantern Night. Down by the stream the air smells of cut grass and warm mud.'),
            N('Marina is on the bank with her boat upside down on two trestles, painting its bottom blue and humming.'),
            N('A few yards off, the turf heaves. It heaves again and splits, and a pair of earthy hands comes up through it.'),
            N('Then a head, covered in soil, blinking at the sun as if the sun had done it on purpose.'),
            DU('Bother! O blow!', 'shock'),
            N('Dusty climbs out, shakes off about a bucketful of earth, and looks back down the hole with real dislike.'),
            DU('I’ve been clearing out the burrow since March. Every time I finish a room, the room next door falls in.'),
            DU('Hang digging!', 'angry'),
            MA('Well. Nobody in this valley ever thought they’d hear you say that.', 'happy'),
            DU('Nobody in this valley ever heard me mean it. Morning. What are you doing to that boat?'),
            MA('Mending her. She’s done. Come on, both of you, one at each end. You’ve never been in a boat, have you, Dusty?', 'think'),
            DU('I’ve been in a hole. Is it much different?'),
            MA('Opposite, mostly.', 'happy'),
          ],
        },
        done: {
          id: 's29-launch',
          lines: [
            N('The boat goes into the stream with a smack and a wobble, and sits there looking pleased with itself.'),
            N('Your Nubbin is in before anyone else, and takes the very front: the little pointed seat.'),
            MA('That’s the bow. And that’s a Nubbin who knows what’s what.', 'happy'),
            DU('It’s moving. It’s just sitting there, and it’s moving. Is it meant to do that?', 'shock'),
            MA('That’s the whole idea, love.'),
          ],
        },
      },
      // ------------------------------------------------ 2. Messing About in Boats + The Picnic (outline 2 and 3)
      {
        id: 's29-step2',
        goal: 'Go down the stream with Marina to the backwater, and have the picnic.',
        hint: 'Sit still in the middle while Marina rows. Leaning over the side to look at fish does not count as sitting still.',
        check: 'explore:s29-river:backwater',
        scene: {
          id: 's29-boats',
          lines: [
            MA('Vests on. Cork, see? Nobody gets in my boat without one. Not you, not Dusty, not me, not the King.', 'think'),
            N('The vests are old and stiff, and smell faintly of the sea.'),
            N('Dusty puts theirs on back to front, then the right way round, then back to front again.'),
            N('Marina pushes off. The bank slides away, and the stream takes the boat as if it had been waiting all morning.'),
            DU('So what is it you actually do? In a boat? All day?', 'think'),
            N('Marina stops rowing. She looks at Dusty very seriously, as if she has waited years for someone to ask.'),
            MA('Believe me, my young friend, there is nothing—absolute nothing—half so much worth doing as simply messing about in boats.', 'soft'),
            DU('That’s not an answer.'),
            MA('It’s the only answer. Duck. Low branch.', 'happy'),
            N('In the bow, your Nubbin leans out over the water with its ears blown flat, like a figurehead that has seen something wonderful.'),
            N('Dusty tries to swap seats with it, once. It gives them a look, and they sit back down.'),
          ],
        },
        done: {
          id: 's29-picnic',
          lines: [
            N('The stream runs into the river, and the river turns off into a backwater: still and green, with a willow leaning over it.'),
            N('Marina ties up to the willow, hauls out a wicker basket, and starts unpacking it onto a blue-and-white rug.'),
            MA('Cold chicken. Ham. Two loaves, one for now and one for later. Three cheeses. Gherkins. Seed cake. Ginger beer. Lemonade…', 'happy'),
            DU('O stop, stop! This is too much!', 'shock'),
            MA('It’s a picnic, Dusty. Too much is the amount.'),
            N('Out in the middle of the backwater a line of bubbles comes up. Then a flat brown head, whiskered, watching you.'),
            N('Then a second head beside it, much smaller and much rounder. It isn’t watching you at all; it is watching the gherkins.'),
            MA('Otters. Keep still. That’s the old one, and that’s his kit. I call him Portly. You’ll see why.', 'soft'),
            N('The old otter looks at you a long time, and sinks without a ripple. The kit doesn’t sink; the kit comes ashore.'),
            N('He walks straight up the rug, takes the biggest gherkin from the jar, and goes, dripping, before anyone can move.'),
            DU('He took a gherkin. He looked me in the eye and he took it.', 'shock'),
            MA('He does that. Last summer it was a whole pork pie. He couldn’t lift it. He tried for an hour.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 3. Dusty Takes the Oars (outline 4)
      {
        id: 's29-step3',
        goal: 'Fish the picnic out of the river and get everyone back to the bank.',
        hint: 'Your Nubbins can swim; let them. Grab whatever floats: the basket, the rug, the oars. Leave the gherkins to the otters.',
        check: 'collect:s29-picnic:river',
        scene: {
          id: 's29-oars',
          lines: [
            N('After lunch, with the sun gone soft and the basket much lighter, Marina rows you back out of the backwater.'),
            DU('Let me have a go.'),
            MA('Not today. Next time, when you’ve watched a bit more.', 'think'),
            DU('I’ve watched loads. You just pull. Anyone can pull. I pull roots out of cliffs.'),
            N('Before she can stop them, Dusty has grabbed both oars, stood up, and dug them hard into the river.'),
            N('One oar bites. The other skims the top of the water and sends Dusty over backwards, boots in the air.'),
            MA('You’ve caught a crab. That’s what it’s called. Sit down. SIT—', 'shock'),
            N('Dusty sits up, grabs the side, and the whole boat turns over, quite slowly, as if it has thought about it first.'),
            N('…'),
            N('Green water, bubbles, a great deal of noise. Then the cork vests do exactly what they’re for, and you bob up like three corks.'),
            N('Your Nubbins paddle past you towards the bank in a neat line, unbothered, as if they’d planned to swim home all along.'),
          ],
        },
        done: {
          id: 's29-fire',
          lines: [
            N('Marina gets everything ashore: you, Dusty, the basket, the rug, both oars. Then she swims back for the boat.'),
            N('She lights a fire in a ring of stones and sits Dusty in front of it, wrapped in the rug.'),
            DU('I’m so sorry. Your boat. Your lovely picnic. I’m an idiot.', 'sad'),
            MA('Never mind. Honestly. Never mind.', 'soft'),
            DU('The cheese is in the river.'),
            MA('Never mind the cheese. The fish will have a lovely afternoon. Never mind.', 'happy'),
            N('She says it until Dusty believes it. It takes most of an hour, and a whole pot of tea.'),
            MA('Tomorrow I’ll teach you properly. Both of you. Then at least you’ll fall in the right way.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 4. Lessons (outline 5): THE CHOICE
      {
        id: 's29-step4',
        goal: 'Take Marina’s rowing lesson, then find something to give Portly.',
        hint: 'Pull with your back, not your arms, and look where you’ve been, not where you’re going. Portly will be close by. He always is.',
        check: 'give:s29-portly:gift',
        scene: {
          id: 's29-lessons',
          lines: [
            MA('Lesson one: sit down. Lesson two: stay sat down. Most people never get past two.', 'think'),
            MA('Feet braced. Pull with your back. Blades in, pull, out, and turn them flat. Look behind you. Rowing is all looking behind you.'),
            DU('That seems like a design fault.'),
            MA('Take it up with the river.', 'happy'),
            N('By the afternoon you can both go in a straight line, mostly. Dusty only catches one more crab, and keeps their seat.'),
            MA('And one for the little one. Cut it down from an old one. Arms up.', 'soft'),
            N('Marina buckles a tiny cork vest onto your Nubbin. It stands very still, deeply proud, then marches up and down so everyone can see.'),
            N('All afternoon there has been a small brown head in the water behind the boat. Wherever you row, it rows too, more or less.'),
            MA('Portly. He’s adopted you. He does that, then he forgets, then he does it again.', 'happy'),
            MA('Give him something, if you like. Not food; he’ll only want more food. Something he can keep.'),
          ],
          choices: [
            {
              id: 'bead',
              label: 'A blue glass bead from your pocket.',
              set: { 's29-gift': 'bead' },
              then: [
                N('You hold it out on a flat palm. Portly comes up the bank, sniffs it, and takes it in his teeth very carefully, like an egg.'),
                N('He rolls it about on a flat stone for ten minutes, watching the light go through it.'),
                MA('Magpie. He’ll have that till he’s grey.', 'happy'),
              ],
            },
            {
              id: 'ribbon',
              label: 'A red ribbon off the picnic basket.',
              set: { 's29-gift': 'ribbon' },
              then: [
                N('You lay it on the bank. Portly takes one end and swims off with it trailing behind him like a flag.'),
                DU('Well, we’ll see him coming a mile off now.', 'happy'),
                MA('Half a mile. That’ll do.'),
              ],
            },
            {
              id: 'bell',
              label: 'A tiny brass bell off an old collar.',
              set: { 's29-gift': 'bell' },
              then: [
                N('Marina threads it on a loop of soft cord, loose enough to slip off if it catches. Portly lets you put it over his head.'),
                N('He shakes, and it rings. He shakes again, astonished, and then can’t stop.'),
                MA('Well. We’ll always know where he is now. Whether we want to or not.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 's29-lessons-done',
          lines: [
            N('Portly takes his present home along the bank in the evening light, very slowly, stopping to look at it.'),
            DU('He’s never stolen anything off you. Have you noticed? That’s how you can tell he likes you.', 'happy'),
            MA('Same time next week. If either of you stands up in my boat again, I’ll sink you myself.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 5. The Wild Wood + Into the Wood (outline 7 and 8)
      {
        id: 's29-step5',
        goal: 'Go into the Wild Wood with Marina and find Dusty.',
        hint: 'Keep to the path and keep talking. If you lose the path, stand still and listen for Dusty instead.',
        check: 'find:s29-dusty:wild-wood',
        scene: {
          id: 's29-wildwood',
          lines: [
            N('August, and there is frost on the grass at dusk, and nobody can say why. It seems to come down off the slope below the Circuit.'),
            N('Marina is at your gate with a lantern and a stout stick. She doesn’t lift and push; she shouts.'),
            MA('Dusty’s gone into the Wild Wood. On their own. At teatime. They’ve been like a cat in a thunderstorm all week.', 'angry'),
            MA('I said don’t, it’s getting dark. They said they only wanted a look. Nobody only has a look in the Wild Wood.'),
            N('Later, Dusty will tell it like this, and nobody will laugh.'),
            N('It was quiet under the first trees, and cold. The path went in, the light went out, and the frost crunched.'),
            N('Then the faces began.'),
            N('Little ones, in the holes in the banks and between the roots. Gone whenever you looked straight at them.'),
            N('Then the pattering: behind, ahead, either side, like rain that hadn’t decided where to fall.'),
            N('Dusty ran, which is the wrong thing. They ran until they fell into the hollow of an old beech, and stayed there.'),
            MA('Rules of the Wood. Keep to the path. Don’t run. Keep talking. If you run out of things to say, say anything.', 'think'),
            MA('Shopping lists. Times tables. Anything. Come on.'),
          ],
        },
        done: {
          id: 's29-beech',
          lines: [
            N('You go in talking. Marina names every rock pool on the coast from west to east, and you do your times tables, badly.'),
            N('The faces, if they are faces, keep to the edge of the lantern light. The pattering keeps pace with you, and stops when you stop.'),
            N('Your Nubbin rides inside your coat with only its eyes showing. It doesn’t like the Wood, and it doesn’t make a sound.'),
            N('At last, in the hollow of a great beech, something says “Ow” very quietly. Dusty is curled in the dead leaves, white with frost.'),
            DU('I only wanted a look.', 'sad'),
            DU('I know. I know. Don’t say it.'),
            MA('Wasn’t going to. You’re frozen. Up you get.', 'soft'),
            N('But the frost has thickened while you searched. The path has gone under it, and the lantern is guttering.'),
            MA('We’re not getting home tonight. Not that way.', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 6. Granny Brock's Kitchen (outline 9)
      {
        id: 's29-step6',
        goal: 'Find shelter in the Wild Wood before the lantern goes out.',
        hint: 'Look for anything people made: a step, a scraper, a door. Old stones mean old houses.',
        check: 'find:s29-brock-door:wild-wood',
        scene: {
          id: 's29-door',
          lines: [
            N('You go on slowly, holding on to one another’s sleeves, with Dusty in the middle.'),
            N('Dusty trips over something, hard, and sits down in the frost holding their shin.'),
            DU('Ow. Something with an edge. In the middle of a wood. Who leaves an edge in a wood?', 'angry'),
            N('Marina scrapes the frost away with her stick. It is an iron boot-scraper, very old, set in a stone step.'),
            MA('A scraper means a step. A step means a door. Dig, Dusty. You’re good at that.', 'happy'),
            DU('Fine. Yes. Digging. I take it all back.'),
            N('Under the frost there is a doormat, and beyond the doormat a little green door set into a bank under old stones.'),
            N('Marina finds a bell-pull and pulls it. Somewhere deep in the bank, a long way off, a bell clanks.'),
            N('Nothing. Then, very slowly, bolts going back: one, two, three, and a fourth, rusty, that takes some persuading.'),
          ],
        },
        done: {
          id: 's29-kitchen',
          lines: kitchenLines(
            N('Dusty listens to every word, very hard, the way you listen to someone old when someone at home is getting old too.'),
          ),
        },
      },
      // ------------------------------------------------ 7. The Long Way Out (outline 10)
      {
        id: 's29-step7',
        goal: 'Follow Granny Brock out of the Wood the back way.',
        hint: 'Keep one hand on the wall and your head down. The old culvert comes out at the edge of the fields.',
        check: 'walk:s29-culvert:fields',
        scene: {
          id: 's29-culvert',
          lines: [
            N('First light. Granny Brock is up before any of you, in boots and a coat older than her door.'),
            GB('Not back through the Wood. Not with that one. The Wood’s had its look at them already.', 'think'),
            GB('There’s an old way. A drain from the old town. Goes under the lot and comes out by the fields. Mind your heads.'),
            N('She takes a lantern and a ring of keys off a nail and leads you down a passage, then down some steps, then down some more.'),
            N('The culvert is low and round and dry, made of old brick. Your Nubbin runs ahead into the dark, then runs back to check you’re coming.'),
            GB('That one’s sensible. Goes ahead, comes back. More than I can say for some.', 'think'),
          ],
        },
        done: {
          id: 's29-fields',
          lines: [
            N('Daylight, round and white at the end of the tunnel. You come out among nettles at the edge of a hayfield, blinking.'),
            N('Behind you the Wood stands dark and quiet, and doesn’t look at all as if it was looking at anyone.'),
            GB('Go home. Don’t come in after dark. Come in the day, if you like. Bring cake. Don’t ring the bell.', 'think'),
            N('She goes back into the culvert and the dark takes her. Somewhere inside, a gate shuts, and four bolts.'),
            DU('I’m a river person now. I’ve decided. Rivers are flat. You can see what’s coming. Nothing looks at you from a river.', 'soft'),
            MA('Otters do.', 'happy'),
            DU('Otters are allowed.'),
          ],
        },
      },
      // ------------------------------------------------ 8. The Low River (outline 6, moved: reads s4Done)
      {
        id: 's29-step8',
        goal: 'Row up the river to the weir pool with Marina and Dusty.',
        hint: 'Take an oar each. Above the backwater the river narrows; where it’s too shallow to row, everyone gets out and carries.',
        check: 'minigame:s29-rowing:weir',
        scene: {
          id: 's29-low-river',
          lines: [
            ...RIVER_START,
            N('Above the backwater the river is wrong. The banks stand high and dry, and weed lies flat on stones that ought to be under water.'),
            MA('A hand too low. It’s been a hand too low all summer. Something upstream’s having it.', 'think'),
            N('Halfway up, the boat grounds on gravel. There is nothing for it: out, all of you, and carry.'),
            N('The water round your ankles is cold enough to make your teeth hurt.'),
            DU('Cold. In August.', 'shock'),
            MA('It was cold in July, too. Nobody listened then either.', 'sad'),
          ],
        },
        done: {
          id: 's29-weir',
          lines: [
            N('At the top, the river comes over the weir in one long glassy fold, and roars, and spreads into a wide brown pool below.'),
            N('Just above the weir, where the river splits to go round it, there is an island: willows, and a little bank of long grass.'),
            MA('Nobody lands there.', 'soft'),
            DU('Why not?'),
            MA('Don’t know. Nobody does. My gran didn’t, and her gran didn’t. There’s nothing on it but grass.', 'think'),
            MA('There’s a spring on it, warm all winter. Same water as behind the falls, my gran reckoned.'),
            MA('Come on, it’s getting on. We’ll leave her at the landing under the cliff and walk the last bit.'),
          ],
        },
      },
      // ------------------------------------------------ 9. Dulce Domum (outline 11)
      {
        id: 's29-step9',
        goal: 'Catch Marina up on the river path and tell her what’s wrong.',
        hint: 'She’s gone on ahead towards the boathouse. She walks fast when she’s hungry. Run.',
        check: 'talk:marina:s29-dusk-path',
        scene: {
          id: 's29-dusk',
          lines: [
            N('Dusk along the river path. Above you rises a cliff striped like a cake: brown, red, grey, brown.'),
            N('Marina walks ahead, fast, talking about supper. Halfway along, Dusty stops dead, as if somebody has called their name.'),
            DU('Oh.', 'shock'),
            N('They are looking up the cliff, at a small round door in the rock and a window with no light in it.'),
            DU('That’s mine. I can smell it. Earth, and old tea, and… it’s mine. I haven’t been back. Not since the rain.', 'sad'),
            DU('Marina! Marina, wait—'),
            MA('Come on, you two! Supper! I’m starving, and it’s getting dark!', 'happy'),
            N('She hasn’t heard; she’s already round the bend. Dusty looks after her, and up at the door, and after her again.'),
            N('Then they sit down on an old stump by the path, put their face in their hands, and cry.'),
          ],
        },
        done: {
          id: 's29-turnback',
          lines: [
            N('You catch Marina up at the bend. You don’t have to say much: you say “Dusty”, and point.'),
            N('She turns round at once, in the middle of a word, and goes back down the path at a run.'),
            MA('Dusty. Oh, Dusty. What is it?', 'soft'),
            DU('It’s the house. It’s only the house. I can’t go in. Everything in it is hers.', 'sad'),
            DU('And I can’t walk past it either. I tried. My feet won’t.'),
            MA('Then we won’t walk past it. I’m an idiot. I was thinking about my supper.', 'sad'),
            MA('Right. Up we go. All of us. I’m not leaving you on a stump.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 10. Supper (outline 12, reads s5Done)
      {
        id: 's29-step10',
        goal: 'Fetch dry kindling for Dusty’s stove.',
        hint: 'The woodpile is round the side of the cliff house. The top layer is wet; dig down.',
        check: 'collect:s29-kindling:cliff-house',
        scene: {
          id: 's29-cliffhouse',
          lines: [
            N('Inside, Dusty’s house is cold, dusty and dark: a round room cut from the rock, a stove, two chairs and a great many trowels.'),
            MA('Look at it. A proper little house, this. Snug as an egg. And you’ve been sleeping in my boathouse with the nets.', 'happy'),
            DU('It’s not snug. It’s cold. There’s nothing to eat.', 'sad'),
            MA('There’s always something to eat. You: kindling, the dry stuff, round the side. Dusty: sit. I’ll do the cupboards.', 'think'),
            N('Dusty sits. Marina goes through the cupboards like weather, opening everything and talking to all of it.'),
            MA('Biscuits. Ancient. They’ll do. Tea. A jar of… pickled onions? They’ll do. Candles!', 'happy'),
          ],
        },
        done: {
          id: 's29-supper',
          lines: [
            ...SUPPER_START,
            DU('Fossil’s. She liked it there. Twenty years by that stove, and she never once let me have the warm side.', 'soft'),
            DU('I couldn’t come in with it there. And I couldn’t move it. So I didn’t come in.'),
            ...SUPPER_END,
          ],
        },
      },
      // ------------------------------------------------ 11. Portly Is Missing (outline 13)
      {
        id: 's29-step11',
        goal: 'Go down to the ford at dusk and see the old otter.',
        hint: 'The ford is just below the backwater, where the stepping stones cross. Go quietly, and not too close.',
        check: 'watch:s29-old-otter:ford',
        scene: {
          id: 's29-missing',
          lines: [
            N('The last days of summer. The swallows are lining up on the wires, and the evenings smell of smoke.'),
            N('Marina comes up the lane early, without her boat, without a basket, and without a joke.'),
            MA('Portly’s gone. Three days now. Nobody’s seen him on the river, up or down.', 'sad'),
            MA('He wanders. He always has, and he’s always turned up. But never this long, and the nights are getting cold.'),
            MA('His dad won’t make a fuss. Otters don’t. That’s how you know it’s bad.', 'sad'),
            Y('Where does the old one go?'),
            MA('The ford. Where he taught Portly to swim. Come and see.'),
          ],
        },
        done: {
          id: 's29-ford-watch',
          lines: [
            N('At the ford the water runs shallow and loud over the stepping stones. On the flattest stone sits the old otter, quite still.'),
            N('He doesn’t look at you. He looks upstream, the way the water comes, and doesn’t move, and doesn’t eat.'),
            MA('Every night, and every morning before it’s light, he sits right there. Waiting for the water to bring him back.', 'soft'),
            N('Dusty comes down the bank behind you with a flask and a blanket. They sit a little way off from the old otter, and stay.'),
            DU('Somebody ought to sit with him. I know about sitting.', 'soft'),
            MA('Tonight we go up. You and me, in the boat, all the way to the weir if we have to.', 'think'),
            MA('Bring a lantern. And bring that one of yours. They see better in the dark than we do.'),
          ],
        },
      },
      // ------------------------------------------------ 12. Upriver by Night (outline 14: the gift pays off)
      {
        id: 's29-step12',
        goal: 'Row up the river in the dark and look for Portly.',
        hint: 'Row slowly and keep the lantern low over the water. Watch the banks, the reeds and the mud, and listen.',
        check: 'minigame:s29-rowing:night',
        scene: {
          id: 's29-upriver',
          lines: [
            N('Night. The river is black and smooth, and the lantern makes a small gold room on it that goes where you go.'),
            N('Marina rows. You hold the lantern out over the bow, where your Nubbin sits in its cork vest with its ears up.'),
            MA('Keep it low. Look at the edges: mud, reeds, roots. He’ll be somewhere a kit thinks is a good idea.', 'think'),
            N('Owls, a fish jumping, once a dog far off. The river makes small noises, and every one of them is not Portly.'),
            MA('He’s a good swimmer. I taught him. Well. He taught himself, and I watched and said well done.', 'soft'),
            MA('Vest done up? Right. We go on till we find him or the river runs out.'),
          ],
        },
        done: {
          id: 's29-night',
          lines: [
            N('Something winks in the lantern beam, down on a mudbank. Your Nubbin sees it first, and nearly goes over the side.'),
            N('It’s the blue glass bead, pressed into the mud. Round it, small webbed prints lead off upstream.'),
            MA('He was here. He put it down. He never puts it down.', 'shock'),
            N('You put the bead in your pocket and row on, following the prints until the mud runs out at the weir.'),
            ...NIGHT_END,
          ],
        },
      },
      // ------------------------------------------------ 13. The Island at Dawn + Home to the Ford (outline 15 and 16)
      {
        id: 's29-step13',
        goal: 'Row Portly home to the ford.',
        hint: 'Downstream all the way. Let the river do the work, and keep him warm.',
        check: 'deliver:s29-portly:ford',
        scene: {
          id: 's29-island',
          lines: [
            N('Marina rows on, not as if she has decided to. The boat touches the island with a soft sound, and you step out.'),
            N('The air is warm, warmer than any night this summer. It smells of wet stone, deep water and something green.'),
            N('Among the willows there is a hollow in the long grass, pressed flat, as if something large had sat there all night.'),
            N('In the middle of it, curled nose to tail, is Portly. Asleep, round and safe, his sides going up and down.'),
            N('Your Nubbin walks to the edge of the hollow and stops. The ball above its head begins to glow, softly, the colour of the sky.'),
            MA('Scared? Of this? Don’t be daft. Nobody could be scared of this.', 'soft'),
            N('She is holding your sleeve, tight.'),
            MA('…I am, though. I am. And I don’t mind a bit. Isn’t that strange?', 'soft'),
            N('None of you looks up. It seems very important, all at once, to look only at Portly and the grass and your own feet.'),
            N('Then a small wind comes off the water, warm, and goes over the island once, and through your hair, and away.'),
            N('…'),
            N('You are standing on an island at dawn, and you can’t think why you’re both so quiet.'),
            MA('Well, look at that. There he is. Fast asleep, the little beggar.', 'happy'),
            N('Whatever there was to remember, you have been kindly let off remembering it. Your Nubbin yawns, and its light is just a light.'),
            N('Marina lifts Portly into the boat, still asleep, and wraps him in her scarf. He doesn’t wake.'),
          ],
        },
        done: {
          id: 's29-ford',
          lines: [
            ...FORD_START,
            N('Before they go, Portly comes back up the bank. You put the blue bead down on the stone for him.'),
            N('He looks at it, and at you. Then he noses it back to your boot, puts a wet pebble down beside it, and goes.'),
            ...FORD_END,
          ],
        },
      },
      // ------------------------------------------------ 14. Wayfarers All (outline 17): THE SECOND CHOICE
      {
        id: 's29-step14',
        goal: 'Get to Marina’s boathouse before she goes.',
        hint: 'The boathouse is past the tide pools, where the river meets the sea. Dusty is already running; go with them.',
        check: 'find:marina:s29-boathouse',
        scene: {
          id: 's29-seafarer',
          lines: [
            N('Autumn. The leaves are turning, and one morning the swallows have gone without saying goodbye.'),
            N('A man comes up the valley road with a pack on his back: brown as a walnut, a gold ring in one ear, eyes creased from too much water.'),
            SF('Afternoon. Is this the river that comes down off the falls? I’ve followed it all the way up from the sea.', 'happy'),
            N('Marina is mending nets on the bank. He sits down beside her to rest his feet, and doesn’t get up again until the light goes.'),
            SF('South of here the sea’s the colour of a bottle. The harbours have boats painted every colour you can name, and some you can’t.', 'soft'),
            SF('Nights on deck, you lie on your back and the stars swing over the mast like a lamp on a chain.'),
            SF('There’s a town on a hill where the whole street is steps, and every step’s a shop, and every shop sells something you’ve never heard of.'),
            SF('I’ve been everywhere you can get to by water. And there’s always more water. That’s the beauty of it.'),
            N('Marina doesn’t say anything. She has stopped mending, and the net lies in her lap with the needle stuck in it.'),
            SF('Well. I’ll be on. There’s a ship at the river mouth at the end of the week, and tides don’t wait.', 'happy'),
            N('He goes on down to the coast. Marina watches him the whole way, until he’s a speck, and then until he isn’t.'),
          ],
        },
        done: {
          id: 's29-packing',
          lines: [
            N('At dusk Dusty comes running up to your gate, out of breath. Together you get to the boathouse just as the lamps come on.'),
            N('Marina is moving about quickly and quietly, folding jumpers into a bag on the bed, and not looking at either of you.'),
            N('Her eyes have gone grey-green, like the sea in a picture. She looks straight through you, at something a long way south.'),
            MA('I’m only going to have a look. A season. Two. Down the coast, and then on. I’ve never been anywhere.', 'soft'),
            MA('All my life, the same river. Up to the weir and back. Up to the weir and back.'),
            DU('You love the river! You told me. You said there was nothing half so—', 'sad'),
            N('She doesn’t stop folding.'),
          ],
          choices: WAYFARER_CHOICES,
        },
      },
      // ------------------------------------------------ 15. Laid Up (outline 18)
      {
        id: 's29-step15',
        goal: 'Haul Marina’s boat up the bank for the winter, under the willows.',
        hint: 'Logs under the keel for rollers, and all three of you. She goes upside down, so the rain runs off.',
        check: 'carry:s29-boat:willows',
        scene: {
          id: 's29-laidup',
          lines: [
            N('A grey, blowy morning near the end of autumn. The willows are dropping their leaves into the river by the handful.'),
            MA('Time she came out, before the hard frosts. You don’t leave a boat in over winter. Not one you love.', 'think'),
            N('You lay three round logs on the bank for rollers. Dusty takes the bow rope; you and Marina push from the stern.'),
            DU('Nobody told me boats were this heavy when they’re not floating. It feels like a trick.'),
            MA('Heave. And heave. Mind your toes on the rollers.'),
            N('Your Nubbin rides in the bow all the way up the bank and refuses to get out, so that it is still, technically, boating.'),
          ],
        },
      },
    ],
    complete: {
      id: 's29-complete',
      lines: [
        ...COMPLETE_START,
        MA('I was cross with you both for a whole day after. Did you notice? I slammed doors.', 'think'),
        DU('We noticed. The boathouse has one door. You slammed it a lot.'),
        MA('Thank you. For not letting go. I’d have hated it, I think: somewhere far off and warm, wishing I was cold here.', 'soft'),
        ...COMPLETE_END,
      ],
    },
    rewards: [
      {
        id: 's29-rowing',
        kind: 'feature',
        label: 'Marina’s boat: rowing',
        description:
          'Row on the stream below the Grove and on the river, with a Nubbin in the bow. From the line’s end you row her flat little winter sister instead, till spring.',
      },
      {
        id: 's29-river',
        kind: 'feature',
        label: 'The river section',
        description:
          'The river from the backwater to the weir opens: the otter family lives there, Granny Brock’s green door is in the Wild Wood, and Dusty’s cliff window is lit again.',
      },
      {
        id: 's29-cork-vest',
        kind: 'cosmetic',
        label: 'Cork vest',
        description: 'A tiny cork vest Marina cut down from an old one. Your Nubbin wears it with enormous pride, on water and off it.',
      },
      {
        id: 's29-picnic-rug',
        kind: 'decor',
        label: 'Willow-pattern picnic rug',
        description: 'Marina’s blue-and-white picnic rug, for the Grove. It has gherkin on it. It will always have gherkin on it.',
      },
      {
        id: 's29-portly-gift',
        kind: 'item',
        label: 'Portly’s gift, and a pebble',
        description:
          'The bead, the ribbon or the bell you gave Portly, given back at the ford with a wet river pebble beside it. A keepsake; it does nothing at all.',
      },
    ],
    sets: { s29Done: true },
    childLines: {
      's29-digging#4': 'Oh, crumbs! Oh, rubble!',
      's29-digging#7': 'That’s it. No more digging. Not today!',
      's29-boats#6': 'Honestly? Pottering about in a boat is the best thing there is. Nothing else comes close.',
      's29-picnic#3': 'Wait! Stop! Nobody could eat all that!',
      's29-wildwood#6': 'And then Dusty started seeing things in the dark.',
      's29-packing#5': 'You love the river! You told me. You said it was the best thing there is!',
    },
    notes:
      'FOR FUN (Tier 2). Sets s29Done and two local flags: s29-gift (step 4: bead | ribbon | bell) and s29-wayfarer ' +
      '(step 14: held | sat | pencil). Writes no campaign flag. Reads s4Done, s5Done and the chapter (see VARIANTS). ' +
      'THEME. Homely comfort and ancient awe: friendship, homesickness, the dark wood and the lit window, and a dawn ' +
      'nobody is allowed to keep. Comedy where Grahame is comic (the boat, the capsize, the gherkin); grave where he is ' +
      'grave (Dulce Domum, the island). ' +
      'SIGNATURE CHOICE. Step 4’s gift for Portly pays off eight steps later in step 12 (how you find his trail at night) ' +
      'and again in step 13 (what he gives back at the ford, with a pebble). Step 14’s choice decides the complete scene. ' +
      'Marina stays in every branch (bible conflict 9). The "sat" branch acts out Hazel’s third rule without quoting it, ' +
      'and Marina names Hazel’s habit, not the rule. ' +
      'TIMING. A step’s scene plays when the previous step’s check is met; its done scene plays when its own check is ' +
      'met. Gates: steps 1–4 from c4-close (chapter 4, and on into chapter 5 if the player is slow). Step 5 waits for ' +
      'chapter 5 (after c5-open: frost in August) and then plays the next dusk the player is in the Grove; steps 5–7 run ' +
      'as one night and the next morning. Step 8 waits for c6-close (after Fossil’s farewell); if c6-close has already ' +
      'played when step 7 ends, it plays the next morning. Steps 9–10 follow on the same evening as step 8. Step 11 plays ' +
      'two in-game days after step 10. Steps 12–13 run as one night and the dawn after. Step 14 waits for chapter 7 ' +
      '(c7-open) and then the next afternoon; step 15 plays the morning after step 14. Closes when chapter 8 opens ' +
      '(Marina has the ledge path to guard): if the line is unfinished then, it closes unfinished, with no rewards beyond ' +
      'the cork vest and the gift keepsake if those were already given. Never during S4’s sluice night (s4-sluice). ' +
      'VARIANTS (in SIDE_STORY_S29_VARIANTS): ' +
      'step 6 done: s29-kitchen-after replaces s29-kitchen if c6-open (Fossil’s farewell) has played; only Dusty’s ' +
      'listening line changes, and Fossil is never named in either. ' +
      'step 8 scene: s29-low-river-full replaces s29-low-river if s4Done (the river is up since S4 opened the sluice). ' +
      'step 10 done: s29-supper-walk replaces s29-supper if s5Done (Dusty remembers the walk you took with Fossil). ' +
      'step 12 done: s29-night is for s29-gift = bead; s29-night-ribbon and s29-night-bell replace it for the others. ' +
      'step 13 done: s29-ford is for bead; s29-ford-ribbon and s29-ford-bell replace it for the others. ' +
      'complete: s29-complete is for s29-wayfarer = held; s29-complete-sat and s29-complete-pencil replace it. ' +
      's29-brock-knock is an ambient scene after the line: tap Granny Brock’s green door in the Wild Wood by day (by ' +
      'night the door does not answer). It can play any number of times and gives nothing. ' +
      'STAGING. Step 5’s middle (s29-wildwood lines 4–9) is a cutaway of Dusty alone, told in the past tense as Dusty’s ' +
      'own later telling: dim the frame, no player sprite. The faces are eye-glints at the edge of the lantern radius, ' +
      'never sprites, and gone the moment the camera centres on them; the pattering is a soft SFX bed. Nothing in the ' +
      'Wood attacks or touches anyone. In s29-boats#6, set "nothing" (the first one) in italics if the dialogue box ' +
      'supports emphasis; it is italic in Grahame. The Lantern Song lines in the supper scenes are sung (children’s ' +
      'voices, the campaign melody, one verse only, no refrain). ' +
      'THE ISLAND (s29-island). Light: pre-dawn pearl going to gold. The hollow is just flattened grass. Show no figure, ' +
      'shadow, footprint, hoof, horn, pipe or face, and play no melody: the "music" is a breathy reed-and-water texture ' +
      'that stops when the wind comes. Never let the camera look up. Your Nubbin’s ball glows sky-colour, then returns ' +
      'to normal after the wind. The journal records only “Found Portly asleep on the island.” The island is never ' +
      'landable outside this scene: afterwards the boat glides past it. ' +
      'CANON. Marina = the Water Rat, Dusty (they/them) = the Mole, Granny Brock (a person) = the Badger, the seafarer ' +
      '(a person) = the Sea Rat. The otters never speak and are not speakers: Portly and the old otter act only through ' +
      'narration. Your Nubbin never speaks. Fossil is never named before step 10, so the chapter 5 scenes work whether or ' +
      'not S5 has introduced her; from step 10 (after chapter 6) she is named, gently, by Dusty only. Marina’s line about ' +
      'the island spring (“same water as behind the falls, my gran reckoned”) is a hint and nothing more: it adds nothing ' +
      'to canon and must never be followed up. The cold in the Wild Wood and the low river are noticed, never explained ' +
      '(chapter 7 explains the Stillness). Corvin does not appear. ' +
      'SAFETY. Every water scene has Marina and everyone in cork vests; the capsize is comic and nobody is in danger. ' +
      'Portly’s bell is on a loose loop made to slip off, and he shrugs it off at the ford. ' +
      'CHECKS. carry:s29-boat:stream and :willows use Carry with a second carrier (Marina). explore:s29-river:backwater ' +
      'is a ride-along (Marina rows; the player can tap to point at fish, herons and the backwater). ' +
      'collect:s29-picnic:river is a short gather in the shallows: basket, rug, two oars (gherkins drift off to the ' +
      'otters and can’t be caught). give:s29-portly:gift is met by the choice in s29-lessons. ' +
      'find:s29-dusty:wild-wood and find:s29-brock-door:wild-wood are lantern-radius searches with no fail state: the ' +
      'lantern dims slowly but never goes out, and standing still makes Dusty’s muttering louder. ' +
      'walk:s29-culvert:fields is a short walk in the dark following Granny Brock’s lantern. ' +
      'minigame:s29-rowing:weir and :night use the new rowing game (SIM). talk:marina:s29-dusk-path is met by reaching ' +
      'Marina at the bend. collect:s29-kindling:cliff-house is a dig through the wet top of the woodpile. ' +
      'watch:s29-old-otter:ford is a hold-still beat (~15 seconds, any tap resets it gently, no fail). ' +
      'deliver:s29-portly:ford is a downstream row with no steering errors possible. find:marina:s29-boathouse is a ' +
      'walk to the boathouse with Dusty. ' +
      'SIM: (1) a rowing mini-game: two-button or two-thumb strokes, the boat yaws if one side pulls harder, and the ' +
      'player faces backwards (the view rotates to show where you are going on request). Courses: weir (with a ' +
      'carry-over-the-shallows segment when s4Done is false) and night (lantern radius; the step 12 cue is a visual ' +
      'glint for bead or ribbon and a positional sound for bell). No fail state; a capsize only happens in step 3’s ' +
      'scene. (2) Marina’s boat as a usable feature on the stream and river after step 4 (the summer boat), then her ' +
      'flat winter boat from the boathouse after s29-complete. A Nubbin can be set to ride in the bow. (3) The river ' +
      'section map (backwater, ford, weir, slipway, island seen only) and the otter family as ambient wildlife that ' +
      'never comes within reach. (4) Granny Brock’s door in the Wild Wood (s29-brock-knock). (5) Dusty’s home location ' +
      'moves back to the cliff house after s29-supper (window lit at night). (6) Reading the chapter for the kitchen ' +
      'variant. ' +
      'REWARDS. The cork vest is given in s29-lessons (step 4); Portly’s gift and pebble at the ford (step 13 done; its ' +
      'label and sprite follow s29-gift); the rowing feature after step 4 (summer boat) and the winter boat at ' +
      's29-complete; the river section and the rug at s29-complete.',
  },
];

// ================================================================== variants
export const SIDE_STORY_S29_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- step 6 done, if c6-open has played
  {
    id: 's29-kitchen-after',
    lines: kitchenLines(
      N('Dusty listens to every word, very hard, the way you listen to someone old when someone old at home has only just gone.'),
    ),
  },
  // ---------------------------------------------------------------- step 8 scene, if s4Done
  {
    id: 's29-low-river-full',
    lines: [
      ...RIVER_START,
      N('The river is full to its banks, and running fast and clear the way it ought to at the end of a summer.'),
      MA('Look at her go. Since a certain gate got opened, she’s been running like she means it.', 'happy'),
      N('You row clean up through the shallows without touching bottom once. Dusty keeps time under their breath: in, pull, out.'),
      DU('I’m doing it. I’m actually doing it. Don’t look at me, I’ll stop.', 'happy'),
      MA('Not looking. Eyes on the weir. Not looking at all.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- step 10 done, if s5Done
  {
    id: 's29-supper-walk',
    lines: [
      ...SUPPER_START,
      DU('Fossil’s. You know. You carried her. The cliff, and the tree, and the water.', 'soft'),
      DU('That was her last good day. I think about it a lot. That one, not the other one.', 'soft'),
      DU('I couldn’t come in with that basket there. And I couldn’t move it either.'),
      ...SUPPER_END,
    ],
  },
  // ---------------------------------------------------------------- step 12 done, s29-gift = ribbon
  {
    id: 's29-night-ribbon',
    lines: [
      N('Near the weir something red is streaming out of the reeds, pointing upstream like a finger.'),
      N('It’s the ribbon, caught fast on a reed stem and pulled long and thin by the current.'),
      MA('He came this way. Up past the weir. Little idiot. Brave little idiot.', 'shock'),
      N('You work it free and put it in your pocket. Then you row on, towards the roar of the weir.'),
      ...NIGHT_END,
    ],
  },
  // ---------------------------------------------------------------- step 12 done, s29-gift = bell
  {
    id: 's29-night-bell',
    lines: [
      N('Far off, over the water, a tiny bell rings once.'),
      MA('Stop. Listen.', 'shock'),
      N('Nothing. Then again, from upstream, from beyond the weir: one small brass ring, and quiet after.'),
      MA('That’s him. That’s his bell. He’s alive, and he’s up there.', 'soft'),
      ...NIGHT_END,
    ],
  },
  // ---------------------------------------------------------------- step 13 done, s29-gift = ribbon
  {
    id: 's29-ford-ribbon',
    lines: [
      ...FORD_START,
      N('Before they go, Portly comes back up the bank. You hold out the red ribbon, muddy now, from your pocket.'),
      N('He sniffs it, and noses it back into your hand. Then he puts a wet pebble on your palm beside it, and goes.'),
      ...FORD_END,
    ],
  },
  // ---------------------------------------------------------------- step 13 done, s29-gift = bell
  {
    id: 's29-ford-bell',
    lines: [
      ...FORD_START,
      N('Before they go, Portly comes back up the bank and shakes himself, and the bell rings. He shrugs it off over his head with one paw.'),
      N('He leaves it on your boot with a wet pebble beside it. Then he goes after his dad, quiet for the first time all summer.'),
      ...FORD_END,
    ],
  },
  // ---------------------------------------------------------------- complete, s29-wayfarer = sat
  {
    id: 's29-complete-sat',
    lines: [
      ...COMPLETE_START,
      N('Marina says nothing; she hasn’t said much since the night of the bag. She leans on you a little, and stays leaning.'),
      N('Dusty leans on her other side. The three of you stand like that until the wind gets into your collars.'),
      ...COMPLETE_END,
    ],
  },
  // ---------------------------------------------------------------- complete, s29-wayfarer = pencil
  {
    id: 's29-complete-pencil',
    lines: [
      ...COMPLETE_START,
      N('On the boathouse wall, pinned up with four tacks, is a pencil drawing on brown paper: every tide pool, from the top to the sea.'),
      N('In the bottom corner, very small, there is a boat with three people in it and a Nubbin in the bow.'),
      MA('I’m doing the river next. All of it, source to sea. It’ll take me years.', 'happy'),
      ...COMPLETE_END,
    ],
  },
  // ---------------------------------------------------------------- ambient, after s29Done: Granny Brock's door by day
  {
    id: 's29-brock-knock',
    lines: [
      N('You knock on the little green door. A long way back in the bank, somebody grumbles, and bolts go back: one, two, three, four.'),
      GB('Daytime. Good. You can come in for ten minutes and get warm. Then I’m busy.', 'think'),
      N('Ten minutes turns into an hour by the red fire. She doesn’t say much, and neither do you, and it suits you both.'),
    ],
  },
];

// ================================================================== flags and checks
/** Every flag this line sets. It reads s4Done and s5Done (and the chapter) but writes no Grove flag except s29Done. */
export const SIDE_STORY_S29_FLAGS: string[] = [
  's29-gift', // bead | ribbon | bell (s29-lessons): picks the step 12 and step 13 done scenes
  's29-wayfarer', // held | sat | pencil (s29-packing): picks the complete scene
  's29Done',
];

export const SIDE_STORY_S29_CHECKS: string[] = [
  'carry:s29-boat:stream',
  'explore:s29-river:backwater',
  'collect:s29-picnic:river',
  'give:s29-portly:gift',
  'find:s29-dusty:wild-wood',
  'find:s29-brock-door:wild-wood',
  'walk:s29-culvert:fields',
  'minigame:s29-rowing:weir',
  'talk:marina:s29-dusk-path',
  'collect:s29-kindling:cliff-house',
  'watch:s29-old-otter:ford',
  'minigame:s29-rowing:night',
  'deliver:s29-portly:ford',
  'find:marina:s29-boathouse',
  'carry:s29-boat:willows',
];
