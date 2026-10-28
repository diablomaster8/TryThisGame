/** Tuning for the floating analogue joystick (R0028). */
export const JOYSTICK_TUNING = {
  /** Throw radius of the stick in CSS px. */
  radius: 52,
  /** Dragging past this many radii drags the pad's centre along with the thumb. */
  recentreAt: 1.4,
  /** Below this stick length nothing moves; at `fullAt` the Keeper is at full pace. */
  deadZone: 0.15,
  fullAt: 0.9,
  /** Held past this length for `autoRunMs`, the Keeper starts to run. */
  autoRunAt: 0.92,
  autoRunMs: 250,
  /** Auto-run lets go again when the stick drops below this length. */
  autoRunOff: 0.75,
  /** The pad can land anywhere in this left share of the screen, below the top bar. */
  zoneWidth: 0.45,
  /** navigator.vibrate pulse on landing, in ms. */
  hapticMs: 8,
  /** localStorage key for the one-time offer toast. */
  offerKey: 'grove.joystickOffered',
} as const;
