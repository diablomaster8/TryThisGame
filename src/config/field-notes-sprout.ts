/**
 * FUN-69 (R0358): the sprout band's field notes. One short line per collection entry (eight
 * words or fewer, plain words, read aloud by a grown-up). Most are the first sentence of
 * Hazel's own note (`fieldNote`); the ones whose first sentence runs long have their own line
 * here. Our own names only, never the inspiration's.
 */
const OWN: Record<string, string> = {
  'chao:neutral:fly': 'Flaps first, then walks. Whoops!',
  'chao:neutral:run': 'Always off somewhere else already.',
  'chao:sun:run': 'Runs to you, then runs a victory lap.',
  'chao:sun:power': 'Lifts big things. Wants a hug after.',
  'chao:moon:swim': 'Loves the deep end. And biscuits.',
  'chao:moon:run': 'Fast and quiet. Gone before you look.',
  'chao:eternal:neutral': 'Sits in the middle, happy as can be.',
  puffle: 'Sings you to sleep. Then sulks.',
  pufflow: 'So soft, you nod off leaning on it.',
  scrapper: 'Wants a friendly fight. After tea.',
  spinmaster: 'Spins on its head when bored.',
  frostdiva: 'Sways when it walks, like music.',
  droplet: 'Bounces on its tail like a ball.',
  skyfang: 'Very old, very fast, and always hungry.',
  lilystalk: 'Sways in the shallows with its friends.',
  lilyking: 'Holds the rock and will not budge.',
  leafgrub: 'Eats a leaf, then naps. Proud!',
  spearbeak: 'Long beak, long neck, loves snacks.',
  coilet: 'Curls up in the sun. Hiss!',
  hoodcoil: 'Its hood looks like a face.',
  thornbelle: 'Small and gentle, with big ears.',
  thornqueen: 'Strong as a wall. Guards the little ones.',
  thornking: 'Swings its tail and bonks the bench.',
  kindlefox: 'Six curly tails. Warms my feet.',
  duskflit: 'Has no eyes, but finds the biscuit tin.',
  burrowtrio: 'Three heads, one thought: dig!',
  gemcat: 'Posh, proud, and sits on your book.',
  blazepup: 'Warm and loyal. Barks at the postman.',
  swirlet: 'The swirl on its tummy makes you dizzy.',
  clinktrio: 'Three little ones, stuck together.',
  twinstrut: 'Two heads. They argue about left.',
  eggtender: 'Carries an egg for those who are poorly.',
  snoutspine: 'Spiky fins, curly tail, fussy about reeds.',
  prismstar: 'Spins in the water. Glitter!',
  ferrysong: 'Carries little ones over, singing.',
  shellhalo: 'Wears a ring of light. Smiles.',
  shearwing: 'Red as a poppy. Very polite.',
  hugwyrm: 'Huge and gentle. Delivers letters.',
  croaklet: 'Swims with a fin and a spark.',
  redsaur: 'Big, red, and loves a sunny nap.',
  skyserpent: 'Red wings. Says it holds up the sky.',
  frostwolf: 'Blue stripes, kind eyes. Howls at good moons.',
  pinkbeak: 'A pink bird. Flap, flap, flap, land!',
  eggwalker: 'An egg with legs. Peep!',
  gloomdrake: 'Four eyes, sharp wings, loves lullabies.',
};

const words = (t: string): number => t.trim().split(/\s+/).length;

/** The sprout line for a book key, given Hazel's full note for it ('' when there is none). */
export function sproutNote(key: string, full: string): string {
  if (OWN[key]) return OWN[key];
  if (!full) return '';
  const first = full.split(/(?<=[.!?])\s+/)[0] ?? '';
  return words(first) <= 8 ? first : '';
}

/** The keys with a hand-written sprout line (for the tests). */
export const SPROUT_OWN_KEYS: readonly string[] = Object.keys(OWN);
