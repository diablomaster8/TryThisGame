/**
 * The corner minimap (R0083): a 96 px round view of the Grove around the Keeper, north up,
 * under the top bar. The ground is the map painter's picture (`paintGroveMap`) cached as one
 * bitmap and blitted around the Keeper at about 1 px per half unit; a view cone, shaped
 * Nubbin markers and found-landmark houses go on top. Redrawn at 4 Hz. Visibility is the
 * Minimap setting (Off / On / Auto), the Grove only, never in story scenes (CSS, via
 * `html.dialogue-open`) and never in the Learning Grove's sprout band.
 */
import { WORLD_TEXT } from '../config/strings-world';
import { GROVE, LANDMARKS, MINIMAP } from '../config/tuning';
import type { Game } from '../game';
import { paintGroveMap } from '../render/map-paint';
import { textBandOf } from '../sim/story-scenes';
import type { NubbinType, Settings } from '../sim/types';
import { minimapModeOf, minimapVisible, type MinimapMode } from './hud-world-math';

/** Cost of the redraws so far, ms (read by the dev checks). */
export const minimapStats = { lastMs: 0, avgMs: 0, draws: 0, paintMs: 0 };

/** A marker's outline by type, so the type reads from shape and not colour alone. */
function shape(c: CanvasRenderingContext2D, type: NubbinType, x: number, y: number): void {
  c.beginPath();
  const r = 3.4;
  switch (type) {
    case 'swim': // diamond
      c.moveTo(x, y - r - 1);
      c.lineTo(x + r + 1, y);
      c.lineTo(x, y + r + 1);
      c.lineTo(x - r - 1, y);
      break;
    case 'fly': // triangle
      c.moveTo(x, y - r - 1);
      c.lineTo(x + r + 1, y + r);
      c.lineTo(x - r - 1, y + r);
      break;
    case 'run': // square
      c.rect(x - r, y - r, r * 2, r * 2);
      break;
    case 'power': // plus
      c.moveTo(x - 1.5, y - r - 1);
      c.lineTo(x + 1.5, y - r - 1);
      c.lineTo(x + 1.5, y - 1.5);
      c.lineTo(x + r + 1, y - 1.5);
      c.lineTo(x + r + 1, y + 1.5);
      c.lineTo(x + 1.5, y + 1.5);
      c.lineTo(x + 1.5, y + r + 1);
      c.lineTo(x - 1.5, y + r + 1);
      c.lineTo(x - 1.5, y + 1.5);
      c.lineTo(x - r - 1, y + 1.5);
      c.lineTo(x - r - 1, y - 1.5);
      c.lineTo(x - 1.5, y - 1.5);
      break;
    default: // circle
      c.arc(x, y, r, 0, Math.PI * 2);
  }
  c.closePath();
}

const DOT_FILL: Record<NubbinType, string> = {
  normal: '#f5e6a8',
  swim: '#6ab4ff',
  fly: '#c8e8ff',
  run: '#ff9a6a',
  power: '#e96a8a',
};

export interface MinimapHandle {
  readonly root: HTMLDivElement;
}

export function mountMinimap(
  parent: HTMLElement,
  game: () => Game | null,
  openMap: () => void,
): MinimapHandle {
  const root = document.createElement('div');
  root.className = 'minimap';
  root.hidden = true;
  const canvas = document.createElement('canvas');
  const size = MINIMAP.size;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.setAttribute('role', 'button');
  canvas.setAttribute('aria-label', WORLD_TEXT.minimapLabel);
  root.appendChild(canvas);
  root.addEventListener('click', openMap);
  parent.appendChild(root);
  const ctx = canvas.getContext('2d');

  let bitmap: HTMLCanvasElement | null = null;
  let paintedKey = '';
  let lastCheck = -1e9;

  /** The cached ground; repainted only when the tiles or the season change. */
  const ensureBitmap = (g: Game, now: number): HTMLCanvasElement | null => {
    if (bitmap && now - lastCheck < MINIMAP.repaintCheckMs) return bitmap;
    lastCheck = now;
    const w = g.world;
    const season = w.season === 'winter' ? 'winter' : null;
    const key = `${season}|${Object.keys(w.tiles).length}`;
    if (bitmap && key === paintedKey) return bitmap;
    paintedKey = key;
    const t0 = performance.now();
    const p = paintGroveMap(w.tiles, season);
    const c = document.createElement('canvas');
    c.width = p.width;
    c.height = p.height;
    const cx = c.getContext('2d');
    if (!cx) return null;
    const img = cx.createImageData(p.width, p.height);
    img.data.set(p.rgba);
    cx.putImageData(img, 0, 0);
    minimapStats.paintMs = performance.now() - t0;
    bitmap = c;
    return c;
  };

  const place = (): void => {
    // Sit just under the top bar's last row (the Shells counter wraps with it on phones).
    const bar = parent.querySelector<HTMLElement>('.topbar');
    const top = bar ? bar.getBoundingClientRect().bottom + MINIMAP.gapBelowTopbar : 56;
    root.style.top = `${Math.round(top)}px`;
  };

  const draw = (g: Game, now: number): void => {
    if (!ctx) return;
    const t0 = performance.now();
    const src = ensureBitmap(g, now);
    const t1 = performance.now();
    const w = g.world;
    const k = MINIMAP.pxPerUnit;
    const half = size / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#243024';
    ctx.fillRect(0, 0, size, size);
    const kx = w.keeper.pos.x;
    const kz = w.keeper.pos.z;
    // World -> minimap pixel, north up with the Keeper at the centre.
    const sx = (x: number): number => half + (x - kx) * k;
    const sy = (z: number): number => half + (z - kz) * k;
    if (src)
      ctx.drawImage(src, sx(-GROVE.size / 2), sy(-GROVE.size / 2), GROVE.size * k, GROVE.size * k);
    // The view cone: the camera looks toward (-sin yaw, -cos yaw).
    const yaw = g.camera.currentYaw;
    const a = Math.atan2(-Math.cos(yaw), -Math.sin(yaw));
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.moveTo(half, half);
    ctx.arc(half, half, half, a - MINIMAP.coneHalfAngle, a + MINIMAP.coneHalfAngle);
    ctx.closePath();
    ctx.fill();
    // Found landmarks: a small house.
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#2a1c10';
    ctx.fillStyle = '#ffd66a';
    for (const l of LANDMARKS) {
      if (w.landmarks[l.id] === undefined) continue;
      const x = sx(l.x);
      const y = sy(l.z);
      if (Math.hypot(x - half, y - half) > half) continue;
      ctx.beginPath();
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x + 4, y - 0.5);
      ctx.lineTo(x + 3, y + 3);
      ctx.lineTo(x - 3, y + 3);
      ctx.lineTo(x - 4, y - 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // Nubbins: a shape per type, so colour is never the only signal.
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    for (const n of w.nubbins) {
      if (n.stage === 'egg') continue;
      const x = sx(n.pos.x);
      const y = sy(n.pos.z);
      if (Math.hypot(x - half, y - half) > half - 2) continue;
      const type: NubbinType = n.form?.type ?? 'normal';
      shape(ctx, type, x, y);
      ctx.fillStyle = DOT_FILL[type];
      ctx.fill();
      ctx.stroke();
    }
    // The Keeper: a light centre in a red ring.
    ctx.beginPath();
    ctx.arc(half, half, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.stroke();
    // The bitmap's rare repaint is timed apart (paintMs) and left out of the draw average.
    const ms = performance.now() - t1;
    void t0;
    minimapStats.lastMs = ms;
    minimapStats.draws += 1;
    minimapStats.avgMs += (ms - minimapStats.avgMs) / Math.min(minimapStats.draws, 50);
  };

  let last = -1e9;
  const frame = (now: number): void => {
    requestAnimationFrame(frame);
    if (now - last < 1000 / MINIMAP.redrawHz) return;
    last = now;
    const g = game();
    if (!g) return;
    const w = g.world;
    const show = minimapVisible(
      minimapModeOf(w.settings.minimap),
      w.location === 'grove',
      window.innerHeight,
      MINIMAP.autoMinHeightPx,
      textBandOf(w) === 'sprout',
    );
    if (root.hidden === show) root.hidden = !show;
    if (!show) return;
    place();
    draw(g, now);
  };
  requestAnimationFrame(frame);
  return { root };
}

/**
 * The Settings row for the Minimap setting, self-contained: it appends its own select and
 * help line to `body` and saves through its own `setSettings`. Returns a function that
 * refreshes the select from the world when the menu opens.
 */
export function mountMinimapSetting(body: HTMLElement, game: () => Game | null): (g: Game) => void {
  const row = document.createElement('label');
  row.className = 'field-row';
  const label = document.createElement('strong');
  label.textContent = WORLD_TEXT.minimapSetting;
  const sel = document.createElement('select');
  for (const [value, text] of Object.entries(WORLD_TEXT.minimapLevels)) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = text;
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => {
    const g = game();
    if (!g) return;
    const next: Settings = { ...g.world.settings, minimap: sel.value as MinimapMode };
    g.send({ kind: 'setSettings', settings: next });
  });
  row.append(label, sel);
  const help = document.createElement('div');
  help.className = 'help';
  help.textContent = WORLD_TEXT.minimapHelp;
  body.append(row, help);
  return (g) => {
    sel.value = minimapModeOf(g.world.settings.minimap);
  };
}
