/**
 * R0733 (KIDS-65): the shape hunt. A still of the Grove drawn as a little picture, with props
 * whose outlines are a plain shape (the round pond, the triangle roof, the square window). The
 * table is the single list: prop id, its shape, its colour (varied, so the shape and not the
 * colour is the cue) and its box in a 200 x 120 picture.
 */
export interface GroveProp {
  id: string;
  name: string;
  shape: 'circle' | 'triangle' | 'square' | 'rectangle';
  colour: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const GROVE_VIEW = { w: 200, h: 120 } as const;

export const GROVE_SHAPES: readonly GroveProp[] = [
  { id: 'pond', name: 'the pond', shape: 'circle', colour: '#4aa3e0', x: 14, y: 78, w: 46, h: 30 },
  { id: 'sun', name: 'the sun', shape: 'circle', colour: '#f2d34c', x: 160, y: 8, w: 26, h: 26 },
  {
    id: 'roof',
    name: 'the roof',
    shape: 'triangle',
    colour: '#c0503a',
    x: 92,
    y: 30,
    w: 52,
    h: 26,
  },
  {
    id: 'tent',
    name: 'the tent',
    shape: 'triangle',
    colour: '#8b4fd1',
    x: 150,
    y: 70,
    w: 34,
    h: 30,
  },
  {
    id: 'window',
    name: 'the window',
    shape: 'square',
    colour: '#f7f3ff',
    x: 98,
    y: 62,
    w: 14,
    h: 14,
  },
  {
    id: 'crate',
    name: 'the crate',
    shape: 'square',
    colour: '#e8923a',
    x: 66,
    y: 88,
    w: 20,
    h: 20,
  },
  {
    id: 'door',
    name: 'the door',
    shape: 'rectangle',
    colour: '#6b4a2b',
    x: 124,
    y: 70,
    w: 12,
    h: 24,
  },
  {
    id: 'sign',
    name: 'the signpost',
    shape: 'rectangle',
    colour: '#3fae4a',
    x: 40,
    y: 40,
    w: 28,
    h: 14,
  },
];

/** The shapes that have a prop in the Grove still. */
export const GROVE_HUNT_SHAPES: readonly string[] = ['circle', 'triangle', 'square', 'rectangle'];
