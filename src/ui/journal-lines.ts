import { CAMP_TEXT, STORYLINE_TEXT } from '../config/strings';
import { STORY_TEXT } from '../config/story';
import type { Game } from '../game';
import { lineRefusal, sharesStory } from '../sim/story-book';
import { journalView } from '../sim/storyline';
import { storylines } from '../sim/story-scenes';
import { button, el } from './dom';

/**
 * Lane C round 7 (R0596, R0643): the journal's "Other roads", the questlines that run beside
 * Hazel's Grove. A running line shows its chapter and goal with the same buttons a separate
 * campaign's journal has (aimed at the line by id), and a Leave that asks first in the card
 * itself; a line not begun shows Begin, or the reason it can't yet.
 */
export function renderLines(
  g: Game,
  body: HTMLElement,
  refresh: () => void,
  close: () => void,
  openers: Record<string, () => void>,
): void {
  if (!sharesStory(g.world)) return;
  const all = storylines();
  if (all.length === 0) return;
  const box = el('section', 'journal-lines');
  box.setAttribute('aria-label', CAMP_TEXT.linesHead);
  box.appendChild(el('div', 'btn-name', CAMP_TEXT.linesHead));
  box.appendChild(el('p', 'help', CAMP_TEXT.linesHelp));
  for (const s of all) {
    const line = g.world.lines[s.id];
    const card = el('div', 'journal-line');
    card.appendChild(el('div', 'roster-line', s.title));
    if (line && line.ending === null) {
      const view = journalView(g.world, line, false);
      if (view) {
        card.appendChild(el('p', undefined, CAMP_TEXT.chapterOf(view.n, view.final, view.title)));
        card.appendChild(el('p', undefined, `${view.goalText}${view.met ? ' ✓' : ''}`));
        card.appendChild(el('p', 'help', view.hint));
        const row = el('div', 'journal-actions');
        if (view.act && !line.flags[`act:${view.act}`] && !view.met) {
          const label = view.act;
          row.appendChild(
            button(
              STORY_TEXT.doStep,
              () => {
                g.send({ kind: 'storyAct', label, line: s.id });
                refresh();
              },
              'btn btn-small btn-primary',
            ),
          );
        }
        for (const a of view.actions) {
          const b = button(
            STORYLINE_TEXT.actions[a.id] ?? a.id,
            () => {
              const open = a.ui ? openers[a.ui] : undefined;
              if (open) {
                close();
                open();
              } else {
                g.send(a.command);
                refresh();
              }
            },
            'btn btn-small',
          );
          b.disabled = !a.enabled;
          row.appendChild(b);
        }
        for (const area of view.areas) {
          const b = button(
            STORYLINE_TEXT.areas[area] ?? area,
            () => {
              g.send({ kind: 'storyArea', area, line: s.id });
              close();
            },
            'btn btn-small',
          );
          if (view.area === area) b.classList.add('active');
          row.appendChild(b);
        }
        const leave = button(CAMP_TEXT.leave, () => ask(), 'btn btn-small');
        row.appendChild(leave);
        card.appendChild(row);
        // The ask lives in the card (R0647): no native confirm, and it reads in order.
        const ask = (): void => {
          const q = el('div', 'journal-actions');
          q.setAttribute('role', 'group');
          q.appendChild(el('p', undefined, CAMP_TEXT.leaveAsk(s.title)));
          const yes = button(
            CAMP_TEXT.leaveYes,
            () => {
              g.send({ kind: 'lineAbandon', line: s.id });
              refresh();
            },
            'btn btn-small',
          );
          const no = button(CAMP_TEXT.leaveNo, () => refresh(), 'btn btn-small btn-primary');
          q.append(yes, no);
          row.replaceWith(q);
          no.focus();
        };
      }
    } else {
      if (line?.ending) {
        const ending = s.endings[line.ending]?.title ?? line.ending;
        card.appendChild(el('p', 'help', CAMP_TEXT.ended(ending)));
      }
      const why = lineRefusal(g.world, s.id);
      const b = button(
        line?.ending ? CAMP_TEXT.again : CAMP_TEXT.begin,
        () => {
          g.send({ kind: 'storylineStart', id: s.id });
          refresh();
        },
        'btn btn-small btn-primary',
      );
      b.disabled = why !== null;
      card.appendChild(el('p', 'help', s.tagline));
      card.appendChild(b);
      const reason = why ? CAMP_TEXT.refusal[why] : '';
      if (reason) card.appendChild(el('p', 'help', reason));
    }
    box.appendChild(card);
  }
  body.appendChild(box);
}
