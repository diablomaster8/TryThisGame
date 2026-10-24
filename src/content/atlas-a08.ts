/**
 * Atlas campaign, page A8: The Twelve Tasks (Part L). Fourteen quests, A8-1 to A8-14.
 *
 * SOURCE. The Twelve Tasks of Asterix (Les Douze Travaux d’Astérix), the 1976 animated film by René
 * Goscinny and Albert Uderzo (Studios Idéfix), and its picture-book adaptation. Rights: © Les Éditions
 * Albert René / Goscinny-Uderzo. A LICENCE IS NEEDED TO SHIP THIS PAGE. The character names (the
 * English names of Anthea Bell and Derek Hockridge’s translations), the village, the magic potion and
 * Permit A38 are the source’s. Nothing else is taken: all dialogue is original, and the source’s
 * famous catchphrases are not used. The task order is the verified order in docs/atlas.md
 * (Verses, task 2, before Cilindric, task 3; fix-changelog #133).
 *
 * AUDIENCE. 'all'. There is no lifted text, so there are no childLines. Nobody is hurt: the
 * fights are slapstick, the crocodiles stay in the water, the lions purr, and the ghosts are
 * sulky, not frightening. A Learning Grove version (both bands) is a separate edu file, still to do.
 *
 * FRAME. Nova’s atlas opens at a map of Gaul, painted all in Roman red except one small green dot
 * by the sea. You step in at the green dot (A8-1). Caesar has challenged the village to twelve
 * tasks worthy of Hercules, and the village wants a referee who is neither Roman nor Gaul. A
 * stranger who fell out of a book is the most neutral person anyone can think of. You carry a wax
 * tablet with the tasks numbered I to XII and tick them off. Asterix and Obelix keep their story:
 * they do the tasks, and you watch, carry, measure, and once (A8-9) help. Your Nubbin becomes
 * Dogmatix’s best friend in the first five minutes. Neither of them ever speaks: narration only.
 * Caius Pupus, Caesar’s observer, walks beside you the whole way and slowly comes round.
 *
 * GROVE STATE READ. None. The outline asks for no Grove reads, and this page writes no Grove flag.
 * Hazel is absent from the page itself. Her margin note for this page ("Ha. Typical. Try asking the
 * parish council for a gate hinge. H.") is engine data in S24 (side-stories-s24.ts), shown beside
 * A8-9 once s24Done is set; the page has no margin variant of its own.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a08-):
 *   - a08-01 … a08-14 on each quest; a08-done on A8-14 (atlasDone('A8')).
 *   - a08-form = loop | boar | plain (A8-9, a08-09-form): the signature choice. You design an
 *     impossible form for the clerks of the Place That Sends You Mad, and the silliest wins.
 *     loop and boar are silly enough to win; plain is too sensible. Pays off five quests later,
 *     at the Banquet (A8-14): loop or boar is the form the village ties the bard up with
 *     (a08-14-bard-loop, a08-14-bard-boar); plain is the one Getafix files under "Useful"
 *     (a08-14-useful). Echoed lightly in A8-12 (a08-12-ghosts-done, the ghosts’ complaint).
 *
 * VARIANTS (ATLAS_A08_VARIANTS): a08-14-bard-loop, a08-14-bard-boar, a08-14-useful. Play exactly
 * one, chosen by a08-form, straight after a08-14-tie-done and before a08-14-complete.
 *
 * LIFTED TEXT. None. All dialogue is original. "Permit A38" and "Permit A39" are plot details,
 * not quotations. No song lyrics: the bard’s song is never sung on screen, only threatened.
 *
 * CARE NOTES.
 *   - NATIONAL JOKES stay affectionate and no broader than the comics’ gentlest. Each champion is
 *     good at their thing, proud of it, and a decent loser: Asbestos the Greek runner (proud of
 *     Olympia), Verses the Persian javelin thrower (courteous, names his javelins), Cilindric the
 *     German wrestler (fond of a tidy rule), Iris the Egyptian hypnotist (theatrical), Mannekenpix
 *     the Belgian chef (generous portions). No accents written phonetically; no jokes about
 *     anyone’s looks, faith or history. The Romans are bureaucrats and sore losers, never villains.
 *   - HISTORY. Roman Gaul around 50 BC, after Caesar’s Gallic Wars. The page is a comedy and says
 *     so; Caesar is pompous and in the end a good sport. No battle imagery.
 *   - THE ISLE OF PLEASURE is cakes, cushions, music and a very comfortable sofa, nothing more.
 *     The hostesses are kind, not seductive; the temptation is to stay and rest forever.
 *   - DOGMATIX (source canon) hates to see trees cut down. A8-10 respects it: Obelix uses a tree
 *     that is already fallen.
 *   - Hazel’s third rule is acted once (A8-8, sitting with the Beast), never quoted.
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

const WHERE = 'Nova’s atlas: the Twelve Tasks page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SRC = 'The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976)';

// ------------------------------------------------------------------ speakers

const FILM = 'The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue';
const ASTERIX = sp('a08-asterix', 'Asterix', `Asterix, the small, clever Gaulish warrior, in ${FILM}`);
const OBELIX = sp('a08-obelix', 'Obelix', `Obelix, menhir delivery man, who fell into the potion as a baby, in ${FILM}`);
const GETAFIX = sp('a08-getafix', 'Getafix', `Getafix, the village druid, in ${FILM}`);
const CHIEF = sp('a08-chief', 'Vitalstatistix', `Vitalstatistix, the village chief, in ${FILM}`);
const BARD = sp('a08-bard', 'Cacofonix', `Cacofonix, the village bard, in ${FILM}`);
const CAESAR = sp('a08-caesar', 'Julius Caesar', `Julius Caesar, as drawn in ${FILM}`);
const PUPUS = sp('a08-pupus', 'Caius Pupus', `Caius Pupus, Caesar’s observer who follows the tasks, in ${FILM}`);
const ASBESTOS = sp('a08-asbestos', 'Asbestos', `Asbestos, the Greek Olympic runner, task 1, in ${FILM}`);
const VERSES = sp('a08-verses', 'Verses', `Verses, the Persian javelin champion, task 2, in ${FILM}`);
const CILINDRIC = sp('a08-cilindric', 'Cilindric', `Cilindric, the German wrestler, task 3, in ${FILM}`);
const HOSTESS = sp('a08-hostess', 'The Island’s Hostess', `The priestesses of the Isle of Pleasure, task 4, in ${FILM}`);
const IRIS = sp('a08-iris', 'Iris', `Iris, the Egyptian hypnotist, task 5, in ${FILM}`);
const CHEF = sp('a08-chef', 'Mannekenpix', `Mannekenpix, the Belgian chef, task 6, in ${FILM}`);
const PORTER = sp('a08-porter', 'The Porter', `The porter of the Place That Sends You Mad, task 8, in ${FILM}`);
const CLERK = sp('a08-clerk', 'A Clerk', `The clerks of the Place That Sends You Mad, task 8, in ${FILM}`);
const PREFECT = sp('a08-prefect', 'The Prefect', `The prefect at the top of the Place That Sends You Mad, task 8, in ${FILM}`);
const OLDMAN = sp('a08-oldman', 'The Old Man of the Mountain', `The Old Man of the Mountain, task 10, in ${FILM}`);
const GHOST = sp('a08-ghost', 'A Ghostly Centurion', `The ghosts of the Haunted Plain, task 11, in ${FILM}`);

const N = say('narrator');
const Y = say('you');
const A = say('a08-asterix');
const O = say('a08-obelix');
const G = say('a08-getafix');
const V = say('a08-chief');
const BD = say('a08-bard');
const CS = say('a08-caesar');
const P = say('a08-pupus');
const AS = say('a08-asbestos');
const VE = say('a08-verses');
const CI = say('a08-cilindric');
const H = say('a08-hostess');
const IR = say('a08-iris');
const MK = say('a08-chef');
const PO = say('a08-porter');
const CL = say('a08-clerk');
const PF = say('a08-prefect');
const OM = say('a08-oldman');
const GH = say('a08-ghost');

// ------------------------------------------------------------------ shared pieces

/** Every task's tick on the wax tablet. */
const tick = (numeral: string, what: string): Line =>
  N(`You scratch a tick beside ${numeral} on the wax tablet: ${what}. Pupus looks at it, sighs, and initials it.`);

// =================================================================== THE TWELVE TASKS

export const ATLAS_A08: Quest[] = [
  // ---------------------------------------------------------------- A8-1
  {
    id: 'a08-01',
    code: 'A8-1',
    title: 'Caesar’s Challenge',
    source: `${SRC}: the challenge`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [ASTERIX, OBELIX, CHIEF, GETAFIX, PUPUS],
    steps: [
      {
        id: 'a08-01-s1',
        goal: 'Step into the small green dot on the map of Gaul.',
        hint: 'Everything else on the map is Roman red. Look by the sea, top left.',
        check: 'visit:a08-page:village',
        scene: {
          id: 'a08-01-map',
          lines: [
            N('Nova’s atlas falls open at a map of Gaul, the year about 50 BC. It is painted Roman red from the mountains to the sea.'),
            N('Not quite all of it. Up in the corner, by the sea, there is one small green dot that the red has gone carefully round.'),
            N('Four little Roman camps sit round the dot like cats round a hedgehog, not sure where to start.'),
            N('You put your finger on the green dot. It is warm, and smells faintly of roast boar.'),
            N('Then you are standing in a beech wood, with your Nubbin at your feet and birdsong everywhere.'),
            N('Something small and white shoots out of the bracken, stops nose to nose with your Nubbin, and wags so hard it nearly falls over.'),
            N('It is a very small dog with a black tip to his ear. He and your Nubbin look at each other for a long, serious moment.'),
          ],
          choices: [
            {
              id: 'sniff',
              label: 'Let them work it out.',
              then: [N('They work it out in about two seconds: a lot of circling, one sneeze, and then they are best friends.', 'happy')],
            },
            {
              id: 'crouch',
              label: 'Crouch down and hold out a hand.',
              then: [N('The dog licks your hand once, politely, then goes straight back to your Nubbin. You know your place.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a08-01-map-done',
          lines: [
            N('Two men come crashing through the trees after the dog: one small with a winged helmet, one enormous, with a boar under each arm.'),
            O('Dogmatix! Oh. He’s found a friend. Look, Asterix, a little round friend.', 'happy'),
          ],
        },
      },
      {
        id: 'a08-01-s2',
        goal: 'Go to the village and hear what the Romans want.',
        hint: 'Follow Obelix and the boars. Everyone in the village is in the square.',
        check: 'watch:a08-caesar:challenge',
        scene: {
          id: 'a08-01-square',
          lines: [
            N('The village is round, fenced, and loud. In the square, a chief stands on a shield held up by two men who are clearly tired of holding it.'),
            N('Opposite him is a thin Roman in a very clean toga, holding a scroll and an expression of great patience.'),
            P('I am Caius Pupus, and I bring the words of Julius Caesar. Ahem. Caesar has heard it said in Rome that you Gauls are gods.'),
            P('Caesar does not believe this. Caesar proposes twelve tasks, like the twelve labours of Hercules. Pass them all, and you are gods.'),
            P('Fail one, and you are not gods, and you will kindly become Roman. Like everybody else.'),
            V('Twelve tasks! Ha! We’ll do thirteen. Fourteen, if there’s lunch.', 'happy'),
            A('Who decides whether we’ve passed? Not a Roman. You’d fail us for breathing.'),
            P('And not a Gaul. You would pass yourselves for sneezing.', 'think'),
            N('There is a pause. Every eye in the square slowly turns to the one person who is neither, standing at the back with a Nubbin and a dog.'),
          ],
          choices: [
            {
              id: 'yes',
              label: '“All right. I’ll referee.”',
              then: [V('Splendid! A referee from the land of books. Nobody can say fairer than that.', 'happy')],
            },
            {
              id: 'who',
              label: '“Me? I only came in through a map.”',
              then: [A('Exactly. You don’t owe anybody anything. That’s what makes you fair.'), N('You find you can’t argue with that.')],
            },
          ],
        },
        done: {
          id: 'a08-01-square-done',
          lines: [N('Pupus hands you a wax tablet. Down its side, in neat Roman numerals, it counts from I to XII, and every line is blank.')],
        },
      },
    ],
    complete: {
      id: 'a08-01-complete',
      lines: [
        N('Getafix, the druid, white-bearded and unhurried, stirs a cauldron by his hut. He ladles a flask full for Asterix.'),
        G('The potion, for the tasks. Strength for a while, and not one drop for Obelix.'),
        O('I only want a little bit. A taste.', 'sad'),
        G('You fell in when you were a baby. It’s permanent. You’re the reason I keep a lid on it.'),
        N('Obelix sulks for exactly as long as it takes to remember the boars. Dogmatix and your Nubbin are asleep in a heap by the cauldron.'),
        P('We leave at dawn for task one. I should warn you I have a very good eye for cheating.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a08-01': true },
    notes:
      'OPENING: the map is the page’s own painting, Roman red with one green dot; the four camps are tiny drawn ' +
      'forts. The wax tablet is a UI item from here on: XII lines, ticked one per task (A8-2 to A8-13). Dogmatix ' +
      'follows your Nubbin on every page scene from now on; he never speaks or thinks aloud. Getafix’s potion is ' +
      'shown as a flask and a glow, never as anything like alcohol.',
  },

  // ---------------------------------------------------------------- A8-2
  {
    id: 'a08-02',
    code: 'A8-2',
    title: 'Asbestos',
    source: `${SRC}: task 1, the runner`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-1') },
    requires: ['A8-1'],
    speakers: [ASTERIX, OBELIX, PUPUS, ASBESTOS],
    steps: [
      {
        id: 'a08-02-s1',
        goal: 'Pace out the course and meet the runner.',
        hint: 'Walk from the start stone to the finish post, then talk to Asbestos.',
        check: 'walk:a08-track:course',
        scene: {
          id: 'a08-02-track',
          lines: [
            N('Task one is a race along a straight dirt road, from a stone to a post a long way off. You pace it out, and stop counting.'),
            N('At the start a young man in a short white tunic is stretching. He stretches parts of himself you didn’t know stretched.'),
            AS('Asbestos, of Greece. I have won at Olympia, where the Games began, and where the gods themselves come to watch.', 'happy'),
            AS('We run there every four years, naked as the day we were born. Today, for your sake, I have kept the tunic.'),
            A('Very kind of you.'),
            AS('You will not see me after the start. That is not boasting. It is only a description.'),
            P('The referee will start the race. Referee, please be impartial. I mean, please be quick.', 'think'),
            N('Your Nubbin and Dogmatix are crouched at the start stone as well, bottoms in the air, very serious.'),
          ],
          choices: [
            {
              id: 'let',
              label: 'Let them race too.',
              then: [P('Animals are not in the rules.'), N('You point out that animals are not out of the rules either. Pupus writes that down, crossly.')],
            },
            {
              id: 'hold',
              label: 'Scoop them up out of the way.',
              then: [N('You lift your Nubbin. Dogmatix sits down on your foot, as if that settles it.')],
            },
          ],
        },
        done: {
          id: 'a08-02-track-done',
          lines: [N('You lift your hand. Asbestos goes still as a statue, and Asterix yawns.')],
        },
      },
      {
        id: 'a08-02-s2',
        goal: 'Start the race and see who reaches the post.',
        hint: 'Drop your hand to start. Then watch the road, not Asterix.',
        check: 'race:a08-asbestos:road',
        scene: {
          id: 'a08-02-race',
          lines: [
            N('Your hand drops. Asbestos is a white blur, then a cloud of dust, then a dot.'),
            N('Asterix ambles off the line with his hands behind his back, like a man going to look at the weather.'),
            P('Is he trying?', 'shock'),
            N('Halfway along the road, Asterix stops, uncorks his flask, and has one sip. Then the road is empty where he was.'),
            N('A gust knocks Pupus’s laurel wreath sideways. Down at the far end, two dots become one dot, and then that dot is Asterix.'),
            N('He is not running any more. He is sitting on the finish post, waving, and seems to have had time to eat an apple.'),
            N('Asbestos reaches the post at a speed nobody has ever reached anything, sees Asterix, and keeps going out of pure surprise.'),
          ],
        },
        done: {
          id: 'a08-02-race-done',
          lines: [N('Far away, over the hills, a small white figure is still running. Obelix shades his eyes and watches him go, a little enviously.')],
        },
      },
    ],
    complete: {
      id: 'a08-02-complete',
      lines: [
        tick('I', 'the runner'),
        O('I could have done that. If there’d been a boar at the end.'),
        A('He was very fast. He just wasn’t first.'),
        P('One task. Eleven to go. I have brought a great many spare tablets.', 'think'),
        N('Your Nubbin trots back from the road, very pleased, with Dogmatix. Nobody timed them, but they look as if they won something.'),
      ],
    },
    rewards: [],
    sets: { 'a08-02': true },
    notes:
      'TASK 1 (Asbestos). The race is a short watch scene, not a minigame you can lose; the "race" check passes when the ' +
      'scene ends. Asbestos’s Olympia line seeds the Learning Grove hook (the Games’ Greek origins). His tunic line is a ' +
      'mild historical joke (ancient runners ran naked); he keeps the tunic. Keep Asbestos dignified: he really is the ' +
      'fastest man in the world, and he is a good sport later (A8-13).',
  },

  // ---------------------------------------------------------------- A8-3
  {
    id: 'a08-03',
    code: 'A8-3',
    title: 'Verses',
    source: `${SRC}: task 2, the javelin`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-2') },
    requires: ['A8-2'],
    speakers: [ASTERIX, OBELIX, PUPUS, VERSES],
    steps: [
      {
        id: 'a08-03-s1',
        goal: 'Carry the javelins out to the throwing field.',
        hint: 'There are three javelins on the cart. Carry them one at a time; they are long.',
        check: 'carry:a08-javelins:field',
        scene: {
          id: 'a08-03-field',
          lines: [
            N('Task two is a wide field of short grass with a white line at one end. Beside the line stands a tall man in a beautifully embroidered coat.'),
            VE('Verses, of Persia, at your service. Forgive me if I do not shake hands. These hands are working today.'),
            N('He has three javelins on a cart, each one wrapped in silk. He unwraps them as if he were introducing his children.'),
            VE('This one is Swift. This one is Patient. And this one I have never thrown, because I am saving her for an occasion.'),
            A('Is this an occasion?'),
            VE('It is beginning to feel like one.', 'happy'),
            N('Your job is to carry the javelins to the line. They are longer than the cart, and the cart is longer than you.'),
          ],
          choices: [
            {
              id: 'careful',
              label: 'Carry them very carefully, like Verses would.',
              then: [VE('You carry them like a friend. Thank you.', 'happy')],
            },
            {
              id: 'obelix',
              label: 'Ask Obelix to help.',
              then: [N('Obelix carries all three in one hand and the cart in the other, and asks where you’d like the cart.')],
            },
          ],
        },
        done: {
          id: 'a08-03-field-done',
          lines: [N('You lay the javelins on the grass by the line. Your Nubbin sits beside the one called Patient, which seems right.')],
        },
      },
      {
        id: 'a08-03-s2',
        goal: 'Watch both throws and measure them.',
        hint: 'Stand by the far marker. Count your steps from the line to where each javelin lands.',
        check: 'watch:a08-javelin:field',
        scene: {
          id: 'a08-03-throws',
          lines: [
            N('Verses takes Swift, steps up, and throws. It goes up like a bird and comes down at the very end of the field, quivering.'),
            P('A record, surely. Referee, measure it.'),
            N('You measure it. It takes a long time, and you have to start again twice, because Dogmatix keeps bringing you sticks.'),
            N('Asterix takes a sip from his flask and borrows a plain javelin from the cart. He throws it underarm, almost lazily.'),
            N('It goes over Verses’ javelin, over the trees and over the hill. It keeps going, and the whistle of it fades away.'),
            VE('Where is it going?', 'shock'),
            A('I couldn’t tell you. I just threw it.'),
            VE('And what is she called?'),
            A('Er. Stick.'),
            N('Dogmatix, who has brought you eleven sticks today, looks up sharply.'),
            VE('Stick. A modest name. I like her already.', 'happy'),
          ],
          choices: [
            {
              id: 'measure',
              label: 'Start walking after it with your tablet.',
              then: [P('Come back. Come back! We’ll be here for a week.'), N('You come back. You give it the win on what you are calling "visible evidence of leaving".')],
            },
            {
              id: 'call',
              label: 'Call it: the javelin is still going.',
              then: [VE('A fair ruling. One cannot measure a throw that has not finished.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a08-03-complete',
      lines: [
        tick('II', 'the javelin'),
        N('Verses wraps Swift in its silk again, and bows to Asterix, deeply and without fuss.'),
        VE('A good throw is a good throw, whoever makes it. I am going to go and find out where yours lands.', 'happy'),
        N('He sets off over the hill with the cart, and the javelin he was saving still in its silk.'),
        O('He’s nice. I like him. Are all the champions going to be nice?'),
        P('No.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a08-03': true },
    notes:
      'TASK 2 (Verses), in the verified order (Verses before Cilindric). Verses is courteous and a fine sportsman; his ' +
      'named javelins are our invention, and the page’s gentlest running joke. Asterix’s javelin is heard again overhead ' +
      'in A8-4 (a08-04-bout#6) and is still going in A8-14. Measuring is a counting moment (Learning Grove hook).',
  },

  // ---------------------------------------------------------------- A8-4
  {
    id: 'a08-04',
    code: 'A8-4',
    title: 'Cilindric',
    source: `${SRC}: task 3, the wrestler`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-3') },
    requires: ['A8-3'],
    speakers: [ASTERIX, OBELIX, PUPUS, CILINDRIC],
    steps: [
      {
        id: 'a08-04-s1',
        goal: 'Read Cilindric’s rulebook before the bout.',
        hint: 'You are the referee: the rules are your job. Open the book on the bench.',
        check: 'inspect:a08-rulebook:cilindric',
        scene: {
          id: 'a08-04-rules',
          lines: [
            N('Task three is a ring of rope in a meadow. Inside it a short, square man in a white wrap is folding a towel into perfect quarters.'),
            CI('Cilindric. Good morning. Before we begin, the referee will please read the rules.'),
            N('He hands you a book. It is as thick as a loaf, and every page is ruled into neat columns.'),
            CI('My art is about using your opponent’s strength. But also about doing it correctly. In the right order. With the right bow.'),
            N('Rules one to forty are about bowing. Rule forty-one says what to do if the bow is returned too low.'),
            A('Is there a rule about what happens if the other man doesn’t want to wrestle?'),
            CI('Rule three hundred and twelve. It is very firm.', 'think'),
          ],
          choices: [
            {
              id: 'read',
              label: 'Read every rule, properly.',
              then: [CI('Ah. A referee who reads. You have my respect.', 'happy'), N('It takes until lunch. Pupus brings sandwiches, and seems to understand completely.')],
            },
            {
              id: 'skim',
              label: 'Skim it and nod wisely.',
              then: [CI('Hm. You have skipped the section on nodding.', 'think')],
            },
          ],
        },
        done: {
          id: 'a08-04-rules-done',
          lines: [N('You close the book. Cilindric bows to it, then to you, then to Asterix, then, after a moment’s thought, to the meadow.')],
        },
      },
      {
        id: 'a08-04-s2',
        goal: 'Referee the bout.',
        hint: 'Stand by the rope. Asterix has an idea; let it play out.',
        check: 'watch:a08-bout:ring',
        scene: {
          id: 'a08-04-bout',
          lines: [
            N('They face each other and bow. Cilindric moves like water, and suddenly Asterix is upside down and then the right way up again.'),
            A('Wonderful. Could you show me that again? Slowly. I want to be sure I’ve got the rules right.'),
            CI('Of course. Rule eighty. First the hand, here. Then the foot, here. Then the turn, so.'),
            A('And then rule eighty-one?'),
            CI('Rule eighty-one follows rule eighty, naturally, with the elbow under, so, and then the knee comes through, so…'),
            N('Cilindric, demonstrating on nobody but himself, turns, tucks, turns again, and ties himself into a tidy, polite knot.'),
            N('High overhead, something whistles past, going east. It is Asterix’s javelin from yesterday, still going.'),
            CI('I appear to have won. Against myself. Which, under rule three hundred and twelve, means I have lost.', 'shock'),
          ],
          choices: [
            {
              id: 'untie',
              label: 'Help untie him.',
              then: [N('It takes you, Obelix and both animals. Cilindric thanks each of you by name, including the dog.', 'happy')],
            },
            {
              id: 'rule',
              label: 'Look up rule three hundred and twelve to be sure.',
              then: [CI('Correct. A referee who checks. I would wrestle under you again any time.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a08-04-complete',
      lines: [
        tick('III', 'the wrestler'),
        N('Pupus sighs before you have finished scratching, to save time.'),
        CI('A clean result. Unusual, but clean. Please keep the book. I have three more at home.', 'happy'),
        N('He bows once to each of you and folds his towel again, perfectly, and walks off with it under his arm.'),
        O('He was nice too.'),
        P('They are all nice. That is the trouble. Nobody nice ever wins anything for Rome.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a08-04': true },
    notes:
      'TASK 3 (Cilindric). His art is drawn as a gentle, tidy wrestling style, not any real school or belt system. The ' +
      'joke is that he loves rules, and it is affectionate: he is honest, courteous, and the first champion to give you ' +
      'something (the rulebook is a prop on this page, not a Grove reward). No accent in the text. The javelin passing ' +
      'overhead is a callback to A8-3; sound only, a long whistle east to west.',
  },

  // ---------------------------------------------------------------- A8-5
  {
    id: 'a08-05',
    code: 'A8-5',
    title: 'The Isle of Pleasure',
    source: `${SRC}: task 4, the island`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-4') },
    requires: ['A8-4'],
    speakers: [ASTERIX, OBELIX, PUPUS, HOSTESS],
    steps: [
      {
        id: 'a08-05-s1',
        goal: 'Row across to the island.',
        hint: 'Take the oars. Obelix will row too, but don’t let him row on his own; you’ll go in circles.',
        check: 'escort:a08-boat:isle',
        scene: {
          id: 'a08-05-boat',
          lines: [
            N('Task four is an island in a blue lake, with soft music coming over the water and a smell of honey cakes.'),
            P('The task is simple. Cross the island and leave it. Nobody ever has. They all stay.', 'think'),
            A('Why?'),
            P('Because it’s lovely. That is the whole difficulty.'),
            N('Obelix rows with one oar and you row with the other. The boat goes forward, mostly, and sideways the rest of the time.'),
            N('Dogmatix stands at the front like a figurehead. Your Nubbin stands beside him, leaning into the wind it is not really getting.'),
            O('Will there be boar?'),
            P('There will be everything.'),
          ],
        },
        done: {
          id: 'a08-05-boat-done',
          lines: [N('The boat bumps onto white sand. There are cushions on the beach, left there on purpose.')],
        },
      },
      {
        id: 'a08-05-s2',
        goal: 'Get everybody back to the boat.',
        hint: 'Find your Nubbin and Dogmatix first. Obelix will take care of Asterix.',
        check: 'escort:a08-asterix:boat',
        scene: {
          id: 'a08-05-isle',
          lines: [
            N('Kind women in pale robes come down to the shore with plates of cakes and jugs of cool fruit juice.'),
            H('Welcome, travellers. You look so tired. Sit down. Rest. There is a bath, and a sofa, and nobody will ever ask you to do anything again.'),
            N('Asterix sits down on a cushion. He looks surprised, and a little worried, as if his legs did it without asking him.'),
            A('Only for a moment.', 'soft'),
            H('Of course. Only for ever.'),
            N('Your Nubbin and Dogmatix have found a garden of butterflies, and are rolling in the clover with their eyes half shut.'),
            O('Excuse me. Is there any boar?'),
            H('We have honey, and figs, and peaches, and little cakes with…'),
            O('So no boar.', 'angry'),
          ],
          choices: [
            {
              id: 'fetch',
              label: 'Go and fetch the Nubbin and the dog.',
              then: [N('You lift them out of the clover, one under each arm. They are warm and floppy and very sleepy, and they let you.')],
            },
            {
              id: 'cake',
              label: 'Have just one cake first.',
              then: [N('It is the best cake you have ever eaten. You notice that you have sat down, and get up again, quickly.', 'shock')],
            },
          ],
        },
        done: {
          id: 'a08-05-isle-done',
          lines: [
            N('Obelix picks Asterix up off the cushion, tucks him under one arm, and walks back to the boat without stopping.'),
            O('Sorry. Thank you. Lovely island. No boar.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a08-05-complete',
      lines: [
        N('Halfway home across the lake, Asterix sits up and shakes his head, like someone coming out of a warm bath.'),
        A('I was going to stay. I really was going to stay.', 'shock'),
        O('You weren’t. There was no boar.'),
        tick('IV', 'the island'),
        P('In all the records, nobody has ever rowed away from that island. And nobody has ever left it in a sulk.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a08-05': true },
    notes:
      'TASK 4 (the Isle of Pleasure). Keep it cosy and silly: cakes, cushions, music, a sofa, a garden of butterflies. ' +
      'The hostesses are kind, robed to the ankle, and not flirtatious; the temptation is rest forever, and the danger ' +
      'is that nobody wants to leave. Obelix’s single-mindedness about boar is the rescue. The island’s music is ' +
      'original and wordless.',
  },

  // ---------------------------------------------------------------- A8-6
  {
    id: 'a08-06',
    code: 'A8-6',
    title: 'Iris',
    source: `${SRC}: task 5, the hypnotist`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-5') },
    requires: ['A8-5'],
    speakers: [ASTERIX, OBELIX, PUPUS, IRIS],
    steps: [
      {
        id: 'a08-06-s1',
        goal: 'Find the hypnotist’s tent.',
        hint: 'Follow the painted eyes on the trees. They lead to a tent with a moon on it.',
        check: 'visit:a08-iris:tent',
        scene: {
          id: 'a08-06-tent',
          lines: [
            N('Task five waits at the end of a path lined with painted eyes. They seem to follow you, which is probably the point.'),
            N('The tent is dark inside and smells of incense. A man in a tall headdress sits on a cushion, very still.'),
            IR('I am Iris, from Egypt, where we have been looking at things longer than anyone. Look into my eyes.'),
            N('His eyes are enormous, and dark, and they glow faintly, like coals. You find you have already looked.'),
            IR('Your task is to hold my gaze. Whoever looks away first, loses. And whoever loses will believe whatever I say they are.'),
            P('He is very good. Last week he convinced a centurion he was a teapot. The man still says "oh" when he’s picked up.', 'think'),
          ],
          choices: [
            {
              id: 'brave',
              label: 'Try a practice stare yourself.',
              then: [N('You last about two seconds. When you come round, you are holding your Nubbin and humming like a beehive.', 'shock')],
            },
            {
              id: 'away',
              label: 'Look at the floor, sensibly.',
              then: [IR('A wise referee. The floor is safe. Mostly.')],
            },
          ],
        },
      },
      {
        id: 'a08-06-s2',
        goal: 'Referee the staring contest.',
        hint: 'Sit between them, and look at the sand timer, not at either of them.',
        check: 'sit:a08-iris:stare',
        scene: {
          id: 'a08-06-stare',
          lines: [
            N('Asterix sits down opposite Iris. You turn the sand timer over, and keep your eyes very firmly on the sand.'),
            IR('You are growing sleepy. You are a small, soft creature. You are… a dormouse.'),
            A('No, I’m not.'),
            N('Iris leans closer, and the glow in his eyes gets brighter. The glow in Asterix’s eyes, after one sip from his flask, gets brighter still.'),
            A('Actually, I think you’re the one who’s sleepy.'),
            N('Something in Iris’s face goes uncertain. Then his nose twitches, and his shoulders go round, and he snuffles at the cushion.'),
            N('He is quite sure, now, that he is a wild boar. He trots out of the tent on all fours, grunting happily.'),
            O('Asterix! Asterix, can I…', 'happy'),
            A('No, Obelix. He’s a person. He’ll be a person again by supper.'),
          ],
        },
        done: {
          id: 'a08-06-stare-done',
          lines: [N('The last grain of sand falls. Dogmatix is barking at the tent door, and your Nubbin has hidden behind your boots.')],
        },
      },
    ],
    complete: {
      id: 'a08-06-complete',
      lines: [
        tick('V', 'the hypnotist'),
        N('Outside, Iris is rooting cheerfully among the acorns. Pupus watches him with deep sympathy.'),
        P('It wears off. Usually. I will make sure somebody brings him a cushion.', 'soft'),
        O('He looks happy.'),
        A('He does, a bit. Come on. Seven to go.'),
      ],
    },
    rewards: [],
    sets: { 'a08-06': true },
    notes:
      'TASK 5 (Iris). Iris is theatrical and proud of Egypt’s long learning; his headdress and tent are stage costume, ' +
      'not a religious image, and no gods are named. The boar joke stays gentle: Obelix is told no at once, and Iris is ' +
      'fine by supper (Pupus sees to him). The eye glow is a soft light, not a horror effect. Reduced motion: no swirl.',
  },

  // ---------------------------------------------------------------- A8-7
  {
    id: 'a08-07',
    code: 'A8-7',
    title: 'Mannekenpix',
    source: `${SRC}: task 6, the feast`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-6') },
    requires: ['A8-6'],
    speakers: [ASTERIX, OBELIX, PUPUS, CHEF],
    steps: [
      {
        id: 'a08-07-s1',
        goal: 'Help carry the dishes from the kitchen.',
        hint: 'Take them from the hatch to the long table. The big ones need two hands.',
        check: 'carry:a08-dishes:kitchen',
        scene: {
          id: 'a08-07-kitchen',
          lines: [
            N('Task six is a meal. On a long table in a hall with low beams, a single plate is set, and a single, very large chair.'),
            N('In the kitchen behind it, a round, red-faced man in an apron is stirring four pots and tasting a fifth.'),
            MK('Mannekenpix, chef, from the north. The Belgae, if you like. Nobody leaves my table hungry. Nobody leaves it at all, usually.', 'happy'),
            MK('The task is to finish. Everything. To the last crumb. Whoever has tried has had to be carried home on a door.'),
            A('Obelix, I think this one is yours.'),
            O('Me? Oh. Oh, all right then. If I must.', 'happy'),
            N('You are put on dishes. The first one is a soup the size of a bath, and Pupus has to take the other end.'),
          ],
          choices: [
            {
              id: 'taste',
              label: 'Ask what’s in the soup.',
              then: [MK('Everything I had, and a bit of love. The love is the secret. The everything helps.', 'happy')],
            },
            {
              id: 'carry',
              label: 'Just carry, and carry quickly.',
              then: [MK('Good! Hot food goes out hot. You have the makings of a waiter.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a08-07-kitchen-done',
          lines: [N('Soup, then fish, then three kinds of pie. Then a dish of crisp fried potatoes that Mannekenpix places down as if it were a crown.')],
        },
      },
      {
        id: 'a08-07-s2',
        goal: 'Keep the plates coming and watch Obelix finish.',
        hint: 'Stand by the table with your tablet. Count the courses on it as they go.',
        check: 'watch:a08-feast:hall',
        scene: {
          id: 'a08-07-feast',
          lines: [
            N('Obelix eats steadily, happily, and without hurry. Each dish goes in and the plate comes back so clean it shines.'),
            N('You count courses on your tablet. You run out of room at twenty and start a second tablet.'),
            MK('He has eaten the pies. He has eaten the stew. He has eaten the second stew, which was for me.', 'shock'),
            N('At last the hatch is empty. Mannekenpix leans in the doorway, floury and astonished, with nothing left to bring.'),
            O('That was a lovely starter. When’s the main course?', 'happy'),
            N('There is a long silence. Then Mannekenpix starts to laugh, and laughs until he has to sit on a flour sack.'),
            MK('Thirty years. Thirty years I have been waiting for someone to ask me that.', 'happy'),
          ],
          choices: [
            {
              id: 'scraps',
              label: 'Save the scraps for the Nubbin and Dogmatix.',
              then: [N('There aren’t any scraps. Obelix gives them each a crust from his own pocket, which seems to be where he keeps them.')],
            },
            {
              id: 'clap',
              label: 'Applaud the chef.',
              then: [N('You clap, and Pupus claps, and Obelix claps with his mouth full. Mannekenpix takes a deep, floury bow.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a08-07-complete',
      lines: [
        tick('VI', 'the feast'),
        MK('Here. For the road. You will be hungry again by the river.', 'happy'),
        N('He gives Obelix a wrapped parcel of fried potatoes. Obelix holds it like a newborn.'),
        P('Halfway. Six tasks. Caesar is going to be very quiet when I tell him.', 'sad'),
        A('Six more. Who’s next?'),
        P('Next is a cave. I have been asked not to say anything else about it.'),
      ],
    },
    rewards: [],
    sets: { 'a08-07': true },
    notes:
      'TASK 6 (Mannekenpix). The Belgian joke is generous cooking and a love of good fried potatoes, nothing else, and ' +
      'he is the happiest loser on the page. "The Belgae" is the Roman name for the tribes of the north; a gentle ' +
      'anachronism to call him Belgian, as the source does. No drink at the table. The counting of courses is a ' +
      'Learning Grove hook.',
  },

  // ---------------------------------------------------------------- A8-8
  {
    id: 'a08-08',
    code: 'A8-8',
    title: 'The Cave of the Beast',
    source: `${SRC}: task 7, the cave`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-7') },
    requires: ['A8-7'],
    speakers: [ASTERIX, OBELIX, PUPUS],
    steps: [
      {
        id: 'a08-08-s1',
        goal: 'Go into the cave with a lantern.',
        hint: 'Light the lantern at the entrance. Keep the wall on your left.',
        check: 'explore:a08-cave:mouth',
        scene: {
          id: 'a08-08-mouth',
          lines: [
            N('Task seven is a black hole in a hillside, with old bones round the entrance. Pupus stands well back from the bones.'),
            P('The task is to go in, and come out. Something lives in there. Nobody who has gone in has said what.'),
            A('Because they didn’t come out?'),
            P('Because they wouldn’t say. They came out, and went home, and changed the subject.', 'think'),
            N('From inside, very deep down, comes a long, rumbling sound, like a cart going over a wooden bridge.'),
            N('Dogmatix’s ears go flat, and your Nubbin presses against your leg. Obelix picks up a rock, thinks better of it, and puts it down.'),
            N('You light the lantern. The first ten steps are only a cave: drips, cold air, and your own breath.'),
          ],
          choices: [
            {
              id: 'first',
              label: 'Go first, with the lantern.',
              then: [A('Brave referee. We’re right behind you.'), O('A little behind.')],
            },
            {
              id: 'together',
              label: 'Ask everyone to go in side by side.',
              then: [N('It is a tight fit, and Obelix goes sideways. It is much better, side by side.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a08-08-mouth-done',
          lines: [N('The passage opens into a chamber so big the lantern light doesn’t reach the roof. The rumble is very near now.')],
        },
      },
      {
        id: 'a08-08-s2',
        goal: 'Find out what lives in the cave.',
        hint: 'Don’t lift the lantern too high. Sit down, and let it come to you.',
        check: 'find:a08-beast:chamber',
        scene: {
          id: 'a08-08-beast',
          lines: [
            N('At the edge of the light there is a shape, as big as a haystack, curled tight. The rumble is coming from it.'),
            N('It is not growling; it is shaking. Whatever it is, it is very large, and very frightened of the light.'),
            A('It’s scared of us.', 'soft'),
            O('Everybody’s scared of me. I don’t know why.', 'sad'),
            N('You turn the lantern down low, and sit on the cold floor, and don’t say anything.'),
            N('Dogmatix sits beside you, then your Nubbin. Then, very carefully, so the floor won’t shake, Obelix.'),
            N('After a long time, something huge and soft, with very small eyes, puts its nose out and sniffs your Nubbin.'),
            N('Your Nubbin sniffs back. The rumble stops.', 'soft'),
          ],
          choices: [
            {
              id: 'lantern',
              label: 'Leave the lantern, turned down low.',
              then: [N('You set it on a rock, at its gentlest. The great shape settles beside it like a cat by a stove.', 'soft')],
            },
            {
              id: 'quiet',
              label: 'Back out quietly, in the dark.',
              then: [N('You go out the way you came, slowly. Behind you, the rumble starts again, but slower now, like snoring.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a08-08-complete',
      lines: [
        N('Outside, the daylight is very loud. Pupus is still standing well back from the bones.'),
        P('Well? What was it?'),
        N('Asterix looks at you, and Obelix looks at you, and you all find, just like everyone before, that you’d rather not say.'),
        A('Nothing you need to worry about.'),
        tick('VII', 'the cave'),
        P('You’re all the same, you lot. You go in, and you come out kind.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a08-08': true },
    notes:
      'TASK 7 (the Cave of the Beast). The source keeps the Beast offscreen; so do we, nearly. Show only a great curled ' +
      'shape at the edge of the light, a soft nose and very small eyes; never teeth or claws. The bones at the mouth ' +
      'are old cattle bones from a midden, not a threat. Hazel’s third rule is acted here (sit beside it and wait), ' +
      'not quoted. Nobody explains the Beast; the page’s joke is that nobody who goes in will tell.',
  },

  // ---------------------------------------------------------------- A8-9
  {
    id: 'a08-09',
    code: 'A8-9',
    title: 'The Place That Sends You Mad',
    source: `${SRC}: task 8, Permit A38`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-8') },
    requires: ['A8-8'],
    speakers: [ASTERIX, OBELIX, PUPUS, PORTER, CLERK, PREFECT],
    steps: [
      {
        id: 'a08-09-s1',
        goal: 'Go into the Place That Sends You Mad and ask for Permit A38.',
        hint: 'Start with the porter at the front door. Be polite. It won’t help, but be polite.',
        check: 'talk:a08-porter',
        scene: {
          id: 'a08-09-door',
          lines: [
            N('Task eight is a building. It is tall and white and has more windows than there are days in the year, and it hums.'),
            P('Inside, you must obtain Permit A38. That is all. Many great warriors have gone in for it.', 'think'),
            A('And?'),
            P('Some of them still work there.', 'sad'),
            N('The hall inside is full of counters, and stairs, and people holding papers and looking at the ceiling with a terrible calm.'),
            PO('Good morning. Do you have an appointment?'),
            A('We’ve come for Permit A38.'),
            PO('Then you need to go to counter one, which will send you to counter two. Stairs on the left. The stairs on the right go nowhere.'),
            N('Obelix looks up at the stairs on the right. They go up, turn a corner, and come back down beside themselves.'),
          ],
        },
        done: {
          id: 'a08-09-door-done',
          lines: [N('Dogmatix lies down by the porter’s desk with your Nubbin, as if they have both decided to wait this one out.')],
        },
      },
      {
        id: 'a08-09-s2',
        goal: 'Try to get the permit the proper way.',
        hint: 'Go from counter to counter. Keep track of where each one sends you.',
        check: 'puzzle:a08-place:counters',
        scene: {
          id: 'a08-09-counters',
          lines: [
            CL('Counter one. Permit A38? Not here. You need the blue form, from counter two. Second floor.'),
            N('Counter two is on the third floor. The clerk is eating lunch, though it is ten in the morning.'),
            CL('The blue form? You need the pink form first, to prove you’re allowed to ask for the blue form. Counter one.'),
            N('Counter one has closed, and a sign says it has gone to counter four. Counter four is a broom cupboard.'),
            N('A man in a dusty toga drifts past, holding a scroll. He has a long white beard and a badge that says NEW. The badge is very faded.'),
            O('Asterix. I think we’ve been here before. I think we’ve been here all our lives.', 'sad'),
            N('You look at your tablet. You have written down every counter, and the arrows on it make a perfect circle.'),
          ],
          choices: [
            {
              id: 'queue',
              label: 'Join the longest queue, just to see.',
              then: [N('You get to the front just as the clerk puts up a sign: “Closed for reorganisation. Please queue at the back.”')],
            },
            {
              id: 'map',
              label: 'Draw a map of the counters.',
              then: [A('Show me that.'), N('Asterix looks at your circle of arrows for a long while. Then he smiles, slowly.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a08-09-counters-done',
          lines: [A('They’ve built a machine for saying no. So let’s ask it for something it can’t say no to, because it doesn’t exist.', 'happy')],
        },
      },
      {
        id: 'a08-09-s3',
        goal: 'Design your own impossible form for the clerks.',
        hint: 'Write it on a fresh page of your tablet. The sillier it is, the better it will work.',
        check: 'craft:a08-form:impossible',
        scene: {
          id: 'a08-09-form',
          set: { 'a08-09-form-made': true },
          lines: [
            A('Here’s the plan. I ask for Permit A39, which nobody has ever heard of.'),
            A('And while they’re looking for it, the referee hands in a form. A new form. A form so strange they have to pass it round.'),
            P('You want to invent paperwork? In here?', 'shock'),
            A('Why not? It’s the only thing they eat.'),
            N('You find a fresh page of your tablet. Obelix leans over your shoulder, breathing heavily and helpfully.'),
            O('Make it a good one. Make it the silliest one ever.', 'happy'),
            N('Pupus, despite himself, leans over the other shoulder.'),
            P('Rule of thumb: the clerks have to believe it is real. The silliest form only wins if it looks completely serious.', 'think'),
          ],
          choices: [
            {
              id: 'loop',
              label: 'Form 0: Application to Find Out Whether You Need This Form.',
              set: { 'a08-form': 'loop' },
              then: [
                N('It has one box, which says, in small letters: “Please attach a completed copy of this form.”'),
                P('That is… that is beautiful. That could go round this building until the sun burns out.', 'shock'),
              ],
            },
            {
              id: 'boar',
              label: 'The Pink-and-Blue Form: Proof That You Are Not a Boar, to be signed by a boar.',
              set: { 'a08-form': 'boar' },
              then: [
                N('Obelix signs it on the boar’s behalf, with a hoof print he does with his knuckle. It looks extremely official.'),
                O('Somebody will have to go and find a boar now. Somebody will have to find a boar who can write.', 'happy'),
              ],
            },
            {
              id: 'plain',
              label: 'A short form: your name, what you need, and a signature.',
              set: { 'a08-form': 'plain' },
              then: [
                N('It fits on one page, and it is clear. A child could fill it in in a minute.'),
                P('They will never accept this. Nobody in here has ever seen anything so sensible.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'a08-09-form-done',
          lines: [N('Pupus, sighing, finds a sheet of papyrus in his toga, and you copy the form out fair. Asterix straightens his helmet and walks up to counter one.')],
        },
      },
      {
        id: 'a08-09-s4',
        goal: 'Hand in your form while Asterix asks for Permit A39.',
        hint: 'Give the form to the clerk at counter one, then stand back.',
        check: 'deliver:a08-form:counter-one',
        scene: {
          id: 'a08-09-a39',
          lines: [
            A('Good morning. I’d like Permit A39, please. As set out in the new circular.'),
            CL('A39? There’s no A39. There’s A38.', 'shock'),
            A('Not since the new circular. Haven’t you had it? Everybody else has had it.'),
            N('The clerk goes pale and turns to the clerk behind him, who turns to the clerk behind her. A whisper runs up the stairs.'),
            N('You slide your form across the counter. The clerk takes it without looking, stamps it out of habit, and passes it on.'),
            N('Within a minute, every clerk in the building is running and papers are flying. The stairs on the right are suddenly very busy.'),
            CL('Has anybody seen the new circular? Who has the A39? Who is handling this form? Which counter is this form?', 'shock'),
            N('A bell rings at the top of the building. A door opens on the highest landing, and a man in a purple-edged toga looks down.'),
          ],
        },
        done: {
          id: 'a08-09-a39-done',
          lines: [
            PF('Who is responsible for this? What do you want? Whatever it is, take it, and go, and let us have our building back.', 'angry'),
            A('Permit A38, please.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a08-09-complete',
      lines: [
        N('The prefect stamps a small grey square of papyrus without even reading it, and lets it flutter down the stairwell to you.'),
        N('It says PERMIT A38 in very large letters, and nothing else at all. You hold it up for everyone to see.'),
        P('In the whole history of the building, nobody has ever got one. I didn’t think it was real.', 'shock'),
        tick('VIII', 'Permit A38'),
        N('Pupus initials it in triplicate. Old habits.'),
        N('On your way out, the porter hands your form back to you, stamped, with great respect. He seems to think you’ll need it again.'),
        O('That was the best one. Can we do that one again?', 'happy'),
        A('Never, Obelix. Never, ever again.'),
      ],
    },
    rewards: [],
    sets: { 'a08-09': true },
    notes:
      'TASK 8 (the Place That Sends You Mad), the page’s centrepiece, split into four steps. Permit A38 and the A39 ' +
      'trick are the source’s plot; all dialogue is new, and the circular is never given a number. SIGNATURE CHOICE ' +
      '(a08-09-form): a08-form = loop | boar | plain. The scene is the same on every path, because Asterix’s A39 does ' +
      'the heavy lifting and your form is the extra spanner. loop and boar are silly enough to "win" (the clerks pass ' +
      'them round, stamping it); plain is too sensible, and the clerks stamp it once, baffled. On every path the porter ' +
      'hands the stamped form back (a08-09-complete). Pays off at the Banquet, A8-14 (variants ' +
      'a08-14-bard-loop, a08-14-bard-boar, a08-14-useful), and is echoed in A8-12 (a08-12-ghosts-done). ART: the ' +
      'building is a dream of a bureaucracy: Escher-like stairs (the ones on the right go nowhere), endless counters, a ' +
      'humming sound. The "bureaucracy" idea is a Learning Grove hook, told gently: rules that help, and rules that ' +
      'only help themselves. a08-09-form-made is an internal step flag (the form exists as a prop for A8-12 and A8-14).',
  },

  // ---------------------------------------------------------------- A8-10
  {
    id: 'a08-10',
    code: 'A8-10',
    title: 'The Crocodile Ravine',
    source: `${SRC}: task 9, the ravine`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-9') },
    requires: ['A8-9'],
    speakers: [ASTERIX, OBELIX, PUPUS],
    steps: [
      {
        id: 'a08-10-s1',
        goal: 'Walk to the edge of the ravine and look for the rope.',
        hint: 'Stand at the post on this side. Look carefully across to the other post.',
        check: 'walk:a08-ravine:edge',
        scene: {
          id: 'a08-10-edge',
          lines: [
            N('Task nine is a deep, narrow ravine with a river at the bottom. In the river there are a number of crocodiles, all looking up.'),
            N('There is a post on this side, and a post on the far side. Between them, there is nothing at all.'),
            P('The task is to cross on the magic rope. It is invisible. Only the worthy can see it.', 'think'),
            A('Can you see it?'),
            P('I am an observer. I am not required to see anything.'),
            N('You throw a pebble out from the post. It falls straight down, past where a rope would be, and a crocodile catches it.'),
          ],
          choices: [
            {
              id: 'pebble',
              label: '“There’s no rope.”',
              then: [P('There is a rope. It is simply very, very good at being invisible.'), A('So is a hole.')],
            },
            {
              id: 'pupus',
              label: '“Mr Pupus, would you show us how, first?”',
              then: [P('I… The observer must not interfere.', 'shock'), N('Pupus takes three firm steps away from the edge, to observe better.')],
            },
          ],
        },
      },
      {
        id: 'a08-10-s2',
        goal: 'Find another way across.',
        hint: 'Dogmatix won’t let Obelix pull up a living tree. Look along the edge for one that has already fallen.',
        check: 'find:a08-log:ravine',
        scene: {
          id: 'a08-10-log',
          lines: [
            O('I’ll make a bridge. I’ll pull up a tree.', 'happy'),
            N('He puts his arms round the nearest oak. Dogmatix gives a howl of real grief and runs in circles, and Obelix lets go at once.'),
            O('Sorry, Dogmatix. Sorry. I forgot. Not that one.', 'sad'),
            N('Dogmatix cannot bear to see a tree pulled up. Your Nubbin sits beside him, leaning on him, until his ears come back up.'),
            N('You walk along the edge, looking. A little way off, a huge old pine lies dead on its side, roots in the air, long since fallen.'),
            Y('This one. It fell on its own.'),
            N('Obelix gives it one punch at the root end. It slides, swings, and drops with a crash across the ravine, a perfect bridge.'),
            N('The crocodiles, below, look at each other with what seems to be disappointment.'),
          ],
          choices: [
            {
              id: 'cross',
              label: 'Cross first, carrying the Nubbin.',
              then: [N('The trunk is wide as a road. Dogmatix trots across beside you with his tail up, the tree business forgiven.', 'happy')],
            },
            {
              id: 'pupus',
              label: 'Offer Pupus your hand.',
              then: [P('I don’t need… thank you.', 'soft'), N('He takes it, all the way across, and doesn’t let go until his sandals are on grass.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a08-10-complete',
      lines: [
        P('That is not the magic rope. Technically, you have not crossed on the magic rope.', 'think'),
        A('Technically, there isn’t one.'),
        N('Pupus opens his mouth, closes it, and looks back at the empty air between the posts for a long moment.'),
        P('Fine. Write down: "Rope: invisible. Crocodiles: unimpressed."'),
        N('Below, the biggest crocodile turns its back on you, very slowly, to make a point.'),
        tick('IX', 'the ravine'),
      ],
    },
    rewards: [],
    sets: { 'a08-10': true },
    notes:
      'TASK 9 (the Crocodile Ravine). The outline’s beat is "an invisible tightrope, or a punch": the rope is not ' +
      'there, and the punch moves a fallen pine. DOGMATIX AND TREES is source canon (he howls when trees are uprooted); ' +
      'respect it, so Obelix never fells a living tree on this page. The crocodiles never leave the water, never bite, ' +
      'and are comic.',
  },

  // ---------------------------------------------------------------- A8-11
  {
    id: 'a08-11',
    code: 'A8-11',
    title: 'The Old Man of the Mountain',
    source: `${SRC}: task 10, the riddle`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-10') },
    requires: ['A8-10'],
    speakers: [ASTERIX, OBELIX, PUPUS, OLDMAN],
    steps: [
      {
        id: 'a08-11-s1',
        goal: 'Climb to the top of the mountain.',
        hint: 'Take the goat path. It is longer, but the goats know what they’re doing.',
        check: 'climb:a08-mountain:summit',
        scene: {
          id: 'a08-11-climb',
          lines: [
            N('Task ten is a mountain with its top in the clouds. A narrow path goes up it in loops, and so do some goats.'),
            P('At the top lives the Old Man of the Mountain, who is very wise. He will ask you a riddle. You must answer it.'),
            O('What if we don’t know?'),
            P('Then you stay up there until you do. Some people have been up there since they were young.', 'think'),
            N('The path is steep, and you carry your Nubbin. Obelix carries Dogmatix, and Pupus, and after a while, the goats.'),
            N('Near the top, the air is thin and cold, and there is a smell of something faintly perfumed, like a fancy bathhouse.'),
          ],
          choices: [
            {
              id: 'view',
              label: 'Stop and look at the view.',
              then: [N('All Gaul is spread out under the clouds, green and brown and silver with rivers. Somewhere down there is the village.', 'soft')],
            },
            {
              id: 'on',
              label: 'Keep going: no stopping on mountains.',
              then: [A('Good thinking. If I stop, I’ll never start again.')],
            },
          ],
        },
        done: {
          id: 'a08-11-climb-done',
          lines: [N('At the summit, by a cave, an ancient man with a beard down to his knees sits cross-legged on a rock, eyes closed.')],
        },
      },
      {
        id: 'a08-11-s2',
        goal: 'Answer the Old Man’s riddle.',
        hint: 'Listen to every clue. Then look around the cave.',
        check: 'puzzle:a08-riddle:summit',
        scene: {
          id: 'a08-11-riddle',
          lines: [
            OM('Travellers. You have climbed far. Hear now the great riddle, and answer, or remain.', 'think'),
            OM('What is white as the snows, yet melts in your hands? What is soft as a lamb, and smells of the meadows?'),
            OM('What leaves you cleaner than the river, and costs only two copper coins, or three for five?'),
            N('There is a pause while Asterix frowns. Obelix counts on his fingers, gets to three for five, and stops.'),
            N('Behind the Old Man, in his cave, there are stacks and stacks of small white cakes, wrapped in leaves, each stamped with his face.'),
            A('Is it… soap?'),
            OM('It is the Old Man of the Mountain’s Own Mountain Soap! Made with goat’s milk! Gentle on the beard!', 'happy'),
          ],
          choices: [
            {
              id: 'buy',
              label: 'Buy three for five.',
              then: [OM('A wise traveller! I shall throw in a fourth, because you have honest eyes.', 'happy')],
            },
            {
              id: 'riddle',
              label: '“That wasn’t a riddle. That was an advert.”',
              then: [OM('All the best riddles are, in the end. Have a free sample.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a08-11-complete',
      lines: [
        tick('X', 'the riddle'),
        N('Pupus has initialled it before your scratch is finished.'),
        N('The way down is quicker. You smell of goat’s milk and meadow flowers, and so, to his great dismay, does Obelix.'),
        O('I smell like a lamb. Asterix, I smell like a lamb.', 'sad'),
        A('You smell lovely.'),
        P('Two more. Only two. I have stopped knowing whether I want you to win.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a08-11': true },
    notes:
      'TASK 10 (the Old Man of the Mountain). The outline’s beat: a riddle that turns out to be an advert. The soap and ' +
      'its claims are our invention; no real product or slogan. Any answer to the riddle step passes it; the choices ' +
      'are flavour. The goats are ordinary goats and do not talk.',
  },

  // ---------------------------------------------------------------- A8-12
  {
    id: 'a08-12',
    code: 'A8-12',
    title: 'The Haunted Plain',
    source: `${SRC}: task 11, the ghosts`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-11') },
    requires: ['A8-11'],
    speakers: [ASTERIX, OBELIX, PUPUS, GHOST],
    steps: [
      {
        id: 'a08-12-s1',
        goal: 'Wait on the plain for midnight.',
        hint: 'Set up camp by the standing stone. Stay awake until the moon is overhead.',
        check: 'wait:a08-plain:midnight',
        scene: {
          id: 'a08-12-camp',
          lines: [
            N('Task eleven is a wide, flat plain under a big moon, with one standing stone and a lot of mist.'),
            P('Spend one night on the Haunted Plain. At midnight the ghosts come. Nobody has ever stayed till morning.', 'think'),
            N('You make a small fire by the stone. Obelix unwraps the last of Mannekenpix’s fried potatoes and shares them, which is love.'),
            N('Dogmatix and your Nubbin curl up in the crook of Obelix’s arm. Asterix sharpens a stick for no reason.'),
            N('The moon climbs and the mist thickens. Very far off, something clanks, like armour being carried by someone who isn’t there.'),
            P('Is it midnight?', 'shock'),
            A('It’s always midnight somewhere.'),
          ],
          choices: [
            {
              id: 'story',
              label: 'Tell a story to pass the time.',
              then: [N('You tell them about the Grove, and the hill, and the pond. Obelix asks if there are boar, and you say no, gently.', 'soft')],
            },
            {
              id: 'watch',
              label: 'Keep watch in silence.',
              then: [N('You watch the mist. Pupus watches it too, sitting very close to you, as if by accident.')],
            },
          ],
        },
        done: {
          id: 'a08-12-camp-done',
          lines: [N('The mist parts. Out of it, glowing faintly green, march two lines of ghostly legionaries, chains clanking, moaning on the beat.')],
        },
      },
      {
        id: 'a08-12-s2',
        goal: 'Complain to the ghosts until they leave.',
        hint: 'Talk to the centurion at the front. Be specific. Ghosts hate specifics.',
        check: 'talk:a08-ghost',
        scene: {
          id: 'a08-12-ghosts',
          lines: [
            GH('Woooo. We are the lost legion. We march for ever. Fear us. Woooo.', 'angry'),
            N('Obelix sits up, blinking, with Dogmatix on his chest and your Nubbin on his head.'),
            O('Excuse me. Some of us are trying to sleep.', 'angry'),
            GH('We… we are ghosts. We are meant to be frightening.', 'shock'),
            A('You’re very loud. And your chains need oiling. And you’re standing in our potatoes.'),
            GH('We are not standing in anything. We are ghosts.'),
            O('Your sheets are grubby, too. When did you last wash those? My mother would have had something to say.'),
            N('The centurion looks down at his robe. It is, it must be said, a bit grey round the hem.', 'think'),
          ],
          choices: [
            {
              id: 'noise',
              label: '“And the moaning is out of tune.”',
              then: [GH('It is NOT out of tune. Marcus. Marcus, are we out of tune?', 'angry'), N('Marcus, at the back, does not answer, which is an answer.')],
            },
            {
              id: 'permit',
              label: '“Have you got a permit for this?”',
              then: [GH('A permit? For haunting? I… I don’t think we ever applied.', 'shock'), N('A ripple of worry goes down the ghostly lines.')],
            },
          ],
        },
        done: {
          id: 'a08-12-ghosts-done',
          lines: [
            GH('Well. If we’re not wanted. We know when we’re not wanted. Come on, lads. We’ll go and haunt somewhere grateful.', 'sad'),
            N('They shuffle off into the mist, sulking, chains dragging. One of them, at the back, looks round at your tablet as if it were a summons.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a08-12-complete',
      lines: [
        N('Dawn comes up pink over the plain. The mist has gone, and so have the ghosts, and the potatoes, which nobody can explain.'),
        tick('XI', 'the haunted plain'),
        N('Pupus initials it and does not sigh. He looks worried about that.'),
        P('One left. The last one is in Rome. Caesar wants to see this himself.', 'think'),
        A('Good. I want to see him see it.'),
        N('Pupus does not argue. You notice that he has, at some point in the night, started walking on your side of the fire.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a08-12': true },
    notes:
      'TASK 11 (the Haunted Plain). The outline’s beat: complain at the ghosts until they leave. The ghosts are sulky ' +
      'and silly, faintly green, never skeletal. FORM ECHO (a08-form from A8-9): the "permit" choice is open on every ' +
      'path, and the ghost glancing at your tablet (a08-12-ghosts-done#1) is a light, flagless nod to the form you made; ' +
      'it is the same line on every path, so no variant is needed. The full payoff is A8-14.',
  },

  // ---------------------------------------------------------------- A8-13
  {
    id: 'a08-13',
    code: 'A8-13',
    title: 'The Circus Maximus',
    source: `${SRC}: task 12, the arena`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-12') },
    requires: ['A8-12'],
    speakers: [ASTERIX, OBELIX, PUPUS, CAESAR, CHIEF, GETAFIX, BARD, ASBESTOS, VERSES, CILINDRIC, CHEF],
    steps: [
      {
        id: 'a08-13-s1',
        goal: 'Go with the village to Rome.',
        hint: 'The whole village is coming. Help the chief onto his shield; mind his feet.',
        check: 'escort:a08-village:rome',
        scene: {
          id: 'a08-13-rome',
          lines: [
            N('For the last task the whole village comes to Rome. Caesar has ordered it: the Gauls, all of them, in the Circus Maximus.'),
            V('All of us! Excellent! A day out. Bring the boar.', 'happy'),
            N('Rome is enormous, white and gold and full of steps. The village walks through it in a long, loud, curious line.'),
            N('The chief is carried on his shield. Getafix walks with his hands behind his back, looking at the aqueducts with interest.'),
            BD('Shall I sing something, for the journey? Something to make Rome weep?'),
            V('No.'),
            N('Under the huge arena, the village is shown into a stone room with a gate at one end. Through the gate, you hear the crowd.'),
            P('The task is to come out of the arena alive. Caesar has prepared… a show.', 'sad'),
          ],
          choices: [
            {
              id: 'gate',
              label: 'Look through the gate.',
              then: [N('Sand, and sun, and tier on tier of faces. On a balcony at the top, a man in purple and a laurel crown.')],
            },
            {
              id: 'pupus',
              label: 'Ask Pupus if he’s all right.',
              then: [P('I don’t know any more. I have watched you for eleven tasks. I think I would like you to win.', 'soft')],
            },
          ],
        },
      },
      {
        id: 'a08-13-s2',
        goal: 'Referee the last task from the arena’s edge.',
        hint: 'Stand at the gate with your tablet. Watch the lions, and then watch the crowd.',
        check: 'watch:a08-circus:arena',
        scene: {
          id: 'a08-13-arena',
          lines: [
            N('The gate goes up, the village walks out onto the sand, and the crowd roars. Another gate goes up, and the lions come out.'),
            N('They are very big lions, and they have not had breakfast. Getafix takes a small flask from his robe and passes it round.'),
            N('The first lion bounds at Asterix, and Asterix catches it under the front legs and dances with it, in a slow, stately circle.'),
            N('Obelix rubs the second lion behind the ears until it rolls on its back. Gladiators run out; the chief invites them to dinner.'),
            N('Someone lights a fire in the middle of the sand, and someone else has brought the boar. Somehow, there is a feast.'),
            N('Your Nubbin and Dogmatix chase a lion cub round the arena, and the cub chases them back, and the crowd goes wild.'),
            N('High in the stands, a white figure is cheering: Asbestos. Beside him are Cilindric, a floury Mannekenpix, and Iris, a person again.'),
            N('A muddy note arrives from Verses: "Still walking. Cheering from here. Stick sends regards."'),
            N('The crowd isn’t booing the Gauls any more. It is coming down the steps to join the party.'),
          ],
        },
        done: {
          id: 'a08-13-arena-done',
          lines: [
            N('Up on the balcony, Caesar stands, and the arena goes quiet. He looks down at the feast in his circus for a long moment.'),
            CS('Well. That is the twelfth. I suppose I had better be a good loser. It will be a new experience.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'a08-13-complete',
      lines: [
        CS('Gauls, you have done the twelve tasks of Hercules, and a few of your own. Rome declares you gods. Rome hopes you will be quiet ones.'),
        V('Thank you, Caesar! Come to dinner. Bring a boar.', 'happy'),
        CS('I think not. But I shall look at your little dot on the map with… respect.'),
        N('Pupus climbs up beside you and takes the wax tablet, and looks at all twelve ticks.'),
        P('Referee. Your scoring was impartial, generous, and occasionally very strange. I would observe you again.', 'soft'),
        N('You scratch the last tick, XII. Pupus initials it with a flourish, and nobody sighs at all.'),
      ],
    },
    rewards: [],
    sets: { 'a08-13': true },
    notes:
      'TASK 12 (the Circus Maximus). Nobody is hurt: the lions are big, hungry and quickly very friendly; the ' +
      'gladiators are glad of a break. Getafix’s flask is the potion, shown as a glow. The champions from tasks 1 to 6 ' +
      'are in the stands as friends, cheering, which is our addition (they were good losers). Caesar is pompous and a ' +
      'good sport. No battle imagery; the crowd joins in. The XII tick is the last line of the complete scene.',
  },

  // ---------------------------------------------------------------- A8-14
  {
    id: 'a08-14',
    code: 'A8-14',
    title: 'The Banquet',
    source: `${SRC}: the banquet`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A8-13') },
    requires: ['A8-13'],
    speakers: [ASTERIX, OBELIX, GETAFIX, CHIEF, BARD, PUPUS],
    steps: [
      {
        id: 'a08-14-s1',
        goal: 'Help set up the banquet in the village square.',
        hint: 'Carry the boar to the spits, and the benches to the tables. Then find the bard.',
        check: 'carry:a08-boar:square',
        scene: {
          id: 'a08-14-square',
          lines: [
            N('Back in the village, under the stars, the square is full of long tables. Every spit has a boar on it, turning.'),
            V('Tonight, we feast! Twelve tasks, twelve boars! Thirteen, for the referee. Fourteen, for Obelix. Well, fifteen.', 'happy'),
            N('Pupus has come too, in a borrowed tunic, looking pleased and out of place. Nobody seems to mind that he’s Roman tonight.'),
            N('You carry benches. Your Nubbin and Dogmatix carry a single bone between them, very seriously, and lose it under a table.'),
            N('Then, from a hut at the edge of the square, comes the sound of somebody tuning a lyre. It goes on for some time.'),
            BD('Friends! To honour our heroes, I have written a new song. Forty-two verses, one for each…', 'happy'),
            N('Every head in the village turns, and nobody says anything. Asterix looks at Obelix, and Obelix looks at you.'),
          ],
          choices: [
            {
              id: 'let',
              label: '“Let him sing one verse.”',
              then: [BD('One verse! The first verse is the overture, which is in seven parts…', 'happy'), N('The village quietly starts looking round for something to tie him up with.')],
            },
            {
              id: 'rope',
              label: 'Look round for some rope.',
              then: [N('There is no rope; somebody used it on a cart. The village starts looking round for something else to tie him up with.')],
            },
          ],
        },
        done: {
          id: 'a08-14-square-done',
          lines: [A('Referee. You haven’t still got that form from the Place That Sends You Mad, have you?')],
        },
      },
      {
        id: 'a08-14-s2',
        goal: 'Watch the village deal with the bard.',
        hint: 'Find your form from task VIII in your satchel, and give it to Asterix.',
        check: 'give:a08-form:asterix',
        scene: {
          id: 'a08-14-tie',
          lines: [
            N('You take the form out of your satchel, where it has been since the porter handed it back. It is covered in stamps.'),
            N('Your Nubbin and Dogmatix sit at your feet and look up at it, as if they would also like to know what it says.'),
            A('That might do nicely.'),
            BD('What? What are you doing? I haven’t even started the overture!', 'shock'),
            G('Hold still, Cacofonix. If it’s long enough, it’s an honour. You’ll be bound in official papers.'),
            N('Getafix reads the form’s heading by the light of the fire, and his eyebrows go up.'),
          ],
        },
        done: {
          id: 'a08-14-tie-done',
          lines: [N('The whole village gathers round to see what you wrote, back in the building of endless counters.')],
        },
      },
    ],
    complete: {
      id: 'a08-14-complete',
      lines: [
        N('Then the feast goes on until the stars wheel round. Obelix eats four boars, then asks, hopefully, about the main course.'),
        G('For the referee. You’ve seen what it does. Use it kindly.', 'soft'),
        N('Getafix gives you a tiny cauldron, no bigger than a cup, with something glimmering inside. Obelix looks at it, and sighs.'),
        V('And a helmet, with wings! And a menhir! Obelix, give the referee a menhir. A small one.', 'happy'),
        O('This is my smallest one. I made it specially. It’s got a little face on it, look.', 'happy'),
        N('Far overhead, Asterix’s javelin whistles past going east, still going. Somewhere, Verses is still following Stick.'),
        P('Will you come back? You could referee the next lot. Caesar is already thinking of something.', 'soft'),
        N('The map closes round you like a hand. You are in the Grove, with a cauldron, a helmet, a very small menhir, and a dog’s hair on your sleeve.'),
      ],
    },
    rewards: [
      {
        id: 'a08-winged-helmet',
        kind: 'cosmetic',
        label: 'Winged helmet',
        description: 'A little round helmet with a white wing on each side, from the chief. Any Nubbin can wear it, and stands up straighter.',
      },
      {
        id: 'a08-menhir',
        kind: 'decor',
        label: 'Obelix’s smallest menhir',
        description: 'A standing stone about knee-high, with a little face carved on it. Obelix made it specially. It goes anywhere in the Grove.',
      },
      {
        id: 'a08-potion-cauldron',
        kind: 'feature',
        label: 'Getafix’s little cauldron',
        description: 'A cup-sized cauldron of glimmering potion that never runs dry. Before any race, a Nubbin may sip once, for one great sprint in that race.',
      },
      {
        id: 'a08-price-of-power-bookmark',
        kind: 'item',
        label: 'Price of Power Bookmark',
        description: 'A strip of wax tablet on a red cord, with twelve ticks scratched in it. It counts towards the Price of Power festival.',
      },
    ],
    sets: { 'a08-14': true, 'a08-done': true },
    notes:
      'THE BANQUET. The bard tied up is the source’s running joke; it is affectionate, he is not hurt, and in the ' +
      'complete scene he is still bound but has been given a plate (staging: draw him tied to a tree with a full plate in ' +
      'his lap). His song is never sung, so there are no lyrics. FORM PAYOFF (a08-form, from A8-9): straight after ' +
      'a08-14-tie-done and before a08-14-complete, play exactly one of ATLAS_A08_VARIANTS: loop → a08-14-bard-loop; ' +
      'boar → a08-14-bard-boar; plain → a08-14-useful (the form is too sensible to tie anyone up with; Getafix files it ' +
      'under "Useful", and the village uses an old fishing net instead). If a08-form is somehow unset, play ' +
      'a08-14-bard-loop. REWARDS (one-time, at a08-14-complete): the winged helmet (cosmetic), the menhir (decor), the ' +
      'potion cauldron (feature: in a race, a sprint once per race, unlimited races; never a timer, and it never raises ' +
      'stats; it is not a drink for people), and the Price of Power Bookmark. SIM: the Price of Power festival (A1, A4, ' +
      'A8 and the others in its list, any two) reads atlasDone(\'A8\') from a08-done. The javelin passing over is the ' +
      'last callback to A8-3.',
  },
];

// =================================================================== variants

/**
 * The form payoff at the Banquet (A8-14). Play exactly one, chosen by a08-form, straight after
 * a08-14-tie-done and before a08-14-complete. Default (unset): a08-14-bard-loop.
 */
export const ATLAS_A08_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- a08-form = loop
  {
    id: 'a08-14-bard-loop',
    lines: [
      G('Form 0. Application to Find Out Whether You Need This Form. Please attach a completed copy of this form.', 'think'),
      N('Every clerk in the building has dutifully attached a completed copy. It unrolls down to your knees, and keeps going.'),
      N('There is a silence. Then the chief laughs so hard he falls off his shield, and the whole village goes with him.'),
      G('It never ends. It cannot be finished. Of course: it’s perfect for him.', 'happy'),
      N('They wind it round Cacofonix and the oak tree seven times, and there is still some left over to tie a bow.'),
      BD('This is an outrage. I shall write a song about it. In forty-two verses.', 'angry'),
      O('You can’t. Your arms are inside a form.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- a08-form = boar
  {
    id: 'a08-14-bard-boar',
    lines: [
      G('Proof That You Are Not a Boar. To be signed by a boar. And it has been. By a boar who signs with his knuckle.', 'think'),
      N('Obelix goes pink with pride. Every clerk in the building has stamped it, and somebody has added a note: “Boar to be found.”'),
      V('Ha! Our referee made it! The silliest form in Gaul!', 'happy'),
      N('The notes run on for pages, each asking politely after the boar. It unrolls to your knees, and keeps going.'),
      N('They wind it round Cacofonix and the oak tree until only his hat shows over the top, and a corner of the hoof print.'),
      BD('I am not a boar. I wish to state, for the record, that I am not a boar.', 'angry'),
      G('It’s all right. You have it in writing now.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- a08-form = plain
  {
    id: 'a08-14-useful',
    lines: [
      G('Name. What you need. Signature. One page.', 'think'),
      N('Getafix reads it twice, slowly, and then he doesn’t hand it over. He rolls it up and tucks it in his robe.'),
      G('This is far too good for tying up a bard. I shall file this under "Useful". It is the only thing in that folder.', 'happy'),
      A('It didn’t win, though. It was too sensible to win.'),
      G('Sensible things often lose on the day. Then people use them for years.', 'soft'),
      N('In the end they tie Cacofonix up with an old fishing net, which he says, through the holes, is an insult to his art.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads no Grove flag and writes none. */
export const ATLAS_A08_FLAGS: string[] = [
  'a08-01',
  'a08-02',
  'a08-03',
  'a08-04',
  'a08-05',
  'a08-06',
  'a08-07',
  'a08-08',
  'a08-09',
  'a08-10',
  'a08-11',
  'a08-12',
  'a08-13',
  'a08-14',
  'a08-done', // A8-14: the whole page; atlasDone('A8')
  'a08-09-form-made', // A8-9 step 3: the form exists as a prop
  'a08-form', // loop | boar | plain (a08-09-form): the signature choice; pays off at A8-14
];

export const ATLAS_A08_CHECKS: string[] = [
  'visit:a08-page:village',
  'watch:a08-caesar:challenge',
  'walk:a08-track:course',
  'race:a08-asbestos:road',
  'carry:a08-javelins:field',
  'watch:a08-javelin:field',
  'inspect:a08-rulebook:cilindric',
  'watch:a08-bout:ring',
  'escort:a08-boat:isle',
  'escort:a08-asterix:boat',
  'visit:a08-iris:tent',
  'sit:a08-iris:stare',
  'carry:a08-dishes:kitchen',
  'watch:a08-feast:hall',
  'explore:a08-cave:mouth',
  'find:a08-beast:chamber',
  'talk:a08-porter',
  'puzzle:a08-place:counters',
  'craft:a08-form:impossible',
  'deliver:a08-form:counter-one',
  'walk:a08-ravine:edge',
  'find:a08-log:ravine',
  'climb:a08-mountain:summit',
  'puzzle:a08-riddle:summit',
  'wait:a08-plain:midnight',
  'talk:a08-ghost',
  'escort:a08-village:rome',
  'watch:a08-circus:arena',
  'carry:a08-boar:square',
  'give:a08-form:asterix',
];
