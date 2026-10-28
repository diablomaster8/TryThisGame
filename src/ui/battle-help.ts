import { TYPE_HELP, TYPE_WORDS } from '../config/strings-battle';
import { beats, LOOP } from '../sim/battle/types-chart';
import { button, el } from './dom';

/**
 * The type help card (recs FIGHT-13): a five-icon wheel with arrows and words. The lines are
 * built from the sim's own loop, so "Swim soaks Fly" can never disagree with the maths (a
 * test reads `buildTypeHelp`).
 */
export function typeHelpLines(): string[] {
  return [
    ...LOOP.map((t) => TYPE_HELP.beats(t, beats(t)!)),
    TYPE_HELP.even,
    TYPE_HELP.normal,
    TYPE_HELP.sunMoon,
    TYPE_HELP.eternal,
  ];
}

export function buildTypeHelp(): string {
  return typeHelpLines().join('\n');
}

/** The wheel: the four loop types round a circle with arrows, Normal in the middle. */
function wheel(): HTMLElement {
  const box = el('div', 'type-wheel');
  box.setAttribute('aria-hidden', 'true');
  LOOP.forEach((t, i) => {
    const spot = el(
      'span',
      `type-spot type-spot-${i}`,
      `${TYPE_WORDS[t].icon} ${TYPE_WORDS[t].name}`,
    );
    box.appendChild(spot);
    box.appendChild(el('span', `type-arrow type-arrow-${i}`, '➜'));
  });
  box.appendChild(
    el('span', 'type-spot type-mid', `${TYPE_WORDS.normal.icon} ${TYPE_WORDS.normal.name}`),
  );
  return box;
}

/** Opens the card over `parent`; closes on its button. */
export function openTypeHelp(parent: HTMLElement): HTMLElement {
  const card = el('div', 'type-help');
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', TYPE_HELP.title);
  card.appendChild(el('div', 'btn-name', TYPE_HELP.title));
  card.appendChild(wheel());
  for (const line of typeHelpLines()) card.appendChild(el('p', 'help', line));
  card.appendChild(button(TYPE_HELP.close, () => card.remove(), 'btn btn-small btn-primary'));
  parent.appendChild(card);
  return card;
}
