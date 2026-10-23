import type { SceneStage } from './story';
import { CG2_Y } from './tuning-y';
import { CG4_B4 } from './tuning-b4';
import { GROVE, LANTERN_POSTS } from './tuning';

/**
 * The campaigns' colour scripts, staged seasons and weather, and which story sets stand
 * when (campaign graphics H1, H2, H13, H18, M3, M5, N5, N6). Pure data and small helpers:
 * `ui/title-card.ts` turns a look into screen layers, and the two renderers' package-f
 * dressings build the sets. Nothing here reads or writes the sim.
 */

export type Motif = 'honey' | 'straw' | 'grid' | 'torch' | 'dawn' | 'dusk';
export type Season = NonNullable<SceneStage['season']>;
export type StagedWeather = NonNullable<SceneStage['weather']>;

export interface LookDef {
  /** The grade: a tint laid over the frame, how strongly, and the blend it uses. */
  tint: string;
  tintAlpha: number;
  /** 1 leaves colour alone; lower washes it toward grey. */
  sat: number;
  /** The shadow colour the frame's edges sink to, and how far. */
  shadow: string;
  shadowAlpha: number;
  /** The title-card motif and its accent colour. */
  motif: Motif;
  accent: string;
  /** A faint grid laid over the frame (Logged In). */
  grid: boolean;
  /** Where the tint gives way to the shadow, 0..1 from the centre (default 0.55). */
  core?: number;
  /** The grade's blend; overlay unless a look needs to darken (multiply) or stay gentle (soft-light). */
  blend?: 'overlay' | 'multiply' | 'soft-light';
  /**
   * A split-tone (cg2 H11, M10): a warm or bright key over the top of the frame (the sky and
   * the key light) and a cool shade under it (the shadows), in place of one flat tint. The
   * ground keeps its hue because the blend is soft-light and the shade stays near mid-blue.
   */
  split?: { key: string; keyAlpha: number; shade: string; shadeAlpha: number };
  /**
   * The dialogue box's skin for this campaign (K20): a class suffix the story UI adds as
   * `box-<box>` (Logged In's terminal bevel, the Beetle Road's ledger corner…). Unset: plain.
   */
  box?: string;
}

function look(
  tint: string,
  tintAlpha: number,
  sat: number,
  shadow: string,
  shadowAlpha: number,
  motif: Motif,
  accent: string,
): LookDef {
  return { tint, tintAlpha, sat, shadow, shadowAlpha, motif, accent, grid: motif === 'grid' };
}

/**
 * K11: set by the pixel dressing while the post pass draws the tale grade itself (a real
 * desaturation, render/post.ts), so the screen overlay does not lay a second one on top.
 * Full 3D has no such pass and takes the 'tale' look below.
 */
export const TALE_GRADE = { pixelPost: false };

/** `CAMPAIGN_LOOK`: one grade per campaign (Hazel's Grove has more, by chapter). */
export const CAMPAIGN_LOOK: Readonly<Record<string, LookDef>> = {
  hazel: look('#ffc46a', 0.3, 1, '#4a2a08', 0.28, 'honey', '#f2b84b'),
  'hazel-grey': look('#6f8fb8', 0.36, 0.72, '#14213a', 0.34, 'honey', '#9db6d8'),
  'hazel-pale': look('#cfdcf0', 0.1, 0.92, '#1a2a42', 0.2, 'honey', '#c9d8ee'),
  hundred: look('#e6d596', 0.24, 0.72, '#3a3010', 0.26, 'straw', '#d9c46a'),
  logged: look('#3fdcff', 0.26, 0.88, '#041a30', 0.36, 'grid', '#52e6ff'),
  'beetle-below': {
    ...look('#c46a1c', 0.85, 0.8, '#0a0300', 0.92, 'torch', '#ff9a3c'),
    core: 0.3,
    blend: 'multiply',
  },
  beetle: look('#ff9a2c', 0.34, 0.95, '#2c1002', 0.36, 'torch', '#ffb347'),
  // H11: a split-tone, not a pink multiply (it turned paths and soil brick-red at 6.5).
  dawn: {
    ...look('#ff9db8', 0.32, 1, '#3a1430', 0.26, 'dawn', '#ffb3c6'),
    blend: 'soft-light',
    split: {
      key: CG2_Y.dawn.key,
      keyAlpha: CG2_Y.dawn.keyAlpha,
      shade: CG2_Y.dawn.shade,
      shadeAlpha: CG2_Y.dawn.shadeAlpha,
    },
  },
  // M10: Hazel's cold, bright morning: cool shadows, high-key whites.
  crisp: {
    ...look(CG2_Y.crisp.key, 0.2, CG2_Y.crisp.sat, '#1c2c4a', 0.16, 'honey', '#d8e6fa'),
    blend: 'soft-light',
    split: {
      key: CG2_Y.crisp.key,
      keyAlpha: CG2_Y.crisp.keyAlpha,
      shade: CG2_Y.crisp.shade,
      shadeAlpha: CG2_Y.crisp.shadeAlpha,
    },
  },
  dusk: look('#8a6cff', 0.34, 0.9, '#120a30', 0.34, 'dusk', '#b5a0ff'),
  // K11: a told tale, warm and washed, the frame's edges sunk in a soft vignette.
  tale: {
    ...look(
      CG4_B4.tale.css.tint,
      CG4_B4.tale.css.tintAlpha,
      CG4_B4.tale.css.sat,
      CG4_B4.tale.css.shadow,
      CG4_B4.tale.css.shadowAlpha,
      'honey',
      CG4_B4.tale.css.accent,
    ),
    core: CG4_B4.tale.css.core,
  },
};

/** The minimum of the story state a look needs (a subset of `StageFlags`). */
export interface LookInput {
  campaign: string;
  chapter: number;
  storyChapter: number | null;
  half: 'dawn' | 'dusk' | null;
  /** Number of chapters in a storyline, for The Hundred Days' mending. */
  chapters?: number | undefined;
}

/** The grade for a story moment: a campaign's own, `stage.grade` naming one, or Hazel's. */
export function lookFor(i: LookInput, stage: SceneStage | null): { key: string; look: LookDef } {
  const named = stage?.grade && CAMPAIGN_LOOK[stage.grade] ? stage.grade : null;
  // K11: a told tale takes its own grade (the pixel view's post pass does it there).
  const tale = !named && stage?.tale === true && !TALE_GRADE.pixelPost;
  let key = named ?? (tale ? 'tale' : i.campaign);
  if (!named && !tale) {
    if (key === 'hazel')
      key = i.chapter >= 12 ? 'hazel-pale' : i.chapter >= 9 ? 'hazel-grey' : 'hazel';
    if (key === 'dawn' || key === 'dusk') key = i.half ?? key;
  }
  const base = CAMPAIGN_LOOK[key] ?? CAMPAIGN_LOOK.hazel!;
  if (key !== 'hundred') return { key, look: base };
  // Bleached straw, moving to green as the Fold is mended.
  const n = Math.max(2, i.chapters ?? 12);
  const f = Math.min(1, Math.max(0, (i.storyChapter ?? 0) / (n - 1)));
  return {
    key,
    look: {
      ...base,
      tint: mix('#e6d596', '#7fcf6c', f),
      sat: 0.72 + 0.28 * f,
      accent: mix('#d9c46a', '#7fcf6c', f),
    },
  };
}

const rgbaOf = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a.toFixed(3)})`;
};

/**
 * The CSS background of a split-tone grade: the key over the top half, the shade under it,
 * then the look's shadow colour at the frame's edges. Null for a look with no split.
 */
export function splitGradeCss(look: LookDef): string | null {
  const s = look.split;
  if (!s) return null;
  return (
    `radial-gradient(ellipse at 50% 45%,transparent 0%,transparent ${Math.round((look.core ?? 0.55) * 100)}%,` +
    `${rgbaOf(look.shadow, look.shadowAlpha)} 100%),` +
    `linear-gradient(to bottom,${rgbaOf(s.key, s.keyAlpha)} 0%,${rgbaOf(s.key, s.keyAlpha * 0.7)} 38%,` +
    `${rgbaOf(s.shade, s.shadeAlpha * 0.6)} 62%,${rgbaOf(s.shade, s.shadeAlpha)} 100%)`
  );
}

function mix(a: string, b: string, f: number): string {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * f));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

// ---------------------------------------------------------------------------- seasons (H1)

/** Hazel's Grove's season per chapter: late spring, high summer, autumn, midwinter, a cold bright morning. */
export function hazelSeason(chapter: number): { season: Season; strength: number } | null {
  if (chapter < 1 || chapter > 12) return null;
  if (chapter <= 4) return { season: 'spring', strength: 1 };
  if (chapter <= 6) return { season: 'summer', strength: 1 };
  if (chapter <= 8) return { season: 'autumn', strength: 1 };
  if (chapter <= 11) return { season: 'winter', strength: 1 };
  return { season: 'winter', strength: 0.55 };
}

export interface GroundTint {
  color: string;
  /** Strength on the nearest ground; it fades toward the horizon. */
  alpha: number;
  blend: 'soft-light' | 'screen' | 'multiply' | 'overlay';
  /** A light white rime speckled over the ground (cold weather and winter). */
  rime?: boolean;
}

export const SEASON_TINT: Readonly<Record<Season, GroundTint>> = {
  spring: { color: '#9be07c', alpha: 0.34, blend: 'soft-light' },
  summer: { color: '#ffdb5c', alpha: 0.36, blend: 'soft-light' },
  autumn: { color: '#ee8a26', alpha: 0.5, blend: 'soft-light' },
  winter: { color: '#b4cdea', alpha: 0.38, blend: 'overlay', rime: true },
};

/** Weather that stains the ground even when its particles are off (reduced motion). */
export const WEATHER_TINT: Readonly<Partial<Record<StagedWeather, GroundTint>>> = {
  rain: { color: '#5f7e9c', alpha: 0.4, blend: 'multiply' },
  snow: { color: '#bcd6f2', alpha: 0.34, blend: 'overlay', rime: true },
  frost: { color: '#a9c8ee', alpha: 0.32, blend: 'overlay', rime: true },
};

/** The staged weather a scene asks for: its own `stage.weather`, else by scene or chapter. */
export function weatherFor(
  stage: SceneStage | null,
  sceneId: string | null,
  campaign: string,
  chapterTitle: string | null,
): StagedWeather | null {
  if (!sceneId) return null;
  if (stage?.weather) return stage.weather === 'clear' ? null : stage.weather;
  if (campaign === 'hazel') {
    if (sceneId.startsWith('c6-')) return 'rain';
    if (sceneId.startsWith('c7-')) return 'frost';
    if (sceneId.startsWith('c4-out')) return 'wind';
  }
  if (campaign === 'hundred' && chapterTitle === 'The Mire') return 'rain';
  return null;
}

/** The season to draw: the staged one, else the campaign's own (Hazel's, per chapter). */
export function seasonFor(
  stage: SceneStage | null,
  campaign: string,
  chapter: number,
): { season: Season; strength: number } | null {
  if (stage?.season) return { season: stage.season, strength: 1 };
  return campaign === 'hazel' ? hazelSeason(chapter) : null;
}

/** Held effects a scene asks for. */
export function fxFor(
  stage: SceneStage | null,
  sceneId: string | null,
): { fireflies: boolean; seed: boolean } {
  const fx = stage?.fx ?? [];
  return {
    fireflies: fx.includes('fireflies') || !!sceneId?.startsWith('c8-nova'),
    seed: fx.includes('seed') || !!sceneId?.startsWith('c10-moss-light'),
  };
}

// ---------------------------------------------------------------------------- story sets

export interface SetFlags {
  /** Hazel's Grove chapter 12: lantern bunting, stalls, the picnic and the cake. */
  festival: boolean;
  /** The Hundred Days' "Meadow Days": the cloth and basket. */
  picnic: boolean;
  /** The Beetle Road: the guard house, three banners, the cart and the weather machine. */
  beetle: boolean;
  /** Logged In: the scoreboard and the holographic fence. */
  logged: boolean;
  /** Logged In chapter 7's scenes: the white room with one chair. */
  rootRoom: boolean;
  /** Hazel's chapter 5: a plum tree and its wasps. */
  plums: boolean;
}

export interface SetInput {
  campaign: string;
  chapter: number;
  sceneId: string | null;
  location: string;
  chapterTitle: string | null;
}

export function setFlags(i: SetInput): SetFlags {
  const home = i.location === 'grove';
  return {
    festival: home && i.campaign === 'hazel' && i.chapter === 12,
    picnic: home && i.campaign === 'hundred' && i.chapterTitle === 'Meadow Days',
    beetle: home && i.campaign === 'beetle',
    logged: home && i.campaign === 'logged',
    rootRoom: home && i.campaign === 'logged' && !!i.sceneId?.startsWith('l-c7'),
    plums: home && i.campaign === 'hazel' && i.chapter === 5,
  };
}

/** The Beetle Road's Hollow Below torches (M14), set by the dressings and read by the dungeon art. */
export const DRESSING_FLAGS = { dungeon: { torches: false } };

/** Chapter 3 of The Beetle Road: "torches someone keeps lit and nobody admits to". */
export function dungeonTorchesLit(campaign: string, storyChapter: number | null): boolean {
  return campaign === 'beetle' && storyChapter === 2;
}

/** The bunting's shape, so the ending reads without colour (N6). */
export type BuntingShape = 'star' | 'leaf' | 'moon';

export function buntingShape(ending: string | null, finalChoice: unknown): BuntingShape {
  if (ending) {
    if (/wild|long-road|open/.test(ending)) return 'leaf';
    if (/shadow|moss-sleeps|empty/.test(ending)) return 'moon';
    return 'star';
  }
  // Before the ending is played, the choice made in chapter 12 leans it.
  return finalChoice === 'free' ? 'leaf' : 'star';
}

/**
 * Whether the race about to start is the story's (Hazel's chapter 5, `c5-circuit`): the
 * dressing sets it every frame, the race views read it at the start of a race (M4).
 */
export const RACE_LOOK = { story: false };

/** Whether a spot on the holographic fence's ring is clear of water, the bridge and the posts. */
export function holoClear(x: number, z: number): boolean {
  const p = GROVE.pond;
  if (Math.hypot(x - p.x, z - p.z) < p.r + 2.5) return false;
  if (Math.hypot(x - GROVE.bridge.x, z - GROVE.bridge.z) < 4) return false;
  return !LANTERN_POSTS.some((l) => Math.hypot(x - l.x, z - l.z) < 1.8);
}
