/**
 * Nova's atlas and Pixel's cabinet (CV4, CV5): one shelf panel over two side saves.
 * Pages and cartridges play in the story dialogue box, but their progress goes to their
 * own save, never the Grove's (canon 21, 29, 30). The Grove only reads those saves, for
 * the journal's keepsakes and to announce the festivals they unlock.
 */
import { ATLAS_TEXT } from '../config/strings';
import type { Game } from '../game';
import {
  lineAct,
  lineAvailable,
  lineCount,
  lineNext,
  lineProgress,
  lineSceneDone,
  festivalsUnlocked,
  type StoryLine,
} from '../sim/atlas';
import { crossSavesFrom, type CrossSaves } from '../sim/cross-saves';
import { audienceContext } from '../sim/fun-quests';
import {
  parseArcade,
  parseAtlas,
  parseMultiverse,
  type Reflection,
  serializeSide,
  type ArcadeSave,
  type AtlasSave,
  type LineProgress,
} from '../sim/side-saves';
import { loseReflection, reflectEternal } from '../sim/reflection';
import { readGroveSaves, readSide, writeSide, type SideSave } from '../platform/storage';
import type { Dialogue } from './dialogue';
import { button, el, modal } from './dom';

/** A fresh read-only snapshot of the side saves and every Grove save on this device. */
export function readCrossSaves(): CrossSaves {
  return crossSavesFrom(readSide('atlas'), readSide('arcade'), readGroveSaves());
}

/** Toast and remember each festival the side saves have unlocked and this Grove has not heard of. */
export function announceFestivals(g: Game, toast: (text: string) => void): void {
  if (g.world.edu) return;
  for (const id of festivalsUnlocked(readCrossSaves())) {
    if (g.world.atlasFestivals.includes(id)) continue;
    g.send({ kind: 'atlasFestival', id });
    toast(ATLAS_TEXT.festival(ATLAS_TEXT.festivals[id] ?? id));
  }
}

interface ShelfConfig {
  which: Extract<SideSave, 'atlas' | 'arcade'>;
  title: string;
  help: string;
  empty: string;
  load: () => Promise<StoryLine[]>;
}

export class StoryShelf {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  private lines: StoryLine[] | null = null;
  private page: StoryLine | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly dialogue: Dialogue,
    private readonly toast: (text: string) => void,
    private readonly config: ShelfConfig,
  ) {
    this.dialog = modal(parent, config.title, 'Close');
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
  }

  open(): void {
    this.page = null;
    this.dialog.show();
    if (this.lines) {
      this.refresh();
      return;
    }
    this.body.replaceChildren(el('p', 'help', ATLAS_TEXT.loading));
    void this.config.load().then((lines) => {
      this.lines = lines;
      this.refresh();
    });
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  /** Read the save fresh each time, so another tab's progress is never overwritten. */
  private read(): AtlasSave | ArcadeSave {
    const json = readSide(this.config.which);
    return this.config.which === 'atlas' ? parseAtlas(json) : parseArcade(json);
  }

  private progressOf(save: AtlasSave | ArcadeSave): Record<string, LineProgress> {
    return 'pages' in save ? save.pages : save.carts;
  }

  /** Change one line's progress and write the side save straight away. */
  private update(line: StoryLine, change: (p: LineProgress) => void): void {
    const save = this.read();
    change(lineProgress(this.progressOf(save), line.id));
    writeSide(this.config.which, serializeSide(save));
    const g = this.game();
    if (g) announceFestivals(g, this.toast);
  }

  private refresh(): void {
    const g = this.game();
    if (!g || !this.lines) return;
    if (this.page) this.renderPage(this.page);
    else this.renderList(g);
  }

  private renderList(g: Game): void {
    const progress = this.progressOf(this.read());
    const ctx = audienceContext(g.world);
    const shown = this.lines!.filter((l) => lineAvailable(l, ctx));
    this.body.replaceChildren(el('p', 'help', this.config.help));
    if (shown.length === 0) this.body.appendChild(el('p', 'help', this.config.empty));
    const list = el('div', 'title-menu');
    for (const line of shown) {
      const [done, total] = lineCount(line, progress[line.id]);
      const mark = progress[line.id]?.done ? ' ✓' : '';
      list.appendChild(
        button(
          `${ATLAS_TEXT.page(line.title, done, total)}${mark}`,
          () => {
            this.page = line;
            this.refresh();
          },
          'btn btn-wide',
        ),
      );
    }
    this.body.appendChild(list);
  }

  private renderPage(line: StoryLine): void {
    const p = this.progressOf(this.read())[line.id];
    const next = lineNext(line, p ?? { quests: {}, flags: {}, done: false });
    this.body.replaceChildren(el('div', 'btn-name', line.title));
    if (next.kind === 'finished') {
      this.body.appendChild(el('p', 'help', ATLAS_TEXT.finished));
    } else {
      this.body.appendChild(el('p', undefined, next.quest.title));
      if (next.kind === 'act') {
        this.body.appendChild(el('p', undefined, next.goal));
        this.body.appendChild(el('p', 'help', next.hint));
        this.body.appendChild(
          button(
            ATLAS_TEXT.doIt,
            () => {
              this.update(line, (pr) => lineAct(line, pr));
              this.refresh();
            },
            'btn btn-primary',
          ),
        );
      } else {
        const names = Object.fromEntries(next.quest.speakers.map((s) => [s.id, s.name]));
        const scene = next.scene;
        this.body.appendChild(
          button(
            ATLAS_TEXT.read,
            () => {
              // The scene plays over the Grove; the shelf comes back when it ends.
              this.dialog.hide();
              this.dialogue.playScene(scene, names, (choice) => {
                this.update(line, (pr) => lineSceneDone(line, pr, scene.id, choice));
                this.dialog.show();
                this.refresh();
              });
            },
            'btn btn-primary',
          ),
        );
      }
    }
    this.body.appendChild(
      button(
        ATLAS_TEXT.back,
        () => {
          this.page = null;
          this.refresh();
        },
        'btn',
      ),
    );
  }
}

/**
 * E6 opens (the Multiverse milestone calls this from the rift): make the reflection of the
 * oldest Eternal in the Multiverse save. Grove saves are only read.
 */
export function openLastEndgame(): Reflection | null {
  const mv = parseMultiverse(readSide('multiverse'));
  const r = reflectEternal(mv, readGroveSaves());
  writeSide('multiverse', serializeSide(mv));
  return r;
}

/** E6's `eternal` ending: only the Multiverse save loses its reflection. */
export function endLastEndgameEternal(): void {
  const mv = parseMultiverse(readSide('multiverse'));
  loseReflection(mv);
  writeSide('multiverse', serializeSide(mv));
}
