import { ALBUM_TEXT } from '../config/strings';
import { listPhotos, setKeep, type AlbumPhoto } from '../platform/photo-album';
import { button, el, modal } from './dom';

/**
 * R0425 (LOOK-57): the photo album: the last saved photos as thumbnails, newest first. A tap
 * shows one large, with "keep" (it stays past the newest few) and a download. With
 * storage blocked the album shows nothing and its button hides.
 */
export class Album {
  private readonly m;

  constructor(parent: HTMLElement) {
    this.m = modal(parent, ALBUM_TEXT.title, ALBUM_TEXT.close);
    this.m.root.classList.add('album');
  }

  async open(): Promise<void> {
    const photos = await listPhotos();
    const body = this.m.body;
    body.innerHTML = '';
    if (!photos || photos.length === 0) {
      body.appendChild(el('p', 'help', ALBUM_TEXT.empty));
    } else {
      const grid = el('div', 'album-grid');
      for (const p of photos) {
        const b = button('', () => this.showOne(p), 'btn album-thumb');
        const img = el('img');
        img.src = p.thumb;
        img.alt = p.caption;
        b.appendChild(img);
        if (p.kept) b.appendChild(el('span', 'album-kept', '📌'));
        grid.appendChild(b);
      }
      body.appendChild(grid);
    }
    this.m.show();
  }

  private showOne(p: AlbumPhoto): void {
    const body = this.m.body;
    body.innerHTML = '';
    const img = el('img', 'album-big');
    img.src = p.full;
    img.alt = p.caption;
    body.append(
      img,
      el('p', 'help', `${p.caption} · ${new Date(p.atWallMs).toLocaleDateString()}`),
    );
    const row = el('div', 'settings-actions');
    row.appendChild(
      button(
        p.kept ? ALBUM_TEXT.unkeep : ALBUM_TEXT.keep,
        () =>
          void setKeep(p.id, !p.kept).then((ok) => {
            if (!ok && !p.kept) body.appendChild(el('p', 'help', ALBUM_TEXT.keepFull));
            else void this.open();
          }),
        'btn',
      ),
    );
    row.appendChild(
      button(
        ALBUM_TEXT.download,
        () => {
          const a = document.createElement('a');
          a.href = p.full;
          a.download = 'grove-photo.png';
          a.click();
        },
        'btn btn-primary',
      ),
    );
    row.appendChild(button('←', () => void this.open(), 'btn'));
    body.appendChild(row);
  }

  isOpen(): boolean {
    return this.m.isOpen();
  }

  close(): void {
    this.m.hide();
  }
}
