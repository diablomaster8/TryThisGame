/**
 * R0741: "teach your Nubbin". The round card gets the child's first Nubbin sitting beside
 * it, wearing the keepsakes the child has earned (`sim/edu-keepsakes.ts`); on a right answer
 * it hops and says "<name> learned it too!". The hop is skipped under reduced motion.
 * UI only: it reads the world and sends nothing.
 */
import { BUDDY_TEXT } from '../config/strings-buddy';
import { EDU_KEEPSAKES } from '../config/tuning-more/kids-noticing';
import type { Game } from '../game';
import { reducedMotion } from '../platform/motion';
import { nubbinPortrait } from './battle-party-pick';
import { el } from './dom';

/** Put the buddy at the top of a round card (a card is rebuilt each round). */
export function showBuddy(card: HTMLElement, g: Game | null): void {
  const n = g?.world.nubbins[0];
  if (!g || !n) return;
  const box = el('div', 'edu-buddy');
  box.style.cssText = 'display:flex;align-items:center;gap:8px;justify-content:center';
  const pic = nubbinPortrait(g, n);
  pic.style.cssText = 'width:64px;height:64px;image-rendering:pixelated';
  pic.setAttribute('role', 'img');
  pic.setAttribute('aria-label', BUDDY_TEXT.alt(n.name));
  box.appendChild(pic);
  const worn = g.world.inventory.keepsakes ?? [];
  const wears = EDU_KEEPSAKES.filter((k) => worn.includes(k.id));
  if (wears.length) {
    const hat = el('span', 'edu-buddy-worn', wears.map((k) => k.icon).join(' '));
    hat.title = wears
      .map((k) =>
        BUDDY_TEXT.wearing(n.name, BUDDY_TEXT.names[k.id as keyof typeof BUDDY_TEXT.names]),
      )
      .join(' ');
    box.appendChild(hat);
  }
  box.appendChild(el('span', 'edu-buddy-say'));
  card.appendChild(box);
}

/** The buddy copies a right answer: a hop and its line. */
export function cheerBuddy(card: HTMLElement, g: Game | null): void {
  const box = card.querySelector<HTMLElement>('.edu-buddy');
  const n = g?.world.nubbins[0];
  if (!box || !n) return;
  const say = box.querySelector<HTMLElement>('.edu-buddy-say');
  if (say) say.textContent = BUDDY_TEXT.learned(n.name);
  if (!reducedMotion())
    box
      .querySelector('canvas')
      ?.animate?.(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'none' }],
        { duration: 450, easing: 'ease-out' },
      );
}
