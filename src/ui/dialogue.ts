import { TRAINER_LABELS } from '../config/strings';
import { ENDINGS, SPEAKERS, STORY_TEXT, type Line, type Mood, type Scene } from '../config/story';
import type { Game } from '../game';
import type { Lesson } from '../content/types';
import {
  choiceToSend,
  eduContent,
  questSpeakerName,
  sceneFor,
  textBandOf,
  type PlayScene,
} from '../sim/story-scenes';
import { renderDo, renderLineText, renderOptions, speakLine, stopSpeaking } from './lesson';
import { frameKey } from '../render/sprites/animations';
import type { SpriteSheet } from '../render/sprites/atlas';
import { button, el } from './dom';
import { hasScript } from '../sim/lang-text';
import { langWord } from '../sim/lang';
import { playWord } from '../platform/lang-audio';
import { SceneReplayGuard } from './scene-replay-guard';
import { isControlTarget } from '../input/keys';
import { StoryUi, type DialogueHooks } from './story-ui';
import { SPEAKER_NOW } from '../render/stage-actors';

/**
 * The story dialogue box: portrait, name, typewriter text, tap to advance, choices.
 * It reads the scene from config/story and answers the sim with `sceneDone`.
 */
export class Dialogue {
  readonly root: HTMLDivElement;
  private readonly portrait: HTMLCanvasElement;
  private readonly name: HTMLDivElement;
  private readonly text: HTMLDivElement;
  private readonly choices: HTMLDivElement;
  private readonly next: HTMLDivElement;
  private readonly endCard: HTMLDivElement;
  private readonly endParent: HTMLElement;
  private readonly endTitle: HTMLDivElement;
  private lines: Line[] = [];
  private index = 0;
  private scene: string | null = null;
  private typing = 0;
  private fullText = '';
  private shown = 0;
  private afterLines: (() => void) | null = null;
  /** The scene playing (its band's lessons and default choice), and lessons already played. */
  private playing: PlayScene | null = null;
  private lessonsDone = new Set<string>();
  /** True while a lesson's own lines play (no lesson can start inside another). */
  private inLesson = false;
  /** Set while a side save's scene plays: it answers here instead of the sim. */
  private external: ((choice: string | null) => void) | null = null;
  /** Names for the side save's own speakers. */
  private names: Record<string, string> = {};
  /** Holds back a scene whose `sceneDone` the sim has not applied yet. */
  private readonly replayGuard = new SceneReplayGuard();
  /** The story UI's hooks: item card, chapter postcard, chapter photo (campaign graphics 2, U). */
  private hooks: DialogueHooks = {};
  /** True while a chapter postcard holds the first line back (N1). */
  private held = false;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'dialogue');
    this.root.hidden = true;
    const box = el('div', 'dialogue-box');
    this.portrait = document.createElement('canvas');
    this.portrait.className = 'dialogue-portrait';
    const body = el('div', 'dialogue-body');
    this.name = el('div', 'dialogue-name');
    this.text = el('div', 'dialogue-text');
    this.next = el('div', 'dialogue-next', '▼');
    this.choices = el('div', 'dialogue-choices');
    body.append(this.name, this.text, this.choices);
    box.append(this.portrait, body, this.next);
    this.root.appendChild(box);
    this.root.addEventListener('click', (e) => {
      if (this.waiting()) return;
      if (this.held) {
        this.hooks.skip?.();
        this.release();
        return;
      }
      if ((e.target as HTMLElement).closest('.dialogue-choices, .edu-gloss')) return;
      this.advance();
    });
    window.addEventListener('keydown', (e) => {
      if (this.root.hidden || this.choices.childElementCount > 0 || this.waiting()) return;
      // A focused button or field keeps its own Space and Enter.
      if (isControlTarget(e.target)) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (this.held) {
          this.hooks.skip?.();
          this.release();
          return;
        }
        this.advance();
      }
    });

    this.endCard = el('div', 'celebrate');
    this.endCard.hidden = true;
    const card = el('div', 'celebrate-card');
    this.endTitle = el('h2');
    card.append(
      el('div', 'celebrate-sparkle', '✦ ✧ ✦'),
      el('p', 'celebrate-form', STORY_TEXT.theEnd),
      this.endTitle,
      button(
        STORY_TEXT.playOn,
        () => {
          this.endCard.hidden = true;
          this.endCard.remove();
        },
        'btn btn-primary',
      ),
    );
    this.endCard.appendChild(card);
    // The ending card joins the page only when it shows (review 2026-10-21, bug 35).
    this.endParent = parent;
    parent.append(this.root);
    this.hooks = new StoryUi(this, parent, game).hooks;
  }

  /** Who speaks the line on screen (a speaker id), or null when closed; the story camera frames them. */
  get speaker(): string | null {
    return this.isOpen ? (this.lines[this.index]?.who ?? null) : null;
  }

  /** The line on screen's index in its scene (0 on the first, and while closed). */
  get line(): number {
    return this.isOpen ? this.index : 0;
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  /**
   * While `blocked` says so (a panel, sheet or notice is open over the scene), the scene
   * waits on its line: taps and keys pass to the panel, and nothing advances.
   */
  waitWhile(blocked: () => boolean): void {
    this.blocked = blocked;
    this.sync();
  }

  /** Re-check the wait; the HUD calls this whenever a panel opens or closes. */
  sync(): void {
    this.root.classList.toggle('waiting', this.waiting());
  }

  private blocked: () => boolean = () => false;

  private waiting(): boolean {
    return !this.root.hidden && this.blocked();
  }

  /** Whether the campaign queue head may be played now; call it on every queue check. */
  shouldPlay(head: string | undefined): boolean {
    return this.replayGuard.shouldPlay(head);
  }

  /**
   * Close a Grove scene the sim no longer queues (the debug chapter jump clears the queue),
   * without reporting it done: its lines would otherwise keep playing over the new chapter.
   */
  dropStale(queue: readonly string[] | undefined): void {
    const id = this.scene;
    if (!id || this.external || this.inLesson || this.root.hidden || queue?.includes(id)) return;
    this.root.hidden = true;
    this.scene = null;
    this.held = false;
    this.root.classList.remove('held');
    this.hooks.close?.(null, false);
    this.playing = null;
    this.afterLines = null;
    this.choices.innerHTML = '';
    clearInterval(this.typing);
    stopSpeaking();
  }

  /** Show a scene by id. The sim is told when it is done. */
  play(sceneId: string): void {
    const g = this.game();
    const scene = g ? sceneFor(g.world, sceneId) : undefined;
    if (!scene || !g) return;
    this.external = null;
    this.names = {};
    this.start(sceneId, scene);
  }

  /**
   * Play a scene from a side save (the Atlas, a cartridge): its own speakers' names, and
   * `onDone` instead of the Grove's sim, which never hears of it (canon 21).
   */
  playScene(
    scene: Scene,
    names: Record<string, string>,
    onDone: (choice: string | null) => void,
  ): void {
    if (!this.game()) return;
    this.external = onDone;
    this.names = names;
    this.start(scene.id, { ...scene, lessons: [] });
  }

  private start(sceneId: string, scene: PlayScene): void {
    this.scene = sceneId;
    this.playing = scene;
    this.lessonsDone.clear();
    this.inLesson = false;
    this.lines = scene.lines;
    this.index = 0;
    this.choices.innerHTML = '';
    this.next.hidden = false;
    this.afterLines = () => {
      if (scene.choices && scene.choices.length > 0) {
        this.showChoices(scene.choices);
      } else {
        this.finish(null);
      }
    };
    this.root.hidden = false;
    this.sync();
    // A chapter opening holds on its first frame (N1); a side save's scene never does.
    const holding =
      !this.external && (this.hooks.open?.(sceneId, scene, () => this.release()) ?? false);
    if (holding) {
      this.held = true;
      this.root.classList.add('held');
    } else {
      this.showLine();
      this.hooks.shown?.();
    }
  }

  /** End the postcard hold: the first line appears. */
  private release(): void {
    if (!this.held) return;
    this.held = false;
    this.root.classList.remove('held');
    this.showLine();
    this.hooks.shown?.();
  }

  private showChoices(choices: NonNullable<ReturnType<typeof sceneFor>>['choices']): void {
    this.choices.innerHTML = '';
    this.next.hidden = true;
    for (const c of choices ?? []) {
      this.choices.appendChild(
        button(
          c.label,
          () => {
            this.choices.innerHTML = '';
            this.next.hidden = false;
            if (c.then && c.then.length > 0) {
              this.lines = c.then;
              this.index = 0;
              this.afterLines = () => this.finish(c.id);
              this.showLine();
            } else {
              this.finish(c.id);
            }
          },
          'btn btn-choice',
        ),
      );
    }
  }

  private finish(choice: string | null): void {
    const g = this.game();
    const scene = this.scene;
    this.root.hidden = true;
    this.scene = null;
    this.held = false;
    this.root.classList.remove('held');
    clearInterval(this.typing);
    stopSpeaking();
    const playing = this.playing;
    this.playing = null;
    const external = this.external;
    this.external = null;
    this.hooks.close?.(scene, !!external);
    if (external) {
      external(choice);
      return;
    }
    if (g && scene) {
      this.replayGuard.markFinished(scene);
      g.send({
        kind: 'sceneDone',
        scene,
        choice: playing ? choiceToSend(playing, choice) : choice,
      });
    }
    if (scene?.startsWith('end-')) {
      const ending = ENDINGS[scene.slice(4)];
      this.endTitle.textContent = STORY_TEXT.endingReached(ending?.title ?? scene);
      this.endParent.appendChild(this.endCard);
      this.endCard.hidden = false;
    }
  }

  private advance(): void {
    if (this.root.hidden || this.choices.childElementCount > 0) return;
    if (this.shown < this.fullText.length) {
      // Finish the line at once.
      clearInterval(this.typing);
      this.shown = this.fullText.length;
      this.finishText();
      return;
    }
    const lesson = this.dueLesson();
    if (lesson) {
      this.runLesson(lesson);
      return;
    }
    this.index += 1;
    if (this.index >= this.lines.length) {
      this.afterLines?.();
      return;
    }
    this.showLine();
  }

  private showLine(): void {
    const line = this.lines[this.index];
    const g = this.game();
    if (!line || !g) return;
    const who = line.who;
    const chorus = who === 'chorus';
    this.name.textContent = this.names[who] ?? speakerName(who, g, this.scene ?? '');
    this.name.hidden = who === 'narrator';
    this.root.classList.toggle('narration', who === 'narrator');
    // The chorus (everyone singing) has no portrait and is shown in italics.
    this.root.classList.toggle('chorus', chorus);
    this.drawPortrait(chorus ? 'narrator' : who, g, line.mood ?? 'neutral');
    this.fullText = line.text;
    this.shown = 0;
    this.text.textContent = '';
    // Left to right always, never auto: many language lines open with a Hebrew word (CV3).
    this.text.dir = 'ltr';
    clearInterval(this.typing);
    const speed = g.world.settings.textSpeed;
    const reduce = speed === 'instant' || g.reduceMotion;
    if (textBandOf(g.world) === 'sprout' && g.world.edu?.readAloud) speakLine(line.text);
    // Half-typed Hebrew would sit unisolated, so a line with script appears whole.
    if (reduce || hasScript(this.fullText)) {
      this.shown = this.fullText.length;
      this.finishText();
      return;
    }
    this.typing = window.setInterval(
      () => {
        this.shown = Math.min(this.fullText.length, this.shown + (speed === 'fast' ? 4 : 2));
        this.text.textContent = this.fullText.slice(0, this.shown);
        if (this.shown >= this.fullText.length) {
          clearInterval(this.typing);
          this.finishText();
        }
      },
      speed === 'slow' ? 34 : 18,
    );
  }

  /** The whole line, with the reader glossary underlined and sprout prompts set apart. */
  private finishText(): void {
    const g = this.game();
    const band = g ? textBandOf(g.world) : 'main';
    const glossary =
      band === 'reader' && this.scene
        ? (eduContent()?.eduGlossary('reader', this.scene) ?? null)
        : null;
    renderLineText(
      this.text,
      this.fullText,
      glossary,
      band === 'sprout',
      (word, meaning) => {
        this.text.querySelector('.edu-gloss-pop')?.remove();
        const pop = el('span', 'edu-gloss-pop', `${word}: ${meaning}`);
        pop.addEventListener('click', (e) => {
          e.stopPropagation();
          pop.remove();
        });
        this.text.appendChild(pop);
      },
      (ids) => {
        // A tapped course word: its native-speaker clip, and it counts as heard.
        const first = ids[0] && langWord(ids[0]);
        if (first) playWord(first.audio);
        for (const id of ids) g?.send({ kind: 'langWord', word: id, how: 'heard' });
      },
    );
  }

  /** A lesson written to play after the current main line, not yet played. */
  private dueLesson(): Lesson | undefined {
    const p = this.playing;
    if (!p || this.inLesson || this.lines !== p.lines) return undefined;
    const last = this.lines.length - 1;
    return p.lessons.find(
      (l) => !this.lessonsDone.has(l.id) && Math.min(Math.max(l.after, 0), last) === this.index,
    );
  }

  /** Play a run of lines inside the scene, then come back to where it was. */
  private playSub(lines: readonly Line[], then: () => void): void {
    if (lines.length === 0) {
      then();
      return;
    }
    const saved = { lines: this.lines, index: this.index, after: this.afterLines };
    this.lines = [...lines];
    this.index = 0;
    this.afterLines = () => {
      this.lines = saved.lines;
      this.index = saved.index;
      this.afterLines = saved.after;
      then();
    };
    this.showLine();
  }

  /** ask: prompt, big options, the reply · notice: its lines · do: its lines and the card. */
  private runLesson(l: Lesson): void {
    this.lessonsDone.add(l.id);
    this.inLesson = true;
    const done = (best: boolean | null) => {
      this.inLesson = false;
      this.next.hidden = false;
      this.game()?.send({ kind: 'eduLesson', id: l.id, best });
      this.advance();
    };
    const card = (fill: () => void) => {
      this.next.hidden = true;
      fill();
    };
    if (l.kind === 'ask')
      this.playSub(l.prompt ?? [], () =>
        card(() =>
          renderOptions(this.choices, l, (o, best) => {
            this.next.hidden = false;
            this.playSub(o.reply, () => done(best));
          }),
        ),
      );
    else if (l.kind === 'do')
      this.playSub(l.lines ?? [], () => card(() => renderDo(this.choices, l, () => done(null))));
    else this.playSub(l.lines ?? [], () => done(null));
  }

  private drawPortrait(who: string, g: Game, mood: Mood): void {
    const ctx = this.portrait.getContext('2d');
    const scale = 3;
    this.portrait.width = 32 * scale;
    this.portrait.height = 32 * scale;
    this.portrait.hidden = who === 'narrator';
    if (!ctx || who === 'narrator') return;
    ctx.imageSmoothingEnabled = false;
    const { sheet, key } = portraitFrame(who, g, mood);
    const rect = sheet?.frames.get(key) ?? sheet?.frames.values().next().value;
    if (!sheet || !rect) return;
    ctx.drawImage(
      sheet.texture.image as HTMLCanvasElement,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      0,
      0,
      this.portrait.width,
      this.portrait.height,
    );
  }
}

export function speakerName(who: string, g: Game, sceneId = ''): string {
  if (who === 'moss' || who === 'sable') {
    const c = g.world.campaign;
    const id = who === 'moss' ? c?.mossId : c?.sableId;
    const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
    return n?.name ?? SPEAKERS[who]?.name ?? who;
  }
  return (
    TRAINER_LABELS[who]?.name ??
    SPEAKERS[who]?.name ??
    questSpeakerName(sceneId, who) ??
    // Never show a raw id: content-check fails an unmapped speaker, so this is a last resort.
    who.replace(
      /(^|-)([a-z])/g,
      (_m, sep: string, c: string) => `${sep ? ' ' : ''}${c.toUpperCase()}`,
    )
  );
}

function portraitFrame(
  who: string,
  g: Game,
  mood: Mood,
): { sheet: SpriteSheet | null; key: string } {
  const sheets = g.view.sheets;
  // H6: the world's speaker chevron follows the line on screen.
  SPEAKER_NOW.who = who;
  // You wear your own outfit (trim in your side's colours), as in the Grove, so you never
  // share a portrait with the villager whose look you chose.
  if (who === 'you') {
    return {
      sheet: sheets.keeper(g.world.trainer, g.world.keeper.alignment),
      key: frameKey('idle', 'front', 0),
    };
  }
  if (who === 'moss' || who === 'sable' || who === 'wisp') {
    const c = g.world.campaign;
    const id = who === 'moss' ? c?.mossId : who === 'sable' ? c?.sableId : null;
    const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
    const clip = mood === 'happy' || mood === 'soft' ? 'happy' : mood === 'sad' ? 'sad' : 'idle';
    if (n) return { sheet: sheets.forNubbin(n), key: frameKey(clip, 'front', 0) };
    return { sheet: sheets.rival('neutral', 'normal'), key: frameKey(clip, 'front', 0) };
  }
  // C2: a storyline speaker has a look of their own (`STORY_NPC_LOOKS`), never the player's.
  return { sheet: sheets.keeper(who), key: frameKey('idle', 'front', 0) };
}
