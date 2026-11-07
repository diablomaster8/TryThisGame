import * as THREE from 'three';
import { neighbourBeacons, type BeaconBearing } from '../sim/beacons';
import { BEACON_BACKDROP } from '../config/tuning-more/world-backdrops';
import type { World } from '../sim/types';

/**
 * R13 d2 (R0117, WORLD-50): backdrop cards. Beyond each exit of a drawn region (and of the
 * Grove) one tall, soft, unfogged card with the neighbour's beacon icon stands where that
 * region lies, so the way on reads from across the field before the compass is checked. At
 * most `BEACON_BACKDROP.max` sprites (one draw each), in whichever scene is drawing.
 */
const cache = new Map<string, THREE.Texture>();

function cardTexture(icon: string): THREE.Texture {
  const hit = cache.get(icon);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, 'rgba(210,225,255,0)');
  grad.addColorStop(1, 'rgba(210,225,255,0.55)');
  g.fillStyle = grad;
  g.fillRect(14, 20, 36, 108);
  g.font = '40px serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.globalAlpha = 0.92;
  g.fillText(icon, 32, 34);
  const t = new THREE.CanvasTexture(c);
  cache.set(icon, t);
  return t;
}

export class BeaconBackdrop {
  private readonly cards: THREE.Sprite[] = [];
  private key = '';

  constructor(private readonly scene: THREE.Object3D) {}

  update(world: Pick<World, 'location'>, y: number): void {
    const list: BeaconBearing[] = neighbourBeacons(world).slice(0, BEACON_BACKDROP.max);
    const key = list.map((b) => b.region).join(',') + '@' + world.location;
    if (key !== this.key) {
      this.key = key;
      for (const s of this.cards) this.dispose(s);
      this.cards.length = 0;
      for (const b of list) {
        const s = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: cardTexture(b.icon),
            transparent: true,
            depthWrite: false,
            fog: false,
            opacity: BEACON_BACKDROP.opacity,
          }),
        );
        const d = b.distance + BEACON_BACKDROP.beyond;
        s.scale.set(BEACON_BACKDROP.height / 2, BEACON_BACKDROP.height, 1);
        s.center.set(0.5, 0);
        s.position.set(Math.sin(b.bearing) * d, y, Math.cos(b.bearing) * d);
        s.name = 'beacon-backdrop';
        this.scene.add(s);
        this.cards.push(s);
      }
    }
    for (const s of this.cards) s.position.y = y;
  }

  private dispose(s: THREE.Sprite): void {
    s.removeFromParent();
    s.material.dispose();
  }
}
