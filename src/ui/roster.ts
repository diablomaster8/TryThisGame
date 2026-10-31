import { canShareText, shareText } from '../platform/share';
import { SHARE_TEXT } from '../config/strings-r9d3';
import {
  EGG_COLOR_LABELS,
  formatDuration,
  NAMES,
  PERSONALITY_LABELS,
  SPECIES_LABELS,
  STAGE_LABELS,
  STAT_ICONS,
  STAT_LABELS,
  TYPE_LABELS,
  UI_TEXT,
} from '../config/strings';
import { cosmeticLabel } from '../config/cosmetics';
import type { Game } from '../game';
import { frameKey } from '../render/sprites/animations';
import { bandOf, childHint } from '../sim/alignment';
import { rosterNubbins, storyNubbin } from '../sim/roster';
import { levelOf } from '../sim/stats';
import { STAT_KEYS, type Nubbin, type Personality } from '../sim/types';
import { button, el, modal } from './dom';
import { Wardrobe } from './wardrobe';
import { RARITY_TEXT, WARDROBE_TEXT } from '../config/strings-look';
import { RARITY } from '../config/tuning';
import { rarityOf } from '../render/rarity';
import { decodeNubbin, encodeNubbin } from '../sim/share';
import { PERSONALITY_CHIP_TEXT } from '../config/strings-fun-r7';
import { ROSTER_FILTER_TEXT } from '../config/strings-soul-r8';
import { leaningPersonality } from '../sim/personality';
import { personalityIcon } from './personality-chip';
import { playChirp } from '../platform/audio';
import { chirpVoice } from '../platform/chirp-voice';
import { speciesOf } from '../sim/species';

const PERSONALITIES: readonly Personality[] = ['cheerful', 'shy', 'mischievous', 'lazy'];

/**
 * The roster: every Nubbin with a portrait, name (tap to rename), stats, age, rebirth
 * count, alignment as a word and an icon, personality, and a hat picker.
 */
export class RosterMenu {
  private readonly wardrobe: Wardrobe;
  private readonly dialog;
  private readonly list: HTMLDivElement;
  private readonly codeDialog: ReturnType<typeof modal>;
  private readonly receiveDialog: ReturnType<typeof modal>;
  /** R0579 (lane A r8): show only one personality, or all. */
  private filter: Personality | 'all' = 'all';

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly onSelect: (id: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.roster, UI_TEXT.close);
    this.wardrobe = new Wardrobe(parent, game, () => this.refresh());
    this.list = el('div', 'roster-list');
    this.dialog.body.appendChild(this.list);
    this.codeDialog = modal(parent, UI_TEXT.share, UI_TEXT.close);
    this.receiveDialog = modal(parent, UI_TEXT.receive, UI_TEXT.close);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  refresh(): void {
    const g = this.game();
    if (!g) return;
    this.list.innerHTML = '';
    // Moss is not listed while he keeps to the hill (sim/roster.ts).
    const mine = rosterNubbins(g.world);
    const count = el('div', 'help', UI_TEXT.rosterCount(mine.length));
    this.list.appendChild(count);
    // R0579: a filter row by personality, shown once two or more are in the Grove.
    const kinds = PERSONALITIES.filter((p) => mine.some((n) => n.personality === p));
    if (kinds.length >= 2) this.list.appendChild(this.filters(kinds));
    else this.filter = 'all';
    for (const n of mine)
      if (this.filter === 'all' || n.personality === this.filter)
        this.list.appendChild(this.row(g, n));
  }

  /** R0579: All, then a chip per personality present: icon and word, a 44 px target. */
  private filters(kinds: readonly Personality[]): HTMLDivElement {
    const row = el('div', 'roster-filter');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', ROSTER_FILTER_TEXT.label);
    const chip = (value: Personality | 'all', label: string, icon?: HTMLCanvasElement) => {
      const b = button(
        label,
        () => {
          this.filter = value;
          this.refresh();
        },
        'btn btn-small roster-filter-chip',
      );
      if (icon) b.prepend(icon);
      b.setAttribute('aria-pressed', String(this.filter === value));
      return b;
    };
    row.appendChild(chip('all', ROSTER_FILTER_TEXT.all));
    for (const p of kinds) row.appendChild(chip(p, PERSONALITY_LABELS[p], personalityIcon(p)));
    return row;
  }

  private row(g: Game, n: Nubbin): HTMLDivElement {
    const row = el('div', 'roster-row');
    row.appendChild(this.portrait(g, n));
    const body = el('div', 'roster-body');
    const name = button(n.name, () => this.rename(n), 'btn btn-name');
    body.appendChild(name);
    // R0579: the personality as its icon and word (a child shows its leaning, faded).
    const lean = leaningPersonality(n);
    if (lean) {
      const pc = el('span', `roster-personality`);
      pc.append(personalityIcon(lean), el('span', undefined, PERSONALITY_LABELS[lean]));
      pc.setAttribute(
        'aria-label',
        n.personality
          ? PERSONALITY_LABELS[lean]
          : PERSONALITY_CHIP_TEXT.leaning(PERSONALITY_LABELS[lean]),
      );
      body.appendChild(pc);
    }
    body.appendChild(el('div', 'roster-line', describe(n)));
    // LOOK-58: the rarity tier, as a coloured frame, an icon and a word.
    const tier = rarityOf(n);
    row.style.setProperty('--rarity', RARITY.frame[tier]);
    row.classList.add(`rarity-${tier}`);
    if (tier !== 'common')
      body.appendChild(el('span', 'rarity-chip', `${RARITY.icon[tier]} ${RARITY_TEXT[tier]}`));
    const stats = el('div', 'roster-stats');
    for (const key of STAT_KEYS) {
      stats.appendChild(
        el(
          'span',
          undefined,
          `${STAT_ICONS[key]} ${STAT_LABELS[key]} ${levelOf(n.stats[key].points)}${n.stats[key].grade}`,
        ),
      );
    }
    body.appendChild(stats);
    const actions = el('div', 'roster-actions');
    if (n.stage !== 'egg') {
      const hatSelect = el('select', 'roster-hat');
      const none = el('option', undefined, UI_TEXT.noHat);
      none.value = '';
      hatSelect.appendChild(none);
      for (const hat of new Set(g.world.inventory.hats)) {
        const o = el('option', undefined, cosmeticLabel(hat));
        o.value = hat;
        hatSelect.appendChild(o);
      }
      hatSelect.value = n.hat ?? '';
      hatSelect.addEventListener('change', () => {
        g.send({ kind: 'wearHat', nubbinId: n.id, hat: hatSelect.value || null });
      });
      actions.appendChild(hatSelect);
      // LOOK-60: the dress-up mirror, with a live preview.
      actions.appendChild(
        button(WARDROBE_TEXT.open, () => this.wardrobe.open(n.id), 'btn btn-small'),
      );
    }
    actions.appendChild(
      button(
        UI_TEXT.find,
        () => {
          g.send({ kind: 'select', id: n.id });
          g.send({ kind: 'moveKeeperTo', pos: { x: n.pos.x + 1, z: n.pos.z + 1 } });
          this.onSelect(n.id);
          this.close();
        },
        'btn btn-small',
      ),
    );
    body.appendChild(actions);
    // Share and trade.
    const share = el('div', 'roster-actions');
    share.append(button(UI_TEXT.share, () => this.share(g, n, false), 'btn btn-small'));
    // The story's own Nubbins (Moss, Sable) are never traded away.
    if (!storyNubbin(g.world, n.id)) {
      share.append(
        button(UI_TEXT.tradeAway, () => this.share(g, n, true), 'btn btn-small btn-danger'),
      );
    }
    body.appendChild(share);
    row.appendChild(body);
    return row;
  }

  /**
   * Show the Nubbin's code in a box the player can select and copy. A trade sends the
   * Nubbin away only from the dialog's own button, pressed after the code was on screen:
   * a failed clipboard write or a closed dialog never loses the Nubbin or its code.
   */
  private share(g: Game, n: Nubbin, trade: boolean): void {
    const code = encodeNubbin(n);
    const d = this.codeDialog;
    d.body.replaceChildren();
    d.body.appendChild(el('p', 'help', trade ? UI_TEXT.tradeConfirm(n.name) : UI_TEXT.shareHelp));
    const box = el('textarea', 'share-code');
    box.readOnly = true;
    box.value = code;
    box.rows = 4;
    box.setAttribute('aria-label', UI_TEXT.share);
    box.addEventListener('focus', () => box.select());
    const status = el('p', 'help');
    status.setAttribute('role', 'status');
    const copy = button(
      UI_TEXT.copyCode,
      () => {
        box.select();
        navigator.clipboard
          ?.writeText(code)
          .then(() => (status.textContent = UI_TEXT.codeCopied))
          .catch(() => (status.textContent = UI_TEXT.copyByHand));
        if (!navigator.clipboard) status.textContent = UI_TEXT.copyByHand;
      },
      'btn btn-small',
    );
    const actions = el('div', 'roster-actions');
    actions.appendChild(copy);
    // TECH-66: a phone can send the code straight to a friend through the share sheet.
    if (canShareText())
      actions.appendChild(
        button(
          SHARE_TEXT.codeButton,
          () =>
            void shareText(code, SHARE_TEXT.codeTitle).then((ok) => {
              if (!ok) status.textContent = UI_TEXT.copyByHand;
            }),
          'btn btn-small',
        ),
      );
    if (trade) {
      actions.appendChild(
        button(
          UI_TEXT.tradeSend(n.name),
          () => {
            d.hide();
            g.send({ kind: 'tradeAway', nubbinId: n.id });
            setTimeout(() => this.refresh(), 150);
          },
          'btn btn-small btn-danger',
        ),
      );
    }
    d.body.append(box, actions, status);
    d.show();
  }

  /** Paste a code to take a Nubbin in. */
  receive(): void {
    if (!this.game()) return;
    // A dialog of our own, not prompt() and alert(): those block the page, look foreign on
    // phones and can be switched off by the browser (review C, item 24).
    const d = this.receiveDialog;
    d.body.replaceChildren();
    d.body.appendChild(el('p', 'help', UI_TEXT.receivePrompt));
    const box = el('textarea', 'share-code');
    box.rows = 4;
    box.setAttribute('aria-label', UI_TEXT.receivePrompt);
    const status = el('p', 'help');
    status.setAttribute('role', 'status');
    const take = button(
      UI_TEXT.receiveTake,
      () => {
        const g = this.game();
        const n = decodeNubbin(box.value.trim());
        if (!g || !n) {
          status.textContent = UI_TEXT.codeBad;
          box.focus();
          return;
        }
        d.hide();
        g.send({ kind: 'receiveNubbin', nubbin: n });
        setTimeout(() => this.refresh(), 150);
      },
      'btn btn-small btn-primary',
    );
    const actions = el('div', 'roster-actions');
    actions.appendChild(take);
    d.body.append(box, actions, status);
    d.show();
    box.focus();
  }

  /** The idle front frame of the Nubbin's sheet, scaled up. */
  private portrait(g: Game, n: Nubbin): HTMLCanvasElement {
    const sheet = g.view.sheets.forNubbin(n);
    const rect =
      sheet.frames.get(frameKey('idle', 'front', 0)) ?? sheet.frames.values().next().value;
    const c = el('canvas', 'roster-portrait');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    if (ctx && rect) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        sheet.texture.image as HTMLCanvasElement,
        rect.x,
        rect.y,
        rect.w,
        rect.h,
        0,
        0,
        64,
        64,
      );
    }
    // R0462 (TECH-65): tap the portrait to hear the Nubbin's own chirp.
    c.addEventListener('click', () =>
      playChirp(speciesOf(n.species).family, true, chirpVoice(n.id, n.personality)),
    );
    return c;
  }

  private rename(n: Nubbin): void {
    const g = this.game();
    if (!g) return;
    const name = window.prompt(UI_TEXT.rename, n.name);
    if (name && name.trim()) {
      g.send({ kind: 'rename', nubbinId: n.id, name });
      setTimeout(() => this.refresh(), 150);
    }
  }
}

function describe(n: Nubbin): string {
  const stage =
    n.species === 'chao'
      ? STAGE_LABELS[n.stage]
      : `${SPECIES_LABELS[n.species] ?? n.species} · ${STAGE_LABELS[n.stage]}`;
  const band = n.form ? bandOf(n.alignment) : childHint(n.alignment);
  const bandLabel =
    band === 'sun'
      ? `☀ ${NAMES.alignmentSun}`
      : band === 'moon'
        ? `☾ ${NAMES.alignmentMoon}`
        : `◐ ${NAMES.alignmentNeutral}`;
  const bits: string[] = [stage];
  if (n.form) bits.push(TYPE_LABELS[n.form.type]);
  bits.push(bandLabel, UI_TEXT.age(formatDuration(n.ageMs)));
  if (n.rebirths > 0) bits.push(UI_TEXT.rebirths(n.rebirths));
  if (n.eggColor !== 'plain') {
    const colour = EGG_COLOR_LABELS[n.eggColor] ?? n.eggColor;
    const tone = n.tone ? ` / ${EGG_COLOR_LABELS[n.tone] ?? n.tone}` : '';
    bits.push(`${n.shiny ? '✨ ' : ''}${colour}${tone}`);
  } else if (n.shiny) {
    bits.push('✨ Shiny');
  }
  if (n.eternal) bits.push(`✦ ${UI_TEXT.eternalLabel}`);
  return bits.join(' · ');
}
