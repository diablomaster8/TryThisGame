/**
 * R0357 (FUN-68): renaming a Nubbin, in place of the browser's prompt box, with an opt-in
 * silly-name generator ("Sir Wobbles", "Captain Puddle"). In the sprout band the generator
 * is picture buttons: pick a hat, then a name. Sends the same `rename` command as before.
 */
import { RENAME_TEXT, SILLY_NAME_PARTS } from '../config/strings-fun-r7';
import type { Game } from '../game';
import { button, el, modal } from './dom';
import { toastBand } from './fun-toasts';

/** A silly name from the parts, at most 16 characters. `pick` takes a list length. */
export function sillyName(
  pick: (n: number) => number = (n) => Math.floor(Math.random() * n),
): string {
  const P = SILLY_NAME_PARTS;
  for (let i = 0; i < 20; i++) {
    const name = `${P.titles[pick(P.titles.length)]} ${P.names[pick(P.names.length)]}`;
    if (name.length <= 16) return name;
  }
  return P.names[pick(P.names.length)]!;
}

export class RenameDialog {
  private readonly dialog;
  private readonly input: HTMLInputElement;
  private readonly pictures: HTMLDivElement;
  private readonly sillyBtn: HTMLButtonElement;
  private id: string | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, RENAME_TEXT.title, RENAME_TEXT.cancel);
    this.dialog.root.classList.add('rename-dialog');
    this.input = el('input');
    this.input.type = 'text';
    this.input.maxLength = 16;
    this.input.className = 'rename-input';
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.commit();
    });
    this.sillyBtn = button(RENAME_TEXT.silly, () => (this.input.value = sillyName()), 'btn');
    this.pictures = el('div', 'rename-pictures');
    const row = el('div', 'rename-row');
    row.append(
      this.input,
      button(RENAME_TEXT.ok, () => this.commit(), 'btn btn-primary'),
    );
    this.dialog.body.append(row, this.sillyBtn, this.pictures);
  }

  open(nubbinId: string): void {
    const g = this.game();
    const n = g?.world.nubbins.find((x) => x.id === nubbinId);
    if (!g || !n) return;
    this.id = nubbinId;
    this.input.value = n.name;
    const sprout = toastBand(g.world) === 'sprout';
    this.sillyBtn.hidden = sprout;
    this.pictures.hidden = !sprout;
    if (sprout) this.drawPictures();
    this.dialog.show();
    this.input.focus();
    this.input.select();
  }

  /** Sprout: two rows of picture buttons; a hat then a name makes the name. */
  private drawPictures(): void {
    this.pictures.innerHTML = '';
    let hat = '';
    const rows: Array<[string, readonly (readonly [string, string])[], (w: string) => void]> = [
      [RENAME_TEXT.pickTitle, SILLY_NAME_PARTS.pictureTitles, (w) => (hat = w)],
      [
        RENAME_TEXT.pickName,
        SILLY_NAME_PARTS.pictureNames,
        (w) => (this.input.value = `${hat} ${w}`.trim().slice(0, 16)),
      ],
    ];
    for (const [label, parts, set] of rows) {
      this.pictures.appendChild(el('p', 'help', label));
      const line = el('div', 'rename-picture-row');
      for (const [emoji, word] of parts) {
        const b = button(`${emoji}`, () => set(word), 'btn btn-picture');
        b.setAttribute('aria-label', word);
        b.title = word;
        line.appendChild(b);
      }
      this.pictures.appendChild(line);
    }
  }

  private commit(): void {
    const g = this.game();
    const name = this.input.value.trim();
    if (g && this.id && name) g.send({ kind: 'rename', nubbinId: this.id, name });
    this.dialog.hide();
  }
}
