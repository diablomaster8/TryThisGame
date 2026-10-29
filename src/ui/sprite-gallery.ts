import { CLIPS, frameKey, type ClipName } from '../render/sprites/animations';
import { DRAWN_ANGLES, type DrawnAngle } from '../render/sprites/angles';
import type { SpriteSheet } from '../render/sprites/atlas';
import {
  adultColors,
  CHILD_MOON,
  CHILD_NEUTRAL,
  CHILD_SUN,
  CHARACTER_LOOKS,
  drawChao,
  eternalColors,
  lookOf,
  poseFor,
  swimPose,
  VARIANT_COLORS,
  variantColors,
  type ChaoLook,
  NO_PARTS,
} from '../render/sprites/chao';
import { buildCocoonSheet, buildEggSheet, EGG_PALETTES } from '../render/sprites/egg';
import { buildEmoteSheet, EMOTE_SHAPES } from '../render/sprites/emote';
import { drawCreature } from '../render/sprites/creature';
import { buildKeeperSheet } from '../render/sprites/keeper';
import { SPECIES_ART } from '../render/sprites/species-art';
import { TRAINERS } from '../sim/trainers';
import { speciesByFamily, type SpeciesStage } from '../sim/species';
import type { PixelCanvas } from '../render/sprites/pixel-canvas';
import { buildPropSheet } from '../render/sprites/props';
import { CRITTER_SPECIES, partId } from '../sim/critters';
import { NUBBIN_TYPES, type PartSlot } from '../sim/types';

/**
 * Developer page at `?sprites`: every look, scaled up, so the art can be checked without
 * playing. Chao frames are drawn directly (no atlas) so the page stays quick even with
 * a hundred variants. Not linked from the game.
 */
export function mountSpriteGallery(root: HTMLElement, scale = 2): void {
  root.innerHTML = '';
  root.className = 'gallery';

  // `?sprites&family=pocket|digi` (`&stage=`): a compact contact sheet of the art species,
  // each labelled with its id, for the likeness reviews (tests/tools/contact-sheet.cjs).
  const query = new URLSearchParams(location.search);
  const family = query.get('family');
  if (family === 'pocket' || family === 'digi') {
    speciesSheet(root, family, (query.get('stage') ?? undefined) as SpeciesStage | undefined);
    return;
  }

  const heading = (title: string) => {
    const h = document.createElement('h2');
    h.textContent = title;
    root.appendChild(h);
    const row = document.createElement('div');
    row.className = 'gallery-row';
    root.appendChild(row);
    return row;
  };

  const cell = (row: HTMLElement, pc: PixelCanvas, title: string) => {
    const c = document.createElement('canvas');
    c.width = pc.width * scale;
    c.height = pc.height * scale;
    c.title = title;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(pc.toCanvas(), 0, 0, c.width, c.height);
    row.appendChild(c);
  };

  /** Draw the given (clip, angle, frame) triples for a look. */
  const chao = (title: string, look: ChaoLook, frames: Array<[string, DrawnAngle, number]>) => {
    const row = heading(title);
    for (const [clip, angle, f] of frames) {
      const pose =
        clip === 'dizzy'
          ? { ...poseFor('idle', 0), eyes: 'dizzy' as const, mouth: 'sad' as const, headDrop: 1 }
          : clip === 'surprised'
            ? {
                ...poseFor('idle', 0),
                eyes: 'wide' as const,
                mouth: 'open' as const,
                arms: 'up' as const,
              }
            : clip === 'held'
              ? {
                  ...poseFor('idle', 0),
                  eyes: 'wide' as const,
                  legs: 'tucked' as const,
                  arms: 'out' as const,
                }
              : clip === 'paddle' || clip === 'crawl'
                ? swimPose(clip, f)
                : poseFor(clip as ClipName, f);
      cell(row, drawChao(angle, pose, look), frameKey(clip, angle, f));
    }
  };

  const clipFrames = (clips: ClipName[]): Array<[string, DrawnAngle, number]> => {
    const out: Array<[string, DrawnAngle, number]> = [];
    for (const clip of clips) {
      for (const angle of DRAWN_ANGLES) {
        for (let f = 0; f < CLIPS[clip].frames; f++) out.push([clip, angle, f]);
      }
    }
    return out;
  };
  const idleAngles: Array<[string, DrawnAngle, number]> = DRAWN_ANGLES.map((a) => ['idle', a, 0]);
  const stills: Array<[string, DrawnAngle, number]> = DRAWN_ANGLES.flatMap((a) => [
    ['dizzy', a, 0],
    ['surprised', a, 0],
    ['held', a, 0],
  ]);

  const neutral = lookOf(CHILD_NEUTRAL);
  chao('Child, neutral: idle + walk', neutral, clipFrames(['idle', 'walk']));
  chao(
    'Child, neutral: happy, sad, sleep, eat',
    neutral,
    clipFrames(['happy', 'sad', 'sleep', 'eat']),
  );
  chao('Child, neutral: swim, flap, stills', neutral, [...clipFrames(['swim', 'flap']), ...stills]);
  chao('Child, Sun-leaning', lookOf(CHILD_SUN), idleAngles);
  chao('Child, Moon-leaning', lookOf(CHILD_MOON), idleAngles);

  for (const band of ['neutral', 'sun', 'moon'] as const) {
    for (const type of NUBBIN_TYPES) {
      chao(
        `Adult ${band} ${type}`,
        lookOf(adultColors(band, type), type, null, NO_PARTS, false, null, false, band),
        [...idleAngles, ['walk', 'side', 1], ['flap', 'front', 1]],
      );
    }
  }

  for (const colour of Object.keys(VARIANT_COLORS)) {
    chao(`Egg colour ${colour}: child`, lookOf(variantColors(CHILD_NEUTRAL, colour)), [
      ['idle', 'front', 0],
      ['idle', 'side', 0],
    ]);
    const row = heading(`  …two-tone ${colour}/gold, shiny ${colour}, Sun adult, Moon adult`);
    const idle = poseFor('idle', 0);
    cell(
      row,
      drawChao('front', idle, lookOf(variantColors(CHILD_NEUTRAL, colour, false, 'gold'))),
      'two-tone',
    );
    cell(
      row,
      drawChao(
        'front',
        idle,
        lookOf(
          variantColors(CHILD_NEUTRAL, colour, true),
          null,
          null,
          undefined,
          false,
          null,
          true,
        ),
      ),
      'shiny',
    );
    cell(
      row,
      drawChao(
        'front',
        idle,
        lookOf(variantColors(adultColors('sun', 'swim'), colour, false, null, 'sun'), 'swim'),
      ),
      'sun adult',
    );
    cell(
      row,
      drawChao(
        'front',
        idle,
        lookOf(variantColors(adultColors('moon', 'power'), colour, false, null, 'moon'), 'power'),
      ),
      'moon adult',
    );
  }
  for (const [id, look] of Object.entries(CHARACTER_LOOKS)) {
    chao(
      `Character: ${look.label}`,
      lookOf(look.colors, 'normal', null, undefined, false, id),
      idleAngles,
    );
  }
  for (const hat of ['straw', 'crown', 'beanie', 'flower', 'bucket']) {
    chao(`Hat: ${hat}`, lookOf(CHILD_NEUTRAL, null, null, undefined, false, hat), idleAngles);
  }

  // LOOK-23: the three strokes, paddle, breaststroke and crawl.
  chao('Swim: paddle, breaststroke, crawl', lookOf(CHILD_NEUTRAL), [
    ['paddle', 'front', 0],
    ['paddle', 'side', 1],
    ['swim', 'front', 0],
    ['crawl', 'front', 0],
    ['crawl', 'side', 1],
  ]);

  for (const band of ['sun', 'moon', 'neutral'] as const) {
    chao(
      `Eternal ${band} (Chaos form)`,
      lookOf(eternalColors(band), 'normal', null, undefined, true, null, false, band),
      [...idleAngles, ['flap', 'front', 1], ['happy', 'front', 0]],
    );
  }

  for (const type of NUBBIN_TYPES) {
    if (type === 'normal') continue;
    for (const second of NUBBIN_TYPES) {
      if (second === 'normal' || second === type) continue;
      chao(
        `Adult neutral ${type} / ${second}`,
        lookOf(adultColors('neutral', type), type, second),
        [
          ['idle', 'front', 0],
          ['idle', 'side', 0],
        ],
      );
    }
  }

  for (const species of CRITTER_SPECIES) {
    const parts: Record<PartSlot, string | null> = {
      ears: null,
      tail: null,
      arms: null,
      back: null,
    };
    for (const slot of species.parts) parts[slot] = partId(species.id, slot);
    chao(
      `Critter parts: ${species.id} (${species.parts.join(' + ')})`,
      lookOf(CHILD_NEUTRAL, null, null, parts),
      idleAngles,
    );
  }

  // Sheets that are cheap to build whole.
  const sheet = (title: string, s: SpriteSheet, keys: string[]) => {
    const row = heading(title);
    const image = s.texture.image as HTMLCanvasElement;
    for (const key of keys) {
      const rect = s.frames.get(key);
      if (!rect) continue;
      const c = document.createElement('canvas');
      c.width = rect.w * scale;
      c.height = rect.h * scale;
      c.title = key;
      const ctx = c.getContext('2d');
      if (!ctx) continue;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, c.width, c.height);
      row.appendChild(c);
    }
  };
  for (const name of Object.keys(EGG_PALETTES)) {
    sheet(
      `Egg ${name}`,
      buildEggSheet(name),
      ['idle', 'wobbleL', 'wobbleR', 'crack1', 'crack2', 'held'].map((f) =>
        frameKey(f, 'front', 0),
      ),
    );
  }
  for (const kind of ['evolve', 'rebirth', 'depart'] as const) {
    sheet(`Cocoon: ${kind}`, buildCocoonSheet(kind), [
      frameKey('idle', 'front', 0),
      frameKey('idle', 'front', 1),
    ]);
  }
  const keeperKeys = (clips: ClipName[]) => clipFrames(clips).map(([c, a, f]) => frameKey(c, a, f));
  for (const t of TRAINERS) {
    sheet(`Keeper: ${t.id} (${t.band})`, buildKeeperSheet(t.look), keeperKeys(['idle']));
  // LOOK-25: the cocoons in a Nubbin's own shape: evolving by band (a child), then an adult's.
  const childMask = drawChao('front', poseFor('idle', 0), lookOf(CHILD_NEUTRAL));
  const adultMask = drawChao('front', poseFor('idle', 0), lookOf(CHILD_NEUTRAL, 'fly'));
  for (const [kind, band] of [
    ['evolve', 'sun'],
    ['evolve', 'moon'],
    ['evolve', 'neutral'],
    ['rebirth', null],
    ['depart', null],
  ] as const) {
    sheet(
      `Cocoon: ${kind} ${band ?? ''}`,
      buildCocoonSheet(kind, band, kind === 'evolve' ? childMask : adultMask),
      [frameKey('idle', 'front', 0), frameKey('idle', 'front', 1)],
    );
  }
  }
  for (const [id, art] of Object.entries(SPECIES_ART)) {
    const row = heading(`Species: ${id}`);
    for (const angle of DRAWN_ANGLES) cell(row, drawCreature(angle, poseFor('idle', 0), art), id);
    cell(row, drawCreature('side', poseFor('walk', 1), art), `${id} walk`);
  }
  sheet('Props', buildPropSheet(), [frameKey('fruit', 'front', 0), frameKey('flower', 'front', 0)]);
  sheet(
    'Emotes',
    buildEmoteSheet(),
    EMOTE_SHAPES.flatMap((s) => [frameKey(s, 'front', 0), frameKey(s, 'front', 1)]),
  );
}

/** Every art species of a family in a wrapping grid: four angles and a walk frame each. */
function speciesSheet(root: HTMLElement, family: 'pocket' | 'digi', stage?: SpeciesStage): void {
  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;background:#fff;padding:6px';
  root.appendChild(grid);
  for (const s of speciesByFamily(family, stage)) {
    const art = SPECIES_ART[s.id];
    if (!art) continue;
    const fig = document.createElement('figure');
    fig.style.cssText = 'margin:0;padding:2px;border:1px solid #ddd;text-align:center';
    const row = document.createElement('div');
    for (const pc of [
      drawCreature('front', poseFor('idle', 0), art),
      drawCreature('frontQuarter', poseFor('idle', 0), art),
      drawCreature('side', poseFor('idle', 0), art),
      drawCreature('back', poseFor('idle', 0), art),
    ]) {
      const c = document.createElement('canvas');
      c.width = pc.width;
      c.height = pc.height;
      const ctx = c.getContext('2d');
      if (!ctx) continue;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(pc.toCanvas(), 0, 0, c.width, c.height);
      row.appendChild(c);
    }
    const cap = document.createElement('figcaption');
    cap.textContent = s.id;
    cap.style.cssText = 'font:600 11px system-ui,sans-serif;color:#111';
    fig.append(row, cap);
    grid.appendChild(fig);
  }
}
