/**
 * The compass rose (R0082): a 44 px round button under the fps counter. A red "N" with a
 * triangle marks north and turns with the camera's yaw (the camera already eases yaw over
 * its snap time and snaps under reduced motion, so the rose just follows `currentYaw`).
 * Up to three ticks sit on the rim: home away from the Grove, the nearest undiscovered
 * landmark, and a tracked objective once something exposes one. Tapping opens the Map.
 */
import { WORLD_TEXT } from '../config/strings-world';
import { COMPASS, LANDMARKS } from '../config/tuning';
import type { Game } from '../game';
import { compassTicks, roseAngle, type TickKind } from './hud-world-math';

const GLYPH: Record<TickKind, string> = { home: '⌂', landmark: '?', objective: '★' };
const TICK_LABEL: Record<TickKind, string> = {
  home: WORLD_TEXT.compassHome,
  landmark: WORLD_TEXT.compassUnknown,
  objective: WORLD_TEXT.compassObjective,
};

export function mountCompass(
  parent: HTMLElement,
  game: () => Game | null,
  openMap: () => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'compass';
  btn.setAttribute('aria-label', WORLD_TEXT.compassLabel);
  btn.title = WORLD_TEXT.compassLabel;
  const rose = document.createElement('span');
  rose.className = 'compass-rose';
  const tri = document.createElement('span');
  tri.className = 'compass-tri';
  tri.textContent = '▲';
  const n = document.createElement('span');
  n.className = 'compass-n';
  n.textContent = WORLD_TEXT.compassN;
  rose.append(tri, n);
  const ticks = document.createElement('span');
  ticks.className = 'compass-ticks';
  btn.append(rose, ticks);
  btn.addEventListener('click', openMap);
  parent.appendChild(btn);

  let lastYaw = NaN;
  let lastTicks = '';
  const frame = (): void => {
    const g = game();
    if (g) {
      const yaw = g.camera.currentYaw;
      if (yaw !== lastYaw) {
        lastYaw = yaw;
        rose.style.transform = `rotate(${roseAngle(yaw)}rad)`;
        btn.dataset['yaw'] = String(yaw);
      }
      const w = g.world;
      // TODO(objective-poi): pass `objective` once the Journal or quest tracker exposes a place.
      const list = compassTicks({
        inGrove: w.location === 'grove',
        keeper: w.keeper.pos,
        yaw,
        landmarks: LANDMARKS,
        found: w.landmarks,
        range: COMPASS.landmarkRangeU,
        maxTicks: COMPASS.maxTicks,
      });
      const key = list.map((t) => `${t.kind}:${t.angle.toFixed(2)}`).join('|');
      if (key !== lastTicks) {
        lastTicks = key;
        ticks.replaceChildren(
          ...list.map((t) => {
            const s = document.createElement('span');
            s.className = `compass-tick compass-tick-${t.kind}`;
            s.style.transform = `rotate(${t.angle}rad) translateY(-${COMPASS.size / 2 - 7}px)`;
            const inner = document.createElement('span');
            inner.textContent = GLYPH[t.kind];
            inner.style.transform = `rotate(${-t.angle}rad)`;
            inner.title = TICK_LABEL[t.kind];
            s.appendChild(inner);
            return s;
          }),
        );
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return btn;
}
