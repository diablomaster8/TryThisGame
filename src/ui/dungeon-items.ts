/**
 * Lane B round 8's item words and small views: the toast for a `hollowItems` event, charm
 * labels with grade pips (so grade never rests on colour), and the Journal's "Sets and
 * uniques" collection log (R0172): a ✿ (set piece) and ★ (unique) grid, with names and where
 * each was first found once found, and the six sets' bonuses.
 */
import { SETS, UNIQUE_ITEMS } from '../config/dungeon-items-r8';
import { ACT_TEXT, GEAR_TEXT } from '../config/strings';
import { ITEMS_R8_TEXT as T } from '../config/strings-hollow-r8-items';
import { SECRETS_R9B_TEXT as S } from '../config/strings-hollow-r9-b';
import { parseCharm } from '../sim/dungeon-charms';
import { collectibleIds, setCounts, sourceParts } from '../sim/dungeon-sets';
import type { SimEvent, World } from '../sim/types';
import { el } from './dom';

/** "🪶 Feather ●●○ (bright)". */
export function charmLabel(key: string): string {
  const c = parseCharm(key);
  if (!c) return key;
  return `${T.charmIcon[c.type] ?? ''} ${T.charmName[c.type] ?? c.type} ${T.pips(c.grade)} (${T.charmGrades[c.grade]})`;
}

export function itemsToast(e: Extract<SimEvent, { kind: 'hollowItems' }>): string {
  switch (e.what) {
    case 'charm': {
      const c = parseCharm(e.id);
      return c
        ? T.charmFound(
            T.charmIcon[c.type] ?? '',
            T.charmGrades[c.grade] ?? '',
            T.charmName[c.type] ?? '',
          )
        : '';
    }
    case 'key':
      return T.keyFound(`${T.keyIcon[e.id] ?? ''} ${T.keyName[e.id] ?? e.id}`);
    case 'chain':
      return T.chainMade(T.chain[e.id] ?? e.id);
    case 'mix':
      return T.barrowMixed(T.recipe[e.id] ?? '');
    case 'noMix':
      return T.barrowNoMix;
    case 'fort':
      return T.fortOpen;
    // Lane B r9: the secret levels (R0189, R0183).
    case 'moo':
      return S.mooOpen;
    case 'herd':
      return S.herd;
    case 'secret':
      return e.id === 'trio' ? S.trio : e.id === 'queen' ? S.queen : S.keepsakes;
  }
}

function where(code: string): string {
  const s = sourceParts(code);
  if (s === 'grove') return T.whereGrove;
  if (s === 'barrow') return T.whereBarrow;
  const act = s.act ? (ACT_TEXT[s.act]?.name ?? s.act) : '';
  return T.whereAct(act, s.depth);
}

/** The Journal's collection block (Hollow page). */
export function renderCollectionLog(world: World, body: HTMLElement): void {
  const found = world.gear?.found ?? {};
  body.appendChild(el('h4', undefined, T.logTitle));
  const all = collectibleIds();
  body.appendChild(el('p', 'help', T.logCount(all.filter((id) => found[id]).length, all.length)));
  const counts = setCounts(world);
  for (const set of SETS) {
    const p = el('p', undefined, `✿ ${T.setName[set.id] ?? set.id} · `);
    p.append(T.setWorn(counts[set.id] ?? 0, set.pieces.length));
    body.appendChild(p);
    const grid = el('div', 'hollow-journal-grid');
    for (const id of set.pieces) grid.appendChild(cell(id, '✿', T.pieceName[id], found[id]));
    body.appendChild(grid);
    const bonus = set.bonuses
      .map((b) => T.setBonus(b.at, GEAR_TEXT.stat[b.stat] ?? b.stat, String(b.value)))
      .join(' · ');
    body.appendChild(el('p', 'help', bonus));
  }
  body.appendChild(el('p', undefined, `★ ${GEAR_TEXT.rarity.legendary}`));
  const grid = el('div', 'hollow-journal-grid');
  for (const u of UNIQUE_ITEMS) grid.appendChild(cell(u.id, '★', T.uniqueName[u.id], found[u.id]));
  body.appendChild(grid);
}

function cell(id: string, glyph: string, name: string | undefined, at: string | undefined) {
  const c = el('span', at ? 'met' : undefined, at ? glyph : '☆');
  const line = at ? `${name ?? id} · ${T.logWhere(where(at))}` : '?';
  c.title = line;
  c.setAttribute('aria-label', line);
  return c;
}
