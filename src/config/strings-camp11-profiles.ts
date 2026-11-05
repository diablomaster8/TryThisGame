/**
 * Lane C round 11, helper "profiles": player-facing text for the title's Continue and
 * profile picker, the Sandbox start, chapter select, the fun-quest packs and the
 * "Your saves moved" card.
 */
export const PROFILE_TEXT = {
  /** R0621: the big Continue at the top of the title. */
  continueBig: 'Continue',
  continueWhere: (slot: string, what: string) => (what ? `${slot} · ${what}` : slot),
  /** R0621 / R0627: an empty Hazel's Grove slot asks which start. */
  newStory: 'New story',
  newStoryHelp: "Hazel's letter arrives on the first morning.",
  sandbox: 'Sandbox',
  sandboxHelp: 'A Grove with the story off. You can start it later in Settings.',
  newStoryLabel: (slot: string) => `New story in ${slot}`,
  sandboxLabel: (slot: string) => `Sandbox in ${slot}`,
  /** R0627: Settings → Story, in a Sandbox. */
  storyOffHead: 'Story',
  storyOffHelp: 'This Grove is a sandbox: no letters, no chapters. Your Nubbins stay as they are.',
  startStory: "Start Hazel's story",
  startStoryAsk:
    "Start Hazel's story here? The letter comes to the gate, and every Nubbin stays with you.",
  startStoryYes: 'Start the story',
  startStoryNo: 'Not yet',
  storyStarted: 'A letter is waiting at the gate.',
  /** R0628 / R0653: who's playing. */
  whoTitle: "Who's playing?",
  keeperTile: (name: string) => `${name}'s Groves`,
  childTileLabel: (name: string) => `Open ${name}'s Grove`,
  childNewLabel: (name: string) => `Start ${name}'s Grove`,
  childFull: "This child's Groves are all in use.",
  childSay: 'Tap your picture.',
  keeperDefault: 'Keeper 1',
  childDefault: 'Child 1',
  newProfile: '+ New profile',
  newKeeper: 'A Keeper (grown-up or older child)',
  newChild: 'A child (Learning Grove)',
  newProfileHelp: 'Each profile has its own saves.',
  profileFull: (n: number) => `This device has ${n} profiles, the most it keeps.`,
  more: '⋯',
  moreLabel: (name: string) => `More for ${name}`,
  rename: 'Rename',
  renameAsk: 'A new name for this profile',
  renameSave: 'Save',
  remove: 'Delete profile',
  removeAsk: (name: string, word: string) =>
    `Delete ${name}? Its saves are kept for 30 days under Deleted profiles. Type ${word} to go on.`,
  removeYes: 'Delete',
  removeLocked: 'The first Keeper and child profiles hold the saves on this device and stay.',
  deletedHead: 'Deleted profiles',
  deletedRow: (name: string, days: number) =>
    `${name} · ${days === 0 ? 'deleted today' : `deleted ${days} day${days === 1 ? '' : 's'} ago`}`,
  restore: 'Restore',
  restored: (name: string) => `${name} is back.`,
  cancel: 'Cancel',
  back: 'Back',
  backLabel: "Back to Who's playing",
  kidsHead: "Children's Groves",
  /** R0598: the "Your saves moved" card, once after the move. */
  movedTitle: 'Your saves moved',
  movedBody: (n: number) =>
    n === 1
      ? 'Your Grove now lives in your profile. The old copy is kept safe on this device.'
      : `Your ${n} Groves now live in your profile. The old copies are kept safe on this device.`,
  movedOlder: (n: number) =>
    `${n} older save${n === 1 ? ' did' : 's did'} not fit in 8 slots. They are under Older saves.`,
  movedCombine: 'Combine endings',
  movedCombineHelp:
    "Copy a finished road's ending and keepsakes into a Hazel's Grove slot. Nubbins stay where they are.",
  movedCombineInto: (slot: string) => `Into ${slot}`,
  movedCombined: (slot: string) => `Endings copied into ${slot}.`,
  movedCombineFailed: 'Those endings could not be copied.',
  movedOk: 'Got it',
  olderHead: 'Older saves',
  olderHelp: 'Saves that did not fit. Swap one into an empty slot to play it.',
  olderSwap: (slot: string) => `Put in ${slot}`,
  olderNoRoom: 'Every slot is full. Erase one first.',
  olderSwapped: (slot: string) => `Moved into ${slot}.`,
  /** R0618: chapter select. */
  chaptersHead: 'Chapters',
  chaptersHelp: 'Watch a finished chapter again, or play on from it in a new slot.',
  chapterRow: (road: string, n: number) => `${road} · Chapter ${n}`,
  watchAgain: 'Watch again',
  playFromHere: 'Play from here',
  noCheckpoint: 'Watch again only: no checkpoint was kept for this chapter.',
  branchName: (from: number, n: number) => `Branch of ${from} · Ch ${n}`,
  branched: (slot: number) => `Saved to Slot ${slot}. Open it from the title.`,
  branchNoRoom: 'Every slot is full. Erase one on the title first.',
  branchFailed: 'That checkpoint could not be opened.',
  /** R0638: fun-quest packs on the Quests page. */
  packsHead: 'Caper packs',
  packName: {
    python: 'The Python pack',
    bean: 'The Bean pack',
    sunny: 'The Sunny pack',
    avatar: 'The Avatar pack',
    alice: 'The Alice pack',
    holmes: 'The Holmes pack',
    hodja: 'The Hodja pack',
  } as Readonly<Record<string, string>>,
  packCount: (done: number, of: number) => `${done}/${of} done`,
  packNext: (title: string, area: string) => (area ? `Next: ${title}, ${area}` : `Next: ${title}`),
  packKept: 'Pack finished: its keepsake is in Memories.',
  packKeepsake: {
    'pack-python': 'A Coconut Shell Pair',
    'pack-bean': 'A Tiny Teddy Button',
    'pack-sunny': 'A Paddy’s Pub Coaster',
    'pack-avatar': 'A Four-Nations Tile',
    'pack-alice': 'A Pocket-Watch Charm',
    'pack-holmes': 'A Deerstalker Pin',
    'pack-hodja': 'A Back-to-Front Donkey Bell',
  } as Readonly<Record<string, string>>,
} as const;
