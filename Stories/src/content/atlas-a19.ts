/**
 * Atlas campaign, page A19: The Dragon Who Fell (Part M, rank 18). Eighteen quests, A19-1 to A19-18.
 *
 * SOURCE. How to Train Your Dragon, the 2010 DreamWorks Animation film (dir. Chris Sanders and
 * Dean DeBlois; released 26 March 2010), loosely based on Cressida Cowell's 2003 novel. Rights:
 * the film is © DreamWorks Animation (now part of Universal); the books and the characters' names
 * are © Cressida Cowell. A LICENCE FROM DREAMWORKS ANIMATION IS NEEDED TO SHIP THIS PAGE. We follow
 * the film's plot, not the book's (in the book every child trains a dragon and Toothless is tiny);
 * nothing is taken from Cowell's text, and nothing from the 2025 live-action remake. No music, no
 * film designs: Toothless, Berk and every dragon are drawn in the atlas's own charcoal style.
 *
 * AUDIENCE. 'all'. Both lifted lines have a `childLines` replacement for the Learning Grove.
 *
 * FRAME. Nova's atlas falls open at a page drawn in charcoal: a grey sea and a crooked island.
 * You and your Nubbin come in on a supply boat and lodge over Gobber's forge, as the help.
 * Gobber decides your Nubbin is a dragon hatchling from somewhere far south, and decides not to
 * ask. Hiccup is the hero; you pump the bellows, carry fish, hold the lamp, keep his secret and
 * sit at the edge of the cove. Nobody from the valley comes. Dragons never talk (the film's
 * don't); your Nubbin never talks. Only the people of Berk speak.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - sableFirst (slow | grab; campaign c3-open). A19-8, step 2: A19_VARIANTS 'a19-08-hand-slow'
 *     (slow) or 'a19-08-hand-grab' (grab) replaces 'a19-08-hand'. Slow: you remember the first
 *     night with Sable and sit very still; Hiccup finds the hand on his own. Grab: you remember
 *     her bolting, and when your Nubbin starts towards Toothless you put a hand out, not to grab,
 *     only to slow it. Unset (shouldn't happen once the atlas is in the Grove): the base scene,
 *     with no memory line.
 *   - sableFirst again in A19-18: when it is slow or grab, the complete scene carries the
 *     narration line "Some things come back if you wait. Some things you have to wait for twice."
 *     The base complete scenes have it; the '-unset' variants are the same scenes without it.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a19-):
 *   - a19-01 … a19-18: each quest on completion. a19-done: the whole page (A19-18); the Great
 *     Voyage festival reads it through atlasDone('A19').
 *   - a19-first = crouch | ran (A19-4, a19-04-bound): the signature choice. Pays off in A19-8
 *     (step 3), A19-11 (step 3) and A19-18 (step 2 done and the complete scene).
 *
 * VARIANTS (A19_VARIANTS), chosen by flags:
 *   - a19-08-hand-slow / a19-08-hand-grab replace a19-08-hand (sableFirst).
 *   - a19-08-near-ran replaces a19-08-near (a19-first = ran).
 *   - a19-11-turn-ran replaces a19-11-turn (a19-first = ran).
 *   - a19-18-village-done-ran replaces a19-18-village-done (a19-first = ran).
 *   - a19-18-complete-ran replaces a19-18-complete (a19-first = ran, sableFirst set).
 *   - a19-18-complete-unset (crouch) and a19-18-complete-ran-unset (ran) replace it when
 *     sableFirst is unset.
 *
 * LIFTED TEXT (copyrighted: two one-sentence lines, the only ones Part M lists; from the 2010
 * film as widely quoted, per Sideshow's quote list. CHECK BOTH AGAINST THE LICENSED SCRIPT):
 *   1. "It's twelve days north of Hopeless, and a few degrees south of Freezing to Death."
 *      Hiccup, a19-01-arrive#6 (in the film it is his opening narration; here he says it to you
 *      on the jetty).
 *   2. "I wouldn't kill him, because he looked as frightened as I was." Hiccup, a19-14-astrid#5.
 * Each is used once. Every other line is original. Famous film lines near these beats are
 * deliberately NOT used or echoed (Gobber's "go for the kill", the book's "kill on sight",
 * Hiccup's "I'm not one of them" and "I looked at him and I saw myself", Stoick's disowning
 * and his "proud to call you my son", "occupational hazard", Fishlegs's shot limits, the
 * "I could've sworn you had" naming line).
 *
 * CARE NOTES.
 *   - Hiccup's lost foot (A19-18) is shown as the film shows it: plainly, no blood, no wound,
 *     and as something he and Toothless now share. Never a tragedy, never fixed. Gobber, who
 *     wears a peg leg himself, made it. Work with an adviser who has a limb difference on
 *     a19-18-wake before ship.
 *   - Dragon killing is talked about, never shown. No dragon dies on screen but the great one in
 *     A19-17, whose end is a fall and a fire seen from far along the beach. The slow Gronckle in
 *     the nest (A19-12) is lost in the mist, offscreen.
 *   - The Norse world is the film's comic one. One light oath (Gobber, A19-16). No religious
 *     practice; modern Heathenry is a living faith and none of it is shown.
 *   - Stoick disowning Hiccup (A19-13) is one narrated line, short and grave, with no words given.
 *     His apology in A19-16 is just as plain: "I was wrong. I'm sorry, son."
 *   - Peril and fire, all softened as above, so 'all', not 'teen'.
 *   - Hazel's third rule is acted (A19-14, sitting by Hiccup on the cliff), never quoted.
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

const WHERE = 'Nova’s atlas: the Dragon Who Fell page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SRC = 'How to Train Your Dragon (DreamWorks Animation, 2010)';

// ------------------------------------------------------------------ speakers

const FILM = 'How to Train Your Dragon (DreamWorks Animation, 2010; after Cressida Cowell); original design';
const HICCUP = sp('a19-hiccup', 'Hiccup', `Hiccup, the chief’s son, in ${FILM}`);
const STOICK = sp('a19-stoick', 'Stoick', `Stoick the Vast, chief of Berk, in ${FILM}`);
const GOBBER = sp('a19-gobber', 'Gobber', `Gobber, the one-handed smith, in ${FILM}`);
const ASTRID = sp('a19-astrid', 'Astrid', `Astrid, in ${FILM}`);
const FISHLEGS = sp('a19-fishlegs', 'Fishlegs', `Fishlegs, in ${FILM}`);
const SNOTLOUT = sp('a19-snotlout', 'Snotlout', `Snotlout, in ${FILM}`);
const RUFFNUT = sp('a19-ruffnut', 'Ruffnut', `Ruffnut, one of the twins, in ${FILM}`);
const TUFFNUT = sp('a19-tuffnut', 'Tuffnut', `Tuffnut, one of the twins, in ${FILM}`);

const N = say('narrator');
const Y = say('you');
const H = say('a19-hiccup');
const ST = say('a19-stoick');
const GB = say('a19-gobber');
const A = say('a19-astrid');
const FL = say('a19-fishlegs');
const SN = say('a19-snotlout');
const RF = say('a19-ruffnut');
const TF = say('a19-tuffnut');

// ------------------------------------------------------------------ lifted text (film, 2010)

/** The 2010 film, Hiccup's opening narration, as widely quoted. Check against the licensed script. */
const LIFT_NORTH = 'It’s twelve days north of Hopeless, and a few degrees south of Freezing to Death.';
/** The 2010 film, Hiccup to Astrid on the cliff, first sentence only. Check against the licensed script. */
const LIFT_FRIGHTENED = 'I wouldn’t kill him, because he looked as frightened as I was.';

// ------------------------------------------------------------------ shared pieces

/** A19-8, step 2: the hand itself, shared by the base scene and both sableFirst variants. */
const HAND_REACH: Line[] = [
  N('Hiccup comes out of the last line and finds Toothless right in front of him, closer than he has ever been.'),
  N('Hiccup lifts his hand, slowly. Toothless pulls back his lips.'),
  N('Hiccup stops. He doesn’t pull his hand back, and he doesn’t push it forward either.'),
  N('Then he closes his eyes, and turns his face away, and holds his hand out in the air between them, open.'),
];
const HAND_TOUCH: Line[] = [
  N('Nobody moves. A drip falls from the rock wall into the lake.'),
  N('Then Toothless leans in, and pushes his nose into Hiccup’s palm.'),
  H('…Oh.', 'soft'),
];

/** A19-8, step 3: the opening shared by the crouch and ran scenes. */
const NEAR_START: Line[] = [
  N('Toothless takes his nose out of Hiccup’s hand and looks past him, at you, and at your Nubbin.'),
  H('He’s looking at you two. Stay still. Let him decide.'),
];

/** A19-11, step 3: the opening shared by the crouch and ran scenes. */
const TURN_START: Line[] = [H('One more round, before the light goes. Small passengers only.', 'happy')];

/** A19-18 complete: the saddle, shared by every ending. */
const C18_SADDLE: Line[] = [
  N('Late in the afternoon, Hiccup and Toothless land on the cliff top, where you are sitting with your Nubbin.'),
  N('Hiccup holds out a saddle: a tiny one, of soft leather, with a tail-fin badge stitched on the side. It is exactly your Nubbin’s size.'),
  H('Gobber kept asking what the saddle was for, that night at the forge. I thought: why not one for your Nubbin, too.'),
];
/** A19-18: the Sable line (only when sableFirst is slow or grab). */
const C18_SABLE: Line = N('Some things come back if you wait. Some things you have to wait for twice.', 'soft');
/** A19-18, crouch: the gift of a fish, then home. */
const C18_FISH: Line[] = [
  N('Toothless pads over. He drops a whole fish, a good silver one, at your Nubbin’s feet, and sits back, and waits.'),
  N('Your Nubbin looks at the fish, and at Toothless, and at you. Then it puts both paws on the fish, very proud, and doesn’t eat it.'),
  N('The sea goes still and grey, and smudges under your hand. You are back in the Grove, with a small saddle on your knee and a smell of fish.'),
];
/** A19-18, ran: the saddle anyway, and the wait. */
const C18_RAN_WAIT: Line[] = [
  H('He’s still not sure about you two. That’s all right. You can have it anyway.', 'soft'),
  N('Hiccup goes down to supper. Toothless stays on the cliff, a long way off, looking at the sea.'),
  N('You stay where you are, and you don’t call him or look at him. The sun goes down, and nothing happens for a long time.'),
];
const C18_RAN_END: Line[] = [
  N('Then there is a soft thump in the grass beside you. Toothless has come, and sat down close enough to touch.'),
  N('Your Nubbin leans against his side. He lets it, and you all watch the sea.', 'soft'),
  N('The sea goes still and grey, and smudges under your hand. You are back in the Grove, with a small saddle on your knee and the first stars out.'),
];

// =================================================================== THE DRAGON WHO FELL

export const ATLAS_A19: Quest[] = [
  // ---------------------------------------------------------------- A19-1
  {
    id: 'a19-01',
    code: 'A19-1',
    title: 'This Is Berk',
    source: `${SRC}: the night raid`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [HICCUP, GOBBER],
    steps: [
      {
        id: 'a19-01-s1',
        goal: 'Come ashore on Berk and find somewhere to sleep.',
        hint: 'Touch the page, then walk up the jetty to the boy counting barrels.',
        check: 'visit:a19-forge:loft',
        scene: {
          id: 'a19-01-arrive',
          lines: [
            N('Nova’s atlas falls open at a page drawn in charcoal: a grey sea, a crooked island, and rain scratched in at a slant.'),
            N('In the corner someone has drawn a pair of black wings, then rubbed them out, then drawn them again.'),
            N('The charcoal smudges under your thumb and goes cold and wet. Then it is spray, and you and your Nubbin are on the deck of a small boat.'),
            N('Ahead, an island of cliffs and wooden houses climbs out of the sea, with sheep on every ledge that will hold one.'),
            N('On the jetty a skinny boy in a fur waistcoat is counting barrels, badly, because he keeps looking at the sky.'),
            Y('Where is this?'),
            H(LIFT_NORTH),
            H('Berk. Home. I’m Hiccup. Yes, it’s a real name. No, I didn’t pick it.'),
            N('A big man stumps down the jetty, with a hammer in his one hand and a hook where the other should be.'),
            GB('Iron for the forge, at last. And what’s that?', 'think'),
            N('Your Nubbin, who has been sick twice over the side, peers up at him.'),
            GB('A hatchling. Something from the south, by the colour. Small, round, no teeth to speak of.'),
            GB('No. Don’t tell me. If I don’t know what it is, I don’t have to do anything about it.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Tell him it’s a Nubbin.',
              then: [GB('A Nubbin. Right. Never heard of one, so it can’t be on the list of things to hit.')],
            },
            {
              id: 'wing',
              label: 'Let your Nubbin wave a wing at him.',
              then: [N('Your Nubbin waves one stubby wing. Gobber waves his hook back, gravely, as one professional to another.')],
            },
            {
              id: 'quiet',
              label: 'Say nothing at all.',
              then: [H('That’s the right answer with Gobber. He likes a mystery he doesn’t have to solve.')],
            },
          ],
        },
        done: {
          id: 'a19-01-arrive-done',
          lines: [
            GB('You’ll want work. Everyone on Berk works or gets eaten. There’s a loft over the forge, and bellows with nobody on them.'),
            H('Welcome to the forge. Mind the sword rack. And the axe rack. And the ceiling.', 'happy'),
          ],
        },
      },
      {
        id: 'a19-01-s2',
        goal: 'Keep the forge fire hot while the raid goes on outside.',
        hint: 'Pump the bellows in time; the fire wants long, steady pushes.',
        check: 'minigame:a19-bellows:forge',
        scene: {
          id: 'a19-01-raid',
          lines: [
            N('You wake in the dark to horns, and shouting, and a red light under the loft door that isn’t morning.'),
            N('Out in the lane a roof is burning. Something with wings lifts a sheep off a wall, and the sheep looks more surprised than anyone.'),
            GB('Keeper! Bellows! Every axe on Berk comes back blunt by midnight, and every one of them wants an edge!'),
            N('You pump, and the fire roars white. Your Nubbin sits on the end of the anvil, flinching at every bang from outside.'),
            H('Sorry I’m late. I was out there. Briefly. Everybody told me to come back in here, very firmly.', 'sad'),
            GB('Because out there you’re a danger to yourself and everyone near you, and in here you’re only a danger to me.'),
            H('That’s fair. That’s actually fair.', 'think'),
            N('Vikings run in with blunt axes and run out with sharp ones. Nobody looks at Hiccup, except to step round him.'),
            H('Every raid, the same. Gronckles, Nadders, a Zippleback if we’re lucky. And one that nobody has ever seen.'),
            GB('Don’t start.'),
            H('I’m only saying. You bring down one of those, you’re somebody here.', 'think'),
          ],
        },
        done: {
          id: 'a19-01-raid-done',
          lines: [
            N('By the end your arms are jelly, and your Nubbin has fallen asleep on the anvil, which nobody else on Berk could do.'),
            GB('Not bad, for the help. Hiccup, stay here. Stay. Here.'),
          ],
        },
      },
      {
        id: 'a19-01-s3',
        goal: 'Help Hiccup get his home-made launcher out of the forge.',
        hint: 'Take one end of the launcher and wheel it out of the forge door.',
        check: 'carry:a19-launcher:forge-door',
        scene: {
          id: 'a19-01-launcher',
          lines: [
            N('The moment Gobber is out of the door, Hiccup is under his workbench, pulling a sheet off something with wheels.'),
            N('It is a wooden frame with a crank, and three stones tied together on ropes, folded into its mouth like a sneeze.'),
            H('Bola launcher. I made it. The ropes wrap round the wings, the dragon comes down, and I stop being… whatever they call me.'),
            Y('What do they call you?'),
            H('Mostly they don’t. That’s the problem.', 'sad'),
            H('It needs to go up on the cliff. It’s heavy, it’s badly balanced, and it will probably go off on the way.'),
            N('Your Nubbin, awake now, looks at the launcher, then at the open door, then at you.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Take the back end.',
              then: [
                N('You take the back end. It is heavier than it looks, and it creaks in a way that sounds like a warning.'),
                H('Thank you. Nobody ever takes the back end.', 'happy'),
              ],
            },
            {
              id: 'gobber',
              label: 'Gobber said to stay here.',
              then: [
                H('Gobber also says the soup is fish. It isn’t always fish.', 'think'),
                N('He starts pushing it out on his own. You find you have taken the back end anyway.'),
              ],
            },
          ],
        },
        done: {
          id: 'a19-01-launcher-done',
          lines: [N('Out into the lane you go, past a burning cart and a Viking chasing his own helmet down the hill.')],
        },
      },
    ],
    complete: {
      id: 'a19-01-complete',
      lines: [
        N('You get the launcher up the slope behind the forge, to a lip of rock over the dark sea.'),
        H('There. Now we wait for the one nobody sees.'),
        N('Hiccup kneels behind the crank. His hands are shaking a bit, but he holds them still on purpose.'),
        H('If I hit it, they’ll have to look at me. That’s all I want. One look.', 'soft'),
        N('Out over the water, very high, something screams like tearing cloth.'),
      ],
    },
    rewards: [],
    sets: { 'a19-01': true },
    childLines: {
      'a19-01-arrive#6': 'It’s a long way north of anywhere, and only a little bit warmer than an icicle.',
    },
    notes:
      'OPENING: the atlas page is drawn in charcoal and colours in as you step through (grey first, then the sea and ' +
      'the fires). a19-01-arrive#6 is lifted line 1 (the film’s opening narration, spoken here by Hiccup). Gobber has ' +
      'one hand and a hook, and later a peg leg: draw both plainly and without comment. The raid is fire and noise ' +
      'seen from the forge door; the sheep are lifted, never hurt. The bellows minigame cannot be lost. Your Nubbin is ' +
      'about the size of a small dragon on this page, and Gobber treats it as a hatchling throughout.',
  },

  // ---------------------------------------------------------------- A19-2
  {
    id: 'a19-02',
    code: 'A19-2',
    title: 'The Night Fury',
    source: `${SRC}: the shot in the dark`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-1') },
    requires: ['A19-1'],
    speakers: [HICCUP, STOICK, GOBBER],
    steps: [
      {
        id: 'a19-02-s1',
        goal: 'Watch the sky with Hiccup, and see where the shot goes.',
        hint: 'Stay by the launcher on the cliff and keep your eyes on the stars.',
        check: 'watch:a19-sky:cliff',
        scene: {
          id: 'a19-02-shot',
          lines: [
            N('Below, a tower of torches burns, and Vikings throw everything they have at the sky.'),
            N('Then there is that sound again, a high rising whistle, and a tower bursts apart in blue-white fire.'),
            H('That’s it. That’s the one. It never steals, never shows itself, never misses.'),
            N('You look up and see nothing. Only stars, and then not stars, where something black has crossed in front of them.'),
            H('Come on. Give me something. Anything to aim at.'),
            N('The whistle comes again. Hiccup sees the flash of it, swings the launcher round, and pulls.'),
            N('The bola spins up into the dark. Far out there is a shriek, and a shape tumbles out of the sky behind the ridge.'),
            H('I hit it. I hit it! Did anybody see that?', 'shock'),
            N('Down in the village, nobody did. Your Nubbin did, and so did you.'),
          ],
          choices: [
            {
              id: 'saw',
              label: 'Tell him you saw it.',
              then: [H('You saw it. Somebody saw it. Right. Good. I’m not mad.', 'happy')],
            },
            {
              id: 'ridge',
              label: 'Point to where it fell.',
              then: [N('You point at the dark ridge. Hiccup lines up your arm with his eye and learns the spot like a map.')],
            },
            {
              id: 'sure',
              label: 'Ask if he’s sure.',
              then: [H('No. Yes. It fell. Things don’t fall like that unless something has gone wrong with them.', 'think')],
            },
          ],
        },
        done: {
          id: 'a19-02-shot-done',
          lines: [N('Behind you, a wooden stake snaps. Something large has landed on the cliff, and it is not black, and it is very awake.')],
        },
      },
      {
        id: 'a19-02-s2',
        goal: 'Get Hiccup down to the village in one piece.',
        hint: 'Run for the torch posts in the square and keep behind them.',
        check: 'escort:a19-hiccup:square',
        scene: {
          id: 'a19-02-chase',
          lines: [
            N('A Monstrous Nightmare pulls itself over the lip of the cliff, red and long, and on fire along its whole back.'),
            H('Ah. Not that one. Run. Running would be good.', 'shock'),
            N('You run, all three of you, down the slope, with the heat of it on your neck.'),
            N('Your Nubbin runs faster than you knew it could, straight through Hiccup’s legs, twice.'),
            H('Left! No, other left! Behind the torch post!'),
            N('You throw yourselves behind a torch post. The fire splits round it, and the wood begins to smoke.'),
            N('Then a man the size of a door steps out in front of you, and meets the Nightmare with nothing but his shoulder and a roar.'),
            N('The Nightmare thinks about it, and goes. Above it, the last of the raid goes too, with half the village’s sheep.'),
          ],
        },
        done: {
          id: 'a19-02-chase-done',
          lines: [ST('Hiccup.'), H('Hi, Dad.', 'sad')],
        },
      },
      {
        id: 'a19-02-s3',
        goal: 'Stand by Hiccup while he tells his father.',
        hint: 'Stay with Hiccup in the square while Stoick listens, or doesn’t.',
        check: 'talk:a19-stoick:square',
        scene: {
          id: 'a19-02-nobody',
          lines: [
            N('Stoick the Vast is the chief of Berk. He is very large, very tired, and covered in soot.'),
            H('I hit a Night Fury. Up on the cliff. It came down past the ridge, you could send someone to…'),
            ST('Stop. Every time you step outside, something gets broken. Tonight it was a torch post and the fish store.', 'angry'),
            ST('I’ve a village to feed, and the winter coming, and the dragons have had the sheep.'),
            H('I know what I saw.'),
            N('Behind Stoick, a few Vikings are laughing: not loudly, just enough.'),
            ST('Gobber, see him home. And who’s this?', 'think'),
            GB('The new help, Stoick. Good arms. The small one’s some sort of hatchling. Southern. Harmless.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Say you saw it too.',
              then: [
                ST('Then you were both looking at the dark. It’s easy to see things in the dark.'),
                N('He isn’t unkind about it. He just has no room for it tonight.'),
              ],
            },
            {
              id: 'stand',
              label: 'Say nothing. Stand next to Hiccup.',
              then: [N('You say nothing. You stand next to Hiccup, close enough that he can tell.'), H('Thanks.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a19-02-complete',
      lines: [
        N('Gobber walks you both back to the forge, and leaves you at the door with a look that means stay put this time.'),
        H('He thinks I’m a joke. They all do. I’ll find it tomorrow. I’ll find it, and I’ll…', 'sad'),
        N('He doesn’t finish. He goes up to his corner and draws by candlelight for a long time instead.'),
        N('From the loft you can hear the charcoal scratching. It sounds like someone trying to remember exactly what he saw.'),
      ],
    },
    rewards: [],
    sets: { 'a19-02': true },
    notes:
      'The Night Fury is never seen clearly in this quest: a blue-white flash, a black shape against the stars. The ' +
      'Nightmare chase is short; nobody is touched by the fire. Stoick sees the Nightmare off with a shove and a roar, ' +
      'not a weapon.',
  },

  // ---------------------------------------------------------------- A19-3
  {
    id: 'a19-03',
    code: 'A19-3',
    title: 'The Fleet Sails',
    source: `${SRC}: Stoick sails for the nest`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-2') },
    requires: ['A19-2'],
    speakers: [HICCUP, STOICK, GOBBER],
    steps: [
      {
        id: 'a19-03-s1',
        goal: 'Go up to the Great Hall and hear what the chief has decided.',
        hint: 'The Great Hall is at the top of the village; stand near the back.',
        check: 'visit:a19-hall:council',
        scene: {
          id: 'a19-03-hall',
          lines: [
            N('In the morning the Great Hall smells of smoke and wet wool. Stoick stands at the head of the long table with a map.'),
            ST('The nest. Find it, and the raids stop. I’m taking the ships out one more time, before the ice.'),
            N('Nobody cheers. The last time the ships went out, fewer came back.'),
            ST('I want every ship. Gobber stays. Somebody has to train the young ones.'),
            GB('And Hiccup?'),
            N('Stoick looks down the table at his son, who is trying to be very small behind a jug.'),
            ST('Hiccup trains with the rest. It’s time.', 'think'),
            H('Dad, I really don’t think that…'),
            ST('You’ll have an axe. You’ll have Gobber. You’ll learn. That’s the end of it.'),
          ],
        },
        done: {
          id: 'a19-03-hall-done',
          lines: [
            GB('Dragon training, then. Morning, in the arena. Bring the lad. Bring the hatchling, too. It can learn what not to be.'),
          ],
        },
      },
      {
        id: 'a19-03-s2',
        goal: 'Help load the fleet before it sails.',
        hint: 'Carry stores from the fish sheds down to the ships on the jetty.',
        check: 'carry:a19-stores:docks',
        scene: {
          id: 'a19-03-docks',
          lines: [
            N('All day you carry: barrels of salt fish, coils of rope, shields stacked like plates.'),
            N('Your Nubbin carries one oar, end first, with tremendous seriousness. It takes it most of the afternoon.'),
            N('Hiccup comes down to the jetty at the last minute. His father is checking a rope that doesn’t need checking.'),
            ST('Gobber will teach you. Listen to him.'),
            H('I will.'),
            ST('Good.'),
            N('That seems to be everything. Then Stoick puts one great hand on Hiccup’s head, quickly, as if it might be seen, and goes aboard.'),
            N('The ships go out on the grey tide. Hiccup watches until he can’t tell which sail is which.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Wave the ships off.',
              then: [N('You wave. Your Nubbin waves its oar, which nearly takes Hiccup’s ear off.')],
            },
            {
              id: 'stand',
              label: 'Stand with Hiccup until the sails are gone.',
              then: [N('You stand with him until there is nothing left to watch but grey water.')],
            },
          ],
        },
        done: {
          id: 'a19-03-docks-done',
          lines: [H('He used to do that when I was little. The hand. I’d forgotten.', 'soft')],
        },
      },
      {
        id: 'a19-03-s3',
        goal: 'Look at what Hiccup has been drawing.',
        hint: 'His notebook is open on the forge bench while he fetches charcoal.',
        check: 'inspect:a19-notebook:forge',
        scene: {
          id: 'a19-03-notebook',
          lines: [
            N('That night at the forge, Hiccup leaves his notebook open on the bench while he fetches more charcoal.'),
            N('Every page is a dragon. Wings, teeth, fire, and next to each one, in small neat letters, how to bring it down.'),
            N('Gronckle: hit it under the jaw; Nadder: stay out of its blind spot; Nightmare: don’t.'),
            N('The last page has nothing drawn on it at all. Just two words at the top: Night Fury.'),
            H('Nobody’s ever seen one. So nobody can draw one. So nobody knows how to bring one down.'),
            H('Which means, if somebody did…', 'think'),
          ],
          choices: [
            {
              id: 'blank',
              label: 'Ask why the page is still empty.',
              then: [
                H('Because I didn’t see it properly. Just the shape. I want to get it right.'),
                N('He says it like an artist, not a hunter. He doesn’t notice that.'),
              ],
            },
            {
              id: 'catch',
              label: 'Ask what he’ll do if he finds it.',
              then: [
                H('Finish it, obviously. Bring it home. Be somebody.'),
                N('He says it fast, the way you say a thing you have practised in the dark.'),
              ],
            },
            {
              id: 'good',
              label: 'Say his drawings are good.',
              then: [
                H('They’re for killing things. They’re not supposed to be good.', 'think'),
                N('But he looks at the Gronckle for a moment, as if he might fix the eye.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a19-03-complete',
      lines: [
        H('The ridge. Where it fell. I’m going out there tomorrow, before training.'),
        H('Are you coming? You don’t have to. It’s probably dead. Or very angry.'),
        N('Your Nubbin is already at the door. It doesn’t know where you are going, but it likes going.'),
      ],
    },
    rewards: [],
    sets: { 'a19-03': true },
    notes:
      'Hiccup’s notebook is our own design (a soft-backed sketchbook, charcoal). The written notes on its pages are ' +
      'shown as the narrator reads them; no page from the film’s Book of Dragons is copied.',
  },

  // ---------------------------------------------------------------- A19-4
  {
    id: 'a19-04',
    code: 'A19-4',
    title: 'The Bound Dragon',
    source: `${SRC}: Hiccup finds the Night Fury`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-3') },
    requires: ['A19-3'],
    speakers: [HICCUP],
    steps: [
      {
        id: 'a19-04-s1',
        goal: 'Search the woods behind the ridge for whatever fell.',
        hint: 'Follow Hiccup’s map; look for broken trees.',
        check: 'explore:a19-woods:furrow',
        scene: {
          id: 'a19-04-woods',
          lines: [
            N('The woods behind the ridge are dripping and grey. Hiccup has a map with crosses on, and every cross is crossed out.'),
            H('Nothing. Nothing. Nothing. Some people lose a knife, or a shoe. I lose a whole dragon.', 'sad'),
            N('He shoves a branch out of the way and it swings back and hits him. Your Nubbin ducks it neatly.'),
            N('Then you all stop. Ahead, a pine is snapped clean in half, and beyond it the earth is torn up in a long dark furrow.'),
            H('That’s… that’s it. That’s where it came down.', 'shock'),
            N('The furrow runs over the crest of a little rise. Something is breathing on the other side of it.'),
          ],
        },
      },
      {
        id: 'a19-04-s2',
        goal: 'Stay with Hiccup while he faces what he brought down.',
        hint: 'Keep back at the top of the rise and watch.',
        check: 'watch:a19-hiccup:ropes',
        scene: {
          id: 'a19-04-bound',
          lines: [
            N('At the bottom of the rise lies a dragon, black as wet slate, tangled in Hiccup’s ropes from nose to tail.'),
            N('It is long and lean, the size of a big horse, and it is not moving.'),
            H('I did it. I actually… I brought down a Night Fury.', 'shock'),
            N('He takes the knife out of his belt. He holds it up in front of him with both hands.'),
            H('Right. I’m a Viking. This is what Vikings do. This is the whole point of me.'),
            N('The dragon opens one eye. It is green and round, and it looks at him, and then it closes, as if it is too tired to watch.'),
            N('Hiccup stands there a long time. The knife goes up a little, and down a little, and nowhere at all.'),
            H('I can’t. I did this. I did this to you.', 'sad'),
            N('He cuts the ropes instead. All of them, one after another, fast, before he can change his mind.'),
            N('The dragon is up in a black rush. It pins him flat against a rock with one foot, and roars right into his face.'),
            N('Then it is gone, in a crooked, lurching flight, crashing away through the trees.'),
            N('Your Nubbin has bolted behind a stump. It is shaking all over, and its ball has gone dark and small.'),
          ],
          choices: [
            {
              id: 'ran',
              label: 'Scoop your Nubbin up and run.',
              set: { 'a19-first': 'ran' },
              then: [
                N('You scoop it up and run. It is so frightened that its claws go through your sleeve.'),
                N('At the edge of the trees you stop, out of breath. You are holding it too tight, and it is holding you too tight back.'),
              ],
            },
            {
              id: 'crouch',
              label: 'Crouch where you are, and let it come to you.',
              set: { 'a19-first': 'crouch' },
              then: [
                N('You crouch down in the wet bracken, and you don’t reach for it. You put one hand flat on the ground, and wait.'),
                N('It takes a long time. Then a small shaking shape comes out from behind the stump and pushes hard against your knee.'),
              ],
            },
          ],
        },
        done: {
          id: 'a19-04-bound-done',
          lines: [
            N('Hiccup sits up. He looks at the knife in his hand as if somebody else had been holding it.'),
            H('I couldn’t. Why couldn’t I?', 'sad'),
          ],
        },
      },
      {
        id: 'a19-04-s3',
        goal: 'Walk back to the village with Hiccup.',
        hint: 'Take the long way round, through the woods, to the arena.',
        check: 'walk:a19-hiccup:village',
        scene: {
          id: 'a19-04-walk',
          lines: [
            N('You walk back to the village together, the long way round, without a lot to say.'),
            H('Don’t tell Gobber. Or anyone. They’ll want to know why I didn’t, and I don’t…'),
            N('He stops in the path. Your Nubbin stops too, and looks up at him.'),
            H('I don’t know why I didn’t.'),
            N('Down in the village, the arena horn is blowing for the first day of training.'),
            H('Oh, good. Brilliant. My favourite. Let’s go and get set on fire.', 'sad'),
          ],
          choices: [
            {
              id: 'keep',
              label: 'Promise you won’t tell.',
              then: [
                H('Thanks. Really.'),
                N('It is the first secret anyone on Berk has trusted you with. You carry it carefully all day.'),
              ],
            },
            {
              id: 'why',
              label: 'Ask him why he didn’t.',
              then: [
                H('I don’t know. I’ll tell you when I know. Is that all right?', 'think'),
                N('You say it is. It turns out to be a promise, too.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a19-04-complete',
      lines: [
        N('Hiccup goes ahead to the arena with his shoulders up round his ears.'),
        N('You follow, slower. Your Nubbin walks close beside you, and every few steps it checks that you are still there.'),
        N('Far behind you in the woods, something crashes down through the branches, and goes quiet.'),
      ],
    },
    rewards: [],
    sets: { 'a19-04': true },
    notes:
      'THE SIGNATURE CHOICE (a19-04-bound): a19-first = ran | crouch. It pays off in A19-8 (step 3), A19-11 (step 3) ' +
      'and A19-18 (step 2 done and the complete scene). Neither is wrong: ran is the frightened, loving thing, and the ' +
      'page lets it be slow to mend. The knife is never brought down; the cut ropes are the only thing it touches. ' +
      'Toothless is shown clearly for the first time here: our own design, long and lean, green eyes, one tail fin torn ' +
      '(the torn fin is first noticed in A19-6).',
  },

  // ---------------------------------------------------------------- A19-5
  {
    id: 'a19-05',
    code: 'A19-5',
    title: 'Dragon Training',
    source: `${SRC}: the first day in the arena`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-4') },
    requires: ['A19-4'],
    speakers: [HICCUP, GOBBER, ASTRID, FISHLEGS, SNOTLOUT, RUFFNUT, TUFFNUT],
    steps: [
      {
        id: 'a19-05-s1',
        goal: 'Report to the arena for dragon training.',
        hint: 'The arena is the stone pit with the chain roof; go in by the big gate.',
        check: 'visit:a19-arena:gate',
        scene: {
          id: 'a19-05-arena',
          lines: [
            N('The arena is a stone pit with a roof of iron chains, and doors round the edge with things breathing behind them.'),
            GB('Right! Dragon training! Lesson one: everything in here wants to eat you. Lesson two: let it try somebody else.'),
            N('Five young Vikings stand in the middle. A tall girl with a braid and an axe is already in her stance.'),
            A('Astrid. Stay out of my way.'),
            FL('Fishlegs. Hello! Is that a hatchling? What class is it? It isn’t like any of the classes. Does it breathe anything?', 'happy'),
            SN('Snotlout. Remember the name. You’ll be telling people you met me.'),
            RF('I’m Ruffnut. He’s Tuffnut.'),
            TF('I’m Tuffnut. She’s the other one.'),
            N('Hiccup slips in at the back, late, in a helmet too big for him.'),
            SN('Hiccup’s doing training? Then I’m safe. They always go for the slowest one first.'),
            GB('Hiccup trains. The Keeper helps. And the hatchling stands by the wall and looks fierce.'),
          ],
        },
        done: {
          id: 'a19-05-arena-done',
          lines: [N('Your Nubbin goes to the wall and does its fiercest face. A twin pats it on the head.')],
        },
      },
      {
        id: 'a19-05-s2',
        goal: 'Hand out the shields before the Gronckle gets loose.',
        hint: 'Run the shields round to each trainee; there are fewer shields than people.',
        check: 'deliver:a19-shields:arena',
        scene: {
          id: 'a19-05-shields',
          lines: [
            GB('Behind that door is a Gronckle. Before I open it, every one of you wants a shield.'),
            GB('Keeper, hand them out. Quick. I’m opening it in… now, really.'),
            N('The door bangs open. Something round and brown and the size of a cart hurtles out, chewing a rock.'),
            FL('Gronckle! Heavy, slow to turn, eats stone, spits it back hot! Its wings are too small and nobody knows how it flies!'),
            N('You run from Viking to Viking with shields under both arms. Astrid takes hers without looking; Snotlout tries to take two.'),
            RF('That one’s mine.'),
            TF('I touched it first.'),
            RF('You touched it with your face.'),
            N('The twins tug one shield between them until the Gronckle settles it with a bang, and they both sit down.'),
            GB('Ruffnut, Tuffnut, you’re out!'),
            N('There is one shield left in your arms, and two people without one.'),
          ],
          choices: [
            {
              id: 'hiccup',
              label: 'Give it to Hiccup.',
              then: [
                N('Hiccup takes it. He holds it like a tray and nearly drops it, but he has it.'),
                H('Thanks. If I die, it was a good shield.'),
              ],
            },
            {
              id: 'fishlegs',
              label: 'Give it to Fishlegs.',
              then: [FL('Oh, thank you! Hiccup, you can stand behind me. I’m very wide.', 'happy')],
            },
            {
              id: 'nubbin',
              label: 'Prop it by the wall, for your Nubbin.',
              then: [
                N('Your Nubbin crouches behind the shield and peeps over the rim. It is the only one in the arena with a proper plan.'),
                GB('Ha! The hatchling has more sense than the lot of you.'),
              ],
            },
          ],
        },
      },
      {
        id: 'a19-05-s3',
        goal: 'Watch the round play out, and stay ready to help.',
        hint: 'Keep by the wall near the gate, where Gobber can reach.',
        check: 'watch:a19-gronckle:arena',
        scene: {
          id: 'a19-05-gronckle',
          lines: [
            N('One by one the Gronckle knocks them out of the game: Fishlegs, reciting, and Snotlout, showing off to Astrid.'),
            N('Then it is only Astrid and Hiccup. Astrid is very good, and Hiccup is everywhere at once, in the wrong way.'),
            A('Get out of the way!', 'angry'),
            H('I’m trying! It keeps being where I go!'),
            N('His shield goes rolling across the sand. The Gronckle backs him into the wall and opens its mouth.'),
            N('Gobber gets his hook into its jaw just in time. The shot hits the wall a hand’s width over Hiccup’s head.'),
            GB('Remember that, all of you. Every dragon you meet in here wants you dead. No exceptions.'),
            N('Hiccup touches the scorch mark over his head. He is thinking of a dragon that had him pinned, and didn’t.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-05-complete',
      lines: [
        A('You could have got us killed. Some of us actually want to be good at this.', 'angry'),
        H('Noted. Thank you. Very useful.'),
        N('When Gobber lets them go, Hiccup doesn’t go home. He goes up into the woods, and doesn’t look back to see if you are coming.'),
        N('Your Nubbin looks at you. You both go.'),
      ],
    },
    rewards: [],
    sets: { 'a19-05': true },
    notes:
      'Comic scene. The Gronckle’s shots are hot rocks that thud and smoke; nobody is hit. The twins’ bickering and ' +
      'Fishlegs’s facts are original (no shot limits or ratings from the film). Gobber’s warning is our own wording; ' +
      'the film’s line is deliberately not used.',
  },

  // ---------------------------------------------------------------- A19-6
  {
    id: 'a19-06',
    code: 'A19-6',
    title: 'The Cove',
    source: `${SRC}: the trapped dragon`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-5') },
    requires: ['A19-5'],
    speakers: [HICCUP],
    steps: [
      {
        id: 'a19-06-s1',
        goal: 'Follow Hiccup along the dragon’s trail.',
        hint: 'Follow the broken branches past the furrow to a crack in the rocks.',
        check: 'walk:a19-woods:cove',
        scene: {
          id: 'a19-06-trail',
          lines: [
            N('Hiccup goes back to the furrow, and past it, following a trail of broken branches and scratched bark.'),
            H('It went this way. It isn’t flying. It’s walking. Why is it walking?', 'think'),
            N('The trail ends at a crack between two rocks. Hiccup squeezes through, and so do you.'),
            N('Your Nubbin walks through without touching either side, and looks back at you both as if you were making a fuss.'),
            N('Beyond is a cove: a deep round hollow in the rock, with a lake in the bottom and steep walls all round.'),
            H('Nothing. Of course. Of course it’s nothing.'),
            N('Something black shoots past the end of the lake, right below you, so fast your eyes can’t follow it.'),
          ],
        },
      },
      {
        id: 'a19-06-s2',
        goal: 'Sit at the edge of the cove and watch, without crowding it.',
        hint: 'Find a place further back than Hiccup and keep still.',
        check: 'sit:a19-cove:edge',
        scene: {
          id: 'a19-06-cove',
          lines: [
            N('The dragon is trying to fly out. It runs, beats its wings, and climbs the air for a moment.'),
            N('Then it tips sideways and comes down hard on the stones. It tries again, and again, and comes down every time.'),
            H('Its tail. Look at its tail.'),
            N('There are two fins at the end of its tail, like a fish’s. One is whole; where the other should be, there is a torn stub.'),
            H('The ropes. That was me. It can’t steer.', 'sad'),
            N('Hiccup sits down on a flat rock at the edge, gets out his notebook, and starts to draw it. His hand is quick and very careful.'),
            N('You sit further back, where the dragon won’t feel crowded. Your Nubbin settles on your foot.'),
          ],
          choices: [
            {
              id: 'dragon',
              label: 'Watch the dragon.',
              then: [N('It gives up on the sky and tries the lake instead, snapping at fish. It misses every one.')],
            },
            {
              id: 'hiccup',
              label: 'Watch Hiccup.',
              then: [N('He rubs out one line and draws it again, slower. He is getting the eye exactly right.')],
            },
            {
              id: 'nubbin',
              label: 'Watch your Nubbin.',
              then: [N('Your Nubbin watches the dragon from behind your ankle, one eye at a time.')],
            },
          ],
        },
        done: {
          id: 'a19-06-cove-done',
          lines: [
            N('The dragon looks up, straight at the rock. Hiccup drops his charcoal.'),
            N('It rolls over the edge and down into the cove. Nobody moves to get it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-06-complete',
      lines: [
        N('It is nearly dark when you come out of the cove. Hiccup has drawn the dragon nine times.'),
        H('Here. Have this one. I got the eyes wrong. They’re not angry eyes, and I keep drawing them angry.', 'think'),
        N('He tears out a page and gives it to you: a black dragon in charcoal, half a tail fin, and eyes that aren’t angry at all.'),
      ],
    },
    rewards: [
      {
        id: 'a19-sketch',
        kind: 'decor',
        label: 'A page from Hiccup’s sketchbook',
        description: 'Toothless in charcoal, with half a tail fin and the eyes Hiccup says he got wrong. Hangs on a cottage wall.',
      },
    ],
    sets: { 'a19-06': true },
    notes:
      'The torn fin is the hinge of the whole page: show it clearly here (one whole fin, one stub). Hiccup sits on the ' +
      'rock at the cove’s edge; you sit further back, as the outline asks. The sketch reward is our own charcoal drawing ' +
      'of our Toothless design.',
  },

  // ---------------------------------------------------------------- A19-7
  {
    id: 'a19-07',
    code: 'A19-7',
    title: 'The Knife',
    source: `${SRC}: the fish, the knife and the name`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-6') },
    requires: ['A19-6'],
    speakers: [HICCUP, GOBBER],
    steps: [
      {
        id: 'a19-07-s1',
        goal: 'Carry a basket of fish to the cove.',
        hint: 'The basket is by the forge door; it’s heavy, and it leaks.',
        check: 'carry:a19-fish:cove',
        scene: {
          id: 'a19-07-basket',
          lines: [
            N('Before dawn, Hiccup is at the forge filling a basket with fish: cod, salmon, a smoked eel, and something nobody can name.'),
            H('It can’t catch anything down there. It must be starving. So: breakfast.'),
            GB('Where are you going with half my fish?', 'think'),
            H('Training! Extra training. Studying dragons. Their… eating.'),
            GB('Hm. Well. Bring the basket back.'),
            N('The basket is heavy and it leaks. You carry it between you up through the wet woods, and your Nubbin follows the drips.'),
            N('At the cove, Hiccup takes a breath, and climbs down into it.'),
          ],
        },
      },
      {
        id: 'a19-07-s2',
        goal: 'Wait at the cove while the dragon makes up its mind.',
        hint: 'Stay low by the rocks, and don’t move towards it.',
        check: 'wait:a19-dragon:cove',
        scene: {
          id: 'a19-07-knife',
          lines: [
            N('Hiccup tips the basket out onto the stones. The smoked eel slides out on top.'),
            N('The dragon comes out of the shadows low and fast, sees the eel, and jerks back hissing, as if it had been stung.'),
            H('No eel. Right. Noted.'),
            N('Hiccup throws the eel into the lake. The dragon comes a step closer, then stops.'),
            N('It is looking at his belt, at the knife hanging there.'),
            H('Oh. Oh, that.', 'think'),
            N('Slowly, with two fingers, he lifts the knife out of his belt. The dragon’s eyes follow it all the way.'),
            N('He throws it into the lake. It goes in with a small plop, and that is all.'),
            N('The dragon sits back on its haunches, and the flaps on its head come up like ears. Then it eats.'),
          ],
          choices: [
            {
              id: 'hands',
              label: 'Put your own hands where it can see them.',
              then: [N('You hold your hands open on your knees. The dragon glances at them, once, and goes back to its fish.')],
            },
            {
              id: 'away',
              label: 'Look away, at the water.',
              then: [N('You look at the water. You hear it eating and nothing else, and that is better than watching.')],
            },
            {
              id: 'nubbin',
              label: 'Keep a hand on your Nubbin.',
              then: [N('Your hand rests on your Nubbin’s back. It is warm, and calmer than you are.')],
            },
          ],
        },
      },
      {
        id: 'a19-07-s3',
        goal: 'See what the dragon does when the fish is gone.',
        hint: 'Keep still and keep watching Hiccup.',
        check: 'watch:a19-hiccup:fish',
        scene: {
          id: 'a19-07-name',
          lines: [
            N('When the fish is gone, the dragon looks at Hiccup, makes a noise in its throat, and coughs half a fish up onto his knee.'),
            H('Thank you. That’s… very generous.', 'shock'),
            N('The dragon waits, looking at him. It clearly expects him to eat it.'),
            H('You want me to… Right. Yes. Fine.', 'sad'),
            N('He eats it, raw, and gags, and swallows. Your Nubbin watches with enormous respect.'),
            N('The dragon pulls its lips back in a sort of smile. There isn’t a tooth in it, only pink gums.'),
            H('No teeth? Where did they go? There were teeth. In the woods. Lots of teeth.', 'think'),
            N('A row of white teeth slides out, and the smile becomes rather a lot of smile. Then they fold neatly away again.'),
            H('They fold away. Toothless. I’m going to call you Toothless.', 'happy'),
          ],
          choices: [
            {
              id: 'laugh',
              label: 'Laugh.',
              then: [N('You laugh, and Hiccup laughs, and Toothless looks from one of you to the other, deciding whether to be offended.')],
            },
            {
              id: 'straight',
              label: 'Keep a straight face.',
              then: [H('You’re very polite. He did just sick on me.')],
            },
            {
              id: 'suits',
              label: 'Say the name suits him.',
              then: [H('It does, doesn’t it? A Night Fury called Toothless. Nobody on Berk would believe it.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a19-07-complete',
      lines: [
        N('Toothless lets you all stay till noon. He doesn’t let anyone touch him, but he doesn’t leave.'),
        H('Gobber’s going to want his basket back.'),
        H('Keep it. I’ll tell him a dragon ate it. Which is almost true.'),
        N('You carry the empty basket home. It smells of cod for the rest of its life, and so, for a day, do you.'),
      ],
    },
    rewards: [
      {
        id: 'a19-fish-basket',
        kind: 'decor',
        label: 'Hiccup’s fish basket',
        description: 'A leaky wicker basket that smells faintly of cod forever. Goes by the pond.',
      },
    ],
    sets: { 'a19-07': true },
    notes:
      'S24 (The Adventure Book) draws Hazel’s margin note on this quest: “I’d have fed the dragon. Oh. He did. Good ' +
      'lad. H.” That note lives in S24 and the sim draws it; it is not scripted here. The naming beat is ours: the film’s ' +
      'own naming line is not used. Toothless’s teeth retract (as in the film); show the gums plainly, nothing gory.',
  },

  // ---------------------------------------------------------------- A19-8
  {
    id: 'a19-08',
    code: 'A19-8',
    title: 'The Hand',
    source: `${SRC}: the drawing in the sand and the hand`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-7') },
    requires: ['A19-7'],
    speakers: [HICCUP],
    steps: [
      {
        id: 'a19-08-s1',
        goal: 'Watch what Toothless does with the stick.',
        hint: 'Stay at the edge of the sand while Toothless draws.',
        check: 'watch:a19-toothless:lines',
        scene: {
          id: 'a19-08-lines',
          lines: [
            N('By the fourth day, Toothless lets Hiccup sit nearer. By the fifth, he is curious about the charcoal.'),
            N('Hiccup draws Toothless in the sand with a stick. Toothless watches, and then picks up a whole branch in his mouth.'),
            N('He drags it round and round the cove in great looping lines, all over the sand.'),
            H('Is that… is that me? It’s very… bold.', 'think'),
            N('When he has finished, Hiccup is standing in the middle of a huge scribble, with no way out that doesn’t cross a line.'),
            N('He steps on one, and Toothless growls. He lifts his foot, and Toothless purrs.'),
            N('So Hiccup steps carefully over each line, one at a time, all the way out, like a game whose rules nobody has explained.'),
          ],
          choices: [
            {
              id: 'step',
              label: 'Step through the lines after him.',
              then: [N('You go carefully over every line. Toothless follows you with his eyes and says nothing, which seems to be a yes.')],
            },
            {
              id: 'stay',
              label: 'Stay outside the lines.',
              then: [N('You stay where you are, outside the drawing. Toothless notices, and seems to think better of you for it.')],
            },
          ],
        },
      },
      {
        id: 'a19-08-s2',
        goal: 'Sit very still while Hiccup and Toothless meet.',
        hint: 'Don’t move. Whatever happens next isn’t yours to hurry.',
        check: 'sit:a19-cove:still',
        scene: {
          id: 'a19-08-hand',
          lines: [...HAND_REACH, ...HAND_TOUCH],
        },
      },
      {
        id: 'a19-08-s3',
        goal: 'Let Toothless decide about your Nubbin.',
        hint: 'Stay where you are and let Toothless come or not, as he likes.',
        check: 'wait:a19-nubbin:cove',
        scene: {
          id: 'a19-08-near',
          lines: [
            ...NEAR_START,
            N('Toothless pads across the sand. Your Nubbin doesn’t hide: in the woods you crouched, and it came back to you.'),
            N('Toothless lowers his great head until his nose is level with your Nubbin’s, and sniffs it, long and thorough.'),
            N('Your Nubbin sniffs back. Then, very carefully, it puts its forehead against his nose.'),
            H('Look at that. He likes it. He doesn’t like anybody.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-08-complete',
      lines: [
        H('Did you see that? He’s nothing like the book says. Nothing.'),
        N('Hiccup sits down hard on the sand, as if his legs have given up for a bit. He is grinning at nothing.'),
        H('The book’s got one rule for every dragon: run, or finish it. Every page. Every single one.'),
        H('Nobody ever sat still long enough to find out.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a19-08': true },
    notes:
      'READS sableFirst (step 2): slow → A19_VARIANTS a19-08-hand-slow; grab → a19-08-hand-grab; unset → a19-08-hand ' +
      '(no memory line). READS a19-first (step 3): crouch → a19-08-near; ran → a19-08-near-ran. The two reads are ' +
      'independent, so all four combinations work. Hiccup finds the hand himself in every version: the Keeper never ' +
      'teaches it to him. Toothless’s drawing in the sand is a huge scribble of loops (our design).',
  },

  // ---------------------------------------------------------------- A19-9
  {
    id: 'a19-09',
    code: 'A19-9',
    title: 'The Tail Fin',
    source: `${SRC}: the new fin and the first flights`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-8') },
    requires: ['A19-8'],
    speakers: [HICCUP, GOBBER],
    steps: [
      {
        id: 'a19-09-s1',
        goal: 'Hold the lamp while Hiccup works at the forge.',
        hint: 'Keep the lamp steady over the bench, and quiet.',
        check: 'carry:a19-lamp:forge',
        scene: {
          id: 'a19-09-forge',
          lines: [
            N('That night Gobber snores upstairs like a slow saw. Hiccup lights one lamp and gives it to you to hold.'),
            H('Hold it there. Lower. Bit left. Perfect. Don’t move. Don’t breathe on it.'),
            N('On the bench he lays out leather, rods and a sheet of his own drawings: a tail fin made to open and close like a fan.'),
            N('He cuts and stitches and rivets for hours. Then he starts on a second thing, a saddle, with straps for a long body.'),
            H('He can’t steer with one fin. So somebody has to steer the other one. That somebody is, unfortunately, me.'),
            N('A board creaks overhead. The snoring stops, and Gobber’s voice comes down the stairs, thick with sleep.'),
            GB('Who’s there? What are you making at this hour?', 'think'),
            N('Hiccup looks at you. You look at the saddle, which is about the size of a large dog.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: '“It’s a saddle. For my Nubbin.”',
              then: [
                GB('A saddle. For the hatchling. Ha! Mad. Southern folk are all mad.'),
                N('He goes back to bed. Hiccup mouths thank you, then looks at the saddle, and then, thoughtfully, at your Nubbin.'),
              ],
            },
            {
              id: 'shield',
              label: '“It’s a new kind of shield.”',
              then: [
                GB('Looks like a saddle.'),
                H('It’s a saddle-shaped shield. For sitting on. In battle.'),
                GB('Bed. Both of you.'),
              ],
            },
            {
              id: 'lamp',
              label: 'Blow out the lamp.',
              then: [
                N('You blow out the lamp. In the dark, Gobber grumbles about rats with hammers and goes back to bed.'),
                H('Rats with hammers. I’ll take it.'),
              ],
            },
          ],
        },
      },
      {
        id: 'a19-09-s2',
        goal: 'Watch the first flights, and be ready to fish them out.',
        hint: 'Stand at the edge of the lake in the cove.',
        check: 'watch:a19-flight:lake',
        scene: {
          id: 'a19-09-strap',
          lines: [
            N('At the cove, Toothless sniffs the new fin, then the saddle, then Hiccup, as if Hiccup is the strangest part.'),
            N('It takes all morning to strap it on. Toothless rolls over twice, and sits on the saddle once, on purpose.'),
            H('Right. When I pull this, the fin opens, and you can turn. I hope. In theory.'),
            N('Hiccup climbs on, and Toothless spreads his wings. You hold your breath, and your Nubbin holds its breath too.'),
            N('Toothless jumps, flaps once, and they rise, and turn, and fly in a perfect curve straight into the lake.'),
            N('They come up spitting. Then they try again, and go into the lake again, slightly to the left.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer anyway.',
              then: [H('Thank you! That was nearly flying!', 'happy')],
            },
            {
              id: 'wade',
              label: 'Wade in and help fish him out.',
              then: [N('You wade in to your knees and haul on the saddle strap. Toothless climbs out by himself and shakes himself all over you.')],
            },
            {
              id: 'hold',
              label: 'Keep your Nubbin out of the water.',
              then: [N('Your Nubbin very much wants to go in after them. You keep a gentle hand in front of it until it gives up.')],
            },
          ],
        },
        done: {
          id: 'a19-09-strap-done',
          lines: [H('He’s turning before I tell him. I need to know when he wants to turn, not just when I do.', 'think')],
        },
      },
      {
        id: 'a19-09-s3',
        goal: 'Help Hiccup make a pedal, so he can steer with his foot.',
        hint: 'Hammer the stirrup flat at the forge anvil.',
        check: 'craft:a19-pedal:forge',
        scene: {
          id: 'a19-09-pedal',
          lines: [
            N('Back at the forge, Hiccup draws a pedal: a stirrup on a rod, so his foot can open the fin while his hands hold on.'),
            H('Hammer that flat. No, flatter. Like the edge of a shovel.'),
            N('You hammer it flat. It takes three goes and a burnt thumb, and your Nubbin brings you a bucket of water without being asked.'),
            H('Now every position means something. Down one: left. Down two: hard left. I’ll write them on a card.'),
            N('He writes them on a scrap of leather and ties it to the saddle, where he can read it with his eyes streaming.'),
            N('At the cove they go up again. Toothless turns, and Hiccup turns with him, and this time they miss the lake.'),
            N('They go up past the rim, out over the trees and the sea, and you lose them in the light.'),
          ],
        },
        done: {
          id: 'a19-09-pedal-done',
          lines: [N('They come back an hour later, wet through and wind-burnt, wearing the same grin.')],
        },
      },
    ],
    complete: {
      id: 'a19-09-complete',
      lines: [
        H('We flew. Him and me. Neither of us can do it on our own. That’s the whole design.', 'happy'),
        N('Toothless shoves his head under Hiccup’s arm until Hiccup falls over. Then he lies on him.'),
        H('Help. Please. He is very heavy and very pleased with himself.'),
        N('You don’t help, and neither does your Nubbin. It is too good to interrupt.'),
      ],
    },
    rewards: [],
    sets: { 'a19-09': true },
    notes:
      'The fin and the pedal are drawn to our own design (a leather fan on rods; a stirrup on a rod). The saddle Gobber ' +
      'nearly catches here is the joke A19-18 pays off with the small saddle for your Nubbin, whichever answer you give. ' +
      'The lake crashes are slapstick: splash, spit, try again.',
  },

  // ---------------------------------------------------------------- A19-10
  {
    id: 'a19-10',
    code: 'A19-10',
    title: 'Top of the Class',
    source: `${SRC}: Hiccup’s tricks in the arena; the fleet comes home`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-9') },
    requires: ['A19-9'],
    speakers: [HICCUP, STOICK, GOBBER, ASTRID, FISHLEGS, SNOTLOUT],
    steps: [
      {
        id: 'a19-10-s1',
        goal: 'Watch Hiccup in the arena.',
        hint: 'Take your place by the gate with Gobber.',
        check: 'watch:a19-hiccup:arena',
        scene: {
          id: 'a19-10-grass',
          lines: [
            N('Next morning in the arena, the Gronckle comes at Hiccup like a cannonball.'),
            N('Hiccup doesn’t run. He opens his hand, and in it is a fistful of a pale grass that grows by the cove.'),
            N('The Gronckle stops dead, sniffs it, and rolls over on its back in the sand like a puppy.'),
            FL('What did you do? That’s not in the book! Nothing is in the book!', 'shock'),
            H('I… read ahead?'),
            N('Astrid’s axe is still up. She is not looking at the Gronckle; she is looking at Hiccup.'),
            SN('Lucky. That was lucky.'),
          ],
        },
        done: {
          id: 'a19-10-grass-done',
          lines: [GB('Well! Look at that! Hiccup! Who’d have thought it?', 'happy')],
        },
      },
      {
        id: 'a19-10-s2',
        goal: 'Keep Hiccup’s secret while the whole village starts to watch.',
        hint: 'Astrid is waiting behind the arena door. Talk to her.',
        check: 'watch:a19-nadder:arena',
        scene: {
          id: 'a19-10-eel',
          lines: [
            N('Day after day it goes the same way. Every dragon they let out, Hiccup puts down without hurting it at all.'),
            N('A Nadder rears up over Snotlout, all spikes. Hiccup holds up a smoked eel, and it shies away like a horse from a snake.'),
            N('A Gronckle corners Fishlegs. Hiccup scratches it under the chin, in one particular spot, and it drops flat and blissful.'),
            N('The village starts coming to watch, and cheering. They have never cheered for Hiccup before, and he doesn’t know where to look.'),
            A('Where does he go, every afternoon?', 'angry'),
            N('Astrid has caught you by the elbow behind the arena door. Her grip is strong, and she isn’t letting go.'),
          ],
          choices: [
            {
              id: 'lie',
              label: 'Tell her he goes fishing.',
              then: [
                A('Fishing. Right. He can’t lift a rod.', 'think'),
                N('She lets go. She doesn’t believe you, and she lets you see it.'),
              ],
            },
            {
              id: 'ask',
              label: 'Tell her to ask him herself.',
              then: [A('I did. He said he goes for walks. Nobody goes for walks on Berk.', 'angry')],
            },
            {
              id: 'shrug',
              label: 'Shrug.',
              then: [A('Fine. I’ll find out.'), N('It isn’t a threat, exactly. It is more of a schedule.')],
            },
          ],
        },
      },
      {
        id: 'a19-10-s3',
        goal: 'Go down to the jetty to meet the ships.',
        hint: 'The fleet is coming in on the evening tide.',
        check: 'visit:a19-docks:fleet',
        scene: {
          id: 'a19-10-fleet',
          lines: [
            N('The ships come home on a grey afternoon. Fewer than went out, and every one of them scorched.'),
            N('Stoick comes up the jetty last. He found no nest; you can see it in the way he walks.'),
            GB('Stoick! You missed it. Your boy. He’s the best in the arena. The best I’ve ever seen.', 'happy'),
            ST('Hiccup? My Hiccup?', 'shock'),
            N('Stoick looks at his son as if he has never seen him before. Then he laughs, a great bark of a laugh, and lifts him off his feet.'),
            ST('I knew it. I always knew it was in you somewhere.', 'happy'),
            N('Hiccup hangs in the air, smiling the way you smile when someone you love gives you the wrong present.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-10-complete',
      lines: [
        H('He’s proud of me. He’s actually proud of me.'),
        H('For being good at the thing I’m lying about.', 'sad'),
        N('Gobber hands you a round shield, faced with shed Nadder scales, blue and gold, overlapping like roof tiles.'),
        GB('For the help. Hang it on your door, wherever your door is. Tells folk there’s someone inside who can look after things.'),
      ],
    },
    rewards: [
      {
        id: 'a19-shield',
        kind: 'decor',
        label: 'Dragon-scale shield',
        description: 'A round shield faced with shed Nadder scales, blue and gold. Hangs over the cottage door.',
      },
    ],
    sets: { 'a19-10': true },
    notes:
      'Three tricks, all harmless to the dragons: the cove grass (our name for it; the film’s term is not used), the ' +
      'smoked eel, and the spot under a Gronckle’s chin. The shield’s scales are shed ones; Gobber says so if asked in ' +
      'any later barks. Astrid narrows her eyes at Hiccup in step 1 and corners you in step 2.',
  },

  // ---------------------------------------------------------------- A19-11
  {
    id: 'a19-11',
    code: 'A19-11',
    title: 'The Flight',
    source: `${SRC}: Astrid finds the cove`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-10') },
    requires: ['A19-10'],
    speakers: [HICCUP, ASTRID],
    steps: [
      {
        id: 'a19-11-s1',
        goal: 'Deal with Astrid at the cove.',
        hint: 'She is on the path down to the cove, and she has seen everything.',
        check: 'watch:a19-astrid:cove',
        scene: {
          id: 'a19-11-astrid',
          lines: [
            N('Astrid follows Hiccup to the cove. She is not quiet about it, and she has her axe.'),
            A('Who are you training with? If this is some sort of trick…', 'angry'),
            N('Then Toothless comes up out of the shadows behind Hiccup, and she sees him.'),
            A('Get down! Night Fury!', 'shock'),
            N('She swings the axe up, and Toothless crouches to spring. Hiccup throws himself between them with his arms out.'),
            H('No! Don’t. He’s my friend. Astrid, this is Toothless. Toothless, Astrid.'),
            N('Astrid looks at him, and at the dragon, and at you. Then she turns and runs for the village.'),
            H('Oh, that’s bad. That’s very bad.', 'shock'),
          ],
          choices: [
            {
              id: 'path',
              label: 'Get in her way.',
              then: [N('You step into the path. Astrid stops, because you are in the way, and that is all anyone needed.')],
            },
            {
              id: 'sit',
              label: 'Sit down on the path, where she has to pass.',
              then: [N('You sit down in the middle of the path, and Astrid nearly falls over you. It is hard to run past someone who has sat down.')],
            },
            {
              id: 'leave',
              label: 'Leave it to Hiccup.',
              then: [N('You stay where you are. It is his secret to keep or lose.')],
            },
          ],
        },
        done: {
          id: 'a19-11-astrid-done',
          lines: [
            N('Before she can go on, Toothless swoops low, picks her up by the belt, and sets her down in the top of a tall pine.'),
            A('Get me down from here!', 'angry'),
            H('Let me show you. Then you can tell everyone, if you still want to. Please.'),
          ],
        },
      },
      {
        id: 'a19-11-s2',
        goal: 'Watch Toothless take Astrid flying.',
        hint: 'Watch from the cove; the sky is theirs this time.',
        check: 'watch:a19-toothless:sky',
        scene: {
          id: 'a19-11-spin',
          lines: [
            N('Astrid climbs on behind Hiccup, stiff as a plank. Toothless looks at her over his shoulder, and you can see him decide.'),
            H('Toothless, be nice. Toothless? Bud?'),
            N('Toothless goes straight up like a firework, then straight down. Astrid’s yell reaches you a long moment later.'),
            N('He dips them in the sea and spins them. He rolls them over and over, like a dog with a stick.'),
            A('Fine! Sorry! I take it back, all of it! Make him stop!', 'shock'),
            N('Toothless stops. He spreads his wings wide and slows, and rises gently, up into the evening cloud.'),
            N('From down in the cove, you see them come out on top of the clouds, small and black against the gold.'),
          ],
        },
        done: {
          id: 'a19-11-spin-done',
          lines: [
            N('They stay up a long time. When they come down, Astrid’s hair is everywhere, and she isn’t angry any more.'),
            A('That was… all right. Fine. That was amazing.', 'soft'),
          ],
        },
      },
      {
        id: 'a19-11-s3',
        goal: 'Wait at the cove for the last of the light.',
        hint: 'Stay on the sand with your Nubbin; Toothless will decide.',
        check: 'wait:a19-cove:evening',
        scene: {
          id: 'a19-11-turn',
          lines: [
            ...TURN_START,
            N('He looks at your Nubbin. Toothless looks at it too, and lowers his shoulder to the sand.'),
            N('Your Nubbin looks up at you. You don’t lift it; you let it go, the way it came back to you in the woods.'),
            N('It climbs into Hiccup’s lap by itself. Hiccup puts an arm round it, and Toothless lifts off, slow and smooth.'),
            N('They go round the cove once, low over the water, in the very last of the sun. Your Nubbin’s ball is as bright as a lantern.'),
            N('When they land, it slides off and runs straight to you, to tell you all about it the only way it can, which is by sitting on you.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-11-complete',
      lines: [
        N('Dark comes up out of the sea. Hiccup, Astrid and Toothless stand together on the sand, out of breath.'),
        A('I haven’t decided whether to tell. Show me more tomorrow. Then I’ll decide.'),
        N('She punches Hiccup on the arm, quite hard. Then she looks at you and nods, which from Astrid is a speech.'),
      ],
    },
    rewards: [],
    sets: { 'a19-11': true },
    notes:
      'READS a19-first (step 3): crouch → a19-11-turn (Toothless lets your Nubbin ride in Hiccup’s lap); ran → ' +
      'A19_VARIANTS a19-11-turn-ran (Toothless watches it from the ground and won’t). The Keeper never rides in this ' +
      'quest. The spinning flight is comic, never dangerous: Astrid is strapped in, and the sea dips are shallow.',
  },

  // ---------------------------------------------------------------- A19-12
  {
    id: 'a19-12',
    code: 'A19-12',
    title: 'The Nest',
    source: `${SRC}: the nest and the great dragon`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-11') },
    requires: ['A19-11'],
    speakers: [HICCUP, ASTRID],
    steps: [
      {
        id: 'a19-12-s1',
        goal: 'Fly out with Hiccup, Astrid and Toothless.',
        hint: 'Hold on tight at the back of the saddle.',
        check: 'watch:a19-fog:sky',
        scene: {
          id: 'a19-12-fog',
          lines: [
            N('The next evening, Astrid is at the cove before any of you. She is pretending not to have been waiting.'),
            H('He can carry four, if two of them are small and nobody fidgets.', 'think'),
            N('Toothless gives you a long look that says he has not agreed to this. Then he lowers his shoulder anyway.'),
            N('You climb on behind Astrid, with your Nubbin buttoned inside your coat and only its head out.'),
            N('Up you go, over the sea and into cloud. The cloud turns to fog, thick and white and wet.'),
            N('Then Toothless’s ears go back. He banks hard, though Hiccup hasn’t touched the pedal, and he won’t turn back.'),
            H('Bud? What is it? Toothless, that’s not the way home!', 'shock'),
            N('Out of the fog on every side come dragons: Nadders, Gronckles, Zipplebacks, all flying the same way, all carrying something.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold your Nubbin tighter.',
              then: [N('You fold both arms over your coat. Your Nubbin pushes its head under your chin and stays there.')],
            },
            {
              id: 'eyes',
              label: 'Keep your eyes open.',
              then: [N('You keep your eyes open. Somebody should see this, and you are the one sitting at the back.')],
            },
            {
              id: 'belt',
              label: 'Hold on to Astrid’s belt.',
              then: [A('Good. Don’t let go. I’m not losing anyone off this thing.')],
            },
          ],
        },
      },
      {
        id: 'a19-12-s2',
        goal: 'See where the dragons are going.',
        hint: 'Keep low and quiet; Toothless is doing the flying.',
        check: 'watch:a19-pit:nest',
        scene: {
          id: 'a19-12-pit',
          lines: [
            N('The fog opens on a mountain in the sea, steaming at the top. The dragons pour in through a crack in its side, and so do you.'),
            N('Inside it is huge and hot and red. Hundreds of dragons cling to the walls, quiet as dragons in a dream.'),
            N('In the middle is a pit full of mist. One by one, the dragons fly over it and drop what they have carried.'),
            N('Fish, sheep, a whole yak: all of it falls into the mist and is gone.'),
            H('They’re not eating it. Why aren’t they eating any of it?', 'think'),
            N('Last comes a slow, tired Gronckle with only one small fish in its mouth. It drops it, and hovers.'),
            N('Something rises out of the pit, bigger than the Great Hall: a head like a cliff, with eyes like lamps.'),
            N('The mist closes over the Gronckle, and there is a sound you will not forget.'),
            N('When the mist clears, the place where it hovered is empty.'),
            A('They’re not raiding us for themselves. They’re feeding that.', 'shock'),
            H('Or it eats them instead.', 'sad'),
            N('The great eyes turn. They have seen Toothless, and Toothless is already moving: out, out, through the crack and into the fog.'),
          ],
        },
      },
      {
        id: 'a19-12-s3',
        goal: 'Fly home quietly with them.',
        hint: 'There is nothing to do but hold on and listen.',
        check: 'sit:a19-toothless:flight-home',
        scene: {
          id: 'a19-12-home',
          lines: [
            N('Nobody speaks for a long time. The fog thins, the stars come out, and Berk is a few lights on the black sea.'),
            A('That’s the nest. That’s what our fathers have been looking for, for as long as anyone remembers. We have to tell them.'),
            H('No. Not yet. If they know where it is, they’ll ask how I know. And then they’ll find him.', 'sad'),
            A('Hiccup, that thing…'),
            H('They’ll kill him, Astrid. Please. Give me time. I’ll work it out. I’ll think of something.'),
            N('Astrid looks at the back of his head for a long time. Toothless flies very gently, as if he were listening.'),
          ],
          choices: [
            {
              id: 'quiet',
              label: 'Say nothing. Let them have the quiet.',
              then: [N('You say nothing. The wind says it for everyone, all the way home.')],
            },
            {
              id: 'shoulder',
              label: 'Reach past Astrid and touch Hiccup’s shoulder.',
              then: [N('You put one hand on Hiccup’s shoulder. He doesn’t turn round, but he leans back into it, just a little.')],
            },
            {
              id: 'both',
              label: 'Say they’re both right.',
              then: [A('That’s the worst thing about it.', 'sad'), N('After that nobody says anything else, all the way home.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a19-12-complete',
      lines: [
        N('Toothless lands you in the cove under the stars, and you all climb down, stiff and cold.'),
        A('All right. We wait. But not for long, Hiccup. Not for long.'),
        H('Tomorrow’s the final exam. I’m supposed to kill a dragon in front of the whole village.', 'sad'),
        A('Then you’d better think of something fast.'),
      ],
    },
    rewards: [],
    sets: { 'a19-12': true },
    notes:
      'CARE: the Gronckle is lost in the mist, offscreen: show the mist close, play one low sound, then an empty ledge. ' +
      'No teeth, no swallowing on screen. The great dragon is shown only as a head rising from mist, with lamp-like eyes. ' +
      'The Keeper rides at the back with the Nubbin buttoned into their coat, so the A19-11 payoff (who rode in Hiccup’s ' +
      'lap) is untouched.',
  },

  // ---------------------------------------------------------------- A19-13
  {
    id: 'a19-13',
    code: 'A19-13',
    title: 'The Final Exam',
    source: `${SRC}: the Nightmare in the arena; Toothless taken`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-12') },
    requires: ['A19-12'],
    speakers: [HICCUP, STOICK, GOBBER],
    steps: [
      {
        id: 'a19-13-s1',
        goal: 'Take your place at the arena gate for the final exam.',
        hint: 'Stand with Gobber by the gate, where Hiccup will pass you.',
        check: 'visit:a19-arena:stands',
        scene: {
          id: 'a19-13-stands',
          lines: [
            N('The whole of Berk is crammed round the arena. Somebody is selling smoked fish on sticks.'),
            N('Stoick sits in the chief’s seat at the top, bigger than ever, proud enough to burst.'),
            ST('My son. My son kills his first dragon today. I never thought I’d see it.', 'happy'),
            GB('None of us did, Stoick.'),
            N('You stand at the gate with Gobber. Hiccup comes down the steps into the pit in a helmet that still doesn’t fit him.'),
            N('He looks at you as he passes. He has the face of someone who has thought of something, and wishes he hadn’t.'),
          ],
          choices: [
            {
              id: 'luck',
              label: 'Wish him luck.',
              then: [H('Thanks. I’ll need it. If anything goes wrong, look after… you know.')],
            },
            {
              id: 'dont',
              label: 'Tell him he doesn’t have to do this.',
              then: [H('I do, though. Just not the way they think.', 'soft')],
            },
            {
              id: 'nod',
              label: 'Just nod.',
              then: [N('You nod, and he nods back. For once, that is enough.')],
            },
          ],
        },
      },
      {
        id: 'a19-13-s2',
        goal: 'Watch the exam from the gate.',
        hint: 'Stay at the gate. This is Hiccup’s, not yours.',
        check: 'watch:a19-nightmare:arena',
        scene: {
          id: 'a19-13-hand',
          lines: [
            N('The gate goes up. A Monstrous Nightmare comes out of the dark, on fire from nose to tail, and climbs the chains.'),
            N('Hiccup stands very still. Then he lets his shield fall, and his knife, and takes off his helmet and drops that too.'),
            H('It’s all right. I’m not going to hurt you. Look. Nothing.'),
            N('He holds out his hand and turns his face away. The fire goes out along the Nightmare’s back, slowly, like a fire going to sleep.'),
            N('Up in the stands, nobody makes a sound. You can hear the sea.'),
            H('They don’t have to be like this. We don’t have to be like this. We could…'),
            ST('Enough! Get him out of there!', 'angry'),
            N('Stoick brings his hammer down on the iron bars. The clang goes all round the arena, and the Nightmare goes wild.'),
            N('It goes for Hiccup. Far off over the sea, you hear a high whistle, coming closer.'),
          ],
        },
      },
      {
        id: 'a19-13-s3',
        goal: 'Stay with Hiccup as the ships go out.',
        hint: 'Go down to the jetty with Hiccup.',
        check: 'watch:a19-fleet:docks',
        scene: {
          id: 'a19-13-chain',
          lines: [
            N('Toothless comes through the chain roof in a burst of blue fire and lands between Hiccup and the Nightmare.'),
            N('He drives it back into its pen. Then he turns to Hiccup, and the whole village pours down into the arena.'),
            H('Toothless, go! Go! Get out of here!', 'shock'),
            N('He doesn’t go; he stays by Hiccup. Ten Vikings bring him down with ropes, and then twenty, and then they have him.'),
            N('In the shouting afterwards, Hiccup tells his father too much: that Toothless can find the nest, and that he has been there.'),
            N('Stoick says one short thing to his son, very quietly, that no father should say. Then he turns his back on him.'),
            N('By the next tide the ships are going out again. On the lead ship, chained to the deck, there is a black dragon.'),
            N('Hiccup stands on the jetty with nothing in his hands. His father doesn’t look back.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-13-complete',
      lines: [
        GB('I’ve known Stoick forty years. He’ll be sorry. He just has to sail far enough out to see it.', 'sad'),
        N('Gobber goes with the ships; he has to. On his way past, he touches Hiccup’s shoulder with his hook, very gently.'),
        N('Then it is only you, and your Nubbin, and Hiccup, and an empty harbour.'),
      ],
    },
    rewards: [],
    sets: { 'a19-13': true },
    notes:
      'CARE: Stoick’s disowning is one narrated line (a19-13-chain#5), with no words given; keep it short and grave, ' +
      'and don’t linger. His apology comes in A19-16 and is just as plain. Toothless is roped and chained, never hurt on ' +
      'screen. The Nightmare goes back into its pen unharmed.',
  },

  // ---------------------------------------------------------------- A19-14
  {
    id: 'a19-14',
    code: 'A19-14',
    title: 'What Astrid Asked',
    source: `${SRC}: Astrid on the cliff`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-13') },
    requires: ['A19-13'],
    speakers: [HICCUP, ASTRID],
    steps: [
      {
        id: 'a19-14-s1',
        goal: 'Find Hiccup, and sit with him.',
        hint: 'He’s on the cliff over the harbour. You don’t have to say anything.',
        check: 'sit:a19-hiccup:cliff',
        scene: {
          id: 'a19-14-cliff',
          lines: [
            N('Hiccup sits on the cliff over the empty harbour, with his knees pulled up.'),
            N('You don’t ask him anything. You sit down next to him, a little way off, and wait.'),
            N('Your Nubbin sits down too, between you, facing the sea, like a small round paperweight.'),
            H('Everything was getting good. And then I…', 'sad'),
            N('He doesn’t finish, and you don’t need him to. The tide goes out a long way.'),
            H('He should have left me, in the arena. He came for me, and now they’ve got him.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay where you are.',
              then: [N('You stay. Some things don’t need anything said over them; they just need somebody not to leave.')],
            },
            {
              id: 'closer',
              label: 'Move a little closer.',
              then: [N('You move a little closer. He doesn’t look up, but he stops pulling his knees in so tight.')],
            },
            {
              id: 'fish',
              label: 'Give him the dried fish from your pocket.',
              then: [N('He looks at it, and laughs, once, wetly, and takes it.'), H('You’ve been learning off Toothless.')],
            },
          ],
        },
      },
      {
        id: 'a19-14-s2',
        goal: 'Listen while Astrid asks the question.',
        hint: 'Stay where you are when Astrid comes.',
        check: 'talk:a19-astrid:cliff',
        scene: {
          id: 'a19-14-astrid',
          lines: [
            N('Footsteps behind you. Astrid sits down on Hiccup’s other side, and doesn’t say anything for a while.'),
            A('In the woods. When you found him. You could have finished him. Why didn’t you?'),
            H('I don’t know. I couldn’t.'),
            A('That isn’t an answer. Why couldn’t you?'),
            N('He is quiet for so long that you think he isn’t going to say. Then he looks at his hands.'),
            H(LIFT_FRIGHTENED, 'soft'),
            N('He says it as if it has been sitting in his chest since the woods, waiting to be let out.'),
            A('So. He’s frightened, and he’s chained to a ship. What now?'),
          ],
        },
        done: {
          id: 'a19-14-astrid-done',
          lines: [
            N('Hiccup looks at the sea. Then he looks back at the village, at the arena, at the pens.'),
            H('The training dragons. They’re still in their pens.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-14-complete',
      lines: [
        H('I’m going to do something mad.'),
        A('Good. I was hoping you’d say that.'),
        H('There. Now you know why, too. In the woods I didn’t. I do now.', 'soft'),
        N('Astrid is already running for the village. Hiccup gets up and follows her, and you and your Nubbin follow him.'),
      ],
    },
    rewards: [],
    sets: { 'a19-14': true },
    childLines: {
      'a19-14-astrid#5': 'He was scared, just like me. I couldn’t hurt somebody who was as scared as I was.',
    },
    notes:
      'a19-14-astrid#5 is lifted line 2 (first sentence only; the film’s second sentence is not used). Hazel’s third ' +
      'rule is acted in step 1 and never quoted. Hiccup’s line to you in the complete scene answers A19-4’s walk home ' +
      '(whether or not you asked him why there).',
  },

  // ---------------------------------------------------------------- A19-15
  {
    id: 'a19-15',
    code: 'A19-15',
    title: 'Training Dragons',
    source: `${SRC}: the young riders`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-14') },
    requires: ['A19-14'],
    speakers: [HICCUP, ASTRID, FISHLEGS, SNOTLOUT, RUFFNUT, TUFFNUT],
    steps: [
      {
        id: 'a19-15-s1',
        goal: 'Meet the others at the arena pens.',
        hint: 'The arena is empty; go round to the pens at the back.',
        check: 'visit:a19-pens:arena',
        scene: {
          id: 'a19-15-pens',
          lines: [
            N('The arena is empty. The training dragons sit in their pens in the dark: the Nadder, the Gronckle, the Nightmare, the Zippleback.'),
            N('Astrid has brought the others. Fishlegs, Snotlout and the twins stand in a row, looking like people who have been told nothing.'),
            SN('If this is a trick to get us eaten, I want it known I’m too good-looking to eat.'),
            RF('Nobody eats you. You’re mostly elbows.'),
            TF('And hair.'),
            H('Nobody’s getting eaten. I want you to meet them. Properly. The way I met Toothless.'),
            FL('Meet them? We’ve spent all month trying to beat them!', 'shock'),
            H('I know. I was there. I was terrible at it.'),
          ],
        },
      },
      {
        id: 'a19-15-s2',
        goal: 'Help match each rider to a dragon.',
        hint: 'Watch which way each dragon looks, and who looks back.',
        check: 'choose:a19-match:pens',
        scene: {
          id: 'a19-15-hands',
          lines: [
            N('Hiccup opens the Nadder’s pen. It comes out with every spine up, like a hedge with opinions.'),
            H('Hand out. Slow. Look away. Don’t grab. Let it come to you. Let it choose.'),
            N('Astrid goes first, of course. She holds out her hand and turns her face away, and the Nadder puts its nose into her palm.'),
            H('Now everyone else. Keeper, help me. Who goes with who?'),
            N('You walk along the pens with Hiccup, watching each dragon and each Viking, and which way their eyes go.'),
            N('The Nightmare likes noise, so it gets Snotlout. The Zippleback has two heads and two tempers, so it gets the twins.'),
            N('That leaves the Gronckle, and Fishlegs, standing a long way from each other.'),
          ],
          choices: [
            {
              id: 'match',
              label: 'Bring Fishlegs to the Gronckle.',
              then: [
                N('Fishlegs holds out a shaking hand. The Gronckle sniffs it, then leans her whole round head against his chest.'),
                FL('She likes me! She actually likes me! I’ve read about you since I was four!', 'happy'),
              ],
            },
            {
              id: 'choose',
              label: 'Let the Gronckle choose.',
              then: [
                N('The Gronckle waddles straight past everyone and sits down on Fishlegs’s feet.'),
                FL('She picked me! Nobody ever picks me first!', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a19-15-hands-done',
          lines: [N('Fishlegs is crying, openly, with joy. Nobody says a word about it, not even Snotlout.')],
        },
      },
      {
        id: 'a19-15-s3',
        goal: 'Fly after the fleet with the young riders.',
        hint: 'Ride behind Fishlegs on the Gronckle and hold on.',
        check: 'escort:a19-riders:sea',
        scene: {
          id: 'a19-15-go',
          lines: [
            N('There are no saddles. They make do with rope, and blankets, and holding on.'),
            FL('Keeper, ride with me. She’s slow, but she doesn’t drop things. I checked.'),
            N('You climb on behind Fishlegs. Your Nubbin rides in a sack strapped to the Gronckle’s side, like luggage with a view.'),
            A('Which way did the ships go?'),
            H('North, to the nest. Toothless knows the way, so they’ll find it. That’s what I did.', 'sad'),
            N('Five dragons go up out of the arena one after another, into the grey morning, and turn north after the fleet.'),
          ],
        },
        done: {
          id: 'a19-15-go-done',
          lines: [N('The sea is very far down. The Gronckle hums as she flies, and Fishlegs hums back to her.')],
        },
      },
    ],
    complete: {
      id: 'a19-15-complete',
      lines: [
        SN('Best day of my life. I’m going to tell everyone I thought of it.', 'happy'),
        TF('I’m going to tell everyone I was on the left head.'),
        RF('You were on the right head.'),
        TF('That’s what I said.'),
        N('Hiccup rides at the front, behind Astrid on the Nadder. He doesn’t look back; he is looking north.'),
      ],
    },
    rewards: [],
    sets: { 'a19-15': true },
    notes:
      'The matching is a small puzzle (choose:a19-match:pens): the Nadder goes to Astrid, the Nightmare to Snotlout and ' +
      'the Zippleback to the twins, and the Gronckle to Fishlegs, by either choice. Every rider holds out a hand and ' +
      'looks away, as Hiccup did; nobody grabs. The Keeper rides behind Fishlegs, never at the front.',
  },

  // ---------------------------------------------------------------- A19-16
  {
    id: 'a19-16',
    code: 'A19-16',
    title: 'The Red Death',
    source: `${SRC}: the great dragon wakes; Stoick and Hiccup`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-15') },
    requires: ['A19-15'],
    speakers: [HICCUP, STOICK, GOBBER, FISHLEGS],
    steps: [
      {
        id: 'a19-16-s1',
        goal: 'Come in to the mountain with the riders.',
        hint: 'Hold on behind Fishlegs as the Gronckle comes down towards the shore.',
        check: 'watch:a19-mountain:shore',
        scene: {
          id: 'a19-16-mountain',
          lines: [
            N('The fleet has found the mountain. Stoick’s Vikings have run the ships up on the grey shore and are hammering at the rock.'),
            N('Toothless is chained on the deck of the lead ship. He has seen you coming long before anyone else.'),
            N('The rock face cracks wide. The Vikings cheer, and then stop cheering.'),
            N('What comes out is the thing from the pit, the size of a hill, with six eyes and a mouth like the mouth of a cave.'),
            GB('Thor’s teeth. That’s not a dragon. That’s a mountain with a temper.', 'shock'),
            N('Its fire goes along the line of ships like a hand along a table. Every one of them catches.'),
            ST('Off the ships! Everyone off! Get to the rocks!', 'angry'),
          ],
        },
      },
      {
        id: 'a19-16-s2',
        goal: 'Get everyone off the burning ships.',
        hint: 'Work along the ships from the shore end; the riders are keeping it busy.',
        check: 'escort:a19-vikings:shore',
        scene: {
          id: 'a19-16-draw',
          lines: [
            N('The young riders come in low out of the smoke. On the beach, the Vikings look up, and their mouths fall open.'),
            H('Fishlegs, what’s it got? Talk to me!'),
            FL('Big head, small eyes for its size, can’t see well to the sides! Also, it’s enormous! Sorry, I’m panicking!'),
            H('Then confuse it! Noise! Twins, gas and spark, on its left side!'),
            N('The riders swing round its head like gulls round a ship. It turns, and roars, and snaps at nothing.'),
            N('Fishlegs sets you down on the beach. Your job is the people still on the ships: one at a time, off the burning decks.'),
          ],
          choices: [
            {
              id: 'gobber',
              label: 'Help Gobber down first.',
              then: [GB('Mind the leg! It’s not the one I was born with, but it’s a good one, and I want it back.')],
            },
            {
              id: 'nubbin',
              label: 'Send your Nubbin to look for anyone hiding.',
              then: [
                N('Your Nubbin goes along the deck under the smoke, where nobody else can see, and finds a young Viking crouched behind a barrel.'),
                N('You get her off together. She holds your Nubbin all the way down the gangplank.'),
              ],
            },
            {
              id: 'stoick',
              label: 'Go to Stoick.',
              then: [ST('Not me! Them! Get them off first!', 'angry'), N('So you do. He is the last one off, as a chief should be.')],
            },
          ],
        },
        done: {
          id: 'a19-16-draw-done',
          lines: [N('When the last one is off, you look back. Hiccup has turned away from the great dragon, towards the lead ship.')],
        },
      },
      {
        id: 'a19-16-s3',
        goal: 'Watch from the water’s edge as Hiccup goes for Toothless.',
        hint: 'Stay at the edge of the water. Stoick is faster than you.',
        check: 'watch:a19-stoick:wreck',
        scene: {
          id: 'a19-16-chain',
          lines: [
            N('The lead ship is burning, and sinking at the stern. Toothless is still chained to its deck.'),
            N('Hiccup drops off the Nadder onto the deck and pulls at the chain with both hands. It doesn’t move.'),
            N('The deck tips. The ship slides back off the rocks into the sea, and takes Toothless and Hiccup with it.'),
            N('You run down to the water’s edge, but Stoick is already past you, in up to his chest, then under.'),
            N('A long time passes. Too long.'),
            N('Stoick comes up with Hiccup over one shoulder. A moment later Toothless bursts out of the sea, the chain snapped, and hauls himself onto the rocks.'),
            ST('Hiccup. I was wrong. I’m sorry, son. I’m so sorry.', 'sad'),
            H('Me too, Dad.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-16-complete',
      lines: [
        ST('You don’t have to go up there.'),
        H('Yes, I do. He’s my dragon, and it was my rope.'),
        ST('Then go. And come back.', 'soft'),
        N('Hiccup climbs into the saddle. Toothless looks round once at you, at the water’s edge, and then they go up into the smoke.'),
      ],
    },
    rewards: [],
    sets: { 'a19-16': true },
    notes:
      'CARE: the ships burn, but every person gets off; nobody is shown hurt. The apology (a19-16-chain#6) is plain ' +
      'and clear, and must not be cut or softened in any version. Gobber’s peg leg is a joke he makes himself, proudly; ' +
      'it sets up A19-18. The great dragon is “the thing from the pit” in all dialogue; the outline’s name, the Red ' +
      'Death, is the quest title only.',
  },

  // ---------------------------------------------------------------- A19-17
  {
    id: 'a19-17',
    code: 'A19-17',
    title: 'The Fall',
    source: `${SRC}: the dive`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-16') },
    requires: ['A19-16'],
    speakers: [STOICK, GOBBER, ASTRID],
    steps: [
      {
        id: 'a19-17-s1',
        goal: 'Watch from the beach as Hiccup leads it away.',
        hint: 'Stand on the beach with the others and look up.',
        check: 'watch:a19-sky:shore',
        scene: {
          id: 'a19-17-up',
          lines: [
            N('From the beach you watch Hiccup and Toothless climb, a black speck against the smoke, then against the cloud.'),
            N('The great dragon spreads wings nobody knew it had, and heaves itself off the ground.'),
            N('Slowly, dreadfully, it follows them up.'),
            GB('What’s he doing? What’s the boy doing?', 'shock'),
            A('He’s leading it away from us. He’s taking it up where it can’t see.'),
            N('Everyone on the beach is looking up, and nobody is breathing. Your Nubbin has both paws over its face, and one eye between them.'),
            N('Up there, the black speck and the great shadow go into the cloud.'),
          ],
        },
      },
      {
        id: 'a19-17-s2',
        goal: 'Wait for the smoke to clear.',
        hint: 'There’s nothing to do but wait. Do it however you can.',
        check: 'wait:a19-smoke:shore',
        scene: {
          id: 'a19-17-dive',
          lines: [
            N('For a long moment there is nothing but cloud. Then the whistle comes, very high and very fast, coming down.'),
            N('Toothless comes out of the cloud head first, falling like a stone thrown from a tower, with the great shape behind him.'),
            N('Down and down. At the last moment Toothless opens his wings and turns, and the great dragon can’t.'),
            N('From far along the beach you see it hit the ground, and the fire go up, and the smoke roll out over everything.'),
            N('Something black is in the fire: a tail fin, burning. Then the smoke closes, and you can’t see anything at all.'),
            ST('Hiccup!', 'shock'),
          ],
          choices: [
            {
              id: 'run',
              label: 'Run towards the smoke.',
              then: [
                N('You run. The heat stops you long before you get there, and Gobber’s hook catches your collar.'),
                GB('No. Wait. Wait for it to clear.'),
              ],
            },
            {
              id: 'wait',
              label: 'Hold your Nubbin and wait.',
              then: [N('You pick up your Nubbin and hold it, and wait. It is the hardest thing you have done on Berk.')],
            },
            {
              id: 'stoick',
              label: 'Go with Stoick.',
              then: [N('You go after Stoick into the thinning smoke, keeping his broad back in front of you, because he knows where he is going.')],
            },
          ],
        },
      },
      {
        id: 'a19-17-s3',
        goal: 'Find them.',
        hint: 'Go into the burnt place where the smoke is thinning.',
        check: 'find:a19-hiccup:shore',
        scene: {
          id: 'a19-17-shore',
          lines: [
            N('When the smoke thins, it is a burnt place of black rock, and in the middle of it, curled up tight, a black dragon.'),
            N('Toothless doesn’t move. His tail fin, the new one, is burned away to the rods.'),
            ST('Son? Hiccup…', 'sad'),
            N('Stoick kneels. Toothless opens one green eye, and then, slowly, opens his wings.'),
            N('Inside, wrapped in them as if in a cloak, is Hiccup. His eyes are shut, and his chest goes up, and down.'),
            ST('He’s alive. He’s alive!', 'shock'),
            N('Stoick puts his great hand on Toothless’s head, the way you would thank a person. He doesn’t say anything; he doesn’t need to.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-17-complete',
      lines: [
        N('They carry Hiccup to the one ship that still floats. Toothless won’t be parted from him, so they carry Toothless too.'),
        N('All the way home, the dragon lies with his chin on the edge of Hiccup’s blanket.'),
        N('Your Nubbin sits at the other end of the blanket, and keeps watch too.'),
      ],
    },
    rewards: [],
    sets: { 'a19-17': true },
    notes:
      'CARE: the great dragon’s end is a fall and a fire seen from far along the beach: a flash, a column of smoke, no ' +
      'close-up and no body. Hiccup is found asleep and breathing; nothing about his foot is shown or said until A19-18. ' +
      'Hiccup does not speak in this quest (he is in the sky, then unconscious), so he is not in its speakers.',
  },

  // ---------------------------------------------------------------- A19-18
  {
    id: 'a19-18',
    code: 'A19-18',
    title: 'Twelve Days North',
    source: `${SRC}: Hiccup wakes; dragons in Berk`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A19-17') },
    requires: ['A19-17'],
    speakers: [HICCUP, STOICK, GOBBER, ASTRID, FISHLEGS],
    steps: [
      {
        id: 'a19-18-s1',
        goal: 'Be there when Hiccup wakes up.',
        hint: 'Wait by the fire in Stoick’s house.',
        check: 'visit:a19-hiccup:house',
        scene: {
          id: 'a19-18-wake',
          lines: [
            N('Hiccup wakes in his own bed, in his father’s house, with a great black dragon sitting on top of him.'),
            H('Toothless? What are you… what are you doing in my house?', 'shock'),
            N('Toothless bounces off him, up into the rafters, down again, and up, as pleased as a dog at a door.'),
            N('You are sitting by the fire. Hiccup sees you, and smiles, and goes to get up.'),
            N('He stops, and looks down. Where his left foot was, there is a new one of iron and wood, neat and strong, fixed to his leg.'),
            H('Oh.', 'think'),
            N('He looks at it for a long time, and nobody hurries him. Toothless puts his chin down on the bed beside it.'),
            GB('My work, that. Well, mine and yours. I used your tail-fin drawings for the spring in it.'),
            H('It’s good. It’s really good, Gobber.', 'soft'),
          ],
          choices: [
            {
              id: 'how',
              label: 'Ask how it feels.',
              then: [
                H('Strange. Like the floor is a bit further away on one side. I’ll get used to it. He did.'),
                N('He nods at Toothless’s tail, where the burnt rods of the old fin still show.'),
              ],
            },
            {
              id: 'arm',
              label: 'Hold out your arm.',
              then: [
                N('You hold out your arm. He takes it, and stands, and finds his balance on his own.'),
                H('Thanks. I won’t always need it. But thanks.'),
              ],
            },
            {
              id: 'wait',
              label: 'Say nothing, and wait.',
              then: [
                N('You wait. He tries a step, and another, and then he is grinning.'),
                H('Well. Toothless and me. Matching now.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a19-18-wake-done',
          lines: [
            N('He walks to the door with Toothless pressing against his side: step and clunk, step and clunk.'),
            H('Come on. I want to see what’s outside.'),
          ],
        },
      },
      {
        id: 'a19-18-s2',
        goal: 'Walk out into the village with Hiccup.',
        hint: 'Go out through the door and down into the square.',
        check: 'walk:a19-village:square',
        scene: {
          id: 'a19-18-village',
          lines: [
            N('Hiccup opens the door. There are dragons everywhere.'),
            N('A Nadder on a roof. A Gronckle asleep in the square, with three children asleep on her.'),
            N('A Zippleback is steering a fishing boat into the harbour, badly, one head arguing with the other.'),
            N('Nobody is fighting. Somebody is building a long trough for fish, and somebody else a stable with a very tall door.'),
            ST('Well? It’s your doing. All of it. Do you like it?', 'happy'),
            A('He’s up! Everyone, he’s awake!', 'happy'),
            N('Astrid punches him on the arm, kisses him on the cheek, quickly, and then punches him again for good measure.'),
            FL('Hiccup! Hiccup, the Gronckle lets me brush her teeth now!', 'happy'),
            N('Hiccup looks round at all of it, with his father’s hand on his shoulder and his dragon at his side.'),
          ],
        },
        done: {
          id: 'a19-18-village-done',
          lines: [N('Toothless bounds from one end of the square to the other, greeting everyone. He greets your Nubbin twice.')],
        },
      },
      {
        id: 'a19-18-s3',
        goal: 'Watch Hiccup and Toothless fly with their new tail and new step.',
        hint: 'Stand in the square with everyone else and look up.',
        check: 'watch:a19-flight:village',
        scene: {
          id: 'a19-18-flight',
          lines: [
            N('Gobber has made Toothless a new tail fin, stiffer than the last, with a Nadder scale stitched to its tip for luck.'),
            H('New tail. New foot. Let’s see if they get on.'),
            N('Hiccup sets his new foot in the pedal. It fits the stirrup as if it was made for it, because it was.'),
            N('Toothless crouches, and springs, and they are up: over the square, over the roofs, over the cliffs and the sea.'),
            N('The whole village comes out to watch. Dragons go up after them, one after another, until the sky over Berk is full.'),
            N('Up there, Hiccup lets go with both hands and spreads his arms wide, and Toothless rolls once, slowly, just for him.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a19-18-complete',
      lines: [...C18_SADDLE, C18_SABLE, ...C18_FISH],
    },
    rewards: [
      {
        id: 'a19-saddle',
        kind: 'cosmetic',
        label: 'Tail-fin saddle',
        description: 'A tiny leather saddle with a tail-fin badge, made by Hiccup to fit your Nubbin. Your Nubbin can wear it in the Grove.',
      },
      {
        id: 'a19-bookmark',
        kind: 'item',
        label: 'Great Voyage bookmark',
        description:
          'Marks this page for the Great Voyage festival (any two of A2, A6, A9, A10, A12, A14 and A19 open it; the pond becomes sailable).',
      },
    ],
    sets: { 'a19-18': true, 'a19-done': true },
    notes:
      'CARE (a19-18-wake): Hiccup’s lost foot is shown plainly: a neat prosthetic of iron and wood below the knee, no ' +
      'blood, no wound, no bandage close-up. It is something he and Toothless now share (each has a made part), never a ' +
      'tragedy and never fixed. Work with an adviser who has a limb difference on this scene before ship. The step-and-' +
      'clunk walk is affectionate, not comic. READS a19-first: step 2 done → a19-18-village-done (crouch) or ' +
      'A19_VARIANTS a19-18-village-done-ran (ran); complete → a19-18-complete (crouch: the fish is the last image) or ' +
      'a19-18-complete-ran (ran: the long wait on the cliff). READS sableFirst: when it is unset, play ' +
      'a19-18-complete-unset or a19-18-complete-ran-unset instead (the same scenes without the Sable line). The tail-fin ' +
      'saddle is given in every version. The new tail fin is our own design (no red fin, no skull).',
  },
];

// =================================================================== variants (chosen by flags)

/** Scenes that replace a base scene of the same quest, chosen by sableFirst (Grove, read-only) or a19-first. */
export const A19_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A19-8, step 2: sableFirst = slow
  {
    id: 'a19-08-hand-slow',
    lines: [
      N('You know this moment. You knew it before you came to Berk: a dark lawn, a grey shape, fruit on the grass.'),
      N('So you sit very still at the edge of the sand, the way you sat that first night with Sable, and you don’t say a word.'),
      ...HAND_REACH,
      ...HAND_TOUCH,
      N('You didn’t teach him that; he found his own way to it. You just know it when you see it.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A19-8, step 2: sableFirst = grab
  {
    id: 'a19-08-hand-grab',
    lines: [
      N('You know this moment from the wrong side: a dark lawn, a grey wing in your hand, and then nothing but cold fingers.'),
      ...HAND_REACH,
      N('Your Nubbin starts forward across the sand towards them, eager. You put a hand out: not to grab it, just to slow it.'),
      N('It stops, and sits down by your hand, and waits with you.'),
      ...HAND_TOUCH,
    ],
  },
  // ---------------------------------------------------------------- A19-8, step 3: a19-first = ran
  {
    id: 'a19-08-near-ran',
    lines: [
      ...NEAR_START,
      N('Toothless takes one step across the sand. Your Nubbin is behind your legs before he takes another.'),
      N('In the woods you scooped it up and ran, and it hasn’t forgotten the running. It is holding your trouser leg in both paws.'),
      N('Toothless stops, and his ears go flat. He watches your Nubbin for a long moment, then lies down right where he is.'),
      H('That’s all right. He’s just saying: not yet. He said that to me for days.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A19-11, step 3: a19-first = ran
  {
    id: 'a19-11-turn-ran',
    lines: [
      ...TURN_START,
      N('He looks at your Nubbin. Toothless looks at it too, and walks over, and sniffs it, long and careful.'),
      N('Your Nubbin goes stiff all over. It is ready to run, the way you ran with it in the woods.'),
      N('Toothless steps back and sits down. He watches your Nubbin from the ground, and doesn’t lower his shoulder.'),
      H('Not yet, then. Sorry. He’s like that. He decides.', 'sad'),
      N('So you watch them go round the cove without you, low over the water in the very last of the sun.'),
      N('Your Nubbin watches from your lap. It watches Toothless the whole way round.'),
    ],
  },
  // ---------------------------------------------------------------- A19-18, step 2 done: a19-first = ran
  {
    id: 'a19-18-village-done-ran',
    lines: [
      N('Toothless bounds from one end of the square to the other, greeting everyone. He goes the long way round you and your Nubbin.'),
      N('He isn’t unfriendly. He just keeps a fence of air between you, the way he did in the cove.'),
    ],
  },
  // ---------------------------------------------------------------- A19-18, complete: a19-first = ran (sableFirst set)
  {
    id: 'a19-18-complete-ran',
    lines: [...C18_SADDLE, ...C18_RAN_WAIT, C18_SABLE, ...C18_RAN_END],
  },
  // ---------------------------------------------------------------- A19-18, complete: sableFirst unset
  {
    id: 'a19-18-complete-unset',
    lines: [...C18_SADDLE, ...C18_FISH],
  },
  {
    id: 'a19-18-complete-ran-unset',
    lines: [...C18_SADDLE, ...C18_RAN_WAIT, ...C18_RAN_END],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads one Grove flag (sableFirst) and writes no Grove flag. */
export const ATLAS_A19_FLAGS: string[] = [
  'a19-01',
  'a19-02',
  'a19-03',
  'a19-04',
  'a19-05',
  'a19-06',
  'a19-07',
  'a19-08',
  'a19-09',
  'a19-10',
  'a19-11',
  'a19-12',
  'a19-13',
  'a19-14',
  'a19-15',
  'a19-16',
  'a19-17',
  'a19-18',
  'a19-done', // A19-18: the whole page; read by atlasDone('A19') for the Great Voyage festival
  'a19-first', // crouch | ran (a19-04-bound): A19-8, A19-11 and A19-18
];

export const ATLAS_A19_CHECKS: string[] = [
  'visit:a19-forge:loft',
  'minigame:a19-bellows:forge',
  'carry:a19-launcher:forge-door',
  'watch:a19-sky:cliff',
  'escort:a19-hiccup:square',
  'talk:a19-stoick:square',
  'visit:a19-hall:council',
  'carry:a19-stores:docks',
  'inspect:a19-notebook:forge',
  'explore:a19-woods:furrow',
  'watch:a19-hiccup:ropes',
  'walk:a19-hiccup:village',
  'visit:a19-arena:gate',
  'deliver:a19-shields:arena',
  'watch:a19-gronckle:arena',
  'walk:a19-woods:cove',
  'sit:a19-cove:edge',
  'carry:a19-fish:cove',
  'wait:a19-dragon:cove',
  'watch:a19-hiccup:fish',
  'watch:a19-toothless:lines',
  'sit:a19-cove:still',
  'wait:a19-nubbin:cove',
  'carry:a19-lamp:forge',
  'watch:a19-flight:lake',
  'craft:a19-pedal:forge',
  'watch:a19-hiccup:arena',
  'watch:a19-nadder:arena',
  'visit:a19-docks:fleet',
  'watch:a19-astrid:cove',
  'watch:a19-toothless:sky',
  'wait:a19-cove:evening',
  'watch:a19-fog:sky',
  'watch:a19-pit:nest',
  'sit:a19-toothless:flight-home',
  'visit:a19-arena:stands',
  'watch:a19-nightmare:arena',
  'watch:a19-fleet:docks',
  'sit:a19-hiccup:cliff',
  'talk:a19-astrid:cliff',
  'visit:a19-pens:arena',
  'choose:a19-match:pens',
  'escort:a19-riders:sea',
  'watch:a19-mountain:shore',
  'escort:a19-vikings:shore',
  'watch:a19-stoick:wreck',
  'watch:a19-sky:shore',
  'wait:a19-smoke:shore',
  'find:a19-hiccup:shore',
  'visit:a19-hiccup:house',
  'walk:a19-village:square',
  'watch:a19-flight:village',
];
