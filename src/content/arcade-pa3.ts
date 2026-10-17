/**
 * Pixel's Arcade, cartridge PA3: The Hollow Kingdom. Eighteen quests, PA3-1 to PA3-18.
 *
 * SOURCE. Hollow Knight (Team Cherry, Adelaide, Australia; released 24 February 2017). The game,
 * its world, its characters and its designs are © Team Cherry. A commercial build needs Team
 * Cherry's licence; without one, rename everything and keep only the shape of the story. Nothing
 * is used from Hollow Knight: Silksong (2025), Hornet's own game. No music, no sound, no sprites:
 * the cartridge is drawn in our own pixel style, and every name stays in-world only.
 *
 * AUDIENCE. 'all' (the main game; the outline says no Learning Grove version because of the
 * licence). The three lifted lines still carry `childLines` replacements, as the brief requires
 * for every quote in an `all` quest.
 *
 * FRAME. Pixel's Arcade (canon 29): the cabinet Pixel rescued from the Workyard skip lives in the
 * lantern shed. A cartridge with a pale horned mask on the label, from a box marked "too sad,
 * keep". You and your Nubbin step through to Dirtmouth; Pixel (she/her) stays at the controls as
 * player two and talks to you through the speaker. You are a traveller, never the Knight. The
 * Knight is small, silent and horned and never speaks (no speaker entry: narration only). It
 * fights husks and beasts with its nail; you never fight. You carry a lantern, open grub jars,
 * carry the Delicate Flower and sit on benches. Your Nubbin hears grubs crying before anyone, and
 * is the first thing in Hallownest to make the Knight tilt its head (PA3-1). Nubbins don't speak.
 * Hallownest's bugs talk, as the source's do (canon 31); the Grubfather does not (he sobs).
 *
 * THE TWELVE GRUBS. Twelve glass jars at set places on your road, each found once and never
 * again (no respawns, no timers): collect:pa3-grub:01 … :12. They are step checks in PA3-2, 4, 5,
 * 6, 7, 8, 9, 10, 11, 12, 14 and 15. Grubs 1–11 hug the Knight and burrow home. Grub 12 (PA3-15)
 * is too tired to burrow, so you carry it home in its open jar, and that jar becomes the grub-jar
 * lantern reward in PA3-17.
 *
 * GROVE FLAGS READ (read-only; the cartridge never writes a Grove flag):
 *   - s21Done (S21, Clank). If set, Clank sits on top of the cabinet. PA3_VARIANTS
 *     'pa3-01-clank' plays straight after pa3-01-cabinet; 'pa3-07-clank' after pa3-07-plaque
 *     (he goes very quiet at the word "vessel"); 'pa3-13-clank' after pa3-13-memory. If s21Done
 *     is not set, none of them play and nothing else changes. No other flag is read.
 *
 * FLAGS WRITTEN (Arcade save only, all prefixed pa3-):
 *   - pa3-01 … pa3-18: each quest on completion. pa3-done: the whole cartridge (PA3-18); High
 *     Score Night counts it towards its two-cartridge unlock.
 *   - pa3-hornet = back | stood (PA3-4, pa3-04-hornet, the signature choice). Pays off in PA3-11,
 *     PA3-15 and PA3-18.
 *   - pa3-quirrel = sat | passed (PA3-5, pa3-05-bench). Lengthens PA3-16.
 *   - pa3-abyss = waited | hurried (PA3-14, pa3-14-lighthouse). waited = the Void Heart. Pays
 *     off four quests later, in PA3-18.
 *   - pa3-ending = home | late | sealed (PA3-18, set by the sim from the two flags above):
 *       waited + back → home; waited + stood → late; hurried (either Hornet) → sealed.
 *
 * LIFTED TEXT (copyrighted; three one-sentence lines, exactly the outline's three, each used
 * once, each with a childLines replacement). Source given by the outline: the 2017 English
 * script as transcribed on the Hollow Knight wiki. CHECK EACH AGAINST THE GAME BEFORE SHIP.
 *   1. Hornet, Greenpath: "Come no closer, ghost." pa3-04-hornet#3.
 *   2. The memorial plaque, read aloud by Pixel: "Through its sacrifice Hallownest lasts
 *      eternal." pa3-07-plaque#6.
 *   3. The Pale King, in the White Palace memory: "No cost too great." pa3-13-memory#5.
 * Every other line is new. The husks' and Dreamers' dream-words are ours, not the game's.
 * No song, no lyric, no hummed tune.
 *
 * CARE NOTES.
 *   - The Dreamers. In the game the Knight kills them in their dreams. Here the Dream Nail lets
 *     each one wake and go to their rest, gently, like a warden fading. You sit with each first.
 *   - Herrah is Hornet's mother. Hornet's grief is short, private and never comic (PA3-11).
 *   - Combat. The Knight fights; the camera stays on you and your lantern. Husks are victims of
 *     the plague: they fall, lie quiet, and the orange light leaves their eyes. No gore, no
 *     splats, no deaths shown. Hornet is bested, never hurt; she always leaves on her own feet.
 *   - The siblings' ending is a homecoming into the dark they came from, not a death on screen.
 *     The sealed ending is sad but replayable, and nobody is forgotten: the plaque stays.
 *   - The Grubfather swallowing the grubs is how grubs grow up (PA3-17). Play it for joy; say
 *     plainly that they're fine.
 *   - Pixel is the comic relief, dry and procedural ("Ruling: …"), and goes quiet at the grave
 *     turns. She never makes a joke inside a grave beat.
 *   - All ages, with care. The game's own ratings sit around ten-plus; our softening keeps it all.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

/** Narrator line. */
const n = (text: string): Line => ({ who: 'narrator', text });
/** Spoken line, with an optional portrait mood. */
const l = (who: string, text: string, mood?: Mood): Line => (mood ? { who, text, mood } : { who, text });
/** Pixel, at the controls, through the cabinet's speaker. */
const px = (text: string, mood?: Mood): Line => l('pixel', text, mood);
/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade)';
const after = (code: string) => `Any time after ${code}, from Pixel’s cabinet in the lantern shed.`;
const GAME = 'Hollow Knight (Team Cherry, 2017)';
const src = (part: string) => `${GAME}: ${part}`;

// ------------------------------------------------------------------ speakers

const ELDERBUG = sp('pa3-elderbug', 'Elderbug', `Elderbug, the last townsfolk of Dirtmouth (${GAME})`);
const HORNET = sp('pa3-hornet', 'Hornet', `Hornet, protector of Hallownest (${GAME}); nothing from Silksong`);
const QUIRREL = sp('pa3-quirrel', 'Quirrel', `Quirrel, the wandering scholar (${GAME})`);
const MANTIS = sp('pa3-mantis', 'Mantis Lord', `The eldest of the three Mantis Lords (${GAME})`);
const SEER = sp('pa3-seer', 'The Seer', `The Seer, last of the moth tribe (${GAME})`);
const HUSK = sp('pa3-husk', 'A husk’s dream', `The dream-thoughts of the infected husks (${GAME}); new words`);
const MOURNER = sp('pa3-mourner', 'The Grey Mourner', `The Grey Mourner (${GAME})`);
const LURIEN = sp('pa3-lurien', 'Lurien', `Lurien the Watcher, a Dreamer (${GAME})`);
const MONOMON = sp('pa3-monomon', 'Monomon', `Monomon the Teacher, a Dreamer (${GAME})`);
const HERRAH = sp('pa3-herrah', 'Herrah', `Herrah the Beast, a Dreamer, Hornet’s mother (${GAME})`);
const LADY = sp('pa3-lady', 'The White Lady', `The White Lady, the Pale King’s queen (${GAME})`);
const KING = sp('pa3-king', 'The Pale King', `The Pale King, in a memory (${GAME})`);
const CLANK: Speaker = {
  id: 'clank',
  name: 'Clank',
  kind: 'other',
  basedOn: 'Claptrap, the CL4P-TP unit (Borderlands), reference only; the Grove’s own Clank from S21',
};

// =================================================================== PA3

export const ARCADE_PA3: Quest[] = [
  // ---------------------------------------------------------------- PA3-1
  {
    id: 'pa3-01',
    code: 'PA3-1',
    title: 'The Cabinet',
    source: src('the opening, Dirtmouth and the well'),
    audience: 'all',
    trigger: { where: WHERE, when: 'After chapter 5, once the cabinet runs in the lantern shed. Any time after that.' },
    speakers: [ELDERBUG, CLANK],
    steps: [
      {
        id: 'pa3-01-s1',
        goal: 'See what Pixel found in the bottom of the cartridge box.',
        hint: 'Pixel is at the cabinet in the lantern shed. The box is on the floor by her boots.',
        check: 'inspect:pa3-cartridge:lantern-shed',
        scene: {
          id: 'pa3-01-cabinet',
          lines: [
            n('The lantern shed smells of sawdust and warm dust. The cabinet hums like a fridge that’s thinking.'),
            px('Found another box of cartridges in the cabinet’s belly. Under the mouse nest. The mice have moved out. Mostly.'),
            px('This one was on its own, in a box inside the box. Someone wrote on the lid.'),
            n('She holds it up. In pencil, in a hand neither of you knows: “too sad, keep”.'),
            px('Not “too sad, bin”. Not “too sad, sell”. Keep.', 'think'),
            n('The label shows a pale mask with two horns, on a lot of black.'),
            px('No title. Just the mask. Ruling: that’s either very good or very sad.'),
            px('Probably both. The best ones are usually both.', 'soft'),
            px('You go in. I’ll be player two. I’ve got the map, the speaker and a biscuit.'),
          ],
          choices: [
            {
              id: 'ready',
              label: 'Put it in.',
              then: [px('Putting it in. Blowing on it first. That’s not superstition, it’s maintenance.')],
            },
            {
              id: 'sad',
              label: 'How sad is “too sad”?',
              then: [
                px('Don’t know. Somebody thought it was worth keeping anyway. That’s a review, in a way.', 'think'),
                px('If it’s too much, you come out. The door’s always open from my side.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa3-01-cabinet-done',
          lines: [
            n('The screen goes black, then grey, then it’s raining on you.'),
            px('Can you hear me? You’re very small. That’s the screen. You’re normal-sized. Probably.'),
          ],
        },
      },
      {
        id: 'pa3-01-s2',
        goal: 'Look round Dirtmouth, and follow the small horned traveller.',
        hint: 'Elderbug is on the bench by the lamp. The traveller is heading for the well in the middle of town.',
        check: 'climb:pa3-well:dirtmouth',
        scene: {
          id: 'pa3-01-dirtmouth',
          lines: [
            n('A cold road at dusk. Rain on dark roofs, most of them empty, and a lamp that’s doing its best.'),
            n('On a bench under the lamp sits an old bug, round as a teapot, who lights up at the sight of you.'),
            l('pa3-elderbug', 'Oh! A traveller! And a little one with you. Come in out of the road. Well, there’s no in. Come under the lamp.', 'happy'),
            l('pa3-elderbug', 'Everyone’s gone down the well, you see. The town’s just me now. Me and the bench.'),
            l('pa3-elderbug', 'They hear there’s a kingdom down there, and something calling. Down they go. Up nobody comes.', 'sad'),
            n('Past the lamp walks someone very small: a pale horned mask, a dark cloak, a nail at its side.'),
            n('It doesn’t look at Elderbug, or at you. It’s walking the way water runs downhill.'),
            n('Then your Nubbin waddles out into the rain in front of it, and looks up.'),
            n('The small traveller stops. Slowly, it tilts its head.'),
            l('pa3-elderbug', 'Well. I’ve never seen it do that.', 'shock'),
            n('It tilts its head back the other way. Then it walks on to the well and drops in without a sound.'),
            px('That’s the Knight. Don’t ask me how I know. It’s on the box. It’s also the only one moving with purpose.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Sit with Elderbug a moment first.',
              then: [
                n('You sit on the cold bench. Elderbug talks about the weather, which is rain, and has been for years.'),
                l('pa3-elderbug', 'Thank you. You go on down now. Come back up and tell me what you saw.', 'soft'),
              ],
            },
            {
              id: 'follow',
              label: 'Follow the Knight before you lose it.',
              then: [l('pa3-elderbug', 'Mind the drop! And come back up, if you can. Hardly anybody does. I’d like one who does.')],
            },
          ],
        },
        done: {
          id: 'pa3-01-dirtmouth-done',
          lines: [
            n('There’s a rope down the side of the well. You climb; your Nubbin rides on your shoulder and holds the lantern.'),
            px('Climbing. Rope’s good. I mean, it’s pixels. But they’re good pixels.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-01-complete',
      lines: [
        n('At the bottom of the well, a cave the colour of old blue ink, and the Knight, waiting.'),
        n('It isn’t waiting for you; it’s waiting for its eyes to get used to the dark. Then it walks on.'),
        n('Your Nubbin goes after it, then looks back, to make sure you’re coming.'),
        px('Ruling: we’re a party now. Nobody asked the Knight. That’s how parties work.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-01': true },
    notes:
      'CLANK: if s21Done, play PA3_VARIANTS pa3-01-clank straight after pa3-01-cabinet (before its choices). ' +
      'The cartridge has its own save in the Arcade save; it never writes a Grove flag. The Knight never speaks ' +
      'and has no portrait in the dialogue box. The head-tilt is the Knight’s first animation that isn’t walking: ' +
      'give it two frames each way. Pixel is heard through the speaker only (her portrait shows in a small cabinet-bezel frame).',
  },

  // ---------------------------------------------------------------- PA3-2
  {
    id: 'pa3-02',
    code: 'PA3-2',
    title: 'The Crossroads',
    source: src('the Forgotten Crossroads, the husks and the first grub'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-1') },
    requires: ['PA3-1'],
    speakers: [],
    steps: [
      {
        id: 'pa3-02-s1',
        goal: 'Get through the Forgotten Crossroads behind the Knight.',
        hint: 'Keep your lantern up and stay a few steps back. The Knight clears the way; you don’t fight.',
        check: 'walk:pa3-crossroads:behind-knight',
        scene: {
          id: 'pa3-02-crossroads',
          lines: [
            n('Old roads, carved through stone, with signposts nobody has read in a long time.'),
            n('Bugs walk them. They walk the way people walk to work when they’ve forgotten what work is.'),
            n('Their eyes glow orange, the colour of a sunset seen through a sick window.'),
            px('Those are husks. They used to be the townsfolk, before the plague got into them.', 'sad'),
            px('The light talks to them. In their sleep. Then they stop waking up properly.'),
            n('One turns towards you. The Knight is between you before you see it move.'),
            n('A swing of the nail, quick and clean. The husk sits down, then lies down, and the orange goes out of its eyes.'),
            n('It looks, now, like a bug asleep on a road. Which is all it ever wanted.'),
            px('The Knight does the fighting. You hold the lantern. That’s the deal. I didn’t write it, but I’d sign it.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay back. Lantern up.',
              then: [n('You stay three steps back and keep the light steady. The Knight doesn’t look round, but it doesn’t go faster either.')],
            },
            {
              id: 'cover',
              label: 'Put your cloak over the husk that fell.',
              then: [
                n('You lay a corner of your cloak over its face. The Knight watches you do it, head on one side.'),
                px('…Yeah. Good. Do that.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'pa3-02-crossroads-done',
          lines: [
            n('A crossroads with a fountain gone dry. The Knight stops, and so do you.'),
            n('Your Nubbin’s ears go up. Somewhere close, something small is crying.'),
          ],
        },
      },
      {
        id: 'pa3-02-s2',
        goal: 'Find what’s crying, and let it out.',
        hint: 'Follow your Nubbin. It can hear the crying better than you can.',
        check: 'collect:pa3-grub:01',
        scene: {
          id: 'pa3-02-grub',
          lines: [
            n('Your Nubbin trots off down a side tunnel, stopping every few steps to listen.'),
            n('In a niche in the wall: a glass jar, corked. Inside, a fat pale grub, crying its heart out.'),
            px('Oh no. Oh, that’s a grub. In a jar. Who puts a grub in a jar?', 'shock'),
            px('Somebody who collects them, I suppose. There’s always somebody.', 'angry'),
            n('The Knight comes up behind you and looks at the jar for a long moment.'),
            n('Your Nubbin puts both hands flat on the glass. The grub stops crying, just for a second, to look.'),
          ],
          choices: [
            {
              id: 'cork',
              label: 'Ease the cork out.',
              then: [n('It comes out with a soft pop. The grub wriggles over the rim like toothpaste with ambitions.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin do it.',
              then: [n('Your Nubbin hugs the jar, leans back, and pulls. The cork and the Nubbin both come out of it suddenly.')],
            },
          ],
        },
        done: {
          id: 'pa3-02-grub-done',
          lines: [
            n('The grub flops out, goes straight to the Knight and hugs its leg as hard as a grub can hug.'),
            n('The Knight stands very still, the way you do when a cat sits on you. Then the grub burrows into the floor and is gone.'),
            px('It went home. Grubs know the way home. They just can’t get out of jars.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-02-complete',
      lines: [
        n('The tunnel is quiet. Then, a long way off, more crying, and more than one voice.'),
        px('There’s more. I can hear them through the speaker. Lots more.'),
        n('Your Nubbin is already walking towards it. The Knight, after a moment, follows your Nubbin.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-02': true },
    notes:
      'GRUB 1 of 12. Each grub jar is a set place, found once, never again. A husk that falls lies still with its eyes ' +
      'dark; leave it there, curled like a sleeper. No hit flashes on screen bigger than a white blink, no splats.',
  },

  // ---------------------------------------------------------------- PA3-3
  {
    id: 'pa3-03',
    code: 'PA3-3',
    title: 'The Grubfather',
    source: src('the Grubfather and his forty-six grubs'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-2') },
    requires: ['PA3-2'],
    speakers: [],
    steps: [
      {
        id: 'pa3-03-s1',
        goal: 'Follow the crying to wherever it’s coming from.',
        hint: 'Your Nubbin knows the way. Go where its ears point.',
        check: 'find:pa3-grubfather:grub-cavern',
        scene: {
          id: 'pa3-03-cavern',
          lines: [
            n('The tunnel opens into a cavern full of little houses, round and pale, like eggs set into the walls.'),
            n('Every one is empty. Every one has a tiny doorway, and nobody in it.'),
            n('In the middle, filling the floor, lies a grub the size of a haystack, and he is sobbing.'),
            px('Oh. That’s… that’s their dad. That’s the Grubfather.', 'sad'),
            n('He sobs in great slow heaves, like a bellows. The houses shake a little each time.'),
            n('Then the grub you freed pops up out of the floor, beside him, and he stops mid-sob.'),
            n('He looks at it, then at you. He makes a sound like a kettle that’s been told good news.'),
            n('Then he starts sobbing again, but differently. Hopefully.'),
          ],
        },
        done: {
          id: 'pa3-03-cavern-done',
          lines: [
            n('Your Nubbin climbs up onto his side and pats him. He is so soft that it sinks in up to its elbows.'),
            px('Count the houses. I’ll count from up here. I’ve got a pencil.'),
          ],
        },
      },
      {
        id: 'pa3-03-s2',
        goal: 'Make the Grubfather a promise you can keep.',
        hint: 'Pixel has counted. Listen to her number before you promise.',
        check: 'choose:pa3-promise:grub-cavern',
        scene: {
          id: 'pa3-03-promise',
          lines: [
            px('Forty-six houses. Forty-six grubs. One’s back. Forty-five out there, in jars.'),
            px('I’ve checked the map. Twelve of them are on the road we’re taking. The rest are in places we’re not going.', 'think'),
            px('Ruling: we don’t promise forty-five. We promise twelve. Twelve is a number you can carry.'),
            n('The Grubfather looks at you with eyes like two wet buttons.'),
            n('The Knight stands at the cavern mouth with its back to you all. It doesn’t leave, though.'),
            px('And somebody else gets the other thirty-three. Somebody always comes. We came.', 'soft'),
          ],
          choices: [
            {
              id: 'twelve',
              label: '“Twelve. I promise you twelve.”',
              then: [n('He heaves a sigh so large your hair moves. Then he rolls over a little, to make room for twelve.')],
            },
            {
              id: 'every',
              label: '“Every one I can find.”',
              then: [
                px('That’s twelve. I’ve looked. But it’s a nicer way to say it.', 'soft'),
                n('He seems to like it. He rolls over a little, to make room.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-03-complete',
      lines: [
        n('You leave the cavern with a promise and a count. Pixel writes the count in pencil on the cabinet’s side.'),
        px('One down. Eleven to go. I’m drawing a little jar for each one. Badly.'),
        n('The Knight is already walking. It stops at the next turning, and waits, without looking round.'),
        px('Ruling: it waited. I’m writing that down too.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-03': true },
    notes:
      'The Grubfather never speaks; he sobs, sighs and kettles. Show the grub count (1/12) in the journal from here. ' +
      'Pixel’s pencilled jars on the cabinet side are a small screen-corner tally (art: twelve outlines that fill in).',
  },

  // ---------------------------------------------------------------- PA3-4
  {
    id: 'pa3-04',
    code: 'PA3-4',
    title: 'Greenpath',
    source: src('Greenpath, and Hornet’s first warning'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-3') },
    requires: ['PA3-3'],
    speakers: [HORNET],
    steps: [
      {
        id: 'pa3-04-s1',
        goal: 'Cross Greenpath, and find the second grub.',
        hint: 'Stay on the moss. The green water bites.',
        check: 'collect:pa3-grub:02',
        scene: {
          id: 'pa3-04-greenpath',
          lines: [
            n('Moss on everything. Light comes down through it in green threads, as if the cave were underwater.'),
            n('Between the ledges lies water that glows a sour green. A leaf drops on it and fizzes.'),
            px('Acid. Don’t touch it. Don’t let the Nubbin touch it. Don’t let the Nubbin look at it like that.'),
            n('Your Nubbin looks at it like that.'),
            n('The Knight crosses on a run of ledges, quick as a skimmed stone. You go slowly, on the moss.'),
            n('Half-way across, your Nubbin stops dead. Crying, above you, behind a curtain of hanging moss.'),
            n('The jar sits on a ledge too high for you. The Knight looks at it, then at your Nubbin, and crouches.'),
            n('Your Nubbin climbs onto the Knight’s back, up onto its mask, and reaches. The Knight allows this.'),
          ],
        },
        done: {
          id: 'pa3-04-greenpath-done',
          lines: [
            n('Pop. The grub hugs the Knight’s horn, which is the only part it can reach, and burrows into the moss.'),
            px('Two. And the Knight let the Nubbin stand on its face. I need a minute.', 'happy'),
          ],
        },
      },
      {
        id: 'pa3-04-s2',
        goal: 'Decide what to do when someone on the ledge tells you to stop.',
        hint: 'There’s no wrong answer here, only a different road. Hornet will remember either way.',
        check: 'choose:pa3-hornet:greenpath',
        scene: {
          id: 'pa3-04-hornet',
          lines: [
            n('At the end of Greenpath a figure stands on a ledge: thin, cloaked in red, with a long needle on a thread.'),
            n('Her mask is pale, like the Knight’s, but sharper. She doesn’t look at you; she looks at the Knight.'),
            px('That’s Hornet. She guards this place. The box says “protector”. The box looks worried.', 'think'),
            l('pa3-hornet', 'Come no closer, ghost.', 'angry'),
            l('pa3-hornet', 'I know what you are. I know where you’re going. This kingdom has had enough of walkers in the dark.'),
            n('She drops from the ledge and the needle comes whipping down. The Knight meets it with its nail.'),
            n('Sparks in the green light. Then, for a breath, both of them stand still and look at you.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Step back. Keep your hands where she can see them.',
              set: { 'pa3-hornet': 'back' },
              then: [
                n('You step back, open your hands, and stand with your Nubbin behind your legs.'),
                n('Hornet’s eyes flick to you once. Then she forgets you and goes back to the Knight.'),
                px('Good. Not our fight. Not our kingdom. We’re guests.', 'soft'),
              ],
            },
            {
              id: 'stood',
              label: 'Stand beside the Knight. Hold your ground.',
              set: { 'pa3-hornet': 'stood' },
              then: [
                n('You step up beside the Knight with your lantern high. Your Nubbin puffs itself up to twice its size.'),
                n('Hornet looks at you properly now, the way you’d look at a wasp on your toast.'),
                px('That’s brave. I don’t know if it’s clever. It’s definitely brave.', 'shock'),
              ],
            },
          ],
        },
        done: {
          id: 'pa3-04-hornet-done',
          lines: [
            n('The fight is short and fast and over your head. Then Hornet is kneeling, needle down, breathing hard.'),
            l('pa3-hornet', 'Hm. Then go on, little ghost. Find out what waits at the end. I won’t stop you twice.'),
            n('She flings her thread up into the dark and is gone, on her own feet, unhurt.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-04-complete',
      lines: [
        n('Greenpath goes quiet again, apart from the drip of moss and the fizz of the water.'),
        px('“Ghost.” She called the Knight a ghost. I wonder what she knows that we don’t.', 'think'),
        px('I’m writing her down. She’s going to matter. The ones who say “I won’t stop you twice” always do.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-04': true },
    childLines: {
      'pa3-04-hornet#3': 'Stop there, little ghost. Not one step more.',
    },
    notes:
      'SIGNATURE CHOICE: pa3-hornet = back | stood. Pays off in PA3-11 (Herrah’s den), PA3-15 (Kingdom’s Edge) and ' +
      'PA3-18 (the Black Egg). LIFTED TEXT 1 at pa3-04-hornet#3 (“Come no closer, ghost.”, © Team Cherry, from the ' +
      'outline’s wiki transcription of the 2017 English script; check against the game). The fight is camera-on-you: ' +
      'two silhouettes and sparks, then Hornet kneeling. She is bested, never hurt.',
  },

  // ---------------------------------------------------------------- PA3-5
  {
    id: 'pa3-05',
    code: 'PA3-5',
    title: 'Quirrel',
    source: src('Quirrel at the Lake of Unn'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-4') },
    requires: ['PA3-4'],
    speakers: [QUIRREL],
    steps: [
      {
        id: 'pa3-05-s1',
        goal: 'Find the third grub among the mushrooms.',
        hint: 'The big mushrooms bounce. Let your Nubbin go first; it’s lighter.',
        check: 'collect:pa3-grub:03',
        scene: {
          id: 'pa3-05-fungal',
          lines: [
            n('Past Greenpath the moss gives way to mushrooms, tall as lamp-posts and orange as soup.'),
            n('The air smells of bread that’s been left too long. Small spores drift past like lazy snow.'),
            n('The Knight lands on a cap and is thrown straight up, and lands again, as if it does this every day.'),
            px('Bouncy mushrooms. There are always bouncy mushrooms. It’s the law of caves.'),
            n('Your Nubbin hops on one. It goes up, comes down, goes up, and does not want to get off.'),
            n('From the top of its third bounce it sees the jar, wedged in the gills of a mushroom further on.'),
            n('Crying, muffled by mushroom. Your Nubbin points the whole way down.'),
          ],
        },
        done: {
          id: 'pa3-05-fungal-done',
          lines: [
            n('You reach in up to your shoulder, and it smells of very old bread in there. The jar comes out with a squelch.'),
            n('The grub hugs your wrist, then the Knight’s leg, to be fair. Then it’s gone.'),
            px('Three. My little jars are filling in. I’m colouring them yellow. Grub-coloured.'),
          ],
        },
      },
      {
        id: 'pa3-05-s2',
        goal: 'Meet the traveller sitting by the lake.',
        hint: 'There’s a bench on the shore. Someone’s already on it.',
        check: 'talk:pa3-quirrel:lake-of-unn',
        scene: {
          id: 'pa3-05-bench',
          lines: [
            n('The tunnel ends at a lake, wide and green-grey and quite still. It goes further than your lantern does.'),
            n('On a bench by the water sits a bug in a cracked mask, with a nail across his knees, looking out.'),
            l('pa3-quirrel', 'Oh, hello! Travellers! And a small round one. I didn’t think anyone else came this far.', 'happy'),
            l('pa3-quirrel', 'I’m Quirrel. I wander. I came down here to look for something and I can’t for the life of me remember what.'),
            l('pa3-quirrel', 'Isn’t that funny? It’s not, really. But I find if I say it’s funny it sits better.', 'think'),
            n('The Knight has gone on round the shore. It stops a long way off, and waits.'),
            l('pa3-quirrel', 'There’s room on the bench, if you’d like it. I’m only looking at the water. It doesn’t mind company.'),
          ],
          choices: [
            {
              id: 'sat',
              label: 'Sit with him.',
              set: { 'pa3-quirrel': 'sat' },
              then: [
                n('You sit, with your Nubbin between you. The lake does nothing, very beautifully.'),
                l('pa3-quirrel', 'Do you ever feel you’ve been somewhere before, and can’t think when?', 'soft'),
                l('pa3-quirrel', 'I feel I’ve seen this kingdom before. Not the roads. Something under the roads.'),
                l('pa3-quirrel', 'Never mind. Thank you for sitting. It’s much better looking at a lake with somebody.', 'happy'),
              ],
            },
            {
              id: 'passed',
              label: 'Wave, and catch up with the Knight.',
              set: { 'pa3-quirrel': 'passed' },
              then: [
                l('pa3-quirrel', 'Of course! Off you go. Mind the edges. Perhaps I’ll see you further down.', 'happy'),
                n('When you look back, he’s still on the bench, looking at the water.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-05-complete',
      lines: [
        n('The Knight walks on as soon as you reach it, as if it had been counting.'),
        px('I like him. He’s cheerful in a way that has a hole in the middle.', 'think'),
        px('Ruling: we keep an eye out for Quirrel. People like that turn up again.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-05': true },
    notes:
      'pa3-quirrel = sat | passed. With sat, PA3-16 plays as written (the longer scene); with passed, PA3-16 plays ' +
      'PA3_VARIANTS pa3-16-shore-passed instead. GRUB 3 of 12. Note: the Lake of Unn in the source lies past Greenpath; ' +
      'the mushroom walk stands in for the edge of the Fungal Wastes.',
  },

  // ---------------------------------------------------------------- PA3-6
  {
    id: 'pa3-06',
    code: 'PA3-6',
    title: 'The Mantis Lords',
    source: src('the Mantis Village and the three Mantis Lords'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-5') },
    requires: ['PA3-5'],
    speakers: [MANTIS],
    steps: [
      {
        id: 'pa3-06-s1',
        goal: 'Get through the Mantis Village, and find the fourth grub.',
        hint: 'The mantises are guarding a door, not hunting you. Keep low and keep behind the Knight.',
        check: 'collect:pa3-grub:04',
        scene: {
          id: 'pa3-06-village',
          lines: [
            n('A village built down a cliff, all hooks and ladders. Tall green bugs stand guard on every rail.'),
            n('They don’t have orange eyes; they’re not ill. They’re just guarding, the way they always have.'),
            px('Mantises. The box says they hold the way into Deepnest, so nothing from down there comes up.'),
            px('They’re not the baddies. They’re the gate. Gates aren’t baddies. Ask Corvin.'),
            n('A young mantis lunges at the Knight. The Knight turns it aside and keeps walking, nail down.'),
            n('Under a ladder, in the shadow, your Nubbin finds a jar. The grub inside has stopped crying, out of tiredness.'),
            n('It starts again the moment it sees you, mostly from relief.'),
          ],
        },
        done: {
          id: 'pa3-06-village-done',
          lines: [
            n('It hugs your Nubbin, which hugs back so hard they both fall over. Then it’s gone into the cliff.'),
            px('Four. I’m running out of yellow. Grubs are now pale orange. Nobody tell them.'),
          ],
        },
      },
      {
        id: 'pa3-06-s2',
        goal: 'Watch the Mantis Lords’ duel, and pay them the right respect.',
        hint: 'Stay at the edge of the hall. It’s the Knight’s duel, not yours.',
        check: 'watch:pa3-mantis-lords:throne-hall',
        scene: {
          id: 'pa3-06-lords',
          lines: [
            n('At the bottom of the village, a hall with three high seats. In them sit three tall mantises, very still.'),
            n('The middle one rises. She draws a long blade and bows to the Knight, low and exact.'),
            l('pa3-mantis', 'One at a time. Fairly. As it has always been done here.'),
            n('They fight one after another, each one faster than the last. It’s like watching the weather change.'),
            n('When it’s done, all three of them stand in a row. And all three of them bow.'),
            px('They lost. And they bowed. Ruling: that’s the classiest thing I’ve ever seen in a cave.', 'shock'),
            n('Your Nubbin, at the edge of the hall, looks at the three of them, then at you.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow back.',
              then: [n('You bow. Your Nubbin bows too, so low it tips over and has to be stood up again.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin answer for you both.',
              then: [n('Your Nubbin walks to the middle of the hall, all by itself, and bows very low. Then it tips over.')],
            },
          ],
        },
        done: {
          id: 'pa3-06-lords-done',
          lines: [
            n('The eldest mantis looks down at your Nubbin for a long moment. Then she inclines her head to it.'),
            l('pa3-mantis', 'The small one has manners. Go through. The village will not trouble you again.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-06-complete',
      lines: [
        n('Every mantis on every rail lowers its blade as you pass. Some of them bow to your Nubbin.'),
        n('Your Nubbin bows back to every single one, which takes a very long time.'),
        px('Don’t rush it. This is the best bit of the cartridge so far. I’ve paused my biscuit.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-06': true },
    notes:
      'GRUB 4 of 12. The duel: three short silhouette rounds, then a bow animation for all three Lords. Your Nubbin’s ' +
      'bow ends with it tipping over (a reusable gag animation: bow, wobble, sit). Mantis guards turn aside, never fall.',
  },

  // ---------------------------------------------------------------- PA3-7
  {
    id: 'pa3-07',
    code: 'PA3-7',
    title: 'The City of Tears',
    source: src('the City of Tears and the Hollow Knight memorial'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-6') },
    requires: ['PA3-6'],
    speakers: [CLANK],
    steps: [
      {
        id: 'pa3-07-s1',
        goal: 'Find the statue in the rainy square.',
        hint: 'Follow the Knight to the middle of the city. It knows where it’s going.',
        check: 'visit:pa3-memorial:city-square',
        scene: {
          id: 'pa3-07-plaque',
          lines: [
            n('A city under a lake. Blue towers, blue glass, and rain falling from the cave roof, the way it has for an age.'),
            n('In the square stands a statue: a tall figure with a horned mask, chained, holding a nail. It is very like the Knight.'),
            n('The Knight stops in front of it and doesn’t move at all.'),
            n('On the plinth there’s a plaque, its letters worn. Your lantern isn’t bright enough to read it.'),
            px('I can read it from here. Hang on. I’ll read it slowly.', 'soft'),
            px('It says it’s for the Hollow Knight. The kingdom’s vessel. The one who held the plague.'),
            px('“Through its sacrifice Hallownest lasts eternal.”', 'sad'),
            px('…That’s it. That’s the whole plaque. Somebody gave up everything and they got one sentence.', 'sad'),
            n('Rain runs down the statue’s mask. The Knight puts out one small hand and touches the stone.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait with the Knight.',
              then: [n('You stand in the rain beside it, and nobody says anything. After a while the Knight takes its hand back.')],
            },
            {
              id: 'light',
              label: 'Hold your lantern up so the Knight can see the face.',
              then: [n('You lift the lantern and the statue’s mask shines. The Knight looks at it for a long time, then walks on.')],
            },
          ],
        },
        done: {
          id: 'pa3-07-plaque-done',
          lines: [
            px('A vessel. That’s what it says. Not a knight. A thing you put something in.', 'think'),
            px('I don’t like that word as much as I did this morning.'),
          ],
        },
      },
      {
        id: 'pa3-07-s2',
        goal: 'Get the fifth grub down off the rooftop.',
        hint: 'Your Nubbin heard it first. The way up is by the drainpipes.',
        check: 'collect:pa3-grub:05',
        scene: {
          id: 'pa3-07-roof',
          lines: [
            n('Under the rain, your Nubbin’s ears go up, then sideways, then straight up again.'),
            n('Nobody else hears it. Then you do: crying, very faint, from somewhere high.'),
            n('On a rooftop above the square, a jar sits in a gutter, full to the shoulders with rainwater.'),
            n('The grub inside is crying and treading water.'),
            px('Up the drainpipe. Go. Go! Don’t look at me, go!', 'shock'),
            n('You climb the pipe, and your Nubbin climbs you. The Knight is already on the roof, as if it took the stairs.'),
          ],
        },
        done: {
          id: 'pa3-07-roof-done',
          lines: [
            n('You tip the jar. Out slides a very wet grub, which hugs your Nubbin, which is also very wet now.'),
            n('It burrows into the roof tiles, carefully, so as not to leave a hole for the rain.'),
            px('Five. Nearly half. Pale orange is now beige. They’re grubs. They won’t mind beige.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-07-complete',
      lines: [
        n('From the roof you can see the whole City of Tears, and the statue in the square, small now, in the rain.'),
        n('The Knight looks at it once more. Then it turns away and drops off the roof towards the next road.'),
        px('Ruling: I’m not reading any more plaques today. Next one, you read. Or the Nubbin.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-07': true },
    childLines: {
      'pa3-07-plaque#6': '“It gave up everything, so the kingdom could stay.”',
    },
    notes:
      'CLANK: if s21Done, play PA3_VARIANTS pa3-07-clank straight after pa3-07-plaque’s choice, before its done scene. ' +
      'LIFTED TEXT 2 at pa3-07-plaque#6 (the memorial plaque, © Team Cherry, from the outline’s wiki transcription; ' +
      'check against the game). Pixel reads the plaque; draw it worn and unreadable on screen so the line is hers. ' +
      'GRUB 5 of 12.',
  },

  // ---------------------------------------------------------------- PA3-8
  {
    id: 'pa3-08',
    code: 'PA3-8',
    title: 'The Seer',
    source: src('the Resting Grounds, the Dreamers’ shrine and the Dream Nail'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-7') },
    requires: ['PA3-7'],
    speakers: [SEER, HUSK],
    steps: [
      {
        id: 'pa3-08-s1',
        goal: 'Free the sixth grub in the Resting Grounds.',
        hint: 'It’s among the graves. Walk quietly; this is a sleeping place.',
        check: 'collect:pa3-grub:06',
        scene: {
          id: 'pa3-08-graves',
          lines: [
            n('The Resting Grounds are a hillside of small stone graves under a soft violet light.'),
            n('It’s the most peaceful place you’ve been. Even the Knight walks more slowly here.'),
            px('A graveyard. A nice one. I didn’t know they did nice ones.'),
            n('Between two old stones, a jar. The grub inside is crying very quietly, as if it knows where it is.'),
            n('Your Nubbin goes on tiptoe to fetch it. Nubbins don’t really have tiptoes, but it manages.'),
            n('The cork comes out with the softest pop you’ve ever heard.'),
          ],
        },
        done: {
          id: 'pa3-08-graves-done',
          lines: [
            n('The grub hugs the Knight and burrows off between the stones, careful not to disturb anybody.'),
            px('Six. Half. Half is a lot. I’m going to have a second biscuit.'),
          ],
        },
      },
      {
        id: 'pa3-08-s2',
        goal: 'See what the three masks on the shrine are.',
        hint: 'The Knight is heading for the shrine at the top of the hill. Stay close to it.',
        check: 'visit:pa3-dreamer-shrine:resting-grounds',
        scene: {
          id: 'pa3-08-shrine',
          lines: [
            n('At the top of the hill, three great stone masks stand side by side on a shrine. Each one is a different face.'),
            px('Lurien. Monomon. Herrah. Those are names on the box. It calls them “the Dreamers”.'),
            n('The Knight steps up onto the shrine. You step up after it, because that’s what you do now.'),
            n('The floor goes white. A door you hadn’t seen closes behind you, and it’s very quiet.'),
            n('Then the shrine goes away, and so does the hill, and you are standing in a field of white nothing.'),
            px('You’ve gone white. Your whole screen’s gone white. Are you… are you asleep?', 'shock'),
            n('Far away in the white, three huge shapes are lying still, each one holding something shut.'),
          ],
        },
        done: {
          id: 'pa3-08-shrine-done',
          lines: [
            n('Somebody taps you on the shoulder, very gently, and the white goes thin, like paper.'),
          ],
        },
      },
      {
        id: 'pa3-08-s3',
        goal: 'Talk to the moth who woke you.',
        hint: 'She is sitting at the top of a hill of her own, in the dream. Go and sit with her.',
        check: 'talk:pa3-seer:dream',
        scene: {
          id: 'pa3-08-seer',
          lines: [
            n('An old moth sits on a pile of cushions, wings folded round her like a shawl. Her eyes are closed.'),
            l('pa3-seer', 'There you are. The little ghost, and a guest, and a round small thing I don’t know. Welcome.', 'soft'),
            l('pa3-seer', 'I am the last of my people. We used to listen to dreams. Nobody listens any more.'),
            l('pa3-seer', 'The light that sickens this kingdom talks to everyone in their sleep. It sounds kind. It isn’t.'),
            n('She holds out something to the Knight: a nail made of something pale, like a dream of a nail.'),
            l('pa3-seer', 'This lets you hear what they dream. Use it on the sleepers. Use it, especially, on the three.'),
            n('The Knight takes it. Your Nubbin reaches up and touches it too, and the moth laughs.'),
            l('pa3-seer', 'You can’t have one. But you may come and sit with me. That’s nearly as good.', 'happy'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit with her a moment.',
              then: [
                n('You sit on a cushion, and your Nubbin falls asleep on another. The moth hums, with no tune at all.'),
                l('pa3-seer', 'Thank you. It has been a long time since anyone sat. Go. They’re waiting for you.', 'soft'),
              ],
            },
            {
              id: 'ask',
              label: '“What does the light want?”',
              then: [l('pa3-seer', 'Everything to be quiet and bright and the same, for ever. It thinks that’s love.', 'sad')],
            },
          ],
        },
        done: {
          id: 'pa3-08-seer-done',
          lines: [
            n('You wake up on the shrine with the floor under you. Your Nubbin is still asleep, so you carry it.'),
            n('On the way down the hill lies a husk, curled up between the graves. The Knight raises the dream nail.'),
            l('pa3-husk', '…so bright… so warm… I’ll just sleep in it a little longer… just a little…', 'soft'),
            px('That’s what they hear. A light that says, “Sleep. I’ll keep you.” Ugh. I don’t like it.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-08-complete',
      lines: [
        n('The Knight has the Dream Nail now. Every husk you pass dreams of the same thing: a warm light, and sleep.'),
        px('“Sleep, and I’ll keep you.” That’s not keeping. That’s a jar. A big warm jar with a cork in.', 'think'),
        px('Ruling: we don’t trust anything that wants everyone to hold still. On we go.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-08': true },
    notes:
      'GRUB 6 of 12. The dream is a white screen with three huge sleeping silhouettes far off (the Dreamers); keep it ' +
      'calm, not frightening. The Seer’s hum is wordless and tuneless. Husks’ dreams (pa3-husk) are new words. ' +
      'Pixel’s jar line in the complete scene ties the Radiance to the grub jars; it names nothing from the campaign.',
  },

  // ---------------------------------------------------------------- PA3-9
  {
    id: 'pa3-09',
    code: 'PA3-9',
    title: 'The Delicate Flower',
    source: src('the Grey Mourner and the Delicate Flower'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-8') },
    requires: ['PA3-8'],
    speakers: [MOURNER],
    steps: [
      {
        id: 'pa3-09-s1',
        goal: 'Find the grey house past the crypts.',
        hint: 'The crypt path starts behind the Resting Grounds. Keep your lantern low; it’s narrow.',
        check: 'talk:pa3-mourner:grey-house',
        scene: {
          id: 'pa3-09-house',
          lines: [
            n('Behind the graves, a narrow path through the crypts leads to a small grey house on its own.'),
            n('Inside, everything is grey: grey walls, grey cloth, a tall grey bug sitting very still.'),
            l('pa3-mourner', 'Visitors. Nobody visits. Come in. Mind the step; it’s grey too.', 'soft'),
            l('pa3-mourner', 'I loved someone. They’re buried in the Queen’s Gardens, far from here. I can’t go. I’m too slow, and too sad.'),
            n('She holds out a flower, white and thin as tissue, with a stem that bends if you look at it.'),
            l('pa3-mourner', 'Take this to the grave for me. Please. But it is very delicate.'),
            l('pa3-mourner', 'One knock and it’s gone. Not the stag. Not a dream-gate. The trams. Slowly.'),
            n('The Knight looks at the flower. Then it looks at you, and steps back.'),
            px('It’s giving you the job. The Knight fights; you carry. That’s… actually perfect.', 'happy'),
          ],
          choices: [
            {
              id: 'take',
              label: 'Take the flower in both hands.',
              then: [n('You hold it the way you’d hold a moth. Your Nubbin walks in front of you, checking for bumps.')],
            },
            {
              id: 'ask',
              label: '“Who were they?”',
              then: [
                l('pa3-mourner', 'Someone who held the door for me, every day, for years. Then one day they didn’t come.', 'sad'),
                n('She folds your fingers round the stem. You hold it the way you’d hold a moth.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa3-09-house-done',
          lines: [
            l('pa3-mourner', 'If it breaks, come back. I’ll give you another. I have grown a great many, waiting.'),
          ],
        },
      },
      {
        id: 'pa3-09-s2',
        goal: 'Carry the flower to the tram, and free the seventh grub without dropping it.',
        hint: 'Your hands are full. Your Nubbin can open the jar on its own.',
        check: 'collect:pa3-grub:07',
        scene: {
          id: 'pa3-09-carry',
          lines: [
            n('Every step through the crypts, the flower trembles. You walk like someone carrying a full cup of tea.'),
            n('The Knight walks ahead and swats anything that moves before it gets near you.'),
            px('Flower status: still a flower. I’ll be saying that a lot. Flower status: still a flower.'),
            n('Then, crying, from a ledge by the tram stop. Your Nubbin looks at you, and your hands are full.'),
            n('Your Nubbin looks at the jar. Then it squares its shoulders and goes on its own.'),
            n('It climbs, wedges the jar between its feet, and works the cork loose with both hands.'),
            n('Nubbins aren’t built for corks. It manages anyway.'),
          ],
        },
        done: {
          id: 'pa3-09-carry-done',
          lines: [
            n('The grub hugs your Nubbin, and your Nubbin, very proudly, hugs it back. Then it’s gone.'),
            px('Seven. The Nubbin did that one by itself. I’m putting a star on that jar.', 'happy'),
            px('Flower status: still a flower. Tram’s here. Sit down. Don’t sneeze.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-09-complete',
      lines: [
        n('The tram creaks along its rail through the dark, and you sit very straight, with the flower in your lap.'),
        n('The Knight sits next to you. It doesn’t look at the flower, but it sits so its cloak shields it from the draught.'),
        px('Ruling: this is the tensest tram ride in history. I’ve stopped eating. That’s how tense.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-09': true },
    notes:
      'THE FLOWER is carried from here through PA3-10 and PA3-11 to the grave in PA3-12. Any knock (a hit, a fall, a ' +
      'stag ride or a dream-gate) breaks it: play PA3_VARIANTS pa3-09-broken, send the player back to the grey house, ' +
      'and the Grey Mourner gives another at once. Nothing is lost but time; progress and grubs are kept. Dream scenes ' +
      'in PA3-10 and PA3-13 never break it (the flower stays in the waking world, in your hands). GRUB 7 of 12.',
  },

  // ---------------------------------------------------------------- PA3-10
  {
    id: 'pa3-10',
    code: 'PA3-10',
    title: 'The Three Dreamers',
    source: src('Lurien, Monomon and Herrah, the three Dreamers'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-9') },
    requires: ['PA3-9'],
    speakers: [LURIEN, MONOMON, HERRAH, QUIRREL],
    steps: [
      {
        id: 'pa3-10-s1',
        goal: 'Climb the watcher’s spire and sit with Lurien.',
        hint: 'The spire is above the City of Tears. The lift is slow. That’s good, for the flower.',
        check: 'sit:pa3-lurien:watchers-spire',
        scene: {
          id: 'pa3-10-lurien',
          lines: [
            n('At the top of a spire over the city, in a cold room full of telescopes, someone sleeps in a great chair.'),
            n('He is wrapped in a blue cloak, and a frost of years lies on his shoulders. He was watching the city when he fell asleep.'),
            px('Lurien. The Watcher. He’s been holding the seal in his sleep. That’s his job. For an age.', 'soft'),
            n('The Knight lifts the Dream Nail. It touches him, so lightly, like a hand on a sleeve.'),
            l('pa3-lurien', 'Ah. Is it time? I was watching the city. I always watch the city. Someone ought to.', 'soft'),
            l('pa3-lurien', 'They all went away. I kept looking anyway. Will you look at it for me, a moment?'),
            n('You stand at the telescope, with the flower in one hand, and look at the blue city in the rain.'),
            l('pa3-lurien', 'Thank you. Then I may close my eyes properly. Goodnight, little ghost.'),
          ],
        },
        done: {
          id: 'pa3-10-lurien-done',
          lines: [
            n('The frost on his shoulders goes to a soft shimmer, and then he isn’t there, and the chair is just a chair.'),
            n('One of the shrine’s three locks, far away, gives a click you feel in your teeth.'),
            px('He went to his rest. That’s all. He was tired.', 'sad'),
          ],
        },
      },
      {
        id: 'pa3-10-s2',
        goal: 'Get through the fog to Monomon’s archive, and find the eighth grub.',
        hint: 'The fog bobs and drifts. Walk slowly; the flower likes slowly. Someone you know is coming.',
        check: 'collect:pa3-grub:08',
        scene: {
          id: 'pa3-10-monomon',
          lines: [
            n('Fog Canyon is full of soft pink lights that bob in the air like jellyfish. They pop if you touch them.'),
            px('Don’t touch them. Flower. Flower status: still a flower, please, please.'),
            n('In a little hollow of fog, your Nubbin finds a jar and opens it, all by itself again, very carefully.'),
            n('At the archive door, a shimmering ward blocks the way. And beside it, on a step, sits Quirrel.'),
            l('pa3-quirrel', 'Oh! You! I remembered. Some of it. She was my teacher. Monomon. I came to let her go.', 'soft'),
            l('pa3-quirrel', 'Only I can lift this. She made it so. She knew I’d come back.'),
            n('He lifts his hands. The ward goes thin and drifts away like a soap bubble.'),
            n('Inside, in a great glass jar of water, the Teacher floats asleep, her tentacles folded like a cardigan.'),
            l('pa3-monomon', '…a student? Late, as always. And you’ve brought more. Good. Somebody should learn something.', 'happy'),
            l('pa3-monomon', 'I wrote down everything I knew. It’s all on the shelves. Read it after. I shall be resting.'),
          ],
        },
        done: {
          id: 'pa3-10-monomon-done',
          lines: [
            n('Quirrel sits on the floor by the jar with his hands on the glass until the light inside goes soft and out.'),
            l('pa3-quirrel', 'Thank you. I’ll be all right. I’m nearly always all right. You go on.', 'sad'),
            n('Click: the second lock.'),
          ],
        },
      },
      {
        id: 'pa3-10-s3',
        goal: 'Go down into Deepnest, and sit with Herrah.',
        hint: 'Deepnest is very dark. Keep the lantern on the flower and your Nubbin close.',
        check: 'sit:pa3-herrah:deepnest-den',
        scene: {
          id: 'pa3-10-herrah',
          lines: [
            n('Deepnest is dark in a thick way, like wool. Threads of old silk hang everywhere, and things scuttle at the edges.'),
            n('The Knight keeps them off. You keep the flower under your chin, out of their way.'),
            n('In the deepest den, in a bed of silk, lies a great sleeping spider, bigger than a barn. Her face is kind.'),
            px('Herrah. The Beast. She’s… she’s somebody’s mum. The box says so.', 'soft'),
            n('The Knight lifts the Dream Nail. Her many eyes open, one at a time, slowly.'),
            l('pa3-herrah', 'You. The pale king’s child. I made a bargain with him. My sleep, for my daughter.', 'think'),
            l('pa3-herrah', 'Is she well? Is she strong? She was always strong. Too strong to sit still.'),
          ],
          choices: [
            {
              id: 'well',
              label: '“She’s well. She’s very strong.”',
              then: [
                l('pa3-herrah', 'Yes. Of course she is.', 'soft'),
                n('Something in her many eyes lets go.'),
              ],
            },
            {
              id: 'sit',
              label: 'Say nothing. Sit down by her.',
              then: [
                n('You sit at the edge of the silk, and your Nubbin leans on one of her legs. She lets out a long breath.'),
                l('pa3-herrah', 'You don’t lie. Good. Then I’ll believe you when you go and see her for me.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'pa3-10-herrah-done',
          lines: [
            n('Her eyes close, one at a time, the way they opened. The silk goes slack, and she has gone to her rest.'),
            n('Click: the third lock. Far above, in the temple, something very old cracks a little wider.'),
            px('That was three goodbyes in a row. I’m all right. I am. Shush.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-10-complete',
      lines: [
        n('Three Dreamers have gone to their rest, and all three seals are open now.'),
        n('The Knight stands in the dark of the den and looks at nothing for a while. You and your Nubbin sit with it.'),
        px('Flower status: still a flower. I don’t know how. Ruling: you’re a hero of carrying.'),
        n('Then a thread in the doorway twitches, and someone is standing there.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-10': true },
    notes:
      'CARE: in the source the Knight kills the Dreamers in their dreams. Here the Dream Nail wakes each one, they say ' +
      'goodbye, and they fade like a warden going to rest. No struggle, no blow. Quirrel lifts Monomon’s ward whichever ' +
      'way pa3-quirrel was set. GRUB 8 of 12 (Fog Canyon). The complete scene ends on Hornet’s arrival: PA3-11 follows on.',
  },

  // ---------------------------------------------------------------- PA3-11
  {
    id: 'pa3-11',
    code: 'PA3-11',
    title: 'Herrah’s Den',
    source: src('Hornet at her mother’s resting place in Deepnest'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-10') },
    requires: ['PA3-10'],
    speakers: [HORNET],
    steps: [
      {
        id: 'pa3-11-s1',
        goal: 'Be there for Hornet, in whatever way she lets you.',
        hint: 'She has just lost her mother. Don’t rush her.',
        check: 'sit:pa3-hornet:deepnest-den',
        scene: {
          id: 'pa3-11-den',
          lines: [
            n('Hornet stands in the doorway with her needle in her hand. She isn’t looking at you; she’s looking at the empty silk.'),
            n('She walks past you, past the Knight, to the bed of silk, and stands there.'),
            n('She doesn’t kneel, and she doesn’t say anything. Her needle hangs from her hand, pointing at the floor.'),
            px('That was her mum. Herrah was her mum.', 'sad'),
            n('After a long time she turns her head, just a little, towards you.'),
            l('pa3-hornet', 'You stood back, in Greenpath. You kept your hands open.'),
            l('pa3-hornet', 'You can sit. There. Not too close.'),
            n('You sit where she pointed, with your Nubbin by you. Nobody says anything about grief.'),
          ],
          choices: [
            {
              id: 'quiet',
              label: 'Say nothing. Just sit.',
              then: [
                n('You don’t say anything, and neither does she. That’s the right answer, and both of you know it.'),
                n('After a while, she breathes out, long and slow.'),
              ],
            },
            {
              id: 'sorry',
              label: '“I’m sorry.”',
              then: [
                l('pa3-hornet', 'Don’t.', 'sad'),
                n('It isn’t unkind; it’s a door closing gently. You go back to saying nothing, and that’s better.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa3-11-den-done',
          lines: [
            n('She stands up. She picks one thread of silk off the bed, winds it round her wrist, and turns to go.'),
            l('pa3-hornet', 'Keep that flower whole. Something should get where it’s going.'),
          ],
        },
      },
      {
        id: 'pa3-11-s2',
        goal: 'Find the ninth grub on the way out of Deepnest.',
        hint: 'Your Nubbin will hear it. It’s close to the edge of the gardens.',
        check: 'collect:pa3-grub:09',
        scene: {
          id: 'pa3-11-grub',
          lines: [
            n('The way out of Deepnest climbs, and the dark thins, and you can smell leaves.'),
            n('Your Nubbin stops, ears up. Crying, in a web, high in a corner.'),
            n('The jar is tied up in silk like a parcel. The grub inside is cross about it.'),
            n('The Knight cuts the silk with one neat stroke. Your Nubbin catches the jar, and you catch your Nubbin.'),
            n('The flower, in your other hand, sways and holds.'),
            px('FLOWER STATUS: STILL A FLOWER. Sorry. Shouting. I’m all right.', 'shock'),
          ],
        },
        done: {
          id: 'pa3-11-grub-done',
          lines: [
            n('The grub hugs everyone and burrows away, still a bit cross. Nine.'),
            px('Nine. Three to go. I’ve run out of beige. They’re pencil now.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-11-complete',
      lines: [
        n('At the edge of Deepnest the dark gives way to a green, overgrown garden.'),
        n('Somewhere behind you, Hornet goes back the other way, alone, into the dark she grew up in.'),
        px('I’m not going to say anything about that. Like you didn’t. Ruling: that was right.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'pa3-11': true },
    notes:
      'HORNET PAYOFF 1 (pa3-hornet). As written, pa3-11-den is for back. For stood, play PA3_VARIANTS pa3-11-den-stood ' +
      'in place of pa3-11-den, and pa3-11-den-done-stood in place of pa3-11-den-done; the step check is the same ' +
      '(she tells you to go: sitting where you’re told, outside the den, completes it). CARE: Hornet’s grief is short, ' +
      'private and never comic. Pixel’s jokes stop in this scene. GRUB 9 of 12.',
  },

  // ---------------------------------------------------------------- PA3-12
  {
    id: 'pa3-12',
    code: 'PA3-12',
    title: 'The Queen’s Gardens',
    source: src('the Queen’s Gardens, the grave, and the White Lady'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-11') },
    requires: ['PA3-11'],
    speakers: [LADY],
    steps: [
      {
        id: 'pa3-12-s1',
        goal: 'Free the tenth grub from the thorns, without the flower going anywhere near them.',
        hint: 'Your hands are full again. Your Nubbin is smaller than the gaps in the thorns.',
        check: 'collect:pa3-grub:10',
        scene: {
          id: 'pa3-12-thorns',
          lines: [
            n('The Queen’s Gardens were beautiful once, and are still beautiful, only wilder. Thorns everywhere.'),
            n('The Knight walks in front of you and cuts a path wide enough for one flower and the person holding it.'),
            n('Half-way through, your Nubbin stops. Crying, from deep in a thorn bush.'),
            px('Flower. Thorns. Flower. Thorns. I can’t look. I’m looking.', 'shock'),
            n('You stand very still with the flower held high. Your Nubbin lies down flat and wriggles in on its belly.'),
            n('A long wait, a rustle, a pop. Then your Nubbin wriggles out backwards, with a jar, and a grub on its head.'),
          ],
        },
        done: {
          id: 'pa3-12-thorns-done',
          lines: [
            n('The grub hugs the Knight’s boot and burrows into the soft garden earth. Ten.'),
            px('Ten. Flower status: still a flower. Nubbin status: slightly scratched, extremely proud.', 'happy'),
          ],
        },
      },
      {
        id: 'pa3-12-s2',
        goal: 'Lay the Delicate Flower on the grave in the Queen’s Gardens.',
        hint: 'The grave is in a clearing at the far end of the gardens. Last stretch. Slowly.',
        check: 'deliver:pa3-delicate-flower:queens-gardens',
        scene: {
          id: 'pa3-12-grave',
          lines: [
            n('The path opens into a clearing. The thorns stop as if they’d been told to.'),
            n('In the middle there’s a small stone, with grass grown long around it that nobody has cut for an age.'),
            n('The Knight stops at the edge of the clearing and doesn’t go any closer. This part is yours.'),
            n('You walk the last few steps more slowly than you have walked anything in your life.'),
            n('Your Nubbin walks beside you with both arms out, ready to catch the flower if the air moves.'),
            px('That’s it. That’s the grave. Flower status: still a flower. Go on. Put it down.', 'soft'),
          ],
          choices: [
            {
              id: 'lay',
              label: 'Lay it on the stone.',
              then: [n('You lay it on the stone, and it doesn’t break. It sits up a little, in the light, as if it’s home.')],
            },
            {
              id: 'plant',
              label: 'Plant it in the grass by the stone.',
              then: [n('You make a hole with two fingers and set it in. It stands up straight, as if it was always going to grow here.')],
            },
          ],
        },
        done: {
          id: 'pa3-12-grave-done',
          lines: [
            n('The Knight stands by the grave with its head bowed. Your Nubbin pats the stone, twice.'),
            px('Delivered. We did it. I did nothing. You did it. I was emotionally present.', 'happy'),
          ],
        },
      },
      {
        id: 'pa3-12-s3',
        goal: 'Go into the white root room behind the gardens.',
        hint: 'There’s a door in the roots at the back of the gardens. The Knight is already going in.',
        check: 'talk:pa3-lady:root-room',
        scene: {
          id: 'pa3-12-lady',
          lines: [
            n('Behind the gardens, a room grown over with pale roots. In the middle, bound in them, sits a tall pale lady.'),
            n('She has a crown of white branches, and she can’t move at all. She smiles when she sees the Knight.'),
            l('pa3-lady', 'Little one. You came. Of course you came. You were always going to come.', 'soft'),
            l('pa3-lady', 'My husband made you, and made your brothers and your sisters, and chose one, and threw the rest away.', 'sad'),
            l('pa3-lady', 'He did it to keep the kingdom safe. I let him. I’m sorry. For all of you.'),
            n('A root lifts something from her lap: half of a white charm, warm as a hand.'),
            l('pa3-lady', 'Take this. It’s half of what he carried. The other half is in his palace, in the dream of it.'),
            n('The Knight takes it. Then she looks past it, at you, and at your Nubbin.'),
            l('pa3-lady', 'And you two. You carried that flower all that way. I could smell it coming.', 'happy'),
          ],
        },
        done: {
          id: 'pa3-12-lady-done',
          lines: [
            n('A root curls round to you and drops something into your hand: a seed, white as the flower.'),
            l('pa3-lady', 'A garden thing. It won’t wilt. Nothing grown from that grave will.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-12-complete',
      lines: [
        n('You leave the White Lady in her roots, smiling, and the grave with its flower.'),
        px('She said he threw the rest away. The rest of the Knights. Where do you throw away a Knight?', 'think'),
        px('…I’ve found it on the map. I wish I hadn’t. It’s down. It’s a long way down.', 'sad'),
        n('Pixel puts a small white flower in a pot on top of the cabinet, in the real lantern shed. You hear the clunk.'),
        px('From the seed. It came out of the cabinet tray. Don’t ask. It’s not wilting. I don’t think it’s going to.'),
      ],
    },
    rewards: [
      {
        id: 'pa3-flower-pot',
        kind: 'decor',
        label: 'The Delicate Flower, in a pot',
        description: 'A thin white flower in a clay pot, grown from the White Lady’s seed. It never wilts, and nothing knocks it over.',
      },
    ],
    sets: { 'pa3-12': true },
    notes:
      'The grave is the Grey Mourner’s love. Laying or planting both deliver. GRUB 10 of 12. The flower-pot decor arrives on top of the cabinet first; the player may move it into the Grove like any ' +
      'decor. It is a Grove decoration reward only; no Grove flag is written.',
  },

  // ---------------------------------------------------------------- PA3-13
  {
    id: 'pa3-13',
    code: 'PA3-13',
    title: 'The White Palace',
    source: src('the White Palace, and the Pale King’s memory'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-12') },
    requires: ['PA3-12'],
    speakers: [KING, CLANK],
    steps: [
      {
        id: 'pa3-13-s1',
        goal: 'Follow the Knight into the dream of the king’s palace.',
        hint: 'A fallen palace guard lies at the edge of the old basin. The Knight will use the Dream Nail on it.',
        check: 'visit:pa3-white-palace:dream',
        scene: {
          id: 'pa3-13-dream',
          lines: [
            n('At the edge of an old basin lies a tall guard in white armour, asleep, holding a spear upright.'),
            n('The Knight touches it with the Dream Nail. The world goes white, the way it did at the shrine.'),
            n('When it comes back, you’re standing in a palace made entirely of white.'),
            n('White walls, white floors, white saws spinning in white slots. Spikes, white too, in neat rows.'),
            px('That’s… a lot of saws. Who builds a house out of saws?', 'shock'),
            px('Someone who doesn’t want visitors. Someone who wants to stay perfect. Ugh. Right.', 'angry'),
            n('The Knight looks up the long white shaft and starts to climb. You stay at the bottom with your lantern.'),
          ],
        },
        done: {
          id: 'pa3-13-dream-done',
          lines: [
            px('Right. You can see the saws from down there, and I can see the whole map. Between us, we’re its eyes.'),
          ],
        },
      },
      {
        id: 'pa3-13-s2',
        goal: 'Call out the timings with Pixel while the Knight climbs.',
        hint: 'Watch the saws. Pixel calls left and right; you call “now”. Missed calls cost nothing but a retry.',
        check: 'puzzle:pa3-palace-timings:white-palace',
        scene: {
          id: 'pa3-13-timings',
          lines: [
            px('Saw on the left. It goes round every… two seconds. Wait for it. Wait.'),
            n('The saw sweeps past and you shout, “Now!” The Knight jumps, and is past it.'),
            px('Spikes on the next ledge. Then a wall saw. Then three in a row. Oh, they’re showing off now.'),
            n('Your Nubbin is watching the saws too. It bobs its head in time with them, like a metronome.'),
            px('Copy the Nubbin. The Nubbin’s got the rhythm. Ruling: the Nubbin is head of timing.'),
            n('The Knight climbs, you call, the Nubbin bobs. Pixel taps the cabinet in time, which helps nobody, but she does it.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Call when the Nubbin bobs.',
              then: [n('Bob, call, jump; bob, call, jump. It works so well that Pixel starts humming, no tune, just the beat.')],
            },
            {
              id: 'count',
              label: 'Count out loud. One, two, now.',
              then: [n('You count, Pixel counts with you, and your Nubbin bobs anyway. Between you, nobody misses.')],
            },
          ],
        },
        done: {
          id: 'pa3-13-timings-done',
          lines: [
            n('The Knight reaches the top of the shaft and stands on a white throne-room floor. You run up the safe stair after it.'),
          ],
        },
      },
      {
        id: 'pa3-13-s3',
        goal: 'Watch the memory waiting in the throne room.',
        hint: 'Stand near the Knight and watch. It’s only a memory; nobody can see you.',
        check: 'watch:pa3-king-memory:white-palace',
        scene: {
          id: 'pa3-13-memory',
          lines: [
            n('On the throne lies the other half of the white charm. The Knight picks it up, and they become one.'),
            n('The light changes. The room fills with a memory, pale and thin, like breath on glass.'),
            n('A tall pale king stands in this room. In front of him stand dozens of small dark figures, all with horned masks.'),
            n('He walks along their row. He stops at one, taller than the rest, very still, with no light in it at all.'),
            n('He looks at it for a long time. Then he chooses it.'),
            l('pa3-king', 'No cost too great.', 'think'),
            n('The memory goes thin. The other small figures in the row fade last.'),
            n('The Knight looks at where they were. Your Nubbin walks over and stands next to it, very close.'),
            px('He chose one. And he thought choosing made it fine. For the others too.', 'sad'),
          ],
        },
        done: {
          id: 'pa3-13-memory-done',
          lines: [
            n('The charm in the Knight’s hand glows white, and warm. The palace begins to come apart, gently, like a dream does.'),
            n('You wake beside the fallen guard at the basin’s edge, all three of you, with the whole charm.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-13-complete',
      lines: [
        px('He knew. He made them, and threw them away, and knew. And he said it wasn’t too much.', 'angry'),
        px('…Sorry. Not my kingdom. But it’s my cartridge, and I’m allowed to be cross at a king.'),
        n('The Knight is standing at the edge of the basin, looking down. Below it, the dark goes on.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-13': true },
    childLines: {
      'pa3-13-memory#5': 'This one will do. Whatever it costs.',
    },
    notes:
      'CLANK: if s21Done, play PA3_VARIANTS pa3-13-clank straight after pa3-13-memory. LIFTED TEXT 3 at ' +
      'pa3-13-memory#5 (“No cost too great.”, © Team Cherry, from the outline’s wiki transcription; check against the ' +
      'game). The palace is a skill section for the Knight: the player’s job is the call-outs (a rhythm minigame on ' +
      'Pixel’s cues). No fail state beyond a retry. Pixel’s humming is a beat, no tune.',
  },

  // ---------------------------------------------------------------- PA3-14
  {
    id: 'pa3-14',
    code: 'PA3-14',
    title: 'The Abyss',
    source: src('the Abyss, the lighthouse and the Void Heart'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-13') },
    requires: ['PA3-13'],
    speakers: [],
    steps: [
      {
        id: 'pa3-14-s1',
        goal: 'Free the eleventh grub at the rim of the basin.',
        hint: 'It’s on the last ledge before the dark. Your Nubbin will find it.',
        check: 'collect:pa3-grub:11',
        scene: {
          id: 'pa3-14-rim',
          lines: [
            n('The Ancient Basin is grey and wide and quiet, with old pillars standing up out of it like teeth.'),
            n('On the last ledge before the dark, your Nubbin finds a jar. The grub inside is crying in a tiny voice.'),
            n('You open it, but it doesn’t burrow straight away. It hugs the Knight for a long time, as if it knows where it’s going.'),
            px('Eleven. That’s eleven. One more after this.', 'soft'),
            n('Then it burrows, and the Knight turns to the edge, and looks down.'),
            n('There’s a lift down, old and creaking. It goes a very long way.'),
          ],
        },
        done: {
          id: 'pa3-14-rim-done',
          lines: [
            n('The lift goes down for a long time. Your lantern is the only light, and then not even that much.'),
          ],
        },
      },
      {
        id: 'pa3-14-s2',
        goal: 'Go down into the Abyss with the Knight.',
        hint: 'Keep the lantern up. They won’t hurt you. They’re only looking.',
        check: 'explore:pa3-abyss:sea',
        scene: {
          id: 'pa3-14-shades',
          lines: [
            n('At the bottom, a black sea, flat as ink. On a rock far out, a lighthouse, dark.'),
            n('Around you, in the dark, there are shapes: small ones, with horned masks.'),
            n('Hundreds of them, all the ones in the memory and more. They crowd towards the Knight, pressing in.'),
            px('Those are the others. The ones he threw away. Its brothers and sisters.', 'sad'),
            n('They don’t attack; they push. They’re looking at the Knight the way you look at a door you thought was locked.'),
            n('The Knight stands still in the middle of them, and they press closer, and closer.'),
            n('Your Nubbin hides behind your legs, and then, slowly, comes out, and looks at the nearest one.'),
          ],
        },
      },
      {
        id: 'pa3-14-s3',
        goal: 'Decide how to get the Knight through.',
        hint: 'There’s a path down to the bottom, and there’s a switch on the lighthouse. You can’t do both.',
        check: 'choose:pa3-abyss:lighthouse',
        scene: {
          id: 'pa3-14-lighthouse',
          lines: [
            px('Listen. There’s a path along the shore. It goes straight down to where the Knight came from.'),
            px('If you hurry it, it’ll get there. They’ll press, but it’ll get there.'),
            px('Or. There’s a switch on the lighthouse. It’s been dark for an age. If you turn it on…', 'think'),
            px('…they could see. That’s all. They’ve been in the dark so long. They could just see.'),
            n('The Knight looks at the lighthouse, then at you. It doesn’t move; it’s waiting for you.'),
            px('This is a real choice. I’ve checked. I can’t tell you which. I really, really can’t.', 'soft'),
          ],
          choices: [
            {
              id: 'waited',
              label: 'Wade to the lighthouse, turn it on, and wait.',
              set: { 'pa3-abyss': 'waited' },
              then: [
                n('You wade out through water that is cold and doesn’t wet you. The switch is stiff, so you lean on it.'),
                n('The lighthouse comes on: a great slow beam, sweeping across the black sea.'),
                n('Every one of the small masks turns to look at it. They stop pressing, and just look.'),
                n('You wait, and your Nubbin waits. The Knight waits, and the shades stand round it, quiet, in the light.'),
              ],
            },
            {
              id: 'hurried',
              label: 'Hurry the Knight down the shore path.',
              set: { 'pa3-abyss': 'hurried' },
              then: [
                n('You take the shore path at a run, lantern swinging, and the Knight comes. The shades press round it all the way.'),
                n('Behind you, the lighthouse stays dark.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-14-complete',
      lines: [
        n('In the beam of the lighthouse, the shades come to the Knight one by one, and touch it, and go back into the dark.'),
        n('Not away: back. As if it’s home, and they’re in the next room.'),
        n('The white charm in the Knight’s hand goes black, softly, from the edges in, like evening.'),
        px('It’s changed. The charm. It was the king’s. Now it’s… theirs. All of theirs.', 'shock'),
        px('Ruling: I’m calling it the Void Heart. That’s what the box calls it. The box gets this one right.', 'soft'),
        n('The Knight looks at you and tilts its head. Then it bows, just a little, the way the mantises do.'),
      ],
    },
    rewards: [],
    sets: { 'pa3-14': true },
    notes:
      'SECOND SIGNATURE CHOICE: pa3-abyss = waited | hurried. waited means the Knight holds the Void Heart. Pays off in ' +
      'PA3-18. As written, pa3-14-complete is for waited; for hurried play PA3_VARIANTS pa3-14-complete-hurried. GRUB 11 ' +
      'of 12. The shades are small dark masked shapes, never menacing: they push like a crowd at a door. THE ABYSS SAVE: ' +
      'take a cartridge save point the moment PA3-14 opens (before pa3-14-rim plays). The sealed ending in PA3-18 offers ' +
      'to return here: it clears pa3-abyss and pa3-14 … pa3-18 in the Arcade save and replays from PA3-14. Grubs 11 and ' +
      '12 stay found; one-time rewards already given are not given twice.',
  },

  // ---------------------------------------------------------------- PA3-15
  {
    id: 'pa3-15',
    code: 'PA3-15',
    title: 'Kingdom’s Edge',
    source: src('Kingdom’s Edge, and Hornet’s last test'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-14') },
    requires: ['PA3-14'],
    speakers: [HORNET],
    steps: [
      {
        id: 'pa3-15-s1',
        goal: 'Find the twelfth grub in the falling ash.',
        hint: 'Ash covers everything here. Listen with your Nubbin; don’t look.',
        check: 'collect:pa3-grub:12',
        scene: {
          id: 'pa3-15-ash',
          lines: [
            n('At the very edge of the kingdom, ash falls like snow, grey and soft, and settles on everything.'),
            n('It settles on your lantern. It settles on your Nubbin, who sneezes, and settles on the Knight’s horns.'),
            px('It’s so quiet out there. The speaker’s just hiss. Is that the ash or the speaker?'),
            n('Your Nubbin stops. Under the ash, very faint: crying.'),
            n('You dig with your hands and find a jar, half-buried. The grub inside is grey with ash and too tired to cry properly.'),
            n('You open it. It tries to burrow and can’t; it just lies in the jar, looking up.'),
            px('Oh, poor thing. Twelve. It’s number twelve. Bring it. Bring the jar. We’ll take it home ourselves.', 'soft'),
          ],
        },
        done: {
          id: 'pa3-15-ash-done',
          lines: [
            n('You tuck the open jar inside your coat. Your Nubbin checks on it every few steps.'),
            px('Twelve. That’s all of them. That’s our twelve. I’m colouring the last one in with my best pen.', 'happy'),
          ],
        },
      },
      {
        id: 'pa3-15-s2',
        goal: 'Watch Hornet’s last test of the Knight.',
        hint: 'She is waiting on the high ridge, in front of the King’s Brand. Stay back.',
        check: 'watch:pa3-hornet-test:kingdoms-edge',
        scene: {
          id: 'pa3-15-test',
          lines: [
            n('On a high ridge, in the ash, a red cloak. Hornet stands in front of a stone door with a mark burned on it.'),
            l('pa3-hornet', 'So you made it. Behind me is the king’s mark. Take it, and you can go to the very end.'),
            l('pa3-hornet', 'But first, show me you’re strong enough to hold what you’ll find.'),
            n('They fight, quick and hard in the falling ash. You stand back with your lantern, and your Nubbin covers its eyes.'),
            n('Then it’s over, and Hornet steps aside. The Knight walks past her, and puts its hand on the mark.'),
            n('Hornet turns. And this time, she looks at you.'),
            l('pa3-hornet', 'You. You kept your hands open, in Greenpath. You sat where I told you to, in the den.'),
            l('pa3-hornet', 'When it ends, I will come. Not for the king. For it. And because you asked me nothing.', 'soft'),
          ],
          choices: [
            {
              id: 'thanks',
              label: '“Thank you.”',
              then: [l('pa3-hornet', 'Don’t thank me yet. Thank me when I’m there.')],
            },
            {
              id: 'nod',
              label: 'Nod.',
              then: [n('You nod. She nods back, once, exactly as much as you did.')],
            },
          ],
        },
        done: {
          id: 'pa3-15-test-done',
          lines: [
            n('She throws her thread up into the ash, and is gone. The Knight has the king’s mark on its shoulder now.'),
            px('She promised. She promised you. Ruling: Hornet is coming. I’m so pleased I could bite the cabinet.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-15-complete',
      lines: [
        n('The ash keeps falling, softer now. The grub in your coat has gone to sleep, warm against you.'),
        n('The Knight looks back down the ridge, the way you’ve come, then forwards, the way it has to go.'),
        px('One more stop. Quirrel said something about the rain. I think I know where he is.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'pa3-15': true },
    notes:
      'HORNET PAYOFF 2 (pa3-hornet). As written, pa3-15-test is for back: she speaks to you and promises to come. For ' +
      'stood, play PA3_VARIANTS pa3-15-test-stood in place of pa3-15-test and pa3-15-test-done-stood in place of ' +
      'pa3-15-test-done (she tests the Knight and never speaks to you). GRUB 12 of 12: it does not burrow; you carry ' +
      'it home in its open jar (a small jar icon in the HUD) until PA3-17.',
  },

  // ---------------------------------------------------------------- PA3-16
  {
    id: 'pa3-16',
    code: 'PA3-16',
    title: 'Blue Lake',
    source: src('Quirrel at Blue Lake'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-15') },
    requires: ['PA3-15'],
    speakers: [QUIRREL],
    steps: [
      {
        id: 'pa3-16-s1',
        goal: 'Walk to the lake where the city’s rain begins.',
        hint: 'Follow the rain uphill. Where the water collects, someone is sitting.',
        check: 'walk:pa3-blue-lake:shore',
        scene: {
          id: 'pa3-16-walk',
          lines: [
            n('Above the City of Tears, the rain comes from somewhere. You follow it uphill through a quiet tunnel.'),
            n('It opens onto a lake of very clear blue water, so still that the cave roof sits in it upside down.'),
            n('On the shore, sitting on a rock, with his nail planted in the sand beside him, is Quirrel.'),
            px('There he is. I knew he’d be somewhere with water. He likes water.', 'soft'),
            n('The Knight stops at the edge of the sand, and lets you go first.'),
            n('Your Nubbin runs ahead, and climbs into Quirrel’s lap, and sits there. Quirrel laughs.'),
          ],
        },
      },
      {
        id: 'pa3-16-s2',
        goal: 'Sit with Quirrel by the lake.',
        hint: 'There’s room on the rock. There always is, with Quirrel.',
        check: 'sit:pa3-quirrel:blue-lake',
        scene: {
          id: 'pa3-16-shore',
          lines: [
            l('pa3-quirrel', 'You came! And the small one, and the quiet one. I hoped you might. Sit, sit.', 'happy'),
            n('You sit beside him on the rock, as you did at the Lake of Unn. You can see he remembers.'),
            l('pa3-quirrel', 'Do you remember I said I’d seen this kingdom before? I was right. I have. Twice now.', 'soft'),
            l('pa3-quirrel', 'Once long ago, when I was her student, and I forgot. And once now, with you. I’m glad of both.'),
            l('pa3-quirrel', 'I came down here not knowing why. Now I know. I came to let my teacher rest. And I did.'),
            n('He looks at the water for a while. Your Nubbin has gone to sleep in his lap.'),
            l('pa3-quirrel', 'Will you do something for me? Tell someone I was here. Anyone. That’s all.', 'soft'),
            l('pa3-quirrel', 'It’s silly, I know. But if somebody knows, then I was. Do you see?'),
          ],
          choices: [
            {
              id: 'promise',
              label: '“I’ll tell someone. I promise.”',
              then: [
                l('pa3-quirrel', 'Then I’m content. Thank you, friend.', 'happy'),
                px('I heard. That counts. I’m someone. I’ll tell more someones. Quirrel was here.', 'soft'),
              ],
            },
            {
              id: 'pixel',
              label: '“Pixel’s listening. She already knows.”',
              then: [
                px('…Hello, Quirrel. I’m Pixel. You were here. I’ve written it down. In pen.', 'soft'),
                l('pa3-quirrel', 'Oh! A voice from the sky. Hello, Pixel. Thank you. That’s much better than I hoped.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'pa3-16-shore-done',
          lines: [
            n('He gives your sleeping Nubbin back to you, very carefully, the way you held the flower.'),
            l('pa3-quirrel', 'Go on. The end’s that way. I’m going to sit here a bit longer.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-16-complete',
      lines: [
        n('At the top of the tunnel you look back. The rock is empty.'),
        n('Only his nail is there, planted in the sand by the water, with the rain beginning above it.'),
        px('He’s gone. Just… gone on. He’d finished. I think that’s all right. I think he thought so.', 'sad'),
        px('I’m making one. A nail, like his. Out of Brisk’s offcuts. For your cottage wall.', 'soft'),
        px('Not his. His stays in the sand. Ours is so that somebody always knows he was here.'),
      ],
    },
    rewards: [
      {
        id: 'pa3-quirrel-nail',
        kind: 'decor',
        label: 'Quirrel’s nail (a copy)',
        description: 'Pixel’s wooden copy of Quirrel’s nail, made from Workyard offcuts, to hang on the cottage wall. So somebody always knows he was here.',
      },
    ],
    sets: { 'pa3-16': true },
    notes:
      'QUIRREL PAYOFF (pa3-quirrel). As written (pa3-16-shore and its done scene) is for sat: the longer scene, and he ' +
      'asks you to tell someone he was here. For passed, play PA3_VARIANTS pa3-16-shore-passed in place of ' +
      'pa3-16-shore and drop pa3-16-shore-done; the check is the same. CARE: Quirrel’s going is told by the empty rock ' +
      'and the planted nail, never shown. The nail decor is given either way.',
  },

  // ---------------------------------------------------------------- PA3-17
  {
    id: 'pa3-17',
    code: 'PA3-17',
    title: 'The Grubs Go Home',
    source: src('the Grubfather’s reward'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-16') },
    requires: ['PA3-16'],
    speakers: [],
    steps: [
      {
        id: 'pa3-17-s1',
        goal: 'Take the twelfth grub home to the Grubfather.',
        hint: 'Back to the cavern of egg-houses. The tram goes most of the way.',
        check: 'deliver:pa3-grub:12',
        scene: {
          id: 'pa3-17-cavern',
          lines: [
            n('The cavern of egg-houses. Eleven of the little doorways have somebody in them now, looking out.'),
            n('The Grubfather sees you and makes the kettle noise, very loudly.'),
            n('You take the jar out of your coat. The twelfth grub wakes up, looks out, and sees its dad.'),
            n('It finds the strength to wriggle out, after all, and flops onto him, and stays there.'),
            px('That’s twelve. We said twelve. We did twelve.', 'happy'),
            n('Your Nubbin tries to climb on the Grubfather too. There’s room; there’s always room on him.'),
          ],
          choices: [
            {
              id: 'pat',
              label: 'Pat the Grubfather.',
              then: [n('He is still so soft that your arm goes in up to the elbow. He makes the kettle noise again, quietly.')],
            },
            {
              id: 'count',
              label: 'Count the faces in the doorways.',
              then: [n('Twelve, with the one on his back; the other doorways are still empty. Someone else will come.')],
            },
          ],
        },
        done: {
          id: 'pa3-17-cavern-done',
          lines: [
            n('The Grubfather sighs a big contented sigh. He looks at the bench at the cavern’s mouth, then at you.'),
            px('He wants you to sit down. You’ve been walking for an age. Go on. Sit.'),
          ],
        },
      },
      {
        id: 'pa3-17-s2',
        goal: 'Rest on the bench for a bit.',
        hint: 'Sit on the bench at the cavern’s mouth. Take as long as you like.',
        check: 'sit:pa3-bench:grub-cavern',
        scene: {
          id: 'pa3-17-bench',
          lines: [
            n('You sit on the bench, with your Nubbin on your knee. The Knight, after a moment, sits on the other end.'),
            n('It hasn’t sat down once, this whole way. It sits like it’s trying it out.'),
            px('It sat down. With us. I’ve got goosebumps. It’s a bench. I’ve got goosebumps about a bench.'),
            n('Your Nubbin falls asleep, and you nearly do. Behind you, the cavern goes very, very quiet.'),
            n('Suspiciously quiet.'),
            n('Then a sound, like someone finishing a large bowl of soup. A small, contented gulp.'),
          ],
        },
        done: {
          id: 'pa3-17-bench-done',
          lines: [
            n('You go back in.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-17-complete',
      lines: [
        n('The Grubfather is lying on his back, very round, very happy. Every one of the doorways is empty.'),
        px('Did he… did he EAT them?', 'shock'),
        n('He pats his tummy. From inside comes a happy, muffled wriggle: twelve wriggles.'),
        px('They’re fine. It’s on the box. It’s how they grow up. They go in grubs and come out grubberflies.', 'think'),
        px('I mean. It’s a choice. As parenting goes. But it’s THEIR choice.'),
        n('Pixel starts laughing, then can’t stop. You hear her chair scrape: she’s had to sit on the floor.'),
        px('…Ruling: best ending to a fetch quest ever made. The empty jar’s yours. Keep it. Put a candle in it.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'pa3-grub-lantern',
        kind: 'decor',
        label: 'Empty grub jar lantern',
        description: 'The twelfth grub’s jar, with a candle in it now. The grub went home, and grew up, in its own way.',
      },
    ],
    sets: { 'pa3-17': true },
    notes:
      'CARE: the swallowing is joy, not horror. Show only a round, happy Grubfather on his back and twelve tiny wriggles ' +
      'under his skin; Pixel says plainly that they’re fine. The Knight sitting on the bench is its only sit in the ' +
      'whole cartridge: a two-frame sit-down, slightly awkward. Requires all twelve grub checks (they’re all on the ' +
      'quest chain, so they are always done by now).',
  },

  // ---------------------------------------------------------------- PA3-18
  {
    id: 'pa3-18',
    code: 'PA3-18',
    title: 'The Black Egg',
    source: src('the Black Egg Temple, the Hollow Knight and the Radiance'),
    audience: 'all',
    trigger: { where: WHERE, when: after('PA3-17') },
    requires: ['PA3-17'],
    speakers: [HORNET, ELDERBUG],
    steps: [
      {
        id: 'pa3-18-s1',
        goal: 'Go into the Black Egg Temple with the Knight.',
        hint: 'The temple is in the Crossroads, where you started. All three seals are open now.',
        check: 'visit:pa3-black-egg:temple',
        scene: {
          id: 'pa3-18-temple',
          lines: [
            n('Back in the Crossroads, where you began, stands a temple shaped like a great black egg. The seals are gone.'),
            n('Inside, at the bottom of a deep chamber, hangs a tall figure in chains. A horned mask, very like the Knight’s.'),
            n('It is the Hollow Knight: the one from the statue, the one the king chose.'),
            n('There’s a crack across its mask, and orange light leaking out of it, like a fever.'),
            px('It’s been holding the light. All this time. In there. Since before Elderbug was old.', 'sad'),
            n('The Knight walks down and looks up at its sibling. Its sibling, slowly, looks down.'),
            n('The Knight raises its nail and cuts the chains, one by one. They fall like slow rain.'),
          ],
          choices: [
            {
              id: 'lantern',
              label: 'Hold your lantern up, so the Knight can see.',
              then: [n('You lift the lantern as high as it goes. It isn’t much, down here, but the Knight glances up at it once.')],
            },
            {
              id: 'nubbin',
              label: 'Hold your Nubbin close.',
              then: [n('You pick your Nubbin up. It doesn’t hide its face, but watches the Knight, and so do you.')],
            },
          ],
        },
        done: {
          id: 'pa3-18-temple-done',
          lines: [
            n('The Hollow Knight stands, and the orange light flares up in it. It lifts its own nail, and they fight.'),
            n('You stand at the top of the chamber with your lantern, and your Nubbin, and you don’t look away.'),
          ],
        },
      },
      {
        id: 'pa3-18-s2',
        goal: 'Stay with the Knight until the end.',
        hint: 'It isn’t your fight. Keep your lantern lit. That’s what you can do.',
        check: 'watch:pa3-black-egg:end',
        scene: {
          id: 'pa3-18-end',
          lines: [
            n('The fight is long. The Hollow Knight is strong, and the light inside it is stronger.'),
            n('Then a red cloak drops from the dark above, and a thread of silk whips round the Hollow Knight’s arms.'),
            l('pa3-hornet', 'I said I would come.', 'angry'),
            n('Hornet pulls the thread tight, and the Hollow Knight is held. She looks up at you, once, and nods.'),
            n('The Knight raises the Dream Nail, and touches its sibling, and goes into its dream.'),
            n('You see it on the cabinet screen: a dream of blinding light, and in the middle of it, the light’s own shape.'),
            px('That’s it. That’s the Radiance. That’s the thing that sang them all to sleep.', 'shock'),
            n('Behind the Knight, the dark rises like a tide coming in. It is thousands of small horned masks, all of them.'),
            n('All the ones from the Abyss, who saw the lighthouse. They came.'),
            n('The dark goes over the light softly, like water over a candle. And the light goes out.'),
            n('Two small figures stand in the dark together: the Knight and its sibling. They turn, and walk home.'),
            n('Into the dark they came from: not away, but home. The egg is gone, and only quiet is left.'),
          ],
        },
        done: {
          id: 'pa3-18-end-done',
          lines: [
            n('Hornet stands alone in the empty chamber, with her needle, in the first quiet for an age.'),
            n('She looks at the place where the egg was for a long time. Then she looks at you.'),
            l('pa3-hornet', 'It’s over. Go home, traveller. And thank you. For the open hands.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa3-18-complete',
      lines: [
        n('Up the well, into the rain. Elderbug is on his bench, and he stands up when he sees you.'),
        l('pa3-elderbug', 'You came back up! Nobody comes back up. Oh, I’m so glad.', 'happy'),
        l('pa3-elderbug', 'Here. I carved this while I waited. For travellers. I’ve always had one ready, just in case.'),
        n('He gives your Nubbin a tiny mask, pale, with two little horns. Your Nubbin puts it on at once.'),
        n('It tilts its head at you. Exactly the way the Knight did.'),
        px('Oh, that’s not fair. That’s not fair at all. I’m crying on the cabinet. It’s fine. It’s wipe-clean.', 'sad'),
        px('Cartridge done. Your name’s on the high-score plate. For the record: you never hit anything once.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'pa3-mask',
        kind: 'cosmetic',
        label: 'Pale horned mask',
        description: 'A little pale mask with two small horns, carved by Elderbug for travellers. For your Nubbin.',
      },
      {
        id: 'pa3-high-score',
        kind: 'feature',
        label: 'High-score plate: The Hollow Kingdom',
        description: 'Your name on the cabinet’s brass plate for this cartridge. It counts towards High Score Night.',
      },
    ],
    sets: { 'pa3-18': true, 'pa3-done': true },
    notes:
      'ENDINGS (pa3-ending, set by the sim when step 2 begins, from pa3-abyss and pa3-hornet):\n' +
      '  - home (abyss = waited, hornet = back): as written. pa3-18-end, pa3-18-end-done, pa3-18-complete.\n' +
      '  - late (abyss = waited, hornet = stood): play PA3_VARIANTS pa3-18-end-late in place of pa3-18-end, and ' +
      'pa3-18-end-done-late in place of pa3-18-end-done; pa3-18-complete as written.\n' +
      '  - sealed (abyss = hurried, either Hornet): play pa3-18-end-sealed in place of pa3-18-end and ' +
      'pa3-18-complete-sealed in place of pa3-18-end-done AND pa3-18-complete. Rewards are still given (one-time). Then ' +
      'offer the Abyss save (see PA3-14 notes): a cartridge choice, “Go back to before the Abyss”, which replays from ' +
      'PA3-14. If the player later reaches home or late, pa3-18-complete plays then (the mask is not given twice).\n' +
      'CARE: the siblings’ ending is a homecoming into the dark, not a death on screen. The Radiance is a shape of light, ' +
      'never a face in pain; it goes out like a candle. The sealed ending is sad and replayable, and the plaque stays.',
  },
];

// ------------------------------------------------------------------ variants

/**
 * Variant scenes, picked by flags. Where each plays is in the owning quest's notes.
 * - Clank (Grove s21Done, read only): pa3-01-clank, pa3-07-clank, pa3-13-clank.
 * - The flower breaking (any knock, PA3-9 to PA3-12): pa3-09-broken.
 * - Hornet (pa3-hornet = stood): pa3-11-den-stood, pa3-11-den-done-stood, pa3-15-test-stood,
 *   pa3-15-test-done-stood.
 * - Quirrel (pa3-quirrel = passed): pa3-16-shore-passed.
 * - The Abyss (pa3-abyss = hurried): pa3-14-complete-hurried.
 * - The endings (pa3-ending): pa3-18-end-late, pa3-18-end-done-late, pa3-18-end-sealed,
 *   pa3-18-complete-sealed.
 */
export const PA3_VARIANTS: Scene[] = [
  {
    id: 'pa3-01-clank',
    lines: [
      n('On top of the cabinet, Clank swivels his eye down at the cartridge.'),
      l('clank', 'Announcement: a NEW GAME! Announcement: it has a MASK on it! Is it a party? Is it a SAD party?', 'happy'),
      px('It’s a sad party, Clank. Sit still. You can watch, but you can’t press anything.'),
      l('clank', 'I will watch SO hard.'),
    ],
  },
  {
    id: 'pa3-07-clank',
    lines: [
      px('…Clank?'),
      n('Through the speaker, the cabinet is quieter than it’s been all day. No beeping, no announcing.'),
      px('He’s just sitting there. He stopped when I said “vessel”. He’s looking at his own hands.', 'soft'),
      l('clank', 'Announcement… no announcement.', 'sad'),
      px('Hey. You’re not a vessel. You’re Clank. You’re an announcer. You’re my best announcer.', 'soft'),
      l('clank', '…Okay.', 'soft'),
    ],
  },
  {
    id: 'pa3-13-clank',
    lines: [
      n('On the cabinet, Clank has put his hands over his eye.'),
      px('You can come down, Clank. Come and sit on my lap. Nobody here is choosing anybody.', 'soft'),
      n('A clank, a scrape, and a small metal weight settles somewhere near Pixel. She doesn’t say anything else for a bit.'),
    ],
  },
  {
    id: 'pa3-09-broken',
    lines: [
      n('A knock. The flower shivers, and its petals come away all at once, like breath on a cold window.'),
      px('Oh no. Oh, no no. Flower status: not a flower.', 'sad'),
      px('It’s all right. She said she’d give you another. She’s grown loads. Back to the grey house.', 'soft'),
      l('pa3-mourner', 'It broke? Then here. Don’t be sorry. It means you were carrying it. Carry this one.', 'soft'),
    ],
  },
  {
    id: 'pa3-11-den-stood',
    lines: [
      n('Hornet stands in the doorway with her needle in her hand. She isn’t looking at you; she’s looking at the empty silk.'),
      n('She walks past you, past the Knight, to the bed of silk, and stands there, very straight.'),
      px('That was her mum. Herrah was her mum.', 'sad'),
      n('You take a step towards her, and her needle comes up, level, between you. She doesn’t turn round.'),
      l('pa3-hornet', 'You stood your ground in Greenpath. Stand it somewhere else.', 'angry'),
      l('pa3-hornet', 'Both of you. Go. Leave me here.'),
      n('The Knight goes. You go too, with your Nubbin, and the flower held close, and sit outside the den in the dark.'),
    ],
    choices: [
      {
        id: 'wait',
        label: 'Sit outside, and wait where she can’t see you.',
        then: [n('After a long time you hear one small sound from the den, and then nothing. You don’t go in.')],
      },
      {
        id: 'go',
        label: 'Go, as she asked.',
        then: [n('You go, as she asked. Your Nubbin looks back once; you don’t.')],
      },
    ],
  },
  {
    id: 'pa3-11-den-done-stood',
    lines: [
      n('When she comes out, she walks past you as if you were a stone. She has a thread of silk wound round one wrist.'),
      px('She’s not angry. Well. She is. But not mostly. Mostly she’s just on her own.', 'sad'),
    ],
  },
  {
    id: 'pa3-15-test-stood',
    lines: [
      n('On a high ridge, in the ash, a red cloak. Hornet stands in front of a stone door with a mark burned on it.'),
      l('pa3-hornet', 'So you made it. Behind me is the king’s mark. Take it, and you can go to the very end.'),
      l('pa3-hornet', 'But first, show me you’re strong enough to hold what you’ll find.'),
      n('They fight, quick and hard in the falling ash. You stand well back this time, and your Nubbin covers its eyes.'),
      n('Then it’s over, and Hornet steps aside. The Knight walks past her, and puts its hand on the mark.'),
      n('Hornet doesn’t look at you. She speaks to the Knight only, low, and you don’t catch the words.'),
      px('She’s not talking to us. That’s fair. We stood in her way once. She remembers.', 'think'),
    ],
  },
  {
    id: 'pa3-15-test-done-stood',
    lines: [
      n('She throws her thread up into the ash, and is gone without a glance. The Knight has the king’s mark now.'),
      px('Ruling: we don’t know if she’s coming. I hope she is. Not for us. For it.', 'soft'),
    ],
  },
  {
    id: 'pa3-16-shore-passed',
    lines: [
      l('pa3-quirrel', 'Oh! The travellers from the lake. You waved. I remember. Hello again.', 'happy'),
      n('You sit beside him on the rock. He moves up to make room, though there was room already.'),
      l('pa3-quirrel', 'I’ve seen this kingdom twice now. Once long ago, when I forgot. And once now. I’m glad of both.', 'soft'),
      l('pa3-quirrel', 'I came to let my teacher rest. And I did. So I think I’m finished. It’s a nice feeling.'),
      n('He looks at the water for a while. Then he gives your Nubbin a pat, and stands, and looks at his nail.'),
      l('pa3-quirrel', 'Go on. The end’s that way. I’m going to stay here a bit.'),
    ],
  },
  {
    id: 'pa3-14-complete-hurried',
    lines: [
      n('At the bottom of the shore path, the shades fall behind, still pressing at the dark where the Knight was.'),
      n('The Knight looks back at them once, then walks on. The charm in its hand stays white.'),
      px('We got through. That’s… we got through. I don’t know if that was right. I don’t think there’s a wrong.', 'think'),
      px('I’m keeping a save from just before. In case. That’s all. Just in case.', 'soft'),
    ],
  },
  {
    id: 'pa3-18-end-late',
    lines: [
      n('The fight is long. The Hollow Knight is strong, and the light inside it is stronger.'),
      n('The Knight is down on one knee. The Hollow Knight raises its nail.'),
      n('Then a red cloak drops from the dark above, late, and a thread of silk whips round the Hollow Knight’s arms.'),
      l('pa3-hornet', 'I promised myself. Not you.', 'angry'),
      n('She holds the thread tight. She doesn’t look at you, not once.'),
      n('The Knight raises the Dream Nail, and touches its sibling, and goes into its dream.'),
      px('That’s the Radiance. That’s the thing that sang them all to sleep.', 'shock'),
      n('Behind the Knight, the dark rises like a tide coming in. It is thousands of small horned masks, all of them.'),
      n('The dark goes over the light softly, like water over a candle. And the light goes out.'),
      n('Two small figures stand in the dark together: the Knight and its sibling. They turn, and walk home.'),
      n('Into the dark they came from: not away, but home. The egg is gone, and only quiet is left.'),
    ],
  },
  {
    id: 'pa3-18-end-done-late',
    lines: [
      n('Hornet stands alone in the empty chamber, with her needle, in the first quiet for an age.'),
      n('She looks at the place where the egg was for a long time. Then she leaves, the other way, without a word.'),
      px('She came anyway. Because she said she would, to herself. That’s a good reason. It’s maybe the best one.', 'soft'),
    ],
  },
  {
    id: 'pa3-18-end-sealed',
    lines: [
      n('The fight is long. The Hollow Knight is strong, and the light inside it is stronger.'),
      n('Nobody comes. The Knight fights on alone, and wins, and its sibling falls still in the dark.'),
      n('Then the Knight does a strange thing. It walks to the empty chains, and stands in them, and waits.'),
      n('The orange light comes out of its sibling and goes into the Knight, quietly, like water finding a new jar.'),
      n('The chains close, and the doors of the temple close. The seals come back, one, two, three.'),
      px('It took its place. It’s holding the light now. So the kingdom stays as it is.', 'sad'),
      px('Safe. And still. The old way.', 'sad'),
    ],
  },
  {
    id: 'pa3-18-complete-sealed',
    lines: [
      n('You stand outside the black egg in the Crossroads. Your Nubbin puts both hands flat on the shell, and listens.'),
      n('Up in the city, in the rain, the statue still stands, and the plaque is still there. Somebody will read it.'),
      px('…There’s a save from before the Abyss.', 'soft'),
      px('I’m not saying you have to. I’m just saying it’s there. The cartridge keeps it. Like the box said. Keep.', 'soft'),
    ],
    choices: [
      {
        id: 'back',
        label: 'Go back to before the Abyss.',
        then: [px('Loading. Lighthouse switch is on the left. I’m just saying.', 'soft')],
      },
      {
        id: 'stay',
        label: 'Leave it as it is, for now.',
        then: [px('All right. It’ll keep. Come back up. Elderbug will want to see you.', 'soft')],
      },
    ],
  },
];

// ------------------------------------------------------------------ flags and checks

export const ARCADE_PA3_FLAGS: string[] = [
  'pa3-01',
  'pa3-02',
  'pa3-03',
  'pa3-04',
  'pa3-05',
  'pa3-06',
  'pa3-07',
  'pa3-08',
  'pa3-09',
  'pa3-10',
  'pa3-11',
  'pa3-12',
  'pa3-13',
  'pa3-14',
  'pa3-15',
  'pa3-16',
  'pa3-17',
  'pa3-18',
  'pa3-done',
  'pa3-hornet',
  'pa3-quirrel',
  'pa3-abyss',
  'pa3-ending',
];

export const ARCADE_PA3_CHECKS: string[] = [
  'inspect:pa3-cartridge:lantern-shed',
  'climb:pa3-well:dirtmouth',
  'walk:pa3-crossroads:behind-knight',
  'collect:pa3-grub:01',
  'find:pa3-grubfather:grub-cavern',
  'choose:pa3-promise:grub-cavern',
  'collect:pa3-grub:02',
  'choose:pa3-hornet:greenpath',
  'collect:pa3-grub:03',
  'talk:pa3-quirrel:lake-of-unn',
  'collect:pa3-grub:04',
  'watch:pa3-mantis-lords:throne-hall',
  'visit:pa3-memorial:city-square',
  'collect:pa3-grub:05',
  'collect:pa3-grub:06',
  'visit:pa3-dreamer-shrine:resting-grounds',
  'talk:pa3-seer:dream',
  'talk:pa3-mourner:grey-house',
  'collect:pa3-grub:07',
  'sit:pa3-lurien:watchers-spire',
  'collect:pa3-grub:08',
  'sit:pa3-herrah:deepnest-den',
  'sit:pa3-hornet:deepnest-den',
  'collect:pa3-grub:09',
  'deliver:pa3-delicate-flower:queens-gardens',
  'collect:pa3-grub:10',
  'talk:pa3-lady:root-room',
  'visit:pa3-white-palace:dream',
  'puzzle:pa3-palace-timings:white-palace',
  'watch:pa3-king-memory:white-palace',
  'collect:pa3-grub:11',
  'explore:pa3-abyss:sea',
  'choose:pa3-abyss:lighthouse',
  'collect:pa3-grub:12',
  'watch:pa3-hornet-test:kingdoms-edge',
  'walk:pa3-blue-lake:shore',
  'sit:pa3-quirrel:blue-lake',
  'deliver:pa3-grub:12',
  'sit:pa3-bench:grub-cavern',
  'visit:pa3-black-egg:temple',
  'watch:pa3-black-egg:end',
];
