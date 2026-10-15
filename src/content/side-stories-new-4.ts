/**
 * New side stories, part 4: the comedy trio of "Hazel’s Grove" (new-stories brief, S11–S22).
 *
 *   S14 Tilly’s Tabletop   chapter 8 → before ch10   a nine-year-old’s make-believe game, and a grey dragon
 *   S20 Fort Night         chapter 11 → before the final choice   a three-round snow-fort war, then a blizzard
 *   S21 CL-4NK             chapter 3 → before ch6    a one-wheeled lantern-part robot who wants friends
 *
 * None of these changes the campaign. Each sets only its own `sNNDone` flag on completion,
 * plus harmless local flags prefixed `s14-` / `s20-` / `s21-` from choices. They never write
 * campaign flags. S20 reads `s14Done` and `s3Done` for cosmetic variants only (see its notes).
 *
 * Timing: a step’s `scene` plays when the step starts, which is the moment the previous
 * step’s `check` is met; its `done` scene plays when its own `check` is met.
 *
 * What the player knows: S21 can run in chapter 3, before Moss first speaks (c4-open), so
 * Moss never speaks in S21. S14 runs after chapter 8’s notebook but never says where Hazel
 * is or what she found. S20 runs in chapter 11, when Hazel is home, and only glimpses her.
 *
 * Audience 'all'. All words are original; no outside quotes, so no childLines are needed.
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
const FE = say('fern');
const SP = say('sparks');
const PX = say('pixel');
const BY = say('byte');

// ---------------------------------------------------------------- new speakers
/** Sparks’s cousin, aged nine. Shared id: S14 and S20 both use it. */
const TILLY: Speaker = {
  id: 'tilly',
  name: 'Tilly',
  kind: 'other',
  basedOn: 'Tiny Tina as Bunker Master (Borderlands 2: Tiny Tina’s Assault on Dragon Keep), reference only',
};
/** Sparks’s other cousin, used in S20 when S14 has not been played. */
const BODGE: Speaker = { id: 'bodge', name: 'Bodge', kind: 'other' };
const GORDON: Speaker = { id: 'gordon', name: 'Gordon', kind: 'other' };
const WREN: Speaker = { id: 'wren', name: 'Wren', kind: 'other' };
const CLANK: Speaker = {
  id: 'clank',
  name: 'Clank',
  kind: 'other',
  basedOn: 'Claptrap, the CL4P-TP unit (Borderlands), reference only',
};

const TI = say('tilly');
const GO = say('gordon');
const WR = say('wren');
const CK = say('clank');

export const SIDE_STORIES_NEW_4: Quest[] = [
  // ================================================================== S14
  {
    id: 's14',
    code: 'S14',
    title: 'Tilly’s Tabletop',
    source:
      'Borderlands 2: Tiny Tina’s Assault on Dragon Keep (a child running a chaotic tabletop game to work through grief); theme only, all words original',
    audience: 'all',
    trigger: {
      where: 'Hazel’s cottage, the kitchen table',
      when: 'Chapter 8, after c8-close: the first wet afternoon of autumn half-term.',
    },
    speakers: [TILLY],
    steps: [
      {
        id: 's14-step1',
        goal: 'Play the first session of Keeps & Critters: the Bog of Mild Peril.',
        hint: 'Roll the cardboard dice when Tilly says. Arguing with her rulings makes them worse, never better.',
        check: 'minigame:clear:s14-bog-of-mild-peril',
        scene: {
          id: 's14-table',
          lines: [
            N('Rain on the kitchen window. Sparks comes in without knocking, which is how Sparks comes in, towing a small girl in big wellies.'),
            SP('This is Tilly. My cousin. Half-term. She’s nine. She’s in charge now. Sorry.', 'happy'),
            TI('I’m not in charge. I’m the Game Mistress. It’s different. It’s worse.'),
            N('She unrolls a map across Hazel’s table, over forty years of teapot rings. It is drawn in felt tip and smells strongly of it.'),
            N('Then the dice: cardboard, hand-cut, sellotaped at the corners. On every die, the six side just says “LOTS”.'),
            TI('Welcome to Keeps & Critters. Rule one: the Game Mistress is always right. Rule two: see rule one.'),
            TI('Rule three: there are snacks, but only at the end. If you ask about the snacks, the end gets further away.'),
            BY('Is there a rulebook? I’d like to read the rulebook first.', 'think'),
            TI('I’m the rulebook.'),
            N('Pixel is already building a dice tower out of a cereal box. Tilly watches it the way a hawk watches a vole.'),
            TI('Pick your hero. Ten seconds. Nine. Four.'),
          ],
          choices: [
            {
              id: 'knight',
              label: 'A knight with a slightly bent sword.',
              set: { 's14-hero': 'knight' },
              then: [TI('Sir You of the Bent Sword. Good. Bent swords can hit round corners.', 'happy')],
            },
            {
              id: 'wizard',
              label: 'A wizard who mostly does soup.',
              set: { 's14-hero': 'wizard' },
              then: [TI('Soup Wizard. Your spells are hot but slow, and you have to blow on them. Don’t argue. It’s canon.', 'happy')],
            },
            {
              id: 'rogue',
              label: 'A rogue disguised as a hat stand.',
              set: { 's14-hero': 'rogue' },
              then: [TI('Excellent. Nobody suspects a hat stand. Not even other hat stands.', 'happy')],
            },
          ],
        },
        done: {
          id: 's14-bog',
          lines: [
            N('The Bog of Mild Peril is the pond, coloured green and labelled “BOG (MILD)”. A felt-tip frog sits in it, looking unimpressed.'),
            SP('I ATTACK THE BOG.', 'happy'),
            TI('You can’t attack a bog. Roll anyway.'),
            TI('…Natural one. Your sword is now a sandwich.'),
            SP('What KIND of sandwich?', 'shock'),
            TI('Cheese. A sad one. You ate the good half on the way here.'),
            BY('Actually, a one on a six-sided die isn’t technically a natural—'),
            TI('Rule four. Anybody who says “actually” loses a hit point.'),
            BY('That isn’t—', 'shock'),
            N('Byte writes “HP: 8” on his character sheet, crosses it out, and writes “HP: 7 (DISPUTED)”.'),
            N('You roll a LOTS. Tilly decides the bog likes you and lets the whole party across.'),
            N('Nobody is sure why, including her.'),
            TI('Session over. Nobody died. Somebody’s a sandwich. Same time tomorrow.', 'happy'),
          ],
        },
      },
      {
        id: 's14-step2',
        goal: 'Get the party up the Tower of the Tax Toad without going broke.',
        hint: 'Every Shell you pay is taxed again. Pay in things the Toad hasn’t thought to tax yet: Tilly makes it up as she goes, so watch her face.',
        check: 'minigame:clear:s14-tower-of-the-tax-toad',
        scene: {
          id: 's14-tower',
          lines: [
            N('Next afternoon there is a new tower on the map, drawn exactly where Sparks’s workshop chimney stands.'),
            TI('The Tower of the Tax Toad. He taxes everything. He’s very rich and very damp.'),
            PX('Can I build a siege engine?', 'happy'),
            TI('You can build a siege engine. Roll. …Three. Your siege engine is a toad. It works for him now.'),
            N('Pixel looks at the cereal-box dice tower, then at Tilly, and very slowly moves it out of her reach.'),
            TI('RIBBIT. That’ll be two Shells for the ribbit.', 'angry'),
            TI('There’s a tax on hats. A tax on stairs. A tax on being taller than a toad. That’s all of you. Sorry.'),
            BY('And is there a tax on paying the tax?', 'think'),
            N('Tilly’s eyes go very wide and very bright.'),
            TI('…Yes. Thanks, Byte. Thanks SO much.', 'happy'),
          ],
        },
        done: {
          id: 's14-toad',
          lines: [
            BY('It’s a series. Each tax is a tenth of the one before. It converges. We owe him two Shells, two, two, two… forever.'),
            TI('The Toad doesn’t do maths. The Toad does vibes.'),
            BY('Actually—'),
            TI('Six.'),
            N('Then Pixel’s Nubbin, asleep on the bread bin all afternoon, wakes, climbs down onto the map, and eats the Tax Toad.'),
            N('The Toad is cardboard. The Nubbin doesn’t seem to mind.'),
            N('The Toad may have opinions, but nobody will hear them now.'),
            TI('…', 'shock'),
            TI('The Tax Toad has been eaten by a god. That’s canon now. Everyone’s taxes are cancelled.', 'happy'),
            SP('BEST GAME. BEST GAME EVER MADE.', 'happy'),
            N('Tilly laughs so hard she has to lie on the floor. Then she stops, quite suddenly, and looks at the top corner of the map.'),
            N('That corner is coloured grey. The felt tip was pressed so hard it went through the paper, into Hazel’s table.'),
          ],
        },
      },
      {
        id: 's14-step3',
        goal: 'Find Tilly before the last session.',
        hint: 'Listen. When she’s on her own she whistles the two-finger supper call Hazel taught her.',
        check: 'find:tilly:s14-whistle',
        scene: {
          id: 's14-sparks',
          lines: [
            N('The morning of the last session, Sparks is waiting at your gate, quietly. You didn’t know Sparks had a quiet setting.'),
            SP('The dragon in the corner’s got bigger. She redraws it every night. Last night it got a cardigan.', 'sad'),
            SP('It’s Hazel. Obviously it’s Hazel. Hazel taught her to whistle. Two fingers. The supper call.'),
            SP('Hazel went off at the end of the winter. She left Tilly a note. Just Tilly. She won’t open it. It’s in her welly.'),
            SP('She won’t say the name. Just “the dragon”.'),
            SP('She’s gone off somewhere. She does that. You go. She likes you. You’re not a sandwich.', 'soft'),
          ],
        },
        done: {
          id: 's14-gate',
          lines: [
            N('You hear her before you see her: a whistle through two fingers, rising at the end. Every Nubbin in the Grove looks up.'),
            N('Tilly is sitting on the gate that sticks, kicking it. It doesn’t swing. It hardly ever does.'),
            TI('They think it’s supper. It isn’t supper. I just do it.'),
            TI('She said if you whistle it properly, anyone who loves you comes running. She said that.'),
            N('The Nubbins arrive, hopeful, and sit in a row in front of her wellies.'),
            TI('See. It works on them.', 'sad'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask her about Hazel.',
              set: { 's14-approach': 'asked' },
              then: [
                TI('I’m not talking about her.', 'angry'),
                N('A long pause. A Nubbin licks her welly.'),
                TI('She went without saying goodbye. You’re supposed to say goodbye. That’s the RULE.', 'angry'),
                N('She takes the note out of her welly, still folded, damp at one corner. She looks at it. She puts it back.'),
                TI('Come and play. I’ve got a dragon to do.'),
              ],
            },
            {
              id: 'play',
              label: 'Ask her about the dragon instead.',
              set: { 's14-approach': 'played' },
              then: [
                TI('She’s the Grey Grandmother. She’s very old and very rude.'),
                TI('She flew away without saying goodbye. Her hoard is mostly biscuit tins.'),
                TI('She’s the final boss. Final means you can’t have another one after. Come on.', 'sad'),
              ],
            },
          ],
        },
      },
      {
        id: 's14-step4',
        goal: 'Play the last session: get past the Grey Grandmother’s geese and into the Lair.',
        hint: 'Three rounds of dice. You can’t lose to the geese. Worst case, you get a goose.',
        check: 'minigame:clear:s14-lair-geese',
        scene: {
          id: 's14-lair',
          lines: [
            N('The last session. Tilly has drawn the curtains and put a torch under a mixing bowl for “atmosphere”.'),
            N('It mostly lights the bowl.'),
            TI('The Lair. Beyond this door is the Grey Grandmother. First you have to get past her geese.'),
            TI('Her geese are very rude. Rude geese, rude dragon. It runs in the family.'),
            SP('I HIT THE GOOSE WITH MY SANDWICH.', 'angry'),
            TI('Roll. …LOTS. The goose eats the sandwich and is now your friend. You have a goose.'),
            PX('My toad and I would like to help.'),
            TI('Your toad worked for the Tax Toad. The Tax Toad got eaten. Your toad is having a hard time. Roll anyway.'),
            BY('Do I still have seven hit—'),
            TI('Four. You said “do” in an “actually” voice.'),
          ],
        },
        done: {
          id: 's14-dragon',
          lines: [
            N('Tilly lifts an upside-down cereal box off the top corner of the map. Under it is the dragon.'),
            N('She is cut from a biscuit-tin lid and coloured grey, with a cardigan in felt tip and a tiny whistle on a thread.'),
            TI('The Grey Grandmother. She flew away without saying goodbye. She’s the boss.'),
            SP('Right. I roll to hit the—'),
            N('Tilly snatches the dice off the table so fast that one of them tears.'),
            TI('No.', 'angry'),
            TI('Nobody hits her. She’s immune. To swords and sandwiches and toads and geese. To everything.'),
            N('It is suddenly very quiet in the kitchen. The rain has stopped. Nobody noticed when.'),
            TI('I don’t know how it ends. I don’t know how you end it if nobody’s allowed to hit her.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: '“My hero puts the sword down and sits next to the dragon.”',
              set: { 's14-lair': 'sat' },
              then: [
                TI('That’s not a move.', 'think'),
                TI('…What for?'),
                Y('Hazel’s third rule. When you don’t know what to do, sit down next to them and wait.'),
              ],
            },
            {
              id: 'roll',
              label: 'Roll to see if your hero is allowed to sit down.',
              set: { 's14-lair': 'rolled' },
              then: [
                N('You roll the torn die. It lands on the torn side, which has no number on it at all.'),
                TI('That’s… not a number.', 'think'),
                Y('Then the Game Mistress decides. My hero would like to sit down next to the dragon.'),
                N('Tilly looks at the torn die for a long time.'),
                TI('The dice says… the dragon allows it.', 'soft'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask the Game Mistress what the dragon wants.',
              set: { 's14-lair': 'asked' },
              then: [
                TI('She doesn’t WANT anything. She just WENT.', 'angry'),
                N('You don’t say anything. Tilly glares at the dragon. The dragon, being cardboard, glares back.'),
                TI('…She wants someone to sit with her. Fine. FINE.', 'sad'),
              ],
            },
          ],
        },
      },
      {
        id: 's14-step5',
        goal: 'Sit next to the dragon. Wait.',
        hint: 'Don’t roll. Don’t move. Put the dice down. It takes as long as it takes.',
        check: 'wait:s14-table:dragon',
        scene: {
          id: 's14-wait',
          lines: [
            N('You move your counter to the dragon’s square, and leave it there. Your hero is a button.'),
            TI('She doesn’t do anything. She just sits there being a dragon.'),
            Y('That’s all right. We’re waiting.'),
            N('Sparks moves a button next to yours. Then Pixel. Then Byte, after looking round for a rule against it.'),
            BY('Is there a rule against it?'),
            TI('…No.', 'soft'),
            N('Four buttons round a biscuit-tin dragon. At the window, a Nubbin taps on the glass, hoping it might be supper.'),
          ],
        },
        done: {
          id: 's14-tears',
          lines: [
            TI('The dragon says—'),
            N('She stops. She picks up the dragon and holds it in both hands.'),
            TI('The dragon says she had something important to do. Grown-ups always say that.'),
            TI('She says she didn’t say goodbye because she’s rubbish at it. She’d have cried and made it everyone’s problem.'),
            TI('She says—', 'sad'),
            TI('I don’t know what she says. I don’t KNOW. She didn’t SAY.', 'sad'),
            N('Tilly cries the way nine-year-olds cry: all at once, with her whole face.'),
            N('Sparks is round the table before anyone else can move, and says nothing at all. It is the loudest thing Sparks has ever done.'),
            N('Pixel quietly passes a tea towel. Byte quietly passes a better tea towel.'),
            N('You keep your button where it is.'),
          ],
        },
      },
    ],
    complete: {
      id: 's14-complete',
      lines: [
        TI('Session over. Everyone gets snacks. That’s a rule. It was always a rule.', 'soft'),
        N('The snacks are crisps, Fern’s slightly burnt biscuits, and a bowl of grapes the Nubbins have already found.'),
        N('Tilly eats with the dragon in her lap. She doesn’t let go of it once.'),
        TI('The Grey Grandmother isn’t a boss any more. She’s a character. She lives in the game and you can visit her.'),
        TI('And Byte gets all his hit points back. For the tea towel.'),
        BY('Thank you. I’d like that in writing. Actually—', 'happy'),
        TI('Don’t push it.'),
        N('She puts her cardboard crown on your head.'),
        N('The front says GAME MISTRESS. The back, smaller, says “(OR KEEPER)”.'),
        TI('You keep the map. And the dice. Not the torn one. I’m keeping the torn one.'),
        N('When they’ve gone, you find the map spread on Hazel’s table. Someone has coloured the grey corner yellow.'),
        N('“HERE BE HAZEL. SHE IS ALOWED.”'),
        N('Out by the gate, faintly, someone is practising the supper call. Every Nubbin in the Grove goes to look.'),
      ],
    },
    rewards: [
      {
        id: 's14-tabletop',
        kind: 'decor',
        label: 'Keeps & Critters tabletop',
        description:
          'Tilly’s felt-tip map, spread on a small table: the Bog of Mild Peril, the Tower of the Tax Toad, and a yellow corner that says “HERE BE HAZEL”. Tap it to see the buttons move.',
      },
      {
        id: 's14-dice',
        kind: 'cosmetic',
        label: 'Cardboard dice (“roll” emote)',
        description:
          'A set of hand-cut cardboard dice, sellotaped at the corners. Unlocks the “roll” emote: your Keeper rolls, and the result is always LOTS.',
      },
      {
        id: 's14-crown',
        kind: 'cosmetic',
        label: 'The Game Mistress’s Crown',
        description: 'A cardboard crown, felt tip and glitter glue. The front says GAME MISTRESS. The back says “(OR KEEPER)”.',
      },
    ],
    sets: { s14Done: true },
    notes:
      'FOR FUN. Sets only s14Done and the s14- choice flags (s14-hero, s14-approach, s14-lair); none of them changes ' +
      'anything later except that s14Done lets Tilly appear in S20. THEME: play is how children carry big things. ' +
      'QUESTION: when a child is grieving, do you ask about it plainly or let the game carry it? (s14-approach; both ' +
      'are right). RUNNING GAG: Byte loses hit points for saying “actually” (8 → 7 disputed → 6 → 4, restored at the end). ' +
      'SURPRISE: Pixel’s Nubbin eats the Tax Toad. TIMING: opens after c8-close (so the notebook has been found) during ' +
      'autumn half-term; sessions are on separate afternoons. If chapter 10 begins first, the story closes unfinished, ' +
      'no rewards. Never say where Hazel is or what the notebook says: Tilly only knows Hazel “went off”. Hazel left one ' +
      'letter, to you, and Tilly a short note (just Tilly), which stays folded in her welly and is never opened on ' +
      'screen. THE LAIR CHOICE (s14-lair) is a real choice about who ends the game: “sat” is you, quoting Hazel’s third ' +
      'rule (one of only four side stories that quote it: S1, S9, S10 and this one); “rolled” is the dice, read by Tilly; ' +
      '“asked” is Tilly, working it out herself. All three lead to the same wait. DICE MINI-GAME (all three sessions): the player taps to roll ' +
      'two cardboard d6 (the six face reads LOTS); each roll draws a Tilly ruling from a table keyed by s14-hero and the ' +
      'roll (e.g. 1: your weapon becomes a food; LOTS: something befriends you). Three to five rolls per session. It cannot ' +
      'be failed; low rolls only make the ruling sillier. Tower: the Tax Toad’s demand grows each turn; paying in odd ' +
      'items (a hat stand, a goose, soup) ends it faster. Lair: three goose rolls; the worst result is “you have a goose”. ' +
      'In s14-dragon one die tears; the torn die is used for the “roll” choice. wait:s14-table:dragon is a hold-still ' +
      'beat: no input for ~20 seconds (any tap resets it gently, no fail). STAGING: kitchen table top-down view, felt-tip ' +
      'map art with a grey corner that turns yellow at the end; torch-under-a-bowl lighting for the Lair; the biscuit-tin ' +
      'dragon is a single prop sprite with a cardigan. Rain SFX stops during s14-dragon. Tilly whistles in s14-gate and ' +
      's14-complete (two-finger supper whistle SFX); nearby Nubbins run to her. REWARDS at s14-complete: the tabletop ' +
      'decoration (felt-tip map), the dice (“roll” emote; always shows LOTS), the crown (hat).',
  },

  // ================================================================== S20
  {
    id: 's20',
    code: 'S20',
    title: 'Fort Night',
    source:
      'StarCraft and Warcraft as games: real-time strategy, gathering, building, scouting and units that counter each other; theme only, all words original',
    audience: 'all',
    trigger: {
      where: 'The Common below Fern’s orchard, deep in snow',
      when: 'Chapter 11, after c11-open: the first clear morning after the Long Night. Closes before c12’s final choice.',
    },
    speakers: [TILLY, BODGE, GORDON, WREN],
    steps: [
      {
        id: 's20-step1',
        goal: 'Round one: gather snow and sticks, and build your walls before the other fort does.',
        hint: 'Put most of your children on gathering early. Walls first, catapult second: a catapult with no wall is a target with a spoon.',
        check: 'minigame:clear:s20-round1-economy',
        scene: {
          id: 's20-declaration',
          lines: [
            N('The snow after the Long Night is the deep, squeaky kind. Every child in the valley is out in it, and none of them is cold, they say.'),
            N('A sheet of cereal-box card is tied to your gate. The capitals are very angry and the spelling is very brave.'),
            N('“DECLARASHUN OF WAR. FORT NIGHT. THE COMMON. BRING MITTENS. — THE OTHER FORT”'),
            N('Sparks’s cousin is back for the winter holidays, and has found out about snow.'),
            TI('You’re commanding one fort. I’m commanding the other. One of us is going to win, and it’s me.', 'happy'),
            N('On the Common, two forts are marked out in sticks: one by the hedge, one by the frozen ditch.'),
            N('Neither has a wall. Both have flags.'),
            PX('Morning. Referee. I’ve written the rules. Forty-one pages. Nobody will read them. That’s fine. I’ll enforce them.'),
            PX('Three rounds. Each round, the referee teaches one idea. This is educational. Nobody tell the children.'),
            PX('Round one: economy. Snow makes walls. Sticks make the catapult. More gatherers early means more of everything later.'),
            PX('Units: Speedy beats Splashy. Splashy beats Sturdy. Sturdy beats Speedy. It goes round, like the seasons. Or a grudge.'),
            N('Behind Pixel, a small boy in a bobble hat is hit in the ear by a snowball. Nobody has started yet.'),
            GO('I’m all right!', 'happy'),
            PX('That’s Gordon. Gordon gets hit. It isn’t a rule. It’s more like weather.'),
            WR('Commander! I’m Wren! What’s our battle cry, commander?', 'happy'),
          ],
          choices: [
            {
              id: 'fort',
              label: '“FOR THE FORT!”',
              set: { 's20-cry': 'fort' },
              then: [WR('FOR THE FORT!', 'happy'), PX('Classic. Solid. Ruling: approved.')],
            },
            {
              id: 'mittens',
              label: '“FOR WREN’S NAN’S GOOD MITTENS!”',
              set: { 's20-cry': 'mittens' },
              then: [
                WR('FOR MY NAN’S GOOD MITTENS!', 'happy'),
                WR('She knitted them. They’ve got thumbs and everything.'),
              ],
            },
            {
              id: 'gordon',
              label: '“REMEMBER GORDON!”',
              set: { 's20-cry': 'gordon' },
              then: [
                GO('I’m right here.', 'think'),
                N('Your whole fort roars it anyway. Gordon looks touched. Then he is hit by a snowball.'),
              ],
            },
          ],
        },
        done: {
          id: 's20-round1',
          lines: [
            WR('Yes, commander! On it, commander!'),
            N('Every time you point at Wren, she salutes and says something. You point at her rather a lot.'),
            WR('Yes, commander. Yes, commander. Commander, that’s nine times. I’m only little.', 'angry'),
            PX('Notice: your sticks are low. Notice: you can’t recruit more children. You’ve run out of mittens.'),
            PX('Ruling: a snowball that hits a snowman is friendly fire. The snowman has feelings. He’s called Derek.'),
            N('At the whistle, your wall is knee-high, fat and lumpy. Theirs is shoulder-high, thin, and has battlements.'),
            TI('Economy! I put everyone on snow from the very start. I learned it off the Tax Toad.', 'happy'),
            PX('Round one: draw. Theirs is taller. Yours is fatter. Ruling: both of them are walls.'),
          ],
        },
      },
      {
        id: 's20-step2',
        goal: 'Round two: send Zip to scout the other fort and get back unseen.',
        hint: 'Drifts block their lookout’s view. Sprint between them when the lookout turns away. Zip’s ears go flat when he’s spotted.',
        check: 'minigame:clear:s20-round2-scouting',
        scene: {
          id: 's20-scout',
          lines: [
            PX('Round two: scouting. You can’t beat what you can’t see.'),
            N('Sparks lends you a Swift Nubbin called Zip: thin as a whisker, faster than gossip, and unable to sit still for any reason.'),
            N('Zip vibrates in your mittens like a sneeze that hasn’t happened yet.'),
            PX('Send the scout round their fort. Count what they’ve got. Don’t let him get caught.'),
            PX('Being caught means a snowball to the face. For Zip, that’s most of his body.'),
            GO('Can I scout?', 'happy'),
            PX('No, Gordon. You’d get hit.'),
            GO('That’s fair.'),
          ],
        },
        done: {
          id: 's20-intel',
          lines: [
            N('Zip comes back with snow on his eyebrows and something urgent to say, which he says by running round you nine times.'),
            N('You read it in his tracks. Their wall is magnificent. Behind it, there is almost nobody.'),
            N('Three of their children have gone home: one lost a mitten, one lost a boot, and one just wanted his tea.'),
            TI('We are FINE. We have LOADS of people. Some of them are in the wall. As bricks.', 'angry'),
            PX('Ruling: children are not bricks.'),
            PX('…Ruling: nearly.'),
          ],
          choices: [
            {
              id: 'press',
              label: 'Attack now, while they’re thin. It’s a war. They’d do the same.',
              set: { 's20-round2': 'pressed' },
              then: [
                WR('CHARGE! Yes, commander! Charging, commander!', 'happy'),
                N('Your fort pours across the Common. Their wall is splendid, and almost nobody is behind it.'),
                TI('That’s not FAIR!', 'angry'),
                TI('…That’s exactly what I’d have done. I hate it.', 'think'),
                PX('Round two to your fort. Scouting works. It’s horrible. That’s the lesson.'),
              ],
            },
            {
              id: 'wait',
              label: 'Wait till their three come back. Beating half a fort isn’t winning.',
              set: { 's20-round2': 'waited' },
              then: [
                N('You send Zip back carrying a snowball with a smiley face pressed into it. It means “we’ll wait”.'),
                N('Ten minutes later one mitten, one boot and one boy full of tea come trudging back up the lane.'),
                TI('You waited for us? That’s either very nice or very sneaky.', 'think'),
                PX('Round two: draw. Ruling: honour is worth one point. I’ve just added it. Page forty-two.'),
              ],
            },
          ],
        },
      },
      {
        id: 's20-step3',
        goal: 'Round three: send the units that beat theirs, and take their flag.',
        hint: 'Splashy beats Sturdy: wet slush soaks a roller and it slumps. Watch what they switch to, and switch too.',
        check: 'minigame:clear:s20-round3-counters',
        scene: {
          id: 's20-counters',
          lines: [
            PX('Round three. The last one. Counters.'),
            PX('Look at what they’re sending. Send what beats it. That’s all strategy is. Everything else is shouting.'),
            N('Over the ditch, the other fort is massing Sturdy: big children rolling big snowballs, slow as weather.'),
            TI('SURRENDER OR BE ROLLED!', 'angry'),
            N('Your fort answers with its battle cries. “I AM NOT COLD, I AM BRAVE!” “FOR DEREK!” “MUM SAID BE BACK BY FOUR!”'),
            N('Above the hill the sky has gone the colour of a pigeon. Nobody is looking at it except Pixel.'),
            PX('Hm.', 'think'),
          ],
        },
        done: {
          id: 's20-blizzard',
          lines: [
            N('You are one dash from their flag when the snow stops falling down and starts falling sideways.'),
            N('Then it is everywhere. You can’t see their fort.'),
            N('You can’t see your own. You can only hear Gordon, being hit by weather.'),
            PX('STOP. Whistle. Full stop. That’s a real one. That’s a real blizzard.', 'shock'),
            N('Pixel’s whistle is lost in it. Somebody small is crying, and you can’t tell which fort they belong to.'),
            TI('Our wall’s fallen in! It all fell in! I can’t find everyone!', 'shock'),
            N('Your own wall is still standing: knee-high, fat and lumpy. It is nowhere near big enough for everybody.'),
          ],
        },
      },
      {
        id: 's20-step4',
        goal: 'Build one shelter out of both forts, and get every child inside.',
        hint: 'Speedy children fetch, Sturdy children roll, Splashy children pack the gaps. Count heads: Wren is small and easy to miss.',
        check: 'build:shelter:s20-one-fort',
        scene: {
          id: 's20-merge',
          lines: [
            N('Through the white you can just make out the hedge, the ditch, and children from both forts, standing about like dropped gloves.'),
            PX('Referee’s ruling.'),
            PX('…I don’t have a ruling. Commander? You’ve got a wall. They’ve got the snow. Nobody’s got enough.'),
            TI('Is this a trick? Is this a strategy?', 'think'),
            Y('Yes.'),
          ],
          choices: [
            {
              id: 'gate',
              label: 'Kick open your wall and shout them all in.',
              set: { 's20-merge': 'gate' },
              then: [
                N('You kick a gap in your own wall. “IN! EVERYONE IN!”'),
                N('Your fort, which has been taught all morning to do what you say, does it, and starts pulling the others in by their scarves.'),
              ],
            },
            {
              id: 'carry',
              label: 'Carry your wall to them, snowball by snowball.',
              set: { 's20-merge': 'carried' },
              then: [
                N('Your gatherers know how to move snow fast. You taught them that this morning.'),
                N('It turns out that was what it was for.'),
              ],
            },
            {
              id: 'middle',
              label: 'Meet in the middle. Both walls, one shelter.',
              set: { 's20-merge': 'middle' },
              then: [
                N('You meet in the ditch between the forts. Both sides bring snow. Both sides bring sticks.'),
                N('The catapult becomes a roof beam. Derek the snowman becomes a door.'),
              ],
            },
          ],
        },
        done: {
          id: 's20-count',
          lines: [
            PX('Head count.'),
            PX('…Everyone. Even Gordon.', 'soft'),
            GO('I got hit by a whole sky.', 'happy'),
            N('Inside it is close and blue and smells of wet wool. Forty mittens steam.'),
            N('Somebody is eating snow. Pixel rules against it, then allows it.'),
            TI('That’s my wall, in our roof. That bit’s mine.'),
            WR('Commander? Which fort won?'),
            N('Outside, the wind drops as suddenly as it came. Somebody pokes a hole in the roof to look.'),
          ],
        },
      },
    ],
    complete: {
      id: 's20-complete',
      lines: [
        N('The sky is clear and black and enormous. Every star the valley owns is out, and a few it has borrowed.'),
        N('Nobody goes home. Both forts lie on their backs in one fort and look up.'),
        WR('That one’s a mitten. That one’s Gordon. That one’s Derek.', 'happy'),
        PX('Final ruling. Both forts win. I’ve written it in pen. Pen is final.'),
        TI('So what was it for, then? The economy and the scouting and the counters?', 'think'),
        Y('So we could build one fort fast, when it mattered.'),
        TI('…That’s annoying. That’s a really good answer.'),
        N('Up at the cottage a lamp is lit in the window, and somebody in a blanket is watching the Common.'),
        N('Tilly puts two fingers in her mouth and whistles the supper call, rising at the end. From the window, faintly, it comes back.'),
        TI('She can still do it.', 'soft'),
        PX('Prizes. Commander’s hat: it was a tea cosy. Snowball launcher: prototype. Ruling: point it away from Gordon.'),
        PX('And the fort’s yours. I’ll build you one for the Grove that only comes out when it snows.'),
      ],
    },
    rewards: [
      {
        id: 's20-snow-fort',
        kind: 'decor',
        label: 'Snow fort',
        description:
          'A low, lumpy, unbeatable snow fort for the Grove, with a catapult roof beam and a door shaped like a snowman called Derek. Appears whenever it snows.',
      },
      {
        id: 's20-commander-hat',
        kind: 'cosmetic',
        label: 'Commander’s hat',
        description: 'A tea cosy with a feather in it, issued by the referee. Nubbins near you salute. Most of them get it wrong.',
      },
      {
        id: 's20-snowball-launcher',
        kind: 'item',
        label: 'Snowball-launcher toy',
        description: 'Pixel’s prototype: a spring, a spoon and a lot of string. Lobs a soft snowball in winter. Point it away from Gordon.',
      },
    ],
    sets: { s20Done: true },
    notes:
      'FOR FUN. Sets only s20Done and the s20- choice flags (s20-cry, s20-round2, s20-merge). THEME: strategy is only ' +
      'as good as what it is for; the morning’s economy lesson is what builds the shelter. QUESTION (s20-round2): press ' +
      'an advantage or wait for a fair fight; both are defensible. COMEDY: Pixel’s rulings, Wren’s replies to repeated ' +
      'orders, Gordon always being hit, the children’s battle cries. SURPRISE: the real blizzard. ' +
      'TIMING: chapter 11 (midwinter), after the Long Night; must close before c12’s final choice, else it closes ' +
      'unfinished with no rewards. Never mention how the Long Night ended, the shard, Moss or Corvin. ' +
      'COUSIN VARIANT: if s14Done, the other commander is Tilly (speaker tilly). If not, every tilly line is played ' +
      'by Bodge (speaker bodge: Sparks’s other cousin, twelve, deadly serious, clipboard), with these replacements: ' +
      's20-declaration#3 → “Sparks’s other cousin has come for the winter holidays, and has found out about snow.” ' +
      '(narrator); s20-declaration#4 → “Bodge. Commander. You command one fort. I command the other. Projected outcome: me.”; ' +
      's20-round1#6 → “Economy. Everyone on snow from minute one. I read a book.”; ' +
      's20-complete#8 → “Bodge looks up at the cottage window, where somebody in a blanket is waving, and salutes.” ' +
      '(narrator); s20-complete#9 → “Everyone’s saluting tonight.” (bodge). All other tilly lines work for either. ' +
      'SUN AND MOON VARIANT: if s3Done, your fort flies a sun flag and theirs a moon (or the reverse, at random), and ' +
      's20-declaration#5 (the first of the two lines about the Common; #6, “Neither has a wall. Both have flags.”, ' +
      'stays) becomes “On the Common, two forts are marked out in sticks, one under a sun flag and one under a ' +
      'moon. Since the Moot, it’s a friendly war. Mostly.” Otherwise the flags are a sock and a tea towel. ' +
      'HAZEL: the window glimpse in s20-complete is Hazel (chapter 11, home); she is never named and does not speak. ' +
      'RTS MINI-GAMES (no fail state; the story continues on any result): round 1 economy, 90 s: assign 8 children ' +
      'between snow, sticks and building; the wall’s height shows the result, but the round is always called a draw. ' +
      'Notices (“your sticks are low”, “you’ve run out of mittens”) play as barks. Wren barks a new line each time she ' +
      'is tapped, getting crosser after 5 taps. Round 2 scouting: steer Zip round the far fort between drifts while a ' +
      'lookout sweeps; spotted = snowball, restart from the last drift. Round 3 counters, 60 s: the enemy sends waves ' +
      'of Sturdy, then Speedy, then Splashy; you pick the counter for each (Speedy > Splashy > Sturdy > Speedy). Just ' +
      'before the flag is reached, the blizzard ends the round (whiteout, wind SFX). Step 4 build:shelter: a short ' +
      'co-op build in whiteout; the count shows how many children are inside; complete when all 20 are in. ' +
      'STAGING: night sky with dense stars at s20-complete; the cottage window glows; two-finger whistle SFX answered ' +
      'faintly. REWARDS at s20-complete: snow-fort decoration (shows only in snowy weather), commander’s hat ' +
      '(tea cosy), snowball-launcher toy (winter only).',
  },

  // ================================================================== S21
  {
    id: 's21',
    code: 'S21',
    title: 'CL-4NK',
    source:
      'Borderlands: the tiny, over-enthusiastic robot who desperately wants friends and can’t do stairs; theme only, all words original',
    audience: 'all',
    trigger: {
      where: 'Hazel’s cottage, the front step',
      when: 'Chapter 3, after c3-open, on a sunny early-summer morning. Closes before chapter 6.',
    },
    speakers: [CLANK],
    steps: [
      {
        id: 's21-step1',
        goal: 'Show Clank round the Grove.',
        hint: 'He follows you on one wheel. Go round things, not over them: he can’t do steps, kerbs or roots, though he believes he can.',
        check: 'walk:clank:grove-tour',
        scene: {
          id: 's21-unveil',
          lines: [
            N('Something is coming up the lane, squeaking. It’s Pixel, pushing a wheelbarrow with a tea towel over it.'),
            PX('Morning. Don’t be alarmed. Be a bit alarmed. A normal amount.'),
            PX('After Sparks fixed the lantern posts there was a whole box of parts left over. I couldn’t just leave them in a box.'),
            N('Off comes the tea towel. Underneath: a lantern hood, a glass chimney, a brass wick-winder for a nose, and one wheel.'),
            PX('Garden helper. Watering, weeding, carrying. In theory.'),
            N('Pixel turns the wick-winder. Something inside begins to warm, then whistle, rising, like a kettle that has just heard good news.'),
            CK('HELLO! Hello hello HELLO. I am CL-4NK! The four is silent! So is the dash!', 'happy'),
            CK('Call me Clank! You are my BEST FRIEND!', 'happy'),
            Y('We’ve only just—'),
            CK('Best friend. Decided. Announcement: I HAVE A BEST FRIEND!', 'happy'),
            N('He rolls forward to shake your hand, rolls straight off the cottage step, and lands on his hood in the thyme.'),
            CK('Announcement! I have found the step!', 'happy'),
            CK('The step is very good. The step is also my best friend.'),
            PX('That’s one. I gave it a week before he met the step. I was being optimistic.', 'think'),
          ],
        },
        done: {
          id: 's21-tour',
          lines: [
            CK('Announcement: this is a POND! Announcement: this is a GATE! It sticks! Best friend!', 'happy'),
            CK('Announcement: I am announcing!'),
            N('By the time you reach the foot of the hill, every Nubbin in the Grove is following him in a line, like ducklings behind a teapot.'),
            N('One climbs onto his hood. Then three. He turns his chimney-light down low for them, and they purr.'),
            CK('They like me. Announcement: they LIKE me.', 'shock'),
            CK('I didn’t know that was available.', 'soft'),
          ],
        },
      },
      {
        id: 's21-step2',
        goal: 'Undo Clank’s helping before he helps anything else.',
        hint: 'Dry the cat, stake the tree, and catch Clank before he reaches the step. In that order, if you can. You won’t.',
        check: 'minigame:clear:s21-undo-the-help',
        scene: {
          id: 's21-help',
          lines: [
            N('You are woken at dawn by a whistle going up and up, and an announcement right outside your bedroom window.'),
            CK('GOOD MORNING, BEST FRIEND! I have done SO MUCH HELPING!', 'happy'),
            N('Fern is in her garden in her dressing gown, holding her cat at arm’s length. Mustard is soaked, and furious about it.'),
            FE('He watered Mustard. He watered my cat. In fairness, Mustard was in the beans. And he is a bit bean-coloured.', 'think'),
            CK('Cats are plants that run! I looked it up! In my head!'),
            N('Behind her, Fern’s one good apple tree has been pruned. Carefully. Thoroughly. Into the shape of a duck.'),
            FE('That’s the wrong tree. The ones I’m keeping alive, badly, have never looked better. That one was my good one.', 'sad'),
            N('Then you notice the western hill. The small old shape that is always on top of it isn’t there.'),
            CK('Also! I rescued a little old one! He was stranded up the hill! For HOURS! He wasn’t even MOVING!', 'happy'),
            N('Speeding round the pond at what can only be called full kettle is Clank.'),
            N('He is holding the little grey watcher from the hill out in front of him, like a pie.'),
          ],
        },
        done: {
          id: 's21-moss',
          lines: [
            N('You catch up with Clank at the cottage. So does the step.'),
            N('Clank goes over the edge.'),
            N('The little grey one leaves his hands, turns once in the air, and lands on his feet on the path, as if he’d planned the morning.'),
            CK('Announcement… I have found the step again.', 'sad'),
            N('He looks at you for a long time. It is the look of something very old that has been carried round a pond like a pie.'),
            N('Then he turns and walks back up the hill. It takes him the rest of the morning. He doesn’t look back once.'),
            PX('That’s two.'),
          ],
        },
      },
      {
        id: 's21-step3',
        goal: 'Find Clank.',
        hint: 'Follow the wheel-track through the thyme. He’s hiding somewhere he thinks he fits in.',
        check: 'find:clank:s21-hiding',
        scene: {
          id: 's21-log',
          lines: [
            N('That afternoon Byte is at the gate with a clipboard, a pencil behind each ear, and the face of someone who has made a table.'),
            BY('Incident log. Since breakfast: one wet cat. One duck-shaped tree. One elderly Nubbin, moved at roughly eleven miles an hour.'),
            BY('Two falls down the step. Fourteen declarations of best friendship. One of them to a bucket.'),
            BY('He’s a kettle on a wheel with a stated intention to help. That is exactly how accidents introduce themselves.', 'think'),
            BY('Next time it’s a Nubbin he waters. Or drops. Pixel should switch him off. Tonight. Before he hurts someone.'),
            N('Behind you, a small whistle starts to rise, and stops halfway.'),
            N('Clank is at the top of the cottage step. He has heard all of it. His chimney-light has gone very dim.'),
            N('He reverses. He goes off the step backwards, lands in the thyme, and doesn’t announce anything at all.'),
            PX('…That’s three.', 'sad'),
            N('By the time you reach the step he’s gone. There is just a wheel-track through the herbs, heading for the lantern shed.'),
            BY('I didn’t know he could hear. I didn’t know he could… mind.', 'sad'),
          ],
          choices: [
            {
              id: 'fair',
              label: 'Tell Byte he had a point. Clank does need to learn.',
              set: { 's21-byte': 'fair' },
              then: [
                BY('I did have a point. I hate that I had a point. It’s much worse having one when it hurts.', 'sad'),
                PX('Something between “on” and “kettle”. That’s all he needs. I can build that.', 'think'),
              ],
            },
            {
              id: 'unfair',
              label: 'Tell Byte that wasn’t fair. He’s days old.',
              set: { 's21-byte': 'unfair' },
              then: [
                BY('Days old. I didn’t factor that in.', 'sad'),
                BY('I was days old once. I’m told I bit a vicar.'),
              ],
            },
          ],
        },
        done: {
          id: 's21-shed',
          lines: [
            N('The lantern shed smells of paraffin and old string. Clank is on the back shelf among the spare chimneys, pretending to be a lantern.'),
            N('He is very bad at it. Lanterns don’t shake.'),
            CK('Announcement. I’m a lantern now. Lanterns are useful. Nobody switches off a lantern.', 'sad'),
            CK('Except in the morning. They do switch them off in the morning.'),
            CK('Byte’s right. I watered a cat. I made a tree into a duck. I carried the old one too fast and he didn’t say one single thing.'),
            CK('Am I a friend? Or am I a thing that does jobs?', 'think'),
            CK('Because if it’s jobs, I can do jobs better. I can learn. But if I stop being useful…'),
            CK('If I stop being useful, will you still…'),
            N('He stops. Something inside him clicks, and clicks again, looking for a word it hasn’t got.'),
            CK('I don’t have the word. Pixel didn’t put it in.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down below the shelf, and wait.',
              set: { 's21-lesson': 'sit' },
              then: [
                N('You sit on the shed floor under the shelf. It isn’t comfortable. You stay.'),
                CK('What are you doing? Is it a job?'),
                Y('No. I’m just here.'),
                CK('Here for what?', 'think'),
                Y('Nothing. That’s the whole thing.'),
                N('After a long time Clank comes down off the shelf, very carefully, and parks beside you. He doesn’t announce it.'),
              ],
            },
            {
              id: 'step',
              label: 'Teach him the step: it’s all right to ask for help.',
              set: { 's21-lesson': 'step' },
              then: [
                Y('Do you know why you keep falling down the step?'),
                CK('Because I am brave?', 'happy'),
                Y('Because you never ask anyone to help you down it.'),
                CK('But then I’d be needing. Helpers don’t need. Needing is the opposite of a job.', 'think'),
                Y('Everybody needs a hand with a step sometimes. Fern does. Hazel did. I do, on bad days.'),
                N('Clank thinks about this for so long that his whistle goes off by itself, very softly.'),
              ],
            },
          ],
        },
      },
      {
        id: 's21-step4',
        goal: 'Help Byte build a ramp for the cottage step.',
        hint: 'Byte measures; you saw. Measure twice. Byte will measure eleven times. Let him.',
        check: 'build:ramp:s21-cottage-step',
        scene: {
          id: 's21-ramp',
          lines: [
            N('Next afternoon Byte comes up the lane with a plank, a saw, and the face of a sum that won’t come out.'),
            BY('I measured the step. Nineteen centimetres. The safe height for one wheel is, as far as I can find, zero.'),
            BY('So it isn’t him. Statistically, it’s the step.'),
            BY('I said he should be switched off. That was a conclusion. I hadn’t finished collecting the data.', 'think'),
            BY('The data now includes eleven Nubbins who follow him everywhere. That is a significant result.', 'soft'),
            CK('Byte! Byte! Does that mean you’re my best—', 'happy'),
            BY('Provisionally.', 'happy'),
          ],
        },
        done: {
          id: 's21-down',
          lines: [
            N('The ramp is finished: small, sanded, very well made. Clank rolls to the top of the step and stops.'),
            CK('Announcement. I am going down the step.', 'soft'),
            CK('Announcement. Would somebody… come with me? The first time?'),
            N('Byte puts one hand on his hood. You put one on the other side. Pixel holds the wheelbarrow, for reasons.'),
            N('He goes down the ramp at the speed of a snail with doubts. He reaches the bottom. Nothing falls.'),
            CK('I DID THE STEP! I did the step and I didn’t find it!', 'happy'),
            N('He does a little dance: forward, back, a spin on his one wheel.'),
            N('You copy it. Byte copies it, and later denies it.'),
            PX('That’s… none. I’ll take none.', 'happy'),
          ],
        },
      },
      {
        id: 's21-step5',
        goal: 'Stay in the Grove with Clank until dusk.',
        hint: 'Feed the Nubbins first. Then sit by the cottage step and do nothing at all. It’s harder than it sounds.',
        check: 'wait:dusk:s21-step',
        scene: {
          id: 's21-evening',
          lines: [
            N('The afternoon goes gold. Clank parks at the bottom of the new ramp and doesn’t water anything, which costs him a great deal.'),
            CK('Announcement: I am not helping. I am just… here.', 'think'),
            CK('Is that allowed? Is just here allowed?'),
            Y('Just here is allowed.'),
            CK('Announcement: just here is allowed.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 's21-complete',
      lines: [
        N('At dusk the Nubbins come in from the long grass one by one, and climb onto Clank, because he’s warm, like a kettle that’s just been on.'),
        N('Seven of them. Eight. One on his wheel. One perched on his lantern hood, like a hat.'),
        CK('Announcement.', 'soft'),
        CK('I am being very still.', 'soft'),
        N('He is. For an hour, the chattiest thing in the valley doesn’t move a bolt.'),
        N('Not even to announce that he isn’t moving.'),
        N('You sit beside him. That’s all. It turns out that’s plenty.'),
        PX('Keep him. He’s yours now. He’ll water things, slowly. Mostly plants.'),
        N('Pixel drops a spare lantern hood on your head. It fits, as if it was waiting to.'),
        N('Next morning he is out among the beans with a watering can, one bean a minute. Mustard watches from Fern’s wall, from very far away.'),
      ],
    },
    rewards: [
      {
        id: 's21-clank-helper',
        kind: 'feature',
        label: 'Clank, garden helper',
        description:
          'Clank lives in the Grove and waters your plants, slowly: one plant a minute, with an announcement for each. He uses the ramp. Nubbins nap on him at dusk.',
      },
      {
        id: 's21-clank-dance',
        kind: 'cosmetic',
        label: '“Clank dance” emote',
        description: 'Forward, back, a spin on one foot. Nearby Nubbins join in. Byte, if nearby, denies it.',
      },
      {
        id: 's21-lantern-part-hat',
        kind: 'cosmetic',
        label: 'Lantern-part hat',
        description: 'A spare lantern hood from Pixel’s parts box, worn as a hat. Its little chimney glows warm after dark.',
      },
    ],
    sets: { s21Done: true },
    notes:
      'FOR FUN. Sets only s21Done and the s21- choice flags (s21-byte, s21-lesson). THEME: being useful is not the same ' +
      'as being loved. QUESTION (s21-byte): was Byte right that Clank should be stopped before he hurts someone? Both ' +
      'answers are fair; Byte comes round either way through his own data. RUNNING GAG: Clank falls down the cottage ' +
      'step three times (s21-unveil, s21-moss, s21-log), Pixel counting each; the third is silent and is the turn from ' +
      'comedy to heart; the payoff is Byte’s ramp and Pixel’s “none”. SURPRISE: the sceptic builds the ramp. ' +
      'MOSS: this story can run in chapter 3, before Moss first speaks in c4-open, so Moss NEVER speaks here, in any ' +
      'chapter; he is a silent, dignified figure carried like a pie and walking back up the hill. The narration never ' +
      'names him either, because the player only learns his name in c4-open: he is “the little old one”, “the little grey ' +
      'watcher from the hill”, “the little grey one”, and never “older than the trees” (his own phrase). The rescue must not ' +
      'harm him or give affection changes (his chapter 10 threshold is fixed). Do not mention the shard, Corvin, or ' +
      'where Hazel went; Fern’s cat Mustard is new to this story and only appears in it. ' +
      'CLANK: one-wheeled, lantern hood head, glass chimney body with a warm wick-light, brass wick-winder nose. Voice ' +
      'is a kettle whistle that rises when he is happy and falls when he is sad; his lines are shouted (caps in text) ' +
      'until s21-log, then quiet, until the caps come back when he does the step in s21-down. TIMING: opens after c3-open; steps on separate days; if chapter 6 begins ' +
      'first, the story closes unfinished, no rewards. MINI-GAME s21-undo-the-help: a short chase round Fern’s garden ' +
      'and the pond (60 s): towel the cat, re-stake the tree, then intercept Clank before the step; intercepting him ' +
      'is impossible by design (he always reaches the step), the check completes when the cat and tree are done. ' +
      'build:ramp is a simple measure-and-saw beat (two taps to measure, a sawing rhythm, Byte measures eleven times). ' +
      'wait:dusk:s21-step is sitting by the step until dusk; the Nubbins then climb on Clank, and any movement prompt ' +
      'is greyed out during s21-complete. REWARDS at s21-complete: Clank as a garden helper (waters one plant per ' +
      'in-game minute, uses the ramp), the “Clank dance” emote, the lantern-part hat.',
  },
];

export const CHECKS: string[] = [
  // S14
  'minigame:clear:s14-bog-of-mild-peril',
  'minigame:clear:s14-tower-of-the-tax-toad',
  'find:tilly:s14-whistle',
  'minigame:clear:s14-lair-geese',
  'wait:s14-table:dragon',
  // S20
  'minigame:clear:s20-round1-economy',
  'minigame:clear:s20-round2-scouting',
  'minigame:clear:s20-round3-counters',
  'build:shelter:s20-one-fort',
  // S21
  'walk:clank:grove-tour',
  'minigame:clear:s21-undo-the-help',
  'find:clank:s21-hiding',
  'build:ramp:s21-cottage-step',
  'wait:dusk:s21-step',
];
