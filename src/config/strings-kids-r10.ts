/**
 * Lane E r10 (kids UI): player-facing text for the Learning Grove's round-10 screens.
 * Re-exported from `strings.ts` like the other lane files.
 */
export const KIDS_R10_TEXT = {
  /** R0735: the reader age select's first option, before a grown-up picks one. */
  readerAgeUnset: '7–10',
  /** R0679: the sprout HUD's grown-ups corner tab. */
  cornerLabel: 'Grown-ups (hold to open)',
  cornerHint: 'Grown-ups: press and hold',
  cornerHold: 'Hold',
  /** R0696: the grown-up area's tag rows. */
  tagAnimal: 'Animal',
  tagColour: 'Colour',
  tagNone: 'None',
  /** R0679: the sprout HUD's spoken one-time tutorial, one line per step. */
  tutorial: {
    walk: 'Tap the grass, and you walk there.',
    pet: 'Tap your Nubbin to say hello.',
    story: 'The book is for stories.',
    play: 'The paints are for games.',
    nubbins: 'The little chick shows all your Nubbins.',
    places: 'The map takes you to places.',
  },
  /** R0700: the do beats' spoken instructions and buttons (ui/do-beats.ts). */
  beats: {
    count: (thing: string, n: number) => `Tap each of the ${n} ${thing} to count them.`,
    countThing: 'things',
    counted: (n: number) => `${n}! All counted.`,
    sort: 'Put each one in the basket with the same name.',
    sortPick: (word: string) => `Now tap the ${word} basket.`,
    sorted: 'All sorted. Well done!',
    order: 'Tap them in order, first to last.',
    orderNext: (word: string) => `Next, ${word}.`,
    ordered: 'All in order!',
    paint: (colour: string) => `Tap each plank to paint it ${colour}.`,
    painted: 'What a lovely fence!',
    draw: (thing: string) => (thing ? `Draw ${thing} with your finger.` : 'Draw with your finger.'),
    drawWait: 'Keep drawing…',
    showNubbin: 'Show my Nubbin',
    shown: 'Your Nubbin looks, and wiggles all over. It loves it!',
    clear: 'Start again',
    findColour: (colour: string) => `Find ${colour}. Tap it!`,
    findHidden: (thing: string) => `Something is hiding: ${thing}. Tap the bushes to find it.`,
    found: 'Found it!',
    say: 'Your turn! Say it out loud.',
    sayWait: 'Your turn…',
    done: 'All done!',
  },
  /** R0700: the screen-reader names of a beat's pieces. */
  beatLabels: {
    token: (i: number) => `Number ${i}`,
    basket: (word: string) => `${word} basket`,
    plank: (i: number) => `Plank ${i}`,
    bush: (i: number) => `Bush ${i}`,
    canvas: 'Drawing space',
  },
  /** R0705: Nova's postcard around the friends' faces (ui/postcard-faces.ts). */
  postcard: {
    meet: (name: string) => `Meet ${name}`,
    visit: (name: string) => `Visit ${name}`,
    hello: 'Hello!',
    helloLabel: (name: string) => `Hear ${name} say hello`,
    stamps: (done: number, of: number) => `Stamps: ${done} of ${of}`,
    words: 'Words',
    say: 'Nova writes: two friends of mine are coming to the valley. Ori speaks Hebrew, and Hana speaks Japanese. Who would you like to meet first?',
  },
} as const;
