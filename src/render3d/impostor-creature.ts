import * as THREE from 'three';
import { WORLD_LOD } from '../config/tuning-world';

/**
 * R0079: far creatures as impostors. Past `impostorFrom` units a creature is a few dozen
 * pixels tall, yet even as its merged stand-in it costs a draw or five and some 25k triangles.
 * Each far creature gets a cell in one shared atlas, and a few cells a frame are drawn again
 * from the rig itself (with the Grove's own lights, from the main camera's angle, through an
 * orthographic camera that sees only the impostor layer), so the picture is the rig's, with
 * its pose a few frames behind. All far creatures are then one instanced draw: a quad per
 * creature, facing the camera, at the creature's middle, fogged as the scene is.
 *
 * A far rig's drawn meshes are parked on a layer no camera sees, and only the rig being drawn
 * is lifted to `IMPOSTOR_LAYER`, the one layer the cell camera sees (a rig's contact blob is
 * never frustum-culled, so it would otherwise be drawn into every cell). Lights are added to the layer so the
 * cell is lit as the scene is.
 */
export const IMPOSTOR_LAYER = 30;
/** Where a far rig's meshes wait between its cell's redraws (no camera sees it). */
const PARK_LAYER = 29;

interface Far {
  root: THREE.Object3D;
  slot: number;
  /** Meshes moved to the impostor layer, to move back. */
  moved: THREE.Object3D[];
  /** Height of the middle above the root, and the half-size, in world units. */
  lift: number;
  half: number;
  /** Frames since its cell was drawn (the stalest go first). */
  age: number;
  fresh: boolean;
}

const VERT = /* glsl */ `
#include <common>
#include <fog_pars_vertex>
attribute vec3 centre;
attribute float halfSize;
attribute vec4 cell;
varying vec2 vUv;
void main() {
  vUv = cell.xy + uv * cell.zw;
  vec4 mvPosition = viewMatrix * vec4( centre, 1.0 );
  mvPosition.xy += position.xy * 2.0 * halfSize;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;

const FRAG = /* glsl */ `
#include <common>
#include <fog_pars_fragment>
uniform sampler2D map;
varying vec2 vUv;
void main() {
  vec4 c = texture2D( map, vUv );
  if ( c.a < 0.02 ) discard;
  gl_FragColor = c;
  // The cell holds premultiplied colour: fog the colour and the alpha it carries alike.
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
    #else
      float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
    #endif
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor * gl_FragColor.a, fogFactor );
  #endif
}`;

export class CreatureImpostors {
  private readonly cfg = WORLD_LOD.creature.impostor;
  private readonly cols = this.cfg.atlasPx / this.cfg.cellPx;
  readonly target = new THREE.WebGLRenderTarget(this.cfg.atlasPx, this.cfg.atlasPx, {
    depthBuffer: true,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: false,
  });
  private readonly far = new Map<THREE.Object3D, Far>();
  private readonly freeSlots: number[] = [];
  private readonly cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
  private readonly geo = new THREE.InstancedBufferGeometry();
  private readonly centre: THREE.InstancedBufferAttribute;
  private readonly halfAttr: THREE.InstancedBufferAttribute;
  private readonly cell: THREE.InstancedBufferAttribute;
  readonly mesh: THREE.Mesh;
  private lights: THREE.Light[] = [];
  private lightScan = 0;
  /** Cells drawn on the last frame, for the readout. */
  drawn = 0;

  constructor(scene: THREE.Scene) {
    const n = this.cols * this.cols;
    for (let i = n - 1; i >= 0; i--) this.freeSlots.push(i);
    const plane = new THREE.PlaneGeometry(1, 1);
    this.geo.index = plane.index;
    this.geo.setAttribute('position', plane.attributes.position!);
    this.geo.setAttribute('uv', plane.attributes.uv!);
    this.centre = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3);
    this.halfAttr = new THREE.InstancedBufferAttribute(new Float32Array(n), 1);
    this.cell = new THREE.InstancedBufferAttribute(new Float32Array(n * 4), 4);
    for (const a of [this.centre, this.halfAttr, this.cell]) a.setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute('centre', this.centre);
    this.geo.setAttribute('halfSize', this.halfAttr);
    this.geo.setAttribute('cell', this.cell);
    this.geo.instanceCount = 0;
    const mat = new THREE.ShaderMaterial({
      // The atlas is added after the merge: a render target's texture cannot be cloned.
      uniforms: {
        ...THREE.UniformsUtils.merge([THREE.UniformsLib.fog]),
        map: { value: this.target.texture },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      fog: true,
      transparent: true,
      premultipliedAlpha: true,
      depthWrite: true,
    });
    this.mesh = new THREE.Mesh(this.geo, mat);
    this.mesh.frustumCulled = false;
    this.mesh.name = 'creature-impostors';
    this.mesh.raycast = () => {};
    this.cam.layers.set(IMPOSTOR_LAYER);
    scene.add(this.mesh);
  }

  get count(): number {
    return this.far.size;
  }

  has(root: THREE.Object3D): boolean {
    return this.far.has(root);
  }

  /**
   * Make a rig far: its drawn meshes (those on layer 0 now, with its stand-in on) go to the
   * impostor layer. `lift` and `half` frame it, in world units. False when the atlas is full.
   */
  enter(root: THREE.Object3D, lift: number, half: number): boolean {
    if (this.far.has(root)) return true;
    const slot = this.freeSlots.pop();
    if (slot === undefined) return false;
    const moved: THREE.Object3D[] = [];
    root.traverse((o) => {
      if (((o as THREE.Mesh).isMesh || (o as THREE.Sprite).isSprite) && o.layers.mask === 1) {
        o.layers.set(PARK_LAYER);
        moved.push(o);
      }
    });
    this.far.set(root, { root, slot, moved, lift, half, age: 1e6, fresh: false });
    return true;
  }

  /** Give a rig back to the main pass. */
  leave(root: THREE.Object3D): void {
    const f = this.far.get(root);
    if (!f) return;
    for (const o of f.moved) if (o.layers.mask === 1 << PARK_LAYER) o.layers.set(0);
    this.freeSlots.push(f.slot);
    this.far.delete(root);
  }

  /** Every rig far now (`update` drops the others with `leave`). */
  roots(): IterableIterator<THREE.Object3D> {
    return this.far.keys();
  }

  /**
   * Redraw the stalest cells (at most `perFrame`, a fresh one first) and lay out the quads.
   * Call after the frame's matrices are current and before the main pass.
   */
  render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): void {
    this.drawn = 0;
    const list = [...this.far.values()];
    this.geo.instanceCount = list.length;
    if (!list.length) return;
    if (this.lightScan-- <= 0) this.scanLights(scene);
    const at = new THREE.Vector3();
    const size = 1 / this.cols;
    list.forEach((f, i) => {
      f.root.getWorldPosition(at);
      this.centre.setXYZ(i, at.x, at.y + f.lift, at.z);
      this.halfAttr.setX(i, f.fresh && f.root.visible ? f.half : 0);
      const col = f.slot % this.cols;
      const row = Math.floor(f.slot / this.cols);
      this.cell.setXYZW(i, col * size, row * size, size, size);
      f.age++;
    });
    this.centre.needsUpdate = this.halfAttr.needsUpdate = this.cell.needsUpdate = true;
    const due = list
      .filter((f) => f.root.visible && (!f.fresh || f.age >= this.cfg.minAge))
      .sort((a, b) => b.age - a.age)
      .slice(0, this.cfg.perFrame);
    if (!due.length) return;
    // Draw the cells with the scene's lights but no sky, fog or shadow redraw.
    const prev = {
      target: renderer.getRenderTarget(),
      clear: renderer.getClearColor(new THREE.Color()),
      alpha: renderer.getClearAlpha(),
      background: scene.background,
      fog: scene.fog,
      auto: scene.matrixWorldAutoUpdate,
      shadowAuto: renderer.shadowMap.autoUpdate,
      shadowNeeds: renderer.shadowMap.needsUpdate,
    };
    scene.background = null;
    scene.fog = null;
    scene.matrixWorldAutoUpdate = false;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = false;
    renderer.setClearColor(0x000000, 0);
    const px = this.cfg.cellPx;
    const back = new THREE.Vector3();
    for (const f of due) {
      f.root.getWorldPosition(at);
      at.y += f.lift;
      back.set(0, 0, 1).applyQuaternion(camera.quaternion);
      this.cam.position.copy(at).addScaledVector(back, f.half * 2);
      this.cam.quaternion.copy(camera.quaternion);
      this.cam.left = this.cam.bottom = -f.half;
      this.cam.right = this.cam.top = f.half;
      this.cam.near = 0.01;
      this.cam.far = f.half * 4;
      this.cam.updateProjectionMatrix();
      this.cam.updateMatrixWorld();
      const x = (f.slot % this.cols) * px;
      const y = Math.floor(f.slot / this.cols) * px;
      this.target.viewport.set(x, y, px, px);
      this.target.scissor.set(x, y, px, px);
      this.target.scissorTest = true;
      renderer.setRenderTarget(this.target);
      renderer.clear(true, true, false);
      for (const o of f.moved) if (o.layers.mask === 1 << PARK_LAYER) o.layers.set(IMPOSTOR_LAYER);
      renderer.render(scene, this.cam);
      for (const o of f.moved) if (o.layers.mask === 1 << IMPOSTOR_LAYER) o.layers.set(PARK_LAYER);
      f.age = 0;
      f.fresh = true;
      this.drawn++;
    }
    renderer.setRenderTarget(prev.target);
    renderer.setClearColor(prev.clear, prev.alpha);
    scene.background = prev.background;
    scene.fog = prev.fog;
    scene.matrixWorldAutoUpdate = prev.auto;
    renderer.shadowMap.autoUpdate = prev.shadowAuto;
    renderer.shadowMap.needsUpdate = prev.shadowNeeds;
  }

  /** Lights reach the impostor layer too (looked for again now and then: lamps come and go). */
  private scanLights(scene: THREE.Scene): void {
    this.lightScan = 120;
    this.lights = [];
    scene.traverse((o) => {
      if ((o as THREE.Light).isLight) this.lights.push(o as THREE.Light);
    });
    for (const l of this.lights) l.layers.enable(IMPOSTOR_LAYER);
  }

  /** Give every rig back and free the atlas. */
  dispose(): void {
    for (const root of [...this.far.keys()]) this.leave(root);
    this.mesh.removeFromParent();
    this.geo.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.target.dispose();
  }
}
