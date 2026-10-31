/**
 * The debug panel's piece editor (R0210, DUNG-65): pick any authored piece (or a blank one),
 * paint its cells with a brush, see the validator's verdict live, copy the piece out as
 * JSON, and try it on new floors of its tileset (a dev-only override, never saved: enter a
 * fresh run or go down a level to see it in either renderer). Ships only with the debug
 * panel, which is loaded in dev builds and `?debug` builds alone.
 */
import { HOLLOW } from '../config/tuning';
import { HOLLOW_R9D_TEXT } from '../config/strings-hollow-r9-d';
import {
  devPieceList,
  PIECE_CHARS,
  PIECES,
  pieceProblems,
  setDevPiece,
  STORY_PIECES,
  type Piece,
} from '../sim/dungeon-pieces';
import { blankPiece, editedPiece, paintCell, pieceJson } from '../sim/dungeon-pieces/editor';
import { button, el } from './dom';

const T = HOLLOW_R9D_TEXT.pieces;
/** Dev pieces get this weight so new floors pick them often. */
const TRY_WEIGHT = 40;

export function pieceEditor(): HTMLElement {
  const root = el('div', 'debug-row debug-pieces');
  root.appendChild(el('span', undefined, T.title));
  const all: Piece[] = [...Object.values(PIECES).flat(), ...STORY_PIECES];
  const pick = el('select');
  pick.setAttribute('aria-label', T.pick);
  for (const p of all)
    pick.appendChild(Object.assign(el('option', undefined, p.id), { value: p.id }));
  const brushRow = el('div', 'debug-pieces-brush');
  const grid = el('div', 'debug-pieces-grid');
  const status = el('small');
  const out = el('textarea', 'debug-pieces-json');
  out.readOnly = true;
  out.rows = 6;
  let base: Piece = all[0]!;
  let rows: string[] = [...base.rows];
  let brush = '.';

  const current = () =>
    editedPiece(base, rows, base.id.startsWith('dev-') ? base.id : `dev-${base.id}`);
  const draw = () => {
    grid.replaceChildren();
    grid.style.gridTemplateColumns = `repeat(${rows[0]?.length ?? 1}, 22px)`;
    rows.forEach((r, y) => {
      [...r].forEach((ch, x) => {
        const cell = button(ch, () => {
          rows = paintCell(rows, x, y, brush);
          draw();
        });
        cell.className = 'debug-pieces-cell';
        cell.dataset.ch = ch;
        grid.appendChild(cell);
      });
    });
    const p = current();
    const problems = pieceProblems(p, HOLLOW.v3.slot - 2);
    status.textContent = problems.length
      ? problems.join('; ')
      : `${T.valid} · ${p.size[0]}×${p.size[1]} · ${p.sockets.map((s) => s.dir).join('')}`;
    out.value = pieceJson(p);
  };
  for (const ch of PIECE_CHARS) {
    const b = button(
      ch,
      () => {
        brush = ch;
        for (const o of brushRow.children) o.setAttribute('aria-pressed', String(o === b));
      },
      'btn btn-small',
    );
    b.setAttribute('aria-pressed', String(ch === brush));
    b.title = `${T.brush} ${ch}`;
    brushRow.appendChild(b);
  }
  pick.addEventListener('change', () => {
    base = all.find((p) => p.id === pick.value) ?? base;
    rows = [...base.rows];
    draw();
  });
  const blank = button(
    T.newPiece,
    () => {
      base = blankPiece(8, 8);
      rows = [...base.rows];
      draw();
    },
    'btn btn-small',
  );
  const copy = button(
    T.copy,
    () => {
      void navigator.clipboard
        ?.writeText(out.value)
        .then(() => (copy.textContent = T.copied))
        .catch(() => out.select());
    },
    'btn btn-small',
  );
  const tryIt = button(
    T.tryIt,
    () => {
      const p = current();
      if (pieceProblems(p, HOLLOW.v3.slot - 2).length) return;
      setDevPiece({ ...p, weight: TRY_WEIGHT });
      tryIt.textContent = T.trying(
        devPieceList()
          .map((d) => d.id)
          .join(', '),
      );
    },
    'btn btn-small',
  );
  root.append(pick, blank, brushRow, grid, status, copy, tryIt, out);
  draw();
  return root;
}
