/**
 * TECH-11: `window.grove.test`, the hooks browser specs use. Installed only by a `?e2e`
 * load (main.ts imports this file lazily), so a normal build never carries it into play.
 * `screenToWorld` and `worldToScreen` let a spec tap real canvas positions instead of
 * guessing pixels; `events()` returns the recent SimEvents the Game fed the HUD.
 */
import { Vector3 } from 'three';
import type { Game } from '../game';
import { createWorld } from '../sim/world';
import type { SimEvent } from '../sim/types';

const KEEP = 200;

export interface E2eApi {
  seed(n: number): void;
  setTimeScale(scale: number): void;
  events(): SimEvent[];
  /** Client (CSS pixel) position of a world point, or of a Nubbin by id. */
  worldToScreen(target: string | { x: number; z: number; y?: number }): { x: number; y: number } | null;
  screenToWorld(clientX: number, clientY: number): { x: number; z: number } | null;
}

export function installE2eApi(game: Game): E2eApi {
  const recent: SimEvent[] = [];
  const hooks = (game as unknown as { hooks: { onEvents(e: SimEvent[]): void } }).hooks;
  const original = hooks.onEvents.bind(hooks);
  hooks.onEvents = (events: SimEvent[]): void => {
    recent.push(...events);
    if (recent.length > KEEP) recent.splice(0, recent.length - KEEP);
    original(events);
  };
  const v = new Vector3();
  const api: E2eApi = {
    seed: (n) => game.replaceWorld(createWorld(n, Date.now())),
    setTimeScale: (s) => game.setTimeScale(s),
    events: () => recent.slice(),
    worldToScreen(target) {
      let p: { x: number; z: number; y?: number } | undefined;
      if (typeof target === 'string') {
        const n = game.world.nubbins.find((m) => m.id === target);
        p = n ? { x: n.pos.x, z: n.pos.z, y: n.y + 0.5 } : undefined;
      } else p = target;
      if (!p) return null;
      const rect = game.canvas.getBoundingClientRect();
      v.set(p.x, p.y ?? 0, p.z).project(game.camera.camera);
      return {
        x: rect.left + ((v.x + 1) / 2) * rect.width,
        y: rect.top + ((1 - v.y) / 2) * rect.height,
      };
    },
    screenToWorld: (x, y) => game.picker.groundPoint(x, y, game.camera.camera),
  };
  return api;
}
