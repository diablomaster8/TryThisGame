import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';

/**
 * The Hollow's four real point lights (recommendations item 7): the Keeper's lamp and three
 * torch lamps, the most a phone frame affords, and none of them casts a shadow. The count
 * never changes underground, so no program relinks. A torch lamp keeps its torch until
 * another is clearly nearer (`hysteresis`), and a swap fades the lamp out, moves it and fades
 * it back in, so walking between torches never pops the light. Flicker stops under reduced
 * motion.
 */
export const LAMPS = 4;

/**
 * Which torch each torch lamp should light, given what each lit last time. The nearest
 * `slots.length` torches are wanted, a torch already lit counting `hysteresis` units nearer;
 * a slot whose torch is still wanted keeps it, and the others take the rest in order.
 * Returns one torch index per slot, or -1 when there are fewer torches than slots.
 */
export function assignTorches(
  slots: readonly number[],
  torches: ReadonlyArray<{ x: number; z: number }>,
  keeper: { x: number; z: number },
  hysteresis: number,
): number[] {
  const dist = (i: number) => {
    const t = torches[i]!;
    return Math.hypot(t.x - keeper.x, t.z - keeper.z) - (slots.includes(i) ? hysteresis : 0);
  };
  const wanted = torches
    .map((_, i) => i)
    .sort((a, b) => dist(a) - dist(b))
    .slice(0, slots.length);
  const out = slots.map((s) => (wanted.includes(s) ? s : -1));
  const free = wanted.filter((w) => !out.includes(w));
  return out.map((s) => (s === -1 ? (free.shift() ?? -1) : s));
}

export class CaveLamps {
  private readonly lights: THREE.PointLight[] = [];
  /** Per torch lamp: the torch it stands at, the torch it is heading for, its fade 0..1. */
  private at: number[] = [];
  private want: number[] = [];
  private fade: number[] = [];
  private torches: readonly THREE.Vector3[] = [];
  private lastT = 0;
  /** Set by the scene each frame from the game's reduced-motion setting. */
  reduceMotion = false;
  readonly torchColor = new THREE.Color(GROVE3D.cave.bands[0].torch);

  constructor(parent: THREE.Object3D) {
    for (let i = 0; i < LAMPS; i++) {
      // Hidden above ground: four more lights on every Grove material would cost each frame;
      // the one recompile happens on the way down the stairs.
      const l = new THREE.PointLight('#ffa850', 0, 9, 1.6);
      l.castShadow = false;
      l.visible = false;
      this.lights.push(l);
      parent.add(l);
    }
  }

  /** Whether the lamps are on (a floor is showing). */
  get lit(): boolean {
    return this.lights[0]!.visible;
  }

  /** Run `fn` with the lamps counted as on or off; for compiling another place's set. */
  with<T>(on: boolean, fn: () => T): T {
    const was = this.lights.map((l) => l.visible);
    for (const l of this.lights) l.visible = on;
    try {
      return fn();
    } finally {
      this.lights.forEach((l, i) => (l.visible = was[i]!));
    }
  }

  /** Light the floor round the Keeper; `on` false puts every lamp out. */
  update(
    on: boolean,
    keeper: { x: number; z: number },
    torches: readonly THREE.Vector3[],
    t: number,
  ): void {
    for (const l of this.lights) {
      l.intensity = 0;
      l.visible = on;
    }
    const dt = Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    if (!on) return;
    const cfg = GROVE3D.cave.light;
    const own = this.lights[0]!;
    own.color.set(cfg.keeper.color);
    own.position.set(keeper.x, cfg.keeper.height, keeper.z);
    own.intensity = cfg.keeper.intensity;
    own.distance = cfg.keeper.distance;
    own.decay = cfg.keeper.decay;
    const slots = LAMPS - 1;
    if (torches !== this.torches) {
      // A new floor: start each lamp dark at its torch and fade it up.
      this.torches = torches;
      this.at = assignTorches(new Array<number>(slots).fill(-1), torches, keeper, 0);
      this.want = [...this.at];
      this.fade = new Array<number>(slots).fill(0);
    } else {
      this.want = assignTorches(this.at, torches, keeper, cfg.hysteresis);
    }
    const step = dt * cfg.fadePerSec;
    for (let i = 0; i < slots; i++) {
      if (this.want[i] !== this.at[i]) {
        this.fade[i] = Math.max(0, this.fade[i]! - step);
        if (this.fade[i] === 0) this.at[i] = this.want[i]!;
      } else {
        this.fade[i] = Math.min(1, this.fade[i]! + step);
      }
      const l = this.lights[i + 1]!;
      const p = torches[this.at[i]!];
      if (!p) continue;
      l.position.copy(p);
      l.color.copy(this.torchColor);
      l.distance = cfg.torch.distance;
      l.decay = cfg.torch.decay;
      const flicker = this.reduceMotion ? 0 : Math.sin(t * 13 + i * 2) * cfg.torch.flicker;
      l.intensity = cfg.torch.intensity * (1 + flicker) * this.fade[i]!;
    }
  }
}
