/**
 * Side story S31, "The Great Gourd", for "Hazel’s Grove" (Part M, rank 36). Tier 2: it never
 * changes the campaign.
 *
 * SOURCE. *It’s the Great Pumpkin, Charlie Brown* (CBS television special, 1966), from Charles M.
 * Schulz’s Peanuts. Rights holder: Peanuts Worldwide LLC. Copyrighted: theme and shape only, plus
 * the three one-sentence quotes listed below. Schroeder’s music is not used, and nobody sings.
 *
 * AUDIENCE. 'all'. The three quoted lines have `childLines` replacements for the Learning Grove.
 *
 * FRAME. A Grove side story, set in the valley in chapter 7 (early autumn). Tam, seven, waits all
 * night in the long grass by the dark fourth post for the Great Gourd. The player is the grown-up
 * who stays, or doesn’t. Hazel’s third rule is named once, in the sit choice (s31-long-grass), and
 * nowhere else. Window: opens after c7-stillness, closes when chapter 8 opens.
 *
 * GROVE FLAGS READ (through variants; see the quest’s notes for exactly what plays where):
 *   - Sable’s trust at the start of Gourd Night (sim snapshot `s31-sable30`, true at 30 or more):
 *     with s31-night = sat, Sable comes out of the frost and sits beside you (s31-shape-sable,
 *     s31-four-sable, s31-light-sable). She never speaks. S31 never changes her trust.
 *   - `wisp` = spared | sable at midnight on Gourd Night: Wisp steals Tam’s toffee apple
 *     (s31-midnight-wisp in place of s31-midnight).
 *   - `keptStone` = false after the chapter 10 dawn (the Long-Grass lantern has lit itself): Tam’s
 *     ambient line s31-ambient-lantern (the Great Gourd did it).
 *
 * FLAGS WRITTEN. `s31-letter` (toys | strays | busy), `s31-night` (guise | party | sat),
 * `s31-sable30` (sim snapshot, bool) and `s31Done`. No campaign flag.
 *
 * LIFTED TEXT (copyrighted; three one-sentence quotes, each used exactly once, as the Part M outline
 * lists them; source: the 1966 special as broadcast, checked in the outline against the Peanuts
 * Wiki and the Halloween Specials Wiki; to be checked against the licensed soundtrack before ship):
 *   1. s31-creed#8, Tam: “There are three things that I’ve learned never to discuss with people:
 *      religion, politics, and the Great Gourd.” (“the Great Pumpkin” adapted to “the Great Gourd”.)
 *   2. s31-rock#1, Ned: “I got a rock.”
 *   3. s31-next-year#8, Tam: “Well, that’s nothing compared to the fury of a woman who’s been
 *      cheated out of guising!” (“trick-or-treats” adapted to “guising”.)
 * Everything else is original.
 *
 * CARE NOTES.
 *   - Tam’s belief is treated kindly. The story never says he is right or wrong, and nobody wins by
 *     mocking him. The creed’s joke about religion and politics stays as the special has it.
 *   - A child out at night is never alone: Nettie is with him, Ivy has told Mum and Clover, Clover’s
 *     lamp is lit all night, Luna passes on her rounds, there are blankets, and Ivy fetches him.
 *   - The frost is cold, not dangerous, for people. Nubbins stay out of the frosty grass, except
 *     Sable, who is grey already. Your Nubbin rises at the edge, where the frost hasn’t reached.
 *   - The flying ace’s war is pure play: no named enemy, no real war.
 *   - Nubbins and animals don’t speak. Sable is narrated only. Wisp says nothing here.
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
const MOSS = say('moss');
const FERN = say('fern');
const SPARKS = say('sparks');
const CLOVER = say('clover');

// ---------------------------------------------------------------- new speakers (valley children)
const S31_TAM: Speaker = {
  id: 's31-tam',
  name: 'Tam',
  kind: 'other',
  basedOn: 'Linus van Pelt (Peanuts: It’s the Great Pumpkin, Charlie Brown)',
};
const S31_IVY: Speaker = {
  id: 's31-ivy',
  name: 'Ivy',
  kind: 'other',
  basedOn: 'Lucy van Pelt (Peanuts: It’s the Great Pumpkin, Charlie Brown)',
};
const S31_NED: Speaker = {
  id: 's31-ned',
  name: 'Ned',
  kind: 'other',
  basedOn: 'Charlie Brown (Peanuts: It’s the Great Pumpkin, Charlie Brown)',
};
const S31_NETTIE: Speaker = {
  id: 's31-nettie',
  name: 'Nettie',
  kind: 'other',
  basedOn: 'Sally Brown (Peanuts: It’s the Great Pumpkin, Charlie Brown)',
};

const TAM = say('s31-tam');
const IVY = say('s31-ivy');
const NED = say('s31-ned');
const NETTIE = say('s31-nettie');

// ================================================================== shared pieces
/** Quest 11, “If”: the turn, shared by s31-if (you sat) and s31-if-away. */
const S31_IF_TURN = (whoGetsAWord: string): Line[] => [
  NETTIE('Tam. My feet have gone.', 'sad'),
  NETTIE('Tam. What if he isn’t coming?'),
  TAM(`He’s coming. And when he comes, I’ll put in a good word for everybody. You. Ivy, even. ${whoGetsAWord}`),
  TAM('If he comes, I’ll ask him to—', 'happy'),
  N('He stops. He heard it too.'),
  TAM('…If.', 'sad'),
  TAM('I said “if”. Out loud. In the patch. He’ll have heard it. Hearing things is the whole point of him.', 'sad'),
];

/** Quest 12: the shape rises, and Tam faints. Shared by every s31-shape scene. */
const S31_FAINT = N('Tam takes one look, says “Oh,” very politely, and faints clean away.');
const S31_NUBBIN_RISES = N(
  'A shape rises at the edge of the white grass, where the frost hasn’t reached. Round, and goggled, and trailing a scarf.',
);

/** Quest 13: Ivy at four. */
const S31_IVY_ARRIVES = N('At four o’clock exactly, a lantern comes bobbing down the lane, grumbling.');
const S31_IVY_LIFTS: Line[] = [
  N('She looks at Tam, fainted in his quilt, and doesn’t laugh. She hands her lantern to Nettie and lifts him, quilt and all.'),
  N('He doesn’t wake. His boots hang down, and she hitches him up and doesn’t complain once.'),
];
const S31_IVY_BLANKET: Line[] = [
  N('She has a blanket over her arm, brought for him. He doesn’t need it; he has the quilt.'),
  N('On the way past, she drops it on you without looking.'),
  IVY('You look frozen. It’s very stupid, sitting out all night. I’m not saying anything nice about it.'),
  N('For Ivy, that is something nice.'),
];
const S31_IVY_HOME: Line[] = [
  N('Up the lane, a light goes on in the end cottage. Ivy gets Tam up the stairs, takes his boots off, and tucks him in.'),
  N('Then she walks back to her own room and shuts the door. Nobody ever hears about it from her.'),
];
const S31_SIGN_AT_DAWN = N('Tam’s sign is still standing, WELCOME GREAT GOURD, with the R still backwards for luck.');

/** Quest 14’s close and the letter’s trace: shared ends of the complete scenes. */
const S31_NEXT_MORNING = N(
  'Next morning, Tam is down at the long grass before anyone else is up. By the foot of his sign, someone has left something.',
);
const S31_KEEPSAKES: Line[] = [
  N('Sparks won’t take the goggles back. She says they’ve seen action now, and it would be wrong.'),
  N('Your gourd lantern goes on the wall by the gate, where it can be seen from the air. Its face is still mostly thinking about smiling.'),
];

// ================================================================== the quest
export const SIDE_STORY_S31: Quest[] = [
  {
    id: 's31',
    code: 'S31',
    title: 'The Great Gourd',
    source:
      'It’s the Great Pumpkin, Charlie Brown (Peanuts, CBS 1966; Peanuts Worldwide LLC): a small boy who believes what nobody else does, and waits all night in a cold field. Theme and shape, plus three listed one-sentence quotes.',
    audience: 'all',
    trigger: {
      where: 'Hazel’s Grove: Tam on the Grove wall by the gate',
      when: 'Chapter 7, after c7-stillness (early autumn). Gourd Night is the first dusk after step 6. Closes when chapter 8 opens; unfinished if Gourd Night has not come.',
    },
    speakers: [S31_TAM, S31_IVY, S31_NED, S31_NETTIE],
    steps: [
      // ------------------------------------------------ 1. The Letter
      {
        id: 's31-step1',
        goal: 'Help Tam spell his letter to the Great Gourd.',
        hint: 'Tam is on the Grove wall by the gate. Fix the words he asks about; he will argue about some of them.',
        check: 'puzzle:s31-letter:spelling',
        scene: {
          id: 's31-wall',
          lines: [
            N('The plums have gone soft, and the wind smells of bonfires two gardens away. Autumn is coming in at the edges.'),
            N('A small boy is sitting on your Grove wall, wrapped in a patchwork quilt, writing very hard with his tongue out.'),
            N('The quilt goes right down to his boots. It has been patched so often that some of the patches have patches.'),
            TAM('Don’t look. It’s private. It’s a letter.'),
            TAM('…You can look a bit. I need a speller.', 'think'),
            TAM('I’m Tam. I live in the lane. I’m seven, and I’m writing to the Great Gourd.'),
            Y('The what?'),
            TAM('The Great Gourd. Every Gourd Night he rises out of the most sincere gourd patch in the valley and flies over, bringing toys.', 'happy'),
            TAM('Not the biggest patch. Not the tidiest. The most sincere one. He can tell.'),
            TAM('Nobody else believes in him. That’s all right. He doesn’t need everybody. He only needs one patch.'),
            N('He holds out the letter. It begins DEAR GRAET GORD, and it has been rubbed out so hard in three places that there are holes.'),
          ],
        },
        done: {
          id: 's31-letter',
          lines: [
            N('Between you, GRAET becomes GREAT. Tam keeps GORD for a while on principle, then gives it up.'),
            TAM('Now the important bit. What to ask for. You choose. You’re a grown-up; he might take you more seriously.', 'think'),
          ],
          choices: [
            {
              id: 'toys',
              label: 'Toys. It’s what he brings. Ask for toys.',
              set: { 's31-letter': 'toys' },
              then: [
                Y('Ask for toys. He’s bringing them anyway.'),
                TAM('Toys. Yes. Not greedy ones. Medium toys.', 'happy'),
                N('He writes A MEDIUM AMOUNT OF TOYS PLEASE, and underlines PLEASE twice.'),
              ],
            },
            {
              id: 'strays',
              label: 'Something for the strays in the Hollow.',
              set: { 's31-letter': 'strays' },
              then: [
                TAM('The strays?'),
                Y('The ones past the falls. Nobody brings them anything.'),
                N('Tam thinks about this with his whole face.'),
                TAM('He’d like that. He’s flying over anyway.', 'soft'),
                N('He writes SOMETHING FOR THE STRAYS IN THE HOLLOW. Then, smaller: THEY ARE NOT GREEDY.'),
              ],
            },
            {
              id: 'busy',
              label: 'Tell him, very politely, that he needn’t come if he’s busy.',
              set: { 's31-letter': 'busy' },
              then: [
                TAM('Not come?', 'shock'),
                Y('Very politely. In case he’s busy. It’s a long night.'),
                TAM('…That’s very thoughtful. Nobody ever thinks he might be tired.', 'think'),
                N('He writes YOU NEEDN’T COME IF YOU ARE BUSY, WE WILL UNDERSTAND. Then, after a long think: MOSTLY.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 2. Three Things (and Fern’s patch)
      {
        id: 's31-step2',
        goal: 'Go with Tam and the lane children to Fern’s gourd patch.',
        hint: 'Fern’s patch is over the wall next door, past the hens. Follow Ivy; she walks fast on purpose.',
        check: 'visit:s31-gourd-patch',
        scene: {
          id: 's31-creed',
          lines: [
            N('Tam folds the letter into four and posts it down the front of his quilt, for safekeeping.'),
            N('Two more children come down the lane: a girl with a straight fringe and a clipboard, and a boy with a round, worried face.'),
            IVY('Tam. Are you writing to that pumpkin again?', 'angry'),
            TAM('Gourd. He’s a gourd. A pumpkin is only one kind of gourd. Fern told me.'),
            IVY('This is my brother. I’m Ivy. I’m ten, and I’m sorry about him in advance.'),
            NED('I’m Ned. Hello. Is it true he flies? Ivy says it isn’t. I’m only asking.', 'think'),
            N('Ivy laughs. Ned laughs too, a beat late because Ivy is, and then looks as if he wishes he hadn’t.'),
            N('Tam gets down off the wall. He draws himself up, quilt and all, to very nearly the height of the gatepost.'),
            TAM('There are three things that I’ve learned never to discuss with people: religion, politics, and the Great Gourd.'),
            N('A very small girl has come down the lane behind them, and is listening hard.'),
            NETTIE('I believe him. I’m Nettie. I’m six. I believe everything Tam says.', 'happy'),
            IVY('You believed the hens could read. Come on. Mum wants the biggest gourd in Fern’s patch, and Tam’s carrying it.'),
            N('Ivy marches Nettie off by the hand. Tam follows with great dignity, holding his quilt up off the mud like a train.'),
          ],
        },
        done: {
          id: 's31-patch',
          lines: [
            N('Fern’s gourd patch is vines going in every direction at once. The gourds are lumpy and leaning, and several are warty.'),
            FERN('Sorry. Sorry about the patch. I grow them badly on purpose. It’s a style.'),
            N('Ivy walks straight to the biggest gourd there is: orange, enormous, and the shape of a sat-on cushion.'),
            IVY('That one. Tam, lift.'),
            TAM('It’s bigger than me.'),
            IVY('Then you’ll have to be bigger than it. Go on.'),
          ],
        },
      },
      // ------------------------------------------------ 3. The Biggest One
      {
        id: 's31-step3',
        goal: 'Carve a gourd lantern with Tam: a smaller, kinder one.',
        hint: 'Pick a small gourd from Fern’s patch and carve it on the cottage step. A kind face takes longer than a fierce one.',
        check: 'craft:s31-gourd-lantern',
        scene: {
          id: 's31-carve',
          lines: [
            N('Tam carries the gourd all the way up the lane, very slowly, like a man carrying a sleeping relative.'),
            N('At the cottage step, Ivy takes it off him, sets it down, and fetches a big knife from the kitchen.'),
            TAM('What’s that for?'),
            IVY('It’s nearly Gourd Night. You carve them. Everyone carves them. You put a candle in.'),
            N('She cuts the top off in one go. Tam makes a noise like a kettle.'),
            TAM('Nobody told me. Nobody TOLD me you cut them.', 'shock'),
            TAM('What if it was a relative of his?', 'shock'),
            IVY('It’s a gourd, Tam. It hasn’t got relatives. It’s got seeds.'),
            N('She carves a face with jagged teeth and one eyebrow higher than the other. It looks a lot like Ivy.'),
            N('Tam sits on the step with his quilt over his head. Nettie sits beside him with a tea towel over hers, to be fair.'),
          ],
        },
        done: {
          id: 's31-kinder',
          lines: [
            N('The gourd you chose is the most lopsided one in Fern’s patch. You carve it slowly, on the step beside the quilt.'),
            N('Round eyes, no teeth, and a mouth that is mostly thinking about smiling.'),
            N('After a while, one corner of the quilt lifts.'),
            TAM('…That one’s kind. He won’t mind that one.', 'soft'),
            TAM('You keep it. Put it somewhere he’ll see it from the air.'),
          ],
        },
      },
      // ------------------------------------------------ 4. The Ball
      {
        id: 's31-step4',
        goal: 'Witness Ivy’s promise, and watch Ned take his kick.',
        hint: 'Ned is on the green at the end of the lane with a ball and a great deal of hope.',
        check: 'watch:s31-ned:kick',
        scene: {
          id: 's31-ball',
          lines: [
            N('Next morning, on the green at the end of the lane, Ivy is holding a ball upright on the grass with one finger.'),
            IVY('Ned. I’ll hold it. You run up and kick it. I won’t pull it away.'),
            NED('You pulled it away last time.', 'think'),
            IVY('That was last time. This time I’ve written it down.'),
            N('She holds out the clipboard: I PROMISE NOT TO PULL THE BALL AWAY, SIGNED IVY. Underneath is a line marked WITNESS.'),
            NED('Will you witness it? Please. A grown-up. Then it counts.', 'soft'),
          ],
          choices: [
            {
              id: 'sign',
              label: 'Sign as witness.',
              then: [
                N('You sign. Ned looks at your name on the line as if it were a bridge over a river.'),
                NED('Right. Right. This is it.', 'happy'),
              ],
            },
            {
              id: 'warn',
              label: 'Sign, and tell Ned quietly to watch her finger.',
              then: [
                N('You sign, and tell Ned quietly to watch her finger.'),
                NED('I will. I’ll watch it the whole way.', 'think'),
                IVY('Witnesses aren’t allowed to coach.'),
              ],
            },
            {
              id: 'dont',
              label: 'Don’t sign. Tell Ned not to do it.',
              then: [
                Y('Don’t do it, Ned.'),
                NED('But she’s written it down.', 'sad'),
                N('He signs the witness line himself, in very small letters, and backs off for his run-up.'),
              ],
            },
          ],
        },
        done: {
          id: 's31-kick',
          lines: [
            N('Ned runs with everything he has. At the very last moment Ivy lifts her finger, and the ball rolls gently away.'),
            N('Ned kicks the air, goes up, and comes down flat on his back with a sound like a dropped sack.'),
            NED('…You promised. It was witnessed.', 'sad'),
            IVY('By a biased party. Look at them. They’re obviously on your side. It doesn’t count.'),
            N('She tucks the clipboard under her arm and walks off. Ned lies on the grass and looks at the sky, which at least stays put.'),
          ],
        },
      },
      // ------------------------------------------------ 5. Two Lists
      {
        id: 's31-step5',
        goal: 'Find out whether Ned is really invited to Sparks’s party.',
        hint: 'Sparks is up a ladder outside her workshop at the top of the lane. You will hear her before you see her.',
        check: 'talk:sparks:s31-lists',
        scene: {
          id: 's31-lists',
          lines: [
            N('Ned is still on the green when you come back past. He is holding a card cut in the shape of a cog.'),
            NED('Sparks asked me to her Gourd Night party. Me. On a card.', 'happy'),
            IVY('Sparks keeps two lists. Everybody knows. One of who to ask, and one of who not to ask.'),
            IVY('She’ll have muddled them up. You’re on the wrong one. I’m only saying it to help.'),
            N('Ned looks at the card. The card looks back, cheerfully, being a cog.'),
            NED('I didn’t think it was a mistake. I thought it was a card.', 'sad'),
            TAM('Ask her. That’s what you do. You ask.'),
            NED('I can’t ask. What if she says?'),
            N('He holds the card out to you very carefully, as if it might go off.'),
          ],
        },
        done: {
          id: 's31-everybody',
          lines: [
            N('Sparks is up a ladder with a string of bulbs in her teeth. She takes them out to hear the question, and goes red.'),
            SPARKS('TWO LISTS? Who said two lists? There’s one list. ONE.', 'shock'),
            N('She points at her workshop door, where it is chalked in letters a foot high: GOURD NIGHT, EVERYBODY.'),
            SPARKS('I wrote it on the door so I couldn’t lose it. Tell Ned. No, I’ll tell Ned. NED!', 'happy'),
            N('Down the lane, a small figure on the green sits up very fast.'),
          ],
        },
      },
      // ------------------------------------------------ 6. The Most Sincere Patch
      {
        id: 's31-step6',
        goal: 'Help Tam put up his sign in the patch he has chosen.',
        hint: 'Tam has chosen the long grass by your fourth lantern post. The hammer is in the cottage shed.',
        check: 'build:s31-welcome-sign',
        scene: {
          id: 's31-sincere',
          lines: [
            N('Tam has been all round the valley looking at gourd patches. He comes back with his quilt full of burrs and his mind made up.'),
            N('He walks past three lantern posts, lit and neat, and stops at the fourth.'),
            N('The fourth post stands dark at the edge of the long grass. There isn’t a gourd anywhere near it.'),
            TAM('This one.'),
            Y('There aren’t any gourds here.'),
            TAM('No. But it isn’t pretending. Everywhere else is tidy, for people. This one’s just itself.', 'think'),
            TAM('He’ll like that. The most sincere patch. I’ve got a feeling for sincere.'),
            N('His sign is painted on the back of a tea tray: WELCOME GREAT GOURD. The R is backwards, on purpose, for luck.'),
            N('He also has a toffee apple in a hanky. It’s for the Great Gourd, in case he’s hungry from flying.'),
          ],
        },
        done: {
          id: 's31-moss',
          lines: [
            N('You knock the sign in by the dark post. Tam sets the toffee apple on top and looks at it all the way people look at cathedrals.'),
            N('Moss comes past along the hill path, slowly, the grass hardly bending under him. He stops to read the sign.'),
            TAM('Moss. You’re very old. Is the Great Gourd real?'),
            MOSS('I have never seen it. I have not seen a great many things that are real.', 'think'),
            N('Tam nods slowly, as if that settles it in his favour. Moss goes on up the hill, and you think he might be smiling.'),
            N('Then Clover comes over the stile with three folded blankets, puts them down by the sign, and turns straight round.'),
            CLOVER('I’m not discussing it. Three. One each and a spare. Don’t look at me like that.'),
          ],
        },
      },
      // ------------------------------------------------ 7. Ghosts
      {
        id: 's31-step7',
        goal: 'Get your Nubbin ready for Gourd Night in Sparks’s goggles and scarf.',
        hint: 'Tap your Nubbin and choose Dress. The goggles go on top; the scarf goes round twice and still trails.',
        check: 'place:cosmetic:s31-ace-goggles',
        scene: {
          id: 's31-dusk',
          lines: [
            N('Gourd Night. The sun goes down orange behind the hill, and all down the lane the gourds light up on the steps, one by one.'),
            N('Ivy comes out in a pointed hat and a black cloak, with a broom she is clearly going to hit people with.'),
            IVY('I’m a witch. A costume should be the opposite of your personality. Everyone knows that.'),
            N('Ned is a ghost. His sheet has so many eyeholes that it is more hole than sheet.'),
            NED('I had some trouble with the scissors. I kept thinking I’d got them in the wrong place.', 'sad'),
            NED('I can see really well, though.', 'happy'),
            N('Sparks runs down the lane with a pair of old welding goggles and a long red scarf, and drops them in your arms.'),
            SPARKS('For your Nubbin! Every Gourd Night needs a flying ace. I wore those for twelve years. They’ve seen things.', 'happy'),
            N('Tam is already in the long grass in his quilt, sitting very straight beside his sign. Nettie sits beside him, holding his hand.'),
          ],
        },
        done: {
          id: 's31-ace',
          lines: [
            N('The goggles go on top. The scarf goes round twice and still trails on the ground.'),
            N('Your Nubbin looks up at the darkening sky, very slowly, as if it has a score to settle with it.'),
          ],
        },
      },
      // ------------------------------------------------ 8. The Long Grass (the signature choice)
      {
        id: 's31-step8',
        goal: 'Decide where you’ll spend Gourd Night.',
        hint: 'Ivy is waiting in the lane, Sparks at her workshop, and Tam in the long grass. Choose one; the others will manage.',
        check: 'choose:s31-gourd-night',
        scene: {
          id: 's31-long-grass',
          lines: [
            N('The guisers stop at the edge of the long grass on their way out: a witch, a ghost mostly made of holes, and three small bats.'),
            IVY('Tam. You’re going to sit in a field all night, in the cold, for a pumpkin.'),
            TAM('Gourd. And it’s a patch, not a field.'),
            NED('You could come guising. There are toffee apples. You could come back after.', 'soft'),
            TAM('If I’m not here when he rises, he’ll think nobody meant it. I mean it.'),
            N('Nettie looks at the guisers, and at the bag in Ivy’s hand. Then she sits back down, firmly, next to Tam.'),
            NETTIE('I’m staying. I mean it too. I think.'),
            IVY('Fine. I’m fetching you both at four. I’ve told Mum. I’ve told Clover. Clover’s told everyone.'),
            N('Up the lane, Clover’s window has a lamp in it. It stays lit all night.'),
            IVY('Keeper. I need a grown-up for the lane. Some of the bats are very small.'),
            N('At the top of the lane, Sparks waves both arms at you. Behind her the workshop glows, and somebody is playing a pianola badly.'),
            SPARKS('KEEPER! PARTY! You’re on the list! Everyone is!', 'happy'),
            N('Tam doesn’t ask you anything. He just looks at the dark post, and waits.'),
          ],
          choices: [
            {
              id: 'guise',
              label: 'Go guising with Ivy. Somebody has to mind the bats.',
              set: { 's31-night': 'guise' },
              then: [
                N('You take the smallest bat’s hand. It is sticky already.'),
                TAM('Go on. When he comes, I’ll tell him you were busy. He’ll understand. Probably.'),
                N('From the lane you look back once: two small shapes in the long grass, a sign, and the dark post.'),
              ],
            },
            {
              id: 'party',
              label: 'Go to Sparks’s party. You did say you would.',
              set: { 's31-night': 'party' },
              then: [
                SPARKS('YES! The Keeper’s coming! Pixel, play something faster!', 'happy'),
                TAM('Bring Nettie a sandwich. She won’t ask. She’ll want one.'),
                N('You go up the lane towards the light. The long grass behind you gets darker as the music gets louder.'),
              ],
            },
            {
              id: 'sat',
              label: 'Sit down next to Tam and wait.',
              set: { 's31-night': 'sat' },
              then: [
                N('You sit down in the long grass beside Tam. It is wet, and it is going to stay wet.'),
                Y('My gran had a rule for this. Her third one.'),
                Y('When you don’t know what to do, sit down next to them and wait.'),
                TAM('That’s a rule? Good. I like rules.', 'happy'),
                N('Ivy looks at the three of you in the long grass, opens her mouth, and shuts it again.'),
                IVY('Fine. Four o’clock.'),
                N('The guisers go off down the lane. Sparks waves once more, a bit sadly, and goes in.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 9. I Got a Rock (live if you went guising; told otherwise)
      {
        id: 's31-step9',
        goal: 'Find out how the guising went.',
        hint: 'The guisers go door to door down the lane and back. Ned will want to show you what he got.',
        check: 'talk:s31-ned:rock',
        scene: {
          id: 's31-guising',
          lines: [
            N('The lane is all lit gourds and cold noses. At every door the guisers tell a joke, and hold out their bags.'),
            N('At the first door, Ivy gets a toffee apple and the bats get nuts. Ned looks in his bag for a long moment, then holds it open for you.'),
            N('There is a rock in it.'),
            N('At the second door: pennies and toffee for everyone, and for Ned, a rock.'),
            NED('…Maybe they’re running out of things.', 'think'),
            N('At Fern’s door there are honey cakes. Fern gives everyone a honey cake, then looks at Ned, and gives him a rock.'),
            FERN('I’m so sorry. I panicked. It seemed to be the custom.', 'shock'),
            N('At Byte’s door, Byte looks at the witch and the bats and the ghost with too many holes, and goes back in for something.'),
            N('He comes out with a rock. It has a little paper label tied on with string.'),
            N('Ned doesn’t look in his bag any more. He just holds it open, and waits for the clunk.'),
          ],
        },
        done: {
          id: 's31-rock',
          lines: [
            N('Ned holds up the rock with the label, so you can read it. In Byte’s small square capitals: BASALT.'),
            NED('I got a rock.'),
            NED('But Byte wrote what it is. Nobody ever writes down what my things are.', 'soft'),
            NED('You have it. For being the witness. I know it didn’t count.', 'soft'),
            N('It is heavy and cold and very ordinary. You put it in your pocket, and find you keep checking it’s there.'),
          ],
        },
      },
      // ------------------------------------------------ 10. The Flying Ace (every branch)
      {
        id: 's31-step10',
        goal: 'Your Nubbin is having its own night. Guide it home from the war.',
        hint: 'Keep low along the hedges and out of the frosty grass. The lit windows of Sparks’s workshop are friendly lines.',
        check: 'minigame:s31-flying-ace',
        scene: {
          id: 's31-ace-roof',
          lines: [
            N('Meanwhile, on the roof of the end cottage, a small figure in goggles and a long red scarf is at war.'),
            N('Your Nubbin is the flying ace. It stands on the ridge tiles and stares into the dark at an enemy only it can see.'),
            N('It ducks and weaves and shakes one paw at the sky. Then something only it can hear goes wrong with its engine.'),
            N('It spins three times on the tiles, slides down the slates, and drops into the water butt with a small, heroic splash.'),
            N('Shot down, behind the lines. It climbs out, wrings its scarf out with great dignity, and looks about for cover.'),
            N('Far off across the hedges, Sparks’s workshop glows like a field hospital.'),
          ],
        },
        done: {
          id: 's31-ace-party',
          lines: [
            N('Your Nubbin crawls the last hedge on its belly, slips into the party between everyone’s boots, and hides in the apple-bobbing tub.'),
            N('Ivy, back from guising, puts her hands behind her back and plunges her face in for an apple. She comes up with a lick instead.'),
            IVY('Something LICKED me. Something in the TUB licked me.', 'shock'),
            N('Pixel plays old tunes on the pianola. Your Nubbin, dripping in its goggles, is merry for a jig, tragic for a slow one, and merry again.'),
            N('It sits by the stove gazing into the middle distance, like a veteran. Then it howls, once, by accident, and looks shocked at itself.'),
            N('Before anyone can say anything, it slinks out into the dark, scarf trailing.'),
          ],
        },
      },
      // ------------------------------------------------ 11. If
      {
        id: 's31-step11',
        goal: 'Midnight: Tam is still waiting in the long grass.',
        hint: 'There’s nothing to do but wait. That is the hard part.',
        check: 'wait:s31-long-grass:midnight',
        scene: {
          id: 's31-if',
          lines: [
            N('Nearly midnight. Three lanterns burn steady across the Grove, and the fourth post stands dark over the long grass.'),
            N('The cold has come up out of the ground. Your knees have stopped being knees and become opinions.'),
            N('The spare blanket stays folded on top of the sign. Tam says it’s for the Great Gourd, in case he’s cold from flying.'),
            ...S31_IF_TURN('The Keeper.'),
            N('He pulls the quilt up over his head. From under it comes a small sniff, and then a much bigger one.'),
          ],
          choices: [
            {
              id: 'everyone',
              label: '“Everyone says ‘if’. Even about things they’re sure of.”',
              then: [
                Y('Everyone says “if”, Tam. Even about things they’re sure of.'),
                TAM('…Even you?'),
                Y('Especially me.'),
                N('The quilt comes down as far as his eyes.'),
              ],
            },
            {
              id: 'closer',
              label: 'Say nothing. Shift a little closer.',
              then: [
                N('You say nothing. You shift a little closer, until your shoulder is against the quilt.'),
                N('After a while, the quilt leans back.'),
              ],
            },
          ],
        },
        done: {
          id: 's31-midnight',
          lines: [
            N('Midnight comes and goes. Nothing rises out of the long grass except the cold.'),
            N('An owl goes over, very low, and has a look at the sign.'),
            NETTIE('Is that him?', 'shock'),
            TAM('That’s an owl.', 'sad'),
          ],
        },
      },
      // ------------------------------------------------ 12. Something in the Grass
      {
        id: 's31-step12',
        goal: 'Before dawn, the frost comes in over the long grass.',
        hint: 'Nothing to do but wait. Keep your Nubbins at the edge, out of the white grass.',
        check: 'wait:s31-long-grass:frost',
        scene: {
          id: 's31-frost',
          lines: [
            N('In the small hours the frost comes, the way it has every dawn this autumn.'),
            N('It creeps out of the long grass in a long white tongue, straight for the dark post. The grass goes stiff and silver as it passes.'),
            N('Tam is awake. He has been awake all night, out of principle.'),
            N('Nettie is asleep against him with her mouth open and one boot off.'),
            TAM('Here it comes. Here he comes. That’s what the cold is. It’s him, getting near.', 'shock'),
            N('Out in the white grass, by the post, something moves.'),
          ],
        },
        done: {
          id: 's31-shape',
          lines: [
            S31_NUBBIN_RISES,
            S31_FAINT,
            N('It is your Nubbin, home from the war. It climbs into your lap, still damp from the water butt, and falls asleep at once.'),
            NETTIE('He does that. He fainted at a goose once. Leave him; he likes it.'),
          ],
        },
      },
      // ------------------------------------------------ 13. Four in the Morning
      {
        id: 's31-step13',
        goal: 'See Tam safely home, then wait for the light.',
        hint: 'Ivy is coming at four, as promised. After that, stay a while in the long grass until it gets light.',
        check: 'wait:s31-long-grass:first-light',
        scene: {
          id: 's31-four',
          lines: [
            S31_IVY_ARRIVES,
            IVY('Four o’clock. I said four. Look at the state of you all.', 'angry'),
            ...S31_IVY_LIFTS,
            ...S31_IVY_BLANKET,
            N('She goes off up the lane with Tam, and Nettie trots after with the lantern, yawning, very small.'),
          ],
        },
        done: {
          id: 's31-light',
          lines: [
            ...S31_IVY_HOME,
            N('In the long grass it gets light, slowly. The frost comes off the post in a thin steam.'),
            S31_SIGN_AT_DAWN,
          ],
        },
      },
      // ------------------------------------------------ 14. Next Year
      {
        id: 's31-step14',
        goal: 'Find Tam at the Grove wall.',
        hint: 'He’s on the wall by the gate, where he wrote the letter. He has slept until lunchtime.',
        check: 'talk:s31-tam:next-year',
        scene: {
          id: 's31-next-year',
          lines: [
            N('Tam sleeps until lunchtime. Then he is back on the Grove wall in his quilt, looking at the long grass, with his chin out.'),
            N('Ned is sitting beside him, with a bit of ghost sheet still tucked into his collar, trying to help.'),
            NED('I’ve done loads of silly things. I tried to kick a ball Ivy was holding. Nine times. Ten, now.', 'soft'),
            NED('So you mustn’t feel bad. About waiting in a patch all night for nothing. Everyone does silly things.'),
            TAM('Silly?', 'angry'),
            TAM('He didn’t come because somebody said “if”. That’s a technical problem. That isn’t silly.', 'angry'),
            NED('And Ivy’s told everybody. You must feel awful.'),
            N('Along the lane, Nettie walks past the end of the wall with her nose in the air, and does not look at Tam at all.'),
            TAM('Well, that’s nothing compared to the fury of a woman who’s been cheated out of guising!'),
            TAM('He’ll come next year. Next Gourd Night. I’ll find a patch so sincere he can’t help himself.', 'happy'),
            N('He goes on saying so for some time. Ned, who is kind, listens to all of it.'),
          ],
        },
        done: {
          id: 's31-promise',
          lines: [
            N('When Ned has gone home, Tam turns round on the wall, quilt and all, and looks at you.'),
            TAM('You sat. All night. Even the cold bit.'),
            TAM('Next year. Will you wait with me again?', 'soft'),
          ],
          choices: [
            {
              id: 'yes',
              label: '“Yes.”',
              then: [
                Y('Yes.'),
                TAM('Good. I’ll put you on the list. There’s only one list. It says everybody, but you’re at the top.', 'happy'),
                N('His sign stays by the long grass all winter, and nobody moves it. The frost comes to it every morning, and goes again.'),
              ],
            },
            {
              id: 'blanket',
              label: '“Yes. And I’m bringing my own blanket.”',
              then: [
                Y('Yes. And I’m bringing my own blanket.'),
                TAM('That’s fair. The spare one’s his.', 'think'),
                N('His sign stays by the long grass all winter, and nobody moves it. The frost comes to it every morning, and goes again.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 's31-complete',
      lines: [
        S31_NEXT_MORNING,
        N('One acorn. Just one, very round and very shiny, set exactly in front of the sign.'),
        TAM('It’s a toy. A medium toy. He read the letter.', 'happy'),
        TAM('He couldn’t come, so he sent a deposit.', 'happy'),
        N('Up on the hill, Moss is sitting very still, with the look of someone who has never in his life been near an acorn.'),
        ...S31_KEEPSAKES,
      ],
    },
    rewards: [
      {
        id: 's31-gourd-lantern',
        kind: 'decor',
        label: 'Gourd lantern',
        description:
          'The small, lopsided gourd you carved with Tam: round eyes, no teeth, a mouth mostly thinking about smiling. It glows by the gate after dark.',
      },
      {
        id: 's31-ace-goggles',
        kind: 'cosmetic',
        label: 'Flying-ace goggles and scarf',
        description:
          'Sparks’s old welding goggles and a long red scarf that goes round twice and still trails. A Nubbin wearing them looks at the sky as if it owes them money.',
      },
      {
        id: 's31-rock',
        kind: 'item',
        label: 'Ned’s rock',
        description:
          'A keepsake. A plain grey rock with a paper label in Byte’s small square capitals: BASALT. Given to you for being the witness.',
      },
      {
        id: 's31-sign',
        kind: 'decor',
        label: 'Tam’s sign',
        description:
          'WELCOME GREAT GOURD, painted on a tea tray, R backwards for luck. It stands by the long grass until spring; then Tam lets you keep it.',
      },
    ],
    sets: { s31Done: true },
    childLines: {
      's31-creed#8': 'There are three things I never argue about, and the Great Gourd is all three of them.',
      's31-rock#1': 'Another stone. I’m starting to think it’s me.',
      's31-next-year#8': 'And anyway, Nettie’s crosser than anyone. She missed all the guising, waiting with me.',
    },
    notes:
      'THEME. Rule three as a whole story: the grown-up who stays. Tam is the hero; the Keeper is a guest. The story never ' +
      'says whether the Great Gourd is real, and nobody wins by mocking Tam. Ivy is prickly, not cruel: she carries him home. ' +
      'THE THIRD RULE is named exactly once, in s31-long-grass’s sit choice (canon 14). Nowhere else in S31 may name or quote it. ' +
      'SIGNATURE CHOICE. Step 8 (s31-night = guise | party | sat) pays off in steps 11–14: who is there at midnight (step 11), ' +
      'who rises out of the frost and whether Sable comes (step 12), Ivy’s blanket (step 13) and Tam’s ending (step 14). ' +
      'Step 1’s letter (s31-letter) leaves its trace in the complete scene, thirteen steps later. ' +
      'TIMING. Opens after c7-stillness, at the Grove wall. Steps 1–6 over the following days (step 4 is “next morning”). ' +
      'Gourd Night is the first dusk after step 6’s done (s31-moss): s31-dusk then plays at dusk. Steps 7–13 run in that ' +
      'one night; step 14 plays at lunchtime next day, and the complete scene the morning after. If chapter 8 opens before ' +
      'Gourd Night, the story closes unfinished: no rewards, s31Done stays unset. A step’s scene plays when the previous ' +
      'check is met; its done plays when its own check is met. Checks: puzzle (spelling), visit, craft (carving), watch, ' +
      'talk, build (knock the sign in), place (dress), choose (step 8’s choice itself), talk:s31-ned:rock (met when Ned ' +
      'shows the rock, in any branch), minigame (the flying ace: guide your Nubbin along hedges, away from the frosty grass, ' +
      'to the workshop; no fail state), and the three waits (midnight, frost, first light), which are short skippable night ' +
      'waits with the clock shown, no fail state. ' +
      'VARIANTS (all in SIDE_STORY_S31_VARIANTS). ' +
      'Step 9 scene: s31-guising (default) when s31-night = guise; s31-guising-sat when sat (Ned comes back past the long ' +
      'grass); s31-guising-party when party (the guisers arrive at the party). The done s31-rock is shared. ' +
      'Step 10 is shared by every branch (your Nubbin slips away from you at dusk whatever you chose). ' +
      'Step 11 scene: s31-if (default) when sat; s31-if-away when guise or party (narrated without you; Luna’s lantern and ' +
      'Clover’s lamp keep watch). Step 11 done: s31-midnight (default); s31-midnight-wisp instead when wisp = spared or ' +
      'sable at that moment (either step 11 scene). ' +
      'Step 12 scene s31-frost is shared. Step 12 done: s31-shape (default) when sat and s31-sable30 is false; ' +
      's31-shape-sable when sat and s31-sable30 is true; s31-shape-away when guise or party. ' +
      'Step 13 scene: s31-four (default) when sat and no Sable; s31-four-sable when s31-shape-sable played; s31-four-away ' +
      'when guise or party (no blanket). Step 13 done: s31-light (default); s31-light-sable when s31-shape-sable played. ' +
      'Step 14 scene s31-next-year is shared. Step 14 done: s31-promise (default) when sat; s31-promise-went when guise or ' +
      'party (the second sign, SEAT FOR A KEEPER (IF), appears next morning; keep it beside the first all winter). ' +
      'Complete: s31-complete (default) when s31-letter = toys (one acorn); s31-complete-strays when strays (a heap of fruit, ' +
      'which you put out at the edge of the Grove); s31-complete-busy when busy (nothing, which Tam takes as proof). ' +
      'SABLE. She comes only if you sat (s31-night = sat) AND her trust was 30 or more at the start of Gourd Night ' +
      '(s31-sable30). She is narrated, never a speaker, and never in a choice. S31 never changes her trust. ' +
      'WISP. Plays only if S2 has been decided as spared or sable before midnight on Gourd Night. Often it will not have ' +
      'been (S2 decides at the end of chapter 7); then s31-midnight plays. Wisp says nothing here. ' +
      'AFTER THE STORY (Tier 2). Tam, Ivy, Ned and Nettie become valley children in the lane with ambient lines ' +
      '(s31-ambient-tam, -ivy, -ned, -nettie; any time after s31Done, not during chapters 9–10’s night scenes). Tam’s sign ' +
      'stands by the long grass (by the fourth post, outside the frost decal) until spring, then becomes the s31-sign decor. ' +
      'After the chapter 10 dawn, if keptStone is false (the Long-Grass lantern lit itself), s31-ambient-lantern replaces ' +
      's31-ambient-tam. The gourd lantern decor is placeable from step 3 (s31-kinder) on; the goggles from step 7. ' +
      'SIM: (1) snapshot Sable’s trust when s31-dusk begins and set s31-sable30 = (trust >= 30); (2) do not queue c7-close ' +
      'or open chapter 8 while Gourd Night is running (s31-dusk begun, step 13 not done); (3) during steps 8–13 keep all ' +
      'Nubbins out of the frost decal except Sable (in s31-shape-sable); (4) Gourd Night staging: lit gourds on the lane ' +
      'steps, Clover’s lamp lit, the three lanterns lit and the fourth dark; (5) new decor/cosmetic/item ids as in rewards. ' +
      'ART. Tam: seven, patchwork quilt always, trailing to his boots. Ivy: ten, straight fringe, clipboard; witch’s hat and ' +
      'broom on Gourd Night. Ned: nine, round worried face; ghost sheet with far too many eyeholes. Nettie: six, small, one ' +
      'boot off by the small hours. Your Nubbin: welding goggles on top, red scarf twice round. Sign: tea tray, R backwards. ' +
      'SOUND. Pixel’s pianola plays original tunes only (Schroeder’s music is not used). Nobody sings. One accidental howl.',
  },
];

// ================================================================== variants
export const SIDE_STORY_S31_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- step 9 scene, s31-night = sat
  {
    id: 's31-guising-sat',
    lines: [
      N('Late in the evening a ghost comes back up the lane on its own, dragging its bag. It stops at the edge of the long grass.'),
      NED('Hello. I came to see if he’d come yet.', 'soft'),
      TAM('Not yet. He’s busy being sincere somewhere.'),
      NETTIE('What did you get? Did you get toffee? I didn’t want any. I’m only asking.', 'think'),
      N('Ned turns his bag upside down. Five rocks come out, one after another, with a sound like somebody walking on a beach.'),
      N('One of them has a little paper label tied on with string.'),
    ],
  },
  // ---------------------------------------------------------------- step 9 scene, s31-night = party
  {
    id: 's31-guising-party',
    lines: [
      N('Halfway through the party, the guisers come in from the lane on a gust of cold air: a witch, three bats, and a ghost made mostly of holes.'),
      N('The bats and the witch tip their bags out on Sparks’s workbench. Toffee apples, nuts, pennies, a whole honey cake.'),
      N('Ned tips his out last. Five rocks come out, one after another, and roll in among the spanners.'),
      SPARKS('Oh, Ned.', 'sad'),
      N('Pixel stops playing the pianola in the middle of a tune, out of respect.'),
      N('One of the rocks has a little paper label tied on with string.'),
    ],
  },
  // ---------------------------------------------------------------- step 11 scene, s31-night = guise | party
  {
    id: 's31-if-away',
    lines: [
      N('Nearly midnight. Three lanterns burn steady across the Grove, and the fourth post stands dark over the long grass.'),
      N('Two small shapes sit beside it under a patchwork quilt and a borrowed blanket. The spare blanket stays folded on the sign.'),
      N('Tam says the spare is for the Great Gourd, in case he’s cold from flying.'),
      N('Along the far hedge Luna’s lantern moves slowly, as it does every night. Tonight it passes the long grass more often than usual.'),
      ...S31_IF_TURN('The Keeper, even. Even though they went.'),
      N('He pulls the quilt over his head. Nettie pats it, the way you pat a dog that has been told off.'),
    ],
  },
  // ---------------------------------------------------------------- step 11 done, wisp = spared | sable
  {
    id: 's31-midnight-wisp',
    lines: [
      N('Just after midnight, something thin and grey comes out of the dark under the hedge. One of its ears is torn to a fringe.'),
      N('It goes straight to the sign, takes Tam’s toffee apple off the top, hanky and all, and carries it a little way off.'),
      N('Then it sits down in full view and eats it, very loudly, with its back to them.'),
      N('Tam grips Nettie’s arm.'),
      TAM('Is that him?', 'soft'),
      NETTIE('That’s a thief.'),
      N('Wisp licks the hanky clean, thanks nobody, and goes back under the hedge.'),
    ],
  },
  // ---------------------------------------------------------------- step 12 done, sat + s31-sable30
  {
    id: 's31-shape-sable',
    lines: [
      N('A grey shape rises out of the white grass by the post. It comes slowly, and the frost doesn’t seem to touch it at all.'),
      S31_FAINT,
      N('It is Sable. The frost can’t do anything more to her than it has already done.'),
      N('She looks at Tam, flat out in his quilt. Then she looks at you, for a long time.'),
      N('Then she sits down beside you, close enough to touch, and faces the dark lane with you.'),
      N('Sable says nothing. Her ears stay up.'),
      N('You don’t say anything either.'),
    ],
  },
  // ---------------------------------------------------------------- step 12 done, s31-night = guise | party
  {
    id: 's31-shape-away',
    lines: [
      S31_NUBBIN_RISES,
      S31_FAINT,
      N('You come back down the lane with a lantern before it’s light. Tam is flat out in his quilt, and your Nubbin is asleep on top of him.'),
      NETTIE('Your Nubbin came out of the grass in its glasses, and he FAINTED, and I’ve been the only one awake for HOURS.', 'angry'),
      NETTIE('I didn’t get any toffee. I didn’t get ANYTHING. I sat in a field.', 'angry'),
    ],
  },
  // ---------------------------------------------------------------- step 13 scene, after s31-shape-sable
  {
    id: 's31-four-sable',
    lines: [
      S31_IVY_ARRIVES,
      IVY('Four o’clock. I said four. Look at the state of—'),
      N('She sees Sable. Ivy has an opinion on everything, and she hasn’t got one about this.'),
      ...S31_IVY_LIFTS,
      ...S31_IVY_BLANKET,
      N('Sable doesn’t move. She lets Ivy pass within an arm’s length, and only her ears turn.'),
      N('Ivy goes off up the lane with Tam, and Nettie trots after with the lantern, yawning, very small.'),
    ],
  },
  // ---------------------------------------------------------------- step 13 scene, s31-night = guise | party
  {
    id: 's31-four-away',
    lines: [
      S31_IVY_ARRIVES,
      IVY('Four o’clock. I said four. Look at the state of him.', 'angry'),
      ...S31_IVY_LIFTS,
      N('She doesn’t look at you. There is a blanket over her arm, and she keeps it.'),
      IVY('Nettie. Home.'),
      N('Nettie stamps off up the lane after them with the lantern, furious all the way, and very small.'),
    ],
  },
  // ---------------------------------------------------------------- step 13 done, after s31-shape-sable
  {
    id: 's31-light-sable',
    lines: [
      ...S31_IVY_HOME,
      N('Sable stays beside you until it is light. Neither of you moves.'),
      N('When the sun reaches the top of the hill, she gets up, shakes the frost off her back, and goes to see about breakfast.'),
      S31_SIGN_AT_DAWN,
    ],
  },
  // ---------------------------------------------------------------- step 14 done, s31-night = guise | party
  {
    id: 's31-promise-went',
    lines: [
      N('When Ned has gone home, Tam turns round on the wall and looks at you, and then looks away.'),
      TAM('I don’t need anybody, you know. To wait. I can do it on my own. I nearly did.'),
      TAM('Nettie doesn’t count. She was asleep for the important bit.'),
      N('He gets down off the wall and goes home, holding his quilt up off the mud.'),
      N('Next morning there is a second sign in the long grass, smaller, beside the first. It is painted on the lid of a biscuit tin.'),
      N('It says: SEAT FOR A KEEPER (IF).'),
    ],
  },
  // ---------------------------------------------------------------- complete, s31-letter = strays
  {
    id: 's31-complete-strays',
    lines: [
      S31_NEXT_MORNING,
      N('A small heap of fruit: windfall plums, two apples, and a pear with one bite out of it. Someone has left it for the strays.'),
      TAM('He got the letter. He couldn’t carry it all the way to the Hollow, so he left it here for us to take.', 'happy'),
      N('You put it out at the edge of the Grove that evening. By morning it has all gone, and nobody saw who ate it.'),
      ...S31_KEEPSAKES,
    ],
  },
  // ---------------------------------------------------------------- complete, s31-letter = busy
  {
    id: 's31-complete-busy',
    lines: [
      S31_NEXT_MORNING,
      N('…Or hasn’t. There is nothing at all: just the sign, the frost going off it, and the long grass.'),
      TAM('Nothing. He didn’t come and he didn’t send anything. Because we said he needn’t, if he was busy.', 'think'),
      TAM('So he was busy. And he was polite back. That’s proof, that is.', 'happy'),
      ...S31_KEEPSAKES,
    ],
  },
  // ---------------------------------------------------------------- ambient, after s31Done (the lane)
  {
    id: 's31-ambient-tam',
    lines: [TAM('I’m practising sitting. For next year. You have to start early or your knees go.', 'think')],
  },
  {
    id: 's31-ambient-ivy',
    lines: [IVY('I’ve told Tam the Great Gourd isn’t real eleven times. He writes it down each time. I think he’s keeping score.')],
  },
  {
    id: 's31-ambient-ned',
    lines: [NED('I gave my best rock away. Byte says I can start again. He’s bringing me a granite.', 'happy')],
  },
  {
    id: 's31-ambient-nettie',
    lines: [NETTIE('I’m going guising next year. I’ve decided. Unless Tam says.')],
  },
  // ---------------------------------------------------------------- ambient, after the chapter 10 dawn, keptStone = false
  {
    id: 's31-ambient-lantern',
    lines: [
      TAM('Did you see? The fourth one lit. By itself. At dawn. Nobody touched it.', 'happy'),
      TAM('It was him. The Great Gourd. I told you that patch was sincere.', 'happy'),
      TAM('Ivy says he’s very late. I say he’s very thorough.'),
    ],
  },
];

/** Every flag S31 sets. (Reads, not listed: wisp, keptStone; see the header.) */
export const SIDE_STORY_S31_FLAGS: string[] = [
  's31-letter', // toys | strays | busy (s31-letter, step 1’s done)
  's31-night', // guise | party | sat (s31-long-grass, step 8)
  's31-sable30', // bool; sim snapshot of Sable’s trust >= 30 when s31-dusk begins (SIM note)
  's31Done',
];

export const SIDE_STORY_S31_CHECKS: string[] = [
  'puzzle:s31-letter:spelling',
  'visit:s31-gourd-patch',
  'craft:s31-gourd-lantern',
  'watch:s31-ned:kick',
  'talk:sparks:s31-lists',
  'build:s31-welcome-sign',
  'place:cosmetic:s31-ace-goggles',
  'choose:s31-gourd-night',
  'talk:s31-ned:rock',
  'minigame:s31-flying-ace',
  'wait:s31-long-grass:midnight',
  'wait:s31-long-grass:frost',
  'wait:s31-long-grass:first-light',
  'talk:s31-tam:next-year',
];
