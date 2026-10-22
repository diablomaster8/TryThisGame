/**
 * The four "for fun" side stories of "Hazel’s Grove" (story bible v2, side-story table):
 *   S1 The Wardens’ Walk     chapter 4 → chapter 9   lore only: four posts, four memories
 *   S3 The Cycle             chapter 4 → chapter 11  the Sun and Moon feud, ends at a Lantern Moot
 *   S4 The Wellspring        chapter 5 → before ch8  Marina’s tide pools, Corvin’s dam, the ledge path
 *   S5 Fossil’s Last Walk    chapter 5 → chapter 6   Fossil’s last wishes before chapter 6’s farewell
 *
 * None of these changes the campaign. Each sets only its own `sNDone` flag on completion,
 * plus harmless bookkeeping flags prefixed `s1-` / `s3-` / `s4-` / `s5-` from choices. They
 * never read or write campaign flags (`corvin`, `wisp`, `keptStone`…), never move Moss’s
 * chapter 10 threshold (bible, conflict 4), and add no options to chapter 9 (conflict 17).
 *
 * Timing: a step’s `scene` plays when the step starts, which is the moment the previous
 * step’s `check` is met; its `done` scene plays when its own `check` is met. Checks like
 * `chapter:9:end` are how a story waits across chapters. Where a step coincides with a
 * chapter scene, the chapter scene plays first.
 *
 * What the player knows: each scene stays inside what the campaign has told them by then.
 * S1’s first three memories can play anywhere from chapter 4 to chapter 9, so they only use
 * chapter 4’s Tale of the Four; S1’s last memory plays after c9-close, when the fourth shard
 * is home. S3’s ending plays in chapter 11, so it may include Hazel; nothing earlier does.
 *
 * Audience 'all'. All words are original. Cinder’s rhyme is the bible’s own, used as
 * written. No childLines are needed.
 */
import type { Line, Mood } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const Y = say('you');
const M = say('moss');
const HZ = say('hazel');
const FE = say('fern');
const MA = say('marina');
const SP = say('sparks');
const CL = say('clover');
const PX = say('pixel');
const LU = say('luna');
const EM = say('ember');
const BY = say('byte');
const DU = say('dusty');
const NO = say('nova');

// ---------------------------------------------------------------- new speakers
/** Memory voices: Eternals long gone, heard only through Moss at their lantern posts. */
const BRIAR: Speaker = { id: 'briar', name: 'Briar', kind: 'nubbin' };
const HUSH: Speaker = { id: 'hush', name: 'Hush', kind: 'nubbin' };
const CINDER: Speaker = { id: 'cinder', name: 'Cinder', kind: 'nubbin' };
/** Shared speaker id, also used by the other side-story files. */
const YOUNG_HAZEL: Speaker = { id: 'young-hazel', name: 'Young Hazel', kind: 'keeper' };
const FOSSIL: Speaker = { id: 'fossil', name: 'Fossil', kind: 'nubbin' };

const BR = say('briar');
const HU = say('hush');
const CI = say('cinder');
const YH = say('young-hazel');

export const SIDE_STORIES_FUN: Quest[] = [
  // ================================================================== S1
  {
    id: 's1',
    code: 'S1',
    title: 'The Wardens’ Walk',
    source: 'Hazel’s Grove original: the Ages of the Grove (story bible, the Four Wardens)',
    audience: 'all',
    trigger: {
      where: 'The Grove, by the pond lantern',
      when: 'Chapter 4, straight after c4-close, once the Long-Grass lantern has flickered out.',
    },
    speakers: [BRIAR, HUSH, CINDER, YOUNG_HAZEL],
    steps: [
      {
        id: 's1-step1',
        goal: 'Walk beside Moss to the stream lantern, at his pace.',
        hint: 'Moss walks very slowly. Stay next to him; if you get ahead, he stops and waits for you to notice.',
        check: 'walk:moss:lantern-stream',
        scene: {
          id: 's1-ask',
          lines: [
            N('The Keepers drift home with their empty cups. Three lanterns burn; the fourth post, by the long grass, is dark.'),
            N('Moss hasn’t gone back up the hill. He is sitting by your boot, looking at the dark post.'),
            Y('Twenty-two years?'),
            M('Not tonight. Ask me something else. Ask me anything else.', 'think'),
            M('I told you the tale. A tale is the part that fits in a song. The rest doesn’t fit anywhere.', 'soft'),
            M('At each post there’s one small thing I keep that isn’t in the tale. Four posts. Four small things.'),
            M('Hazel used to walk round them with me every Lantern Night. Slowly. I would like to do it again.', 'soft'),
            M('Very slowly. I am older than the trees, and the trees are not in a hurry either.'),
          ],
          choices: [
            {
              id: 'walk',
              label: 'Walk beside him.',
              set: { 's1-pace': 'walk' },
              then: [
                N('You walk, and it takes a long time to cross the grass. Halfway, you realise that is the point.'),
                M('Good. You didn’t sigh. Hazel sighed for the first ten years.', 'happy'),
              ],
            },
            {
              id: 'carry',
              label: 'Offer to carry him.',
              set: { 's1-pace': 'offered' },
              then: [
                M('Certainly not. I have legs. They are very short and very old, but they are mine.', 'think'),
                M('Ask me again another year. I may surprise us both.', 'soft'),
              ],
            },
            {
              id: 'which',
              label: 'Ask which post comes first.',
              set: { 's1-pace': 'asked' },
              then: [
                M('Briar’s, by the stream. She hated waiting more than anything, except being sad.', 'happy'),
                M('She was very good at not being sad. It was most of what she did.'),
              ],
            },
          ],
        },
        done: {
          id: 's1-briar',
          lines: [
            N('The stream lantern hisses softly in the damp. Moss looks at it for a while before he speaks.'),
            M('Briar. Joy, the songs call her. That’s a big word. She laughed. That was mostly it.', 'happy'),
            M('She laughed at frogs. At weather. At me, constantly. When she was frightened she laughed loudest of all.'),
            M('When it was her time she went up the hill laughing. She said she’d thought of a joke and wanted to tell the view.'),
            N('For a moment the lantern light goes old and gold, and you hear a voice that isn’t his.'),
            BR('If I’m not down by supper, eat mine. If I’m not down by spring, plant something nice.', 'happy'),
            M('Nobody had to plant anything. Something yellow came up where she sat. The first memorial flower.', 'soft'),
            M('Typical. She always got the last word.', 'happy'),
            M('I never found out what the joke was. Some evenings I sit up there and try to guess.', 'soft'),
          ],
        },
      },
      {
        id: 's1-step-boats',
        goal: 'Play Briar’s game: float a lit leaf-boat from the stream lantern all the way to the pond.',
        hint: 'Tap the water behind the boat to nudge it on. Keep it off the reeds or the candle goes out. Leaves are free.',
        check: 'float:leaf-boat:stream-pond',
        scene: {
          id: 's1-boats-ask',
          lines: [
            M('She had a game. Of course she had a game. Leaf-boats, a candle stub in each, from her post down to mine.', 'happy'),
            M('If yours reached the pond still lit, you had to laugh out loud. Those were the rules. She wrote them.'),
            M('There were eleven rules. Nine of them were about laughing.', 'think'),
            N('He produces a dock leaf from somewhere, folded very precisely, with a stub of candle stood in it.'),
            M('I have never once got one to the pond. Not in all the years. She said I watched it too hard.', 'think'),
            M('I have been watching it less hard, on purpose, for a very long time. It hasn’t helped.'),
          ],
          choices: [
            {
              id: 'flat',
              label: 'Fold yours wide and flat.',
              set: { 's1-boat': 'flat' },
              then: [M('Briar’s way. Flat as a pancake and twice as smug.', 'happy')],
            },
            {
              id: 'sail',
              label: 'Give yours a sail.',
              set: { 's1-boat': 'sail' },
              then: [
                M('A sail. Nobody has ever thought of a sail.', 'shock'),
                M('…I don’t know if that’s allowed. She’d have allowed it. She’d have been furious she didn’t think of it.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 's1-boats',
          lines: [
            N('The stream takes the boats as if it has been waiting all year. Moss’s tips over at once, with enormous dignity.'),
            M('Every year.', 'think'),
            N('Yours wobbles past the stepping stones, spins once at the reed bend, and slides out onto the pond. The candle is still lit.'),
            N('Your Nubbin, who has run beside it the whole way along the bank, sits down hard in astonishment.'),
            M('Well? Rules are rules.'),
            N('You laugh. It comes out louder than you meant, and it carries right across the water.'),
            M('…There. That’s the sound. I haven’t heard it at this post in a very long time.', 'soft'),
            N('Behind you, Moss’s boat drifts back to the bank upside down, as if it would quite like another go.'),
            M('Next Lantern Night. And the one after. Somebody ought to.', 'soft'),
          ],
        },
      },
      {
        id: 's1-step2',
        goal: 'Walk with Moss to the lantern by the old wall.',
        hint: 'Hush’s post is on the north side of the Grove, by the tumbled stone wall. Go on a quiet evening.',
        check: 'walk:moss:lantern-wall',
        scene: {
          id: 's1-wall-ask',
          lines: [
            N('A few evenings later Moss is waiting at the gate. He has clearly been waiting a while, and would like you to know it.'),
            M('The old wall next. Hush’s. Feed them first. I’ll wait. I am, you’ll have noticed, good at it.'),
            N('Byte is leaning on the wall with a notebook, being casual in a way that took planning.'),
            BY('Is he talking? Right now? Ask him something only he would know. For verification.', 'think'),
            M('Tell the pale one it’s the other shoe this time.'),
            N('Byte looks down at both shoes. Byte goes very quiet, and leaves.'),
            M('Hush was the quiet one. People think quiet is restful. Hush wasn’t resting. Hush was listening.', 'think'),
            Y('Listening to what?'),
            M('Whatever you weren’t saying. Come on. Mind the step.'),
          ],
        },
        done: {
          id: 's1-hush',
          lines: [
            N('The lantern by the old wall burns lower than the others, steady and quiet, like a candle in an empty room.'),
            M('After the White Year, some of the stilled ones never moved again. They sat where they were set down.', 'sad'),
            M('The rest of us were busy. Mending. Hatching. Getting the valley warm. Hush sat with the still ones.'),
            M('Every one. Every day. She didn’t try to wake them. She kept them company, so they weren’t alone in it.'),
            N('Moss stops. When he goes on, his voice is smaller.'),
            M('The last of them faded on a winter morning, under this wall, with Hush beside it.', 'soft'),
            N('The memory comes up slowly, like breath on cold glass.'),
            HU('That’s the last of them, Moss. Somebody kept them. I think I’d like to be kept now.', 'soft'),
            M('She called grief a kind of keeping. You hold it, so it doesn’t get dropped all over the valley.', 'soft'),
            M('She held it a very long time. Then she put it down. I’ve never thought that was weakness.'),
          ],
        },
      },
      {
        id: 's1-step3',
        goal: 'Walk with Moss to his own lantern, by the pond.',
        hint: 'The pond post is Moss’s own. Go at dusk; he likes the light then.',
        check: 'walk:moss:lantern-pond',
        scene: {
          id: 's1-pond-ask',
          lines: [
            N('Moss is on the hill when you look for him, and by the pond when you stop looking. That seems to be how it works.'),
            M('Mine. I’ve been putting it off. Not because it’s sad. Because it’s mine, and I talk too much about myself.', 'think'),
            M('Sit. No, closer. There. That’s where she sat.', 'soft'),
            Y('Hazel?'),
            M('Hazel. Before she was anybody’s gran. Before she was anybody’s anything.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit where she sat.',
              set: { 's1-sat': true },
              then: [
                N('The grass there is worn, very slightly, in the shape of someone who came back to the same spot for forty years.'),
                M('She’d say you were sitting in it wrong. You aren’t.', 'happy'),
              ],
            },
            {
              id: 'why',
              label: 'Ask him why he chose her.',
              set: { 's1-asked-why': true },
              then: [
                M('Patience. I’m getting there. Rush me and I’ll start from the Spring Age, and we’ll be here till May.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 's1-hazel',
          lines: [
            N('The pond lantern burns clean and warm. Moss looks at the water, not at you.'),
            M('She came here young. Clever, cross, and in a terrible hurry. She wanted the Nubbins to love her by Tuesday.', 'happy'),
            M('They didn’t. So she sat by this pond every day and complained to the nearest thing that would listen. Me.'),
            M('I didn’t say a word. All winter. She fidgeted the whole time, and never once asked me to.', 'happy'),
            N('The light goes old and gold. Snow, in the memory, and a young woman in a coat too big for her, sitting on a frozen bank.'),
            YH('I don’t know what I’m doing. I don’t suppose you do either.', 'sad'),
            M('And at the first thaw, I looked up at her and said, “You’ll do.”', 'happy'),
            M('She laughed so hard she fell in the pond. It was only ankle-deep. She has never let me forget it.'),
            YH('You sat with me all winter. Why?', 'soft'),
            M('Because you kept coming back. That’s all it ever takes. Most people don’t.', 'soft'),
            N('The memory thins. The pond is a pond again, with your face in it, and his.'),
            M('Her third rule. Sit down next to them and wait. She thinks she invented it. I’ve never had the heart to say.', 'happy'),
          ],
        },
      },
      {
        id: 's1-step4',
        goal: 'Moss won’t visit the Long-Grass post while it stands empty. He’ll tell you when.',
        hint: 'This story finishes in chapter 9. Carry on with the campaign.',
        check: 'chapter:9:end',
        scene: {
          id: 's1-wait',
          lines: [
            N('You look across the Grove at the fourth post, by the long grass. Moss doesn’t.'),
            M('Not that one. Not while it’s empty.', 'sad'),
            N('Over the lane, somebody’s children are skipping, chanting in the flat sing-song children keep for old things.'),
            N('“Cinder held them close and tight, / kept them warm one winter night;”'),
            N('“when the morning came to call, / they did not move at all.”'),
            M('They’ve got the words right. They’ve got her wrong.', 'soft'),
            M('Everybody remembers her winter. Somebody should remember the rest of her. I’ll tell you. When it’s home.'),
            Y('When what’s home?'),
            M('Feed them. Go to bed. Ask me again when I ask you.', 'think'),
          ],
        },
        done: {
          id: 's1-cinder',
          lines: [
            N('Three nights before the longest night. Frost reaches out of the long grass in thin white fingers.'),
            N('Moss is waiting at your door. He is so faint you can see the doorstep through him.'),
            M('All four home. I said I’d tell you. You can carry me this time. Don’t make a face.', 'soft'),
            N('You carry him to the fourth post. He weighs almost nothing, like a bird’s nest with opinions.'),
            M('Everyone remembers Cinder in the snow. I’m going to tell you about the day before.'),
            M('Hot. The hottest day anyone could remember. The Nubbins lay flat in the long grass like dropped gloves.'),
            M('Cinder spent the whole day carrying them into the shade, one at a time. They kept wandering back out.', 'happy'),
            N('The light goes old and gold, then red at the edges. There is a smell of hot grass, and a voice, fierce and fond.'),
            CI('Out of the sun, you silly things. You’ll burn. Come here. Come here. I’ve got you.', 'happy'),
            M('She was never gentle. But she was never once tired of them. Not once, in all the years.', 'soft'),
            M('That night the first snow came. In summer. And it didn’t stop.', 'sad'),
            N('The memory goes white, and is gone. Frost glitters at the foot of the post.'),
            M('Cinder-love, they call it now. A love that holds too tight. It’s fair. It isn’t all of her.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 's1-complete',
      lines: [
        M('There. Now two of us remember her warm. That’s twice as many as yesterday.', 'soft'),
        N('He nudges something across the frost to your boot: an acorn on a loop of faded string, worn smooth as a pebble.'),
        M('Hazel tied that on me, the spring after our first winter. First thing anyone had given me in a very long time.'),
        M('Wear it. Then something of hers is walking about the Grove, and something of mine.', 'soft'),
        N('Hanging on the post is a soft hat with a little lantern stitched into the brim, and a note in big loud letters.'),
        N('“SAW YOU TWO DOING THE ROUNDS IN THE DARK, SO I MADE YOU THIS. IT PROBABLY DOESN’T EXPLODE. —SPARKS”'),
        N('That night you write it all down: four posts, four small things. You call the pages The Tale of the Four.'),
        N('Moss falls asleep on your windowsill before you finish, which he has never done before.'),
      ],
    },
    rewards: [
      {
        id: 's1-tale-pages',
        kind: 'item',
        label: '“The Tale of the Four” journal pages',
        description:
          'Four pages in your journal, in your own hand: Briar’s laugh, Hush’s grief, Moss choosing young Hazel, and Cinder’s last warm day. Readable any time.',
      },
      {
        id: 's1-lantern-hat',
        kind: 'cosmetic',
        label: 'Lantern hat',
        description: 'A soft hat with a small lantern stitched into the brim, made by Sparks. It glows after dark. It probably doesn’t explode.',
      },
      {
        id: 's1-acorn-charm',
        kind: 'cosmetic',
        label: 'Moss’s acorn charm',
        description: 'An acorn on a loop of faded string that young Hazel once tied on Moss. Your Keeper wears it at the neck.',
      },
    ],
    sets: { s1Done: true },
    notes:
      'LORE ONLY. Deepens chapter 4’s Tale of the Four with one memory per post. Sets nothing but s1Done and the s1- choice ' +
      'flags; no affection bonus for Moss beyond ordinary petting (his chapter 10 threshold of 40 is fixed). ' +
      'POSTS: lantern-pond (Moss), lantern-stream (Briar), lantern-wall (Hush, north side), lantern-long-grass (Cinder’s shard, ' +
      'kept by Moss). WALKING: walk:moss:<post> means the player stays within ~1.5 tiles of Moss until he reaches the post; ' +
      'Moss moves at a quarter of walking speed and stops if you get ahead. One memory per evening: s1-step2 and s1-step3 ' +
      'are offered on a later evening than the previous memory, from chapter 4 up to chapter 9. ' +
      'MEMORIES (s1-briar, s1-hush, s1-hazel, s1-cinder): when a voice other than Moss’s speaks, the screen takes a warm-gold ' +
      'filter, and the speaker shows as a silhouette with no portrait. Cinder’s memory turns red at the edges, then white. ' +
      'Young Hazel’s memory is snowy. These memories only use what chapter 4’s Tale has told; the first three never mention ' +
      'the theft or where the fourth shard went. ' +
      's1-wait plays straight after s1-hazel. Cinder’s rhyme is from the bible, as written (children offscreen, skipping SFX). ' +
      's1-cinder plays after c9-close, the same evening, with the chapter 9 frost and a very faint Moss; Moss is carried ' +
      '(Carry pose). It must not say where the shards are kept or what happens on the longest night. If steps 1–3 are not ' +
      'done when chapter 9 ends, they stay open until chapter 10 begins, and s1-cinder plays straight after the third memory. ' +
      'If chapter 10 begins first, the story closes unfinished, with no rewards. ' +
      'REWARDS are all given at s1-complete: the hat is found hanging on the long-grass post; the journal gains four pages. ' +
      'MINI-GAME (s1-step-boats, float:leaf-boat:stream-pond): Briar’s leaf-boats. s1-boats-ask plays straight after ' +
      's1-briar, the same evening. The boat drifts down the stream from the stream lantern to the pond; the player taps the ' +
      'water behind it to push it on and steers it off the reeds. Hitting the reeds or a stone snuffs the candle; a new leaf ' +
      'is free and instant, so there is no fail state. Moss launches his own boat each try and it always capsizes at once ' +
      '(a running gag; never let his reach the pond). The sail choice gives the boat a little more speed and wobble. ' +
      'The step is met when a boat reaches the pond still lit. Laugh SFX from the player Keeper, then a faint gold shimmer ' +
      'on the stream lantern. s1-boat (flat | sail) is flavour only. The memories still count as four; the boats are a game.',
  },

  // ================================================================== S3
  {
    id: 's3',
    code: 'S3',
    title: 'The Cycle',
    source: 'Hazel’s Grove original: the Sun and Moon feud (story bible, side-story table)',
    audience: 'all',
    trigger: {
      where: 'The pond at Lantern Night; then the Circuit stands',
      when:
        'Opens in chapter 4 at Lantern Night (c4-close), where the Keepers stand in two knots by the pond. Its first ' +
        'scene, s3-stands, waits for the Circuit: chapter 5, when you arrive for the race after c5-open.',
    },
    speakers: [],
    steps: [
      {
        id: 's3-step1',
        goal: 'Ask one Sun Keeper and one Moon Keeper what really happened at Midsummer.',
        hint: 'Fern, Marina, Sparks, Clover and Pixel are Sun. Luna, Ember, Byte, Dusty and Nova are Moon. Ask one of each.',
        check: 'talk:midsummer:sun-and-moon',
        scene: {
          id: 's3-stands',
          lines: [
            N('The Circuit stands are split down the middle: Sun Keepers on the left, Moon Keepers on the right, an empty bench between.'),
            FE('Don’t sit there. That’s the gap. Nobody sits in the gap.', 'think'),
            Y('Why not?'),
            FE('Because it’s the gap. Hazel used to sit in it every race, on purpose, to annoy everyone.', 'think'),
            N('Down at the front stand two tea urns: same make, same tea, same shop. One has a sun painted on it, and one a moon.'),
            SP('Midsummer, years back, Fern’s Bramble went over the cliff rail, Sun says Ash barged her, Moon says rigged, nobody’s raced together since, OK bye.', 'shock'),
            N('Sparks sits down very fast and studies the race card as if it holds the meaning of life.'),
            SP('I didn’t say any of that. That was the wind.'),
            N('Across the gap, the Moon side is pretending not to listen, and so is the Sun side. Both are bad at it.'),
            N('Up in the owners’ box, Corvin isn’t watching the start line. He’s watching the stands.'),
          ],
          choices: [
            {
              id: 'gap',
              label: 'Sit in the gap, like Hazel did.',
              set: { 's3-seat': 'gap' },
              then: [
                N('You sit in the gap. Five heads turn from the left, and five from the right.'),
                FE('Oh, you’re hers all right.', 'happy'),
                BY('That is statistically the worst seat. You can’t see the cliff bend. I’ve checked.', 'think'),
              ],
            },
            {
              id: 'sun',
              label: 'Sit with the Sun side.',
              set: { 's3-seat': 'sun' },
              then: [
                SP('YES. Sun gets the new Keeper! Sun gets the new Keeper!', 'happy'),
                N('Across the gap, Luna writes something in a very small notebook.'),
              ],
            },
            {
              id: 'moon',
              label: 'Sit with the Moon side.',
              set: { 's3-seat': 'moon' },
              then: [
                BY('Welcome. Our biscuits are better. I ran a blind taste test. It was mostly blind.', 'happy'),
                FE('Traitor. Lovely to see you. Traitor.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 's3-two-stories',
          lines: [
            N('You get two stories. They agree about the weather and nothing else.'),
            N('Sun: Ember’s Ash came round the cliff bend like a cannonball, and Fern’s Bramble went over the rail.'),
            N('Moon: the cliff-bend flag was in the wrong place, so Ash went wide where the flag told her to.'),
            BY('I have a chart. Both stories, colour-coded. The colours are also disputed.', 'think'),
            BY('Two hundred and fourteen grievances in all. Three are about the race. The rest are about the urns.'),
            EM('After Midsummer, nobody would race Ash. Not Sun. Not Moon. Do you know who would?', 'angry'),
            EM('Him. He said he’d make her a champion.', 'sad'),
            N('Nobody, on either side, talks about Bramble after the rail. The story just stops there, the way a path stops at a cliff.'),
          ],
        },
      },
      {
        id: 's3-step2',
        goal: 'Help Sparks and Byte develop the old Midsummer photo-finish plates.',
        hint: 'From chapter 6, go to Sparks’s workshop. Sparks works the trays, Byte works the timer, and you stop them arguing.',
        check: 'develop:plates:sparks-workshop',
        scene: {
          id: 's3-plates',
          lines: [
            N('Sparks turns up at your gate looking like someone who has swallowed a secret and it’s fizzing.'),
            SP('OK. OK OK OK. Confession. I’ve got the photo-finish plates from Midsummer. The camera on the cliff bend. Mine.', 'shock'),
            SP('I never developed them. If it was Ash, Fern would never forgive Ember. If it wasn’t, I’d never forgive me.', 'sad'),
            SP('Trouble is, my darkroom timer’s broken. And the only person in the valley with a timer that works is…'),
            N('She can’t say it. She points up the lane towards the Moon end, at a cottage with labels on its windows.'),
            SP('Him.', 'angry'),
          ],
          choices: [
            {
              id: 'science',
              label: 'Fetch Byte. Tell him it’s for science.',
              set: { 's3-byte': 'science' },
              then: [BY('Science? You should have opened with that. I’ll bring three timers. One to check the other two.', 'happy')],
            },
            {
              id: 'nicely',
              label: 'Fetch Byte. Tell him Sparks asked nicely.',
              set: { 's3-byte': 'nicely' },
              then: [
                BY('She did not.', 'think'),
                N('You admit she did not.'),
                BY('I’ll come anyway. Someone has to see it done properly.'),
              ],
            },
          ],
        },
        done: {
          id: 's3-flag',
          lines: [
            N('Sparks’s darkroom is red and cramped and smells of vinegar. Byte times, Sparks rocks the trays, and they argue in whispers.'),
            BY('Rock on the count. One, and two, and— that was not two. That was one and a half.', 'think'),
            SP('I rock on FEELING, Byte.', 'angry'),
            N('The first plate swims up out of the dark: an enormous, blurred, perfectly exposed thumb.'),
            BY('Your thumb.'),
            SP('It’s a GOOD thumb.', 'angry'),
            N('The second plate swims up slower, on the count: the cliff bend at dawn, before the race. An empty course, and a flag.'),
            N('And a man in a grey Circuit coat, pulling the flag up and moving it.'),
            BY('Two posts nearer the edge. Look at the turf. Old hole there. New hole here.', 'think'),
            SP('Nobody on either side moved that flag. Nobody. It was a steward.', 'shock'),
            N('The last plate is the finish, with the owners’ box behind it. Corvin isn’t watching the race; he’s watching the stands.'),
            BY('The flag sent them wide. Ash went wide because the course told her to. Bramble went wide because Ash did.', 'sad'),
            SP('We’ve been fighting about the wrong thing for years. Byte. We have two URNS.', 'shock'),
            BY('The urns were your idea.'),
            SP('They were a GOOD idea at the TIME.', 'angry'),
          ],
        },
      },
      {
        id: 's3-step3',
        goal: 'Show the plates to Fern and to Ember.',
        hint: 'Fern is usually in her orchard. Ember is at the Circuit fence most evenings.',
        check: 'show:item:midsummer-plates:fern-ember',
        scene: {
          id: 's3-courier',
          lines: [
            N('Sparks wraps the plates in a tea towel with a sun on it. Byte wraps a second tea towel, with a moon on it, round that.'),
            SP('You show them. They both like you. It’s very annoying.'),
            BY('A neutral courier. I approve. I’d like that noted somewhere.', 'think'),
          ],
          choices: [
            {
              id: 'together',
              label: 'Show them together, at the same time.',
              set: { 's3-shown': 'together' },
              then: [
                N('Getting Fern and Ember into one place takes a week. You manage it by telling each that the other won’t come.'),
                FE('You absolute snake. Hazel did that to me once.', 'happy'),
              ],
            },
            {
              id: 'apart',
              label: 'Show them one at a time.',
              set: { 's3-shown': 'apart' },
              then: [
                N('You go to Fern first, then to Ember. Each asks, before anything else, whether the other one has seen it yet.'),
              ],
            },
          ],
        },
        done: {
          id: 's3-truce',
          lines: [
            N('Fern looks at the plates for a long time, and so does Ember. Neither looks at the other.'),
            EM('I don’t need to be forgiven. I need to know who to be angry at.', 'angry'),
            EM('Him. It’s always him. He had Ash by the autumn.', 'sad'),
            FE('All those years. I hated you because of a flag. That’s… honestly efficient of him.', 'sad'),
            EM('There should be a Moot. Everyone. Both sides. Out in the open.', 'think'),
            FE('After midwinter. When there’s time to do it properly. And one urn.', 'think'),
            EM('One urn.', 'soft'),
            N('It’s the first thing they’ve agreed on in years, and they both look faintly ill about it.'),
          ],
        },
      },
      {
        id: 's3-step4',
        goal: 'Host the Lantern Moot at the pond, after the Long Night.',
        hint: 'In chapter 11, tap the pond and choose Call a Moot. All ten Keepers come.',
        check: 'host:moot:pond',
        scene: {
          id: 's3-invitations',
          lines: [
            N('Pixel has been put in charge of the invitations, which means there is a planning meeting about the invitations.'),
            PX('Gold ink or silver? Gold is Sun. Silver is Moon. Black is a funeral. I’ve tested twelve inks. Everything means something.', 'think'),
            CL('Green? Nobody’s green.', 'soft'),
            PX('…Clover, that’s genius. Green. Nobody’s green.', 'shock'),
            N('Dusty has offered to dig a hole for the one urn. Nobody asked for a hole, and nobody has the heart to say so.'),
            NO('I’ve been to this valley four times and I still don’t know if I’m Sun or Moon. Somebody said it’s my scarf.', 'think'),
            NO('I’ve decided I’m weather.', 'happy'),
            LU('Ember says she’s coming “to make sure it’s done right”. That’s Ember for yes.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 's3-moot',
      lines: [
        N('Evening at the pond. Ten Keepers, one urn, green invitations, and nobody sure where to stand.'),
        N('Dusty has dug the hole. The one urn stands in it, so that it is exactly level with nobody. Dusty is very proud.'),
        HZ('A Moot! I haven’t been to a Moot since my hair was brown. Isn’t this awkward. I love it.', 'happy'),
        N('You set the plates on the bench by the pond, between the two groups. Sun and Moon come to look, and then everyone.'),
        SP('It was the flag. I had it in a box the whole time. I’m loud about everything except the one thing.', 'sad'),
        FE('Bramble went over that rail because a man moved a flag. Not because of Ash. Not because of anyone here.'),
        N('Pixel pours the last of the sun urn and the last of the moon urn into the one urn. Byte tastes it, gravely.'),
        BY('Same tea. It was always the same tea. I’d like that read into the record.', 'think'),
        SP('Byte, I swear by every lantern in this valley—', 'angry'),
        BY('Into the record.'),
        EM('So. Midsummer. A Cup. Everybody runs. Same course, new flags, and I check them.', 'think'),
        FE('We check them.'),
        BY('I’ll check the checking.', 'happy'),
        HZ('And who’s keeping the Moot, love? Somebody has to bang the spoon.', 'happy'),
      ],
      choices: [
        {
          id: 'spoon',
          label: 'Bang the spoon on the urn.',
          set: { 's3-moot': 'spoon' },
          then: [
            N('You bang the spoon on the urn, and ten Keepers stop talking at once. It is the most powerful you have ever felt.'),
            PX('Ribbons! Gold and silver, stitched down the middle in green. One for every Nubbin who runs the Cup.', 'happy'),
            HZ('Moot-Keeper. Told you it’d suit.', 'happy'),
          ],
        },
        {
          id: 'share',
          label: 'Give the spoon to Fern and Ember to share.',
          set: { 's3-moot': 'shared' },
          then: [
            N('Fern and Ember hold the spoon between them and bang the urn together. Both miss, and the whole pond cheers.'),
            PX('Ribbons! Gold and silver, stitched down the middle in green. One for every Nubbin who runs the Cup.', 'happy'),
            HZ('You’re still the Moot-Keeper, love. Somebody had to bring the spoon.', 'happy'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 's3-midsummer-cup',
        kind: 'feature',
        label: 'Midsummer Cup race',
        description: 'A new yearly race on the cliff course that Sun and Moon Keepers run together, with new flags that everybody checks.',
      },
      {
        id: 's3-ribbons',
        kind: 'cosmetic',
        label: 'Sun and Moon ribbons',
        description: 'A gold Sun ribbon and a silver Moon ribbon, stitched together down the middle in green. Any Nubbin can wear them.',
      },
      {
        id: 's3-moot-keeper',
        kind: 'title',
        label: '“Moot-Keeper”',
        description: 'A title for the Keeper who brought the whole valley to one urn. Shown on your Keeper card.',
      },
    ],
    sets: { s3Done: true },
    notes:
      'FOR FUN. Comic feud with one sour note (Corvin’s flag). Sets nothing but s3Done and the s3- choice flags. S9 reads ' +
      's3Done for its “family” option; that is the only place it counts, and S9 owns that rule. ' +
      'SIDES: Sun are Fern, Marina, Sparks, Clover, Pixel. Moon are Luna, Ember, Byte, Dusty, Nova. The player belongs to ' +
      'neither (the Keeper choice is appearance only). OPENING: the quest opens at c4-close, where Lantern Night’s two ' +
      'knots of Keepers by the pond seed the feud (journal entry only; no scene). Its first scene, s3-stands, is an ' +
      'exception to the timing rule and waits for the Circuit in chapter 5. ' +
      'STAGING: the Circuit stands with a visible empty bench, two identical ' +
      'urns (sun and moon). talk:midsummer:sun-and-moon is met after asking any one Keeper from each side (a short ask line ' +
      'per Keeper is fine; s3-two-stories plays once both are asked). ' +
      'PLATES: develop:plates:sparks-workshop is a short darkroom scene (red light), available from chapter 6. It gives the ' +
      'quest item midsummer-plates (two glass plates in a tea towel), used in step 3 and taken back at the Moot. ' +
      'CHAPTER 9: no change at all. There is no ledger and no office search (bible conflict 17). The plates are the only ' +
      'evidence, and they only show a steward moving a flag and Corvin watching the stands. ' +
      'THE MOOT: offered from chapter 11 only, at the pond, after c11-open. It does not replace or count toward the chapter ' +
      '11 goal. Hazel is present (she is home in chapter 11). Never mention Corvin’s whereabouts or S9 here. ' +
      'BRAMBLE: Fern only ever speaks of Bramble going over the rail. S8 owns what became of her. If s8Done is true, add one ' +
      'Fern line straight after Fern’s “Bramble went over that rail…” line in s3-moot (index 5): FE “And she came home ' +
      'anyway. She still hates flags.” (happy). ' +
      'MINI-GAME (develop:plates:sparks-workshop): a darkroom rhythm game under red light. Byte calls a steady count; the ' +
      'player rocks the tray on the beat while Sparks rocks “on feeling” half a beat off, which the player must ignore. ' +
      'Too fast fogs the plate, too slow leaves it black; a spoiled plate is just re-dipped (no fail). The first plate ' +
      'always comes up as Sparks’s thumb whatever you do (gag). Three plates in all: thumb, flag, finish. ' +
      'RUNNING GAG: the two urns (s3-stands, s3-two-stories, s3-flag, s3-truce, s3-invitations) pay off in s3-moot: ' +
      'Dusty’s unasked-for hole, and Byte proving it was the same tea all along. ' +
      'REWARDS: the Midsummer Cup appears in the race list from the next Midsummer; ribbons go in the wardrobe.',
  },

  // ================================================================== S4
  {
    id: 's4',
    code: 'S4',
    title: 'The Wellspring',
    source: 'Hazel’s Grove original: Marina, the falls and the ledge path (story bible, Places)',
    audience: 'all',
    trigger: {
      where: 'The Grove gate',
      when:
        'After c5-close (the race won), once Fossil’s farewell in c6-open has played: Marina is waiting at the gate with a ' +
        'bucket. Never on the same morning as S5’s opening scene.',
    },
    speakers: [],
    steps: [
      {
        id: 's4-step1',
        goal: 'Check the water line Hazel painted on the rock by the falls.',
        hint: 'The falls are past the pond, on the Hollow side. Tap the white mark on the rock beside the pool.',
        check: 'inspect:falls:water-line',
        scene: {
          id: 's4-pools',
          lines: [
            MA('You won. Good. Come and see something that isn’t winning.', 'think'),
            N('Past the ridge, Marina’s tide pools step down the rock like a row of bowls. Half of them are dry.'),
            N('The anemones in the rest have shut up tight, like fists.'),
            MA('They get what the stream gives them. This summer it’s giving them less. And what does come down is cold.', 'sad'),
            MA('Cold. In July.'),
            MA('Hazel painted a line on the rock by the falls, years back. Where the water ought to come to. Go and look.'),
            Y('Why not look yourself?'),
            MA('I’ve looked forty times. I want someone else to tell me I’m wrong.', 'soft'),
            MA('Take a Nubbin. They like the falls. Mind the moss on the rocks. Not that Moss. The slippery kind.', 'happy'),
          ],
        },
        done: {
          id: 's4-line',
          lines: [
            N('The falls are loud and white. On the dark rock beside the pool, someone has painted a thick white line.'),
            N('The water sits a hand’s width below it. Above the water the rock is pale and dry where it should be dark.'),
            N('Your Nubbin dips a paw in, pulls it out, and looks at you as if you did this.'),
            MA('A hand. A whole hand.', 'sad'),
            N('Marina has followed you after all. She is standing at the edge of the pool with her shoes in her hand.'),
            MA('Something upstream is taking it. Something big enough to take a hand of water off the falls.', 'think'),
          ],
        },
      },
      {
        id: 's4-step2',
        goal: 'Send a swimmer up the outflow to see what’s above the falls.',
        hint: 'Choose Swim at the top of the pool. If none of your Nubbins can swim yet, Marina gives one a lesson first.',
        check: 'swim:inspect:falls-dam',
        scene: {
          id: 's4-lesson',
          lines: [
            MA('Hazel traded me fruit for swimming lessons. For her Nubbins, not her. She swam like a dropped teapot.', 'happy'),
            MA('Lesson one: they float better than you’d think. Lesson two: they don’t think, so let them.'),
            N('She wades in to her knees and holds your Nubbin under the chin, the way you’d steady a cup.'),
            N('It kicks once, astonished, and doesn’t sink.'),
            MA('There. Now up the outflow. Not far. Just far enough to see what’s up there.'),
          ],
          choices: [
            {
              id: 'with',
              label: 'Wade in after them.',
              set: { 's4-swim': 'with' },
              then: [
                N('You get in up to your waist and stop, gasping. It is very, very cold.'),
                MA('Lesson three: Keepers sink. Out you get.', 'happy'),
              ],
            },
            {
              id: 'trust',
              label: 'Stay on the bank and trust them.',
              set: { 's4-swim': 'trust' },
              then: [MA('Good. That’s the hardest stroke there is: staying on the bank.', 'soft')],
            },
          ],
        },
        done: {
          id: 's4-dam',
          lines: [
            N('Your swimmer comes back down the outflow and shakes itself all over you, the way Nubbins do when water has been rude.'),
            N('Caught in its fur: a grey thread, and a flake of fresh mortar.'),
            N('Round the bend upstream you find it. A wall of new grey stone across the stream, with a sluice gate in it, shut.'),
            N('Behind the wall the water lies flat and still and very blue, all the way up to the Circuit’s new swimming lanes.'),
            N('Each lane has a rope, a number, and a neat sign: NO SPLASHING.'),
            MA('No splashing. It’s water. Splashing is what it’s for.', 'angry'),
            MA('A swimming course. My pools are dying for a swimming course.', 'angry'),
            MA('I’ve written to the Circuit three times. I got three forms back. Received. Filed. Very tidy.', 'think'),
          ],
        },
      },
      {
        id: 's4-step3',
        goal: 'Walk the ledge path behind the falls with Marina.',
        hint: 'Meet Marina at the pool in the evening. Keep close behind her on the ledge, and don’t stop to look down.',
        check: 'walk:ledge:falls-with-marina',
        scene: {
          id: 's4-ledge-ask',
          lines: [
            MA('Before we do anything about that wall, I want to show you something. Not because it helps.', 'soft'),
            MA('Because somebody besides me ought to know the way. Hazel knew it. Hazel’s away.'),
            N(
              'Beside the falls, half hidden by ferns, a narrow ledge runs straight into the roar.',
            ),
            MA(
              'The ledge path. Back to the rock. Eyes on my heels. They’re very good heels. Twenty years’ wear.',
              'think',
            ),
            MA(
              'Don’t look at the water. Don’t look up either. Up is worse. It doesn’t like being stared at.',
            ),
            MA('Rule five. Don’t be me at your age. I was Sparks with longer hair.', 'happy'),
          ],
        },
        done: {
          id: 's4-ledge',
          lines: [
            N('Behind the falls the world turns to noise and spray. The rock under your hand is wet and soft with moss.'),
            N('Halfway along, the ledge bends into the dark. From round the bend comes a breath of air, warm, smelling of stone.'),
            MA('That’s the spring breathing. Where the first ones came up, if you believe Moss. I do, mostly.', 'soft'),
            N('Marina stops at the bend. She doesn’t go on.'),
            MA('Further is for when it’s needed. Hazel’s rule. I’ve kept it twenty years.', 'soft'),
            MA('But now you know the way this far. That’s all a path is, really. Somebody else knowing it.'),
          ],
        },
      },
      {
        id: 's4-step4',
        goal: 'Open the sluice gate on the Circuit’s dam, after dark.',
        hint: 'Go to the dam at night with Marina and a strong Nubbin. The sluice sticks.',
        check: 'open:sluice:falls-dam',
        scene: {
          id: 's4-sluice',
          lines: [
            MA('Three letters. Three forms. I’m done writing.', 'angry'),
            MA('We’re not breaking anything. Breaking is loud, and it gets you talked about. We’re opening a gate that ought to be open.'),
            N('At night the dam is just a dark wall and the sound of held water. The sluice is a great wooden door in new stone.'),
            N('Beside it, in a tidy hut, the Circuit’s night steward sits bolt upright in his chair, fast asleep, clipboard on his chest.'),
            N('He snores in a perfect rhythm. In, out, and a thin little whistle. The clipboard rises and falls.'),
            MA('I’ve watched him three nights. Move on the snore. Freeze on the whistle. The whistle’s when they wake.', 'think'),
            Y('“They”?'),
            MA('Stewards. They’re all the same steward, as far as I can tell.'),
            N('You creep to the sluice on a snore and try it on the next one. It doesn’t move. It is, unmistakably, stuck.'),
          ],
          choices: [
            {
              id: 'lift',
              label: 'Lift, then push.',
              set: { 's4-gate': 'lift-push' },
              then: [
                N('You lift, and push, the way the Grove gate taught you. The sluice groans, gives, and swings.'),
                MA('Where did you learn that?', 'shock'),
                Y('Home.'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your strongest Nubbin have a go.',
              set: { 's4-gate': 'nubbin' },
              then: [
                N('Your Nubbin puts its back into it and shoves, and nothing happens. Then it slips, lifts by accident, and the whole thing swings.'),
                MA('Hazel’s trick. Even the Nubbins know it.', 'happy'),
              ],
            },
            {
              id: 'note',
              label: 'Pin a polite note to the gate first.',
              set: { 's4-gate': 'note' },
              then: [
                N('You write: “Sluice opened for the tide pools, with thanks, from Hazel’s Grove.” Then you lift, and push, and it swings.'),
                MA('Polite. He’ll hate that more than anything.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 's4-water',
          lines: [
            N('Water pours through the gap, dark and loud, and goes tumbling off towards the falls as if it’s late for something.'),
            MA('Listen.', 'soft'),
            N('Below you, the falls change their note: deeper and fuller, the way the rock remembers them.'),
            N('In the hut, the steward stirs, says “Received,” quite clearly, and goes back to sleep.'),
            MA('Filed, I expect.', 'happy'),
            MA('Somebody will shut it again, probably. Then somebody will open it again. That’s most of keeping.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 's4-complete',
      lines: [
        N('A week later the tide pools are full to the brim. The anemones have opened, as if surprised to be asked.'),
        MA('Look at them. Showing off.', 'happy'),
        N('In the deepest pool, wedged between two stones, something round and pearl-white is catching the light.'),
        N('Your swimmer has seen it too. It dives before anyone can stop it: one kick, two, and a long silver string of bubbles.'),
        N('It comes up with the thing balanced on its head, extremely pleased with itself, and sneezes. It is an egg.'),
        MA('…Oh. Oh, you beauty.', 'shock'),
        MA('Once in a long while one comes down from behind the falls. Hazel saw one in forty years. It’s yours. You opened the gate.'),
        MA('And your swimmers can dive here whenever they like. As deep as they want. I’ll teach them the rest.', 'soft'),
        MA('Take some shells for the Grove. Take the pool weed too; it’s lucky. It isn’t lucky. It smells. Take it anyway.', 'happy'),
        N('Up at the dam, someone has hung a neat painted sign on the open sluice: OPEN BY ORDER. It doesn’t say whose.'),
      ],
    },
    rewards: [
      {
        id: 's4-deep-swim',
        kind: 'feature',
        label: 'Deep-swim diving',
        description: 'Marina’s tide pools open for diving. Nubbins dive for shells and trinkets on the bottom, and it trains Swim.',
      },
      {
        id: 's4-pearl-egg',
        kind: 'item',
        label: 'Pearl-white Spring egg',
        description: 'A rare egg that came down from behind the falls. It hatches a Nubbin in the rare pearl-white colour.',
      },
      {
        id: 's4-tide-pool-decor',
        kind: 'decor',
        label: 'Tide-pool decorations',
        description: 'Shells, a little rock-pool basin, and a tangle of pool weed for the Grove. The weed smells a bit. It’s worth it.',
      },
    ],
    sets: { s4Done: true },
    notes:
      'FOR FUN. Sets nothing but s4Done and the s4- choice flags. The dam stays; only its sluice is opened. Corvin never ' +
      'appears and nothing in chapter 9 changes. The OPEN BY ORDER sign is left unexplained on purpose. ' +
      'MARINA NEVER LEAVES THE VALLEY (bible conflict 9). She taught Hazel’s Nubbins to swim (conflict 1). ' +
      'COLD WATER: the cold in the stream is only noticed here (“Cold. In July.”), never explained; chapter 7 explains the ' +
      'Stillness and chapter 8 shows the frost on the spring’s rim (the water itself never freezes). ' +
      'THE LEDGE (s4-step3): Marina leads along the ledge behind the falls and stops at the bend. The Wellspring itself is ' +
      'NOT shown, so chapter 8 keeps its first glimpse. Warm air from round the bend (soft breathing SFX, steam drifting). ' +
      'CHAPTER 8 LINE: when s4Done is true, at the start of the chapter 8 ledge walk Marina says one extra line: ' +
      'MA “You know this bit. Back to the rock, eyes on my heels. This time we don’t stop at the bend.” (soft). ' +
      'TIMING: step 1 opens after c5-close, which starts chapter 6 at once (so S4 never crowds S5, which runs inside ' +
      'chapter 5); step 2 from chapter 6, steps 3–4 by the end of chapter 7. The story must finish ' +
      'before chapter 8 opens; if chapter 8 begins first, it closes unfinished with no rewards. ' +
      'SWIM: s4-step2 needs a swimmer; with none, Marina’s lesson gives your Nubbin its first Swim point (same scene). ' +
      'SLUICE: open:sluice:falls-dam at night, with any Nubbin present; all three choices open it. ' +
      'MINI-GAME (open:sluice:falls-dam): a stealth-rhythm game. The night steward snores in a loop (in, out, whistle). ' +
      'The player creeps along the dam and heaves the sluice only on snores, and freezes on the whistle. Moving on a ' +
      'whistle makes him half wake, mumble “Received. Filed.”, and drop off again; you shuffle back one step (no fail). ' +
      'Three good heaves loosen it; then the choice plays. The steward never wakes in any scene and is never named. ' +
      'REWARD MOMENT: in s4-complete your swimmer dives for the pearl-white egg and brings it up on its head (dive anim, ' +
      'bubble trail, a sneeze). ' +
      'REWARDS: deep-swim diving unlocks at the tide pools; the pearl-white egg goes to your egg basket; decor to storage.',
  },

  // ================================================================== S5
  {
    id: 's5',
    code: 'S5',
    title: 'Fossil’s Last Walk',
    source: 'Hazel’s Grove original: Dusty and Fossil (story bible, chapter 6)',
    audience: 'all',
    trigger: {
      where: 'The Grove gate',
      when: 'Chapter 5, the first morning after c5-open: Dusty visits with Fossil. Must finish before c5-close.',
    },
    speakers: [FOSSIL],
    steps: [
      {
        id: 's5-step1',
        goal: 'Carry Fossil to the cliff where Dusty found her egg.',
        hint: 'The cliff is east, past the stream. Walk, don’t run. She’s very old and she likes to look at things.',
        check: 'carry:fossil:cliff',
        scene: {
          id: 's5-list',
          lines: [
            N('Dusty is at the gate with a very old Nubbin in the crook of one arm and a much-folded bit of paper in the other hand.'),
            N('The Nubbin is the colour of sand. When she blinks, she does it slowly, as if each blink costs something.'),
            DU('This is Fossil. I dug her egg out of the cliff when I was eleven. Don’t say the name isn’t original. I was eleven.', 'happy'),
            DU('She’s fading. Not her glow. Her. You’ll have seen it, if you’ve looked.', 'sad'),
            DU('Twenty years. You’d think I’d have run out of things to say to her. I’ve got a list.'),
            N('Dusty unfolds the paper. It has been folded and unfolded so often it has gone soft as cloth.'),
            DU('Three things. My back’s gone; I can’t carry her and do the things. Would you?', 'soft'),
            DU('One, the cliff. Two, Hazel’s first tree. Three, the water. She used to swim like she was late for something.', 'happy'),
            N('Fossil looks up at you, unhurried, and holds out her arms the way very small children do.'),
            N('Fossil says nothing. Her slow blink lands on you, and stays.'),
          ],
          choices: [
            {
              id: 'egg',
              label: 'Lift her with both hands, like an egg.',
              set: { 's5-carry': 'egg' },
              then: [
                N('You lift her the way you’d lift a full cup. She settles against you, approving.'),
                DU('That’s it. That’s exactly it.', 'soft'),
              ],
            },
            {
              id: 'shoulder',
              label: 'Let her ride on your shoulder.',
              set: { 's5-carry': 'shoulder' },
              then: [
                N('She climbs up, slowly, and sits on your shoulder like a very old queen inspecting something ridiculous.'),
                DU('Oh, she likes you. The last person who tried that got their ear nibbled.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 's5-cliff',
          lines: [
            N('At the foot of the cliff the rock is striped like a cake: brown, red, grey, brown. Dusty puts a hand flat on one stripe.'),
            DU('Here. I was twelve. It was raining. I used a trowel.', 'think'),
            N('Fossil leans out and taps the rock, twice, very firmly.'),
            DU('…Eleven. Fine. Eleven. And it was sunny.'),
            N('Tap.'),
            DU('A spoon. It was a spoon. A big spoon. You try digging out a whole egg with a spoon. It took two days.', 'happy'),
            N('Fossil lays her head against the rock and leaves it there a while. Dusty doesn’t say anything at all.'),
            DU('I tell it wrong on purpose. Every time. Twenty years, and she’s never once let me get away with it.', 'soft'),
            N('By her head a little fern grows out of a crack, curled tight. Pressed into the stone beside it is a much older one.'),
          ],
        },
      },
      {
        id: 's5-step2',
        goal: 'Take Fossil to Hazel’s first tree and shake it once.',
        hint: 'Hazel’s first tree is the low, crooked one across the stream. One shake only.',
        check: 'shake:tree:hazels-first',
        scene: {
          id: 's5-tree-ask',
          lines: [
            DU('Next, Hazel’s first tree. The crooked one over the stream. Shake it once. She was very specific.', 'think'),
            DU('Well. I was. On her behalf.'),
            N('Fossil falls asleep on the way. She wakes exactly as you reach the tree, as if she set an alarm.'),
          ],
        },
        done: {
          id: 's5-tree',
          lines: [
            N('Every Nubbin you own has followed you here. They sit in a row under the branches with their mouths open.'),
            DU('Once. Not twice. Twice is just weather.', 'think'),
            N('You shake it, once. One fruit drops: small, wrinkled, an odd yellow-brown, like an apple that has heard bad news.'),
            N('It misses every open mouth in the row and lands in Fossil’s lap, as if it knew the way.'),
            DU('That’s the one. Hazel gave her one the day she hatched. She ate it in one go and was sick on my shoe.', 'happy'),
            N('Fossil takes the fruit in both hands but doesn’t eat it yet. She holds it, and smells it, and closes her eyes.'),
            DU('Hazel stood where you are and said, “Well, she’s yours now. Good luck to you both.” I think she meant me.', 'soft'),
            N('Fossil eats a third of it, very slowly. Then she hands the rest to Dusty, who eats it, though it is horrible.'),
            DU('Tastes like being eleven.', 'soft'),
          ],
        },
      },
      {
        id: 's5-step3',
        goal: 'Hold Fossil up in the shallows of the pond.',
        hint: 'Bring Fossil to the pond’s edge and choose Swim. One of your swimmers can hold her, or Marina will.',
        check: 'swim:hold:fossil:pond',
        scene: {
          id: 's5-water-ask',
          lines: [
            DU('Last one. The water. She can’t swim on her own any more.', 'sad'),
            DU('Marina taught her, years back, with Hazel’s lot. Says she was the only one who swam sideways on purpose.', 'happy'),
            N('Marina is already at the pond, sleeves rolled up, as though somebody sent for her. Dusty is very bad at secrets.'),
            MA('I was passing. With a towel. As you do.', 'soft'),
          ],
          choices: [
            {
              id: 'yours',
              label: 'Let one of your swimmers hold her.',
              set: { 's5-holder': 'yours' },
              then: [
                N('Your swimmer wades out and waits, very serious, as if it has been given the most important job in the valley.'),
                MA('Paw under the chin. Like a cup. There you go.', 'soft'),
              ],
            },
            {
              id: 'marina',
              label: 'Ask Marina to hold her.',
              set: { 's5-holder': 'marina' },
              then: [
                N('Marina wades in to her waist and holds out her hands.'),
                MA('Come on then, old girl. Same as always.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 's5-water',
          lines: [
            N('You lower Fossil into the water, and it takes her weight. For a moment she is stiff and heavy, and then she is light.'),
            N('Then, very slowly, she kicks.'),
            DU('Look at her. That’s the stroke. The little sideways one. Like she’s late for something.', 'happy'),
            DU('To the reeds and back, Fos. Then you can be smug about it.'),
            N('She swims to the reeds and back. It takes a long time, and nobody hurries her.'),
            N('When you lift Fossil out she is shivering, and her eyes are bright. She isn’t looking at Dusty; she’s looking at the Grove.'),
            DU('…That’s not the list. She’s got a list of her own.', 'think'),
          ],
        },
      },
      {
        id: 's5-step4',
        goal: 'Sit with them until dark.',
        hint: 'Stay still near Fossil and your youngest Nubbin until night falls. If you wander off, she’ll wait.',
        check: 'wait:dusk:fossil-youngest',
        scene: {
          id: 's5-secret',
          lines: [
            N('You set Fossil down on the bank. She walks across the Grove on her own, one slow step at a time.'),
            N('Not to Dusty, and not to you. She goes to your youngest Nubbin, busy falling over a fruit, and sits down beside it.'),
            DU('…Oh.', 'shock'),
            N('Your youngest stops falling over and looks at Fossil, and Fossil looks back. Then they just sit.'),
            DU('She did this for me once. I was small and I’d had a bad day. She just sat. Didn’t fix anything. Didn’t try.', 'soft'),
            DU('Nobody taught her that. She worked it out years before I did.', 'soft'),
          ],
        },
        done: {
          id: 's5-gift',
          lines: [
            N('The sun goes down behind the western hill. Fossil doesn’t move, nor does your youngest, and after a while nor do you.'),
            N('When it’s dark, Fossil gets up, touches her nose to your youngest Nubbin’s nose, and walks back to Dusty.'),
            N('Your youngest sits up straighter than you’ve ever seen it sit. On its stats sheet, under Stamina: “A gift from Fossil.”'),
          ],
        },
      },
    ],
    complete: {
      id: 's5-home',
      lines: [
        N('Dusty picks Fossil up to carry her home, bad back or not. The ball above her head is very pale now.'),
        N('It doesn’t glow. It only gets paler, the way a sky does.'),
        DU('Thank you. I mean it. I don’t say that much. Ask anyone. They’ll tell you I never say it.', 'soft'),
        DU('I think it thins slower with someone walking beside it. I’d like to think so.', 'soft'),
        N('Fossil reaches out to you. In her fist is a curled seed from the fern at the foot of the cliff.'),
        DU('She wants you to plant it. Fossil-fern. Grows out of rock, if you’re patient. Course it does.', 'soft'),
        DU('And have this. Don’t argue. I bought it the week after I dug her out. Never needed it like I needed the spoon.', 'happy'),
        N('Dusty’s trowel. The handle is worn pale where a hand has held it for twenty years.'),
        N('They go out through the gate together. Dusty lifts and pushes without thinking.'),
        N('On the western hill, Moss watches the gate long after it has closed.'),
      ],
    },
    rewards: [
      {
        id: 's5-fossil-seed',
        kind: 'item',
        label: 'Fossil’s seed',
        description: 'A curled seed from the fern at the foot of Fossil’s cliff. Planted in the Grove, it grows into a fossil-fern: slow, grey-green, and very hard to kill.',
      },
      {
        id: 's5-dusty-trowel',
        kind: 'item',
        label: 'Dusty’s trowel',
        description: 'Dusty’s old trowel, the handle worn pale. Digs up buried things a little faster, or hangs on the cottage wall.',
      },
      {
        id: 's5-stamina-gift',
        kind: 'feature',
        label: 'A gift from Fossil',
        description: 'Your youngest Nubbin’s Stamina grade rises by one, for good. Its stats sheet says who gave it.',
      },
    ],
    sets: { s5Done: true },
    notes:
      'FOR FUN, and a gentle lead-in to chapter 6. Sets nothing but s5Done and the s5- choice flags. ' +
      'FOSSIL IS INTRODUCED HERE if S5 is played (bible conflict 8); otherwise chapter 6 introduces her. Fossil is she; ' +
      'DUSTY IS THEY/THEM everywhere (conflict 12). Fossil never speaks (“…” only); she talks by tapping. ' +
      'Don’t pre-empt chapter 6: no flower, no cocoon, no “happy enough to let go”, and the farewell itself stays in c6. ' +
      'CHAPTER 6 LINE: when s5Done is true, c6-open’s introduction line (“Her name’s Fossil…”) is replaced by: ' +
      'DU “You walked her round. The cliff, the tree, the water. I wanted to say thank you. Before.” (soft). ' +
      'TIMING: opens on the first morning after c5-open, so it is the first story chapter 5 offers at the gate; S11 and ' +
      'S15 open on later mornings, and S4 waits until after c5-close. The four steps run in order during chapter 5. ' +
      'c5-close starts chapter 6 at once, and c6-open is Fossil’s farewell, so S5 must be done before c5-close (see the ' +
      'engine backlog for holding c5-close while S5 is open). If chapter 6 begins before the ' +
      'story is finished, it closes unfinished with no rewards, and chapter 6 introduces Fossil as normal. ' +
      'STEPS: carry:fossil:cliff uses Carry (walk only; running makes her tap your arm). s5-step3 needs a Nubbin that can ' +
      'swim for the “yours” choice; with none, only the Marina choice is shown. The secret wish: the youngest Nubbin is the ' +
      'one with the lowest age; its Stamina grade +1, permanently, with the stats-sheet note “A gift from Fossil.” ' +
      'REWARDS: the seed and trowel are given in s5-home; the Stamina gift lands at s5-gift but is listed here. ' +
      'MINI-GAME (shake:tree:hazels-first): a one-shot strength gauge. Hold to build a shake, release once. In the middle ' +
      'band exactly one fruit falls (the right one) and the step is met. Too weak: leaves rustle, Fossil taps your arm, try ' +
      'again. Too strong: a shower of ordinary fruit bounces off your waiting Nubbins (they are delighted and eat it), ' +
      'Dusty says “That was weather,” and you try again. No fail. ' +
      'COMEDY: Dusty telling the cliff story wrong and Fossil tapping to correct them is the story’s running gag; keep the ' +
      'tap SFX crisp and the pause before each correction long.',
  },
];

export const CHECKS: string[] = [
  // S1
  'walk:moss:lantern-stream',
  'float:leaf-boat:stream-pond',
  'walk:moss:lantern-wall',
  'walk:moss:lantern-pond',
  'chapter:9:end',
  // S3
  'talk:midsummer:sun-and-moon',
  'develop:plates:sparks-workshop',
  'show:item:midsummer-plates:fern-ember',
  'host:moot:pond',
  // S4
  'inspect:falls:water-line',
  'swim:inspect:falls-dam',
  'walk:ledge:falls-with-marina',
  'open:sluice:falls-dam',
  // S5
  'carry:fossil:cliff',
  'shake:tree:hazels-first',
  'swim:hold:fossil:pond',
  'wait:dusk:fossil-youngest',
];
