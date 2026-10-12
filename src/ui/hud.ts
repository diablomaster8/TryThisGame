import { INPUT } from '../config/tuning';
import { GROVE_LABELS, NAMES, TYPE_LABELS, UI_TEXT } from '../config/strings';
import type { Game, GameHooks } from '../game';
import type { AwayReport, GroveKind, SimEvent } from '../sim/types';
import { ExpeditionScreen } from '../minigames/expedition/screen';
import { playSound, setSoundEnabled } from '../platform/audio';
import type { Nubbin } from '../sim/types';
import { AwayScreen } from './away-screen';
import { Celebration } from './celebration';
import { DebugPanel } from './debug-panel';
import { RacesMenu } from './races';
import { RosterMenu } from './roster';
import { ShopMenu } from './shop';
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
  const keeperBtn = button('☀', () => switchKeeper(), 'btn btn-icon');
  keeperBtn.setAttribute('aria-label', UI_TEXT.switchKeeper);
  keeperBtn.title = UI_TEXT.switchKeeper;
  const groveBtn = button(GROVE_LABELS.main, () => cycleGrove(), 'btn btn-small');
  groveBtn.hidden = true;
  const shopBtn = button('🛒', () => shop.open(), 'btn btn-icon');
  shopBtn.setAttribute('aria-label', UI_TEXT.shop);
  shopBtn.title = UI_TEXT.shop;
  const expeditionBtn = button('🏃', () => startExpedition(), 'btn btn-icon');
  expeditionBtn.setAttribute('aria-label', UI_TEXT.expedition);
  expeditionBtn.title = UI_TEXT.expedition;
  const racesBtn = button('🏁', () => races.open(), 'btn btn-icon');
  racesBtn.setAttribute('aria-label', UI_TEXT.races);
  racesBtn.title = UI_TEXT.races;
  const rosterBtn = button('📋', () => roster.open(), 'btn btn-icon');
  rosterBtn.setAttribute('aria-label', UI_TEXT.roster);
  rosterBtn.title = UI_TEXT.roster;
  top.append(
    logo,
    shells,
    fruit,
    groveBtn,
    rosterBtn,
    expeditionBtn,
    racesBtn,
    shopBtn,
    keeperBtn,
    settingsBtn,
  );
  root.appendChild(top);

  /** The Nubbin that goes on Expeditions and races: the selected one, else the first grown one. */
  function pickRunner(): Nubbin | null {
    const g = game();
    if (!g) return null;
    const selected = g.world.selected
      ? g.world.nubbins.find((n) => n.id === g.world.selected)
      : null;
    if (selected && selected.stage !== 'egg' && selected.stage !== 'cocoon') return selected;
    return g.world.nubbins.find((n) => n.stage === 'child' || n.stage === 'adult') ?? null;
  }

  function startExpedition(): void {
    const g = game();
    if (!g || expedition.isOpen) return;
    const runner = pickRunner();
    if (!runner) {
      toast(UI_TEXT.expeditionNeedsNubbin);
      return;
    }
    sheet.close();
    g.renderPaused = true;
    expedition.start(
      runner,
      g.view.sheets.forNubbin(runner),
      Date.now() % 2147483647,
      (rewards) => {
        g.renderPaused = false;
        g.send({ kind: 'addRewards', rewards });
      },
    );
  }

  function switchKeeper(): void {
    const g = game();
    if (!g) return;
    g.send({
      kind: 'switchKeeper',
      alignment: g.world.keeper.alignment === 'sun' ? 'moon' : 'sun',
    });
  }
  function cycleGrove(): void {
    const g = game();
    if (!g) return;
    const order: GroveKind[] = ['main'];
    if (g.world.unlocks.sunGrove) order.push('sun');
    if (g.world.unlocks.moonGrove) order.push('moon');
    const i = order.indexOf(g.world.grove);
    g.send({ kind: 'setGrove', grove: order[(i + 1) % order.length] ?? 'main' });
  }

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
  const celebration = new Celebration(root, game);
  const shop = new ShopMenu(root, game, toast);
  const expedition = new ExpeditionScreen(root);
  const races = new RacesMenu(root, game, toast, pickRunner);
  const roster = new RosterMenu(root, game, (id) => sheet.open(id));
  if (import.meta.env.DEV) {
    // Console access during development, alongside `window.grove`.
    (window as unknown as { groveUi: unknown }).groveUi = {
      shop,
      expedition,
      sheet,
      debug,
      races,
      roster,
    };
  }

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
      else if (shop.isOpen()) shop.close();
      else if (races.isOpen()) races.close();
      else if (roster.isOpen()) roster.close();
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
      keeperBtn.textContent = g.world.keeper.alignment === 'sun' ? '☀' : '☾';
      const anyUnlocked = g.world.unlocks.sunGrove || g.world.unlocks.moonGrove;
      groveBtn.hidden = !anyUnlocked;
      groveBtn.textContent = GROVE_LABELS[g.world.grove];
      const carrying = g.world.keeper.carrying;
      carry.hidden = !carrying;
      if (carrying) {
        const n = g.world.nubbins.find((x) => x.id === carrying);
        carryText.textContent = UI_TEXT.carrying(n?.name ?? NAMES.creature);
      }
      if (!sheet.root.hidden) sheet.refresh();
      shop.refresh();
      debug.refresh();
    }
    refreshTimer = window.setTimeout(refreshLoop, 200);
  }
  void refreshTimer;

  const hooks: GameHooks = {
    onEvents(events: SimEvent[]) {
      const g = game();
      if (!g) return;
      setSoundEnabled(g.world.settings.sound);
      for (const e of events) {
        if (e.kind === 'hatched') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.hatched(n?.name ?? NAMES.creature));
          playSound('hatch');
        } else if (e.kind === 'evolved') {
          celebration.show(e);
          playSound('evolve');
        } else if (e.kind === 'reaction' && e.reaction === 'love') {
          playSound('pet');
        } else if (e.kind === 'collected' || e.kind === 'fruitDropped') {
          playSound('pickup');
        } else if (e.kind === 'landed') {
          playSound('hit');
        } else if (e.kind === 'secondEvolved') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.secondEvolved(n?.name ?? NAMES.creature, TYPE_LABELS[e.second]));
        } else if (e.kind === 'cocoonStarted' && e.cocoon !== 'evolve') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          const name = n?.name ?? NAMES.creature;
          toast(e.cocoon === 'rebirth' ? UI_TEXT.cocoonRebirth(name) : UI_TEXT.cocoonDepart(name));
        } else if (e.kind === 'reborn') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.reborn(n?.name ?? NAMES.creature));
        } else if (e.kind === 'departed') {
          toast(UI_TEXT.departed(e.name));
          playSound('sad');
        } else if (e.kind === 'eternal') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.eternal(n?.name ?? NAMES.creature));
        } else if (e.kind === 'bought') {
          shop.onBought(e.ok, e.reason, e.item);
          if (e.ok) playSound('buy');
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
