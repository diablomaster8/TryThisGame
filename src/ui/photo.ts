import {
  formatDuration,
  NAMES,
  STAGE_LABELS,
  STORY_UI_TEXT,
  TITLE_CARD_TEXT,
  UI_TEXT,
} from '../config/strings';
import { CG2_U } from '../config/tuning-u';
import type { Game } from '../game';
import { frameKey } from '../render/sprites/animations';
import { drawShadowText, drawText } from '../render/sprites/font';
import { C, color } from '../render/sprites/palette';
import { keyLabel } from './collection';
import { formKey } from '../sim/collection';
import type { Nubbin } from '../sim/types';
import { button, el, modal } from './dom';
import { CHAPTER_PHOTO_EVENT, chapterShot, type ChapterShot } from './chapter-photo';
import { PHOTO_TEXT } from '../config/strings-look';
import { photoComedy, wrapCaption } from './photo-comedy';
import { ALBUM_TEXT, PHOTO_STICKER_GLYPHS } from '../config/strings-look';
import { ALBUM, PHOTO_STICKERS } from '../config/tuning-look';
import { addPhoto, listPhotos } from '../platform/photo-album';
import { Album } from './album';
import { PHOTO_SELFIE_TEXT } from '../config/strings-look-r9e'; /* Lane E r9 */

/** A framed snapshot of a Nubbin, drawn on the pixel grid, saved as a PNG. */
export class PhotoMode {
  private readonly dialog;
  private readonly canvas: HTMLCanvasElement;
  private readonly save: HTMLButtonElement;
  private readonly help: HTMLParagraphElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly selected: () => string | null,
  ) {
    this.dialog = modal(parent, UI_TEXT.photo, UI_TEXT.close);
    this.help = el('p', 'help', UI_TEXT.photoHelp);
    this.dialog.body.appendChild(this.help);
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'photo-canvas';
    this.dialog.body.appendChild(this.canvas);
    this.save = button(UI_TEXT.savePhoto, () => this.download(), 'btn btn-primary');
    this.dialog.body.appendChild(this.save);
    // FUN-39: after a blink, a retake next to the "keep it anyway" save.
    this.retake = button(PHOTO_TEXT.retake, () => this.reshoot(), 'btn');
    this.retake.hidden = true;
    this.dialog.body.appendChild(this.retake);
    // A keepsake of the chapter just closed (N6): the offer card sends this event.
    this.switcher = button('', () => this.toggle(), 'btn');
    this.dialog.body.appendChild(this.switcher);
    window.addEventListener(CHAPTER_PHOTO_EVENT, () => this.openChapter());
    // R0441: stickers on the photo; R0425: the album of saved photos.
    const row = el('div', 'photo-stickers');
    row.setAttribute('aria-label', ALBUM_TEXT.stickers);
    for (const glyph of PHOTO_STICKER_GLYPHS)
      row.appendChild(button(glyph, () => this.addSticker(glyph), 'btn btn-small photo-sticker'));
    row.appendChild(button(ALBUM_TEXT.clear, () => this.clearStickers(), 'btn btn-small'));
    this.dialog.body.appendChild(row);
    this.album = new Album(parent);
    this.albumBtn = button(ALBUM_TEXT.open, () => void this.album.open(), 'btn');
    this.dialog.body.appendChild(this.albumBtn);
    // Lane E r9, R0441: the "With me" selfie with the Keeper.
    this.selfieBtn = button(`🤳 ${PHOTO_SELFIE_TEXT.withMe}`, () => this.toggleSelfie(), 'btn');
    this.dialog.body.appendChild(this.selfieBtn);
  }

  private readonly album: Album;
  /* Lane E r9 */
  private readonly selfieBtn: HTMLButtonElement;
  /** R0441: the Keeper is in the photo, holding the Nubbin. */
  private withMe = false;

  /** R0441: switch the selfie on or off; in Full 3D the Keeper first picks the Nubbin up. */
  private toggleSelfie(): void {
    const g = this.game();
    const n = this.nubbin(g);
    if (!g || !n || this.mode !== 'nubbin') return;
    this.withMe = !this.withMe;
    this.selfieBtn.textContent = this.withMe
      ? PHOTO_SELFIE_TEXT.alone
      : `🤳 ${PHOTO_SELFIE_TEXT.withMe}`;
    if (this.withMe && g.scene3d && g.world.keeper.carrying !== n.id) {
      g.send({ kind: 'pickUp', nubbinId: n.id });
      this.help.textContent = PHOTO_SELFIE_TEXT.fetching;
      this.waitCarry(n.id, 0);
    }
    this.redraw();
  }

  /** R0441: redraw once the Keeper has the Nubbin in its arms (a few seconds at most). */
  private waitCarry(id: string, tries: number): void {
    window.setTimeout(() => {
      const g = this.game();
      if (!g || !this.withMe || !this.isOpen()) return;
      if (g.world.keeper.carrying === id) window.setTimeout(() => this.redraw(), 300);
      else if (tries < 24) this.waitCarry(id, tries + 1);
    }, 250);
  }

  private readonly albumBtn: HTMLButtonElement;
  /** R0441: stickers placed on this photo, in 160-wide photo units. */
  private stickers: { glyph: string; x: number; y: number }[] = [];
  /** R0425: who is in the photo and its caption, for the album. */
  private lastIds: string[] = [];
  private lastCaption = '';

  private addSticker(glyph: string): void {
    const spots = PHOTO_STICKERS.spots;
    if (this.stickers.length >= PHOTO_STICKERS.max) this.stickers.shift();
    const [x, y] = spots[this.stickers.length % spots.length]!;
    this.stickers.push({ glyph, x, y });
    this.redraw();
  }

  private clearStickers(): void {
    this.stickers = [];
    this.redraw();
  }

  /** Draw the same photo again (stickers changed), without a new shot. */
  private redraw(): void {
    const g = this.game();
    const n = this.nubbin(g);
    if (g && n && this.mode === 'nubbin') this.render(g, n);
  }

  /** R0441: the stickers, outlined so they read on sky and grass alike. */
  private drawStickers(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 14px sans-serif';
    ctx.lineWidth = 2;
    ctx.strokeStyle = color(C.cream);
    ctx.fillStyle = color(C.berry);
    for (const s of this.stickers) {
      ctx.strokeText(s.glyph, s.x, s.y);
      ctx.fillText(s.glyph, s.x, s.y);
    }
    ctx.restore();
  }

  private readonly switcher: HTMLButtonElement;
  private readonly retake: HTMLButtonElement;
  /** FUN-39: how many Nubbin photos this session, the seed of each one's comedy. */
  private shot = 0;
  private mode: 'nubbin' | 'chapter' = 'nubbin';

  /** Open on the last chapter photo, if there is one. */
  openChapter(): void {
    if (!chapterShot.get() || !this.game()) return;
    this.mode = 'chapter';
    this.drawMode();
    this.dialog.show();
  }

  private toggle(): void {
    this.mode = this.mode === 'chapter' ? 'nubbin' : 'chapter';
    this.drawMode();
  }

  private drawMode(): void {
    const g = this.game();
    const shot = chapterShot.get();
    if (this.mode === 'chapter' && shot) this.renderChapter(shot);
    else {
      this.mode = 'nubbin';
      const n = this.nubbin(g);
      if (g && n) this.render(g, n);
    }
    this.switcher.hidden = !shot;
    this.switcher.textContent =
      this.mode === 'chapter' ? STORY_UI_TEXT.nubbinPhoto : `📷 ${STORY_UI_TEXT.chapterPhoto}`;
    this.help.textContent =
      this.mode === 'chapter' ? STORY_UI_TEXT.chapterPhotoHelp : UI_TEXT.photoHelp;
  }

  private nubbin(g: Game | null): Nubbin | undefined {
    if (!g) return undefined;
    const id = this.selected();
    return (
      (id ? g.world.nubbins.find((x) => x.id === id) : undefined) ??
      g.world.nubbins.find((x) => x.stage !== 'egg')
    );
  }

  /** The chapter's staged frame in the same cream frame as a Nubbin photo. */
  private renderChapter(shot: ChapterShot): void {
    const W = 160;
    const H = 128;
    const S = 3;
    this.canvas.width = W * S;
    this.canvas.height = H * S;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(S, 0, 0, S, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = color(C.cream);
    ctx.fillRect(0, 0, W, H);
    const pw = CG2_U.photo.w;
    const ph = CG2_U.photo.h;
    ctx.fillStyle = color(C.darkPlum);
    ctx.fillRect(W / 2 - pw / 2 - 1, 5, pw + 2, ph + 2);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(shot.canvas, W / 2 - pw / 2, 6, pw, ph);
    ctx.imageSmoothingEnabled = false;
    const y = 6 + ph + 10;
    drawShadowText(ctx, shot.title, W / 2, y, color(C.darkPlum), color(C.cream), 1, 'center');
    drawText(
      ctx,
      `${shot.campaign.replace(/[’‘]/g, "'")} · ${TITLE_CARD_TEXT.chapter(shot.chapter)}`,
      W / 2,
      y + 9,
      color(C.plum),
      1,
      'center',
    );
    drawText(
      ctx,
      `${NAMES.game} · ${new Date().toLocaleDateString()}`,
      W / 2,
      y + 18,
      color(C.lilacGrey),
      1,
      'center',
    );
  }

  open(): void {
    const g = this.game();
    if (!g) return;
    this.mode = 'nubbin';
    this.switcher.hidden = !chapterShot.get();
    this.switcher.textContent = `📷 ${STORY_UI_TEXT.chapterPhoto}`;
    this.help.textContent = UI_TEXT.photoHelp;
    const id = this.selected();
    const n =
      (id ? g.world.nubbins.find((x) => x.id === id) : undefined) ??
      g.world.nubbins.find((x) => x.stage !== 'egg');
    if (!n) return;
    this.shot++;
    this.stickers = [];
    this.withMe = false; /* Lane E r9 */
    this.selfieBtn.textContent = `🤳 ${PHOTO_SELFIE_TEXT.withMe}`;
    this.render(g, n);
    // R0425: the album button hides when photo storage is unavailable.
    void listPhotos().then((p) => (this.albumBtn.hidden = p === null));
    g.send({ kind: 'photoTaken', species: n.species });
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  /** FUN-39: take the photo again after a blink. */
  private reshoot(): void {
    const g = this.game();
    const n = this.nubbin(g);
    if (!g || !n) return;
    this.shot++;
    this.render(g, n);
  }

  private render(g: Game, n: Nubbin): void {
    const fun = photoComedy(g.world, n, this.shot);
    this.lastIds = [n.id];
    this.lastCaption = `${n.name}`;
    if (this.withMe) this.lastCaption = PHOTO_SELFIE_TEXT.caption(n.name); /* Lane E r9 */
    this.retake.hidden = !fun.blink;
    this.save.textContent = fun.blink ? PHOTO_TEXT.keepAnyway : UI_TEXT.savePhoto;
    if (fun.blink) this.help.textContent = PHOTO_TEXT.blinkHelp;
    else if (this.mode === 'nubbin') this.help.textContent = UI_TEXT.photoHelp;
    const W = 160;
    // Tall enough that the four lines of the footer sit inside the frame (bug 19).
    // FUN-39: taller by the caption's lines.
    const H = 128 + wrapCaption(fun.caption, W - 12).length * 9;
    const S = 3;
    this.canvas.width = W * S;
    this.canvas.height = H * S;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(S, 0, 0, S, 0, 0);
    ctx.imageSmoothingEnabled = false;
    // Frame and a sky-to-grass backdrop.
    ctx.fillStyle = color(C.cream);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color(C.skyLight);
    ctx.fillRect(6, 6, W - 12, 60);
    ctx.fillStyle = color(C.grass);
    ctx.fillRect(6, 66, W - 12, H - 72);
    ctx.fillStyle = color(C.leaf);
    for (let x = 8; x < W - 8; x += 7) ctx.fillRect(x, 66 + ((x * 7) % 5), 2, 1);
    // In Full 3D the picture is the Nubbin as it stands in the 3D Grove, not the sprite.
    // Lane E r9, R0441: with the Keeper, the selfie once it holds the Nubbin.
    const selfie3d =
      this.withMe && g.world.keeper.carrying === n.id
        ? (g.scene3d?.selfie((W - 12) * S, 72 * S) ?? null)
        : null;
    const shot = selfie3d ?? g.scene3d?.portrait(n.id, (W - 12) * S, 72 * S) ?? null;
    if (shot) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(shot, 6, 6, W - 12, 72);
      ctx.imageSmoothingEnabled = false;
    } else {
      const sheet = g.view.sheets.forNubbin(n);
      // FUN-39: a blink is the idle breath's shut-eye frame.
      const pose = n.stage === 'egg' ? 'idle' : fun.blink ? 'idle' : 'happy';
      const rect =
        sheet.frames.get(frameKey(pose, 'front', fun.blink ? 7 : 0)) ??
        sheet.frames.values().next().value;
      if (rect && this.withMe)
        this.drawPixelSelfie(
          g,
          ctx,
          sheet.texture.image as HTMLCanvasElement,
          rect,
          W,
        ); /* Lane E r9 */
      else if (rect) {
        const image = sheet.texture.image as HTMLCanvasElement;
        const size = 64;
        ctx.drawImage(
          image,
          rect.x,
          rect.y,
          rect.w,
          rect.h,
          W / 2 - size / 2,
          72 - size,
          size,
          size,
        );
      }
    }
    // FUN-39: the photobomber leans in at the frame's edge, waving, half out of the picture.
    if (fun.bomber) this.drawBomber(g, fun.bomber, fun.side, ctx, W, S);
    drawShadowText(ctx, n.name, W / 2, 84, color(C.darkPlum), color(C.cream), 1, 'center');
    const form = n.species === 'chao' ? keyLabel(formKey(n)) : keyLabel(n.species);
    drawText(ctx, form, W / 2, 95, color(C.plum), 1, 'center');
    drawText(
      ctx,
      `${STAGE_LABELS[n.stage]} · ${formatDuration(n.ageMs)}`,
      W / 2,
      104,
      color(C.plum),
      1,
      'center',
    );
    // FUN-39: the caption, wrapped to the frame, in the photo's own ink.
    const cap = wrapCaption(fun.caption, W - 12);
    cap.forEach((line, i) =>
      drawText(ctx, line, W / 2, 115 + i * 9, color(C.darkPlum), 1, 'center'),
    );
    drawText(
      ctx,
      `${NAMES.game} · ${new Date().toLocaleDateString()}`,
      W / 2,
      116 + cap.length * 9,
      color(C.lilacGrey),
      1,
      'center',
    );
    this.drawStickers(ctx);
  }

  /* Lane E r9 */
  /** R0441: the pixel selfie: the Keeper facing out, the Nubbin held at its chest. */
  private drawPixelSelfie(
    g: Game,
    ctx: CanvasRenderingContext2D,
    image: HTMLCanvasElement,
    rect: { x: number; y: number; w: number; h: number },
    W: number,
  ): void {
    const k = g.world.keeper;
    const ks = g.view.sheets.keeper(g.world.trainer, k.alignment);
    const kr =
      ks.frames.get(frameKey('g-chest', 'front', 0)) ?? ks.frames.get(frameKey('idle', 'front', 0));
    const kSize = 92;
    if (kr)
      ctx.drawImage(
        ks.texture.image as HTMLCanvasElement,
        kr.x,
        kr.y,
        kr.w,
        kr.h,
        W / 2 - kSize / 2,
        78 - kSize + 16,
        kSize,
        kSize,
      );
    const size = 40;
    ctx.drawImage(
      image,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      W / 2 - size / 2 + 4,
      76 - size,
      size,
      size,
    );
  }

  /** Draw a photobomber at one edge of the photo window, cut off by the frame. */
  private drawBomber(
    g: Game,
    b: Nubbin,
    side: -1 | 1,
    ctx: CanvasRenderingContext2D,
    W: number,
    S: number,
  ): void {
    const size = 48;
    const x = side < 0 ? 6 - size * 0.35 : W - 6 - size * 0.65;
    ctx.save();
    ctx.beginPath();
    ctx.rect(6, 6, W - 12, 72);
    ctx.clip();
    const shot = g.scene3d?.portrait(b.id, size * S, size * S) ?? null;
    if (shot) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(shot, x, 78 - size, size, size);
    } else {
      const sheet = g.view.sheets.forNubbin(b);
      const rect =
        sheet.frames.get(frameKey('wave', 'front', 1)) ??
        sheet.frames.get(frameKey('happy', 'front', 0));
      if (rect)
        ctx.drawImage(
          sheet.texture.image as HTMLCanvasElement,
          rect.x,
          rect.y,
          rect.w,
          rect.h,
          x,
          78 - size,
          size,
          size,
        );
    }
    ctx.restore();
    ctx.imageSmoothingEnabled = false;
  }

  private download(): void {
    const a = document.createElement('a');
    a.href = this.canvas.toDataURL('image/png');
    // R0425: every saved photo goes into the album too, with a small thumbnail.
    if (this.mode === 'nubbin') {
      const t = document.createElement('canvas');
      t.width = ALBUM.thumbPx;
      t.height = Math.round((this.canvas.height / this.canvas.width) * ALBUM.thumbPx);
      const tc = t.getContext('2d');
      if (tc) {
        tc.imageSmoothingEnabled = true;
        tc.drawImage(this.canvas, 0, 0, t.width, t.height);
        void addPhoto({
          atWallMs: Date.now(),
          nubbinIds: this.lastIds,
          caption: this.lastCaption,
          thumb: t.toDataURL('image/png'),
          full: a.href,
        });
      }
    }
    a.download = `${NAMES.game.toLowerCase()}-photo.png`;
    a.click();
  }
}
