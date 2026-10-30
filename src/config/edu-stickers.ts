/**
 * R0685 (KIDS-17): the Learning Grove's sticker book. Sixty stickers on six pages, earned in
 * this fixed order (one every `EDU.starsPerSticker` stars), so there are no random draws and
 * nothing to gamble on. A save's sticker count is how many it owns: the first N of this list,
 * so an old save's count already names its stickers.
 * `icon` is drawn as chunky pixels on the sticker's die-cut backing; a Nubbins-page sticker
 * with a `clip` draws the child's own Nubbin in that pose instead.
 */
export interface EduSticker {
  id: string;
  /** Said when the child taps it (sprout band, 14 words at most). */
  say: string;
  icon: string;
  /** A Nubbins-page sticker: the child's Nubbin in this sprite clip. */
  clip?: string;
  bg: string;
  shape: 'round' | 'star' | 'heart' | 'square';
}

export interface EduStickerPage {
  id: string;
  icon: string;
  title: string;
}

export const EDU_STICKER_PAGES: readonly EduStickerPage[] = [
  { id: 'grove', icon: '🌳', title: 'The Grove' },
  { id: 'animals', icon: '🐾', title: 'Animals' },
  { id: 'shapes', icon: '🔷', title: 'Shapes and colours' },
  { id: 'letters', icon: '🔤', title: 'Letters' },
  { id: 'friends', icon: '💌', title: 'Ori and Hana' },
  { id: 'nubbins', icon: '🥚', title: 'Nubbins' },
];

type Row = [icon: string, say: string, bg: string, shape?: EduSticker['shape'], clip?: string];

const page = (id: string, rows: Row[]): EduSticker[] =>
  rows.map(([icon, say, bg, shape, clip], i) => ({
    id: `${id}-${i + 1}`,
    icon,
    say,
    bg,
    shape: shape ?? 'round',
    ...(clip ? { clip } : {}),
  }));

const PAGES: Record<string, EduSticker[]> = {
  grove: page('grove', [
    ['🍎', 'A shiny red apple!', '#ffd9d2'],
    ['🌳', 'A big green tree.', '#d6f2cf', 'square'],
    ['🍃', 'A leaf, floating down.', '#e4f7d2', 'heart'],
    ['💧', 'Drip, drop! A drop of water.', '#d4ecff'],
    ['🌻', 'A sunflower, tall and yellow.', '#fff2b8', 'star'],
    ['🐚', 'A shell from the pond.', '#ffe9dc'],
    ['🍄', 'A spotty mushroom.', '#ffe0e0', 'square'],
    ['🌈', 'A rainbow after the rain!', '#eaf1ff', 'heart'],
    ['🏡', 'Our cosy cottage.', '#fbe8cf'],
    ['🌙', 'The moon, saying goodnight.', '#e2dcff', 'star'],
  ]),
  animals: page('animals', [
    ['🐸', 'A frog! Ribbit, ribbit.', '#d6f2cf'],
    ['🦆', 'A duck. Quack, quack!', '#fff2b8', 'heart'],
    ['🐝', 'A busy bee. Buzz!', '#fff0c4', 'star'],
    ['🐟', 'A fish. Splash!', '#d4ecff'],
    ['🦉', 'An owl. Hoo, hoo!', '#ece2d6', 'square'],
    ['🐮', 'A cow. Moo!', '#f2f2f2'],
    ['🐷', 'A pig. Oink, oink!', '#ffe0ea', 'heart'],
    ['🐞', 'A ladybird with spots.', '#ffd9d2', 'star'],
    ['🐢', 'A slow, slow tortoise.', '#e4f7d2'],
    ['🦋', 'A butterfly. Flutter, flutter.', '#f3e3ff', 'square'],
  ]),
  shapes: page('shapes', [
    ['🔴', 'A red circle.', '#ffe9e6'],
    ['🟦', 'A blue square.', '#e3eeff', 'square'],
    ['🔺', 'A triangle with three sides.', '#ffeede', 'star'],
    ['⭐', 'A yellow star!', '#fff6c8', 'star'],
    ['💚', 'A green heart.', '#e2f7dc', 'heart'],
    ['🟣', 'A purple circle.', '#f0e3ff'],
    ['🔶', 'An orange diamond.', '#fff0dd', 'square'],
    ['🟫', 'A brown square.', '#f3e6d8', 'square'],
    ['🩷', 'A pink heart.', '#ffe6f1', 'heart'],
    ['⚪', 'A white circle.', '#eceaf2'],
  ]),
  letters: page('letters', [
    ['A', 'A is for apple.', '#ffe0e0'],
    ['B', 'B is for bee.', '#fff2b8', 'square'],
    ['C', 'C is for cat.', '#e3eeff', 'heart'],
    ['D', 'D is for duck.', '#e4f7d2', 'star'],
    ['M', 'M is for moon.', '#e2dcff'],
    ['S', 'S is for sun.', '#fff6c8', 'square'],
    ['O', 'O is for owl.', '#ece2d6', 'heart'],
    ['F', 'F is for frog.', '#d6f2cf', 'star'],
    ['N', 'N is for nest.', '#fbe8cf'],
    ['Z', 'Z is for zebra.', '#eceaf2', 'square'],
  ]),
  friends: page('friends', [
    ['💌', 'A letter from Ori and Hana!', '#ffe6f1', 'heart'],
    ['🌸', 'A cherry blossom from Hana.', '#ffe6f1'],
    ['🍊', 'An orange from Ori.', '#fff0dd', 'square'],
    ['🎏', 'A fish kite, flying high.', '#e3eeff', 'star'],
    ['🫒', 'An olive branch from Ori.', '#e4f7d2'],
    ['🍙', 'A rice ball for lunch.', '#f2f2f2', 'heart'],
    ['🐫', 'A camel. Plod, plod, plod.', '#fbe8cf', 'square'],
    ['🗻', 'A tall mountain with snow on top.', '#eaf1ff', 'star'],
    ['🌊', 'A big wave. Whoosh!', '#d4ecff'],
    ['📮', 'A postcard, just for you.', '#fff6c8', 'heart'],
  ]),
  nubbins: page('nubbins', [
    ['🥚', 'An egg! Who is inside?', '#fff6c8'],
    ['😊', 'Your Nubbin, happy!', '#ffe6f1', 'heart', 'happy'],
    ['😴', 'Your Nubbin, fast asleep.', '#e2dcff', 'star', 'sleep'],
    ['🍎', 'Your Nubbin, having a snack. Munch!', '#ffd9d2', 'round', 'eat'],
    ['💖', 'Your Nubbin, giving a cuddle.', '#ffe0ea', 'heart', 'love'],
    ['🚶', 'Your Nubbin, going for a walk.', '#e4f7d2', 'square', 'walk'],
    ['😢', 'Your Nubbin feels sad. Give it a pat!', '#e3eeff', 'round', 'sad'],
    ['🙃', 'Your Nubbin, tumbling over! Oops!', '#fff0dd', 'star', 'tumble'],
    ['🏊', 'Your Nubbin, splashing in the pond.', '#d4ecff', 'round', 'swim'],
    ['🌟', 'Your Nubbin, a little star!', '#fff6c8', 'star', 'idle'],
  ]),
};

/**
 * The sixty stickers, in the order they are earned. The pages are interleaved so the first
 * stickers come from every page: the Grove's first, then the Animals' first, and so on.
 */
export const EDU_STICKERS: readonly EduSticker[] = (() => {
  const out: EduSticker[] = [];
  for (let i = 0; i < 10; i++) for (const p of EDU_STICKER_PAGES) out.push(PAGES[p.id]![i]!);
  return out;
})();

/** Which page a sticker is on. */
export function stickerPage(id: string): string {
  return id.slice(0, id.lastIndexOf('-'));
}

/** The stickers a save owns: the first `count` of the list. */
export function ownedStickers(count: number): readonly EduSticker[] {
  return EDU_STICKERS.slice(0, Math.max(0, Math.min(EDU_STICKERS.length, Math.floor(count))));
}

/** The stickers on one page, in place order (10 a page). */
export function pageStickers(pageId: string): readonly EduSticker[] {
  return PAGES[pageId] ?? [];
}
