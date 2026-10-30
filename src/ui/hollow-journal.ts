import { ACTS } from '../config/dungeon-acts';
import { UNIQUES } from '../config/dungeon-foes';
import { ACT_TEXT, HOLLOW_R6_TEXT, HOLLOW_R7_TEXT, UNIQUE_TEXT } from '../config/strings';
import { dailySeed } from '../sim/dungeon';
import { clockText } from '../sim/dungeon-log';
import type { World } from '../sim/types';
import { el } from './dom';

/**
 * The Journal's "The Hollow" page (R0165, lane B round 6): each act's boss with ✓ or ○, the
 * waypoints woken, the named foes met as a ★ grid (names only once met), the deepest level ever
 * and today's results. Read-only; the page reflects the sim state as it stands.
 */
export function renderHollowPage(world: World, body: HTMLElement): void {
  const h = world.hollow;
  body.appendChild(el('h3', undefined, HOLLOW_R6_TEXT.journalTitle));
  const acts = el('div', 'hollow-journal-acts');
  ACTS.forEach((act, i) => {
    const text = ACT_TEXT[act.id];
    const done = h.acts[i]?.bossDefeated === true;
    acts.appendChild(
      el(
        'p',
        undefined,
        `${text?.name ?? act.id}: ${HOLLOW_R6_TEXT.journalBoss(text?.boss ?? act.boss, done)}`,
      ),
    );
  });
  body.appendChild(acts);
  // Each act has a camp stone plus one per level.
  const total = ACTS.reduce((a, act) => a + act.levels.length + 1, 0);
  body.appendChild(el('p', undefined, HOLLOW_R6_TEXT.journalWaypoints(h.waypoints.length, total)));
  body.appendChild(
    el('p', undefined, HOLLOW_R6_TEXT.journalUniques(h.uniquesBeaten.length, UNIQUES.length)),
  );
  const grid = el('div', 'hollow-journal-grid');
  for (const u of UNIQUES) {
    const met = h.uniquesBeaten.includes(u.id);
    const cell = el('span', met ? 'met' : undefined, met ? '★' : '☆');
    cell.title = met ? (UNIQUE_TEXT[u.id]?.name ?? u.id) : '?';
    grid.appendChild(cell);
  }
  body.appendChild(grid);
  body.appendChild(el('p', undefined, HOLLOW_R6_TEXT.journalBest(h.best)));
  const t = h.today;
  body.appendChild(
    el(
      'p',
      'help',
      t && t.day === dailySeed(world.lastWallMs).day && t.deepest > 0
        ? HOLLOW_R6_TEXT.today(t.deepest, clockText(t.bestMs), t.finds)
        : HOLLOW_R6_TEXT.todayNone,
    ),
  );
  // R0187: the speed-run bests, a badge and nothing more.
  const recs = Object.entries(h.records ?? {});
  if (recs.length) {
    body.appendChild(el('h4', undefined, HOLLOW_R7_TEXT.journalTimes));
    for (const [key, r] of recs) {
      const [act, tier] = key.split(':');
      const name = ACT_TEXT[ACTS[Number(act)]?.id ?? '']?.name ?? act!;
      const tierName = HOLLOW_R7_TEXT.tiers[tier as 'cosy' | 'brisk' | 'wild']?.name ?? tier!;
      body.appendChild(
        el('p', 'help', HOLLOW_R7_TEXT.journalTime(name, tierName, clockText(r.bestMs))),
      );
    }
  }
}
