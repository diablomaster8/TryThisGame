/** The battle screen's sheets, Command bout gauges and results card (TECH-37), split out of battle-screen.ts. */
import { HAT_LABELS, NAMES } from '../config/strings';
import {
  BATTLE_MOVE_TEXT,
  BATTLE_SCREEN_TEXT as T,
  BATTLE_TEXT,
  combatantName,
  moveName,
  TYPE_WORDS,
} from '../config/strings-battle';
import { playSound } from '../platform/audio';
import { postcardRow } from './battle-postcard';
import {
  BATTLE_ITEMS,
  bench,
  canChoose,
  itemsLeft,
  moveOf,
  onField,
  prizeFor,
  puffCost,
  typeMult,
  type BattleAction,
  type BattleState,
  type Combatant,
} from '../sim/battle';
import { button, el } from './dom';
import { GYM } from '../config/tuning';
import { BATTLE_ATB } from '../config/tuning-battle-atb';
import { BATTLE_R5 } from '../config/tuning-battle-r5';
import { ATB_TEXT } from '../config/strings-battle-atb';
import { RING_TEXT, SPOILS_TEXT, STAT_SHORT, WHO_TEXT } from '../config/strings-battle-r5';
import { pairSeen } from '../sim/battle';
import { cooldownLeft } from '../sim/battle/atb';
import { whoChoices } from '../sim/battle/turn';
import { ATB_COMMANDS, type AtbCommand } from '../sim/battle/types';
import type { StatKey } from '../sim/types';
import { closeInspect } from './battle-inspect';
import { nubbinPortrait } from './battle-party-pick';
import { canFuse } from '../sim/battle/fusion';
import { FRIENDLY_TEXT, FUSION_TEXT } from '../config/strings-battle-r6';
import { currentReplay } from './battle-record';
import type { BattleScreen, View } from './battle-screen';

export function renderSheet(bs: BattleScreen, s: BattleState, busy: boolean): void {
  const sheet = bs.sheet;
  // Keyboard play: a rebuild must not drop focus out of the screen (FIGHT-79).
  const at = document.activeElement;
  const refocus = !at || at === document.body || at === bs.root || sheet.contains(at);
  sheet.innerHTML = '';
  fillSheet(bs, s, busy);
  if (refocus && !bs.root.hidden)
    sheet.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus({ preventScroll: true });
}

export function fillSheet(bs: BattleScreen, s: BattleState, busy: boolean): void {
  const sheet = bs.sheet;
  const sprout = s.gentle === 'sprout';
  bs.root.classList.toggle('gentle-sprout', sprout);
  if (s.result) return;
  if (s.atb) {
    atbSheet(bs, s);
    return;
  }
  if (busy) {
    sheet.appendChild(bs.big(T.tapToSkip, '', () => bs.skip(), 'bs-wide'));
    return;
  }
  if (s.passPlay?.choosing === 1) {
    secondKeeperSheet(bs, s, sheet);
    return;
  }
  const me = s.sides[0][s.active];
  if (s.phase === 'replace') {
    sheet.appendChild(el('p', 'bs-prompt', T.pickNext));
    benchButtons(bs, s, sheet);
    return;
  }
  if (!me) return;
  if (bs.logLine.textContent === T.waiting) bs.logLine.textContent = T.yourTurn(combatantName(me));
  const foe = s.sides[1].find((c) => onField(s, c));
  if (bs.view === 'swap') {
    sheet.appendChild(el('p', 'bs-prompt', T.swapTitle));
    benchButtons(bs, s, sheet);
    sheet.appendChild(bs.big(BATTLE_TEXT.cancel, '', () => setView(bs, 'main'), 'bs-wide'));
    return;
  }
  if (bs.view === 'item' || bs.view === 'target') {
    itemButtons(bs, s, me, foe, sheet);
    return;
  }
  if (bs.view === 'who' && bs.pendingMove) {
    whoButtons(bs, s, me, bs.pendingMove.id);
    return;
  }
  if (bs.view === 'ring' && bs.pendingMove) {
    ringButton(bs, s);
    return;
  }
  const g = bs.game();
  const grid = el('div', 'bs-grid');
  const best = s.gentle ? bs.bestMove(s, me) : null;
  const ids = sprout ? [best!] : ['bonk', ...me.moves].slice(0, 4);
  for (const id of ids) {
    const d = moveOf(id);
    const t = TYPE_WORDS[d.type];
    const cost = puffCost(s, me, id);
    const a = bs.act(id, d.target === 'foe' ? foe?.id : undefined);
    const ok = canChoose(s, me, a);
    // The badge only once that pairing has been seen to land (FIGHT-77); always when gentle.
    const known = !!foe && !!g && (!!s.gentle || pairSeen(g.world, d.type, foe.type));
    const eff =
      known && d.kind !== 'status' && d.kind !== 'support' ? typeMult(d.type, foe.type) : 1;
    const badge = eff > 1 ? ` ${T.matchGood}` : eff < 1 ? ` ${T.matchPoor}` : '';
    const pips = cost === 0 ? BATTLE_TEXT.cost(0) : '●'.repeat(cost);
    const tile = bs.big(moveName(id), `${t.icon} ${t.name} · ${pips}${badge}`, () =>
      bs.choose(s, me, id, foe),
    );
    if (badge) tile.dataset.eff = String(eff);
    tile.disabled = !ok;
    if (id === best) tile.classList.add('bs-glow');
    longPress(bs, tile, id);
    grid.appendChild(tile);
  }
  if (sprout) grid.appendChild(bs.big(T.hug, '🤗', () => bs.send(s, { k: 'guard' }), 'bs-hug'));
  sheet.appendChild(grid);
  if (best && foe) {
    const word = T.hintWord[moveOf(best).type] ?? '';
    sheet.appendChild(el('p', 'bs-hint', T.hint(moveName(best), word)));
  }
  if (sprout) return;
  const row = el('div', 'bs-row');
  const swap = button(T.swap, () => setView(bs, 'swap'), 'btn bs-act');
  swap.disabled = bench(s, 0).length === 0;
  const item = button(T.item, () => setView(bs, 'item'), 'btn bs-act');
  item.disabled = !BATTLE_ITEMS.some((i) => itemsLeft(s, 0, i) > 0);
  const breath = button(T.breath, () => bs.send(s, { k: 'guard' }), 'btn bs-act');
  row.append(swap, item, breath);
  // Fusion burst (FIGHT-95): shown only while the partners may fuse.
  if (canFuse(s)) {
    const fuseBtn = button(
      FUSION_TEXT.button,
      () => bs.send(s, { k: 'fuse' }),
      'btn bs-act bs-fuse',
    );
    fuseBtn.title = FUSION_TEXT.help;
    row.appendChild(fuseBtn);
  }
  sheet.appendChild(row);
}

/**
 * Pass-and-play (FIGHT-96): Keeper 2's picks, behind a cover so Keeper 1's choice and
 * Keeper 2's moves are never on screen together.
 */
export function secondKeeperSheet(bs: BattleScreen, s: BattleState, sheet: HTMLElement): void {
  const me = s.sides[1][s.active];
  if (!me) return;
  // The latch on sends is per turn; Keeper 2's pick is a second send in the same turn.
  bs.sentSig = null;
  if (!bs.passShown) {
    sheet.appendChild(el('p', 'bs-prompt', FRIENDLY_TEXT.pass));
    sheet.appendChild(
      bs.big(
        FRIENDLY_TEXT.ready,
        '',
        () => {
          bs.passShown = true;
          bs.drawnSig = '';
        },
        'bs-wide',
      ),
    );
    return;
  }
  sheet.appendChild(el('p', 'bs-prompt', FRIENDLY_TEXT.picking(combatantName(me))));
  const grid = el('div', 'bs-grid');
  const pick = (a: BattleAction) => {
    bs.passShown = false;
    bs.raw(s, a);
    bs.drawnSig = '';
  };
  grid.appendChild(bs.big(moveName('bonk'), '', () => pick({ k: 'strike' })));
  for (const id of me.moves)
    if (id !== 'bonk' && canChoose(s, me, { k: 'move', move: id }))
      grid.appendChild(bs.big(moveName(id), '', () => pick({ k: 'move', move: id })));
  sheet.appendChild(grid);
  sheet.appendChild(bs.big(T.breath, '', () => pick({ k: 'guard' }), 'bs-wide'));
}

export function setView(bs: BattleScreen, v: View): void {
  const s = bs.bout();
  const was = bs.view;
  bs.view = v;
  bs.drawnSig = '';
  // Time stops in a Command bout while the Item sheet is open (FIGHT-40).
  if (s?.atb && !s.result) {
    const items = (x: View): boolean => x === 'item' || x === 'target';
    if (items(v) !== items(was)) bs.raw(s, { k: 'pause', why: 'items', on: items(v) });
  }
  if (v === 'main') bs.pendingMove = null;
}

export function benchButtons(bs: BattleScreen, s: BattleState, box: HTMLElement): void {
  const grid = el('div', 'bs-grid');
  for (const c of bench(s, 0)) {
    const t = TYPE_WORDS[c.type];
    grid.appendChild(
      bs.big(combatantName(c), `${t.icon} ${t.name} · ${BATTLE_TEXT.hp} ${c.hp}/${c.maxHp}`, () =>
        bs.send(s, { k: 'swap', to: c.id }),
      ),
    );
  }
  box.appendChild(grid);
}

export function itemButtons(
  bs: BattleScreen,
  s: BattleState,
  me: Combatant,
  foe: Combatant | undefined,
  box: HTMLElement,
): void {
  const grid = el('div', 'bs-grid');
  if (bs.view === 'target' && bs.pendingItem) {
    const item = bs.pendingItem;
    box.appendChild(el('p', 'bs-prompt', T.onWho(T.items[item]!.name)));
    for (const to of [me, foe]) {
      if (!to) continue;
      const a: BattleAction = { k: 'item', item, target: to.id };
      const b = bs.big(combatantName(to), '', () => bs.send(s, a));
      b.disabled = !canChoose(s, me, a);
      grid.appendChild(b);
    }
  } else {
    box.appendChild(el('p', 'bs-prompt', T.itemTitle));
    for (const item of BATTLE_ITEMS) {
      const left = itemsLeft(s, 0, item);
      if (left <= 0) continue;
      const info = T.items[item]!;
      const press = (): void => {
        if (item === 'toy') bs.send(s, { k: 'item', item, ...(foe ? { target: foe.id } : {}) });
        else if (foe?.calm !== undefined) {
          bs.pendingItem = item;
          setView(bs, 'target');
        } else bs.send(s, { k: 'item', item, target: me.id });
      };
      grid.appendChild(bs.big(`${info.icon} ${info.name}`, `×${left}`, press));
    }
    if (!grid.children.length) box.appendChild(el('p', 'bs-prompt', T.noItems));
  }
  box.appendChild(grid);
  box.appendChild(bs.big(BATTLE_TEXT.cancel, '', () => setView(bs, 'main'), 'bs-wide'));
}

/** Long-press a move for its blurb. */
export function longPress(bs: BattleScreen, b: HTMLButtonElement, id: string): void {
  const show = (): void => {
    const text = BATTLE_MOVE_TEXT[id]?.blurb;
    if (text) bs.logLine.textContent = `${moveName(id)}: ${text}`;
  };
  b.addEventListener('pointerdown', () => {
    clearTimeout(bs.holdTimer);
    bs.holdTimer = window.setTimeout(show, 450);
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel'])
    b.addEventListener(ev, () => clearTimeout(bs.holdTimer));
  b.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    show();
  });
}

// ---------- doubles: "Who?" (recs FIGHT-60) ----------

export function whoButtons(bs: BattleScreen, s: BattleState, me: Combatant, id: string): void {
  const g = bs.game();
  const w = whoChoices(s, me.id, id);
  const box = bs.sheet;
  box.appendChild(el('p', 'bs-prompt', w.pick === 'ally' ? WHO_TEXT.ally : WHO_TEXT.foe));
  if (w.spread) box.appendChild(el('p', 'bs-hint', WHO_TEXT.both));
  const grid = el('div', 'bs-grid');
  const all = [...s.sides[0], ...s.sides[1]];
  for (const cid of w.ids) {
    const c = all.find((x) => x.id === cid);
    if (!c) continue;
    const t = TYPE_WORDS[c.type];
    const b = bs.big(
      combatantName(c),
      `${t.icon} ${t.name} · ❤ ${BATTLE_TEXT.hp} ${c.hp}/${c.maxHp}`,
      () => bs.aim(s, id, c.id),
      'bs-who',
    );
    if (g) {
      const n = c.nubbinId ? g.world.nubbins.find((x) => x.id === c.nubbinId) : undefined;
      b.prepend(nubbinPortrait(g, n ?? c.species));
    }
    b.disabled = !canChoose(s, me, bs.act(id, c.id));
    grid.appendChild(b);
  }
  box.appendChild(grid);
  box.appendChild(bs.big(BATTLE_TEXT.cancel, '', () => setView(bs, 'main'), 'bs-wide'));
}

// ---------- the timing ring (recs FIGHT-87) ----------

/** Where the dot is, 0..1, sweeping back and forth like the gym's bar. */
export function ringPos(bs: BattleScreen, now: number): number {
  const t = ((now - bs.ringAt) % (GYM.sweepMs * 2)) / GYM.sweepMs;
  return t <= 1 ? t : 2 - t;
}

export function ringButton(bs: BattleScreen, s: BattleState): void {
  const b = bs.big(RING_TEXT.tap, '', () => ringTap(bs, s), 'bs-wide bs-ring');
  b.setAttribute('aria-label', `${RING_TEXT.label}: ${RING_TEXT.tap}`);
  const zone = el('i', 'bs-ring-zone');
  zone.style.left = `${(0.5 - GYM.zone / 2) * 100}%`;
  zone.style.width = `${GYM.zone * 100}%`;
  b.append(zone, el('i', 'bs-ring-dot'));
  bs.sheet.appendChild(b);
}

export function ringTap(bs: BattleScreen, s: BattleState): void {
  const p = bs.pendingMove;
  if (!p) return;
  const pos = ringPos(bs, performance.now());
  const sweet = Math.abs(pos - 0.5) <= GYM.zone / 2;
  bs.send(s, bs.act(p.id, p.target, sweet ? 'sweet' : 'plain'));
}

export function drawRing(bs: BattleScreen, s: BattleState, now: number): void {
  const p = bs.pendingMove;
  if (!p) return;
  // No tap in time is a plain hit, never a penalty.
  if (now - bs.ringAt > BATTLE_R5.ringTimeoutMs) {
    bs.send(s, bs.act(p.id, p.target, 'plain'));
    return;
  }
  const dot = bs.sheet.querySelector<HTMLElement>('.bs-ring-dot');
  if (dot) dot.style.left = `${(ringPos(bs, now) * 100).toFixed(1)}%`;
}

// ---------- the Command bout (recs FIGHT-40, FIGHT-41) ----------

export function atbSheet(bs: BattleScreen, s: BattleState): void {
  const box = bs.sheet;
  const me = s.sides[0].find((c) => onField(s, c)) ?? s.sides[0][0];
  const foe = s.sides[1].find((c) => onField(s, c));
  if (bs.view === 'item' || bs.view === 'target') {
    if (me) itemButtons(bs, s, me, foe, box);
    return;
  }
  bs.gauges.clear();
  bs.orderBtns.clear();
  const list = el('div', 'bs-gauges');
  for (const c of [...s.sides[0], ...s.sides[1]]) {
    if (!onField(s, c)) continue;
    const row = el('div', `bs-gauge ${c.side === 0 ? 'ally' : 'foe'}`);
    const name = combatantName(c);
    const bar = el('div', 'bs-gauge-bar');
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-label', name);
    const fill = el('span');
    bar.appendChild(fill);
    const num = el('small', 'bs-gauge-num');
    row.append(el('span', 'bs-gauge-name', name), bar, num);
    list.appendChild(row);
    bs.gauges.set(c.id, { fill, num, name });
  }
  box.appendChild(list);
  const grid = el('div', 'bs-grid bs-orders');
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', ATB_TEXT.ordersLabel);
  for (const cmd of ATB_COMMANDS) {
    const o = ATB_TEXT.orders[cmd];
    const b = bs.big(`${o.icon} ${o.name}`, '', () => order(bs, cmd), 'bs-order');
    b.appendChild(el('i', 'bs-cd'));
    grid.appendChild(b);
    bs.orderBtns.set(cmd, b);
  }
  box.appendChild(grid);
  const row = el('div', 'bs-row');
  const item = button(T.item, () => setView(bs, 'item'), 'btn bs-act');
  item.disabled = !BATTLE_ITEMS.some((i) => itemsLeft(s, 0, i) > 0);
  row.appendChild(item);
  box.appendChild(row);
  updateAtb(bs, s);
}

export function order(bs: BattleScreen, cmd: AtbCommand): void {
  const s = bs.bout();
  if (!s?.atb || s.result || cooldownLeft(s, cmd) > 0) return;
  bs.raw(s, { k: 'order', cmd });
}

/** Gauges and cooldown rings follow the sim every frame. */
export function updateAtb(bs: BattleScreen, s: BattleState): void {
  const t = s.atb;
  if (!t) return;
  for (const [id, g] of bs.gauges) {
    const v = Math.max(0, Math.min(100, t.gauge[id] ?? 0));
    g.fill.style.width = `${v}%`;
    g.fill.parentElement?.setAttribute('aria-valuenow', String(Math.round(v)));
    g.num.textContent = `${Math.round(v)}%`;
  }
  const benchEmpty = bench(s, 0).length === 0;
  for (const [cmd, b] of bs.orderBtns) {
    const left = cooldownLeft(s, cmd);
    const share = Math.min(1, left / BATTLE_ATB.cooldownMs);
    b.style.setProperty('--cd', share.toFixed(3));
    const off = left > 0 || !!s.result || (cmd === 'back' && benchEmpty);
    if (b.disabled !== off) b.disabled = off;
    const small = left > 0 ? ATB_TEXT.wait(left / 1000) : ATB_TEXT.ready;
    const sub = b.querySelector('small') ?? b.appendChild(el('small'));
    if (sub.textContent !== small) sub.textContent = small;
  }
}

// ---------- results ----------

export function showResults(bs: BattleScreen, s: BattleState): void {
  closeInspect();
  const r = s.result!;
  const box = bs.results;
  box.innerHTML = '';
  const card = el('div', 'bs-results-card');
  const title =
    r.reason === 'hug'
      ? T.hugged
      : r.reason === 'friends'
        ? T.friends
        : r.winner === 0
          ? T.won
          : r.winner === 1
            ? T.lost
            : T.draw;
  card.appendChild(el('h2', undefined, T.results));
  card.appendChild(el('p', 'celebrate-form', title));
  // The sim's own account of the bout (FIGHT-74) when it has one, else the prize table.
  const sp = s.spoils;
  // A story-world bout pays nothing in the Grove (FIGHT-98).
  const shells =
    s.context.kind === 'world' ? 0 : sp ? sp.shells : prizeFor(s.context, r, !!s.gentle);
  if (shells > 0) card.appendChild(el('p', undefined, BATTLE_TEXT.prize(shells, NAMES.currency)));
  if (sp) spoilLines(bs, s, sp.gained, card);
  if (sp?.hat) card.appendChild(el('p', undefined, SPOILS_TEXT.hat(HAT_LABELS[sp.hat] ?? sp.hat)));
  if (sp?.cards.length) card.appendChild(el('p', undefined, SPOILS_TEXT.cards(sp.cards.length)));
  for (const f of s.sides[1]) {
    if (f.friend) card.appendChild(el('p', undefined, T.newFriend(combatantName(f))));
    else if (f.calm !== undefined)
      card.appendChild(el('p', undefined, T.calmed(combatantName(f), f.calm)));
  }
  // FIGHT-100: the funniest moment as a postcard, and the bout's replay code.
  if (s.mode === 'turn') card.appendChild(postcardRow(s, currentReplay()));
  card.appendChild(button(T.backToGrove, () => bs.close(), 'btn btn-primary bs-big'));
  box.appendChild(card);
  box.hidden = false;
  playSound(r.winner === 0 ? 'win' : 'sad');
  if (bs.root.contains(document.activeElement) || document.activeElement === document.body)
    card.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
}

/** "Nono: +12 Power, +4 Stamina" for each Nubbin that gained points. */
export function spoilLines(
  bs: BattleScreen,
  s: BattleState,
  gained: Record<string, Partial<Record<StatKey, number>>>,
  card: HTMLElement,
): void {
  const g = bs.game();
  for (const [id, stats] of Object.entries(gained)) {
    const list = (Object.keys(stats) as StatKey[])
      .filter((k) => (stats[k] ?? 0) > 0)
      .map((k) => SPOILS_TEXT.stat(STAT_SHORT[k], stats[k]!));
    if (!list.length) continue;
    const ally = s.sides[0].find((c) => c.nubbinId === id);
    const name = ally
      ? combatantName(ally)
      : (g?.world.nubbins.find((n) => n.id === id)?.name ?? id);
    card.appendChild(el('p', 'bs-spoils', SPOILS_TEXT.points(name, list.join(', '))));
  }
}
