/**
 * Atlas campaign, page A9: The Comet (Part L). Twelve quests, A9-1 to A9-12.
 *
 * SOURCE. Tove Jansson, Comet in Moominland (Kometjakten, 1946; revised as Kometen kommer, 1968).
 * Copyrighted: the Moomin characters and books belong to Moomin Characters Oy Ltd (Helsinki). The
 * English translations are also in copyright and were not used. Every line here is our own; the
 * plot follows the outline in docs/atlas.md and the details Maor's brief marks as verified (the
 * Hemulen hunts butterflies; the octopus, where the Snork Maiden rescues Moomintroll; the tornado
 * and a Hemulen's dress used as a glider; the comet due on 7 October at 8:42 in the evening).
 * Anything else that follows the book (the grey sea, the raft, the Observatory, the poisonous bush,
 * the dry sea and the stilts, the cave by the shore) is retold in our own words and staging.
 *
 * AUDIENCE. 'all'. No lifted text, so no childLines are needed. The Learning Grove's own versions
 * (both bands: comets and their tails, telling the time to the minute, Finland's two languages,
 * naming worries) are not in this file.
 *
 * FRAME. Nova's atlas opens on a grey morning in a green valley by the sea. You are a walker on the
 * road, a guest who tags along; your Nubbin rides in Sniff's pocket for most of the page (the
 * running gag: Sniff counts it among his valuables, and then, slowly, among his friends). The
 * heroes keep their story: Moomintroll rescues, the Snork Maiden rescues back, Moominmamma has
 * the cave ready. You carry, walk, sit, and answer one question. Moomin folk talk, as in the book
 * (canon 31). Your Nubbin never talks.
 *
 * GROVE STATE READ: none. The outline reads no Grove flag, and the Atlas never writes one.
 * Hazel is absent from the page. Engine data elsewhere: S24 (side-stories-s24.ts) defines a margin
 * note in Hazel's hand that shows beside A9-11 "The Cave" once s24Done is set; this page has no
 * margin variant of its own, and needs none.
 *
 * VARIANT DEFAULTS. a09-answer is always set before A9-11 (A9-11 requires A9-4, whose step
 * choice is required); if it were somehow unset, the base a09-11-dark plays. a09-brought is set by
 * the required choice in a09-11-door; unset or nubbin plays the base a09-12-dawn-done.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a09-):
 *   - a09-01 … a09-12 on each quest; a09-done on A9-12 (the Grove's atlas shelf can read it through
 *     atlasDone('A9'), as the other pages do).
 *   - a09-answer = dunno | home (A9-4, a09-04-step): THE SIGNATURE CHOICE, Sniff's question on the
 *     Observatory step. Paid off seven quests later in A9-11: a09-11-dark is the base scene (dunno:
 *     Sniff holds your hand and says nothing); for home play ATLAS_A09_VARIANTS a09-11-dark-home
 *     (Sniff says your words back to you in the dark). Also echoed lightly, with no variant, in the
 *     A9-6 meeting's minutes and the A9-10 race (both lines work for either answer).
 *   - a09-brought = shell | garnet | nubbin (A9-11, a09-11-door): what you bring into the cave.
 *     Paid off in A9-12: a09-12-dawn-done is the base (nubbin); for shell play a09-12-dawn-done-shell,
 *     for garnet a09-12-dawn-done-garnet (both in ATLAS_A09_VARIANTS, replacing the base).
 *
 * LIFTED TEXT: none. No quotes from the book or its translations. The harmonica tune is
 * instrumental and original; no song is sung anywhere on the page.
 *
 * REWARDS: the harmonica (A9-3, music feature), Snufkin's hat (A9-12, cosmetic) and a
 * Moominhouse-blue stove (A9-12, decoration). All one-time.
 *
 * CARE NOTES.
 *   - Gentle by nature and right for younger players. The comet is frightening the way weather is
 *     frightening; nobody is hurt, and the ending is everyone home. Worry is named and talked about,
 *     never mocked (Sniff's fear is funny, and also real, and the page takes it seriously in A9-4
 *     and A9-11).
 *   - The octopus (A9-9) and the poisonous bush (A9-5) are scary for a beat, never cruel: nobody is
 *     stung, squeezed hard or hurt, and the octopus slides back into its pool unharmed.
 *   - Hemulens wear dresses in the books, whatever else they are; that is never a joke here. Both
 *     Hemulens are "he", as in the English translations.
 *   - Art is original: round, soft, ink-and-watercolour, with no copy of Jansson's drawings or of
 *     the animated series. Names are the books' English ones.
 *   - Hazel's third rule is acted out in A9-11 (Sniff in the dark) and never quoted or named.
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

const WHERE = 'Nova’s atlas: the Comet page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const BOOK = 'Tove Jansson, Comet in Moominland (1946, revised 1968)';

// ------------------------------------------------------------------ speakers

const MOOMINTROLL = sp('a09-moomintroll', 'Moomintroll', 'Moomintroll (Tove Jansson, Comet in Moominland); original design');
const SNIFF = sp('a09-sniff', 'Sniff', 'Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design');
const MAMMA = sp('a09-moominmamma', 'Moominmamma', 'Moominmamma (Tove Jansson, Comet in Moominland); original design');
const PAPPA = sp('a09-moominpappa', 'Moominpappa', 'Moominpappa (Tove Jansson, Comet in Moominland); original design');
const MUSKRAT = sp('a09-muskrat', 'The Muskrat', 'the Muskrat, a gloomy philosopher in a hammock (Tove Jansson, Comet in Moominland); original design');
const SNUFKIN = sp('a09-snufkin', 'Snufkin', 'Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design');
const PROFESSOR = sp('a09-professor', 'The Professor', 'one of the professors at the Observatory (Tove Jansson, Comet in Moominland); original design');
const PROFESSOR_2 = sp('a09-professor-2', 'The Other Professor', 'the second professor at the Observatory (Tove Jansson, Comet in Moominland); original design');
const SNORK_MAIDEN = sp('a09-snork-maiden', 'The Snork Maiden', 'the Snork Maiden (Tove Jansson, Comet in Moominland); original design');
const SNORK = sp('a09-snork', 'The Snork', 'the Snork, her brother, fond of meetings (Tove Jansson, Comet in Moominland); original design');
const HEMULEN = sp('a09-hemulen', 'The Hemulen', 'the Hemulen who hunts butterflies (Tove Jansson, Comet in Moominland); original design');
const HEMULEN_2 = sp('a09-hemulen-2', 'The Other Hemulen', 'a second Hemulen met on the road home, whose dress becomes a glider (Comet in Moominland); original design');

const N = say('narrator');
const Y = say('you');
const MT = say('a09-moomintroll');
const SN = say('a09-sniff');
const MM = say('a09-moominmamma');
const MP = say('a09-moominpappa');
const MU = say('a09-muskrat');
const SK = say('a09-snufkin');
const PR = say('a09-professor');
const P2 = say('a09-professor-2');
const SM = say('a09-snork-maiden');
const SO = say('a09-snork');
const HE = say('a09-hemulen');
const H2 = say('a09-hemulen-2');

// =================================================================== quests

export const ATLAS_A09: Quest[] = [
  // ---------------------------------------------------------------- A9-1
  {
    id: 'a09-01',
    code: 'A9-1',
    title: 'Strange Signs',
    source: `${BOOK}: the grey morning and the tail in the sky`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [MOOMINTROLL, SNIFF, MAMMA, PAPPA, MUSKRAT],
    steps: [
      {
        id: 'a09-01-s1',
        goal: 'Step into the valley on the atlas page and meet whoever lives in the tall blue house.',
        hint: 'Touch the blue house on the page, then follow the path to the garden gate.',
        check: 'visit:a09-valley:morning',
        scene: {
          id: 'a09-01-valley',
          lines: [
            N('Nova’s atlas falls open at a green valley by the sea, with a tall blue house in it like a stove that grew.'),
            N('You touch the chimney. The page smells of wet grass, and then so does the air.'),
            N('It is morning, but a grey one. Everything looks as if somebody has dusted it with ash and forgotten to wipe it off.'),
            N('A round white someone is standing in the garden, holding a cup and frowning at the sky.'),
            MT('Oh! Hello. Are you a visitor? Mamma will be pleased. She likes visitors best on grey days.', 'happy'),
            N('A smaller, sharper someone pops out from behind the water butt and looks straight at your Nubbin.'),
            SN('What’s that? Is it valuable? It looks valuable. It looks like it would fit in a pocket.', 'think'),
            MT('That’s Sniff. He means hello.'),
            SN('I mean hello AND is it valuable.'),
          ],
          choices: [
            {
              id: 'pocket',
              label: 'Let your Nubbin try Sniff’s pocket.',
              then: [
                N('Your Nubbin climbs into Sniff’s coat pocket, turns round twice and settles, as if it has been waiting all its life for this pocket.'),
                SN('It fits! It fits exactly. I’ll be very careful with it. Probably.', 'happy'),
              ],
            },
            {
              id: 'arms',
              label: 'Keep your Nubbin in your arms for now.',
              then: [
                SN('Suit yourself. I only offered. It’s a very good pocket.', 'sad'),
                N('Your Nubbin looks at the pocket for a long moment. Then it wriggles down and climbs in anyway.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-01-valley-done',
          lines: [
            N('Moomintroll holds out a paw. It is soft, and slightly sticky with jam.'),
            MT('I’m Moomintroll. Come and see the sea. Something’s wrong with it.'),
          ],
        },
      },
      {
        id: 'a09-01-s2',
        goal: 'Follow Sniff’s secret path down to the shore and see what is wrong with the sea.',
        hint: 'Take the narrow path behind the woodshed; it goes through the bushes, not round them.',
        check: 'walk:a09-shore:secret-path',
        scene: {
          id: 'a09-01-shore',
          lines: [
            SN('This is my secret path. I found it. Nobody else knows about it.'),
            MT('I know about it.'),
            SN('Nobody else EXCEPT you. And now them. It’s getting very crowded for a secret.', 'angry'),
            N('The path ducks under brambles and comes out on a beach of round stones. The sea is the colour of an old spoon.'),
            N('A fine grey dust floats on it. It moves when the water moves, and it does not wash away.'),
            MT('It was blue yesterday. It’s always been blue.', 'sad'),
            N('Along the shore, under a lip of rock, there is a cave. The mouth is low; inside it is dry, and the floor is soft sand.'),
            SN('That’s our cave. Mine, mostly. You can come in, but don’t touch anything.'),
            N('There is nothing in it to touch. Sniff looks round it proudly anyway.'),
          ],
        },
        done: {
          id: 'a09-01-shore-done',
          lines: [
            N('You sit in the cave mouth and watch the grey sea breathe in and out.'),
            MT('Mamma would like this cave. It feels like being kept.', 'soft'),
          ],
        },
      },
      {
        id: 'a09-01-s3',
        goal: 'Ask the Muskrat in the hammock what the grey dust means.',
        hint: 'He is in the hammock between the two birch trees, and he will not be getting out of it.',
        check: 'talk:a09-muskrat:hammock',
        scene: {
          id: 'a09-01-hammock',
          lines: [
            N('Back in the garden, a Muskrat lies in a hammock with his paws folded on his stomach, thinking very hard about nothing.'),
            MT('Muskrat, the sea’s gone grey. Do you know why?'),
            MU('Of course I know why. Something is coming. Something always is.', 'think'),
            MU('A comet, very probably. A star with a tail, falling where it likes.'),
            SN('Falling where? Not here. Somewhere else. Somewhere a long way off with nothing valuable in it.', 'shock'),
            MU('Where it falls is no concern of a philosopher. Everything ends. It is rather restful, if you think about it.'),
            N('Sniff does think about it. You can tell, because he goes the colour of the sea.'),
            N('Moominpappa comes out on the veranda with his hat on, which is how you know he has had an idea.'),
            MP('There’s an Observatory in the Lonely Mountains, full of professors with telescopes. They’ll know.'),
            MP('Somebody should go and ask them. Somebody young, and brave, with a good raft.', 'happy'),
          ],
          choices: [
            {
              id: 'brave',
              label: '“We’ll go.”',
              then: [
                Y('We’ll go.'),
                MT('Yes! We’ll go. All of us. Sniff too.', 'happy'),
                SN('Sniff too? Who said Sniff too?', 'shock'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask the Muskrat if he’s ever been wrong.',
              then: [
                MU('Once. I thought I would get a whole afternoon without being asked questions.', 'angry'),
                MT('That means he doesn’t know. We’ll go and ask the professors.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-01-hammock-done',
          lines: [
            N('That night you all stand on the veranda, and Moominmamma points.'),
            N('Low over the mountains there is a new star. It has a tail, faint and red, like a match just blown out.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-01-complete',
      lines: [
        MM('Well. If you’re going, you’re going properly. Pullovers. Sandwiches. Something for colds.', 'soft'),
        MM('And you’ll come home when you’ve found out. Whatever they say.'),
        MT('We’ll come home, Mamma. Of course we will.'),
        N('Sniff pats his pocket. Your Nubbin pats back from the inside.'),
        SN('I’m only going because the Nubbin wants to. Somebody has to look after it.'),
      ],
    },
    rewards: [],
    sets: { 'a09-01': true },
    notes:
      'OPENING: the page is a green valley by the sea with a tall, round blue house; the whole palette is washed grey in this ' +
      'quest (a grey overlay on sky and sea that lifts only in A9-12). The cave on the shore must be drawn here; it is the ' +
      'shelter in A9-11. FROM HERE ON: your Nubbin rides in Sniff’s coat pocket in every scene unless a line takes it out (art: ' +
      'its head pokes out; it ducks in when Sniff panics). The tail in the sky grows a little in every quest after this one.',
  },

  // ---------------------------------------------------------------- A9-2
  {
    id: 'a09-02',
    code: 'A9-2',
    title: 'The Raft',
    source: `${BOOK}: setting off downriver`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-1') },
    requires: ['A9-1'],
    speakers: [MOOMINTROLL, SNIFF, MAMMA, PAPPA],
    steps: [
      {
        id: 'a09-02-s1',
        goal: 'Help Moominpappa build a raft on the riverbank.',
        hint: 'Carry planks from the woodshed to the bank; Moominpappa will tell you where they go.',
        check: 'build:a09-raft:river',
        scene: {
          id: 'a09-02-build',
          lines: [
            N('Moominpappa has laid out planks on the riverbank in the shape of a raft, and is walking round them looking pleased.'),
            MP('Now. A raft must be sound, and it must have a mast, and it must have a name.', 'think'),
            MT('Does it need a name?'),
            MP('Everything that goes anywhere needs a name. Otherwise how will it know it’s gone?'),
            N('You carry planks and Moomintroll ties knots. Sniff supervises from a stump and offers advice nobody takes.'),
            SN('That plank’s crooked. That one’s too short. That one is fine, I suppose, if you like that sort of plank.'),
            N('By noon there is a raft, and it floats. Moominpappa looks as if he has built a ship of the line.'),
            MP('What shall we call her?', 'happy'),
          ],
          choices: [
            {
              id: 'mamma',
              label: 'Suggest calling it after Moominmamma.',
              set: { 'a09-raft': 'mamma' },
              then: [
                MP('Ah. Yes. Then she’ll be sure to bring you home.', 'soft'),
                N('He paints the name on the stern in careful blue letters.'),
              ],
            },
            {
              id: 'sniff',
              label: 'Suggest “The Valuable”.',
              set: { 'a09-raft': 'valuable' },
              then: [
                SN('Oh. Oh, that’s a very good name. That’s the best name.', 'happy'),
                N('Moominpappa paints it on, and Sniff stands next to it for a long time with his paws behind his back.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-02-build-done',
          lines: [
            N('Moominmamma comes down the bank with a basket so full the lid will not close.'),
            MM('Sandwiches on top. Pullovers underneath. Don’t eat the pullovers.', 'happy'),
          ],
        },
      },
      {
        id: 'a09-02-s2',
        goal: 'Load the raft and push off into the river.',
        hint: 'The basket goes in the middle; Sniff’s things go wherever Sniff can be talked into putting them.',
        check: 'carry:a09-raft:launch',
        scene: {
          id: 'a09-02-launch',
          lines: [
            N('Sniff arrives with a sack of his things: a tin box, a broken compass, a piece of red glass and a great many buttons.'),
            MT('Sniff, there isn’t room for all that.'),
            SN('There’s room for the Nubbin. The Nubbin’s valuable. These are valuable. It’s the same thing.', 'angry'),
            N('Your Nubbin, in his pocket, looks at the sack. Then it looks at you.'),
            MM('Sniff, dear. Things are lovely, but they don’t row.', 'soft'),
            SN('These ones might. You don’t know. Nobody’s ever asked them.'),
          ],
          choices: [
            {
              id: 'one',
              label: 'Help Sniff choose the one thing he’d miss most.',
              then: [
                N('It takes Sniff a very long time. In the end he picks the red glass, because the sun comes through it.'),
                SN('The rest can stay with Moominmamma. She’s nearly as careful as me.', 'soft'),
              ],
            },
            {
              id: 'all',
              label: 'Find room for all of it.',
              then: [
                N('You find room. The raft sits a little lower in the water and turns, very slowly, in a circle.'),
                N('Halfway round, Sniff quietly takes the buttons back up the bank to Moominmamma.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-02-launch-done',
          lines: [
            N('Moominpappa pushes the raft off with his foot. Moominmamma waves her apron until the bend.'),
            N('Then there is only the river, the grey sky and the red tail low over the hills.'),
          ],
        },
      },
      {
        id: 'a09-02-s3',
        goal: 'Steer the raft downriver until it is time to make camp.',
        hint: 'Keep to the middle of the river and watch the banks.',
        check: 'explore:a09-river:dusk',
        scene: {
          id: 'a09-02-river',
          lines: [
            N('The river carries you through woods and meadows. Everything you pass seems to be leaving.'),
            N('Birds fly low and quiet, all one way. A line of ants crosses a log with their eggs held over their heads.'),
            MT('Where are they all going?'),
            SN('Away. Which is what sensible people do. We’re going TOWARDS it.', 'shock'),
            MT('We’re going towards finding out. That’s different.'),
            SN('It doesn’t feel different. It feels exactly the same.', 'sad'),
            N('The river forks round a rock. One way is quick and white; the other is slow and dark under the trees.'),
          ],
          choices: [
            {
              id: 'quick',
              label: 'Take the quick channel.',
              then: [
                N('The raft bucks and spins and shoots out into a pool, and everybody laughs, even Sniff, once it is over.'),
                SN('I wasn’t frightened. My pocket was frightened.', 'happy'),
              ],
            },
            {
              id: 'slow',
              label: 'Take the slow channel.',
              then: [
                N('You drift under the trees in green half-dark. A heron watches you go by and does not bother to move.'),
                MT('This is nice. You could almost forget.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-02-river-done',
          lines: [
            N('At dusk you pull in to a sandy bank. Moomintroll unpacks the sandwiches.'),
            N('Upstream, a thin line of smoke rises from somebody else’s fire.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-02-complete',
      lines: [
        N('Sniff eats his sandwich very slowly, to make it last.'),
        SN('When I was small, I thought the sky was a lid. Like on a tin. And nothing could get through it.', 'soft'),
        MT('And now?'),
        SN('Now I think it’s just sky. Anything can get through sky.', 'sad'),
        N('Your Nubbin climbs out of his pocket and sits on his knee, which is as near as it can get to a lid.'),
      ],
    },
    rewards: [],
    sets: { 'a09-02': true },
    notes:
      'The raft has a small mast and a name painted on the stern (Moominmamma’s name or "The Valuable", from the choice; ' +
      'art only, no flag). Sniff’s sack: tin box, broken compass, red glass, buttons. The red glass rides with him to the end ' +
      'either way. River staging: woods, meadows, birds and ants leaving, the grey overlay.',
  },

  // ---------------------------------------------------------------- A9-3
  {
    id: 'a09-03',
    code: 'A9-3',
    title: 'Snufkin',
    source: `${BOOK}: the wanderer by the river`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-2') },
    requires: ['A9-2'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN],
    steps: [
      {
        id: 'a09-03-s1',
        goal: 'Find whoever is camping upstream.',
        hint: 'Follow the smoke along the bank; listen for music.',
        check: 'find:a09-tent:riverbank',
        scene: {
          id: 'a09-03-camp',
          lines: [
            N('You follow the smoke along the bank. Before you see the fire, you hear a tune.'),
            N('It is a harmonica, playing something that goes up like a question and comes down without needing an answer.'),
            N('A small green tent stands by the water. In front of it, someone in an old green hat sits on a stone, fishing.'),
            N('The tune stops. He does not turn round.'),
            SK('Come and sit down, if you’re coming. The fish have heard you anyway.'),
            MT('We didn’t mean to scare them.'),
            SK('They don’t mind. They’re only pretending to be scared, so they don’t have to be caught.', 'happy'),
          ],
        },
        done: {
          id: 'a09-03-camp-done',
          lines: [
            SK('I’m Snufkin. There’s coffee, if you don’t mind it out of the one cup.'),
            N('He passes the cup round, and it goes round twice. Nobody minds.'),
          ],
        },
      },
      {
        id: 'a09-03-s2',
        goal: 'Sit by Snufkin’s fire and hear how he travels.',
        hint: 'Sit on the log nearest the fire.',
        check: 'sit:a09-campfire:evening',
        scene: {
          id: 'a09-03-fire',
          lines: [
            N('Sniff is looking around the camp with growing alarm.'),
            SN('Where’s all your stuff?', 'shock'),
            SK('This is all my stuff. A tent, a pipe, a cup, a harmonica. A hat.', 'think'),
            SN('That’s not stuff. That’s hardly anything. What do you do when you want something?'),
            SK('I look at it. Then I leave it where it is, and it’s still beautiful, and I don’t have to carry it.'),
            N('Sniff holds his pocket as if Snufkin might suggest leaving your Nubbin where it is.'),
            SK('Not that. You don’t own a friend; you just walk next to them.', 'soft'),
          ],
          choices: [
            {
              id: 'where',
              label: 'Ask where he’s going.',
              then: [
                SK('South, in the end. I always go south in the end. But I’ve no hurry.'),
                SK('Except there’s that.'),
                N('He tips his hat back and looks at the tail over the hills.'),
              ],
            },
            {
              id: 'lonely',
              label: 'Ask if he ever gets lonely.',
              then: [
                SK('Sometimes. Then I go and find someone. Then I go away again. Both are good.', 'think'),
                MT('You could come with us.'),
                SK('I could.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-03-fire-done',
          lines: [
            N('He plays again, softer. The tune goes round the fire and out over the water, and comes back sounding older.'),
            N('Your Nubbin climbs out of Sniff’s pocket and sits by Snufkin’s boot to listen.'),
          ],
        },
      },
      {
        id: 'a09-03-s3',
        goal: 'Look at the comet with Snufkin before you all sleep.',
        hint: 'Walk down to the water’s edge, where the trees open up.',
        check: 'watch:a09-sky:tail',
        scene: {
          id: 'a09-03-sky',
          lines: [
            N('By the water the trees open up. The comet is brighter than last night, and its tail is longer.'),
            SK('It looks lonely, doesn’t it. Coming all that way on its own, and nobody pleased to see it.', 'soft'),
            MT('Are you frightened of it?'),
            SK('A bit. Being frightened’s all right. It just means you’ve noticed something.'),
            SN('I’ve noticed EVERYTHING.', 'sad'),
            SK('Then you’re very well informed, Sniff.'),
            N('Sniff thinks about this, and decides it is a compliment, and stands slightly taller.'),
            SK('I’ll come with you to the mountains. I like a mountain, and I’d like to know about this one.', 'think'),
          ],
        },
        done: {
          id: 'a09-03-sky-done',
          lines: [
            N('Snufkin rummages in his tent and comes out with a second harmonica, dented, with one cover loose.'),
            SK('I’ve got two. I don’t like having two of anything. It makes me feel heavy.'),
            N('He holds it out to you.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-03-complete',
      lines: [
        N('You try a note. It comes out like a duck in a cupboard.'),
        SK('That’s the right note. You just played it in the wrong place.', 'happy'),
        N('Your Nubbin claps. Sniff claps, a beat later, because the Nubbin did.'),
        SK('Play it when you’re home. Then the tune will know where it lives.'),
      ],
    },
    rewards: [
      {
        id: 'a09-harmonica',
        kind: 'feature',
        label: 'Snufkin’s Spare Harmonica',
        description:
          'A dented harmonica with one cover loose. Play it in the Grove and your Nubbins stop to listen, and sometimes sway along.',
      },
    ],
    sets: { 'a09-03': true },
    notes:
      'MUSIC: Snufkin’s tune is an original instrumental for harmonica (sound brief: rising like a question, falling without ' +
      'an answer). No lyrics, no song from the books or the series. The harmonica reward plays short original phrases in the ' +
      'Grove (music feature). From here on Snufkin travels with the party. Snufkin: green hat, pipe (unlit on screen), green tent.',
  },

  // ---------------------------------------------------------------- A9-4
  {
    id: 'a09-04',
    code: 'A9-4',
    title: 'The Observatory',
    source: `${BOOK}: the professors and the date`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-3') },
    requires: ['A9-3'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, PROFESSOR, PROFESSOR_2],
    steps: [
      {
        id: 'a09-04-s1',
        goal: 'Climb the Lonely Mountains to the Observatory.',
        hint: 'Follow the cairns up the path. Snufkin knows where the rope is needed.',
        check: 'climb:a09-mountain:observatory',
        scene: {
          id: 'a09-04-climb',
          lines: [
            N('The Lonely Mountains are grey stone and grey sky, with nothing growing on them that has not had to argue for it.'),
            N('The path zigzags up. Snufkin goes first, then Moomintroll, then you, then Sniff, complaining.'),
            SN('My legs are shorter than everybody’s. That means this mountain is taller for me. It isn’t fair.'),
            SK('Then you’ll have climbed more of it than anybody, when we’re at the top.', 'happy'),
            SN('…I hadn’t thought of that.'),
            N('Halfway up there is a steep slab. Snufkin ties a rope round a rock and throws you the end.'),
            N('Above you, against the clouds, sits a round white building with a slot in its roof, like a money box for stars.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Give Sniff a hand up the slab.',
              then: [
                N('Sniff takes your hand and pretends he does not need it, and holds on hard all the way.'),
                SN('I could have done it. I just didn’t want to.'),
              ],
            },
            {
              id: 'wait',
              label: 'Wait at the top and let Sniff do it himself.',
              then: [
                N('It takes him a while. When he gets to the top, he is so proud of himself he forgets to complain.'),
                SN('Did you see? Did everybody see?', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-04-climb-done',
          lines: [
            N('The Observatory door is open. Inside, somebody is counting in a whisper.'),
          ],
        },
      },
      {
        id: 'a09-04-s2',
        goal: 'Ask the professors when the comet will come.',
        hint: 'They are by the great telescope. You may have to ask twice.',
        check: 'talk:a09-professors:telescope',
        scene: {
          id: 'a09-04-telescope',
          lines: [
            N('Two professors stand under a telescope as long as a boat, both writing in notebooks and not looking up.'),
            MT('Excuse me. We’ve come from the valley by the sea. We want to know about the comet.'),
            PR('So do we. Everybody does. It is a most remarkable comet.', 'happy'),
            P2('Most remarkable. Its tail alone is a thousand…'),
            PR('Two thousand.'),
            P2('…a great many miles long.'),
            MT('But when will it come? And where?'),
            PR('It will arrive on the seventh of October, at eight forty-two in the evening. To the minute.', 'think'),
            P2('Possibly eight forty-three. We are arguing about the forty-three.'),
            MT('And where will it land?'),
            PR('Oh, somewhere about here, we think. It will be extremely interesting to observe.', 'happy'),
          ],
        },
        done: {
          id: 'a09-04-telescope-done',
          lines: [
            N('Nobody says anything. One of the professors writes down that nobody says anything.'),
            MT('Mamma doesn’t know. She doesn’t know the date.', 'shock'),
            SK('Then we’d better take it to her.'),
          ],
        },
      },
      {
        id: 'a09-04-s3',
        goal: 'Sit with Sniff on the Observatory step before you go back down.',
        hint: 'He is on the outside step, holding his pocket.',
        check: 'sit:a09-step:observatory',
        scene: {
          id: 'a09-04-step',
          lines: [
            N('Outside, the light is going. Moomintroll is already at the top of the path, hopping from foot to foot to be gone.'),
            N('Sniff sits on the step with both paws round his pocket. Your Nubbin is asleep in it.'),
            N('You sit down next to him. The comet hangs over the far peaks, closer than yesterday.'),
            SN('The seventh is in four days. I counted.', 'sad'),
            SN('Will it hit? You can tell me. I’m very brave about things, once I know them.'),
            N('He looks at you. He is not very brave, and you both know it, and he is asking anyway.'),
          ],
          choices: [
            {
              id: 'dunno',
              label: '“I don’t know.”',
              set: { 'a09-answer': 'dunno' },
              then: [
                Y('I don’t know, Sniff.'),
                N('He nods slowly, as if that is a heavier thing to carry than a yes, and also a truer one.'),
                SN('No. Nobody does. Not even them, with their telescope.', 'soft'),
              ],
            },
            {
              id: 'home',
              label: '“We’ll be home by then.”',
              set: { 'a09-answer': 'home' },
              then: [
                Y('We’ll be home by then.'),
                N('Sniff looks at you for a long moment. Then he tucks the words away somewhere, like a button.'),
                SN('Home by then. All right.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-04-step-done',
          lines: [
            N('Sniff gets up, and then, after a moment, holds out his paw to help you up. It is the first thing he has ever given anybody.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-04-complete',
      lines: [
        N('You start down the mountain in the dark, by the light of the comet, and sleep under an overhang halfway.'),
        SK('Four days. That’s enough to get home, if nobody stops to look at anything.'),
        SN('I always stop to look at things.'),
        SK('So do I. We’ll have to look quickly.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a09-04': true },
    notes:
      'THE DATE (verified): the comet is due on 7 October at 8:42 in the evening. Show it on screen as "7 October, 8:42 pm" ' +
      'in the journal once a09-04-telescope plays; the professors’ "eight forty-three" is our own joke. The journal date is ' +
      'story time only: there is no real-world countdown and nothing on the page is timed. THE SIGNATURE CHOICE ' +
      '(a09-04-step): a09-answer = dunno | home. Paid off in A9-11 (a09-11-dark is dunno; ATLAS_A09_VARIANTS ' +
      'a09-11-dark-home is home). The Observatory: round, white, a slot in the dome; two professors, original designs.',
  },

  // ---------------------------------------------------------------- A9-5
  {
    id: 'a09-05',
    code: 'A9-5',
    title: 'The Snork Maiden',
    source: `${BOOK}: the gold ring and the poisonous bush`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-4') },
    requires: ['A9-4'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, SNORK_MAIDEN],
    steps: [
      {
        id: 'a09-05-s1',
        goal: 'Look into the glinting crack in the rocks on the way down.',
        hint: 'It is beside the path where it turns, just below the rope.',
        check: 'find:a09-ring:crevice',
        scene: {
          id: 'a09-05-crevice',
          lines: [
            N('In the morning, on the way down, something glints in a crack in the rock.'),
            N('Moomintroll lies on his stomach and reaches in up to the shoulder. He comes out with a small gold ring.'),
            MT('It’s too big for a paw and too small for a crown. What’s it for?', 'think'),
            SN('It’s for me. I saw it first. I saw the glint before the glint even glinted.'),
            MT('You were looking at your feet.'),
            SN('I saw it with my feet.', 'angry'),
            N('Sniff goes off to sulk behind a boulder, and comes back with a tiny red stone, polished by the weather.'),
            SN('Fine. I found my own. It’s a garnet, probably. It’s better than a ring, probably.'),
            N('He turns it over in his paw. Then, for no reason anybody can see, he holds it out to you.'),
            SN('You hold it. Not keep it. Hold it. I’ve got too many pockets full.', 'soft'),
          ],
        },
        done: {
          id: 'a09-05-crevice-done',
          lines: [
            N('The garnet is warm from his paw. Snufkin raises an eyebrow at Sniff, and says nothing, kindly.'),
          ],
        },
      },
      {
        id: 'a09-05-s2',
        goal: 'Run to whoever is calling for help in the valley below.',
        hint: 'Follow the voice down into the trees. Stay behind Moomintroll.',
        check: 'inspect:a09-bush:valley',
        scene: {
          id: 'a09-05-bush',
          lines: [
            N('Below the mountain there is a valley of strange, thick plants. Somebody in it is shouting for help.'),
            N('In a clearing a bush with long dark branches has wound itself round a small someone with a golden fringe.'),
            N('The branches move slowly, like fingers that have all the time in the world.'),
            SM('Don’t touch it! It stings! Its leaves are poison!', 'shock'),
            N('Moomintroll does not even stop. He pulls out his penknife and goes at the branches.'),
            MT('Hold still! Hold quite still!'),
            N('Snufkin pulls branches back with his walking stick. You find a long dead branch and pin the nearest one down.'),
            N('Your Nubbin hides in Sniff’s pocket, and Sniff hides behind you. Everyone is, in their way, helping.'),
          ],
        },
        done: {
          id: 'a09-05-bush-done',
          lines: [
            N('The last branch gives. Moomintroll catches her before she falls, and they both sit down hard in the grass.'),
            SM('You came straight at it. You didn’t even think.', 'soft'),
            MT('There wasn’t time to think. I’ll think later.'),
          ],
        },
      },
      {
        id: 'a09-05-s3',
        goal: 'See the gold ring find its owner.',
        hint: 'Sit with everyone in the clearing while she gets her breath back.',
        check: 'give:a09-ring:snork-maiden',
        scene: {
          id: 'a09-05-ring',
          lines: [
            N('She is shaking a little, and pretending not to. She smooths her fringe and checks it twice.'),
            SM('I was looking for something. I lost a gold ring in the mountains, a little one I wear round my ankle.', 'sad'),
            N('Moomintroll goes very pink and holds out his paw.'),
            MT('Is it this?'),
            SM('My ankle ring! Where did you find it?', 'happy'),
            MT('In a crack. I reached in up to here.'),
            SN('I saw it first.'),
            SM('Then thank you both. Thank you very much.', 'happy'),
            N('Sniff, who was ready for an argument, has nowhere to put it and goes rather quiet.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell her about the comet.',
              then: [
                Y('There’s a comet coming. The seventh, at eight forty-two in the evening.'),
                SM('I know. I’ve seen the tail. I thought if I kept busy it wouldn’t notice me.', 'think'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask if she’s all right.',
              then: [
                SM('I am now. I wasn’t. It’s a strange thing, being all right after not being.', 'soft'),
                N('She slips the gold ring round her ankle and looks at it, to be sure it is still there.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a09-05-complete',
      lines: [
        SM('I’m the Snork Maiden. My brother is somewhere about, probably making a list.'),
        SM('Can we come with you? I don’t want to be anywhere on my own just now.'),
        MT('Of course. Mamma always makes enough for everybody.', 'happy'),
        N('The garnet is still in your hand. Sniff has not asked for it back.'),
      ],
    },
    rewards: [],
    sets: { 'a09-05': true },
    notes:
      'THE RING (outline): a small gold ring found in the mountains; it is the Snork Maiden’s, worn round her ankle (our ' +
      'staging, so it fits both "ring" and the book’s anklet). THE GARNET: Sniff gives you a small red stone "to hold, not to ' +
      'keep" (our own beat); it is an option in A9-11’s bring choice. THE BUSH: scary for a beat, nobody is stung (care notes). ' +
      'Moomintroll does the rescuing here; A9-9 reverses it.',
  },

  // ---------------------------------------------------------------- A9-6
  {
    id: 'a09-06',
    code: 'A9-6',
    title: 'The Snork',
    source: `${BOOK}: the Snork and his meetings`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-5') },
    requires: ['A9-5'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, SNORK_MAIDEN, SNORK],
    steps: [
      {
        id: 'a09-06-s1',
        goal: 'Find the Snork Maiden’s brother.',
        hint: 'Look for a neat camp with a sign on it.',
        check: 'talk:a09-snork:meeting',
        scene: {
          id: 'a09-06-snork',
          lines: [
            N('Her brother has made camp under a pine, very neatly. There is a sign on the tent that says OFFICE.'),
            SO('Sister. You are late. I had you down for back at four.', 'angry'),
            SM('A bush tried to eat me.'),
            SO('That is not on the list.', 'shock'),
            N('He writes it on the list, then crosses it off, because it is over.'),
            SO('And who are all these people? Have they been introduced? Has anyone taken their names?'),
            MT('We’re going home before the comet. We’ve come to fetch you both.'),
            SO('Going home? Without a meeting? Nothing should be decided without a meeting.', 'think'),
          ],
        },
        done: {
          id: 'a09-06-snork-done',
          lines: [
            SO('Everybody sit in a circle. I shall be the chairman, and also the secretary, as nobody else has a pencil.'),
            SK('I have a pencil.'),
            SO('Then you may be the audience.'),
          ],
        },
      },
      {
        id: 'a09-06-s2',
        goal: 'Sit through the Snork’s meeting and help it reach a decision.',
        hint: 'Sit in the circle. When a vote comes, put your paw up.',
        check: 'sit:a09-meeting:agenda',
        scene: {
          id: 'a09-06-meeting',
          lines: [
            SO('Item one. The comet. Is it coming? Show of paws.'),
            N('Everybody puts a paw up. Your Nubbin puts up both, from Sniff’s pocket.'),
            SO('Carried. Item two. Should we be concerned? Show of paws.', 'think'),
            SN('Both my paws. And my ears, if they count.', 'shock'),
            SO('Carried. Item three: what to do about it. I shall now accept suggestions.'),
            N('There is a pause, in which nobody suggests anything and the comet moves a little further across the sky.'),
          ],
          choices: [
            {
              id: 'home',
              label: 'Propose going home at once.',
              then: [
                Y('I propose we go home. Now.'),
                SO('That is a motion. Does anyone second it?'),
                SM('Me! And Moomintroll. And everyone. You’re outvoted before you’ve counted.', 'happy'),
              ],
            },
            {
              id: 'sub',
              label: 'Propose a subcommittee to decide on the way.',
              then: [
                SO('A subcommittee! Now that is a sensible person.', 'happy'),
                SK('The subcommittee will meet while walking. Very fast. Towards the valley.'),
                SO('…Agreed.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-06-meeting-done',
          lines: [
            N('The Snork writes the minutes and reads them back. Under "Any other business" he has written: Sniff is worried.'),
            SN('Well, I am.'),
            SO('It is in the minutes. It is official. Everybody is to bear it in mind.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-06-complete',
      lines: [
        N('The Snork folds his tent into a parcel so small and square that Sniff looks at it with something like love.'),
        SO('Meeting closed. We march.'),
        N('You march. The Snork walks at the front, and Snufkin walks at the front of him, and the Snork does not notice.'),
      ],
    },
    rewards: [],
    sets: { 'a09-06': true },
    notes:
      'Comedy quest: the Snork loves order, meetings and minutes, and the joke is affectionate. The "Sniff is worried" minute ' +
      'is a quiet echo of A9-4 that works for either a09-answer, so it needs no variant. Two steps (the outline quest is short).',
  },

  // ---------------------------------------------------------------- A9-7
  {
    id: 'a09-07',
    code: 'A9-7',
    title: 'The Hemulen',
    source: `${BOOK}: the Hemulen and his butterflies`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-6') },
    requires: ['A9-6'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, SNORK_MAIDEN, HEMULEN],
    steps: [
      {
        id: 'a09-07-s1',
        goal: 'Find out who is crashing about in the meadow with a net.',
        hint: 'Follow the sound of somebody falling over things.',
        check: 'find:a09-hemulen:meadow',
        scene: {
          id: 'a09-07-meadow',
          lines: [
            N('In a meadow full of late flowers, a large person in a long dress is running in circles with a butterfly net.'),
            N('He swings, misses, falls into a bush, gets up and swings again, without once looking anywhere but up.'),
            HE('Hold still, you! You! I know what you are! You’re the very last one I need!', 'angry'),
            SN('Who’s that?'),
            SK('A Hemulen. You can tell, because he’s busy.'),
            MT('Excuse me! Have you seen the comet?'),
            HE('The what? No. Is it a butterfly?', 'think'),
            MT('It’s a star with a tail. It’s coming on the seventh. It might land here.'),
            HE('Then it had better land quietly. There is a Mourning Blue in this meadow and I will not have it disturbed.'),
          ],
        },
        done: {
          id: 'a09-07-meadow-done',
          lines: [
            SM('He’s not listening. Hemulens never listen when they’re collecting.'),
            SK('Then we’ll have to help him finish collecting.'),
          ],
        },
      },
      {
        id: 'a09-07-s2',
        goal: 'Help the Hemulen find his rare butterfly.',
        hint: 'Look on the tall flowers at the edge of the meadow, where the sun still reaches.',
        check: 'find:a09-butterfly:meadow',
        scene: {
          id: 'a09-07-butterfly',
          lines: [
            N('Everyone spreads out across the meadow, walking softly. Even the Snork, who makes it a motion.'),
            HE('Softly. Softly. It is the colour of the hour after sunset, and it hates a fuss.', 'think'),
            SN('So do I. Nobody ever asks.'),
            N('Your Nubbin climbs out of Sniff’s pocket and stands very still on a stone.'),
            N('A butterfly the colour of dusk comes down out of nowhere and lands on your Nubbin’s head.'),
            N('Your Nubbin does not breathe, and nor do you. Somewhere behind you, the Hemulen draws in a huge breath.'),
          ],
          choices: [
            {
              id: 'show',
              label: 'Call the Hemulen over, softly.',
              then: [
                N('The Hemulen tiptoes over, which for a Hemulen is like a cupboard tiptoeing.'),
                N('He does not swing the net. He just looks, for a long time, with his mouth a little open.'),
                HE('There. There it is. Oh, I’ll put it in the book, and it will be complete.', 'happy'),
              ],
            },
            {
              id: 'quiet',
              label: 'Keep quiet and let it fly.',
              then: [
                N('The butterfly opens its wings once and goes up into the evening. Nobody says a word.'),
                N('The Hemulen comes over with his net hanging down. He saw it go.'),
                HE('It sat on your little one. It chose. I suppose I can write that down instead.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-07-butterfly-done',
          lines: [
            N('The Hemulen writes in a fat notebook with his tongue between his teeth.'),
            HE('Complete, as far as this meadow goes. Now. What was it you were saying about a star?', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-07-complete',
      lines: [
        MT('It’s coming on the seventh. We’re going to my valley. Mamma will look after everyone.'),
        HE('Will there be butterflies?'),
        MT('After. There are always butterflies after.', 'soft'),
        HE('Then I shall come. I can be very useful, when I have finished something.', 'happy'),
        N('He folds his net and walks with you, still glancing up, the way some people hum.'),
      ],
    },
    rewards: [],
    sets: { 'a09-07': true },
    notes:
      'VERIFIED: the Hemulen hunts butterflies; the comet barely interests him. "Mourning Blue" is our own invented butterfly ' +
      '(it is not from the book). Kind-hearted register: the butterfly is never caught, pinned or harmed on screen in either ' +
      'branch; "put it in the book" means his notebook of sightings. The Hemulen wears a dress, as Hemulens do (care notes).',
  },

  // ---------------------------------------------------------------- A9-8
  {
    id: 'a09-08',
    code: 'A9-8',
    title: 'The Dry Sea',
    source: `${BOOK}: the sea that went away`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-7') },
    requires: ['A9-7'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, SNORK_MAIDEN, SNORK, HEMULEN],
    steps: [
      {
        id: 'a09-08-s1',
        goal: 'Come down to the shore and see what has happened to the sea.',
        hint: 'The path ends at the cliff top. Look out.',
        check: 'visit:a09-shore:dry',
        scene: {
          id: 'a09-08-shore',
          lines: [
            N('You come over the last hill and stop. Everyone stops, all along the line.'),
            N('The sea has gone. Where it was there is a great grey hollow of mud and weed and rock, going down and down.'),
            MT('It was here. There was a whole sea here.', 'shock'),
            SK('It’s hiding. Everything hides from something that big.'),
            SO('The valley is on the other side. Around the bay is three days. Across is one.'),
            SN('Across WHAT? It’s all squelch!', 'shock'),
            N('Far out on the seabed, a stranded fish flaps once, then lies still in a puddle that is just enough.'),
          ],
        },
        done: {
          id: 'a09-08-shore-done',
          lines: [
            N('Three days is more than you have. Nobody needs to say it.'),
          ],
        },
      },
      {
        id: 'a09-08-s2',
        goal: 'Help Snufkin make stilts for everyone.',
        hint: 'Gather long straight poles from the driftwood above the tideline.',
        check: 'craft:a09-stilts:driftwood',
        scene: {
          id: 'a09-08-stilts',
          lines: [
            SK('Stilts. We walk over the mud on stilts.', 'think'),
            N('You gather driftwood along the old tideline. Snufkin binds footrests on with string from his pockets.'),
            N('The Hemulen’s stilts are the tallest and the Snork’s are measured exactly. Sniff’s are very short.'),
            SN('Mine are short.'),
            SK('Short stilts fall over less far.'),
            N('Everybody practises on the sand, and everybody falls over: Moomintroll often, the Snork Maiden gracefully.'),
            N('Sniff falls over on purpose, to get it done.'),
            N('Your Nubbin rides in Sniff’s pocket, a little higher off the ground than it is used to, and looks impressed.'),
          ],
          choices: [
            {
              id: 'tall',
              label: 'Ask for tall stilts.',
              then: [
                N('You can see the whole bay from up here, and the long red stripe of the comet beyond it.'),
                N('You fall over once, magnificently, and the Hemulen picks you up by the collar.'),
              ],
            },
            {
              id: 'short',
              label: 'Ask for short stilts, like Sniff’s.',
              then: [
                SN('Oh, good. Now we’re the short-stilts club. We’ll have meetings.', 'happy'),
                SO('All meetings must be registered with me.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-08-stilts-done',
          lines: [
            N('Snufkin looks at the line of you all, wobbling. He puts his harmonica away, which means it is time.'),
          ],
        },
      },
      {
        id: 'a09-08-s3',
        goal: 'Walk out across the seabed on stilts.',
        hint: 'Stay in the line and step where Snufkin steps.',
        check: 'walk:a09-seabed:stilts',
        scene: {
          id: 'a09-08-seabed',
          lines: [
            N('You walk out on to the seabed. It sucks at the stilts with a sound like somebody finishing soup.'),
            N('There are things down here nobody was meant to see: a sunk rowing boat, a broken anchor, a wardrobe.'),
            SM('Why is there a wardrobe?', 'think'),
            SO('I shall note it.'),
            N('In a puddle beside your stilt lies a pink shell with a curl in it, still wet.'),
            N('You lean down, very carefully, and pick it up. When you hold it to your ear, there is no sea in it at all.'),
            SN('Is it broken?'),
            MT('It’s waiting. It’s listening for the sea, the same as us.', 'soft'),
          ],
        },
        done: {
          id: 'a09-08-seabed-done',
          lines: [
            N('You put the shell in your pocket. It is very light, and it seems to want carrying.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-08-complete',
      lines: [
        N('The sun goes down behind you. Out on the seabed, the light comes from the sky now, red and steady.'),
        SK('We’ll go on in the dark. The comet will light the way. That’s one thing to be said for it.'),
        N('Sniff counts his stilts, his pocket, his Nubbin, and you, and seems relieved that the number comes out the same.'),
      ],
    },
    rewards: [],
    sets: { 'a09-08': true },
    notes:
      'The dry seabed: grey mud, weed, rocks, a sunk rowing boat, a broken anchor, a wardrobe (our own), stranded fish (none ' +
      'shown dying). THE SHELL: a pink curled shell with no sea in it; an option in A9-11’s bring choice and paid off in ' +
      'a09-12-dawn-done-shell. Stilts are a walking minigame-free move: the check completes on reaching the far marker.',
  },

  // ---------------------------------------------------------------- A9-9
  {
    id: 'a09-09',
    code: 'A9-9',
    title: 'The Octopus',
    source: `${BOOK}: danger on the seabed`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-8') },
    requires: ['A9-8'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, SNORK_MAIDEN, SNORK, HEMULEN],
    steps: [
      {
        id: 'a09-09-s1',
        goal: 'Cross the deep part of the seabed by the comet’s light.',
        hint: 'Keep to the ridge of rock. Don’t go near the dark pool.',
        check: 'explore:a09-seabed:deep',
        scene: {
          id: 'a09-09-deep',
          lines: [
            N('The seabed dips into its deepest part. The mud gives way to black rock and pools that go down further than light.'),
            N('Everything is red under the comet. The puddles shine like spilt jam.'),
            N('The Snork lights the lantern from his pack and hangs it on a stick, as is correct. He has a rule about lanterns too.'),
            SO('We keep to the ridge. Single file. That is a rule.', 'think'),
            N('Moomintroll is in front, looking ahead to where the valley must be. He is going too fast.'),
            MT('Not far now. I can almost smell the house. I can almost smell the jam.', 'happy'),
            N('He steps off the ridge to cut a corner. His stilt sinks into the edge of the biggest, darkest pool.'),
            N('The water in the pool moves, though there is no wind.'),
          ],
        },
        done: {
          id: 'a09-09-deep-done',
          lines: [
            SK('Moomintroll. Come back on the ridge. Slowly.'),
          ],
        },
      },
      {
        id: 'a09-09-s2',
        goal: 'Keep everyone together while the Snork Maiden acts.',
        hint: 'Hold the line on the ridge. Hold a light up if you have one.',
        check: 'watch:a09-octopus:pool',
        scene: {
          id: 'a09-09-octopus',
          lines: [
            N('A long arm comes out of the pool, and then another, grey and slow and curious.'),
            N('An octopus as big as a cart lifts its head out of the water and looks at Moomintroll with one large, sad eye.'),
            N('An arm curls round his stilt, and another round his middle. He cannot get back on the ridge.'),
            MT('Help! It’s got hold! I can’t pull free!', 'shock'),
            N('Sniff squeaks and dives behind the Hemulen. The Hemulen holds his net up, which is no use at all, but brave.'),
            N('The Snork Maiden is already moving. She takes the lantern off the Snork’s pack, lights it and runs at the pool.'),
            SM('Let him GO!', 'angry'),
            N('She swings the lantern up into the octopus’s eye. The light flares on the wet rock, gold in all that red.'),
          ],
          choices: [
            {
              id: 'light',
              label: 'Hold your own light up behind her.',
              then: [
                N('You hold up the pink shell from the seabed. It catches the lantern and throws the light back, twice as bright.'),
                N('The octopus blinks, both eyes, very slowly, and its arms open.'),
              ],
            },
            {
              id: 'line',
              label: 'Grab Moomintroll’s paw and pull.',
              then: [
                N('You lean out from the ridge and catch his paw. The Hemulen catches your collar, and the Snork catches the Hemulen.'),
                N('The octopus blinks at the lantern, and its arms open, and you all fall backwards in a heap.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-09-octopus-done',
          lines: [
            N('The octopus slides back into its pool without a splash, as if embarrassed. The water closes, and it is gone.'),
            N('Moomintroll is sitting on the ridge in the mud with his stilts crossed, staring at the Snork Maiden.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-09-complete',
      lines: [
        MT('You saved me.', 'shock'),
        SM('You saved me first. Now we’re even. It’s much better being even.', 'happy'),
        MT('I didn’t know you could do that.'),
        SM('Neither did I. I was too busy doing it to find out.'),
        N('Sniff comes out from behind the Hemulen, and your Nubbin out of his pocket. Both look surprised to be alive and fine.'),
        SO('I am noting that the Snork Maiden was brave. I am underlining it. Twice.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a09-09': true },
    notes:
      'VERIFIED: the octopus on the seabed; the Snork Maiden rescues Moomintroll. HOW she does it here (a lantern swung into ' +
      'its eye) is our own staging; check it against the named edition before ship and change it to the book’s method if it ' +
      'differs, in our own words. Care: the octopus is a big, sad-eyed animal that lets go and slides away unharmed; ' +
      'Moomintroll is held, never squeezed or hurt. Two steps (the outline quest is short).',
  },

  // ---------------------------------------------------------------- A9-10
  {
    id: 'a09-10',
    code: 'A9-10',
    title: 'The Race Home',
    source: `${BOOK}: the red sky, the tornado and the glider`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-9') },
    requires: ['A9-9'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, SNORK_MAIDEN, SNORK, HEMULEN, HEMULEN_2],
    steps: [
      {
        id: 'a09-10-s1',
        goal: 'Get off the seabed and on to the road home under the red sky.',
        hint: 'Climb the shingle bank on the far side, then keep walking.',
        check: 'walk:a09-road:red-sky',
        scene: {
          id: 'a09-10-road',
          lines: [
            N('You climb off the seabed in the morning and leave the stilts in a heap on the shingle.'),
            N('The sky is red now in the daytime too. The air is hot and still, and the leaves on the trees hang down, tired.'),
            SM('What day is it?'),
            SO('The seventh. I have it written down. I wish I didn’t.', 'sad'),
            SN('It’s today. It’s actually today.', 'shock'),
            MT('We can still do it. It doesn’t come till the evening. We can be home long before that.'),
            N('Sniff looks at you, quickly, and then away, and walks a little faster.'),
          ],
        },
        done: {
          id: 'a09-10-road-done',
          lines: [
            N('At a crossroads, a second Hemulen sits on a milestone in a large flowered dress, fanning himself with a hymn sheet.'),
            H2('Cousin! What are you doing out on a day like this?', 'shock'),
            HE('Walking very fast, cousin. You should too.'),
          ],
        },
      },
      {
        id: 'a09-10-s2',
        goal: 'Hold on together when the tornado comes.',
        hint: 'Get everyone into the lee of the stone wall and hold on to the nearest paw.',
        check: 'climb:a09-glider:tornado',
        scene: {
          id: 'a09-10-tornado',
          lines: [
            N('The wind comes all at once, out of a still sky. Dust goes up in a spinning column that walks across the fields.'),
            SK('Tornado! Down behind the wall, everybody!'),
            N('It does not care about walls. It picks up a haystack, a gate, two hens, and then it picks up the other Hemulen.'),
            N('His flowered dress fills like a sail. He goes up, and grabs the first thing he can, which is Moomintroll.'),
            N('Moomintroll grabs the Snork Maiden, the Snork Maiden grabs Sniff, and Sniff grabs you.'),
            N('Then nobody is on the ground at all.'),
            H2('This is very irregular!', 'shock'),
            SK('Hold your skirts out wide! Like wings! Wide as you can!'),
            N('The other Hemulen spreads his dress, and the spinning stops, and you are gliding. All of you, in a chain, under a flowered sky.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold on tight to Sniff.',
              then: [
                N('Sniff has his eyes shut. He has both paws on you and one foot on his pocket.'),
                SN('Tell me when it’s over. Tell me exactly when.', 'shock'),
              ],
            },
            {
              id: 'look',
              label: 'Open your eyes and look down.',
              then: [
                N('Below you the whole country is laid out like a map in red light: the mountains, the dry sea, the river.'),
                N('And at the end of the river, a green valley, and a tall blue house in it like a stove.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-10-tornado-done',
          lines: [
            N('The wind drops you all, gently in the end, in a long meadow, one after the other like washing off a line.'),
            H2('My best dress. My very best dress. It has never been so useful.', 'happy'),
          ],
        },
      },
      {
        id: 'a09-10-s3',
        goal: 'Run the last stretch to the valley.',
        hint: 'Down through the birch wood. You know the way from here.',
        check: 'walk:a09-valley:home',
        scene: {
          id: 'a09-10-run',
          lines: [
            N('Everyone sits up in the meadow and counts themselves. The Snork counts everyone else, and writes it down.'),
            SO('Seven, and a Nubbin, and a cousin. Nobody missing. Nobody even bent.', 'happy'),
            N('The comet fills a third of the sky now. The light is the colour of the inside of an ember.'),
            SM('How far is it to the valley?'),
            MT('Over the hill and down through the birch wood. Not far. Not far at all.', 'happy'),
            N('Snufkin is patting his head. His hat has gone.'),
            N('You look round. It is caught on a thistle three steps away, rocking in the last of the wind.'),
          ],
          choices: [
            {
              id: 'catch',
              label: 'Run and catch it.',
              then: [
                N('You grab it just as it lifts. It is old and soft and smells of woodsmoke and rain.'),
                SK('Hold on to it for me. I’ve got my hands full of Sniff.', 'happy'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin fetch it.',
              then: [
                N('Your Nubbin jumps out of Sniff’s pocket, runs, and arrives under the hat, which settles over it completely.'),
                N('The hat walks back to you. Snufkin laughs out loud, for the first time on the whole road.'),
              ],
            },
          ],
        },
        done: {
          id: 'a09-10-run-done',
          lines: [
            N('Then you run, all of you, down through the birch wood, the hat in your arms, the comet filling half the sky.'),
            MT('There! There’s the house! There’s the smoke from the chimney!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-10-complete',
      lines: [
        N('The garden is empty and the house is shut. A note is pinned to the door in Moominmamma’s round writing.'),
        MT('“Gone to the cave. Come quickly. Have brought the cake.”'),
        SN('The cave. Our cave. My cave!', 'happy'),
        N('The other Hemulen is still holding his dress out, in case. Nobody tells him he can stop.'),
      ],
    },
    rewards: [],
    sets: { 'a09-10': true },
    notes:
      'VERIFIED: the tornado, and a Hemulen’s dress used as a glider. The second Hemulen (HEMULEN_2, our own cousin framing) ' +
      'is "he", as in the English translations; the dress is never the joke (care notes). Moominmamma’s door note is our own ' +
      'wording. Snufkin’s hat is caught in s3 and becomes the A9-12 reward. Sniff’s quick look in a09-10-road works for ' +
      'either a09-answer (an echo, no variant).',
  },

  // ---------------------------------------------------------------- A9-11
  {
    id: 'a09-11',
    code: 'A9-11',
    title: 'The Cave',
    source: `${BOOK}: Moominmamma’s shelter by the shore`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-10') },
    requires: ['A9-10'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, SNORK_MAIDEN, SNORK, HEMULEN, HEMULEN_2, MAMMA, PAPPA, MUSKRAT],
    steps: [
      {
        id: 'a09-11-s1',
        goal: 'Get everyone down to the cave on the shore.',
        hint: 'Take Sniff’s secret path. It is the quickest, and it is still a secret, mostly.',
        check: 'escort:a09-party:cave',
        scene: {
          id: 'a09-11-arrive',
          lines: [
            N('Sniff leads the way down his secret path, very fast, with everyone behind him. He does not mention it is a secret.'),
            N('The cave mouth glows. Inside, Moominmamma has made it a room.'),
            N('There are blankets on the sand, and lamps, and the rocking chair, and the clock from the kitchen, ticking.'),
            MM('There you are. There you all are. And more of you than went.', 'happy'),
            N('Moomintroll runs into her apron and stays there for a while.'),
            MM('Come in, all of you. There’s cake. There’s always cake, at the end of the world. That’s what cake is for.', 'soft'),
            MP('I brought my memoirs. In case they were needed.'),
            MU('I brought my hammock. Nobody else thought of the hammock.', 'think'),
          ],
        },
        done: {
          id: 'a09-11-arrive-done',
          lines: [
            SO('I move that the comet be asked to arrive quietly.'),
            MU('Seconded. I have no hope whatsoever. It’s very restful.', 'think'),
            N('Moominpappa hangs the hammock between a rock and his memoirs. Everybody politely pretends it is holding.'),
            N('The kitchen clock says half past seven. It ticks very loudly, as clocks do when everybody is listening.'),
          ],
        },
      },
      {
        id: 'a09-11-s2',
        goal: 'Choose the one thing you bring into the cave.',
        hint: 'Moominmamma is at the cave mouth. Show her what you are carrying.',
        check: 'choose:a09-cave:bring',
        scene: {
          id: 'a09-11-door',
          lines: [
            N('Moominmamma stands at the cave mouth with a blanket over her arm, looking at what everybody has carried.'),
            MM('It’s a small cave, dear, and there are a lot of you now. One thing each, and only what you love fits.', 'soft'),
            MM('The rest can wait out here on the rock. It’ll be there in the morning.'),
            N('The Snork puts down his minutes, and the Hemulen his net. Snufkin, who has nothing, keeps it.'),
            N('You empty your pockets on to the rock. The harmonica can wait, and Snufkin’s hat isn’t yours to choose.'),
            N('That leaves three: the shell from the seabed, the garnet Sniff gave you to hold, and your Nubbin.'),
            N('Your arms are only so big.'),
          ],
          choices: [
            {
              id: 'shell',
              label: 'The shell with no sea in it.',
              set: { 'a09-brought': 'shell' },
              then: [
                N('You bring the shell. Your Nubbin, who was never going to be left outside, comes in as Sniff’s one thing.'),
                MM('That one’s waiting for something. Yes. Bring it in.'),
              ],
            },
            {
              id: 'garnet',
              label: 'The garnet Sniff gave you to hold.',
              set: { 'a09-brought': 'garnet' },
              then: [
                N('You bring the garnet. Sniff sees, and pretends very hard not to have seen.'),
                N('Your Nubbin stays in Sniff’s pocket and comes in as his one thing. Sniff says this is allowed. Nobody argues with him tonight.'),
                MM('Somebody’s been generous. That’s worth a lot of room.', 'soft'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Nothing but your Nubbin, held in both arms.',
              set: { 'a09-brought': 'nubbin' },
              then: [
                N('You lift your Nubbin out of Sniff’s pocket and hold it in both arms. Everything else you leave on the rock.'),
                MM('Yes. That’s the right size for arms.', 'soft'),
              ],
            },
          ],
        },
      },
      {
        id: 'a09-11-s3',
        goal: 'Sit with Sniff in the dark while the comet comes.',
        hint: 'He is at the very back of the cave. Sit down beside him.',
        check: 'sit:a09-cave:dark',
        scene: {
          id: 'a09-11-dark',
          lines: [
            N('The lamps go out one by one, to save oil. The kitchen clock says twenty to nine.'),
            N('Outside, the sky is so red it comes in at the cave mouth and lies on the sand like a carpet.'),
            N('A sound begins, very far off. It is like the whole sky taking in a breath.'),
            N('Sniff is at the very back of the cave, as far back as there is. You go and sit down beside him.'),
            N('He doesn’t ask you anything this time. You said you didn’t know, and he remembers.'),
            N('In the dark his paw finds your hand and holds on.'),
            N('Neither of you says a word. You sit there together and wait, and that is the whole of what you can do.'),
          ],
        },
        done: {
          id: 'a09-11-dark-done',
          lines: [
            N('The kitchen clock says eight forty-two.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-11-complete',
      lines: [
        N('Then everything is light and noise. The ground shakes, gently, like a cupboard when a train goes by.'),
        N('Moominmamma’s voice comes through it, quite calm, saying what she always says at bedtime.'),
        MM('Hush now. Hush. Everyone is here.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a09-11': true },
    notes:
      'THE SIGNATURE PAYOFF (a09-answer, set in A9-4): a09-11-dark is for dunno (Sniff holds your hand and says nothing at all). ' +
      'For home play ATLAS_A09_VARIANTS a09-11-dark-home in its place (Sniff says your words back to you in the dark). Both ' +
      'keep the same check and done scene. THE BRING CHOICE (a09-11-door) sets a09-brought = shell | garnet | nubbin; paid ' +
      'off in A9-12 (a09-12-dawn-done and its variants). The cave is the one from A9-1. Staging: kitchen clock in shot; the ' +
      'red light, the sound, the gentle shake. Nobody is hurt; nothing falls in. Hazel’s third rule is acted out in s3 and ' +
      'never named.',
  },

  // ---------------------------------------------------------------- A9-12
  {
    id: 'a09-12',
    code: 'A9-12',
    title: 'The Night It Missed',
    source: `${BOOK}: the comet passes, and the morning after`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A9-11') },
    requires: ['A9-11'],
    speakers: [MOOMINTROLL, SNIFF, SNUFKIN, SNORK_MAIDEN, SNORK, HEMULEN, HEMULEN_2, MAMMA, PAPPA, MUSKRAT],
    steps: [
      {
        id: 'a09-12-s1',
        goal: 'Wait out the night in the cave.',
        hint: 'Stay where you are. It is nearly over.',
        check: 'wait:a09-comet:night',
        scene: {
          id: 'a09-12-night',
          lines: [
            N('The roar goes over. It goes on a long time, and then it is less, and then it is going away.'),
            N('You can feel it going, the way you feel a cart go past in the street with your eyes shut.'),
            MU('Hm. It seems to have missed. How very unphilosophical of it.', 'think'),
            N('Somebody laughs in the dark: the Snork Maiden. Then Moomintroll, and then everybody.'),
            SN('Has it gone? Is it over? Tell me exactly.', 'shock'),
            MP('It brushed us with its tail and went on its way. It had somewhere else to be, I expect.', 'soft'),
            MP('That goes in the memoirs. "The Night I Remained Calm."'),
            MM('You were under the rocking chair, dear.', 'soft'),
            MP('Calmly under it.'),
            SO('For the record, the comet did not attend. I shall minute it.'),
            N('The lamps come back on and Moominmamma cuts the cake. Nobody remembers afterwards if it was good, only that it was there.'),
          ],
        },
        done: {
          id: 'a09-12-night-done',
          lines: [
            N('One by one, everybody falls asleep where they are sitting, in a heap, like puppies.'),
          ],
        },
      },
      {
        id: 'a09-12-s2',
        goal: 'Go out of the cave in the morning and see what the comet left.',
        hint: 'Walk out of the cave mouth and down to the water.',
        check: 'explore:a09-valley:morning-after',
        scene: {
          id: 'a09-12-dawn',
          lines: [
            N('In the morning you wake up with sand in your ear and your Nubbin asleep on your chest.'),
            N('The light at the cave mouth is not red. It is ordinary, yellow, wonderful morning.'),
            N('You go out, and the grey has gone off everything. The grass is green, and wet, and has never looked so like grass.'),
            N('And the sea is coming back. It comes in over the seabed in long, slow, shining sheets, filling every hollow.'),
            MT('It came back. Everything came back.', 'happy'),
            SK('Things mostly do. Not always. But mostly.', 'soft'),
            N('The Hemulen is already in the long grass with his notebook, because there are butterflies.'),
            N('Down at the water’s edge, the raft drifts in on the first wave, its name still on the stern, as if it had only popped out.'),
          ],
        },
        done: {
          id: 'a09-12-dawn-done',
          lines: [
            N('Your Nubbin scrambles down to the water’s edge, sits in the first wave and lets the sea come home round it.'),
            SN('It’s all right, then. It’s all right. I can tell, because it’s doing that.', 'happy'),
          ],
        },
      },
      {
        id: 'a09-12-s3',
        goal: 'Say goodbye to the valley and give Snufkin back his hat.',
        hint: 'Snufkin is at the gate with his pack on. Bring the hat.',
        check: 'give:a09-hat:snufkin',
        scene: {
          id: 'a09-12-gate',
          lines: [
            N('Snufkin is at the garden gate with his tent on his back. He is going south, in the end.'),
            N('You hold out his hat. He looks at it for a while.'),
            SK('Keep it. I’ll find another. Hats come to me; it’s the strangest thing.', 'happy'),
            SK('And if I had it back I’d have two again, sooner or later. You know how I feel about two.'),
            N('He puts it on your head, and it comes down over your eyes. Your Nubbin laughs, which is a sort of hiccup.'),
            MM('Before you go, dear. Something to remember the house by.', 'soft'),
            N('She gives you a little blue stove, the same blue as the house, small enough to carry and warm in your hands.'),
            MM('For your own house. Wherever you light it, that’s where people come home to.'),
          ],
        },
        done: {
          id: 'a09-12-gate-done',
          lines: [
            N('Snufkin is already at the bend in the road. He plays a few notes without looking back, and you play a few back.'),
            N('They come out like a duck in a cupboard. He waves his hand over his head, which means: right note, wrong place.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a09-12-complete',
      lines: [
        N('The page starts to curl at its edges, the way a page does when its story has got where it was going.'),
        MT('Will you come back? You can, you know. There’ll always be a bed. Mamma keeps a spare one for exactly this.', 'happy'),
        SN('Bring the Nubbin. My pocket will be empty otherwise. It’s a very good pocket.', 'soft'),
        N('The blue house, the green valley, the sea coming home: they go flat and still, and they are paper.'),
        N('You are back in the Grove, in a too-big hat, with a small blue stove in your arms.'),
      ],
    },
    rewards: [
      {
        id: 'a09-snufkins-hat',
        kind: 'cosmetic',
        label: 'Snufkin’s Hat',
        description: 'An old, soft, pointed green hat that smells of woodsmoke and rain. Too big for anybody, which is how it should be.',
      },
      {
        id: 'a09-blue-stove',
        kind: 'decor',
        label: 'Moominhouse-Blue Stove',
        description: 'A little round stove in the blue of the house in the valley. Nubbins like to curl up beside it after a long day.',
      },
    ],
    sets: { 'a09-12': true, 'a09-done': true },
    notes:
      'THE BRING CHOICE (a09-brought, A9-11) is paid off in the s2 done scene: a09-12-dawn-done is for nubbin; for shell play ' +
      'ATLAS_A09_VARIANTS a09-12-dawn-done-shell in its place, for garnet a09-12-dawn-done-garnet. The stove is Moominmamma’s gift (our own beat; the reward is from the ' +
      'outline). REWARDS: Snufkin’s Hat (cosmetic) and the Moominhouse-Blue Stove (decoration), one-time. The "duck in a ' +
      'cupboard" harmonica line calls back A9-3. Sets a09-done (the page is finished).',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by this page's own flags (Atlas save only).
 * - a09-11-dark-home replaces a09-11-dark when a09-answer = home (the signature payoff).
 * - a09-12-dawn-mamma and a09-12-dawn-valuable replace a09-12-dawn when a09-raft = mamma or valuable
 *   (the base is the neutral raft return, for an unset flag).
 * - a09-12-dawn-done-shell and a09-12-dawn-done-garnet replace a09-12-dawn-done (the base, for
 *   nubbin) when a09-brought = shell or garnet.
 */
export const ATLAS_A09_VARIANTS: Scene[] = [
  {
    id: 'a09-11-dark-home',
    lines: [
      N('The lamps go out one by one, to save oil. The kitchen clock says twenty to nine.'),
      N('Outside, the sky is so red it comes in at the cave mouth and lies on the sand like a carpet.'),
      N('A sound begins, very far off. It is like the whole sky taking in a breath.'),
      N('Sniff is at the very back of the cave, as far back as there is. You go and sit down beside him.'),
      N('For a long time he doesn’t say anything. Then, in the dark, very small, he does.'),
      SN('We’re home by then. You said. We’re home by then.', 'soft'),
      N('He has been carrying it since the mountain, like a button in a pocket. Now he gives it back to you to hold.'),
      SN('And we are. We’re home. So that part came true.'),
      N('You sit there together and wait, and that is the whole of what you can do.'),
    ],
  },
  {
    id: 'a09-12-dawn-mamma',
    lines: [
      N('In the morning you wake up with sand in your ear and your Nubbin asleep on your chest.'),
      N('The light at the cave mouth is not red. It is ordinary, yellow, wonderful morning.'),
      N('You go out, and the grey has gone off everything. The grass is green, and wet, and has never looked so like grass.'),
      N('And the sea is coming back. It comes in over the seabed in long, slow, shining sheets, filling every hollow.'),
      MT('It came back. Everything came back.', 'happy'),
      SK('Things mostly do. Not always. But mostly.', 'soft'),
      N('The Hemulen is already in the long grass with his notebook, because there are butterflies.'),
      N('Down at the water’s edge, the raft drifts in on the first wave, its name still on the stern, as if it had only popped out.'),
      SN('She came home on her own, with Moominmamma still on the stern. That’s allowed, isn’t it?', 'happy'),
      MP('Naturally. She was named after someone who always comes home.', 'soft'),
    ],
  },
  {
    id: 'a09-12-dawn-valuable',
    lines: [
      N('In the morning you wake up with sand in your ear and your Nubbin asleep on your chest.'),
      N('The light at the cave mouth is not red. It is ordinary, yellow, wonderful morning.'),
      N('You go out, and the grey has gone off everything. The grass is green, and wet, and has never looked so like grass.'),
      N('And the sea is coming back. It comes in over the seabed in long, slow, shining sheets, filling every hollow.'),
      MT('It came back. Everything came back.', 'happy'),
      SK('Things mostly do. Not always. But mostly.', 'soft'),
      N('The Hemulen is already in the long grass with his notebook, because there are butterflies.'),
      N('Down at the water’s edge, the raft drifts in on the first wave, its name still on the stern, as if it had only popped out.'),
      SN('She came home on her own. That’s what a valuable does.', 'happy'),
      MP('Naturally. She is called The Valuable. One does not lose a valuable.'),
    ],
  },
  {
    id: 'a09-12-dawn-done-shell',
    lines: [
      N('You take the pink shell out of your pocket and hold it to your ear.'),
      N('Very faint, very far, there is the sound of the sea in it again. It must have got back first.'),
      MT('Let me listen! Oh. Oh, it’s home.', 'happy'),
    ],
  },
  {
    id: 'a09-12-dawn-done-garnet',
    lines: [
      N('You hold out the garnet to Sniff. You were only holding it, after all.'),
      SN('No. You keep it. I gave it to you to hold, and you held it all night, and that’s keeping.', 'soft'),
      N('He looks surprised at himself. Then he looks pleased, which surprises him more.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads no Grove flag and writes none. */
export const ATLAS_A09_FLAGS: string[] = [
  'a09-01',
  'a09-02',
  'a09-03',
  'a09-04',
  'a09-05',
  'a09-06',
  'a09-07',
  'a09-08',
  'a09-09',
  'a09-10',
  'a09-11',
  'a09-12',
  'a09-done', // A9-12: the whole page
  'a09-answer', // dunno | home (a09-04-step): THE SIGNATURE CHOICE, paid off in A9-11
  'a09-raft', // mamma | valuable (a09-02-build): the raft's name, paid off at the A9-12 dawn
  'a09-brought', // shell | garnet | nubbin (a09-11-door): paid off in A9-12
];

export const ATLAS_A09_CHECKS: string[] = [
  'visit:a09-valley:morning',
  'walk:a09-shore:secret-path',
  'talk:a09-muskrat:hammock',
  'build:a09-raft:river',
  'carry:a09-raft:launch',
  'explore:a09-river:dusk',
  'find:a09-tent:riverbank',
  'sit:a09-campfire:evening',
  'watch:a09-sky:tail',
  'climb:a09-mountain:observatory',
  'talk:a09-professors:telescope',
  'sit:a09-step:observatory',
  'find:a09-ring:crevice',
  'inspect:a09-bush:valley',
  'give:a09-ring:snork-maiden',
  'talk:a09-snork:meeting',
  'sit:a09-meeting:agenda',
  'find:a09-hemulen:meadow',
  'find:a09-butterfly:meadow',
  'visit:a09-shore:dry',
  'craft:a09-stilts:driftwood',
  'walk:a09-seabed:stilts',
  'explore:a09-seabed:deep',
  'watch:a09-octopus:pool',
  'walk:a09-road:red-sky',
  'climb:a09-glider:tornado',
  'walk:a09-valley:home',
  'escort:a09-party:cave',
  'choose:a09-cave:bring',
  'sit:a09-cave:dark',
  'wait:a09-comet:night',
  'explore:a09-valley:morning-after',
  'give:a09-hat:snufkin',
];
