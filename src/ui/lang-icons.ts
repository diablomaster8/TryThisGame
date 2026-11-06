/**
 * R0706: a picture for each word the child's list shows, keyed by word id (kept here, not on
 * `VocabItem`, so the shared content types stay untouched). Every band-'both' word has one;
 * a test in tests/ui/lang-icons.test.ts checks it against both courses.
 */
const HE_NUM = ['achat', 'shtayim', 'shalosh', 'arba', 'chamesh', 'shesh', 'sheva', 'shmone', 'tesha', 'eser'];
const JA_NUM = ['ichi', 'ni', 'san', 'yon', 'go', 'roku', 'nana', 'hachi', 'kyuu', 'juu'];
const KEYCAPS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

const BASE: Record<string, string> = {
  'he-shalom': '👋', 'he-boker-tov': '🌅', 'he-erev-tov': '🌇', 'he-laila-tov': '🌙',
  'he-toda': '🙏', 'he-toda-raba': '💐', 'he-bevakasha': '🤲', 'he-lehitraot': '🤗',
  'he-ken': '👍', 'he-lo': '🙅', 'he-ani': '🙋', 'he-korim-li': '🏷️', 'he-ma-shlomkha': '😊',
  'he-ma-shlomekh': '😊', 'he-tov': '⭐', 'he-beseder': '👌', 'he-or': '💡', 'he-ori': '🦉',
  'he-kochav': '⭐', 'he-yareach': '🌙',
  'he-adom': '🟥', 'he-kachol': '🟦', 'he-tsahov': '🟨', 'he-yarok': '🟩', 'he-lavan': '⬜',
  'he-shachor': '⬛', 'he-katom': '🟧', 'he-sagol': '🟪', 'he-varod': '🌸',
  'he-tapuach': '🍎', 'he-banana': '🍌', 'he-anavim': '🍇', 'he-rimon': '🍅', 'he-teena': '🫐',
  'he-tamar': '🌴', 'he-limon': '🍋', 'he-shaked': '🌰',
  'he-yanshuf': '🦉', 'he-tsipor': '🐦', 'he-parpar': '🦋', 'he-kelev': '🐶', 'he-chatul': '🐱',
  'he-dag': '🐟', 'he-sus': '🐴', 'he-arnav': '🐰',
  'he-savta': '👵', 'he-saba': '👴', 'he-mishpacha': '👨‍👩‍👧', 'he-ima': '👩', 'he-aba': '👨',
  'he-ach': '👦', 'he-achot': '👧', 'he-chaver': '🧒', 'he-chavera': '🧒',
  'he-sameach': '😀', 'he-smecha': '😀', 'he-atsuv': '😢', 'he-atsuva': '😢', 'he-ayef': '😴',
  'he-ayefa': '😴', 'he-tu-bishvat': '🌳', 'he-ets': '🌳', 'he-gan': '🌷', 'he-mayim': '💧',
  'he-shemesh': '☀️', 'he-geshem': '🌧️', 'he-perach': '🌸', 'he-panas': '🔦',
  'ja-ohayou': '🌅', 'ja-konnichiwa': '👋', 'ja-konbanwa': '🌇', 'ja-oyasumi': '🌙',
  'ja-arigatou': '🙏', 'ja-sumimasen': '🙇', 'ja-gomen-nasai': '😔', 'ja-sayounara': '👋',
  'ja-mata-ne': '🤗', 'ja-hai': '👍', 'ja-iie': '🙅', 'ja-hajimemashite': '🤝',
  'ja-watashi-wa-desu': '🙋', 'ja-itadakimasu': '🍚', 'ja-gochisousama': '😋',
  'ja-ike': '🏞️', 'ja-ue': '⬆️', 'ja-ie': '🏠', 'ja-kao': '🙂',
  'ja-aka': '🟥', 'ja-ao': '🟦', 'ja-kiiro': '🟨', 'ja-midori': '🟩', 'ja-shiro': '⬜',
  'ja-kuro': '⬛', 'ja-pinku': '🌸', 'ja-orenji': '🟧', 'ja-murasaki': '🟪',
  'ja-ringo': '🍎', 'ja-mikan': '🍊', 'ja-ichigo': '🍓', 'ja-momo': '🍑', 'ja-onigiri': '🍙',
  'ja-ocha': '🍵', 'ja-obentou': '🍱',
  'ja-koi': '🎏', 'ja-sakana': '🐟', 'ja-inu': '🐶', 'ja-neko': '🐱', 'ja-tori': '🐦',
  'ja-usagi': '🐰', 'ja-fukurou': '🦉', 'ja-kaeru': '🐸',
  'ja-okaasan': '👩', 'ja-otousan': '👨', 'ja-obaachan': '👵', 'ja-ojiichan': '👴',
  'ja-tomodachi': '🧒', 'ja-kazoku': '👨‍👩‍👧',
  'ja-ureshii': '😀', 'ja-kanashii': '😢', 'ja-tanoshii': '🎉', 'ja-kowai': '😨', 'ja-nemui': '😴',
  'ja-hana': '🌸', 'ja-hoshi': '⭐', 'ja-tsuki': '🌙', 'ja-ki': '🌳', 'ja-mizu': '💧',
  'ja-kawa': '🏞️', 'ja-yama': '⛰️', 'ja-ame': '🌧️', 'ja-yuki': '❄️', 'ja-hikari': '💡',
};
HE_NUM.forEach((s, i) => (BASE[`he-${s}`] = KEYCAPS[i]!));
JA_NUM.forEach((s, i) => (BASE[`ja-${s}`] = KEYCAPS[i]!));

export const WORD_ICONS: Readonly<Record<string, string>> = BASE;

const TOPIC_ICON: Record<string, string> = {
  greetings: '👋', letters: '🔤', numbers: '🔢', colours: '🎨', food: '🍎', animals: '🐾',
  family: '👨‍👩‍👧', feelings: '😊', nature: '🌳', culture: '🏮',
};

/** The picture for a word; falls back to its topic's picture. */
export function wordIcon(id: string, topic: string): string {
  return WORD_ICONS[id] ?? TOPIC_ICON[topic] ?? '💬';
}

/** The topic's own picture, for group headings. */
export function topicIcon(topic: string): string {
  return TOPIC_ICON[topic] ?? '💬';
}
