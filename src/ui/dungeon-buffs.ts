import { SHRINE_TEXT } from '../config/strings-dungeon';
import type { DungeonRun } from '../sim/types';
import { el } from './dom';

/**
 * The shrine buff ring (R0159) on the Hollow bar: one chip per running buff with its icon,
 * its short name and the seconds left, so shape and number carry it and colour only backs
 * them up. A polite live region says when a buff starts or ends, not every second.
 */
export class BuffRing {
  readonly root = el('div', 'hollow-buffs');
  private readonly live = el('span', 'sr-only');
  private key = '';
  private kinds = '';

  constructor() {
    this.root.setAttribute('role', 'group');
    this.root.setAttribute('aria-label', SHRINE_TEXT.ring);
    this.live.setAttribute('aria-live', 'polite');
    this.root.hidden = true;
  }

  /** The live region sits outside the ring, so hiding the ring never silences it. */
  get announcer(): HTMLElement {
    return this.live;
  }

  refresh(run: DungeonRun | null): void {
    const buffs = run?.buffs ?? [];
    const key = buffs.map((b) => `${b.kind}:${Math.ceil(b.leftMs / 1000)}`).join();
    if (key === this.key) return;
    this.key = key;
    this.root.hidden = buffs.length === 0;
    this.root.replaceChildren(
      ...buffs.map((b) => {
        const t = SHRINE_TEXT.kinds[b.kind];
        const s = Math.ceil(b.leftMs / 1000);
        const chip = el('span', 'hollow-buff', `${t?.icon ?? '✦'} ${s}s`);
        chip.title = SHRINE_TEXT.left(t?.name ?? b.kind, s);
        chip.setAttribute('aria-label', chip.title);
        return chip;
      }),
    );
    const kinds = buffs.map((b) => b.kind).join();
    if (kinds !== this.kinds) {
      this.kinds = kinds;
      this.live.textContent = buffs
        .map((b) =>
          SHRINE_TEXT.left(SHRINE_TEXT.kinds[b.kind]?.name ?? b.kind, Math.ceil(b.leftMs / 1000)),
        )
        .join('. ');
    }
  }
}
