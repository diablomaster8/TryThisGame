/**
 * R0690: the Glow Cave's floor puzzle for a sprout. When a glow run reaches a floor whose
 * puzzle is unsolved, a big card asks it: tap the 4 red gems among other colours, or match
 * the shape on the door from three pictures. A wrong tap only wobbles; nothing is lost. The
 * card says its prompt aloud, and a right answer sends `glowSolve` (the sim opens the way).
 * UI only: it reads the run and sends one command.
 */
import { GLOW_CAVE_TEXT as T } from '../config/strings-kid-games';
import type { Game } from '../game';
import { glowPuzzle, glowSolved, type GlowShape } from '../sim/dungeon-glow';
import { Rng } from '../sim/rng';
import { button, el, modal } from './dom';
import { speakLine } from './lesson';

const SHAPE_ICON: Record<GlowShape, string> = {
  circle: '⚫',
  square: '⬛',
  triangle: '🔺',
  star: '⭐',
};
const GEM_COLOURS = ['🔴', '🔵', '🟢', '🟡', '🟣'] as const;

export class GlowCave {
  private readonly dialog;
  private shownDepth = -1;
  private readonly chip: HTMLButtonElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, T.title, '✕');
    this.dialog.root.classList.add('glow-cave');
    this.chip = button('💎', () => this.show(), 'btn btn-icon glow-chip');
    this.chip.setAttribute('aria-label', T.gemsPrompt);
    this.chip.hidden = true;
    parent.appendChild(this.chip);
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  /** Called every frame: opens the card once per new floor, and keeps the chip while unsolved. */
  refresh(): void {
    const g = this.game();
    const run = g?.world.location === 'dungeon' ? g.world.dungeon : null;
    const open = !!run?.glow && !glowSolved(run);
    this.chip.hidden = !open;
    if (!run?.glow) {
      this.shownDepth = -1;
      if (this.dialog.isOpen()) this.dialog.hide();
      return;
    }
    if (!open) {
      if (this.dialog.isOpen()) this.dialog.hide();
      return;
    }
    if (this.shownDepth !== run.depth && !run.encounter) {
      this.shownDepth = run.depth;
      this.show(run.depth === 1);
    }
  }

  private show(intro = false): void {
    const g = this.game();
    const run = g?.world.dungeon;
    if (!g || !run?.glow) return;
    const puzzle = glowPuzzle(run.seed, run.depth);
    const depth = run.depth;
    const body = this.dialog.body;
    body.textContent = '';
    body.appendChild(el('p', 'edu-prompt', T.floor(depth)));
    const say = (t: string) => {
      if (g.world.edu?.readAloud) speakLine(t);
    };
    const solve = () => {
      g.send({ kind: 'glowSolve', depth });
      body.textContent = '';
      const done = puzzle.kind === 'gems' ? T.gemsDone : T.shapeDone;
      body.appendChild(el('p', 'edu-prompt', `🎉 ${done}`));
      say(done);
      window.setTimeout(() => this.dialog.hide(), 1200);
    };
    const rng = Rng.fromSeed(`${run.seed}:${depth}:glowlayout`);
    if (puzzle.kind === 'gems') {
      const prompt = T.gemsPrompt;
      body.appendChild(el('p', 'edu-prompt', prompt));
      const grid = el('div', 'edu-options n3');
      const gems: string[] = Array.from({ length: puzzle.red }, () => '🔴');
      for (let i = 0; i < puzzle.decoys; i++)
        gems.push(rng.pick(GEM_COLOURS.filter((c) => c !== '🔴')));
      for (let i = gems.length - 1; i > 0; i--) {
        const j = rng.int(0, i);
        [gems[i], gems[j]] = [gems[j]!, gems[i]!];
      }
      let found = 0;
      for (const gem of gems) {
        const b = button(
          '',
          () => {
            if (b.disabled) return;
            if (gem === '🔴') {
              b.disabled = true;
              b.classList.add('right');
              found += 1;
              if (found >= puzzle.red) solve();
            } else b.classList.add('wrong');
          },
          'btn edu-option',
        );
        b.appendChild(el('span', 'edu-big', gem));
        grid.appendChild(b);
      }
      body.appendChild(grid);
      say(intro ? `${T.intro} ${prompt}` : prompt);
    } else {
      const prompt = T.shapePrompt(puzzle.shape);
      body.appendChild(el('p', 'edu-prompt', prompt));
      body.appendChild(el('div', 'edu-cue', `🚪 ${SHAPE_ICON[puzzle.shape]}`));
      const grid = el('div', `edu-options n${puzzle.options.length}`);
      for (const shape of puzzle.options) {
        const b = button(
          '',
          () => {
            if (shape === puzzle.shape) {
              b.classList.add('right');
              solve();
            } else b.classList.add('wrong');
          },
          'btn edu-option',
        );
        b.setAttribute('aria-label', shape);
        b.appendChild(el('span', 'edu-big', SHAPE_ICON[shape]));
        grid.appendChild(b);
      }
      body.appendChild(grid);
      say(prompt);
    }
    this.dialog.show();
  }
}
