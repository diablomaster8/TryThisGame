/**
 * R0318 (FUN-29): the tips shown while something loads (the veil, the race and Expedition
 * stages). A third are jokes, a third real how-tos, a third lore. Each may be gated: a
 * chapter of Hazel's Grove it waits for (no spoilers), the bands it suits (main and reader
 * by default; sprout only when listed), and the Mature content level it needs.
 */
export type TipKind = 'joke' | 'howto' | 'lore';
export type TipBand = 'main' | 'reader' | 'sprout';

export interface Tip {
  text: string;
  kind: TipKind;
  /** Hazel's Grove chapter the player must have reached. */
  minChapter?: number;
  /** Bands it is shown in; default main and reader. */
  bands?: readonly TipBand[];
  /** Mature content level it needs (default none). */
  mature?: 'teen' | 'adult';
}

const ALL: readonly TipBand[] = ['main', 'reader', 'sprout'];

export const TIPS: readonly Tip[] = [
  // Jokes.
  { kind: 'joke', text: 'Rule two is never, ever throw one. There is no rule about catching.' },
  { kind: 'joke', text: 'Shake a tree to hurry the fruit. Stand somewhere else first.' },
  { kind: 'joke', text: 'Hold an egg and shake it gently. It’s had worse.' },
  { kind: 'joke', text: 'Moss is older than the trees. He is also smugger.', minChapter: 4 },
  { kind: 'joke', text: 'Fern’s stone has been on the signpost longer than the signpost.' },
  {
    kind: 'joke',
    text: 'Byte owns four stopwatches. One is for timing the others.',
    minChapter: 5,
  },
  {
    kind: 'joke',
    text: 'Sparks has lit every lantern in the valley. Some of them on purpose.',
    minChapter: 2,
  },
  { kind: 'joke', text: 'A Nubbin that falls asleep mid-step will finish the step tomorrow.' },
  { kind: 'joke', text: 'The pond has never done anything. Your Nubbins watch it anyway.' },
  { kind: 'joke', text: 'Fruit landing on a head counts as a delivery.' },
  {
    kind: 'joke',
    text: 'Marina says rule four is “don’t be Sparks”. Sparks disagrees.',
    minChapter: 3,
  },
  {
    kind: 'joke',
    text: 'Clover’s scarf is longer than it was yesterday. Nobody has asked.',
    minChapter: 3,
  },
  {
    kind: 'joke',
    text: 'Ember has lost to the scarecrow again. The scarecrow is not gloating.',
    minChapter: 6,
  },
  {
    kind: 'joke',
    text: 'Nova’s map is upside down. She says the valley is the wrong way up.',
    minChapter: 8,
  },
  { kind: 'joke', text: 'A Nubbin can nap anywhere. It has proved this on your foot.' },
  { kind: 'joke', text: 'High fives that miss still count. Ask anyone small.' },
  {
    kind: 'joke',
    text: 'Luna sleeps on the bench all day. The bench is used to it.',
    minChapter: 7,
  },
  {
    kind: 'joke',
    text: 'Dusty has found another ancient spoon. It looks like a spoon.',
    minChapter: 5,
  },
  {
    kind: 'joke',
    text: 'Pixel’s little robot has wandered off again. It always comes back.',
    minChapter: 6,
  },
  { kind: 'joke', text: 'Squeak! A Nubbin tapped eight times will sneeze.', bands: ALL },
  // How-tos.
  { kind: 'howto', text: 'Tap a Nubbin to open its sheet: Pet, Carry, Feed and its needs.' },
  { kind: 'howto', text: 'Petting gives happiness and affection. Throwing takes both away.' },
  { kind: 'howto', text: 'A drooping leaf means hungry. A spiral means sad or dizzy.' },
  { kind: 'howto', text: 'Critters and essences shape what a child grows into.' },
  {
    kind: 'howto',
    text: 'Expeditions bring back Shells, essences and critters. Hitting things only costs Shells.',
  },
  { kind: 'howto', text: 'Cheer in a race for a small burst of speed, once every few seconds.' },
  { kind: 'howto', text: 'Q and E turn the camera on a keyboard; two fingers turn it on a phone.' },
  { kind: 'howto', text: 'Pinch or scroll to zoom. There are two zoom levels.' },
  { kind: 'howto', text: 'Hold an egg and shake it to hatch it sooner.' },
  { kind: 'howto', text: 'Rain is no fun for a Nubbin out in it. A tree is a good umbrella.' },
  { kind: 'howto', text: 'Switch Keepers to lean a Nubbin toward Sun or Moon.' },
  { kind: 'howto', text: 'Settings decides how much time passes while the game is closed.' },
  { kind: 'howto', text: 'A Nubbin that is happy and loved is reborn instead of leaving.' },
  { kind: 'howto', text: 'Tap a Keeper to say hello. They usually have something to say.' },
  { kind: 'howto', text: 'Tap Fern’s stone by the signpost. It has a lot to say, for a stone.' },
  { kind: 'howto', text: 'Feed by hand: tap a tree, tap the fruit, then tap a Nubbin and Feed.' },
  { kind: 'howto', text: 'The Journal keeps your goal, your stories and what you have found.' },
  { kind: 'howto', text: 'Pet a Nubbin! It likes that.', bands: ALL },
  { kind: 'howto', text: 'Shake a tree. Plop! Fruit!', bands: ALL },
  { kind: 'howto', text: 'Sleepy Nubbins need a quiet nap. Shh!', bands: ALL },
  // Lore.
  {
    kind: 'lore',
    text: 'Hazel left one cup turned upside down by the stove. For whoever came next.',
  },
  { kind: 'lore', text: 'The gate has always stuck. Lift and push.' },
  {
    kind: 'lore',
    text: 'Hazel’s three rules were never written down. Everyone knows them anyway.',
  },
  { kind: 'lore', text: 'The eggshells on the windowsill each have a date in pencil.' },
  {
    kind: 'lore',
    text: 'Four lanterns stand round the Grove: pond, stream, wall and long grass.',
    minChapter: 2,
  },
  {
    kind: 'lore',
    text: 'Moss sat beside young Hazel a whole winter before he said a word.',
    minChapter: 4,
  },
  { kind: 'lore', text: 'At the thaw, Moss said two words to Hazel: “You’ll do.”', minChapter: 4 },
  { kind: 'lore', text: 'The first flower on the hill was Briar’s.', minChapter: 6 },
  { kind: 'lore', text: 'Grey Nubbins are not broken. They are waiting.', minChapter: 3 },
  {
    kind: 'lore',
    text: 'The Lantern Song has a chorus everybody knows. Nobody remembers learning it.',
    minChapter: 4,
  },
  { kind: 'lore', text: 'The pear tree was Hazel’s first. Fern talks to it.', minChapter: 2 },
  {
    kind: 'lore',
    text: 'Corvin first came to the gate long before he came back to it.',
    minChapter: 9,
  },
  { kind: 'lore', text: 'Nubbins don’t speak. They have never needed to.' },
  { kind: 'lore', text: 'Slow hands, Hazel said. Patience is a kind of strength.' },
  {
    kind: 'lore',
    text: 'Every Keeper in the valley learned something from Hazel. Ask them what.',
    minChapter: 2,
  },
  {
    kind: 'lore',
    text: 'The Hollow Below is older than the Grove. It is also damper.',
    minChapter: 5,
  },
  {
    kind: 'lore',
    text: 'Hazel’s Grove has a gate, a pond, a hill and a great many opinions.',
  },
  { kind: 'lore', text: 'Gran’s gate goes creak!', bands: ['sprout'] },
  { kind: 'lore', text: 'The pond goes plop!', bands: ['sprout'] },
  { kind: 'lore', text: 'Gran grew lots of trees. Munch!', bands: ['sprout'] },
];
