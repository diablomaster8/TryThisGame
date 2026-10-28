import { NAMES, UI_TEXT } from '../config/strings';
import { BATTLE_TEXT, combatantName } from '../config/strings-battle';
import { BATTLE } from '../config/tuning-battle';
import type { Game } from '../game';
import { PX } from '../render/sprites/pixel-canvas';
import { CLIPS, frameAt, frameKey, type ClipName } from '../render/sprites/animations';
import type { SpriteSheet } from '../render/sprites/atlas';
import { drawShadowText, drawText } from '../render/sprites/font';
import { C, color } from '../render/sprites/palette';
import { playSound } from '../platform/audio';
import {
  barAt,
  barOffsetAt,
  battleAct,
  battleSeedFor,
  createBattle,
  prizeFor,
  type BattleContext,
  type BattleState,
} from '../sim/battle';
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
    for (let tier = 1; tier <= BATTLE.karate.tiers; tier++) {
      const b = button(UI_TEXT.tierLabel(tier), () => this.start(tier), 'btn btn-small');
      b.disabled = tier > g.world.karate.belt + 1;
      if (tier <= g.world.karate.belt) b.classList.add('active');
      tiers.appendChild(b);
    }
    row.append(text, tiers);
    this.list.appendChild(row);
  }

  /**
   * The bout runs twice from one seed: here, for drawing at frame rate, and in the sim
   * (`world.battle`), which gets the same taps and decides the result and the prize. The rival's
   * strikes fall at fixed times, so both copies agree whatever the frame rate.
   */
  private start(tier: number): void {
    const g = this.game();
    if (!g) return;
    const fighter = this.fighterPick();
    if (!fighter) {
      this.toast(UI_TEXT.expeditionNeedsNubbin);
      return;
    }
    const context: BattleContext = { kind: 'karate', tier, nubbinId: fighter.id };
    const bout = createBattle(g.world, context, battleSeedFor(g.world, context));
    if (!bout) {
      this.toast(UI_TEXT.expeditionNeedsNubbin);
      return;
    }
    this.close();
    g.send({ kind: 'battleStart', context });
    g.renderPaused = true;
    this.screen.start(
      bout,
      fighter,
      g.view.sheets.forNubbin(fighter),
      g.view.sheets.rival('moon', 'power'),
      (action) => g.send({ kind: 'battleAct', action }),
      (s) => {
        g.renderPaused = false;
        if (!s?.result) {
          g.send({ kind: 'battleForfeit' });
          this.toast(UI_TEXT.karateLeft);
          return;
        }
        const w = s.result.winner;
        this.toast(
          w === 0
            ? BATTLE_TEXT.karateWon(fighter.name)
            : w === 1
              ? BATTLE_TEXT.karateLost(fighter.name)
              : BATTLE_TEXT.karateDraw(fighter.name),
        );
      },
    );
  }
}

type Act = { k: 'tap'; atMs: number } | { k: 'advance'; toMs: number };

/** How long the nap or the walk home plays before the results card. */
const OUTRO_MS = 1800;

/**
 * The bout on a 2D canvas: two fighters side-on, HP bars, the swinging timing bar. When it
 * ends, the tuckered fighter either naps under a leaf (ours) or waves and toddles home (the
 * rival) before the results card shows.
 */
export class KarateScreen {
  private readonly root: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly hud: HTMLDivElement;
  private readonly strikeBtn: HTMLButtonElement;
  private readonly quitBtn: HTMLButtonElement;
  private readonly results: HTMLDivElement;
  private readonly resultsBody: HTMLDivElement;
  private bout: BattleState | null = null;
  private player: { name: string; sheet: SpriteSheet } | null = null;
  private rivalSheet: SpriteSheet | null = null;
  private onAct: ((a: Act) => void) | null = null;
  private onDone: ((s: BattleState | null) => void) | null = null;
  private rafId = 0;
  private lastMs = 0;
  /** Bout time on this screen's clock. */
  private boutMs = 0;
  /** Frame time when the result came in, for the outro. */
  private endedAt = 0;
  private viewW = 320;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'expedition karate');
    this.root.hidden = true;
    this.canvas = el('canvas', 'expedition-canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
    this.hud = el('div', 'expedition-hud');
    this.hud.setAttribute('aria-live', 'off');
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
    bout: BattleState,
    player: Nubbin,
    playerSheet: SpriteSheet,
    rivalSheet: SpriteSheet,
    onAct: (a: Act) => void,
    onDone: (s: BattleState | null) => void,
  ): void {
    this.bout = bout;
    this.player = { name: player.name, sheet: playerSheet };
    this.rivalSheet = rivalSheet;
    this.onAct = onAct;
    this.onDone = onDone;
    this.results.hidden = true;
    this.results.remove();
    this.root.hidden = false;
    this.resize();
    this.lastMs = 0;
    this.boutMs = 0;
    this.endedAt = 0;
    this.rafId = requestAnimationFrame(this.frame);
  }

  private act(a: Act): void {
    if (!this.bout) return;
    battleAct(this.bout, a);
    this.onAct?.(a);
  }

  private strike(): void {
    const b = this.bout;
    if (!b || b.result) return;
    this.act({ k: 'tap', atMs: Math.round(this.boutMs) });
    playSound(b.karate?.lastHit?.dodged ? 'tap' : 'hit');
  }

  private finish(): void {
    // A bout left before it ended is abandoned, not lost.
    const s = this.bout?.result ? this.bout : null;
    cancelAnimationFrame(this.rafId);
    this.root.hidden = true;
    this.bout = null;
    this.onDone?.(s);
    this.onDone = null;
    this.onAct = null;
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
    if (!b || !b.karate) return;
    const dt = this.lastMs === 0 ? 0 : Math.min(100, nowMs - this.lastMs);
    this.lastMs = nowMs;
    if (!b.result) {
      this.boutMs += dt;
      battleAct(b, { k: 'advance', toMs: Math.round(this.boutMs) });
      // The sim learns the end time once, so its copy finishes on the same strike.
      if (b.result) this.onAct?.({ k: 'advance', toMs: b.karate.timeMs });
    }
    if (b.result && this.endedAt === 0) {
      this.endedAt = nowMs;
      playSound(b.result.winner === 0 ? 'win' : 'sad');
    }
    const me = b.sides[0][0]!;
    const rival = b.sides[1][0]!;
    this.draw(b, nowMs);
    this.hud.textContent = BATTLE_TEXT.status(
      combatantName(me),
      Math.ceil(me.hp),
      combatantName(rival),
      Math.ceil(rival.hp),
    );
    this.strikeBtn.disabled = !!b.result;
    if (b.result && this.results.hidden && nowMs - this.endedAt >= this.outroMs()) {
      this.resultsBody.innerHTML = '';
      const w = b.result.winner;
      const name = this.player?.name ?? combatantName(me);
      this.resultsBody.appendChild(
        el(
          'p',
          'celebrate-form',
          w === 0
            ? BATTLE_TEXT.karateWon(name)
            : w === 1
              ? BATTLE_TEXT.karateLost(name)
              : BATTLE_TEXT.karateDraw(name),
        ),
      );
      this.resultsBody.appendChild(
        el('p', undefined, BATTLE_TEXT.prize(prizeFor(b.context, b.result), NAMES.currency)),
      );
      this.root.appendChild(this.results);
      this.results.hidden = false;
    }
    if (!b.result || this.results.hidden) this.rafId = requestAnimationFrame(this.frame);
  };

  private outroMs(): number {
    return document.documentElement.classList.contains('reduce-motion') ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      ? 300
      : OUTRO_MS;
  }

  private draw(b: BattleState, nowMs: number): void {
    const clock = b.karate!;
    const ctx = this.ctx;
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const W = this.viewW;
    const H = VIEW_H;
    const me = b.sides[0][0]!;
    const rival = b.sides[1][0]!;
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
    // After the bout: 0..1 through the outro.
    const outro = b.result ? Math.min(1, (nowMs - this.endedAt) / this.outroMs()) : 0;
    const last = clock.lastHit;
    const hit = !b.result && last && clock.timeMs - last.atMs < 220 ? last : null;
    const drawFighter = (sheet: SpriteSheet | null, x: number, flip: boolean, who: 0 | 1) => {
      if (!sheet) return;
      const tuckered = (who === 0 ? me : rival).hp <= 0;
      const attacking = hit?.who === who;
      const struck = hit && hit.who !== who && !hit.dodged;
      // Ours naps; the rival waves, then walks home off the right edge.
      const walking = tuckered && who === 1 && outro > 0.3;
      const clip: ClipName = tuckered
        ? who === 0
          ? 'sleep'
          : walking
            ? 'walk'
            : 'happy'
        : attacking
          ? 'happy'
          : struck
            ? 'sad'
            : 'idle';
      const f = frameAt(CLIPS[clip], nowMs);
      const rect =
        sheet.frames.get(frameKey(clip, 'side', f)) ??
        sheet.frames.get(frameKey('idle', 'side', 0));
      if (!rect) return;
      const image = sheet.texture.image as HTMLCanvasElement;
      const w = rect.w / PX;
      const h = rect.h / PX;
      const lunge = attacking ? (who === 0 ? 10 : -10) : 0;
      const home = walking ? ((outro - 0.3) / 0.7) * (W - x + w) : 0;
      const dx = Math.round(x + lunge + home - w / 2);
      const dy = floorY - h + 2;
      // Walking home it faces the way it goes.
      const faceLeft = walking ? false : flip;
      ctx.save();
      if (faceLeft) {
        ctx.translate(dx + w, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, w, h);
      } else {
        ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, dx, dy, w, h);
      }
      ctx.restore();
      if (tuckered && who === 0) {
        // A leaf blanket drifts down and settles over the napper.
        const ly = Math.round(dy - 20 + Math.min(1, outro * 1.5) * (h * 0.55 + 20));
        ctx.fillStyle = color(C.leaf);
        ctx.fillRect(Math.round(x - w * 0.35), ly, Math.round(w * 0.7), 4);
        ctx.fillRect(Math.round(x - w * 0.25), ly - 2, Math.round(w * 0.5), 2);
        drawText(ctx, BATTLE_TEXT.zzz, x + w * 0.4, dy - 10, color(C.cream), 1, 'center');
      } else if (tuckered && who === 1 && !walking) {
        drawText(ctx, BATTLE_TEXT.bye, dx + w / 2, dy - 12, color(C.cream), 1, 'center');
      } else if (hit && hit.who !== who && hit.dodged)
        drawText(ctx, BATTLE_TEXT.miss, x, dy - 12, color(C.pale), 1, 'center');
      else if (struck)
        drawText(
          ctx,
          hit!.strong ? BATTLE_TEXT.pow : BATTLE_TEXT.hitWord,
          x,
          dy - 12,
          color(hit!.strong ? C.ember : C.cream),
          1,
          'center',
        );
    };
    drawFighter(this.player?.sheet ?? null, W * 0.32, false, 0);
    drawFighter(this.rivalSheet, W * 0.68, true, 1);
    // HP bars.
    const bar = (x: number, y: number, w: number, frac: number, fg: number) => {
      ctx.fillStyle = color(C.darkPlum);
      ctx.fillRect(x, y, w, 8);
      ctx.fillStyle = color(fg);
      ctx.fillRect(x + 1, y + 1, Math.round((w - 2) * Math.max(0, frac)), 6);
    };
    bar(10, 10, W * 0.4 - 10, me.hp / me.maxHp, C.leaf);
    bar(W * 0.6, 10, W * 0.4 - 10, rival.hp / rival.maxHp, C.rose);
    drawShadowText(ctx, combatantName(me), 10, 20, color(C.cream), color(C.darkPlum));
    drawShadowText(
      ctx,
      combatantName(rival),
      W - 10,
      20,
      color(C.cream),
      color(C.darkPlum),
      1,
      'right',
    );
    // Timing bar: a sweet spot in the middle.
    const bx = W * 0.2;
    const bw = W * 0.6;
    const by = H - 30;
    ctx.fillStyle = color(C.darkPlum);
    ctx.fillRect(bx, by, bw, 10);
    const sweet = BATTLE.karate.sweetSpot;
    ctx.fillStyle = color(C.sunYellow);
    ctx.fillRect(bx + (bw * (1 - sweet)) / 2, by + 1, bw * sweet, 8);
    const px = bx + barAt(clock, clock.timeMs) * bw;
    ctx.fillStyle = color(barOffsetAt(clock, clock.timeMs) <= sweet ? C.white : C.skyLight);
    ctx.fillRect(Math.round(px) - 1, by - 3, 3, 16);
    drawText(ctx, BATTLE_TEXT.tapMiddle, W / 2, by - 12, color(C.cream), 1, 'center');
  }
}
