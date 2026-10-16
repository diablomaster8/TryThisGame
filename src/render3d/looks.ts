import { Color } from 'three';
import type { SpeciesSpec } from '../samples/species';
import { cloneSpec, variant, type NubbinColors } from '../samples/nubbin-variants';
import { EGG_COLOURS, SHINY_FINISH } from '../samples/nubbin-variants-colour';
import { KEEPER_MOON_SPEC, KEEPER_SPEC } from '../samples/keeper-spec';
import { NUBBIN_SPEC } from '../samples/species-data';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';
import { speciesArt } from '../render/sprites/species-art';
import { color } from '../render/sprites/palette';
import { EXTRA_LOOKS } from '../sim/npcs';
import { TRAINERS } from '../sim/trainers';
import { artSpec } from './art-species';

/**
 * Look keys and the specs behind them. A key is a plain string, so the sculpt worker can
 * rebuild the same spec from it (specs hold functions and cannot be posted), and the
 * pool and the geometry cache can file rigs under it.
 *
 * Keys: `keeper-sun`, `keeper-moon`, `nubbin`, `roster:<name>`, `variant:<id>`, `art:<species id>`
 * (the pocket and digital lines, from the pixel recipe), each
 * optionally followed by tint modifiers joined with `~`: `egg:<colour>` (the egg colour a
 * Nubbin keeps for life), `tone:<colour>` (two-tone belly and tips), `shiny`, `shadow`
 * (the grey of a Shadow-touched Nubbin). The modifiers follow the pixel view's
 * `variantColors`, so both modes paint the same Nubbin the same way.
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
  if (key.startsWith('art:')) {
    const id = key.slice(4);
    const art = speciesArt(id);
    return art ? artSpec(id, art) : null;
  }
  return null;
}

const eggColour = (name: string) => EGG_COLOURS.find((c) => c.name === name);

/** A Nubbin palette recoloured by egg colour, two-tone and shiny, as the pixel view does. */
function tint(base: SpeciesSpec, baseKey: string, mods: string[]): SpeciesSpec {
  const band = /-(sun|moon)(-|$)/.exec(baseKey)?.[1] ?? null;
  const colors: Partial<NubbinColors> = {};
  let shiny = false;
  for (const m of mods) {
    if (m.startsWith('egg:')) {
      const c = eggColour(m.slice(4));
      if (!c) continue;
      colors.body = c.body;
      colors.crownShade = c.crownShade;
      colors.belly = c.belly;
      if (c.tip) colors.tip = c.tip;
      if (c.pad) colors.pad = c.pad;
      // Sun forms keep a white belly, Moon forms a dark crown shade.
      if (band === 'sun') colors.belly = '#ffffff';
      if (band === 'moon') colors.crownShade = '#2a1a3a';
    } else if (m.startsWith('tone:')) {
      const t = eggColour(m.slice(5));
      if (!t) continue;
      colors.belly = t.body;
      colors.tip = t.body;
      colors.pad = t.crownShade;
    } else if (m === 'shiny') shiny = true;
  }
  return variant(base, `${base.name} (tinted)`, {
    colors,
    ...(shiny ? SHINY_FINISH : {}),
  });
}

/** Shadow-touched: every colour to an ash lilac of the same lightness, any species. */
function ashen(base: SpeciesSpec): SpeciesSpec {
  const spec = cloneSpec(base);
  const ash = new Color('#8a80a0');
  const c = new Color();
  const grey = (hex: string): string => {
    c.set(hex);
    const l = c.r * 0.3 + c.g * 0.59 + c.b * 0.11;
    return `#${c
      .copy(ash)
      .multiplyScalar(0.35 + l * 0.9)
      .getHexString()}`;
  };
  const prims = spec.torso.prims.concat(spec.head.prims);
  for (const part of spec.parts) prims.push(...part.prims, ...(part.joint?.prims ?? []));
  for (const p of prims) p.color = grey(p.color);
  for (const m of spec.marks) m.color = grey(m.color);
  spec.eyes = { ...spec.eyes, iris: '#e0562e' };
  if (spec.ball) spec.ball = { ...spec.ball, color: '#4a4058' };
  return spec;
}

/**
 * A visiting Keeper: the Keeper's figure with the clothes turned to the trainer's shirt
 * colour. Skin (warm, light, low-saturation hues) and near-greys stay as they are.
 */
function dressed(base: SpeciesSpec, trainer: string): SpeciesSpec {
  const look = EXTRA_LOOKS[trainer] ?? TRAINERS.find((t) => t.id === trainer)?.look;
  if (!look) return base;
  const spec = cloneSpec(base);
  const shirt = new Color(color(look.shirt)).getHSL({ h: 0, s: 0, l: 0 });
  const hsl = { h: 0, s: 0, l: 0 };
  const c = new Color();
  const dye = (hex: string): string => {
    c.set(hex).getHSL(hsl);
    const skin = hsl.h > 0.02 && hsl.h < 0.12 && hsl.l > 0.55 && hsl.s < 0.75;
    if (hsl.s < 0.3 || skin) return hex;
    return `#${c.setHSL(shirt.h, Math.max(hsl.s, shirt.s * 0.8), hsl.l).getHexString()}`;
  };
  const prims = spec.torso.prims.concat(spec.head.prims);
  for (const part of spec.parts) prims.push(...part.prims, ...(part.joint?.prims ?? []));
  for (const p of prims) p.color = dye(p.color);
  for (const m of spec.marks) m.color = dye(m.color);
  return spec;
}

/** The spec a look key builds; the base Nubbin when the key is unknown. */
export function specForKey(key: string): SpeciesSpec {
  let spec = cache.get(key);
  if (!spec) {
    const [baseKey = '', ...mods] = key.split('~');
    spec = resolve(baseKey) ?? NUBBIN_SPEC;
    const colour = mods.filter((m) => m !== 'shadow' && !m.startsWith('npc:'));
    const npc = mods.find((m) => m.startsWith('npc:'));
    if (npc) spec = dressed(spec, npc.slice(4));
    if (colour.length) spec = tint(spec, baseKey, colour);
    if (mods.includes('shadow')) spec = ashen(spec);
    cache.set(key, spec);
  }
  return spec;
}

/** The tint modifiers for a Nubbin's look key ('' when it wears the plain colours). */
export function tintMods(n: {
  eggColor: string;
  tone: string | null;
  shiny: boolean;
  heirloom?: boolean;
  shadow?: boolean;
}): string {
  const mods: string[] = [];
  if (eggColour(n.eggColor)) mods.push(`egg:${n.eggColor}`);
  if (n.tone && eggColour(n.tone)) mods.push(`tone:${n.tone}`);
  if (n.shiny || n.heirloom) mods.push('shiny');
  if (n.shadow) mods.push('shadow');
  return mods.map((m) => `~${m}`).join('');
}

/** Whether a key names a look this module knows (unknown keys fall back to the Nubbin). */
export const knownLook = (key: string): boolean => resolve(key.split('~')[0] ?? '') !== null;
