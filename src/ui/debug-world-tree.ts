/**
 * TECH-47: the debug panel's World editor, loaded on demand (a dynamic import from the
 * panel, which itself only loads under `?debug` or a dev build). A collapsible JSON tree of
 * the world as it stands, a leaf editor that sends `debugSet` after the sim's own check
 * (src/sim/debug-set.ts), quick sliders for the selected Nubbin, and copy and paste of the
 * whole world.
 */
import { WORLD_EDITOR_TEXT as T } from '../config/strings-r11d5';
import type { Game } from '../game';
import { debugSetProblem } from '../sim/debug-set';
import { deserialize, serialize, validateWorld } from '../sim/save';
import { button, el } from './dom';

const MAX_CHILDREN = 60;
const MIN_MS = 60_000;

/** A slider for one numeric leaf of the selected Nubbin. */
interface Quick {
  label: string;
  path: string[];
  min: number;
  max: number;
  step: number;
  /** The leaf is this many times the slider's value. */
  scale: number;
}
const QUICK: readonly Quick[] = [
  { label: 'alignment', path: ['alignment'], min: -1, max: 1, step: 0.01, scale: 1 },
  ...(['normal', 'swim', 'fly', 'run', 'power'] as const).map((t) => ({
    label: `lean ${t}`,
    path: ['typeLean', t],
    min: 0,
    max: 100,
    step: 1,
    scale: 1,
  })),
  { label: 'happiness', path: ['needs', 'happiness'], min: -100, max: 100, step: 1, scale: 1 },
  { label: 'affection', path: ['needs', 'affection'], min: 0, max: 100, step: 1, scale: 1 },
  { label: 'trust', path: ['trust'], min: 0, max: 100, step: 1, scale: 1 },
  { label: 'age (min)', path: ['ageMs'], min: 0, max: 400, step: 1, scale: MIN_MS },
];

export function mountWorldEditor(parent: HTMLElement, game: () => Game | null): () => void {
  const root = el('div', 'debug-world');
  const msg = el('div', 'debug-world-msg');
  msg.setAttribute('role', 'status');
  const say = (text: string): void => void (msg.textContent = text);

  /** Dry-run, then send: the refusal text is shown and nothing changes. */
  const set = (path: string[], value: unknown): boolean => {
    const g = game();
    if (!g) return false;
    const problem = debugSetProblem(g.world, path, value);
    if (problem) {
      say(T.refused + problem);
      return false;
    }
    g.send({ kind: 'debugSet', path, value });
    say('');
    return true;
  };

  // ---- quick sliders for the selected Nubbin ----
  const quick = el('details', 'debug-world-quick');
  quick.appendChild(el('summary', undefined, T.sliders));
  const rows = el('div');
  quick.appendChild(rows);
  const buildSliders = (): void => {
    rows.textContent = '';
    const g = game();
    const idx = g ? g.world.nubbins.findIndex((n) => n.id === g.world.selected) : -1;
    if (!g || idx < 0) {
      rows.appendChild(el('div', undefined, T.noNubbin));
      return;
    }
    for (const q of QUICK) {
      let at: unknown = g.world.nubbins[idx];
      for (const k of q.path) at = (at as Record<string, unknown>)[k];
      const start = (at as number) / q.scale;
      const row = el('label', 'debug-row');
      const out = el('span', undefined, String(Math.round(start * 100) / 100));
      const input = document.createElement('input');
      input.type = 'range';
      input.min = String(q.min);
      input.max = String(q.max);
      input.step = String(q.step);
      input.value = String(start);
      input.addEventListener('input', () => {
        const v = Number(input.value);
        if (set(['nubbins', String(idx), ...q.path], v * q.scale)) out.textContent = String(v);
      });
      row.append(el('span', undefined, q.label), input, out);
      rows.appendChild(row);
    }
  };
  quick.addEventListener('toggle', () => {
    if (quick.open) buildSliders();
  });

  // ---- the JSON tree ----
  const tree = el('div', 'debug-world-tree');
  const node = (key: string, value: unknown, path: string[]): HTMLElement => {
    if (typeof value === 'object' && value !== null) {
      const d = el('details');
      const keys = Object.keys(value);
      d.appendChild(el('summary', undefined, `${key} (${keys.length})`));
      let filled = false;
      d.addEventListener('toggle', () => {
        if (!d.open || filled) return;
        filled = true;
        for (const k of keys.slice(0, MAX_CHILDREN))
          d.appendChild(node(k, (value as Record<string, unknown>)[k], [...path, k]));
        if (keys.length > MAX_CHILDREN)
          d.appendChild(el('div', undefined, `... ${keys.length - MAX_CHILDREN} more`));
      });
      return d;
    }
    const row = el('div', 'debug-row');
    const kind = typeof value;
    if (kind !== 'number' && kind !== 'string' && kind !== 'boolean') {
      row.textContent = `${key}: ${String(value)}`;
      return row;
    }
    const input = document.createElement('input');
    input.setAttribute('aria-label', path.join('.'));
    if (kind === 'boolean') {
      input.type = 'checkbox';
      input.checked = value as boolean;
    } else {
      input.type = kind === 'number' ? 'number' : 'text';
      input.value = String(value);
    }
    if (kind === 'number') input.step = 'any';
    row.append(
      el('span', undefined, key),
      input,
      button(
        T.set,
        () => {
          if (kind === 'boolean') set(path, input.checked);
          else set(path, kind === 'number' ? Number(input.value) : input.value);
        },
        'btn btn-small',
      ),
    );
    return row;
  };
  const render = (): void => {
    const g = game();
    tree.textContent = '';
    if (!g) return;
    // A snapshot: reading never touches the live world.
    tree.appendChild(node('world', structuredClone(g.world), []));
  };

  // ---- copy and paste ----
  const box = document.createElement('textarea');
  box.rows = 3;
  box.hidden = true;
  box.setAttribute('aria-label', T.paste);
  const loadBtn = button(
    T.load,
    () => {
      const g = game();
      if (!g) return;
      try {
        g.replaceWorld(validateWorld(deserialize(box.value).world));
        box.hidden = true;
        loadBtn.hidden = true;
        say('');
        render();
      } catch {
        say(T.badJson);
      }
    },
    'btn btn-small',
  );
  loadBtn.hidden = true;
  const actions = el('div', 'debug-row');
  actions.append(
    button(
      T.copy,
      () => {
        const g = game();
        if (!g) return;
        const json = serialize(g.world, Date.now());
        const fallback = (): void => {
          box.hidden = false;
          box.value = json;
          say(T.copyFailed);
        };
        if (!navigator.clipboard) fallback();
        else navigator.clipboard.writeText(json).then(() => say(T.copied), fallback);
      },
      'btn btn-small',
    ),
    button(
      T.paste,
      () => {
        box.hidden = false;
        loadBtn.hidden = false;
        box.value = '';
        say(T.pasteBody);
      },
      'btn btn-small',
    ),
    button(T.refresh, render, 'btn btn-small'),
  );

  root.append(actions, box, loadBtn, msg, quick, tree);
  parent.appendChild(root);
  render();
  return () => root.remove();
}
