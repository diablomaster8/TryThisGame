import { combatantName } from '../config/strings-battle';
import { moveName } from '../config/strings-battle-moves';
import { POSTCARD_TEXT } from '../config/strings-battle-r6';
import { encodeReplayCode, funniestMoment, type ReplayRecord } from '../sim/battle/replay';
import type { BattleState } from '../sim/battle/types';
import { button, el } from './dom';

/**
 * "Save as postcard" and the replay code (recs FIGHT-100), for the results card. The postcard
 * is a small picture of the bout's funniest moment (the biggest Big one!, else a Dizzy
 * self-bonk, else the biggest hit) with its comedic line, saved as a PNG the Keeper keeps. The
 * replay code is the seed, the teams and every action, pasteable into Debug → Battle.
 */
export function postcardLine(s: BattleState): string {
  const m = funniestMoment(s.log);
  const name = (id: string) => {
    const c = [...s.sides[0], ...s.sides[1]].find((x) => x.id === id);
    return c ? combatantName(c) : id;
  };
  if (!m) return POSTCARD_TEXT.quiet;
  if (m.kind === 'boing') return POSTCARD_TEXT.boing(name(m.who), m.dmg);
  const move = m.move ? moveName(m.move) : POSTCARD_TEXT.bonk;
  return m.kind === 'crit'
    ? POSTCARD_TEXT.crit(name(m.by), move, name(m.to), m.dmg)
    : POSTCARD_TEXT.hit(name(m.by), move, name(m.to), m.dmg);
}

/** Draws the postcard and hands it to the browser as a download. */
function savePostcard(s: BattleState): void {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 360;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#f6ecd2';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = '#8a5a3c';
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, c.width - 24, c.height - 24);
  ctx.fillStyle = '#3a2a40';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(POSTCARD_TEXT.title, 40, 70);
  ctx.font = '22px sans-serif';
  const words = postcardLine(s).split(' ');
  let line = '';
  let y = 140;
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > c.width - 80) {
      ctx.fillText(line, 40, y);
      y += 32;
      line = w;
    } else line = next;
  }
  if (line) ctx.fillText(line, 40, y);
  ctx.font = '16px sans-serif';
  ctx.fillText(POSTCARD_TEXT.footer, 40, c.height - 40);
  const a = document.createElement('a');
  a.href = c.toDataURL('image/png');
  a.download = 'grove-bout-postcard.png';
  a.click();
}

/** The results card's postcard row: the moment's line, Save as postcard, Copy replay code. */
export function postcardRow(s: BattleState, replay: ReplayRecord | null): HTMLElement {
  const row = el('div', 'bs-postcard');
  row.appendChild(el('p', 'help', postcardLine(s)));
  const said = el('small');
  row.append(
    button(POSTCARD_TEXT.save, () => savePostcard(s), 'btn btn-small'),
    button(
      POSTCARD_TEXT.copy,
      () => {
        if (!replay) return;
        const code = encodeReplayCode(replay);
        try {
          void navigator.clipboard?.writeText(code).catch(() => undefined);
        } catch {
          // The text below has it anyway.
        }
        said.textContent = code.length > 48 ? `${code.slice(0, 48)}…` : code;
        said.title = code;
      },
      'btn btn-small',
    ),
    said,
  );
  return row;
}
