/**
 * The HUD's top bar: logo, the counters and the menu buttons (TECH-24, split out of hud.ts).
 * The actions are late-bound thunks, since the panels they open are built after the bar.
 */
import { GROVE_LABELS, NAMES, UI_TEXT } from '../config/strings';
import { STORY_TEXT } from '../config/story';
import { UI_FX_TEXT } from '../config/strings-ui';
import { TOPBAR_TEXT } from '../config/strings-r8d';
import { setMusicEnabled, setSoundEnabled } from '../platform/audio';
import type { Game } from '../game';
import { button, el } from './dom';
import { labelActions } from './hud-toasts';
import { setIconGlyph } from './pixel-icons';

export interface TopbarActions {
  logo(): void;
  places(): void;
  more(): void;
  settings(): void;
  openSettings(): void;
  kidSheet(): void;
  trainers(): void;
  cycleGrove(): void;
  shop(): void;
  edu(): void;
  expedition(): void;
  eduNext(): void;
  races(): void;
  journal(): void;
  roster(): void;
}

export interface Topbar {
  top: HTMLElement;
  shells: HTMLElement;
  fruit: HTMLElement;
  moreBtn: HTMLButtonElement;
  settingsBtn: HTMLButtonElement;
  soundBtn: HTMLButtonElement;
  keeperBtn: HTMLButtonElement;
  groveBtn: HTMLButtonElement;
  shopBtn: HTMLButtonElement;
  expeditionBtn: HTMLButtonElement;
  racesBtn: HTMLButtonElement;
  journalBtn: HTMLButtonElement;
  rosterBtn: HTMLButtonElement;
}

export function buildTopbar(root: HTMLElement, game: () => Game | null, h: TopbarActions): Topbar {
  // Top bar.
  const top = el('div', 'topbar');
  const logo = button(NAMES.game, () => h.logo(), 'btn btn-logo');
  const shells = el('span', 'chip', '');
  const fruit = el('span', 'chip', '');
  // Lane E r8, R0680: a Learning Grove's ⋯ opens the Places picture menu instead.
  const moreBtn = button('⋯', () => (game()?.world.edu ? h.places() : h.more()), 'btn btn-icon');
  moreBtn.setAttribute('aria-label', UI_TEXT.more);
  moreBtn.title = UI_TEXT.more;
  // In the Learning Grove, Settings (reset, import, aging) is for grown-ups: a sum first.
  const settingsBtn = button(
    '⚙',
    () => {
      // R0671: a Learning Grove gets the kid-safe sound sheet; the rest is past the gate.
      void h.settings();
    },
    'btn btn-icon',
  );
  settingsBtn.setAttribute('aria-label', UI_TEXT.settings);
  // Sound on/off stays one tap away, outside Settings and the Learning Grove's grown-up gate
  // (TECH-23: for everyone now). A long press opens Settings for the volume sliders.
  const soundBtn = button(
    '🔊',
    () => {
      const g = game();
      if (!g) return;
      /* Lane E r10, R0679: a sprout's ⚙ is folded in here; the sheet has the big slider. */
      if (g.world.edu?.band === 'sprout') {
        h.kidSheet();
        return;
      }
      const on = !g.world.settings.sound;
      g.send({ kind: 'setSettings', settings: { ...g.world.settings, sound: on, music: on } });
      setSoundEnabled(on);
      setMusicEnabled(on);
    },
    'btn btn-icon',
  );
  soundBtn.setAttribute('aria-label', UI_TEXT.sound);
  soundBtn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!game()?.world.edu) h.openSettings();
  });
  const keeperBtn = button('☀', () => h.trainers(), 'btn btn-icon');
  keeperBtn.setAttribute('aria-label', UI_TEXT.trainers);
  keeperBtn.title = UI_TEXT.trainers;
  const groveBtn = button(GROVE_LABELS.main, () => h.cycleGrove(), 'btn btn-small');
  groveBtn.hidden = true;
  const shopBtn = button('🛒', () => h.shop(), 'btn btn-icon');
  shopBtn.setAttribute('aria-label', UI_TEXT.shop);
  shopBtn.title = UI_TEXT.shop;
  // The compass, not the runner: 🏃 is the Run button's (review C, item 23).
  const expeditionBtn = button(
    '🧭',
    () => {
      if (game()?.world.edu) h.edu();
      else h.expedition();
    },
    'btn btn-icon',
  );
  expeditionBtn.setAttribute('aria-label', UI_TEXT.expedition);
  expeditionBtn.title = UI_TEXT.expedition;
  const racesBtn = button('🏁', () => h.races(), 'btn btn-icon');
  racesBtn.setAttribute('aria-label', UI_TEXT.races);
  racesBtn.title = UI_TEXT.races;
  const journalBtn = button(
    '📖',
    () => {
      /* Lane E r10, R0679: a sprout's 📖 Story plays the next scene or says what is next. */
      const g = game();
      if (g?.world.edu?.band === 'sprout' && g.world.campaign) {
        if (g.world.campaign.queue.length === 0) h.eduNext();
        return;
      }
      h.journal();
    },
    'btn btn-icon',
  );
  journalBtn.setAttribute('aria-label', STORY_TEXT.journal);
  journalBtn.title = STORY_TEXT.journal;
  journalBtn.hidden = true;
  const rosterBtn = button('📋', () => h.roster(), 'btn btn-icon');
  rosterBtn.setAttribute('aria-label', UI_TEXT.roster);
  rosterBtn.title = UI_TEXT.roster;
  // The menu buttons: inline in the top bar on wide screens, a bottom bar within thumb
  // reach in phone portrait (style.css, .actionbar).
  const actions = el('div', 'actionbar');
  actions.setAttribute('role', 'toolbar');
  actions.setAttribute('aria-label', UI_TEXT.menu);
  actions.append(
    journalBtn,
    rosterBtn,
    moreBtn,
    expeditionBtn,
    racesBtn,
    shopBtn,
    keeperBtn,
    settingsBtn,
  );
  labelActions([
    [journalBtn, '📖', UI_FX_TEXT.actionLabels.journal],
    [rosterBtn, '📋', UI_FX_TEXT.actionLabels.roster],
    [moreBtn, '⋯', UI_FX_TEXT.actionLabels.more],
    [expeditionBtn, '🧭', UI_FX_TEXT.actionLabels.expedition],
    [racesBtn, '🏁', UI_FX_TEXT.actionLabels.races],
    [shopBtn, '🛒', UI_FX_TEXT.actionLabels.shop],
    [keeperBtn, '☀', UI_FX_TEXT.actionLabels.keeper],
    [settingsBtn, '⚙', UI_FX_TEXT.actionLabels.settings],
  ]);
  // TECH-61: the sound toggle gets a word too, shown under its icon on wide screens only
  // (it stays in the top bar on phones, where the bottom bar's labels do not reach it).
  {
    soundBtn.textContent = '';
    const g = el('span', 'act-glyph');
    setIconGlyph(g, '🔊');
    g.setAttribute('aria-hidden', 'true');
    const l = el('span', 'top-label', TOPBAR_TEXT.sound);
    l.setAttribute('aria-hidden', 'true');
    soundBtn.append(g, l);
    soundBtn.classList.add('top-labelled');
  }
  top.append(logo, shells, fruit, groveBtn, soundBtn, actions);
  root.appendChild(top);
  return {
    top,
    shells,
    fruit,
    moreBtn,
    settingsBtn,
    soundBtn,
    keeperBtn,
    groveBtn,
    shopBtn,
    expeditionBtn,
    racesBtn,
    journalBtn,
    rosterBtn,
  };
}
