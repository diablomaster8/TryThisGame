/**
 * Which cocoon a Nubbin wraps itself in (LOOK-25, R0393): the kind's colour, the band an
 * evolving child is heading for, and the silhouette of its own front frame (the child shape
 * before evolving, its adult form before a rebirth or a departure). Other families keep the
 * egg-shaped wrap.
 */
import { bandOf } from '../../sim/alignment';
import type { Nubbin } from '../../sim/types';
import type { SpriteSheet } from './atlas';
import { CHILD_NEUTRAL, drawChao, lookOf, poseFor } from './chao';
import { buildCocoonSheet } from './egg';

export function cocoonKey(n: Nubbin): string {
  const kind = n.cocoonKind ?? 'evolve';
  const band = kind === 'evolve' ? bandOf(n.alignment) : '-';
  const form = kind !== 'evolve' && n.form ? `${n.form.type}:${n.form.second ?? '-'}` : 'child';
  return `cocoon:${kind}:${band}:${n.species === 'chao' ? form : n.species}`;
}

export function buildCocoonFor(n: Nubbin): SpriteSheet {
  const kind = n.cocoonKind ?? 'evolve';
  const band = kind === 'evolve' ? bandOf(n.alignment) : null;
  if (n.species !== 'chao') return buildCocoonSheet(kind, band);
  const adult = kind !== 'evolve' && n.form;
  const look = lookOf(
    CHILD_NEUTRAL,
    adult ? n.form!.type : null,
    adult ? (n.form!.second ?? null) : null,
  );
  return buildCocoonSheet(kind, band, drawChao('front', poseFor('idle', 0), look));
}

/** A cocoon breathes: its scale goes 1 → 1.03 and back at 0.8 Hz (both renderers). */
export function cocoonPulse(nowMs: number): number {
  return 1 + 0.015 * (1 - Math.cos((2 * Math.PI * 0.8 * nowMs) / 1000));
}
