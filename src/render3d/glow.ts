import * as THREE from 'three';
import { C, color } from '../render/sprites/palette';
import type { Flavor } from '../sim/types';

/**
 * Small looks the 3D actors share with the pixel view's rules in `world-view.ts`: the glow
 * of a Nubbin merged with the Keeper (the pixel sprite brightens, pulsing every 120 ms; here
 * a soft additive aura behind the body on the same pulse) and the colour of each fruit
 * flavour (the pixel prop sheet's `FRUIT_TINTS` body colours).
 */
export const FRUIT_COLOURS: Record<Flavor, string> = {
  swim: color(C.water),
  fly: color(C.skyLight),
  run: color(C.sunYellow),
  power: color(C.rose),
  stamina: color(C.mint),
  sun: color(C.cream),
  moon: color(C.violet),
};

/** The plain fruit, as the pixel sheet's unflavoured one. */
export const FRUIT_PLAIN = color(C.orange);

export class MergedGlow {
  private readonly mat: THREE.SpriteMaterial;
  private readonly sprites = new Map<string, THREE.Sprite>();

  constructor(private readonly group: THREE.Object3D) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    if (g) {
      const r = g.createRadialGradient(32, 32, 4, 32, 32, 32);
      r.addColorStop(0, 'rgba(255,244,200,1)');
      r.addColorStop(0.5, 'rgba(255,220,140,0.45)');
      r.addColorStop(1, 'rgba(255,200,120,0)');
      g.fillStyle = r;
      g.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    // Same program as the emote sprites (map, no fog), so nothing new to link.
    this.mat = new THREE.SpriteMaterial({
      map: tex,
      fog: false,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }

  /** Glow round `id` at its body's middle while `on`; `size` is the body height. */
  set(id: string, on: boolean, at: THREE.Vector3, size: number, nowMs: number): void {
    let s = this.sprites.get(id);
    if (!on) {
      if (s) {
        s.removeFromParent();
        this.sprites.delete(id);
      }
      return;
    }
    if (!s) {
      s = new THREE.Sprite(this.mat);
      this.sprites.set(id, s);
      this.group.add(s);
    }
    s.position.set(at.x, at.y + size * 0.5, at.z);
    s.scale.setScalar(size * 1.9);
    this.mat.opacity = 0.55 + 0.25 * Math.sin(nowMs / 120);
  }

  /** Drop the glow of anyone no longer shown. */
  keep(live: Set<string>): void {
    for (const [id, s] of this.sprites)
      if (!live.has(id)) {
        s.removeFromParent();
        this.sprites.delete(id);
      }
  }
}
