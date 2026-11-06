import * as THREE from 'three';
import { bandFor, bandForFloor } from '../render/cave-bands';
import type { Floor } from '../sim/dungeon';
import { lootHeld, sealDisplay } from '../sim/dungeon-secrets';
import type { DungeonRun } from '../sim/types';
import type { Tex } from '../samples/aaa-kit';
import type { CaveLamps } from './cave-lamps';
import { HollowAtmos } from './hollow-atmos';
import { HollowChasm } from './hollow-chasm';
import { HollowLeafBridge } from './hollow-leaf';
import { HollowTrail } from './hollow-trail';
import { HollowPlates } from './hollow-plates';
import { HollowShrines } from './hollow-shrines';
import { HollowTraps } from './hollow-traps';
import { HollowSeals } from './hollow-seals';
import { HollowRumble } from './hollow-rumble';
import { HollowTown } from './hollow-town';
import { mat, type HollowCtx, type HollowFrame, type HollowModule } from './hollow-ctx';
import { HollowDress, pathBaker } from './hollow-dress';
import { HollowFog } from './hollow-fog';
import { HollowLight, lightBaker } from './hollow-light';
import { HollowPop } from './hollow-pop';
import { HollowWaypoint } from './hollow-waypoint';
import { HollowKid3D } from './hollow-kid-3d';
import { HollowRock } from './hollow-rock';
import { HollowSectors } from './hollow-sectors';

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

interface TriCount {
  trisBuilt: number;
  trisDrawn: number;
  meshes: number;
}

/** `?perf` in the address turns the Hollow's build-time logging on (R0194). */
function perfOn(): boolean {
  try {
    return typeof location !== 'undefined' && new URLSearchParams(location.search).has('perf');
  } catch {
    return false;
  }
}

export class Hollow {
  readonly group = new THREE.Group();
  private floor: Floor | null = null;
  private readonly ctx: HollowCtx;
  private readonly rock: HollowRock;
  private readonly light_: HollowLight;
  private readonly dress: HollowDress;
  private readonly atmos = new HollowAtmos();
  private readonly pop = new HollowPop();
  private readonly waypoint = new HollowWaypoint();
  /** Lane B r10 (R0188): kid mode's counting berries. */
  private readonly kid = new HollowKid3D();
  /** Chasm pits (R0031). */
  private readonly chasm = new HollowChasm();
  /** The sprout leaf-bridge over a gap (R0025, round 12). */
  private readonly leafBridge = new HollowLeafBridge();
  /** Dropped stray Shells (R0162). */
  private readonly trail = new HollowTrail();
  /** Name plates over champion, elite and boss packs (R0155). */
  private readonly plates = new HollowPlates();
  /** Shrines (R0159). */
  private readonly shrines = new HollowShrines();
  /** Trap tiles (R0161). */
  private readonly traps = new HollowTraps();
  /** Lane B r8: secret walls, puzzles, part spots and the hint arrow (R0182, R0202, R0212). */
  private readonly seals = new HollowSeals();
  private readonly rumble = new HollowRumble();
  /** Act camps and fields: stalls, keepers and cave mouths (R0152, R0147). */
  private readonly town = new HollowTown();
  /** Lane B r10: a field shows only the scatter round the Keeper (R0147). */
  private readonly sectors = new HollowSectors();
  /** Fog of war (R0153); first, so the others read this frame's fog. */
  private readonly fog = new HollowFog();
  /** In build order: fog, rock, dress, light, air (`update` runs them in this order too). */
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
    this.rock = new HollowRock(tex, this.ctx.uniforms.torchFlicker);
    this.dress = new HollowDress(tex);
    this.group.name = 'hollow';
    this.group.visible = false;
    parent.add(this.group);
    this.light_ = new HollowLight(parent);
    this.dress.useLights(this.light_);
    // A lit sconce re-bakes the floor's light.
    this.light_.rebake = () => this.rock.rebake();
    this.mods = [
      this.fog,
      this.rock,
      this.chasm,
      this.leafBridge,
      this.dress,
      this.light_,
      this.atmos,
      this.pop,
      this.waypoint,
      this.kid,
      this.trail,
      this.plates,
      this.shrines,
      this.traps,
      this.seals,
      this.rumble,
      this.town,
      // Last: it reads what the others built (R0147).
      this.sectors,
    ];
    const box = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const wallSample = new THREE.Mesh(box, this.rock.rock);
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
      ...this.dress.samples(),
      ...this.light_.programSamples(),
    );
    this.samples.traverse((o) => (o.castShadow = o.receiveShadow = true));
    // And a textured sprite, as the emote balls are, which may first appear underground.
    const dot = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    this.samples.add(new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, fog: false })));
    // The shadow pass draws casters with its own depth material (back faces), which
    // `compile` never sees; these match it when compiled as the pass draws (see the scene).
    const depth = new THREE.MeshDepthMaterial({ side: THREE.BackSide });
    this.shadowSamples.add(
      new THREE.Mesh(box, depth),
      new THREE.InstancedMesh(box, depth, 1),
      new THREE.Mesh(box, this.rock.depth),
    );
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
  set(floor: Floor | null, depth = 1): void {
    // Every seal state of one floor draws as the same floor (lane B r8): a found secret or
    // the boss door sinks or raises a few wall blocks in `update`, never a rebuild.
    const f = floor && sealDisplay(floor);
    if (f === this.floor) return;
    this.floor = f;
    // The band is set before any module builds (rock tint, torch and crystal colour).
    this.ctx.depth = depth;
    this.ctx.band = bandForFloor(f, depth);
    for (const m of this.mods) m.dispose();
    this.ctx.bakers.length = 0;
    if (f) this.ctx.bakers.push(lightBaker(f, this.ctx));
    if (f) this.ctx.bakers.push(pathBaker(f, this.ctx));
    if (f) {
      const t0 = performance.now();
      const per: Record<string, number> = {};
      for (const m of this.mods) {
        const a = performance.now();
        m.build(f, this.ctx);
        per[m.constructor.name] = Math.round((performance.now() - a) * 10) / 10;
      }
      this.logBuild(f, performance.now() - t0, per, this.countTris());
    }
  }

  /**
   * Triangles built (all sectors, whole floor) and drawn now (shown sectors; draw ranges and
   * instance counts respected, the view's own culling not), with the mesh count, for the
   * `?perf` log (R0194). A sector mesh shares its floor's buffers, so it counts its own run.
   * Only run when logging is on.
   */
  private countTris(): TriCount {
    const none = { trisBuilt: 0, trisDrawn: 0, meshes: 0 };
    if (!perfOn()) return none;
    const out = { ...none };
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !m.geometry) return;
      const g = m.geometry as THREE.BufferGeometry;
      const total = (g.index ? g.index.count : (g.getAttribute('position')?.count ?? 0)) / 3;
      const inst = (m as THREE.InstancedMesh).isInstancedMesh ? (m as THREE.InstancedMesh) : null;
      const n = inst ? inst.count : 1;
      const range = g.drawRange.count === Infinity ? total * 3 : g.drawRange.count;
      const own = Math.min(total, range / 3);
      out.trisBuilt += own * n;
      out.trisDrawn += (m.visible ? own : 0) * n;
      out.meshes++;
    });
    out.trisBuilt = Math.round(out.trisBuilt);
    out.trisDrawn = Math.round(out.trisDrawn);
    return out;
  }

  /**
   * R0194 (DUNG-51): with `?perf` in the address, each floor's synchronous build time (ms) and
   * its per-module split go to the console and `window.__hollowPerf` (draw calls and
   * triangles are in the scene's own perf stats). Budget: 400 ms desktop, 1200 ms phone.
   */
  private logBuild(f: Floor, ms: number, per: Record<string, number>, tris: TriCount): void {
    if (!perfOn()) return;
    const row = {
      cols: f.cols,
      rows: f.rows,
      zone: f.zone ?? 'level',
      ms: Math.round(ms),
      per,
      ...tris,
    };
    (globalThis as { __hollowPerf?: unknown }).__hollowPerf = row;
    console.info('[perf] hollow floor build', JSON.stringify(row));
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
      this.ctx.band = bandForFloor(this.floor, depth);
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
      if (kind === 'loot' && (run?.taken.includes(id) || lootHeld(run, this.floor, id))) continue;
      // A find still under the fog cannot be tapped (R0153).
      if (kind === 'loot' && !this.fog.seen(run, this.dress.lootCell(id))) continue;
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
