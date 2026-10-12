import type { Nubbin, PartSlot } from '../../sim/types';
import { childHint } from '../../sim/alignment';
import type { SpriteSheet } from './atlas';
import {
  adultColors,
  buildChaoSheet,
  CHILD_MOON,
  CHILD_NEUTRAL,
  CHILD_SUN,
  eternalColors,
  lookOf,
} from './chao';
import { buildCocoonSheet, buildEggSheet } from './egg';
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
    if (n.stage === 'egg') return `egg:${n.eggColor}`;
    if (n.stage === 'cocoon') return `cocoon:${n.cocoonKind ?? 'evolve'}`;
    const parts = SLOTS.map((s) => n.parts[s] ?? '-').join(',');
    if (n.stage === 'adult' && n.form) {
      if (n.eternal) return `eternal:${n.eternal}:${parts}`;
      return `adult:${n.form.band}:${n.form.type}:${n.form.second ?? '-'}:${parts}`;
    }
    return `child:${childHint(n.alignment)}:${parts}`;
  }

  forNubbin(n: Nubbin): SpriteSheet {
    const key = SheetCache.nubbinKey(n);
    return this.get(key, () => {
      if (n.stage === 'egg') return buildEggSheet(n.eggColor);
      if (n.stage === 'cocoon') return buildCocoonSheet(n.cocoonKind ?? 'evolve');
      if (n.stage === 'adult' && n.form) {
        if (n.eternal) {
          return buildChaoSheet(
            lookOf(eternalColors(n.eternal), 'normal', null, { ...n.parts }, true),
          );
        }
        return buildChaoSheet(
          lookOf(adultColors(n.form.band, n.form.type), n.form.type, n.form.second, { ...n.parts }),
        );
      }
      const hint = childHint(n.alignment);
      const colors = hint === 'sun' ? CHILD_SUN : hint === 'moon' ? CHILD_MOON : CHILD_NEUTRAL;
      return buildChaoSheet(lookOf(colors, null, null, { ...n.parts }));
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
