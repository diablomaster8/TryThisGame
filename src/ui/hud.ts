import { INPUT } from '../config/tuning';
import {
  GROVE_LABELS,
  NAMES,
  SPECIES_LABELS,
  TRAINER_LABELS,
  TYPE_LABELS,
  UI_TEXT,
} from '../config/strings';
import type { Game, GameHooks } from '../game';
import type { AwayReport, GroveKind, SimEvent } from '../sim/types';
import { ExpeditionScreen } from '../minigames/expedition/screen';
import {
  playSong,
  playSound,
  setMusicEnabled,
  setMusicVolume,
  setSfxVolume,
  setSoundEnabled,
} from '../platform/audio';
import { localHour, phaseAt } from '../render/daylight';
import type { Nubbin } from '../sim/types';
import { AwayScreen } from './away-screen';
import { Celebration } from './celebration';
import { DebugPanel } from './debug-panel';
import { Joystick } from './joystick';
import { RacesMenu } from './races';
import { RosterMenu } from './roster';
import { ShopMenu } from './shop';
import { TrainersMenu } from './trainers';
import { button, el } from './dom';
import { SettingsMenu } from './settings';
import { StatsSheet } from './stats-sheet';
import { Dialogue } from './dialogue';
import { Journal } from './journal';
import { chapterDef } from '../sim/campaign';
import { STORY_TEXT } from '../config/story';
import { KindergartenMenu } from './kindergarten';
import { KarateMenu } from './karate';
import { CollectionBook, keyLabel, MemorialCard } from './collection';
import { DecorateMenu } from './decorate';
import { PhotoMode } from './photo';
import { PocketMode } from './pocket';
import { modal } from './dom';
import { TRAINER_LABELS as TL } from '../config/strings';

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
  const moreBtn = button('⋯', () => more.show(), 'btn btn-icon');
  moreBtn.setAttribute('aria-label', UI_TEXT.more);
  moreBtn.title = UI_TEXT.more;
  const settingsBtn = button('⚙', () => settings.open(), 'btn btn-icon');
  settingsBtn.setAttribute('aria-label', UI_TEXT.settings);
  const keeperBtn = button('☀', () => trainers.open(), 'btn btn-icon');
  keeperBtn.setAttribute('aria-label', UI_TEXT.trainers);
  keeperBtn.title = UI_TEXT.trainers;
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
  const journalBtn = button('📖', () => journal.open(), 'btn btn-icon');
  journalBtn.setAttribute('aria-label', STORY_TEXT.journal);
  journalBtn.title = STORY_TEXT.journal;
  journalBtn.hidden = true;
  const rosterBtn = button('📋', () => roster.open(), 'btn btn-icon');
  rosterBtn.setAttribute('aria-label', UI_TEXT.roster);
  rosterBtn.title = UI_TEXT.roster;
  top.append(
    logo,
    shells,
    fruit,
    groveBtn,
    journalBtn,
    rosterBtn,
    moreBtn,
    expeditionBtn,
    racesBtn,
    shopBtn,
    keeperBtn,
    settingsBtn,
  );
  root.appendChild(top);

  // Run: a toggle on screen, or hold Shift on a keyboard.
  const runBtn = button(`🏃 ${UI_TEXT.run}`, () => setRunning(!runOn), 'btn run-btn');
  runBtn.title = UI_TEXT.runHelp;
  let runOn = false;
  function setRunning(on: boolean): void {
    runOn = on;
    runBtn.classList.toggle('active', on);
    game()?.send({ kind: 'setRunning', running: on });
  }
  root.appendChild(runBtn);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift' && !e.repeat && !(e.target instanceof HTMLInputElement)) setRunning(true);
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') setRunning(false);
  });

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

  /** A place name, including a neighbour's Grove. */
  function locationLabel(loc: string): string {
    if (loc.startsWith('visit:')) {
      const t = loc.slice('visit:'.length);
      return `${TL[t]?.name ?? t}’s Grove`;
    }
    return (UI_TEXT.location as Record<string, string>)[loc] ?? loc;
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
      g.world.location === 'hollow' || g.world.campaign?.chapter === 8 ? 'hollow' : 'meadow',
    );
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
  const trainers = new TrainersMenu(root, game, toast);
  const dialogue = new Dialogue(root, game);
  const journal = new Journal(root, game);
  const kindergarten = new KindergartenMenu(root, game, () => sheet.selectedId, toast);
  const karate = new KarateMenu(root, game, toast, pickRunner);
  const book = new CollectionBook(root, game);
  const memorialCard = new MemorialCard(root, game);
  const decorate = new DecorateMenu(root, game, toast);
  const photo = new PhotoMode(root, game, () => sheet.selectedId);
  const pocket = new PocketMode(root, game);
  // The "More" menu holds everything that does not fit the top bar.
  const more = modal(root, UI_TEXT.more, UI_TEXT.close);
  more.body.appendChild(el('p', 'help', UI_TEXT.moreHelp));
  const moreList = el('div', 'title-menu');
  for (const [label, open] of [
    [`🏫 ${UI_TEXT.kindergarten}`, () => kindergarten.open()],
    [`🥋 ${UI_TEXT.karate}`, () => karate.open()],
    [`📔 ${UI_TEXT.collection}`, () => book.open()],
    [`🪴 ${UI_TEXT.decorate}`, () => decorate.open()],
    [`📷 ${UI_TEXT.photo}`, () => photo.open()],
    [`👜 ${UI_TEXT.pocket}`, () => pocket.open(sheet.selectedId)],
    [`🔁 ${UI_TEXT.receive}`, () => roster.receive()],
  ] as const) {
    moreList.appendChild(
      button(
        label,
        () => {
          more.hide();
          open();
        },
        'btn btn-wide',
      ),
    );
  }
  more.body.appendChild(moreList);
  // Placing chip while decorating.
  const placingChip = el('div', 'placing-chip');
  placingChip.hidden = true;
  const placingText = el('span');
  placingChip.append(
    placingText,
    button(
      UI_TEXT.donePlacing,
      () => {
        const g = game();
        if (g) g.placing = null;
      },
      'btn btn-small',
    ),
  );
  root.appendChild(placingChip);
  let joystick: Joystick | null = null;
  if (import.meta.env.DEV) {
    // Console access during development, alongside `window.grove`.
    (window as unknown as { groveUi: unknown }).groveUi = {
      shop,
      expedition,
      sheet,
      debug,
      races,
      roster,
      dialogue,
      journal,
      kindergarten,
      karate,
      book,
      decorate,
      photo,
      pocket,
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
    // PC: F toggles fullscreen.
    if (e.key === 'f' && !(e.target instanceof HTMLInputElement) && !e.repeat) {
      const el = document.documentElement;
      if (document.fullscreenElement) void document.exitFullscreen?.();
      else void el.requestFullscreen?.().catch(() => undefined);
    }
    if (e.key === '`' && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault();
      debug.toggle();
    }
    if (e.key === 'Escape') {
      if (settings.isOpen()) settings.close();
      else if (shop.isOpen()) shop.close();
      else if (races.isOpen()) races.close();
      else if (roster.isOpen()) roster.close();
      else if (trainers.isOpen()) trainers.close();
      else if (journal.isOpen()) journal.close();
      else if (kindergarten.isOpen()) kindergarten.close();
      else if (karate.isOpen()) karate.close();
      else if (book.isOpen()) book.close();
      else if (memorialCard.isOpen()) memorialCard.close();
      else if (decorate.isOpen()) decorate.close();
      else if (photo.isOpen()) photo.close();
      else if (pocket.isOpen) pocket.close();
      else if (more.isOpen()) more.hide();
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
      joystick ??= new Joystick(root, g.camera, (cmd) => g.send(cmd));
      joystick.setVisible(g.world.settings.joystick);
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
      // Story scenes wait their turn behind other panels.
      const c = g.world.campaign;
      journalBtn.hidden = !c;
      // Which piece plays: story over dialogue, the minigames their own, else the hour's.
      setMusicEnabled(g.world.settings.music);
      setMusicVolume(g.world.settings.musicVolume);
      setSfxVolume(g.world.settings.sfxVolume);
      const chapter = c?.chapter ?? 0;
      if (dialogue.isOpen) {
        playSong(
          chapter === 6 || chapter === 11 || chapter === 13
            ? 'sorrow'
            : chapter === 5 || chapter === 9
              ? 'tense'
              : 'story',
        );
      } else if (expedition.isOpen) playSong('expedition');
      else if (races.screen.isOpen) playSong('race');
      else if (karate.screen.isOpen) playSong('karate');
      else if (g.world.location === 'hollow') playSong('hollow');
      else if (g.world.location === 'corvin') playSong('tense');
      else {
        const phase = phaseAt(g.hourOverride ?? localHour()).phase;
        playSong(phase === 'night' || phase === 'dusk' ? 'night' : 'grove');
      }
      placingChip.hidden = !g.placing;
      if (g.placing) placingText.textContent = UI_TEXT.placing(UI_TEXT.decorNames[g.placing]);
      if (kindergarten.isOpen() && Math.random() < 0.1) kindergarten.refresh();
      const next = c?.queue[0];
      if (
        next &&
        !dialogue.isOpen &&
        !away.isOpen &&
        !expedition.isOpen &&
        !races.isOpen() &&
        !karate.screen.isOpen &&
        !pocket.isOpen
      ) {
        sheet.close();
        dialogue.play(next);
      }
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
        } else if (e.kind === 'speciesGrew') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(
            UI_TEXT.speciesGrew(n?.name ?? NAMES.creature, SPECIES_LABELS[e.species] ?? e.species),
          );
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
        } else if (e.kind === 'chapter') {
          const def = chapterDef(e.chapter);
          if (def) toast(STORY_TEXT.chapterStarted(e.chapter, def.title));
        } else if (e.kind === 'turnedShadow') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(STORY_TEXT.turnedShadow(n?.name ?? NAMES.creature));
          playSound('sad');
        } else if (e.kind === 'shadowBonded') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(STORY_TEXT.shadowBonded(n?.name ?? NAMES.creature));
          playSound('evolve');
        } else if (e.kind === 'ranAway') {
          toast(STORY_TEXT.ranAway(e.name));
          playSound('sad');
        } else if (e.kind === 'strayReturned') {
          toast(STORY_TEXT.strayReturned(e.name));
        } else if (e.kind === 'lanternLit') {
          toast(STORY_TEXT.lanternLit);
          playSound('pickup');
        } else if (e.kind === 'talked') {
          const npc = g.world.npcs.find((x) => x.id === e.npcId);
          const name = npc ? (TRAINER_LABELS[npc.trainer]?.name ?? npc.trainer) : '';
          toast(STORY_TEXT.talkedTo(name));
        } else if (e.kind === 'interacted') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          const name = n?.name ?? NAMES.creature;
          toast(e.ok ? UI_TEXT.interacted(name, e.action) : UI_TEXT.interactRefused(name));
          if (e.ok) playSound('pet');
        } else if (e.kind === 'called') {
          toast(UI_TEXT.called(e.count));
          playSound('tap');
        } else if (e.kind === 'fetching') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.fetching(n?.name ?? NAMES.creature));
        } else if (e.kind === 'courting') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.courting(n?.name ?? NAMES.creature));
        } else if (e.kind === 'bred') {
          toast(UI_TEXT.bred);
          playSound('hatch');
        } else if (e.kind === 'lessonDone') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(
            UI_TEXT.lessonDone(n?.name ?? NAMES.creature, UI_TEXT.lessonNames[e.lesson], e.level),
          );
          playSound('win');
        } else if (e.kind === 'weather') {
          toast(
            e.weather === 'rain'
              ? UI_TEXT.weatherRain
              : e.weather === 'snow'
                ? UI_TEXT.weatherSnow
                : UI_TEXT.weatherClear,
          );
        } else if (e.kind === 'visitor') {
          toast(UI_TEXT.visitor(TL[e.trainer]?.name ?? e.trainer, UI_TEXT.giftNames[e.gift]));
          playSound('buy');
        } else if (e.kind === 'lanternNight') {
          toast(UI_TEXT.lanternNight);
        } else if (e.kind === 'decorPlaced') {
          toast(UI_TEXT.decorPlaced);
          playSound('pickup');
        } else if (e.kind === 'firstSeen') {
          toast(UI_TEXT.firstSeen(keyLabel(e.key)));
        } else if (e.kind === 'received') {
          toast(e.ok ? UI_TEXT.received(e.name) : UI_TEXT.receiveFull);
        } else if (e.kind === 'traded') {
          toast(UI_TEXT.traded(e.name));
        } else if (e.kind === 'located') {
          toast(locationLabel(e.location));
        } else if (e.kind === 'karate') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          if (e.won) toast(`${n?.name ?? NAMES.creature}: ${UI_TEXT.belt(e.belt)}`);
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
      const g = game();
      if (id?.startsWith('memorial:') && g) {
        const m = g.world.memorials.find((x) => x.id === id.slice('memorial:'.length));
        if (m) memorialCard.show(m);
        return;
      }
      if (id?.startsWith('building:')) {
        const which = id.slice('building:'.length);
        if (which === 'school') kindergarten.open();
        else if (which === 'dojo') karate.open();
        else if (which === 'cottage') pocket.open(sheet.selectedId);
        return;
      }
      if (id?.startsWith('decor:') && g) {
        g.send({ kind: 'removeDecor', id: id.slice('decor:'.length) });
        toast(UI_TEXT.decorPickedUp);
        return;
      }
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
      if (new URLSearchParams(location.search).has('pocket')) pocket.open();
    },
  };
}
