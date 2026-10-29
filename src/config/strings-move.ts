/**
 * Lane A (MOVE) player-facing text: movement and jumping settings and hints. Re-exported
 * from `strings.ts` so every name can still be found from one place.
 */
export const MOVE_TEXT = {
  autoHop: 'Auto-hop',
  autoHopHelp: 'Tap walks hop logs and fences and jump up terraces by themselves.',
  /** The Fly perk's line in the garden's perk list (MOVE-27). */
  glidePerk: 'Glide: hold jump to glide',
  /** MOVE-35: a tap the Keeper cannot reach, and the hint when a jump would. */
  cantGoThere: "Can't get there from here",
  jumpUpThere: "Can't walk up there. Try a jump!",
  /** MOVE-38: the debug panel's overlay toggles. */
  debugOverlay: { colliders: 'Show colliders', nav: 'Show nav grid', groundY: 'Show ground y' },
} as const;

/** MOVE-42: the Auto-run setting. */
export const RUN_TEXT = {
  autoRun: 'Auto-run long walks',
  autoRunHelp: 'Tap walks longer than ten steps run by themselves.',
} as const;

/** MOVE-43: a one-time find in a bush. */
export const BUSH_TEXT = {
  found: 'Something was tucked in the bush: a shell!',
} as const;

/** MOVE-53: the Camera follows walking setting. */
export const CAMERA_TEXT = {
  follow: 'Camera follows walking',
  followHelp: 'After a few seconds walking toward the side of the view, it turns to face that way.',
} as const;

/** MOVE-55: the lookout chip and what it finds. */
export const LOOKOUT_TEXT = {
  chip: '🔭 Look around',
  well: 'You spot something shiny at the bottom of the well: a shell!',
  shells: (n: number) => `From up here you spot a glint: ${n} shells!`,
  critter: 'From up here you spot a critter in the reeds. It comes home with you.',
  nothing: 'A fine view. Nothing new to spot from here.',
} as const;
