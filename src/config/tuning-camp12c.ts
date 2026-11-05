/** Lane C round 12, agent C (re-exported through tuning.ts): quest markers and the giver's approach. */

export const C12C = {
  /** R0651: the giver walks to the Keeper before the card shows. */
  approach: {
    /** The giver stops about this far from the Keeper (units). */
    stopAt: 2.3,
    /** Counted as arrived within this distance. */
    arriveWithin: 2.6,
    /** The card shows anyway after this long (sim ms), so a stuck walker never holds it. */
    timeoutMs: 9_000,
    /** A guest giver who is not in the Grove yet comes in from this far off (units). */
    spawnAt: 7,
    /** No walk when another offer was made within this long (sim ms). */
    gapMs: 10_000,
  },
  /** R0630: the doors to the story worlds, stood in the Grove (render/story-doors.ts). */
  doors: {
    /** Drawn only within this many units of the Keeper. */
    near: 22,
    /** Pixel only: a door's sprite is drawn this many times its painted size. */
    pixelScale: 1.6,
    atlas: { mark: 'step', off: [-1.2, 0.3] as const },
    /** Pixel's cabinet stands beside a built workshop. */
    cabinetOff: [3.4, 0.6] as const,
    cabinetAfterChapter: 5,
    rift: { mark: 'hill-top', off: [1.4, 1.0] as const },
    /** The rift shows once the night is this dark (0 to 1). */
    riftDarkness: 0.5,
    gate: { mark: 'grass-lantern', off: [1.6, 0.4] as const },
    gateAfterChapter: 2,
  },
  /** R0608: the `!` and diamond billboards over the giver or board and the tracked step. */
  markers: {
    /** At most this many are drawn at once (one draw call each in Full 3D). */
    max: 2,
    /** R0629: a child's markers are drawn this many times larger (about 64 px), and pulse. */
    kidScale: 1.8,
    /** Pixel only: the sprite is drawn this many times its painted size. */
    pixelScale: 2,
    /** Only those within this many units of the Keeper are drawn. */
    within: 45,
    /** Height above the ground over a person, a board or a place (units). */
    overNpc: 2.35,
    overBoard: 2.5,
    overPlace: 2.6,
  },
} as const;
