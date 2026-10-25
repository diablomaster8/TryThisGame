/**
 * The Learning Grove, reader band (ages 7–10): Atlas A19, The Dragon Who Fell (How to Train Your
 * Dragon, Berk and the Norse world).
 *
 * Source: atlas-a19.ts (ATLAS_A19 and A19_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a19-first`). The reader band keeps
 * every choice, so no `defaultChoice` is needed. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: how Viking-age people lived on cold islands (longhouses and
 * halls, longships, fishing, drying and smoking fish, round shields, sheep and horses) and that
 * Berk itself is invented; how real animals learn to trust (quiet, food, patience, never grabbing);
 * how a tail fin or rudder steers; and that prosthetic legs and feet let people run, walk and dance
 * and are nothing to hide. Maths, science, language, art, health and feelings are blended into the
 * story: bellows and air, the Pole Star, blind spots, sound and pitch, fog, dizziness, springs,
 * the Doppler effect, time sums, distance and speed, and fair sharing.
 *
 * Think questions (`ask` with no `best`) in every quest: fairness, honesty, courage, what makes a
 * sorry real, whether waiting is doing nothing.
 *
 * Hard things follow EDU-STYLE.md. Stoick’s hurtful words in A19-13 are never given; the reader
 * keeps the apology in A19-16 in full. The dragon in the pit is lost in the mist offscreen, as in
 * the original. Hiccup’s foot is said plainly, with no wound shown. There is no oath and no
 * religious practice, and the two lifted film lines are not used.
 *
 * Numbers made up for the sums: four ships of twelve barrels each (A19-3), a forty-minute walk
 * (A19-3), 720 km in twelve days at 60 km a day (A19-10), a twelve-metre pine (A19-11), and a
 * 1,800 m climb at 300 m a minute (A19-17). The original says “five dragons” in A19-15; this band
 * says four (Nadder, Gronckle, Nightmare, Zippleback), with Hiccup riding behind Astrid.
 */
import type { EduQuest, EduScene, Lesson, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const H = say('a19-hiccup');
const ST = say('a19-stoick');
const GB = say('a19-gobber');
const A = say('a19-astrid');
const FL = say('a19-fishlegs');
const SN = say('a19-snotlout');
const RF = say('a19-ruffnut');
const TF = say('a19-tuffnut');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches; a think question has none. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`, in play order. */
const sc = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: lessons.map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary: GlossaryEntry[],
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  glossary,
});

/** A lesson that asks. A think question passes options with no `best`. */
const ask = (
  domain: Lesson['domain'],
  skill: string,
  after: number,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
  standard?: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'ask',
  after,
  prompt,
  options,
  parentNote,
});

/** A lesson that tells something true. */
const notice = (
  domain: Lesson['domain'],
  skill: string,
  after: number,
  lines: Line[],
  parentNote: string,
  standard?: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'notice',
  after,
  lines,
  parentNote,
});

/** A lesson the child does. */
const doit = (
  domain: Lesson['domain'],
  skill: string,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

const SELF = 'CASEL: Self-awareness';
const MANAGE = 'CASEL: Self-management';
const SOCIAL = 'CASEL: Social awareness';
const RELATE = 'CASEL: Relationship skills';
const DECIDE = 'CASEL: Responsible decision-making';

// ================================================================== A19-1 This Is Berk
const Q01: EduQuest = quest(
  'a19-01',
  'This Is Berk',
  {
    'a19-01-s1': {
      goal: 'Come ashore on Berk and find somewhere to sleep.',
      hint: 'Touch the page, then walk up the jetty to the boy counting barrels.',
    },
    'a19-01-s2': {
      goal: 'Keep the forge fire hot while the raid goes on outside.',
      hint: 'Pump the bellows in time. The fire wants long, steady pushes.',
    },
    'a19-01-s3': {
      goal: 'Help Hiccup get his home-made launcher out of the forge.',
      hint: 'Take one end of the launcher and wheel it out of the forge door.',
    },
  },
  [
    sc(
      'a19-01-arrive',
      [
        N(
          'Nova’s atlas falls open at a page drawn in charcoal. You blink, and you and your Nubbin are on a rocking boat in the spray.',
        ),
        N(
          'Ahead, an island of cliffs and wooden houses climbs out of the sea. There are sheep on every ledge that will hold one.',
        ),
        N(
          'On the jetty, a skinny boy in a fur waistcoat is counting barrels, badly, because he keeps looking at the sky.',
        ),
        H(
          'Welcome to Berk. It’s far to the north, it rains nearly every day, and the wind has never once stopped.',
        ),
        H('I’m Hiccup. Yes, it’s a real name in my story. No, I didn’t pick it.'),
        N(
          'A big man stumps down the jetty with a hammer in one hand and a hook where the other should be.',
        ),
        GB('Iron for the forge, at last! And what’s that?', 'think'),
        N('Your Nubbin, who has been sick twice over the side, peers up at him.'),
        GB(
          'A hatchling, from the south by the look of it. No, don’t tell me. If I don’t know what it is, I don’t have to do anything about it.',
        ),
      ],
      [
        notice(
          'social-studies',
          'Berk is invented, but the Vikings were real and settled cold islands',
          4,
          [
            N(
              'Berk is made up, so you will not find it on a map. But the Vikings were real people.',
            ),
            N(
              'They sailed from Scandinavia in long, narrow ships, from the late 700s to the 1060s.',
            ),
            N(
              'Real Norse families settled on cold, windy islands like Shetland, the Faroes and Iceland.',
            ),
          ],
          'Learned that Berk is invented but the Vikings were real, and that Norse families settled on cold islands such as Shetland, the Faroes and Iceland.',
          'D2.His.2.3-5',
        ),
        ask(
          'literacy',
          'working out an unknown word from the words round it',
          8,
          [
            N(
              'Gobber calls your Nubbin a “hatchling”, and an egg hatches. What do you think a hatchling is?',
            ),
          ],
          [
            opt(
              'A young creature that has just come out of an egg',
              [N('Yes. The word hides a clue: hatch, plus -ling, which means a small young one.')],
              true,
            ),
            opt('A little door in a roof', [
              N(
                'A hatch can be a door, but Gobber is talking about your Nubbin. Think of eggs: a hatchling hatches.',
              ),
            ]),
            opt('A kind of hat', [
              N(
                'It sounds like it, but look at the clue “from the south” and the egg link. A hatchling has just hatched.',
              ),
            ]),
          ],
          'Worked out the meaning of “hatchling” from its parts and the story.',
          'L.3.4',
        ),
      ],
      [
        {
          id: 'nubbin',
          label: 'Tell him it’s a Nubbin.',
          then: [
            GB('A Nubbin. Right. Never heard of one, so it can’t be on the list of things to hit.'),
          ],
        },
        {
          id: 'wing',
          label: 'Let your Nubbin wave a wing at him.',
          then: [
            N(
              'Your Nubbin waves one stubby wing. Gobber waves his hook back, gravely, as one professional to another.',
            ),
          ],
        },
        {
          id: 'quiet',
          label: 'Say nothing at all.',
          then: [
            H('That’s the right answer with Gobber. He likes a mystery he doesn’t have to solve.'),
          ],
        },
      ],
    ),
    sc(
      'a19-01-arrive-done',
      [
        GB(
          'You’ll want work. Everyone on Berk works, or gets eaten. There’s a loft over the forge, and bellows with nobody on them.',
        ),
        H('Welcome to the forge. Mind the sword rack. And the axe rack. And the ceiling.', 'happy'),
        N(
          'A forge is a workshop with a very hot fire, where a smith heats iron until it can be hammered into shape.',
        ),
        N(
          'The loft is warm and smells of smoke and hot metal. Your Nubbin makes a nest in a pile of old sacks.',
        ),
        N('Down below, crates of iron bars wait to be unpacked.'),
      ],
      [
        ask(
          'maths',
          'multiply equal groups: 3 × 12',
          4,
          [
            N(
              'The boat brought 3 crates of iron bars, and each crate holds 12 bars. How many bars is that altogether?',
            ),
          ],
          [
            opt(
              '36',
              [
                GB(
                  'Yes! Twelve, and twelve, and twelve: 12 + 12 + 12 = 36. Three groups of twelve.',
                ),
              ],
              true,
            ),
            opt('15', [
              GB('That is 3 + 12. But there are three whole crates of twelve. Try 12 + 12 + 12.'),
            ]),
            opt('24', [GB('That is two crates. We have three: 12 + 12 + 12 = 36.')]),
          ],
          'Multiplied 3 equal groups of 12 to find 36.',
          '3.OA.A.3',
        ),
      ],
    ),
    sc(
      'a19-01-raid',
      [
        N(
          'You wake in the dark to horns, shouting, and a red light under the loft door that is not morning.',
        ),
        N(
          'Out in the lane a roof is burning. Something with wings lifts a sheep off a wall, and the sheep looks more surprised than anyone.',
        ),
        GB(
          'Keeper! Bellows! Every axe on Berk comes back blunt by midnight, and every one of them wants an edge!',
        ),
        N(
          'You pump, and the fire roars white. Your Nubbin sits on the end of the anvil, flinching at every bang from outside.',
        ),
        H(
          'Sorry I’m late. I was out there, briefly. Everybody told me to come back in here, very firmly.',
          'sad',
        ),
        GB(
          'Because out there you’re a danger to yourself and everyone near you. In here you’re only a danger to me.',
        ),
        H('That’s fair. That’s actually fair.', 'think'),
        N(
          'Vikings run in with blunt axes and run out with sharp ones. Nobody looks at Hiccup, except to step round him.',
        ),
      ],
      [
        ask(
          'science',
          'a fire needs air to burn, and burning cannot be undone',
          3,
          [
            N(
              'The fire roars white when you pump the bellows. What are the bellows giving the fire?',
            ),
          ],
          [
            opt(
              'Air, which a fire needs in order to burn',
              [
                GB(
                  'Yes! Fire eats air as well as wood. Blow more in, and it burns hotter and whiter.',
                ),
                GB('And burnt is burnt. Ash never turns back into wood.'),
              ],
              true,
            ),
            opt('More wood', [
              GB(
                'The wood is already in there. The bellows push in air, and that is what the fire is hungry for.',
              ),
            ]),
            opt('Water', [GB('Water would put the fire out. Bellows give it air.')]),
          ],
          'Learned that a fire needs air to burn, which is why a forge uses bellows, and that burning cannot be undone.',
        ),
        ask(
          'sel',
          'how kindness changes the way we hear a hard truth',
          6,
          [N('Gobber tells Hiccup to stay inside. Why?')],
          [
            opt(
              'He wants Hiccup safe',
              [N('Yes. Under the grumbling, Gobber is looking after him.')],
              true,
            ),
            opt('He wants the bellows pumped', [
              N('That too, but mostly he wants Hiccup out of danger.'),
            ]),
            opt('He thinks Hiccup is a dragon', [N('No. That would be a very odd forge.')]),
          ],
          'Noticed that a grumpy remark can come from caring, and that Gobber keeps Hiccup inside to keep him safe.',
          SOCIAL,
        ),
      ],
    ),
    sc(
      'a19-01-raid-done',
      [
        N(
          'By the end your arms are jelly. Your Nubbin has fallen asleep on the anvil, which nobody else on Berk could do.',
        ),
        GB('Not bad, for the help. Hiccup, stay here. Stay. Here.'),
        N('Hiccup holds up his hands. They are black with soot to the elbow.'),
        H('I am staying. Look. Staying very hard.', 'think'),
        N(
          'Outside the horns stop. The raid is over, and the village begins to count what is missing.',
        ),
      ],
      [
        notice(
          'health',
          'tired muscles need rest, food and water to recover',
          0,
          [
            N(
              'Your arms feel like jelly because your muscles have used up the energy stored in them.',
            ),
            N(
              'Rest, water and food let them recover. Each time you work them, they get a little stronger.',
            ),
          ],
          'Learned why muscles feel tired after hard work and that rest, food and water help them recover.',
          '4-LS1-1',
        ),
      ],
    ),
    sc(
      'a19-01-launcher',
      [
        N(
          'The moment Gobber is out of the door, Hiccup is under his workbench, pulling a sheet off something with wheels.',
        ),
        N(
          'It is a wooden frame with a crank, and three stones tied together on ropes, packed into its jaws like peas in a pod.',
        ),
        H(
          'Bola launcher. I made it. The ropes wrap round the wings, the dragon comes down, and I stop being… whatever they call me.',
        ),
        Y('What do they call you?'),
        H('Mostly they don’t. That’s the problem.', 'sad'),
        H(
          'It needs to go up on the cliff. It’s heavy, it’s badly balanced, and it will probably go off on the way.',
        ),
        N('Your Nubbin, awake now, looks at the launcher, then at the open door, then at you.'),
      ],
      [
        notice(
          'science',
          'wheels roll, so there is less rubbing than dragging',
          0,
          [
            N('Drag something heavy along the ground and friction rubs against it the whole way.'),
            N('A wheel rolls instead of rubbing, so the same load is much easier to move.'),
          ],
          'Learned that wheels reduce friction, which makes heavy loads easier to move.',
          '3-PS2-1',
        ),
        ask(
          'sel',
          'what makes it easier to ask for help',
          5,
          [
            N(
              'Hiccup needs help carrying something heavy, but he finds it hard to ask. What helps someone ask?',
            ),
          ],
          [
            opt(
              'Knowing a friend will say yes and not laugh',
              [H('That’s it. It’s the laughing I’m afraid of, more than the asking.', 'soft')],
              true,
            ),
            opt('Pretending you need nothing', [
              H(
                'I’ve tried that. You end up carrying everything alone, and it’s heavier than it looks.',
                'think',
              ),
            ]),
            opt('Doing it all by yourself', [
              H('Sometimes that works. Not with a launcher. It has opinions.', 'think'),
            ]),
          ],
          'Talked about what makes it easier to ask for help: a friend who says yes and does not laugh.',
          RELATE,
        ),
      ],
      [
        {
          id: 'help',
          label: 'Take the back end.',
          then: [
            N(
              'You take the back end. It is heavier than it looks, and it creaks in a way that sounds like a warning.',
            ),
            H('Thank you. Nobody ever takes the back end.', 'happy'),
          ],
        },
        {
          id: 'gobber',
          label: 'Gobber said to stay here.',
          then: [
            H('Gobber also says the soup is fish. It isn’t always fish.', 'think'),
            N('He starts pushing it out on his own. You find you have taken the back end anyway.'),
          ],
        },
      ],
    ),
    sc(
      'a19-01-launcher-done',
      [
        N(
          'Out into the lane you go, past a burning cart and a Viking chasing his own helmet down the hill.',
        ),
        N('The launcher wobbles at every stone. One wheel squeaks like a mouse being stepped on.'),
        H('Left! Your left! It likes to go left. It’s got opinions.', 'think'),
        N('Your Nubbin rides on top, holding on with both paws, looking at the sky.'),
        N('Behind you, the shouting of the raid is a long way off, and getting longer.'),
      ],
      [
        ask(
          'literacy',
          'what a simile tells us',
          1,
          [
            N(
              '“One wheel squeaks like a mouse being stepped on.” What does this comparison tell you about the squeak?',
            ),
          ],
          [
            opt(
              'That it is thin, high and a little pitiful',
              [
                N(
                  'Yes. A simile compares two things using “like” or “as”, and picks the part that matters: the small, high, pitiful sound.',
                ),
              ],
              true,
            ),
            opt('That the wheel is very small', [
              N('Not quite. The comparison is about the sound, not the size of the wheel.'),
            ]),
            opt('That there is a real mouse under the wheel', [
              N(
                'Ha, no! A simile says one thing is like another, so the squeak is only like a squashed mouse.',
              ),
            ]),
          ],
          'Worked out what a simile says about a sound.',
          'L.4.5',
        ),
      ],
    ),
    sc(
      'a19-01-complete',
      [
        N(
          'You get the launcher up the slope behind the forge, to a lip of rock over the dark sea.',
        ),
        H('There. Now we wait for the one nobody sees.'),
        N(
          'Hiccup kneels behind the crank. His hands are shaking a little, but he holds them still on purpose.',
        ),
        H('If I hit it, they’ll have to look at me. That’s all I want. One look.', 'soft'),
        N('Out over the water, very high, something screams like tearing cloth.'),
        N(
          'Hiccup breathes in slowly, and out. Whatever comes next, he is going to meet it with steady hands.',
        ),
      ],
      [
        notice(
          'sel',
          'slow breathing helps when we are nervous',
          2,
          [
            N('Nerves are a body alarm: the heart races, the hands shake, the breath goes short.'),
            N(
              'Slow breaths tell the alarm to quieten. Try in for four counts and out for six, a few times.',
            ),
          ],
          'Learned that nerves are a body alarm and that slow breathing, with a longer breath out, helps it calm.',
          MANAGE,
        ),
      ],
    ),
  ],
  [
    gloss('hatchling', 'A baby animal that has just come out of its egg.', 'a19-01-arrive'),
    gloss(
      'jetty',
      'A small pier of wood or stone that sticks out into the water, where boats tie up.',
      'a19-01-arrive',
    ),
    gloss(
      'bellows',
      'A squeezable bag or pump that blows air onto a fire to make it hotter.',
      'a19-01-raid',
    ),
    gloss('anvil', 'A heavy block of iron that a smith hammers hot metal on.', 'a19-01-raid'),
    gloss('bola', 'A set of weighted ropes thrown to tangle up an animal.', 'a19-01-launcher'),
    gloss('crank', 'A handle you turn round to make a machine work.', 'a19-01-launcher'),
  ],
);

// ================================================================== A19-2 The Night Fury
const Q02: EduQuest = quest(
  'a19-02',
  'The Night Fury',
  {
    'a19-02-s1': {
      goal: 'Watch the sky with Hiccup, and see where the shot goes.',
      hint: 'Stay by the launcher on the cliff and keep your eyes on the stars.',
    },
    'a19-02-s2': {
      goal: 'Get Hiccup down to the village in one piece.',
      hint: 'Run for the torch posts in the square and keep behind them.',
    },
    'a19-02-s3': {
      goal: 'Stand by Hiccup while he tells his father.',
      hint: 'Stay with Hiccup in the square while Stoick listens, or doesn’t.',
    },
  },
  [
    sc(
      'a19-02-shot',
      [
        N('Below, a tower of torches burns, and Vikings throw everything they have at the sky.'),
        N(
          'Then there is that sound again, a high rising whistle, and a tower bursts apart in blue-white fire.',
        ),
        H('That’s it. That’s the one. It never steals, never shows itself, never misses.'),
        N(
          'You look up and see nothing but stars. Then not stars, where something black has crossed in front of them.',
        ),
        H('Come on. Give me something. Anything to aim at.'),
        N('The whistle comes again. Hiccup sees the flash, swings the launcher round, and pulls.'),
        N(
          'The bola spins up into the dark. Far out there is a shriek, and a shape tumbles out of the sky behind the ridge.',
        ),
        H('I hit it. I hit it! Did anybody see that?', 'shock'),
        N('Down in the village, nobody did. Your Nubbin did, and so did you.'),
      ],
      [
        notice(
          'science',
          'stars are far-away suns, and the Pole Star stays still in the north',
          3,
          [
            N(
              'Stars are suns, very far away. We only see them at night because the daytime sky is too bright.',
            ),
            N(
              'Sailors long ago steered by them. In the north, the Pole Star stays almost still while the other stars wheel around it.',
            ),
          ],
          'Learned that stars are distant suns, and that sailors in the north steered by the Pole Star.',
          '5-ESS1-2',
        ),
      ],
      [
        {
          id: 'saw',
          label: 'Tell him you saw it.',
          then: [H('You saw it. Somebody saw it. Right. Good. I’m not mad.', 'happy')],
        },
        {
          id: 'ridge',
          label: 'Point to where it fell.',
          then: [
            N(
              'You point at the dark ridge. Hiccup lines up your arm with his eye and learns the spot like a map.',
            ),
          ],
        },
        {
          id: 'sure',
          label: 'Ask if he’s sure.',
          then: [
            H(
              'No. Yes. It fell. Things don’t fall like that unless something has gone wrong with them.',
              'think',
            ),
          ],
        },
      ],
    ),
    sc(
      'a19-02-shot-done',
      [
        N(
          'Behind you, a wooden stake snaps. Something large has landed on the cliff, and it is not black, and it is very awake.',
        ),
        N(
          'It is long and red, with a crest of spikes down its back, and it breathes out a long, low, rumbling sigh.',
        ),
        H('Ah. Not the one I was hoping for.', 'shock'),
        N('The rumble shakes the stones under your feet. Your Nubbin’s ears flatten.'),
        N('The Nightmare breathes in, and the air round its jaws begins to glow.'),
      ],
      [
        ask(
          'music',
          'faster vibrations make a higher sound',
          3,
          [
            N(
              'The Night Fury’s whistle was high and thin, and this dragon’s rumble is low. Which sound has the faster vibration?',
            ),
          ],
          [
            opt(
              'The high whistle',
              [
                N(
                  'Yes. The faster something vibrates, the higher the note: a whistle wiggles the air very fast, and a rumble slowly.',
                ),
              ],
              true,
            ),
            opt('The low rumble', [
              N('Not quite. A low sound is a slow wobble, and the high whistle is the fast one.'),
            ]),
            opt('They vibrate at the same speed', [
              N(
                'If they did, they would sound the same. The whistle is higher because it vibrates faster.',
              ),
            ]),
          ],
          'Learned that faster vibrations make a higher pitch, comparing a whistle and a rumble.',
          '4-PS3-2',
        ),
      ],
    ),
    sc(
      'a19-02-chase',
      [
        N(
          'It is a Monstrous Nightmare. It heaves the rest of itself over the lip of the cliff, on fire along its whole back.',
        ),
        H('Ah. Not that one. Run. Running would be good.', 'shock'),
        N(
          'You run, all three of you, down the slope, with the heat of it on your neck. Your Nubbin runs through Hiccup’s legs, twice.',
        ),
        H('Left! No, other left! Behind the torch post!'),
        N(
          'You throw yourselves behind a torch post. The fire splits round it, and the wood begins to smoke.',
        ),
        N(
          'Then a man the size of a door steps out and meets the Nightmare with nothing but his shoulder and a roar.',
        ),
        N(
          'The Nightmare thinks about it, and goes. Above it, the last of the raid goes too, with half the village’s sheep.',
        ),
      ],
      [
        notice(
          'health',
          'the heart beats faster to feed the muscles when we run',
          2,
          [
            N(
              'When you run, your heart beats faster. It pumps blood, and blood carries oxygen to your leg muscles.',
            ),
            N(
              'After you stop, it takes a few minutes for your heart and breathing to slow down again.',
            ),
          ],
          'Learned that the heart beats faster during exercise to carry oxygen to the muscles.',
          '4-LS1-1',
        ),
      ],
    ),
    sc(
      'a19-02-chase-done',
      [
        ST('Hiccup.'),
        H('Hi, Dad.', 'sad'),
        N(
          'Stoick the Vast is the chief of Berk. He is very large, very tired, and covered in soot.',
        ),
        N(
          'Hiccup’s shoulders have gone up round his ears. He is trying to look like a person who has done nothing at all.',
        ),
        N('Neither of them says anything else, which says quite a lot.'),
      ],
      [
        ask(
          'literacy',
          'reading what silence shows about characters',
          4,
          [
            N(
              'Neither of them says any more, “which says quite a lot”. What can the silence tell us?',
            ),
          ],
          [
            opt(
              'That both of them feel awkward and worried',
              [
                N(
                  'Yes. What characters do not say can show their feelings as clearly as what they do say.',
                ),
              ],
              true,
            ),
            opt('That they have nothing to say', [
              N(
                'Look at Hiccup’s shoulders. A person with nothing to say would not look so tense.',
              ),
            ]),
            opt('That they are about to sing', [
              N('Ha, not on Berk! The silence is full of feelings, not songs.'),
            ]),
          ],
          'Read what a silence between two characters shows about how they feel.',
          'RL.3.3',
        ),
      ],
    ),
    sc(
      'a19-02-nobody',
      [
        H(
          'I hit a Night Fury. Up on the cliff. It came down past the ridge, you could send someone to…',
        ),
        ST(
          'Stop. Every time you step outside, something gets broken. Tonight it was a torch post and the fish store.',
          'angry',
        ),
        ST('I’ve a village to feed, and the winter coming, and the dragons have had the sheep.'),
        H('I know what I saw.'),
        N('Behind Stoick, a few Vikings are laughing: not loudly, just enough.'),
        ST('Gobber, see him home. And who’s this?', 'think'),
        GB(
          'The new help, Stoick. Good arms. The small one’s some sort of hatchling. Southern. Harmless.',
        ),
        N(
          'Stoick looks at you, then at your Nubbin, and decides he has no room in his head for either of you tonight.',
        ),
      ],
      [
        notice(
          'social-studies',
          'scarcity means people must choose how to use limited food and time',
          2,
          [
            N('Stoick has only so much food, so many sheep and so many hours before winter.'),
            N(
              'When there is not enough of something to go round, people have to choose. That is what scarcity means.',
            ),
          ],
          'Learned that scarcity means there is not enough to go round, so people have to choose.',
          'D2.Eco.1.3-5',
        ),
        ask(
          'sel',
          'whether being busy excuses not listening',
          7,
          [
            N(
              'Stoick has a village to feed and little time. Is that a good reason not to listen to his son?',
            ),
          ],
          [
            opt('Being busy is a reason, but not an excuse', [
              N(
                'That’s a fair answer. Everyone is busy sometimes, but listening for a minute can cost very little.',
              ),
            ]),
            opt('A leader must put the whole village first', [
              N(
                'That’s a fair answer. A chief has many people to look after, though his son is one of them.',
              ),
            ]),
            opt('It depends how important what Hiccup says is', [
              N(
                'That’s a fair answer. It is hard to know what is important until you have listened.',
              ),
            ]),
          ],
          'Thought about whether being busy is a good reason not to listen to someone.',
          SOCIAL,
        ),
      ],
      [
        {
          id: 'back',
          label: 'Say you saw it too.',
          then: [
            ST('Then you were both looking at the dark. It’s easy to see things in the dark.'),
            N('He isn’t unkind about it. He just has no room for it tonight.'),
          ],
        },
        {
          id: 'stand',
          label: 'Say nothing. Stand next to Hiccup.',
          then: [
            N('You say nothing. You stand next to Hiccup, close enough that he can tell.'),
            H('Thanks.', 'soft'),
          ],
        },
      ],
    ),
    sc(
      'a19-02-complete',
      [
        N(
          'Gobber walks you both back to the forge, and leaves you at the door with a look that means stay put this time.',
        ),
        H(
          'He thinks I’m a joke. They all do. I’ll find it tomorrow. I’ll find it, and I’ll…',
          'sad',
        ),
        N(
          'He doesn’t finish. He goes up to his corner and draws by candlelight for a long time instead.',
        ),
        N(
          'From the loft you can hear the charcoal scratching. It sounds like someone trying to remember exactly what he saw.',
        ),
        N(
          'Charcoal is made by burning wood with very little air, so it comes out black and light, and draws a soft, smudgy line.',
        ),
      ],
      [
        notice(
          'art',
          'drawing helps us notice details, and soft charcoal suits shadows',
          3,
          [
            N(
              'Artists draw to see. When you draw something slowly, you notice shapes, shadows and tiny details you missed.',
            ),
            N(
              'Each material suits a job. Soft charcoal makes dark, smudgy shadows, and a hard pencil makes fine lines.',
            ),
          ],
          'Learned that careful drawing helps us notice details, and that soft charcoal suits shadows.',
        ),
      ],
    ),
  ],
  [
    gloss('ridge', 'A long, narrow strip of high ground along the top of a hill.', 'a19-02-shot'),
    gloss(
      'scarcity',
      'When there is not enough of something to go round, so people have to choose.',
      'a19-02-nobody',
    ),
  ],
);

// ================================================================== A19-3 The Fleet Sails
const Q03: EduQuest = quest(
  'a19-03',
  'The Fleet Sails',
  {
    'a19-03-s1': {
      goal: 'Go up to the Great Hall and hear what the chief has decided.',
      hint: 'The Great Hall is at the top of the village. Stand near the back.',
    },
    'a19-03-s2': {
      goal: 'Help load the fleet before it sails.',
      hint: 'Carry stores from the fish sheds down to the ships on the jetty.',
    },
    'a19-03-s3': {
      goal: 'Look at what Hiccup has been drawing.',
      hint: 'His notebook is open on the forge bench while he fetches charcoal.',
    },
  },
  [
    sc(
      'a19-03-hall',
      [
        N(
          'In the morning the Great Hall smells of smoke and wet wool. Stoick stands at the head of the long table with a map.',
        ),
        ST(
          'The nest. Find it, and the raids stop. I’m taking the ships out one more time, before the ice.',
        ),
        N('Nobody cheers. The last time the ships went out, fewer came back.'),
        ST('I want every ship. Gobber stays. Somebody has to train the young ones.'),
        GB('And Hiccup?'),
        N('Stoick looks down the table at his son, who is trying to be very small behind a jug.'),
        ST('Hiccup trains with the rest. It’s time.', 'think'),
        H('Dad, I really don’t think that…', 'sad'),
        ST('You’ll have an axe. You’ll have Gobber. You’ll learn. That’s the end of it.'),
      ],
      [
        ask(
          'social-studies',
          'compass directions: the way home is opposite to the way out',
          1,
          [
            N(
              'The nest is far to the north. If the ships sail north to find it, which way must they sail to come home?',
            ),
          ],
          [
            opt(
              'South',
              [
                N(
                  'Yes. South is the opposite of north, so sailing home means heading back the way you came.',
                ),
              ],
              true,
            ),
            opt('North', [
              N(
                'If they keep sailing north, they will go further from home. Home is the opposite way: south.',
              ),
            ]),
            opt('East', [
              N(
                'East is sideways to north. To come straight back, they sail the opposite direction: south.',
              ),
            ]),
          ],
          'Used compass directions: the way back from a journey north is south.',
          'D2.Geo.2.3-5',
        ),
      ],
    ),
    sc(
      'a19-03-hall-done',
      [
        GB('Dragon training, then. Morning, in the arena. Bring the lad.'),
        GB('Bring the hatchling, too. It can learn what not to be.'),
        N('Gobber winks at your Nubbin, who salutes him with one stubby wing.'),
        N('The arena is a deep stone pit behind the Great Hall, roofed over with iron chains.'),
        N('Hiccup groans, softly, into the jug.'),
      ],
      [
        ask(
          'literacy',
          'words with more than one meaning: train',
          0,
          [
            N(
              'Stoick said somebody must “train the young ones”, and “train” can also mean a vehicle on rails. Which does Stoick mean?',
            ),
          ],
          [
            opt(
              'To teach and practise',
              [
                N(
                  'Yes, and Vikings had no railways! Here, “train” means to teach someone and let them practise.',
                ),
              ],
              true,
            ),
            opt('A vehicle on rails', [
              N(
                'That meaning exists, but there were no trains in Viking times. Stoick means to teach and practise.',
              ),
            ]),
          ],
          'Used the story to choose the right meaning of the multiple-meaning word “train”.',
          'L.3.4',
        ),
      ],
    ),
    sc(
      'a19-03-docks',
      [
        N(
          'All day you carry stores down to the jetty: barrels of salt fish, coils of rope, shields stacked like plates.',
        ),
        N(
          'Four ships are being loaded. Each takes twelve barrels of fish and eight coils of rope.',
        ),
        N(
          'Your Nubbin carries one oar, end first, with tremendous seriousness. It takes most of the afternoon.',
        ),
        N(
          'Hiccup comes down to the jetty at the last minute. His father is checking a rope that does not need checking.',
        ),
        ST('Gobber will teach you. Listen to him.'),
        H('I will.'),
        ST('Good.'),
        N(
          'That seems to be everything. Then Stoick puts one great hand on Hiccup’s head, quickly, as if it might be seen, and goes aboard.',
        ),
        N(
          'The ships go out on the grey tide. Hiccup watches until he cannot tell which sail is which.',
        ),
      ],
      [
        ask(
          'maths',
          'multiply: 4 × 12',
          1,
          [N('Four ships each take 12 barrels of fish. How many barrels is that altogether?')],
          [
            opt(
              '48',
              [N('Yes! 4 × 12 is ten barrels each (40) and two each (8 more), so 40 + 8 = 48.')],
              true,
            ),
            opt('16', [N('That is 4 + 12. We need four groups of twelve: 12 + 12 + 12 + 12.')]),
            opt('44', [N('Close. Try 4 × 10 = 40 and 4 × 2 = 8, then add: 40 + 8.')]),
          ],
          'Multiplied 4 groups of 12 to find 48 barrels.',
          '3.OA.A.3',
        ),
        notice(
          'science',
          'a hollow ship floats because it pushes aside enough water',
          8,
          [
            N(
              'A big wooden ship floats because it is hollow, so it is full of air and light for its size.',
            ),
            N(
              'Water pushes up on it. A ship floats as long as it pushes aside water that weighs as much as the ship does.',
            ),
          ],
          'Learned why a large, hollow ship floats.',
          '3-PS2-1',
        ),
      ],
      [
        {
          id: 'wave',
          label: 'Wave the ships off.',
          then: [N('You wave. Your Nubbin waves its oar, which nearly takes Hiccup’s ear off.')],
        },
        {
          id: 'stand',
          label: 'Stand with Hiccup until the sails are gone.',
          then: [N('You stand with him until there is nothing left to watch but grey water.')],
        },
      ],
    ),
    sc(
      'a19-03-docks-done',
      [
        H('He used to do that when I was little. The hand. I’d forgotten.', 'soft'),
        N('Hiccup is quiet for a moment, still looking at the water.'),
        N(
          'Stoick is not a man for speeches. He shows he cares with things he does, not things he says.',
        ),
        H('He never said “be careful”. He just checked the rope.'),
        N(
          'Your Nubbin leans its whole round weight against Hiccup’s leg, and he rests a hand on its head, without noticing.',
        ),
      ],
      [
        ask(
          'sel',
          'seeing care in what people do, not only in what they say',
          3,
          [
            N(
              'Stoick checked a rope that did not need checking, and gave a quick pat. What might that really be saying?',
            ),
          ],
          [
            opt(
              'That he cares, even though he finds it hard to say',
              [
                N(
                  'Yes. Some people show love through small actions, because the words feel too big.',
                ),
              ],
              true,
            ),
            opt('That he thinks Hiccup is a nuisance', [
              N('Look at the pat. People who find us a nuisance do not touch our heads gently.'),
            ]),
            opt('That the rope was loose', [
              N(
                'The story says it did not need checking. The rope was an excuse to stay a little longer.',
              ),
            ]),
          ],
          'Read a character’s small actions to see how much he cares.',
          SOCIAL,
        ),
      ],
    ),
    sc(
      'a19-03-notebook',
      [
        N(
          'That night at the forge, Hiccup leaves his notebook open on the bench while he fetches more charcoal.',
        ),
        N(
          'Every page is a dragon: wings, teeth, fire. Next to each one, in small neat letters, is how to bring it down.',
        ),
        N('Gronckle: hit it under the jaw; Nadder: stay out of its blind spot; Nightmare: don’t.'),
        N('The last page has nothing drawn on it at all. Just two words at the top: Night Fury.'),
        H('Nobody’s ever seen one. So nobody can draw it. So nobody knows how to bring one down.'),
        H('Which means, if somebody did…', 'think'),
        N(
          'The drawings are very good. The eyes are drawn with a kind of care you do not usually give to something you want to hurt.',
        ),
      ],
      [
        notice(
          'science',
          'a blind spot is a place an animal cannot see',
          2,
          [
            N(
              'A blind spot is a place an animal cannot see. Horses and rabbits have eyes on the sides of their heads.',
            ),
            N(
              'They see almost all the way round, but miss a patch straight ahead and straight behind.',
            ),
            N(
              'Hunters like cats have eyes at the front. They see a smaller area, but judge distance very well.',
            ),
          ],
          'Learned about animals’ blind spots and how eye position affects what they see.',
          '4-LS1-2',
        ),
        ask(
          'sel',
          'whether you can study something carefully and still want to hurt it',
          6,
          [
            N(
              'Hiccup draws each dragon with great care, yet writes how to defeat it. Can you study something closely and still want to hurt it?',
            ),
          ],
          [
            opt('Looking closely often makes you care', [
              N(
                'That’s a fair answer. When we really look at a living thing, it can stop feeling like an enemy.',
              ),
            ]),
            opt('You can study something and still be afraid of it', [
              N('That’s a fair answer. Fear and curiosity can sit side by side.'),
            ]),
            opt('The drawings and the notes say two different things about Hiccup', [
              N(
                'That’s a fair answer. A character can pull in two directions at once, and that is what makes him interesting.',
              ),
            ]),
          ],
          'Thought about whether careful study of something can change how we feel about it.',
          SELF,
        ),
      ],
      [
        {
          id: 'blank',
          label: 'Ask why the page is still empty.',
          then: [
            H('Because I didn’t see it properly. Just the shape. I want to get it right.'),
            N('He says it like an artist, not a hunter. He doesn’t notice that.'),
          ],
        },
        {
          id: 'catch',
          label: 'Ask what he’ll do if he finds it.',
          then: [
            H('Finish it, obviously. Bring it home. Be somebody.'),
            N('He says it fast, the way you say a thing you have practised in the dark.'),
          ],
        },
        {
          id: 'good',
          label: 'Say his drawings are good.',
          then: [
            H('They’re for killing things. They’re not supposed to be good.', 'think'),
            N('But he looks at the Gronckle for a moment, as if he might fix the eye.'),
          ],
        },
      ],
    ),
    sc(
      'a19-03-complete',
      [
        H('The ridge. Where it fell. I’m going out there tomorrow, before training.'),
        H('Are you coming? You don’t have to. It’s probably dead. Or very angry.'),
        N(
          'Your Nubbin is already at the door. It doesn’t know where you are going, but it likes going.',
        ),
        N('Training starts at six. The ridge is forty minutes’ walk away, and forty minutes back.'),
        H('I want twenty minutes there, to look. So: forty, twenty, forty…', 'think'),
      ],
      [
        ask(
          'maths',
          'adding time intervals and counting back from a time',
          4,
          [
            N(
              'Add up the minutes, then count back from six o’clock. When must Hiccup set off to be at the arena at six?',
            ),
          ],
          [
            opt(
              '4:20',
              [
                H(
                  'Yes! 40 + 20 + 40 = 100 minutes, which is 1 hour 40 minutes. Six o’clock take away 1 hour 40 is 4:20.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('5:20', [
              H(
                'That is only 40 minutes before six. We need the whole 100 minutes: 1 hour 40 minutes. That makes 4:20.',
              ),
            ]),
            opt('4:00', [
              H(
                'That is two hours, which is more than we need. 100 minutes is 1 hour 40, so 4:20.',
              ),
            ]),
          ],
          'Added time intervals (40 + 20 + 40 = 100 minutes) and counted back from six o’clock to 4:20.',
          '3.MD.A.1',
        ),
      ],
    ),
  ],
  [
    gloss(
      'arena',
      'A place with a flat floor surrounded by walls, where contests or shows happen.',
      'a19-03-hall-done',
    ),
    gloss('blind spot', 'A place that a person or animal cannot see.', 'a19-03-notebook'),
  ],
);

// ================================================================== A19-4 The Bound Dragon
const Q04: EduQuest = quest(
  'a19-04',
  'The Bound Dragon',
  {
    'a19-04-s1': {
      goal: 'Search the woods behind the ridge for whatever fell.',
      hint: 'Follow Hiccup’s map. Look for broken trees.',
    },
    'a19-04-s2': {
      goal: 'Stay with Hiccup while he faces what he brought down.',
      hint: 'Keep back at the top of the rise and watch.',
    },
    'a19-04-s3': {
      goal: 'Walk back to the village with Hiccup.',
      hint: 'Take the long way round, through the woods, to the arena.',
    },
  },
  [
    sc(
      'a19-04-woods',
      [
        N(
          'The woods behind the ridge are dripping and grey. Hiccup has a map with crosses on, and every cross is crossed out.',
        ),
        H(
          'Nothing. Nothing. Nothing. Some people lose a knife, or a shoe. I lose a whole dragon.',
          'sad',
        ),
        N(
          'He shoves a branch out of the way and it swings back and hits him. Your Nubbin ducks it neatly.',
        ),
        N(
          'Then you all stop. Ahead, a pine is snapped clean in half, and beyond it the earth is torn up in a long dark furrow.',
        ),
        H('That’s… that’s it. That’s where it came down.', 'shock'),
        N(
          'The furrow runs over the crest of a little rise. Something is breathing on the other side of it.',
        ),
      ],
      [
        notice(
          'science',
          'evidence is what we see; an inference is what we work out from it',
          4,
          [
            N('A scientist keeps what she sees separate from what she thinks it means.'),
            N(
              'Hiccup sees a pine snapped and the earth torn up by something big. That is evidence.',
            ),
            N(
              'He works out that something heavy came down here fast. That is an inference: a good guess, built on the evidence.',
            ),
          ],
          'Learned the difference between evidence (what you observe) and an inference (what you work out from it).',
        ),
      ],
    ),
    sc(
      'a19-04-bound',
      [
        N(
          'At the bottom of the rise lies a dragon, black as wet slate, tangled in Hiccup’s ropes from nose to tail.',
        ),
        N('It is long and lean, the size of a big horse, and it is not moving.'),
        H('I did it. I actually… I brought down a Night Fury.', 'shock'),
        N('He takes the knife out of his belt and holds it up in front of him with both hands.'),
        H('Right. I’m a Viking. This is what Vikings do. This is the whole point of me.'),
        N(
          'The dragon opens one eye. It is green and round, and it looks at him, and then it closes, as if it is too tired to watch.',
        ),
        N(
          'Hiccup stands there a long time. The knife goes up a little, and down a little, and nowhere at all.',
        ),
        H('I can’t. I did this. I did this to you.', 'sad'),
        N('He cuts the ropes instead, all of them, fast, before he can change his mind.'),
        N(
          'The dragon is up in a black rush. It pins him against a rock with one foot and roars in his face, then crashes away through the trees.',
        ),
        N(
          'Your Nubbin has bolted behind a stump. It is shaking all over, and its ball has gone dark and small.',
        ),
      ],
      [
        ask(
          'literacy',
          'working out a character’s motive',
          7,
          [N('Hiccup raises the knife and cannot use it. Why do you think he cannot?')],
          [
            opt('The dragon looks tired and frightened, like him', [
              N(
                'That’s a fair answer. Seeing our own feelings in someone else can stop us hurting them.',
              ),
            ]),
            opt('He is not a very good Viking', [
              N(
                'That’s a fair answer. But notice that he is not failing at something he wants: he does not want to do it.',
              ),
            ]),
            opt('He did something he regrets and wants to put it right', [
              N('That’s a fair answer. Cutting the ropes is a way of mending what he did.'),
            ]),
          ],
          'Thought about a character’s motive for not doing what he expected to do.',
          'RL.3.3',
        ),
        notice(
          'sel',
          'fear is catching, and so is calm',
          10,
          [
            N(
              'Fear is catching, and so is calm. A frightened creature settles best near someone gentle who is not in a hurry.',
            ),
            N(
              'There is no wrong way to be frightened. Your Nubbin only needs to know that it is safe.',
            ),
          ],
          'Learned that a frightened creature settles best near someone gentle and calm.',
          RELATE,
        ),
      ],
      [
        {
          id: 'ran',
          label: 'Scoop your Nubbin up and run.',
          set: { 'a19-first': 'ran' },
          then: [
            N(
              'You scoop it up and run. It is so frightened that its claws go through your sleeve.',
            ),
            N(
              'At the edge of the trees you stop, out of breath. You are holding it too tight, and it is holding you too tight back.',
            ),
          ],
        },
        {
          id: 'crouch',
          label: 'Crouch where you are, and let it come to you.',
          set: { 'a19-first': 'crouch' },
          then: [
            N(
              'You crouch down in the wet bracken, and you don’t reach for it. You put one hand flat on the ground, and wait.',
            ),
            N(
              'It takes a long time. Then a small shaking shape comes out from behind the stump and pushes hard against your knee.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a19-04-bound-done',
      [
        N(
          'Hiccup sits up. He looks at the knife in his hand as if somebody else had been holding it.',
        ),
        H('I couldn’t. Why couldn’t I?', 'sad'),
        N(
          'His hands are shaking and his heart is going like a drum. That is his body’s alarm, still ringing after the danger has gone.',
        ),
        N('Slowly, minute by minute, it quiets. He breathes out, long and shaky.'),
        H('I’m all right. I think I’m all right.'),
      ],
      [
        notice(
          'health',
          'a big fright makes the body shake and the heart pound, and it fades',
          2,
          [
            N(
              'After a big fright, the body releases a rush of chemicals that get you ready to run or fight.',
            ),
            N(
              'Shaking and a thumping heart are normal. They fade after a few minutes, once your body knows you are safe.',
            ),
          ],
          'Learned that shaking and a pounding heart after a fright are normal and fade once we feel safe.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a19-04-walk',
      [
        N('You walk back to the village together, the long way round, without a lot to say.'),
        H('Don’t tell Gobber. Or anyone. They’ll want to know why I didn’t, and I don’t…'),
        N('He stops in the path. Your Nubbin stops too, and looks up at him.'),
        H('I don’t know why I didn’t.'),
        N('Down in the village, the arena horn is blowing for the first day of training.'),
        H('Oh, good. Brilliant. My favourite. Let’s go and get set on fire.', 'sad'),
      ],
      [
        ask(
          'sel',
          'good secrets and worrying secrets',
          3,
          [
            N(
              'Hiccup asks you to keep a secret. Which kind of secret should you always tell a trusted adult?',
            ),
          ],
          [
            opt(
              'One that makes you or someone else feel unsafe or worried',
              [
                N(
                  'Yes. A secret that worries you is a secret to share with a grown-up you trust, even if you promised.',
                ),
              ],
              true,
            ),
            opt('A surprise party for a friend', [
              N('A surprise party is a happy secret, and fine to keep. It ends in a smile.'),
            ]),
            opt('What you are giving someone for their birthday', [
              N(
                'That is a happy surprise, and fine to keep. A worrying secret is the kind to tell.',
              ),
            ]),
          ],
          'Learned the difference between a happy surprise and a worrying secret, and to tell a trusted adult about the second kind.',
          DECIDE,
        ),
      ],
      [
        {
          id: 'keep',
          label: 'Promise you won’t tell.',
          then: [
            H('Thanks. Really.'),
            N(
              'It is the first secret anyone on Berk has trusted you with. You carry it carefully all day.',
            ),
          ],
        },
        {
          id: 'why',
          label: 'Ask him why he didn’t.',
          then: [
            H('I don’t know. I’ll tell you when I know. Is that all right?', 'think'),
            N('You say it is. It turns out to be a promise, too.'),
          ],
        },
      ],
    ),
    sc(
      'a19-04-complete',
      [
        N('Hiccup goes ahead to the arena with his shoulders up round his ears.'),
        N(
          'You follow, slower. Your Nubbin walks close beside you, and every few steps it checks that you are still there.',
        ),
        N(
          'Far behind you in the woods, something crashes down through the branches, and goes quiet.',
        ),
        N(
          'Many young animals do the same as your Nubbin. A duckling follows its mother in a line, and a lamb stays near its ewe.',
        ),
        N('Staying close to someone safe is how the young learn what is safe.'),
      ],
      [
        notice(
          'science',
          'young animals stay close to a safe grown-up and learn from them',
          3,
          [
            N(
              'Young animals stay near a parent or a safe grown-up. Close by, they are fed, kept warm and watched over.',
            ),
            N('They also learn from them: what to eat, where to go, and what to be afraid of.'),
          ],
          'Learned that young animals stay close to a safe adult, who feeds them, protects them and teaches them.',
          '3-LS2-1',
        ),
      ],
    ),
  ],
  [
    gloss('furrow', 'A long, narrow trench in the ground.', 'a19-04-woods'),
    gloss('inference', 'A good guess you work out from the evidence you can see.', 'a19-04-woods'),
  ],
);

// ================================================================== A19-5 Dragon Training
const Q05: EduQuest = quest(
  'a19-05',
  'Dragon Training',
  {
    'a19-05-s1': {
      goal: 'Report to the arena for dragon training.',
      hint: 'The arena is the stone pit with the chain roof. Go in by the big gate.',
    },
    'a19-05-s2': {
      goal: 'Hand out the shields before the Gronckle gets loose.',
      hint: 'Run the shields round to each trainee. There are fewer shields than people.',
    },
    'a19-05-s3': {
      goal: 'Watch the round play out, and stay ready to help.',
      hint: 'Keep by the wall near the gate, where Gobber can reach.',
    },
  },
  [
    sc(
      'a19-05-arena',
      [
        N(
          'The arena is a stone pit with a roof of chains, and doors round the edge with things breathing behind them.',
        ),
        GB(
          'Right! Dragon training! Lesson one: everything in here wants to eat you. Lesson two: let it try somebody else.',
        ),
        N(
          'Five young Vikings stand in the middle. A tall girl with a braid and an axe is already in her stance.',
        ),
        A('Astrid. Stay out of my way.'),
        FL(
          'Fishlegs. Hello! Is that a hatchling? What class is it? It isn’t like any of the classes. Does it breathe anything?',
          'happy',
        ),
        SN('Snotlout. Remember the name. You’ll be telling people you met me.'),
        RF('I’m Ruffnut. He’s Tuffnut.'),
        TF('I’m Tuffnut. She’s the other one.'),
        N('Hiccup slips in at the back, late, in a helmet too big for him.'),
        SN('Hiccup’s doing training? Then I’m safe. They always go for the slowest one first.'),
      ],
      [
        ask(
          'maths',
          'divide equal groups: 6 ÷ 2',
          8,
          [
            N(
              'Five young Vikings stand in the middle, and then Hiccup joins them. If Gobber puts them in pairs, how many pairs is that?',
            ),
          ],
          [
            opt(
              '3',
              [GB('Yes! Six trainees make three pairs: 2 + 2 + 2 = 6, so 6 ÷ 2 = 3.')],
              true,
            ),
            opt('2', [
              GB(
                'Two pairs would be four people. There are six, so count in twos: 2, 4, 6. That is three pairs.',
              ),
            ]),
            opt('4', [
              GB(
                'Four pairs would be eight people. Count in twos up to six: 2, 4, 6. Three pairs.',
              ),
            ]),
          ],
          'Divided six trainees into pairs and found three pairs (6 ÷ 2 = 3).',
          '3.OA.A.3',
        ),
      ],
    ),
    sc(
      'a19-05-arena-done',
      [
        N('Your Nubbin goes to the wall and does its fiercest face. A twin pats it on the head.'),
        SN('That’s not fierce. That’s a bun with eyes.'),
        N('Your Nubbin looks at him with enormous dignity.'),
        GB('Snotlout, you’ll find fierce isn’t a thing you announce. Now, shields.'),
        N('You can tell a lot about the young Vikings already, just from how they said hello.'),
      ],
      [
        ask(
          'literacy',
          'character traits from what people say and do',
          4,
          [N('Snotlout said, “Remember the name,” and teased a Nubbin. Which word fits him best?')],
          [
            opt(
              'Boastful',
              [
                N(
                  'Yes. A boastful person talks about how great they are, and Snotlout’s words show that trait.',
                ),
              ],
              true,
            ),
            opt('Shy', [
              N('A shy person hangs back and speaks quietly. Snotlout does the opposite.'),
            ]),
            opt('Gentle', [
              N(
                'A gentle person is kind to small creatures. Snotlout teased your Nubbin, so “gentle” does not fit.',
              ),
            ]),
          ],
          'Used what a character says and does to choose a word for his trait.',
          'RL.3.3',
        ),
      ],
    ),
    sc(
      'a19-05-shields',
      [
        GB('Behind that door is a Gronckle. Before I open it, every one of you wants a shield.'),
        GB('Keeper, hand them out. Quick. I’m opening it in… now, really.'),
        N(
          'The door bangs open. Something round and brown and the size of a cart hurtles out, chewing a rock.',
        ),
        FL(
          'Gronckle! Heavy, slow to turn, eats stone, spits it back hot! Its wings are too small and nobody knows how it flies!',
        ),
        N(
          'You run from Viking to Viking with shields under both arms. Astrid takes hers without looking; Snotlout tries to take two.',
        ),
        RF('That one’s mine.'),
        TF('I touched it first.'),
        RF('You touched it with your face.'),
        N(
          'The twins tug one shield between them until the Gronckle settles it with a bang, and they both sit down.',
        ),
        GB('Ruffnut, Tuffnut, you’re out!'),
        N('There is one shield left in your arms, and two people without one.'),
      ],
      [
        notice(
          'social-studies',
          'Viking round shields were made of wooden planks with an iron boss',
          4,
          [
            N(
              'Real Viking shields were round, about 80 centimetres across, and made of wooden planks fixed together.',
            ),
            N(
              'In the middle was an iron dome called a boss, which protected the hand holding the grip behind it.',
            ),
          ],
          'Learned what real Viking round shields were made of: wooden planks, with an iron boss in the middle.',
          'D2.His.2.3-5',
        ),
        ask(
          'sel',
          'what makes a choice fair',
          10,
          [N('One shield, and two people without one. What makes a choice fair?')],
          [
            opt('Whoever needs it most', [
              N(
                'That’s a fair answer. Need is a good guide, though it can be hard to tell who needs it most.',
              ),
            ]),
            opt('Whoever has not had a turn yet', [
              N(
                'That’s a fair answer. Turns are a simple, even-handed rule that everyone can see.',
              ),
            ]),
            opt('Share it and take turns', [
              N(
                'That’s a fair answer. It treats both people alike, though a shield cannot protect two people at once.',
              ),
            ]),
          ],
          'Thought about what makes a choice fair when there is not enough for everyone.',
          DECIDE,
        ),
      ],
      [
        {
          id: 'hiccup',
          label: 'Give it to Hiccup.',
          then: [
            N('Hiccup takes it. He holds it like a tray and nearly drops it, but he has it.'),
            H('Thanks. If I die, it was a good shield.'),
          ],
        },
        {
          id: 'fishlegs',
          label: 'Give it to Fishlegs.',
          then: [FL('Oh, thank you! Hiccup, you can stand behind me. I’m very wide.', 'happy')],
        },
        {
          id: 'nubbin',
          label: 'Prop it by the wall, for your Nubbin.',
          then: [
            N(
              'Your Nubbin crouches behind the shield and peeps over the rim. It is the only one in the arena with a proper plan.',
            ),
            GB('Ha! The hatchling has more sense than the lot of you.'),
          ],
        },
      ],
    ),
    sc(
      'a19-05-gronckle',
      [
        N(
          'One by one the Gronckle knocks them out of the game: Fishlegs, reciting, and Snotlout, showing off to Astrid.',
        ),
        N(
          'Then it is only Astrid and Hiccup. Astrid is very good, and Hiccup is everywhere at once, in the wrong way.',
        ),
        A('Get out of the way!', 'angry'),
        H('I’m trying! It keeps being where I go!'),
        N(
          'His shield goes rolling across the sand. The Gronckle backs him into the wall and opens its mouth.',
        ),
        N(
          'Gobber gets his hook into its jaw just in time. The shot hits the wall a hand’s width over Hiccup’s head.',
        ),
        GB('Remember that, all of you. Every dragon you meet in here is dangerous. Respect it.'),
        N(
          'Hiccup touches the black scorch mark over his head. He is thinking of a dragon that had him pinned, and didn’t.',
        ),
      ],
      [
        notice(
          'science',
          'heat always moves from something hot to something cooler',
          5,
          [
            N(
              'Heat always moves from something hot to something cooler. The scorch mark is where the hot rock gave its heat to the wall.',
            ),
            N('That is also why you never touch something hot. It passes its heat to you.'),
          ],
          'Learned that heat moves from hot things to cooler things.',
          '4-PS3-2',
        ),
        ask(
          'literacy',
          'making an inference about what a character is thinking',
          7,
          [N('Why does Hiccup think about the dragon that pinned him and did not hurt him?')],
          [
            opt(
              'It shows that not every dragon behaves the way Gobber says',
              [
                N(
                  'Yes. Hiccup is comparing what he was told with what he saw, and they do not match.',
                ),
              ],
              true,
            ),
            opt('He is just tired', [
              N(
                'He may be tired, but the story points to something else: a dragon that did not do what Gobber says every dragon does.',
              ),
            ]),
            opt('He enjoys being pinned', [
              N(
                'Ha, no! Look at the clue, “had him pinned, and didn’t”: he is thinking about the dragon’s surprising kindness.',
              ),
            ]),
          ],
          'Made an inference about why a character is thinking about an earlier event.',
          'RL.3.3',
        ),
      ],
    ),
    sc(
      'a19-05-complete',
      [
        A('You could have got us hurt. Some of us actually want to be good at this.', 'angry'),
        H('Noted. Thank you. Very useful.'),
        N(
          'When Gobber lets them go, Hiccup doesn’t go home. He goes up into the woods, and doesn’t look back to see if you are coming.',
        ),
        N('Your Nubbin looks at you. You both go.'),
        N(
          'Astrid’s anger has a reason: she has worked hard, and Hiccup’s mess cost her the round.',
        ),
      ],
      [
        ask(
          'sel',
          'handling a hard moment calmly',
          1,
          [
            N(
              'Hiccup has just been told off in front of everyone. What is a good way to handle a moment like that?',
            ),
          ],
          [
            opt(
              'Take a breath, then listen for what is fair in it',
              [
                N(
                  'Yes. A breath gives you a moment, and listening lets you keep what is true and let go of the sting.',
                ),
              ],
              true,
            ),
            opt('Snap back at once', [
              N(
                'It feels good for a second, but it usually makes the next minute worse. A breath first is better.',
              ),
            ]),
            opt('Pretend it didn’t sting', [
              N(
                'That is understandable, but a feeling we hide often comes out later. Naming it helps.',
              ),
            ]),
          ],
          'Talked about handling a hard moment calmly: breathe, then listen for what is fair.',
          MANAGE,
        ),
      ],
    ),
  ],
  [
    gloss('boastful', 'Talking too proudly about how good you are.', 'a19-05-arena-done'),
    gloss('boss', 'The iron dome in the middle of a Viking shield.', 'a19-05-shields'),
  ],
);

// ================================================================== A19-6 The Cove
const Q06: EduQuest = quest(
  'a19-06',
  'The Cove',
  {
    'a19-06-s1': {
      goal: 'Follow Hiccup along the dragon’s trail.',
      hint: 'Follow the broken branches past the furrow to a crack in the rocks.',
    },
    'a19-06-s2': {
      goal: 'Sit at the edge of the cove and watch, without crowding it.',
      hint: 'Find a place further back than Hiccup and keep still.',
    },
  },
  [
    sc(
      'a19-06-trail',
      [
        N(
          'Hiccup goes back to the furrow, and past it, following a trail of broken branches and scratched bark.',
        ),
        H('It went this way. It isn’t flying. It’s walking. Why is it walking?', 'think'),
        N('The trail ends at a crack between two rocks. Hiccup squeezes through, and so do you.'),
        N(
          'Your Nubbin walks through without touching either side, and looks back at you both as if you were making a fuss.',
        ),
        N(
          'Beyond is a cove: a deep round hollow in the rock, with a lake in the bottom and steep walls all round.',
        ),
        H('Nothing. Of course. Of course it’s nothing.'),
        N(
          'Something black shoots past the end of the lake, right below you, so fast your eyes can’t follow it.',
        ),
      ],
      [
        ask(
          'literacy',
          'using context to understand a word: cove',
          4,
          [
            N(
              'A cove is a small, sheltered place. Which clue in the line tells you this one is sheltered?',
            ),
          ],
          [
            opt(
              'Steep walls all round it',
              [
                N(
                  'Yes, walls on every side keep out wind and waves. That is what makes a cove sheltered.',
                ),
              ],
              true,
            ),
            opt('A lake in the bottom', [
              N(
                'A lake tells us there is water, but not that it is sheltered. Look for what surrounds it.',
              ),
            ]),
            opt('The sheep on the cliffs', [
              N(
                'The sheep are on the cliffs outside, not in the cove. Look for what surrounds the hollow.',
              ),
            ]),
          ],
          'Used clues in the text to work out why a cove is called sheltered.',
          'L.3.4',
        ),
      ],
    ),
    sc(
      'a19-06-cove',
      [
        N(
          'The dragon is trying to fly out. It runs, beats its wings, and climbs the air for a moment.',
        ),
        N(
          'Then it tips sideways and comes down hard on the stones. It tries again, and again, and comes down every time.',
        ),
        H('Its tail. Look at its tail.'),
        N(
          'There are two fins at the end of its tail, like a fish’s. One is whole; where the other should be, there is a torn stub.',
        ),
        H('The ropes. That was me. It can’t steer.', 'sad'),
        N(
          'Hiccup sits down on a flat rock at the edge, gets out his notebook, and starts to draw it. His hand is quick and very careful.',
        ),
        N(
          'You sit further back, where the dragon won’t feel crowded. Your Nubbin settles on your foot.',
        ),
      ],
      [
        notice(
          'science',
          'tails, fins and rudders steer',
          3,
          [
            N(
              'A fish steers with its fins, a bird with its tail feathers, and a boat with a rudder.',
            ),
            N(
              'Viking ships were steered with a big oar fixed on the right-hand side at the back. That side was the “steerboard”, which is where our word starboard comes from.',
            ),
          ],
          'Learned that fins, tails and rudders steer, and that starboard comes from the Viking steering oar.',
          '4-LS1-1',
        ),
        ask(
          'sel',
          'what to do when your actions have hurt someone',
          4,
          [
            N(
              'Hiccup hurt the dragon, and he feels terrible. What do you think a person should do when something they did has hurt someone?',
            ),
          ],
          [
            opt('Own up to it and try to put it right', [
              N('That’s a fair answer. Hiccup is already doing it by drawing and watching.'),
            ]),
            opt('Make sure it never happens again', [
              N('That’s a fair answer. Learning from a mistake is part of mending it.'),
            ]),
            opt('Give them time and space first', [
              N(
                'That’s a fair answer. Sometimes the hurt one needs room before they trust us again.',
              ),
            ]),
          ],
          'Thought about what to do when your actions have hurt someone.',
          DECIDE,
        ),
      ],
      [
        {
          id: 'dragon',
          label: 'Watch the dragon.',
          then: [
            N(
              'It gives up on the sky and tries the lake instead, snapping at fish. It misses every one.',
            ),
          ],
        },
        {
          id: 'hiccup',
          label: 'Watch Hiccup.',
          then: [
            N(
              'He rubs out one line and draws it again, slower. He is getting the eye exactly right.',
            ),
          ],
        },
        {
          id: 'nubbin',
          label: 'Watch your Nubbin.',
          then: [N('Your Nubbin watches the dragon from behind your ankle, one eye at a time.')],
        },
      ],
    ),
    sc(
      'a19-06-cove-done',
      [
        N('The dragon looks up, straight at the rock. Hiccup drops his charcoal.'),
        N('It rolls over the edge and down into the cove. Nobody moves to get it.'),
        N('The slope pulls it, because gravity pulls everything downhill when nothing stops it.'),
        N(
          'Hiccup holds his breath, and so do you. The dragon lowers its head and goes back to the lake.',
        ),
        N('A drip of water runs down the rock wall, slow as a clock.'),
      ],
      [
        ask(
          'science',
          'gravity pulls things down a slope',
          2,
          [N('Why does the charcoal roll down into the cove?')],
          [
            opt(
              'Gravity pulls it downhill',
              [
                N(
                  'Yes, gravity pulls everything towards the ground. On a slope, nothing stops the charcoal, so it rolls.',
                ),
              ],
              true,
            ),
            opt('The dragon pushed it', [
              N('The dragon did not touch it. A force was acting on it, though: gravity.'),
            ]),
            opt('It wanted to go down', [
              N(
                'A piece of charcoal has no wants. It is pulled by gravity, which acts on everything.',
              ),
            ]),
          ],
          'Learned that gravity pulls things down a slope when nothing stops them.',
          '3-PS2-1',
        ),
      ],
    ),
    sc(
      'a19-06-complete',
      [
        N(
          'It is nearly dark when you come out of the cove. Hiccup has drawn the dragon nine times.',
        ),
        H(
          'Here. Have this one. I got the eyes wrong. They’re not angry eyes, and I keep drawing them angry.',
          'think',
        ),
        N(
          'He tears out a page and gives it to you: a black dragon in charcoal, half a tail fin, and eyes that aren’t angry at all.',
        ),
        N(
          'The eyes are big and round, with the lids wide open and a small bright dot of white in each.',
        ),
        N('Hiccup has stopped looking at a monster and started looking at someone.'),
      ],
      [
        ask(
          'art',
          'how drawn eyes show feeling',
          3,
          [N('Which drawing choices make eyes look gentle rather than angry?')],
          [
            opt(
              'Big, round, wide-open eyes with a bright highlight',
              [
                N(
                  'Yes. Round shapes and a spark of light read as soft and alive, while low, slanted brows and narrow eyes read as angry.',
                ),
              ],
              true,
            ),
            opt('Narrow eyes with low, slanted brows', [
              N(
                'Those are the marks that make a face look angry, which is the mistake Hiccup kept making.',
              ),
            ]),
            opt('Tiny dark dots', [
              N(
                'Dots can look blank or distant. Big round eyes with a highlight look more gentle and alive.',
              ),
            ]),
          ],
          'Looked at how shapes and highlights in a drawing change the feeling in an eye.',
          'CASEL: Social awareness',
        ),
      ],
    ),
  ],
  [
    gloss(
      'cove',
      'A small, sheltered hollow or bay, with walls or land round most of its edge.',
      'a19-06-trail',
    ),
    gloss(
      'gravity',
      'The pull that makes things fall down towards the ground.',
      'a19-06-cove-done',
    ),
  ],
);

// ================================================================== A19-7 The Knife
const Q07: EduQuest = quest(
  'a19-07',
  'The Knife',
  {
    'a19-07-s1': {
      goal: 'Carry a basket of fish to the cove.',
      hint: 'The basket is by the forge door. It’s heavy, and it leaks.',
    },
    'a19-07-s2': {
      goal: 'Wait at the cove while the dragon makes up its mind.',
      hint: 'Stay low by the rocks, and don’t move towards it.',
    },
    'a19-07-s3': {
      goal: 'See what the dragon does when the fish is gone.',
      hint: 'Keep still and keep watching Hiccup.',
    },
  },
  [
    sc(
      'a19-07-basket',
      [
        N(
          'Before dawn, Hiccup is at the forge filling a basket with fish: cod, salmon, a smoked eel, and something nobody can name.',
        ),
        H('It can’t catch anything down there. It must be starving. So: breakfast.'),
        GB('Where are you going with half my fish?', 'think'),
        H('Training! Extra training. Studying dragons. Their… eating.'),
        GB('Hm. Well. Bring the basket back.'),
        N(
          'The basket is heavy and it leaks. You carry it between you up through the wet woods, and your Nubbin follows the drips.',
        ),
        N('At the cove, Hiccup takes a breath, and climbs down into it.'),
      ],
      [
        notice(
          'social-studies',
          'Vikings preserved fish by drying, salting and smoking it',
          0,
          [
            N(
              'Before fridges, people kept fish by drying, salting or smoking it, so it would last through the winter.',
            ),
            N(
              'Norse fishers dried cod in the cold wind until it was hard as wood. That dried fish is called stockfish, and it kept for a very long time.',
            ),
          ],
          'Learned that Norse people preserved fish by drying, salting and smoking it, including dried cod called stockfish.',
          'D2.His.2.3-5',
        ),
      ],
    ),
    sc(
      'a19-07-knife',
      [
        N('Hiccup tips the basket out onto the stones. The smoked eel slides out on top.'),
        N(
          'The dragon comes out of the shadows low and fast, sees the eel, and jerks back hissing, as if it had been stung.',
        ),
        H('No eel. Right. Noted.'),
        N(
          'Hiccup throws the eel into the lake. The dragon comes a step closer, then stops, looking at the knife on his belt.',
        ),
        H('Oh. Oh, that.', 'think'),
        N(
          'Slowly, with two fingers, he lifts the knife out of his belt. The dragon’s eyes follow it all the way.',
        ),
        N('He throws it into the lake. It goes in with a small plop, and that is all.'),
        N(
          'The dragon sits back on its haunches, and the flaps on its head come up like ears. Then it eats.',
        ),
      ],
      [
        notice(
          'science',
          'many animals read slow, low movements as safe and fast movements as a threat',
          6,
          [
            N(
              'Many animals judge whether a person is safe by how they move. Slow, low, quiet movements say: no threat here.',
            ),
            N(
              'Sudden movements and loud noises can look like danger. Keep your distance from wild animals, and ask a grown-up first.',
            ),
          ],
          'Learned that many animals read slow, calm movements as safe, and to keep a distance from wild animals.',
          '4-LS1-2',
        ),
        ask(
          'sel',
          'whether putting down a weapon is brave or risky',
          7,
          [
            N(
              'Hiccup puts his knife down so the dragon can see he means no harm. Is that brave, or risky?',
            ),
          ],
          [
            opt('Brave, because he gave up his only protection', [
              N(
                'That’s a fair answer. Trust sometimes means going first, with nothing in your hands.',
              ),
            ]),
            opt('Risky, because the dragon might attack', [
              N('That’s a fair answer. It was a real risk, and Hiccup took it knowing that.'),
            ]),
            opt('Both at once', [
              N('That’s a fair answer. Courage often feels exactly like taking a risk.'),
            ]),
          ],
          'Thought about whether putting down a weapon to show trust is brave, risky, or both.',
          DECIDE,
        ),
      ],
      [
        {
          id: 'hands',
          label: 'Put your own hands where it can see them.',
          then: [
            N(
              'You hold your hands open on your knees. The dragon glances at them, once, and goes back to its fish.',
            ),
          ],
        },
        {
          id: 'away',
          label: 'Look away, at the water.',
          then: [
            N(
              'You look at the water. You hear it eating and nothing else, and that is better than watching.',
            ),
          ],
        },
        {
          id: 'nubbin',
          label: 'Keep a hand on your Nubbin.',
          then: [N('Your hand rests on your Nubbin’s back. It is warm, and calmer than you are.')],
        },
      ],
    ),
    sc(
      'a19-07-name',
      [
        N(
          'When the fish is gone, the dragon looks at Hiccup, makes a noise in its throat, and coughs half a fish up onto his knee.',
        ),
        H('Thank you. That’s… very generous.', 'shock'),
        N('The dragon waits, looking at him. It clearly expects him to eat it.'),
        H('You want me to… Right. Yes. Fine.', 'sad'),
        N('He eats it, raw, and gags, and swallows. Your Nubbin watches with enormous respect.'),
        N(
          'The dragon pulls its lips back in a sort of smile. There isn’t a tooth in it, only pink gums.',
        ),
        H('No teeth? Where did they go? There were teeth. In the woods. Lots of teeth.', 'think'),
        N(
          'A row of white teeth slides out, and the smile becomes rather a lot of smile. Then they fold neatly away again.',
        ),
        H('They fold away. Toothless. I’m going to call you Toothless.', 'happy'),
      ],
      [
        ask(
          'literacy',
          'the suffix -less means without',
          8,
          [
            N(
              '“Toothless” is “tooth” plus “-less”, which means “without”. Which word means “without fear”?',
            ),
          ],
          [
            opt(
              'Fearless',
              [
                N(
                  'Yes: fear plus -less means without fear. Hopeless, careless and homeless all use the same ending.',
                ),
              ],
              true,
            ),
            opt('Fearful', [
              N(
                'Fearful has the ending -ful, which means “full of”. It means full of fear, the opposite of what we want.',
              ),
            ]),
            opt('Fearsome', [
              N('Fearsome means causing fear in others. The word without fear uses -less.'),
            ]),
          ],
          'Used the suffix -less (without) to work out that “fearless” means without fear.',
          'L.3.4',
        ),
      ],
      [
        {
          id: 'laugh',
          label: 'Laugh.',
          then: [
            N(
              'You laugh, and Hiccup laughs, and Toothless looks from one of you to the other, deciding whether to be offended.',
            ),
          ],
        },
        {
          id: 'straight',
          label: 'Keep a straight face.',
          then: [H('You’re very polite. He did just sick on me.')],
        },
        {
          id: 'suits',
          label: 'Say the name suits him.',
          then: [
            H(
              'It does, doesn’t it? A Night Fury called Toothless. Nobody on Berk would believe it.',
              'happy',
            ),
          ],
        },
      ],
    ),
    sc(
      'a19-07-complete',
      [
        N(
          'Toothless lets you all stay till noon. He doesn’t let anyone touch him, but he doesn’t leave.',
        ),
        H('Gobber’s going to want his basket back.'),
        H('Keep it. I’ll tell him a dragon ate it. Which is almost true.'),
        N(
          'You carry the empty basket home. It smells of cod for the rest of its life, and so, for a day, do you.',
        ),
        N(
          'Before it went empty, the basket held 12 cod and 8 salmon. Toothless ate half the cod and 3 of the salmon.',
        ),
      ],
      [
        ask(
          'maths',
          'a two-step word problem: half of 12, then add 3',
          4,
          [
            N(
              'Toothless ate half of the 12 cod, and 3 of the 8 salmon. How many fish did he eat altogether?',
            ),
          ],
          [
            opt(
              '9',
              [
                N(
                  'Yes! Half of 12 is 6, and 6 + 3 = 9: two steps, first the cod and then the salmon.',
                ),
              ],
              true,
            ),
            opt('15', [
              N(
                'You may have added 12 and 3. But he ate only half the cod: 12 ÷ 2 = 6, then 6 + 3 = 9.',
              ),
            ]),
            opt('11', [N('Close, but half of 12 is 6, not 8. So 6 + 3 = 9.')]),
          ],
          'Solved a two-step word problem: half of 12 is 6, and 6 + 3 = 9.',
          '3.OA.D.8',
        ),
      ],
    ),
  ],
  [
    gloss(
      'stockfish',
      'Cod that has been dried in the cold wind until it is hard, so it keeps for a very long time.',
      'a19-07-basket',
    ),
    gloss(
      'suffix',
      'A small word-part added to the end of a word to change its meaning.',
      'a19-07-name',
    ),
  ],
);

// ================================================================== A19-8 The Hand
const Q08: EduQuest = quest(
  'a19-08',
  'The Hand',
  {
    'a19-08-s1': {
      goal: 'Watch what Toothless does with the stick.',
      hint: 'Stay at the edge of the sand while Toothless draws.',
    },
    'a19-08-s2': {
      goal: 'Sit very still while Hiccup and Toothless meet.',
      hint: 'Don’t move. Whatever happens next isn’t yours to hurry.',
    },
    'a19-08-s3': {
      goal: 'Let Toothless decide about your Nubbin.',
      hint: 'Stay where you are and let Toothless come or not, as he likes.',
    },
  },
  [
    sc(
      'a19-08-lines',
      [
        N(
          'By the fourth day, Toothless lets Hiccup sit nearer. By the fifth, he is curious about the charcoal.',
        ),
        N(
          'Hiccup draws Toothless in the sand with a stick. Toothless watches, and then picks up a whole branch in his mouth.',
        ),
        N('He drags it round and round the cove in great looping lines, all over the sand.'),
        H('Is that… is that me? It’s very… bold.', 'think'),
        N(
          'When he has finished, Hiccup is standing in the middle of a huge scribble, with no way out that doesn’t cross a line.',
        ),
        N('He steps on one, and Toothless growls. He lifts his foot, and Toothless purrs.'),
        N(
          'So Hiccup steps carefully over each line, one at a time, all the way out, like a game whose rules nobody has explained.',
        ),
      ],
      [
        ask(
          'social-studies',
          'learning unwritten rules by watching and trying gently',
          6,
          [N('Nobody told Hiccup the rules of the game. How did he learn them?')],
          [
            opt(
              'By watching how Toothless reacted, and trying gently',
              [
                N(
                  'Yes. When nobody tells us the rules, we watch for signals and test gently, ready to back off.',
                ),
              ],
              true,
            ),
            opt('By guessing at random', [
              N(
                'He did not guess at random. He noticed the growl and the purr, and let them guide each step.',
              ),
            ]),
            opt('By ignoring Toothless', [
              N('He did the opposite. Every step depended on watching Toothless closely.'),
            ]),
          ],
          'Talked about learning unwritten rules by watching for signals and trying gently.',
          'D2.Civ.8.3-5',
        ),
      ],
      [
        {
          id: 'step',
          label: 'Step through the lines after him.',
          then: [
            N(
              'You go carefully over every line. Toothless follows you with his eyes and says nothing, which seems to be a yes.',
            ),
          ],
        },
        {
          id: 'stay',
          label: 'Stay outside the lines.',
          then: [
            N(
              'You stay where you are, outside the drawing. Toothless notices, and seems to think better of you for it.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a19-08-hand',
      [
        N(
          'Hiccup comes out of the last line and finds Toothless right in front of him, closer than he has ever been.',
        ),
        N('Hiccup lifts his hand, slowly. Toothless pulls back his lips.'),
        N('Hiccup stops. He doesn’t pull his hand back, and he doesn’t push it forward either.'),
        N(
          'Then he closes his eyes, and turns his face away, and holds his hand out in the air between them, open.',
        ),
        N('Nobody moves. A drip falls from the rock wall into the lake.'),
        N('Then Toothless leans in, and pushes his nose into Hiccup’s palm.'),
        H('…Oh.', 'soft'),
      ],
      [
        notice(
          'science',
          'many animals read a direct stare as a challenge',
          3,
          [
            N(
              'Many animals take a direct stare as a challenge, a way of saying “I am watching you, and I am ready”.',
            ),
            N(
              'Turning the face away says the opposite: “I’m no threat.” It is a kind of animal manners, and it helps both sides stay calm.',
            ),
          ],
          'Learned that many animals read a direct stare as a challenge, and that looking away shows calm.',
          '4-LS1-2',
        ),
        ask(
          'sel',
          'whether waiting is the same as doing nothing',
          6,
          [
            N(
              'Hiccup does nothing but hold out his hand and wait. Is waiting the same as doing nothing?',
            ),
          ],
          [
            opt('No, waiting can be a way of showing trust', [
              N('That’s a fair answer. Hiccup’s waiting says: you choose, I won’t force you.'),
            ]),
            opt('Yes, but sometimes doing nothing is exactly right', [
              N('That’s a fair answer. Holding back can be the hardest and best thing to do.'),
            ]),
            opt('It depends what you are waiting for', [
              N(
                'That’s a fair answer. Waiting for someone to feel safe is very different from waiting for nothing.',
              ),
            ]),
          ],
          'Thought about whether waiting is the same as doing nothing.',
          MANAGE,
        ),
      ],
    ),
    sc(
      'a19-08-near',
      [
        N(
          'Toothless takes his nose out of Hiccup’s hand and looks past him, at you, and at your Nubbin.',
        ),
        H('He’s looking at you two. Stay still. Let him decide.'),
        N(
          'Toothless pads across the sand. Your Nubbin doesn’t hide: in the woods you crouched, and it came back to you.',
        ),
        N(
          'Toothless lowers his great head until his nose is level with your Nubbin’s, and sniffs it, long and thorough.',
        ),
        N('Your Nubbin sniffs back. Then, very carefully, it puts its forehead against his nose.'),
        H('Look at that. He likes it. He doesn’t like anybody.', 'happy'),
      ],
      [
        ask(
          'science',
          'smell tells animals a lot, and many have a far better sense of smell than ours',
          3,
          [N('Why does Toothless sniff your Nubbin for so long?')],
          [
            opt(
              'Smell tells him a great deal about who it is',
              [
                N(
                  'Yes. Many animals learn who you are and whether you are calm just by smell, and a dog’s nose is far keener than ours.',
                ),
              ],
              true,
            ),
            opt('He is getting sleepy', [
              N(
                'Sleepy animals tend to yawn and settle. This is a careful, curious sniff: smell is how he is learning about your Nubbin.',
              ),
            ]),
            opt('He is counting its whiskers', [
              N('Ha, no! He is using smell, the sense many animals use to say hello.'),
            ]),
          ],
          'Learned that many animals use smell to find out who someone is, and that many have a better sense of smell than people.',
          '4-LS1-2',
        ),
      ],
    ),
    sc(
      'a19-08-complete',
      [
        H('Did you see that? He’s nothing like the book says. Nothing.'),
        N(
          'Hiccup sits down hard on the sand, as if his legs have given up for a bit. He is grinning at nothing.',
        ),
        H(
          'The book’s got one rule for every dragon: run, or finish it. Every page. Every single one.',
        ),
        H('Nobody ever sat still long enough to find out.', 'soft'),
      ],
      [
        ask(
          'literacy',
          'finding the theme of a story',
          3,
          [N('A theme is a story’s big idea. Which is the best theme for this quest?')],
          [
            opt(
              'Patience and careful looking can show you the truth about someone',
              [
                N(
                  'Yes. A theme is the lesson underneath the events, and this one runs through everything Hiccup does.',
                ),
              ],
              true,
            ),
            opt('Dragons are always dangerous', [
              N(
                'That is what the book says. The story shows it is wrong, so it can’t be the theme.',
              ),
            ]),
            opt('Fishing is hard work', [
              N('Fishing appears in the story, but it isn’t the big idea underneath it.'),
            ]),
          ],
          'Identified the theme of a story: patience and careful looking reveal the truth about someone.',
          'RL.4.2',
        ),
      ],
    ),
  ],
  [gloss('theme', 'The big idea underneath a story.', 'a19-08-complete')],
);

// ================================================================== A19-9 The Tail Fin
const Q09: EduQuest = quest(
  'a19-09',
  'The Tail Fin',
  {
    'a19-09-s1': {
      goal: 'Hold the lamp while Hiccup works at the forge.',
      hint: 'Keep the lamp steady over the bench, and quiet.',
    },
    'a19-09-s2': {
      goal: 'Watch the first flights, and be ready to fish them out.',
      hint: 'Stand at the edge of the lake in the cove.',
    },
    'a19-09-s3': {
      goal: 'Help Hiccup make a pedal, so he can steer with his foot.',
      hint: 'Hammer the stirrup flat at the forge anvil.',
    },
  },
  [
    sc(
      'a19-09-forge',
      [
        N(
          'That night Gobber snores upstairs like a slow saw. Hiccup lights one lamp and gives it to you to hold.',
        ),
        H('Hold it there. Lower. Bit left. Perfect. Don’t move. Don’t breathe on it.'),
        N(
          'On the bench he lays out leather, rods and a sheet of his own drawings: a tail fin made to open and close like a fan.',
        ),
        N(
          'He cuts and stitches and rivets for hours. Then he starts on a second thing, a saddle, with straps for a long body.',
        ),
        H(
          'He can’t steer with one fin. So somebody has to steer the other one. That somebody is, unfortunately, me.',
        ),
        N(
          'A board creaks overhead. The snoring stops, and Gobber’s voice comes down the stairs, thick with sleep.',
        ),
        GB('Who’s there? What are you making at this hour?', 'think'),
        N('Hiccup looks at you. You look at the saddle, which is about the size of a large dog.'),
      ],
      [
        ask(
          'science',
          'a lower light source makes longer shadows',
          1,
          [
            N(
              'Hiccup says, “Lower.” When the lamp moves lower, what happens to the tools’ shadows on the bench?',
            ),
          ],
          [
            opt(
              'They get longer',
              [
                H(
                  'Yes! A low light throws long shadows, which is why shadows stretch out at sunset.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('They get shorter', [
              H('The other way round. A high light makes short shadows. A low one stretches them.'),
            ]),
            opt('They disappear', [
              H('They never disappear while there is light. A low lamp just stretches them out.'),
            ]),
          ],
          'Learned that a lower light source makes longer shadows.',
          '5-ESS1-2',
        ),
        ask(
          'sel',
          'when keeping something hidden is kind or harmful',
          7,
          [
            N(
              'Hiccup wants to hide his work to keep Toothless safe. Is it ever kind to hide something, and when does hiding start to hurt?',
            ),
          ],
          [
            opt('When it protects someone from harm', [
              N(
                'That’s a fair answer. Protecting someone can be a good reason, as long as no one else is put in danger.',
              ),
            ]),
            opt('When you tell someone you trust', [
              N(
                'That’s a fair answer. A secret shared with a trusted person feels lighter and safer.',
              ),
            ]),
            opt('When it stops being a surprise and becomes a worry', [
              N('That’s a fair answer. A secret that makes us anxious is one to share.'),
            ]),
          ],
          'Thought about when keeping something hidden is kind and when it starts to hurt.',
          DECIDE,
        ),
      ],
      [
        {
          id: 'nubbin',
          label: '“It’s a saddle. For my Nubbin.”',
          then: [
            GB('A saddle. For the hatchling. Ha! Mad. Southern folk are all mad.'),
            N(
              'He goes back to bed. Hiccup mouths thank you, then looks at the saddle, and then, thoughtfully, at your Nubbin.',
            ),
          ],
        },
        {
          id: 'shield',
          label: '“It’s a new kind of shield.”',
          then: [
            GB('Looks like a saddle.'),
            H('It’s a saddle-shaped shield. For sitting on. In battle.'),
            GB('Bed. Both of you.'),
          ],
        },
        {
          id: 'lamp',
          label: 'Blow out the lamp.',
          then: [
            N(
              'You blow out the lamp. In the dark, Gobber grumbles about rats with hammers and goes back to bed.',
            ),
            H('Rats with hammers. I’ll take it.'),
          ],
        },
      ],
    ),
    sc(
      'a19-09-strap',
      [
        N(
          'At the cove, Toothless sniffs the new fin, then the saddle, then Hiccup, as if Hiccup is the strangest part.',
        ),
        N(
          'It takes all morning to strap it on. Toothless rolls over twice, and sits on the saddle once, on purpose.',
        ),
        H('Right. When I pull this, the fin opens, and you can turn. I hope. In theory.'),
        N(
          'Hiccup climbs on, and Toothless spreads his wings. You hold your breath, and your Nubbin holds its breath too.',
        ),
        N(
          'Toothless jumps, flaps once, and they rise, and turn, and fly in a perfect curve straight into the lake.',
        ),
        N(
          'They come up spitting. Then they try again, and go into the lake again, slightly to the left.',
        ),
      ],
      [
        ask(
          'maths',
          'add three numbers: 4 + 6 + 9',
          5,
          [
            N(
              'On their next three tries, Toothless and Hiccup stay in the air for 4 seconds, 6 seconds and 9 seconds. How long is that altogether?',
            ),
          ],
          [
            opt(
              '19 seconds',
              [H('Yes! 4 + 6 = 10, and 10 + 9 = 19. Each try is longer than the last.', 'happy')],
              true,
            ),
            opt('18 seconds', [H('Nearly. Add again: 4 + 6 = 10, and 10 + 9 is 19, not 18.')]),
            opt('20 seconds', [
              H('Close. 4 + 6 = 10, and 10 + 9 is 19. We are one second short of twenty.'),
            ]),
          ],
          'Added 4 + 6 + 9 to make 19 seconds.',
          '3.OA.D.8',
        ),
      ],
      [
        {
          id: 'cheer',
          label: 'Cheer anyway.',
          then: [H('Thank you! That was nearly flying!', 'happy')],
        },
        {
          id: 'wade',
          label: 'Wade in and help fish him out.',
          then: [
            N(
              'You wade in to your knees and haul on the saddle strap. Toothless climbs out by himself and shakes himself all over you.',
            ),
          ],
        },
        {
          id: 'hold',
          label: 'Keep your Nubbin out of the water.',
          then: [
            N(
              'Your Nubbin very much wants to go in after them. You keep a gentle hand in front of it until it gives up.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a19-09-strap-done',
      [
        H(
          'He’s turning before I tell him. I need to know when he wants to turn, not just when I do.',
          'think',
        ),
        N(
          'Hiccup watches Toothless’s ears, tail and wings, trying to read what each one is saying.',
        ),
        N(
          'A friend who cannot talk still tells you things all day: a flick of the tail, an ear going flat, a shift of weight.',
        ),
        N('Hiccup is learning a language with no words in it.'),
        N('Your Nubbin, who speaks it fluently, sits on the saddle and says nothing.'),
      ],
      [
        ask(
          'sel',
          'reading a friend’s feelings without words',
          3,
          [N('How can we learn what a friend feels when they cannot say it in words?')],
          [
            opt(
              'Watch their face, body and sounds carefully',
              [
                N(
                  'Yes, feelings show in faces, bodies and voices. Paying close attention is how we read them.',
                ),
              ],
              true,
            ),
            opt('Wait until they tell us in words', [
              N(
                'Some friends, like Toothless, never will. Watching closely lets us understand them anyway.',
              ),
            ]),
            opt('Decide what they must feel', [
              N('Guessing is risky. Watching and checking is kinder and more accurate.'),
            ]),
          ],
          'Talked about reading a friend’s feelings from their face, body and sounds.',
          SOCIAL,
        ),
      ],
    ),
    sc(
      'a19-09-pedal',
      [
        N(
          'Back at the forge, Hiccup draws a pedal: a stirrup on a rod, so his foot can open the fin while his hands hold on.',
        ),
        H('Hammer that flat. No, flatter. Like the edge of a shovel.'),
        N(
          'You hammer it flat. It takes three goes and a burnt thumb, and your Nubbin brings you a bucket of water without being asked.',
        ),
        H(
          'Now every position means something. Down one: left. Down two: hard left. I’ll write them on a card.',
        ),
        N(
          'He writes them on a scrap of leather and ties it to the saddle, where he can read it with his eyes streaming.',
        ),
        N(
          'At the cove they go up again. Toothless turns, and Hiccup turns with him, and this time they miss the lake.',
        ),
        N(
          'They go up past the rim, out over the trees and the sea, and you lose them in the light.',
        ),
      ],
      [
        notice(
          'science',
          'a pedal is a lever that carries a push to where the work is done',
          0,
          [
            N(
              'A pedal is a kind of lever. You press down with your foot at one end, and a rod carries the movement along.',
            ),
            N(
              'At the far end, the fin opens. A machine can pass a push from where you are to where the work needs doing.',
            ),
          ],
          'Learned that a pedal is a lever that passes a movement from the foot along a rod to the part that does the work.',
          '3-PS2-1',
        ),
        ask(
          'literacy',
          'multiple-meaning words: hard',
          4,
          [N('Hiccup’s card says “Down two: hard left.” What does “hard” mean here?')],
          [
            opt(
              'Turn sharply, with force',
              [
                N(
                  'Yes. “Hard” has many meanings, and on a steering card it means sharply, with force.',
                ),
              ],
              true,
            ),
            opt('Difficult', [
              N('“Hard” can mean difficult, but on a steering card it means a sharp turn.'),
            ]),
            opt('Solid, like stone', [
              N('That is another meaning of “hard”, but on a steering card it means a sharp turn.'),
            ]),
          ],
          'Worked out from context that “hard left” means a sharp turn, not a difficult or solid one.',
          'L.3.4',
        ),
      ],
    ),
    sc(
      'a19-09-pedal-done',
      [
        N('They come back an hour later, wet through and wind-burnt, wearing the same grin.'),
        N(
          'Hiccup’s hands are red and his hair is flat. Toothless shakes himself like a dog and soaks everything within three metres.',
        ),
        H('Cold. Brilliant. Cold. Brilliant.', 'happy'),
        N(
          'Gobber has left a dry cloak and a bowl of hot soup by the forge, and says nothing about where they have been.',
        ),
        N('Hiccup wraps up and eats. The shaking stops.'),
      ],
      [
        notice(
          'health',
          'wet clothes cool us faster than dry ones',
          3,
          [
            N(
              'Wet clothes make you colder than dry ones, because water carries heat away from your body much faster than air does.',
            ),
            N(
              'That is why wet and windy is a risky mix, and why dry clothes and something warm to eat help so much.',
            ),
          ],
          'Learned that wet clothes cool us faster than dry ones, and that dry clothes and warm food help.',
          '4-PS3-2',
        ),
      ],
    ),
    sc(
      'a19-09-complete',
      [
        H(
          'We flew. Him and me. Neither of us can do it on our own. That’s the whole design.',
          'happy',
        ),
        N(
          'Toothless shoves his head under Hiccup’s arm until Hiccup falls over. Then he lies on him.',
        ),
        H('Help. Please. He is very heavy and very pleased with himself.'),
        N('You don’t help, and neither does your Nubbin. It is too good to interrupt.'),
        N(
          'A dragon with half a tail cannot steer, and a boy with no wings cannot fly. Together, they can do both.',
        ),
      ],
      [
        ask(
          'sel',
          'teamwork where each partner does what the other cannot',
          4,
          [
            N(
              'Hiccup and Toothless each have something the other lacks. What is that kind of partnership called?',
            ),
          ],
          [
            opt(
              'Teamwork, where each does what the other cannot',
              [
                N(
                  'Yes. The best teams are not two of the same: each partner brings what the other is missing.',
                ),
              ],
              true,
            ),
            opt('Showing off', [
              N(
                'They are pleased, but showing off is about being looked at. This is about needing each other.',
              ),
            ]),
            opt('A rivalry', [
              N(
                'A rivalry is a contest. Toothless and Hiccup are working together, not competing.',
              ),
            ]),
          ],
          'Talked about teamwork in which each partner makes up for what the other cannot do.',
          RELATE,
        ),
      ],
    ),
  ],
  [
    gloss('stirrup', 'A loop that holds a rider’s foot.', 'a19-09-pedal'),
    gloss(
      'rivet',
      'A short metal pin hammered through two pieces to hold them together.',
      'a19-09-forge',
    ),
  ],
);

// ================================================================== A19-10 Top of the Class
const Q10: EduQuest = quest(
  'a19-10',
  'Top of the Class',
  {
    'a19-10-s1': {
      goal: 'Watch Hiccup in the arena.',
      hint: 'Take your place by the gate with Gobber.',
    },
    'a19-10-s2': {
      goal: 'Keep Hiccup’s secret while the whole village starts to watch.',
      hint: 'Astrid is waiting behind the arena door. Talk to her.',
    },
    'a19-10-s3': {
      goal: 'Go down to the jetty to meet the ships.',
      hint: 'The fleet is coming in on the evening tide.',
    },
  },
  [
    sc(
      'a19-10-grass',
      [
        N('Next morning in the arena, the Gronckle comes at Hiccup like a cannonball.'),
        N(
          'Hiccup doesn’t run. He opens his hand, and in it is a fistful of a pale grass that grows by the cove.',
        ),
        N(
          'The Gronckle stops dead, sniffs it, and rolls over on its back in the sand like a puppy.',
        ),
        FL('What did you do? That’s not in the book! Nothing is in the book!', 'shock'),
        H('I… read ahead?'),
        N(
          'Astrid’s axe is still up. She is not looking at the Gronckle; she is looking at Hiccup.',
        ),
        SN('Lucky. That was lucky.'),
      ],
      [
        notice(
          'science',
          'some real plants change how animals behave, such as catnip and cats',
          2,
          [
            N(
              'Some real plants do change how animals act. Catnip makes many cats roll, rub and purr, and some go completely silly.',
            ),
            N(
              'Hiccup has found a plant the Gronckle loves. People who work with animals learn which plants animals like, and which are harmful.',
            ),
          ],
          'Learned that some plants, such as catnip, change how animals behave, and that animal keepers learn which plants are safe.',
          '4-LS1-2',
        ),
      ],
    ),
    sc(
      'a19-10-grass-done',
      [
        GB('Well! Look at that! Hiccup! Who’d have thought it?', 'happy'),
        N('Gobber claps, and his hook goes clang against his hammer.'),
        N('Hiccup blinks at the cheering. His mouth is open, but nothing is coming out.'),
        H('I read ahead.', 'think'),
        N(
          '“Read ahead” is a joke: at school it means looking at the later pages before the rest of the class.',
        ),
      ],
      [
        ask(
          'literacy',
          'what a figurative phrase means in context: read ahead',
          3,
          [N('Hiccup says he “read ahead”, but he has not read a book. What does he really mean?')],
          [
            opt(
              'He has found things out in the cove before anyone else',
              [
                N(
                  'Yes. He uses a school phrase as a joke to hide that he has learned something secret, earlier than everybody.',
                ),
              ],
              true,
            ),
            opt('He really did read a whole book in the night', [
              N('There is no book. The phrase is a joke about getting ahead of the others.'),
            ]),
            opt('He read the last page first', [
              N(
                'That is one way to read ahead in a book, but Hiccup is using it as a joke about the cove.',
              ),
            ]),
          ],
          'Worked out the meaning of a figurative phrase from the story.',
          'L.3.4',
        ),
      ],
    ),
    sc(
      'a19-10-eel',
      [
        N(
          'Day after day it goes the same way. Every dragon they let out, Hiccup puts down without hurting it at all.',
        ),
        N(
          'A Nadder rears up over Snotlout, all spikes. Hiccup holds up a smoked eel, and it shies away like a horse from a snake.',
        ),
        N(
          'A Gronckle corners Fishlegs. Hiccup scratches it under the chin, in one particular spot, and it drops flat and blissful.',
        ),
        N(
          'The village starts coming to watch, and cheering. They have never cheered for Hiccup before, and he doesn’t know where to look.',
        ),
        A('Where does he go, every afternoon?', 'angry'),
        N(
          'Astrid has caught you by the elbow behind the arena door. Her grip is strong, and she isn’t letting go.',
        ),
      ],
      [
        notice(
          'science',
          'many animals have favourite spots where gentle scratching calms them',
          2,
          [
            N(
              'Many animals, like cats, dogs and horses, have a favourite spot where scratching calms them down.',
            ),
            N(
              'It works best when the animal has chosen to come close. Animal keepers find the spots by watching for signs of enjoyment.',
            ),
          ],
          'Learned that many animals have favourite spots where gentle scratching calms them, and that keepers find them by watching.',
          '4-LS1-2',
        ),
        ask(
          'sel',
          'how a fib affects trust',
          5,
          [
            N(
              'You could tell Astrid that Hiccup goes fishing. What would a fib like that do to her trust in you?',
            ),
          ],
          [
            opt(
              'It wears the trust thin, if she works out the truth',
              [
                N(
                  'Yes. Trust is built slowly and thinned quickly, and a fib gives Astrid, who already suspects, a reason to doubt you.',
                ),
              ],
              true,
            ),
            opt('It makes the trust stronger', [
              N(
                'A fib may protect a secret for a while, but it does not build trust. Honest answers do that.',
              ),
            ]),
            opt('Nothing at all', [
              N(
                'It does something. Even a small fib teaches the other person that your words may not be reliable.',
              ),
            ]),
          ],
          'Talked about how even a small fib thins trust.',
          DECIDE,
        ),
      ],
      [
        {
          id: 'lie',
          label: 'Tell her he goes fishing.',
          then: [
            A('Fishing. Right. He can’t lift a rod.', 'think'),
            N('She lets go. She doesn’t believe you, and she lets you see it.'),
          ],
        },
        {
          id: 'ask',
          label: 'Tell her to ask him herself.',
          then: [A('I did. He said he goes for walks. Nobody goes for walks on Berk.', 'angry')],
        },
        {
          id: 'shrug',
          label: 'Shrug.',
          then: [
            A('Fine. I’ll find out.'),
            N('It isn’t a threat, exactly. It is more of a schedule.'),
          ],
        },
      ],
    ),
    sc(
      'a19-10-fleet',
      [
        N(
          'The ships come home on a grey afternoon. Fewer than went out, and every one of them scorched.',
        ),
        N(
          'The ships sailed north for twelve days, about sixty kilometres a day, and found nothing but cold water.',
        ),
        N('Stoick comes up the jetty last. He found no nest; you can see it in the way he walks.'),
        GB(
          'Stoick! You missed it. Your boy. He’s the best in the arena. The best I’ve ever seen.',
          'happy',
        ),
        ST('Hiccup? My Hiccup?', 'shock'),
        N(
          'Stoick looks at his son as if he has never seen him before. Then he laughs, a great bark of a laugh, and lifts him off his feet.',
        ),
        ST('I knew it. I always knew it was in you somewhere.', 'happy'),
        N(
          'Hiccup hangs in the air, smiling the way you smile when someone you love gives you the wrong present.',
        ),
      ],
      [
        ask(
          'maths',
          'distance, speed and time: 12 × 60',
          7,
          [
            N(
              'The ships sailed twelve days at about 60 km a day. How far did they sail in twelve days?',
            ),
          ],
          [
            opt(
              '720 km',
              [N('Yes! 12 × 60 is 10 × 60 = 600, plus 2 × 60 = 120, and 600 + 120 = 720.')],
              true,
            ),
            opt('72 km', [
              N(
                'That is only one tenth of the way. Twelve days is twelve lots of 60 km: 600 + 120 = 720.',
              ),
            ]),
            opt('612 km', [
              N(
                'That is 600 + 12. But each of the twelve days adds 60, not 1: 10 × 60 + 2 × 60 = 720.',
              ),
            ]),
          ],
          'Solved a distance, speed and time problem: 12 days at 60 km a day is 720 km.',
          '4.MD.A.2',
        ),
      ],
    ),
    sc(
      'a19-10-complete',
      [
        H('He’s proud of me. He’s actually proud of me.'),
        H('For being good at the thing I’m lying about.', 'sad'),
        N(
          'Gobber hands you a round shield, faced with shed Nadder scales, blue and gold, overlapping like roof tiles.',
        ),
        GB(
          'For the help. Hang it on your door, wherever your door is. Tells folk there’s someone inside who can look after things.',
        ),
        N('Hiccup is looking at the shield, not at you. He is not quite smiling.'),
      ],
      [
        notice(
          'social-studies',
          'Viking-age roofs were often turf over timber',
          2,
          [
            N(
              'Overlapping scales shed rain the way roof tiles do. In Viking-age Iceland and Norway, many houses had turf roofs instead.',
            ),
            N(
              'Strips of earth and grass were laid over a timber frame. Grass roofs kept the rain out and the warmth in.',
            ),
          ],
          'Learned that many Viking-age houses had turf roofs over timber, which kept rain out and warmth in.',
          'D2.His.2.3-5',
        ),
        ask(
          'sel',
          'whether praise for something you are hiding feels honest',
          4,
          [
            N(
              'Hiccup is cheered for being good at something he is hiding. Is it fair to be praised for it, and how might it feel?',
            ),
          ],
          [
            opt('It feels hollow, because it rests on a secret', [
              N(
                'That’s a fair answer. Praise is warmest when the person giving it knows the whole truth.',
              ),
            ]),
            opt('Praise is praise, and he earned it', [
              N(
                'That’s a fair answer. The skill is real, and what Hiccup did in the arena took genuine courage.',
              ),
            ]),
            opt('It depends who he is hiding it from, and why', [
              N(
                'That’s a fair answer. Hiding something to protect a friend is not the same as hiding it to look good.',
              ),
            ]),
          ],
          'Thought about whether praise feels honest when it depends on a secret.',
          SELF,
        ),
      ],
    ),
  ],
  [
    gloss(
      'shies away',
      'To jump back or turn aside because something scares or upsets you.',
      'a19-10-eel',
    ),
  ],
);

// ================================================================== A19-11 The Flight
const Q11: EduQuest = quest(
  'a19-11',
  'The Flight',
  {
    'a19-11-s1': {
      goal: 'Deal with Astrid at the cove.',
      hint: 'She is on the path down to the cove, and she has seen everything.',
    },
    'a19-11-s2': {
      goal: 'Watch Toothless take Astrid flying.',
      hint: 'Watch from the cove. The sky is theirs this time.',
    },
    'a19-11-s3': {
      goal: 'Wait at the cove for the last of the light.',
      hint: 'Stay on the sand with your Nubbin. Toothless will decide.',
    },
  },
  [
    sc(
      'a19-11-astrid',
      [
        N('Astrid follows Hiccup to the cove. She is not quiet about it, and she has her axe.'),
        A('Who are you training with? If this is some sort of trick…', 'angry'),
        N('Then Toothless comes up out of the shadows behind Hiccup, and she sees him.'),
        A('Get down! Night Fury!', 'shock'),
        N(
          'She swings the axe up, and Toothless crouches to spring. Hiccup throws himself between them with his arms out.',
        ),
        H('No! Don’t. He’s my friend. Astrid, this is Toothless. Toothless, Astrid.'),
        N(
          'Astrid looks at him, and at the dragon, and at you. Then she turns and runs for the village.',
        ),
        H('Oh, that’s bad. That’s very bad.', 'shock'),
      ],
      [
        ask(
          'literacy',
          'short sentences make a moment feel fast and urgent',
          3,
          [
            N(
              'Astrid shouts just three words, in two short bursts. Why do short sentences suit a moment of fright?',
            ),
          ],
          [
            opt(
              'They sound fast and urgent, like a heartbeat',
              [N('Yes, short sentences speed the reader up. Long, flowing ones slow us down.')],
              true,
            ),
            opt('They use fewer letters, so they are easier to write', [
              N(
                'Length on the page is not the point. What matters is the quick rhythm the reader hears.',
              ),
            ]),
            opt('They make the scene sound sleepy', [
              N('The opposite! Short sentences create a quick, urgent rhythm.'),
            ]),
          ],
          'Noticed that short sentences create a fast, urgent rhythm in a frightening moment.',
          'RL.4.3',
        ),
        ask(
          'sel',
          'helping a frightened person without scaring them more',
          7,
          [
            N(
              'Astrid is running off, frightened. What helps a frightened person without scaring them more?',
            ),
          ],
          [
            opt(
              'Stay calm, stay where they can see you, and give them a moment to think',
              [
                N(
                  'Yes. A frightened person calms best when someone is steady and not chasing them.',
                ),
              ],
              true,
            ),
            opt('Block the way and shout', [
              N('Blocking and shouting can feel like a threat, and make the fear bigger.'),
            ]),
            opt('Chase them as fast as you can', [
              N('Chasing makes a frightened person run faster. A calm presence works better.'),
            ]),
          ],
          'Talked about how to help a frightened person: stay calm and visible, and give them a moment to think.',
          RELATE,
        ),
      ],
      [
        {
          id: 'path',
          label: 'Get in her way.',
          then: [
            N(
              'You step into the path. Astrid stops, because you are in the way, and that is all anyone needed.',
            ),
          ],
        },
        {
          id: 'sit',
          label: 'Sit down on the path, where she has to pass.',
          then: [
            N(
              'You sit down in the middle of the path, and Astrid nearly falls over you. It is hard to run past someone who has sat down.',
            ),
          ],
        },
        {
          id: 'leave',
          label: 'Leave it to Hiccup.',
          then: [N('You stay where you are. It is his secret to keep or lose.')],
        },
      ],
    ),
    sc(
      'a19-11-astrid-done',
      [
        N(
          'Before she can go on, Toothless swoops low, picks her up by the belt, and sets her down in the top of a tall pine.',
        ),
        A('Get me down from here!', 'angry'),
        H('Let me show you. Then you can tell everyone, if you still want to. Please.'),
        N('The pine is about twelve metres tall, as high as a four-storey house.'),
        N('Astrid grips the branch and does not look down.'),
      ],
      [
        ask(
          'maths',
          'divide to measure: 12 ÷ 2',
          3,
          [
            N(
              'The pine is 12 metres tall, and Stoick is about 2 metres tall. How many Stoicks, laid head to toe up the trunk, would match it?',
            ),
          ],
          [
            opt('6', [N('Yes! 12 ÷ 2 = 6, because six lots of 2 make 12.')], true),
            opt('10', [N('Ten Stoicks would be 20 metres. Six lots of 2 make 12, so 12 ÷ 2 = 6.')]),
            opt('14', [N('That is 12 + 2. We want to know how many 2s fit into 12: 12 ÷ 2 = 6.')]),
          ],
          'Divided 12 metres by 2 metres to find 6.',
          '3.OA.A.3',
        ),
      ],
    ),
    sc(
      'a19-11-spin',
      [
        N(
          'Astrid climbs on behind Hiccup, stiff as a plank. Toothless looks at her over his shoulder, and you can see him decide.',
        ),
        H('Toothless, be nice. Toothless? Bud?'),
        N(
          'Toothless goes straight up like a firework, then straight down. Astrid’s yell reaches you a long moment later.',
        ),
        N(
          'He dips them in the sea and spins them. He rolls them over and over, like a dog with a stick.',
        ),
        A('Fine! Sorry! I take it back, all of it! Make him stop!', 'shock'),
        N(
          'Toothless stops. He spreads his wings wide and slows, and rises gently, up into the evening cloud.',
        ),
        N(
          'From down in the cove, you see them come out on top of the clouds, small and black against the gold.',
        ),
      ],
      [
        notice(
          'science',
          'spinning makes fluid in the inner ear keep moving, which causes dizziness',
          3,
          [
            N(
              'Inside each ear are little tubes of fluid that tell your brain how your head is moving.',
            ),
            N(
              'When you spin, the fluid keeps swirling after you stop, so your brain still thinks you are turning. That is dizziness, and it fades in a few seconds.',
            ),
          ],
          'Learned that dizziness comes from fluid in the inner ear that keeps moving after we stop spinning.',
          '4-LS1-2',
        ),
      ],
    ),
    sc(
      'a19-11-spin-done',
      [
        N(
          'They stay up a long time. When they come down, Astrid’s hair is everywhere, and she isn’t angry any more.',
        ),
        A('That was… all right. Fine. That was amazing.', 'soft'),
        N('She tries to look cross again, and can’t.'),
        N('Hiccup is trying very hard not to smirk.'),
        N('In a single afternoon, Astrid has been furious, terrified and delighted.'),
      ],
      [
        ask(
          'literacy',
          'what changes a character’s mind',
          2,
          [
            N(
              'Astrid went from furious to amazed in one flight. What do you think changed her mind?',
            ),
          ],
          [
            opt('The thrill of the flight itself', [
              N(
                'That’s a fair answer. Joy can arrive faster than we expect, and make anger feel small.',
              ),
            ]),
            opt('Seeing that Toothless was not a monster', [
              N('That’s a fair answer. Evidence can change a mind more quickly than argument.'),
            ]),
            opt('Hiccup trusting her with his secret', [
              N('That’s a fair answer. Being trusted can soften even a very angry person.'),
            ]),
          ],
          'Thought about what changed a character’s mind.',
          'RL.3.3',
        ),
      ],
    ),
    sc(
      'a19-11-turn',
      [
        H('One more round, before the light goes. Small passengers only.', 'happy'),
        N(
          'He looks at your Nubbin. Toothless looks at it too, and lowers his shoulder to the sand.',
        ),
        N(
          'Your Nubbin looks up at you. You don’t lift it; you let it go, the way it came back to you in the woods.',
        ),
        N(
          'It climbs into Hiccup’s lap by itself. Hiccup puts an arm round it, and Toothless lifts off, slow and smooth.',
        ),
        N(
          'They go round the cove once, low over the water, in the very last of the sun. Your Nubbin’s ball is as bright as a lantern.',
        ),
        N(
          'When they land, it slides off and runs straight to you, to tell you all about it the only way it can, which is by sitting on you.',
        ),
      ],
      [
        ask(
          'science',
          'why a low sun looks golden or red',
          4,
          [N('The low sun looks golden. Why do you think low sunlight looks gold or red?')],
          [
            opt(
              'Its light crosses more air, which scatters away the blue and leaves the reds and golds',
              [
                N(
                  'Yes. A low sun’s light travels through much more air before reaching you, so the blue is scattered away and golds and reds are left.',
                ),
              ],
              true,
            ),
            opt('The sun gets hotter at the end of the day', [
              N(
                'It is actually the same sun. What changes is how much air its light passes through.',
              ),
            ]),
            opt('The sea paints the sky gold', [
              N(
                'It is a lovely idea, but the sea does not colour the sky. The air does, by scattering the blue light away.',
              ),
            ]),
          ],
          'Learned that low sunlight looks golden because it passes through more air, which scatters away the blue.',
          '4-PS3-2',
        ),
      ],
    ),
    sc(
      'a19-11-complete',
      [
        N(
          'Dark comes up out of the sea. Hiccup, Astrid and Toothless stand together on the sand, out of breath.',
        ),
        A('I haven’t decided whether to tell. Show me more tomorrow. Then I’ll decide.'),
        N(
          'She punches Hiccup on the arm, quite hard. Then she looks at you and nods, which from Astrid is a speech.',
        ),
        N(
          'Astrid has not agreed to anything. She has agreed to look, and that is how a good decision starts.',
        ),
        N('She will gather more evidence, and then she will choose.'),
      ],
      [
        ask(
          'sel',
          'finding out more before deciding',
          3,
          [
            N(
              'Astrid wants to see more before she decides. Why is finding out more a good way to begin a big decision?',
            ),
          ],
          [
            opt(
              'You choose with facts instead of fear',
              [
                N(
                  'Yes. Fear decides fast and often badly, while facts take a little longer but give a better choice.',
                ),
              ],
              true,
            ),
            opt('So you never have to decide', [
              N('Looking is not a way to avoid deciding. It is a way to decide well.'),
            ]),
            opt('So that other people decide for you', [
              N(
                'Astrid is keeping the choice in her own hands. She is just choosing to look first.',
              ),
            ]),
          ],
          'Talked about why gathering facts first helps us make a good decision.',
          DECIDE,
        ),
      ],
    ),
  ],
  [gloss('scatter', 'To throw or spread something in many directions.', 'a19-11-turn')],
);

// ================================================================== A19-12 The Nest
const Q12: EduQuest = quest(
  'a19-12',
  'The Nest',
  {
    'a19-12-s1': {
      goal: 'Fly out with Hiccup, Astrid and Toothless.',
      hint: 'Hold on tight at the back of the saddle.',
    },
    'a19-12-s2': {
      goal: 'See where the dragons are going.',
      hint: 'Keep low and quiet. Toothless is doing the flying.',
    },
    'a19-12-s3': {
      goal: 'Fly home quietly with them.',
      hint: 'There is nothing to do but hold on and listen.',
    },
  },
  [
    sc(
      'a19-12-fog',
      [
        N(
          'The next evening, Astrid is at the cove before any of you. She is pretending not to have been waiting.',
        ),
        H('He can carry four, if two of them are small and nobody fidgets.', 'think'),
        N(
          'Toothless gives you a long look that says he has not agreed to this. Then he lowers his shoulder anyway.',
        ),
        N(
          'You climb on behind Astrid, with your Nubbin buttoned inside your coat and only its head out.',
        ),
        N(
          'Up you go, over the sea and into cloud. The cloud turns to fog, thick and white and wet.',
        ),
        N(
          'Then Toothless’s ears go back. He banks hard, though Hiccup hasn’t touched the pedal, and he won’t turn back.',
        ),
        H('Bud? What is it? Toothless, that’s not the way home!', 'shock'),
        N(
          'Out of the fog on every side come dragons: Nadders, Gronckles, Zipplebacks, all flying the same way, all carrying something.',
        ),
      ],
      [
        notice(
          'science',
          'fog is a cloud at ground level, made of tiny water droplets',
          4,
          [
            N(
              'Fog is a cloud that touches the ground or the sea. It is made of billions of tiny water droplets hanging in the air.',
            ),
            N(
              'Sea fog often forms when warm, damp air drifts over cold water and cools. The droplets are why it feels wet on your face.',
            ),
          ],
          'Learned that fog is a low cloud made of tiny water droplets, often formed when warm damp air cools over cold water.',
        ),
      ],
      [
        {
          id: 'hold',
          label: 'Hold your Nubbin tighter.',
          then: [
            N(
              'You fold both arms over your coat. Your Nubbin pushes its head under your chin and stays there.',
            ),
          ],
        },
        {
          id: 'eyes',
          label: 'Keep your eyes open.',
          then: [
            N(
              'You keep your eyes open. Somebody should see this, and you are the one sitting at the back.',
            ),
          ],
        },
        {
          id: 'belt',
          label: 'Hold on to Astrid’s belt.',
          then: [A('Good. Don’t let go. I’m not losing anyone off this thing.')],
        },
      ],
    ),
    sc(
      'a19-12-pit',
      [
        N(
          'The fog opens on a mountain in the sea, steaming at the top. The dragons pour in through a crack in its side, and so do you.',
        ),
        N(
          'Inside it is huge and hot and red. Hundreds of dragons cling to the walls, quiet as dragons in a dream.',
        ),
        N(
          'In the middle is a pit full of mist. One by one, the dragons fly over it and drop what they have carried.',
        ),
        N('Fish, sheep, a whole yak: all of it falls into the mist and is gone.'),
        H('They’re not eating it. Why aren’t they eating any of it?', 'think'),
        N(
          'Last comes a slow, tired Gronckle with only one small fish in its mouth. It drops it, and hovers.',
        ),
        N(
          'Something rises out of the pit, bigger than the Great Hall: a head like a cliff, with eyes like lamps.',
        ),
        N('The mist closes over the Gronckle, and there is a sound you will not forget.'),
        N('When the mist clears, the place where it hovered is empty.'),
        A('They’re not raiding us for themselves. They’re feeding that.', 'shock'),
        H('Or it eats them instead.', 'sad'),
        N(
          'The great eyes turn. They have seen Toothless, and Toothless is already moving: out, out, through the crack and into the fog.',
        ),
      ],
      [
        ask(
          'literacy',
          'what a simile does to our picture of a creature',
          6,
          [
            N(
              'The writer says the creature has a head “like a cliff” and eyes “like lamps”. What do these comparisons do?',
            ),
          ],
          [
            opt(
              'They make it seem enormous and glowing',
              [
                N(
                  'Yes. A cliff is huge and hard, and lamps are bright in the dark, so together they build a frightening picture without every detail.',
                ),
              ],
              true,
            ),
            opt('They tell us its exact size', [
              N('Similes give a feeling, not a measurement. We know it is huge, but not how huge.'),
            ]),
            opt('They make it sound funny', [
              N(
                'Not here. The comparisons are meant to make the creature feel vast and frightening.',
              ),
            ]),
          ],
          'Explained how similes build a picture of a huge, glowing creature.',
          'L.4.5',
        ),
        notice(
          'sel',
          'saying a fear out loud makes it smaller',
          10,
          [
            N(
              'Hiccup and Astrid are both frightened, and they say so. Naming a fear out loud often makes it a little smaller.',
            ),
            N(
              'It does not make us less brave. Bravery is doing the next thing while you are still afraid.',
            ),
          ],
          'Learned that naming a fear aloud can make it smaller, and that bravery means acting while afraid.',
          SELF,
        ),
      ],
    ),
    sc(
      'a19-12-home',
      [
        N(
          'Nobody speaks for a long time. The fog thins, the stars come out, and Berk is a few lights on the black sea.',
        ),
        A(
          'That’s the nest. That’s what our fathers have been looking for, for as long as anyone remembers. We have to tell them.',
        ),
        H(
          'No. Not yet. If they know where it is, they’ll ask how I know. And then they’ll find him.',
          'sad',
        ),
        A('Hiccup, that thing…'),
        H(
          'They’ll kill him, Astrid. Please. Give me time. I’ll work it out. I’ll think of something.',
        ),
        N(
          'Astrid looks at the back of his head for a long time. Toothless flies very gently, as if he were listening.',
        ),
      ],
      [
        ask(
          'social-studies',
          'when two people both have a good reason',
          5,
          [
            N(
              'Astrid wants to warn the village, and Hiccup wants time to protect Toothless. Who is right, or can both be?',
            ),
          ],
          [
            opt('Both: safety and loyalty both matter', [
              N(
                'That’s a fair answer. The hardest choices are between two things that are both good.',
              ),
            ]),
            opt('Astrid: the village’s safety comes first', [
              N('That’s a fair answer. Many lives are at stake, and she is thinking of them.'),
            ]),
            opt('Hiccup: a friend in danger needs time', [
              N(
                'That’s a fair answer. A single life matters too, and a rushed decision cannot be undone.',
              ),
            ]),
          ],
          'Thought about a dilemma in which two people both have a good reason.',
          'D2.Civ.8.3-5',
        ),
      ],
      [
        {
          id: 'quiet',
          label: 'Say nothing. Let them have the quiet.',
          then: [N('You say nothing. The wind says it for everyone, all the way home.')],
        },
        {
          id: 'shoulder',
          label: 'Reach past Astrid and touch Hiccup’s shoulder.',
          then: [
            N(
              'You put one hand on Hiccup’s shoulder. He doesn’t turn round, but he leans back into it, just a little.',
            ),
          ],
        },
        {
          id: 'both',
          label: 'Say they’re both right.',
          then: [
            A('That’s the worst thing about it.', 'sad'),
            N('After that nobody says anything else, all the way home.'),
          ],
        },
      ],
    ),
    sc(
      'a19-12-complete',
      [
        N(
          'Toothless lands you in the cove under the stars at a quarter to ten. You left at six, and you all climb down, stiff and cold.',
        ),
        A('All right. We wait. But not for long, Hiccup. Not for long.'),
        H(
          'Tomorrow’s the final exam. I’m supposed to kill a dragon in front of the whole village.',
          'sad',
        ),
        A('Then you’d better think of something fast.'),
      ],
      [
        ask(
          'maths',
          'time intervals to the minute',
          0,
          [N('They left at 6:00 and landed at 9:45. How long were they away?')],
          [
            opt(
              '3 hours 45 minutes',
              [N('Yes! From 6:00 to 9:00 is 3 hours, and from 9:00 to 9:45 is 45 minutes more.')],
              true,
            ),
            opt('2 hours 45 minutes', [
              N('Count again: from 6:00 to 9:00 is 3 hours, not 2. Then add the 45 minutes.'),
            ]),
            opt('4 hours 15 minutes', [
              N(
                'That is the time from 6:00 to 10:15. A quarter to ten is 9:45, so 3 hours and 45 minutes.',
              ),
            ]),
          ],
          'Found a time interval: from 6:00 to 9:45 is 3 hours 45 minutes.',
          '3.MD.A.1',
        ),
      ],
    ),
  ],
  [gloss('banks', 'Tilts to one side when turning in flight.', 'a19-12-fog')],
);

// ================================================================== A19-13 The Final Exam
const Q13: EduQuest = quest(
  'a19-13',
  'The Final Exam',
  {
    'a19-13-s1': {
      goal: 'Take your place at the arena gate for the final exam.',
      hint: 'Stand with Gobber by the gate, where Hiccup will pass you.',
    },
    'a19-13-s2': {
      goal: 'Watch the exam from the gate.',
      hint: 'Stay at the gate. This is Hiccup’s, not yours.',
    },
    'a19-13-s3': {
      goal: 'Stay with Hiccup as the ships go out.',
      hint: 'Go down to the jetty with Hiccup.',
    },
  },
  [
    sc(
      'a19-13-stands',
      [
        N(
          'The whole of Berk is crammed round the arena. Somebody is selling smoked fish on sticks.',
        ),
        N('Stoick sits in the chief’s seat at the top, bigger than ever, proud enough to burst.'),
        ST('My son. My son kills his first dragon today. I never thought I’d see it.', 'happy'),
        GB('None of us did, Stoick.'),
        N(
          'You stand at the gate with Gobber. Hiccup comes down the steps into the pit in a helmet that still doesn’t fit him.',
        ),
        N(
          'He looks at you as he passes. He has the face of someone who has thought of something, and wishes he hadn’t.',
        ),
      ],
      [
        ask(
          'science',
          'echoes: sound bounces off hard surfaces',
          1,
          [
            N(
              'The arena is a stone pit, so when the crowd roars, the sound bounces back off the walls. What do we call that?',
            ),
          ],
          [
            opt(
              'An echo',
              [
                N(
                  'Yes, sound waves bounce off hard, flat surfaces like stone. Caves, canyons and big stone halls are good at echoes.',
                ),
              ],
              true,
            ),
            opt('A shadow', [
              N('A shadow is made by blocking light. A sound bouncing back is an echo.'),
            ]),
            opt('A rainbow', [
              N(
                'A rainbow comes from light and water. Sound bouncing off stone is called an echo.',
              ),
            ]),
          ],
          'Learned that sound bounces off hard surfaces, which makes an echo.',
          '4-PS3-2',
        ),
      ],
      [
        {
          id: 'luck',
          label: 'Wish him luck.',
          then: [H('Thanks. I’ll need it. If anything goes wrong, look after… you know.')],
        },
        {
          id: 'dont',
          label: 'Tell him he doesn’t have to do this.',
          then: [H('I do, though. Just not the way they think.', 'soft')],
        },
        {
          id: 'nod',
          label: 'Just nod.',
          then: [N('You nod, and he nods back. For once, that is enough.')],
        },
      ],
    ),
    sc(
      'a19-13-hand',
      [
        N(
          'The gate goes up. A Monstrous Nightmare comes out of the dark, on fire from nose to tail, and climbs the chains.',
        ),
        N(
          'Hiccup stands very still. Then he lets his shield fall, and his knife, and takes off his helmet and drops that too.',
        ),
        H('It’s all right. I’m not going to hurt you. Look. Nothing.'),
        N(
          'He holds out his hand and turns his face away. The fire goes out along the Nightmare’s back, slowly, like a fire going to sleep.',
        ),
        N('Up in the stands, nobody makes a sound. You can hear the sea.'),
        H('They don’t have to be like this. We don’t have to be like this. We could…'),
        ST('Enough! Get him out of there!', 'angry'),
        N(
          'Stoick brings his hammer down on the iron bars. The clang goes all round the arena, and the Nightmare goes wild.',
        ),
        N('It goes for Hiccup. Far off over the sea, you hear a high whistle, coming closer.'),
      ],
      [
        ask(
          'sel',
          'whether laying down your weapons in public is brave or foolish',
          8,
          [N('Hiccup drops his weapons and holds out an empty hand to the Nightmare. What is he showing it?')],
          [
            opt(
              'That he means no harm',
              [N('Yes. An empty, open hand says “I am not a threat”, and the fire goes out.')],
              true,
            ),
            opt('That he has run out of ideas', [
              N('No. Putting weapons down is a plan, and it works on the Nightmare for a while.'),
            ]),
            opt('That he wants a fight', [N('No. Nobody offers an empty hand to start a fight.')]),
          ],
          'Noticed that dropping weapons and offering an empty hand shows a frightened animal you mean no harm.',
          SOCIAL,
        ),
      ],
    ),
    sc(
      'a19-13-chain',
      [
        N(
          'Toothless comes through the chain roof in a burst of blue fire and lands between Hiccup and the Nightmare.',
        ),
        N(
          'He drives it back into its pen. Then he turns to Hiccup, and the whole village pours down into the arena.',
        ),
        H('Toothless, go! Go! Get out of here!', 'shock'),
        N(
          'He doesn’t go; he stays by Hiccup. Ten Vikings bring him down with ropes, and then twenty, and then they have him.',
        ),
        N(
          'In the shouting afterwards, Hiccup tells his father too much: that Toothless can find the nest, and that he has been there.',
        ),
        N(
          'Stoick says one short thing to his son, very quietly, that no father should say. Then he turns his back on him.',
        ),
        N(
          'By the next tide the ships are going out again. On the lead ship, chained to the deck, there is a black dragon.',
        ),
        N('Hiccup stands on the jetty with nothing in his hands. His father doesn’t look back.'),
      ],
      [
        ask(
          'literacy',
          'why a writer might leave words unsaid',
          5,
          [N('The writer never tells us what Stoick says. Why might the writer leave it out?')],
          [
            opt(
              'So we feel how hurtful the words were without hearing them repeated',
              [
                N(
                  'Yes. Sometimes what is left out hits harder than what is said, and the hurt is in Hiccup’s face and the silence after.',
                ),
              ],
              true,
            ),
            opt('Because the writer forgot', [
              N(
                'It is deliberate. Look at how carefully the sentence is built: “one short thing… that no father should say”.',
              ),
            ]),
            opt('To make the scene shorter', [
              N('The scene is not short. The writer is using silence to make a moment heavier.'),
            ]),
          ],
          'Explained why a writer might leave hurtful words unsaid, so the reader feels their weight.',
          'RL.4.3',
        ),
      ],
    ),
    sc(
      'a19-13-complete',
      [
        GB(
          'I’ve known Stoick forty years. He’ll be sorry. He just has to sail far enough out to see it.',
          'sad',
        ),
        N(
          'Gobber goes with the ships; he has to. On his way past, he touches Hiccup’s shoulder with his hook, very gently.',
        ),
        N('Then it is only you, and your Nubbin, and Hiccup, and an empty harbour.'),
        N(
          'Words said in anger can hurt for a long time. An apology is more than a few words: it takes honesty, and often time.',
        ),
        N(
          'The harbour is very quiet. The tide comes in, slow and steady, as if nothing had happened.',
        ),
      ],
      [
        ask(
          'sel',
          'what helps mend things after hurtful words',
          3,
          [N('What can help mend things after someone has said something hurtful?')],
          [
            opt(
              'Time, and then an honest apology',
              [
                N(
                  'Yes. Time lets the first anger cool, and an honest apology says: I know what I did.',
                ),
              ],
              true,
            ),
            opt('Pretending it never happened', [
              N(
                'That may keep the peace for a while, but the hurt stays underneath. It is better to talk about it.',
              ),
            ]),
            opt('Saying something hurtful back', [
              N('That adds a second hurt. It rarely mends the first one.'),
            ]),
          ],
          'Talked about what helps mend a relationship after hurtful words: time and an honest apology.',
          RELATE,
        ),
      ],
    ),
  ],
  [
    gloss(
      'echo',
      'A sound that bounces back off a hard surface, so you hear it again.',
      'a19-13-stands',
    ),
  ],
);

// ================================================================== A19-14 What Astrid Asked
const Q14: EduQuest = quest(
  'a19-14',
  'What Astrid Asked',
  {
    'a19-14-s1': {
      goal: 'Find Hiccup, and sit with him.',
      hint: 'He’s on the cliff over the harbour. You don’t have to say anything.',
    },
    'a19-14-s2': {
      goal: 'Listen while Astrid asks the question.',
      hint: 'Stay where you are when Astrid comes.',
    },
  },
  [
    sc(
      'a19-14-cliff',
      [
        N('Hiccup sits on the cliff over the empty harbour, with his knees pulled up.'),
        N('You don’t ask him anything. You sit down next to him, a little way off, and wait.'),
        N(
          'Your Nubbin sits down too, between you, facing the sea, like a small round paperweight.',
        ),
        H('Everything was getting good. And then I…', 'sad'),
        N('He doesn’t finish, and you don’t need him to. The tide goes out a long way.'),
        H('He should have left me, in the arena. He came for me, and now they’ve got him.'),
      ],
      [
        notice(
          'health',
          'quiet company helps when someone is sad',
          2,
          [
            N(
              'When someone is sad, we often think we must say the perfect thing. Usually the most helpful thing is simply being there.',
            ),
            N(
              'Quiet, kind company helps people feel less alone, and listening matters more than fixing.',
            ),
          ],
          'Learned that simply being there, calm and kind, helps a sad person feel less alone.',
          'CASEL: Relationship skills',
        ),
      ],
      [
        {
          id: 'stay',
          label: 'Stay where you are.',
          then: [
            N(
              'You stay. Some things don’t need anything said over them; they just need somebody not to leave.',
            ),
          ],
        },
        {
          id: 'closer',
          label: 'Move a little closer.',
          then: [
            N(
              'You move a little closer. He doesn’t look up, but he stops pulling his knees in so tight.',
            ),
          ],
        },
        {
          id: 'fish',
          label: 'Give him the dried fish from your pocket.',
          then: [
            N('He looks at it, and laughs, once, wetly, and takes it.'),
            H('You’ve been learning off Toothless.'),
          ],
        },
      ],
    ),
    sc(
      'a19-14-astrid',
      [
        N(
          'Footsteps behind you. Astrid sits down on Hiccup’s other side, and doesn’t say anything for a while.',
        ),
        A('In the woods. When you found him. You could have finished him. Why didn’t you?'),
        H('I don’t know. I couldn’t.'),
        A('That isn’t an answer. Why couldn’t you?'),
        N(
          'He is quiet for so long that you think he isn’t going to say. Then he looks at his hands.',
        ),
        H(
          'He was scared. I know that kind of scared. I couldn’t hurt something that frightened.',
          'soft',
        ),
        N(
          'He says it as if it has been sitting in his chest since the woods, waiting to be let out.',
        ),
        A('So. He’s frightened, and he’s chained to a ship. What now?'),
      ],
      [
        ask(
          'sel',
          'whether recognising a shared feeling makes it harder to hurt someone',
          5,
          [
            N(
              'Hiccup saw his own fear in the dragon. Does noticing that someone feels what you feel make it harder to hurt them?',
            ),
          ],
          [
            opt('Yes, a shared feeling builds a bridge', [
              N(
                'That’s a fair answer. Empathy is the feeling of standing, for a moment, in someone else’s place.',
              ),
            ]),
            opt('Not always, some people ignore it', [
              N('That’s a fair answer. We have to let ourselves notice, and that takes courage.'),
            ]),
            opt('It depends if you let yourself notice', [
              N(
                'That’s a fair answer. The feeling is there for those who look, and Hiccup looked.',
              ),
            ]),
          ],
          'Thought about how recognising a shared feeling can build empathy.',
          SOCIAL,
        ),
      ],
    ),
    sc(
      'a19-14-astrid-done',
      [
        N('Hiccup looks at the sea. Then he looks back at the village, at the arena, at the pens.'),
        H('The training dragons. They’re still in their pens.', 'think'),
        N('There are four pens behind the arena, one for each training dragon.'),
        N('If each dragon can carry two riders, that is a lot of riders without a single saddle.'),
        N('Hiccup’s plan is beginning to take shape.'),
      ],
      [
        ask(
          'maths',
          'multiplication as equal groups: 4 × 2',
          3,
          [
            N(
              'There are four dragons, and each can carry two riders. How many riders is that altogether?',
            ),
          ],
          [
            opt('8', [N('Yes! Four groups of two: 2 + 2 + 2 + 2 = 8, so 4 × 2 = 8.')], true),
            opt('6', [N('That is 4 + 2. We need four lots of two: 2 + 2 + 2 + 2 = 8.')]),
            opt('4', [
              N(
                'That is the number of dragons. Each carries two riders, so count in twos: 2, 4, 6, 8.',
              ),
            ]),
          ],
          'Multiplied 4 groups of 2 to find 8 riders.',
          '3.OA.A.1',
        ),
      ],
    ),
    sc(
      'a19-14-complete',
      [
        H('I’m going to do something mad.'),
        A('Good. I was hoping you’d say that.'),
        H('There. Now you know why, too. In the woods I didn’t. I do now.', 'soft'),
        N(
          'Astrid is already running for the village. Hiccup gets up and follows her, and you and your Nubbin follow him.',
        ),
        N(
          'Hiccup has a problem: Toothless is chained, and the fleet is gone.',
        ),
      ],
      [
        ask(
          'science',
          'a sensible first step in solving a problem',
          4,
          [N('Engineers solve problems in steps. What is a sensible first step for Hiccup?')],
          [
            opt(
              'List what he has and what he could try, then compare the plans',
              [
                N(
                  'Yes, engineers define the problem, gather ideas and compare them before choosing. Hiccup has riders, dragons and a few hours.',
                ),
              ],
              true,
            ),
            opt('Pick the first idea and hope', [
              N(
                'Speed matters here, but a rushed plan can fail. Comparing even two plans is wiser.',
              ),
            ]),
            opt('Wait for it to go away', [
              N('Problems rarely solve themselves. Engineers start by looking at what they have.'),
            ]),
          ],
          'Learned that solving a problem starts with listing what you have and comparing possible plans.',
          '3-5-ETS1-2',
        ),
      ],
    ),
  ],
  [
    gloss(
      'empathy',
      'Understanding what someone else feels because you can imagine being them.',
      'a19-14-astrid',
    ),
  ],
);

// ================================================================== A19-15 Training Dragons
const Q15: EduQuest = quest(
  'a19-15',
  'Training Dragons',
  {
    'a19-15-s1': {
      goal: 'Meet the others at the arena pens.',
      hint: 'The arena is empty. Go round to the pens at the back.',
    },
    'a19-15-s2': {
      goal: 'Help match each rider to a dragon.',
      hint: 'Watch which way each dragon looks, and who looks back.',
    },
    'a19-15-s3': {
      goal: 'Fly after the fleet with the young riders.',
      hint: 'Ride behind Fishlegs on the Gronckle and hold on.',
    },
  },
  [
    sc(
      'a19-15-pens',
      [
        N(
          'The arena is empty. The training dragons sit in their pens in the dark: the Nadder, the Gronckle, the Nightmare, the Zippleback.',
        ),
        N(
          'Astrid has brought the others. Fishlegs, Snotlout and the twins stand in a row, looking like people who have been told nothing.',
        ),
        SN('If this is a trick to get us eaten, I want it known I’m too good-looking to eat.'),
        RF('Nobody eats you. You’re mostly elbows.'),
        TF('And hair.'),
        H('Nobody’s getting eaten. I want you to meet them. Properly. The way I met Toothless.'),
        FL('Meet them? We’ve spent all month trying to beat them!', 'shock'),
        H('I know. I was there. I was terrible at it.'),
      ],
      [
        ask(
          'literacy',
          'why a character jokes when nervous',
          2,
          [N('Why do you think Snotlout makes a joke here?')],
          [
            opt(
              'Joking helps him hide that he is nervous',
              [
                N(
                  'Yes, people often joke when they are afraid. The words say “I’m fine” while the nerves say otherwise.',
                ),
              ],
              true,
            ),
            opt('He is sure he is safe', [
              N('If he were sure, he would not need to say it out loud. The joke gives him away.'),
            ]),
            opt('He wants to be eaten', [N('Ha! No one wants that, least of all Snotlout.')]),
          ],
          'Explained why a character might use a joke to cover nerves.',
          'RL.3.3',
        ),
      ],
    ),
    sc(
      'a19-15-hands',
      [
        N(
          'Hiccup opens the Nadder’s pen. It comes out with every spine up, like a hedge with opinions.',
        ),
        H('Hand out. Slow. Look away. Don’t grab. Let it come to you. Let it choose.'),
        N(
          'Astrid goes first, of course. She holds out her hand and turns her face away, and the Nadder puts its nose into her palm.',
        ),
        H('Now everyone else. Keeper, help me. Who goes with who?'),
        N(
          'You walk along the pens with Hiccup, watching each dragon and each Viking, and which way their eyes go.',
        ),
        N(
          'The Nightmare likes noise, so it gets Snotlout. The Zippleback has two heads and two tempers, so it gets the twins.',
        ),
        N('That leaves the Gronckle, and Fishlegs, standing a long way from each other.'),
      ],
      [
        notice(
          'science',
          'trainers today use rewards and calm, not force, to build trust',
          1,
          [
            N(
              'Animal trainers today mostly teach with rewards, like food or praise, and not with force.',
            ),
            N(
              'Animals learn faster and trust more when they feel safe and get to choose to take part.',
            ),
          ],
          'Learned that modern animal trainers use rewards and calm rather than force, and that safety and choice build trust.',
        ),
        ask(
          'social-studies',
          'choice and consent for animals',
          6,
          [
            N(
              'Hiccup lets each dragon choose its rider. Why might choice matter, and should an animal always get a say?',
            ),
          ],
          [
            opt('Choice builds trust', [
              N(
                'That’s a fair answer. An animal that chooses to come close is more settled than one that is made to.',
              ),
            ]),
            opt('Animals cannot say yes or no in words, so people must watch very closely', [
              N(
                'That’s a fair answer. Looking after an animal means reading its signals, because it cannot ask in words.',
              ),
            ]),
            opt('Sometimes an animal’s safety means we must decide for it', [
              N(
                'That’s a fair answer. Choice matters, but it is not the only thing, and a caring person weighs both.',
              ),
            ]),
          ],
          'Thought about why choice matters to animals and how people can respect it.',
          'D2.Civ.8.3-5',
        ),
      ],
      [
        {
          id: 'match',
          label: 'Bring Fishlegs to the Gronckle.',
          then: [
            N(
              'Fishlegs holds out a shaking hand. The Gronckle sniffs it, then leans her whole round head against his chest.',
            ),
            FL('She likes me! She actually likes me!', 'happy'),
          ],
        },
        {
          id: 'choose',
          label: 'Let the Gronckle choose.',
          then: [
            N('The Gronckle waddles straight past everyone and sits down on Fishlegs’s feet.'),
            FL('She picked me! Nobody ever picks me first!', 'happy'),
          ],
        },
      ],
    ),
    sc(
      'a19-15-hands-done',
      [
        N('Fishlegs is crying, openly, with joy. Nobody says a word about it, not even Snotlout.'),
        N('The Gronckle leans her whole round weight against him, and he nearly falls over.'),
        FL('I’ve read about you since I was four!', 'happy'),
        N(
          'Tears do not only come when we are sad. They can come with joy, relief and surprise too.',
        ),
        N('Fishlegs has waited a long time for someone to choose him.'),
      ],
      [
        ask(
          'sel',
          'tears can come with any big feeling',
          3,
          [N('Is it all right to cry when you are very happy?')],
          [
            opt(
              'Yes, tears can come with any big feeling',
              [
                N(
                  'Yes, joy, relief and surprise can all bring tears. They are a normal way for the body to let a big feeling out.',
                ),
              ],
              true,
            ),
            opt('No, tears are only for sadness', [
              N('Many people cry from happiness. Fishlegs shows it is a real and welcome thing.'),
            ]),
          ],
          'Learned that crying can come with happiness as well as sadness, and that all feelings are allowed.',
          SELF,
        ),
      ],
    ),
    sc(
      'a19-15-go',
      [
        N('There are no saddles. They make do with rope, and blankets, and holding on.'),
        FL('Keeper, ride with me. She’s slow, but she doesn’t drop things. I checked.'),
        N(
          'You climb on behind Fishlegs. Your Nubbin rides in a sack strapped to the Gronckle’s side, like luggage with a view.',
        ),
        A('Which way did the ships go?'),
        H(
          'North, to the nest. Toothless knows the way, so they’ll find it. That’s what I did.',
          'sad',
        ),
        N(
          'Four dragons go up out of the arena one after another, into the grey morning, and turn north after the fleet.',
        ),
        N(
          'Hiccup rides behind Astrid on the Nadder, you ride behind Fishlegs, Snotlout has the Nightmare, and the twins share the Zippleback.',
        ),
      ],
      [
        ask(
          'maths',
          'adding four small numbers: 2 + 2 + 1 + 2',
          6,
          [
            N(
              'Count the people: Astrid and Hiccup, Fishlegs and you, Snotlout, and the twins. How many people are flying?',
            ),
          ],
          [
            opt(
              '7',
              [
                N(
                  'Yes, 2 + 2 + 1 + 2 = 7! The Nubbin rides in a sack, so we are counting only people.',
                ),
              ],
              true,
            ),
            opt('6', [
              N(
                'Count again: two on the Nadder, two on the Gronckle, one on the Nightmare, two on the Zippleback.',
              ),
            ]),
            opt('8', [N('Close. Add: 2 + 2 is 4, plus 1 is 5, plus 2 is 7.')]),
          ],
          'Added 2 + 2 + 1 + 2 to find 7 people flying.',
          '3.OA.D.8',
        ),
      ],
    ),
    sc(
      'a19-15-go-done',
      [
        N(
          'The sea is very far down. The Gronckle hums as she flies, and Fishlegs hums back to her.',
        ),
        N('You put a hand on her warm side. It buzzes, very faintly, like a tuning fork.'),
        N(
          'Sound is made by vibrations: something wiggles to and fro, so fast that the air round it wiggles too.',
        ),
        N(
          'The buzz you feel is the wiggle itself. Put your fingers on your own throat and hum, and you can feel it.',
        ),
        FL('She hums when she’s happy. I think. I’m writing it down.', 'happy'),
      ],
      [
        doit(
          'science',
          'humming makes a vibration we can feel',
          3,
          'edu:hum:feel:throat',
          [
            N('(Hum a long note with your fingertips on your throat. Can you feel the buzz?)'),
            N('That buzz is a vibration. Change the note, and the buzz changes too.'),
          ],
          'Hummed with fingers on the throat and felt the vibration that makes sound.',
          '4-PS3-2',
        ),
      ],
    ),
    sc(
      'a19-15-complete',
      [
        SN('Best day of my life. I’m going to tell everyone I thought of it.', 'happy'),
        TF('I’m going to tell everyone I was on the left head.'),
        RF('You were on the right head.'),
        TF('That’s what I said.'),
        N(
          'Hiccup rides at the front, behind Astrid on the Nadder. He doesn’t look back; he is looking north.',
        ),
        N(
          'Twins who muddle left and right are not alone. Lots of people mix them up, even as adults.',
        ),
      ],
      [
        ask(
          'literacy',
          'what makes a joke funny: a contradiction',
          3,
          [N('What makes “That’s what I said” funny here?')],
          [
            opt(
              'Tuffnut plainly said the opposite, and will not admit it',
              [
                N(
                  'Yes, the joke is the gap between what he said (“left”) and what he claims he said. Characters who refuse to back down are often funny.',
                ),
              ],
              true,
            ),
            opt('It is a true fact about heads', [
              N('The fact is that he mixed them up. What is funny is that he insists he did not.'),
            ]),
            opt('It is a riddle with a hidden answer', [
              N(
                'There is no riddle. The joke is a plain contradiction, said with a straight face.',
              ),
            ]),
          ],
          'Explained why a contradiction in a conversation is funny.',
          'RL.3.3',
        ),
      ],
    ),
  ],
  [gloss('muddle', 'To mix things up, so you cannot tell which is which.', 'a19-15-complete')],
);

// ================================================================== A19-16 The Red Death
const Q16: EduQuest = quest(
  'a19-16',
  'The Red Death',
  {
    'a19-16-s1': {
      goal: 'Come in to the mountain with the riders.',
      hint: 'Hold on behind Fishlegs as the Gronckle comes down towards the shore.',
    },
    'a19-16-s2': {
      goal: 'Get everyone off the burning ships.',
      hint: 'Work along the ships from the shore end. The riders are keeping it busy.',
    },
    'a19-16-s3': {
      goal: 'Watch from the water’s edge as Hiccup goes for Toothless.',
      hint: 'Stay at the edge of the water. Stoick is faster than you.',
    },
  },
  [
    sc(
      'a19-16-mountain',
      [
        N(
          'The fleet has found the mountain. Stoick’s Vikings have run the ships up on the grey shore and are hammering at the rock.',
        ),
        N(
          'Toothless is chained on the deck of the lead ship. He has seen you coming long before anyone else.',
        ),
        N('The rock face cracks wide. The Vikings cheer, and then stop cheering.'),
        N(
          'What comes out is the thing from the pit, the size of a hill, with six eyes and a mouth like the mouth of a cave.',
        ),
        GB('That’s not a dragon. That’s a mountain with a temper.', 'shock'),
        N(
          'Its fire goes along the line of ships like a hand along a table. Every one of them catches.',
        ),
        ST('Off the ships! Everyone off! Get to the rocks!', 'angry'),
      ],
      [
        notice(
          'science',
          'water freezing in cracks splits rock',
          2,
          [
            N(
              'Real rock can crack when water seeps into a tiny crack and freezes. Ice takes up more room than water, so it pushes the crack wider.',
            ),
            N('Over many winters, solid cliffs split. That slow weathering shapes real coasts.'),
          ],
          'Learned that rock can crack when water freezes in small cracks, because ice takes up more room than water.',
          '4-ESS2-1',
        ),
        ask(
          'literacy',
          'what a simile shows about movement',
          5,
          [
            N(
              '“Its fire goes along the line of ships like a hand along a table.” What does this simile tell you about how the fire moves?',
            ),
          ],
          [
            opt(
              'Smoothly and sweeping, touching every ship in turn',
              [
                N(
                  'Yes. A hand along a table touches everything in one long, easy movement, and the fire does the same.',
                ),
              ],
              true,
            ),
            opt('Slowly, one ship at a time', [
              N('A hand sweeping a table is quick and smooth. The simile shows speed and a sweep.'),
            ]),
            opt('Only at the very end of the line', [
              N(
                'The hand touches the whole table, not just the end. The simile shows the fire catching every ship.',
              ),
            ]),
          ],
          'Explained what a simile shows about how the fire moves along the ships.',
          'L.4.5',
        ),
      ],
    ),
    sc(
      'a19-16-draw',
      [
        N(
          'The young riders come in low out of the smoke. On the beach, the Vikings look up, and their mouths fall open.',
        ),
        H('Fishlegs, what’s it got? Talk to me!'),
        FL(
          'Big head, small eyes for its size, can’t see well to the sides! Also, it’s enormous! Sorry, I’m panicking!',
        ),
        H('Then confuse it! Noise! Twins, gas and spark, on its left side!'),
        N(
          'The riders swing round its head like gulls round a ship. It turns, and roars, and snaps at nothing.',
        ),
        N(
          'Fishlegs sets you down on the beach. Your job is the people still on the ships: one at a time, off the burning decks.',
        ),
      ],
      [
        ask(
          'social-studies',
          'why leaders go last in an emergency',
          5,
          [
            N(
              'Stoick wants everyone else off the ships before him. Why do leaders in an emergency often go last?',
            ),
          ],
          [
            opt(
              'Because their job is to look after everyone else first',
              [
                N(
                  'Yes. A leader’s duty is to the people who depend on them, and ships’ captains still follow this today.',
                ),
              ],
              true,
            ),
            opt('Because they are not important', [
              N(
                'A leader is very important. That is exactly why leaving last is a sign of duty, not of being unimportant.',
              ),
            ]),
            opt('Because they are the slowest', [
              N(
                'Not at all. Stoick could leave quickly, but he chooses to see everyone else safe.',
              ),
            ]),
          ],
          'Talked about why leaders often leave last in an emergency: duty to those who depend on them.',
          'D2.Civ.8.3-5',
        ),
      ],
      [
        {
          id: 'gobber',
          label: 'Help Gobber down first.',
          then: [
            GB(
              'Mind the leg! It’s not the one I was born with, but it’s a good one, and I want it back.',
            ),
          ],
        },
        {
          id: 'nubbin',
          label: 'Send your Nubbin to look for anyone hiding.',
          then: [
            N(
              'Your Nubbin goes along the deck under the smoke, where nobody else can see, and finds a young Viking crouched behind a barrel.',
            ),
            N('You get her off together. She holds your Nubbin all the way down the gangplank.'),
          ],
        },
        {
          id: 'stoick',
          label: 'Go to Stoick.',
          then: [
            ST('Not me! Them! Get them off first!', 'angry'),
            N('So you do. He is the last one off, as a chief should be.'),
          ],
        },
      ],
    ),
    sc(
      'a19-16-draw-done',
      [
        N(
          'When the last one is off, you look back. Hiccup has turned away from the great dragon, towards the lead ship.',
        ),
        N(
          'Everyone on the beach is safe. You counted heads twice, because that is what you do when you are frightened.',
        ),
        N('Hiccup is flying straight for the burning ship where Toothless is chained.'),
        N('He is not flying away from danger. He is flying towards it, for someone else.'),
        N('Nobody told him to. Nobody could have stopped him.'),
      ],
      [
        ask(
          'sel',
          'the line between brave and reckless',
          3,
          [
            N(
              'Hiccup flies into danger to save a friend. Where is the line between brave and reckless?',
            ),
          ],
          [
            opt('It is brave when you have weighed the risk and decided it is worth it', [
              N('That’s a fair answer. Thinking first is what separates courage from rashness.'),
            ]),
            opt('It is reckless when you do not think at all', [
              N(
                'That’s a fair answer. Hiccup acts fast, but he has thought about Toothless for days.',
              ),
            ]),
            opt('It depends whether others are put at greater risk', [
              N(
                'That’s a fair answer. Risking yourself is different from risking people who did not choose it.',
              ),
            ]),
          ],
          'Thought about the difference between bravery and recklessness.',
          DECIDE,
        ),
      ],
    ),
    sc(
      'a19-16-chain',
      [
        N(
          'The lead ship is burning, and sinking at the stern. Toothless is still chained to its deck.',
        ),
        N(
          'Hiccup drops off the Nadder onto the deck and pulls at the chain with both hands. It doesn’t move.',
        ),
        N(
          'The deck tips. The ship slides back off the rocks into the sea, and takes Toothless and Hiccup with it.',
        ),
        N(
          'You run down to the water’s edge, but Stoick is already past you, in up to his chest, then under.',
        ),
        N('A long time passes. Too long.'),
        N(
          'Stoick comes up with Hiccup over one shoulder. A moment later Toothless bursts out of the sea, the chain snapped, and hauls himself onto the rocks.',
        ),
        ST('Hiccup. I was wrong. I’m sorry, son. I’m so sorry.', 'sad'),
        H('Me too, Dad.', 'soft'),
      ],
      [
        ask(
          'sel',
          'what makes an apology real',
          7,
          [N('Stoick says sorry. Which of these is the best kind of apology?')],
          [
            opt(
              '“I was wrong. I’m sorry.”',
              [N('Yes. A real apology names what was wrong and does not add an excuse.')],
              true,
            ),
            opt('“Sorry, but you made me do it.”', [
              N('The “but” takes the apology back. It puts the blame on the other person.'),
            ]),
            opt('“Sorry if you were upset.”', [
              N(
                'That treats the upset as the problem, not what was done. A real apology owns the action.',
              ),
            ]),
          ],
          'Talked about what makes an apology real: say what was wrong, and add no excuse.',
          RELATE,
        ),
      ],
    ),
    sc(
      'a19-16-complete',
      [
        ST('You don’t have to go up there.'),
        H('Yes, I do. He’s my dragon, and it was my rope.'),
        ST('Then go. And come back.', 'soft'),
        N(
          'Hiccup climbs into the saddle. Toothless looks round once at you, at the water’s edge, and then they go up into the smoke.',
        ),
        N('On the beach, nobody looks anywhere else.'),
      ],
      [
        notice(
          'science',
          'hot air rises, and carries smoke with it',
          3,
          [
            N('Hot air is lighter than cool air, so it rises. It carries smoke up with it.'),
            N(
              'That is why, in a smoky room, the clearest air is down low, and why people are taught to keep low and get out.',
            ),
          ],
          'Learned that hot air rises and carries smoke up, so the clearest air in a smoky room is near the floor.',
          '4-PS3-2',
        ),
      ],
    ),
  ],
  [gloss('duty', 'Something you must do because it is your responsibility.', 'a19-16-draw')],
);

// ================================================================== A19-17 The Fall
const Q17: EduQuest = quest(
  'a19-17',
  'The Fall',
  {
    'a19-17-s1': {
      goal: 'Watch from the beach as Hiccup leads it away.',
      hint: 'Stand on the beach with the others and look up.',
    },
    'a19-17-s2': {
      goal: 'Wait for the smoke to clear.',
      hint: 'There’s nothing to do but wait. Do it however you can.',
    },
    'a19-17-s3': {
      goal: 'Find them.',
      hint: 'Go into the burnt place where the smoke is thinning.',
    },
  },
  [
    sc(
      'a19-17-up',
      [
        N(
          'From the beach you watch Hiccup and Toothless climb, a black speck against the smoke, then against the cloud.',
        ),
        N('The great dragon spreads wings nobody knew it had, and heaves itself off the ground.'),
        N('Slowly, dreadfully, it follows them up.'),
        GB('What’s he doing? What’s the boy doing?', 'shock'),
        A('He’s leading it away from us. He’s taking it up where it can’t see.'),
        N(
          'Everyone on the beach is looking up, and nobody is breathing. Your Nubbin has both paws over its face, and one eye between them.',
        ),
        N('Toothless climbs about three hundred metres every minute. The cloud is eighteen hundred metres up.'),
        N('Up there, the black speck and the great shadow go into the cloud.'),
      ],
      [
        ask(
          'maths',
          'distance, speed and time: 1,800 ÷ 300',
          7,
          [
            N(
              'Toothless climbs 300 metres every minute, and the cloud is 1,800 metres up. How many minutes does he need to reach it?',
            ),
          ],
          [
            opt(
              '6 minutes',
              [
                N(
                  'Yes, because 1,800 ÷ 300 is the same as 18 ÷ 3 = 6. He climbs 300 m, six times.',
                ),
              ],
              true,
            ),
            opt('5 minutes', [
              N(
                'Five climbs of 300 m is only 1,500 m. We need 1,800 m: 18 hundreds ÷ 3 hundreds = 6.',
              ),
            ]),
            opt('60 minutes', [
              N('That is ten times too long. 1,800 ÷ 300 = 6, because 18 ÷ 3 = 6.'),
            ]),
          ],
          'Divided a distance by a speed to find the time: 1,800 m at 300 m a minute is 6 minutes.',
          '4.MD.A.2',
        ),
      ],
    ),
    sc(
      'a19-17-dive',
      [
        N(
          'For a long moment there is nothing but cloud. Then the whistle comes, very high and very fast, coming down.',
        ),
        N(
          'Toothless comes out of the cloud head first, falling like a stone thrown from a tower, with the great shape behind him.',
        ),
        N(
          'Down and down. At the last moment Toothless opens his wings and turns, and the great dragon can’t.',
        ),
        N(
          'From far along the beach you see it hit the ground, and the fire go up, and the smoke roll out over everything.',
        ),
        N(
          'Something black is in the fire: a tail fin, burning. Then the smoke closes, and you can’t see anything at all.',
        ),
        ST('Hiccup!', 'shock'),
      ],
      [
        notice(
          'science',
          'a sound gets louder as the thing making it comes closer',
          5,
          [
            N(
              'The whistle got louder and higher as Toothless dived. A sound gets louder as the thing making it comes closer.',
            ),
            N('That is how everyone on the beach knew he was coming, before they could see him.'),
          ],
          'Learned that a sound gets louder as the thing making it comes closer.',
          '4-PS3-2',
        ),
        ask(
          'sel',
          'what to do when you cannot help yet',
          5,
          [N('Hiccup is somewhere in the smoke, and the fire is too hot to go near. What is the wisest thing to do now?')],
          [
            opt(
              'Stay back, stay together, and be ready to help when it is safe',
              [N('Yes. Someone who is hurt cannot help anyone, so waiting safely is a way of helping.')],
              true,
            ),
            opt('Run into the fire', [
              N('No. The fire is too hot, and a second person in danger would help nobody.'),
            ]),
            opt('Look away and pretend it is not happening', [
              N('Looking away does not help. Staying close means you can act the moment it is safe.'),
            ]),
          ],
          'Talked about what to do when you cannot help yet: stay safe and together, and be ready.',
          DECIDE,
        ),
      ],
      [
        {
          id: 'run',
          label: 'Run towards the smoke.',
          then: [
            N(
              'You run. The heat stops you long before you get there, and Gobber’s hook catches your collar.',
            ),
            GB('No. Wait. Wait for it to clear.'),
          ],
        },
        {
          id: 'wait',
          label: 'Hold your Nubbin and wait.',
          then: [
            N(
              'You pick up your Nubbin and hold it, and wait. It is the hardest thing you have done on Berk.',
            ),
          ],
        },
        {
          id: 'stoick',
          label: 'Go with Stoick.',
          then: [
            N(
              'You go after Stoick into the thinning smoke, keeping his broad back in front of you, because he knows where he is going.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a19-17-shore',
      [
        N(
          'When the smoke thins, it is a burnt place of black rock, and in the middle of it, curled up tight, a black dragon.',
        ),
        N('Toothless doesn’t move. His tail fin, the new one, is burned away to the rods.'),
        ST('Son? Hiccup…', 'sad'),
        N('Stoick kneels. Toothless opens one green eye, and then, slowly, opens his wings.'),
        N(
          'Inside, wrapped in them as if in a cloak, is Hiccup. His eyes are shut, and his chest goes up, and down.',
        ),
        ST('He’s alive. He’s alive!', 'shock'),
        N(
          'Stoick puts his great hand on Toothless’s head, the way you would thank a person. He doesn’t say anything; he doesn’t need to.',
        ),
      ],
      [
        ask(
          'literacy',
          'show, don’t tell: feelings shown through actions',
          6,
          [
            N(
              'Stoick says nothing to Toothless, but puts a hand on his head. How does the writer show his feeling?',
            ),
          ],
          [
            opt(
              'Through a gesture, instead of telling us in words',
              [
                N(
                  'Yes. “Show, don’t tell” means letting actions carry the feeling, and the hand on the head says “thank you” more than a speech.',
                ),
              ],
              true,
            ),
            opt('By having Stoick give a long speech', [
              N('He gives no speech. That is the point: the writer lets a gesture speak.'),
            ]),
            opt('By telling us he feels nothing', [
              N('He feels a great deal. The gesture shows it, without a word.'),
            ]),
          ],
          'Explained how a writer shows a feeling through a gesture.',
          'RL.4.3',
        ),
      ],
    ),
    sc(
      'a19-17-complete',
      [
        N(
          'They carry Hiccup to the one ship that still floats. Toothless won’t be parted from him, so they carry Toothless too.',
        ),
        N('All the way home, the dragon lies with his chin on the edge of Hiccup’s blanket.'),
        N('Your Nubbin sits at the other end of the blanket, and keeps watch too.'),
        N(
          'Keeping watch is something anyone can do for someone who is hurt: stay near, stay quiet, and be there when they wake.',
        ),
        N('Nobody asks Toothless to take a turn. He never stops.'),
      ],
      [
        ask(
          'sel',
          'what keeping watch says to someone who is hurt',
          3,
          [N('What does keeping watch say to someone who is hurt?')],
          [
            opt(
              '“You are not alone”',
              [
                N(
                  'Yes. Even when a person is asleep, being watched over is a kind of care that lasts through the night.',
                ),
              ],
              true,
            ),
            opt('“Hurry up and get better”', [
              N(
                'That would be asking them to do something. Keeping watch asks nothing; it simply says “I’m here”.',
              ),
            ]),
            opt('“I am bored”', [
              N('Keeping watch can be slow, but it is chosen out of love, not boredom.'),
            ]),
          ],
          'Talked about how staying near someone who is hurt shows care.',
          RELATE,
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A19-18 Twelve Days North
const Q18: EduQuest = quest(
  'a19-18',
  'Twelve Days North',
  {
    'a19-18-s1': {
      goal: 'Be there when Hiccup wakes up.',
      hint: 'Wait by the fire in Stoick’s house.',
    },
    'a19-18-s2': {
      goal: 'Walk out into the village with Hiccup.',
      hint: 'Go out through the door and down into the square.',
    },
    'a19-18-s3': {
      goal: 'Watch Hiccup and Toothless fly with their new tail and new step.',
      hint: 'Stand in the square with everyone else and look up.',
    },
  },
  [
    sc(
      'a19-18-wake',
      [
        N(
          'Hiccup wakes in his own bed, in his father’s house, with a great black dragon sitting on top of him.',
        ),
        H('Toothless? What are you… what are you doing in my house?', 'shock'),
        N(
          'Toothless bounces off him, up into the rafters, down again, and up, as pleased as a dog at a door.',
        ),
        N('You are sitting by the fire. Hiccup sees you, and smiles, and goes to get up.'),
        N(
          'He stops and looks down. His left foot is gone, and in its place is a new one of iron and wood, neat and strong.',
        ),
        H('Oh.', 'think'),
        N(
          'He looks at it for a long time, and nobody hurries him. Toothless puts his chin down on the bed beside it.',
        ),
        GB(
          'My work, that. Well, mine and yours. I used your tail-fin drawings for the spring in it.',
        ),
        H('It’s good. It’s really good, Gobber.', 'soft'),
      ],
      [
        notice(
          'health',
          'prosthetic legs and feet let people walk, run and dance, and are nothing to hide',
          6,
          [
            N(
              'Many people use a made leg, foot, arm or hand. These are called prostheses, and a specialist fits each one to its owner.',
            ),
            N(
              'With them, people walk, run, climb, swim and dance. Some Paralympic sprinters race on curved running blades.',
            ),
            N(
              'A prosthesis is a tool, like a good pair of boots. There is nothing to hide about it.',
            ),
          ],
          'Learned that prostheses let people walk, run, climb and dance, that Paralympic athletes use them, and that they are nothing to hide.',
          SOCIAL,
        ),
        ask(
          'science',
          'a spring stores energy and gives it back',
          7,
          [N('Gobber put a spring in Hiccup’s new foot. What does a spring do?')],
          [
            opt(
              'It stores energy when it is squashed and gives it back as it springs out',
              [
                N(
                  'Yes. Squash a spring and it stores energy; let go and it pushes back, and that push helps a step along.',
                ),
              ],
              true,
            ),
            opt('It makes things heavier', [
              N('A spring has no weight to add. Its job is storing and returning energy.'),
            ]),
            opt('It only makes a noise', [
              N('Springs can creak, but their real job is to store energy and give it back.'),
            ]),
          ],
          'Learned that a spring stores energy when squashed and returns it as it springs out.',
          '4-PS3-4',
        ),
      ],
      [
        {
          id: 'how',
          label: 'Ask how it feels.',
          then: [
            H(
              'Strange. Like the floor is a bit further away on one side. I’ll get used to it. He did.',
            ),
            N('He nods at Toothless’s tail, where the burnt rods of the old fin still show.'),
          ],
        },
        {
          id: 'arm',
          label: 'Hold out your arm.',
          then: [
            N('You hold out your arm. He takes it, and stands, and finds his balance on his own.'),
            H('Thanks. I won’t always need it. But thanks.'),
          ],
        },
        {
          id: 'wait',
          label: 'Say nothing, and wait.',
          then: [
            N('You wait. He tries a step, and another, and then he is grinning.'),
            H('Well. Toothless and me. Matching now.', 'happy'),
          ],
        },
      ],
    ),
    sc(
      'a19-18-wake-done',
      [
        N(
          'He walks to the door with Toothless pressing against his side: step and clunk, step and clunk.',
        ),
        H('Come on. I want to see what’s outside.'),
        N('Step and clunk. The two sounds have a rhythm, like a slow drum.'),
        N(
          'Your Nubbin begins to walk in time with it, and then Toothless does too, with his tail.',
        ),
        N(
          'Words like “clunk” sound like what they mean. They are called onomatopoeic words, and writers love them.',
        ),
      ],
      [
        ask(
          'literacy',
          'onomatopoeia: words that sound like their meaning',
          4,
          [N('Which of these words sounds like what it means?')],
          [
            opt(
              'Clunk',
              [
                N(
                  'Yes, “clunk” sounds like a heavy, short knock. Splash, buzz and sizzle work the same way.',
                ),
              ],
              true,
            ),
            opt('Table', [
              N(
                '“Table” is just a name for a thing. It does not sound like anything a table does.',
              ),
            ]),
            opt('Tomorrow', [N('“Tomorrow” names a time. It does not sound like what it means.')]),
          ],
          'Identified an onomatopoeic word: one that sounds like what it means.',
          'L.4.5',
        ),
      ],
    ),
    sc(
      'a19-18-village',
      [
        N('Hiccup opens the door. There are dragons everywhere.'),
        N(
          'A Nadder on a roof. A Gronckle asleep in the square, with three children asleep on her.',
        ),
        N(
          'A Zippleback is steering a fishing boat into the harbour, badly, one head arguing with the other.',
        ),
        N(
          'Nobody is fighting. Somebody is building a long trough for fish, and somebody else a stable with a very tall door.',
        ),
        ST('Well? It’s your doing. All of it. Do you like it?', 'happy'),
        A('He’s up! Everyone, he’s awake!', 'happy'),
        N(
          'Astrid punches him on the arm, kisses him on the cheek, quickly, and then punches him again for good measure.',
        ),
        FL('Hiccup! Hiccup, the Gronckle lets me brush her teeth now!', 'happy'),
        N(
          'Hiccup looks round at all of it, with his father’s hand on his shoulder and his dragon at his side.',
        ),
      ],
      [
        notice(
          'social-studies',
          'Viking-age families kept livestock, and Icelandic horses descend from Norse horses',
          3,
          [
            N(
              'Viking-age families kept sheep, cows, goats and horses, and built barns, byres and stables for them.',
            ),
            N(
              'The Icelandic horse, a small, sturdy breed still found today, descends from horses the Norse settlers brought over the sea.',
            ),
          ],
          'Learned that Viking-age families kept livestock and that Icelandic horses descend from horses the Norse settlers brought.',
          'D2.His.2.3-5',
        ),
      ],
    ),
    sc(
      'a19-18-village-done',
      [
        N(
          'Toothless bounds from one end of the square to the other, greeting everyone. He greets your Nubbin twice.',
        ),
        N('The square is about forty metres across, and he crosses it five times in a minute.'),
        N('Your Nubbin counts. It loses count at three, and starts again.'),
        N('Hiccup laughs so much he has to lean on his father.'),
        N('Everyone in the square has a dragon to talk to, or a dragon to avoid.'),
      ],
      [
        ask(
          'maths',
          'multiply: 5 × 40',
          1,
          [N('Toothless crosses a 40-metre square five times. How far does he run?')],
          [
            opt('200 metres', [N('Yes! 5 × 40: 5 × 4 = 20, so 5 × 40 = 200.')], true),
            opt('45 metres', [
              N('That is 40 + 5. He crosses the square five times, so we need five lots of 40.'),
            ]),
            opt('400 metres', [
              N('Check again: 5 × 4 = 20, so 5 × 40 = 200. That would be ten crossings.'),
            ]),
          ],
          'Multiplied 5 × 40 to find 200 metres.',
          '3.OA.A.3',
        ),
      ],
    ),
    sc(
      'a19-18-flight',
      [
        N(
          'Gobber has made Toothless a new tail fin, stiffer than the last, with a Nadder scale stitched to its tip for luck.',
        ),
        H('New tail. New foot. Let’s see if they get on.'),
        N(
          'Hiccup sets his new foot in the pedal. It fits the stirrup as if it was made for it, because it was.',
        ),
        N(
          'Toothless crouches, and springs, and they are up: over the square, over the roofs, over the cliffs and the sea.',
        ),
        N(
          'The whole village comes out to watch. Dragons go up after them, one after another, until the sky over Berk is full.',
        ),
        N(
          'Up there, Hiccup lets go with both hands and spreads his arms wide, and Toothless rolls once, slowly, just for him.',
        ),
      ],
      [
        notice(
          'art',
          'Norse craftspeople decorated useful things with animals and knotwork',
          1,
          [
            N(
              'Norse craftspeople decorated tools, ships and jewellery with swirling animals and knotwork patterns.',
            ),
            N(
              'A scale stitched on for luck belongs to the same tradition: making a useful thing beautiful, and a little bit lucky.',
            ),
          ],
          'Learned that Norse craftspeople decorated everyday objects with animal designs and knotwork.',
          'D2.His.2.3-5',
        ),
      ],
    ),
    sc(
      'a19-18-complete',
      [
        N(
          'Late in the afternoon, Hiccup and Toothless land on the cliff top, where you are sitting with your Nubbin.',
        ),
        N(
          'Hiccup holds out a saddle: a tiny one, of soft leather, with a tail-fin badge stitched on the side. It is exactly your Nubbin’s size.',
        ),
        H(
          'Gobber kept asking what the saddle was for, that night at the forge. I thought: why not one for your Nubbin, too.',
        ),
        N('Some things come back if you wait. Some things you have to wait for twice.', 'soft'),
        N(
          'Toothless pads over. He drops a whole fish, a good silver one, at your Nubbin’s feet, and sits back, and waits.',
        ),
        N(
          'Your Nubbin looks at the fish, and at Toothless, and at you. Then it puts both paws on the fish, very proud, and doesn’t eat it.',
        ),
        N(
          'The sea goes still and grey, and smudges under your hand. You are back in the Grove, with a small saddle on your knee and a smell of fish.',
        ),
      ],
      [
        ask(
          'sel',
          'what helps a frightened creature learn to trust',
          5,
          [N('Toothless took a long time to trust Hiccup. What helped him feel safe?')],
          [
            opt(
              'Hiccup was patient and gentle, and let Toothless come to him',
              [N('Yes. Trust grows when nobody grabs or hurries.')],
              true,
            ),
            opt('Hiccup gave orders', [N('Orders do not build trust. Patience and gentleness do.')]),
            opt('Hiccup gave up', [N('He never gave up. He waited, and that is different.')]),
          ],
          'Talked about what helps a frightened creature trust: patience and gentleness, not orders or hurrying.',
          RELATE,
        ),
      ],
    ),
  ],
  [
    gloss(
      'prosthesis',
      'A made limb, such as a leg or foot, that a person wears and uses.',
      'a19-18-wake',
    ),
    gloss(
      'onomatopoeic',
      'Describes a word that sounds like the thing it names, such as “splash”.',
      'a19-18-wake-done',
    ),
  ],
);

// ================================================================== variants
/** Reader versions of every scene in A19_VARIANTS. */
export const EDU_A19_READER_VARIANTS: EduScene[] = [
  // ------------------------------------------------ A19-8, step 2: sableFirst = slow
  sc(
    'a19-08-hand-slow',
    [
      N(
        'You know this moment. You knew it before you came to Berk: a dark lawn, a grey shape, fruit on the grass.',
      ),
      N(
        'So you sit very still at the edge of the sand, the way you sat that first night with Sable, and you don’t say a word.',
      ),
      N(
        'Hiccup comes out of the last line and finds Toothless right in front of him, closer than he has ever been.',
      ),
      N('Hiccup lifts his hand, slowly. Toothless pulls back his lips.'),
      N('Hiccup stops. He doesn’t pull his hand back, and he doesn’t push it forward either.'),
      N(
        'Then he closes his eyes, and turns his face away, and holds his hand out in the air between them, open.',
      ),
      N('Nobody moves. A drip falls from the rock wall into the lake.'),
      N('Then Toothless leans in, and pushes his nose into Hiccup’s palm.'),
      H('…Oh.', 'soft'),
      N(
        'You didn’t teach him that; he found his own way to it. You just know it when you see it.',
        'soft',
      ),
    ],
    [
      notice(
        'science',
        'animals notice movement first, so a still body reads as calm',
        5,
        [
          N(
            'Many animals notice movement before anything else. Their eyes are tuned to spot a twitch in the grass.',
          ),
          N(
            'A body that stays still gives them nothing to be afraid of. Stillness is easy for an animal to read as calm.',
          ),
        ],
        'Learned that many animals notice movement first, so a still body reads as calm.',
        '4-LS1-2',
      ),
      ask(
        'sel',
        'whether it gets easier to wait the second time',
        8,
        [
          N(
            'You waited for Sable once, and now you wait for Toothless. Does waiting get easier the second time?',
          ),
        ],
        [
          opt('Yes, because you know it can work', [
            N(
              'That’s a fair answer. Having seen patience pay off once makes the second wait lighter.',
            ),
          ]),
          opt('No, each wait is new and uncertain', [
            N('That’s a fair answer. Every creature is different, and there is never a guarantee.'),
          ]),
          opt('A little of both', [
            N('That’s a fair answer. Experience helps, but the heart still has to do the waiting.'),
          ]),
        ],
        'Thought about whether patience gets easier with experience.',
        MANAGE,
      ),
    ],
  ),
  // ------------------------------------------------ A19-8, step 2: sableFirst = grab
  sc(
    'a19-08-hand-grab',
    [
      N(
        'You know this moment from the wrong side: a dark lawn, a grey wing in your hand, and then nothing but cold fingers.',
      ),
      N(
        'Hiccup comes out of the last line and finds Toothless right in front of him, closer than he has ever been.',
      ),
      N('Hiccup lifts his hand, slowly. Toothless pulls back his lips.'),
      N('Hiccup stops. He doesn’t pull his hand back, and he doesn’t push it forward either.'),
      N(
        'Then he closes his eyes, and turns his face away, and holds his hand out in the air between them, open.',
      ),
      N(
        'Your Nubbin starts forward across the sand towards them, eager. You put a hand out: not to grab it, just to slow it.',
      ),
      N('It stops, and sits down by your hand, and waits with you.'),
      N('Nobody moves. A drip falls from the rock wall into the lake.'),
      N('Then Toothless leans in, and pushes his nose into Hiccup’s palm.'),
      H('…Oh.', 'soft'),
    ],
    [
      notice(
        'science',
        'a grabbed animal may feel trapped, and trapped animals may bolt or bite',
        4,
        [
          N(
            'A frightened animal that is grabbed can feel trapped. Trapped animals may bolt, or bite in panic.',
          ),
          N(
            'A slow hand, or no hand at all, lets the animal keep its own way out, which is why it feels safe enough to stay.',
          ),
        ],
        'Learned that grabbing a frightened animal can make it feel trapped, and that a slow, open approach feels safer.',
      ),
      ask(
        'sel',
        'whether one mistake teaches enough',
        9,
        [
          N(
            'You remember grabbing Sable, and this time you slowed your Nubbin gently. Is it enough to learn from a mistake once?',
          ),
        ],
        [
          opt('Yes, if you really change what you do', [
            N('That’s a fair answer. A mistake taught you something, and you used it.'),
          ]),
          opt('No, we have to keep choosing differently every time', [
            N('That’s a fair answer. Habits need practice, and the old reflex is always nearby.'),
          ]),
          opt('It depends how big the mistake was', [
            N('That’s a fair answer. Some lessons stick at once, and others come back round.'),
          ]),
        ],
        'Thought about whether learning from a mistake once is enough.',
        SELF,
      ),
    ],
  ),
  // ------------------------------------------------ A19-8, step 3: a19-first = ran
  sc(
    'a19-08-near-ran',
    [
      N(
        'Toothless takes his nose out of Hiccup’s hand and looks past him, at you, and at your Nubbin.',
      ),
      H('He’s looking at you two. Stay still. Let him decide.'),
      N(
        'Toothless takes one step across the sand. Your Nubbin is behind your legs before he takes another.',
      ),
      N(
        'In the woods you scooped it up and ran, and it hasn’t forgotten the running. It is holding your trouser leg in both paws.',
      ),
      N(
        'Toothless stops, and his ears go flat. He watches your Nubbin for a long moment, then lies down right where he is.',
      ),
      H('That’s all right. He’s just saying: not yet. He said that to me for days.', 'soft'),
    ],
    [
      ask(
        'science',
        'giving a wary animal space',
        4,
        [
          N(
            'Toothless lies down instead of coming nearer. What is the kind thing to do when an animal keeps its distance?',
          ),
        ],
        [
          opt(
            'Give it space and let it come in its own time',
            [
              N(
                'Yes, every animal has a distance it needs to feel safe. Letting it choose to come closer keeps it calm.',
              ),
            ],
            true,
          ),
          opt('Move closer to show you are friendly', [
            N(
              'Moving towards a wary animal can feel like a threat, however friendly we feel. Space works better.',
            ),
          ]),
          opt('Chase it so it learns', [
            N('Chasing frightens animals and teaches them to avoid us. Patience teaches trust.'),
          ]),
        ],
        'Learned that a wary animal needs space and time to approach in its own way.',
      ),
    ],
  ),
  // ------------------------------------------------ A19-11, step 3: a19-first = ran
  sc(
    'a19-11-turn-ran',
    [
      H('One more round, before the light goes. Small passengers only.', 'happy'),
      N(
        'He looks at your Nubbin. Toothless looks at it too, and walks over, and sniffs it, long and careful.',
      ),
      N(
        'Your Nubbin goes stiff all over. It is ready to run, the way you ran with it in the woods.',
      ),
      N(
        'Toothless steps back and sits down. He watches your Nubbin from the ground, and doesn’t lower his shoulder.',
      ),
      H('Not yet, then. Sorry. He’s like that. He decides.', 'sad'),
      N(
        'So you watch them go round the cove without you, low over the water in the very last of the sun.',
      ),
      N('Your Nubbin watches from your lap. It watches Toothless the whole way round.'),
    ],
    [
      ask(
        'science',
        'shadows are longest when the sun is low',
        5,
        [
          N(
            'The sun is nearly down, and the shadows on the sand have grown very long. Why are shadows longest at sunrise and sunset?',
          ),
        ],
        [
          opt(
            'The sun is low, so its light arrives at a shallow angle',
            [N('Yes. A low sun throws long shadows, and a high noon sun throws short ones.')],
            true,
          ),
          opt('The sun is hotter then', [
            N('The heat does not change the length of a shadow. The angle of the light does.'),
          ]),
          opt('The sea stretches them', [
            N('The sea does not stretch shadows. A low sun’s shallow angle does.'),
          ]),
        ],
        'Learned that shadows are longest when the sun is low in the sky.',
        '5-ESS1-2',
      ),
    ],
  ),
  // ------------------------------------------------ A19-18, step 2 done: a19-first = ran
  sc(
    'a19-18-village-done-ran',
    [
      N(
        'Toothless bounds from one end of the square to the other, greeting everyone. He goes the long way round you and your Nubbin.',
      ),
      N(
        'He isn’t unfriendly. He just keeps a fence of air between you, the way he did in the cove.',
      ),
      N('Your Nubbin watches him go by, and does not follow. It is learning, too.'),
      N('Some friendships need more time than others.'),
      N(
        'The square is full of dragons greeting people, and one dragon keeping a careful distance.',
      ),
    ],
    [
      notice(
        'sel',
        'some friends need more time before they feel safe',
        1,
        [
          N(
            'Some friends need more time before they feel safe. That is not rejection, just their way of staying careful.',
          ),
          N(
            'You can’t speed it up. You can only make it easier to come closer, and not take it personally.',
          ),
        ],
        'Learned that some friends need extra time to trust, and that this is not rejection.',
        SOCIAL,
      ),
    ],
  ),
  // ------------------------------------------------ A19-18, complete: a19-first = ran (sableFirst set)
  sc(
    'a19-18-complete-ran',
    [
      N(
        'Late in the afternoon, Hiccup and Toothless land on the cliff top, where you are sitting with your Nubbin.',
      ),
      N(
        'Hiccup holds out a saddle: a tiny one, of soft leather, with a tail-fin badge stitched on the side. It is exactly your Nubbin’s size.',
      ),
      H(
        'Gobber kept asking what the saddle was for, that night at the forge. I thought: why not one for your Nubbin, too.',
      ),
      H('He’s still not sure about you two. That’s all right. You can have it anyway.', 'soft'),
      N(
        'Hiccup goes down to supper. Toothless stays on the cliff, a long way off, looking at the sea.',
      ),
      N(
        'You stay where you are, and you don’t call him or look at him. The sun goes down, and nothing happens for a long time.',
      ),
      N('Some things come back if you wait. Some things you have to wait for twice.', 'soft'),
      N(
        'Then there is a soft thump in the grass beside you. Toothless has come, and sat down close enough to touch.',
      ),
      N('Your Nubbin leans against his side. He lets it, and you all watch the sea.', 'soft'),
      N(
        'The sea goes still and grey, and smudges under your hand. You are back in the Grove, with a small saddle on your knee and the first stars out.',
      ),
    ],
    [
      ask(
        'sel',
        'what helps a frightened creature learn to trust',
        8,
        [N('Toothless took a long time to trust Hiccup. What helped him feel safe?')],
        [
          opt(
            'Hiccup was patient and gentle, and let Toothless come to him',
            [N('Yes. Trust grows when nobody grabs or hurries.')],
            true,
          ),
          opt('Hiccup gave orders', [N('Orders do not build trust. Patience and gentleness do.')]),
          opt('Hiccup gave up', [N('He never gave up. He waited, and that is different.')]),
        ],
        'Talked about what helps a frightened creature trust: patience and gentleness, not orders or hurrying.',
        RELATE,
      ),
    ],
  ),
  // ------------------------------------------------ A19-18, complete: sableFirst unset
  sc(
    'a19-18-complete-unset',
    [
      N(
        'Late in the afternoon, Hiccup and Toothless land on the cliff top, where you are sitting with your Nubbin.',
      ),
      N(
        'Hiccup holds out a saddle: a tiny one, of soft leather, with a tail-fin badge stitched on the side. It is exactly your Nubbin’s size.',
      ),
      H(
        'Gobber kept asking what the saddle was for, that night at the forge. I thought: why not one for your Nubbin, too.',
      ),
      N(
        'Toothless pads over. He drops a whole fish, a good silver one, at your Nubbin’s feet, and sits back, and waits.',
      ),
      N(
        'Your Nubbin looks at the fish, and at Toothless, and at you. Then it puts both paws on the fish, very proud, and doesn’t eat it.',
      ),
      N(
        'The sea goes still and grey, and smudges under your hand. You are back in the Grove, with a small saddle on your knee and a smell of fish.',
      ),
    ],
    [
      ask(
        'sel',
        'what helps a frightened creature learn to trust',
        4,
        [N('Toothless took a long time to trust Hiccup. What helped him feel safe?')],
        [
          opt(
            'Hiccup was patient and gentle, and let Toothless come to him',
            [N('Yes. Trust grows when nobody grabs or hurries.')],
            true,
          ),
          opt('Hiccup gave orders', [N('Orders do not build trust. Patience and gentleness do.')]),
          opt('Hiccup gave up', [N('He never gave up. He waited, and that is different.')]),
        ],
        'Talked about what helps a frightened creature trust: patience and gentleness, not orders or hurrying.',
        RELATE,
      ),
    ],
  ),
  sc(
    'a19-18-complete-ran-unset',
    [
      N(
        'Late in the afternoon, Hiccup and Toothless land on the cliff top, where you are sitting with your Nubbin.',
      ),
      N(
        'Hiccup holds out a saddle: a tiny one, of soft leather, with a tail-fin badge stitched on the side. It is exactly your Nubbin’s size.',
      ),
      H(
        'Gobber kept asking what the saddle was for, that night at the forge. I thought: why not one for your Nubbin, too.',
      ),
      H('He’s still not sure about you two. That’s all right. You can have it anyway.', 'soft'),
      N(
        'Hiccup goes down to supper. Toothless stays on the cliff, a long way off, looking at the sea.',
      ),
      N(
        'You stay where you are, and you don’t call him or look at him. The sun goes down, and nothing happens for a long time.',
      ),
      N(
        'Then there is a soft thump in the grass beside you. Toothless has come, and sat down close enough to touch.',
      ),
      N('Your Nubbin leans against his side. He lets it, and you all watch the sea.', 'soft'),
      N(
        'The sea goes still and grey, and smudges under your hand. You are back in the Grove, with a small saddle on your knee and the first stars out.',
      ),
    ],
    [
      ask(
        'sel',
        'what helps a frightened creature learn to trust',
        7,
        [N('Toothless took a long time to trust Hiccup. What helped him feel safe?')],
        [
          opt(
            'Hiccup was patient and gentle, and let Toothless come to him',
            [N('Yes. Trust grows when nobody grabs or hurries.')],
            true,
          ),
          opt('Hiccup gave orders', [N('Orders do not build trust. Patience and gentleness do.')]),
          opt('Hiccup gave up', [N('He never gave up. He waited, and that is different.')]),
        ],
        'Talked about what helps a frightened creature trust: patience and gentleness, not orders or hurrying.',
        RELATE,
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A19_READER: EduQuest[] = [
  Q01,
  Q02,
  Q03,
  Q04,
  Q05,
  Q06,
  Q07,
  Q08,
  Q09,
  Q10,
  Q11,
  Q12,
  Q13,
  Q14,
  Q15,
  Q16,
  Q17,
  Q18,
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = ['edu:hum:feel:throat'];
