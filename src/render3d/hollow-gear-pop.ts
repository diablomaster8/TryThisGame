import * as THREE from 'three';
import { RARITIES } from '../config/dungeon-loot';
import { GEAR_POP, gearPopFrame } from '../render/hollow-packs-pixel';

/**
 * The gear pickup pop in Full 3D (R0163, lane B r8): Hollow drops go straight to the satchel,
 * so a found piece shows its rarity's shape (● ◆ ⬟ ★ ✿ ⬢) rising over the Keeper's head and
 * fading, the same beat as the Pixel view's (`gearPopFrame`). One texture per rarity, made
 * on first use; a small pool of sprites whose material only swaps its map, with the same
 * settings as the Hollow's name plates, so no new texture or program appears mid-play.
 */
export class GearPop3D {
  private readonly tex = new Map<string, THREE.Texture>();
  private readonly pool: Array<{ sprite: THREE.Sprite; startMs: number }> = [];
  private queue: Array<{ rarity: string; startMs: number }> = [];

  constructor(private readonly parent: THREE.Object3D) {}

  /** A piece was found (event `gearFound`); several in a row pop one after another. */
  push(rarity: string, nowMs: number): void {
    const last = this.queue[this.queue.length - 1];
    const start = last ? Math.max(nowMs, last.startMs + GEAR_POP.stagger) : nowMs;
    this.queue.push({ rarity, startMs: start });
    if (this.queue.length > GEAR_POP.max) this.queue.shift();
  }

  /** Place the live pops over the Keeper's head (`feetY` is the ground under the Keeper). */
  update(nowMs: number, keeper: { x: number; z: number }, feetY: number, calm: boolean): void {
    this.queue = this.queue.filter((q) => nowMs - q.startMs < GEAR_POP.ms);
    let i = 0;
    for (const q of this.queue) {
      const fr = gearPopFrame(nowMs - q.startMs, calm);
      if (!fr) continue;
      const slot = this.slot(i++);
      if (!slot) break;
      const mat = slot.sprite.material;
      const map = this.texture(q.rarity);
      if (mat.map !== map) {
        mat.map = map;
      }
      mat.opacity = fr.opacity;
      slot.sprite.position.set(keeper.x, feetY + fr.y + 0.3, keeper.z);
      slot.sprite.visible = true;
    }
    for (; i < this.pool.length; i++) this.pool[i]!.sprite.visible = false;
  }

  private slot(i: number): { sprite: THREE.Sprite; startMs: number } | null {
    if (i >= GEAR_POP.max) return null;
    while (this.pool.length <= i) {
      const mat = new THREE.SpriteMaterial({
        map: this.texture('plain'),
        depthTest: false,
        fog: false,
        transparent: true,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.42, 0.42, 1);
      sprite.renderOrder = 11;
      sprite.name = 'gear-pop';
      sprite.visible = false;
      this.parent.add(sprite);
      this.pool.push({ sprite, startMs: 0 });
    }
    return this.pool[i]!;
  }

  private texture(rarity: string): THREE.Texture {
    const r = RARITIES.find((x) => x.id === rarity) ?? RARITIES[0]!;
    let t = this.tex.get(r.id);
    if (t) return t;
    const px = 64;
    const c = document.createElement('canvas');
    c.width = c.height = px;
    const g = c.getContext('2d')!;
    g.fillStyle = 'rgba(20, 16, 36, 0.78)';
    g.beginPath();
    g.arc(px / 2, px / 2, px / 2, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = r.colour;
    g.font = `700 ${px - 20}px system-ui, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(r.glyph, px / 2, px / 2 + 2);
    t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    this.tex.set(r.id, t);
    return t;
  }

  dispose(): void {
    for (const p of this.pool) {
      p.sprite.removeFromParent();
      p.sprite.material.dispose();
    }
    this.pool.length = 0;
    for (const t of this.tex.values()) t.dispose();
    this.tex.clear();
    this.queue = [];
  }
}
