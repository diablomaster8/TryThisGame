import { BACKUP_OFFER_TEXT } from '../config/strings-tech';
import type { Game } from '../game';
import { backupOfferDue, noteBackupExported, noteBackupOffered } from '../platform/backup-offer';
import { downloadText } from '../platform/storage';

/**
 * TECH-03: the one-time "Save a backup file" card (platform/backup-offer.ts). It checks now
 * and then, shows once a Nubbin has hatched and a week has passed with no export, and is
 * gone for good after either button.
 */
export function mountBackupOffer(root: HTMLElement, game: () => Game | null): void {
  const card = document.createElement('div');
  card.className = 'backup-offer';
  card.setAttribute('role', 'status');
  card.hidden = true;
  const line = document.createElement('span');
  line.textContent = BACKUP_OFFER_TEXT.line;
  const save = document.createElement('button');
  save.type = 'button';
  save.textContent = BACKUP_OFFER_TEXT.save;
  const later = document.createElement('button');
  later.type = 'button';
  later.textContent = BACKUP_OFFER_TEXT.later;
  card.append(line, save, later);
  root.appendChild(card);
  save.addEventListener('click', () => {
    const g = game();
    if (g) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadText(`grove-save-${stamp}.json`, g.exportJson());
      noteBackupExported();
    }
    card.hidden = true;
  });
  later.addEventListener('click', () => {
    card.hidden = true;
  });
  const check = (): void => {
    const g = game();
    if (!card.hidden || !g || g.world.nubbins.every((n) => n.stage === 'egg')) return;
    if (!backupOfferDue(Date.now())) return;
    noteBackupOffered();
    card.hidden = false;
  };
  window.setTimeout(check, 5000);
  window.setInterval(check, 60_000);
}
