/**
 * Lane B round 9, helper b: the Hollow's two secret levels. The Moo Meadow (R0189, DUNG-46)
 * opens from Gran's Teaspoon and a milk bell in the wheelbarrow (R0177); the Pillow Fort
 * (R0183, DUNG-40) from the three keys. Numbers live in `dungeon-r9-b.ts`.
 */
export const SECRETS_R9B_TEXT = {
  /** The wheelbarrow's recipe book line. */
  recipeMoo: "Gran's Teaspoon + a milk bell → a sunny portal (once a trip)",
  /** Keepsake keys, beside the Keys of Giggles, Yawns and Brrr. */
  keyName: { teaspoon: "Gran's Teaspoon", bell: 'Milk Bell' } as Record<string, string>,
  keyIcon: { teaspoon: '🥄', bell: '🔔' } as Record<string, string>,
  keepsakes: "The Hushkeeper leaves something behind: Gran's Teaspoon and a little milk bell. Odd.",
  mooOpen: 'The spoon clinks the bell. Somewhere, very faintly, something goes "moo".',
  herd: 'The Moo Crew tip their hats and moo-ve along.',
  queen: 'The Cow Queen curtseys, which is hard for a cow. She leaves you a picnic.',
  trio: 'The Pillow Trio flop over, giggling. You are the Pillow Champion!',
  /** The camp's crafting table, once a secret is open. */
  mooGo: 'Step through the sunny portal',
  mooHelp: 'A warm breeze smells of clover. You can visit once this trip.',
  fortGo: 'Crawl into the Pillow Fort',
  fortHelp: 'Three pillows guard the way. All three at once. Bring friends.',
  /** The running joke: the camp folk deny everything. */
  noMeadow: 'The camp folk say there is no Moo Meadow. They say it a bit quickly.',
  /** The Hollow bar's place name. */
  placeMoo: 'The Moo Meadow',
  placeFort: 'The Pillow Fort',
  title: 'Pillow Champion',
  wearables: {
    'pillow-crown': 'Pillow Crown',
    'moo-bonnet': 'Cow Queen Sun Bonnet',
  } as Record<string, string>,
};

/** The secret levels' uniques, for the ★ plate, the bout card and the Journal. */
export const SECRETS_R9B_UNIQUES: Record<string, { name: string; line: string }> = {
  'cow-queen': {
    name: 'The Cow Queen',
    line: 'Sunglasses on, crown askew. She would like you off her clover, please.',
  },
  'pillow-trio': {
    name: 'The Pillow Trio',
    line: 'Fluffy, Puffy and Snoozy. They fight as one, mostly by flopping.',
  },
};
