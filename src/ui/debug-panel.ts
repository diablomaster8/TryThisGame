import { worldControls, worldLine } from './world-debug';
import { SIM } from '../config/tuning';
import { STAT_LABELS, TYPE_LABELS, UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { clearSave } from '../platform/storage';
import { NUBBIN_TYPES, STAT_KEYS } from '../sim/types';
import { freshWorldLike } from '../sim/fresh-start';
import { button, el } from './dom';
import { StageInspector } from './stage-inspector';
import { MOVE_TEXT } from '../config/strings-move';
import { DEBUG_OVERLAY } from '../render/debug-colliders';
import { COMIC_SOUNDS, playSound } from '../platform/audio';

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
    this.inspector = new StageInspector(this.root, game);
    story.appendChild(button('Stage inspector', () => this.inspector.toggle(), 'btn btn-small'));

    this.root.appendChild(
      button(
        UI_TEXT.debugReset,
        () => {
          const g = this.game();
          if (!g || !window.confirm(UI_TEXT.resetConfirm)) return;
          clearSave();
          g.replaceWorld(freshWorldLike(g.world, Date.now()));
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
    this.values.textContent = lines.join('\n');
  }

  private withSelected(make: (id: string) => Parameters<Game['send']>[0]): void {
    const g = this.game();
    const id = this.selected();
    if (!g || !id) return;
    g.send(make(id));
  }

  private syncSpeed(): void {
    const scale = this.game()?.clock.timeScale ?? 1;
    this.speedButtons.forEach((b, i) => b.classList.toggle('active', SIM.timeScales[i] === scale));
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
    `\n${worldLine(g)}`
  );
}
