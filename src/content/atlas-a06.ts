/**
 * Atlas campaign, page A6: Seven Voyages (Part L). Sixteen quests, A6-1 to A6-16.
 *
 * SOURCE. The tales of Sinbad the Sailor, a story cycle told inside One Thousand and One Nights
 * (Arabic, with a Persian frame; the Sinbad cycle is old and its texts vary). The tales themselves
 * are traditional and out of copyright. Modern English translations (Haddawy, Lyons and others) are
 * in copyright, and the Victorian ones (Lane, Burton) were not checked here, so NOTHING is quoted:
 * every line is our own. The Harryhausen Sinbad films (Columbia Pictures) are named in the outline
 * as an influence only. Nothing is taken from them: no film character, scene, creature design or
 * line (in particular, the one-eyed giant must not look like the films' horned, goat-legged cyclops).
 *
 * AUDIENCE. 'all'. There is no lifted text, so no line needs a childLines replacement for that
 * reason. Voyages 3 and 4 are softened (care notes), and a few of their lines, plus the one line
 * about pirates selling the crew, carry gentler childLines for the Learning Grove anyway. The
 * Learning Grove's own versions (both bands) are not in this file.
 *
 * FRAME. Nova's atlas opens on Abbasid Baghdad, the round city, in the time of Harun al-Rashid.
 * You are the friend of a poor porter, Sinbad the Porter, and you help him carry paper to the House
 * of Wisdom. He grumbles aloud on the bench outside a great house; its owner, old Sinbad the Sailor,
 * invites him in and tells him one voyage each evening. When the old man tells, the carpet turns to
 * sea and you and your Nubbin step into the tale beside the young Sinbad; the porter stays on his
 * cushion and asks you afterwards what it was really like. Voyage 4 is told mostly from the cushion,
 * and you step in only for the dark and the light after it. The young Sinbad keeps his story; you
 * carry, hold on, notice things and choose at the edges. Your Nubbin never talks. No animal talks
 * either (none do in the source): the whale, the rocs, the serpent and the elephants are silent.
 *
 * GROVE STATE READ (read-only; the Atlas never writes a Grove flag):
 *   - s24Done: Hazel's margin note, A06_VARIANTS 'a06-margin-hazel', plays once, straight after
 *     a06-01-complete (or the first time the page is opened after s24Done is set, if A6-1 was
 *     already done). From then on the pencil note is drawn in the margin by the round city. Its
 *     text is S24's (side-stories-s24.ts, the margin-note list), word for word.
 *   Nothing else is read.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a06-):
 *   - a06-01 … a06-16 on each quest; a06-done on A6-16 (the Great Voyage festival reads it through
 *     atlasDone('A6')).
 *   - a06-stone = taken | left (A6-5, scene a06-05-meat): SIGNATURE CHOICE 1. Paid off at once in
 *     A6-5's complete (base = taken; variant a06-05-complete-left) and eleven quests later in A6-16
 *     (base a06-16-telling = taken; variant a06-16-telling-nothing). For both signature flags the
 *     base scene also plays if the flag is somehow unset.
 *   - a06-ivory = told | kept (A6-14, scene a06-14-gate): SIGNATURE CHOICE 2. Changes A6-14's
 *     complete, both A6-15 scenes and the last line of the porter's story in A6-16 (base = told;
 *     the -kept variants). Either way no elephant is hunted again.
 *
 * LIFTED TEXT. None. Every line is original. The outline's two closing lines for the porter ("The
 * elephants were paid for in bones" / "in a season") and "I had nothing, so I listened" are our own
 * outline text, not quotations.
 *
 * CARE NOTES.
 *   - ADVISERS. Arab and Persian heritage advisers must approve this page before it ships: names,
 *     dress, the round city, the House of Wisdom, Basra, the Caliph's court and how Harun al-Rashid is
 *     shown, greetings ("Peace be upon you" / "And upon you, peace"), the call to prayer as ambience,
 *     the porter's home and food, and how the Nights' Persian frame is mentioned (A6-16). Sri Lankan
 *     advisers (and, for A6-12's mountain, people of each faith named) for Serendib.
 *   - BAGHDAD IS A CITY OF LEARNING, never a backdrop of palaces and danger. The porter carries paper
 *     to the House of Wisdom (A6-1); a translator reads the King of Serendib's letter at court (A6-13);
 *     the round city's plan and gates are given as real things. No Orientalist clichés: no snake
 *     charmers, harems, flying carpets, scimitar-waving villains or "exotic" music cues.
 *   - HARUN AL-RASHID is a real historical ruler. He is shown with dignity: curious, just, a little
 *     dry, never a fool or a tyrant. He speaks only in A6-13.
 *   - VOYAGE 3 IS SOFTENED. Nobody is eaten or hurt. The giant is a fairy-tale threat: big, hungry
 *     and sleepy. He is defeated by a sneeze (black pepper), not blinded. Nobody is lost.
 *   - VOYAGE 4 IS SOFTENED. The old man tells it from the cushion. His wife's death is said once,
 *     plainly and gently. The burial custom is named plainly, once, by him. You step in only for the
 *     dark cave and the tunnel. No body, grave goods or other person in the cave is shown or mentioned,
 *     and Sinbad harms nobody there (the source's killings are cut). The little striped animal shows
 *     the way out.
 *   - VOYAGE 5: the roc chick is not eaten (the merchants only crack the egg; the chick is fine), and
 *     the Old Man of the Sea is not killed or made drunk: he is tricked off with a fig branch and left
 *     sulking, unharmed. He is a fairy-tale sea creature (seaweed, kelp legs, walnut face), never a
 *     portrait of any person or people, and he never speaks.
 *   - VOYAGE 6: the lost shipmates go over the mountain and the old man "never learned" their fate.
 *   - VOYAGE 7: capture and sale by pirates is said plainly, once (a06-13-complete#0), never shown or
 *     made a mechanic. No elephant is ever shot on screen: Sinbad misses on purpose, every time. No
 *     ivory appears as a reward, a decoration, a shop item or an inventory item, on either branch.
 *     Every ending lets the elephants be.
 *   - A6-12's mountain is Sri Pada (Adam's Peak). Four faiths are named equally and briefly, as the
 *     farmer's "some say". No faith's claim is made the true one.
 *   - Art is original: dhows with sewn planks and lateen sails, the Green Dome, the four gates. Rocs
 *     are vast eagles, not dragons. The elephants are Asian elephants led by an old cow with one tusk
 *     broken short (never a torn ear: that is Wisp's, canon 10).
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

const WHERE = 'Nova’s atlas: the Seven Voyages page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const TALES = 'Sinbad the Sailor, from One Thousand and One Nights (traditional; retold, no translation used)';

// ------------------------------------------------------------------ speakers

const PORTER = sp('a06-porter', 'Sinbad the Porter', 'Sinbad the Porter, the listener of the frame tale; your friend');
const SAILOR = sp('a06-sailor', 'Sinbad the Sailor', 'Sinbad the Sailor, old and rich, telling his seven voyages');
const YOUNG = sp('a06-young', 'Young Sinbad', 'Sinbad the Sailor as a young merchant, inside his own tales');
const STEWARD = sp('a06-steward', 'The Steward', 'the old sailor’s household steward (frame tale); original');
const DAUGHTER = sp('a06-daughter', 'The Porter’s Daughter', 'the porter’s small daughter; original, unnamed until advisers name her');
const CAPTAIN = sp('a06-captain', 'The Captain', 'a ship’s captain (voyages 1 and 3; a different man each time)');
const KING_ISLE = sp('a06-king-isle', 'The Island King', 'the king whose grooms find Sinbad on the shore (voyage 1)');
const MERCHANT = sp('a06-merchant', 'A Diamond Merchant', 'a merchant who throws meat into the valley of diamonds (voyage 2)');
const GATHERER = sp('a06-gatherer', 'A Coconut Gatherer', 'a sailor gathering coconuts with stones and monkeys (voyage 5)');
const FARMER = sp('a06-farmer', 'A Farmer of Serendib', 'a farmer who finds Sinbad by the river in Serendib (voyage 6); original');
const KING_SERENDIB = sp('a06-king-serendib', 'The King of Serendib', 'the King of Serendib, who writes to the Caliph (voyages 6 and 7)');
const CALIPH = sp('a06-caliph', 'Harun al-Rashid', 'the Abbasid Caliph Harun al-Rashid, as in the tale; shown with dignity');
const TRANSLATOR = sp('a06-translator', 'The Translator', 'a scholar of the House of Wisdom; original, placeholder');
const MASTER = sp('a06-master', 'The Ivory Merchant', 'the merchant who buys Sinbad and wants ivory (voyage 7)');

const N = say('narrator');
const Y = say('you');
const P = say('a06-porter');
const S = say('a06-sailor');
const YS = say('a06-young');
const ST = say('a06-steward');
const D = say('a06-daughter');
const CP = say('a06-captain');
const KI = say('a06-king-isle');
const ME = say('a06-merchant');
const GA = say('a06-gatherer');
const FA = say('a06-farmer');
const KS = say('a06-king-serendib');
const CA = say('a06-caliph');
const TR = say('a06-translator');
const MA = say('a06-master');
const NV = say('nova');

// =================================================================== quests

export const ATLAS_A06: Quest[] = [
  // ---------------------------------------------------------------- A6-1
  {
    id: 'a06-01',
    code: 'A6-1',
    title: 'Two Sinbads',
    source: `${TALES}: the frame, the porter on the bench`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page. Not before adviser sign-off.',
    },
    speakers: [PORTER, STEWARD, SAILOR],
    steps: [
      {
        id: 'a06-01-s1',
        goal: 'Help your friend the porter carry his load of paper across Baghdad.',
        hint: 'Pick up the basket by the porter and follow him through the lanes.',
        check: 'carry:a06-paper:house-of-wisdom',
        scene: {
          id: 'a06-01-street',
          lines: [
            N('Nova’s atlas falls open at a page the colour of hot stone: a round city on a river, drawn from above.'),
            N('You touch the river. The heat comes up off the paper, and you are standing in a lane with a basket on your back.'),
            P('Steady. Steady! That basket is worth more than both of us, and it isn’t even heavy.'),
            N('The man beside you carries three baskets to your one. He is a porter called Sinbad, and he has been your friend, it seems, for years.'),
            P('Paper, from the paper-makers’ market, for the scholars at the House of Wisdom. They write on it faster than I can fetch it.'),
            P('Every book in Baghdad has been on my back at some point. I can’t read a single one of them.', 'think'),
            N('Your Nubbin rides on top of your basket, among the rolls, like a cat on a warm wall.'),
            N('The lane smells of bread, cumin and river mud. A man is selling cold sherbet, and everybody wants some.'),
          ],
          choices: [
            {
              id: 'take',
              label: 'Take one of his baskets as well.',
              then: [
                P('You’re a good friend and a terrible porter. Lift from the knees.', 'happy'),
                N('Your Nubbin shifts to balance the load, and very nearly manages it.'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask what the scholars do with all this paper.',
              then: [
                P('They put books into Arabic, from Greek and Persian and the languages of India. Stars, medicine, numbers.'),
                P('And they argue. Mostly they argue. Paper’s cheaper than it was, so they argue at length.'),
              ],
            },
          ],
        },
        done: {
          id: 'a06-01-street-done',
          lines: [
            N('At the House of Wisdom a young scholar with ink to the elbow counts the rolls twice, and pays exactly.'),
            P('Exactly. He always pays exactly. Never one copper over.', 'think'),
          ],
        },
      },
      {
        id: 'a06-01-s2',
        goal: 'Rest on the bench by the great house on the way home.',
        hint: 'Sit down beside the porter in the shade by the gate.',
        check: 'sit:a06-bench:gate',
        scene: {
          id: 'a06-01-bench',
          lines: [
            N('On the way home the porter stops in the shade of a great house, and sets his empty baskets on a stone bench.'),
            N('Cool air comes from the gate with a smell of roast lamb and rosewater. Somewhere inside, a lute is playing.'),
            P('Listen to that. Somebody in there has never carried anything heavier than a spoon.'),
            P('I carry from first light to the last call to prayer, and I go home to lentils. He sits still, and gets lamb.', 'angry'),
            P('Same God made us both. I’m not complaining. I’m saying it out loud, which is different.'),
            N('He says it quite loudly. A window above the gate is open.'),
            N('Your Nubbin looks up at the window, then at you, the way it does in the Grove when someone is about to be caught.'),
          ],
          choices: [
            {
              id: 'hush',
              label: 'Tell him to keep his voice down.',
              then: [P('Why? It’s just as true in a whisper.')],
            },
            {
              id: 'agree',
              label: 'Say it isn’t fair.',
              then: [P('Thank you.', 'happy'), P('It isn’t, is it? I feel much better. No, I feel worse.', 'think')],
            },
          ],
        },
        done: {
          id: 'a06-01-bench-done',
          lines: [
            N('The gate opens. A steward in a spotless turban looks at the porter, then at you, then at your Nubbin.'),
            ST('My master asks for the man who was talking. And his friend. And… that.'),
          ],
        },
      },
      {
        id: 'a06-01-s3',
        goal: 'Go in and meet the master of the house.',
        hint: 'Follow the steward through the courtyard to the long room.',
        check: 'visit:a06-mansion:hall',
        scene: {
          id: 'a06-01-hall',
          lines: [
            N('Inside there is a courtyard with a fountain, then a long room of cushions, and more food than you have ever seen at once.'),
            N('At the head of the room sits an old man with a white beard, and a face burnt brown by a great deal of weather.'),
            S('Sit, sit. Eat first. A man shouldn’t have to argue with God on an empty stomach.', 'happy'),
            P('You heard that.', 'shock'),
            S('The whole street heard it. What’s your name?'),
            P('Sinbad. Sinbad the porter.'),
            S('So is mine. Sinbad the sailor. Well, Sinbad, anyway. The sailor part I had to earn.'),
            S('You think I sat here and the lamb walked in. Let me tell you what this house cost.', 'think'),
          ],
        },
        done: {
          id: 'a06-01-hall-done',
          lines: [N('The porter sits on the very edge of a cushion, as if it might send him a bill.')],
        },
      },
    ],
    complete: {
      id: 'a06-01-complete',
      lines: [
        S('Seven times I went to sea. Seven times I swore I never would again.'),
        S('Seven voyages won’t fit in one supper. I’ll tell them one at a time, and you’ll take food home for whoever is waiting.'),
        P('My daughter. She’ll want to know why I’m late.', 'soft'),
        S('Then you’ll have a story to tell her. That’s the price of supper: you listen properly.'),
        N('The old man looks at you and your Nubbin, as if he always knew the porter would bring you.'),
        S('You too. Sit closer. When I tell a thing, it has a way of happening again.'),
      ],
    },
    rewards: [],
    sets: { 'a06-01': true },
    notes:
      'OPENING: the page is Baghdad seen from above (the round city, its four gates, the Tigris with its bridges of boats), then a ' +
      'lane by the paper-makers’ market. The House of Wisdom is a busy library and translation house, not a ruin or a temple. ' +
      'The call to prayer may be heard as ambience at dusk (advisers to approve the recording and its use). Sinbad the Porter ' +
      'is poor, proud of his work, funny and honest; never pitiful. HAZEL’S MARGIN NOTE: if s24Done is set when ' +
      'a06-01-complete ends, play A06_VARIANTS a06-margin-hazel straight after it; otherwise the first time the page opens ' +
      'after s24Done is set.',
  },

  // ---------------------------------------------------------------- A6-2
  {
    id: 'a06-02',
    code: 'A6-2',
    title: 'The Island That Moved',
    source: `${TALES}: the first voyage, the whale-island`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-1') },
    requires: ['A6-1'],
    speakers: [PORTER, SAILOR, YOUNG, CAPTAIN],
    steps: [
      {
        id: 'a06-02-s1',
        goal: 'Listen to the first voyage, and step into it.',
        hint: 'Sit on your cushion in the long room until the carpet turns to sea.',
        check: 'sit:a06-cushion:first',
        scene: {
          id: 'a06-02-telling',
          lines: [
            S('I was young, and my father left me money, and I spent it the way young men do. Quickly, and on friends.'),
            S('When it was nearly gone, I sold what was left, bought goods, and went down the river to Basra to take ship.'),
            N('As he talks, the pattern on the carpet under your hand turns blue, and begins to move.'),
            N('The smell of lamb becomes a smell of tar and salt. The porter’s voice goes far away.'),
            P('Go on, then. I’ll mind the dates.'),
            N('You are on the deck of a dhow, a ship of sewn planks, under a great triangular sail full of wind.'),
            N('A young man with the old man’s eyes leans on the rail, grinning at the sea as if it owes him money.'),
            YS('You’re new. Good. Everybody else here has heard my jokes.', 'happy'),
          ],
          choices: [
            {
              id: 'joke',
              label: 'Ask to hear a joke.',
              then: [
                YS('What’s the difference between a merchant and a sailor?'),
                YS('About three days out of Basra.', 'happy'),
                N('Behind him, the helmsman groans like a man who has heard it every day for a month.'),
              ],
            },
            {
              id: 'sea',
              label: 'Ask if he’s been to sea before.',
              then: [YS('Never. Isn’t it wonderful? Nothing can possibly go wrong.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a06-02-telling-done',
          lines: [N('Weeks of blue go by in a breath. Then the lookout shouts: land, a small green island, flat as a plate, on a sea with no wind.')],
        },
      },
      {
        id: 'a06-02-s2',
        goal: 'Gather firewood with the merchants on the little island.',
        hint: 'Pick up sticks under the young trees and bring them to the fire.',
        check: 'collect:a06-firewood:island',
        scene: {
          id: 'a06-02-island',
          lines: [
            CP('Ashore, all of you. Stretch your legs, wash your shirts. Back aboard by evening.'),
            N('The island is strange underfoot: soft, a little springy, with sand in the hollows and young trees growing out of it.'),
            YS('Firewood! We’ll cook properly tonight, on dry land, like civilised people.', 'happy'),
            N('The merchants build a fire and set a pot on it. Somebody starts singing a song you don’t know.'),
            N('Your Nubbin sits down on the ground, then stands up again quickly and looks at its feet.'),
            N('The ground is warm. Not sun-warm: warm from underneath, the way a sleeping animal is warm.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell Sinbad the ground is warm.',
              then: [YS('It’s the sun, friend. Have a date.'), N('He hands you one. Under your feet, the island breathes out.')],
            },
            {
              id: 'fire',
              label: 'Kick sand over the fire.',
              then: [YS('Hey! That’s supper!', 'angry'), N('Too late, and not enough sand. The island has already noticed.')],
            },
          ],
        },
        done: {
          id: 'a06-02-island-done',
          lines: [
            N('The island shudders. All the young trees lean the same way at once.'),
            CP('Back to the ship! It isn’t an island! It’s a fish! Run!', 'shock'),
          ],
        },
      },
      {
        id: 'a06-02-s3',
        goal: 'Hold on to the washtub until the sea lets you go.',
        hint: 'Keep hold of the tub and kick towards the light.',
        check: 'swim:a06-tub:sea',
        scene: {
          id: 'a06-02-tub',
          lines: [
            N('The island rolls over, slowly, like somebody turning in bed. An eye the size of a cartwheel opens beside you.'),
            N('It is a whale, very old. It has been asleep so long that trees grew on its back.'),
            N('Then it is gone, down into the green, and everything that was on it is in the sea.'),
            N('The ship is already sailing. The captain is sure nobody could live through that, and he doesn’t look back.'),
            YS('Here! The washtub! Grab hold!', 'shock'),
            N('Sinbad has a wooden tub from the laundry, and he has you by the collar, and your Nubbin has you by the ear.'),
            N('Far below, something huge sings one long low note. Then the sea is only the sea.'),
          ],
          choices: [
            {
              id: 'kick',
              label: 'Kick, hard.',
              then: [N('The tub spins round and round, and goes nowhere in particular, very fast.')],
            },
            {
              id: 'float',
              label: 'Float, and let the current take you.',
              then: [YS('Good thinking. The sea knows where it’s going, even if I don’t.', 'think')],
            },
          ],
        },
        done: {
          id: 'a06-02-tub-done',
          lines: [N('A day, a night, another day. Then the tub bumps on sand, and Sinbad laughs, and is sick, and laughs again.')],
        },
      },
    ],
    complete: {
      id: 'a06-02-complete',
      lines: [
        N('The carpet is a carpet again. The porter is staring at you with a date halfway to his mouth.'),
        P('A fish. With trees on.'),
        S('A whale. I didn’t know the word then. Neither did the captain.'),
        P('And you lit a fire on its back.', 'think'),
        S('In fairness, it was a very good fire.', 'happy'),
        P('I’d have woken up too.'),
        N('Your Nubbin is still damp. Nobody can explain this, so nobody tries.'),
      ],
    },
    rewards: [],
    sets: { 'a06-02': true },
    notes:
      'The whale is old, vast and gentle; it dives because it was woken by the fire, not to hurt anyone. Its single low note is ' +
      'a sound cue (whale song, not a melody). The washtub is a wooden laundry trough. Your Nubbin stays damp-looking in the ' +
      'frame scene (a drip idle) as a small joke.',
  },

  // ---------------------------------------------------------------- A6-3
  {
    id: 'a06-03',
    code: 'A6-3',
    title: 'The King’s Stables',
    source: `${TALES}: the first voyage, the island king and the lost bales`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-2') },
    requires: ['A6-2'],
    speakers: [PORTER, SAILOR, YOUNG, KING_ISLE, CAPTAIN],
    steps: [
      {
        id: 'a06-03-s1',
        goal: 'Go with the king’s groom to meet the king.',
        hint: 'Follow the groom up from the beach where the horses graze.',
        check: 'talk:a06-king-isle:court',
        scene: {
          id: 'a06-03-shore',
          lines: [
            N('You are back in the tale, on a beach, and Sinbad is sitting up and counting his fingers.'),
            YS('Ten. Good. And you’re still here. Where’s here?'),
            N('Down the beach, beautiful horses graze by the surf, and a groom shouts at you for frightening them.'),
            N('The groom is kind, once he stops shouting. He feeds you both, and takes you up to his king.'),
            KI('A man who came out of the sea in a washtub. Sit by me. Tell me about Baghdad.', 'happy'),
            YS('It’s round, majesty. The city is perfectly round, with four gates, and the Caliph’s palace right in the middle.'),
            KI('Round. Why round?', 'think'),
          ],
          choices: [
            {
              id: 'fair',
              label: 'Say: so the palace is the same distance from every gate.',
              then: [KI('Fair. I like a fair city.', 'happy')],
            },
            {
              id: 'market',
              label: 'Say: so the markets never come to an end.',
              then: [KI('Ha! A city you can’t get out of. I know a few like that.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a06-03-shore-done',
          lines: [
            N('The king makes Sinbad keeper of his harbour. He writes down every ship that comes and goes.'),
            N('And he asks every captain the way to Baghdad.'),
          ],
        },
      },
      {
        id: 'a06-03-s2',
        goal: 'Help Sinbad check the cargo of a ship just in.',
        hint: 'Look at the marks painted on the bales on the quay.',
        check: 'inspect:a06-bales:mark',
        scene: {
          id: 'a06-03-harbour',
          lines: [
            N('Months pass in a page. Sinbad gets a good coat and a bad cough, and still asks every ship the way home.'),
            N('One morning a dhow comes in, and its sail has a patch on it you have seen before.'),
            YS('That’s our ship. That’s my ship.', 'shock'),
            CP('Unloading! Most of it’s for sale. Those bales belonged to a merchant who drowned.'),
            CP('Sinbad of Baghdad, God rest him. I’ll sell them here and take the money home to his family.'),
            N('The bales have Sinbad’s mark painted on the sacking. Your Nubbin sniffs one, and sneezes: it smells of home.'),
            YS('I’m Sinbad. I’m him.'),
            CP('Everybody’s Sinbad, the minute there’s something to be had. I met three Sinbads at the last port.', 'angry'),
          ],
        },
        done: {
          id: 'a06-03-harbour-done',
          lines: [N('The captain folds his arms. The bales sit between you, smelling of Basra.')],
        },
      },
      {
        id: 'a06-03-s3',
        goal: 'Help Sinbad prove who he is.',
        hint: 'Look inside the bale with the green cord.',
        check: 'talk:a06-captain:proof',
        scene: {
          id: 'a06-03-proof',
          lines: [
            YS('Ask me anything. Anything about the voyage.'),
            CP('All right. What did we eat the night the island sank?'),
            YS('Nothing. You all ran off and left the pot.'),
            CP('Hm. Then what’s in the bale with the green cord?', 'think'),
            N('Sinbad goes blank. He was a young man who never read his own lists.'),
            N('Your Nubbin is already tugging at the green cord. A corner of something blue shows through: dyed cloth, folded the Baghdad way.'),
          ],
          choices: [
            {
              id: 'point',
              label: 'Point at the blue cloth, and let Sinbad say it.',
              then: [
                YS('Indigo! Twenty lengths of indigo, from my uncle’s shop by the bridge!', 'happy'),
                CP('…That’s right.', 'shock'),
              ],
            },
            {
              id: 'whisper',
              label: 'Whisper, “Your uncle’s shop.”',
              then: [
                YS('My uncle’s indigo! Twenty lengths of it!', 'happy'),
                CP('…Nobody but Sinbad would know that.', 'shock'),
              ],
            },
          ],
        },
        done: {
          id: 'a06-03-proof-done',
          lines: [
            CP('I left you on a sinking fish. I’m sorry.', 'soft'),
            CP('Take your bales. And take my hand, if you will.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a06-03-complete',
      lines: [
        N('Sinbad sells his bales, gives the king a fine gift, and sails home with the captain who left him behind.'),
        N('They are friends by the time they reach Basra. Sailors are like that.'),
        P('He left you in the sea, and you shook his hand?'),
        S('He came back with my things. Every bale. Do you know how rare that is?'),
        P('I’ve carried for men who’d sell their own mother’s washing.', 'think'),
        S('Then you know. And I swore on my own doorstep: never again. That lasted nearly a year.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a06-03': true },
    notes:
      'The island king’s grooms tend the horses by the shore; the source’s sea-stallion breeding is left out. Baghdad’s round ' +
      'plan with four gates and the palace at the centre is historical (advisers to check the wording). The proof scene is ' +
      'played for comedy. The patched sail is the same one that becomes the A6-15 reward.',
  },

  // ---------------------------------------------------------------- A6-4
  {
    id: 'a06-04',
    code: 'A6-4',
    title: 'The Roc’s Egg',
    source: `${TALES}: the second voyage, the roc`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-3') },
    requires: ['A6-3'],
    speakers: [PORTER, SAILOR, YOUNG],
    steps: [
      {
        id: 'a06-04-s1',
        goal: 'Find out where the ship has gone.',
        hint: 'Climb the tallest tree on the island and look all round.',
        check: 'explore:a06-island:spring',
        scene: {
          id: 'a06-04-left',
          lines: [
            S('The second voyage. Money makes you bored, and boredom makes you stupid. So I went back to Basra.'),
            N('The carpet turns blue again, then green: an island of fruit trees, a cold spring, merchants resting in the shade.'),
            YS('Eat, drink, sleep for an hour. The captain said an hour.'),
            N('Sinbad lies down under a tree with his turban over his eyes. Your Nubbin lies down on his chest.'),
            N('You must sleep too. When you wake, the shade has moved a long way, and the sea is empty.'),
            YS('An hour! He said an hour!', 'shock'),
            YS('Twice now. What is it about me that makes captains leave?', 'sad'),
          ],
          choices: [
            {
              id: 'comfort',
              label: 'Say it isn’t him, it’s captains.',
              then: [YS('That’s kind. It’s also probably true.', 'soft')],
            },
            {
              id: 'climb',
              label: 'Say you should climb a tree and look.',
              then: [YS('Yes. Doing something. Good. Better than sulking.')],
            },
          ],
        },
        done: {
          id: 'a06-04-left-done',
          lines: [N('From the top of the tallest tree you can see the whole island. On the far side stands a great white dome, shining.')],
        },
      },
      {
        id: 'a06-04-s2',
        goal: 'Walk round the white dome and look for a way in.',
        hint: 'Circle the dome. Put your ear to it.',
        check: 'inspect:a06-dome:shell',
        scene: {
          id: 'a06-04-dome',
          lines: [
            N('The dome is smooth and white and as tall as a house, and it has no door.'),
            YS('Fifty paces round, I counted. No door, no window, no seam. Who builds a house with no door?'),
            N('Your Nubbin puts its ear to the white wall. Then it puts its whole face to it, and goes very still.'),
            N('Something inside goes tap, very small. Then tap, tap.'),
            N('The sun goes out. Not behind a cloud: out, the way a lamp does when somebody stands in front of it.'),
            N('A bird comes down out of the sky, a bird the size of a cloud, and settles over the dome like a hen.'),
            YS('It’s an egg. The dome is an egg. And that is its mother.', 'shock'),
          ],
        },
        done: {
          id: 'a06-04-dome-done',
          lines: [N('The roc tucks her head under her wing. She snores, and the snore lifts your hair.')],
        },
      },
      {
        id: 'a06-04-s3',
        goal: 'Tie yourselves to the roc’s foot before she wakes.',
        hint: 'Help Sinbad with his turban cloth at the roc’s foot.',
        check: 'climb:a06-roc:foot',
        scene: {
          id: 'a06-04-leg',
          lines: [
            YS('She’ll fly in the morning. Birds do. Wherever she goes, it’s off this island.'),
            N('He unwinds his turban, which turns out to be very long. Your Nubbin helps by getting wound up in it twice.'),
            N('You tie yourselves to one great scaly toe, gently, under the feathers, where she won’t feel it.'),
            YS('Don’t pull. Don’t tickle. Don’t breathe on her.'),
            N('At dawn the roc stands, stretches wings that cover half the sky, and steps off the island into the air.'),
            N('The sea drops away under your feet. Her heartbeat comes down her leg like a drum.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look down.',
              then: [N('The island is a coin. Then it is a crumb, and then it is gone.')],
            },
            {
              id: 'shut',
              label: 'Shut your eyes.',
              then: [N('Your Nubbin keeps its eyes open for both of you, and squeaks at every cloud.')],
            },
          ],
        },
        done: {
          id: 'a06-04-leg-done',
          lines: [N('At noon the roc comes down on a high bare ridge. You untie the turban faster than you have ever done anything.')],
        },
      },
    ],
    complete: {
      id: 'a06-04-complete',
      lines: [
        N('The roc doesn’t notice you at all. She shakes out her feathers and goes back up into the sun.'),
        N('As she goes, one feather comes loose and turns over and over in the air. It is as long as you are tall.'),
        N('Your Nubbin catches it, and falls over.'),
        YS('Keep that. Nobody in Baghdad will believe a word of this, so you’ll want proof.', 'happy'),
        N('When the carpet is a carpet again, the feather is still in your hands. The porter’s mouth is open.'),
        P('That is not a chicken.'),
        S('No. That is your friend’s, now. A feather a roc let go of is a gift, not a theft.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'a06-roc-feather',
        kind: 'cosmetic',
        label: 'Roc Feather',
        description: 'A huge bronze-and-cream feather a roc let fall over the ridge. Your Nubbin can wear it in its hat, where it is far too big and very proud.',
      },
    ],
    sets: { 'a06-04': true },
    notes:
      'The roc is a vast eagle, warm brown and cream; never a dragon or a monster. She is not hostile in this voyage and never ' +
      'notices you. Tapping from inside the egg sets up A6-9 (another egg, another chick). The feather comes through the page ' +
      'with you (the atlas’s small magic, as with the stone in A6-5). REWARD: roc feather cosmetic, granted on complete.',
  },

  // ---------------------------------------------------------------- A6-5
  {
    id: 'a06-05',
    code: 'A6-5',
    title: 'The Valley of Diamonds',
    source: `${TALES}: the second voyage, the valley of diamonds and the eagles`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-4') },
    requires: ['A6-4'],
    speakers: [PORTER, SAILOR, YOUNG, MERCHANT],
    steps: [
      {
        id: 'a06-05-s1',
        goal: 'Climb down into the valley without waking the snakes.',
        hint: 'Step only on the bare stone between the sleeping snakes.',
        check: 'explore:a06-valley:floor',
        scene: {
          id: 'a06-05-valley',
          lines: [
            N('The ridge looks down into a deep, narrow valley with walls too steep to climb. Its floor glitters, as if someone spilt the stars.'),
            YS('Diamonds. That’s a valley of diamonds. Look at the size of them!', 'shock'),
            N('Between the stones, long dark shapes lie coiled in the sun: snakes, each as thick as a well rope, all asleep.'),
            YS('Ah. So that’s why nobody has picked them up.'),
            N('There is no way out but down, so you go down, slowly, picking the gaps between the sleeping snakes.'),
            N('Your Nubbin walks on tiptoe. It has never done this before, and it does it very well.'),
          ],
          choices: [
            {
              id: 'breath',
              label: 'Hold your breath past the biggest snake.',
              then: [N('The snake opens one eye, considers you, and decides it isn’t hungry yet.')],
            },
            {
              id: 'round',
              label: 'Go the long way round it.',
              then: [N('It takes an hour. Sinbad complains, in a whisper, for the entire hour.')],
            },
          ],
        },
        done: {
          id: 'a06-05-valley-done',
          lines: [N('In the middle of the valley something falls out of the sky and lands with a wet slap. It is a great joint of meat.')],
        },
      },
      {
        id: 'a06-05-s2',
        goal: 'Work out where the meat is coming from, and how to use it.',
        hint: 'Watch the rim of the valley and the eagles above it.',
        check: 'wait:a06-eagle:meat',
        scene: {
          id: 'a06-05-meat',
          lines: [
            N('Another lump of meat lands, and another. Diamonds stick to them, pressed into the fat.'),
            N('Men on the rim are throwing the meat down. Great eagles drop out of the sky, snatch it, and carry it up.'),
            YS('I’ve heard of this. The eagles bring the meat up, the merchants chase them off it, and they pick out the stones.', 'think'),
            YS('If an eagle can lift that, it can lift me. And you two are very small.'),
            N('He ties himself under the biggest piece of meat with what’s left of his turban. It is the least dignified thing you have ever seen.'),
            N('Then he starts filling his pockets, fast, with the biggest stones in reach.'),
            YS('Take some! Quick! You’ll never be poor again!', 'happy'),
            N('By your foot lies a small clear stone, no bigger than a lentil. Your Nubbin looks at it, and then at you.'),
          ],
          choices: [
            {
              id: 'stone',
              label: 'Take one small stone, for the porter.',
              set: { 'a06-stone': 'taken' },
              then: [
                N('You put it in your pocket. It is warm from the sun, and weighs almost nothing.'),
                YS('One? One! You’re madder than the fish.', 'happy'),
              ],
            },
            {
              id: 'nothing',
              label: 'Take nothing.',
              set: { 'a06-stone': 'left' },
              then: [
                N('You leave it where it is. It goes on shining at the sky, as it has for a thousand years.'),
                YS('Nothing? Well. More for me.', 'think'),
                YS('…You’re a strange one.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a06-05-meat-done',
          lines: [N('Your Nubbin climbs into Sinbad’s sash. You grab hold of his belt with both hands.')],
        },
      },
      {
        id: 'a06-05-s3',
        goal: 'Ride the eagle up out of the valley.',
        hint: 'Hold on to Sinbad’s belt until you reach the rim.',
        check: 'carry:a06-eagle:rim',
        scene: {
          id: 'a06-05-lift',
          lines: [
            N('An eagle comes down like a dropped sack, hooks the meat, and heaves.'),
            N('You leave the ground. The snakes shrink to threads, and the wind is full of feathers.'),
            N('At the rim a merchant rushes out banging two pans. The eagle drops its load and flaps off, furious.'),
            ME('A man! There’s a man on my meat!', 'shock'),
            ME('And there are no diamonds on it. Not one. Because you’re lying on it!', 'angry'),
            YS('Peace, friend. Here. I have more than I can carry.'),
            N('Sinbad gives him a handful of stones. The merchant stops shouting all at once, like a kettle taken off the fire.'),
          ],
        },
        done: {
          id: 'a06-05-lift-done',
          lines: [ME('Twenty years I’ve thrown meat into that valley. Nobody ever came up with it before.', 'think')],
        },
      },
    ],
    complete: {
      id: 'a06-05-complete',
      lines: [
        N('The carpet and the cushions are back, and the porter is holding his breath.'),
        S('I came home rich. I gave a good part to the poor, as you should, and then I sat on the rest and got bored.'),
        N('Your hand is in your pocket. The little stone is still there, warm, as if it came back through the page with you.'),
        N('You put it in the porter’s palm. He looks at it for a long time.'),
        P('I’ve carried a hundred loads of other people’s jewels. Nobody ever gave me one.', 'soft'),
        P('I won’t sell it. Don’t ask me why. I just won’t.'),
        S('Good. A stone you don’t sell is worth more than one you do.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a06-05': true },
    notes:
      'SIGNATURE CHOICE 1 (a06-05-meat): a06-stone = taken | left. The base complete is for taken; if a06-stone = left, play ' +
      'A06_VARIANTS a06-05-complete-left in its place. Paid off in A6-16 (a06-16-telling / a06-16-telling-nothing). Neither ' +
      'choice is right or wrong, and nobody in the scene says so. The stone is NOT an inventory item or reward: it stays with ' +
      'the porter. The snakes are sleepy and never strike. The meat is a plain joint, not a carcass.',
  },

  // ---------------------------------------------------------------- A6-6
  {
    id: 'a06-06',
    code: 'A6-6',
    title: 'The Giant’s Island',
    source: `${TALES}: the third voyage, the one-eyed giant (softened)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-5') },
    requires: ['A6-5'],
    speakers: [PORTER, SAILOR, YOUNG],
    steps: [
      {
        id: 'a06-06-s1',
        goal: 'Explore the giant’s yard with the shipwrecked sailors.',
        hint: 'Look round the yard. Count everyone.',
        check: 'explore:a06-castle:yard',
        scene: {
          id: 'a06-06-castle',
          lines: [
            S('The third voyage. I’ll tell this one gently, since there’s a child at home who’ll want it.', 'soft'),
            N('The sea again: a storm, a strange island, and a house as big as a hill with a gate made of tree trunks.'),
            N('In the yard there are cooking pots big enough to bath in, and a bench like a ship turned upside down.'),
            YS('Nobody’s home. Good. I don’t like whoever lives here, and I haven’t met him.'),
            N('The ground shakes, one step at a time. A giant ducks in under the gate, with one eye in the middle of his forehead like a lamp.'),
            N('He looks at the sailors the way a hungry man looks at a full fruit tree.'),
            N('Then he yawns enormously, lies down across the gateway, and falls asleep with one hand on the bolt.'),
          ],
          choices: [
            {
              id: 'pot',
              label: 'Hide in a cooking pot.',
              then: [N('Your Nubbin is already in it. It is a surprisingly good pot.')],
            },
            {
              id: 'count',
              label: 'Count the sailors, to be sure everyone is here.',
              then: [N('Eleven sailors, one Sinbad, one you, one Nubbin. All here, and all very quiet.')],
            },
          ],
        },
        done: {
          id: 'a06-06-castle-done',
          lines: [YS('He’s asleep across the only way out. We go over him, or we don’t go.')],
        },
      },
      {
        id: 'a06-06-s2',
        goal: 'Get everyone past the sleeping giant and out of the gate.',
        hint: 'Find something in the cook’s bag that would make anyone sneeze.',
        check: 'watch:a06-giant:sneeze',
        scene: {
          id: 'a06-06-gate',
          lines: [
            N('The giant snores like the sea in a cave. Each breath ruffles the sailors’ beards from across the yard.'),
            YS('Pepper. The cook has pepper. Giants sneeze like anyone else.', 'think'),
            N('The cook hands over a whole bag of black pepper without a word, which is how you know how frightened he is.'),
            N('Your Nubbin is the smallest and quietest. It carries the bag up the giant’s arm, across his chest, to his nose.'),
            N('It tips the bag. The giant breathes in.'),
            N('He sneezes so hard he sits bolt upright, his eye streaming. He cannot see a thing for sneezing.'),
            YS('Now! Out! Everybody out!', 'shock'),
          ],
          choices: [
            {
              id: 'grab',
              label: 'Grab your Nubbin off the giant’s chin on the way past.',
              then: [N('You catch it as the next sneeze comes. It goes off like a thunderclap and blows you both through the gate.')],
            },
            {
              id: 'last',
              label: 'Wait and go last, after the sailors.',
              then: [N('Everyone is out. You go last, with your Nubbin under your arm and pepper in your hair.')],
            },
          ],
        },
        done: {
          id: 'a06-06-gate-done',
          lines: [N('Behind you the giant sneezes, and sneezes, and sneezes. None of the sneezes are aimed at anybody.')],
        },
      },
      {
        id: 'a06-06-s3',
        goal: 'Build rafts and get off the island before the giant stops sneezing.',
        hint: 'Lash driftwood together on the beach and push off.',
        check: 'build:a06-raft:shore',
        scene: {
          id: 'a06-06-raft',
          lines: [
            N('On the beach the sailors lash driftwood together with anything long: belts, ropes, Sinbad’s spare turban.'),
            YS('Push! Push off!'),
            N('The giant comes down to the shore, still sneezing, and throws rocks after the rafts. He is a poor thrower when he can’t see.'),
            N('The rocks make great white splashes far to the left and far to the right. One lands right behind you and soaks everyone.'),
            N('Then you are past the reef. The giant is only a shape on the shore, rubbing his eye and grumbling at the sea.'),
            YS('Nobody lost. Nobody! Do you know how rarely a story gets to say that?', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a06-06-complete',
      lines: [
        P('You sneezed a giant.'),
        S('I did not. Your friend’s little one did. I only ran.', 'happy'),
        P('My daughter will like that one.', 'happy'),
        S('That is how I tell it to children. It’s the truest way I know of telling it.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a06-06': true },
    childLines: {
      'a06-06-castle#5': 'He looks at the sailors, and then at his enormous empty cooking pots, and rubs his tummy.',
    },
    notes:
      'SOFTENED (care notes): the giant is a sleepy fairy-tale threat. Nobody is eaten, roasted, blinded or hurt; the source’s ' +
      'heated spits are replaced by the pepper sneeze. ART: one eye, huge and shaggy, plain clothes; NOT the Harryhausen film ' +
      'cyclops (no horn, no goat legs). The old sailor’s line that he tells it gently "for the children" is the page admitting ' +
      'the softening, in his own voice.',
  },

  // ---------------------------------------------------------------- A6-7
  {
    id: 'a06-07',
    code: 'A6-7',
    title: 'The Serpent',
    source: `${TALES}: the third voyage, the serpent and the night in the tree (softened)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-6') },
    requires: ['A6-6'],
    speakers: [PORTER, SAILOR, YOUNG, CAPTAIN],
    steps: [
      {
        id: 'a06-07-s1',
        goal: 'Get up a tree before the serpent reaches you.',
        hint: 'Climb the nearest tall tree, quickly.',
        check: 'climb:a06-tree:night',
        scene: {
          id: 'a06-07-island',
          lines: [
            N('The rafts wash up on a second island, quiet and green. Everyone is tired enough to cry.'),
            YS('Fruit. Water. Shade. I don’t trust any of it.'),
            N('At dusk a hiss comes out of the long grass, slow and dry, like sand being poured from a sack.'),
            N('Something comes out of the grass that is longer than the ship was, as thick as a tree, and patterned like a carpet.'),
            YS('Up! Up the trees, all of you!', 'shock'),
            N('You climb. Your Nubbin climbs faster, and sits on the branch above you, looking down with enormous eyes.'),
            N('The serpent winds round the foot of the tree, and waits. It has all night.'),
          ],
          choices: [
            {
              id: 'higher',
              label: 'Climb higher.',
              then: [N('The branches thin out. The serpent lifts its head, and finds it can’t quite reach.')],
            },
            {
              id: 'still',
              label: 'Stay where you are, and keep very still.',
              then: [N('Its tongue flickers a hand’s width under your foot. Then the great head sinks away to think.')],
            },
          ],
        },
        done: {
          id: 'a06-07-island-done',
          lines: [YS('It can climb. Snakes climb. We need something it can’t get through.', 'think')],
        },
      },
      {
        id: 'a06-07-s2',
        goal: 'Build a box of planks round yourselves in the tree, and last the night.',
        hint: 'Pull up the raft planks and tie them round the branches.',
        check: 'build:a06-box:planks',
        scene: {
          id: 'a06-07-box',
          lines: [
            N('Planks from the broken rafts are wedged in the lower branches. Sinbad hauls them up on his belt, one by one.'),
            YS('A box. A box round us, tied tight, with gaps to breathe. Like hens in a crate, only we want to be in it.'),
            N('You tie, and he ties, and your Nubbin holds each knot with both hands until it’s tight.'),
            N('All night the serpent circles the box. It tries the gaps, and rests its great head on the planks to listen.'),
            N('Its breath is cold. It smells of wet stone.'),
            N('Nobody sleeps. Sinbad tells you about Baghdad in a whisper: the round walls, the bridges of boats, his uncle’s indigo.'),
          ],
          choices: [
            {
              id: 'home',
              label: 'Ask what he’ll do when he gets home.',
              then: [YS('Never go to sea again.'), YS('I always say that.', 'soft')],
            },
            {
              id: 'hum',
              label: 'Hum a Grove tune to your Nubbin.',
              then: [N('It doesn’t belong here, and it helps. Even the serpent goes still for a while.')],
            },
          ],
        },
        done: {
          id: 'a06-07-box-done',
          lines: [N('At first light the serpent gives up. It pours itself away into the grass, and does not come back.')],
        },
      },
      {
        id: 'a06-07-s3',
        goal: 'Signal the ship on the horizon.',
        hint: 'Wave something long from the top of the tree.',
        check: 'watch:a06-ship:rescue',
        scene: {
          id: 'a06-07-sail',
          lines: [
            N('A sail. A sail on the horizon, coming this way.'),
            N('Sinbad waves his whole turban at it. This takes some time, because it is very long.'),
            CP('Castaways! Up you come, all of you. Mind the paint.'),
            CP('We’ve goods aboard from a merchant we left asleep on an island, a year back. Sinbad, his name was.'),
            YS('You didn’t.', 'happy'),
            CP('We did. We’ve been trying to find his family ever since, to give them the money.'),
            N('Sinbad laughs until he has to sit down on the deck. Your Nubbin sits down too, to keep him company.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a06-07-complete',
      lines: [
        S('Third voyage. I came home with more than I left with. And I swore.'),
        P('Never again.'),
        S('Never again.'),
        P('How long did it last?', 'think'),
        S('Long enough to get bored. The fourth is next, and it isn’t a funny one. I’ll tell it carefully.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a06-07': true },
    notes:
      'SOFTENED: in the source the serpent swallows Sinbad’s companions; here it only circles, and nobody is lost. The serpent ' +
      'is huge and patient, never shown striking. The captain is the captain who left Sinbad on the roc’s island in A6-4 (a ' +
      'different man from A6-3’s). The box of planks is the source’s own trick.',
  },

  // ---------------------------------------------------------------- A6-8
  {
    id: 'a06-08',
    code: 'A6-8',
    title: 'The Strange Custom',
    source: `${TALES}: the fourth voyage, the burial custom and the way out to the sea (softened)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-7') },
    requires: ['A6-7'],
    speakers: [PORTER, SAILOR, YOUNG],
    steps: [
      {
        id: 'a06-08-s1',
        goal: 'Listen to the fourth voyage from your cushion.',
        hint: 'Stay by the old man while he tells it.',
        check: 'sit:a06-cushion:fourth',
        scene: {
          id: 'a06-08-telling',
          lines: [
            S('The fourth voyage I’ll tell from here. You can come in at the end. The beginning you don’t need to see.', 'soft'),
            N('The lamps are lit. The porter puts down his bread, and listens with his whole face.'),
            S('A storm, and a kingdom on a far shore, rich and kind. Its people rode horses with no saddles.'),
            S('So I made them saddles. The king loved me for it, and he found me a wife, and I loved her.', 'happy'),
            S('She fell ill in the spring, and she died. I sat with her at the end. That part was gentle.', 'soft'),
            S('Then they told me their custom. When a wife or a husband dies, the one left behind goes down into the burial cave too.', 'sad'),
            P('Alive?', 'shock'),
            S('Alive, with water and seven loaves. Nobody there thought it cruel, and that frightened me most of all.'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Put your hand on his.',
              then: [S('Thank you. It was a long time ago. It is also tonight.', 'soft')],
            },
            {
              id: 'lap',
              label: 'Let your Nubbin climb into his lap.',
              then: [N('It sits on his knee and looks up at him. He rests one old hand on its head, and goes on.')],
            },
          ],
        },
        done: {
          id: 'a06-08-telling-done',
          lines: [S('Come in now. Just for the dark part, and the light after it. You’ll want to have seen the light.', 'soft')],
        },
      },
      {
        id: 'a06-08-s2',
        goal: 'In the dark cave, find where the fresh air is coming from.',
        hint: 'Stand still. Feel for a draught on your face.',
        check: 'explore:a06-cave:draught',
        scene: {
          id: 'a06-08-dark',
          lines: [
            N('The carpet goes black. It is cold and very quiet, and there is stone under your hands.'),
            N('Far above, a slab of light narrows to a line, and goes out.'),
            YS('Hello. You came. I wasn’t going to ask anyone to.', 'sad'),
            N('He is younger than the old man and older than the sailor on the whale. His voice is very steady, which is how you know.'),
            YS('I’ve been sitting here. Eating a little. Thinking about her. I can’t tell how long it’s been.'),
            N('Your Nubbin lifts its head and turns, slowly, to the left.'),
            N('There is a draught on your face, very faint. It smells, impossibly, of salt.'),
          ],
          choices: [
            {
              id: 'follow',
              label: 'Take Sinbad’s hand and follow the draught.',
              then: [N('You walk slowly, with your other hand on the wall. He holds on tight, and doesn’t say so.')],
            },
            {
              id: 'listen',
              label: 'Stay still and listen first.',
              then: [N('Far off, past the cold, something is scratching. Something small, and alive, and not afraid.')],
            },
          ],
        },
        done: {
          id: 'a06-08-dark-done',
          lines: [N('Something small brushes past your ankle: a little animal with a striped face, going somewhere on purpose.')],
        },
      },
      {
        id: 'a06-08-s3',
        goal: 'Follow the little animal through the crack to the sea.',
        hint: 'Go where the striped animal goes, sideways if you must.',
        check: 'walk:a06-tunnel:sea',
        scene: {
          id: 'a06-08-tunnel',
          lines: [
            N('It slips into a crack in the rock. In the dark, Sinbad laughs once, for the first time.'),
            YS('If it lives in here, it gets in and out. If it gets in and out, so can we.'),
            N('The crack is tight, then tighter, and you go sideways. Your Nubbin goes first, and waits for you at every bend.'),
            N('The salt smell grows. Then there is a sound, and it is the sea, and then there is a grey light.'),
            N('You come out on a strip of shingle at the foot of a cliff, with the whole morning in front of you.'),
            YS('Oh. Oh, look at it.', 'soft'),
            N('He sits down on the stones and cries, for her and for the morning, both at once. You sit beside him, and wait.'),
          ],
        },
        done: {
          id: 'a06-08-tunnel-done',
          lines: [N('Some days later a passing ship sees his fire on the shingle, and takes him home.')],
        },
      },
    ],
    complete: {
      id: 'a06-08-complete',
      lines: [
        N('The lamps in the long room. The porter has stopped eating altogether.'),
        P('I’m sorry about your wife.', 'soft'),
        S('Thank you. Nobody has said that to me in forty years. I never told anyone that part properly.', 'soft'),
        S('That is the truth about this house, porter. It was paid for, and some of it in ways I wouldn’t sell you.'),
        P('I said a foolish thing on your bench.'),
        S('You said a true thing on my bench. It was only half the truth. Come back for the other half.'),
      ],
    },
    rewards: [],
    sets: { 'a06-08': true },
    childLines: {
      'a06-08-telling#4': 'She fell ill in the spring, and she died. I held her hand at the end, and it was gentle.',
      'a06-08-telling#5': 'Then they told me a hard rule of theirs. The rule meant I had to go down into a dark cave.',
      'a06-08-telling#6': 'On your own?',
      'a06-08-telling#7': 'On my own, with water and bread. It was their way, and I was very frightened.',
    },
    notes:
      'SOFTENED (care notes): the old man tells the death and the custom from the cushion, once each, plainly. You step in only ' +
      'for the dark and the light. The cave is plain black rock: no bodies, bones, grave goods or other people are shown or ' +
      'mentioned, and the source’s killings in the cave are cut entirely. The little animal is a badger-like creature with a ' +
      'striped face. Grief is quiet; the beach scene is the turn of the page, and should be scored softly. Hazel’s third rule is ' +
      'acted out at the end of the tunnel scene, never named.',
  },

  // ---------------------------------------------------------------- A6-9
  {
    id: 'a06-09',
    code: 'A6-9',
    title: 'The Roc’s Revenge',
    source: `${TALES}: the fifth voyage, the broken egg and the boulders`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-8') },
    requires: ['A6-8'],
    speakers: [PORTER, SAILOR, YOUNG],
    steps: [
      {
        id: 'a06-09-s1',
        goal: 'Try to stop the merchants breaking the roc’s egg.',
        hint: 'Get to the white dome before the merchants do.',
        check: 'watch:a06-egg:merchants',
        scene: {
          id: 'a06-09-egg',
          lines: [
            S('The fifth voyage. I had my own ship by then, and I let other merchants sail on it. That was my mistake.'),
            N('An island, and a white dome. You know at once what it is, and the merchants don’t.'),
            YS('Don’t touch it. I mean it. I have met its mother.'),
            N('The merchants laugh at him, pick up rocks, and start knocking on the shell to see what is inside.'),
            N('The shell cracks. A huge wet chick tumbles out, all legs and fluff, and shrieks at the sky.'),
            YS('You fools. You complete, absolute fools.', 'angry'),
          ],
          choices: [
            {
              id: 'chick',
              label: 'Help the chick into the shade of the rocks.',
              then: [
                N('It is as big as a donkey and as soft as a pillow. It lets you push it, complaining, into the shade.'),
                N('Your Nubbin sits beside it. They seem to understand each other perfectly.'),
              ],
            },
            {
              id: 'between',
              label: 'Stand between the merchants and the chick.',
              then: [N('The merchants back off, muttering. One of them looks up at the sky, and goes pale.')],
            },
          ],
        },
        done: {
          id: 'a06-09-egg-done',
          lines: [N('Two shadows cross the island, one after the other, each the size of a field.')],
        },
      },
      {
        id: 'a06-09-s2',
        goal: 'Hang on to a plank when the rocs drop their boulders.',
        hint: 'Grab the nearest plank and keep your Nubbin close.',
        check: 'swim:a06-wreck:plank',
        scene: {
          id: 'a06-09-boulders',
          lines: [
            N('Sinbad gets everyone aboard, and the ship runs before the wind as fast as it has ever gone.'),
            N('High above, the rocs are carrying something in their claws: boulders as big as houses.'),
            YS('Hard over! Hard over, now!', 'shock'),
            N('The first boulder misses by a ship’s length, and sends up a wall of white water.'),
            N('The second doesn’t miss. The deck turns into planks, and the planks turn into sea.'),
            N('You come up with a plank under one arm and your Nubbin under the other. The sky is full of wings.'),
            N('The rocs circle once, and go back down to their chick. They are not cruel: they were only answering.'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout for Sinbad.',
              then: [YS('Here! Over here! Swim to me!')],
            },
            {
              id: 'float',
              label: 'Float, and save your breath.',
              then: [N('Sinbad’s plank bumps into yours an hour later. He looks very pleased to see you.')],
            },
          ],
        },
        done: {
          id: 'a06-09-boulders-done',
          lines: [N('A current takes you both. By evening there is an island under your feet, full of fruit and running water.')],
        },
      },
    ],
    complete: {
      id: 'a06-09-complete',
      lines: [
        N('The porter has brought his daughter tonight. She is asleep in the corner on a heap of cushions, holding a fig.'),
        P('They had it coming. The merchants, I mean.'),
        S('They did. So did I, a little. I knew, and I didn’t make them listen.', 'think'),
        P('You told them.'),
        S('Telling isn’t making someone listen. You know that. You carry for scholars.'),
        P('Ha. True.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a06-09': true },
    notes:
      'SOFTENED: in the source the merchants kill and eat the chick. Here they only crack the egg; the chick is alive, loud and ' +
      'fine, and its parents go back to it. Nobody is shown drowning: the wreck cuts from the deck breaking to you surfacing. ' +
      'The rocs are parents, not villains (the narration says so). The porter’s daughter appears asleep from here on in the ' +
      'frame scenes (art only until she speaks in A6-15).',
  },

  // ---------------------------------------------------------------- A6-10
  {
    id: 'a06-10',
    code: 'A6-10',
    title: 'The Old Man of the Sea',
    source: `${TALES}: the fifth voyage, the Old Man of the Sea and the coconut gatherers (softened)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-9') },
    requires: ['A6-9'],
    speakers: [PORTER, SAILOR, YOUNG, GATHERER],
    steps: [
      {
        id: 'a06-10-s1',
        goal: 'Help the little old man across the stream.',
        hint: 'Go to the stream where the old man is sitting.',
        check: 'carry:a06-old-man:stream',
        scene: {
          id: 'a06-10-bank',
          lines: [
            N('By a stream sits a little old man wrapped in seaweed, with legs as long and limp as kelp.'),
            N('He has a face like a walnut, and he does not speak. He points across the stream, and holds out his arms.'),
            YS('He wants carrying over. Poor old thing. Here, grandfather, up you come.', 'soft'),
            N('Sinbad lifts him on to his shoulders. The old man weighs almost nothing.'),
            N('Then he crosses his long legs round Sinbad’s neck, and squeezes. On the far bank, he does not get down.'),
            YS('All right. Off you get. Grandfather? Off?'),
            N('The old man drums his heels on Sinbad’s chest, and points at a fig tree. Sinbad has become a horse.'),
          ],
          choices: [
            {
              id: 'pull',
              label: 'Try to lift him off.',
              then: [N('His legs tighten. Sinbad goes red in the face, and you stop at once.')],
            },
            {
              id: 'ask',
              label: 'Ask him politely to get down.',
              then: [N('He looks at you with bright black eyes, and points at another fig tree.')],
            },
          ],
        },
        done: {
          id: 'a06-10-bank-done',
          lines: [N('Days pass like this. The old man sleeps on Sinbad’s shoulders, eats on them, and never once gets down.')],
        },
      },
      {
        id: 'a06-10-s2',
        goal: 'Find a way to make the Old Man of the Sea let go.',
        hint: 'Watch what the old man reaches for. Look for a low branch.',
        check: 'puzzle:a06-old-man:fig',
        scene: {
          id: 'a06-10-fig',
          lines: [
            YS('I can’t sleep. I can’t lie down. He steers me by the ears.', 'sad'),
            N('Your Nubbin is watching the old man’s hands. They are always reaching: for figs, for grapes, for anything just out of reach.'),
            N('By the stream one fig tree hangs a low branch heavy with the ripest fruit on the island. It is just too high for him.'),
            N('Your Nubbin points at the branch, then at the old man, then at Sinbad’s knees. Then it bends its own.'),
            YS('Under the branch. Then duck.', 'think'),
            YS('Oh, you wicked, wonderful thing.', 'happy'),
          ],
          choices: [
            {
              id: 'steer',
              label: 'Lead Sinbad under the low branch.',
              then: [N('The old man reaches up with both arms. Then he leans higher, greedily, and his legs loosen to let him.')],
            },
            {
              id: 'tickle',
              label: 'Send your Nubbin to tickle his feet first.',
              then: [N('The old man squirms and kicks. Then he sees the figs, stretches for them, and his legs loosen to let him.')],
            },
          ],
        },
        done: {
          id: 'a06-10-fig-done',
          lines: [
            YS('Now!'),
            N('Sinbad ducks. The old man is left hanging from the branch by both hands, his mouth full of fig, looking very surprised.'),
          ],
        },
      },
      {
        id: 'a06-10-s3',
        goal: 'Get coconuts down from the palms with the gatherers.',
        hint: 'Throw pebbles near the monkeys, never at them.',
        check: 'collect:a06-coconut:palms',
        scene: {
          id: 'a06-10-coconuts',
          lines: [
            N('Sinbad doesn’t wait to see whether the old man can climb down. He runs, you run, and your Nubbin runs fastest.'),
            N('On the shore you meet sailors from a ship, gathering coconuts. They can’t believe Sinbad got away.'),
            GA('Nobody gets away from him. Nobody. He rides them for years.', 'shock'),
            GA('Come with us. On this island you pick coconuts with pebbles and a bad temper. Watch.'),
            N('The palms are tall and smooth and full of monkeys. The sailors throw pebbles near the monkeys, carefully missing.'),
            N('The monkeys throw coconuts back, with tremendous energy and no aim at all.'),
          ],
          choices: [
            {
              id: 'throw',
              label: 'Throw a pebble.',
              then: [N('A coconut comes back and lands in your arms. You have won something.')],
            },
            {
              id: 'faces',
              label: 'Let your Nubbin pull faces at them instead.',
              then: [N('It works even better. It rains coconuts.'), GA('We’re keeping that one.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a06-10-complete',
      lines: [
        YS('He wasn’t wicked, you know, the old man. He just found a good shoulder and liked it.'),
        YS('I’ve known merchants like that.', 'think'),
        N('Back in the long room, the porter rubs his own shoulders without noticing he’s doing it.'),
        P('I’ve carried men like that. Never put them down, either.'),
        S('You did. You got up off my bench and came in. That’s putting something down.'),
        P('…Hm.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a06-10': true },
    notes:
      'CARE: the Old Man of the Sea is a fairy-tale sea creature (seaweed wrap, kelp legs, walnut face, bright black eyes), ' +
      'never a portrait of any person or people; he never speaks. SOFTENED: the source makes him drunk and kills him; here he ' +
      'is tricked off with a fig branch and left hanging, then sulking on the bank, unharmed (an art beat as you run). The ' +
      'monkeys are never hit: the pebbles land short, and the sailors say so in the art (a shake of the head at a near miss).',
  },

  // ---------------------------------------------------------------- A6-11
  {
    id: 'a06-11',
    code: 'A6-11',
    title: 'The River of Jewels',
    source: `${TALES}: the sixth voyage, the wreck coast and the underground river`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-10') },
    requires: ['A6-10'],
    speakers: [PORTER, SAILOR, YOUNG],
    steps: [
      {
        id: 'a06-11-s1',
        goal: 'Search the beach of wrecks for a way off the coast.',
        hint: 'Follow the river along the beach.',
        check: 'explore:a06-coast:wrecks',
        scene: {
          id: 'a06-11-coast',
          lines: [
            S('The sixth voyage. I was an old fool by then, and you know it, so you needn’t say so.'),
            P('I wasn’t going to.', 'happy'),
            N('A ship broken on a mountain coast. The beach is heaped with the wreckage of a hundred other ships, all spoiled by the sea.'),
            YS('Everything anybody ever lost is on this beach. And none of it is any use.'),
            S('My shipmates went over the mountain to look for a road. I never learned what became of them. I hope they found one.', 'soft'),
            N('A river runs down the beach the wrong way. It doesn’t flow into the sea: it flows into a cave in the mountain.'),
            YS('Water goes somewhere. A river always goes somewhere.', 'think'),
          ],
          choices: [
            {
              id: 'mountain',
              label: 'Look up at the mountain road.',
              then: [N('It goes up into cloud, steep and bare. Sinbad looks at it for a long time, then back at the river.')],
            },
            {
              id: 'river',
              label: 'Put your hand in the river.',
              then: [N('It is cold and quick, and tugs at your fingers as if it wants you to come along.')],
            },
          ],
        },
        done: {
          id: 'a06-11-coast-done',
          lines: [YS('A raft, then. If the river goes in, it comes out.')],
        },
      },
      {
        id: 'a06-11-s2',
        goal: 'Build a raft from the wreckage.',
        hint: 'Gather planks and rope from the wrecks by the cave mouth.',
        check: 'build:a06-raft:river',
        scene: {
          id: 'a06-11-raft',
          lines: [
            N('Planks from the wrecks, rope from the wrecks, and Sinbad’s knots, which are getting very good.'),
            N('The pebbles in the riverbed are jewels, red and blue and green, as common here as gravel.'),
            YS('Look at them. Nobody would believe me.', 'happy'),
            N('He fills a sack with them. Of course he does.'),
            N('Your Nubbin picks up one green pebble, looks at it, and puts it back exactly where it was.'),
            YS('You and your friend. Neither of you is any good at being rich.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Help him tie the sack to the raft.',
              then: [YS('Thank you. If we sink, at least we’ll sink impressively.', 'happy')],
            },
            {
              id: 'tease',
              label: 'Ask if he’s ever been good at it.',
              then: [YS('No. I’m good at getting rich. Being rich is a different thing altogether.', 'think')],
            },
          ],
        },
      },
      {
        id: 'a06-11-s3',
        goal: 'Ride the raft through the mountain in the dark.',
        hint: 'Lie flat on the raft and hold on.',
        check: 'explore:a06-river:dark',
        scene: {
          id: 'a06-11-dark',
          lines: [
            N('The cave swallows the raft. The light goes, and the roof comes down until it brushes your hair.'),
            N('The river carries you on in the dark, fast and cold. You lie flat, and your Nubbin lies flat on top of you.'),
            YS('Keep your head down. Keep your head down, and think of something nice.'),
            N('Where the rock comes close, it glitters faintly, like a sky with all the wrong stars in it.'),
            N('Hours, or days. Sinbad falls asleep, and so do you.'),
            N('The last thing you hear is the river, laughing to itself about something.'),
          ],
          choices: [
            {
              id: 'grove',
              label: 'Think of the Grove.',
              then: [N('You think of the pond, the fruit trees, and the cottage step warm in the sun. It helps more than you expect.')],
            },
            {
              id: 'porter',
              label: 'Think of the porter, waiting on his cushion.',
              then: [N('You can almost hear him, far off: “Go on, then. I’ll mind the dates.”')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a06-11-complete',
      lines: [
        N('You wake to sunshine and voices. The raft is tied to a bank among green fields, and people are looking down at you.'),
        P('Where? Where did it come out?'),
        S('Serendib. The great island at the foot of India. But that’s a story of its own.'),
        P('You can’t stop there!', 'angry'),
        S('I’m old. I can stop where I like.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a06-11': true },
    notes:
      'SOFTENED: in the source Sinbad’s shipmates die one by one on the beach; here they go over the mountain and their fate is ' +
      'unknown, and the old man hopes. The underground river is dark but never frightening: glittering rock, the raft rocking. ' +
      'Your Nubbin returns its pebble (an echo of A6-5, whichever way you chose there).',
  },

  // ---------------------------------------------------------------- A6-12
  {
    id: 'a06-12',
    code: 'A6-12',
    title: 'Serendib',
    source: `${TALES}: the sixth voyage, Serendib and its king`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-11') },
    requires: ['A6-11'],
    speakers: [PORTER, SAILOR, YOUNG, FARMER, KING_SERENDIB],
    steps: [
      {
        id: 'a06-12-s1',
        goal: 'Go with the farmers to see their king.',
        hint: 'Walk with the farmer through the fields to the palace.',
        check: 'walk:a06-serendib:fields',
        scene: {
          id: 'a06-12-bank',
          lines: [
            FA('You came out of the mountain. Nobody comes out of the mountain.', 'shock'),
            YS('I didn’t mean to. I’m from Baghdad.'),
            FA('Baghdad! The Caliph’s city. Come, then. Our king will want to hear this himself.', 'happy'),
            N('Terraces of rice step down the hills, bright green, with water shining in every one.'),
            N('Along the paths stand trees whose bark smells of cinnamon when you rub it.'),
            N('Your Nubbin rubs every tree it passes, and arrives at the palace smelling like a pudding.'),
          ],
          choices: [
            {
              id: 'cinnamon',
              label: 'Ask the farmer about the trees.',
              then: [FA('Cinnamon. Your merchants buy it from us, and sell it in Baghdad for ten times the price.', 'happy')],
            },
            {
              id: 'rice',
              label: 'Ask about the water in the terraces.',
              then: [FA('It comes down from the hills, field to field. Each farmer passes it on to the next. That’s the rule.')],
            },
          ],
        },
        done: {
          id: 'a06-12-bank-done',
          lines: [N('The palace is cool and open, full of birds. The king is already waiting, curious as a boy.')],
        },
      },
      {
        id: 'a06-12-s2',
        goal: 'Tell the King of Serendib about Baghdad.',
        hint: 'Sit with Sinbad before the king.',
        check: 'talk:a06-king-serendib:court',
        scene: {
          id: 'a06-12-court',
          lines: [
            KS('Welcome. Sit. They tell me you came by our river, through the mountain?'),
            YS('I did, majesty. Not on purpose.'),
            KS('Then you came by a road nobody has used. Tell me about your Caliph. Is he a just man?', 'think'),
            YS('I’ve never met him. They say he walks the city at night in plain clothes, to see how his people live.'),
            KS('A king who goes to look for himself. Good. Then I will write to him.', 'happy'),
            KS('When a ship sails for Basra, you will carry my letter, and my gifts. You will be my messenger.'),
          ],
          choices: [
            {
              id: 'honour',
              label: 'Nudge Sinbad to accept.',
              then: [YS('It would be an honour, majesty.'), N('He says it beautifully. Then he whispers to you, “What have I done?”')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin bow to the king.',
              then: [N('It bows so low it rolls over. The king laughs out loud, and the whole court is allowed to laugh too.')],
            },
          ],
        },
      },
      {
        id: 'a06-12-s3',
        goal: 'Climb the great mountain with the pilgrims before you sail.',
        hint: 'Join the pilgrims on the steps at night.',
        check: 'climb:a06-peak:dawn',
        scene: {
          id: 'a06-12-peak',
          lines: [
            N('Before the ship sails, Sinbad climbs the island’s great mountain with the pilgrims, all night, to see the sun rise.'),
            N('At the top there is a footprint in the rock, far bigger than any foot.'),
            FA('Some say it’s Adam’s, the first man. Some say the Buddha’s. Some say Shiva’s, and some say Saint Thomas’s.'),
            FA('We all climb the same steps. It’s a good mountain for that.', 'soft'),
            N('The sun comes up red over the sea. Everyone on the summit goes quiet at once, whoever they came for.'),
            N('Your Nubbin sits on your foot, very still, the way it does for the first frost in the Grove.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a06-12-complete',
      lines: [
        N('The king gives Sinbad a letter, and gifts for the Caliph, and a ship home.'),
        P('A king who writes to another king, because a sailor washed up in his river.'),
        S('That’s how most friendships between countries start, I think. Somebody washes up.'),
        P('Did you swear again?', 'happy'),
        S('I did. That one very nearly took.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a06-12': true },
    notes:
      'Serendib is Sri Lanka (Sri Lankan advisers for dress, the palace and the farmer). A6-12-s3’s mountain is Sri Pada ' +
      '(Adam’s Peak). The four traditions are named equally and briefly, as "some say", and none is made the true one ' +
      '(advisers from each faith to approve; cut the scene rather than get it wrong). The terraces’ shared water is a real ' +
      'tradition of Sri Lankan irrigation (adviser to confirm the wording).',
  },

  // ---------------------------------------------------------------- A6-13
  {
    id: 'a06-13',
    code: 'A6-13',
    title: 'The Caliph’s Gift',
    source: `${TALES}: the seventh voyage, the Caliph’s letter to Serendib`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-12') },
    requires: ['A6-12'],
    speakers: [PORTER, SAILOR, YOUNG, CALIPH, TRANSLATOR, CAPTAIN, KING_SERENDIB],
    steps: [
      {
        id: 'a06-13-s1',
        goal: 'Go with Sinbad to the Caliph’s court with the King of Serendib’s letter.',
        hint: 'Enter the palace of the Green Dome and wait to be called.',
        check: 'visit:a06-palace:court',
        scene: {
          id: 'a06-13-palace',
          lines: [
            N('Sinbad comes home through the Basra Gate of the round city, and goes straight to the palace of the Green Dome.'),
            N('The court is crowded with petitioners, scholars and inky clerks. One man selling figs has got in by mistake.'),
            CA('Peace be upon you. You are the man who came out of a mountain?'),
            YS('And upon you, peace, Commander of the Faithful. Through a mountain, rather.'),
            CA('And the King of Serendib has written to me. Read it to us, please.', 'think'),
            TR('He writes that he has heard of your justice. He sends a cup cut from a single ruby, and asks to be your friend.'),
            TR('It is written in Arabic, majesty, and very good Arabic. Somebody in Serendib has been reading our books.'),
            CA('Then he shall have more of them, and an answer. Sinbad, you will carry it.', 'happy'),
            YS('Majesty, I have sworn never to go to sea again.'),
            CA('Then swear again afterwards. You seem to be good at it.'),
          ],
          choices: [
            {
              id: 'translator',
              label: 'Ask the translator which languages they read at the House of Wisdom.',
              then: [
                TR('Greek, Persian, Syriac, Sanskrit. A little Chinese, badly.', 'happy'),
                TR('If a book exists anywhere, somebody in this city is putting it into Arabic. Or wants to.'),
              ],
            },
            {
              id: 'cup',
              label: 'Let your Nubbin look into the ruby cup.',
              then: [
                N('It sees its own face in the cup, small and red, and is delighted.'),
                CA('I see the gift has found its true admirer.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a06-13-palace-done',
          lines: [
            N('The Caliph sends books with the letter, and fine cloth, and a saddle worked in silver.'),
            N('Sinbad looks at the saddle for a long moment, and says nothing at all.'),
          ],
        },
      },
      {
        id: 'a06-13-s2',
        goal: 'Sail with the monsoon and deliver the Caliph’s letter to Serendib.',
        hint: 'Board at Basra when the wind turns, and carry the letter to the king.',
        check: 'deliver:a06-letter:serendib',
        scene: {
          id: 'a06-13-monsoon',
          lines: [
            N('Basra, in the season of the winds. Dhows crowd the quay, every one of them waiting for the same thing.'),
            CP('Half the year the wind blows from the south-west, and half the year from the north-east.'),
            CP('We go out on one, and come home on the other. Miss it, and you wait a year. So nobody misses it.'),
            YS('Six voyages, and I never once asked why we left when we did.', 'think'),
            CP('That’s because you’re a merchant. You only ask what things cost.', 'happy'),
            N('The wind turns in the night. In the morning every sail in Basra fills at once, like a flock lifting.'),
            N('Weeks of blue. Then green hills, and terraces of rice, and a king waiting on the shore.'),
            KS('Books! He sent books!', 'happy'),
          ],
        },
        done: {
          id: 'a06-13-monsoon-done',
          lines: [KS('Go home safely, messenger. Tell your Caliph I am reading.')],
        },
      },
    ],
    complete: {
      id: 'a06-13-complete',
      lines: [
        N('On the way home, pirates take the ship. They sell everyone aboard as slaves, in the market of a far town.'),
        N('Sinbad is bought by a rich merchant who deals in ivory.'),
        P('After all that? After the letter?', 'shock'),
        S('After all that. The sea never once asked me whether I deserved it.', 'soft'),
        S('The last part I want you both to see. There is a choice in it, and it isn’t mine.'),
      ],
    },
    rewards: [],
    sets: { 'a06-13': true },
    childLines: {
      'a06-13-complete#0': 'On the way home, pirates take the ship, and carry everyone far away.',
      'a06-13-complete#1': 'In a far town, Sinbad has to work for a rich merchant who trades in ivory, and he isn’t allowed to leave.',
    },
    notes:
      'HARUN AL-RASHID is a real ruler: dignified, curious, dry; advisers to approve his look, the court, the greetings and the ' +
      'title "Commander of the Faithful". The palace of the Green Dome and the Basra Gate are the round city’s own (advisers to ' +
      'check). The translator is a placeholder (any gender; advisers to name). The monsoon explanation is real and simple. ' +
      'The silver saddle is a quiet echo of A6-8 (he made saddles for the kingdom where his wife lived). SLAVERY is said ' +
      'plainly, once, in a06-13-complete#0: never shown, never a mechanic.',
  },

  // ---------------------------------------------------------------- A6-14
  {
    id: 'a06-14',
    code: 'A6-14',
    title: 'The Elephant Hunter',
    source: `${TALES}: the seventh voyage, the elephants and their graveyard (softened)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-13') },
    requires: ['A6-13'],
    speakers: [YOUNG, MASTER],
    steps: [
      {
        id: 'a06-14-s1',
        goal: 'Sit in the tree by the elephants’ path with Sinbad.',
        hint: 'Climb up beside Sinbad before dawn, and watch the path.',
        check: 'sit:a06-tree:dawn',
        scene: {
          id: 'a06-14-tree',
          lines: [
            MA('You’re the one who talks to kings? Good. Can you shoot?'),
            YS('Badly.'),
            MA('It doesn’t matter. Sit in the tree by the elephants’ path. When they pass, shoot. I need ivory.'),
            N('Every morning Sinbad sits in the tree with the bow. You sit beside him, and your Nubbin sits on the branch above.'),
            N('Every morning the herd comes past in the half-light, slow and huge, led by an old cow with one tusk broken short.'),
            N('Every morning Sinbad’s arrows land in the mud, a long way from any elephant.'),
            YS('I’m the worst archer in the world. On purpose. Don’t tell him.'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'Promise not to tell.',
              then: [YS('Thank you. He isn’t a bad man. He’s just a man with a warehouse.', 'soft')],
            },
            {
              id: 'calves',
              label: 'Count the calves in the herd.',
              then: [N('Four calves, walking under their mothers like boats in a harbour. One stops to look up at you, and is hurried on.')],
            },
          ],
        },
        done: {
          id: 'a06-14-tree-done',
          lines: [N('Weeks of mud and missed arrows. The master grumbles, and buys more arrows.')],
        },
      },
      {
        id: 'a06-14-s2',
        goal: 'Go where the herd takes you.',
        hint: 'Hold on to Sinbad, and let the elephants lead.',
        check: 'watch:a06-herd:valley',
        scene: {
          id: 'a06-14-herd',
          lines: [
            N('One morning the herd doesn’t pass. It stops, and gathers round the tree, and is very quiet.'),
            N('The old cow wraps her trunk round the tree and pulls it over slowly, the way you would pull a weed you were fond of.'),
            N('Sinbad falls. She catches him in her trunk, sets him on her back, and the herd turns off the path.'),
            YS('Don’t let go of me! Come with me!', 'shock'),
            N('She lets you climb up behind him. She doesn’t seem to mind your Nubbin at all.'),
            N('They walk all day, up into the hills, to a valley whose floor is white.'),
            N('It is a valley of old bones and old tusks. This is where the elephants come when they are very old, to lie down.'),
            N('The cow sets you down, unhurt. The herd stands round you in a ring, looking, and then they turn and go.'),
            YS('They brought me here. They’re saying: here, take these, and leave us alone.', 'soft'),
          ],
        },
        done: {
          id: 'a06-14-herd-done',
          lines: [
            YS('Go on ahead to the town. I’ve twisted my ankle, and I’ll be slow. He’ll ask you first.'),
            YS('You decide what he’s told. I’ve done all the deciding for elephants I ever want to do.'),
          ],
        },
      },
      {
        id: 'a06-14-s3',
        goal: 'The master is at his gate. Decide what to tell him.',
        hint: 'Talk to the master at the gate.',
        check: 'choose:a06-master:gate',
        scene: {
          id: 'a06-14-gate',
          lines: [
            N('The master meets you at his gate, and he is worried, and not only about his ivory.'),
            MA('The tree’s down. The path’s churned up. I thought the beasts had trampled him.', 'shock'),
            MA('Where is he? Where did Sinbad go?'),
            N('Behind you, far off on the hill road, the herd is walking home in a long grey line.'),
            N('The master follows your eyes to the hills, and back again.'),
            N('Your Nubbin looks at the herd, then at the master, then at you. It waits.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell him, once he swears to take only the old tusks and never hunt again.',
              set: { 'a06-ivory': 'told' },
              then: [
                Y('There’s a valley. They took him there. Before I show you, swear something.'),
                MA('Swear what?', 'think'),
                Y('Only what’s already lying there. And no more hunting. Not ever.'),
                MA('…I swear it. On my children.', 'soft'),
              ],
            },
            {
              id: 'keep',
              label: 'Keep the elephants’ secret.',
              set: { 'a06-ivory': 'kept' },
              then: [
                Y('I don’t know where he went.'),
                MA('You don’t know? Or you won’t say?', 'think'),
                N('You say nothing. Beside you, your Nubbin says nothing very loudly.'),
                MA('…He’ll come back. Where else would he go?'),
              ],
            },
          ],
        },
        done: {
          id: 'a06-14-gate-done',
          lines: [N('That evening Sinbad limps in through the gate. He looks at you and at the master, and understands everything without a word.')],
        },
      },
    ],
    complete: {
      id: 'a06-14-complete',
      lines: [
        N('The master takes his carts to the valley, and loads them with the tusks the herd let fall when they died old.'),
        N('On the road back, the herd passes the carts. They don’t stop, and the master bows his head to them until they’re gone.'),
        MA('You’ve made me rich, Sinbad. You’re free. Go home, and take your share.'),
        YS('The elephants paid for my freedom. I want to remember that I didn’t.', 'soft'),
        MA('Nobody in this town will hunt them again. There’s no need now, and I’ve sworn.'),
      ],
    },
    rewards: [],
    sets: { 'a06-14': true },
    notes:
      'SIGNATURE CHOICE 2 (a06-14-gate): a06-ivory = told | kept. The base complete is for told (the tale’s own ending); if ' +
      'a06-ivory = kept, play A06_VARIANTS a06-14-complete-kept in its place. Pays off in A6-15 (both scenes) and A6-16 (the ' +
      'porter’s last line). EVERY ENDING LETS THE ELEPHANTS BE: in both, no elephant is hunted again, and both say so. CARE: no ' +
      'elephant is ever shot or hurt on screen (the arrows always land in mud, far off). The valley of bones is quiet and clean, ' +
      'white stones and old tusks in grass, nothing dead-looking. No ivory is a reward, decoration, item or shop good on either ' +
      'branch: the tusks stay in the master’s carts. The old cow has one tusk broken short; never a torn ear (canon 10). The ' +
      'frame (porter, old sailor) is absent from this quest on purpose: you are on your own with the choice.',
  },

  // ---------------------------------------------------------------- A6-15
  {
    id: 'a06-15',
    code: 'A6-15',
    title: 'Home',
    source: `${TALES}: the seventh voyage, the homecoming, and the frame`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-14') },
    requires: ['A6-14'],
    speakers: [PORTER, SAILOR, YOUNG, DAUGHTER],
    steps: [
      {
        id: 'a06-15-s1',
        goal: 'Come home to Baghdad with Sinbad.',
        hint: 'Walk with Sinbad from the quay to the round city.',
        check: 'walk:a06-basra:quay',
        scene: {
          id: 'a06-15-quay',
          lines: [
            N('The ship comes into Basra early, on the first of the winds, sitting low in the water.'),
            YS('Home. Rich, early, and in one piece. That has never once happened before.', 'happy'),
            N('He hires a boat up the river, and walks in through the Basra Gate with porters behind him, and you beside him.'),
            N('At the palace he tells the Caliph that the King of Serendib is reading. The Caliph laughs, and is pleased.'),
            YS('Seven times. Seven! And I swear it now, in front of you two: there is no eighth.'),
            N('For once, he keeps it. You can tell, because the old man in the long room is sitting so very still.'),
          ],
          choices: [
            {
              id: 'believe',
              label: 'Say you believe him this time.',
              then: [YS('So do I. That’s new.', 'happy')],
            },
            {
              id: 'doubt',
              label: 'Ask how long it will last.',
              then: [YS('Ha! Fair.', 'happy'), YS('This time, I think, for good. I’ve run out of things to be bored of.', 'soft')],
            },
          ],
        },
      },
      {
        id: 'a06-15-s2',
        goal: 'Walk the porter home to his street.',
        hint: 'Leave the great house with the porter and his daughter.',
        check: 'visit:a06-street:porter',
        scene: {
          id: 'a06-15-street',
          lines: [
            N('The carpet turns back into a carpet. The old man is smiling down at his own hands.'),
            S('I came home heavy that time, heavier than ever. I’ve always wondered what to do with it.'),
            S('Porter. Your street. Does it have a fountain?'),
            P('There’s a well at the far end. The women walk there and back all morning.', 'think'),
            S('Then it has a fountain now. Or it will by the spring.'),
            N('Next morning, when you walk the porter home, there are workmen on his street with a cart of stone, marking out a fountain.'),
            D('Baba! They’re building water! Right here!', 'happy'),
          ],
          choices: [
            {
              id: 'why',
              label: 'Ask the old man why.',
              then: [S('Because a man complained on my bench, and he was right.')],
            },
            {
              id: 'cup',
              label: 'Promise the daughter you’ll come back for the first drink.',
              then: [D('You have to! I’ll save you the first cup. And one for the little one.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a06-15-complete',
      lines: [
        N('Later, back in the long room, the old man opens a chest.'),
        S('Before you go, I have something for you and your little one.'),
        N('It is a sail, folded small: old canvas, salt-stained, with a patch on it you have seen before.'),
        S('From my first ship. The one that left me on the whale, and came back with my bales.'),
        S('Hang it somewhere you can see the wind. It’s no use to me now. I don’t go anywhere.', 'soft'),
        P('Then give me one more evening. Next time, you’ll hear mine.'),
        S('Yours?', 'happy'),
        P('I’ve been listening for seven nights. I think I’ve got one.'),
      ],
    },
    rewards: [
      {
        id: 'a06-dhow-sail',
        kind: 'decor',
        label: 'Dhow Sail',
        description: 'The old patched sail from Sinbad’s first ship, rigged on a pole in the Grove. It swings to show which way the wind is blowing.',
      },
    ],
    sets: { 'a06-15': true },
    notes:
      'BRANCHES (a06-ivory): told = the base scenes (rich and early; the old man pays for a public fountain, a sabil, on the ' +
      'porter’s street). kept = A06_VARIANTS a06-15-quay-kept and a06-15-street-kept replace the two scenes (poor and late; the ' +
      'porter feeds the old man at his own home). The complete is shared. A public drinking fountain is a real charitable ' +
      'tradition (advisers to check how it is shown). The porter’s home: one clean room, a daughter, lentils; poor and dignified, ' +
      'never squalid. REWARD: dhow-sail decoration, granted on complete.',
  },

  // ---------------------------------------------------------------- A6-16
  {
    id: 'a06-16',
    code: 'A6-16',
    title: 'The Porter’s Voyage',
    source: `${TALES}: the frame’s close, retold; and the Nights’ own frame, mentioned`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A6-15') },
    requires: ['A6-15'],
    speakers: [PORTER, SAILOR, DAUGHTER],
    steps: [
      {
        id: 'a06-16-s1',
        goal: 'Listen to the porter tell his own story.',
        hint: 'Sit in the long room with the household.',
        check: 'talk:a06-porter:story',
        scene: {
          id: 'a06-16-telling',
          lines: [
            N('The last evening. The long room is full: the steward, the cook, the porter’s daughter, and the old man, for once a listener.'),
            P('I’ve never told a story. I’ve carried a few. Bear with me.'),
            N('He takes something from his sash and sets it on the low table. The lamplight finds it: a small clear stone, no bigger than a lentil.'),
            P('This is the first line of my story. A friend brought it out of a valley that nobody comes back from.'),
            P('I’ve carried other people’s jewels all my life. This is the only one anybody ever brought for me. So I’ll never sell it.'),
            P('My story is short. I’m a porter in Baghdad. I carry paper to the House of Wisdom, and I can’t read, so I listen.'),
            P('I listened to a rich man for seven nights, and I found out he was paid for, the same as me. Only in different coins.'),
          ],
        },
        done: {
          id: 'a06-16-telling-done',
          lines: [
            P('And at the end, a herd walked home through the hills, and nobody shot at them, and nobody ever will.'),
            P('The elephants were paid for in bones.', 'soft'),
            N('Nobody says anything. Then the old man claps, slowly, and the steward joins in, and then everybody does.'),
          ],
        },
      },
      {
        id: 'a06-16-s2',
        goal: 'Take the storyteller’s cushion home and find it a place in the Grove.',
        hint: 'Step back through the page, then put the cushion down somewhere your Nubbins can gather.',
        check: 'place:a06-cushion:grove',
        scene: {
          id: 'a06-16-grove',
          lines: [
            S('Take this. It’s the cushion I told from, all seven nights. I have a feeling I’m done telling.'),
            N('It is fat and round and faded, embroidered with a small ship under a big sail.'),
            P('He’s done telling. Now he wants to listen. Fifty years late, he says, and he’s starting with me.', 'happy'),
            D('And me. I’m telling him the giant one tomorrow. With the pepper.', 'happy'),
            N('You step back through the page. The lamps go, and the Grove’s own evening is all round you, smelling of grass.'),
            N('Your Nubbin is already dragging the cushion across the lawn, looking for the right spot.'),
          ],
          choices: [
            {
              id: 'pond',
              label: 'Set it down by the pond.',
              then: [N('Where the water can listen too. Your Nubbin approves, and sits on it at once.')],
            },
            {
              id: 'trees',
              label: 'Set it down under the fruit trees.',
              then: [N('In the shade, where the evening comes first. Your Nubbin approves, and sits on it at once.')],
            },
          ],
        },
        done: {
          id: 'a06-16-grove-done',
          lines: [N('One by one your Nubbins come over the grass and sit down in a ring round the cushion, as if somebody had rung a bell.')],
        },
      },
      {
        id: 'a06-16-s3',
        goal: 'Tell your own story to the Grove.',
        hint: 'Sit on the storyteller’s cushion.',
        check: 'sit:a06-cushion:tell',
        scene: {
          id: 'a06-16-tell',
          lines: [
            N('You sit on the cushion. All the small faces turn up to you.'),
            N('Behind you there are footsteps on the grass. Nova sits down at the back of the ring without a word.'),
            N('You have never told a story either. You think of the porter’s hands on the table.'),
            N('Your Nubbin climbs off the cushion and sits on your foot instead, to help.'),
            N('You take a breath, the way the old man did, as if the Grove were a ship and you could feel it move.'),
            N('Then you begin.'),
          ],
          choices: [
            {
              id: 'whale',
              label: 'Begin with the island that was a whale.',
              then: [Y('Once there was an island that was fast asleep…'), N('Your Nubbin rolls on to its back, being the whale.')],
            },
            {
              id: 'porter',
              label: 'Begin with the porter on the bench.',
              then: [Y('Once there was a man who carried every book in Baghdad, and couldn’t read a single one…')],
            },
            {
              id: 'elephants',
              label: 'Begin with the elephants.',
              then: [Y('Once there was a herd of elephants who only wanted to be left alone…'), N('Every Nubbin in the ring goes very still.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a06-16-complete',
      lines: [
        N('It takes you all evening. Your Nubbin acts out every part, badly and with great feeling, especially the roc.'),
        NV('That page always tells it a bit differently. I’ve never heard the porter get the last word before.', 'happy'),
        NV('Who told it first? Nobody knows. In the book, it’s a woman in Persia, telling a king one story a night.'),
        NV('She kept a cruel king listening for a thousand and one nights, until he learned to be kind.', 'soft'),
        NV('Persian and Arabic, then French, then English, and now you, on a cushion. Stories travel like sailors. They come home changed.'),
        N('Your Nubbins don’t leave the ring for a long time, even after the stars are out.'),
      ],
    },
    rewards: [
      {
        id: 'a06-storyteller-cushion',
        kind: 'decor',
        label: 'Storyteller’s Cushion',
        description: 'The old sailor’s faded cushion, embroidered with a ship. Place it in the Grove: your Nubbins sometimes gather round it in a ring to listen, and sit with you when you sit on it.',
      },
    ],
    sets: { 'a06-16': true, 'a06-done': true },
    notes:
      'PAYOFFS. a06-stone: taken = the base a06-16-telling (the stone on the table); left = A06_VARIANTS ' +
      'a06-16-telling-nothing replaces it ("I had nothing, so I listened."). a06-ivory: told = the base a06-16-telling-done ' +
      '("paid for in bones"); kept = A06_VARIANTS a06-16-telling-done-kept ("paid for in a season"). Step 2 ends and step 3 plays in the ' +
      'Grove, like other Atlas keepsake scenes (no gate is mentioned, so the Open ending needs no variant): they write nothing to the Grove save, only a06-16 and a06-done in the Atlas save. ' +
      'The cushion’s gathering is an idle behaviour (SIM, see the log), never a timed or daily event. NOVA’S LINES mention the ' +
      'Nights’ Persian frame (Shahrazad, unnamed here) gently; advisers to approve. The bookmark: the Great Voyage festival ' +
      '(A2, A6, A9, A10, any two) reads atlasDone(\'A6\') from a06-done.',
  },
];

// =================================================================== variants

/** Scenes chosen by flags. Each replaces the scene named in its comment; the margin note plays once after a06-01-complete. */
export const A06_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- Hazel's margin note (Grove s24Done)
  {
    id: 'a06-margin-hazel',
    lines: [
      N('In the margin beside the round city, in soft pencil you have never noticed before, there is a note. You know the hand.'),
      N('“Seven voyages, and he still came home to tell it to a porter. Somebody has to stay put and listen. I volunteer. H.”'),
      N('Underneath, smaller, is a whale drawn in three quick lines, with a tree growing out of its back.'),
    ],
  },

  // ---------------------------------------------------------------- A6-5, a06-stone = left: replaces a06-05-complete
  {
    id: 'a06-05-complete-left',
    lines: [
      N('The carpet and the cushions are back, and the porter is holding his breath.'),
      S('I came home rich. I gave a good part to the poor, as you should, and then I sat on the rest and got bored.'),
      N('Your pockets are empty. The porter notices you checking them.'),
      P('Nothing? You were in a valley of diamonds, and you brought back nothing?'),
      P('That’s either very wise or very silly. I’ll think about it tonight.', 'think'),
      S('Everything I brought out of that valley, I spent. You can’t spend what you left there.'),
    ],
  },

  // ---------------------------------------------------------------- A6-14, a06-ivory = kept: replaces a06-14-complete
  {
    id: 'a06-14-complete-kept',
    lines: [
      N('Sinbad stays. A season passes in a page: a dry season, then the rains.'),
      N('Three times the herd walks past the master’s gate, slow and huge and calm. Three times they harm nothing, not even his garden.'),
      MA('Three times. They could flatten this house in a minute, and they walk round my beans.', 'think'),
      MA('I’m done. No more arrows. No more hunting, not by me, and not by anyone I pay.', 'soft'),
      MA('Go home, Sinbad. You’re free. I’ve nothing to give you, and I’m sorry for that.', 'sad'),
      YS('You’re giving me home. That’s plenty.', 'soft'),
    ],
  },

  // ---------------------------------------------------------------- A6-15, a06-ivory = kept: replaces a06-15-quay
  {
    id: 'a06-15-quay-kept',
    lines: [
      N('Sinbad comes home late, on the last of the winds, on a ship that carries him for nothing, with only a staff and a borrowed cloak.'),
      N('From Basra he walks the river road to Baghdad, because he can’t pay for a boat. It takes eleven days.'),
      YS('Home. Poor, late, and in one piece. That still counts.'),
      N('At the palace he tells the Caliph that the King of Serendib is reading. The Caliph thanks him, and gives him supper.'),
      YS('Fair enough. He doesn’t owe me for elephants.', 'happy'),
      YS('Seven times. And I swear it now, in front of you two: there is no eighth.'),
      N('For once, he keeps it. You can tell, because the old man in the long room is sitting so very still.'),
    ],
    choices: [
      {
        id: 'believe',
        label: 'Say you believe him this time.',
        then: [YS('So do I. That’s new.', 'happy')],
      },
      {
        id: 'doubt',
        label: 'Ask how long it will last.',
        then: [YS('Ha! Fair.', 'happy'), YS('This time, for good. I’ve nothing left to go to sea for, and I find I don’t mind.', 'soft')],
      },
    ],
  },

  // ---------------------------------------------------------------- A6-15, a06-ivory = kept: replaces a06-15-street
  {
    id: 'a06-15-street-kept',
    lines: [
      N('The carpet turns back into a carpet. The old man is smiling down at his own hands.'),
      S('I came home with nothing that time. It’s the voyage I’m proudest of.'),
      P('Nothing? After all that?'),
      S('Not a coin. I sat on the steps of this house, which was shut up, and I didn’t have the key.'),
      P('Then tonight you eat at mine.', 'soft'),
      S('Porter, I have a cook.', 'shock'),
      P('You have a cook. I have lentils, a daughter, and a roof that only leaks a bit. Come on.'),
      N('The porter’s home is one room, swept clean. His daughter gives the old man the best cushion, which is the only cushion.'),
      D('Baba says you were poor once too. Is that true?'),
      S('Once. Only for a season. It was a very good season.', 'soft'),
    ],
    choices: [
      {
        id: 'eat',
        label: 'Eat the lentils with them.',
        then: [S('I’ve eaten at the Caliph’s table. These are better. Don’t tell him.', 'happy')],
      },
      {
        id: 'nubbin',
        label: 'Let your Nubbin sit with the daughter.',
        then: [N('She feeds it lentils one at a time, and tells it the whale story, wrong, with tremendous confidence.')],
      },
    ],
  },

  // ---------------------------------------------------------------- A6-16, a06-stone = left: replaces a06-16-telling
  {
    id: 'a06-16-telling-nothing',
    lines: [
      N('The last evening. The long room is full: the steward, the cook, the porter’s daughter, and the old man, for once a listener.'),
      P('I’ve never told a story. I’ve carried a few. Bear with me.'),
      N('He sets nothing on the low table. He looks at the empty place where something could be, and smiles.'),
      P('I had nothing, so I listened.'),
      P('That’s my first line. A friend went into a valley of diamonds and brought me nothing back. I’ve decided it was a present.'),
      P('My story is short. I’m a porter in Baghdad. I carry paper to the House of Wisdom, and I can’t read, so I listen.'),
      P('I listened to a rich man for seven nights, and I found out he was paid for, the same as me. Only in different coins.'),
    ],
  },

  // ---------------------------------------------------------------- A6-16, a06-ivory = kept: replaces a06-16-telling-done
  {
    id: 'a06-16-telling-done-kept',
    lines: [
      P('And at the end, a herd walked past a gate three times, and nobody shot at them, and nobody ever will.'),
      P('The elephants were paid for in a season.', 'soft'),
      N('Nobody says anything. Then the old man claps, slowly, and the steward joins in, and then everybody does.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads s24Done from the Grove and writes no Grove flag. */
export const ATLAS_A06_FLAGS: string[] = [
  'a06-01',
  'a06-02',
  'a06-03',
  'a06-04',
  'a06-05',
  'a06-06',
  'a06-07',
  'a06-08',
  'a06-09',
  'a06-10',
  'a06-11',
  'a06-12',
  'a06-13',
  'a06-14',
  'a06-15',
  'a06-16',
  'a06-done', // A6-16: the whole page; the Great Voyage festival reads it through atlasDone('A6')
  'a06-stone', // taken | left (a06-05-meat): A6-5's complete and A6-16's opening
  'a06-ivory', // told | kept (a06-14-gate): A6-14's complete, both A6-15 scenes, A6-16's last line
];

export const ATLAS_A06_CHECKS: string[] = [
  'carry:a06-paper:house-of-wisdom',
  'sit:a06-bench:gate',
  'visit:a06-mansion:hall',
  'sit:a06-cushion:first',
  'collect:a06-firewood:island',
  'swim:a06-tub:sea',
  'talk:a06-king-isle:court',
  'inspect:a06-bales:mark',
  'talk:a06-captain:proof',
  'explore:a06-island:spring',
  'inspect:a06-dome:shell',
  'climb:a06-roc:foot',
  'explore:a06-valley:floor',
  'wait:a06-eagle:meat',
  'carry:a06-eagle:rim',
  'explore:a06-castle:yard',
  'watch:a06-giant:sneeze',
  'build:a06-raft:shore',
  'climb:a06-tree:night',
  'build:a06-box:planks',
  'watch:a06-ship:rescue',
  'sit:a06-cushion:fourth',
  'explore:a06-cave:draught',
  'walk:a06-tunnel:sea',
  'watch:a06-egg:merchants',
  'swim:a06-wreck:plank',
  'carry:a06-old-man:stream',
  'puzzle:a06-old-man:fig',
  'collect:a06-coconut:palms',
  'explore:a06-coast:wrecks',
  'build:a06-raft:river',
  'explore:a06-river:dark',
  'walk:a06-serendib:fields',
  'talk:a06-king-serendib:court',
  'climb:a06-peak:dawn',
  'visit:a06-palace:court',
  'deliver:a06-letter:serendib',
  'sit:a06-tree:dawn',
  'watch:a06-herd:valley',
  'choose:a06-master:gate',
  'walk:a06-basra:quay',
  'visit:a06-street:porter',
  'talk:a06-porter:story',
  'place:a06-cushion:grove',
  'sit:a06-cushion:tell',
];
