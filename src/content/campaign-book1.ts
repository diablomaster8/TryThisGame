/**
 * Hazel's Grove, Book One: The Letter (chapters 1–4), plus the global triggered scenes.
 * Canon: briefs/story-bible.md (v2). Replaces the matching entries in config/story.ts.
 * Scene ids reuse the old ones so the sim keeps working; new scenes are listed in BOOK1_NOTES.
 * The player is always Hazel's grandchild ("you"); the ten Keepers are always NPCs.
 */
import type { Chapter, Scene, Line } from '../config/story';

const S = (id: string, lines: Line[], extra: Partial<Scene> = {}): Scene => ({ id, lines, ...extra });

export const BOOK1_CHAPTERS: Chapter[] = [
  {
    n: 1,
    title: 'The Letter',
    opening: 'c1-letter',
    goal: 'firstHatch',
    goalText: 'Hatch your first egg and pet the Nubbin that comes out.',
    hint: 'The eggs are in the long grass. Hold one and shake it to hurry it along. Tap a Nubbin and choose Pet.',
    closing: 'c1-close',
  },
  {
    n: 2,
    title: 'Shells and Promises',
    opening: 'c2-open',
    goal: 'feedTwice',
    goalText: 'Collect fruit from the trees and feed a Nubbin by hand, twice.',
    hint: 'Tap a tree to shake it. Tap fruit to pick it up. Tap a Nubbin and choose Feed.',
    closing: 'c2-corvin',
  },
  {
    n: 3,
    title: 'The One Who Hides',
    opening: 'c3-open',
    goal: 'sableTrust20',
    goalText: 'Win a little of Sable’s trust (20).',
    hint: 'Sable runs when you come close. Leave fruit nearby, be patient, pet her when she lets you. Never throw her.',
    closing: 'c3-close',
  },
  {
    n: 4,
    title: 'Moss Remembers',
    opening: 'c4-open',
    goal: 'lanternsAndMoss',
    goalText: 'Pet Moss on the hill and light all four lanterns.',
    hint: 'Tap a lantern post to light it. Moss sits on the western hill. The fourth post only flickers, but it counts.',
    closing: 'c4-close',
  },
];

export const BOOK1_SCENES: Scene[] = [
  // ---------------------------------------------------------------- chapter 1: The Letter
  S('c1-letter', [
    { who: 'narrator', text: 'Late spring. The road runs out a little before the Grove does.' },
    { who: 'narrator', text: 'The last of it is grass, and then a gate.' },
    { who: 'narrator', text: 'The gate is stuck. It always was.' },
    { who: 'narrator', text: 'You lift and push, the way she taught you.' },
    { who: 'narrator', text: 'It gives with the same small groan as when you needed both hands. It sounds as if it has missed the argument.' },
    { who: 'narrator', text: 'The Grove is overgrown and quiet. The pond has gone to reeds at one end.' },
    { who: 'narrator', text: 'Nobody has cut the grass since she left.' },
    { who: 'narrator', text: 'On the signpost, under a stone, a letter in your grandmother’s hand.' },
    { who: 'narrator', text: 'Your name is on the front. The writing leans more than you remember, as if every word were walking uphill.' },
    { who: 'narrator', text: 'You don’t open it. Not yet.' },
    { who: 'narrator', text: 'You go to the cottage first.' },
    { who: 'narrator', text: 'The door is on the latch. The kettle is on the stove, cold.' },
    { who: 'narrator', text: 'Beside it, one cup, washed and turned upside down.' },
    { who: 'narrator', text: 'She always left one out like that. For whoever came next.' },
    { who: 'narrator', text: 'The kitchen smells of apples and cold ashes and, under that, of her: wet wool and peppermint.' },
    { who: 'narrator', text: 'Her coat is not on its hook. Her boots are not by the door.' },
    { who: 'narrator', text: 'On the windowsill, a row of eggshells, rinsed and dry, each one dated in pencil in the same leaning hand.' },
    { who: 'narrator', text: 'You sit down on the step, where she used to sit, and open the letter.' },
    {
      who: 'hazel',
      text: '“If you’re reading this, I’ve gone up the hill and I’m not coming down for a while. Don’t be dramatic about it.”',
      mood: 'soft',
    },
    { who: 'narrator', text: 'Up the hill is where the flowers are. Everyone in the valley knows what that means.' },
    { who: 'narrator', text: '…' },
    { who: 'narrator', text: '“Don’t be dramatic about it.” It is so exactly her that, for a while, you can’t read the next bit.' },
    {
      who: 'hazel',
      text: '“There are two eggs in the long grass. They were waiting for someone with warm hands. That’s you.”',
      mood: 'soft',
    },
    { who: 'narrator', text: 'You look at your hands. They are just hands.' },
    {
      who: 'hazel',
      text: '“Rules. One: feed them before you feed yourself. Two: never, ever throw one. Three: when you don’t know what to do, sit down next to them and wait.”',
    },
    { who: 'narrator', text: 'She used to make you say them back to her, at the gate, before you were allowed in.' },
    {
      who: 'hazel',
      text: '“Moss will be watching from the hill. He’s older than the trees and twice as stubborn. He’ll come down when he decides you’re worth it.”',
    },
    { who: 'hazel', text: '“Love, Gran. P.S. The gate sticks. Lift and push.”', mood: 'happy' },
    { who: 'narrator', text: 'You laugh. It comes out the wrong shape.' },
    {
      who: 'narrator',
      text: 'Something small and grey watches from the top of the western hill, very still, and does not come down.',
    },
    {
      who: 'fern',
      text: 'Hello? Oh! You’re Hazel’s. You’ve got her chin. I’m Fern, from next door. I’ve been keeping the trees alive, badly.',
      mood: 'happy',
    },
    { who: 'narrator', text: 'She sees the letter in your hand, and her face changes.' },
    { who: 'you', text: 'Is she…?' },
    { who: 'fern', text: 'No. Not up there. Not the way people mean.', mood: 'soft' },
    { who: 'fern', text: 'I go and look at the flowers. Every week. There isn’t a new one. I’d know. I know all of them.', mood: 'soft' },
    {
      who: 'fern',
      text: 'She went off at the end of the winter. Big coat, bag of fruit, the walking stick she pretends she doesn’t need. Said she had some feeding to do.',
    },
    { who: 'fern', text: 'She’s done it before. Went off a whole winter once. Came back with a limp and a Nubbin nobody else could catch.' },
    { who: 'fern', text: 'She told me you’d come. Didn’t say when. I put the stone on the letter so it wouldn’t blow away. That was my job.' },
    { who: 'fern', text: 'I’m very proud of the stone, actually.', mood: 'happy', gesture: 'chest' },
    { who: 'narrator', text: 'From the long grass, by the farthest of the Grove’s four lantern posts, something hums. Low, like a kettle thinking about it.' },
    {
      who: 'fern',
      text: 'Hear that? They’ve been at it for a week. I’ll be around if you need anything. Mostly I need things from you, honestly.',
    },
  ], {
    choices: [
      {
        id: 'stone',
        label: 'It’s a very good stone.',
        friendship: { fern: 2 },
        then: [
          { who: 'fern', text: 'Thank you. Nobody ever mentions the stone.', mood: 'happy', gesture: 'nod' },
          { who: 'fern', text: 'It’s from the stream. I tried four. This one had the right sort of face.' },
          { who: 'narrator', text: 'You go to find the eggs. Behind you, Fern pats the stone once, the way you’d pat a dog that has done well.' },
        ],
      },
      {
        id: 'need',
        label: 'What do you need from me?',
        friendship: { fern: 1 },
        then: [
          { who: 'fern', text: 'Oh, loads. A ladder. Someone to hold the ladder. Someone to tell me the pear tree isn’t my fault.', mood: 'think', gesture: 'chest' },
          { who: 'fern', text: 'The pear tree is a bit my fault.', gesture: 'chest' },
          { who: 'narrator', text: 'You go to find the eggs. Fern goes to look at the pear tree, guiltily, from a distance.' },
        ],
      },
      {
        id: 'eggs',
        label: 'Say nothing. Go to the eggs.',
        then: [
          { who: 'fern', text: 'Straight to work, without a word. Oh, you’re definitely hers.', mood: 'soft' },
          { who: 'narrator', text: 'The long grass closes round your knees, warm and loud with crickets, and the humming gets nearer.' },
        ],
      },
    ],
  }),
  S('c1-close', [
    { who: 'narrator', text: 'It is warm. That is the first thing.' },
    { who: 'narrator', text: 'Small and damp and warmer than anything has a right to be.' },
    { who: 'narrator', text: 'It smells of rain and warm bread, the way new ones do. Bits of shell are stuck to its head like a hat.' },
    { who: 'narrator', text: 'It looks at your hand for a long time before it leans into it. Then it leans into it entirely.' },
    { who: 'narrator', text: 'You do not move for a while. Neither does it.' },
    {
      who: 'sparks',
      text: 'HEY. New Keeper. Don’t move. There’s a lantern post behind you and I’ve nearly fixed it.',
      mood: 'shock',
    },
    { who: 'narrator', text: 'There is a crackle, a small blue flash, and the smell of burnt hair.' },
    {
      who: 'sparks',
      text: 'Fixed it. Mostly. The hair grows back, before you ask. I’m Sparks. I run the fast ones. Yours is cute. Is it fast? It looks fast.',
      mood: 'happy',
    },
    { who: 'fern', text: 'It is three minutes old, Sparks.' },
    { who: 'sparks', text: 'Potential, Fern. I’m talking about potential.' },
    { who: 'narrator', text: 'Your Nubbin sneezes. A tiny blue spark jumps off the end of its nose and fizzles out in the grass.' },
    { who: 'sparks', text: 'Did you SEE that? It likes me. It’s caught it off me.', mood: 'happy' },
    { who: 'fern', text: 'That isn’t how anything works.' },
    {
      who: 'narrator',
      text: 'Your Nubbin looks up at you, then at Sparks, then at you again, and leans a little closer to your leg.',
    },
    { who: 'sparks', text: 'Right. Dusk. Watch this. Hazel had me do all four posts last winter, before she went… wherever she went.', gesture: 'nod' },
    { who: 'narrator', text: 'One by one, the lanterns come up: the pond, the stream, the old wall.' },
    { who: 'narrator', text: 'Gold on the water. Gold in the grass.' },
    { who: 'narrator', text: 'The fourth, out by the long grass, catches, gutters, and settles into a thin, uncertain flicker.' },
    { who: 'sparks', text: 'Ugh. That one. New wick, new glass, new everything. Three times.', mood: 'angry' },
    { who: 'fern', text: 'Has it ever worked?' },
    { who: 'sparks', text: 'Never has, not properly. Not since before my time.', mood: 'think' },
    { who: 'narrator', text: 'The air by the fourth post is cooler than it ought to be on a spring night. The long grass, probably.' },
    { who: 'sparks', text: 'Hazel said to leave it be. She’d stand out there some evenings, with it going like that. Just stand.' },
    { who: 'fern', text: 'Like she was waiting for someone to knock.', mood: 'soft' },
    { who: 'narrator', text: 'Nobody says anything for a moment. The fourth lantern flickers.' },
    { who: 'narrator', text: 'On the hill, the grey shape has moved one step down.' },
  ]),

  // ---------------------------------------------------------------- chapter 2: Shells and Promises
  S('c2-open', [
    { who: 'narrator', text: 'Morning. Mist on the pond.' },
    { who: 'narrator', text: 'Your Nubbin is asleep on your foot, which is a problem, because you need the foot.' },
    { who: 'narrator', text: 'A woman comes up the lane smelling of salt and weed, with a bucket that slops at every step and rolled sleeves gone stiff with brine.' },
    {
      who: 'marina',
      text: 'Morning. Marina. I keep the tide pools past the ridge. Hazel used to trade me fruit for swimming lessons. For the Nubbins, not for her.',
      mood: 'happy',
    },
    { who: 'marina', text: 'She could swim fine. She said water was for fish and fools, and she was neither.' },
    { who: 'marina', text: 'You’ve not eaten. Don’t argue, you’ve got the look. What’s rule one?', mood: 'think' },
    { who: 'you', text: 'Feed them before you feed yourself.' },
    { who: 'marina', text: 'That’s the one. Then, for pity’s sake, feed yourself. She never did that bit either.' },
    {
      who: 'marina',
      text: 'The trees drop fruit on their own, but a shake hurries them. A Nubbin fed by your hand remembers the hand. That matters more than people think.',
    },
    { who: 'sparks', text: 'Are we doing hand-feeding? I’m GREAT at hand-feeding. Show them, Marina.', mood: 'happy' },
    { who: 'marina', text: 'You show them. You’ve got more fingers left than anyone would expect.' },
    { who: 'sparks', text: 'Flat palm. Fruit in the middle. Fingers flat. FLAT. They don’t know fingers aren’t fruit, and honestly, from their side, fair.' },
    { who: 'narrator', text: 'Your Nubbin looks at the fruit, then your hand, then your face, as if checking all three are on the same side.' },
    { who: 'marina', text: 'Don’t push it at them. Hold still. Let them come the last bit. The last bit is theirs.' },
    { who: 'sparks', text: 'That’s the bit I’m bad at. I go “eat it, eat it, EAT IT”.' },
    { who: 'marina', text: 'We know.' },
    { who: 'narrator', text: 'Your Nubbin comes the last bit. It takes the plum, very politely.' },
    { who: 'narrator', text: 'Then it takes Sparks’s thumb, very politely, and holds on.' },
    { who: 'sparks', text: 'FLAT. I said FLAT. I didn’t do it FLAT.', mood: 'shock' },
    { who: 'marina', text: 'Rule four. Don’t be Sparks.', mood: 'happy' },
    { who: 'narrator', text: 'The plum is warm from the tree and splits in your fingers. Your Nubbin eats your half too, and looks at you as if you offered.' },
    { who: 'narrator', text: 'Marina looks at the hill a moment, and then at the cottage, with its one cup turned upside down.' },
    { who: 'marina', text: 'She’ll be back. She owes me a bag of plums. Hazel doesn’t leave debts.', mood: 'soft' },
    {
      who: 'marina',
      text: 'Oh, and if a man in a grey coat comes by talking about “investment”, don’t sell him anything. Not fruit. Not eggs. Nothing.',
      mood: 'think',
    },
    { who: 'sparks', text: 'Corvin. Runs the Circuit, up the valley. His lot win everything. They’re so fast. They’re so quiet.' },
    { who: 'sparks', text: 'I don’t like quiet ones. I like the ones that yell.', mood: 'think' },
    { who: 'narrator', text: 'Marina looks up the valley the way you would look at weather coming.' },
  ]),
  S(
    'c2-corvin',
    [
      { who: 'narrator', text: 'Late afternoon. The light has gone long and yellow.' },
      { who: 'narrator', text: 'Someone is standing at the gate.' },
      { who: 'narrator', text: 'A man in a grey coat. He doesn’t lift, and he doesn’t push.' },
      { who: 'narrator', text: 'He rests one hand on the top rail, and waits.' },
      { who: 'narrator', text: 'The gate swings open for him. Smoothly, without a sound, as if it had been expecting him.' },
      { who: 'narrator', text: 'It has never once done that for you.' },
      {
        who: 'corvin',
        text: 'Hazel’s heir. You have her stubborn little chin. Corvin Vale. I run the Circuit, up the valley. The real races.',
      },
      { who: 'narrator', text: 'He offers his hand. You take it.' },
      { who: 'narrator', text: 'It is cold. Not cool: cold, like a stone lifted out of a winter stream.' },
      { who: 'narrator', text: 'He smells of clean soap and something under it, sharp and metallic, like a gate on a frosty morning.' },
      {
        who: 'corvin',
        text: 'I knew your grandmother well. I was her student, once. We disagreed about methods. She thought love was a method.',
        mood: 'think',
      },
      { who: 'narrator', text: 'He looks past you, up the hill, to where the flowers are. Only for a moment.' },
      { who: 'corvin', text: 'Is there one for her? Up there.' },
      { who: 'you', text: 'No.' },
      { who: 'corvin', text: 'No. There wouldn’t be. She’d want to argue with it first.', mood: 'soft' },
      { who: 'narrator', text: 'His hand goes to his coat, to the breast pocket, and rests there. You don’t think he knows he does it.' },
      {
        who: 'corvin',
        text: 'Your young one there. Good bones. I will give you two hundred Shells for it, right now, and it will eat better with me than it ever will here.',
      },
      { who: 'narrator', text: 'Your Nubbin has gone very still behind your legs.' },
    ],
    {
      choices: [
        {
          id: 'refuse',
          label: 'No. They’re not for sale.',
          set: { corvinOffer: 'refused' },
          friendship: { marina: 2, ember: 2 },
          then: [
            {
              who: 'corvin',
              text: 'Of course. Her chin. The offer stands. Everyone sells eventually, when things get hard. Things always get hard.',
              gesture: 'nod',
            },
            {
              who: 'narrator',
              text: 'He goes. The gate swings shut behind him on its own.',
            },
            { who: 'narrator', text: 'On the top rail, where his hand rested, there is a thin grey bloom of frost. You watch it until it’s gone.' },
            { who: 'narrator', text: 'Behind your legs, something small lets out a long breath.' },
          ],
        },
        {
          id: 'sell',
          label: 'Two hundred? …Fine. Take it.',
          set: { corvinOffer: 'sold', soldNubbin: true },
          friendship: { marina: -4, ember: -4, clover: -3 },
          then: [
            { who: 'corvin', text: 'Sensible. Hazel never was.' },
            { who: 'narrator', text: 'He lifts your Nubbin by the scruff, not roughly, but not gently either.' },
            { who: 'narrator', text: 'It looks back at you the whole way to the gate. It does not make a sound.' },
            { who: 'narrator', text: 'The gate swings shut behind them on its own. On the top rail, a thin grey bloom of frost.' },
            {
              who: 'narrator',
              text: 'Two hundred Shells sit in your hand. They are very heavy for something so small.',
            },
            { who: 'narrator', text: 'Rule two said never throw one.' },
            { who: 'narrator', text: 'It didn’t say anything about this. It didn’t think it needed to.' },
          ],
        },
        {
          id: 'consider',
          label: 'Let me think about it.',
          set: { corvinOffer: 'considered' },
          friendship: { marina: -1 },
          then: [
            {
              who: 'corvin',
              text: 'Think. I like a Keeper who thinks. I’ll be at the Circuit when you’ve finished.',
            },
            { who: 'narrator', text: 'The gate swings shut behind him on its own. On the top rail, a thin grey bloom of frost, thinning as you watch.' },
            {
              who: 'narrator',
              text: 'Your Nubbin comes out from behind your legs slowly, and does not quite look at you.',
            },
          ],
        },
      ],
    },
  ),

  // ---------------------------------------------------------------- chapter 3: The One Who Hides
  S(
    'c3-open',
    [
      { who: 'narrator', text: 'Early summer. The evenings are long now, and smell of cut grass and warm stone.' },
      { who: 'narrator', text: 'You can’t sleep. You sit out on the step with a cup of tea gone cold, the way she used to.' },
      { who: 'narrator', text: 'Moths knock at the window behind you. In the reeds a frog says the same thing over and over, very sure of it.' },
      { who: 'narrator', text: 'Night. The lanterns are out.' },
      { who: 'narrator', text: 'Something is at the far edge of the Grove, half in the long grass.' },
      { who: 'narrator', text: 'A Nubbin, grey as ash, the little ball above its head dark and still.' },
      { who: 'narrator', text: 'One wing is held wrong. When you breathe, it flinches.' },
      { who: 'narrator', text: 'It is thin. You can count the ridges along its back from here.' },
      { who: 'narrator', text: 'It watches your hands.' },
      { who: 'narrator', text: 'Not your face. Your hands.' },
      { who: 'luna', text: 'Don’t. Not yet.', mood: 'soft' },
      { who: 'narrator', text: 'You go still. The grey one goes on not moving.' },
      { who: 'narrator', text: 'The voice comes low, from over the wall: a woman with soil to the elbows and a lamp turned down to almost nothing.' },
      {
        who: 'luna',
        text: 'Luna. I garden at night; I see what comes in at night. That one has been here three evenings. It eats what I leave and runs if I so much as stand up.',
      },
      { who: 'narrator', text: 'Over the other wall, Fern’s kitchen light goes on. Then off.' },
      { who: 'narrator', text: 'Then on again, as if someone is trying very hard not to look.' },
      { who: 'luna', text: 'She’s been doing that all week. She thinks it’s subtle.', mood: 'think' },
      { who: 'you', text: 'Whose is it?' },
      { who: 'luna', text: 'Nobody’s, now. Somebody’s, once. Look at the wing. Somebody held that too tight.', mood: 'sad' },
      { who: 'luna', text: 'She came down the valley road. The first time I got near her, she was cold. Not wet. Cold all through, like a doorstep in January.' },
      {
        who: 'luna',
        text: 'She’s gone Shadow. That’s what happens when a Nubbin stops believing hands are safe. It isn’t cruel. It isn’t anything. It’s… waiting for the next bad thing.',
        gesture: 'down',
      },
      { who: 'you', text: 'Can she get better?' },
      { who: 'luna', text: 'Not un-grey. Better, maybe. That’s a different question, and a much longer one.', mood: 'think', gesture: 'shrug' },
      { who: 'luna', text: 'Hazel had a few like her, over the years. She’d sit out here till dawn with them. Some nights I sat with her.', mood: 'soft' },
      { who: 'luna', text: 'I’ve been calling her Sable. She hasn’t objected. What will you do?' },
      { who: 'narrator', text: 'You think of a letter, and three rules, and of how easy it would be just to reach out.' },
    ],
    {
      choices: [
        {
          id: 'slow',
          label: 'Sit down. Put fruit on the ground. Wait.',
          set: { sableFirst: 'slow', sableTrustBonus: 6 },
          friendship: { luna: 4 },
          then: [
            { who: 'narrator', text: 'You sit. You put the fruit down.' },
            { who: 'narrator', text: 'For a long time nothing happens. Then a small grey shape takes one step, and another, and eats, watching you the whole time.' },
            { who: 'narrator', text: 'Somewhere around the second plum, your legs go to sleep. You don’t move them.' },
            {
              who: 'luna',
              text: 'That’s the whole trick. That’s all of it. Hazel would have liked you.',
              mood: 'happy',
            },
          ],
        },
        {
          id: 'grab',
          label: 'Catch her before she runs again.',
          set: { sableFirst: 'grab', sableTrustBonus: -8 },
          friendship: { luna: -3 },
          then: [
            { who: 'narrator', text: 'You lunge. You get a wing.' },
            { who: 'narrator', text: 'She screams, a sound you did not know they could make, twists free, and is gone into the dark.' },
            { who: 'narrator', text: 'Your hand is still shut on nothing. It is very cold.' },
            {
              who: 'luna',
              text: '…She’ll come back. They do. But you have made the next part much harder, for both of you.',
              mood: 'sad',
            },
          ],
        },
      ],
    },
  ),
  S('c3-close', [
    { who: 'narrator', text: 'Days of it. Fruit on the ground.' },
    { who: 'narrator', text: 'Sitting. Not looking straight at her, because looking straight at her is a kind of reaching.' },
    { who: 'narrator', text: 'Sable lets you within two steps now.' },
    { who: 'narrator', text: 'She does not come closer. But she does not run.' },
    {
      who: 'clover',
      text: 'Oh, she’s letting you near! I’m Clover. I keep the gentle ones. I’ve been so worried about her. Luna told me not to fuss, so I’ve been fussing quietly.',
      mood: 'happy',
    },
    {
      who: 'clover',
      text: 'Can I tell you something? A Shadow Nubbin doesn’t turn back. The grey stays. People think that means they’re broken.',
    },
    {
      who: 'clover',
      text: 'They aren’t. They’re just carrying the thing that happened. You can’t take it off them. You can only make it lighter.',
      mood: 'soft',
    },
    { who: 'clover', text: 'Hazel taught me that over a teacup, like it was nothing. I cried in her kitchen for an hour. She just kept topping up the pot.' },
    {
      who: 'narrator',
      text: 'Sable eats the fruit you left, and this time, when she finishes, she sits down instead of leaving.',
    },
    { who: 'narrator', text: 'Out on the lane, some child is skipping to a rhyme you almost know. Badly.' },
    { who: 'narrator', text: 'Next morning, early, you go to see where she slept. A hollow in the long grass, the size of two cupped hands.' },
    { who: 'narrator', text: 'Around it, the grass is white with frost.' },
    { who: 'narrator', text: 'Only there. Everywhere else, the dew is just dew.' },
    { who: 'clover', text: 'That’s odd. It’s not cold enough for that. Not for months yet.', mood: 'think' },
    { who: 'luna', text: 'It does that. Every morning, wherever she sleeps.', mood: 'think' },
    { who: 'narrator', text: 'The frost is gone by the time the sun reaches it. It leaves the grass a little flattened, a little grey.' },
    { who: 'narrator', text: 'And the fruit you left out last night is gone.' },
    { who: 'narrator', text: 'All of it. Six plums.' },
    { who: 'narrator', text: 'Sable is curled up nearby, very small, and does not look like someone who has eaten six plums.' },
    { who: 'luna', text: 'That wasn’t her. She hasn’t the appetite for six.', mood: 'think' },
    { who: 'narrator', text: 'On the flat top of the wall, where the sun hits first, six plum stones sit in a heap, licked clean. Whoever ate them likes a warm seat.' },
    { who: 'clover', text: 'Something’s stealing from her. Right. That settles it. I’m bringing her inside and knitting her a blanket.', mood: 'angry' },
    { who: 'luna', text: 'You are not. She’ll come in her own time, or she won’t. That’s hers to decide, not ours.' },
    { who: 'clover', text: 'She’s cold every single morning, Luna!' },
    { who: 'luna', text: 'She was cold before she met us. Grabbing her won’t make her warm. It’ll make her gone.' },
    { who: 'narrator', text: 'They both turn and look at you. Sable, between them, pretends to be asleep.' },
    { who: 'clover', text: 'Back me up.', mood: 'think' },
  ], {
    choices: [
      {
        id: 'side-luna',
        label: 'Luna’s right. Her own time.',
        friendship: { luna: 2 },
        then: [
          { who: 'clover', text: 'Yes. I know. I hate it.', mood: 'sad', gesture: 'nod' },
          { who: 'clover', text: 'I’ve already started the blanket, mind. I’ll just… leave it lying about. Near her. Accidentally.' },
          { who: 'luna', text: 'That’s allowed.', mood: 'soft' },
        ],
      },
      {
        id: 'side-clover',
        label: 'Clover’s right. Nobody should be cold alone.',
        friendship: { clover: 2 },
        then: [
          { who: 'clover', text: 'Thank you!', mood: 'happy', gesture: 'nod' },
          { who: 'luna', text: 'Then bring the blanket. But bring it the way you’d bring fruit. Put it down and walk away.' },
          { who: 'clover', text: '…Fine. But I’m making it extra thick, and nobody can stop me.' },
        ],
      },
      {
        id: 'side-both',
        label: 'Both. Leave a blanket out, and let her find it.',
        friendship: { clover: 1, luna: 1 },
        then: [
          { who: 'clover', text: 'Oh.', mood: 'soft' },
          { who: 'luna', text: 'Hm. That’s very Hazel.', mood: 'happy', gesture: 'nod' },
          { who: 'clover', text: 'I’m doing it in grey. So she doesn’t feel she has to match.', gesture: 'chest' },
        ],
      },
    ],
  }),

  // ---------------------------------------------------------------- chapter 4: Moss Remembers
  S('c4-open', [
    { who: 'narrator', text: 'The grey shape has come down from the top of the hill as far as the flat stone halfway, and has sat there all morning.' },
    { who: 'narrator', text: 'You climb up. You sit down next to him, because that is the rule, and you wait.' },
    {
      who: 'narrator',
      text: 'He is old. You can see it in how he sits: carefully, like something that has decided to.',
    },
    { who: 'narrator', text: 'For a long time, nothing. A bee.' },
    { who: 'narrator', text: 'Wind going over the grass. Your Nubbin falling asleep against your shoe.' },
    { who: 'narrator', text: 'The stone is warm from the sun and the thyme round it smells of summer.' },
    { who: 'narrator', text: 'You could sit here a long while. That seems to be the idea.' },
    { who: 'moss', text: '…You lift and push.', mood: 'think' },
    {
      who: 'narrator',
      text: 'The voice is small and dry and comes from somewhere behind your ears rather than in front of them.',
    },
    { who: 'moss', text: 'Every morning. Most people climb over by the third day. You never once did.' },
    {
      who: 'moss',
      text: 'The old ones like me can speak, a little, to Keepers who sit still long enough. Hazel sat still for forty years. You have managed a morning. Not bad.',
    },
    { who: 'moss', text: 'I am Moss. She will have told you I am stubborn. She was being kind.', gesture: 'chest' },
    { who: 'you', text: 'Where is she?' },
    { who: 'narrator', text: '…' },
    {
      who: 'moss',
      text: 'She didn’t vanish. Hazel has never vanished in her life. She leaves notes.',
    },
    { who: 'moss', text: 'She went past the falls, into the Hollow, to find the ones that got lost. She said she’d be back for the lanterns.' },
    { who: 'moss', text: 'She has never missed a Lantern Night. Not in forty years. Not with a broken ankle. Not the year of the floods.' },
    { who: 'moss', text: 'Hazel used to clear that stream in one go. Slow hands, quick feet. People forget that.', mood: 'happy' },
    { who: 'you', text: 'Then I’ll go and get her.' },
    { who: 'moss', text: 'Not yet. She asked me to tell you that, if you asked. She said you would ask.', mood: 'soft' },
    { who: 'moss', text: 'There are things that are hers to tell. I am old, but I am not so old I would take them from her.' },
    {
      who: 'moss',
      text: 'Tonight is Lantern Night. Four posts. Light them all and she might remember the way. Or she might not. Either way I would like to see it, one more year.',
      gesture: 'shrug',
    },
    { who: 'narrator', text: 'He looks down across the Grove, to the fourth post by the long grass. He looks at it for a long time.' },
    { who: 'moss', text: 'Tell me something, since you are here. What do you think the lanterns are for?', mood: 'think' },
    { who: 'moss', text: 'Not what you were told. What you think. I like to hear a thing fresh. It happens so rarely, at my age.' },
  ], {
    choices: [
      {
        id: 'lamps-remember',
        label: 'To remember the ones who’ve gone.',
        set: { 'c4-lamps': 'remember' },
        then: [
          { who: 'moss', text: 'Yes. That is the oldest answer, and a good one.', gesture: 'nod' },
          { who: 'moss', text: 'The flowers on this hill would agree with you, if flowers bothered to agree with anyone.', mood: 'happy' },
          { who: 'moss', text: 'She used to rest her hand on my head while she counted them. You may, if you like.', mood: 'soft' },
          { who: 'moss', text: 'Light the pond one first, tonight. That is where the first ones woke. It likes to be remembered first.' },
        ],
      },
      {
        id: 'lamps-home',
        label: 'So people can find their way home.',
        set: { 'c4-lamps': 'home' },
        then: [
          { who: 'moss', text: 'That was Hazel’s answer. She said it every year, and looked up the valley when she said it.', mood: 'soft' },
          { who: 'moss', text: 'I never asked her who she was lighting the way for. I am old, not stupid.' },
          { who: 'moss', text: 'You may put your hand on my head while we look up the valley. She always did.', mood: 'soft' },
          { who: 'moss', text: 'Leave the long-grass post till last. If anyone is coming home, that is the side they will come from.' },
        ],
      },
      {
        id: 'lamps-together',
        label: 'So nobody has to stand in the dark on their own.',
        set: { 'c4-lamps': 'together' },
        then: [
          { who: 'moss', text: 'Hm. Nobody has said that one before.', mood: 'think', gesture: 'nod' },
          { who: 'moss', text: 'I shall have to think about it, and I think slowly. Ask me again in a year.' },
          { who: 'moss', text: 'Sit closer, meanwhile. You may put your hand on my head. Nobody has, since she went.', mood: 'soft' },
          { who: 'narrator', text: 'You shift closer. Your Nubbin, still asleep, shuffles after you, so that nobody on this stone is on their own.' },
        ],
      },
      {
        id: 'lamps-dunno',
        label: 'Honestly? I don’t know.',
        set: { 'c4-lamps': 'dunno' },
        then: [
          { who: 'moss', text: 'Good. Neither did I, for the first hundred years. Light them anyway. The knowing comes after.', mood: 'happy', gesture: 'nod' },
          { who: 'moss', text: 'A hand on my head is a fine place to start not knowing. She always thought so. You may, if you like.', mood: 'soft' },
          { who: 'moss', text: 'Don’t tell anyone I said so. I have a reputation.' },
        ],
      },
    ],
  }),
  S('c4-close', [
    { who: 'narrator', text: 'Dusk. The pond, the stream, the old wall: each one catches with a soft sound, like someone settling into a chair.' },
    { who: 'narrator', text: 'The fourth, by the long grass, gutters and settles into its thin flicker. It will have to do.' },
    { who: 'narrator', text: 'And then they come. Up the lane, over the stile, through the gate, lifting and pushing without even thinking about it.' },
    {
      who: 'narrator',
      text: 'The Keepers, all of them, carrying cups of something hot and talking too loudly.',
    },
    { who: 'narrator', text: 'They stand in two loose knots on either side of the pond, the way people do when an old argument is still in the room.' },
    { who: 'fern', text: 'Lantern buns. Hazel’s recipe. I make them every year, and every year they don’t come out.', mood: 'sad' },
    { who: 'narrator', text: 'Sparks takes one and bites it. It makes a sound like a dropped plate.' },
    { who: 'sparks', text: 'Crunchy!', mood: 'happy' },
    { who: 'fern', text: 'They are not meant to be crunchy.' },
    { who: 'narrator', text: 'On the wall sits Dusty, with a very old, sandstone-coloured Nubbin in their lap and a duck at their feet.' },
    { who: 'dusty', text: 'That’s Gerald. He’s not with us. He just likes a crowd.' },
    { who: 'narrator', text: 'The old Nubbin reaches out and taps one of Fern’s buns, twice. It rings like a plate.' },
    { who: 'sparks', text: 'SEE? Even the old one says crunchy.', mood: 'happy' },
    { who: 'fern', text: 'Tapping isn’t a review.' },
    {
      who: 'pixel',
      text: 'Pixel. Hi. I did the lantern timing circuit, Sparks did the part that explodes. Is it true you can hear Moss? Byte says it’s a hoax.',
      mood: 'happy',
    },
    { who: 'byte', text: 'I said it was unverified.' },
    { who: 'moss', text: 'Tell the pale one his shoelace is untied.' },
    { who: 'narrator', text: 'You tell Byte his shoelace is untied.' },
    { who: 'narrator', text: 'Byte looks down. Byte goes very quiet.' },
    { who: 'byte', text: 'Anyone could have seen that.', mood: 'think' },
    { who: 'moss', text: 'Anyone didn’t.' },
    {
      who: 'luna',
      text: 'Hazel used to stand right there, by the pond, and not say anything. And it was somehow the best part.',
      mood: 'soft',
    },
    { who: 'narrator', text: 'Then, without anyone deciding to, Luna starts to sing. Low.' },
    { who: 'narrator', text: 'One by one, from both sides of the pond, the others join.' },
    { who: 'luna', text: 'Light one for the pond where the first ones woke, light one for the stream and the laughing folk,', mood: 'soft' },
    { who: 'chorus', text: 'light one for the wall where the quiet ones keep, and one for the long grass, and the ones who sleep.', mood: 'soft' },
    { who: 'chorus', text: 'Slow hands, warm hearts, the gate stuck fast — what’s kept with love is kept to last.', mood: 'soft' },
    { who: 'chorus', text: 'When the White Year came and the grass went still, and the cold crept down from the Hollow hill,', mood: 'soft' },
    { who: 'chorus', text: 'the old ones broke what the fierce one made, and they hid it low where the lanterns stayed.', mood: 'soft' },
    { who: 'chorus', text: 'Slow hands, warm hearts, the gate stuck fast — what’s kept with love is kept to last.', mood: 'soft' },
    { who: 'narrator', text: 'Byte doesn’t sing. Byte’s lips move.' },
    { who: 'chorus', text: 'Light one for the ones who went up the rise with the morning sun in their sleeping eyes;', mood: 'soft' },
    { who: 'chorus', text: 'we are made of the ones who remember us here, so we gather, we gather, we gather each year.', mood: 'soft' },
    { who: 'narrator', text: 'When it’s done, nobody says anything. The two knots by the pond have drifted, without anyone meaning it, a little closer.' },
    { who: 'narrator', text: 'Everyone looks, once, up the hill.' },
    { who: 'narrator', text: 'Nobody comes down it.' },
  ]),
  S(
    'c4-tale',
    [
      { who: 'narrator', text: 'Late. Most of the Keepers have gone home.' },
      { who: 'narrator', text: 'Sparks is asleep sitting up. Moss sits in the light of the pond lantern.' },
      { who: 'you', text: 'The song. “The old ones broke what the fierce one made.” What did they break?' },
      { who: 'moss', text: 'Ah. You were listening. Most people only sing it.' },
      { who: 'moss', text: 'Sit, then. It is an old story, and I am in it. That is the trouble with old stories, at my age. You are in all of them.' },
      { who: 'narrator', text: 'You sit. The pond lantern ticks as it warms.' },
      { who: 'moss', text: 'Before the Keepers, before the cottage, before the trees, there was the spring.' },
      { who: 'moss', text: 'Behind the falls, up the valley, there is a cave of glittering rock. In it is a pool of warm water that has never once frozen.' },
      { who: 'moss', text: 'The first ones came up out of it. Each one a small light. Nobody made them. They came the way the first warm day comes.' },
      { who: 'moss', text: 'Lights fade, on their own. The little ones always have.', mood: 'soft' },
      { who: 'moss', text: 'But one that is loved enough stops fading. It stays. That is what Eternal means. Nothing grander.' },
      { who: 'narrator', text: 'Out by the long grass, the fourth lantern flickers.' },
    ],
    {
      choices: [
        {
          id: 'ask-loved',
          label: 'Who loved you enough?',
          then: [
            { who: 'moss', text: 'A girl with a bucket. She used to carry me about in it. I was very small and very cross.', mood: 'soft' },
            { who: 'moss', text: 'She was gone long before the hill had flowers. When the first flower came up by the big stone, I planted one for her beside it.' },
            { who: 'moss', text: 'I still go and sit with them both.', mood: 'soft' },
          ],
        },
        {
          id: 'ask-first',
          label: 'Were you one of the first?',
          then: [
            { who: 'moss', text: 'No. I came later. I remember the first ones the way you remember your grandmother’s grandmother.' },
            { who: 'moss', text: 'By the stories. And by the chin.', mood: 'happy' },
          ],
        },
        {
          id: 'go-on',
          label: 'Go on.',
          then: [{ who: 'moss', text: 'Patient. Good. Hazel interrupted.', mood: 'happy' }],
        },
      ],
    },
  ),
  S(
    'c4-tale-2',
    [
      { who: 'narrator', text: 'Against the wall, Sparks says “FLAT” in her sleep, and turns over.' },
      { who: 'moss', text: 'She is still teaching hand-feeding. Even now. I admire it.' },
      { who: 'moss', text: 'Four of us kept this valley, once. Wardens, the Keepers called us later. We never called ourselves anything.' },
      { who: 'moss', text: 'Briar, who laughed. At rain, at foxes, at me. Mostly at me.' },
      { who: 'moss', text: 'Hush, who was quiet, and kept the griefs nobody else had room for.' },
      { who: 'moss', text: 'Cinder.' },
      { who: 'narrator', text: '…' },
      { who: 'moss', text: 'Cinder, who loved them hardest of all. She would have stood in a fire for any one of them.' },
      { who: 'moss', text: 'And me. I sat. Somebody has to.' },
      { who: 'moss', text: 'Then came the White Year.', mood: 'sad', gesture: 'down' },
      { who: 'moss', text: 'A winter that would not end. Snow where the spring should be. Snow at midsummer. The falls froze to the bottom.' },
      { who: 'moss', text: 'The little ones froze in the long grass. We found them in the mornings. More each morning.' },
      { who: 'moss', text: 'Cinder could not bear it. So she went behind the falls, to the rim of the spring, where even that had iced over.' },
      { who: 'moss', text: 'She broke off a shard of the ice, and of it she made a stone. The Heartstone.' },
      { who: 'moss', text: 'Whoever held it could gather every Nubbin’s will into one hand. All of them, moving as one, wherever the hand said.' },
      { who: 'moss', text: 'She led them out of the long grass and into shelter. Every one. Not one more was lost.' },
      { who: 'moss', text: 'It worked. I want you to understand that. It worked.' },
      { who: 'narrator', text: 'He is quiet so long that you think he may have finished.' },
      { who: 'moss', text: 'They came out of the winter alive. Grey, and still. Many of them never again moved of their own accord.' },
      { who: 'moss', text: 'They waited to be told.' },
      { who: 'moss', text: 'She made them safe by making them still.', mood: 'sad', gesture: 'down' },
    ],
    {
      choices: [
        {
          id: 'ask-rhyme',
          label: 'Cinder… like the rhyme?',
          then: [
            { who: 'moss', text: 'You know it.' },
            { who: 'narrator', text: 'You do. Everyone does.' },
            { who: 'narrator', text: 'You skipped to it in this very lane, and never once thought about the words.' },
            { who: 'you', text: 'Cinder held them close and tight, kept them warm one winter night;' },
            { who: 'you', text: 'when the morning came to call, they did not move at all.' },
            { who: 'moss', text: 'Children remember. They kept the tune and lost her.', mood: 'soft' },
            { who: 'moss', text: 'When someone holds too tight, the old folk here still call it cinder-love. She would have hated that. Or been proud.' },
          ],
        },
        {
          id: 'ask-saved',
          label: 'But she saved them.',
          then: [
            { who: 'moss', text: 'She did. And they never ran again, or played, or came to anyone’s hand of their own accord.' },
            { who: 'moss', text: 'I have had a very long time to think about which of those is saved. I still have no tidy answer.', mood: 'think' },
            { who: 'moss', text: 'Be wary of anyone who has one.' },
          ],
        },
        {
          id: 'ask-briar',
          label: 'Tell me about Briar.',
          then: [
            { who: 'moss', text: 'She laughed at everything, including dying. Especially that. She said it was the one joke everyone gets in the end.', mood: 'happy' },
            { who: 'moss', text: 'Hers was the first flower on the hill. The yellow one by the big stone. It comes up early every year, as if it can’t wait.' },
          ],
        },
      ],
    },
  ),
  S(
    'c4-tale-3',
    [
      { who: 'moss', text: 'So the three of us took it from her. Briar, Hush and I. It is the only time in my life I have been quick.' },
      { who: 'moss', text: 'We broke it in four. It did not want to break. Each of us laid one piece under a lantern post, to keep it asleep with our warmth.' },
      { who: 'moss', text: 'The pond, mine. The stream, Briar’s. The old wall, Hush’s.' },
      { who: 'moss', text: 'And the fourth, by the long grass, was Cinder’s own piece. I laid that one too. It wanted someone who had loved her.', mood: 'soft' },
      { who: 'narrator', text: 'Out by the long grass, the fourth lantern flickers, steadies, flickers.' },
      { who: 'moss', text: 'Cinder walked out into the snow and was not seen again. I looked. For a long time, I looked.' },
      { who: 'moss', text: 'Then the winter ended, the way they do, and people came. Keepers. They built the cottage, and lit the lanterns, and every year they gathered.' },
      { who: 'moss', text: 'That is what the night is for, if you want to know. The gathering keeps us remembered. The remembering keeps the pieces asleep.' },
      { who: 'moss', text: 'Briar went up the hill laughing. Hush went quietly, at the end of a long grief, when she had carried it as far as she could.' },
      { who: 'moss', text: 'And I stayed. Every year, a few more people to remember. A few fewer who remembered me.', gesture: 'chest' },
      { who: 'narrator', text: '…' },
      { who: 'moss', text: 'Then one spring a young woman came up the lane in a coat too big for her, with a chin like yours.' },
      { who: 'moss', text: 'I sat beside her a whole winter before I said a word. She never once asked me to. That is how I knew.', mood: 'soft' },
      { who: 'moss', text: 'Forty years. She learned slow hands. She was the best of all of them. Don’t tell her I said so.' },
      { who: 'moss', text: 'She took one apprentice. Clever. In a hurry. Twenty-two, with nothing but months.' },
      { who: 'narrator', text: 'Moss stops.' },
    ],
    {
      choices: [
        {
          id: 'ask-apprentice',
          label: 'What happened to him?',
          then: [
            { who: 'moss', text: 'That part is not a tale yet. It is still happening.', mood: 'sad', gesture: 'down' },
          ],
        },
        {
          id: 'ask-fourth',
          label: 'Is the fourth piece still under the long-grass post?',
          then: [
            { who: 'narrator', text: 'Moss looks at the fourth lantern. He does not answer.' },
            { who: 'moss', text: 'Ask me another night.' },
          ],
        },
        {
          id: 'sit',
          label: 'Say nothing. Sit with him.',
          then: [
            { who: 'narrator', text: 'You sit. After a while he leans, very slightly, against your arm.' },
            { who: 'narrator', text: 'He is lighter than he looks.' },
            { who: 'moss', text: 'Yes. Like that.', mood: 'soft', gesture: 'nod' },
          ],
        },
      ],
    },
  ),
  S('c4-out', [
    { who: 'narrator', text: 'Towards morning the wind turns. It comes down from up the valley, and it is cold.' },
    { who: 'narrator', text: 'The fourth lantern flickers.' },
    { who: 'narrator', text: 'Steadies. Flickers.' },
    { who: 'narrator', text: 'Goes out.' },
    { who: 'narrator', text: '…' },
    { who: 'moss', text: 'Twenty-two years.', mood: 'sad', gesture: 'down' },
    { who: 'you', text: 'Since what?' },
    { who: 'moss', text: 'Nothing you need tonight. The other three will see us to morning.' },
    { who: 'narrator', text: 'Against the wall, Sparks jerks awake, stares at the dark fourth post, and says, very clearly: “I didn’t touch it.”' },
    { who: 'narrator', text: 'She is asleep again before anyone can tell her nobody thought she had.' },
    { who: 'narrator', text: 'Three lanterns burn until dawn. On the glass of the fourth, a faint white bloom grows.' },
    { who: 'narrator', text: 'Then the sun reaches it, and it is gone.' },
    { who: 'narrator', text: 'Nobody comes down the hill.' },
    { who: 'moss', text: 'She will. She finishes things. It is the most annoying thing about her.', mood: 'soft' },
    { who: 'moss', text: 'Some evening, when you have time, carry me round the posts. There is more to each of them than one night holds.' },
    { who: 'moss', text: 'I am too old to walk it on my own. And I would like the company.', gesture: 'chest' },
    { who: 'narrator', text: 'At the edge of the long grass, beside the dark post, Sable is sitting very still, watching it too.' },
  ]),

  // ---------------------------------------------------------------- triggered scenes (any chapter)
  S('t-first-shadow', [
    { who: 'narrator', text: 'Your Nubbin has gone grey. The ball above its head is dark.' },
    { who: 'narrator', text: 'When you reach for it, it flinches away from your hand.' },
    { who: 'narrator', text: 'Your hand stops in the air. You don’t know what to do with it, so you put it down, slowly, on the grass between you.' },
    { who: 'fern', text: 'I’m not going to pretend that isn’t on you. Hazel wouldn’t, and she’d never let me hear the end of it.', mood: 'sad', gesture: 'chest' },
    { who: 'fern', text: 'Too many throws, or too many hungry nights. Or both.' },
    {
      who: 'fern',
      text: 'It doesn’t come back from grey. It can come back from scared. Slowly. If you’re patient every single day and never once aren’t.',
      mood: 'soft',
    },
    { who: 'fern', text: 'I’ll sit with you a bit, if you like. I’m no good at it. She was the one who was good at it.', mood: 'soft', gesture: 'shrug' },
  ]),
  S('t-ran-away', [
    {
      who: 'narrator',
      text: 'The long grass at the edge of the Grove is pressed flat where something small pushed through it, and the gate is swinging.',
    },
    { who: 'narrator', text: 'It never swings for you. It swung for that.' },
    {
      who: 'fern',
      text: 'It’s gone. They do that, when they’ve decided nothing here is worth staying for.',
      mood: 'sad',
    },
    { who: 'fern', text: 'They sometimes come back. To the edge. To see if anything’s changed.' },
    { who: 'fern', text: 'I still look at the edge, some mornings. Old habit. Don’t ask.', mood: 'soft' },
  ]),
  S('t-stray-returned', [
    { who: 'narrator', text: 'Something grey is sitting at the very edge of the Grove, in the long grass, not coming in.' },
    { who: 'narrator', text: 'Watching the gate. Watching you.' },
    { who: 'narrator', text: 'You want to run to it. Every part of you wants to run to it.' },
    { who: 'narrator', text: 'Rule three, in her leaning hand: when you don’t know what to do, sit down next to them and wait.' },
    { who: 'narrator', text: 'So you don’t run. You set a plum in the grass. Then a second plum, in case the first was the wrong size.' },
    { who: 'narrator', text: 'Then you sit down a little way off.' },
    { who: 'narrator', text: 'It looks at the fruit.', mood: 'soft' },
    { who: 'narrator', text: 'Then at you. It doesn’t leave.' },
  ]),
  S('t-sable-bonded', [
    { who: 'narrator', text: 'Sable climbs into your lap. All the way in.' },
    { who: 'narrator', text: 'She is grey and she is heavy and she is warm, and the ball above her head is a small dark heart.' },
    { who: 'narrator', text: 'She turns round twice, the way they do, and lies down, and lets out a breath she seems to have been holding since winter.' },
    {
      who: 'luna',
      text: 'There. That’s the thing nobody in a hurry ever gets to see. Grey and loved. Both at once.',
      mood: 'soft',
    },
    { who: 'narrator', text: 'You don’t move for a long time.' },
    { who: 'narrator', text: 'You are sitting down next to her, and waiting. You have been for weeks.' },
  ]),
  S('t-moss-first-pet', [
    { who: 'narrator', text: 'You put your hand on his head. He is dry and soft, like moss on a warm wall, and lighter than he looks.' },
    { who: 'moss', text: 'Careful. I am very old and I bruise like fruit.' },
    { who: 'narrator', text: 'You start to take your hand away.' },
    { who: 'moss', text: '…No, don’t stop.', mood: 'soft' },
    { who: 'moss', text: 'She did that every evening for forty years. You don’t notice a thing like that until it stops.', mood: 'soft' },
  ]),
  S('t-moss-first-pet-early', [
    { who: 'narrator', text: 'The old grey one on the hill doesn’t move away when you come close. He doesn’t move at all.' },
    { who: 'narrator', text: 'You put your hand on his head. He is dry and soft, like moss on a warm wall.' },
    { who: 'narrator', text: 'For a moment, nothing. Then, very slightly, he leans into your palm, the way a plant leans towards a window.' },
    { who: 'narrator', text: 'A small tuft of grass is growing on top of his head. You decide not to mention it.' },
    { who: 'narrator', text: 'When you look back from the bottom of the hill, he is watching you go.' },
  ]),
  S('t-talk-generic', [
    { who: 'narrator', text: 'A nod, a few words about the weather, and a short argument about whose Nubbin ate whose hat. It helps.' },
  ]),
];

/**
 * t-talk-generic's line and its two rotations (review SR-20261026-1055): whatever plays the scene picks one, seeded,
 * never the same twice running. Index 0 is the scene's own line.
 */
export const T_TALK_GENERIC_ROTATION: string[] = [
  'A nod, a few words about the weather, and a short argument about whose Nubbin ate whose hat. It helps.',
  'A nod, a few words about the weather, and a short argument about whose Nubbin is sitting on whose boot. Neither of you moves it. It helps.',
  'A nod, a few words about the weather, and a long story about a hat. The hat is fine now. It helps.',
];

export const BOOK1_FLAGS: string[] = [
  'corvinOffer', // c2-corvin: refused | sold | considered (existing)
  'soldNubbin', // c2-corvin sell (existing; read by endingFor)
  'sableFirst', // c3-open: slow | grab (existing)
  'sableTrustBonus', // c3-open: +6 | -8, applied to Sable by applyChoice (existing)
  'mossPetted', // set by the sim on any pet of Moss; picks t-moss-first-pet vs -early (existing)
  'c4-lamps', // set c4-open: remember | home | together | dunno; read: a one-line payoff in c10-dawn (sim/choice-payoffs.ts)
];

export const BOOK1_NOTES: Record<string, string> = {
  'c1-letter':
    'Chapter 1 opening, on arrival. Unchanged id. Hazel is missing, not dead: Fern confirms there is no new flower. Seeds: the grey watcher on the hill (Moss, revealed c4-open), the long-grass post (the eggs hum beside it), Hazel’s leaning handwriting (her illness, ch8), the dated eggshells on the sill (her hatch register, S6), the one cup turned upside down (paid off in c11-gate). Ends on a flavour choice with Fern (stone | need | eggs): Fern friendship only, no flags. Fern’s stone recurs in end-epi-secret.',
  'c1-close':
    'Chapter 1 closing after firstHatch. Sparks lights the posts at dusk: three light, the Long-Grass lantern only flickers (verbatim “Never has, not properly…”). Comic beat: the new Nubbin sneezes a spark at Sparks. Seeds the chill by the fourth post and Hazel standing by it “like she was waiting for someone to knock”. Art: if possible, render the fourth lantern flickering from here on until ch10 dawn.',
  'c2-open': 'Chapter 2 opening. Marina (who taught Hazel’s Nubbins to swim) and Sparks teach hand-feeding; your Nubbin takes the plum and then Sparks’s thumb (“Rule four. Don’t be Sparks.”). Marina’s grey-coat warning sets up c2-corvin. Fern’s pie note in c9-close calls back Marina’s “Then, for pity’s sake, feed yourself.”',
  'c2-corvin':
    'Chapter 2 closing after feedTwice. Choice ids/sets/friendship unchanged (refuse | sell | consider), so applyChoice’s sell side effect still works. Seeds: the gate swings for Corvin unbidden, his cold hand, his hand on his breast pocket (the shard, ch9), frost on the top rail where his hand rested (shown in all three branches).',
  'c3-open':
    'Chapter 3 opening, at night, after Sable spawns. Choice ids/sets unchanged (slow | grab), so applyChoice’s sableTrustBonus and grab relocation still work. Seed: Sable came down the valley road, cold all through. Comic beat: Fern’s kitchen light, on and off.',
  'c3-close':
    'Chapter 3 closing after sableTrust20. Clover’s verbatim line. Next morning: frost in a ring where Sable slept (early summer; the shard’s cold on her, unexplained). Opens S2: six plums gone, and Luna says it wasn’t Sable (Wisp; the plum stones left on the sun-warmed wall hint at his love of warm things). Ends on a question the player answers: Clover (bring her in, knit a blanket) vs Luna (her own time). Choices side-luna | side-clover | side-both change Clover/Luna friendship only, no flags; in every branch Clover knits the grey blanket (paid off in c7-close and end-long-road).',
  'c4-open':
    'Chapter 4 opening. Moss speaks for the first time (the grey watcher from c1). He says Hazel went to the Hollow and asks you not to follow yet. Ends on a question the player answers: what are the lanterns for? (lamps-remember | lamps-home | lamps-together | lamps-dunno; sets c4-lamps, no friendship). Every branch invites the pet the goal needs in its own words and ends on its own beat: remember, the pond lantern first; home, the long-grass post last; together, your Nubbin shuffles closer; dunno, Moss’s reputation. c4-lamps is for a one-line payoff in c10-dawn. Moss stays on the western hill in the sim; the text has him at the flat stone halfway up.',
  'c4-close':
    'Chapter 4 closing after lanternsAndMoss: Lantern Night. Keepers gather in two knots (S3 Sun/Moon feud seed). Fern’s lantern buns that never come out (paid off in c12-open and end-epi-told). Byte’s shoelace. The whole Lantern Song as written, one couplet or chorus per line, mood soft: Luna sings the first line alone, then speaker chorus (everyone; declared in BOOK3_SPEAKERS) has the rest. UI may italicise chorus lines and show no portrait; the voice-over treats them as one music cue, not voiced lines. SIM: queue c4-tale, c4-tale-2, c4-tale-3 and c4-out immediately after c4-close, in that order, before c5-open (e.g. a NEXT_SCENE map, or queue all five when the goal is met; the chapter should advance only once c4-out is seen).',
  'c4-tale':
    'The Tale of the Four, part 1 (the Spring Age, Eternals). Plays right after c4-close. Question choices set no flags; each choice just plays its then-lines. ask-loved: the girl with the bucket died long before the hill had flowers; Moss planted hers beside Briar’s, which is the first (bible, settled details). The line says “the first flower” without naming Briar, who is introduced in c4-tale-2. Never make any flower older than Briar’s.',
  'c4-tale-2':
    'The Tale, part 2 (the Four Wardens, the White Year, the Heartstone). Plays after c4-tale. The rhyme choice has the player recite Cinder’s rhyme as written. No flags.',
  'c4-tale-3':
    'The Tale, part 3 (the Breaking, the four posts, the Long Peace, Moss choosing Hazel). Moss stops before the theft and will not say where the fourth shard went. “Twenty-two, with nothing but months” deliberately foreshadows Corvin’s ch9 line. No flags.',
  'c4-out':
    'Last scene of chapter 4, after c4-tale-3. The Long-Grass lantern flickers and goes out; Moss: “Twenty-two years.” Sparks, asleep, wakes to say “I didn’t touch it” (paid off in c10-dawn). Frost on its glass at dawn. Ends with Moss asking to be carried round the posts (opens S1) and Sable watching the dark post (she is the future bearer). Opens S1 and S3. SIM: after this scene, the fourth lantern renders dark (or flickering) until ch10 dawn.',
  't-first-shadow':
    'Triggered when any Nubbin other than Sable turns Shadow, any chapter. Spoken by Fern (met in ch1) rather than Luna, so it works before ch3.',
  't-ran-away': 'Triggered on ranAway, any chapter. Fern; her last line is a quiet S3/S8 seed (she lost Bramble).',
  't-stray-returned': 'Triggered on strayReturned, any chapter. No NPC: the letter’s rule three, so it works in any chapter.',
  't-sable-bonded': 'Triggered when Sable bonds. Luna’s line no longer names the Circuit, so it works if bonding comes before ch5/ch7.',
  't-moss-first-pet':
    'First pet of Moss in chapter 4 or later (he speaks). SIM: in noteCampaign, queue this only when c.chapter >= 4; otherwise queue t-moss-first-pet-early. Both may each play once, so a player who petted Moss early still hears him speak the first time after c4-open.',
  't-moss-first-pet-early':
    'NEW. First pet of Moss in chapters 1–3, before he has spoken (c4-open is his first word). Narrator only; he leans into your hand and watches you go.',
  't-talk-generic': 'Fallback when talking to a Keeper with nothing chapter-specific to say. One line, chapter-neutral, rotated (seeded, never twice running) with T_TALK_GENERIC_ROTATION.',
};
