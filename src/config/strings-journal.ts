/**
 * Lane C round 9 (agent J): the journal's Quests page, Errands, the endings shelf, the lines'
 * time left, the phone sheet and the offer card's accessibility labels.
 */
export const JOURNAL_TEXT = {
  /** R0635: a line's chapter and the rough time left. */
  lineLeft: (min: number) => `About ${min} min left`,
  /** R0656: the Requests board's one-time errands, on the journal board. */
  errandsHead: 'Errands',
  errandsHelp: 'Small one-time asks from around the Grove. They never count toward your quests.',
  errandsNone: 'No errands just now.',
  errandFrom: (who: string, have: number, of: number) => `From ${who} · ${have}/${of}`,
  claim: 'Claim',
  claimed: 'Claimed',
  /** R0665: the Quests page, its search and its chips. */
  questsTab: 'Quests',
  search: 'Search quests',
  searchHint: 'Title, who asks, or where',
  chips: {
    story: 'Story',
    caper: 'Capers',
    errand: 'Errands',
    teen: '13+',
    adult: '18+',
    done: 'Done',
  } as Record<string, string>,
  chipsLabel: 'Filter quests',
  results: (n: number) => (n === 1 ? '1 quest' : `${n} quests`),
  nothingFound: 'Nothing matches. Try fewer words or fewer chips.',
  stateDone: 'Done',
  stateOpen: 'Under way',
  stateWaiting: 'Offered',
  stateShelved: 'Put aside',
  /** R0642: every ending of the spine and each line. */
  shelfHead: 'Every road’s endings',
  shelfHelp: 'Once a road has ended, the endings you have not found yet show how to reach them.',
  shelfCount: (title: string, got: number, of: number) => `${title} · ${got}/${of}`,
  unknown: '?',
  reachedMark: '★',
  /** R0662: labels for screen readers. */
  tabsLabel: 'Journal pages',
  offerLabel: 'A quest is offered',
  /** R0606: the giver's portrait. */
  giverAlt: (name: string) => `${name}’s portrait`,
};
