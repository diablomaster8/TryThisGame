/**
 * Lane A round 8 (SOUL): a row on the stats sheet under the personality chip: the favourite
 * fruit (♥) and the disliked one (✗), each a "?" until the Keeper has seen the reaction
 * (R0536), the favourite toy once it has been seen playing with it (R0537), and a chip for
 * a moody look with what softens it (R0532). Icons and words, never colour alone. Reads only.
 */
import { SOUL_SHEET, TASTE_NAMES, TOY_NAMES_SOUL } from '../config/strings-soul-r8';
import { likesOf } from '../sim/likes';
import type { Nubbin } from '../sim/types';
import { el } from './dom';

export class SoulRow {
  readonly root: HTMLDivElement = el('div', 'soul-row');
  private shown = '';

  update(n: Nubbin): void {
    const seen = n.tasteSeen ?? {};
    const key = `${n.id}:${n.stage}:${seen.yum}:${seen.bleh}:${seen.toy}:${n.moody}`;
    if (key === this.shown) return;
    this.shown = key;
    this.root.innerHTML = '';
    this.root.hidden = n.stage === 'egg' || n.stage === 'cocoon';
    const l = likesOf(n);
    const chip = (icon: string, label: string, value: string | null, help?: string) => {
      const c = el('span', `soul-chip${value ? '' : ' unknown'}`);
      c.append(el('span', 'soul-icon', icon), el('span', undefined, `${label}: `));
      c.append(el('strong', undefined, value ?? SOUL_SHEET.unknown));
      c.title = help ?? (value ? '' : SOUL_SHEET.unknownHelp);
      c.setAttribute('aria-label', `${label}: ${value ?? SOUL_SHEET.unknown}`);
      return c;
    };
    this.root.append(
      chip('♥', SOUL_SHEET.likes, seen.yum ? TASTE_NAMES[l.fruit] : null),
      chip('✗', SOUL_SHEET.dislikes, seen.bleh ? TASTE_NAMES[l.dislike] : null),
    );
    if (seen.toy) this.root.append(chip('★', SOUL_SHEET.toy, TOY_NAMES_SOUL[l.toy]));
    if (n.moody) {
      const m = el('span', 'soul-chip moody');
      m.append(
        el('span', 'soul-icon', n.moody === 'grumpy' ? '😤' : '😪'),
        el('strong', undefined, SOUL_SHEET.moody[n.moody]),
        el('small', 'soul-help', SOUL_SHEET.moodyHelp[n.moody]),
      );
      m.setAttribute(
        'aria-label',
        `${SOUL_SHEET.moody[n.moody]}. ${SOUL_SHEET.moodyHelp[n.moody]}`,
      );
      this.root.append(m);
    }
  }
}
