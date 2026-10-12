import { INPUT } from '../config/tuning';
import { NAMES, UI_TEXT } from '../config/strings';
import type { Game, GameHooks } from '../game';
import type { AwayReport, SimEvent } from '../sim/types';
import { AwayScreen } from './away-screen';
import { DebugPanel } from './debug-panel';
import { button, el } from './dom';
import { SettingsMenu } from './settings';
import { StatsSheet } from './stats-sheet';

/**
 * The HUD: top bar (logo, shells, fruit, settings), carry chip, toasts, and the panels.
 * Everything here only reads world state and sends commands.
 */
export function mountHud(
  root: HTMLElement,
  game: () => Game | null,
): { hooks: GameHooks; bind(g: Game): void } {
  // Top bar.
  const top = el('div', 'topbar');
  const logo = button(NAMES.game, () => onLogoTap(), 'btn btn-logo');
  const shells = el('span', 'chip', '');
  const fruit = el('span', 'chip', '');
  const settingsBtn = button('⚙', () => settings.open(), 'btn btn-icon');
  settingsBtn.setAttribute('aria-label', UI_TEXT.settings);
  top.append(logo, shells, fruit, settingsBtn);
  root.appendChild(top);

  // Carry chip.
  const carry = el('div', 'carry');
  carry.hidden = true;
  const carryText = el('span');
  const putDown = button(UI_TEXT.putDown, () => game()?.send({ kind: 'putDown' }), 'btn btn-small');
  carry.append(carryText, putDown);
  root.appendChild(carry);

  // Toasts.
  const toasts = el('div', 'toasts');
  root.appendChild(toasts);
  function toast(text: string): void {
    const t = el('div', 'toast', text);
    toasts.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // Catch-up overlay.
  const catching = el('div', 'catching', UI_TEXT.catchingUp);
  catching.hidden = true;
  root.appendChild(catching);

  const sheet = new StatsSheet(root, game);
  const settings = new SettingsMenu(root, game, toast);
  const away = new AwayScreen(root);
  const debug = new DebugPanel(root, game, () => sheet.selectedId);

  // Triple-tap the logo, or press backtick, for the debug panel.
  let logoTaps: number[] = [];
  function onLogoTap(): void {
    const now = performance.now();
    logoTaps = logoTaps.filter((t) => now - t < INPUT.tripleTapMs);
    logoTaps.push(now);
    if (logoTaps.length >= 3) {
      logoTaps = [];
      debug.toggle();
    }
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault();
      debug.toggle();
    }
    if (e.key === 'Escape') {
      if (settings.isOpen()) settings.close();
      else if (!sheet.root.hidden) sheet.close();
    }
  });

  // Periodic refresh of live panels.
  let refreshTimer = 0;
  function refreshLoop(): void {
    const g = game();
    if (g) {
      shells.textContent = `🐚 ${g.world.inventory.shells}`;
      fruit.textContent = `🍎 ${g.world.inventory.fruit}`;
      const carrying = g.world.keeper.carrying;
      carry.hidden = !carrying;
      if (carrying) {
        const n = g.world.nubbins.find((x) => x.id === carrying);
        carryText.textContent = UI_TEXT.carrying(n?.name ?? NAMES.creature);
      }
      if (!sheet.root.hidden) sheet.refresh();
      debug.refresh();
    }
    refreshTimer = window.setTimeout(refreshLoop, 200);
  }
  void refreshTimer;

  const hooks: GameHooks = {
    onEvents(events: SimEvent[]) {
      const g = game();
      if (!g) return;
      for (const e of events) {
        if (e.kind === 'hatched') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.hatched(n?.name ?? NAMES.creature));
        } else if (e.kind === 'evolved') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.evolved(n?.name ?? NAMES.creature));
        }
      }
    },
    onAway(report: AwayReport) {
      const g = game();
      // On first load the game is not bound yet; defer to the next tick.
      setTimeout(() => {
        const gg = g ?? game();
        if (gg) away.show(report, gg.world);
      }, 0);
    },
    onSelect(id) {
      if (id) sheet.open(id);
      else sheet.close();
    },
    onStorageBlocked() {
      toast(UI_TEXT.storageBlocked);
    },
    onCatchUpStart() {
      catching.hidden = false;
    },
    onCatchUpEnd() {
      catching.hidden = true;
    },
  };

  return {
    hooks,
    bind() {
      refreshLoop();
    },
  };
}
