import * as THREE from 'three';
import { markAt } from '../config/stage-marks';
import { CG4_U4 } from '../config/tuning-u4';
import { dressItems } from '../render/dress-d-rules';
import { stageFlags } from '../render/scene-stage';
import type { Tex } from '../samples/aaa-kit';
import { boardFace, noticeSheet } from '../ui/board-art';
import { setInspectSource, type InspectHandle } from '../ui/item-inspect';
import { buildItem } from './dress-u';
import type { Dressing3d } from './dressings';
import { groveHeight } from './terrain';

/**
 * Campaign graphics 4, package u4, Full 3D. Two jobs.
 *
 * K12, the keepsake inspector: while the panel is open, the item's prop-kit model is drawn
 * live in its own small renderer and turned by drag (it spins slowly on its own unless
 * reduced motion is on). The renderer is made when the panel opens and torn down when it
 * closes, so the phone pays for one extra small view only while it is looked at.
 *
 * K29, readable boards: the message board's face (a card per open request) and the guard
 * house notices are canvas textures drawn from strings.ts, laid over the board and the
 * cabin wall as small planes. They redraw only when the card count changes.
 */
let texNow: Tex | null = null;
let root: THREE.Group | null = null;
const owned: Array<{ dispose(): void }> = [];

interface Face {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  map: THREE.CanvasTexture | null;
  key: string;
}
let board: Face | null = null;
let notice: Face | null = null;

function makeFace(w: number, h: number): Face {
  const mat = new THREE.MeshBasicMaterial({ toneMapped: false, fog: false, transparent: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.visible = false;
  mesh.frustumCulled = false;
  owned.push(mesh.geometry, mat);
  root?.add(mesh);
  return { mesh, mat, map: null, key: '' };
}

function paint(f: Face, key: string, make: () => HTMLCanvasElement | null): void {
  if (f.key === key) return;
  f.key = key;
  const c = make();
  if (!c) return;
  f.map?.dispose();
  f.map = new THREE.CanvasTexture(c);
  f.map.colorSpace = THREE.SRGBColorSpace;
  f.map.anisotropy = 4;
  f.mat.map = f.map;
  f.mat.needsUpdate = true;
}

// ------------------------------------------------------------------------ the live inspector

function liveInspect(kind: string, host: HTMLElement, reduce: boolean): InspectHandle | null {
  const tex = texNow;
  if (!tex) return null;
  const model = buildItem(tex, kind);
  if (!model) return null;
  const size = CG4_U4.inspect.size;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CG4_U4.inspect.pixelRatio));
  renderer.setSize(size, size, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 'inspect-canvas smooth';
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.style.touchAction = 'none';
  canvas.setAttribute('role', 'img');
  host.appendChild(canvas);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff2dc, 0x7a6a88, 1.6));
  const sun = new THREE.DirectionalLight(0xfff0d0, 2.4);
  sun.position.set(-1.2, 2, 2.2);
  scene.add(sun);
  // Plain materials of this renderer: the kit's carry the Grove's own shader hooks.
  const mats: THREE.Material[] = [];
  model.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const m =
      o.name === 'prop-glow'
        ? new THREE.MeshBasicMaterial({ vertexColors: true })
        : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0 });
    mats.push(m);
    o.material = m;
  });
  // The model turns inside a pivot at its own centre, so any drag angle keeps it framed.
  const box3 = new THREE.Box3().setFromObject(model);
  const centre = box3.getCenter(new THREE.Vector3());
  const radius = box3.getSize(new THREE.Vector3()).length();
  model.position.sub(centre);
  const pivot = new THREE.Group();
  pivot.add(model);
  // Opens at a three-quarter angle facing the viewer, tilted so a flat item shows its face.
  const BASE_YAW = 0.5;
  let userYaw = 0;
  let t = 0;
  const pose = (): void => {
    const sway = reduce ? 0 : Math.sin(t * CG4_U4.inspect.spinRad * 2) * 0.35;
    pivot.rotation.set(-0.35, BASE_YAW + userYaw + sway, 0);
  };
  pose();
  scene.add(pivot);
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, radius * 0.1, radius * 2.0);
  camera.lookAt(0, 0, 0);

  let dragging = false;
  let lastX = 0;
  let raf = 0;
  let last = performance.now();
  let alive = true;
  const draw = (): void => renderer.render(scene, camera);
  const loop = (now: number): void => {
    if (!alive) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!dragging) t += dt;
    pose();
    draw();
    raf = requestAnimationFrame(loop);
  };
  const onDown = (e: PointerEvent): void => {
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent): void => {
    if (!dragging) return;
    userYaw += (e.clientX - lastX) * CG4_U4.inspect.dragRad;
    pose();
    lastX = e.clientX;
    if (reduce) draw();
  };
  const onUp = (): void => {
    dragging = false;
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  draw();
  // No idle spin under reduced motion: it redraws on a drag or a Turn press only.
  if (!reduce) raf = requestAnimationFrame(loop);
  return {
    turn: () => {
      userYaw += Math.PI / 4;
      pose();
      if (reduce) draw();
    },
    dispose: () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      model.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      for (const m of mats) m.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

// ------------------------------------------------------------------------ boards

const faceY = (base: number, h: number): number => base + h / 2;

export const dress3dU4: Dressing3d = {
  id: 'u4',
  build: (ctx) => {
    texNow = ctx.tex;
    root = new THREE.Group();
    root.name = 'u4-boards';
    ctx.world3d.add(root);
    const B = CG4_U4.board;
    board = makeFace(B.three.w, B.three.h);
    notice = makeFace(B.notice.w, B.notice.h);
    setInspectSource(liveInspect);
  },
  update: (world, stage, daylight) => {
    if (!root || !board || !notice) return;
    const B = CG4_U4.board;
    const shade = 0.5 + 0.5 * (1 - daylight.darkness);
    // The message board: one card per open request, as the painted board shows them.
    const item = dressItems(world, stage, daylight.darkness).find((i) => i.shape === 'board');
    board.mesh.visible = !!item && !stage.exclusive;
    if (item) {
      paint(board, `n${item.n}`, () => boardFace(192, 120, item.n));
      const s = Math.sin(item.yaw);
      const c = Math.cos(item.yaw);
      const y = groveHeight(item.x, item.z) + faceY(B.three.bottom, B.three.h);
      board.mesh.position.set(item.x + s * B.three.forward, y, item.z + c * B.three.forward);
      board.mesh.rotation.y = item.yaw;
      board.mat.color.setScalar(shade);
    }
    // The Beetle Road's guard house notices.
    const flags = stageFlags(world, stage);
    const gh =
      flags.storyline === 'beetle' && !stage.exclusive ? markAt('grove', 'guardhouse') : null;
    notice.mesh.visible = !!gh;
    if (gh) {
      paint(notice, 'n', () => noticeSheet(160, 124));
      const s = Math.sin(gh.yaw);
      const c = Math.cos(gh.yaw);
      const N = B.notice;
      const out = N.out;
      // Out along the wall's normal, then sideways along its face (to the right of the door).
      const x = gh.x + s * out + c * N.side;
      const z = gh.z + c * out - s * N.side;
      notice.mesh.position.set(x, groveHeight(x, z) + faceY(N.bottom, N.h), z);
      notice.mesh.rotation.y = gh.yaw;
      notice.mat.color.setScalar(shade);
    }
  },
  dispose: () => {
    setInspectSource(null);
    root?.removeFromParent();
    board?.map?.dispose();
    notice?.map?.dispose();
    for (const o of owned) o.dispose();
    owned.length = 0;
    board = notice = root = null;
    texNow = null;
  },
};
