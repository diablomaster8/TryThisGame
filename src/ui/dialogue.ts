import { TRAINER_LABELS } from '../config/strings';
import { StageReact } from './stage-react';
import { CG4_U4 } from '../config/tuning-u4';
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
import { LOOK_STATE, npcLookOf, storyId } from '../config/npc-looks';
import { keeperOutfit, trainerLook } from '../render/keeper-look';
import { buildFaceSheet, expressionOf, faceKey } from '../render/sprites/faces';
import { drawKeeperFrame, grandchildLook } from '../render/sprites/keeper';
import { CREATURE_SPEAKERS, creatureLook } from '../render/portraits';
import { DIALOGUE_TEXT } from '../config/strings-dlg';
import { TYPE_TIMING } from '../config/tuning-fun';
import { pauseAfter, voiceOf } from './type-timing';
import { playBlip, playSound } from '../platform/audio';
import { renderLineAct, sayItButton } from './line-act';
import { refrainOf } from '../config/edu-refrains';
import '../fun.css';

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
  private readonly skipBtn: HTMLButtonElement;
  /**
   * Runs as a scene starts, before its first line: the HUD closes the panels and the sheet
   * for a Grove scene (r1025 item 2). `external` is true for a side save's scene, whose
   * shelf steps aside on its own.
   */
  onStart: ((external: boolean) => void) | null = null;
  private lines: Line[] = [];
  private index = 0;
  private scene: string | null = null;
  private typing = 0;
  private fullText = '';
  private shown = 0;
  /** R0303: the stage actor's emote or spark for the line on screen. */
  private readonly stageReact: StageReact;
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
  /** R0304: the line whose act was last put up, so a re-render never shows it twice. */
  private actShown = '';

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'dialogue');
    this.root.hidden = true;
    this.stageReact = new StageReact(parent);
    const box = el('div', 'dialogue-box');
    this.portrait = document.createElement('canvas');
    this.portrait.className = 'dialogue-portrait';
    const body = el('div', 'dialogue-body');
    this.name = el('div', 'dialogue-name');
    this.text = el('div', 'dialogue-text');
    this.next = el('div', 'dialogue-next', '▼');
    this.choices = el('div', 'dialogue-choices');
    body.append(this.name, this.text, this.choices);
    // r1025 item 1: skip to the next real choice (or the scene's end), never past one.
    this.skipBtn = button(`${DIALOGUE_TEXT.skip} ⏭`, () => this.skip(), 'btn dialogue-skip');
    this.skipBtn.setAttribute('aria-label', DIALOGUE_TEXT.skipLabel);
    this.skipBtn.title = DIALOGUE_TEXT.skipLabel;
    box.append(this.portrait, body, this.next, this.skipBtn);
    this.root.appendChild(box);
    // The box takes focus when a scene starts, so Space and Enter advance it rather than
    // pressing whatever sheet button had focus before (r1025 item 2).
    this.root.tabIndex = -1;
    // Choices and lesson cards fill this row; Skip steps aside while they are up.
    new MutationObserver(() => this.syncSkip()).observe(this.choices, { childList: true });
    this.root.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.dialogue-skip')) return;
      if (this.waiting()) return;
      if (this.held) {
        this.hooks.skip?.();
        this.release();
        return;
      }
      if ((e.target as HTMLElement).closest('.dialogue-choices, .edu-gloss')) return;
      // FUN-01: a do beat waits on its button; a tap anywhere else points at it.
      const doBtn = this.choices.querySelector<HTMLElement>(
        '.edu-count:not(:disabled), .btn-primary.edu-option, .line-act-btn',
      );
      if (doBtn) {
        doBtn.classList.remove('edu-pulse');
        void doBtn.offsetWidth;
        doBtn.classList.add('edu-pulse');
        return;
      }
      this.advance();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.root.hidden && !this.waiting() && !this.skipBtn.hidden) {
        e.preventDefault();
        this.skip();
        return;
      }
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
    SPEAKER_NOW.who = null;
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
    lessons: PlayScene['lessons'] = [],
  ): void {
    if (!this.game()) return;
    this.external = onDone;
    this.names = names;
    // Lane C round 6: a Learning Grove battle lesson (FIGHT-83) keeps its lessons.
    this.start(scene.id, { ...scene, lessons });
  }

  private start(sceneId: string, scene: PlayScene): void {
    this.scene = sceneId;
    this.actShown = '';
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
    this.onStart?.(!!this.external);
    this.root.hidden = false;
    this.sync();
    this.takeFocus();
    this.syncSkip();
    // A chapter opening holds on its first frame (N1); a side save's scene never does.
    const holding =
      !this.external && (this.hooks.open?.(sceneId, scene, () => this.release()) ?? false);
    if (holding) {
      this.held = true;
      this.root.classList.add('held');
      // No line is up yet: the last scene's speaker must not keep the chevron (H6).
      SPEAKER_NOW.who = null;
    } else {
      this.showLine();
      this.hooks.shown?.();
    }
  }

  /** Move focus off any sheet or menu button and onto the box (r1025 item 2). */
  private takeFocus(): void {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body && !this.root.contains(active))
      active.blur();
    this.root.focus({ preventScroll: true });
  }

  /**
   * Skip (r1025 item 1): run the scene's lines through the same steps a tap takes, so every
   * line counts as played, lessons fire their events and `sceneDone` is sent exactly as by
   * tapping. It stops at the next real choice or lesson card, or ends the scene.
   */
  skip(): void {
    if (this.root.hidden || this.waiting() || this.skipBtn.hidden) return;
    if (this.held) {
      this.hooks.skip?.();
      this.release();
    }
    for (let i = 0; i < 5000; i++) {
      if (this.root.hidden || this.held || this.choices.childElementCount > 0) break;
      this.advance();
    }
    if (!this.root.hidden) this.takeFocus();
  }

  /** Skip shows while lines play, never over a choice, and not in the 3–6 band. */
  private syncSkip(): void {
    const g = this.game();
    const sprout = !!g && textBandOf(g.world) === 'sprout';
    this.skipBtn.hidden = sprout || this.choices.childElementCount > 0;
    this.skipBtn.classList.toggle('small', !!g?.world.edu);
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
    SPEAKER_NOW.who = null;
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
    this.syncSkip();
    const who = line.who;
    const chorus = who === 'chorus';
    this.name.textContent = this.names[who] ?? speakerName(who, g, this.scene ?? '');
    this.name.hidden = who === 'narrator';
    // H6: only a spoken line has a speaker in the world; narration and the chorus have none.
    SPEAKER_NOW.who = who === 'narrator' || chorus ? null : who;
    // K37: the staging dressings read where the scene stands (the flower comes on the last line).
    LOOK_STATE.line = this.index;
    LOOK_STATE.lines = this.lines.length;
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
    // R0303: a line's sound cue plays however the text appears.
    if (line.sfx) playSound(line.sfx);
    // R0303 / R0368: the stage actor's reaction to the line (its own, or read from narration).
    this.stageReact.play(g, line, !!line.sfx);
    // Half-typed Hebrew would sit unisolated, so a line with script appears whole.
    if (reduce || hasScript(this.fullText)) {
      this.shown = this.fullText.length;
      this.finishText();
      return;
    }
    // R0302: punctuation holds a beat, and the speaker ticks in their own voice.
    const voice = g.world.settings.voiceBlips === false ? null : voiceOf(chorus ? 'narrator' : who);
    let holdUntil = 0;
    let typed = 0;
    // R0303: the line's stage directions: a held beat, a sound cue and a screen nudge.
    if (line.beat) holdUntil = performance.now() + line.beat;
    if (line.shake && !g.reduceMotion) nudgeScreen(line.shake);
    this.typing = window.setInterval(
      () => {
        const now = performance.now();
        if (now < holdUntil) return;
        const step = speed === 'fast' ? 4 : 2;
        for (let k = 0; k < step && this.shown < this.fullText.length; k++) {
          this.shown += 1;
          typed += 1;
          if (
            voice &&
            typed % TYPE_TIMING.blipEvery === 0 &&
            /\S/.test(this.fullText[this.shown - 1]!)
          )
            playBlip(voice.hz, voice.wave, voice.ms);
          const hold = pauseAfter(this.fullText, this.shown);
          if (hold > 0) {
            holdUntil = now + hold;
            break;
          }
        }
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
    this.lineExtras();
  }

  /**
   * R0304: a line's hands-on beat waits in the choice row once its text is whole (once per
   * line), and R0323: a sprout refrain line offers its Say it! button.
   */
  private lineExtras(): void {
    const line = this.lines[this.index];
    const g = this.game();
    if (!line || !g) return;
    const key = `${this.scene ?? ''}:${this.index}:${line.text}`;
    // R0323: a sprout refrain line gets a Say it! button beside the words.
    if (textBandOf(g.world) === 'sprout') {
      const refrain = refrainOf(line.text, line.refrain);
      if (refrain) this.text.append(sayItButton(refrain.sound));
    }
    if (line.act && this.actShown !== key && this.choices.childElementCount === 0) {
      this.actShown = key;
      const scene = this.scene;
      const act = line.act;
      this.next.hidden = true;
      renderLineAct(
        this.choices,
        act,
        textBandOf(g.world) === 'sprout',
        g.reduceMotion,
        (played) => {
          this.choices.innerHTML = '';
          this.next.hidden = false;
          if (played && scene && !this.external) g.send({ kind: 'lineAct', scene, act });
          this.advance();
        },
      );
      this.syncSkip();
    }
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
    const { sheet, key, mark } = portraitFrame(who, g, mood);
    const rect = sheet?.frames.get(key) ?? sheet?.frames.values().next().value;
    if (!sheet || !rect) return;
    this.portrait.dataset.mood = mood;
    // cg5: a skinned box on a phone frames a full-length figure head and shoulders, so a
    // dark outfit on a dark skin (the Warden on Logged In's terminal) still shows a face.
    const crop =
      key === frameKey('idle', 'front', 0) &&
      /\bbox-/.test(this.root.className) &&
      window.matchMedia?.('(max-width: 600px)').matches
        ? CG4_U4.box.phoneCrop
        : 1;
    const cw = Math.round(rect.w * crop);
    const ch = Math.round(rect.h * crop);
    ctx.drawImage(
      sheet.texture.image as HTMLCanvasElement,
      rect.x + Math.round((rect.w - cw) / 2),
      rect.y,
      cw,
      ch,
      0,
      0,
      this.portrait.width,
      this.portrait.height,
    );
    if (mark) {
      // A small emote ball at the top right, as over a Nubbin's head in the Grove.
      const r = 13;
      const x = this.portrait.width - r - 3;
      const y = r + 3;
      ctx.fillStyle = '#fff8e6';
      ctx.strokeStyle = '#2c2433';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2c2433';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(mark, x, y + 1);
    }
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

export function portraitFrame(
  who: string,
  g: Game,
  mood: Mood,
): { sheet: SpriteSheet | null; key: string; mark?: string } {
  const sheets = g.view.sheets;
  // H6: the world's speaker chevron follows the line on screen.
  if (who !== 'narrator') SPEAKER_NOW.who = who;
  // You wear your own outfit (trim in your side's colours), as in the Grove, so you never
  // share a portrait with the villager whose look you chose.
  // K8: a mood puts a face on the Keeper (smile, frown, surprise, eyes closed).
  const expr = expressionOf(mood);
  if (who === 'you') {
    const { trainer } = g.world;
    const side = g.world.keeper.alignment;
    if (expr) {
      // The grandchild's face, as on the Grove sprite (render/sprites/keeper.ts).
      const col = grandchildLook(keeperOutfit(trainer, side));
      const sheet = sheets.get(`face:you:${trainer}:${side}:grandchild`, () =>
        buildFaceSheet((e) => drawKeeperFrame('front', 'idle', 0, col, undefined, e, true)),
      );
      return { sheet, key: faceKey(expr) };
    }
    return { sheet: sheets.keeper(trainer, side), key: frameKey('idle', 'front', 0) };
  }
  // Nubbins have no surprised or puzzled face: the emote ball's mark says it (r1025 item 5).
  const mark = MOOD_MARK[mood];
  const marked = mark ? { mark } : {};
  if (who === 'moss' || who === 'sable' || who === 'wisp') {
    const c = g.world.campaign;
    const id = who === 'moss' ? c?.mossId : who === 'sable' ? c?.sableId : null;
    const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
    const key = frameKey(creatureClip(mood), 'front', 0);
    if (n) return { sheet: sheets.forNubbin(n), key, ...marked };
    return { sheet: sheets.rival('neutral', 'normal'), key, ...marked };
  }
  // r1025 item 5: a creature speaker (content kind 'nubbin') is drawn as a Nubbin of its own.
  if (CREATURE_SPEAKERS.has(who)) {
    const { band, type } = creatureLook(who);
    return {
      sheet: sheets.rival(band, type),
      key: frameKey(creatureClip(mood), 'front', 0),
      ...marked,
    };
  }
  // C2: a storyline speaker has a look of their own (`STORY_NPC_LOOKS`), never the player's.
  // K4, K38: Fern and Hazel go by their story looks (`storyId`). Anyone with no look is a
  // person seeded by their id (`generatedLook`, through `trainerLook`), never Fern.
  const id = storyId(who);
  if (expr) {
    const col = trainerLook(id);
    const look = npcLookOf(id);
    const sheet = sheets.get(`face:${id}`, () =>
      buildFaceSheet((e) => drawKeeperFrame('front', 'idle', 0, col, look, e)),
    );
    return { sheet, key: faceKey(expr) };
  }
  return { sheet: sheets.keeper(id), key: frameKey('idle', 'front', 0) };
}

/** A Nubbin portrait's clip for a line's mood: glad, sad, or its idle face. */
function creatureClip(mood: Mood): 'happy' | 'sad' | 'idle' {
  return mood === 'happy' || mood === 'soft'
    ? 'happy'
    : mood === 'sad' || mood === 'angry'
      ? 'sad'
      : 'idle';
}

/** Nubbins have no surprised or puzzled face: the emote ball's mark says it instead. */
const MOOD_MARK: Partial<Record<Mood, string>> = { shock: '!', think: '?' };

/** R0303: a little screen nudge for a line's `shake`, as a class on the page body. */
function nudgeScreen(size: 'small' | 'big'): void {
  const cls = size === 'big' ? 'line-shake-big' : 'line-shake';
  document.body.classList.remove('line-shake', 'line-shake-big');
  void document.body.offsetWidth;
  document.body.classList.add(cls);
  window.setTimeout(() => document.body.classList.remove(cls), 400);
}
