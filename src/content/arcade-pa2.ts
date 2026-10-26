/**
 * Pixel's Arcade, cartridge PA2: The Clone Island (Part M, rank 17). Eighteen quests, PA2-1 to PA2-18.
 *
 * SOURCE. Pokémon: The First Movie (Mewtwo Strikes Back), OLM for Toho, Japan, 18 July 1998; English
 * release November 1999. We follow the Japanese kanzenban cut, with its origin short (The Birth of
 * Mewtwo), because the short holds the film's heart. Names are the English ones (Ash, Misty, Brock,
 * Dr Fuji). The English dub's added "violence is wrong" framing is left out; the story makes that point
 * on its own. Rights: Pokémon is © Nintendo, Game Freak and Creatures; the film is © The Pokémon Company
 * and its producers. THIS CARTRIDGE CANNOT SHIP IN A COMMERCIAL BUILD WITHOUT A LICENCE FROM THE POKÉMON
 * COMPANY. Without one, rename every person, creature, place and item, and keep only the story's shape.
 * Every creature design must look exactly as licensed, or not appear; none of them ever leaves the cabinet.
 *
 * AUDIENCE. 'all'. A soft content line plays before PA2-2 (pa2-01-complete#4–5, Pixel reading the label).
 * There is no Learning Grove version, because of the licence (see the notes on PA2-18).
 *
 * FRAME. Pixel's Arcade. You slot the cartridge into Pixel's cabinet in the lantern shed and step in with
 * your Nubbin. You come out on a hillside above a harbour town. Pixel (she/her) stays at the controls as
 * player two and talks through the cabinet's speaker. Byte has come to "check the maths" and stands behind
 * her chair. You are a visiting trainer with an invitation, never Ash, and you never battle: you carry,
 * hold doors, open pods and stand at the edge of the storm. Your Nubbin is not a Pokémon, and Mewtwo has no
 * record of one. Your Nubbin never speaks. Pikachu and Mew never speak (narration only); Meowth talks, as
 * in the film, and Mewtwo speaks mind to mind.
 *
 * GROVE FLAGS READ (read-only; a cartridge never writes a Grove flag):
 *   - s7Done (S7, Unverified: Byte, Null and the bell timer). Read when the cartridge starts; held for the
 *     whole run.
 *       - PA2-1: ARCADE_PA2_VARIANTS pa2-01-title-s7 replaces pa2-01-title. Byte stops talking when the title
 *         comes up and doesn't start again. Without it, Byte says you can't clone anything from an eyelash,
 *         not reliably, and goes for a biscuit.
 *       - PA2-4: pa2-04-complete-s7 replaces pa2-04-complete (Byte says nothing; without it, his chair is
 *         empty and the biscuit tin isn't back yet). Pixel's quiet line plays in both.
 *       - PA2-15: pa2-15-tears-s7 replaces pa2-15-tears. "I gave Null a bell for everything. I never asked
 *         Null what it wanted." Pixel reaches back and holds his sleeve. Without it, Byte is back with the
 *         biscuits and stops chewing.
 *   - s21Done (S21, CL-4NK), the frame's rule: Clank sits on top of the cabinet. ARCADE_PA2_VARIANTS
 *     pa2-01-shed-clank replaces pa2-01-shed. Clank is not mentioned anywhere else in the cartridge.
 *
 * FLAGS WRITTEN (the Arcade save only, all prefixed pa2-):
 *   - pa2-01 … pa2-18 on each quest's completion; pa2-done with PA2-18 (High Score Night counts it).
 *   - pa2-name = own | borrowed (pa2-09-pod, the signature choice). own also asks the player to type a
 *     name for the clone (SIM, below). Paid off in PA2-13, PA2-16 and PA2-18.
 *   - pa2-late = named | unnamed (pa2-16-name-borrowed, only on the borrowed path): the last chance.
 *     named asks for a name the same way.
 *
 * LIFTED TEXT (copyrighted source: the outline allows at most three one-sentence lines; one is used):
 *   1. Mewtwo, PA2-16: "I see now that the circumstances of one's birth are irrelevant." The 4Kids English
 *      dub, as printed in The Art of Pokémon, The First Movie. At pa2-16-understand#3, with childLines.
 *   All other dialogue is new. The film's songs, including the end-credits song, are not used at all.
 *
 * CARE NOTES.
 *   - Deaths. Amber and the three copies fade in PA2-2 softly, like a Nubbin fading: light going out, no
 *     bodies. In the film Fuji and his team die in the lab fire. Here it is fire seen from the cliff in
 *     the rain, and nobody is shown, named as dead, or said to have got out (PA2-3).
 *   - The fight without powers (PA2-13) is sad, never exciting: no hit sounds, slow music, and the camera
 *     on Pikachu's face. Your Nubbin never shoves back.
 *   - Ash turned to stone (PA2-14) is a sleep, not a death. The tears wake him in the next quest, and
 *     PA2-14's complete scene says plainly that the story is not over.
 *   - Your Nubbin's clone is never a monster or "the evil one". It is frightened and new. No line calls
 *     it a copy as an insult; the word "copy" is only ever the machine's, Meowth's or Fuji's.
 *   - Hazel's third rule is acted (Meowth and his clone, PA2-13; your Nubbin beside Pikachu, PA2-14), and
 *     never quoted.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade)';
const after = (code: string) => `Any time after ${code}, from Pixel’s cabinet.`;
const FILM = 'Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut';

// ------------------------------------------------------------------ speakers

const MEWTWO = sp('pa2-mewtwo', 'Mewtwo', `Mewtwo, the made creature; speaks mind to mind (${FILM}); licensed design`);
const AMBER = sp('pa2-amber', 'Amber', `Ambertwo, the copy of Dr Fuji’s late daughter, from the origin short The Birth of Mewtwo (${FILM})`);
const FUJI = sp('pa2-fuji', 'Dr Fuji', `Dr Fuji, the scientist who made Mewtwo (${FILM})`);
const GIOVANNI = sp('pa2-giovanni', 'Giovanni', `Giovanni, the boss of Team Rocket, who paid for the lab (${FILM})`);
const ASH = sp('pa2-ash', 'Ash', `Ash Ketchum (${FILM}); licensed design`);
const MISTY = sp('pa2-misty', 'Misty', `Misty (${FILM}); licensed design`);
const BROCK = sp('pa2-brock', 'Brock', `Brock (${FILM}); licensed design`);
const RAYMOND = sp('pa2-raymond', 'Raymond', `Raymond, the trainer who challenges Ash at lunch (${FILM})`);
const MIRANDA = sp('pa2-miranda', 'Miranda', `Miranda, the pier keeper at Old Shore Wharf, who tells the old story (${FILM})`);
const JESSIE = sp('pa2-jessie', 'Jessie', `Jessie of Team Rocket (${FILM}); licensed design`);
const JAMES = sp('pa2-james', 'James', `James of Team Rocket (${FILM}); licensed design`);
const MEOWTH = sp('pa2-meowth', 'Meowth', `Meowth of Team Rocket, the talking Pokémon (${FILM}); licensed design`);
const JOY = sp('pa2-joy', 'Nurse Joy', `Nurse Joy of Old Shore Wharf, first seen as Mewtwo’s cloaked messenger (${FILM}); licensed design`);
const NEESHA = sp('pa2-neesha', 'Neesha', `Neesha, one of the invited trainers (${FILM})`);
const FERGUS = sp('pa2-fergus', 'Fergus', `Fergus, one of the invited trainers (${FILM})`);
const COREY = sp('pa2-corey', 'Corey', `Corey, one of the invited trainers (${FILM})`);
/** The same Clank as S21 (side-stories-new-4.ts) and A13; shared id. Only with s21Done, only in pa2-01-shed-clank. */
const CLANK: Speaker = {
  id: 'clank',
  name: 'Clank',
  kind: 'other',
  basedOn: 'Claptrap, the CL4P-TP unit (Borderlands), reference only',
};

const N = say('narrator');
const Y = say('you');
const P = say('pixel');
const B = say('byte');
const CK = say('clank');
const MT = say('pa2-mewtwo');
const AM = say('pa2-amber');
const FU = say('pa2-fuji');
const GI = say('pa2-giovanni');
const AS = say('pa2-ash');
const MI = say('pa2-misty');
const BR = say('pa2-brock');
const RA = say('pa2-raymond');
const MR = say('pa2-miranda');
const JE = say('pa2-jessie');
const JA = say('pa2-james');
const ME = say('pa2-meowth');
const JO = say('pa2-joy');
const NE = say('pa2-neesha');
const FE = say('pa2-fergus');
const CO = say('pa2-corey');

/** The one lifted line (see LIFTED TEXT). */
const BIRTH_QUOTE = 'I see now that the circumstances of one’s birth are irrelevant.';

// =================================================================== THE CLONE ISLAND

export const ARCADE_PA2: Quest[] = [
  // ---------------------------------------------------------------- PA2-1
  {
    id: 'pa2-01',
    code: 'PA2-1',
    title: 'The Cabinet',
    source: `${FILM}: the frame`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Pixel’s cabinet stands in the lantern shed (after chapter 5); cartridges play in any order.',
    },
    speakers: [CLANK],
    steps: [
      {
        id: 'pa2-01-s1',
        goal: 'Help Pixel slot the purple cartridge into the cabinet.',
        hint: 'Go to the lantern shed and inspect the cartridge on Pixel’s bench.',
        check: 'inspect:pa2-cartridge:cabinet',
        scene: {
          id: 'pa2-01-shed',
          lines: [
            N('The lantern shed smells of solder and old sawdust. The cabinet hums in the corner, under a string of lantern bulbs.'),
            N('Pixel is sitting on an upturned crate in front of it, with a cartridge in her lap.'),
            P('Found this one wedged behind the coin box. With the mouse nest. The mice had good taste.', 'happy'),
            N('She blows the dust off. The label is faded, but there is a shape on it, purple, with a long tail.'),
            P('Purple’s the hardest ink to keep. It’s always the first to go.', 'think'),
            N('Byte is standing behind her chair with his arms folded, as if the chair might do something.'),
            B('I’m here to check the maths. Arcades are probability with a coin slot.'),
            P('He’s here because I said there’d be biscuits.'),
            B('That too.'),
            N('One of Byte’s laces is undone. Pixel looks at it, then at him, and says nothing. It is a lot of nothing.'),
            B('I’m aware.'),
            P('I haven’t said a word.'),
            B('You’re saying it very loudly.'),
          ],
          choices: [
            {
              id: 'blow',
              label: 'Blow on the cartridge too, for luck.',
              then: [P('That doesn’t do anything, you know. Electrically.', 'happy'), P('Do it again.', 'happy')],
            },
            {
              id: 'ask',
              label: 'Ask what it’s about.',
              then: [P('No idea. The writing’s gone. I like that, actually. You go in not knowing, like a door.')],
            },
            {
              id: 'byte',
              label: 'Ask Byte what the odds are.',
              then: [B('Of what?'), Y('Of it being good.'), B('Insufficient data. Which is the honest answer to most things.', 'think')],
            },
          ],
        },
        done: {
          id: 'pa2-01-title',
          lines: [
            N('The cartridge goes in with a clunk. The screen fizzes, then a title rises out of the dark: an island, and over it, a shape.'),
            B('If this is about cloning, you can’t clone anything from an eyelash. Not reliably. People think you can.', 'think'),
            B('I’m getting a biscuit.'),
            N('He goes. Pixel watches him go, then turns back to the screen.'),
          ],
        },
      },
      {
        id: 'pa2-01-s2',
        goal: 'Step into the cartridge with your Nubbin.',
        hint: 'Touch the cabinet’s screen with your Nubbin in your arms, then look about the hillside.',
        check: 'explore:pa2-hillside:harbour',
        scene: {
          id: 'pa2-01-step',
          lines: [
            N('You put your hand flat on the glass. It is warm, then warmer, and then it isn’t glass.'),
            N('You are standing on a hillside in long grass, with your Nubbin in your arms. Below you is a harbour town, and a grey sea.'),
            N('There are gulls, and boats knocking together, and a smell of salt and somebody’s chips.'),
            P('Can you hear me? Nod if you can hear me. No, wait, I can’t see you nod. Say something.'),
            Y('I can hear you.'),
            P('Brilliant. I’m player two. I’ve got a little window of you in the corner. You look tiny.', 'happy'),
            N('Your Nubbin wriggles down and sniffs the grass, and sneezes. The grass is the right sort.'),
            N('Far out to sea, under a band of dark cloud, there is an island with something tall on it.'),
          ],
        },
        done: {
          id: 'pa2-01-step-done',
          lines: [
            P('The cartridge says you’re a visiting trainer. With an invitation, it says. You haven’t got it yet.'),
            P('It also says you don’t battle. Good. Neither of you is the battling sort.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-01-complete',
      lines: [
        N('The screen in the corner of the sky flickers. The hillside goes dim, as if a cloud has come over the whole world.'),
        P('Hang on. It’s doing a prologue. There’s a card first, on the back of the label. I’ll read it.'),
        P('“The next part happens before you arrived. You can watch it. You can’t change it.”'),
        N('Your Nubbin comes back and sits on your foot.'),
        P('It says there’s a laboratory, and goodbyes, and a fire seen from a long way off.', 'soft'),
        P('Nobody gets hurt where you can see. And you can come out whenever you like. I’m right here.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'pa2-01': true },
    notes:
      'OPENING: the cabinet is Pixel’s rescued Workyard cabinet in the lantern shed. With s21Done play ARCADE_PA2_VARIANTS ' +
      'pa2-01-shed-clank instead of pa2-01-shed; with s7Done play pa2-01-title-s7 instead of pa2-01-title. Byte is ' +
      'drawn standing behind Pixel’s chair in every cabinet cut-away from here on; without s7Done his place is empty ' +
      'until PA2-15. Pixel’s voice comes through the cabinet speaker, so give it a slight speaker crackle. ' +
      'CONTENT LINE: pa2-01-complete#4 and #5 are the soft content line the outline asks for before PA2-2; show the ' +
      'scene even when the player skips text, and offer a Leave button on the pause menu at all times.',
  },

  // ---------------------------------------------------------------- PA2-2
  {
    id: 'pa2-02',
    code: 'PA2-2',
    title: 'The Voice in the Tank',
    source: `${FILM}: the origin short, The Birth of Mewtwo`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-1') },
    requires: ['PA2-1'],
    speakers: [MEWTWO, AMBER, FUJI],
    steps: [
      {
        id: 'pa2-02-s1',
        goal: 'Watch the laboratory from behind the glass.',
        hint: 'Stand at the observation window and look at the tank in the middle of the room.',
        check: 'watch:pa2-tank:lab',
        scene: {
          id: 'pa2-02-lab',
          lines: [
            N('A dark room full of humming. You are on the far side of a long window, and your Nubbin’s breath fogs the glass.'),
            N('In the middle of the room stands a tank of green water, lit from below. Something curled up is floating in it.'),
            N('It is the size of a child, and it has a tail. Every so often its fingers open and close.'),
            N('Round it stand smaller tanks. In each one floats a little creature: one with a bulb on its back, one with a flame, one with a shell.'),
            N('A grey-haired man in a white coat writes on a clipboard without looking up. He hasn’t looked up for a long time, you think.'),
            P('That’s Dr Fuji. The label says so. He’s the one who made all this.', 'think'),
            N('Then, in the quiet, a voice. Not out loud: inside your head, like remembering a voice.'),
            AM('Hello? Are you awake? You are. I can tell. You went all still.'),
          ],
          choices: [
            {
              id: 'tap',
              label: 'Tap on the glass.',
              then: [N('Your knuckles make no sound at all. The glass might as well be the sky.'), P('Sorry. The prologue doesn’t let anyone touch it. I tried.', 'sad')],
            },
            {
              id: 'still',
              label: 'Keep still and listen.',
              then: [N('You keep still. Your Nubbin keeps still too, its nose against the window, the way it waits for a fish.')],
            },
            {
              id: 'hold',
              label: 'Pick your Nubbin up.',
              then: [N('You pick it up. It is warm and heavy and alive, and it doesn’t take its eyes off the tank.')],
            },
          ],
        },
        done: {
          id: 'pa2-02-lab-done',
          lines: [
            N('The curled thing in the big tank turns its head, very slightly, towards the voice.'),
            MT('Who… is speaking?'),
          ],
        },
      },
      {
        id: 'pa2-02-s2',
        goal: 'Listen to Amber and the new mind talk.',
        hint: 'Stay at the window while the voices talk. There is nothing to press.',
        check: 'watch:pa2-amber:lab',
        scene: {
          id: 'pa2-02-amber',
          lines: [
            AM('I’m Amber. I’m in the tank next to yours. Well, three tanks along. The little ones are in between.'),
            MT('What is a tank?'),
            AM('It’s where we’re growing. Papa says we’re nearly ready. Then we get to go outside.', 'happy'),
            MT('What is outside?'),
            AM('The sun’s outside. It’s warm on your face, and it makes your eyes go small. And there’s rain, which is the sky being wet.'),
            AM('And there are people who are glad to see you. That’s the best bit.', 'happy'),
            N('In the small tanks the three little creatures turn over in their sleep, as if they are listening too.'),
            MT('I would like the sun.'),
            AM('You’ll have it. We’ll go out together and I’ll show you. I’ll show you everything.', 'happy'),
          ],
        },
        done: {
          id: 'pa2-02-amber-done',
          lines: [
            N('Dr Fuji stops writing. He looks at Amber’s tank for a long moment, and takes his glasses off, and puts them back on.'),
            P('He made her to be like someone. Someone he lost. It’s on the card.', 'sad'),
          ],
        },
      },
      {
        id: 'pa2-02-s3',
        goal: 'Stay with them until the prologue ends.',
        hint: 'Wait at the window. You can come out of the cartridge at any time from the pause menu.',
        check: 'wait:pa2-prologue:lab',
        scene: {
          id: 'pa2-02-fade',
          lines: [
            N('In the first of the small tanks, the little creature’s light begins to go out. Slowly, like a lantern turned down.'),
            N('Then the second, then the third. There is nothing left in the water but water.'),
            MT('Where did they go?'),
            AM('I think it’s my turn soon. I can feel it. I’m not frightened, it’s more like being sleepy.', 'soft'),
            MT('Do not go.'),
            AM('Listen. Life is a lovely thing. Even a short one. Remember that, will you? Remember the sun for me.', 'soft'),
            N('Her light goes out the way the others did: no sound, no fuss, only less of it, and then none.'),
            N('Something runs down the face of the creature in the big tank. In the water, you can only just see it.'),
            MT('What is this? My eyes are doing something. I do not have a word for it.'),
            N('Dr Fuji’s hand moves on a switch. The green light dims, and the creature in the tank goes still again.'),
            FU('Sleep. Forget. It will be easier for you.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-02-complete',
      lines: [
        N('The window goes dark. You are standing in the grass again, on the hillside, and it is evening.'),
        N('Your Nubbin is pressed against your shins. Its ball has gone to a spiral.'),
        P('The word was crying. He didn’t have it. He was crying and he didn’t have the word.', 'sad'),
        P('Sorry. I didn’t know it would be that one first.', 'soft'),
        N('You sit down in the grass and let your Nubbin climb into your lap. The sea goes on knocking the boats together below.'),
      ],
    },
    rewards: [],
    sets: { 'pa2-02': true },
    notes:
      'STAGING: the player stands behind a long observation window the whole quest and cannot move past it. ' +
      'Amber, Mewtwo and the three small copies (Bulbasaur, Charmander and Squirtle, as in the short) are only seen ' +
      'floating in tanks. FADING: each copy and Amber fade the way a Nubbin departs in the Grove: the light inside ' +
      'goes down to nothing, the tank stays, there is no body and no flatline sound. Slow, quiet music; no alarms. ' +
      'Mind-to-mind voices (Mewtwo, Amber) get a soft echo and no lip movement. The card in PA2-1 has already given ' +
      'the soft content line.',
  },

  // ---------------------------------------------------------------- PA2-3
  {
    id: 'pa2-03',
    code: 'PA2-3',
    title: 'The Awakening',
    source: `${FILM}: Mewtwo wakes, the lab burns, Giovanni arrives`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-2') },
    requires: ['PA2-2'],
    speakers: [MEWTWO, FUJI, GIOVANNI],
    steps: [
      {
        id: 'pa2-03-s1',
        goal: 'Watch the made creature wake for good.',
        hint: 'The window comes back. Stand at it and watch.',
        check: 'watch:pa2-wake:lab',
        scene: {
          id: 'pa2-03-wake',
          lines: [
            N('The hillside folds away and the window is back. The lab is brighter now and busier, and the small tanks have gone.'),
            N('The big tank is cracked across the middle. The creature in it is grown, and its eyes are open.'),
            N('The glass breaks all at once, softly, like ice in spring. Water runs across the floor to the window.'),
            MT('Where am I? What am I? Who made me, and why?', 'shock'),
            FU('You are awake. Wonderful. Wonderful!', 'happy'),
            FU('You are Mewtwo. You are made from the strongest creature ever found, and made stronger. You are our greatest experiment.'),
            MT('An experiment.'),
            FU('The greatest. Proof of what we can do. Everyone will know it.', 'happy'),
            N('The made creature looks at his own hands, then at the men in white coats, writing it down.'),
            MT('Then I am a thing you did. Not a someone. A thing.', 'angry'),
          ],
          choices: [
            {
              id: 'no',
              label: '“That’s not what he meant.”',
              then: [N('Nobody hears you. You aren’t sure it would be true anyway.')],
            },
            {
              id: 'quiet',
              label: 'Say nothing. Hold your Nubbin.',
              then: [N('You hold your Nubbin. It is the one thing in the room nobody calls an experiment.')],
            },
          ],
        },
        done: {
          id: 'pa2-03-wake-done',
          lines: [
            N('The lights in the lab go white. Then the window goes white too, and you are thrown back to the hillside like a page turning.'),
            P('Get up the hill. Get up the hill, it says, quick.', 'shock'),
          ],
        },
      },
      {
        id: 'pa2-03-s2',
        goal: 'Watch from the cliff as the lab burns in the rain.',
        hint: 'Climb to the top of the cliff path and look out to sea.',
        check: 'climb:pa2-cliff:new-island',
        scene: {
          id: 'pa2-03-fire',
          lines: [
            N('You are on a cliff now, a different one, out at sea. It is night, and it is raining hard.'),
            N('Below you on the shore, the laboratory is burning. Orange through the rain, very far down, very quiet from up here.'),
            N('Nobody is shown. The cartridge keeps the picture on the rain, and the fire, and the sea.'),
            P('I can’t see anyone. It won’t show me. I’ve pressed everything.', 'sad'),
            N('In the middle of the fire, something stands up and walks out of it, and the rain hisses where it steps.'),
            N('He looks back at the burning building once. Then he doesn’t look back again.'),
            N('Your Nubbin is soaked and doesn’t care. It is watching the walking figure, very hard, the way it watches strangers.'),
          ],
        },
        done: {
          id: 'pa2-03-fire-done',
          lines: [
            N('A sound comes over the sea: a helicopter, a light swinging under it. It comes down on the shore beside the fire.'),
            P('Somebody’s been waiting for this. You don’t arrive that fast unless you were waiting.', 'think'),
          ],
        },
      },
      {
        id: 'pa2-03-s3',
        goal: 'See who has come for the made creature.',
        hint: 'Watch the shore below the cliff.',
        check: 'watch:pa2-giovanni:new-island',
        scene: {
          id: 'pa2-03-offer',
          lines: [
            N('A man steps down from the helicopter in a good suit, with an umbrella held over him by somebody else.'),
            GI('Remarkable. They said you would be. They undersold you.'),
            MT('Who are you?'),
            GI('I paid for the building. And the tanks, and the doctor. In a way, I paid for you.'),
            GI('You have more power than anything alive. Nobody has taught you how to use it. I can.'),
            MT('Why would you?'),
            GI('Because a power like yours needs a purpose. I can give you one. Come with me, and you will never wonder what you are for.'),
            N('Mewtwo looks at the fire, and at the rain, and at the man’s hand held out under the umbrella.'),
            N('Then he walks forward into the light of the helicopter.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-03-complete',
      lines: [
        N('The helicopter lifts away. The fire burns down in the rain until it is only smoke and ash.'),
        P('He took the first answer anyone gave him. You would, wouldn’t you. If you had nothing.', 'sad'),
        N('Your Nubbin shakes itself dry all over your trousers, and then looks up at you to see if that was all right.'),
        N('It was. You tell it so.'),
      ],
    },
    rewards: [],
    sets: { 'pa2-03': true },
    notes:
      'FIRE (care note): seen only from the cliff, far below, through heavy rain. No people are drawn anywhere near ' +
      'it; nobody is named as dead, and nobody is said to have escaped either. The only figure is Mewtwo walking ' +
      'out. Rain sound over the fire sound. The helicopter lands on the shore well clear of the fire. Giovanni’s ' +
      'face is lit from below by the helicopter lamp; keep him calm and polite, never sneering.',
  },

  // ---------------------------------------------------------------- PA2-4
  {
    id: 'pa2-04',
    code: 'PA2-4',
    title: 'The Armour',
    source: `${FILM}: Mewtwo at the Viridian Gym`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-3') },
    requires: ['PA2-3'],
    speakers: [MEWTWO, GIOVANNI],
    steps: [
      {
        id: 'pa2-04-s1',
        goal: 'Watch Mewtwo’s battles from the stands at the Viridian Gym.',
        hint: 'Find a seat in the stands and watch the arena floor.',
        check: 'watch:pa2-gym:viridian',
        scene: {
          id: 'pa2-04-stands',
          lines: [
            N('A big hall with a battle floor in the middle and stands all round. You are in the back row with your Nubbin on your knee.'),
            N('On the floor, Mewtwo stands in armour: grey plates on his shoulders and a helmet that hides his face.'),
            N('Cables run from the armour to a box at Giovanni’s side. Giovanni sits in a high chair at the end of the hall.'),
            N('A challenger sends out a creature, and it is over in a breath. Then another, and another, each over as fast.'),
            GI('Next.'),
            N('The crowd stopped cheering a while ago. Now it just watches, the way you watch weather.'),
            P('He’s not even trying. He doesn’t need to. That’s worse, somehow.', 'think'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Clap for the challengers.',
              then: [N('You clap for the next one as they walk on, and a few people turn round. A girl two rows down starts clapping too.')],
            },
            {
              id: 'eyes',
              label: 'Put a hand over your Nubbin’s eyes.',
              then: [N('Your Nubbin moves your hand aside, politely, and keeps watching. It wants to know what is happening to the one in armour.')],
            },
            {
              id: 'watch',
              label: 'Watch Mewtwo, not the battles.',
              then: [N('Between battles, every time, the helmet turns very slightly towards Giovanni’s chair. As if checking.')],
            },
          ],
        },
        done: {
          id: 'pa2-04-stands-done',
          lines: [
            N('The last challenger goes home and the hall empties. You stay where you are, and the cartridge lets you.'),
          ],
        },
      },
      {
        id: 'pa2-04-s2',
        goal: 'Stay and see what Mewtwo works out.',
        hint: 'Wait in the empty stands while Giovanni and Mewtwo talk.',
        check: 'wait:pa2-stands:viridian',
        scene: {
          id: 'pa2-04-tool',
          lines: [
            MT('Who were they? The ones I beat today.'),
            GI('Nobody important. Practice.'),
            MT('And when there is no more practice? What then?'),
            GI('Then you do what I tell you, where I tell you. That is what you are for.', 'think'),
            MT('You said we were partners.'),
            GI('I said I would give you a purpose. I have. You were made by people, for people. You are mine to use.'),
            N('The armour creaks. One of the shoulder plates has a crack running through it that wasn’t there a moment ago.'),
            MT('Made by people. Used by people. Is that all there is to me?', 'angry'),
          ],
        },
        done: {
          id: 'pa2-04-tool-done',
          lines: [
            N('The helmet splits down the middle and falls to the floor in two halves. Then the shoulder plates go, and then the rest.'),
            N('Your Nubbin flinches at the noise and burrows into your coat.'),
          ],
        },
      },
      {
        id: 'pa2-04-s3',
        goal: 'Watch Mewtwo leave.',
        hint: 'Go up to the gym’s roof and look out over the city.',
        check: 'watch:pa2-flight:viridian',
        scene: {
          id: 'pa2-04-leave',
          lines: [
            N('There is a long, low sound under the floor, and the lights go out one row at a time.'),
            N('Somewhere below, Giovanni’s headquarters are coming apart: walls, machines, all of it, though nobody is hurt in the picture.'),
            N('You come out on the roof. Mewtwo is standing in the air above the city, without his armour, his tail moving slowly.'),
            MT('I was not born. I was made, and lied to, and used. I will not be anyone’s again.', 'angry'),
            MT('I will go back to where I began, and I will decide what I am myself.'),
            N('He turns towards the sea, towards the island, and is gone so fast that the clouds close behind him.'),
            N('Your Nubbin climbs out of your coat and looks at the hole in the clouds for a long time.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-04-complete',
      lines: [
        N('The cartridge fades to the cabinet’s little corner window: the lantern shed, Pixel’s face lit blue by the screen.'),
        N('Behind Pixel’s chair there is nobody. The biscuit tin still isn’t back.'),
        P('He asked what he was for, and somebody answered.', 'soft'),
        P('That’s the worst thing you can do to someone, I think. Answer that one for them.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'pa2-04': true },
    notes:
      'BYTE (s7Done): play ARCADE_PA2_VARIANTS pa2-04-complete-s7 instead of pa2-04-complete: Byte is behind the chair and ' +
      'says nothing. Pixel’s line is the outline’s own, original, and plays in both. HEADQUARTERS: show the building ' +
      'shaking and lights going out; no people in the shot. Mewtwo’s armour and the gym are licensed designs.',
  },

  // ---------------------------------------------------------------- PA2-5
  {
    id: 'pa2-05',
    code: 'PA2-5',
    title: 'The Lunch Battle',
    source: `${FILM}: Ash’s lunch, Raymond, the Dragonite and the invitation`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-4') },
    requires: ['PA2-4'],
    speakers: [ASH, MISTY, BROCK, RAYMOND, JOY],
    steps: [
      {
        id: 'pa2-05-s1',
        goal: 'Walk down to the meadow and watch the lunch battle.',
        hint: 'Follow the path down the hillside to the meadow where three travellers are eating.',
        check: 'watch:pa2-raymond:meadow',
        scene: {
          id: 'pa2-05-lunch',
          lines: [
            N('Morning, and the hillside again, in sunshine this time. Below you in a meadow, three travellers are having lunch on a blanket.'),
            N('A boy in a red cap, a girl with an orange ponytail, and a tall young man stirring a pot. A small yellow creature is eating an apple.'),
            P('Ash, Misty, Brock. And that’s Pikachu. He’s the famous one. Be cool.', 'happy'),
            BR('Lunch in five minutes. Nobody battle anybody.'),
            N('A boy in a sharp jacket comes over the stile and points straight at Ash.'),
            RA('You there. I’ve heard about you. I challenge you. One on one, right now.'),
            AS('Now? I’m starving.'),
            RA('Scared?'),
            AS('Pikachu! You’re on!', 'happy'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Offer to keep the stew from burning.',
              then: [BR('A trainer who stirs. You can stay.', 'happy'), N('You stir. Your Nubbin sits by the pot, watching the stew as if it might escape.')],
            },
            {
              id: 'sit',
              label: 'Sit with Misty and watch.',
              then: [MI('He always says yes. Always. Even before lunch. Especially before lunch.'), N('She sounds cross. She is smiling.')],
            },
          ],
        },
        done: {
          id: 'pa2-05-lunch-done',
          lines: [
            N('It doesn’t take long. The challenger’s creature sits down in the grass, dazed but fine, and Raymond stares at it.'),
            RA('That’s… not how that was supposed to go.'),
            AS('Good battle! Want some lunch?', 'happy'),
            N('Brock hands Raymond a bowl without being asked.'),
            BR('You battled on an empty stomach. It showed.'),
            RA('…Is there any more?'),
            BR('There’s always more.'),
            N('Your Nubbin has moved its stool between Raymond and the pot.'),
          ],
        },
      },
      {
        id: 'pa2-05-s2',
        goal: 'Take the letter the Dragonite brings you.',
        hint: 'When the big orange flyer lands, go and take the letter with your name on it.',
        check: 'collect:pa2-letter:dragonite',
        scene: {
          id: 'pa2-05-letters',
          lines: [
            N('A shadow crosses the blanket. Something big and orange and kind-faced lands in the meadow, flapping small wings.'),
            N('It is carrying a bag of letters. It hands one to Ash, very gently, and then looks round at you.'),
            N('It holds out a second envelope. Your name is on it, written in a careful hand.'),
            MI('Who even knows you’re here?'),
            Y('I’m not sure anybody does.'),
            N('Your Nubbin reaches up and pats the big creature’s foot. The creature pats your Nubbin’s head, with one claw, very carefully.'),
          ],
        },
        done: {
          id: 'pa2-05-letters-done',
          lines: [
            N('You open the envelope. Inside is a round disc, and when you touch it, light comes out.'),
          ],
        },
      },
      {
        id: 'pa2-05-s3',
        goal: 'See the invitation through.',
        hint: 'Watch the message in the disc to the end.',
        check: 'watch:pa2-hologram:meadow',
        scene: {
          id: 'pa2-05-hologram',
          lines: [
            N('A small woman made of light stands on the disc in a long cloak, her face hidden by the hood. Her voice is very calm.'),
            JO('You are invited to New Island, to meet the greatest master of them all.'),
            JO('You have been chosen as one of the finest trainers in the world. Come to Old Shore Wharf. A boat will be waiting.'),
            N('The light goes out. Ash is already packing his bag.'),
            AS('The greatest master? I have to meet them. I have to!', 'happy'),
            BR('That voice. I know that voice. Where do I know that voice from?', 'think'),
            P('That letter’s the invitation the cartridge was talking about. You’re in it now.', 'think'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Ask if you can walk with them.',
              then: [AS('Sure! The more the merrier. What’s that you’ve got? Is it a Pokémon?'), Y('It’s a Nubbin.'), AS('Never heard of one!', 'happy')],
            },
            {
              id: 'brock',
              label: 'Ask Brock where he knows the voice from.',
              then: [BR('If I knew, I’d tell you. It’s right on the tip of my tongue.', 'think'), MI('It’s a girl. He thinks he knows every girl.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-05-complete',
      lines: [
        N('You set off down the coast road together, five of you and two small creatures, towards the wharf.'),
        N('Out at sea the band of cloud has got darker. There is the island under it, and the tall thing on the island.'),
        P('I’ve got a bad feeling about the weather. The cartridge has got rain in it. Lots.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'pa2-05': true },
    notes:
      'STAGING: Ash, Misty, Brock and Pikachu are licensed designs. The lunch battle is short and bright: one exchange, ' +
      'no damage shown, Raymond’s creature dazed and sitting up. Dragonite (licensed) delivers the letters. The hologram ' +
      'disc projects the cloaked woman; her face is never seen until PA2-8. Pikachu never speaks a line in this ' +
      'cartridge; use his licensed voice clips only if the licence allows, otherwise none.',
  },

  // ---------------------------------------------------------------- PA2-6
  {
    id: 'pa2-06',
    code: 'PA2-6',
    title: 'Old Shore Wharf',
    source: `${FILM}: the wharf, the storm and Miranda’s story`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-5') },
    requires: ['PA2-5'],
    speakers: [ASH, MISTY, BROCK, MIRANDA, NEESHA, FERGUS, COREY],
    steps: [
      {
        id: 'pa2-06-s1',
        goal: 'Reach Old Shore Wharf and find out why the ferry isn’t running.',
        hint: 'Walk along the harbour to the pier and talk to the woman at the gate.',
        check: 'talk:pa2-miranda:pier',
        scene: {
          id: 'pa2-06-wharf',
          lines: [
            N('Old Shore Wharf is a row of wet planks in a wind that wants your hat. The sea is the colour of slate, and getting bigger.'),
            N('There is a little Pokémon Center at the end of the street. The lights are on and the door is open, and nobody is there.'),
            BR('No nurse. There’s always a nurse.', 'think'),
            N('By the pier gate stands a woman in a long oilskin with a lantern, turning people away.'),
            MR('No boats. Not today. Not in this. The harbour’s shut, and so’s the sea.'),
            N('Three trainers are arguing with her: a girl with a shell on her belt, a big man in a leather coat, a tall boy with neat hair.'),
            FE('We’re invited. We’re expected.', 'angry'),
            NE('We’ll go on our own, then. My partner can swim it.'),
            CO('Mine can fly it. See you over there.'),
            N('They go off to the end of the pier, each in a different direction, without looking at each other.'),
          ],
        },
        done: {
          id: 'pa2-06-wharf-done',
          lines: [
            MR('Fools. Well. Clever fools. Come in out of it, the rest of you, before you blow away.'),
          ],
        },
      },
      {
        id: 'pa2-06-s2',
        goal: 'Help Miranda make tea in the pier hut while she tells her story.',
        hint: 'Fill the kettle from the barrel, set it on the stove, and warm the cups.',
        check: 'craft:pa2-tea:pier-hut',
        scene: {
          id: 'pa2-06-tea',
          lines: [
            N('The pier hut is small and warm and smells of paraffin. Miranda gives you the kettle without asking whether you know how.'),
            MR('Barrel’s by the door. Fill it to the dent, not the brim. Then it goes on the stove, and you wait. Waiting’s the main part.'),
            N('Your Nubbin finds the warm place in front of the stove and lies down in it as if it has been there for years.'),
            MR('You know there’s an old story about storms like this one. Told it to my grandchildren. They didn’t believe me.'),
            MR('Long ago, the sea came up in a storm and drowned this whole shore. People. Creatures. Everyone fighting each other, before.', 'sad'),
            MR('And the creatures that were left wept. All of them, every kind, for the ones on the sand.'),
            MR('And where their tears fell, the ones on the sand woke up again.', 'soft'),
            N('The kettle starts to tick. Ash has stopped fidgeting, and Misty has her hands round an empty cup.'),
            MR('Never seen it, mind. It’s a story. But you don’t keep a story that long for nothing.'),
          ],
          choices: [
            {
              id: 'true',
              label: '“Do you think it’s true?”',
              then: [MR('I think it’s true that people need it to be. That’s a kind of true. Pour, it’s boiling.')],
            },
            {
              id: 'cups',
              label: 'Warm the cups and say nothing.',
              then: [MR('Good. You warm the cups first. Somebody brought you up right.'), N('You think of Hazel’s kitchen, and the cups on the hooks.')],
            },
            {
              id: 'nubbin',
              label: 'Look at your Nubbin by the stove.',
              then: [N('Your Nubbin is asleep with its paws over its nose. Its ball has gone soft and round, the way it does when it is safe.')],
            },
          ],
        },
        done: {
          id: 'pa2-06-tea-done',
          lines: [
            N('You pour. Miranda takes hers without milk and drinks it scalding, the way people do who work outside.'),
            P('Remember that story. Writing it down. Pixel’s orders.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-06-complete',
      lines: [
        N('The rain hammers the hut roof. Outside, a boat bumps against the pier where no boat should be.'),
        MR('Take this. You’ll want a light that doesn’t blow out. I’ve another.'),
        N('She gives you a storm lantern: brass, dented, with a glass that has been mended once. It is still warm from her hand.'),
        MR('And remember the story. You never know which ones are for using.'),
      ],
    },
    rewards: [
      {
        id: 'pa2-storm-lantern',
        kind: 'decor',
        label: 'Miranda’s storm lantern',
        description: 'A dented brass storm lantern from Old Shore Wharf, with a glass mended once. It hangs from a hook and never blows out.',
      },
    ],
    sets: { 'pa2-06': true },
    notes:
      'TEA: a small craft step in the pier hut: fill the kettle at the barrel (to the dent), set it on the stove, ' +
      'warm the cups. No timer. The story is told while the kettle heats. Neesha, Fergus and Corey leave by their own ' +
      'creatures (swimmer, Gyarados-sized sea creature, flyer), as in the film. The empty Pokémon Center is a clue: ' +
      'its Nurse Joy is the cloaked woman. REWARD: Miranda’s storm lantern (decoration) is given here, inside the ' +
      'cartridge, and appears in the Grove when the cartridge is next exited. BYTE (s7Done unset): play ' +
      'ARCADE_PA2_VARIANTS pa2-06-complete-unset instead of pa2-06-complete: Pixel times Byte’s biscuit run (paid off in PA2-15).',
  },

  // ---------------------------------------------------------------- PA2-7
  {
    id: 'pa2-07',
    code: 'PA2-7',
    title: 'The Boat',
    source: `${FILM}: Team Rocket’s boat and the storm crossing`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-6') },
    requires: ['PA2-6'],
    speakers: [ASH, MISTY, BROCK, JESSIE, JAMES, MEOWTH],
    steps: [
      {
        id: 'pa2-07-s1',
        goal: 'Accept a lift from the two odd boatmen.',
        hint: 'Go down to the boat at the end of the pier.',
        check: 'walk:pa2-boat:pier',
        scene: {
          id: 'pa2-07-boatmen',
          lines: [
            N('At the end of the pier, a wooden boat with a dragon’s head on the front. Two rowers in horned helmets and false beards.'),
            JE('Ahoy, weary travellers! Need a boat to an island? Any island? Particularly that island?'),
            JA('Very reasonable prices. Very safe boat. Hardly any holes.'),
            N('One of the beards is slipping. Under it there is a very familiar sort of chin.'),
            N('In the bottom of the boat, under a tarpaulin, something with a coin on its forehead is pretending to be a coil of rope.'),
            MI('Are those… real beards?'),
            JE('Of course they are! We grew them! Specially! Get in!', 'angry'),
            AS('Great! Thanks!', 'happy'),
          ],
          choices: [
            {
              id: 'say',
              label: 'Point out the rope has whiskers.',
              then: [ME('Rope don’t got whiskers. Rope is rope. Get in da boat.', 'angry'), N('The rope looks at you with two very annoyed eyes.')],
            },
            {
              id: 'get-in',
              label: 'Get in. It’s the only boat.',
              then: [N('You get in. Brock sits down next to you and looks at the sky, and then at the rowers, and then at the sky.')],
            },
          ],
        },
        done: {
          id: 'pa2-07-boatmen-done',
          lines: [
            N('The boat pushes off. For about a hundred strokes it is nearly fine.'),
          ],
        },
      },
      {
        id: 'pa2-07-s2',
        goal: 'Keep your Nubbin above the waves.',
        hint: 'When the boat goes over, swim towards your Nubbin and hold it up until the swimmers reach you.',
        check: 'swim:pa2-sea:storm',
        scene: {
          id: 'pa2-07-storm',
          lines: [
            N('A wave comes up taller than the boat, and the boat climbs it, and the top of it is the wrong way up.'),
            N('Then you are in the sea. It is cold the way stone is cold, all at once and all over.'),
            N('Your Nubbin is a little way off, its ball a bright dot in the grey. It is doing what Marina taught Hazel’s Nubbins.'),
            N('Big breath, ears flat. Float on its back like a cork, and wait for you.'),
            N('You reach it. You hold it up out of the water, against your chin, and it lets out its breath in a puff.'),
            AS('Squirtle! Help everybody!', 'shock'),
            MI('Staryu, you too! Get them!', 'shock'),
            N('Something round and blue bobs up beside you and gets a shoulder under your arm. A star-shaped one spins past with Brock.'),
            N('They swim for the island. You let them, and you hold on, and you don’t let go of your Nubbin.'),
          ],
        },
        done: {
          id: 'pa2-07-storm-done',
          lines: [
            N('Stone steps come up out of the sea. You crawl up them with your Nubbin under your chin, and the blue one pats your back.'),
            P('You’re all right. You’re all right. I saw the whole thing. I didn’t like it.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-07-complete',
      lines: [
        N('You sit on the steps, wet through. Your Nubbin shakes, and sneezes, and climbs into your coat where it is least wet.'),
        N('Far behind you, the dragon-headed boat floats upside down. Three voices are arguing under it.'),
        JA('Hardly any holes, I said! I didn’t say no holes!'),
        N('Above you, through the rain, steps lead up to a castle with a tall tower and a light in one window.'),
      ],
    },
    rewards: [],
    sets: { 'pa2-07': true },
    notes:
      'SWIM: the player swims a short way in heavy swell to their Nubbin and holds it up; Ash’s Squirtle and Misty’s ' +
      'Staryu then carry everyone. No failure state: if the player stops, Squirtle reaches them anyway. Your Nubbin ' +
      'floats on its back, ears flat, the way Marina taught Hazel’s Nubbins (campaign canon). Team Rocket’s Viking ' +
      'disguise follows the film. Meowth may speak (a source talking creature).',
  },

  // ---------------------------------------------------------------- PA2-8
  {
    id: 'pa2-08',
    code: 'PA2-8',
    title: 'New Island',
    source: `${FILM}: the castle hall, Nurse Joy and Mewtwo’s challenge`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-7') },
    requires: ['PA2-7'],
    speakers: [MEWTWO, JOY, ASH, MISTY, BROCK, NEESHA, FERGUS, COREY],
    steps: [
      {
        id: 'pa2-08-s1',
        goal: 'Follow the cloaked woman into the castle.',
        hint: 'Climb the steps and walk with the woman in the cloak to the great hall.',
        check: 'walk:pa2-joy:castle-hall',
        scene: {
          id: 'pa2-08-steps',
          lines: [
            N('At the top of the steps a woman in a long cloak is waiting, with a lamp. The woman from the disc.'),
            JO('Welcome. You have done well to come so far. Please, follow me.'),
            N('Her voice is just as calm as the disc’s, too calm. It is as if somebody else is choosing the words and she is only carrying them.'),
            BR('It’s you. I knew it. I know you from somewhere.', 'think'),
            JO('This way.'),
            N('The doors open on a great hall with a long table, and a fire, and a high glass roof with the rain sliding down it.'),
            N('Three trainers are already there, steaming by the fire: Neesha, Fergus and Corey. They got across.'),
            FE('Took your time.'),
            NE('Did you swim? You look like you swam.'),
          ],
        },
        done: {
          id: 'pa2-08-steps-done',
          lines: [
            N('The woman stops at the head of the table and raises one hand. The fire goes small, and every lamp in the hall dims.'),
          ],
        },
      },
      {
        id: 'pa2-08-s2',
        goal: 'Stand your ground in the hall when the host arrives.',
        hint: 'Stay by the long table and watch the stairs.',
        check: 'watch:pa2-mewtwo:castle-hall',
        scene: {
          id: 'pa2-08-host',
          lines: [
            N('Down the stairs, without touching them, comes Mewtwo. He is taller than you remember, and his eyes are very still.'),
            MT('Thank you for coming. You are the strongest trainers in the world, or near enough.'),
            MT('You will not need her any more.'),
            N('The cloaked woman sways, and her hood falls back. She blinks at the hall like someone who has been asleep standing up.'),
            JO('Where… This isn’t the Center. Who are all of you?', 'shock'),
            BR('Nurse Joy! The nurse from the wharf! That’s where I know you from!', 'happy'),
            N('Fergus has had enough. His big sea creature rears up behind him and opens its jaws, and a beam of light comes out.'),
            N('Mewtwo lifts one hand. The beam stops in the air, turns round, and goes back the way it came.'),
            N('The sea creature sits down hard, dazed, and Fergus stares at it.'),
            MT('Do not do that again.'),
          ],
        },
        done: {
          id: 'pa2-08-host-done',
          lines: [
            MT('People made me. People used me. People put their creatures in little balls and call it friendship.', 'angry'),
            MT('Humans and their creatures both have this coming. I will start again, with my own.', 'angry'),
          ],
        },
      },
      {
        id: 'pa2-08-s3',
        goal: 'Answer Mewtwo’s question.',
        hint: 'When Mewtwo comes to you, choose what to say.',
        check: 'talk:pa2-mewtwo:castle-hall',
        scene: {
          id: 'pa2-08-what',
          lines: [
            N('Mewtwo turns to go. Then he stops, and turns back, and looks at your Nubbin.'),
            N('He comes across the hall, not walking, and stops in front of you. Your Nubbin looks up at him with its ball gone to a question mark.'),
            MT('What is that?'),
            N('Nobody in the hall breathes.'),
            MT('I know every creature in every record. I have read them all. This is in none of them.', 'think'),
            MT('It was not caught. It is not in a ball. It is sitting on your foot. What is it?'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: '“It’s a Nubbin.”',
              then: [MT('A Nubbin. And who made it?'), Y('Nobody. It hatched. I looked after the egg.'), MT('Looked after.', 'think'), N('He says it the way you would say a word in a language you don’t speak.')],
            },
            {
              id: 'friend',
              label: '“It’s my friend.”',
              then: [MT('Everybody here says that about the thing they keep in a ball.', 'angry'), Y('I don’t keep it anywhere. It keeps itself. It just stays.'), MT('Why?'), N('You don’t have an answer that fits in a sentence. Mewtwo waits, and then doesn’t.')],
            },
            {
              id: 'pick-up',
              label: 'Say nothing. Pick your Nubbin up.',
              then: [N('You pick it up, and it doesn’t struggle. It puts its chin on your shoulder and goes on looking at Mewtwo.'), MT('It is not afraid of me.', 'think'), N('It is a little. It just likes you more than it is afraid.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-08-complete',
      lines: [
        N('Mewtwo turns away at last. He rises up the stairs and is gone, and the fire in the hall comes back up.'),
        JO('I’ve been gone for days. I remember a voice. I remember being very tired.', 'sad'),
        N('Your Nubbin climbs down and goes to sit beside her. She puts a hand on its head without looking, the way nurses do.'),
        P('He looked at it for ages. He’s never seen anything that wasn’t made or caught.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'pa2-08': true },
    notes:
      'STAGING: Fergus’s Gyarados (licensed) fires; Mewtwo turns the beam back and the Gyarados is dazed, not hurt. ' +
      'Nurse Joy wakes from Mewtwo’s control when he lets her go. The question in pa2-08-what is the first time any ' +
      'source character takes notice of your Nubbin; give it a held close-up. The answer choice is flavour only and ' +
      'sets no flag.',
  },

  // ---------------------------------------------------------------- PA2-9
  {
    id: 'pa2-09',
    code: 'PA2-9',
    title: 'The Lab',
    source: `${FILM}: Team Rocket below the castle and the cloning machine`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-8') },
    requires: ['PA2-8'],
    speakers: [JESSIE, JAMES, MEOWTH, FUJI, MEWTWO],
    steps: [
      {
        id: 'pa2-09-s1',
        goal: 'Follow the dripping sounds down to the lab below the castle.',
        hint: 'Take the stair behind the hall fireplace and follow the light.',
        check: 'explore:pa2-lab:below-castle',
        scene: {
          id: 'pa2-09-down',
          lines: [
            N('Behind the fireplace there is a door, and behind the door a stair, and at the bottom a long room full of pods and green light.'),
            N('Your Nubbin found the door; it is good at doors. It went down two steps before you could stop it.'),
            N('Three dripping figures are already there, poking at things. The Vikings, minus beards.'),
            JA('Jessie, look. Tanks. Thousands of them. Someone’s been very busy.'),
            JE('Someone’s been very rich. Look at all this.', 'happy'),
            ME('Somethin’ about dis place gives me da creeps. Da floor’s humming.', 'think'),
            N('On a desk, under dust, there is a small machine with a red button that says PLAY. Meowth presses it, because of course he does.'),
            FU('Recording. Day one of the new project. We are going to make the strongest creature that has ever lived.'),
            FU('If it works, I will have enough money to go on with my real work. Amber. My daughter.', 'sad'),
          ],
        },
        done: {
          id: 'pa2-09-down-done',
          lines: [
            JE('Who’s Amber?'),
            N('Nobody answers. You know, and you don’t say, because it doesn’t feel like yours to say.'),
          ],
        },
      },
      {
        id: 'pa2-09-s2',
        goal: 'Watch what the machine does.',
        hint: 'Stand back from the long machine in the middle of the lab.',
        check: 'watch:pa2-machine:lab',
        scene: {
          id: 'pa2-09-machine',
          lines: [
            N('Down the middle of the lab runs a machine as long as a barn, with an arm that reaches out over the floor.'),
            N('The arm turns. It plucks a single hair off the top of Meowth’s head, neat as a bird taking a seed.'),
            ME('Hey! Dat’s mine!', 'angry'),
            N('The hair goes into a slot, and the machine hums. A pod lights up green, and in it, something small begins to curl up.'),
            JA('That’s… you, Meowth. It’s growing another you.', 'shock'),
            ME('Dere’s only room for one o’ me. I barely got room for me.', 'shock'),
            N('The arm turns again, and stops over the floor by your boots. Lying there is a tuft of fluff: your Nubbin’s, from the boat.'),
            N('You reach for it, but the arm is quicker. The tuft goes into the slot.'),
          ],
        },
        done: {
          id: 'pa2-09-machine-done',
          lines: [
            N('A second pod lights up. In it, very small and very quickly, a round shape grows, with wings and a crown and stubby arms.'),
            N('A few stray wisps are left in the tray under the slot. You take them, without quite knowing why, and put them in your pocket.'),
            P('Oh no. Oh no, oh no. It’s copying your Nubbin.', 'shock'),
          ],
        },
      },
      {
        id: 'pa2-09-s3',
        goal: 'Decide what to call the Nubbin in the pod.',
        hint: 'Go to the pod when it opens and choose what to say.',
        check: 'choose:pa2-clone:name',
        scene: {
          id: 'pa2-09-pod',
          lines: [
            N('The pod opens with a sigh. Out of it climbs a Nubbin.'),
            N('It is your Nubbin’s shape exactly. But it is darker, as if drawn in evening, and its markings are on the wrong sides.'),
            N('Its ball is grey. It wobbles on its feet, because they have only been feet for a minute.'),
            N('Your Nubbin hides behind your legs and looks out. The new one looks at your Nubbin, then up at you.'),
            N('It is waiting. It looks at you as if you should know what it is for.'),
            P('It’s frightened. It doesn’t know anything. It’s exactly what he was in the tank.', 'sad'),
            P('Say something to it. Please. Somebody has to say something to it first.', 'soft'),
          ],
          choices: [
            {
              id: 'borrowed',
              label: 'Say your Nubbin’s name. It looks just like it.',
              set: { 'pa2-name': 'borrowed' },
              then: [
                N('You say your Nubbin’s name. Your Nubbin’s ears go up, and so do the new one’s.'),
                N('It says nothing. It looks at your Nubbin, which has the same name, and back at you, and something in it goes small and tight.'),
              ],
            },
            {
              id: 'own',
              label: 'Give it a new name.',
              set: { 'pa2-name': 'own' },
              then: [
                Y('You’re not a copy of anybody. You get your own name. Here.'),
                N('You give it the name. It tilts its head, and you say it again, slower.'),
                N('Its ball turns, very faintly, from grey to the colour of the inside of a shell.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-09-complete',
      lines: [
        N('Feet on the stair. Mewtwo’s voice fills the lab, without anyone in it.'),
        MT('Everything made here is mine. Come up. It is time.'),
        N('The new Nubbin goes up the stairs towards the voice, with the new Meowth beside it. At the top it stops and looks back at you.'),
        N('Your Nubbin takes hold of your trouser leg and doesn’t let go of it.'),
      ],
    },
    rewards: [],
    sets: { 'pa2-09': true },
    notes:
      'SIGNATURE CHOICE (pa2-09-pod): pa2-name = own | borrowed. Paid off in PA2-13 (pa2-13-nubbins vs ' +
      'pa2-13-nubbins-borrowed), PA2-16 (pa2-16-go vs pa2-16-name-borrowed) and PA2-18 (pa2-18-complete vs ' +
      'pa2-18-complete-late and pa2-18-complete-nameless). SIM: on own, open the name-entry box (the same one used to ' +
      'name a hatchling) and store the name as pa2-clone-name in the Arcade save; empty or unchanged input defaults to ' +
      'a seeded name from the Nubbin name list, never the player Nubbin’s name. THE CLONE’S LOOK: the player Nubbin’s ' +
      'own sprite, mirrored colour layout (markings swapped left and right), tinted one step darker, ball grey until ' +
      'named. It is never drawn with angry eyes. THE TUFT: the stray wisps in pa2-09-machine-done become the locket ' +
      'in PA2-18.',
  },

  // ---------------------------------------------------------------- PA2-10
  {
    id: 'pa2-10',
    code: 'PA2-10',
    title: 'Clones and Originals',
    source: `${FILM}: the clone battles and the dark Balls`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-9') },
    requires: ['PA2-9'],
    speakers: [MEWTWO, ASH, MISTY, BROCK, NEESHA, COREY],
    steps: [
      {
        id: 'pa2-10-s1',
        goal: 'Watch the trainers’ best face Mewtwo’s copies.',
        hint: 'Stand at the edge of the arena under the glass roof.',
        check: 'watch:pa2-battles:arena',
        scene: {
          id: 'pa2-10-battles',
          lines: [
            N('The castle’s arena is under the glass roof, with the storm pouring down it. On one side stand the trainers.'),
            N('On the other side, out of the dark, come three creatures: a great flower-backed one, a winged fire one, and one with cannons on its shell.'),
            N('They are exactly like the trainers’ own three. Only darker, and with lines down them like old scars.'),
            MT('My copies. Made from your best, and made better. Show me what yours can do.'),
            CO('Venusaur! Go!'),
            NE('Blastoise, you’re up!'),
            AS('Charizard, I choose you!'),
            N('It isn’t long. One by one, the originals go down: not hurt, just beaten, and lying very still and tired on the stone.'),
            N('Among Mewtwo’s copies, at the back, stands the new Nubbin, watching. It flinches every time something falls.'),
          ],
        },
        done: {
          id: 'pa2-10-battles-done',
          lines: [
            AS('Charizard! Get up! You can do it!', 'shock'),
            N('Charizard tries, and doesn’t manage. Ash runs out and kneels beside it, and Mewtwo lets him.'),
          ],
        },
      },
      {
        id: 'pa2-10-s2',
        goal: 'Hide your Nubbin from the dark Balls.',
        hint: 'When the black Balls start flying, pick up your Nubbin and hold it inside your coat.',
        check: 'carry:pa2-nubbin:coat',
        scene: {
          id: 'pa2-10-balls',
          lines: [
            MT('Now. I will take your creatures, and copy them all, and keep the copies. They will be better than yours.'),
            N('Dark Balls pour from the walls: black, with a dull stripe, flying like starlings. They snap shut on anything that moves.'),
            N('Brock’s creatures are gone, and the other trainers’ too. Misty grabs the little egg-shaped one, Togepi, and stuffs it in her bag.'),
            MI('Not you. Not you. In you go, quiet now.', 'shock'),
            N('A Ball comes for your Nubbin. You catch your Nubbin first, and open your coat, and shut it.'),
            N('You feel it, small and fast-hearted, against your chest. The Ball bumps your shoulder, confused, and goes looking for something else.'),
            N('The coat is still wet from the sea, and your Nubbin doesn’t mind. It holds on to your jumper with both paws.'),
          ],
          choices: [
            {
              id: 'shh',
              label: 'Whisper to it to keep still.',
              then: [N('You whisper. It keeps still, so still you can feel it deciding to, all the way down to its feet.')],
            },
            {
              id: 'clone',
              label: 'Look for the new Nubbin.',
              then: [N('It is still at the back of Mewtwo’s copies, and no Ball goes near it. It is watching your coat, and the shape in it.')],
            },
          ],
        },
        done: {
          id: 'pa2-10-balls-done',
          lines: [
            N('The Balls whistle off down a chute in the floor, full, towards the lab.'),
            P('Don’t let go of it. Whatever happens, don’t let go of it.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-10-complete',
      lines: [
        N('The arena is very quiet. Every creature the trainers had is gone but three: Pikachu, Togepi in Misty’s bag, and your Nubbin.'),
        N('Across the arena the new Nubbin is looking at your coat. It can see the shape inside, and it looks at it for a long time.'),
        BR('Ash. Pikachu. They’re all looking at Pikachu.', 'shock'),
      ],
    },
    rewards: [],
    sets: { 'pa2-10': true },
    notes:
      'STAGING: the copy battles are fast and quiet; the originals are beaten and tired, never shown hurt. The new ' +
      'Nubbin stands at the back of Mewtwo’s copies in every shot, flinching at each fall. HIDE: the player picks up ' +
      'their Nubbin and the coat sprite closes over it; no fail state (the Ball always misses). Togepi in Misty’s bag ' +
      'as in the film.',
  },

  // ---------------------------------------------------------------- PA2-11
  {
    id: 'pa2-11',
    code: 'PA2-11',
    title: 'Pikachu’s Run',
    source: `${FILM}: Pikachu runs, Ash follows the Ball and wrecks the machine`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-10') },
    requires: ['PA2-10'],
    speakers: [ASH, MISTY, BROCK, JESSIE, JAMES, MEOWTH],
    steps: [
      {
        id: 'pa2-11-s1',
        goal: 'Watch Pikachu run.',
        hint: 'Stay at the edge of the arena and keep your coat shut.',
        check: 'watch:pa2-pikachu:arena',
        scene: {
          id: 'pa2-11-run',
          lines: [
            N('Pikachu runs: round the arena, along the walls, up the stairs. The dark Balls come after him like hail.'),
            N('He is very quick. Every time one nearly has him, he isn’t there any more, and it bangs on stone.'),
            AS('Run, Pikachu! Don’t let them get you!', 'shock'),
            N('He runs to Ash. Ash scoops him up and turns his back to the Balls and curls round him.'),
            N('A Ball hits Ash in the back, then another. He doesn’t let go, and they both go down on the stone together.'),
            N('Then the last Ball snaps shut on Pikachu, out of Ash’s arms, and drops into the chute.'),
            AS('No!', 'shock'),
            N('Ash doesn’t stop. He goes down the chute after it, head first, into the dark.'),
          ],
        },
        done: {
          id: 'pa2-11-run-done',
          lines: [
            MI('Ash! You idiot! Come back!', 'shock'),
            BR('That way. The stair behind the fire. We can get down that way.'),
            P('Go. Follow Brock. Take your Nubbin.', 'shock'),
          ],
        },
      },
      {
        id: 'pa2-11-s2',
        goal: 'Get down to the lab.',
        hint: 'Run back through the hall and down the stair behind the fireplace.',
        check: 'explore:pa2-chute:lab',
        scene: {
          id: 'pa2-11-lab',
          lines: [
            N('You come down the stair with Brock and Misty into the green light of the lab, and you stop.'),
            N('Ash is soaked from the water in the chute. He has hold of something heavy, and he is hitting the control panel with it.'),
            AS('Give him back! Give them all back!', 'angry'),
            N('The panel sparks. The long machine coughs, and groans, and stops.'),
            N('Somewhere in the walls, something goes clunk, all along the room, like doors unlocking.'),
            JE('Did the twerp just break it?'),
            JA('Bless him. I think he did.'),
            N('Your Nubbin is out of your coat before you can stop it, scrambling towards the pods.'),
          ],
        },
        done: {
          id: 'pa2-11-lab-done',
          lines: [
            N('The pods start opening, one after another, with a sigh like a breath let out.'),
          ],
        },
      },
      {
        id: 'pa2-11-s3',
        goal: 'Help pull the last ones free from the pods.',
        hint: 'Open the stuck pods; where your hands won’t fit, your Nubbin can squeeze in.',
        check: 'collect:pa2-pods:lab',
        scene: {
          id: 'pa2-11-pods',
          lines: [
            N('Creatures tumble out of the open pods: dizzy, blinking, looking for their trainers. Pikachu shoots out of one into Ash’s arms.'),
            N('Some pods only half-open. Brock gets his fingers in the gap and pulls, and Misty pulls, and you pull.'),
            N('One won’t go: the gap is too small for any hand. There is something inside it, shut in the dark.'),
            N('Your Nubbin looks at the gap, then at you. Then it puts its head in, and wriggles, and is gone up to its tail.'),
            N('There is a squeak, and the pod’s latch gives from the inside. Out rolls a very small round creature, and your Nubbin after it.'),
            MI('Look at that. It went in where we couldn’t.', 'happy'),
            N('Your Nubbin sits up, covered in green goo, extremely pleased with itself.'),
          ],
          choices: [
            {
              id: 'praise',
              label: 'Tell it it did well.',
              then: [N('You tell it. Its ball goes to a heart, goo and all.')],
            },
            {
              id: 'wipe',
              label: 'Wipe the goo off its face.',
              then: [N('You wipe it with your sleeve. It squints and lets you, the way it does at bath time, nobly.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-11-complete',
      lines: [
        N('Every creature in the lab is out. The trainers’ creatures run back up the stair, and the trainers come down to meet them.'),
        AS('Pikachu. You’re okay. You’re okay.', 'soft'),
        N('Above you, through the floor, there is a sound like a storm getting angry. Mewtwo has noticed.'),
        BR('Up. Everybody up. He’ll be waiting.'),
      ],
    },
    rewards: [],
    sets: { 'pa2-11': true },
    notes:
      'STAGING: Ash shields Pikachu from the Balls with his back; he falls but is unhurt. He goes down the chute ' +
      'and wrecks the cloning machine’s panel with a pipe. The pods release everyone. POD STEP: three stuck pods ' +
      'open with a tug; the last needs the Nubbin (it squeezes in; no failure). The green goo is harmless.',
  },

  // ---------------------------------------------------------------- PA2-12
  {
    id: 'pa2-12',
    code: 'PA2-12',
    title: 'Mew',
    source: `${FILM}: Ash and Mewtwo, the pink bubble, Mew`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-11') },
    requires: ['PA2-11'],
    speakers: [MEWTWO, ASH, MISTY, MEOWTH],
    steps: [
      {
        id: 'pa2-12-s1',
        goal: 'Get back to the arena and see who catches Ash.',
        hint: 'Climb the stair back to the arena.',
        check: 'watch:pa2-bubble:arena',
        scene: {
          id: 'pa2-12-bubble',
          lines: [
            N('Back in the arena, Mewtwo stands above the floor in the rain from the cracked roof. All his copies stand behind him.'),
            AS('You can’t just take everyone’s friends! You can’t!', 'angry'),
            N('Ash runs at it. Just runs, at the strongest thing in the world, with nothing in his hands.'),
            N('Mewtwo doesn’t even turn. Ash is flung up and back across the arena, towards the castle wall.'),
            N('He doesn’t hit it. Something has caught him: a pink bubble, soft as soap, floating him in the air like a dropped leaf.'),
            N('And beside the bubble, much smaller than anything else in the room, is something pink, with a long tail. It is laughing.'),
            ME('Dat’s da one! Dat’s what we followed all da way here! Da little pink one!', 'shock'),
            MT('Mew.', 'shock'),
          ],
        },
        done: {
          id: 'pa2-12-bubble-done',
          lines: [
            N('Mew sets Ash down on the stone as gently as a bubble sets down anything. He sits there with his mouth open.'),
          ],
        },
      },
      {
        id: 'pa2-12-s2',
        goal: 'Let your Nubbin play tag with Mew.',
        hint: 'Put your Nubbin down and watch the rafters.',
        check: 'watch:pa2-tag:rafters',
        scene: {
          id: 'pa2-12-tag',
          lines: [
            N('Mew sees your Nubbin. It stops laughing and looks at it, upside down, from very close.'),
            N('It has never seen one either. Unlike Mewtwo, Mew looks delighted about this.'),
            N('It taps your Nubbin on the nose and zips off up into the rafters, and looks back over its shoulder.'),
            N('Your Nubbin looks at you, and you nod. It flaps its tiny wings so hard it rises about a foot, and then climbs the rest.'),
            N('For a moment, in the middle of everything, they chase each other through the rafters under the rain.'),
            N('Mew lets itself be caught, once. Your Nubbin is so surprised it nearly falls off the beam.'),
            MI('Look at them. Just… look.', 'soft'),
            P('Screenshot. I’m taking a screenshot. I’m taking about forty.', 'happy'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer your Nubbin on.',
              then: [N('You cheer, and nobody in the arena tells you not to. Your Nubbin hears you and goes faster, and falls off, and climbs back.')],
            },
            {
              id: 'quiet',
              label: 'Just watch. Don’t spoil it.',
              then: [N('You watch, and don’t say anything, so as not to spoil it. You will remember it a long time.')],
            },
          ],
        },
        done: {
          id: 'pa2-12-tag-done',
          lines: [
            N('Mew blows a tiny pink bubble off the tip of its tail. It floats down and pops on your Nubbin’s nose, and your Nubbin’s ball goes pink.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-12-complete',
      lines: [
        MT('You are the original. The one they took me from. You do not get to play.', 'angry'),
        N('Mewtwo fires at Mew. Mew skips aside; the blast catches the bubble still hanging by Ash, and bursts it, and Ash falls.'),
        N('Brock catches him, and both of them sit down hard. Mew comes down out of the rafters, and it isn’t laughing now.'),
        N('Your Nubbin climbs down the wall into your arms. The last nice moment is over, and it knows it, and so do you.'),
      ],
    },
    rewards: [
      {
        id: 'pa2-pink-bubble',
        kind: 'cosmetic',
        label: 'Pink-bubble emote',
        description: 'Your Nubbin can blow a small pink bubble that floats up and pops on its own nose. Learned in the rafters of New Island.',
      },
    ],
    sets: { 'pa2-12': true },
    notes:
      'CHANGE FROM THE OUTLINE (small): the outline says Mewtwo’s blast at Mew hits Ash. Here it hits the bubble Ash ' +
      'is still in, and he falls into Brock’s arms, unhurt; the tag game comes before it so that it is the last nice ' +
      'moment. TAG: a short, unscored follow-the-pink-light sequence in the rafters; Mew lets itself be caught once. ' +
      'Mew is a licensed design and never speaks (giggles only, if the licence allows the sound).',
  },

  // ---------------------------------------------------------------- PA2-13
  {
    id: 'pa2-13',
    code: 'PA2-13',
    title: 'The Fight Without Powers',
    source: `${FILM}: originals and copies fight with their bodies`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-12') },
    requires: ['PA2-12'],
    speakers: [MEWTWO, ASH, MISTY, BROCK, MEOWTH, JESSIE, JAMES],
    steps: [
      {
        id: 'pa2-13-s1',
        goal: 'Watch the fight without powers.',
        hint: 'Stay at the edge of the arena. There is nothing to press.',
        check: 'watch:pa2-fight:arena',
        scene: {
          id: 'pa2-13-fight',
          lines: [
            MT('No powers. No tricks. No fire, no water, no lightning. We will see whose body is stronger, the made or the born.'),
            N('A grey light comes down from Mewtwo over the whole arena, and every creature’s power goes out of it like a candle.'),
            N('And then they fight, originals and copies, with their bodies. There is no sound but the rain, and slow music a long way off.'),
            N('It is not like the battles, because nobody is winning. Every one of them is getting more tired, and nobody stops.'),
            N('Pikachu’s copy hits him, and Pikachu falls over, and gets up, and doesn’t hit back. It hits him again.'),
            AS('Pikachu, fight back! Why won’t you fight back?', 'sad'),
            N('Pikachu gets up again and stands there. His face is the saddest thing in the arena.'),
            MI('Because he doesn’t want to, Ash.', 'sad'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stand with Misty.',
              then: [N('You stand beside her. She doesn’t look at you, but she moves over a little, so there is room.')],
            },
            {
              id: 'turn',
              label: 'Turn your Nubbin away from it.',
              then: [N('You pick it up and turn it round in your arms, and it turns its head straight back. It wants to see, even this.')],
            },
          ],
        },
        done: {
          id: 'pa2-13-fight-done',
          lines: [
            N('Across the arena, Meowth and his copy stop fighting at exactly the same moment. They sit down on the stone, side by side.'),
            ME('My face hurts.'),
            N('His copy says nothing, and nods. They sit there.'),
            ME('Same here, huh. Same places.', 'soft'),
          ],
        },
      },
      {
        id: 'pa2-13-s2',
        goal: 'Stay with your Nubbin when its copy comes.',
        hint: 'Keep close to your Nubbin. You can’t stop what happens; you can be there.',
        check: 'watch:pa2-nubbins:arena',
        scene: {
          id: 'pa2-13-nubbins',
          lines: [
            N('The new Nubbin comes across the arena towards you, and your Nubbin goes still. You put a hand on its back.'),
            N('The new one stops in front of it, exactly the same size. They look at each other for a long time.'),
            N('Then the new one does what the Meowths did. It sits down.'),
            N('Your Nubbin sits down too, beside it. Close, but not touching, because neither of them is sure about touching yet.'),
            N('The new one looks up at you, and you say its name, the one you gave it. Its ball goes, very faintly, the colour of a shell.'),
            N('In the middle of all that tiredness, two small round shapes sit side by side on the stone, and watch the rain.'),
            P('Look. Look at them. Nobody told them to do that.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-13-complete',
      lines: [
        JE('Look at them all. They’re the same. Made or born, they hurt the same.', 'sad'),
        JA('We do terrible things for money, Jessie. And even we think this is terrible.', 'sad'),
        N('Up above the arena, Mew and Mewtwo have stopped circling each other. They are gathering light, too much of it.'),
        BR('That’s not the same as before. That’s bigger.', 'shock'),
      ],
    },
    rewards: [],
    sets: { 'pa2-13': true },
    notes:
      'CARE (outline): sad, never exciting. NO hit sounds at all; slow, quiet music; the camera stays on Pikachu’s face ' +
      'through pa2-13-fight. Blows are shown as pushes and falls, never impact frames. PAYOFF of pa2-09-pod (four ' +
      'quests later): pa2-name = own plays pa2-13-nubbins as written; pa2-name = borrowed plays ARCADE_PA2_VARIANTS ' +
      'pa2-13-nubbins-borrowed instead (same check). In the borrowed variant your Nubbin never shoves back, and the ' +
      'copy is shown as frightened, not cruel: wide eyes, ball grey, pushing as if pushing a door.',
  },

  // ---------------------------------------------------------------- PA2-14
  {
    id: 'pa2-14',
    code: 'PA2-14',
    title: 'Between Them',
    source: `${FILM}: Ash runs between the blasts and is turned to stone`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-13') },
    requires: ['PA2-13'],
    speakers: [ASH, MISTY, BROCK],
    steps: [
      {
        id: 'pa2-14-s1',
        goal: 'Hold on to your Nubbin as the light gathers.',
        hint: 'Pick your Nubbin up and stay back by the wall.',
        check: 'carry:pa2-nubbin:arena-wall',
        scene: {
          id: 'pa2-14-light',
          lines: [
            N('Mew in pink, Mewtwo in blue: each of them gathers a ball of light so bright it turns the rain to sparks.'),
            N('Everything in the arena has stopped fighting. Every creature, made and born, is looking up.'),
            N('Your Nubbin is in your arms, though you don’t remember picking it up. Its ears are flat against its head.'),
            AS('Stop it! Both of you! Just stop!', 'angry'),
            BR('Ash, no. Ash, come back here.', 'shock'),
            N('Ash isn’t listening. He is running across the arena, between them, with his arms out.'),
            MI('ASH!', 'shock'),
          ],
        },
        done: {
          id: 'pa2-14-light-done',
          lines: [
            N('Both lights go at once and meet in the middle. Ash is in the middle.'),
            N('The whole arena goes white, and quiet, and stays quiet.'),
          ],
        },
      },
      {
        id: 'pa2-14-s2',
        goal: 'Stay near while Pikachu tries to wake Ash.',
        hint: 'Go and stand near Pikachu. Sit if you want to. There is nothing to fix.',
        check: 'sit:pa2-pikachu:arena',
        scene: {
          id: 'pa2-14-stone',
          lines: [
            N('When the light goes, Ash is standing where he was, with his arms out. He is grey all over, smooth as a statue.'),
            N('He isn’t moving or breathing, as far as you can see. He looks like he’s asleep standing up, inside stone.'),
            N('Pikachu runs to him. Pikachu puts a paw on his leg, and then lets out a little thunder, the smallest, to wake him.'),
            N('Nothing. A bigger one, and nothing, and again, and again.'),
            N('Each time it is weaker. Each time Pikachu looks up at Ash’s face to see if it worked.'),
            N('Your Nubbin climbs out of your arms. It goes and sits down next to Pikachu, close, and doesn’t do anything at all.'),
            N('Pikachu’s next thunder is hardly a spark, and he sits down. He leans against your Nubbin, and your Nubbin leans back.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down with them.',
              then: [N('You sit down on the wet stone next to them, and Misty comes and sits too. Nobody says anything.')],
            },
            {
              id: 'stand',
              label: 'Stand by Ash, one hand on his shoulder.',
              then: [N('You put a hand on his stone shoulder. It is cold, but under the cold it doesn’t feel empty, and you can’t say how you know.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-14-complete',
      lines: [
        N('Mew comes down slowly and looks at Ash, and Mewtwo comes down too. Neither of them has anything to say.'),
        P('He’s asleep. He’s asleep, it’s a sleep. It isn’t over. Stories like this don’t stop here.', 'sad'),
        P('Remember Miranda. Remember the story with the tea.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'pa2-14': true },
    notes:
      'CARE: the stone is a sleep, not a death. Keep Ash’s stone face peaceful, eyes closed. Pixel says plainly in ' +
      'the complete scene that it isn’t over, and PA2-15 opens straight away (offer it immediately, no menu between). ' +
      'Pikachu’s thunder gets visibly smaller each time; no sounds of pain. Your Nubbin sitting beside Pikachu is ' +
      'Hazel’s third rule, acted, never named.',
  },

  // ---------------------------------------------------------------- PA2-15
  {
    id: 'pa2-15',
    code: 'PA2-15',
    title: 'Tears',
    source: `${FILM}: every creature weeps, and Ash wakes`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Straight after PA2-14, from Pixel’s cabinet.' },
    requires: ['PA2-14'],
    speakers: [MEWTWO, ASH, MISTY, BROCK, MEOWTH],
    steps: [
      {
        id: 'pa2-15-s1',
        goal: 'Watch what every creature on the island does.',
        hint: 'Stay beside Ash and Pikachu.',
        check: 'watch:pa2-tears:arena',
        scene: {
          id: 'pa2-15-weep',
          lines: [
            N('Somewhere behind you a creature begins to cry, then another, a copy, then an original. You can’t tell which, and it doesn’t matter.'),
            N('Then all of them. Every creature in the arena, made or born, is crying for the boy who got in the way.'),
            N('Meowth is crying, and his copy beside him, and Mew. Your Nubbin is crying quietly, with its face in Pikachu’s fur.'),
            N('Across the arena, the new Nubbin is crying too. It doesn’t know why; it just is.'),
            N('Mewtwo stands with his back to all of it, not crying. He is looking at his own hands again.'),
            ME('Dey’re all da same. Look at ’em. Nobody can tell who’s who when dey’re cryin’.', 'sad'),
          ],
        },
        done: {
          id: 'pa2-15-weep-done',
          lines: [
            N('The tears don’t fall; they rise. Little points of light lift off every face in the arena and drift across the air.'),
          ],
        },
      },
      {
        id: 'pa2-15-s2',
        goal: 'See the old story come true.',
        hint: 'Watch the lights gather round Ash.',
        check: 'watch:pa2-ash:arena',
        scene: {
          id: 'pa2-15-wake',
          lines: [
            N('The lights drift to Ash and settle on the grey stone like snow, one by one, thousands of them.'),
            N('Where they settle, the grey goes. His hair first, then his face, then his hands, still held out.'),
            N('Ash’s arms come down. He sways, and Brock is there, and he doesn’t fall.'),
            AS('Pikachu?'),
            N('Pikachu hits him in the chest at full speed. Ash sits down on the stone with Pikachu in his arms, laughing, crying, both.'),
            MI('You idiot. You complete idiot.', 'happy'),
            N('Your Nubbin climbs up your leg and into your arms, and you hold on to it, and it holds on to you.'),
            N('It is what Miranda said. The tears of all of them, for the one on the stone.'),
          ],
          choices: [
            {
              id: 'miranda',
              label: '“She was right. The story was for using.”',
              then: [P('Writing that down too. Underlining it.', 'soft')],
            },
            {
              id: 'hold',
              label: 'Say nothing. Hold on.',
              then: [N('You hold on. Your Nubbin’s ball, right by your ear, goes slowly from a spiral to a heart.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-15-tears',
      lines: [
        N('The cartridge shows you the lantern shed for a moment, in the corner of the sky.'),
        N('Byte is back behind Pixel’s chair with the biscuit tin under his arm. He has a biscuit halfway to his mouth.'),
        N('He has stopped chewing. He doesn’t start again for a long while.'),
        P('You’re back. Good. Took you long enough.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'pa2-15': true },
    notes:
      'BYTE (s7Done): play ARCADE_PA2_VARIANTS pa2-15-tears-s7 instead of the complete scene pa2-15-tears. Byte’s line in ' +
      'it is the outline’s own, original. Without s7Done, Byte comes back with the biscuits here and stops chewing ' +
      '(as written). TEARS: soft points of light rising, not falling; no wailing sounds, only quiet crying under the ' +
      'music. The tears callback to Miranda’s story (PA2-6) is the only payoff it needs.',
  },

  // ---------------------------------------------------------------- PA2-16
  {
    id: 'pa2-16',
    code: 'PA2-16',
    title: 'What You Do With It',
    source: `${FILM}: Mewtwo understands, leaves with his copies and takes the day’s memory`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-15') },
    requires: ['PA2-15'],
    speakers: [MEWTWO, ASH],
    steps: [
      {
        id: 'pa2-16-s1',
        goal: 'Hear what Mewtwo has understood.',
        hint: 'Stay in the arena while Mewtwo speaks.',
        check: 'watch:pa2-mewtwo:arena',
        scene: {
          id: 'pa2-16-understand',
          lines: [
            N('Mewtwo turns round at last. He looks at the boy who was stone, at the creatures with wet faces, at his own copies among them.'),
            MT('He made himself a wall between us. He was nobody’s copy and nobody’s weapon. He did it anyway.', 'think'),
            MT('And they wept for him. Mine and yours. They could not tell the difference, and neither, now, can I.', 'soft'),
            MT(BIRTH_QUOTE, 'soft'),
            MT('It is not how you are made. It is what you do with your life, now that you have it.', 'soft'),
            N('Your Nubbin looks up at him, from your arms. Mewtwo looks back, and this time he doesn’t ask what it is.'),
          ],
          choices: [
            {
              id: 'where',
              label: '“Where will you go?”',
              then: [MT('Somewhere with no laboratory, and no man with an umbrella. We will know it when we see it.', 'soft')],
            },
            {
              id: 'nod',
              label: 'Nod to it.',
              then: [N('You nod. After a moment, Mewtwo nods back, as if it is a thing he has only just learned how to do.')],
            },
          ],
        },
        done: {
          id: 'pa2-16-understand-done',
          lines: [
            MT('My copies and I will go. We will find a place where we can live, and nobody will come looking for us.'),
            MT('And you will not remember this day. It is better. For you, and for us.'),
          ],
        },
      },
      {
        id: 'pa2-16-s2',
        goal: 'Say goodbye to the new Nubbin.',
        hint: 'Go to the new Nubbin before it leaves with the copies.',
        check: 'talk:pa2-clone:arena',
        scene: {
          id: 'pa2-16-go',
          lines: [
            N('The copies are gathering behind Mewtwo, quietly, all of them. The new Nubbin comes over to you first.'),
            N('It stops in front of your Nubbin, and then in front of you. Its ball is the colour of the inside of a shell.'),
            N('It opens its mouth and chirps: two chirps, then a third, rising. It has never made a sound before.'),
            N('It is the name you gave it, in the only way a Nubbin can say anything. You know it straight away.'),
            N('It turns and trots over to the copies, and stands among them, and looks very small and very sure.'),
            MT('And you. You have a name.', 'think'),
            N('The new Nubbin chirps it again at Mewtwo, quite firmly. Mewtwo bows his head to it slightly, as to an equal.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-16-complete',
      lines: [
        N('Mewtwo lifts his hand. A soft light goes out from him through the whole castle, through you, through the rain.'),
        P('He’s wiping it. The day. Everyone’s. I can see the memory bar going down.', 'shock'),
        P('Not yours, though. You came in through the cabinet. You don’t count. Hold on.', 'soft'),
        N('The last thing you see on New Island is the copies rising into the storm with Mewtwo, and among them, something small and round.'),
      ],
    },
    childLines: {
      'pa2-16-understand#3': 'I see now that it doesn’t matter how anyone began.',
    },
    rewards: [],
    sets: { 'pa2-16': true },
    notes:
      'LIFTED TEXT: pa2-16-understand#3 is the one quoted line (4Kids English dub, as printed in The Art of Pokémon, ' +
      'The First Movie); childLines gives an original replacement. PAYOFF of pa2-09-pod (seven quests later): ' +
      'pa2-name = own plays pa2-16-go as written. pa2-name = borrowed plays ARCADE_PA2_VARIANTS pa2-16-name-borrowed instead ' +
      '(same check), which offers the last chance and sets pa2-late = named | unnamed; named opens the name-entry box ' +
      'as in PA2-9 and stores pa2-clone-name. The clone’s chirp of its name is the Nubbin chirp sound, three notes, ' +
      'the last rising; it is not speech. MEMORY: the player keeps the day because they came in through the cabinet.',
  },

  // ---------------------------------------------------------------- PA2-17
  {
    id: 'pa2-17',
    code: 'PA2-17',
    title: 'The Wharf Again',
    source: `${FILM}: everyone wakes at the wharf, and Ash sees something in the clouds`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-16') },
    requires: ['PA2-16'],
    speakers: [ASH, MISTY, BROCK, JOY, MIRANDA],
    steps: [
      {
        id: 'pa2-17-s1',
        goal: 'Wake up at the wharf.',
        hint: 'Look round the Pokémon Center at Old Shore Wharf.',
        check: 'explore:pa2-center:wharf',
        scene: {
          id: 'pa2-17-wake',
          lines: [
            N('You open your eyes on a bench in the little Pokémon Center at Old Shore Wharf. Your Nubbin is asleep on your chest.'),
            N('Everyone is here: Ash, Misty, Brock and the three other trainers. Nurse Joy is behind her counter, blinking.'),
            JO('Goodness. I must have dozed off. How long have you all been sitting here?', 'think'),
            AS('Not sure. A while? Weird. I had a dream about… no. It’s gone.'),
            AS('Hey, what’s that? Is it a Pokémon?', 'happy'),
            Y('It’s a Nubbin.'),
            AS('Never heard of one! …Weird. I feel like I’ve said that before.'),
            N('Brock is already at the counter, on one knee, holding Nurse Joy’s hand. Misty has him by the ear before he finishes.'),
            MI('He forgot a whole island. He didn’t forget that.'),
            N('Outside the window, the storm is clearing. Blue sky is coming through in long cracks over the sea.'),
            N('Your Nubbin wakes and yawns. It looks straight out of the window towards the island, the way it looks for someone gone home.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Ask Ash if he remembers the island.',
              then: [AS('What island?'), N('He means it. He’s already looking round for something to eat.')],
            },
            {
              id: 'keep',
              label: 'Keep it to yourself.',
              then: [N('You keep it. It feels like something you were given to carry, and you are good at carrying.')],
            },
          ],
        },
        done: {
          id: 'pa2-17-wake-done',
          lines: [
            P('Nobody remembers. Only you. And me, I suppose. I was watching.', 'soft'),
          ],
        },
      },
      {
        id: 'pa2-17-s2',
        goal: 'Go out on the pier and look at the sky.',
        hint: 'Walk to the end of the pier with Ash and his friends.',
        check: 'walk:pa2-pier:wharf',
        scene: {
          id: 'pa2-17-sky',
          lines: [
            N('On the pier the planks are steaming in the sun. Miranda is hanging her oilskin on the rail to dry.'),
            MR('Storm’s gone. Funny. Felt like it went on for days, and it was one night.'),
            N('Ash stops dead and points up at the clouds.'),
            AS('Look! Up there. Something pink!', 'shock'),
            MI('It’s nothing. It’s a cloud. Clouds are pink sometimes.'),
            BR('Clouds don’t do loops, though.', 'think'),
            N('You look up. Something very small and pink goes round once in the blue and is gone.'),
            N('Your Nubbin waves both arms at the sky. It is the only one on the pier who does.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-17-complete',
      lines: [
        P('Funny thing. The cartridge’s save file. I just looked.', 'think'),
        P('It’s kept it. All of it. The island, the pods, the rafters, the tears. It doesn’t forget.', 'soft'),
        P('So that’s two of us. Three, with the cartridge.'),
        P('Also, the screenshots saved. All forty. Thirty-one are Mew’s tail. I’m not sorry.', 'happy'),
        N('Your Nubbin is still waving at the sky. Ash shrugs, and starts waving too, without knowing why.'),
      ],
    },
    rewards: [],
    sets: { 'pa2-17': true },
    notes:
      'STAGING: morning at the wharf, steam off the planks, the storm breaking up. Mew is a single pink speck doing ' +
      'one loop. Ash, Misty, Brock and the other trainers have forgotten; the player has not. Pixel’s “the save ' +
      'remembers” is the frame’s point: the Arcade save keeps every flag, and the cabinet will show it in PA2-18.',
  },

  // ---------------------------------------------------------------- PA2-18
  {
    id: 'pa2-18',
    code: 'PA2-18',
    title: 'Team Rocket’s Holiday',
    source: `${FILM}: Team Rocket on the green island, and the end`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA2-17') },
    requires: ['PA2-17'],
    speakers: [JESSIE, JAMES, MEOWTH],
    steps: [
      {
        id: 'pa2-18-s1',
        goal: 'See where Team Rocket woke up.',
        hint: 'Watch the last scene the cartridge shows you.',
        check: 'watch:pa2-rocket:new-island',
        scene: {
          id: 'pa2-18-holiday',
          lines: [
            N('The cartridge cuts away, the way films do at the end, to New Island. The castle is gone, and the island is green.'),
            N('There is grass over everything and flowers where the arena was. A stream runs down where the chute used to go.'),
            N('Three figures lie in the grass in what is left of their Viking costumes, blinking at the sky.'),
            JA('Jessie. Where are we?'),
            JE('No idea. But it’s lovely, isn’t it? The sun’s out. Nobody’s chasing anybody.', 'happy'),
            ME('I got a feelin’ we was supposed to be doin’ somethin’. Can’t remember what.', 'think'),
            JE('Then we’re not doing it. We’re on holiday.', 'happy'),
            JA('A holiday. Do you know, I don’t think we’ve ever had one.', 'happy'),
            ME('Who’s payin’ for it?'),
            JE('Nobody. That’s the best part.'),
            JA('I keep waiting for the bill.'),
            N('Meowth lies back in the grass with his paws behind his head. Somewhere, a long way off, a pink speck does a loop.'),
          ],
        },
        done: {
          id: 'pa2-18-holiday-done',
          lines: [
            P('Good for them. Honestly. Good for them.', 'happy'),
          ],
        },
      },
      {
        id: 'pa2-18-s2',
        goal: 'Step out of the cabinet and back into the lantern shed.',
        hint: 'Touch the glass from the inside, with your Nubbin in your arms.',
        check: 'explore:pa2-shed:lantern-shed',
        scene: {
          id: 'pa2-18-out',
          lines: [
            N('You put your hand on the inside of the sky. It is warm, then warm glass, and then you are standing in the lantern shed.'),
            N('It smells of solder and sawdust, and there is a biscuit crumb on the floor. Your Nubbin eats it immediately.'),
            P('You’re out. Welcome back. Sit down. You look like you’ve been to sea.', 'happy'),
            N('Pixel has the cartridge out, turning it over in her hands. Then she stops, and puts something in your hand.'),
            P('You had this in your pocket. It came out with you. Fluff. Your Nubbin’s, from the tray.', 'soft'),
            P('I can put it in a locket. A little one. If you want. It seems like a thing you keep.', 'soft'),
            N('The cabinet’s screen flickers, and the title is gone. The attract screen has changed.'),
          ],
          choices: [
            {
              id: 'locket',
              label: '“Yes, please. A locket.”',
              then: [P('Small brass one. I’ve got one in the drawer, waiting for something to go in it. Now it’s got something.', 'soft')],
            },
            {
              id: 'thanks',
              label: 'Thank her for being player two.',
              then: [P('Any time. Well, not any time. That one was a lot. But yes.', 'soft'), P('I’ll make the locket anyway. You’ll want it.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa2-18-complete',
      lines: [
        N('The attract screen shows a far mountain under a clear sky, with green on its sides and a river at the bottom.'),
        N('On the slopes, small and far off, are Mewtwo’s copies, living. Mewtwo stands on a rock above them.'),
        N('Among them, sitting on its own small rock, is a round shape with tiny wings, darker than your Nubbin, its ball the colour of a shell.'),
        N('Under it, in the little pixel letters the cabinet uses for high scores, is the name you gave it.'),
        P('It’ll stay like that now. The attract screen. Every time anyone walks past.', 'soft'),
        N('Your Nubbin climbs on to the cabinet and puts its nose against the glass, right where the other one is sitting.'),
        P('And there’s your plate. High score. You didn’t battle anyone once. I put that on it too.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'pa2-fluff-locket',
        kind: 'cosmetic',
        label: 'Tuft-of-fluff locket',
        description: 'A small brass locket Pixel made, with a tuft of your Nubbin’s fluff inside from the tray on New Island. Worn round the neck.',
      },
      {
        id: 'pa2-high-score',
        kind: 'decor',
        label: 'The Clone Island high-score plate',
        description: 'A brass plate for the cabinet: your initials, the cartridge, and “No battles”. Counts towards High Score Night.',
      },
    ],
    sets: { 'pa2-18': true, 'pa2-done': true },
    notes:
      'ENDING (pays off pa2-09-pod nine quests later): three ways, one complete scene each. pa2-name = own plays ' +
      'pa2-18-complete as written. pa2-name = borrowed with pa2-late = named plays ARCADE_PA2_VARIANTS pa2-18-complete-late; ' +
      'with pa2-late = unnamed plays pa2-18-complete-nameless. SIM: the cabinet’s attract screen keeps that image for ' +
      'good, drawn with the stored pa2-clone-name under the clone (own, or late), or a blank plate (nameless). It ' +
      'shows whenever the cabinet is idle in the lantern shed. HIGH SCORE NIGHT: pa2-done counts towards the frame’s ' +
      'two-cartridge unlock. LEARNING GROVE: none, because of the licence. If ever licensed, the outline’s topics ' +
      'are what twins and clones share and don’t, why storms close harbours, and how stories about tears and healing ' +
      'turn up in many cultures.',
  },
];

// =================================================================== variants

/**
 * Variant scenes, chosen by flags. Each names the scene it replaces in a comment; the quest notes say the same.
 */
export const ARCADE_PA2_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- PA2-1, s21Done: replaces pa2-01-shed
  {
    id: 'pa2-01-shed-clank',
    lines: [
      N('The lantern shed smells of solder and old sawdust. The cabinet hums in the corner, under a string of lantern bulbs.'),
      N('Clank is sitting on top of the cabinet with his wheels hanging over the edge, like a cat on a warm boiler.'),
      CK('Announcement! I am supervising! This is a very important box!', 'happy'),
      N('Pixel is sitting on an upturned crate in front of it, with a cartridge in her lap.'),
      P('Found this one wedged behind the coin box. With the mouse nest. The mice had good taste.', 'happy'),
      N('She blows the dust off. The label is faded, but there is a shape on it, purple, with a long tail.'),
      CK('Purple! My best colour. Announcement: purple is my best colour now.'),
      N('Byte is standing behind her chair with his arms folded, as if the chair might do something.'),
      B('I’m here to check the maths. Arcades are probability with a coin slot.'),
      P('He’s here because I said there’d be biscuits.'),
      B('That too.'),
      N('One of Byte’s laces is undone. Pixel looks at it, then at him, and says nothing. It is a lot of nothing.'),
      B('I’m aware.'),
      P('I haven’t said a word.'),
      B('You’re saying it very loudly.'),
    ],
    choices: [
      {
        id: 'blow',
        label: 'Blow on the cartridge too, for luck.',
        then: [P('That doesn’t do anything, you know. Electrically.', 'happy'), CK('I will also blow! For science!'), P('Do it again.', 'happy')],
      },
      {
        id: 'ask',
        label: 'Ask what it’s about.',
        then: [P('No idea. The writing’s gone. I like that, actually. You go in not knowing, like a door.')],
      },
      {
        id: 'byte',
        label: 'Ask Byte what the odds are.',
        then: [B('Of what?'), Y('Of it being good.'), B('Insufficient data. Which is the honest answer to most things.', 'think')],
      },
    ],
  },
  // ---------------------------------------------------------------- PA2-1, s7Done: replaces pa2-01-title
  {
    id: 'pa2-01-title-s7',
    lines: [
      N('The cartridge goes in with a clunk. The screen fizzes, then a title rises out of the dark: an island, and over it, a shape.'),
      B('Right. Well. Let’s see the—'),
      N('He stops. He is looking at the shape on the screen, the made one, and he doesn’t finish.'),
      N('Pixel glances back at him. He doesn’t say anything else, and he doesn’t go for a biscuit either.'),
    ],
  },
  // ---------------------------------------------------------------- PA2-4, s7Done: replaces pa2-04-complete
  {
    id: 'pa2-04-complete-s7',
    lines: [
      N('The cartridge fades to the cabinet’s little corner window: the lantern shed, Pixel’s face lit blue by the screen.'),
      N('Behind Pixel’s chair stands Byte, with his arms still folded. He hasn’t moved or said anything since the title.'),
      P('He asked what he was for, and somebody answered.', 'soft'),
      N('Byte says nothing. His hand moves to his pocket, where he keeps the stopwatch charm, and stays there.'),
    ],
  },
  // ---------------------------------------------------------------- PA2-13, pa2-name = borrowed: replaces pa2-13-nubbins
  {
    id: 'pa2-13-nubbins-borrowed',
    lines: [
      N('The new Nubbin comes across the arena towards you, and your Nubbin goes still. You put a hand on its back.'),
      N('The new one stops in front of it. They are exactly the same size, and they have the same name, because you gave it to them.'),
      N('The new one pushes your Nubbin, not hard. It is like pushing a door to see if it will open.'),
      N('Your Nubbin rocks back, and sits up again, and looks at it. It doesn’t push back.'),
      N('The new one pushes it again, harder, with both paws. Its eyes are very wide and its ball is grey.'),
      N('There is one name, and two of them. It thinks there is only room for one.'),
      N('Again, and again. Your Nubbin falls over, and gets up, and doesn’t push back, every time.'),
      P('It’s not being cruel. It’s frightened. It thinks one of them has to stop being.', 'sad'),
    ],
    choices: [
      {
        id: 'between',
        label: 'Kneel down between them.',
        then: [
          N('You kneel. The new one stops pushing and looks at you, and you see it is shaking.'),
          N('It backs away, two steps, three, and sits down on its own, where the rain from the roof comes in.'),
        ],
      },
      {
        id: 'wait',
        label: 'Let your Nubbin decide.',
        then: [
          N('Your Nubbin gets up one more time. It doesn’t push; it just stands there, with its paws at its sides.'),
          N('The new one stops, with its paws still up. Then it turns round and walks away, very fast, and sits down alone.'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- PA2-6, s7Done unset: replaces pa2-06-complete
  {
    id: 'pa2-06-complete-unset',
    lines: [
      N('The rain hammers the hut roof. Outside, a boat bumps against the pier where no boat should be.'),
      MR('Take this. You’ll want a light that doesn’t blow out. I’ve another.'),
      N('She gives you a storm lantern: brass, dented, with a glass that has been mended once. It is still warm from her hand.'),
      P('Byte’s biscuit run is now longer than this storm.'),
      P('I’m not worried. I’m timing it.', 'happy'),
      MR('And remember the story. You never know which ones are for using.'),
    ],
  },
  // ---------------------------------------------------------------- PA2-15, s7Done: replaces pa2-15-tears
  {
    id: 'pa2-15-tears-s7',
    lines: [
      N('The cartridge shows you the lantern shed for a moment, in the corner of the sky.'),
      N('Byte is still standing behind Pixel’s chair, where he has been the whole time. He is looking at the copies, crying with the rest.'),
      B('I gave Null a bell for everything. I never asked Null what it wanted.', 'sad'),
      N('He says it to nobody, and Pixel doesn’t turn round. She reaches back without looking and takes hold of his sleeve.'),
      N('She doesn’t let go of it for the rest of the cartridge.'),
    ],
  },
  // ---------------------------------------------------------------- PA2-16, pa2-name = borrowed: replaces pa2-16-go
  {
    id: 'pa2-16-name-borrowed',
    lines: [
      N('The copies are gathering behind Mewtwo, quietly, all of them. The new Nubbin is at the back, by itself.'),
      MT('You. Small one. What is your name?'),
      N('The new Nubbin chirps your Nubbin’s name, the only way it can. It is the only name anyone ever gave it.'),
      MT('No. That name was already taken before you woke. It belongs to the one in that Keeper’s arms.', 'think'),
      MT('You are not that one. You never were. You are something new.'),
      N('The new Nubbin looks at you, its ball grey. It is waiting, the way it waited in the pod.'),
      P('It’s your last chance. You can give it one now. Its own. It’s not too late.', 'soft'),
    ],
    choices: [
      {
        id: 'name-now',
        label: 'Give it a name of its own, now.',
        set: { 'pa2-late': 'named' },
        then: [
          Y('I’m sorry. I gave you the wrong one. This one is yours.'),
          N('You say the name, and it tilts its head. You say it again, slower.'),
          N('It chirps it back, two chirps and a third, rising. Its ball turns the colour of the inside of a shell.'),
          N('It trots over to the copies, and stands among them, and looks very small and very sure. Mewtwo bows his head to it.'),
        ],
      },
      {
        id: 'let-go',
        label: 'Say nothing. Let it go as it is.',
        set: { 'pa2-late': 'unnamed' },
        then: [
          N('You don’t say anything. You can’t think of anything that would be right.'),
          N('The new Nubbin waits a little longer. Then it turns and goes to the copies, without a name.'),
          N('At the edge of them it stops, and looks back at you, over its shoulder. Then it goes on.'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- PA2-18, borrowed + named late: replaces pa2-18-complete
  {
    id: 'pa2-18-complete-late',
    lines: [
      N('The attract screen shows a far mountain under a clear sky, with green on its sides and a river at the bottom.'),
      N('On the slopes, small and far off, are Mewtwo’s copies, living. Mewtwo stands on a rock above them.'),
      N('Among them, a little apart, is a round shape with tiny wings, darker than your Nubbin. Its ball is the colour of a shell.'),
      N('Under it, in the little pixel letters the cabinet uses for high scores, is the name you gave it. Late, but its own.'),
      P('It’ll stay like that now. The attract screen. Every time anyone walks past.', 'soft'),
      N('Your Nubbin climbs on to the cabinet and puts its nose against the glass, right where the other one is sitting.'),
      P('And there’s your plate. High score. You didn’t battle anyone once. I put that on it too.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- PA2-18, borrowed + unnamed: replaces pa2-18-complete
  {
    id: 'pa2-18-complete-nameless',
    lines: [
      N('The attract screen shows a far mountain under a clear sky, with green on its sides and a river at the bottom.'),
      N('On the slopes, small and far off, are Mewtwo’s copies, living. Mewtwo stands on a rock above them.'),
      N('At the very edge of them is a round shape with tiny wings, darker than your Nubbin. It is looking back over its shoulder.'),
      N('Under it, where the cabinet puts a name, there is a blank plate. Three dashes, waiting.'),
      P('It’ll stay like that now. The attract screen. Every time anyone walks past.', 'sad'),
      N('Your Nubbin climbs on to the cabinet and puts its nose against the glass, right where the other one is looking back.'),
      P('And there’s your plate. High score. You didn’t battle anyone once. I put that on it too.', 'soft'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this cartridge sets (the Arcade save only). It reads s7Done and s21Done and writes no Grove flag. */
export const ARCADE_PA2_FLAGS: string[] = [
  'pa2-01',
  'pa2-02',
  'pa2-03',
  'pa2-04',
  'pa2-05',
  'pa2-06',
  'pa2-07',
  'pa2-08',
  'pa2-09',
  'pa2-10',
  'pa2-11',
  'pa2-12',
  'pa2-13',
  'pa2-14',
  'pa2-15',
  'pa2-16',
  'pa2-17',
  'pa2-18',
  'pa2-done', // PA2-18: the whole cartridge; counts towards High Score Night
  'pa2-name', // own | borrowed (pa2-09-pod): the signature choice; PA2-13, PA2-16, PA2-18
  'pa2-late', // named | unnamed (pa2-16-name-borrowed, borrowed path only): PA2-18's ending
];

export const ARCADE_PA2_CHECKS: string[] = [
  'inspect:pa2-cartridge:cabinet',
  'explore:pa2-hillside:harbour',
  'watch:pa2-tank:lab',
  'watch:pa2-amber:lab',
  'wait:pa2-prologue:lab',
  'watch:pa2-wake:lab',
  'climb:pa2-cliff:new-island',
  'watch:pa2-giovanni:new-island',
  'watch:pa2-gym:viridian',
  'wait:pa2-stands:viridian',
  'watch:pa2-flight:viridian',
  'watch:pa2-raymond:meadow',
  'collect:pa2-letter:dragonite',
  'watch:pa2-hologram:meadow',
  'talk:pa2-miranda:pier',
  'craft:pa2-tea:pier-hut',
  'walk:pa2-boat:pier',
  'swim:pa2-sea:storm',
  'walk:pa2-joy:castle-hall',
  'watch:pa2-mewtwo:castle-hall',
  'talk:pa2-mewtwo:castle-hall',
  'explore:pa2-lab:below-castle',
  'watch:pa2-machine:lab',
  'choose:pa2-clone:name',
  'watch:pa2-battles:arena',
  'carry:pa2-nubbin:coat',
  'watch:pa2-pikachu:arena',
  'explore:pa2-chute:lab',
  'collect:pa2-pods:lab',
  'watch:pa2-bubble:arena',
  'watch:pa2-tag:rafters',
  'watch:pa2-fight:arena',
  'watch:pa2-nubbins:arena',
  'carry:pa2-nubbin:arena-wall',
  'sit:pa2-pikachu:arena',
  'watch:pa2-tears:arena',
  'watch:pa2-ash:arena',
  'watch:pa2-mewtwo:arena',
  'talk:pa2-clone:arena',
  'explore:pa2-center:wharf',
  'walk:pa2-pier:wharf',
  'watch:pa2-rocket:new-island',
  'explore:pa2-shed:lantern-shed',
];
