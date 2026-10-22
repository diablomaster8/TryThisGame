import * as THREE from 'three';
import { CG2_U } from '../config/tuning-u';
import type { Tex } from '../samples/aaa-kit';
import { pixelItem } from '../ui/item-art';
import { setItemSource } from '../ui/item-card';
import type { Dressing3d } from './dressings';
import { arc, box, buildStoryProp, cyl, Parts, sph } from './prop-kit';

/**
 * Campaign graphics 2, package u, Full 3D: the story item card's pictures (M9). Each item
 * is built from the prop kit (merged, painted, toon-lit), drawn once into a throwaway
 * renderer, copied to a canvas and cached. Nothing here runs in the frame loop; the model
 * is drawn the first time a scene names the item (or the card asks for it).
 */
const cache = new Map<string, HTMLCanvasElement | null>();
let texNow: Tex | null = null;
const own: THREE.Material[] = [];

const CREAM = '#f3ead2';

/** The item upright, facing +z, about one unit tall, origin at its centre. */
function buildItem(tex: Tex, kind: string): THREE.Group | null {
  const P = new Parts(tex);
  switch (kind) {
    case 'letter': {
      // A folded sheet: the upper face with lines of hand, the lower flap, a red seal.
      P.add('plain', box(0.8, 1.0, 0.02, 0.01), [0, 0, 0], CREAM);
      for (let i = 0; i < 4; i++)
        P.add(
          'plain',
          box(0.5 - (i % 2) * 0.1, 0.02, 0.005, 0.002),
          [-0.04, 0.34 - i * 0.1, 0.013],
          '#5a4a38',
        );
      P.add('plain', box(0.8, 0.46, 0.014, 0.008), [0, -0.27, 0.017], '#e6d9b8');
      P.add('plain', box(0.8, 0.012, 0.016, 0.004), [0, -0.04, 0.019], '#bda97c');
      P.add('plain', sph(0.085, 10, 8), [0, -0.04, 0.034], '#b13a3a', [0, 0, 0], [1, 1, 0.45]);
      P.add('plain', sph(0.04, 8, 6), [0, -0.04, 0.05], '#d96a5c', [0, 0, 0], [1, 1, 0.4]);
      break;
    }
    case 'notebook':
    case 'vane-notebook': {
      const vane = kind === 'vane-notebook';
      const cover = vane ? '#6b4a2e' : '#3f6b3a';
      const spine = vane ? '#4a3220' : '#2c4d2a';
      // Cover boards, a page block with its edge toward the viewer's right, a spine strip.
      P.add('plain', box(0.72, 0.96, 0.1, 0.03), [0, 0, 0], cover);
      P.add('plain', box(0.12, 0.96, 0.11, 0.03), [-0.3, 0, 0], spine);
      P.add('plain', box(0.04, 0.9, 0.082, 0.01), [0.355, 0, 0], CREAM);
      P.add('plain', box(0.4, 0.28, 0.01, 0.004), [0.04, 0.12, 0.056], vane ? '#d8c8a0' : CREAM);
      for (let i = 0; i < 3; i++)
        P.add('plain', box(0.3, 0.014, 0.004, 0.002), [0.04, 0.2 - i * 0.07, 0.062], '#5a4a38');
      if (vane) {
        // An elastic band, a worn corner, and a loose page poking out of the top.
        P.add('plain', box(0.035, 0.98, 0.115, 0.01), [0.2, 0, 0], '#1d1a1a');
        P.add('plain', box(0.12, 0.12, 0.104, 0.02), [0.3, -0.42, 0], '#8a7048');
        P.add('plain', box(0.34, 0.16, 0.01, 0.004), [-0.02, 0.52, 0], CREAM, [0, 0, 0.12]);
      } else {
        // A cloth band and a red ribbon hanging from the bottom edge.
        P.add('plain', box(0.04, 0.98, 0.115, 0.01), [0.22, 0, 0], '#e0b84a');
        P.add('plain', box(0.04, 0.2, 0.01, 0.003), [0.1, -0.56, 0.0], '#b13a3a');
      }
      break;
    }
    case 'stone': {
      const slab = buildStoryProp(tex, 'flatStone');
      if (!slab) return null;
      const G = new Parts(tex);
      // The stone's own pale blue light, as an emissive core and a few motes above it.
      G.add('glow', sph(0.09, 10, 8), [0.06, 0.6, 0.02], '#9fe0ff', [0, 0, 0], [1, 1, 1], 1.8);
      for (const [x, y] of [
        [-0.2, 0.74],
        [0.26, 0.8],
        [0.05, 0.9],
      ] as const)
        G.add('glow', sph(0.022, 6, 5), [x, y, 0.02], '#d6f3ff', [0, 0, 0], [1, 1, 1], 1.6);
      const out = new THREE.Group();
      slab.scale.set(0.8, 2.2, 0.8);
      out.add(slab, G.flush());
      return out;
    }
    case 'recording': {
      // A small white player: a round speaker, three sound bars, a lamp that is on.
      P.add('plain', box(0.84, 0.6, 0.3, 0.05), [0, 0, 0], '#e8e8f0');
      P.add('plain', cyl(0.2, 0.2, 0.04, 20), [-0.17, 0.02, 0.16], '#3a4056', [Math.PI / 2, 0, 0]);
      P.add('plain', cyl(0.1, 0.1, 0.05, 16), [-0.17, 0.02, 0.17], '#252a3a', [Math.PI / 2, 0, 0]);
      for (let i = 0; i < 3; i++)
        P.add(
          'glow',
          box(0.045, 0.1 + (i % 2) * 0.08, 0.02, 0.005),
          [0.17 + i * 0.1, 0.0, 0.155],
          '#7fe8f0',
          [0, 0, 0],
          [1, 1, 1],
          1.7,
        );
      P.add('glow', sph(0.03, 8, 6), [0.3, 0.22, 0.155], '#a7ffcb', [0, 0, 0], [1, 1, 1], 1.8);
      P.add('plain', arc(0.5, 0.012, Math.PI), [0, 0.0, -0.02], '#aab0c4', [0, 0, 0]);
      break;
    }
    default:
      return null;
  }
  return P.flush();
}

/** Draw the item once into a throwaway renderer and copy it out; null when it cannot. */
function renderItem(tex: Tex, kind: string): HTMLCanvasElement | null {
  const model = buildItem(tex, kind);
  if (!model) return null;
  const px = CG2_U.card.px3d;
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(1);
    renderer.setSize(px, px, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfff2dc, 0x7a6a88, 1.6));
    const sun = new THREE.DirectionalLight(0xfff0d0, 2.4);
    sun.position.set(-1.2, 2, 2.2);
    scene.add(sun, model);
    // Plain materials of this renderer: the kit's shared ones carry the Grove's own shader
    // hooks and uniforms, which mean nothing in a throwaway context.
    model.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const m =
        o.name === 'prop-glow'
          ? new THREE.MeshBasicMaterial({ vertexColors: true })
          : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0 });
      own.push(m);
      o.material = m;
    });
    // Frame it: a turn to the right so edges read, a little from above.
    model.rotation.set(-0.12, -0.42, 0);
    const box3 = new THREE.Box3().setFromObject(model);
    const centre = box3.getCenter(new THREE.Vector3());
    const size = box3.getSize(new THREE.Vector3()).length();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    camera.position.copy(centre).add(new THREE.Vector3(0, size * 0.12, size * 1.55));
    camera.lookAt(centre);
    renderer.render(scene, camera);
    const out = document.createElement('canvas');
    out.width = px;
    out.height = px;
    out.getContext('2d')?.drawImage(renderer.domElement, 0, 0);
    return out;
  } catch {
    return null;
  } finally {
    model.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    for (const m of own) m.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
  }
}

function itemImage(kind: string): HTMLCanvasElement | null {
  if (cache.has(kind)) return cache.get(kind) ?? null;
  const img = texNow ? renderItem(texNow, kind) : null;
  if (texNow) cache.set(kind, img);
  return img ?? pixelItem(kind);
}

export const dress3dU: Dressing3d = {
  id: 'u',
  build: (ctx) => {
    texNow = ctx.tex;
    cache.clear();
    setItemSource(itemImage);
  },
  update: (_world, stage) => {
    // Draw the scene's item before its card is asked for, off the dialogue's first frame.
    if (stage.item && !cache.has(stage.item)) itemImage(stage.item);
  },
  dispose: () => {
    setItemSource(null);
    texNow = null;
    cache.clear();
  },
};
