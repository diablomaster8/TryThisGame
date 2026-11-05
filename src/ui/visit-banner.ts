import { SAVE_LAYOUT_TEXT } from '../config/strings-camp11-save';
import { endVisit, visitingProfile } from '../platform/storage';
import { profileById } from '../platform/profiles';
import { button, el } from './dom';
import '../profiles-r11.css';

/**
 * R0669 (CAMP-77, round 13): a strip over a visit to another profile's Grove. The world is
 * frozen and nothing is saved, so the one thing to do here is leave: a reload ends the visit
 * and lands on the title. Nothing to mount when no visit is on.
 */
export function mountVisitBanner(parent: HTMLElement): HTMLElement | null {
  const who = visitingProfile();
  if (who === null) return null;
  const name = profileById(who)?.name ?? who;
  const bar = el('div', 'visit-banner');
  bar.setAttribute('role', 'status');
  bar.appendChild(el('span', 'visit-banner-text', SAVE_LAYOUT_TEXT.visitBanner(name)));
  const leave = button(
    SAVE_LAYOUT_TEXT.visitLeave,
    () => {
      endVisit();
      location.assign(location.pathname);
    },
    'btn btn-small visit-banner-leave',
  );
  leave.setAttribute('aria-label', SAVE_LAYOUT_TEXT.visitLeaveLabel);
  bar.appendChild(leave);
  parent.appendChild(bar);
  return bar;
}
