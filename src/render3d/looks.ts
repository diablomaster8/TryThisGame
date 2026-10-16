import type { SpeciesSpec } from '../samples/species';
import { KEEPER_MOON_SPEC, KEEPER_SPEC } from '../samples/keeper-spec';
import { NUBBIN_SPEC } from '../samples/species-data';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';

/**
 * Look keys and the specs behind them. A key is a plain string, so the sculpt worker can
 * rebuild the same spec from it (specs hold functions and cannot be posted), and the
 * pool and the geometry cache can file rigs under it.
 *
 * Keys: `keeper-sun`, `keeper-moon`, `nubbin`, `roster:<name>`, `variant:<id>`.
 */
const cache = new Map<string, SpeciesSpec>();

function resolve(key: string): SpeciesSpec | null {
  if (key === 'keeper-sun') return KEEPER_SPEC;
  if (key === 'keeper-moon') return KEEPER_MOON_SPEC;
  if (key === 'nubbin') return NUBBIN_SPEC;
  if (key.startsWith('roster:')) {
    const name = key.slice(7);
    return ROSTER.find((s) => s.name === name) ?? null;
  }
  if (key.startsWith('variant:')) return variantById(key.slice(8))?.spec ?? null;
  return null;
}

/** The spec a look key builds; the base Nubbin when the key is unknown. */
export function specForKey(key: string): SpeciesSpec {
  let spec = cache.get(key);
  if (!spec) {
    spec = resolve(key) ?? NUBBIN_SPEC;
    cache.set(key, spec);
  }
  return spec;
}

/** Whether a key names a look this module knows (unknown keys fall back to the Nubbin). */
export const knownLook = (key: string): boolean => resolve(key) !== null;
