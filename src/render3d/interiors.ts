import * as THREE from 'three';
import type { InteriorId } from '../config/stage-marks';
import { CG4_C4, GROVE3D } from '../config/tuning';
import { ROOM_FURNITURE, type Piece } from '../render/interior-layout';
import { ROOM_LOOKS } from '../render/paint/interiors';
import type { Tex } from '../samples/aaa-kit';
import { toonShader } from '../samples/creatures';
import { box, cyl, Parts, sph } from './prop-kit';

/**
 * Campaign graphics 4, K10, Full 3D: an interior as a three-wall box. Four walls are built
 * (each its own group, so the one between the camera and the room can be left out), from
 * the building kit's painted, toon-lit plaster, wood and stone (own instances, never cut by
 * the occluder) with timber trim, plus the room's feature on the back wall and its
 * furniture from prop-kit boxes. No light is added:
 * the walls and furniture carry a warm emissive fill by night, the windows glow (bloom),
 * and the stove and hearth fires are the prop kit's glow. Origin at the room's centre on
 * the floor; the back wall is at z = -d/2.
 */

export interface InteriorMats {
  wood: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  plain: THREE.MeshStandardMaterial;
  /** The window glass: its colour is set by the hour. */
  glass: THREE.MeshBasicMaterial;
}

/**
 * The rooms' own materials: the building kit's painted, toon-lit look, but without the
 * occluder (H9). Inside a room nothing should be cut away round a speaker: the counter in
 * front of Hob is part of the shot. Own instances also carry the night fill.
 */
export function interiorMats(tex: Tex): InteriorMats {
  const sky = GROVE3D.toon.sky;
  const tinted = (s: Tex['wood'], normal: number) => {
    const m = new THREE.MeshStandardMaterial({
      map: s.map,
      normalMap: s.normal,
      normalScale: new THREE.Vector2(normal, normal),
      roughness: 1,
      metalness: 0,
      vertexColors: true,
    });
    m.onBeforeCompile = (shader) => {
      toonShader(shader, 0, sky);
      m.userData.shader = shader;
    };
    m.customProgramCacheKey = () => `interior-toon|${sky}`;
    return m;
  };
  return {
    wood: tinted(tex.wood, 0.4),
    stone: tinted(tex.cobble, 0.45),
    plain: tinted(tex.plaster, 0.25),
    glass: new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, toneMapped: false }),
  };
}

export interface Interior3d {
  group: THREE.Group;
  /** N, E, S, W. */
  walls: THREE.Group[];
}

const FIRE = '#ffb050';
const FIRE_CORE = '#ffe7a0';

/** Swap the prop kit's materials on a flushed group for the room's own. */
function own(group: THREE.Group, mats: InteriorMats, glassForGlow: boolean): THREE.Group {
  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (mesh.name === 'prop-wood') mesh.material = mats.wood;
    else if (mesh.name === 'prop-stone') mesh.material = mats.stone;
    else if (mesh.name === 'prop-plain') mesh.material = mats.plain;
    else if (mesh.name === 'prop-glow' && glassForGlow) mesh.material = mats.glass;
  });
  return group;
}

/** A framed window on a wall's inner face at (x, y), `w` × `h`. Glass goes in `glass`. */
function windowOn(
  P: Parts,
  G: Parts,
  beam: string,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const z = 0.1;
  P.add('wood', box(w + 0.16, 0.08, 0.1), [x, y + h / 2 + 0.04, z], beam);
  P.add('wood', box(w + 0.16, 0.08, 0.16), [x, y - h / 2 - 0.04, z + 0.03], beam);
  P.add('wood', box(0.08, h, 0.1), [x - w / 2 - 0.04, y, z], beam);
  P.add('wood', box(0.08, h, 0.1), [x + w / 2 + 0.04, y, z], beam);
  P.add('wood', box(0.05, h, 0.06), [x, y, z], beam);
  P.add('wood', box(w, 0.05, 0.06), [x, y, z], beam);
  G.add('glow', box(w, h, 0.02, 0.005), [x, y, 0.06], '#ffffff');
}

/** One wall, along x from -len/2 to len/2, its inner face toward +z. */
function wall(
  tex: Tex,
  mats: InteriorMats,
  id: InteriorId,
  len: number,
  h: number,
  feature: boolean,
): THREE.Group {
  const L = ROOM_LOOKS[id];
  const P = new Parts(tex);
  const G = new Parts(tex);
  const boards = id === 'guardhouse';
  if (boards) {
    // Upright boards, a shade apart.
    const n = Math.round(len / 0.38);
    for (let i = 0; i < n; i++)
      P.add(
        'wood',
        box(len / n - 0.01, h, 0.14, 0.01),
        [-len / 2 + (i + 0.5) * (len / n), h / 2, 0],
        i % 3 === 1 ? L.wallDark : L.wall,
      );
  } else P.add('plain', box(len, h, 0.14, 0.01), [0, h / 2, 0], L.wall);
  // The skirting, the top beam and the corner posts.
  P.add('wood', box(len, 0.5, 0.06), [0, 0.25, 0.09], L.base);
  P.add('wood', box(len + 0.2, 0.2, 0.22), [0, h - 0.1, 0.04], L.beam);
  P.add('wood', box(0.18, h, 0.2), [-len / 2 + 0.09, h / 2, 0.06], L.beam);
  P.add('wood', box(0.18, h, 0.2), [len / 2 - 0.09, h / 2, 0.06], L.beam);
  const X = (share: number) => -len / 2 + share * len;
  if (!feature) windowOn(P, G, L.beam, 0, h * 0.62, 1.2, 1.0);
  else
    switch (id) {
      case 'kitchen': {
        windowOn(P, G, L.beam, X(0.55), h * 0.66, 1.3, 1.1);
        // The keepsake shelf: two boards with jars, a cup and Hazel's tin, ribbon and all.
        const sx = X(0.12) + 1.1;
        for (const sy of [h * 0.68, h * 0.46]) {
          P.add('wood', box(2.2, 0.08, 0.32), [sx, sy, 0.22], L.beam);
          P.add('wood', box(0.08, 0.18, 0.28), [sx - 0.95, sy - 0.12, 0.2], L.beam);
          P.add('wood', box(0.08, 0.18, 0.28), [sx + 0.95, sy - 0.12, 0.2], L.beam);
        }
        ['#d8a24a', '#9fbf6a', '#c9604a', '#e6d7a8'].forEach((c, i) => {
          P.add(
            'plain',
            cyl(0.13, 0.13, 0.36, 10),
            [sx - 0.8 + i * 0.38, h * 0.68 + 0.22, 0.24],
            c,
          );
          P.add(
            'plain',
            cyl(0.14, 0.14, 0.06, 10),
            [sx - 0.8 + i * 0.38, h * 0.68 + 0.42, 0.24],
            '#f4ead2',
          );
        });
        P.add('stone', box(0.66, 0.42, 0.34, 0.05), [sx - 0.25, h * 0.46 + 0.25, 0.24], '#6a8aa8');
        P.add('plain', box(0.12, 0.44, 0.36, 0.01), [sx - 0.25, h * 0.46 + 0.26, 0.24], '#c94a4a');
        P.add('plain', cyl(0.12, 0.1, 0.24, 10), [sx + 0.55, h * 0.46 + 0.16, 0.24], '#f2ecdc');
        // Herbs drying from the beam.
        for (let i = 0; i < 6; i++)
          P.add('plain', box(0.1, 0.36, 0.1), [X(0.78) + i * 0.28, h - 0.38, 0.3], '#6f8f4a');
        break;
      }
      case 'guardhouse': {
        // Dawn's sun, Dusk's moon and Dew's drop: three banners, each with its own shape.
        const cols = ['#e0a83a', '#6a4a8a', '#3a7aa8'];
        cols.forEach((c, i) => {
          const bx = X(0.55) + i * 0.9;
          P.add('wood', box(0.8, 0.07, 0.07), [bx, h - 0.45, 0.2], L.beam);
          P.add('plain', box(0.62, 1.2, 0.04, 0.005), [bx, h - 1.08, 0.18], c);
          const y = h - 0.95;
          if (i === 0)
            P.add('plain', cyl(0.18, 0.18, 0.03, 16), [bx, y, 0.21], '#fff2c8', [
              Math.PI / 2,
              0,
              0,
            ]);
          if (i === 1) {
            P.add('plain', cyl(0.18, 0.18, 0.03, 16), [bx, y, 0.21], '#e8e0f4', [
              Math.PI / 2,
              0,
              0,
            ]);
            P.add('plain', cyl(0.15, 0.15, 0.03, 16), [bx + 0.09, y + 0.06, 0.22], c, [
              Math.PI / 2,
              0,
              0,
            ]);
          }
          if (i === 2)
            P.add('plain', sph(0.15, 10, 8), [bx, y, 0.2], '#dff0f8', [0, 0, 0], [1, 1.5, 0.3]);
        });
        // The notice board, left.
        P.add('wood', box(1.7, 1.2, 0.08), [X(0.2), h * 0.6, 0.12], '#5a3e26');
        P.add('plain', box(1.5, 1.0, 0.04), [X(0.2), h * 0.6, 0.17], '#c8a878');
        for (let i = 0; i < 5; i++)
          P.add(
            'plain',
            box(0.36, 0.3, 0.02),
            [X(0.2) - 0.5 + (i % 3) * 0.48, h * 0.6 + 0.22 - Math.floor(i / 3) * 0.42, 0.2],
            '#f4ecd8',
          );
        break;
      }
      case 'corvin': {
        windowOn(P, G, L.beam, X(0.2), h * 0.62, 1.1, 1.0);
        // Shelves of seed tins, every label squared.
        for (let r = 0; r < 4; r++) {
          const sy = h * 0.32 + r * 0.52;
          P.add('wood', box(3.1, 0.07, 0.34), [X(0.72), sy, 0.22], L.beam);
          for (let i = 0; i < 8; i++)
            P.add(
              'stone',
              cyl(0.13, 0.13, 0.34, 10),
              [X(0.72) - 1.33 + i * 0.38, sy + 0.2, 0.24],
              ['#8a9aa0', '#a0947a', '#7a8a6a'][(i + r) % 3]!,
            );
        }
        break;
      }
      case 'crest': {
        windowOn(P, G, L.beam, X(0.17), h * 0.62, 1.1, 1.0);
        windowOn(P, G, L.beam, X(0.83), h * 0.62, 1.1, 1.0);
        // The crest over the hearth: a shield with a half sun.
        const y = h * 0.7;
        P.add('plain', box(1.0, 0.7, 0.06), [0, y + 0.1, 0.16], '#7a4a3a');
        P.add(
          'plain',
          box(0.7, 0.7, 0.06),
          [0, y - 0.18, 0.16],
          '#7a4a3a',
          [0, 0, Math.PI / 4],
          [1, 1, 1],
        );
        P.add('plain', cyl(0.26, 0.26, 0.04, 16), [0, y + 0.02, 0.2], '#e8c45a', [
          Math.PI / 2,
          0,
          0,
        ]);
        break;
      }
      case 'fold': {
        windowOn(P, G, L.beam, X(0.67), h * 0.62, 1.1, 0.95);
        P.add('wood', box(0.56, 0.48, 0.06), [X(0.67) + 0.28, h * 0.62 - 0.24, 0.12], '#7a6248');
        // Mended stone in the plaster, and pegs with a coat.
        for (let i = 0; i < 8; i++)
          P.add(
            'stone',
            box(0.28, 0.2, 0.06),
            [X(0.12) + (i % 4) * 0.3, h * 0.55 - Math.floor(i / 4) * 0.22, 0.09],
            i % 2 ? '#8f846e' : L.wallDark,
          );
        P.add('plain', box(0.3, 0.7, 0.12), [X(0.36), h * 0.55, 0.16], '#6a7a5a');
        break;
      }
    }
  const g = new THREE.Group();
  g.add(own(P.flush(), mats, false), own(G.flush(), mats, true));
  return g;
}

/** One piece of furniture at its spot in the room. */
function piece(P: Parts, p: Piece): void {
  const at = (dx: number, y: number, dz: number): [number, number, number] => [
    p.x + dx,
    (p.y3d ?? p.y ?? 0) + y,
    p.z + dz,
  ];
  const W = '#a8784a';
  const D = '#6a4428';
  switch (p.kind) {
    case 'table':
      P.add('wood', box(1.6, 0.1, 0.9), at(0, 0.82, 0), W);
      for (const [x, z] of [
        [-0.68, -0.34],
        [0.68, -0.34],
        [-0.68, 0.34],
        [0.68, 0.34],
      ] as const)
        P.add('wood', box(0.1, 0.78, 0.1), at(x, 0.39, z), D);
      P.add('plain', cyl(0.07, 0.06, 0.14, 10), at(-0.4, 0.94, 0.05), '#f2ecdc');
      P.add('plain', box(0.4, 0.14, 0.22, 0.05), at(0.15, 0.94, -0.1), '#c88a48');
      break;
    case 'stool':
      P.add('wood', cyl(0.24, 0.24, 0.08, 12), at(0, 0.48, 0), '#b08050');
      for (const a of [0, 2.1, 4.2])
        P.add('wood', box(0.06, 0.46, 0.06), at(Math.sin(a) * 0.15, 0.22, Math.cos(a) * 0.15), D);
      break;
    case 'stove':
      P.add('stone', box(1.0, 0.9, 0.7, 0.05), at(0, 0.45, 0), '#55555c');
      P.add('stone', box(1.04, 0.08, 0.74), at(0, 0.92, 0), '#6a6a72');
      P.add('stone', cyl(0.1, 0.1, 2.3, 10), at(0.25, 2.0, -0.15), '#4a4a4e');
      P.add('stone', box(0.5, 0.36, 0.04), at(0, 0.38, 0.36), '#2a2020');
      P.add('glow', box(0.4, 0.22, 0.02), at(0, 0.34, 0.38), FIRE, [0, 0, 0], [1, 1, 1], 2.2);
      break;
    case 'counter': {
      // Desk height (top 0.8), so Hob on his stool behind it shows seated from the waist
      // up (cg5); at a standing counter's height only his head cleared it.
      const k = 0.8;
      P.add('wood', box(3.75, 0.95 * k, 0.7, 0.03), at(0, 0.48 * k, 0), '#7a5232');
      P.add('wood', box(3.9, 0.1, 0.84), at(0, 1.0 * k, 0), W);
      for (let x = -1.5; x <= 1.5; x += 0.7)
        P.add('wood', box(0.07, 0.86 * k, 0.04), at(x, 0.45 * k, 0.36), '#5e4026');
      P.add('plain', box(0.8, 0.04, 0.5), at(-0.2, 0.87, 0.05), '#f4ecd8');
      P.add('wood', box(0.04, 0.05, 0.5), at(-0.2, 0.88, 0.05), '#3a2a1a');
      P.add('stone', cyl(0.08, 0.09, 0.14, 10), at(0.5, 0.92, 0.1), '#2a2a3a');
      break;
    }
    case 'chair':
      P.add('wood', box(0.7, 0.08, 0.66), at(0, 0.5, 0), '#a87a50');
      P.add('wood', box(0.7, 0.8, 0.08), at(0, 0.92, -0.3), '#8a6040');
      for (const [x, z] of [
        [-0.3, -0.28],
        [0.3, -0.28],
        [-0.3, 0.28],
        [0.3, 0.28],
      ] as const)
        P.add('wood', box(0.07, 0.48, 0.07), at(x, 0.24, z), D);
      break;
    case 'bed':
      P.add('wood', box(2.0, 0.3, 1.0), at(0, 0.15, 0), '#8a7a5a');
      P.add('plain', box(1.9, 0.12, 0.94, 0.05), at(0, 0.36, 0), '#c8b88a');
      P.add('plain', box(0.5, 0.14, 0.7, 0.06), at(-0.7, 0.48, 0), '#e8e0c8');
      P.add('plain', box(1.2, 0.08, 0.96, 0.03), at(0.35, 0.45, 0), '#6a7a8a');
      break;
    case 'bucket':
      P.add('stone', cyl(0.22, 0.18, 0.4, 12), at(0, 0.2, 0), '#8a8a90');
      P.add('plain', cyl(0.2, 0.2, 0.02, 12), at(0, 0.37, 0), '#6a8aa8');
      break;
    case 'kettle':
      P.add('stone', sph(0.2, 12, 8), at(0, 0.2, 0), '#5a5a62', [0, 0, 0], [1, 0.8, 1]);
      P.add('stone', cyl(0.03, 0.04, 0.2, 6), at(0.22, 0.24, 0), '#5a5a62', [0, 0, -0.9]);
      break;
    case 'hearth':
      P.add('stone', box(2.0, 1.7, 0.6, 0.04), at(0, 0.85, 0), '#a59c8c');
      P.add('wood', box(2.2, 0.14, 0.7), at(0, 1.5, 0.04), '#5a3626');
      P.add('stone', box(1.0, 0.9, 0.06), at(0, 0.5, 0.29), '#1e1612');
      P.add('glow', box(0.7, 0.3, 0.3), at(0, 0.18, 0.18), FIRE, [0, 0, 0], [1, 1, 1], 2.4);
      P.add('glow', box(0.36, 0.2, 0.2), at(0, 0.3, 0.2), FIRE_CORE, [0, 0, 0], [1, 1, 1], 2.6);
      break;
    case 'bench':
      P.add('wood', box(1.9, 0.1, 0.42), at(0, 0.46, 0), '#9a6a3e');
      P.add('wood', box(0.1, 0.42, 0.36), at(-0.8, 0.21, 0), D);
      P.add('wood', box(0.1, 0.42, 0.36), at(0.8, 0.21, 0), D);
      break;
    case 'lamp':
      P.add('wood', box(0.26, 0.06, 0.26), at(0, 0.03, 0), D);
      P.add(
        'glow',
        box(0.16, 0.26, 0.16, 0.03),
        at(0, 0.2, 0),
        '#ffd27a',
        [0, 0, 0],
        [1, 1, 1],
        2.4,
      );
      P.add('wood', box(0.24, 0.05, 0.24), at(0, 0.36, 0), D);
      break;
  }
}

/** Build interior `id`: floor, four walls (N, E, S, W), the feature and the furniture. */
export function buildInterior(tex: Tex, mats: InteriorMats, id: InteriorId): Interior3d {
  const R = CG4_C4.room;
  const L = ROOM_LOOKS[id];
  const group = new THREE.Group();
  group.name = `interior-${id}`;
  const F = new Parts(tex);
  F.add(L.planks ? 'wood' : 'stone', box(R.w, 0.12, R.d, 0.01), [0, -0.06, 0], L.floor);
  if (L.rug) F.add('plain', box(R.w * 0.42, 0.02, R.d * 0.36, 0.01), [-0.12, 0.01, -0.2], L.rug);
  for (const p of ROOM_FURNITURE[id]) piece(F, p);
  if (id === 'fold') {
    // The patch of daylight under the hole: a pale disc on the floor.
    F.add(
      'glow',
      cyl(0.85, 0.85, 0.01, 20),
      [0.55, 0.02, -0.6],
      '#fff0c8',
      [0, 0, 0],
      [1, 1, 0.7],
      1.1,
    );
  }
  group.add(own(F.flush(), mats, false));
  const spec: Array<[number, number, number, number, boolean]> = [
    [0, -R.d / 2, 0, R.w, true],
    [R.w / 2, 0, -Math.PI / 2, R.d, false],
    [0, R.d / 2, Math.PI, R.w, false],
    [-R.w / 2, 0, Math.PI / 2, R.d, false],
  ];
  const walls = spec.map(([x, z, ry, len, feature]) => {
    const g = wall(tex, mats, id, len, R.h, feature);
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    group.add(g);
    return g;
  });
  if (id === 'fold') {
    // The light through the roof: a soft, still shaft (additive, never pulsing).
    const geo = new THREE.CylinderGeometry(0.35, 0.85, R.h, 16, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: '#fff2cc',
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false,
    });
    const shaft = new THREE.Mesh(geo, mat);
    shaft.position.set(0.55, R.h / 2, -0.6);
    shaft.name = 'interior-shaft';
    group.add(shaft);
  }
  return { group, walls };
}

/** Dispose a built interior's geometry (the materials are shared and kept). */
export function disposeInterior(r: Interior3d): void {
  r.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) m.geometry.dispose();
    if (m.isMesh && m.name === 'interior-shaft') (m.material as THREE.Material).dispose();
  });
  r.group.removeFromParent();
}
