/** Lane D r11 helper 4: strings for the title home, the first loop, tabs, progress and diary. */
export const HOME_TEXT = {
  continue: 'Continue',
  newGame: 'New game',
  loadOther: 'Load another save',
  graphicsHelp: 'Pixel is the classic look. 3D is prettier but needs a stronger device.',
  newTitle: 'Start something new',
  cards: {
    campaign: {
      name: 'Story',
      blurb: 'Hazel’s Grove: a garden, a grandmother’s rules, an old cold.',
    },
    free: { name: 'Just the Grove', blurb: 'No story. You, your Nubbins and the garden.' },
    edu: { name: 'Learning Grove', blurb: 'Read-aloud stories and gentle games, ages 3 to 10.' },
    more: {
      name: 'More stories',
      blurb: 'The other story saves: Hundred Days, Logged In and more.',
    },
  } as Record<string, { name: string; blurb: string }>,
  slotsFull: 'All three saves in this mode are in use. Pick one to continue or start over.',
  ago: (ms: number): string => {
    const m = Math.floor(ms / 60_000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 48) return `${h} h ago`;
    return `${Math.floor(h / 24)} days ago`;
  },
};

export type SettingsTabId = 'sound' | 'display' | 'story' | 'time' | 'saves' | 'about';
export const SETTINGS_TABS: Array<{ id: SettingsTabId; label: string }> = [
  { id: 'sound', label: '🔊 Sound' },
  { id: 'display', label: '🖥 Display & comfort' },
  { id: 'story', label: '📖 Story & play' },
  { id: 'time', label: '⏳ Time' },
  { id: 'saves', label: '💾 Saves' },
  { id: 'about', label: 'ℹ About' },
];
