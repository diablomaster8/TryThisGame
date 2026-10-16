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
  ALL_VARIANTS.find((v) => v.id === id) ?? TEMPLATES.find((v) => v.id === id) ?? null;

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
