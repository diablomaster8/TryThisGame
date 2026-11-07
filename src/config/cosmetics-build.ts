// Builders for the cosmetic registry (split from cosmetics.ts, TECH-36).
import { HAT_LABELS } from './strings';
import { COSMETIC_LABELS } from './strings-look';
import type {
  Cosmetic,
  CosmeticRarity,
  CosmeticSlot,
  CosmeticSource,
  MeshOp,
  PxOp,
} from './cosmetics-types';

export const ring = (n: number, r: number, y: number, f: (x: number, z: number, a: number) => MeshOp) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return f(Math.sin(a) * r, Math.cos(a) * r, a);
  });

export const bespoke = (
  id: string,
  rarity: CosmeticRarity,
  source: CosmeticSource,
  slot: CosmeticSlot = 'hat',
): Cosmetic => ({
  id,
  label: HAT_LABELS[id] ?? COSMETIC_LABELS[id] ?? id,
  slot,
  rarity,
  source,
  bespoke: true,
});

export const item = (
  id: string,
  slot: CosmeticSlot,
  rarity: CosmeticRarity,
  px: readonly PxOp[],
  mesh: readonly MeshOp[],
  pxBack?: readonly PxOp[],
): Cosmetic => ({
  id,
  label: COSMETIC_LABELS[id] ?? id,
  slot,
  rarity,
  source: 'shop',
  px,
  mesh,
  ...(pxBack ? { pxBack } : {}),
});
