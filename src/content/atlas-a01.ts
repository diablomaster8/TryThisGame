/**
 * Atlas campaign, page A1: The Brothers’ Bargain (Part L). Twenty quests, A1-1 to A1-20.
 *
 * SOURCE. Fullmetal Alchemist by Hiromu Arakawa (Square Enix, Monthly Shōnen Gangan, 2001–10),
 * and the anime Fullmetal Alchemist: Brotherhood (Bones, 64 episodes, 2009–10). Rights:
 * © Hiromu Arakawa / Square Enix, and the Brotherhood production committee (Aniplex, MBS);
 * English manga by VIZ Media, English anime track by Funimation (Crunchyroll). Fully in
 * copyright: this page needs a licence before ship. The characters must look exactly as
 * licensed: there are no Grove versions of them.
 *
 * AUDIENCE. 'teen' (13+): the main game only, behind the Mature content setting (Off by
 * default), never the Learning Grove (canon 20). So no childLines.
 *
 * FRAME. Nova’s atlas falls open at a map of a country with a chalk circle drawn right across it.
 * You and your Nubbin step in at Resembool, a green country of sheep and windmills, and the page
 * carries you through the brothers’ years. Ed and Al keep their story: you never fight, never
 * transmute, never decide anything that is theirs. You carry messages, find things, hand over
 * parts, and stand with people. Your Nubbin rides inside Al’s armour, the way Al hides stray cats
 * in there (from A1-1’s close; Ed pretends not to know). Nubbins never speak, and nobody in this
 * world is a talking animal (Xiao-Mei, May’s tiny panda, squeaks and nothing more).
 *
 * ORDER. The quests follow Brotherhood’s episode order (fix pass, docs/atlas.md, Sources). Part L
 * lists the twenty quests a little out of that order, so three pairs are reordered and nothing is
 * cut: the State Exam (ep. 2) now comes before Lior (ep. 3); Tucker (ep. 4) and Scar (ep. 5)
 * before the automail rebuild in Resembool (ep. 6, after Scar breaks the arm); and the Devil’s
 * Nest (ep. 13–14) before the Prince of Xing (ep. 15). Lab 5 stays A1-7 (eps. 7–8), so its
 * payoff stays nine quests later in A1-16, and Winry’s and Mustang’s moments stay A1-13 and A1-17.
 * Episodes: Gate and exam 2; Lior 3; Tucker 4; Scar 5; automail 6; Lab 5 7–8 (with ep. 9’s
 * doubt); the phone box 10; Rush Valley 11; the island 12; the Nest 13–14; Ling 15–16; Winry
 * and Scar 22; Gluttony 24–25; Briggs 33; the Promised Day 50–54; the eclipse 59–61; Al’s gift
 * 62–63; the exchange 63–64.
 *
 * GROVE FLAGS READ. None in this script. The Part L outline names no Grove flag for this page, so
 * no scene here varies on Grove state and, like every Atlas page, it never writes a Grove flag.
 * Hazel’s margin note for this page (A1-20, “Equivalent Exchange”: “He gave up the thing he was
 * best at to bring his brother home. Cheap at the price. H.”) is S24’s data, not this file’s: the
 * engine shows it once s24Done is set (side-stories-s24.ts, HAZEL’S MARGIN NOTES). This page has
 * no margin-note variant of its own, by design.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a01-):
 *   - a01-01 … a01-20: each quest on completion. a01-done: the whole page (A1-20); the Price of
 *     Power festival (A1, A4, A8, any two) reads it through atlasDone('A1').
 *   - a01-exam = study | doubt (A1-2, a01-02-books). Picks Ed’s line to his teacher in A1-10’s
 *     complete scene (a01-10-complete, or ATLAS_A01_VARIANTS a01-10-complete-doubt).
 *   - a01-notes = kept | burnt (A1-7, a01-07-notes). THE SIGNATURE CHOICE. Paid off nine quests
 *     later in A1-16: kept, the notes are the proof that wins Central’s gate in time
 *     (a01-16-gate, a01-16-complete); burnt, Ed rebuilds them from memory and it costs the night
 *     (variants a01-16-gate-burnt, a01-16-complete-burnt). Also echoed in A1-15’s complete line.
 *   - a01-winry = spoke | silent (A1-13, a01-13-gun). Paid off five quests later in A1-18 (Scar
 *     at the reverse circle: a01-18-reverse-done, or variant a01-18-reverse-done-silent).
 *   - a01-roy = spoke | silent (A1-17, a01-17-envy). Paid off three quests later in A1-20
 *     (a01-20-complete, or variant a01-20-complete-silent).
 *   Each of these four is set by a required choice, so it is always set before its payoff. If a
 *   save somehow lacks one, the base scene plays (study, kept, spoke, spoke); a variant plays only
 *   when its flag holds exactly the value named above.
 *
 * LIFTED TEXT. One motto, counted as one of the page’s three allowed one-sentence quotes: Izumi’s
 * riddle “One is all, and all is one” (A1-10, a01-10-shore, and Ed’s answer in a01-10-fire). It
 * is the series’ own short doctrine and the island quest turns on it, so it stays verbatim.
 * Every other line is original. The famous opening on equivalent exchange, Ed’s words
 * to Rose, Mustang’s line about the rain and Ed’s last answer at the Gate are all told as beats,
 * in new words, never close paraphrase. Alchemy is described plainly (clapped hands, chalk, blue
 * light); no source terms beyond the series’ own names for people, places and the Stone.
 *
 * CARE NOTES.
 *   - Tucker (A1-4): the chimera is offscreen and implied. It is never seen, described or heard.
 *     You wait on the step with Al’s hand on your shoulder; Ed comes out. Nina is never named in
 *     the aftermath (A1-5 opens with Hughes saying Scar got there first, and no more).
 *   - Combat is non-graphic throughout: no blood, no wounds shown. The rebound in A1-1 is light
 *     and an empty set of clothes; Ed’s lost leg and arm are said once, plainly. Martel (A1-11),
 *     Hughes (A1-8), Envy (A1-17), Father (A1-19) and Hohenheim (A1-20) all go offscreen or
 *     quietly. Envy’s true shape is voices and too many hands in the dark, never faces in detail.
 *   - The Ishval war is history the characters carry; Ishvalans are a people with a faith, never
 *     a menace. Scar is a man with a reason, not a monster. Miles is treated with the same care.
 *   - Izumi’s lost child (A1-10) is said once, in her words, and left alone.
 *   - The Keeper never takes a hero’s moment: at the gun (A1-13) and the flame (A1-17) Winry and
 *     Mustang decide for themselves either way. Your choice only changes who remembers what.
 *   - The third rule (sit down next to them and wait) is acted in A1-3, A1-13 and A1-17, never
 *     quoted. Hazel is not mentioned in this page’s script (her one margin note is S24’s, above).
 *   - Ed’s height is a running joke, never cruel. Your Nubbin hides inside Al when it is scared.
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

const WHERE = 'Nova’s atlas: the Brothers’ Bargain page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const src = (beat: string) => `Fullmetal Alchemist: Brotherhood (Hiromu Arakawa; Bones, 2009–10): ${beat}`;
const LIC = 'Fullmetal Alchemist; licensed design, exactly as drawn in the source';

// ------------------------------------------------------------------ speakers

const ED = sp('a01-ed', 'Ed', `Edward Elric, the Fullmetal Alchemist (${LIC})`);
const AL = sp('a01-al', 'Al', `Alphonse Elric, Ed’s younger brother, a soul bound to a suit of armour (${LIC})`);
const WINRY = sp('a01-winry', 'Winry', `Winry Rockbell, automail mechanic, the brothers’ oldest friend (${LIC})`);
const PINAKO = sp('a01-pinako', 'Granny Pinako', `Pinako Rockbell, Winry’s grandmother (${LIC})`);
const MUSTANG = sp('a01-mustang', 'Colonel Mustang', `Roy Mustang, the Flame Alchemist (${LIC})`);
const HAWKEYE = sp('a01-hawkeye', 'Lieutenant Hawkeye', `Riza Hawkeye, Mustang’s adjutant (${LIC})`);
const HUGHES = sp('a01-hughes', 'Lieutenant Colonel Hughes', `Maes Hughes, Mustang’s best friend (${LIC})`);
const ARMSTRONG = sp('a01-armstrong', 'Major Armstrong', `Alex Louis Armstrong, the Strong Arm Alchemist (${LIC})`);
const BRADLEY = sp('a01-bradley', 'Führer Bradley', `King Bradley, the Führer of Amestris (${LIC})`);
const CORNELLO = sp('a01-cornello', 'Father Cornello', `Cornello, the false prophet of Lior (${LIC})`);
const ROSE = sp('a01-rose', 'Rose', `Rose Thomas, a believer in Lior (${LIC})`);
const TUCKER = sp('a01-tucker', 'Mr Tucker', `Shou Tucker, the Sewing-Life Alchemist (${LIC})`);
const NINA = sp('a01-nina', 'Nina', `Nina Tucker, his small daughter (${LIC})`);
const SCAR = sp('a01-scar', 'Scar', `Scar, the Ishvalan avenger (${LIC})`);
const IZUMI = sp('a01-izumi', 'Izumi', `Izumi Curtis, the brothers’ teacher, a housewife and butcher’s wife in Dublith (${LIC})`);
const PANINYA = sp('a01-paninya', 'Paninya', `Paninya, the pickpocket of Rush Valley with automail legs (${LIC})`);
const DOMINIC = sp('a01-dominic', 'Dominic', `Dominic LeCoulte, the automail maker who built Paninya’s legs (${LIC})`);
const SATELLA = sp('a01-satella', 'Satella', `Satella, Dominic’s daughter-in-law (${LIC})`);
const GREED = sp('a01-greed', 'Greed', `Greed, the homunculus of the Devil’s Nest (${LIC})`);
const MARTEL = sp('a01-martel', 'Martel', `Martel, one of Greed’s crew, a former soldier (${LIC})`);
const LING = sp('a01-ling', 'Ling', `Ling Yao, the twelfth prince of Xing (${LIC})`);
const LANFAN = sp('a01-lanfan', 'Lan Fan', `Lan Fan, Ling’s bodyguard (${LIC})`);
const MAY = sp('a01-may', 'May Chang', `May Chang, a princess of Xing and an alkahestrist, with her tiny panda Xiao-Mei (${LIC})`);
const ENVY = sp('a01-envy', 'Envy', `Envy, the shape-changing homunculus (${LIC})`);
const OLIVIER = sp('a01-olivier', 'General Armstrong', `Olivier Mira Armstrong, commander of Fort Briggs (${LIC})`);
const MILES = sp('a01-miles', 'Major Miles', `Miles, Olivier Armstrong’s aide, of Ishvalan descent (${LIC})`);
const FATHER = sp('a01-father', 'Father', `Father, the Dwarf in the Flask (${LIC})`);
const HOHENHEIM = sp('a01-hohenheim', 'Hohenheim', `Van Hohenheim, the brothers’ father (${LIC})`);
const TRUTH = sp('a01-truth', 'The One at the Gate', `Truth, the white figure before the Gate (${LIC}; drawn as a white outline, no face but a mouth)`);

const N = say('narrator');
const Y = say('you');
const E = say('a01-ed');
const A = say('a01-al');
const W = say('a01-winry');
const PK = say('a01-pinako');
const RM = say('a01-mustang');
const RH = say('a01-hawkeye');
const HU = say('a01-hughes');
const AR = say('a01-armstrong');
const BR = say('a01-bradley');
const CO = say('a01-cornello');
const RO = say('a01-rose');
const TU = say('a01-tucker');
const NI = say('a01-nina');
const SC = say('a01-scar');
const IZ = say('a01-izumi');
const PA = say('a01-paninya');
const DO = say('a01-dominic');
const SA = say('a01-satella');
const GR = say('a01-greed');
const MA = say('a01-martel');
const LI = say('a01-ling');
const LF = say('a01-lanfan');
const MC = say('a01-may');
const EN = say('a01-envy');
const OL = say('a01-olivier');
const MI = say('a01-miles');
const FA = say('a01-father');
const HO = say('a01-hohenheim');
const TR = say('a01-truth');

// ------------------------------------------------------------------ shared pieces

/** A1-20: the road home, after Mustang’s lines (both a01-roy variants). */
const A20_END: Line[] = [
  N('A few weeks later, in Resembool. Al is in a wheelchair, getting stronger, and hungry all the time, and delighted about it.'),
  N('Hohenheim sits down by Trisha’s grave in the sun, with an armful of flowers, and goes to sleep there, smiling.', 'soft'),
  W('So. No more alchemy. What are you going to do with yourself, Ed?'),
  E('See the world. Learn everything I missed. Al too, when he can walk. And then come back here. If that’s all right.'),
  W('…It’s all right.', 'soft'),
  N('Ed holds out his real hand to shake on it, very seriously, like a deal. Winry laughs at him, and takes it.'),
  N('Your Nubbin climbs into Al’s lap and, out of long habit, looks for the way in. There isn’t one. There is just Al.'),
  A('Sorry. No room in here now. It’s all me.', 'happy'),
  N('It settles in his lap instead, which turns out to be warmer.'),
  N('The page shuts like the lid of a pocket watch. You are back in the Grove, and your Nubbin has chalk on its feet.'),
];

// =================================================================== THE BROTHERS' BARGAIN

export const ATLAS_A01: Quest[] = [
  // ---------------------------------------------------------------- A1-1
  {
    id: 'a01-01',
    code: 'A1-1',
    title: 'The Gate',
    source: src('ep. 2, the brothers’ attempt to bring their mother back, told in flashback'),
    audience: 'teen',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove and Mature content is set to 13+ or 18+; the first quest on the page.',
    },
    speakers: [ED, AL],
    steps: [
      {
        id: 'a01-01-s1',
        goal: 'Step into the page and find the lit window.',
        hint: 'Touch the chalk circle on the map, then follow the lane to the only house with a light on.',
        check: 'explore:a01-resembool:lane',
        scene: {
          id: 'a01-01-page',
          lines: [
            N('Nova’s atlas falls open at a map of a country you don’t know. Someone has drawn a chalk circle right across it.'),
            N('The chalk is still dusty. When you touch it, your fingers come away white, and then the page is a night lane between fields.'),
            N('Sheep somewhere, and a windmill creaking. One house down the lane has a light on in a window low to the ground.'),
            N('Your Nubbin walks close enough to your ankles to trip you. It doesn’t like this page yet.'),
            N('Through the window you can see two boys on their knees on the floor. The smaller one is holding the chalk.'),
            N('The page puts a thought in your head, quite firmly, the way a book does. You may watch, but you may not touch.'),
          ],
          choices: [
            {
              id: 'knock',
              label: 'Knock on the glass anyway.',
              then: [N('Your knuckles go through the window like it’s mist. Nobody inside hears a thing.', 'sad')],
            },
            {
              id: 'watch',
              label: 'Crouch by the window and watch.',
              then: [N('You crouch in the wet grass. Your Nubbin climbs into your lap and won’t be moved.')],
            },
          ],
        },
        done: {
          id: 'a01-01-page-done',
          lines: [N('You count the boys’ ages by their elbows and knees. Eleven, maybe, and ten.')],
        },
      },
      {
        id: 'a01-01-s2',
        goal: 'Watch what the brothers do in the circle.',
        hint: 'Stay at the window. You can’t stop it. You can only see it.',
        check: 'watch:a01-gate:elric-study',
        scene: {
          id: 'a01-01-circle',
          lines: [
            E('We did the sums twice. Water, carbon, the lot. All of it, down to the last bit of salt.'),
            A('Brother, what if the sums aren’t the hard part?', 'think'),
            E('Then we’ll learn the hard part too. We’re good at learning. Hands down, Al.'),
            N('On a chair by the wall there’s a photograph of a woman laughing at whoever held the camera.'),
            N('The boys press their palms to the edge of the chalk. The circle lights up, blue and very bright.'),
            N('Then the blue goes wrong. It turns dark from the middle out, and the light starts pulling instead of shining.'),
            A('Brother!', 'shock'),
            N('The room is full of a noise like a great door opening. When it stops, there is only one boy on the floor.'),
            N('Where Al was kneeling, there is a heap of his clothes. Ed’s left leg is gone below the knee.', 'sad'),
          ],
        },
        done: {
          id: 'a01-01-circle-done',
          lines: [
            N('What lies in the middle of the circle isn’t their mother. You look away, and the page lets you.', 'sad'),
          ],
        },
      },
      {
        id: 'a01-01-s3',
        goal: 'Stay until it’s over.',
        hint: 'Keep watching through the window. Your Nubbin will stay with you.',
        check: 'wait:a01-gate:elric-study',
        scene: {
          id: 'a01-01-armour',
          lines: [
            N('Ed drags himself across the floor to an old suit of armour in the corner. He is saying his brother’s name over and over.'),
            N('He draws a small circle on the inside of the helmet with his own thumb. His hands are shaking so hard it takes three tries.'),
            E('Give him back. He’s my brother. Take my arm, take anything, but give him back.', 'shock'),
            N('The blue light comes again. When it goes, Ed’s right arm has gone with it.'),
            N('In the corner, the empty armour lifts its head. There is a soft light deep inside the helmet, where eyes would be.'),
            A('Brother? Brother, what happened? Why can’t I… I can’t feel the floor.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-01-complete',
      lines: [
        N('The page turns under you like a slow wave. When it settles, it’s four years on and bright morning.'),
        N('A short young man in a red coat is arguing with a station porter. Beside him, a huge suit of armour is apologising for him.'),
        A('He doesn’t mean it. He’s just tired. Oh! Hello. Are you lost? You look a bit lost.'),
        N('Your Nubbin walks straight up to the armour and knocks on its shin, as if asking to come in.'),
        A('Oh. Oh, you’re lovely. Brother, can it… there’s room. There’s always room.', 'happy'),
        E('Al, if there’s a cat in there again I swear… fine. Fine. Just the one.', 'angry'),
        N('Al lifts the breastplate a little. Your Nubbin climbs in, turns round twice, and settles where a heart would be.'),
        N('Nobody mentions the window. You don’t think they know you saw.'),
      ],
    },
    rewards: [],
    sets: { 'a01-01': true },
    notes:
      'OPENING: the map with the chalk circle washes into a night lane (two seconds). The page is a flashback, ' +
      'so the window is fixed glass: the player can walk the lane and garden but cannot open any door. The ' +
      'rebound is light and sound only: blue, then dark, then a slam like a door. Nothing inside the circle is ' +
      'shown at all; the camera stays on the window frame and Ed’s face (a01-01-circle-done). No blood. From the ' +
      'complete scene on, your Nubbin rides inside Al’s armour on this page (a small glow behind his breastplate ' +
      'when it shifts). It climbs out whenever a scene says so.',
  },

  // ---------------------------------------------------------------- A1-2
  {
    id: 'a01-02',
    code: 'A1-2',
    title: 'A Dog of the Military',
    source: src('ep. 2, Mustang’s visit, the year of automail and study, the State Alchemist exam'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-1') },
    requires: ['A1-1'],
    speakers: [ED, AL, MUSTANG, HAWKEYE, PINAKO, BRADLEY],
    steps: [
      {
        id: 'a01-02-s1',
        goal: 'Sit in on the visit from the colonel in the blue coat.',
        hint: 'The page folds back four years. Go to the Rockbells’ front room.',
        check: 'talk:a01-mustang:rockbell-house',
        scene: {
          id: 'a01-02-visit',
          lines: [
            N('The page folds back on itself. You are in a bright front room, and Ed is eleven again, in a wheelchair, staring at nothing.'),
            N('The armour sits in the corner, very still, so it won’t frighten anyone. It frightens everyone anyway.'),
            RM('I came all the way out here because I heard a pair of children had real talent. I find a wreck.'),
            RH('Sir.', 'think'),
            RM('There’s an exam. Pass it and the army gives you money, books, any library in the country. You’d be a State Alchemist.'),
            RM('And a dog of the military. People will say so. Some of them will spit when you go by.'),
            N('Ed looks at the armour, and the armour looks back at Ed. Neither says anything, which is how you know they’ve decided.'),
            PK('He’s a boy. He’s a boy with one leg and one arm and a stubborn streak you could build a bridge on.', 'angry'),
          ],
        },
        done: {
          id: 'a01-02-visit-done',
          lines: [
            E('Granny. I need the automail. I need it fast.'),
            PK('It takes three years to learn to walk on it properly.'),
            E('Then I’ll do it in one.'),
          ],
        },
      },
      {
        id: 'a01-02-s2',
        goal: 'Keep Ed company through his year of work.',
        hint: 'Bring the books to the kitchen table, where he’s sitting up late.',
        check: 'choose:a01-exam:kitchen',
        scene: {
          id: 'a01-02-books',
          lines: [
            N('A year passes in pages. The kitchen table disappears under books, then under more books.'),
            N('Ed’s new arm is steel and bolts, and every morning it hurts to wear. He wears it anyway, and he walks.'),
            E('Don’t say it. I know what you’re going to say. Granny says it every night.'),
            E('This is the fastest road to a way back. For Al. I’m not turning round.'),
            N('Al’s helmet is turned towards the window, where the moon is. He doesn’t need sleep any more, so he keeps watch.'),
            N('Ed has a book open that he can’t follow. You can see him reading the same line again.'),
          ],
          choices: [
            {
              id: 'study',
              label: 'Sit down and test him on the hard chapter.',
              set: { 'a01-exam': 'study' },
              then: [
                N('You read him the questions. He gets the first one wrong, the second one right, and the third one in his sleep.'),
                E('Again. From the top. Thanks.'),
              ],
            },
            {
              id: 'doubt',
              label: 'Ask him if he’s sure this is the only road.',
              set: { 'a01-exam': 'doubt' },
              then: [
                E('No. I’m not sure. I’m not sure of anything.', 'sad'),
                E('But it’s the only road that goes anywhere fast. Ask me again when Al can feel the rain.'),
                N('He doesn’t shut the book. But he doesn’t forget you asked, either.'),
              ],
            },
          ],
        },
      },
      {
        id: 'a01-02-s3',
        goal: 'Go with the brothers to the exam in Central City.',
        hint: 'Stand at the back of the hall with Al and watch the practical test.',
        check: 'watch:a01-exam:central',
        scene: {
          id: 'a01-02-exam',
          lines: [
            N('Central City is grey stone and flags. The exam hall is full of grown men who look at Ed and smile, until they don’t.'),
            N('Ed walks into the middle of the floor and claps his hands. No chalk, no circle.'),
            N('The floor rises into a long spear under his palms. The whole room breathes in at once.'),
            N('The Führer himself is watching from a high chair. He has one eye covered and a pleasant, grandfatherly smile.'),
            BR('No circle. How interesting. And how old are you, young man?'),
            E('Twelve, sir.'),
            BR('Twelve. Then we shall call you Fullmetal. It suits someone with that much iron in him.', 'happy'),
          ],
        },
        done: {
          id: 'a01-02-exam-done',
          lines: [
            N('Al’s armour creaks very softly, the way it does when he’s proud and trying not to show it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-02-complete',
      lines: [
        N('Back in Resembool, the brothers walk up to their own house in the dark with a can of lamp oil.'),
        E('If it’s standing, we’ll want to come back. So it can’t be standing.'),
        A('It was Mum’s house too, Brother.', 'sad'),
        E('I know.'),
        N('They burn it. Winry, their oldest friend, cries on the porch. Granny Pinako doesn’t tell her not to.'),
        N('Ed scratches the date into the lid of his silver watch, so he can’t forget it. You stand with them until the roof goes.'),
      ],
    },
    rewards: [],
    sets: { 'a01-02': true },
    notes:
      'FLASHBACK: still in the brothers’ past (ep. 2). Mustang’s offer, Pinako’s “three years” and Ed’s “one” are ' +
      'the source’s beats in new words. The practical exam is a spear from the floor; it is never pointed at ' +
      'Bradley here (keep it simple and non-threatening). The house fire is a slow orange glow from the porch, ' +
      'nobody near it. a01-exam is read only by A1-10’s complete scene.',
  },

  // ---------------------------------------------------------------- A1-3
  {
    id: 'a01-03',
    code: 'A1-3',
    title: 'The Prophet of Lior',
    source: src('ep. 3, Father Cornello and the false Stone'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-2') },
    requires: ['A1-2'],
    speakers: [ED, AL, CORNELLO, ROSE],
    steps: [
      {
        id: 'a01-03-s1',
        goal: 'Get to Lior and see the miracle in the square.',
        hint: 'Follow the radio voice to the crowd under the temple steps.',
        check: 'visit:a01-lior:square',
        scene: {
          id: 'a01-03-square',
          lines: [
            N('The page flicks forward four years. Ed’s watch has a date in its lid now.'),
            N('Lior is a desert town of white walls. Every radio in every window is playing the same man’s voice.'),
            CO('The sun god Leto loves you. Leto sees you. Leto will give you back what you have lost.'),
            N('On the temple steps, a robed man touches a bunch of dead flowers. They burst into a statue of bright brass.'),
            N('The crowd sighs. A girl in a pink scarf presses her hands together so hard her knuckles go pale.'),
            E('That’s alchemy. Bad alchemy, too. You can see the seams.', 'angry'),
            A('Brother, keep your voice down. They’re praying.'),
            RO('He’s going to bring Cain back. He promised. Cain is my… was my…', 'sad'),
            E('Bring back the dead. Right.'),
          ],
        },
        done: {
          id: 'a01-03-square-done',
          lines: [
            E('That ring on his finger’s meant to be the Philosopher’s Stone. If it’s real, we need it. If it’s not…'),
            A('If it’s not, she’s waiting for nothing.'),
          ],
        },
      },
      {
        id: 'a01-03-s2',
        goal: 'Find the room the radio voice comes from.',
        hint: 'Slip round the back of the temple while Ed keeps Cornello talking.',
        check: 'find:a01-microphone:temple',
        scene: {
          id: 'a01-03-temple',
          lines: [
            N('Inside the temple Ed is being as rude as possible to Cornello, which is very rude indeed.'),
            CO('A child with a dog tag. Do you think your little tricks can touch the power of a god?'),
            N('Al nudges you with an elbow the size of a ham. He points down a corridor, at a door with a cable running under it.'),
            A('That’s where the broadcasts come from. If the switch were on…', 'think'),
            N('The room is full of valves and dials. There’s a big brass switch marked with the sun.'),
            N('Your Nubbin hops out of Al and looks at the switch with great interest.'),
          ],
          choices: [
            {
              id: 'switch',
              label: 'Throw the switch yourself.',
              then: [N('It goes down with a heavy clunk. Somewhere outside, every radio in Lior crackles.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin sit on it.',
              then: [N('It sits, and the switch goes down under it with a clunk. Your Nubbin looks extremely pleased with itself.')],
            },
          ],
        },
        done: {
          id: 'a01-03-temple-done',
          lines: [
            CO('Believers? Fools. They’ll bring me money and their sons for my army, and thank me for it.', 'angry'),
            N('He goes on for another minute, rather pleased with how well his voice carries. So does every radio in town.'),
            N('Outside, the square goes absolutely silent.'),
            N('The ring on Cornello’s finger cracks in half, cheap and red. It was never a Stone at all.'),
          ],
        },
      },
      {
        id: 'a01-03-s3',
        goal: 'Find Rose afterwards.',
        hint: 'She’s sitting on the temple steps after the crowd has gone.',
        check: 'talk:a01-rose:steps',
        scene: {
          id: 'a01-03-rose',
          lines: [
            N('The square has emptied. Rose sits on the steps with her scarf in her lap.'),
            RO('Then what am I supposed to do now? Tell me. You took it away, so you tell me.', 'angry'),
            E('I can’t. Nobody gets to tell you. That’s the bit nobody likes.'),
            E('You get up off that step by yourself, or you sit on it for ever. Your call. Not his, not mine.'),
            N('Ed walks off before she can answer, which is how Ed says hard things. Al stays a moment, helmet bowed.'),
            N('Rose doesn’t look at either of them. She looks at you, because you’re the one still here.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down on the step next to her, and wait.',
              then: [
                N('You sit, and she cries for a while. You don’t say anything, and after a bit she leans on your shoulder.'),
                RO('He’s right. I hate it. He’s right.', 'sad'),
              ],
            },
            {
              id: 'flowers',
              label: 'Pick up a brass flower and give it to her.',
              then: [
                RO('It’s not real.', 'sad'),
                N('She keeps it anyway. Fake things can still be kept, if you know what they are.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a01-03-complete',
      lines: [
        E('Another fake. Another dead end.', 'angry'),
        A('It wasn’t a dead end for her, Brother. She knows the truth now.'),
        E('The truth’s not much to hold on to at night.'),
        A('No. But it’s yours.'),
        N('Your Nubbin climbs back inside Al. It is coming to understand that this is the safest place in any world.'),
      ],
    },
    rewards: [],
    sets: { 'a01-03': true },
    notes:
      'Cornello’s confession goes out over loudspeakers; play his line with a radio crackle and an echo across ' +
      'the square. The fake ring cracks into red glass. Cornello’s chimera from the source is cut. Lior’s god is ' +
      'the story’s own invented faith; keep the believers dignified. The rose-steps choice is flavour only.',
  },

  // ---------------------------------------------------------------- A1-4
  {
    id: 'a01-04',
    code: 'A1-4',
    title: 'A Quiet House',
    source: src('ep. 4, Shou Tucker, Nina and Alexander (handled offscreen)'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-3') },
    requires: ['A1-3'],
    speakers: [ED, AL, TUCKER, NINA, HUGHES],
    steps: [
      {
        id: 'a01-04-s1',
        goal: 'Go with the brothers to Mr Tucker’s house and its great library.',
        hint: 'The big house on the hill in East City. Mind the dog.',
        check: 'visit:a01-tucker:library',
        scene: {
          id: 'a01-04-library',
          lines: [
            N('Mr Tucker’s house is big and quiet and full of books. He made a chimera that could talk, once, and the army paid him for it.'),
            TU('Read anything you like. I have an assessment coming, so I’ll be in my laboratory, I’m afraid. As always.'),
            N('The front door bangs. An enormous white dog lands on Ed and pins him flat.'),
            NI('Alexander! Alexander, sit! Sorry. He likes short people best.', 'happy'),
            E('Who are you calling short?!', 'angry'),
            NI('Is that a Nubbin? In the armour? Can I hold it? I’ll be ever so careful.'),
            N('Your Nubbin climbs out of Al and into the little girl’s arms as if it had always meant to.'),
          ],
        },
        done: {
          id: 'a01-04-library-done',
          lines: [
            NI('Mummy went back to her mum’s. Daddy says. It was a long time ago. Daddy’s busy, mostly.'),
            N('Al’s helmet turns towards the laboratory door, and stays there a moment.'),
          ],
        },
      },
      {
        id: 'a01-04-s2',
        goal: 'Play with Nina and Alexander in the garden.',
        hint: 'Throw the stick for Alexander. Let Nina win the race.',
        check: 'walk:a01-alexander:garden',
        scene: {
          id: 'a01-04-garden',
          lines: [
            N('The brothers read for days. Most afternoons they give up and come out to play.'),
            N('Alexander fetches the stick, and so does your Nubbin. They meet in the middle, and nobody fetches the stick.'),
            NI('When Daddy finishes his work, he’ll play too. He said.', 'happy'),
            N('A tall man with glasses comes up the garden path, waving a photograph above his head like a flag.'),
            HU('Lieutenant Colonel Hughes, Investigations. Is that the Fullmetal Alchemist? Look at this. Look. My daughter.', 'happy'),
            HU('She’s three. She drew me a horse. It looks like a potato, but it’s the best horse in the world.', 'happy'),
            E('We’ve seen it. Twice.'),
            HU('Then a third time won’t hurt you.'),
          ],
        },
        done: {
          id: 'a01-04-garden-done',
          lines: [
            HU('I’ll come and fetch you when it gets dark. Look after that little one. Both little ones.'),
            N('Nina gives your Nubbin back with a kiss on its head. Alexander gives it a lick, which is less welcome.'),
          ],
        },
      },
      {
        id: 'a01-04-s3',
        goal: 'Come back with the brothers the next morning.',
        hint: 'Stay on the front step. Al will ask you to.',
        check: 'wait:a01-tucker:step',
        scene: {
          id: 'a01-04-step',
          lines: [
            N('The next morning the house is very quiet. No barking, and nobody bangs the door.'),
            TU('I passed. I’ve made another one that talks. Come and see, both of you. You’ll understand, you’re alchemists.'),
            N('Ed goes in first. Al follows, then stops in the doorway, and puts one big hand on your shoulder.'),
            A('Stay here. Please. Stay here with your Nubbin.', 'think'),
            N('You stay on the step. For a while there is no sound at all.'),
            N('Then something falls over inside, and Ed is shouting, and then Al is shouting louder, to make him stop.', 'shock'),
          ],
        },
        done: {
          id: 'a01-04-step-done',
          lines: [
            N('Soldiers come, and Hughes, without his photographs. Mr Tucker is led away and doesn’t look at anyone.'),
            N('Nobody brings Nina or Alexander out. You don’t ask, and nobody tells you, and that is the telling.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-04-complete',
      lines: [
        N('It is raining on the steps of the big quiet house. Ed sits in the rain and doesn’t seem to notice it.'),
        E('We’re alchemists. We’re supposed to be able to fix things. That’s the whole point of us.', 'sad'),
        A('We can’t fix everything, Brother. We couldn’t even fix ourselves.', 'sad'),
        E('Then what good are we?'),
        N('Your Nubbin climbs out of Al and sits on Ed’s boot in the rain. Ed doesn’t move it.'),
        N('After a long time, he picks it up and holds it inside his coat, out of the wet.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a01-04': true },
    notes:
      'CARE (Part L care note, read this first): what Tucker made is never seen, described, voiced or named. ' +
      'The camera stays on the front step for the whole of a01-04-step and a01-04-step-done; the door is a dark ' +
      'rectangle. Sound: a long silence, a chair falling, Ed shouting (no words), Al shouting “Brother!” over him. ' +
      'Do not play Tucker’s earlier talking chimera either. Nina and Alexander are only ever happy on screen. ' +
      'Hughes is introduced here on purpose so that A1-8 lands.',
  },

  // ---------------------------------------------------------------- A1-5
  {
    id: 'a01-05',
    code: 'A1-5',
    title: 'Rain of Sorrows',
    source: src('ep. 5, Scar in East City'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-4') },
    requires: ['A1-4'],
    speakers: [ED, AL, HUGHES, SCAR, MUSTANG, HAWKEYE, ARMSTRONG],
    steps: [
      {
        id: 'a01-05-s1',
        goal: 'Carry Hughes’s warning to the brothers.',
        hint: 'Find Hughes at East City headquarters, then the brothers in the market.',
        check: 'deliver:a01-warning:east-city',
        scene: {
          id: 'a01-05-warning',
          lines: [
            HU('There’s a man in East City killing State Alchemists. Five so far. Big fellow, a scar across his face like a cross.'),
            HU('Tucker’s dead. Scar got into the cells last night. He got there first.', 'sad'),
            N('Hughes doesn’t say anything else, and you understand he isn’t going to.'),
            HU('Fullmetal won’t listen to me. He might listen to somebody who isn’t the army. Tell him to stay indoors.'),
            HU('Tell him the rain’s coming in, so he’s got an excuse.'),
            N('Hughes pats the photograph in his breast pocket, from habit, and goes back inside.'),
          ],
        },
        done: {
          id: 'a01-05-warning-done',
          lines: [
            Y('Hughes says stay indoors. The rain’s coming in.'),
            E('Stay indoors. Right. I’ll stay indoors when the Philosopher’s Stone knocks on the door and asks to come in.'),
            A('He means thank you.'),
          ],
        },
      },
      {
        id: 'a01-05-s2',
        goal: 'Get through the alley alive.',
        hint: 'Keep low, keep behind Al, and when the wall goes, run for the crates.',
        check: 'explore:a01-alley:east-city',
        scene: {
          id: 'a01-05-alley',
          lines: [
            N('The rain comes down in sheets. Halfway down an alley a big man steps out in front of you, quite calm.'),
            SC('Fullmetal Alchemist. You twist what God made. I am here to give it back to Him.'),
            N('He puts one hand on the wall. The wall comes apart into gravel and dust.'),
            E('Al, get the kid back! Go!'),
            N('Ed claps and the street rises into a wall between you. Scar walks through it as if it were paper.'),
            N('Then Scar’s hand finds Ed’s steel arm, and it falls to bits in the rain, bolts and all.', 'shock'),
            N('Al throws himself between them. Scar’s palm hits Al’s side and opens a great hole in the armour.'),
            N('Your Nubbin tumbles out of the hole into the gutter, rolls, and comes up spluttering.', 'shock'),
          ],
        },
        done: {
          id: 'a01-05-alley-done',
          lines: [
            E('Leave him. It’s me you want. Let my brother go and I won’t run.'),
            A('Brother, no!', 'shock'),
            N('A gunshot cracks off a wall above Scar’s head. Hawkeye is at the end of the alley, and Colonel Mustang behind her, gloves already on.'),
            RH('Don’t snap in the rain, sir. Your fire won’t light. You’ll only get wet.'),
            N('Armstrong comes over a rooftop with his shirt already off.'),
            AR('Fear not, young Elrics! The Armstrong family has come to your aid!', 'happy'),
            N('Scar goes down a drain, and is gone.'),
          ],
        },
      },
      {
        id: 'a01-05-s3',
        goal: 'Gather up the pieces of Al’s armour.',
        hint: 'The gutter runs downhill. Some pieces have gone a long way.',
        check: 'collect:a01-armour:alley',
        scene: {
          id: 'a01-05-pieces',
          lines: [
            N('Al is sitting in the street with a hole in him. Inside, painted small and red on the metal, is his brother’s seal.'),
            A('Don’t look at that. Don’t touch that, please. If that goes, I go.'),
            A('Brother made that mark, the night it happened. It’s the only thing keeping me here.', 'soft'),
            N('Ed sits on the kerb with one arm. You bring him the pieces one by one, and he holds them in his lap.'),
            N('You find a gauntlet in the drain, a plate under a cart, a rivet by a rain barrel.'),
            N('Your Nubbin finds the little horn off the top of the helmet and carries it back in its mouth, very proud.'),
          ],
        },
        done: {
          id: 'a01-05-pieces-done',
          lines: [
            A('You were going to let him kill you, Brother. You were going to stand there.', 'angry'),
            E('I wasn’t going to leave you.'),
            A('Then live! If you want to save me, stay alive, idiot! That’s how!', 'angry'),
            E('…Yeah. Yeah, all right.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-05-complete',
      lines: [
        RM('He’s Ishvalan. There was a war in Ishval. We won it. That’s the polite word for it.', 'sad'),
        RM('I was there. So was the lieutenant. So was half the army. He has his reasons, and they aren’t madness.'),
        HU('You can’t fight with one arm, Ed. You need your mechanic.'),
        E('Winry’s going to kill me.'),
        HU('She’s going to rebuild you first. Then she’ll kill you. In that order, if you’re lucky.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a01-05': true },
    notes:
      'NON-GRAPHIC: Scar’s power breaks things into dust and gravel; on people it is never shown. Ed’s arm is ' +
      'automail, so it may come apart on screen (bolts and springs). Al’s blood seal is a small dark-red mark, ' +
      'painted, not wet. Mustang’s officers fire into a wall, not at Scar. Hughes’s line about Tucker is all ' +
      'that is ever said; Nina is not named again on this page. Scar’s faith is his people’s own; he is grave, ' +
      'not a monster.',
  },

  // ---------------------------------------------------------------- A1-6
  {
    id: 'a01-06',
    code: 'A1-6',
    title: 'Automail',
    source: src('ep. 6, the road home to Resembool and Winry’s rebuild'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-5') },
    requires: ['A1-5'],
    speakers: [ED, AL, WINRY, PINAKO, ARMSTRONG],
    steps: [
      {
        id: 'a01-06-s1',
        goal: 'Ride home to Resembool with the brothers and the Major.',
        hint: 'Al is travelling in the goods van. Keep him company.',
        check: 'escort:a01-al:train',
        scene: {
          id: 'a01-06-train',
          lines: [
            N('Al is too broken to sit with the passengers, so he rides in the goods van, with the sheep.'),
            A('They’re very nice sheep. This one keeps eating my hand.', 'happy'),
            N('Major Armstrong rides in the van too, out of solidarity, and weeps at the scenery.'),
            AR('The fields of my youth! Not mine, but somebody’s! Behold the noble sheep!', 'happy'),
            N('Your Nubbin is having a staring match with a lamb. It loses.'),
            A('Brother’s up front pretending he isn’t scared of Winry. He’s scared of Winry.'),
          ],
        },
        done: {
          id: 'a01-06-train-done',
          lines: [
            N('Resembool station is a platform and a bench. Winry is on the bench with her arms folded and a wrench in one hand.'),
          ],
        },
      },
      {
        id: 'a01-06-s2',
        goal: 'Hand Winry the parts for Ed’s new arm, in the right order.',
        hint: 'Watch which tray she nods at. Plates, then the wrist, then the fine springs last.',
        check: 'give:a01-parts:rockbell-workshop',
        scene: {
          id: 'a01-06-workshop',
          lines: [
            W('What did you do to it? What did you DO? Did you fight a building?', 'angry'),
            E('Sort of. A man.'),
            W('A man did this. With his hands. To my arm.', 'angry'),
            N('She throws the wrench. It bounces off Ed’s head with a sound like a church bell.'),
            W('Right. You. The one with the Nubbin. You’re on parts. I say a number, you give me that tray. Don’t touch the springs.'),
            PK('She’ll be up three nights. She was always going to be up three nights. She’d be offended otherwise.'),
            N('Winry’s hands move faster than you can follow, and she hums while she works, and she doesn’t once look up.'),
          ],
        },
        done: {
          id: 'a01-06-workshop-done',
          lines: [
            W('Done. Don’t break it. I mean it this time. I always mean it, but this time I really mean it.'),
            N('Ed flexes the new fingers one at a time. He looks at Winry as if he’s about to say something.'),
            E('…It’s a good arm.'),
            W('It’s the best arm. Obviously.'),
          ],
        },
      },
      {
        id: 'a01-06-s3',
        goal: 'Help Ed mend his brother.',
        hint: 'Bring the pieces you saved from the alley out to the yard.',
        check: 'build:a01-armour:rockbell-yard',
        scene: {
          id: 'a01-06-mend',
          lines: [
            N('In the yard, Ed lays out the pieces of Al you carried home. Every one is there.'),
            E('You got the horn. I thought the horn was gone.'),
            N('Your Nubbin, who found the horn, stands up very tall.'),
            N('Ed claps and presses his hands to the armour. The hole closes like water closing over a stone.'),
            A('I can’t feel it. But I can tell it’s right. Does that make sense?'),
            E('Yeah. It does.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-06-complete',
      lines: [
        N('That evening you all sit on the Rockbells’ porch, watching the light go off the hills.'),
        PK('You boys. You come home in pieces and leave in a hurry. Eat something before you go, at least.'),
        A('I can’t eat, Granny.'),
        PK('Then sit at the table while your brother eats, and pretend. It does an old woman good.', 'soft'),
        N('Al sits at the table, with your Nubbin inside him. Ed eats three plates, and nobody mentions his height once.'),
      ],
    },
    rewards: [],
    sets: { 'a01-06': true },
    notes:
      'Step 2 is a small ordering minigame: three trays, Winry nods at one, and a wrong tray just gets a sigh and a ' +
      'pointed finger (no fail state). The wrench bounce is comic, a bell sound and stars. Armstrong’s shirt ' +
      'comes off whenever he is moved; keep it a sparkle effect, no more.',
  },

  // ---------------------------------------------------------------- A1-7
  {
    id: 'a01-07',
    code: 'A1-7',
    title: 'Laboratory 5',
    source: src('eps. 7–9, Marcoh’s notes, Laboratory 5, and Al’s doubt'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-6') },
    requires: ['A1-6'],
    speakers: [ED, AL, ARMSTRONG, WINRY],
    steps: [
      {
        id: 'a01-07-s1',
        goal: 'Help the brothers crack the code in Dr Marcoh’s notes.',
        hint: 'The notes look like a cookbook. Match the ingredients to the letters on Ed’s list.',
        check: 'puzzle:a01-notes:library',
        scene: {
          id: 'a01-07-code',
          lines: [
            N('A borrowed room in Central, papered with notes. An old doctor who once made Stones for the army wrote them, in code.'),
            E('It’s a cookbook. Ten grams of sugar, a cup of milk. Nobody writes a cookbook in a safe.'),
            A('So the sugar isn’t sugar.'),
            E('And the milk isn’t milk. Three days, Al. Three days and it’s still soup.', 'angry'),
            N('Your Nubbin sits on a page and won’t get off, so you lift it. Underneath, Ed has circled the same word five times.'),
            E('Wait. Wait. If that one’s that… then every recipe needs the same thing. Every single one.', 'think'),
            N('He stops writing. The pencil rolls off the desk, and nobody picks it up.'),
            E('The ingredient’s people. Living people. That’s what a Stone is made of.', 'shock'),
          ],
        },
        done: {
          id: 'a01-07-code-done',
          lines: [
            A('Then we can’t. Brother, we can’t ever.', 'sad'),
            E('I know. I know that, Al.'),
            N('Ed folds the decoded pages very small and puts them inside his coat, against his chest.'),
          ],
        },
      },
      {
        id: 'a01-07-s2',
        goal: 'Go with Al to the closed-down laboratory at night.',
        hint: 'The fifth laboratory, behind the prison wall. Al waits outside; Ed goes in.',
        check: 'explore:a01-lab5:gate',
        scene: {
          id: 'a01-07-lab',
          lines: [
            N('The Fifth Laboratory has been shut for years, and someone is keeping its lights on.'),
            E('There’s a circle under this building. A big one. I’m going in. Al, you watch the door.'),
            A('Why is it always me who watches the door?'),
            E('Because you’re the door-shaped one.'),
            N('Ed goes in. In the yard, a second suit of armour clanks out of the dark with a blade for an arm.'),
            N('It speaks with two voices, taking turns. Al steps in front of you without even thinking about it.'),
            A('Get behind the water tank. Keep your Nubbin with you. Don’t come out till I say.'),
            N('Clangs, sparks, Al grunting. Then a deep rumble from inside the building, and the windows begin to glow.', 'shock'),
          ],
        },
        done: {
          id: 'a01-07-lab-done',
          lines: [
            N('The laboratory comes down in a long slow roar. Major Armstrong carries Ed out of the dust, unconscious.'),
            AR('He fought something in there that he won’t be able to explain. Get him to a hospital.'),
          ],
        },
      },
      {
        id: 'a01-07-s3',
        goal: 'Sit by Ed’s hospital bed and decide what to do with the notes.',
        hint: 'He asked you to look after the pages while he sleeps.',
        check: 'choose:a01-notes:hospital',
        scene: {
          id: 'a01-07-notes',
          lines: [
            N('Ed wakes in a hospital bed, bandaged and furious. Al stands in the corner, very still.'),
            A('Brother. That armour told me something. It said you might have made me up. My memories, all of it.', 'sad'),
            A('Did you? How would I even know?', 'sad'),
            E('Al… I…'),
            N('Winry, who arrived an hour ago with a toolbox, puts it down very hard.'),
            W('Al. Ed has been scared since the day it happened. Scared you hate him. He’s never been scared you’re not real.', 'angry'),
            A('…Oh.', 'soft'),
            N('Later, when everyone is asleep, Ed presses the folded notes into your hands.'),
            E('Somebody wants these buried. If I’m out cold again, they’ll come for them. You decide. You’re not the army.'),
            N('The pages are warm from his coat. The ward stove is lit in the corner, and Al’s breastplate is open on the floor.'),
          ],
          choices: [
            {
              id: 'kept',
              label: 'Keep them. Fold them small and hide them inside Al.',
              set: { 'a01-notes': 'kept' },
              then: [
                N('You tuck the notes in a gap behind Al’s breastplate. Your Nubbin lies down on top of them like a hen on eggs.'),
                A('I’ll keep them safe. I don’t sleep. Nobody gets past me.'),
                E('Somebody has to believe us one day. Paper’s good for that.'),
              ],
            },
            {
              id: 'burnt',
              label: 'Burn them. Nobody should ever read this.',
              set: { 'a01-notes': 'burnt' },
              then: [
                N('You feed the pages into the stove one at a time. They curl and go and are gone.'),
                E('Good. Nobody can follow that recipe now.'),
                E('It’s in my head, though. That’s the trouble with me. I can’t burn my head.', 'sad'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a01-07-complete',
      lines: [
        A('Brother, I’m sorry. For asking.'),
        E('Don’t be. Ask me anything. Just never ask me that one again.', 'soft'),
        N('Winry pretends to be fixing something. She has been fixing the same bolt for ten minutes.'),
        N('Outside, the city is dark, and somewhere in it, someone who wears other people’s faces is very annoyed.'),
      ],
    },
    rewards: [],
    sets: { 'a01-07': true },
    notes:
      'THE SIGNATURE CHOICE (a01-notes = kept | burnt, a01-07-notes). Paid off in A1-16 (nine quests later); ' +
      'A1-15’s complete scene names it in passing. Kept: the notes ride inside Al’s armour from here on (a small ' +
      'folded-paper icon in the Atlas journal). Burnt: Ed keeps them in his head, nothing more. ' +
      'Lab 5: the brother-armour (Number 48) is clangs, sparks and sound; Ed’s fight inside with Number 66, ' +
      'Lust and Envy is entirely offscreen. Ep. 9’s doubt is folded in here (merged, see the header).',
  },

  // ---------------------------------------------------------------- A1-8
  {
    id: 'a01-08',
    code: 'A1-8',
    title: 'The Phone Box',
    source: src('ep. 10, Hughes’s last call'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-7') },
    requires: ['A1-7'],
    speakers: [HUGHES, MUSTANG, HAWKEYE],
    steps: [
      {
        id: 'a01-08-s1',
        goal: 'Visit Hughes in the records office.',
        hint: 'Investigations, second floor. He’s the one with photographs on every wall.',
        check: 'talk:a01-hughes:records',
        scene: {
          id: 'a01-08-records',
          lines: [
            N('The brothers have gone home to Resembool for repairs. Hughes is in the records office, very late, with a map of the country.'),
            HU('Ah, the Nubbin’s keeper. It’s my little girl’s birthday soon. Want to see the cake I’ve ordered? It’s shaped like a horse.', 'happy'),
            N('He shows you, and then he shows you the map. He has been putting pins in it.'),
            HU('Every terrible day in this country’s history. Every war, every massacre. Look where they land.', 'think'),
            N('The pins make a ring around the whole country. A circle, with a city in the middle.'),
            HU('That’s not a coincidence. That’s a design. And I don’t think the army drew it by accident.', 'shock'),
            HU('I need to tell Roy. Not on the base telephone. Not anywhere in this building.'),
          ],
        },
        done: {
          id: 'a01-08-records-done',
          lines: [
            HU('Go home. It’s late. Tell your Nubbin goodnight from Elicia. She’d want you to.', 'soft'),
            N('He picks up his coat and goes out into the night, towards the street phones.'),
          ],
        },
      },
      {
        id: 'a01-08-s2',
        goal: 'Find out what happened in the night.',
        hint: 'The phone box on the corner below headquarters is taped off. Look carefully.',
        check: 'inspect:a01-phonebox:central',
        scene: {
          id: 'a01-08-box',
          lines: [
            N('In the morning there is tape around the phone box on the corner. Soldiers stand about with their hats off.'),
            N('Nobody stops you. Nobody is looking at anything but the box.'),
            N('The street is very ordinary: a baker is putting out bread as if nothing has happened.'),
            N('The receiver hangs on its cord, swinging a little. Somebody’s glasses are folded on the shelf, neatly.'),
            N('On the floor is a photograph of a small girl on a horse that looks like a potato.', 'sad'),
            N('Your Nubbin climbs out of your coat and goes very slowly into the box, and sits by the photograph.'),
          ],
          choices: [
            {
              id: 'pick',
              label: 'Pick up the photograph.',
              then: [N('You pick it up; it is a little bent at one corner. You put it inside your coat, where it will stay flat.')],
            },
            {
              id: 'phone',
              label: 'Put the receiver back on its hook.',
              then: [
                N('You hang it up gently. The click is loud in the quiet.'),
                N('Then you pick up the photograph, because someone has to.'),
              ],
            },
          ],
        },
        done: {
          id: 'a01-08-box-done',
          lines: [
            N('He made it as far as the phone. He didn’t get to finish the call.', 'sad'),
          ],
        },
      },
      {
        id: 'a01-08-s3',
        goal: 'Take the photograph home to his family.',
        hint: 'The Hughes house is on the green street by the bakery.',
        check: 'deliver:a01-photo:hughes-house',
        scene: {
          id: 'a01-08-photo',
          lines: [
            N('A woman opens the door. Her eyes are red, and she is holding a small girl by the hand.'),
            N('You hold out the photograph. You don’t have to say where it came from, because she knows.'),
            N('She takes it in both hands, carefully, the way you hold something hot.', 'sad'),
            N('Behind her in the hall, a child’s drawing is pinned to the wall: a horse that looks like a potato.'),
            N('The little girl sees your Nubbin and smiles at it, because she doesn’t understand yet. Your Nubbin smiles back.'),
            N('She says thank you, and shuts the door very gently, as if someone inside were asleep.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-08-complete',
      lines: [
        N('The funeral is on a grey afternoon. Hughes’s little girl doesn’t understand why the grown-ups are putting Daddy away.'),
        N('Mustang stays at the grave long after the others go. Hawkeye stays a few steps behind him.'),
        RM('He was always going on about his family. Every phone call. I used to hang up on him.', 'sad'),
        RH('Sir. Your face is wet.'),
        RM('It isn’t. The sky is. That’s all it is.', 'sad'),
        RM('The brothers don’t know. Don’t tell them yet. Ed will tear the country up looking, and they’ll get him too.'),
        RM('Leave this one with me. I’ll find who did it. I’ll find every one of them.', 'angry'),
      ],
    },
    rewards: [],
    sets: { 'a01-08': true },
    notes:
      'NON-GRAPHIC: Hughes’s death is never shown. The phone box is morning-after: tape, a hanging receiver, folded ' +
      'glasses, the photograph. No blood, no outline on the floor. Envy’s disguise is not shown here either; the ' +
      'player learns who did it only in A1-17. Mustang’s line about the sky is the source’s beat in our own words. ' +
      'You now carry a secret from the brothers; Ed finds out in A1-12. The brothers do not appear in this quest.',
  },

  // ---------------------------------------------------------------- A1-9
  {
    id: 'a01-09',
    code: 'A1-9',
    title: 'Rush Valley',
    source: src('ep. 11, Rush Valley, Paninya, and the baby in the storm'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-8') },
    requires: ['A1-8'],
    speakers: [ED, AL, WINRY, PANINYA, DOMINIC, SATELLA],
    steps: [
      {
        id: 'a01-09-s1',
        goal: 'Chase the girl who stole Ed’s watch.',
        hint: 'She went over the roofs. Your Nubbin is smaller than she is and can fit under the awnings.',
        check: 'find:a01-watch:rush-valley',
        scene: {
          id: 'a01-09-chase',
          lines: [
            N('Rush Valley is a mountain town that sells nothing but automail. Every shop window is full of steel hands.'),
            N('Winry presses her face to the glass of the first one and makes a noise you have only heard from people seeing kittens.'),
            W('Look at the joints. Look at the JOINTS, Ed.', 'happy'),
            N('A girl bumps into Ed, apologises sweetly, and is gone. So is his silver watch.'),
            E('My watch! My state watch! Hey! Come back here, you little…', 'angry'),
            N('She runs up a wall. Not climbs: runs, straight up it, on legs that flash like knives in the sun.'),
            W('Automail legs. Real ones. Oh, she’s beautiful.', 'happy'),
            E('She’s a THIEF, Winry!'),
            A('Brother, she’s getting away while you two argue.'),
          ],
        },
        done: {
          id: 'a01-09-chase-done',
          lines: [
            N('Your Nubbin corners her behind a chimney pot by sitting on her bootlace and refusing to move.'),
            PA('Fine. Fine! Here’s your stupid watch. It won’t even open.'),
            N('Inside the lid, where only Ed ever looks, there’s a date scratched in with something sharp.'),
          ],
        },
      },
      {
        id: 'a01-09-s2',
        goal: 'Meet the man who built Paninya’s legs.',
        hint: 'Paninya will take you up the hill to his workshop, if Ed stops shouting.',
        check: 'talk:a01-dominic:workshop',
        scene: {
          id: 'a01-09-dominic',
          lines: [
            PA('I lost them under a train when I was little. Dominic made me new ones for nothing. I pay people back. I just pay them back weird.'),
            N('Dominic is a big gruff man with a face like a shut door. His workshop is the best one you’ve ever seen.'),
            W('Sir, please. Take me on. I’ll sweep floors. I’ll sweep floors for years.'),
            DO('No apprentices. I don’t teach. Go home.', 'angry'),
            N('His daughter-in-law, Satella, comes in with tea and a plate of biscuits. She is very pregnant and entirely unbothered by it.'),
            SA('Don’t mind him. He said no to his own son, the first time. Have a biscuit.', 'happy'),
          ],
        },
      },
      {
        id: 'a01-09-s3',
        goal: 'Help deliver a baby in the storm.',
        hint: 'Boil water, fetch towels, and do whatever Winry says, as fast as she says it.',
        check: 'deliver:a01-baby:workshop',
        scene: {
          id: 'a01-09-storm',
          lines: [
            N('That night a storm shuts the mountain road. The doctor lives on the far side of it.'),
            SA('Oh. Oh no. It’s coming. It’s coming now.', 'shock'),
            DO('The road’s out. The doctor can’t…', 'shock'),
            N('Everyone looks at everyone. Winry rolls up her sleeves.'),
            W('My parents were doctors. I watched. I helped. I can do this. Ed, Al, water and light. You, towels. Lots.', 'think'),
            E('Winry, you fix arms.'),
            W('People are made of parts too. Move!', 'angry'),
            N('You run for towels, and your Nubbin runs for towels. Al holds the lamp so steady you could thread a needle by it.'),
          ],
        },
        done: {
          id: 'a01-09-storm-done',
          lines: [
            N('Just before dawn there’s a thin, cross, enormous cry. Everyone in the house sits down on the floor at once.'),
            SA('A boy. Look at him. Look at his hands.', 'soft'),
            E('That’s… amazing. No circle, no chalk, no price. Alchemists have tried for centuries, and you did it in a kitchen.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-09-complete',
      lines: [
        N('Dominic still won’t take an apprentice. But he writes Winry a letter to a friend down the hill who will.'),
        W('I’m staying. Here. To learn. I’ll make legs like that one day. I’ll make legs that run up walls.', 'happy'),
        E('Fine by me. Stay out of trouble.'),
        W('I’m not the one who needs telling.'),
        N('Before you go, Winry makes one more thing from the offcuts on Dominic’s bench, in about an hour.'),
        N('A tiny harness of steel and leather, with a bolt for a buckle. It fits your Nubbin perfectly.'),
        W('In case anyone ever tries to take it out of Al’s armour. Now they’ll have to deal with me.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'a01-harness',
        kind: 'cosmetic',
        label: 'Automail Harness',
        description:
          'A little harness of steel plates and soft leather, buckled with a bolt, made by an automail mechanic from her bench offcuts. Your Nubbin can wear it in the Grove.',
      },
    ],
    sets: { 'a01-09': true },
    notes:
      'The birth is entirely offscreen: the camera stays in the workshop kitchen with the lamp, the towels and the ' +
      'faces. One sound: the baby’s cry. Paninya’s legs are bladed automail; she uses them to climb, never to cut ' +
      'anyone. The watch’s engraving is not shown in close-up (it is the date of A1-2’s fire). REWARD: the ' +
      'harness is a Grove cosmetic, slot “back”, steel-and-leather in the page’s palette, our own design.',
  },

  // ---------------------------------------------------------------- A1-10
  {
    id: 'a01-10',
    code: 'A1-10',
    title: 'The Island',
    source: src('ep. 12, Izumi’s month on the island, told in flashback'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-9') },
    requires: ['A1-9'],
    speakers: [ED, AL, IZUMI],
    steps: [
      {
        id: 'a01-10-s1',
        goal: 'Wash ashore on the island with the young brothers.',
        hint: 'The page goes back again. Find the boys on the beach.',
        check: 'explore:a01-island:shore',
        scene: {
          id: 'a01-10-shore',
          lines: [
            N('In Dublith, the brothers stand outside a butcher’s shop, too scared to knock. The page tips you backwards before they do.'),
            N('You are on a small green island in a lake. Two little boys are standing on the beach with one knife between them.'),
            IZ('One month. No alchemy. One is all, and all is one. Tell me what it means when I come back.'),
            N('Their teacher’s boat is already halfway across the water. She doesn’t wave.'),
            A('Brother, what does it mean?', 'think'),
            E('It means she’s mad. It means she’s left us on an island. What else does it mean?', 'angry'),
            N('Your Nubbin sits down on the sand, looks at the water, and visibly decides to be brave about this.'),
          ],
        },
        done: {
          id: 'a01-10-shore-done',
          lines: [
            N('That first night a masked man comes out of the trees and chases them off the beach. Nobody sleeps.'),
          ],
        },
      },
      {
        id: 'a01-10-s2',
        goal: 'Help the boys find enough to eat.',
        hint: 'Fish in the shallows, berries on the hill, and a fire you can only light the hard way.',
        check: 'feed:a01-brothers:island',
        scene: {
          id: 'a01-10-food',
          lines: [
            N('A week in, the boys are thin and quiet. Al finds berries, and Ed finds that he can’t catch anything with his hands.'),
            E('If I could just draw a circle. One circle. I’d have a fishing net in two seconds.'),
            A('She said no alchemy.'),
            E('I KNOW what she said.', 'angry'),
            N('You show them how to make a fish trap out of stones in the shallows. It takes a whole day.'),
            N('In the evening there are two fish in it. Ed looks at them flapping for a long time.'),
            E('To eat, you have to take something. Something that was alive. There isn’t another way round it.', 'think'),
          ],
        },
        done: {
          id: 'a01-10-food-done',
          lines: [
            N('He does it quickly, and doesn’t enjoy it. That evening there’s fish on a stick, and the boys eat every bit.'),
          ],
        },
      },
      {
        id: 'a01-10-s3',
        goal: 'Sit by the fire on the last night and work out the riddle.',
        hint: 'Sit with them. Watch the ants on the log.',
        check: 'sit:a01-island:fire',
        scene: {
          id: 'a01-10-fire',
          lines: [
            N('The last night. Ed is watching ants carry a dead moth along the log, crumb by crumb.'),
            E('The moth’s food for the ants. The ants are food for a bird. The bird dies, and it goes into the ground, and the ground grows the berries.'),
            A('And we eat the berries. And one day we go back into it too.'),
            E('One is all. All is one. It’s a circle, Al. The whole world is just a big circle, and we’re a little bit of it.', 'shock'),
            N('Your Nubbin is asleep in Al’s lap with its feet in the air. It seems to have known this already.'),
            N('In the morning, the masked man takes off his mask. He’s a friend of their teacher’s, and he’s very proud of them.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-10-complete',
      lines: [
        N('The page brings you back to the butcher’s shop. The brothers finally knock.'),
        N('Izumi Curtis opens the door, learns Ed is a State Alchemist, and throws him across the street.', 'angry'),
        IZ('A dog of the army! My student!', 'angry'),
        E('Someone helped me study for it! It wasn’t a whim!', 'shock'),
        N('Then they tell her what they did in the chalk circle. She is quiet for a long time.'),
        IZ('I tried it too. A child of mine, who didn’t live. So I can’t shout at you for that one.', 'sad'),
        N('She pulls both of them into a hug, armour and all. It sounds like someone hugging a bell.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a01-10': true },
    notes:
      'FLASHBACK in the middle, present-day at each end. The fish is caught and eaten; nothing else is hunted ' +
      'on screen. The masked man is never a real danger (a shadow that chases, never catches). Izumi’s throw is ' +
      'comic (Ed bounces). Her lost child is said once, in her own words, and nobody follows it up. EXAM ' +
      'PAYOFF (a01-exam): the scene shown, a01-10-complete, is for “study”. For “doubt”, play ATLAS_A01_VARIANTS ' +
      'a01-10-complete-doubt instead.',
  },

  // ---------------------------------------------------------------- A1-11
  {
    id: 'a01-11',
    code: 'A1-11',
    title: 'The Devil’s Nest',
    source: src('eps. 13–14, Greed and his crew in Dublith'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-10') },
    requires: ['A1-10'],
    speakers: [ED, AL, GREED, MARTEL, BRADLEY],
    steps: [
      {
        id: 'a01-11-s1',
        goal: 'Follow the men who carried Al away.',
        hint: 'They took him down the back streets of Dublith. Your Nubbin was still inside.',
        check: 'escort:a01-al:dublith',
        scene: {
          id: 'a01-11-taken',
          lines: [
            N('In Dublith, while Ed is getting thrown about by his teacher, three men with odd eyes knock Al flat and haul him onto a cart.'),
            N('They carry him off with your Nubbin still inside.', 'shock'),
            N('Ed comes out of the butcher’s shop with his teacher’s handprint still on his coat.'),
            E('They took my brother. Who takes a suit of armour? What do they WANT with him?', 'angry'),
            N('You know the way. You can hear, faintly, from far down the street, a small and very cross squeaking.'),
            E('Good Nubbin. Keep making that noise. Keep making that noise all the way.'),
          ],
        },
        done: {
          id: 'a01-11-taken-done',
          lines: [
            N('The squeaking stops at a bar with a devil painted on its sign. Ed tells you to wait for his teacher, and you don’t.'),
          ],
        },
      },
      {
        id: 'a01-11-s2',
        goal: 'Get into the Devil’s Nest and find Al.',
        hint: 'Through the cellar door, following the squeaking. Nobody stops you, which is worrying in itself.',
        check: 'visit:a01-nest:cellar',
        scene: {
          id: 'a01-11-nest',
          lines: [
            N('In the cellar, Al is sitting on the floor in chains. A man in a fur collar sits across from him with his feet up.'),
            GR('A soul in a tin can. You’re my dream come true, kid. I want to live forever. Tell me how it’s done.'),
            A('I don’t know how it’s done. And I wouldn’t tell you. And there’s a Nubbin in here, and it’s upset.'),
            GR('Ha! A guest. Somebody get the guest a drink.', 'happy'),
            N('His crew are half-animal: a man with a dog’s nose, a huge man like a bull, a woman who moves like a snake.'),
            MA('The army made us like this. Experiments. Greed took us in when nobody else would. He wants everything.'),
            MA('Money, power, the whole world. But he’s never once let one of us go hungry.'),
            GR('I want everything. That includes my people. That’s just good bookkeeping.', 'happy'),
          ],
        },
        done: {
          id: 'a01-11-nest-done',
          lines: [
            N('Your Nubbin climbs out of Al and sits on Greed’s boot, glaring. Greed laughs until he has to wipe his eyes.'),
          ],
        },
      },
      {
        id: 'a01-11-s3',
        goal: 'Get your Nubbin out of the cellar when the soldiers come.',
        hint: 'Martel is hiding inside Al now. There isn’t room for two. Your Nubbin has to come out.',
        check: 'carry:a01-nubbin:nest',
        scene: {
          id: 'a01-11-raid',
          lines: [
            N('Boots on the stairs, and shouting. The army has found the Devil’s Nest, and the Führer himself has come with them.'),
            N('Martel folds herself up and climbs into Al’s armour to hide, the way your Nubbin does.'),
            MA('Out you get, little one. Not enough room for two. Go on. Go to your keeper.', 'soft'),
            N('Your Nubbin hesitates, then climbs out into your hands. Martel closes the breastplate from the inside.'),
            A('Run. Take it and run. Please.', 'shock'),
            N('You run up the back stair. Behind you, metal rings on metal, and then there is no sound from the cellar at all.'),
          ],
        },
        done: {
          id: 'a01-11-raid-done',
          lines: [
            N('Later, outside, Al sits on the kerb with his breastplate open. It is empty now.'),
            A('She was inside me. I felt her stop moving. I can’t feel anything, and I felt that.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-11-complete',
      lines: [
        N('Greed is taken away in chains. The Führer wipes his sword, and smiles at the brothers like a kind uncle.'),
        BR('Fullmetal. You keep such interesting company.'),
        E('He’s smiling. Why is he smiling?', 'think'),
        A('Brother. She gave the Nubbin back. She didn’t have to.', 'sad'),
        E('I know, Al.'),
        N('That night your Nubbin won’t go back inside Al. It sleeps on his knee, outside the armour, all night.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a01-11': true },
    notes:
      'NON-GRAPHIC (care): Martel’s death is never shown. The camera goes up the stairs with you; the sound below is ' +
      'metal on metal, then silence. Bradley wipes his sword in the complete scene with a cloth that stays clean ' +
      'on screen. The crew’s chimera features are drawn friendly-strange, never monstrous. Greed is taken alive ' +
      '(as in the source). Your Nubbin rides outside Al’s armour until A1-12’s complete scene.',
  },

  // ---------------------------------------------------------------- A1-12
  {
    id: 'a01-12',
    code: 'A1-12',
    title: 'The Prince of Xing',
    source: src('eps. 15–17, Ling Yao, Lan Fan and May Chang'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-11') },
    requires: ['A1-11'],
    speakers: [ED, AL, WINRY, LING, LANFAN, MAY],
    steps: [
      {
        id: 'a01-12-s1',
        goal: 'Feed the young man who’s fallen over in the road.',
        hint: 'He’s lying face down outside Garfiel’s shop in Rush Valley. Bring food. A lot of it.',
        check: 'feed:a01-ling:rush-valley',
        scene: {
          id: 'a01-12-ling',
          lines: [
            N('You’re back in Rush Valley to see Winry, and a young man in fine foreign clothes is lying face down in the road.'),
            W('Ed! You stepped over him! You stepped right over a person!', 'angry'),
            LI('So hungry. So very hungry. Would you be so kind…'),
            N('He eats four bowls of noodles, two loaves and Ed’s lunch. Then he smiles and admits he has no money at all.'),
            LI('I am Ling Yao, twelfth son of the Emperor of Xing. I’ve come a long way across the desert to find immortality.', 'happy'),
            E('Then you can pay for lunch, Your Highness.'),
            LI('Ah. About that.'),
            N('Something drops off the roof in a black mask and puts a knife very near Ed’s chin.'),
            LF('Do not lay a hand on the young lord.', 'angry'),
          ],
        },
        done: {
          id: 'a01-12-ling-done',
          lines: [
            LI('This is Lan Fan. She’s very loyal. She’ll put the knife away now. Lan Fan. Lan Fan, the knife.'),
            N('She puts it away. Your Nubbin, which had been hiding behind Al’s foot, comes out and offers her a noodle.'),
          ],
        },
      },
      {
        id: 'a01-12-s2',
        goal: 'Be there when Ed finds out about Hughes.',
        hint: 'Central, the corridor outside Mustang’s office. You know what he’s about to hear.',
        check: 'talk:a01-ed:central-corridor',
        scene: {
          id: 'a01-12-hughes',
          lines: [
            N('Back in Central, Ed goes to find Hughes, to show him the new arm. A young officer stops him in the corridor.'),
            N('You watch it reach Ed. It takes a long time, the way news like that does.', 'sad'),
            E('When? When was this?', 'shock'),
            N('Ed turns and looks at you. Then he understands, all at once, that you knew.'),
            E('You knew. You were in Central. You knew the whole time.', 'angry'),
            N('Your Nubbin goes and stands between your feet, very small.'),
          ],
          choices: [
            {
              id: 'asked',
              label: '“Mustang asked me not to tell you.”',
              then: [
                E('Course he did. Course he did.', 'angry'),
                E('…He was right, wasn’t he. I’d have gone straight out looking.', 'sad'),
              ],
            },
            {
              id: 'sorry',
              label: '“I’m sorry. I didn’t know how.”',
              then: [
                E('No. Nobody knows how. It’s not your fault.', 'sad'),
                E('He came to see us at Tucker’s. With that stupid horse picture.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'a01-12-hughes-done',
          lines: [
            A('He always asked how we were, Brother. Every time. Even the times we lied.', 'sad'),
            N('Ed goes to Gracia’s house on his own. He doesn’t say what they talk about.'),
          ],
        },
      },
      {
        id: 'a01-12-s3',
        goal: 'Find the tiny panda that’s been eating your Nubbin’s snacks.',
        hint: 'Something small and black-and-white keeps raiding your bag. Follow the crumbs.',
        check: 'find:a01-xiaomei:central',
        scene: {
          id: 'a01-12-may',
          lines: [
            N('Your Nubbin’s snacks keep disappearing. You follow a trail of crumbs into an alley.'),
            N('A panda no bigger than a teacup is sitting in your bag with its cheeks full. Your Nubbin stares at it, and it stares back.'),
            N('Then they share the last biscuit, half each, and that is that. Best friends.', 'happy'),
            MC('Xiao-Mei! There you are. Oh. Hello. Have you heard of the great Edward Elric? Tall, handsome, a prince of alchemy?', 'happy'),
            MC('I’ve come all the way from Xing to meet him. I just know he’s tall and handsome. I can feel it.', 'happy'),
            N('Ed walks round the corner, eating a sandwich, at his full and usual height.'),
            MC('…Who’s that?', 'shock'),
            E('WHAT DO YOU MEAN, WHO’S THAT?!', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-12-complete',
      lines: [
        N('May Chang is very disappointed in Ed, and makes sure he knows it. Ling finds this the best day of his life.'),
        LI('Two of us from Xing in one city, after the same prize. The Philosopher’s Stone is here somewhere. I can smell it.'),
        A('Be careful. People are trying to get it. Good people get hurt.'),
        LI('Then we’ll be careful together. Friends?', 'happy'),
        E('We are not friends. You owe me lunch.'),
        N('Xiao-Mei rides home in your Nubbin’s spot inside Al. Your Nubbin rides on top of Al’s helmet, like a hat, and is happy.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a01-12': true },
    notes:
      'The middle step pays off A1-8’s secret. The choice is flavour (no flag). Ed is never cruel to the Keeper ' +
      'for long. Xiao-Mei squeaks only; she is not a talking animal. May’s disappointment and Ed’s rage at ' +
      '“who’s that” are the comic heart of the page: play them big. Lan Fan’s knife is never used.',
  },

  // ---------------------------------------------------------------- A1-13
  {
    id: 'a01-13',
    code: 'A1-13',
    title: 'The Man Who Orphaned Her',
    source: src('ep. 22, Winry and Scar'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-12') },
    requires: ['A1-12'],
    speakers: [ED, AL, WINRY, SCAR, MAY],
    steps: [
      {
        id: 'a01-13-s1',
        goal: 'Walk Winry through Central to find the brothers.',
        hint: 'She’s come to tune Ed’s arm. Keep her close; Scar is in the city.',
        check: 'escort:a01-winry:central',
        scene: {
          id: 'a01-13-walk',
          lines: [
            N('Winry has come to Central with her toolbox, to tune Ed’s arm. She talks the whole way about bearing grease.'),
            W('My mum and dad went to Ishval, in the war. As doctors. They treated anybody. Both sides.', 'soft'),
            W('They never came back. Somebody killed them. Nobody ever told me who.', 'sad'),
            N('Ed and Al are somewhere ahead. Scar has been seen in the city, and everyone is a bit too quiet about it.'),
            N('Your Nubbin, riding on her toolbox, pats her hand.'),
            W('It’s fine. It was a long time ago. I just wish I knew who. So I could… I don’t know what. Look at him, I suppose.'),
          ],
        },
        done: {
          id: 'a01-13-walk-done',
          lines: [
            N('At the end of the street there is shouting, and dust, and the brothers standing over a big man on the ground.'),
          ],
        },
      },
      {
        id: 'a01-13-s2',
        goal: 'Be there at Winry’s moment.',
        hint: 'Stay near Winry. Whatever she decides is hers.',
        check: 'choose:a01-winry:central-square',
        scene: {
          id: 'a01-13-gun',
          lines: [
            N('Scar is down on one knee, hurt. May Chang stands in front of him with her arms out.'),
            MC('He saved me in the desert. He’s hurt. Please don’t.', 'sad'),
            E('The two doctors in Ishval. The Rockbells. That was you, wasn’t it? Say it.', 'angry'),
            N('Ed says it before he sees Winry is there. Then he sees her face, and wishes he could take it back.'),
            SC('Yes. The doctors in the tent. I remember them. They were treating my people.', 'sad'),
            N('A soldier’s pistol has fallen in the dust near Winry’s feet. She picks it up, and her hands are shaking badly.', 'shock'),
            W('They helped you. They helped your people, and you…', 'angry'),
            N('Ed steps between the gun and Scar, with his arms out. Not for Scar: for her.'),
            E('Winry. Don’t. Your hands are for fixing people. You said so. You always said so.', 'sad'),
          ],
          choices: [
            {
              id: 'spoke',
              label: 'Speak: “You don’t have to do this. It won’t give them back.”',
              set: { 'a01-winry': 'spoke' },
              then: [
                N('Winry looks at you. Something in her face crumples, and comes undone.'),
                N('Scar looks at you too, over Ed’s shoulder. He doesn’t look away for a long moment.'),
              ],
            },
            {
              id: 'silent',
              label: 'Say nothing. Stand next to her, close enough that she knows you’re there.',
              set: { 'a01-winry': 'silent' },
              then: [
                N('You stand beside her, your shoulder against hers. You don’t touch the gun, and you don’t say a word.'),
                N('Scar sees it. He watches you both, very still.'),
              ],
            },
          ],
        },
        done: {
          id: 'a01-13-gun-done',
          lines: [
            N('Winry’s arms go down, and the gun drops in the dust. She couldn’t; she never could, and she knows it now.', 'sad'),
            N('In the confusion, May helps Scar away. Nobody stops them, or quite wants to.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-13-complete',
      lines: [
        N('Winry sits on the edge of a fountain and cries properly, the big way, with her whole body.'),
        W('I wanted to. Just for a second, I really wanted to.', 'sad'),
        E('But you didn’t.'),
        W('Because you stood in front of him. Idiot. You’d have let me shoot you.', 'angry'),
        E('Nah. You’d never shoot me. You’d just hit me with a wrench.'),
        A('Can I sit there too? I’ll be careful with the fountain.'),
        N('She laughs, which surprises everybody, her most of all. Al sits down beside her, and the fountain wobbles.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a01-13': true },
    notes:
      'SIGNATURE CHOICE (a01-winry = spoke | silent). Either way Winry decides for herself and drops the gun; ' +
      'the Keeper never takes her moment. Paid off in A1-18 (a01-18-reverse-done / -silent), when Scar remembers ' +
      'who spoke and who stood. The gun is a soldier’s pistol dropped in the street; it is never fired. Scar is ' +
      'already hurt from a fight we didn’t see; no wound is shown.',
  },

  // ---------------------------------------------------------------- A1-14
  {
    id: 'a01-14',
    code: 'A1-14',
    title: 'Inside Gluttony',
    source: src('eps. 24–25, swallowed by Gluttony’s false Gate'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-13') },
    requires: ['A1-13'],
    speakers: [ED, AL, LING, ENVY, FATHER],
    steps: [
      {
        id: 'a01-14-s1',
        goal: 'Stay close to Ed and Ling in the warehouse.',
        hint: 'Al has your Nubbin. Stay behind Ed, and don’t go near the round one’s belly.',
        check: 'escort:a01-ling:warehouse',
        scene: {
          id: 'a01-14-warehouse',
          lines: [
            N('Ling has caught one of the homunculi: Gluttony, round and smiling, who eats whatever he’s told to eat.'),
            LI('Caught him! One homunculus, tied up in a warehouse. My grandfather would be proud.', 'happy'),
            N('Then Gluttony stops smiling. His belly opens, wide as a doorway, and inside is a great dark eye.', 'shock'),
            E('That’s… that looks like the Gate. Al, get back! Get the Nubbin back!'),
            N('Al pulls your Nubbin into his armour and jumps clear. You don’t jump quite fast enough.'),
            N('The dark comes up round you like a sea, and the warehouse is gone.'),
          ],
        },
        done: {
          id: 'a01-14-warehouse-done',
          lines: [
            A('BROTHER!', 'shock'),
            N('You hear Al’s voice the way you hear a voice from the bottom of a well. Then nothing.'),
          ],
        },
      },
      {
        id: 'a01-14-s2',
        goal: 'Find your way across the dark sea.',
        hint: 'Walk with Ed and Ling. Look for anything solid. Keep talking.',
        check: 'explore:a01-belly:dark-sea',
        scene: {
          id: 'a01-14-sea',
          lines: [
            N('It is dark and endless and ankle-deep. Things float in the dark water, rubble and broken stones from cities nobody remembers.'),
            LI('We’re inside him. Inside him, and there is no inside. How is there no inside?', 'shock'),
            E('It’s a fake Gate. A copy. Somebody tried to make one, and got this.'),
            N('Days pass, or something like days, and Ling is very hungry. You share what’s left in your pockets.'),
            E('You still owe me lunch.'),
            LI('I’ll pay in here. If anyone sells noodles.'),
            E('Nobody sells noodles inside a stomach.'),
            LI('Then I’ll owe you two.'),
            N('Then Envy drops into the sea beside you, swallowed too, and furious about it.'),
            EN('Don’t look so pleased. You’ll all rot in here. Me too, I suppose. Lovely.', 'angry'),
          ],
        },
        done: {
          id: 'a01-14-sea-done',
          lines: [
            N('Envy changes shape when angry enough. It grows into something huge, all voices, with too many hands, and it cries out.', 'shock'),
            N('Ed listens to the voices. There are hundreds, and they are people.', 'sad'),
          ],
        },
      },
      {
        id: 'a01-14-s3',
        goal: 'Watch Ed open his own Gate.',
        hint: 'Stand where Ed puts you, in the middle of the circle. Hold on to Ling.',
        check: 'watch:a01-ed:circle',
        scene: {
          id: 'a01-14-circle',
          lines: [
            E('If this is a fake Gate, there’s a real one somewhere. Mine. I’ve been there. I can go back.'),
            E('I just need a body to pass through, as the price. My own will do. And Envy’s stone to power it.'),
            LI('That is the stupidest plan I have ever heard. I love it. Go on.'),
            N('Ed draws a circle on a floating slab of stone, and another on his own chest. He kneels in the middle and claps.'),
            E('There are people in that stone, and they’re talking to me. I’ll get you out too. I promise. I don’t know how yet.', 'sad'),
            N('The world goes white.'),
          ],
        },
        done: {
          id: 'a01-14-circle-done',
          lines: [
            N('You fall out of the dark onto a stone floor, coughing. Envy lands, sees the room, and slinks off down a drain.'),
            N('Somewhere below Central, in a huge round room full of pipes, an old man sits on a high seat and looks down at you.'),
            FA('Interesting. You came out by yourselves. You may be useful after all.'),
            N('He has Ed’s father’s face. Ed goes white.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-14-complete',
      lines: [
        N('Al is there. Al was taken there too, and he has your Nubbin, unharmed and frantic.'),
        A('Brother! You’re alive! You’re alive, and you look terrible!', 'happy'),
        E('Al. The Stone isn’t just made of people. They’re still in it. They’re still awake.', 'sad'),
        E('I heard them. I heard them asking to go home.'),
        N('Ed carries Ling out over his shoulder. He carries what he heard home too, and he won’t ever put it down.'),
      ],
    },
    rewards: [],
    sets: { 'a01-14': true },
    notes:
      'NON-GRAPHIC: the sea inside Gluttony is dark water, never red; floating rubble, no bodies. Envy’s true shape ' +
      'is a huge dark mass of voices and reaching hands, shown in silhouette with no faces. Ed’s circle is drawn in ' +
      'the source in his own blood: here it is chalk-white lines on stone and on his shirt, and blood is never ' +
      'mentioned. The souls in the stone are heard as a murmur, never seen. Father’s first appearance.',
  },

  // ---------------------------------------------------------------- A1-15
  {
    id: 'a01-15',
    code: 'A1-15',
    title: 'Briggs',
    source: src('eps. 33–36, Fort Briggs and Sloth'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-14') },
    requires: ['A1-14'],
    speakers: [ED, AL, WINRY, OLIVIER, MILES],
    steps: [
      {
        id: 'a01-15-s1',
        goal: 'Climb the mountain road to Fort Briggs.',
        hint: 'Stay in Al’s footprints. Ed’s steel arm is freezing. Keep him moving.',
        check: 'walk:a01-briggs:mountain-road',
        scene: {
          id: 'a01-15-road',
          lines: [
            N('Briggs is the end of the country: snow, cliffs, and a wall of a fortress across the only pass.'),
            E('Can’t feel my arm. Can’t feel my leg. The steel’s pulling the cold right into me.', 'sad'),
            A('I can’t feel anything either, Brother. You get used to it.'),
            E('That’s not funny, Al.'),
            A('It’s a little funny.'),
            N('Your Nubbin is wrapped in Ed’s scarf, inside Al. It is the only warm thing on the mountain.'),
          ],
        },
        done: {
          id: 'a01-15-road-done',
          lines: [
            N('Soldiers in white come out of the snow with rifles and hard faces, and walk you up to the gate.'),
          ],
        },
      },
      {
        id: 'a01-15-s2',
        goal: 'Stand before the general of Briggs.',
        hint: 'Answer her straight. She can smell a lie through a blizzard.',
        check: 'talk:a01-olivier:fortress',
        scene: {
          id: 'a01-15-general',
          lines: [
            N('General Armstrong is the Major’s older sister, and nothing like him at all. She looks at you as if you’re a draught.'),
            OL('Up here, if you can’t hold a wall, you’re a weight on it. The mountain doesn’t forgive, and neither do I.'),
            OL('A State Alchemist, a suit of armour, a civilian and something small I have no word for. Explain yourselves.'),
            E('There’s something under your fort. Digging. We think it’s part of a plan to hurt the whole country.'),
            OL('“We think”. I don’t move soldiers on “we think”.'),
            N('The floor shakes. Then it shakes again, harder, and a wall at the end of the hall bursts open in a shower of stone.', 'shock'),
          ],
        },
      },
      {
        id: 'a01-15-s3',
        goal: 'Help trap the digger in the cold.',
        hint: 'Carry the fuel cans to the shed where Olivier says. The cold is the trap.',
        check: 'carry:a01-fuel:briggs',
        scene: {
          id: 'a01-15-sloth',
          lines: [
            N('The thing that comes out of the wall is enormous and slow and bored, and says how bothersome everything is.'),
            OL('Lead it outside. It’s strong, but it’s still a living thing, and nothing living likes our winter.'),
            MI('The General says the cold will do what bullets can’t. She is usually right.'),
            N('You carry fuel cans to the yard, and the soldiers light a ring of fires. The giant lumbers towards the warmth.'),
            N('Then Olivier orders every fire out at once, and the brothers bait the giant out into the snow.'),
            N('Al has the giant’s attention. He’s good at that: he doesn’t feel the hits, and he keeps standing up.'),
            N('By morning the giant is a statue of frost in the yard, slowly yawning, quite stuck.'),
          ],
        },
        done: {
          id: 'a01-15-sloth-done',
          lines: [
            MI('There’s a tunnel under the wall, General. It goes south. It goes a very long way south.'),
            OL('Then the alchemist’s “we think” has just become a fact.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-15-complete',
      lines: [
        N('Winry arrives with the supply truck, because she heard Ed’s arm was freezing and nobody can stop her.'),
        W('Light alloy. Cold-weather. You won’t even feel it. Well. You’ll feel it a bit. Hold still.', 'happy'),
        N('Major Miles takes off his glasses to clean them. His eyes are red, the colour of Ishvalan eyes.'),
        MI('My grandparents came from Ishval. The army doesn’t like to remember that. I remember it every morning.'),
        OL('Bring me proof of this plan, alchemist. Paper, names, numbers. Then my soldiers will march wherever I tell them.'),
        E('We had proof. We…', 'think'),
        N('Ed looks at Al’s breastplate, and then at you. Whatever you did with Dr Marcoh’s notes, you all remember it now.'),
      ],
    },
    rewards: [],
    sets: { 'a01-15': true },
    notes:
      'Sloth (the digger) is never hurt on screen: he is lured out and frozen, and is still alive (as in the ' +
      'source, for now). Olivier’s creed is paraphrased, never quoted. Miles’s heritage is treated with respect. ' +
      'The last line sets up A1-16’s payoff of a01-notes and works for either answer.',
  },

  // ---------------------------------------------------------------- A1-16
  {
    id: 'a01-16',
    code: 'A1-16',
    title: 'The Promised Day, Part 1',
    source: src('eps. 50–52, the Promised Day begins: Briggs in Central, the circle underground'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-15') },
    requires: ['A1-15'],
    speakers: [ED, AL, MILES, OLIVIER],
    steps: [
      {
        id: 'a01-16-s1',
        goal: 'Get the Briggs soldiers through Central’s gate.',
        hint: 'The garrison won’t open without proof. You know what you did with the notes.',
        check: 'talk:a01-miles:central-gate',
        scene: {
          id: 'a01-16-gate',
          lines: [
            N('Night before the eclipse. Briggs soldiers stand in the snow-wet streets of Central, and Central’s gate is shut against them.'),
            N('The sergeant on the gate is young and frightened and has his orders.'),
            MI('Your officers have been feeding this country to a circle. We can show you. Will you look?'),
            N('Al kneels in the street and opens his breastplate. Your Nubbin climbs out, and under it are Dr Marcoh’s notes, folded small.'),
            A('They’ve been in here since the hospital. Nobody got past me.'),
            N('The sergeant reads by a lantern: names, numbers, the recipe and what it needs. His face changes as he reads.'),
            N('Before midnight the gate is open. More of the garrison come over to Briggs than anyone dared hope.', 'happy'),
          ],
        },
        done: {
          id: 'a01-16-gate-done',
          lines: [
            OL('Good. Now we go under the city. Alchemist, lead.'),
          ],
        },
      },
      {
        id: 'a01-16-s2',
        goal: 'Follow the brothers into the tunnels under Central.',
        hint: 'Follow the grooves cut in the tunnel floor. They are all part of one great circle.',
        check: 'explore:a01-tunnels:central',
        scene: {
          id: 'a01-16-tunnels',
          lines: [
            N('Under the city the tunnels go on for miles. A groove is cut into the floor, and it curves, and curves, and never ends.'),
            E('This is it. The whole country. Every war we ever had was a point on this line.', 'angry'),
            N('Pale soldiers come out of the side tunnels: empty, grinning dolls the army made and filled with borrowed souls.'),
            A('Don’t let them touch the Nubbin. Brother, go left. I’ll go right.'),
        E('You always give me left.'),
        A('You always go left anyway. I’m saving us the argument.'),
        N('Your Nubbin salutes a pale soldier, which stops, confused, and salutes back. Ed hits it while it’s busy.'),
            N('Your Nubbin rides inside Al, the way it always has, right through the dark.'),
            N('Somewhere far ahead, a great old voice is counting down the hours to noon.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-16-complete',
      lines: [
        N('You reach the heart of the tunnels with the whole of the dark still ahead of you. There is time to plan.'),
        E('We’ve got hours. Hours! Somebody believed us. Somebody actually believed us.', 'happy'),
        A('Because we kept the proof, Brother. Because it was in writing.'),
        N('Ed taps Al’s breastplate, where the notes rode for so long. It rings softly, like a bell.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a01-16': true },
    notes:
      'SIGNATURE PAYOFF (a01-notes, set nine quests ago in A1-7). The scenes shown (a01-16-gate, a01-16-complete) ' +
      'are for “kept”. For “burnt” play ATLAS_A01_VARIANTS a01-16-gate-burnt in place of a01-16-gate and ' +
      'a01-16-complete-burnt in place of a01-16-complete: Ed rebuilds the notes from memory, it costs the night, ' +
      'and the brothers go under the city at dawn, tired and late. The outcome of the Promised Day is the same ' +
      'either way (the source’s heroes keep their story); only how it feels changes. The “dolls” are the ' +
      'source’s artificial soldiers, drawn pale and blank, never gory.',
  },

  // ---------------------------------------------------------------- A1-17
  {
    id: 'a01-17',
    code: 'A1-17',
    title: 'The Promised Day, Part 2',
    source: src('eps. 53–54, Mustang and Envy'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-16') },
    requires: ['A1-16'],
    speakers: [ED, MUSTANG, HAWKEYE, ENVY, SCAR],
    steps: [
      {
        id: 'a01-17-s1',
        goal: 'Go with Hawkeye to find the colonel.',
        hint: 'He went into the tunnels alone after he heard who killed Hughes. Follow the scorch marks.',
        check: 'find:a01-mustang:tunnel',
        scene: {
          id: 'a01-17-find',
          lines: [
            N('Envy has been bragging. Down here it told Mustang the truth: it wore Gracia’s face at the phone box, the night Hughes died.'),
            RH('He went after it alone. He didn’t even wait for me. He always waits for me.', 'think'),
            RH('Hughes was his best friend. You know that. You were at the grave.', 'sad'),
            N('The tunnel walls are black with soot. Every few yards there is a fresh scorch mark, and each one is bigger.'),
            RH('Stay behind me. If I tell you to get down, get down.'),
            N('Ahead there is fire, and laughing, and the laughing is getting thinner.'),
          ],
        },
        done: {
          id: 'a01-17-find-done',
          lines: [
            N('In a wide chamber Mustang stands at one end, snapping, again and again. Envy is shrinking with every flame.'),
          ],
        },
      },
      {
        id: 'a01-17-s2',
        goal: 'Be there at Mustang’s moment.',
        hint: 'Stay with Hawkeye. Whatever he decides is his.',
        check: 'choose:a01-roy:tunnel',
        scene: {
          id: 'a01-17-envy',
          lines: [
            N('There is almost nothing left of Envy now: a small, thin, lizard-like thing in the ash, wriggling.'),
            EN('Go on, then. Finish it. You want to. Look at your face.', 'angry'),
            RM('Yes. I want to. I want to very much.', 'angry'),
            N('Mustang raises his gloved hand. Behind him, Hawkeye raises her pistol, and points it at the back of his head.'),
            RH('Sir. If you do this, you’re not the man I followed. And then I’ll do what I promised I would.', 'sad'),
            RM('Get out of the way, Lieutenant.'),
            RH('No.'),
            N('Ed comes running in from one side. Scar comes in from the other, and stops, and watches.'),
          ],
          choices: [
            {
              id: 'spoke',
              label: 'Speak: “Hughes wouldn’t want this. He’d want you to go home.”',
              set: { 'a01-roy': 'spoke' },
              then: [
                N('Mustang’s hand trembles. He turns his head, just a fraction, towards your voice.'),
                RM('Don’t you dare tell me what he’d want. Don’t you… dare…', 'sad'),
              ],
            },
            {
              id: 'silent',
              label: 'Say nothing. Go and stand next to Hawkeye.',
              set: { 'a01-roy': 'silent' },
              then: [
                N('You walk across the ash and stand at Hawkeye’s shoulder. She doesn’t look at you, and her aim doesn’t move.'),
                N('Mustang sees you both there, side by side, and something in his face gives way.'),
              ],
            },
          ],
        },
        done: {
          id: 'a01-17-envy-done',
          lines: [
            N('Mustang’s hand comes down, and he doesn’t snap. Hawkeye lowers her pistol, and her hands are shaking.'),
            E('You’re jealous. That’s all you are. You can’t stand us, because we have each other and you never had anyone.'),
            EN('…Don’t you pity me. Don’t you DARE pity me.', 'sad'),
            N('Envy reaches into itself, takes out its own small red stone, and is gone. You don’t watch how.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-17-complete',
      lines: [
        RM('Lieutenant. I’m sorry. Thank you.', 'sad'),
        RH('You can thank me when we’re done, sir. We’re not done.'),
        SC('You did not take it. You had every right, and you did not take it.', 'think'),
        SC('I wish I had been as wise, once.'),
        N('Mustang pulls his glove back on and walks on into the dark. This time, he waits for her.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a01-17': true },
    notes:
      'SIGNATURE CHOICE (a01-roy = spoke | silent). Mustang decides for himself either way; Hawkeye’s gun is ' +
      'never fired. Paid off in A1-20 (a01-20-complete / a01-20-complete-silent). NON-GRAPHIC: Mustang’s flames ' +
      'are shown as bursts of light and soot on the walls; Envy is never shown burning, only smaller each time. ' +
      'Envy’s end is offscreen: the camera holds on Ed’s face. Envy’s disguise as Gracia is told, not shown.',
  },

  // ---------------------------------------------------------------- A1-18
  {
    id: 'a01-18',
    code: 'A1-18',
    title: 'The Eclipse',
    source: src('eps. 59–61, the eclipse, Father swallows a god, and Scar’s reverse circle'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-17') },
    requires: ['A1-17'],
    speakers: [ED, AL, MUSTANG, HAWKEYE, FATHER, HOHENHEIM, SCAR],
    steps: [
      {
        id: 'a01-18-s1',
        goal: 'Get to the round room under the city before noon.',
        hint: 'Every tunnel leads there now. Stay with Hawkeye and the colonel.',
        check: 'visit:a01-father:chamber',
        scene: {
          id: 'a01-18-chamber',
          lines: [
            N('In the round room under Central, the pipes on the walls are humming. The old man on the throne isn’t old any more.'),
            FA('I need five who have seen the Gate. I have four. The fifth will be the Flame.'),
            RM('I’ll never open it for you.', 'angry'),
            FA('You don’t have to want to.'),
            N('Light, from the floor under Mustang. When it fades he is on his knees, with his eyes open, looking at nothing.', 'shock'),
            RM('Lieutenant? Lieutenant, I can’t see. Riza. I can’t see.', 'shock'),
            RH('I’m here, sir. I’m right here. I’ll be your eyes.', 'sad'),
          ],
        },
      },
      {
        id: 'a01-18-s2',
        goal: 'Hold on while the eclipse comes.',
        hint: 'Stay inside the circle Hohenheim drew. Hold your Nubbin tight.',
        check: 'watch:a01-eclipse:chamber',
        scene: {
          id: 'a01-18-eclipse',
          lines: [
            N('Far above, the moon slides across the sun. The circle under the whole country lights up at once.'),
            N('Everyone in the land goes still at the same instant, like a clock that stops. The whole country holds its breath.', 'shock'),
            N('A huge door opens in the sky behind Father’s eyes, and he reaches up into it, and takes what is behind it.'),
            FA('Now. Now I am more than the flask. Now I am everything.'),
            HO('Not yet. You were always in such a hurry, little one. I’ve had centuries to prepare for today.'),
            N('Hohenheim’s own circle, laid in secret under the country, wakes up. Everywhere, the people breathe again.', 'happy'),
          ],
        },
        done: {
          id: 'a01-18-eclipse-done',
          lines: [
            N('Your Nubbin, which held its breath too, lets it out against your chest in one long squeak.'),
            HO('They’re back. All of them. Every one. Good.', 'soft'),
          ],
        },
      },
      {
        id: 'a01-18-s3',
        goal: 'Help Scar finish the circle that turns it all around.',
        hint: 'Carry chalk to the gap in the reverse circle. Scar will do the rest.',
        check: 'carry:a01-chalk:reverse-circle',
        scene: {
          id: 'a01-18-reverse',
          lines: [
            N('Hohenheim sends you up the stairs with a stub of chalk. In the city, Scar has a circle of his own. His brother spent his life working it out: a circle that runs the other way.'),
            SC('It needs one more line. There. The rubble broke it. Bring me the chalk.'),
            N('You run. Your Nubbin runs ahead of you, the chalk in its mouth, white dust all down its front.'),
            SC('My brother’s work. Never finished. Let it be finished now.'),
            A('Hurry, Scar! May and I can’t hold the pale soldiers back for long!'),
            N('He puts his tattooed arm to the line, and the whole circle lights up, pale and clean, the opposite of Father’s.'),
          ],
        },
        done: {
          id: 'a01-18-reverse-done',
          lines: [
            SC('You. You spoke, when the girl held the gun on me. You told her it wouldn’t give them back.'),
            SC('I hated that. Because it was true. It did not give mine back either.', 'sad'),
            SC('Tell her, if you see her. Tell her I am glad she didn’t. Tell her I am sorry.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-18-complete',
      lines: [
        N('Through the broken floor below you, Father reaches for his power and finds it slipping through his fingers.'),
        FA('What is this? Who did this? This is my country. These are my circles.', 'angry'),
        E('Not any more. Somebody else drew one too.'),
        N('Father rises through the ceiling and the streets and out into the open air, wild and huge. Everyone follows him up.'),
      ],
    },
    rewards: [],
    sets: { 'a01-18': true },
    notes:
      'NON-GRAPHIC: Mustang’s sight is taken in light; his eyes stay open and unharmed on screen. When the country ' +
      'stops, people simply go still and then breathe again; nobody falls, nobody is shown suffering. Father’s ' +
      '“god” is a door of light in the sky, never a religious image. WINRY PAYOFF (a01-winry, set five quests ago ' +
      'in A1-13): a01-18-reverse-done is for “spoke”. For “silent” play ATLAS_A01_VARIANTS ' +
      'a01-18-reverse-done-silent instead.',
  },

  // ---------------------------------------------------------------- A1-19
  {
    id: 'a01-19',
    code: 'A1-19',
    title: 'Al’s Gift',
    source: src('eps. 62–63, Al gives his soul for Ed’s arm'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-18') },
    requires: ['A1-18'],
    speakers: [ED, AL, MAY, MUSTANG, HAWKEYE, FATHER],
    steps: [
      {
        id: 'a01-19-s1',
        goal: 'Get Ed to the surface.',
        hint: 'His arm is broken. Give him your shoulder and get up the stairs.',
        check: 'escort:a01-ed:surface',
        scene: {
          id: 'a01-19-surface',
          lines: [
            N('In the open square, Father is fighting everyone at once, and winning. Ed’s steel arm has been smashed to scraps.'),
            E('Can’t clap. Can’t clap with one hand. Can’t do anything.', 'angry'),
            N('Mustang is firing blind, with Hawkeye calling the angles. It still isn’t enough.'),
            RM('Lieutenant, where is he? Tell me where to aim!', 'angry'),
            RH('Two o’clock, sir. Higher. Now!'),
            A('Brother. May. Come here. I need you both.'),
            N('Al’s voice is quiet and very sure, and something about it makes your chest go cold.'),
          ],
        },
      },
      {
        id: 'a01-19-s2',
        goal: 'Hold the line while May draws Al’s circle.',
        hint: 'Stand with the soldiers between Father and the circle. Don’t move until it lands.',
        check: 'wait:a01-al:line',
        scene: {
          id: 'a01-19-line',
          lines: [
            A('My soul. For his arm. A fair trade. Equivalent exchange. May, you can do it, I know you can.'),
            MC('Alphonse, no. No, you don’t understand what that means.', 'sad'),
            A('I understand. I’ve understood since the beginning. Brother gave his arm for me. I want to give it back.', 'soft'),
            E('Al, don’t you dare! AL!', 'shock'),
            N('Father turns towards the circle. You and every soldier in the square step into his way, shoulder to shoulder.'),
            N('Your Nubbin climbs out of Al, for the last time, and stands in the line beside your feet.'),
            A('Win, Brother.', 'soft'),
          ],
        },
        done: {
          id: 'a01-19-line-done',
          lines: [
            N('The circle flashes. The armour stands, then sways, then falls in a great clatter of steel, and the light inside it is gone.', 'sad'),
            N('Ed is standing up. His right arm is a real arm, thin and pale and bare, and the fist on the end of it is closed.'),
          ],
        },
      },
      {
        id: 'a01-19-s3',
        goal: 'Watch Ed land it.',
        hint: 'Hold the line one moment more. This part is his.',
        check: 'watch:a01-ed:last-punch',
        scene: {
          id: 'a01-19-punch',
          lines: [
            FA('A boy with a borrowed arm and a brother in a heap. What will you do? Strike me?'),
            N('Ed claps with two hands. He hits the ground and the ground rises under Father like a wave.'),
            N('Then Ed walks right up to him, through the dust, and hits him with his brother’s gift, again and again.', 'angry'),
            N('The stolen god pours out of Father like light out of a broken lamp. He shrinks to almost nothing.'),
            FA('I only wanted to be free. I only wanted to be more.', 'sad'),
            N('A white door opens behind him, and he is drawn backwards through it, very small. The door closes, softly, for ever.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-19-complete',
      lines: [
        N('The square is quiet. Ed walks over to the heap of armour and kneels down beside it.'),
        E('Al. Al, come on. Al.', 'sad'),
        N('Your Nubbin climbs into the armour through the open neck, looks everywhere, and climbs out again with nothing.', 'sad'),
        N('Ed puts his new hand flat on the cold steel. He doesn’t cry: he’s doing sums.'),
      ],
    },
    rewards: [],
    sets: { 'a01-19': true },
    notes:
      'Step 2 “hold the line” is a short stand-and-hold beat (hold a button while the soldiers brace); there is no ' +
      'fail state. NON-GRAPHIC: Ed’s punches are a flash and a sound, Father turns to light and falls in on himself; ' +
      'the white door is the Gate, and the One at the Gate is not shown here. Al’s soul’s going is the light ' +
      'leaving the helmet, nothing more.',
  },

  // ---------------------------------------------------------------- A1-20
  {
    id: 'a01-20',
    code: 'A1-20',
    title: 'Equivalent Exchange',
    source: src('eps. 63–64, Ed gives up his Gate, and the road home'),
    audience: 'teen',
    trigger: { where: WHERE, when: after('A1-19') },
    requires: ['A1-19'],
    speakers: [ED, AL, HOHENHEIM, TRUTH, MUSTANG, HAWKEYE, WINRY],
    steps: [
      {
        id: 'a01-20-s1',
        goal: 'Sit with Ed while he works out the price.',
        hint: 'Sit down next to him in the square. Hohenheim will come.',
        check: 'sit:a01-ed:square',
        scene: {
          id: 'a01-20-price',
          lines: [
            N('You sit on the cobbles next to Ed. For a long time, nobody says anything.'),
            HO('Use me. I have one life left in me, a real one, and it’s yours. Take it as the price.', 'soft'),
            E('No. You don’t get to make it up to us like that. You stay. You go home and see Mum’s grave and you stay.', 'angry'),
            HO('Then what will you pay with?'),
            N('Ed looks at his hands for a long moment. Then he smiles, the first proper smile you have seen on him in years.'),
            E('I’ve still got one thing. The thing I’ve always had. The thing that started it.', 'happy'),
            N('He picks up a piece of chalk from Scar’s broken circle and starts to draw.'),
          ],
        },
      },
      {
        id: 'a01-20-s2',
        goal: 'Watch Ed at the Gate.',
        hint: 'You can’t follow him in. Stay in the square and keep your eyes on the circle.',
        check: 'watch:a01-gate:white',
        scene: {
          id: 'a01-20-gate',
          lines: [
            N('He claps, and you see it with him, the way the page lets you see things: a white place with no floor, and a door of stone.'),
            N('A pale figure sits in front of it, cross-legged, all outline and grin.'),
            TR('Back again, alchemist. And what will you give this time?'),
            E('The Gate. My Gate. I don’t need it. Take the whole thing.', 'think'),
            TR('Then you will never do alchemy again. Not a spark. You will be an ordinary man.'),
            E('That’s fine. I’ve got people. That’s worth more than all the circles in the world.', 'happy'),
            TR('…Ha. Nobody has ever paid me in that coin before. Go on. He’s been waiting.', 'happy'),
            N('Inside the door, a thin boy with long hair is sitting in the dark. He looks up, and Ed holds out his hand.'),
          ],
        },
        done: {
          id: 'a01-20-gate-done',
          lines: [
            N('The circle in the square goes dark, and Ed is sitting in the middle of it. In his arms is his brother, thin as a reed, blinking.', 'happy'),
            A('Brother? I’m cold. I can feel the cold. I can feel the ground.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a01-20-complete',
      lines: [
        N('Everyone comes running. Winry comes running hardest of all, wrench still in hand.'),
        RM('I can’t see you. But I heard what you said, under the city, right after she said hers.', 'soft'),
        RM('You told me to go home. I think I will. And then I think I’ll go and rebuild Ishval.'),
        RH('He means thank you.'),
        ...A20_END,
      ],
    },
    rewards: [
      {
        id: 'a01-chalk-circle',
        kind: 'decor',
        label: 'Chalk Circle',
        description:
          'A circle drawn in white chalk on a flat stone, for the Grove. It never does anything. Nubbins like to sit in the middle of it, and the rain never quite washes it off.',
      },
      {
        id: 'a01-exchange-stall',
        kind: 'feature',
        label: 'Equivalent Exchange Stall',
        description:
          'A little trading stall for the Grove: put down two items and take one you want, at fair, fixed rates. No haggling, no luck, no limit: always the same trade.',
      },
    ],
    sets: { 'a01-20': true, 'a01-done': true },
    notes:
      'MUSTANG PAYOFF (a01-roy, set three quests ago in A1-17): a01-20-complete is for “spoke”. For “silent” play ' +
      'ATLAS_A01_VARIANTS a01-20-complete-silent. Both end with A20_END (Resembool, Hohenheim at Trisha’s grave, ' +
      'Ed and Winry shaking on it, the way home). The One at the Gate is a white outline with only a mouth; Ed’s answer ' +
      'is the source’s beat in new words, never the original line. Hohenheim’s death is a man going to sleep by a ' +
      'grave in the sun, with flowers: no more. REWARDS: the chalk circle is Grove decor; the stall is a Grove ' +
      'feature with fixed two-for-one rates (unlimited use, no timer, no daily reset). a01-done feeds the Price ' +
      'of Power festival.',
  },
];

// =================================================================== VARIANTS

/** Scenes chosen by this page’s own Atlas flags. Each note above says where it plays. */
export const ATLAS_A01_VARIANTS: Scene[] = [
  // A1-10: a01-exam = doubt. Replaces a01-10-complete.
  {
    id: 'a01-10-complete-doubt',
    lines: [
      N('The page brings you back to the butcher’s shop. The brothers finally knock.'),
      N('Izumi Curtis opens the door, learns Ed is a State Alchemist, and throws him across the street.', 'angry'),
      IZ('A dog of the army! My student!', 'angry'),
      E('Someone asked me if I was sure! I wasn’t! I did it anyway, for Al!', 'shock'),
      IZ('…Then at least somebody asked you. Good. Somebody should have.', 'think'),
      N('Then they tell her what they did in the chalk circle. She is quiet for a long time.'),
      IZ('I tried it too. A child of mine, who didn’t live. So I can’t shout at you for that one.', 'sad'),
      N('She pulls both of them into a hug, armour and all. It sounds like someone hugging a bell.', 'soft'),
    ],
  },
  // A1-16: a01-notes = burnt. Replaces a01-16-gate.
  {
    id: 'a01-16-gate-burnt',
    lines: [
      N('Night before the eclipse. Briggs soldiers stand in the snow-wet streets of Central, and Central’s gate is shut against them.'),
      N('The sergeant on the gate is young and frightened and has his orders.'),
      MI('Your officers have been feeding this country to a circle. We could show you, if we had the papers.'),
      E('We don’t. We burnt them. Give me a lamp and a table. I’ll write them out again.'),
      N('Ed sits on a crate under a street lamp and writes all night: names, numbers, the recipe and what it needs. His hand cramps.'),
      N('You hand him paper, and your Nubbin keeps the pages from blowing away. Al holds the lamp, and doesn’t say anything.'),
      N('At dawn the sergeant reads it, and his face changes as he reads.'),
      N('The gate opens with the sun already up. It has cost the whole night.', 'sad'),
    ],
  },
  // A1-16: a01-notes = burnt. Replaces a01-16-complete.
  {
    id: 'a01-16-complete-burnt',
    lines: [
      N('You reach the heart of the tunnels with the day already half gone. There is no time to plan, only to run.'),
      E('Should’ve kept them. Should’ve… no. I’d burn them again. When this is over, I’ll burn the new ones too.', 'think'),
      A('And nobody can take what’s in your head, Brother. You did it. You remembered every word.'),
      E('Yeah. I always do. That’s the trouble with me.', 'sad'),
      N('Ed hasn’t slept, and he runs anyway. You run with him.'),
    ],
  },
  // A1-18: a01-winry = silent. Replaces a01-18-reverse-done.
  {
    id: 'a01-18-reverse-done-silent',
    lines: [
      SC('You. You stood by the girl when she held the gun on me. You said nothing. You only stood there.'),
      SC('I have thought about that more than I would like. Nobody stood beside me, in Ishval. Not after.', 'sad'),
      SC('Tell her, if you see her. Tell her I am glad she didn’t. Tell her I am sorry.'),
    ],
  },
  // A1-20: a01-roy = silent. Replaces a01-20-complete.
  {
    id: 'a01-20-complete-silent',
    lines: [
      N('Everyone comes running. Winry comes running hardest of all, wrench still in hand.'),
      RM('I can’t see you. But I knew you were there, under the city. Beside her. You never said a word.', 'soft'),
      RM('I needed someone to stand there more than I needed telling. I think I’ll go home. Then I’ll go and rebuild Ishval.'),
      RH('He means thank you.'),
      ...A20_END,
    ],
  },
];

// =================================================================== FLAGS AND CHECKS

/** Every flag this line sets (Atlas save only). It reads no Grove state and writes no Grove flag. */
export const ATLAS_A01_FLAGS: string[] = [
  'a01-01',
  'a01-02',
  'a01-03',
  'a01-04',
  'a01-05',
  'a01-06',
  'a01-07',
  'a01-08',
  'a01-09',
  'a01-10',
  'a01-11',
  'a01-12',
  'a01-13',
  'a01-14',
  'a01-15',
  'a01-16',
  'a01-17',
  'a01-18',
  'a01-19',
  'a01-20',
  'a01-done', // A1-20: the whole page; read by atlasDone('A1') for the Price of Power festival
  'a01-exam', // study | doubt (a01-02-books): A1-10 complete
  'a01-notes', // kept | burnt (a01-07-notes): THE SIGNATURE CHOICE; A1-15 complete line, A1-16 gate and complete
  'a01-winry', // spoke | silent (a01-13-gun): A1-18 reverse-done
  'a01-roy', // spoke | silent (a01-17-envy): A1-20 complete
];

export const ATLAS_A01_CHECKS: string[] = [
  'explore:a01-resembool:lane',
  'watch:a01-gate:elric-study',
  'wait:a01-gate:elric-study',
  'talk:a01-mustang:rockbell-house',
  'choose:a01-exam:kitchen',
  'watch:a01-exam:central',
  'visit:a01-lior:square',
  'find:a01-microphone:temple',
  'talk:a01-rose:steps',
  'visit:a01-tucker:library',
  'walk:a01-alexander:garden',
  'wait:a01-tucker:step',
  'deliver:a01-warning:east-city',
  'explore:a01-alley:east-city',
  'collect:a01-armour:alley',
  'escort:a01-al:train',
  'give:a01-parts:rockbell-workshop',
  'build:a01-armour:rockbell-yard',
  'puzzle:a01-notes:library',
  'explore:a01-lab5:gate',
  'choose:a01-notes:hospital',
  'talk:a01-hughes:records',
  'inspect:a01-phonebox:central',
  'deliver:a01-photo:hughes-house',
  'find:a01-watch:rush-valley',
  'talk:a01-dominic:workshop',
  'deliver:a01-baby:workshop',
  'explore:a01-island:shore',
  'feed:a01-brothers:island',
  'sit:a01-island:fire',
  'escort:a01-al:dublith',
  'visit:a01-nest:cellar',
  'carry:a01-nubbin:nest',
  'feed:a01-ling:rush-valley',
  'talk:a01-ed:central-corridor',
  'find:a01-xiaomei:central',
  'escort:a01-winry:central',
  'choose:a01-winry:central-square',
  'escort:a01-ling:warehouse',
  'explore:a01-belly:dark-sea',
  'watch:a01-ed:circle',
  'walk:a01-briggs:mountain-road',
  'talk:a01-olivier:fortress',
  'carry:a01-fuel:briggs',
  'talk:a01-miles:central-gate',
  'explore:a01-tunnels:central',
  'find:a01-mustang:tunnel',
  'choose:a01-roy:tunnel',
  'visit:a01-father:chamber',
  'watch:a01-eclipse:chamber',
  'carry:a01-chalk:reverse-circle',
  'escort:a01-ed:surface',
  'wait:a01-al:line',
  'watch:a01-ed:last-punch',
  'sit:a01-ed:square',
  'watch:a01-gate:white',
];
