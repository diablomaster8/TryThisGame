/**
 * LOOK-68 (R0436): likeness sheets for the Chao forms. The Chao line has no generic-drawer
 * spec, so its sheet is derived from the 3D variant spec in the catalogue (the line-up
 * reference built on `samples/nubbin-variants*.ts`): the palette roles, the part bones and
 * the wings and ball say what a viewer should find on the figure. Data only, never shown.
 */
import { ALL_VARIANTS } from '../../render3d/art/nubbin-variant-catalogue';
import { paletteOf } from '../../render3d/art/nubbin-variants';
import type { SpeciesSpec } from '../../render3d/art/species';
import type { Likeness } from './likeness';

let byId: Map<string, SpeciesSpec> | null = null;

/** The ids of every Chao form a sheet exists for. */
export function chaoLikenessIds(): string[] {
  return ALL_VARIANTS.map((v) => v.id);
}

const PART_WORDS: Record<string, string> = {
  arm: 'arms',
  leg: 'legs',
  ear: 'ears',
  tail: 'tail',
};

/** The bone name without its side or end ("armL" -> "arms", "tail2" -> "tail"). */
function partWord(bone: string): string {
  for (const k of Object.keys(PART_WORDS)) if (bone.startsWith(k)) return PART_WORDS[k]!;
  return bone;
}

export function chaoLikeness(id: string): Likeness | undefined {
  byId ??= new Map(ALL_VARIANTS.map((v) => [v.id, v.spec]));
  const spec = byId.get(id);
  if (!spec) return undefined;
  const pal = paletteOf(spec);
  const keyColours = [
    ...new Set([pal.body, pal.belly, pal.tip, pal.wing].map((c) => c.toLowerCase())),
  ].slice(0, 4);
  const parts = [...new Set(spec.parts.map((p) => partWord(p.name)))].filter(
    (w) => w !== 'arms' && w !== 'legs',
  );
  const mustHave = ['pointed crown', 'big eyes', 'stubby arms and legs', ...parts];
  if (spec.wings) mustHave.push('tiny wings');
  if (spec.ball) mustHave.push('emote ball');
  const build = spec.scale >= 0.88 ? 'large' : spec.scale <= 0.8 ? 'tiny' : 'small';
  const feature = spec.wings
    ? 'winged'
    : parts.includes('tail')
      ? 'tailed'
      : parts.includes('ears')
        ? 'eared'
        : 'plain';
  return {
    silhouette: [build, 'round', feature],
    keyColours: keyColours.length >= 2 ? keyColours : [...keyColours, pal.tip.toLowerCase()],
    mustHave,
    plan: 'chao',
  };
}
