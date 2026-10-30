import { PLACES_EDU, type EduPlaceId } from '../config/edu';
import { EDU_PLACES_TEXT } from '../config/strings';
import { EDU_VOICE } from '../config/tuning-kids';
import type { Game } from '../game';
import type { EduState } from '../sim/types';
import { button, el, modal } from './dom';
import { speakLine } from './lesson';

/**
 * R0680 (KIDS-12): in a Learning Grove the ⋯ button opens "Places", a 2-column grid of big
 * picture tiles instead of the main game's long text list. Only the places a grown-up lets the
 * child visit show (`placeOpen`); holding a tile says its name, a tap goes there. The grown-ups'
 * door is a small tab at the bottom, behind its own sum gate.
 */
export function placeOpen(e: EduState, id: EduPlaceId): boolean {
  const p = PLACES_EDU.find((x) => x.id === id);
  if (!p || (p.band && p.band !== e.band)) return false;
  return e.places?.[id] ?? p.on;
}

/** The places this save shows, in menu order. */
export function openPlaces(e: EduState): EduPlaceId[] {
  return PLACES_EDU.filter((p) => placeOpen(e, p.id)).map((p) => p.id);
}

export class EduPlaces {
  private readonly m;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly go: Record<EduPlaceId, () => void>,
    private readonly grownUps: () => void,
  ) {
    this.m = modal(parent, EDU_PLACES_TEXT.title, '✕');
    this.m.root.classList.add('edu-places');
  }

  open(): void {
    const e = this.game()?.world.edu;
    if (!e) return;
    const body = this.m.body;
    body.innerHTML = '';
    const grid = el('div', 'edu-places-grid');
    for (const id of openPlaces(e)) {
      const p = PLACES_EDU.find((x) => x.id === id)!;
      const name = EDU_PLACES_TEXT.names[id];
      const tile = button('', () => undefined, 'btn edu-place');
      tile.dataset.place = id;
      tile.setAttribute('aria-label', name);
      tile.append(el('span', 'edu-place-icon', p.icon), el('span', 'edu-place-name', name));
      holdOrTap(
        tile,
        () => speakLine(name),
        () => {
          this.m.hide();
          this.go[id]();
        },
      );
      grid.appendChild(tile);
    }
    body.appendChild(grid);
    body.appendChild(
      button(
        `🧑‍🏫 ${EDU_PLACES_TEXT.grownUps}`,
        () => {
          this.m.hide();
          this.grownUps();
        },
        'btn btn-small edu-places-grownups',
      ),
    );
    this.m.show();
    if (e.band === 'sprout' && e.readAloud) speakLine(EDU_PLACES_TEXT.say);
  }

  isOpen(): boolean {
    return this.m.isOpen();
  }

  close(): void {
    this.m.hide();
  }
}

/** A press held past `EDU_VOICE.holdMs` says the name and does not open; a tap opens. */
function holdOrTap(b: HTMLButtonElement, hold: () => void, tap: () => void): void {
  let timer = 0;
  let held = false;
  b.addEventListener('pointerdown', () => {
    held = false;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      held = true;
      hold();
    }, EDU_VOICE.holdMs);
  });
  const cancel = () => window.clearTimeout(timer);
  b.addEventListener('pointerup', cancel);
  b.addEventListener('pointerleave', cancel);
  b.addEventListener('click', () => {
    cancel();
    if (held) {
      held = false;
      return;
    }
    tap();
  });
}

/** R0680: the grown-up area's "Places your child can visit" toggles. */
export function placesSettings(body: HTMLElement, g: Game): void {
  const e = g.world.edu;
  if (!e) return;
  body.appendChild(el('h3', undefined, EDU_PLACES_TEXT.heading));
  body.appendChild(el('p', 'help', EDU_PLACES_TEXT.help));
  for (const p of PLACES_EDU) {
    if (p.band && p.band !== e.band) continue;
    const row = el('label', 'check-row');
    const cb = el('input');
    cb.type = 'checkbox';
    cb.checked = placeOpen(e, p.id);
    cb.dataset.place = p.id;
    cb.addEventListener('change', () =>
      g.send({ kind: 'eduSetPlace', place: p.id, on: cb.checked }),
    );
    row.append(cb, el('strong', undefined, `${p.icon} ${EDU_PLACES_TEXT.names[p.id]}`));
    body.appendChild(row);
  }
}
