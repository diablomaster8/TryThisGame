import '../r12d2.css';
import { PHOTO_FRAME_TEXT } from '../config/strings-r12d2';
import type { Game } from '../game';
import { standingInPhotoSpot } from '../sim/photo-spots';
import { regionOf } from '../sim/regions';
import { button } from './dom';
import { chapterShot } from './chapter-photo';
import type { PhotoMode } from './photo';

/**
 * R0138 (WORLD-72): the "Take photo" button that shows while the Keeper stands in a photo frame.
 * It copies one frame of the view (the frame's post is placed where the region's beacon is in
 * view) and opens the photo panel on it, where it can be saved to the album like a chapter shot.
 * Repeatable for fun; the first look at each frame is what the album counts (`photo:<region>`).
 */
export class PhotoSpotButton {
  readonly root: HTMLButtonElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly photo: () => PhotoMode,
  ) {
    this.root = button(
      `📷 ${PHOTO_FRAME_TEXT.button}`,
      () => this.take(),
      'btn btn-primary photo-spot-btn',
    );
    this.root.hidden = true;
    this.root.setAttribute('aria-label', PHOTO_FRAME_TEXT.buttonLabel);
    parent.appendChild(this.root);
  }

  /** Show or hide with where the Keeper stands; `busy` while a scene or a panel is open. */
  update(busy: boolean): void {
    const g = this.game();
    const show = !!g && !busy && standingInPhotoSpot(g.world);
    if (this.root.hidden === show) this.root.hidden = !show;
  }

  private take(): void {
    const g = this.game();
    if (!g) return;
    const canvas = g.captureFrame(960, 600);
    if (!canvas) return;
    const region = regionOf(g.world.location);
    chapterShot.set({
      canvas,
      chapter: 0,
      title: PHOTO_FRAME_TEXT.title(region),
      campaign: PHOTO_FRAME_TEXT.note,
    });
    this.photo().openChapter();
  }
}
