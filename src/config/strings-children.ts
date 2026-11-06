/** R0728: the "Children on this device" section of the grown-up area. */
export const CHILDREN_TEXT = {
  uiLanguage: 'Game language',
  uiLanguages: { en: 'English', he: 'עברית (Hebrew)' },
  uiLanguageHelp:
    'Changes the picker, rounds and results. Round questions and the story stay in English for now.',
  heading: 'Children on this device',
  help: (n: number, max: number) =>
    `${n} of ${max} children. Each has their own Grove, limits and minutes. The child playing now stays where they are in the order.`,
  rename: (slot: number) => `Name for child ${slot}`,
  moveUp: (slot: number) => `Move child ${slot} up`,
  moveDown: (slot: number) => `Move child ${slot} down`,
  copyAll: 'Copy this child’s limits to all',
  copied: 'Copied. Daily minutes, quiet hours and session length now match.',
  renamed: 'Saved.',
  failed: 'Could not save that. Check the device storage.',
} as const;
