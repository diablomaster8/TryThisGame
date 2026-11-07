/** Wires the Game to the pointer, touch and keyboard input (TECH-37), split out of game.ts. */
import { dungeonTapTarget } from './input/dungeon-tap';
import { DUNGEON_TAP } from './config/tuning-dungeon-tap';
import { GameInput } from './input/game-input';
import type { Grove3dScene } from './render3d/grove-3d-scene';
import { buzz } from './platform/haptics';
import type { Game } from './game';

/** The pointer and keyboard wiring for a Game. */
export function buildInput(g: Game, canvas: HTMLCanvasElement, s3: Grove3dScene | null): GameInput {
  return new GameInput(canvas, {
    camera: s3 ? s3.cameraRig(g.camera) : g.camera,
    picker: g.picker,
    pickables: () => g.grove?.pickables ?? s3!.pickables,
    pickSprite: (ndcX, ndcY) => (s3 ? s3.pick(ndcX, ndcY) : g.view.pick(ndcX, ndcY, g.camera)),
    hover: (hit) => {
      (s3 ?? g.view).setHighlight(hit);
      // A Nubbin that can be lifted says so; anything else tappable gets the hand.
      const grabbable = hit?.kind === 'nubbin' && g.canGrab(hit.id);
      canvas.style.cursor = grabbable ? 'grab' : hit ? 'pointer' : '';
    },
    sparkle: (pos) => (s3 ?? g.view).sparkle(pos.x, pos.z),
    placing: () => g.placing,
    survey: () => g.camera.survey,
    placeHover: (pos) => {
      g.placeHoverAt = pos;
    },
    canGrab: (id) => g.canGrab(id),
    send: (cmd) => g.send(cmd),
    onSelect: (id) => g.hooks.onSelect(id),
    // TECH-30: a tap on the carried Nubbin puts it down; a long press lift buzzes.
    carrying: () => g.world.keeper.carrying,
    haptic: (name) => void buzz(name, g.world.settings, g.reduceMotion),
    // HOT-3c: letting go of a hold-walk stops the Keeper where it stands.
    keeperPos: () => g.world.keeper.pos,
    // R0192: underground a tap near a pack, shrine, stone or loot walks right to it.
    dungeonSnap: (at) => dungeonTapTarget(g.world, at)?.pos ?? null,
    holdReplanMs: () => (g.world.location === 'dungeon' ? DUNGEON_TAP.replanMs : null),
    // MOVE-49: a gamepad drives Keeper 1 when co-op is off.
    pad: {
      coop: () => g.world.coop.active,
      nearNubbin: (within) => {
        const k = g.world.keeper.pos;
        let best: string | null = null;
        let bestD = within;
        for (const n of g.world.nubbins) {
          const d = Math.hypot(n.pos.x - k.x, n.pos.z - k.z);
          if (n.stage !== 'egg' && d <= bestD) {
            bestD = d;
            best = n.id;
          }
        }
        return best;
      },
      holding: () => g.world.keeper.carrying !== null,
      rotate: (dir) => g.camera.rotate(dir),
      zoom: (dir) => (dir > 0 ? g.camera.zoomIn() : g.camera.zoomOut()),
    },
  });
}
