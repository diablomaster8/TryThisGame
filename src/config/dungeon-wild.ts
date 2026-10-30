/**
 * Who lives wild in each act's dungeon (R0198, DUNG-55), by species id, in `ACTS` order.
 * The pools don't overlap, so every act has babies the Collection book can only fill there:
 * fossils in the Sandglass Ruins, ice babies in the Frostbell Caves. The Deep Hollow keeps
 * the whole common baby pool. A test checks every id is a common baby species.
 */
export const ACT_WILD: readonly (readonly string[])[] = [
  // Rootways: warm stone and roots.
  ['leafgrub', 'burrowbud', 'dustball', 'nibbler', 'sporemite', 'fuzzmite', 'weedbud', 'fuzzlet'],
  // Cloister: moss and lantern gold.
  [
    'bellsprig',
    'thornbelle',
    'thornbeau',
    'seedclutch',
    'tanglet',
    'kissbud',
    'fluffseed',
    'budling',
  ],
  // Sandglass Ruins: the fossils, and the things that like dry stone.
  [
    'domeshell',
    'spiralshell',
    'skyfang',
    'clawnymph',
    'lilystalk',
    'bonecap',
    'rockhorn',
    'coinpaw',
  ],
  // Frostbell Caves: the ice babies.
  ['floepup', 'clamlet', 'snoutling', 'swirlet', 'silkfin', 'corestar', 'droplet', 'shellpup'],
  // The Gloom: the quiet, grey-loving ones.
  ['duskflit', 'smogpuff', 'gloplet', 'wallmime', 'oozlet', 'smudgit', 'spooklet', 'driftlet'],
];
