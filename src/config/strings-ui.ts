import { ordinal } from './grammar';
/**
 * Player-facing text for the HUD, title and panel fixes of 2026-10-25 (the UI agent's own
 * strings, kept apart from the shared strings.ts so the merge stays small).
 */
export const UI_FX_TEXT = {
  /** One line under each mode's name on the title screen. */
  modeBlurbs: {
    campaign: 'The main story: a garden, a grandmother’s rules and an old cold.',
    hundred: 'One partner, a hundred days, six wild places to set right.',
    logged: 'Locked inside an online game with a party of three.',
    beetle: 'Join the guard and drive the Beetle through the caves below.',
    dawndusk: 'Two mirrored short stories. Dawn first; Dusk opens after.',
    free: 'No story: just you, your Nubbins and the Grove.',
    edu: 'Read-aloud stories and gentle games for ages 3 to 10.',
  } as Record<string, string>,
  /** Short labels under the action-bar icons on phones. */
  actionLabels: {
    journal: 'Journal',
    roster: 'Roster',
    more: 'More',
    expedition: 'Explore',
    play: 'Play',
    races: 'Races',
    shop: 'Shop',
    keeper: 'Keeper',
    settings: 'Settings',
  },
  /** The controls hint on a touch screen. */
  /** A care walk that stalled (the sim's cantReach event). */
  cantReach: (name: string) => `Can’t reach ${name} from here.`,
  cantReachThere: 'that spot',
  touchHint: 'Tap to walk · tap a Nubbin to select · drag to lift · pinch to zoom',
  /** The race results card. */
  standings: 'Standings',
  ordinal: (p: number) => ordinal(p),
  youMark: 'You',
  noTime: 'did not finish',
  finishTime: (ms: number) => `${(ms / 1000).toFixed(1)}s`,
  prize: (shells: number) => (shells > 0 ? `Prize: 🐚 ${shells} Shells` : 'No Shells this time.'),
  /** The tip names the stretch of the course where the most time went. */
  tipSection: (section: string, stat: string) =>
    `Tip: the ${section} cost the most time. More ${stat} would help next time.`,
  tipRest: 'Tip: rests cost the most time. Train Stamina so the Nubbin tires later.',
  tipWon: (section: string, stat: string) =>
    `Your slowest stretch was the ${section}: more ${stat} would widen the lead.`,
  sectionNames: {
    swim: 'swim',
    fly: 'flight over the gap',
    run: 'run',
    climb: 'climb',
    stretch: 'stamina stretch',
  } as Record<string, string>,
} as const;
