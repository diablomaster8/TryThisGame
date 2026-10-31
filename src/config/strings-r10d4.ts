/**
 * Lane D, round 10 (helper d4): the player-facing words added this round (offline packs,
 * install guidance, the first-load splash). Imported directly where used.
 */

/** TECH-20: Settings > Saves, "Keep for offline play". */
export const OFFLINE_PACK_TEXT = {
  heading: 'Keep for offline play',
  help: 'Download a part now so it opens with no internet later (a car trip, a plane).',
  packs: {
    story: 'Story',
    edu: 'Learning Grove',
    worlds: 'Story worlds',
  } as Record<string, string>,
  size: (mb: number) => (mb < 0.1 ? 'under 0.1 MB' : `about ${mb.toFixed(1)} MB`),
  saving: 'Downloading…',
  kept: 'Kept for offline ✓',
  partial: (held: number, of: number) => `${held} of ${of} files kept; tick again when online.`,
  unavailable: 'Offline packs work on the published site, once it has loaded.',
} as const;

/** TECH-58: the offline card's pointer to the packs above. */
export const OFFLINE_CARD_HINT =
  'Next time you are online, tick it in Settings › Saves › Keep for offline play.';

/** TECH-21: the one-time install offer. */
export const INSTALL_TEXT = {
  title: 'Keep Grove on this device',
  body: 'Install Grove for a full-screen game that opens offline and keeps its saves safer.',
  install: 'Install Grove',
  iosBody: 'On iPhone or iPad: tap Share, then “Add to Home Screen”.',
  iosShare: 'Share ⬆',
  later: 'Not now',
} as const;

/** TECH-56: the storage line in Settings > Saves. */
export const STORAGE_TEXT = {
  saves: (kb: number, ofMb: number) => `Saves use ${kb} kB of about ${ofMb} MB.`,
  site: (mb: number) => `Offline files and caches: ${mb.toFixed(1)} MB.`,
  low: '⚠ Space is running low: export a backup and erase slots you no longer play.',
} as const;
