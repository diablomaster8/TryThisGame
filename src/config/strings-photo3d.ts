/**
 * R0412 (LOOK-56): the Full 3D photo mode's words, and R0440's shelf. Kept beside
 * `strings.ts` (which other lanes edit at the same time) like the other look files.
 */
export const PHOTO3D_TEXT = {
  title: 'Photo',
  close: 'Close',
  snap: '📸 Snap',
  hideUi: 'Hide controls',
  showHint: 'Tap anywhere to bring the controls back.',
  help: 'Drag to turn round. Pinch or scroll to zoom; two fingers up or down to tilt.',
  tilt: 'Tilt',
  zoom: 'Zoom',
  roll: 'Roll',
  hour: 'Time of day',
  hourNow: 'Now',
  hourAt: (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`,
  pose: 'Pose',
  poses: {
    own: 'As they are',
    idle: 'Stand',
    happy: 'Happy',
    sit: 'Sit',
    love: 'Love',
    flap: 'Flap',
    sleep: 'Sleep',
    wave: 'Wave',
  } as Record<string, string>,
  face: 'Face',
  faces: {
    own: 'Their own',
    happy: 'Happy',
    wink: 'Wink',
    surprised: 'Surprised',
    sleepy: 'Sleepy',
  } as Record<string, string>,
  lookAtCamera: 'Look at the camera',
  group: 'Who',
  groups: { one: 'Just one', row: 'Group in a row', circle: 'Group in a circle' } as Record<
    string,
    string
  >,
  filter: 'Filter',
  filters: {
    none: 'None',
    warm: 'Warm',
    film: 'Film',
    sepia: 'Sepia',
    pixelate: 'Pixelate',
  } as Record<string, string>,
  pixelateNote: 'Pixelate shows on the snapped photo.',
  toon: 'Outlines',
  dof: 'Soft background',
  dofOff: 'Soft background (not on this device)',
  frame: 'Frame',
  frames: {
    none: 'None',
    cream: 'Cream',
    leaf: 'Leaf',
    wood: 'Wood',
    night: 'Night',
    petal: 'Petal',
    film: 'Film strip',
    golden: 'Golden',
  } as Record<string, string>,
  goldenLocked: 'Finish a page of the book for the golden frame.',
  stickers: 'Stickers',
  stickerHelp: 'Drag a sticker to move it; tap it to take it off.',
  clear: 'Clear',
  preview: 'Your photo',
  save: '💾 Save PNG',
  back: 'Back',
  saved: 'Saved, and put in the album.',
  noScene: 'The 3D view is not ready yet.',
  caption: (names: string[]) =>
    names.length <= 2
      ? names.join(' and ')
      : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`,
} as const;

/** R0411: the book page's 3D figure. */
export const TURNTABLE_TEXT = {
  loading: 'Shaping the figure…',
} as const;

/** R0440: the Shelf tab. */
export const SHELF_TEXT = {
  tab: 'Shelf',
  help: 'Drag a figure from the tray onto a slot, or tap a figure and then a slot. Tap a placed figure to spin it.',
  tray: 'Figures you can place',
  owned: 'Your Nubbins',
  seen: 'Seen forms',
  empty: 'Empty slot',
  remove: 'Take off the shelf',
  photo: '📷 Photograph the shelf',
  count: (n: number, total: number) => `${n} of ${total} slots filled`,
  shelfRow: (i: number) => `Shelf ${i + 1}`,
  none: 'Nothing to place yet. Hatch a Nubbin or see a form first.',
} as const;
