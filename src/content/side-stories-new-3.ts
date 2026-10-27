/**
 * New side stories for "Hazel’s Grove" (briefs/new-stories.md), part 3:
 *
 *   S13 The Mill Cellar        ch7 → before ch12   CHANGES THE CAMPAIGN
 *       millLetter = kept | burned | grave, s13Done (local: s13-rats, s13-given)
 *   S19 Cinder’s Last Light    ch11 → before ch12’s final choice, only if the stone was unmade
 *       CHANGES THE CAMPAIGN: cinder = forgiven | remembered, s19Done (local: s19-with = moss | sable | alone)
 *       New variant ids: s19-warmth-alone, s19-climb-alone, s19-hollow-alone, s19-question-alone, s19-fade-alone
 *   S22 The Climb              after ch8 → ch11    for fun
 *       s22Done (local: s22-scree, s22-chimney)
 *
 * Canon is the story bible. Audience 'all'. Every word is original (the only verse used is the
 * bible’s own Cinder’s rhyme, as written), so no childLines are needed.
 *
 * Timing convention (as in the other side-story files): a step’s `scene` plays the moment the
 * previous step’s `check` is met (straight after the previous `done`); its `done` scene plays when
 * its own `check` is met. Exceptions are spelled out in each quest’s `notes`.
 *
 * Branching: Scene and Choice have no condition fields, so every branch is a separate scene in
 * SIDE_STORIES_NEW_3_VARIANTS. Each quest’s `notes` says which variant replaces which scene, and
 * when. The epilogue scenes (end-epi-mill-*, end-epi-cinder-*) also live there; see the notes for
 * where they sit in the ending order.
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
const M = say('moss');
const C = say('corvin');
const MA = say('marina');
const NO = say('nova');

// ---------------------------------------------------------------- new speakers
const TOBIN: Speaker = {
  id: 'tobin',
  name: 'Old Tobin',
  kind: 'other',
  basedOn: 'Diablo’s old storyteller who knows the lore (theme only; an original character)',
};
const ALDOUS: Speaker = { id: 'aldous', name: 'Aldous Vale', kind: 'other' };
const CINDER: Speaker = {
  id: 'cinder',
  name: 'Cinder',
  kind: 'nubbin',
  basedOn: 'Warcraft’s fallen guardian who spent his long end making amends (theme only)',
};
const WORRY: Speaker = {
  id: 'worry',
  name: 'Nova’s Worry',
  kind: 'other',
  basedOn: 'Celeste: climbing with your own anxiety as a companion (theme only; an original character)',
};

const T = say('tobin');
const AL = say('aldous');
const CI = say('cinder');
const WO = say('worry');

// ================================================================== S13 shared pieces
/** Aldous Vale’s unsent letter to his son. Read in s13-letter (and s13-letter-nomoss). */
const S13_LETTER: Line[] = [
  N('The paper is good paper, the kind you’d buy for something that mattered. You unfold it.'),
  AL('Corvin.'),
  AL('I have started this nine times. The other eight went in the stove. You’d say that was waste. You’d be right. I taught you that.'),
  AL('They say in the valley you did a wrong thing at the old woman’s Grove, and went in the night. I don’t know what. I know how.'),
  AL('Quickly. In the dark. Without once sitting down to think. I know whose hands those were. They were mine first.'),
  N('…'),
  AL('I can tell you the weight of every sack this mill ground the year you were born. I can’t tell you what you laughed at.'),
  AL('Your mother used to sit by the race of an evening with her feet in the water. I called it idling.'),
  AL('I would give the mill to sit there once with her now.'),
  AL('I won’t say sorry. I don’t know how, and you’d hear it as one more order. You always heard me that way. I made sure of it.'),
  N('…'),
  AL('I’ve stopped the wheel. It’s very quiet. I think you’d hate it. I think you’d get used to it.'),
  AL('If you ever stop, stop here. You could sit as long as you liked. Nobody would count.'),
  AL('Your father.'),
  N('…'),
  T('“Nobody would count.” He counted everything. His own boy’s hours, in a book. And then that.', 'sad'),
  T('It isn’t mine to decide. It never was. I only held the door shut.', 'soft'),
];

const S13_KEEP: Choice = {
  id: 'kept',
  label: 'Keep it for Corvin. Give it to him when he can feel again.',
  set: { millLetter: 'kept' },
  then: [
    N('You fold it along its old folds and put it inside your coat, next to Hazel’s notebook.'),
    T('When he can feel again. Yes. Cold hands can’t hold a thing like that. It would go straight through them.', 'think'),
    T('You’ll know when. Your grandmother always knew when. It was infuriating.', 'soft'),
  ],
};
const S13_BURN: Choice = {
  id: 'burned',
  label: 'Burn it. Some things should end with the person.',
  set: { millLetter: 'burned' },
  then: [
    T('…That’s a real answer. I’ve thought it myself, most winters.', 'think'),
    T('He wrote nine and burned eight. You’d only be finishing what he started.', 'soft'),
  ],
};
const S13_GRAVE: Choice = {
  id: 'grave',
  label: 'Read it to Moss, and leave it on Aldous’s grave.',
  set: { millLetter: 'grave' },
  then: [
    T('Read to the old one, and left with the man. Yes.', 'think'),
    T('Nobody ever read Aldous anything. He hadn’t the time to listen. He has now.', 'soft'),
  ],
};
const S13_GRAVE_NOMOSS: Choice = {
  id: 'grave',
  label: 'Read it aloud at Aldous’s grave, and leave it there.',
  set: { millLetter: 'grave' },
  then: [
    T('Read aloud, and left with the man. Yes.', 'think'),
    T('Nobody ever read Aldous anything. He hadn’t the time to listen. He has now.', 'soft'),
  ],
};

const S13_GRAVE_START: Line[] = [
  N('Aldous Vale is buried under the alders by the mill race, where his wife used to sit with her feet in the water.'),
  N('The race is running high and brown. An alder drops a yellow leaf on the stone, and then another, as if it’s keeping count.'),
];
const S13_GRAVE_END: Line[] = [
  N('You weigh the letter down on the grave with a flat stone from the race.'),
  N('Tobin takes his hat off, and then can’t remember why, and puts it back on.'),
];

// ================================================================== S19 shared pieces
const S19_HOLLOW_START: Line[] = [
  N('Near the top, the rock leans out over the snow like a hand held over a cup. Under it is a hollow, out of the wind.'),
  N('There is no snow in the hollow. There hasn’t been, you think, for a very long time.'),
  N('The bare rock is dry, and faintly warm.'),
  N('In the middle of it, on a flat stone, is a light. Red. Smaller than a fingernail. Almost nothing.'),
  MA('I’ll be on the lip. Shout if you want the rope.', 'soft'),
  N('Marina goes back up to the lip without being asked, turns her back, and looks at the view very hard.'),
];

const S19_FIRST_WORDS: Line[] = [
  N('After a long time, the light gets a little bigger. Not brighter.'),
  N('Bigger, the way a coal does when you breathe on it.'),
  N('A voice comes out of it, so small that the wind nearly has it.'),
  CI('Are they safe?', 'soft'),
  N('…'),
];

const S19_UNDERSTANDS: Line[] = [
  N('The light is quiet for a long time. You watch it understand. It takes the whole of her.'),
  CI('…Well.', 'soft'),
  CI('Well is better. Isn’t it. I didn’t know there was a better.', 'sad'),
];

const S19_HER_SIDE: Line[] = [
  CI('I loved them. I want somebody to know that. Not as an excuse. Just so it’s known.'),
  N('…'),
  CI('It was so cold. I could hear every one of them in the grass. I couldn’t carry them all. So I made a way to carry them all.'),
  CI('I was so frightened. I held them so tight.', 'sad'),
  CI('And they were so quiet, after. I told myself it was resting.'),
];

const S19_ASKS: Line[] = [
  N('Then the light turns, very slightly, towards you.'),
  CI('You’re the Keeper.'),
];
const S19_THE_QUESTION = CI('Am I forgiven? By the ones who have to live with it?', 'soft');

const s19Choices = (forgivenExtra: Line[], rememberedAsk: Line, rememberedExtra: Line[]): Choice[] => [
  {
    id: 'forgiven',
    label: '“You’re forgiven.”',
    set: { cinder: 'forgiven' },
    then: [
      Y('You’re forgiven.'),
      N('The light says nothing for a while. It goes the colour of a hearth when the door is shut and the kettle is on.'),
      CI('Oh.', 'soft'),
      CI('I didn’t know it would be so light. I thought being forgiven would be heavy. I thought I’d have to carry it.', 'soft'),
      ...forgivenExtra,
    ],
  },
  {
    id: 'remembered',
    label: '“It isn’t mine to forgive. But you’re remembered.”',
    set: { cinder: 'remembered' },
    then: [
      Y('It isn’t mine to forgive. But you’re remembered.'),
      N('The light holds very still.'),
      CI('Remembered.', 'think'),
      CI('That’s more than I asked for. It’s what I should have asked for.', 'soft'),
      rememberedAsk,
      Y('All of it.'),
      ...rememberedExtra,
    ],
  },
];

const S19_CHOICES_MOSS = s19Choices(
  [M('No. That’s the other thing about it. This one you just put down.', 'soft')],
  CI('Not the rhyme. Me. Will you tell them the rest? That I loved them?', 'soft'),
  [M('We are made of being remembered. I used to say that to her. She used to roll her eyes.', 'soft')],
);
const S19_CHOICES_SABLE = s19Choices(
  [N('Sable breathes out, long and slow, against the stone. The light warms her nose.')],
  CI('Will you tell them? That I loved them? Not only what I did.', 'soft'),
  [N('Beside her, the pale light that was Moss’s brightens once, the way he used to nod.')],
);
const S19_CHOICES_ALONE = s19Choices(
  [N('Up on the lip, Marina has stopped pretending to look at the view.')],
  CI('Will you tell them? That I loved them? Not only what I did.', 'soft'),
  [N('The light holds your answer a while, as if it were warming its hands on it.')],
);

const S19_GOES: Line[] = [
  N('The light gets smaller. It doesn’t flicker, the way the fourth lantern used to.'),
  N('It just gets smaller, steadily.'),
  N('Like someone walking away up a long road, who turns round once to wave.'),
];
const S19_GONE: Line[] = [
  N('…'),
  N('Then there is only the flat stone, and the dry rock, and the wind going over.'),
];

// ================================================================== the quests
export const SIDE_STORIES_NEW_3: Quest[] = [
  // ================================================================== S13
  {
    id: 's13',
    code: 'S13',
    title: 'The Mill Cellar',
    source:
      'Diablo: the descent through the cellars under Tristram’s cathedral, the hero who carries the evil inside himself to keep it from others, and the old storyteller who knows the lore (themes only)',
    audience: 'all',
    trigger: {
      where: 'The old mill below the falls',
      when: 'From chapter 7 (autumn). Levels 1–3 any time from then; the bottom level only after chapter 8’s notebook. Closes before chapter 12.',
    },
    speakers: [TOBIN, ALDOUS],
    steps: [
      // ------------------------------------------------ 1. level one: the grain store
      {
        id: 's13-step1',
        goal: 'Get past the rats in the grain store and find the hatch to the next level.',
        hint: 'Feed the rats or creep past them along the wall. The hatch is under the sacks; the old hoist will lift them.',
        check: 'explore:mill-cellar:level-1',
        scene: {
          id: 's13-tobin',
          lines: [
            N('Autumn. Below the falls the river runs brown and loud, and the old mill leans over it like a man trying to hear something in the water.'),
            N('Its wheel hasn’t turned in twenty years. Moss sits on the old millstone by the door, the only thing here he approves of.'),
            N('A very old man in a lamplighter’s coat is unlocking the door with a key the size of a ladle.'),
            T('Hazel’s grandchild. Thought so. You’ve got her chin, and her habit of standing exactly where I’m about to swing a door.'),
            T('Tobin. I lit the lamps in this valley for fifty-one years. Every lane, every bridge, every dusk.', 'happy'),
            T('Then they put in the new ones that light themselves, and I was free to tell stories full time. Nobody’s thanked them for that.'),
            T('This was Aldous Vale’s mill. Corvin Vale’s father. Yes, that Corvin. Him with the cold garden.', 'think'),
            T('There’s a cellar under it. Four levels, going down. I’ve kept it shut twenty years.'),
            T('The river’s getting in now. By spring it’ll have the lot. Somebody ought to see what’s down there before the river decides.'),
            T('There was a winter, this would be the year of the Three Hats, when the wheel ran so hard the floor smoked, and—', 'happy'),
            N('He stops. He looks at the door. He looks at you.'),
            T('Where was I? Cellar. Yes. Dark.', 'think'),
            M('He’s been telling that one since before you were born. He has never once reached the end.', 'soft'),
            T('I heard that, Moss. I reach the end all the time. I just don’t bring anyone with me.'),
          ],
        },
        done: {
          id: 's13-level1',
          lines: [
            N('Level one: the grain store. Sacks to the ceiling, gone hard as stone. The air tastes of old flour and mouse.'),
            N('Something scrabbles in the dark. Then a great many somethings.'),
            T('Rats. Mill rats. Very organised. Aldous used to say they were the only staff who never asked for a day off.', 'think'),
          ],
          choices: [
            {
              id: 'fed',
              label: 'Roll them some fruit, and walk past while they eat.',
              set: { 's13-rats': 'fed' },
              then: [
                N('You roll a plum into the dark. Forty small faces turn to it at once, like a choir to a conductor.'),
                N('You walk straight past. Nobody so much as looks up.'),
                T('Bribery. Your grandmother’s method. Works on rats and parish councils.', 'happy'),
              ],
            },
            {
              id: 'crept',
              label: 'Shade your lantern and creep along the wall.',
              set: { 's13-rats': 'crept' },
              then: [
                N('You go along the wall in the dark, one step at a time. A rat sits on your boot for a while, and decides you are furniture.'),
                N('Behind you, Tobin creeps too, whispering a story about a much bigger rat, very loudly.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 2. level two: the sluice room
      {
        id: 's13-step2',
        goal: 'Drain the flooded sluice room by opening its three gates in the right order.',
        hint: 'Water runs downhill. Open the lowest gate first, then the middle, then the top, or the room fills again.',
        check: 'explore:mill-cellar:level-2',
        scene: {
          id: 's13-sluice',
          lines: [
            N('The hoist lifts the sacks with a shriek. Under them: a hatch, and three things nobody has touched in twenty years.'),
            T('Loot. That’s the proper word for it. I had it off a pedlar.', 'happy'),
            T('A ladle. Plain, that. Look at it. The Gently Used Ladle of Second Thoughts.'),
            T('A sock. Also Plain. The Sock of Uncertain Origin. Don’t ask it where it’s been.'),
            T('And the cheese rind the rats were guarding. Oh, that’s Fine, that is. The Rat-Nibbled Cheese Rind of Courage.', 'happy'),
            Y('Does everything get a name?'),
            T('Everything found in a cellar gets a name. It’s the rule. I made it up just now, and it’s very old.'),
            N('Below the hatch you can hear water. Not running. Just lying there in the dark, breathing.'),
            T('Level two’s the sluice room. Flooded since Aldous went. Three gates. Get them in the wrong order and you’ll be swimming.', 'think'),
            T('Marina could swim it. Marina could swim a soup.'),
          ],
        },
        done: {
          id: 's13-level2',
          lines: [
            N('The last gate groans open. The water goes out of the room with a long sigh, like a bath let out after twenty years.'),
            N('On the wet floor: two eels, very annoyed. And up one wall, a row of chalk marks, measuring a boy.'),
            N('The marks stop at about the height of your shoulder. Beside the last one, in a square adult hand: FIT FOR THE SLUICE.'),
            T('…'),
            T('Where was I.', 'sad'),
            N('He doesn’t say the rest. He goes on down the steps ahead of you, and doesn’t look at the wall.'),
          ],
        },
      },
      // ------------------------------------------------ 3. level three: the wheel pit
      {
        id: 's13-step3',
        goal: 'Find what is jamming the great wheel, and get past it to the bottom stair.',
        hint: 'Watch which gear shudders when the river pushes. Never stand between the spokes.',
        check: 'explore:mill-cellar:level-3',
        scene: {
          id: 's13-wheelpit',
          lines: [
            N('Drying on the steps, where the flood left them: a pair of boots, a doorknob with no door, a scarf like pond weed.'),
            T('Squeaky Boots of Announcing Yourself. Fine. The Damp Doorknob of Not Quite Opening. Also Fine.', 'think'),
            T('And that’s Rare. The Soggy Scarf of Lingering Optimism. Wring it out all you like. It still thinks it’ll dry.', 'happy'),
            N('Level three is the wheel pit. The great wheel sits half in the cellar and half in the river, dripping.'),
            N('It doesn’t turn. Each time the river leans on it the whole mill shudders, and dust comes down like flour.'),
            N('Up through the floorboards you hear Moss call down that he is staying on his millstone, thank you, being far too old for underneath.'),
            M('Mind the third stair. It has opinions.'),
            T('It was a perfectly good stair until you said that.', 'think'),
            T('Mind the wheel. It’s stuck, not dead. There’s a difference, and the difference is what takes your fingers off.'),
            T('The stair to the bottom’s past the gears. Find what’s jamming them, and step round it.'),
          ],
        },
        done: {
          id: 's13-level3',
          lines: [
            N('In the biggest gear, driven in hard, is a wooden wedge. Not something that fell. Something put there.'),
            N('A tag hangs from it on a bit of string, in the same square hand: STOPPED. LEAVE IT.'),
            Y('Somebody wedged it on purpose.'),
            T('Aldous. His last winter. They found him sat on that step, there. First time anyone ever saw him sit.', 'sad'),
            N('Past the wheel, a narrow stair goes down to an iron door. It is locked. The lock has been oiled.'),
            T('Not that one. Not yet.', 'soft'),
            T('There’s a thing you ought to know first, about Aldous’s boy and your grandmother. It’s hers to tell, not mine.'),
            T('She wrote most things down. When you’ve read it, come back, and I’ll find the key. I know exactly where it is. That’s the trouble.'),
          ],
        },
      },
      // ------------------------------------------------ 4. level four: the counting room (after the ch8 notebook)
      {
        id: 's13-step4',
        goal: 'Unlock the iron door and go down to the bottom of the cellar with Tobin.',
        hint: 'Use Tobin’s key on the iron door past the wheel pit. Take a lantern; there’s no light below.',
        check: 'explore:mill-cellar:level-4',
        scene: {
          id: 's13-key',
          lines: [
            N('After the Hollow, with Hazel’s notebook still in your coat, you go back down to the mill. Tobin is on the step, waiting.'),
            T('You know now. About Corvin and her. I can see it on you. You’ve the look of someone who read the last page first.', 'soft'),
            T('He was her apprentice. Before that, he was this mill’s boy.'),
            T('I lit the lamp at that gate every dusk for thirty years. There was always a boy at the window. Working.', 'sad'),
            T('That’s the whole story. Short, isn’t it. It’s the only one I’ve ever finished.', 'sad'),
            N('He holds out a small iron key on a bootlace. It is warm from his pocket.'),
            T('I named the last of the stair loot while you were away. Couldn’t help it. A cog: the Cog of Tremendous Patience. Rare.'),
            T('My old lamp hook, which I lent Aldous one winter and never got back. The Lamplighter’s Hook of Talking Too Long. Storied, that.'),
            T('And a little hat cut from a broken grindstone. Somebody meant to hand that down, so it’s Heirloom. Millstone Hat of Considerable Weight.'),
            T('Down we go. I’ll come with you. I’ve never been in. I’ve only ever kept it shut.', 'soft'),
          ],
        },
        done: {
          id: 's13-desk',
          lines: [
            N('The bottom room is small, dry and very cold.'),
            N('A desk. A chair pushed in square. A lamp with the wick trimmed.'),
            N('On the hook behind the door: a miller’s apron, still floury, and a pocket watch, stopped at four minutes past five.'),
            T('Five in the morning. That’s when the wheel started, every day of his life.', 'soft'),
            N('On the desk, a ledger. Inside the cover, in chalk, three rules.'),
            N('ONE. THE WHEEL DOES NOT STOP.'),
            N('TWO. NOTHING IDLES.'),
            N('THREE. WHAT CANNOT KEEP UP IS LET GO.'),
            N('Under them, copied out again in a child’s careful hand, ruled in pencil so the letters stay straight: the same three rules.'),
            N('You turn the pages. Sacks, hours, men, wheel speed.'),
            N('Every year the hours go up. The word “rest” never appears.'),
            N('Near the back: “Boy, 12, put on the night shift. New method: the wheel never stops. Output up a third.”'),
            N('Folded inside the back cover is a letter. Addressed. Never sent. Corvin.'),
            T('I found it the day they found him. I read it. I shouldn’t have. Then I shut the door on it, so nobody else had to carry it.', 'sad'),
            T('Twenty years. It got heavy, keeping it from people. I didn’t know it would.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 5. the letter
      {
        id: 's13-step5',
        goal: 'Do what you decided with Aldous’s letter.',
        hint: 'Keep it safe in your bag, burn it in the mill’s old stove, or take it to the grave under the alders by the race.',
        check: 'resolve:item:mill-letter',
        scene: {
          id: 's13-letter',
          lines: S13_LETTER,
          choices: [S13_KEEP, S13_BURN, S13_GRAVE],
        },
        done: {
          id: 's13-settled-kept',
          lines: [
            N('At home you put the letter in the tin box under your bed, with Hazel’s.'),
            N('Hazel’s writing leans, as if every word were walking uphill. His stands bolt upright, as if someone were watching.'),
            N('You check on it more often than you need to. That seems to be part of carrying something for someone.'),
            N('At two in the morning you check the tin again. The letter is there. So, somehow, is the Sock of Uncertain Origin.'),
          ],
        },
      },
    ],
    complete: {
      id: 's13-complete',
      lines: [
        N('A week later Tobin brings the apron and the stopped watch up from the bottom room, and gives them to you.'),
        T('Heirlooms. Somebody meant to hand them down. He just never stopped long enough to do it.', 'soft'),
        N('Then he knocks the wedge out of the great gear with a mallet and a short speech.'),
        N('The wheel turns. Slowly. Not Aldous’s speed: the river’s.'),
        N('Water drips off each paddle as it comes round, taking its time.'),
        T('There. It goes as fast as the river feels like, and not a turn faster. Nobody’s counting.', 'happy'),
        T('Bring your seeds down. It grinds a lovely flour. Nubbins go mad for a flour treat. Don’t give them six, like I did.'),
        T('And come and sit, when you like. I’ve a story about the year of the Three Hats. I’ll get to the end of it one day.', 'soft'),
        T('Where was I?', 'think'),
        Y('Mill. Yes. Light.'),
        N('Tobin looks at you for a long moment. Then he laughs until he has to sit down on the millstone.'),
      ],
    },
    rewards: [
      {
        id: 's13-millletter',
        kind: 'flag',
        label: 'millLetter',
        description:
          'kept, burned or grave. Kept counts toward S9’s family gate and lets you give Corvin the letter in S9; every value adds an epilogue line.',
      },
      {
        id: 's13-mill',
        kind: 'feature',
        label: 'The Mill',
        description:
          'The old mill becomes a section of the valley, with its millwheel turning at the river’s pace. Grind seeds into flour treats that Nubbins love.',
      },
      {
        id: 's13-storyteller',
        kind: 'feature',
        label: 'Old Tobin, storyteller',
        description:
          'Visit Tobin at the mill for a tale, as often as you like. He never finishes any of them, except the short one.',
      },
      {
        id: 's13-apron',
        kind: 'cosmetic',
        label: 'Miller’s Apron of Never Sitting Down',
        description: 'Heirloom (gold). A floury miller’s apron from the bottom room. It looks best on someone sitting down.',
      },
      {
        id: 's13-watch',
        kind: 'cosmetic',
        label: 'Pocket Watch of Finally Stopping',
        description: 'Heirloom (gold). Aldous Vale’s watch, stopped at four minutes past five. Worn on a chain; it never ticks.',
      },
      {
        id: 's13-millstone-hat',
        kind: 'cosmetic',
        label: 'Millstone Hat of Considerable Weight',
        description: 'Heirloom (gold). A tiny hat cut from a broken grindstone. Nubbins wearing it walk very slowly and seem pleased about it.',
      },
      {
        id: 's13-hook',
        kind: 'cosmetic',
        label: 'Lamplighter’s Hook of Talking Too Long',
        description: 'Storied (purple). Tobin’s old lamp hook, carried over the shoulder. He says it has a story. He can’t remember it.',
      },
      {
        id: 's13-sifter',
        kind: 'decor',
        label: 'Haunted Flour Sifter of Polite Sighing',
        description: 'Storied (purple). A garden ornament that sighs gently when the wind blows through it. Never rudely.',
      },
      {
        id: 's13-cog',
        kind: 'decor',
        label: 'Cog of Tremendous Patience',
        description: 'Rare (blue). A great iron cog for the garden. Nubbins like to sit in the middle of it and do nothing.',
      },
      {
        id: 's13-scarf',
        kind: 'cosmetic',
        label: 'Soggy Scarf of Lingering Optimism',
        description: 'Rare (blue). Permanently a little damp. Still thinks it will dry.',
      },
      {
        id: 's13-boots',
        kind: 'cosmetic',
        label: 'Squeaky Boots of Announcing Yourself',
        description: 'Fine (green). Every step squeaks. Shy Nubbins always know exactly where you are, which they prefer.',
      },
      {
        id: 's13-doorknob',
        kind: 'decor',
        label: 'Damp Doorknob of Not Quite Opening',
        description: 'Fine (green). A doorknob on a post. Turn it and nothing happens, very satisfyingly.',
      },
      {
        id: 's13-cheese',
        kind: 'item',
        label: 'Rat-Nibbled Cheese Rind of Courage',
        description: 'Fine (green). Feed it to a timid Nubbin: it will try one new thing today.',
      },
      {
        id: 's13-ladle',
        kind: 'item',
        label: 'Gently Used Ladle of Second Thoughts',
        description: 'Plain (white). A ladle. Use it at the mill to scoop flour; it always scoops a little less than you meant.',
      },
      {
        id: 's13-sock',
        kind: 'cosmetic',
        label: 'Sock of Uncertain Origin',
        description: 'Plain (white). A single sock, worn as a hat. Don’t ask it where it’s been.',
      },
    ],
    sets: { s13Done: true },
    notes:
      'THEME. We carry what our parents carried until someone sets it down. Tobin kept the cellar shut twenty years “so ' +
      'nobody else had to carry it”; Aldous’s three mill rules (in s13-desk) are the dark mirror of Hazel’s three rules, and ' +
      'the boy copied them out. That is where Corvin learned “the method”. The real question: is a letter like this a gift ' +
      'or a weight, and who gets to decide? All three answers are defensible. ' +
      'RUNNING GAG. Tobin loses the thread (“Where was I? Cellar. Yes. Dark.”) and names every bit of loot in grand style. ' +
      'It turns twice: in s13-level2 he says only “Where was I.” and stops; in s13-key he finishes his only short story; and ' +
      'in s13-complete you finish his line for him (“Mill. Yes. Light.”). Surprise: the loot names stop being funny at the ' +
      'bottom (the apron and the watch). ' +
      'CANON. Corvin appears only in the payoff (s13-letter-given in S9, and the epilogue). Never explain the shard or the ' +
      'theft: the letter says only that Corvin “did a wrong thing at the old woman’s Grove, and went in the night”. ' +
      'TIMING. Opens at the mill in chapter 7 (autumn). Steps 1–3 any time from chapter 7. s13-key (step 4’s scene) is the one ' +
      'exception to the timing rule: it waits until both explore:mill-cellar:level-3 is met AND the chapter 8 notebook has ' +
      'been found, then plays the next time the player visits the mill. Step 5 must be resolved before chapter 12; if ' +
      'chapter 12 begins with the letter undecided, the story closes unfinished and millLetter stays unset (no epilogue). ' +
      'If the choice is made but not yet acted on, act it out silently (the resolve check is staging only). ' +
      'MOSS. He sits on the millstone outside and never goes underground. If Moss has left the world (removed at the Long ' +
      'Night: c10-moss-fades or c10-bank-moss-gone) when step 5 begins, play s13-letter-nomoss in place of s13-letter ' +
      '(the grave option no longer mentions him), and its grave branch plays s13-settled-grave-nomoss. ' +
      'STEP 5 DONE VARIANTS. The done scene shown (s13-settled-kept) is for millLetter = kept. For burned, play ' +
      's13-settled-burned (the mill’s old stove); for grave, play s13-settled-grave (or -nomoss as above). ' +
      'LEVELS. Each level is a small dungeon crawl: level 1 grain store (hazard: rats, fed or crept past, flag s13-rats; ' +
      'puzzle: the hoist and the hatch); level 2 sluice room (hazard: the flood; puzzle: open the three gates bottom, ' +
      'middle, top); level 3 wheel pit (hazard: the stuck millwheel lurches when the river pushes; puzzle: find the wedge, ' +
      'leave it, and step round); level 4 counting room (no hazard; the desk). Use the lantern light radius as the main ' +
      'tension. Sound: the river louder on every level down, then silence in the bottom room. ' +
      'LOOT. Five rarity tiers, each with its colour: Plain (white), Fine (green), Rare (blue), Storied (purple), Heirloom ' +
      '(gold). Tobin names each item in the scene after the level it drops on; give the item when that level’s check is met ' +
      '(the apron and watch at s13-complete). The twelve fixed drops, which also serve as examples for any generated names ' +
      '(pattern: [odd adjective] [plain object] of [small feeling]): ' +
      'L1: Gently Used Ladle of Second Thoughts (Plain), Sock of Uncertain Origin (Plain), Rat-Nibbled Cheese Rind of ' +
      'Courage (Fine). L2: Squeaky Boots of Announcing Yourself (Fine), Damp Doorknob of Not Quite Opening (Fine), Soggy ' +
      'Scarf of Lingering Optimism (Rare). L3: Cog of Tremendous Patience (Rare), Haunted Flour Sifter of Polite Sighing ' +
      '(Storied), Lamplighter’s Hook of Talking Too Long (Storied), Millstone Hat of Considerable Weight (Heirloom). L4: ' +
      'Miller’s Apron of Never Sitting Down (Heirloom), Pocket Watch of Finally Stopping (Heirloom). ' +
      'WHAT IT CHANGES. (1) S9’s family gate: count millLetter = kept alongside corvin = reconciled, s3Done, s6Done and ' +
      's8Done; family is offered when 2 or more are true. (2) If millLetter = kept and S9 runs, play s13-letter-given ' +
      '(SIDE_STORIES_NEW_3_VARIANTS) straight after s9-trowel, before s9-yours; it sets s13-given. If the stone was kept, ' +
      'S9 never starts, so the letter is never given. (3) Epilogue: end-epi-mill-kept (s13-given true), ' +
      'end-epi-mill-kept-ungiven (kept, never given), end-epi-mill-burned, end-epi-mill-grave. They play after ' +
      'end-epi-gate-* and before end-epi-walk-*. All four are gate-neutral and ending-neutral. ' +
      'REWARDS. The mill section and millwheel feature unlock at s13-complete; Tobin can be visited from then on.',
  },

  // ================================================================== S19
  {
    id: 's19',
    code: 'S19',
    title: 'Cinder’s Last Light',
    source:
      'Warcraft: the last guardian who fell and spent his long end trying to make amends, and the fallen hero exiled for an age (themes only)',
    audience: 'all',
    trigger: {
      where: 'The Grove, then the snowfield and the hollow on the high pass above it',
      when: 'Chapter 11 (midwinter), the morning after Hazel’s first evening home, only if the stone was unmade (keptStone false). Closes before the final choice in chapter 12.',
    },
    speakers: [CINDER],
    steps: [
      // ------------------------------------------------ 1. the warmth
      {
        id: 's19-step1',
        goal: 'Ask Marina about the path up to the high pass.',
        hint: 'She’s at the tide pools, breaking the ice so the anemones can breathe.',
        check: 'talk:marina:high-pass',
        scene: {
          id: 's19-warmth',
          set: { 's19-with': 'moss' },
          lines: [
            N('Two days after the Long Night. The valley is white to the doorsteps, and very quiet.'),
            N('Moss sits on the cottage step, facing north, where the snowfield climbs to the high pass. He has sat like that since dawn.'),
            N('He is thinner than he was. On a bright morning you can see the step through him.'),
            M('There is something warm up there.', 'think'),
            M('There shouldn’t be. Nothing has been warm on the high pass since the White Year. Nothing.'),
            N('Up there the snow is the blue of skimmed milk, and quite empty.'),
            M('I felt it on the night we unmade the stone. Like a candle someone forgot, in a room you thought was dark.', 'soft'),
            M('I am too thin to climb. I am going anyway. You may carry me, if you would. In your coat. I won’t talk much.', 'soft'),
            M('That last part was a lie. Marina knows the path. Ask her.'),
          ],
        },
        done: {
          id: 's19-marina',
          lines: [
            N('Marina is knee-deep in a tide pool with the ice broken round her and her sleeves rolled up, perfectly happy.'),
            MA('The high pass? In midwinter? Lovely. Bracing. You’ll hate it.', 'happy'),
            MA('All the water in this valley comes down off that snowfield. Somebody has to know where it starts. That’s me.'),
            MA('Nobody else goes up there. There’s nothing up there but wind and the view.', 'think'),
            MA('Boots, rope, two pairs of socks. First light tomorrow. Don’t be brave. Be careful.'),
            MA('Two pairs. I will check.'),
          ],
        },
      },
      // ------------------------------------------------ 2. the climb
      {
        id: 's19-step2',
        goal: 'Climb the snowfield to the high pass.',
        hint: 'Step in Marina’s footprints. When the wind gusts, crouch and wait for it to pass.',
        check: 'climb:snowfield:high-pass',
        scene: {
          id: 's19-climb',
          lines: [
            N('First light. Marina ropes you to her. Then, after some thought, she ropes Moss to a button of your coat.'),
            N('He rides inside, against your chest, with just his face out. He weighs about as much as a held breath.'),
            M('Left.', 'think'),
            MA('Right.'),
            M('Her right. My left. We are agreeing, in different directions.'),
            N('The snowfield is crusted on top and soft beneath. Every step goes through with a crunch like biting toast.'),
            MA('Lovely, isn’t it? That wind. Takes your face right off.', 'happy'),
            M('Your heart is very loud. I am not complaining. It’s warm.', 'soft'),
          ],
        },
        done: {
          id: 's19-hollow',
          lines: [
            ...S19_HOLLOW_START,
            N('Moss has gone completely still in your coat.'),
            M('…Cinder.', 'soft'),
            N('The red light doesn’t answer. It is too small to answer.'),
            N('It has kept itself barely alight for longer than the cottage has stood.'),
            M('She can’t hear us. Not yet. We speak only to those who sit still long enough. She taught me that, once.', 'soft'),
            M('Let me out. I’ll sit by her. You sit by me. We’ll wait.'),
          ],
        },
      },
      // ------------------------------------------------ 3. the wait, and the question
      {
        id: 's19-step3',
        goal: 'Sit beside the red light, and wait.',
        hint: 'Don’t move and don’t speak. It can take a long time. That’s the point.',
        check: 'sit:wait:cinder-hollow',
        scene: {
          id: 's19-sit',
          lines: [
            N('You sit on the dry rock. The wind goes over the overhang with a sound like a long breath out.'),
            N('Below you, the whole valley: the falls frozen white, smoke from the cottage, four lantern posts too small to see.'),
            N('You wait. Your feet go cold, then numb, and then you stop thinking about them.'),
          ],
        },
        done: {
          id: 's19-question',
          lines: [
            ...S19_FIRST_WORDS,
            M('No.', 'soft'),
            M('They’re well.', 'soft'),
            ...S19_UNDERSTANDS,
            M('I looked for you. After. For a long time, I looked.', 'soft'),
            CI('I know. I hid. You were looking with such a kind face. I couldn’t bear it.', 'sad'),
            ...S19_HER_SIDE,
            N('…'),
            CI('Do they still say my name? Down there?'),
            N('You know one way they do. You say it to her plainly, without the sing-song the children use in the lane.'),
            Y('Cinder held them close and tight, kept them warm one winter night;'),
            Y('when the morning came to call, they did not move at all.'),
            N('The light dips, and steadies.'),
            CI('That’s fair.', 'soft'),
            CI('Do they skip well?'),
            M('Badly. With great enthusiasm.', 'happy'),
            N('Something passes through the light that might, in a larger creature, be a laugh.'),
            M('Cinder. I forgave you the first spring. I’ve carried it about ever since, with nowhere to set it down.', 'soft'),
            M('Here. It’s yours.', 'soft'),
            N('He leans in until his forehead nearly touches the light. It warms his face. You can see it from where you sit.'),
            CI('…Thank you, Moss.', 'soft'),
            ...S19_ASKS,
            CI('He can forgive me for himself. He’s earned that. But you live down there, with the grey ones in the grass, and what I did.'),
            S19_THE_QUESTION,
            M('Don’t look at me. It isn’t mine to give. It never was.', 'soft'),
          ],
          choices: S19_CHOICES_MOSS,
        },
      },
      // ------------------------------------------------ 4. the light goes
      {
        id: 's19-step4',
        goal: 'Stay with her until her light goes.',
        hint: 'Stay sitting. Don’t leave the hollow. It won’t be long.',
        check: 'wait:cinder:fade',
        scene: {
          id: 's19-after',
          lines: [
            N('The light is getting smaller. Not going out. Going, the way the last of the day goes off a hill.'),
            CI('I kept myself alight so long. Just a little. Just in case there was news.', 'soft'),
            CI('There’s been news. I can stop now.', 'soft'),
            CI('Will you stay? You don’t have to do anything. Just stay.'),
          ],
        },
        done: {
          id: 's19-fade',
          lines: [
            N('You stay. Moss sits with his shoulder almost touching the light, the way he sat by Fossil’s flower in the rain.'),
            ...S19_GOES,
            CI('Moss. It isn’t cold.', 'soft'),
            M('No. Not this way.', 'soft'),
            ...S19_GONE,
            M('There.', 'soft'),
            M('That is fading done right. Not stilled. Let go.', 'soft'),
            N('He sits there a long time. You let him.'),
          ],
        },
      },
    ],
    complete: {
      id: 's19-complete',
      lines: [
        N('Where the light was, the flat stone is still warm. Not hot.'),
        N('Warm, like a hand that has only just let go of yours.'),
        N('There is a small red pebble on it that wasn’t there before.'),
        N('It is warm too. It stays warm all the way down the mountain.'),
        N('Marina is on the lip with the rope, looking at the view very hard. Her eyes are red. She says it’s the wind.'),
        MA('Lovely up here.', 'sad'),
        MA('Come on. Feet in my prints. Home before the light goes.', 'soft'),
        N('That night you go and stand by the Long-Grass lantern. It burns as it has every night since the Long Night.'),
        N('But it’s warm now, standing beside it. The other three never are.'),
        N('You put the red pebble on the windowsill.'),
        N('By morning the Nubbins are asleep in a heap under it. None of them will say why.'),
      ],
    },
    rewards: [
      {
        id: 's19-cinder',
        kind: 'flag',
        label: 'cinder',
        description: 'forgiven or remembered. Adds an epilogue scene: a new red flower on the hill in the spring, and the Long-Grass lantern burning warm.',
      },
      {
        id: 's19-ember',
        kind: 'decor',
        label: 'Cinder’s Ember',
        description:
          'A small red pebble from the high pass that is always warm and never hot. Place it anywhere: Nubbins near it sleep deeply and never shiver.',
      },
      {
        id: 's19-snowfield',
        kind: 'feature',
        label: 'The Snowfield',
        description:
          'The snowfield and the high pass become a section of the valley, with the dry hollow under the overhang where nothing ever freezes.',
      },
    ],
    sets: { s19Done: true },
    notes:
      'THE EMOTIONAL PEAK OF THE SIDE STORIES. Restrained, plain, warm. No music under s19-question and s19-fade: wind only. ' +
      'Cinder’s text is small and slow (type-on at half speed if the dialogue box supports it). Hold each “…” line a beat ' +
      'longer than usual. Her first words are a question, and Moss’s answer (“No.” / “They’re well.”) is the whole story: ' +
      'safe is not the same as well, and she understands it at last. ' +
      'THE QUESTION. Can you forgive on behalf of others? Both answers are defensible and both end the same way: she fades ' +
      'properly (“fading done right”). The comedy is small on purpose: Moss and Marina’s left and right, Marina’s two pairs of ' +
      'socks, and “Badly. With great enthusiasm.” The surprise is who the warmth is. ' +
      'AVAILABILITY. Only if keptStone is false. WHO COMES: if Moss is still in the world (mossReturned true, or the wisp ' +
      'route with mossFaded false), play the scenes as written (s19-with = moss). If Moss has left the world ' +
      '(c10-moss-fades or c10-bank-moss-gone) and Sable is bonded, Sable comes instead: play the -sable variants from ' +
      'SIDE_STORIES_NEW_3_VARIANTS in place of s19-warmth, s19-climb, s19-hollow, s19-question and s19-fade ' +
      '(s19-warmth-sable sets s19-with = sable). If Moss has left the world and Sable is not bonded (or is gone), you go ' +
      'with Marina only: play the -alone variants in place of the same five scenes (s19-warmth-alone sets s19-with = ' +
      'alone). In that version you answer Cinder yourself (“No.” / “They’re well.”, and “Badly. With great ' +
      'enthusiasm.”), and nobody brings Moss’s pale light, which only exists when Sable is bonded. s19-marina, s19-sit, ' +
      's19-after and s19-complete are shared by all three versions. So S19 opens in every run where the stone was unmade, ' +
      'as the bible’s table says. Sable never speaks in her version; she forgives by leaning her ' +
      'weight on the stone, as she leant on your shin in chapter 7. Moss’s pale light (c10-moss-light) goes with her. ' +
      'TIMING. Step 1 opens on the first morning of chapter 11 after c11-open and its add-ons (S10 owns Hazel’s first evening, ' +
      'S9 her second dusk). The climb is “first light tomorrow”, a day trip; s19-sit to s19-complete play in one sitting. If ' +
      'the final choice in chapter 12 arrives first, the story lapses: cinder stays unset and no epilogue plays. Hazel is not ' +
      'in this story (her c12-open line at Cinder’s post, “She loved them too, you know”, lands harder after it). ' +
      'RHYME. s19-question uses Cinder’s rhyme exactly as the bible gives it, split as in c4-tale-2. ' +
      'ART. The ember: a red point of light smaller than a Nubbin’s eye, with a faint heat shimmer; it swells a little when ' +
      'she speaks and shrinks steadily through s19-fade. The hollow is snowless, bare dry rock. ' +
      'WHAT IT CHANGES. Epilogue: end-epi-cinder-forgiven or end-epi-cinder-remembered, played after end-epi-walk-* and ' +
      'before end-epi-told | end-epi-secret (so it follows Hazel’s flower). Both add a red flower on the hill in the spring ' +
      '(art: a red memorial flower, slightly apart from Briar’s) and the line that the Long-Grass lantern burns warm. The ' +
      'flower is not numbered, since the hill’s count differs by route (Fossil, Hazel, and Moss if he faded). ' +
      'REWARDS. Cinder’s Ember is given at s19-complete; the snowfield section unlocks at s19-complete.',
  },

  // ================================================================== S22
  {
    id: 's22',
    code: 'S22',
    title: 'The Climb',
    source: 'Celeste: climbing a mountain with your own anxiety as a companion, and learning to climb with it, not against it (themes only)',
    audience: 'all',
    trigger: {
      where: 'The foot of the Tooth, the sharp peak above Dusty’s cliff',
      when: 'After chapter 8’s opening (once Nova has asked for help for the first time). Closes in chapter 11.',
    },
    speakers: [WORRY],
    steps: [
      // ------------------------------------------------ 1. the scree
      {
        id: 's22-step1',
        goal: 'Climb the Scree with Nova.',
        hint: 'On loose stones keep moving: three quick steps, then rest on a big rock. Never stop on the small ones.',
        check: 'climb:tooth:scree',
        scene: {
          id: 's22-foot',
          lines: [
            N('The Tooth stands over the valley like something the valley bit and didn’t finish. There’s already snow on its tip.'),
            N('Nova is at the foot with a coil of rope, a bag of oatcakes, and the look of someone who has been here before.'),
            NO('Three times. I’ve tried it three times. I got as far as the Ridge every time. Then I came down. I always come down.', 'think'),
            NO('That’s me. I come, I look, and I leave before anywhere can start to matter.'),
            NO('I asked you for help once, in the Hollow. It went well. I thought I’d try it again before I lose my nerve.', 'soft'),
            N('On the rock beside her sits something the size of a cat, made of shadow. It has Nova’s shape exactly.'),
            WO('You’re going to fall.', 'think'),
            N('Nova goes very still. She looks at you.'),
            NO('…You can see it.', 'shock'),
            NO('Nobody can see it. I’ve carried that about my whole life and nobody has ever once—', 'shock'),
            Y('Is it dangerous?'),
            NO('It’s mine. It’s my Worry. It’s talked to me since I was small. It’s mostly right, which is the annoying part.', 'think'),
            WO('Mostly.', 'happy'),
            NO('Right. Scree first. I’ll sing. It helps. It doesn’t help anyone else.'),
          ],
        },
        done: {
          id: 's22-scree',
          lines: [
            N('The scree slides under every step, with a sound like someone pouring out a sack of teacups.'),
            NO('♪ Little stones, little stones, sliding out from under my bones, ♪', 'happy'),
            NO('♪ I would like to go up but I’m going down, which is the opposite of up, little stones. ♪', 'happy'),
            N('It doesn’t rhyme. It doesn’t scan. She sings it four times.'),
            WO('Last time you slipped here and cut your knee. You’ve still got the scar.'),
            NO('It’s right. It’s always right about the facts. It’s the next bit it gets wrong.', 'think'),
          ],
          choices: [
            {
              id: 'both',
              label: '“It is right. And you got up and kept going.”',
              set: { 's22-scree': 'both' },
              friendship: { nova: 1 },
              then: [
                NO('…I did, didn’t I. Bled on my boot all the way to the Chimney.', 'think'),
                WO('That’s… also true.', 'think'),
                NO('Ha.', 'happy'),
              ],
            },
            {
              id: 'together',
              label: '“That was last time. This time there are two of us.”',
              set: { 's22-scree': 'together' },
              friendship: { nova: 1 },
              then: [
                NO('Two of us. Huh.', 'soft'),
                WO('Three.', 'think'),
                NO('It can count. It’s always been able to count.', 'happy'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 2. the chimney
      {
        id: 's22-step2',
        goal: 'Climb the Chimney: brace and push, one side to the other.',
        hint: 'Push with your back, step with your feet. Move one limb at a time and you won’t slip.',
        check: 'climb:tooth:chimney',
        scene: {
          id: 's22-chimney',
          lines: [
            N('The Chimney is a crack in the rock just wide enough for a person and a doubt. You go up it back on one side, boots on the other.'),
            NO('♪ I’m in a chimney, I am not a soot, I am a Nova, and this is my foot. ♪', 'happy'),
            NO('♪ This is my other foot. ♪', 'happy'),
            N('Far below, a buzzard turns and turns, watching you with what you feel is professional interest.'),
          ],
        },
        done: {
          id: 's22-chimney-top',
          lines: [
            N('Halfway up the Chimney, Nova stops. The Worry is wedged in above her, looking down.'),
            WO('Everywhere you stay, you lose something. The last place you stayed, you were nine. Remember?', 'soft'),
            N('Nova doesn’t move. Her knuckles are white on the rock.'),
            NO('It’s true. That’s the thing. That one’s true.', 'sad'),
            NO('Somebody left. So I learned to be the one who leaves first. It’s quicker. It hurts less. It’s quicker.', 'sad'),
          ],
          choices: [
            {
              id: 'true',
              label: '“It’s true. It still isn’t a reason to let go.”',
              set: { 's22-chimney': 'true' },
              friendship: { nova: 1 },
              then: [
                NO('…No. It isn’t.', 'soft'),
                N('She moves one hand. Then one foot. Then the other hand. Very slowly, like someone learning how.'),
                WO('I wasn’t telling you to let go. I was telling you it was a long way down.', 'soft'),
                NO('I know. You’re very bad at saying what you mean. I wonder where you get it.', 'think'),
              ],
            },
            {
              id: 'look',
              label: '“Not here. Not now. Look at me, not down.”',
              set: { 's22-chimney': 'look' },
              friendship: { nova: 1 },
              then: [
                N('She looks at you. Not at the drop. Not at the Worry. At you.'),
                NO('…Right. Right. Hands.', 'think'),
                N('She climbs. The Worry climbs too, right behind her, muttering about loose rock.'),
                N('It’s right about the loose rock.'),
                N('Far below, the buzzard gives up and goes to watch somebody else.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 3. the ridge
      {
        id: 's22-step3',
        goal: 'Cross the Ridge.',
        hint: 'Keep low in the gusts. Hand on the rock, eyes on the next step, not the drop.',
        check: 'climb:tooth:ridge',
        scene: {
          id: 's22-ridge',
          lines: [
            N('The Ridge is a knife of rock with the whole sky on both sides. The wind comes over it in long, cold shoves.'),
            N('This is where Nova turned back. You can see the place: a little cairn of three stones, one for each try.'),
            NO('Here. This is where I always… yes.', 'think'),
            WO('Go back. It’s windy. It’s high. They’ll wonder where you are. You can come another day.', 'soft'),
            NO('Every true thing it says makes me smaller. And I fight it, and fight it, and up here I lose. Every time.', 'sad'),
          ],
        },
        done: {
          id: 's22-ridge-cross',
          lines: [
            N('In the middle of the Ridge Nova stops. The Worry is beside her. It has always been beside her.'),
            N('She looks at it for a long time. Then she holds out her hand.'),
            NO('Come on, then.', 'soft'),
            WO('…What?', 'shock'),
            NO('You’re coming anyway. You always come. So come with me. Not at me.', 'soft'),
            N('The Worry looks at her hand. Then it takes it.'),
            N('It’s smaller, with its hand in hers. Not gone. Smaller.'),
            N('They cross the Ridge together. Nova starts the stones song again, and a second voice joins in, a third below hers, horribly flat.'),
            WO('♪ …little stones, which are very loose, and we should mind them… ♪', 'happy'),
            NO('You can SING?', 'shock'),
            WO('I’ve always been able to sing. You never asked.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 4. the summit
      {
        id: 's22-step4',
        goal: 'Plant the summit flag on top of the Tooth.',
        hint: 'It’s in Nova’s bag, under the oatcakes. Wedge the pole into the crack on the very top.',
        check: 'place:decor:summit-flag',
        scene: {
          id: 's22-scramble',
          lines: [
            N('The last bit is a scramble on hands and knees, up to a point of rock the size of a kitchen table.'),
            NO('Give me the flag. No, you do it. No. Together. Fine. Together.', 'happy'),
          ],
        },
        done: {
          id: 's22-summit',
          lines: [
            N('From the top of the Tooth you can see everything at once.'),
            N('The falls, a long white thread. Dusty’s cliff.'),
            N('Marina’s pools like spilled coins. The Circuit, square and small.'),
            N('The Hollow, dark in its fold of trees. And the Grove: the pond, the cottage roof, four lantern posts no bigger than pins.'),
            N('Nova sits down. The Worry sits beside her, holding her hand. Neither of them says anything for a while.'),
            NO('I’d like to stay for a while.', 'soft'),
            N('She says it to the valley first. Then, more quietly, to the Worry. Then to you.'),
            NO('Not up here. Down there. I’d like to stay for a while.', 'soft'),
            WO('It’ll be frightening.', 'soft'),
            NO('Yes. You’ll come too.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 's22-complete',
      lines: [
        N('Going down is quicker and much worse, as it always is. Nova sings the whole way. So does the Worry.'),
        N('At the bottom she unpacks the oatcakes, which have been sat on, and shares them out in three.'),
        N('The Worry checks its piece is exactly as big as yours. It is. It checks again.'),
        NO('It’s always done that. Since I was small.', 'happy'),
        NO('Keep the flag. Put it somewhere you’ll see it. I’ll know where it is. I’ll come and look at it.', 'soft'),
        NO('And have my boots. They’re my spare pair. I won’t need spares. I’m not going anywhere.', 'happy'),
        NO('You can see the whole valley from up there now, whenever you like. In case you ever need to find me. I’ll be in it.', 'soft'),
        N('The Worry waves. Small. Only you can see it.'),
      ],
    },
    rewards: [
      {
        id: 's22-flag',
        kind: 'decor',
        label: 'Summit Flag',
        description: 'The flag you and Nova planted on the Tooth, a copy for the garden. Nova visits it.',
      },
      {
        id: 's22-viewpoint',
        kind: 'feature',
        label: 'The Tooth Viewpoint',
        description: 'A new landmark at the summit of the Tooth: the whole valley in one view. Works as a fast-travel point.',
      },
      {
        id: 's22-boots',
        kind: 'cosmetic',
        label: 'Climbing Boots',
        description: 'Nova’s spare pair, scuffed at the toes. She won’t be needing them.',
      },
      {
        id: 's22-nova',
        kind: 'feature',
        label: 'Nova’s Friendship',
        description: '+5 friendship with Nova on top of any from choices. She stays for tea now. Sometimes two cups.',
      },
    ],
    sets: { s22Done: true },
    notes:
      'FOR FUN: sets only s22Done and the local flags s22-scree (both | together) and s22-chimney (true | look). It reads no ' +
      'campaign flags. THEME. Fear is part of you: not your enemy and not your boss. The question: what do you say to a ' +
      'fear that is telling the truth? The chimney choice (agree it’s true but not a reason, or look away from it) has no ' +
      'wrong answer. COMEDY. Nova’s terrible climbing songs (original), the buzzard, and the surprise that the Worry can ' +
      'sing (flat). THE WORRY. A small shadow-shape in Nova’s exact silhouette, about the size of a cat, visible only in ' +
      'S22 scenes and only to Nova and the player. It is not grey and not a Nubbin: keep it clearly distinct from the grey ' +
      'Nubbins (soft violet-black, no frost). It gets a little smaller in s22-ridge-cross and stays that size. It never ' +
      'appears in the campaign. GAMEPLAY. Three traversal mini-games: Scree (rhythm: move or slide), Chimney (alternate ' +
      'back and feet), Ridge (crouch in gusts). No fail state: a slip slides you back to the stage start, with a Worry line. ' +
      'TIMING. Opens after c8-open (Nova has asked for help); weather follows the season (late autumn snow cap, or deep snow ' +
      'in chapters 9–11). Not during chapter 10’s Long Night. Closes in chapter 11, like every other story in this set; ' +
      'if it is unfinished when chapter 12 begins, it closes unfinished with no rewards. ' +
      'REWARDS. All given at s22-complete. The viewpoint appears on the map as a fast-travel point.',
  },
];

// ================================================================== variants and epilogue scenes
export const SIDE_STORIES_NEW_3_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- S13: in S9, after s9-trowel, if millLetter = kept
  {
    id: 's13-letter-given',
    set: { 's13-given': true },
    lines: [
      N('Hazel turns the trowel over in her lap. You think of the letter in the tin box under your bed, and go and fetch it.'),
      N('You go down the lane after him. The frost is coming down blue on the hedges, and your breath goes ahead of you.'),
      N('He is at the bend by the stile, his hands pushed under his arms.'),
      N('He hasn’t got far. He keeps stopping to feel them.'),
      C('Hazel’s grandchild. Twice in one evening. People will talk.', 'think'),
      N('You hold out the letter. He sees the writing on the front before he takes it, and doesn’t take it.'),
      C('That’s my father’s hand. He wrote as if he were being timed.', 'shock'),
      Y('It was in the mill cellar. Tobin kept it. He wrote it after you’d gone.'),
      N('He takes it. His fingers are clumsy with the cold coming out of them. It takes him three goes to unfold it.'),
      N('He reads it by the last of the light. Then again, slower.'),
      N('You look at the hedge, so he doesn’t have to be looked at.'),
      N('…'),
      C('“Nobody would count.”', 'soft'),
      C('He counted my hours at the sluice. In a book. I used to check his sums for him.', 'sad'),
      N('He folds the letter along its old folds, and puts it in his breast pocket, where the tin was for twenty-two years.'),
      N('His hand rests there. When it comes away, it doesn’t hurry.'),
      C('Thank you. I don’t know what else. Thank you.', 'soft'),
      N('He goes on down the lane. You walk back up to the cottage, where Hazel is still on the step.'),
    ],
  },
  // ---------------------------------------------------------------- S13: replaces s13-letter if Moss has left the world
  {
    id: 's13-letter-nomoss',
    lines: S13_LETTER,
    choices: [S13_KEEP, S13_BURN, S13_GRAVE_NOMOSS],
  },
  // ---------------------------------------------------------------- S13: replaces s13-settled-kept
  {
    id: 's13-settled-burned',
    lines: [
      N('The mill’s old stove still draws. Tobin gets it going with a handful of chaff and a great deal of advice.'),
      N('The letter catches at one corner, then all of it at once, quickly, the way he did everything.'),
      N('For a moment you can read “Your father” in the flame. Then you can’t.'),
      T('Nine.', 'soft'),
      N('Tobin sits on the step with you until the stove is cold. Neither of you counts how long.'),
    ],
  },
  {
    id: 's13-settled-grave',
    lines: [
      ...S13_GRAVE_START,
      N('Moss sits on the headstone and shuts his eyes.'),
      N('You read the letter aloud. He listens the way he listens to rain.'),
      M('He’d have hated that. Being read to. Sitting still for it.', 'soft'),
      M('He sat still for it.', 'soft'),
      ...S13_GRAVE_END,
    ],
  },
  {
    id: 's13-settled-grave-nomoss',
    lines: [
      ...S13_GRAVE_START,
      N('You read the letter aloud, the way you would have read it to Moss. Slowly, so the old one could keep up.'),
      T('He’d have hated that. Being read to. Sitting still for it.', 'soft'),
      T('He sat still for it.', 'soft'),
      ...S13_GRAVE_END,
    ],
  },

  // ---------------------------------------------------------------- S19 with Sable (Moss has faded)
  {
    id: 's19-warmth-sable',
    set: { 's19-with': 'sable' },
    lines: [
      N('Two days after the Long Night. The valley is white to the doorsteps, and very quiet.'),
      N('Sable has not eaten her breakfast. She sits at the top of the garden, facing north, where the snowfield climbs to the high pass.'),
      N('She has sat like that since dawn. When you come near, she doesn’t move away. She doesn’t look round, either.'),
      N('Beside her floats the pale light that was Moss’s. It leans north too, like a candle flame in a draught.'),
      N('Up there the snow is the blue of skimmed milk, and quite empty. Then, for a moment, it isn’t: a speck of red, like a forgotten coal.'),
      N('Sable stands. She looks at you, then at the pass, then at you, the way she looks at a gate she wants opened.'),
      Y('All right. All right. We’ll ask Marina.'),
    ],
  },
  {
    id: 's19-climb-sable',
    lines: [
      N('First light. Marina ropes you to her. Sable will not be roped.'),
      N('She goes ahead, a grey shape on the white, as if she knows the way.'),
      N('Moss’s pale light drifts along at her shoulder, where he used to walk.'),
      N('The snowfield is crusted on top and soft beneath. Every step goes through with a crunch like biting toast.'),
      MA('Lovely, isn’t it? That wind. Takes your face right off.', 'happy'),
      N('Sable is light enough not to break the crust. She leaves a line of small prints, neat as stitches.'),
      MA('She’s going left. I said right. I think she’s agreeing with me, in a different direction.', 'think'),
      MA('She’s not stopping. Is she always like this?'),
      Y('Only when it matters.'),
    ],
  },
  {
    id: 's19-hollow-sable',
    lines: [
      ...S19_HOLLOW_START,
      N('Sable goes into the hollow, and stops a tail’s length from the light. The fur lifts all along her back.'),
      N('She knows it. You don’t know how.'),
      N('Something in her knows the shape of the cold that was made here, and who made it.'),
      N('Moss’s pale light settles beside the red one. Two lights on a flat stone: one pale, one hardly there.'),
      N('You remember what he told you. Eternals only speak to those who sit still long enough.'),
    ],
  },
  {
    id: 's19-question-sable',
    lines: [
      ...S19_FIRST_WORDS,
      N('Nobody answers. Moss would have. You can feel the shape of what he’d say, as if he were sitting in your coat.'),
      Y('No.'),
      Y('They’re well.'),
      ...S19_UNDERSTANDS,
      N('Then the light sees Sable.'),
      N('Grey from her ears to her tail. Grey as frost on a railing. The colour of everything that stone ever touched.'),
      CI('…Oh. Oh, little one.', 'sad'),
      CI('That’s mine, isn’t it. That grey. I didn’t do it to you. But I did it.', 'sad'),
      ...S19_HER_SIDE,
      N('Sable gets up. She crosses the last tail’s length of stone, which is further than she has ever gone towards anything warm.'),
      N('She lies down against the flat stone, close enough for the light to warm her face, and leans her whole weight on it.'),
      N('The way she leant on your shin, in the autumn. The way she has leant on you ever since.'),
      N('The light shakes. For a moment you think it will go out.'),
      CI('She isn’t still.', 'soft'),
      CI('She’s grey, and she isn’t still. She came to me. Nobody made her.', 'soft'),
      CI('Who undid it? Who made her like this, after me?'),
      Y('Everybody. Slowly.'),
      CI('Do they still say my name? Down there?'),
      N('You say the lane rhyme to her plainly, without the sing-song the children use.'),
      Y('Cinder held them close and tight, kept them warm one winter night;'),
      Y('when the morning came to call, they did not move at all.'),
      CI('That’s fair.', 'soft'),
      CI('Do they skip well?'),
      Y('Badly. With great enthusiasm.'),
      N('Sable’s ear flicks, which in Sable is a laugh.'),
      ...S19_ASKS,
      CI('She has forgiven me. I don’t know how I know. I know.'),
      CI('But you live down there, with the grey ones in the grass, and what I did.'),
      S19_THE_QUESTION,
    ],
    choices: S19_CHOICES_SABLE,
  },
  {
    id: 's19-fade-sable',
    lines: [
      N('You stay. Sable doesn’t move from the stone. Moss’s pale light doesn’t either.'),
      ...S19_GOES,
      CI('Little one. It isn’t cold.', 'soft'),
      N('Sable shuts her eyes.'),
      ...S19_GONE,
      N('You hear Moss in your own mouth before you know you’re going to say it.'),
      Y('That is fading done right. Not stilled. Let go.'),
      N('Sable stays curled against the stone a long time. You let her.'),
    ],
  },

  // ---------------------------------------------------------------- S19 alone (Moss gone, Sable not bonded)
  {
    id: 's19-warmth-alone',
    set: { 's19-with': 'alone' },
    lines: [
      N('Two days after the Long Night. The valley is white to the doorsteps, and very quiet.'),
      N('You are at the cottage window with your tea when you see it. High on the pass, a speck of red, like a forgotten coal.'),
      N('You look away, and back. It is still there, steady, in all that white.'),
      N('Nobody else is looking. Moss would have been. You find you are already reaching for your boots.'),
      Y('Marina. Marina knows the path.'),
    ],
  },
  {
    id: 's19-climb-alone',
    lines: [
      N('First light. Marina ropes you to her, checks the knot twice, and then checks your socks.'),
      N('The snowfield is crusted on top and soft beneath. Every step goes through with a crunch like biting toast.'),
      MA('Lovely, isn’t it? That wind. Takes your face right off.', 'happy'),
      MA('What are we looking for, exactly?'),
      Y('Something warm.'),
      MA('Up here? Well. You’re Hazel’s. I’ve stopped asking.', 'think'),
    ],
  },
  {
    id: 's19-hollow-alone',
    lines: [
      ...S19_HOLLOW_START,
      N('You go into the hollow on your own, and sit down a little way from the light.'),
      N('You remember what Moss told you once. Eternals only speak to those who sit still long enough.'),
    ],
  },
  {
    id: 's19-question-alone',
    lines: [
      ...S19_FIRST_WORDS,
      N('Nobody answers. Moss would have. You can feel the shape of what he’d say, as if he were sitting beside you.'),
      Y('No.'),
      Y('They’re well.'),
      ...S19_UNDERSTANDS,
      ...S19_HER_SIDE,
      N('…'),
      CI('Do they still say my name? Down there?'),
      N('You know one way they do. You say it to her plainly, without the sing-song the children use in the lane.'),
      Y('Cinder held them close and tight, kept them warm one winter night;'),
      Y('when the morning came to call, they did not move at all.'),
      N('The light dips, and steadies.'),
      CI('That’s fair.', 'soft'),
      CI('Do they skip well?'),
      Y('Badly. With great enthusiasm.'),
      N('Something passes through the light that might, in a larger creature, be a laugh.'),
      ...S19_ASKS,
      CI('You live down there, with the grey ones in the grass, and what I did.'),
      S19_THE_QUESTION,
    ],
    choices: S19_CHOICES_ALONE,
  },
  {
    id: 's19-fade-alone',
    lines: [
      N('You stay. The wind goes over the overhang, and you keep your hands in your lap.'),
      ...S19_GOES,
      CI('Keeper. It isn’t cold.', 'soft'),
      ...S19_GONE,
      N('You hear Moss in your own mouth before you know you’re going to say it.'),
      Y('That is fading done right. Not stilled. Let go.'),
      N('You sit there a long time. Up on the lip, Marina lets you.'),
    ],
  },

  // ---------------------------------------------------------------- epilogue: Aldous’s letter (S13)
  {
    id: 'end-epi-mill-kept',
    lines: [
      N('Corvin reads his father’s letter on Sundays. He told Tobin so, and Tobin told everyone, which is how things get told in this valley.'),
      N('Tobin says the folds have gone soft as cloth. Tobin says a great many things. You believe this one.'),
    ],
  },
  {
    id: 'end-epi-mill-kept-ungiven',
    lines: [
      N('Aldous Vale’s letter is still in the tin box under your bed, beside Hazel’s. It is waiting for a man who can feel his hands.'),
      N('You take it out sometimes, and don’t read it, and put it back. It isn’t yours. You’re only carrying it.'),
    ],
  },
  {
    id: 'end-epi-mill-burned',
    lines: [
      N('Tobin lights the mill stove on cold mornings and tells the Nubbins stories in front of it. He never finishes one.'),
      N('Corvin never knew there was a letter. Some days you think that was a kindness.'),
      N('Some days you think it was a door you shut for him.'),
      N('Both, probably. Tobin says most things are both. Tobin says a great many things.'),
    ],
  },
  {
    id: 'end-epi-mill-grave',
    lines: [
      N('The rain took the ink by spring.'),
      N('Tobin says that’s how you post a letter to the dead. Tobin says a great many things.'),
      N('Someone keeps the grass short round Aldous Vale’s stone, under the alders.'),
      N('Not Tobin. Tobin’s knees wouldn’t allow it.'),
      N('The wheel turns beside it at the river’s pace. He would have hated that. He would have got used to it.'),
    ],
  },

  // ---------------------------------------------------------------- epilogue: Cinder (S19)
  {
    id: 'end-epi-cinder-forgiven',
    lines: [
      N('In the spring there is a new flower on the hill. It is red, and it comes up a little apart from the others, as if it isn’t sure it’s allowed.'),
      N('By midsummer the others have leant towards it. Briar’s yellow one most of all.'),
      N('The Long-Grass lantern burns warm now. On cold nights the grey ones sleep in a ring round the foot of the post.'),
      N('The children still skip to Cinder’s rhyme.'),
      N('Lately, at the end of it, they run up the hill and touch the red flower. Nobody told them to.'),
    ],
  },
  {
    id: 'end-epi-cinder-remembered',
    lines: [
      N('In the spring there is a new flower on the hill. It is red, and it comes up a little apart from the others, as if it isn’t sure it’s allowed.'),
      N('You never said she was forgiven. It wasn’t yours to say.'),
      N('But you tell her story, all of it, to anyone who asks, and some who don’t.'),
      N('The Long-Grass lantern burns warm now. You stand beside it on cold nights, and don’t explain why.'),
      N('The children still skip to her rhyme. Now, at the end, one of them always shouts “She loved them!” and the rest shout “Too tight!”'),
      N('Then they all run off, laughing. It’s the whole story. They’ve got it right.'),
    ],
  },
];

/** Every flag these stories set or read. */
export const SIDE_STORIES_NEW_3_FLAGS: string[] = [
  // set: S13
  'millLetter', // kept | burned | grave (s13-letter / s13-letter-nomoss)
  's13-rats', // fed | crept (local, flavour only)
  's13-given', // true when s13-letter-given plays in S9 (picks end-epi-mill-kept over -kept-ungiven)
  's13Done',
  // set: S19
  'cinder', // forgiven | remembered (s19-question / s19-question-sable)
  's19-with', // moss | sable | alone (local: which version played)
  's19Done',
  // set: S22 (fun: local only)
  's22-scree', // both | together
  's22-chimney', // true | look
  's22Done',
  // read
  'keptStone', // S19 opens only if false; S9 (and so s13-letter-given) never runs if true
  'mossFaded', // with mossReturned: is Moss still in the world (S13 step 5, S19 version)
  'mossReturned',
  'corvin', // S9 family count (with s3Done, s6Done, s8Done and millLetter = kept)
  's3Done',
  's6Done',
  's8Done',
  's9Started', // S9 running: s13-letter-given plays after s9-trowel
];

export const CHECKS: string[] = [
  // S13
  'explore:mill-cellar:level-1',
  'explore:mill-cellar:level-2',
  'explore:mill-cellar:level-3',
  'explore:mill-cellar:level-4',
  'resolve:item:mill-letter',
  // S19
  'talk:marina:high-pass',
  'climb:snowfield:high-pass',
  'sit:wait:cinder-hollow',
  'wait:cinder:fade',
  // S22
  'climb:tooth:scree',
  'climb:tooth:chimney',
  'climb:tooth:ridge',
  'place:decor:summit-flag',
];
