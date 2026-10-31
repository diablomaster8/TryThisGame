import { ACTS } from '../config/dungeon-acts';
import { ACT_QUESTS, FRIEND_AURA, HOLLOW_R9C } from '../config/dungeon-r9-c';
import { ACT_TEXT, TRAINER_LABELS } from '../config/strings';
import { HOLLOW_R9C_TEXT as T } from '../config/strings-hollow-r9-c';
import type { Command, SimEvent, World } from '../sim/types';
import { dailyActOf } from '../sim/dungeon-daily';
import { dailySeed } from '../sim/dungeon';
import { clockText } from '../sim/dungeon-log';
import { friendOf, hireBoard } from '../sim/dungeon-friends';
import { questChipHere, questsOfAct, questState } from '../sim/dungeon-quests';
import { decodeTodayCode, encodeTodayCode } from '../sim/share';
import { tzOf } from '../sim/local-time';
import { button, el } from './dom';

/**
 * Lane B round 9, helper c: the small UI pieces for the party's personalities (R0167 toasts),
 * the Journal's secrets and quests rows (R0165), today's chain line and share codes (R0185),
 * the camp quest-giver's act quests (R0166) and the hire board (R0181). Read-only over the sim;
 * every change goes through a command.
 */

const name = (world: World, id: string) => world.nubbins.find((n) => n.id === id)?.name ?? '';
const friendName = (id: string) => TRAINER_LABELS[id]?.name ?? id;
const questName = (id: string) => T.quests[id]?.name ?? id;

/** The HUD's toasts for this round's events. */
export function roundNineCToast(e: SimEvent, world: World, toast: (text: string) => void): void {
  if (e.kind !== 'hollowR9') return;
  switch (e.what) {
    case 'borrow':
      toast(T.borrow(name(world, e.id)));
      break;
    case 'nap':
      toast(T.nap(name(world, e.id)));
      break;
    case 'napRest':
      toast(T.napRest(name(world, e.id)));
      break;
    case 'questTaken':
      toast(T.questTaken(questName(e.id)));
      break;
    case 'questDone':
      toast(T.questDone(questName(e.id), e.n ?? 0));
      break;
    case 'hired':
      toast(T.hired(friendName(e.id)));
      break;
    case 'friendLeft':
      toast(T.friendLeft(friendName(e.id)));
      break;
    case 'friendHeal':
      toast(T.friendHeal(friendName(e.id)));
      break;
    default:
      break;
  }
}

/** The Hollow bar's quest chip on a level with a quest under way, else ''. */
export function questChipText(world: World): string {
  const id = questChipHere(world);
  const goal = id ? T.quests[id]?.goal : undefined;
  return goal ? ` · ${T.questChip(goal)}` : '';
}

type Send = (cmd: Command) => void;

function row(parent: HTMLElement, title: string, help: string, action: HTMLElement): void {
  const r = el('div', 'shop-row');
  const info = el('div');
  info.append(el('strong', undefined, title), el('small', undefined, help));
  r.append(info, action);
  parent.appendChild(r);
}

/** The camp quest-giver's two act quests: take one, see it under way, or see it done. */
export function renderActQuests(world: World, parent: HTMLElement, act: number, send: Send) {
  parent.appendChild(el('h3', undefined, T.questTitle));
  for (const q of questsOfAct(act)) {
    const text = T.quests[q.id];
    const state = questState(world, q.id);
    const help = `${text?.ask ?? ''} ${T.questReward(q.shells, q.acorns)}`;
    let action: HTMLElement;
    if (state === 'done') action = el('span', 'shop-note', T.questDoneMark);
    else if (state === 'active') action = el('span', 'shop-note', T.questActive);
    else
      action = button(
        T.questTake,
        () => send({ kind: 'hollowR9', what: 'quest', id: q.id }),
        'btn btn-small btn-primary',
      );
    row(parent, text?.name ?? q.id, help, action);
  }
}

/** The camp hire board: the act's friends, their aura and price, or who is along now. */
export function renderHireBoard(world: World, parent: HTMLElement, act: number, send: Send) {
  const cost = HOLLOW_R9C.friends.cost;
  parent.appendChild(el('p', 'help', T.hireHelp(cost)));
  const along = friendOf(world);
  if (along) {
    parent.appendChild(el('p', 'shop-note', T.hireAlong(friendName(along.trainer))));
    parent.appendChild(
      button(
        T.hireSendHome,
        () => send({ kind: 'hollowR9', what: 'dismiss', id: along.trainer }),
        'btn btn-small',
      ),
    );
    return;
  }
  for (const id of hireBoard(act)) {
    const aura = T.aura[FRIEND_AURA[id] ?? 'brave'];
    const b = button(
      T.hireButton(cost),
      () => send({ kind: 'hollowR9', what: 'hire', id }),
      'btn btn-small btn-primary',
    );
    b.disabled = world.inventory.shells < cost;
    row(
      parent,
      `${friendName(id)} · ${aura?.name ?? ''}`,
      `${aura?.help ?? ''} "${T.hireLine[id] ?? ''}"`,
      b,
    );
  }
}

/** The Journal's "The Hollow" rows this round adds: secrets found and act quests done. */
export function renderJournalRows(world: World, body: HTMLElement): void {
  body.appendChild(el('p', undefined, T.journalSecrets(world.hollow.secrets?.length ?? 0)));
  const done = ACT_QUESTS.filter((q) => questState(world, q.id) === 'done').length;
  body.appendChild(el('p', undefined, T.journalQuests(done, ACT_QUESTS.length)));
  const grid = el('div', 'hollow-journal-grid');
  for (const q of ACT_QUESTS) {
    const ok = questState(world, q.id) === 'done';
    const cell = el('span', ok ? 'met' : undefined, ok ? '!' : '·');
    const line = ok ? questName(q.id) : '?';
    cell.title = line;
    cell.setAttribute('aria-label', line);
    grid.appendChild(cell);
  }
  body.appendChild(grid);
}

/** The cave-mouth menu's line naming today's chain. */
export function dailyChainLine(world: World): string {
  const act = dailyActOf(dailySeed(world.lastWallMs, tzOf(world)).seed);
  return T.dailyChain(ACT_TEXT[ACTS[act]!.id]?.name ?? '');
}

/** Today's share code for the share card, or null before today's first trip. */
export function todayCode(world: World): string | null {
  const t = world.hollow.today;
  const day = dailySeed(world.lastWallMs, tzOf(world)).day;
  if (!t || t.day !== day || t.deepest <= 0) return null;
  return encodeTodayCode(t);
}

/** The share card's "compare with a friend's code" box. */
export function compareBox(world: () => World | null): HTMLElement {
  const box = el('div', 'hollow-compare');
  const label = el('label', undefined, T.compareLabel);
  const input = el('input');
  input.type = 'text';
  input.placeholder = T.comparePlaceholder;
  input.autocomplete = 'off';
  input.spellcheck = false;
  label.appendChild(input);
  const out = el('p', 'help');
  out.setAttribute('aria-live', 'polite');
  const go = button(T.compareButton, () => {
    const r = decodeTodayCode(input.value);
    const w = world();
    if (!r) {
      out.textContent = T.compareBad;
      return;
    }
    const day = w ? dailySeed(w.lastWallMs, tzOf(w)).day : '';
    out.textContent = T.compareResult(r.deepest, clockText(r.bestMs), r.finds, r.day === day);
  });
  box.append(label, go, out);
  return box;
}
