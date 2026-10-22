import * as THREE from 'three';
import { bandFor } from '../render/cave-bands';
import type { Floor } from '../sim/dungeon';
import type { DungeonRun } from '../sim/types';
import type { Tex } from '../samples/aaa-kit';
import type { CaveLamps } from './cave-lamps';
import { HollowAtmos } from './hollow-atmos';
import { mat, type HollowCtx, type HollowFrame, type HollowModule } from './hollow-ctx';
import { HollowDress } from './hollow-dress';
import { HollowLight, lightBaker } from './hollow-light';
import { HollowRock, wallGeometry } from './hollow-rock';

/**
 * A Hollow Below floor in 3D, built from the sim's `Floor` (`sim/dungeon.ts`): rock walls
 * on the cells that border the open ground, a stone floor, still water in the wet cells,
 * the stairs up and down, the chest (open once looted), torches and glowing crystals, and
 * the loot still lying about (shaped as the pixel view paints it, `render/paint/dungeon.ts`).
 * Light comes from four point lights (the most a phone frame affords, review C item 6): the
 * Keeper's own lamp, as in the pixel view, and three that follow the torches nearest the
 * Keeper, so the light count never changes while underground. Their
 * programs differ from the Grove's (the lamps, no lanterns), so the scene links
 * them in the background with `withLamps` and the hidden `samples` (see grove-3d-scene.ts).
 * Picks use the pixel view's kinds: `stairs` (`up`/`down`), `chest`, `loot`.
 *
 * The cave kit (art pass 2): rock blocks bent by a world-space noise and faceted, the
 * painted rock texture laid on from the world position, moss on the tops, each block its
 * own tone; an earth floor darkened where it meets the rock; loose stones and spikes along
 * the walls; the painted water in the pools. Any wall standing between the camera and the
 * Keeper or a partner sinks to a low stub, smoothly, and rises again once passed, so the
 * party is never hidden behind it (review C, item 10).
 *
 * Module pattern (the art pass split): this file only assembles. Each of `hollow-rock`
 * (walls, floor), `hollow-light` (torches, crystals, the lamps), `hollow-dress` (props,
 * pools, picks) and `hollow-atmos` (particles, fog) is a class with `build(floor, ctx)`,
 * `dispose()` and an optional `update(t, keeper, frame)`, all sharing `HollowCtx`
 * (`hollow-ctx.ts`). A module's owner edits only that file; `hollow.ts` just calls it.
 */

export class Hollow {
  readonly group = new THREE.Group();
  private floor: Floor | null = null;
  private readonly ctx: HollowCtx;
  private readonly rock: HollowRock;
  private readonly light_: HollowLight;
  private readonly dress: HollowDress;
  private readonly atmos = new HollowAtmos();
  /** In build order: rock, dress, light, air (`update` runs them in this order too). */
  private readonly mods: HollowModule[];
  /**
   * One hidden mesh per program kind a floor uses (plain, flat-shaded and plain
   * instanced), so the cave programs can link before the first floor exists.
   */
  readonly samples = new THREE.Group();
  /** The shadow pass's depth programs for those (never drawn, never in the scene). */
  readonly shadowSamples = new THREE.Group();

  constructor(
    parent: THREE.Object3D,
    tex: Tex,
    private readonly sky: { sun: THREE.DirectionalLight; hemi: THREE.HemisphereLight },
  ) {
    this.ctx = {
      group: this.group,
      tex,
      sky,
      depth: 1,
      band: bandFor(1),
      reduceMotion: false,
      bakers: [],
      uniforms: { torchFlicker: { value: 1 } },
    };
    this.rock = new HollowRock(tex);
    this.dress = new HollowDress(tex);
    this.group.name = 'hollow';
    this.group.visible = false;
    parent.add(this.group);
    this.light_ = new HollowLight(parent);
    // A lit sconce re-bakes the floor's light; the rock's `rebake()` arrives with the bake seam.
    this.light_.rebake = () => (this.rock as Partial<{ rebake(): void }>).rebake?.();
    this.mods = [this.rock, this.dress, this.light_, this.atmos];
    const box = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const wallSample = new THREE.InstancedMesh(wallGeometry(), this.rock.rock, 1);
    wallSample.setColorAt(0, new THREE.Color('#ffffff'));
    const pool = new THREE.BufferGeometry();
    pool.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, 0.1, 0, 0, 0, 0, 0.1], 3),
    );
    pool.setAttribute('depth', new THREE.Float32BufferAttribute([0, 0, 0], 1));
    this.samples.add(
      new THREE.Mesh(box, mat('#4a4450')),
      wallSample,
      new THREE.Mesh(box, this.rock.earth),
      new THREE.InstancedMesh(box, this.dress.stone, 1),
      new THREE.Mesh(pool, this.dress.water.material),
      ...this.light_.programSamples(),
    );
    this.samples.traverse((o) => (o.castShadow = o.receiveShadow = true));
    // And a textured sprite, as the emote balls are, which may first appear underground.
    const dot = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    this.samples.add(new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, fog: false })));
    // The shadow pass draws casters with its own depth material (back faces), which
    // `compile` never sees; these match it when compiled as the pass draws (see the scene).
    const depth = new THREE.MeshDepthMaterial({ side: THREE.BackSide });
    this.shadowSamples.add(new THREE.Mesh(box, depth), new THREE.InstancedMesh(box, depth, 1));
    this.samples.visible = false;
    parent.add(this.samples);
  }

  /** The four point lights (`cave-lamps.ts`); the scene sets their colour and motion. */
  get lamps(): CaveLamps {
    return this.light_.lamps;
  }

  /** Whether the torch lamps are on (a floor is showing). */
  get lit(): boolean {
    return this.lamps.lit;
  }

  /** Run `fn` with the lamps counted as on or off; for compiling another place's set. */
  withLamps<T>(on: boolean, fn: () => T): T {
    return this.lamps.with(on, fn);
  }

  /** Build (or clear) the floor; called when the sim enters or leaves a floor. */
  set(f: Floor | null, depth = 1): void {
    if (f === this.floor) return;
    this.floor = f;
    // The band is set before any module builds (rock tint, torch and crystal colour).
    this.ctx.depth = depth;
    this.ctx.band = bandFor(depth);
    for (const m of this.mods) m.dispose();
    this.ctx.bakers.length = 0;
    if (f) this.ctx.bakers.push(lightBaker(f, this.ctx));
    if (f) for (const m of this.mods) m.build(f, this.ctx);
  }

  update(
    run: DungeonRun | null,
    keeper: { x: number; z: number },
    t: number,
    camera?: THREE.Vector3,
    party: ReadonlyArray<{ x: number; z: number }> = [],
  ): void {
    const on = !!this.floor && !!run;
    this.group.visible = on;
    const depth = run?.depth ?? this.ctx.depth;
    if (depth !== this.ctx.depth) {
      this.ctx.depth = depth;
      this.ctx.band = bandFor(depth);
    }
    this.ctx.reduceMotion = this.lamps.reduceMotion;
    const fr: HollowFrame = { on, run, camera, party };
    for (const m of this.mods) m.update?.(t, keeper, fr);
  }

  pick(
    ray: THREE.Ray,
    run: DungeonRun | null,
  ): { kind: 'stairs' | 'chest' | 'loot'; id: string; d: number } | null {
    if (!this.group.visible) return null;
    const sphere = new THREE.Sphere();
    const hit = new THREE.Vector3();
    let best: { kind: 'stairs' | 'chest' | 'loot'; id: string; d: number } | null = null;
    for (const [c, kind, id, r] of this.dress.picks) {
      if (kind === 'loot' && run?.taken.includes(id)) continue;
      sphere.center.copy(c);
      sphere.radius = r;
      if (!ray.intersectSphere(sphere, hit)) continue;
      const d = hit.distanceTo(ray.origin);
      if (!best || d < best.d) best = { kind, id, d };
    }
    return best;
  }

  /** Where stairs, the chest or a piece of loot sits and its reach, for the tap highlight. */
  spot(kind: string, id: string): { x: number; z: number; r: number } | null {
    if (!this.group.visible) return null;
    const p = this.dress.picks.find(([, k, i]) => k === kind && i === id);
    return p ? { x: p[0].x, z: p[0].z, r: p[3] } : null;
  }

  /** Ambient light for the floor: 0..1, deeper floors darker. */
  get light(): number {
    return this.floor?.light ?? 1;
  }
}
