import * as THREE from 'three';
import {
  RIDGE_CAVE,
  RIDGE_FALLS,
  RIDGE_HUT,
  RIDGE_TELESCOPE,
  RIDGE_TERRACES,
} from '../config/region-ridge';
import { snowballs } from '../sim/snowballs';
import { SNOWBALL } from '../config/tuning-more/world-region-content';
import type { World } from '../sim/types';
import type { RegionLayout } from '../config/region-layout';
import { paintRidge, RIDGE_GROUND, ridgeHeight, ridgeKind } from '../render/region-ridge';
import { at, kit3dModule, merged, tinted, type Kit3dDecor } from './region-kit';

/**
 * WORLD-36 (R11 lane D, d7): the ridge in Full 3D, on the region kit. Pines, boulders and
 * snow-laden pines as the fill; one merged mesh for the rock faces between the terraces (cut
 * where the switchback climbs), the stone hut, the summit telescope and the ice cave's mouth
 * with its lantern (an unlit glow, readable at night); the waterfall is one plane whose stripes
 * scroll (held still under reduced motion).
 */

const ROCK = '#8a8478';
const DROCK = '#6e675c';
const PINE = '#2c5a46';
const BARK = '#5a4030';
const SNOW = '#f2f6fa';

function pine(snowy: boolean): THREE.BufferGeometry {
  const parts = [tinted(at(new THREE.CylinderGeometry(0.14, 0.22, 1.2, 6), 0, 0.6, 0), BARK)];
  for (const [y, r, h] of [
    [1.6, 1.3, 1.8],
    [2.5, 1.0, 1.6],
    [3.3, 0.7, 1.3],
  ] as const) {
    parts.push(tinted(at(new THREE.ConeGeometry(r, h, 7), 0, y, 0), PINE, 0.15));
    if (snowy)
      parts.push(
        tinted(at(new THREE.ConeGeometry(r * 0.75, h * 0.45, 7), 0, y + h * 0.3, 0), SNOW),
      );
  }
  return merged(parts);
}

function boulder(): THREE.BufferGeometry {
  const g = new THREE.DodecahedronGeometry(0.9, 0);
  g.scale(1.2, 0.7, 1);
  return merged([tinted(at(g, 0, 0.45, 0), ROCK, 0.3)]);
}

function stoneProp(): THREE.BufferGeometry {
  const g = new THREE.DodecahedronGeometry(0.28, 0);
  g.scale(1.2, 0.7, 1);
  return merged([tinted(at(g, 0, 0.12, 0), ROCK, 0.3)]);
}

function pieces(l: RegionLayout): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const E = l.spec.size.w / 2 + l.margin;
  // Rock faces between the terraces, cut 2.6 units either side of each ramp.
  for (let i = 0; i + 1 < RIDGE_TERRACES.length; i++) {
    const hi = RIDGE_TERRACES[i]!;
    const lo = RIDGE_TERRACES[i + 1]!;
    const ramp = i % 2 === 0 ? -14 : 14;
    const top = hi.y - lo.y;
    for (const [x0, x1] of [
      [-E, ramp - 2.6],
      [ramp + 2.6, E],
    ] as const) {
      const g = new THREE.BoxGeometry(x1 - x0, top, lo.z0 - hi.z1 - 0.4);
      parts.push(tinted(at(g, (x0 + x1) / 2, lo.y + top / 2, (hi.z1 + lo.z0) / 2), DROCK, 0.12));
      if (hi.y >= 7.5)
        parts.push(
          tinted(
            at(new THREE.BoxGeometry(x1 - x0, 0.1, 1.2), (x0 + x1) / 2, hi.y + 0.05, hi.z1 + 0.5),
            SNOW,
          ),
        );
    }
  }
  const H = RIDGE_HUT;
  const hy = ridgeHeight(H.x, H.z);
  parts.push(tinted(at(new THREE.BoxGeometry(4.4, 2.4, 3.6), H.x, hy + 1.2, H.z), ROCK, 0.12));
  const roof = new THREE.ConeGeometry(3.4, 1.8, 4);
  roof.rotateY(Math.PI / 4);
  roof.scale(1, 1, 0.85);
  parts.push(tinted(at(roof, H.x, hy + 3.3, H.z), '#5a3a2a'));
  parts.push(tinted(at(new THREE.BoxGeometry(0.6, 1.3, 0.6), H.x + 1.4, hy + 3.6, H.z), ROCK));
  parts.push(
    tinted(at(new THREE.BoxGeometry(0.9, 1.5, 0.05), H.x, hy + 0.75, H.z + 1.82), '#3e2a1a'),
  );
  const T = RIDGE_TELESCOPE;
  const ty = ridgeHeight(T.x, T.z);
  for (const a of [0, 2.1, 4.2]) {
    const leg = new THREE.CylinderGeometry(0.03, 0.04, 1.3, 4);
    leg.rotateZ(0.3);
    leg.rotateY(a);
    parts.push(tinted(at(leg, T.x, ty + 0.62, T.z), BARK));
  }
  const tube = new THREE.CylinderGeometry(0.08, 0.13, 1.4, 8);
  tube.rotateZ(1.1);
  parts.push(tinted(at(tube, T.x, ty + 1.45, T.z), '#b8862e'));
  const C = RIDGE_CAVE;
  const cy = ridgeHeight(C.x, C.z);
  const mound = new THREE.SphereGeometry(3.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  mound.scale(1.3, 0.9, 1);
  parts.push(tinted(at(mound, C.x, cy, C.z - 0.6), ROCK, 0.2));
  const snowCap = new THREE.SphereGeometry(2.2, 10, 4, 0, Math.PI * 2, 0, Math.PI / 3);
  parts.push(tinted(at(snowCap, C.x - 0.6, cy + 1.2, C.z - 1), SNOW));
  const mouth = new THREE.CircleGeometry(1.5, 10, 0, Math.PI);
  parts.push(tinted(at(mouth, C.x, cy, C.z + 1.95), '#141c26'));
  parts.push(
    tinted(at(new THREE.CylinderGeometry(0.05, 0.06, 1.8, 5), C.x + 3, cy + 0.9, C.z + 2), BARK),
  );
  return merged(parts);
}

function cairnArch(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const x of [-2.2, 2.2])
    for (let i = 0; i < 5; i++)
      parts.push(
        tinted(
          at(new THREE.DodecahedronGeometry(0.5 - i * 0.05, 0), x, 0.4 + i * 0.7, 0),
          ROCK,
          0.3,
        ),
      );
  parts.push(tinted(at(new THREE.BoxGeometry(5.2, 0.25, 0.3), 0, 3.8, 0), BARK));
  return merged(parts);
}

/** The waterfall over level 1's cliff and the cave lantern's glow. */
function decorate(group: THREE.Group): Kit3dDecor {
  const F = RIDGE_FALLS;
  const top = RIDGE_TERRACES[3]!;
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 32;
  const g = c.getContext('2d')!;
  g.fillStyle = '#6fb6e0';
  g.fillRect(0, 0, 16, 32);
  g.fillStyle = '#e8f6ff';
  for (let i = 0; i < 10; i++) g.fillRect((i * 5) % 15, (i * 11) % 30, 1, 5);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.repeat.set(1, 2);
  // A sheet from the cliff's lip down to the pool, leaning out a little.
  const fg = new THREE.PlaneGeometry(F.w, top.y + 0.4);
  const fm = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85 });
  const falls = new THREE.Mesh(fg, fm);
  falls.position.set(F.x, top.y / 2, top.z1 + 5.4);
  falls.rotation.x = -0.25;
  falls.name = 'ridge-falls';
  group.add(falls);
  const C = RIDGE_CAVE;
  const cy = ridgeHeight(C.x, C.z);
  const lg = new THREE.BoxGeometry(0.4, 0.4, 0.4);
  const lm = new THREE.MeshBasicMaterial({ color: '#ffcf6a' });
  const lamp = new THREE.Mesh(lg, lm);
  lamp.position.set(C.x + 3, cy + 1.95, C.z + 2);
  lamp.name = 'ridge-cave-lamp';
  group.add(lamp);
  // R0113 (R13 d1): the snowballs in the air, a small pool of meshes shown while thrown.
  const sg = new THREE.IcosahedronGeometry(0.22, 1);
  const sm = new THREE.MeshStandardMaterial({ color: '#f4f9ff', roughness: 0.9 });
  const balls = Array.from({ length: SNOWBALL.max }, () => {
    const m = new THREE.Mesh(sg, sm);
    m.visible = false;
    m.name = 'ridge-snowball';
    group.add(m);
    return m;
  });
  return {
    sync(world: World) {
      const list = snowballs(world);
      balls.forEach((m, i) => {
        const b = list[i];
        m.visible = !!b;
        if (b) m.position.set(b.x, b.y, b.z);
      });
    },
    tick(t, still) {
      if (!still) tex.offset.y = (t * 0.8) % 1;
    },
    dispose() {
      falls.removeFromParent();
      lamp.removeFromParent();
      fg.dispose();
      fm.dispose();
      tex.dispose();
      for (const m of balls) m.removeFromParent();
      sg.dispose();
      sm.dispose();
      lg.dispose();
      lm.dispose();
    },
  };
}

const mod = kit3dModule({
  name: 'ridge',
  look: RIDGE_GROUND,
  paint: paintRidge,
  fill: () => [pine(false), boulder(), pine(true)],
  tuft: '#7f9a5a',
  prop: stoneProp,
  pieces,
  heightAt: ridgeHeight,
  kindAt: ridgeKind,
  decorate: (group) => decorate(group),
  arch: cairnArch,
  fold: true,
  cut: true,
});

export const createRegion3d = mod.createRegion3d;
export const entrance = mod.entrance;
