/**
 * What each keepsake looks like on the cottage's keepsake shelf (campaign graphics M7). A
 * keepsake is kept by id in `inventory.keepsakes` once earned (sim/story-rewards.ts); this
 * table maps the ones that are objects to a small shape and two colours. Both renderers
 * and the journal's Memories can read it: the 3D shelf builds a mesh from `shape`, the
 * pixel shelf draws the same shape as a 16 px sprite. Ids not listed here (titles, flags,
 * feature unlocks) are not things, so they do not stand on the shelf.
 */
export type KeepsakeShape =
  | 'pages'
  | 'egg'
  | 'seed'
  | 'trowel'
  | 'letter'
  | 'toy'
  | 'jar'
  | 'rock'
  | 'cog'
  | 'cheese'
  | 'lantern'
  | 'flag'
  | 'sign'
  | 'cushion'
  | 'fruit'
  | 'bottle';

export interface KeepsakeLook {
  shape: KeepsakeShape;
  /** Main colour, a CSS hex. */
  color: string;
  /** Trim or shadow colour. */
  accent: string;
}

const L = (shape: KeepsakeShape, color: string, accent: string): KeepsakeLook => ({
  shape,
  color,
  accent,
});

export const KEEPSAKE_LOOKS: Readonly<Record<string, KeepsakeLook>> = {
  's1-tale-pages': L('pages', '#f1e6c8', '#a98658'),
  's4-pearl-egg': L('egg', '#f4f1ea', '#c9d6e4'),
  's5-fossil-seed': L('seed', '#8e8470', '#5b5242'),
  's5-dusty-trowel': L('trowel', '#9aa3ab', '#6a4428'),
  's10-letter-reward': L('letter', '#f7f0dc', '#b04a3a'),
  's10-lantern': L('lantern', '#ffd27a', '#5a4630'),
  's12-hum-nectar': L('jar', '#f0b840', '#c88a1c'),
  's13-cheese': L('cheese', '#f2c94c', '#c9972c'),
  's13-cog': L('cog', '#b8a37a', '#7c6a46'),
  's13-doorknob': L('rock', '#c8a24e', '#8a6c28'),
  's13-ladle': L('trowel', '#c9ccd0', '#8a8f96'),
  's13-sifter': L('cog', '#d9c8a0', '#8a7448'),
  's15-sparkly-egg': L('egg', '#e9c8f4', '#9a6ed0'),
  's17-fledgling': L('toy', '#e8d49a', '#b88a4a'),
  's19-ember': L('lantern', '#ff9a4a', '#7a2c18'),
  's22-flag': L('flag', '#d85a4a', '#5a3a28'),
  's23-pages': L('pages', '#e8e0cc', '#6a8a7a'),
  's25-knitted-toy': L('toy', '#e6a0b4', '#b86a86'),
  's27-label': L('sign', '#efe6c8', '#8a6a3a'),
  's28-hollow-jar': L('jar', '#cfe2e6', '#7a98a0'),
  's28-marmalade': L('jar', '#f08a2a', '#b85a14'),
  's28-orange-cutting': L('fruit', '#f39a2e', '#4a7a3a'),
  's29-portly-gift': L('bottle', '#9ac89a', '#5a8a5a'),
  's30-cushion': L('cushion', '#b8a0d8', '#7a62a8'),
  's31-gourd-lantern': L('lantern', '#f0a030', '#5a7a2a'),
  's31-rock': L('rock', '#a8aab0', '#6c6e76'),
  's31-sign': L('sign', '#d8b888', '#7a5a38'),
  's7-lantern-timer': L('lantern', '#bfe0ff', '#5a6a7a'),
};

/** The look of keepsake `id`, or null when it is not an object. */
export function keepsakeLook(id: string): KeepsakeLook | null {
  return KEEPSAKE_LOOKS[id] ?? null;
}

/** Shelf slots: 3 shelves of 4, filled from the top left in the order the keepsakes were kept. */
export const SHELF_COLS = 4;
export const SHELF_ROWS = 3;
export const SHELF_CAP = SHELF_COLS * SHELF_ROWS;
