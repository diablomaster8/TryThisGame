import { mergedLevels } from '../sim/partners';
import { hasSkill } from '../sim/skills';
import { NAMES, UI_TEXT } from '../config/strings';
import { KARATE } from '../config/tuning';
import type { Game } from '../game';
import { PX } from '../render/sprites/pixel-canvas';
import { CLIPS, frameAt, frameKey, type ClipName } from '../render/sprites/animations';
import type { SpriteSheet } from '../render/sprites/atlas';
import { drawShadowText, drawText } from '../render/sprites/font';
import { C, color } from '../render/sprites/palette';
import { playSound } from '../platform/audio';
import { barOffset, createBout, prizeForBout, stepBout, strike, type Bout } from '../sim/karate';
import type { Nubbin } from '../sim/types';
import { button, el, modal } from './dom';

const VIEW_H = 200;

/** Pick a tier, then fight. Belts unlock the next tier. */
export class KarateMenu {
  private readonly dialog;
  private readonly list: HTMLDivElement;
  readonly screen: KarateScreen;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
    private readonly fighterPick: () => Nubbin | null,
  ) {
    this.dialog = modal(parent, UI_TEXT.karate, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.karateHelp));
    this.list = el('div', 'shop-list');
    this.dialog.body.appendChild(this.list);
    this.screen = new KarateScreen(parent);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private refresh(): void {
    const g = this.game();
    if (!g) return;
    this.list.innerHTML = '';
    this.list.appendChild(el('div', 'btn-name', UI_TEXT.belt(g.world.karate.belt)));
    const row = el('div', 'shop-row race-row');
    const text = el('div');
    text.append(
      el('strong', undefined, 'Dojo'),
      el('small', undefined, `${g.world.karate.wins} wins · ${g.world.karate.losses} losses`),
    );
    const tiers = el('div', 'race-tiers');
    for (let tier = 1; tier <= KARATE.tiers; tier++) {
      const b = button(UI_TEXT.tierLabel(tier), () => this.start(tier), 'btn btn-small');
      b.disabled = tier > g.world.karate.belt + 1;
      if (tier <= g.world.karate.belt) b.classList.add('active');
      tiers.appendChild(b);
    }
    row.append(text, tiers);
    this.list.appendChild(row);
  }

  private start(tier: number): void {
    const g = this.game();
    if (!g) return;
    const fighter = this.fighterPick();
    if (!fighter) {
      this.toast(UI_TEXT.expeditionNeedsNubbin);
      return;
    }
    this.close();
    g.renderPaused = true;
    const seed = Date.now() % 2147483647;
    const bout = createBout(
      fighter,
      tier,
      seed,
      mergedLevels(g.world, fighter) ?? undefined,
      hasSkill(g.world, 'thickSkin') ? 10 : 0,
    );
    this.screen.start(
      bout,
      fighter,
      g.view.sheets.forNubbin(fighter),
      g.view.sheets.rival('moon', 'power'),
      (won) => {
        g.renderPaused = false;
        if (won === null) {
          this.toast(UI_TEXT.karateLeft);
          return;
        }
        const shells = prizeForBout(tier, won);
        g.send({
          kind: 'karateResult',
          nubbinId: fighter.id,
          won,
          tier,
          shells,
          rival: { name: bout.rival.name, species: 'chao' },
        });
        this.toast(won ? UI_TEXT.karateWon(fighter.name) : UI_TEXT.karateLost(fighter.name));
      },
    );
  }
}

/** The bout on a 2D canvas: two fighters side-on, HP bars, the swinging timing bar. */
export class KarateScreen {
  private readonly root: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly hud: HTMLDivElement;
  private readonly strikeBtn: HTMLButtonElement;
  private readonly quitBtn: HTMLButtonElement;
  private readonly results: HTMLDivElement;
  private readonly resultsBody: HTMLDivElement;
  private bout: Bout | null = null;
  private player: { name: string; sheet: SpriteSheet } | null = null;
  private rivalSheet: SpriteSheet | null = null;
  private onDone: ((won: boolean | null) => void) | null = null;
  private rafId = 0;
  private lastMs = 0;
  private viewW = 320;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'expedition karate');
    this.root.hidden = true;
    this.canvas = el('canvas', 'expedition-canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
    this.hud = el('div', 'expedition-hud');
    this.strikeBtn = button(UI_TEXT.strike, () => this.strike(), 'btn btn-primary cheer');
    this.quitBtn = button('✕', () => this.finish(), 'btn btn-icon quit');
    this.quitBtn.title = UI_TEXT.quitMinigame;
    this.results = el('div', 'modal');
    this.results.hidden = true;
    const card = el('div', 'modal-card');
    card.appendChild(el('h2', undefined, UI_TEXT.karateResults));
    this.resultsBody = el('div');
    card.append(
      this.resultsBody,
      button(UI_TEXT.backToGrove, () => this.finish(), 'btn btn-primary'),
    );
    this.results.appendChild(card);
    // The results card joins the DOM only when shown: no hidden duplicate "Back to the Grove".
    this.root.append(this.canvas, this.hud, this.strikeBtn, this.quitBtn);
    parent.appendChild(this.root);
    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.strike();
    });
    window.addEventListener('keydown', (e) => {
      if (this.root.hidden || e.repeat) return;
      if (e.key === 'Escape') this.finish();
      if (e.key === ' ') {
        e.preventDefault();
        this.strike();
      }
    });
    window.addEventListener('resize', () => !this.root.hidden && this.resize());
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  start(
    bout: Bout,
    player: Nubbin,
    playerSheet: SpriteSheet,
    rivalSheet: SpriteSheet,
    onDone: (won: boolean | null) => void,
  ): void {
    this.bout = bout;
    this.player = { name: player.name, sheet: playerSheet };
    this.rivalSheet = rivalSheet;
    this.onDone = onDone;
    this.results.hidden = true;
    this.results.remove();
    this.root.hidden = false;
    this.resize();
    this.lastMs = 0;
    this.rafId = requestAnimationFrame(this.frame);
  }

  private strike(): void {
    if (!this.bout || this.bout.finished) return;
    strike(this.bout);
    playSound(this.bout.lastHit?.dodged ? 'tap' : 'hit');
  }

  private finish(): void {
    // A bout left before it ended is abandoned, not lost.
    const won = this.bout?.finished ? (this.bout.won ?? false) : null;
    cancelAnimationFrame(this.rafId);
    this.root.hidden = true;
    this.bout = null;
    this.onDone?.(won);
    this.onDone = null;
  }

  resize(): void {
    const rect = this.root.getBoundingClientRect();
    const aspect = rect.width / Math.max(1, rect.height);
    this.viewW = Math.round(Math.max(220, Math.min(420, VIEW_H * aspect)));
    this.canvas.width = this.viewW * PX;
    this.canvas.height = VIEW_H * PX;
    const scale = Math.min(rect.width / this.viewW, rect.height / VIEW_H);
    this.canvas.style.width = `${Math.floor(this.viewW * scale)}px`;
    this.canvas.style.height = `${Math.floor(VIEW_H * scale)}px`;
  }

  /** For tests and console driving. */
  frame = (nowMs: number): void => {
    const b = this.bout;
    if (!b) return;
    const dt = this.lastMs === 0 ? 0 : Math.min(100, nowMs - this.lastMs);
    this.lastMs = nowMs;
    stepBout(b, dt);
    this.draw(b, nowMs);
    this.hud.textContent = `${b.player.name} ${Math.ceil(b.player.hp)} · ${b.rival.name} ${Math.ceil(b.rival.hp)}`;
    this.strikeBtn.disabled = b.finished;
    if (b.finished && this.results.hidden) {
      this.resultsBody.innerHTML = '';
      this.resultsBody.appendChild(
        el(
          'p',
          'celebrate-form',
          b.won ? UI_TEXT.karateWon(b.player.name) : UI_TEXT.karateLost(b.player.name),
        ),
      );
      this.resultsBody.appendChild(
        el('p', undefined, `+${prizeForBout(b.tier, b.won ?? false)} ${NAMES.currency}`),
      );
      this.root.appendChild(this.results);
      this.results.hidden = false;
      playSound(b.won ? 'win' : 'sad');
    }
    if (!b.finished || this.results.hidden) this.rafId = requestAnimationFrame(this.frame);
  };

  private draw(b: Bout, nowMs: number): void {
    const ctx = this.ctx;
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const W = this.viewW;
    const H = VIEW_H;
    // Dojo floor and wall.
    ctx.fillStyle = color(C.sand);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color(C.wood);
    ctx.fillRect(0, 0, W, 90);
    ctx.fillStyle = color(C.bark);
    for (let x = 0; x < W; x += 24) ctx.fillRect(x, 0, 2, 90);
    ctx.fillStyle = color(C.sandDeep);
    ctx.fillRect(0, 150, W, H - 150);
    const floorY = 150;
    // Fighters.
    const hit = b.lastHit && b.timeMs - b.lastHit.atMs < 220 ? b.lastHit : null;
    const drawFighter = (
      sheet: SpriteSheet | null,
      x: number,
      flip: boolean,
      who: 'player' | 'rival',
    ) => {
      if (!sheet) return;
      const attacking = hit?.who === who;
      const struck = hit && hit.who !== who && !hit.dodged;
      const clip: ClipName = attacking ? 'happy' : struck ? 'sad' : 'idle';
      const f = frameAt(CLIPS[clip], nowMs);
      const rect =
        sheet.frames.get(frameKey(clip, 'side', f)) ??
        sheet.frames.get(frameKey('idle', 'side', 0));
      if (!rect) return;
      const image = sheet.texture.image as HTMLCanvasElement;
      const w = rect.w / PX;
      const h = rect.h / PX;
      const lunge = attacking ? (who === 'player' ? 10 : -10) : 0;
      const dx = Math.round(x + lunge - w / 2);
      const dy = floorY - h + 2;
      ctx.save();
      if (flip) {
        ctx.translate(dx + w, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, w, h);
      } else {
        ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, dx, dy, w, h);
      }
      ctx.restore();
      if (hit && hit.who !== who && hit.dodged)
        drawText(ctx, 'MISS', x, dy - 12, color(C.pale), 1, 'center');
      else if (struck)
        drawText(
          ctx,
          hit!.strong ? 'POW!' : 'hit',
          x,
          dy - 12,
          color(hit!.strong ? C.ember : C.cream),
          1,
          'center',
        );
    };
    drawFighter(this.player?.sheet ?? null, W * 0.32, false, 'player');
    drawFighter(this.rivalSheet, W * 0.68, true, 'rival');
    // HP bars.
    const bar = (x: number, y: number, w: number, frac: number, fg: number) => {
      ctx.fillStyle = color(C.darkPlum);
      ctx.fillRect(x, y, w, 8);
      ctx.fillStyle = color(fg);
      ctx.fillRect(x + 1, y + 1, Math.round((w - 2) * Math.max(0, frac)), 6);
    };
    bar(10, 10, W * 0.4 - 10, b.player.hp / b.player.maxHp, C.leaf);
    bar(W * 0.6, 10, W * 0.4 - 10, b.rival.hp / b.rival.maxHp, C.rose);
    drawShadowText(ctx, b.player.name, 10, 20, color(C.cream), color(C.darkPlum));
    drawShadowText(ctx, b.rival.name, W - 10, 20, color(C.cream), color(C.darkPlum), 1, 'right');
    // Timing bar: a sweet spot in the middle.
    const bx = W * 0.2;
    const bw = W * 0.6;
    const by = H - 30;
    ctx.fillStyle = color(C.darkPlum);
    ctx.fillRect(bx, by, bw, 10);
    const sweet = KARATE.sweetSpot;
    ctx.fillStyle = color(C.sunYellow);
    ctx.fillRect(bx + (bw * (1 - sweet)) / 2, by + 1, bw * sweet, 8);
    const px = bx + b.bar * bw;
    ctx.fillStyle = color(barOffset(b) <= sweet ? C.white : C.skyLight);
    ctx.fillRect(Math.round(px) - 1, by - 3, 3, 16);
    drawText(ctx, 'TAP IN THE MIDDLE', W / 2, by - 12, color(C.cream), 1, 'center');
  }
}
