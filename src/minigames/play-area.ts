/**
 * The part of a minigame screen the pixel canvas may use: everything below the top row
 * that holds the ✕ and the score chip. The pixel views draw their progress bar and the
 * runner's name or the race title along the canvas's top edge, and in landscape the canvas
 * reached the top of the screen, where the row covered them (review C, item 15). The 3D
 * views keep the full screen; their header is DOM and already sits under the row.
 */
export function playArea(root: HTMLElement, pixel: boolean): DOMRect {
  root.style.paddingTop = '';
  const full = root.getBoundingClientRect();
  if (!pixel) return full;
  // The top row: the ✕ (unless phone portrait moved it down to the thumb) and the score chip.
  const row = [...root.querySelectorAll<HTMLElement>('.quit, .expedition-hud')]
    .map((e) => e.getBoundingClientRect())
    .filter((r) => r.height > 0 && r.top < full.top + full.height / 2);
  const top = row.length > 0 ? Math.ceil(Math.max(...row.map((r) => r.bottom)) - full.top) + 6 : 60;
  // Padding moves the centred canvas into the space below the row.
  root.style.paddingTop = `${top}px`;
  return new DOMRect(full.x, full.y + top, full.width, Math.max(1, full.height - top));
}
