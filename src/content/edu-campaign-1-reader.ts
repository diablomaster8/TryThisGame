/**
 * The Learning Grove, reader band (ages 7–10): Book One, The Letter (chapters 1–4),
 * plus the global triggered scenes (t-*).
 * Replaces each scene in campaign-book1.ts by id (`reader:c1-letter` replaces `c1-letter`).
 * Every choice id, `set` and `friendship` is kept exactly as in the main script.
 * See EDU-STYLE.md (reader craft) and briefs/story-bible.md (canon).
 */
import type { EduCampaign, EduScene, GlossaryEntry } from './types';

// ---------------------------------------------------------------- chapter 1: The Letter
const CH1: EduScene[] = [
  {
    id: 'reader:c1-letter',
    of: 'c1-letter',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Late spring. The road runs out at a gate. It is stuck. You lift and push, the way she taught you, and it groans like a friend who missed arguing.' },
      { who: 'narrator', text: 'The Grove is overgrown: grass to your knees, reeds across the pond. On the signpost, under a stone, is a letter in Gran’s leaning writing.' },
      { who: 'narrator', text: 'The cottage door is on the latch. One cup sits by the cold kettle, turned upside down, ready for whoever comes next.' },
      { who: 'narrator', text: 'You sit on the step, where she used to sit, and open the letter.' },
      { who: 'hazel', text: '“If you’re reading this, I’ve gone up the hill and I’m not coming down for a while. Don’t be dramatic about it.”', mood: 'soft' },
      { who: 'narrator', text: 'Up the hill is where the flowers are. Each flower is for someone who has died. Everyone in the valley knows that.' },
      { who: 'hazel', text: '“There are two eggs in the long grass. They were waiting for someone with warm hands. That’s you.”', mood: 'soft' },
      { who: 'hazel', text: '“Rules. One: feed them before you feed yourself. Two: never, ever throw one. Three: when you don’t know what to do, sit down next to them and wait.”' },
      { who: 'hazel', text: '“Love, Gran. P.S. The gate sticks. Lift and push.”', mood: 'happy' },
      { who: 'narrator', text: 'You laugh. It comes out the wrong shape.' },
      { who: 'narrator', text: 'Something small and grey watches from the top of the western hill, very still, and does not come down.' },
      { who: 'fern', text: 'Hello? Oh! You’re Hazel’s. You’ve got her chin. I’m Fern, from next door. I’ve been keeping the trees alive, badly.', mood: 'happy' },
      { who: 'you', text: 'Is she…?' },
      { who: 'fern', text: 'No. Not up there, not the way people mean. I look at the flowers every week. There isn’t a new one. I’d know.', mood: 'soft' },
      { who: 'fern', text: 'She went off at the end of the winter, with a big coat and a bag of fruit. Said she had some feeding to do.' },
      { who: 'fern', text: 'I put that stone on the letter so it wouldn’t blow away. I’m very proud of the stone. And hear that hum? Your eggs.', mood: 'happy' },
    ],
    choices: [
      {
        id: 'stone',
        label: 'It’s a very good stone.',
        friendship: { fern: 2 },
        then: [
          { who: 'fern', text: 'Thank you! Nobody ever mentions the stone.', mood: 'happy' },
          { who: 'fern', text: 'It’s from the stream. I tried four stones. This one had the right sort of face.' },
          { who: 'narrator', text: 'You go to find the eggs. Behind you, Fern pats the stone, the way you’d pat a dog that has done well.' },
        ],
      },
      {
        id: 'need',
        label: 'What do you need from me?',
        friendship: { fern: 1 },
        then: [
          { who: 'fern', text: 'Oh, loads. A ladder. Someone to hold the ladder. Someone to tell me the pear tree isn’t my fault.', mood: 'think' },
          { who: 'fern', text: 'The pear tree is a bit my fault.' },
          { who: 'narrator', text: 'You go to find the eggs. Fern goes to look at the pear tree, guiltily, from a distance.' },
        ],
      },
      {
        id: 'eggs',
        label: 'Say nothing. Go to the eggs.',
        then: [
          { who: 'fern', text: 'Straight to work, without a word. Oh, you’re definitely hers.', mood: 'soft' },
          { who: 'narrator', text: 'The long grass closes round your knees, warm and loud with crickets. The humming gets nearer.' },
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c1-letter-l1',
        domain: 'sel',
        skill: 'notice that you can feel two feelings at once',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 9,
        prompt: [
          { who: 'narrator', text: 'Gran’s joke makes you laugh. But you miss her, too. That’s why the laugh comes out the wrong shape.' },
          { who: 'narrator', text: 'Can a person feel happy and sad at the very same time?' },
        ],
        options: [
          {
            label: 'Yes. Both at once.',
            reply: [
              { who: 'narrator', text: 'Gran would agree with you, and be smug about it. A funny memory of someone you miss can be warm and sore together.' },
              { who: 'narrator', text: 'Feelings don’t have to take turns. Both are allowed.' },
            ],
          },
          {
            label: 'No. One feeling has to win.',
            reply: [
              { who: 'narrator', text: 'That’s a fair way to see it. Sometimes one feeling is so big it squashes the other one flat.' },
              { who: 'narrator', text: 'Hazel might say the laugh won this time, and the sad waited its turn. Both are allowed.' },
            ],
          },
          {
            label: 'I’m not sure.',
            reply: [
              { who: 'narrator', text: 'Not being sure is honest. Feelings can be muddly, like a drawer of odd socks.' },
              { who: 'narrator', text: 'You don’t have to sort them out right now. Both are allowed.' },
            ],
          },
        ],
        parentNote: 'Your child thought about mixed feelings: how missing someone and laughing at their joke can happen together.',
      },
      {
        id: 'reader:c1-letter-l2',
        domain: 'literacy',
        skill: 'use clues in a story to work out what is true',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 13,
        prompt: [
          { who: 'narrator', text: 'Gran’s letter said “up the hill”. That made you worry. But Fern is sure Gran hasn’t died.' },
          { who: 'narrator', text: 'What is Fern’s best clue?' },
        ],
        options: [
          {
            label: 'There’s no new flower on the hill.',
            best: true,
            reply: [
              { who: 'fern', text: 'Exactly. Every flower up there is for someone. I check every week. No new one means no new goodbye.', mood: 'soft' },
            ],
          },
          {
            label: 'Gran wrote a letter.',
            reply: [
              { who: 'narrator', text: 'Good thinking: the letter proves Gran was fine when she wrote it. But that might have been months ago.' },
              { who: 'fern', text: 'The flowers are my proof. I check every week, and there isn’t a new one.', mood: 'soft' },
            ],
          },
          {
            label: 'Fern has a very good stone.',
            reply: [
              { who: 'fern', text: 'I do! But the stone doesn’t know anything about Hazel, sadly.', mood: 'happy' },
              { who: 'fern', text: 'My real clue is the hill. I check the flowers every week. There’s no new one.', mood: 'soft' },
            ],
          },
        ],
        parentNote: 'Your child used evidence from the story (no new memorial flower) to work out what a character knows, a key reading-for-meaning skill.',
      },
    ],
  },
  {
    id: 'reader:c1-close',
    of: 'c1-close',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'It is warm. Small and damp and warmer than anything has a right to be. Bits of shell sit on its head like a hat.' },
      { who: 'narrator', text: 'It looks at your hand for a long time. Then it leans into it, all the way. Neither of you moves for a while.' },
      { who: 'sparks', text: 'HEY. New Keeper. Don’t move. There’s a lantern post behind you and I’ve nearly fixed it.', mood: 'shock' },
      { who: 'narrator', text: 'Crackle. A small blue flash. The smell of burnt hair.' },
      { who: 'sparks', text: 'Fixed it. Mostly. The hair grows back. I’m Sparks. I run the fast ones. Is yours fast? It looks fast.', mood: 'happy' },
      { who: 'fern', text: 'It is three minutes old, Sparks.' },
      { who: 'sparks', text: 'Potential, Fern. I’m talking about potential.' },
      { who: 'narrator', text: 'Your Nubbin sneezes. A tiny blue spark jumps off its nose and fizzles out in the grass.' },
      { who: 'sparks', text: 'Did you SEE that? It’s caught it off me!', mood: 'happy' },
      { who: 'fern', text: 'That isn’t how anything works.' },
      { who: 'narrator', text: 'At dusk the lanterns come up one by one: the pond, the stream, the old wall. Gold on the water. Gold in the grass.' },
      { who: 'narrator', text: 'The fourth, out by the long grass, catches, sputters, and settles into a thin, shaky flicker.' },
      { who: 'sparks', text: 'Ugh. That one. New wick, new glass, new wiring. Three times.', mood: 'angry' },
      { who: 'sparks', text: 'Never has, not properly. Not since before my time.', mood: 'think' },
      { who: 'fern', text: 'Hazel used to stand out there some evenings, with it going like that. Like she was waiting for someone to knock.', mood: 'soft' },
      { who: 'narrator', text: 'Nobody says anything. The fourth lantern flickers. On the hill, the grey shape has moved one step down.' },
    ],
    lessons: [
      {
        id: 'reader:c1-close-l1',
        domain: 'science',
        skill: 'a simple circuit needs a complete loop',
        standard: '4-PS3-2',
        kind: 'ask',
        after: 4,
        prompt: [
          { who: 'sparks', text: 'Want to know the secret of lantern wiring? Electricity only travels round a loop.' },
          { who: 'sparks', text: 'Out of the battery, along a wire, through the lamp, and back to the battery. Which lamp lights up?' },
        ],
        options: [
          {
            label: 'The one where the wire goes all the way round.',
            best: true,
            reply: [
              { who: 'sparks', text: 'YES. A complete loop. Round and round it goes, and the lamp glows. That loop is called a circuit.', mood: 'happy' },
            ],
          },
          {
            label: 'The one with a gap in the wire.',
            reply: [
              { who: 'sparks', text: 'Nope! A gap is like a broken bridge. The electricity can’t get across, so the lamp stays dark.' },
              { who: 'sparks', text: 'Close the gap, make a full loop, and it lights. That loop is called a circuit.' },
            ],
          },
          {
            label: 'The one with the most wire.',
            reply: [
              { who: 'sparks', text: 'Ha, I wish. Extra wire doesn’t help if there’s a gap anywhere.' },
              { who: 'sparks', text: 'It just needs one complete loop with no breaks. That loop is called a circuit.' },
            ],
          },
        ],
        parentNote: 'Your child learned that electricity flows only round a complete loop (a closed circuit), and that one gap stops a lamp lighting.',
      },
      {
        id: 'reader:c1-close-l2',
        domain: 'maths',
        skill: 'unit fractions: one quarter',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 11,
        prompt: [
          { who: 'fern', text: 'Four lanterns, and one of them won’t behave. What fraction of the lanterns is flickering?' },
        ],
        options: [
          {
            label: 'One quarter (1/4)',
            best: true,
            reply: [
              { who: 'fern', text: 'Yes. One out of four is a quarter. So three quarters are lit, and one quarter is sulking.', mood: 'happy' },
            ],
          },
          {
            label: 'One half (1/2)',
            reply: [
              { who: 'fern', text: 'Half would be two out of the four. Only one is flickering.' },
              { who: 'fern', text: 'One out of four equal parts is one quarter: 1/4.' },
            ],
          },
          {
            label: 'One third (1/3)',
            reply: [
              { who: 'fern', text: 'Thirds are for things split into three. We’ve got four lanterns, so we need quarters.' },
              { who: 'fern', text: 'One out of four is one quarter: 1/4.' },
            ],
          },
        ],
        parentNote: 'Your child named a unit fraction (1/4) from a real group of four lanterns.',
      },
    ],
  },
];

// ---------------------------------------------------------------- chapter 2: Shells and Promises
const CH2: EduScene[] = [
  {
    id: 'reader:c2-open',
    of: 'c2-open',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Morning. Mist on the pond. Your Nubbin is asleep on your foot, which is a problem, because you need the foot.' },
      { who: 'narrator', text: 'A woman comes up the lane smelling of salt and seaweed. Her bucket slops at every step, and her sleeves are stiff with brine.' },
      { who: 'marina', text: 'Morning. Marina. I keep the tide pools past the ridge. Hazel traded me fruit for swimming lessons. For the Nubbins, not for her.', mood: 'happy' },
      { who: 'marina', text: 'You’ve not eaten. Don’t argue, you’ve got the look. What’s rule one?', mood: 'think' },
      { who: 'you', text: 'Feed them before you feed yourself.' },
      { who: 'marina', text: 'That’s the one. Then, for pity’s sake, feed yourself. She never did that bit either.' },
      { who: 'marina', text: 'A Nubbin fed by your hand remembers the hand. That matters more than people think.' },
      { who: 'sparks', text: 'Are we doing hand-feeding? I’m GREAT at hand-feeding. Flat palm. Fruit in the middle. Fingers FLAT.', mood: 'happy' },
      { who: 'marina', text: 'Don’t push it at them. Hold still. Let them come the last bit. The last bit is theirs.' },
      { who: 'narrator', text: 'Your Nubbin comes the last bit. It takes the plum very politely. Then it takes Sparks’s thumb, very politely, and holds on.' },
      { who: 'sparks', text: 'FLAT. I said FLAT. I didn’t do it FLAT.', mood: 'shock' },
      { who: 'marina', text: 'Rule four. Don’t be Sparks.', mood: 'happy' },
      {
        who: 'marina',
        text: 'Hazel owes me a bag of plums. Hazel never leaves a debt unpaid, so I’m not worried.',
        mood: 'soft',
      },
      {
        who: 'marina',
        text: 'Oh, and if a man in a grey coat comes by talking about “investment”, don’t sell him anything. Not fruit. Not eggs. Nothing.',
        mood: 'think',
      },
      {
        who: 'sparks',
        text: 'Corvin. Runs the Circuit, up the valley. His lot win everything. So fast. So quiet. I like the ones that yell.',
        mood: 'think',
      },
      {
        who: 'narrator',
        text: 'Marina looks up the valley the way you’d look at bad weather coming.',
      },
    ],
    lessons: [
      {
        id: 'reader:c2-open-l1',
        domain: 'sel',
        skill: 'let an animal choose to come to you',
        standard: 'CASEL: Social awareness',
        kind: 'do',
        after: 8,
        check: 'edu:hold:palm:flat',
        lines: [
          { who: 'marina', text: 'Your turn. Plum in the middle, palm flat, and keep still. No pushing.' },
          { who: 'marina', text: 'Coming to you has to be its own idea. That’s how trust starts, with Nubbins and with people.', mood: 'soft' },
        ],
        parentNote: 'Your child practised patience and respect for an animal’s choice: holding still and letting it come to them.',
      },
      {
        id: 'reader:c2-open-l2',
        domain: 'maths',
        skill: 'multiplication as equal groups',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 12,
        prompt: [
          {
            who: 'marina',
            text: 'Three swimming lessons last spring, at four plums a lesson. So how many plums does Hazel owe me?',
            mood: 'think',
          },
        ],
        options: [
          {
            label: '12 plums',
            best: true,
            reply: [
              { who: 'marina', text: 'Twelve. Three lots of four: 4, 8, 12. At the market a plum is 2 Shells, so that’s 24 Shells.', mood: 'happy' },
              { who: 'marina', text: 'I’d still rather have the plums.' },
            ],
          },
          {
            label: '7 plums',
            reply: [
              { who: 'marina', text: 'That’s three add four. But it’s three lessons with four plums each: three lots of four.' },
              { who: 'marina', text: 'Count them in fours: 4, 8, 12. Twelve plums.' },
            ],
          },
          {
            label: '16 plums',
            reply: [
              { who: 'marina', text: 'That would be four lessons. She only had three. Don’t give her ideas.', mood: 'happy' },
              { who: 'marina', text: 'Three lots of four: 4, 8, 12. Twelve plums.' },
            ],
          },
        ],
        parentNote: 'Your child solved a multiplication word problem as equal groups (3 × 4 = 12) and heard it turned into Shells (12 × 2 = 24).',
      },
    ],
  },
  {
    id: 'reader:c2-corvin',
    of: 'c2-corvin',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Late afternoon. The light has gone long and yellow. Someone is standing at the gate.' },
      { who: 'narrator', text: 'A man in a grey coat. He doesn’t lift. He doesn’t push. He rests one hand on the top rail, and waits.' },
      { who: 'narrator', text: 'The gate swings open for him, smoothly, without a sound. It has never once done that for you.' },
      { who: 'corvin', text: 'Hazel’s heir. You have her stubborn little chin. Corvin Vale. I run the Circuit, up the valley. The real races.' },
      { who: 'narrator', text: 'He offers his hand. You take it. It is cold. Not cool: cold, like a stone lifted out of a winter stream.' },
      { who: 'corvin', text: 'I knew your grandmother well. I was her student, once. We disagreed about methods. She thought love was a method.', mood: 'think' },
      { who: 'narrator', text: 'He looks up the hill, to where the flowers are. Only for a moment.' },
      { who: 'corvin', text: 'Is there one for her? Up there.' },
      { who: 'you', text: 'No.' },
      { who: 'corvin', text: 'No. There wouldn’t be. She’d want to argue with it first.', mood: 'soft' },
      { who: 'narrator', text: 'His hand goes to his coat, to the breast pocket, and rests there. You don’t think he knows he does it.' },
      { who: 'corvin', text: 'Your young one there. Good bones. I will give you two hundred Shells for it, right now. It will eat better with me than here.' },
      { who: 'narrator', text: 'Your Nubbin has gone very still behind your legs.' },
    ],
    choices: [
      {
        id: 'refuse',
        label: 'No. They’re not for sale.',
        set: { corvinOffer: 'refused' },
        friendship: { marina: 2, ember: 2 },
        then: [
          { who: 'corvin', text: 'Of course. Her chin. The offer stands. Everyone sells eventually, when things get hard. Things always get hard.' },
          { who: 'narrator', text: 'He goes, and the gate swings shut behind him all by itself.' },
          { who: 'narrator', text: 'On the top rail, where his hand rested, there is a thin grey bloom of frost. You watch it until it melts away.' },
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
          { who: 'narrator', text: 'He lifts your Nubbin by the scruff, not roughly, but not gently either. It looks back at you all the way to the gate.' },
          { who: 'narrator', text: 'It does not make a sound. The gate swings shut behind them. On the top rail, a thin grey bloom of frost.' },
          { who: 'narrator', text: 'Two hundred Shells sit in your hand. They are very heavy for something so small.' },
          { who: 'narrator', text: 'Rule two said never throw one. It didn’t say anything about this. It didn’t think it needed to.' },
          { who: 'narrator', text: 'You have the Shells now. You don’t have your friend. You can feel exactly what the swap cost.', mood: 'sad' },
        ],
      },
      {
        id: 'consider',
        label: 'Let me think about it.',
        set: { corvinOffer: 'considered' },
        friendship: { marina: -1 },
        then: [
          { who: 'corvin', text: 'Think. I like a Keeper who thinks. I’ll be at the Circuit when you’ve finished.' },
          { who: 'narrator', text: 'The gate swings shut behind him on its own. On the top rail, a thin grey bloom of frost, thinning as you watch.' },
          { who: 'narrator', text: 'Your Nubbin comes out from behind your legs slowly, and doesn’t quite look at you.' },
          { who: 'narrator', text: 'It heard you say you’d think about selling it. It understood more than you’d hoped.', mood: 'sad' },
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c2-corvin-l1',
        domain: 'literacy',
        skill: 'find clues about a character',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 10,
        prompt: [
          { who: 'narrator', text: 'Marina warned you about a man in a grey coat. Good readers, like good detectives, notice what doesn’t fit.' },
          { who: 'narrator', text: 'Which of these is a clue that something about Corvin is strange?' },
        ],
        options: [
          {
            label: 'The stuck gate opened for him by itself.',
            best: true,
            reply: [
              { who: 'narrator', text: 'Sharp eyes. That gate has never opened for anyone without a lift and a push. Remember that.' },
              { who: 'narrator', text: 'There’s a second clue, too: his hand is icy on a warm afternoon.' },
            ],
          },
          {
            label: 'His hand is as cold as a winter stream.',
            reply: [
              { who: 'narrator', text: 'Good clue. It’s a warm afternoon, and his hand is icy. Writers put clues like that in on purpose.' },
              { who: 'narrator', text: 'The strangest one of all: the stuck gate opened for him by itself.' },
            ],
          },
          {
            label: 'He wears a grey coat.',
            reply: [
              { who: 'narrator', text: 'Lots of people wear coats, so that’s not much of a clue on its own.' },
              { who: 'narrator', text: 'Stranger things: the stuck gate opened by itself, and his hand is icy on a warm day. Keep watching him.' },
            ],
          },
        ],
        parentNote: 'Your child picked out story clues that reveal something about a character before the story says it outright.',
      },
      {
        id: 'reader:c2-corvin-l2',
        domain: 'social-studies',
        skill: 'think about choices, and what money can and can’t buy',
        standard: 'D2.Eco.1.K-2',
        kind: 'ask',
        after: 12,
        prompt: [
          { who: 'narrator', text: 'Two hundred Shells is a lot. At 2 Shells a plum, it would buy a hundred plums.' },
          { who: 'narrator', text: 'Before you answer him, think: is there anything Shells can’t buy?' },
        ],
        options: [
          {
            label: 'A friend who trusts you.',
            reply: [
              { who: 'narrator', text: 'That’s a thoughtful answer. Trust is earned slowly, plum by plum. Nobody can sell it to you.' },
            ],
          },
          {
            label: 'Feeling safe at home.',
            reply: [
              { who: 'narrator', text: 'That’s a thoughtful answer. Look behind your legs. That small, still Nubbin is thinking about the same thing.' },
            ],
          },
          {
            label: 'Honestly, Shells can buy most things.',
            reply: [
              { who: 'narrator', text: 'That’s an honest answer, and plenty of grown-ups would agree. Shells buy plums, ladders and lantern glass.' },
              { who: 'narrator', text: 'Hazel would ask one more question: could they buy back the way your Nubbin leans on you?' },
            ],
          },
        ],
        parentNote: 'Your child weighed a hard choice about money and value, with no single right answer, before deciding in the story.',
      },
    ],
  },
];

// ---------------------------------------------------------------- chapter 3: The One Who Hides
const CH3: EduScene[] = [
  {
    id: 'reader:c3-open',
    of: 'c3-open',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Early summer. The evenings are long now, and smell of cut grass and warm stone.' },
      { who: 'narrator', text: 'You can’t sleep. You sit out on the step with a cup of tea gone cold, the way she used to.' },
      { who: 'narrator', text: 'Moths tap at the window behind you. In the reeds a frog says the same thing over and over, very sure of it.' },
      { who: 'narrator', text: 'Something is at the far edge of the Grove, half in the long grass.' },
      { who: 'narrator', text: 'A Nubbin, grey as ash. The little ball above its head is dark and still. One wing is held wrong. When you breathe, it flinches.' },
      { who: 'narrator', text: 'It is thin. You can count the ridges along its back. It watches your hands. Not your face. Your hands.' },
      { who: 'luna', text: 'Don’t. Not yet.', mood: 'soft' },
      { who: 'narrator', text: 'A woman leans over the wall, soil up to her elbows, a lamp turned down to almost nothing.' },
      { who: 'luna', text: 'Luna. I garden at night, so I see what comes in at night. She’s been here three evenings. She eats what I leave, and runs if I stand up.' },
      { who: 'narrator', text: 'Over the other wall, Fern’s kitchen light goes on. Then off. Then on again, as if someone is trying very hard not to look.' },
      { who: 'luna', text: 'She’s been doing that all week. She thinks it’s subtle.', mood: 'think' },
      { who: 'luna', text: 'Look at the wing. Somebody held that too tight. When I first got near her, she was cold all through, like a doorstep in January.', mood: 'sad' },
      { who: 'luna', text: 'She’s gone Shadow. That’s what happens when a Nubbin stops believing hands are safe. She’s just waiting for the next bad thing.' },
      { who: 'you', text: 'Can she get better?' },
      { who: 'luna', text: 'Not un-grey. Better, maybe. That’s a different question, and a much longer one. I’ve been calling her Sable. What will you do?', mood: 'think' },
      { who: 'narrator', text: 'You think of a letter, and three rules, and of how easy it would be just to reach out.' },
    ],
    choices: [
      {
        id: 'slow',
        label: 'Sit down. Put fruit on the ground. Wait.',
        set: { sableFirst: 'slow', sableTrustBonus: 6 },
        friendship: { luna: 4 },
        then: [
          { who: 'narrator', text: 'You sit. You put the fruit down. For a long time, nothing happens.' },
          { who: 'narrator', text: 'Then a small grey shape takes one step, and another, and eats, watching you the whole time.' },
          { who: 'narrator', text: 'Somewhere around the second plum, your legs go to sleep. You don’t move them.' },
          { who: 'luna', text: 'That’s the whole trick. That’s all of it. Hazel would have liked you.', mood: 'happy' },
        ],
      },
      {
        id: 'grab',
        label: 'Catch her before she runs again.',
        set: { sableFirst: 'grab', sableTrustBonus: -8 },
        friendship: { luna: -3 },
        then: [
          { who: 'narrator', text: 'You lunge. You get a wing. She screams, a sound you didn’t know they could make, twists free, and is gone into the dark.' },
          { who: 'narrator', text: 'Your hand is still shut on nothing. It is very cold.' },
          { who: 'luna', text: '…She’ll come back. They do. But you have made the next part much harder, for both of you.', mood: 'sad' },
          { who: 'narrator', text: 'She was already afraid of hands. Now she has one more reason to be.', mood: 'sad' },
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c3-open-l1',
        domain: 'literacy',
        skill: 'similes: comparing with “like” or “as”',
        standard: 'L.4.5',
        kind: 'ask',
        after: 11,
        prompt: [
          { who: 'narrator', text: 'Luna uses a simile: she compares one thing to another using “like”. It helps you feel it.' },
          { who: 'narrator', text: 'What does Luna compare Sable’s coldness to?' },
        ],
        options: [
          {
            label: 'A doorstep in January.',
            best: true,
            reply: [
              { who: 'narrator', text: 'Yes. A stone step on a winter morning, so cold it stings bare feet.' },
              { who: 'narrator', text: 'And it’s early summer now. That’s what makes it so strange.' },
            ],
          },
          {
            label: 'Ash from a fire.',
            reply: [
              { who: 'narrator', text: 'Good spot: “grey as ash” is a simile too, using “as”. But that one is about her colour.' },
              { who: 'narrator', text: 'The cold one is “like a doorstep in January”: winter-cold, in early summer.' },
            ],
          },
          {
            label: 'Your cold cup of tea.',
            reply: [
              { who: 'narrator', text: 'Your tea has gone cold, true! But Luna doesn’t mention it.' },
              { who: 'narrator', text: 'Her simile is “like a doorstep in January”: winter-cold, in early summer.' },
            ],
          },
        ],
        parentNote: 'Your child identified a simile and what it compares, and noticed a second simile (“grey as ash”) in the same scene.',
      },
      {
        id: 'reader:c3-open-l2',
        domain: 'sel',
        skill: 'empathy: work out why someone is scared',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 15,
        prompt: [
          { who: 'narrator', text: 'Before you choose, look again. Sable watches your hands, not your face. Why do you think she does that?' },
        ],
        options: [
          {
            label: 'Hands have hurt her before.',
            best: true,
            reply: [
              { who: 'luna', text: 'That’s it. Hands held her wing too tight. So hands are what she watches for.', mood: 'sad' },
            ],
          },
          {
            label: 'She’s hoping for food.',
            reply: [
              { who: 'luna', text: 'Maybe a little. She is hungry. But look how she flinches when you move.', mood: 'think' },
              { who: 'luna', text: 'Hands have hurt her before. That’s what she’s watching for.' },
            ],
          },
          {
            label: 'She likes hands.',
            reply: [
              { who: 'luna', text: 'I wish she did. One day she might.', mood: 'soft' },
              { who: 'luna', text: 'Right now, hands are what hurt her wing. That’s why she watches them.' },
            ],
          },
        ],
        parentNote: 'Your child read body language (watching hands, flinching) to understand why a character is frightened, before making a choice.',
      },
    ],
  },
  {
    id: 'reader:c3-close',
    of: 'c3-close',
    band: 'reader',
    lines: [
      {
        who: 'narrator',
        text: 'Days of it. Fruit on the ground. Sitting, not staring. Sable lets you within two steps now. She doesn’t run.',
      },
      {
        who: 'narrator',
        text: 'Out on the lane, some child is skipping to a rhyme you almost know. Badly.',
      },
      {
        who: 'clover',
        text: 'Oh, she’s letting you near! I’m Clover. I keep the gentle ones. Luna told me not to fuss, so I’ve been fussing quietly.',
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
      {
        who: 'narrator',
        text: 'Next morning, early, you go to see where Sable slept: a hollow in the long grass, the size of two cupped hands.',
      },
      {
        who: 'narrator',
        text: 'Around it, the grass is white with frost. Only there. Everywhere else, the dew is just dew.',
      },
      {
        who: 'clover',
        text: 'That’s odd. It’s early summer. It’s not nearly cold enough for frost.',
        mood: 'think',
      },
      { who: 'luna', text: 'It does that. Every morning, wherever she sleeps.', mood: 'think' },
      { who: 'narrator', text: 'When the sun reaches it, the frost melts back into dew. It leaves the grass a little flattened, a little grey.' },
      { who: 'narrator', text: 'And the fruit you left out is gone. All six plums. On the warm top of the wall sit six plum stones, licked clean.' },
      { who: 'luna', text: 'That wasn’t her. She hasn’t the appetite for six. Whoever ate them likes a warm seat.', mood: 'think' },
      { who: 'clover', text: 'Something’s stealing from her. Right. That settles it. I’m bringing her inside and knitting her a blanket.', mood: 'angry' },
      { who: 'luna', text: 'You are not. She’ll come in her own time, or she won’t. That’s hers to decide, not ours.' },
      { who: 'clover', text: 'She’s cold every single morning, Luna!' },
      { who: 'luna', text: 'She was cold before she met us. Grabbing her won’t make her warm. It’ll make her gone.' },
      { who: 'clover', text: 'Back me up.', mood: 'think' },
    ],
    choices: [
      {
        id: 'side-luna',
        label: 'Luna’s right. Her own time.',
        friendship: { luna: 2 },
        then: [
          { who: 'clover', text: 'Yes. I know. I hate it.', mood: 'sad' },
          { who: 'clover', text: 'I’ve already started the blanket, mind. I’ll just… leave it lying about. Near her. Accidentally.' },
          { who: 'luna', text: 'That’s allowed.', mood: 'soft' },
        ],
      },
      {
        id: 'side-clover',
        label: 'Clover’s right. Nobody should be cold alone.',
        friendship: { clover: 2 },
        then: [
          { who: 'clover', text: 'Thank you!', mood: 'happy' },
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
          { who: 'luna', text: 'Hm. That’s very Hazel.', mood: 'happy' },
          { who: 'clover', text: 'I’m doing it in grey. So she doesn’t feel she has to match.' },
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c3-close-l1',
        domain: 'science',
        skill: 'water freezes at 0 °C (32 °F); frost melts back into water',
        standard: '2-ESS2-3',
        kind: 'ask',
        after: 7,
        prompt: [
          { who: 'clover', text: 'Frost is just frozen water. And water only freezes when it gets cold enough. How cold is that?', mood: 'think' },
        ],
        options: [
          {
            label: '0 °C (32 °F)',
            best: true,
            reply: [
              { who: 'clover', text: 'Right: 0 °C, which is 32 °F. Colder than that, water turns to ice. Warmer, and ice melts back to water.' },
              { who: 'clover', text: 'An early-summer morning is much warmer than 0 °C (32 °F). So why is it frozen round her?', mood: 'think' },
            ],
          },
          {
            label: '10 °C (50 °F)',
            reply: [
              { who: 'clover', text: 'At 10 °C water is chilly, but still runny. It has to drop all the way to 0 °C (32 °F) to freeze.' },
              { who: 'clover', text: 'An early-summer morning is much warmer than that. So why is it frozen round her?', mood: 'think' },
            ],
          },
          {
            label: '100 °C (212 °F)',
            reply: [
              { who: 'clover', text: 'Ooh, other end! At 100 °C (212 °F) water boils. It freezes at 0 °C (32 °F).' },
              { who: 'clover', text: 'An early-summer morning is much warmer than that. So why is it frozen round her?', mood: 'think' },
            ],
          },
        ],
        parentNote: 'Your child learned that water freezes at 0 °C (32 °F) and that frost melts back into water when warmed, a change that can go both ways.',
      },
      {
        id: 'reader:c3-close-l2',
        domain: 'sel',
        skill: 'think about fairness to animals: who gets to decide?',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 15,
        prompt: [
          { who: 'narrator', text: 'Clover wants Sable warm. Luna wants Sable to choose. They both love her.' },
          { who: 'narrator', text: 'When we look after an animal, how much should it get a say?' },
        ],
        options: [
          {
            label: 'A lot. It’s her life.',
            reply: [
              { who: 'luna', text: 'That’s how I see it too. Things done to her went badly. Things she chooses might go better.', mood: 'soft' },
            ],
          },
          {
            label: 'Some, but Keepers sometimes have to decide.',
            reply: [
              { who: 'clover', text: 'Thank you. That’s a fair answer. If she were hurt or in danger, I’d want us to step in.' },
              { who: 'luna', text: 'Fair. But cold isn’t danger for her. It’s just her.', mood: 'think' },
            ],
          },
          {
            label: 'Keeping her warm matters most.',
            reply: [
              { who: 'clover', text: 'See? That’s a kind answer, and it’s mine too.', mood: 'happy' },
              { who: 'luna', text: 'It is kind. I only ask: warm for her, or warm so we feel better?', mood: 'think' },
            ],
          },
        ],
        parentNote: 'Your child weighed care against choice for an animal: a thinking question with no single right answer.',
      },
    ],
  },
];

// ---------------------------------------------------------------- chapter 4: Moss Remembers
const CH4: EduScene[] = [
  {
    id: 'reader:c4-open',
    of: 'c4-open',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'The grey shape has come down the hill as far as the flat stone halfway, and has sat there all morning.' },
      { who: 'narrator', text: 'You climb up and sit down next to him, because that is the rule. He is old. You can see it in how carefully he sits.' },
      { who: 'narrator', text: 'For a long time, nothing. A bee in the thyme. Wind going over the grass. Your Nubbin asleep against your shoe.' },
      { who: 'moss', text: '…You lift and push.', mood: 'think' },
      { who: 'narrator', text: 'The voice is small and dry. It comes from somewhere behind your ears rather than in front of them.' },
      { who: 'moss', text: 'Every morning. Most people climb over by the third day. You never once did.' },
      { who: 'moss', text: 'The old ones like me can speak a little, to Keepers who sit still long enough. Hazel sat still for forty years. You have managed one morning. Not bad.' },
      { who: 'moss', text: 'I am Moss. She will have told you I am stubborn. She was being kind.' },
      { who: 'you', text: 'Where is she?' },
      { who: 'moss', text: 'She didn’t vanish. Hazel doesn’t vanish. Hazel leaves notes.' },
      { who: 'moss', text: 'She went past the falls, into the Hollow, to find the ones that got lost. She said she’d be back for the lanterns.' },
      { who: 'moss', text: 'She has never missed a Lantern Night. Not in forty years. Not with a broken ankle. Not the year of the floods.' },
      { who: 'you', text: 'Then I’ll go and get her.' },
      { who: 'moss', text: 'Not yet. She asked me to tell you that. She said you would ask.', mood: 'soft' },
      { who: 'moss', text: 'Tonight is Lantern Night. Four posts. Light them all, and she might remember the way. I would like to see it, one more year.' },
      { who: 'moss', text: 'Tell me something. What do you think the lanterns are for? Not what you were told. What you think.', mood: 'think' },
    ],
    choices: [
      {
        id: 'lamps-remember',
        label: 'To remember the ones who’ve gone.',
        then: [
          { who: 'moss', text: 'Yes. That is the oldest answer, and a good one.' },
          { who: 'moss', text: 'The flowers on this hill would agree with you, if flowers bothered to agree with anyone.', mood: 'happy' },
          { who: 'moss', text: 'She used to rest her hand on my head while she counted them. You may, if you like.', mood: 'soft' },
          { who: 'moss', text: 'Light the pond lantern first tonight. That is where the first ones woke.' },
        ],
      },
      {
        id: 'lamps-home',
        label: 'So people can find their way home.',
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
        then: [
          { who: 'moss', text: 'Hm. Nobody has said that one before.', mood: 'think' },
          { who: 'moss', text: 'I shall have to think about it, and I think slowly. Ask me again in a year.' },
          { who: 'moss', text: 'Sit closer, meanwhile. You may put your hand on my head. Nobody has, since she went.', mood: 'soft' },
          { who: 'narrator', text: 'You shift closer. Your sleepy Nubbin shuffles after you, so nobody on this stone is on their own.' },
        ],
      },
      {
        id: 'lamps-dunno',
        label: 'Honestly? I don’t know.',
        then: [
          { who: 'moss', text: 'Good. Neither did I, for the first hundred years. Light them anyway. The knowing comes after.', mood: 'happy' },
          { who: 'moss', text: 'A hand on my head is a fine place to start not knowing. She always thought so.', mood: 'soft' },
          { who: 'moss', text: 'Don’t tell anyone I said so. I have a reputation.' },
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c4-open-l1',
        domain: 'science',
        skill: 'how bees pollinate flowers',
        standard: '2-LS2-2',
        kind: 'notice',
        after: 2,
        lines: [
          { who: 'narrator', text: 'The bee goes from flower to flower, drinking sweet nectar. Yellow dust called pollen sticks to its fuzzy body.' },
          { who: 'narrator', text: 'At the next flower, some pollen rubs off. That helps the plant make seeds. The bee gets lunch; the thyme gets babies.' },
        ],
        parentNote: 'Your child learned how bees carry pollen from flower to flower, which helps plants make seeds.',
      },
      {
        id: 'reader:c4-open-l2',
        domain: 'literacy',
        skill: 'understand what a character really means',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 7,
        prompt: [
          { who: 'narrator', text: 'Moss says Hazel called him stubborn, and that she was “being kind”. What does he really mean?' },
        ],
        options: [
          {
            label: 'He’s even more stubborn than she said.',
            best: true,
            reply: [
              { who: 'moss', text: 'Quite right. Far more. Ask the hill. It has been waiting for me to move for about three hundred years.', mood: 'happy' },
            ],
          },
          {
            label: 'He isn’t stubborn at all.',
            reply: [
              { who: 'narrator', text: 'Look again. If calling him stubborn was the kind version, the truth must be worse!' },
              { who: 'moss', text: 'Much worse. I am a joke that takes a long time to finish.', mood: 'happy' },
            ],
          },
          {
            label: 'Hazel was being mean.',
            reply: [
              { who: 'narrator', text: 'It sounds that way, but he says the opposite: she was being kind. So the truth must be even more stubborn.' },
              { who: 'moss', text: 'She was always kind about me. It was very annoying.', mood: 'happy' },
            ],
          },
        ],
        parentNote: 'Your child worked out the real meaning behind a character’s dry joke, reading for character and tone.',
      },
    ],
  },
  {
    id: 'reader:c4-close',
    of: 'c4-close',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Dusk. Pond, stream, old wall: three lanterns catch, soft as someone settling into a chair. The fourth, by the long grass, only flickers.' },
      { who: 'narrator', text: 'Then the Keepers come through the gate, lifting and pushing without thinking. They stand in two groups, one each side of the pond.' },
      { who: 'fern', text: 'Lantern buns. Hazel’s recipe. I make them every year, and every year they don’t come out.', mood: 'sad' },
      { who: 'narrator', text: 'Sparks bites one. It makes a sound like a dropped plate. “Crunchy!” she says, delighted.' },
      { who: 'narrator', text: 'A very old, sandstone-coloured Nubbin on the wall reaches out and taps a bun, twice. It rings like a plate.' },
      { who: 'sparks', text: 'SEE? Even the old one says crunchy!', mood: 'happy' },
      { who: 'fern', text: 'Tapping isn’t tasting.' },
      { who: 'pixel', text: 'Hi, I’m Pixel. I built the lantern timer. Sparks did the part that explodes. Can you really hear Moss? Byte says it’s a hoax.', mood: 'happy' },
      { who: 'byte', text: 'I said it was unverified. Nobody has checked it yet.' },
      { who: 'moss', text: 'Tell the pale one his shoelace is untied.' },
      { who: 'narrator', text: 'You tell Byte his shoelace is untied. Byte looks down. Byte goes very quiet.' },
      { who: 'byte', text: 'Anyone could have seen that.', mood: 'think' },
      { who: 'moss', text: 'Anyone didn’t.' },
      { who: 'luna', text: 'Hazel used to stand right there by the pond and not say anything. And somehow it was the best part.', mood: 'soft' },
      { who: 'narrator', text: 'Then Luna starts to sing, low. One by one, from both sides of the pond, the others join in.' },
      { who: 'luna', text: 'Light one for the pond where the first ones woke, light one for the stream and the laughing folk,', mood: 'soft' },
      { who: 'chorus', text: 'light one for the wall where the quiet ones keep, and one for the long grass, and the ones who sleep.', mood: 'soft' },
      { who: 'chorus', text: 'Slow hands, warm hearts, the gate stuck fast — what’s kept with love is kept to last.', mood: 'soft' },
      { who: 'narrator', text: 'Byte’s lips move. When it ends, the two groups have drifted closer. Everyone looks up the hill. Nobody comes down it.' },
    ],
    lessons: [
      {
        id: 'reader:c4-close-l1',
        domain: 'maths',
        skill: 'time intervals across midnight',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 7,
        prompt: [
          { who: 'pixel', text: 'My timer turns the lanterns on at 10 o’clock at night and off at 5 o’clock in the morning. How many hours is that?', mood: 'think' },
        ],
        options: [
          {
            label: '7 hours',
            best: true,
            reply: [
              { who: 'pixel', text: 'Yes! Count on from 10: 11, 12, 1, 2, 3, 4, 5. Seven hours. Byte checked it twice.', mood: 'happy' },
              { who: 'byte', text: 'Three times.' },
            ],
          },
          {
            label: '5 hours',
            reply: [
              { who: 'pixel', text: 'That’s 10 take away 5. But the clock goes round past midnight, so take-away doesn’t work here.' },
              { who: 'pixel', text: 'Count on instead: 11, 12, 1, 2, 3, 4, 5. Seven hours.' },
            ],
          },
          {
            label: '15 hours',
            reply: [
              { who: 'pixel', text: 'That’s 10 add 5. Then they’d still be burning at lunchtime! Sparks would love that.' },
              { who: 'pixel', text: 'Count the hours on from 10: 11, 12, 1, 2, 3, 4, 5. Seven hours.' },
            ],
          },
        ],
        parentNote: 'Your child worked out a time interval that crosses midnight by counting on in hours (10 pm to 5 am is 7 hours).',
      },
      {
        id: 'reader:c4-close-l2',
        domain: 'literacy',
        skill: 'repeated lines in songs and poems: the chorus',
        standard: 'RL.2.4',
        kind: 'ask',
        after: 17,
        prompt: [
          { who: 'narrator', text: 'The verses change, but one part comes back again and again so everyone can join in. That part is the chorus.' },
          { who: 'narrator', text: 'Which line is the chorus of the Lantern Song?' },
        ],
        options: [
          {
            label: '“Slow hands, warm hearts, the gate stuck fast…”',
            best: true,
            reply: [
              { who: 'narrator', text: 'Yes. It comes after every verse, the same each time. That’s why even Byte knows it.' },
              { who: 'narrator', text: 'The last verse ends: “we are made of the ones who remember us here, so we gather, we gather, we gather each year.”', mood: 'soft' },
            ],
          },
          {
            label: '“Light one for the pond where the first ones woke…”',
            reply: [
              {
                who: 'narrator',
                text: 'That’s how verse one begins. Verses tell new things each time.',
              },
              {
                who: 'narrator',
                text: 'The chorus comes back the same every time: “Slow hands, warm hearts, the gate stuck fast…”',
              },
            ],
          },
          {
            label: '“Crunchy!”',
            reply: [
              { who: 'sparks', text: 'It SHOULD be the chorus.', mood: 'happy' },
              {
                who: 'narrator',
                text: 'The real chorus comes back after every verse: “Slow hands, warm hearts, the gate stuck fast…”',
              },
            ],
          },
        ],
        parentNote: 'Your child identified the chorus of a song: repeated lines that give a poem its rhythm and let everyone join in.',
      },
    ],
  },
  {
    id: 'reader:c4-tale',
    of: 'c4-tale',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Late. Most of the Keepers have gone home. Sparks is asleep sitting up. Moss sits in the light of the pond lantern.' },
      { who: 'you', text: 'The song. “The old ones broke what the fierce one made.” What did they break?' },
      { who: 'moss', text: 'Ah. You were listening. Most people only sing it.' },
      { who: 'moss', text: 'Sit, then. It is an old story, and I am in it. That is the trouble with old stories, at my age. You are in all of them.' },
      { who: 'narrator', text: 'You sit. The pond lantern ticks as it warms.' },
      { who: 'moss', text: 'Before the Keepers, before the cottage, before the trees, there was the spring.' },
      { who: 'moss', text: 'Not the season. A spring of water. Behind the falls, in a cave of glittering rock, is a warm pool that has never once frozen.' },
      { who: 'moss', text: 'The first Nubbins came up out of it, each one a small light. Nobody made them. They came the way the first warm day comes.' },
      { who: 'moss', text: 'Lights fade, on their own. That is our word for dying. The little ones always have faded, in the end.', mood: 'soft' },
      { who: 'moss', text: 'But one that is loved enough stops fading. It stays. That is what Eternal means. Nothing grander.' },
      { who: 'narrator', text: 'Out by the long grass, the fourth lantern flickers.' },
    ],
    choices: [
      {
        id: 'ask-loved',
        label: 'Who loved you enough?',
        then: [
          { who: 'moss', text: 'A girl with a bucket. She used to carry me about in it. I was very small and very cross.', mood: 'soft' },
          { who: 'moss', text: 'She died long ago, before there were any flowers on the hill at all.' },
          { who: 'moss', text: 'When the first flower came up by the big stone, I planted one for her right beside it. Now I go and sit with them both.', mood: 'soft' },
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
    lessons: [
      {
        id: 'reader:c4-tale-l1',
        domain: 'social-studies',
        skill: 'oral history: how stories carry the past',
        standard: 'D2.His.2.K-2',
        kind: 'ask',
        after: 3,
        prompt: [
          { who: 'moss', text: 'Nobody wrote this story in a book. And yet here it is, older than the trees. How do you think it lasted?', mood: 'think' },
        ],
        options: [
          {
            label: 'People told it to their children, who told theirs.',
            best: true,
            reply: [
              { who: 'moss', text: 'Just so. Grown-up to child, over and over. That is called oral history: history kept by telling.' },
              { who: 'moss', text: 'It passes like a flame from wick to wick. Songs help too. The Lantern Song is a history, hiding in a tune.', mood: 'soft' },
            ],
          },
          {
            label: 'People turned it into songs and rhymes.',
            reply: [
              { who: 'moss', text: 'Clever. The Lantern Song you just sang is a history, hiding in a tune. Songs are easy to remember.', mood: 'happy' },
              { who: 'moss', text: 'And under every song is the telling, grown-up to child, over and over. That is oral history: history kept by telling.' },
            ],
          },
          {
            label: 'It just stayed the same by itself.',
            reply: [
              { who: 'moss', text: 'I wish it could. But a story with nobody to tell it is lost in one lifetime.' },
              { who: 'moss', text: 'It lasts because people pass it on, by talking and singing. That is called oral history.' },
            ],
          },
        ],
        parentNote: 'Your child learned about oral history: how stories, songs and rhymes carry the past from one generation to the next.',
      },
      {
        id: 'reader:c4-tale-l2',
        domain: 'science',
        skill: 'why some springs stay warm: heat from underground rock',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 6,
        lines: [
          { who: 'moss', text: 'Why warm? Deep under the ground, the rock is hot. Water that trickles down near it is warmed, and rises back up.' },
          { who: 'moss', text: 'Your people call that a hot spring. That is why some springs stay warm, even in the coldest winter.' },
        ],
        parentNote: 'Your child learned that hot springs are warmed by heat from rock deep underground.',
      },
    ],
  },
  {
    id: 'reader:c4-tale-2',
    of: 'c4-tale-2',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Against the wall, Sparks says “FLAT” in her sleep, and turns over.' },
      { who: 'moss', text: 'She is still teaching hand-feeding, even asleep. I admire it.' },
      { who: 'moss', text: 'Four of us kept this valley, once. Wardens, the Keepers called us later. We never called ourselves anything.' },
      { who: 'moss', text: 'Briar, who laughed. At rain, at foxes, at me. Mostly at me.' },
      { who: 'moss', text: 'Hush, who was quiet, and kept the griefs nobody else had room for.' },
      { who: 'moss', text: 'Cinder. …Cinder, who loved them hardest of all. She would have stood in a fire for any one of them.' },
      { who: 'moss', text: 'And me. I sat. Somebody has to.' },
      { who: 'moss', text: 'Then came the White Year.', mood: 'sad' },
      { who: 'moss', text: 'A winter that would not end. Snow where the spring should be. Snow at midsummer. The falls froze to the bottom.' },
      { who: 'moss', text: 'The little ones froze in the long grass, and died. We found them in the mornings. More each morning.' },
      { who: 'moss', text: 'Cinder could not bear it. She went behind the falls, to the rim of the warm spring, where even that had iced over.' },
      { who: 'moss', text: 'She broke off a shard of the ice, and of it she made a stone. The Heartstone.' },
      { who: 'moss', text: 'Whoever held it could gather every Nubbin’s will into one hand. All of them, moving as one, wherever the hand said.' },
      { who: 'moss', text: 'She led them out of the long grass and into shelter. Every one. Not one more was lost.' },
      { who: 'moss', text: 'It worked. I want you to understand that. It worked.' },
      { who: 'narrator', text: 'He is quiet so long that you think he may have finished.' },
      { who: 'moss', text: 'They came out of the winter alive. Grey, and still. Many never again moved of their own accord. They waited to be told.' },
      { who: 'moss', text: 'She made them safe by making them still.', mood: 'sad' },
    ],
    choices: [
      {
        id: 'ask-rhyme',
        label: 'Cinder… like the rhyme?',
        then: [
          { who: 'moss', text: 'You know it.' },
          { who: 'narrator', text: 'You do. Everyone does. You skipped to it in this very lane, and never once thought about the words.' },
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
          { who: 'moss', text: 'I have had a very long time to think about which of those is “saved”. I still have no tidy answer.', mood: 'think' },
          { who: 'moss', text: 'Be wary of anyone who has one.' },
        ],
      },
      {
        id: 'ask-briar',
        label: 'Tell me about Briar.',
        then: [
          { who: 'moss', text: 'She laughed at everything, even dying. Especially that. She said it was the one joke everyone gets in the end.', mood: 'happy' },
          { who: 'moss', text: 'Hers was the first flower on the hill. The yellow one by the big stone. It comes up early every year, as if it can’t wait.' },
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c4-tale-2-l1',
        domain: 'science',
        skill: 'ice floats, so water freezes from the top down',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 8,
        lines: [
          { who: 'narrator', text: 'Ice floats. So when ponds and rivers freeze, they freeze from the top down. Fish can live all winter in the water underneath.' },
          { who: 'narrator', text: 'For water to freeze right to the bottom, the cold must be fierce and last a very long time. That was the White Year.' },
        ],
        parentNote: 'Your child learned that ice floats, so ponds freeze from the top down, and how cold it must be for water to freeze solid.',
      },
      {
        id: 'reader:c4-tale-2-l2',
        domain: 'literacy',
        skill: 'compare your point of view with a character’s',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 17,
        prompt: [
          { who: 'moss', text: 'I have asked myself this for a very long time. Now I will ask you. Was Cinder right to make the Heartstone?', mood: 'think' },
        ],
        options: [
          {
            label: 'Yes. She saved their lives.',
            reply: [
              { who: 'moss', text: 'That is a fair answer. Cinder would have said the same. Every one of them lived, and that is not nothing.' },
            ],
          },
          {
            label: 'No. Being still isn’t really living.',
            reply: [
              { who: 'moss', text: 'That is a fair answer. I have come to think much the same. Safe is not the same as well.', mood: 'soft' },
            ],
          },
          {
            label: 'Both. She saved them, but it cost too much.',
            reply: [
              { who: 'moss', text: 'That is a fair answer, and an old one. It is the closest I have ever got.', mood: 'soft' },
              { who: 'moss', text: 'Sometimes a choice is right and wrong at once. Those are the ones that keep you up at night.' },
            ],
          },
        ],
        parentNote: 'Your child gave their own view on a hard choice a character made, with no single right answer: a thinking question about whether safe is the same as well.',
      },
    ],
  },
  {
    id: 'reader:c4-tale-3',
    of: 'c4-tale-3',
    band: 'reader',
    lines: [
      { who: 'moss', text: 'So the three of us took it from her. Briar, Hush and I. It is the only time in my life I have been quick.' },
      { who: 'moss', text: 'We broke it in four. It did not want to break. Each of us laid one piece under a lantern post, to keep it asleep with our warmth.' },
      { who: 'moss', text: 'The pond, mine. The stream, Briar’s. The old wall, Hush’s.' },
      { who: 'moss', text: 'And the fourth, by the long grass, was Cinder’s own piece. I laid that one too. It wanted someone who had loved her.', mood: 'soft' },
      { who: 'narrator', text: 'Out by the long grass, the fourth lantern flickers, steadies, flickers.' },
      { who: 'moss', text: 'Cinder walked out into the snow and was not seen again. I looked. For a long time, I looked.' },
      { who: 'moss', text: 'Then the winter ended, the way they do, and people came. Keepers. They built the cottage, lit the lanterns, and every year they gathered.' },
      { who: 'moss', text: 'That is what the night is for. The gathering keeps us remembered. The remembering keeps the pieces asleep.' },
      { who: 'moss', text: 'Briar faded laughing. Hush faded quietly, at the end of a long grief, when she had carried it as far as she could.' },
      { who: 'moss', text: 'And I stayed. Every year, a few more people to remember. A few fewer who remembered me.' },
      { who: 'moss', text: 'Then one spring a young woman came up the lane, lost inside a coat far too big for her, with a chin like yours.' },
      { who: 'moss', text: 'I sat beside her a whole winter before I said a word. She never once asked me to. That is how I knew.', mood: 'soft' },
      { who: 'moss', text: 'Forty years. She learned slow hands. She was the best of all of them. Don’t tell her I said so.' },
      { who: 'moss', text: 'She took one apprentice. Clever. In a hurry. Twenty-two, with nothing but months.' },
      { who: 'narrator', text: 'Moss stops.' },
    ],
    choices: [
      {
        id: 'ask-apprentice',
        label: 'What happened to him?',
        then: [{ who: 'moss', text: 'That part is not a tale yet. It is still happening.', mood: 'sad' }],
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
          { who: 'narrator', text: 'You sit. After a while he leans, very slightly, against your arm. He is lighter than he looks.' },
          { who: 'moss', text: 'Yes. Like that.', mood: 'soft' },
        ],
      },
    ],
    lessons: [
      {
        id: 'reader:c4-tale-3-l1',
        domain: 'sel',
        skill: 'understanding grief',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 8,
        lines: [
          { who: 'moss', text: 'When I say faded, I mean died. Their bodies stopped working, and did not start again.', mood: 'soft' },
          { who: 'moss', text: 'Grief is the heavy sadness that comes after. It is not a mistake. It is what love feels like when someone is gone.', mood: 'soft' },
          { who: 'moss', text: 'Hush taught me that grief gets lighter when it is shared. That is partly what the lanterns are for.' },
        ],
        parentNote: 'Your child heard death named plainly and grief explained as a natural part of loving someone, and that sharing it helps.',
      },
      {
        id: 'reader:c4-tale-3-l2',
        domain: 'literacy',
        skill: 'theme: the big idea of a story',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 9,
        prompt: [
          { who: 'moss', text: 'One day you will tell this tale to someone small. They will ask what it is about. What will you tell them?', mood: 'think' },
        ],
        options: [
          {
            label: 'Holding on too tight can hurt the ones you love.',
            best: true,
            reply: [
              { who: 'moss', text: 'Yes. Cinder loved them so tightly she made them still. Put that one at the front.', mood: 'soft' },
              { who: 'moss', text: 'There is another underneath: being remembered keeps us going. A tale is allowed two.' },
            ],
          },
          {
            label: 'Being remembered keeps us going.',
            reply: [
              { who: 'moss', text: 'That too. The song says it: we are made of the ones who remember us.', mood: 'soft' },
              { who: 'moss', text: 'But under it is Cinder. Holding on too tight can hurt the ones you love.' },
            ],
          },
          {
            label: 'There are four lantern posts.',
            reply: [
              { who: 'moss', text: 'True. That is what the tale has in it. Not what it is about.', mood: 'happy' },
              { who: 'moss', text: 'What it is about is something you can carry home. Holding too tight can hurt. Being remembered matters.' },
            ],
          },
        ],
        parentNote: 'Your child told the difference between a story detail and a theme, and named the big ideas of the tale.',
      },
    ],
  },
  {
    id: 'reader:c4-out',
    of: 'c4-out',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Towards morning the wind turns. It comes down from up the valley, and it is cold.' },
      { who: 'narrator', text: 'The fourth lantern flickers. Steadies. Flickers.' },
      { who: 'narrator', text: 'Goes out.' },
      { who: 'moss', text: 'Twenty-two years.', mood: 'sad' },
      { who: 'you', text: 'Since what?' },
      { who: 'moss', text: 'Nothing you need tonight. The other three will see us to morning.' },
      { who: 'narrator', text: 'Against the wall, Sparks jerks awake, stares at the dark fourth post, and says, very clearly: “I didn’t touch it.”' },
      { who: 'narrator', text: 'She is asleep again before anyone can tell her that nobody thought she had.' },
      { who: 'narrator', text: 'Three lanterns burn until dawn. On the glass of the fourth, a faint white bloom of frost grows. Then the sun reaches it, and it’s gone.' },
      { who: 'narrator', text: 'Nobody comes down the hill.' },
      { who: 'moss', text: 'She will. She finishes things. It is the most annoying thing about her.', mood: 'soft' },
      { who: 'moss', text: 'Some evening, when you have time, carry me round the posts. There is more to each of them than one night holds.' },
      { who: 'moss', text: 'I am too old to walk it on my own. And I would like the company.' },
      { who: 'narrator', text: 'At the edge of the long grass, beside the dark post, Sable is sitting very still, watching it too.' },
    ],
    lessons: [
      {
        id: 'reader:c4-out-l1',
        domain: 'sel',
        skill: 'empathy: feeling to blame when it isn’t your fault',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 7,
        prompt: [
          { who: 'narrator', text: 'Why do you think Sparks said “I didn’t touch it” in her sleep?' },
        ],
        options: [
          {
            label: 'She worries it’s her fault, because she fixes the lanterns.',
            best: true,
            reply: [
              { who: 'narrator', text: 'That’s it. When you look after something, you can feel to blame even when you did nothing wrong.' },
              { who: 'narrator', text: 'Tomorrow, someone should tell her plainly: it wasn’t you.' },
            ],
          },
          {
            label: 'She did touch it.',
            reply: [
              { who: 'narrator', text: 'She’s been asleep against the wall all night. She never went near it.' },
              { who: 'narrator', text: 'She looks after the lanterns, so she worries it’s her fault. People can feel to blame even when they did nothing wrong.' },
            ],
          },
          {
            label: 'She’s dreaming about buns.',
            reply: [
              { who: 'narrator', text: 'Crunchy ones, maybe! But she said it looking right at the dark post.' },
              { who: 'narrator', text: 'She looks after the lanterns, so she worries it’s her fault. People can feel to blame even when they did nothing wrong.' },
            ],
          },
        ],
        parentNote: 'Your child thought about how a character can feel guilty for something that wasn’t their fault, and what might help.',
      },
      {
        id: 'reader:c4-out-l2',
        domain: 'social-studies',
        skill: 'read a simple map and plan a route',
        standard: 'D2.Geo.2.K-2',
        kind: 'do',
        after: 12,
        check: 'edu:order:lantern-posts:song',
        lines: [
          { who: 'moss', text: 'Here is Hazel’s map of the Grove. Find the four posts for me, in the order the song sings them.' },
          { who: 'moss', text: 'Pond, stream, old wall, long grass. That will be our walk.', mood: 'soft' },
        ],
        parentNote: 'Your child found places on a map of the Grove and put them in order to plan a walk.',
      },
    ],
  },
];

// ---------------------------------------------------------------- triggered scenes (any chapter)
const TRIGGERED: EduScene[] = [
  {
    id: 'reader:t-first-shadow',
    of: 't-first-shadow',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Your Nubbin has gone grey. The ball above its head is dark. When you reach for it, it flinches away from your hand.' },
      { who: 'narrator', text: 'Your hand stops in the air. You don’t know what to do with it, so you put it down, slowly, on the grass between you.' },
      { who: 'fern', text: 'I’m not going to pretend that isn’t on you. Hazel wouldn’t, and she’d never let me hear the end of it.', mood: 'sad' },
      { who: 'fern', text: 'Too many throws, or too many hungry nights. Or both.' },
      { who: 'fern', text: 'It doesn’t come back from grey. It can come back from scared. Slowly. If you’re patient every single day, and never once aren’t.', mood: 'soft' },
      { who: 'fern', text: 'I’ll sit with you a bit, if you like. I’m no good at it. She was the one who was good at it.', mood: 'soft' },
      { who: 'narrator', text: 'So you sit, the two of you, with the grey one a little way off. It doesn’t run. That’s a start.' },
    ],
    lessons: [
      {
        id: 'reader:t-first-shadow-l1',
        domain: 'science',
        skill: 'what animals need to live',
        standard: 'K-LS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          { who: 'fern', text: 'Every animal needs a few things to live: food, water, air, and a safe place to be.' },
          { who: 'fern', text: 'Hungry nights take away the food. Throws take away the safe. A Nubbin needs both, every day.', mood: 'sad' },
        ],
        parentNote: 'Your child learned what animals need to live (food, water, air and a safe home) and linked it to caring for a pet.',
      },
      {
        id: 'reader:t-first-shadow-l2',
        domain: 'sel',
        skill: 'honesty and making things right after a mistake',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 5,
        prompt: [
          { who: 'fern', text: 'So. What do you do now?', mood: 'soft' },
        ],
        options: [
          {
            label: 'Say sorry, and be gentle every day from now on.',
            best: true,
            reply: [
              { who: 'fern', text: 'That’s it. Own it, then do better, every single day. That’s all Hazel ever asked of anyone.', mood: 'soft' },
            ],
          },
          {
            label: 'Pretend it didn’t happen.',
            reply: [
              { who: 'fern', text: 'Tempting. I’ve tried it with the pear tree. It doesn’t work.', mood: 'think' },
              { who: 'fern', text: 'Saying “that was me, I’m sorry” is the brave bit. Then you’re gentle every day after.' },
            ],
          },
          {
            label: 'Give up. It’s too late.',
            reply: [
              { who: 'fern', text: 'It feels like that. It isn’t. It can come back from scared. Slowly.', mood: 'soft' },
              { who: 'fern', text: 'Say sorry, then be gentle every day. Small and boring and every day. That’s the whole cure.' },
            ],
          },
        ],
        parentNote: 'Your child thought about owning a mistake honestly and making it right with steady, patient care.',
      },
    ],
  },
  {
    id: 'reader:t-ran-away',
    of: 't-ran-away',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'The long grass at the edge of the Grove is pressed flat where something small pushed through it. The gate is swinging.' },
      { who: 'narrator', text: 'It never swings for you. It swung for that.' },
      { who: 'fern', text: 'It’s gone. They do that, when they’ve decided nothing here is worth staying for.', mood: 'sad' },
      { who: 'fern', text: 'They sometimes come back. To the edge. To see if anything’s changed.' },
      { who: 'fern', text: 'I still look at the edge, some mornings. Old habit. Don’t ask.', mood: 'soft' },
      { who: 'narrator', text: 'You look at the edge too. Then you go and fill the fruit bowl, just in case.' },
    ],
    lessons: [
      {
        id: 'reader:t-ran-away-l1',
        domain: 'science',
        skill: 'animals live where their needs are met',
        standard: 'K-ESS3-1',
        kind: 'notice',
        after: 2,
        lines: [
          { who: 'narrator', text: 'Animals live where they can find what they need: food, water, shelter, and nothing scaring them off.' },
          { who: 'narrator', text: 'When a place stops giving them that, many animals move on. So if you want one back, make the place worth coming back to.' },
        ],
        parentNote: 'Your child learned that animals live where their needs are met, and move on when they are not.',
      },
      {
        id: 'reader:t-ran-away-l2',
        domain: 'sel',
        skill: 'managing a big feeling: missing someone',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 4,
        lines: [
          { who: 'fern', text: 'Missing someone hurts. It’s allowed to. You don’t have to hurry it away.', mood: 'soft' },
          { who: 'fern', text: 'What helps me is doing one small kind thing while I wait. A full bowl. A lamp left on.' },
        ],
        parentNote: 'Your child heard that missing someone is a normal feeling, and that small, hopeful actions can help while you wait.',
      },
    ],
  },
  {
    id: 'reader:t-stray-returned',
    of: 't-stray-returned',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Something grey is sitting at the very edge of the Grove, in the long grass. Not coming in. Watching the gate. Watching you.' },
      { who: 'narrator', text: 'You want to run to it. Every part of you wants to run to it.' },
      { who: 'narrator', text: 'Rule three, in her leaning hand: when you don’t know what to do, sit down next to them and wait.' },
      { who: 'narrator', text: 'So you don’t run. You set a fruit in the grass, and sit down a little way off.' },
      { who: 'narrator', text: 'Your heart is going fast. You let it slow down.' },
      { who: 'narrator', text: 'It looks at the fruit. Then at you. It doesn’t leave.', mood: 'soft' },
    ],
    lessons: [
      {
        id: 'reader:t-stray-returned-l1',
        domain: 'sel',
        skill: 'calm a big feeling with slow breaths',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 4,
        check: 'edu:count:breaths:5',
        lines: [
          { who: 'narrator', text: 'Big feelings make your body want to rush. Slow breathing tells it there’s time.' },
          { who: 'narrator', text: 'Breathe in slowly. Breathe out slowly. Count five breaths, while the grey one watches.' },
        ],
        parentNote: 'Your child practised calming down with slow breaths before acting, so a scared animal could feel safe.',
      },
    ],
  },
  {
    id: 'reader:t-sable-bonded',
    of: 't-sable-bonded',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'Sable climbs into your lap. All the way in. She is grey and she is heavy and she is warm.' },
      { who: 'narrator', text: 'The ball above her head is a small dark heart.' },
      { who: 'narrator', text: 'She turns round twice, the way they do, and lies down. She lets out a breath she seems to have been holding since winter.' },
      { who: 'luna', text: 'There. That’s the thing nobody in a hurry ever gets to see. Grey and loved. Both at once.', mood: 'soft' },
      { who: 'narrator', text: 'You don’t move for a long time. You are sitting down next to her, and waiting. You have been for weeks.' },
      { who: 'narrator', text: 'Luna sits down too, very quietly, so as not to spoil it.' },
    ],
    lessons: [
      {
        id: 'reader:t-sable-bonded-l1',
        domain: 'literacy',
        skill: 'metaphors: saying one thing is another',
        standard: 'L.4.5',
        kind: 'ask',
        after: 1,
        prompt: [
          { who: 'narrator', text: '“The ball above her head is a small dark heart.” It isn’t really a heart. The writer says it is one, with no “like” or “as”.' },
          { who: 'narrator', text: 'What is that called?' },
        ],
        options: [
          {
            label: 'A metaphor',
            best: true,
            reply: [
              { who: 'narrator', text: 'Yes. A metaphor says one thing is another. Here it tells you the ball shows what Sable feels inside.' },
            ],
          },
          {
            label: 'A simile',
            reply: [
              { who: 'narrator', text: 'Close! A simile compares using “like” or “as”. This one says the ball is a heart, so it’s a metaphor.' },
            ],
          },
          {
            label: 'A rhyme',
            reply: [
              { who: 'narrator', text: 'A rhyme is words that end with the same sound, like “night” and “tight”. This is a metaphor: it says the ball is a heart.' },
            ],
          },
        ],
        parentNote: 'Your child told a metaphor apart from a simile and a rhyme.',
      },
      {
        id: 'reader:t-sable-bonded-l2',
        domain: 'sel',
        skill: 'think about carrying a hard thing and still being happy',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 3,
        prompt: [
          { who: 'luna', text: 'She’ll always be grey. Can someone carry a sad thing and still be happy?', mood: 'think' },
        ],
        options: [
          {
            label: 'Yes. Both can be true at once.',
            reply: [
              { who: 'luna', text: 'That’s what I think too. Look at her. Grey, and fast asleep in your lap.', mood: 'soft' },
            ],
          },
          {
            label: 'Maybe. The grey might always make her a bit sad.',
            reply: [
              { who: 'luna', text: 'That’s a fair answer, and an honest one. Clover would say the sad part never goes, but it can get lighter.', mood: 'soft' },
            ],
          },
          {
            label: 'I think the love will win.',
            reply: [
              { who: 'luna', text: 'That’s a hopeful answer. I hope you’re right. Tonight, it looks like it is.', mood: 'happy' },
            ],
          },
        ],
        parentNote: 'Your child reflected on whether sadness and happiness can live side by side, a thinking question with no single right answer.',
      },
    ],
  },
  {
    id: 'reader:t-moss-first-pet',
    of: 't-moss-first-pet',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'You put your hand on his head. He is dry and soft, like moss on a warm wall, and lighter than he looks.' },
      { who: 'moss', text: 'Careful. I am very old and I bruise like fruit.' },
      { who: 'narrator', text: 'You start to take your hand away.' },
      { who: 'moss', text: '…No, don’t stop.', mood: 'soft' },
      { who: 'moss', text: 'She did that every evening for forty years. You don’t notice a thing like that until it stops.', mood: 'soft' },
      { who: 'narrator', text: 'So you don’t stop. The sun goes down behind the hill, and neither of you says anything for a while.' },
    ],
    lessons: [
      {
        id: 'reader:t-moss-first-pet-l1',
        domain: 'sel',
        skill: 'checking someone is comfortable before carrying on',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 2,
        prompt: [
          { who: 'narrator', text: 'Moss said “careful”, and you started to take your hand away. Why was that a good thing to do?' },
        ],
        options: [
          {
            label: 'It checks he’s happy before I carry on.',
            best: true,
            reply: [
              { who: 'narrator', text: 'Exactly. When someone says “careful”, you pause and let them choose. Then they can trust your hands.' },
            ],
          },
          {
            label: 'Because he’s grumpy.',
            reply: [
              { who: 'narrator', text: 'He is a bit grumpy! But the real reason is kinder: pausing lets him choose.' },
              { who: 'narrator', text: 'When someone says “careful”, you stop and check. Then they can trust your hands.' },
            ],
          },
          {
            label: 'Because my arm was tired.',
            reply: [
              { who: 'narrator', text: 'Ha! Maybe. But pausing also did something kind: it let Moss choose.' },
              { who: 'narrator', text: 'When someone says “careful”, you stop and check. Then they can trust your hands.' },
            ],
          },
        ],
        parentNote: 'Your child practised consent with touch: pausing when someone says “careful” and letting them choose.',
      },
    ],
  },
  {
    id: 'reader:t-moss-first-pet-early',
    of: 't-moss-first-pet-early',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'The old grey one on the hill doesn’t move away when you come close. He doesn’t move at all.' },
      { who: 'narrator', text: 'You put your hand on his head. He is dry and soft, like moss on a warm wall.' },
      { who: 'narrator', text: 'For a moment, nothing. Then, very slightly, he leans into your palm, the way a plant leans towards a window.' },
      { who: 'narrator', text: 'He doesn’t say anything. He seems to be making up his mind about something.' },
      { who: 'narrator', text: 'You stay a while. Then you go back down the hill.' },
      { who: 'narrator', text: 'When you look back from the bottom of the hill, he is watching you go.' },
    ],
    lessons: [
      {
        id: 'reader:t-moss-first-pet-early-l1',
        domain: 'science',
        skill: 'plants need light and grow towards it',
        standard: '2-LS2-1',
        kind: 'notice',
        after: 2,
        lines: [
          { who: 'narrator', text: 'A plant on a windowsill really does lean towards the window. Plants need light to make their food.' },
          { who: 'narrator', text: 'So they grow towards the brightest side. Turn the pot round, and in a few days it leans back.' },
        ],
        parentNote: 'Your child learned that plants need light to make food and grow towards it.',
      },
    ],
  },
  {
    id: 'reader:t-talk-generic',
    of: 't-talk-generic',
    band: 'reader',
    lines: [
      { who: 'narrator', text: 'A Keeper stops by the gate for a chat.' },
      { who: 'narrator', text: 'A nod. A few words about the weather. Is it going to rain? It might. It usually might.' },
      { who: 'narrator', text: 'Then a short argument about whose Nubbin ate whose hat.' },
      { who: 'narrator', text: 'Both Nubbins look very innocent. One of them has a bit of hat brim stuck to its chin.' },
      { who: 'narrator', text: 'In the end everyone agrees that hats are hard to keep and Nubbins are always hungry.' },
      { who: 'narrator', text: 'It helps. Talking about nothing much often does.' },
    ],
    lessons: [
      {
        id: 'reader:t-talk-generic-l1',
        domain: 'social-studies',
        skill: 'settle a disagreement fairly',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 2,
        prompt: [
          { who: 'narrator', text: 'Each Keeper says the other one’s Nubbin ate the hat. What’s the fairest way to sort it out?' },
        ],
        options: [
          {
            label: 'Listen to both sides and look for clues.',
            best: true,
            reply: [
              { who: 'narrator', text: 'Fair and clever. Everyone gets heard, and the clues decide. Speaking of clues, look at those chins…' },
            ],
          },
          {
            label: 'Whoever shouts loudest wins.',
            reply: [
              { who: 'narrator', text: 'Then Sparks would win every argument in the valley, which nobody wants.', mood: 'happy' },
              { who: 'narrator', text: 'Fairer: listen to both sides and look for clues. Speaking of clues, look at those chins…' },
            ],
          },
          {
            label: 'Blame the smallest Nubbin.',
            reply: [
              { who: 'narrator', text: 'Poor smallest Nubbin! Being small doesn’t make you guilty.' },
              { who: 'narrator', text: 'Fairer: listen to both sides and look for clues. Speaking of clues, look at those chins…' },
            ],
          },
        ],
        parentNote: 'Your child thought about fair ways to settle a disagreement: hearing both sides and using evidence.',
      },
    ],
  },
];

// ---------------------------------------------------------------- glossary
const GLOSSARY: GlossaryEntry[] = [
  { word: 'overgrown', meaning: 'Covered with plants that have grown too long and wild because nobody has cut them.', scene: 'c1-letter' },
  { word: 'latch', meaning: 'A simple catch that keeps a door or gate shut; “on the latch” means closed but not locked.', scene: 'c1-letter' },
  { word: 'flicker', meaning: 'To shine on and off in a shaky, unsteady way, like a candle in a draught.', scene: 'c1-close' },
  { word: 'potential', meaning: 'What someone or something could become one day, even if it can’t yet.', scene: 'c1-close' },
  { word: 'brine', meaning: 'Very salty water, like seawater.', scene: 'c2-open' },
  { word: 'debt', meaning: 'Something you owe someone and still have to pay back.', scene: 'c2-open' },
  { word: 'heir', meaning: 'The person who receives someone’s home or belongings after them.', scene: 'c2-corvin' },
  { word: 'method', meaning: 'A way of doing something, usually step by step.', scene: 'c2-corvin' },
  { word: 'flinch', meaning: 'To jerk away suddenly because you are scared or expect to be hurt.', scene: 'c3-open' },
  { word: 'subtle', meaning: 'Done quietly so it is hard to notice.', scene: 'c3-open' },
  { word: 'hollow', meaning: 'A small dip or hole in the ground. (With a capital H, the Hollow is also a place past the falls.)', scene: 'c3-close' },
  { word: 'frost', meaning: 'Tiny ice crystals that form on cold surfaces when water vapour in the air freezes onto them.', scene: 'c3-close' },
  { word: 'Eternal', meaning: 'In the Grove, a Nubbin loved so much that it stops fading and stays.', scene: 'c4-open' },
  { word: 'reputation', meaning: 'What other people think and say about you.', scene: 'c4-open' },
  { word: 'hoax', meaning: 'A trick that makes people believe something that isn’t true.', scene: 'c4-close' },
  { word: 'unverified', meaning: 'Not checked or proved yet, so we can’t be sure it is true.', scene: 'c4-close' },
  { word: 'spring', meaning: 'A place where water comes up out of the ground. (It is also the season after winter.)', scene: 'c4-tale' },
  { word: 'fade', meaning: 'To slowly grow fainter; in the Grove, it is the word for a Nubbin dying.', scene: 'c4-tale' },
  { word: 'warden', meaning: 'Someone whose job is to guard and look after a place.', scene: 'c4-tale-2' },
  { word: 'of their own accord', meaning: 'Because they chose to, without anyone telling them.', scene: 'c4-tale-2' },
  { word: 'apprentice', meaning: 'Someone who learns a skill by working beside an expert.', scene: 'c4-tale-3' },
  { word: 'grief', meaning: 'The deep sadness you feel when someone you love has died or is lost.', scene: 'c4-tale-3' },
  { word: 'bloom', meaning: 'A thin misty layer on a surface, like frost on glass. (It also means a flower.)', scene: 'c4-out' },
  { word: 'patient', meaning: 'Able to wait calmly without rushing or getting cross.', scene: 't-first-shadow' },
  { word: 'bruise', meaning: 'A dark mark that comes on skin, or fruit, after a knock.', scene: 't-moss-first-pet' },
  { word: 'innocent', meaning: 'Not guilty of doing something wrong (or looking as if you aren’t!).', scene: 't-talk-generic' },
];

// ---------------------------------------------------------------- the campaign slice
export const EDU_CAMPAIGN_1_READER: EduCampaign = {
  id: 'reader:book1',
  band: 'reader',
  chapters: {
    1: {
      title: 'The Letter',
      goalText: 'Find Gran’s eggs in the long grass. Hatch one, then pet the Nubbin that comes out.',
      hint: 'The eggs hum in the long grass, by the farthest lantern post. Hold an egg and give it a gentle shake to hurry it. Tap the Nubbin and choose Pet.',
    },
    2: {
      title: 'Shells and Promises',
      goalText: 'Pick fruit from the trees and feed a Nubbin from your hand. Do it twice.',
      hint: 'Tap a tree to shake it, then tap the fruit to pick it up. Tap a Nubbin and choose Feed. Keep your palm flat!',
    },
    3: {
      title: 'The One Who Hides',
      goalText: 'Earn a little of Sable’s trust. Her trust needs to reach 20.',
      hint: 'Sable runs if you rush her. Leave fruit nearby, sit and wait, and pet her only when she lets you. Never throw her.',
    },
    4: {
      title: 'Moss Remembers',
      goalText: 'Pet Moss on the hill. Then light all four lanterns.',
      hint: 'Moss sits on the western hill. Tap a lantern post to light it. The fourth post only flickers, but it still counts.',
    },
  },
  scenes: [...CH1, ...CH2, ...CH3, ...CH4, ...TRIGGERED],
  glossary: GLOSSARY,
  notes:
    'Reader band (7–10), Book One chapters 1–4 plus all t-* triggered scenes. Every choice id, set and friendship is unchanged, ' +
    'so flags (corvinOffer, soldNubbin, sableFirst, sableTrustBonus) work as in the main game. Ask lessons mark one best ' +
    'option; where a second answer is also good, its reply says so. Thinking questions (no best answer): ' +
    'c1-letter-l1, c2-corvin-l2, c3-close-l2, c4-tale-2-l2, t-sable-bonded-l2. c4-close condenses the Lantern Song to verse one and ' +
    'the chorus (Luna sings the first line alone, then speaker chorus, as in the main scene); the c4-close-l2 replies ' +
    'quote its last two lines. c4-tale ask-loved: Moss planted his first love’s flower beside Briar’s, which is the ' +
    'first on the hill (canon 2). New do-checks: edu:hold:palm:flat (c2-open, hand-feeding), ' +
    'edu:order:lantern-posts:song (c4-out, tap the posts on Hazel’s map in song order: pond, stream, old wall, long grass), ' +
    'edu:count:breaths:5 (t-stray-returned).',
};

export const CHECKS: string[] = ['edu:hold:palm:flat', 'edu:order:lantern-posts:song', 'edu:count:breaths:5'];
