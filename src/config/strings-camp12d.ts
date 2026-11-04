/** Lane C round 12 (R0629, CAMP-37): the kid open flow's few words. */

export const KID_FLOW_TEXT = {
  /** The one big button on a child's invitation. */
  go: "Let's go!",
  /** A reader's help button on a stuck step. */
  help: 'Help me',
  helpLabel: 'Ask Moss to help with this step',
  /** What shows when Moss helps. */
  mossHelps: (title: string) => `Moss helps with ${title}.`,
} as const;
