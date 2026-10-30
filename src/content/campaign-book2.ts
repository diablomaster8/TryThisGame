/**
 * Hazel's Grove, Book Two: The Cold (chapters 5–8).
 * The world widens: the Circuit up the valley, the hill in the rain, the frost at the empty
 * post, the ledge behind the falls and the Hollow beyond. Canon: briefs/story-bible.md.
 */
import type { Chapter, Scene, Line, LineGesture, Mood } from '../config/story';

const S = (id: string, lines: Line[], extra: Partial<Scene> = {}): Scene => ({ id, lines, ...extra });

const say =
  (who: string) =>
  (text: string, mood?: Mood, gesture?: LineGesture): Line => ({
    who,
    text,
    ...(mood ? { mood } : {}),
    ...(gesture ? { gesture } : {}),
  });

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

export const BOOK2_CHAPTERS: Chapter[] = [
  {
    n: 5,
    title: 'The Circuit',
    opening: 'c5-open',
    goal: 'winRace',
    goalText: 'Win a race or a Circuit ribbon.',
    hint: 'Races are in the top bar; the Circuit is at the dojo.',
    closing: 'c5-close',
  },
  {
    n: 6,
    title: 'Rain on the Hill',
    opening: 'c6-open',
    goal: 'talkDusty',
    goalText: 'Sit with Dusty by the flower.',
    hint: 'Walk up to Dusty and tap them.',
    closing: 'c6-close',
  },
  {
    n: 7,
    title: 'What Fear Teaches',
    opening: 'c7-open',
    goal: 'sableTrust45',
    goalText: 'Bring Sable’s trust to 45.',
    hint: 'Choose Feed and Pet to raise Sable’s trust; never throw her.',
    closing: 'c7-close',
  },
  {
    n: 8,
    title: 'The Hollow',
    opening: 'c8-open',
    goal: 'notebook',
    goalText: 'Walk the Hollow and find Hazel’s notebook.',
    hint: 'Follow the fireflies to a flat stone and tap the notebook.',
    closing: 'c8-close',
  },
];

// Shared halves of variant scenes, so the variants differ only where they must.

const C6_FADING: Line[] = [
  N('Fossil uncurls, very slowly, and climbs out of Dusty’s lap onto the grass. She wants to do this part herself.'),
  N('A cocoon closes round her, thin as a soap bubble. Rain runs down the outside of it.'),
  DUSTY('She’s done. Not reborn. Done. You can tell by the light. Rebirth glows; this just… thins.'),
  N('It thins the way breath thins on a window. You keep thinking it has finished, and it hasn’t.'),
  N('Dusty puts one muddy finger against it.'),
  N('Inside, very faintly, something taps back. Twice.'),
  DUSTY('Yes. All right. I know.', 'soft', 'nod'),
  N('…'),
  N('And then there is only rain, and where she was, a flower pushing up through the wet grass.'),
  DUSTY('Everyone keeps telling me it means she was happy enough to let go. That’s true. It’s also the worst thing anyone’s ever said to me.', 'sad'),
  N('Dusty doesn’t cry. They just sit there, getting wetter, looking at the flower as if it might need something.'),
  DUSTY('Would you sit with me a bit. You don’t have to say anything. Hazel never did.'),
];

const C8_GATE: Line[] = [
  N('Fern catches you at the gate with a bag. In it: fruit, a jumper, a whistle, a second jumper, and a note that says SORRY ABOUT THE JUMPERS.'),
  FERN('It’s cold where you’re going. Everyone says so. I don’t know anything else useful, so: jumpers.', 'think', 'shrug'),
  N('Sable comes with you as far as the gate, and stops there, and sits.'),
  N('This is as far as she goes. She will be here.'),
  N('Marina is waiting at the pool below the falls, sleeves rolled, hair already wet.'),
  MARINA('Nova said you’d be coming this way. Nova never says anything, so I listened.'),
];

const C8_LEDGE_REST: Line[] = [
  N('The ledge is a hand’s width wide and runs behind the falling water. The roar fills your head until nothing else fits.'),
  N('Green light. White water.'),
  N('Spray on your face, cold; the rock under your palm, colder.'),
  N('Then, halfway along, warmth. It comes up through the stone into your hand like the side of a teapot.'),
  MARINA('Look. Don’t stop. Just look.', undefined, 'point'),
  N('Through a split in the rock: a cave of glittering stone, and in it a pool, steaming gently, lit from underneath by nothing at all.'),
  N('The Wellspring. It is the stillest water you have ever seen, and the most alive.'),
  MARINA('That’s where they came from. The first ones. Up out of that, each one a little light. Moss told Hazel. Hazel told me.', 'soft'),
  MARINA('The water never freezes. Only the rim, once, in the White Year, and look what came of that.'),
  MARINA('It’s the one warm thing the valley’s always been able to count on.'),
  N('Round the rim of the warm water, where nothing should be cold, runs a thin white line of frost.'),
];

const C8_LEDGE_END: Line[] = [
  N('Marina’s hand finds your sleeve and holds on, just for a moment, the way you’d hold a rail.'),
  MARINA('Keep going. The Hollow’s through there. Mind the last step. It’s further than it looks.'),
  N('Past the falls the trees close in, and the path gives up, and there is only moss and dark and a few slow fireflies.'),
  N('Something grey is sitting in the branches above you.'),
  N('Then another. Then you stop counting.'),
  NOVA('Don’t look straight at them. Look a bit to one side. It’s politer.', 'soft'),
];

export const BOOK2_SCENES: Scene[] = [
  // ---------------------------------------------------------------- chapter 5: The Circuit
  S(
    'c5-open',
    [
      N('High summer. The Grove smells of cut grass and warm fruit, and somebody is at the gate.'),
      N('Wasps are drunk in the plum tree. The pond is warm enough to put your feet in, and your Nubbin has put in all of itself.'),
      N('She lifts and pushes without being told. Whoever she is, she has been here before.'),
      EMBER('Ember. I don’t do small talk.', 'angry'),
      N('She doesn’t do large talk either, it turns out, for nearly a minute. She just looks at the gate.'),
      EMBER('Corvin Vale is running the Circuit this week and he’s invited you. That’s not a kindness.'),
      EMBER('He wants to see what you’ve got so he can put a price on it.'),
      N('She looks at your Nubbins the way people look at a house they used to live in.'),
      EMBER('Hazel gave me an egg, once. I was fifteen. I didn’t deserve it and she knew, and she gave it to me anyway.', 'soft'),
      EMBER('Her name was Ash. Fast. Brave. She used to run at the gate, full tilt, and bounce off it. Every single morning.'),
      EMBER('I was young and I wanted to win. Corvin said he could make her a champion in a month.', 'sad'),
      EMBER('I let him take her for training.'),
      N('…'),
      EMBER('She came back grey. She won every race he put her in. She never once looked at me again.'),
      N('Ember’s hands are in her pockets. You can see the fists through the cloth.'),
      EMBER('So when he offered to keep her, I let him. I told myself she was happier running. That’s the part I can’t get the taste out of.', 'sad'),
      EMBER('Go race. Win if you can. But watch how he talks to the ones who lose.', 'angry'),
    ],
    {
      choices: [
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
            EMBER('Hazel did that. Exactly that. It’s very annoying.', 'soft'),
            EMBER('Come on, then. I’ll show you the road.'),
          ],
        },
      ],
    },
  ),
  S('c5-circuit', [
    N('The road climbs up the valley, and with every mile the trees stand further back from it.'),
    N('The Circuit is square and clean and silent.'),
    N('White lines, white rails, raked sand. Not one weed.'),
    N('It is the hottest day of the summer. The railings are furred with frost.'),
    SPARKS('Feel that. No, go on, put your hand on it. It’s AUGUST.', 'shock'),
    SPARKS('Eleven years I’ve raced here. Rails are always cold. I asked once. He said it was the shade.'),
    N('There is no shade. There is no tree for half a mile.'),
    N('At the start line, Corvin’s runners wait in a row. Grey, every one.'),
    N('Not touching. Not looking at anything.'),
    N('Your Nubbin presses against your leg and stays there.'),
    SPARKS('Mine bounce. Look at them. Mine never stop bouncing. His just… wait.', 'sad', 'down'),
    N('Byte is at the rail with a clipboard and a stopwatch, timing things that are not, strictly, racing.'),
    BYTE('His runners have a start variance of zero. Zero. I’ve timed sixty starts.', 'think'),
    BYTE('Nothing alive has a variance of zero. I thought I’d broken the stopwatch. I bought a second stopwatch.'),
    SPARKS('He’s got three now.'),
    BYTE('Four. One is for timing the others.'),
    N('Corvin comes down the rail towards you. His hands are bare and blue at the knuckles, and he does not seem to notice.'),
    CORVIN('Hazel’s heir. You came. And Ember. That’s a surprise. You don’t usually get this close.'),
    EMBER('Where’s Ash.', 'angry'),
    CORVIN('Lane four. She’s safe.'),
    EMBER('That isn’t what I asked.'),
    N('Corvin touches his breast pocket, lightly, the way some people touch a ring. Then he turns to you.'),
    N('Your breath smokes in the August air. Corvin sees it.'),
    CORVIN('Cold? Is it. I hadn’t noticed. I don’t, any more.', 'think'),
    CORVIN('Race well. I’d like to see what she taught you. I’d like to see if it’s changed.', undefined, 'chest'),
    CORVIN('One question first, since you’re her heir. What matters in a race? That they win, or that they want to?', 'think'),
  ], {
    choices: [
      {
        id: 'race-want',
        set: { 'c5-race': 'want' },
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
        set: { 'c5-race': 'win' },
        label: 'That they win. It’s a race.',
        then: [
          CORVIN('Honest. Good. You’ll do well up here.'),
          N('Ember says nothing for a moment. Then, quietly, to the frozen rail:'),
          EMBER('That’s what I said. At fifteen.', 'soft'),
          N('She doesn’t say it unkindly. She says it like someone who would have given a great deal to be argued with.'),
        ],
      },
      {
        id: 'race-home',
        set: { 'c5-race': 'home' },
        label: 'That they come home afterwards.',
        friendship: { ember: 2 },
        then: [
          CORVIN('…That isn’t an answer.', 'think'),
          EMBER('It’s the only one.', 'soft'),
          N('Corvin touches his breast pocket, and walks off down the white rail without another word.'),
        ],
      },
    ],
  }),
  S('c5-considered', [
    N('At the start line, Corvin finds you again. He doesn’t look at Ember.'),
    CORVIN('Still thinking? Good. The offer stands.'),
    N('Your Nubbin looks up at him, then at you, and then, very carefully, at nothing.'),
  ]),
  S('c5-close', [
    N('You cross the line first. Your Nubbin keeps running for three more steps, out of pure joy, and has to be fetched.'),
    SPARKS('THAT’S MY— no, that’s yours. That’s YOURS. I’m just very loud about it.', 'happy'),
    N('At the rail Byte stops all four stopwatches and stares at them.'),
    BYTE('Yours started late. Nearly half a second. It was looking at a butterfly.', 'think'),
    BYTE('Variance. Lovely, lovely variance.', 'happy'),
    CORVIN('Hazel’s heir wins. Of course. She always said the trick was to make them want to run for you.'),
    CORVIN('Sentimental. Effective, I’ll grant.'),
    CORVIN('Mine run because the alternative is worse.'),
    N('He says it without cruelty. He says it like someone reading out the weather.'),
    CORVIN('It’s faster. It’s steadier. Not one of mine has ever been hurt on this track. Can you say that?'),
    N('Behind him the grey runners stand in their line, perfectly still, frost on the rail beside them.'),
    EMBER('Ash. Ash, it’s me.', 'sad', 'down'),
    N('One of the grey ones turns her head, very slightly.'),
    N('…and then turns it back.'),
    CORVIN('You see? Discipline. Come to the garden sometime. I’ll show you how it’s done.'),
    N('On the road home Ember doesn’t say anything for two miles. Then, to nobody:'),
    EMBER('She turned her head, though.', 'soft'),
    N('The stream beside the road is lower than it was in spring. You notice, and then you don’t think about it again.'),
    N('At home, there is a line of white on your sleeve where you leaned on his rail. It takes all evening to melt.'),
  ]),
  S('c5-sold', [
    N('In the row of grey runners, third from the end, is one you know.'),
    N('It was yours. It has grown.'),
    N('It is not looking at you, or at anything.'),
    N('There is a number on its side in neat white paint, like the label on a jar.'),
    CORVIN('Yours runs well. I did tell you it would eat better with me.'),
    N('It does look well fed. That is all it looks.'),
    EMBER('You sold him one.', 'angry'),
    N('She doesn’t say anything else. She doesn’t need to.'),
  ]),

  // ---------------------------------------------------------------- chapter 6: Rain on the Hill
  S('c6-open', [
    N('It rains for three days. On the third, Dusty is up on the hill in it, cross-legged in the wet, with no hat.'),
    N('The gutters gurgle. The hill path has turned into a small brown stream, and it smells of wet chalk and crushed thyme.'),
    N('In their lap is the old sandstone-coloured Nubbin from Lantern Night, curled like a shell. Her ball is so pale the rain shows through it.'),
    DUSTY('Oh. Hello. Don’t mind me. I’m getting wet on purpose.', 'soft'),
    N('The duck from Lantern Night has also decided to get wet on purpose. It is regarding Dusty with respect.'),
    DUSTY('Ignore Gerald. He thinks I’m onto something.'),
    DUSTY(
      'This is Fossil. Original, I know. I dug her egg out of the cliff face when I was eleven. With a big spoon.',
    ),
    DUSTY('She’s been with me twenty years. Twenty years and a bit. I’ve been counting the bit.'),
    N('Fossil opens one eye, considers you, and taps Dusty’s wrist twice with one small hand.'),
    DUSTY('That means you’re all right. She’s very selective. She bit a postman once. Twice. Same postman.', 'happy'),
    DUSTY('Hazel used to come up here with us. Never brought an umbrella. Said it was only water, and the hill needed it more than she did.'),
    N('Fossil’s breathing is slow and even, like someone at the end of a long walk who has finally sat down.'),
    ...C6_FADING,
  ]),
  S('c6-open-walked', [
    N('It rains for three days. On the third, Dusty is up on the hill in it, cross-legged in the wet, with Fossil in their lap.'),
    N('The hill path has turned into a small brown stream. Dusty has put their coat over Fossil and left the rest of themselves out in it.'),
    DUSTY('You came. Good. She’s been watching the gate for you all morning.', 'soft'),
    N(
      'A duck sits in the rain beside them, wet on purpose too. It is regarding Dusty with respect.',
    ),
    DUSTY('Ignore Gerald. He thinks I’m onto something.'),
    DUSTY(
      'Thank you for the walk. The cliff, and the tree, and the water. I mean it. I don’t say thank you much. Ask anyone.',
      undefined,
      'chest',
    ),
    DUSTY('She hadn’t been in water in six years. Did you see her face? I’m keeping that face.'),
    DUSTY('And she tapped the rock when I told it wrong. Twenty years, and she still had to have the last word.', 'happy'),
    N('Fossil, hearing her name, taps Dusty’s wrist twice. Then she looks past you, down the hill.'),
    N('Your youngest Nubbin, the one she sat with until dark, is coming up the wet slope as fast as its legs allow.'),
    N('It sits down beside her, very close, and looks at nothing, and stays.'),
    DUSTY('She did everything on the list. Everything. I thought that would make this easier.'),
    DUSTY('It doesn’t. It makes it better. That’s different.', 'soft'),
    ...C6_FADING,
  ]),
  S(
    'c6-close',
    [
      N('You sit with Dusty on the wet hill, by the flower. Neither of you says anything.'),
      N('It rains, and then it rains less, and then it is only the trees dripping. It is somehow the best part.'),
      DUSTY('Thank you. Right. I’m going to go and dig something up. That’s what I do when I feel like this. It usually works.', 'soft', 'nod'),
      DUSTY('Yours will go one day. All of them. Love them anyway. Love them harder because of it. That’s the whole trade, and it’s a good one.'),
      N('Dusty goes down the hill. Halfway, they stop, look back at the flower, and lift one muddy hand to it.'),
      N('When you turn round, Moss is sitting by the flower.'),
      N('You didn’t see him come. The rain runs off him in silver threads.'),
      MOSS('Briar’s was the first flower on this hill. She went up laughing.', 'soft'),
      MOSS('This one went up in somebody’s lap, with the rain on her. I think that is better. Briar would argue.'),
      N('He looks at the flower for a long while. Then he says it, plainly, the way he says everything.'),
      MOSS('That is fading done right. Not stilled. Let go.'),
      MOSS('There are people who would rather a thing were still than gone. You have met one, up the valley.', 'think'),
      MOSS('They call it keeping. It is not keeping. Keeping is this. Sitting in the rain by what you could not hold.'),
      N('Down the hill, Dusty has nearly reached the gate.'),
    ],
    {
      choices: [
        {
          id: 'tell',
          label: 'Call after Dusty, and tell them what Moss said.',
          friendship: { dusty: 2 },
          then: [
            N('You call down the hill. Dusty stops with their hand on the gate and listens to the whole thing without moving.'),
            DUSTY('…Tell him thank you.', 'soft'),
            DUSTY('And tell him he’s got grass on his head.'),
            MOSS('I am aware of the grass.', undefined, 'chest'),
            N('Gerald the duck has come back up the hill. He settles beside Moss and regards him with respect.'),
            MOSS('There is a duck looking at me.'),
            MOSS('I believe it thinks I am onto something.', 'think'),
            N('Moss does not move from the flower until it is dark.'),
          ],
        },
        {
          id: 'keep',
          label: 'Keep it. Some things belong to the hill.',
          then: [
            N('You don’t call after them. Dusty lifts and pushes, and is gone.'),
            N('You stay. Moss stays.'),
            N('The flower, which has never been rained on before, seems to be getting used to it.'),
            N('Gerald the duck has come back up the hill. He settles beside Moss and regards him with respect.'),
            MOSS('There is a duck looking at me.'),
            MOSS('I believe it thinks I am onto something.', 'think'),
            N('Moss does not move from the flower until it is dark.'),
          ],
        },
      ],
    },
  ),

  // ---------------------------------------------------------------- chapter 7: What Fear Teaches
  S('c7-open', [
    N('Sable sleeps near you now. Not next to you: near.'),
    N('When you move in your sleep she wakes, every time.'),
    N('You wake before dawn because you are cold.'),
    N('The Grove is white. Not all of it.'),
    N('The frost lies in a long tongue from the edge of the long grass to the fourth lantern post.'),
    N('It gathers round the post, thick as fur. The other three stand damp and dark and ordinary.'),
    N('Your breath smokes. The frost squeaks under your bare feet, and you go back in for socks, and come out again faster.'),
    N('Sable is awake. She is looking at the post, and she is not moving at all.'),
    N('Not even her ears.'),
    LUNA('You’re up. Good. I didn’t want to wake you, and I didn’t want to wait.'),
    N('Luna has soil to her elbows and a lantern burnt down to the wick. For her, this is the end of the day.'),
    LUNA('It isn’t cold enough for that. I’ve had my hands in the ground all night. It isn’t cold enough for gloves.', 'think'),
    LUNA('I went up the valley last week. At night. I see what comes out at night.'),
    LUNA('I found out where she came from. Corvin’s garden.'),
    LUNA('He trains them with cold and with hunger. Food when they obey; nothing when they don’t. It works. It’s fast.', 'angry'),
    LUNA('There’s a pen at the end of the last row. Empty. A bowl in it, frozen to the floor. In summer.'),
    LUNA('Sable wouldn’t race. So she got nothing, for a long time. And then one night the gate was open.'),
    N('You look at Sable. Sable looks at the frost.'),
    LUNA('Her first nights here, the grass was white where she slept. I said it was just her. It was never just her, was it.', 'sad'),
    LUNA('She chose you, you know. She could have gone anywhere. She watched this Grove for three nights and decided your hands looked slow enough.', 'soft'),
    N('Sable’s little ball, still dark, bobs once.'),
    LUNA('I need to sleep. This is my midnight. Moss is coming down; he’s been watching that post since before I got here.'),
    LUNA('I can’t hear him. You can. Listen properly.'),
  ]),
  S(
    'c7-stillness',
    [
      N('Moss comes down the hill through the white grass.'),
      N('He leaves no prints at all. He is very light, these days.'),
      N('He stops at the fourth post and looks at the frost on it for a long time.'),
      N('Your Nubbin finds the frost too, and licks it. It turns to you, appalled, with its tongue out.'),
      N('Sable, very slowly, licks it as well. Then she backs off two steps and is appalled from there.'),
      MOSS('Yes. It is cold. That is rather the point.'),
      MOSS('Cold goes back to where it was kept. It is looking for its bed.', 'think'),
      MOSS('There is nothing under this post. There has not been for a long time. You knew that, I think, when the lantern went out.'),
      N('You think of Lantern Night, and the flicker, and the dark. You think of him saying: twenty-two years.'),
      MOSS('Sit. This is a long one, I am slow, and you have a habit of standing.'),
      N('You sit on the frozen ground. After a while Sable sits too, two steps off, with her back to the post.'),
      MOSS('On Lantern Night I told you how Cinder made a stone, and how they came out of the White Year alive, and grey, and still.'),
      MOSS('I told it to you as a story. Stories are kind; they stop. Now I will tell you what it is like.'),
    ],
    {
      choices: [
        {
          id: 'grey',
          label: 'Why are they grey?',
          then: [
            MOSS('Grey is not the cold. Grey is what the cold leaves behind. It is a scar, not a wound.'),
            MOSS('The cold says one thing, over and over. A Nubbin who hears it long enough stops being able to hear anything else.'),
            N('A crow goes over. Sable flinches, and then, slowly, remembers she does not have to.'),
            MOSS('The colour goes first. Then the wanting. The wanting is the part that matters.', 'sad', 'down'),
          ],
        },
        {
          id: 'hurt',
          label: 'Does it hurt them?',
          then: [
            MOSS('Not the way you mean. That is the worst of it.', 'sad', 'down'),
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
            MOSS('I can smell it on her still, the way you smell smoke on a coat long after the fire.'),
            N('Sable, at the sound of her name, turns one ear towards him.'),
            N('Only one. It is more than she gave anyone at midsummer.'),
            MOSS('She ran from it, though. Remember that. Something in her kept wanting, all the way down.', 'soft'),
          ],
        },
      ],
    },
  ),
  S(
    'c7-stillness-2',
    [
      MOSS(
        'A shard does not shout. It is not a monster. If it were a monster, it would be easy; you would only have to be brave.',
      ),
      MOSS(
        'It says one word. It says it to whoever is most afraid. From where it sits, that is a kindness.',
      ),
      N(
        'He waits so long that a hen over the wall decides he has finished, and says so at length.',
      ),
      N('Moss waits for the hen as well. Then:'),
      MOSS('Safe.'),
      N('The word sits in the cold air between you. Sable’s ears go flat against her head.'),
      MOSS('Think what you would give to know nothing would ever hurt them. No hawk. No fever. No hill.'),
      MOSS('Think what you would give to know nothing could ever hurt you through them.'),
      N('You think of Fossil in the rain. You think of Dusty’s muddy hand, lifted to a flower.'),
      MOSS('That is what it offers. And it keeps its word. That is the terrible thing about it. It always keeps its word.', 'sad'),
    ],
    {
      choices: [
        {
          id: 'cinder',
          label: 'Did Cinder hear it?',
          then: [
            MOSS('She heard it first. She made it, out of the spring’s cold and her own fear, and it spoke to her in her own voice.'),
            MOSS('She loved them more than any of us. That is why it found her so easily. It looks for the ones who love hardest.', 'sad'),
            N('Somewhere over the wall, Fern is humming a skipping rhyme to the hens. You cannot quite hear the words.'),
            MOSS('You know what the valley calls a love that holds too tight. She would have known it was fair.'),
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
            MOSS('Yes.', undefined, 'nod'),
            MOSS('You love them already. That is the door it uses. I would be lying if I told you that you were safe from it.'),
            MOSS('…Safe. Hm. There it is again. You see how it gets into everything.', 'think'),
            MOSS('I am too old to start lying to you. I am also too old to let you go near it alone. Remember both.', undefined, 'chest'),
          ],
        },
      ],
    },
  ),
  S(
    'c7-stillness-3',
    [
      MOSS('Hazel had a word for the opposite. She did not use it much. She was not a woman for words; she was a woman for soup.'),
      MOSS('She said “well”.'),
      N(
        'The sun reaches the top of the western hill. The frost on the near grass begins, very slightly, to steam.',
      ),
      MOSS(
        'A Nubbin that is well can be hurt. It runs off. It eats a beetle. It falls in love with a stick and will not be parted from it.',
      ),
      N(
        'Your Nubbin, who has been listening, goes and fetches a stick. It lays it at Moss’s feet.',
      ),
      MOSS('Yes. Thank you. Exactly that.', 'soft', 'nod'),
      MOSS('It gets lost in the long grass. It comes back. One day it goes up the hill.'),
      MOSS('A Nubbin that is safe cannot be hurt. And it cannot do any of the rest.'),
      N('…'),
      MOSS('Safe is not the same as well.'),
      N('Moss looks at Sable. Sable is looking at the frost, and then, for a moment, at you.'),
      MOSS('The grey stays. Clover told you that, and she was right. But the grey is not the Stillness. It is where the Stillness was.'),
      MOSS('A scar can be touched. A scar can be leaned on. You will see.', 'soft'),
    ],
    {
      choices: [
        {
          id: 'what',
          label: 'What do I do for her?',
          then: [
            MOSS('What Hazel did. Feed her before you feed yourself. Never, ever throw her. And when you don’t know what to do—'),
            YOU('—sit down next to her and wait.'),
            MOSS('Yes. You were listening. She will be pleased. Do not tell her I said so.', 'soft', 'nod'),
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
            N('You say nothing. The three of you sit by the empty post while the sun comes down the hill.'),
            MOSS('Good. You are learning faster than she did.', 'soft', 'nod'),
            MOSS('I sat beside her a whole winter before I said a word. She fidgeted all the way through it.'),
          ],
        },
      ],
    },
  ),
  S('c7-close', [
    N('The frost comes most mornings now. It never goes past the long grass, and round the fourth post it never quite goes.'),
    N('Then, one afternoon, Sable walks up to you, in daylight, in front of everyone, and leans her whole weight against your shin.'),
    N('She is heavier than she looks. You stand very still and let her be.'),
    CLOVER('Oh. Oh, look at her.', 'happy'),
    LUNA('Still grey. Always will be. And look at her anyway.', 'soft'),
    N('Sable says nothing. Her ears stay up.'),
    N('The dark ball above her head flickers, just for a moment, with something that might be a heart.'),
    BYTE('Statistically, a Shadow Nubbin initiating contact—', 'think', 'shrug'),
    LUNA('Byte.'),
    BYTE('…Yes. All right. That was very nice. I’m writing it down as nice.'),
    CLOVER('Write it down twice.', 'happy'),
    CLOVER('She slept on my blanket last night, you know. All night. Don’t tell her I told you. She’d be mortified.', 'happy'),
    N('Pixel comes over the stile with a box under one arm. On the front is a dial, a needle and one hand-painted word: MAYBE.'),
    PIXEL('Trust meter. For Sable. I built it last night.', 'happy'),
    BYTE('What does it measure?'),
    PIXEL('Mostly it says maybe. That’s accurate. Nothing about her is calibrated.', undefined, 'shrug'),
    BYTE('Nothing you build is calibrated.'),
    PIXEL('Your lace is undone.'),
    N('Byte looks down. It isn’t.'),
    PIXEL('Calibrated.', 'happy'),
    N('The needle trembles, and stays on MAYBE. Sable looks at the box with deep suspicion and leans harder on your shin.'),
    N('Up on the hill, Moss watches, and then looks away, the way you look away from something private.'),
  ]),

  // ---------------------------------------------------------------- chapter 8: The Hollow
  S(
    'c8-open',
    [
      N('Nova is at the gate at first light, with a pack on her back and a lantern that isn’t lit.'),
      N('Autumn has come in overnight. The plum leaves are yellow at the edges, and the air smells of smoke and wet apples.'),
      N('Her boots are laced with three different laces. Her pack smells of pine smoke and of somewhere a long way off.'),
      N('She lifts and pushes without thinking. She has come through the Grove five or six times since spring.'),
      N('Always the same: a cup of tea she never finishes, a story from somewhere you have never been, and gone by morning.'),
      NOVA('Don’t put the kettle on. I’m not staying for tea. I never do.'),
      NOVA('…I am staying long enough to ask you something, though. Which I also never do. So bear with me. I’m bad at it.', 'think'),
      NOVA('The Hollow. Past the falls, where the paths stop. Strays end up there. Runaways. The ones people stopped feeding.'),
      NOVA('Somebody’s been feeding them. Since the end of the winter. A woman with a lantern and a bag of fruit.'),
      N('She doesn’t say the name. She doesn’t need to.'),
      NOVA('I’ve seen her. From a distance. She didn’t wave. She was busy. She looked… small.', 'soft'),
      NOVA('Her fire’s been cold nine days. The bowls are empty. There are more grey ones in those trees every time I pass.'),
      NOVA('And it’s cold in there. It never used to be cold in there.'),
      NOVA('I’ve been everywhere in this valley on my own. I’d rather not go there on my own. Will you come?'),
      N('On the hill, Moss stirs. His voice comes from just behind your ears, dry and quiet.'),
      MOSS('The Hollow. Past the falls, past where the paths stop. Hazel went in with a lantern and a bag of fruit and the stubborn chin.'),
      MOSS('You have the chin. Take the rest.'),
    ],
    {
      choices: [
        {
          id: 'yes',
          label: 'Yes. Now.',
          friendship: { nova: 3 },
          then: [
            NOVA(
              'Oh. Good. That was much easier than I’d feared. I’d practised a speech.',
              'happy',
            ),
            NOVA('You’ll get the speech on the way, I’m afraid. It has a bit about owls in it.', 'happy'),
            NOVA('So we go and find out. We take what she took: a Nubbin that trusts you, and more fruit than seems sensible.'),
            N('Nova holds her lantern to your kitchen fire until it catches. She doesn’t say why she waited to light it here.', 'soft'),
            N('She rummages in her pack for the speech. It runs to both sides of the page.'),
          ],
        },
        {
          id: 'hazel',
          label: 'Is she all right?',
          friendship: { nova: 2 },
          then: [
            NOVA('I don’t know. That’s the honest answer, and you’d know if I gave you another one.', 'sad', 'shrug'),
            NOVA('I’ll fetch Marina. You fetch a Nubbin that trusts you, and fruit. More fruit than that.'),
            N('Nova is halfway down the lane, shouting for Marina, before you have found a bag.'),
          ],
        },
        {
          id: 'falls',
          label: 'How do we get past the falls?',
          friendship: { nova: 1, marina: 1 },
          then: [
            NOVA('We don’t. Marina does. We follow her very closely and we don’t look down.'),
            NOVA('Take a Nubbin that trusts you. Take fruit. Take more fruit than that.'),
          ],
        },
      ],
    },
  ),
  S('c8-ledge', [
    ...C8_GATE,
    MARINA(
      'Nobody comes this way but me. Hazel did, with me, more times than I could count. Hand on the rock, eyes on my heels.',
    ),
    MARINA(
      'And don’t be brave. Brave people fall off. Be careful instead. It’s less exciting and you get home.',
    ),
    MARINA('Rule four still applies. Sparks would have grabbed the waterfall.', 'think'),
    N('Behind you, Nova unfolds a page. Both sides of it.'),
    NOVA('Before we go on, I’d like to say a few words about why we’re here. And about owls.'),
    MARINA('Hand on the rock, Nova.'),
    NOVA('It’s very short. The owls are only the middle bit.'),
    MARINA('Then you can tell me the end at the other end.'),
    N('Nova folds the speech away. Halfway along, you hear her say “owls” once, quietly, to the rock.'),
    MARINA(
      'I taught every one of Hazel’s Nubbins to swim, you know. People think that’s all I did for her.',
      'think',
    ),
    ...C8_LEDGE_REST,
    MARINA('…That’s new.', 'shock'),
    MARINA('Thirty years I’ve walked past it. It’s never had so much as a cold morning on it.'),
    ...C8_LEDGE_END,
  ]),
  S('c8-ledge-s4', [
    ...C8_GATE,
    MARINA('You’ve walked this once already, so you know the rules. Hand on the rock, eyes on my heels.', 'happy'),
    MARINA('And you still don’t get to be brave. Brave people fall off.'),
    MARINA('Rule four still applies. Sparks would have grabbed the waterfall.', 'think'),
    N('Behind you, Nova unfolds a page. Both sides of it.'),
    NOVA('Before we go on, I’d like to say a few words about why we’re here. And about owls.'),
    MARINA('Hand on the rock, Nova.'),
    NOVA('It’s very short. The owls are only the middle bit.'),
    MARINA('Then you can tell me the end at the other end.'),
    N('Nova folds the speech away. Halfway along, you hear her say “owls” once, quietly, to the rock.'),
    ...C8_LEDGE_REST,
    MARINA('…That wasn’t there when I brought you before. Not a thread of it.', 'shock'),
    MARINA('Thirty years I’ve walked past it. It’s never had so much as a cold morning on it.'),
    ...C8_LEDGE_END,
  ]),
  S(
    'c8-close',
    [
      N('You didn’t find her. You found a camp: a cold fire, a dozen bowls, a dozen grey shapes watching from the trees.'),
      N('The bowls are licked clean. The firewood is stacked and tied with string, neatly, as if she meant to be back tomorrow.'),
      N('There is frost on the string. The ashes still smell faintly of apple wood.'),
      N('Nobody has sat by them for days.'),
      N('And on a flat stone, a notebook in her hand.'),
      HAZEL('“Day 300-something. Lost count. Fed nineteen today. The brown one let me touch her ear. Took two months. Worth it.”', 'soft'),
      HAZEL('“The doctor said a year. I decided it would be a good one. I was right. I’m always right; it’s very tiring for everyone.”'),
      HAZEL('“If my grandchild reads this: I’m not sorry. I’m sorry you had to find out this way. Both are true. Lift and push.”', 'soft'),
      N('There is one more page. The writing is newer, and harder.'),
      N('In two places the pen has gone through the paper.'),
      HAZEL('“The cold comes from up the valley. I know where the fourth one went. I always knew. I hoped he’d bring it back himself.”'),
      N('…'),
      N('You think of a man leaning on a gate, waiting for it to open. You think of his hands, blue at the knuckles.'),
      N('You think of him touching his breast pocket, lightly, the way some people touch a ring.'),
      NOVA('Her tracks go north. Up the valley. Into the cold, not away from it.', 'soft'),
      NOVA('That’s her all over, isn’t it.'),
      N('Your Nubbin puts its head on your knee and keeps it there until you can stand up.'),
    ],
    {
      choices: [
        {
          id: 'feed',
          label: 'Fill the bowls before you go.',
          friendship: { nova: 2 },
          then: [
            N('You fill all twelve bowls. Nobody comes down from the trees while you are watching.'),
            N('When you look back from the edge of the camp, three of them are already empty.'),
            N('You leave Fern’s second jumper folded on the lowest branch, mostly so you can stop carrying it.'),
            N('From further down the path, the branch is bare. Up in the tree, a grey shape is wearing the jumper on its head.'),
            NOVA('Tell Fern it was the wrong size. Then tell her it worked.', 'soft'),
            NOVA('That’s how she did it. One bowl at a time. Since the snow.', 'soft'),
          ],
        },
        {
          id: 'wait',
          label: 'Sit down by the cold fire, and wait.',
          friendship: { nova: 2 },
          then: [
            N('You sit by the cold fire. Rule three.'),
            N('The notebook is in your lap and the light goes amber, then blue.'),
            N('After a long time, one grey shape climbs down to the lowest branch, and stays there, and watches you breathe.'),
            NOVA('That’s further than they’ve ever come for me.', 'soft'),
          ],
        },
      ],
    },
  ),
  S(
    'c8-nova',
    [
      N('You walk back towards the falls with the notebook inside your coat, flat against your chest, where it stays warm.'),
      N('Fireflies come and go. Somewhere behind you, something grey drops from a branch to a bowl, and eats, and does not run.'),
      NOVA('Can I say something I shouldn’t?', 'think'),
      NOVA('She had a year. She could have spent it at home. By the pond. With you, when you came.'),
      NOVA('She spent it out here instead, with a lot of grey strangers who never once said thank you.'),
      NOVA('Do you mind? You’re allowed to. I would.', 'soft'),
    ],
    {
      choices: [
        {
          id: 'year-mind',
          label: 'Yes. I’d have liked the year.',
          friendship: { nova: 2 },
          then: [
            NOVA('Good. Tell her, if you get the chance. She’d rather be argued with than forgiven.', 'soft', 'nod'),
            N('You think of the letter. Don’t be dramatic about it.'),
            N('You think you might be, a bit, when you see her.'),
          ],
        },
        {
          id: 'year-right',
          label: 'No. They needed her more than I did.',
          friendship: { nova: 1 },
          then: [
            NOVA('Maybe. I’m not sure need is a queue, though. I’m not sure anyone has to stand at the back of it.', 'think', 'shrug'),
            N('You walk on. You think about that for much longer than you expect to.'),
          ],
        },
        {
          id: 'year-both',
          label: 'Both. I mind, and she was right.',
          friendship: { nova: 2 },
          then: [
            NOVA('Both are true, then.', 'soft'),
            N('It is almost exactly what she wrote.'),
            N('Nova hasn’t read that page. You don’t tell her.'),
          ],
        },
      ],
    },
  ),
];

/** Every flag Book Two reads or sets. */
export const BOOK2_FLAGS: string[] = [
  's4Done', // read: picks c8-ledge-s4 over c8-ledge
  's5Done', // read: picks c6-open-walked over c6-open
  'corvinOffer', // read: plays c5-considered after c5-circuit when it is considered (set in c2-corvin)
  'soldNubbin', // read: plays c5-sold after c5-close
  'boughtBack', // read: c5-sold is skipped if it is set (existing flag)
];

export const BOOK2_NOTES: Record<string, string> = {
  'c5-open':
    'Chapter 5 opening, at the Grove gate, high summer (drunk wasps, your Nubbin in the warm pond). Ember’s story of Ash. All three choices end with Ember coming ' +
    'to the Circuit (she is in c5-circuit and c5-close). Choices only change Ember friendship. Opens S4 and S5 ' +
    '(their own triggers). Ash’s first sound is deliberately not named here: that belongs to S6.',
  'c5-circuit':
    'New mid-chapter scene. Plays the first time the player opens Races in chapter 5, before the race starts. ' +
    'If that hook is awkward, queue it straight after c5-open. Staging: the Circuit, hot day, frost on the white ' +
    'railings (art: rime on the rail sprites; breath-puff particles near the rail only). Corvin is spawned for ch5 ' +
    'already. Sparks is present as a racer; Byte is at the rail with his stopwatches (spawn him for this scene; it seeds ' +
    'S7’s stopwatch). “She’s safe.” / “That isn’t what I asked.” seeds ch7. Ends on a question the player answers for ' +
    'Corvin: what matters in a race? (race-want | race-win | race-home). Sets c5-race (want | win | home), which Corvin ' +
    'quotes back in c9-open (choice-payoffs); friendship Sparks or Ember; ' +
    'race-win is not punished. Then c5-considered if corvinOffer = considered, then the race.',
  'c5-considered':
    'NEW. Variant tail: queue straight after c5-circuit (after its choice, before the race) only if corvinOffer = ' +
    'considered (c2-corvin “Let me think about it”). Pays off his “I’ll be at the Circuit when you’ve finished.” ' +
    'No flags, no friendship. With refused or sold it never plays.',
  'c5-close':
    'Chapter 5 closing, after the first race win. Byte’s “lovely variance” (your Nubbin started late, looking at a ' +
    'butterfly) is the living answer to Corvin’s zero. Keeps Corvin’s “Mine run because the alternative is worse.” ' +
    'The low stream seeds S4 (Corvin’s dam above the falls). Last line: the frost travels home on your sleeve.',
  'c5-sold':
    'Variant tail: queue directly after c5-close only if flag soldNubbin is true (and boughtBack is not). Your sold ' +
    'Nubbin is one of Corvin’s grey runners. If the renderer can, show the sold Nubbin’s sprite (flags.soldId) in grey.',
  'c6-open':
    'Chapter 6 opening when s5Done is NOT set: Fossil is introduced here for the only time (bible, conflict 8). ' +
    'Dusty is they/them; Fossil is she. Fossil does not speak; she taps twice. Staging: rain on the western hill; ' +
    'Fossil fades into a cocoon and the memorial flower (memorial-fossil, already placed by beginChapter) appears ' +
    'on the line “where she was, a flower…”. Goal after: tap Dusty.',
  'c6-open-walked':
    'Chapter 6 opening when s5Done IS set: plays INSTEAD of c6-open (set chapter 6 opening to this id, or queue this ' +
    'and mark c6-open seen). Fossil is not re-introduced; Dusty thanks you for the walk (S5’s cliff, tree and water ' +
    'wishes). Your youngest Nubbin (the one Fossil sat with in S5’s secret wish) walks up and sits by her: move ' +
    'the lowest-age Nubbin to the hill if possible, otherwise the line still reads. Shares the fading half with c6-open.',
  'c6-close':
    'Chapter 6 closing, after talking to Dusty. Moss: “That is fading done right. Not stilled. Let go.” Grief done ' +
    'right (Fossil) set against grief refused (Corvin, “up the valley”, unnamed). Choice only changes Dusty ' +
    'friendship. Both branches end with Moss sitting by the flower until dark. S7 should open after this chapter.',
  'c7-open':
    'Chapter 7 opening, before dawn. Staging: frost on the Grove only in a tongue from the long grass to the ' +
    'Long-Grass lantern post, thick round the post (art: frost decal; keep it every dawn through ch7–8). Sable ' +
    'frozen in place facing the post. Luna leaves at the end. S2’s decision falls in this chapter (its own scenes).',
  'c7-stillness':
    'New. Moss explains the Stillness, part 1 of 3. Queue c7-stillness, c7-stillness-2, c7-stillness-3 in that order ' +
    'straight after c7-open (same sitting, at the Long-Grass post). Each part ends with a question choice; all ' +
    'choices are flavour (no flags, no friendship) and every branch leads to the next part. Moss stands by the post.',
  'c7-stillness-2':
    'New. Stillness part 2: what the shard whispers (“Safe.”). The skipping-rhyme line in the cinder branch is ' +
    'intentionally wordless; Cinder’s rhyme itself appears elsewhere. Questions are flavour only.',
  'c7-stillness-3':
    'New. Stillness part 3: “Safe is not the same as well.” Grey is the scar, not the Stillness. ' +
    'The “where” branch points at Hazel’s notebook (ch8) without naming Corvin. Then the ' +
    'goal (Sable trust 45) begins.',
  'c7-close':
    'Chapter 7 closing, at Sable trust 45, in daylight with Clover, Luna, Byte and Pixel nearby (spawn them if not present). ' +
    'Sable leans her weight on your shin (animation: Sable presses against the Keeper’s leg). Sable is narrated, never a ' +
    'speaker (her one word is c10-safe-sable). Byte’s line nods at S7. ' +
    'Clover’s blanket (from c3-close) has been slept on. Pixel’s trust meter reads MAYBE (prop: optional decoration by ' +
    'the cottage door from here on; paid off in end-hazels-grove and end-long-road).',
  'c8-open':
    'Chapter 8 opening. Nova asks for help for the first time; she has visited before. Note beginChapter(8) moves ' +
    'the world to the Hollow before this queues: stage c8-open and the ledge scene over a Grove-gate / falls ' +
    'backdrop (or play them before setLocation). Choices change Nova (and Marina) friendship, and each ends on its own beat: ' +
    'yes, Nova’s practised speech (owls); hazel, she lights her lantern at your fire; falls, she runs to fetch Marina. Opens S8.',
  'c8-ledge':
    'New. Plays straight after c8-open when s4Done is NOT set. Marina leads along the ledge behind the falls; first ' +
    'glimpse of the warm Wellspring, its rim rimed with frost. Ends at the Hollow’s edge with grey shapes in the ' +
    'trees; then the goal (follow the fireflies to the notebook). Opens at the gate: Fern’s bag of jumpers (comic), ' +
    'Sable stays at the gate. Fern is present only in that opening beat (spawn her by the gate if possible). ' +
    'After “Rule four”, Nova tries her owl speech (all routes) and Marina stops it.',
  'c8-ledge-s4':
    'New. Plays INSTEAD of c8-ledge when s4Done IS set (Marina showed you the path in S4). Shares the gate opening ' +
    '(Fern’s jumpers) and the ledge; differs only in Marina’s rules lines and her reaction to the frost (“That wasn’t ' +
    'there when I brought you before”).',
  'c8-close':
    'Chapter 8 closing, on tapping the notebook. Hazel’s three existing pages verbatim, then the new last page ' +
    'verbatim from the bible. Corvin is implied, not named. The choice changes Nova friendship only; both branches ' +
    'are Hazel’s rules in action (rule one / rule three). Then c8-nova.',
  'c8-nova':
    'New. Plays straight after c8-close, on the walk back from the camp (same location; fireflies). Book Two ends ' +
    'here: advance to chapter 9 only once it is seen. The player’s first chance to answer the notebook’s news: should ' +
    'Hazel have spent her year at home? Choices year-mind | year-right | year-both change Nova friendship only, no ' +
    'flags. “Both are true” echoes Hazel’s notebook page.',
};
