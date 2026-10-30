import '../battle-r5.css';
import { UI_TEXT } from '../config/strings';
import {
  combatantName,
  moodWord,
  moveName,
  STATUS_TEXT,
  TYPE_WORDS,
} from '../config/strings-battle';
import { INSPECT_TEXT as T } from '../config/strings-battle-r5';
import { MOOD_STATS, type BattleState, type Combatant } from '../sim/battle';
import { el, modal } from './dom';

/**
 * The "Inspect foe" card (recs FIGHT-77): tap the foe's HP card for its name, its type (icon
 * and word, never colour alone), its leaning (icon and word), the moves it has used in this
 * bout so far, and its statuses and moods. It only reads the bout; nothing here touches the sim.
 */
let shared: ReturnType<typeof modal> | null = null;

/** The moves `foe` has used in this bout, in the order first seen. */
export function movesSeen(s: BattleState, foe: Combatant): string[] {
  const out: string[] = [];
  for (const e of s.log)
    if (e.k === 'use' && e.by === foe.id && !out.includes(e.move)) out.push(e.move);
  return out;
}

export function openInspect(parent: HTMLElement, s: BattleState, foe: Combatant): void {
  shared ??= modal(parent, '', UI_TEXT.close);
  const d = shared;
  d.root.classList.add('bs-inspect');
  const heading = d.root.querySelector('h2');
  if (heading) heading.textContent = T.title(combatantName(foe));
  const body = d.body;
  body.innerHTML = '';
  const types = [foe.type, ...(foe.second ? [foe.second] : [])]
    .map((t) => `${TYPE_WORDS[t].icon} ${TYPE_WORDS[t].name}`)
    .join(' · ');
  const band = T.bands[foe.band];
  const dl = el('dl', 'bs-inspect-list');
  const row = (k: string, v: string): void => {
    dl.append(el('dt', undefined, k), el('dd', undefined, v));
  };
  row(T.type, types);
  row(T.band, `${band.icon} ${band.name}`);
  const seen = movesSeen(s, foe);
  row(T.moves, seen.length ? seen.map((m) => moveName(m)).join(', ') : T.noMoves);
  const marks: string[] = [];
  if (foe.major) marks.push(`${STATUS_TEXT[foe.major.id].icon} ${STATUS_TEXT[foe.major.id].name}`);
  for (const st of MOOD_STATS) if (foe.moods[st]) marks.push(moodWord(st, foe.moods[st]!));
  row(T.status, marks.length ? marks.join(', ') : T.fine);
  body.appendChild(dl);
  d.show();
}

export function inspectOpen(): boolean {
  return !!shared?.isOpen();
}

export function closeInspect(): void {
  shared?.hide();
}
