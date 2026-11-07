/**
 * R0727: "Continue as a Keeper", in the grown-up area (behind the sum gate, so a grown-up
 * can offer it at any time). Copies the live Learning Grove into the first empty Hazel's
 * Grove slot through `eduToCampaign`; the Learning Grove slot is left as it was.
 */
import { GRADUATE_TEXT } from '../config/strings-graduate';
import type { Game } from '../game';
import { currentSlot, hasSave, slotsFor, writeSlotFrom, type SaveSlot } from '../platform/storage';
import { eduToCampaign } from '../sim/edu-graduate';
import { serialize } from '../sim/save';
import type { World } from '../sim/types';
import { button, el, modal } from './dom';

function emptyCampaignSlot(): SaveSlot | null {
  for (let index = 1; index <= slotsFor('campaign'); index++) {
    const s: SaveSlot = { mode: 'campaign', index };
    if (!hasSave(s)) return s;
  }
  return null;
}

function tryGraduate(g: Game, nowWallMs: number): { ok: boolean; text: string } {
  const to = emptyCampaignSlot();
  if (!to) return { ok: false, text: GRADUATE_TEXT.noRoom };
  const json = eduToCampaign(serialize(g.world, nowWallMs), nowWallMs);
  if (!json || !writeSlotFrom(to, json)) return { ok: false, text: GRADUATE_TEXT.failed };
  return { ok: true, text: GRADUATE_TEXT.done(to.index) };
}

/** Try the graduation; answers what to tell the grown-up. */
export function graduate(g: Game, nowWallMs = Date.now()): string {
  return tryGraduate(g, nowWallMs).text;
}

export function graduateSection(body: HTMLElement, g: Game): void {
  if (!g.world.edu) return;
  body.appendChild(el('h3', undefined, GRADUATE_TEXT.heading));
  body.appendChild(el('p', 'help', GRADUATE_TEXT.help));
  const status = el('p', 'help');
  status.setAttribute('role', 'status');
  body.appendChild(
    button(
      GRADUATE_TEXT.button,
      () => {
        status.textContent = graduate(g);
      },
      'btn',
    ),
  );
  body.appendChild(status);
}

/** R0727: a finished reader story is the moment to offer the next one (the sprout band has no such bridge). */
export function graduateOfferDue(world: World): boolean {
  return world.edu?.band === 'reader' && world.campaign?.ending != null;
}

const offerKey = (): string => {
  const s = currentSlot();
  return `grove.graduateOffer.${s.mode}.${s.index}`;
};

function offerSettled(): boolean {
  try {
    return localStorage.getItem(offerKey()) !== null;
  } catch {
    return false;
  }
}

function settleOffer(how: 'later' | 'done'): void {
  try {
    localStorage.setItem(offerKey(), how);
  } catch {
    // Blocked storage: the card may come back next visit, which is harmless.
  }
}

/**
 * The end-of-story card: "Continue as a Keeper" or "Not now". Free to decline, never
 * repeated once answered, and only shown when nothing else covers the Grove.
 */
export class GraduateOffer {
  private shown = false;

  constructor(
    private readonly parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {}

  update(busy: boolean): void {
    const g = this.game();
    if (this.shown || busy || !g || !graduateOfferDue(g.world) || offerSettled()) return;
    this.shown = true;
    const box = modal(this.parent, GRADUATE_TEXT.offer.title, GRADUATE_TEXT.offer.later);
    const status = el('p', 'help');
    status.setAttribute('role', 'status');
    box.body.append(
      el('p', undefined, GRADUATE_TEXT.offer.body),
      button(
        GRADUATE_TEXT.button,
        () => {
          const r = tryGraduate(g, Date.now());
          status.textContent = r.text;
          if (r.ok) settleOffer('done');
        },
        'btn btn-primary',
      ),
      button(
        GRADUATE_TEXT.offer.later,
        () => {
          settleOffer('later');
          box.hide();
        },
        'btn',
      ),
      status,
    );
    box.show();
  }
}
