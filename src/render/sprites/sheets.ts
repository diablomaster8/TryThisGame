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
  shadowColors,
  variantColors,
  type ChaoColors,
  type ChaoLook,
} from './chao';
import { speciesOf } from '../../sim/species';
import { buildCreatureSheet } from './creature';
import { buildCocoonSheet, buildEggSheet } from './egg';
import { speciesArt } from './species-art';
import { buildEmoteSheet } from './emote';
import { TRAINERS } from '../../sim/trainers';
import { EXTRA_LOOKS } from '../../sim/npcs';
import { C } from './palette';
import { buildKeeperSheet } from './keeper';
import { buildPropSheet } from './props';
import { buildScenerySheet } from './scenery';

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
    const sh = n.shadow ? 'sh' : '-';
    if (n.species !== 'chao') return `species:${n.species}:${sh}`;
    const parts = SLOTS.map((s) => n.parts[s] ?? '-').join(',');
    const hat = n.hat ?? '-';
    const acc = `${n.scarf ?? '-'}:${n.glasses ? 'g' : '-'}:${n.hatDye ?? '-'}`;
    const variant = `${n.eggColor}:${n.shiny ? 's' : '-'}:${n.tone ?? '-'}:${sh}:${acc}`;
    if (n.stage === 'adult' && n.form) {
      if (n.eternal) return `eternal:${n.eternal}:${parts}:${hat}:${variant}`;
      return `adult:${n.form.band}:${n.form.type}:${n.form.second ?? '-'}:${parts}:${hat}:${variant}`;
    }
    return `child:${childHint(n.alignment)}:${parts}:${hat}:${variant}`;
  }

  forNubbin(n: Nubbin): SpriteSheet {
    const key = SheetCache.nubbinKey(n);
    return this.get(key, () => {
      // Accessories ride on top of whichever look the Nubbin has.
      const build = (look: ChaoLook): SpriteSheet =>
        buildChaoSheet({
          ...look,
          scarf: n.scarf ?? null,
          glasses: !!n.glasses,
          hatDye: n.hatDye ?? null,
        });
      const family = speciesOf(n.species).family;
      if (n.stage === 'egg') return buildEggSheet(n.eggColor, family);
      if (n.stage === 'cocoon') return buildCocoonSheet(n.cocoonKind ?? 'evolve');
      // Other families use the generic creature drawer; their look is the species.
      const art = family !== 'chao' ? speciesArt(n.species) : undefined;
      if (art) {
        if (!n.shadow) return buildCreatureSheet(art);
        // Shadow: ash-grey coat and an ember eye, whatever the species.
        return buildCreatureSheet({
          ...art,
          colors: {
            ...art.colors,
            body: C.dusk,
            shade: C.darkPlum,
            belly: C.lilacGrey,
            accent: C.plum,
            accent2: C.violet,
            eye: C.ember,
            outline: C.ink,
          },
        });
      }
      const tone = (c: ChaoColors): ChaoColors => (n.shadow ? shadowColors(c) : c);
      // A character look replaces the palette and adds its accessory as the hat.
      const look = n.hat ? CHARACTER_LOOKS[n.hat] : undefined;
      if (n.stage === 'adult' && n.form) {
        if (n.eternal) {
          const colors =
            look?.colors ??
            variantColors(eternalColors(n.eternal), n.eggColor, n.shiny, n.tone, n.eternal);
          return build(lookOf(tone(colors), 'normal', null, { ...n.parts }, true, n.hat, n.shiny));
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
        return build(
          lookOf(tone(colors), n.form.type, n.form.second, { ...n.parts }, false, n.hat, n.shiny),
        );
      }
      const hint = childHint(n.alignment);
      const base = hint === 'sun' ? CHILD_SUN : hint === 'moon' ? CHILD_MOON : CHILD_NEUTRAL;
      const colors = look?.colors ?? variantColors(base, n.eggColor, n.shiny, n.tone, hint);
      return build(lookOf(tone(colors), null, null, { ...n.parts }, false, n.hat, n.shiny));
    });
  }

  /** The grey Nubbins of the Hollow and Corvin's garden. */
  ambientShadow(): SpriteSheet {
    return this.get('ambient:shadow', () => buildChaoSheet(lookOf(shadowColors(CHILD_NEUTRAL))));
  }

  /** A generic adult look for race rivals. */
  rival(band: 'sun' | 'moon' | 'neutral', type: string): SpriteSheet {
    return this.get(`rival:${band}:${type}`, () =>
      buildChaoSheet(
        lookOf(adultColors(band, type), type as 'swim' | 'fly' | 'run' | 'power' | 'normal'),
      ),
    );
  }

  /** The Keeper's look is the active trainer's. */
  keeper(trainerId: string): SpriteSheet {
    return this.get(`keeper:${trainerId}`, () => {
      const look =
        EXTRA_LOOKS[trainerId] ??
        TRAINERS.find((t) => t.id === trainerId)?.look ??
        TRAINERS[0]!.look;
      return buildKeeperSheet(look);
    });
  }

  /** A species sprite with no Nubbin behind it: wild visitors and neighbours' pets. */
  species(id: string): SpriteSheet {
    return this.get(`species::-`, () => {
      const art = speciesArt(id);
      return art ? buildCreatureSheet(art) : buildChaoSheet(lookOf(CHILD_NEUTRAL));
    });
  }

  props(): SpriteSheet {
    return this.get('props', () => buildPropSheet());
  }

  /** Trees, bushes and buildings. */
  scenery(): SpriteSheet {
    return this.get('scenery', () => buildScenerySheet());
  }

  /** The emote ball; Shadow Nubbins carry a dark one. */
  emotes(shadow = false): SpriteSheet {
    return this.get(shadow ? 'emotes:shadow' : 'emotes', () =>
      buildEmoteSheet(shadow ? C.plum : undefined),
    );
  }

  dispose(): void {
    for (const s of this.sheets.values()) s.dispose();
    this.sheets.clear();
  }
}
