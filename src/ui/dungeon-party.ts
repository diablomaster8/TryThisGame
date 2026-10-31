import { HOLLOW_PARTY_TEXT, STAT_ICONS, STAT_LABELS } from '../config/strings';
import { HOLLOW_R8_TEXT, HOLLOW_ROLE_TEXT } from '../config/strings-hollow-r8-party';
import type { Game } from '../game';
import { partyChoices, recommendedParty } from '../sim/dungeon-party';
import { hollowPartySize, ROLES } from '../sim/dungeon-roles';
import type { World } from '../sim/types';
import { button, el } from './dom';
import '../dungeon.css';

/**
 * The cave-mouth party picker (R0168): a card per Nubbin who could come (name, role icon and
 * word, best stat with its icon and word, energy), tap to put in or take out, up to the party
 * size, and a "Recommended" fill by role coverage. Under each card a role button cycles
 * Fetch → Fight → Light → Scout → Swim → automatic (R0167). The pick goes to the sim at once
 * and is used by every entry after. Tired Nubbins show a 💤 and the word, so colour is never
 * the only sign.
 */
export class PartyPicker {
  readonly root = el('div', 'hollow-party');
  private readonly list = el('div', 'hollow-party-list');
  private readonly note = el('p', 'help');
  private fallback: readonly string[] = [];

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
          this.render(g.world, this.fallback);
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
    this.fallback = fallback;
    this.list.replaceChildren();
    const chosen = this.picked(world, fallback);
    const size = hollowPartySize(world);
    this.note.textContent = HOLLOW_R8_TEXT.partyHelp(size);
    for (const c of partyChoices(world)) {
      const on = chosen.includes(c.id);
      const wrap = el('div', `hollow-party-slot${on ? ' on' : ''}`);
      const card = button(
        '',
        () => {
          const g = this.game();
          if (!g) return;
          const now = this.picked(g.world, fallback);
          const next = on ? now.filter((id) => id !== c.id) : [...now, c.id];
          // Full: the newest pick takes the oldest one's place.
          while (next.length > size) next.shift();
          g.send({ kind: 'setHollowParty', ids: next });
          this.render(g.world, fallback);
        },
        `hollow-party-card${on ? ' on' : ''}${c.tired ? ' tired' : ''}`,
      );
      card.setAttribute('aria-pressed', String(on));
      const role = HOLLOW_ROLE_TEXT[c.role];
      card.append(
        el('strong', undefined, `${on ? '✓ ' : ''}${c.name}`),
        el('small', undefined, `${STAT_ICONS[c.best]} ${STAT_LABELS[c.best]} ${c.level}`),
        el(
          'small',
          undefined,
          c.tired ? HOLLOW_PARTY_TEXT.tired : HOLLOW_PARTY_TEXT.energy(c.energy),
        ),
      );
      // R0167: the role, icon and word; a tap moves to the next role, then back to automatic.
      const auto = c.picked ? '' : ` (${HOLLOW_R8_TEXT.roleAuto})`;
      const roleBtn = button(
        `${HOLLOW_R8_TEXT.roleButton(role.icon, role.name)}${auto}`,
        () => {
          const g = this.game();
          if (!g) return;
          const i = ROLES.indexOf(c.role);
          // After the last role a hand pick goes back to automatic.
          const last = c.picked && i === ROLES.length - 1;
          const nextRole = last ? null : ROLES[(i + 1) % ROLES.length]!;
          g.send({ kind: 'setHollowRole', id: c.id, role: nextRole });
          this.render(g.world, fallback);
        },
        'btn btn-small hollow-party-role',
      );
      roleBtn.title = role.help;
      roleBtn.setAttribute('aria-label', HOLLOW_R8_TEXT.roleAria(c.name, role.name));
      wrap.append(card, roleBtn);
      this.list.appendChild(wrap);
    }
  }
}
