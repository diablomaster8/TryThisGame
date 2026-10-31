import { REGIONS } from '../config/regions';
import { OFFER_TEXT, UI_TEXT } from '../config/strings';
import { QUEST_OFFERS } from '../config/tuning';
import type { Quest } from '../content/types';
import type { Game } from '../game';
import { isFunQuestCode } from '../sim/audience';
import { activeQuests, declineRule, questSize } from '../sim/quest-offers';
import { sideStory, storylines } from '../sim/story-scenes';
import type { SimEvent } from '../sim/types';
import { button, el } from './dom';
import { JOURNAL_TEXT } from '../config/strings-journal';
import { portraitFrame } from './dialogue';
import { SPEAKER_NOW } from '../render/stage-actors';
import { giverOf } from './journal-search';
import { LINE_REWARD_TEXT, OFFER_WINDOW_TEXT } from '../config/strings-camp9';
import { OFFER_WINDOWS } from '../config/tuning-camp9';
import { LineCastPrompt } from './line-cast-prompt';

/**
 * Lane C round 8 (R0606): the Open quest flow's offer card. A bottom sheet, never over a scene,
 * panel or minigame (the objective chip's hide rule): who offers it, what it is, how long, what
 * it gives, then Accept on the thumb side and Not now. Left alone it folds to a "!" chip, which
 * brings it back. Accepting at the cap asks which quest to put aside (R0602).
 */

/** A place's name for the card and the board: a landmark's name, else its id in words. */
export function areaName(area: string): string {
  const [region, poi] = area.split('/');
  const def = REGIONS[region as keyof typeof REGIONS]?.pois.find((p) => p.id === poi);
  const names = UI_TEXT.landmarkNames as Record<string, string>;
  if (def?.landmark && names[def.landmark]) return names[def.landmark]!;
  const word = poi && poi !== '*' ? poi : (region ?? '');
  return word.charAt(0).toUpperCase() + word.slice(1).replace(/-/g, ' ');
}

/** The card's one-line pitch: the first step's goal, kept to 100 characters. */
export function pitchOf(quest: Quest): string {
  const goal = quest.steps[0]?.goal ?? '';
  return goal.length <= 100 ? goal : `${goal.slice(0, 99).trimEnd()}…`;
}

export class OfferCard {
  private readonly root: HTMLDivElement;
  private readonly chip: HTMLButtonElement;
  private shown: string | null = null;
  private shownAt = 0;
  private folded = false;
  private capFor: string | null = null;
  /** An Accept sent and not yet seen through (commands apply on the next step). */
  private pending: string | null = null;
  /** Lane C r9 (R0594): the bring-home prompt. */
  private readonly cast: LineCastPrompt;
  /** R0662: where focus was before the card took it, to give it back after an answer. */
  private opener: HTMLElement | null = null;
  /** The chip was tapped: focus Accept on the next refresh. */
  private wantFocus = false;
  /** The offer the card last moved focus to, so a keyboard player is not pulled back twice. */
  private focusedFor: string | null = null;

  /** Back to where focus was, if the card had it (R0662). */
  private giveFocusBack(): void {
    const had = this.root.contains(document.activeElement);
    const to = this.opener;
    this.opener = null;
    if (had && to?.isConnected) to.focus();
  }

  /** R0606: the giver's head and shoulders, 48 px, from the dialogue's portrait drawer. */
  private portrait(g: Game, id: string, name: string): HTMLCanvasElement | null {
    const was = SPEAKER_NOW.who;
    try {
      const { sheet, key } = portraitFrame(id, g, 'happy');
      const rect = sheet?.frames.get(key) ?? sheet?.frames.values().next().value;
      if (!sheet || !rect) return null;
      const canvas = document.createElement('canvas');
      canvas.className = 'offer-portrait';
      canvas.width = 48;
      canvas.height = 48;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', JOURNAL_TEXT.giverAlt(name));
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        sheet.texture.image as HTMLCanvasElement,
        rect.x,
        rect.y,
        rect.w,
        rect.h,
        0,
        0,
        48,
        48,
      );
      return canvas;
    } catch {
      // No sheet for this speaker: the card reads the same without a face.
      return null;
    } finally {
      // The drawer marks the world's speaker chevron; the card is not a conversation.
      SPEAKER_NOW.who = was;
    }
  }

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.root = el('div', 'offer-card');
    this.root.hidden = true;
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'false');
    this.root.setAttribute('aria-label', JOURNAL_TEXT.offerLabel);
    // R0662: Escape is Not now (or, at the cap, Keep them all) while the card is up. Capture
    // phase, so the HUD's own Escape does not act on the Grove underneath too.
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== 'Escape' || this.root.hidden || !this.shown) return;
        e.stopPropagation();
        e.preventDefault();
        if (this.capFor) this.root.querySelector<HTMLElement>('.offer-keep')?.click();
        else this.answer('questDecline', this.shown);
      },
      { capture: true },
    );
    this.chip = button('', () => this.unfold(), 'offer-chip');
    this.chip.hidden = true;
    parent.append(this.root, this.chip);
    // Lane C r9 (R0594): the bring-home choice at a line's end shares the card's place and rules.
    this.cast = new LineCastPrompt(parent, game);
  }

  onEvents(events: readonly SimEvent[]): void {
    this.cast.onEvents(events);
    // Lane C r9 (R0639, R0652): a finished line's rewards, and an offer whose window passed.
    for (const e of events) {
      if (e.kind === 'lineReward') {
        const title = storylines().find((s) => s.id === e.line)?.title ?? e.line;
        this.toast(LINE_REWARD_TEXT.toast(title, e.shells));
      } else if (e.kind === 'questExpired') {
        const q = sideStory(e.quest);
        this.toast(q ? `${q.title}: ${OFFER_WINDOW_TEXT.expired}` : OFFER_WINDOW_TEXT.expired);
      }
    }
    for (const e of events) {
      if (e.kind === 'questAtCap') {
        this.capFor = e.quest;
        this.pending = null;
        this.shown = null;
      }
      if (e.kind === 'questOffered') this.folded = false;
    }
  }

  /** From the HUD's refresh loop; `busy` is true over scenes, panels and minigames. */
  refresh(busy: boolean): void {
    // The bring-home prompt goes first; the offer waits behind it.
    if (this.cast.refresh(busy)) busy = true;
    const g = this.game();
    if (g && this.pending && g.world.questBook?.entries[this.pending]?.state === 'active') {
      const q = sideStory(this.pending);
      if (q) this.toast(OFFER_TEXT.accepted(q.title));
      this.pending = null;
    }
    const offer = g?.world.questBook?.offer ?? null;
    const id = this.capFor ?? offer?.quest ?? null;
    const quest = id ? sideStory(id) : undefined;
    if (!g || !id || !quest || busy) {
      this.root.hidden = true;
      this.chip.hidden = !quest || busy || !this.folded;
      if (!id) this.shown = null;
      return;
    }
    if (this.shown !== id) {
      this.shown = id;
      this.shownAt = performance.now();
      this.build(g, quest);
    }
    // R0662: focus Accept when the player came by keyboard or tapped the chip. Not on a
    // plain walk-up: Space on a focused button presses it, and Space is the jump.
    const at = document.activeElement;
    // :focus-visible tells a keyboard player's focus from a button a mouse click left focused.
    const keyboard =
      at instanceof HTMLElement &&
      at !== document.body &&
      !this.root.contains(at) &&
      at.matches(':focus-visible');
    if (!this.folded && (this.wantFocus || (keyboard && this.focusedFor !== id))) {
      this.focusedFor = id;
      this.wantFocus = false;
      this.opener = at instanceof HTMLElement && at !== document.body ? at : null;
      queueMicrotask(() =>
        this.root
          .querySelector<HTMLElement>('.offer-buttons .btn-primary, .offer-shelve button')
          ?.focus(),
      );
    }
    if (!this.capFor && !this.folded && performance.now() - this.shownAt > QUEST_OFFERS.offerCardMs)
      this.folded = true;
    this.root.hidden = this.folded;
    this.chip.hidden = !this.folded;
    if (this.folded) {
      this.chip.textContent = OFFER_TEXT.chip(quest.title);
      this.chip.setAttribute('aria-label', OFFER_TEXT.chipLabel(quest.title));
    }
  }

  private unfold(): void {
    this.folded = false;
    this.shownAt = performance.now();
    // R0662: the player asked for it, so the focus goes to Accept.
    this.wantFocus = true;
  }

  private build(g: Game, quest: Quest): void {
    this.root.replaceChildren();
    const caper = isFunQuestCode(quest.code);
    const who = giverOf(quest);
    const head = el('div', 'offer-head');
    head.append(el('span', 'offer-tag', caper ? OFFER_TEXT.caper : OFFER_TEXT.story));
    const badge = OFFER_TEXT.badge[quest.audience];
    if (badge) head.append(el('span', 'offer-badge', badge));
    head.append(el('span', 'offer-size', OFFER_TEXT.size[questSize(quest)] ?? ''));
    const title = el('h3', 'offer-title', quest.title);
    title.id = `offer-title-${quest.id}`;
    this.root.setAttribute('aria-labelledby', title.id);
    this.root.append(head, title);
    if (who) {
      // R0606: the giver's portrait beside their name, from the dialogue's own drawer.
      const from = el('div', 'offer-from-row');
      const face = this.portrait(g, who.id, who.name);
      if (face) from.append(face);
      from.append(el('p', 'offer-from', OFFER_TEXT.from(who.name)));
      this.root.append(from);
    }
    this.root.append(el('p', 'offer-pitch', pitchOf(quest)));
    const gifts = quest.rewards.filter((r) => r.kind !== 'flag');
    if (gifts.length > 0) {
      const row = el('div', 'offer-rewards');
      for (const r of gifts.slice(0, 3))
        row.append(el('span', 'offer-reward', `${OFFER_TEXT.rewardIcon[r.kind] ?? ''} ${r.label}`));
      this.root.append(row);
    }
    // Lane C r9 (R0652): a windowed offer says how long it lasts.
    const ends = g.world.questBook?.entries[quest.id]?.expiresMs;
    if (ends !== undefined) {
      const w = OFFER_WINDOWS[quest.id];
      const line =
        w === 'dawn' || w === 'dusk'
          ? OFFER_WINDOW_TEXT[w]
          : OFFER_WINDOW_TEXT.minutes(Math.max(1, Math.ceil((ends - g.world.timeMs) / 60_000)));
      this.root.append(el('p', 'offer-lapse offer-window', line));
    }
    if (declineRule(quest.id) === 'lapse')
      this.root.append(el('p', 'offer-lapse', OFFER_TEXT.lapse));
    if (this.capFor) {
      this.buildCap(g, quest);
      return;
    }
    const buttons = el('div', 'offer-buttons');
    const no = button(OFFER_TEXT.notNow, () => this.answer('questDecline', quest.id), 'btn');
    const yes = button(
      OFFER_TEXT.accept,
      () => this.answer('questAccept', quest.id),
      'btn btn-primary',
    );
    buttons.append(no, yes);
    this.root.append(buttons);
  }

  /** Accepting at the cap: name a quest to put aside, or keep them all. */
  private buildCap(g: Game, quest: Quest): void {
    this.root.append(el('p', 'offer-pitch', OFFER_TEXT.atCap));
    const list = el('div', 'offer-shelve');
    const c = g.world.campaign;
    for (const id of c ? activeQuests(g.world, c) : []) {
      const q = sideStory(id);
      if (!q || declineRule(id) !== 'free') continue;
      list.append(
        button(OFFER_TEXT.shelve(q.title), () => {
          g.send({ kind: 'questAccept', id: quest.id, shelve: id });
          this.capFor = null;
          this.shown = null;
          this.pending = quest.id;
        }),
      );
    }
    const keep = button(OFFER_TEXT.keep, () => {
      this.capFor = null;
      this.shown = null;
      this.giveFocusBack();
    });
    keep.classList.add('offer-keep');
    list.append(keep);
    this.root.append(list);
  }

  private answer(kind: 'questAccept' | 'questDecline', id: string): void {
    const g = this.game();
    if (!g) return;
    g.send({ kind, id });
    this.shown = null;
    if (kind === 'questAccept') this.pending = id;
    this.giveFocusBack();
  }
}
