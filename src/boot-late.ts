/**
 * R0446 (TECH-04, r12-d3): what `main.ts` needs only once a slot is picked, gathered so it
 * loads with `Game` and the HUD instead of in the first download. Each of these reaches the
 * sim (the world, the save codec, the story registry), and the title must paint without it.
 * Keep anything the title or the loading veil needs out of this file.
 */
export { readCrossSaves } from './ui/atlas';
export { unequipMissingHats } from './sim/derived-unlocks';
export { nextTip } from './ui/tips';
export { mountCameraButtons } from './ui/camera-buttons';
export { FpsCounter } from './ui/fps';
