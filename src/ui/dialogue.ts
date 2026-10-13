import { TRAINER_LABELS } from '../config/strings';
import { ENDINGS, SPEAKERS, STORY_TEXT, UNDERSTUDY, type Line, type Mood } from '../config/story';
import type { Game } from '../game';
import { sceneById } from '../sim/campaign';
import { frameKey } from '../render/sprites/animations';
import type { SpriteSheet } from '../render/sprites/atlas';
import { button, el } from './dom';

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
  private readonly endTitle: HTMLDivElement;
  private lines: Line[] = [];
  private index = 0;
  private scene: string | null = null;
  private typing = 0;
  private fullText = '';
  private shown = 0;
  private afterLines: (() => void) | null = null;

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
      if ((e.target as HTMLElement).closest('.dialogue-choices')) return;
      this.advance();
    });
    window.addEventListener('keydown', (e) => {
      if (this.root.hidden || this.choices.childElementCount > 0) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
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
      button(STORY_TEXT.playOn, () => (this.endCard.hidden = true), 'btn btn-primary'),
    );
    this.endCard.appendChild(card);
    parent.append(this.root, this.endCard);
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  /** Show a scene by id. The sim is told when it is done. */
  play(sceneId: string): void {
    const scene = sceneById(sceneId);
    const g = this.game();
    if (!scene || !g) return;
    this.scene = sceneId;
    this.lines = scene.lines;
    this.index = 0;
    this.afterLines = () => {
      if (scene.choices && scene.choices.length > 0) {
        this.showChoices(scene.choices);
      } else {
        this.finish(null);
      }
    };
    this.root.hidden = false;
    this.showLine();
  }

  private showChoices(choices: NonNullable<ReturnType<typeof sceneById>>['choices']): void {
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
    clearInterval(this.typing);
    if (g && scene) g.send({ kind: 'sceneDone', scene, choice });
    if (scene?.startsWith('end-')) {
      const ending = ENDINGS[scene.slice(4)];
      this.endTitle.textContent = STORY_TEXT.endingReached(ending?.title ?? scene);
      this.endCard.hidden = false;
    }
  }

  private advance(): void {
    if (this.root.hidden) return;
    if (this.shown < this.fullText.length) {
      // Finish the line at once.
      clearInterval(this.typing);
      this.shown = this.fullText.length;
      this.text.textContent = this.fullText;
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
    const who = resolveSpeaker(line.who, g.world.trainer);
    this.name.textContent = speakerName(who, g);
    this.name.hidden = who === 'narrator';
    this.root.classList.toggle('narration', who === 'narrator');
    this.drawPortrait(who, g, line.mood ?? 'neutral');
    this.fullText = line.text;
    this.shown = 0;
    this.text.textContent = '';
    clearInterval(this.typing);
    const reduce = g.camera.reduceMotion;
    if (reduce) {
      this.shown = this.fullText.length;
      this.text.textContent = this.fullText;
      return;
    }
    this.typing = window.setInterval(() => {
      this.shown = Math.min(this.fullText.length, this.shown + 2);
      this.text.textContent = this.fullText.slice(0, this.shown);
      if (this.shown >= this.fullText.length) clearInterval(this.typing);
    }, 18);
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

/** The player's Keeper is "you"; a Keeper the player is playing hands their lines to an understudy. */
export function resolveSpeaker(who: string, playerTrainer: string): string {
  if (who === 'you') return playerTrainer;
  if (who === playerTrainer) return UNDERSTUDY[who] ?? 'fern';
  return who;
}

export function speakerName(who: string, g: Game): string {
  if (who === 'moss' || who === 'sable') {
    const c = g.world.campaign;
    const id = who === 'moss' ? c?.mossId : c?.sableId;
    const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
    return n?.name ?? SPEAKERS[who]?.name ?? who;
  }
  return TRAINER_LABELS[who]?.name ?? SPEAKERS[who]?.name ?? who;
}

function portraitFrame(who: string, g: Game, mood: Mood): { sheet: SpriteSheet | null; key: string } {
  const sheets = g.view.sheets;
  if (who === 'moss' || who === 'sable') {
    const c = g.world.campaign;
    const id = who === 'moss' ? c?.mossId : c?.sableId;
    const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
    const clip = mood === 'happy' || mood === 'soft' ? 'happy' : mood === 'sad' ? 'sad' : 'idle';
    if (n) return { sheet: sheets.forNubbin(n), key: frameKey(clip, 'front', 0) };
    return { sheet: sheets.rival('neutral', 'normal'), key: frameKey(clip, 'front', 0) };
  }
  return { sheet: sheets.keeper(who), key: frameKey('idle', 'front', 0) };
}
