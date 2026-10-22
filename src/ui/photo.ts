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
    // A keepsake of the chapter just closed (N6): the offer card sends this event.
    this.switcher = button('', () => this.toggle(), 'btn');
    this.dialog.body.appendChild(this.switcher);
    window.addEventListener(CHAPTER_PHOTO_EVENT, () => this.openChapter());
  }

  private readonly switcher: HTMLButtonElement;
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
    this.render(g, n);
    g.send({ kind: 'photoTaken', species: n.species });
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private render(g: Game, n: Nubbin): void {
    const W = 160;
    // Tall enough that the four lines of the footer sit inside the frame (bug 19).
    const H = 128;
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
    const shot = g.scene3d?.portrait(n.id, (W - 12) * S, 72 * S) ?? null;
    if (shot) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(shot, 6, 6, W - 12, 72);
      ctx.imageSmoothingEnabled = false;
    } else {
      const sheet = g.view.sheets.forNubbin(n);
      const rect =
        sheet.frames.get(frameKey(n.stage === 'egg' ? 'idle' : 'happy', 'front', 0)) ??
        sheet.frames.values().next().value;
      if (rect) {
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
    drawText(
      ctx,
      `${NAMES.game} · ${new Date().toLocaleDateString()}`,
      W / 2,
      114,
      color(C.lilacGrey),
      1,
      'center',
    );
  }

  private download(): void {
    const a = document.createElement('a');
    a.href = this.canvas.toDataURL('image/png');
    a.download = `${NAMES.game.toLowerCase()}-photo.png`;
    a.click();
  }
}
