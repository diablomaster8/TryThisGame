import { buildShinyGlintSheet } from './shiny-glint';
import type { KeeperAlignment, Nubbin } from '../../sim/types';
import { ALL_PART_SLOTS, partSteps } from './part-size';
import { childLean, leanStep } from './child-hint';
import { sheetFromImage, type SpriteSheet } from './atlas';
import {
  adultColors,
  buildChaoSheet,
  CHILD_MOON,
  CHILD_MOON_FAINT,
  CHILD_NEUTRAL,
  CHILD_SUN,
  CHILD_SUN_FAINT,
  CHARACTER_LOOKS,
  eternalColors,
  lookOf,
  NO_PARTS,
  secondColors,
  shadowColors,
  variantColors,
  type ChaoColors,
  type ChaoLook,
} from './chao';
import { speciesOf } from '../../sim/species';
import { isJewel } from '../../sim/nubbin';
import { buildCreatureSheet } from './creature';
import { buildEggSheet } from './egg';
import { buildCocoonFor, cocoonKey } from './cocoon';
import { speciesArt } from './species-art';
import { buildEmoteSheet } from './emote';
import { keeperOutfit, trainerLook } from '../keeper-look';
import { C } from './palette';
import { buildGrandchildSheet, buildKeeperSheet } from './keeper';
import { npcLookOf, WEATHERED } from '../../config/npc-looks';
import { buildPaintedProps } from '../paint/decor';
import { buildDungeonProps } from '../paint/dungeon';
import { buildPaintedScenery } from '../paint/scenery';
import { SHEET_CACHE } from '../../config/tuning-px';

/**
 * C6: a copy of `src` through a stone-grey ramp. Every pixel keeps its lightness and loses
 * its hue (a touch of moss green stays in the mid tones), and about one pixel in eight is a
 * lichen speckle, placed by a fixed hash so the sheet is the same every build.
 */
function weatherSheet(src: SpriteSheet): SpriteSheet {
  const from = src.texture.image as HTMLCanvasElement;
  const canvas = document.createElement('canvas');
  canvas.width = from.width;
  canvas.height = from.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return src;
  ctx.drawImage(from, 0, 0);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if ((d[i + 3] ?? 0) === 0) continue;
    const r = d[i] ?? 0;
    const g = d[i + 1] ?? 0;
    const b = d[i + 2] ?? 0;
    const l = r * 0.3 + g * 0.59 + b * 0.11;
    const px = i >> 2;
    const h = ((px * 2654435761) >>> 0) % 97;
    const speck = h < 12 ? -16 : h < 20 ? 12 : 0;
    const k = Math.max(0, Math.min(255, l * 0.92 + 14 + speck));
    d[i] = k * 0.93;
    d[i + 1] = k * 0.99;
    d[i + 2] = k * 0.9;
  }
  ctx.putImageData(img, 0, 0);
  const map: Record<string, [number, number, number, number]> = {};
  for (const [key, r] of src.frames) map[key] = [r.x, r.y, r.w, r.h];
  return sheetFromImage(canvas, map, src.cellW, src.cellH);
}

/**
 * Sprite sheets are generated on demand and cached by a style key, so Nubbins of the
 * same look share one texture. Hand-drawn sheets can later be registered under the
 * same keys through `register`.
 */
/**
 * LOOK-49: a child's palette by how far it leans (`childLean`): neutral, then a faint step,
 * then the full Sun or Moon child past halfway.
 */
function childLook(alignment: number): { id: string; colors: ChaoColors } {
  const lean = childLean(alignment);
  const step = leanStep(lean, 2);
  if (lean.band === 'sun')
    return { id: `sun${step}`, colors: step > 1 ? CHILD_SUN : CHILD_SUN_FAINT };
  if (lean.band === 'moon')
    return { id: `moon${step}`, colors: step > 1 ? CHILD_MOON : CHILD_MOON_FAINT };
  return { id: 'neutral', colors: CHILD_NEUTRAL };
}

export class SheetCache {
  private readonly sheets = new Map<string, { sheet: SpriteSheet; usedMs: number }>();
  private readonly overrides = new Map<string, SpriteSheet>();

  /**
   * @param now  the clock eviction reads (a test hands in its own).
   * @param limits  how many sheets to keep, and how long a drawn sheet is safe.
   */
  constructor(
    private readonly now: () => number = () => performance.now(),
    private readonly limits: { maxSheets: number; idleMs: number } = SHEET_CACHE,
  ) {}

  register(key: string, sheet: SpriteSheet): void {
    this.overrides.set(key, sheet);
  }

  get(key: string, build: () => SpriteSheet): SpriteSheet {
    const o = this.overrides.get(key);
    if (o) return o;
    const now = this.now();
    const hit = this.sheets.get(key);
    if (hit) {
      hit.usedMs = now;
      return hit.sheet;
    }
    const sheet = build();
    this.sheets.set(key, { sheet, usedMs: now });
    if (this.sheets.size > this.limits.maxSheets) this.evict(now);
    return sheet;
  }

  /** How many generated sheets are held (for tests and the debug panel). */
  get size(): number {
    return this.sheets.size;
  }

  /**
   * Drop the least recently used sheets, disposing their textures, until the cache is back
   * under its limit (every hat, dye or part change used to leave a sheet behind for good).
   * Sheets drawn in the last `idleMs` stay, so a frame that needs many cannot thrash; a
   * dropped sheet is simply rebuilt the next time something asks for it.
   */
  private evict(now: number): void {
    const stale = [...this.sheets].filter(([, e]) => now - e.usedMs >= this.limits.idleMs);
    stale.sort((a, b) => a[1].usedMs - b[1].usedMs);
    for (const [key, e] of stale) {
      if (this.sheets.size <= this.limits.maxSheets) break;
      this.sheets.delete(key);
      e.sheet.dispose();
    }
  }

  /**
   * The style key a Nubbin renders with right now. C6: a weathered Nubbin (Moss while he is
   * "the grey shape") adds a `~weathered` variant key, a grey-ramp copy of its own sheet.
   */
  static nubbinKey(n: Nubbin): string {
    const base = SheetCache.baseKey(n);
    return WEATHERED.ids.has(n.id) && n.stage !== 'egg' && n.stage !== 'cocoon'
      ? `${base}~weathered`
      : base;
  }

  private static baseKey(n: Nubbin): string {
    if (n.stage === 'egg') return `egg:${n.eggColor}:${n.species}`;
    if (n.stage === 'cocoon') return cocoonKey(n);
    const sh = n.shadow ? 'sh' : '-';
    if (n.species !== 'chao') return `species:${n.species}:${sh}`;
    // Each filled slot carries its size step (LOOK-36): a level crossing a step redraws.
    const steps = partSteps(n);
    const parts = ALL_PART_SLOTS.map((s) => {
      const id = n.parts[s];
      return id ? `${id}@${steps[s] ?? 1}` : '-';
    }).join(',');
    const hat = n.hat ?? '-';
    const acc = `${n.scarf ?? '-'}:${n.glasses ? 'g' : '-'}:${n.hatDye ?? '-'}`;
    const shiny = n.shiny || n.heirloom;
    const variant = `${n.eggColor}:${shiny ? 's' : '-'}:${n.tone ?? '-'}:${sh}:${acc}:${n.finish ?? '-'}`;
    if (n.stage === 'adult' && n.form) {
      if (n.eternal) return `eternal:${n.eternal}:${parts}:${hat}:${variant}`;
      return `adult:${n.form.band}:${n.form.type}:${n.form.second ?? '-'}:${parts}:${hat}:${variant}`;
    }
    return `child:${childLook(n.alignment).id}:${parts}:${hat}:${variant}`;
  }

  forNubbin(n: Nubbin): SpriteSheet {
    const key = SheetCache.nubbinKey(n);
    if (key.endsWith('~weathered')) {
      return this.get(key, () => weatherSheet(this.forNubbin({ ...n, id: `${n.id}~plain` })));
    }
    return this.get(key, () => {
      // A jewel Nubbin wears the gem finish, unless a Shadow's grey or a character look covers it.
      const gem = isJewel(n.eggColor) && !n.shadow && !(n.hat && CHARACTER_LOOKS[n.hat]);
      // Accessories ride on top of whichever look the Nubbin has.
      const build = (look: ChaoLook): SpriteSheet =>
        buildChaoSheet({
          ...look,
          partSteps: partSteps(n),
          gem,
          finish: n.shadow ? null : (n.finish ?? null),
          scarf: n.scarf ?? null,
          glasses: !!n.glasses,
          hatDye: n.hatDye ?? null,
        });
      const family = speciesOf(n.species).family;
      if (n.stage === 'egg') return buildEggSheet(n.eggColor, family);
      if (n.stage === 'cocoon') return buildCocoonFor(n);
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
            variantColors(
              eternalColors(n.eternal),
              n.eggColor,
              n.shiny || n.heirloom,
              n.tone,
              n.eternal,
            );
          return build(
            lookOf(
              tone(colors),
              'normal',
              null,
              { ...n.parts },
              // LOOK-37: every Eternal carries great wings now (the Moon's are its bat wings).
              true,
              n.hat,
              n.shiny || n.heirloom,
              n.eternal,
            ),
          );
        }
        const colors =
          look?.colors ??
          variantColors(
            // A second evolution blends its colours toward the second type, as in 3D.
            n.form.second
              ? secondColors(n.form.band, n.form.type, n.form.second)
              : adultColors(n.form.band, n.form.type),
            n.eggColor,
            n.shiny || n.heirloom,
            n.tone,
            n.form.band,
          );
        return build(
          lookOf(
            tone(colors),
            n.form.type,
            n.form.second,
            { ...n.parts },
            false,
            n.hat,
            n.shiny || n.heirloom,
            n.form.band,
          ),
        );
      }
      const hint = childLean(n.alignment).band;
      const base = childLook(n.alignment).colors;
      const colors =
        look?.colors ?? variantColors(base, n.eggColor, n.shiny || n.heirloom, n.tone, hint);
      return build(
        lookOf(tone(colors), null, null, { ...n.parts }, false, n.hat, n.shiny || n.heirloom),
      );
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
        lookOf(
          adultColors(band, type),
          type as 'swim' | 'fly' | 'run' | 'power' | 'normal',
          null,
          NO_PARTS,
          false,
          null,
          false,
          band,
        ),
      ),
    );
  }

  /**
   * A Keeper sheet. With a side it is the player's (or the co-op partner's) avatar: Hazel's
   * grandchild in the chosen trainer's outfit with the Sun or Moon trim (`keeperOutfit`,
   * the colour rule both renderers share). Without one it is the plain trainer look, for visitors, NPCs,
   * dialogue portraits and the trainer picker.
   */
  keeper(trainerId: string, side?: KeeperAlignment): SpriteSheet {
    if (!side)
      return this.get(`keeper:${trainerId}`, () =>
        buildKeeperSheet(trainerLook(trainerId), npcLookOf(trainerId)),
      );
    // The player is Hazel's grandchild, never a copy of the trainer whose role they took:
    // their own face and hair, in that role's outfit with the side's trim (fix 2026-10-25).
    return this.get(`keeper:${trainerId}:${side}:grandchild`, () =>
      buildGrandchildSheet(keeperOutfit(trainerId, side)),
    );
  }

  /** A species sprite with no Nubbin behind it: wild visitors and neighbours' pets. */
  species(id: string): SpriteSheet {
    return this.get(`species:${id}`, () => {
      const art = speciesArt(id);
      return art ? buildCreatureSheet(art) : buildChaoSheet(lookOf(CHILD_NEUTRAL));
    });
  }

  props(): SpriteSheet {
    return this.get('props', () => buildPaintedProps());
  }

  /** Torches, crystals, the chest, stair markers and loot of the Hollow Below. */
  dungeon(): SpriteSheet {
    return this.get('dungeon', () => buildDungeonProps());
  }

  /** Trees, bushes and buildings. */
  scenery(): SpriteSheet {
    return this.get('scenery', () => buildPaintedScenery());
  }

  /** The emote ball; Shadow Nubbins carry a dark one. */
  emotes(shadow = false): SpriteSheet {
    return this.get(shadow ? 'emotes:shadow' : 'emotes', () =>
      buildEmoteSheet(shadow ? C.plum : undefined),
    );
  }

  /** The shiny sweep over the head, one small sheet per head size (LOOK-30). */
  shinyGlint(grow: number): SpriteSheet {
    return this.get(`shiny-glint:${grow}`, () => buildShinyGlintSheet(grow));
  }

  dispose(): void {
    for (const e of this.sheets.values()) e.sheet.dispose();
    this.sheets.clear();
  }
}
