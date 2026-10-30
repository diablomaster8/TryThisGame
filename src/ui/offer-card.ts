import { REGIONS } from '../config/regions';
import { OFFER_TEXT, UI_TEXT } from '../config/strings';
import { QUEST_OFFERS } from '../config/tuning';
import type { Quest } from '../content/types';
import type { Game } from '../game';
import { isFunQuestCode } from '../sim/audience';
import { activeQuests, declineRule, questSize } from '../sim/quest-offers';
import { sideStory } from '../sim/story-scenes';
import type { SimEvent } from '../sim/types';
import { button, el } from './dom';

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

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.root = el('div', 'offer-card');
    this.root.hidden = true;
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'false');
    this.chip = button('', () => this.unfold(), 'offer-chip');
    this.chip.hidden = true;
    parent.append(this.root, this.chip);
  }

  onEvents(events: readonly SimEvent[]): void {
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
  }

  private build(g: Game, quest: Quest): void {
    this.root.replaceChildren();
    const caper = isFunQuestCode(quest.code);
    const giver = quest.speakers[0]?.name;
    const head = el('div', 'offer-head');
    head.append(el('span', 'offer-tag', caper ? OFFER_TEXT.caper : OFFER_TEXT.story));
    const badge = OFFER_TEXT.badge[quest.audience];
    if (badge) head.append(el('span', 'offer-badge', badge));
    head.append(el('span', 'offer-size', OFFER_TEXT.size[questSize(quest)] ?? ''));
    const title = el('h3', 'offer-title', quest.title);
    title.id = `offer-title-${quest.id}`;
    this.root.setAttribute('aria-labelledby', title.id);
    this.root.append(head, title);
    if (giver) this.root.append(el('p', 'offer-from', OFFER_TEXT.from(giver)));
    this.root.append(el('p', 'offer-pitch', pitchOf(quest)));
    const gifts = quest.rewards.filter((r) => r.kind !== 'flag');
    if (gifts.length > 0) {
      const row = el('div', 'offer-rewards');
      for (const r of gifts.slice(0, 3))
        row.append(el('span', 'offer-reward', `${OFFER_TEXT.rewardIcon[r.kind] ?? ''} ${r.label}`));
      this.root.append(row);
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
    list.append(
      button(OFFER_TEXT.keep, () => {
        this.capFor = null;
        this.shown = null;
      }),
    );
    this.root.append(list);
  }

  private answer(kind: 'questAccept' | 'questDecline', id: string): void {
    const g = this.game();
    if (!g) return;
    g.send({ kind, id });
    this.shown = null;
    if (kind === 'questAccept') this.pending = id;
  }
}
