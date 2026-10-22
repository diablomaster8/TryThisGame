import * as THREE from 'three';
import { markSetFor, STAGE_MARKS } from '../config/stage-marks';
import { STAGE4 } from '../config/tuning-f4';
import type { Game } from '../game';
import { terraceY } from '../render/scene-stage';
import { safeRect, viewRect } from '../render/stage-api';
import type { FitPoint } from '../render/stage-fit';
import { OCCLUDE } from '../render3d/building-kit';
import { standHeight } from '../render3d/terrain-shape';
import { button, el } from './dom';

/**
 * The stage inspector (K48), a debug-panel tool (the panel mounts only in dev builds or with
 * `?debug`). While on, it draws over the view: every mark of the location's set (grey dots,
 * named), the framed focus points with their K3 weights (filled when the last fit kept them,
 * hollow when it dropped them; the speaker ringed), the HUD-safe rect, the 3D hide boxes,
 * and the camera's yaw. Beside it, the resolved stage of the queued scene as JSON, with
 * "Copy as overlay entry" for a package's `scene-stages-pkg-<id>.ts`. Reads only.
 */
export class StageInspector {
  readonly root: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly json: HTMLPreElement;
  private readonly head: HTMLDivElement;
  private on = false;
  private raf = 0;
  private lastId: string | null | undefined = undefined;
  private readonly v = new THREE.Vector3();

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.canvas = el('canvas', 'stage-inspector-overlay');
    this.canvas.hidden = true;
    this.canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.canvas);
    this.root = el('div', 'stage-inspector');
    this.root.hidden = true;
    this.head = el('div', 'stage-inspector-head');
    this.json = el('pre', 'stage-inspector-json');
    this.root.append(
      this.head,
      button('Copy as overlay entry', () => this.copy(), 'btn btn-small'),
      this.json,
    );
    parent.appendChild(this.root);
  }

  get isOn(): boolean {
    return this.on;
  }

  toggle(): void {
    this.on = !this.on;
    this.root.hidden = !this.on;
    this.canvas.hidden = !this.on;
    this.lastId = undefined;
    cancelAnimationFrame(this.raf);
    if (this.on) this.loop();
  }

  private loop(): void {
    this.raf = requestAnimationFrame(() => {
      if (!this.on) return;
      this.draw();
      this.loop();
    });
  }

  private entry(): string {
    const g = this.game();
    const st = g?.storyStager;
    if (!st?.active) return '// no scene queued';
    return `  '${st.id}': ${JSON.stringify(st.stage, null, 2).replace(/\n/g, '\n  ')},`;
  }

  private copy(): void {
    const text = this.entry();
    void navigator.clipboard?.writeText(text).catch(() => undefined);
  }

  private draw(): void {
    const g = this.game();
    const st = g?.storyStager;
    const view = viewRect();
    const c = this.canvas;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(view.w * dpr) || c.height !== Math.round(view.h * dpr)) {
      c.width = Math.round(view.w * dpr);
      c.height = Math.round(view.h * dpr);
    }
    c.style.left = `${view.x}px`;
    c.style.top = `${view.y}px`;
    c.style.width = `${view.w}px`;
    c.style.height = `${view.h}px`;
    const ctx = c.getContext('2d');
    if (!ctx || !g || !st) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, view.w, view.h);
    const s3 = g.scene3d;
    const cam: THREE.Camera = s3 ? s3.camera : g.camera.camera;
    const world = g.world;
    const ground = (x: number, z: number) =>
      world.location === 'grove' ? (s3 ? standHeight(x, z) : terraceY(x, z)) : 0;
    const toScreen = (x: number, y: number, z: number): { x: number; y: number } | null => {
      const p = this.v.set(x, y, z).project(cam);
      if (p.z > 1 || p.z < -1) return null;
      return { x: ((p.x + 1) / 2) * view.w, y: ((1 - p.y) / 2) * view.h };
    };
    ctx.font = '10px monospace';
    ctx.lineWidth = 1;
    // The safe rect.
    const safe = safeRect();
    ctx.strokeStyle = '#3cf';
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(safe.x - view.x + 0.5, safe.y - view.y + 0.5, safe.w - 1, safe.h - 1);
    ctx.setLineDash([]);
    // Every mark of the set, small and grey.
    const set = markSetFor(world.location);
    if (set)
      for (const [name, m] of Object.entries(STAGE_MARKS[set])) {
        const p = toScreen(m.x, ground(m.x, m.z), m.z);
        if (!p) continue;
        ctx.fillStyle = 'rgba(200,200,200,0.8)';
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.fillText(name, p.x + 4, p.y + 3);
      }
    // The framed points, with their weights; kept by the last fit filled, dropped hollow.
    const kept: readonly FitPoint[] = s3 ? s3.fitKept : g.stageFitKept;
    const keptAt = (p: FitPoint) =>
      kept.some((k) => Math.hypot(k.x - p.x, k.z - p.z) < 0.6 * (p.fit?.r ?? 1) + 0.01);
    if (st.active)
      for (const p of st.frame(world)) {
        const at = toScreen(p.x, ground(p.x, p.z) + 1, p.z);
        if (!at) continue;
        const w = p.w ?? STAGE4.weight.cast;
        ctx.strokeStyle = ctx.fillStyle = w >= 1 ? '#ffd23c' : w >= 0.5 ? '#ff8a3c' : '#c87cff';
        ctx.beginPath();
        ctx.arc(at.x, at.y, 6, 0, Math.PI * 2);
        if (kept.length === 0 || keptAt(p)) ctx.fill();
        else ctx.stroke();
        if (p.speaker) {
          ctx.beginPath();
          ctx.arc(at.x, at.y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillText(`w ${w}${p.fit ? ' prop' : ''}`, at.x + 12, at.y - 6);
      }
    // 3D: the buildings' hide boxes in use.
    if (s3) {
      ctx.strokeStyle = '#f55';
      for (let i = 0; i < OCCLUDE.hides.value; i++) {
        const a = OCCLUDE.hideMin.value[i]!;
        const b = OCCLUDE.hideMax.value[i]!;
        let x0 = Infinity;
        let y0 = Infinity;
        let x1 = -Infinity;
        let y1 = -Infinity;
        for (const x of [a.x, b.x])
          for (const y of [a.y, b.y])
            for (const z of [a.z, b.z]) {
              const p = toScreen(x, y, z);
              if (!p) continue;
              x0 = Math.min(x0, p.x);
              y0 = Math.min(y0, p.y);
              x1 = Math.max(x1, p.x);
              y1 = Math.max(y1, p.y);
            }
        if (x0 < x1) ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      }
    }
    // The camera's yaw (as Shot.yaw: the camera stands that way from what it looks at).
    const dir = cam.getWorldDirection(this.v);
    const yaw = Math.atan2(-dir.x, -dir.z);
    const deg = Math.round((yaw * 180) / Math.PI);
    const rev = s3?.reverseYaw;
    const head = `${st.id ?? 'no scene'}  yaw ${deg}°${rev != null ? '  over-shoulder' : ''}  ${st.shotKind() ?? 'no shot'}${st.grave ? '  grave' : ''}`;
    ctx.fillStyle = '#fff';
    ctx.fillText(head, 8, safe.y - view.y + 14);
    this.head.textContent = head;
    if (st.id !== this.lastId) {
      this.lastId = st.id;
      this.json.textContent = this.entry();
    }
  }
}
