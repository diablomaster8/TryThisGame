/**
 * LOOK-68 (R0436): one likeness reference sheet per species, as data. An artist or agent
 * tuning a species checks against this instead of memory: three silhouette words, 2-4 key
 * colours, the parts that make it itself, and the body plan. Derived from the art spec so it
 * can never drift from the drawing, with hand-written overrides for the species whose
 * likeness needs more than the spec says. Never shown in game.
 */
import { speciesArt } from './species-art';
import { color, C } from './palette';
import type { CreatureSpec } from './creature';
import { chaoLikeness } from './likeness-chao';
import { SPECIES } from '../../sim/species';

export interface Likeness {
  /** Three words: the shape a viewer should read at a glance. */
  silhouette: [string, string, string];
  /** 2 to 4 hex colours, the body first. */
  keyColours: string[];
  /** The parts a viewer looks for before they accept it. */
  mustHave: string[];
  /** The body plan the drawer builds it from. */
  plan: string;
}

/** Hand-written overrides, over the derived sheet, for the likenesses that matter most. */
export const LIKENESS_OVERRIDES: Record<string, Partial<Likeness>> = {
  snoozelump: {
    silhouette: ['huge', 'round', 'sitting'],
    keyColours: ['#2e5c6e', '#f0e6c8'],
    mustHave: ['cream face mask', 'cream belly', 'small pointed ears', 'closed eyes'],
  },
  frostplume: {
    silhouette: ['bird', 'long-tailed', 'wide-winged'],
    mustHave: ['ribbon tail', 'beak', 'wide wings', 'thin legs'],
  },
  boltplume: {
    silhouette: ['bird', 'spiky', 'wide-winged'],
    mustHave: ['jagged feathers', 'beak', 'wide wings', 'thin legs'],
  },
  blazeplume: {
    silhouette: ['bird', 'flaming', 'wide-winged'],
    mustHave: ['flame wings', 'flame tail', 'beak', 'thin legs'],
  },
  psyclone: {
    silhouette: ['tall', 'thin', 'tailed'],
    mustHave: ['thick tail', 'neck tube', 'flat head with two horns', 'three fingers'],
  },
  cinderwing: {
    silhouette: ['winged', 'long-necked', 'upright'],
    mustHave: ['swept horns', 'teal inner wings', 'flame tail tip', 'snout'],
  },
  blazehound: {
    silhouette: ['four-legged', 'maned', 'striped'],
    mustHave: ['black stripes', 'cream mane', 'cream chest and tail', 'muzzle'],
  },
  spookgrin: {
    silhouette: ['squat', 'wide', 'grinning'],
    mustHave: ['wide grin', 'red eyes', 'back spikes'],
  },
};

const hex = (i: number): string => color(i);

function silhouetteOf(s: CreatureSpec): [string, string, string] {
  const build = s.size >= 1.15 ? 'large' : s.size <= 0.9 ? 'tiny' : 'small';
  const shape =
    s.plan === 'round'
      ? 'round'
      : s.plan === 'tall'
        ? 'tall'
        : s.plan === 'serpent'
          ? 'long'
          : s.plan;
  const feature =
    s.wings !== 'none'
      ? 'winged'
      : s.tail !== 'none'
        ? 'tailed'
        : s.ears !== 'none'
          ? 'eared'
          : 'plain';
  return [build, shape, feature];
}

function partsOf(s: CreatureSpec): string[] {
  const out: string[] = [];
  if (s.ears !== 'none') out.push(`${s.ears} ears`);
  if (s.tail !== 'none') out.push(`${s.tail} tail`);
  if (s.crest !== 'none') out.push(`${s.crest} crest`);
  if (s.wings !== 'none') out.push(`${s.wings} wings`);
  if (s.arms !== 'stub' && s.arms !== 'none') out.push(`${s.arms} arms`);
  for (const a of s.addons ?? []) out.push(a.kind);
  for (const m of s.marks) out.push(m);
  // A bare body still has a face to check: the eyes are always a tell.
  if (out.length < 2) out.push(`${s.eyes} eyes`);
  return out.length < 2 ? ['plain body', ...out] : out;
}

const TELLS: Record<string, string[]> = {
  swim: ['crest fin', 'flipper hands', 'flipper feet'],
  fly: ['long crown', 'big wings'],
  run: ['head quills', 'long legs'],
  power: ['horns', 'wide body'],
  normal: ['plain pointed crown'],
};

const ALIGN_TELLS: Record<string, string[]> = {
  sun: ['white body', 'pastel accents', 'halo ball'],
  moon: ['black body', 'deep accents', 'spiked ball'],
  neutral: ['type-coloured body'],
};

const LOOK_TELLS: Record<string, string> = {
  fox: 'fox ears and tail',
  echidna: 'quilled back and gloves',
  rose: 'rose accessory',
  dream: 'dreamy sparkle accent',
  quills: 'long head quills',
  shade: 'goggles',
  angel: 'four wings and a halo',
  devil: 'little horns and a spade tail',
  chaos: 'watery body and a green heart',
};

const FINISH_TELLS: Record<string, string> = {
  twotone: 'two-tone body and belly',
  shiny: 'shiny glossy sheen',
  metal: 'metallic sheen',
  glass: 'translucent glass body',
};

/** The tells a Chao id's own name gives, in the order a viewer looks for them. */
function chaoTells(id: string): string[] {
  const w = id.split('-');
  const head = w[0];
  if (head === 'child')
    return [
      'light blue body',
      'yellow-tipped head, hands and feet',
      ...(w[1] ? [`faint ${w[1]} hint`] : []),
    ];
  if (head === 'first' || head === 'second') {
    const align = w[1] ?? 'neutral';
    const out = [...(TELLS[w[2] ?? 'normal'] ?? [])];
    if (head === 'second' && w[3])
      out.push(...(TELLS[w[3]] ?? []).map((t) => `${w[3]} tell at half strength: ${t}`));
    return [...out, ...(ALIGN_TELLS[align] ?? [])];
  }
  if (head === 'eternal') {
    const a = w[1] ?? 'neutral';
    const sig =
      a === 'sun' ? 'halo above the head' : a === 'moon' ? 'devil tail' : 'orbiting motes';
    return [`eternal ${a} Chaos signature: ${sig}`, ...(ALIGN_TELLS[a] ?? [])];
  }
  if (head === 'shadow') return ['dark shadow body', 'glowing half-voice eyes'];
  if (head === 'look') return [LOOK_TELLS[w[1] ?? ''] ?? `${w[1]} look`];
  if (head === 'jewel') return [`jewel: ${w[1]}`, 'jewel facets', 'gem-bright sheen'];
  if (head === 'colour') {
    const fin = w.length > 2 ? w[w.length - 1] : '';
    const base = w[1] ?? '';
    return [`egg colour: ${base}`, ...(fin && FINISH_TELLS[fin] ? [FINISH_TELLS[fin]!] : [])];
  }
  return [];
}

function chaoSheet(id: string): Likeness | undefined {
  const [baseId = '', band] = id.split('~radiant:');
  const base = chaoLikeness(baseId);
  if (!base) return undefined;
  const mustHave = [...new Set([...chaoTells(baseId), ...base.mustHave])];
  if (band) mustHave.unshift(`Chaos-tier ${band} glow rim`, 'enlarged wings');
  return { ...base, mustHave };
}

/** The stage looks: the species sheet with the tells the stage recipe adds. */
function stageSheet(id: string, base: Likeness): Likeness {
  if (id.startsWith('radiant:'))
    return {
      ...base,
      keyColours: [...new Set([...base.keyColours.slice(0, 3), color(C.sunYellow)])],
      mustHave: ['gold crystal crown', 'gem studs on the body', ...base.mustHave],
    };
  return {
    ...base,
    mustHave: ['chibi round body', 'big cute eyes', 'stub limbs', ...base.mustHave],
  };
}

/**
 * The likeness sheet of one species, one Chao form (a variant id such as `first-sun-power`,
 * `second-moon-run-swim`, `eternal-sun`, `look-fox`, optionally `~radiant:<band>`; derived from
 * its 3D variant spec in `likeness-chao.ts`, with the form's own tells on top), or a stage
 * look (`radiant:<species>`, `juv:<species>`). Undefined where it has none.
 */
export function likenessOf(id: string): Likeness | undefined {
  const spec = speciesArt(id);
  if (!spec) return chaoSheet(id);
  const c = spec.colors;
  const colours = [...new Set([hex(c.body), hex(c.belly), hex(c.accent), hex(c.accent2)])].slice(
    0,
    4,
  );
  const base: Likeness = {
    silhouette: silhouetteOf(spec),
    keyColours: colours,
    mustHave: partsOf(spec),
    plan: spec.plan,
  };
  const sheet = { ...base, ...(LIKENESS_OVERRIDES[id] ?? {}) };
  return /^(radiant|juv):/.test(id) ? stageSheet(id, sheet) : sheet;
}

/** The ids `LIKENESS_OVERRIDES` is keyed by, for the test that none is stale. */
export const overrideIds = (): string[] => Object.keys(LIKENESS_OVERRIDES);
export const isSpeciesId = (id: string): boolean => SPECIES.some((s) => s.id === id);
