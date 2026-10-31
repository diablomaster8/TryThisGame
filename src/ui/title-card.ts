import {
  fxFor,
  splitGradeCss,
  lookFor,
  SEASON_TINT,
  seasonFor,
  setFlags,
  weatherFor,
  WEATHER_TINT,
  type GroundTint,
  type LookDef,
  type Motif,
  type SetFlags,
  type StagedWeather,
} from '../config/campaign-look';
import { seasonHere } from '../render/grove-season';
import { HAZEL_PS } from '../config/strings-fun-r6';
import type { SceneStage } from '../config/story';
import { LOOK_F } from '../config/tuning-f';
import { TITLE_CARD_TEXT } from '../config/strings';
import { stageFlags, type StageFlags } from '../render/scene-stage';
import { chapterTitle, storylineOf } from '../sim/storyline';
import type { World } from '../sim/types';
import { CG4_U4 } from '../config/tuning-u4';
import { drawSilhouette, type GradeFrame } from './look-paint';
import { CHAPTER_SAY_TEXT } from '../config/strings-kids';
import { numberWord } from './edu-voice';
import { speakLine } from './lesson';

/**
 * The campaigns' screen layers and chapter title cards (campaign graphics H18, and the
 * screen-space half of H1, H2 and M5). Both renderers' package-f dressings call
 * `driveLook` every frame with what the story asks for; this module owns the DOM:
 *
 * - a grade layer (the campaign's tint, with its shadow colour at the edges),
 * - a desaturation layer, a ground-weighted season or weather tint, and Logged In's grid,
 * - a low-resolution canvas for staged rain, snow, wind and the pale seed,
 * - the chapter title card, drawn in canvas.
 *
 * All of it is `pointer-events: none` and sits between the game canvas and the HUD. Under
 * reduced motion no particle moves, the seed is a still glow at its end point, and the card
 * cuts in and out with no fade. If no dressing drives it for a moment (the title screen, a
 * minigame) it hides itself.
 */

type Blend = GroundTint['blend'] | LookDef['tint'] | string;

interface Layers {
  root: HTMLDivElement;
  grade: HTMLDivElement;
  sat: HTMLDivElement;
  ground: HTMLDivElement;
  grid: HTMLDivElement;
  fx: HTMLCanvasElement;
}

export interface LookFrame {
  look: LookDef | null;
  /** The season's or weather's tint on the ground, with its strength 0..1. */
  ground: { tint: GroundTint; strength: number } | null;
  weather: StagedWeather | null;
  seed: boolean;
  reduce: boolean;
}

let layers: Layers | null = null;
let lastGrade: GradeFrame | null = null;
let lastDrive = 0;
let watchdog: number | null = null;
const written = new Map<string, string>();
const particles = {
  weather: null as StagedWeather | null,
  x: [] as number[],
  y: [] as number[],
  v: [] as number[],
  seedStart: -1,
  lastMs: 0,
};

function div(css: string): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = `position:absolute;inset:0;pointer-events:none;${css}`;
  d.setAttribute('aria-hidden', 'true');
  d.hidden = true;
  return d;
}

function ensure(): Layers | null {
  if (layers) return layers;
  const app = document.getElementById('app');
  if (!app) return null;
  const root = document.createElement('div');
  root.className = 'campaign-look';
  root.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
  root.setAttribute('aria-hidden', 'true');
  const grade = div('');
  const sat = div('background:#808080;mix-blend-mode:saturation;');
  const ground = div('');
  const grid = div(
    'opacity:0.5;background-size:48px 48px;' +
      'background-image:linear-gradient(rgba(82,230,255,0.10) 1px,transparent 1px),' +
      'linear-gradient(90deg,rgba(82,230,255,0.10) 1px,transparent 1px);',
  );
  const fx = document.createElement('canvas');
  fx.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;pointer-events:none;';
  fx.hidden = true;
  root.append(grade, sat, ground, grid, fx);
  // Between the game canvas and the HUD, so every control stays on top and tappable.
  const hud = document.getElementById('hud');
  if (hud && hud.parentElement === app) app.insertBefore(root, hud);
  else app.appendChild(root);
  layers = { root, grade, sat, ground, grid, fx };
  // Rendering holds still behind a story dialogue, so a quiet frame loop is not "gone": hide
  // only while the title screen is up (it is the only thing that replaces the game).
  watchdog = window.setInterval(() => {
    if (
      layers &&
      performance.now() - lastDrive > 700 &&
      document.querySelector('.title-card')?.getClientRects().length
    )
      layers.root.hidden = true;
  }, 400);
  return layers;
}

/** Write a style or attribute only when it changed, so a steady look costs nothing. */
function put(key: string, value: string, apply: () => void): void {
  if (written.get(key) === value) return;
  written.set(key, value);
  apply();
}

const rgba = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a.toFixed(3)})`;
};

function setBlend(d: HTMLElement, key: string, blend: Blend): void {
  put(key, blend, () => (d.style.mixBlendMode = blend));
}

/** The grade layers as last driven, for the chapter photo (K30), or null when none shows. */
export function currentGrade(): GradeFrame | null {
  return layers && !layers.root.hidden ? lastGrade : null;
}

/** Lay the frame's look over the game. Cheap to call every frame from both renderers. */
export function driveLook(f: LookFrame, nowMs = performance.now()): void {
  const l = ensure();
  if (!l) return;
  lastDrive = nowMs;
  l.root.hidden = false;
  const look = f.look;
  lastGrade = {
    look,
    ground: f.ground
      ? {
          color: f.ground.tint.color,
          alpha: f.ground.tint.alpha * Math.min(1, Math.max(0, f.ground.strength)),
          blend: f.ground.tint.blend,
        }
      : null,
  };
  l.grade.hidden = !look;
  if (look) {
    const t = look.tintAlpha;
    put(
      'grade',
      `${look.tint}|${t}|${look.shadow}|${look.shadowAlpha}|${look.core ?? ''}|${look.split?.key ?? ''}`,
      () =>
        (l.grade.style.background =
          splitGradeCss(look) ??
          `radial-gradient(ellipse at 50% 45%,${rgba(look.tint, t)} 0%,` +
            `${rgba(look.tint, t)} ${Math.round((look.core ?? 0.55) * 100)}%,` +
            `${rgba(look.shadow, look.shadowAlpha)} 100%)`),
    );
    setBlend(l.grade, 'gradeBlend', look.blend ?? 'overlay');
  }
  l.sat.hidden = !look || look.sat >= 0.99;
  if (look) put('sat', String(look.sat), () => (l.sat.style.opacity = String(1 - look.sat)));
  l.grid.hidden = !look?.grid;

  const g = f.ground;
  l.ground.hidden = !g;
  if (g) {
    const a = g.tint.alpha * Math.min(1, Math.max(0, g.strength));
    put(
      'ground',
      `${g.tint.color}|${a}`,
      () =>
        (l.ground.style.background =
          `linear-gradient(to bottom,${rgba(g.tint.color, 0)} 22%,` +
          `${rgba(g.tint.color, a * 0.45)} 55%,${rgba(g.tint.color, a)} 100%)`),
    );
    setBlend(l.ground, 'groundBlend', g.tint.blend);
  }
  drawFx(l, f, nowMs);
}

/** Staged rain, snow and wind and the pale seed, on a small canvas stretched pixelated. */
function drawFx(l: Layers, f: LookFrame, nowMs: number): void {
  const p = particles;
  const dt = Math.min(0.1, p.lastMs ? (nowMs - p.lastMs) / 1000 : 0);
  p.lastMs = nowMs;
  const moving = !f.reduce && f.weather !== null && f.weather !== 'frost';
  if (!f.seed) p.seedStart = -1;
  else if (p.seedStart < 0) p.seedStart = nowMs;
  const rime = !!f.ground?.tint.rime;
  if (!moving && !f.seed && !rime) {
    if (!l.fx.hidden) l.fx.hidden = true;
    p.weather = null;
    return;
  }
  const w = Math.max(80, Math.round(window.innerWidth * LOOK_F.fx.scale));
  const h = Math.max(80, Math.round(window.innerHeight * LOOK_F.fx.scale));
  if (l.fx.width !== w || l.fx.height !== h) {
    l.fx.width = w;
    l.fx.height = h;
  }
  l.fx.hidden = false;
  const ctx = l.fx.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  const kind = moving ? f.weather : null;
  if (kind && p.weather !== kind) seedParticles(kind);
  if (kind === 'rain') {
    ctx.fillStyle = 'rgba(214,228,242,0.75)';
    for (let i = 0; i < p.x.length; i++) {
      p.y[i]! += p.v[i]! * dt;
      p.x[i]! -= 0.1 * dt;
      if (p.y[i]! > 1.05) {
        p.y[i]! = -0.05;
        p.x[i]! = Math.random();
      }
      ctx.fillRect(Math.round(wrap(p.x[i]!) * w), Math.round(p.y[i]! * h), 1, 4);
    }
  } else if (kind === 'snow') {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i = 0; i < p.x.length; i++) {
      p.y[i]! += p.v[i]! * dt;
      p.x[i]! += Math.sin(nowMs / 900 + i) * 0.03 * dt;
      if (p.y[i]! > 1.05) p.y[i]! = -0.05;
      ctx.fillRect(Math.round(wrap(p.x[i]!) * w), Math.round(p.y[i]! * h), 2, 2);
    }
  } else if (kind === 'wind') {
    ctx.fillStyle = 'rgba(240,245,235,0.55)';
    for (let i = 0; i < p.x.length; i++) {
      p.x[i]! += p.v[i]! * dt;
      ctx.fillRect(Math.round(wrap(p.x[i]!) * w), Math.round(p.y[i]! * h), 9, 1);
    }
  }
  if (rime) drawRime(ctx, w, h, Math.min(1, (f.ground?.strength ?? 1) + 0.2));
  if (f.seed)
    drawSeed(ctx, w, h, f.reduce ? 1 : (nowMs - p.seedStart) / 1000 / LOOK_F.fx.seedFallS);
}

/** A still, light white speckle over the lower ground: rime, not fog. Seeded, so it never shimmers. */
function drawRime(ctx: CanvasRenderingContext2D, w: number, h: number, k: number): void {
  let s = 12345;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  ctx.fillStyle = `rgba(245,250,255,${(0.5 * k).toFixed(2)})`;
  const n = Math.round(w * h * 0.007);
  for (let i = 0; i < n; i++) {
    const y = h * (0.42 + 0.58 * Math.sqrt(r()));
    ctx.fillRect(Math.floor(r() * w), Math.floor(y), 1, 1);
  }
}

const wrap = (v: number): number => v - Math.floor(v);

function seedParticles(kind: StagedWeather): void {
  const p = particles;
  p.weather = kind;
  const n = kind === 'rain' ? LOOK_F.fx.rain : kind === 'snow' ? LOOK_F.fx.snow : LOOK_F.fx.wind;
  p.x = [];
  p.y = [];
  p.v = [];
  for (let i = 0; i < n; i++) {
    p.x.push(Math.random());
    p.y.push(kind === 'wind' ? 0.35 + Math.random() * 0.6 : Math.random());
    p.v.push(
      kind === 'rain'
        ? 1.1 + Math.random() * 0.5
        : kind === 'snow'
          ? 0.08 + Math.random() * 0.1
          : 0.5 + Math.random() * 0.6,
    );
  }
}

/** One soft glow card on a slow S-curve; at `t` 1 it rests at the end point. */
function drawSeed(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
  const k = Math.min(1, Math.max(0, t));
  const ease = k * k * (3 - 2 * k);
  const x = (0.6 + 0.07 * Math.sin(k * 7.5) * (1 - k * 0.6)) * w;
  const y = (0.08 + 0.6 * ease) * h;
  const r = Math.max(6, h * 0.045);
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(255,252,235,0.95)');
  g.addColorStop(0.35, 'rgba(255,244,205,0.5)');
  g.addColorStop(1, 'rgba(255,244,205,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.fillStyle = 'rgba(255,255,250,1)';
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
}

// ---------------------------------------------------------------------------- title card

let card: HTMLDivElement | null = null;
let cardTimer: number | null = null;

export interface TitleCard {
  campaign: string;
  chapter: number;
  title: string;
  look: LookDef;
  reduce: boolean;
}

/** Show a chapter's title card: it fades in and out, or cuts under reduced motion. */
export function showTitleCard(c: TitleCard): void {
  const l = ensure();
  if (!l) return;
  hideTitleCard();
  const name = TITLE_CARD_TEXT.campaigns[c.campaign] ?? c.campaign;
  const root = document.createElement('div');
  root.className = 'chapter-card';
  root.setAttribute('role', 'status');
  root.style.cssText =
    'position:fixed;left:0;right:0;top:20%;z-index:12;display:flex;justify-content:center;' +
    'pointer-events:none;padding:0 16px;';
  const sr = document.createElement('span');
  sr.textContent = TITLE_CARD_TEXT.announce(name, c.chapter, c.title);
  sr.style.cssText =
    'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:min(92vw,560px);height:auto;aspect-ratio:560/170;';
  drawCard(canvas, c, name);
  root.append(sr, canvas);
  // R0334 (FUN-45): Hazel's postscript for the chapter, under her campaign's cards.
  const ps = c.campaign === 'hazel' ? HAZEL_PS[c.chapter] : undefined;
  if (ps) {
    root.style.flexDirection = 'column';
    root.style.alignItems = 'center';
    const p = document.createElement('p');
    p.className = 'chapter-ps';
    p.textContent = ps;
    root.append(p);
  }
  const fade = !c.reduce;
  root.style.opacity = fade ? '0' : '1';
  if (fade) root.style.transition = `opacity ${LOOK_F.card.fadeS}s ease`;
  document.body.appendChild(root);
  card = root;
  if (fade)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.style.setProperty('opacity', '1')),
    );
  cardTimer = window.setTimeout(() => {
    if (card !== root) return;
    if (!fade) return hideTitleCard();
    root.style.opacity = '0';
    cardTimer = window.setTimeout(
      () => card === root && hideTitleCard(),
      LOOK_F.card.fadeS * 1000 + 50,
    );
  }, LOOK_F.card.holdS * 1000);
}

export function hideTitleCard(): void {
  if (cardTimer !== null) window.clearTimeout(cardTimer);
  cardTimer = null;
  card?.remove();
  card = null;
}

function drawCard(canvas: HTMLCanvasElement, c: TitleCard, campaignName: string): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = 560;
  const H = 170;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  const accent = c.look.accent;
  // A dark soft plate so the card reads over any frame.
  const plate = ctx.createLinearGradient(0, 0, W, 0);
  plate.addColorStop(0, 'rgba(10,8,20,0)');
  plate.addColorStop(0.18, 'rgba(10,8,20,0.62)');
  plate.addColorStop(0.82, 'rgba(10,8,20,0.62)');
  plate.addColorStop(1, 'rgba(10,8,20,0)');
  ctx.fillStyle = plate;
  ctx.fillRect(0, 10, W, H - 20);
  // K32: the campaign's landmark, a flat silhouette standing behind the title.
  ctx.globalAlpha = CG4_U4.card.alpha;
  drawSilhouette(ctx, c.campaign, CG4_U4.card.x, CG4_U4.card.base, accent);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = accent;
  ctx.font = '600 15px Georgia, "Times New Roman", serif';
  ctx.fillText(
    `${campaignName.toUpperCase()}  ·  ${TITLE_CARD_TEXT.chapter(c.chapter).toUpperCase()}`,
    W / 2,
    46,
  );
  ctx.fillStyle = '#fff6e0';
  let size = 38;
  ctx.font = `600 ${size}px Georgia, "Times New Roman", serif`;
  while (ctx.measureText(c.title).width > W - 70 && size > 18) {
    size -= 2;
    ctx.font = `600 ${size}px Georgia, "Times New Roman", serif`;
  }
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 6;
  ctx.fillText(c.title, W / 2, 98);
  ctx.shadowBlur = 0;
  drawMotif(ctx, c.look.motif, W / 2, 132, accent);
}

/** A ruled line with a small emblem in the middle: a shape, so colour is never the only cue. */
function drawMotif(
  ctx: CanvasRenderingContext2D,
  motif: Motif,
  cx: number,
  y: number,
  color: string,
): void {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 190, y);
  ctx.lineTo(cx - 28, y);
  ctx.moveTo(cx + 28, y);
  ctx.lineTo(cx + 190, y);
  ctx.stroke();
  ctx.save();
  ctx.translate(cx, y);
  switch (motif) {
    case 'honey':
      for (const [dx, dy] of [
        [-9, 4],
        [9, 4],
        [0, -9],
      ] as const)
        hex(ctx, dx, dy, 8);
      break;
    case 'straw':
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.lineTo(0, -12);
      ctx.stroke();
      for (let i = 0; i < 4; i++)
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(s * 6, -10 + i * 6, 3.4, 1.8, s * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      break;
    case 'grid':
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-12, -12, 24, 24);
      ctx.beginPath();
      ctx.moveTo(-4, -12);
      ctx.lineTo(-4, 12);
      ctx.moveTo(4, -12);
      ctx.lineTo(4, 12);
      ctx.moveTo(-12, -4);
      ctx.lineTo(12, -4);
      ctx.moveTo(-12, 4);
      ctx.lineTo(12, 4);
      ctx.stroke();
      break;
    case 'torch':
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.bezierCurveTo(10, -3, 8, 8, 0, 10);
      ctx.bezierCurveTo(-8, 8, -10, -3, 0, -14);
      ctx.fill();
      ctx.fillRect(-2, 10, 4, 6);
      break;
    case 'dawn':
      ctx.beginPath();
      ctx.arc(0, 8, 9, Math.PI, 0);
      ctx.fill();
      for (let i = 0; i < 5; i++) {
        const a = Math.PI + (i + 0.5) * (Math.PI / 5);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 13, 8 + Math.sin(a) * 13);
        ctx.lineTo(Math.cos(a) * 19, 8 + Math.sin(a) * 19);
        ctx.stroke();
      }
      break;
    case 'dusk':
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(6, -3, 9.5, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

function hex(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    const px = x + Math.cos(a) * r * 0.62;
    const py = y + Math.sin(a) * r * 0.62;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** Hide everything and forget the particles: the scene was torn down. */
export function disposeLook(): void {
  hideTitleCard();
  if (layers) layers.root.hidden = true;
  written.clear();
  particles.weather = null;
  particles.seedStart = -1;
  particles.lastMs = 0;
  lastCardKey = '';
  if (watchdog !== null && !layers) {
    window.clearInterval(watchdog);
    watchdog = null;
  }
}

// ---------------------------------------------------------------------------- the driver

/** What a dressing needs to know about the story moment, worked out once per frame. */
export interface CampaignMoment {
  flags: StageFlags;
  sets: SetFlags;
  /** The current chapter's title, or null. */
  title: string | null;
  ending: string | null;
  finalChoice: unknown;
  fx: { fireflies: boolean; seed: boolean };
  /** The season drawn (staged, else the chapter's), or null. */
  season: ReturnType<typeof seasonFor>;
  /** The Beetle Road's underground grade is up: its torches show. */
  below: boolean;
}

let lastCardKey = '';

/**
 * Called every frame by whichever renderer is drawing: lays the campaign's look, season,
 * staged weather and held effects over the frame, opens a title card on a new chapter, and
 * returns the story moment for the caller's own sets. Reads the world, never writes it.
 */
export function driveCampaign(world: World, stage: SceneStage, reduce: boolean): CampaignMoment {
  const f = stageFlags(world, stage);
  const c = world.campaign;
  const title = c ? chapterTitle(c, f.chapter) : null;
  const sets = setFlags({
    campaign: f.campaign,
    chapter: f.chapter,
    sceneId: f.sceneId,
    location: f.location,
    chapterTitle: title,
  });
  const fx = fxFor(stage, f.sceneId);
  const moment: CampaignMoment = {
    flags: f,
    sets,
    title,
    ending: c?.ending ?? null,
    finalChoice: c?.flags.finalChoice,
    fx,
    // R0118 (lane D r9): free play wears the world's own season at home.
    season: seasonHere(world, stage, f.campaign, f.chapter, f.location),
    below: stage.grade === 'beetle-below',
  };
  // `props.loggedSet = 'hide'`: the scene plays with no game-world set ("There is no visor").
  if (stage.props?.loggedSet === 'hide') {
    sets.logged = false;
    sets.rootRoom = false;
  }
  // An exclusive stage (C3, C4) draws only its own set: none of the Grove's sets, no sky weather.
  if (stage.exclusive) {
    sets.festival = sets.picnic = sets.beetle = sets.logged = sets.plums = false;
  }
  const final = c ? (storylineOf(c)?.chapters.length ?? 12) : 0;
  const underground = f.location === 'dungeon';
  if (!c || underground) {
    driveLook({ look: null, ground: null, weather: null, seed: false, reduce });
    return moment;
  }
  const { look } = lookFor(
    {
      campaign: f.campaign,
      chapter: f.chapter,
      storyChapter: f.storyChapter,
      half: f.half,
      chapters: storylineOf(c)?.chapters.length,
    },
    stage,
  );
  const weather = stage.exclusive ? null : weatherFor(stage, f.sceneId, f.campaign, title);
  const season = seasonFor(stage, f.campaign, f.chapter);
  const wet = weather ? WEATHER_TINT[weather] : undefined;
  const ground = wet
    ? { tint: wet, strength: 1 }
    : season
      ? { tint: SEASON_TINT[season.season], strength: season.strength }
      : null;
  const shown = stage.props?.loggedSet === 'hide' && look.grid ? { ...look, grid: false } : look;
  driveLook({ look: shown, ground, weather, seed: fx.seed, reduce });
  // A chapter's title card, once, as it opens.
  const key = `${f.campaign}:${f.chapter}`;
  if (key !== lastCardKey && f.chapter >= 1 && f.chapter <= final && title) {
    lastCardKey = key;
    showTitleCard({
      campaign: f.half ? f.half : f.campaign,
      chapter: f.chapter,
      title,
      look,
      reduce,
    });
    // R0729: a sprout hears the card: "Chapter one: The Letter".
    if (world.edu?.band === 'sprout' && world.edu.readAloud)
      speakLine(CHAPTER_SAY_TEXT.say(numberWord(f.chapter), title));
  }
  return moment;
}

/** R0729: a chapter card is on screen (the objective chip hides meanwhile). */
export function titleCardUp(): boolean {
  return card !== null;
}
