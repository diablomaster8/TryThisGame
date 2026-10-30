/**
 * Fun quests Q31–Q45: the Puddle’s Pub gang (adults only).
 *
 * Based on It’s Always Sunny in Philadelphia. Crude, boozy, insulting and gross on purpose,
 * as the owner asked. Never in the Learning Grove (audience 'adult'), so no childLines.
 * Left out: real song lyrics (Q37 uses the original song from the brief), and anything about
 * race, sexual content or coercion, slurs, harm to children, or cruelty to animals.
 * Nubbins are never hurt.
 *
 * Approved quotes (Original quotes table, rows 31–45), each used at most twice:
 *   "Kitten Mittens!" · "Wildcard, bitches!" (Q31)
 *   "For bodyguards, by bodyguards." · "Caw! Caw!" (Q33)
 *   "Green Man!" (Q34)
 *   "Chardee MacDennis: the game of games." · "I am a golden god!" (Q35)
 *   "Rum ham!" · "Can I offer you a nice egg in this trying time?" (Q36)
 *   "Bird law in this country is not governed by reason." (Q38)
 *   "Trash Man!" (Q41)
 *   "Pepe Silvia!" · "There is no Carol in HR!" (Q42)
 * Every other line is original.
 *
 * Corky leads ten quests: Q31, Q32, Q33, Q34, Q36, Q37, Q38, Q42, Q44, Q45.
 *
 * Rating: audience 'adult' (18+). Main game only, behind Settings › Content › “Mature content”
 * set to 18+, which is off by default. Q31 carries the gate; Q32–Q45 require Q31. Q36 and Q38
 * also require Q32 (the goose). Never during Chapters 9–11 (`WHEN_SUFFIX` on every trigger).
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const SHOW = 'It’s Always Sunny in Philadelphia';

const CORKY: Speaker = {
  id: 'corky',
  name: 'Corky',
  kind: 'keeper',
  basedOn: `Charlie Kelly (Charlie Day), ${SHOW}`,
};
const ROOK: Speaker = { id: 'rook', name: 'Rook', kind: 'keeper', basedOn: `Mac, ${SHOW}` };
const DABNEY: Speaker = {
  id: 'dabney',
  name: 'Dabney',
  kind: 'keeper',
  basedOn: `Dennis Reynolds, ${SHOW}`,
};
const MAGS: Speaker = {
  id: 'mags',
  name: 'Mags',
  kind: 'keeper',
  basedOn: `Dee Reynolds, ${SHOW}`,
};
const FITZ: Speaker = {
  id: 'fitz',
  name: 'Fitz',
  kind: 'keeper',
  basedOn: `Frank Reynolds, ${SHOW}`,
};

/** Fun quests never trigger during Chapters 9–11 (the Long Night chapters). */
const WHEN_SUFFIX = ' Never during Chapters 9–11.';

const PUB = 'Puddle’s Pub, by the stream';
const AFTER_Q31 = ['Q31'];

export const QUESTS_SUNNY: Quest[] = [
  // ------------------------------------------------------------------ Q31
  {
    id: 'q31',
    code: 'Q31',
    title: 'Kitten Mittens',
    source: `${SHOW}: Charlie’s Kitten Mittens advert`,
    audience: 'adult',
    trigger: {
      where: PUB,
      when: 'Any evening once the pub is open, and only if Settings › Content › “Mature content” is set to 18+ (off by default); Corky stamps around the bar and waves you in.' + WHEN_SUFFIX,
    },
    speakers: [CORKY, DABNEY, ROOK, MAGS, FITZ],
    steps: [
      {
        id: 'q31-fluff',
        goal: 'Collect 4 dandelion fluff and bring it to Corky at Puddle’s Pub.',
        hint: 'Corky says the fluff is “around”. Tap Do it in the Journal and keep the pile steady; fluff has no sense of balance.',
        check: 'deliver:dandelion-fluff:4',
        scene: {
          id: 'q31-intro',
          lines: [
            { who: 'narrator', text: 'Puddle’s Pub sags over the stream. Inside, something is clomping. Loudly. On purpose.' },
            { who: 'corky', text: 'You hear that? You hear that clomping? That’s a Nubbin. Walking. Like an animal.', mood: 'shock' },
            { who: 'narrator', text: 'It is Corky, stamping round the bar in his boots to demonstrate. Three Nubbins asleep by the fire wake up and glare.' },
            { who: 'corky', text: 'Every night. Clomp, clomp, clomp. Nobody in this whole Grove has slept since I got here.', mood: 'angry' },
            { who: 'dabney', text: 'Corky, you sleep twenty hours a day. In a cupboard.', mood: 'think' },
            { who: 'corky', text: 'Not any more, Dabney. Because I invented these.', mood: 'happy' },
            { who: 'narrator', text: 'He holds up four tiny mittens. They are lumpy, mismatched and stitched with what might be fishing line.' },
            { who: 'corky', text: 'Mittens. For their feet. Pat, pat, pat instead of clomp. I’m shooting an advert tonight and I’m gonna be rich.', mood: 'happy' },
            { who: 'rook', text: 'And I’m doing the action. Every good advert needs a guy who can kick a candle out without touching it.' },
            { who: 'dabney', text: 'Nobody has ever needed that.' },
            { who: 'fitz', text: 'Hold on. Rich? How rich? Who owns the mittens? Has anybody written anything down?', mood: 'think' },
            { who: 'corky', text: 'Nobody writes stuff down here, Fitz. That’s our whole system.' },
            { who: 'corky', text: 'I need fluff. Soft stuff, for the padding. Get me some dandelion fluff and we roll camera.' },
          ],
        },
        done: {
          id: 'q31-fluff-done',
          lines: [
            { who: 'corky', text: 'Perfect. Soft. Kind of damp. Where’s it been? Doesn’t matter.', mood: 'happy' },
            { who: 'narrator', text: 'He stuffs the fluff into the mittens with a fork. Some of it goes in his mouth. He does not notice.' },
            { who: 'mags', text: 'I’m in the advert too, right? I trained in commercial work. I can cry on cue.' },
            { who: 'rook', text: 'Nobody cries in a mitten advert, Mags. Sit down. You look like a pelican waiting for chips.' },
          ],
        },
      },
      {
        id: 'q31-shoot',
        goal: 'Film Corky’s advert in Photo mode while the mittened Nubbin pads across the set.',
        hint: 'Wait until Corky points and the Nubbin is on the bedsheet, then tap Do it in the Journal. That is the shot.',
        check: 'photo:scene:nubbin-mittens-advert',
        scene: {
          id: 'q31-advert',
          lines: [
            { who: 'narrator', text: 'The pub is the set. A bedsheet is the backdrop. Fitz holds a lantern over his head and is already complaining.' },
            { who: 'fitz', text: 'Hurry it up. I’ve got a ham in the oven and it’s been in there since Tuesday.' },
            { who: 'corky', text: 'You hold the Photo thing. When I point, you shoot. Don’t shoot when I don’t point. Unless it’s good.' },
            { who: 'narrator', text: 'A Nubbin is gently fitted with four mittens. It looks down at its feet with deep suspicion.' },
            { who: 'corky', text: 'Are you tired of your Nubbins clomping around? Is your whole home just a clomping mess?', mood: 'happy' },
            { who: 'corky', text: 'Is it stomp, stomp, stomp, all day, all night, while you’re trying to live your life? While you’re trying to EAT?', mood: 'angry' },
            { who: 'rook', text: 'Hi-YAH!' },
            { who: 'narrator', text: 'Rook spin-kicks into frame, misses the candle by a foot and lands on the bar.' },
            { who: 'corky', text: 'Kitten Mittens!', mood: 'shock' },
            { who: 'dabney', text: 'They’re for Nubbins, Corky. The box says Nubbin Mittens. You painted the box.' },
            { who: 'corky', text: 'I can’t read the box, Dabney!', mood: 'angry' },
          ],
          choices: [
            {
              id: 'q31-cut-rook',
              label: 'Cut Rook out of the shot.',
              set: { 'q31-rook': 'cut' },
              then: [
                { who: 'rook', text: 'You can’t cut the action. The action IS the advert.', mood: 'sad' },
                { who: 'corky', text: 'The mittens are the advert, man!' },
              ],
            },
            {
              id: 'q31-keep-rook',
              label: 'Keep Rook in. Get his best side.',
              set: { 'q31-rook': 'kept' },
              then: [
                { who: 'rook', text: 'Finally. A director who gets it.', mood: 'happy' },
                { who: 'narrator', text: 'He poses. There is no best side. You shoot anyway.' },
              ],
            },
            {
              id: 'q31-wildcard',
              label: 'Tell Corky to go off-script.',
              set: { 'q31-rook': 'wildcard' },
              then: [
                { who: 'corky', text: 'Wildcard, bitches!', mood: 'happy' },
                { who: 'narrator', text: 'He wraps himself in the bedsheet and runs face-first into the backdrop pole.' },
              ],
            },
          ],
        },
        done: {
          id: 'q31-shoot-done',
          lines: [
            { who: 'narrator', text: 'The set comes down. All of it. Corky is somewhere under the bedsheet, still pitching.' },
            { who: 'corky', text: 'Clomp no more! Call now! We don’t have a number! Come to the pub!' },
            { who: 'narrator', text: 'The mittened Nubbin pads past two sleeping friends. Neither of them stirs.' },
            { who: 'dabney', text: 'Wait. That worked. I’ll handle marketing. Forty percent, and a better-looking face on the box. Mine.', mood: 'think' },
            { who: 'fitz', text: 'I’ll put up the money. Fifty-fifty. Sixty-forty. Seventy-thirty, me.' },
            { who: 'corky', text: 'Deal. I don’t know what any of those mean.', mood: 'happy' },
            { who: 'narrator', text: 'Fitz spits in his palm and holds it out. Corky spits in his and reaches across. Then both of them look at you.' },
          ],
          choices: [
            {
              id: 'q31-warn',
              label: 'Tell Corky what seventy-thirty means.',
              set: { 'q31-deal': 'warned' },
              then: [
                { who: 'corky', text: 'So he gets seventy mittens and I get… thirty mittens?', mood: 'think' },
                { who: 'corky', text: 'Thirty’s loads of mittens. I’ve never had thirty of anything. Shake, Fitz.', mood: 'happy' },
                { who: 'fitz', text: 'Stay out of my business, Keeper. Kid was happy till you did maths at him.', mood: 'angry' },
              ],
            },
            {
              id: 'q31-stay-out',
              label: 'Stay out of it. His invention, his deal.',
              set: { 'q31-deal': 'stayed-out' },
              then: [
                { who: 'narrator', text: 'They shake. The noise is wet. Dabney writes “40%” on a beer mat and slides it into his own pocket.' },
                { who: 'fitz', text: 'Pleasure. Now beat it, I’ve got a ham to check on. It’s Thursday.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q31-complete',
      lines: [
        { who: 'dabney', text: 'Huh. It actually works. That’s upsetting.' },
        { who: 'corky', text: 'Of course it works. I’m a genius. I’m a genius who also does the bins.', mood: 'happy' },
        { who: 'narrator', text: 'Corky presses a pair of mittens into your hands. They smell faintly of the fork.' },
        { who: 'corky', text: 'Your Nubbins can walk past sleepy ones now and nobody wakes up. Kitten Mittens!', mood: 'happy' },
        { who: 'narrator', text: 'Nubbin Mittens: sleeping Nubbins no longer wake when others walk past. A pair of mittens joins your wardrobe.' },
      ],
    },
    rewards: [
      {
        id: 'q31-nubbin-mittens',
        kind: 'feature',
        label: 'Nubbin Mittens',
        description: 'Sleeping Nubbins never wake when other Nubbins walk past them.',
      },
      {
        id: 'q31-mittens',
        kind: 'cosmetic',
        label: 'Mittens',
        description: 'Lumpy, mismatched foot mittens a Nubbin can wear. Stitched with fishing line.',
      },
    ],
    notes:
      'Lead: Corky. Introduces the whole gang; Q32–Q45 require it. Content gate: Q31 offers itself only when Settings › Content › “Mature content” is set to 18+, which is off by default; Q32–Q45 inherit this gate through requires: [\'Q31\']. Running gag: the product is Nubbin Mittens, Corky only ever says the old name ' +
      '(approved quote, used twice). Step 2 needs a scripted Photo mode target on the pub bedsheet; the shot counts if the mittened Nubbin is in frame. ' +
      'Set collapse: bedsheet and pole fall, lantern swings; comedy crash SFX. Rook’s kick is a one-off pose animation. Mittens should mute footstep SFX. ' +
      'Corky signs either way. Payoffs: q31-deal comes back in Q45 (q45-practice-done-warned if you warned him); q31-rook comes back in Q39 (q31-rook-is-*).',
  },

  // ------------------------------------------------------------------ Q32
  {
    id: 'q32',
    code: 'Q32',
    title: 'Charlie Work',
    source: `${SHOW}: “Charlie Work”`,
    audience: 'adult',
    trigger: {
      where: PUB,
      when: 'A morning after Q31; a health inspection notice is nailed to the pub door.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [
      CORKY,
      DABNEY,
      MAGS,
      FITZ,
      { id: 'inspector', name: 'Inspector Plimsoll', kind: 'other' },
    ],
    steps: [
      {
        id: 'q32-cellar',
        goal: 'Hand Corky the right tool on every cue through the rat cellar and the pond drain.',
        hint: 'Watch Corky’s hand: open palm for the stick, a fist for the plunger, both hands for the bucket. Miss three and the take restarts.',
        check: 'minigame:tool-relay:cellar-drain',
        scene: {
          id: 'q32-intro',
          lines: [
            { who: 'narrator', text: 'A notice on the pub door: HEALTH INSPECTION, TODAY, NOON. Someone has drawn a skull on it. It may be official.' },
            { who: 'dabney', text: 'Right. Upstairs, we are busy. With a thing that is completely legal and involves forty crates of eggs.' },
            { who: 'mags', text: 'Don’t tell them about the eggs!', mood: 'shock' },
            { who: 'dabney', text: 'I just did, Mags. Keep up. You’re like a flamingo trying to do sums.' },
            { who: 'fitz', text: 'We bought every egg in the valley. By Friday there’s no eggs anywhere. Saturday, we’re the egg men.', mood: 'happy' },
            { who: 'dabney', text: 'Supply and demand. It isn’t a scheme if it’s economics.' },
            { who: 'narrator', text: 'Nobody asks who will clean. Everyone simply turns and looks at Corky.' },
            { who: 'corky', text: 'Okay. Okay. This is my time. You stick with me. You hand me stuff. We don’t stop.', mood: 'happy' },
            { who: 'corky', text: 'One go. Cellar, drain, bins, whatever’s in the back. If we stop, it all falls apart. Like a shark.' },
            { who: 'narrator', text: 'He grabs a stick wrapped in tape. He calls it the rat stick. He has never once hit a rat with it.' },
            { who: 'corky', text: 'Me and the rats have an understanding. I bang the pipes, they leave. They come back. It’s a cycle. It’s beautiful.', mood: 'soft' },
            { who: 'corky', text: 'Stick. Plunger. Bucket. When I say it, you hand it. Go.' },
          ],
          choices: [
            {
              id: 'q32-stick',
              label: 'Hand him the rat stick first.',
              set: { 'q32-first': 'stick' },
              then: [
                { who: 'corky', text: 'Yes! Instinct! You’ve done this before.', mood: 'happy' },
                { who: 'narrator', text: 'He bangs a pipe three times. Six rats stroll out in single file, looking bored.' },
              ],
            },
            {
              id: 'q32-plunger',
              label: 'Hand him the plunger first.',
              set: { 'q32-first': 'plunger' },
              then: [
                { who: 'corky', text: 'Plunger? In the cellar? Oh, you’re thinking ahead. I love it. I’m scared.', mood: 'shock' },
              ],
            },
          ],
        },
        done: {
          id: 'q32-cellar-done',
          lines: [
            { who: 'narrator', text: 'The drain gives with a sound like a cow sighing. Something black and ancient slides out. Corky catches it in the bucket.' },
            { who: 'corky', text: 'Pond hair! That’s good luck. That’s a whole wig.', mood: 'happy' },
            { who: 'narrator', text: 'Upstairs, through the floorboards, you hear Dabney say the word “eggs” with great confidence.' },
          ],
        },
      },
      {
        id: 'q32-bins',
        goal: 'Keep the take going: hand Corky his tools through the bins, then get the goose out of the back room.',
        hint: 'The goose only leaves through an open door with fruit outside it; hand Corky a pear right after the big gloves.',
        check: 'minigame:tool-relay:bins-goose',
        scene: {
          id: 'q32-goose',
          lines: [
            {
              who: 'inspector',
              text: 'Good morning. Inspector Plimsoll. I’ll be looking at everything, and writing everything down.',
            },
            {
              who: 'narrator',
              text: 'Corky walks past behind her with a bin on his shoulder, not breaking stride, and gives you a single nod.',
            },
            { who: 'corky', text: 'Bins next. Then there’s the goose.', mood: 'think' },
            { who: 'you', text: 'What goose?' },
            { who: 'corky', text: 'There’s always a goose. Nobody knows how it gets in. It’s been in the back room since spring. It hates me.' },
            { who: 'narrator', text: 'The back room door bulges slightly. Something on the other side hisses.' },
            { who: 'inspector', text: 'What is that noise?', mood: 'think' },
            { who: 'mags', text: 'Atmosphere! It’s an atmospheric pub. I’m a trained performer, I’d know.', mood: 'happy' },
            { who: 'fitz', text: 'Keep her upstairs. I need eleven more minutes with the eggs.' },
            { who: 'corky', text: 'Bin bag. Big gloves. Then we open the door and we do not look the goose in the eye.' },
            { who: 'inspector', text: 'You. You look like the only person here who has slept. What is happening upstairs?', mood: 'think' },
          ],
          choices: [
            {
              id: 'q32-cover',
              label: 'Cover for the gang: “Choir practice.”',
              set: { 'q32-inspector': 'covered' },
              then: [
                { who: 'inspector', text: 'A choir. That clucks.' },
                { who: 'narrator', text: 'Upstairs, on cue, Mags starts singing scales. It does not help. It may have made things worse.' },
              ],
            },
            {
              id: 'q32-truth',
              label: 'Tell her the truth about the eggs.',
              set: { 'q32-inspector': 'told' },
              then: [
                { who: 'inspector', text: 'Hoarding eggs isn’t a health matter. It’s just sad. I’ll make a note.' },
                { who: 'dabney', text: 'WHO TOLD HER? I can hear you writing!', mood: 'angry' },
              ],
            },
            {
              id: 'q32-point-corky',
              label: 'Point her at the man doing the actual work.',
              set: { 'q32-inspector': 'corky' },
              then: [
                { who: 'narrator', text: 'She turns. Corky is halfway inside a drain, humming, with a candle in his mouth.' },
                { who: 'inspector', text: 'Who is that man? How long has he been here?' },
                { who: 'corky', text: 'Nobody. Always. Keep walking, lady.' },
              ],
            },
          ],
        },
        done: {
          id: 'q32-bins-done',
          lines: [
            { who: 'narrator', text: 'The goose leaves on its own terms, with a pear, and bites Corky on the way out as a matter of principle.' },
            { who: 'corky', text: 'It bit me! It respects me now!', mood: 'happy' },
            { who: 'narrator', text: 'The goose waddles off down the stream bank, unharmed and deeply smug.' },
          ],
        },
      },
    ],
    complete: {
      id: 'q32-complete',
      lines: [
        { who: 'inspector', text: 'The cellar is… clean. The drain is clear. There is no goose. I don’t understand what I’m looking at.', mood: 'shock' },
        { who: 'inspector', text: 'Upstairs, however, smells strongly of eggs and lies. Pass. Just.' },
        { who: 'dabney', text: 'A pass! Because of our scheme.', mood: 'happy' },
        { who: 'corky', text: 'Because of me, Dabney. Because of me and the stick.' },
        { who: 'dabney', text: 'Nobody is ever going to remember the stick, Corky.' },
        { who: 'fitz', text: 'Bad news on the eggs. Turns out hens keep making more.', mood: 'sad' },
        { who: 'dabney', text: 'Every day. Every single day. Why did nobody tell us that?', mood: 'angry' },
        { who: 'narrator', text: 'Nobody thanks him. He doesn’t seem to expect it. He hands you his spare gloves, stiff and dark with something.' },
        { who: 'corky', text: 'You did good. Teach one of your little guys the long take. It’ll tidy up after itself.', mood: 'soft' },
        { who: 'narrator', text: 'Grove Work: one chosen Nubbin piles up fallen fruit and leaves on its own. Filthy work gloves join your wardrobe.' },
      ],
    },
    rewards: [
      {
        id: 'q32-grove-work',
        kind: 'feature',
        label: 'Grove Work',
        description: 'Choose one Nubbin to gather fallen fruit and leaves into tidy piles by itself.',
      },
      {
        id: 'q32-work-gloves',
        kind: 'cosmetic',
        label: 'Filthy Work Gloves',
        description: 'Corky’s spare gloves. Stiff, dark, and best not sniffed.',
      },
    ],
    notes:
      'Lead: Corky. Stage both relay steps as one continuous tracking shot following Corky (cellar → drain → bins → back room) with the ' +
      'gang’s egg scheme heard through the ceiling. No animal is ever hit: the rat stick only bangs pipes, rats stroll out unharmed, the goose leaves ' +
      'with a pear and bites Corky. SFX: pipe clangs, drain gurgle, goose hiss and honk, muffled upstairs chatter. ' +
      'q32-inspector (covered / told / corky): the pub passes either way. The question is loyalty to the gang versus honesty, and who notices the work. ' +
      'Payoffs: q32-first-is-* and q32-inspector-is-* play before the complete scene.',
  },

  // ------------------------------------------------------------------ Q33
  {
    id: 'q33',
    code: 'Q33',
    title: 'Fight Milk',
    source: `${SHOW}: Mac and Charlie’s Fight Milk`,
    audience: 'adult',
    trigger: {
      where: PUB,
      when: 'After Q31, once karate is unlocked; Rook and Corky are stirring a bucket behind the bar.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [CORKY, ROOK, DABNEY, MAGS, FITZ],
    steps: [
      {
        id: 'q33-taste',
        goal: 'Drink a carton of Fight Milk at the bar.',
        hint: 'Take the carton from the bar, then tap Do it in the Journal. Stay near a bench; you’ll want one.',
        check: 'use:item:fight-milk',
        scene: {
          id: 'q33-pitch',
          lines: [
            { who: 'narrator', text: 'Behind the bar, Rook and Corky are stirring a bucket with a cricket bat. The bucket is warm. Nobody has heated it.' },
            { who: 'rook', text: 'Behold. The world’s first boozy milk for bodyguards. Protein, dairy, vodka. Everything a body needs to guard.', mood: 'happy' },
            { who: 'corky', text: 'Milk, vodka and crow eggs. Raw. We got the eggs off the mill roof.' },
            { who: 'dabney', text: 'You stole eggs from crows.', mood: 'think' },
            { who: 'corky', text: 'Borrowed. The crows get them back, technically, once they’re inside us.' },
            { who: 'rook', text: 'For bodyguards, by bodyguards.', mood: 'happy' },
            { who: 'mags', text: 'You’re not bodyguards. You’ve never guarded a body.' },
            { who: 'rook', text: 'I guarded this bucket all night, Mags. Nobody got near it.', mood: 'angry' },
            { who: 'dabney', text: 'Nobody wanted to get near it.' },
            { who: 'corky', text: 'We need a tester. Someone brave. Strong stomach. No plans this afternoon.' },
            { who: 'narrator', text: 'Everyone looks at you. A carton slides across the bar. It is lumpy at the top.' },
          ],
          choices: [
            {
              id: 'q33-chug',
              label: 'Chug the lot.',
              set: { 'q33-drink': 'chug' },
              then: [
                { who: 'rook', text: 'That’s what I’m talking about! Feel the guard!', mood: 'happy' },
                { who: 'narrator', text: 'You feel something. It is not the guard.' },
              ],
            },
            {
              id: 'q33-sip',
              label: 'Take one careful sip.',
              set: { 'q33-drink': 'sip' },
              then: [
                { who: 'corky', text: 'A sip! Fancy! Like a fancy bodyguard!' },
                { who: 'narrator', text: 'One sip is plenty. Your left eye starts watering on its own.' },
              ],
            },
            {
              id: 'q33-sniff',
              label: 'Sniff it first.',
              set: { 'q33-drink': 'sniff' },
              then: [
                { who: 'narrator', text: 'It smells like a wet dog that has been to a wedding.' },
                { who: 'rook', text: 'The smell is part of the experience. Drink.' },
              ],
            },
          ],
        },
        done: {
          id: 'q33-taste-done',
          lines: [
            { who: 'narrator', text: 'The world tilts gently to the left and stays there. You have hiccups that taste of eggs.' },
            { who: 'corky', text: 'Look at that. Wobbly but strong. Strong but wobbly. That’s the brand.', mood: 'happy' },
            { who: 'rook', text: 'Write that down, Corky.' },
            { who: 'corky', text: 'I don’t write, man.' },
          ],
        },
      },
      {
        id: 'q33-gang',
        goal: 'Get Dabney, Mags and Fitz to each drink a carton of Fight Milk.',
        hint: 'Tap Do it in the Journal to hand round the cartons. Fitz says yes to anything; Dabney needs persuading.',
        check: 'give:fight-milk:gang:3',
        scene: {
          id: 'q33-testers',
          lines: [
            { who: 'rook', text: 'One tester is science. Four testers is a study. Get the others to drink it.' },
            { who: 'dabney', text: 'Absolutely not. My body is a temple and that is a bucket.' },
            { who: 'fitz', text: 'I’ll drink anything. I drank lamp oil once on a bet. Won forty shells, lost a week.', mood: 'happy' },
            { who: 'mags', text: 'If I drink it, do I get to be in the advert?' },
            { who: 'rook', text: 'There’s no advert.' },
            { who: 'mags', text: 'Then I want an advert.' },
            { who: 'narrator', text: 'Outside, on the mill roof, a row of crows has turned to face the pub. All of them. In silence.' },
            { who: 'corky', text: 'Caw! Caw! They know. They know what we did. Drink faster.', mood: 'shock' },
          ],
          choices: [
            {
              id: 'q33-flatter',
              label: 'Tell Dabney it’s good for his skin.',
              set: { 'q33-dabney': 'flattered' },
              then: [
                { who: 'dabney', text: 'Well. My skin does deserve the best.', mood: 'happy' },
                { who: 'narrator', text: 'It does not get the best.' },
              ],
            },
            {
              id: 'q33-dare',
              label: 'Bet Dabney he can’t keep it down.',
              set: { 'q33-dabney': 'dared' },
              then: [
                { who: 'dabney', text: 'I can keep anything down. Watch me.', mood: 'angry' },
                { who: 'narrator', text: 'You watch. You wish you hadn’t.' },
              ],
            },
          ],
        },
        done: {
          id: 'q33-sick',
          lines: [
            { who: 'narrator', text: 'Dabney turns a precise shade of green and admires it in a spoon. Mags is sick in her handbag, then sobs because it’s her good one.' },
            { who: 'narrator', text: 'Fitz is sick out of the window, onto the crows, who take it personally. Rook goes blue, then purple, and says he feels incredible.' },
            { who: 'narrator', text: 'A Nubbin wanders over, sniffs a spilled carton, gives you a look of open disappointment and walks away.' },
            { who: 'rook', text: 'Great data. Now the label. Keeper, you’ve got the steadiest hand. What do we say about the trial?', mood: 'happy' },
          ],
          choices: [
            {
              id: 'q33-label-honest',
              label: 'Write: “Side effects: everyone.”',
              set: { 'q33-label': 'honest' },
              then: [
                { who: 'rook', text: 'Bold. Very bodyguard. Bodyguards don’t hide stuff.' },
                { who: 'corky', text: 'People respect honest. People respect sick. We’re both!', mood: 'happy' },
              ],
            },
            {
              id: 'q33-label-spin',
              label: 'Write: “Tested on five brave adults.”',
              set: { 'q33-label': 'spin' },
              then: [
                { who: 'dabney', text: 'Technically true. I love it. I hate that I love it.', mood: 'think' },
                { who: 'mags', text: 'Put “and one actress”. I want a credit.' },
              ],
            },
            {
              id: 'q33-label-crows',
              label: 'Write: “Contains crow eggs.”',
              set: { 'q33-label': 'crows' },
              then: [
                { who: 'corky', text: 'No! Don’t write it down! Then the crows can read it!', mood: 'shock' },
                { who: 'narrator', text: 'On the mill roof, every crow leans forward at once.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q33-complete',
      lines: [
        { who: 'rook', text: 'Results are in. Everyone threw up. Except Corky. And me. I definitely didn’t.', mood: 'happy' },
        { who: 'corky', text: 'My stomach’s used to worse. I had a glue sandwich Thursday.', mood: 'happy' },
        { who: 'dabney', text: 'That is not the endorsement you think it is.' },
        { who: 'rook', text: 'We’re gonna sell a million of these. Starting with one. To you. Free.' },
        { who: 'narrator', text: 'A crow lands on the bar, takes a full carton in its beak, and flies off with it. Nobody stops it.' },
        { who: 'corky', text: 'They’re making their own now. We’ve started an arms race. With birds.', mood: 'shock' },
        { who: 'narrator', text: 'Rook hands you a carton, and a hat folded out of an empty one. It still drips a little.' },
        { who: 'narrator', text: 'Fight Milk: drink it before a karate bout for a big Power boost, and a Keeper who can’t walk straight. The carton hat joins your wardrobe.' },
      ],
    },
    rewards: [
      {
        id: 'q33-fight-milk',
        kind: 'item',
        label: 'Fight Milk',
        description: 'Single use. The Keeper drinks it before a karate bout: your fighter gets extra Power for that bout, and you wobble for a while afterwards.',
      },
      {
        id: 'q33-carton-hat',
        kind: 'cosmetic',
        label: 'Carton Hat',
        description: 'A Fight Milk carton folded into a hat. Damp.',
      },
    ],
    notes:
      'Lead: Corky (with Rook). Nubbins never drink Fight Milk: they sniff it and walk off; the item can only be used by the Keeper. ' +
      'Each tester gets a distinct visible sick animation (green Dabney, handbag Mags, window Fitz, colour-cycling Rook). Keeper wobble = short ' +
      'drunk-walk camera sway after drinking. Crows on the mill roof turn to face the pub in step 2 and caw once; they never attack anyone. ' +
      'q33-label sets the carton text on the reward item (honest / spin / crows). In the complete scene a crow steals one carton: running gag payoff.',
  },

  // ------------------------------------------------------------------ Q34
  {
    id: 'q34',
    code: 'Q34',
    title: 'Green Man',
    source: `${SHOW}: Charlie’s Green Man suit`,
    audience: 'adult',
    trigger: {
      where: 'The race track stands',
      when: 'Any race day after Q31; a man in a green bodysuit is drinking in the stands.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [
      CORKY,
      DABNEY,
      { id: 'announcer', name: 'The Announcer', kind: 'other' },
      { id: 'crowd', name: 'The Crowd', kind: 'other' },
    ],
    steps: [
      {
        id: 'q34-cheer',
        goal: 'Lead the crowd: cheer five times during the race.',
        hint: 'Tap Cheer in the stands as the runners pass; the louder the stands, the faster the runners.',
        check: 'race:cheer:5',
        scene: {
          id: 'q34-stands',
          lines: [
            { who: 'narrator', text: 'The race stands are half full. In the middle sits Corky, in skin-tight green spandex from head to toe, face and all.' },
            { who: 'corky', text: 'Green Man!', mood: 'happy' },
            { who: 'dabney', text: 'He’s been like this since breakfast. He won’t take it off. I don’t think he can take it off.' },
            { who: 'corky', text: 'It’s a lifestyle, Dabney. In the suit, I’m free. I can’t see much, but I’m free.' },
            { who: 'narrator', text: 'He is drinking beer through the suit. The fabric is doing most of the drinking.' },
            { who: 'dabney', text: 'I’m five beers in and scoring the runners. That one’s a three. That one’s a cry for help.', mood: 'happy' },
            { who: 'announcer', text: 'Runners to the line, please. And could the green gentleman sit down.' },
            { who: 'corky', text: 'The green gentleman will NOT sit down!', mood: 'angry' },
            { who: 'dabney', text: 'It’s dead in here. Get them cheering before he does something.' },
          ],
          choices: [
            {
              id: 'q34-chant-runners',
              label: 'Start a chant for the runners.',
              set: { 'q34-cheer': 'runners' },
              then: [
                { who: 'narrator', text: 'You clap a slow beat. One by one, the stands join in. Corky claps on every other beat, on purpose.' },
              ],
            },
            {
              id: 'q34-chant-green',
              label: 'Start a chant for the man in green.',
              set: { 'q34-cheer': 'green' },
              then: [
                { who: 'corky', text: 'Yes! Yes! Me! Do me!', mood: 'happy' },
                { who: 'dabney', text: 'You are feeding it. Why would you feed it?' },
              ],
            },
          ],
        },
        done: {
          id: 'q34-climb',
          lines: [
            { who: 'narrator', text: 'The crowd roars. Corky takes it personally. He climbs onto the railing.' },
            { who: 'dabney', text: 'No. Corky. No.', mood: 'shock' },
            { who: 'narrator', text: 'He drops onto the track and sprints across it, arms out, the suit still very much on.' },
          ],
        },
      },
      {
        id: 'q34-haul',
        goal: 'Haul Corky off the race track before he ruins the race.',
        hint: 'Corky zigzags; cut him off at the bends and grab the suit. Leave the Nubbin who follows him, it comes back by itself.',
        check: 'minigame:catch:green-suit',
        scene: {
          id: 'q34-track',
          lines: [
            { who: 'announcer', text: 'There is a green man on the course. I repeat, a green man.', mood: 'shock' },
            { who: 'narrator', text: 'The racing Nubbins stop and watch him go past. One of them trots after him, delighted.' },
            { who: 'corky', text: 'I’m the fastest thing out here! Nobody can catch the— oh no. A hill.', mood: 'happy' },
            { who: 'narrator', text: 'He falls over the first hurdle, gets up, falls over the second, and lies down on the third.' },
            { who: 'dabney', text: 'Go and get him. I’m not touching that suit. It’s been on him for nine hours.' },
            { who: 'announcer', text: 'We will restart when the… participant… is removed.' },
            { who: 'narrator', text: 'The stands are on their feet for the first time all season. At the start line, the runners’ Keepers are not.' },
          ],
          choices: [
            {
              id: 'q34-drag',
              label: 'Drag him off now. It’s the runners’ race.',
              set: { 'q34-lap': 'dragged' },
              then: [
                { who: 'narrator', text: 'At the start line, a Keeper who has trained all spring for this race mouths “thank you”.' },
                { who: 'corky', text: 'Traitor! Green traitor! You’re supposed to be on the side of the suit!', mood: 'angry' },
              ],
            },
            {
              id: 'q34-lap',
              label: 'Let him finish one lap. Listen to that crowd.',
              set: { 'q34-lap': 'lap' },
              then: [
                { who: 'narrator', text: 'Corky runs a full lap, arms out, to the loudest noise the stands have made all year. The runners wait, stretching.' },
                { who: 'dabney', text: 'You gave him a lap. Now he’s going to want a parade.' },
              ],
            },
          ],
        },
        done: {
          id: 'q34-haul-done',
          lines: [
            { who: 'narrator', text: 'You drag him off by one green ankle. He waves to the crowd the whole way.' },
            { who: 'corky', text: 'They love me. Do you hear that? That’s love.', mood: 'happy' },
          ],
        },
      },
    ],
    complete: {
      id: 'q34-complete',
      lines: [
        { who: 'narrator', text: 'The race restarts. Every time a runner passes, people at the back shout for the man in green.' },
        { who: 'announcer', text: 'And the winner is… well. The crowd seems to have its own favourite.' },
        { who: 'crowd', text: 'Green Man!', mood: 'happy' },
        { who: 'dabney', text: 'Oh, great. Now he has fans.' },
        { who: 'corky', text: 'Here. Spare suit. I had two made. One for days, one for special days.', mood: 'happy' },
        { who: 'narrator', text: 'A green bodysuit joins your wardrobe. From now on, every race has a cheering crowd in the stands.' },
      ],
    },
    rewards: [
      {
        id: 'q34-green-suit',
        kind: 'cosmetic',
        label: 'Green Bodysuit',
        description: 'Head-to-toe green spandex, face included. Drinking through it is possible but wet.',
      },
      {
        id: 'q34-crowd',
        kind: 'feature',
        label: 'Cheering Crowd',
        description: 'Every race now has a crowd in the stands that cheers your runners on.',
      },
    ],
    notes:
      'Lead: Corky. Corky streaks with the suit fully on: no nudity of any kind. He is drunk in the stands with Dabney. The racing Nubbin that follows ' +
      'him is never at risk; the catch minigame pauses the race. Art: green bodysuit on Corky (featureless face), wet patch at the mouth. ' +
      'SFX: crowd swell on each cheer, announcer PA crackle. q34-lap (dragged / lap): “lap” plays one scripted lap of Corky before the catch minigame starts.',
  },

  // ------------------------------------------------------------------ Q35
  {
    id: 'q35',
    code: 'Q35',
    title: 'Chardee MacDennis',
    source: `${SHOW}: “Chardee MacDennis: The Game of Games”`,
    audience: 'adult',
    trigger: {
      where: PUB,
      when: 'Any night after Q31, after closing; the board is laid out on the bar.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [DABNEY, MAGS, CORKY, ROOK],
    steps: [
      {
        id: 'q35-mind',
        goal: 'Win the Mind level against Dabney and Mags.',
        hint: 'The insult cards aren’t really questions: answer fast and with confidence. Hesitate and your team drinks.',
        check: 'minigame:board-game:mind',
        scene: {
          id: 'q35-rules',
          lines: [
            { who: 'narrator', text: 'The pub is closed. A board game the size of a door lies on the bar, stained with every drink known to the Grove.' },
            { who: 'dabney', text: 'Chardee MacDennis: the game of games.', mood: 'happy' },
            { who: 'corky', text: 'Nobody knows what the name means. It was on the box. I tried to read the box once.' },
            { who: 'mags', text: 'Dabney and I are the champions. Undefeated. Twice. Ever.' },
            { who: 'dabney', text: 'Three levels. Mind, Body, Spirit. Lose a level, you drink. Lose the game, you drink more and apologise.' },
            { who: 'rook', text: 'Me, Corky and the Keeper. Team Brute Force. We’ve been practising.' },
            { who: 'dabney', text: 'You’ve been practising saying “Team Brute Force”.' },
            { who: 'narrator', text: 'Level one is Mind. The cards are mostly insults phrased as questions.' },
            { who: 'mags', text: 'Rook. True or false: you look like a sad potato in a karate belt.', mood: 'happy' },
            { who: 'rook', text: 'False! It’s a black belt. A potato couldn’t get a black belt.', mood: 'angry' },
            { who: 'dabney', text: 'That’s a true. Drink. Keeper, your card: name the biggest disappointment in this room.' },
          ],
          choices: [
            {
              id: 'q35-point-mags',
              label: 'Point at Mags.',
              set: { 'q35-answer': 'mags' },
              then: [
                { who: 'mags', text: 'You absolute stork!', mood: 'angry' },
                { who: 'dabney', text: 'Correct. Point to Brute Force.', mood: 'happy' },
              ],
            },
            {
              id: 'q35-point-dabney',
              label: 'Point at Dabney.',
              set: { 'q35-answer': 'dabney' },
              then: [
                { who: 'dabney', text: 'Wrong. The answer is never me. That’s in the rules. I wrote the rules.', mood: 'angry' },
              ],
            },
            {
              id: 'q35-point-board',
              label: 'Point at the board.',
              set: { 'q35-answer': 'board' },
              then: [
                { who: 'corky', text: 'Ha! The board! Yeah! Hey, wait. That’s our board.', mood: 'happy' },
              ],
            },
          ],
        },
        done: {
          id: 'q35-mind-done',
          lines: [
            { who: 'dabney', text: 'Fine. Lucky. Mind was always our weakest level, because we’re too clever for it.' },
            { who: 'corky', text: 'We won a level! I don’t know which one!', mood: 'happy' },
          ],
        },
      },
      {
        id: 'q35-body',
        goal: 'Survive the Body level: do your dare and win the arm-wrestle against Mags.',
        hint: 'Tap in time with the bar to arm-wrestle; Mags tires after ten seconds.',
        check: 'minigame:board-game:body',
        scene: {
          id: 'q35-dares',
          lines: [
            { who: 'narrator', text: 'Level two is Body. The cards are dares, and the dares are bad.' },
            { who: 'mags', text: 'Rook. Eat a spoonful of the stuff at the bottom of the pickled egg jar.' },
            { who: 'rook', text: 'Easy. Brute Force.' },
            { who: 'narrator', text: 'He does. He is very quiet for some time afterwards.' },
            { who: 'dabney', text: 'Corky. Lick the bar. The whole length.' },
            { who: 'corky', text: 'I do that anyway.', mood: 'happy' },
            { who: 'narrator', text: 'He does it with real joy. A coin comes up stuck to his tongue. He keeps it.' },
            { who: 'mags', text: 'Dabney. Your dare: say one nice thing about me.' },
            { who: 'narrator', text: 'Dabney opens his mouth. Closes it. Thinks. Takes the drink without a word.' },
            { who: 'dabney', text: 'And the Keeper. Arm-wrestle Mags. Loser drinks from the drip tray.' },
            { who: 'mags', text: 'I’ve got arms like a heron. Long. Strong. Terrifying.', mood: 'happy' },
            { who: 'dabney', text: 'You do have arms like a heron, Mags. That isn’t the compliment you think it is.' },
          ],
        },
        done: {
          id: 'q35-body-done',
          lines: [
            { who: 'narrator', text: 'Mags goes down. Dabney, unasked, stands on his chair and drinks the whole drip tray to prove a point nobody made.' },
            { who: 'dabney', text: 'I am a golden god!', mood: 'happy' },
            { who: 'narrator', text: 'He sits down very, very slowly.' },
          ],
        },
      },
      {
        id: 'q35-spirit',
        goal: 'Win the Spirit level and take the title.',
        hint: 'Spirit rewards honesty, nerve or tears. Fill the meter before the candle burns down.',
        check: 'minigame:board-game:spirit',
        scene: {
          id: 'q35-truths',
          lines: [
            { who: 'narrator', text: 'Level three is Spirit. The lights go down. Mags lights a candle and won’t say where she got it.' },
            { who: 'dabney', text: 'Spirit is about truth. Each side says something true about themselves. The weakest truth loses.' },
            { who: 'corky', text: 'I don’t like Spirit. Somebody always cries in Spirit.', mood: 'sad' },
            { who: 'mags', text: 'You cried last time.' },
            { who: 'corky', text: 'Because Dabney said rats don’t have feelings! They have feelings, Mags!', mood: 'sad' },
            { who: 'rook', text: 'I’ll go. Truth. I don’t actually know any karate. I learned it all off a poster.', mood: 'sad' },
            { who: 'narrator', text: 'Silence. Then Rook starts crying, hard, into the board.' },
            { who: 'mags', text: 'My turn. Truth: I am the most talented person in this room.', mood: 'happy' },
            { who: 'dabney', text: 'That isn’t a truth, Mags. That’s a symptom.' },
            { who: 'dabney', text: 'Rook’s, though. That was a strong truth. Keeper? Beat it.', mood: 'think' },
          ],
          choices: [
            {
              id: 'q35-truth',
              label: 'Tell a real truth.',
              set: { 'q35-spirit': 'truth' },
              then: [
                { who: 'narrator', text: 'You say something small and true. Nobody laughs. Mags hugs a cushion.' },
                { who: 'dabney', text: 'Disgusting. Point to Brute Force.' },
              ],
            },
            {
              id: 'q35-lie',
              label: 'Make up something huge.',
              set: { 'q35-spirit': 'lie' },
              then: [
                { who: 'corky', text: 'Whoa. You fought a bear? On a boat? In the rain?', mood: 'shock' },
                { who: 'dabney', text: 'That’s a lie. It’s a beautiful lie. Point.', mood: 'think' },
              ],
            },
            {
              id: 'q35-cry',
              label: 'Just start crying.',
              set: { 'q35-spirit': 'cry' },
              then: [
                { who: 'mags', text: 'Now I’m crying. Why am I crying?', mood: 'sad' },
                { who: 'corky', text: 'Everybody’s crying. It’s Spirit, man.', mood: 'sad' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q35-complete',
      lines: [
        { who: 'narrator', text: 'The candle gutters out. On the scoreboard, in Corky’s handwriting, is something that is probably a win.' },
        { who: 'rook', text: 'Brute Force! Brute Force! We beat the champions!', mood: 'happy' },
        { who: 'mags', text: 'This is a fix. You all cheated. I want a recount.', mood: 'angry' },
        { who: 'dabney', text: 'There will be a rematch. And I will crush every one of you.', mood: 'angry' },
        { who: 'dabney', text: 'Except Mags. Mags is… adequate. There. That’s my nice thing. I already drank for it.' },
        { who: 'mags', text: 'That’s the nicest thing you’ve said to me since we shared a pram.', mood: 'soft' },
        { who: 'dabney', text: 'It was a dare.' },
        { who: 'corky', text: 'You take the trophy. I already licked it.', mood: 'happy' },
        { who: 'narrator', text: 'You take home the board, the trophy, and a new title for your profile: Game of Games.' },
      ],
    },
    rewards: [
      {
        id: 'q35-board',
        kind: 'decor',
        label: 'Game Board',
        description: 'The stained, door-sized board, for propping against a wall.',
      },
      {
        id: 'q35-trophy',
        kind: 'decor',
        label: 'Trophy',
        description: 'A tarnished trophy. Already licked.',
      },
      {
        id: 'q35-title',
        kind: 'title',
        label: 'Game of Games',
        description: 'A profile title for the Keeper who beat the champions.',
      },
    ],
    notes:
      'Lead: Dabney (with Mags). One sitting, start to finish: if the player leaves the pub mid-game, the game resets to Mind. Three minigames ' +
      'share one board UI with a level track (Mind / Body / Spirit). Drinking is shown as a gulp and a screen sway, nothing more. The in-world ' +
      'name is never explained; that is the joke. Spirit: dim the pub to candlelight; soft piano sting when Rook cries.',
  },

  // ------------------------------------------------------------------ Q36
  {
    id: 'q36',
    code: 'Q36',
    title: 'Rum Ham',
    source: `${SHOW}: “The Gang Goes to the Jersey Shore”`,
    audience: 'adult',
    trigger: {
      where: 'The pond',
      when: 'A warm day after Q32; Fitz and Corky are pushing a raft into the water. Needs a Nubbin with some Swim.' + WHEN_SUFFIX,
    },
    requires: ['Q31', 'Q32'],
    speakers: [FITZ, CORKY],
    steps: [
      {
        id: 'q36-lap-one',
        goal: 'Send a Swim Nubbin after the rum ham, once round the pond.',
        hint: 'Tap a Nubbin with good Swim and point at the ham; it drifts with the current, anticlockwise.',
        check: 'swim:chase:rum-ham:1',
        scene: {
          id: 'q36-bender',
          lines: [
            { who: 'narrator', text: 'Fitz is at the pond with a raft, a bucket and a whole ham. The ham is in the bucket. The bucket is full of rum.' },
            { who: 'fitz', text: 'Soaked it overnight. Every bite’s a drink. Every drink’s a bite. It’s efficient.', mood: 'happy' },
            { who: 'corky', text: 'Rum ham!', mood: 'happy' },
            { who: 'fitz', text: 'Beach day. There’s no beach, so the pond’s the beach. Don’t think about it.' },
            { who: 'narrator', text: 'They push off. They eat the ham. They drink the ham. Within the hour both are asleep, face down on the raft.' },
            { who: 'narrator', text: 'The current takes the ham. It bobs away across the pond, glistening, faintly steaming.' },
            { who: 'narrator', text: 'Corky wakes, because a ham is moving.' },
            { who: 'corky', text: 'The ham. The ham’s leaving. Why is the ham leaving?', mood: 'shock' },
            { who: 'fitz', text: 'Get it back. That ham is my whole holiday.', mood: 'sad' },
          ],
          choices: [
            {
              id: 'q36-promise',
              label: 'Promise Fitz you’ll get his ham back.',
              set: { 'q36-promise': true },
              then: [
                { who: 'fitz', text: 'Good. You’re a good kid. I’ll put you in my will. Near the bottom.', mood: 'happy' },
              ],
            },
            {
              id: 'q36-free',
              label: 'Tell him the ham has made its choice.',
              set: { 'q36-promise': false },
              then: [
                { who: 'fitz', text: 'The ham doesn’t get a choice! I paid for that ham!', mood: 'angry' },
                { who: 'corky', text: 'Let the ham be free, Fitz…', mood: 'sad' },
              ],
            },
          ],
        },
        done: {
          id: 'q36-lap-one-done',
          lines: [
            { who: 'narrator', text: 'Your Nubbin paddles up to the ham, sniffs it, sneezes, and nudges it with its nose. The ham catches the current and sails on.' },
            { who: 'corky', text: 'So close! It touched it! Ham’s slippery, man.' },
          ],
        },
      },
      {
        id: 'q36-lap-two',
        goal: 'Send your Swim Nubbin round the pond again and push the ham back to the raft.',
        hint: 'Cut across the middle this time; the ham slows down as it passes the reeds.',
        check: 'swim:chase:rum-ham:2',
        scene: {
          id: 'q36-trying-time',
          lines: [
            { who: 'narrator', text: 'Second lap. The ham is in the middle of the pond now, turning slowly, as if it owns the place.' },
            { who: 'fitz', text: 'Stuck on a raft. No ham. No paddle. This is the worst day of my life.', mood: 'sad' },
            { who: 'fitz', text: 'Can I offer you a nice egg in this trying time?' },
            { who: 'narrator', text: 'He holds out a hard-boiled egg he has been keeping in his shirt pocket. It is warm.' },
            { who: 'corky', text: 'Yes. Thank you. I’ll take that.' },
            { who: 'narrator', text: 'Corky eats it, shell and all, and gives a thumbs up to your Nubbin out on the water.' },
            { who: 'narrator', text: 'Across the pond, a familiar goose has seen the ham. It pushes off from the reeds with terrible purpose.' },
            { who: 'corky', text: 'No. Not him. Not the goose. He’s been waiting for this his whole life.', mood: 'shock' },
          ],
          choices: [
            {
              id: 'q36-race',
              label: 'Race the goose straight for the ham.',
              set: { 'q36-goose': 'raced' },
              then: [
                { who: 'narrator', text: 'Your Nubbin paddles flat out. The goose honks the whole way, like a horn with opinions.' },
              ],
            },
            {
              id: 'q36-egg',
              label: 'Distract the goose with another egg.',
              set: { 'q36-goose': 'egg' },
              then: [
                { who: 'narrator', text: 'Fitz has another egg. He always has another egg. You throw it, and the goose veers off after it.' },
                { who: 'fitz', text: 'That was my emotional support egg!', mood: 'sad' },
              ],
            },
          ],
        },
        done: {
          id: 'q36-lap-two-done',
          lines: [
            { who: 'narrator', text: 'Your Nubbin noses the ham all the way back to the raft and gets a cheer from both men.' },
            { who: 'fitz', text: 'Rum ham!', mood: 'happy' },
          ],
        },
      },
    ],
    complete: {
      id: 'q36-complete',
      lines: [
        { who: 'narrator', text: 'The ham is too waterlogged to eat. Fitz is sad about this for nearly a minute.' },
        { who: 'fitz', text: 'Don’t waste it. Tie it up out there. Let it be a monument.' },
        { who: 'corky', text: 'A ham boat! A floaty ham! The little guys can lie on it!', mood: 'happy' },
        { who: 'narrator', text: 'Corky lashes the ham to a log. Your Nubbin climbs straight on and lies down, very pleased with itself.' },
        { who: 'narrator', text: 'On the far bank, the goose watches your Nubbin sunbathe on the ham with naked envy.' },
        { who: 'narrator', text: 'The Rum Ham pond float joins your decorations. Nubbins lounge on it whenever it’s sunny.' },
      ],
    },
    rewards: [
      {
        id: 'q36-rum-ham-float',
        kind: 'decor',
        label: 'Rum Ham Float',
        description: 'A huge ham lashed to a log in the pond. Nubbins lounge on it in the sun.',
      },
    ],
    notes:
      'Lead: Corky (with Fitz). Nubbins never eat or drink the rum ham; the swimmer only sniffs, sneezes and nudges it. Pond current runs ' +
      'anticlockwise; lap one ends with the ham slipping free, lap two is the real catch. If the player has no Swim-leaning Nubbin, any Nubbin ' +
      'can do it at half speed. Art: glistening ham with a steam wisp, raft with two snoring men. Lap two adds the Q32 goose as a rival swimmer ' +
      '(q36-goose: raced / egg); it never reaches the ham and is never harmed.',
  },

  // ------------------------------------------------------------------ Q37
  {
    id: 'q37',
    code: 'Q37',
    title: 'The Night Keeper Cometh',
    source: `${SHOW}: “The Nightman Cometh” (original song, not the show’s)`,
    audience: 'adult',
    trigger: {
      where: PUB,
      when: 'Any evening after Q31; a handwritten poster for a rock opera is pinned to the pub door.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [
      CORKY,
      ROOK,
      DABNEY,
      MAGS,
      FITZ,
      { id: 'everyone', name: 'Everyone', kind: 'other' },
    ],
    steps: [
      {
        id: 'q37-rehearsal',
        goal: 'Talk Rook, Dabney, Mags and Fitz back into rehearsal before they walk out.',
        hint: 'Find each of them round the pub; every one wants to hear their part matters most. Then tap Do it in the Journal.',
        check: 'talk:gang:4',
        scene: {
          id: 'q37-casting',
          lines: [
            { who: 'narrator', text: 'A poster on the pub door: THE NIGHT KEEPER COMETH. A ROK OPRA. Most of the letters face the right way.' },
            { who: 'corky', text: 'It’s a rock opera. I wrote it. It’s about darkness. And light. And a guy who lives under your stairs.', mood: 'happy' },
            { who: 'corky', text: 'Rook, you’re the Sun Keeper. Dabney, you’re the troll. Mags, you’re the princess. Fitz, you’re on lights.' },
            { who: 'rook', text: 'Sun Keeper. The hero. Can I do it with my shirt off?', mood: 'happy' },
            { who: 'corky', text: 'You have to. It’s in the script. There’s no script, but it’s in it.' },
            { who: 'dabney', text: 'A troll. You cast me, of all people, as a troll.', mood: 'angry' },
            { who: 'corky', text: 'It’s the best part, man! The troll’s got the best bit! He’s got a bridge!' },
            { who: 'mags', text: 'The princess has two lines. Two. I have trained for years.', mood: 'angry' },
            { who: 'fitz', text: 'I don’t know how lights work. I’ll just hold some fire near things.' },
            { who: 'narrator', text: 'Rehearsal is in twenty minutes. Every one of them is about to walk out.' },
          ],
          choices: [
            {
              id: 'q37-calm-dabney',
              label: 'Tell Dabney the troll is the real lead.',
              set: { 'q37-calm': 'dabney' },
              then: [
                { who: 'dabney', text: 'The real lead. Yes. That tracks. The troll is the one they talk about afterwards.', mood: 'think' },
              ],
            },
            {
              id: 'q37-calm-mags',
              label: 'Tell Mags the princess is the emotional heart.',
              set: { 'q37-calm': 'mags' },
              then: [
                { who: 'mags', text: 'I knew it. I could feel it. I’m going to carry this whole thing.', mood: 'happy' },
                { who: 'dabney', text: 'You’re going to carry a jar.' },
              ],
            },
            {
              id: 'q37-calm-rook',
              label: 'Tell Rook to keep his shirt on.',
              set: { 'q37-calm': 'rook' },
              then: [{ who: 'rook', text: 'Then how will they know it’s me?', mood: 'sad' }],
            },
          ],
        },
        done: {
          id: 'q37-rehearsal-done',
          lines: [
            { who: 'narrator', text: 'Somehow, all four of them are on the makeshift stage at once. Nobody is happy. That will do.' },
            { who: 'corky', text: 'Okay. Okay! From the top! Fitz, hit the lights!', mood: 'happy' },
            { who: 'narrator', text: 'Fitz sets fire to a small part of the curtain. It goes out by itself. Rehearsal is a success.' },
            { who: 'mags', text: 'I’ve written myself a third line. It’s about the jar. It explains the jar.', mood: 'happy' },
            { who: 'corky', text: 'Nobody explains the jar, Mags. The jar is the mystery. The jar is the whole second act.', mood: 'angry' },
          ],
        },
      },
      {
        id: 'q37-show',
        goal: 'Light the Sun Keeper’s giant lantern on cue so Rook can make his entrance.',
        hint: 'Fitz is holding the lantern upside down. Take it, tap when the drums peak, and keep it lit through the chorus.',
        check: 'minigame:cue:sun-keeper-lantern',
        scene: {
          id: 'q37-curtain',
          lines: [
            { who: 'narrator', text: 'Opening night, by the stream. Lanterns on poles, a bedsheet curtain, and half the Grove sitting on crates.' },
            { who: 'fitz', text: 'Lights! I think! Everyone shut up!' },
            { who: 'narrator', text: 'The lanterns go out. A single beam finds Corky in a cape made from a bin bag.' },
            { who: 'corky', text: 'I come out when the lanterns go dark', mood: 'think' },
            { who: 'corky', text: 'I’m the thing you can smell in the park' },
            { who: 'corky', text: 'I’ve been eating your pears' },
            { who: 'corky', text: 'I’ve been living under your stairs' },
            { who: 'corky', text: 'And I’m leaving a little… mark.', mood: 'happy' },
            { who: 'narrator', text: 'Silence. Somewhere at the back, a Nubbin claps. It is the only one.' },
            { who: 'corky', text: 'Sun Keeper! That’s your cue! Fitz, the lantern! The big lantern!', mood: 'shock' },
          ],
        },
        done: {
          id: 'q37-sun-keeper',
          lines: [
            { who: 'narrator', text: 'The giant lantern blazes. Rook steps into the light, shirtless and oiled, holding a lantern of his own.' },
            { who: 'rook', text: 'SUN KEEPER! (hey! hey!)', mood: 'happy' },
            { who: 'rook', text: 'Lighter of the lanterns! (hey! hey!)' },
            { who: 'rook', text: 'He’s got a giant lantern and abs you can see' },
            { who: 'rook', text: 'He’ll punch the dark in the face for you and for me!', mood: 'happy' },
          ],
        },
      },
    ],
    complete: {
      id: 'q37-finale',
      lines: [
        { who: 'dabney', text: 'You want to cross my bridge? Then you pay the bridge fee.', mood: 'think' },
        { who: 'dabney', text: 'And what’s the fee? Whatever’s in your pockets.' },
        { who: 'dabney', text: 'And your boots.' },
        { who: 'dabney', text: 'And your dignity.', mood: 'happy' },
        { who: 'mags', text: 'I’m the princess and I’m meant to be the star' },
        { who: 'mags', text: 'So why am I just standing here holding a jar?', mood: 'angry' },
        { who: 'everyone', text: 'Night Keeper, Sun Keeper, holding hands at last', mood: 'happy' },
        { who: 'everyone', text: 'We spent the whole budget and the lanterns are gas—' },
        { who: 'dabney', text: 'Stop singing, Fitz.', mood: 'angry' },
        { who: 'narrator', text: 'The crowd goes wild, mostly from relief. The open-air stage, Sun and Night capes, and the song on the jukebox are yours.' },
      ],
    },
    rewards: [
      {
        id: 'q37-stage',
        kind: 'decor',
        label: 'Open-Air Stage',
        description: 'Corky’s stage by the stream, lantern poles and bedsheet curtain included.',
      },
      {
        id: 'q37-sun-cape',
        kind: 'cosmetic',
        label: 'Sun Keeper Cape',
        description: 'A gold cape that catches the light. Shirt optional.',
      },
      {
        id: 'q37-night-cape',
        kind: 'cosmetic',
        label: 'Night Keeper Cape',
        description: 'A black cape made from a bin bag. It rustles.',
      },
      {
        id: 'q37-jukebox',
        kind: 'feature',
        label: '“The Night Keeper Cometh” on the jukebox',
        description: 'Corky’s rock opera, playable on the pub jukebox any time.',
      },
    ],
    notes:
      'Lead: Corky. The song is the ORIGINAL one from the brief, staged word for word in order across q37-curtain (Night Keeper verse), ' +
      'q37-sun-keeper (Sun Keeper chorus) and q37-finale (troll, princess, everyone, Dabney’s cut-off); straight apostrophes in the brief ' +
      'are typeset as ’ like the rest of the game. No real lyrics. Troll: first line spoken, then sung. Sung lines should show with a music-note ' +
      'tag in the dialogue box. Music: hoarse rock riff (Night Keeper), power ballad with “hey! hey!” crowd shouts (Sun Keeper), ' +
      'off-key solo (princess), group singalong that stops dead on Dabney’s line. Lantern cue minigame sits between verse and chorus.',
  },

  // ------------------------------------------------------------------ Q38
  {
    id: 'q38',
    code: 'Q38',
    title: 'Bird Law',
    source: `${SHOW}: Charlie Kelly, self-taught expert in bird law`,
    audience: 'adult',
    trigger: {
      where: PUB,
      when: 'After Q32, once you have a Fly-leaning Nubbin; three pears go missing from the bar.' + WHEN_SUFFIX,
    },
    requires: ['Q31', 'Q32'],
    speakers: [CORKY, DABNEY, FITZ],
    steps: [
      {
        id: 'q38-evidence',
        goal: 'Find three pieces of evidence that will clear your Nubbin.',
        hint: 'Check its trust in the Collection book, look at its alignment glow, and search under the bar where the pears were kept.',
        check: 'collect:evidence:bird-law:3',
        scene: {
          id: 'q38-charge',
          lines: [
            { who: 'narrator', text: 'The pub has become a courtroom. The bar is the bench. Fitz sits behind it in a wig made from a mop head.' },
            { who: 'fitz', text: 'Order! Order. I’ve always wanted to say that. Someone order me a drink.' },
            { who: 'dabney', text: 'The charge: your Fly Nubbin stole three pears from this bar. I’ll be prosecuting. For fun.', mood: 'happy' },
            { who: 'dabney', text: 'I don’t need it to be guilty. I need to win. Those are two completely different jobs.' },
            { who: 'narrator', text: 'Your Nubbin sits in the dock, which is a fruit crate, and blinks.' },
            { who: 'corky', text: 'And I’m defending. I’m an expert in bird law.' },
            { who: 'dabney', text: 'It’s not a bird, Corky. It’s a Nubbin with wings.' },
            { who: 'corky', text: 'Wings, Dabney! Wings! You don’t think that falls under bird law?', mood: 'angry' },
            { who: 'corky', text: 'Bird law in this country is not governed by reason.' },
            { who: 'fitz', text: 'I’ll allow it.' },
            { who: 'corky', text: 'Get me evidence. Real stuff. I’m gonna be busy objecting.', mood: 'think' },
          ],
          choices: [
            {
              id: 'q38-plea-trust',
              label: 'Tell Corky your Nubbin wouldn’t steal: you feed it every day.',
              set: { 'q38-plea': 'trust' },
              then: [
                { who: 'corky', text: 'A well-fed bird is an honest bird. That’s bird law. I just made it, but it’s law.', mood: 'happy' },
              ],
            },
            {
              id: 'q38-plea-maybe',
              label: 'Admit it might have done it.',
              set: { 'q38-plea': 'maybe' },
              then: [
                { who: 'corky', text: 'Never admit! Never! Objection! I object to my own client’s Keeper!', mood: 'shock' },
                { who: 'fitz', text: 'Sustained. Whatever that means.' },
              ],
            },
          ],
        },
        done: {
          id: 'q38-evidence-done',
          lines: [
            { who: 'narrator', text: 'You have three things: your Nubbin’s high trust, its soft Hero glow, and a grey goose feather from under the bar.' },
            { who: 'corky', text: 'A feather! A feather is basically a confession. In bird law.', mood: 'happy' },
          ],
        },
      },
      {
        id: 'q38-trial',
        goal: 'Present all three pieces of evidence to Judge Fitz.',
        hint: 'Hand Corky each piece when he shouts “exhibit”; ignore everything else he says.',
        check: 'minigame:trial:bird-law',
        scene: {
          id: 'q38-court',
          lines: [
            { who: 'dabney', text: 'The prosecution calls common sense. The pears were there. Then the Nubbin was there. Then the pears were not.' },
            { who: 'corky', text: 'Objection!', mood: 'angry' },
            { who: 'fitz', text: 'On what grounds?' },
            { who: 'corky', text: 'On the grounds that he’s talking, and I don’t like it.' },
            { who: 'fitz', text: 'Sustained.' },
            { who: 'dabney', text: 'You can’t sustain that.', mood: 'angry' },
            { who: 'corky', text: 'The defence calls… the goose.' },
            { who: 'narrator', text: 'The goose from the back room is led in on a rope it does not accept. It honks at Dabney, then stares at Corky with pure hatred.' },
            { who: 'corky', text: 'Goose. Where were you on the night of the pears?', mood: 'think' },
            { who: 'narrator', text: 'The goose hisses. A small piece of pear falls out of its beak.' },
          ],
          choices: [
            {
              id: 'q38-lead-trust',
              label: 'Lead with the trust score.',
              set: { 'q38-lead': 'trust' },
              then: [
                { who: 'fitz', text: 'High trust. This one gets fed. Why would it steal? Good point. I made that point.' },
              ],
            },
            {
              id: 'q38-lead-glow',
              label: 'Lead with the Hero glow.',
              set: { 'q38-lead': 'glow' },
              then: [
                { who: 'dabney', text: 'Glowing doesn’t prove anything!', mood: 'angry' },
                { who: 'corky', text: 'It proves it’s a good boy, Dabney!' },
              ],
            },
            {
              id: 'q38-lead-feather',
              label: 'Lead with the goose feather.',
              set: { 'q38-lead': 'feather' },
              then: [
                { who: 'narrator', text: 'The goose sees the feather and heads for the door. Corky blocks it with his whole body.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q38-complete',
      lines: [
        { who: 'fitz', text: 'I’ve heard enough. Mostly Corky. The Nubbin is innocent. The goose is guilty. Goose, you’re barred.' },
        { who: 'dabney', text: 'You can’t bar a goose. It doesn’t come in through the door.', mood: 'angry' },
        { who: 'corky', text: 'We won! Bird law wins again! Undefeated! One and zero!', mood: 'happy' },
        { who: 'dabney', text: 'I demand an appeal. A higher court. A judge who isn’t wearing a mop.', mood: 'angry' },
        { who: 'fitz', text: 'Denied. There is no higher court. I’m the highest thing in this pub. Ask anyone.' },
        { who: 'narrator', text: 'Fitz bangs the bar with a wooden mallet, then hands it to you, because he’s bored now.' },
        { who: 'narrator', text: 'A gavel joins your decorations, and a “Nubbin Law” page appears in the Collection book, explaining trust, grades and alignment.' },
        { who: 'narrator', text: 'The goose leaves, still chewing.' },
      ],
    },
    rewards: [
      {
        id: 'q38-gavel',
        kind: 'decor',
        label: 'Gavel',
        description: 'Fitz’s wooden mallet. Bang it on anything.',
      },
      {
        id: 'q38-nubbin-law',
        kind: 'feature',
        label: 'Nubbin Law',
        description: 'A Collection book page that explains trust, grades and alignment in plain terms.',
      },
    ],
    notes:
      'Lead: Corky. The accused is the player’s own Fly-leaning Nubbin (fallback: the highest-Fly Nubbin they own). The three evidence pickups ' +
      'teach real systems: open its trust in the Collection book, inspect its alignment glow, search under the bar for the feather. The goose ' +
      'is the same smug goose as Q32 and is never harmed; “barred” is a joke, it can still wander the Grove. Fitz wears a mop-head wig.',
  },

  // ------------------------------------------------------------------ Q39
  {
    id: 'q39',
    code: 'Q39',
    title: 'Project Badass',
    source: `${SHOW}: Mac’s Project Badass videos`,
    audience: 'adult',
    trigger: {
      where: 'Outside Puddle’s Pub',
      when: 'A dry day after Q31; Rook is waiting with a list of stunts.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [ROOK, CORKY, MAGS],
    steps: [
      {
        id: 'q39-roof',
        goal: 'Film Corky’s jump off the pub roof in Photo mode.',
        hint: 'Stand by the hay cart and take the shot the moment Corky leaves the roof.',
        check: 'photo:stunt:roof-jump',
        scene: {
          id: 'q39-pitch',
          lines: [
            { who: 'rook', text: 'Project Badass. A stunt reel. My stunts, my moves, my legend. You film it.', mood: 'happy' },
            { who: 'narrator', text: 'He hands you a list. Item one: JUMP OFF PUB ROOF INTO HAY CART.' },
            { who: 'corky', text: 'I’m the stunt guy. I don’t get paid. I get to be in it.', mood: 'happy' },
            { who: 'rook', text: 'You’re my double. You do the dangerous bit. I do the bit before and the bit after.' },
            { who: 'corky', text: 'What’s the bit before?' },
            { who: 'rook', text: 'I point at the roof and nod.' },
            { who: 'narrator', text: 'Rook points at the roof and nods. He holds it for some time.' },
            { who: 'narrator', text: 'Corky is already up there, waving. The hay cart is some distance from where he is standing.' },
          ],
          choices: [
            {
              id: 'q39-move-cart',
              label: 'Push the hay cart under him.',
              set: { 'q39-cart': 'moved' },
              then: [
                { who: 'rook', text: 'Don’t touch the set! That’s where the cart goes!', mood: 'angry' },
                { who: 'narrator', text: 'Rook pushes it back. Exactly where it was. Slightly further, if anything.' },
              ],
            },
            {
              id: 'q39-roll',
              label: 'Just start filming.',
              set: { 'q39-cart': 'left' },
              then: [{ who: 'rook', text: 'A real director. Action!', mood: 'happy' }],
            },
          ],
        },
        done: {
          id: 'q39-roof-done',
          lines: [
            { who: 'narrator', text: 'Corky jumps. He misses the hay cart. He does not miss the water butt.' },
            { who: 'corky', text: 'I’m fine! I hit the soft part of the barrel!', mood: 'happy' },
            { who: 'rook', text: 'Cut. Now get my reaction.' },
            { who: 'narrator', text: 'Rook gives a look of grim approval to nothing in particular.' },
          ],
        },
      },
      {
        id: 'q39-fence',
        goal: 'Film Corky going through the fence.',
        hint: 'Frame the fence side-on; Corky bounces off the first time, so wait for the second run.',
        check: 'photo:stunt:fence',
        scene: {
          id: 'q39-fence-setup',
          lines: [
            { who: 'rook', text: 'Stunt two. Through the fence. A man made of fists, bursting through wood.' },
            { who: 'corky', text: 'Are you gonna do it?' },
            { who: 'rook', text: 'I’m gonna do the pose. Through-the-fence is a stunt-double thing.' },
            { who: 'mags', text: 'I could do a stunt. I was a stunt actress for a week.', mood: 'happy' },
            { who: 'rook', text: 'You were an extra in a play about a duck, Mags. You were the duck.' },
            { who: 'mags', text: 'The duck was the lead!', mood: 'angry' },
            { who: 'narrator', text: 'Corky backs up, puts his head down and runs at the fence at full speed.' },
          ],
        },
        done: {
          id: 'q39-fence-done',
          lines: [
            { who: 'narrator', text: 'He bounces off. On the second run he goes through, and keeps going, into the nettles.' },
            { who: 'corky', text: 'Nettles! They don’t sting if you scream!', mood: 'happy' },
            { who: 'narrator', text: 'He screams. They sting.' },
            { who: 'rook', text: 'Beautiful. I’ll do a voiceover later saying that was me. In a deeper voice.', mood: 'happy' },
          ],
        },
      },
      {
        id: 'q39-pond',
        goal: 'Film the dive off the jetty, with a Swim Nubbin ready to tow Corky out.',
        hint: 'Keep a Nubbin with good Swim near the jetty; it fishes Corky out once the shot is done.',
        check: 'photo:stunt:pond-dive',
        scene: {
          id: 'q39-jetty',
          lines: [
            { who: 'rook', text: 'Final stunt. A flying kick off the jetty, into the pond, slow motion. The big finish.' },
            { who: 'narrator', text: 'Rook stands at the end of the jetty, does his best kick, then steps carefully back onto dry land.' },
            { who: 'rook', text: 'Great. Now Corky does the bit where you go in the water.', mood: 'happy' },
            { who: 'corky', text: 'I can’t swim, man.' },
            { who: 'rook', text: 'You don’t have to swim. You have to splash.' },
            { who: 'narrator', text: 'A Swim Nubbin bobs by the jetty, watching all this with open concern.' },
            { who: 'rook', text: 'And then the credits roll. Big letters. “All stunts performed by Rook.”', mood: 'happy' },
            { who: 'corky', text: 'Is that me? Am I Rook in this? I’m confused about who I am in this.', mood: 'think' },
          ],
          choices: [
            {
              id: 'q39-credit-corky',
              label: 'Tell Rook to credit Corky.',
              set: { 'q39-credit': 'corky' },
              then: [
                { who: 'rook', text: 'Fine. Small. At the very end. In brackets.', mood: 'angry' },
                { who: 'corky', text: 'Brackets! I’ve never been in brackets!', mood: 'happy' },
              ],
            },
            {
              id: 'q39-credit-rook',
              label: 'It’s Rook’s reel. Rook’s name goes on it.',
              set: { 'q39-credit': 'rook' },
              then: [
                { who: 'corky', text: 'It’s cool. I know it was me. The barrel knows. The nettles know.', mood: 'soft' },
                { who: 'rook', text: 'See? He gets it. A double doesn’t need credit. That’s what makes him a double.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q39-complete',
      lines: [
        { who: 'narrator', text: 'Corky goes off the jetty like a bag of laundry. Your Nubbin tows him back by the collar, rather proudly.' },
        { who: 'corky', text: 'I nailed it. Did I nail it? I can’t feel my face.', mood: 'happy' },
        { who: 'rook', text: 'That’s a wrap on Project Badass. Every stunt done by me. In spirit.', mood: 'happy' },
        { who: 'narrator', text: 'Rook tears the sleeves off his karate gi so he can “breathe on camera”, and hands you the spare.' },
        { who: 'rook', text: 'And learn the pose. Every fighter needs a pose. This is the one I do before I don’t fight.' },
        { who: 'narrator', text: 'A sleeveless karate gi joins your wardrobe, and your Nubbins can strike a pose before every karate bout.' },
      ],
    },
    rewards: [
      {
        id: 'q39-sleeveless-gi',
        kind: 'cosmetic',
        label: 'Sleeveless Karate Gi',
        description: 'Rook’s spare gi, sleeves torn off for maximum arm.',
      },
      {
        id: 'q39-pose',
        kind: 'cosmetic',
        label: 'Pre-Bout Pose',
        description: 'Your Nubbin strikes a dramatic pose before each karate bout. No effect on the fight.',
      },
    ],
    notes:
      'Lead: Rook. Corky takes every hit as cartoon slapstick: he always pops back up, no blood, no lasting injury. The Swim Nubbin only tows ' +
      'him out (no risk to it). Each stunt is a Photo mode target with a short window. Rook’s “bit before” is a held pose; play a long ' +
      'awkward silence before the narrator line. SFX: barrel thunk, fence crack, splash. q39-credit (corky / rook) can add “(Corky)” in tiny brackets to the reel’s end card.',
  },

  // ------------------------------------------------------------------ Q40
  {
    id: 'q40',
    code: 'Q40',
    title: 'The Gang Goes to the Water Park',
    source: `${SHOW}: “The Gang Goes to the Water Park”`,
    audience: 'adult',
    trigger: {
      where: 'The hill above the pond',
      when: 'A summer day after Q31; Mags is at the top of the hill with a pile of planks and a drawing.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [MAGS, FITZ, DABNEY, CORKY],
    steps: [
      {
        id: 'q40-build',
        goal: 'Bring Mags 10 wood and 6 stone and build the waterslide.',
        hint: 'Gather fallen branches in the woods and loose stones from the stream bed, then drop them on the pile at the hilltop.',
        check: 'build:waterslide',
        scene: {
          id: 'q40-plan',
          lines: [
            { who: 'mags', text: 'Big news. I’m building a waterslide. From the top of the hill, into the pond. My idea. Mine.', mood: 'happy' },
            { who: 'fitz', text: 'My money.' },
            { who: 'mags', text: 'Fitz’s money. My idea.' },
            { who: 'dabney', text: 'It’s a terrible idea, which is why I’m here. I want to watch.' },
            { who: 'corky', text: 'Me and Dabney have a side thing. We’ll be back. Don’t ask what it is.' },
            { who: 'dabney', text: 'You’ll hear about it.' },
            { who: 'narrator', text: 'They wander off into the trees, whispering. Mags hands you a drawing. It is mostly arrows.' },
            { who: 'mags', text: 'I need wood for the chute and stone for the base. Lots. Go, go, go.' },
          ],
          choices: [
            {
              id: 'q40-tube',
              label: 'Suggest a covered tube section, for speed.',
              set: { 'q40-tube': 'yours' },
              then: [
                { who: 'mags', text: 'A tube! Yes! That’s what I was about to say!', mood: 'happy' },
                { who: 'fitz', text: 'Tubes are expensive.' },
              ],
            },
            {
              id: 'q40-open',
              label: 'Suggest keeping it open, so people can get out.',
              set: { 'q40-tube': 'hers' },
              then: [
                { who: 'mags', text: 'Boring. We’re doing a tube. I have vision.', mood: 'angry' },
              ],
            },
          ],
        },
        done: {
          id: 'q40-build-done',
          lines: [
            { who: 'narrator', text: 'The slide snakes down the hill, through a wooden tube, and into the pond. It wobbles. It is glorious.' },
            { who: 'mags', text: 'First go is mine. It’s my slide.', mood: 'happy' },
            { who: 'fitz', text: 'First go is mine. It’s my money.' },
            { who: 'narrator', text: 'They both get in at once.' },
          ],
        },
      },
      {
        id: 'q40-stuck',
        goal: 'Get Fitz and Mags out of the waterslide tube.',
        hint: 'Loosen the stones under the tube to tilt it, then pull; one side at a time, or the whole thing goes.',
        check: 'minigame:unstick:waterslide',
        scene: {
          id: 'q40-wedged',
          lines: [
            { who: 'narrator', text: 'Halfway down, inside the tube, there is a thud. Then nothing. Then two voices.' },
            { who: 'mags', text: 'Get your elbow out of my ear!', mood: 'angry' },
            { who: 'fitz', text: 'That’s not my elbow, it’s a ham sandwich. I always bring one.' },
            { who: 'mags', text: 'Why is it wet?', mood: 'shock' },
            { who: 'fitz', text: 'It’s a waterslide, Mags.' },
            { who: 'narrator', text: 'Water is backing up behind them. The tube creaks.' },
            { who: 'fitz', text: 'Hurry up! If this dries, it’s a sandwich with a view.' },
            { who: 'mags', text: 'Get. Us. Out.', mood: 'angry' },
          ],
          choices: [
            {
              id: 'q40-push',
              label: 'Push from the top.',
              set: { 'q40-rescue': 'push' },
              then: [
                { who: 'narrator', text: 'You push. They move one inch. Fitz says “ow” in a voice muffled by sandwich.' },
              ],
            },
            {
              id: 'q40-pull',
              label: 'Pull from the bottom.',
              set: { 'q40-rescue': 'pull' },
              then: [
                { who: 'mags', text: 'Pull my leg! Not that one! That’s Fitz! Pull MY leg!', mood: 'shock' },
              ],
            },
          ],
        },
        done: {
          id: 'q40-stuck-done',
          lines: [
            { who: 'narrator', text: 'They shoot out of the tube together with a noise like a cork and land in the pond in one tangle.' },
            { who: 'narrator', text: 'Corky and Dabney come back from the trees with a sack of shells and a sign: SLIDE, 5 SHELLS.' },
            { who: 'dabney', text: 'We sold tickets. Every one we printed. For a slide that, until a minute ago, didn’t work.', mood: 'happy' },
            { who: 'corky', text: 'We didn’t know that! It’s not a lie if you don’t know!', mood: 'happy' },
            { who: 'narrator', text: 'At the bottom of the hill, a long queue of damp neighbours and their Nubbins is holding tickets and looking up at you.' },
          ],
          choices: [
            {
              id: 'q40-refund',
              label: 'Make them give the shells back.',
              set: { 'q40-tickets': 'refund' },
              then: [
                { who: 'dabney', text: 'Refund? The slide works now. It’s a scam that came true. That’s just a business.', mood: 'angry' },
                { who: 'narrator', text: 'Corky hands the shells back one at a time, counting out loud, wrongly, in everybody’s favour.' },
              ],
            },
            {
              id: 'q40-honour',
              label: 'Let the ticket holders ride. It works now.',
              set: { 'q40-tickets': 'honour' },
              then: [
                { who: 'narrator', text: 'The queue climbs the hill. The slide holds. Somehow, it holds.' },
                { who: 'dabney', text: 'So the lie just… became true. I could get used to that.', mood: 'think' },
              ],
            },
            {
              id: 'q40-cut',
              label: 'Ask for your cut.',
              set: { 'q40-tickets': 'cut' },
              then: [
                { who: 'dabney', text: 'Now you’re thinking like one of us.', mood: 'happy' },
                { who: 'corky', text: 'Here. One shell. That’s your cut. Don’t spend it all on one thing.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q40-complete',
      lines: [
        { who: 'mags', text: 'You sold tickets? To my slide? Where’s my cut?', mood: 'angry' },
        { who: 'dabney', text: 'Your cut is that you got out of the tube, Mags.' },
        { who: 'fitz', text: 'Where’s my cut? It’s my money.' },
        { who: 'corky', text: 'We spent it. On more tickets.' },
        { who: 'narrator', text: 'A Nubbin climbs the hill, sits at the top of the slide and whooshes into the pond. It runs straight back up for another go.' },
        { who: 'narrator', text: 'The waterslide is yours. Nubbins slide down it for fun, and it nudges them towards Swim.' },
      ],
    },
    rewards: [
      {
        id: 'q40-waterslide',
        kind: 'decor',
        label: 'Waterslide',
        description: 'A wobbly slide from the hilltop into the pond. Nubbins ride it for fun, which gives them a small lean towards Swim.',
      },
    ],
    notes:
      'Lead: Mags. The tube gets built whichever choice the player makes (Mags always overrules); the flag only records who suggested it. ' +
      'Corky and Dabney are off-screen during step 2. Unstick minigame: tilt and pull with water rising behind the stuck pair; failure just ' +
      'resets with a gush of water. No Nubbins go in the slide until it is fixed. “cut” gives 1 shell. Payoffs: q40-tube-is-*, q40-rescue-is-* and q40-tickets-is-* play before the complete scene.',
  },

  // ------------------------------------------------------------------ Q41
  {
    id: 'q41',
    code: 'Q41',
    title: 'The Gang Wrestles for the Troops',
    source: `${SHOW}: “The Gang Wrestles for the Troops”`,
    audience: 'adult',
    trigger: {
      where: 'The dojo',
      when: 'After Q31 and your first karate win; a poster at the dojo announces wrestling night.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [FITZ, MAGS, ROOK, DABNEY, CORKY],
    steps: [
      {
        id: 'q41-debut',
        goal: 'Choose a Nubbin as your tag partner and enter the ring at the dojo.',
        hint: 'Open the karate menu at the dojo and choose Tag Team; a Nubbin with good Stamina helps, the match runs long.',
        check: 'karate:enter:tag-team',
        scene: {
          id: 'q41-ring',
          lines: [
            { who: 'narrator', text: 'The dojo has a wrestling ring in it now. The ropes are washing lines. A sign: WRESTLING NIGHT, FOR THE GROVE WATCH.' },
            { who: 'mags', text: 'Keepers and Nubbins! Our first wrestler comes from a place of darkness and smells!', mood: 'happy' },
            { who: 'narrator', text: 'A bin in the corner of the ring wobbles. The lid lifts. Fitz rises out of it, covered in peel.' },
            { who: 'fitz', text: 'Trash Man!', mood: 'happy' },
            { who: 'narrator', text: 'He picks a fish skeleton off his shoulder and eats what’s left on it. The crowd screams. Some of it is cheering.' },
            { who: 'rook', text: 'And his opponents! The tag team! Feathers and Fury!', mood: 'happy' },
            { who: 'narrator', text: 'Rook and Dabney climb in wearing matching capes covered in glued-on feathers. Dabney has also oiled himself.' },
            { who: 'dabney', text: 'The crowd adores us. Look at their faces. That’s adoration.', mood: 'happy' },
            { who: 'corky', text: 'That’s fear, Dabney. I’m the ref. I can tell.' },
            { who: 'fitz', text: 'Trash Man needs a partner. You. And bring a Nubbin. A tough one.' },
          ],
          choices: [
            {
              id: 'q41-bin',
              label: 'Climb into the bin with Fitz for your entrance.',
              set: { 'q41-entrance': 'bin' },
              then: [
                { who: 'narrator', text: 'It is warm in the bin. Something else in the bin is also warm. You do not investigate.' },
                { who: 'fitz', text: 'That’s my partner!', mood: 'happy' },
              ],
            },
            {
              id: 'q41-steps',
              label: 'Use the steps like a normal person.',
              set: { 'q41-entrance': 'steps' },
              then: [
                { who: 'fitz', text: 'Boo! Boo! The Trash Man’s partner uses steps!', mood: 'angry' },
              ],
            },
          ],
        },
        done: {
          id: 'q41-debut-done',
          lines: [
            { who: 'corky', text: 'Okay. Rules. No biting. Some biting. Biting’s fine. Ding ding.' },
            { who: 'narrator', text: 'Corky hits the bell with a frying pan.' },
          ],
        },
      },
      {
        id: 'q41-match',
        goal: 'Win the tag-team bout against Feathers and Fury.',
        hint: 'Swap between your two fighters when the bar flashes; the fresh one hits harder.',
        check: 'karate:win:tag-team-feathers',
        scene: {
          id: 'q41-bout',
          lines: [
            { who: 'narrator', text: 'Feathers and Fury open with a pose that takes thirty seconds. Feathers come off in every direction.' },
            { who: 'rook', text: 'Hi-YAH! Flying Feather Kick!', mood: 'angry' },
            { who: 'narrator', text: 'Rook leaps off the ropes, misses everyone and lands in Fitz’s bin. The lid shuts on him.' },
            { who: 'dabney', text: 'Rook! You’re ruining our look!', mood: 'angry' },
            { who: 'fitz', text: 'Tag in the Nubbin! Let the little one do the work!' },
            { who: 'narrator', text: 'Your Nubbin hops over the rope, stands very still, and waits. Dabney looks at it. It looks at Dabney.' },
            { who: 'dabney', text: 'Why is it calm? Why is it so calm?', mood: 'shock' },
            { who: 'narrator', text: 'In a clinch by the ropes, Dabney leans in close. He smells of oil and confidence.' },
            { who: 'dabney', text: 'Keeper. Lie down in round two and we split the gate money. Fitz never has to know.' },
          ],
          choices: [
            {
              id: 'q41-refuse',
              label: 'Refuse. Wrestle it clean.',
              set: { 'q41-deal': 'refused' },
              then: [{ who: 'dabney', text: 'Clean? In a ring made of washing lines? With him?', mood: 'angry' }],
            },
            {
              id: 'q41-double-cross',
              label: 'Agree. Then win anyway.',
              set: { 'q41-deal': 'double-crossed' },
              then: [
                { who: 'dabney', text: 'Pleasure doing busi—', mood: 'happy' },
                { who: 'narrator', text: 'Your Nubbin is already tagged in. Dabney’s face does something complicated.' },
              ],
            },
            {
              id: 'q41-tell-fitz',
              label: 'Tell Fitz.',
              set: { 'q41-deal': 'told' },
              then: [
                { who: 'fitz', text: 'He offered you a split? He never offered ME a split!', mood: 'angry' },
                { who: 'narrator', text: 'Fitz is not upset about the cheating. Fitz is upset about being left out of it.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q41-complete',
      lines: [
        { who: 'narrator', text: 'Dabney slips on his own oil and leaves the ring backwards. The referee, who is eating crisps, declares a winner.' },
        { who: 'corky', text: 'Winner! The trash team! And the Nubbin! Mostly the Nubbin!', mood: 'happy' },
        { who: 'fitz', text: 'Trash Man!', mood: 'happy' },
        { who: 'rook', text: 'Can someone open the bin? I’m still in the bin.', mood: 'sad' },
        { who: 'mags', text: 'And every shell from tonight goes to the Grove Watch!', mood: 'happy' },
        { who: 'fitz', text: 'Most of the shells. Some shells. A shell. Take the costumes. Feathers, peel, the lot. The smell’s free.' },
        { who: 'narrator', text: 'The wrestling costumes join your wardrobe. In karate, two of your Nubbins can now share a bout as a tag team.' },
      ],
    },
    rewards: [
      {
        id: 'q41-tag-team',
        kind: 'feature',
        label: 'Tag-Team Karate',
        description: 'Two of your Nubbins can share one karate bout, swapping in and out.',
      },
      {
        id: 'q41-costumes',
        kind: 'cosmetic',
        label: 'Wrestling Costumes',
        description: 'The Trash Man’s peel-covered vest and a feathered Feathers and Fury cape.',
      },
    ],
    notes:
      'Lead: Fitz. The quest bout is a scripted tag-team karate bout against Rook and Dabney (use the karate UI with their portraits); ' +
      'no person ever strikes a Nubbin: Rook lands in the bin and Dabney slips on his own oil. Trash Man entrance: bin lid lift, peel ' +
      'particles, crowd scream. Fitz eats from the bin on screen (gross-out is fine, keep it a quick gag). Dabney’s offer to throw the bout is a ' +
      'choice (q41-deal); the step is still won in the karate UI. It pays off in Q45 (q41-deal-is-*, when Pim tries the same). q41-entrance-is-* plays before the bout.',
  },

  // ------------------------------------------------------------------ Q42
  {
    id: 'q42',
    code: 'Q42',
    title: 'Pepe Silvia',
    source: `${SHOW}: “Sweet Dee Has a Heart Attack” (the mail room)`,
    audience: 'adult',
    trigger: {
      where: 'Puddle’s Pub, back room',
      when: 'After Q31, once a pear has been left at your gate three mornings running.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [CORKY, DABNEY],
    steps: [
      {
        id: 'q42-clues',
        goal: 'Follow Corky’s red string to three clues around the Grove.',
        hint: 'The strings run from the pub to the pear tree, the stream bank and the pub bins; inspect the end of each one.',
        check: 'find:clue:pepe-silvia:3',
        scene: {
          id: 'q42-wall',
          lines: [
            { who: 'narrator', text: 'For three mornings running, someone has left a pear at your gate. Corky has noticed. Corky has done something about it.' },
            { who: 'narrator', text: 'The back room is covered, floor to ceiling, in notes, string and pinned-up pear stalks. Corky is sweating through his shirt.' },
            { who: 'corky', text: 'Pepe Silvia!', mood: 'shock' },
            { who: 'you', text: 'Who?' },
            { who: 'corky', text: 'That’s the name. On the pears. Every pear comes with a mark, and every mark is him. Pepe Silvia.' },
            { who: 'dabney', text: 'Corky, that mark is where the stalk was. And you can’t read.' },
            { who: 'corky', text: 'I don’t have to read, Dabney, I have to SEE! And I see him everywhere!', mood: 'angry' },
            { who: 'corky', text: 'I’ve been working the mail room. Nobody else does the mail room. It’s just me and the mail.' },
            { who: 'dabney', text: 'There is no mail room. It’s a shoebox by the door.' },
            { who: 'corky', text: 'Follow the string. The tree. The stream. The bins. I’ve got string on all of them.', mood: 'think' },
          ],
          choices: [
            {
              id: 'q42-believe',
              label: 'Tell Corky you believe him.',
              set: { 'q42-believe': true },
              then: [
                { who: 'corky', text: 'Finally! Someone gets it! You’re in the circle now. There’s string in it for you.', mood: 'happy' },
              ],
            },
            {
              id: 'q42-sleep',
              label: 'Ask him when he last slept.',
              set: { 'q42-believe': false },
              then: [
                { who: 'corky', text: 'Sleep is what he WANTS, man!', mood: 'angry' },
              ],
            },
          ],
        },
        done: {
          id: 'q42-clues-done',
          lines: [
            { who: 'narrator', text: 'Clue one: tiny nibble marks on a pear branch. Clue two: small round prints in the mud. Clue three: a very neat core in the bins.' },
            { who: 'corky', text: 'Small teeth. Small feet. Tidy. This is a professional.', mood: 'shock' },
            { who: 'dabney', text: 'Or a Nubbin.' },
            { who: 'corky', text: 'Don’t be stupid, Dabney.' },
          ],
        },
      },
      {
        id: 'q42-stakeout',
        goal: 'Stake out your gate at dawn and catch whoever is leaving the pears.',
        hint: 'Hide by the hedge before sunrise and stay still; move too early and whoever it is runs off.',
        check: 'wait:gate:dawn',
        scene: {
          id: 'q42-hedge',
          lines: [
            { who: 'corky', text: 'We stake out the gate. Tonight. All night. I’ve got snacks. I’ve got a lantern. I’ve got string, in case.' },
            { who: 'narrator', text: 'You crouch behind the hedge with Corky. He has brought a jar of something that smells like glue, “to stay sharp”.' },
            { who: 'corky', text: 'And another thing. I asked HR. I went straight to HR and asked for Carol.', mood: 'think' },
            { who: 'dabney', text: 'Corky, we don’t have—' },
            { who: 'corky', text: 'There is no Carol in HR!', mood: 'angry' },
            { who: 'dabney', text: 'We don’t have an HR. There has never been a Carol. You made Carol up on Tuesday.' },
            { who: 'corky', text: 'Exactly. Exactly! Think about it!' },
            { who: 'narrator', text: 'At three in the morning, Corky whispers “Pepe Silvia” into the hedge, to see if it flinches. It does not.' },
            { who: 'narrator', text: 'Just before dawn, something small rustles at the gate.' },
          ],
        },
      },
    ],
    complete: {
      id: 'q42-complete',
      lines: [
        { who: 'narrator', text: 'One of your own Nubbins waddles up to the gate with a pear in its arms, sets it down neatly, and looks very proud.' },
        { who: 'corky', text: 'Pepe Silvia!', mood: 'shock' },
        { who: 'narrator', text: 'The Nubbin looks at Corky. Corky looks at the Nubbin. The Nubbin hands him the pear.' },
        { who: 'corky', text: 'It’s been gifts. The whole time. It’s been bringing you gifts.', mood: 'soft' },
        { who: 'dabney', text: 'It likes you, Keeper. That’s all this ever was.' },
        { who: 'corky', text: 'I’m keeping the wall. The wall was right, it was just right about different stuff.', mood: 'happy' },
        { who: 'narrator', text: 'Corky gives you the conspiracy board anyway, string and all. A red-string conspiracy board joins your decorations.' },
      ],
    },
    rewards: [
      {
        id: 'q42-conspiracy-board',
        kind: 'decor',
        label: 'Red-String Conspiracy Board',
        description: 'Corky’s wall of notes, pear stalks and red string. It explains everything, if you don’t look closely.',
      },
    ],
    notes:
      'Lead: Corky. The gift-giver is the player’s highest-trust Nubbin; for the three mornings before the trigger, spawn a pear at the gate ' +
      'and have that Nubbin path there at dawn. Clue spots are marked by red string running from the pub. The “mark” on the pears is just ' +
      'the stalk scar; Corky cannot read and sees a name. Art: back-room wall covered in string; Corky sweat-stain shirt variant.',
  },

  // ------------------------------------------------------------------ Q43
  {
    id: 'q43',
    code: 'Q43',
    title: 'Lethal Weapon 5',
    source: `${SHOW}: the gang’s home-made Lethal Weapon sequels`,
    audience: 'adult',
    trigger: {
      where: 'The woods by the old mill',
      when: 'After Q31; Fitz has bought a crate of fireworks and Rook a leather jacket.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [ROOK, FITZ, MAGS, DABNEY],
    steps: [
      {
        id: 'q43-chase',
        goal: 'Direct scene one: film the wheelbarrow chase in Photo mode.',
        hint: 'Track Rook as Corky pushes the wheelbarrow down the hill; shoot when the painted headlights face you.',
        check: 'photo:scene:lethal-weapon-5:chase',
        scene: {
          id: 'q43-setup',
          lines: [
            { who: 'narrator', text: 'Fitz has bought a crate of fireworks. Rook has bought a leather jacket two sizes too small. Together, they are making a film.' },
            { who: 'rook', text: 'Lethal Weapon 5. The one nobody made. Because they were scared.', mood: 'happy' },
            { who: 'fitz', text: 'I’m the director. And the money. And the old cop who’s too old for all this.' },
            { who: 'rook', text: 'I’m the young cop. Loose cannon. Plays by his own rules. Has abs.' },
            { who: 'mags', text: 'And me?' },
            { who: 'fitz', text: 'You’re a body in the river.' },
            { who: 'mags', text: 'A dead body? I can act! I’ve got range!', mood: 'angry' },
            { who: 'dabney', text: 'You’ll be perfect, Mags. Just lie still. You’ve been rehearsing for years.' },
            { who: 'rook', text: 'Keeper, you’re on camera. Nubbins are the extras. Scene one: the car chase.' },
            { who: 'narrator', text: 'There is no car. There is a wheelbarrow with two headlights painted on it, and Corky, ready to push.' },
          ],
          choices: [
            {
              id: 'q43-extras-back',
              label: 'Seat the Nubbin extras well back from the fireworks.',
              set: { 'q43-extras': 'back' },
              then: [
                { who: 'fitz', text: 'Fine. Ruin my shot. Safety is for cowards.' },
                { who: 'narrator', text: 'The Nubbins sit in a neat row on the hill, delighted to be in a film.' },
              ],
            },
            {
              id: 'q43-extras-cheer',
              label: 'Give the Nubbin extras a job: cheering.',
              set: { 'q43-extras': 'cheering' },
              then: [
                { who: 'rook', text: 'A crowd! Every hero needs a crowd!', mood: 'happy' },
                { who: 'narrator', text: 'The Nubbins cheer from the hill, well clear of anything that might go bang.' },
              ],
            },
          ],
        },
        done: {
          id: 'q43-chase-done',
          lines: [
            { who: 'narrator', text: 'Corky pushes the wheelbarrow down the hill at full speed. Rook stands in it, pointing a stick. They hit a hedge.' },
            { who: 'rook', text: 'Cut! Print it! That’s the movie!', mood: 'happy' },
          ],
        },
      },
      {
        id: 'q43-explosion',
        goal: 'Direct scene two: film the shed explosion from a safe distance.',
        hint: 'Stay at the camera spot on the hill with the Nubbins; zoom in, don’t walk in.',
        check: 'photo:scene:lethal-weapon-5:explosion',
        scene: {
          id: 'q43-shed',
          lines: [
            { who: 'fitz', text: 'Scene two. The big bang. The bad guys’ hideout goes up in a ball of fire.', mood: 'happy' },
            { who: 'narrator', text: 'The bad guys’ hideout is a garden shed. Fitz has packed it with every firework he owns.' },
            { who: 'dabney', text: 'Is this safe?' },
            { who: 'fitz', text: 'No.' },
            { who: 'rook', text: 'I walk away from the explosion without looking back. Cool guys don’t look at explosions.' },
            { who: 'narrator', text: 'Fitz lights the fuse. Rook walks away. Rook looks back. Rook runs.' },
            { who: 'narrator', text: 'Far up the hill, the Nubbins ooh at the sparks.' },
            { who: 'narrator', text: 'Down in the stream, Mags floats slowly past the shed, face down, still fully in character.' },
          ],
        },
        done: {
          id: 'q43-explosion-done',
          lines: [
            { who: 'narrator', text: 'The shed does not explode. It fizzes, spins, whistles, and fires a single rocket straight into the pub sign.' },
            { who: 'fitz', text: 'Beautiful. Very realistic. Keep rolling.', mood: 'happy' },
          ],
        },
      },
      {
        id: 'q43-bridge',
        goal: 'Direct scene three: film the fight on the bridge.',
        hint: 'Shoot from the bank so the whole bridge fits in frame; the fight is short and mostly falling.',
        check: 'photo:scene:lethal-weapon-5:bridge',
        scene: {
          id: 'q43-showdown',
          lines: [
            { who: 'rook', text: 'Final scene. The fight on the bridge. Me against the villain. Dabney, you’re the villain.' },
            { who: 'dabney', text: 'Obviously. Villains are the clever ones. And the best dressed.', mood: 'happy' },
            { who: 'mags', text: 'I’ve been lying in the stream for an hour. Can the body have a line? One line?', mood: 'angry' },
            { who: 'fitz', text: 'Bodies don’t talk.' },
            { who: 'mags', text: 'This one does! This one has things to say!' },
            { who: 'narrator', text: 'Rook and Dabney circle each other on the bridge. Rook strikes a karate pose. Dabney adjusts his collar.' },
          ],
          choices: [
            {
              id: 'q43-mags-line',
              label: 'Give Mags her line.',
              set: { 'q43-mags': 'line' },
              then: [
                { who: 'mags', text: 'I’m alive! And I know who did it! It was—', mood: 'happy' },
                { who: 'narrator', text: 'Rook falls off the bridge on top of her. Print.' },
              ],
            },
            {
              id: 'q43-mags-dead',
              label: 'Keep Mags dead.',
              set: { 'q43-mags': 'dead' },
              then: [
                { who: 'mags', text: 'Fine! I’ll be the best corpse this Grove has ever seen!', mood: 'angry' },
                { who: 'narrator', text: 'She is, honestly, very good at it.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q43-complete',
      lines: [
        { who: 'narrator', text: 'The fight lasts four seconds. Both men fall into the stream. Mags is landed on twice.' },
        { who: 'fitz', text: 'That’s a wrap! Best one yet. Better than four.', mood: 'happy' },
        { who: 'rook', text: 'We never made four.' },
        { who: 'fitz', text: 'Then it’s definitely better than four.' },
        { who: 'narrator', text: 'Fitz shows you how to keep the camera rolling instead of taking one picture. He breaks it twice doing so.' },
        { who: 'narrator', text: 'Movie mode is now part of Photo mode: record a short clip and save it.' },
      ],
    },
    rewards: [
      {
        id: 'q43-movie-mode',
        kind: 'feature',
        label: 'Movie Mode',
        description: 'A new Photo mode option: record a short clip of your Grove and save it.',
      },
    ],
    notes:
      'Lead: Rook (with Fitz). Corky appears without lines, pushing the wheelbarrow. Keep it a generic no-budget action film: no costumes, ' +
      'make-up or impressions of real people. Nubbin extras always sit on the hill, well away from the fireworks; the shed only fizzes and ' +
      'one rocket hits the pub sign (sign gets a scorch mark afterwards). Each scene is a Photo mode target; Movie mode unlocks at the end.',
  },

  // ------------------------------------------------------------------ Q44
  {
    id: 'q44',
    code: 'Q44',
    title: 'Milk Steak',
    source: `${SHOW}: Charlie’s favourite foods`,
    audience: 'adult',
    trigger: {
      where: 'The Gilded Pear, a restaurant down the valley',
      when: 'After Q31; Corky leaves a drawing of a cow and a fork at your gate.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [CORKY, { id: 'waiter', name: 'Mr Tallis', kind: 'other' }],
    steps: [
      {
        id: 'q44-invite',
        goal: 'Meet Corky at The Gilded Pear in the valley, dressed for dinner.',
        hint: 'Change into any outfit from your wardrobe, then walk down the valley past the bridge to the restaurant.',
        check: 'visit:place:gilded-pear',
        scene: {
          id: 'q44-drawing',
          lines: [
            { who: 'narrator', text: 'There is a drawing at your gate. A cow. A fork. An arrow pointing down the valley. Corky has signed it with a thumb.' },
            { who: 'corky', text: 'You came! I booked us a table. The fanciest place in the valley. The Gilded Pear.', mood: 'happy' },
            { who: 'narrator', text: 'He is wearing a suit jacket over his work overalls, and a tie made from a sock.' },
            { who: 'corky', text: 'I save all year. I eat here once, on my birthday. Which is today. Right now.' },
            { who: 'corky', text: 'I put two chairs out last year. Mr Tallis took one back at nine.', mood: 'soft' },
            { who: 'corky', text: 'You gotta look nice. They don’t let you in if you look like me. Well, they do now. They know me.' },
            { who: 'corky', text: 'And you let me order. I know the good stuff. The stuff that’s not on the menu.', mood: 'think' },
          ],
          choices: [
            {
              id: 'q44-smart',
              label: 'Put on your smartest outfit.',
              set: { 'q44-outfit': 'smart' },
              then: [{ who: 'corky', text: 'Ooh, look at you. Like a prince. A prince of soup.', mood: 'happy' }],
            },
            {
              id: 'q44-sock',
              label: 'Match Corky: overalls and a sock tie.',
              set: { 'q44-outfit': 'sock' },
              then: [{ who: 'corky', text: 'Twins! We’re twins! They’re gonna love this!', mood: 'happy' }],
            },
          ],
        },
        done: {
          id: 'q44-arrive',
          lines: [
            { who: 'waiter', text: 'Good evening. Ah. Mr Corky. Again.' },
            { who: 'corky', text: 'Table for two, my man. By the window. So people can see me.', mood: 'happy' },
            { who: 'narrator', text: 'While Corky fights his chair, Mr Tallis bends to your ear.' },
            { who: 'waiter', text: '(quietly) I could bring you the trout. He need never know. I have a family. I have seen the milk steak.' },
          ],
          choices: [
            {
              id: 'q44-loyal',
              label: '“I’ll have whatever he’s having.”',
              set: { 'q44-order': 'milk' },
              then: [
                { who: 'corky', text: 'You hear that, Tallis? Two! It’s a birthday for two!', mood: 'happy' },
                { who: 'narrator', text: 'Mr Tallis closes his eyes for slightly longer than a blink.' },
              ],
            },
            {
              id: 'q44-trout',
              label: 'Quietly ask for the trout.',
              set: { 'q44-order': 'trout' },
              then: [
                { who: 'corky', text: 'Trout? On my birthday?', mood: 'sad' },
                { who: 'corky', text: 'No, it’s cool. It’s cool. You’ll want a bite of mine. Everybody always wants a bite of mine.', mood: 'soft' },
                { who: 'waiter', text: 'The kitchen has heard Mr Corky’s voice. The kitchen is frightened. It will be milk steak.' },
              ],
            },
          ],
        },
      },
      {
        id: 'q44-meal',
        goal: 'Finish the milk steak without leaving the table.',
        hint: 'Eat in small bites and sip water between them; if the queasy meter fills, you bolt for the door and start again.',
        check: 'minigame:eat:milk-steak',
        scene: {
          id: 'q44-order',
          lines: [
            { who: 'waiter', text: 'Tonight we have a lovely trout, a pear tart, and a soup of the—' },
            { who: 'corky', text: 'No. No. We’re having the milk steak.' },
            { who: 'waiter', text: 'Sir, we do not have a milk steak.', mood: 'think' },
            { who: 'corky', text: 'You do. Get a steak. Put it in milk. Boil it a long time, till it goes grey and gives up.' },
            { who: 'corky', text: 'And jelly beans on the side. Raw. Don’t cook ’em. Don’t let anyone touch ’em.', mood: 'happy' },
            { who: 'narrator', text: 'The waiter looks at you with a silent plea. You say nothing. He leaves.' },
            { who: 'narrator', text: 'Twenty minutes later, two grey slabs arrive, steaming, in a skin of milk. The jelly beans come in a gravy boat.' },
            { who: 'corky', text: 'Look at that. LOOK at that. That’s a meal. That’s a birthday.', mood: 'happy' },
            { who: 'narrator', text: 'Corky finishes his in four bites. Then he looks at your plate. Then at you.' },
            { who: 'corky', text: 'You gotta finish it. Leave food at a place like this and they never let you back.' },
          ],
          choices: [
            {
              id: 'q44-beans',
              label: 'Dip every bite in the jelly beans.',
              set: { 'q44-method': 'beans' },
              then: [
                { who: 'corky', text: 'You get it! Sweet and meaty! Meaty and sweet!', mood: 'happy' },
                { who: 'narrator', text: 'It is neither of those things.' },
              ],
            },
            {
              id: 'q44-nose',
              label: 'Hold your nose and swallow.',
              set: { 'q44-method': 'nose' },
              then: [
                { who: 'narrator', text: 'You hold your nose. It turns out the taste was never in your nose.' },
              ],
            },
            {
              id: 'q44-slip',
              label: 'Try to slip a piece onto Corky’s plate.',
              set: { 'q44-method': 'slip' },
              then: [
                { who: 'corky', text: 'Hey, no. That’s yours. That’s a gift. You don’t give back a gift.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q44-complete',
      lines: [
        { who: 'narrator', text: 'You finish. Every bite. Every bean. The waiter brings the bill on a plate, held at arm’s length.' },
        { who: 'corky', text: 'You did it! Nobody finishes! Dabney cried. Fitz finished, but he eats napkins.', mood: 'happy' },
        { who: 'corky', text: 'Best birthday ever. Thanks for coming, man. Nobody comes.', mood: 'soft' },
        { who: 'narrator', text: 'He pays in coins from a jam jar and wraps the leftovers in his sock tie.' },
        { who: 'corky', text: 'Take some for the little guys. Fills ’em right up. They hate it, but it fills ’em up.' },
        { who: 'narrator', text: 'Milk steak joins your items: a huge, grim meal that fills a Nubbin’s hunger completely. You keep the napkin bib.' },
      ],
    },
    rewards: [
      {
        id: 'q44-milk-steak',
        kind: 'item',
        label: 'Milk Steak',
        description: 'A grey steak boiled in milk. Fills a Nubbin’s hunger completely; it eats it with a visible shudder.',
      },
      {
        id: 'q44-napkin-bib',
        kind: 'cosmetic',
        label: 'Napkin Bib',
        description: 'A starched restaurant napkin, tucked in at the collar. Splattered.',
      },
    ],
    notes:
      'Lead: Corky. Corky’s order is in his own words (not the show’s). q44-order (milk / trout): the kitchen serves milk steak either way; q44-order-is-* and q44-method-is-* play before the complete scene, q44-outfit-is-* before the meal, q35-spirit-is-* after the drawing. Eating minigame: tap to bite, a queasy meter rises per bite and falls ' +
      'with water; full meter = run outside, retry. Feeding milk steak to a Nubbin plays a shudder then a contented full-belly idle; no harm, ' +
      'no stat penalty. Art: two grey steaks in milk skin, jelly beans in a gravy boat, Corky’s sock tie.',
  },

  // ------------------------------------------------------------------ Q45
  {
    id: 'q45',
    code: 'Q45',
    title: 'The Gang Goes Bowling',
    source: `${SHOW}: “The Gang Goes Bowling”`,
    audience: 'adult',
    trigger: {
      where: PUB,
      when: 'After Q31; a team of rival Keepers from Highbank walks in with a challenge.' + WHEN_SUFFIX,
    },
    requires: AFTER_Q31,
    speakers: [
      CORKY,
      DABNEY,
      MAGS,
      ROOK,
      FITZ,
      { id: 'pim', name: 'Pim Ashdown', kind: 'keeper' },
    ],
    steps: [
      {
        id: 'q45-practice',
        goal: 'Build a practice lane behind the pub and knock down all twelve pins in one roll.',
        hint: 'Lay flat planks in a line, stand the twelve pins at the end, and roll the melon gently with a slight curve.',
        check: 'minigame:bowling:strike',
        scene: {
          id: 'q45-challenge',
          lines: [
            { who: 'narrator', text: 'A team of Keepers from Highbank walks into the pub in matching shirts. Their captain slaps a challenge on the bar.' },
            { who: 'pim', text: 'Pim Ashdown, Highbank. We heard you lot think you can bowl. We think you can’t.' },
            { who: 'corky', text: 'We can bowl. We’re great at bowling. Dabney, what’s bowling?', mood: 'happy' },
            { who: 'dabney', text: 'Rolling a thing at some other things, Corky.' },
            { who: 'corky', text: 'We’re great at that!', mood: 'happy' },
            { who: 'fitz', text: 'What are we betting? Bet the pub. Put the pub on it.', mood: 'happy' },
            { who: 'dabney', text: 'You can’t bet the pub, Fitz.', mood: 'shock' },
            { who: 'fitz', text: 'I own the pub. I can bet what I like. I once bet a kidney. Not mine.' },
            { who: 'pim', text: 'Done. Your pub against our boat. Tomorrow. Twelve pins, and we bring the ball.' },
            { who: 'narrator', text: 'Their ball is a melon. Nobody questions this.' },
            { who: 'mags', text: 'Keeper, we need a lane. And practice. And possibly a different team.' },
          ],
          choices: [
            {
              id: 'q45-trash',
              label: 'Talk trash right back at Pim.',
              set: { 'q45-talk': 'trash' },
              then: [
                { who: 'corky', text: 'Ooooh! You hear that? They heard that!', mood: 'happy' },
                { who: 'pim', text: 'Cute. Bring a mop for afterwards.' },
              ],
            },
            {
              id: 'q45-polite',
              label: 'Shake Pim’s hand politely.',
              set: { 'q45-talk': 'polite' },
              then: [
                { who: 'rook', text: 'Don’t shake the hand! Never shake the hand! It’s a sign of weakness!', mood: 'angry' },
              ],
            },
          ],
        },
        done: {
          id: 'q45-practice-done',
          lines: [
            { who: 'narrator', text: 'On your fortieth try, every pin goes down. Corky, who was standing behind them, also goes down.' },
            { who: 'corky', text: 'Strike! And me! Two strikes!', mood: 'happy' },
            { who: 'dabney', text: 'By the way. Forty percent of the mittens. I want it in writing. On a beer mat.' },
            { who: 'fitz', text: 'Seventy-thirty. I’m the seventy. I’m also the thirty.' },
            { who: 'corky', text: 'I don’t know what any of those numbers mean, but I’m in.', mood: 'happy' },
          ],
        },
      },
      {
        id: 'q45-match',
        goal: 'Win the bowling match against Highbank.',
        hint: 'You bowl the last three frames; aim for the centre pin and let the melon curve. The trash talk is timed to put you off.',
        check: 'minigame:bowling:win:highbank',
        scene: {
          id: 'q45-lanes',
          lines: [
            { who: 'narrator', text: 'Match day. Half the Grove is behind the pub. The Highbank team warms up in silence, like professionals.' },
            { who: 'pim', text: 'Your shirts are stained.' },
            { who: 'dabney', text: 'They’re vintage. Like my contempt for you.', mood: 'happy' },
            { who: 'mags', text: 'You bowl like a cow trying to sit on a stool.' },
            { who: 'pim', text: 'Says the woman built like a heron on stilts.' },
            { who: 'mags', text: 'I am NOT a bird!', mood: 'angry' },
            { who: 'dabney', text: 'You’ve been a pelican, a flamingo and three herons this year. One of the herons was your idea.' },
            { who: 'mags', text: 'Who’s been COUNTING?', mood: 'shock' },
            { who: 'dabney', text: 'Everyone, Mags.' },
            { who: 'rook', text: 'Rook bowls first. Rook always bowls first. A kata before every roll, to scare them.' },
            { who: 'narrator', text: 'Rook does a kata. It takes four minutes. He rolls straight into the gutter.' },
            { who: 'corky', text: 'It’s on you and me, Keeper. If we lose, Fitz sells the pub, and I live in the pub.', mood: 'think' },
            { who: 'narrator', text: 'Between frames, you see Fitz press a fat bag of shells into Pim’s hand and wink.' },
            { who: 'fitz', text: 'It’s called a hedge. Rich people do it. Whoever wins, I win.', mood: 'happy' },
          ],
          choices: [
            {
              id: 'q45-expose',
              label: 'Tell the whole gang.',
              set: { 'q45-hedge': 'exposed' },
              then: [
                { who: 'dabney', text: 'You bet against us?', mood: 'angry' },
                { who: 'fitz', text: 'I bet against Rook. Everybody bets against Rook.' },
                { who: 'rook', text: 'That’s… fair, actually.', mood: 'sad' },
              ],
            },
            {
              id: 'q45-quiet',
              label: 'Say nothing. Win, and let him lose.',
              set: { 'q45-hedge': 'quiet' },
              then: [{ who: 'corky', text: 'Ooh, that’s mean. I love it. Roll it, Keeper.', mood: 'happy' }],
            },
            {
              id: 'q45-double',
              label: 'Tell Fitz to move his bet onto you.',
              set: { 'q45-hedge': 'doubled' },
              then: [
                { who: 'fitz', text: 'On you? I’ve watched you bowl forty times. I saw thirty-nine of them.', mood: 'think' },
                { who: 'narrator', text: 'He moves the bet anyway. He sweats through every frame that follows.' },
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q45-complete',
      lines: [
        { who: 'narrator', text: 'The melon curves, wobbles, and takes out all twelve pins in a spray of seeds.' },
        { who: 'corky', text: 'We won! We kept the pub! I still live in the pub!', mood: 'happy' },
        { who: 'pim', text: 'Rematch. Next season. Bring a real ball.', mood: 'angry' },
        {
          who: 'fitz',
          text: 'And we won a boat! Who wants a boat? I’m selling it. Tonight.',
          mood: 'happy',
        },
        {
          who: 'fitz',
          text: 'I hedged. I won the boat and lost half the bet. Down forty shells, up one boat I can’t sail.',
        },
        { who: 'fitz', text: 'That’s called a profit. In my head.' },
        { who: 'dabney', text: 'The lane stays. We’re bowlers now. It’s part of my brand.' },
        {
          who: 'narrator',
          text: 'Corky hands you a shirt with someone else’s name stitched on it. The lane stays behind the pub for anyone to play.',
        },
        {
          who: 'narrator',
          text: 'A bowling lane joins your decorations, playable any time, and a bowling shirt joins your wardrobe.',
        },
      ],
    },
    rewards: [
      {
        id: 'q45-lane',
        kind: 'decor',
        label: 'Bowling Lane',
        description: 'A plank lane with twelve wooden pins and a melon. Play it any time.',
      },
      {
        id: 'q45-shirt',
        kind: 'cosmetic',
        label: 'Bowling Shirt',
        description: 'A stained bowling shirt with someone else’s name on the pocket.',
      },
    ],
    notes:
      'Lead: Corky. Bowling minigame: aim line + curve, twelve pins in a triangle, the ball is a melon (seed splash on a strike). In the match ' +
      'the gang bowls automatically (badly) and the player bowls the last three frames; Pim’s trash talk pops up as barks during the ' +
      'run-up. The boat is flavour only; Fitz sells it off-screen. The pub is never actually at risk: losing just restarts the match. ' +
      'q45-hedge (exposed / quiet / doubled) picks q45-complete (quiet), q45-complete-exposed or q45-complete-doubled; q45-talk-is-* plays before the match.',
  },
];

export const CHECKS: string[] = [
  'deliver:dandelion-fluff:4',
  'photo:scene:nubbin-mittens-advert',
  'minigame:tool-relay:cellar-drain',
  'minigame:tool-relay:bins-goose',
  'use:item:fight-milk',
  'give:fight-milk:gang:3',
  'race:cheer:5',
  'minigame:catch:green-suit',
  'minigame:board-game:mind',
  'minigame:board-game:body',
  'minigame:board-game:spirit',
  'swim:chase:rum-ham:1',
  'swim:chase:rum-ham:2',
  'talk:gang:4',
  'minigame:cue:sun-keeper-lantern',
  'collect:evidence:bird-law:3',
  'minigame:trial:bird-law',
  'photo:stunt:roof-jump',
  'photo:stunt:fence',
  'photo:stunt:pond-dive',
  'build:waterslide',
  'minigame:unstick:waterslide',
  'karate:enter:tag-team',
  'karate:win:tag-team-feathers',
  'find:clue:pepe-silvia:3',
  'wait:gate:dawn',
  'photo:scene:lethal-weapon-5:chase',
  'photo:scene:lethal-weapon-5:explosion',
  'photo:scene:lethal-weapon-5:bridge',
  'visit:place:gilded-pear',
  'minigame:eat:milk-steak',
  'minigame:bowling:strike',
  'minigame:bowling:win:highbank',
];

// ------------------------------------------------------------------ Payoffs
// Every Sunny choice pays off inside the pack. Two kinds of scene live here:
//  * whole-scene variants, picked by QUESTS_SUNNY_VARIANT_FLAGS (`<scene>-<value>` replaces `<scene>`),
//    plus `q39-complete-poster`, which replaces q39-complete once Q35 is complete;
//  * short payoff scenes named `<flag>-is-<value>`, played before or after a step by QUESTS_SUNNY_PAYOFFS.
// They only read the pack's own q31–q45 flags; nothing here writes anything.

const ln = (who: string, text: string, mood?: Mood): Line => (mood ? { who, text, mood } : { who, text });
const pay = (id: string, ...lines: Line[]): Scene => ({ id, lines });

const PIM_ASKS = 'Pim leans over and asks you, very quietly, what it would cost for you to bowl badly.';
const REEL_CARD = 'The reel ends on a card: ALL STUNTS PERFORMED BY ROOK.';

/** Whole-scene variants and the short payoff scenes (see QUESTS_SUNNY_VARIANT_FLAGS and QUESTS_SUNNY_PAYOFFS). */
export const QUESTS_SUNNY_VARIANTS: Scene[] = [
  // Q31 → Q39: what you did with Rook in the mitten advert.
  pay(
    'q31-rook-is-cut',
    ln('rook', 'And nobody cuts me out this time. I watched the mitten advert. I’m one elbow.', 'angry'),
    ln('corky', 'It was a great elbow.', 'happy'),
  ),
  pay(
    'q31-rook-is-kept',
    ln('rook', 'You got my best side in the mitten advert. That’s why you’re behind the camera again.', 'happy'),
    ln('narrator', 'There is still no best side.'),
  ),
  pay(
    'q31-rook-is-wildcard',
    ln('rook', 'And no wildcards, Corky. Last time you wore the set.'),
    ln('corky', 'You can’t plan a wildcard, Rook. That’s the whole thing.', 'happy'),
  ),
  // Q31 → Q45: the seventy-thirty, once the Keeper explained it.
  {
    id: 'q45-practice-done-warned',
    lines: [
      ln('narrator', 'On your fortieth try, every pin goes down. Corky, who was standing behind them, also goes down.'),
      ln('corky', 'Strike! And me! Two strikes!', 'happy'),
      ln('dabney', 'By the way. Forty percent of the mittens. I want it in writing. On a beer mat.'),
      ln('corky', 'Thirty mittens, Fitz. The Keeper told me. I counted them twice.', 'happy'),
      ln('fitz', 'Stay out of my business, Keeper. Still.', 'angry'),
    ],
  },
  // Q32
  pay('q32-first-is-stick', ln('corky', 'Stick first. You didn’t even think about it. You’re a natural, and it scares me.', 'happy')),
  pay(
    'q32-first-is-plunger',
    ln('corky', 'Plunger first, in a cellar. Nobody’s ever done that. I’m gonna do it every time now.', 'think'),
    ln('narrator', 'He will not. The rats would never stand for it.'),
  ),
  pay(
    'q32-inspector-is-covered',
    ln('inspector', 'Your choir has gone quiet. I’ll note that as an improvement.'),
    ln('narrator', 'Upstairs, a single egg rolls slowly across the floorboards and stops.'),
  ),
  pay(
    'q32-inspector-is-told',
    ln('inspector', 'I’ve made my note about the eggs. It says “sad”. It is underlined.'),
    ln('dabney', 'You can’t underline sad!', 'angry'),
  ),
  pay(
    'q32-inspector-is-corky',
    ln('inspector', 'That man in the drain. Does he work here?', 'think'),
    ln('corky', 'Nobody works here.'),
    ln('inspector', 'He’s the only one who does.'),
  ),
  // Q33
  pay(
    'q33-drink-is-chug',
    ln('rook', 'Put the Keeper down as “chugged the lot”. That’s what a bodyguard looks like.', 'happy'),
    ln('narrator', 'You hiccup. It still tastes of eggs.'),
  ),
  pay('q33-drink-is-sip', ln('corky', 'One sip, and the Keeper’s eye is still going. That’s a strong sip. Put it on the box.', 'happy')),
  pay(
    'q33-drink-is-sniff',
    ln('rook', 'The Keeper sniffed it first. Smart bodyguard. Write that down, Corky.'),
    ln('corky', 'I still don’t write, man.'),
  ),
  pay('q33-dabney-is-flattered', ln('dabney', 'You said it was good for my skin, Keeper. My skin is now a colour.', 'angry')),
  pay('q33-dabney-is-dared', ln('dabney', 'For the record, I kept it down. Most of it. All of it went down at some point.', 'think')),
  pay('q33-label-is-honest', ln('narrator', 'The finished cartons read SIDE EFFECTS: EVERYONE. It is the most honest thing ever sold in the pub.')),
  pay('q33-label-is-spin', ln('narrator', 'The finished cartons read TESTED ON FIVE BRAVE ADULTS (AND ONE ACTRESS). Mags has signed every one.')),
  pay(
    'q33-label-is-crows',
    ln('narrator', 'The finished cartons read CONTAINS CROW EGGS. On the mill roof, the crows have gone very still.'),
    ln('corky', 'I told you. They can read.', 'shock'),
  ),
  // Q34
  pay('q34-cheer-is-runners', ln('announcer', 'The runners would like to thank whoever started that chant. Not the green one. The other one.')),
  pay(
    'q34-cheer-is-green',
    ln('narrator', 'Somebody at the back is selling green paper masks. You did this.'),
    ln('corky', 'You started a movement!', 'happy'),
  ),
  pay(
    'q34-lap-is-dragged',
    ln('corky', 'You dragged me off in front of my people.', 'sad'),
    ln('dabney', 'Your people are eating crisps, Corky.'),
  ),
  pay(
    'q34-lap-is-lap',
    ln('corky', 'One lap. One perfect lap. I’m gonna tell my grandchildren.', 'happy'),
    ln('dabney', 'You don’t have grandchildren.'),
    ln('corky', 'I’ll tell yours.'),
  ),
  // Q35 (Mind answer, before Body)
  pay('q35-answer-is-mags', ln('mags', 'For the record, I’m not the biggest disappointment. I’m the biggest talent. From a distance they look the same.', 'angry')),
  pay('q35-answer-is-dabney', ln('dabney', 'Still thinking about your Mind answer, Keeper. Still wrong. I wrote the rules out again to be sure.')),
  pay('q35-answer-is-board', ln('corky', 'I’m still upset you pointed at the board. It never did anything to you. It’s only ever been sticky.', 'sad')),
  // Q35 → Q44: what you gave at Spirit, remembered at the birthday dinner.
  pay('q35-spirit-is-truth', ln('corky', 'You told a real truth at Spirit. Nobody does that. That’s why I asked you.', 'soft')),
  pay('q35-spirit-is-lie', ln('corky', 'And you can tell me about the bear. On the boat. In the rain.', 'happy')),
  pay('q35-spirit-is-cry', ln('corky', 'And you cried at Spirit. Proper crying. You get it. That’s why I asked you.', 'soft')),
  // Q36
  pay(
    'q36-promise-is-true',
    ln('fitz', 'You promised me my ham, and there’s my ham. Wet, but mine. I’m moving you up the will.', 'happy'),
    ln('corky', 'Near the middle?'),
    ln('fitz', 'Near the bottom. But higher.'),
  ),
  pay(
    'q36-promise-is-false',
    ln('corky', 'The ham made its choice, Fitz. And it chose to come back.', 'soft'),
    ln('fitz', 'It chose a Nubbin shoving it.'),
  ),
  pay('q36-goose-is-raced', ln('narrator', 'Out on the water, the goose is still honking about the race. It lost by a nose and wants a rematch.')),
  pay(
    'q36-goose-is-egg',
    ln('fitz', 'That goose owes me an egg.', 'sad'),
    ln('narrator', 'On the far bank, the goose is sitting on Fitz’s egg. It plans to keep it.'),
  ),
  // Q37: the pep talk, on opening night (variants; the sung lines stay word for word).
  {
    id: 'q37-sun-keeper-rook',
    lines: [
      ln('narrator', 'The giant lantern blazes. Rook steps into the light with his shirt on, and a card round his neck: IT IS ME.'),
      ln('rook', 'SUN KEEPER! (hey! hey!)', 'happy'),
      ln('rook', 'Lighter of the lanterns! (hey! hey!)'),
      ln('rook', 'He’s got a giant lantern and abs you can see'),
      ln('narrator', 'Nobody can see them. Rook taps the card.'),
      ln('rook', 'He’ll punch the dark in the face for you and for me!', 'happy'),
    ],
  },
  {
    id: 'q37-finale-dabney',
    lines: [
      ln('dabney', 'You want to cross my bridge? Then you pay the bridge fee.', 'think'),
      ln('dabney', 'And what’s the fee? Whatever’s in your pockets.'),
      ln('dabney', 'And your boots.'),
      ln('dabney', 'And your dignity.', 'happy'),
      ln('narrator', 'Dabney bows. Then he bows again, because he is the real lead.'),
      ln('mags', 'I’m the princess and I’m meant to be the star'),
      ln('mags', 'So why am I just standing here holding a jar?', 'angry'),
      ln('everyone', 'Night Keeper, Sun Keeper, holding hands at last', 'happy'),
      ln('everyone', 'We spent the whole budget and the lanterns are gas—'),
      ln('dabney', 'Stop singing, Fitz.', 'angry'),
      ln('narrator', 'The crowd goes wild, mostly from relief. The open-air stage, Sun and Night capes, and the song on the jukebox are yours.'),
    ],
  },
  {
    id: 'q37-finale-mags',
    lines: [
      ln('dabney', 'You want to cross my bridge? Then you pay the bridge fee.', 'think'),
      ln('dabney', 'And what’s the fee? Whatever’s in your pockets.'),
      ln('dabney', 'And your boots.'),
      ln('dabney', 'And your dignity.', 'happy'),
      ln('mags', 'I’m the princess and I’m meant to be the star'),
      ln('mags', 'So why am I just standing here holding a jar?', 'angry'),
      ln('narrator', 'She raises the jar like a crown.'),
      ln('narrator', 'It is the emotional heart of the play. She has decided.'),
      ln('everyone', 'Night Keeper, Sun Keeper, holding hands at last', 'happy'),
      ln('everyone', 'We spent the whole budget and the lanterns are gas—'),
      ln('dabney', 'Stop singing, Fitz.', 'angry'),
      ln('narrator', 'The crowd goes wild, mostly from relief. The open-air stage, Sun and Night capes, and the song on the jukebox are yours.'),
    ],
  },
  // Q38
  pay('q38-plea-is-trust', ln('corky', 'Like I said. A well-fed bird is an honest bird. It’s law now. I scratched it into the bar.', 'happy')),
  pay(
    'q38-plea-is-maybe',
    ln('fitz', 'For the record, the Keeper said it might have done it. I’m ignoring that. I’m a merciful judge.'),
    ln('corky', 'Objection!', 'angry'),
    ln('fitz', 'To what?'),
    ln('corky', 'Habit.'),
  ),
  pay('q38-lead-is-trust', ln('fitz', 'That trust thing is swinging me. I trust the trust.', 'think')),
  pay(
    'q38-lead-is-glow',
    ln('dabney', 'I still say glowing proves nothing.', 'angry'),
    ln('narrator', 'Your Nubbin glows a little brighter. You suspect it is doing it on purpose.'),
  ),
  pay(
    'q38-lead-is-feather',
    ln('narrator', 'The goose keeps eyeing the feather on the bar. It would like it back.'),
    ln('corky', 'Evidence stays with the court, goose.'),
  ),
  // Q39
  pay(
    'q39-cart-is-moved',
    ln('corky', 'You tried to move the cart for me. Nobody moves the cart for me.', 'soft'),
    ln('rook', 'Because the cart was in the right place.'),
  ),
  pay('q39-cart-is-left', ln('corky', 'You didn’t even look at the cart. Cold. That’s real director stuff.', 'happy')),
  pay(
    'q39-credit-is-corky',
    ln('narrator', `${REEL_CARD} Underneath, in brackets you have to squint at: (Corky).`),
    ln('corky', 'Brackets!', 'happy'),
  ),
  pay('q39-credit-is-rook', ln('narrator', `${REEL_CARD} Corky watches it six times and claps every time.`)),
  // Q35 → Q39: Rook's poster confession, once Q35 is complete.
  {
    id: 'q39-complete-poster',
    lines: [
      ln('narrator', 'Corky goes off the jetty like a bag of laundry. Your Nubbin tows him back by the collar, rather proudly.'),
      ln('corky', 'I nailed it. Did I nail it? I can’t feel my face.', 'happy'),
      ln('rook', 'That’s a wrap on Project Badass. Every stunt done by me. In spirit.', 'happy'),
      ln('narrator', 'Rook tears the sleeves off his karate gi so he can “breathe on camera”, and hands you the spare.'),
      ln('rook', 'And learn the pose. Every fighter needs a pose. This is the one I do before I don’t fight.'),
      ln('rook', 'It’s from the poster. I’ve never told anyone that.', 'soft'),
      ln('corky', 'You told everyone, Rook. You cried on the board.'),
      ln('rook', '…It’s still a good poster.', 'sad'),
      ln('narrator', 'A sleeveless karate gi joins your wardrobe, and your Nubbins can strike a pose before every karate bout.'),
    ],
  },
  // Q40
  pay('q40-tube-is-yours', ln('mags', 'And for the record, the tube was my idea. The Keeper just said it first. Out loud. Near me.')),
  pay(
    'q40-tube-is-hers',
    ln('dabney', 'The Keeper said leave it open, so people could get out. I wrote that down. I’ll read it at the inquiry.'),
    ln('mags', 'There’s no inquiry!', 'angry'),
  ),
  pay('q40-rescue-is-push', ln('fitz', 'Somebody pushed me through a tube by my sandwich. I won’t forget it.', 'angry')),
  pay(
    'q40-rescue-is-pull',
    ln('fitz', 'Somebody pulled my leg first. Thought it was Mags’s. It’s my good leg.'),
    ln('mags', 'You don’t have a good leg.', 'angry'),
  ),
  pay('q40-tickets-is-refund', ln('narrator', 'The refunded queue rides anyway, for nothing, and says thank you. Dabney finds this physically painful.')),
  pay('q40-tickets-is-honour', ln('dabney', 'Not one complaint. A scam with no victims. Is that just a shop?', 'think')),
  pay('q40-tickets-is-cut', ln('corky', 'Don’t spend your shell yet. It might be the last one.', 'think')),
  // Q41
  pay('q41-entrance-is-bin', ln('narrator', 'You still smell of the bin. Somewhere in the crowd, a chant starts: “Trash Pal! Trash Pal!”')),
  pay('q41-entrance-is-steps', ln('fitz', 'Partner who uses steps! At least try to smell like a bin. Roll in something.', 'angry')),
  // Q41 → Q45: the thrown-bout offer, when Pim tries the same.
  pay('q41-deal-is-refused', ln('narrator', PIM_ASKS), ln('dabney', 'Don’t bother bribing the Keeper, Pim. I tried. It was humiliating.')),
  pay(
    'q41-deal-is-double-crossed',
    ln('narrator', PIM_ASKS),
    ln('dabney', 'Don’t make deals with the Keeper, Pim. The Keeper takes them, then wins anyway.'),
  ),
  pay('q41-deal-is-told', ln('narrator', PIM_ASKS), ln('fitz', 'And nobody offer the Keeper a split. The Keeper tells.', 'angry')),
  // Q42
  pay('q42-believe-is-true', ln('corky', 'You believed me. Even when it was mad. I’m putting you on the wall. With the good string.', 'soft')),
  pay(
    'q42-believe-is-false',
    ln('corky', 'You asked when I last slept. It was Tuesday. I’m gonna sleep now. Right here. In the hedge.'),
    ln('narrator', 'He does. Your Nubbin covers him with a leaf.'),
  ),
  // Q43
  pay('q43-extras-is-back', ln('fitz', 'The extras were too far back. You can’t see them. They’re dots. Very safe dots.')),
  pay('q43-extras-is-cheering', ln('narrator', 'The Nubbin extras cheer every take, including the ones where Rook falls over. Those most of all.')),
  pay(
    'q43-mags-is-line',
    ln('mags', 'I said my line. Most of it. It’s going on my reel.', 'happy'),
    ln('rook', 'You don’t have a reel.'),
    ln('mags', 'I do now. It’s ten words long.', 'happy'),
  ),
  pay(
    'q43-mags-is-dead',
    ln('fitz', 'Best corpse I’ve ever worked with, and I’ve worked with a lot of corpses.'),
    ln('mags', 'Thank you!', 'happy'),
    ln('dabney', 'Don’t ask him, Keeper.'),
  ),
  // Q44
  pay(
    'q44-outfit-is-smart',
    ln('waiter', 'May I say, you are the best-dressed guest Mr Corky has ever brought.'),
    ln('corky', 'I’ve never brought anyone.', 'happy'),
    ln('waiter', 'I know, sir.', 'soft'),
  ),
  pay('q44-outfit-is-sock', ln('waiter', 'Two sock ties. At one table. I will be telling my wife about this.', 'shock')),
  pay('q44-order-is-milk', ln('corky', 'You ordered what I ordered. On purpose. I saw you.', 'soft')),
  pay('q44-order-is-trout', ln('waiter', '(quietly) The trout will be here next year. So will I. Courage.')),
  pay('q44-method-is-beans', ln('corky', 'You used the beans. You’re a bean person now. There’s no going back.', 'happy')),
  pay('q44-method-is-nose', ln('narrator', 'You let go of your nose. That was also a mistake.')),
  pay('q44-method-is-slip', ln('narrator', 'The piece you slipped onto Corky’s plate is back on yours. He has been guarding it like a gift.')),
  // Q45
  pay('q45-talk-is-trash', ln('pim', 'Still bringing a mop, by the way. For afterwards. For you.')),
  pay(
    'q45-talk-is-polite',
    ln('pim', 'Firm handshake yesterday. I respected it. I’m still going to crush you.'),
    ln('rook', 'See? Weakness. He can smell it.', 'angry'),
  ),
  {
    id: 'q45-complete-exposed',
    lines: [
      ln('narrator', 'The melon curves, wobbles, and takes out all twelve pins in a spray of seeds.'),
      ln('corky', 'We won! We kept the pub! I still live in the pub!', 'happy'),
      ln('pim', 'Rematch. Next season. Bring a real ball.', 'angry'),
      ln('fitz', 'And we won a boat! Who wants a boat? I’m selling it. Tonight.', 'happy'),
      ln('fitz', 'I hedged, the Keeper told everyone, and I still lost half.', 'sad'),
      ln('fitz', 'Honesty costs forty shells. Nobody warned me.'),
      ln('dabney', 'The lane stays. We’re bowlers now. It’s part of my brand.'),
      ln('narrator', 'Corky hands you a shirt with someone else’s name stitched on it. The lane stays behind the pub for anyone to play.'),
      ln('narrator', 'A bowling lane joins your decorations, playable any time, and a bowling shirt joins your wardrobe.'),
    ],
  },
  {
    id: 'q45-complete-doubled',
    lines: [
      ln('narrator', 'The melon curves, wobbles, and takes out all twelve pins in a spray of seeds.'),
      ln('corky', 'We won! We kept the pub! I still live in the pub!', 'happy'),
      ln('pim', 'Rematch. Next season. Bring a real ball.', 'angry'),
      ln('fitz', 'And we won a boat! Who wants a boat? I’m selling it. Tonight.', 'happy'),
      ln('fitz', 'I moved the lot onto the Keeper. Up forty shells and a boat I can’t sail.', 'shock'),
      ln('fitz', 'First time I’ve ever backed a winner. I feel sick.'),
      ln('dabney', 'The lane stays. We’re bowlers now. It’s part of my brand.'),
      ln('narrator', 'Corky hands you a shirt with someone else’s name stitched on it. The lane stays behind the pub for anyone to play.'),
      ln('narrator', 'A bowling lane joins your decorations, playable any time, and a bowling shirt joins your wardrobe.'),
    ],
  },
];

/**
 * Whole-scene variants: when the flag is set and a variant `<scene>-<value>` exists in
 * QUESTS_SUNNY_VARIANTS, it replaces `<scene>`; otherwise the base scene plays.
 * (q45-practice-done's base is the 'stayed-out' reading; q45-complete's is 'quiet'.)
 */
export const QUESTS_SUNNY_VARIANT_FLAGS: Record<string, string> = {
  'q37-sun-keeper': 'q37-calm',
  'q37-finale': 'q37-calm',
  'q45-practice-done': 'q31-deal',
  'q45-complete': 'q45-hedge',
};

/**
 * Short payoff scenes, per quest: before or after step `i` (`i` = steps.length means the
 * complete scene), play `<flag>-is-<value>` for each listed flag that is set, in order.
 * Booleans read as 'true' / 'false'.
 */
export const QUESTS_SUNNY_PAYOFFS: Record<
  string,
  { before?: Record<number, string[]>; after?: Record<number, string[]> }
> = {
  q32: { before: { 2: ['q32-first', 'q32-inspector'] } },
  q33: { before: { 2: ['q33-drink', 'q33-dabney', 'q33-label'] } },
  q34: { before: { 2: ['q34-cheer', 'q34-lap'] } },
  q35: { before: { 1: ['q35-answer'] } },
  q36: { before: { 2: ['q36-promise', 'q36-goose'] } },
  q38: { before: { 2: ['q38-plea', 'q38-lead'] } },
  q39: { after: { 0: ['q31-rook'], 3: ['q39-credit'] }, before: { 1: ['q39-cart'] } },
  q40: { before: { 2: ['q40-tube', 'q40-rescue', 'q40-tickets'] } },
  q41: { before: { 1: ['q41-entrance'] } },
  q42: { after: { 2: ['q42-believe'] } },
  q43: { after: { 3: ['q43-extras', 'q43-mags'] } },
  q44: { after: { 0: ['q35-spirit'] }, before: { 1: ['q44-outfit'], 2: ['q44-order', 'q44-method'] } },
  q45: { after: { 0: ['q41-deal'] }, before: { 1: ['q45-talk'] } },
};

/** Every flag the Sunny choices set. */
export const QUESTS_SUNNY_FLAGS: string[] = [
  'q31-rook',
  'q31-deal',
  'q32-first',
  'q32-inspector',
  'q33-drink',
  'q33-dabney',
  'q33-label',
  'q34-cheer',
  'q34-lap',
  'q35-answer',
  'q35-spirit',
  'q36-promise',
  'q36-goose',
  'q37-calm',
  'q38-plea',
  'q38-lead',
  'q39-cart',
  'q39-credit',
  'q40-tube',
  'q40-rescue',
  'q40-tickets',
  'q41-entrance',
  'q41-deal',
  'q42-believe',
  'q43-extras',
  'q43-mags',
  'q44-outfit',
  'q44-order',
  'q44-method',
  'q45-talk',
  'q45-hedge',
];
