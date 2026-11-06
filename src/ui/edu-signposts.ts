import '../world-hud.css';
import { EDU_SIGNPOST_TEXT } from '../config/strings-r13d2';
import { BEACON_LANDMARKS } from '../config/region-extras-r11d6';
import { REGIONS } from '../config/regions';
import type { Game } from '../game';
import { regionOf } from '../sim/regions';

/**
 * R13 d2 (R0099, WORLD-40): the Learning Grove's picture signposts. In the sprout band, each
 * way out of the Grove that leads to a built, kid-safe place is one big picture button (the
 * place's icon, an aria label that reads aloud); the sim refuses every other way. Inside such a
 * place the same row shows one house button back to the Grove. Hidden outside the sprout band.
 */
export function mountEduSignposts(root: HTMLElement, game: () => Game | null): void {
  const row = document.createElement('div');
  row.className = 'edu-signposts';
  row.hidden = true;
  root.appendChild(row);
  let shown = '';
  const frame = (): void => {
    requestAnimationFrame(frame);
    const g = game();
    const on = !!g && g.world.edu?.band === 'sprout';
    if (!g || !on) {
      row.hidden = true;
      return;
    }
    const here = regionOf(g.world.location);
    const exits =
      here === 'grove'
        ? REGIONS.grove.exits.filter(
            (e) => REGIONS[e.to].built && REGIONS[e.to].kidsSafe && e.to !== 'hollow',
          )
        : REGIONS[here].exits.filter((e) => e.to === 'grove').slice(0, 1);
    const key = here + exits.map((e) => e.id).join(',');
    if (key !== shown) {
      shown = key;
      row.replaceChildren(
        ...exits.map((e) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn edu-signpost';
          const home = e.to === 'grove';
          const name = EDU_SIGNPOST_TEXT.names[e.to] ?? e.to;
          b.textContent = home
            ? '🏠'
            : (BEACON_LANDMARKS[e.to as keyof typeof BEACON_LANDMARKS]?.icon ?? '🪧');
          b.setAttribute(
            'aria-label',
            home ? EDU_SIGNPOST_TEXT.home : EDU_SIGNPOST_TEXT.label(name),
          );
          b.addEventListener('click', () => game()?.send({ kind: 'travel', exit: e.id }));
          return b;
        }),
      );
    }
    row.hidden = exits.length === 0;
  };
  requestAnimationFrame(frame);
}
