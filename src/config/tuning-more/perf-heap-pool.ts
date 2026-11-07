// was tuning-r12d3; review pass R12 D3
/* Lane D r12 (d3): tunables for the Full 3D heap (TECH-14). */

/**
 * R0456 (TECH-14): looks the creature pool lets go of their marched surfaces for once a rig is
 * built. These are the people (the player's grandchild and the named villagers): one of each
 * is ever on screen, so the CPU copy of their surfaces (2 to 3 MB a look, never drawn) only
 * waited for a second rig that never comes. A later rig reads them back from the sculpt cache.
 * Nubbin looks keep theirs: a second child of the same look hatches often.
 */
export const POOL_SHED = {
  prefixes: ['keeper-', 'grandchild-'] as readonly string[],
} as const;
