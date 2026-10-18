/**
 * Neopia quests: NQ1–NQ32, the one-time quests of retro Neopia (roughly 2000–2008).
 * Every quest here is finite and offered once. Nothing repeats, nothing has a timer,
 * nothing is lost by leaving it for later.
 *
 *   NQ1–NQ10   Faerie Quests. Each faerie asks once for one item from a land of Neopia
 *              and gives one blessing: a stat level for the pet you choose, or (the
 *              Fountain Faerie) one paint job in any classic colour.
 *   NQ11–NQ13  Illusen's chain (Meridell).  } Finishing the first quest of either chain sets
 *   NQ14–NQ16  Jhudora's chain (Faerieland). } its side flag and closes the other chain.
 *   NQ17–NQ21  Kitchen Quests (Mystery Island). A cookbook page each.
 *   NQ22–NQ26  Edna's Quests (Haunted Woods). A potion each. Audience 'main'.
 *   NQ27 the Brain Tree, NQ28 the Esophagor ('main'), NQ29 the Turmaculus,
 *   NQ30 the Secret Laboratory Map (unlocks the Lab Ray), NQ31 the Snowager's first
 *   sneak, NQ32 the signpost to Jelly World (a joke).
 *
 * Character names are the Neopets names from the brief; unnamed roles get role names
 * (The Island Chef, The Scientist). Every line of dialogue is new.
 *
 * Blessings: the stat rewards use kind 'item' and are applied at once to the pet the
 * player picks (Nubbin or Neo pet); they are not kept in the bag. "Intelligence" is the
 * hidden stat the brief adds (raised by books, read by the Wise Old King).
 *
 * Audience: 'all' unless noted. 'main' (Edna's Quests and the Esophagor, the darker Haunted
 * Woods content) means the main game only, never the Learning Grove. None of it is crude or
 * boozy, so none of it is 'adult'.
 *
 * Freebies: no reward here is per visit, daily or reset by leaving. Each is one-time or
 * unlimited (NQ31's sneak and NQ32's Giant Jelly are one-time).
 *
 * Flags: every quest sets `nq-<nn>-done`; choices set `nq-<nn>-*` flags, each read once in
 * its quest's complete scene through NEOPIA_QUESTS_VARIANTS (chosen as the Atlas chooses its
 * variants, sim/atlas.ts variantFor: `<scene id>-<flag name>` for a flag that is on) or in
 * the quest's notes. The faerie rivalry has one key per side so each is written once:
 * NQ11 sets `neo-side-illusen`, NQ14 sets `neo-side-jhudora`; the chain finals set
 * `neo-colours-illusen` (NQ13) and `neo-colours-jhudora` (NQ16).
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const l = (who: string, text: string, mood?: Mood): Line =>
  mood ? { who, text, mood } : { who, text };
const n = (text: string, mood?: Mood): Line => l('narrator', text, mood);

// ------------------------------------------------------------------ speakers
const faerie = (id: string, name: string): Speaker => ({
  id,
  name,
  kind: 'other',
  basedOn: `${name.replace(/^The /, '')} (Neopets)`,
});
const FIRE = faerie('fire-faerie', 'The Fire Faerie');
const WATER = faerie('water-faerie', 'The Water Faerie');
const AIR = faerie('air-faerie', 'The Air Faerie');
const EARTH = faerie('earth-faerie', 'The Earth Faerie');
const LIGHT = faerie('light-faerie', 'The Light Faerie');
const DARK = faerie('dark-faerie', 'The Dark Faerie');
const SPACE = faerie('space-faerie', 'The Space Faerie');
const BATTLE = faerie('battle-faerie', 'The Battle Faerie');
const TAELIA: Speaker = { id: 'taelia', name: 'Taelia', kind: 'other', basedOn: 'Taelia the Snow Faerie (Neopets)' };
const FOUNTAIN = faerie('fountain-faerie', 'The Fountain Faerie');
const FYORA: Speaker = { id: 'fyora', name: 'Queen Fyora', kind: 'other', basedOn: 'Queen Fyora (Neopets)' };
const ILLUSEN: Speaker = { id: 'illusen', name: 'Illusen', kind: 'other', basedOn: 'Illusen the Earth Faerie (Neopets)' };
const JHUDORA: Speaker = { id: 'jhudora', name: 'Jhudora', kind: 'other', basedOn: 'Jhudora the Dark Faerie (Neopets)' };
const CHEF: Speaker = { id: 'island-chef', name: 'The Island Chef', kind: 'other', basedOn: 'The Kitchen Quest chef (Neopets, Mystery Island)' };
const EDNA: Speaker = { id: 'edna', name: 'Edna', kind: 'other', basedOn: 'Edna the witch (Neopets, Haunted Woods)' };

const FAERIE_GROTTO = 'Faerieland, the Faerie Quest grotto below Queen Fyora’s castle';
const FAERIE_WHEN =
  'Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.';

export const NEOPIA_QUESTS: Quest[] = [
  // ================================================================== NQ1 Fire
  {
    id: 'nq01',
    code: 'NQ1',
    title: 'Faerie Quest: The Fire Faerie',
    source: 'Neopets: Faerie Quests (the Fire Faerie)',
    audience: 'all',
    trigger: { where: FAERIE_GROTTO, when: FAERIE_WHEN },
    speakers: [FIRE],
    steps: [
      {
        id: 'nq01-step1',
        goal: 'Bring the Fire Faerie one slice of the Giant Omelette from the Tyrannian Plateau.',
        hint: 'Take a slice from the Giant Omelette in Tyrannia, then carry it back to the grotto.',
        check: 'give:item:omelette-slice:fire-faerie',
        scene: {
          id: 'nq01-ask',
          lines: [
            n('A lamp in the grotto flares orange. A faerie steps out of the flame, brushing soot off her sleeves.'),
            l('fire-faerie', 'Keeper. At last, someone in sensible shoes.', 'happy'),
            l('fire-faerie', 'People call me hot-headed. I prefer “well done”. Mostly because everything I touch ends up well done.'),
            l('fire-faerie', 'I want something warm that I didn’t heat myself. Just once.', 'sad'),
            l('fire-faerie', 'The Tyrannians make an omelette the size of a hill. Bring me one slice. Just one.', 'think'),
            n('Your Nubbin sniffs her hem and backs away from the smell of singed toffee.'),
          ],
          choices: [
            {
              id: 'nq01-why',
              label: 'Ask why she can’t fetch it herself.',
              then: [l('fire-faerie', 'Last time I went near it, the omelette caught fire. Tyrannia still hasn’t forgiven me.', 'sad')],
            },
            {
              id: 'nq01-warm',
              label: 'Promise to bring it back still warm.',
              set: { 'nq-01-promised-warm': true },
              then: [l('fire-faerie', 'Warm is a bonus. Not on fire is the goal.', 'happy')],
            },
          ],
        },
        done: {
          id: 'nq01-ask-done',
          lines: [
            n('You hold out the slice. She takes it in both hands, very carefully, as if it might go up in smoke.'),
            l('fire-faerie', 'Soft. Yellow. Not burning. Remarkable.', 'happy'),
            n('Your Nubbin eyes the slice. The Fire Faerie eyes your Nubbin. The slice is not shared.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq01-complete',
      lines: [
        l('fire-faerie', 'A deal’s a deal. Show me the one who’ll carry my blessing.'),
        n('She cups her hands round your pet’s face. It feels like the first warm day of spring.'),
        l('fire-faerie', 'There. A little fire in the belly. Use it for pushing heavy things, not for arguments.', 'soft'),
        n('Your pet flexes. A pebble nearby rolls over, though nobody touched it.'),
        n('Power rises by one level.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq01-blessing', kind: 'item', label: 'Fire Faerie’s Blessing', description: 'One Power level for the pet you choose, applied at once.' },
    ],
    sets: { 'nq-01-done': true },
    notes:
      'Faerie Quest. The player picks which pet (Nubbin or Neo pet) gets the blessing in the complete scene. ' +
      'The omelette slice comes from the Giant Omelette in Tyrannia. Freebies are never per visit (canon: one-time or unlimited), so the Omelette must give a slice whenever this quest is open; the quest never forces a second trip. ' +
      'Art: Fire Faerie portrait (orange, soot-smudged), a grotto lamp flare. Sound: a soft whoomph as she appears.',
  },

  // ================================================================== NQ2 Water
  {
    id: 'nq02',
    code: 'NQ2',
    title: 'Faerie Quest: The Water Faerie',
    source: 'Neopets: Faerie Quests (the Water Faerie)',
    audience: 'all',
    trigger: { where: FAERIE_GROTTO, when: FAERIE_WHEN },
    speakers: [WATER],
    steps: [
      {
        id: 'nq02-step1',
        goal: 'Bring the Water Faerie a grey pearl from the Maraquan Ruins.',
        hint: 'Send a Swim Nubbin into the Maraquan Ruins, or try your one cast at Underwater Fishing in Maraqua.',
        check: 'give:item:grey-maraquan-pearl:water-faerie',
        scene: {
          id: 'nq02-ask',
          lines: [
            n('The grotto pool ripples, though there is no wind. A faerie rises out of it, perfectly dry.'),
            l('water-faerie', 'Hello, Keeper. Your Nubbin has been staring at my pool like it owes it money.', 'happy'),
            l('water-faerie', 'I keep a string of pearls, one from every sea. Maraqua’s is missing.'),
            l('water-faerie', 'The pink one remembers a sunset. The black one remembers a shipwreck and won’t stop going on about it.'),
            l('water-faerie', 'Not a shiny one. A grey one, from the old ruins. Grey pearls remember things.', 'think'),
            n('Your Nubbin dips a foot in the pool, gasps at the cold, and does it again.'),
          ],
          choices: [
            {
              id: 'nq02-shiny',
              label: 'Ask whether a shiny one would do.',
              then: [l('water-faerie', 'Shiny ones only remember being shiny. Grey, please.')],
            },
            {
              id: 'nq02-dive',
              label: 'Say your Nubbin will dive for it.',
              set: { 'nq-02-dived': true },
              then: [l('water-faerie', 'Good. Pearls like being found by someone who enjoyed the swim.', 'soft')],
            },
          ],
        },
        done: {
          id: 'nq02-ask-done',
          lines: [
            n('The pearl is the colour of a rainy morning. She threads it between a pink one and a black one.'),
            l('water-faerie', 'There. The string’s a full circle again. It was driving me mad.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq02-complete',
      lines: [
        l('water-faerie', 'Hold your swimmer up for me.'),
        n('She tips a handful of pool water over your pet’s head. It doesn’t get wet. It gets slippery, in a good way.'),
        l('water-faerie', 'Water will make room for you now. Don’t abuse the privilege.', 'soft'),
        n('Swim rises by one level.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq02-blessing', kind: 'item', label: 'Water Faerie’s Blessing', description: 'One Swim level for the pet you choose, applied at once.' },
    ],
    sets: { 'nq-02-done': true },
    notes:
      'Faerie Quest. Maraqua is Swim-Nubbins-only (brief), so the fishing route lets a Keeper without a swimmer finish it: ' +
      'make the grey pearl a guaranteed catch on the first cast after this quest starts. Art: a pearl string with one gap.',
  },

  // ================================================================== NQ3 Air
  {
    id: 'nq03',
    code: 'NQ3',
    title: 'Faerie Quest: The Air Faerie',
    source: 'Neopets: Faerie Quests (the Air Faerie)',
    audience: 'all',
    trigger: { where: FAERIE_GROTTO, when: FAERIE_WHEN },
    speakers: [AIR],
    steps: [
      {
        id: 'nq03-step1',
        goal: 'Bring the Air Faerie a bronze wind chime from the Shenkuu terraces.',
        hint: 'The chime seller sits on the highest terrace in Shenkuu. Pick whichever chime you like.',
        check: 'give:item:shenkuu-wind-chime:air-faerie',
        scene: {
          id: 'nq03-ask',
          lines: [
            n('A gust slams every door in the grotto. When it settles, a faerie is sitting on the top shelf, swinging her feet.'),
            l('air-faerie', 'Sorry. I’ve never learned to arrive quietly. Wind doesn’t do quietly.', 'happy'),
            l('air-faerie', 'Here’s my trouble. The wind is bored. It blows all day and nobody hears a thing.'),
            l('air-faerie', 'In Shenkuu they hang little bronze chimes on the terraces. Fetch me one, and the wind gets a voice.', 'think'),
            l('air-faerie', 'I tried whistling for it myself once. Three hats blew off and a Poogle race had to be run again.', 'sad'),
            n('Your Nubbin spreads its wings and waits for a gust. It gets one. It falls over.'),
          ],
          choices: [
            {
              id: 'nq03-best',
              label: 'Offer to find the best-sounding one.',
              then: [l('air-faerie', 'Pick the one that sounds best when nobody’s listening. That’s the honest one.', 'soft')],
            },
            {
              id: 'nq03-quiet',
              label: 'Ask whether the wind could just be quiet instead.',
              then: [l('air-faerie', 'Ask a river to sit still. See how you get on.', 'think')],
            },
          ],
        },
        done: {
          id: 'nq03-ask-done',
          lines: [
            n('Before you can hand it over, the wind snatches the chime and hangs it from the grotto roof.'),
            n('It rings three notes, then a fourth that doesn’t quite fit.'),
            l('air-faerie', 'It’s showing off already. Perfect.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq03-complete',
      lines: [
        l('air-faerie', 'Right, your flyer. Arms out. Wings out. Whatever you’ve got, out.'),
        n('A warm updraft lifts your pet a hand’s height off the floor, then sets it down gently.'),
        l('air-faerie', 'The wind knows your name now. It’ll give you a lift if you ask nicely.', 'soft'),
        n('Your pet lands, then immediately jumps again, to check the wind meant it.', 'happy'),
        n('Fly rises by one level.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq03-blessing', kind: 'item', label: 'Air Faerie’s Blessing', description: 'One Fly level for the pet you choose, applied at once.' },
    ],
    sets: { 'nq-03-done': true },
    notes:
      'Faerie Quest. After completion the chime stays hanging in the grotto and rings whenever the player passes (ambient sound). ' +
      'Shenkuu is a mountain-garden land; the chime seller is a background vendor, no lines needed.',
  },

  // ================================================================== NQ4 Earth
  {
    id: 'nq04',
    code: 'NQ4',
    title: 'Faerie Quest: The Earth Faerie',
    source: 'Neopets: Faerie Quests (the Earth Faerie)',
    audience: 'all',
    trigger: { where: FAERIE_GROTTO, when: FAERIE_WHEN },
    speakers: [EARTH],
    steps: [
      {
        id: 'nq04-step1',
        goal: 'Bring the Earth Faerie a turnip from Meri Acres Farm in Meridell.',
        hint: 'Meri Acres Farm sells its turnips at the gate. Any turnip with mud still on it counts.',
        check: 'give:item:meri-acres-turnip:earth-faerie',
        scene: {
          id: 'nq04-ask',
          lines: [
            n('Moss creeps across the grotto floor in a neat line. At the end of it, a faerie kneels, patting the soil.'),
            l('earth-faerie', 'Mind the moss, Keeper. It’s only just got comfortable.'),
            l('earth-faerie', 'I’d like a turnip. Don’t laugh. A proper one, from Meri Acres Farm.', 'think'),
            l('earth-faerie', 'Faerie gardens grow whatever you wish for, so everything tastes of wishing. I want something that tastes of work.'),
            n('Behind her, a faerie garden grows in perfect rows. Every flower is the same height. It looks as if it has been told off.'),
            n('Your Nubbin is already digging a small hole beside her, out of solidarity.'),
          ],
          choices: [
            {
              id: 'nq04-grow',
              label: 'Offer to grow her one at home.',
              then: [l('earth-faerie', 'Kind. But I want Meridell mud on it. That mud has opinions.', 'happy')],
            },
            {
              id: 'nq04-which',
              label: 'Ask which farmer to buy from.',
              then: [l('earth-faerie', 'Whoever looks most tired. They grow the best ones.')],
            },
          ],
        },
        done: {
          id: 'nq04-ask-done',
          lines: [
            n('The turnip is lumpy, purple at the shoulders, and still wearing a fair bit of Meridell.'),
            l('earth-faerie', 'Oh, it’s heavy for its size. That’s the sign of a good one.', 'happy'),
            l('earth-faerie', 'I shall call him Gerald. Then I shall eat Gerald. That’s farming, dear.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq04-complete',
      lines: [
        l('earth-faerie', 'Now. Which of yours never wants to stop?'),
        n('She presses your pet’s feet into the moss. For a moment it stands very still, like a fence post that has decided to stay.'),
        l('earth-faerie', 'Roots. You’ll tire later than you used to, and recover sooner.', 'soft'),
        n('Stamina rises by one level.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq04-blessing', kind: 'item', label: 'Earth Faerie’s Blessing', description: 'One Stamina level for the pet you choose, applied at once.' },
    ],
    sets: { 'nq-04-done': true },
    notes: 'Faerie Quest. A turnip grown in the Grove does not count (the check wants the Meri Acres item). Art: moss trail decal on the grotto floor.',
  },

  // ================================================================== NQ5 Light
  {
    id: 'nq05',
    code: 'NQ5',
    title: 'Faerie Quest: The Light Faerie',
    source: 'Neopets: Faerie Quests (the Light Faerie)',
    audience: 'all',
    trigger: { where: FAERIE_GROTTO, when: FAERIE_WHEN },
    speakers: [LIGHT],
    steps: [
      {
        id: 'nq05-step1',
        goal: 'Bring the Light Faerie a sunstone scarab from the market in Sakhmet.',
        hint: 'Sakhmet is the city of the Lost Desert. The scarab stall is beside Coltzan’s Shrine.',
        check: 'give:item:sunstone-scarab:light-faerie',
        scene: {
          id: 'nq05-ask',
          lines: [
            n('Every candle in the grotto brightens at once. A faerie appears in the glare, squinting and apologising.'),
            l('light-faerie', 'Too much? It’s always too much. Give me a moment.'),
            n('The light dims to something you can look at. She is smaller than you expected, and very freckled.'),
            l('light-faerie', 'In Sakhmet they carve little scarabs from sunstone. Each one holds a morning inside.', 'think'),
            l('light-faerie', 'Mine cracked, and it’s where I keep my nights. Would you bring me a new one?', 'sad'),
            l('light-faerie', 'Without it the nights leak out. Last week I glowed so brightly at bedtime that Queen Fyora sent a note.', 'sad'),
          ],
          choices: [
            {
              id: 'nq05-nights',
              label: 'Ask why a light faerie keeps nights.',
              then: [l('light-faerie', 'Everybody needs somewhere to put the dark when they’ve finished with it.', 'soft')],
            },
            {
              id: 'nq05-haggle',
              label: 'Promise to haggle hard.',
              set: { 'nq-05-haggled': true },
              then: [l('light-faerie', 'Desert traders love a haggler. Start at half, and look disappointed.', 'happy')],
            },
          ],
        },
        done: {
          id: 'nq05-ask-done',
          lines: [
            n('The scarab is warm in your palm, as if it has been sitting on a windowsill all day.'),
            l('light-faerie', 'It hums. Can you hear it? That means it’s a good one.', 'happy'),
            n('The trader threw in a second, smaller scarab “for the little one”. Your Nubbin is wearing it as a hat.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq05-complete',
      lines: [
        l('light-faerie', 'Light is the fastest thing there is. I can lend you a little of that.'),
        n('She taps your pet’s nose. For a blink it glows, then it’s across the grotto and back before you’ve finished blinking.'),
        l('light-faerie', 'Don’t let it go to their head.', 'happy'),
        n('Run rises by one level.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq05-blessing', kind: 'item', label: 'Light Faerie’s Blessing', description: 'One Run level for the pet you choose, applied at once.' },
    ],
    sets: { 'nq-05-done': true },
    notes: 'Faerie Quest. On her entrance, brighten the screen briefly and then settle (no full-white flash; keep it gentle for photosensitive players).',
  },

  // ================================================================== NQ6 Dark
  {
    id: 'nq06',
    code: 'NQ6',
    title: 'Faerie Quest: The Dark Faerie',
    source: 'Neopets: Faerie Quests (the Dark Faerie)',
    audience: 'all',
    trigger: { where: FAERIE_GROTTO, when: FAERIE_WHEN },
    speakers: [DARK],
    steps: [
      {
        id: 'nq06-step1',
        goal: 'Bring the Dark Faerie a black reading candle from the chandler in Neovia.',
        hint: 'Neovia is the little town in the Haunted Woods. The chandler’s shop has a candle in every window.',
        check: 'give:item:neovian-black-candle:dark-faerie',
        scene: {
          id: 'nq06-ask',
          lines: [
            n('One corner of the grotto goes dark. Not shadowy. Dark, like a page with the ink spilled on it.'),
            l('dark-faerie', 'Don’t fuss. I’m not here to frighten anyone. That’s a different faerie, and she’s busy.'),
            l('dark-faerie', 'I read at night. All night. My candle has burned down to a puddle.', 'sad'),
            l('dark-faerie', 'The chandler in Neovia makes black candles. Just enough light to read by, and not a flicker more.', 'think'),
            n('On a little shelf in the dark: a stack of library books, all overdue, all bookmarked in the last chapter.'),
            n('Your Nubbin peers into the dark corner. The dark corner peers back, politely.'),
          ],
          choices: [
            {
              id: 'nq06-read',
              label: 'Ask what she reads.',
              then: [l('dark-faerie', 'Everything. Recipes, maps, the backs of jars. Knowing things is my favourite thing.', 'happy')],
            },
            {
              id: 'nq06-lamp',
              label: 'Offer her a nice bright lamp instead.',
              then: [l('dark-faerie', 'Bright lamps attract moths and visitors. I want neither.')],
            },
          ],
        },
        done: {
          id: 'nq06-ask-done',
          lines: [
            n('The candle is black, smells of pine, and burns with a small, steady violet flame.'),
            l('dark-faerie', 'Oh, that’s lovely. That’s a two-chapter candle at least.', 'soft'),
            l('dark-faerie', 'If you see the other Dark Faerie, I haven’t got it. She’d only want to borrow it, and she never gives things back.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq06-complete',
      lines: [
        l('dark-faerie', 'I’ll give your pet a little of what I like best: knowing.'),
        n('She whispers into your pet’s ear. It tilts its head, thinks hard, then sorts three pebbles neatly by size.'),
        l('dark-faerie', 'Clever thing. The Wise Old King will notice. He notices everything, eventually.'),
        n('Intelligence rises by one level.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq06-blessing', kind: 'item', label: 'Dark Faerie’s Blessing', description: 'One Intelligence level (the hidden stat raised by books) for the pet you choose, applied at once.' },
    ],
    sets: { 'nq-06-done': true },
    notes:
      'Faerie Quest. Not Jhudora: the generic Dark Faerie, gentle and bookish, so the quest suits all ages. Her line about "a different faerie" is a nod to Jhudora. ' +
      'Neovia is only visited for the candle here; it is the NP10 town, but nothing of the Tale of Woe appears.',
  },

  // ================================================================== NQ7 Space
  {
    id: 'nq07',
    code: 'NQ7',
    title: 'Faerie Quest: The Space Faerie',
    source: 'Neopets: Faerie Quests (the Space Faerie)',
    audience: 'all',
    trigger: { where: FAERIE_GROTTO, when: FAERIE_WHEN },
    speakers: [SPACE],
    steps: [
      {
        id: 'nq07-step1',
        goal: 'Bring the Space Faerie a pocket-sized piece of Kreludite from Kreludor.',
        hint: 'Take the shuttle from the Virtupets Space Station to Kreludor and ask the Grundo miners.',
        check: 'give:item:kreludite-chunk:space-faerie',
        scene: {
          id: 'nq07-ask',
          lines: [
            n('The grotto roof turns into a night sky. A faerie floats down through the stars, upside down, then rights herself.'),
            l('space-faerie', 'Gravity. I always forget which way it goes on the ground.', 'happy'),
            l('space-faerie', 'Sorry. I’m a bit spaced out today. I’m a bit spaced out every day. It’s in the job title.'),
            l('space-faerie', 'Keeper, I need a piece of Kreludite. Orange rock. From Kreludor, the moon with the mines.'),
            l('space-faerie', 'I’m building a little model of the sky. Every moon gets a pebble, and Kreludor’s is missing.', 'think'),
            n('Your Nubbin tries to catch a passing star. It goes straight through its paws.'),
          ],
          choices: [
            {
              id: 'nq07-miners',
              label: 'Ask whether the miners will mind.',
              then: [l('space-faerie', 'Ask the Grundos nicely. They’re very generous, and very tired of rocks.')],
            },
            {
              id: 'nq07-size',
              label: 'Ask how big a piece she needs.',
              then: [l('space-faerie', 'Pocket-sized. Anything bigger is a boulder, and I have no shelf for a boulder.', 'happy')],
            },
          ],
        },
        done: {
          id: 'nq07-ask-done',
          lines: [
            n('The Kreludite is orange, light as pumice and faintly warm.'),
            n('She sets it spinning above her palm, and the little model of Neopia finally has its moon.'),
            l('space-faerie', 'There. The sky’s finished. Well, my sky.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq07-complete',
      lines: [
        l('space-faerie', 'I bless the part that most needs it. That’s the fair way.'),
        n('She looks your pet over like a star chart, and taps one spot, gently.'),
        l('space-faerie', 'Everyone has a dim star. This one’s brighter now.', 'soft'),
        n('Your pet’s lowest stat rises by one level.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq07-blessing', kind: 'item', label: 'Space Faerie’s Blessing', description: 'One level in the chosen pet’s lowest stat (Swim, Fly, Run, Power or Stamina; ties go to the first in that order), applied at once.' },
    ],
    sets: { 'nq-07-done': true },
    notes:
      'Faerie Quest. Kreludor is reachable before NP13; this quest does not touch the Sloth plot. ' +
      'The Space Faerie also appears in NP13 (her token); she should look the same, and the miners can be the same Grundo camp sprites.',
  },

  // ================================================================== NQ8 Battle
  {
    id: 'nq08',
    code: 'NQ8',
    title: 'Faerie Quest: The Battle Faerie',
    source: 'Neopets: Faerie Quests (the Battle Faerie)',
    audience: 'all',
    trigger: { where: FAERIE_GROTTO, when: FAERIE_WHEN },
    speakers: [BATTLE],
    steps: [
      {
        id: 'nq08-step1',
        goal: 'Bring the Battle Faerie a Thick Smoke Bomb from Smugglers’ Cove on Krawk Island.',
        hint: 'The shop in Smugglers’ Cove keeps them under the counter. Ask for the counter.',
        check: 'give:item:thick-smoke-bomb:battle-faerie',
        scene: {
          id: 'nq08-ask',
          lines: [
            n('Something clangs. A faerie in dented armour strides in and drops her helmet on the table.'),
            l('battle-faerie', 'Keeper. You look like someone who finishes what they start. Good.'),
            l('battle-faerie', 'I’m teaching a class at the Battledome. Today’s lesson is how to leave a fight.', 'think'),
            l('battle-faerie', 'For that I need a Thick Smoke Bomb. The smugglers on Krawk Island keep them under the counter.'),
            l('battle-faerie', 'They’ll say they don’t have any. Then they’ll ask how many. That’s how you know it’s the right shop.', 'think'),
            n('Your Nubbin salutes. Nobody taught it to salute. It just felt right.'),
          ],
          choices: [
            {
              id: 'nq08-leave',
              label: 'Ask why leaving is a lesson.',
              then: [l('battle-faerie', 'Anyone can start a fight. Knowing when to stop one is the hard part.', 'soft')],
            },
            {
              id: 'nq08-teach',
              label: 'Ask her to teach your Nubbin to fight instead.',
              then: [l('battle-faerie', 'It’ll learn both. In that order: leaving first.')],
            },
          ],
        },
        done: {
          id: 'nq08-ask-done',
          lines: [
            n('The smoke bomb is round, grey, and sloshes slightly. You carry it very carefully.'),
            l('battle-faerie', 'Unopened. Good. My last student used one on the way back.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq08-complete',
      lines: [
        n('The Battle Faerie buckles her helmet back on, which seems to be how she gets serious.'),
        l('battle-faerie', 'You did the errand without blowing anything up. That earns a blessing.', 'happy'),
        l('battle-faerie', 'Now. Strength to hit hard, or strength to keep going?', 'think'),
        n('Your pet looks between you, ready for either.'),
      ],
      choices: [
        {
          id: 'nq08-power',
          label: 'Strength to hit hard.',
          set: { 'nq-08-blessing': 'power' },
          then: [l('battle-faerie', 'Plant your feet. Breathe out as you push.'), n('Power rises by one level.', 'happy')],
        },
        {
          id: 'nq08-stamina',
          label: 'Strength to keep going.',
          set: { 'nq-08-blessing': 'stamina' },
          then: [l('battle-faerie', 'Wise. The last one standing usually wins.', 'happy'), n('Stamina rises by one level.', 'happy')],
        },
      ],
    },
    rewards: [
      { id: 'nq08-blessing', kind: 'item', label: 'Battle Faerie’s Blessing', description: 'One level of Power or Stamina, your choice, for the pet you choose, applied at once.' },
    ],
    sets: { 'nq-08-done': true },
    notes:
      'Faerie Quest. The blessing choice lives in the complete scene; apply the stat from the `nq-08-blessing` flag. ' +
      'The smoke bomb is consumed by the quest (it is not added to the Battledome item bag). Art: dented helmet prop.',
  },

  // ================================================================== NQ9 Snow
  {
    id: 'nq09',
    code: 'NQ9',
    title: 'Faerie Quest: Taelia the Snow Faerie',
    source: 'Neopets: Faerie Quests (the Snow Faerie, Taelia)',
    audience: 'all',
    trigger: { where: 'Terror Mountain, Taelia’s ice hut', when: 'Any time after your first visit to Terror Mountain. Asks only once.' },
    speakers: [TAELIA],
    steps: [
      {
        id: 'nq09-step1',
        goal: 'Bring Taelia a scoop of her own flavour from the Ice Cream Factory in Happy Valley.',
        hint: 'The Ice Cream Factory is in Happy Valley, just down the slope. Ask for the Taelia flavour.',
        check: 'give:item:taelia-ice-cream:taelia',
        scene: {
          id: 'nq09-ask',
          lines: [
            n('Taelia’s hut is colder inside than out. She sits by an empty fireplace, knitting something very long.'),
            l('taelia', 'Keeper! Come in. Don’t take your coat off, you’ll regret it.', 'happy'),
            l('taelia', 'A silly favour. The Ice Cream Factory has named a flavour after me.'),
            l('taelia', 'I’ve never tried it. I’m too shy to go in and order my own name. Everyone would look.', 'sad'),
            l('taelia', 'There are posters with my face on, smiling. I have never once smiled like that. It’s very unsettling.'),
            n('Your Nubbin is shivering, but politely, so as not to make a fuss.'),
          ],
          choices: [
            {
              id: 'nq09-flavour',
              label: 'Ask what the flavour is.',
              then: [l('taelia', 'Snowberry and something called Faerie Mint. It sounds like toothpaste. I have to know.', 'think')],
            },
            {
              id: 'nq09-together',
              label: 'Offer to go in with her.',
              set: { 'nq-09-invited': true },
              then: [l('taelia', 'Oh, I couldn’t. Next time. Maybe. Probably not.', 'soft'), n('She blushes. Snow faeries blush blue.')],
            },
          ],
        },
        done: {
          id: 'nq09-ask-done',
          lines: [
            n('It hasn’t melted. Nothing melts in Taelia’s hut.'),
            n('At the Factory they asked if it was for Taelia. You said it was for a friend. Both were true.'),
            n('She tastes it, closes her eyes, and is quiet for a long while.'),
            l('taelia', 'It does taste a bit like toothpaste. I love it.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq09-complete',
      lines: [
        l('taelia', 'Your Nubbin was so brave about the cold. Let me make sure it never minds it again.'),
        n('She wraps the end of her knitting once round your pet’s neck, then unwinds it. The scarf is gone. The warmth stays.'),
        l('taelia', 'There. A scarf on the inside.', 'soft'),
        n('Stamina rises by one level.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq09-blessing', kind: 'item', label: 'Snow Faerie’s Blessing', description: 'One Stamina level for the pet you choose, applied at once.' },
    ],
    sets: { 'nq-09-done': true },
    notes:
      'Faerie Quest. Taelia uses the same speaker id and portrait as in NP3 (The Ski Lodge Mystery); either can come first. ' +
      'The Taelia flavour is a new Happy Valley ice cream item (food, small Stamina lean). Her knitting can be a prop that grows a little each time you visit.',
  },

  // ================================================================== NQ10 Fountain
  {
    id: 'nq10',
    code: 'NQ10',
    title: 'Faerie Quest: The Fountain Faerie',
    source: 'Neopets: Faerie Quests (the Fountain Faerie)',
    audience: 'all',
    trigger: { where: 'Faerieland, the dry fountain behind the Healing Springs', when: 'After the nine other Faerie Quests are done. Once, ever.' },
    requires: ['NQ1', 'NQ2', 'NQ3', 'NQ4', 'NQ5', 'NQ6', 'NQ7', 'NQ8', 'NQ9'],
    speakers: [FOUNTAIN],
    steps: [
      {
        id: 'nq10-step1',
        goal: 'Bring the Fountain Faerie a clear glass float from the Kiko Lake workshops.',
        hint: 'The glassblowers work on the jetty at Kiko Lake. Ask for a float, not a bottle.',
        check: 'give:item:kiko-glass-float:fountain-faerie',
        scene: {
          id: 'nq10-ask',
          lines: [
            n('The fountain behind the Healing Springs has always been dry. Today water climbs out of it in a slow, glittering spiral.'),
            l('fountain-faerie', 'Nine of my sisters have been talking about you, Keeper. All nice things. It was exhausting.', 'happy'),
            l('fountain-faerie', 'I paint. One pet, one colour, once. But my fountain needs a float to catch the light first.', 'think'),
            l('fountain-faerie', 'The glassblowers on Kiko Lake make floats as clear as a held breath. Bring me one.'),
            l('fountain-faerie', 'A float, mind. Not a bottle. The last Keeper brought a bottle with a message in it. It was a shopping list.', 'think'),
            n('Your Nubbin leans over the rim. Its reflection is a slightly different colour every time the water moves.'),
          ],
        },
        done: {
          id: 'nq10-ask-done',
          lines: [
            n('The float bobs onto the water. Light breaks through it and spreads into every colour at once.'),
            l('fountain-faerie', 'There they all are. Now we can choose.', 'soft'),
          ],
        },
      },
      {
        id: 'nq10-step2',
        goal: 'Choose one pet and one colour for the Fountain Faerie to paint.',
        hint: 'Any classic colour is on offer. There is no clock; take as long as you like.',
        check: 'paint:fountain-faerie:any',
        scene: {
          id: 'nq10-choose',
          lines: [
            l('fountain-faerie', 'Any pet you’ve brought. Any colour on the list, Baby to Zombie.'),
            l('fountain-faerie', 'Most people choose in a hurry, then spend years wishing they’d picked Starry.', 'think'),
            l('fountain-faerie', 'Once, a Kau chose Invisible. We still don’t know where she is. Sometimes, on quiet nights, we hear mooing.', 'happy'),
            n('The colours turn slowly in the spray, waiting.'),
            n('Your Nubbins line up along the rim, each one trying very hard to look like it deserves Rainbow.'),
            l('fountain-faerie', 'No pressure. Well. A little pressure. It is forever.', 'happy'),
          ],
          choices: [
            {
              id: 'nq10-now',
              label: 'Choose now, before you overthink it.',
              then: [l('fountain-faerie', 'Decisive. People who choose fast usually choose right. Usually.', 'happy')],
            },
            {
              id: 'nq10-wait',
              label: 'Ask for time to think.',
              set: { 'nq-10-pondered': true },
              then: [l('fountain-faerie', 'Of course. Forever deserves a cup of tea first. The fountain will keep. So will I.', 'soft')],
            },
            {
              id: 'nq10-nubbin',
              label: 'Let your Nubbin pick the colour.',
              set: { 'nq-10-chooser': 'nubbin' },
              then: [
                n('Your Nubbin walks the length of the spray, ignores Rainbow, ignores Gold, and sits down happily under Brown.'),
                l('fountain-faerie', 'Brown. Of all of them. I don’t think I’ve ever respected anyone more.', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'nq10-complete',
      lines: [
        n('She cups the spray in both hands and pours it over your chosen pet, slowly, from ears to tail.'),
        n('The colour sinks in like dye into cloth. It will never wash out.'),
        l('fountain-faerie', 'That colour is theirs now. It will follow them through every rebirth.', 'soft'),
        n('Another of your Nubbins stands hopefully under the spray. Nothing happens. It sulks.'),
        l('fountain-faerie', 'Only once, little one. That’s what makes it special.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'nq10-paint',
        kind: 'cosmetic',
        label: 'The Fountain Faerie’s Paint Job',
        description: 'One pet painted any classic colour you choose, permanently, carried through rebirth. Mutant and Jelly are not on offer.',
      },
    ],
    sets: { 'nq-10-done': true },
    notes:
      'Faerie Quest, the capstone: offered only after NQ1–NQ9 (the brief: "one quest, once"). ' +
      'Step 2 opens the Rainbow Pool colour picker limited to the classic paint brush list (Baby … Zombie); Nubbins take the colour as their egg colour. ' +
      'Choosing "Ask for time to think" closes the picker; the step stays open and the fountain stays on until a colour is picked. No timer. ' +
      'If `nq-10-chooser` = nubbin, the picker opens with Brown pre-selected; the player can still change it. ' +
      'Art: the spiral fountain, the float’s light splitting into a rainbow.',
  },

  // ================================================================== NQ11 Illusen 1
  {
    id: 'nq11',
    code: 'NQ11',
    title: 'Illusen: The Borrowed Herbal',
    source: 'Neopets: Illusen’s Quests (Illusen’s Glade, Meridell)',
    audience: 'all',
    trigger: {
      where: 'Meridell, Illusen’s Glade',
      when: 'After your first visit to Meridell, while `neo-side-jhudora` is unset. Never offered once Jhudora’s side is taken.',
    },
    speakers: [ILLUSEN],
    steps: [
      {
        id: 'nq11-step1',
        goal: 'Bring Illusen a copy of the Brightvale Herbal from the scroll shop in Brightvale.',
        hint: 'Brightvale’s scroll shop is next to King Hagan’s castle. The Herbal is the fat green one.',
        check: 'give:item:brightvale-herbal:illusen',
        scene: {
          id: 'nq11-ask',
          lines: [
            n('Illusen’s Glade is quiet, green and slightly too tidy, as if someone has swept the moss.'),
            l('illusen', 'Welcome, Keeper. Sit, if the toadstool will have you.', 'soft'),
            l('illusen', 'My herb beds are failing and I can’t remember why. The answer was in a book I lent away.', 'sad'),
            l('illusen', 'I lent it to a faerie who lives on a purple cloud. She says she never had it. She has it.', 'angry'),
            l('illusen', 'Brightvale keeps a copy of everything. Bring me their Herbal, and I may ask you for more.'),
            n('Your Nubbin finds a patch of clover and lies down in it as if it has waited all its life to do so.'),
          ],
          choices: [
            {
              id: 'nq11-cloud',
              label: 'Ask about the faerie on the cloud.',
              then: [
                l('illusen', 'Jhudora. We were friends, once. Now we’re neighbours, which is worse.', 'think'),
                l('illusen', 'You should know: help one of us properly, and the other won’t forgive it.'),
              ],
            },
            {
              id: 'nq11-fetch',
              label: 'Say you’ll fetch the book.',
              then: [l('illusen', 'Thank you. Quietly, mind. Purple clouds have ears.', 'soft')],
            },
          ],
        },
        done: {
          id: 'nq11-ask-done',
          lines: [
            n('The Herbal is heavy, smells of dried lavender, and falls open at the page on wilting thyme.'),
            l('illusen', 'Oh. Of course. Too much shade. I planted the beds where I like to sit.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq11-complete',
      lines: [
        l('illusen', 'You’ve done me a kindness, Keeper. In Meridell we remember kindness.', 'happy'),
        n('Far over the hills, a purple cloud darkens by one shade. You get the feeling it noticed.'),
        l('illusen', 'That’s Jhudora sulking. Her door is closed to you now. I’m sorry. I did warn you.', 'sad'),
        l('illusen', 'Mine is open. Come back when you can. There’s more to mend.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 'nq11-side',
        kind: 'flag',
        label: 'Illusen’s Friend',
        description: 'You have taken Illusen’s side. Her chain continues (NQ12–NQ13); Jhudora’s chain (NQ14–NQ16) closes for good.',
      },
    ],
    sets: { 'nq-11-done': true, 'neo-side-illusen': true },
    notes:
      'Rival chain, part 1 of 3. Completing this quest sets `neo-side-illusen` and withdraws NQ14–NQ16 (even if NQ14 is in progress). ' +
      'The two chains are exclusive, so each side has its own key (`neo-side-illusen` here, `neo-side-jhudora` in NQ14) and no flag has two writers. ' +
      'Accepting it does not lock anything; only completion does. The warning in the "Ask about the faerie" choice must also show in the quest offer text. ' +
      'If the player visits Jhudora’s Cloud afterwards, play one line from her (speaker jhudora): "Oh, it’s you. Illusen’s little helper. The door’s that way. It’s also locked." No quest.',
  },

  // ================================================================== NQ12 Illusen 2
  {
    id: 'nq12',
    code: 'NQ12',
    title: 'Illusen: A Sunnier Spot',
    source: 'Neopets: Illusen’s Quests (Illusen’s Glade, Meridell)',
    audience: 'all',
    trigger: { where: 'Meridell, Illusen’s Glade', when: 'Straight after NQ11, or any later visit.' },
    requires: ['NQ11'],
    speakers: [ILLUSEN],
    steps: [
      {
        id: 'nq12-step1',
        goal: 'Fetch a sack of black volcanic soil from the foot of Techo Mountain on Mystery Island.',
        hint: 'The soil is free for the digging on Techo Mountain’s lower slopes. You carry the sack; your Nubbins supervise.',
        check: 'give:item:volcanic-soil:illusen',
        scene: {
          id: 'nq12-soil',
          lines: [
            l('illusen', 'The Herbal says herbs want sun and rich soil. I’ve got the sun now. The soil’s tired.'),
            l('illusen', 'Techo Mountain throws up the richest earth in Neopia, and nobody wants it because it’s black.', 'think'),
            l('illusen', 'Jhudora calls black soil “a bit much”. Jhudora lives on a purple cloud.', 'think'),
            l('illusen', 'One sack, please. Not the hot bit at the top.'),
            n('Your Nubbin looks at the size of the sack she is holding out, and quietly sits on its own feet.'),
            l('illusen', 'Not you, little one. I meant the Keeper.', 'happy'),
          ],
        },
        done: {
          id: 'nq12-soil-done',
          lines: [
            n('You set the sack down. It is warm, and smells of rain on hot stones.'),
            l('illusen', 'Oh, that’s good soil. You can practically hear it wanting to grow things.', 'happy'),
            n('Your Nubbin, who carried none of it, lies flat on its back as the most exhausted member of the party.'),
          ],
        },
      },
      {
        id: 'nq12-step2',
        goal: 'Help Illusen dig the new herb beds and plant them out.',
        hint: 'Place the three herb beds anywhere in the glade’s sunny meadow, then water each one.',
        check: 'place:decor:illusen-herb-bed:3',
        scene: {
          id: 'nq12-dig',
          lines: [
            n('Illusen rolls up her sleeves. Faerie or not, she digs like a farmer.'),
            n('Within a minute one Nubbin has found a worm, named it, and introduced it to everyone.'),
            n('Your Nubbins dig too, mostly in the wrong places, with tremendous enthusiasm.'),
            l('illusen', 'Lovely. That hole can be a pond. Now, the beds.', 'happy'),
            l('illusen', 'Where shall we put them? I’ve got two ideas and I like them both.', 'think'),
            l('illusen', 'The meadow, where it’s sunny all day. Or by the stream, where it’s sunny most of the day and pretty all of it.'),
          ],
          choices: [
            {
              id: 'nq12-meadow',
              label: 'The meadow. Sun is sun.',
              set: { 'nq-12-beds': 'meadow' },
              then: [l('illusen', 'Sensible. The thyme will thank you.', 'happy')],
            },
            {
              id: 'nq12-stream',
              label: 'By the stream. Pretty counts.',
              set: { 'nq-12-beds': 'stream' },
              then: [l('illusen', 'I hoped you’d say that. I’ll sit by them and pretend I’m working.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'nq12-complete',
      lines: [
        n('By evening the beds are planted. Your Nubbins have soil up to their elbows and look extremely proud.'),
        l('illusen', 'In a week this will smell like a kitchen. A good one.', 'happy'),
        l('illusen', 'Take a bed home with you. I’ve made a spare. I always make a spare.'),
        n('Over the hills, the purple cloud rumbles once, then thinks better of it.'),
      ],
    },
    rewards: [
      { id: 'nq12-herb-bed', kind: 'decor', label: 'Illusen’s Herb Bed', description: 'A raised bed of thyme, sage and mint for your sandbox. Nubbins who nap beside it wake slightly calmer.' },
    ],
    sets: { 'nq-12-done': true },
    notes:
      'Rival chain, part 2 (Illusen). Step 2 uses the decorate tool inside the glade; bed placement within the meadow or by the stream follows `nq-12-beds`. ' +
      'The volcanic soil is a one-off quest item, not added to shops.',
  },

  // ================================================================== NQ13 Illusen 3
  {
    id: 'nq13',
    code: 'NQ13',
    title: 'Illusen: The Glade Wakes',
    source: 'Neopets: Illusen’s Quests (Illusen’s Glade, Meridell)',
    audience: 'all',
    trigger: { where: 'Meridell, Illusen’s Glade', when: 'Your next visit to the glade after NQ12.' },
    requires: ['NQ12'],
    speakers: [ILLUSEN, JHUDORA],
    steps: [
      {
        id: 'nq13-step1',
        goal: 'Keep the new herb beds covered while Jhudora’s storm passes over the glade.',
        hint: 'Tap a bed when the hail warning shows over it to pull a leaf cover across. Every bed you save counts; you can’t fail outright.',
        check: 'minigame:cover:glade-storm',
        scene: {
          id: 'nq13-storm',
          lines: [
            n('The glade is green and buzzing. Then the light turns purple, and the bees go home early.'),
            l('jhudora', 'Lovely little garden, Illusen. Shame about the weather.'),
            n('A cloud the colour of a bruised plum settles over the meadow. It begins, very precisely, to hail.'),
            l('illusen', 'She’s hailing in time to the music from her cloud. She always did have rhythm. I used to like that about her.', 'sad'),
            l('illusen', 'She’s aiming at the beds! Keeper, the leaf covers, quickly!', 'shock'),
            n('Your Nubbins scatter to the corners of the beds, each grabbing a leaf twice its size.'),
          ],
          choices: [
            {
              id: 'nq13-shout',
              label: 'Shout up at the cloud.',
              set: { 'nq-13-shouted': true },
              then: [l('jhudora', 'I can’t hear you over the sound of my excellent hail.'), n('You’re fairly sure she can.')],
            },
            {
              id: 'nq13-cover',
              label: 'Say nothing. Grab a leaf.',
              then: [l('illusen', 'Good. Don’t give her the satisfaction.', 'angry')],
            },
          ],
        },
        done: {
          id: 'nq13-storm-done',
          lines: [
            n('The hail stops. The cloud drifts off, grumbling. Under the leaves, the herbs are fine.'),
            l('illusen', 'She’ll be back. She’s always back. But not today.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq13-complete',
      lines: [
        n('Illusen walks the length of the glade, touching each plant. Behind her, flowers open in a wave of green and gold.'),
        l('illusen', 'There. Awake, all of it. It’s been years.', 'soft'),
        l('illusen', 'Take my colours home, Keeper. Let your fields look a bit like Meridell.'),
        n('She picks one sprig of mint, thinks, and drops it into a passing breeze heading for the purple cloud.'),
        l('illusen', 'She likes mint. She’d never admit it.', 'think'),
      ],
    },
    rewards: [
      { id: 'nq13-colours', kind: 'cosmetic', label: 'Illusen’s Colours', description: 'Your sandbox sections take on Illusen’s green and gold: fences, banners, path edging and lantern glass.' },
      { id: 'nq13-title', kind: 'title', label: 'Keeper of the Glade', description: 'Title for finishing Illusen’s chain.' },
    ],
    sets: { 'nq-13-done': true, 'neo-colours-illusen': true },
    notes:
      'Rival chain, final (Illusen). `neo-colours-illusen` is this chain’s own one-time colours unlock (Jhudora’s chain sets `neo-colours-jhudora`); only one can ever be set. ' +
      'Storm minigame: three beds, hail warnings appear over one bed at a time, a tap pulls a leaf cover; about 40 seconds, no fail state, score saved only for flavour. ' +
      'Jhudora appears as a voice and a cloud only. The colours reward is the brief’s "your choice sets which faerie’s colours appear in your sections"; make it a toggle in the decorate menu so the player can switch it off.',
  },

  // ================================================================== NQ14 Jhudora 1
  {
    id: 'nq14',
    code: 'NQ14',
    title: 'Jhudora: The Missing Usuki',
    source: 'Neopets: Jhudora’s Quests (Jhudora’s Cloud, Faerieland)',
    audience: 'all',
    trigger: {
      where: 'Faerieland, Jhudora’s Cloud',
      when: 'After your first visit to Faerieland, while `neo-side-illusen` is unset. Never offered once Illusen’s side is taken.',
    },
    speakers: [JHUDORA],
    steps: [
      {
        id: 'nq14-step1',
        goal: 'Bring Jhudora a Shadow Usuki doll from the Usuki shop in Neopia Central.',
        hint: 'The Usuki shop is on the main street in Neopia Central. The Shadow one is on the top shelf, at the back.',
        check: 'give:item:shadow-usuki:jhudora',
        scene: {
          id: 'nq14-ask',
          lines: [
            n('Jhudora’s Cloud is purple, cold, and full of shelves. Every shelf is full of Usuki dolls, all facing the door.'),
            l('jhudora', 'Don’t touch anything. Don’t breathe on anything. Do you want a job?'),
            l('jhudora', 'I have every Usuki ever made except one. The Shadow Usuki. It’s for research.', 'think'),
            l('jhudora', 'I can’t go into a toy shop myself. People would talk. Illusen would talk.', 'angry'),
            l('jhudora', 'Last time I went in, the shopkeeper hid behind the plushies. I only wanted change for a Shell.'),
            n('Your Nubbin stares up at four hundred tiny faces. Four hundred tiny faces stare back.'),
          ],
          choices: [
            {
              id: 'nq14-research',
              label: 'Ask what kind of research.',
              then: [l('jhudora', 'The kind where I finish my collection. Next question.')],
            },
            {
              id: 'nq14-illusen',
              label: 'Ask about Illusen.',
              then: [
                l('jhudora', 'The green one in the glade. Smug. Tidy. Borrows things and says she lent them.', 'angry'),
                l('jhudora', 'Do this for me, and she won’t give you the time of day. Fair warning. I’m always fair.'),
              ],
            },
          ],
        },
        done: {
          id: 'nq14-ask-done',
          lines: [
            n('You hand over the doll. Jhudora sets it in the last gap on the last shelf, and steps back.'),
            l('jhudora', 'Complete. Do you know how long I’ve waited to say that?', 'soft'),
            n('Four hundred and one tiny faces now watch the door. Somehow this is worse.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq14-complete',
      lines: [
        l('jhudora', 'You’re useful, Keeper. I don’t say that to many people. I don’t say it to anyone.'),
        n('Far away over Meridell, a green glade goes very slightly quiet. You get the feeling it noticed.'),
        l('jhudora', 'That’s Illusen being disappointed. She’s very good at it. Her glade’s closed to you now.', 'happy'),
        l('jhudora', 'Come back. I have bigger jobs, and you’ve passed the toy-shop test.'),
      ],
    },
    rewards: [
      {
        id: 'nq14-side',
        kind: 'flag',
        label: 'Jhudora’s Ally',
        description: 'You have taken Jhudora’s side. Her chain continues (NQ15–NQ16); Illusen’s chain (NQ11–NQ13) closes for good.',
      },
    ],
    sets: { 'nq-14-done': true, 'neo-side-jhudora': true },
    notes:
      'Rival chain, part 1 of 3. Completing this quest sets `neo-side-jhudora` and withdraws NQ11–NQ13 (even if NQ11 is in progress). ' +
      'Each side has its own key (see NQ11), so no flag has two writers. ' +
      'If the player visits Illusen’s Glade afterwards, play one line from her (speaker illusen): "Hello, Keeper. I hope she’s grateful. She won’t be, but I hope so." No quest. ' +
      'Art: the cloud interior with wall-to-wall Usuki shelves; one empty gap until this quest ends.',
  },

  // ================================================================== NQ15 Jhudora 2
  {
    id: 'nq15',
    code: 'NQ15',
    title: 'Jhudora: A Stone That Hums',
    source: 'Neopets: Jhudora’s Quests (Jhudora’s Cloud, Faerieland)',
    audience: 'all',
    trigger: { where: 'Faerieland, Jhudora’s Cloud', when: 'Straight after NQ14, or any later visit.' },
    requires: ['NQ14'],
    speakers: [JHUDORA],
    steps: [
      {
        id: 'nq15-step1',
        goal: 'Bring Jhudora a humming stone from the ramparts of the Darigan Citadel.',
        hint: 'The Citadel floats above Meridell. A guard at the gate will let you pick one loose stone from the rampart.',
        check: 'give:item:citadel-stone:jhudora',
        scene: {
          id: 'nq15-ask',
          lines: [
            l('jhudora', 'Next job. I’m building a storm lantern. It needs a heart.'),
            l('jhudora', 'The stones on the Darigan Citadel hum when it rains. The whole fortress sings like a kettle.', 'think'),
            l('jhudora', 'Lord Darigan won’t miss one. Ask nicely. He likes nicely. It confuses him.'),
            l('jhudora', 'Don’t mention Meridell. Don’t mention orbs. Don’t mention that I told you not to mention them.'),
            n('While she talks, you notice a fat green book on her desk. The spine says: The Brightvale Herbal. Property of I.'),
            n('Your Nubbin notices it too, and looks at you very hard.'),
          ],
          choices: [
            {
              id: 'nq15-mention',
              label: 'Point out Illusen’s book.',
              set: { 'nq-15-book': 'mentioned' },
              then: [
                l('jhudora', 'That? I’m keeping it safe. She’d only get mud on it.', 'angry'),
                n('She slides it into a drawer. She does not lock the drawer.'),
              ],
            },
            {
              id: 'nq15-silent',
              label: 'Say nothing about it.',
              set: { 'nq-15-book': 'unmentioned' },
              then: [n('Jhudora catches you looking, and very slowly puts a teacup on top of it.')],
            },
          ],
        },
        done: {
          id: 'nq15-ask-done',
          lines: [
            n('The stone is dark violet and buzzes faintly against your palm, like a cat deciding whether to purr.'),
            l('jhudora', 'Perfect. Listen to it. It already knows it’s going to rain.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq15-complete',
      lines: [
        n('Jhudora sets the stone inside a cage of black iron and taps the glass. The whole lantern starts to hum.'),
        l('jhudora', 'One more job, Keeper. The big one. The Faerie Festival lanterns go up soon, and I intend to outshine them.'),
        l('jhudora', 'Here. For being quiet about things you might have been loud about.'),
        n('She hands you a small lantern, a copy of her own, and doesn’t look at you while she does it.'),
      ],
    },
    rewards: [
      { id: 'nq15-lantern', kind: 'decor', label: 'Jhudora’s Storm Lantern', description: 'An iron lantern with a humming violet stone. It glows brighter when rain is coming in your Grove.' },
    ],
    sets: { 'nq-15-done': true },
    notes:
      'Rival chain, part 2 (Jhudora). The Herbal on her desk is the book Illusen asks about in NQ11, so both chains share one quiet thread; `nq-15-book` changes one line in NQ16. ' +
      'If `nq-15-book` = mentioned, replace nq15-complete#2 (0-based) with: l(\'jhudora\', \'Here. For being loud about the right thing, and then dropping it.\'). ' +
      'Lord Darigan does not appear; the Citadel guard is a background sprite. The Faerie Festival is named only as flavour, not as a calendar event.',
  },

  // ================================================================== NQ16 Jhudora 3
  {
    id: 'nq16',
    code: 'NQ16',
    title: 'Jhudora: The Purple Storm',
    source: 'Neopets: Jhudora’s Quests (Jhudora’s Cloud, Faerieland)',
    audience: 'all',
    trigger: { where: 'Faerieland, Jhudora’s Cloud', when: 'Your next visit to Faerieland after NQ15.' },
    requires: ['NQ15'],
    speakers: [JHUDORA, FYORA],
    steps: [
      {
        id: 'nq16-step1',
        goal: 'Conduct Jhudora’s lightning show over Faerieland from the top of her cloud.',
        hint: 'Trace each glowing path with your finger before it fades. Missed bolts just fizzle; you can’t fail.',
        check: 'minigame:conduct:jhudora-storm',
        scene: {
          id: 'nq16-show',
          lines: [
            n('Night over Faerieland. Below, lanterns float up from Queen Fyora’s castle in neat golden rows.'),
            l('jhudora', 'Pretty. Polite. Boring. Watch this.'),
            n('Fyora’s lanterns rise in a pattern that spells WELCOME. Several are slightly crooked. Jhudora tuts at each one.'),
            n('She hands you the storm lantern. It hums so hard your teeth buzz.'),
            l('jhudora', 'You draw the bolts. I’ll do the thunder. Save the biggest one for the end.', 'happy'),
            n('Your Nubbin’s fur is standing straight up. It looks like a dandelion clock, and it is thrilled.'),
          ],
          choices: [
            {
              id: 'nq16-sky',
              label: 'Plan to aim the last bolt straight up, at the stars.',
              set: { 'nq-16-last-bolt': 'sky' },
              then: [l('jhudora', 'Showy. I approve.', 'happy')],
            },
            {
              id: 'nq16-glade',
              label: 'Plan to aim it at Illusen’s glade. Just the rain, not the lightning.',
              set: { 'nq-16-last-bolt': 'glade' },
              then: [
                l('jhudora', 'Rain on her precious herbs. They’ll grow like mad and she’ll have to thank the weather.', 'think'),
                l('jhudora', 'Ha. Yes. Do that.'),
              ],
            },
          ],
        },
        done: {
          id: 'nq16-show-done',
          lines: [
            n('The last bolt splits the sky into purple branches. Every lantern in Faerieland flickers, then glows brighter.'),
            n('Down on the castle balcony, a small figure in a crown is applauding.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq16-complete',
      lines: [
        l('fyora', 'Jhudora. That was the best Festival sky in a hundred years. You might have told me.', 'happy'),
        l('jhudora', 'If I’d told you, you’d have asked me to make it pink.'),
        l('fyora', 'I would. Thank your Keeper. I suspect they kept you from aiming at my roof.', 'soft'),
        l('jhudora', 'Fine. Keeper, take my colours. Let your fields look like they have a bit of nerve.'),
        n('As you leave, you hear a drawer open behind you, and a green book being wrapped in brown paper.'),
      ],
    },
    rewards: [
      { id: 'nq16-colours', kind: 'cosmetic', label: 'Jhudora’s Colours', description: 'Your sandbox sections take on Jhudora’s violet and black-green: fences, banners, path edging and lantern glass.' },
      { id: 'nq16-title', kind: 'title', label: 'Friend of the Cloud', description: 'Title for finishing Jhudora’s chain.' },
    ],
    sets: { 'nq-16-done': true, 'neo-colours-jhudora': true },
    notes:
      'Rival chain, final (Jhudora). `neo-colours-jhudora` is this chain’s own one-time colours unlock (Illusen’s chain sets `neo-colours-illusen`); only one can ever be set. ' +
      'Lightning minigame: 8–10 glowing paths to trace, slow and forgiving, no fail state. The last bolt points at the sky or the glade per `nq-16-last-bolt`. ' +
      'Closing line changes if `nq-15-book` = unmentioned: replace the last narration with "As you leave, a drawer opens behind you. You don’t look back." ' +
      'Colours reward works like NQ13’s (a decorate-menu toggle). Queen Fyora appears only here in the faerie quests.',
  },

  // ================================================================== NQ17 Kitchen 1
  {
    id: 'nq17',
    code: 'NQ17',
    title: 'Kitchen Quest: A Cheese With Momentum',
    source: 'Neopets: Kitchen Quests (Mystery Island)',
    audience: 'all',
    trigger: { where: 'Mystery Island, the Kitchen by the Tombola', when: 'After your first visit to Mystery Island.' },
    speakers: [CHEF],
    steps: [
      {
        id: 'nq17-step1',
        goal: 'Bring the Island Chef a whole round cheese from the Meridell Cheeseroller.',
        hint: 'The Cheeseroller hill is outside the Meridell village. Finish one roll and keep the cheese.',
        check: 'give:item:cheeseroller-cheese:island-chef',
        scene: {
          id: 'nq17-ask',
          lines: [
            n('The Kitchen is a hut with no front wall and four pots on the boil. The chef is stirring all four at once.'),
            l('island-chef', 'Keeper! You have hands. Excellent. I have five recipes and no ingredients.', 'happy'),
            l('island-chef', 'First: a cheese that’s been rolled down a hill in Meridell. It makes the inside go creamy.', 'think'),
            l('island-chef', 'Don’t ask me how I know. A Meridellian told me. They don’t lie about cheese.'),
            l('island-chef', 'Do all five and I’ll tell you my name. Nobody on this island knows my name. It drives them wild.', 'think'),
            n('Your Nubbin is hanging over the edge of a pot, breathing in steam with its eyes shut.'),
          ],
          choices: [
            {
              id: 'nq17-science',
              label: 'Ask whether rolling really changes the cheese.',
              then: [l('island-chef', 'Probably not. But it changes the cook, and the cook makes the cheese taste better.', 'happy')],
            },
            {
              id: 'nq17-five',
              label: 'Ask what the other four recipes are.',
              then: [l('island-chef', 'One at a time. If I tell you all five, you’ll want to start with the jelly. Everyone does.')],
            },
          ],
        },
        done: {
          id: 'nq17-ask-done',
          lines: [
            n('The cheese is round, dented, and has a few blades of grass pressed into the rind.'),
            l('island-chef', 'Look at that. Battle scars. That’s a cheese that’s lived.', 'happy'),
            n('You don’t mention that your Nubbin rode it most of the way down the hill. Some secrets belong to the cheese.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq17-complete',
      lines: [
        n('The chef grates the cheese onto coconut bread and slides it under a hot stone. It bubbles and browns.'),
        l('island-chef', 'Cheese and coconut toast. Try it before your Nubbin does. That’s advice, not an order.'),
        n('Your Nubbin has already tried it. It is lying on its back, chewing slowly.'),
        l('island-chef', 'Take the page. Cook it at home. Tell nobody it was this easy.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq17-page', kind: 'item', label: 'Cookbook Page: Cheese and Coconut Toast', description: 'A Grove kitchen recipe: cheese plus coconut makes a toast that fills hunger well and leans slightly towards Power.' },
    ],
    sets: { 'nq-17-done': true },
    notes: 'Kitchen Quest 1 of 5. The chef is a role name (no named NPC in the brief). Cookbook pages go into the Collection book and unlock the recipe in the Grove kitchen.',
  },

  // ================================================================== NQ18 Kitchen 2
  {
    id: 'nq18',
    code: 'NQ18',
    title: 'Kitchen Quest: Jam From the Stone Age',
    source: 'Neopets: Kitchen Quests (Mystery Island)',
    audience: 'all',
    trigger: { where: 'Mystery Island, the Kitchen', when: 'After NQ17.' },
    requires: ['NQ17'],
    speakers: [CHEF],
    steps: [
      {
        id: 'nq18-step1',
        goal: 'Bring the Island Chef a jar of lava-berry jam from the Tyrannian Town market.',
        hint: 'The jam stall is in Tyrannia’s town, under the big stone awning. It comes in a clay jar.',
        check: 'give:item:lava-berry-jam:island-chef',
        scene: {
          id: 'nq18-ask',
          lines: [
            l('island-chef', 'Second recipe. Pancakes. But pancakes need something on top, or they’re just flat apologies.'),
            n('A stack of pancakes is already waiting “just in case”. It is taller than your Nubbin, and leaning.'),
            l('island-chef', 'The Tyrannians make a jam from lava-berries. It’s sweet, then hot, then sweet again.', 'think'),
            l('island-chef', 'Get it in a clay jar. Glass ones crack. Don’t ask me how I know that either.'),
            n('Your Nubbin licks its lips, then remembers the word “hot” and looks less certain.'),
            l('island-chef', 'It’s not that hot. It’s friendly hot. Mostly.', 'happy'),
          ],
          choices: [
            {
              id: 'nq18-friendly',
              label: 'Ask exactly how hot “friendly hot” is.',
              then: [l('island-chef', 'Friendly like a big dog. Means well. Knocks you over. Licks your face while you’re down.', 'think')],
            },
            {
              id: 'nq18-glass',
              label: 'Offer to bring it in a glass jar, so you can see it.',
              set: { 'nq-18-glass': true },
              then: [l('island-chef', 'Clay. CLAY. Glass cracks. I lost an eyebrow finding that out. It grew back sulky.', 'angry')],
            },
          ],
        },
        done: {
          id: 'nq18-ask-done',
          lines: [
            n('The jam is dark red and the jar is warm, though it has been in your bag all day.'),
            l('island-chef', 'Still warm? That’s the good stuff. The jam keeps its own fire.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq18-complete',
      lines: [
        n('Pancakes hit the pan. Jam goes on in a slow red spiral.'),
        l('island-chef', 'Small bite first. Then wait. Then decide whether you’re brave.'),
        n('Your Nubbin takes a small bite. Its ears go pink, then red, then back to normal. It holds out its paw for more.'),
        l('island-chef', 'A brave one. I knew it. Take the page.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq18-page', kind: 'item', label: 'Cookbook Page: Lava-berry Pancakes', description: 'A Grove kitchen recipe: pancakes with lava-berry jam. Good for hunger, with a small lean towards Run.' },
    ],
    sets: { 'nq-18-done': true },
    notes: 'Kitchen Quest 2 of 5. Lava-berry jam is a new Tyrannian food item; "hot" is flavour only, no damage or sickness. `nq-18-glass` changes the chef’s last complete line (NEOPIA_QUESTS_VARIANTS); the jam always comes in clay.',
  },

  // ================================================================== NQ19 Kitchen 3
  {
    id: 'nq19',
    code: 'NQ19',
    title: 'Kitchen Quest: Kelp, Fresh',
    source: 'Neopets: Kitchen Quests (Mystery Island)',
    audience: 'all',
    trigger: { where: 'Mystery Island, the Kitchen', when: 'After NQ18.' },
    requires: ['NQ18'],
    speakers: [CHEF],
    steps: [
      {
        id: 'nq19-step1',
        goal: 'Bring the Island Chef a bundle of fresh sea kelp from Maraqua.',
        hint: 'A Swim Nubbin can pick kelp in Maraqua, or buy a bundle from the stall outside King Kelpbeard’s palace.',
        check: 'give:item:maraquan-kelp:island-chef',
        scene: {
          id: 'nq19-ask',
          lines: [
            l('island-chef', 'Third recipe. Crisps. Not potato. Kelp.', 'happy'),
            n('A bowl of last week’s kelp sits in the corner. It smells, exactly as promised, like a boot.'),
            l('island-chef', 'Kelp from Maraqua. Fresh. If it doesn’t still smell like the sea, it smells like a boot.'),
            l('island-chef', 'Bring it back wet. I’ll do the rest.'),
            n('Your Nubbin wrinkles its nose. It has met a boot before.'),
            l('island-chef', 'Swimmer or shopper, I don’t mind. Just make it squeak.', 'think'),
          ],
          choices: [
            {
              id: 'nq19-dive',
              label: 'Say a Swim Nubbin will pick it.',
              set: { 'nq-19-picked': true },
              then: [l('island-chef', 'Even better. Kelp tastes happier when it’s picked by someone who likes swimming.')],
            },
            {
              id: 'nq19-buy',
              label: 'Say you’ll buy it from the palace stall.',
              then: [l('island-chef', 'Fine, fine. Squeeze it before you pay. It should squeak.', 'think')],
            },
          ],
        },
        done: {
          id: 'nq19-ask-done',
          lines: [
            n('The kelp drips on the chef’s floor. It squeaks when you squeeze it.'),
            l('island-chef', 'Squeaky. Perfect. You learn fast.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq19-complete',
      lines: [
        n('The chef slices the kelp thin, salts it, and lays it on a hot stone. It curls up into green ribbons that crackle.'),
        l('island-chef', 'Sea kelp crisps. Salty, crunchy, and somehow good for you. Don’t tell the children that part.'),
        n('Your Nubbin eats one, then another, then is found later asleep in the empty bowl.'),
        l('island-chef', 'The page is yours. Three down.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq19-page', kind: 'item', label: 'Cookbook Page: Sea Kelp Crisps', description: 'A Grove kitchen recipe: crisp kelp snacks. A small hunger fill with a lean towards Swim.' },
    ],
    sets: { 'nq-19-done': true },
    notes: 'Kitchen Quest 3 of 5. The stall route exists so a Keeper without a Swim Nubbin can finish it (Maraqua is Swim-only past the palace).',
  },

  // ================================================================== NQ20 Kitchen 4
  {
    id: 'nq20',
    code: 'NQ20',
    title: 'Kitchen Quest: Gravy in a Tube',
    source: 'Neopets: Kitchen Quests (Mystery Island)',
    audience: 'all',
    trigger: { where: 'Mystery Island, the Kitchen', when: 'After NQ19.' },
    requires: ['NQ19'],
    speakers: [CHEF],
    steps: [
      {
        id: 'nq20-step1',
        goal: 'Bring the Island Chef a tube of gravy from Grundo’s Café on the Virtupets Space Station.',
        hint: 'Grundo’s Café is on the Space Station’s food deck. The gravy comes in a silver tube.',
        check: 'give:item:space-gravy-tube:island-chef',
        scene: {
          id: 'nq20-ask',
          lines: [
            l('island-chef', 'Fourth recipe. I’m nervous about this one.', 'think'),
            l('island-chef', 'The Grundos on the Space Station sell gravy in a tube. You squeeze it, like toothpaste.'),
            l('island-chef', 'I have to know if it’s brilliant or a crime. Possibly both.'),
            l('island-chef', 'If anyone asks, it’s research. Gravity research. Gravy-ty. …I’ve been waiting all week to say that.', 'happy'),
            n('Your Nubbin mimes squeezing a tube, then looks at its empty paws, disappointed.'),
            l('island-chef', 'One tube. If it’s a crime, it’s a small one.'),
          ],
          choices: [
            {
              id: 'nq20-crime',
              label: 'Say it’s probably a crime.',
              then: [l('island-chef', 'Then we’ll be criminals together. Bring two.', 'happy')],
            },
            {
              id: 'nq20-trust',
              label: 'Say the Grundos know what they’re doing.',
              then: [l('island-chef', 'They live in space and they’re still cheerful. I trust them with gravy.')],
            },
          ],
        },
        done: {
          id: 'nq20-ask-done',
          lines: [
            n('The tube is silver and cold. The label says Gravy, Brown, Excellent.'),
            l('island-chef', 'Confident labelling. That’s a good sign.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq20-complete',
      lines: [
        n('The chef mashes island yams, makes a well in the middle, and squeezes the whole tube in. It comes out in a perfect spiral.'),
        l('island-chef', 'Moon gravy mash. Verdict…', 'think'),
        l('island-chef', 'Brilliant. Also a crime. I’m putting it on the menu.', 'happy'),
        n('Your Nubbin licks the spoon, the bowl, and then, thoughtfully, the tube.'),
      ],
    },
    rewards: [
      { id: 'nq20-page', kind: 'item', label: 'Cookbook Page: Moon Gravy Mash', description: 'A Grove kitchen recipe: yam mash with space gravy. Very filling, with a lean towards Stamina.' },
    ],
    sets: { 'nq-20-done': true },
    notes: 'Kitchen Quest 4 of 5. The Space Station is open before NP13; nothing here touches the Sloth plot.',
  },

  // ================================================================== NQ21 Kitchen 5
  {
    id: 'nq21',
    code: 'NQ21',
    title: 'Kitchen Quest: The Jelly Question',
    source: 'Neopets: Kitchen Quests (Mystery Island)',
    audience: 'all',
    trigger: { where: 'Mystery Island, the Kitchen', when: 'After NQ20.' },
    requires: ['NQ20'],
    speakers: [CHEF],
    steps: [
      {
        id: 'nq21-step1',
        goal: 'Bring the Island Chef a jelly. Any colour, but green would be the dream.',
        hint: 'The Food Shop in Neopia Central sells common jellies. Green ones are rare; some say they come from Jelly World.',
        check: 'give:item:jelly:island-chef',
        scene: {
          id: 'nq21-ask',
          lines: [
            l('island-chef', 'Last recipe. The big one. Trifle.', 'happy'),
            l('island-chef', 'Layer one, cake. Layer two, fruit. Layer three, jelly. Layer four, I’ll tell you when you’re older.'),
            l('island-chef', 'Green jelly comes from Jelly World. Jelly World doesn’t exist. You can see my problem.', 'sad'),
            l('island-chef', 'Any jelly will do. But a green jelly…', 'soft'),
            l('island-chef', 'A green jelly would make me weep. In a good way.'),
            n('Your Nubbin, who has heard the word jelly, is now vibrating gently.'),
          ],
          choices: [
            {
              id: 'nq21-green',
              label: 'Promise to try for a green one.',
              then: [l('island-chef', 'Don’t promise. Promises about jelly are too much pressure.', 'think')],
            },
            {
              id: 'nq21-any',
              label: 'Say you’ll bring whatever you find.',
              then: [l('island-chef', 'The honest answer. Good. Every jelly is a good jelly.', 'happy')],
            },
          ],
        },
        done: {
          id: 'nq21-ask-done',
          lines: [
            n('You set the jelly down. It wobbles, takes a while to stop, and sits there gleaming.'),
            n('Your Nubbin has to be held back by the tail. It has waited five recipes for this.'),
            l('island-chef', 'Look at it go. Right. Stand back. This is the good bit.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq21-complete',
      lines: [
        n('Cake. Fruit. Jelly. Then a fourth layer, golden and secret, poured from a jug the chef shields with one arm.'),
        l('island-chef', 'Five recipes. You fetched every one. Nobody’s ever done the whole set.', 'soft'),
        n('Your Nubbins sit in a row with spoons. Nobody told them to. They just knew.'),
        l('island-chef', 'Take the last page. And come and cook with me sometime. You’ve earned the good apron.', 'happy'),
        l('island-chef', 'Oh, and my name, as promised. It’s Chef. My parents had very high hopes.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq21-page', kind: 'item', label: 'Cookbook Page: Island Trifle', description: 'A Grove kitchen recipe: a four-layer trifle that feeds every Nubbin nearby at once.' },
    ],
    sets: { 'nq-21-done': true },
    notes:
      'Kitchen Quest 5 of 5, the last. Any jelly item passes the check. If the jelly is green, swap the chef’s done line for: "Green. It’s green. Give me a moment." (mood soft) and set `nq-21-green: true`. ' +
      'The fourth layer stays secret; do not name it anywhere in the UI.',
  },

  // ================================================================== NQ22 Edna 1
  {
    id: 'nq22',
    code: 'NQ22',
    title: 'Edna’s Quest: Wart Wanted',
    source: 'Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)',
    audience: 'main',
    trigger: { where: 'Haunted Woods, Edna’s Tower', when: 'After your first visit to the Haunted Woods.' },
    speakers: [EDNA],
    steps: [
      {
        id: 'nq22-step1',
        goal: 'Bring Edna a Mortog wart from the pond at Kiss the Mortog, in Meridell.',
        hint: 'The Mortogs by the Meridell pond shed their warts in the reeds. Look, don’t kiss. Or kiss. Your call.',
        check: 'give:item:mortog-wart:edna',
        scene: {
          id: 'nq22-ask',
          lines: [
            n('Edna’s Tower leans like it’s had a long night. Inside, a cauldron burps green steam at the ceiling.'),
            l('edna', 'A customer. Or an ingredient. Which are you?', 'think'),
            n('Shelves line the walls: EYES (GLASS), EYES (NOT GLASS), and one jar labelled simply MONDAYS.'),
            l('edna', 'Customer, then. Pity. I need a Mortog wart. Fresh. Still a bit warm, ideally.'),
            l('edna', 'There’s a pond in Meridell where idiots kiss Mortogs hoping for royalty. The warts come off in the excitement.'),
            n('Your Nubbin edges behind your leg, as far from the cauldron as the room allows.'),
          ],
          choices: [
            {
              id: 'nq22-kiss',
              label: 'Ask whether kissing one actually works.',
              then: [l('edna', 'Once, in my lifetime. He was a terrible prince. Went straight back to the pond.', 'happy')],
            },
            {
              id: 'nq22-gross',
              label: 'Ask her to confirm she said “still warm”.',
              then: [l('edna', 'I did. Write it down if your memory’s going. I’ve a potion for that too, later.')],
            },
          ],
        },
        done: {
          id: 'nq22-ask-done',
          lines: [
            n('You drop the wart into her palm. She sniffs it like a wine expert.'),
            l('edna', 'Pond-fresh. Faint whiff of disappointment. Lovely.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq22-complete',
      lines: [
        n('The wart goes in. The cauldron goes bright yellow and makes a noise like a rooster with a cold.'),
        l('edna', 'Potion of Wide Awake. One sip and a sleeping pet sits bolt upright, ready for anything.'),
        l('edna', 'Don’t drink it yourself. You’d be awake till Thursday. Every Thursday.'),
        n('She corks it with her teeth and hands it over.'),
      ],
    },
    rewards: [
      { id: 'nq22-potion', kind: 'item', label: 'Potion of Wide Awake', description: 'Single use. Wakes a sleeping pet at once, fully rested, without any grumpiness.' },
    ],
    sets: { 'nq-22-done': true },
    notes: 'Edna’s Quest 1 of 5. Audience main: kept out of the Learning Grove with the rest of the darker Haunted Woods content. Crude-ish humour is fine; keep it dry, not gross-out.',
  },

  // ================================================================== NQ23 Edna 2
  {
    id: 'nq23',
    code: 'NQ23',
    title: 'Edna’s Quest: Something Dry',
    source: 'Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)',
    audience: 'main',
    trigger: { where: 'Haunted Woods, Edna’s Tower', when: 'After NQ22.' },
    requires: ['NQ22'],
    speakers: [EDNA],
    steps: [
      {
        id: 'nq23-step1',
        goal: 'Bring Edna a strip of old linen bandage from the Deserted Tomb in the Lost Desert.',
        hint: 'Run the Deserted Tomb once; the bandage is on the first sarcophagus. Mind the traps.',
        check: 'give:item:tomb-bandage:edna',
        scene: {
          id: 'nq23-ask',
          lines: [
            l('edna', 'Next. I need the driest thing in Neopia.'),
            l('edna', 'Not sand. Sand is showing off. Bandage. From a tomb in the Lost Desert. Three thousand years in the dark.', 'think'),
            l('edna', 'Whoever was wearing it won’t mind. They stopped minding things a long time ago.'),
            l('edna', 'Keep it dry. If it gets wet it’s just a bandage, and I can get those from the chemist.'),
            n('She blows dust off a jar labelled DRY THINGS. It is empty except for one very old raisin.'),
            n('Your Nubbin looks at you as if to ask whether this is what you do all day now.'),
          ],
          choices: [
            {
              id: 'nq23-who',
              label: 'Ask who was wearing it.',
              then: [l('edna', 'Some minor king. Ruled for a fortnight. Choked on a date. Desert politics.', 'think')],
            },
            {
              id: 'nq23-curse',
              label: 'Ask whether it’s cursed.',
              set: { 'nq-23-asked-curse': true },
              then: [l('edna', 'Probably. Everything in a tomb is. That’s just how they say hello.', 'happy')],
            },
          ],
        },
        done: {
          id: 'nq23-ask-done',
          lines: [
            n('The bandage crackles like an old letter. A little cloud of dust puffs out when she unrolls it.'),
            l('edna', 'Oh, that’s dry. That’s philosophically dry.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq23-complete',
      lines: [
        n('She crumbles the bandage into the cauldron. The steam turns pale gold and smells, oddly, of warm toast.'),
        l('edna', 'Bandage Balm. Rub it on a pet that’s bruised or chilled, and it’s right as rain.'),
        l('edna', 'Ironic, given the ingredient. I do like irony. It’s cheaper than salt.'),
        n('The jar is warm in your hand, and stays warm.'),
      ],
    },
    rewards: [
      { id: 'nq23-potion', kind: 'item', label: 'Bandage Balm', description: 'Single use. Cures a pet that is bruised from karate or chilled by the Snowager, instantly.' },
    ],
    sets: { 'nq-23-done': true },
    notes: 'Edna’s Quest 2 of 5. The Deserted Tomb is a once-per-visit freebie; the bandage is guaranteed on the first run after this quest starts.',
  },

  // ================================================================== NQ24 Edna 3
  {
    id: 'nq24',
    code: 'NQ24',
    title: 'Edna’s Quest: Pepper for the Cauldron',
    source: 'Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)',
    audience: 'main',
    trigger: { where: 'Haunted Woods, Edna’s Tower', when: 'After NQ23.' },
    requires: ['NQ23'],
    speakers: [EDNA],
    steps: [
      {
        id: 'nq24-step1',
        goal: 'Bring Edna a bottle of pirate pepper sauce from the Golden Dubloon on Krawk Island.',
        hint: 'The Golden Dubloon is the pirate restaurant on Krawk Island. Ask the kitchen for the house pepper sauce.',
        check: 'give:item:dubloon-pepper-sauce:edna',
        scene: {
          id: 'nq24-ask',
          lines: [
            l('edna', 'This one needs nerve. Bottled nerve. The pirates on Krawk Island call it pepper sauce.'),
            l('edna', 'It’s mostly peppers, partly sea salt, and a little bit of whatever fell in.', 'think'),
            l('edna', 'If a pirate asks what it’s for, say it’s for a lady’s cough. They’ll understand. They all have the cough.', 'think'),
            l('edna', 'Get the house bottle from the Golden Dubloon. Not the cheap one. The cheap one’s the same, but sadder.'),
            n('She hands you an empty bottle to fill. It still smells of the last lot.'),
            n('Your Nubbin sniffs the bottle and sneezes so hard it sits down.'),
          ],
          choices: [
            {
              id: 'nq24-taste',
              label: 'Ask whether you’re allowed a taste on the way back.',
              set: { 'nq-24-tasted': true },
              then: [l('edna', 'One drop. Then you’ll understand why it’s only one.', 'happy')],
            },
            {
              id: 'nq24-nerve',
              label: 'Ask what the nerve is for.',
              then: [l('edna', 'For pets who flinch. A fighter who flinches is a fighter who loses. And cries. I hate the crying.')],
            },
          ],
        },
        done: {
          id: 'nq24-ask-done',
          lines: [
            n('Edna pulls the cork, tries one drop, and stares into the middle distance while her ears go red.'),
            l('edna', 'Yes. That’s the stuff. I can hear the sea. I’m nowhere near the sea.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq24-complete',
      lines: [
        n('Most of the bottle goes into the cauldron, and one spoonful into Edna, for her cough. Both of them start to glow.'),
        l('edna', 'Potion of Steady Nerve. One dose before a bout, and your pet won’t flinch at anything.'),
        l('edna', 'Not even me singing, and I’m about to sing.', 'happy'),
        n('She sings. It is a sea shanty she seems to be making up as she goes. You leave during the fourth verse.'),
      ],
    },
    rewards: [
      { id: 'nq24-potion', kind: 'item', label: 'Potion of Steady Nerve', description: 'Single use. Before one karate bout, a nervous or timid pet fights at full confidence.' },
    ],
    sets: { 'nq-24-done': true },
    notes:
      'Edna’s Quest 3 of 5. Audience main (Haunted Woods, kept out of the Learning Grove). The grog was swapped for pirate pepper sauce, so nothing here is boozy; the potion is just a karate buff. ' +
      'If `nq-24-tasted`, the Keeper portrait goes red and fans its mouth once on the walk back (cosmetic only, a few seconds). Edna’s song is hummed/garbled audio, no lyrics.',
  },

  // ================================================================== NQ25 Edna 4
  {
    id: 'nq25',
    code: 'NQ25',
    title: 'Edna’s Quest: Ink From the Wise',
    source: 'Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)',
    audience: 'main',
    trigger: { where: 'Haunted Woods, Edna’s Tower', when: 'After NQ24.' },
    requires: ['NQ24'],
    speakers: [EDNA],
    steps: [
      {
        id: 'nq25-step1',
        goal: 'Bring Edna a pot of ink from the Wise Old King’s inkwell in Brightvale.',
        hint: 'The Wise Old King sits in Brightvale castle. Make him laugh or nod at his phrase game and he’ll part with a pot.',
        check: 'give:item:wise-kings-ink:edna',
        scene: {
          id: 'nq25-ask',
          lines: [
            l('edna', 'I want ink that’s written down something clever. There’s only one inkwell in Neopia that qualifies.'),
            l('edna', 'The Wise Old King in Brightvale. Ancient, vain, and slow. Flatter him and he’ll give you a pot.', 'think'),
            l('edna', 'Don’t tell him it’s for me. We had a disagreement in about the year I was pretty.'),
            n('Edna’s own inkwell is bone dry. A quill stands in it like a flag on a lost battlefield.'),
            n('Your Nubbin looks at Edna, tries to imagine that year, and gives up.'),
            l('edna', 'I saw that, small thing. I was a looker. Ask anyone over three hundred.', 'angry'),
          ],
          choices: [
            {
              id: 'nq25-what',
              label: 'Ask what the disagreement was.',
              then: [l('edna', 'He said a witch couldn’t read. I turned his crown into a hat stand. Things escalated.', 'angry')],
            },
            {
              id: 'nq25-flatter',
              label: 'Ask how best to flatter him.',
              then: [l('edna', 'Agree with him slowly, as if you’ve just understood something deep. Works on most men.', 'happy')],
            },
          ],
        },
        done: {
          id: 'nq25-ask-done',
          lines: [
            n('The ink is so dark it seems to have a bottom far below the bottom of the pot.'),
            l('edna', 'Did he ask who it was for? He did. And you lied. Good Keeper.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq25-complete',
      lines: [
        n('One drop of ink turns the whole cauldron black. Then words float up through it, too fast to read.'),
        l('edna', 'Draught of Good Sense. A pet who drinks it learns its next lesson twice over.'),
        l('edna', 'It won’t make them wise. Nothing makes anyone wise. Ask the king.', 'think'),
        n('She pours it into a tiny bottle shaped like an owl. The owl looks smug.'),
      ],
    },
    rewards: [
      { id: 'nq25-potion', kind: 'item', label: 'Draught of Good Sense', description: 'Single use. The next training session, book or lesson a pet takes gives double the stat points.' },
    ],
    sets: { 'nq-25-done': true },
    notes: 'Edna’s Quest 4 of 5. Getting the ink uses the Wise Old King phrase-builder minigame once (any result that makes him nod counts).',
  },

  // ================================================================== NQ26 Edna 5
  {
    id: 'nq26',
    code: 'NQ26',
    title: 'Edna’s Quest: Edna’s Own Brew',
    source: 'Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)',
    audience: 'main',
    trigger: { where: 'Haunted Woods, Edna’s Tower', when: 'After NQ25.' },
    requires: ['NQ25'],
    speakers: [EDNA],
    steps: [
      {
        id: 'nq26-step1',
        goal: 'Bring Edna a cobweb from the great hall of Eliv Thade’s castle.',
        hint: 'Eliv Thade’s castle is deep in the Haunted Woods. The cobweb hangs from the chandelier; a Fly Nubbin can reach it.',
        check: 'give:item:thade-cobweb:edna',
        scene: {
          id: 'nq26-ask',
          lines: [
            l('edna', 'Last one. My own brew. My mother’s recipe, and her mother’s, and so on back to a frog.'),
            l('edna', 'It needs one cobweb from Eliv Thade’s castle. He never dusts. He’s too busy being clever at people.', 'think'),
            l('edna', 'If he sets you a riddle, the answer is usually “a candle”. He’s very fond of candles.'),
            n('Five ingredients are chalked on the cauldron: WART, BANDAGE, PEPPER, INK. The fifth is a drawing of a spider, scowling.'),
            n('Your Nubbin, unasked, has begun practising looking brave in the reflection of the cauldron.'),
            l('edna', 'Bring it back in one piece. The web, I mean. You too, ideally.', 'happy'),
          ],
        },
        done: {
          id: 'nq26-ask-done',
          lines: [
            n('The cobweb is huge, silver and perfectly intact. You carried it like a wedding veil the whole way.'),
            l('edna', 'Not a strand broken. Even Thade would be impressed, and he’s impressed by nothing.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq26-complete',
      lines: [
        n('Wart, bandage, pepper sauce, ink and web all go in, in that order. The cauldron goes still and silent.'),
        l('edna', 'Edna’s Own. One spoonful paints a pet in the Haunted Woods’ favourite colours.'),
        l('edna', 'Ghost, Zombie or Halloween. Choose when you pour, not before. It likes a surprise.'),
        l('edna', 'And now, a taste for the Keeper who fetched it all. Tradition.', 'happy'),
      ],
      choices: [
        {
          id: 'nq26-sip',
          label: 'Take a polite sip.',
          set: { 'nq-26-sipped': true },
          then: [n('Your hair turns green for exactly as long as it takes Edna to stop laughing.'), l('edna', 'Tradition!', 'happy')],
        },
        {
          id: 'nq26-decline',
          label: 'Decline, very politely.',
          then: [l('edna', 'Clever. There’s no tradition. I just wanted to see your hair go green.', 'happy')],
        },
      ],
    },
    rewards: [
      {
        id: 'nq26-potion',
        kind: 'item',
        label: 'Edna’s Own Brew',
        description: 'Single use. Paints one Neo pet (or a Nubbin’s egg colour) Ghost, Zombie or Halloween, chosen when you use it. Permanent, carried through rebirth.',
      },
    ],
    sets: { 'nq-26-done': true },
    notes:
      'Edna’s Quest 5 of 5, the last. Eliv Thade appears only as a riddle prompt at the castle door (reuse the castle’s riddle UI if it exists; otherwise skip the riddle). ' +
      'If `nq-26-sipped`, the Keeper’s portrait has green hair for the rest of the scene.',
  },

  // ================================================================== NQ27 Brain Tree
  {
    id: 'nq27',
    code: 'NQ27',
    title: 'The Brain Tree’s Two Memories',
    source: 'Neopets: the Brain Tree (Haunted Woods)',
    audience: 'all',
    trigger: { where: 'Haunted Woods, the Brain Tree’s clearing', when: 'After your first visit to the Haunted Woods. Once.' },
    speakers: [
      { id: 'brain-tree', name: 'The Brain Tree', kind: 'other', basedOn: 'The Brain Tree (Neopets)' },
      { id: 'wise-old-king', name: 'The Wise Old King', kind: 'other', basedOn: 'The Wise Old King (Neopets, Brightvale)' },
      FYORA,
    ],
    steps: [
      {
        id: 'nq27-step1',
        goal: 'Ask the Wise Old King in Brightvale what year the Brain Tree first took root.',
        hint: 'The Wise Old King holds court in Brightvale castle. He likes visitors who wait for him to finish.',
        check: 'talk:wise-old-king:brain-tree',
        scene: {
          id: 'nq27-ask',
          lines: [
            n('The Brain Tree is enormous and grey, with bark folded like the inside of a walnut. Its branches creak as you approach.'),
            n('Its roots are scratched with sums. Someone has corrected one in pencil. The tree has corrected it back.'),
            l('brain-tree', 'A visitor. Good. I need help, and I am too large to fetch it.'),
            l('brain-tree', 'I have known everything for a very long time. Two things I have forgotten. It is unbearable.', 'sad'),
            l('brain-tree', 'First: the year I took root. The Wise Old King was a boy when it happened. He may remember.'),
            n('Your Nubbin sits on a root, and the root sighs, like someone getting comfortable in an armchair.'),
          ],
          choices: [
            {
              id: 'nq27-guess',
              label: 'Ask whether he could just guess.',
              then: [l('brain-tree', 'A tree that guesses is just a bush with opinions.', 'angry')],
            },
            {
              id: 'nq27-sorry',
              label: 'Say you’re sorry he forgot.',
              set: { 'nq-27-kind': true },
              then: [l('brain-tree', 'Thank you. Nobody ever asks a tree how it feels.', 'soft')],
            },
          ],
        },
        done: {
          id: 'nq27-ask-done',
          lines: [
            l('wise-old-king', 'The Brain Tree? Planted in the year of the long winter. I was seven. I sat on it. It complained.', 'think'),
            l('wise-old-king', 'Tell it the long winter. It will know the rest.'),
          ],
        },
      },
      {
        id: 'nq27-step2',
        goal: 'Ask Queen Fyora whose initials are carved into the Brain Tree’s bark.',
        hint: 'Queen Fyora receives visitors in her castle in Faerieland.',
        check: 'talk:fyora:brain-tree',
        scene: {
          id: 'nq27-carving',
          lines: [
            l('brain-tree', 'The long winter. Yes. It comes back, like a smell. Thank you.', 'happy'),
            l('brain-tree', 'Second. Someone carved two letters into my bark, long ago. A J and an I, inside a little star.'),
            l('brain-tree', 'I cannot remember who. The queen of the faeries knows everyone who was young back then.', 'think'),
            l('brain-tree', 'I know the population of Brightvale to the last Kacheek. I do not know who carved me. It is humiliating.', 'sad'),
            n('You find the carving low on the trunk, half-healed: J + I, inside a lopsided star.'),
            n('Your Nubbin traces the star with one claw. The bark shivers, as if it tickles.'),
          ],
        },
        done: {
          id: 'nq27-carving-done',
          lines: [
            l('fyora', 'J and I. Oh, those two. Jhudora and Illusen, when they were small and inseparable.', 'soft'),
            l('fyora', 'They used to argue under that tree about whose turn it was to win. Tell it gently. They’ve forgotten too.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq27-complete',
      lines: [
        n('You tell the Brain Tree both memories. Its branches go still, the way a person goes still when a song they knew comes on.'),
        l('brain-tree', 'The long winter. Two small faeries and a knife they weren’t allowed. Yes. All of it.', 'soft'),
        l('brain-tree', 'I am whole again. Take this. Plant it somewhere you do your thinking.'),
        n('An acorn drops into your hand. It is grey, folded like a walnut, and very slightly warm.'),
      ],
    },
    rewards: [
      { id: 'nq27-acorn', kind: 'decor', label: 'Brain Tree Acorn', description: 'Plants a small Brain Tree in your sandbox. A pet that reads beneath it gains Intelligence a little faster.' },
      { id: 'nq27-title', kind: 'title', label: 'The Tree’s Rememberer', description: 'Title for restoring the Brain Tree’s memories.' },
    ],
    sets: { 'nq-27-done': true },
    notes:
      'Audience all, so the Brain Tree is grumpy and sad, never frightening (no talk of death; the classic version asked about deaths, this one does not). ' +
      'The J + I carving links to the Illusen/Jhudora rivalry; it works whichever side the player took, or neither. ' +
      'Queen Fyora can be visited before or after the faerie chains.',
  },

  // ================================================================== NQ28 Esophagor
  {
    id: 'nq28',
    code: 'NQ28',
    title: 'The Esophagor’s Last Supper',
    source: 'Neopets: the Esophagor (Haunted Woods)',
    audience: 'main',
    trigger: { where: 'Haunted Woods, the Esophagor’s cave', when: 'After your first visit to the Haunted Woods. Once.' },
    speakers: [
      { id: 'esophagor', name: 'The Esophagor', kind: 'other', basedOn: 'The Esophagor (Neopets)' },
      { id: 'neovia-baker', name: 'The Neovian Baker', kind: 'other' },
    ],
    steps: [
      {
        id: 'nq28-step1',
        goal: 'Find out from the baker in Neovia how the Esophagor’s favourite pie was made.',
        hint: 'The bakery is on Neovia’s main square. The baker is old enough to remember the Esophagor’s family.',
        check: 'talk:neovia-baker:esophagor',
        scene: {
          id: 'nq28-ask',
          lines: [
            n('The cave mouth is wide and wet, and breathes out a smell of onions and regret.'),
            l('esophagor', 'FOOD. Is that food? It smells like a Keeper. Never mind. What have you got?', 'angry'),
            l('esophagor', 'I ate everything in these woods. Boots. A bench. A small shed. None of it tasted of anything.'),
            n('A bench leg sticks out of the cave wall like a toothpick. Someone has scratched above it: WAS A BENCH.'),
            l('esophagor', 'Before I was… this… my mum made a pie. Mushroom. With a burnt edge. I want that. Just once.', 'sad'),
            n('Your Nubbin is hiding entirely inside your coat.'),
          ],
          choices: [
            {
              id: 'nq28-shed',
              label: 'Ask how the shed was.',
              then: [l('esophagor', 'Splintery. Faint hint of rake. Would not recommend.', 'think')],
            },
            {
              id: 'nq28-mum',
              label: 'Ask about his mum.',
              set: { 'nq-28-asked-mum': true },
              then: [l('esophagor', 'She burned everything. Every single thing. I loved her very much.', 'soft')],
            },
          ],
        },
        done: {
          id: 'nq28-ask-done',
          lines: [
            l('neovia-baker', 'His mum? Mushrooms, black pepper, far too much butter, and she always forgot it in the oven.', 'think'),
            l('neovia-baker', 'The burnt edge was the recipe. Everyone thought it was a mistake. It was a mistake. But it was the recipe.'),
          ],
        },
      },
      {
        id: 'nq28-step2',
        goal: 'Bake the mushroom pie and feed it to the Esophagor.',
        hint: 'Bake it in your Grove kitchen with mushrooms, pepper and butter, then carry it back to the cave.',
        check: 'give:food:mushroom-pie:esophagor',
        scene: {
          id: 'nq28-bake',
          lines: [
            n('Back in your kitchen: mushrooms, black pepper, far too much butter. The baker was very firm about the butter.'),
            n('The baker’s recipe card has one line underlined three times: FORGET IT IN THE OVEN.'),
            n('The pie goes in. The smell fills the cottage. Your Nubbins gather at the oven door.'),
            n('One of them drools on the floor, then quietly lies down in it.'),
            n('The edge starts to darken. Golden. Brown. Browner.'),
            n('You have about four seconds to decide.', 'shock'),
          ],
          choices: [
            {
              id: 'nq28-burn',
              label: 'Leave it in. Burn the edge.',
              set: { 'nq-28-pie': 'burnt' },
              then: [n('The edge goes black and crackly. The kitchen smells like somebody’s childhood.')],
            },
            {
              id: 'nq28-perfect',
              label: 'Take it out golden. Perfect.',
              set: { 'nq-28-pie': 'golden' },
              then: [n('It is a beautiful pie. It is not his mum’s pie.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'nq28-complete',
      lines: [
        n('You hold the pie out at arm’s length. The Esophagor takes it in one bite, dish and all.'),
        l('esophagor', '…', 'think'),
        l('esophagor', 'That’s it. That’s the one. That’s her.', 'soft'),
        n('For a long moment the cave is quiet. Then it burps, enormously, and a ladle flies out and lands at your feet.'),
        l('esophagor', 'Keep that. I ate it in about the year of the long winter. Never needed it. Thank you, Keeper.', 'happy'),
      ],
    },
    rewards: [
      { id: 'nq28-ladle', kind: 'decor', label: 'The Esophagor’s Ladle', description: 'A huge, slightly dented ladle for your cottage kitchen wall. Food cooked under it smells a little better.' },
      { id: 'nq28-recipe', kind: 'item', label: 'Cookbook Page: His Mum’s Mushroom Pie', description: 'A Grove kitchen recipe: mushroom pie, burnt edge optional. Very filling.' },
    ],
    sets: { 'nq-28-done': true },
    notes:
      'Audience main (darker Haunted Woods). The pie must be baked with the burnt choice for the complete scene above; if `nq-28-pie` = golden, ' +
      'play instead: Esophagor "Nice. Very nice. Not hers." (sad), then the step stays open so the player can bake again (no cost beyond ingredients). ' +
      'The oven choice is a 4-second prompt in spirit only: no real timer, the choice waits for the player.',
  },

  // ================================================================== NQ29 Turmaculus
  {
    id: 'nq29',
    code: 'NQ29',
    title: 'Waking the Turmaculus',
    source: 'Neopets: the Turmaculus (Meridell)',
    audience: 'all',
    trigger: { where: 'Meridell, the Turmaculus’s hollow beyond Meri Acres Farm', when: 'After your first visit to Meridell. Once.' },
    speakers: [{ id: 'meri-farmer', name: 'The Meridell Farmer', kind: 'other' }],
    steps: [
      {
        id: 'nq29-step1',
        goal: 'Bring the petpet that can wake the Turmaculus.',
        hint: 'He sleeps through noise. Think about what wakes a sleeper who ignores noise. Petpets are sold in Neopia Central.',
        check: 'wake:turmaculus:warf',
        scene: {
          id: 'nq29-ask',
          lines: [
            n('In the hollow lies a petpet the size of a barn, snoring. Each snore moves the hedges.'),
            n('A sign on the fence says DO NOT WAKE. Underneath, older and smaller: WE HAVE TRIED.'),
            l('meri-farmer', 'That’s the Turmaculus. Been asleep since my grandad’s time. He’s guarding something, they say.'),
            l('meri-farmer', 'Thunder doesn’t wake him. Drums don’t. Kass’s army marched past once. Nothing.', 'think'),
            l('meri-farmer', 'What wakes a big soft thing that won’t wake for noise? That’s the question.'),
            n('Your Nubbin creeps up and pats the Turmaculus’s nose. He snores harder, delighted.'),
          ],
          choices: [
            {
              id: 'nq29-babaa',
              label: 'Suggest a Babaa. Soft and woolly. It might be soothing.',
              set: { 'nq-29-guess': 'babaa' },
              then: [l('meri-farmer', 'Soothing? He’s asleep. You’ll send him deeper.', 'happy')],
            },
            {
              id: 'nq29-mortog',
              label: 'Suggest a Mortog. Loud croak.',
              set: { 'nq-29-guess': 'mortog' },
              then: [l('meri-farmer', 'Loud doesn’t work. I just told you. Weren’t you listening?', 'angry')],
            },
            {
              id: 'nq29-warf',
              label: 'Suggest a Warf. Nothing ignores a dog licking its face.',
              set: { 'nq-29-guess': 'warf' },
              then: [l('meri-farmer', 'A lick. Huh. Nobody’s ever tried that.', 'think')],
            },
          ],
        },
        done: {
          id: 'nq29-ask-done',
          lines: [
            n('The Warf trots up and gives the enormous nose one long, thorough lick.'),
            n('One eye opens. Then the other. The Turmaculus sits up, yawns, and looks at the Warf with deep offence.'),
            l('meri-farmer', 'A hundred years asleep, and the first thing he does is take offence. He’s a proper Meridellian.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq29-complete',
      lines: [
        n('The Turmaculus stretches. Under where he lay is a small wooden box, flattened slightly by a century of nap.'),
        l('meri-farmer', 'So that’s what he was guarding. Go on. It’s yours. You woke him.', 'shock'),
        n('Inside is a paint brush with bristles that shimmer like a dragonfly’s wing.'),
        n('The Turmaculus watches you take it, sniffs the Warf once more, and goes back to sleep, satisfied.'),
      ],
    },
    rewards: [
      { id: 'nq29-brush', kind: 'item', label: 'Faerie Petpet Paint Brush', description: 'A rare single-use petpet paint brush. Paints one petpet Faerie, permanently.' },
    ],
    sets: { 'nq-29-done': true },
    notes:
      'Once only, as the brief asks. The right petpet is a Warf; bringing a Babaa or Mortog plays a short wrong-guess beat (Babaa: he snores happier; Mortog: he snores louder) and the step stays open. ' +
      'The farmer’s choices are hints, not commitments: `nq-29-guess` only changes his first line if the player returns with the wrong petpet. ' +
      'The petpet is not used up. Art: barn-sized sleeping Turmaculus with hedges swaying on each snore.',
  },

  // ================================================================== NQ30 Lab Ray
  {
    id: 'nq30',
    code: 'NQ30',
    title: 'The Secret Laboratory Map',
    source: 'Neopets: the Secret Laboratory Map and the Lab Ray',
    audience: 'all',
    trigger: { where: 'Neopia Central, the Trading Post noticeboard', when: 'After you have visited four lands of Neopia. Once.' },
    speakers: [{ id: 'lab-scientist', name: 'The Scientist', kind: 'other', basedOn: 'The Lab Ray Scientist (Neopets)' }],
    steps: [
      {
        id: 'nq30-step1',
        goal: 'Find the first two pieces of the Secret Laboratory Map, in the Lost Desert and on Krawk Island.',
        hint: 'One piece is in the Deserted Tomb; one is buried on Krawk Island’s Forgotten Shore.',
        check: 'find:item:lab-map-piece:2',
        scene: {
          id: 'nq30-notice',
          lines: [
            n('Pinned to the noticeboard is a torn quarter of a map. The rest of the notice has been ripped away.'),
            n('Written on the back, in a tidy hand: Four pieces. Four lands. Bring them together and follow the line.'),
            n('The quarter shows a coastline, a dotted line, and a drawing of a ray gun with a smiley face.'),
            n('Along the very edge, in tiny letters: If found, please return to the nearest island that isn’t there.'),
            n('Your Nubbin taps the smiley face, then looks at you, worried.'),
            n('A passing Grundo glances at the map, goes pale, and walks off much faster than before.'),
          ],
          choices: [
            {
              id: 'nq30-keen',
              label: 'Pocket it. You love a treasure map.',
              set: { 'nq-30-keen': true },
              then: [n('You pocket it. Something about the smiley face is far too cheerful.')],
            },
            {
              id: 'nq30-wary',
              label: 'Pocket it, but carefully, like it might bite.',
              then: [n('You fold it with two fingers. It doesn’t bite. It does feel slightly warm.')],
            },
          ],
        },
        done: {
          id: 'nq30-step1-done',
          lines: [
            n('Two pieces fit together with a faint click. The dotted line runs off the torn edge.'),
            n('On the back of the second piece, the same tidy hand: Bring snacks. The ray gets peckish.'),
          ],
        },
      },
      {
        id: 'nq30-step2',
        goal: 'Find the last two pieces, in Terror Mountain’s Ice Caves and the ruins of Geraptiku.',
        hint: 'One piece is frozen into a wall in the Ice Caves (not the Snowager’s cave); one is under a statue in Geraptiku.',
        check: 'find:item:lab-map-piece:4',
        scene: {
          id: 'nq30-pieces',
          lines: [
            n('The map is half whole. A label has appeared along the dotted line: TO THE LAB.'),
            n('Underneath, smaller, in the same tidy hand: Please. It’s very quiet out here.'),
            n('Your Nubbin sniffs the frosty corner and sneezes. It sniffs the mossy corner and sneezes in a completely different key.'),
            n('Your Nubbin traces the line with one claw, all the way to a blank island where the paper is torn.'),
            n('Two corners are still missing. One has frost on its edge. The other has a smudge of jungle moss.'),
            n('Somewhere cold, and somewhere green.'),
          ],
        },
        done: {
          id: 'nq30-step2-done',
          lines: [
            n('Four pieces. When the last one touches the others, the tears seal by themselves with a faint hiss.'),
            n('The map now shows a small island off Mystery Island that was certainly not there before.'),
          ],
        },
      },
      {
        id: 'nq30-step3',
        goal: 'Follow the map to the Secret Laboratory.',
        hint: 'Take the Mystery Island boat and tell the ferryman to follow the map. He won’t like it.',
        check: 'visit:neopia:secret-laboratory',
        scene: {
          id: 'nq30-lab',
          lines: [
            n('The island is a rock, a tin hut, and a satellite dish that turns to follow you as you land.'),
            l('lab-scientist', 'Visitors! Real ones! Come in, come in, mind the cables, mind the other cables.', 'happy'),
            l('lab-scientist', 'This is the Lab Ray. It changes things. Colour, shape, sometimes nothing. Never the same twice.'),
            l('lab-scientist', 'Results so far: one blue Kacheek, one Kacheek-shaped Kau, and a Kau that is now very slightly taller.', 'happy'),
            l('lab-scientist', 'Before you ask: I don’t work for anybody. Especially not anybody green. Never met him.', 'shock'),
            n('Your Nubbin hides behind a filing cabinet. The cabinet is labelled DEFINITELY NOT SLOTH STUFF.'),
          ],
          choices: [
            {
              id: 'nq30-zap',
              label: 'Ask what “sometimes nothing” means.',
              then: [l('lab-scientist', 'It means sometimes nothing! Science is mostly nothing. That’s what makes the something exciting.', 'happy')],
            },
            {
              id: 'nq30-cabinet',
              label: 'Ask about the filing cabinet.',
              set: { 'nq-30-cabinet': true },
              then: [l('lab-scientist', 'Old tax records. Very boring. Please stop looking at it.', 'shock')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'nq30-complete',
      lines: [
        l('lab-scientist', 'Here’s the rule. Each Neo pet gets one zap, ever. Choose wisely, or recklessly. Both are fun.'),
        n('He pats the ray like a favourite dog. It sparks. He pretends it didn’t.'),
        l('lab-scientist', 'Come back whenever you like. The map knows the way now.'),
        n('The satellite dish waves goodbye. You’re fairly sure that’s not something dishes do.'),
      ],
    },
    rewards: [
      {
        id: 'nq30-lab-ray',
        kind: 'feature',
        label: 'The Lab Ray',
        description: 'Each Neo pet may be zapped once in its life: a random new colour (Mutant possible), a new species, a stat change, or nothing at all.',
      },
    ],
    sets: { 'nq-30-done': true, 'neo-lab-ray': true },
    notes:
      'Unlocks the Lab Ray (brief, "Ways to change colour or species"). The map pieces are guaranteed finds once the quest is active, any order within each step. ' +
      'Lab Ray outcomes are never harmful: a stat change is +1 or −1 level, never below 0. Nubbins are not zappable (Neo family only) unless the owner decides otherwise. ' +
      'Sloth wink: the cabinet label and the "anybody green" line; the Scientist never appears in the NP line.',
  },

  // ================================================================== NQ31 Snowager
  {
    id: 'nq31',
    code: 'NQ31',
    title: 'Sneaking Past the Snowager',
    source: 'Neopets: the Snowager (Terror Mountain Ice Caves)',
    audience: 'all',
    trigger: { where: 'Terror Mountain, the mouth of the Ice Caves', when: 'Your first visit to the Ice Caves.' },
    speakers: [
      { id: 'ice-guide', name: 'The Ice Cave Guide', kind: 'other' },
      { id: 'snowager', name: 'The Snowager', kind: 'other', basedOn: 'The Snowager (Neopets)' },
    ],
    steps: [
      {
        id: 'nq31-step1',
        goal: 'Sneak into the Snowager’s cave while he sleeps and take one item from his hoard.',
        hint: 'Move only while he breathes out (the frost cloud). Freeze when he breathes in. If he wakes, you’re chilled, not hurt.',
        check: 'sneak:snowager:1',
        scene: {
          id: 'nq31-sneak',
          lines: [
            l('ice-guide', 'First time? Right. In there is the Snowager. Big ice worm. Sleeps on a pile of other people’s things.'),
            l('ice-guide', 'When he breathes out, you see a frost cloud. Move then. When he breathes in, freeze. Like a statue.', 'think'),
            l('ice-guide', 'If he wakes, he blasts you. Snow, not ice. You’ll be cold and cross for a bit. That’s all.'),
            l('ice-guide', 'And don’t touch the spoon. Nobody knows why. He just really loves that spoon.'),
            n('Deep in the cave, something the size of a train exhales. A white mist rolls towards you.'),
            n('Your Nubbin puffs up all its fur and goes perfectly still, practising.'),
          ],
          choices: [
            {
              id: 'nq31-solo',
              label: 'Go in alone. Leave your Nubbin with the guide.',
              set: { 'nq-31-solo': true },
              then: [l('ice-guide', 'Wise. Small ones sneeze in the cold. Sneezing is very bad in there.')],
            },
            {
              id: 'nq31-together',
              label: 'Take your Nubbin in with you.',
              then: [l('ice-guide', 'Brave. Hold its nose if it looks like sneezing.', 'happy')],
            },
          ],
        },
        done: {
          id: 'nq31-sneak-done',
          lines: [
            l('snowager', 'Mmmnh… ssssomebody… touching my… sssspoon…', 'think'),
            n('He rolls over, curls his tail protectively round a single tarnished spoon, and goes back to sleep.'),
            n('You are already outside. Your heart arrives a moment later.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq31-complete',
      lines: [
        l('ice-guide', 'You made it out! First try! Most people come out looking like a snowman.', 'happy'),
        l('ice-guide', 'That’s your one, mind. He sleeps light for anyone he’s smelt before.'),
        n('In your hand is the thing you grabbed: a snowball that never melts, packed perfectly round.'),
        l('ice-guide', 'Ha. He keeps those for throwing at people. Now you have one to throw back.'),
      ],
    },
    rewards: [
      { id: 'nq31-hoard', kind: 'title', label: 'Snowager’s Hoard', description: 'Title. One sneak, one prize, ever. You got yours, and the spoon is still his.' },
      { id: 'nq31-snowball', kind: 'item', label: 'Icy Snowball', description: 'A single-use Battledome item that slows an opponent for one round.' },
    ],
    sets: { 'nq-31-done': true },
    notes:
      'One-time: this is the only Snowager sneak (canon: no per-visit freebies; the brief’s “once per visit” loop is retired). It cannot wake him; the done scene is a near-miss for comedy, and there is no fail state. ' +
      'The old repeatable “Snowager Sneak” feature reward is replaced by the Snowager’s Hoard title. ' +
      'If `nq-31-solo` is set ("Go in alone"), the Nubbin is waiting by the guide in the complete scene, wrapped in his scarf.',
  },

  // ================================================================== NQ32 Jelly World
  {
    id: 'nq32',
    code: 'NQ32',
    title: 'The Signpost to Jelly World',
    source: 'Neopets: Jelly World (the land that does not exist)',
    audience: 'all',
    trigger: { where: 'Neopia Central, a signpost behind the Food Shop', when: 'Any visit to Neopia Central. The signpost is easy to miss.' },
    speakers: [{ id: 'jelly-official', name: 'The Official', kind: 'other' }],
    steps: [
      {
        id: 'nq32-step1',
        goal: 'Follow the signpost to Jelly World, which does not exist.',
        hint: 'Walk the way the sign points. Keep walking. Ignore the Official.',
        check: 'visit:neopia:jelly-world',
        scene: {
          id: 'nq32-sign',
          lines: [
            n('Behind the Food Shop is a wooden signpost. One arm says JELLY WORLD. It points at a brick wall.'),
            n('Beneath the arm, a smaller sign: JELLY WORLD IS CLOSED. Beneath that, smaller still: JELLY WORLD WAS NEVER OPEN.'),
            l('jelly-official', 'Ah. Don’t mind that. It’s a sign to nowhere. There is no Jelly World.'),
            l('jelly-official', 'There has never been a Jelly World. Please stop asking about Jelly World.', 'angry'),
            n('He has a clipboard. The clipboard has a small green jelly stain on it.'),
            n('Your Nubbin walks up to the brick wall, and walks through it.', 'shock'),
          ],
          choices: [
            {
              id: 'nq32-follow',
              label: 'Follow your Nubbin.',
              then: [l('jelly-official', 'I didn’t see that. I didn’t see any of that.', 'shock')],
            },
            {
              id: 'nq32-stain',
              label: 'Point at the stain on his clipboard.',
              then: [l('jelly-official', 'That’s… lime cordial. Unrelated. Good day.'), n('He walks away briskly. You go through the wall.')],
            },
          ],
        },
        done: {
          id: 'nq32-sign-done',
          lines: [
            n('On the other side of the wall is nothing. A flat, wobbling, shiny nothing, as far as you can see.'),
            n('A second signpost stands in the nothing. It says: YOU ARE NOT HERE.'),
            n('In the middle of the nothing sits one jelly on a plate.'),
          ],
        },
      },
    ],
    complete: {
      id: 'nq32-complete',
      lines: [
        n('The jelly is green. It wobbles at you, in a friendly sort of way.'),
        n('Nobody else is here. The ground wobbles too. So does the sky, a little.'),
        n('A small card beside the plate says: This jelly does not exist. Please enjoy it.'),
        n('Your Nubbin looks at the jelly, then at you, then at the jelly.'),
      ],
      choices: [
        {
          id: 'nq32-eat',
          label: 'Share it with your Nubbin, here and now.',
          set: { 'nq-32-jelly': 'eaten' },
          then: [n('It tastes of lime and a bit of birthday. When you look up, you are behind the Food Shop again.')],
        },
        {
          id: 'nq32-keep',
          label: 'Take it home on its plate.',
          set: { 'nq-32-jelly': 'kept' },
          then: [n('You step back through the wall with the jelly in both hands. The Official is waiting, eyes closed.')],
        },
        {
          id: 'nq32-leave',
          label: 'Leave it. Jelly World needs its jelly.',
          set: { 'nq-32-jelly': 'left' },
          then: [n('You leave it on its plate. As you go, it wobbles once, slowly, like a wave.')],
        },
      ],
    },
    rewards: [
      { id: 'nq32-jelly', kind: 'item', label: 'Green Jelly', description: 'The rarest jelly. Given only if you take it home; it counts for the Island Chef’s trifle (NQ21).' },
      { id: 'nq32-giant-jelly', kind: 'item', label: 'The Giant Jelly', description: 'One time only. Once you have finished both this quest and the Neopia line (NP13), the Official leaves one more jelly behind the Food Shop, and denies it.' },
      { id: 'nq32-title', kind: 'title', label: 'Has Never Been to Jelly World', description: 'Title. You haven’t. Nobody has.' },
    ],
    sets: { 'nq-32-done': true },
    notes:
      'A joke quest and an Easter egg (brief: "a signpost to nowhere, and one jelly"). The Green Jelly is added only if `nq-32-jelly` = kept; eaten gives a happy mood boost to the Nubbin; left gives nothing but the title. ' +
      'After this quest, the Official stands by the sign and denies everything (one random line from a pool of short denials, to be written; ambient, no reward). ' +
      'The Giant Jelly is one-time (canon: no per-visit freebies): granted once, as soon as both `nq-32-done` and `np-line-complete` are set (whichever comes second), as a second jelly on the plate behind the Food Shop. ' +
      'The brief lists Jelly as a special colour "from Jelly World"; this quest does not grant it. The owner decides whether the Giant Jelly can rarely drop a Jelly paint brush. ' +
      'Art: a flat glossy green-white void, wobble shader on ground and sky, one jelly on a plate.',
  },
];

// ------------------------------------------------------------------ variants
/** The complete scene of quest `questId` in the list above. */
function completeOf(questId: string): Scene {
  const q = NEOPIA_QUESTS.find((x) => x.id === questId);
  if (!q) throw new Error(`neopia-quests: no quest ${questId}`);
  return q.complete;
}

/**
 * A variant of a quest's complete scene for a choice flag that is on, built from the base
 * so the rest of the scene stays identical: `replace` swaps lines by index, `insert` adds a
 * line at an index. The id is `<complete id>-<flag>`, which is how sim/atlas.ts variantFor
 * matches a flag set to true.
 */
function flagVariant(
  questId: string,
  flag: string,
  opts: { replace?: Record<number, Line>; insert?: { at: number; line: Line } },
): Scene {
  const base = completeOf(questId);
  const lines = base.lines.map((ln, i) => opts.replace?.[i] ?? ln);
  if (opts.insert) lines.splice(opts.insert.at, 0, opts.insert.line);
  return { id: `${base.id}-${flag}`, lines, ...(base.choices ? { choices: base.choices } : {}) };
}

/**
 * Each choice flag below is read once, in its own quest's complete scene, so the choice
 * shows. Flags read in notes instead (nq-08-blessing, nq-12-beds, nq-15-book, nq-16-last-bolt,
 * nq-24-tasted, nq-26-sipped, nq-28-pie, nq-29-guess, nq-31-solo, nq-32-jelly) have no variant.
 * NQ30 has two flags; the sim plays the first match in this order, so the cabinet wins.
 */
export const NEOPIA_QUESTS_VARIANTS: Scene[] = [
  flagVariant('nq01', 'nq-01-promised-warm', {
    insert: { at: 0, line: l('fire-faerie', 'And it was still warm when it got here. You keep promises. I’ll remember that.', 'happy') },
  }),
  flagVariant('nq02', 'nq-02-dived', {
    replace: { 0: l('water-faerie', 'The one that dived. I can tell; it still smells of the ruins. Hold it up for me.', 'soft') },
  }),
  flagVariant('nq05', 'nq-05-haggled', {
    insert: { at: 0, line: l('light-faerie', 'You haggled. I can tell; you’ve the look of someone who paid half and still feels guilty.', 'happy') },
  }),
  flagVariant('nq09', 'nq-09-invited', {
    insert: { at: 3, line: l('taelia', 'And Keeper. Next time, I might come into the Factory with you. Might.', 'soft') },
  }),
  flagVariant('nq10', 'nq-10-pondered', {
    insert: { at: 2, line: l('fountain-faerie', 'You took your time over it. Good. The ones who think first never come back asking for a different colour.', 'soft') },
  }),
  flagVariant('nq13', 'nq-13-shouted', {
    insert: { at: 4, line: l('illusen', 'She heard you shout, you know. She’ll pretend she didn’t, for about a week.', 'think') },
  }),
  flagVariant('nq18', 'nq-18-glass', {
    replace: { 3: l('island-chef', 'A brave one. I knew it. And the jam came in clay, so my eyebrows stay. Take the page.', 'happy') },
  }),
  flagVariant('nq19', 'nq-19-picked', {
    insert: { at: 1, line: l('island-chef', 'Picked by a swimmer. You can taste it: happier kelp.', 'happy') },
  }),
  flagVariant('nq23', 'nq-23-asked-curse', {
    insert: { at: 3, line: l('edna', 'Cursed? Mildly. It wears off by Thursday. Everything does, round here.', 'think') },
  }),
  flagVariant('nq27', 'nq-27-kind', {
    replace: { 2: l('brain-tree', 'I am whole again. You asked how a tree feels, earlier. Nobody does. Take this, and ask it now and then.', 'soft') },
  }),
  flagVariant('nq28', 'nq-28-asked-mum', {
    insert: { at: 3, line: l('esophagor', 'You asked about her. Before the pie, I mean. Nobody asks. Thank you for that too.', 'soft') },
  }),
  flagVariant('nq30', 'nq-30-cabinet', {
    replace: { 2: l('lab-scientist', 'Come back whenever you like. The map knows the way now. And stop looking at the cabinet.', 'shock') },
  }),
  flagVariant('nq30', 'nq-30-keen', {
    insert: { at: 2, line: l('lab-scientist', 'You looked pleased when you found the map. Most people look worried. I’ve decided to like you.', 'happy') },
  }),
];

/** Every distinct `check` string used above. */
export const CHECKS: string[] = [
  'give:item:omelette-slice:fire-faerie',
  'give:item:grey-maraquan-pearl:water-faerie',
  'give:item:shenkuu-wind-chime:air-faerie',
  'give:item:meri-acres-turnip:earth-faerie',
  'give:item:sunstone-scarab:light-faerie',
  'give:item:neovian-black-candle:dark-faerie',
  'give:item:kreludite-chunk:space-faerie',
  'give:item:thick-smoke-bomb:battle-faerie',
  'give:item:taelia-ice-cream:taelia',
  'give:item:kiko-glass-float:fountain-faerie',
  'paint:fountain-faerie:any',
  'give:item:brightvale-herbal:illusen',
  'give:item:volcanic-soil:illusen',
  'place:decor:illusen-herb-bed:3',
  'minigame:cover:glade-storm',
  'give:item:shadow-usuki:jhudora',
  'give:item:citadel-stone:jhudora',
  'minigame:conduct:jhudora-storm',
  'give:item:cheeseroller-cheese:island-chef',
  'give:item:lava-berry-jam:island-chef',
  'give:item:maraquan-kelp:island-chef',
  'give:item:space-gravy-tube:island-chef',
  'give:item:jelly:island-chef',
  'give:item:mortog-wart:edna',
  'give:item:tomb-bandage:edna',
  'give:item:dubloon-pepper-sauce:edna',
  'give:item:wise-kings-ink:edna',
  'give:item:thade-cobweb:edna',
  'talk:wise-old-king:brain-tree',
  'talk:fyora:brain-tree',
  'talk:neovia-baker:esophagor',
  'give:food:mushroom-pie:esophagor',
  'wake:turmaculus:warf',
  'find:item:lab-map-piece:2',
  'find:item:lab-map-piece:4',
  'visit:neopia:secret-laboratory',
  'sneak:snowager:1',
  'visit:neopia:jelly-world',
];
