/**
 * LOOK-64: a bonded Shadow Nubbin's warm rim in Full 3D. A soft additive aura sits at the
 * body's middle, so the body hides its centre and only the edge shows past the silhouette,
 * a warm rim round the grey. It grows with the Nubbin's trust in its Keeper, faint just
 * after the bond and full at 100. Each sprite has its own material (the same program as
 * the emote sprites) so the strength can differ per Nubbin.
 */
import * as THREE from 'three';

let shared: THREE.CanvasTexture | null = null;

function texture(): THREE.CanvasTexture {
  if (shared) return shared;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    const r = g.createRadialGradient(32, 32, 8, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,170,90,0)');
    r.addColorStop(0.55, 'rgba(255,170,90,0.9)');
    r.addColorStop(1, 'rgba(255,140,60,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
  }
  shared = new THREE.CanvasTexture(c);
  shared.colorSpace = THREE.SRGBColorSpace;
  return shared;
}

export class BondGlow {
  private readonly sprites = new Map<string, THREE.Sprite>();

  constructor(private readonly group: THREE.Object3D) {}

  /**
   * The rim round `id` at strength 0..1 (0 removes it); `size` is the body height. `tint`
   * colours it (LOOK-58's legendary halo is pale gold).
   */
  set(id: string, k: number, at: THREE.Vector3, size: number, tint = '#ffffff'): void {
    let s = this.sprites.get(id);
    if (k <= 0) {
      if (s) this.drop(id, s);
      return;
    }
    if (!s) {
      s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture(),
          fog: false,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      this.sprites.set(id, s);
      this.group.add(s);
    }
    s.position.set(at.x, at.y + size * 0.5, at.z);
    s.scale.setScalar(size * 1.45);
    s.material.opacity = k;
    s.material.color.set(tint);
  }

  keep(live: Set<string>): void {
    for (const [id, s] of this.sprites) if (!live.has(id)) this.drop(id, s);
  }

  private drop(id: string, s: THREE.Sprite): void {
    s.removeFromParent();
    s.material.dispose();
    this.sprites.delete(id);
  }
}
