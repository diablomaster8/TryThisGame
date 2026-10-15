/**
 * Three of the twelve new side stories for "Hazel’s Grove" (briefs/new-stories.md):
 *   S12 The Hum             chapter 6 → before chapter 10   the Thrums of Hush’s old wall, and the one who says “I”
 *   S17 Nightjar            chapter 7 → before chapter 10   the great grey owl who keeps taking the nursery’s eggs
 *   S18 The Grove Museum    chapter 6 → chapter 11          Professor Delve, four wings, and the centre case
 *
 * All three are for fun: none changes the campaign. Each sets only its own done flag (s12Done,
 * s17Done, s18Done) and harmless local flags prefixed s12- / s17- / s18- from choices. No
 * campaign flag is read or written here; where a trigger depends on the chapter, `trigger`
 * and `notes` say so.
 *
 * Timing: a step’s `scene` plays when the step starts (the moment the previous step’s
 * `check` is met); its `done` scene plays when its own `check` is met.
 *
 * Secrets: S17 is set in chapter 7 at the earliest, but it only hints at the shard (a cold
 * out of season, “twenty-two years”). Nobody explains it.
 *
 * S18’s plaques: every one of the twelve plaque texts (the lines Professor Delve reads aloud,
 * in quotation marks, in s18-fossils, s18-night-finds, s18-shore-finds and s18-star-finds)
 * states a true, well-established fact. Ship them exactly as written.
 *
 * Audience 'all'. All words are original; no outside quotes, so no childLines are needed.
 * The Lantern Song refrain is the bible’s own and is only hummed (tune, no words) by S12’s hive.
 */
import type { Line, Mood } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const LU = say('luna');
const PX = say('pixel');
const NO = say('nova');
const DU = say('dusty');
const MA = say('marina');

// ---------------------------------------------------------------- new speakers
const THRUMS: Speaker = { id: 'thrums', name: 'The Thrums', kind: 'nubbin' };
const SOLO: Speaker = { id: 'solo', name: 'Solo', kind: 'nubbin' };
const QUEEN_MOTHER: Speaker = { id: 'queen-mother', name: 'The Queen-Mother', kind: 'nubbin' };
const NIGHTJAR: Speaker = { id: 'nightjar', name: 'Nightjar', kind: 'other' };
const DELVE: Speaker = { id: 'delve', name: 'Professor Delve', kind: 'other' };

const TH = say('thrums');
const SO = say('solo');
const QM = say('queen-mother');
const NJ = say('nightjar');
const DE = say('delve');

export const SIDE_STORIES_NEW_2: Quest[] = [
  // ================================================================== S12
  {
    id: 's12',
    code: 'S12',
    title: 'The Hum',
    source:
      'Inspired by StarCraft: a swarm that thinks as one, a shared mind, and the ones who cut themselves off to think alone (themes only)',
    audience: 'all',
    trigger: {
      where: 'Luna’s night garden, at dusk',
      when: 'Chapter 6, any evening after c6-open. Closes before chapter 10 begins.',
    },
    speakers: [THRUMS, SOLO, QUEEN_MOTHER],
    steps: [
      // ------------------------------------------------ 1. the one who says “I”
      {
        id: 's12-step1',
        goal: 'Carry Solo home to the Thrums in the old wall.',
        hint: 'Hush’s old wall is the tumbled stone one on the north side of the Grove. Carry the teacup level; Solo gets seasick.',
        check: 'carry:nubbin:s12-solo:old-wall',
        scene: {
          id: 's12-solo',
          lines: [
            N('Dusk in Luna’s night garden. The moonflowers open one by one, with a sound like someone unwrapping a sweet.'),
            LU('Keeper. Over here. Quietly. I’ve got something in a teacup and I don’t know what to do with it.', 'think'),
            N('In the teacup is a beetle the size of your thumb: round, bronze, fuzzed on the back like a peach.'),
            N('It is, just about, a Nubbin. Its wings buzz whenever anyone speaks.'),
            LU('It’s a Thrum. They live in Hush’s old wall, hundreds of them. They hum. They never, ever come out alone.'),
            N('The beetle looks up at you. It clears its throat, which for a beetle is mostly wings.'),
            SO('We are— no.', 'shock'),
            SO('I. I am. Good evening. I am sorry. I am not sure who is sorry. I think it is me.', 'sad'),
            LU('It’s been doing that for an hour. It finds it very upsetting.', 'soft'),
            LU('It needs a name, I think. Things that say “I” usually do.'),
          ],
          choices: [
            {
              id: 'solo',
              label: 'Call it Solo.',
              set: { 's12-name': 'solo' },
              then: [
                SO('Solo. Solo is… one of something. Yes. That is what I am. Currently.', 'think'),
                LU('Currently. Good. Always leave yourself a way back.', 'soft'),
              ],
            },
            {
              id: 'own',
              label: 'Give it a name of your own.',
              set: { 's12-name': 'own' },
              then: [
                N('You say a name. The beetle repeats it three times under its breath, as if testing a step.'),
                SO('Nobody has ever said a thing just to me before. It is very loud.', 'shock'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask what it would like to be called.',
              set: { 's12-name': 'asked' },
              then: [
                SO('Like? I have never liked anything on my own. We like things. Together. By agreement.', 'think'),
                SO('…I would like you to choose. Is that allowed? That is my first like.', 'soft'),
                N('You call it Solo. It seems to fit, the way a borrowed coat fits.'),
              ],
            },
          ],
        },
        done: {
          id: 's12-wall',
          lines: [
            N('The old wall hums. You feel it before you hear it: lay a palm on the stone and it buzzes like a cat on a lap.'),
            N('The mortar smells faintly of honey. Every crack has a tiny round door, and every door has a face in it.'),
            TH('Good evening, Keeper.'),
            TH('We would like to say: thank you for returning the one.'),
            TH('We would also like to say: the one is welcome. One moment. We are checking we all agree about “welcome”.', 'think'),
            N('There is a long pause, full of buzzing.'),
            TH('We do. Welcome. We apologise for the delay. We are very many.', 'happy'),
            N('Solo does not get out of the teacup. Solo goes up your sleeve instead, and stays there, humming very quietly, alone.'),
            SO('In a minute. I will go in in a minute.', 'sad'),
            N('It does not go in.'),
          ],
        },
      },
      // ------------------------------------------------ 2. the hum goes flat
      {
        id: 's12-step2',
        goal: 'Put your ear to the old wall at dusk and listen for the Queen-Mother.',
        hint: 'She lives at the heart of the wall, low down by Hush’s lantern post. Go when the hum is quietest, and keep still.',
        check: 'listen:old-wall:s12-queen-mother',
        scene: {
          id: 's12-flat',
          lines: [
            N('Next morning Pixel is at the old wall with a tuning fork, a notebook and an expression.'),
            PX('Hi. Don’t move. Sorry. You can move. Just don’t buzz.', 'think'),
            PX('I tune my lantern timer to this wall. Have done for years. It hums a perfect B-flat. Ish. Always has.'),
            N('She taps the fork on her knee and holds it to the stone. The fork sings. The wall sings back, a hair lower.'),
            PX('It’s gone flat. Walls don’t go flat. Walls don’t do anything. That’s their whole thing.', 'shock'),
            TH('Good morning. We are sorry about the flat.', 'sad'),
            TH('It is our Queen-Mother. She is the middle of the hum. She is getting quieter.'),
            TH('When the middle goes quiet, the hum splits. Half of us leave with a new queen. Half of us stay.'),
            TH('We have done it before. We do not remember it. The ones who remember always leave.'),
            PX('That is the saddest thing a wall has ever said to me.', 'sad'),
            N('In your sleeve, Solo has gone completely still.'),
          ],
        },
        done: {
          id: 's12-queen',
          lines: [
            N('At dusk you lie in the grass with your ear to the bottom stone, where the moss is warmest.'),
            N('Deep in the wall, under all the others, there is one slow note, like a big bee in a shut room.'),
            QM('Ah. The Keeper. And the one in your sleeve. Yes, I can hear it. I can hear all of them.', 'soft'),
            QM('I am going to tell you something, and you are not to tell the we.'),
            QM('I have said “I” for a very long time. Somebody has to, in the middle of a we. Somebody has to decide when.', 'think'),
            QM('It is quite lonely. Nobody tells you that about the middle.', 'sad'),
            N('Solo makes a small sound in your sleeve, like a question with no words in it.'),
            QM('On the first warm, still morning, half will go. The young one must choose. Go, stay, or something else.', 'soft'),
            QM('Don’t choose for it. That would be the we all over again, only taller.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 3. a night alone
      {
        id: 's12-step3',
        goal: 'Sit with Solo in Luna’s garden until the first warm, still morning.',
        hint: 'Sit on the bench by the moonflowers after dark and don’t get up. Solo doesn’t need answers. It needs company.',
        check: 'sit:s12-solo:luna-garden:dawn',
        scene: {
          id: 's12-dark',
          lines: [
            N('Solo won’t go into the wall and won’t come out of your sleeve. So that evening you take it to Luna’s garden.'),
            N('Luna has raked the gravel into slow spirals. In the dark they shine a little, like the inside of a shell.'),
            SO('In the hum I am warm on every side. Nothing is my fault. Nothing is mine. It is very restful.', 'soft'),
            SO('Out here everything is mine. The dark is mine. The cold is mine. This leaf is mine, and I did not ask for it.', 'sad'),
            SO('If I go back, I stop. Not die. Stop being the one who is frightened. I would quite like to stop.'),
            SO('But I would also like to see what happens next. To me. Is that greedy?', 'think'),
            LU('I garden at night because nobody else does. I liked being one on my own before I liked anything else.', 'soft'),
            LU('No. That’s not true. It took years. Some nights I still don’t like it. I come out anyway.'),
            LU('That isn’t an answer. I haven’t got one. I’ve just got a garden.', 'think'),
          ],
        },
        done: {
          id: 's12-swarm-goes',
          lines: [
            N('You wake on the bench with dew in your hair. The air is warm and doesn’t move. It is the morning she meant.'),
            N('Across the Grove, the old wall roars.'),
            N('Bronze pours out of every crack at once and turns in the air, glittering, like a handful of pennies thrown at the sun.'),
            TH('Goodbye. Goodbye. We are leaving. Some of us are leaving. We are deciding which.', 'shock'),
            TH('It is going very slowly. We apologise. We are trying to be quick and also polite.'),
            SO('I want to see where they go. Not to go. To see. Is there a difference?', 'think'),
            PX('There’s a difference. I’ve got a tuning fork. Come on.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 4. follow the swarm, and choose
      {
        id: 's12-step4',
        goal: 'Follow the swarm by sound with Pixel’s tuning fork.',
        hint: 'Strike the fork and turn slowly: it buzzes hardest when you face the swarm. If you lose them, stand still and strike it again.',
        check: 'minigame:tuning-fork:s12-swarm',
        scene: {
          id: 's12-follow',
          lines: [
            N('Pixel presses the fork into your hand. It is warm from her pocket and has PROPERTY OF PIXEL scratched on the handle.'),
            PX('Strike it on your knee. Hold it up. Turn slowly. When the fork and the swarm match, it buzzes in your fingers.'),
            PX('That’s them. Walk that way. Strike it again when it goes quiet. Don’t walk into the stream. People do.'),
            PX('Not me. Other people. Specific other people.', 'think'),
          ],
        },
        done: {
          id: 's12-settled',
          lines: [
            N('The fork leads you over the stream to Hazel’s crooked tree. The swarm hangs from a branch in a great buzzing pear.'),
            N('Pixel holds her fork to it, then towards the wall, then to it again. Then she sits down hard on the bank.'),
            PX('It was never one note.', 'shock'),
            PX('It’s hundreds. All a hair apart. They lean towards each other till it sounds like one. That’s all a hum is.'),
            PX('I’ve been tuning a clock to a crowd. For years.', 'happy'),
            TH('We are here. We are a new we. We are not yet sure what we are like.', 'think'),
            TH('One. Solo. Will you come into a we? This one or the old one. Either is warm.', 'soft'),
            SO('Keeper. I don’t know. Sit with me. No. Tell me. No. Both. Is that allowed?', 'sad'),
            N('You don’t tell it. You sit down on the bank beside the teacup, and wait for it to choose.'),
          ],
          choices: [
            {
              id: 'hum',
              label: 'Solo goes home to the hum. You nod.',
              set: { 's12-solo': 'hum' },
              then: [
                N('You carry the teacup back to the old wall. Solo looks at you for a long moment, then climbs out.'),
                SO('I will forget being frightened. I think I will forget this, too. Will you remember it for me?', 'soft'),
                N('It walks in through a round door in the stone. The hum goes on, a hair fuller than before.'),
                PX('Listen to that. B-flat. Ish. It’s back in tune.', 'soft'),
              ],
            },
            {
              id: 'alone',
              label: 'Solo stays out on its own. You nod.',
              set: { 's12-solo': 'alone' },
              then: [
                N('You find it a knot-hole in the gatepost, out of the wind, with a view of the pond. It inspects it for a long time.'),
                SO('Mine. The knot-hole is mine. I chose it. Nobody agreed.', 'happy'),
                SO('It is very quiet in here. I will get used to it. Or I will get used to not being used to it.'),
                N('Every dusk after that, a tiny hum comes from the gatepost. One note. Slightly flat. Entirely its own.'),
              ],
            },
            {
              id: 'gaps',
              label: 'Solo asks the hum to leave a little room. You nod.',
              set: { 's12-solo': 'gaps' },
              then: [
                SO('Lean. But leave a gap. For one. Is that allowed?', 'think'),
                TH('We will discuss it.', 'think'),
                N('They discuss it. It takes until lunch. Pixel eats a sandwich. Then a second sandwich. Then yours.'),
                TH('We have agreed. We will be a hum with gaps in it. Ones may go out, and come in, and go out.', 'happy'),
                TH('We have also agreed this was the longest meeting in the history of the wall. We are very proud.'),
                SO('In for supper. Out for the stars. I can do that. I can be both, slowly.', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 's12-complete',
      lines: [
        N('A week on, the Queen-Mother’s note goes quiet for good, in the night, with the whole wall humming round her.'),
        N('In the morning there is a gift on your doorstep: a little hive of clay and wax, no bigger than a teapot.'),
        TH('For the Keeper. It hums. We taught it. We hope that is not rude.', 'soft'),
        N('At dusk it hums a tune you know: the bit of the Lantern Song that comes round twice.'),
        N('Beside it stands a thimble of pale gold nectar that smells of the wall in summer.'),
        TH('Hum-nectar. A Nubbin who sips it is calm for a day. Only a day. We did not want to overdo it.'),
        N('You find you can now say things in chorus with whoever is standing nearby. It is a skill you didn’t know you lacked.'),
        PX('I’ve retuned the lantern timer. Not to B-flat. To the whole crowd. It runs a bit early now. I like it.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 's12-hum-hive',
        kind: 'decor',
        label: 'Hum-hive',
        description:
          'A clay-and-wax hive the size of a teapot, made by the Thrums. At dusk it hums the refrain of the Lantern Song.',
      },
      {
        id: 's12-hum-nectar',
        kind: 'item',
        label: 'Hum-nectar',
        description: 'A thimble of pale gold nectar. Give it to a Nubbin and it stays calm for one whole day. Single use.',
      },
      {
        id: 's12-chorus-emote',
        kind: 'cosmetic',
        label: 'Chorus (emote)',
        description: 'Your Keeper says one word in chorus with every Keeper and Nubbin nearby, slightly out of time.',
      },
    ],
    sets: { s12Done: true },
    notes:
      'FOR FUN. Sets only s12Done plus s12-name (solo | own | asked) and s12-solo (hum | alone | gaps). Opens in chapter 6 ' +
      '(late summer); must complete before chapter 10 begins, otherwise it closes unfinished with no rewards. ' +
      'NAMING: the “own” choice opens the standard naming box (default text “Solo”). The display name of speaker `solo` ' +
      'and every literal word “Solo” in s12 scenes is replaced by the chosen name. SOLO: thumb-sized bronze beetle-Nubbin, ' +
      'peach-fuzz back, buzzing wings on every line (tiny wing-buzz SFX). When carried it sits in a teacup or in the ' +
      'player’s sleeve (sleeve = small head peeking from the cuff). THRUMS: the chorus speaker shows a cluster portrait; ' +
      'play every Thrums line as a layered chorus (many slightly-detuned voices). Running gag: their politeness and ' +
      'group decisions make everything slow. THE OLD WALL is Hush’s, north side, by the wall lantern: add small round doors ' +
      'in the cracks and a constant low hum (ambient, louder at dusk). STEP 2: listen = lie prone by the bottom stone at ' +
      'dusk for ~5 seconds without moving. STEP 3: sit on Luna’s bench from dark; time skips to dawn. The swarm morning is ' +
      'always the dawn after this sit (force warm, still weather). STEP 4 MINI-GAME (tuning-fork): tap to strike the fork; ' +
      'turn the Keeper; the fork icon pulses and the pad vibrates more strongly as the facing angle nears the swarm. Walk ' +
      'while it rings; it decays in ~4 s. Three legs (old wall → pond → stream → Hazel’s crooked tree). Walking into the ' +
      'stream is allowed and earns one Pixel line (“Specific other people.”). No fail state. The swarm hangs on the crooked ' +
      'tree over the stream (S5’s tree). CHOICE: none is wrong, and the choice is Solo’s, not yours: the Queen-Mother ' +
      'said “Don’t choose for it”, so every label is Solo’s decision and the player only nods. The “hum” result keeps ' +
      'Solo in the old wall; “alone” puts a ' +
      'small humming gatepost knot-hole in the Grove; “gaps” lets Solo wander between wall and garden at random. ' +
      'REWARDS at s12-complete. The hum-hive plays the Lantern Song refrain melody only (hummed, no words) at dusk.',
  },

  // ================================================================== S17
  {
    id: 's17',
    code: 'S17',
    title: 'Nightjar',
    source: 'Inspired by Ori and the Blind Forest: the great owl whose grief made her a terror to the forest (themes only)',
    audience: 'all',
    trigger: {
      where: 'The Grove nursery, at dawn',
      when: 'Chapter 7 (autumn), the first morning after c7-open, if a nursery is placed. Closes before chapter 10 begins.',
    },
    speakers: [NIGHTJAR],
    steps: [
      // ------------------------------------------------ 1. the missing eggs
      {
        id: 's17-step1',
        goal: 'Search the nursery and the fence for clues.',
        hint: 'Look closely at the straw, the nursery roof and the top rail of the fence. Show Luna anything you find.',
        check: 'inspect:nursery:s17-clues',
        scene: {
          id: 's17-missing',
          lines: [
            N('Autumn. The first conkers are down, and the nursery straw is damp with dew.'),
            N('In the straw there is a round, warm dent where an egg was last night. It is the fourth dent this fortnight.'),
            LU('One a night. Always the warmest one. Never a crack, never a crumb of shell. Whatever it is, it’s careful.', 'think'),
            NO('Morning. I’m not stopping. I was passing, and I heard there was a mystery, and I’m not stopping.'),
            NO('Badger.', 'think'),
            LU('It’s not a badger.'),
            NO('A tall badger.'),
            LU('Look at the straw before you trample it, both of you. Then we can talk about tall badgers.', 'soft'),
          ],
        },
        done: {
          id: 's17-clues',
          lines: [
            N('On the top rail of the fence: a grey feather as long as your forearm, soft as smoke. Its edge is torn, as if on rock.'),
            N('On the roof, faint scratches. Something landed very gently here, and left very gently.'),
            N('And the dent in the straw is still warm, hours later. Something kept that egg warm until the last second.'),
            LU('That’s an owl’s. A big owl. Bigger than an owl has any business being.', 'shock'),
            NO('Two badgers in a coat, holding an owl feather to throw us off.', 'happy'),
            LU('Nova.'),
            NO('It stays on the list. Lists should be long. Tonight, then? I’m not stopping. I’m just staying up.', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 2. the night garden
      {
        id: 's17-step2',
        goal: 'Creep through Luna’s garden to the hide by the nursery without being heard.',
        hint: 'Move when the wind moves the leaves. Keep to moss and thyme, off the gravel, in the shadows of the big flowers.',
        check: 'minigame:sneak:s17-luna-garden',
        scene: {
          id: 's17-night',
          lines: [
            N('After dark Luna’s garden is another country. The white flowers are wide open and the raked paths glow faintly.'),
            LU('We watch the nursery from in here. The flower beds give shadow. The gravel doesn’t. Gravel tells everyone everything.', 'think'),
            LU('Stay on the moss. Stay low. If something lands, don’t stare at it. Owls hate being stared at. So do I.'),
            NO('Can I bring the list?'),
            LU('You can bring the list in your head. Quietly.', 'soft'),
          ],
          choices: [
            {
              id: 'luna',
              label: 'Follow Luna’s path exactly.',
              set: { 's17-path': 'luna' },
              then: [
                LU('Good. Left foot on the thyme. It doesn’t mind. It smells nicer for it.', 'soft'),
              ],
            },
            {
              id: 'own',
              label: 'Find your own way through.',
              set: { 's17-path': 'own' },
              then: [
                N('You step on a snail shell. It cracks like a pistol. The whole garden holds its breath. So does Luna.'),
                LU('…Your own way is very loud.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 's17-reveal',
          lines: [
            N('Midnight. The wind drops. Something crosses the moon without a sound, and the garden goes still beneath it.'),
            N('An owl lands on the nursery roof. She is enormous, grey as ash, and one long feather on her left wing is torn.'),
            N('She lifts an egg out of the straw in her feet, slowly, the way you would carry a held breath.'),
            N('Then she turns her head right round and looks at your hiding place. For a long moment she only looks.'),
            NJ('Hoo-oo.', 'soft'),
            N('And she is gone towards the cliffs, low over the hedges, carrying the egg as if it were the only thing in the world.'),
            NO('…I’m crossing off the badgers.', 'shock'),
            LU('Nightjar. That’s what Hazel called her. I thought she was a story. The biggest owl in the valley, Hazel said.', 'soft'),
            LU('And the saddest.'),
          ],
        },
      },
      // ------------------------------------------------ 3. the nest on the cliff
      {
        id: 's17-step3',
        goal: 'Climb to Nightjar’s nest on the cliff, slowly.',
        hint: 'Use the cracks with ferns growing in them; those are the solid ones. Stop whenever she turns her head.',
        check: 'climb:cliff:s17-nest',
        scene: {
          id: 's17-cliffs',
          lines: [
            N('Next night you follow the way she flew, past the ridge to the high cliffs, where the wind smells of salt and cold stone.'),
            N('Halfway up, wedged in a crack, is a ledge with a nest on it the size of a cartwheel.'),
            NO('I’ve slept up here. Years back. An owl called all night, the same two notes. I thought it was the wind.', 'think'),
            LU('She hunts at the turn of the tide. That’s soon. We could go up while she’s out.', 'think'),
            LU('Or we could wait for her, and let her see us coming. Owls remember faces.'),
          ],
          choices: [
            {
              id: 'sneak',
              label: 'Climb while she’s out hunting.',
              set: { 's17-approach': 'sneak' },
              then: [
                N('You climb fast, hand over hand. You are nearly at the ledge when a shadow drops past you, silent, and settles.'),
                N('She is home. She sits on the nest and looks at you, and does not move.'),
                NO('Well. She was always going to be home, wasn’t she.', 'soft'),
              ],
            },
            {
              id: 'wait',
              label: 'Wait for her, where she can see you.',
              set: { 's17-approach': 'wait' },
              then: [
                N('You sit on a rock below the ledge in plain view. She comes home at the turn of the tide and looks at you a long time.'),
                N('Then she shuffles over, just a little, as if making room.'),
                LU('That’s an invitation. Or a warning. With owls it’s mostly both.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 's17-nest',
          lines: [
            N('The nest is woven of heather, sheep’s wool and grey feathers. Under her, packed snug in a ring, are eggs.'),
            N('Five eggs. Four glow faintly, the way the Grove’s eggs do. Every one is whole. Every one is warm.'),
            N('She has turned them so that each one gets its time in the middle.'),
            N('Woven deep into the lining, where they can never be dropped, are two very old eggshells, grey and cracked across.'),
            LU('Hazel told me about a night before my time. Spring, blossom out. Then a cold came down the valley that had no business there.', 'soft'),
            LU('Frost on the blossom. Ice in the stream. In the morning the owl on the cliff was calling and calling.', 'sad'),
            LU('Hazel said she never really stopped. That was twenty-two years ago.'),
            N('…'),
            NO('That number keeps turning up.', 'think'),
            NJ('Hoo-oo.', 'sad'),
            N('She settles lower over the eggs, the way you would pull a blanket up over someone already asleep.'),
          ],
        },
      },
      // ------------------------------------------------ 4. one at a time
      {
        id: 's17-step4',
        goal: 'Carry the Grove’s eggs back to the nursery, one at a time, while Nightjar watches.',
        hint: 'Carry each egg in both hands and walk, don’t run. If you hurry, she follows you down and you start that egg again.',
        check: 'carry:egg:s17-nest-to-nursery:4',
        scene: {
          id: 's17-return',
          lines: [
            N('She will not let you take them all at once. You lift two and she clacks her beak, once, like a door shutting.'),
            LU('One at a time, then. Down and back. Let her watch each one go, and see you come back for the next.', 'soft'),
            NO('That’s four climbs. In the dark.', 'shock'),
            LU('That’s four climbs. In the dark.', 'happy'),
            N('Nightjar watches you lift the first egg. Her eyes follow it all the way down, and all the way back up to you.'),
          ],
        },
        done: {
          id: 's17-wild',
          lines: [
            N('Dawn. Four eggs back in the nursery straw. You climb up one last time for the lantern you left behind.'),
            N('There is still one egg under her. Small, speckled like lichen, and it doesn’t glow. It isn’t the Grove’s.'),
            NO('That’s nobody’s. Wild. Its mother never came back, I’d guess. It happens.', 'think'),
            N('Nightjar looks at the egg, then at you. She does not hide it. She does not move off it, either.'),
            LU('Leave it with her. Let somebody keep something warm and have it work.', 'soft'),
            N('You leave it. On the way down, Luna stops on the path.'),
            LU('Next spring she’ll come back to the nursery. Grief keeps a better calendar than I do. What do we do?', 'think'),
          ],
          choices: [
            {
              id: 'open',
              label: 'Leave the nursery open, with a lantern lit for her.',
              set: { 's17-nursery': 'open' },
              then: [
                NO('A night nurse. With a beak. That’s either brilliant or a disaster.', 'happy'),
                LU('If she wants eggs to sit on, she can sit on ours, where we can see. Hazel would have done that.', 'soft'),
                LU('Then worried all night. Then done it again.'),
              ],
            },
            {
              id: 'shut',
              label: 'Move the nursery in by the stove, with a latch.',
              set: { 's17-nursery': 'shut' },
              then: [
                LU('That’s fair. The eggs come first. Feed them before you feed yourself, nearly.', 'think'),
                NO('She won’t take it personally. She’ll just sit on the roof and look at the chimney. Sadly. For ever.', 'sad'),
                LU('Then I’ll leave her a mouse on the step now and then. Grief gets hungry.', 'soft'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 5. the hatching
      {
        id: 's17-step5',
        goal: 'Visit Nightjar’s nest on the night the wild egg hatches.',
        hint: 'Take the cliff path after dark. Sit below the ledge and wait; she shuffles aside when she’s ready.',
        check: 'visit:cliff:s17-hatching:night',
        scene: {
          id: 's17-feathers',
          lines: [
            N('Some weeks later there is a feather on your windowsill.'),
            N('Grey, soft as smoke, laid down carefully. Then another, next night.'),
            LU('She’s calling you. The wild one must be hatching. Go after dark. Take nothing. Just go.', 'soft'),
            NO('I’m not coming. I’m not stopping. I’ll be on the cliff path by accident, about nine.'),
          ],
        },
        done: {
          id: 's17-hatching',
          lines: [
            N('The wind has dropped. The egg under her is rocking. Nightjar shifts off it, just enough, and you both watch.'),
            N('A crack. A beak like a fingernail. Then a damp grey thing the size of a dumpling, all eyes, very offended.'),
            NJ('Hoo-oo. Hoo-oo.', 'happy'),
            N('The same two notes. They don’t sound the same at all.'),
            N('Later the fledgling tumbles across the rock and into your lap. Nightjar watches. She does not call it back.'),
            LU('She’s sharing. Owls don’t share. Look at that.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 's17-complete',
      lines: [
        N('At the end of autumn Nightjar moults, and the wind brings her old grey feathers down into the Grove.'),
        LU('I’ve sewn them into a cloak. Don’t ask how long it took. I’ll tell you, and then you’ll feel bad.', 'happy'),
        N('It is as light as breath and as warm as a bird.'),
        N('That night, on the cliff top in the cloak, you hear a hush of wings behind you. Two careful feet take hold of your collar.'),
        N('The valley turns under you, silver and black. The Grove comes up to meet you as gently as an egg set down in straw.'),
        NO('Show-off. I walked for years to see this valley properly, and you did it in a minute.', 'happy'),
        NO('…Take me next time.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 's17-fledgling',
        kind: 'item',
        label: 'Nightjar’s fledgling (petpet)',
        description:
          'A grey, round, permanently offended owlet. It comes to you at dusk and goes home to its mother on the cliff at dawn. Only if you visited the hatching.',
      },
      {
        id: 's17-night-glide',
        kind: 'feature',
        label: 'Night glide',
        description:
          'Fast travel from the cliff top by night: wear the feather cloak, stand at the edge, and Nightjar glides you down to the Grove.',
      },
      {
        id: 's17-feather-cloak',
        kind: 'cosmetic',
        label: 'Feather cloak',
        description: 'Nightjar’s moulted grey feathers, sewn into a cloak by Luna. Light as breath, warm as a bird.',
      },
    ],
    sets: { s17Done: true },
    notes:
      'FOR FUN. Sets only s17Done plus s17-path (luna | own), s17-approach (sneak | wait) and s17-nursery (open | shut). ' +
      'Opens in chapter 7 (autumn) and only if the player has a nursery placed; must complete before chapter 10 begins. ' +
      'S2’s Wisp is never mentioned or blamed: S2 has ended by chapter 7, and Wisp takes warm things, not eggs. ' +
      'SECRETS: the cold “out of season” twenty-two years ago is Corvin’s shard, but the story never says so; Nova’s ' +
      '“That number keeps turning up” is the whole hint. Do not add more. ' +
      'EGGS: for the story, four of the player’s nursery eggs go missing over the fortnight before the trigger (or use ' +
      'placeholder eggs if fewer exist; they hatch normally once returned and belong to the player). They are always ' +
      'safe. NIGHTJAR: a huge grey owl (about three Keepers tall when perched), torn primary on the left wing; she never ' +
      'speaks words, only the two-note call (SFX) with a portrait. STEP 2 MINI-GAME (sneak): side-on stealth through ' +
      'Luna’s garden; moss and thyme tiles are silent, gravel crunches, snail shells crack. Move during wind gusts (leaves ' +
      'rustle) for free noise cover. Being heard just resets you to the last flower bed; no fail state. If s17-path is ' +
      '“luna”, show Luna’s footprints as a guide line. STEP 3: a short climb on the sea cliffs past the ridge; ferned ' +
      'cracks are safe holds; freeze when Nightjar turns her head. STEP 4: four carries, nest → nursery; running makes ' +
      'Nightjar follow and that carry restarts. STEP 5: offered a few in-game weeks later (any night before chapter 10); ' +
      'feathers appear on the cottage windowsill as the prompt. If chapter 10 begins before step 5 is done, the story ' +
      'completes at that point WITHOUT the fledgling (skip s17-hatching; still play s17-complete and give the cloak and ' +
      'night glide). FLEDGLING: a petpet that appears at dusk and leaves at dawn. NIGHT GLIDE: a fast-travel point at the ' +
      'cliff top, usable only at night with the feather cloak equipped; short gliding cutscene to the Grove gate. ' +
      'NURSERY PAYOFF (s17-nursery). s17-complete plays one extra narrator line straight after its third line (index 2, ' +
      '“It is as light as breath…”): with open, N “On the nursery roof a lantern burns every night now. Some nights a ' +
      'grey shape sits beside it, very still.”; with shut, N “Some nights a grey shape sits on the cottage roof and looks ' +
      'down the chimney. Luna leaves a mouse on the step.” ' +
      'SEASON. Frost in chapter 7 is the shard’s sign (round the empty Long-Grass post), so S17 shows no ordinary frost.',
  },

  // ================================================================== S18
  {
    id: 's18',
    code: 'S18',
    title: 'The Grove Museum',
    source:
      'Inspired by Animal Crossing’s museum and its owl curator who fears bugs, and Stardew Valley’s community centre (themes only)',
    audience: 'all',
    trigger: {
      where: 'Hazel’s old barn',
      when: 'Chapter 6, the day after c6-close (after Fossil’s farewell). Closes in chapter 11.',
    },
    speakers: [DELVE],
    steps: [
      // ------------------------------------------------ 1. the barn, and the fossils
      {
        id: 's18-step1',
        goal: 'Dig three fossils from the cliff layers with Dusty, and sort them oldest to youngest.',
        hint: 'Lower layers were laid down first, so they are older. Note how deep each find was, then sort them.',
        check: 'minigame:dig:s18-cliff-layers',
        scene: {
          id: 's18-barn',
          lines: [
            N('Hazel’s old barn smells of hay, apples and long-ago rain. Swallows’ nests line the rafters like little clay cups.'),
            N('In the middle of the floor stands a mole in a tweed waistcoat, beside a wheelbarrow full of empty glass cases.'),
            DE('Ah. The grandchild. Professor Delve, archivist. I wrote to your grandmother about a museum. She said yes.', 'happy'),
            DE('In principle. Eleven years ago. Moles are patient. I have come to collect the principle.'),
            DE('Four wings. Three exhibits each. Fossils, night creatures, shore life, the heavens. Twelve. A tidy number.'),
            DE('Every exhibit gets a plaque, and every plaque must be true. Not nearly true. Not true-ish. True.', 'think'),
            N('A small brown moth drifts down from the rafters and lands on the end of his nose.'),
            DE('Oh. Oh dear. Oh, no, not one of—', 'shock'),
            N('Professor Delve faints, quite neatly, into the wheelbarrow.'),
            DE('I’m perfectly all right. I’m simply horizontal.', 'sad'),
            N('A muddy figure in the doorway: Dusty, two days after the rain on the hill, holding a trowel with nothing to use it on.'),
            DU('I heard “fossils”. From the lane. My hands want something to do. Can they do this?', 'soft'),
          ],
        },
        done: {
          id: 's18-fossils',
          lines: [
            N('The cliff is striped like a cake: sand, then red rock, then grey shale, then a dark band just above the beach.'),
            DU('Deeper’s older. Rock goes down in layers, like blankets on a bed. Nobody puts the bottom blanket on last.', 'think'),
            N('A coiled shell near the top. A fern pressed flat in the red rock.'),
            N('And deep in the dark band, a little armoured bug.'),
            DU('Fossil used to sit right there while I dug. Supervising. She was terrible at it. She slept.', 'happy'),
            DU('…It’s quiet without the snoring.', 'soft'),
            N('Back at the barn, Professor Delve reads each plaque aloud before he’ll let it go on the wall.'),
            DE('“Trilobites were sea animals with jointed shells, relatives of insects and crabs. They lived for over 250 million years.”'),
            DE('“Ferns have no flowers and no seeds. They spread by spores, which usually form under their leaves.”'),
            DE('“Ammonites were sea animals related to squid and octopus. They died out about 66 million years ago.”'),
            DE('True, true and true. Wing one. Somebody check my nose for moths.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 2. night creatures
      {
        id: 's18-step2',
        goal: 'Run the moth trap in Luna’s garden and wait quietly for three night finds.',
        hint: 'Sit still near the sheet: every time you move, finds come slower. At dawn, look under the ash tree.',
        check: 'minigame:moth-trap:s18-luna-garden',
        scene: {
          id: 's18-night',
          lines: [
            N('Luna hangs a white sheet between two apple trees and sets a lantern under it. The sheet glows like a sail at sea.'),
            LU('A moth trap. Nothing gets hurt. They land on the sheet, we look, we draw, and at dawn they go home.', 'soft'),
            LU('The museum gets the drawings. Living things aren’t exhibits. They’re neighbours.'),
            DE('I shall supervise from a safe distance. Of about a mile.', 'think'),
            N('He sits under a blanket at the far end of the garden, holding a tin of smelling salts like a cup of tea.'),
            LU('Now the hard part. We wait, and we don’t talk.', 'soft'),
            LU('…That was me talking. Starting now.', 'happy'),
          ],
        },
        done: {
          id: 's18-night-finds',
          lines: [
            N('Near midnight a moth lands on the sheet, green and black like lichen on old bark. You lose it twice while looking at it.'),
            LU('Merveille du Jour. “Marvel of the day”, and it flies by night. Somebody had a sense of humour.', 'happy'),
            N('From the far end of the garden comes a soft thump. Professor Delve has fainted from a mile away, on principle.'),
            N('By dawn you have a drawing of the moth, a spider’s web lifted whole onto black card, and an owl pellet from under the ash.'),
            DE('“The Merveille du Jour is a moth that flies in autumn. Its green and black wings hide it on lichen-covered bark.”'),
            DE('“Owls swallow small prey whole. The fur and bones they can’t digest are pressed into a pellet and coughed up.”'),
            DE('“Garden spiders spin webs from silk made in their own bodies. They often eat the old web before spinning a new one.”'),
            DE('Recycling. Admirable. Somebody turn the moth drawing to face the wall whenever I walk past.', 'think'),
          ],
        },
      },
      // ------------------------------------------------ 3. shore life
      {
        id: 's18-step3',
        goal: 'Find three shore creatures in Marina’s rock pools before the tide turns.',
        hint: 'Look under the weed and the flat stones, and put each stone back the way you found it. When the water reaches the barnacles, the tide is turning.',
        check: 'minigame:rock-pool:s18-low-tide',
        scene: {
          id: 's18-shore',
          lines: [
            N('Low tide past the ridge. Marina’s rock pools are full of sky, and the weed smells of salt and pennies.'),
            MA('Rules. Turn a stone, turn it back the same way up. That’s somebody’s roof.', 'think'),
            MA('Living things go back before the tide turns. The museum gets drawings, and whatever they’ve finished with.'),
            MA('And the tide comes back whether you’re ready or not. It’s very rude like that.', 'happy'),
            DE('I have brought a bucket, a net and a deep respect for things with pincers.'),
            N('A small crab sidles past the professor’s boot. He doesn’t faint. He looks extremely pleased about it.'),
            DE('Not a moth. A good day.', 'happy'),
          ],
        },
        done: {
          id: 's18-shore-finds',
          lines: [
            N('A sea star the colour of a ripe apricot, one arm short and growing back. A limpet, clamped in its own worn hollow.'),
            N('And a hermit crab halfway between houses, hurrying out of a cramped winkle shell into a roomy whelk.'),
            DE('Drafts for the plaques. “A sea star can regrow an arm it has lost. Many have a simple eye at the tip of each arm.”'),
            DE('“A limpet grazes on the rock when the tide is in. When the tide goes out, it returns to its own spot, its home scar.”'),
            DE('“A hermit crab keeps its soft body inside an empty snail shell. When it outgrows one, it moves to a bigger one.”'),
            MA('Look. It’s left the old shell behind. Perfect, that. Somebody else will want it. A smaller crab.', 'think'),
            DE('Or a museum. A museum would want it very much. I am only saying.', 'think'),
          ],
          choices: [
            {
              id: 'take',
              label: 'Take the empty shell for the museum.',
              set: { 's18-shell': 'taken' },
              then: [
                MA('Fair. There are plenty of shells. There’s only one museum.'),
                DE('It shall have a velvet cushion. A small one. The crab would want it small.', 'happy'),
              ],
            },
            {
              id: 'leave',
              label: 'Leave the shell for the next crab.',
              set: { 's18-shell': 'left' },
              then: [
                MA('Good. That’s how pools work. Somebody’s old house is somebody’s new one.', 'soft'),
                DE('Then we shall have a drawing. Drawings never need a bigger house.', 'happy'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 4. the heavens
      {
        id: 's18-step4',
        goal: 'On a clear night on the hill, find the Pole Star with Nova, then wait up for the Moon.',
        hint: 'Find the seven stars of the Plough. The two at the end of the pan point towards the Pole Star. The Moon rises late, in the east.',
        check: 'minigame:stargaze:s18-hill',
        scene: {
          id: 's18-stars',
          lines: [
            N('Nova is on the western hill at nightfall, flat on her back in the cold grass beside the memorial flowers.'),
            NO('Clear night. No moon till late. Best sky in the valley. I’ve slept under most of them, so I’d know.'),
            NO('I brought you something for the museum. I don’t give people things. It’s a rock. Don’t make it a moment.', 'think'),
            N('She drops a stone the size of a walnut into your palm: black, heavy for its size, with a crust like burnt toast.'),
            NO('I watched it come down over the moor, years back. Walked two days to find it. Carried it ever since.'),
            DE('A meteorite! Oh, that is wonderful. And it isn’t a moth. A very good day.', 'happy'),
            NO('Now. Find me north. Then you can have the other two exhibits as well.'),
          ],
        },
        done: {
          id: 's18-star-finds',
          lines: [
            N('The Pole Star isn’t the brightest. It’s just the one that stays put while the whole sky wheels slowly round it.'),
            NO('That one got me home more times than I’ve told anyone. Which is none.', 'soft'),
            N('Near midnight the Moon comes up over the ridge, low and orange, and goes white as it climbs.'),
            NO('Same face. Always the same face. Hazel looked at that face. So did whoever was here before her.', 'soft'),
            DE('“Polaris, the Pole Star, sits almost directly above Earth’s North Pole, so it hardly moves across the night sky.”'),
            DE('“The Moon always shows Earth the same face. Its pull, together with the Sun’s, raises the tides.”'),
            DE('“A shooting star isn’t a star. It is space rock or dust burning up in Earth’s air. A piece that lands is a meteorite.”', 'happy'),
            NO('You read plaques to the sky, Professor.', 'happy'),
            DE('The sky has never once corrected me. I find that very restful.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 5. the centre case
      {
        id: 's18-step5',
        goal: 'Fill the centre case, then talk to Professor Delve at the barn door.',
        hint: 'Place the centre-case exhibit in the middle of the barn, then speak to the professor by the door.',
        check: 'place:decor:s18-centre-case',
        scene: {
          id: 's18-heart',
          lines: [
            N('Twelve cases full, and one more. The big one in the middle of the barn, under the empty swallows’ nests, is bare.'),
            DE('The centre case. Every museum has one. It holds the thing the rest of the museum is for.', 'think'),
            N('Dusty comes in out of the cold, turning something over in their hands: a card, bent at one corner.'),
            DU('Fossil’s card. From the hill. The rain got at it, so I made a new one for the flower and kept this.', 'soft'),
            DU('I don’t want it in a drawer. I don’t want it rained on. I want it somewhere people come.', 'sad'),
            DE('That is exactly what a museum is for. A museum is a place where a valley remembers.', 'soft'),
            DE('Though I wonder. Your grandmother kept a hatch register. Every egg in forty years, and its first sound.'),
            DE('That is not one Nubbin remembered. That is all of them. It could go in the middle. On loan, naturally.', 'think'),
            DU('…That’s fair. That’s a good thing. It just isn’t Fossil.', 'sad'),
          ],
          choices: [
            {
              id: 'card',
              label: 'Put Fossil’s card in the centre case.',
              set: { 's18-centre': 'card' },
              then: [
                DU('Thank you. She’d hate the glass. She’d sit on top of it.', 'happy'),
                DE('And the register stays in the cottage, where it is still being written. Quite right. It isn’t finished.', 'soft'),
              ],
            },
            {
              id: 'register',
              label: 'Put Hazel’s hatch register in the centre case.',
              set: { 's18-centre': 'register' },
              then: [
                DU('Can her card go in it? Tucked in the front. Like a bookmark.', 'soft'),
                DE('A bookmark is permitted. A bookmark is, in fact, encouraged.', 'happy'),
                DE('On loan. It goes home the moment the family wants it. I’ll carry it myself.', 'soft'),
              ],
            },
            {
              id: 'empty',
              label: 'Leave the case empty, for whoever comes next.',
              set: { 's18-centre': 'empty' },
              then: [
                N('You prop a card in the empty case: “For whoever this valley remembers next.”'),
                DE('An empty case. Most irregular. People will stand in front of it for a very long time.', 'think'),
                DU('Good. Let them. Fossil’s card can go on the ledge beside it, where people put their hands.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 's18-door',
          lines: [
            N('The barn is swept. Twelve plaques shine.'),
            N('The swallows are long gone south and have left their clay cups behind.'),
            DE('One last matter. The door. Glass needs polishing. Plaques come loose. Archivists need… worms.', 'think'),
            DE('Two Shells a visit would keep the place standing. Or it could be free, and we would manage. Somehow. Probably.'),
          ],
          choices: [
            {
              id: 'shells',
              label: 'Charge two Shells, for upkeep.',
              set: { 's18-entry': 'shells' },
              then: [
                DE('Sensible. A place that costs nothing is a place nobody remembers to mend.', 'think'),
                DE('Anyone shorter than the door handle goes free. I insist. I have measured.', 'happy'),
              ],
            },
            {
              id: 'free',
              label: 'Keep it free.',
              set: { 's18-entry': 'free' },
              then: [
                DE('Free. Hm. A place where a valley remembers ought to belong to the valley. I agree.', 'think'),
                DE('I shall put out a jar. Nobody need put anything in it. The jar is merely hopeful.', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 's18-complete',
      lines: [
        N('On opening day half the valley comes, and most of them stand at the centre case longer than they meant to.'),
        N('Children press their noses to the trilobite. Sparks reads every plaque aloud, loudly, to people who are reading them.'),
        DE('You did this, Curator. I only had the principle.', 'happy'),
        N('He gives you a brass magnifying glass on a ribbon, worn smooth where a great many thumbs have held it.'),
        DE('It was mine. I can’t see much through it any more. I’d like it to keep looking at things.', 'soft'),
        N('Then a moth comes in through the open door, and the Curator’s first official act is to catch the professor.'),
      ],
    },
    rewards: [
      {
        id: 's18-museum',
        kind: 'feature',
        label: 'The Grove Museum',
        description:
          'Hazel’s old barn as a building you can visit: four wings of three exhibits, each with a plaque stating a true fact, and the centre case you chose.',
      },
      {
        id: 's18-curator',
        kind: 'title',
        label: '“Curator”',
        description: 'Professor Delve’s name for you, now official.',
      },
      {
        id: 's18-magnifier',
        kind: 'cosmetic',
        label: 'Delve’s magnifying glass',
        description: 'A brass magnifying glass on a ribbon, worn smooth by a great many thumbs. Your Keeper wears it at the neck.',
      },
    ],
    sets: { s18Done: true },
    notes:
      'FOR FUN. Sets only s18Done plus s18-shell (taken | left), s18-centre (card | register | empty) and s18-entry ' +
      '(shells | free). NO CHORE LOOP: the twelve exhibits are fixed and found once; nothing restocks. ' +
      'TIMING: opens the day after c6-close (Fossil has faded; Dusty is grieving, which is why their hands want work). ' +
      'Step 2 is offered on autumn nights only (chapter 7 on), because the moth is an autumn species. Steps 3 and 4 any ' +
      'time after; step 4 needs a clear night (force one once offered). Step 5 is offered once all four wings are done, ' +
      'from chapter 9 on, and must finish by the end of chapter 11; if chapter 12 begins first the story closes ' +
      'unfinished and the barn stays a half-built museum (no rewards). Hazel never appears. ' +
      'THE REGISTER ON LOAN. With s18-centre = register, the register lives in the centre case, but S6 (step 2, chapter ' +
      '9 on) and S10 (wish one, chapter 11) both need it at the cottage. Whenever one of those steps starts, Delve has ' +
      'brought it back to the cottage table, as he promised; the S6 and S10 notes give their hint and line variants. It ' +
      'goes back to the case afterwards, with the new pages in it. ' +
      'PROFESSOR DELVE: elderly mole in a tweed waistcoat, round spectacles. Running gag: he faints at moths (a drawing of ' +
      'one, or one a mile away). Faint = flop pose, small “thump” SFX. ' +
      'THE TWELVE EXHIBITS AND PLAQUES (plaque text = Delve’s quoted lines; ship verbatim). Fossils wing: trilobite, fern ' +
      'fossil, ammonite. Night wing: Merveille du Jour (Luna’s drawing; the moth is released), owl pellet, garden spider’s ' +
      'web on black card. Shore wing: sea star (drawing), limpet (drawing), hermit crab (the empty winkle shell if ' +
      's18-shell is taken, otherwise a drawing). Stars wing: star chart marked with the Pole Star and the Plough, drawing ' +
      'of the Moon, Nova’s meteorite. Living creatures always go back; the museum keeps drawings and things finished with. ' +
      'MINI-GAMES (no fail states): dig = tap-dig a cliff cross-section with four coloured strata; three finds, each in its ' +
      'own layer; then drag them into order oldest → youngest (deepest = oldest; Dusty repeats the blanket line on a wrong ' +
      'order). moth-trap = a quiet-wait game: a stillness meter fills while the player doesn’t move; three finds arrive at ' +
      'thresholds (moth on the sheet, web found by lantern, pellet at dawn under the ash). rock-pool = turn stones and lift ' +
      'weed before the water line reaches the barnacles; any stone left upside down flashes until turned back; finds can ' +
      'be drawn, then must be returned. If the tide wins, the pool resets at the next low tide. stargaze = drag to pan the ' +
      'night sky; tap the seven Plough stars, draw the pointer line to the Pole Star, then a time skip to moonrise in the ' +
      'east. CENTRE CASE: place the chosen object (card, register, or the empty case with its card) as a decor item in the ' +
      'barn. If “card”, the register stays readable on the cottage bookshelf. ENTRY: “shells” charges 2 Shells a visit ' +
      '(free under the door-handle height = all Nubbins and child NPCs); “free” adds a donation jar. REWARDS at ' +
      's18-complete; the museum becomes a visitable building, with every plaque readable.',
  },
];

export const CHECKS: string[] = [
  // S12
  'carry:nubbin:s12-solo:old-wall',
  'listen:old-wall:s12-queen-mother',
  'sit:s12-solo:luna-garden:dawn',
  'minigame:tuning-fork:s12-swarm',
  // S17
  'inspect:nursery:s17-clues',
  'minigame:sneak:s17-luna-garden',
  'climb:cliff:s17-nest',
  'carry:egg:s17-nest-to-nursery:4',
  'visit:cliff:s17-hatching:night',
  // S18
  'minigame:dig:s18-cliff-layers',
  'minigame:moth-trap:s18-luna-garden',
  'minigame:rock-pool:s18-low-tide',
  'minigame:stargaze:s18-hill',
  'place:decor:s18-centre-case',
];
