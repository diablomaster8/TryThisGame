import { CLIPS, frameKey, type ClipName } from '../render/sprites/animations';
import { DRAWN_ANGLES, type DrawnAngle } from '../render/sprites/angles';
import type { SpriteSheet } from '../render/sprites/atlas';
import {
  adultColors,
  CHILD_MOON,
  CHILD_NEUTRAL,
  CHILD_SUN,
  drawChao,
  lookOf,
  poseFor,
  type ChaoLook,
} from '../render/sprites/chao';
import { buildCocoonSheet, buildEggSheet, EGG_PALETTES } from '../render/sprites/egg';
import { buildEmoteSheet, EMOTE_SHAPES } from '../render/sprites/emote';
import { buildKeeperSheet, MOON_KEEPER, SUN_KEEPER } from '../render/sprites/keeper';
import type { PixelCanvas } from '../render/sprites/pixel-canvas';
import { buildPropSheet } from '../render/sprites/props';
import { CRITTER_SPECIES, partId } from '../sim/critters';
import { NUBBIN_TYPES, type PartSlot } from '../sim/types';

/**
 * Developer page at `?sprites`: every look, scaled up, so the art can be checked without
 * playing. Chao frames are drawn directly (no atlas) so the page stays quick even with
 * a hundred variants. Not linked from the game.
 */
export function mountSpriteGallery(root: HTMLElement, scale = 4): void {
  root.innerHTML = '';
  root.className = 'gallery';

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
      chao(`Adult ${band} ${type}`, lookOf(adultColors(band, type), type), [
        ...idleAngles,
        ['walk', 'side', 1],
        ['flap', 'front', 1],
      ]);
    }
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
  sheet('Cocoon', buildCocoonSheet(), [frameKey('idle', 'front', 0), frameKey('idle', 'front', 1)]);
  const keeperKeys = (clips: ClipName[]) => clipFrames(clips).map(([c, a, f]) => frameKey(c, a, f));
  sheet('Sun Keeper', buildKeeperSheet(SUN_KEEPER), keeperKeys(['idle', 'walk']));
  sheet('Moon Keeper', buildKeeperSheet(MOON_KEEPER), keeperKeys(['idle']));
  sheet('Props', buildPropSheet(), [frameKey('fruit', 'front', 0), frameKey('flower', 'front', 0)]);
  sheet(
    'Emotes',
    buildEmoteSheet(),
    EMOTE_SHAPES.flatMap((s) => [frameKey(s, 'front', 0), frameKey(s, 'front', 1)]),
  );
}
