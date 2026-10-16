/**
 * E6's reflection (canon 21, fix-changelog M2). When the last endgame opens, the
 * Multiverse looks into the Free Grove and Hazel's Grove saves, read-only, and makes a
 * reflection of the oldest living Eternal there: same name, look and age. The reflection
 * lives only in the Multiverse save, and the `eternal` ending gives up only it. No Grove
 * save is ever written.
 */
import type { MultiverseSave, Reflection } from './side-saves';
import type { AlignmentBand } from './types';

interface SavedNubbin {
  id?: unknown;
  name?: unknown;
  species?: unknown;
  eggColor?: unknown;
  shiny?: unknown;
  tone?: unknown;
  form?: unknown;
  hat?: unknown;
  eternal?: unknown;
  ageMs?: unknown;
}

function eternalsIn(json: string): Reflection[] {
  try {
    const data = JSON.parse(json) as { world?: { nubbins?: unknown } };
    const list = data.world?.nubbins;
    if (!Array.isArray(list)) return [];
    const out: Reflection[] = [];
    for (const n of list as SavedNubbin[]) {
      if (n.eternal !== 'sun' && n.eternal !== 'moon' && n.eternal !== 'neutral') continue;
      if (typeof n.name !== 'string') continue;
      out.push({
        of: typeof n.id === 'string' ? n.id : '',
        name: n.name,
        species: typeof n.species === 'string' ? n.species : 'chao',
        eggColor: typeof n.eggColor === 'string' ? n.eggColor : 'plain',
        shiny: n.shiny === true,
        tone: typeof n.tone === 'string' ? n.tone : null,
        form: typeof n.form === 'string' ? n.form : null,
        hat: typeof n.hat === 'string' ? n.hat : null,
        eternal: n.eternal as AlignmentBand,
        ageMs: typeof n.ageMs === 'number' ? n.ageMs : 0,
      });
    }
    return out;
  } catch {
    return [];
  }
}

/** The oldest living Eternal across the given Grove saves, or null. Read-only. */
export function oldestEternal(groveJsons: readonly string[]): Reflection | null {
  let best: Reflection | null = null;
  for (const json of groveJsons) {
    for (const r of eternalsIn(json)) if (!best || r.ageMs > best.ageMs) best = r;
  }
  return best;
}

/**
 * E6 opens: make the reflection if there is none yet and it was never given up. Changes
 * only the Multiverse save it is handed. Returns the reflection in play, if any.
 */
export function reflectEternal(
  mv: MultiverseSave,
  groveJsons: readonly string[],
): Reflection | null {
  if (mv.reflectionLost) return null;
  mv.reflection ??= oldestEternal(groveJsons);
  return mv.reflection;
}

/** E6's `eternal` ending: the reflection goes into Ultron. Only this save loses it. */
export function loseReflection(mv: MultiverseSave): void {
  mv.reflection = null;
  mv.reflectionLost = true;
}
