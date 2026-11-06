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
import { derivedUnlocks, setDerivedUnlocks } from '../sim/derived-unlocks';
import { audienceContext } from '../sim/fun-quests';
import { choiceToSend, eduContent, sceneFor, speakerNameIn } from '../sim/story-scenes';
import { speakLine } from './lesson';
import type { EduBand } from '../content/types';
import {
  E6_CORE_SCENE,
  E6_GATE_SCENE,
  ownsPlush,
  PLUSH_FLAG,
  REFLECTION_FLAG,
} from '../sim/multiverse-rules';
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
import { readSide, readStoryWorldSaves, writeSide, type SideSave } from '../platform/storage';
import type { Dialogue } from './dialogue';
import { button, el, modal } from './dom';
import { battleScreen } from './battle-screen';
import { SURVIVE_TEXT } from '../config/strings-battle-r6';
import { parseSurvive, startWorldBout, surviveContext } from '../sim/battle/world-bout';
import { MicroScreen } from '../minigames/micro/micro-screen';
import { MICRO_BUILT, microFor, microSkipped } from '../sim/micro';
import { DO_IT_BY, DOSSIER_TEXT } from '../config/strings-fun-r6';
import { playLabel } from './journal-step';
import { showSkipCard, stepSummary } from './skip-card';
import { hashSeed } from '../sim/rng';

/**
 * R0687: whether a page has a Learning Grove version for the band: one of its quests' scenes
 * is in the edu content (`eduContent()`), so a child only ever sees pages written for them.
 * The edu chunk for the band's Atlas part loads on the first lookup, so this can be false at
 * first; the shelf looks again a moment later.
 */
export function hasEduPage(line: StoryLine, band: EduBand): boolean {
  const edu = eduContent();
  if (!edu) return false;
  return line.quests.some((q) => q.steps.some((s) => !!edu.eduSceneFor(band, s.scene.id)));
}

/**
 * A fresh read-only snapshot of the side saves and the Grove save in play (R0626: every
 * slot only when the profile's "Story worlds remember" says so).
 */
export function readCrossSaves(): CrossSaves {
  const x = crossSavesFrom(readSide('atlas'), readSide('arcade'), readStoryWorldSaves());
  setDerivedUnlocks(derivedUnlocks(x)); /* R0630: recomputed each read, never saved */
  return x;
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
  private eduRetries = 0;

  private readonly micro: MicroScreen;

  constructor(
    private readonly parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly dialogue: Dialogue,
    private readonly toast: (text: string) => void,
    private readonly config: ShelfConfig,
  ) {
    this.dialog = modal(this.parent, config.title, 'Close');
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
    // R0294: the micro-games that stand in for a bare "Do it".
    this.micro = new MicroScreen(this.parent);
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
    this.eduRetries = 0;
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
    const world = this.game()?.world;
    const extra =
      'reflection' in save
        ? { [REFLECTION_FLAG]: save.reflection !== null, [PLUSH_FLAG]: ownsPlush(world) }
        : {};
    const grove = world?.campaign?.flags ?? {};
    return lineContext(this.lines ?? [], sideLines(save), extra, grove);
  }

  /** Change one line's progress and write the side save straight away. */
  /**
   * R0340 (FUN-51): a `karate:survive:<boss>:<n>` step plays a survive bout on the battle
   * screen, fought by copies of the Grove party, so the Grove is never written. Holding on for
   * the rounds, or being tuckered out (a draw for the story), both move the step on; leaving
   * the bout does not. False when there is nobody hatched to fight, so the plain "Do it" runs.
   */
  private playSurvive(
    g: Game,
    lineId: string,
    stepId: string,
    check: { boss: string; rounds: number },
    act: () => void,
  ): boolean {
    const party = g.world.battlePrefs?.party ?? g.world.nubbins.map((n) => n.id);
    const ctx = surviveContext(
      g.world,
      this.config.which,
      lineId,
      stepId,
      check,
      party,
      SURVIVE_TEXT.barks[check.boss] ?? [],
    );
    if (!ctx.ids.length) return false;
    const bout = startWorldBout(g.world, ctx);
    if (!bout) return false;
    this.dialog.hide();
    battleScreen(this.dialog.root.parentElement ?? document.body, this.game).startWorld(
      bout,
      (s) => {
        if (s?.result) act();
        this.dialog.show();
        this.refresh();
      },
    );
    return true;
  }

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
    const edu = g.world.edu;
    const shown = this.lines!.filter(
      (l) =>
        lineAvailable(l, audience) &&
        !lineClosed(l, progress[l.id], ctx) &&
        (!edu || hasEduPage(l, edu.band)),
    );
    // R0687: the edu chunk may still be on its way; look again a few times.
    if (edu && shown.length === 0 && this.eduRetries < 6) {
      this.eduRetries += 1;
      window.setTimeout(() => this.dialog.isOpen() && !this.page && this.refresh(), 700);
    }
    this.body.replaceChildren(el('p', 'help', this.config.help));
    // R0335 (FUN-46): Neopia's masthead, its caption worn down by the plots (canon 44).
    if (this.config.which === 'neopia') {
      const np = this.lines!.find((l) => l.id === 'NP');
      const [plots] = np ? lineCount(np, progress[np.id]) : [0];
      const stage = plots >= 13 ? 2 : plots >= 4 ? 1 : 0;
      const head = el('div', stage === 2 ? 'neo-masthead neo-bitten' : 'neo-masthead');
      head.append(
        el('strong', undefined, DOSSIER_TEXT.masthead),
        el('small', undefined, DOSSIER_TEXT.captions[stage]),
      );
      this.body.appendChild(head);
    }
    if (shown.length === 0) this.body.appendChild(el('p', 'help', this.config.empty));
    const list = el('div', 'title-menu');
    for (const line of shown) {
      const [done, total] = lineCount(line, progress[line.id]);
      const mark = progress[line.id]?.done ? ' ✓' : '';
      // R0335: a Multiverse line's case file misnames the Nubbins until the line closes.
      const wrong = this.config.which === 'multiverse' ? DOSSIER_TEXT.wrong[line.id] : undefined;
      if (wrong) {
        const file = el('p', 'help mv-dossier', DOSSIER_TEXT.label);
        if (progress[line.id]?.done)
          file.append(el('s', undefined, wrong), ` ${DOSSIER_TEXT.right}`);
        else file.append(wrong);
        list.appendChild(file);
      }
      // R0687: in a Learning Grove each page is a picture postcard that says its title.
      list.appendChild(
        button(
          edu ? `🌍 ${line.title}${mark}` : `${ATLAS_TEXT.page(line.title, done, total)}${mark}`,
          () => {
            if (edu?.readAloud) speakLine(line.title);
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
        // R0294 (FUN-05): every check verb plays its micro-game first, unless the Skip
        // switch is on. R0369 (FUN-80): the button names the verb, with an aside.
        const step = next.quest.steps.find((s) => s.goal === next.goal);
        const kind = step ? microFor(step.check) : null;
        const by = DO_IT_BY[kind ?? 'real'];
        const w = this.game()?.world;
        const skip = w ? microSkipped(w) : false;
        this.body.appendChild(el('p', 'help micro-aside', by.aside));
        this.body.appendChild(
          button(
            // Lane C r10 agent C (R0636): Play it, or Imagine it when no game stands in.
            playLabel(kind, skip, step?.check ?? ''),
            () => {
              const act = (): void => {
                this.update(line, (pr, ctx) => lineAct(line, pr, ctx));
                this.refresh();
                // R0617: what the step did, once it is done (Play it or Imagine it).
                if (step) showSkipCard(this.parent, next.quest.title, stepSummary(step));
              };
              // R0340 (FUN-51): a survive step is a real bout, fought by copies of the party.
              const survive = step ? parseSurvive(step.check) : null;
              const g = this.game();
              if (survive && g && this.playSurvive(g, line.id, step!.id, survive, act)) return;
              if (kind && !skip && MICRO_BUILT.has(kind)) {
                const seed = Math.abs(hashSeed(`${line.id}:${step!.id}`));
                this.micro.open(kind, next.goal, seed, this.game()?.reduceMotion ?? false, act);
              } else act();
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
              // R0687: a Learning Grove child gets the band's version, with its lessons.
              const gw = this.game()?.world;
              const play = gw?.edu ? sceneFor(gw, scene.id) : undefined;
              this.dialogue.playScene(
                play ?? scene,
                names,
                (choice) => {
                  this.update(line, (pr, ctx) =>
                    lineSceneDone(
                      line,
                      pr,
                      scene.id,
                      play ? choiceToSend(play, choice) : choice,
                      ctx,
                    ),
                  );
                  if (scene.id === E6_CORE_SCENE && choice === 'eternal') endLastEndgameEternal();
                  this.dialog.show();
                  this.refresh();
                },
                play?.lessons ?? [],
              );
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
  const r = reflectEternal(mv, readStoryWorldSaves());
  writeSide('multiverse', serializeSide(mv));
  return r;
}

/** E6's `eternal` ending: only the Multiverse save loses its reflection. */
export function endLastEndgameEternal(): void {
  const mv = parseMultiverse(readSide('multiverse'));
  loseReflection(mv);
  writeSide('multiverse', serializeSide(mv));
}
