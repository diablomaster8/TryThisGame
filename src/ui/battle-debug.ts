import { BATTLE_DEBUG_TEXT as T } from '../config/strings-battle-r5';
import { BATTLE_R5 } from '../config/tuning-battle-r5';
import type { Game } from '../game';
import {
  battleAct,
  bestAllyAction,
  CIRCUIT_TIERS,
  createBattle,
  replay,
  STATUS_IDS,
  type BattleAction,
  type BattleContext,
  type BattleState,
} from '../sim/battle';
import { replayAtb } from '../sim/battle/atb';
import { battleScreen } from './battle-screen';
import { currentReplay, recordAct, type BoutReplay } from './battle-record';
import { button, el } from './dom';

/**
 * Debug → Battle (recs FIGHT-80): start any kind of bout (through the pre-bout sheet like any
 * other), set a combatant's HP, give or clear a status, force a win or a loss, watch the hidden
 * values (round, phase, seed, rngState, ATB gauges and clock, Calm), simulate 100 bouts of the
 * current kind with the plain-best-move autoplay for a win rate, and copy or paste a replay
 * JSON (the start and every action) to check that the same log comes back. The changes go to
 * the sim as `{k:'debug'}` battle actions, so a copied replay repeats them too.
 */
export function battleDebugControls(parent: HTMLElement, game: () => Game | null): HTMLElement {
  const box = el('details', 'debug-row debug-battle');
  box.appendChild(el('summary', undefined, T.title));
  const party = (g: Game): string[] => {
    const ready = g.world.nubbins.filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon');
    const last = (g.world.battlePrefs?.party ?? []).filter((id) => ready.some((n) => n.id === id));
    return (last.length ? last : ready.map((n) => n.id)).slice(0, 3);
  };
  const contexts: [string, (g: Game) => BattleContext][] = [
    ['Dojo T1', (g) => ({ kind: 'dojo', tier: 1, ids: party(g) })],
    ['Dojo doubles', (g) => ({ kind: 'dojo', tier: 1, ids: party(g), doubles: true })],
    ['Dojo Command', (g) => ({ kind: 'dojo', tier: 1, ids: party(g), mode: 'atb' })],
    ['Story', (g) => ({ kind: 'story', storyline: 'logged', tier: 1, ids: party(g) })],
    [
      'Circuit',
      (g) => ({ kind: 'circuit', trainer: CIRCUIT_TIERS[0]![0]!, tier: 1, ids: party(g) }),
    ],
    [
      'Wild',
      (g) => ({
        kind: 'encounter',
        tier: 1,
        ids: party(g),
        source: 'debug',
        key: 'wild',
        foes: [{ species: 'chao', level: 5, wild: true }],
        singles: true,
      }),
    ],
  ];
  const starts = el('div', 'debug-row');
  starts.appendChild(el('span', undefined, T.start));
  for (const [label, make] of contexts)
    starts.appendChild(
      button(
        label,
        () => {
          const g = game();
          if (g) battleScreen(parent, game).start(make(g));
        },
        'btn btn-small',
      ),
    );
  box.appendChild(starts);

  // Edit the live bout.
  const edit = el('div', 'debug-row');
  const who = el('select');
  who.setAttribute('aria-label', 'Combatant');
  const hp = el('input');
  hp.type = 'number';
  hp.min = '0';
  hp.style.width = '5em';
  hp.setAttribute('aria-label', T.hp);
  const status = el('select');
  status.setAttribute('aria-label', T.status);
  for (const id of STATUS_IDS) {
    const o = el('option', undefined, id);
    o.value = id;
    status.appendChild(o);
  }
  const act = (a: BattleAction): void => {
    const g = game();
    const s = g?.world.battle;
    if (!g || !s || s.result) return;
    recordAct(s, a);
    g.send({ kind: 'battleAct', action: a });
  };
  edit.append(
    who,
    hp,
    button(
      T.hp,
      () => act({ k: 'debug', set: { op: 'hp', who: who.value, hp: Number(hp.value) } }),
      'btn btn-small',
    ),
    status,
    button(
      T.status,
      () =>
        act({
          k: 'debug',
          set: { op: 'status', who: who.value, id: status.value as (typeof STATUS_IDS)[number] },
        }),
      'btn btn-small',
    ),
    button(
      T.clear,
      () => act({ k: 'debug', set: { op: 'status', who: who.value, id: null } }),
      'btn btn-small',
    ),
    button(T.win, () => act({ k: 'debug', set: { op: 'win' } }), 'btn btn-small'),
    button(T.lose, () => act({ k: 'debug', set: { op: 'lose' } }), 'btn btn-small'),
  );
  box.appendChild(edit);

  // Hidden values, refreshed while the panel shows.
  const values = el('pre', 'debug-values');
  box.appendChild(values);
  let whoSig = '';
  const refresh = (): void => {
    if (!box.isConnected || !box.open || box.offsetParent === null) return;
    const s = game()?.world.battle;
    if (!s) {
      values.textContent = T.noBout;
      return;
    }
    const all = [...s.sides[0], ...s.sides[1]];
    const sig = all.map((c) => c.id).join();
    if (sig !== whoSig) {
      whoSig = sig;
      who.innerHTML = '';
      for (const c of all) {
        const o = el('option', undefined, `${c.side ? 'foe' : 'ally'} ${c.id}`);
        o.value = c.id;
        who.appendChild(o);
      }
    }
    const lines = [
      `${s.context.kind} tier ${s.context.tier} turn ${s.turn} phase ${s.phase} ai ${s.ai ?? '-'} gentle ${s.gentle ?? '-'}`,
      `seed ${s.seed} rngState ${s.rngState} log ${s.log.length} result ${s.result ? JSON.stringify(s.result) : '-'}`,
      ...all.map(
        (c) =>
          `${c.side ? 'F' : 'A'} ${c.id} hp ${c.hp}/${c.maxHp} puff ${c.puff} ${c.major?.id ?? ''}` +
          `${c.calm !== undefined ? ` calm ${c.calm}` : ''}` +
          `${s.atb ? ` gauge ${(s.atb.gauge[c.id] ?? 0).toFixed(1)}` : ''}`,
      ),
      ...(s.atb
        ? [`atb t ${s.atb.timeMs} acc ${s.atb.accMs} paused ${JSON.stringify(s.atb.paused ?? {})}`]
        : []),
    ];
    values.textContent = lines.join('\n');
  };
  window.setInterval(refresh, 500);
  box.addEventListener('toggle', refresh);

  // Simulate bouts of the live kind (or Dojo T1) for a win rate.
  const sim = el('div', 'debug-row');
  const rate = el('span');
  sim.append(
    button(
      T.simulate,
      () => {
        const g = game();
        if (!g) return;
        const t0 = performance.now();
        const live = g.world.battle?.context;
        const base: BattleContext =
          live && live.kind !== 'karate' ? live : { kind: 'dojo', tier: 1, ids: party(g) };
        // Turn-based for the autoplay: the Command clock needs live steps.
        const ctx = { ...base };
        delete ctx.mode;
        delete ctx.auto;
        let won = 0;
        let n = 0;
        for (let i = 1; i <= BATTLE_R5.simBouts; i++) {
          const s = createBattle(g.world, ctx, i * 7919);
          if (!s) break;
          n += 1;
          for (let k = 0; k < BATTLE_R5.simMaxActions && !s.result; k++)
            if (!battleAct(s, bestAllyAction(s))) battleAct(s, { k: 'guard' });
          if (s.result?.winner === 0) won += 1;
        }
        rate.textContent = T.winRate(won, n, performance.now() - t0);
      },
      'btn btn-small',
    ),
    rate,
  );
  box.appendChild(sim);

  // Copy and paste replays.
  const io = el('textarea');
  io.rows = 3;
  io.placeholder = T.paste;
  io.setAttribute('aria-label', T.paste);
  io.style.width = '100%';
  const said = el('span');
  box.append(
    io,
    button(
      T.copy,
      () => {
        const r = currentReplay();
        if (!r) {
          said.textContent = T.noBout;
          return;
        }
        io.value = JSON.stringify(r);
        try {
          void navigator.clipboard?.writeText(io.value).catch(() => undefined);
        } catch {
          // The text box has it anyway.
        }
        said.textContent = T.copied;
      },
      'btn btn-small',
    ),
    button(T.run, () => (said.textContent = replayCheck(io.value, game)), 'btn btn-small'),
    said,
  );
  return box;
}

/** Replays a pasted JSON and compares its log with the live bout's (or reports its length). */
export function replayCheck(json: string, game: () => Game | null): string {
  let r: BoutReplay;
  try {
    r = JSON.parse(json) as BoutReplay;
    if (!r || typeof r.seed !== 'number' || !r.start || !Array.isArray(r.actions)) return T.bad;
  } catch {
    return T.bad;
  }
  const live = game()?.world.battle;
  const out: BattleState = r.start.atb
    ? replayAtb(
        r.start,
        r.actions,
        live?.seed === r.seed ? (live.atb?.timeMs ?? 0) : 600_000,
        battleAct,
      )
    : replay(
        r.start,
        r.actions.map((x) => x.a),
      );
  if (!live || live.seed !== r.seed) return T.replayed(out.log.length);
  const a = out.log.map((e) => JSON.stringify(e));
  const b = live.log.map((e) => JSON.stringify(e));
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return T.differs(i);
  return a.length === b.length ? T.same(n) : T.differs(n);
}
