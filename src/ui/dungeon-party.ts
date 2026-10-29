import { DUNGEON } from '../config/tuning';
import { HOLLOW_PARTY_TEXT, STAT_ICONS, STAT_LABELS } from '../config/strings';
import type { Game } from '../game';
import { partyChoices, recommendedParty } from '../sim/dungeon-party';
import type { World } from '../sim/types';
import { button, el } from './dom';
import '../dungeon.css';

/**
 * The cave-mouth party picker (R0168): a card per Nubbin who could come (name, best stat
 * with its icon and word, energy), tap to put in or take out, up to the party size, and a
 * "Recommended" fill. The pick goes to the sim at once (`setHollowParty`) and is used by
 * every entry after. Tired Nubbins show a 💤 and the word, so colour is never the only sign.
 */
export class PartyPicker {
  readonly root = el('div', 'hollow-party');
  private readonly list = el('div', 'hollow-party-list');
  private readonly note = el('p', 'help');

  constructor(private readonly game: () => Game | null) {
    const head = el('div', 'hollow-party-head');
    head.append(
      el('h3', undefined, HOLLOW_PARTY_TEXT.title),
      button(
        HOLLOW_PARTY_TEXT.recommended,
        () => {
          const g = this.game();
          if (!g) return;
          g.send({ kind: 'setHollowParty', ids: recommendedParty(g.world) });
          this.render(g.world);
        },
        'btn btn-small',
      ),
    );
    this.root.append(head, this.note, this.list);
  }

  /** The party the next entry takes: the remembered pick, else the usual choice. */
  private picked(world: World, fallback: readonly string[]): string[] {
    return world.hollow.lastParty.length > 0 ? world.hollow.lastParty : [...fallback];
  }

  render(world: World, fallback: readonly string[] = []): void {
    this.list.replaceChildren();
    const chosen = this.picked(world, fallback);
    this.note.textContent = HOLLOW_PARTY_TEXT.help(DUNGEON.partySize);
    for (const c of partyChoices(world)) {
      const on = chosen.includes(c.id);
      const card = button(
        '',
        () => {
          const g = this.game();
          if (!g) return;
          const now = this.picked(g.world, fallback);
          const next = on ? now.filter((id) => id !== c.id) : [...now, c.id];
          // Full: the newest pick takes the oldest one's place.
          while (next.length > DUNGEON.partySize) next.shift();
          g.send({ kind: 'setHollowParty', ids: next });
          this.render(g.world, fallback);
        },
        `hollow-party-card${on ? ' on' : ''}${c.tired ? ' tired' : ''}`,
      );
      card.setAttribute('aria-pressed', String(on));
      card.append(
        el('strong', undefined, `${on ? '✓ ' : ''}${c.name}`),
        el('small', undefined, `${STAT_ICONS[c.best]} ${STAT_LABELS[c.best]} ${c.level}`),
        el(
          'small',
          undefined,
          c.tired ? HOLLOW_PARTY_TEXT.tired : HOLLOW_PARTY_TEXT.energy(c.energy),
        ),
      );
      this.list.appendChild(card);
    }
  }
}
