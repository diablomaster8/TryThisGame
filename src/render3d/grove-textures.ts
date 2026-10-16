import type * as THREE from 'three';
import { cardFrom, rgbaCanvas, surfaceFrom, type Surface, type Tex } from '../samples/aaa-kit';
import { paintJob, type PaintJob, type PaintedBytes } from '../samples/surface-paint';
import { SculptFarm } from './sculpt-farm';
import type { PaintReply, PaintRequest } from './surface-worker';

/**
 * The 3D Grove's painted textures, built without holding the page. The scene gets the
 * texture objects at once, each holding one placeholder pixel with the settings of the
 * real thing, so materials and their programs are made exactly as before; the ten
 * paintings run in workers and are poured into those same objects as they land. The
 * loading veil waits for `done`. Without workers they paint on the page, one per task.
 */
const JOBS: Array<{ name: keyof Tex; job: PaintJob }> = [
  // Largest first, so the slowest paintings start soonest.
  { name: 'grass', job: { kind: 'grass', size: 512, strength: 2.2 } },
  { name: 'rock', job: { kind: 'rock', size: 512, strength: 5 } },
  { name: 'cobble', job: { kind: 'cobble', size: 512, strength: 5 } },
  { name: 'dirt', job: { kind: 'dirt', size: 256, strength: 2.5 } },
  { name: 'bark', job: { kind: 'bark', size: 256, strength: 4 } },
  { name: 'plaster', job: { kind: 'plaster', size: 256, strength: 1.5 } },
  { name: 'roof', job: { kind: 'roof', size: 256, strength: 4 } },
  { name: 'wood', job: { kind: 'wood', size: 256, strength: 3 } },
  { name: 'leaf', job: { kind: 'leaf', size: 256 } },
  { name: 'tuft', job: { kind: 'tuft', size: 128 } },
];

export class GroveTextures {
  readonly tex: Tex;
  private painted = 0;
  private next = 0;
  private readonly workers: Worker[] = [];
  private readonly poured = new Set<keyof Tex>();
  private onPage = false;

  /** `upload` sends a filled texture to the GPU at once, so the first frame need not. */
  constructor(private readonly upload: (t: THREE.Texture) => void = () => {}) {
    const surface = { size: 1, albedo: new Uint8Array([128, 128, 128, 255]), normal: null };
    const card = { size: 1, albedo: new Uint8Array(4), normal: null };
    const s = () => surfaceFrom(surface);
    this.tex = {
      grass: s(),
      rock: s(),
      dirt: s(),
      bark: s(),
      cobble: s(),
      plaster: s(),
      roof: s(),
      wood: s(),
      leaf: cardFrom(card),
      tuft: cardFrom(card),
    };
    this.start();
  }

  /** Share of the paintings poured in, 0..1. */
  get progress(): number {
    return this.painted / JOBS.length;
  }

  get done(): boolean {
    return this.painted === JOBS.length;
  }

  private start(): void {
    if (typeof Worker !== 'undefined') {
      try {
        const count = Math.min(SculptFarm.defaultCount(), JOBS.length);
        for (let i = 0; i < count; i++) {
          const w = new Worker(new URL('./surface-worker.ts', import.meta.url), {
            type: 'module',
          });
          w.onmessage = (e: MessageEvent<PaintReply>) => this.landed(w, e.data);
          w.onerror = () => this.fallBack();
          this.workers.push(w);
        }
        for (const w of this.workers) this.feed(w);
        return;
      } catch {
        this.fallBack();
        return;
      }
    }
    this.fallBack();
  }

  private feed(w: Worker): void {
    if (this.onPage || this.next >= JOBS.length) {
      w.terminate();
      return;
    }
    const id = this.next++;
    const req: PaintRequest = { id, job: JOBS[id]!.job };
    w.postMessage(req);
  }

  private landed(w: Worker, reply: PaintReply): void {
    const entry = JOBS[reply.id]!;
    this.fill(entry.name, reply.bytes ?? paintJob(entry.job));
    this.feed(w);
  }

  /** Workers failed: paint every texture not yet poured on the page, one per task. */
  private fallBack(): void {
    if (this.onPage) return;
    this.onPage = true;
    for (const w of this.workers) w.terminate();
    this.workers.length = 0;
    // Jobs a dead worker held are lost with it, so this takes everything not poured.
    const left = JOBS.filter((j) => !this.poured.has(j.name));
    const step = () => {
      const j = left.shift();
      if (!j) return;
      this.fill(j.name, paintJob(j.job));
      setTimeout(step, 0);
    };
    setTimeout(step, 0);
  }

  /** Pour painted bytes into the texture objects the materials already hold. */
  private fill(name: keyof Tex, b: PaintedBytes): void {
    if (this.poured.has(name)) return;
    this.poured.add(name);
    const t = this.tex[name];
    const map = 'map' in t ? (t as Surface).map : (t as THREE.CanvasTexture);
    // The GPU copy is sized for the placeholder; dispose it so the upload allocates anew.
    map.dispose();
    map.image = rgbaCanvas(b.size, b.albedo);
    map.needsUpdate = true;
    this.upload(map);
    if ('normal' in t && b.normal) {
      t.normal.dispose();
      t.normal.image = { data: b.normal, width: b.size, height: b.size };
      t.normal.needsUpdate = true;
      this.upload(t.normal);
    }
    this.painted++;
  }
}
