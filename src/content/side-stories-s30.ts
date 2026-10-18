/**
 * Grove side story S30: What Sad Is For (Part M, rank 19).
 *
 *   S30 What Sad Is For   after c6-close → closes when chapter 9 opens   for fun (Tier 2)
 *       s30Done (local: s30-ring = broke | sat | helped)
 *
 * SOURCE AND RIGHTS. After Inside Out (2015) and Inside Out 2 (2024), Pixar Animation Studios for
 * Walt Disney Pictures; rights held by Disney/Pixar. A light nod only: no headquarters, console,
 * memory orbs, islands or emotion characters. Hush’s stone and the Nubbins’ mood balls do that work.
 * Clover’s household nods to the film and never copies it: Dimple (gold, bouncy; Joy), Drizzle
 * (pale blue, slow, loves rain; Sadness), Bristle (stamps; Anger), Flinch (jumps at everything;
 * Fear), the fussy one (she; the red-food Nubbin of the Hebrew questline, LH4; Disgust), and
 * Fidget (small, orange, never still; the sequel’s Anxiety). They are Nubbins and never speak.
 *
 * AUDIENCE. 'all' (the Learning Grove and the main game).
 *
 * FRAME. A Grove side story. After Fossil’s farewell (chapter 6), Clover’s Dimple won’t stop
 * smiling. You are Clover’s helper and a second pair of eyes; Dimple is the heroine. The Keepers
 * each meet her grief their own way: Sparks cheers, Byte counts, Ember sees anger, Luna sees the
 * night, Dusty grieves, Clover fusses. Moss tells you Hush’s old job, keeping the valley’s griefs.
 * Your Nubbin follows Dimple about and copies her: her smile, her bounces, and at last her sitting.
 *
 * GROVE FLAGS READ (variants and notes only; see SIDE_STORY_S30[0].notes for exactly where):
 *   - s5Done: Dimple’s route in step 10 (Fossil’s last walk in reverse: s30-trail-s5), and your
 *     youngest Nubbin, Fossil’s last friend, sits down too in steps 5 and 11 (s30-hole-youngest,
 *     s30-hollow-youngest), where Dusty says “She trained you both.”
 *   - s1Done: Moss’s opening at the old wall in step 7 (s30-wall-s1). See the timing caveat in
 *     the notes: S1 only completes at chapter 9’s end, so the read should be S1’s wall memory.
 *   - Local: s30-ring (set in step 2) picks the -helped variants in steps 10, 11, 14 and complete.
 *
 * FLAGS WRITTEN. s30Done (on completion); s30-ring (the acorn-ring choice, local). No Tier 1 flag.
 *
 * LIFTED TEXT. Copyrighted source: two one-sentence lines, exactly as the outline lists them (Part M,
 * S30, checked there against Shmoop’s Inside Out quote pages; confirm against the licensed film).
 * Edition: Inside Out, Pixar Animation Studios / Walt Disney Pictures, 2015, theatrical release.
 *   1. s30-drizzle#8, Dusty: “I’m okay now.” (Bing Bong, after he cries on Sadness’s shoulder.)
 *   2. s30-rim#4, Clover: “Crying helps me slow down and obsess over the weight of life’s problems.”
 *      (Sadness.)
 * Both have childLines. Nothing from Inside Out 2 is quoted. Everything else is original.
 *
 * CARE NOTES.
 *   - Dimple is never “fixed”. She still smiles most of the time; now she can be sad too. Nobody
 *     tells anyone to cheer up as a lesson, and Sparks’s party is kind, not wrong.
 *   - No clinical words. Fidget’s spinning is a frightened Nubbin, and it passes when someone sits
 *     with her. The spoon hole is shallow and safe; Dusty and the rope are always there.
 *   - Hazel’s third rule is not quoted or named: S5 gave it to Fossil, and steps 5, 11 and 14 show it.
 *   - Nubbins and animals never speak (canon 17). Dimple, Drizzle and Fidget have “…” portrait lines
 *     only, like Fossil in S5.
 *
 * Timing convention (as in the other side-story files): a step’s `scene` plays the moment the
 * previous step’s `check` is met (straight after the previous `done`), unless the notes give the step
 * a chapter gate; its `done` scene plays when its own `check` is met.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const Y = say('you');
const M = say('moss');
const CL = say('clover');
const SP = say('sparks');
const BY = say('byte');
const EM = say('ember');
const LU = say('luna');
const DU = say('dusty');

// ---------------------------------------------------------------- new speakers (Nubbins: “…” only)
const DIMPLE: Speaker = {
  id: 's30-dimple',
  name: 'Dimple',
  kind: 'nubbin',
  basedOn: 'Joy (Inside Out, Pixar 2015), a light nod only; an original Nubbin of Clover’s',
};
const DRIZZLE: Speaker = {
  id: 's30-drizzle',
  name: 'Drizzle',
  kind: 'nubbin',
  basedOn: 'Sadness (Inside Out, Pixar 2015), a light nod only; an original Nubbin of Clover’s',
};
const FIDGET: Speaker = {
  id: 's30-fidget',
  name: 'Fidget',
  kind: 'nubbin',
  basedOn: 'Anxiety (Inside Out 2, Pixar 2024), a light nod only; an original Nubbin of Clover’s',
};


// ================================================================== shared pieces
/** The arrival at the cliff, shared by s30-trail and s30-trail-s5. */
const S30_HOLLOW_FOUND: Line[] = [
  N('At the foot of the cliff the rock is striped like a cake. Where it meets the ground, there is a hollow, dug down and in.'),
  DU('That’s it. The spoon hole. Where I dug her out. Two days, with a spoon.', 'soft'),
  N('Dimple is down in it, on Fossil’s cushion. She is scraping at the back of the hollow with both hands, as if there might be another egg.'),
  N('The hollow is only waist-deep on you, but on a Nubbin the lip is a cliff. She can’t climb out, and she hasn’t tried.'),
  N('Dimple says nothing. She scrapes, and scrapes, and smiles at the rock.'),
];

/** The rubbing at the old wall, shared by s30-complete and s30-complete-helped up to the mark beside Dimple’s. */
const S30_RUBBING_START: Line[] = [
  N('On the way home you stop at the old wall. Clover holds the paper flat; you rub over Hush’s stone with a stub of charcoal from her range.'),
  N('The marks come up black and fine under your hand: rings, and lines, and rings with lines through them.'),
  CL('Dimple ought to have a mark of her own. On her page. A proper one.', 'soft'),
  N('In the clean corner of the paper, you draw it for her: a ring with a line through it.'),
];

const S30_RUBBING_END: Line[] = [
  CL('That’s the both one. That’s her now.', 'soft'),
  N('That night you write it up properly. Hush’s stone, and a page for each of your own Nubbins, ringed and lined from what you remember.'),
  N('In the morning there is a parcel on your step: a pale-blue rain hat, Nubbin-sized, and Fossil’s cushion, plumped for the first time in years.'),
  N('The note says: “Drizzle’s spare hat; she has three. And the cushion: Fossil would want it sat on, not kept. —C”'),
  N('Under it, in loud capitals: “ALSO A RIBBON, BLUE AND GOLD. I DYED IT TWICE TO GET IT RIGHT. —SPARKS”'),
];

// ================================================================== the quest
export const SIDE_STORY_S30: Quest[] = [
  {
    id: 's30',
    code: 'S30',
    title: 'What Sad Is For',
    source:
      'Inside Out (Pixar, 2015) and Inside Out 2 (Pixar, 2024): a Joy that keeps a girl so happy she can’t ask for help, the discovery that sadness tells the people who love you where to find you, and a worry that keeps everyone too safe. A light nod; two short quotes, everything else original',
    audience: 'all',
    trigger: {
      where: 'Your gate, then Clover’s cottage down the lane (the deep kitchen windowsill, the shed, the rain butt)',
      when: 'Chapter 6, the morning after c6-close (Fossil’s farewell). Steps 1–6 in chapter 6; step 7 after c7-stillness; steps 8–9 in chapter 7’s first frost week; steps 10–14 in chapter 8. Closes when chapter 9 opens.',
    },
    speakers: [DIMPLE, DRIZZLE, FIDGET],
    steps: [
      // ------------------------------------------------ 1. The Smile, and the Windowsill (outline quests 1–2)
      {
        id: 's30-step1',
        goal: 'Go down the lane to Clover’s cottage for a cup of tea, and meet her Nubbins.',
        hint: 'Clover’s is the cottage past Fern’s with the deep kitchen windowsill and the rain butt by the door.',
        check: 'visit:s30-clover-cottage',
        scene: {
          id: 's30-smile',
          lines: [
            N('The morning after the rain, the whole valley drips. Somebody is rattling your gate, trying to push it without lifting.'),
            N('It’s Clover. A small gold Nubbin is bouncing on her shoulder like a kettle just before it boils.'),
            CL('I know, I know. Lift and push. I never remember till I’m standing here pushing.', 'happy'),
            CL('This is Dimple. One of mine. She’s smiled since the hill. Since Dusty’s Fossil. Smiled all night. Smiled in her sleep.'),
            N('Dimple beams at you. She beams at the gatepost, and at a slug on the gatepost, with exactly the same beam.'),
            CL('At least somebody’s cheerful.', 'happy'),
            N('Behind Clover, on the wet path, four more Nubbins sit in a damp heap, as if somebody had dropped them there and walked on.'),
            CL('That’s the rest. Drizzle, Bristle, Flinch, and her ladyship, who only eats red things. They’ve taken it hard.', 'sad'),
            CL('Fossil sat on my kitchen sill every digging day, you know. Years. Dusty dropped her off on the way to the cliff.'),
            CL('Come down for tea. I want somebody to look at Dimple who isn’t me. I keep looking at her and thinking: good. Good.', 'think'),
            N('Your Nubbin has come to the gate. It studies Dimple’s smile for a long moment, and then, carefully, puts one on.'),
          ],
        },
        done: {
          id: 's30-sill',
          lines: [
            N('Clover’s kitchen is warm and loud and full of steam. Bristle is stamping on a saucepan lid; Flinch has jumped into the bread bin.'),
            CL('Hazel said my kitchen was like the inside of somebody’s head. Everybody shouting, nobody in charge.', 'happy'),
            N('The windowsill is deep enough to sit in. On it is a flat old cushion with a dent in the middle, the shape of somebody small and round.'),
            CL('Fossil’s. Dusty won’t take it back, and I can’t bring myself to plump it.', 'soft'),
            N('Dimple has filled the dent. Every toy she owns is in it: a cotton reel, a pine cone, a sock and half a wooden peg, piled up high.'),
            N('Drizzle climbs the curtain, very slowly, and lays one pale-blue hand flat in the last gap in the dent.'),
            N('Dimple is there at once. She takes Drizzle by the wrist and pulls her off the sill, still smiling.'),
            N('Dimple beams at her, and goes back to patting the pile flat.'),
            N('Then you see the ball above Dimple’s head. It has gone pale and thin, like a soap bubble that has been out too long.'),
            CL('See? Not a cloud on her. She’s my good one, this week.', 'happy'),
            N('Clover is looking at the smile. She isn’t looking up.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Point out Dimple’s ball to Clover.',
              then: [
                CL('Balls flicker. It’s been a big week for everybody. Look at that face, though.', 'happy'),
                N('She means it kindly. She goes on looking at the face.'),
              ],
            },
            {
              id: 'watch',
              label: 'Say nothing yet. Keep watching.',
              then: [
                N('You drink your tea and watch the ball, and the ball doesn’t change.'),
                N('Dimple sees you looking, and smiles harder.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 2. The Ring of Acorns (outline quest 3: THE CHOICE)
      {
        id: 's30-step2',
        goal: 'Go out to the rain butt and see what Dimple is doing to Drizzle.',
        hint: 'The yard is round the back of Clover’s. Go quietly; Flinch is asleep in the bucket by the door.',
        check: 'watch:s30-acorn-ring',
        scene: {
          id: 's30-acorns',
          lines: [
            N('Next afternoon you’re back at Clover’s, holding a skein of wool while she winds it. It is drizzling, which Drizzle would love.'),
            CL('Sparks came by. Sparks says what Dimple needs is a party. Sparks says that about most things. Broken legs. Tax.', 'think'),
            CL('She might be right, mind. She’s got streamers. She’s got a cake tin shaped like a cake.'),
            N('Through the window, something is happening in the yard, by the rain butt.'),
            N('Dimple is herding Drizzle into the corner between the butt and the wall. She does it the way you herd a hen: arms wide, a lot of bouncing.'),
            CL('Look at them, playing. Go and see, if you like. I’ll wind.', 'happy'),
          ],
        },
        done: {
          id: 's30-ring',
          lines: [
            N('Drizzle sits in the corner under the drip from the rain butt. Round her, Dimple has laid a ring of acorns, nose to tail, very neat.'),
            N('Drizzle puts one foot over the acorns. Dimple bounces over and nudges her back in, smiling, quick and kind and firm.'),
            N('Drizzle tries again, and again: nudge, nudge. Each time, Dimple adds another acorn to the ring.'),
            N('Your Nubbin, who has followed you out, starts fetching acorns too, to help. It doesn’t know what for.'),
            N('Drizzle looks at you over the ring. She doesn’t look upset; she looks like someone waiting to be let out of a room.'),
            N('Drizzle says nothing. She lifts one foot over the acorns again, and waits to see what you do.'),
          ],
          choices: [
            {
              id: 'broke',
              label: 'Step over the acorns and lift Drizzle out.',
              set: { 's30-ring': 'broke' },
              then: [
                N('You lift her out. She is cool and heavy, like a stone from a stream.'),
                N('She goes straight back to the drip from the butt and sits under it, outside the ring, with her face turned up.'),
                N('Dimple stares at the gap in the ring. Then she fills it, very fast, with nobody inside, and bounces off indoors.'),
              ],
            },
            {
              id: 'sat',
              label: 'Sit down on the wet grass outside the ring, next to Drizzle.',
              set: { 's30-ring': 'sat' },
              then: [
                N('You sit down outside the acorns. Drizzle shuffles to the edge of the ring and leans against the inside of it, towards you.'),
                N('Dimple brings more acorns. She builds a second ring round the two of you, and smiles the whole while.'),
                N('When it is done she looks at it, and at you, as if she can’t remember what it was for. Then she bounces off indoors.'),
              ],
            },
            {
              id: 'helped',
              label: 'Leave it. She’s trying so hard. Go and help with Sparks’s party plan.',
              set: { 's30-ring': 'helped' },
              then: [
                N('You leave the ring be. Dimple is trying so hard; it seems unkind to spoil it.'),
                N('Sparks is at Clover’s gate with a crate of streamers and a face full of plans. You go and hold the other end of things.'),
                N('Behind you, Drizzle watches you go. She doesn’t try the acorns again.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 3. The Bounce Party (outline quest 4)
      {
        id: 's30-step3',
        goal: 'Run Dimple’s Bounce Party in Clover’s yard: the streamer race, the hat toss and the cake.',
        hint: 'Three party games, one after another. Nobody can lose, Sparks says, which mainly means Sparks can’t.',
        check: 'minigame:s30-bounce-party',
        scene: {
          id: 's30-party-ask',
          lines: [
            SP('PARTY. Saturday. Clover’s yard. Dimple’s the guest of honour and attendance is compulsory and fun.', 'happy'),
            SP('Streamers. Races. Bunting. A cake shaped like a cake. Took me all night. It’s a sponge. It looks like a sponge.'),
            SP('Nothing cheers a Nubbin up like being cheered at. That’s science. Byte, tell them it’s science.', 'happy'),
            BY('It isn’t science. I’m coming, though. I’m bringing a chart.', 'think'),
            EM('I got dragged. I’m here under protest. Where’s the cake.'),
            N('By Saturday, Clover’s yard is bunting from the shed to the rain butt. Every Nubbin in the lane has turned up, because there is cake.'),
            N('Dimple is in the middle of it in a paper hat, bouncing so high that her hat keeps landing on other people.'),
          ],
        },
        done: {
          id: 's30-party',
          lines: [
            N('Dimple wins the streamer race and the hat toss. She bounces round the cake eleven times before anyone can cut it.'),
            N('Your Nubbin copies every bounce, a beat behind. By the end it is worn out, and Dimple is not.'),
            SP('LOOK AT HER GO. That’s a happy Nubbin. That’s a party working.', 'happy'),
            EM('That’s not happy. That’s busy.', 'angry'),
            SP('…What?', 'shock'),
            EM('I know busy. I was busy for a whole year after Ash. Cleaned the house twice a day. Nobody could get a word in.', 'soft'),
            EM('She’s furious, that one. Watch her land. She stamps every landing. She just hasn’t found who to shout at.'),
            BY('Two hundred and twelve smiles an hour. I counted. And her ball hasn’t gone above a two all afternoon.', 'think'),
            BY('Out of ten. On my scale. I made a scale.'),
            BY('The face and the ball disagree. And balls can’t be wrong. They haven’t got the muscles for it.', 'angry'),
            N('He seems very annoyed about this, as if Dimple has done it on purpose to spoil his numbers.'),
          ],
        },
      },
      // ------------------------------------------------ 4. Five Things (outline quest 5)
      {
        id: 's30-step4',
        goal: 'Watch Dimple with each of her five favourite things.',
        hint: 'The sill and the bedtime hum are at Clover’s, the puddles in her yard, Sparks’s racers at the pond, and Byte wherever Byte is.',
        check: 'watch:s30-dimple:five-things',
        scene: {
          id: 's30-list',
          lines: [
            N('Next morning Clover is on your step with a list. It is written on the back of a seed packet and underlined in three places.'),
            CL('Ember’s wrong. She’s fine. But I’ve written down her favourite things, so we can check. Just to show Ember.', 'think'),
            CL('One, the windowsill. Two, stamping puddles with Drizzle. Three, chasing Sparks’s fast ones round the pond.'),
            CL('Four, Byte’s shoelaces. She pulls them undone. He pretends to mind.', 'happy'),
            CL('Five, the hum at bedtime. I hum, she sways. Every night since she hatched.', 'soft'),
            CL('If she’s doing those, she’s fine. Five out of five. That’s fine, isn’t it?'),
          ],
        },
        done: {
          id: 's30-five',
          lines: [
            N('The sill: Dimple won’t climb up. She sits underneath it and smiles at the skirting board.'),
            N('The puddles: Drizzle stamps one, hopefully. Dimple smiles at the splash and doesn’t move.'),
            N('Sparks’s fast ones go tearing round the pond three times, slowing down each time they pass her. She doesn’t chase.'),
            N('At bedtime Clover hums. Dimple lies on her back in her basket and smiles at the ceiling, quite still.'),
            N('Last, Byte, on Clover’s step with his boots stuck out. Dimple comes and looks at his laces for a long time.'),
            N('Then she smiles at them, and goes back indoors.'),
            BY('…She didn’t pull them.', 'sad'),
            BY('I’ve been tying them in single knots. For weeks. So she could get them undone. I didn’t tell anyone that.', 'sad'),
            CL('Nought out of five.', 'sad'),
            N('Clover sits down next to Byte on the step, and neither of them says anything for a while.'),
          ],
        },
      },
      // ------------------------------------------------ 5. Dusty Digs (outline quest 6; lifted text 1)
      {
        id: 's30-step5',
        goal: 'Wait by Dusty’s hole by the stream and see what happens.',
        hint: 'Don’t dig and don’t call them out. Stand at the edge for a while.',
        check: 'wait:s30-dusty-hole',
        scene: {
          id: 's30-hole',
          lines: [
            N('By the stream there is a hole that wasn’t there yesterday. It is very deep, it is getting deeper, and it is singing.'),
            N('That’s Dusty, at the bottom of it, singing a digging song very loudly with a lot of extra verses.'),
            DU('Morning! Lovely morning. Grand day for a hole. I’m not digging for anything. That’s what makes it relaxing.', 'happy'),
            DU('Look at that soil. Look at that worm. Hello, worm. Everything’s fine, worm.', 'happy'),
            N('Dimple has followed you from Clover’s. She takes one look at the hole, dives in, and starts scooping earth out with both hands.'),
            N('Dusty digs faster, so Dimple digs faster. They grin at each other across the hole like two people trying to win an argument.'),
            N('Your Nubbin starts flinging soil about on the bank, to be part of it. Most of it lands on you.'),
            DU('See? She gets it. Dig. Keep your hands busy and the rest of you can’t catch up.', 'happy'),
          ],
        },
        done: {
          id: 's30-drizzle',
          lines: [
            N('Then Drizzle comes down the bank, slowly, the way she does everything. She sits at the edge of the hole and says nothing at all.'),
            N('Dusty’s spade stops. Dimple goes on scooping for a while on her own, and then she stops too.'),
            DU('…She used to sit like that. Fossil. On the edge, while I dug. Just there.', 'sad'),
            DU('I dug her out with a spoon, you know. Two days. Twenty years and a bit. I was still counting the bit.', 'sad'),
            N('Dusty sits down in the bottom of the hole with the spade across their knees. Then they cry, properly, for the first time since the hill.'),
            N('Drizzle climbs down and leans on them, without patting or fussing. She leans with the whole of her weight, like a sandbag.'),
            N('…'),
            N('After a long time Dusty wipes their face with the back of a muddy wrist, which makes it worse.'),
            // Lifted text 1 (Inside Out, 2015: Bing Bong). childLines below.
            DU('I’m okay now.', 'soft'),
            N('Up on the bank, Dimple is watching. Her smile slips at one corner; she puts it back, and it slips again.'),
          ],
        },
      },
      // ------------------------------------------------ 6. What Luna Saw (outline quest 7)
      {
        id: 's30-step6',
        goal: 'Go up the hill path with Luna at three in the morning.',
        hint: 'Set out after midnight, without a lantern. Luna says the moon is enough, and Dimple would see a light.',
        check: 'walk:s30-hill-path:night',
        scene: {
          id: 's30-luna',
          lines: [
            N('Dawn. Somebody knocks very quietly, which in this valley means Luna, on her way to bed.'),
            LU('Sorry. My evening, your morning. I wouldn’t, only it’s three nights now.', 'think'),
            LU('I work the hill at night; the dew’s best at three. Three nights running, at three, Clover’s gold one has been on the hill path.'),
            LU('She goes up towards Fossil’s flower. Halfway, she stops, and turns round, and goes home.'),
            LU('She doesn’t bounce up there. That’s what got me. I didn’t know she could walk.', 'sad'),
            LU('Things look like what they are, at night. Nobody’s watching, so nobody bothers. Come up with me tonight.', 'soft'),
          ],
        },
        done: {
          id: 's30-path',
          lines: [
            N('Three in the morning, and the hill is grey and silver: wet grass, a fingernail of moon, and the smell of Luna’s night stocks.'),
            N('Halfway up the path, there she is. Dimple, walking slowly uphill, on her own.'),
            N('She isn’t smiling. Her face is just a face, and the ball above it is darker than any ball you have seen that wasn’t Sable’s.'),
            LU('That’s where she stops. Every night.', 'soft'),
            N('Dimple stops and looks up the hill towards the flower, which is too far off to see. Then she turns round, and sees you.'),
            N('For a second her face does nothing at all.'),
            N('Then the smile goes on like a lamp, and she bolts down the hill past you, and home.'),
            LU('Did you see her face? Before?', 'soft'),
            LU('That’s her. That’s the one who needs finding. The other one’s for us.', 'sad'),
          ],
        },
      },
      // ------------------------------------------------ 7. Hush’s Job (outline quest 8; chapter 7, after c7-stillness)
      {
        id: 's30-step7',
        goal: 'Look closely at Hush’s flat stone in the old wall.',
        hint: 'It’s low down by the wall lantern, under the ivy. Brush the frost off with your sleeve.',
        check: 'inspect:s30-hush-stone',
        scene: {
          id: 's30-wall',
          lines: [
            N('The frosts have come, and the Grove is white at dawn round the fourth post. Moss, after his long talk, has not gone back up the hill.'),
            N('You find him at the old wall, by Hush’s lantern post, with frost on his back that he hasn’t bothered to shake off.'),
            M('Clover’s gold one. Luna told me. Luna tells me things at dawn, when I am too tired to argue.', 'think'),
            M('Hush. The quiet one. You have heard her name in the tale. I did not tell you her job.'),
            M('When the White Year stilled half the valley, the rest of us went at the snow with shovels. Hush went and sat where the still ones could see her.', 'sad'),
            M('She never tried to wake one. If one shivered, she took it for a conversation. That was her job, and nobody gave it her.'),
            M('People thought that made her a sad thing. They were wrong about which part was sad.', 'soft'),
            M('Low in the wall. The flat stone, by your foot. Look at it properly. She meant it to be looked at.'),
          ],
        },
        done: {
          id: 's30-stone',
          lines: [
            N('You brush the frost off. The stone is covered in marks scratched fine as hair: rings and lines, hundreds of them, edge to edge.'),
            M('A ring for a joy kept. A line for a grief kept. That was her way of counting.', 'soft'),
            N('There are a few plain rings, and a few plain lines. Nearly all the rest are both: a ring with a line through it.'),
            M('Most things are both. She knew that before any of us.'),
            M('Briar thought Hush was gloomy. Hush thought Briar was loud. They were never more than a field apart, those two.', 'happy'),
            Y('What did she think sad was for?'),
            M('Sad is a lantern, she said. It shows people where you are.', 'soft'),
            M('A Nubbin smiling on the outside is a Nubbin in the dark with its lantern out. Nobody can find it. It thinks that is a kindness.', 'sad'),
            N('Moss lays one small hand flat on the stone, over the marks, the way you would warm your hand on a mug.'),
          ],
        },
      },
      // ------------------------------------------------ 8. Fidget, and the shed (outline quests 9–10)
      {
        id: 's30-step8',
        goal: 'Come back to Clover’s at dusk and see how Fidget is settling in.',
        hint: 'Dusk, Clover said. The frost comes down fast now; get there before the yard goes white.',
        check: 'watch:s30-shed:dusk',
        scene: {
          id: 's30-fidget',
          lines: [
            N('The first frost week. Clover sends Bristle up the lane to fetch you, which Bristle does by stamping on your doormat until you come.'),
            N('In Clover’s kitchen, in a nest of tea towels by the range, an egg is rocking. Then it is in pieces, and something orange is running.'),
            CL('Oh! Oh, look at her. She hasn’t stopped since she cracked. Not once.', 'happy'),
            N('The new one is very small and very orange. She runs to the door, then the window, then under the table, then the door again.'),
            N('She checks every Nubbin in the kitchen, one by one, as if she were counting them. Then she checks them all again.'),
            CL('Fidget. That’s her name. She named herself, really. Look at her go.'),
            CL('Finally, someone who fusses more than me.', 'happy'),
            N('Dimple bounces over to welcome her, beaming. Fidget counts Dimple twice.'),
          ],
        },
        done: {
          id: 's30-shed',
          lines: [
            N('At dusk the frost comes down over the yard like a cloth over a cage. Fidget goes very still for one second, and then she gets to work.'),
            N('She herds the whole household into the shed: Bristle, Flinch, the fussy one, Drizzle, Dimple. She pushes from behind with her head.'),
            N('Then she drags the slop bucket across the yard, an inch at a time, and shoves it hard against the shed door.'),
            N('Fidget stands guard at the bucket, stiff as a peg, eyes wide, listening to the dark.'),
            CL('Every night since the frost. In they go, and the bucket.', 'sad'),
            N('From inside the shed comes Dimple, louder than ever: bounce, bounce, bounce off the walls, a jolly, frantic thudding.'),
            N('Nothing else. The others have gone quiet in there, the way pot plants go in a cupboard.'),
            CL('She just wants them safe. I know how she feels. I’ve felt it every night of my life.', 'soft'),
            CL('Safe is not the same as well.', 'think'),
            N('Clover hears herself say it. She sits down, quite suddenly, on the bucket.'),
            CL('That’s Moss’s. And I said it like it was mine. Well. It is now.', 'sad'),
          ],
        },
      },
      {
        id: 's30-step9',
        goal: 'Open the shed without frightening Fidget.',
        hint: 'Fidget needs to see the door shut. Hang the blanket across the open doorway, stand the bucket on its hem, and leave a gap underneath.',
        check: 'puzzle:s30-shed-door',
        scene: {
          id: 's30-blanket-ask',
          lines: [
            CL('I can’t just kick the bucket over. She’d go to pieces. She’s a week old and she’s doing her best.', 'sad'),
            CL('And I can’t leave them in there. Listen to Dimple. Listen to the others not.'),
            N('Fidget sits by the bucket, guarding it. Her ball is whirling so fast it looks like a little orange wheel.'),
            N('Your Nubbin sits down beside her, not sure why. It looks hard at the bucket too, to be helpful.'),
            CL('Help me open it without her knowing it’s open. You’re better at that sort of thing than me. Hazel was.', 'think'),
            N('There’s a blanket frozen stiff on Clover’s washing line. There’s the bucket, and the shed door, which opens outwards.'),
          ],
        },
        done: {
          id: 's30-blanket',
          lines: [
            N('You open the door while Fidget is counting something else, and hang the stiff blanket across the doorway like a curtain.'),
            N('You stand the bucket on one corner of the hem. Underneath, there is a gap a Nubbin could push through without trying.'),
            N('Fidget comes back, inspects the blanket and the bucket, and pushes the bucket one inch further. Shut; she sits down.'),
            N('A minute later Drizzle’s nose comes out under the hem. Then the fussy one, then Flinch, who jumps at the blanket, and then doesn’t.'),
            N('They go in and out as they please all evening. Fidget counts them every time, and seems to find the number acceptable.'),
            CL('Look at that. Shut, and open. Both. Hazel would have called that a fudge.', 'happy'),
            CL('She liked a fudge. She said most of the good things are fudges.', 'soft'),
            N('Dimple doesn’t come out. When you look under the hem, she is sitting at the back of the dark shed, smiling at nobody.'),
          ],
        },
      },
      // ------------------------------------------------ 10. Dimple Goes (outline quest 11; chapter 8)
      {
        id: 's30-step10',
        goal: 'Follow Dimple’s trail and find her.',
        hint: 'She took her toys on Fossil’s cushion, and she is dropping them as she goes. Follow the toys.',
        check: 'find:s30-dimple-trail',
        scene: {
          id: 's30-gone',
          lines: [
            N('Early autumn. Clover is at your gate before it is light, in her dressing gown and wellies, with Drizzle tucked under one arm.'),
            CL('She’s gone. Dimple. Her basket was cold when I got up.', 'shock'),
            CL('She’s taken nothing but the cushion off the sill. Fossil’s cushion, toys and all.', 'sad'),
            CL('What does she want with it? She’s done nothing but pile rubbish on it for weeks.'),
            N('Drizzle wriggles out from under Clover’s arm, drops to the path, and sets off down the lane on her own, slow and certain.'),
            CL('Drizzle? Drizzle! She never goes anywhere on her own. She hates hurrying.', 'shock'),
            N('Dusty is coming up the lane with a spade on one shoulder, early as always. One look at Clover, and they put the spade down.'),
            DU('She’s going back to where the happy was. I would. I’ve been trying to all summer.', 'soft'),
            N('You go after Drizzle, all three of you, down the lane in the half dark.'),
          ],
        },
        done: {
          id: 's30-trail',
          lines: [
            N('Under Clover’s window there is a cotton reel in the frost. At the end of the lane, a pine cone; at the stile, half a wooden peg.'),
            N('One toy at a time, the trail runs out of the lane and east along the stream, towards the striped cliff.'),
            DU('The cliff. She came with us once or twice. Rode on Fossil, mostly, which Fossil allowed. Nobody else ever got to.', 'sad'),
            ...S30_HOLLOW_FOUND,
          ],
        },
      },
      // ------------------------------------------------ 11. The Spoon Hole (outline quest 12: the payoff)
      {
        id: 's30-step11',
        goal: 'Stay at the spoon hole until Dimple stops.',
        hint: 'Don’t call to her and don’t pull her out. Stay where you are; this takes as long as it takes.',
        check: 'sit:s30-spoon-hole',
        scene: {
          id: 's30-hollow',
          lines: [
            N('Before anybody else can move, Drizzle walks to the lip of the hollow and slides down into it, slowly, unasked.'),
            N('She sits close to Dimple: not touching, but close. She says nothing at all.'),
            N('Dimple turns, and the smile goes on like a lamp. She bounces, and offers Drizzle a pebble, a root, a handful of dust.'),
            N('Drizzle doesn’t take any of it. She stays.'),
            CL('Shall I go down? I should go down. I’m her— I should—', 'shock'),
            DU('Leave them a minute. That one knows what she’s doing. Look at her.', 'soft'),
            N('Up at the rim you sit down in the frosty grass, because standing feels like hurrying somebody.'),
          ],
        },
        done: {
          id: 's30-stopped',
          lines: [
            N('And then Dimple stops, in the middle of a bounce, almost. She sits down hard on Fossil’s cushion, and the smile goes.'),
            N('Not off, like a lamp. It goes the way frost goes off a window, from the edges in, until there is only her face.'),
            N('Dimple says nothing. She looks at her own hands as if she has only just found them.'),
            N('Up at the rim, Clover puts both hands over her mouth.'),
          ],
        },
      },
      // ------------------------------------------------ 12. The Thunder Day (outline quest 13)
      {
        id: 's30-step12',
        goal: 'Stay at the rim while Clover tells you how Dimple and Fossil met.',
        hint: 'Just listen. The hollow will tell you when it’s over.',
        check: 'wait:s30-spoon-hole:clover-story',
        scene: {
          id: 's30-thunder',
          lines: [
            N('Clover sits down at the rim. She doesn’t take her eyes off the hollow.'),
            CL('Do you know how they met? Dimple and Fossil? I never told anyone. It didn’t seem like a story.', 'soft'),
            CL('Dimple hatched in a thunderstorm, under my kitchen table. First night of her life, and the sky fell in.'),
            CL('She wailed. Hours. I tried everything. Milk, humming, the lot. Nothing.', 'sad'),
            CL('And Fossil came down off the sill. She never came down off the sill. She walked across my kitchen floor and sat beside her.'),
            CL('Didn’t lick her. Didn’t fuss. Just sat, the whole storm, till it blew over. I made three pots of tea and drank none of them.'),
            CL('After that they shared the sill. Every digging day, for years. Gold one and sand one in the window, like two loaves.', 'happy'),
            DU('I never knew that. Twenty years, and I never knew that.', 'soft'),
            CL('Her best thing started on her worst day.', 'soft'),
          ],
        },
        done: {
          id: 's30-blue-gold',
          lines: [
            N('Down in the hollow, Dimple’s ball goes blue. Not pale: deep blue, like the sky an hour after sunset.'),
            N('Then she cries the way Nubbins cry. A thin, high whistle like wind across a bottle, and a shaking from her ears to her feet.'),
            N('She leans sideways until she is leaning on somebody, and stays there, and whistles.'),
            N('Nobody moves. Up at the rim Clover is crying too, without a sound, and Dusty has a hand on her back.'),
            N('…'),
            N('When it stops, Dimple’s ball is still blue. And it is gold as well, the two colours turning slowly round each other.'),
            DU('I’ve never seen that. Every Nubbin in this valley, twenty years, and I have never once seen a ball do that.', 'shock'),
            CL('Neither have I.', 'soft'),
            N('Dimple looks up at the rim, and doesn’t smile. She looks at you all like somebody who has been found.'),
          ],
        },
      },
      // ------------------------------------------------ 13. Up the Rope (outline quest 14; lifted text 2)
      {
        id: 's30-step13',
        goal: 'Haul the basket up out of the spoon hole.',
        hint: 'Pull steady, hand over hand. Jerk it and the basket spins, and Dimple will give you a look.',
        check: 'carry:s30-basket:spoon-hole-rim',
        scene: {
          id: 's30-rope',
          lines: [
            DU('Right. Basket.', 'happy'),
            N('Dusty has a coil of rope over one shoulder and a log basket on the end of it. Nobody knows where Dusty keeps rope, but they always have some.'),
            DU('Never go near a hole without a rope. First thing Hazel ever told me. Second thing was, give that spoon back.'),
            N('Anybody with long enough legs climbs out. The rest go in the basket: Dimple with Fossil’s cushion, and anyone small who sat with her.'),
            CL('Gently. Gently! She’s had a morning.', 'shock'),
            DU('Two on the rope. You pull, I’ll count. I’m good at counting. I count bits.', 'soft'),
          ],
        },
        done: {
          id: 's30-rim',
          lines: [
            N('The basket comes up over the lip. Clover has Dimple out of it before it has stopped swinging.'),
            N('She cries all over her: into her fur, on the cushion, on her ears. Dimple lets her, ball blue and gold, quite still for once.'),
            CL('Look at me. I’m worse than she is. I’m a disgrace. Somebody give me a hanky.', 'sad'),
            N('Dusty gives Clover a sock. It’s clean, mostly.'),
            // Lifted text 2 (Inside Out, 2015: Sadness). childLines below.
            CL('Crying helps me slow down and obsess over the weight of life’s problems.', 'happy'),
            N('She laughs at herself, and blows her nose on the sock, and laughs harder. Dimple watches her face the whole time.'),
            DU('You can keep the sock.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 14. Up the Hill (outline quest 15, first half)
      {
        id: 's30-step14',
        goal: 'Sit with Dimple by Fossil’s flower.',
        hint: 'Sit down near her on the hilltop and stay. You’ll know when it’s time to get up.',
        check: 'sit:s30-fossils-flower',
        scene: {
          id: 's30-hill',
          lines: [
            N('That afternoon Dimple walks up the hill. Not on anyone’s shoulder: up the path, past the halfway place, slowly, on her own feet.'),
            N('Drizzle walks beside her, slower still. Dusty walks behind with Fossil’s cushion under one arm, and doesn’t hurry anybody.'),
            N('At the top is Fossil’s flower, sandstone-coloured, a little bent by the frost. Dimple sits down in front of it.'),
            N('Drizzle sits on one side of her. Dusty sits on the other, cross-legged, and sets the cushion in the grass, dent up.'),
            N('Nobody does anything. The wind goes over, and down in the valley somebody is burning leaves.'),
            N('Your Nubbin, who has copied Dimple all autumn, comes and sits down too. It copies the sitting perfectly.'),
          ],
        },
        done: {
          id: 's30-fidget-hill',
          lines: [
            N('Then a noise comes up the path: small feet, very fast, and a thin worried squeak. Fidget.'),
            N('She has woken in the kitchen and found everybody gone. She has come all the way up the hill alone, checking every bush.'),
            N('At the top she spins round and round in the grass, looking for everybody at once. Her ball is whirling like a top.'),
            N('Fidget skids to a stop in front of you, every whisker out, and says nothing at all.'),
            N('Clover comes puffing up the path behind her, too late, in one welly.'),
            N('Before anybody else can move, Dimple gets up. She goes to Fidget and sits down right beside her, and stays.'),
            N('She doesn’t smile at her, or bounce. She sits, the way she was sat with.'),
            N('Fidget spins slower, and slower. Then she stops, and leans on Dimple, and her ball settles to a small warm orange.'),
            CL('Where did she learn that?', 'soft'),
            DU('Under your kitchen table. In a thunderstorm.', 'soft'),
          ],
        },
      },
    ],
    // ------------------------------------------------ outline quest 15, second half: the rubbing
    complete: {
      id: 's30-complete',
      lines: [
        ...S30_RUBBING_START,
        N('Beside it, small and close, you draw Drizzle’s: a plain ring, just touching.'),
        ...S30_RUBBING_END,
      ],
    },
    rewards: [
      {
        id: 's30-memory-page',
        kind: 'feature',
        label: 'Hush’s memory page',
        description:
          'A new journal page for each of your Nubbins, laid out like Hush’s stone: a ring for a joy kept, a line for a grief kept, a ring with a line for both. Filled in from moments already in your save. A keepsake to read, never a task.',
      },
      {
        id: 's30-rain-hat',
        kind: 'cosmetic',
        label: 'Pale-blue rain hat',
        description: 'Drizzle’s spare rain hat, Nubbin-sized. A Nubbin wearing it turns its face up whenever it rains.',
      },
      {
        id: 's30-cushion',
        kind: 'decor',
        label: 'Fossil’s windowsill cushion',
        description:
          'Flat and old, with a dent the shape of somebody small and round. Any Nubbin may sit in it. Clover says Fossil would want it sat on, not kept.',
      },
      {
        id: 's30-ribbon',
        kind: 'cosmetic',
        label: 'Blue-and-gold ribbon',
        description: 'Sparks dyed it twice to match a ball nobody had seen before. The two colours turn round each other in the light.',
      },
    ],
    sets: { s30Done: true },
    childLines: {
      's30-drizzle#8': 'There. That’s a bit better. Not mended. Better.',
      's30-rim#4': 'Crying slows me right down, so I can feel it properly. I think that’s what it’s for.',
    },
    notes:
      'THEME. Sadness has a job: it shows the people who love you where to find you. Hush kept the valley’s griefs (S1), and ' +
      'her stone says most things are both, a ring with a line through it. Fidget is “safe is not the same as well” in a ' +
      'small, funny, domestic key. Dimple is never fixed: she ends smiling most of the time, and now she can be sad too. ' +
      'SIGNATURE CHOICE (Tier 3, in the line). s30-ring (step 2) is paid off nine outline quests later. broke or sat: ' +
      'Drizzle comes on the search (s30-gone), climbs down unasked (s30-hollow), sits on the hill (s30-hill) and has her mark ' +
      'in the rubbing (s30-complete). helped: Drizzle stays home, and you take her place in all four (the -helped variants). ' +
      'broke and sat share scenes; the difference is felt in step 2 only. ' +
      'VARIANTS (all in SIDE_STORY_S30_VARIANTS; Scene has no conditions). ' +
      's30-wall-s1 replaces s30-wall when S1’s wall memory has been seen (outline: s1Done; see SIM). ' +
      's30-hole-youngest plays straight after s30-drizzle when s5Done. ' +
      's30-gone-helped replaces s30-gone when s30-ring = helped. ' +
      's30-trail-s5 replaces s30-trail when s5Done (Dimple walks Fossil’s last walk in reverse: water, tree, cliff). ' +
      's30-hollow-helped replaces s30-hollow when s30-ring = helped. ' +
      's30-hollow-youngest plays straight after s30-stopped when s5Done. ' +
      's30-hill-helped replaces s30-hill, and s30-complete-helped replaces s30-complete, when s30-ring = helped. ' +
      'Everything else is shared and written so that it works with either companion (“leaning on somebody”, “anyone small ' +
      'who sat with her”). ' +
      'AFTERWARDS (Tier 2). Once s30Done is set, s30-after-clover, s30-after-dusty, s30-after-byte and s30-after-sparks join ' +
      'those Keepers’ ordinary talk lines (each plays once as new talk, then sits in their rotation like any other line). ' +
      'Clover’s household gains Fidget, who now shuts the shed only halfway; Dimple and Drizzle share the sill; Dimple’s ball ' +
      'sometimes shows blue and gold together (a rare idle state, never a stat). ' +
      'TIMING. Step 1 opens on the first morning after c6-close (the morning after the rain). Steps 1–6 run in chapter 6. ' +
      'Step 7’s scene waits until c7-stillness-3 has played (chapter 7), then plays the next time the player is in the Grove ' +
      'at dawn. Steps 8–9 follow in chapter 7 (the first frost week; c7-open is the first frost). Step 10’s scene waits for ' +
      'chapter 8 (after c8-open and its add-ons) and plays on a morning when the player is home, never during the Hollow ' +
      'expedition. Steps 10–14 and the complete scene are one day and play in one sitting. If chapter 9 opens before step 10 ' +
      'has begun, S30 closes unfinished with no rewards and no s30Done. ' +
      'SIM: (1) once step 10 has begun, hold chapter 9’s opening until S30 completes (same backlog rule as S5 and S27). ' +
      '(2) s1Done is the outline’s read for s30-wall-s1, but S1 only completes at chapter 9’s end (its last step checks ' +
      'chapter:9:end), so it is always false in this window. Read “S1 step s1-step2 complete” (s1-hush has played) instead; ' +
      'until the engine can, s30-wall plays for everyone and nothing breaks. (3) “Your youngest Nubbin” in the s5Done ' +
      'variants is the Nubbin that got S5’s gift (its stats sheet says “A gift from Fossil”), not whoever is youngest now. ' +
      '(4) Hush’s memory page: one page per Nubbin you own when S30 completes, and for each one hatched later. Rings, lines ' +
      'and both are drawn from save events: first hatch (ring), a farewell or a grey scar (line), a rebirth or Fossil’s gift ' +
      '(both), a bond with Byte’s shoelace joke or a race win (ring). It reads the save and writes nothing; no task, no timer. ' +
      'CHECKS. visit:s30-clover-cottage (enter Clover’s cottage); watch:s30-acorn-ring (go out to the rain butt; the choice ' +
      'then plays); minigame:s30-bounce-party (three short party games, no fail); watch:s30-dimple:five-things (five ' +
      'observation points, any order: sill, yard puddle, pond with Sparks’s racers, Byte, the bedtime hum after dusk); ' +
      'wait:s30-dusty-hole (stand near the hole for about twenty seconds without digging); walk:s30-hill-path:night (any ' +
      'night after midnight, Luna walks with you; carrying a lit lantern sends Luna to ask you to put it out); ' +
      'inspect:s30-hush-stone; watch:s30-shed:dusk; puzzle:s30-shed-door (hang blanket, place bucket on hem; pulling the ' +
      'bucket away makes Fidget squeak and drag it back, no fail); find:s30-dimple-trail (follow the dropped toys); ' +
      'sit:s30-spoon-hole and sit:s30-fossils-flower (hold Sit nearby; standing up early just restarts the wait); ' +
      'wait:s30-spoon-hole:clover-story (met when the story ends); carry:s30-basket:spoon-hole-rim (a hand-over-hand rope pull). ' +
      'STAGING. Mood balls carry the story: Dimple’s ball goes pale and thin in step 1, sits at Byte’s “two” at the party, goes ' +
      'dark on the night path, deep blue in the hollow, then blue and gold together (new two-colour swirl). Nubbin crying is a ' +
      'thin high whistle and a full-body shake (new SFX and anim). Fidget’s ball whirls when she is frightened and settles ' +
      'to a small warm orange when someone sits with her. Your Nubbin copies Dimple: the smile in step 1, the bounces in step ' +
      '3, the sitting in step 14. Hush’s stone needs a close-up: hundreds of fine scratched rings and lines. Clover’s cottage ' +
      'needs a deep sill with the dented cushion, a shed with an outward door, a rain butt, a bucket and a washing line. ' +
      'CARE. No clinical words. Nobody tells Dimple to cheer up as a lesson; Sparks’s party is kind, and Ember’s and Byte’s ' +
      'readings are the Keepers’ own ways of seeing. The hollow is waist-deep on a person, and Dusty’s rope is there from the ' +
      'start. Hazel’s third rule is shown, never quoted or named. ' +
      'LEARNING GROVE. The outline asks for an edu version (a face and a feeling can be different; sadness helps people know ' +
      'you need them; sitting with a sad friend without fixing them; worries that keep us too safe; naming feelings). It is ' +
      'not part of this file. The two quoted lines have childLines here.',
  },
];

// ================================================================== variants
export const SIDE_STORY_S30_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- step 7: replaces s30-wall when S1’s wall memory was seen
  {
    id: 's30-wall-s1',
    lines: [
      N('The frosts have come, and the Grove is white at dawn round the fourth post. Moss, after his long talk, has not gone back up the hill.'),
      N('You find him at the old wall, by Hush’s lantern post, with frost on his back that he hasn’t bothered to shake off.'),
      M('Clover’s gold one. Luna told me. Luna tells me things at dawn, when I am too tired to argue.', 'think'),
      M('You know she sat with the still ones. You walked here with me, and heard her ask to be kept.', 'soft'),
      M('I never told you what she thought sad was for.'),
      M('People thought it made her a sad thing, the sitting. They were wrong about which part was sad.', 'soft'),
      M('Low in the wall. The flat stone, by your foot. Look at it properly. She meant it to be looked at.'),
    ],
  },
  // ---------------------------------------------------------------- step 5: plays after s30-drizzle when s5Done
  {
    id: 's30-hole-youngest',
    lines: [
      N('Then your youngest Nubbin comes down the bank: the one Fossil sat with until dark. It climbs into the hole and sits on Dusty’s boot.'),
      DU('Oh, not you as well.', 'sad'),
      N('Dusty laughs, wetly, gets mud in their mouth, and laughs at that too.'),
      DU('She trained you both. Didn’t she. The old madam. Sat on a sill for twenty years and trained the lot of you.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- step 10: replaces s30-gone when s30-ring = helped
  {
    id: 's30-gone-helped',
    lines: [
      N('Early autumn. Clover is at your gate before it is light, in her dressing gown and wellies.'),
      CL('She’s gone. Dimple. Her basket was cold when I got up.', 'shock'),
      CL('She’s taken nothing but the cushion off the sill. Fossil’s cushion, toys and all.', 'sad'),
      CL('What does she want with it? She’s done nothing but pile rubbish on it for weeks.'),
      CL('Drizzle’s under the rain butt and won’t budge. The others are all in a heap. I didn’t know who else to come to.', 'sad'),
      N('Dusty is coming up the lane with a spade on one shoulder, early as always. One look at Clover, and they put the spade down.'),
      DU('She’s going back to where the happy was. I would. I’ve been trying to all summer.', 'soft'),
      N('The three of you set off down the lane in the half dark.'),
    ],
  },
  // ---------------------------------------------------------------- step 10: replaces s30-trail when s5Done
  {
    id: 's30-trail-s5',
    lines: [
      N('On the bank of your pond, where you held Fossil up in the shallows, there is a sock, laid out neatly.'),
      N('Under Hazel’s crooked tree, half a wooden peg, just where the wrinkled fruit once fell into Fossil’s lap.'),
      DU('She’s doing the walk. Fossil’s walk. Backwards. The water, the tree, the cliff.', 'shock'),
      DU('I told it at Clover’s table every night for a fortnight. I thought she was asleep under the sill.', 'sad'),
      N('From the tree the trail runs east along the stream, a pine cone, then a cotton reel, towards the striped cliff.'),
      ...S30_HOLLOW_FOUND,
    ],
  },
  // ---------------------------------------------------------------- step 11: replaces s30-hollow when s30-ring = helped
  {
    id: 's30-hollow-helped',
    lines: [
      N('Drizzle is at home under the rain butt. So it is you who climbs down, carefully, and sits in the dust at the back of the hollow.'),
      N('Dimple turns, and the smile goes on like a lamp. She bounces at you, and offers you a pebble, a root, a handful of dust.'),
      N('She performs. She runs the streamer race on her own in a space the size of a bath, and does the hat toss without a hat.'),
      N('You don’t clap, and you don’t stop her. Your knees go cold, and then numb.'),
      CL('Shall I come down? I should come down. I’m her— I should—', 'shock'),
      DU('Leave them a minute. Look at her. She’s nearly out of tricks.', 'soft'),
      N('It takes a long time. It takes longer than the party did.'),
    ],
  },
  // ---------------------------------------------------------------- step 11: plays after s30-stopped when s5Done
  {
    id: 's30-hollow-youngest',
    lines: [
      N('Your youngest Nubbin goes over the lip after them, sliding down on its bottom, and sits on Dimple’s other side.'),
      N('Fossil sat with it once, until dark. It seems to remember how.'),
      DU('Course it does.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- step 14: replaces s30-hill when s30-ring = helped
  {
    id: 's30-hill-helped',
    lines: [
      N('That afternoon Dimple walks up the hill. Not on anyone’s shoulder: up the path, past the halfway place, slowly, on her own feet.'),
      N('You walk beside her, and every few steps she checks that you are still there. Dusty walks behind with Fossil’s cushion, and doesn’t hurry anybody.'),
      N('At the top is Fossil’s flower, sandstone-coloured, a little bent by the frost. Dimple sits down in front of it.'),
      N('You sit on one side of her. Dusty sits on the other, cross-legged, and sets the cushion in the grass, dent up.'),
      N('Nobody does anything. The wind goes over, and down in the valley somebody is burning leaves.'),
      N('Your Nubbin, who has copied Dimple all autumn, comes and sits down too. It copies the sitting perfectly.'),
    ],
  },
  // ---------------------------------------------------------------- complete: replaces s30-complete when s30-ring = helped
  {
    id: 's30-complete-helped',
    lines: [
      ...S30_RUBBING_START,
      N('Clover takes the charcoal off you and draws one more beside it, small and close: a plain ring, just touching. Yours.'),
      ...S30_RUBBING_END,
    ],
  },
  // ---------------------------------------------------------------- afterwards: Keeper talk lines once s30Done (Tier 2)
  {
    id: 's30-after-clover',
    lines: [
      N('Clover’s shed door stands half shut every dusk now. Fidget sees to it herself; she has decided half is the right amount.'),
      N('On the deep kitchen sill, Dimple and Drizzle sleep in the sun, gold and pale blue, one pressed against the other.'),
      CL('She still smiles most of the day. I wouldn’t change it. And now when she isn’t, I know where to look.', 'soft'),
    ],
  },
  {
    id: 's30-after-dusty',
    lines: [
      DU('I go up and sit with Fossil on Thursdays. Dimple comes. Gets there first, some weeks. Waits for me.', 'soft'),
      DU('We don’t do anything. It’s the best bit of the week. Don’t tell Clover. She’ll bring a flask.', 'happy'),
    ],
  },
  {
    id: 's30-after-byte',
    lines: [
      BY('I’m keeping the chart. For science. Dimple’s ball, every time I see her.', 'think'),
      BY('Mostly gold. Sometimes blue. Sometimes both, which my scale didn’t cover, so I drew a new column. It’s my favourite column.', 'soft'),
      BY('Also she pulled my laces on Tuesday. Both of them. I’ve logged it as a result.', 'happy'),
    ],
  },
  {
    id: 's30-after-sparks',
    lines: [
      SP('I sat still! On the hill! With Dimple! For…', 'happy'),
      SP('Fifty-one seconds. Byte timed it. Nearly a minute. That’s a personal best. That’s a valley record.', 'happy'),
      SP('It was really nice. It was horrible. It was really nice.', 'soft'),
    ],
  },
];

/**
 * Every flag this story sets. It also reads, through variants only: s5Done (s30-hole-youngest,
 * s30-trail-s5, s30-hollow-youngest) and s1Done (s30-wall-s1; see SIM note 2 in the quest notes).
 */
export const SIDE_STORY_S30_FLAGS: string[] = [
  's30-ring', // broke | sat | helped (s30-ring choice, step 2; picks the -helped variants)
  's30Done',
];

export const SIDE_STORY_S30_CHECKS: string[] = [
  'visit:s30-clover-cottage',
  'watch:s30-acorn-ring',
  'minigame:s30-bounce-party',
  'watch:s30-dimple:five-things',
  'wait:s30-dusty-hole',
  'walk:s30-hill-path:night',
  'inspect:s30-hush-stone',
  'watch:s30-shed:dusk',
  'puzzle:s30-shed-door',
  'find:s30-dimple-trail',
  'sit:s30-spoon-hole',
  'wait:s30-spoon-hole:clover-story',
  'carry:s30-basket:spoon-hole-rim',
  'sit:s30-fossils-flower',
];
