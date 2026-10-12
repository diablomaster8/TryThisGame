// Every player-facing name and piece of text. All names are working titles.

export const NAMES = {
  game: 'Grove',
  creature: 'Nubbin',
  creaturePlural: 'Nubbins',
  garden: 'Grove',
  currency: 'Shells',
  smallAnimals: 'Critters',
  statCrystals: 'Essences',
  alignmentSun: 'Sun',
  alignmentMoon: 'Moon',
  alignmentNeutral: 'Neutral',
  eternal: 'Eternal',
  player: 'Keeper',
  playerSun: 'Sun Keeper',
  playerMoon: 'Moon Keeper',
} as const;

export const UI_TEXT = {
  rotateLeft: 'Rotate camera left',
  rotateRight: 'Rotate camera right',
  zoomToggle: 'Toggle zoom',
  fps: (fps: number) => `${fps} fps`,
  desktopHint: 'Q / E rotate · scroll to zoom',
} as const;
