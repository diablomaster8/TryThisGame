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
