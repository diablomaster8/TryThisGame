import type { Nubbin, PartSlot } from '../../sim/types';
import { childHint } from '../../sim/alignment';
import type { SpriteSheet } from './atlas';
import {
  adultColors,
  buildChaoSheet,
  CHILD_MOON,
  CHILD_NEUTRAL,
  CHILD_SUN,
  CHARACTER_LOOKS,
  eternalColors,
  lookOf,
  variantColors,
} from './chao';
import { speciesOf } from '../../sim/species';
import { buildCreatureSheet } from './creature';
import { buildCocoonSheet, buildEggSheet } from './egg';
import { speciesArt } from './species-art';
import { buildEmoteSheet } from './emote';
import { buildKeeperSheet, MOON_KEEPER, SUN_KEEPER } from './keeper';
import { buildPropSheet } from './props';

const SLOTS: PartSlot[] = ['ears', 'tail', 'arms', 'back'];

/**
 * Sprite sheets are generated on demand and cached by a style key, so Nubbins of the
 * same look share one texture. Hand-drawn sheets can later be registered under the
 * same keys through `register`.
 */
export class SheetCache {
  private readonly sheets = new Map<string, SpriteSheet>();
  private readonly overrides = new Map<string, SpriteSheet>();

  register(key: string, sheet: SpriteSheet): void {
    this.overrides.set(key, sheet);
  }

  get(key: string, build: () => SpriteSheet): SpriteSheet {
    const o = this.overrides.get(key);
    if (o) return o;
    let s = this.sheets.get(key);
    if (!s) {
      s = build();
      this.sheets.set(key, s);
    }
    return s;
  }

  /** The style key a Nubbin renders with right now. */
  static nubbinKey(n: Nubbin): string {
    if (n.stage === 'egg') return `egg:${n.eggColor}:${n.species}`;
    if (n.stage === 'cocoon') return `cocoon:${n.cocoonKind ?? 'evolve'}`;
    if (n.species !== 'chao') return `species:${n.species}`;
    const parts = SLOTS.map((s) => n.parts[s] ?? '-').join(',');
    const hat = n.hat ?? '-';
    const variant = `${n.eggColor}:${n.shiny ? 's' : '-'}:${n.tone ?? '-'}`;
    if (n.stage === 'adult' && n.form) {
      if (n.eternal) return `eternal:${n.eternal}:${parts}:${hat}:${variant}`;
      return `adult:${n.form.band}:${n.form.type}:${n.form.second ?? '-'}:${parts}:${hat}:${variant}`;
    }
    return `child:${childHint(n.alignment)}:${parts}:${hat}:${variant}`;
  }

  forNubbin(n: Nubbin): SpriteSheet {
    const key = SheetCache.nubbinKey(n);
    return this.get(key, () => {
      const family = speciesOf(n.species).family;
      if (n.stage === 'egg') return buildEggSheet(n.eggColor, family);
      if (n.stage === 'cocoon') return buildCocoonSheet(n.cocoonKind ?? 'evolve');
      // Other families use the generic creature drawer; their look is the species.
      const art = family !== 'chao' ? speciesArt(n.species) : undefined;
      if (art) return buildCreatureSheet(art);
      // A character look replaces the palette and adds its accessory as the hat.
      const look = n.hat ? CHARACTER_LOOKS[n.hat] : undefined;
      if (n.stage === 'adult' && n.form) {
        if (n.eternal) {
          const colors =
            look?.colors ??
            variantColors(eternalColors(n.eternal), n.eggColor, n.shiny, n.tone, n.eternal);
          return buildChaoSheet(
            lookOf(colors, 'normal', null, { ...n.parts }, true, n.hat, n.shiny),
          );
        }
        const colors =
          look?.colors ??
          variantColors(
            adultColors(n.form.band, n.form.type),
            n.eggColor,
            n.shiny,
            n.tone,
            n.form.band,
          );
        return buildChaoSheet(
          lookOf(colors, n.form.type, n.form.second, { ...n.parts }, false, n.hat, n.shiny),
        );
      }
      const hint = childHint(n.alignment);
      const base = hint === 'sun' ? CHILD_SUN : hint === 'moon' ? CHILD_MOON : CHILD_NEUTRAL;
      const colors = look?.colors ?? variantColors(base, n.eggColor, n.shiny, n.tone, hint);
      return buildChaoSheet(lookOf(colors, null, null, { ...n.parts }, false, n.hat, n.shiny));
    });
  }

  /** A generic adult look for race rivals. */
  rival(band: 'sun' | 'moon' | 'neutral', type: string): SpriteSheet {
    return this.get(`rival:${band}:${type}`, () =>
      buildChaoSheet(
        lookOf(adultColors(band, type), type as 'swim' | 'fly' | 'run' | 'power' | 'normal'),
      ),
    );
  }

  keeper(alignment: 'sun' | 'moon'): SpriteSheet {
    return this.get(`keeper:${alignment}`, () =>
      buildKeeperSheet(alignment === 'sun' ? SUN_KEEPER : MOON_KEEPER),
    );
  }

  props(): SpriteSheet {
    return this.get('props', () => buildPropSheet());
  }

  emotes(): SpriteSheet {
    return this.get('emotes', () => buildEmoteSheet());
  }

  dispose(): void {
    for (const s of this.sheets.values()) s.dispose();
    this.sheets.clear();
  }
}
