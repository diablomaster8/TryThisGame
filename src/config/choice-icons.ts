/**
 * R0677 (KIDS-09): the picture a sprout-band choice shows when its content gives no `icon`.
 * Thousands of sprout choices and lesson options were written before icons existed, so rather
 * than hand-edit each one, the label's words are looked up in this table, left to right, and
 * the first word with a picture wins. Two options in one set never share a picture: the later
 * one tries its next word, and a label with nothing left falls back to its number (1️⃣ 2️⃣ 3️⃣).
 * An authored `icon` always wins. Pure data and pure functions: content-check runs this in
 * Node to count what still falls back to a number.
 */

/** Keyword → picture. Keys are lower-case words; plurals, -ing, -ed and -er forms are folded in `lookup`. */
// prettier-ignore
const WORD_LIST: Record<string, string> = {
  // Answers and numbers
  yes: '✅', yeah: '✅', ok: '👌', okay: '👌', no: '❌', not: '❌', never: '🚫', nothing: '🤐', maybe: '🤔',
  dunno: '🤷', know: '🤷', why: '❓', what: '❓', who: '❓', where: '❓', how: '❓', first: '🥇', last: '🔚',
  half: '🌓', all: '💯',
  // Talking and listening
  say: '💬', tell: '💬', ask: '🙋', talk: '💬', call: '📣', shout: '📢', yell: '📢', whisper: '🤫',
  quiet: '🤫', quietly: '🤫', hush: '🤫', shh: '🤫', listen: '👂', hear: '👂', sing: '🎵', song: '🎵',
  hum: '🎶', tune: '🎶', music: '🎵', read: '📖', story: '📖', book: '📖', write: '✏️', draw: '🖍️',
  paint: '🎨', name: '🏷️', word: '🔤', hello: '👋', hi: '👋', goodbye: '👋', bye: '👋', wave: '👋',
  thank: '🙏', thanks: '🙏', please: '🙏', sorry: '😔', promise: '🤞', secret: '🤫', joke: '😂',
  laugh: '😂', cheer: '📣',
  // Feelings
  happy: '😊', glad: '😊', smile: '😊', sad: '😢', cry: '😢', upset: '😢', scared: '😨', afraid: '😨',
  fear: '😨', worried: '😟', worry: '😟', angry: '😠', cross: '😠', cranky: '😠', mad: '😠', calm: '😌',
  brave: '🦁', proud: '😊', shy: '🙈', silly: '🤪', funny: '😂', bored: '😐', tired: '🥱', sleepy: '😴',
  excited: '🤩', surprised: '😮', lonely: '🥺', alone: '🧍', kind: '💖', kindly: '💖', nice: '💖',
  gentle: '🪶', gently: '🪶', soft: '🪶', love: '❤️', heart: '❤️', fair: '⚖️', rude: '😠', hurt: '🩹',
  ill: '🤒', sick: '🤒', hungry: '🍽️', thirsty: '🥤', cold: '🥶', hot: '🥵', warm: '🔥', safe: '🛡️',
  trust: '🤝', feel: '💭', think: '💭', remember: '💭', wonder: '💭', pretend: '🎭', dream: '💭',
  // Doing
  sit: '🪑', stand: '🧍', wait: '⏳', stay: '⏳', rest: '🛌', sleep: '😴', nap: '😴', bed: '🛏️',
  bedtime: '🛏️', go: '🚶', walk: '🚶', step: '👣', follow: '👣', run: '🏃', hurry: '🏃', race: '🏁',
  fast: '💨', faster: '💨', slow: '🐢', slowly: '🐢', jump: '🦘', hop: '🐇', climb: '🧗', swim: '🏊',
  dance: '💃', play: '🧸', game: '🎲', toy: '🧸', ball: '⚽', hide: '🙈', seek: '🔍', look: '👀',
  watch: '👀', see: '👀', peek: '👀', find: '🔍', search: '🔍', check: '🔍', point: '👉', show: '👉',
  count: '🔢', help: '🤝', share: '🤲', give: '🎁', gift: '🎁', offer: '🤲', take: '✋', grab: '✋',
  catch: '🧤', hold: '🤲', carry: '🤲', lift: '🤲', pick: '🤏', put: '👇', drop: '👇', throw: '🤾',
  push: '👐', pull: '🪢', open: '🔓', shut: '🚪', close: '🚪', leave: '🚪', come: '👈', back: '🔙',
  home: '🏠', stop: '✋', start: '▶️', try: '💪', again: '🔁', turn: '🔄', round: '🔄', make: '🛠️',
  build: '🧱', fix: '🔧', mend: '🪡', work: '🛠️', clean: '🧽', wash: '🧼', cook: '🍳', eat: '🍽️',
  drink: '🥤', taste: '😋', sniff: '👃', smell: '👃', nose: '👃', hug: '🤗', cuddle: '🤗', squeeze: '🤗',
  pat: '🖐️', pet: '🖐️', stroke: '🖐️', kiss: '😘', hand: '✋', hands: '👐', clap: '👏', nod: '🙂',
  bow: '🙇', breath: '🌬️', breathe: '🌬️', blow: '🌬️', keep: '🔒', lock: '🔒', save: '💾', grow: '🌱',
  plant: '🌱', dig: '⛏️', water: '💧', feed: '🥣', fetch: '🐕', send: '📨', bring: '🤲', visit: '🚪',
  knock: '🚪', wake: '⏰', learn: '🎓', choose: '👆', decide: '👆', together: '👫', both: '👫',
  // People and creatures
  me: '🙋', i: '🙋', you: '🫵', yourself: '🫵', friend: '🧑‍🤝‍🧑', friends: '🧑‍🤝‍🧑', everyone: '👨‍👩‍👧‍👦',
  people: '👥', nobody: '🚫', someone: '👤', grown: '🧑', gran: '👵', granny: '👵', grandma: '👵',
  mum: '👩', dad: '👨', baby: '👶', king: '🤴', queen: '👸', nubbin: '🥚', egg: '🥚', dog: '🐕', puppy: '🐕',
  cat: '🐈', kitten: '🐈', fish: '🐟', bird: '🐦', duck: '🦆', owl: '🦉', bee: '🐝', bear: '🐻', lion: '🦁',
  tiger: '🐯', wolf: '🐺', fox: '🦊', rabbit: '🐇', bunny: '🐇', mouse: '🐭', frog: '🐸', snake: '🐍',
  horse: '🐴', cow: '🐄', pig: '🐖', sheep: '🐑', hen: '🐔', chick: '🐤', butterfly: '🦋', snail: '🐌',
  ant: '🐜', spider: '🕷️', whale: '🐋', dragon: '🐉', monkey: '🐒', elephant: '🐘', turtle: '🐢',
  crab: '🦀', robot: '🤖', ghost: '👻', critter: '🐞', bug: '🐞', beetle: '🪲',
  // Things and places
  sun: '☀️', sunny: '☀️', moon: '🌙', star: '⭐', sky: '🌤️', night: '🌙', dark: '🌑', day: '🌞',
  morning: '🌅', evening: '🌇', light: '💡', lantern: '🏮', lamp: '🏮', fire: '🔥', rain: '🌧️',
  snow: '❄️', snowball: '❄️', ice: '🧊', wind: '🌬️', cloud: '☁️', storm: '⛈️', rainbow: '🌈',
  winter: '❄️', spring: '🌷', summer: '☀️', autumn: '🍂', tree: '🌳', leaf: '🍃', flower: '🌸',
  grass: '🌿', seed: '🌱', garden: '🏡', forest: '🌲', wood: '🪵', hill: '⛰️', mountain: '🏔️', rock: '🪨',
  stone: '🪨', sand: '🏖️', sea: '🌊', river: '🏞️', pond: '🫧', lake: '🏞️', bridge: '🌉', road: '🛣️',
  path: '🛤️', gate: '🚪', door: '🚪', wall: '🧱', house: '🏠', cottage: '🏡', boat: '⛵', ship: '🚢',
  train: '🚂', car: '🚗', map: '🗺️', key: '🔑', box: '📦', bag: '👜', pocket: '👖', coat: '🧥', hat: '🎩',
  scarf: '🧣', glove: '🧤', gloves: '🧤', shoe: '👟', boot: '🥾', sock: '🧦', blanket: '🛏️', cup: '☕',
  tea: '🍵', spoon: '🥄', bowl: '🥣', food: '🍲', fruit: '🍎', apple: '🍎', berry: '🫐', cake: '🎂',
  bread: '🍞', soup: '🍲', sweet: '🍬', sweets: '🍬', honey: '🍯', juice: '🧃', milk: '🥛', cheese: '🧀',
  carrot: '🥕', gourd: '🎃', pumpkin: '🎃', shell: '🐚', shells: '🐚', coin: '🪙', crown: '👑', bell: '🔔',
  drum: '🥁', clock: '🕰️', time: '⏰', bottle: '🍾', rope: '🪢', ladder: '🪜', basket: '🧺', feather: '🪶',
  picture: '🖼️', photo: '📷', letter: '✉️', present: '🎁', party: '🎉', candle: '🕯️', mirror: '🪞',
  window: '🪟', chair: '🪑', table: '🍽️', bath: '🛁', soap: '🧼', eyes: '👀', eye: '👁️', ear: '👂',
  ears: '👂', face: '🙂', head: '🙂', foot: '🦶', feet: '🦶', tooth: '🦷', square: '🟥', circle: '🔵',
  triangle: '🔺', red: '🔴', blue: '🔵', green: '🟢', yellow: '🟡', pink: '🩷', purple: '🟣', orange: '🟠',
  brown: '🟤', black: '⚫', white: '⚪', grey: '🩶', gray: '🩶', big: '🐘', bigger: '🐘', small: '🐭',
  little: '🐭', tiny: '🐜', long: '📏', short: '📏', high: '⬆️', up: '⬆️', low: '⬇️', down: '⬇️',
  top: '🔝', under: '⬇️', over: '⬆️', inside: '📥', out: '📤', left: '⬅️', right: '➡️', near: '📍',
  far: '🔭', beside: '👫', behind: '🔙', front: '⬆️', away: '🏃', loud: '🔊', noise: '🔊', sound: '🔊',
  wet: '💦', dry: '🌵', new: '✨', old: '🕰️', same: '🟰', different: '🔀', wrong: '❌', true: '✅',
  good: '👍', bad: '👎', more: '➕', less: '➖',
  // Second sweep: the words left over after the first table (content-check's number-only list)
  east: '➡️', west: '⬅️', north: '⬆️', south: '⬇️', nearer: '📍', further: '🔭', lower: '⬇️',
  higher: '⬆️', louder: '🔊', quieter: '🤫', fewer: '➖', happier: '😊', taller: '🦒', shorter: '📏',
  smaller: '🐭', smallest: '🐜', lighter: '🪶', heavier: '🏋️', heavy: '🏋️', cooler: '🧊', moo: '🐄',
  quack: '🦆', baa: '🐑', woof: '🐕', meow: '🐈', lunchtime: '🥪', lunch: '🥪', breakfast: '🥣',
  dinner: '🍽️', supper: '🍽️', snack: '🍪', biscuit: '🍪', banana: '🍌', nut: '🥜', yam: '🍠',
  teapot: '🫖', teacup: '☕', ladle: '🥄', grumpy: '😠', forget: '💭', forgetting: '💭', forgiven: '🤝',
  forgive: '🤝', toes: '🦶', toe: '🦶', float: '🛟', sink: '⬇️', family: '👨‍👩‍👧', hiccup: '😮',
  busy: '🐝', ignore: '🙉', towel: '🧺', stick: '🪵', log: '🪵', wings: '🪽', wing: '🪽', fly: '🪽',
  kite: '🪁', sword: '🗡️', knight: '🛡️', castle: '🏰', end: '🔚', beginning: '▶️', middle: '⏺️',
  edge: '📍', bottom: '⬇️', above: '⬆️', below: '⬇️', zero: '⭕', none: '⭕', child: '🧒', boy: '👦',
  girl: '👧', sturdy: '💪', speedy: '💨', quickly: '💨', quick: '💨', invisible: '🫥', wagon: '🛒',
  cart: '🛒', leg: '🦵', knee: '🦵', elbow: '💪', shoulder: '💪', snowflake: '❄️', owlet: '🦉',
  duckling: '🐥', goat: '🐐', donkey: '🫏', zebra: '🦓', rose: '🌹', root: '🌱', thread: '🧵', cotton: '🧵',
  cloth: '🧵', clever: '🧠', mind: '🧠', luck: '🍀', sneeze: '🤧', fence: '🚧', roof: '🏠', bench: '🪑',
  cushion: '🛋️', bark: '🌳', stream: '🏞️', uphill: '⛰️', downhill: '🛷', splash: '💦', stomp: '🦶',
  touch: '👆', wiggly: '〰️', poke: '👉', reach: '🙌', agree: '👍', guess: '🤔', change: '🔄', fun: '🎉',
  best: '🏆', sunrise: '🌅', daytime: '🌞', colour: '🎨', colours: '🎨', sparkly: '✨', fossil: '🦴',
  flat: '➖', karate: '🥋', noisy: '🔊', matter: '🤔', real: '✅', lead: '👣', ride: '🐴', wade: '💦',
  lost: '🧭', switch: '🔘', ripe: '🍎', tight: '🤗', mole: '🐭', spokes: '🛞', wheel: '🛞', zoomy: '💨',
  practice: '💪', practise: '💪', peel: '🍌', grape: '🍇', strawberry: '🍓', toss: '🤾', slope: '⛰️',
  tall: '🦒', thin: '📏', giant: '🐘', block: '🧱', muddy: '🟤', pipe: '🪈', believe: '🤞', tumble: '🤸',
  lemur: '🐒', guard: '💂', kettle: '🫖', bet: '🎲', feelings: '💭', bean: '🫘', wooden: '🪵', bun: '🍞',
  cage: '🪤', closer: '📍', trunk: '🌳', shiny: '✨', plate: '🍽️', frosty: '❄️', rectangle: '▬',
  boom: '💥', fort: '🏰', fault: '😔', hard: '🪨', side: '↔️', gone: '🚶', mine: '🙋', asleep: '😴',
  month: '📅', tail: '🐾', robin: '🐦', string: '🧵', grandmother: '👵', woman: '👩', man: '👨', corn: '🌽',
  gold: '🪙', truth: '✅', tummy: '🫃', sandwich: '🥪', field: '🌾', net: '🥅', join: '🤝', unkind: '😠',
  baker: '🥖', smoke: '💨', pebble: '🪨', hair: '💇', toucan: '🦜', parrot: '🦜', jaguar: '🐆',
  leopard: '🐆', air: '🌬️', sugar: '🍬', kneel: '🧎', roar: '🦁', seal: '🦭', tap: '👆', tickly: '🪶',
  parent: '🧑', fairy: '🧚', chase: '🏃', saturday: '📅', wednesday: '📅', thankful: '🙏', bossy: '😤',
  stuck: '🪤', trip: '🧳', country: '🗺️', town: '🏘️', care: '💖', everything: '💯', something: '🎁',
  amazed: '😮', bumpy: '〰️', pile: '⛰️', skin: '🖐️',
};

// A Map, so "constructor" or "toString" in a label never finds a prototype key.
const WORDS = new Map(Object.entries(WORD_LIST));
const PLURAL = /(?:es|s)$/;
const COUNTS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** A count as a picture: stars up to five, then a five-hand and stars (a ten-frame habit). */
export function countIcon(n: number): string {
  return n <= 5 ? '⭐'.repeat(n) : '🖐️'.repeat(Math.floor(n / 5)) + '⭐'.repeat(n % 5);
}

/** Fold a word to a table key: exact, then -s/-es/-ies, -ing, -ed, -ly. */
function lookup(word: string): string | undefined {
  const w = word
    .toLowerCase()
    .replace(/[’']s$/, '')
    .replace(/[’']/g, '');
  const hit = WORDS.get(w);
  if (hit) return hit;
  const tries = [
    w.replace(PLURAL, ''),
    w.replace(/ies$/, 'y'),
    w.replace(/s$/, ''),
    w.replace(/ing$/, ''),
    w.replace(/ing$/, 'e'),
    w.replace(/(.)\1ing$/, '$1'),
    w.replace(/ed$/, ''),
    w.replace(/ed$/, 'e'),
    w.replace(/ly$/, ''),
    w.replace(/(.)\1(?:er|est)$/, '$1'),
    w.replace(/i(?:er|est)$/, 'y'),
    w.replace(/(?:er|est)$/, ''),
  ];
  for (const t of tries) if (t !== w && WORDS.has(t)) return WORDS.get(t);
  return undefined;
}

/** Every picture a label's words point at, in reading order, without repeats. */
export function labelIcons(label: string): string[] {
  const out: string[] = [];
  // A counted answer ("3", "Four") shows that many stars, never a keycap: the keycaps are the
  // button numbers, and "3️⃣" on button 1 would contradict its dot. A number word counts only as
  // the whole answer: "one" in "the ones who've gone" is no count.
  const tokens = label.match(/[\p{L}\p{N}’']+/gu) ?? [];
  for (const t of tokens) {
    const word = tokens.length === 1 ? COUNTS.indexOf(t.toLowerCase()) + 1 : 0;
    const n = /^\d+$/.test(t) ? Number(t) : word;
    if (n >= 1 && n <= 10) {
      out.push(countIcon(n));
      continue;
    }
    const icon = lookup(t);
    if (icon && !out.includes(icon)) out.push(icon);
  }
  return out;
}

/** The fallback for place `i`: a keycap number. */
export function numberIcon(i: number): string {
  return i < 9 ? `${i + 1}️⃣` : String(i + 1);
}

/**
 * One picture per option in a set: the authored icon, else the first word-picture no
 * earlier option in the set has taken, else the option's number. `fromWords` says which
 * came from the table (true), the content (null) or the number fallback (false).
 */
export function resolveChoiceIcons(
  items: readonly { label: string; icon?: string | undefined }[],
): { icon: string; fromWords: boolean | null }[] {
  const taken = new Set(items.flatMap((x) => (x.icon ? [x.icon] : [])));
  return items.map((x, i) => {
    if (x.icon) return { icon: x.icon, fromWords: null };
    const pick = labelIcons(x.label).find((p) => !taken.has(p));
    if (pick) {
      taken.add(pick);
      return { icon: pick, fromWords: true };
    }
    return { icon: numberIcon(i), fromWords: false };
  });
}
