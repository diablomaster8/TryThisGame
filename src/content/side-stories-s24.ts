/**
 * Grove side story S24, "The Adventure Book" (Part M, rank 4). Tier 2: it changes the Grove world,
 * never the campaign.
 *
 * SOURCE. *Up* (Pixar Animation Studios, 2009; rights: Disney/Pixar). Copyrighted: needs a licence to
 * ship (Part M, open point 5). We take the shape only: a list of places someone meant to go, a heavy
 * load of keepsakes, a stowaway with a sash of badges, a tall striped bird with chicks, and an old
 * explorer who wanted proof. The film's book title and page headings are not used; the book has no
 * name in the story ("her list", "the book", "the atlas"). All other words are original.
 *
 * AUDIENCE. 'all': the main game and the Learning Grove. The two lifted lines have childLines.
 *
 * FRAME. Post-game, the first spring after chapter 12, when the memorial flowers open. Nova comes
 * over the ridge and, for once, stays for tea. Her atlas began as Hazel's list, "Places I'll Go",
 * written at nineteen; Hazel gave it to Nova at twelve ("You go. One of us should."). Nova ticked
 * every line but the nearest: the Sunrise Shelf on the far ridge. You carry Hazel's lantern up beside
 * the falls (not behind them) to light it there at sunrise. The hero is Nova; the grief is hers. Your
 * Nubbin is the loyal one who runs ahead and comes back. Tilly is the stowaway.
 *
 * GROVE FLAGS READ (all through variant scenes and inserts; see the quest's notes for exact rules):
 *   walk        moss (unmade route): Moss rides your shoulder (s24-tea-moss, s24-shelf-moss)
 *               moss (keptStone): his flower beside Hazel's; Nova sits between (s24-tea-moss-stayed)
 *               sable: Sable walks two steps ahead the whole way (s24-tea-sable, s24-shelf-sable)
 *               corvin: Corvin trims the lantern's wick: "Bring it back lit." (s24-lantern-corvin,
 *               s24-home-corvin)
 *               you / unset: the lantern simply hangs by the cottage door (defaults)
 *   hazel       told: the valley climbs Hazel's hill with lanterns to answer the Shelf (s24-lights-told*);
 *               secret / unset: only the four posts answer (s24-lights, s24-lights-kept)
 *   ending id   collector: the tall bird won't come near you and Tilly asks about it; the bird's
 *               payoff falls to Nova (s24-bird-collector*, s24-nest-*-collector)
 *               moss-sleeps: Nova leaves a bun by Moss's flower before you go (s24-bun-moss)
 *               eternal-dawn: the Eternal watches you go and is there when you come home
 *               (s24-eternal-watch, s24-home-eternal)
 *   keptStone   needed to tell the two Moss endings apart and for the cold hands (see notes)
 *   s14Done     Tilly knows you from Keeps & Critters (s24-stowaway-knows)
 *   s18Done     Fairweather lectures at the museum (s24-lecture, later)
 *
 * FLAGS WRITTEN. s24Done (on completion), plus local s24- flags from choices: s24-bird (fed | waited),
 * s24-cage (argue | sit), s24-cairn (cup | scarf | book), s24-page (shelf | tea | here). No
 * campaign flag is written.
 *
 * LIFTED TEXT. *Up* (Pixar, 2009), two single lines, exactly as Part M lists them (rechecked
 * 2026-10-14 against secondary sources):
 *   1. "Adventure is out there!" (Tilly, s24-falls-top; in the film, Muntz's motto, taken up by
 *      Ellie. Here it is Augusta Fairweather's old motto, on Hazel's childhood badge.)
 *   2. "Thanks for the adventure – now go have a new one!" (Hazel's last line in the back of the
 *      book, s24-back-pages; in the film, Ellie's note.)
 *   Each is used once and has a childLines replacement.
 *
 * CARE NOTES. This is grief for a beloved grandmother, in the valley's first spring without her.
 *   - Never a joke at Hazel's expense. Her own dry voice (the list, the back pages, the margin notes)
 *     is allowed to be funny; nobody laughs at her.
 *   - Nova's tears run long. s24-back-pages and its wait have no music cue: wind, the far falls, the
 *     lantern. The wait step has no timer and no fail.
 *   - Hazel's illness is never named. The back pages say only "I nearly told her."
 *   - Muntz's death is replaced: Fairweather is caught in her own net, freed by you and Nova, and
 *     finds peace. Nobody falls.
 *   - No fire as a hazard or a plot device. Hazel's lantern is lit, as every lantern in the valley is.
 *   - Tilly is out of sight for one short beat in the dark (s24-net to s24-nest-*). She is heard the
 *     whole time (Hazel's two-finger supper whistle) and is found safe at the start of the nest scene.
 *     Tilly's note from Hazel stays folded in her welly, never opened (canon 8).
 *   - The tall bird never speaks. Nubbins never speak; Moss (an Eternal) does, a little. Sable is
 *     narrated only.
 *   - Hazel's third rule is echoed in action (you sit down next to Nova and wait) but never quoted.
 */
import type { Choice, Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const Y = say('you');
const NO = say('nova');
const SP = say('sparks');
const M = say('moss');
const C = say('corvin');
const H = say('hazel');

// ---------------------------------------------------------------- other speakers
/** Sparks's cousin, aged nine. Same id as in S14 and S20. */
const TILLY: Speaker = {
  id: 'tilly',
  name: 'Tilly',
  kind: 'other',
  basedOn:
    'Russell, the badge-collecting stowaway (Up, Pixar, 2009), for this story only; reference only',
};
const AUGUSTA: Speaker = {
  id: 'augusta',
  name: 'Augusta Fairweather',
  kind: 'other',
  basedOn:
    'Charles F. Muntz (Up, Pixar, 2009), reference only: an original character who is rescued and finds peace',
};
/** S18's archivist; used only in the s24-lecture variant. */
const DELVE: Speaker = { id: 'delve', name: 'Professor Delve', kind: 'other' };

const TI = say('tilly');
const AU = say('augusta');
const DE = say('delve');

// ================================================================== shared pieces
// ---------------------------------------------------------------- step 1: tea on the hill
const TEA_OPEN: Line[] = [
  N(
    'Spring. The memorial flowers on the hill have opened all at once, as if somebody gave a signal.',
  ),
  N('Hazel’s is the untidy one near Briar’s. It still faces the Grove, very firmly.'),
  N(
    'Somebody comes over the far ridge in the early light, under a pack so big it looks like a walking hedge.',
  ),
  N('It is Nova. She comes straight up the hill path, and at the top she stops, which is new.'),
  NO('Morning. Don’t get up. I live here now, apparently. I still walk past everything.'),
  NO('I thought I’d sit here a minute and not pass.', 'think'),
];
const TEA_SIT = N(
  'She sits down by Hazel’s flower with her pack still on, like a tortoise that has decided to stay for a bit.',
);
/** keptStone line variant: see notes (KEPT-STONE NUBBIN). */
const TEA_RUN = N(
  'Your Nubbin runs to her, then back to you, then to her again, to check you are both still there.',
);
const TEA_CLOSE: Line[] = [
  NO('Is there tea? There’s usually tea. I usually say no.', 'soft'),
  Y('There’s tea.'),
  NO('Then I’ll have some. I’d like to stay for tea.'),
  N(
    'Nobody in the valley can remember Nova staying for tea. Down by the hedge, Fern drops a whole tray of seedlings.',
  ),
];

// ---------------------------------------------------------------- step 3: the lantern
const LANTERN_ASK: Line[] = [
  NO('One more thing. Can we take her lantern? And light it up there, at sunrise?', 'think'),
  NO('So she sees it. From wherever she is, being difficult about something.', 'soft'),
];

// ---------------------------------------------------------------- step 4: the stowaway
const STOW_OPEN: Line[] = [
  N(
    'The carrier’s cart goes up the ridge road on Tuesdays, and takes anyone who can lift their own luggage.',
  ),
  N('Nova can just about lift hers. The cart’s springs go down with a groan.'),
  N('Under the tarp at the back, something says “ow”.'),
  N('Then it says, much more quietly, “Nobody heard that.”'),
];
const STOW_LAW: Line[] = [
  TI(
    'This is a stowaway situation. You can’t send a stowaway back. That’s the law of the sea.',
    'angry',
  ),
  NO('We’re not at sea.', 'think'),
  TI('It’s the law of carts, then. It’s the same law.'),
];

// ---------------------------------------------------------------- step 6: the tall bird
const BIRD_OPEN: Line[] = [
  N(
    'Above the falls the ridge goes up into cloud, and the cloud is full of birdsong you don’t know.',
  ),
  N(
    'You stop to eat, and set Fern’s bag of lantern buns on a rock. Then it is a bag of lantern buns minus one.',
  ),
  N('Something enormous is standing in the mist three strides off, with a bun in its beak.'),
  N(
    'It is taller than Nova and striped like a humbug, with legs like stilts and a little crest that won’t lie flat.',
  ),
  TI('Oh. Oh. Oh, he’s BEAUTIFUL.', 'shock'),
  TI('He’s called Sir Reginald. That’s decided. Nobody else gets a go.'),
  N('Sir Reginald swallows the bun whole. You can watch it go all the way down.'),
  N(
    'It looks at the bag, and then at you. It takes one step forward and two steps back, the way Sable used to.',
  ),
  NO('Don’t grab. Whatever you do. A thing like that, you only see once if you grab.', 'soft'),
];
const BIRD_FED: Choice = {
  id: 'fed',
  label: 'Hold out a bun on your flat hand.',
  set: { 's24-bird': 'fed' },
  then: [
    N('You hold out a bun, flat on your palm, and keep your arm very still.'),
    N(
      'It takes a long time. Then the bird lowers its head and takes the bun so gently you hardly feel the beak.',
    ),
    N('Afterwards it follows you a few steps, hopefully, in case your hand does that again.'),
  ],
};
const BIRD_WAITED: Choice = {
  id: 'waited',
  label: 'Sit down on the path and wait for it to come to you.',
  set: { 's24-bird': 'waited' },
  then: [
    N('You sit down on the wet path. Your Nubbin sits down beside you and keeps still.'),
    N(
      'After a long while the bird comes and stands over you both, and looks down at the top of your Nubbin’s head.',
    ),
    N(
      'Then it bends and tidies a tuft of fur there with its beak, very carefully, as if it has been bothering it.',
    ),
  ],
};
type CollectorMode = 'sold' | 'kept';
/** The ending is collector: the bird won't come near you, and Tilly notices. */
const BIRD_NOTICED: Record<CollectorMode, Line[]> = {
  sold: [
    TI('It doesn’t like you. That’s weird. Everything likes Keepers.', 'think'),
    N(
      'You think of your pens at home, full of fast grey runners that never make a sound. You don’t say anything.',
    ),
  ],
  kept: [
    TI('It doesn’t like your hands. Why are your hands cold? It’s nearly summer.', 'think'),
    N(
      'You put your hands in your pockets. One pocket is colder than the other, and you don’t say anything.',
    ),
  ],
};
const birdFedCollector = (mode: CollectorMode): Choice => ({
  id: 'fed',
  label: 'Hold out a bun on your flat hand.',
  set: { 's24-bird': 'fed' },
  then: [
    N(
      'You hold out a bun on your flat hand. The bird looks at your hand for a long time, and takes one step back.',
    ),
    N(
      'Nova holds out a bun of her own without thinking. The bird walks straight past you and takes it from her.',
    ),
    ...BIRD_NOTICED[mode],
  ],
});
const birdWaitedCollector = (mode: CollectorMode): Choice => ({
  id: 'waited',
  label: 'Sit down on the path and wait for it to come to you.',
  set: { 's24-bird': 'waited' },
  then: [
    N(
      'You sit down on the wet path. The bird stays where it is, three strides off, and comes no nearer.',
    ),
    N(
      'Nova sits down too, a little way off. After a long while the bird goes and stands over her instead.',
    ),
    ...BIRD_NOTICED[mode],
  ],
});
const birdScene = (id: string, mode: CollectorMode | null): Scene => ({
  id,
  lines: BIRD_OPEN,
  choices: mode ? [birdFedCollector(mode), birdWaitedCollector(mode)] : [BIRD_FED, BIRD_WAITED],
});

// ---------------------------------------------------------------- step 12: the nest
const NEST_OPEN: Line[] = [
  N(
    'Under an overhang there is a nest the size of a cart wheel, made of heather and string and most of somebody’s washing line.',
  ),
  N(
    'In it are four striped chicks like knitted tea cosies. Beside it sits Tilly, perfectly safe and extremely cross.',
  ),
  N('Her badge sash is wound round the smallest chick, badges and all, so it doesn’t get cold.'),
  TI(
    'He’s Brave at the Dentist now. He’s never been to a dentist. He’s very brave about it.',
    'think',
  ),
  TI('You took AGES. I’ve been whistling for about a hundred years.', 'angry'),
  TI('Sir Reginald’s a mother. That’s allowed. She can still be Sir.'),
  N(
    'Fairweather’s cage stands open and empty at the edge of the overhang. Out in the dark, a creaky two-note call.',
  ),
];
const NEST_PAYOFF: Record<'fed' | 'waited' | 'fed-collector' | 'waited-collector', Line[]> = {
  fed: [
    N(
      'You remember the flat hand. You lay a trail of buns from the dark to the nest, one by one, and step back.',
    ),
    N(
      'After a long while a striped head comes out of the dark, eating its way along your trail, bun by bun, all the way home.',
    ),
    N('She stands over her chicks and looks at you. You are fairly sure she remembers your hand.'),
  ],
  waited: [
    N(
      'You remember the wet path. You sit down by the nest with your Nubbin beside you, and you wait.',
    ),
    N(
      'After a long while the mother comes out of the dark on her own, and stands over her chicks, and over your Nubbin.',
    ),
    N('She tidies the tuft on its head again. It wasn’t bothering it, and she does it anyway.'),
  ],
  'fed-collector': [
    N(
      'The bird won’t come while you are near. You give Nova the buns and stand back in the dark by the rock.',
    ),
    N(
      'Nova lays the trail and sits down at the end of it. After a long while a striped head comes eating its way home to her.',
    ),
  ],
  'waited-collector': [
    N(
      'The bird won’t come while you are near. You stand back in the dark by the rock, and Nova sits down by the nest alone.',
    ),
    N(
      'After a long while the mother comes out of the dark and stands over her chicks, and over Nova, and stays.',
    ),
  ],
};
const nestScene = (id: string, payoff: keyof typeof NEST_PAYOFF): Scene => ({
  id,
  lines: [...NEST_OPEN, ...NEST_PAYOFF[payoff], NO('There. She came straight home.', 'soft')],
});

// ---------------------------------------------------------------- step 14: sunrise
const SUNRISE: Line[] = [
  N(
    'The sun comes over the far rim and runs down into the valley one place at a time, as if it is calling a register.',
  ),
  N(
    'The Tooth, then the Circuit’s square roofs, then the falls, smoking white; the Hollow, where the paths stop; the tide pools, flashing.',
  ),
  N(
    'Then the Grove: the pond, the cottage, the hill. All of it at once, small and bright, exactly as she wrote it.',
  ),
  TI('Oh.', 'shock'),
  NO('There. The whole valley. At once.', 'soft'),
];
const POSTS_LIT = N(
  'Down in the Grove, four small lights are still burning, one at each post, as if somebody left them on for you.',
);
const POSTS_KEPT = N(
  'Down in the Grove, small lights still burn at the posts: three steady, and one by the long grass that only flickers.',
);
const VALLEY_CLIMBS: Line[] = [
  N(
    'Then more lights, all the way up the western hill: lanterns, a long line of them, climbing in the last of the dark.',
  ),
  N(
    'The valley has walked up her hill to watch the far ridge. Fern saw the cart go, and Sparks told everyone else.',
  ),
  NO('They came. They all came up.', 'shock'),
];
const LANTERN_HIGH = N(
  'You lift Hazel’s lantern as high as it will go. Nova puts her hand under your elbow, to help hold it up.',
);
const lightsScene = (id: string, told: boolean, kept: boolean): Scene => ({
  id,
  lines: [...SUNRISE, kept ? POSTS_KEPT : POSTS_LIT, ...(told ? VALLEY_CLIMBS : []), LANTERN_HIGH],
});

// ---------------------------------------------------------------- step 15: your turn
const TICK_OPEN: Line[] = [
  N(
    'Nova sits on the lip of the Shelf with the atlas open at the front, and a stub of pencil worn almost to nothing.',
  ),
  NO(
    'This was hers. The one she wrote the list with. She gave it me with the book. I’ve never once used it.',
    'soft',
  ),
  N('She ticks the last line. It is a very small tick, and it takes her a long time.'),
  NO('Take someone. Done. I took two, and a stowaway.', 'happy'),
];
const TICK_CAIRN: Record<'cup' | 'scarf' | 'book', Line[]> = {
  cup: [
    N('She pours tea from a flask into Hazel’s tin cup, drinks half, and hands you the rest.'),
    NO('Tea. Accepted.', 'soft'),
  ],
  scarf: [
    N(
      'Tilly is shivering. Nova unwinds the long scarf and winds it round her, three times, and there is still some left.',
    ),
    TI('It’s too long.'),
    NO('It was always too long. You’ll grow into it.', 'soft'),
  ],
  book: [
    N(
      'Her hands are empty except for the book. She doesn’t seem to know what to do with them, so she holds Tilly’s.',
    ),
    TI('Your hand’s cold.', 'think'),
    NO('It’ll warm up. They do.', 'soft'),
  ],
};
const TICK_CLOSE: Line[] = [
  N('Then she ties the pencil stub to a bit of string, and hangs it round Tilly’s neck.'),
  NO('Helping Someone Sad. You earned it. You were very annoying about it, but you earned it.'),
  TI('…It’s the best badge I’ve got.', 'soft'),
  N(
    'Tilly holds it in her fist. With the other hand she checks the top of her welly, the way she always does, and leaves the note where it is.',
  ),
  N('Nova turns the atlas to its very last page, which is blank, and holds it out to you.'),
  NO('Your turn.', 'soft'),
];
const PAGE_CHOICES: Choice[] = [
  {
    id: 'shelf',
    label: 'Write: “The Sunrise Shelf, again. Take someone.”',
    set: { 's24-page': 'shelf' },
    then: [NO('Good. Somebody has to keep it in use.', 'happy')],
  },
  {
    id: 'tea',
    label: 'Write: “Wherever Nova goes next. Tea after.”',
    set: { 's24-page': 'tea' },
    then: [
      NO('Then you’ll have to come and find me. I’ll leave the kettle on. Probably.', 'happy'),
    ],
  },
  {
    id: 'here',
    label: 'Write: “Here. Every morning.”',
    set: { 's24-page': 'here' },
    then: [NO('That’s the hardest one on any list. She managed it forty years.', 'soft')],
  },
];
const tickScene = (id: string, kept: 'cup' | 'scarf' | 'book'): Scene => ({
  id,
  lines: [...TICK_OPEN, ...TICK_CAIRN[kept], ...TICK_CLOSE],
  choices: PAGE_CHOICES,
});

// ---------------------------------------------------------------- complete: home
const HOME_OPEN: Line[] = [
  N(
    'You come down off the ridge in the afternoon, slowly, because Augusta Fairweather is coming too, on Nova’s arm.',
  ),
  AU('Fifty years. I don’t suppose anybody has kept my room.', 'think'),
  N(
    'She takes the empty cottage at the foot of the falls path, for a week, she says. Nobody believes her, kindly.',
  ),
];
const HOME_ETERNAL = N(
  'Your Eternal is on the cottage step when you get in, as if it had been there all along. It probably had.',
);
const HOME_CLOSE: Line[] = [
  N(
    'That night you light Hazel’s lantern by the cottage table and open the atlas, to read her list again.',
  ),
  N(
    'In the margins there is writing, in faint pencil. It wasn’t there before, or it was, and it needed this light.',
  ),
  N(
    'It is on every page. Beside a boy and a dragon in a hollow: “I’d have fed the dragon.” Beside a building of endless counters: “Ha. Typical.”',
  ),
  N(
    'She read every story Nova ever brought her, and had something to say about all of them. Of course she did.',
  ),
  N(
    'Nova stays three days, and has tea every afternoon. On the fourth she sets off over the far ridge for a long walk, with a pack you could lift with a finger. She says twice that she’ll be back.',
  ),
  N('At the top she turns and waves, and doesn’t wait to see whether you wave back. She knows.'),
];

// ================================================================== the quest
export const SIDE_STORY_S24: Quest[] = [
  {
    id: 's24',
    code: 'S24',
    title: 'The Adventure Book',
    source:
      'Up (Pixar, 2009): a list of places someone meant to go, a load of keepsakes too heavy to carry, a stowaway with badges, a tall striped bird and an old explorer who wanted proof. Two quoted lines; all other words original',
    audience: 'all',
    trigger: {
      where:
        'The western hill by Hazel’s flower; then the carrier’s cart, the scree path beside the falls, the far ridge and the Sunrise Shelf',
      when: 'Post-game: the first spring after chapter 12, once the memorial flowers open (after the ending has played). Any ending.',
    },
    speakers: [TILLY, AUGUSTA, DELVE],
    steps: [
      // ------------------------------------------------ 1. Nova stays for tea
      {
        id: 's24-step1',
        goal: 'Sit with Nova by Hazel’s flower on the hill.',
        hint: 'Nova is at the top of the western hill, by the newest flower. Walk up and sit down beside her.',
        check: 'sit:s24-hill:hazels-flower',
        scene: { id: 's24-tea', lines: [...TEA_OPEN, TEA_SIT, TEA_RUN, ...TEA_CLOSE] },
        done: {
          id: 's24-tea-done',
          lines: [
            N(
              'You bring the pot up the hill. Nova drinks two cups, and holds the third without drinking it, for the warmth.',
            ),
            NO(
              'She asked me in every time. Every single time. I always said I couldn’t stop.',
              'soft',
            ),
            NO('I could have stopped.', 'sad'),
            N('She looks at the flower for a while. Then she undoes the top of her pack.'),
          ],
        },
      },
      // ------------------------------------------------ 2. the first pages
      {
        id: 's24-step2',
        goal: 'Look at the first pages of Nova’s atlas.',
        hint: 'Nova has the atlas open on her knees. Stay sitting beside her and look.',
        check: 'inspect:s24-atlas:first-pages',
        scene: {
          id: 's24-pages',
          lines: [
            N(
              'The atlas comes out wrapped in oilcloth. It is fat with maps and tickets and pressed leaves, and tied shut with a bootlace.',
            ),
            NO(
              'You’ve seen the middle. The stories. Everybody has. I don’t show anyone the front.',
              'think',
            ),
            N(
              'She unties the bootlace. The first pages are not maps: they are a list, in pencil, in a young hand that presses hard.',
            ),
            N(
              'At the top, underlined twice: PLACES I’LL GO. Underneath, smaller and crosser: (and nobody is to stop me).',
            ),
            NO(
              'Hazel wrote that. She was nineteen. Before the Grove. Before Moss decided she’d do.',
              'soft',
            ),
            N(
              '“A sea with no other side”; “a city with trams”; “somewhere it snows in June”; “a mountain nobody can pronounce”.',
            ),
            N(
              'Every line has a tick beside it, in ink, in a different hand. Some of the ticks are very old, and some are not.',
            ),
            NO(
              'Mine. Every tick. She asked me to come back and tell her about each one after. So I did.',
            ),
            NO(
              'I was twelve. I came through on the carrier’s cart, between one place and the next one. It was raining.',
              'soft',
            ),
            NO(
              'She gave me tea, which I refused, and this, which I didn’t. She said, “You go. One of us should.”',
            ),
          ],
        },
        done: {
          id: 's24-pages-done',
          lines: [
            N(
              'One line, at the very bottom, has no tick: “The Sunrise Shelf. See the whole valley at once. Take someone.”',
            ),
            NO(
              'It’s on the far ridge. A day’s walk. I’ve seen a sea with no other side, and I never went a day’s walk from her door.',
              'sad',
            ),
            NO('It says take someone. I never had anyone to take.'),
            NO('…I might have someone now. If someone’s free.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 3. Hazel's lantern
      {
        id: 's24-step3',
        goal: 'Fetch Hazel’s lantern from its hook by the cottage door.',
        hint: 'It hangs on the hook by the cottage door. Tap it to take it down.',
        check: 'collect:s24-hazels-lantern',
        scene: {
          id: 's24-lantern',
          lines: [
            ...LANTERN_ASK,
            N(
              'Hazel’s lantern hangs on the hook by the cottage door, where it has hung since somebody brought it down off the hill.',
            ),
            N(
              'You haven’t lit it since. You dust it, and you tell yourself you are waiting for a good reason.',
            ),
            N('Your Nubbin sits under it and looks up, the way it looks up at the fruit trees.'),
            NO(
              'Is that all right? It’s yours now. I can stop asking for things. I’m out of practice anyway.',
              'think',
            ),
          ],
        },
        done: {
          id: 's24-lantern-done',
          lines: [
            N('The lantern is lighter than you remember. It was nearly always her carrying it.'),
            NO('Right. Now I need a carrier who doesn’t ask questions.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 4. the stowaway
      {
        id: 's24-step4',
        goal: 'Load Nova’s pack onto the carrier’s cart. Something under the tarp is giggling.',
        hint: 'The carrier’s cart waits at the end of the lane. Lift the tarp at the back.',
        check: 'find:s24-tilly:carrier-cart',
        scene: {
          id: 's24-stowaway',
          lines: [
            ...STOW_OPEN,
            N(
              'Sparks comes down the lane at a run, which is how Sparks comes down a lane, waving both arms.',
            ),
            SP(
              'Is she in there? She’s in there. Course she is. Sorry. SORRY. She’s my cousin.',
              'shock',
            ),
            SP(
              'Tilly. Nine. Calls Hazel “Gran” too. Everyone under ten does; it saves explaining. She heard “ridge” and went off like a cork.',
            ),
            N(
              'You lift the tarp. A girl in big wellies glares up at you, with a sash across her chest covered in home-made badges.',
            ),
            ...STOW_LAW,
          ],
        },
        done: {
          id: 's24-badges',
          lines: [
            TI(
              'I need a badge. I’ve got Knots (Mostly), Brave at the Dentist, Goose Handling, and an old tin one.',
              'think',
            ),
            TI(
              'I need Helping Someone Sad. Somebody here is sad. I can tell. I’m very good at it.',
            ),
            N(
              'She looks straight at Nova. Nova looks at the cart’s back wheel as if it has said something interesting.',
            ),
            N(
              'In the top of Tilly’s left welly there is a folded square of paper, damp at one corner.',
            ),
          ],
          choices: [
            {
              id: 'leave',
              label: 'Say nothing about the note.',
              then: [
                N(
                  'You say nothing about it. Tilly notices you saying nothing, and stands up a bit straighter in the cart.',
                ),
                TI('You can come on my adventure. You’re allowed.'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask her if she’s all right.',
              then: [
                TI(
                  'I’m FINE. That’s private. It’s from Gran Hazel. It isn’t for opening. It’s for having.',
                  'angry',
                ),
                N('She pushes it down out of sight. Then she pats the welly, once, to check.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 5. the heavy pack, beside the falls (outline Q5 + Q6)
      {
        id: 's24-step5',
        goal: 'Climb the scree path beside the falls. Nova won’t let anyone carry her pack.',
        hint: 'Follow your Nubbin. It finds the dry stones; step where it steps.',
        check: 'climb:s24-falls-scree',
        scene: {
          id: 's24-pack',
          lines: [
            N(
              'The cart leaves you at the foot of the falls path, where the road gives up and the water takes over.',
            ),
            N(
              'Nova gets her pack onto her back in three goes. It clanks, and it is the size of a small shed.',
            ),
            Y('What’s in it?'),
            NO('Things. Her things. Things she gave me.', 'think'),
            NO(
              'A tin cup. A scarf she knitted a sleeve too long. Every postcard I sent her, and every one she sent back.',
            ),
            NO('A shell I gave her, which she gave back, and I gave her again. Twice.', 'happy'),
            N(
              'You offer to take a strap, and she says no. Tilly offers to take a strap, and she says no, more kindly.',
            ),
            NO('I’ll manage. I always manage. It’s only heavy when you think about it.'),
            N(
              'Fern has sent a paper bag of lantern buns. It sits on top of everything, the only light thing in there.',
            ),
            N(
              'Your Nubbin is already halfway up the first stretch of scree, looking back to see why you are all so slow.',
            ),
          ],
        },
        done: {
          id: 's24-falls-top',
          lines: [
            N(
              'The path climbs beside the falls, not behind them, through spray and roar. The stones are wet and loose.',
            ),
            N(
              'Your Nubbin finds the dry ones. It runs up, waits on each, runs back to you, and goes up again.',
            ),
            N(
              'At the top Tilly climbs onto a boulder, spreads her arms at the whole wet sky, and yells at the top of her voice.',
            ),
            TI('Adventure is out there!', 'happy'),
            NO('…It is, isn’t it.', 'soft'),
            N(
              'Nova is red in the face and bent nearly double under the pack. She is also, very slightly, smiling.',
            ),
          ],
        },
      },
      // ------------------------------------------------ 6. the tall bird (the signature choice)
      {
        id: 's24-step6',
        goal: 'Something has stolen a lantern bun. Meet the thief without frightening it.',
        hint: 'Choose: hold out a bun on your flat hand, or sit down on the path and let it come to you.',
        check: 'choose:s24-tall-bird:feed-or-wait',
        scene: birdScene('s24-bird', null),
        done: {
          id: 's24-bird-done',
          lines: [
            N(
              'Then something calls from higher up, a creaky two-note call. The bird turns its head, and is gone into the cloud.',
            ),
            TI('He’s got somewhere to be. You can tell.', 'think'),
            N('Nova is standing very still, with her mouth open.'),
            NO('That’s a— no. That can’t be. That’s out of a picture paper.', 'shock'),
          ],
        },
      },
      // ------------------------------------------------ 7. the camp in the cloud
      {
        id: 's24-step7',
        goal: 'Follow the bird’s tracks up to the camp in the cloud.',
        hint: 'Three-toed tracks, very far apart. Your Nubbin will find the next one.',
        check: 'visit:s24-fairweather-camp',
        scene: {
          id: 's24-tracks',
          lines: [
            N(
              'The tracks are three-toed, enormous and very far apart. Your Nubbin runs from one to the next and sits in each to show you.',
            ),
            TI(
              'We’re tracking him. That’s a tracking badge. I’m getting two badges today.',
              'happy',
            ),
            N(
              'Higher up, the tracks cross a lot of other tracks: boots, very old ones, going round and round in the same circles.',
            ),
            N(
              'Then a tarpaulin in the cloud, roped to the rock. A washing line, a row of flags, and a great many notebooks under a tin lid.',
            ),
            N(
              'And a very old woman with a telescope, a hat with a feather in it, and a voice like a door that wants oiling.',
            ),
            AU(
              'Stand still. Stand STILL. You’ll frighten it off, and then you’ll say it was never here. They always do.',
              'angry',
            ),
          ],
        },
        done: {
          id: 's24-camp',
          lines: [
            AU(
              'Augusta Fairweather. You won’t have heard of me. Nobody has, for fifty years.',
              'think',
            ),
            N('Nova makes a noise like a kettle just before it gets going.'),
            NO(
              'THE Fairweather? From the picture papers? Hazel had your picture on her wall when she was a girl. She told me.',
              'shock',
            ),
            AU(
              'Did she. Then she was one of four thousand children who believed me, before they were told not to.',
            ),
            N('Fairweather’s eye falls on Tilly’s sash, on the old tin badge, and stays there.'),
            AU('That’s one of mine. The Young Explorers. Where did you get that?', 'shock'),
            TI('Gran Hazel. It was hers when she was little. She gave it me. It’s my oldest one.'),
            AU(
              '…Of course it was. I heard somebody shout my old motto up at the falls today. I thought I’d dreamed it.',
              'soft',
            ),
            NO('She wrote her list because of you. All of it. Every place.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 8. the net
      {
        id: 's24-step8',
        goal: 'Stay at the camp till dusk.',
        hint: 'Wait by the tarpaulin as the light goes. Fairweather says lanterns frighten the bird, so keep Hazel’s unlit.',
        check: 'watch:s24-ridge:dusk',
        scene: {
          id: 's24-cage',
          lines: [
            AU(
              'I came down off this ridge with one striped feather and a story. The papers called me a liar in letters this high.',
              'angry',
            ),
            AU('So I came back up to prove it. I’ve been proving it ever since.', 'sad'),
            N(
              'Behind the tarpaulin is a cage of bent ash and wire, beautifully made, and big enough for a bird taller than Nova.',
            ),
            AU(
              'For the bird. Your girl’s name for it is better than mine. I’ve called it Proof for fifty years.',
              'think',
            ),
            TI('Proof is a rubbish name. He’s Sir Reginald.', 'angry'),
            AU('Proof was never a name, child. It was a headline.'),
            TI('Still rubbish.'),
            AU(
              'One night in that, down in the valley square where everyone can see. Then I can stop.',
            ),
            NO('Stop what?', 'soft'),
            AU('Being the liar on the ridge. Being up here. Being—', 'angry'),
            N(
              'She doesn’t finish. She folds a net over her arm, carefully, the way you fold a shirt somebody ironed for you.',
            ),
            TI(
              'You can’t put Sir Reginald in a CAGE. That’s the worst rule I ever heard.',
              'angry',
            ),
            AU('I didn’t make the rule, child. The papers did.', 'sad'),
            AU(
              'It comes down to drink at the spring above the camp at dusk. It always has. Tonight I shall be ready.',
            ),
            AU('And keep that lantern dark. One match and it’s gone for a week.', 'angry'),
          ],
          choices: [
            {
              id: 'argue',
              label: 'Tell her the bird doesn’t owe anyone proof.',
              set: { 's24-cage': 'argue' },
              then: [AU('Nor did I. They wanted it anyway.', 'sad')],
            },
            {
              id: 'sit',
              label: 'Say nothing. Sit down near the cage.',
              set: { 's24-cage': 'sit' },
              then: [
                N(
                  'You sit down near the cage. Fairweather watches you do it, and something in her face goes tired.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 's24-net',
          lines: [
            N(
              'Dusk. The bird comes down to the spring, all stripes and stilts, and bends to drink.',
            ),
            N(
              'The net goes over it with a sound like a sail filling. Fairweather is faster than anyone that old has a right to be.',
            ),
            N(
              'The bird bolts up the ridge into the dark, dragging net and old woman both. Tilly is after them before anyone can catch her collar.',
            ),
            N('Nova lunges after Tilly. Her pack swings, slides on the wet rock, and goes towards the drop.'),
            N('She grabs the pack. She grabs it with both arms.'),
            N('When she looks up, Tilly is gone into the dark.'),
          ],
        },
      },
      // ------------------------------------------------ 9. the rock: give her the lantern
      {
        id: 's24-step9',
        goal: 'Light Hazel’s lantern and give it to Nova.',
        hint: 'Sit with her first. Then light the lantern and put it in her hands.',
        check: 'give:s24-nova:hazels-lantern',
        scene: {
          id: 's24-rock',
          lines: [
            N('Nova sits down on the rock with the pack in her arms, and doesn’t move.'),
            N(
              'Your Nubbin is off up the ridge into the dark before you can call it. A moment later it comes back, calm, and sits at your feet.',
            ),
            N(
              'Then, from high up the ridge, a whistle: two fingers, rising at the end. Hazel’s supper call.',
            ),
            TI('I’M FINE. I’M WITH SIR REGINALD. NOBODY COME, YOU’LL SCARE HIM.', 'angry'),
            NO('She’s all right. She’s all right.', 'shock'),
            NO('I grabbed the pack. She was right there, and I grabbed the pack.', 'sad'),
            N(
              'It is too dark for the ridge path now, and too steep to hurry on. The whistle comes again, cross and steady.',
            ),
            N('You sit down next to Nova, and you don’t say anything. You wait.'),
          ],
        },
        done: {
          id: 's24-light',
          lines: [
            N(
              'You light Hazel’s lantern. It comes up small and gold, and the rock and the pack and Nova’s face come out of the dark.',
            ),
            N(
              'You put it in her hands, and she holds it a long time. Then she sets the pack down, so she can hold it properly.',
            ),
            NO(
              'I’ll read her list. I always read her list when it’s bad. It’s the only thing that works.',
              'soft',
            ),
            N(
              'She opens the atlas from the wrong end. The back pages fall open in the lantern light.',
            ),
          ],
        },
      },
      // ------------------------------------------------ 10. the rest of the book
      {
        id: 's24-step10',
        goal: 'Stay with Nova. Let it take as long as it takes.',
        hint: 'Don’t hurry her, and don’t move. There is no wrong amount of time.',
        check: 'wait:s24-nova:as-long-as-it-takes',
        scene: {
          id: 's24-back-pages',
          lines: [
            N(
              'The back pages are in pencil too, in an older hand than the list. It doesn’t press so hard now.',
            ),
            NO(
              'These aren’t mine. I never… I never turned to the back. Why would you turn to the back?',
              'think',
            ),
            NO(
              '“Nova came. Twelve, all knees. Gave her the book. She’ll never bring it back. Good.”',
            ),
            NO('“Nova came. Tea (refused).”'),
            N('She laughs. It comes out wrong.'),
            NO(
              '“Nova came. Brought a shell. Tea (refused).” “Nova came. Took the shell back. Tea (refused).”',
              'soft',
            ),
            NO(
              'She left my pack by her door while I walked the valley. She must have taken this out and written in it. Every time.',
            ),
            N(
              'Pages of it: rain, frost, Fern’s trees, the weather, and who came to the gate, and who didn’t.',
            ),
            NO(
              '“Sun. Moss sat on my foot all afternoon. Got nothing done. Best day this year.”',
              'soft',
            ),
            NO(
              '“Nova came. Taller. Ticked off a sea. Tea (refused). Don’t mind. She’ll stop for tea when she’s ready.”',
            ),
            NO(
              '“Nova came. I nearly told her. Didn’t. She’d have stayed, and hated it, and so would I.”',
              'sad',
            ),
            N(
              'Nova can’t read the last one out. She turns the book round and holds the lantern so you can see.',
            ),
            N(
              'It is the last thing written there, on her last visit before Hazel went to the Hollow.',
            ),
            H('“Thanks for the adventure – now go have a new one!”', 'soft'),
            N(
              'Nova cries. All of it, at once, with her whole face, the lantern shaking in her hands.',
            ),
          ],
        },
        done: {
          id: 's24-crying',
          lines: [
            N(
              'Your Nubbin climbs into her lap, on top of the book, and leans its whole weight against her.',
            ),
            N(
              'You keep still. Up the ridge, every so often, the supper whistle comes, cross and steady, and nobody hurries anything.',
            ),
            N('It takes as long as it takes. Then a little longer.'),
            NO('“Tea (refused).” Every time. She wrote it down every time.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 11. lighter
      {
        id: 's24-step11',
        goal: 'Help Nova build a cairn of Hazel’s things.',
        hint: 'Flat stones at the bottom. Nova will hand you each thing. Take your time.',
        check: 'build:s24-cairn',
        scene: {
          id: 's24-cairn',
          lines: [
            N(
              'When she has finished, Nova wipes her face on her sleeve, both sides, thoroughly, like someone cleaning a window.',
            ),
            NO(
              'She didn’t want me carrying her about. She wanted me to go and get rained on somewhere new.',
              'soft',
            ),
            N('She opens the pack and empties it onto the rock, carefully, one thing at a time.'),
            N(
              'A tin cup, a scarf a sleeve too long, a shell, and bundles of postcards in string, in two hands, going both ways.',
            ),
            NO('I’m leaving them here. Up here, where she never got to. On the way to the Shelf.'),
            N(
              'You build it together by lantern light, flat stones first. Every thing she puts in, she puts in properly.',
            ),
            NO('She’d say I was being dramatic.', 'think'),
            Y('She’d be right.'),
            NO('She would. She’d be insufferable about it.', 'happy'),
            N(
              'With the cairn nearly done, Nova stops, with the last two things in her lap: the tin cup and the scarf.',
            ),
          ],
          choices: [
            {
              id: 'cup',
              label: '“Keep the tin cup.”',
              set: { 's24-cairn': 'cup' },
              then: [NO('For tea. Which I’ll have, from now on. Whenever it’s offered.', 'soft')],
            },
            {
              id: 'scarf',
              label: '“Keep the scarf.”',
              set: { 's24-cairn': 'scarf' },
              then: [
                NO(
                  'It’s too long. It was always too long. She said I’d grow into it. I didn’t.',
                  'happy',
                ),
                N('She puts it round her neck anyway, twice, and there is still some left over.'),
              ],
            },
            {
              id: 'book',
              label: '“Leave them both. Keep the book.”',
              set: { 's24-cairn': 'book' },
              then: [NO('Just the book. Yes. It’s the only one with her in it, talking.', 'soft')],
            },
          ],
        },
        done: {
          id: 's24-cairn-done',
          lines: [
            N(
              'The pack is empty. Nova picks it up with one finger, and it swings, and she laughs at it.',
            ),
            NO('Oh. Oh, that’s much better.'),
            N('Up the ridge the whistle comes again. This time it sounds fed up.'),
            NO('Right. Let’s go and fetch our stowaway.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 12. the chicks (payoff of step 6)
      {
        id: 's24-step12',
        goal: 'Follow Tilly’s whistle up the ridge by lantern light.',
        hint: 'Walk towards the whistle. Keep the lantern low so it doesn’t dazzle anything.',
        check: 'find:s24-tilly:nest',
        scene: {
          id: 's24-whistle',
          lines: [
            N(
              'You go on up towards the whistle with the lantern held low, so it lights the path and not the sky.',
            ),
            N(
              'Your Nubbin runs ahead into the dark, and back, and ahead, as if it is pulling you along on a string.',
            ),
            N(
              'Nova’s empty pack slaps on her back. Every few steps she turns to check the cairn is still there, a pale heap in the dark.',
            ),
            NO('It’s fine. It’s just stones. I know it’s just stones.', 'think'),
            N('The whistle again, much closer, and very fed up.'),
            TI('I CAN SEE YOUR LANTERN. YOU’RE GOING THE LONG WAY.', 'angry'),
          ],
        },
        done: nestScene('s24-nest-fed', 'fed'),
      },
      // ------------------------------------------------ 13. Fairweather sits down
      {
        id: 's24-step13',
        goal: 'Free Fairweather’s boot from her net, one loop at a time.',
        hint: 'Work from the outside in. Your Nubbin will sit on the net’s end so it can’t slide.',
        check: 'puzzle:s24-net:untangle',
        scene: {
          id: 's24-edge',
          lines: [
            N(
              'At the edge of the overhang, where the rock stops and the dark begins, somebody says, quite calmly, “I wonder if anyone might help.”',
            ),
            N(
              'Augusta Fairweather is sitting at the very edge with one boot wound up in her own net. The net is caught on a spike of rock.',
            ),
            AU('Don’t hurry. Hurrying is how one gets into nets.', 'think'),
            AU(
              'I went after it in the dark. Fifty years of patience, thrown away in one evening. Rather a waste.',
            ),
            N(
              'You and Nova kneel on either side of her, and set the lantern down where it lights the knots.',
            ),
            NO('One loop at a time. Like her scarf, when it went wrong.', 'soft'),
          ],
        },
        done: {
          id: 's24-proof',
          lines: [
            N(
              'Nobody hurries, and nobody falls. Your Nubbin sits on the end of the net so it can’t slide, and the last loop comes free.',
            ),
            N(
              'Fairweather tries to stand, and can’t, and sits back against the rock. She is very tired, and very old.',
            ),
            AU('I shall just sit, I think. For a moment.'),
            N(
              'So she sits, and waits, and so do you all. The mother bird steps out from the nest and walks past her, close enough to touch.',
            ),
            N(
              'Fairweather’s hand comes up off her knee and stays in the air a moment. Then it goes back down.',
            ),
            AU('That’ll do.', 'soft'),
            AU('That’s proof enough for me.', 'soft'),
            N(
              'She takes an old striped feather out of her hatband, the one the papers laughed at, and puts it in your hand.',
            ),
            AU(
              'I shan’t need it now. Go on. Go and see your sunrise. I’ve seen eighteen thousand. I’ll mind the children.',
              'happy',
            ),
          ],
        },
      },
      // ------------------------------------------------ 14. the Sunrise Shelf
      {
        id: 's24-step14',
        goal: 'Set Hazel’s lantern, lit, on the Sunrise Shelf as the sun comes up.',
        hint: 'Put it on the lip of the rock, facing the Grove. Then wait for the sun.',
        check: 'place:s24-hazels-lantern:sunrise-shelf',
        scene: {
          id: 's24-shelf',
          lines: [
            N(
              'The Sunrise Shelf is ten minutes on from the nest: a flat lip of rock on the far ridge, with nothing in front of it but air.',
            ),
            N(
              'You get there in the last of the dark. The valley below is one big blue shadow with nothing in it you can name.',
            ),
            TI('Is this it? It’s just dark. I was promised a whole valley.', 'think'),
            NO('Wait. That’s the whole trick of it. You wait.', 'soft'),
            N('Nova gives you back Hazel’s lantern.'),
            NO(
              'You do it. She’d want it to be you. She’d pretend she wanted it to be anybody.',
              'soft',
            ),
            N(
              'The sky over the far rim is going thin and pale, the way milk goes when you pour it into tea.',
            ),
          ],
        },
        done: lightsScene('s24-lights', false, false),
      },
      // ------------------------------------------------ 15. your turn
      {
        id: 's24-step15',
        goal: 'Write the first line on the atlas’s last page.',
        hint: 'Choose what to write, then write it with Hazel’s pencil stub.',
        check: 'craft:s24-atlas:last-page',
        scene: tickScene('s24-tick', 'cup'),
        done: {
          id: 's24-written',
          lines: [
            N(
              'You write it in pencil, with the stub, which Tilly lends you on the strict understanding that it is hers.',
            ),
            N(
              'Then she borrows it straight back, and letters a badge for you on a bit of cereal box: HELPING SOMEONE SAD (ADVANCED).',
            ),
            TI('You were all right. For a grown-up.'),
            N('Under your line on the last page there is room for a great many more.'),
          ],
        },
      },
    ],
    complete: { id: 's24-home', lines: [...HOME_OPEN, ...HOME_CLOSE] },
    rewards: [
      {
        id: 's24-margin-notes',
        kind: 'feature',
        label: 'Hazel’s margin notes',
        description:
          'Faint pencil notes in Hazel’s hand, one on every page of Nova’s atlas, written on Nova’s visits years ago. Tap one to read it.',
      },
      {
        id: 's24-last-page',
        kind: 'feature',
        label: 'The atlas’s last page',
        description:
          'A blank last page in the atlas, for your own list. It starts with the line you wrote on the Sunrise Shelf.',
      },
      {
        id: 's24-sunrise-shelf',
        kind: 'feature',
        label: 'The Sunrise Shelf',
        description:
          'A viewpoint on the far ridge where you can see the whole valley at once. Best at dawn.',
      },
      {
        id: 's24-pencil-badge',
        kind: 'cosmetic',
        label: 'Tilly’s pencil-stub badge',
        description:
          'A circle of cereal box, lettered with Hazel’s pencil stub: HELPING SOMEONE SAD (ADVANCED). Worn on the coat.',
      },
      {
        id: 's24-cairn-decor',
        kind: 'decor',
        label: 'Ridge cairn',
        description:
          'A small cairn of flat ridge stones, like the one Nova built on the way to the Shelf. Nubbins like to sit on top of it.',
      },
      {
        id: 's24-feather-hat',
        kind: 'cosmetic',
        label: 'Striped-feather hat',
        description:
          'A hat with Augusta Fairweather’s old striped feather in the band: the one the papers laughed at, fifty years ago.',
      },
    ],
    sets: { s24Done: true },
    childLines: {
      's24-falls-top#3': 'The whole world’s up here! The WHOLE WORLD!',
      's24-back-pages#13':
        '“Thank you for every bit of it. Now off you go, and find somewhere new!”',
    },
    notes:
      'THEME. Hazel’s list was the adventure she meant to have; the back of the book was the one she had. Nova learns that ' +
      'carrying Hazel’s things is not the same as carrying Hazel, and sets them down. QUESTION: what do we keep of someone, ' +
      'and what do we leave on the ridge? (s24-cairn; all three answers are right.) SIGNATURE CHOICE: s24-bird (feed or ' +
      'wait, step 6) pays off at the nest (step 12, six steps later): the done scene is s24-nest-fed or s24-nest-waited. ' +
      'OUTLINE MAP. Outline Q1–Q4 are steps 1–4; Q5 (the heavy pack) and Q6 (beside the falls) are merged into step 5; ' +
      'Q7–Q9 are steps 6–8; Q10 (the rest of the book) is split into steps 9 (the lantern) and 10 (the reading and the ' +
      'wait); Q11–Q14 are steps 11–14; step 15 (the last page) is the end of Q14. ' +
      'TIMING. The usual convention: a step’s scene plays when the previous check is met; its done plays when its own check ' +
      'is met. The whole story is one journey (morning, a day’s walk, a night, a dawn); once step 4 is met, steps 5–15 run ' +
      'without a break and the player cannot leave the ridge until step 14 is met (a back-out returns to the last step’s ' +
      'start, never fails). Steps 1–4 can be spread over days. ' +
      'CHECKS. sit:s24-hill:hazels-flower (sit beside Nova). inspect:s24-atlas:first-pages (open the atlas item at the ' +
      'front). collect:s24-hazels-lantern (take Hazel’s lantern decor off its hook; it is carried, and goes back on the ' +
      'hook at s24-home, lit). find:s24-tilly:carrier-cart (lift the tarp). climb:s24-falls-scree (a short scree climb: ' +
      'step on the stones your Nubbin sits on). choose:s24-tall-bird:feed-or-wait (met by either choice). ' +
      'visit:s24-fairweather-camp (follow the tracks). watch:s24-ridge:dusk (wait for dusk; a short sky fade). ' +
      'give:s24-nova:hazels-lantern (light it, then give it). wait:s24-nova:as-long-as-it-takes is a hold-still beat: no ' +
      'input for about 30 seconds of ambient sound (any tap resets it gently; no timer shown, no fail, no music). ' +
      'build:s24-cairn (place five flat stones and four things; any order works). find:s24-tilly:nest (walk towards the ' +
      'whistle). puzzle:s24-net:untangle (unpick four loops, outside in; cannot fail). ' +
      'place:s24-hazels-lantern:sunrise-shelf (set it on the lip, then a sunrise sky fade). craft:s24-atlas:last-page ' +
      '(write the chosen line). ' +
      'VARIANTS (all in SIDE_STORY_S24_VARIANTS). Scene and Choice have no condition fields, so every branch is its own ' +
      'scene. Replacements play instead of the named scene; inserts play in addition, at the named point. ' +
      '(1) STEP 1 SCENE, by walk. s24-tea is for walk = you, corvin or unset. walk = moss and keptStone false: ' +
      's24-tea-moss (Moss came down in the spring “decided”, end-epi-walk-moss, and rides your shoulder for the whole ' +
      'story; staging only after this, with one insert at the Shelf). walk = moss and keptStone true: s24-tea-moss-stayed ' +
      '(his flower beside Hazel’s, as in end-epi-walk-moss-stayed; Nova sits between them). walk = sable: s24-tea-sable ' +
      '(Sable walks two steps ahead of you the whole way, waiting at every bend: staging, plus one insert at the Shelf). ' +
      '(1a) INSERT after the step 1 scene: s24-moss-kept, when keptStone is true and walk is not moss (Moss sits on the ' +
      'hill with his back to the Grove, as in c11-moss-kept and end-collector-kept). ' +
      '(2) STEP 3 SCENE: s24-lantern by default; with walk = corvin, s24-lantern-corvin (corvinGate = family, so it is ' +
      'Sunday and he is by the pond; the lantern hangs by the cottage door, as in end-epi-walk-corvin; he trims the wick: ' +
      '“Bring it back lit.”). The done scene s24-lantern-done is shared. ' +
      '(3) STEP 4 SCENE: s24-stowaway when s14Done is false (Sparks introduces Tilly, apologising); with s14Done, ' +
      's24-stowaway-knows (Tilly knows you from Keeps & Critters). The done scene s24-badges is shared. ' +
      '(4) INSERTS between s24-badges (step 4 done) and s24-pack (step 5 scene), by the ending id: moss-sleeps → ' +
      's24-bun-moss (Nova leaves a lantern bun on Moss’s flat stone by his flower); eternal-dawn → s24-eternal-watch (the ' +
      'Eternal watches the cart go). At most one plays. ' +
      '(5) STEP 6 SCENE, by the ending id: s24-bird for every ending but collector; collector with keptStone false → ' +
      's24-bird-collector; collector with keptStone true → s24-bird-collector-kept (Tilly asks why your hands are cold). ' +
      'In both collector versions the bird will not come near you, and the payoff falls to Nova. Choice ids and the ' +
      's24-bird flag are the same in all three. ' +
      '(6) STEP 12 DONE: s24-nest-fed (s24-bird = fed) or s24-nest-waited (waited); with the collector ending, ' +
      's24-nest-fed-collector or s24-nest-waited-collector (Nova lays the trail or sits; you stand back). ' +
      '(7) STEP 14 DONE, by hazel and keptStone: s24-lights (hazel secret or unset: only the four posts answer); ' +
      's24-lights-told (hazel = told: the valley has climbed Hazel’s hill with lanterns); with keptStone, s24-lights-kept ' +
      'and s24-lights-told-kept (the Long-Grass post only flickers). ' +
      '(7a) INSERTS straight after the step 14 done: walk = moss with keptStone false → s24-shelf-moss; walk = sable → ' +
      's24-shelf-sable. ' +
      '(8) STEP 15 SCENE, by s24-cairn: s24-tick (cup), s24-tick-scarf, s24-tick-book. Same choices in all three. ' +
      '(9) COMPLETE: s24-home by default; with the ending eternal-dawn, s24-home-eternal (the Eternal is on the step). ' +
      '(9a) INSERT straight after the complete scene: walk = corvin → s24-home-corvin (the lantern comes back lit). ' +
      '(10) LATER: with s18Done, s24-lecture plays the first time the player visits the museum after s24Done ' +
      '(Fairweather’s lecture; Professor Delve hangs the plaque). Without s18Done, Fairweather is simply a resident. ' +
      'KEPT-STONE NUBBIN (line variants). With keptStone, the Grove’s Nubbins are stilled (end-collector-kept), so your ' +
      'Nubbin walks, it does not run. Replace these lines, in every scene that has them: “Your Nubbin runs to her, then back ' +
      'to you, then to her again, to check you are both still there.” → “Your Nubbin goes and sits by her, grey and quiet, ' +
      'and doesn’t move again until you do.” (every s24-tea* scene). s24-pack: “Your Nubbin is already halfway up the first ' +
      'stretch of scree, looking back to see why you are all so slow.” → “Your Nubbin waits at the foot of the scree, quite ' +
      'still, until you start. Then it climbs at your heel.” s24-falls-top: “Your Nubbin finds the dry ones. It runs up, ' +
      'waits on each, runs back to you, and goes up again.” → “Your Nubbin finds the dry ones, slowly, and waits on each ' +
      'until you catch up.” s24-tracks: “runs from one to the next” → “walks from one to the next”. s24-rock: “Your Nubbin ' +
      'is off up the ridge into the dark before you can call it. A moment later it comes back, calm, and sits at your ' +
      'feet.” → “Your Nubbin goes a little way up the ridge into the dark, slowly, and comes back calm, and sits at your ' +
      'feet.” s24-whistle: “Your Nubbin runs ahead into the dark, and back, and ahead, as if it is pulling you along on a ' +
      'string.” → “Your Nubbin walks ahead into the dark, slowly, and waits for the lantern at every turn.” ' +
      'WILD GROVE (letThemGo). No line here says the gate sticks; Hazel’s back pages mention “who came to the gate” in the ' +
      'past, before it came off its hinges, so no variant is needed. ' +
      'HAZEL’S MARGIN NOTES (Tier 2, data for the Atlas). From s24-home on (s24Done), every Atlas page shows one margin ' +
      'note in Hazel’s faint pencil beside the named quest’s scene. The Atlas reads s24Done read-only and never writes. ' +
      'In the fiction they were always there, written while Nova walked the valley, and Hazel’s lantern is what showed ' +
      'them; in play they simply show once s24Done is set (no need to light anything). Two notes are not S24’s and show ' +
      'earlier, once chapter 12’s finalChoice is done: A11’s last page (beside Galleons Lap) and A14’s Argos page (with ' +
      'Corvin’s “I came back. C.” under it when corvinGate = family). S24 leaves those two as they are and adds no second ' +
      'note to A11 or A14. The other twenty-nine, one per page (A18, A20 and A24–A31 are as their own outlines give them): ' +
      'A1 The Brothers’ Bargain, Q20 Equivalent Exchange: “He gave up the thing he was best at to bring his brother home. ' +
      'Cheap at the price. H.” ' +
      'A2 The Monkey and the Monk, Q5 Under the Mountain: “Five hundred years under a mountain and still cheeky. I’ve had ' +
      'Nubbins like that. H.” ' +
      'A3 Forty-Nine Days, Q12 The Dream: “His mother forgave him before he asked. They mostly do. That’s the hard part. H.” ' +
      'A4 The Waterfall Prince, Q2 The Climb: “Fell off that waterfall forty times and went up again. Slow hands. Well. ' +
      'Slow-ish. H.” ' +
      'A5 The Lion of Mali, Q4 The Iron Rod: “Seven years on the floor while they laughed. Then he stood up and bent iron. ' +
      'Never hurry a slow one. H.” ' +
      'A6 Seven Voyages, Q1 Two Sinbads: “Seven voyages, and he still came home to tell it to a porter. Somebody has to ' +
      'stay put and listen. I volunteer. H.” ' +
      'A7 The Marigold Bridge, Q12 Remember: “Somebody sang to Mamá Coco and she came back for a minute. Sing to your old ' +
      'ones. They’re still in there. H.” ' +
      'A8 The Twelve Tasks, Q9 The Place That Sends You Mad: “Ha. Typical. Try asking the parish council for a gate hinge. H.” ' +
      'A9 The Comet, Q11 The Cave: “She packed everything important into the cave. I’d have packed the kettle and the lot ' +
      'of you. H.” ' +
      'A10 The Heart of the Island, Q5 Setting Sail: “The grandmother goes first and tells her to go. That’s the right way ' +
      'round. Go on, then. H.” ' +
      'A12 The Mirror Shard, Q16 Gerda’s Tears: “Warm him up first. Tell him off after. In that order. H.” ' +
      'A13 The Wooden Boy, Q19 The Terrible Dog-fish: “Two years inside a fish, and he kept a light going for the boy. ' +
      'That’s a father. H.” ' +
      'A15 The Humbug, Q14 The Humbug: “A humbug, but he gave them what they had already. Most of us manage less. H.” ' +
      'A16 The Fox and the Rose, Q13 The Fox: “Sit a little nearer every day and say nothing. The fox and I would have got ' +
      'on. H.” ' +
      'A17 The Camphor Tree, Q10 The Seeds: “Plant it and wait. Nothing comes up. Wait anyway. That’s most of gardening ' +
      'and all of the rest. H.” ' +
      'A18 The Doll in the Pocket, beside the cellar scene: “Feed them first. Somebody’s mother said it before I did. H.” ' +
      'A19 The Dragon Who Fell, Q7 The Knife: “I’d have fed the dragon. Oh. He did. Good lad. H.” ' +
      'A20 The Weeping, beside the cave: “Everything wept but one. Don’t hate her for it. Feel sorry for her. H.” ' +
      'A21 The Flower Field, Q2 The Funeral: “Fifty years with him, and she wished she’d looked properly. Look at them ' +
      'properly. H.” ' +
      'A22 The Candle, Q14 The River: “Abuela sat down by the river and stopped being right. Took her long enough. Took ' +
      'me longer. H.” ' +
      'A23 Remember Who You Are, Q14 Look Harder: “He saw his father in the pool. They stay, you know. In the face. ' +
      'Usually the chin. H.” ' +
      'A24 The Law of the Jungle, beside Kotick: “Safe beach first. Then a well one. He found both. H.” ' +
      'A25 The Nothing, where its outline places it: “Never went. Read it twice. You lose a bit of yourself with every ' +
      'wish. I’d have printed that on the cover.” ' +
      'A26 The Wall of Uruk, beside the snake: “Lost the plant. Kept the wall. Good trade. H.” ' +
      'A27 The White-Haired Prince, beside the nest: “White hair at birth. I’d have kept him. H.” ' +
      'A28 The Box of Stories, where its outline places it: “Nova says here they tell you it isn’t true before they ' +
      'start. Best manners I ever heard of.” ' +
      'A29 The Honmoon, where its outline places it: “Never been. Nova says it’s all singing. I’d hum.” ' +
      'A30 The Word on the Brow, where its outline places it: “Clay, a word, and a man who forgot one Friday. I’d have ' +
      'forgotten every Friday.” ' +
      'A31 The Hero Twins, where its outline places it: “Two boys who beat Death by being cheeky to it. My kind of boys.” ' +
      'The two in s24-home (“I’d have fed the dragon.”, “Ha. Typical.”) are A19’s and A8’s, so they must match. Notes on ' +
      'teen pages (A1, A3, A4) show only where those pages can be opened. ' +
      'THE LAST PAGE. A new last page in the atlas item, blank but for the line chosen in step 15 (s24-page: shelf → “The ' +
      'Sunrise Shelf, again. Take someone.”; tea → “Wherever Nova goes next. Tea after.”; here → “Here. Every morning.”), ' +
      'in pencil. ' +
      'SIM. (a) Post-game seasons: the trigger needs the first spring after chapter 12; if post-game time has no seasons, ' +
      'offer S24 from the first post-game morning. (b) The ending id is read from the campaign state (CampaignState.ending, ' +
      'set when the ending plays). (c) The atlas item gains the margin-note layer and the last page (above). (d) The ' +
      'Sunrise Shelf is a new viewpoint section on the far ridge, reached by the falls path. (e) Augusta Fairweather ' +
      'becomes a resident NPC in the cottage at the foot of the falls path, with idle lines about the ridge; never about ' +
      'the bird’s nest’s whereabouts. (f) Ambient only, no reward: from the next spring on, the tall striped bird brings ' +
      'her chicks to the Grove pond for a few spring days (seen, never caught or fed by command). (g) If s10Done is ' +
      'false, the player may not own Hazel’s lantern decor (S10’s reward); stage the lantern on its hook anyway for this ' +
      'story, and leave it there afterwards as staging only. (h) The tall bird and her chicks are wild: no Nubbin or ' +
      'critter interactions, no capture, never a pet. ' +
      'STAGING. Hazel’s lantern is the one warm light from step 9 to step 14; the ridge is blue-grey. Tilly’s whistle is ' +
      'S14’s two-finger supper call SFX; it repeats about every 20 seconds from s24-rock until the nest. The cairn stays ' +
      'visible behind you on the climb to the nest. At the Shelf, the sunrise reaches places in the order the narration ' +
      'names them. Moss on your shoulder (walk = moss) dozes; Sable (walk = sable) keeps two steps ahead and waits at bends. ' +
      'REWARDS at s24-home: the margin notes and the last page (atlas features), the Sunrise Shelf viewpoint, the ' +
      'pencil-stub badge (coat cosmetic), the ridge cairn decoration and the striped-feather hat. Each is given once. ' +
      'LEARNING GROVE. Yes: both bands, to be written in the edu side-story files (map-reading and finding east for ' +
      'sunrise; why we don’t cage wild birds, and how nesting works; keeping a memory book for someone; old people were ' +
      'young once, with lists of their own). The two quoted lines use childLines here.',
  },
];

// ================================================================== variant scenes
/** Branch scenes and inserts. Each one's rule is in the quest's notes (VARIANTS). */
export const SIDE_STORY_S24_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- (1) step 1 scene, by walk
  {
    id: 's24-tea-moss',
    lines: [
      ...TEA_OPEN,
      TEA_SIT,
      N(
        'Moss is on the flat stone by the path, where he always sits. He watches Nova sit down, and then he climbs your leg, slowly.',
      ),
      M('I’m coming. Wherever this is going.', 'think'),
      M('Don’t look like that. I’ve decided.', 'soft'),
      N('He settles on your shoulder, light as a hat, and shuts his eyes.'),
      NO('Is he asleep on you? I tried for four winters.', 'think'),
      TEA_RUN,
      ...TEA_CLOSE,
    ],
  },
  {
    id: 's24-tea-moss-stayed',
    lines: [
      ...TEA_OPEN,
      N(
        'Beside Hazel’s flower, so close the two of them lean together, is a small grey-green one by the flat stone where Moss always sat.',
      ),
      N(
        'There is just room between them for one person, if she tucks her knees up. Nova does, pack and all.',
      ),
      NO('Both of you. Right. I’ll sit in the middle and not take sides.', 'sad'),
      TEA_RUN,
      ...TEA_CLOSE,
    ],
  },
  {
    id: 's24-tea-sable',
    lines: [
      ...TEA_OPEN,
      TEA_SIT,
      N(
        'Sable comes up the path behind you and sits down two steps from Nova, facing the far ridge.',
      ),
      NO('Hello, grey one. That’s where I came from. Are you thinking of going?', 'soft'),
      N('Sable says nothing. Her ears stay up.'),
      TEA_RUN,
      ...TEA_CLOSE,
    ],
  },
  // ---------------------------------------------------------------- (1a) insert after step 1 scene: keptStone, walk not moss
  {
    id: 's24-moss-kept',
    lines: [
      N(
        'Higher up, on the crown of the hill, Moss sits with his back to the Grove, the way he has sat since the Long Night.',
      ),
      NO('Hello, Moss.', 'soft'),
      N(
        'He doesn’t turn round. After a while Nova stops waiting for him to, and looks at the flower instead.',
      ),
    ],
  },
  // ---------------------------------------------------------------- (2) step 3 scene: walk = corvin
  {
    id: 's24-lantern-corvin',
    lines: [
      ...LANTERN_ASK,
      N(
        'It is Sunday, so Corvin is by the pond, saying nothing, badly. He gets up when he sees where you are looking.',
      ),
      N(
        'Hazel’s lantern hangs on the hook by the cottage door. He takes it down before you can, the way he does every Sunday.',
      ),
      N(
        'He trims the wick with a penknife. His hands are steady now; he takes a long time about it, and doesn’t apologise.',
      ),
      C('The far ridge. For the sunrise.', 'think'),
      N('He holds it out to you. When you take hold of it, he doesn’t let go straight away.'),
      C('Bring it back lit.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- (3) step 4 scene: s14Done
  {
    id: 's24-stowaway-knows',
    lines: [
      ...STOW_OPEN,
      N(
        'Then the tarp lifts, and a girl in big wellies, with a sash of home-made badges, sits up among the sacks and points at you.',
      ),
      TI('It’s you. From Keeps & Critters. You sat next to the dragon.', 'happy'),
      ...STOW_LAW,
      N(
        'Sparks comes down the lane at a run, waving both arms, and slows right down when she sees who Tilly has found.',
      ),
      SP(
        'Oh, it’s YOU. Fine. Good. Take her. Bring her back with the same number of wellies.',
        'happy',
      ),
    ],
  },
  // ---------------------------------------------------------------- (4) inserts before s24-pack, by ending
  {
    id: 's24-bun-moss',
    lines: [
      N(
        'Before the cart goes, Nova climbs back up the hill on her own, with one of Fern’s lantern buns.',
      ),
      N(
        'She puts it on the flat stone where Moss always sat, by his flower, and stands there a moment with her hands in her pockets.',
      ),
      NO(
        'He told me once I walked like someone being chased. I said I was. He said, “By what?” I never answered.',
        'soft',
      ),
      NO('I’ll tell him when I get back.'),
    ],
  },
  {
    id: 's24-eternal-watch',
    lines: [
      N(
        'On the western hill your Eternal sits where it always sits, and watches the cart go, very carefully.',
      ),
      N('It doesn’t follow, and it doesn’t need to. It already knows which way you’ll come home.'),
    ],
  },
  // ---------------------------------------------------------------- (5) step 6 scene: collector
  birdScene('s24-bird-collector', 'sold'),
  birdScene('s24-bird-collector-kept', 'kept'),
  // ---------------------------------------------------------------- (6) step 12 done
  nestScene('s24-nest-waited', 'waited'),
  nestScene('s24-nest-fed-collector', 'fed-collector'),
  nestScene('s24-nest-waited-collector', 'waited-collector'),
  // ---------------------------------------------------------------- (7) step 14 done
  lightsScene('s24-lights-told', true, false),
  lightsScene('s24-lights-kept', false, true),
  lightsScene('s24-lights-told-kept', true, true),
  // ---------------------------------------------------------------- (7a) inserts after step 14 done, by walk
  {
    id: 's24-shelf-moss',
    lines: [
      N(
        'Moss has slept on your shoulder most of the way up. He wakes now, and looks for a long time without saying anything.',
      ),
      M(
        'Forty years I sat on that hill and looked at this ridge. I never once thought to look back the other way.',
        'soft',
      ),
      M('She’d have liked it. She’d have talked all the way through it.', 'happy'),
    ],
  },
  {
    id: 's24-shelf-sable',
    lines: [
      N('Sable has walked two steps ahead of you the whole way up, waiting at every bend.'),
      N(
        'Now she sits at the very edge of the Shelf, facing the Grove, and the sun comes up on her too.',
      ),
      N('She stays grey. She looks warm anyway.'),
    ],
  },
  // ---------------------------------------------------------------- (8) step 15 scene, by s24-cairn
  tickScene('s24-tick-scarf', 'scarf'),
  tickScene('s24-tick-book', 'book'),
  // ---------------------------------------------------------------- (9) complete: eternal-dawn
  { id: 's24-home-eternal', lines: [...HOME_OPEN, HOME_ETERNAL, ...HOME_CLOSE] },
  // ---------------------------------------------------------------- (9a) insert after complete: walk = corvin
  {
    id: 's24-home-corvin',
    lines: [
      N(
        'Corvin is by the pond when you come in, though it isn’t Sunday. He looks at the lantern, lit in broad daylight.',
      ),
      C('Good.', 'soft'),
      N('He hangs it back on its hook himself, and doesn’t trim the wick. It doesn’t need it.'),
    ],
  },
  // ---------------------------------------------------------------- (10) later, at the museum: s18Done
  {
    id: 's24-lecture',
    lines: [
      N(
        'The museum is full, which it never is. Somebody has put out every chair, and some of the Nubbins have brought their own.',
      ),
      DE(
        'A lecture. Every plaque in this museum must be true. This one has taken fifty years to become so.',
        'happy',
      ),
      AU(
        'I was called a liar. I have been wrong about a great many things. I was not wrong about the bird.',
        'think',
      ),
      AU(
        'I shan’t tell you where she nests. That is the whole of the lecture. Thank you.',
        'happy',
      ),
      N(
        'Professor Delve hangs the new plaque himself, on tiptoe, with his spectacles on the end of his nose.',
      ),
      DE(
        '“A tall striped bird nests on the far ridge. Augusta Fairweather saw it first. She was right.”',
      ),
      DE('True. Entirely true. I checked.', 'soft'),
      N(
        'Everyone claps. Fairweather sits down rather suddenly, and doesn’t say anything for a while.',
      ),
    ],
  },
];

/** Every flag this story sets or reads. */
export const SIDE_STORY_S24_FLAGS: string[] = [
  // set
  's24-bird', // fed | waited (step 6, s24-bird*); picks s24-nest-fed / -waited (and the -collector pair)
  's24-cage', // argue | sit (step 8, s24-cage); Fairweather answers it at s24-proof (choice-payoffs)
  's24-cairn', // cup | scarf | book (step 11, s24-cairn); picks s24-tick / -scarf / -book
  's24-page', // shelf | tea | here (step 15, s24-tick*); the first line on the atlas's last page
  's24Done', // on completion; the Atlas reads it (read-only) to show Hazel's margin notes
  // read
  'walk', // you | moss | sable | corvin | unset (S10): s24-tea-*, s24-lantern-corvin, s24-shelf-*, s24-home-corvin
  'hazel', // told | secret | unset (S10): s24-lights-told*
  'ending', // the campaign ending id (CampaignState.ending): collector, moss-sleeps, eternal-dawn variants
  'keptStone', // with walk = moss (stayed or came down), the cold hands, the flickering post, the stilled Nubbin
  's14Done', // s24-stowaway-knows
  's18Done', // s24-lecture
];

export const SIDE_STORY_S24_CHECKS: string[] = [
  'sit:s24-hill:hazels-flower',
  'inspect:s24-atlas:first-pages',
  'collect:s24-hazels-lantern',
  'find:s24-tilly:carrier-cart',
  'climb:s24-falls-scree',
  'choose:s24-tall-bird:feed-or-wait',
  'visit:s24-fairweather-camp',
  'watch:s24-ridge:dusk',
  'give:s24-nova:hazels-lantern',
  'wait:s24-nova:as-long-as-it-takes',
  'build:s24-cairn',
  'find:s24-tilly:nest',
  'puzzle:s24-net:untangle',
  'place:s24-hazels-lantern:sunrise-shelf',
  'craft:s24-atlas:last-page',
];
