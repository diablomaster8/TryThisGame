/**
 * R0727: "Continue as a Keeper", in the grown-up area (behind the sum gate, so a grown-up
 * can offer it at any time). Copies the live Learning Grove into the first empty Hazel's
 * Grove slot through `eduToCampaign`; the Learning Grove slot is left as it was.
 */
import { GRADUATE_TEXT } from '../config/strings-graduate';
import type { Game } from '../game';
import { hasSave, slotsFor, writeSlotFrom, type SaveSlot } from '../platform/storage';
import { eduToCampaign } from '../sim/edu-graduate';
import { serialize } from '../sim/save';
import { button, el } from './dom';

function emptyCampaignSlot(): SaveSlot | null {
  for (let index = 1; index <= slotsFor('campaign'); index++) {
    const s: SaveSlot = { mode: 'campaign', index };
    if (!hasSave(s)) return s;
  }
  return null;
}

/** Try the graduation; answers what to tell the grown-up. */
export function graduate(g: Game, nowWallMs = Date.now()): string {
  const to = emptyCampaignSlot();
  if (!to) return GRADUATE_TEXT.noRoom;
  const json = eduToCampaign(serialize(g.world, nowWallMs), nowWallMs);
  if (!json || !writeSlotFrom(to, json)) return GRADUATE_TEXT.failed;
  return GRADUATE_TEXT.done(to.index);
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
