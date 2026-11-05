/**
 * R0141 (WORLD-75): the dev-only `?editor` view. A top-down picture of a drawn region: the walk
 * grid, the path, the points of interest (drag to move), the solid pieces, the seeded marks
 * (collectibles, traces, photo frame, plot, gate) and the exits. "Export" puts the region's exits
 * and POIs, as moved, into the clipboard as formatted TypeScript (`regionToTs`). Moves are kept
 * in memory only; nothing is written to the game. Imported only behind `import.meta.env.DEV`, so
 * it never reaches the production bundle.
 */
import { REGIONS, type PoiDef, type RegionId } from '../config/regions';
import { collectiblesIn } from '../sim/collectibles';
import { gatesOf } from '../sim/region-gates';
import { layoutOf, REGION_SPECS } from '../sim/region-walk';
import { WORLD_TRACES } from '../content/world-traces';
import { traceSpot } from '../sim/regions-trace';
import { photoSpotAt } from '../sim/photo-spots';
import { plotAt } from '../sim/region-marks';
import { regionToTs } from './region-export';

const VIEW = 720;

export function runRegionEditor(host: HTMLElement): void {
  const ids = Object.keys(REGION_SPECS) as RegionId[];
  const moved = new Map<string, PoiDef[]>();
  let region: RegionId = ids[0]!;

  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px';
  const pick = document.createElement('select');
  for (const id of ids) pick.add(new Option(id, id));
  const out = document.createElement('button');
  out.textContent = 'Export TypeScript';
  const note = document.createElement('span');
  bar.append(pick, out, note);
  const canvas = document.createElement('canvas');
  canvas.width = VIEW;
  canvas.height = VIEW;
  canvas.style.cssText = 'max-width:100%;touch-action:none;border:1px solid #888';
  host.append(bar, canvas);
  const ctx = canvas.getContext('2d')!;

  const pois = (): PoiDef[] => {
    let list = moved.get(region);
    if (!list) moved.set(region, (list = REGIONS[region].pois.map((p) => ({ ...p }))));
    return list;
  };
  const scale = (): number => VIEW / Math.max(REGIONS[region].size.w, REGIONS[region].size.h);
  const px = (x: number): number => VIEW / 2 + x * scale();

  function draw(): void {
    const l = layoutOf(region)!;
    const s = scale();
    ctx.fillStyle = '#1c2230';
    ctx.fillRect(0, 0, VIEW, VIEW);
    for (let i = 0; i < l.grid.length; i++) {
      const v = l.grid[i];
      if (v === 0) continue;
      ctx.fillStyle = v === 2 ? '#2a5a9a' : '#4f7a3a';
      const x = (i % l.gw) * l.cell - l.spec.size.w / 2;
      const z = Math.floor(i / l.gw) * l.cell - l.spec.size.h / 2;
      ctx.fillRect(px(x), px(z), l.cell * s + 0.5, l.cell * s + 0.5);
    }
    ctx.strokeStyle = '#e8d898';
    ctx.beginPath();
    l.spec.path.forEach((p, i) =>
      i ? ctx.lineTo(px(p.x), px(p.z)) : ctx.moveTo(px(p.x), px(p.z)),
    );
    if (l.spec.loop) ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#999';
    for (const o of l.solids)
      ctx.fillRect(px(o.x) - o.r * s, px(o.z) - o.r * s, o.r * 2 * s, o.r * 2 * s);
    const dot = (x: number, z: number, c: string, r = 3): void => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(px(x), px(z), r, 0, 7);
      ctx.fill();
    };
    for (const c of collectiblesIn(region))
      dot(c.x, c.z, c.kind === 'petal' ? '#f2a6c4' : '#f4c430', 2.5);
    for (const t of WORLD_TRACES.filter((q) => q.region === region)) {
      const at = traceSpot(t);
      if (at) dot(at.x, at.z, '#ffffff', 3.5);
    }
    const ph = photoSpotAt(region);
    if (ph) dot(ph.x, ph.z, '#9ad8f0', 5);
    const pl = plotAt(region);
    if (pl) {
      ctx.strokeStyle = '#f4ead0';
      ctx.strokeRect(px(pl.x - 4), px(pl.z - 4), 8 * s, 8 * s);
    }
    for (const g of gatesOf(region)) dot(g.x, g.z, '#c8583c', 6);
    ctx.fillStyle = '#fff';
    ctx.font = '11px sans-serif';
    for (const p of pois()) {
      dot(p.x, p.z, '#ff7a3a', 5);
      ctx.fillText(p.id, px(p.x) + 7, px(p.z) + 4);
    }
    for (const e of REGIONS[region].exits) {
      ctx.strokeStyle = '#7ad8ff';
      ctx.strokeRect(
        px(e.rect.x - e.rect.w / 2),
        px(e.rect.z - e.rect.h / 2),
        e.rect.w * s,
        e.rect.h * s,
      );
    }
  }

  let drag: PoiDef | null = null;
  const at = (e: PointerEvent): { x: number; z: number } => {
    const r = canvas.getBoundingClientRect();
    const k = VIEW / r.width;
    return {
      x: ((e.clientX - r.left) * k - VIEW / 2) / scale(),
      z: ((e.clientY - r.top) * k - VIEW / 2) / scale(),
    };
  };
  canvas.addEventListener('pointerdown', (e) => {
    const p = at(e);
    drag = pois().find((q) => Math.hypot(q.x - p.x, q.z - p.z) < 2.5) ?? null;
    if (drag) canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const p = at(e);
    drag.x = Math.round(p.x * 2) / 2;
    drag.z = Math.round(p.z * 2) / 2;
    draw();
  });
  canvas.addEventListener('pointerup', () => (drag = null));
  pick.addEventListener('change', () => {
    region = pick.value as RegionId;
    draw();
  });
  out.addEventListener('click', () => {
    const text = regionToTs({ ...REGIONS[region], pois: pois() });
    void navigator.clipboard?.writeText(text).catch(() => {});
    note.textContent = `Copied ${text.length} characters.`;
    console.info(text);
  });
  draw();
}
