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

/** One pattern class per colour, so no two swatches look alike without their colour. */
export const EDU_COLOUR_PATTERN: Record<string, string> = {
  red: 'dots',
  blue: 'waves',
  yellow: 'rays',
  green: 'stripes',
  orange: 'checks',
  purple: 'zigzag',
  pink: 'rings',
  brown: 'cross',
  black: 'solid',
  white: 'plain',
};

/** The share of colour rounds that show things rather than plain swatches. */
export const EDU_COLOUR_THING_SHARE = 0.7;
