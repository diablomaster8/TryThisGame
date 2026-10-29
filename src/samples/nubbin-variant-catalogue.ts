import {
  CHILD_VARIANTS,
  TEMPLATES,
  type NubbinVariant,
  type VariantFamily,
} from './nubbin-variants';
import { COLOUR_VARIANTS } from './nubbin-variants-colour';
import { FIRST_VARIANTS } from './nubbin-variants-first';
import { SECOND_VARIANTS } from './nubbin-variants-second';
import { SPECIAL_VARIANTS } from './nubbin-variants-special';
import { speciesArt } from '../render/sprites/species-art';
import { artSpec } from '../render3d/art-species';
import { speciesByFamily, type Family, type SpeciesStage } from '../sim/species';

/**
 * Every Nubbin variant by family, for the stage's `&creature=variants` sheet and
 * `&creature=variant:<id>` view. The families live in their own files so each stays
 * readable; this is the one place that lists them.
 */
export const VARIANT_FAMILIES: Record<VariantFamily, NubbinVariant[]> = {
  child: CHILD_VARIANTS,
  first: FIRST_VARIANTS,
  second: SECOND_VARIANTS,
  special: SPECIAL_VARIANTS,
  colour: COLOUR_VARIANTS,
};

export const ALL_VARIANTS: NubbinVariant[] = Object.values(VARIANT_FAMILIES).flat();

export const variantById = (id: string): NubbinVariant | null =>
  ALL_VARIANTS.find((v) => v.id === id) ?? TEMPLATES.find((v) => v.id === id) ?? artVariant(id);

/** `art:<species id>`: a pocket or digital species on the stage, for the likeness reviews. */
function artVariant(id: string): NubbinVariant | null {
  if (!id.startsWith('art:')) return null;
  const art = speciesArt(id.slice(4));
  return art ? { id, family: 'child', spec: artSpec(id.slice(4), art) } : null;
}

/** The specs a `&creature=variants` sheet lines up: one family, filtered and capped. */
export function sheetVariants(query: URLSearchParams): NubbinVariant[] {
  // `&ids=a,b,c` lines up exactly these variants. The stage camera looks along +z, so x runs
  // right to left on screen: the list is reversed here to read left to right as written
  // (the order of the line-up reference).
  const ids = query.get('ids');
  if (ids)
    return ids
      .split(',')
      .map((id) => variantById(id.trim()))
      .filter((v): v is NubbinVariant => v !== null)
      .reverse();
  const family = (query.get('family') ?? 'child') as VariantFamily;
  const filter = query.get('filter') ?? '';
  const max = Math.max(1, Number(query.get('max')) || 16);
  const list =
    family === ('templates' as string) ? TEMPLATES : (VARIANT_FAMILIES[family] ?? CHILD_VARIANTS);
  return list.filter((v) => v.id.includes(filter)).slice(0, max);
}

/**
 * The art species a `&creature=art` contact sheet lines up: `&family=pocket|digi`,
 * `&stage=baby|grown|champion|final`, `&max=<n>` (16) and `&offset=<n>` page through them in
 * species order; `&ids=art:a,art:b` picks exact ones (as `&creature=variants` does).
 */
export function artSheet(query: URLSearchParams): NubbinVariant[] {
  // `sheetVariants` reverses `&ids` for the plain stage; an art sheet mirrors x instead.
  if (query.get('ids')) return sheetVariants(query).reverse();
  const family: Family = query.get('family') === 'digi' ? 'digi' : 'pocket';
  const stage = (query.get('stage') ?? undefined) as SpeciesStage | undefined;
  const max = Math.max(1, Number(query.get('max')) || 16);
  const offset = Math.max(0, Number(query.get('offset')) || 0);
  return speciesByFamily(family, stage)
    .slice(offset, offset + max)
    .map((s) => artVariant(`art:${s.id}`))
    .filter((v): v is NubbinVariant => v !== null);
}
