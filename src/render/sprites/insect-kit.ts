import type { CreaturePalette, CreatureSpec } from './creature';
import { ex } from './creature-extras';

/**
 * The insect recipe (LOOK-41): a hexapod on the tall plan, shared by Kabuterimon, Kuwagamon
 * and Flymon. An oval armoured thorax, four arms (the kit's claws plus a second pair), two
 * long legs, and four see-through wings on the back in the palette's `accent2`. A species
 * adds its own head piece: a big horn, stag pincers, an antenna. Both renderers draw it from
 * the kit parts, so it needs no plan code of its own.
 */
export const INSECT: Partial<CreatureSpec> = {
  plan: 'tall',
  size: 1.2,
  arms: 'claws',
  legs: 'long',
  eyes: 'angry',
  wings: 'none',
};

/** An insect species: the shared recipe, its palette, then its own head piece and marks. */
export function insect(colors: CreaturePalette, over: Partial<CreatureSpec>): CreatureSpec {
  const base: CreatureSpec = {
    plan: 'tall',
    size: 1.2,
    ears: 'none',
    tail: 'none',
    crest: 'none',
    wings: 'none',
    arms: 'claws',
    legs: 'long',
    eyes: 'angry',
    marks: [],
    colors,
  };
  return {
    ...base,
    ...INSECT,
    ...over,
    addons: [
      ex('fourArms', colors.body, colors.shade, 1),
      ex('insectWings', colors.accent2, colors.outline),
      ...(over.addons ?? []),
    ],
  };
}
