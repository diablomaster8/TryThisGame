/**
 * The Learning Grove, reader band (ages 7–10): Book Three, part two.
 * Chapters 11 (Hazel) and 12 (Keepers), every ending and every epilogue variant, including the
 * S13 mill-letter and S19 Cinder epilogues from SIDE_STORIES_NEW_3_VARIANTS.
 * Each EduScene replaces the main scene with the same id. Choice ids and flags are unchanged.
 * Canon: briefs/story-bible.md. Rules: EDU-STYLE.md.
 */
import type { EduCampaign, EduScene, GlossaryEntry, Lesson } from './types';
import type { Line } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Line['mood']): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const MOSS = say('moss');
const CORVIN = say('corvin');
const HAZEL = say('hazel');
const FERN = say('fern');
const SPARKS = say('sparks');
const CLOVER = say('clover');
const LUNA = say('luna');
const EMBER = say('ember');
const BYTE = say('byte');
const NOVA = say('nova');
const WISP = say('wisp');

/** Hilltop lines shared by c12-walk-you and c12-walk-alone, as in the main script. */
const WALK_TOP: Line[] = [
  N('At the top she sits down on the grass, where you can see the whole Grove, and pats the ground beside her.'),
  N('From up here everybody looks as small as buttons, bright and busy, doing things badly and together.'),
  HAZEL('There. That’s mine. That was mine.', 'soft'),
  HAZEL('It’s a good one. Don’t you dare let anyone tell you otherwise.', 'happy'),
  N('You sit with her a while. Neither of you says anything. It is the best part. It always was.'),
];

/** The end of c11-moss-gone and c11-moss-passed (MOSS_GONE_TAIL in the main script). */
const MOSS_GONE_TAIL: Line[] = [
  HAZEL('He sat beside me a whole winter before he said a word. Then forty years. Longer than that, beside everyone.', 'sad'),
  N('She is quiet for a while. You are quiet too. Your chest feels heavy. That is allowed.'),
  N('The thin grey Nubbin sleeps in her arm.'),
  HAZEL('He’ll be furious if we make a fuss. We’ll make a small one. Just us. Later.', 'soft'),
];

// ================================================================ chapter 11: Hazel
const CH11: EduScene[] = [
  {
    id: 'reader:c11-open',
    of: 'c11-open',
    band: 'reader',
    lines: [
      N('Gran Hazel is smaller than you remember. Her coats are patched at the elbows, and she smells of woodsmoke and wet leaves.'),
      HAZEL('There’s the chin. You lit the lanterns. I watched all four from the Hollow, all night.', 'soft'),
      HAZEL('I thought: either that’s my grandchild, or Sparks has finally blown the whole place up.', 'happy'),
      SPARKS('That’s fair. That is extremely fair.', 'happy'),
      N('Byte is standing very straight with his clipboard. His face is wet.'),
      HAZEL('Byte, love. You’re crying.', 'soft'),
      BYTE('Condensation.', 'think'),
      HAZEL('Of course it is.', 'happy'),
      N('She sits down on the bench by the door, quite suddenly, as if her legs have made the decision for her.'),
      HAZEL('I’m not staying long. I want to say that now, so nobody gets dramatic later. My letter said I’d gone up the hill. I was optimistic about the timing.', 'think'),
      N('She means it. Gran Hazel is very poorly. The doctors can’t make her better, and soon she is going to die.'),
      HAZEL('The doctor gave me a year. That’s twelve months. I’ve had fourteen, which I will be mentioning to him.', 'happy'),
      HAZEL('I spent them in the Hollow, feeding anyone who’d let me. Waiting for him to walk the stone home. He couldn’t. You did.', 'soft'),
      HAZEL('This one ate apple off my thumb today. Took two days. And you lot stayed up all night for a garden that isn’t yours.', 'soft'),
      CLOVER('It’s a bit ours.', 'sad'),
      HAZEL('Yes, Clover. That’s rather the point. A Grove isn’t the Nubbins, love. It’s the people who show up when the lanterns are lit.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:c11-open-l1',
        domain: 'sel',
        skill: 'honest, clear words about serious illness',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 10,
        prompt: [
          N('Nobody in the Grove pretends. Gran Hazel told everyone, straight out, the very first morning.'),
          N('Why do you think she said it so plainly?'),
        ],
        options: [
          {
            label: 'So nobody gets a shock later, and everyone can say goodbye.',
            best: true,
            reply: [
              N('Yes. Clear words are kind words. Now everyone knows, so they can spend the time well, together.'),
              N('Feeling sad or scared about it is allowed. Telling someone how you feel helps.'),
            ],
          },
          {
            label: 'Because she wants everyone to feel sad.',
            reply: [
              N('She doesn’t want anyone sad for longer than they need to be. That is why she said it plainly.'),
              N('Now nobody gets a shock later, and everyone can say goodbye. Clear words are kind words.'),
            ],
          },
          {
            label: 'She’s joking. She’ll be fine.',
            reply: [
              N('She makes jokes, because she is still Gran. But this part is true, and she wants you to know it.'),
              N('Clear words mean nobody gets a shock later, and everyone can say goodbye.'),
            ],
          },
        ],
        parentNote: 'Your child thought about why honest, plain words about a serious illness can be kind, and that sad or scared feelings are allowed.',
      },
      {
        id: 'reader:c11-open-l2',
        domain: 'literacy',
        skill: 'find the theme in a character’s words',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 15,
        prompt: [
          N('A story’s theme is its big idea: the thing it is really about, underneath what happens.'),
          N('Hazel says a Grove isn’t the Nubbins, it’s the people who show up. Which big idea is she telling us?'),
        ],
        options: [
          {
            label: 'A place is made special by the people who care and come to help.',
            best: true,
            reply: [
              HAZEL('That’s it, love. Lanterns don’t light themselves. Well. Mostly they don’t.', 'happy'),
              N('That is one of the big ideas of the whole story: we are made of the people who show up.'),
            ],
          },
          {
            label: 'Nubbins don’t really matter.',
            reply: [
              HAZEL('Oh, they matter. I fed them before I fed myself for forty years.', 'think'),
              N('She means something bigger: a place is made special by the people who care and come to help.'),
            ],
          },
          {
            label: 'Everyone should stay up all night.',
            reply: [
              HAZEL('Heavens, no. Sparks would be unbearable.', 'happy'),
              N('She means that a place is made special by the people who care and come to help. That is the theme.'),
            ],
          },
        ],
        parentNote: 'Your child identified the theme of a key line: that a community is made by the people who show up for each other.',
      },
    ],
  },
  {
    id: 'reader:c11-moss-here',
    of: 'c11-moss-here',
    band: 'reader',
    lines: [
      N('Moss has come down from the hill. He sits by Gran Hazel’s boot and looks up at her.'),
      HAZEL('Hello, old thing.', 'soft'),
      MOSS('You’re late.', 'think'),
      HAZEL('I’m always late. You’re thinner.', 'soft'),
      MOSS('You’re late, and I’m thinner. We’re even.', 'soft'),
      N('She laughs, and has to stop, and holds her side, and laughs anyway.'),
      N('Then she puts her hand on his head, the way she did every evening for forty years. He shuts his eyes.'),
    ],
    lessons: [
      {
        id: 'reader:c11-moss-here-l1',
        domain: 'literacy',
        skill: 'multiple-meaning words: even',
        standard: 'L.3.4',
        kind: 'ask',
        after: 4,
        prompt: [N('“We’re even,” says Moss. Some words have more than one meaning. What does even mean here?')],
        options: [
          {
            label: 'Equal. Neither of them is ahead.',
            best: true,
            reply: [N('Yes. She’s late, he’s thinner: one each. Nobody owes anybody. That is the joke.')],
          },
          {
            label: 'A number that splits into two equal groups.',
            reply: [
              N('That is a real meaning of even, like 2, 4 or 40! But Moss means equal here.'),
              N('She’s late, he’s thinner: one each. Neither of them is ahead.'),
            ],
          },
          {
            label: 'Flat and smooth.',
            reply: [
              N('That is a meaning too, like an even floor. But Moss means equal here.'),
              N('She’s late, he’s thinner: one each. Neither of them is ahead.'),
            ],
          },
        ],
        parentNote: 'Your child worked out which meaning of a multiple-meaning word (even) fits the sentence.',
      },
      {
        id: 'reader:c11-moss-here-l2',
        domain: 'maths',
        skill: 'odd and even numbers',
        standard: '2.OA.C.3',
        kind: 'ask',
        after: 6,
        prompt: [N('Every evening for forty years. Is 40 an odd number or an even number?')],
        options: [
          {
            label: 'Even',
            best: true,
            reply: [N('Yes. 40 splits into two equal groups of 20, with none left over. Any number ending in 0 is even.')],
          },
          {
            label: 'Odd',
            reply: [
              N('Let’s check. Split 40 into two equal groups: 20 and 20, with none left over.'),
              N('So 40 is even. Any number ending in 0 is even.'),
            ],
          },
        ],
        parentNote: 'Your child decided whether a number is odd or even by splitting it into two equal groups.',
      },
    ],
  },
  // NEW. Keep route (keptStone): Moss stays on the hill with his back to the Grove.
  {
    id: 'reader:c11-moss-kept',
    of: 'c11-moss-kept',
    band: 'reader',
    lines: [
      N('Moss doesn’t come down. He sits on the hill with his back to the Grove, the way he has sat since the Long Night.'),
      N('Gran Hazel looks up at him for a long time.'),
      N('At last he turns his head and looks back at her. Then he looks away again.'),
      HAZEL('Hello, old thing. So it’s like that, is it.', 'sad'),
      N('She doesn’t climb up to him. She doesn’t call. She knows what a turned back means.'),
      N('Long ago, Moss sat beside her for a whole winter and waited. Now she waits for him.'),
    ],
    lessons: [
      {
        id: 'reader:c11-moss-kept-l1',
        domain: 'sel',
        skill: 'reading feelings from body language',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('Moss hasn’t said a word. Why do you think he sits with his back to the Grove?')],
        options: [
          {
            label: 'He is hurt and sad that the stone was kept.',
            best: true,
            reply: [
              N('Yes. Turning your back can say “I’m upset” louder than words. That is called body language.'),
              N('Hazel reads it straight away, and gives him room instead of pushing.'),
            ],
          },
          {
            label: 'He likes the view the other way.',
            reply: [
              N('The view is lovely. But he always sat facing the Grove, for as long as anyone can remember. Something has changed.'),
              N('Turning your back can say “I’m upset” louder than words. That is called body language.'),
            ],
          },
          {
            label: 'He is cross with Hazel.',
            reply: [
              N('He does look away from her. But he turned his back on the whole Grove the morning the stone came home.'),
              N('He is hurt by what happened, not by her. Turning your back is body language for “I’m upset”.'),
            ],
          },
        ],
        parentNote: 'Read a character’s feelings from body language (a turned back) and saw how giving someone room can help.',
      },
    ],
  },
  {
    id: 'reader:c11-moss-gone',
    of: 'c11-moss-gone',
    band: 'reader',
    lines: [
      N('Gran Hazel looks up the hill, at the place where Moss always sat. She doesn’t ask.'),
      HAZEL('I know, love. I knew, coming down the hill. The air was different.', 'soft'),
      N('Moss has faded. In the Grove, that means he died. His body stopped working, and it won’t start again.'),
      ...MOSS_GONE_TAIL,
    ],
    lessons: [
      {
        id: 'reader:c11-moss-gone-l1',
        domain: 'sel',
        skill: 'grief: what you might feel and what helps',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 6,
        lines: [
          HAZEL('When someone you love dies, you might feel sad, or cross, or tired, or nothing much at all for a while. All of those are allowed.', 'soft'),
          HAZEL('What helps is doing something together. Telling stories about him. Sitting where he sat. That’s a small fuss. He’d allow that.', 'soft'),
        ],
        parentNote: 'Your child heard clear, gentle words about death and that many different feelings are normal in grief, and what helps.',
      },
    ],
  },
  // NEW. After c10-moss-fades: Moss went up the hill at dawn and passed Hazel on her way down.
  {
    id: 'reader:c11-moss-passed',
    of: 'c11-moss-passed',
    band: 'reader',
    lines: [
      N('Gran Hazel looks up the hill, at the place where Moss always sat. She doesn’t ask.'),
      HAZEL('I passed him on the path, coming down. He told me I was late.', 'soft'),
      N('Moss has faded. In the Grove, that means he died. He went up the hill at dawn, and he isn’t coming back.'),
      ...MOSS_GONE_TAIL,
    ],
    lessons: [
      {
        id: 'reader:c11-moss-passed-l1',
        domain: 'literacy',
        skill: 'think question: what a last joke can mean',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 1,
        prompt: [
          N('Moss and Hazel met on the path, one going up and one coming down. All he said was, “You’re late.”'),
          N('Why do you think he said that, of all things? There is no wrong answer.'),
        ],
        options: [
          {
            label: 'It was their old joke, so it meant “I love you” without any fuss.',
            reply: [N('That’s a lovely answer. Old friends often say the big things in small words. Moss never did like a fuss.')],
          },
          {
            label: 'He was teasing her, to make the goodbye easier.',
            reply: [N('That’s a kind answer. A joke can make a hard moment lighter for both people. Hazel is smiling as she tells it.')],
          },
          {
            label: 'She really was late. He’d been waiting since the snow.',
            reply: [N('That’s a sharp answer, and it might be true as well. Moss had been waiting a long time. Both things can be true at once.')],
          },
        ],
        parentNote: 'Thought about what a character really meant by a few small words, with no single right answer.',
      },
      {
        id: 'reader:c11-moss-passed-l2',
        domain: 'sel',
        skill: 'smiling and sad at the same time',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 6,
        lines: [
          N('Hazel smiles when she tells you about the path, and she is sad. Grief often comes mixed with good memories like that.'),
          N('Laughing about someone you miss doesn’t mean you miss them less. It means you remember them well.'),
        ],
        parentNote: 'Learned that grief can come with smiles and good memories, and that both are normal.',
      },
    ],
  },
  {
    id: 'reader:c11-sable',
    of: 'c11-sable',
    band: 'reader',
    lines: [
      N('Sable comes out of the long grass. She looks at Gran Hazel for a long time.'),
      N('Then she walks straight past her and leans her whole weight on your shin.'),
      HAZEL('Well. That’s me told.', 'happy'),
      HAZEL('That one took longer than two months, I’ll bet.', 'soft'),
      N('You think of the first night, and of every night since.'),
      N('Sable came in June, at the start of summer. Now it is December, the middle of winter. You nod.'),
      HAZEL('Worth it.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:c11-sable-l1',
        domain: 'maths',
        skill: 'time intervals in months',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 5,
        prompt: [N('Sable came in June. It is now December. How many months has it taken her to trust you like this?')],
        options: [
          {
            label: '6 months',
            best: true,
            reply: [N('Yes. Count on from June: July, August, September, October, November, December. Six months. Hazel was right.')],
          },
          {
            label: '4 months',
            reply: [
              N('Let’s count on from June together: July, August, September, October, November, December.'),
              N('That’s six months. Much longer than two. Hazel was right.'),
            ],
          },
          {
            label: '12 months',
            reply: [
              N('Twelve months is a whole year. Let’s count on from June: July, August, September, October, November, December.'),
              N('That’s six months, half a year. Much longer than two.'),
            ],
          },
        ],
        parentNote: 'Your child counted on through the months to find a length of time.',
      },
    ],
  },
  {
    id: 'reader:c11-cold-hands',
    of: 'c11-cold-hands',
    band: 'reader',
    lines: [
      N('Gran Hazel takes your hand to help herself stand up. Then she doesn’t stand up.'),
      HAZEL('Your hands are cold, love.', 'think'),
      N('You take your hand back and put it on your coat, over the breast pocket. You don’t mean to. It just goes there.'),
      N('Over the stone. It has become a habit already.'),
      N('Hazel watches your hand go. She has seen someone do that before, a long time ago, in this garden.'),
      HAZEL('…Ah.', 'sad'),
      N('She doesn’t say anything else. Her silences were always the loudest thing about her.'),
    ],
    lessons: [
      {
        id: 'reader:c11-cold-hands-l1',
        domain: 'literacy',
        skill: 'infer a character’s thoughts from clues',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 5,
        prompt: [N('“She has seen someone do that before.” Who do you think it was?')],
        options: [
          {
            label: 'Corvin',
            best: true,
            reply: [
              N('Yes. Corvin kept the stone in his breast pocket for twenty-two years, and his hands were always cold.'),
              N('Hazel is worried you are starting to become like him. The writer never says so. The clues do.'),
            ],
          },
          {
            label: 'Sparks',
            reply: [
              N('Sparks has warm hands and loud opinions. Think about the clues: cold hands, a hand on the breast pocket.'),
              N('That was Corvin. He kept the stone there for twenty-two years. Hazel is worried you are becoming like him.'),
            ],
          },
          {
            label: 'Moss',
            reply: [
              N('Moss doesn’t have pockets! Think about the clues: cold hands, a hand on the breast pocket.'),
              N('That was Corvin. He kept the stone there for twenty-two years. Hazel is worried you are becoming like him.'),
            ],
          },
        ],
        parentNote: 'Your child used clues in the text to infer what a character was thinking but did not say.',
      },
      {
        id: 'reader:c11-cold-hands-l2',
        domain: 'literacy',
        skill: 'figurative language: a silence that is loud',
        standard: 'L.4.5',
        kind: 'notice',
        after: 6,
        lines: [
          N('A silence can’t really be loud. The writer means Hazel’s quiet says more than words would.'),
          N('Writers bend words like this on purpose, to make you feel something. It’s called figurative language.'),
        ],
        parentNote: 'Your child met figurative language: a phrase that is not literally true but says something true.',
      },
    ],
  },
  {
    id: 'reader:c11-close',
    of: 'c11-close',
    band: 'reader',
    lines: [
      N('Days go by like that. Gran Hazel sleeps a lot, and wakes up for the good bits.'),
      HAZEL('Good. They like you. Sparks likes everyone, so that doesn’t count. But Ember likes you, and Ember doesn’t like anyone.', 'happy'),
      HAZEL('I’m not even sure Ember likes Ember.', 'happy'),
      EMBER('I can hear you.', 'angry'),
      HAZEL('I know, dear.', 'happy'),
      HAZEL('Sit with me. Here. By the pond. Don’t say anything.', 'soft'),
      N('You sit. The ice on the pond has melted. The water is black and still, with the whole evening sky in it.'),
      N('The thin grey Nubbin wakes, looks at you, and goes back to sleep.'),
      N('Nobody says anything. Somewhere in the wood an owl says something, once, and then thinks better of it.'),
      HAZEL('I used to sit here and go over everything I’d got wrong. Forty years. There’s a lot.', 'soft'),
      HAZEL('The ones I lost. The tablets I left lying about. Him. I taught him everything except the one thing.', 'sad'),
      HAZEL('Then one evening I stopped going over it and just sat. That was the whole trick, it turned out.', 'soft'),
      N('She takes your hand. Hers is warm, and very light, like something that is mostly air now.'),
      HAZEL('Tomorrow I want to see the whole Grove. Every post, every tree, every last grub in the pond.', 'think'),
      HAZEL('Then I’m going up the hill for a very long sit-down, and you are not to be dramatic about it.', 'soft'),
      N('In the Grove, going up the hill means going to die. You know. She knows you know. You don’t say anything. You are getting good at it.'),
    ],
    lessons: [
      {
        id: 'reader:c11-close-l1',
        domain: 'science',
        skill: 'melting and freezing can go back and forth',
        standard: '2-PS1-4',
        kind: 'notice',
        after: 6,
        lines: [
          N('On the longest night the pond was ice. When ice warms above 0°C (32°F), it melts back into water.'),
          N('If tonight is cold enough, it can freeze again. Melting and freezing can go back and forth, again and again.'),
        ],
        parentNote: 'Your child learned that melting and freezing are changes that can be reversed, and the freezing point of water.',
      },
      {
        id: 'reader:c11-close-l2',
        domain: 'sel',
        skill: 'calming down with slow breaths',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 11,
        check: 'edu:breathe:slow:3',
        lines: [
          HAZEL('Try it with me. Breathe in slowly through your nose. Hold it a moment. Now let it out, slow as the pond.', 'soft'),
          HAZEL('Three of those. Nothing to fix. Nothing to go over. Just sitting.', 'soft'),
        ],
        parentNote: 'Your child practised three slow breaths, a simple way to calm big feelings.',
      },
    ],
  },
  {
    id: 'reader:c11-gate',
    of: 'c11-gate',
    band: 'reader',
    lines: [
      N('When you look up from the pond, Corvin is back at the gate.'),
      N('No grey coat now. A brown one, too big, borrowed or very old.'),
      N('He tries the latch once, the way you knock on a door you know is locked. It sticks.'),
      N('Then he folds his arms on the top bar, like a man settling in for the night.'),
      N('Beside you, Gran Hazel doesn’t turn round. But she stops breathing for a moment, to listen.'),
      HAZEL('Don’t look at me, love. I’ve done my bit. It’s your gate now.', 'soft'),
      HAZEL('He said he’d stand there till first light, and he will. Meaning things was never his problem.', 'think'),
    ],
    choices: [
      {
        id: 'gate-leave',
        label: 'Stay where you are.',
        then: [N('You stay where you are. In the dark the gate creaks once more, and then is quiet. But you don’t hear him go.')],
      },
      {
        id: 'gate-cruel',
        label: 'It’s freezing. Isn’t that cruel?',
        then: [
          HAZEL('It would be, if anyone had made him. Nobody did. He chose the hour himself.', 'think'),
          HAZEL('Let him have chosen something, love. It’s been a long time.', 'soft'),
          N('You stay. In the dark the gate creaks once more, and then is quiet. But you don’t hear him go.'),
        ],
      },
      {
        id: 'gate-tea',
        label: 'Take him a cup of tea. Leave the gate shut.',
        then: [
          HAZEL('…Oh, you’re worse than me.', 'happy'),
          HAZEL('Go on, then. The cup by the stove. The one that’s turned upside down.', 'soft'),
          N('You pass it over the top bar. He holds it in both hands, and the warmth goes into his cold fingers. Neither of you speaks.'),
          N('In the morning the cup is on the gatepost, rinsed in the stream, and turned upside down.'),
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c11-gate-l1',
        domain: 'science',
        skill: 'condensation: why breath shows on a cold night',
        standard: '2-PS1-4',
        kind: 'notice',
        after: 2,
        lines: [
          N('Corvin’s breath makes little white clouds in the dark.'),
          N('Your breath carries water as an invisible gas. In cold air it cools into tiny drops you can see. That’s condensation.'),
        ],
        parentNote: 'Your child learned that we see our breath on cold days because water vapour condenses into tiny droplets.',
      },
      {
        id: 'reader:c11-gate-l2',
        domain: 'sel',
        skill: 'think question: fairness and second chances',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 6,
        prompt: [
          N('Corvin did a very wrong thing here, twenty-two years ago. Now he has come back, and he says he will wait at the gate till first light.'),
          N('Hazel says it is your gate now. Is it fair to let him wait out there? There is no wrong answer.'),
        ],
        options: [
          {
            label: 'Yes. He chose to wait, and that matters.',
            reply: [
              N('That’s a thoughtful answer. Hazel would agree: nobody made him wait. He chose the hour himself.'),
              N('Coming back after a wrong thing takes time, and it takes wanting.'),
            ],
          },
          {
            label: 'No. It’s freezing. Someone should help him.',
            reply: [
              N('That’s a kind answer, and a fair one. You are thinking about how cold and alone he is.'),
              N('You might find a way to be kind to him and still let him finish his own waiting. There usually is one.'),
            ],
          },
          {
            label: 'A bit of both.',
            reply: [
              N('That’s an honest answer. Lots of real choices are a bit of both.'),
              N('Hazel has handed this one to you. Grown-ups don’t always know the right thing either.'),
            ],
          },
        ],
        parentNote: 'Your child weighed a hard question about fairness, forgiveness and second chances, with no single right answer.',
      },
    ],
  },
];

// ================================================================ chapter 12: Keepers
const CH12: EduScene[] = [
  {
    id: 'reader:c12-open',
    of: 'c12-open',
    band: 'reader',
    lines: [
      N('Morning. Cold and very bright. Every Keeper is here, and every Nubbin. Nobody planned it. Everybody just came.'),
      N('Sparks has brought a cake, which has collapsed on one side. Pixel has fixed the cake. It is still collapsed, but now it lights up.'),
      N('Fern has made lantern buns, three trays of eight. For the first time ever, they have come out. She keeps showing people one, as evidence.'),
      N('Dusty is digging a new bed by the old wall. Nova has brought seeds from somewhere you’ve never heard of.'),
      N('Clover is crying already, and says it’s the cold. Byte has a clipboard and has written nothing on it.'),
      N('Marina sits with her feet in the freezing pond and says it’s lovely.'),
      N('At first light, Ember’s Ash ran at the gate the way she used to. Not full tilt. Half. She bounced off it.'),
      N('Ember has told nobody. Everybody knows.'),
      N('Gran Hazel walks the Grove slowly. She touches each post as she passes, like the shoulder of someone she is about to leave.'),
      N('At the fourth post, by the long grass, she stands a long time.'),
      HAZEL('And the long grass. Cinder’s. She loved them too, you know. That was never the trouble.', 'sad'),
      N('Then she comes to the pond, and stands in the place where she doesn’t say anything, and waits for you to.'),
      HAZEL('It’s yours now. Properly.', 'soft'),
      HAZEL('I had forty years of it. I shut the gate when I was frightened and opened it when I was brave.', 'think'),
      HAZEL('And I was wrong both ways about half the time.', 'happy'),
      HAZEL('So. Tell me. What is it going to be?', 'soft'),
    ],
    choices: [
      {
        id: 'keep',
        label: 'A home. For all of them. I’ll keep the gate stuck.',
        set: { finalChoice: 'keep' },
        then: [
          HAZEL('Lift and push. Good.', 'happy'),
          HAZEL('It sticks so you hear who comes back. That was always the point of it. I never told anyone that.', 'soft'),
          HAZEL('Keep it stuck, love. Keep listening.', 'soft'),
        ],
      },
      {
        id: 'free',
        label: 'Open. No gate. They stay if they want to.',
        set: { finalChoice: 'free', letThemGo: true },
        then: [
          HAZEL('…That’s not how I did it.', 'think'),
          HAZEL('It might be how it should be done. Go on, then. Let’s see who stays.', 'soft'),
          N('You lift the gate off its hinges, with Dusty’s help, and lean it on the wall, where the ivy can have it.'),
          N('For a long moment, nobody goes anywhere. Then a stray wanders out into the lane, sniffs the air, and wanders straight back in.'),
          HAZEL('Ha.', 'happy'),
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c12-open-l1',
        domain: 'maths',
        skill: 'multiplication as equal groups, then sharing',
        standard: '3.OA.A.1',
        kind: 'do',
        after: 2,
        check: 'edu:count:buns:24',
        lines: [
          FERN('Count them with me before Sparks eats the evidence. Three trays. Eight on each tray.', 'happy'),
          N('3 groups of 8 makes 24 buns. Ten Keepers, Gran Hazel and you makes twelve people. 24 shared by 12 is two buns each.'),
          FERN('Two each. Nobody tell Sparks there are spares on the windowsill.', 'think'),
        ],
        parentNote: 'Your child counted equal groups (3 × 8 = 24) and shared them out fairly (24 ÷ 12 = 2).',
      },
      {
        id: 'reader:c12-open-l2',
        domain: 'sel',
        skill: 'think question: a home or freedom',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 15,
        prompt: [
          N('This is the biggest choice in the story. Before you answer Gran Hazel, think about it.'),
          N('A stuck gate, or no gate at all? What matters most to you? There is no wrong answer.'),
        ],
        options: [
          {
            label: 'A gate keeps them safe, and I can hear who comes back.',
            reply: [
              N('That’s a caring answer. You want to keep them close and listen for anyone lost.'),
              N('Just remember what Moss said: safe is not the same as well. A home can be both, if the gate is for listening, not locking.'),
            ],
          },
          {
            label: 'No gate. They should choose for themselves.',
            reply: [
              N('That’s a brave answer. You trust them to choose, and you let them be free.'),
              N('It means some might leave. Letting go can be a way of loving too.'),
            ],
          },
          {
            label: 'I really don’t know. Both are good.',
            reply: [
              N('That’s an honest answer. Gran Hazel was wrong both ways, half the time, and she still did a good job.'),
              N('When you choose, choose the one that feels most like love to you.'),
            ],
          },
        ],
        parentNote: 'Your child reflected on a big choice between keeping others safe and letting them be free, with no single right answer.',
      },
    ],
  },
  {
    id: 'reader:c12-foot-told',
    of: 'c12-foot-told',
    band: 'reader',
    lines: [
      N('When Gran Hazel stands up from the bench, everybody stands up.'),
      N('They know. You told them, the way she asked, and they have been dreadful about it, the way she said they would be.'),
      N('They walk with her as far as the foot of the hill. Nobody says anything. Nobody needs to.'),
      N('At the bottom of the path she turns and looks at them, one after another, as if she is counting.'),
      HAZEL('That’s far enough.', 'soft'),
      HAZEL('Go on. Go home. Light something.', 'soft'),
      N('They stop. They don’t go home. They stay at the foot of the hill, all of them, holding lanterns in broad daylight, and watch.'),
    ],
    lessons: [
      {
        id: 'reader:c12-foot-told-l1',
        domain: 'sel',
        skill: 'reading feelings from what people do',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 6,
        prompt: [N('Nobody says a single word. So how can you tell how much they love her?')],
        options: [
          {
            label: 'By what they do: they walk with her, they stay, they hold up their lanterns.',
            best: true,
            reply: [N('Yes. People show love with what they do, not only with words. Staying close is one of the biggest ways.')],
          },
          {
            label: 'You can’t tell, because nobody talks.',
            reply: [
              N('Look again at what they do. They walk with her. They stay. They hold lanterns up in daylight, just for her.'),
              N('People show love with what they do, not only with words.'),
            ],
          },
        ],
        parentNote: 'Your child read people’s feelings from their actions, not their words.',
      },
    ],
  },
  {
    id: 'reader:c12-foot-secret',
    of: 'c12-foot-secret',
    band: 'reader',
    lines: [
      N('When Gran Hazel gets up from the bench, nobody notices. Sparks is arguing with Pixel about the cake. Fern has lost a glove.'),
      N('Hazel catches your eye across the Grove, and winks.'),
      HAZEL('Not a word. They’d only fuss.', 'soft'),
      N('She asked you to keep it quiet, and you did. It is her goodbye, and her choice how to make it.'),
      N('She takes her lantern and her three coats, and walks to the foot of the hill, unhurried, as if to look at a tree.'),
      N('You watch her go. A secret this big is heavy. You carry it anyway, because she asked.'),
    ],
    lessons: [
      {
        id: 'reader:c12-foot-secret-l1',
        domain: 'health',
        skill: 'safe secrets and unsafe secrets',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 5,
        lines: [
          N('Gran Hazel’s secret was a grown-up’s choice about her own goodbye, and she has left a letter so everyone will know.'),
          N('In real life, a happy surprise, like a present, is fine to keep.'),
          N('A secret that makes you feel worried or scared, or where someone could get hurt, is not.'),
          N('Tell a grown-up you trust about those. That is never telling tales. It is keeping people safe.'),
        ],
        parentNote: 'Your child learned the difference between a happy surprise and an unsafe secret, and to tell a trusted adult about worrying secrets.',
      },
    ],
  },
  {
    id: 'reader:c12-walk-you',
    of: 'c12-walk-you',
    band: 'reader',
    lines: [
      HAZEL('Come on, then. Arm.', 'soft'),
      N('She takes your arm. She doesn’t lean. She just holds on.'),
      N('You go up slowly. Past Fossil’s flower. Past Briar’s, the first one, small and yellow by the big stone, open even in winter.'),
      HAZEL('I used to come up here and tell them what I’d done that week. Briar mostly. She liked the bad bits best.', 'happy'),
      HAZEL('Come and tell them about you, sometimes. Not me. You. Let them know how it’s going.', 'soft'),
      ...WALK_TOP,
      HAZEL('Right. Off you go.', 'soft'),
      HAZEL('Don’t look back on the way down. It turns everything into a scene.', 'happy'),
      N('You get up. You go down. You look back once. Of course you do.'),
      N('She isn’t looking. She has one hand up, waving, without turning round, the way she always did from the gate.'),
    ],
    lessons: [
      {
        id: 'reader:c12-walk-you-l1',
        domain: 'literacy',
        skill: 'spot a simile',
        standard: 'L.4.5',
        kind: 'ask',
        after: 6,
        prompt: [N('“Everybody looks as small as buttons.” What kind of words are these?')],
        options: [
          {
            label: 'A simile: it compares two things using “as” or “like”.',
            best: true,
            reply: [N('Yes. The Keepers aren’t really buttons. The simile helps you see how tiny they look from up high.')],
          },
          {
            label: 'A rhyme.',
            reply: [
              N('Small and buttons don’t rhyme. This is a simile: it compares two things using “as” or “like”.'),
              N('The Keepers aren’t really buttons. The simile helps you see how tiny they look from up high.'),
            ],
          },
          {
            label: 'A question.',
            reply: [
              N('There’s no question mark. This is a simile: it compares two things using “as” or “like”.'),
              N('The Keepers aren’t really buttons. The simile helps you see how tiny they look from up high.'),
            ],
          },
        ],
        parentNote: 'Your child recognised a simile and explained what it helps the reader picture.',
      },
      {
        id: 'reader:c12-walk-you-l2',
        domain: 'art',
        skill: 'perspective: far things look smaller',
        kind: 'notice',
        after: 9,
        lines: [
          N('The Keepers haven’t shrunk. Things look smaller the further away they are.'),
          N('Artists use this. Draw something small and it looks far off; draw it big and it looks close. It’s called perspective.'),
        ],
        parentNote: 'Your child learned that far-away things look smaller, and that artists use size to show distance (perspective).',
      },
    ],
  },
  {
    id: 'reader:c12-walk-moss',
    of: 'c12-walk-moss',
    band: 'reader',
    lines: [
      N('Moss is sitting on the first stone of the hill path. You don’t know how long he has been there. Longer than you, probably.'),
      MOSS('I’m coming. Don’t argue.', 'think'),
      HAZEL('I wasn’t going to argue.', 'soft'),
      MOSS('You were. You had the chin out.', 'soft'),
      N('He climbs onto her shoulder, slowly, the way he climbs everything. She doesn’t stagger. He weighs about as much as a memory.'),
      HAZEL('This is as far as you come, love.', 'soft'),
      N('So you stop at the foot. You watch them go up together, small and slow, the lantern swinging.'),
      N('Halfway, she stops for breath. He says something in her ear. She laughs so hard she has to sit down on the path.'),
      N('At the top they sit, an old woman and an old Nubbin, looking out over the Grove.'),
      N('They sat just like that when she was young, and he had only just decided she was worth it.'),
      MOSS('I’ll decide at the top. Go home. Light something.', 'soft'),
      N('You wait at the foot until her lantern is the only light on the hill.'),
      N('He doesn’t come down. Not tonight.'),
    ],
    lessons: [
      {
        id: 'reader:c12-walk-moss-l1',
        domain: 'literacy',
        skill: 'understand an unusual comparison',
        standard: 'L.4.5',
        kind: 'ask',
        after: 4,
        prompt: [N('“He weighs about as much as a memory.” What is the writer telling you about Moss?')],
        options: [
          {
            label: 'He is so faint and light he is hardly there at all.',
            best: true,
            reply: [N('Yes. A memory weighs nothing. Moss has faded so far that he is nearly as light as one.')],
          },
          {
            label: 'Memories are very heavy, so Moss is heavy.',
            reply: [
              N('Can you pick up a memory? It weighs nothing at all.'),
              N('So the writer means Moss has faded so far that he is nearly as light as a memory.'),
            ],
          },
        ],
        parentNote: 'Your child worked out what an unusual comparison tells the reader about a character.',
      },
      {
        id: 'reader:c12-walk-moss-l2',
        domain: 'science',
        skill: 'we see things when light reaches our eyes',
        standard: '1-PS4-2',
        kind: 'notice',
        after: 11,
        lines: [
          N('Her lantern is tiny, and far away, but you can still see it.'),
          N('Light travels from the lantern all the way to your eyes.'),
          N('In the dark, with no other light around it, even a small flame shows up a long way off.'),
        ],
        parentNote: 'Your child learned that we see a light because light travels from it to our eyes, and why small lights show up in the dark.',
      },
    ],
  },
  {
    id: 'reader:c12-walk-sable',
    of: 'c12-walk-sable',
    band: 'reader',
    lines: [
      N('Sable is standing in the long grass at the foot of the hill path. She isn’t looking at you. She’s looking at Gran Hazel.'),
      HAZEL('Hello, grey one.', 'soft'),
      N('Sable walks to Hazel’s boots, and then one step past them, up the path. Then she stops, and looks back.'),
      HAZEL('Oh. She’s taking me.', 'soft'),
      HAZEL('Well. I’ve been taken places by worse.', 'happy'),
      N('You stop at the foot. They go up together: the old woman with the lantern, and the small grey shape ahead, waiting at every bend.'),
      N('Two steps ahead. Never more. She has had a lot of practice at two steps.'),
      N('At the top, Sable sits down beside her. You can see them for a long time, the lantern and the dark, side by side.'),
      N('After dusk, a small grey shape comes down the path alone, very slowly.'),
      N('She doesn’t go to her place in the long grass. She comes to the cottage step, and sits on it, and waits for you.'),
      N('She has never once walked towards a Keeper’s door. Until now.'),
    ],
    lessons: [
      {
        id: 'reader:c12-walk-sable-l1',
        domain: 'science',
        skill: 'dusk, and why day turns to night',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 8,
        lines: [
          N('Dusk is the time just after the Sun sets, when the sky is fading from blue to dark.'),
          N('It happens every day because the Earth spins. Our side of the Earth turns away from the Sun, and night comes.'),
        ],
        parentNote: 'Your child learned what dusk is and that day and night happen because the Earth spins.',
      },
      {
        id: 'reader:c12-walk-sable-l2',
        domain: 'literacy',
        skill: 'how a character changes',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 10,
        prompt: [N('Think back to the night Sable first came. How has she changed?')],
        options: [
          {
            label: 'She used to hide and keep away. Now she leads the way and comes to your door.',
            best: true,
            reply: [N('Yes. She is still grey and still careful. But she trusts you now, and she shows it by coming to you.')],
          },
          {
            label: 'She hasn’t changed at all.',
            reply: [
              N('She’s still grey, and still careful, that’s true. But on the first night she hid in the long grass and wouldn’t come near.'),
              N('Tonight she led Hazel up the hill and came to your door. That’s a big change.'),
            ],
          },
        ],
        parentNote: 'Your child described how a character has changed over the whole story.',
      },
    ],
  },
  {
    id: 'reader:c12-walk-corvin',
    of: 'c12-walk-corvin',
    band: 'reader',
    lines: [
      N('Corvin stands by the hedge at the foot of the hill, a long way off, the way he stands at the edge of everything now.'),
      HAZEL('Well, don’t stand there like a heron. Come and take the lantern.', 'soft'),
      HAZEL('You used to carry it for me, when you were my apprentice. Twenty-two, and you knew everything.', 'soft'),
      CORVIN('…I used to.', 'soft'),
      N('He comes. He takes it. His hands aren’t blue any more. They are only a man’s hands, a little red with cold, and steady.'),
      N('You stop at the foot. You watch them go: the old woman on the arm of her old apprentice, stopping when she needs to.'),
      N('He waits every time. He does not hurry her once.'),
      N('It is a long while before he comes down. His hands are empty, and his face is wet, and he doesn’t try to hide it.'),
      N('He has left her lantern up there with her, still burning. He sits by the pond, a little way off, and says nothing. He is getting better at it.'),
    ],
    lessons: [
      {
        id: 'reader:c12-walk-corvin-l1',
        domain: 'science',
        skill: 'how a heron’s body helps it catch food',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('A heron is a tall grey bird that stands in shallow water. It keeps very, very still, waiting.'),
          N('Its long legs let it wade without getting its feathers wet. When a fish swims close, its long sharp beak strikes fast.'),
          N('Corvin, standing still at the edge and waiting, does look a bit like one.'),
        ],
        parentNote: 'Your child learned how a heron’s long legs and sharp beak help it survive, and enjoyed a simile.',
      },
      {
        id: 'reader:c12-walk-corvin-l2',
        domain: 'sel',
        skill: 'crying is a healthy way to let feelings out',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 7,
        lines: [
          N('Corvin cries, and he doesn’t hide it. For years he couldn’t feel anything at all. Now he can.'),
          N('Crying is one way bodies let out big feelings. Grown-ups cry too. It is nothing to be ashamed of.'),
        ],
        parentNote: 'Your child heard that crying is a normal, healthy way to express big feelings, for adults as well as children.',
      },
    ],
  },
  {
    id: 'reader:c12-walk-alone',
    of: 'c12-walk-alone',
    band: 'reader',
    lines: [
      N('Later, when the others are busy with the cake, Gran Hazel stands up from the bench and picks up her lantern.'),
      HAZEL('Walk me up, love.', 'soft'),
      N('You know what she means. You have known since the letter. Perhaps since the gate.'),
      N('At the foot of the hill she takes your arm. She doesn’t lean. She just holds on.'),
      N('You go up slowly, past Fossil’s flower, and Briar’s, the first one, small and yellow by the big stone.'),
      ...WALK_TOP,
      HAZEL('Now it’s yours. Go on down. And don’t look back; it turns everything into a scene.', 'happy'),
      N('You go down. You look back once. Of course you do.'),
      N('She has one hand up, waving, without turning round, the way she always did from the gate.'),
    ],
    lessons: [
      {
        id: 'reader:c12-walk-alone-l1',
        domain: 'literacy',
        skill: 'multiple-meaning words: scene',
        standard: 'L.3.4',
        kind: 'ask',
        after: 10,
        prompt: [N('“It turns everything into a scene.” Scene has more than one meaning. Which one does Gran Hazel mean?')],
        options: [
          {
            label: 'A big, dramatic moment, like the sad part of a play.',
            best: true,
            reply: [N('Yes. She doesn’t want a fuss. She wants her goodbye to stay small and ordinary, and kind.')],
          },
          {
            label: 'The place where something happens, like the scene of a crime.',
            reply: [
              N('That is a real meaning! But Hazel means a big, dramatic moment, like the sad part of a play.'),
              N('She wants her goodbye to stay small and ordinary.'),
            ],
          },
          {
            label: 'A pretty view.',
            reply: [
              N('That’s a meaning too, and the view from up here is lovely. But Hazel means a big, dramatic moment, like in a play.'),
              N('She wants her goodbye to stay small and ordinary.'),
            ],
          },
        ],
        parentNote: 'Your child chose the right meaning of a multiple-meaning word (scene) from its context.',
      },
      {
        id: 'reader:c12-walk-alone-l2',
        domain: 'sel',
        skill: 'saying goodbye to someone you love',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 12,
        lines: [
          N('Saying goodbye to someone you love is one of the hardest things there is.'),
          N('It’s all right to look back. It’s all right to cry all the way down. Hazel waved, so you would know she loved you too.'),
        ],
        parentNote: 'Your child heard that goodbyes are hard and that sad feelings and tears are allowed.',
      },
    ],
  },
  {
    id: 'reader:c12-close',
    of: 'c12-close',
    band: 'reader',
    lines: [
      N('Dusk. You come back into the Grove.'),
      N('The Keepers are all still here. Nobody has gone home. Somebody has lit all four lanterns without being asked.'),
      N('Nobody asks you anything. Clover gives you soup. Fern gives you her other glove; she has found the first one.'),
      N('Somebody has eaten the cake, collapsed side and all. The plate on the bench still glows faintly.'),
      N('You stand by the pond, in the place where Gran Hazel didn’t say anything. Everyone else stands somewhere too.'),
      N('At the top of the hill, small and gold and steady, her lantern is burning.'),
      N('It burns all night. Everybody watches it, on and off, in turns, without anyone arranging it.'),
      N('Sparks falls asleep sitting up, holding her lantern. Nobody takes it off her.'),
      N('Towards morning somebody starts the Lantern Song, very quietly, and stops after the chorus. Everyone knows the rest.'),
      N('In the morning, her lantern has gone out.'),
      N('Gran Hazel died in the night, at the top of the hill. Her body stopped working, and it won’t start again.'),
      N('You knew it was coming. It still hurts. Both of those are true at once.'),
      N('Clover holds your hand. Nobody tells you to cheer up. They just stay.'),
      N('And on the hill, near Briar’s, there is a new flower: small, brisk, a bit untidy, and turned very firmly towards the Grove.'),
    ],
    lessons: [
      {
        id: 'reader:c12-close-l1',
        domain: 'sel',
        skill: 'grief: knowing what helps you',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 12,
        prompt: [
          N('Everyone in the Grove is grieving. That means feeling sad because someone you love has died.'),
          N('When you feel very sad, what helps you most? There is no wrong answer.'),
        ],
        options: [
          {
            label: 'Someone staying close, or a hug.',
            reply: [
              N('That helps lots of people. Clover knows it too. That’s why she’s holding your hand.'),
              N('You can always ask someone to stay with you. That is a brave thing to ask.'),
            ],
          },
          {
            label: 'Talking about the person who died.',
            reply: [
              N('That helps lots of people. Telling stories keeps someone close. Moss said we are made of being remembered.'),
              N('The Keepers will tell Gran Hazel stories for years. Some of them will even be true.'),
            ],
          },
          {
            label: 'Being quiet on my own for a while.',
            reply: [
              N('That helps lots of people too. Gran Hazel sat quietly by this pond for forty years.'),
              N('Quiet time is good. Just let someone know where you are, so they can come and sit with you later.'),
            ],
          },
        ],
        parentNote: 'Your child named what helps them when they feel very sad, as part of a gentle conversation about grief.',
      },
      {
        id: 'reader:c12-close-l2',
        domain: 'science',
        skill: 'the life cycle of a flowering plant',
        standard: '3-LS1-1',
        kind: 'do',
        after: 13,
        check: 'edu:order:life-cycle:flower',
        lines: [
          N('In the Grove, memorial flowers come by magic, overnight. Real flowers take longer. Put a real flower’s life in order.'),
          N('Seed, then seedling, then grown plant, then flower. And the flower makes new seeds, which start it all again.'),
          N('Because it goes round and round, it’s called a life cycle.'),
        ],
        parentNote: 'Your child put the life cycle of a flowering plant in order: seed, seedling, plant, flower, new seeds.',
      },
    ],
  },
];

/** Hazel’s Grove after its first body line, shared by end-hazels-grove and end-hazels-grove-open. */
const HAZELS_GROVE_BODY: Line[] = [
  N('The frost never comes back to the long grass. The fourth lantern lights itself every dusk now, a little before the others, as if it’s keen.'),
  N('There is a flower on the hill that Moss won’t let anyone step near. He sits beside it in the afternoons and talks to it.'),
  N('Sometimes he stops in the middle of a sentence, as if it has said something back. He says it usually has.'),
  N('Sable sleeps on your feet. Grey as ash. Heart above her head. Both at once, for ever.'),
  N('Pixel’s trust meter still hangs by the cottage door. Somebody has painted over MAYBE. It now says OBVIOUSLY.'),
  N('Some nights, half asleep, Sable makes a small sound that might be a word. You never wonder any more which one it means. It’s yours now.'),
];

/** OBVIOUSLY on Pixel’s meter: line 6 in both Hazel’s Grove body scenes. */
const obviouslyLesson = (id: string): Lesson => ({
    id,
    domain: 'literacy',
    skill: 'words that show how sure someone is',
    standard: 'L.2.4',
    kind: 'ask',
    after: 6,
    prompt: [N('MAYBE has become OBVIOUSLY. Which of these words means the most sure?')],
    options: [
      {
        label: 'Obviously',
        best: true,
        reply: [N('Yes. Obviously means it’s so clear that anyone can see it. Nobody needs to ask any more whether Sable trusts you.')],
      },
      {
        label: 'Maybe',
        reply: [
          N('Maybe means it might be true, or might not. That’s what the meter used to say.'),
          N('Obviously is the most sure: it’s so clear that anyone can see it.'),
        ],
      },
      {
        label: 'Perhaps',
        reply: [
          N('Perhaps means the same as maybe: it might be true, or might not.'),
          N('Obviously is the most sure: it’s so clear that anyone can see it.'),
        ],
      },
    ],
    parentNote: 'Your child compared words that show how certain someone is (maybe, perhaps, obviously).',
});

// ================================================================ the eight endings
// Each ending's -last scene carries one reflective line for the reader (EDU-STYLE: Endings).
const ENDING_SCENES: EduScene[] = [
  // ---------------------------------------------------------------- Hazel's Grove
  {
    id: 'reader:end-hazels-grove',
    of: 'end-hazels-grove',
    band: 'reader',
    lines: [
      N('HAZEL’S GROVE'),
      N('The gate sticks. Everyone who matters knows to lift and push.'),
      ...HAZELS_GROVE_BODY,
    ],
    lessons: [obviouslyLesson('reader:end-hazels-grove-l1')],
  },
  // NEW. Played INSTEAD of end-hazels-grove when the final choice was “Open” (letThemGo).
  {
    id: 'reader:end-hazels-grove-open',
    of: 'end-hazels-grove-open',
    band: 'reader',
    lines: [
      N('HAZEL’S GROVE'),
      N('There is no gate now. Everyone who matters still comes in, and most of them still lift and push at the empty air where it used to be.'),
      ...HAZELS_GROVE_BODY,
    ],
    lessons: [
      {
        id: 'reader:end-hazels-grove-open-l1',
        domain: 'literacy',
        skill: 'why characters keep a habit',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 1,
        prompt: [N('The gate is gone. So why do people still lift and push at nothing?')],
        options: [
          {
            label: 'Habit. They did it so often their hands remember.',
            best: true,
            reply: [
              N('Yes. A habit is something you’ve done so often you do it without thinking.'),
              N('It’s also a way of remembering. Every lift and push is a tiny hello to Hazel’s old gate.'),
            ],
          },
          {
            label: 'They haven’t noticed the gate has gone.',
            reply: [
              N('They’ve noticed. They walked past it, leaning on the wall. Their hands do it anyway.'),
              N('That’s a habit: something you’ve done so often you do it without thinking. It’s a way of remembering, too.'),
            ],
          },
          {
            label: 'It’s a game.',
            reply: [
              N('It might have become one! But it started as a habit: something done so often that hands remember it.'),
              N('Every lift and push is a tiny hello to Hazel’s old gate.'),
            ],
          },
        ],
        parentNote: 'Your child explained a character’s action as a habit, and how habits can also be a way of remembering.',
      },
      obviouslyLesson('reader:end-hazels-grove-open-l2'),
    ],
  },
  {
    id: 'reader:end-hazels-grove-last',
    of: 'end-hazels-grove-last',
    band: 'reader',
    lines: [
      N('Sometimes, by the pond, in the place where nobody says anything, you can very nearly hear her.'),
      HAZEL('Told you. Love is a method.', 'happy'),
      N('A method is a way of doing something, step by step. Gran Hazel’s had three steps.'),
      N('Feed them before you feed yourself. Never, ever throw one. When you don’t know what to do, sit down next to them and wait.'),
      N('Slow hands. Every day. That was the whole method.'),
      N('Think of someone you love. What is your slow-hands way of loving them?'),
    ],
    lessons: [
      {
        id: 'reader:end-hazels-grove-last-l1',
        domain: 'sel',
        skill: 'think question: which kindness is hardest',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 3,
        prompt: [N('Which of Gran Hazel’s three rules do you think is the hardest to keep? There’s no wrong answer.')],
        options: [
          {
            label: 'Feed them before you feed yourself.',
            reply: [N('That’s a fair answer. Putting someone else first when you’re hungry too is hard. Hazel did it for forty years.')],
          },
          {
            label: 'Never, ever throw one.',
            reply: [N('That’s a fair answer. When you’re cross, it is hard to stay gentle. Being gentle anyway is a kind of strength.')],
          },
          {
            label: 'Sit down next to them and wait.',
            reply: [N('That’s a fair answer, and Hazel would agree. She fidgeted for a whole winter before Moss said a word.')],
          },
        ],
        parentNote: 'Your child reflected on which kind of patience or care they find hardest, with no single right answer.',
      },
    ],
  },
  // ---------------------------------------------------------------- Eternal Dawn
  {
    id: 'reader:end-eternal-dawn',
    of: 'end-eternal-dawn',
    band: 'reader',
    lines: [
      N('ETERNAL DAWN'),
      N('One of yours has stopped getting older. You noticed it in the spring: the way it sat, carefully, like something that had decided to.'),
      N('In the Grove, a Nubbin loved enough can become an Eternal. That is Grove magic.'),
      N('In the real world, every living thing has a life cycle. It is born, grows up, gets older, and one day dies.'),
      N('It sits on the western hill now, where the sun goes down, and watches the gate.'),
      N('It will not come down until it decides you are worth it. It already has.'),
    ],
    lessons: [
      {
        id: 'reader:end-eternal-dawn-l1',
        domain: 'social-studies',
        skill: 'compass directions: west is where the sun sets',
        standard: 'D2.Geo.2.K-2',
        kind: 'do',
        after: 4,
        check: 'edu:tap:compass:west',
        lines: [
          N('The Sun rises in the east and sets in the west. So the western hill is the one the sunset sits behind.'),
          N('Find W for west on the Grove’s compass, and tap the hill it points to.'),
        ],
        parentNote: 'Your child used a compass to find west, and learned that the Sun rises in the east and sets in the west.',
      },
    ],
  },
  {
    id: 'reader:end-eternal-dawn-moss',
    of: 'end-eternal-dawn-moss',
    band: 'reader',
    lines: [
      N('Moss looked at it for a long time. Then he climbed up and sat beside it.'),
      MOSS('Someone has to remember the pale one’s shoelaces. It isn’t going to be me for ever. Good. That’s good.', 'soft'),
      N('The pale one is Byte. His shoelace has been coming undone since the day you met him.'),
      N('Two of them on the hill now. One talks. The other is learning how.'),
      BYTE('For the record, I have been practising my bows.', 'think'),
      N('Moss looks at Byte’s shoes for a long time. They are tied. Moss looks very slightly disappointed.'),
    ],
    lessons: [
      {
        id: 'reader:end-eternal-dawn-moss-l1',
        domain: 'health',
        skill: 'tie a shoelace bow',
        kind: 'do',
        after: 5,
        check: 'edu:tie:shoelace:bow',
        lines: [
          BYTE('Step one: cross the laces, tuck one under, and pull. Step two: make a loop with one lace.', 'think'),
          BYTE('Step three: wrap the other lace round the loop, push it through the gap, and pull both loops tight. Bow. Tied. Recorded.', 'happy'),
        ],
        parentNote: 'Your child practised the steps for tying a shoelace bow, a useful self-care skill.',
      },
    ],
  },
  {
    id: 'reader:end-eternal-dawn-nomoss',
    of: 'end-eternal-dawn-nomoss',
    band: 'reader',
    lines: [
      N('It sits in the exact place where Moss used to sit. Nobody taught it to. Nobody had to.'),
      BYTE('Statistically, that is a coincidence.', 'think'),
      N('A coincidence is when two things happen together just by chance, with no reason joining them.'),
      N('Byte says it’s a coincidence. Byte has also started tying his shoelaces twice.'),
      N('When he thinks nobody is looking, he sits near it and tells it the news.'),
      N('It listens. That is what Moss used to do.'),
    ],
    lessons: [
      {
        id: 'reader:end-eternal-dawn-nomoss-l1',
        domain: 'literacy',
        skill: 'your point of view and a character’s',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 5,
        prompt: [N('Byte thinks it sits there by chance. What do you think? There’s no wrong answer.')],
        options: [
          {
            label: 'It’s a coincidence, like Byte says.',
            reply: [N('That’s a fair answer. Byte likes proof, and there isn’t any. You and Byte see it the same way.')],
          },
          {
            label: 'It somehow remembers Moss.',
            reply: [N('That’s a lovely answer. You see it differently from Byte. Readers often notice what a character won’t let themselves believe.')],
          },
          {
            label: 'I’m not sure.',
            reply: [N('That’s an honest answer. Not being sure is fine. Even Byte is tying his laces twice, just in case.')],
          },
        ],
        parentNote: 'Your child compared their own point of view with a character’s.',
      },
    ],
  },
  {
    id: 'reader:end-eternal-dawn-last',
    of: 'end-eternal-dawn-last',
    band: 'reader',
    lines: [
      N('On Lantern Night it comes down for an hour and sits among you all.'),
      N('It looks at each of you in turn, very carefully.'),
      N('As if it is learning you by heart. It is. That is what they are for.'),
      N('To know something by heart means to know it so well you could say it without looking.'),
      N('Hazel’s three rules. The Lantern Song. The faces of everyone you love.'),
      N('What do you know by heart? And who might be learning you by heart, right now?'),
    ],
    lessons: [
      {
        id: 'reader:end-eternal-dawn-last-l1',
        domain: 'music',
        skill: 'learn a chorus by heart through repetition',
        standard: 'RL.2.4',
        kind: 'do',
        after: 4,
        check: 'edu:recite:lantern-song:chorus',
        lines: [
          N('The best way to learn something by heart is to go over it again and again. Each time, it sticks a little better.'),
          N('Say the Lantern Song chorus three times. The third time, try it without looking.'),
          N('“Slow hands, warm hearts, the gate stuck fast — what’s kept with love is kept to last.”'),
        ],
        parentNote: 'Your child learned a rhyming chorus by heart, practising how repetition helps memory.',
      },
    ],
  },
  // ---------------------------------------------------------------- The Shadow's Keeper
  {
    id: 'reader:end-shadow-keeper',
    of: 'end-shadow-keeper',
    band: 'reader',
    lines: [
      N('THE SHADOW’S KEEPER'),
      N('Grey Nubbins find their way to your gate now. Word gets round, somehow, among creatures that do not speak.'),
      N('They come out of the Hollow, down from the Circuit, in from the long grass: thin and quiet, waiting for the next bad thing.'),
      N('Sable meets each one at the edge and sits with it. She does not come closer. She does not run. She shows them how.'),
      N('Ash sits with her most days. Two grey shapes in the long grass. The newcomers go to both.'),
      N('Together, the two of them make it feel safe enough to stay.'),
    ],
    lessons: [
      {
        id: 'reader:end-shadow-keeper-l1',
        domain: 'science',
        skill: 'animals in groups help each other survive',
        standard: '3-LS2-1',
        kind: 'notice',
        after: 5,
        lines: [
          N('Real animals help each other in groups too.'),
          N('Emperor penguins huddle together to keep warm through the freezing Antarctic winter.'),
          N('Meerkats take turns standing guard, watching for danger, while the others look for food.'),
        ],
        parentNote: 'Your child learned real examples of animals living in groups to help each other survive.',
      },
    ],
  },
  {
    id: 'reader:end-shadow-keeper-last',
    of: 'end-shadow-keeper-last',
    band: 'reader',
    lines: [
      N('Clover tells every new Keeper the same thing, standing at the edge with a bag of fruit.'),
      CLOVER('The grey stays. You can only make it lighter.', 'soft'),
      N('Sable is the proof. She is so light now. You could carry her anywhere.'),
      N('Some hurts don’t go away. But with patience and kindness, they can get easier to carry.'),
      N('Clover hands the new Keeper the fruit and points to the edge.'),
      N('Is there something hard that got lighter for you, because someone was patient with you?'),
    ],
    lessons: [
      {
        id: 'reader:end-shadow-keeper-last-l1',
        domain: 'literacy',
        skill: 'a word with two meanings at once',
        standard: 'L.3.4',
        kind: 'ask',
        after: 2,
        prompt: [N('“Make it lighter.” Lighter can mean paler in colour, or less heavy. Which does the writer mean?')],
        options: [
          {
            label: 'Both at once.',
            best: true,
            reply: [N('Yes! Sable’s grey looks paler, and her hurt is less heavy to carry. A word doing two jobs at once is a clever bit of writing.')],
          },
          {
            label: 'Paler in colour.',
            reply: [
              N('That’s one meaning. But the next line says you could carry her anywhere, so it means less heavy too.'),
              N('The writer means both at once. That’s a clever bit of writing.'),
            ],
          },
          {
            label: 'Less heavy.',
            reply: [
              N('That’s one meaning. But Clover is talking about the grey, a colour, so it means paler too.'),
              N('The writer means both at once. That’s a clever bit of writing.'),
            ],
          },
        ],
        parentNote: 'Your child noticed a word used with two meanings at once (lighter: paler and less heavy).',
      },
    ],
  },
  // ---------------------------------------------------------------- Moss Sleeps (reader title: Moss's Flower)
  {
    id: 'reader:end-moss-sleeps',
    of: 'end-moss-sleeps',
    band: 'reader',
    lines: [
      N('MOSS’S FLOWER'),
      N('Moss did not come back. Moss faded. That means he died, and he isn’t coming back.'),
      N('By spring, his flower by the flat stone, where he always sat, was fully open. The wind goes through it the way it went through him.'),
      N('Sable carries his light now. Nobody knows how. It floats beside hers, pale and small, and when the lanterns are lit, it flickers.'),
      N('You sit by his flower in the afternoons and tell it things.'),
      N('You were never very good at sitting still with him, when he was here.'),
      N('You are better at it now. It is too late, and you do it anyway.'),
    ],
    lessons: [
      {
        id: 'reader:end-moss-sleeps-l1',
        domain: 'science',
        skill: 'seeds wait through winter and grow in spring',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 2,
        lines: [
          N('Real flowers grow from seeds. Many seeds lie in the cold ground all winter, resting.'),
          N('In spring the soil warms up and the days get longer. Then the seeds begin to grow, and by summer there are flowers.'),
        ],
        parentNote: 'Your child learned that many seeds rest through winter and begin to grow when spring brings warmth and longer days.',
      },
      {
        id: 'reader:end-moss-sleeps-l2',
        domain: 'sel',
        skill: 'regret, and doing the kind thing now',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 6,
        lines: [
          N('Wishing you had done something differently is called regret. Everybody feels it sometimes.'),
          N('You can’t go back. But doing the kind thing now still counts. Moss would say it counts a great deal.'),
        ],
        parentNote: 'Your child learned the word regret and that acting kindly now is a healthy response to it.',
      },
    ],
  },
  {
    id: 'reader:end-moss-sleeps-last',
    of: 'end-moss-sleeps-last',
    band: 'reader',
    lines: [
      LUNA('His body is gone. But he isn’t gone from us. He’s just remembered by fewer people now. That’s all fading is.', 'soft'),
      LUNA('Remember him louder.', 'soft'),
      N('So you do. You tell the new Keepers about him: the shoelace jokes, the long sits, “We are made of being remembered.”'),
      N('Byte writes the stories down. Fern leaves a lantern bun by his flower every Lantern Night.'),
      N('That is how stories carry someone forward: one person telling the next.'),
      N('Who would you tell about Moss? Which story would you tell first?'),
    ],
    lessons: [
      {
        id: 'reader:end-moss-sleeps-last-l1',
        domain: 'social-studies',
        skill: 'oral history: how stories carry the past',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 4,
        lines: [
          N('Long before there were books, people kept their history by telling it out loud: grandparents to parents, parents to children.'),
          N('That is called oral history. Moss’s Tale of the Four was oral history. Now you are the one telling his.'),
        ],
        parentNote: 'Your child learned about oral history: how people pass the past on by telling stories aloud.',
      },
    ],
  },
  // ---------------------------------------------------------------- Wild Grove
  {
    id: 'reader:end-wild-grove',
    of: 'end-wild-grove',
    band: 'reader',
    lines: [
      N('WILD GROVE'),
      N('There is no gate any more. Some stayed. Most didn’t. The grey ones from Corvin’s garden come and go through the Hollow.'),
      N('You leave fruit, and some of it is eaten.'),
      N('Most weeks you go into the Hollow with a lantern, a bag of fruit and the stubborn chin. Some of them let you near now.'),
      N('They have learned to live wild: where the water is, where to shelter from the wind, how much room they need.'),
      N('A small grey one with a nicked ear let you touch it this spring. Took two months. Worth it.'),
    ],
    lessons: [
      {
        id: 'reader:end-wild-grove-l1',
        domain: 'science',
        skill: 'what a habitat must provide',
        standard: 'K-ESS3-1',
        kind: 'do',
        after: 4,
        check: 'edu:sort:habitat-needs:4',
        lines: [
          N('An animal’s habitat is the place it lives. A good habitat gives it four things: food, water, shelter and space.'),
          N('Sort the Hollow: the stream is water, the fruit trees are food, the hollow logs are shelter, the open hillside is space.'),
        ],
        parentNote: 'Your child sorted the four things every habitat must give an animal: food, water, shelter and space.',
      },
    ],
  },
  {
    id: 'reader:end-wild-grove-last',
    of: 'end-wild-grove-last',
    band: 'reader',
    lines: [
      NOVA('I saw you out there. You didn’t wave. You were busy.', 'soft'),
      NOVA('You looked… like her.', 'soft'),
      N('Nova means Gran Hazel. You don’t look like her on the outside.'),
      N('Patient. Stubborn. Out in the cold with a bag of fruit, for creatures who might never come close.'),
      N('Nova smiles, and goes off down the path, to wherever she is travelling next.'),
      N('Who would you like to be like, one day? Is it how they look, or what they do?'),
    ],
    lessons: [
      {
        id: 'reader:end-wild-grove-last-l1',
        domain: 'literacy',
        skill: 'character traits shown by actions',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 3,
        prompt: [N('Nova says you looked like Gran Hazel. What does she really mean?')],
        options: [
          {
            label: 'You act like her: patient, stubborn and kind.',
            best: true,
            reply: [N('Yes. Nova means your character, not your face. You have learned Hazel’s slow hands.')],
          },
          {
            label: 'You have the same coat.',
            reply: [
              N('Ha! Maybe you borrowed one of her three coats. But Nova means more than that.'),
              N('She means you act like Hazel: patient, stubborn and kind. That’s your character.'),
            ],
          },
        ],
        parentNote: 'Your child explained how a character’s traits are shown by what they do.',
      },
    ],
  },
  // ---------------------------------------------------------------- The Empty Lantern
  {
    id: 'reader:end-empty-lantern',
    of: 'end-empty-lantern',
    band: 'reader',
    lines: [
      N('THE EMPTY LANTERN'),
      N('Sable never came back. Luna still leaves fruit at the edge every night. Some mornings it’s gone, and nobody asks who took it.'),
      N('On Lantern Night you light all four posts.'),
      N('Then you light a fifth, a small one, and set it at the very edge of the long grass, facing out.'),
      N('For anyone who might be watching from out there. For anyone who might want to know the way.'),
      N('It works like a lighthouse: a light that says, here is home, come this way.'),
    ],
    lessons: [
      {
        id: 'reader:end-empty-lantern-l1',
        domain: 'science',
        skill: 'lights help us find our way in the dark',
        standard: '1-PS4-2',
        kind: 'notice',
        after: 5,
        lines: [
          N('A lighthouse is a tall tower with a bright light at the top, beside the sea.'),
          N('It shines at night so ships can see where they are, find their way, and keep away from dangerous rocks.'),
        ],
        parentNote: 'Your child learned what lighthouses do and how light helps people see and find their way at night.',
      },
    ],
  },
  {
    id: 'reader:end-empty-lantern-last',
    of: 'end-empty-lantern-last',
    band: 'reader',
    lines: [
      N('Gran Hazel wrote it in her first letter. You know it by heart.'),
      HAZEL('“When you don’t know what to do, sit down next to them and wait.”', 'soft'),
      N('You are still waiting. That counts. That counts for a lot.'),
      N('Waiting for someone who might not come is hard. You can feel sad and hopeful at the same time.'),
      N('You light the fifth lantern again tonight. Just in case.'),
      N('Hoping is a kind of keeping. What do you keep hoping for?'),
    ],
    lessons: [
      {
        id: 'reader:end-empty-lantern-last-l1',
        domain: 'sel',
        skill: 'coping while you wait and worry',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 3,
        lines: [
          N('When you are waiting and worried, some things help.'),
          N('Keep doing your everyday things. Do something kind for someone else. And tell someone how you feel, so you aren’t waiting alone.'),
        ],
        parentNote: 'Your child learned some healthy ways to cope with worry while waiting.',
      },
    ],
  },
  // ---------------------------------------------------------------- The Collector
  {
    id: 'reader:end-collector',
    of: 'end-collector',
    band: 'reader',
    lines: [
      N('THE COLLECTOR'),
      N('A collector is someone who gathers things and keeps them: stamps, shells, stones.'),
      N('Things don’t mind being kept on a shelf. Living creatures do.'),
      N('This is the ending where the Grove was kept safe, and still.'),
      N('Remember what Moss said: safe is not the same as well.'),
      N('Here is what happened.'),
    ],
    lessons: [
      {
        id: 'reader:end-collector-l1',
        domain: 'sel',
        skill: 'fairness to animals: living things are not objects',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 2,
        prompt: [N('What is the big difference between collecting stones and keeping animals?')],
        options: [
          {
            label: 'Animals have feelings and needs. They need care, and the freedom to move and play.',
            best: true,
            reply: [N('Yes. A stone is fine on a shelf for ever. An animal is a someone, not a something.')],
          },
          {
            label: 'There isn’t any difference.',
            reply: [
              N('A stone doesn’t get lonely or bored or frightened. An animal does.'),
              N('Animals have feelings and needs. They are a someone, not a something.'),
            ],
          },
          {
            label: 'Animals are harder to dust.',
            reply: [
              N('Ha! True. But the big difference is that animals have feelings and needs.'),
              N('A stone is fine on a shelf for ever. An animal is a someone, not a something.'),
            ],
          },
        ],
        parentNote: 'Your child thought about how animals differ from objects: they have feelings and needs and deserve fair treatment.',
      },
    ],
  },
  {
    id: 'reader:end-collector-sold',
    of: 'end-collector-sold',
    band: 'reader',
    lines: [
      N('Two hundred Shells buys a lot of eggs.'),
      N('They hatch, and they are fast, and by autumn they are grey, every one.'),
      N('When the pens opened, you never went looking for the first one. You told yourself it was doing well.'),
      N('Quiet. You told yourself quiet and well were the same thing.'),
      N('They aren’t. Somewhere inside, you knew that.'),
      CORVIN('I told you. Everyone sells, eventually. I’m almost sorry I was right.', 'think'),
      N('He wasn’t right. Not everyone sells. But you did, and it cost more than Shells.'),
    ],
    lessons: [
      {
        id: 'reader:end-collector-sold-l1',
        domain: 'maths',
        skill: 'division word problem with Shells',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 0,
        prompt: [N('Say each egg costs 25 Shells. How many eggs can 200 Shells buy?')],
        options: [
          {
            label: '8 eggs',
            best: true,
            reply: [N('Yes. 4 eggs cost 100 Shells, so 200 Shells buys 8. 8 × 25 = 200.')],
          },
          {
            label: '4 eggs',
            reply: [
              N('4 eggs cost 100 Shells. But there are 200 Shells: that’s two lots of 100.'),
              N('So it’s 8 eggs. 8 × 25 = 200.'),
            ],
          },
          {
            label: '10 eggs',
            reply: [
              N('10 eggs would cost 250 Shells. That’s too many. 4 eggs cost 100, so 200 Shells buys 8.'),
              N('8 × 25 = 200.'),
            ],
          },
        ],
        parentNote: 'Your child solved a division word problem with money (200 ÷ 25 = 8).',
      },
      {
        id: 'reader:end-collector-sold-l2',
        domain: 'sel',
        skill: 'being honest with yourself',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N('Telling yourself something comfortable that isn’t true is easy. It’s a way of hiding from a bad feeling.'),
          N('Being honest with yourself, even when it hurts, is the first step to putting something right.'),
        ],
        parentNote: 'Your child thought about honesty with oneself and why it matters for putting things right.',
      },
    ],
  },
  {
    id: 'reader:end-collector-kept',
    of: 'end-collector-kept',
    band: 'reader',
    lines: [
      N('Nothing in your Grove is ever hurt now. Nothing is hungry, or lost, or frightened. Nothing runs off into the dark.'),
      N('They sit in the grass in the sun, all of them, quite still. They are grey by spring, every one. They are perfectly safe.'),
      N('They don’t play. They don’t explore. They never run at the gate for fun.'),
      N('Moss stayed up on the hill after Gran Hazel went up. He never came down again. He didn’t say anything. He didn’t need to.'),
      N('Corvin came once. He stood in the lane and looked at your hand, resting on your coat, over the pocket.'),
      CORVIN('I’m sorry. I am so sorry. I know exactly how sorry.', 'sad'),
      N('Your hands are always cold now. You keep meaning to mind.'),
    ],
    lessons: [
      {
        id: 'reader:end-collector-kept-l1',
        domain: 'health',
        skill: 'being well needs more than being safe',
        standard: 'K-LS1-1',
        kind: 'notice',
        after: 2,
        lines: [
          N('Animals and people need food, water and shelter to live. But to be well, they need more.'),
          N('They need to move, to play, to explore and to be with others. Without those, a body can be safe and still not be well.'),
        ],
        parentNote: 'Your child learned that wellbeing needs movement, play and company as well as food, water and shelter.',
      },
      {
        id: 'reader:end-collector-kept-l2',
        domain: 'sel',
        skill: 'think question: is safe the same as well?',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 6,
        prompt: [
          N('Moss always said safe is not the same as well. This Grove is perfectly safe.'),
          N('Do you think safe is the same as well? There is no wrong answer.'),
        ],
        options: [
          {
            label: 'No. Being well means being free to play and explore.',
            reply: [N('That’s a thoughtful answer, and Moss would agree. A life with no risk at all can also have no joy in it.')],
          },
          {
            label: 'Yes. Keeping them from harm matters most.',
            reply: [
              N('That’s a caring answer. Keeping someone from harm does matter a lot. That’s what Cinder thought, and Corvin.'),
              N('They loved them too. They just held on too tight. Moss would ask: are they happy, though?'),
            ],
          },
          {
            label: 'You need a bit of both.',
            reply: [N('That’s a wise answer. Hazel kept them safe enough, and let them be free enough. Finding the balance is the hard part.')],
          },
        ],
        parentNote: 'Your child explored a big question, whether being safe is the same as being well, with no single right answer.',
      },
    ],
  },
  {
    id: 'reader:end-collector-last',
    of: 'end-collector-last',
    band: 'reader',
    lines: [
      N('The gate opens by itself now. It has stopped sticking.'),
      N('No more lift and push. No more creak to tell you who has come back.'),
      N('You find that you miss it.'),
      N('Gran Hazel kept it stuck so she would hear anyone coming home. Now nobody can tell who comes or goes.'),
      N('Some nights you stand by it, with your cold hand on your pocket, and listen anyway.'),
      N('The stone promised that nothing would ever hurt them again. What do you think that promise cost?'),
    ],
    lessons: [
      {
        id: 'reader:end-collector-last-l1',
        domain: 'science',
        skill: 'friction is a force that resists movement',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('The old gate stuck because its bottom rubbed on the ground. That rubbing force is called friction. It pushes against movement.'),
          N('Lifting the gate made less of it rub, so less friction. Then a push could move it. That’s why it was lift, then push.'),
        ],
        parentNote: 'Your child learned that friction is a force that resists movement, and how lifting reduced it.',
      },
    ],
  },
  // ---------------------------------------------------------------- The Long Road
  {
    id: 'reader:end-long-road',
    of: 'end-long-road',
    band: 'reader',
    lines: [
      N('THE LONG ROAD'),
      N('Sable is still here. Still grey. Still two steps away, never one. She eats what you leave and sleeps near, not next to.'),
      N('Hazel said two months for an ear. It has been much longer than that. You sit down next to her every evening and wait.'),
      N('You have stopped counting, which Hazel would have said was the point.'),
      N('Some evenings she is one and a half steps away. You don’t say anything. You don’t want to frighten it.'),
      N('Pixel’s meter by the door still says MAYBE. Pixel offered to repaint it. You said no.'),
      N('Maybe is a good word. It has room in it.'),
    ],
    lessons: [
      {
        id: 'reader:end-long-road-l1',
        domain: 'maths',
        skill: 'halves: how much closer',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 4,
        prompt: [N('Sable used to stay 2 steps away. Now, some evenings, she is 1½ steps away. How much closer is she?')],
        options: [
          {
            label: '½ a step',
            best: true,
            reply: [N('Yes. From 2 steps to 1½ steps is half a step closer. Small. Also enormous.')],
          },
          {
            label: '1 step',
            reply: [
              N('If she came 1 step closer, she’d be 1 step away. She’s 1½ steps away.'),
              N('So she’s ½ a step closer. Small. Also enormous.'),
            ],
          },
          {
            label: '1½ steps',
            reply: [
              N('1½ steps is how far away she is now. From 2 steps to 1½ steps is half a step.'),
              N('So she’s ½ a step closer. Small. Also enormous.'),
            ],
          },
        ],
        parentNote: 'Your child worked with halves to find a difference (2 − 1½ = ½).',
      },
      {
        id: 'reader:end-long-road-l2',
        domain: 'literacy',
        skill: 'metaphor: a word with room in it',
        standard: 'L.4.5',
        kind: 'notice',
        after: 6,
        lines: [
          N('A word doesn’t really have rooms. That’s a metaphor: saying one thing is another, to show an idea.'),
          N('It means maybe leaves space for things to get better. Maybe, one day, she’ll come one step closer.'),
        ],
        parentNote: 'Your child met a metaphor and explained what it means.',
      },
    ],
  },
  {
    id: 'reader:end-long-road-last',
    of: 'end-long-road-last',
    band: 'reader',
    lines: [
      CLOVER('She stayed. Out of the whole valley, she picked this Grove, and she stayed.', 'soft'),
      CLOVER('Don’t you dare call that nothing.', 'soft'),
      N('Some things grow so slowly you can’t see them change from one day to the next. Like a tree. Like trust.'),
      N('But look back over a whole year, and you can see how far they have come.'),
      N('Sable picked this Grove. She picked you. That is not nothing.'),
      N('What small thing did you do this year that was really a big deal?'),
    ],
    lessons: [
      {
        id: 'reader:end-long-road-last-l1',
        domain: 'literacy',
        skill: 'think question: your view of the ending',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 1,
        prompt: [N('Sable isn’t bonded yet, but she stayed. Is this a happy ending? There’s no wrong answer.')],
        options: [
          {
            label: 'Yes. She chose to stay.',
            reply: [N('That’s Clover’s answer too. Choosing to stay is a big thing for someone who has been hurt.')],
          },
          {
            label: 'Not yet. But it might be one day.',
            reply: [N('That’s a hopeful answer. Some endings are really middles. The road is still going.')],
          },
          {
            label: 'It’s happy and sad at the same time.',
            reply: [N('That’s an honest answer. Lots of real endings are both. Good stories often are too.')],
          },
        ],
        parentNote: 'Your child gave their own view of a story’s ending and compared it with a character’s view.',
      },
    ],
  },
];

// ================================================================ epilogue variants
const EPILOGUE_SCENES: EduScene[] = [
  // ---------------------------------------------------------------- Wisp (S2)
  {
    id: 'reader:end-epi-wisp-spared',
    of: 'end-epi-wisp-spared',
    band: 'reader',
    lines: [
      N('Wisp lives under the cottage step. He is grey, and will be grey always, and he has not trembled once since the Long Night.'),
      N('He still steals. One warm thing a day: a sock off the line, a bun off the sill, the sunny end of the step.'),
      N('He gives most of it away.'),
      N('He still hisses at hands. Then he climbs into them.'),
      WISP('…warm.', 'soft'),
      N('Warm, and safe enough, and free. All three at once.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-wisp-spared-l1',
        domain: 'science',
        skill: 'sunlight warms what it shines on',
        standard: 'K-PS3-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('The sunny end of the step really is warmer. Sunlight warms whatever it shines on: stone, wood, grass, fur.'),
          N('That’s why cats, and Wisps, always find the sunny spot.'),
        ],
        parentNote: 'Your child learned that sunlight warms the surfaces it shines on.',
      },
      {
        id: 'reader:end-epi-wisp-spared-l2',
        domain: 'maths',
        skill: 'subtraction word problem within 20',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 2,
        prompt: [N('One warm thing a day for a whole week is 7 things. Wisp gives 5 of them away. How many does he keep?')],
        options: [
          {
            label: '2',
            best: true,
            reply: [N('Yes. 7 take away 5 leaves 2. He keeps two, usually socks.')],
          },
          {
            label: '5',
            reply: [N('5 is how many he gives away. 7 take away 5 leaves 2. He keeps two, usually socks.')],
          },
          {
            label: '12',
            reply: [N('12 would be adding. He gives them away, so we take away: 7 take away 5 leaves 2.')],
          },
        ],
        parentNote: 'Your child solved a take-away word problem (7 − 5 = 2).',
      },
    ],
  },
  {
    id: 'reader:end-epi-wisp-sable',
    of: 'end-epi-wisp-sable',
    band: 'reader',
    lines: [
      N('Wisp sleeps in the long grass, on the exact spot where Sable once pushed half her fruit across to him.'),
      N('He comes in for breakfast. He doesn’t come in any further.'),
      N('Some mornings, now, he stays to wash his face in the sun.'),
      N('He used to hiss one word, over and over: mine.'),
      WISP('…ours.', 'soft'),
      N('One small word, changed. It changes everything.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-wisp-sable-l1',
        domain: 'literacy',
        skill: 'how a character changes, shown by one word',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 4,
        prompt: [N('Mine means it belongs to me alone. Ours means it belongs to us, together. What does Wisp’s new word show?')],
        options: [
          {
            label: 'He has learned to share, and he feels he belongs.',
            best: true,
            reply: [N('Yes. Sable shared with him first. Now he has a word for it. Kindness passed on.')],
          },
          {
            label: 'He is still greedy.',
            reply: [
              N('He used to be. Mine was his greedy word. But ours is a sharing word.'),
              N('Sable shared with him first, and now he feels he belongs.'),
            ],
          },
        ],
        parentNote: 'Your child explained how a single changed word (mine to ours) shows a character has changed.',
      },
    ],
  },
  {
    id: 'reader:end-epi-wisp-kept',
    of: 'end-epi-wisp-kept',
    band: 'reader',
    lines: [
      N('Wisp comes every evening and sits at your feet, and looks at your pocket.'),
      N('He never tries to take it. He just looks, and shakes.'),
      N('In the morning he is gone, and in the evening he is back.'),
      WISP('…warm. warm.', 'sad'),
      N('It isn’t warm. The stone is the coldest thing in the valley. You could tell him.'),
      N('You never do.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-wisp-kept-l1',
        domain: 'sel',
        skill: 'think question: honesty when the truth is hard',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 5,
        prompt: [N('Should you tell Wisp the truth, that the stone isn’t warm at all? There is no wrong answer.')],
        options: [
          {
            label: 'Yes. Then he could stop wanting it.',
            reply: [N('That’s a brave answer. The truth can hurt at first and help later. It might set him free.')],
          },
          {
            label: 'No. It would make him even sadder.',
            reply: [N('That’s a kind answer. You don’t want to hurt him. But ask yourself: is it him you’re protecting, or the stone?')],
          },
          {
            label: 'I’m not sure.',
            reply: [N('That’s an honest answer. Hard truths are hard. Hazel would say: sit down next to him, and you’ll know when.')],
          },
        ],
        parentNote: 'Your child weighed honesty against kindness in a hard situation, with no single right answer.',
      },
    ],
  },
  {
    id: 'reader:end-epi-wisp-driven',
    of: 'end-epi-wisp-driven',
    band: 'reader',
    lines: [
      N('You never saw Wisp again.'),
      N('Once, from the ridge, you thought you did: thin and grey, one ear torn to a fringe, sitting where the paths stop, watching the Grove.'),
      N('You waved. When you looked again, he was gone. You don’t know if he saw.'),
      N('You wish you had chosen differently, that day in the long grass. You can’t go back.'),
      N('You leave a little fruit at the edge of the long grass, most nights.'),
      N('Some of it is eaten.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-wisp-driven-l1',
        domain: 'social-studies',
        skill: 'land features on a map: a ridge',
        standard: 'D2.Geo.2.K-2',
        kind: 'notice',
        after: 1,
        lines: [
          N('A ridge is a long, narrow line of high ground, like the top edge of a roof. You can see a long way from one.'),
          N('On some maps, hills are drawn with curvy lines. Where the lines are packed close together, the land is steep.'),
        ],
        parentNote: 'Your child learned what a ridge is and how maps can show hills and steep ground.',
      },
      {
        id: 'reader:end-epi-wisp-driven-l2',
        domain: 'sel',
        skill: 'making amends when you can’t undo something',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 5,
        lines: [
          N('You can’t undo driving him off. But you can still do something good to help put it right. That’s called making amends.'),
          N('The fruit at the edge is your amends. It isn’t everything. It is something.'),
        ],
        parentNote: 'Your child learned about making amends: doing something good to help repair a past wrong.',
      },
    ],
  },
  {
    id: 'reader:end-epi-wisp-none',
    of: 'end-epi-wisp-none',
    band: 'reader',
    lines: [
      N('Some nights, fruit goes missing from the edge of the long grass.'),
      N('Whoever takes it is thin and quick and gone before you can sit up.'),
      N('You have never seen them in daylight. Whoever it is only comes out at night.'),
      N('You leave a little more, the next night. Hazel would have.'),
      N('One morning there is a single pip on the step, left very neatly.'),
      N('A thank-you, maybe. Maybe is a good word.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-wisp-none-l1',
        domain: 'science',
        skill: 'nocturnal animals and their senses',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 2,
        lines: [
          N('Animals that are busy at night and rest by day are called nocturnal. Owls, hedgehogs and badgers are nocturnal.'),
          N('Many have big eyes or sharp ears or noses, to help them find food in the dark.'),
        ],
        parentNote: 'Your child learned what nocturnal means, with real examples, and how senses help night animals.',
      },
    ],
  },
  // ---------------------------------------------------------------- Corvin's gate (S9)
  {
    id: 'reader:end-epi-gate-family',
    of: 'end-epi-gate-family',
    band: 'reader',
    lines: [
      N('Corvin comes on Sundays and sits by the pond and says nothing, badly, but he is learning.'),
      N('He comes in the way Hazel taught everyone, every time, as if he isn’t sure it will still work. It always does.'),
      N('Ember sits on the far side of the pond. She has not forgiven him.'),
      N('Some Sundays she passes him the teapot.'),
      N('Byte keeps count, of course. Corvin has come twelve Sundays. Ember has passed the teapot one Sunday in every three.'),
      N('Forgiving can happen a little at a time. A teapot is a start.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-gate-family-l1',
        domain: 'maths',
        skill: 'division as equal groups',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 4,
        prompt: [N('Twelve Sundays. The teapot comes one Sunday in every three. On how many Sundays has Ember passed the teapot?')],
        options: [
          {
            label: '4',
            best: true,
            reply: [N('Yes. Split 12 Sundays into groups of 3: that makes 4 groups, so 4 teapots. 12 ÷ 3 = 4.')],
          },
          {
            label: '3',
            reply: [N('Let’s split 12 Sundays into groups of 3: 3, 6, 9, 12. That’s 4 groups, so 4 teapots. 12 ÷ 3 = 4.')],
          },
          {
            label: '9',
            reply: [N('Let’s split 12 Sundays into groups of 3: 3, 6, 9, 12. That’s 4 groups, so 4 teapots. 12 ÷ 3 = 4.')],
          },
        ],
        parentNote: 'Your child solved a division problem by making equal groups (12 ÷ 3 = 4).',
      },
    ],
  },
  {
    id: 'reader:end-epi-gate-guest',
    of: 'end-epi-gate-guest',
    band: 'reader',
    lines: [
      N('Corvin comes when he is asked, which is not often. He knocks on the gatepost every time.'),
      N('You let him in every time. Neither of you has ever suggested he stop knocking.'),
      N('Once he brought flowers for the gatepost. You put them in a jar beside it.'),
      N('The gatepost did not comment.'),
      N('Corvin said it was the warmest welcome he’d had all year.'),
      N('He meant the jar. He meant you, too.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-gate-guest-l1',
        domain: 'sel',
        skill: 'asking before coming in: consent and respect',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 1,
        prompt: [N('Why does it matter that Corvin knocks, every single time?')],
        options: [
          {
            label: 'Knocking asks “may I come in?”, so the person inside gets to choose.',
            best: true,
            reply: [N('Yes. Asking first shows respect. Being allowed to say yes or no is important, for everyone.')],
          },
          {
            label: 'It doesn’t matter. He could just walk in.',
            reply: [
              N('He could. But knocking asks “may I come in?”, and gives you the choice.'),
              N('After everything he did, asking first is how he shows respect.'),
            ],
          },
        ],
        parentNote: 'Your child thought about why asking permission before entering someone’s space shows respect.',
      },
      {
        id: 'reader:end-epi-gate-guest-l2',
        domain: 'literacy',
        skill: 'personification',
        standard: 'L.4.5',
        kind: 'notice',
        after: 3,
        lines: [
          N('A gatepost can’t talk. Saying it “did not comment” gives it a person’s action, as a joke.'),
          N('Giving human actions to things that aren’t human is called personification.'),
        ],
        parentNote: 'Your child learned the word personification and spotted an example.',
      },
    ],
  },
  {
    id: 'reader:end-epi-gate-shut',
    of: 'end-epi-gate-shut',
    band: 'reader',
    lines: [
      N('Corvin doesn’t come.'),
      N('Some mornings there are footprints in the dew by the gatepost. They stop there, and turn round.'),
      N('You never mention them.'),
      N('You don’t sweep them away, either.'),
      N('By the time the sun is high, the dew has dried and the footprints are gone.'),
      N('The next week, they are back.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-gate-shut-l1',
        domain: 'science',
        skill: 'dew forms and evaporates',
        standard: '2-PS1-4',
        kind: 'notice',
        after: 1,
        lines: [
          N('On clear, cold nights the grass gets colder than the air. Water vapour in the air turns into tiny drops on it. That’s dew.'),
          N('When the sun warms the grass, the dew evaporates: it turns back into vapour and floats away into the air.'),
        ],
        parentNote: 'Your child learned how dew forms on cold nights and evaporates in the sun.',
      },
      {
        id: 'reader:end-epi-gate-shut-l2',
        domain: 'literacy',
        skill: 'infer feelings from clues',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 5,
        prompt: [N('The footprints come to the gate, stop, and turn round. What do they tell you about Corvin?')],
        options: [
          {
            label: 'He wants to come in, but he can’t make himself.',
            best: true,
            reply: [N('Yes. He keeps coming back, so he wants to. He keeps turning round, so something stops him. Clues tell a story.')],
          },
          {
            label: 'He was just going for a walk.',
            reply: [
              N('Maybe once. But they stop right at your gate, again and again. That’s a clue.'),
              N('He wants to come in, but he can’t make himself.'),
            ],
          },
        ],
        parentNote: 'Your child used clues to infer a character’s feelings without being told.',
      },
    ],
  },
  {
    id: 'reader:end-epi-gate-none',
    of: 'end-epi-gate-none',
    band: 'reader',
    lines: [
      N('There is a chair by the pond that nobody sits in.'),
      N('Gran Hazel put it there years ago.'),
      N('It faces the gate.'),
      N('You never asked her who it was for.'),
      N('You leave it where it is. You dust it on Sundays.'),
      N('Some things are kept for someone, even if they never come.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-gate-none-l1',
        domain: 'literacy',
        skill: 'think question: inferring from clues',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 3,
        prompt: [N('The chair faces the gate. Who do you think Gran Hazel kept it for? There is no wrong answer.')],
        options: [
          {
            label: 'Corvin.',
            reply: [N('Lots of readers think so. She wedged the gate so she’d hear him if he ever came back. A chair facing the gate fits.')],
          },
          {
            label: 'Moss.',
            reply: [N('That’s a lovely idea. Moss sat beside her for forty years. Though he did prefer the ground.')],
          },
          {
            label: 'Anyone who comes back.',
            reply: [N('That’s a big-hearted answer. A chair that waits for anyone at all. Hazel would have liked that.')],
          },
        ],
        parentNote: 'Your child made an inference from clues and explained their reasoning, with no single right answer.',
      },
    ],
  },
  // ---------------------------------------------------------------- Aldous's letter (S13)
  {
    id: 'reader:end-epi-mill-kept',
    of: 'end-epi-mill-kept',
    band: 'reader',
    lines: [
      N('Corvin reads his father’s letter on Sundays.'),
      N('He told Tobin so, and Tobin told everyone, which is how things get told in this valley.'),
      N('Tobin says the folds of the letter have gone as soft as cloth.'),
      N('Tobin says a great many things. You believe this one.'),
      N('A letter can be read again and again. Every time, his father says the same kind words.'),
      N('Paper remembers, when people can’t.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-mill-kept-l1',
        domain: 'literacy',
        skill: 'what a simile tells you',
        standard: 'L.4.5',
        kind: 'ask',
        after: 2,
        prompt: [N('The folds have gone “as soft as cloth”. What does that simile tell you?')],
        options: [
          {
            label: 'He has opened and folded it so many times the paper has gone soft.',
            best: true,
            reply: [N('Yes. Paper only goes that soft with lots of handling. So he reads it a lot. The simile tells you without saying it.')],
          },
          {
            label: 'The letter is made of cloth.',
            reply: [
              N('It’s paper. The simile says it has become like cloth, soft from being folded and opened again and again.'),
              N('So he reads it a lot.'),
            ],
          },
        ],
        parentNote: 'Your child worked out what a simile reveals about a character’s actions.',
      },
      {
        id: 'reader:end-epi-mill-kept-l2',
        domain: 'social-studies',
        skill: 'letters as a window on the past',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 5,
        lines: [
          N('Old letters and diaries are one of the ways we learn about life long ago.'),
          N('They show what real people thought and felt, in their own words. Historians treasure them.'),
        ],
        parentNote: 'Your child learned that letters and diaries help us learn about life in the past.',
      },
    ],
  },
  {
    id: 'reader:end-epi-mill-kept-ungiven',
    of: 'end-epi-mill-kept-ungiven',
    band: 'reader',
    lines: [
      N('Aldous Vale’s letter is still in the tin box under your bed, beside Gran Hazel’s.'),
      N('It is waiting for a man who can feel his hands.'),
      N('You take it out sometimes, and don’t read it, and put it back.'),
      N('It isn’t yours. You’re only carrying it.'),
      N('Some things we keep for other people. Keeping them safe, and not opening them, is a way of being trusted.'),
      N('One day, perhaps, he will be ready.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-mill-kept-ungiven-l1',
        domain: 'sel',
        skill: 'respecting other people’s privacy',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 3,
        prompt: [N('You’re curious about what Aldous wrote. Should you read Corvin’s letter?')],
        options: [
          {
            label: 'No. It belongs to Corvin. It’s his to read first.',
            best: true,
            reply: [N('Yes. Being curious is natural. Respecting someone’s privacy, even when you’re curious, is how people learn to trust you.')],
          },
          {
            label: 'Yes. He’ll never know.',
            reply: [
              N('He might not. But you would know. The letter is his, and it’s his to read first.'),
              N('Respecting someone’s privacy, even when nobody would find out, is how people learn to trust you.'),
            ],
          },
        ],
        parentNote: 'Your child thought about respecting privacy and why it builds trust.',
      },
    ],
  },
  {
    id: 'reader:end-epi-mill-burned',
    of: 'end-epi-mill-burned',
    band: 'reader',
    lines: [
      N('Tobin lights the mill stove on cold mornings and tells the Nubbins stories in front of it. He never finishes one.'),
      N('The letter is ash now. Burnt paper can never be paper again.'),
      N('Corvin never knew there was a letter.'),
      N('Some days you think that was a kindness. Some days you think it was a door you shut for him.'),
      N('Both, probably. Tobin says most things are both.'),
      N('Tobin says a great many things.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-mill-burned-l1',
        domain: 'science',
        skill: 'changes that can and can’t be undone',
        standard: '2-PS1-4',
        kind: 'notice',
        after: 1,
        lines: [
          N('Some changes can be undone. Ice melts into water, and the water can freeze into ice again.'),
          N('Some can’t. When paper burns, it turns into ash and smoke, and it can never become paper again.'),
        ],
        parentNote: 'Your child learned that some heating changes can be reversed (melting) and some cannot (burning).',
      },
      {
        id: 'reader:end-epi-mill-burned-l2',
        domain: 'sel',
        skill: 'mixed feelings',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N('You can feel two different things about one choice, both at the same time. That’s called having mixed feelings.'),
          N('It’s normal. It usually means the choice was a hard one, and you cared about getting it right.'),
        ],
        parentNote: 'Your child learned that mixed feelings are normal, especially about hard choices.',
      },
    ],
  },
  {
    id: 'reader:end-epi-mill-grave',
    of: 'end-epi-mill-grave',
    band: 'reader',
    lines: [
      N('The rain washed the ink away by spring. Tobin says that’s how you post a letter to the dead. Tobin says a great many things.'),
      N('You left it on the grave of Aldous Vale, Corvin’s father, who died long ago.'),
      N('Someone keeps the grass short round his stone, under the alders. Not Tobin. Tobin’s knees wouldn’t allow it.'),
      N('Alders are trees that like wet ground. They grow well beside rivers and streams.'),
      N('The mill wheel turns beside the grave at the river’s pace.'),
      N('He would have hated that. He would have got used to it.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-mill-grave-l1',
        domain: 'science',
        skill: 'a water wheel turns moving water into useful work',
        standard: '4-PS3-4',
        kind: 'notice',
        after: 4,
        lines: [
          N('The river pushes against the paddles of the mill wheel, and the wheel turns.'),
          N('Inside a mill, that turning drives big millstones that grind grain into flour. The wheel changes the moving water’s energy into useful work.'),
        ],
        parentNote: 'Your child learned how a water wheel uses the energy of moving water to do work, like grinding flour.',
      },
    ],
  },
  // ---------------------------------------------------------------- Cinder (S19)
  {
    id: 'reader:end-epi-cinder-forgiven',
    of: 'end-epi-cinder-forgiven',
    band: 'reader',
    lines: [
      N('In the spring there is a new flower on the hill. It is red.'),
      N('It comes up a little apart from the others, as if it isn’t sure it’s allowed.'),
      N('By midsummer the others have leant towards it. Briar’s yellow one most of all.'),
      N('The Long-Grass lantern burns warm now. On cold nights the grey ones sleep in a ring round the foot of the post.'),
      N('The children still skip to Cinder’s rhyme:'),
      N('“Cinder held them close and tight, kept them warm one winter night; when the morning came to call, they did not move at all.”'),
      N('Lately, at the end of it, they run up the hill and touch the red flower. Nobody told them to.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-cinder-forgiven-l1',
        domain: 'science',
        skill: 'plants grow towards light',
        standard: '2-LS2-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('Real plants lean too, but towards sunlight. Plants need light to make their food.'),
          N('A stem grows a little more on its shady side, so it bends towards the light. Try it with a plant on a windowsill.'),
        ],
        parentNote: 'Your child learned that plants need light and bend towards it as they grow.',
      },
      {
        id: 'reader:end-epi-cinder-forgiven-l2',
        domain: 'literacy',
        skill: 'find the rhyming words',
        standard: 'RL.2.4',
        kind: 'ask',
        after: 4,
        prompt: [N('Which words rhyme in Cinder’s rhyme?')],
        options: [
          {
            label: 'Tight and night. Call and all.',
            best: true,
            reply: [N('Yes. Rhymes make a chant easy to remember. That’s why children have skipped to it for so long.')],
          },
          {
            label: 'Cinder and winter.',
            reply: [
              N('They sound a little alike, but they don’t quite rhyme. Listen to the ends of the lines.'),
              N('Tight and night. Call and all. Rhymes make a chant easy to remember.'),
            ],
          },
          {
            label: 'Warm and morning.',
            reply: [
              N('They share an “or” sound in the middle, but rhymes match at the end. Listen to the ends of the lines.'),
              N('Tight and night. Call and all. Rhymes make a chant easy to remember.'),
            ],
          },
        ],
        parentNote: 'Your child found rhyming words in a chant and noticed how rhyme helps memory.',
      },
    ],
  },
  {
    id: 'reader:end-epi-cinder-remembered',
    of: 'end-epi-cinder-remembered',
    band: 'reader',
    lines: [
      N('In the spring there is a new flower on the hill. It is red.'),
      N('It comes up a little apart from the others, as if it isn’t sure it’s allowed.'),
      N('You never said she was forgiven. It wasn’t yours to say.'),
      N('But you tell her story, all of it, to anyone who asks, and some who don’t.'),
      N('The Long-Grass lantern burns warm now. You stand beside it on cold nights, and don’t explain why.'),
      N('The children still skip to her rhyme. Now, at the end, one always shouts “She loved them!” and the rest shout “Too tight!”'),
      N('Then they all run off, laughing. It’s the whole story. They’ve got it right.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-cinder-remembered-l1',
        domain: 'sel',
        skill: 'think question: who can forgive',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 1,
        prompt: [N('“It wasn’t yours to say.” Who do you think gets to forgive Cinder? There is no wrong answer.')],
        options: [
          {
            label: 'The Nubbins she hurt.',
            reply: [N('That’s a fair answer. Many people think only the ones who were hurt can truly forgive.')],
          },
          {
            label: 'Everyone in the Grove.',
            reply: [N('That’s a generous answer. The whole valley has lived with what she did, so maybe they all get a say.')],
          },
          {
            label: 'Nobody can now. It was too long ago.',
            reply: [N('That’s a thoughtful answer. Some things can’t be forgiven by anyone left. They can still be remembered honestly.')],
          },
        ],
        parentNote: 'Your child considered who has the right to forgive a wrong, with no single right answer.',
      },
      {
        id: 'reader:end-epi-cinder-remembered-l2',
        domain: 'literacy',
        skill: 'theme: sum up a story’s big idea',
        standard: 'RL.4.2',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            '“She loved them!” “Too tight!” The children sum up Cinder’s whole story in four words.',
          ),
          N(
            'That is its big idea, its theme: you can love someone and still hurt them by holding on too tight.',
          ),
        ],
        parentNote:
          'Noticed how a few words can sum up a story’s theme: love that holds on too tight can do harm.',
      },
    ],
  },
  // ---------------------------------------------------------------- Hazel's walk (S10)
  {
    id: 'reader:end-epi-walk-you',
    of: 'end-epi-walk-you',
    band: 'reader',
    lines: [
      N('You walked her up. You know exactly which flower is hers.'),
      N('Small, brisk, a bit untidy, and turned towards the Grove.'),
      N('You go up and tell it things. Mostly the bad bits. She’d like those best.'),
      N('Gran Hazel died, and she isn’t coming back. But talking to her flower still helps.'),
      N('Lots of people visit the place where someone they loved is remembered, and talk to them there.'),
      N('It is a way of keeping them close.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-walk-you-l1',
        domain: 'sel',
        skill: 'remembering someone who has died',
        standard: 'CASEL: Self-awareness',
        kind: 'do',
        after: 5,
        check: 'edu:tell:flower:news',
        lines: [
          N('Tap Gran Hazel’s flower and tell it one thing that happened this week. A good bit or a bad bit. She liked both.'),
          N('Telling someone you miss about your life is a way of carrying them with you.'),
        ],
        parentNote: 'Your child practised a gentle way of remembering someone who has died: talking to them about their week.',
      },
    ],
  },
  {
    id: 'reader:end-epi-walk-moss',
    of: 'end-epi-walk-moss',
    band: 'reader',
    lines: [
      N('Moss stayed at the top with her that night, and the next, and all the rest of the winter.'),
      N('The winter nights were long. The days were short and grey.'),
      N('In the spring, when her flower opened, he came down the path, thinner, and sat by the pond as if he had been gone an afternoon.'),
      MOSS('I decided.', 'soft'),
      N('Byte checked his shoelaces at once. They were untied.'),
      N('Moss looked very pleased.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-walk-moss-l1',
        domain: 'science',
        skill: 'why winter nights are long',
        standard: '1-ESS1-2',
        kind: 'notice',
        after: 1,
        lines: [
          N('The Earth is tilted. In winter, our half of the Earth leans away from the Sun.'),
          N('The Sun stays low in the sky, the days are short, and the nights are long.'),
          N('In spring our half leans back towards the Sun, and the days grow longer.'),
        ],
        parentNote: 'Your child learned that the Earth’s tilt makes winter days short and nights long.',
      },
    ],
  },
  {
    id: 'reader:end-epi-walk-moss-stayed',
    of: 'end-epi-walk-moss-stayed',
    band: 'reader',
    lines: [
      N('Moss rode up the hill on Gran Hazel’s shoulder.'),
      N('At the top, for the first time since the Long Night, he turned round to face the Grove.'),
      N('He stayed up there with her, and never came down. He faded there, beside her. That means he died too.'),
      N('In the spring there were two flowers up there, very close together, leaning in like old friends sharing a joke.'),
      N('It is sad. It is also, somehow, exactly right.'),
      N('Hazel and Moss sat side by side for forty years. Now they always will.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-walk-moss-stayed-l1',
        domain: 'literacy',
        skill: 'what a simile makes you feel',
        standard: 'L.4.5',
        kind: 'ask',
        after: 3,
        prompt: [N('The flowers lean in “like old friends sharing a joke”. How does that simile make the sad part feel?')],
        options: [
          {
            label: 'Warmer. They’re together, and it’s almost happy.',
            best: true,
            reply: [N('Yes. The writer can’t take the sadness away, but the simile adds a little warmth to it. That is what good similes can do.')],
          },
          {
            label: 'Funny. Flowers can’t tell jokes.',
            reply: [
              N('Ha, they can’t! But the writer isn’t trying to be silly.'),
              N('The simile shows Hazel and Moss are together and almost happy. It adds warmth to a sad moment.'),
            ],
          },
        ],
        parentNote: 'Your child explained how a simile changes the feeling of a sad moment.',
      },
    ],
  },
  {
    id: 'reader:end-epi-walk-sable',
    of: 'end-epi-walk-sable',
    band: 'reader',
    lines: [
      N('Sable walked her up, and came down alone, and sat on your step.'),
      N('She sits there every evening now, at dusk, facing the hill.'),
      N('When the lanterns are lit, she comes in.'),
      N('Every evening. Same time. Same step.'),
      N('It has become her routine, and routines can help us feel safe.'),
      N('Sable’s routine says: I remember her, and I’m still here with you.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-walk-sable-l1',
        domain: 'maths',
        skill: 'time intervals in hours',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 1,
        prompt: [
          N('Dusk moves through the year. In the Grove, December’s dusk comes at about 4 o’clock. June’s comes at about 9 o’clock.'),
          N('How many hours later is June’s dusk?'),
        ],
        options: [
          {
            label: '5 hours',
            best: true,
            reply: [N('Yes. Count on from 4: 5, 6, 7, 8, 9. Five hours. Sable sits up much later in summer.')],
          },
          {
            label: '4 hours',
            reply: [N('Let’s count on from 4 o’clock: 5, 6, 7, 8, 9. That’s five hours.')],
          },
          {
            label: '13 hours',
            reply: [N('That would be adding 4 and 9. We want the gap. Count on from 4: 5, 6, 7, 8, 9. Five hours.')],
          },
        ],
        parentNote: 'Your child found the time between two o’clock times by counting on (4 o’clock to 9 o’clock is 5 hours).',
      },
    ],
  },
  {
    id: 'reader:end-epi-walk-corvin',
    of: 'end-epi-walk-corvin',
    band: 'reader',
    lines: [
      N('Corvin carried her lantern up the hill, and left it burning at the top with her.'),
      N('At first light he went back up for it. It hangs on the hook by the cottage door now.'),
      N('He trims the wick himself when he comes, and won’t let anyone else touch it.'),
      N('A wick is the string in a lantern that soaks up the oil and carries it up to the flame.'),
      N('Trimming it keeps the flame bright and clean, with less smoke.'),
      N('Hazel trimmed it every evening for forty years. Now he does.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-walk-corvin-l1',
        domain: 'health',
        skill: 'fire safety with flames',
        kind: 'notice',
        after: 4,
        lines: [
          N('Flames are hot and can burn skin, hair and clothes in a moment.'),
          N('In real life, only light lanterns and candles with a grown-up, and someone should always keep an eye on the flame.'),
          N('That’s why the whole valley took turns watching Hazel’s lantern all night.'),
        ],
        parentNote: 'Your child learned simple fire-safety rules about lanterns and candles.',
      },
    ],
  },
  {
    id: 'reader:end-epi-walk-alone',
    of: 'end-epi-walk-alone',
    band: 'reader',
    lines: [
      N('You walked her up alone, the way she wanted. Nobody else saw her go.'),
      N('You tell them about it, when they ask.'),
      N('You tell them about the view, and the sitting, and what she said.'),
      N('You leave out the waving. That part is yours.'),
      N('Some memories are for sharing. Some are just for you. Both kinds are allowed.'),
      N('You keep that one close, like a warm stone in a pocket. The good kind.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-walk-alone-l1',
        domain: 'sel',
        skill: 'private memories are allowed',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 3,
        prompt: [N('Is it all right to keep a happy memory just for yourself?')],
        options: [
          {
            label: 'Yes. Some memories can be private.',
            best: true,
            reply: [N('Yes. A private happy memory is different from a worrying secret. It hurts nobody, and it can comfort you for years.')],
          },
          {
            label: 'No. You have to tell everyone everything.',
            reply: [
              N('You never have to share every happy memory. Some can be private, and comfort you for years.'),
              N('Worrying secrets are different: those you should tell a grown-up you trust.'),
            ],
          },
        ],
        parentNote: 'Your child learned that keeping a happy memory private is fine, unlike a worrying secret.',
      },
    ],
  },
  {
    id: 'reader:end-epi-told',
    of: 'end-epi-told',
    band: 'reader',
    lines: [
      N('The whole valley walked her to the foot of the hill.'),
      N('They still meet there once a year, on the day she went up the hill.'),
      N('They stand together, and say nothing, badly. It has become a tradition.'),
      N('Fern brings lantern buns. They come out every time now.'),
      N('She says it’s because she stopped trying so hard.'),
      N('Hazel would have said that was the whole trick.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-told-l1',
        domain: 'social-studies',
        skill: 'traditions help communities remember',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 2,
        lines: [
          N('Families and towns all over the world keep traditions: special days, songs and foods that come round again each year.'),
          N('Traditions help people remember the past, and feel that they belong together. What traditions does your family have?'),
        ],
        parentNote: 'Your child learned what a tradition is and how traditions help communities remember and belong.',
      },
    ],
  },
  {
    id: 'reader:end-epi-secret',
    of: 'end-epi-secret',
    band: 'reader',
    lines: [
      N('She left the letter under Fern’s stone on the signpost. Fern says she always knew that stone would come in useful.'),
      N('The valley found out from her letter. Clover cried on it. Sparks tried to fix it. Byte made a graph, and wouldn’t show anyone.'),
      N('You saw it, though. It was a bar chart called TIMES CRIED THIS WEEK.'),
      N('Clover: 9. Fern: 6. Sparks: 4. Byte: smudged out. It might have been 7.'),
      N('Then they all came up the hill that evening with lanterns, and argued about where she’d have wanted them to stand.'),
      N('Everyone grieves in their own way. Crying, fixing, counting, arguing about where to stand. All of it is love.'),
    ],
    lessons: [
      {
        id: 'reader:end-epi-secret-l1',
        domain: 'maths',
        skill: 'read and compare a bar chart',
        standard: '2.MD.D.10',
        kind: 'ask',
        after: 3,
        prompt: [N('Read Byte’s bar chart. How many more times did Clover cry than Sparks?')],
        options: [
          {
            label: '5 more times',
            best: true,
            reply: [N('Yes. Clover’s bar goes to 9, Sparks’s to 4. 9 take away 4 is 5. Byte would be proud. He would not say so.')],
          },
          {
            label: '4 more times',
            reply: [N('4 is how many times Sparks cried. Find the difference: Clover 9, Sparks 4. 9 take away 4 is 5.')],
          },
          {
            label: '13 more times',
            reply: [N('13 is 9 and 4 added together. To find how many more, take away: 9 take away 4 is 5.')],
          },
        ],
        parentNote: 'Your child read a bar chart and found the difference between two bars (9 − 4 = 5).',
      },
      {
        id: 'reader:end-epi-secret-l2',
        domain: 'sel',
        skill: 'people grieve in different ways',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('When someone is grieving, you don’t have to fix it, or make them feel better straight away.'),
          N('Just being with them, in the way they need, helps more than you’d think.'),
        ],
        parentNote: 'Your child learned that people grieve in different ways and that being present is a real help.',
      },
    ],
  },
];

// ================================================================ glossary
const GLOSSARY: GlossaryEntry[] = [
  { word: 'poorly', meaning: 'Ill. A British word for being unwell.', scene: 'c11-open' },
  { word: 'theme', meaning: 'The big idea a story is really about, underneath what happens.', scene: 'c11-open' },
  { word: 'faded', meaning: 'In the Grove, the word for when a Nubbin or an Eternal dies.', scene: 'c11-moss-gone' },
  { word: 'fuss', meaning: 'A lot of attention or worry about something.', scene: 'c11-moss-gone' },
  { word: 'habit', meaning: 'Something you do so often that you do it without thinking.', scene: 'c11-cold-hands' },
  { word: 'body language', meaning: 'What the way you sit, stand, move or turn your face says about how you feel, without any words.', scene: 'c11-moss-kept' },
  { word: 'figurative language', meaning: 'Words used in a special way, not exactly true, to help you picture or feel something.', scene: 'c11-cold-hands' },
  { word: 'grub', meaning: 'A young insect, like a baby beetle, that looks like a small fat worm.', scene: 'c11-close' },
  { word: 'dramatic', meaning: 'Making a big, showy fuss, like in a play.', scene: 'c11-close' },
  { word: 'latch', meaning: 'A small bar or catch that keeps a gate or door shut.', scene: 'c11-gate' },
  { word: 'condensation', meaning: 'Tiny drops of water that form when water in the air cools down.', scene: 'c11-gate' },
  { word: 'collapsed', meaning: 'Fallen down or caved in.', scene: 'c12-open' },
  { word: 'evidence', meaning: 'Something you can show that proves a thing is true.', scene: 'c12-open' },
  { word: 'dreadful', meaning: 'Very bad. Here it means the Keepers were very upset and fussy.', scene: 'c12-foot-told' },
  { word: 'unhurried', meaning: 'Slow and calm, not in a rush.', scene: 'c12-foot-secret' },
  { word: 'simile', meaning: 'A comparison that uses “as” or “like”, such as “as small as buttons”.', scene: 'c12-walk-you' },
  { word: 'perspective', meaning: 'The way things look smaller the further away they are, and how artists draw that.', scene: 'c12-walk-you' },
  { word: 'stagger', meaning: 'To walk unsteadily, as if you might fall.', scene: 'c12-walk-moss' },
  { word: 'dusk', meaning: 'The time just after the Sun sets, when the sky is getting dark.', scene: 'c12-walk-sable' },
  { word: 'heron', meaning: 'A tall grey bird with long legs and a sharp beak that stands still in water to catch fish.', scene: 'c12-walk-corvin' },
  { word: 'apprentice', meaning: 'Someone who learns a job by working beside an expert.', scene: 'c12-walk-corvin' },
  { word: 'brisk', meaning: 'Quick, lively and no-nonsense.', scene: 'c12-close' },
  { word: 'life cycle', meaning: 'The stages a living thing goes through, from start to grown-up and on to new young.', scene: 'c12-close' },
  { word: 'obviously', meaning: 'In a way that is so clear anyone can see it.', scene: 'end-hazels-grove' },
  { word: 'method', meaning: 'A way of doing something, step by step.', scene: 'end-hazels-grove-last' },
  { word: 'coincidence', meaning: 'When two things happen together just by chance, with no reason linking them.', scene: 'end-eternal-dawn-nomoss' },
  { word: 'statistically', meaning: 'Going by the numbers and how likely things are.', scene: 'end-eternal-dawn-nomoss' },
  { word: 'by heart', meaning: 'Knowing something so well you can say it without looking.', scene: 'end-eternal-dawn-last' },
  { word: 'newcomer', meaning: 'Someone who has only just arrived.', scene: 'end-shadow-keeper' },
  { word: 'flickers', meaning: 'Shines unsteadily, getting brighter and dimmer.', scene: 'end-moss-sleeps' },
  { word: 'regret', meaning: 'Wishing you had done something differently.', scene: 'end-moss-sleeps' },
  { word: 'oral history', meaning: 'History kept by telling it out loud, from one person to the next.', scene: 'end-moss-sleeps-last' },
  { word: 'habitat', meaning: 'The place where an animal or plant lives and finds what it needs.', scene: 'end-wild-grove' },
  { word: 'stubborn', meaning: 'Not giving up or changing your mind easily.', scene: 'end-wild-grove' },
  { word: 'lighthouse', meaning: 'A tower with a bright light that helps ships find their way at night.', scene: 'end-empty-lantern' },
  { word: 'hopeful', meaning: 'Feeling that something good might still happen.', scene: 'end-empty-lantern-last' },
  { word: 'collector', meaning: 'Someone who gathers things and keeps them.', scene: 'end-collector' },
  { word: 'friction', meaning: 'A force made when two surfaces rub together. It slows or stops movement.', scene: 'end-collector-last' },
  { word: 'metaphor', meaning: 'Saying one thing is another, to show an idea, without using “like” or “as”.', scene: 'end-long-road' },
  { word: 'trembled', meaning: 'Shook a little, from fear or cold.', scene: 'end-epi-wisp-spared' },
  { word: 'ridge', meaning: 'A long, narrow line of high ground.', scene: 'end-epi-wisp-driven' },
  { word: 'amends', meaning: 'Something good you do to help put right a wrong.', scene: 'end-epi-wisp-driven' },
  { word: 'nocturnal', meaning: 'Busy at night and resting by day.', scene: 'end-epi-wisp-none' },
  { word: 'personification', meaning: 'Giving human actions or feelings to things that aren’t human.', scene: 'end-epi-gate-guest' },
  { word: 'dew', meaning: 'Tiny drops of water that form on cold grass overnight.', scene: 'end-epi-gate-shut' },
  { word: 'evaporates', meaning: 'Turns from liquid water into an invisible gas in the air.', scene: 'end-epi-gate-shut' },
  { word: 'mixed feelings', meaning: 'Feeling two different ways about the same thing at once.', scene: 'end-epi-mill-burned' },
  { word: 'alder', meaning: 'A tree that grows well in wet ground, beside rivers and streams.', scene: 'end-epi-mill-grave' },
  { word: 'forgiven', meaning: 'No longer blamed or held angry with, for a wrong thing done.', scene: 'end-epi-cinder-remembered' },
  { word: 'tilted', meaning: 'Leaning to one side, not straight up.', scene: 'end-epi-walk-moss' },
  { word: 'routine', meaning: 'Something you do the same way, at the same time, again and again.', scene: 'end-epi-walk-sable' },
  { word: 'wick', meaning: 'The string in a lantern or candle that carries the fuel up to the flame.', scene: 'end-epi-walk-corvin' },
  { word: 'tradition', meaning: 'Something a family or community does again and again, often every year.', scene: 'end-epi-told' },
  { word: 'grieves', meaning: 'Feels deep sadness because someone they love has died.', scene: 'end-epi-secret' },
  { word: 'bar chart', meaning: 'A chart that uses bars of different lengths to show and compare numbers.', scene: 'end-epi-secret' },
];

// ================================================================ the campaign slice
export const EDU_CAMPAIGN_3B_READER: EduCampaign = {
  id: 'reader:book3b',
  band: 'reader',
  chapters: {
    11: {
      title: 'Hazel',
      goalText: 'Talk with three different Keepers. Then sit with Gran Hazel by the pond.',
      hint: 'Walk up to a Keeper and tap them to talk. They stayed up all night for the Grove; they will stay a little longer.',
    },
    12: {
      title: 'Keepers',
      goalText: 'Decide what the Grove will be: a home with a stuck gate, or open, with no gate at all.',
      hint: 'You choose in the scene. There is no wrong answer. Your ending depends on everything you did, so look at the Paths page if you want to know more.',
    },
  },
  scenes: [...CH11, ...CH12, ...ENDING_SCENES, ...EPILOGUE_SCENES],
  endings: {
    collector: {
      title: 'The Collector',
      how: 'Sell your Nubbin to Corvin in chapter 2 and never buy anyone back. Or, at the Wellspring’s edge, keep the stone instead of unmaking it.',
    },
    'empty-lantern': {
      title: 'The Empty Lantern',
      how: 'Lose Sable. If her trust stays under 5 for ten minutes, she runs away. If you don’t win her back before the end, this is your ending.',
    },
    'eternal-dawn': {
      title: 'Eternal Dawn (secret)',
      how: 'Raise one of your own Nubbins into an Eternal: two rebirths, then a Normal-type evolution with a strong alignment. And finish with Sable bonded to you.',
    },
    'wild-grove': {
      title: 'Wild Grove',
      how: 'Open the pens by force in chapter 9. Then, at the very end, choose “Open. No gate.”',
    },
    'hazels-grove': {
      title: 'Hazel’s Grove',
      how: 'Bond with Sable (trust 70 or more). Keep Moss loved (affection 40 or more when chapter 10 begins). Make peace with Corvin in chapter 9, and unmake the stone. Either choice at the gate will do.',
    },
    'moss-sleeps': {
      title: 'Moss’s Flower',
      how: 'Bond with Sable, but let Moss fade: his affection is under 40 when chapter 10 begins. If he walks into the Wellspring, only a loved Moss comes back.',
    },
    'shadow-keeper': {
      title: 'The Shadow’s Keeper',
      how: 'Bond with Sable and keep Moss loved, but don’t make peace with Corvin: buy Ash back, or open the pens by force, in chapter 9.',
    },
    'long-road': {
      title: 'The Long Road',
      how: 'Reach the end with Sable still with you, but not yet bonded (trust under 70). If no other ending fits, this is the one you get.',
    },
  },
  glossary: GLOSSARY,
  notes:
    'Reader band, Book Three part two: chapters 11–12, all eight endings and every epilogue variant (Book Three end-epi-* plus ' +
    'the S13 end-epi-mill-* and S19 end-epi-cinder-* scenes from SIDE_STORIES_NEW_3_VARIANTS). Every choice is kept with its ' +
    'original id and flags (gate-leave | gate-cruel | gate-tea; keep | free with finalChoice / letThemGo). Death is named ' +
    'plainly where the main script implies it: Moss fading (c11-moss-gone, c11-moss-passed, end-moss-sleeps, ' +
    'end-epi-walk-moss-stayed) and Hazel’s death (c11-open names her illness without naming any disease; c11-close explains “going ' +
    'up the hill”; c12-close says she died). EDU-STYLE forbids describing death as sleeping, so the reader title of the ' +
    'moss-sleeps ending is “Moss’s Flower” (id unchanged), and its title card line matches. Each ending’s -last scene ends ' +
    'with one reflective line. The WALK_TOP hilltop lines are reworded slightly (“as small as buttons”) to carry the ' +
    'c12-walk-you simile and perspective lessons. Prices and counts in maths lessons (25-Shell eggs, Byte’s teapot tally, ' +
    'Byte’s bar chart, Grove dusk times) are story details invented for the lesson, framed as “say” or in-world facts. ' +
    'MIRROR (2026-10-14, campaign-book3.ts fixes). New scenes: c11-moss-kept (keep route: Moss on the hill, back to the ' +
    'Grove), c11-moss-passed (after c10-moss-fades; shares MOSS_GONE_TAIL with c11-moss-gone) and end-hazels-grove-open ' +
    '(plays INSTEAD of end-hazels-grove when letThemGo; shares HAZELS_GROVE_BODY and the OBVIOUSLY lesson). Hazel’s ' +
    'Grove no longer needs “A home”. c11-close opens with “Days go by like that” (chapter 11 spans a few days). S8 SWAP: ' +
    'if s8Done, c11-close line 7 “The thin grey Nubbin wakes, looks at you, and goes back to sleep.” becomes “Gran ' +
    'Hazel’s arm is empty now. She keeps it crooked anyway, out of habit.” (the same swap as the main scene’s note). ' +
    'S9 LINE: if s9-ask has been seen, insert after c11-close line 0 “Then comes the evening Corvin asks at the gate.” ' +
    '(as in the main scene’s note; line numbers above count without it). ' +
    'c11-gate is a return, not a discovery: Corvin tries the latch once (he said in S9 he would stand there till first ' +
    'light), and Hazel’s stance is “It’s your gate now”; the think question was rewritten to match. c12-walk-corvin ' +
    'leaves the lantern burning at the top; end-epi-walk-corvin fetches it at first light to the cottage door. ' +
    'end-collector-kept and end-epi-walk-moss-stayed: Moss stays on the hill after Hazel goes up. c11-close’s frog ' +
    '(December) is now an owl. The mid-epilogue definitions of tradition and routine moved to the glossary.',
};

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:breathe:slow:3',
  'edu:count:buns:24',
  'edu:order:life-cycle:flower',
  'edu:tap:compass:west',
  'edu:tie:shoelace:bow',
  'edu:recite:lantern-song:chorus',
  'edu:sort:habitat-needs:4',
  'edu:tell:flower:news',
];
