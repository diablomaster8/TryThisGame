import { NAMES, STAT_LABELS } from '../config/strings';
import { RACE_GAG_TEXT, rivalLabel } from '../config/strings-fun-r6';
import { UI_FX_TEXT } from '../config/strings-ui';
import { sectionAt, statFor, type RaceState } from '../sim/race';
import { el } from './dom';

/**
 * The race results card's standings and tip. It only watches the sim's race as the screen
 * steps it: for each racer, how long it spent in each section and how long resting. The
 * tip names the section where the player lost the most time to the winner (or, for a win,
 * to the runner-up), or the rests when those cost more. No sim rule changes.
 */
export class RaceWatch {
  /** Milliseconds per racer id, per section index. */
  private readonly sectionMs = new Map<string, number[]>();
  private readonly restMs = new Map<string, number>();

  constructor(private readonly race: RaceState) {
    for (const r of race.racers) {
      this.sectionMs.set(
        r.id,
        race.course.sections.map(() => 0),
      );
      this.restMs.set(r.id, 0);
    }
  }

  /** Call after each sim step of `dtMs`, with the racers where that step left them. */
  observe(dtMs: number): void {
    for (const r of this.race.racers) {
      if (r.finishedAtMs !== null && r.finishedAtMs < this.race.timeMs) continue;
      if (r.restMs > 0) this.restMs.set(r.id, (this.restMs.get(r.id) ?? 0) + dtMs);
      const { index } = sectionAt(this.race.course, Math.min(r.pos, this.race.length - 1e-6));
      const list = this.sectionMs.get(r.id);
      if (list) list[index] = (list[index] ?? 0) + dtMs;
    }
  }

  /** R0325: a line when the player's Nubbin stopped for a butterfly, else null. */
  butterfly(): string | null {
    const me = this.race.racers.find((r) => r.isPlayer);
    return me && (me.gazes ?? 0) > 0 ? RACE_GAG_TEXT.tip(me.name || NAMES.creature) : null;
  }

  /** The tip line for the player, or null when there is nobody to compare with. */
  tip(): string | null {
    const order = this.race.placements;
    const player = this.race.racers.find((r) => r.isPlayer);
    if (!player || order.length < 2) return null;
    const won = order[0] === player.id;
    const rivalId = won ? order[1] : order[0];
    const mine = this.sectionMs.get(player.id) ?? [];
    const theirs = this.sectionMs.get(rivalId ?? '') ?? [];
    let worst = -1;
    let worstLoss = -Infinity;
    for (let i = 0; i < mine.length; i++) {
      const loss = (mine[i] ?? 0) - (theirs[i] ?? 0);
      if (loss > worstLoss) {
        worstLoss = loss;
        worst = i;
      }
    }
    const restLoss = (this.restMs.get(player.id) ?? 0) - (this.restMs.get(rivalId ?? '') ?? 0);
    if (!won && restLoss > worstLoss && restLoss > 0) return UI_FX_TEXT.tipRest;
    const kind = this.race.course.sections[worst]?.kind;
    if (!kind) return null;
    const section = UI_FX_TEXT.sectionNames[kind] ?? kind;
    const stat = STAT_LABELS[statFor(kind)];
    return won ? UI_FX_TEXT.tipWon(section, stat) : UI_FX_TEXT.tipSection(section, stat);
  }
}

/**
 * The full standings: place, name and time for each racer, the player's row marked with a
 * star and the word "You" as well as a highlight (colour is never the only signal).
 */
export function standingsList(race: RaceState): HTMLOListElement {
  const list = el('ol', 'race-standings');
  list.setAttribute('aria-label', UI_FX_TEXT.standings);
  race.placements.forEach((id, i) => {
    const r = race.racers.find((x) => x.id === id);
    if (!r) return;
    const row = el('li', r.isPlayer ? 'race-standing is-you' : 'race-standing');
    row.append(
      el('span', 'race-standing-place', UI_FX_TEXT.ordinal(i + 1)),
      el(
        'span',
        'race-standing-name',
        r.isPlayer
          ? `★ ${r.name || NAMES.creature} (${UI_FX_TEXT.youMark})`
          : rivalLabel(r.name, r.quirk),
      ),
      el(
        'span',
        'race-standing-time',
        r.finishedAtMs !== null ? UI_FX_TEXT.finishTime(r.finishedAtMs) : UI_FX_TEXT.noTime,
      ),
    );
    if (r.isPlayer) row.setAttribute('aria-current', 'true');
    list.appendChild(row);
  });
  return list;
}
