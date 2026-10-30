import { Color } from 'three';
import type { SpeciesSpec } from '../samples/species';
import { cloneSpec, paletteOf, variant, type NubbinColors } from '../samples/nubbin-variants';
import {
  EGG_COLOURS,
  gemFinishFor,
  gemRoles,
  JEWEL_FINISH,
  JEWELS,
  SHINY_FINISH,
} from '../samples/nubbin-variants-colour';
import { withGemFinish } from '../samples/gem-finish';
import {
  parsePartSteps,
  parsePartsMod,
  partsTinted,
  withCritterParts,
} from '../samples/nubbin-critter-parts';
import {
  KEEPER_MOON,
  KEEPER_MOON_SPEC,
  KEEPER_SPEC,
  KEEPER_SUN,
  keeperSpec,
  type KeeperColors,
} from '../samples/keeper-spec';
import { NUBBIN_SPEC } from '../samples/species-data';
import { grandchildSpec } from '../samples/grandchild-spec';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';
import { speciesArt } from '../render/sprites/species-art';
import { color, shadeOf } from '../render/sprites/palette';
import { keeperOutfit } from '../render/keeper-look';
import { EXTRA_LOOKS } from '../sim/npcs';
import { TRAINERS } from '../sim/trainers';
import { artSpec } from './art-species';
import { withNpcAccessories } from './npc-accessories';
import { STORY_NPC_LOOKS, STORY_ONLY_LOOKS, WEATHERED } from '../config/npc-looks';
import { CHILD_HINT } from '../config/tuning';
import { withBirthmark } from './birthmark-3d';
import { weathered } from './weathered';

/**
 * Look keys and the specs behind them. A key is a plain string, so the sculpt worker can
 * rebuild the same spec from it (specs hold functions and cannot be posted), and the
 * pool and the geometry cache can file rigs under it.
 *
 * Keys: `grandchild-sun` and `grandchild-moon` with `~outfit:<trainer>` (the player's own
 * avatar, `samples/grandchild-spec.ts`), `keeper-sun`, `keeper-moon`, `nubbin`, `roster:<name>`, `variant:<id>`, `art:<species id>`
 * (the pocket and digital lines, from the pixel recipe), each optionally followed by
 * modifiers joined with `~`, applied in this order whatever order they are written in:
 * - `npc:<trainer>`: on a Keeper, the trainer's outfit by the one Keeper look rule
 *   (`keeperOutfit`, trim from the figure's side); on anything else, clothes dyed to the shirt.
 * - `look:<look id>`: a character look's palette (`look-fox`...) over the base's shape.
 * - `egg:<colour>` (the egg colour a Nubbin keeps for life, an egg colour or a jewel),
 *   `tone:<colour>` (two-tone belly and tips), `shiny`.
 * - `parts:<ears>,<tail>,<arms>,<back>`: critter part ids, `-` for an empty slot.
 * - `shadow`: the grey of a Shadow-touched Nubbin, last, over everything.
 * The colour modifiers follow the pixel view's `variantColors`, so both modes paint the same
 * Nubbin the same way.
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

interface Gem {
  name: string;
  body: string;
  crownShade: string;
  belly: string;
  tip?: string;
  pad?: string;
}

const eggColour = (name: string): Gem | undefined => EGG_COLOURS.find((c) => c.name === name);
const jewel = (name: string): Gem | undefined => JEWELS.find((j) => j.name === name);

/**
 * Colours by role, made one-to-one against the base's palette: where two roles share a colour
 * on the base (an Eternal Moon paints body, tips and wings alike), the later role follows the
 * earlier one, so the swap moves the body rather than whichever role came last.
 */
function byRole(base: SpeciesSpec, want: Partial<NubbinColors>): Partial<NubbinColors> {
  const from = paletteOf(base);
  const out: Partial<NubbinColors> = { ...want };
  const first = new Map<string, keyof NubbinColors>();
  for (const role of Object.keys(from) as (keyof NubbinColors)[]) {
    const lead = first.get(from[role]);
    if (lead === undefined) first.set(from[role], role);
    else out[role] = out[lead] ?? from[lead];
  }
  return out;
}

/**
 * A Nubbin palette recoloured by egg colour, jewel, two-tone and shiny, as the pixel view does.
 * A jewel keeps its gem palette in every form (no Sun or Moon belly) and wears the cut,
 * glossy `JEWEL_FINISH`, over the shiny finish when both apply.
 */
function tint(base: SpeciesSpec, baseKey: string, mods: string[]): SpeciesSpec {
  const band = /-(sun|moon)(-|$)/.exec(baseKey)?.[1] ?? null;
  const colors: Partial<NubbinColors> = {};
  let shiny = false;
  let gem: Gem | undefined;
  let eggName = '';
  for (const m of mods) {
    if (m.startsWith('egg:')) {
      const name = m.slice(4);
      eggName = name;
      gem = jewel(name);
      const c = eggColour(name) ?? gem;
      if (!c) continue;
      colors.body = c.body;
      colors.crownShade = c.crownShade;
      colors.belly = c.belly;
      if (c.tip) colors.tip = c.tip;
      if (c.pad) colors.pad = c.pad;
      if (gem) {
        // A jewel is one gem through and through (LOOK-29): pads, wings and sheen too, so
        // no default yellow or cream role is left showing.
        Object.assign(colors, gemRoles(gem));
        continue;
      }
      // Sun forms keep a white belly, Moon forms a dark crown shade.
      if (band === 'sun') colors.belly = '#ffffff';
      if (band === 'moon') colors.crownShade = '#2a1a3a';
    } else if (m.startsWith('tone:')) {
      const t = eggColour(m.slice(5)) ?? jewel(m.slice(5));
      if (!t) continue;
      colors.belly = t.body;
      colors.tip = t.body;
      colors.pad = t.crownShade;
    } else if (m === 'shiny') shiny = true;
  }
  const finish = gemFinishFor(gem, eggName, shiny);
  return variant(base, `${base.name} (tinted)`, {
    colors: byRole(base, colors),
    // Painted in the body's shader, so it reads under the toon ramp (LOOK-29, LOOK-30).
    ...(finish ? { patch: (s: SpeciesSpec) => withGemFinish(s, finish) } : {}),
    ...(shiny ? SHINY_FINISH : {}),
    ...(gem || shiny
      ? { surface: { ...(shiny ? SHINY_FINISH.surface : {}), ...(gem ? JEWEL_FINISH : {}) } }
      : {}),
    ...(gem ? { eyes: { iris: gem.crownShade } } : {}),
  });
}

/**
 * A character look over another body. A child wears the look's whole catalogue figure (the
 * pool keys it `variant:look-<id>`), so this runs for adults and Eternals only: as in the
 * pixel view, the look's palette goes over the form's own shape (its type tells, crown, wings
 * and Eternal head stay), and the look's head accessory is worn as a hat by the `Dresser`.
 */
/**
 * LOOK-49: a Sun- or Moon-leaning child part of the way there: each palette role blended
 * from the neutral child's toward the leaning child's by `k`.
 */
function leanBlend(base: SpeciesSpec, k: number): SpeciesSpec {
  if (!(k > 0 && k < 1)) return base;
  const from = paletteOf(NUBBIN_SPEC);
  const to = paletteOf(base);
  const a = new Color();
  const b = new Color();
  const colors: Partial<NubbinColors> = {};
  for (const role of Object.keys(to) as (keyof NubbinColors)[])
    colors[role] = `#${a.set(from[role]).lerp(b.set(to[role]), k).getHexString()}`;
  return variant(base, `${base.name} (${Math.round(k * 100)}%)`, { colors });
}

function lookPalette(base: SpeciesSpec, lookId: string): SpeciesSpec {
  const look = variantById(lookId);
  if (!look) return base;
  return variant(base, `${base.name} (${lookId})`, {
    colors: byRole(base, paletteOf(look.spec)),
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
  // LOOK-64: the ember eyes carry a little light of their own, so the face reads at dusk.
  spec.eyes = { ...spec.eyes, iris: '#e0562e', glow: 0.4 };
  if (spec.ball) spec.ball = { ...spec.ball, color: '#4a4058' };
  return spec;
}

/**
 * The Keeper figure in a trainer's outfit, by the one Keeper look rule (`keeperOutfit`, shared
 * with the pixel view): the tee is the trainer's shirt and the open vest the hat colour (the
 * shirt's shade when the trainer wears no hat), the shorts the trousers, the sneakers the boots,
 * the hair the trainer's, and the goggle frame the hat band. The trim, stripes and wristbands
 * carry the Sun or Moon side (the outfit's shirt shade and hat band). Skin, blush, eyes, the
 * soles, the goggle glass and the badge stay the side's own.
 */
export function keeperColours(trainerId: string, side: 'sun' | 'moon'): KeeperColors {
  const base = side === 'moon' ? KEEPER_MOON : KEEPER_SUN;
  const o = keeperOutfit(trainerId, side);
  return {
    ...base,
    hair: color(o.hair),
    tee: color(o.shirt),
    vest: color(o.hatStyle === 'none' ? shadeOf(o.shirt) : o.hat),
    trim: color(o.shirtShade),
    shorts: color(o.pants),
    stripe: color(o.hatBand),
    shoes: color(o.boots),
    wristband: color(o.hatBand),
    goggleFrame: color(o.hatBand),
  };
}

/**
 * A figure that is not the Keeper dressed as a trainer: the clothes turned to the trainer's
 * shirt colour. Skin (warm, light, low-saturation hues) and near-greys stay as they are.
 */
function dressed(base: SpeciesSpec, trainer: string): SpeciesSpec {
  const look =
    EXTRA_LOOKS[trainer] ??
    STORY_ONLY_LOOKS[trainer]?.trainer ??
    TRAINERS.find((t) => t.id === trainer)?.look;
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

/** Whether a trainer id has a look (playable trainer or story Keeper). */
const hasTrainer = (id: string): boolean =>
  !!EXTRA_LOOKS[id] ||
  !!STORY_NPC_LOOKS[id] ||
  !!STORY_ONLY_LOOKS[id] ||
  TRAINERS.some((t) => t.id === id);

/** The spec a look key builds; the base Nubbin when the key is unknown. */
export function specForKey(key: string): SpeciesSpec {
  let spec = cache.get(key);
  if (!spec) {
    const [baseKey = '', ...mods] = key.split('~');
    const mod = (prefix: string) => mods.find((m) => m.startsWith(prefix))?.slice(prefix.length);
    spec = resolve(baseKey) ?? NUBBIN_SPEC;
    // The player's avatar: Hazel's grandchild in the picked role's outfit for its side.
    const kid =
      baseKey === 'grandchild-moon' ? 'moon' : baseKey === 'grandchild-sun' ? 'sun' : null;
    if (kid) spec = grandchildSpec(keeperColours(mod('outfit:') ?? TRAINERS[0]!.id, kid));
    const npc = mod('npc:');
    if (npc !== undefined) {
      const side = baseKey === 'keeper-moon' ? 'moon' : baseKey === 'keeper-sun' ? 'sun' : null;
      if (side && hasTrainer(npc))
        spec = withNpcAccessories(
          keeperSpec(keeperColours(npc, side), `${side === 'moon' ? 'Moon' : 'Sun'} Keeper`),
          npc,
        );
      else if (!side) spec = dressed(spec, npc);
    }
    const hint = mod('hint:');
    if (hint) spec = leanBlend(spec, Number(hint) / CHILD_HINT.steps3d);
    const look = mod('look:');
    if (look) spec = lookPalette(spec, look);
    const colour = mods.filter(
      (m) => m.startsWith('egg:') || m.startsWith('tone:') || m === 'shiny',
    );
    if (colour.length) spec = tint(spec, baseKey, colour);
    const parts = mod('parts:');
    if (parts)
      spec = withCritterParts(
        spec,
        parsePartsMod(parts),
        parsePartSteps(parts),
        partsTinted(parts),
      );
    // LOOK-53: the birthmark, painted on before the Shadow's grey so it greys with the rest.
    const mark = mod('mark:');
    if (mark) spec = withBirthmark(spec, mark);
    if (mods.includes('shadow')) spec = ashen(spec);
    if (mods.includes('weathered')) spec = weathered(spec);
    cache.set(key, spec);
  }
  return spec;
}

/** The tint modifiers for a Nubbin's look key ('' when it wears the plain colours). */
export function tintMods(n: {
  id?: string;
  eggColor: string;
  tone: string | null;
  shiny: boolean;
  heirloom?: boolean;
  shadow?: boolean;
}): string {
  const mods: string[] = [];
  if (eggColour(n.eggColor) || jewel(n.eggColor)) mods.push(`egg:${n.eggColor}`);
  if (n.tone && (eggColour(n.tone) || jewel(n.tone))) mods.push(`tone:${n.tone}`);
  if (n.shiny || n.heirloom) mods.push('shiny');
  if (n.shadow) mods.push('shadow');
  if (n.id && WEATHERED.ids.has(n.id)) mods.push('weathered');
  return mods.map((m) => `~${m}`).join('');
}

/** Whether a key names a look this module knows (unknown keys fall back to the Nubbin). */
export const knownLook = (key: string): boolean => resolve(key.split('~')[0] ?? '') !== null;
