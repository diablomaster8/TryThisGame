import { cosmetic, type CosmeticSlot } from '../config/cosmetics';
import { hasDerivedHat } from './derived-unlocks';
import { mayWear } from './remembrance';
import type { Nubbin, World } from './types';

/**
 * Per-slot wear (lane E r11, R0400). The hat slot stays the long-standing `Nubbin.hat`; the
 * other slots (face, neck, back, body) live in `Nubbin.wear`. The dyed scarf (`scarf`) and
 * the `glasses` flag keep their own fields and read as the neck and face slots through
 * `wornIn`, so an old save keeps its hat, scarf and glasses with no field rewritten.
 */
export const WEAR_SLOTS = ['face', 'neck', 'back', 'body'] as const;
export type WearSlot = (typeof WEAR_SLOTS)[number];

const isWearSlot = (s: string): s is WearSlot => (WEAR_SLOTS as readonly string[]).includes(s);

/** What a Nubbin wears in one slot: a registry id, or the legacy scarf and glasses. */
export function wornIn(n: Nubbin, slot: CosmeticSlot): string | null {
  if (slot === 'hat') return n.hat;
  const id = n.wear?.[slot as WearSlot];
  if (id) return id;
  if (slot === 'face' && n.glasses) return 'glasses';
  if (slot === 'neck' && n.scarf) return 'scarf';
  return null;
}

/** The registry ids worn outside the hat slot, in slot order (what the renderers add). */
export function wornExtras(n: Nubbin): string[] {
  const out: string[] = [];
  for (const s of WEAR_SLOTS) {
    const id = n.wear?.[s];
    if (id && cosmetic(id)?.slot === s) out.push(id);
  }
  return out;
}

/** Whether a wearable is owned: bought or won, or unlocked by play. */
function owned(world: World, id: string): boolean {
  return world.inventory.hats.includes(id) || hasDerivedHat(id);
}

/** Put an owned wearable on, or take a slot's item off (`id` null). False when refused. */
export function wearInSlot(
  world: World,
  nubbinId: string,
  slot: CosmeticSlot,
  id: string | null,
): boolean {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n) return false;
  if (id) {
    if (!owned(world, id) || !mayWear(n, id)) return false;
    if (cosmetic(id)?.slot !== slot) return false;
  }
  if (slot === 'hat') {
    n.hat = id;
    return true;
  }
  const wear = { ...(n.wear ?? {}) };
  if (id) wear[slot as WearSlot] = id;
  else delete wear[slot as WearSlot];
  if (Object.keys(wear).length) n.wear = wear;
  else delete n.wear;
  return true;
}

/**
 * Save migration (additive, run on every load): an item in `hat` that belongs to another slot
 * (a bow, a cape or a pumpkin suit chosen before slots existed) moves to its own slot, and a
 * `wear` entry that names an unknown item or the wrong slot is dropped. Idempotent.
 */
export function normaliseWear(world: World): void {
  for (const n of world.nubbins) {
    const c = n.hat ? cosmetic(n.hat) : null;
    if (n.hat && c && c.slot !== 'hat' && isWearSlot(c.slot)) {
      n.wear = { ...(n.wear ?? {}) };
      n.wear[c.slot] ??= n.hat;
      n.hat = null;
    }
    if (n.wear) {
      for (const s of Object.keys(n.wear) as WearSlot[]) {
        const id = n.wear[s];
        if (!isWearSlot(s) || !id || cosmetic(id)?.slot !== s) delete n.wear[s];
      }
      if (!Object.keys(n.wear).length) delete n.wear;
    }
  }
}
