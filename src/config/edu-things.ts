/**
 * R0732 (KIDS-64): real things for the colour rounds. A colour word sticks when it is attached
 * to an object, and a swatch alone fails colour-blind children, so each colour also has a
 * pattern (dots, stripes...) drawn over its swatch or plate.
 */
export interface ColourThing {
  icon: string;
  name: string;
}

export const EDU_COLOUR_THINGS: Record<string, readonly ColourThing[]> = {
  red: [
    { icon: '🍎', name: 'apple' },
    { icon: '🍓', name: 'strawberry' },
    { icon: '🌹', name: 'rose' },
  ],
  blue: [
    { icon: '🐳', name: 'whale' },
    { icon: '🫐', name: 'blueberries' },
    { icon: '🦋', name: 'butterfly' },
  ],
  yellow: [
    { icon: '⭐', name: 'star' },
    { icon: '🌼', name: 'flower' },
    { icon: '🍌', name: 'banana' },
  ],
  green: [
    { icon: '🐸', name: 'frog' },
    { icon: '🍃', name: 'leaf' },
    { icon: '🥒', name: 'cucumber' },
  ],
  orange: [
    { icon: '🍊', name: 'orange' },
    { icon: '🥕', name: 'carrot' },
    { icon: '🎃', name: 'pumpkin' },
  ],
  purple: [
    { icon: '🍇', name: 'grapes' },
    { icon: '🍆', name: 'aubergine' },
    { icon: '🔮', name: 'crystal ball' },
  ],
  pink: [
    { icon: '🐷', name: 'pig' },
    { icon: '🌸', name: 'blossom' },
    { icon: '🍬', name: 'sweet' },
  ],
  brown: [
    { icon: '🪵', name: 'log' },
    { icon: '🐻', name: 'bear' },
    { icon: '🌰', name: 'chestnut' },
  ],
  black: [
    { icon: '🦇', name: 'bat' },
    { icon: '🐈‍⬛', name: 'cat' },
    { icon: '🕷', name: 'spider' },
  ],
  white: [
    { icon: '🥚', name: 'egg' },
    { icon: '☁', name: 'cloud' },
    { icon: '🐑', name: 'sheep' },
  ],
};

/**
 * One pattern class per colour, so no two swatches look alike without their colour. Every
 * colour has a real pattern: white is a two-tone chequer and black a solid with a dotted
 * border (both drawn in edu css as `edu-pat-<id>`), and no id repeats.
 */
export const EDU_COLOUR_PATTERN: Record<string, string> = {
  red: 'dots',
  blue: 'waves',
  yellow: 'rays',
  green: 'stripes',
  orange: 'checks',
  purple: 'zigzag',
  pink: 'rings',
  brown: 'cross',
  black: 'dotborder',
  white: 'chequer',
};

/** The share of colour rounds that show things rather than plain swatches. */
export const EDU_COLOUR_THING_SHARE = 0.7;

/** R0732: the "Show patterns on colours" setting (edu.patterns, default on), kept per device. */
export const EDU_PATTERNS_KEY = 'grove.edu.patterns';

export const EDU_PATTERN_TEXT = {
  label: 'Show patterns on colours',
  on: 'Patterns: on',
  off: 'Patterns: off',
} as const;

/**
 * R0733: the share of age 5-6 shape rounds that are the Grove hunt. The hunt's props take
 * colours from this pool (all different in a round, and not tied to a shape) so the shape,
 * not the colour, is the cue.
 */
export const EDU_HUNT_SHARE = 0.5;
export const EDU_HUNT_COLOURS: readonly string[] = [
  'red',
  'blue',
  'yellow',
  'green',
  'orange',
  'purple',
  'pink',
];
