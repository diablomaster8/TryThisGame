import type { Nubbin } from '../../sim/types';
import { childHint } from '../../sim/alignment';
import type { SpriteSheet } from './atlas';
import { adultColors, buildChaoSheet, CHILD_MOON, CHILD_NEUTRAL, CHILD_SUN } from './chao';
import { buildCocoonSheet, buildEggSheet } from './egg';
import { buildEmoteSheet } from './emote';
import { buildKeeperSheet, MOON_KEEPER, SUN_KEEPER } from './keeper';
import { buildPropSheet } from './props';

/**
 * Sprite sheets are generated on demand and cached by a style key, so eight Nubbins of
 * the same look share one texture. Hand-drawn sheets can later be registered under the
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
    if (n.stage === 'egg') return `egg:${n.eggColor}`;
    if (n.stage === 'cocoon') return 'cocoon';
    if (n.stage === 'adult' && n.form) return `adult:${n.form.band}:${n.form.type}`;
    return `child:${childHint(n.alignment)}`;
  }

  forNubbin(n: Nubbin): SpriteSheet {
    const key = SheetCache.nubbinKey(n);
    return this.get(key, () => {
      if (n.stage === 'egg') return buildEggSheet(n.eggColor);
      if (n.stage === 'cocoon') return buildCocoonSheet();
      if (n.stage === 'adult' && n.form)
        return buildChaoSheet(adultColors(n.form.band, n.form.type), true);
      const hint = childHint(n.alignment);
      return buildChaoSheet(
        hint === 'sun' ? CHILD_SUN : hint === 'moon' ? CHILD_MOON : CHILD_NEUTRAL,
      );
    });
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
