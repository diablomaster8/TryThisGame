/** Lane C round 12 (R0629, CAMP-37): the kid open flow's few words. */

export const KID_FLOW_TEXT = {
  /** The one big button on a child's invitation. */
  go: "Let's go!",
  /** The notice board's picture tiles: under way is said in words, not by colour alone. */
  boardActive: (title: string) => `${title}, under way`,
  boardStart: (title: string) => `Start ${title}`,
  /** The picture a story's tile shows when it has no reward icon. */
  boardPicture: '⭐',
  /** A reader's help button on a stuck step. */
  help: 'Help me',
  helpLabel: 'Ask Moss to help with this step',
  /** What shows when Moss helps. */
  mossHelps: (title: string) => `Moss helps with ${title}.`,
} as const;

/** R0618 (CAMP-26): Watch again shows the choices, and branching over a full slot asks first. */
export const REPLAY_TEXT = {
  /** The narrator's line before the options of a choice, in a replay. */
  options: (labels: string[]) => `The choices were: ${labels.join(' / ')}.`,
  /** The narrator's line naming the one taken. */
  chose: (label: string) => `You chose: ${label}`,
  /** A choice nothing in the save can identify. */
  choseUnknown: 'You made a choice here.',
  overwriteTitle: 'Every slot is full',
  overwriteBody: (slot: number, name: string) =>
    `Put this checkpoint in Slot ${slot}${name ? ` (${name})` : ''}? What is saved there now will be replaced.`,
  overwriteConfirm: (slot: number) => `Replace Slot ${slot}`,
  overwriteCancel: 'Keep it',
} as const;
