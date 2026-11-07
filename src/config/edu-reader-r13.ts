/**
 * R0716 (KIDS-48), second slice: the reading and science content of the reader band (ages
 * 7–10). Every passage and question here is original text written for the game. Kept apart
 * from `edu-reader.ts` so each file stays short.
 */

/** One comprehension question: the right answer and three plausible wrong ones. */
export interface ReadingQ {
  /** Starts with Who, What or Why. */
  q: string;
  right: string;
  wrong: readonly [string, string, string];
}

export interface ReadingPassage {
  /** An optional picture shown with the passage. */
  icon: string;
  /** Two or three short sentences. */
  text: string;
  /** Exactly one Who, one What and one Why question, in that order. */
  qs: readonly [ReadingQ, ReadingQ, ReadingQ];
}

export const EDU_READING: readonly ReadingPassage[] = [
  {
    icon: '🌱',
    text:
      'Mina planted three bean seeds by the garden gate. Every morning she gave them a little ' +
      'water. After ten days, green shoots pushed up through the soil.',
    qs: [
      { q: 'Who planted the seeds?', right: 'Mina', wrong: ['Tomas', 'Ada', 'Beni'] },
      {
        q: 'What did Mina plant?',
        right: 'Bean seeds',
        wrong: ['Apple pips', 'Sunflowers', 'Carrots'],
      },
      {
        q: 'Why did she water them?',
        right: 'To help them grow',
        wrong: ['To make them sleep', 'To wash them', 'To hide them'],
      },
    ],
  },
  {
    icon: '🌧',
    text:
      'Tomas forgot his umbrella on a morning when the clouds were low. Halfway to the bridge ' +
      'the rain began, and his coat was soaked. At home he hung it by the fire to dry.',
    qs: [
      { q: 'Who forgot an umbrella?', right: 'Tomas', wrong: ['Mina', 'Ada', 'Beni'] },
      {
        q: 'What did Tomas do with his wet coat?',
        right: 'Hung it by the fire',
        wrong: ['Gave it away', 'Left it on the bridge', 'Wore it to bed'],
      },
      {
        q: 'Why was his coat soaked?',
        right: 'He had no umbrella',
        wrong: ['He fell in a pond', 'He washed it', 'It was snowing'],
      },
    ],
  },
  {
    icon: '🐝',
    text:
      'The bees in the old orchard fly from flower to flower all spring. They carry sweet ' +
      'nectar back to the hive. There it slowly turns into honey.',
    qs: [
      {
        q: 'Who flies from flower to flower?',
        right: 'The bees',
        wrong: ['The owls', 'The ducks', 'The goats'],
      },
      { q: 'What do the bees carry back?', right: 'Nectar', wrong: ['Pebbles', 'Seeds', 'Apples'] },
      {
        q: 'Why do the bees visit flowers?',
        right: 'To collect nectar',
        wrong: ['To drink the rain', 'To build a nest', 'To scare the birds'],
      },
    ],
  },
  {
    icon: '🐈',
    text:
      'Ada’s cat, Biscuit, loves the warm windowsill. All afternoon he naps in a patch of sun. ' +
      'When the sun moves, he stretches and finds a new spot.',
    qs: [
      { q: 'Who loves the windowsill?', right: 'Biscuit', wrong: ['Ada', 'A mouse', 'A bird'] },
      {
        q: 'What does Biscuit do all afternoon?',
        right: 'Naps',
        wrong: ['Plays', 'Hunts', 'Swims'],
      },
      {
        q: 'Why does Biscuit find a new spot?',
        right: 'The sun moves',
        wrong: ['He is hungry', 'Ada calls him', 'It starts to rain'],
      },
    ],
  },
  {
    icon: '🪁',
    text:
      'Beni made a kite from paper and two thin sticks. On the hill the wind was strong, and ' +
      'the kite soared up high. He held the string tight so it would not blow away.',
    qs: [
      { q: 'Who made the kite?', right: 'Beni', wrong: ['Mina', 'Tomas', 'Ada'] },
      {
        q: 'What was the kite made from?',
        right: 'Paper and sticks',
        wrong: ['Cloth and wire', 'Leaves and string', 'Card and tape'],
      },
      {
        q: 'Why did Beni hold the string tight?',
        right: 'So it would not blow away',
        wrong: ['To make it fall', 'To feed it', 'To tie it to the hill'],
      },
    ],
  },
  {
    icon: '🐸',
    text:
      'A small frog sat on a lily pad at the edge of the pond. When a fly buzzed past, its long ' +
      'tongue flicked out and caught it. Then the frog hopped into the water with a plop.',
    qs: [
      { q: 'Who sat on the lily pad?', right: 'A frog', wrong: ['A duck', 'A fish', 'A snail'] },
      { q: 'What did the frog catch?', right: 'A fly', wrong: ['A worm', 'A beetle', 'A moth'] },
      {
        q: 'Why did the tongue flick out?',
        right: 'To catch the fly',
        wrong: ['To say hello', 'To taste the rain', 'To clean itself'],
      },
    ],
  },
  {
    icon: '🍞',
    text:
      'Every Saturday, Grandpa Oto bakes bread in the stone oven. The smell drifts over the ' +
      'fence, and the neighbours come to say hello. He gives the first warm loaf to Mrs Fenn ' +
      'next door.',
    qs: [
      { q: 'Who bakes the bread?', right: 'Grandpa Oto', wrong: ['Mrs Fenn', 'Ada', 'Beni'] },
      {
        q: 'What does Mrs Fenn get?',
        right: 'The first loaf',
        wrong: ['A jar of jam', 'A basket of eggs', 'A bunch of flowers'],
      },
      {
        q: 'Why do the neighbours come over?',
        right: 'They smell the bread',
        wrong: ['They want to swim', 'It is raining', 'They lost a cat'],
      },
    ],
  },
  {
    icon: '🏮',
    text:
      'Night comes early in winter. Lena lit the lantern and carried it to the shed to fetch ' +
      'some wood. The light made long shadows dance along the path.',
    qs: [
      { q: 'Who lit the lantern?', right: 'Lena', wrong: ['Mina', 'Kofi', 'Beni'] },
      { q: 'What did Lena fetch?', right: 'Some wood', wrong: ['Water', 'Apples', 'Blankets'] },
      {
        q: 'Why did Lena need the lantern?',
        right: 'It was dark',
        wrong: ['It was hot', 'She was lost', 'It was a party'],
      },
    ],
  },
  {
    icon: '🐢',
    text:
      'Kofi found a tortoise slowly crossing the lane. He stood beside it so that no cart would ' +
      'run it over. When it reached the long grass, Kofi grinned and went home.',
    qs: [
      { q: 'Who found the tortoise?', right: 'Kofi', wrong: ['Lena', 'Tomas', 'Beni'] },
      {
        q: 'What was the tortoise doing?',
        right: 'Crossing the lane',
        wrong: ['Eating a leaf', 'Sleeping', 'Hiding in its shell'],
      },
      {
        q: 'Why did Kofi stand beside it?',
        right: 'To keep it safe',
        wrong: ['To race it', 'To take it home', 'To feed it'],
      },
    ],
  },
  {
    icon: '🧁',
    text:
      'It was Mira’s seventh birthday, and her brother wanted to surprise her. He hid the cake ' +
      'in the pantry under a cloth. At sunset he carried it out with seven candles glowing.',
    qs: [
      {
        q: 'Who wanted to surprise Mira?',
        right: 'Her brother',
        wrong: ['Her aunt', 'Her teacher', 'Her dog'],
      },
      {
        q: 'What was hidden in the pantry?',
        right: 'A cake',
        wrong: ['A kite', 'A book', 'A cat'],
      },
      {
        q: 'Why were there seven candles?',
        right: 'Mira turned seven',
        wrong: ['Seven is lucky', 'He ran out of more', 'Seven friends came'],
      },
    ],
  },
  {
    icon: '🦉',
    text:
      'A barn owl lives in the tall oak. She sleeps through the day and hunts when the stars ' +
      'come out. Her soft feathers let her fly without a sound.',
    qs: [
      {
        q: 'Who lives in the tall oak?',
        right: 'A barn owl',
        wrong: ['A robin', 'A squirrel', 'A bat'],
      },
      { q: 'What does the owl do at night?', right: 'Hunts', wrong: ['Sleeps', 'Sings', 'Swims'] },
      {
        q: 'Why can she fly without a sound?',
        right: 'Her feathers are soft',
        wrong: ['She is very small', 'The wind is loud', 'She flies slowly'],
      },
    ],
  },
  {
    icon: '🧊',
    text:
      'The village pond froze hard in the coldest week. Children brought boots and scarves and ' +
      'slid across it. Mr Teague tapped the ice with his stick first, to check it was thick.',
    qs: [
      { q: 'Who tapped the ice first?', right: 'Mr Teague', wrong: ['Kofi', 'Lena', 'Mira'] },
      {
        q: 'What did the children slide on?',
        right: 'The frozen pond',
        wrong: ['Wet grass', 'The road', 'A snowy hill'],
      },
      {
        q: 'Why did he tap the ice?',
        right: 'To check it was thick',
        wrong: ['To break it', 'To wake the fish', 'To make music'],
      },
    ],
  },
  {
    icon: '🍎',
    text:
      'The apple tree behind the school is heavy with fruit. Each autumn the class picks the ' +
      'ripe ones and carries them to the kitchen. The cook turns them into pies for everyone.',
    qs: [
      {
        q: 'Who makes the pies?',
        right: 'The cook',
        wrong: ['The class', 'The teacher', 'The farmer'],
      },
      {
        q: 'What does the class pick?',
        right: 'Ripe apples',
        wrong: ['Pears', 'Plums', 'Flowers'],
      },
      {
        q: 'Why do the apples go to the kitchen?',
        right: 'To become pies',
        wrong: ['To be counted', 'To be painted', 'To be thrown away'],
      },
    ],
  },
  {
    icon: '🐜',
    text:
      'A line of ants marched across the patio, each one carrying a crumb. They took the crumbs ' +
      'to a tiny hole in the wall. Inside, the whole colony would share the food.',
    qs: [
      {
        q: 'Who marched across the patio?',
        right: 'The ants',
        wrong: ['The bees', 'The beetles', 'The snails'],
      },
      { q: 'What did each ant carry?', right: 'A crumb', wrong: ['A leaf', 'A seed', 'A twig'] },
      {
        q: 'Why did they take the crumbs inside?',
        right: 'To share the food',
        wrong: ['To hide from rain', 'To build a wall', 'To feed the cat'],
      },
    ],
  },
];

/** A thing to sort as living or not living. */
export const EDU_LIVING: ReadonlyArray<{
  name: string;
  icon: string;
  living: boolean;
  why: string;
}> = [
  { name: 'tulip', icon: '🌷', living: true, why: 'It grows, drinks water and makes seeds.' },
  { name: 'oak tree', icon: '🌳', living: true, why: 'It grows, drinks water and makes seeds.' },
  { name: 'sunflower', icon: '🌻', living: true, why: 'It grows and turns to the light.' },
  { name: 'mushroom', icon: '🍄', living: true, why: 'It grows and makes spores.' },
  { name: 'goldfish', icon: '🐟', living: true, why: 'It eats, breathes and grows.' },
  { name: 'bee', icon: '🐝', living: true, why: 'It eats, moves and has young.' },
  { name: 'frog', icon: '🐸', living: true, why: 'It eats, breathes and grows.' },
  { name: 'butterfly', icon: '🦋', living: true, why: 'It eats, grows and has young.' },
  { name: 'tortoise', icon: '🐢', living: true, why: 'It eats, breathes and grows.' },
  { name: 'snail', icon: '🐌', living: true, why: 'It eats, moves and grows.' },
  { name: 'rock', icon: '🪨', living: false, why: 'It does not eat, grow or have young.' },
  { name: 'teddy bear', icon: '🧸', living: false, why: 'It is a toy. It does not eat or grow.' },
  { name: 'football', icon: '⚽', living: false, why: 'It does not eat, grow or breathe.' },
  { name: 'toy car', icon: '🚗', living: false, why: 'It is made, not born. It does not grow.' },
  { name: 'chair', icon: '🪑', living: false, why: 'It is made of wood, but it is not alive.' },
  { name: 'book', icon: '📖', living: false, why: 'Paper does not eat, grow or breathe.' },
  { name: 'cloud', icon: '☁️', living: false, why: 'It moves, but it does not eat or grow.' },
  { name: 'bell', icon: '🔔', living: false, why: 'It makes a sound, but it is not alive.' },
  { name: 'candle', icon: '🕯️', living: false, why: 'A flame uses up wax, but it is not alive.' },
  { name: 'kite', icon: '🪁', living: false, why: 'The wind moves it. It is not alive.' },
];

/** A thing to test in water: does it float or sink? */
export const EDU_FLOATERS: ReadonlyArray<{
  name: string;
  icon: string;
  floats: boolean;
  why: string;
}> = [
  {
    name: 'wooden log',
    icon: '🪵',
    floats: true,
    why: 'Wood is light for its size, so it floats.',
  },
  { name: 'leaf', icon: '🍃', floats: true, why: 'A leaf is very light, so it floats.' },
  { name: 'feather', icon: '🪶', floats: true, why: 'A feather is very light, so it floats.' },
  { name: 'apple', icon: '🍎', floats: true, why: 'An apple has air inside, so it floats.' },
  { name: 'football', icon: '⚽', floats: true, why: 'It is full of air, so it floats.' },
  { name: 'rubber duck', icon: '🦆', floats: true, why: 'It is hollow and light, so it floats.' },
  { name: 'rock', icon: '🪨', floats: false, why: 'A rock is heavy for its size, so it sinks.' },
  { name: 'key', icon: '🔑', floats: false, why: 'Metal is heavy for its size, so it sinks.' },
  { name: 'coin', icon: '🪙', floats: false, why: 'A coin is metal, so it sinks.' },
  { name: 'anchor', icon: '⚓', floats: false, why: 'It is heavy metal, so it sinks.' },
  { name: 'brick', icon: '🧱', floats: false, why: 'A brick is heavy and solid, so it sinks.' },
  { name: 'bolt', icon: '🔩', floats: false, why: 'A bolt is a lump of metal, so it sinks.' },
];

/** Water in its three states: how it looks as ice, a drop or vapour. */
export const EDU_WATER_STATES: ReadonlyArray<{
  thing: string;
  icon: string;
  state: 'solid' | 'liquid' | 'gas';
}> = [
  { thing: 'an ice cube', icon: '🧊', state: 'solid' },
  { thing: 'a snowflake', icon: '❄️', state: 'solid' },
  { thing: 'an icicle', icon: '🧊', state: 'solid' },
  { thing: 'a raindrop', icon: '💧', state: 'liquid' },
  { thing: 'a puddle of water', icon: '🌧', state: 'liquid' },
  { thing: 'the water in a pond', icon: '🏞️', state: 'liquid' },
  { thing: 'water vapour', icon: '♨️', state: 'gas' },
];

export const EDU_WATER_STATE_TEACH: Readonly<Record<'solid' | 'liquid' | 'gas', string>> = {
  solid: 'Frozen water is a solid: it keeps its shape.',
  liquid: 'Water you can pour is a liquid.',
  gas: 'Water vapour is a gas. You cannot see it.',
};

/** Where an animal lives. */
export const EDU_HABITATS = ['pond', 'ocean', 'desert', 'woodland', 'icy land'] as const;
export type Habitat = (typeof EDU_HABITATS)[number];

export const EDU_HABITAT_ANIMALS: ReadonlyArray<{ name: string; icon: string; home: Habitat }> = [
  { name: 'whale', icon: '🐋', home: 'ocean' },
  { name: 'octopus', icon: '🐙', home: 'ocean' },
  { name: 'camel', icon: '🐪', home: 'desert' },
  { name: 'scorpion', icon: '🦂', home: 'desert' },
  { name: 'owl', icon: '🦉', home: 'woodland' },
  { name: 'deer', icon: '🦌', home: 'woodland' },
  { name: 'frog', icon: '🐸', home: 'pond' },
  { name: 'duck', icon: '🦆', home: 'pond' },
  { name: 'penguin', icon: '🐧', home: 'icy land' },
  { name: 'seal', icon: '🦭', home: 'icy land' },
];
