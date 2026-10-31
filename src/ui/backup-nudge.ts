import { BACKUP_NUDGE } from '../config/tuning';
import { CAMP_TEXT } from '../config/strings';
import type { Game } from '../game';
import { shareOrDownload } from '../platform/share';
import { SHARE_TEXT } from '../config/strings-r9d3';
import type { SimEvent } from '../sim/types';
import { button, el, modal } from './dom';

/**
 * Lane C round 7 (R0624): Safari may clear a site's storage after seven days without a visit,
 * unless it is on the Home Screen, and Grove keeps no cloud copy. So: ask the browser to keep
 * the saves (`storage.persist()`); tell an iPhone in the browser, once, after Hazel's first
 * chapters, how to add the game to the Home Screen; and after an ending offer a quiet
 * "Back up your Grove?" chip with Export, at most once a fortnight, paused for a month when
 * dismissed. No streaks, no nagging. The dates are this viewer's own, kept in localStorage.
 */
const KEY = 'grove.backupNudge';

interface Marks {
  home?: boolean;
  lastMs?: number;
  pausedUntilMs?: number;
}

function read(): Marks {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Marks;
  } catch {
    return {};
  }
}

function write(m: Marks): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    // Blocked storage: the prompts may come again, which is harmless.
  }
}

/** An iPhone or iPad in Safari's browser, not the Home Screen app. */
export function iosBrowser(nav: Navigator = navigator, standalone?: boolean): boolean {
  const ios =
    /iP(hone|ad|od)/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
  const home =
    standalone ??
    ((nav as Navigator & { standalone?: boolean }).standalone === true ||
      window.matchMedia?.('(display-mode: standalone)').matches === true);
  return ios && !home;
}

export class BackupNudge {
  private chip: HTMLElement | null = null;
  private asked = false;

  constructor(
    private readonly parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {}

  onEvents(events: readonly SimEvent[]): void {
    const g = this.game();
    if (!g || g.world.edu) return;
    if (!this.asked) {
      this.asked = true;
      // Best effort: Chrome grants it to engaged sites, Safari to Home Screen apps.
      void navigator.storage?.persist?.().catch(() => false);
    }
    for (const e of events) {
      if (e.kind === 'chapter' && !e.line && e.chapter > BACKUP_NUDGE.homeCardChapter)
        this.homeCard();
      if (e.kind === 'ending' || e.kind === 'lineEnded') this.backupChip(g);
    }
  }

  private homeCard(): void {
    const m = read();
    if (m.home || !iosBrowser()) return;
    write({ ...m, home: true });
    const box = modal(this.parent, CAMP_TEXT.homeTitle, CAMP_TEXT.confirmClose);
    box.body.append(
      el('p', undefined, CAMP_TEXT.homeBody),
      el('p', 'help', CAMP_TEXT.homeSteps),
      button(CAMP_TEXT.homeOk, () => box.hide(), 'btn btn-primary'),
    );
    box.show();
  }

  private backupChip(g: Game): void {
    const m = read();
    const now = Date.now();
    if (this.chip || now < (m.pausedUntilMs ?? 0) || now < (m.lastMs ?? 0) + BACKUP_NUDGE.everyMs)
      return;
    write({ ...m, lastMs: now });
    const chip = el('div', 'backup-chip');
    chip.setAttribute('role', 'status');
    const done = (): void => {
      chip.remove();
      this.chip = null;
    };
    chip.append(
      el('span', undefined, CAMP_TEXT.backupAsk),
      button(
        CAMP_TEXT.backupYes,
        () => {
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          // TECH-66: the share sheet on a phone, the download elsewhere.
          void shareOrDownload(`grove-save-${stamp}.json`, g.exportJson(), SHARE_TEXT.saveTitle);
          done();
        },
        'btn btn-small btn-primary',
      ),
      button(
        CAMP_TEXT.backupNo,
        () => {
          write({ ...read(), pausedUntilMs: Date.now() + BACKUP_NUDGE.pauseMs });
          done();
        },
        'btn btn-small',
      ),
    );
    this.parent.appendChild(chip);
    this.chip = chip;
    window.setTimeout(done, BACKUP_NUDGE.showMs);
  }
}
