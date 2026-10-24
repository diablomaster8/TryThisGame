/**
 * Atlas campaign, page A17: The Camphor Tree (Part M, rank 11). Sixteen quests, A17-1 to A17-16.
 *
 * SOURCE. My Neighbor Totoro (Tonari no Totoro), written and directed by Hayao Miyazaki, Studio
 * Ghibli, 1988. Rights: Studio Ghibli holds the film, its story, its characters and its designs,
 * and the name of the great spirit is its trade mark. THIS PAGE CANNOT SHIP WITHOUT A LICENCE
 * FROM STUDIO GHIBLI. The great spirit, the two small spirits, the Catbus and the soot sprites are
 * Ghibli's designs: they must look exactly as licensed, or not appear at all. There are no Grove
 * versions of them, and none of them ever leaves this page. The spirit's name is not used anywhere
 * on the page (see the A17-6 notes); add it only if the licence allows. English dubs: Streamline
 * (1989) and Disney (2005). Nothing from either dub's script is used (see LIFTED TEXT).
 *
 * AUDIENCE. 'all', gentle throughout. No lifted line is used, so no `childLines` are needed.
 *
 * FRAME. Nova's atlas falls open at a country road in summer: a bus stop, rice fields, and an
 * enormous tree on a hill. You and your Nubbin lodge for the summer with Granny, next door to the
 * old house, and help in her field and across the hedge. Kanta is her grandson. Satsuki and Mei
 * Kusakabe keep their story; you carry boxes, hold lanterns, wait in corridors and look for Mei.
 * Your Nubbin is about Mei's size and age of heart, follows her everywhere, and sees the spirits
 * before you do. Nobody in this world talks who doesn't in the film: the spirits and the Catbus
 * never speak, and your Nubbin never speaks.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - s1Done (S1, The Wardens' Walk; it gave you Moss's acorn charm). Read once, when A17-11's
 *     second step begins. With s1Done, A17_VARIANTS a17-11-dance-charm and a17-11-complete-oak
 *     replace a17-11-dance and a17-11-complete: your Nubbin digs a hole by the girls' seed bed and
 *     you plant the charm's acorn there, and the complete scene sets a17-tree = oak. Without it,
 *     the spirits leave a camphor seed on your windowsill and a17-tree = camphor.
 *   - The campaign ending id (CampaignState.ending), only to tell `moss-sleeps` from the rest, for
 *     the Grove keepsake scene: a17-grove-oak (Moss looks up at the oak) or a17-grove-oak-sleeps
 *     (the oak stands over his flower by the flat stone). Nothing else reads it.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a17-):
 *   - a17-01 … a17-16: each quest on completion. a17-done: the whole page (A17-16); the Long
 *     Table festival reads it through atlasDone('A17').
 *   - a17-tunnel = hunt | wait (A17-6, a17-06-greet): the signature choice. hunt plays the
 *     *-hunt variants in A17-9, A17-14, A17-15 and A17-16; wait plays the scenes as written.
 *   - a17-tree = oak | camphor (A17-11 complete): which keepsake stands in the Grove.
 *
 * LIFTED TEXT: none. Part M lists two one-sentence lines from the Disney 2005 English dub (Granny
 * on the soot sprites, A17-2; the father on meeting the spirit, A17-6), both marked [unverified]
 * against the licensed track. Following the house rule for [unverified] text, neither is quoted:
 * each beat is told in our own words (a17-02-granny#6, a17-06-found#9). If both are checked
 * against the licensed Disney 2005 track, they may be swapped in verbatim, at most three in all,
 * and each then needs a `childLines` entry. No song lyrics; the film's songs are not used at all,
 * not even hummed; the music in A17-11 is described, never given. Moss's line in a17-grove-oak is
 * the outline's own, original.
 *
 * CARE NOTES.
 *   - The mother's illness is never named. She is always tired, kind and getting better on screen.
 *     The telegram (A17-12) is a delay, not a danger; the last word on her is "only a cold".
 *   - Mei lost (A17-13): the fear is kept short. Satsuki says the sandal isn't Mei's within three
 *     lines of it being found, and A17-14 starts at once.
 *   - Japanese settings and customs (Part M asks for Japanese advisers on the shrine, the
 *     statues, the house and the family before ship; this script is written to be checked by them):
 *       - The roadside statues are Jizo, Buddhist guardians of children and travellers. They wear
 *         their red bibs, as in the film. Nobody climbs on them, nobody jokes about them, and your
 *         Nubbin never plays on a shrine. Satsuki asks the Jizo at the little shrine if they may
 *         shelter; you bow too, in narration, and it is never a choice or a mechanic.
 *       - The camphor tree wears a shimenawa rope, as sacred trees do at Shinto shrines. The
 *         father's bow and thank-you to the tree are shown as the film shows them. You stand behind
 *         the family; the player is never asked to perform a rite, and no reward or check hangs on
 *         one (A17-6's check is the visit up the hill, not the bow).
 *       - The family's shared bath is ordinary; the camera shows only steam and faces above the
 *         water, and you and your Nubbin are in the next room.
 *       - Shoes off at the step, sliding doors, rain shutters, sitting on the floor, the hand pump
 *         and the bathhouse are everyday life, never quaint and never explained as strange.
 *       - Onee-chan (big sister) is what Mei calls Satsuki. Obaa-chan (granny) is what the
 *         children call Granny, who is not their grandmother: it is used for any older woman you
 *         are fond of. Kanta calls her Gran, because she is his.
 *       - The countryside is the 1950s, kept to one time: rice fields, a hand pump, a country
 *         bus, telegrams, one telephone at the big house, bicycles, a three-wheeled lorry. No
 *         samurai, temples, cherry blossom or anything from another era.
 *   - Hazel's third rule is acted (the bus stop, the seed bed, Satsuki's crying) and never quoted.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Nova’s atlas: the Camphor Tree page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const FILM = 'My Neighbor Totoro (Studio Ghibli, 1988)';

// ------------------------------------------------------------------ speakers

const SATSUKI = sp('a17-satsuki', 'Satsuki', `Satsuki Kusakabe, the elder sister, about eleven (${FILM}); licensed design`);
const MEI = sp('a17-mei', 'Mei', `Mei Kusakabe, the younger sister, four (${FILM}); licensed design`);
const FATHER = sp('a17-father', 'Mr Kusakabe', `Tatsuo Kusakabe, the girls’ father, a university lecturer (${FILM}); licensed design`);
const MOTHER = sp('a17-mother', 'Mrs Kusakabe', `Yasuko Kusakabe, the girls’ mother, in hospital (${FILM}); licensed design`);
const GRANNY = sp('a17-granny', 'Granny', `Granny, the Kusakabes’ elderly neighbour (${FILM}); licensed design`);
const KANTA = sp('a17-kanta', 'Kanta', `Kanta Ōgaki, Granny’s grandson, about eleven (${FILM}); licensed design`);

const N = say('narrator');
const Y = say('you');
const SA = say('a17-satsuki');
const ME = say('a17-mei');
const FA = say('a17-father');
const MO = say('a17-mother');
const GR = say('a17-granny');
const KA = say('a17-kanta');
const M = say('moss');

// =================================================================== THE CAMPHOR TREE

export const ATLAS_A17: Quest[] = [
  // ---------------------------------------------------------------- A17-1
  {
    id: 'a17-01',
    code: 'A17-1',
    title: 'The Old House',
    source: `${FILM}: the move to the country`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [GRANNY, KANTA, SATSUKI, MEI, FATHER],
    steps: [
      {
        id: 'a17-01-s1',
        goal: 'Step into the summer page and find Granny at the bus stop.',
        hint: 'Touch the page, then walk down the country road to the bus stop.',
        check: 'explore:a17-road:bus-stop',
        scene: {
          id: 'a17-01-road',
          lines: [
            N('Nova’s atlas falls open at a country road in summer. There is a bus stop, green rice fields, and a tree on a hill.'),
            N('The tree is drawn so big that it runs off the top of the page.'),
            N('Then the page is warm under your hand, and it hums. It is cicadas, thousands of them, and you are standing in the road.'),
            N('An old woman is waiting at the bus stop with a cloth bundle and a straw hat. She looks you up and down, and your Nubbin too.'),
            GR('You’ll be the one who’s stopping with me for the summer. Good. There’s plenty to do.'),
            GR('And that’s your little one, is it? It can sleep in the kitchen. It looks like it eats.'),
            N('A boy in a vest is sitting on the fence behind her, pretending not to look at you. He is looking at you.'),
            GR('That’s Kanta. My grandson. Say hello, Kanta.'),
            KA('…lo.'),
            N('Down the road comes a small three-wheeled lorry, piled with furniture. Two girls are in the back, waving at everything.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Wave back.',
              then: [N('You wave. The smaller girl waves with both arms, so hard she nearly falls out, and the bigger one grabs her dress.')],
            },
            {
              id: 'ask',
              label: 'Ask Granny who they are.',
              then: [GR('The new family for the old house. A professor and his two girls. Their mother’s in the hospital over the hill.')],
            },
            {
              id: 'kanta',
              label: 'Ask Kanta who they are.',
              then: [KA('Dunno.'), N('He knows. He watches the lorry all the way to the turning, and goes red when you notice.')],
            },
          ],
        },
        done: {
          id: 'a17-01-road-done',
          lines: [
            GR('Go on, then. They’ll want hands for all that. I’ll have supper on.'),
            N('Your Nubbin is already trotting after the lorry, in the dust.'),
          ],
        },
      },
      {
        id: 'a17-01-s2',
        goal: 'Help the Kusakabes unload the lorry at the old house.',
        hint: 'Carry the boxes from the lorry to the step, and take your boots off before you go in.',
        check: 'carry:a17-boxes:old-house',
        scene: {
          id: 'a17-01-unload',
          lines: [
            N('The old house sits back from the road behind a hedge: a wooden house, a little tall, with a porch at one side.'),
            N('A man in round glasses is lifting a chest off the lorry. He gives you the other end of it as if he’d been expecting you.'),
            FA('Oh, hello! Are you from next door? Wonderful. Mind the step, it bites.'),
            N('At the step everybody slips their shoes off and lines them up, and so do you. Your Nubbin has no shoes, but it waits anyway.'),
            N('Inside it smells of dust and old wood. The girls run from room to room, sliding every door open as they go.'),
            SA('Mei! The porch post is rotten! Look, it wobbles!', 'happy'),
            ME('It’s rotten! It’s going to fall down!', 'happy'),
            N('They push the post together, shrieking, and then run off, because that is the best thing to do with a rotten post.'),
            N('Something drops off the porch roof and bounces at your feet: an acorn. Then another, from nowhere.'),
            ME('Acorns! Onee-chan, there are acorns!'),
            N('There are no oaks anywhere near the house. Your Nubbin looks up at the roof, and keeps looking.'),
          ],
          choices: [
            {
              id: 'pocket',
              label: 'Put the acorn in your pocket.',
              then: [N('It sits in your pocket all afternoon, small and smooth. Every so often you check it’s still there.')],
            },
            {
              id: 'mei',
              label: 'Give it to Mei.',
              then: [ME('Thank you! Now I’ve got two.', 'happy'), N('She puts both in her pocket and looks up at the roof, the same way your Nubbin does.')],
            },
            {
              id: 'leave',
              label: 'Leave it where it fell.',
              then: [N('You leave it on the step. When you come back with the next box, it’s gone.')],
            },
          ],
        },
        done: {
          id: 'a17-01-unload-done',
          lines: [
            FA('That’s the last of it. Thank you. Now, Satsuki, Mei, which of you wants to find the well?'),
            N('Both of them do, at once, and so does your Nubbin.'),
          ],
        },
      },
      {
        id: 'a17-01-s3',
        goal: 'Look at the great tree on the hill with the family.',
        hint: 'Stand in the back garden and look up the hill behind the house.',
        check: 'watch:a17-camphor:hill',
        scene: {
          id: 'a17-01-tree',
          lines: [
            N('Behind the house the ground rises into woods, and out of the woods rises the tree.'),
            N('It is the biggest thing you have ever seen. Not the biggest tree: the biggest thing.'),
            SA('Dad, what kind of tree is that?'),
            FA('A camphor. Kusunoki. It must be very old. Older than the house, older than the village, I should think.'),
            ME('It’s the biggest in the world.'),
            FA('Very possibly, Mei.'),
            N('The wind comes down the hill, and the whole tree moves at once, slowly, like something breathing.'),
            N('Your Nubbin sits down in the grass and looks at it with its mouth a little open.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a17-01-complete',
      lines: [
        N('At dusk you go back through the gap in the hedge to Granny’s, and take your boots off at her step.'),
        N('Supper is rice, pickles and a fish each, and the cicadas stop all at once when the frogs start.'),
        GR('The old house has stood empty a long while. It’ll be glad of children.'),
        N('Across the hedge, a window is lit in the old house. Your Nubbin watches the dark one above it, at the top of the stairs.'),
      ],
    },
    rewards: [],
    sets: { 'a17-01': true },
    notes:
      'OPENING: the atlas page is a painted summer landscape that comes alive with the sound of cicadas (fade in over two ' +
      'seconds). All characters and the house use the licensed designs; Granny’s house next door is ours to draw, in the ' +
      'same style. SHOES: everyone takes their shoes off at the step (genkan) of both houses, every time, without comment; ' +
      'the player does it automatically, it is not a mechanic. The lorry is a 1950s three-wheeler. The acorns are the ' +
      'small spirits’ doing (A17-5): nobody says so.',
  },

  // ---------------------------------------------------------------- A17-2
  {
    id: 'a17-02',
    code: 'A17-2',
    title: 'Soot Sprites',
    source: `${FILM}: the soot sprites in the old house`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-1') },
    requires: ['A17-1'],
    speakers: [SATSUKI, MEI, GRANNY, KANTA],
    steps: [
      {
        id: 'a17-02-s1',
        goal: 'Find the stairs up to the dark room at the top of the house.',
        hint: 'The stairs are behind a plain door in the kitchen. Take a lantern up.',
        check: 'find:a17-stairs:old-house',
        scene: {
          id: 'a17-02-stairs',
          lines: [
            SA('There’s a window up top, but we can’t find any stairs. Will you help us look?'),
            N('They aren’t in the hall, or behind any of the sliding doors. Your Nubbin finds them: behind a plain wooden door in the kitchen.'),
            N('They are steep and narrow, and at the top there is only dark.'),
            ME('You go first, Onee-chan.'),
            SA('No, you.'),
            N('In the end they go up together, side by side, which the stairs are not wide enough for. You follow with the lantern.'),
            N('At the top something rustles. Dozens of small black things scatter from the light, like soot with somewhere to be.'),
            N('They pour into the cracks in the boards, and are gone. Your Nubbin saw them before the lantern did.'),
            ME('I’ll catch one!'),
          ],
          choices: [
            {
              id: 'lantern',
              label: 'Hold the lantern high, so she can see.',
              then: [N('You lift the lantern. Mei slaps both hands flat on the boards, very pleased with herself, and holds them up.')],
            },
            {
              id: 'still',
              label: 'Sit still on the top stair and wait.',
              then: [
                N('You sit down on the top stair, and the room goes quiet. After a while, one small black thing peeps out of a crack.'),
                N('Mei pounces. She holds her hands up, very pleased with herself.'),
              ],
            },
          ],
        },
        done: {
          id: 'a17-02-stairs-done',
          lines: [
            N('Her hands are empty. Her palms are black, as if she had patted a stove.'),
            ME('I got one! It got away. Look, I’ve got its black on me!', 'happy'),
            SA('Mei, your feet are black too!'),
          ],
        },
      },
      {
        id: 'a17-02-s2',
        goal: 'Ask Granny what the black things are.',
        hint: 'Granny has come over to help clean. Find her on the porch with the rags.',
        check: 'talk:a17-granny:old-house',
        scene: {
          id: 'a17-02-granny',
          lines: [
            N('Granny has come over with rags and a bucket, to help the family clean. Mei shows her the black hands and the black feet.'),
            ME('Obaa-chan, there are black things in our house! Little round ones! They ran away!'),
            GR('Soot sprites, were they? Well I never. I saw them myself, when I was your age.'),
            SA('Really? Are they bad?', 'shock'),
            GR('Bad? No. They live in empty houses. They get into the dust and the dark, and they like it quiet.'),
            GR('When people come back to a house, they move on. Quietly, one night, and nobody sees them go.'),
            GR('So you laugh a lot, and live here properly, and they’ll take the hint. They don’t care for a cheerful house.'),
            ME('I’ll laugh. I’m very good at it.'),
            N('A face appears over the hedge: Kanta, with a basket his mother has sent. He holds it out without coming any closer.'),
            KA('Your house is haunted!'),
            N('He drops the basket on the step and runs, as fast as he can go.'),
          ],
          choices: [
            {
              id: 'call',
              label: 'Call after him: “Thank you for the basket!”',
              then: [N('Kanta runs faster. Granny shakes her head at the hedge.'), GR('He has manners. He keeps them somewhere safe.')],
            },
            {
              id: 'laugh',
              label: 'Laugh. It’s a lovely haunted house.',
              then: [SA('It is, isn’t it? I always wanted to live in a haunted house.', 'happy'), ME('Me too! I wanted it first!')],
            },
            {
              id: 'quiet',
              label: 'Say nothing and pick up the basket.',
              then: [N('Under the cloth there are rice cakes, still warm. Granny looks at them and sighs.'), GR('His mother sent those. He’ll have eaten one.')],
            },
          ],
        },
        done: {
          id: 'a17-02-granny-done',
          lines: [
            GR('Now. Rags. That floor won’t clean itself, and the sprites won’t do it either.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a17-02-complete',
      lines: [
        N('You all clean until dusk. The girls run the rags down the long boards in a race, bottoms in the air.'),
        N('Your Nubbin rinses the rags in the bucket by the hand pump, mostly by sitting in it.'),
        N('Every so often, in a corner, something small and black watches you all. Nobody minds any more.'),
        GR('There. A house with its windows open. That’s more like it.'),
      ],
    },
    rewards: [],
    sets: { 'a17-02': true },
    notes:
      'LIFTED TEXT: none. Part M lists Granny’s line on the soot sprites from the Disney 2005 dub, marked [unverified]; ' +
      'a17-02-granny#6 tells the beat in our own words. If the line is verified against the licensed track it may replace ' +
      '#6, and then needs a childLines entry. Kanta’s mother is not seen; the basket is rice cakes (ohagi), any simple ' +
      'drawing. The soot sprites use the licensed design and never come closer than a lantern’s length.',
  },

  // ---------------------------------------------------------------- A17-3
  {
    id: 'a17-03',
    code: 'A17-3',
    title: 'The Bath in the Storm',
    source: `${FILM}: the windy night and the bath`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-2') },
    requires: ['A17-2'],
    speakers: [FATHER, SATSUKI, MEI, GRANNY],
    steps: [
      {
        id: 'a17-03-s1',
        goal: 'Help the family slide the rain shutters shut before the storm.',
        hint: 'Granny sent you over. Pull each wooden shutter along its groove until the house is closed.',
        check: 'carry:a17-shutters:old-house',
        scene: {
          id: 'a17-03-shutters',
          lines: [
            N('In the evening the wind gets up. The rice fields go silver, then dark, as the gusts run across them.'),
            GR('Go and help them with the shutters. A professor won’t know which way they slide.'),
            N('At the old house, Mr Kusakabe is pulling at a rain shutter that is stuck halfway along its groove.'),
            FA('Ah! Reinforcements. I think it slides. I think it slides this way. Or possibly the other.'),
            N('You lift it a little and it runs, rattling, all the way along. Then the next one, and the next, until the house is shut.'),
            N('The wind finds every gap anyway. The boards creak, and the house leans and groans like a ship.'),
            ME('Dad, the house is going to fall down.', 'sad'),
            FA('It’s only stretching, Mei. Old houses do. It’s been sitting still for a long time.'),
          ],
        },
        done: {
          id: 'a17-03-shutters-done',
          lines: [
            FA('Stay till the wind drops. Granny won’t mind. The bath’s nearly hot, and we’ve got plenty of tea.'),
            N('Your Nubbin sits by the stove in the kitchen and watches the shutters jump.'),
          ],
        },
      },
      {
        id: 'a17-03-s2',
        goal: 'Wait in the main room while the family has their bath.',
        hint: 'Sit by the low table. When Mr Kusakabe calls out, join in.',
        check: 'wait:a17-bath:main-room',
        scene: {
          id: 'a17-03-bath',
          lines: [
            N('The family take their bath together in the bathhouse at the back, father and both girls in one deep wooden tub.'),
            N('You wait in the main room with your Nubbin, by the low table. Steam drifts under the door.'),
            N('A gust hits the house. Something bangs outside, and the lamp swings on its cord.'),
            ME('Dad! Dad, I heard something!', 'shock'),
            SA('So did I. Is it the black things? Are they coming back?', 'shock'),
            FA('Shall I tell you the best thing to do when you’re frightened?', 'think'),
            FA('Laugh. As loud as you can. Then anything that’s listening will think we’re far too jolly to bother with.'),
            FA('You too, out there! Everybody laugh!'),
            N('From the bathhouse comes the biggest, silliest laugh you have ever heard from a grown man, and then two small ones.'),
          ],
          choices: [
            {
              id: 'loud',
              label: 'Laugh as loud as you can.',
              then: [N('You laugh as loud as you can. It sounds ridiculous, which makes you laugh properly.')],
            },
            {
              id: 'nubbin',
              label: 'Tickle your Nubbin until it squeaks.',
              then: [N('Your Nubbin squeaks and rolls, and you laugh at it, and from the bathhouse three people laugh at you laughing.')],
            },
            {
              id: 'honk',
              label: 'Try to laugh and produce a honk.',
              then: [N('What comes out is a honk. There is a silence in the bathhouse.'), ME('Do it again!', 'happy')],
            },
          ],
        },
        done: {
          id: 'a17-03-bath-done',
          lines: [
            N('The wind blows on. Inside, nobody seems to mind it any more.'),
            N('Mei comes out pink and steaming, wrapped in a towel, and falls asleep on the floor before anybody can stop her.'),
          ],
        },
      },
      {
        id: 'a17-03-s3',
        goal: 'Watch from Granny’s step when the wind drops.',
        hint: 'Go home through the hedge, then sit on Granny’s step and look at the hill.',
        check: 'watch:a17-sprites:camphor',
        scene: {
          id: 'a17-03-moon',
          lines: [
            N('By the time you go home, the wind has blown itself out. The moon is up, and the fields are wet and shining.'),
            N('You sit on Granny’s step to take your boots off, and don’t get round to it.'),
            N('Your Nubbin is looking at the old house. At the dark window at the top of the stairs.'),
            N('Out of the eaves, something is drifting. A thread of black, thin as smoke, and then more.'),
            N('A whole cloud of soot sprites rises over the roof in the moonlight, and floats away up the hill to the camphor tree.'),
            N('In the old house, a window slides open. A small face looks out, then a bigger one beside it.'),
            N('Satsuki sees you on the step. She doesn’t call out; she just lifts her hand.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Lift your hand back.',
              then: [N('You lift your hand. Across the hedge, in the moonlight, two people who have seen the same thing agree to say nothing.')],
            },
            {
              id: 'point',
              label: 'Point up the hill, at the tree.',
              then: [N('You point at the tree. Satsuki nods, very seriously, as if you have both signed something.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-03-complete',
      lines: [
        N('The last of the soot sprites goes into the dark of the tree. The house below is just a house with children in it.'),
        GR('Still up? They’ve gone, have they? Good. They’ll find another empty place. There’s always one.', 'soft'),
        N('She brings you a cup of barley tea, and sits on the step with you a while without saying anything.'),
      ],
    },
    rewards: [],
    sets: { 'a17-03': true },
    notes:
      'THE BATH (care note): a shared family bath is ordinary in Japan. If the bathhouse is shown at all, show only steam and ' +
      'faces above the water, as the film does. The Keeper and Nubbin stay in the main room for the whole scene; the ' +
      'laughing is heard through the wall. The father’s laughing scene is told in our own words (Part M). Rain shutters ' +
      '(amado) slide in grooves along the outside of the veranda; the check is complete when all are shut. Barley tea ' +
      '(mugicha) is the ordinary summer drink.',
  },

  // ---------------------------------------------------------------- A17-4
  {
    id: 'a17-04',
    code: 'A17-4',
    title: 'The Hospital',
    source: `${FILM}: the visit to Shichikokuyama Hospital`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-3') },
    requires: ['A17-3'],
    speakers: [FATHER, SATSUKI, MEI, MOTHER],
    steps: [
      {
        id: 'a17-04-s1',
        goal: 'Cycle with the family to Shichikokuyama Hospital.',
        hint: 'Borrow Granny’s bicycle and follow Mr Kusakabe along the road past the fields.',
        check: 'escort:a17-bikes:hospital',
        scene: {
          id: 'a17-04-ride',
          lines: [
            FA('We’re visiting their mother today. Would you like to come? It’s all downhill on the way there. We don’t talk about the way back.'),
            N('Granny lends you her bicycle, which is black and heavy and squeaks on every turn of the pedals.'),
            N('Mr Kusakabe rides in front, with Mei on a little seat on the handlebars and Satsuki on the carrier behind.'),
            N('Your Nubbin rides in your basket, ears flat in the wind.'),
            N('The road runs between the rice fields, past a pond, and over the hill. Everywhere there are frogs.'),
            ME('Faster, Dad! Faster than the Keeper!', 'happy'),
          ],
          choices: [
            {
              id: 'race',
              label: 'Race them to the top of the hill.',
              then: [
                N('You stand on the pedals, and Mr Kusakabe stands on his. Both bicycles squeak like geese.'),
                N('He wins, by a wheel, and then has to sit at the top getting his breath back for quite a long time.'),
                FA('Downhill. I did say downhill.'),
                N('He says it lying on the verge, to the sky.'),
              ],
            },
            {
              id: 'slow',
              label: 'Ride slowly and let them win.',
              then: [N('You let them win. Mei shouts back at you all the way down the other side, and your Nubbin waves at her from the basket.')],
            },
          ],
        },
        done: {
          id: 'a17-04-ride-done',
          lines: [
            N('Shichikokuyama Hospital is a long white building among pine trees, very quiet, with all its windows open.'),
            SA('This is it. Mum’s window is the third one along. Mei, walk, don’t run.'),
            N('Mei runs.'),
          ],
        },
      },
      {
        id: 'a17-04-s2',
        goal: 'Go in with the family to see Mrs Kusakabe.',
        hint: 'Follow them down the long corridor to the room at the end.',
        check: 'visit:a17-mother:hospital',
        scene: {
          id: 'a17-04-room',
          lines: [
            N('Mrs Kusakabe is sitting up in bed by the open window. She is pale and tired, and her face is very kind.'),
            ME('Mum!', 'happy'),
            MO('Mei! And Satsuki. Come here, both of you. Let me see you.', 'happy'),
            N('Mei climbs straight on to the bed. Satsuki stands beside it, very upright, until her mother holds out her other arm.'),
            MO('And who is this?'),
            SA('This is the Keeper. From next door, at Granny’s. That’s their Nubbin. It follows Mei everywhere.'),
            MO('Thank you for looking after my girls. Somebody has to, while their father’s reading.', 'happy'),
            FA('I heard that.'),
            MO('The doctor says I’m getting better. Soon I can come home for a weekend, and see this famous haunted house.'),
            ME('There were soot sprites but they went away! And there’s a great big tree!'),
          ],
        },
        done: {
          id: 'a17-04-room-done',
          lines: [
            MO('A whole weekend. Then a bit longer, and then for good.', 'soft'),
            N('Your Nubbin has put its chin on the edge of the bed. Mrs Kusakabe strokes its head without looking, the way mothers do.'),
          ],
        },
      },
      {
        id: 'a17-04-s3',
        goal: 'Wait in the corridor so the family can have a moment together.',
        hint: 'Sit on the bench outside the door. They’ll come out when they’re ready.',
        check: 'wait:a17-corridor:hospital',
        scene: {
          id: 'a17-04-corridor',
          lines: [
            N('You go out into the corridor and sit on the bench, with your Nubbin on your knee. The door stays a little open.'),
            N('Through it you can see the window, the pines, and Mrs Kusakabe brushing Satsuki’s hair, slowly, all the way down.'),
            MO('You’ve been looking after everybody, haven’t you. Mei, and your father, and the house.', 'soft'),
            SA('Somebody has to.'),
            MO('I know. But you can stop sometimes, when I’m home. I’ll take a turn.', 'soft'),
            N('Satsuki doesn’t say anything. She leans back into the brush, with her eyes shut.'),
            N('A nurse goes by with a tray, and smiles at your Nubbin, and doesn’t ask.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Keep waiting. There’s no hurry.',
              then: [N('You wait. The corridor is cool and smells of soap, and somewhere a clock ticks: a good place to wait.')],
            },
            {
              id: 'door',
              label: 'Get up and pull the door gently to.',
              then: [N('You pull the door gently to, so it is theirs. Through the wood you hear Mei laugh, and then all three of them.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-04-complete',
      lines: [
        N('On the way home it is uphill, as promised. Everybody walks the bicycles, and nobody minds.'),
        N('Mei falls asleep on the handlebar seat, and her father walks the whole way with one hand on her back.'),
        SA('She looked better than last time. Didn’t she? She looked better.'),
        FA('She did. Much better.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a17-04': true },
    notes:
      'CARE NOTE: the mother’s illness is never named here or anywhere on the page. She is tired, kind and getting better. ' +
      'The weekend visit home is set up here (a17-04-room#8) and called off in A17-12. Shichikokuyama Hospital is a quiet ' +
      'hospital among pines; no medical equipment beyond a bed, a window and a nurse with a tray. The Keeper waits in the ' +
      'corridor for the hair-brushing; the camera stays outside the door.',
  },

  // ---------------------------------------------------------------- A17-5
  {
    id: 'a17-05',
    code: 'A17-5',
    title: 'The Small Ones',
    source: `${FILM}: Mei and the two small spirits`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-4') },
    requires: ['A17-4'],
    speakers: [MEI, FATHER],
    steps: [
      {
        id: 'a17-05-s1',
        goal: 'Keep an eye on Mei in the garden while her father works.',
        hint: 'Sit at the edge of the garden. Mei will find something before you do.',
        check: 'watch:a17-mei:garden',
        scene: {
          id: 'a17-05-garden',
          lines: [
            N('Satsuki is at school. Mr Kusakabe is at his desk in the room that opens on the garden, surrounded by books.'),
            FA('Would you keep half an eye on Mei? I’m only in here. She’s no trouble. Mostly.'),
            N('Mei is playing in the long grass with a tin bucket, picking up acorns. Your Nubbin is picking them up too, and giving them to her.'),
            N('Then your Nubbin stops dead, with an acorn in its mouth. It is looking at the grass under the house.'),
            N('Something small and white is walking through the grass. It is about the size of a cat, and you can see the grass through it.'),
            ME('Oh!'),
            N('Behind it comes a second one, bigger, and blue. It has a little sack over its shoulder, and acorns are dribbling out of a hole.'),
            N('Your Nubbin is already following them, in the same careful way they walk.'),
            ME('Wait! Wait for me!'),
          ],
          choices: [
            {
              id: 'call',
              label: 'Call to Mr Kusakabe.',
              then: [
                Y('Mr Kusakabe? Mei’s… following something.'),
                FA('Is she? Good for her. Don’t let her go out of the garden.', 'happy'),
                N('He doesn’t look up. Mei is already at the end of the garden.'),
              ],
            },
            {
              id: 'follow',
              label: 'Follow quietly. Don’t frighten them.',
              then: [N('You follow on tiptoe. The small ones look back, see Mei and your Nubbin, and walk a little faster.')],
            },
          ],
        },
        done: {
          id: 'a17-05-garden-done',
          lines: [
            N('The two small ones duck under the house and out the other side, into the hedge at the back of the garden.'),
            ME('They went in there! There’s a tunnel!'),
          ],
        },
      },
      {
        id: 'a17-05-s2',
        goal: 'Crawl after Mei and your Nubbin through the tunnel in the hedge.',
        hint: 'Get down on your elbows and go in after them. Don’t lose sight of Mei’s hat.',
        check: 'explore:a17-hedge:tunnel',
        scene: {
          id: 'a17-05-hedge',
          lines: [
            N('There is a gap low in the hedge, round as a doorway. Inside it is a green tunnel, roofed with leaves.'),
            N('Mei goes in on her hands and knees without stopping to think. Your Nubbin goes in after her, and you after it.'),
            N('It is a tunnel made for someone Mei’s size. You go on your elbows, with twigs in your hair.'),
            N('The light is green and gold. Somewhere ahead, acorns drop one by one, and Mei picks every one of them up.'),
            ME('Little one! Big little one! Where are you going?'),
            N('The tunnel bends, and bends again. It goes on far longer than the hedge ever could.'),
            N('Then Mei’s yellow hat bobs out of the far end into sunlight, and she is gone.'),
          ],
          choices: [
            {
              id: 'hurry',
              label: 'Hurry after her.',
              then: [N('You hurry. The tunnel seems to stretch to make room for you, then squeezes you out on to soft moss.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin lead.',
              then: [N('You follow your Nubbin’s tail, which knows the way better than you. It brings you out on to soft moss.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-05-complete',
      lines: [
        N('You are in a wood. It is very old and very quiet, and the light comes down in long slanting columns.'),
        N('In front of you there is a tree root as wide as a road, and above it the camphor tree goes up and up, out of sight.'),
        N('Mei’s hat is lying on the moss. Mei is not in it.'),
      ],
    },
    rewards: [],
    sets: { 'a17-05': true },
    notes:
      'The two small spirits use the licensed designs: one small and white, half see-through; one a little bigger and blue, ' +
      'with a sack of acorns. They never speak and never come within reach of the Keeper. Your Nubbin follows them on its own; ' +
      'the player follows it. The hedge tunnel is a green tunnel just big enough for Mei; the Keeper crawls on elbows. It is ' +
      'longer inside than the hedge is wide. This tunnel is the one A17-6’s choice is about.',
  },

  // ---------------------------------------------------------------- A17-6
  {
    id: 'a17-06',
    code: 'A17-6',
    title: 'The Camphor Tree',
    source: `${FILM}: Mei meets the great spirit`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Straight after A17-5, from Nova’s atlas.' },
    requires: ['A17-5'],
    speakers: [MEI, SATSUKI, FATHER, GRANNY],
    steps: [
      {
        id: 'a17-06-s1',
        goal: 'Find Mei in the hollow under the camphor tree.',
        hint: 'Look round the roots for a way in. Your Nubbin will find it first.',
        check: 'find:a17-hollow:camphor',
        scene: {
          id: 'a17-06-hollow',
          lines: [
            N('Your Nubbin finds the hole: a gap between two roots, big enough for a small girl who wasn’t looking where she was going.'),
            N('You slide down after it, into a hollow under the tree. It is warm, and dim, and smells of earth and leaves.'),
            N('Something is breathing. Something very large.'),
            N('A great grey-and-white shape is asleep in the hollow, bigger than Granny’s house. Its ears twitch in its sleep.'),
            N('And on top of it, on its round white stomach, Mei is lying on her front with her chin in her hands.'),
            ME('Shh. He’s asleep. He told me his name. It goes rrrrOOOOMMMmmm.', 'happy'),
            ME('I’m going to practise.'),
            N('She practises. The great spirit, asleep, rumbles back, much better.'),
            N('The great spirit opens his mouth in a yawn like a gate swinging open. Mei laughs, and he closes it again, and sleeps on.'),
            N('Your Nubbin climbs up his side, very carefully, and curls up next to Mei. The stomach rises and falls under both of them.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit at the edge of the hollow and watch.',
              then: [N('You sit on a root and watch them breathe, all three. The hollow is very warm, and your eyes close for just a moment.')],
            },
            {
              id: 'touch',
              label: 'Reach out and touch his fur.',
              then: [
                N('His fur is like warm grass after a long summer. He doesn’t wake, but makes a small noise, like a big drum touched softly.'),
                N('You sit down beside him. It is very warm in the hollow, and your eyes close for just a moment.'),
              ],
            },
          ],
        },
        done: {
          id: 'a17-06-hollow-done',
          lines: [
            N('When you open your eyes, you are lying on moss in a small clearing in the bamboo, with Mei asleep beside you.'),
            N('There is no hollow and no tree root. Your Nubbin is sitting up, looking all round, with leaves on its back.'),
          ],
        },
      },
      {
        id: 'a17-06-s2',
        goal: 'Help Satsuki and her father look for the way Mei went.',
        hint: 'Go back to the hedge with the family and let Mei show you.',
        check: 'talk:a17-satsuki:clearing',
        scene: {
          id: 'a17-06-found',
          lines: [
            SA('Mei! Mei! There you are! Dad, they’re here!', 'shock'),
            N('Satsuki is home from school, out of breath, with her father behind her. Mei sits up and rubs her eyes.'),
            ME('There was a big one! Bigger than the house! He had a great big mouth and he went like this!'),
            N('She opens her mouth as wide as it goes. Satsuki looks at you, and you look at your Nubbin, which still has leaves on.'),
            ME('He’s this way. Come on, I’ll show you.'),
            N('Mei leads them back to the hedge and crawls in at the gap. She comes out the other side, into the garden.'),
            N('She tries again further along, and again. Every gap goes straight through to the garden, or nowhere at all.'),
            ME('It was here. It was. I’m not lying.', 'sad'),
            N('Mr Kusakabe crouches down in front of her, so he is the right size to talk to her.'),
            FA('I believe you, Mei. I think the one who looks after this wood let you visit him. Not many people are that lucky.', 'soft'),
          ],
        },
        done: {
          id: 'a17-06-found-done',
          lines: [
            FA('And when somebody lets you visit, you go and say thank you. Come on. All of us.'),
          ],
        },
      },
      {
        id: 'a17-06-s3',
        goal: 'Walk up the hill with the family to the camphor tree.',
        hint: 'Follow the path up past the little shrine gate. Stand with the others at the foot of the tree.',
        check: 'visit:a17-camphor:shrine',
        scene: {
          id: 'a17-06-greet',
          lines: [
            N('The path goes up the hill through the wood, past a small stone shrine, to the foot of the camphor tree.'),
            N('Close to, it is too big to see all at once. A thick rope of twisted straw is tied round its trunk, with paper streamers hanging from it.'),
            SA('Dad, why does it have a rope on?'),
            FA('Because it’s a special tree. A very old one, that people have looked after for a very long time.'),
            N('The family stands in a row at the foot of the tree. You stand behind them, with your Nubbin.'),
            N('Mr Kusakabe bows to the tree, and the girls bow with him. He thanks it, out loud, for looking after Mei.'),
            FA('And please go on looking after us, while we live here.'),
            N('Above you the leaves move, all together, though there is no wind. Then the family turns to go home.'),
            N('Behind them, Mei keeps looking back at the hedge at the bottom of the hill.'),
          ],
          choices: [
            {
              id: 'hunt',
              label: 'Go back down to the hedge and hunt for the tunnel.',
              set: { 'a17-tunnel': 'hunt' },
              then: [
                N('You go back down and work along the hedge on your knees, gap by gap. Your Nubbin helps, mostly by sitting in the gaps.'),
                N('By dusk you have scratched arms and leaves in your collar, and every gap goes straight through to the garden.'),
                N('There is no tunnel. There is only a hedge, and it is a perfectly ordinary hedge, and it would like you to know that.'),
              ],
            },
            {
              id: 'wait',
              label: 'Leave it. He’ll be found when he wants to be.',
              set: { 'a17-tunnel': 'wait' },
              then: [
                N('You leave the hedge alone. Mei looks at you, and then she leaves it alone too.'),
                ME('He’ll come when he wants. Won’t he.'),
                N('Your Nubbin sits down facing the hill, as if it has decided to be patient on purpose.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-06-complete',
      lines: [
        N('That night, from Granny’s window, you can see the camphor tree black against the stars.'),
        N('Down in the old house Mei is telling the story again, louder each time. The great spirit gets a little bigger with every telling.'),
        GR('A big one, was it, under the camphor? Hm.', 'think'),
        N('Granny doesn’t say anything else. But she leaves the lamp in the window a little longer than usual.'),
      ],
    },
    rewards: [],
    sets: { 'a17-06': true },
    notes:
      'SIGNATURE CHOICE (a17-06-greet): a17-tunnel = hunt | wait. Pays off in A17-9 (three quests on: the bus stop), ' +
      'A17-14, A17-15 and A17-16. Both options are respectful and neither is wrong; the outcome is how close you get. ' +
      'CARE NOTES: the camphor tree wears a shimenawa (straw rope with white paper streamers, shide), as sacred trees do at ' +
      'Shinto shrines; a small stone shrine stands below it. The father’s bow and thank-you are shown as the film shows them. ' +
      'The Keeper stands behind the family and is not asked to bow or perform any rite; the check is the visit to the foot ' +
      'of the tree, which completes when the scene ends. NAME: Mei says the spirit told her his name, “a big rumbly one”. ' +
      'The name itself is not used on the page; if the licence allows, it may go in a17-06-hollow#5 instead. ' +
      'LIFTED TEXT: none. Part M lists the father’s line from the Disney 2005 dub, [unverified]; a17-06-found#9 tells the ' +
      'beat in our own words. If verified, it may replace #9, and then needs a childLines entry. The great spirit uses the ' +
      'licensed design and never speaks; his yawn is a sound, not a line.',
  },

  // ---------------------------------------------------------------- A17-7
  {
    id: 'a17-07',
    code: 'A17-7',
    title: 'Kanta’s Umbrella',
    source: `${FILM}: sheltering at the roadside shrine`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-6') },
    requires: ['A17-6'],
    speakers: [SATSUKI, MEI, KANTA, GRANNY],
    steps: [
      {
        id: 'a17-07-s1',
        goal: 'Walk home from school with Satsuki and Mei.',
        hint: 'Meet them at the school gate and take the road between the fields.',
        check: 'walk:a17-sisters:school-road',
        scene: {
          id: 'a17-07-rain',
          lines: [
            N('Granny is busy, so you take Mei to meet Satsuki at the school gate. Halfway home the sky goes dark.'),
            N('The rain comes all at once, the way summer rain does. The road turns to running water in a minute.'),
            SA('This way! Quick!'),
            N('By the side of the road there is a tiny wooden shrine, no bigger than a cupboard, with a roof. Inside stands a small stone Jizo.'),
            N('He wears a red bib. Somebody has left him a flower and a rice ball.'),
            N('At the edge of the roof Satsuki stops, and puts her hands together, and bows to him.'),
            SA('Jizo-sama, please may we shelter here a little while, till the rain stops?'),
            N('You bow too, and so does Mei. Then the three of you squeeze in at the very edge of the roof, out of the wet.'),
            N('Your Nubbin sits down on the step at your feet, very still, with its tail tucked in.'),
            N('Then a boy comes splashing up the road under a huge black umbrella: Kanta. He stops dead when he sees you.'),
            N('He stares at Satsuki. Then he shoves the umbrella at her, handle first.'),
            KA('Here.', 'angry'),
            N('He runs off into the rain with nothing over his head, his bag held over it instead. It doesn’t help at all.'),
          ],
        },
        done: {
          id: 'a17-07-rain-done',
          lines: [
            N('The umbrella is old and patched, with a hole near the top. It is the best thing that has happened all day.'),
            ME('Kanta’s house is haunted too.'),
            SA('Mei.'),
          ],
        },
      },
      {
        id: 'a17-07-s2',
        goal: 'Help the sisters give Kanta his umbrella back, without embarrassing him.',
        hint: 'Talk it over on the walk home, then take the umbrella round to Granny’s.',
        check: 'deliver:a17-umbrella:kanta',
        scene: {
          id: 'a17-07-return',
          lines: [
            N('By evening the rain has stopped. The umbrella stands in the Kusakabes’ porch, dried and folded, a little more patched than before.'),
            SA('We have to give it back. But if we take it to him, he’ll go red and run off and it’ll be awful.', 'think'),
            SA('And he got soaked. His mother will have shouted at him. And it was really kind.'),
            ME('I’ll say thank you very loudly.'),
            SA('That’s exactly what we can’t do.'),
            N('Kanta lives at Granny’s, in the room at the back. Through the hedge you can hear him being told off, mildly.'),
            SA('Keeper, you live there. What do we do?'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Put it in Granny’s umbrella stand with a note.',
              then: [
                N('You stand it in Granny’s umbrella stand, with a note tied to the handle in Satsuki’s best writing: Thank you.'),
                N('Next morning the note is gone and the umbrella is too. Kanta doesn’t say anything all day, and walks a bit taller.'),
              ],
            },
            {
              id: 'granny',
              label: 'Give it to Granny to pass on.',
              then: [
                GR('He did, did he? In that rain? The daft thing.', 'happy'),
                N('Granny hands it to Kanta at supper without a word. He looks at it, and then at his rice, and eats a great deal very fast.'),
              ],
            },
            {
              id: 'satsuki',
              label: 'Let Satsuki give it back herself. Just stand nearby.',
              then: [
                N('Satsuki goes round to the back of Granny’s and holds the umbrella out at the door. You stand by the pump, looking at the pump.'),
                SA('Thank you. It was very kind. Here.'),
                KA('S’all right.'),
                N('He goes red, but he doesn’t run. That’s more than anyone expected.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-07-complete',
      lines: [
        N('The next time it rains, the umbrella goes past Granny’s gate on its way to school, with Kanta under it.'),
        N('He holds it a little to one side, as if someone might want to share it. Nobody does, and he holds it to one side anyway.'),
        GR('That boy. He’d give you his own boots and walk home in the snow.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a17-07': true },
    notes:
      'CARE NOTES: the roadside shrine is a small wooden hokora with a stone Jizo inside, wearing a red bib, with a flower ' +
      'and a rice ball left as offerings. Satsuki asks politely if they may shelter, as in the film; you and Mei bow too, ' +
      'in narration. The bow is not a choice, a check or a reward. Your Nubbin sits on the step and does not touch, climb ' +
      'or play on the shrine. No jokes at the shrine. Kanta is Granny’s grandson and lives with her family (his mother is ' +
      'heard, not seen). The umbrella is an old black oiled-paper or cloth umbrella with a patch and a hole.',
  },

  // ---------------------------------------------------------------- A17-8
  {
    id: 'a17-08',
    code: 'A17-8',
    title: 'Granny’s Field',
    source: `${FILM}: picking vegetables with Granny; Satsuki’s letter`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-7') },
    requires: ['A17-7'],
    speakers: [GRANNY, SATSUKI, MEI],
    steps: [
      {
        id: 'a17-08-s1',
        goal: 'Help pick vegetables in Granny’s field for Mrs Kusakabe’s weekend home.',
        hint: 'Pick from the rows by the stream, then cool them in the water.',
        check: 'collect:a17-vegetables:granny-field',
        scene: {
          id: 'a17-08-field',
          lines: [
            N('Granny’s field runs down to the stream: cucumbers, tomatoes, aubergines, and tall corn at the end.'),
            GR('Their mother’s coming home for the weekend. We’ll send her something proper.'),
            GR('Vegetables picked fresh and eaten fresh. There’s nothing better for anyone who’s been poorly.'),
            N('Mei picks a tomato, smells it, and holds it up to you to smell too. It smells of sun.'),
            N('The girls put the cucumbers and tomatoes in the stream to cool, in a basket weighed down with a stone.'),
            N('Your Nubbin sits in the stream with them. Granny doesn’t comment.'),
            N('Mei has gone to the corn. She is pulling at a fat ear with both hands, and it isn’t coming.'),
            ME('This one’s for Mum. Only this one.', 'think'),
          ],
          choices: [
            {
              id: 'corn',
              label: 'Help Mei pull her ear of corn.',
              then: [N('You hold the stalk and Mei pulls. The ear comes off with a snap, and she sits down hard in the dirt, holding it up.'), ME('Got it! For Mum!', 'happy')],
            },
            {
              id: 'cucumber',
              label: 'Pick the straightest cucumber in the row.',
              then: [N('You find the straightest cucumber in the row. Granny inspects it and nods, which from Granny is a medal.')],
            },
            {
              id: 'tomato',
              label: 'Eat a tomato straight off the plant.',
              then: [GR('That’s it. That’s what they’re for.', 'happy'), N('It is warm, and the juice runs down your chin. Mei does the same, and gets it everywhere.')],
            },
          ],
        },
        done: {
          id: 'a17-08-field-done',
          lines: [
            N('Mei carries her ear of corn home in both arms, like a baby. Your Nubbin offers to help.'),
            ME('No. You’ve looked at it twice.'),
            N('Your Nubbin walks home behind her, not looking at the corn, very hard.'),
          ],
        },
      },
      {
        id: 'a17-08-s2',
        goal: 'Read over Satsuki’s letter to her mother.',
        hint: 'Sit with Satsuki at the low table and read her letter through.',
        check: 'inspect:a17-letter:old-house',
        scene: {
          id: 'a17-08-letter',
          lines: [
            N('In the evening Satsuki sits at the low table with a pencil, writing to her mother. She has been at it for an hour.'),
            SA('Will you check it? Not the writing. Just whether it sounds silly. And if I’ve spelled anything wrong.'),
            N('She reads it out in a small, careful voice. The atlas is kind about languages, and you follow every word.'),
            SA('Dear Mother. Mei has met a spirit. He lives under the camphor tree, and he is grey, and very big, and he was asleep.'),
            SA('Dad says he is the one who looks after the wood. I haven’t seen him yet. I hope I will. I think I will.'),
            SA('Granny has given us vegetables for you. Please get better quickly. I am looking after everyone. Satsuki.'),
            SA('Is “spirit” right? I wasn’t sure. I nearly put “ghost”, but he isn’t one.'),
            N('Mei has drawn the spirit at the bottom of the page, enormous, with a tiny Mei on his stomach. The ear of corn is in it too.'),
          ],
          choices: [
            {
              id: 'right',
              label: 'Tell her it’s right, all of it.',
              then: [SA('Really? Good.', 'happy'), N('She folds it twice and puts it in the envelope before she can change her mind.')],
            },
            {
              id: 'line',
              label: 'Suggest she cross out “I am looking after everyone.”',
              then: [
                SA('Why? It’s true.'),
                Y('She knows. She’d rather hear how you are.'),
                N('Satsuki crosses it out, and writes instead: I am fine, and I miss you. Then she looks at it a long time.', 'soft'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Ask if your Nubbin can be in the drawing.',
              then: [ME('I’ll do it!', 'happy'), N('Mei adds your Nubbin, the size of a bean, next to her, and gives it a smile bigger than its face.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-08-complete',
      lines: [
        N('In the morning you post the letter in the red box by the bus stop, with Mei lifted up to do the actual posting.'),
        ME('Will it go fast?'),
        SA('It goes on the bus. Then on the train. Then a man carries it. It’ll be there tomorrow.'),
        ME('I could go faster.', 'think'),
        N('Nobody pays much attention to that, at the time.'),
      ],
    },
    rewards: [],
    sets: { 'a17-08': true },
    notes:
      'CARE NOTE: Granny’s line about fresh vegetables (a17-08-field#2) uses “poorly”, not any illness. The letter is in ' +
      'Japanese, written in pencil; the atlas lets the Keeper read it (a17-08-letter#2). Show the letter as a hand-written ' +
      'page with Mei’s drawing, our own drawing of the spirit in the licensed design. Mei’s ear of corn is set up here for ' +
      'A17-13 and A17-16. The last line of the complete scene foreshadows A17-13 and is played quietly, with no music cue.',
  },

  // ---------------------------------------------------------------- A17-9
  {
    id: 'a17-09',
    code: 'A17-9',
    title: 'The Bus Stop in the Rain',
    source: `${FILM}: waiting for the father’s bus`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-8') },
    requires: ['A17-8'],
    speakers: [SATSUKI, MEI, FATHER, GRANNY],
    steps: [
      {
        id: 'a17-09-s1',
        goal: 'Take the umbrellas down to the bus stop with Satsuki and Mei.',
        hint: 'Carry Granny’s lantern and walk down the dark road with the girls.',
        check: 'escort:a17-sisters:bus-stop',
        scene: {
          id: 'a17-09-walk',
          lines: [
            N('It has rained since teatime. Mr Kusakabe went to the university without an umbrella, as he always does.'),
            SA('We’ll take Dad’s umbrella to the bus stop. Mei’s coming too. She won’t stay behind.'),
            GR('Take my lantern, and take the Keeper. It’s as dark as the inside of a boot out there.'),
            N('So the four of you go down the road in the dark: Satsuki with her umbrella and her father’s under her arm, Mei under a small one, you with the lantern.'),
            N('Your Nubbin walks under Mei’s umbrella, because there is just room.'),
            N('The bus stop is a sign on a post and a little wooden shelter, at the edge of the wood. The rain drums on everything.'),
            N('A bus comes, all lit up, with its wipers going. It stops, nobody gets off, and it drives away.'),
            SA('He’ll be on the next one.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait with them.',
              then: [N('You wait with them. There is nothing else to do, so you all do it properly.')],
            },
            {
              id: 'offer',
              label: 'Offer to take Mei home.',
              then: [ME('No! I’m waiting for Dad.', 'angry'), SA('She won’t go. It’s all right. We’ll all wait.')],
            },
          ],
        },
        done: {
          id: 'a17-09-walk-done',
          lines: [
            N('The next bus is a long time coming. Mei gets heavier and heavier against her sister.'),
            N('In the end Satsuki lifts her on to her back, and holds her umbrella over both of them.'),
          ],
        },
      },
      {
        id: 'a17-09-s2',
        goal: 'Keep waiting at the bus stop in the rain.',
        hint: 'Stand still beside Satsuki. Don’t go anywhere. Something is coming.',
        check: 'wait:a17-bus-stop:night',
        scene: {
          id: 'a17-09-wait',
          lines: [
            N('Mei is asleep on Satsuki’s back. The rain drips off the edge of the shelter, steady as a clock.'),
            N('Your Nubbin, under the shelter, slowly turns its head to the right.'),
            N('Next to Satsuki, there is something standing in the rain. You hear its claws first, on the wet road.'),
            N('It is huge, and grey, and round. It has a big leaf on its head, and the rain runs off the leaf and on to its fur.'),
            N('Satsuki stares up at it. It stares out at the dark, the way people do at bus stops.'),
            N('Then it turns its great round eyes, slowly, and looks straight at you. It knows you, and it knows you didn’t go looking.'),
            N('It blinks, once, very slowly. It is like having a whole hillside blink at you.'),
          ],
          choices: [
            {
              id: 'nod',
              label: 'Nod to him, as you would to a neighbour.',
              then: [N('You nod. The great spirit seems to think about this, and then his whiskers move, which might be a nod back.')],
            },
            {
              id: 'still',
              label: 'Stand very still and let him look.',
              then: [N('You stand very still. He looks at you a long time, as if you are an interesting sort of weather.')],
            },
          ],
        },
        done: {
          id: 'a17-09-wait-done',
          lines: [
            N('Satsuki holds out her father’s umbrella to him. He doesn’t know what it is, so she opens it and holds it up high, over his head.'),
            N('A drop falls from the trees on to the umbrella, tok, and everything under it goes still. Another drop: tok.'),
            N('Something huge jumps. The ground shakes, and every drop in every tree comes down on the umbrella at once, like a waterfall.'),
            N('A roar of pure happiness goes through you like warm wind.'),
          ],
        },
      },
      {
        id: 'a17-09-s3',
        goal: 'Watch what comes for him along the dark road.',
        hint: 'Stay at the bus stop and look down the road. Hold the lantern up.',
        check: 'watch:a17-catbus:bus-stop',
        scene: {
          id: 'a17-09-catbus',
          lines: [
            N('He holds something out to Satsuki: a little bundle of leaves, tied up with a stalk of grass.'),
            N('She takes it in both hands. Then two lights come bounding through the wood towards you, yellow, like headlamps.'),
            N('It is a bus. It is also a cat: a huge grinning cat, with many legs and a body you could sit in.'),
            N('It stops at the bus stop, as buses do, and its door opens. Its sign, up top, flickers with a word that won’t hold still long enough to read.'),
            N('The great spirit steps in, with the umbrella. He looks out at you all through the window as it goes.'),
            N('The Catbus bounds off over the fields, over the wires, over the trees, and the dark is just dark again.'),
            N('Your Nubbin is standing up on its back legs, staring after it. You realise that so are you.'),
          ],
          choices: [
            {
              id: 'satsuki',
              label: 'Look at Satsuki.',
              then: [SA('Did you see it? You did. You saw it.', 'shock'), Y('I saw it.'), SA('Mei’s going to be so cross she was asleep.', 'happy')],
            },
            {
              id: 'bundle',
              label: 'Look at the bundle.',
              then: [N('Satsuki is holding the bundle against her chest with both hands. It smells of green things and earth.')],
            },
          ],
        },
        done: {
          id: 'a17-09-catbus-done',
          lines: [
            N('A little after, an ordinary bus comes round the bend with its lights on. Mr Kusakabe gets off and stops dead.'),
            FA('All three of you? And the Keeper? In this? I’m sorry, my bus was held up. Why are you all looking like that?'),
          ],
        },
      },
    ],
    complete: {
      id: 'a17-09-complete',
      lines: [
        N('The girls tell him all the way home, both at once. Mei, who saw none of it, tells it loudest.'),
        FA('A spirit at the bus stop. Took my umbrella, did he? Well, he’s welcome to it. It leaked.', 'happy'),
        N('At Granny’s door, your Nubbin stops. It has found a big leaf by the step, the size of a hat, and it puts it on.'),
        N('It wears it into the house and refuses to take it off for supper.'),
      ],
    },
    rewards: [
      {
        id: 'a17-leaf-hat',
        kind: 'cosmetic',
        label: 'Big-leaf umbrella hat',
        description: 'A broad green leaf, worn like a hat. Your Nubbin likes to stand under the drips with it on.',
      },
    ],
    sets: { 'a17-09': true },
    notes:
      'TUNNEL PAYOFF (a17-tunnel, from A17-6). The step 2 scene shown, a17-09-wait, is for wait: he looks straight at you. ' +
      'For hunt, play A17_VARIANTS a17-09-wait-hunt instead: you never see more than two enormous feet and the rain bouncing ' +
      'off the umbrella. The done scene and step 3 are shared. STAGING: the bus stop is a wooden shelter and a sign on a ' +
      'post at the edge of the wood; Granny’s lantern is the only light. The great spirit and the Catbus use the licensed ' +
      'designs; neither speaks. The Catbus’s sign is drawn as unreadable marks here; it is read in A17-14 and A17-15. The ' +
      'drops on the umbrella are the scene’s sound cue: two single drips, then a roar of water. No music. The hat is our own ' +
      'drawing of a large leaf and never looks like the spirit’s.',
  },

  // ---------------------------------------------------------------- A17-10
  {
    id: 'a17-10',
    code: 'A17-10',
    title: 'The Seeds',
    source: `${FILM}: the gift, and planting it`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-9') },
    requires: ['A17-9'],
    speakers: [SATSUKI, MEI, FATHER],
    steps: [
      {
        id: 'a17-10-s1',
        goal: 'Open the spirit’s bundle with the family.',
        hint: 'Sit at the low table in the old house while Satsuki unties the grass.',
        check: 'inspect:a17-bundle:old-house',
        scene: {
          id: 'a17-10-bundle',
          lines: [
            N('In the morning everyone sits round the low table in the old house, and Satsuki unties the stalk of grass.'),
            N('The leaves fall open. Inside there are nuts and acorns: brown ones, striped ones, and some you have never seen.'),
            ME('Acorns! He gave us acorns!', 'happy'),
            SA('It’s a present. It’s a thank-you, for the umbrella.'),
            FA('Then you’d better plant them. Seeds are a promise. You have to keep your side.'),
            ME('And they’ll grow into a forest! A whole forest, and he can live in it!'),
            FA('It might take a while, Mei.'),
            N('Your Nubbin sniffs every single nut in turn, and then puts its nose on the table and looks at them all.'),
          ],
          choices: [
            {
              id: 'count',
              label: 'Help Mei count them.',
              then: [ME('One, two, five, nine, eleven…', 'think'), SA('Mei, that’s not how counting goes.'), ME('It is for acorns.')],
            },
            {
              id: 'smell',
              label: 'Smell the leaves they came in.',
              then: [N('The leaves smell of the camphor tree: clean and sharp, like a medicine chest kept in a forest.')],
            },
          ],
        },
        done: {
          id: 'a17-10-bundle-done',
          lines: [
            SA('We’ll make a seed bed in the garden. A proper one. Will you help dig?'),
          ],
        },
      },
      {
        id: 'a17-10-s2',
        goal: 'Plant the seeds in a bed in the garden, then wait.',
        hint: 'Dig the bed by the house, plant every seed, and mark the place.',
        check: 'place:a17-seeds:seed-bed',
        scene: {
          id: 'a17-10-plant',
          lines: [
            N('You dig a bed in the sun by the house. Satsuki plants the seeds in rows, and Mei plants them in clumps.'),
            N('Your Nubbin pats the earth down over each one, very firmly, with both paws.'),
            ME('Now they grow.'),
            N('They don’t. Mei squats over the bare earth with her chin on her knees, and waits.'),
            N('Your Nubbin squats beside her, chin on its knees, and waits too.'),
            SA('Mei, it’s been about a minute.'),
            ME('Then they’re late.', 'angry'),
            N('Nothing comes up that day, or the next day, or the day after that. Every morning, two small shapes squat beside the bed.'),
          ],
          choices: [
            {
              id: 'sign',
              label: 'Make a sign for the bed.',
              then: [N('You make a sign out of a bit of board: SEEDS, PLEASE DON’T STEP. Mei adds a drawing of the spirit, for the seeds to look at.')],
            },
            {
              id: 'stones',
              label: 'Ring the bed with white stones.',
              then: [N('You ring the bed with white stones from the stream, so nobody treads on it in the dark. Mei counts them, her way.')],
            },
            {
              id: 'squat',
              label: 'Squat down with them and wait.',
              then: [N('You squat down too: three of you now, chins on knees. Nothing comes up, but the waiting is better company.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-10-complete',
      lines: [
        FA('Seeds are like that. They take their time. Most good things do.', 'soft'),
        ME('He’d make them grow. If he came.'),
        N('That night, at Granny’s, your Nubbin won’t settle. It sits at the window with its nose on the glass, facing the old house.'),
      ],
    },
    rewards: [],
    sets: { 'a17-10': true },
    notes:
      'The bundle is nuts and acorns wrapped in camphor-like leaves and tied with a grass stalk. The waiting at the seed bed ' +
      'is told in narration over “days”: it is not a timer, a chore or a daily check. The step completes when the seeds are ' +
      'planted and the scene ends. Hazel’s third rule is acted here (squatting by the bed), never quoted.',
  },

  // ---------------------------------------------------------------- A17-11
  {
    id: 'a17-11',
    code: 'A17-11',
    title: 'The Night Dance',
    source: `${FILM}: the midnight dance and the great tree`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-10') },
    requires: ['A17-10'],
    speakers: [SATSUKI, MEI],
    steps: [
      {
        id: 'a17-11-s1',
        goal: 'Follow your Nubbin to the seed bed at midnight.',
        hint: 'Your Nubbin has woken you. Go quietly through the hedge to the old house garden.',
        check: 'watch:a17-dance:seed-bed',
        scene: {
          id: 'a17-11-midnight',
          lines: [
            N('Something is patting your face. It is your Nubbin, and it is the middle of the night.'),
            N('The moon is full. Across the hedge, in the old house garden, something is moving round the seed bed.'),
            N('You go through the gap in the hedge in your socks. Then you stop.'),
            N('Three spirits are walking round the seed bed, slowly, in a line: the great grey one, the blue one and the little white one.'),
            N('They hold their arms up, all together, and bend, all together, as if they were pulling something up out of the earth.'),
            N('On the veranda of the old house, a sliding door opens. Satsuki and Mei come out in their nightclothes, barefoot.'),
            ME('He came. Onee-chan, he came!', 'happy'),
            N('Your Nubbin is already in the line, behind the little white one, holding up its paws.'),
          ],
          choices: [
            {
              id: 'join',
              label: 'Join the line.',
              then: [N('You join the end of the line. Satsuki and Mei are just in front of you, holding their arms up, bending when he bends.')],
            },
            {
              id: 'girls',
              label: 'Wait for the girls, then join together.',
              then: [N('You wait at the edge until the girls reach you. Mei takes your hand and Satsuki’s, and pulls you both into the line.')],
            },
          ],
        },
      },
      {
        id: 'a17-11-s2',
        goal: 'Dance round the seed bed with the spirits.',
        hint: 'Follow the great spirit round the bed. Arms up when he lifts, bend when he bends.',
        check: 'walk:a17-dance:seed-bed',
        scene: {
          id: 'a17-11-dance',
          lines: [
            N('Round the bed you all go, slowly: arms up, bend, arms up, bend. Nobody says a word.'),
            N('A shoot comes up out of the earth, then another. Then all of them, together, like hands.'),
            N('The great spirit lifts his arms higher, and strains, and the shoots rise with them. They twist round each other as they rise.'),
            N('They grow into a sapling, then a young tree, then a tree as tall as the house. It goes on growing.'),
            N('It roars up into the night until it is as tall as the camphor on the hill, and its branches cover half the sky.'),
            N('The great spirit lets his arms fall. He looks very pleased, and a little out of breath.'),
            SA('We did it. We did it!', 'happy'),
            N('Mei is jumping up and down. Your Nubbin is lying on its back in the grass, looking up into the branches.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer with Satsuki and Mei.',
              then: [N('You cheer. The great spirit looks round at the noise, and grins, a grin as wide as the hedge.')],
            },
            {
              id: 'lie',
              label: 'Lie down in the grass by your Nubbin and look up.',
              then: [N('You lie down by your Nubbin and look up. The branches go up and up, and the stars show through them like fruit.')],
            },
          ],
        },
        done: {
          id: 'a17-11-dance-done',
          lines: [
            N('The great spirit picks up a wooden spinning top, as big as a cartwheel, and sets it spinning on the grass.'),
            N('He steps up on to it, with the little white one and the blue one clinging to his fur. He holds out a paw to the girls.'),
          ],
        },
      },
      {
        id: 'a17-11-s3',
        goal: 'Hold on tight and ride the spinning top up into the night.',
        hint: 'Climb on behind the girls and hold on to his fur. Don’t look down. Or do.',
        check: 'climb:a17-top:great-tree',
        scene: {
          id: 'a17-11-flight',
          lines: [
            N('Satsuki and Mei climb up on to his stomach, and you hold on to the fur at his side, and your Nubbin holds on to you.'),
            N('He roars, and the top rises. It lifts off the grass, and spins, and the garden falls away.'),
            N('You fly over the old house, and Granny’s house, and the rice fields silver in the moon.'),
            ME('We’re the wind! We’re the wind!', 'happy'),
            N('The great spirit flies to the top of the camphor tree on the hill, and settles on its highest branch.'),
            N('The three spirits take out little clay flutes, and play. It is not a tune you know, and you will never be able to hum it.'),
            N('It sounds like the night: frogs, and wind in the rice, and the stream, all at once.'),
            N('Below you the whole valley is asleep. Satsuki leans on your shoulder, and Mei is already asleep on his stomach.'),
          ],
          choices: [
            {
              id: 'listen',
              label: 'Just listen.',
              then: [N('You listen. Your Nubbin falls asleep against you, and you very nearly do too, at the top of the world.')],
            },
            {
              id: 'satsuki',
              label: 'Ask Satsuki if she’s dreaming.',
              then: [SA('Probably. I don’t mind. Don’t wake me up.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-11-complete',
      lines: [
        N('You wake on Granny’s floor at sunrise, with your Nubbin asleep on your chest. Your socks have grass on them.'),
        N('Across the hedge, Satsuki and Mei are already out on the veranda, staring at the garden. There is no great tree.'),
        N('But in the seed bed, in rows and in clumps, there are shoots. Little green ones, just up.'),
        SA('It was a dream! But it wasn’t!', 'happy'),
        ME('We did it! We did it!', 'happy'),
        N('On your windowsill, where nobody put it, there is a small black seed. It smells of the camphor tree.'),
        N('You keep it. When you go home through the atlas, it goes with you, and comes out as a young camphor tree in a pot.'),
      ],
      set: { 'a17-tree': 'camphor' },
    },
    rewards: [
      {
        id: 'a17-camphor-pot',
        kind: 'decor',
        label: 'Potted camphor tree',
        description:
          'A young camphor tree in a glazed pot, glossy-leaved and smelling clean and sharp. Without s1Done only; with it, you get the oak instead.',
      },
      {
        id: 'a17-grove-oak',
        kind: 'feature',
        label: 'The oak on the hill',
        description:
          'A full-grown oak on the Grove hill, by the flat stone where Moss sits, grown from Moss’s acorn charm. With s1Done only; without it, you get the potted camphor tree instead.',
      },
    ],
    sets: { 'a17-11': true },
    notes:
      'READS s1Done (Grove, read-only), when step 2 begins. WITHOUT s1Done: the quest plays as written; the complete scene ' +
      'sets a17-tree = camphor, and the reward is the potted camphor tree. WITH s1Done: A17_VARIANTS a17-11-dance-charm ' +
      'replaces the step 2 scene a17-11-dance (your Nubbin digs a hole beside the seed bed, and you plant the acorn from ' +
      'Moss’s acorn charm), and a17-11-complete-oak replaces a17-11-complete (it sets a17-tree = oak). The reward is the oak. ' +
      'Exactly one of the two rewards is given. In the page the dancers’ tree is gone by morning, as in the film. ' +
      'THE CHARM: the acorn comes off its string; the empty string stays on the Keeper’s acorn-charm cosmetic until the ' +
      'oak’s first acorn goes back on it (a17-grove-oak or a17-grove-oak-sleeps). ' +
      'MUSIC: the clay flutes (ocarinas) play original night music, not the film’s score or songs, and no melody from the ' +
      'film is hummed. The flying top is the licensed design. ' +
      'SIM: (a) the Grove keepsake appears on the next return to the Grove after this quest, read through an ' +
      'atlasFlag(\'a17-tree\') lookup beside atlasDone(id) (the same lookup A11 asks for). (b) oak: a full-grown oak on ' +
      'the western hill by Moss’s flat stone, then play A17_VARIANTS a17-grove-oak followed by a17-grove-oak-acorn, or a17-grove-oak-sleeps if the ' +
      'campaign ending is moss-sleeps. If chapter 10 has begun and no ending is set yet, the oak still appears, but hold ' +
      'the scene until the ending is known. (c) camphor: the potted tree joins your decorations, and play ' +
      'a17-grove-camphor once. The Grove scenes play once each.',
  },

  // ---------------------------------------------------------------- A17-12
  {
    id: 'a17-12',
    code: 'A17-12',
    title: 'The Telegram',
    source: `${FILM}: the telegram from the hospital`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A17-11') },
    requires: ['A17-11'],
    speakers: [KANTA, SATSUKI, MEI, FATHER, GRANNY],
    steps: [
      {
        id: 'a17-12-s1',
        goal: 'See what Kanta is running across the fields with.',
        hint: 'You are in Granny’s field with the girls. Wait for Kanta at the end of the row.',
        check: 'talk:a17-kanta:field',
        scene: {
          id: 'a17-12-telegram',
          lines: [
            N('The day before the weekend, you are all in Granny’s field picking corn. Somebody is running along the path, shouting.'),
            N('It is Kanta, red in the face, holding up a folded paper.'),
            KA('Telegram! For the Kusakabes! Nobody’s at your house! The man gave it to me!'),
            N('Satsuki takes it. Everyone knows a telegram in the middle of the week is never good news.'),
            SA('It says… please telephone Shichikokuyama Hospital.', 'shock'),
            N('Nobody says anything. Mei looks from face to face, holding her corn.'),
            SA('Dad’s in town. At the university. We haven’t got a telephone.'),
            KA('My uncle has. At the big house. Come on.'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Go with them.',
              then: [N('You go with them. Granny takes Mei’s hand and keeps it.')],
            },
            {
              id: 'mei',
              label: 'Stay with Mei and Granny.',
              then: [N('You stay with Mei, until you see Satsuki’s face as she turns to go. You go after her, and Granny keeps Mei.')],
            },
          ],
        },
      },
      {
        id: 'a17-12-s2',
        goal: 'Walk with Satsuki to the telephone at Kanta’s uncle’s house.',
        hint: 'Follow Kanta along the path to the big house, and wait while Satsuki calls.',
        check: 'escort:a17-satsuki:telephone',
        scene: {
          id: 'a17-12-phone',
          lines: [
            N('The big house has a black telephone on the wall in the hall, with a handle you turn. Kanta’s uncle shows Satsuki how.'),
            N('She asks the operator for her father’s university, in Tokyo, reading the number off a paper from her pocket.'),
            SA('Hello? Please may I speak to Mr Kusakabe? In archaeology. It’s his daughter. Yes, I’ll wait.'),
            N('She waits a long time with the earpiece pressed to her ear. Kanta stands in the doorway, not going away.'),
            SA('Dad? Dad, there was a telegram. From the hospital.'),
            N('She listens. Then she puts the earpiece back, and you all wait again, for him to call the hospital and ring back.'),
            N('It rings. She grabs it.'),
            SA('Yes. Yes. A cold. She can’t come home this weekend. She has to rest. Yes. No, I’m all right. Yes. Goodbye.'),
            SA('Mum caught a cold. It’s only a setback, he says. She’s all right. She just can’t come home. Not this weekend.'),
          ],
          choices: [
            {
              id: 'good',
              label: '“That’s all right, then. She’s all right.”',
              then: [SA('Yes. She’s all right.'), N('She says it in a very flat voice, like someone reading it off a card.')],
            },
            {
              id: 'quiet',
              label: 'Say nothing. Walk back with her.',
              then: [N('You don’t say anything. You walk back with her, and Kanta walks behind you both, kicking at stones.')],
            },
          ],
        },
        done: {
          id: 'a17-12-phone-done',
          lines: [
            KA('Your mum. She’ll be all right. My gran says that hospital’s the best one.'),
            N('Satsuki doesn’t answer. Kanta goes red, and stops following, and stands at the edge of the path until you’re gone.'),
          ],
        },
      },
      {
        id: 'a17-12-s3',
        goal: 'Be there for the sisters when it all comes out.',
        hint: 'Go back to Granny’s porch. Decide where to sit.',
        check: 'sit:a17-sisters:granny-porch',
        scene: {
          id: 'a17-12-lap',
          lines: [
            N('Mei is waiting on Granny’s porch with her ear of corn. Satsuki tells her.'),
            ME('No! She’s coming home! She said! I picked the corn!', 'angry'),
            SA('Well, she can’t, Mei. She just can’t.'),
            ME('Then I’ll take it to her. I’ll go myself.', 'angry'),
            SA('Don’t be such a baby! You can’t go anywhere! Stop it!', 'angry'),
            N('Mei cries, loudly, the way four-year-olds do. Satsuki stands there with her fists shut.'),
            N('Then Granny comes out on to the porch, and Satsuki’s face crumples, and she runs to her.'),
            SA('What if she doesn’t get better? What if it’s like last time, when it was only going to be a little while?', 'sad'),
            N('She cries into Granny’s lap. Granny strokes her hair and says nothing for a while.'),
            GR('Hush now. She’ll be home. A cold is a cold. You’ve been brave too long, that’s all this is.', 'soft'),
          ],
          choices: [
            {
              id: 'mei',
              label: 'Sit with Mei.',
              then: [N('You sit beside Mei on the step, and she cries against your arm. Your Nubbin climbs into her lap, on top of the corn.')],
            },
            {
              id: 'satsuki',
              label: 'Sit near Satsuki and Granny, and wait.',
              then: [N('You sit on the step near them and don’t say anything. After a long time Satsuki’s breathing goes slower.')],
            },
            {
              id: 'kettle',
              label: 'Put the kettle on.',
              then: [N('You go into Granny’s kitchen and put the kettle on, because somebody should, and because it’s something to do with your hands.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-12-complete',
      lines: [
        N('By the time the tea is made, Satsuki has stopped crying. She sits up and wipes her face with the heel of her hand.'),
        SA('Sorry, Obaa-chan. I’m all right. Mei, I’m sorry I shouted. Mei?'),
        N('There is nobody on the step. There is only a dent in the cushion where somebody small was sitting.'),
        N('Your Nubbin is gone too.'),
      ],
    },
    rewards: [],
    sets: { 'a17-12': true },
    notes:
      'CARE NOTES: the illness is never named. The telegram asks the family to telephone the hospital; the call says only a ' +
      'cold and rest, and “only a setback”. Satsuki’s fear (a17-12-lap#7) is about her mother not getting better and never ' +
      'names any illness or death. The 1950s: the telegram is delivered by hand; the telephone is a wall set at the big ' +
      'house, with an operator. Kanta’s uncle is seen, not heard. Your Nubbin has gone with Mei: it follows her everywhere ' +
      '(A17-13).',
  },

  // ---------------------------------------------------------------- A17-13
  {
    id: 'a17-13',
    code: 'A17-13',
    title: 'Mei Goes Alone',
    source: `${FILM}: the village searches for Mei`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Straight after A17-12, from Nova’s atlas.' },
    requires: ['A17-12'],
    speakers: [SATSUKI, GRANNY, KANTA],
    steps: [
      {
        id: 'a17-13-s1',
        goal: 'Search for Mei and your Nubbin with the whole village.',
        hint: 'Choose a road and look. Ask anyone you meet.',
        check: 'explore:a17-lanes:search',
        scene: {
          id: 'a17-13-gone',
          lines: [
            SA('She’s gone to the hospital. With the corn. She doesn’t even know the way!', 'shock'),
            N('Satsuki is off down the road before anyone can stop her, running as fast as she can.'),
            GR('Kanta! Fetch your father. Fetch everybody.', 'shock'),
            N('Kanta runs. In a very short time there are people in all the fields: neighbours, farmers, the man from the big house.'),
            N('They call Mei’s name along the paths and across the water. You are in it with them.'),
            N('Somewhere Mei is walking with an ear of corn, and somewhere next to her, you are sure, is your Nubbin.'),
          ],
          choices: [
            {
              id: 'road',
              label: 'Take the hospital road.',
              then: [N('You run the hospital road as far as the hill. A farmer on a cart saw a little girl, he thinks, an hour ago, or yesterday.')],
            },
            {
              id: 'fields',
              label: 'Search the edges of the rice fields.',
              then: [N('You go along the edges of the rice fields, looking in every ditch. Only frogs: hundreds of frogs, and no Mei.')],
            },
            {
              id: 'kanta',
              label: 'Go with Kanta.',
              then: [KA('She’s small. She’ll go where it’s easy. Come on.'), N('He’s quicker than you, and he knows every path. He doesn’t stop shouting her name.')],
            },
          ],
        },
        done: {
          id: 'a17-13-gone-done',
          lines: [
            N('Someone is shouting by the big pond at the bottom of the village. People are starting to run towards it.'),
          ],
        },
      },
      {
        id: 'a17-13-s2',
        goal: 'Go to the pond.',
        hint: 'Run down to the big pond where the people are.',
        check: 'visit:a17-pond:village',
        scene: {
          id: 'a17-13-pond',
          lines: [
            N('There are people all along the bank, and men in the shallows with poles.'),
            N('One of them holds up something small: a child’s sandal, dripping, from the water.'),
            N('Granny’s hands come together. She doesn’t make a sound, but her lips move.'),
            N('Satsuki comes running down the bank, red-faced, out of breath. She looks at the sandal.'),
            SA('It isn’t hers. It isn’t Mei’s. Hers are different.'),
            GR('Oh. Oh, thank goodness. Oh, thank goodness.', 'soft'),
            N('Granny sits down on the bank, all at once, as if her legs have been pulled from under her.'),
          ],
          choices: [
            {
              id: 'granny',
              label: 'Sit down with Granny for a moment.',
              then: [N('You sit with her. She holds your arm very tight, and then lets go, and pats it.'), GR('Go on. Go and find her. I’m all right.')],
            },
            {
              id: 'satsuki',
              label: 'Go to Satsuki.',
              then: [N('You go to Satsuki. She is already looking away, up the hill, to the camphor tree.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-13-complete',
      lines: [
        N('It is getting late. The sun is low over the rice fields, and the whole village is still calling her name.'),
        SA('I know who can find her.', 'think'),
        N('She turns, and runs for home. For the hedge.'),
      ],
    },
    rewards: [],
    sets: { 'a17-13': true },
    notes:
      'CARE NOTE: keep the fear short. The sandal is found in a17-13-pond#1, and Satsuki says it isn’t Mei’s in #4; nothing ' +
      'lingers. Granny’s prayer is shown only as her hands coming together and her lips moving: no words, no chant on ' +
      'screen. The men in the shallows have poles, nothing else. A17-14 starts the moment this complete scene ends. The ' +
      'search is a short explore with no fail state.',
  },

  // ---------------------------------------------------------------- A17-14
  {
    id: 'a17-14',
    code: 'A17-14',
    title: 'Satsuki and the Spirit',
    source: `${FILM}: Satsuki asks the great spirit for help`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Straight after A17-13, from Nova’s atlas.' },
    requires: ['A17-13'],
    speakers: [SATSUKI, KANTA],
    steps: [
      {
        id: 'a17-14-s1',
        goal: 'Follow Satsuki through the hedge.',
        hint: 'Run after her into the old house garden, and go in at the gap in the hedge.',
        check: 'explore:a17-tunnel:camphor',
        scene: {
          id: 'a17-14-tunnel',
          lines: [
            N('Satsuki runs into the old house garden, straight at the hedge, and goes in at the gap on her hands and knees.'),
            N('You go in after her. Last time this gap went nowhere; this time it is the tunnel, green and gold, going on and on.'),
            N('It is in a hurry tonight. It seems to pull you along.'),
            SA('Please. Please be there.'),
            N('She comes out among the roots of the camphor tree and drops straight down into the hollow, on to something soft.'),
            N('The great spirit opens one eye. Then both.'),
            SA('Please help me. Mei’s lost. She went to find our mum, and it’s getting dark, and I can’t find her anywhere.', 'sad'),
            N('She is crying properly now, holding on to his fur with both hands.'),
            N('The great spirit looks at her for a long moment. Then he grins, the widest grin in the world.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Stand back. This is hers to ask.',
              then: [N('You stay on the root at the edge of the hollow. It is hers to ask, and he is listening to her.')],
            },
            {
              id: 'nubbin',
              label: 'Tell him your Nubbin is with Mei too.',
              then: [Y('My Nubbin’s with her. Wherever she is.'), N('He turns his great eyes to you and blinks once, slowly, as if he knew that already.')],
            },
          ],
        },
        done: {
          id: 'a17-14-tunnel-done',
          lines: [
            N('He gets up, with Satsuki on his stomach. Then he goes up the camphor tree the way wind goes up a tree, and you climb after.'),
          ],
        },
      },
      {
        id: 'a17-14-s2',
        goal: 'See what the great spirit calls.',
        hint: 'Hold on at the top of the tree and watch the woods.',
        check: 'watch:a17-catbus:sign',
        scene: {
          id: 'a17-14-call',
          lines: [
            N('At the very top of the camphor tree he lifts his head and roars. It rolls out over the valley like thunder.'),
            N('Far off, over the woods, two yellow lights come bounding.'),
            N('The Catbus comes running along the treetops, its legs a blur, and lands on the branch beside you with a thump.'),
            N('Its door opens, and Satsuki climbs in. The sign up top turns, like a rolling drum, to a new word.'),
            N('It is a name. MEI.'),
            SA('It says Mei! It knows where she is!', 'happy'),
            N('The Catbus looks at you with its great grin. The door stays open.'),
          ],
          choices: [
            {
              id: 'climb',
              label: 'Climb aboard.',
              then: [N('You climb aboard. The seats are soft and warm and furry, and they purr.')],
            },
            {
              id: 'thank',
              label: 'Look back at the great spirit first.',
              then: [N('He is sitting on the branch, grinning, enormous against the evening. You climb aboard, and the seats purr.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-14-complete',
      lines: [
        N('The Catbus leaps. It runs along the power lines, over the rice, past people in the fields who feel only a gust of wind.'),
        N('A scarecrow’s hat blows off. Nobody else can see it, nobody at all.'),
        SA('Hurry. Please hurry.'),
        N('Satsuki sits at the front with her face to the glass. You sit beside her and hold her hand, and she lets you.'),
      ],
    },
    rewards: [],
    sets: { 'a17-14': true },
    notes:
      'TUNNEL PAYOFF (a17-tunnel). The scenes shown are for wait: the tunnel lets you through, and the Catbus stops for you ' +
      'too. For hunt, play A17_VARIANTS a17-14-tunnel-hunt and a17-14-tunnel-hunt-done for step 1, a17-14-call-hunt and ' +
      'a17-14-call-hunt-done for step 2, and a17-14-complete-hunt: the hedge stays a hedge for you, and you search on foot ' +
      'with Kanta. Satsuki’s side is the same on both paths. The great spirit and the Catbus use the licensed designs and ' +
      'never speak; the roar is a sound. The Catbus’s sign shows Mei’s name in Japanese, めい, drawn in the licensed style; ' +
      'the atlas lets the player read it.',
  },

  // ---------------------------------------------------------------- A17-15
  {
    id: 'a17-15',
    code: 'A17-15',
    title: 'The Roadside Statues',
    source: `${FILM}: Mei found by the six Jizo`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Straight after A17-14, from Nova’s atlas.' },
    requires: ['A17-14'],
    speakers: [SATSUKI, MEI, KANTA],
    steps: [
      {
        id: 'a17-15-s1',
        goal: 'Find Mei.',
        hint: 'Get down from the Catbus at the row of statues by the road.',
        check: 'find:a17-mei:jizo-row',
        scene: {
          id: 'a17-15-statues',
          lines: [
            N('The Catbus comes down on a country road far out among the fields, where six small stone statues stand by the verge.'),
            N('They are Jizo, in a row, each in a red bib. Someone has put fresh flowers at their feet.'),
            N('Beside them, on the grass, sits Mei, with her knees up and her ear of corn in her lap. Your Nubbin is sitting next to her.'),
            SA('Mei!'),
            ME('Onee-chan!', 'sad'),
            N('Satsuki is out of the door before it is properly open. Mei gets up, and the sisters run into each other and hold on.'),
            ME('I got lost. I’m sorry. I wanted to give Mum the corn.', 'sad'),
            SA('No, I’m sorry. I’m sorry I shouted. I’m so sorry, Mei.', 'sad'),
            N('Your Nubbin comes to you and leans on your leg, hard, as if it has been holding something heavy all afternoon.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Stand back and let them have this.',
              then: [N('You stand back by the Catbus. The sisters hold on to each other for a long time, and nobody hurries them.')],
            },
            {
              id: 'nubbin',
              label: 'Pick your Nubbin up.',
              then: [N('You pick your Nubbin up. It is warm and dusty, and it has walked a very long way on very short legs.')],
            },
            {
              id: 'corn',
              label: 'Check the corn is all right.',
              then: [ME('I held it the whole way. It’s not even bent.', 'happy'), N('It isn’t. She has carried it all afternoon like an egg.')],
            },
          ],
        },
      },
      {
        id: 'a17-15-s2',
        goal: 'Watch the Catbus’s sign change again.',
        hint: 'Wait by the Catbus while Satsuki asks it.',
        check: 'watch:a17-sign:jizo-row',
        scene: {
          id: 'a17-15-sign',
          lines: [
            SA('Mei. Do you still want to take Mum the corn?'),
            N('Mei nods, very hard.'),
            SA('Then…'),
            N('Satsuki turns to the Catbus, and doesn’t quite know how to ask a bus a favour. She bows, a little, and asks anyway.'),
            SA('Please, could you take us to Shichikokuyama Hospital?'),
            N('The Catbus grins. Up top the sign rolls round again, and stops: SHICHIKOKUYAMA HOSPITAL.'),
            ME('It says Mum! It says Mum’s hospital!', 'happy'),
            N('The sisters climb in, Mei holding the corn up out of the way. The door stays open for you and your Nubbin.'),
          ],
          choices: [
            {
              id: 'climb',
              label: 'Climb aboard.',
              then: [N('You climb aboard with your Nubbin in your arms. It falls asleep on the purring seat at once.')],
            },
            {
              id: 'look',
              label: 'Look back at the statues before you go.',
              then: [N('The six small statues stand in their red bibs in the last of the light, keeping the road, as they always have.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a17-15-complete',
      lines: [
        N('The Catbus runs over the hills in the dusk, through the pine woods, faster than any bus has ever gone.'),
        N('Mei sits in Satsuki’s lap with the corn in hers. Neither of them lets go of anything.'),
        ME('Onee-chan, are we nearly there?'),
        SA('Nearly.', 'soft'),
        N('Mei counts the telegraph poles to make sure: “One, two, five, nine, eleven.” They go past very fast.'),
        ME('We’re nearly there. I counted.'),
      ],
    },
    rewards: [],
    sets: { 'a17-15': true },
    notes:
      'CARE NOTES (the statues): six small stone Jizo by the roadside, Buddhist guardians of children and travellers, with ' +
      'red bibs as the film has them and fresh flowers at their feet. Show them with respect: nobody climbs on them, sits ' +
      'on them or leans on them; Mei sits on the grass beside them, and your Nubbin sits on the grass too. No jokes. The ' +
      'camera may hold on them, still, at a17-15-sign choice “look”. Satsuki’s small bow to the Catbus is her own manners. ' +
      'TUNNEL PAYOFF (a17-tunnel = hunt): play A17_VARIANTS a17-15-statues-hunt, a17-15-sign-hunt, a17-15-sign-hunt-done ' +
      'and a17-15-complete-hunt instead: you and Kanta reach the statues as the Catbus leaves. The sign shows the ' +
      'hospital’s name in Japanese, which the atlas lets the player read.',
  },

  // ---------------------------------------------------------------- A17-16
  {
    id: 'a17-16',
    code: 'A17-16',
    title: 'Corn on the Sill',
    source: `${FILM}: the window at the hospital, and home`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Straight after A17-15, from Nova’s atlas.' },
    requires: ['A17-15'],
    speakers: [SATSUKI, MEI, MOTHER, FATHER, GRANNY, KANTA],
    steps: [
      {
        id: 'a17-16-s1',
        goal: 'Look in at the hospital window.',
        hint: 'Keep still. Nobody inside must know you’re there.',
        check: 'watch:a17-window:hospital',
        scene: {
          id: 'a17-16-window',
          lines: [
            N('The Catbus settles in a tall pine outside the hospital, as quietly as a cat settling on a wall.'),
            N('Through its window, and through the open window of the hospital, you can see the room and the bed.'),
            N('Mrs Kusakabe is sitting up, and Mr Kusakabe is sitting beside her. He came straight from town, and still has his bag.'),
            N('She is laughing at something he has said. She looks tired, but she is laughing.'),
            MO('You needn’t have come all this way. It’s only a cold. The doctor’s fussing.', 'happy'),
            FA('You’d have come, if it were me.'),
            MO('I just wanted to see the girls this weekend. That’s all. I wanted to see them so much.', 'soft'),
            N('In the Catbus, Satsuki has both hands over her mouth. Mei is smiling, with tears on her face, holding the corn.'),
            SA('She’s laughing. She’s all right.'),
          ],
          choices: [
            {
              id: 'quiet',
              label: 'Stay quiet. Let them look.',
              then: [N('You don’t make a sound, and neither does the Catbus. It holds its breath, which for a bus is a lot of breath.')],
            },
            {
              id: 'nubbin',
              label: 'Lift your Nubbin up so it can see.',
              then: [N('You lift your Nubbin to the glass. It looks for a long time at the lady who stroked its head without looking.')],
            },
          ],
        },
      },
      {
        id: 'a17-16-s2',
        goal: 'Leave the corn on the windowsill.',
        hint: 'Watch while the sisters send the corn across.',
        check: 'place:a17-corn:sill',
        scene: {
          id: 'a17-16-corn',
          lines: [
            SA('We can’t go in. We’re not meant to be here. And how would we explain a Catbus?'),
            SA('We’ll leave the corn, Mei. Here. Write on it.'),
            N('Mei can’t write yet. Satsuki holds her hand round a twig, and together they scratch into the husk, slowly, letter by letter.'),
            N('The Catbus stretches out one long, long paw from the pine, and sets the corn on the windowsill without a sound.'),
            MO('I thought I saw Satsuki and Mei just now. In that pine tree. Smiling at me.', 'think'),
            FA('Did you? Well. Look at this.'),
            N('He picks up the ear of corn from the sill and turns it over. Scratched into the husk, in two hands at once: To Mother.'),
            N('He looks out at the dark pine for a long moment, and smiles, and doesn’t say anything.'),
          ],
        },
        done: {
          id: 'a17-16-corn-done',
          lines: [
            N('The Catbus slips out of the pine as quietly as it came, and you are flying home over the dark hills.'),
            N('Mei falls asleep before the first field. Satsuki watches the hospital lights until they’re gone.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a17-16-complete',
      lines: [
        N('The Catbus sets you down at the old house gate. Granny is on the step with the lamp, where she has been all evening.'),
        N('She doesn’t ask. She grabs Mei, and then Satsuki, and then, for some reason, you.'),
        GR('You bad girl. You good girl. Oh, the pair of you. Oh, the three of you.', 'soft'),
        N('Later in the summer Mrs Kusakabe comes home. It was only a cold, and she is getting well.'),
        N('She comes up the road from the bus stop, slowly, and the girls run down to meet her. You watch from Granny’s step.'),
        N('Then the page goes soft under your hand, and it is the Grove, with Nova’s atlas on your knee.'),
        N('Your Nubbin adds a leaf it will not take off, even in the bath, to its collection. By the lane stands a bench like a country bus stop; on the shelf, an ear of corn, dried gold.'),
      ],
    },
    rewards: [
      {
        id: 'a17-bus-stop-bench',
        kind: 'decor',
        label: 'Country bus-stop bench',
        description: 'A little wooden shelter and bench, with a sign on a post. Good for waiting at in the rain. Nothing ever comes. Probably.',
      },
      {
        id: 'a17-corn',
        kind: 'decor',
        label: 'Ear of corn',
        description: 'An ear of corn dried gold, with two hands’ worth of scratches on the husk. It sits on a shelf, or a windowsill.',
      },
      {
        id: 'a17-long-table-bookmark',
        kind: 'item',
        label: 'Long Table Bookmark',
        description: 'A strip of paper drawn like a long table laid for everyone. It marks the Camphor Tree page, and counts towards the Long Table festival.',
      },
    ],
    sets: { 'a17-16': true, 'a17-done': true },
    notes:
      'TUNNEL PAYOFF (a17-tunnel). The scenes shown are for wait: you watch from inside the Catbus. For hunt, play ' +
      'A17_VARIANTS a17-16-window-hunt (step 1), a17-16-corn-hunt (step 2), a17-16-corn-hunt-done and ' +
      'a17-16-complete-hunt: you watch from the road below with Kanta. Both are warm; one is closer. ' +
      'CARE NOTE: “only a cold” is the last word on the mother (a17-16-complete#3, and in a17-16-window#4). Her illness is ' +
      'never named. “To Mother” is scratched in Japanese on the husk (おかあさんへ, in a child’s hand guided by an older ' +
      'one); the atlas lets the player read it. ' +
      'SIM: (a) the bench is a decoration with a wooden shelter and a post sign; it is decor only, no bus, no timer. ' +
      '(b) The bookmark is an item in the atlas; the Long Table festival (A11, A13, A17, A18, A22, any two) reads ' +
      'atlasDone(\'A17\'). (c) The leaf hat was given in A17-9. (d) KEEPSAKE GAG (SR-20261024-704): this page names only its own item, the leaf.',
  },
];

// =================================================================== variants

/** A17-14 to A17-16, hunt path: the opening of the ride home from the hospital, shared by the hunt scenes. */
const HUNT_ROAD: Line[] = [
  N('Kanta’s uncle’s bicycle is very old and very fast downhill. You ride on the carrier, holding your Nubbin and Kanta’s shirt.'),
];

/**
 * Variant scenes chosen by flags. Each quest’s notes say which scene each replaces.
 *   a17-tunnel = hunt (A17-6): a17-09-wait-hunt; a17-14-*-hunt; a17-15-*-hunt; a17-16-*-hunt.
 *   s1Done (Grove, read-only, at A17-11): a17-11-dance-charm, a17-11-complete-oak.
 *   Grove keepsake, on the next return to the Grove after A17-11 (atlasFlag('a17-tree')):
 *     oak: a17-grove-oak then a17-grove-oak-acorn, or a17-grove-oak-sleeps if the ending is moss-sleeps; camphor: a17-grove-camphor.
 */
export const A17_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A17-9, step 2 scene (hunt)
  {
    id: 'a17-09-wait-hunt',
    lines: [
      N('Mei is asleep on Satsuki’s back. The rain drips off the edge of the shelter, steady as a clock.'),
      N('Your Nubbin, under the shelter, slowly turns its head to the right.'),
      N('Next to Satsuki, something is standing in the rain. You hear its claws first, on the wet road.'),
      N('You look, but you can’t see past Satsuki and her umbrella. You see two feet: grey, enormous, with claws like garden forks.'),
      N('The rain runs off something high above, and drips on to the feet. One of them shifts its weight, like someone waiting.'),
      N('Satsuki is staring up at whatever it is, with her mouth open. She doesn’t look at you; you don’t think she could.'),
      N('You lean, a little, to see round the umbrella. The feet shift away, politely, the way people do at bus stops.'),
    ],
    choices: [
      {
        id: 'lean',
        label: 'Lean further to see.',
        then: [N('You lean further, and the feet move further. Whatever it is, it isn’t ready to be looked at by you, not yet.')],
      },
      {
        id: 'still',
        label: 'Stand still and look at the road.',
        then: [N('You stand still and look at the road, as people do at bus stops. Beside you, something huge does the same.')],
      },
    ],
  },
  // ---------------------------------------------------------------- A17-11, step 2 scene (s1Done)
  {
    id: 'a17-11-dance-charm',
    lines: [
      N('Round the bed you all go, slowly: arms up, bend, arms up, bend. Nobody says a word.'),
      N('At the edge of the bed your Nubbin stops dancing. It is digging, with both paws, a little hole beside the girls’ rows.'),
      N('It looks up at you, and then at the acorn on its loop of string round your neck.'),
      N('Moss’s acorn charm: young Hazel tied it on him, the spring after their first winter. He gave it to you in the frost.'),
      N('You untie the acorn from the string and put it in the hole. Your Nubbin pats the earth down over it, very firmly.'),
      N('The great spirit glances down at it as he passes. He lifts his arms a little higher.'),
      N('A shoot comes up out of the earth, then another. Then all of them together, like hands, and one more, darker, from the little hole.'),
      N('They rise with his arms, twisting round each other, into a sapling, then a tree as tall as the house. It goes on growing.'),
      N('It roars up into the night until it is as tall as the camphor on the hill, and its branches cover half the sky.'),
      SA('We did it. We did it!', 'happy'),
      N('Mei is jumping up and down. Your Nubbin is lying on its back in the grass, looking up into the branches.'),
    ],
    choices: [
      {
        id: 'cheer',
        label: 'Cheer with Satsuki and Mei.',
        then: [N('You cheer. The great spirit looks round at the noise, and grins, a grin as wide as the hedge.')],
      },
      {
        id: 'lie',
        label: 'Lie down in the grass by your Nubbin and look up.',
        then: [N('You lie down by your Nubbin and look up. Somewhere up there, among all the other leaves, are some that are oak.')],
      },
    ],
  },
  // ---------------------------------------------------------------- A17-11, complete (s1Done)
  {
    id: 'a17-11-complete-oak',
    lines: [
      N('You wake on Granny’s floor at sunrise, with your Nubbin asleep on your chest. Your socks have grass on them.'),
      N('Across the hedge, Satsuki and Mei are already out on the veranda, staring at the garden. There is no great tree.'),
      N('But in the seed bed, in rows and in clumps, there are shoots. Little green ones, just up.'),
      SA('It was a dream! But it wasn’t!', 'happy'),
      ME('We did it! We did it!', 'happy'),
      N('Beside the bed, where you planted the acorn, the earth is smooth and bare. There is nothing there at all.'),
      N('The string round your neck is empty, and very light. Your Nubbin looks at it, and then up at the hill, as if it knows something.'),
    ],
    set: { 'a17-tree': 'oak' },
  },
  // ---------------------------------------------------------------- A17-14, step 1 scene and done (hunt)
  {
    id: 'a17-14-tunnel-hunt',
    lines: [
      N('Satsuki runs into the old house garden, straight at the hedge, and goes in at the gap on her hands and knees.'),
      N('You dive in after her. For one moment it is the tunnel, green and gold, with Satsuki’s heels ahead of you.'),
      N('Then the branches close in front of your face. It is a hedge, just a hedge, and you are stuck in it.'),
      N('By the time you back out, scratched, there is no sound from the other side at all.'),
      N('A bicycle bell rings in the lane. Kanta, on a bicycle much too big for him, stops with one foot down.'),
      KA('Where’s Satsuki? I saw her run in here.'),
      Y('She’s gone to get help. Somewhere I can’t follow.'),
      KA('Then we look on our own. Get on. My uncle’s bike. He doesn’t know.'),
    ],
    choices: [
      {
        id: 'get-on',
        label: 'Get on the back.',
        then: [N('You climb on the carrier with Kanta’s schoolbag digging into your knees, and he pushes off.')],
      },
      {
        id: 'hedge',
        label: 'Look at the hedge once more.',
        then: [N('You look back at the hedge. You did go looking for the way in, and it remembers.')],
      },
    ],
  },
  {
    id: 'a17-14-tunnel-hunt-done',
    lines: [
      N('Kanta pedals hard along the lane, standing up, shouting Mei’s name at every turning. Twice he shouts it at a cow. The cow takes it well.'),
    ],
  },
  // ---------------------------------------------------------------- A17-14, step 2 scene and done (hunt)
  {
    id: 'a17-14-call-hunt',
    lines: [
      N('From the hill behind you comes a roar. It rolls out over the whole valley like thunder.'),
      KA('What was that? Thunder? There’s no clouds.', 'shock'),
      N('A wind comes over the rice from behind you. The rice bends flat in a long line, as if something huge is running across it.'),
      N('Two yellow lights go over your heads, along the power lines, and away towards the hills. Nobody in the fields looks up.'),
      KA('Did you see that? What did you see?'),
      N('Up top, as it goes, there is a sign. You can just read it: MEI.'),
      Y('That way. Follow it. Follow the wind.'),
    ],
    choices: [
      {
        id: 'follow',
        label: 'Point Kanta after the lights.',
        then: [KA('That’s the old road. Out by the statues. Hold on!'), N('He stands on the pedals. The bicycle rattles like a tin of nails.')],
      },
      {
        id: 'kanta',
        label: 'Tell Kanta what you saw.',
        then: [KA('A bus. Shaped like a cat. Running on the wires.'), N('He doesn’t laugh. He turns the bicycle that way, and pedals.')],
      },
    ],
  },
  {
    id: 'a17-14-call-hunt-done',
    lines: [
      N('The wind dies away ahead of you. Kanta keeps pedalling the way it went, and doesn’t ask any more questions.'),
    ],
  },
  // ---------------------------------------------------------------- A17-14, complete (hunt)
  {
    id: 'a17-14-complete-hunt',
    lines: [
      N('The old road runs out between the fields, white in the dusk. Kanta is breathing like a pump, and doesn’t slow down.'),
      KA('If she’s hurt. If she’s fallen in a ditch.', 'sad'),
      Y('She isn’t. My Nubbin’s with her.'),
      KA('Your Nubbin’s the size of a rice ball.'),
      Y('It’s with her.'),
      N('Kanta doesn’t answer. He pedals faster.'),
    ],
  },
  // ---------------------------------------------------------------- A17-15, step 1 scene (hunt)
  {
    id: 'a17-15-statues-hunt',
    lines: [
      N('The bicycle comes round a bend, and there by the verge stands a row of six small stone statues in red bibs.'),
      N('They are Jizo, keeping the road. Someone has put fresh flowers at their feet.'),
      N('Beside them, in a whirl of dust and leaves, Satsuki and Mei are holding each other tight. Mei still has her corn.'),
      N('Behind them, by the road, something is waiting, huge and furry and grinning, with its door open.'),
      KA('Mei! She’s there! She’s all right! Mei!', 'happy'),
      N('Kanta can see the girls, but not what they are standing next to. You can.'),
      N('Your Nubbin comes running down the road to you, as fast as its legs go, and throws itself at your shins.'),
    ],
    choices: [
      {
        id: 'nubbin',
        label: 'Pick your Nubbin up.',
        then: [N('You pick your Nubbin up. It is warm and dusty, and it has walked a very long way on very short legs.')],
      },
      {
        id: 'wave',
        label: 'Wave to the sisters.',
        then: [N('Satsuki sees you over Mei’s head. She can’t wave, with her arms full of sister, so she nods instead, fiercely.')],
      },
    ],
  },
  // ---------------------------------------------------------------- A17-15, step 2 scene and done (hunt)
  {
    id: 'a17-15-sign-hunt',
    lines: [
      N('You get off the bicycle and start towards them. It is not very far; it is just too far.'),
      N('Satsuki turns to the waiting thing, and bows a little, and asks it something you can’t hear.'),
      N('Up top, its sign rolls round, and stops. You can read it from here: SHICHIKOKUYAMA HOSPITAL.'),
      N('The sisters climb in, Mei holding up the corn, and the door closes. The Catbus looks at you, and grins, and leaps.'),
      N('A gust of wind goes over the six statues and away towards the hills. The flowers at their feet nod, and are still.'),
      KA('Where did they go? They were just there. They were just there!', 'shock'),
      Y('The hospital. They’ve gone to see their mother.'),
      KA('That’s miles. How can they…', 'think'),
    ],
    choices: [
      {
        id: 'follow',
        label: '“We can go too.”',
        then: [KA('On my uncle’s bike. In the dark. Over the hill.'), N('He thinks about it for exactly one second.'), KA('Get on.')],
      },
      {
        id: 'granny',
        label: '“Somebody has to tell Granny.”',
        then: [
          N('A farmer comes by with a handcart. Kanta shouts to him to run and tell Granny that Mei is found, and safe.'),
          KA('There. Now get on. We’re going to the hospital.'),
        ],
      },
    ],
  },
  {
    id: 'a17-15-sign-hunt-done',
    lines: [
      N('The six statues stand in their red bibs in the last of the light, keeping the road, as they always have.'),
    ],
  },
  // ---------------------------------------------------------------- A17-15, complete (hunt)
  {
    id: 'a17-15-complete-hunt',
    lines: [
      ...HUNT_ROAD,
      N('Up the long hill you walk it, and down the other side Kanta lets it fly, and your Nubbin’s ears blow straight back.'),
      KA('I’m going to be in so much trouble.', 'happy'),
      N('He doesn’t sound as if he minds at all.'),
    ],
  },
  // ---------------------------------------------------------------- A17-16, step 1 scene (hunt)
  {
    id: 'a17-16-window-hunt',
    lines: [
      N('It is nearly dark when you reach the hospital. You stop on the road below, under the pines, with the bicycle ticking.'),
      N('One window above you is lit and open. Through it you can see Mr Kusakabe sitting on the edge of the bed.'),
      N('Mrs Kusakabe is sitting up, laughing at something he said. She looks tired, but she is laughing.'),
      MO('You needn’t have come all this way. It’s only a cold. The doctor’s fussing.', 'happy'),
      FA('You’d have come, if it were me.'),
      N('In the tall pine opposite the window, the branches sag, as if something heavy and furry were lying along them.'),
      N('And on a branch, two small shapes are sitting very still: one in a yellow hat.'),
      KA('Is that them? Up the tree? How did they get up there?', 'shock'),
    ],
    choices: [
      {
        id: 'shh',
        label: 'Shh him.',
        then: [N('You put a finger to your lips. Kanta shuts his mouth so fast his teeth click, and stares up at the pine.')],
      },
      {
        id: 'nubbin',
        label: 'Lift your Nubbin up so it can see.',
        then: [N('You lift your Nubbin up. It looks for a long time at the lit window, and the lady who stroked its head without looking.')],
      },
    ],
  },
  // ---------------------------------------------------------------- A17-16, step 2 scene and done (hunt)
  {
    id: 'a17-16-corn-hunt',
    lines: [
      MO('I just wanted to see the girls this weekend. That’s all. I wanted to see them so much.', 'soft'),
      N('In the pine, something long and pale reaches out from the branches, slowly, towards the open window.'),
      N('When it draws back, there is an ear of corn on the windowsill. Nobody inside saw it come.'),
      MO('I thought I saw Satsuki and Mei just now. In that pine tree. Smiling at me.', 'think'),
      FA('Did you? Well. Look at this.'),
      N('He picks the corn up off the sill and turns it over. Scratched into the husk, in two hands at once: To Mother.'),
      N('He looks out at the dark pine a long moment, then down at the road, at two people and a Nubbin under the trees.'),
      N('He lifts his hand, just a little. You lift yours.'),
    ],
  },
  {
    id: 'a17-16-corn-hunt-done',
    lines: [
      N('A gust goes through the pine, and it springs back up straight. The two small shapes are gone.'),
      N('Two yellow lights go away over the hills towards home. Kanta watches them all the way, and says nothing at all.'),
    ],
  },
  // ---------------------------------------------------------------- A17-16, complete (hunt)
  {
    id: 'a17-16-complete-hunt',
    lines: [
      ...HUNT_ROAD,
      N('It is full dark when you reach the old house gate. Granny is on the step with the lamp, with both girls asleep against her.'),
      GR('There you are. You bad boy. You good boy. Oh, the pair of you.', 'soft'),
      N('Kanta goes red to the ears, and is very busy with the bicycle.'),
      N('Later in the summer Mrs Kusakabe comes home. It was only a cold, and she is getting well.'),
      N('She comes up the road from the bus stop, slowly, and the girls run down to meet her. You watch from Granny’s step, with Kanta.'),
      N('Then the page goes soft under your hand, and it is the Grove, with Nova’s atlas on your knee.'),
      N('Your Nubbin adds a leaf it will not take off, even in the bath, to its collection. By the lane stands a bench like a country bus stop; on the shelf, an ear of corn, dried gold.'),
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake: the oak (s1Done; Moss present)
  {
    id: 'a17-grove-oak',
    lines: [
      N('You step out of Nova’s atlas into the Grove. Something on the western hill has changed.'),
      N('By the flat stone where Moss sits there is an oak. Not a sapling: a full-grown oak, its crown spread over half the hill.'),
      N('Moss is on his stone underneath it, looking up. He doesn’t look round when you come up the path.'),
      N('He looks for a long time. Long enough for your Nubbin to sit down, and then lie down, and then fall asleep.'),
      M('I planted one of those when the valley was young. It took four hundred years. You’ve been cheating.', 'think'),
    ],
    choices: [
      {
        id: 'tell',
        label: 'Tell him where the acorn went.',
        then: [
          Y('It was Hazel’s acorn. I planted it somewhere. I had a lot of help.'),
          M('She always did get help. Never once asked for it, mind. It just turned up.', 'soft'),
        ],
      },
      {
        id: 'sit',
        label: 'Sit down on the stone beside him.',
        then: [N('You sit beside him, and neither of you says anything. The oak creaks the way old trees do, though this one is new.')],
      },
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake: the oak, the first acorn (follows a17-grove-oak)
  {
    id: 'a17-grove-oak-acorn',
    lines: [
      M('It’s a good tree. Bad manners, growing that fast. Good tree.', 'soft'),
      N('Something drops through the leaves and lands in your hand. An acorn: the oak’s first.'),
      M('There. It gives back. Put it on the string. Then something of hers is walking about the Grove again, and something of mine.', 'soft'),
      N('You thread the new acorn on to the old string. It fits as if it had been measured.'),
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake: the oak (s1Done; ending moss-sleeps)
  {
    id: 'a17-grove-oak-sleeps',
    lines: [
      N('You step out of Nova’s atlas into the Grove. On the western hill, by the flat stone where Moss always sat, there is an oak.'),
      N('It is full-grown, as if it had always been there. Its branches spread over the stone, and over his flower.'),
      N('The shade falls exactly where he used to sit.'),
      N('The Nubbins have found it already. They are asleep in a heap in its shade, all of them, breathing slowly together.'),
      N('Something drops through the leaves and lands in your hand. An acorn: the oak’s first.'),
      N('You thread it on to the old string, where his used to be. It fits as if it had been measured.'),
      N('You sit down on the flat stone a while, under the oak, and wait with them. It seems the right thing to do here.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake: the potted camphor (no s1Done)
  {
    id: 'a17-grove-camphor',
    lines: [
      N('You step out of Nova’s atlas into the Grove with a pot in your arms. In it is a young camphor tree, as high as your knee.'),
      N('Its leaves are glossy and new, and they smell clean and sharp, like a medicine chest kept in a forest.'),
      N('Your Nubbin, still in its leaf hat, sits down beside the pot with its chin on its knees.'),
      N('It has learned how you wait for a tree. It means to be very good at it.'),
    ],
  },
];

// =================================================================== flags and checks

/**
 * Every flag this line sets (Atlas save only). It reads two Grove facts (s1Done; the ending id, for moss-sleeps only)
 * and writes no Grove flag.
 */
export const ATLAS_A17_FLAGS: string[] = [
  'a17-01',
  'a17-02',
  'a17-03',
  'a17-04',
  'a17-05',
  'a17-06',
  'a17-07',
  'a17-08',
  'a17-09',
  'a17-10',
  'a17-11',
  'a17-12',
  'a17-13',
  'a17-14',
  'a17-15',
  'a17-16',
  'a17-done', // A17-16: the whole page; read by atlasDone('A17') for the Long Table festival
  'a17-tunnel', // hunt | wait (a17-06-greet): the *-hunt variants in A17-9, A17-14, A17-15, A17-16
  'a17-tree', // oak | camphor (A17-11 complete): the Grove keepsake, read through atlasFlag('a17-tree')
];

export const ATLAS_A17_CHECKS: string[] = [
  'explore:a17-road:bus-stop',
  'carry:a17-boxes:old-house',
  'watch:a17-camphor:hill',
  'find:a17-stairs:old-house',
  'talk:a17-granny:old-house',
  'carry:a17-shutters:old-house',
  'wait:a17-bath:main-room',
  'watch:a17-sprites:camphor',
  'escort:a17-bikes:hospital',
  'visit:a17-mother:hospital',
  'wait:a17-corridor:hospital',
  'watch:a17-mei:garden',
  'explore:a17-hedge:tunnel',
  'find:a17-hollow:camphor',
  'talk:a17-satsuki:clearing',
  'visit:a17-camphor:shrine',
  'walk:a17-sisters:school-road',
  'deliver:a17-umbrella:kanta',
  'collect:a17-vegetables:granny-field',
  'inspect:a17-letter:old-house',
  'escort:a17-sisters:bus-stop',
  'wait:a17-bus-stop:night',
  'watch:a17-catbus:bus-stop',
  'inspect:a17-bundle:old-house',
  'place:a17-seeds:seed-bed',
  'watch:a17-dance:seed-bed',
  'walk:a17-dance:seed-bed',
  'climb:a17-top:great-tree',
  'talk:a17-kanta:field',
  'escort:a17-satsuki:telephone',
  'sit:a17-sisters:granny-porch',
  'explore:a17-lanes:search',
  'visit:a17-pond:village',
  'explore:a17-tunnel:camphor',
  'watch:a17-catbus:sign',
  'find:a17-mei:jizo-row',
  'watch:a17-sign:jizo-row',
  'watch:a17-window:hospital',
  'place:a17-corn:sill',
];
