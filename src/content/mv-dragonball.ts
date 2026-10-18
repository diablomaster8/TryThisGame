/**
 * Multiverse campaign, Dragon Ball line: DB1–DB20 (Goku, the original series, not Z).
 *
 * The rift above the waterfall opens on a world of pointed green mountains, capsule
 * houses and martial-arts tournaments. The Keeper and up to two Nubbins go through; each
 * storyline follows its source’s plot beats with the Nubbins as companions. Every line of
 * dialogue is original. Audience 'adult' (the whole campaign is), but the tone here is the
 * original series’ slapstick adventure; Oolong’s wish and Roshi’s leering are kept mild.
 *
 * The Dragon Balls are the line’s thread. Two counters:
 * - `mv-db-radar` (0–5): Bulma’s first hunt, DB1–DB4. Pilaf takes the lot in DB5 and
 *   Oolong spends the wish, so it falls back to 0. This hunt is not one of the two sets.
 * - `mv-db-balls` (0–14): balls the Keeper’s party has gathered toward the line’s two full
 *   sets. Set one runs DB8–DB13 (7 at DB13; its wish brings back Bora). Set two runs
 *   DB19–DB20 (14 at DB20); its wish is saved, unspent, for the 23rd Budokai (E4).
 *   `mv-db-set1` and `mv-db-set2` mark each set; `mv-db-wish: 'ready'` is what E4 reads.
 * Piccolo’s wish (DB16) and Kami’s restoration wish (DB18) use balls gathered by others
 * and never touch `mv-db-balls`. The journal should show the counter as “Dragon Balls
 * gathered: n / 7” for the current set (n mod 7, with 7 shown at DB13 and DB20).
 *
 * Nubbins: they ride Nimbus with Goku from DB4 (the cloud only carries the pure of heart,
 * which every Nubbin is and most Keepers are not), learn a Kamehameha karate move in DB4,
 * and learn to fly Nimbus on their own in DB19.
 *
 * Flags are prefixed `mv-db`. Each storyline sets `mv-db01`…`mv-db20` on completion;
 * `mv-db-complete` marks the whole line and, with it, opens the 23rd Budokai (E4).
 * Chapter numbers are from memory and approximate; check them against the tankōbon.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');

// ---------------------------------------------------------------- speakers
const GOKU: Speaker = { id: 'goku', name: 'Goku', kind: 'other', basedOn: 'Son Goku (Dragon Ball)' };
const BULMA: Speaker = { id: 'bulma', name: 'Bulma', kind: 'other', basedOn: 'Bulma (Dragon Ball)' };
const OOLONG: Speaker = { id: 'oolong', name: 'Oolong', kind: 'other', basedOn: 'Oolong, the shapeshifting pig (Dragon Ball)' };
const ELDER: Speaker = { id: 'aru-elder', name: 'Village Elder', kind: 'other', basedOn: 'The elder of the village Oolong terrorises (Dragon Ball ch. 3–4)' };
const YAMCHA: Speaker = { id: 'yamcha', name: 'Yamcha', kind: 'other', basedOn: 'Yamcha, the desert bandit (Dragon Ball)' };
const PUAR: Speaker = { id: 'puar', name: 'Puar', kind: 'other', basedOn: 'Puar, Yamcha’s shapeshifting cat (Dragon Ball)' };
const ROSHI: Speaker = { id: 'roshi', name: 'Master Roshi', kind: 'other', basedOn: 'Master Roshi, the Turtle Hermit (Dragon Ball)' };
const TURTLE: Speaker = { id: 'turtle', name: 'Turtle', kind: 'other', basedOn: 'Umigame, Roshi’s sea turtle (Dragon Ball)' };
const OXKING: Speaker = { id: 'ox-king', name: 'The Ox-King', kind: 'other', basedOn: 'Gyū-Maō, the Ox-King (Dragon Ball)' };
const CHICHI: Speaker = { id: 'chi-chi', name: 'Chi-Chi', kind: 'other', basedOn: 'Chi-Chi, the Ox-King’s daughter (Dragon Ball)' };
const PILAF: Speaker = { id: 'pilaf', name: 'Emperor Pilaf', kind: 'other', basedOn: 'Emperor Pilaf (Dragon Ball)' };
const MAI: Speaker = { id: 'mai', name: 'Mai', kind: 'other', basedOn: 'Mai, Pilaf’s henchwoman (Dragon Ball)' };
const SHU: Speaker = { id: 'shu', name: 'Shu', kind: 'other', basedOn: 'Shu, Pilaf’s dog-ninja henchman (Dragon Ball)' };
const SHENRON: Speaker = { id: 'shenron', name: 'Shenron', kind: 'other', basedOn: 'Shenron, the Eternal Dragon (Dragon Ball)' };
const KRILLIN: Speaker = { id: 'krillin', name: 'Krillin', kind: 'other', basedOn: 'Krillin (Dragon Ball)' };
const LUNCH: Speaker = { id: 'lunch', name: 'Lunch', kind: 'other', basedOn: 'Lunch (Launch in some English versions), both her sweet and her blonde selves (Dragon Ball)' };
const ANNOUNCER: Speaker = { id: 'announcer', name: 'The Announcer', kind: 'other', basedOn: 'The World Martial Arts Tournament announcer (Dragon Ball)' };
const JACKIE: Speaker = { id: 'jackie-chun', name: 'Jackie Chun', kind: 'other', basedOn: 'Master Roshi in disguise as Jackie Chun (Dragon Ball)' };
const WHITE: Speaker = { id: 'general-white', name: 'General White', kind: 'other', basedOn: 'General White of the Red Ribbon Army (Dragon Ball)' };
const EIGHT: Speaker = { id: 'android-8', name: 'Android 8', kind: 'other', basedOn: 'Android 8, “Eighter” or “Hatchan” (Dragon Ball)' };
const BLUE: Speaker = { id: 'general-blue', name: 'General Blue', kind: 'other', basedOn: 'General Blue of the Red Ribbon Army (Dragon Ball)' };
const ARALE: Speaker = { id: 'arale', name: 'Arale', kind: 'other', basedOn: 'Arale Norimaki of Penguin Village (Dr. Slump, crossing into Dragon Ball)' };
const TAO: Speaker = { id: 'tao', name: 'Mercenary Tao', kind: 'other', basedOn: 'Mercenary Tao (Dragon Ball)' };
const UPA: Speaker = { id: 'upa', name: 'Upa', kind: 'other', basedOn: 'Upa, guardian of Korin Tower’s holy land (Dragon Ball)' };
const BORA: Speaker = { id: 'bora', name: 'Bora', kind: 'other', basedOn: 'Bora, Upa’s father (Dragon Ball)' };
const KORIN: Speaker = { id: 'korin', name: 'Korin', kind: 'other', basedOn: 'Korin, the cat sage of Korin Tower (Dragon Ball)' };
const RED: Speaker = { id: 'commander-red', name: 'Commander Red', kind: 'other', basedOn: 'Commander Red of the Red Ribbon Army (Dragon Ball)' };
const BLACK: Speaker = { id: 'officer-black', name: 'Staff Officer Black', kind: 'other', basedOn: 'Staff Officer Black of the Red Ribbon Army (Dragon Ball)' };
const BABA: Speaker = { id: 'baba', name: 'Fortuneteller Baba', kind: 'other', basedOn: 'Fortuneteller Baba (Dragon Ball)' };
const MASKED: Speaker = { id: 'masked-fighter', name: 'The Masked Fighter', kind: 'other', basedOn: 'Grandpa Gohan, masked, as Baba’s fifth fighter (Dragon Ball)' };
const GOHAN: Speaker = { id: 'grandpa-gohan', name: 'Grandpa Gohan', kind: 'other', basedOn: 'Son Gohan, Goku’s adoptive grandfather (Dragon Ball)' };
const TIEN: Speaker = { id: 'tien', name: 'Tien', kind: 'other', basedOn: 'Tien Shinhan (Dragon Ball)' };
const CHIAOTZU: Speaker = { id: 'chiaotzu', name: 'Chiaotzu', kind: 'other', basedOn: 'Chiaotzu (Dragon Ball)' };
const CRANE: Speaker = { id: 'crane-hermit', name: 'The Crane Hermit', kind: 'other', basedOn: 'Master Shen, the Crane Hermit (Dragon Ball)' };
const TAMBOURINE: Speaker = { id: 'tambourine', name: 'Tambourine', kind: 'other', basedOn: 'Tambourine, King Piccolo’s demon (Dragon Ball)' };
const PICCOLO: Speaker = { id: 'king-piccolo', name: 'King Piccolo', kind: 'other', basedOn: 'King Piccolo (Dragon Ball)' };
const YAJIROBE: Speaker = { id: 'yajirobe', name: 'Yajirobe', kind: 'other', basedOn: 'Yajirobe (Dragon Ball)' };
const KAMI: Speaker = { id: 'kami', name: 'Kami', kind: 'other', basedOn: 'Kami, guardian of the Earth (Dragon Ball)' };
const POPO: Speaker = { id: 'mr-popo', name: 'Mr. Popo', kind: 'other', basedOn: 'Mr. Popo, Kami’s attendant (Dragon Ball)' };
const SHEN: Speaker = { id: 'shen', name: 'Shen', kind: 'other', basedOn: 'Kami fighting in a borrowed body under the name Shen (Dragon Ball ch. 191–194)' };
const MAJR: Speaker = { id: 'ma-junior', name: 'Ma Junior', kind: 'other', basedOn: 'Piccolo Jr., entered under the name Ma Junior (Dragon Ball)' };
const NAM: Speaker = { id: 'nam', name: 'Nam', kind: 'other', basedOn: 'Nam, the fighter from a drought-struck village (Dragon Ball, 21st Tournament)' };
const SUNO: Speaker = { id: 'suno', name: 'Suno', kind: 'other', basedOn: 'Suno, the girl of Jingle Village under Muscle Tower (Dragon Ball)' };

const G = say('goku');
const BU = say('bulma');
const OO = say('oolong');
const EL = say('aru-elder');
const YA = say('yamcha');
const PU = say('puar');
const RO = say('roshi');
const TU = say('turtle');
const OX = say('ox-king');
const CC = say('chi-chi');
const PI = say('pilaf');
const MA = say('mai');
const SH = say('shu');
const SR = say('shenron');
const KR = say('krillin');
const LU = say('lunch');
const AN = say('announcer');
const JC = say('jackie-chun');
const WH = say('general-white');
const E8 = say('android-8');
const BL = say('general-blue');
const AR = say('arale');
const TA = say('tao');
const UP = say('upa');
const BO = say('bora');
const KO = say('korin');
const RD = say('commander-red');
const BK = say('officer-black');
const BA = say('baba');
const MF = say('masked-fighter');
const GH = say('grandpa-gohan');
const TI = say('tien');
const CZ = say('chiaotzu');
const CR = say('crane-hermit');
const TB = say('tambourine');
const KP = say('king-piccolo');
const YJ = say('yajirobe');
const KA = say('kami');
const PO = say('mr-popo');
const SN = say('shen');
const MJ = say('ma-junior');
const NM = say('nam');
const SU = say('suno');

const GATE = 'The rift above the waterfall (Multiverse save slot)';

export const MV_DRAGONBALL: Quest[] = [
  // ------------------------------------------------------------------ DB1
  {
    id: 'mv-db01',
    code: 'DB1',
    title: 'The Boy with a Tail',
    source: 'Dragon Ball, chapter 1 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'Any time once the Multiverse rift is open; first storyline of the Dragon Ball line' },
    speakers: [BULMA, GOKU],
    steps: [
      {
        id: 'mv-db01-s1',
        goal: 'Ride with Bulma up the mountain road towards her radar’s blip.',
        hint: 'A short ride: your Nubbin sits in the bike basket and leans into the bends. Finishing is enough.',
        check: 'race:finish:mv-mountain-road',
        scene: {
          id: 'mv-db01-road',
          lines: [
            N('The rift drops you on a dirt road between tall, pointed green mountains. Somewhere close, an engine is complaining.'),
            N('A motorbike skids to a halt in front of you. The rider has blue hair, a pink dress and a beeping gadget in one fist.'),
            BU('You’re standing in the road. Are you lost? You look lost. Your little friend looks extremely lost.'),
            BU('I’m Bulma. Genius, inventor, sixteen, on summer holiday. Don’t ask what I’m hunting. All right, ask.', 'happy'),
            Y('What are you hunting?'),
            BU('Dragon Balls. Seven orange balls with stars inside. Collect all seven and a dragon comes out and grants a wish.', 'happy'),
            BU('I’ve got two already. My radar says the third is up this road. Hop on the back. Small fry gets the basket.'),
            N('Your Nubbin is already in the basket. It has never ridden anything faster than a falling leaf, and it is thrilled.'),
            BU('Hold on. I drive the way I think: fast and brilliantly.'),
          ],
        },
        done: {
          id: 'mv-db01-road-done',
          lines: [
            N('Round a bend, a small boy steps into the road. Bulma brakes much too late.'),
            N('The boy stops the front wheel with one hand and flips the whole bike into a ditch: Bulma, you, and the basket.'),
          ],
        },
      },
      {
        id: 'mv-db01-s2',
        goal: 'Talk to Goku at his grandfather’s hut.',
        hint: 'Be honest with him. He can tell when people aren’t, he just doesn’t mind much.',
        check: 'talk:goku',
        scene: {
          id: 'mv-db01-hut',
          lines: [
            G('Got you, monster! You’re not eating me today. Grandpa said monsters always try.', 'angry'),
            BU('It is not a monster, it is a motorbike! Ow. My elbow. My hair.', 'angry'),
            N('He has spiky black hair, a red staff on his back, and a monkey’s tail. Your Nubbin spots the tail and is instantly in love.'),
            G('You’ve got a tail too! A little round one. I’m Goku. I live here. Well, up there.', 'happy'),
            G('And you’re… What are you? You haven’t got a tail. Grandpa said girls were a whole different thing.', 'think'),
            BU('Your grandpa was right about something. Listen, do you have an orange ball? About this big, with stars inside?'),
            N('Goku’s face goes still. He leads you to a hut where a small orange ball sits on a cushion beside an old man’s photo.'),
            G('That’s Grandpa Gohan’s ball. Four stars. When I talk to it, it’s like he’s still about.', 'sad'),
            BU('Oh. Right. That’s… actually sweet. I hate it.'),
          ],
          choices: [
            {
              id: 'truth',
              label: 'Tell him straight: Bulma wants it for a wish.',
              set: { 'mv-db-goku-deal': 'deal-truth' },
              then: [
                G('A wish? What would I even wish for? I’ve already got a stick.', 'think'),
                BU('Fine. You keep it. You just come along and carry it, and when all seven are together I borrow it. Once.'),
              ],
            },
            {
              id: 'pitch',
              label: 'Let Bulma make her sales pitch.',
              set: { 'mv-db-goku-deal': 'deal-pitch' },
              then: [
                BU('Come with me and see the world! Big cities! Restaurants that serve more than one fish!', 'happy'),
                G('More than one fish?', 'shock'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask Goku what he wants, before anyone sells him anything.',
              set: { 'mv-db-goku-deal': 'deal-asked' },
              then: [
                G('Me? Grandpa said there are people out there stronger than me. I want to find them and fight them. Nicely.', 'think'),
                BU('…That is the strangest life plan I’ve ever heard, and it fits my route perfectly.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db01-hut-done',
          lines: [
            N('Goku agrees on one condition: the four-star ball is never given away. Only borrowed.'),
            N('Bulma agrees, fingers crossed behind her back. Your Nubbin sees, and decides to keep an eye on her.'),
          ],
        },
      },
      {
        id: 'mv-db01-s3',
        goal: 'Get Bulma back from the pterodactyl.',
        hint: 'A short karate bout. Your Nubbin rides the end of Goku’s staff, so aim high.',
        check: 'karate:win:mv-pterodactyl',
        scene: {
          id: 'mv-db01-supper',
          lines: [
            N('Goku goes fishing by jumping into the river and punching it. A fish the size of a bathtub floats up, stunned.'),
            BU('You are going to eat all of that. By yourself.', 'shock'),
            G('Course not. Your little one can have the tail end.', 'happy'),
            N('A shadow crosses the fire. Something with leather wings and a long beak scoops Bulma up by the back of her dress.'),
            BU('Goku! It’s got me! Do something heroic, and do it now!', 'shock'),
            G('Staff! Get long!'),
            N('The red staff shoots up like a fishing line cast at the moon. Your Nubbin is clinging to the tip of it.'),
            G('Hang on, little one. When I say go, bite its toe.', 'happy'),
          ],
        },
        done: {
          id: 'mv-db01-supper-done',
          lines: [
            N('One bite, one whack, and the pterodactyl decides it wasn’t hungry. Bulma drops into the river, the softer option.'),
            BU('My dress. My hair. Thank you, obviously. But my dress.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db01-complete',
      lines: [
        N('By firelight, Bulma sets three Dragon Balls on a flat rock: her two, and Goku’s four-star.'),
        BU('Three down, four to go. At this rate I’ll have my wish by the end of the holidays.', 'happy'),
        G('What are you wishing for?'),
        BU('The perfect boyfriend. Tall, handsome, devoted. Don’t laugh.'),
        G('What’s a boyfriend? Is it like a fish?', 'think'),
        N('Goku falls asleep using your Nubbin as a pillow. Your Nubbin allows it, which it has never allowed anyone.'),
        N('Bulma clips a tiny beeping charm to its collar: a spare from her radar, she says, because geniuses always have spares.'),
      ],
    },
    rewards: [
      { id: 'mv-db01-charm', kind: 'item', label: 'Radar Charm', description: 'A beeping keychain from Bulma. Shows the Dragon Ball count for the line in the Multiverse journal.' },
      { id: 'mv-db01-goggles', kind: 'cosmetic', label: 'Riding Goggles', description: 'Bulma’s spare riding goggles, sized for a Nubbin. Wearable by any Nubbin.' },
    ],
    sets: { 'mv-db01': true, 'mv-db-radar': 3 },
    notes:
      'Opens the Dragon Ball line; no prerequisite beyond the rift. Staging: Mount Paozu, dirt road, Goku’s round hut with Gohan’s photo and the four-star ball on a cushion. The brief puts the Nubbin on Bulma’s bike; in chapter 1 she drives a car, so the bike is our change (a capsule motorbike suits her). The bike basket ride is a race-course reskin with no rivals. Pterodactyl bout: the Nubbin rides the staff tip, so the opponent hovers; one-round bout. Goku’s staff (Nyoibō) grows on a spoken order; keep his order original (“Staff! Get long!”), never the anime’s call. `mv-db-radar` is Bulma’s first hunt counter, separate from `mv-db-balls` (see file header). Chapter checked from memory: Dragon Ball ch. 1, “Bulma and Son Goku” (1984). `mv-db-goku-deal` gains `asked` (added in review): Goku names his own reason to travel, to find people stronger than him, which the tournaments pay off. ' +
      'SIGNATURE CHOICE: mv-db-goku-deal (deal-truth | deal-pitch | deal-asked: how Bulma got Goku to come) pays off through MV_DRAGONBALL_VARIANTS at mv-db07-complete (how she hands over the radar and the four-star), mv-db13-complete (what Goku says to his grandfather’s ball before the wish) and mv-db19-road (what Bulma brings with the second radar). The values carry a deal- prefix because the runner matches variants by value and mv-db-korin also uses asked.',
  },

  // ------------------------------------------------------------------ DB2
  {
    id: 'mv-db02',
    code: 'DB2',
    title: 'Oolong',
    source: 'Dragon Ball, chapters 3–4 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB1, The Boy with a Tail' },
    requires: ['DB1'],
    speakers: [GOKU, BULMA, OOLONG, ELDER],
    steps: [
      {
        id: 'mv-db02-s1',
        goal: 'Find out why the village has locked its doors.',
        hint: 'Talk to the elder. Knock politely; everyone here is very frightened of knocking.',
        check: 'talk:mv-aru-elder',
        scene: {
          id: 'mv-db02-village',
          lines: [
            N('The radar leads to a village of round houses. Every door is shut, every shutter barred, and the street is empty.'),
            BU('Charming. Nothing says welcome like the sound of fifty people holding their breath.'),
            N('Goku knocks, and somebody inside screams. He knocks again, more politely, and the screaming gets politer too.'),
            EL('Go away! Or, if you are the monster, please take the cabbages. They are very good cabbages.', 'shock'),
            EL('…You’re not the monster. You’re a girl, a monkey boy, a stranger and a small round thing. Come in, quickly.'),
            EL('A monster has been stealing our daughters. One by one. It comes as a bull, or a giant, or a demon. Tomorrow it wants Pochawompa.', 'sad'),
            BU('So you just hand them over?'),
            EL('What else can we do? It is very large. Sometimes.'),
            G('I’ll fight it. Does it taste like a bull too? Never mind. I’ll fight it.', 'happy'),
          ],
          choices: [
            {
              id: 'decoy',
              label: 'Suggest a decoy bride. Goku in a dress.',
              set: { 'mv-db-oolong-plan': 'decoy' },
              then: [
                G('What’s a dress? Oh. Oh, it’s a sack with holes. That’s fine.', 'think'),
                BU('Hold still. And tuck the tail in. Monsters probably notice tails.'),
              ],
            },
            {
              id: 'wait',
              label: 'Sit up with the villagers and wait for it.',
              set: { 'mv-db-oolong-plan': 'wait' },
              then: [
                N('Your Nubbin takes first watch at the window. It is asleep in four minutes and denies it afterwards.'),
                BU('We are getting a dress on Goku anyway. Monsters like brides. It’s a whole thing.'),
              ],
            },
            {
              id: 'nubbin-bride',
              label: 'Volunteer your Nubbin as the bride.',
              set: { 'mv-db-oolong-plan': 'nubbin' },
              then: [
                N('In a doily veil, your Nubbin looks like a very small, very determined wedding cake.'),
                BU('Adorable. Also useless. Monsters want a bride they can find without bending down. Goku, arms up.'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-db02-s2',
        goal: 'Fight the shapeshifting monster until his five minutes run out.',
        hint: 'He changes shape every round but can only hold a shape for five minutes. Survive the clock and he pops back to himself.',
        check: 'karate:win:mv-oolong-shapes',
        scene: {
          id: 'mv-db02-monster',
          lines: [
            N('At dusk, a hulking horned shape stamps into the square. It is very large, just as advertised.'),
            OO('I have come for my bride! Hand her over, or I’ll… stamp about some more! Loudly!', 'angry'),
            N('The bride steps forward in a lopsided veil. Under the dress there is a definite tail.'),
            G('Hi! I’m the bride. Want to fight?', 'happy'),
            N('Goku’s first punch lands, and the monster yelps in a voice much too high for its horns.'),
            N('In a puff of smoke it becomes a bat, then a rocket, then a very angry bull. Each shape lasts a little less long.'),
            BU('He can’t hold it! Five minutes, I bet you anything. Keep him busy!'),
            N('Your Nubbin keeps him busy by sitting on his tail, whichever tail he currently has.'),
          ],
        },
        done: {
          id: 'mv-db02-monster-done',
          lines: [
            N('With a pop, the giant is gone. In the dust sits a small pig in a little military jacket, looking deeply betrayed.'),
            OO('All right! All right. I’m Oolong. I’m not a monster. I only went to shapeshifting school. For a bit. I was asked to leave.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-db02-s3',
        goal: 'Fetch the stolen girls from Oolong’s mansion.',
        hint: 'A short expedition. The girls are not in a dungeon. You will see.',
        check: 'expedition:complete:mv-oolong-mansion',
        scene: {
          id: 'mv-db02-mansion',
          lines: [
            N('Oolong’s mansion is up the hill. You expect chains and a cellar, and find a lounge, three sofas and a cake trolley.'),
            N('The stolen girls are lying about in silk dressing gowns, eating chocolates and ordering Oolong to fetch more.'),
            OO('I wanted a wife. I got three bosses. They never cook. They never leave. Please take them home. I’m begging.', 'sad'),
            BU('You poor thing. No, wait. You kidnapped them. You are not the poor thing here.'),
            N('Bulma rummages in her capsule case and comes up with a little sweet wrapped in paper.'),
            BU('Eat this, Oolong. It’s a nice sweet. Very nice. Trust me.'),
            OO('Why are you smiling like that?', 'shock'),
            BU('From now on, whenever I say a certain word, you’ll need the loo. Immediately. Wherever you are. So, which word?', 'happy'),
          ],
          choices: [
            {
              id: 'piggy',
              label: '“Piggy.” Short and to the point.',
              set: { 'mv-db-oolong-word': 'piggy' },
              then: [
                BU('Piggy.'),
                N('Oolong leaves the room at a speed nobody would expect from his legs.'),
              ],
            },
            {
              id: 'oink',
              label: '“Oink.” Undignified, which is the idea.',
              set: { 'mv-db-oolong-word': 'oink' },
              then: [
                BU('Oink. Oink oink.'),
                OO('STOP SAYING IT TWICE!', 'angry'),
              ],
            },
            {
              id: 'bath',
              label: '“Bathtime.” He’ll never hear it coming.',
              set: { 'mv-db-oolong-word': 'bathtime' },
              then: [
                BU('Bathtime!'),
                N('Oolong vanishes. Your Nubbin, who loves baths, looks around hopefully for a bath.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db02-complete',
      lines: [
        N('The girls go home, a little sorry to leave the cake trolley. The village cheers, and the elder gives you the cabbages anyway.'),
        EL('One thing. Before he rides off as anybody’s car, the pig knocks on every door he frightened, and says sorry.', 'angry'),
        N('Oolong does. Most doors stay shut. One opens a crack and hands him a cabbage, which very nearly finishes him off.'),
        BU('And you, mister, are coming with us. You can turn into a car. We need a car.'),
        OO('That’s slavery! That’s… actually, do you have snacks? No? Then it’s definitely slavery.', 'angry'),
        G('He’s nice. He smells like a pig.', 'happy'),
        OO('I AM a pig!'),
        N('Oolong sulks all the way back to the bike. Your Nubbin walks beside him, which he pretends not to like.'),
      ],
    },
    rewards: [
      { id: 'mv-db02-cabbage', kind: 'item', label: 'Very Good Cabbage', description: 'A gift from a grateful village. Feeds a Nubbin like three fruits and makes it slightly smug.' },
      { id: 'mv-db02-title', kind: 'title', label: 'Monster Sitter', description: 'For the Nubbin that sat on Oolong’s tail through five minutes of shapes.' },
    ],
    sets: { 'mv-db02': true },
    notes:
      'Oolong joins the party until DB5. The trigger word is the player’s choice (`mv-db-oolong-word`), and Bulma uses that word in DB3–DB5 whenever the script says “the word”; implementer swaps it in (piggy / oink / bathtime). The source’s pill gag is kept off-screen: Oolong runs out of frame, a door slams, done. No toilet visuals. Shapeshift bout: three rounds, each a different Oolong form (bull-demon, bat, rocket), each shorter; the round timer is the five-minute limit compressed. The village girl’s name Pochawompa is from the source. `mv-db-oolong-plan` gains `nubbin` (added in review); Goku still wears the dress. Chapters checked from memory: ch. 3–4 (1984).',
  },

  // ------------------------------------------------------------------ DB3
  {
    id: 'mv-db03',
    code: 'DB3',
    title: 'Yamcha and Puar',
    source: 'Dragon Ball, chapters 5–7 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB2, Oolong' },
    requires: ['DB2'],
    speakers: [GOKU, BULMA, OOLONG, YAMCHA, PUAR],
    steps: [
      {
        id: 'mv-db03-s1',
        goal: 'Cross the Diablo Desert with Bulma’s party.',
        hint: 'An expedition. Water matters more than speed. Oolong will complain whatever you pick.',
        check: 'expedition:complete:mv-diablo-desert',
        scene: {
          id: 'mv-db03-desert',
          lines: [
            N('The radar points straight across a desert. Oolong turns into a car to carry everyone: a very small car.'),
            OO('Nobody said anything about deserts. My bumper’s melting.', 'sad'),
            BU('You could turn into a bigger car.'),
            OO('I could turn into a lot of things. I choose to suffer.'),
            N('Far off, on a rock, someone is watching through a spyglass. Beside him floats a small blue cat with a curly tail.'),
            PU('Lord Yamcha, they’ve got capsules. A capsule case and a radar thing. That’s a rich girl, that is.'),
            YA('Then tonight we eat well, Puar. Desert bandit rule one: never rob anybody who looks poor.', 'happy'),
            N('Oolong hears the cat’s voice on the wind and goes white under his paint.'),
            OO('I know that voice. Shapeshifting school. That’s Puar. Where Puar is, there’s a bandit.', 'shock'),
          ],
          choices: [
            {
              id: 'ration',
              label: 'Ration the water. Small sips, everybody, the car included.',
              set: { 'mv-db-desert': 'ration' },
              then: [
                OO('Small sips! For the car! I have a radiator now, you know. It is very thirsty and very hot.', 'angry'),
                N('Your Nubbins pour their own sip over the bonnet. The bonnet goes quiet, and pretends it wasn’t touched.'),
              ],
            },
            {
              id: 'floor-it',
              label: 'Floor it. Get out of the sun faster.',
              set: { 'mv-db-desert': 'floor-it' },
              then: [
                N('Bulma floors it. You cover a mile in four minutes and fifty-nine seconds, and then there is a pop.'),
                OO('FIVE MINUTES! I TOLD you about the five minutes!', 'angry'),
                N('Everyone is sitting on a pig in the middle of a dune. Bulma gets out a capsule car of her own, sighing.'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-db03-s2',
        goal: 'Hold off Yamcha in the desert duel.',
        hint: 'A karate bout you can’t lose outright: stay standing for three rounds. Something will stop him.',
        check: 'karate:finish:mv-yamcha-duel',
        scene: {
          id: 'mv-db03-duel',
          lines: [
            N('At sunset a man in a green sash steps out of the rocks, a curved sword on his shoulder.'),
            YA('Evening. I’m Yamcha, terror of the desert. Leave the capsules, the food and the car. The pig can keep his dignity.'),
            OO('I’m the car!', 'angry'),
            G('You want a fight? I like fights.', 'happy'),
            N('They go at it, Yamcha fast and good, Goku faster and stranger. Neither lands a clean blow.'),
            YA('Huh. You’re a kid. Kids aren’t supposed to do that.', 'think'),
            N('Bulma climbs out of the car to shout at both of them. Yamcha turns, sees her, and goes as red as a pepper.'),
            YA('A… a g-girl. There’s a girl. Puar, there’s a girl right there.', 'shock'),
            PU('He can’t talk to girls. It’s a whole thing. Please don’t tell anybody.'),
          ],
          choices: [
            {
              id: 'kind',
              label: 'Tell Yamcha it’s all right. She doesn’t bite.',
              set: { 'mv-db-yamcha': 'kind' },
              then: [
                BU('I absolutely do bite.'),
                N('Yamcha makes a noise like a kettle and retreats into the rocks backwards, still facing her, still crimson.'),
              ],
            },
            {
              id: 'press',
              label: 'Tell Goku to press the advantage.',
              set: { 'mv-db-yamcha': 'pressed' },
              then: [
                G('Nah. He’s gone all wobbly. That’s not a real fight.', 'think'),
                N('Yamcha seizes the gift and flees, with Puar flapping after him.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db03-duel-done',
          lines: [
            YA('This isn’t over! I’ll be back! Once I’ve had a lie down!'),
            G('He was good. I hope he comes back.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-db03-s3',
        goal: 'Catch Puar sneaking around your camp.',
        hint: 'Leave your Nubbin on watch. Puar can turn into anything, but Puar is still a cat, and cats come for fish.',
        check: 'talk:puar',
        scene: {
          id: 'mv-db03-camp',
          lines: [
            N('Bulma pops a capsule house open for the night. In the dark, something small and blue moves among the rocks.'),
            N('Your Nubbin leaves the last of Goku’s fish on the doorstep. Within a minute a cat is eating it.'),
            PU('…Oh. Hello. I’m not here. I’m a rock. Grr. Rock noises.'),
            PU('Lord Yamcha wants those balls. He’s going to wish he could talk to girls. Then he can get married and settle down.'),
            Y('He could just practise talking to girls.'),
            PU('He tried. He practised on a cactus. It went badly.', 'sad'),
            PU('So we’re going to follow you, and when you’ve got all seven, we’ll take them. Sorry. Nothing personal. Lovely fish.'),
            N('Puar pats your Nubbin on the head, turns into a bat, and flaps off into the night.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db03-complete',
      lines: [
        N('In the morning, a cloud of dust follows the car at a careful distance. It stops when you stop and starts when you start.'),
        BU('We’re being tailed by a bandit who faints when I look at him. I’ve had worse admirers.', 'happy'),
        OO('He’s going to rob us. Is no one else bothered he’s going to rob us?'),
        G('I want a rematch. I’ll leave Bulma behind so he doesn’t go wobbly.', 'happy'),
        BU('You will do no such thing. Leave me behind. Honestly.'),
        N('Your Nubbin waves at the dust cloud. After a long pause, a small blue paw waves back.'),
      ],
    },
    rewards: [
      { id: 'mv-db03-sash', kind: 'cosmetic', label: 'Bandit Sash', description: 'A green desert sash like Yamcha’s. Wearable by any Nubbin; makes it look much tougher than it is.' },
      { id: 'mv-db03-fish', kind: 'decor', label: 'Fish on a Doorstep', description: 'A small plate with one fish on it, for the Grove. Visiting cats sometimes appear beside it.' },
    ],
    sets: { 'mv-db03': true },
    notes:
      'Yamcha and Puar tail the party through DB4 and join openly in DB5. The duel is a three-round survival bout: the karate result screen should read “Interrupted (girl)” rather than win or loss. Yamcha’s shyness is played for comedy only; he is never mean to Bulma. Puar went to the same shapeshifting school as Oolong; Oolong is terrified of her. Desert: Diablo Desert, rock spires, capsule house at night. `mv-db-desert` (ration/floor-it, added in review) is cosmetic; floor-it pays off Oolong’s five-minute limit from DB2. Chapters checked from memory: ch. 5–7 (1985).',
  },

  // ------------------------------------------------------------------ DB4
  {
    id: 'mv-db04',
    code: 'DB4',
    title: 'Fire Mountain',
    source: 'Dragon Ball, chapters 8–11 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB3, Yamcha and Puar' },
    requires: ['DB3'],
    speakers: [GOKU, BULMA, OOLONG, TURTLE, ROSHI, CHICHI, OXKING],
    steps: [
      {
        id: 'mv-db04-s1',
        goal: 'Carry the lost turtle back to the sea.',
        hint: 'An expedition with a heavy, slow passenger. A Power Nubbin helps; a patient one helps more.',
        check: 'expedition:complete:mv-turtle-to-sea',
        scene: {
          id: 'mv-db04-turtle',
          lines: [
            N('In a forest a long way from any coast, a sea turtle sits in the road looking extremely out of place.'),
            TU('Excuse me. I went looking for mushrooms and lost the sea. Have you seen it? It’s large and wet.', 'sad'),
            G('We’ll take you! Is it far? It doesn’t matter. I’m strong.', 'happy'),
            BU('We are on a schedule, Goku. A Dragon Ball schedule.'),
            G('He’s lost, though.'),
            N('Goku hoists the turtle onto his back. Your Nubbin rides on the turtle’s shell, steering by its ears.'),
            TU('You are a kind boy. My master will want to thank you. He is old, and wise, and mostly very strange.'),
            OO('Strange how? Rich strange? I can work with rich strange.'),
          ],
        },
        done: {
          id: 'mv-db04-turtle-done',
          lines: [
            N('At the shore the turtle swims out, and comes back with a tiny old man on its shell. He has a beard, sunglasses and a stick.'),
            RO('I am the Turtle Hermit. People call me Master Roshi. Thank you for my turtle. I am fond of him. He makes the tea.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-db04-s2',
        goal: 'Try to ride the Flying Nimbus.',
        hint: 'Only the pure of heart can sit on the cloud. Your Nubbins can. You might not. Try anyway.',
        check: 'ride:mv-flying-nimbus',
        scene: {
          id: 'mv-db04-nimbus',
          lines: [
            RO('A gift for the boy. Nimbus! Come here!'),
            N('A small yellow cloud swoops down out of a clear sky and stops at knee height, bobbing, like a dog waiting for a walk.'),
            RO('The Flying Nimbus. It carries only those with a pure heart. Watch. I shall demonstrate.', 'happy'),
            N('Roshi hops on. He drops straight through it and lands on his bottom in the sand.'),
            RO('As I suspected. A demonstration of what not to be.'),
            N('Goku sits on it and it zips him round the beach, your Nubbins clinging on behind. The cloud doesn’t even dip.'),
            BU('Oh, I want a go. And while you’re handing out presents, old man, I hear you have a Dragon Ball.'),
            RO('I do. I might part with it. For a little peek at a pair of pretty knickers.', 'happy'),
            N('Bulma considers this for about half a second, turns her back to everyone else, and lifts her hem for him. Roshi’s nose bleeds.'),
            BU('Ball. Now. And none of you saw anything.', 'angry'),
          ],
          choices: [
            {
              id: 'try',
              label: 'Climb onto Nimbus yourself.',
              set: { 'mv-db-nimbus-keeper': 'fell' },
              then: [
                N('You sit, and for one hopeful moment you hover. Then you drop through and land beside Roshi.'),
                RO('Welcome. It’s nice down here. Very honest.', 'happy'),
              ],
            },
            {
              id: 'nubbins',
              label: 'Leave the cloud to the Nubbins. You know your own heart.',
              set: { 'mv-db-nimbus-keeper': 'declined' },
              then: [
                N('Your Nubbins look at you, then at the cloud, then back. One of them pats the empty space beside it.'),
                G('It’d let you, maybe. Probably not. Maybe!', 'happy'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-db04-s3',
        goal: 'Put out the fire on Fire Mountain and learn the Kamehameha.',
        hint: 'A karate lesson: copy Roshi’s stance three times. On the third, your Nubbins unleash the move for real.',
        check: 'karate:learn:kamehameha',
        scene: {
          id: 'mv-db04-fire',
          lines: [
            N('The radar points into a mountain wrapped in flame. Through the smoke comes a girl in armour with a bladed helmet.'),
            CC('Who are you? Are you bandits? I’m Chi-Chi, and I’ve beaten up eleven bandits this month.', 'angry'),
            G('I’m Goku. Are you a girl? You look like Bulma, but pointier.'),
            CC('…You’re nice. Nobody’s nice. Will you marry me? Papa says I have to marry someone strong.', 'soft'),
            G('Sure! Is marry a kind of food?', 'happy'),
            N('Her father, the Ox-King, is a giant with an axe sitting outside his burning castle, weeping into a bucket.'),
            OX('My castle, my treasure, my Dragon Ball, all in that fire. Only Master Roshi’s fan could put it out.', 'sad'),
            N('Roshi arrives on his turtle. The fan, it turns out, was used as a tray and thrown away years ago.'),
            RO('Ah. Then I’ll have to do it the loud way. Stand back. Further. Further than that.'),
            N('He crouches, cups his hands at his hip, and gathers something blue and bright between his palms.'),
            RO('Ka… me… ha… me… HA!', 'angry'),
            N('The beam puts out the fire, and also the castle and most of the mountain. Roshi coughs politely.'),
          ],
        },
        done: {
          id: 'mv-db04-fire-done',
          lines: [
            N('Goku copies it on his very first try and blows up Bulma’s car. Your Nubbins copy it on their third and blow up a bush.'),
            RO('Fifty years it took me. Fifty years. And a monkey boy and two dumplings do it before lunch.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db04-complete',
      lines: [
        N('In the ashes of the castle, a Dragon Ball glows. The Ox-King hands it over with tears in his beard.'),
        OX('Take it. You put out my fire. Well, Roshi did. With my castle. But you were here, and that counts.'),
        BU('Five! Five Dragon Balls. Pilaf, whoever you are, eat your heart out.', 'happy'),
        CC('Goku. You promised. When you’re grown, you’ll come back and marry me.', 'soft'),
        G('Yep! Bye, Chi-Chi!', 'happy'),
        N('He waves from Nimbus with no idea what he just said. Chi-Chi knows, and will remember.'),
        N('Your Nubbins land beside you, still crackling faintly blue at the paws.'),
      ],
    },
    rewards: [
      { id: 'mv-db04-kamehameha', kind: 'feature', label: 'Kamehameha', description: 'A new karate move for Nubbins: a charged two-paw beam. Long wind-up, huge push. Learned from Master Roshi and Goku.' },
      { id: 'mv-db04-nimbus', kind: 'feature', label: 'Nimbus Passenger', description: 'In the Dragon Ball line, your Nubbins can ride Nimbus with Goku. Flying it alone comes later.' },
      { id: 'mv-db04-shell', kind: 'decor', label: 'Turtle’s Mushroom Basket', description: 'A thank-you from Roshi’s turtle. Grows a mushroom in the Grove every few days.' },
    ],
    sets: { 'mv-db04': true, 'mv-db-radar': 5, 'mv-db-chichi-promise': true },
    notes:
      'Teaches the Kamehameha karate move (brief requirement). Karate lesson check `karate:learn:kamehameha`: three stance-copy prompts; on the third, the move fires for real and is added to the Nubbin’s move list. Use the move name, but the chant on screen is Roshi’s only, once, broken into syllables. Roshi’s peek gag is kept mild and off-camera: Bulma has her back to the camera, cut to Roshi’s nosebleed, nothing shown. Nimbus: Nubbins ride; the Keeper falls through if they try (`mv-db-nimbus-keeper`). Goku’s marriage promise (`mv-db-chichi-promise`) pays off in DB20. In the source the Ox-King’s treasure and a Dragon Ball are in the burning castle; Bulma ends with five, Pilaf’s gang holds the rest. Chapters checked from memory: ch. 8–11 (1985).',
  },

  // ------------------------------------------------------------------ DB5
  {
    id: 'mv-db05',
    code: 'DB5',
    title: 'Pilaf’s Wish',
    source: 'Dragon Ball, chapters 12–23 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB4, Fire Mountain' },
    requires: ['DB4'],
    speakers: [GOKU, BULMA, OOLONG, YAMCHA, PUAR, PILAF, MAI, SHU, SHENRON],
    steps: [
      {
        id: 'mv-db05-s1',
        goal: 'Follow Pilaf’s gang back to his castle.',
        hint: 'An expedition by night. Puar can turn into a bat to scout; let her.',
        check: 'expedition:complete:mv-pilaf-castle',
        scene: {
          id: 'mv-db05-ambush',
          lines: [
            N('A tank rolls up to your camp at midnight. On top stand a woman with a pistol and a short dog in a ninja suit.'),
            MA('Good evening. We represent Emperor Pilaf. He’d like your Dragon Balls. All of them. Thank you so much.'),
            SH('And if you say no, we say please again, but louder.'),
            N('They grab the bag in the confusion and drive off. Bulma counts what’s left, and there is nothing left.'),
            BU('My balls! My five beautiful balls!', 'angry'),
            N('From the rocks, Yamcha and Puar step out. Yamcha keeps his eyes firmly on Goku’s ear.'),
            YA('We know where they’re going. Pilaf’s castle. We’ve been following you. And them. We’re very thorough.'),
            PU('We’ll help you get them back. Then we’ll fight you for them. Fairly. Probably.'),
            G('Yay! A team!', 'happy'),
          ],
        },
      },
      {
        id: 'mv-db05-s2',
        goal: 'Stop Emperor Pilaf from making his wish.',
        hint: 'A race against the summoning: get Oolong out of the cell before Pilaf finishes speaking. Your Nubbin can fit through the grate.',
        check: 'race:finish:mv-pilaf-summoning',
        scene: {
          id: 'mv-db05-summoning',
          lines: [
            N('Pilaf’s castle is all traps, and you fall through three of them. The third drops everyone into a cell with one barred window.'),
            PI('Ha! Ha! Behold, you peasants! All seven balls are mine! I am about to become ruler of the world!', 'happy'),
            N('He is very small and very blue, and his cape is too long. Mai holds the end of it so he won’t trip.'),
            PI('Eternal Dragon, I summon you! Rise! Rise now! Please rise.'),
            N('The sky goes black. Out of the seven balls pours an enormous green dragon, coiled up into the clouds.'),
            SR('You have gathered the seven. Speak your wish, and speak it soon. I am not a patient dragon.'),
            PI('I wish… ahem. Mai, the speech. Where is my speech?'),
            N('Oolong squeezes through the bars as a bat, your Nubbin shoving from behind. He pops out and flaps for the window.'),
            OO('What do I wish for? What do I say? Somebody tell me what to say!', 'shock'),
          ],
          choices: [
            {
              id: 'anything',
              label: 'Shout: “Anything! Just wish something stupid!”',
              set: { 'mv-db-pilaf-wish': 'anything' },
              then: [
                OO('Something stupid! Right! Dragon! Give me the finest pair of ladies’ knickers in the world!', 'shock'),
                SR('Granted. That was easy.'),
              ],
            },
            {
              id: 'heart',
              label: 'Shout: “Wish for what you really want!”',
              set: { 'mv-db-pilaf-wish': 'heart' },
              then: [
                OO('What I really want… Dragon! Give me the finest pair of ladies’ knickers in the world!', 'shock'),
                N('Everybody turns to look at you. You did tell him to be honest.'),
              ],
            },
            {
              id: 'snacks',
              label: 'Shout: “Snacks! Wish for snacks! You love snacks!”',
              set: { 'mv-db-pilaf-wish': 'snacks' },
              then: [
                OO('Snacks! Yes! Dragon, give me a lifetime of… the finest… ladies’ knickers? Why did I say that?', 'shock'),
                SR('Granted. No refunds.'),
                N('His mouth and his brain have clearly never been introduced.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db05-summoning-done',
          lines: [
            N('A pair of frilly knickers floats down from the sky into Pilaf’s outstretched hands. The dragon is gone.'),
            N('The seven balls rise into the air, turn to grey stone, and shoot off to the far corners of the world.'),
            PI('My… world… domination…', 'sad'),
            YA('My wish… my wish was to talk to girls.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-db05-s3',
        goal: 'Survive the full moon.',
        hint: 'A survival bout against a giant ape. You can’t win it. Dodge until someone cuts his tail.',
        check: 'karate:survive:mv-great-ape',
        scene: {
          id: 'mv-db05-moon',
          lines: [
            PI('Very well. You will all dry out in the sun tomorrow. Mai, open the roof. Let the sun in. In the morning.', 'angry'),
            N('Mai opens the roof now, by mistake. The full moon looks down into the cell.'),
            N('Goku looks up at it and stops talking. His eyes turn red, and he starts to grow.'),
            BU('Goku? Goku. This is not a good time to have a growth spurt.', 'shock'),
            N('He becomes a giant ape. The cell bursts, then the wall, then most of the castle.'),
            PU('His tail! It’s the moon and the tail! Cut the tail and he’ll stop!'),
            YA('With what? I lost my sword in a trap!'),
            PU('With me, Lord Yamcha!'),
            N('Puar turns into a giant pair of scissors. Your Nubbins dart between the ape’s feet to keep his eyes off Yamcha.'),
          ],
        },
        done: {
          id: 'mv-db05-moon-done',
          lines: [
            N('Snip. The ape shrinks, and shrinks, and there is Goku, asleep in the rubble, tail-less and wearing nothing at all.'),
            BU('Somebody find that boy some trousers.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db05-complete',
      lines: [
        G('Where’s my tail? Where’s the castle? Why’s it so draughty?', 'shock'),
        BU('Long story. The short version is, you ate a castle and the pig wished for knickers.'),
        OO('I panicked! Under pressure, a man reaches for what he knows!', 'angry'),
        N('The balls will be stone for a year. Bulma shrugs, then goes pink when Yamcha manages a whole sentence to her.'),
        YA('Bulma. Would you… would you like to come to West City? With me? I can probably keep talking. Probably.', 'soft'),
        BU('Took you long enough, terror of the desert.', 'happy'),
        G('I’m going to find that old turtle man. I want to learn to fight like him.', 'happy'),
        N('Goku flies off on Nimbus. Your Nubbins ride on his back, waving at a bandit who is finally, terribly, in love.'),
      ],
    },
    rewards: [
      { id: 'mv-db05-scissors', kind: 'decor', label: 'Puar-Shaped Scissors', description: 'A giant pair of decorative scissors with a curly tail. Leans on a Grove wall. Nubbins keep well away from it.' },
      { id: 'mv-db05-title', kind: 'title', label: 'Moon Dodger', description: 'For the Nubbins that ran between a giant ape’s feet and lived.' },
    ],
    sets: { 'mv-db05': true, 'mv-db-radar': 0, 'mv-db-tail': 'cut' },
    notes:
      'The first wish of the series is spent by Oolong here; the radar counter `mv-db-radar` drops to 0. This hunt is not one of the line’s two sets. Oolong’s wish is mild and comic: a single pair of frilly knickers floating down, no one wearing anything. Goku waking without clothes after the ape transformation: back view only, cut to Bulma throwing a towel. Great Ape survival bout: three rounds, the ape cannot be damaged; it ends when Puar (as scissors) cuts the tail. `mv-db-pilaf-wish` gains `snacks` (added in review): whatever the Keeper shouts, Oolong wishes for the knickers. Shenron here is the dragon’s first appearance; he is gruff, short and in a hurry, never the source’s lines. Yamcha and Bulma become a couple; Oolong goes with them; Goku goes to Roshi. Chapters checked from memory: ch. 12–23 (1985).',
  },

  // ------------------------------------------------------------------ DB6
  {
    id: 'mv-db06',
    code: 'DB6',
    title: 'Turtle School',
    source: 'Dragon Ball, chapters 24–27 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB5, Pilaf’s Wish' },
    requires: ['DB5'],
    speakers: [GOKU, ROSHI, KRILLIN, LUNCH, TURTLE],
    steps: [
      {
        id: 'mv-db06-s1',
        goal: 'Meet Roshi’s other new student, and find the old man a housekeeper.',
        hint: 'Talk to Krillin on the beach. Then take Nimbus out looking for someone willing to keep house on an island.',
        check: 'talk:krillin',
        scene: {
          id: 'mv-db06-island',
          lines: [
            N('Roshi’s island is a pink house, one palm tree and a lot of sea. Waiting on the doorstep is a bald boy with six dots on his forehead.'),
            KR('I’m Krillin. From Orin Temple. I’ve brought Master Roshi a present, so he’ll take me. A very grown-up magazine.', 'happy'),
            G('I brought him me.', 'happy'),
            KR('That’s… not a present. Is he going to like you better? He’s going to like you better, isn’t he?', 'sad'),
            RO('I will take you both. On one condition. This house needs a lady in it. A pretty one. To cook. And be pretty.', 'happy'),
            TU('He means a housekeeper. He also means the other thing. I make the tea anyway.'),
            N('Goku and Krillin take Nimbus out, and Krillin falls through it. He rides the turtle with your Nubbins instead, sulking.'),
            N('In a town on the coast, a dark-haired girl is being chased by police. She is sweet, polite and very confused about why.'),
            LU('Oh, hello! Are you police too? They keep saying I robbed a bank. I don’t think I’d do that. I’m almost sure.', 'happy'),
          ],
          choices: [
            {
              id: 'warn',
              label: 'Tell her plainly what the old man wants.',
              set: { 'mv-db-lunch': 'warned' },
              then: [
                LU('A nice old man who wants a cook? How lovely. I love cooking. I’ll keep my eye on him.', 'happy'),
                N('She has no idea, and it doesn’t matter. She is about to have the upper hand.'),
              ],
            },
            {
              id: 'just-go',
              label: 'Just get her off the street before the police arrive.',
              set: { 'mv-db-lunch': 'rescued' },
              then: [
                N('You haul her onto the turtle. A pepper pot rolls off a café table, and she sneezes.'),
                N('Her hair goes blonde and her eyes narrow. She pulls a machine gun out of nowhere you can see.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db06-island-done',
          lines: [
            N('Back on the island, Lunch sneezes and Blonde Lunch shoots holes in the kitchen. She sneezes again and makes tea.'),
            RO('Two of her. Excellent value.', 'happy'),
            N('Roshi tries one cheeky look at Blonde Lunch. She shoots the end off his walking stick. He does not try twice.'),
          ],
        },
      },
      {
        id: 'mv-db06-s2',
        goal: 'Run the morning milk round with Goku and Krillin.',
        hint: 'A long race with a turtle shell on your back. Pace yourselves; nobody finishes the first one fast.',
        check: 'race:finish:mv-milk-round',
        scene: {
          id: 'mv-db06-milk',
          lines: [
            RO('Training begins today. Wear these.'),
            N('He hands out turtle shells, each about as heavy as the boy wearing it. Your Nubbins get small ones, still heavy.'),
            KR('When do we learn the fireball? The secret palm thing? The flying kick?', 'happy'),
            RO('Today you deliver milk. Then you dig a field with your hands. Then you swim. Then you eat. Then you study. Then you sleep.'),
            G('That’s it? That sounds fun!', 'happy'),
            KR('That doesn’t sound like martial arts. That sounds like a farm.'),
            RO('The farm will make you strong. The study will make you smart. The sleep will make you nice to be around. Go.'),
            N('Out across the islands, up hills, down stairs, a bottle at every door. Goku and Krillin run; Roshi rides a scooter.'),
            N('Halfway round, Krillin finds a shortcut through a hedge. Roshi is waiting at the far end of it, eating an ice lolly.'),
            RO('Every student finds the hedge. That is lesson two. Lesson one is that I am always at the end of the hedge.'),
          ],
        },
        done: {
          id: 'mv-db06-milk-done',
          lines: [
            N('By the last house your Nubbins are carrying the empty bottles in their mouths. Krillin is carried home by Goku.'),
            KR('I’m fine. I just want to lie in the road for a moment.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-db06-s3',
        goal: 'Swim the shark lake.',
        hint: 'A Swim expedition. The shark only gets the slowest swimmer, so do not be the slowest swimmer.',
        check: 'expedition:complete:mv-shark-lake:swim',
        scene: {
          id: 'mv-db06-sharks',
          lines: [
            N('After the field, after lunch, Roshi leads everyone to a lake. It is calm, green and lovely.'),
            RO('Ten laps. There is one shark. He is generally reasonable. Generally.'),
            KR('There’s a shark in a lake? How did a shark get into a lake?', 'shock'),
            RO('Same way you got onto this island. Ambition.'),
            N('Your Swim Nubbin dives in first. It has always wanted to meet a shark, and it is about to get its wish.'),
            G('Race you to the far side, Krillin! Last one there is shark lunch!', 'happy'),
            KR('That is not how you motivate people!'),
            N('A grey fin rises in the middle of the lake and turns, slowly, towards the splashing.'),
          ],
        },
        done: {
          id: 'mv-db06-sharks-done',
          lines: [
            N('Nobody gets eaten. Your Swim Nubbin comes out last, because it stopped to bump noses with the shark.'),
            RO('Eight months of this, and you’ll be ready for the World Martial Arts Tournament.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db06-complete',
      lines: [
        N('The months go by in milk bottles and blisters. Krillin stops crying in the field, and Goku stops noticing the shell.'),
        KR('Goku. I’m sorry I was rotten to you when I came. I thought there was only room for one.', 'soft'),
        G('There’s loads of room. It’s a whole island!', 'happy'),
        N('Lunch makes curry and Blonde Lunch makes threats. Both are delicious, in their way.'),
        RO('Take off the shells. Go on. Jump.'),
        N('Goku jumps clean over the house, Krillin over the palm tree. Your Nubbins jump onto the roof and refuse to come down.'),
      ],
    },
    rewards: [
      { id: 'mv-db06-shell', kind: 'cosmetic', label: 'Training Shell', description: 'A small weighted turtle shell. Wearable by any Nubbin. Purely for show; it weighs nothing in the Grove.' },
      { id: 'mv-db06-title', kind: 'title', label: 'Turtle School Student', description: 'For Nubbins who did the milk round, the field and the shark lake under Master Roshi.' },
      { id: 'mv-db06-bottle', kind: 'decor', label: 'Milk Crate', description: 'A crate of empty milk bottles for the Grove doorstep. Fills itself in the morning.' },
    ],
    sets: { 'mv-db06': true },
    notes:
      'Lunch: sneezes switch her between sweet (dark hair) and violent (blonde) selves; show the sneeze, then swap the sprite. Her gun is cartoonish and nobody is hit. Roshi’s “grown-up magazine” from Krillin is never shown, only the brown paper wrapper. His interest in a “pretty housekeeper” stays a line and a turtle’s sigh. Training montage: milk round (long race), field-digging (skip, mention), shark lake (Swim expedition). Krillin is from Orin Temple. The hedge shortcut and Blonde Lunch shooting the end off Roshi’s stick are ours (cartoon gunfire, nobody hit). Chapters checked from memory: ch. 24–27 (1985).',
  },

  // ------------------------------------------------------------------ DB7
  {
    id: 'mv-db07',
    code: 'DB7',
    title: 'The 21st Budokai',
    source: 'Dragon Ball, chapters 28–53 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB6, Turtle School' },
    requires: ['DB6'],
    speakers: [GOKU, KRILLIN, ANNOUNCER, JACKIE, BULMA, ROSHI, NAM],
    steps: [
      {
        id: 'mv-db07-s1',
        goal: 'Get Goku and Krillin through the preliminaries.',
        hint: 'Four quick karate bouts. Ring-out counts; be clever at the edge.',
        check: 'karate:win:mv-21st-prelims',
        scene: {
          id: 'mv-db07-prelims',
          lines: [
            N('Papaya Island. The World Martial Arts Tournament fills a stone temple with fighters, food stalls and shouting.'),
            AN('Welcome, welcome! One hundred and thirty-eight hopefuls! Eight places in the final round! Fight well and don’t die!'),
            KR('I’m going to lose in the first round. I can feel it in my knees.', 'sad'),
            G('You did the milk. You did the sharks. You can do people.', 'happy'),
            N('Your Nubbins are entered as Goku’s and Krillin’s seconds. They carry towels, water, and opinions.'),
            N('An old man in a hat and dark glasses, calling himself Jackie Chun, is in the bracket too. He smells faintly of turtle.'),
            JC('Hello, young men. You look very well trained. Somebody must have worked you very hard.', 'happy'),
            KR('He knows us. Why does he know us?', 'think'),
            G('I like him. He talks like Master Roshi.', 'happy'),
          ],
          choices: [
            {
              id: 'second-krillin',
              label: 'Stand in Krillin’s corner.',
              set: { 'mv-db-21st-corner': 'krillin' },
              then: [
                N('Krillin wins his first bout in nine seconds. He looks at his own fists as if someone has swapped them.'),
                KR('Did you see? Did you see that? Tell Goku. No, tell everyone.', 'happy'),
              ],
            },
            {
              id: 'second-goku',
              label: 'Stand in Goku’s corner.',
              set: { 'mv-db-21st-corner': 'goku' },
              then: [
                N('Goku wins his first bout by jumping so high the referee loses sight of him. He lands on the other fighter, and that counts.'),
                G('Is that it? Can I go again?', 'happy'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-db07-s1b',
        goal: 'Get Goku and Krillin through the quarter-finals and the semi-finals.',
        hint: 'Two karate bouts back to back. Against the smelly one, don’t breathe in; against Nam, watch the sky.',
        check: 'karate:win:mv-21st-main-rounds',
        scene: {
          id: 'mv-db07-rounds',
          lines: [
            N('The final eight draw lots from a box. Krillin draws Bacterian, a mountain of a man who has proudly never had a bath.'),
            KR('He’s breathing on me. Goku, he’s breathing on me on purpose. My eyes are melting.', 'shock'),
            G('Krillin! You haven’t got a nose! How can you smell him?', 'happy'),
            N('Krillin stops. He touches the middle of his face. There is, now he thinks about it, nothing there.'),
            KR('…I haven’t got a nose.', 'happy'),
            N('He wins in a hurry, and returns the smell in the least dignified way known to martial arts. The front row moves back three rows.'),
            N('Goku gets glued to the tiles by a winged giant’s chewing gum, and gets out of it by being far too stubborn to stay stuck.'),
            N('Behind the arena, at the fountain, Goku’s semi-final opponent is filling a gourd: a tall, quiet fighter in a turban.'),
            N('He drinks none of it. He corks it and packs it away carefully, the way other people pack money.'),
            NM('I am Nam. My village has had no rain for three years. The prize would buy water for all of it.', 'soft'),
            NM('I am sorry. Your friend is a good boy. I must beat him anyway.'),
          ],
          choices: [
            {
              id: 'tell-goku',
              label: 'Tell Goku about Nam’s village before the bout.',
              set: { 'mv-db-nam': 'told' },
              then: [
                G('Then he should fight his hardest, and so should I. Otherwise it doesn’t count for either of us.', 'think'),
                NM('…Yes. If I won by pity, I could not drink the water.', 'soft'),
              ],
            },
            {
              id: 'keep-quiet',
              label: 'Keep it from Goku. Let the bout be clean.',
              set: { 'mv-db-nam': 'kept' },
              then: [
                N('You keep it to yourself. It sits in your stomach like a stone all the way through the bout.'),
                N('Your Nubbins, who heard everything, top up Nam’s gourd from the fountain while he isn’t looking.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db07-rounds-done',
          lines: [
            N('Nam leaps so high he vanishes into the sun, and drops like a hammer. Goku sidesteps at the last possible instant.'),
            N('One chop, and Nam folds up on the tiles. Goku helps him up before the referee has finished counting.'),
            NM('You are a strange child. Thank you for not holding back.', 'soft'),
            N('In the other semi, Jackie Chun beats Krillin while apologising the whole way through, and meaning it.'),
          ],
        },
      },
      {
        id: 'mv-db07-s2',
        goal: 'Watch the final: Goku against Jackie Chun.',
        hint: 'A full karate final. You may lose it. The bout is what matters.',
        check: 'karate:finish:mv-jackie-chun',
        scene: {
          id: 'mv-db07-final',
          lines: [
            N('The final is the boy and the old man. The whole island crams into the stands; even the seagulls have found seats.'),
            AN('Ladies and gentlemen, the final! The youngest fighter in years, against a grandfather who moves like a breeze!'),
            JC('Come, Goku. Show me all of it.'),
            N('Goku shows him all of it, and the old man dodges most of it. Then Goku has to start dodging the old man’s blows.'),
            N('A palm strike sends Goku flying out past the edge of the ring. He twists in the air, fires a Kamehameha behind him, and rockets back.'),
            JC('He used it to fly? Nobody taught him that. Nobody taught ME that!', 'shock'),
            N('Your Nubbins, in Goku’s corner, try the same trick off the edge of the bench. They mostly blow up a towel.'),
            N('Night falls and the full moon rises over the arena. Goku’s tail, grown back over the year, twitches.'),
            BU('Oh no. Oh no, not the tail. I knew that tail was trouble.', 'shock'),
            N('Goku grows. The arena lights go out under a giant ape’s fur.'),
            JC('Well. Nobody can say I didn’t prepare for everything.', 'think'),
            N('Jackie Chun cups his hands at his hip as blue light gathers. He aims, not at the ape, but up.'),
          ],
        },
        done: {
          id: 'mv-db07-final-done',
          lines: [
            N('The beam goes up through the clouds, and the moon is no longer in the sky. Some pieces of it may be on their way down.'),
            N('Goku shrinks, gets dressed in a borrowed tablecloth, and loses the final by a single kick and a hair’s breadth.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db07-complete',
      lines: [
        AN('Your winner and champion: Jackie Chun!'),
        G('That was the best fight ever! Can we do it again next time?', 'happy'),
        JC('Next time, boy, you will win. I am counting on it.', 'soft'),
        N('Jackie Chun slips away. A few minutes later Master Roshi appears from behind the same wall, wearing the same shoes.'),
        KR('Master. Were you Jackie Chun?', 'think'),
        RO('Jackie who? Never heard of him. Excellent fighter. Very handsome.', 'happy'),
        N('Roshi’s prize pays for dinner, and Goku eats most of it. What is left goes in an envelope addressed to Nam’s village.'),
        BU('Goku, here. A radar, all yours. The balls are active again. Go find your grandpa’s four-star.'),
        N('Your Nubbin checks Bulma’s hands, the way it has since the hut. No fingers crossed this time.'),
        N('Goku takes the radar and Nimbus and heads off alone. Your Nubbins, of course, go with him.'),
      ],
    },
    rewards: [
      { id: 'mv-db07-belt', kind: 'cosmetic', label: 'Tournament Ribbon', description: 'A runner-up ribbon from the 21st Tournament. Wearable by any Nubbin.' },
      { id: 'mv-db07-moon', kind: 'flag', label: 'No Moon', description: 'The moon is gone in this world. Full-moon events in the Dragon Ball line do not happen until it returns.' },
    ],
    sets: { 'mv-db07': true, 'mv-db-moon': 'gone' },
    notes:
      'Goku loses the final to Jackie Chun (Roshi in disguise), as in the source; the karate check is `finish`, not `win`. Roshi destroys the moon with the Kamehameha to stop the ape; no casualties, played as an “oops” moment. Goku’s nudity after the transformation: back view, tablecloth. Bulma gives Goku a radar at the end, which starts the set-one hunt in DB8 (`mv-db-balls` counts from 0). Step mv-db07-s1b (added in review) plays the main rounds: Krillin vs Bacterian (the “you have no nose” gag is the source’s; the words are ours; the retaliation stays an off-screen smell joke), Goku vs Giran (gum), Goku vs Nam in the semi, Krillin vs Jackie Chun in the other semi. Ranfan need not appear. `karate:win:mv-21st-main-rounds` is two back-to-back bouts. Nam’s drought-struck village is from the source; `mv-db-nam` (told/kept) only changes the then-lines, and the envelope from Roshi’s prize money is our adaptation (in the source the prize goes on Goku’s enormous dinner; we keep that and add the envelope). Goku firing a Kamehameha behind him to fly back to the ring is from this final (check the chapter); it sets up the backwards Kamehameha against King Piccolo in DB17. The Nubbin checking Bulma’s fingers pays off DB1’s crossed fingers. Chapters checked from memory: ch. 28–53 (1985–86).',
  },

  // ------------------------------------------------------------------ DB8
  {
    id: 'mv-db08',
    code: 'DB8',
    title: 'Muscle Tower',
    source: 'Dragon Ball, chapters 54–68 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB7, The 21st Budokai' },
    requires: ['DB7'],
    speakers: [GOKU, WHITE, EIGHT, SUNO],
    steps: [
      {
        id: 'mv-db08-s1',
        goal: 'Find out who holds the snowbound village under its thumb.',
        hint: 'An expedition through snow. A Nubbin with good stamina keeps the others warm.',
        check: 'expedition:complete:mv-jingle-village',
        scene: {
          id: 'mv-db08-snow',
          lines: [
            N('Nimbus can’t see in the blizzard, and you crash into a snowbank. Goku is wearing shorts and is surprised to be cold.'),
            G('Why’s it so cold? Is the sky broken? Little ones, get in my shirt.', 'shock'),
            N('A girl in a fur hat digs you out with a coal shovel, then stares at Goku’s bare knees.'),
            SU('Shorts? In this? You’re either very brave or very silly. Come inside before something snaps off.', 'shock'),
            N('A village hides under the snow. Its people talk in whispers and look over their shoulders at the north.'),
            N('Up on the ridge stands a red tower, and on it a red ribbon flag. Soldiers patrol the slopes with dogs.'),
            SU('The Red Ribbon Army. They took Papa up the tower to make the village dig for some orange ball. He’s the chief.', 'sad'),
            G('An orange ball? With stars in? Hey! I’ve got a radar, and it’s pointing at your tower!', 'happy'),
            N('Your Nubbins exchange a look. It has taken the soldiers about four minutes to hear about Goku’s radar too.'),
          ],
        },
      },
      {
        id: 'mv-db08-s2',
        goal: 'Climb Muscle Tower floor by floor.',
        hint: 'A tower expedition: one fight per floor. Each floor’s guard has one weakness. Ninjas hate light; jelly hates cold.',
        check: 'expedition:complete:mv-muscle-tower',
        scene: {
          id: 'mv-db08-tower',
          lines: [
            WH('Welcome to Muscle Tower, boy. Five floors. One of my best on each. And at the top: me, with a cup of tea.', 'happy'),
            N('The voice comes from a speaker on the wall. General White watches every floor on screens and drinks every cup of tea.'),
            N('Floor one: a giant sergeant who won’t stay down.'),
            N('Goku finds out why. He’s a robot, and robots have off switches.'),
            N('Floor two: a ninja who keeps splitting into identical brothers. Your Nubbins count shoes until the trick falls apart.'),
            N('Floor three: a pit, and in it a pink jelly called Buyon that bounces every punch straight back at the puncher.'),
            N('Your Nubbins push open a window. The blizzard pours in, Buyon sets like a pudding, and one tap breaks him into pink ice cubes.'),
            WH('Hm. Well. Floor four has never been passed.', 'think'),
            N('Floor four: a quiet room with a closed door, and behind the door something enormous breathing.'),
            G('Hello? Do you want to fight? You don’t sound like you want to fight.', 'think'),
          ],
        },
        done: {
          id: 'mv-db08-tower-done',
          lines: [
            N('The door opens. There stands a giant with a stitched-up face and a scar across his forehead, wringing his hands.'),
            E8('Please. Go away. Eight does not like fighting. Eight likes the squirrels outside the window.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-db08-s3',
        goal: 'Make friends with Android 8.',
        hint: 'Talk to him. Do not fight him. He has never once been asked what he wants.',
        check: 'talk:android-8',
        scene: {
          id: 'mv-db08-eight',
          lines: [
            G('I don’t want to fight you either. I just want the ball. Do you want to come outside with us?', 'happy'),
            E8('Outside? Eight is not allowed. Eight is a weapon. The Doctor said so.', 'sad'),
            WH('Android 8! Crush that brat! Or I press the button!', 'angry'),
            E8('Eight has a bomb inside. The General has the button. Eight does what he says, or… pop.', 'sad'),
            N('Your Nubbins have climbed onto Eight’s enormous knee. They are showing him a squirrel through the window.'),
            E8('…Eight likes small ones. Eight likes them very much.', 'soft'),
            G('You’re not a weapon. You’re a big friend with a scar. Come on. We’ll fix the button.'),
            WH('Fine. I’ll press it. Goodbye, Eight.', 'angry'),
          ],
          choices: [
            {
              id: 'button',
              label: 'Send a Nubbin for the button while Goku runs for White.',
              set: { 'mv-db-eight': 'button' },
              then: [
                N('Your Nubbin sprints up the stairwell and bites White’s thumb just as he presses. The button rolls under a desk.'),
                WH('OW! It bit me! Somebody shoot the small thing!', 'angry'),
              ],
            },
            {
              id: 'stand',
              label: 'Stand in front of Eight. Let White see you won’t move.',
              set: { 'mv-db-eight': 'stood' },
              then: [
                N('You stand between the giant and the camera, your Nubbins beside you. White’s thumb hesitates.'),
                E8('Nobody ever stood in front of Eight. Eight usually stands in front.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db08-eight-done',
          lines: [
            N('Goku reaches the top floor and takes the button off General White. White steps outside, through the window, with Eight’s help.'),
            E8('Eight… punched someone. Eight feels strange about it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db08-complete',
      lines: [
        N('The army flees the valley. The village comes out of its houses and blinks at the sun on the snow.'),
        E8('Can Eight stay? Eight could carry wood. Eight could mind the children. Eight would be very careful.', 'soft'),
        N('Suno’s papa comes down the tower steps last, blinking at the light. Goku is carrying his suitcase and General White’s tea tray.'),
        SU('Eight. You can carry wood with me. And you’re not allowed to call yourself a weapon in our house.', 'soft'),
        N('Suno takes Eight by one finger and leads him in for soup. That settles it.'),
        G('Here’s the ball! It was in the General’s desk with his tea.', 'happy'),
        N('One Dragon Ball. Your Nubbins insist on holding it all the way back to Nimbus.'),
        G('One down! Six to go! And then I’ll find Grandpa’s.'),
      ],
    },
    rewards: [
      { id: 'mv-db08-hat', kind: 'cosmetic', label: 'Jingle Village Fur Hat', description: 'A furry snow hat from the village under Muscle Tower. Wearable by any Nubbin.' },
      { id: 'mv-db08-squirrel', kind: 'decor', label: 'Eight’s Squirrel Feeder', description: 'A feeder Android 8 built with very large hands. Squirrels visit it in the Grove.' },
    ],
    sets: { 'mv-db08': true, 'mv-db-balls': 1 },
    notes:
      'Set one begins: `mv-db-balls` = 1. Muscle Tower is a floor-by-floor expedition: Sergeant Metallic (robot, off switch), Ninja Murasaki and his “brothers” (shoe-counting puzzle), Buyon the jelly monster in the pit (floor three; beaten by opening a window on the blizzard and freezing him), Android 8 (floor four, no fight), General White (floor five). Suno and her father, the village chief held in the tower, are from the source (check the chapter for how the chief is held); Suno is added as a speaker in review. Eight (Hatchan) keeps his gentle voice; he refers to himself as Eight. The bomb in his chest is a plot device; it never goes off. White is thrown out of the window into a snowbank, not killed. Chapters checked from memory: ch. 54–68 (1986).',
  },

  // ------------------------------------------------------------------ DB9
  {
    id: 'mv-db09',
    code: 'DB9',
    title: 'The Pirate Cave',
    source: 'Dragon Ball, chapters 69–81 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB8, Muscle Tower' },
    requires: ['DB8'],
    speakers: [GOKU, BULMA, KRILLIN, BLUE, ARALE],
    steps: [
      {
        id: 'mv-db09-s1',
        goal: 'Dive the underwater pirate cave ahead of General Blue.',
        hint: 'A Swim expedition. Your Swim Nubbin leads; the others follow its bubbles.',
        check: 'expedition:complete:mv-pirate-cave:swim',
        scene: {
          id: 'mv-db09-dive',
          lines: [
            N('Goku’s radar breaks. Bulma fixes it in West City, then insists on coming along, because the next ball is under the sea.'),
            BU('Treasure, pirates, a submarine. Of course I’m coming. Krillin, bring snacks. Goku, bring Goku.'),
            KR('I was meant to be on holiday. This is my holiday now, isn’t it?', 'sad'),
            N('The ball is in a cave beneath the waves where pirates once hid their gold. Something else is heading there too.'),
            N('A Red Ribbon submarine. On its deck stands an officer with blond hair and very clean gloves.'),
            BL('General Blue. I find dirt offensive, failure intolerable and children tiresome. You are all three.', 'angry'),
            N('Your Swim Nubbin is already over the side. It has seen the cave mouth and is not waiting for anybody.'),
            BU('Follow the little one! It swims better than our sub steers.'),
          ],
          choices: [
            {
              id: 'treasure',
              label: 'Keep an eye out for the pirates’ gold.',
              set: { 'mv-db-pirate': 'treasure' },
              then: [
                BU('Finally, somebody with priorities.', 'happy'),
                N('Your Swim Nubbin surfaces with one gold coin in its mouth, very proud. It is a chocolate coin.'),
              ],
            },
            {
              id: 'ball',
              label: 'Ball first. Gold later.',
              set: { 'mv-db-pirate': 'ball' },
              then: [
                G('Ball first! Then lunch! Then gold. Maybe lunch again.', 'happy'),
                N('Your Swim Nubbin nods and dives straight for the radar’s blip.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db09-dive-done',
          lines: [
            N('The cave is full of traps, a pirate robot with a sword arm, and one Dragon Ball on a pile of treasure.'),
            N('Krillin opens a chest marked DO NOT OPEN, and the ceiling starts coming down. In fairness, it was very clearly marked.'),
            KR('Why would anyone WRITE that on a chest? That’s practically an invitation!', 'shock'),
            N('Blue freezes Goku stiff with a stare. Then he grabs the ball and the gold and floods the cave behind him.'),
          ],
        },
      },
      {
        id: 'mv-db09-s2',
        goal: 'Chase General Blue to Penguin Village.',
        hint: 'A race across sea and sky on Nimbus. You need only finish; somebody in the village will finish him for you.',
        check: 'race:finish:mv-penguin-village',
        scene: {
          id: 'mv-db09-chase',
          lines: [
            N('Out of the flooding cave, half-drowned. Goku sneezes the stiffness off; Krillin sneezes on Bulma.'),
            G('He’s got our ball! Nimbus! Little ones, hang on!', 'angry'),
            N('Blue’s plane crosses the sea towards a little village where the cars have faces and the sun wears sunglasses.'),
            BL('A village of idiots. Perfect. I’ll lose him here.'),
            N('He lands in the main street. A small girl in glasses and a winged cap is squatting by the road, poking a stick.'),
            AR('Hiya! You’re weird and shiny! Are you a robot too? I’m a robot!', 'happy'),
            BL('Out of my way, child. I have no time for…'),
            N('The girl pats him on the back to say hello. General Blue goes through two walls and into a hill.'),
          ],
        },
        done: {
          id: 'mv-db09-chase-done',
          lines: [
            AR('Oopsie! Wanna play? Your little round friends wanna play?', 'happy'),
            N('Your Nubbins play with Arale for one minute. It is the most dangerous minute of their lives, and the best.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db09-complete',
      lines: [
        N('Goku gets the ball back from the hill where Blue is lodged. Blue is alive, upside down, and declining help.'),
        AR('Bye-bye! Come back! Bring the floaty cloud! Bring the round ones!', 'happy'),
        BU('I am never coming back here. That girl stopped a train with her face.', 'shock'),
        KR('Nobody saw that but me, right? I’m not sure I saw it.', 'think'),
        G('Two! Five to go!', 'happy'),
        N('Your Swim Nubbin is still holding its chocolate coin and refuses to eat it. It is treasure now.'),
      ],
    },
    rewards: [
      { id: 'mv-db09-coin', kind: 'decor', label: 'Pirate Chocolate Coin', description: 'A chocolate coin in gold foil, on a little stand. Your Swim Nubbin guards it.' },
      { id: 'mv-db09-title', kind: 'title', label: 'Cave Diver', description: 'For the Swim Nubbin that led the dive into the pirate cave.' },
      { id: 'mv-db09-cap', kind: 'cosmetic', label: 'Winged Cap', description: 'A cap with little wings, a gift from a very strong girl in Penguin Village. Wearable by any Nubbin.' },
    ],
    sets: { 'mv-db09': true, 'mv-db-balls': 2 },
    notes:
      '`mv-db-balls` = 2. Swim Nubbin leads the dive (brief requirement). Blue’s paralysis stare: a status effect in the cave expedition that the Nubbins break by distraction. Penguin Village is the Dr. Slump crossover: Arale, talking cars, smiling sun. No Dr. Slump catchphrases; Arale’s lines are all new. Blue is flattened, not killed (he is killed later by Tao in the source; this line leaves that off-screen and unmentioned). Chapters checked from memory: ch. 69–81 (1986).',
  },

  // ------------------------------------------------------------------ DB10
  {
    id: 'mv-db10',
    code: 'DB10',
    title: 'Mercenary Tao',
    source: 'Dragon Ball, chapters 82–86 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB9, The Pirate Cave' },
    requires: ['DB9'],
    speakers: [GOKU, UPA, BORA, TAO],
    steps: [
      {
        id: 'mv-db10-s1',
        goal: 'Meet the guardians of Korin’s holy land.',
        hint: 'Talk to Upa. Bora will test Goku first; let him.',
        check: 'talk:upa',
        scene: {
          id: 'mv-db10-holyland',
          lines: [
            N('The radar points to a plain of grass where a white tower rises so high its top is lost in the clouds.'),
            N('A huge man with a spear stands in the way. A boy with a single braid peeks out from behind his leg.'),
            BO('This is holy ground. The tower belongs to Korin. Outsiders who come for it come to steal.'),
            G('I don’t want the tower. I want a ball. An orange one. With stars.', 'happy'),
            UP('Father, he flies on a cloud. Bad men can’t ride clouds. Everybody knows that.'),
            N('Bora tests Goku with three swings of his spear. Goku dodges all three and then helps him pick it up.'),
            BO('Hm. The boy is right. Forgive me. We have a Dragon Ball, as it happens. It was a gift to Korin, years ago.'),
            BO('Stay for supper. Tomorrow, if your heart is good, you may have it.'),
            UP('Will your little ones sleep in my hut? I’ll show them my spear. It’s only small. It’s a beginner spear.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-db10-s2',
        goal: 'Face the man the army sent.',
        hint: 'A karate bout you will lose. Keep Upa behind you, and stay alive.',
        check: 'karate:finish:mv-mercenary-tao',
        scene: {
          id: 'mv-db10-tao',
          lines: [
            N('In the morning, something comes over the horizon. A man in a pink tunic, standing on a flying pillar of stone.'),
            N('He steps off as it lands. His hair is in a long braid, and he is smiling as if the world has made a small joke.'),
            TA('Mercenary Tao. I kill for money, and the Red Ribbon pays very well. Which of you is the boy with the tail?', 'happy'),
            BO('Leave this place. It is holy.'),
            TA('Everything is holy until somebody buys it.'),
            N('It happens too fast to watch. Bora, who blocked three of Goku’s best blows, does not block one of Tao’s.'),
            N('The big man falls and doesn’t rise. Upa runs to him, and your Nubbins run after Upa to keep him back.'),
            UP('Father? Father, get up. Please get up.', 'sad'),
            G('You…', 'angry'),
          ],
          choices: [
            {
              id: 'upa',
              label: 'Pull Upa away and keep him safe.',
              set: { 'mv-db-tao': 'protected-upa' },
              then: [
                N('You hold Upa against your chest. He fights you, then stops and shakes, your Nubbins pressed against him on both sides.'),
                TA('Sweet. Keep him. I don’t charge for children.'),
              ],
            },
            {
              id: 'goku',
              label: 'Let Goku go. Tell him to give it everything.',
              set: { 'mv-db-tao': 'all-in' },
              then: [
                G('Everything. Everything I’ve got.', 'angry'),
                TA('Oh, good. I do like it when they try.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db10-tao-done',
          lines: [
            N('Goku lands blows, and Tao lets him. Then Tao points one finger, and a bolt of light hits Goku in the chest.'),
            N('Goku goes down. Tao walks away whistling, without looking back.'),
            N('He should have looked. Under Goku’s shirt, the bolt has struck a Dragon Ball.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db10-complete',
      lines: [
        N('Goku wakes up in Upa’s hut with a hole burned in his shirt and an orange ball warm in his hand.'),
        G('It stopped the light. Grandpa’s kind of ball stopped it.', 'think'),
        UP('We buried Father by the tower. He’d want to be near it.', 'sad'),
        G('I couldn’t beat him. I wasn’t strong enough. I need to get stronger. Right now. Today.', 'angry'),
        UP('They say if you climb the tower, Korin has Sacred Water at the top. Anyone who drinks it gets much stronger.'),
        N('Goku looks up at the white tower vanishing into cloud. He takes off his boots.'),
        G('Then I’m climbing it.'),
      ],
    },
    rewards: [
      { id: 'mv-db10-feather', kind: 'cosmetic', label: 'Upa’s Feather', description: 'A feather Upa wears in Bora’s memory, shared with your Nubbins. Wearable by any Nubbin.' },
      { id: 'mv-db10-flag', kind: 'flag', label: 'A Debt to Bora', description: 'Bora fell defending Korin’s land. The line remembers it; the first set’s wish in DB13 can bring him back.' },
    ],
    sets: { 'mv-db10': true, 'mv-db-bora': 'fallen' },
    notes:
      'The line’s first death: Bora is killed by Tao off-panel (cut on the blow, then Bora lying still; no wound shown, no blood). Tao’s finger beam is the Dodon Ray; name it on the karate result screen only (“Dodon Ray”). The bout is a scripted loss (`finish`). The Dragon Ball in Goku’s shirt saves him, as in the source. Count stays at 2: Korin’s ball is not handed over until DB11. Bora’s fate is flagged (`mv-db-bora`) for DB13’s wish. Tao rides a thrown pillar, the series’ famous image; keep it. Chapters checked from memory: ch. 82–86 (1986).',
  },

  // ------------------------------------------------------------------ DB11
  {
    id: 'mv-db11',
    code: 'DB11',
    title: 'Korin Tower',
    source: 'Dragon Ball, chapters 87–91 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB10, Mercenary Tao' },
    requires: ['DB10'],
    speakers: [GOKU, KORIN, TAO, UPA],
    steps: [
      {
        id: 'mv-db11-s1',
        goal: 'Climb Korin Tower.',
        hint: 'A long climbing race. No rivals, only the tower. Rest on the ledges; the top is further than it looks.',
        check: 'race:finish:mv-korin-tower:climb',
        scene: {
          id: 'mv-db11-climb',
          lines: [
            N('The tower is smooth white stone with carvings just deep enough for fingers. And paws, if the paws are determined.'),
            G('Little ones, get on my back. No. Actually. You want to climb it too, don’t you?', 'think'),
            N('Your Nubbins are already three carvings up, very slowly. They are not going to stop.'),
            N('By noon the ground is a green handkerchief. By evening the clouds are below you, and the wind has opinions.'),
            G('My arms are made of noodles. My legs are made of soup. I’m hungry for both.', 'sad'),
            N('Nobody has climbed this tower in living memory. Bora’s grandfather tried, and Tao, it is said, gave up halfway.'),
            G('Tao gave up? Then I won’t.', 'angry'),
            N('Night, then morning; your Nubbins sleep tied to Goku’s belt with his headband. Then there is a floor, a hole, and light.'),
          ],
        },
        done: {
          id: 'mv-db11-climb-done',
          lines: [
            N('At the top sits a small white cat on a stool, leaning on a stick. He looks at Goku the way cats look at everything.'),
            KO('Three days. Not bad. The last one took four and fell off. I’m Korin. I suppose you want the water.'),
          ],
        },
      },
      {
        id: 'mv-db11-s2',
        goal: 'Take the Sacred Water from Korin.',
        hint: 'A chasing game. Korin is faster than anything; the score counts how close you get, not whether you win.',
        check: 'minigame:score:mv-korin-chase:300',
        scene: {
          id: 'mv-db11-water',
          lines: [
            KO('The water is in this jar. You may drink it, if you can take it from me.', 'happy'),
            N('Goku lunges.'),
            N('The jar is suddenly on the other side of the room, and so is Korin. He hasn’t visibly moved.'),
            G('How did you do that?', 'shock'),
            KO('I am old, and I am a cat, and I have been doing this for eight hundred years. Try again.'),
            N('Goku tries for one day, then two, your Nubbins flanking him. Korin steps around them like puddles.'),
            N('On the third day Goku is moving faster than he has ever moved. On the third evening, his fingers touch the jar.'),
            G('Got it! Got it! Now I drink it and I get strong!', 'happy'),
          ],
          choices: [
            {
              id: 'drink',
              label: 'Let him drink it.',
              set: { 'mv-db-korin': 'drank' },
              then: [
                N('Goku drinks the whole jar. He waits, flexes, and waits a bit more.'),
                G('…It tastes like water.', 'think'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask Korin what’s actually in the jar.',
              set: { 'mv-db-korin': 'asked' },
              then: [
                KO('A sharp question. Water, mostly. Rain from the roof.', 'happy'),
                G('Water? But I chased you for three days!', 'shock'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db11-water-done',
          lines: [
            KO('The jar was never the thing. The chasing was the thing. Look how fast you are. Feel it?'),
            G('…I do feel it. I didn’t notice, because I was busy.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-db11-s3',
        goal: 'Go down and fight Mercenary Tao again.',
        hint: 'A full karate rematch. Watch for the grenade at the end; kicking it back is a legal move.',
        check: 'karate:win:mv-tao-rematch',
        scene: {
          id: 'mv-db11-rematch',
          lines: [
            N('Goku drops off the tower.'),
            N('He doesn’t climb down. He jumps, a long way, and lands soft as a leaf in the grass.'),
            N('Tao has come back to collect Korin’s Dragon Ball. He is sitting by Bora’s grave, eating an apple.'),
            TA('The boy with the tail. You were dead. I don’t make mistakes.', 'think'),
            G('You made one. Now I’m going to make you sorry for it.', 'angry'),
            UP('Goku! For Father!'),
            N('Tao fires his finger-beam, and Goku isn’t there any more. Tao fires again; Goku is beside him, then behind him.'),
            TA('Impossible. Three days ago you were nothing.', 'shock'),
          ],
        },
        done: {
          id: 'mv-db11-rematch-done',
          lines: [
            N('Beaten, Tao pulls a grenade from his sleeve and throws it. Goku kicks it straight back.'),
            N('There is a bang and a lot of smoke, and when it clears Tao is gone. Whether he is gone for good, nobody can say.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db11-complete',
      lines: [
        UP('You did it. You did it for Father.', 'soft'),
        N('Upa gives Goku the Dragon Ball that Bora kept for Korin. His hands are steady, which is the hardest part.'),
        G('Upa. When I’ve got all seven, I’m going to wish your dad back. I promise.', 'soft'),
        UP('Can you do that? Can the dragon do that?'),
        G('Bulma says he can do anything. Except maybe make her cooking nice.'),
        N('Three Dragon Balls now. Your Nubbins carry this one between them like an egg.'),
      ],
    },
    rewards: [
      { id: 'mv-db11-jar', kind: 'decor', label: 'Korin’s Water Jar', description: 'An empty jar from the top of Korin Tower. It holds rainwater, which is exactly what it always held.' },
      { id: 'mv-db11-title', kind: 'title', label: 'Tower Climber', description: 'For Nubbins that climbed Korin Tower on their own paws.' },
    ],
    sets: { 'mv-db11': true, 'mv-db-balls': 3, 'mv-db-upa-promise': true },
    notes:
      '`mv-db-balls` = 3 (Upa gives Bora’s ball). Korin’s chase is a minigame: Korin teleports between spots; score is the number of near-touches. The “Sacred Water is just water” reveal happens whichever choice is picked. The grenade is kicked back; Tao is blown away and presumed gone (he returns half-cyborg in E4). Goku’s promise to wish Bora back (`mv-db-upa-promise`) pays off in DB13. Chapters checked from memory: ch. 87–91 (1986).',
  },

  // ------------------------------------------------------------------ DB12
  {
    id: 'mv-db12',
    code: 'DB12',
    title: 'Red Ribbon’s End',
    source: 'Dragon Ball, chapters 92–95 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB11, Korin Tower' },
    requires: ['DB11'],
    speakers: [GOKU, RED, BLACK],
    steps: [
      {
        id: 'mv-db12-s1',
        goal: 'Storm the Red Ribbon Army’s headquarters with Goku.',
        hint: 'An expedition through a whole base. Nubbins are small: send them under fences while Goku goes over them.',
        check: 'expedition:complete:mv-red-ribbon-hq',
        scene: {
          id: 'mv-db12-hq',
          lines: [
            N('The Red Ribbon headquarters is a city of red buildings behind a wall.'),
            N('There are thousands of soldiers. There is one Goku.'),
            G('They hurt Bora. They hurt the snow village. They keep hurting people. I’m going to stop them all.', 'angry'),
            Y('All of them? On your own?'),
            G('Not on my own. You’re coming. And the little ones.', 'happy'),
            N('Goku goes in through the front gate. It isn’t open, so he goes through it anyway.'),
            G('Anybody who runs away, I won’t chase! Running away is allowed! Master Roshi does it from Lunch every day!', 'happy'),
            N('About a third of the army takes him up on the offer. Your Nubbins hold the side gate open for them.'),
            N('Your Nubbins take the drains. Down there, they find the army’s storeroom, and on a shelf, under a red cloth, a glow.'),
            N('Alarms, tanks, planes. Goku knocks them over like skittles and keeps walking towards the tallest tower.'),
          ],
        },
      },
      {
        id: 'mv-db12-s2',
        goal: 'Find out what Commander Red wanted to wish for.',
        hint: 'Listen at the door of Red’s office. Your Nubbin can get under it; you can only press an ear to it.',
        check: 'talk:mv-commander-red',
        scene: {
          id: 'mv-db12-office',
          lines: [
            N('At the top of the tower, a small man in a big chair is shouting into a telephone. He stands on a box to look out of the window.'),
            RD('Stop him! He’s a child! A child! How is a child walking through my army?', 'angry'),
            BK('Commander. Sir. We should evacuate. With the balls we have, we can rebuild.'),
            RD('No! Not until I have all seven! Not until I make my wish!', 'angry'),
            BK('World conquest can wait a little longer, sir.'),
            RD('World conquest? Who said anything about the world? I want to be TALLER, Black! Taller!', 'angry'),
            N('Silence. On the far side of the door, your Nubbin hears Staff Officer Black put down his clipboard.'),
            BK('All those men. All those years. So that you could be taller.', 'think'),
          ],
          choices: [
            {
              id: 'warn',
              label: 'Burst in and warn Red.',
              set: { 'mv-db-red': 'warned' },
              then: [
                N('You shove the door open, too late. A single shot, and Commander Red is still in his chair.'),
                BK('You heard him. Tell me I was wrong.', 'angry'),
              ],
            },
            {
              id: 'listen',
              label: 'Hold your Nubbin back. Keep listening.',
              set: { 'mv-db-red': 'listened' },
              then: [
                N('A single shot. Then Black’s voice, very calm, giving orders to the whole base as its new commander.'),
                N('Your Nubbin comes out from under the door shaking. You pick it up and don’t put it down for a while.'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-db12-s3',
        goal: 'Beat Staff Officer Black in his battle suit.',
        hint: 'A karate bout against a walking machine. Kamehameha is very good against big, slow, angry things.',
        check: 'karate:win:mv-black-battle-suit',
        scene: {
          id: 'mv-db12-suit',
          lines: [
            N('Goku reaches the top floor. Black is waiting inside a blue mechanical suit three times his size.'),
            BK('Commander Black, Red Ribbon Army. The army is mine now, and you are its last problem.', 'angry'),
            G('Where’s the little shouty man?', 'think'),
            BK('He was a disappointment. I solved him.'),
            G('…You hurt your own friend?', 'angry'),
            BK('Friends. Soldiers. Children. Monkeys. Anything in my way is the same to me.'),
            N('The suit’s fists come down like falling buildings. Your Nubbins take position behind Goku, paws cupped at their hips.'),
            G('Little ones. Like Master Roshi showed us. All together.', 'angry'),
          ],
        },
        done: {
          id: 'mv-db12-suit-done',
          lines: [
            N('Four blue beams, and one battle suit a long way off, falling in pieces. Black falls with it.'),
            N('Down below, the soldiers watch their tower burn, look at each other, and quietly take off their red ribbons.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db12-complete',
      lines: [
        N('In Red’s office there is a safe. In the safe are three Dragon Balls, each in a velvet box.'),
        G('Six! We’ve got six!', 'happy'),
        N('There is also a stool with a small ladder, a pile of shoe lifts, and a letter to a tailor about longer trousers.'),
        G('He just wanted to be bigger. He could’ve asked. People would’ve let him stand on stuff.', 'sad'),
        N('The Red Ribbon Army is gone. The radar shows one ball left, and shows it nowhere at all.'),
        G('Where’s the last one? Why’s it not on the screen?', 'think'),
      ],
    },
    rewards: [
      { id: 'mv-db12-ribbon', kind: 'cosmetic', label: 'Untied Ribbon', description: 'A red ribbon a soldier took off and left on the ground. Your Nubbins wear it as a bow; it means nothing now.' },
      { id: 'mv-db12-stool', kind: 'decor', label: 'Commander’s Step Stool', description: 'A small stool with a ladder. Short Nubbins use it to reach the high fruit.' },
    ],
    sets: { 'mv-db12': true, 'mv-db-balls': 6 },
    notes:
      '`mv-db-balls` = 6 (Red’s three). Red is shot by Black off-screen: hold on the closed door, one muffled sound. No body shown. Black’s battle jacket is beaten by a joint Kamehameha from Goku and the Nubbins (uses the DB4 move). In the source Goku beats it alone; the combined beam is our adaptation. The last ball off the radar sets up Baba in DB13. Goku’s offer to let runners go (about a third of the army leaves) is ours; it keeps him a boy who fights, not a soldier. Chapters checked from memory: ch. 92–95 (1987).',
  },

  // ------------------------------------------------------------------ DB13
  {
    id: 'mv-db13',
    code: 'DB13',
    title: 'Fortuneteller Baba',
    source: 'Dragon Ball, chapters 96–112 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB12, Red Ribbon’s End' },
    requires: ['DB12'],
    speakers: [GOKU, BABA, MASKED, GOHAN, UPA, BORA, SHENRON, PILAF],
    steps: [
      {
        id: 'mv-db13-s1',
        goal: 'Get through Fortuneteller Baba’s fighters.',
        hint: 'Four quick karate bouts in Baba’s arena over the water. A vampire, an invisible man, a mummy and a devil with a mirror.',
        check: 'karate:win:mv-baba-fighters',
        scene: {
          id: 'mv-db13-baba',
          lines: [
            N('A palace in the desert, beside a lake. A tiny old woman floats in on a crystal ball, wearing a witch’s hat.'),
            BA('I see all things lost. Your Dragon Ball, for instance. I see it very clearly. For ten million zeni.', 'happy'),
            G('I haven’t got ten million… anything. I’ve got a fish. It’s old.'),
            BA('Then you fight for it. Beat my five fighters, and the seeing is free. Lose, and you mop my floors forever.'),
            N('Her arena is a ring over a pool of acid. Her fighters have faces you would cross a road to avoid.'),
            N('A vampire with dreadful breath. A man nobody can see, who keeps losing because your Nubbins can smell him.'),
            N('A mummy with an excellent bandage budget. A devil who holds up a mirror and invites you to look at your sins.'),
            G('What’s a sin? Can I see? Ooh. It’s just me.', 'happy'),
            BA('…Well, that’s never happened.', 'shock'),
          ],
        },
      },
      {
        id: 'mv-db13-s2',
        goal: 'Face Baba’s fifth fighter.',
        hint: 'A karate bout against a masked man who knows every move Goku makes. Let it run its course.',
        check: 'karate:finish:mv-masked-fighter',
        scene: {
          id: 'mv-db13-mask',
          lines: [
            BA('My last fighter. My best. He has come a very long way for this. Further than you can imagine.'),
            N('A man in a white mask and a gentle robe steps into the ring, a halo above his head. He bows to Goku.'),
            MF('Hello, boy. You’ve grown.', 'soft'),
            G('Do I know you? You smell like home. You smell like pine trees.', 'think'),
            N('They fight. The masked man blocks every punch before Goku throws it, as if he taught them.'),
            N('Frustrated, Goku reaches for his staff, and the masked man reaches for his own. They are the same staff.'),
            MF('Your tail. Where is your tail? Don’t tell me you lost it under a full moon.'),
            G('…Grandpa?', 'shock'),
          ],
          choices: [
            {
              id: 'keep-fighting',
              label: 'Tell Goku to finish the bout. His grandpa would want that.',
              set: { 'mv-db-gohan': 'finished-bout' },
              then: [
                MF('Your friend is right. Show me, Goku. Show me all of it.', 'happy'),
                N('Goku does. The last punch lands, and the old man laughs as he falls.'),
              ],
            },
            {
              id: 'stop',
              label: 'Ask Baba to stop the fight.',
              set: { 'mv-db-gohan': 'stopped' },
              then: [
                BA('Stop it? He paid a day of his death to be here. Let the boy have the fight.', 'sad'),
                N('So Goku fights his grandfather, and wins, and cries a little while doing it.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db13-mask-done',
          lines: [
            N('The masked man takes off the mask: a kind old face with a white beard. Goku’s whole body shakes.'),
            GH('One day. Baba gave me one day back from the other side. I spent it fighting you. Best day I’ve had.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db13-complete',
      lines: [
        GH('I can’t stay, Goku. But I’ll watch. Be good. Be kind. And give that four-star ball my love.', 'soft'),
        N('He fades at sunset. Baba looks into her crystal ball and points: the last Dragon Ball is in Emperor Pilaf’s pocket.'),
        PI('Not again! No! Not the monkey again!', 'shock'),
        N('Seven Dragon Balls. Shenron rises over Korin’s land, black sky, green coils, gold eyes.'),
        SR('Seven gathered. Speak.'),
        N('Goku holds the four-star ball a moment longer than he needs to. Once he wishes, it flies off to the far side of the world again.'),
        G('Grandpa said give it his love. I think this is how. Shenron, bring Bora back. Upa’s dad. Please.', 'soft'),
        N('Bora sits up by his own grave, puzzled and alive. Upa crashes into him so hard they both fall over.'),
        BO('Thank you, boy. And thank you, little ones. I heard you, I think, from very far off.', 'soft'),
        N('The balls rise, turn grey, and scatter across the world. The first set of seven is spent, and well spent.'),
      ],
    },
    rewards: [
      { id: 'mv-db13-set', kind: 'flag', label: 'First Set of Seven', description: 'You gathered all seven Dragon Balls with Goku. Their wish brought back Bora.' },
      { id: 'mv-db13-photo', kind: 'decor', label: 'Grandpa Gohan’s Photo', description: 'A small framed photo of an old man with a white beard. Your Nubbins put fruit in front of it sometimes.' },
    ],
    sets: { 'mv-db13': true, 'mv-db-balls': 7, 'mv-db-set1': true, 'mv-db-bora': 'revived' },
    notes:
      'Completes the first set: `mv-db-balls` = 7, `mv-db-set1` = true. The wish brings back Bora (brief). Baba’s fighters (Fangs, the Invisible Man, the Mummy, Spike the Devil Man) can be one four-bout gauntlet; Krillin, Yamcha and Upa fought some of them in the source, compressed here. The masked fighter is Grandpa Gohan with his halo, back for one day; the bout is a scripted `finish`. Gohan’s line about the tail is a callback, not a source quote. The last ball turning up with Pilaf is from memory; check the chapter (if wrong, keep Pilaf as a comic cameo and move the ball to wherever the source puts it). Chapters checked from memory: ch. 96–112 (1987).',
  },

  // ------------------------------------------------------------------ DB14
  {
    id: 'mv-db14',
    code: 'DB14',
    title: 'The 22nd Budokai',
    source: 'Dragon Ball, chapters 113–135 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB13, Fortuneteller Baba' },
    requires: ['DB13'],
    speakers: [GOKU, KRILLIN, YAMCHA, ROSHI, TIEN, CHIAOTZU, CRANE, ANNOUNCER],
    steps: [
      {
        id: 'mv-db14-s1',
        goal: 'Meet the Crane School at the 22nd Tournament.',
        hint: 'Talk to the Crane Hermit in the courtyard. Keep your Nubbins away from the small pale boy; he can see into heads.',
        check: 'talk:mv-crane-hermit',
        scene: {
          id: 'mv-db14-crane',
          lines: [
            N('Three years on, Papaya Island again. Goku is taller, Krillin braver, and Yamcha has a new haircut he is sure about.'),
            N('In the courtyard stands an old man in a crane hat, and with him two students in green.'),
            CR('Turtle Hermit. You look old. Older than me, which is impressive, since we started together.', 'happy'),
            RO('Crane Hermit. You look exactly as trustworthy as you always did.'),
            CR('Still teaching milk rounds, Roshi? My boys can stop a heart with one finger.'),
            RO('Lovely. And who brings them their milk? Hm? Nobody. Their bones must be terrible.'),
            N('The tall student has three eyes and no hair. The small one has white skin, red cheeks, and very still eyes.'),
            TI('Tien. This is Chiaotzu. We are here to break the Turtle School. Not to win. To break it.'),
            CZ('Your little friend is thinking about cake. I can hear it. It’s very loud about cake.', 'happy'),
            N('Your Nubbin covers its head with both paws. It does not help; it was thinking about cake.'),
          ],
        },
        done: {
          id: 'mv-db14-crane-done',
          lines: [
            N('In the first round, Tien breaks Yamcha’s leg on purpose, after the bout is already won. The crowd goes quiet.'),
            YA('I’m fine. I’m fine. Don’t look at me like that, Puar. I’m fine.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-db14-s2',
        goal: 'Get Krillin through his bout with Chiaotzu.',
        hint: 'A karate bout against a mind-reader. Krillin’s trick: think about one thing and do another. Ask a sum.',
        check: 'karate:win:mv-chiaotzu',
        scene: {
          id: 'mv-db14-krillin',
          lines: [
            KR('He reads every move before I make it. Every move. Goku, he reads my thoughts.', 'shock'),
            G('So think something else. Something hard.', 'think'),
            KR('Like what?'),
            N('Your Nubbin, still hiding its own thoughts, holds up a paw with fingers… then another… then takes some away.'),
            KR('Sums. He’s no good at sums! Chiaotzu! What’s seven take away three, times two?', 'happy'),
            CZ('That’s… um. That’s not fair. Seven. Take away. Hold on, I’m counting on my fingers.', 'shock'),
            N('While Chiaotzu counts, Krillin walks over and pushes him gently out of the ring.'),
            CR('Pathetic! I trained you to kill, and you lose to arithmetic!', 'angry'),
          ],
        },
        done: {
          id: 'mv-db14-krillin-done',
          lines: [
            YA('That’s my school! Well, it’s not my school. But I sat near it! Go on, Krillin!', 'happy'),
            N('Yamcha is cheering from a stretcher. Puar waves Yamcha’s crutch about for him, since he isn’t allowed to.'),
            KR('I won. With sums. Mum always said maths would save my life one day, and I never once believed her.', 'happy'),
            CZ('…It was eight. I got there in the end. It was eight.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-db14-s3',
        goal: 'Stand by Goku in the final against Tien.',
        hint: 'A full karate final. You may lose. Watch for the moment Tien chooses.',
        check: 'karate:finish:mv-tien-final',
        scene: {
          id: 'mv-db14-final',
          lines: [
            N('Tien beats Jackie Chun in the semi-final, and Jackie Chun says something quiet to him afterwards. Tien looks thoughtful.'),
            N('Then the final: Goku against Tien. They are evenly matched, and both of them are starting to enjoy it.'),
            TI('Your school is soft. But you’re not. I don’t understand that.', 'think'),
            G('Master Roshi says fight to get better, not to beat people. It’s more fun this way. Isn’t it more fun?', 'happy'),
            N('Tien’s answer is to flare like a second sun. The arena goes white, and Goku staggers about, blinking, punching a pillar.'),
            N('Your Nubbin snatches the sunglasses off Roshi’s nose and flings them into the ring. Goku puts them on upside down. It works anyway.'),
            RO('My sunglasses! Those have seen two wars and a wedding!', 'shock'),
            N('In the stands, the Crane Hermit nods to Chiaotzu. Chiaotzu frowns, then closes his eyes and points.'),
            N('Goku freezes mid-step, stuck like a fly in amber. Tien, about to strike, sees the frozen boy, and stops.'),
            TI('Chiaotzu. Let him go.', 'angry'),
            CR('Finish him, Tien! That’s an order!', 'angry'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout to Tien: “Win it properly!”',
              set: { 'mv-db-tien': 'shouted' },
              then: [
                TI('Yes. Properly. Or not at all.'),
                N('Tien turns his back on the stand where his master sits. Chiaotzu opens his eyes, and Goku can move.'),
              ],
            },
            {
              id: 'chiaotzu',
              label: 'Send your Nubbin to sit beside Chiaotzu.',
              set: { 'mv-db-tien': 'chiaotzu' },
              then: [
                N('Your Nubbin climbs into the seat beside Chiaotzu and thinks, very loudly, about the two of them sharing a cake.'),
                CZ('…That’s nice. Tien? Tien, I don’t want to do this.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db14-final-done',
          lines: [
            N('Tien quits the Crane School in front of the whole crowd, and the Crane Hermit storms off. Chiaotzu stays with Tien.'),
            N('The final ends in the air, both men falling out of the ring at once. Goku’s foot touches the grass a breath first.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db14-complete',
      lines: [
        AN('Your winner and champion of the 22nd Tournament: Tien!'),
        G('Aww! So close! You were amazing! Can we do it again?', 'happy'),
        TI('You made me want to fight honestly. I didn’t know I could. Thank you, Goku.', 'soft'),
        RO('Well. Two of my students in the semi-finals, one in the final, and a defector from the other side. Not bad.', 'happy'),
        CZ('Goku’s friend? Your little one can come and visit. It thinks good thoughts. Mostly cake.', 'happy'),
        N('That night everybody eats at a long table, the Turtle School and the former Crane students side by side.'),
        KR('I’ll go back for your bag, Goku. You left it in the changing room. Back in a minute.', 'happy'),
      ],
    },
    rewards: [
      { id: 'mv-db14-cake', kind: 'decor', label: 'Cake for Two', description: 'A small round cake on a stand, with two forks. Your Nubbins always share it.' },
      { id: 'mv-db14-title', kind: 'title', label: 'Good Thoughts', description: 'For the Nubbin whose thoughts Chiaotzu called “mostly cake”.' },
    ],
    sets: { 'mv-db14': true, 'mv-db-tien-honour': true },
    notes:
      'Tien turns on the Crane Hermit and wins the final by a hair, as in the source; the karate check is `finish`. Yamcha’s broken leg: show the bout end, then Yamcha on a stretcher, no break shown. Krillin beats Chiaotzu with a sum (source gag; the sum itself is ours). In the final Tien uses his blinding flash and Goku counters with Roshi’s sunglasses (source; in our version a Nubbin throws them, and they are the Crooked Sunglasses Roshi wears to his death in DB16). Jackie Chun loses to Tien in the semi and advises him; Roshi then retires Jackie for good. Krillin’s last line here sets up his death in DB15; the implementer should make sure he walks off screen alone, back to the arena, under the long-table lanterns. `mv-db-tien` records how the Keeper reached Tien; `mv-db-tien-honour` marks his turn for E4 either way. Chapters checked from memory: ch. 113–135 (1987–88).',
  },

  // ------------------------------------------------------------------ DB15
  {
    id: 'mv-db15',
    code: 'DB15',
    title: 'Tambourine',
    source: 'Dragon Ball, chapters 136–140 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB14, The 22nd Budokai' },
    requires: ['DB14'],
    speakers: [GOKU, ROSHI, TAMBOURINE, YAJIROBE, PICCOLO],
    steps: [
      {
        id: 'mv-db15-s1',
        goal: 'Find out why Krillin hasn’t come back.',
        hint: 'Go back to the arena with Goku. It’s a short walk, and the longest in the line.',
        check: 'expedition:complete:mv-arena-at-night',
        scene: {
          id: 'mv-db15-arena',
          lines: [
            N('An hour passes and Krillin doesn’t come back. Goku gets up from the long table to go and look, with you beside him.'),
            N('The arena is dark and the changing-room door hangs open. Goku’s bag is on the floor, its four-star ball gone.'),
            N('Krillin is lying in the doorway. He isn’t moving, and he isn’t going to.'),
            G('Krillin? Krillin. Get up. Come on. Get up, it’s me.', 'sad'),
            N('Your Nubbins press against Krillin’s side the way they do when one of them is cold. It doesn’t help.'),
            N('On the floor, in Krillin’s hand, is a scrap of paper. A drawing of a symbol: a single character, written like a curse.'),
            RO('Demon clan. The mark of the demon king. I thought… I hoped that was finished, long before your time.', 'sad'),
            G('Who did this. Tell me who did this.', 'angry'),
          ],
          choices: [
            {
              id: 'go',
              label: '“Go. We’re with you.”',
              set: { 'mv-db-krillin-vow': 'go' },
              then: [
                N('Goku calls Nimbus, and your Nubbins jump on behind him without being asked. Their faces are set.'),
                G('Look after him, Master. I’ll be back.', 'angry'),
              ],
            },
            {
              id: 'stay',
              label: 'Sit with Goku by Krillin for one minute first.',
              set: { 'mv-db-krillin-vow': 'stayed' },
              then: [
                N('For one minute Goku holds his friend’s hand, and nobody says anything. Then he stands, and calls Nimbus.'),
                G('He was going to get my bag. He was just going to get my bag.', 'sad'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-db15-s2',
        goal: 'Catch the demon who killed Krillin.',
        hint: 'A karate bout. Goku is exhausted from the final; Yajirobe’s food helps if you share it out first.',
        check: 'karate:win:mv-tambourine',
        scene: {
          id: 'mv-db15-tambourine',
          lines: [
            N('Nimbus flies all night. At dawn, over a forest, a winged demon is flying the other way, humming.'),
            TB('Ah. The friend of the bald one. You’ve come to join him? How thoughtful.', 'happy'),
            N('Goku is tired, and the demon is fast. Goku loses the first exchange, and the second, and falls into a clearing.'),
            N('In the clearing sits a round young man with a sword, eating a whole roast fish.'),
            YJ('Oi. Whoever’s falling out of the sky, don’t land on my breakfast. I’m Yajirobe. I don’t share.'),
            G('Please. I need to eat something. I need to win.', 'sad'),
            YJ('…Fine. Half. Not that half. That half.'),
            N('Your Nubbins drag over the rest of the fish while Yajirobe isn’t looking. He is looking, and he lets them.'),
          ],
        },
        done: {
          id: 'mv-db15-tambourine-done',
          lines: [
            N('Fed, Goku goes back up, and the demon laughs once. Then a blue beam takes him out of the sky, and he doesn’t laugh again.'),
            G('That was for Krillin.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-db15-s3',
        goal: 'Stand against King Piccolo.',
        hint: 'A bout you cannot win yet. Survive it, and protect Goku when he falls.',
        check: 'karate:finish:mv-king-piccolo-first',
        scene: {
          id: 'mv-db15-king',
          lines: [
            N('An airship lands in the clearing. Down the ramp walks an old, green, tall figure in a cape, leaning on a cane.'),
            KP('Tambourine was one of my children. You broke him. I made him, and you broke him.', 'angry'),
            G('He killed my friend.'),
            KP('Then we are both grieving, boy. But only one of us is the Demon King. Piccolo. Remember the name for the little time you have.'),
            N('Goku fires a Kamehameha. King Piccolo takes it full in the chest, brushes the soot off, and smiles.'),
            YJ('Right. I’m off. Nice meeting you. Don’t die. Well, you probably will. Sorry.', 'shock'),
            N('Your Nubbins stand in front of Goku.'),
            N('They are very small. They do not move.'),
          ],
        },
        done: {
          id: 'mv-db15-king-done',
          lines: [
            N('King Piccolo breaks Goku in four moves. Then he blasts Nimbus out of the sky in a burst of yellow cloud.'),
            KP('Leave him for the crows. Find me the rest of the martial artists. All of them.'),
            N('When the airship is gone, Yajirobe comes back out of the bushes, heaves Goku over his shoulder, and starts walking.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db15-complete',
      lines: [
        YJ('I’m only carrying you because your little round ones keep biting my ankles. That’s the only reason.', 'angry'),
        N('Yajirobe walks for a day with Goku on his back. Your Nubbins walk ahead, finding the path.'),
        N('He’s going to a white tower he lives near, he says, where an old cat at the top keeps beans.'),
        G('Krillin… I’m sorry…', 'sad'),
        N('This was an adventure, and it isn’t any more. Your Nubbins feel it too; they stop playing, and they keep watch.'),
      ],
    },
    rewards: [
      { id: 'mv-db15-headband', kind: 'cosmetic', label: 'Black Armband', description: 'A plain black band for any Nubbin, for Krillin. It goes away by itself in DB18.' },
      { id: 'mv-db15-title', kind: 'title', label: 'Ankle Biter', description: 'For the Nubbins that bit Yajirobe’s ankles until he carried Goku to Korin.' },
    ],
    sets: { 'mv-db15': true, 'mv-db-krillin': 'fallen', 'mv-db-nimbus': 'lost' },
    notes:
      'The line turns from adventure to war (brief). Krillin’s death: dark changing room, cut to him lying in the doorway, face turned away; no wound, no blood. The demon symbol is the Ma (魔) character; show the character on paper, no voice. Goku kills Tambourine with a Kamehameha (fade on the flash). King Piccolo breaks Goku off-panel: four quick cut-ins, then Goku on the ground. Nimbus is destroyed; Korin gives a new one in DB17 (`mv-db-nimbus` returns to `restored`). Yajirobe’s cowardice and kindness both stay. In the source Tambourine is sent to kill martial artists and takes the four-star ball from Goku’s bag for King Piccolo’s collection; it is one of the balls Piccolo wishes on in DB16, and does not affect `mv-db-balls` (set one is spent). Chapters checked from memory: ch. 136–140 (1988).',
  },

  // ------------------------------------------------------------------ DB16
  {
    id: 'mv-db16',
    code: 'DB16',
    title: 'King Piccolo',
    source: 'Dragon Ball, chapters 141–160 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB15, Tambourine' },
    requires: ['DB15'],
    speakers: [ROSHI, TIEN, CHIAOTZU, PICCOLO, SHENRON],
    steps: [
      {
        id: 'mv-db16-s1',
        goal: 'Stand with Master Roshi when he tries to seal King Piccolo.',
        hint: 'An expedition to Piccolo’s camp. Carry the rice cooker; whatever happens, don’t drop it.',
        check: 'expedition:complete:mv-piccolo-camp',
        scene: {
          id: 'mv-db16-roshi',
          lines: [
            N('While Goku lies at Korin’s, Roshi gathers who is left: Tien, Chiaotzu, you, your Nubbins, and an electric rice cooker.'),
            RO('Three hundred years ago, my teacher sealed King Piccolo in a jar. It cost him his life. I know how he did it.', 'think'),
            TI('Then teach me. I’m younger. Let me do it.'),
            RO('You are younger. That is why you will not. Old men are for spending, Tien. You are for afterwards.', 'soft'),
            N('He sets the rice cooker on a rock in front of Piccolo’s camp and pats it like a cat. Then he hands it to your Nubbins.'),
            RO('Little ones. When I say “now”, you put the lid on that and sit on it. Can you do that? Good. Good.'),
            N('King Piccolo steps out of his tent, older than the hills, gathering power for his wish.'),
            KP('The Turtle Hermit. They sent me an antique. How touching.', 'happy'),
            RO('They sent you the only man alive who knows this. Evil… Containment… Wave!', 'angry'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold the rice cooker steady with your Nubbins.',
              set: { 'mv-db-roshi-wave': 'held' },
              then: [
                N('A whirlwind of green light lifts King Piccolo off his feet and drags him, howling, towards the little jar.'),
                N('Your Nubbins hold the cooker with every paw they have. It shakes, and they don’t let go.'),
              ],
            },
            {
              id: 'roshi',
              label: 'Go to Roshi. Steady him.',
              set: { 'mv-db-roshi-wave': 'steadied' },
              then: [
                N('You take the old man’s shoulders; he is shaking like a reed. The whirlwind roars out of his hands.'),
                RO('Good. Hold on. Just… one more… moment…', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db16-roshi-done',
          lines: [
            N('The wave carries Piccolo to the very rim of the jar, and then Roshi’s strength runs out. Piccolo spills back onto the grass.'),
            N('The old man is lying beside the rock, sunglasses crooked, very still. He spent everything, and it was a hand’s breadth short.'),
            TI('Master Roshi. Not my master. But he should have been.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-db16-s2',
        goal: 'Get to the last Dragon Ball before King Piccolo does.',
        hint: 'A race. You won’t win it. Run it anyway; Chiaotzu is running it too.',
        check: 'race:finish:mv-last-ball',
        scene: {
          id: 'mv-db16-race',
          lines: [
            CZ('He has six balls. The seventh is in the hills. If I get there first, I can wish him away. I can, Tien.', 'think'),
            TI('Chiaotzu. No. He’ll see you coming.'),
            CZ('He’ll see me. He won’t see the little ones. Come with me?', 'soft'),
            N('Your Nubbins go with him, low through the grass, Chiaotzu flying a hand’s height above them.'),
            N('Behind you, King Piccolo is following at a walk.'),
            N('He doesn’t need to hurry. He never needs to hurry.'),
            N('The ball is in a cleft in the rock, and Chiaotzu’s hand is on it. Then a shadow falls over all three of them.'),
            KP('You wanted to make a wish, small one. Here is mine.'),
          ],
        },
        done: {
          id: 'mv-db16-race-done',
          lines: [
            N('A flash, and Chiaotzu is gone. Your Nubbins are thrown into the bushes and, by some mercy, overlooked.'),
            N('Far behind, Tien screams his friend’s name across the whole valley.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db16-complete',
      lines: [
        N('Seven balls on the grass, and the sky goes black. Shenron rises, coil on coil.'),
        KP('Give me back my youth. Give me back the strength I had three hundred years ago.'),
        SR('…It is done.'),
        N('King Piccolo stands straight and young and green and terrible. Then he looks up at the dragon, and smiles.'),
        KP('And now, no one will ever wish me away.'),
        N('One blast, and Shenron falls in pieces out of the sky. The seven balls go grey and drop like stones, and stay stones.'),
        N('That night, every radio in the world crackles: King Piccolo announces himself king of the world.'),
        TI('Goku. Wherever you are. Get up.', 'angry'),
      ],
    },
    rewards: [
      { id: 'mv-db16-cooker', kind: 'decor', label: 'Roshi’s Rice Cooker', description: 'A small electric rice cooker with a dented lid. It doesn’t cook. It sits in the Grove where your Nubbins can see it.' },
      { id: 'mv-db16-shades', kind: 'cosmetic', label: 'Crooked Sunglasses', description: 'A pair of Roshi’s sunglasses, a little bent. Wearable by any Nubbin.' },
    ],
    sets: { 'mv-db16': true, 'mv-db-roshi': 'fallen', 'mv-db-chiaotzu': 'fallen', 'mv-db-shenron': 'dead' },
    notes:
      'Roshi dies using the Evil Containment Wave (Mafūba) and missing the jar by a hand’s breadth. In the source his failure has its own cause (check chapters); the hand’s-breadth version is ours. His death: he lies down, sunglasses crooked, no wound. Chiaotzu is killed reaching for the last ball; white flash, then empty grass. Piccolo’s wish for youth and the killing of Shenron follow the source. These balls were gathered by Pilaf and Piccolo, not the party: `mv-db-balls` stays at 7. Shenron’s death turns the balls to stone until DB18 (`mv-db-shenron`). Pilaf’s gang freeing Piccolo can be told in a one-panel flashback if the implementer wants it. Chapters checked from memory: ch. 141–160 (1988).',
  },

  // ------------------------------------------------------------------ DB17
  {
    id: 'mv-db17',
    code: 'DB17',
    title: 'Goku vs. King Piccolo',
    source: 'Dragon Ball, chapters 161–166 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB16, King Piccolo' },
    requires: ['DB16'],
    speakers: [GOKU, KORIN, YAJIROBE, TIEN, PICCOLO],
    steps: [
      {
        id: 'mv-db17-s1',
        goal: 'Watch over Goku while he drinks Korin’s Ultra Divine Water.',
        hint: 'Talk to Korin. The water is real this time, and it is poison. Stay with Goku until it passes.',
        check: 'talk:mv-korin-ultra-water',
        scene: {
          id: 'mv-db17-water',
          lines: [
            N('Top of Korin Tower. Goku is mended with one of Korin’s beans, furious, and not strong enough, and he knows it.'),
            G('There has to be something. Korin. There has to be something stronger than chasing you.', 'angry'),
            KO('There is. The Ultra Divine Water. It is not water. It is poison.', 'think'),
            KO('It will either kill you or wake up everything you have in you. Most die. One survived. That was a long time ago.'),
            YJ('Don’t drink it. You’re an idiot. Don’t drink it.', 'shock'),
            G('If I don’t, Piccolo wins. Then everyone gets hurt. Sorry, Yajirobe.'),
            N('He drinks. He goes stiff, then grey, then he falls and doesn’t breathe properly for a long, long time.'),
            KO('Now we wait. Talk to him. The dying sometimes find their way back by a voice.'),
          ],
          choices: [
            {
              id: 'talk',
              label: 'Talk to him. About Krillin, Roshi, everyone.',
              set: { 'mv-db-ultra-water': 'voice' },
              then: [
                N('You talk for hours: the milk round, the shark, Upa’s beginner spear, Bulma’s dress in the river.'),
                N('Near dawn, Goku laughs in his sleep. Korin raises an eyebrow.'),
              ],
            },
            {
              id: 'nubbins',
              label: 'Let the Nubbins curl up against him.',
              set: { 'mv-db-ultra-water': 'nubbins' },
              then: [
                N('Your Nubbins curl into his arms and his neck, the way they do on cold nights. They hum all night without stopping.'),
                YJ('…That’s actually quite nice. Don’t tell anyone I said that.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db17-water-done',
          lines: [
            N('Goku opens his eyes, and something has changed behind them. He sits up, and the tower creaks under him.'),
            KO('Well. Make that two survivors. And here. A new cloud. I keep spares.'),
          ],
        },
      },
      {
        id: 'mv-db17-s2',
        goal: 'Get through King Piccolo’s son at the gates of King Castle.',
        hint: 'A short karate bout. Goku only needs one punch now. Make it count.',
        check: 'karate:win:mv-drum',
        scene: {
          id: 'mv-db17-castle',
          lines: [
            N('King Castle is the capital, and Piccolo sits on its throne. The king of the world, the real one, is his prisoner.'),
            N('At the gate stands another of Piccolo’s children, a huge pink-and-green brute with spikes on his shoulders.'),
            N('Tien is on the ground in front of him, holding his ribs, and getting up again, and being knocked down again.'),
            TI('Goku. Took you long enough. I thought I’d have to do it all myself.', 'happy'),
            G('Rest, Tien. I’ve got this.'),
            N('The brute swings, and Goku catches the fist.'),
            N('One punch back, and the brute is not there any more.'),
            N('On the balcony above, King Piccolo stands up, and for the first time in three hundred years he looks interested.'),
          ],
        },
      },
      {
        id: 'mv-db17-s3',
        goal: 'Fight King Piccolo for the world.',
        hint: 'The line’s hardest karate bout. When Goku’s arms are gone, use what’s left: a Kamehameha fired backwards.',
        check: 'karate:win:mv-king-piccolo',
        scene: {
          id: 'mv-db17-final',
          lines: [
            KP('The monkey boy. I broke you. You should have stayed broken.', 'angry'),
            G('I got better.'),
            N('They fight across the city; roofs fall in and the palace bells ring by themselves. Your Nubbins stay with Tien and the king.'),
            N('Piccolo breaks Goku’s arm, then his leg. Goku fights on one leg and one arm, and it is still not over.'),
            KP('Enough! If you won’t lie down, then the city will. Everyone in it.', 'angry'),
            N('He raises his hands to the sky. Your Nubbins stand up on the rubble where everyone can see them.'),
            G('Little ones! Get everybody down!', 'angry'),
            N('Goku points his one good hand at the ground behind him. He fires a Kamehameha into it, and himself into the air.'),
          ],
          choices: [
            {
              id: 'cover',
              label: 'Get the people under cover with your Nubbins.',
              set: { 'mv-db-piccolo-fight': 'cover' },
              then: [
                N('You and your Nubbins pull people behind walls, under carts, down cellar steps. Every second counts.'),
                N('One grandmother will not leave her cabbages. Your Nubbins carry the cabbages down the cellar steps, and she follows them.'),
              ],
            },
            {
              id: 'shout',
              label: 'Shout Goku’s name, loud enough to carry.',
              set: { 'mv-db-piccolo-fight': 'shout' },
              then: [
                N('You shout, and the whole city shouts with you. Piccolo’s head turns, just for a heartbeat.'),
                N('A heartbeat is all a boy flying on his own Kamehameha needs.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db17-final-done',
          lines: [
            N('Goku flies through the air like a thrown stone, fist first, and goes straight through King Piccolo.'),
            N('Piccolo stands for a moment with a hole in him where his heart would be. Then he begins to come apart.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db17-complete',
      lines: [
        KP('You think you have won, monkey. You have only made me an orphan’s father.', 'angry'),
        N('With his last breath, King Piccolo spits out an egg. It cracks a little as it flies, out over the walls, towards the mountains.'),
        N('Then the Demon King is dust on the wind, and the city is quiet.'),
        TI('He’s gone. Goku, he’s gone.', 'soft'),
        N('Goku lies on the rubble with both arms broken, grinning at the sky. Your Nubbins sit on his chest so he doesn’t try to get up.'),
        G('Krillin’d have loved that. That was a good one.', 'sad'),
        YJ('Here. Bean. I found it in my pocket. I definitely did not keep one back for myself.'),
      ],
    },
    rewards: [
      { id: 'mv-db17-title', kind: 'title', label: 'Demon Breaker', description: 'For Nubbins that stood on the rubble of King Castle in front of the Demon King.' },
      { id: 'mv-db17-cloud', kind: 'decor', label: 'Little Cloud Cushion', description: 'A soft yellow cushion shaped like Nimbus. Nubbins nap on it and drift a little.' },
    ],
    sets: { 'mv-db17': true, 'mv-db-nimbus': 'restored', 'mv-db-piccolo-egg': true },
    notes:
      'Goku’s victory: fired by a backwards Kamehameha, he punches through King Piccolo (source). Broken limbs implied by Goku’s posture, never shown bending. Piccolo’s death is a fade to dust; no gore. The egg holding his son flies off: `mv-db-piccolo-egg` sets up Ma Junior (DB20) and E4. The brute at the gate is Drum, one of Piccolo’s children; name it on the karate screen only. Yajirobe killed Cymbal off-screen in the source; leave it out. Korin’s spare Nimbus replaces the one destroyed in DB15. Chapters checked from memory: ch. 161–166 (1988).',
  },

  // ------------------------------------------------------------------ DB18
  {
    id: 'mv-db18',
    code: 'DB18',
    title: 'Kami’s Lookout',
    source: 'Dragon Ball, chapters 167–180 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB17, Goku vs. King Piccolo' },
    requires: ['DB17'],
    speakers: [GOKU, KORIN, POPO, KAMI, SHENRON, KRILLIN, BULMA],
    steps: [
      {
        id: 'mv-db18-s1',
        goal: 'Climb from the top of Korin Tower to Kami’s Lookout.',
        hint: 'A climbing race up Goku’s staff, set in the hole in Korin’s ceiling. It reaches. Don’t look down.',
        check: 'race:finish:mv-lookout-climb',
        scene: {
          id: 'mv-db18-staff',
          lines: [
            G('Korin. The dragon’s dead. Krillin can’t come back. Nobody can come back. Is there anybody who can fix the dragon?', 'sad'),
            KO('There is the one who made him. Kami, the guardian of the Earth. He lives above us.', 'think'),
            G('Above? There’s nothing above. Just sky.'),
            KO('Your staff. The one your grandfather gave you. It was mine before it was his. Put it in that hole in my ceiling.'),
            N('Goku sets the end of his staff in a socket in Korin’s ceiling. It fits as if it was made for it, because it was.'),
            G('Staff! Get long! Longer than ever!', 'happy'),
            N('The staff stretches up, and up, through cloud, until it touches the bottom of something enormous hanging in the sky.'),
            KO('Climb. Take the small ones. Kami is fond of small things.'),
          ],
        },
        done: {
          id: 'mv-db18-staff-done',
          lines: [
            N('At the top, a white palace sits on a dish in the sky. A short, round genie in a turban and waistcoat is watering the flowers.'),
            PO('Hello. I have been waiting. I knew you would come. Please wipe your feet.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-db18-s2',
        goal: 'Ask Kami to bring back Shenron.',
        hint: 'Talk to Kami. He has a secret. Hear him out before you judge him.',
        check: 'talk:kami',
        scene: {
          id: 'mv-db18-kami',
          lines: [
            N('Kami is very old and very green, with antennae and a long robe. Goku freezes at the sight of him.'),
            G('You… you look like him. Like Piccolo.', 'shock'),
            KA('Yes. Once, long ago, he and I were one being. To become Kami, I had to cast out all the evil in me.', 'sad'),
            KA('The evil became King Piccolo. Everything he did was what I put out of myself. Do you understand?'),
            G('So it’s your fault?', 'angry'),
            KA('It is my responsibility. That’s worse. And if he dies, I die. We still share one life.'),
            N('Your Nubbins look from Kami to Goku and back. Then one of them walks over and leans on Kami’s staff.'),
            KA('I made Shenron. I can make him again. I will. It is the least I owe the people he would have saved.', 'soft'),
          ],
          choices: [
            {
              id: 'forgive',
              label: '“You’re trying to fix it. That counts.”',
              set: { 'mv-db-kami': 'forgiven' },
              then: [
                KA('Thank you. I’ve waited three hundred years for someone to say that, and it’s a Keeper from another world.', 'soft'),
              ],
            },
            {
              id: 'hold',
              label: '“Fix it first. Then we’ll talk.”',
              set: { 'mv-db-kami': 'held-to-account' },
              then: [
                KA('That is fair. That is entirely fair.', 'think'),
                PO('I like this one. This one gets extra tea.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db18-kami-done',
          lines: [
            N('Kami raises his hands. Far below, all over the world, seven grey stones begin to glow orange again.'),
            KA('The balls are scattered, and someone must find them again. But the dragon lives. That much I could mend.', 'soft'),
          ],
        },
      },
      {
        id: 'mv-db18-s3',
        goal: 'Train under Mr. Popo until you land a hit.',
        hint: 'A sparring bout that counts touches, not wins. Nobody beats Mr. Popo. One touch is a triumph.',
        check: 'karate:land-hit:mv-mr-popo',
        scene: {
          id: 'mv-db18-popo',
          lines: [
            PO('Kami says you will train here, Goku. I will teach. First lesson: hit me.', 'happy'),
            G('Hit you? You’re all round and little. I don’t want to hurt you.'),
            PO('I am not worried.'),
            N('Goku swings. Mr. Popo is on the other side of him, watering a rose.'),
            N('Goku, who beat King Piccolo, swings for an hour and touches nothing. Your Nubbins don’t touch anything either.'),
            PO('You fight with your fists, Goku. Fight with everything. Ears. Nose. Feet. The little ones already do.'),
            G('The little ones? They’re just… oh. They’re watching where you’re going to be, not where you are.', 'think'),
            PO('I am impressed. A little. Do not let it go to your heads.'),
          ],
        },
        done: {
          id: 'mv-db18-popo-done',
          lines: [
            N('On the fourth day, your smallest Nubbin brushes Mr. Popo’s sleeve with one paw.'),
            N('Mr. Popo bows to it, all the way down.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db18-complete',
      lines: [
        N('Far below, Bulma, Yamcha and Oolong race the world with a radar, gathering the glowing balls one by one.'),
        N('From the edge of the Lookout you watch a column of green rise out of a city park. Shenron is back.'),
        BU('Shenron! Bring back everyone King Piccolo and his demons killed! All of them! Every last one!', 'happy'),
        SR('It is a large wish. I have been dead a while. I will allow it.'),
        N('In a changing room on Papaya Island, a bald boy sits up and asks where everyone went.'),
        KR('Goku? Goku, are you up there? Bulma says you’re in the sky. Of course you are. Come down when you’re done!', 'happy'),
        N('Goku doesn’t say anything for a long time. He just sits at the edge of the Lookout and grins, and cries, and grins.'),
        KA('Three years until the next tournament. You will spend them here, and on the road. You have a long way to go yet.'),
      ],
    },
    rewards: [
      { id: 'mv-db18-tea', kind: 'item', label: 'Mr. Popo’s Tea', description: 'A tin of tea from the Lookout. A cup calms an anxious Nubbin for a whole day.' },
      { id: 'mv-db18-title', kind: 'title', label: 'Brushed the Sleeve', description: 'For the Nubbin that brushed Mr. Popo’s sleeve. Very few have.' },
      { id: 'mv-db18-garden', kind: 'decor', label: 'Lookout Flowerbed', description: 'A white stone flowerbed from Kami’s palace. Its flowers always face the waterfall.' },
    ],
    sets: { 'mv-db18': true, 'mv-db-shenron': 'restored', 'mv-db-krillin': 'revived', 'mv-db-roshi': 'revived', 'mv-db-chiaotzu': 'revived' },
    notes:
      'Kami restores Shenron; Bulma’s team gathers the balls and wishes back everyone Piccolo and his demons killed (Krillin, Roshi, Chiaotzu and others). Those balls are Bulma’s gathering, not the party’s: `mv-db-balls` stays at 7, and they turn to stone for a year after the wish, which is why set two starts partway through DB19. Goku’s staff fits Korin’s ceiling and reaches the Lookout (source). The DB15 Black Armband reward disappears from the wardrobe here. Mr. Popo: render with care. The source design is a blackface caricature; use the game’s own respectful redesign (blue-skinned genie, turban, waistcoat), as several later releases do. He speaks in the first person with quiet authority, never the source’s servile third-person speech. Kami and Piccolo share one life (needed for E4). Chapters checked from memory: ch. 167–180 (1988–89).',
  },

  // ------------------------------------------------------------------ DB19
  {
    id: 'mv-db19',
    code: 'DB19',
    title: 'Three Years',
    source: 'Dragon Ball, chapters 181–188 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB18, Kami’s Lookout' },
    requires: ['DB18'],
    speakers: [GOKU, TIEN, YAMCHA, CHIAOTZU, KAMI, BULMA],
    steps: [
      {
        id: 'mv-db19-s1',
        goal: 'Learn to fly Nimbus on your own.',
        hint: 'A flying race, Nubbins only. Lean to turn, sit back to slow. The cloud wants you to do well.',
        check: 'race:finish:mv-nimbus-solo:fly',
        scene: {
          id: 'mv-db19-nimbus',
          lines: [
            N('Goku leaves the Lookout with a backpack and no plan. Kami says to see the world, and Goku intends to see all of it.'),
            G('Little ones. You’ve ridden Nimbus a hundred times. I think it’s time you drove.', 'happy'),
            N('Nimbus dips down in front of your Nubbins and waits. It is the waiting of a big friendly dog with a ball.'),
            G('Lean that way to go that way. Sit back to stop. If you fall off, it catches you. Usually.'),
            Y('Usually?'),
            G('It caught me every time but one. The one time was a really good lesson.', 'happy'),
            N('Your bravest Nubbin climbs on alone. The cloud lifts it gently, then a bit less gently, then whoosh.'),
            N('It loops a tree, screaming with joy. The others are already climbing on behind it.'),
          ],
        },
        done: {
          id: 'mv-db19-nimbus-done',
          lines: [
            N('By sunset your Nubbins can fly Nimbus over the treetops, through a waterfall, and back to Goku’s hand.'),
            G('See? Pure hearts. Told you. Best drivers in the world.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-db19-s2',
        goal: 'Travel the world with Goku, and gather Dragon Balls on the way.',
        hint: 'A long expedition in stages. The radar Bulma gave you finds the balls once they wake from stone. Fly between stops.',
        check: 'expedition:complete:mv-three-years-road',
        scene: {
          id: 'mv-db19-road',
          lines: [
            N('A year on the road. Goku works for his meals: wood-chopping, river-ferrying, wrestling a bear for a village bet.'),
            N('In the second spring a capsule-copter lands in a turnip field beside you. Bulma climbs out, and the farmer faints.'),
            BU('Here. A new radar. The balls woke up this morning, one year since the last wish, on the dot.'),
            BU('Gather them. Not for a wish now. Just, I don’t know. It feels like we’ll need one later. Call it a hunch.', 'think'),
            N('Your Nubbins fly Nimbus ahead to scout, and come back with the radar’s blips marked in mud on a map.'),
            N('A ball in a pond full of frogs. A ball in a pagoda bell.'),
            N('A ball under the pillow of a very old, very cross man.'),
            G('Excuse me, can I borrow your ball? I’ll swap you for… a fish? A rock? A hug?', 'happy'),
            N('The old man takes the hug. He hasn’t had one in a while.'),
          ],
          choices: [
            {
              id: 'keep',
              label: 'Keep the balls safe, in Bulma’s capsule case.',
              set: { 'mv-db-set2-keeping': 'capsule' },
              then: [
                N('The capsule case clicks shut. It weighs almost nothing, which is the most unsettling thing about it.'),
              ],
            },
            {
              id: 'nubbins',
              label: 'Let your Nubbins carry them, one each, turn and turn about.',
              set: { 'mv-db-set2-keeping': 'nubbins' },
              then: [
                N('Your Nubbins take it in turns to hold a ball through the night. Whoever is holding one sleeps best.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db19-road-done',
          lines: [
            N('Five Dragon Balls by the end of the second year.'),
            N('Goku forgets about them for weeks at a time. Your Nubbins never do.'),
          ],
        },
      },
      {
        id: 'mv-db19-s3',
        goal: 'Visit Tien, Yamcha and Chiaotzu training on the Lookout.',
        hint: 'Fly Nimbus up to Kami’s palace. Talk to Tien. Watch Yamcha try to land a hit on Mr. Popo; it is very good for morale.',
        check: 'talk:mv-tien-lookout',
        scene: {
          id: 'mv-db19-lookout',
          lines: [
            N('Your Nubbins fly you up to the Lookout on Nimbus.'),
            N('You do not fall through. You are sitting in their lap, and it counts.'),
            N('Tien is meditating on one finger, and Chiaotzu floats beside him. Yamcha is lying flat on the tiles, panting.'),
            YA('Popo. That man. That man is made of air and spite. I touched his hat once. I’m going to put it on my gravestone.', 'sad'),
            TI('Kami took us in after Goku left. He says something is coming at the next tournament. Something he fears.', 'think'),
            CZ('He won’t say what. He keeps looking at the mountains where the egg went.', 'think'),
            KA('Tell Goku to be ready. That is all I can say for now. Some secrets I keep because I must, not because I want to.'),
            N('Your Nubbins sit beside Chiaotzu and think about cake. He laughs for the first time in two years.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db19-complete',
      lines: [
        N('Three years. Goku is taller than Yamcha now, and his clothes have been patched more times than they’ve been washed.'),
        G('I think I’m ready. I don’t know for what. But I’m ready.', 'happy'),
        N('Five balls in the capsule case, and two more somewhere. The radar is flickering towards Papaya Island.'),
        G('Little ones, you drive. I want a nap.', 'happy'),
        N('Your Nubbins fly Nimbus south, over the sea, with Goku snoring and you holding the radar. They don’t drop anybody.'),
      ],
    },
    rewards: [
      { id: 'mv-db19-nimbus', kind: 'feature', label: 'Nimbus Flight', description: 'Your Nubbins can fly Nimbus on their own. In the Dragon Ball line, Nimbus becomes a Nubbin-driven mount for travel and races.' },
      { id: 'mv-db19-patches', kind: 'cosmetic', label: 'Road-Patched Gi', description: 'A martial-arts gi patched in seven places. Wearable by any Nubbin.' },
    ],
    sets: { 'mv-db19': true, 'mv-db-balls': 12 },
    notes:
      'Nubbins learn to fly Nimbus (brief requirement); the Keeper rides only as their passenger. Set two begins: five balls gathered, `mv-db-balls` = 12 (7 from set one + 5). The balls wake one year after the DB18 wish, as the source rule goes. Bulma’s hunch to save a wish is our addition, setting up E4. Tien, Yamcha and Chiaotzu train under Kami and Mr. Popo (source). Kami’s unease is about Piccolo’s egg. Chapters checked from memory: ch. 181–188 (1989).',
  },

  // ------------------------------------------------------------------ DB20
  {
    id: 'mv-db20',
    code: 'DB20',
    title: 'The 23rd Budokai Begins',
    source: 'Dragon Ball, chapters 189–194 (approx.)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After DB19, Three Years' },
    requires: ['DB19'],
    speakers: [GOKU, KRILLIN, BULMA, CHICHI, OXKING, SHEN, MAJR, ANNOUNCER],
    steps: [
      {
        id: 'mv-db20-s1',
        goal: 'Meet everyone at Papaya Island for the 23rd Tournament.',
        hint: 'Talk to Krillin by the entrance. Everyone is here. Everyone, and one stranger.',
        check: 'talk:mv-23rd-reunion',
        scene: {
          id: 'mv-db20-arrival',
          lines: [
            N('Papaya Island, the 23rd World Martial Arts Tournament. Goku lands on Nimbus, steered by your Nubbins, and nobody recognises him.'),
            KR('Excuse me, sir, is that… No. Goku? You’re enormous! You’re taller than me! You were always taller than me, but now it’s rude.', 'happy'),
            BU('Look at you! You grew up handsome. That’s annoying. Here. Krillin found you something.', 'happy'),
            KR('Found it in a bakery in a loaf of bread. Didn’t eat it. Thought you’d want it.'),
            N('A Dragon Ball. Six in the capsule case now.'),
            N('Across the courtyard stands a figure in a white cloak and a white turban, very still. People walk around him without knowing why.'),
            MJ('Son Goku. So. You are the one.', 'angry'),
            N('Your Nubbins have stopped, every hair on end. They have felt this once before, in a burned city.'),
          ],
        },
        done: {
          id: 'mv-db20-arrival-done',
          lines: [
            N('He has signed in as Ma Junior, and nobody knows anything about him. Goku looks at him for a long, quiet moment.'),
            G('He feels like Piccolo. A bit. But younger. And… different?', 'think'),
          ],
        },
      },
      {
        id: 'mv-db20-s2',
        goal: 'Get Goku through his bout with the mysterious girl.',
        hint: 'A karate bout with a fighter who knows exactly who Goku is. Win it, then listen to her.',
        check: 'karate:win:mv-chi-chi',
        scene: {
          id: 'mv-db20-chichi',
          lines: [
            N('In the bracket, Goku draws a tall, fierce girl with her hair tied back. She fights like a storm with a grievance.'),
            CC('Do you remember me? Do you? Because I remember you. Every day for years, I remember you!', 'angry'),
            N('Her first kick takes a corner off the ring. The Announcer quietly moves his microphone stand further back.'),
            G('Um. Did I eat your lunch?', 'think'),
            CC('You promised to marry me! On Fire Mountain! Then you flew off on a cloud!', 'angry'),
            N('Your Nubbins look at each other. They were there, and they have been waiting for this for a very long time.'),
            G('Chi-Chi! Oh! I thought marry was food.', 'shock'),
            CC('It is NOT food!'),
            N('Goku wins, gently. She ends up sitting on the stone with him crouched beside her, the crowd silent.'),
          ],
          choices: [
            {
              id: 'nudge',
              label: 'Nudge Goku. A promise is a promise.',
              set: { 'mv-db-chichi': 'nudged' },
              then: [
                G('I said I would. So I will. Chi-Chi, let’s get married. I still don’t really know what it is.', 'happy'),
                CC('I’ll teach you! I’ll teach you everything! Oh, you idiot. You wonderful idiot.', 'soft'),
              ],
            },
            {
              id: 'quiet',
              label: 'Say nothing. Let Goku decide this one himself.',
              set: { 'mv-db-chichi': 'his-choice' },
              then: [
                G('You waited all this time? For me? Nobody ever waited for me. Okay. Yes. Let’s do the marry thing.', 'soft'),
                N('Chi-Chi bursts into tears and the crowd into cheers. The Ox-King bursts through a barrier.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-db20-chichi-done',
          lines: [
            OX('My boy! My son-in-law! Here. A wedding gift. It was in the treasury, under the axes.', 'happy'),
            N('He presses something round and orange into Goku’s hand. The seventh Dragon Ball.'),
          ],
        },
      },
      {
        id: 'mv-db20-s3',
        goal: 'Spar with the quiet stranger called Shen.',
        hint: 'A short test bout. Shen is holding back; so should you. The bell will end it.',
        check: 'karate:finish:mv-shen-spar',
        scene: {
          id: 'mv-db20-shen',
          lines: [
            N('In the warm-up yard, a thin, ordinary-looking man watches Goku train. He has a gentle face and old, old eyes.'),
            SN('Your stance is good. Your left guard drops when you’re excited. It was dropping at the Lookout too.', 'happy'),
            G('At the… How do you know about the Lookout?', 'shock'),
            SN('I know a lot of things. Shall we see how much you know?'),
            N('They spar. Shen moves like Mr. Popo’s garden: patient, unhurried, impossible to surprise.'),
            N('Your Nubbins sit very still. They know that smell: flowers in white stone pots, and tea.'),
            SN('The little ones have guessed, I think. Don’t tell him yet. He has to find out for himself in the ring.', 'soft'),
            AN('Fighters! The main tournament begins in ten minutes!'),
          ],
        },
        done: {
          id: 'mv-db20-shen-done',
          lines: [
            SN('Good. Very good. Show me the rest in the ring, in front of everyone.'),
            N('He walks away. In the shade of the temple, the cloaked man turns his head to watch him go.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-db20-complete',
      lines: [
        N('Seven Dragon Balls glow in the capsule case. Your Nubbins open it a crack to look, and close it again.'),
        BU('Seven. Two whole sets, you lot. Don’t spend it. Not yet. My hunch is getting louder.', 'think'),
        N('The bracket goes up on the wall: Goku, Chi-Chi, Tien, Mercenary Tao, Krillin, Yamcha, a man called Shen, and a cloaked fighter called Ma Junior.'),
        CC('You’re going to win, and then we’re getting married. In that order. Don’t lose.', 'happy'),
        G('I never lose on purpose. Only by accident.', 'happy'),
        MJ('Enjoy it while you can, Son Goku. My father waited three hundred years. I have waited three.', 'angry'),
        N('Your Nubbins claim front-row seats on top of the Announcer’s microphone stand. He lets them. He has met Goku before.'),
        N('The gong sounds, and the 23rd World Martial Arts Tournament begins. With it begins the end of the story.'),
      ],
    },
    rewards: [
      { id: 'mv-db20-set', kind: 'flag', label: 'Second Set of Seven', description: 'All seven Dragon Balls, gathered again. One wish, saved, to spend at the 23rd Budokai or carry on with you.' },
      { id: 'mv-db20-lantern', kind: 'decor', label: 'Ox-King’s Wedding Lantern', description: 'A huge red lantern from the Ox-King, for Goku’s wedding. He sent you one too. He insisted.' },
      { id: 'mv-db20-line', kind: 'flag', label: 'Dragon Ball Line Complete', description: 'Completes the Dragon Ball line (DB1–DB20) and opens the 23rd Budokai (E4).' },
    ],
    sets: { 'mv-db20': true, 'mv-db-balls': 14, 'mv-db-set2': true, 'mv-db-wish': 'ready', 'mv-db-complete': true },
    notes:
      'Completes the line and the second set: `mv-db-balls` = 14, `mv-db-set2` = true, `mv-db-wish` = `ready`. E4 offers the wish choice (spend now, or save as `wish = saved` for the final endgame). Ball six comes from Krillin, ball seven from the Ox-King’s treasury; both are our adaptation (the source has no ball hunt here). Chi-Chi bout: in the source she fights Goku in the first round of the main tournament; the brief puts it in the preliminaries, and the step is staged as a prelim bout. Goku’s proposal pays off `mv-db-chichi-promise` from DB4. Shen is Kami in a borrowed body; this spar is his only bout with Goku. In E4, as in the source, Shen beats Yamcha and fights Ma Junior, and Goku’s semi-final is against Tien. Ma Junior is Piccolo Jr.; he is never named Piccolo here. Chapters checked from memory: ch. 189–194 (1989).',
  },
];

// ------------------------------------------------------------------ payoff variants

/** Every scene of a quest list, flat. */
const scenesOf = (quests: Quest[]): Scene[] =>
  quests.flatMap((q) => [...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]), q.complete]);

/**
 * A payoff variant: the base scene with `count` lines from index `at` replaced by `extra`.
 * Choices and `set` carry over unchanged. The runner (sim/atlas.ts, variantFor) plays it in
 * place of the base scene when this line's flags hold the value named by `suffix`, so each
 * suffix must be a value only the signature flag ever takes.
 */
function payoff(quests: Quest[], baseId: string, suffix: string, at: number, count: number, extra: Line[]): Scene {
  const base = scenesOf(quests).find((s) => s.id === baseId);
  if (!base) throw new Error(`payoff: no scene ${baseId}`);
  const lines = [...base.lines];
  lines.splice(at, count, ...extra);
  return { ...base, id: `${baseId}-${suffix}`, lines };
}

/** The DB1 hut deal (mv-db-goku-deal) paid off in DB7, DB13 and DB19. */
export const MV_DRAGONBALL_VARIANTS: Scene[] = [
  // DB7: how Bulma hands over the radar and the four-star (replaces the two hand-over lines).
  payoff(MV_DRAGONBALL, 'mv-db07-complete', 'deal-truth', 7, 2, [
    BU('Goku, here. A radar, all yours. I said I’d borrow the ball once, and I did. Deal’s done. Go find your grandpa’s four-star.'),
    N('Your Nubbin checks Bulma’s hands anyway, from habit. Nothing crossed, and it looks almost disappointed.'),
  ]),
  payoff(MV_DRAGONBALL, 'mv-db07-complete', 'deal-pitch', 7, 2, [
    BU('Goku, here. A radar, all yours. I promised you the world and restaurants with more than one fish. You’ve had both.'),
    G('The fish was the best part.', 'happy'),
    BU('I know. Go find your grandpa’s four-star.'),
  ]),
  payoff(MV_DRAGONBALL, 'mv-db07-complete', 'deal-asked', 7, 2, [
    BU('Goku, here. A radar, all yours. You said you wanted to find the strong ones and fight them nicely. Today you found one.'),
    BU('Go find your grandpa’s four-star. The strong ones will keep turning up. They always do, around you.', 'think'),
  ]),
  // DB13: what Goku says to his grandfather's ball before the wish.
  payoff(MV_DRAGONBALL, 'mv-db13-complete', 'deal-truth', 7, 0, [
    G('Bulma borrowed it once, like she said she would. This time it’s my turn, and I know exactly what for.', 'soft'),
  ]),
  payoff(MV_DRAGONBALL, 'mv-db13-complete', 'deal-pitch', 7, 0, [
    G('Bulma said come and see the world. I did. This is the bit of it I wanted most.', 'soft'),
  ]),
  payoff(MV_DRAGONBALL, 'mv-db13-complete', 'deal-asked', 7, 0, [
    G('I said I wanted to find people stronger than me. Grandpa was. Still is, I think.', 'soft'),
  ]),
  // DB19: what Bulma brings with the second radar.
  payoff(MV_DRAGONBALL, 'mv-db19-road', 'deal-truth', 4, 0, [
    G('You kept the deal. One wish, and you gave the ball back. So I’ll carry them for you again.', 'happy'),
    BU('I didn’t say it was for me this time.'),
  ]),
  payoff(MV_DRAGONBALL, 'mv-db19-road', 'deal-pitch', 4, 0, [
    BU('And before you ask: yes, there are restaurants on the way. I checked. Three fish minimum.', 'happy'),
    G('Three! Keeper, did you hear? Three.', 'happy'),
  ]),
  payoff(MV_DRAGONBALL, 'mv-db19-road', 'deal-asked', 4, 0, [
    BU('You said you wanted to find the strong ones. Kami says one is coming to the tournament. Think of this as the route.', 'think'),
    G('Then I’d better be strong by then.', 'think'),
  ]),
];

// ------------------------------------------------------------------ checks

export const CHECKS: string[] = [
  'race:finish:mv-mountain-road',
  'talk:goku',
  'karate:win:mv-pterodactyl',
  'talk:mv-aru-elder',
  'karate:win:mv-oolong-shapes',
  'expedition:complete:mv-oolong-mansion',
  'expedition:complete:mv-diablo-desert',
  'karate:finish:mv-yamcha-duel',
  'talk:puar',
  'expedition:complete:mv-turtle-to-sea',
  'ride:mv-flying-nimbus',
  'karate:learn:kamehameha',
  'expedition:complete:mv-pilaf-castle',
  'race:finish:mv-pilaf-summoning',
  'karate:survive:mv-great-ape',
  'talk:krillin',
  'race:finish:mv-milk-round',
  'expedition:complete:mv-shark-lake:swim',
  'karate:win:mv-21st-prelims',
  'karate:win:mv-21st-main-rounds',
  'karate:finish:mv-jackie-chun',
  'expedition:complete:mv-jingle-village',
  'expedition:complete:mv-muscle-tower',
  'talk:android-8',
  'expedition:complete:mv-pirate-cave:swim',
  'race:finish:mv-penguin-village',
  'talk:upa',
  'karate:finish:mv-mercenary-tao',
  'race:finish:mv-korin-tower:climb',
  'minigame:score:mv-korin-chase:300',
  'karate:win:mv-tao-rematch',
  'expedition:complete:mv-red-ribbon-hq',
  'talk:mv-commander-red',
  'karate:win:mv-black-battle-suit',
  'karate:win:mv-baba-fighters',
  'karate:finish:mv-masked-fighter',
  'talk:mv-crane-hermit',
  'karate:win:mv-chiaotzu',
  'karate:finish:mv-tien-final',
  'expedition:complete:mv-arena-at-night',
  'karate:win:mv-tambourine',
  'karate:finish:mv-king-piccolo-first',
  'expedition:complete:mv-piccolo-camp',
  'race:finish:mv-last-ball',
  'talk:mv-korin-ultra-water',
  'karate:win:mv-drum',
  'karate:win:mv-king-piccolo',
  'race:finish:mv-lookout-climb',
  'talk:kami',
  'karate:land-hit:mv-mr-popo',
  'race:finish:mv-nimbus-solo:fly',
  'expedition:complete:mv-three-years-road',
  'talk:mv-tien-lookout',
  'talk:mv-23rd-reunion',
  'karate:win:mv-chi-chi',
  'karate:finish:mv-shen-spar',
];
