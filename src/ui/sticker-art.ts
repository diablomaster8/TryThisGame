import type { EduSticker } from '../config/edu-stickers';
import { el } from './dom';

/**
 * A sticker's picture as chunky pixels: the icon drawn small on a 20 px canvas, which CSS
 * scales up with nearest-neighbour, so emoji and letters read as pixel art like the Grove.
 */
export function stickerArt(s: EduSticker): HTMLCanvasElement {
  const c = el('canvas', 'sticker-art');
  c.width = 20;
  c.height = 20;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const letter = /^[A-Z]$/.test(s.icon);
    ctx.font = letter ? 'bold 17px sans-serif' : '15px sans-serif';
    if (letter) {
      ctx.fillStyle = '#3a2a4a';
      ctx.fillText(s.icon, 10, 11);
    } else ctx.fillText(s.icon, 10, 11);
  }
  return c;
}
