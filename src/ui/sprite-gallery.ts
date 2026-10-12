import { CLIPS, frameKey, type ClipName } from '../render/sprites/animations';
import { DRAWN_ANGLES } from '../render/sprites/angles';
import type { SpriteSheet } from '../render/sprites/atlas';
import {
  adultColors,
  buildChaoSheet,
  CHILD_MOON,
  CHILD_NEUTRAL,
  CHILD_SUN,
} from '../render/sprites/chao';
import { buildCocoonSheet, buildEggSheet, EGG_PALETTES } from '../render/sprites/egg';
import { buildEmoteSheet, EMOTE_SHAPES } from '../render/sprites/emote';
import { buildKeeperSheet, MOON_KEEPER, SUN_KEEPER } from '../render/sprites/keeper';
import { buildPropSheet } from '../render/sprites/props';

/**
 * Developer page at `?sprites`: every generated sheet, scaled up, so the art can be
 * checked without playing. Not linked from the game.
 */
export function mountSpriteGallery(root: HTMLElement, scale = 4): void {
  root.innerHTML = '';
  root.className = 'gallery';

  const section = (title: string, sheet: SpriteSheet, keys: string[]) => {
    const h = document.createElement('h2');
    h.textContent = title;
    root.appendChild(h);
    const row = document.createElement('div');
    row.className = 'gallery-row';
    const image = sheet.texture.image as HTMLCanvasElement;
    for (const key of keys) {
      const rect = sheet.frames.get(key);
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
    root.appendChild(row);
  };

  const chaoKeys = (clips: ClipName[]) => {
    const keys: string[] = [];
    for (const clip of clips) {
      for (const angle of DRAWN_ANGLES) {
        for (let f = 0; f < CLIPS[clip].frames; f++) keys.push(frameKey(clip, angle, f));
      }
    }
    return keys;
  };
  const stills = DRAWN_ANGLES.flatMap((a) => [
    frameKey('dizzy', a, 0),
    frameKey('surprised', a, 0),
    frameKey('held', a, 0),
  ]);

  section('Child, neutral: idle + walk', buildChaoSheet(CHILD_NEUTRAL), chaoKeys(['idle', 'walk']));
  section(
    'Child, neutral: happy, sad, sleep, eat',
    buildChaoSheet(CHILD_NEUTRAL),
    chaoKeys(['happy', 'sad', 'sleep', 'eat']),
  );
  section('Child, neutral: swim, flap, stills', buildChaoSheet(CHILD_NEUTRAL), [
    ...chaoKeys(['swim', 'flap']),
    ...stills,
  ]);
  section('Child, Sun-leaning', buildChaoSheet(CHILD_SUN), chaoKeys(['idle']));
  section('Child, Moon-leaning', buildChaoSheet(CHILD_MOON), chaoKeys(['idle']));
  for (const band of ['neutral', 'sun', 'moon'] as const) {
    for (const type of ['normal', 'swim', 'fly', 'run', 'power']) {
      section(`Adult ${band} ${type}`, buildChaoSheet(adultColors(band, type), true), [
        frameKey('idle', 'front', 0),
        frameKey('idle', 'side', 0),
      ]);
    }
  }
  for (const name of Object.keys(EGG_PALETTES)) {
    section(
      `Egg ${name}`,
      buildEggSheet(name),
      ['idle', 'wobbleL', 'wobbleR', 'crack1', 'crack2', 'held'].map((f) =>
        frameKey(f, 'front', 0),
      ),
    );
  }
  section('Cocoon', buildCocoonSheet(), [
    frameKey('idle', 'front', 0),
    frameKey('idle', 'front', 1),
  ]);
  section(
    'Sun Keeper',
    buildKeeperSheet(SUN_KEEPER),
    chaoKeys(['idle', 'walk']).filter((k) => k.startsWith('idle') || k.startsWith('walk')),
  );
  section('Moon Keeper', buildKeeperSheet(MOON_KEEPER), chaoKeys(['idle']));
  section('Props', buildPropSheet(), [
    frameKey('fruit', 'front', 0),
    frameKey('flower', 'front', 0),
  ]);
  section(
    'Emotes',
    buildEmoteSheet(),
    EMOTE_SHAPES.flatMap((s) => [frameKey(s, 'front', 0), frameKey(s, 'front', 1)]),
  );
}
