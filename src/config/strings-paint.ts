/** R0743: the paint pad and the drawings shelf in the collection book. */
export const PAINT_TEXT = {
  open: '🎨 Draw',
  title: 'Draw your Nubbin',
  help: 'Pick a colour and a brush, then draw. Tap a Nubbin to stamp it.',
  colour: (n: number) => `Colour ${n}`,
  brush: ['Thin brush', 'Medium brush', 'Wide brush'],
  stamp: (name: string) => `Stamp ${name}`,
  clear: 'Start again',
  save: 'Keep this drawing',
  saved: 'Kept in your book.',
  tooBig: 'That drawing is too big to keep. Try a simpler one.',
  failed: 'Could not keep that. Check the device storage.',
  close: 'Close',
  shelf: (n: number, max: number) => `Drawings (${n} of ${max})`,
  drawingAlt: (n: number) => `Drawing ${n}`,
  none: 'No drawings yet.',
} as const;
