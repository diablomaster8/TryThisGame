/**
 * The Learning Grove: Book Two (chapters 5–8), reader band (ages 7–10).
 * Educational versions of every scene in BOOK2_SCENES (campaign-book2.ts), the chapter
 * journal text for chapters 5–8, and a glossary. Rules: EDU-STYLE.md. Canon: story bible.
 */
import type { EduCampaign, EduScene, Lesson, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Line['mood']): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const YOU = say('you');
const MOSS = say('moss');
const CORVIN = say('corvin');
const HAZEL = say('hazel');
const MARINA = say('marina');
const SPARKS = say('sparks');
const CLOVER = say('clover');
const PIXEL = say('pixel');
const FERN = say('fern');
const LUNA = say('luna');
const EMBER = say('ember');
const BYTE = say('byte');
const DUSTY = say('dusty');
const NOVA = say('nova');

type LessonBody = Omit<Lesson, 'id'>;

/** Builds a reader-band EduScene; lesson ids are `reader:<of>-l<n>` in the order given. */
const scene = (of: string, lines: Line[], lessons: LessonBody[], choices?: Choice[]): EduScene => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  lines,
  ...(choices ? { choices } : {}),
  lessons: lessons.map((l, i) => ({ id: `reader:${of}-l${i + 1}`, ...l })),
});

// ---------------------------------------------------------------- chapter journal

const CHAPTERS: EduCampaign['chapters'] = {
  5: {
    title: 'The Circuit',
    goalText: 'Win a race. Any course, any level.',
    hint: 'Open Races from the top bar. A grown Nubbin with trained skills runs best. On the results table, the smallest time wins!',
  },
  6: {
    title: 'Rain on the Hill',
    goalText: 'Sit with Dusty by the flower.',
    hint: 'Walk up to Dusty and tap them. You don’t have to say anything. Being there is the help.',
  },
  7: {
    title: 'What Fear Teaches',
    goalText: 'Help Sable trust you more. Bring her trust up to 45.',
    hint: 'Feeding and petting build trust. Hunger and throwing break it. Grey Nubbins heal slowly, so be patient: from 20 to 45 is 25 more.',
  },
  8: {
    title: 'The Hollow',
    goalText: 'Walk through the Hollow and find Gran Hazel’s notebook.',
    hint: 'The Hollow is dark. Follow the fireflies to a flat stone, then tap the notebook. Expeditions from the top bar go through the Hollow now too.',
  },
};

// ---------------------------------------------------------------- chapter 5: The Circuit

const CH5: EduScene[] = [
  scene(
    'c5-open',
    [
      N('It’s high summer. The Grove smells of cut grass and warm plums, and somebody is at the gate.'),
      N('Wasps buzz, dizzy, in the plum tree. Your Nubbin has climbed right into the warm pond, all of it.'),
      N('The visitor lifts and pushes the gate without being told. Whoever she is, she has been here before.'),
      EMBER('Ember. I don’t do small talk.', 'angry'),
      N('She doesn’t do big talk either, it turns out, for nearly a minute. She just looks at the gate.'),
      EMBER('Corvin Vale is running the Circuit this week, and he’s invited you. That isn’t a kindness.'),
      EMBER('He wants to see what you’ve got, so he can put a price on it.'),
      EMBER('Hazel gave me an egg, once. I was fifteen. I didn’t deserve it, and she gave it to me anyway.', 'soft'),
      EMBER('Her name was Ash. Fast. Brave. Every single morning she ran at the gate, full tilt, and bounced off it.'),
      EMBER('I wanted to win. Corvin said he could make her a champion, the best racer of all, in a month. So I let him take her.', 'sad'),
      EMBER('She came back grey. She won every race he entered her in. She never once looked at me again.'),
      N('Ember’s hands are in her pockets. You can see her fists through the cloth.'),
      EMBER('When he offered to keep her, I let him. I told myself she was happier running. That’s the part I can’t get the taste out of.', 'sad'),
      EMBER('Go and race. Win if you can. But watch how he talks to the ones who lose.', 'angry'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading a character’s feelings from their body',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 11,
        prompt: [N('Look at Ember’s hands, hidden in her pockets. What do you think she is feeling?')],
        options: [
          {
            label: 'Angry and sad, and trying to hold it in.',
            best: true,
            reply: [
              N('Yes. Fists often mean anger. Hiding them away means she’s trying to keep it in.'),
              N('Bodies often tell us what words don’t. Good readers watch for it.'),
            ],
          },
          {
            label: 'Bored.',
            reply: [
              N('Bored hands are usually loose and floppy. Ember’s are squeezed tight.'),
              N('Tight fists, hidden away, usually mean a strong feeling someone is holding in, like anger or sadness.'),
            ],
          },
          {
            label: 'Happy to see you.',
            reply: [
              N('Maybe a tiny bit, deep down! But tight fists usually mean a big feeling being squeezed in.'),
              N('Here it’s anger and sadness about Ash. Bodies often tell us what words don’t.'),
            ],
          },
        ],
        parentNote: 'Your child used a character’s body language (hidden fists) to work out a feeling the character doesn’t say aloud.',
      },
      {
        domain: 'sel',
        skill: 'thinking about responsibility when more than one person is part of a wrong',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 12,
        prompt: [
          N('That heavy, sour feeling of wishing you hadn’t done something is called regret. Ember carries a lot of it.'),
          N('Here’s one to think about. There’s no wrong answer. Was what happened to Ash Ember’s fault?'),
        ],
        options: [
          {
            label: 'Yes. She let him take Ash.',
            reply: [
              N('That’s a fair answer. Ember thinks so too. She made a choice, and she carries it.'),
              N('Saying “I did that” out loud is hard. Ember is brave enough to do it.'),
            ],
          },
          {
            label: 'No. Corvin made Ash grey.',
            reply: [
              N('That’s a fair answer. Ember was fifteen, and she trusted a grown-up who knew more than she did.'),
              N('Corvin is the one who chose how to train Ash.'),
            ],
          },
          {
            label: 'A bit of both.',
            reply: [
              N('That’s a fair answer, and a thoughtful one. Ember made a choice. Corvin made a worse one.'),
              N('Sometimes more than one person is part of a wrong thing, in different sizes.'),
            ],
          },
        ],
        parentNote: 'A think question with no single right answer: your child weighed how responsibility is shared when a young person trusts the wrong adult.',
      },
    ],
    [
      {
        id: 'sorry',
        label: 'I’m sorry about Ash.',
        friendship: { ember: 1 },
        then: [
          EMBER('Don’t. Everyone’s sorry. Sorry doesn’t do anything.'),
          EMBER('…Fine. I’ll come. Someone has to stop you looking at him like he’s normal.'),
        ],
      },
      {
        id: 'come',
        label: 'Come with me.',
        friendship: { ember: 3 },
        then: [
          EMBER('I wasn’t going to.', 'think'),
          N('She looks at the road up the valley for a long time.'),
          EMBER('…I’ll walk. I won’t talk. Don’t make me talk.'),
        ],
      },
      {
        id: 'sit',
        label: 'Say nothing. Sit down on the step.',
        friendship: { ember: 2 },
        then: [
          N('You sit on the step by the gate. After a while, stiffly, as if it costs her, Ember sits too.'),
          EMBER('Hazel used to do that. Exactly that. It’s very annoying.', 'soft'),
          EMBER('Come on, then. I’ll show you the road.'),
        ],
      },
    ],
  ),
  scene(
    'c5-circuit',
    [
      N('The road climbs to the Circuit: square, clean and silent. White rails, raked sand, not one weed.'),
      N('It’s the hottest day of the summer. And the railings are furred with frost.'),
      SPARKS('Feel that! No, go on, put your hand on it. It’s AUGUST!', 'shock'),
      SPARKS('Eleven years I’ve raced here. The rails are always cold. I asked him once. He said it was the shade.'),
      N('There is no shade. There isn’t a tree for half a mile.'),
      N('Corvin’s runners wait at the start line. Grey, every one. Not touching. Your Nubbin presses against your leg.'),
      BYTE('His runners have a start variance of zero. They all start at exactly the same instant. Every time.', 'think'),
      BYTE('Nothing alive has a variance of zero. I thought my stopwatch was broken, so I bought another one.'),
      SPARKS('He’s got three now.'),
      BYTE('Four. One is for timing the others.'),
      N('Corvin comes down the rail, touching his breast pocket the way some people touch a ring. His knuckles are blue.'),
      CORVIN('Hazel’s heir. You came. And Ember. Your breath is smoking, I see. Cold, is it? I hadn’t noticed. I don’t, any more.', 'think'),
      EMBER('Where’s Ash?', 'angry'),
      CORVIN('Lane four. She’s safe.'),
      EMBER('That isn’t what I asked.'),
      CORVIN('One question, since you’re her heir. What matters in a race? That they win, or that they want to?', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'why summer is warm: the tilt of the Earth',
        standard: '1-ESS1-2',
        kind: 'ask',
        after: 2,
        prompt: [
          SPARKS('For frost, things have to get down to 0°C (32°F). On the hottest day of summer!'),
          SPARKS('Why is summer warm in the first place? Go on. Pixel always asks me and I always panic.'),
        ],
        options: [
          {
            label: 'In summer our half of the Earth leans towards the Sun.',
            best: true,
            reply: [
              SPARKS('YES! The Earth spins on a tilted axis, like a spinning top leaning over.', 'happy'),
              SPARKS('In summer our half leans towards the Sun. The light hits us more directly, for longer. Long, warm days. No frost!'),
            ],
          },
          {
            label: 'In summer the Sun is closer to the Earth.',
            reply: [
              SPARKS('Loads of people think that! I did. But the Earth is actually closest to the Sun in early January.'),
              SPARKS('It’s the tilt. In summer our half of the Earth leans towards the Sun, so we get long days and strong sunshine.'),
            ],
          },
          {
            label: 'Frost can happen on any day of the year.',
            reply: [
              SPARKS('Not on the hottest day of summer, down in a valley like this!'),
              SPARKS('In summer our half of the Earth leans towards the Sun. Long, strong sunshine keeps everything well above freezing.'),
            ],
          },
        ],
        parentNote: 'Your child explained why summer is warm (the Earth’s tilt, not its distance from the Sun) and why summer frost is a clue that something is wrong.',
      },
      {
        domain: 'maths',
        skill: 'speed as distance divided by time',
        standard: '4.MD.A.2',
        kind: 'ask',
        after: 9,
        prompt: [
          BYTE('Since we’re timing things. The home straight is 100 metres. Sparks’s fastest runs it in 20 seconds.', 'think'),
          BYTE('How many metres is that, every second?'),
        ],
        options: [
          {
            label: '5 metres every second',
            best: true,
            reply: [
              BYTE('Five. 100 divided by 20 is 5. That’s speed: how far you go in each second.', 'happy'),
              BYTE('Five metres a second. Write that on your hand. I have.'),
            ],
          },
          {
            label: '80 metres every second',
            reply: [
              BYTE('That’s 100 take away 20. Good thinking, wrong sum!'),
              BYTE('For speed, share the distance out over the seconds: 100 ÷ 20 = 5 metres every second.'),
            ],
          },
          {
            label: '120 metres every second',
            reply: [
              BYTE('That’s 100 add 20. That would be the fastest Nubbin in history.'),
              BYTE('For speed, share the distance out over the seconds: 100 ÷ 20 = 5 metres every second.'),
            ],
          },
        ],
        parentNote: 'Your child worked out speed from distance and time (100 metres in 20 seconds is 5 metres per second).',
      },
    ],
    [
      {
        id: 'race-want',
        label: 'That they want to.',
        friendship: { sparks: 2 },
        then: [
          CORVIN('Hazel’s answer. Word for word. It loses, mostly.'),
          SPARKS('It does NOT lose mostly. It loses SOMETIMES.', 'angry'),
          CORVIN('We’ll see.'),
        ],
      },
      {
        id: 'race-win',
        label: 'That they win. It’s a race.',
        then: [
          CORVIN('Honest. Good. You’ll do well up here.'),
          N('Ember says nothing for a moment. Then, quietly, to the frozen rail:'),
          EMBER('That’s what I said. At fifteen.', 'soft'),
          N('She doesn’t say it unkindly. She says it like someone who wishes somebody had argued with her.'),
        ],
      },
      {
        id: 'race-home',
        label: 'That they come home afterwards.',
        friendship: { ember: 2 },
        then: [
          CORVIN('…That isn’t an answer.', 'think'),
          EMBER('It’s the only one.', 'soft'),
          N('Corvin touches his breast pocket, and walks off down the white rail without another word.'),
        ],
      },
    ],
  ),
  scene(
    'c5-considered',
    [
      N('At the start line, Corvin finds you again. He doesn’t look at Ember. Ember doesn’t look at anything else.'),
      CORVIN('Still turning it over? Good. Take as long as you like. My offer doesn’t go stale.'),
      N('He rests one hand on the rail while he talks. A thin white bloom of frost creeps out from under his fingers.'),
      N('Your Nubbin looks up at him. Then up at you. Then, very carefully, at nothing at all.'),
      EMBER('He gave me time to think, too, once.', 'soft'),
      N('Down the track, a whistle blows. Runners to the line.'),
    ],
    [
      {
        domain: 'science',
        skill: 'frost forms on surfaces at 0 °C (32 °F) or colder',
        standard: '2-PS1-4',
        kind: 'notice',
        after: 2,
        lines: [
          N('Frost only forms on a surface at 0 °C (32 °F) or colder. Water vapour in the air touches it and freezes straight into tiny ice crystals.'),
          N('On an August afternoon a rail in the sun should be warm. So the cold isn’t coming from the weather. It’s coming from his hand.'),
        ],
        parentNote: 'Your child learned that frost forms when water vapour freezes onto a surface at or below 0 °C (32 °F), and used it as a clue that the cold comes from Corvin.',
      },
      {
        domain: 'sel',
        skill: 'reading how someone feels from what they do',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 3,
        prompt: [N('Your Nubbin looks at Corvin, then at you, then very carefully at nothing. What do you think it is feeling?')],
        options: [
          {
            label: 'Worried. It heard you say you’d think about selling it.',
            best: true,
            reply: [
              N('That’s how it looks. When a feeling is too big to face, people and animals sometimes look away from it.'),
              N('Your Nubbin is listening to every word. Whatever you decide, it will remember how this felt.'),
            ],
          },
          {
            label: 'Bored. It just wants the race to start.',
            reply: [
              N('A bored Nubbin would be fidgeting and peering down the track. This one is very still, and very careful.'),
              N('It heard you say you’d think about selling it. Looking at nothing is how it hides how worried it is.'),
            ],
          },
          {
            label: 'It likes Corvin.',
            reply: [
              N('It looked at him, but then it looked away, very carefully. That isn’t how you look at someone you like.'),
              N('It heard you say you’d think about selling it. It’s worried, and trying not to show it.'),
            ],
          },
        ],
        parentNote: 'Your child read a pet’s small actions (looking away, keeping still) as worry, and thought about how our words land on those who depend on us.',
      },
    ],
  ),
  scene(
    'c5-close',
    [
      N('You cross the line first! Your Nubbin keeps running for three more steps, out of pure joy, and has to be fetched.'),
      SPARKS('THAT’S MY— no, that’s yours. That’s YOURS. I’m just very loud about it.', 'happy'),
      N('At the rail, Byte stops all four stopwatches and stares at them.'),
      BYTE('Yours started late. Nearly half a second. It was looking at a butterfly.', 'think'),
      BYTE('Variance. Lovely, lovely variance.', 'happy'),
      CORVIN('Hazel’s heir wins. Of course. She always said the trick was to make them want to run for you.'),
      CORVIN('Sentimental. All feelings. But it works, I’ll give you that. Mine run because the alternative is worse.'),
      N('He doesn’t say it cruelly. He says it like someone reading out the weather.'),
      CORVIN('Mine are faster. Steadier. Not one of them has ever been hurt on this track. Can you say that?'),
      N('Behind him the grey runners stand perfectly still in their line. Frost glitters on the rail.'),
      EMBER('Ash. Ash, it’s me.', 'sad'),
      N('One of the grey ones turns her head, very slightly… and then turns it back.'),
      CORVIN('You see? Discipline. They do as they’re trained. Come to my garden some time. I’ll show you how it’s done.'),
      N('On the road home Ember says nothing for two miles. Then, to nobody at all:'),
      EMBER('She turned her head, though.', 'soft'),
      N('The stream by the road is lower than in spring. At home, a white line of frost on your sleeve takes all evening to melt.'),
    ],
    [
      {
        domain: 'science',
        skill: 'moving things keep moving until a force stops them',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 0,
        lines: [
          SPARKS('Ha! See that? Once you’re really going, it’s hard to stop. Moving things keep moving until a force slows them.', 'happy'),
          SPARKS('Feet skidding in the sand. A bump. A Keeper scooping you up. Today, you were the force!'),
        ],
        parentNote: 'Your child heard that a moving object keeps moving until a force (friction, a push, a catch) changes its motion.',
      },
      {
        domain: 'maths',
        skill: 'reading a results table and finding the difference between two times',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 4,
        prompt: [
          BYTE('Here’s the results board. Lane 1, Sparks’s runner: 34 seconds. Lane 2, yours: 31 seconds.'),
          BYTE('Lane 4, Ash: 32 seconds. Lane 5, a grey runner: 33 seconds. The smallest time wins.'),
          BYTE('Yours won, even starting late. How many seconds ahead of Ash was it?'),
        ],
        options: [
          {
            label: '1 second',
            best: true,
            reply: [
              BYTE('One second. 32 take away 31 is 1. In a race, that’s a lot. About one butterfly’s worth.', 'happy'),
            ],
          },
          {
            label: '3 seconds',
            reply: [
              BYTE('That’s the gap to Sparks’s runner: 34 − 31 = 3. Close!'),
              BYTE('Ash finished in 32 seconds, so the gap is 32 − 31 = 1 second.'),
            ],
          },
          {
            label: '63 seconds',
            reply: [
              BYTE('That’s 31 add 32! To find a gap between two times, we take away.'),
              BYTE('32 − 31 = 1. Yours was 1 second ahead of Ash.'),
            ],
          },
        ],
        parentNote: 'Your child read times from a results table, knew the smallest time wins, and subtracted to find the gap between two runners.',
      },
    ],
  ),
  scene(
    'c5-sold',
    [
      N('In the row of grey runners, third from the end, is one you know.'),
      N('It used to be yours. It has grown. It isn’t looking at you, or at anything.'),
      N('There is a number on its side in neat white paint, like the label on a jar.'),
      CORVIN('Yours runs well. I did tell you it would eat better with me.'),
      N('It does look well fed. That is all it looks.'),
      EMBER('You sold him one.', 'angry'),
      N('She doesn’t say anything else. She doesn’t need to.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading what a writer means between the lines',
        standard: 'RL.4.3',
        kind: 'ask',
        after: 4,
        prompt: [N('Read that line again: “It does look well fed. That is all it looks.”'), N('What is the writer telling you?')],
        options: [
          {
            label: 'It has plenty of food, but it doesn’t look happy or loved.',
            best: true,
            reply: [
              N('Yes. The little word “all” does the work. Food is only one of the things a creature needs.'),
              N('Choices can cost more than we can see at the time. It’s all right to feel bad about this one.'),
            ],
          },
          {
            label: 'It’s healthy, so everything is fine.',
            reply: [
              N('It is fed. But “that is ALL it looks” means it doesn’t look anything else: not happy, not curious, not loved.'),
              N('Food is only one of the things a creature needs.'),
            ],
          },
          {
            label: 'It’s hungry.',
            reply: [
              N('Not hungry: the line says it’s well fed. Look at the word “all”.'),
              N('It means food is the only good thing about it. Not happy, not curious, not loved.'),
            ],
          },
        ],
        parentNote: 'Your child noticed how one small word (“all”) changes a sentence’s meaning, and thought about what animals need beyond food.',
      },
    ],
  ),
];

// ---------------------------------------------------------------- chapter 6: Rain on the Hill

/** Fossil’s fading, shared by both chapter 6 openings (11 lines). Grief lesson plays after index 9 of this block. */
const C6_FADING: Line[] = [
  N('Fossil uncurls, very slowly, and climbs out of Dusty’s lap onto the grass. She wants to do this part herself.'),
  N('A cocoon closes round her, thin as a soap bubble. Rain runs down the outside of it.'),
  DUSTY('She’s done. Not reborn. Done. You can tell by the light. Rebirth glows. This just… thins.'),
  N('Dusty puts one muddy finger against the cocoon. Inside, very faintly, something taps back. Twice.'),
  DUSTY('Yes. All right. I know.', 'soft'),
  N('And then there is only rain. Where she was, a flower is pushing up through the wet grass.'),
  N(
    'Fossil has faded. That means she has died. Her body stopped working, and it won’t start again.',
  ),
  DUSTY(
    'Everyone says it means she was happy enough to let go. That’s true. It’s also the worst thing anyone’s ever said to me.',
    'sad',
  ),
  N('Dusty is cross because being told it’s fine doesn’t make the sad any smaller.'),
  N(
    'Dusty doesn’t cry. They just sit there in the rain, looking at the flower as if it might need something.',
  ),
  DUSTY('Would you sit with me a bit? You don’t have to say anything. Hazel never did.'),
];

/** The grief beat, shared by both openings. `after` is the index of “Dusty doesn’t cry” (index 9 of the block). */
const griefLesson = (after: number): LessonBody => ({
  domain: 'sel',
  skill: 'grief looks different on everyone',
  standard: 'CASEL: Social awareness',
  kind: 'ask',
  after,
  prompt: [N('Dusty isn’t crying. Does that mean they aren’t sad?')],
  options: [
    {
      label: 'No. People show sadness in different ways.',
      best: true,
      reply: [
        N('Yes. Some people cry. Some go very quiet. Some go and dig something up. All of them are sad.'),
        N('Every one of those ways is all right. What helps most is often simple: someone sitting with you.'),
      ],
    },
    {
      label: 'Yes. If you don’t cry, you’re not sad.',
      reply: [
        N('Lots of people think that. But sadness looks different on everyone.'),
        N('Dusty is very sad. Look how still they are, out in the rain. And look what they ask for: someone to sit with them.'),
      ],
    },
    {
      label: 'Maybe they’re just cold.',
      reply: [
        N('They are cold! But they’re very sad, too. Not everyone cries. Some people go quiet and still, like Dusty.'),
        N('What helps is often simple: someone sitting with you.'),
      ],
    },
  ],
  parentNote: 'After a character’s pet dies, your child learned that grief looks different on everyone, and that being with someone is a real way to help.',
});

const CH6: EduScene[] = [
  scene(
    'c6-open',
    [
      N('It rains for three days. On the third, Dusty is up on the hill in it, cross-legged in the wet, with no hat.'),
      N('In their lap is a small, old Nubbin the colour of sandstone, curled like a shell. Her glow is so pale the rain shows through.'),
      DUSTY('Oh. Hello. Don’t mind me. I’m getting wet on purpose. This is Fossil. Original name, I know.', 'soft'),
      DUSTY('I dug her egg out of the cliff when I was eleven, with a big spoon. Twenty years and a bit, now. I’ve been counting the bit.'),
      N('Fossil opens one eye, looks at you, and taps Dusty’s wrist twice with one small hand.'),
      DUSTY('That means you’re all right. She’s very fussy. She bit a postman once. Twice. Same postman.', 'happy'),
      ...C6_FADING,
    ],
    [
      {
        domain: 'science',
        skill: 'rock layers: the lowest layer is usually the oldest',
        standard: '4-ESS1-1',
        kind: 'ask',
        after: 3,
        prompt: [
          DUSTY('Cliffs are like a pile of paper. Each layer of rock was laid down on top of the one before.'),
          DUSTY('A fossil is what’s left of something that lived long ago, a shell or a bone or a footprint, turned to stone.'),
          DUSTY('So here’s the digger’s question. In a cliff, which layer is usually the oldest?'),
        ],
        options: [
          {
            label: 'The bottom layer.',
            best: true,
            reply: [
              DUSTY('Yes! The bottom layer was laid down first, so it’s the oldest. Like the first sheet in a pile of paper.', 'happy'),
              DUSTY('So the deeper you dig, the further back in time you go. That’s why I like spoons.'),
            ],
          },
          {
            label: 'The top layer.',
            reply: [
              DUSTY('That’s usually the newest, actually. Layers pile up like paper.'),
              DUSTY('The first one laid down ends up at the bottom. So the bottom is the oldest, and digging down is going back in time.'),
            ],
          },
          {
            label: 'The middle layer.',
            reply: [
              DUSTY('Good guess, but think of a pile of paper. The first sheet ends up at the bottom.'),
              DUSTY('Same with rock. The bottom layer is usually the oldest.'),
            ],
          },
        ],
        parentNote: 'Your child learned what a fossil is and that rock layers build up over time, so lower layers are usually older.',
      },
      griefLesson(6 + 9),
    ],
  ),
  scene(
    'c6-open-walked',
    [
      N('It rains for three days. On the third, Dusty is up on the hill in it, with Fossil in their lap under their coat.'),
      DUSTY('You came. Good. She’s been watching the gate for you all morning.', 'soft'),
      DUSTY('Thank you for the walk. The cliff, and the tree, and the water. I mean it. I don’t say thank you much. Ask anyone.'),
      DUSTY('And she tapped the rock when I told its story wrong. Twenty years, and she still had to have the last word.', 'happy'),
      N('Your youngest Nubbin comes up the wet slope as fast as its legs allow. It sits down beside Fossil, very close, and stays.'),
      DUSTY('She did everything on her list. I thought that would make this easier. It doesn’t. It makes it better. That’s different.', 'soft'),
      ...C6_FADING,
    ],
    [
      {
        domain: 'science',
        skill: 'putting rock layers in order from oldest to newest',
        standard: '4-ESS1-1',
        kind: 'do',
        after: 3,
        check: 'edu:order:rock-layers:oldest-first',
        lines: [
          DUSTY('That cliff is a stack of rock layers, like pages in a book. Each one was laid down on top of the last.'),
          DUSTY('Help me tell its story right this time. Tap the layers from oldest to newest. Start where the story starts.'),
          DUSTY('Hint: layers pile up like paper. The first one down ends up at the bottom.'),
        ],
        parentNote: 'Your child ordered rock layers from oldest (bottom) to newest (top), the way scientists read the past in cliffs.',
      },
      griefLesson(6 + 9),
    ],
  ),
  scene(
    'c6-close',
    [
      N('You sit with Dusty on the wet hill, by the flower. Neither of you says anything.'),
      N('It rains, and then it rains less, and then it is only the trees dripping. Somehow it’s the best part.'),
      DUSTY('Thank you. Right. I’m going to go and dig something up. That’s what I do when I feel like this. It usually works.', 'soft'),
      DUSTY('Yours will go one day. All of them. Love them anyway. Love them harder because of it. That’s the whole trade, and it’s a good one.'),
      N('Halfway down the hill, Dusty stops, looks back at the flower, and lifts one muddy hand to it.'),
      N('When you turn round, Moss is sitting by the flower. You didn’t see him come. The rain runs off him in silver threads.'),
      MOSS('Briar’s was the first memorial flower on this hill. A flower to remember her by. She went up laughing.', 'soft'),
      MOSS('This one went up in somebody’s lap, with the rain on her. I think that is better. Briar would argue.'),
      MOSS('That is fading done right. Not stilled. Let go.'),
      MOSS('There are people who would rather a thing were still than gone. You have met one, up the valley.', 'think'),
      MOSS('They call it keeping. It is not keeping. Keeping is this. Sitting in the rain by what you could not hold.'),
      N('Down the hill, Dusty has nearly reached the gate.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'thinking about a story’s big idea (theme)',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 3,
        prompt: [
          N('Dusty calls loving something that won’t last forever “a good trade”. A trade is when you give one thing to get another.'),
          N('What do you think? There’s no wrong answer.'),
        ],
        options: [
          {
            label: 'Yes. The love is worth the sadness.',
            reply: [N('That’s a fair answer. Dusty would say twenty years of Fossil was worth every drop of this rain.')],
          },
          {
            label: 'No. It hurts too much.',
            reply: [
              N('That’s a fair answer, and an honest one. It does hurt.'),
              N('Dusty might say the hurt is this big because the love was this big. They come as a pair.'),
            ],
          },
          {
            label: 'I’m not sure.',
            reply: [N('That’s a fair answer too. Grown-ups wonder about this one their whole lives. Keep thinking about it.')],
          },
        ],
        parentNote: 'A think question with no single right answer: your child reflected on a theme of the story, that love is worth the sadness of loss.',
      },
      {
        domain: 'science',
        skill: 'life cycles: living things are born, grow, may have young, and die',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 8,
        lines: [
          MOSS('Everything that lives goes round the same wheel. It begins. It grows. Many have young of their own. And one day, it dies.'),
          MOSS('A mouse goes round its wheel in a year or two. Some tortoises take more than a hundred years. Oaks take longer still.'),
          MOSS('Fossil went all the way round. Twenty years and a bit. That is a whole life, and a good one.', 'soft'),
        ],
        parentNote: 'Your child heard that every living thing has a life cycle (beginning, growing, often having young, dying), and that lifespans differ a lot.',
      },
    ],
    [
      {
        id: 'tell',
        label: 'Call after Dusty, and tell them what Moss said.',
        friendship: { dusty: 2 },
        then: [
          N('You call down the hill. Dusty stops with their hand on the gate and listens to every word without moving.'),
          DUSTY('…Tell him thank you.', 'soft'),
          DUSTY('And tell him he’s got grass on his head.'),
          MOSS('I am aware of the grass.'),
          N('Moss does not move from the flower until it is dark.'),
        ],
      },
      {
        id: 'keep',
        label: 'Keep it to yourself. Some things belong to the hill.',
        then: [
          N('You don’t call after them. Dusty lifts and pushes the gate, and is gone.'),
          N('You stay. Moss stays. The flower has never been rained on before. It seems to be getting used to it.'),
          N('Moss does not move from the flower until it is dark.'),
        ],
      },
    ],
  ),
];

// ---------------------------------------------------------------- chapter 7: What Fear Teaches

const CH7: EduScene[] = [
  scene(
    'c7-open',
    [
      N(
        'Sable sleeps near you now. Not next to you. Near. Whenever you move in your sleep, she wakes.',
      ),
      N('You wake before dawn because you are cold. The Grove is white.'),
      N(
        'Not all of it. The frost lies in a long tongue, a long thin strip, from the long grass to the fourth lantern post.',
      ),
      N(
        'Round that post it’s as thick as fur. The other three posts stand damp and dark and ordinary.',
      ),
      N(
        'Your breath puffs out in little clouds. The frost squeaks under your bare feet, so you go back in for socks.',
      ),
      N(
        'Sable is awake. She is staring at the post, and she isn’t moving at all. Not even her ears.',
      ),
      LUNA('You’re up. Good. I didn’t want to wake you, and I didn’t want to wait.'),
      N(
        'Luna has soil to her elbows. She’s nocturnal, awake at night like an owl, so for her this is the end of the day.',
      ),
      LUNA(
        'It isn’t cold enough for that frost. I’ve had my hands in the ground all night. It isn’t cold enough for gloves.',
        'think',
      ),
      LUNA(
        'I went up the valley last week, at night. I found out where Sable came from. Corvin’s garden.',
      ),
      LUNA(
        'He trains them with cold and with hunger. Food when they obey. Nothing when they don’t. It works. It’s fast.',
        'angry',
      ),
      LUNA(
        'There’s an empty pen at the end of the last row. A bowl in it, frozen to the floor. In summer.',
      ),
      LUNA(
        'Sable wouldn’t race. So she got nothing, for a long time. And then one night the gate was open.',
      ),
      LUNA(
        'Her first nights here, the grass was white where she slept. I put it down to her being odd. It was never just her, was it.',
        'sad',
      ),
      LUNA(
        'She chose you, you know. She watched this Grove for three nights and decided your hands looked slow enough.',
        'soft',
      ),
      LUNA('I need to sleep. Moss is coming down. I can’t hear him. You can. Listen properly.'),
    ],
    [
      {
        domain: 'science',
        skill: 'condensation: why warm breath makes a cloud in cold air',
        standard: '2-PS1-4',
        kind: 'ask',
        after: 4,
        prompt: [N('Why does your breath make a little cloud on a cold morning?')],
        options: [
          {
            label: 'Warm breath has water in it. Cold air cools it into tiny drops.',
            best: true,
            reply: [
              N(
                'Yes. Your breath carries water as an invisible gas, called water vapour. Cold air cools it into tiny drops you can see.',
              ),
              N('That’s a mini cloud! Real clouds form the same way.'),
            ],
          },
          {
            label: 'It’s smoke from inside you.',
            reply: [
              N('No fire in there, luckily! Your breath carries water as an invisible gas.'),
              N('Cold air cools it into tiny drops of water you can see. It’s a mini cloud.'),
            ],
          },
          {
            label: 'Cold air is white.',
            reply: [
              N('Cold air is just as clear as warm air. The white is water.'),
              N(
                'Your warm breath carries water as an invisible gas. Cold air cools it into tiny drops you can see: a mini cloud.',
              ),
            ],
          },
        ],
        parentNote:
          'Your child explained why breath fogs in the cold: water vapour cools into tiny droplets (condensation), a change that reverses when warmed.',
      },
      {
        domain: 'literacy',
        skill: 'making an inference from clues in the story',
        kind: 'ask',
        after: 11,
        prompt: [
          LUNA(
            'A bowl, frozen to the floor. In summer. And you said the rails at the Circuit were frosty in August.',
            'think',
          ),
          LUNA('Put those clues together for me. What do they tell you?'),
        ],
        options: [
          {
            label: 'Something near Corvin is making cold that shouldn’t be there.',
            best: true,
            reply: [
              LUNA(
                'That’s what I think. Frost in summer, twice, both near Corvin. That isn’t weather. That’s something else.',
              ),
              N(
                'Putting clues together to work out something nobody has told you is called making an inference.',
              ),
            ],
          },
          {
            label: 'It was a very cold summer.',
            reply: [
              LUNA(
                'It’s been a hot one. Remember the hottest day of summer, and the frost on the rails?',
              ),
              LUNA(
                'Two lots of summer frost, both near Corvin. Something there is making the cold.',
              ),
            ],
          },
          {
            label: 'Sable spilled her water.',
            reply: [
              LUNA(
                'Spilled water would just dry up in summer. For it to freeze, something must be very cold.',
              ),
              LUNA(
                'And the rails were frosty too. Both near Corvin. Something there is making the cold.',
              ),
            ],
          },
        ],
        parentNote:
          'Your child combined two clues from different chapters (summer frost at the Circuit and in Corvin’s garden) to make an inference.',
      },
    ],
  ),
  scene(
    'c7-stillness',
    [
      N('Moss comes down the hill through the white grass. He leaves no footprints at all. He is very light, these days.'),
      N('He stops at the fourth post and looks at the frost on it for a long time.'),
      MOSS('Cold goes back to where it was kept. It is looking for its bed.', 'think'),
      MOSS('There is nothing under this post. There has not been for a long time. You guessed that, I think, when the lantern went out.'),
      N('You remember Lantern Night: the flicker, then the dark. And Moss saying, “Twenty-two years.”'),
      MOSS('Sit. This is a long one. I am slow, and you have a habit of standing.'),
      N('You sit on the frozen ground. After a while Sable sits too, two steps away, with her back to the post.'),
      MOSS('On Lantern Night I told you how Cinder made a stone, and how they came out of the White Year alive, but grey and still.'),
      MOSS('I told it to you as a story. Stories are kind; they stop. Now I will tell you what it is like.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'personification: talking about a thing as if it were alive',
        standard: 'L.4.5',
        kind: 'ask',
        after: 2,
        prompt: [N('Cold doesn’t really sleep in a bed. Moss is talking about it as if it were alive. What does he mean?')],
        options: [
          {
            label: 'The cold is coming back to where something cold used to be kept.',
            best: true,
            reply: [
              N('Yes. Something very cold was once hidden under this post, and the frost is gathering where it was.'),
              N('Talking about a thing as if it were alive, with wants and a bed, is called personification. It makes ideas easy to feel.'),
            ],
          },
          {
            label: 'The cold is sleepy.',
            reply: [
              N('Ha! Cold can’t get sleepy. Moss is talking about it as if it were alive. That’s called personification.'),
              N('He means the frost is gathering where something very cold used to be hidden: under this post.'),
            ],
          },
          {
            label: 'Somebody put a bed under the post.',
            reply: [
              N('A bed under a lantern post would be very uncomfortable! Moss isn’t being exact. He’s using personification.'),
              N('He means the frost is gathering where something very cold used to be hidden: under this post.'),
            ],
          },
        ],
        parentNote: 'Your child worked out the meaning of personification (cold “looking for its bed”) and learned the word for it.',
      },
      {
        domain: 'science',
        skill: 'heat moves from warmer things to colder things',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 6,
        lines: [
          MOSS('You feel the cold because your warmth is running out of you, into the ground.'),
          MOSS('Heat always moves from the warmer thing to the colder thing. The cold is not creeping into you. Your heat is leaving you.'),
          MOSS('Sit on a coat next time. A coat is slow to let heat through. Hazel always sat on a coat.'),
        ],
        parentNote: 'Your child heard that heat flows from warmer to colder things, which is why cold ground feels cold, and that some materials slow heat down.',
      },
    ],
    [
      {
        id: 'grey',
        label: 'Why are they grey?',
        then: [
          MOSS('Grey is not the cold. Grey is what the cold leaves behind. It is a scar, not a wound.'),
          MOSS('The cold says one thing, over and over. A Nubbin who hears it long enough can’t hear anything else.'),
          N('A crow goes over. Sable flinches. Then, slowly, she remembers she doesn’t have to.'),
          MOSS('The colour goes first. Then the wanting. The wanting is the part that matters.', 'sad'),
        ],
      },
      {
        id: 'hurt',
        label: 'Does it hurt them?',
        then: [
          MOSS('Not the way you mean. That is the worst of it.', 'sad'),
          MOSS('Hunger hurts. Cold hurts. The Stillness does not. It is the end of hurting, and of everything that sits beside hurting.'),
          N('He looks at you sideways, the way old people check whether you have understood or only nodded.'),
          MOSS('Joy sits beside hurting. So does wanting your dinner. So does running at a gate every morning and bouncing off.'),
        ],
      },
      {
        id: 'sable',
        label: 'Is that what happened to Sable?',
        then: [
          MOSS('Some of it. Hunger did most of the work. But that garden is cold all year round, and the cold helped.'),
          MOSS('I can still smell it on her, the way you smell smoke on a coat long after the fire.'),
          N('Sable turns one ear towards him at the sound of her name. Only one. It’s more than she gave anyone at midsummer.'),
          MOSS('She ran from it, though. Remember that. Something in her kept wanting, all the way down.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    'c7-stillness-2',
    [
      MOSS(
        'A shard does not shout. It is not a monster. If it were a monster, it would be easy. You would only have to be brave.',
      ),
      MOSS(
        'A shard is a sharp broken piece, and this one says one word. It says it to whoever is most afraid. It thinks it is being kind.',
      ),
      N(
        'He waits so long that a hen over the wall decides he has finished, and says so at length.',
      ),
      N('Moss waits for the hen as well. Then:'),
      MOSS('Safe.'),
      N('The word hangs in the cold air between you. Sable’s ears go flat against her head.'),
      MOSS('Think what you would give to know nothing would ever hurt them. No hawk. No fever. No hill.'),
      MOSS('Think what you would give to know nothing could ever hurt you through them.'),
      N('You think of Fossil in the rain. You think of Dusty’s muddy hand, lifted to a flower.'),
      MOSS('That is what it offers. And it keeps its word. That is the terrible thing about it. It always keeps its word.', 'sad'),
    ],
    [
      {
        domain: 'science',
        skill: 'reading fear in an animal’s body language',
        kind: 'notice',
        after: 5,
        lines: [
          MOSS('Look at her ears. Many animals flatten their ears when they are frightened. Cats do. Rabbits do. Dogs often do.'),
          MOSS('She cannot tell you she is scared. Her ears are telling you for her. Always listen to the ears.', 'soft'),
        ],
        parentNote: 'Your child learned that many animals (cats, rabbits, dogs) flatten their ears when afraid, and that animals show feelings with their bodies.',
      },
      {
        domain: 'sel',
        skill: 'what helps when you are afraid for someone you love',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 9,
        prompt: [
          MOSS('So. When you are very afraid for someone you love, what helps most?', 'think'),
        ],
        options: [
          {
            label: 'Telling someone I trust, so I’m not alone with it.',
            best: true,
            reply: [
              MOSS('Yes. Fear grows in the dark and shrinks when it is shared.', 'soft'),
              MOSS('That is the one thing the stone never tells you.'),
            ],
          },
          {
            label: 'Keeping them shut away, so nothing can happen.',
            reply: [
              MOSS('That is the stone’s answer. It sounds kind. But a thing shut away cannot really live.'),
              MOSS('Tell someone you trust instead. Let them help you carry the fear. It shrinks when it is shared.'),
            ],
          },
          {
            label: 'Pretending I’m not scared.',
            reply: [
              MOSS('Many people try that. I did, for about a century. Hidden fear doesn’t go away. It just gets lonely.'),
              MOSS('Tell someone you trust. Fear shrinks when it is shared.'),
            ],
          },
        ],
        parentNote: 'Your child thought about healthy ways to handle worry for someone they love: sharing it with a trusted person rather than hiding it or trying to control everything.',
      },
    ],
    [
      {
        id: 'cinder',
        label: 'Did Cinder hear it?',
        then: [
          MOSS('She heard it first. She made it, out of the spring’s cold and her own fear, and it spoke to her in her own voice.'),
          MOSS('She loved them more than any of us. That is why it found her so easily. It looks for the ones who love hardest.', 'sad'),
          N('Over the wall, Fern is humming a skipping rhyme to her hens. You can’t quite make out the words.'),
          MOSS('You know the valley’s word for a love that holds too tight. She would have known it was fair.'),
        ],
      },
      {
        id: 'who',
        label: 'Who would ever listen to that?',
        then: [
          MOSS('Anyone who has loved something and watched it nearly die.'),
          MOSS('So: anyone worth knowing.', 'soft'),
          N('He shifts on the frozen grass. It takes him a while.'),
          MOSS('Do not think the ones who listen are wicked. Most of them are only frightened, and very tired, and alone with it.'),
        ],
      },
      {
        id: 'me',
        label: 'Could I hear it?',
        then: [
          MOSS('Yes.'),
          MOSS('You love them already. That is the door it uses. I would be lying if I told you that you were safe from it.'),
          MOSS('…Safe. Hm. There it is again. You see how it gets into everything.', 'think'),
          MOSS('I am too old to start lying to you. I am also too old to let you go near it alone. Remember both.'),
        ],
      },
    ],
  ),
  scene(
    'c7-stillness-3',
    [
      MOSS('Hazel had a word for the opposite. She did not use it much. She was not a woman for words; she was a woman for soup.'),
      MOSS('She said “well”.'),
      N(
        'The sun reaches the top of the western hill. The frost on the nearest grass begins, very slightly, to steam.',
      ),
      MOSS(
        'A Nubbin that is well can be hurt. It runs off. It eats a beetle. It falls in love with a stick and will not let go of it.',
      ),
      N(
        'Your Nubbin, who has been listening, goes and fetches a stick. It lays it at Moss’s feet.',
      ),
      MOSS('Yes. Thank you. Exactly that.', 'soft'),
      MOSS('It gets lost in the long grass. It comes back. One day it goes up the hill.'),
      MOSS('A Nubbin that is safe cannot be hurt. And it cannot do any of the rest.'),
      N('…'),
      MOSS('Safe is not the same as well.'),
      N('Moss looks at Sable. Sable is looking at the frost. Then, for a moment, at you.'),
      MOSS('The grey stays. Clover told you that, and she was right. But the grey is not the Stillness. It is where the Stillness was.'),
      MOSS('A scar can be touched. A scar can be leaned on. You will see.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'the Sun rises in the east',
        standard: '1-ESS1-1',
        kind: 'ask',
        after: 2,
        prompt: [N('The first sunlight is touching the western hill. Which direction does the Sun rise in?')],
        options: [
          {
            label: 'East',
            best: true,
            reply: [
              N('Yes, roughly east. The western hill faces east across the valley, and its top is high, so it catches the first light.'),
              N('Sunlight warms the frost, and the frost begins to melt and steam.'),
            ],
          },
          {
            label: 'West',
            reply: [
              N('The Sun sets in the west. It rises roughly in the east.'),
              N('So the hill on the west side of the valley, facing east, is the first to catch the morning light.'),
            ],
          },
          {
            label: 'It changes every day.',
            reply: [
              N('It does shift a little through the year. But it always rises roughly in the east.'),
              N('So the hill on the west side, facing east, catches the first light.'),
            ],
          },
        ],
        parentNote: 'Your child recalled that the Sun rises in the east and used it to explain which hillside catches the morning light first.',
      },
      {
        domain: 'sel',
        skill: 'a think question: is safe the same as well?',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 9,
        prompt: [MOSS('I have told you what I think. Now you. Is safe the same as well?', 'think')],
        options: [
          {
            label: 'No. Being well means you can get hurt sometimes.',
            reply: [MOSS('That’s a fair answer. It is mine too. A life with no hurt in it has no running in it either.', 'soft')],
          },
          {
            label: 'Safe is better. Then nobody gets hurt.',
            reply: [
              MOSS('That’s a fair answer. It is the stone’s answer too, which is why the stone is so strong.'),
              MOSS('Corvin would agree with you. Watch his runners, and see if you still do.'),
            ],
          },
          {
            label: 'You need a bit of both.',
            reply: [
              MOSS('That’s a fair answer, and a wise one.'),
              MOSS('Hazel fed them and watched for hawks, and then let them run wherever they liked. Both.', 'soft'),
            ],
          },
        ],
        parentNote: 'A think question with no single right answer: your child weighed protecting someone against letting them live freely.',
      },
    ],
    [
      {
        id: 'what',
        label: 'What do I do for her?',
        then: [
          MOSS('What Hazel did. Feed her before you feed yourself. Never, ever throw her. And when you don’t know what to do—'),
          YOU('—sit down next to her and wait.'),
          MOSS('Yes. You were listening. She will be pleased. Do not tell her I said so.', 'soft'),
        ],
      },
      {
        id: 'where',
        label: 'Where is the stone from this post?',
        then: [
          MOSS('That is not mine to say.', 'think'),
          MOSS('I made a promise to someone who is still alive, and I keep promises longer than I keep most things.'),
          MOSS('Hazel wrote everything down. She was always better at writing things than saying them. Find what she wrote.'),
        ],
      },
      {
        id: 'quiet',
        label: 'Say nothing. Stay sitting.',
        then: [
          N('You say nothing. The three of you sit by the empty post while the sunlight comes down the hill.'),
          MOSS('Good. You are learning faster than she did.', 'soft'),
          MOSS('I sat next to her for a whole winter before I said one word. She fidgeted from the first frost to the thaw.'),
        ],
      },
    ],
  ),
  scene('c7-close', [
    N('The frost comes most mornings now. It never spreads past the long grass, and round the fourth post it never quite goes.'),
    N('Then one afternoon, in daylight, in front of everyone, Sable walks up and leans her whole weight against your shin.'),
    N('She is heavier than she looks. You stand very still and let her be.'),
    CLOVER('Oh. Oh, look at her.', 'happy'),
    LUNA('Still grey. Always will be. And look at her anyway.', 'soft'),
    N('Sable says nothing. Her ears stay up.'),
    N('The dark ball above her head flickers, just for a moment, with something that might be a heart.'),
    BYTE('Statistically, a Shadow Nubbin starting contact—', 'think'),
    LUNA('Byte.'),
    BYTE('…Yes. All right. That was very nice. I’m writing it down as nice.'),
    CLOVER('Write it down twice. She slept on my blanket last night, you know. Don’t tell her I told you.', 'happy'),
    N('Pixel comes over the stile with a box. On the front: a dial, a needle, and one hand-painted word. MAYBE.'),
    PIXEL('Trust meter. For Sable. I built it last night.', 'happy'),
    BYTE('What does it measure?'),
    PIXEL('Mostly it says maybe. That’s accurate. Nothing about her is calibrated, set up to measure exactly.'),
    N('Sable glares at the box and leans harder on your shin. Up on the hill, Moss politely looks away.'),
  ], [
    {
      domain: 'science',
      skill: 'balanced forces: equal pushes mean nothing moves',
      standard: '3-PS2-1',
      kind: 'do',
      after: 2,
      check: 'edu:hold:still:sable-lean',
      lines: [
        N('Sable is pushing on your leg. Your leg is pushing back on her, just as hard.'),
        N('When two pushes are equal, they balance, and nothing moves. Hold still, and keep it balanced, for as long as she wants.'),
      ],
      parentNote: 'Your child held still while Sable leaned on them, and learned that equal, opposite pushes are balanced forces, so nothing moves.',
    },
    {
      domain: 'maths',
      skill: 'subtraction within 100: how much something has grown',
      standard: '2.OA.A.1',
      kind: 'ask',
      after: 14,
      prompt: [
        PIXEL('Under the MAYBE there are numbers. Her trust was 20 when she first let you near. It’s 45 today.', 'think'),
        PIXEL('How much has it grown?'),
      ],
      options: [
        {
          label: '25',
          best: true,
          reply: [PIXEL('25! 45 take away 20 is 25. Or count on from 20: 30, 40, then 5 more. That’s 25.', 'happy')],
        },
        {
          label: '65',
          reply: [
            PIXEL('That’s 45 add 20. To see how much something grew, we take away the old number from the new one.'),
            PIXEL('45 − 20 = 25. Her trust grew by 25.'),
          ],
        },
        {
          label: '20',
          reply: [
            PIXEL('20 is where she started. To find how much it grew, take the start away from now.'),
            PIXEL('45 − 20 = 25. Count on from 20: 30, 40, 45. That’s 25.'),
          ],
        },
      ],
      parentNote: 'Your child subtracted (45 − 20) to find how much Sable’s trust grew, using counting on as a strategy.',
    },
  ]),
];

// ---------------------------------------------------------------- chapter 8: The Hollow

/** Fern’s bag and the walk to the falls, shared by both ledge scenes (5 lines). */
const C8_GATE: Line[] = [
  N('Fern catches you at the gate with a bag. Inside: fruit, a jumper, a whistle, a second jumper, and a note. SORRY ABOUT THE JUMPERS.'),
  FERN('It’s cold where you’re going. Everyone says so. I don’t know anything else useful, so: jumpers.', 'think'),
  N('Sable comes with you as far as the gate, and stops, and sits. This is as far as she goes. She will be here.'),
  N('Marina is waiting at the pool below the falls, sleeves rolled up, hair already wet.'),
  MARINA('Nova said you’d be coming this way. Nova never says anything, so I listened.'),
];

/** The ledge and the first sight of the Wellspring, shared (5 lines). The geothermal lesson plays after index 3. */
const C8_LEDGE_REST: Line[] = [
  N('The ledge is a hand’s width wide, a narrow shelf of rock behind the falling water. The roar fills your head.'),
  N('Then, halfway along, warmth. It comes up through the stone into your hand, like the side of a teapot.'),
  N('Through a crack in the rock: a cave of glittering stone, and a pool, steaming gently, lit from underneath by nothing at all.'),
  MARINA('The Wellspring. The first Nubbins came up out of that, each one a little light. The water never freezes. Only its rim did, once, in the White Year.', 'soft'),
  N('But round the rim of the warm water, where nothing should be cold, runs a thin white line of frost.'),
];

/** Into the Hollow, shared (3 lines). */
const C8_LEDGE_END: Line[] = [
  MARINA('Keep going. The Hollow’s through there. Mind the last step. It’s further than it looks.'),
  N('Past the falls the path gives up. Only moss, and dark, and slow fireflies. Something grey sits in the branches above you. Then another.'),
  NOVA('Don’t look straight at them. Look a bit to one side. It’s politer.', 'soft'),
];

/** Why the Wellspring never freezes. `after` is the index of Marina’s “It never freezes” line. */
const springLesson = (after: number): LessonBody => ({
  domain: 'science',
  skill: 'warm springs: water heated by hot rock deep underground',
  kind: 'ask',
  after,
  prompt: [MARINA('Hazel used to ask the Nubbins this, every time. Why does it never freeze?', 'think')],
  options: [
    {
      label: 'Hot rock deep underground warms the water.',
      best: true,
      reply: [
        MARINA('That’s it. The deeper you go into the Earth, the hotter the rock gets. Water soaks down, warms up, and rises again.', 'happy'),
        MARINA('Heat from inside the Earth is called geothermal heat. In Iceland, people warm their homes with it.'),
      ],
    },
    {
      label: 'The sunshine keeps it warm.',
      reply: [
        MARINA('Sunlight can’t even reach in there. It’s a cave! The warmth comes from below.'),
        MARINA('Deep underground the rock is hot. Water soaks down, warms up, and rises again. That’s geothermal heat.'),
      ],
    },
    {
      label: 'The Nubbins keep it warm.',
      reply: [
        MARINA('Lovely thought. Hazel liked that one too. But the warmth comes from deep underground, where the rock is hot.'),
        MARINA('Water soaks down, warms up, and rises again as a warm spring. That’s geothermal heat.'),
      ],
    },
  ],
  parentNote: 'Your child learned that warm springs are heated by hot rock deep underground (geothermal heat), which is why the Wellspring shouldn’t freeze and the frost is a warning sign.',
});

const CH8: EduScene[] = [
  scene(
    'c8-open',
    [
      N('Nova is at the gate at first light, with a pack on her back and a lantern that isn’t lit.'),
      N('Autumn has come in overnight. The plum leaves are yellow at the edges, and the air smells of smoke and wet apples.'),
      N('Her boots are laced with three different laces. She lifts and pushes the gate without thinking.'),
      N('She has come through five or six times since spring. A cup of tea she never finishes, a story from far away, and gone by morning.'),
      NOVA('Don’t put the kettle on. I’m not staying for tea. I never do.'),
      NOVA('…I am staying long enough to ask you something, though. Which I also never do. So bear with me. I’m bad at it.', 'think'),
      NOVA('The Hollow. Past the falls, where the paths stop. Strays end up there: runaways, the ones nobody feeds any more.'),
      NOVA('Somebody’s been feeding them, ever since the snow went. A woman with a lantern and a bag of fruit.'),
      N('She doesn’t say the name. She doesn’t need to.'),
      NOVA('I’ve seen her. From a distance. She didn’t wave. She was busy. She looked… small.', 'soft'),
      NOVA('Her fire’s been cold for nine days. The bowls are empty. There are more grey ones in those trees every time I pass.'),
      NOVA('And it’s cold in there. It never used to be cold in there.'),
      NOVA('I’ve been everywhere in this valley on my own. I’d rather not go there on my own. Will you come?'),
      N('On the hill, Moss stirs. His voice comes from just behind your ears, dry and quiet.'),
      MOSS('The Hollow. Hazel went in with a lantern and a bag of fruit and that stubborn chin of hers.'),
      MOSS('You have the chin. Take the rest.'),
    ],
    [
      {
        domain: 'science',
        skill: 'why leaves change colour in autumn',
        kind: 'notice',
        after: 4,
        lines: [
          NOVA('Your plum tree’s turning, by the way. Leaves are green because of chlorophyll. It catches sunlight to make the tree’s food.'),
          NOVA('When the days get shorter, the tree stops making it. The green fades, and the yellow that was there all along shows through.'),
          NOVA('Sorry. Long walks. You end up knowing things about trees.'),
        ],
        parentNote: 'Your child heard why leaves turn yellow in autumn: as days shorten, trees stop making green chlorophyll and the yellow underneath shows.',
      },
      {
        domain: 'sel',
        skill: 'asking for help takes courage',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 12,
        lines: [
          MOSS('Did you hear that? She asked. For Nova, that is the bravest thing she has done in years.', 'soft'),
          MOSS('Asking for help is not weakness. It is trusting someone. The people who never ask often need it most.'),
        ],
        parentNote: 'Your child heard that asking for help takes courage and is a way of trusting someone, not a weakness.',
      },
    ],
    [
      {
        id: 'yes',
        label: 'Yes. Now.',
        friendship: { nova: 3 },
        then: [
          NOVA('Oh. Good. That was much easier than I’d feared.', 'happy'),
          NOVA('Take a Nubbin that trusts you. Take fruit. Take more fruit than that.'),
        ],
      },
      {
        id: 'hazel',
        label: 'Is she all right?',
        friendship: { nova: 2 },
        then: [
          NOVA('I don’t know. That’s the honest answer, and you’d know if I gave you a different one.', 'sad'),
          NOVA('Take a Nubbin that trusts you. Take fruit. Take more fruit than that.'),
        ],
      },
      {
        id: 'falls',
        label: 'How do we get past the falls?',
        friendship: { nova: 1, marina: 1 },
        then: [
          NOVA('We don’t. Marina does. We follow her very closely, and we don’t look down.'),
          NOVA('Take a Nubbin that trusts you. Take fruit. Take more fruit than that.'),
        ],
      },
    ],
  ),
  scene(
    'c8-ledge',
    [
      ...C8_GATE,
      MARINA(
        'Nobody comes this way but me. Hand on the rock, eyes on my heels. And don’t be brave. Brave people fall off. Be careful instead.',
      ),
      MARINA('Rule four still applies. Sparks would have grabbed the waterfall.', 'happy'),
      MARINA(
        'I taught every one of Hazel’s Nubbins to swim, you know. People think that’s all I did for her.',
        'think',
      ),
      ...C8_LEDGE_REST,
      MARINA('…That’s new. Thirty years I’ve walked past it, and it’s never had so much as a cold morning on it.', 'shock'),
      ...C8_LEDGE_END,
    ],
    [
      {
        domain: 'science',
        skill: 'sorting materials by what they do: which keep you warm',
        standard: '2-PS1-1',
        kind: 'do',
        after: 1,
        check: 'edu:sort:fern-bag:keeps-warm',
        lines: [
          FERN('Help me check the bag before you go? Sort it: things that keep you warm, and things that don’t.', 'think'),
          FERN('Tip: wool is full of tiny pockets of trapped air. Trapped air holds your warmth in. That’s why jumpers work. Two jumpers, twice the work.'),
        ],
        parentNote: 'Your child sorted objects by a property (keeps you warm or not) and learned that wool traps air, which holds in body heat.',
      },
      springLesson(5 + 2 + 3 + 1),
    ],
  ),
  scene(
    'c8-ledge-s4',
    [
      ...C8_GATE,
      MARINA('You’ve walked this once already, so you know the rules. Hand on the rock, eyes on my heels.', 'happy'),
      MARINA('And you still don’t get to be brave. Brave people fall off. Careful people get home.'),
      ...C8_LEDGE_REST,
      MARINA('…That wasn’t there when I brought you before. Not a thread of it. Thirty years, and never so much as a cold morning.', 'shock'),
      ...C8_LEDGE_END,
    ],
    [
      {
        domain: 'science',
        skill: 'sound is made by vibration',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 7,
        lines: [
          MARINA('Feel that roar in your chest? That’s sound. The falling water shakes the air, and the shaking travels to you.'),
          MARINA('Sound is vibration, things shaking very fast. Keep your palm on the rock. You can feel it buzzing too.'),
        ],
        parentNote: 'Your child learned that sound is made by vibrations, which can be heard and also felt, as with the roar of a waterfall.',
      },
      springLesson(5 + 2 + 3),
    ],
  ),
  scene(
    'c8-close',
    [
      N('You don’t find her. You find a camp: a cold fire, a dozen bowls, and a dozen grey shapes watching from the trees.'),
      N('The bowls are licked clean. The firewood is stacked and tied with string, neatly, as if she meant to be back tomorrow.'),
      N('There is frost on the string. Nobody has sat by these ashes for days. And on a flat stone, a notebook in her writing.'),
      HAZEL('“Day 300-something. Lost count. Fed nineteen today. The brown one let me touch her ear. Took two months. Worth it.”', 'soft'),
      HAZEL('“The doctor said a year. I decided it would be a good one. I was right. I’m always right; it’s very tiring for everyone.”'),
      N('Gran Hazel is very poorly. The doctors can’t make her better. She knew that when she wrote this.'),
      HAZEL('“If my grandchild reads this: I’m not sorry. I’m sorry you had to find out this way. Both are true. Lift and push.”', 'soft'),
      N('There is one more page. The writing is newer, and harder. In two places the pen has gone through the paper.'),
      HAZEL('“The cold comes from up the valley. I know where the fourth one went. I always knew. I hoped he’d bring it back himself.”'),
      N('…'),
      N('You think of a man leaning on a gate, waiting for it to open. His knuckles, blue with cold.'),
      N('You think of him touching his breast pocket, lightly, the way some people touch a ring.'),
      NOVA('Her tracks go north. Up the valley. Into the cold, not away from it.', 'soft'),
      NOVA('That’s her all over, isn’t it.'),
      N('Your Nubbin puts its head on your knee and keeps it there until you can stand up.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'subtraction word problem within 20',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 3,
        prompt: [
          NOVA(
            'Nineteen Nubbins ate that day, but there are only twelve bowls. A dozen is twelve.',
            'think',
          ),
          NOVA('How many more Nubbins than bowls?'),
        ],
        options: [
          {
            label: '7',
            best: true,
            reply: [
              NOVA(
                'Seven. 19 take away 12 is 7. So she filled some bowls twice. Every day, since the end of the winter.',
                'soft',
              ),
            ],
          },
          {
            label: '31',
            reply: [
              NOVA(
                'That’s 19 add 12. But we want to know how many more Nubbins there are than bowls.',
              ),
              NOVA('19 − 12 = 7. Seven more Nubbins than bowls.'),
            ],
          },
          {
            label: '12',
            reply: [
              NOVA('Twelve is how many bowls there are. We want how many more Nubbins than that.'),
              NOVA('19 − 12 = 7.'),
            ],
          },
        ],
        parentNote:
          'Your child solved a subtraction word problem within 20 (19 Nubbins, 12 bowls, 7 more Nubbins than bowls) and learned that a dozen means twelve.',
      },
      {
        domain: 'literacy',
        skill: 'making an inference: who is “he”?',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 9,
        prompt: [
          N('Hazel writes, “I know where the fourth one went” and “I hoped he’d bring it back.”'),
          N('Who do you think “he” is? Think about the clues you’ve found.'),
        ],
        options: [
          {
            label: 'Corvin',
            best: true,
            reply: [
              N('That’s what the clues say. Frost on his rails in August. Blue knuckles. A hand always touching his pocket.'),
              N('And the cold comes from up the valley, where he lives. Clues adding up to an idea is called an inference.'),
            ],
          },
          {
            label: 'Moss',
            reply: [
              N('Moss knows a lot, and he’s keeping a promise. But he never took anything. Think about the cold clues.'),
              N('Frost on the rails in August. Blue knuckles. A hand at his pocket. They all point to Corvin.'),
            ],
          },
          {
            label: 'Sparks',
            reply: [
              N('Sparks races at the Circuit, but Sparks’s Nubbins bounce! And Sparks is the one who noticed the frost.'),
              N('The cold clues all point to Corvin: frosty rails, blue knuckles, a hand always at his pocket.'),
            ],
          },
        ],
        parentNote: 'Your child gathered clues from several chapters to infer who took the stone, and learned the word “inference”.',
      },
    ],
    [
      {
        id: 'feed',
        label: 'Fill the bowls before you go.',
        friendship: { nova: 2 },
        then: [
          N('You fill all twelve bowls. Nobody comes down from the trees while you are watching.'),
          N('When you look back from the edge of the camp, three of them are already empty.'),
          NOVA('That’s how she did it. One bowl at a time, since the snow.', 'soft'),
        ],
      },
      {
        id: 'wait',
        label: 'Sit down by the cold fire, and wait.',
        friendship: { nova: 2 },
        then: [
          N('You sit by the cold fire. Rule three. The notebook is in your lap, and the light goes amber, then blue.'),
          N('After a long time, one grey shape climbs down to the lowest branch, and stays there, and watches you breathe.'),
          NOVA('That’s further than they’ve ever come for me.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    'c8-nova',
    [
      N('You walk back towards the falls with the notebook inside your coat, flat against your chest, where it stays warm.'),
      N('Fireflies blink on and off. Behind you, something grey drops from a branch to a bowl, and eats, and does not run.'),
      NOVA('Can I say something I shouldn’t?', 'think'),
      NOVA('She had a year. She could have spent it at home. By the pond. With you, when you came.'),
      NOVA('She spent it out here instead, with a lot of grey strangers who never once said thank you.'),
      NOVA('Do you mind? You’re allowed to. I would.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'a think question: can two opposite feelings both be true?',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 0,
        prompt: [
          N('You think about Hazel’s page. “I’m not sorry. I’m sorry you had to find out this way. Both are true.”'),
          N('Can two feelings that seem opposite both be true at the same time?'),
        ],
        options: [
          {
            label: 'Yes. You can feel two things at once.',
            reply: [N('That’s a fair answer. Hazel thought so. Lots of people feel happy and sad on the same day, even in the same minute.')],
          },
          {
            label: 'No. You have to pick one.',
            reply: [
              N('That’s a fair answer. It can feel that way.'),
              N('But Hazel wrote both, and meant both. Watch out for it. You might catch yourself feeling two things at once.'),
            ],
          },
          {
            label: 'I don’t know yet.',
            reply: [N('That’s a fair answer. Keep the question with you. You might find out on the walk home.')],
          },
        ],
        parentNote: 'A think question with no single right answer: your child considered mixed feelings, and whether two opposite feelings can be true together.',
      },
      {
        domain: 'science',
        skill: 'fireflies make their own light (bioluminescence)',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          NOVA('Fireflies are beetles, you know. They make their own light, inside their bodies.'),
          NOVA('It’s called bioluminescence. It’s a cold light, hardly warm at all. They flash to find each other in the dark.'),
          NOVA('You mostly see them on summer nights. The Wellspring keeps the Hollow warm enough for them, even now.'),
        ],
        parentNote: 'Your child learned that fireflies are beetles that make their own cold light (bioluminescence) and use it to find each other.',
      },
    ],
    [
      {
        id: 'year-mind',
        label: 'Yes. I’d have liked the year.',
        friendship: { nova: 2 },
        then: [
          NOVA('Good. Tell her, if you get the chance. She’d rather be argued with than forgiven.', 'soft'),
          N('You think of the letter. Don’t be dramatic about it. You think you might be, a bit, when you see her.'),
        ],
      },
      {
        id: 'year-right',
        label: 'No. They needed her more than I did.',
        friendship: { nova: 1 },
        then: [
          NOVA('Maybe. I’m not sure need is a queue, though. I’m not sure anyone has to stand at the back of it.', 'think'),
          N('You walk on. You think about that for much longer than you expect to.'),
        ],
      },
      {
        id: 'year-both',
        label: 'Both. I mind, and she was right.',
        friendship: { nova: 2 },
        then: [
          NOVA('Both are true, then.', 'soft'),
          N('It is almost exactly what she wrote. Nova hasn’t read that page. You don’t tell her.'),
        ],
      },
    ],
  ),
];

// ---------------------------------------------------------------- glossary

const GLOSSARY: GlossaryEntry[] = [
  { word: 'champion', meaning: 'The winner, or the very best at something, like a racing contest.', scene: 'c5-open' },
  { word: 'regret', meaning: 'The heavy, sorry feeling you get when you wish you had not done something.', scene: 'c5-open' },
  { word: 'variance', meaning: 'How much things differ from each other; zero variance means they are all exactly the same.', scene: 'c5-circuit' },
  { word: 'axis', meaning: 'An imaginary line through the middle of something that spins; the Earth spins on a tilted axis.', scene: 'c5-circuit' },
  { word: 'sentimental', meaning: 'Led by feelings, especially soft and loving ones, more than by facts.', scene: 'c5-close' },
  { word: 'discipline', meaning: 'Making someone follow rules or training exactly; it can be good or, used harshly, cruel.', scene: 'c5-close' },
  { word: 'fossil', meaning: 'The remains or print of a living thing from long ago, such as a shell, bone or footprint, turned to stone.', scene: 'c6-open' },
  { word: 'cocoon', meaning: 'A soft covering that wraps around a creature, like the case a caterpillar spins round itself.', scene: 'c6-open' },
  { word: 'memorial', meaning: 'Something that helps people remember someone who has died, like a flower, a stone or a bench.', scene: 'c6-close' },
  { word: 'trade', meaning: 'Giving one thing to get another thing in return.', scene: 'c6-close' },
  { word: 'tongue', meaning: 'The part of your mouth you taste with, or anything long and thin shaped like one, such as a tongue of frost.', scene: 'c7-open' },
  { word: 'nocturnal', meaning: 'Awake and busy at night and asleep in the day, like owls, bats and hedgehogs.', scene: 'c7-open' },
  { word: 'personification', meaning: 'Writing about a thing or an idea as if it were a person or alive, with feelings and wants.', scene: 'c7-stillness' },
  { word: 'shard', meaning: 'A sharp, broken piece of something hard, like glass, pottery or stone.', scene: 'c7-stillness-2' },
  { word: 'well', meaning: 'A word with two meanings: a deep hole you get water from, or healthy and happy in yourself.', scene: 'c7-stillness-3' },
  { word: 'calibrated', meaning: 'Set up and checked so that it measures exactly right.', scene: 'c7-close' },
  { word: 'statistically', meaning: 'Going by numbers and measurements collected about lots of things.', scene: 'c7-close' },
  { word: 'stray', meaning: 'An animal that has no home or has got lost, and wanders about.', scene: 'c8-open' },
  { word: 'chlorophyll', meaning: 'The green stuff in leaves that catches sunlight so a plant can make its food.', scene: 'c8-open' },
  { word: 'ledge', meaning: 'A narrow, flat shelf of rock sticking out from a cliff or wall.', scene: 'c8-ledge' },
  { word: 'geothermal', meaning: 'Heat that comes from deep inside the Earth.', scene: 'c8-ledge' },
  { word: 'dozen', meaning: 'A group of twelve.', scene: 'c8-close' },
  { word: 'inference', meaning: 'An idea you work out by putting clues together, when nobody has told you straight.', scene: 'c8-close' },
  { word: 'bioluminescence', meaning: 'Light made by a living thing, like the glow of a firefly.', scene: 'c8-nova' },
];

// ---------------------------------------------------------------- exports

export const EDU_CAMPAIGN_2_READER: EduCampaign = {
  id: 'reader:book2',
  band: 'reader',
  chapters: CHAPTERS,
  scenes: [...CH5, ...CH6, ...CH7, ...CH8],
  glossary: GLOSSARY,
  notes:
    'Reader band (ages 7–10) for Book Two, chapters 5–8: all 18 scenes in BOOK2_SCENES, including the variants ' +
    'c5-considered, c5-sold, c6-open-walked and c8-ledge-s4 (each carries its own lessons, so whichever variant plays, the chapter ' +
    'still teaches). Choice ids, friendship values and branch outcomes are unchanged. Think questions (ask with no best): ' +
    'c5-open (whose fault was Ash?), c6-close (is love worth the loss?), c7-stillness-3 (is safe the same as well?), ' +
    'c8-nova (can two opposite feelings both be true?). Fossil’s death is named plainly in c6-open / c6-open-walked; ' +
    'Hazel’s illness is described without naming any illness in c8-close. Lesson `after` indices in the shared ' +
    'blocks (C6_FADING, C8_LEDGE_REST) are computed from each scene’s own line count. Do-lesson checks: ' +
    'edu:order:rock-layers:oldest-first (tap the cliff layers bottom to top), edu:hold:still:sable-lean (stay still ' +
    'while Sable leans, no timer), edu:sort:fern-bag:keeps-warm (sort fruit, jumper, whistle, second jumper; jumpers ' +
    'are the warm ones). Sable is narrated, never a speaker (c7-close). The Hollow’s fireflies in autumn are kept warm by ' +
    'the Wellspring (said in c8-nova-l2); real fireflies are a summer sight.',
};

export const CHECKS: string[] = [
  'edu:order:rock-layers:oldest-first',
  'edu:hold:still:sable-lean',
  'edu:sort:fern-bag:keeps-warm',
];
