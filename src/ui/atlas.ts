/**
 * Nova's atlas, Pixel's cabinet, the Multiverse rift and Neopia's rainbow gate (CV4, CV5):
 * one shelf panel over four side saves. Lines play in the story dialogue box, but their
 * progress and rewards go to their own save, never the Grove's (canon 21, 29, 30, 33). The
 * Grove only reads the Atlas and Arcade saves, for the journal's keepsakes and to announce
 * the festivals they unlock.
 */
import { ATLAS_TEXT } from '../config/strings';
import { showUpdateNotice } from './update-notice';
import type { Game } from '../game';
import {
  lineAct,
  lineAvailable,
  lineClosed,
  lineContext,
  lineCount,
  lineNext,
  lineProgress,
  lineSceneDone,
  festivalsUnlocked,
  type LineContext,
  type StoryLine,
} from '../sim/atlas';
import { crossSavesFrom, type CrossSaves } from '../sim/cross-saves';
import { audienceContext } from '../sim/fun-quests';
import { speakerNameIn } from '../sim/story-scenes';
import { E6_CORE_SCENE, E6_GATE_SCENE, REFLECTION_FLAG } from '../sim/multiverse-rules';
import {
  freshLine,
  parseMultiverse,
  parseSide,
  type Reflection,
  serializeSide,
  sideLines,
  type SideData,
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
  which: SideSave;
  title: string;
  help: string;
  empty: string;
  load: () => Promise<StoryLine[]>;
  /** Asked before the shelf opens (the rift's one-time age check); false keeps it shut. */
  gate?: () => Promise<boolean>;
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
    if (this.config.gate) {
      void this.config.gate().then((ok) => {
        if (ok) this.show();
      });
      return;
    }
    this.show();
  }

  private show(): void {
    this.page = null;
    this.dialog.show();
    if (this.lines) {
      this.refresh();
      return;
    }
    this.body.replaceChildren(el('p', 'help', ATLAS_TEXT.loading));
    // A chunk that fails to load (offline, or a deploy replaced it) offers the reload notice;
    // the loader keeps nothing, so the next open tries again.
    void this.config.load().then(
      (lines) => {
        this.lines = lines;
        this.refresh();
      },
      (err: unknown) => {
        this.close();
        showUpdateNotice(err);
      },
    );
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  /** Read the save fresh each time, so another tab's progress is never overwritten. */
  private read(): SideData {
    return parseSide(this.config.which, readSide(this.config.which));
  }

  /**
   * What a line may read: the rest of its save, E6's reflection, and the Grove's campaign
   * and side-story flags (a frozen copy, so a story world can never write them).
   */
  private context(save: SideData): LineContext {
    const extra = 'reflection' in save ? { [REFLECTION_FLAG]: save.reflection !== null } : {};
    const grove = this.game()?.world.campaign?.flags ?? {};
    return lineContext(this.lines ?? [], sideLines(save), extra, grove);
  }

  /** Change one line's progress and write the side save straight away. */
  private update(
    line: StoryLine,
    change: (p: ReturnType<typeof lineProgress>, ctx: LineContext) => void,
  ): void {
    const save = this.read();
    change(lineProgress(sideLines(save), line.id), this.context(save));
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
    const save = this.read();
    const progress = sideLines(save);
    const ctx = this.context(save);
    const audience = audienceContext(g.world);
    const shown = this.lines!.filter(
      (l) => lineAvailable(l, audience) && !lineClosed(l, progress[l.id], ctx),
    );
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
    const save = this.read();
    const p = sideLines(save)[line.id] ?? freshLine();
    const next = lineNext(line, p, this.context(save));
    this.body.replaceChildren(el('div', 'btn-name', line.title));
    if (next.kind === 'finished') {
      this.body.appendChild(el('p', 'help', ATLAS_TEXT.finished));
    } else if (next.kind === 'waiting') {
      this.body.appendChild(el('p', 'help', ATLAS_TEXT.waiting));
    } else {
      this.body.appendChild(el('p', undefined, next.quest.title));
      if (next.kind === 'act') {
        this.body.appendChild(el('p', undefined, next.goal));
        this.body.appendChild(el('p', 'help', next.hint));
        this.body.appendChild(
          button(
            ATLAS_TEXT.doIt,
            () => {
              this.update(line, (pr, ctx) => lineAct(line, pr, ctx));
              this.refresh();
            },
            'btn btn-primary',
          ),
        );
      } else {
        const scene = next.scene;
        // The page's own speakers first, then the rest of its line (a Learning Grove line
        // may name a speaker another quest of the page declares).
        const names: Record<string, string> = {};
        for (const l of [...scene.lines, ...(scene.choices ?? []).flatMap((c) => c.then ?? [])]) {
          const name = speakerNameIn(line.quests, scene.id, l.who, next.quest);
          if (name !== undefined) names[l.who] ??= name;
        }
        this.body.appendChild(
          button(
            ATLAS_TEXT.read,
            () => {
              // E6 opens: the Multiverse makes its reflection of the oldest Eternal first.
              if (scene.id === E6_GATE_SCENE) openLastEndgame();
              // The scene plays over the Grove; the shelf comes back when it ends.
              this.dialog.hide();
              this.dialogue.playScene(scene, names, (choice) => {
                this.update(line, (pr, ctx) => lineSceneDone(line, pr, scene.id, choice, ctx));
                if (scene.id === E6_CORE_SCENE && choice === 'eternal') endLastEndgameEternal();
                this.dialog.show();
                this.refresh();
              });
            },
            'btn btn-primary',
          ),
        );
      }
    }
    if (p.rewards.length > 0)
      this.body.appendChild(el('p', 'help', ATLAS_TEXT.kept(p.rewards.length)));
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
 * E6 opens (the rift's last endgame): make the reflection of the oldest Eternal in the
 * Multiverse save. Grove saves are only read.
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
