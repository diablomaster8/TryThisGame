/** R0727: the grown-up's "Continue as a Keeper" action. */
export const GRADUATE_TEXT = {
  heading: 'Ready for Hazel’s Grove?',
  help: 'Copies this Grove into a Hazel’s Grove slot: the same Nubbins and keepsakes, a certificate, the story in its usual words from here, and Mature content Off. This Learning Grove stays as it is.',
  button: 'Continue as a Keeper',
  done: (slot: number) =>
    `Done. Hazel’s Grove slot ${slot} has everything. Find it on the title screen.`,
  noRoom: 'Every Hazel’s Grove slot is full. Delete one on the title screen first.',
  failed: 'Could not copy the save. Check the device storage.',
} as const;
