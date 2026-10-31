import { worldControls, worldLine } from './world-debug';
import { behaviourHistogram, resetBehaviourHistogram } from './behaviour-histogram';
import { debugIdleOdds } from '../sim/behavior';
import { confirmModal } from './confirm';
import { CAMP_TEXT, FAST_TIME_TEXT, QUALITY_TEXT } from '../config/strings';
import { FRAME_LOG, SIM } from '../config/tuning';
import { STAT_LABELS, TYPE_LABELS, UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { clearSave } from '../platform/storage';
import { NUBBIN_TYPES, STAT_KEYS } from '../sim/types';
import { freshWorldLike } from '../sim/fresh-start';
import { button, el } from './dom';
import { StageInspector } from './stage-inspector';
import { MOVE_TEXT } from '../config/strings-move';
import { DEBUG_OVERLAY } from '../render/debug-colliders';
import { TACTICS_TEXT } from '../config/strings-tactics';
import { COMIC_SOUNDS, playSound } from '../platform/audio';
import { battleDebugControls } from './battle-debug';

/**
 * Debug panel (backtick or triple-tap the logo): time speed, give items, force
 * evolve / end of life, hidden values of the selected Nubbin, reset save.
 */
export class DebugPanel {
  readonly root: HTMLDivElement;
  private readonly values: HTMLPreElement;
  private readonly speedButtons: HTMLButtonElement[] = [];
  /** K48: the stage inspector, toggled from the Story row. */
  private readonly inspector: StageInspector;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly selected: () => string | null,
  ) {
    this.root = el('div', 'debug');
    this.root.hidden = true;
    this.root.appendChild(el('h2', undefined, UI_TEXT.debugTitle));

    const speed = el('div', 'debug-row');
    speed.appendChild(el('span', undefined, UI_TEXT.debugSpeed));
    for (const s of SIM.timeScales) {
      const b = button(
        `×${s}`,
        () => {
          this.game()?.setTimeScale(s);
          this.syncSpeed();
        },
        'btn btn-small',
      );
      this.speedButtons.push(b);
      speed.appendChild(b);
    }
    this.root.appendChild(speed);

    const give = el('div', 'debug-row');
    give.appendChild(el('span', undefined, UI_TEXT.debugGive));
    give.append(
      button(
        '+100 Shells',
        () => this.game()?.send({ kind: 'debugGive', what: 'shells', amount: 100 }),
        'btn btn-small',
      ),
      button(
        '+5 fruit',
        () => this.game()?.send({ kind: 'debugGive', what: 'fruit', amount: 5 }),
        'btn btn-small',
      ),
      button(
        '+3 critters',
        () => this.game()?.send({ kind: 'debugGive', what: 'critter', amount: 3 }),
        'btn btn-small',
      ),
      button(
        '+3 essences',
        () => this.game()?.send({ kind: 'debugGive', what: 'essence', amount: 3 }),
        'btn btn-small',
      ),
      button(
        'Fill roster (eggs)',
        () => this.game()?.send({ kind: 'debugGive', what: 'egg', amount: 8 }),
        'btn btn-small',
      ),
    );
    this.root.appendChild(give);

    const time = el('div', 'debug-row');
    time.appendChild(el('span', undefined, 'Time'));
    for (const [label, hour] of [
      ['auto', null],
      ['dawn', 7],
      ['day', 12],
      ['dusk', 19],
      ['night', 23],
    ] as const) {
      time.appendChild(
        button(
          label,
          () => {
            const g = this.game();
            if (!g) return;
            g.hourOverride = hour;
            g['lastDaylightMs'] = -Infinity;
          },
          'btn btn-small',
        ),
      );
    }
    this.root.appendChild(time);

    const story = el('div', 'debug-row');
    story.appendChild(el('span', undefined, 'Story'));
    story.appendChild(
      button('Start', () => this.game()?.send({ kind: 'campaignStart' }), 'btn btn-small'),
    );
    for (let ch = 1; ch <= 12; ch++) {
      const jump = button(
        `Ch ${ch}`,
        () => this.game()?.send({ kind: 'debugChapter', chapter: ch }),
        'btn btn-small',
      );
      jump.title = `Jump to chapter ${ch}`;
      story.appendChild(jump);
    }
    story.appendChild(
      button(
        'Trust -40',
        () => {
          const g = this.game();
          const id = this.selected();
          const n = id ? g?.world.nubbins.find((x) => x.id === id) : undefined;
          if (n) n.trust = Math.max(0, n.trust - 40);
        },
        'btn btn-small',
      ),
    );
    this.root.appendChild(story);

    // Lane C r7 (R0644): questlines beside Hazel's Grove: start one, jump it, leave it.
    const lines = el('div', 'debug-row');
    lines.appendChild(el('span', undefined, 'Lines'));
    const pick = el('select');
    pick.setAttribute('aria-label', 'Line');
    for (const id of ['hundred', 'logged', 'beetle', 'dawn', 'dusk'])
      pick.appendChild(Object.assign(el('option', undefined, id), { value: id }));
    const lineCh = Object.assign(el('input'), { type: 'number', min: '1', max: '10', value: '1' });
    lineCh.setAttribute('aria-label', 'Line chapter');
    lineCh.style.width = '3.5em';
    lines.append(pick, lineCh);
    lines.appendChild(
      button(
        'Start',
        () => this.game()?.send({ kind: 'storylineStart', id: pick.value }),
        'btn btn-small',
      ),
    );
    lines.appendChild(
      button(
        'Jump',
        () =>
          this.game()?.send({
            kind: 'debugChapter',
            chapter: Number(lineCh.value),
            line: pick.value,
          }),
        'btn btn-small',
      ),
    );
    lines.appendChild(
      button(
        'Leave',
        () => this.game()?.send({ kind: 'lineAbandon', line: pick.value }),
        'btn btn-small',
      ),
    );
    this.root.appendChild(lines);

    // Lane C r8 (R0644): the Open quest flow: switch flows, offer any quest, answer it.
    const offers = el('div', 'debug-row');
    offers.appendChild(el('span', undefined, 'Offers'));
    const questId = Object.assign(el('input'), { type: 'text', value: 'q01' });
    questId.setAttribute('aria-label', 'Quest id');
    questId.style.width = '4.5em';
    offers.appendChild(questId);
    const flow = (f: 'open' | 'guided') => () => {
      const g = this.game();
      if (g) g.send({ kind: 'setSettings', settings: { ...g.world.settings, questFlow: f } });
    };
    offers.append(
      button('Open', flow('open'), 'btn btn-small'),
      button('Guided', flow('guided'), 'btn btn-small'),
      button(
        'Offer',
        () => this.game()?.send({ kind: 'debugQuestOffer', id: questId.value.trim() }),
        'btn btn-small',
      ),
      button(
        'Accept',
        () => this.game()?.send({ kind: 'questAccept', id: questId.value.trim() }),
        'btn btn-small',
      ),
      button(
        'Not now',
        () => this.game()?.send({ kind: 'questDecline', id: questId.value.trim() }),
        'btn btn-small',
      ),
    );
    this.root.appendChild(offers);

    const force = el('div', 'debug-row');
    force.append(
      button(
        UI_TEXT.debugHatchNow,
        () => this.withSelected((id) => ({ kind: 'debugHatchNow', nubbinId: id })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.debugFillNeeds,
        () => this.withSelected((id) => ({ kind: 'debugFillNeeds', nubbinId: id })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.debugForceEvolve,
        () => this.withSelected((id) => ({ kind: 'debugForceEvolve', nubbinId: id })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.debugForceEnd,
        () => this.withSelected((id) => ({ kind: 'debugForceEndOfLife', nubbinId: id })),
        'btn btn-small',
      ),
    );
    this.root.appendChild(force);

    // Lane C: the grid-tactics rumble room (recs FIGHT-65); the screen loads on demand.
    const rumble = el('div', 'debug-row');
    rumble.appendChild(
      button(
        TACTICS_TEXT.start,
        () => void import('./tactics-screen').then((m) => m.startTacticsDebug(parent, game)),
        'btn btn-small',
      ),
    );
    this.root.appendChild(rumble);

    // Lane C round 5: Debug → Battle (recs FIGHT-80), a collapsed block of its own.
    this.root.appendChild(battleDebugControls(parent, game));

    // MOVE-38: collision overlays, drawn by whichever renderer is on.
    const overlays = el('div', 'debug-row');
    for (const key of ['colliders', 'nav', 'groundY'] as const) {
      const row = el('label', 'check-row');
      const box = el('input');
      box.type = 'checkbox';
      box.checked = DEBUG_OVERLAY[key];
      box.addEventListener('change', () => {
        DEBUG_OVERLAY[key] = box.checked;
      });
      row.append(box, el('span', undefined, MOVE_TEXT.debugOverlay[key]));
      overlays.appendChild(row);
    }
    this.root.appendChild(overlays);

    this.root.appendChild(worldControls(game));

    // R0301: the comic sound palette, one button each, for an ear test.
    const comic = el('div', 'debug-row');
    for (const name of COMIC_SOUNDS)
      comic.appendChild(button(name, () => playSound(name), 'btn btn-small'));
    this.root.appendChild(comic);

    this.values = el('pre', 'debug-values');
    this.root.appendChild(this.values);
    // R0553 (lane A r7): start the behaviour histogram afresh.
    this.root.appendChild(
      button('Reset behaviour histogram', () => resetBehaviourHistogram(), 'btn btn-small'),
    );
    this.inspector = new StageInspector(this.root, game);
    story.appendChild(button('Stage inspector', () => this.inspector.toggle(), 'btn btn-small'));

    this.root.appendChild(
      button(
        UI_TEXT.debugReset,
        () => {
          const g = this.game();
          if (!g) return;
          const ask = { title: CAMP_TEXT.confirmTitle, body: UI_TEXT.resetConfirm };
          void confirmModal({ ...ask, confirm: CAMP_TEXT.resetYes, danger: true }).then((ok) => {
            if (!ok) return;
            clearSave();
            g.replaceWorld(freshWorldLike(g.world, Date.now()));
          });
        },
        'btn btn-small btn-danger',
      ),
    );

    parent.appendChild(this.root);
    this.syncSpeed();
  }

  toggle(): void {
    this.root.hidden = !this.root.hidden;
    if (!this.root.hidden) this.refresh();
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  refresh(): void {
    this.syncSpeed();
    if (this.root.hidden) return;
    const g = this.game();
    const id = this.selected();
    if (!g) return;
    const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
    if (!n) {
      this.values.textContent = `${UI_TEXT.debugNoSelection}\n${frameLine(g)}`;
      return;
    }
    const lines = [
      `${n.name} (${n.id}) ${n.stage} ${n.behavior.state}`,
      `alignment ${n.alignment.toFixed(3)}  happiness ${n.needs.happiness.toFixed(1)}  affection ${n.needs.affection.toFixed(1)}`,
      `hunger ${n.needs.hunger.toFixed(2)}  energy ${n.needs.energy.toFixed(2)}  stageMs ${Math.round(n.stageMs)}`,
      `lean ${NUBBIN_TYPES.map((t) => `${TYPE_LABELS[t]} ${n.typeLean[t].toFixed(0)}`).join('  ')}`,
      ...STAT_KEYS.map(
        (k) => `${STAT_LABELS[k]} ${n.stats[k].points.toFixed(1)} pts (${n.stats[k].grade})`,
      ),
      `sim t ${Math.round(g.world.timeMs / 1000)} s  rng ${g.world.rngState}`,
      frameLine(g),
    ];
    // R0553 (lane A r7): what this Nubbin has been doing over the last 5 sim minutes.
    lines.splice(-2, 0, behaviourHistogram(g.world, n));
    // R0524 (lane A r7): the live odds of the everyday idle pick for this Nubbin.
    const odds = debugIdleOdds(g.world, n);
    lines.splice(
      -2,
      0,
      `idle ${Object.entries(odds)
        .map(([k, v]) => `${k} ${Math.round(v * 100)}%`)
        .join('  ')}`,
    );
    this.values.textContent = lines.join('\n');
  }

  private withSelected(make: (id: string) => Parameters<Game['send']>[0]): void {
    const g = this.game();
    const id = this.selected();
    if (!g || !id) return;
    g.send(make(id));
  }

  private syncSpeed(): void {
    const g = this.game();
    const scale = g?.clock.timeScale ?? 1;
    this.speedButtons.forEach((b, i) => {
      const s = SIM.timeScales[i];
      b.classList.toggle('active', s === scale);
      // TECH-54: the active speed says when the steps cannot keep up with it.
      const text = s === scale && g?.simBehind && s > 1 ? FAST_TIME_TEXT.behind(s) : `×${s}`;
      if (b.textContent !== text) b.textContent = text;
    });
  }
}

/**
 * Draw calls and triangles for the whole last frame (every pass), the pixel renderer's
 * sprite count, and the frame size. Full 3D has no sprite batch, so it shows the Nubbins
 * instead of a misleading 0 (review C, item 19).
 */
function frameLine(g: Game): string {
  const r = g.pipeline.renderer.info.render;
  const size = g.pipeline.currentSize;
  const things = g.scene3d ? `nubbins ${g.world.nubbins.length}` : `sprites ${g.view.batch.drawn}`;
  return (
    `draw calls ${r.calls}  triangles ${r.triangles}  ${things}  frame ${size.width}×${size.height} ×${size.scale}` +
    `\n${worldLine(g)}` +
    hollowLine(g) +
    spikeLine(g) +
    tierLine(g)
  );
}

/** TECH-09: the device tier and the signal that decided it. */
function tierLine(g: Game): string {
  return `
${QUALITY_TEXT.debug(QUALITY_TEXT.tier[g.tier.tier], g.tier.why)}`;
}

/** HOT-2: frame times over the last minute or so, and what the longest frame spent them on. */
function spikeLine(g: Game): string {
  const s = g.spikes.summary();
  const top = g.spikes.spikes[0];
  const why = top
    ? Object.entries(top.sections)
        .filter(([, ms]) => ms >= 1)
        .map(([k, ms]) => `${k} ${Math.round(ms)}`)
        .concat(`outside ${Math.round(top.outsideMs)}`)
        // TECH-31: what the sections hid: sheet bakes inside `update`, the HUD refresh outside.
        .concat(top.work.bakes ? [`bakes ${top.work.bakes}/${Math.round(top.work.bakeMs)}`] : [])
        .concat(top.work.hudMs >= 1 ? [`hud ${Math.round(top.work.hudMs)}`] : [])
        .concat(top.steps ? [`steps ${top.steps}`] : [])
        .join(' ')
    : '';
  const a = g.view.batch.atlas;
  const atlas = g.scene3d ? '' : `  atlas pages ${a.pagesOpen} repacks ${a.generation}`;
  return (
    `\nframes p95 ${s.p95.toFixed(1)} ms  worst ${s.worst.toFixed(0)} ms  long ${s.long}${atlas}` +
    (why ? `\nlongest: ${why}` : '') +
    recentLine(g)
  );
}

/** TECH-31: the last ten seconds as a frame-time histogram: p50, p95 and p99. */
function recentLine(g: Game): string {
  const r = g.spikes.summary(FRAME_LOG.windowMs);
  const f = (ms: number) => ms.toFixed(1);
  return `\nlast ${FRAME_LOG.windowMs / 1000} s: p50 ${f(r.p50)}  p95 ${f(r.p95)}  p99 ${f(r.p99)} ms  long ${r.long}`;
}

/** Lane B round 6 (R0211): the Hollow's rolling tuning numbers, underground only. */
function hollowLine(g: Game): string {
  const s = g.world.hollow.stats;
  if (!s || g.world.location !== 'dungeon') return '';
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const picks = Object.entries(s.pickups)
    .map(([k, v]) => `${k} ${v}`)
    .join(' ');
  return (
    `\nhollow: level ${Math.round(avg(s.levelMs) / 1000)} s  fights ${avg(s.fights).toFixed(1)}` +
    `  losses ${s.losses}  portals ${s.portals}  sack ${g.world.dungeon?.sack?.length ?? 0}` +
    `\npickups ${picks}`
  );
}
