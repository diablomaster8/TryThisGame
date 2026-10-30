/**
 * Renders the content pack as readable Markdown screenplays: npx tsx tests/tools/script-book.ts [outDir]
 *
 * One storyline per file, scenes in play order, in folders by line (campaign/, side/, fun/, atlas/A14/
 * and so on; the plan is in docs/story-review/review-2026-10-22-2.md). Each variant scene sits under its
 * parent scene; variants with no parent go at the end of their storyline's file. Learning Grove versions
 * are sibling files (atlas/A14/sprout.md) or live under learning/. `README.md` indexes every file and
 * `ids.tsv` maps each scene id to its book file:line and its source file:line. A file over CAP lines is
 * split at its `##` headings into `-1`, `-2`, ….
 *
 * `--check` renders to a temp dir and exits 1 if the committed `script-book/` has drifted from `src/content/`.
 * `--whole <dir>` also writes one read-through file per line (Hazel's Grove first) into <dir>, which is
 * gitignored and never committed.
 */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix } from 'node:path';
import * as C from '../../src/content/index';
import { SPEAKERS, type Line, type Scene } from '../../src/config/story';
import type { EduBand, EduQuest, EduScene, Quest, Storyline } from '../../src/content/types';

const args = process.argv.slice(2);
const check = args.includes('--check');
const wholeAt = args.indexOf('--whole');
const whole = wholeAt >= 0 ? args[wholeAt + 1] : undefined;
if (wholeAt >= 0 && (!whole || whole.startsWith('--'))) throw new Error('--whole needs a directory');
const BOOK = 'script-book';
const out = check ? mkdtempSync(join(tmpdir(), 'script-book-')) : (args.find((a, i) => !a.startsWith('--') && (wholeAt < 0 || i !== wholeAt + 1)) ?? BOOK);
/** Longest file, in lines, before it is split at its `##` headings. */
const CAP = 3500;

// ---------------------------------------------------------------- the storylines, in play order
type Kind = 'quests' | 'campaign' | 'storyline' | 'other';
interface Unit {
  /** Book path without `.md`, e.g. `side/S09` or `atlas/A14/main`. */
  path: string;
  title: string;
  /** The line it belongs to, for the README and `--whole`. */
  line: string;
  kind: Kind;
  quests?: Quest[];
  variants?: Scene[];
  /** Where the Learning Grove versions go: `<edu>/sprout.md` and `<edu>/reader.md`. */
  edu?: string;
  /** Side stories: the chapter in which it opens (0 = post-game), for the read-through. */
  opens?: number;
}
const byCode = (a: Quest, b: Quest) => a.code.localeCompare(b.code, 'en', { numeric: true });
const sorted = (qs: Quest[]) => [...qs].sort(byCode);
const pad = (n: number) => String(n).padStart(2, '0');

const SIDE_1_22 = [C.SIDE_STORIES_FUN, C.SIDE_STORIES_MAIN, C.SIDE_STORIES_FUN_2, C.SIDE_STORIES_NEW_1, C.SIDE_STORIES_NEW_2, C.SIDE_STORIES_NEW_3, C.SIDE_STORIES_NEW_4].flat();
const SIDE_1_22_VARIANTS = [...C.SIDE_STORIES_MAIN_VARIANTS, ...C.SIDE_STORIES_FUN_2_VARIANTS, ...C.SIDE_STORIES_NEW_3_VARIANTS];
const S23_31: [Quest[], Scene[]][] = [
  [C.SIDE_STORY_S23, C.SIDE_STORY_S23_VARIANTS], [C.SIDE_STORY_S24, C.SIDE_STORY_S24_VARIANTS], [C.SIDE_STORY_S25, C.SIDE_STORY_S25_VARIANTS],
  [C.SIDE_STORY_S26, C.SIDE_STORY_S26_VARIANTS], [C.SIDE_STORY_S27, C.SIDE_STORY_S27_VARIANTS], [C.SIDE_STORY_S28, C.SIDE_STORY_S28_VARIANTS],
  [C.SIDE_STORY_S29, C.SIDE_STORY_S29_VARIANTS], [C.SIDE_STORY_S30, C.SIDE_STORY_S30_VARIANTS], [C.SIDE_STORY_S31, C.SIDE_STORY_S31_VARIANTS],
];
/** Side-story variants whose ids carry no `sNN-` prefix or parent: the side story they belong to. */
const VARIANT_OWNER: [string, string][] = [['end-epi-mill-', 'S13'], ['end-epi-cinder-', 'S19']];
/**
 * Variant → parent scene where the id prefix doesn't say (seeded empty: the prefix rule places 666 of
 * 736 variants; the rest are Grove-side or campaign-side scenes that belong at the end of their file).
 */
const PARENT: Record<string, string> = { 's10-foot': 's10-foot-msc' };
const ATLAS: [Quest[], Scene[], string][] = [
  [C.ATLAS_A01, C.ATLAS_A01_VARIANTS, 'The Brothers’ Bargain'], [C.ATLAS_A02, C.ATLAS_A02_VARIANTS, 'The Monkey and the Monk'],
  [C.ATLAS_A03, C.ATLAS_A03_VARIANTS, 'Forty-Nine Days'], [C.ATLAS_A04, C.ATLAS_A04_VARIANTS, 'The Waterfall Prince'],
  [C.ATLAS_A05, C.ATLAS_A05_VARIANTS, 'The Lion of Mali'], [C.ATLAS_A06, C.A06_VARIANTS, 'Seven Voyages'],
  [C.ATLAS_A07, C.ATLAS_A07_VARIANTS, 'The Marigold Bridge'], [C.ATLAS_A08, C.ATLAS_A08_VARIANTS, 'The Twelve Tasks'],
  [C.ATLAS_A09, C.ATLAS_A09_VARIANTS, 'The Comet'], [C.ATLAS_A10, C.A10_VARIANTS, 'The Heart of the Island'],
  [C.ATLAS_A11, C.A11_VARIANTS, 'The Enchanted Place'], [C.ATLAS_A12, C.A12_VARIANTS, 'The Mirror Shard'],
  [C.ATLAS_A13, C.A13_VARIANTS, 'The Wooden Boy'], [C.ATLAS_A14, C.A14_VARIANTS, 'Homecoming'],
  [C.ATLAS_A15, C.ATLAS_A15_VARIANTS, 'The Humbug'], [C.ATLAS_A16, C.ATLAS_A16_VARIANTS, 'The Fox and the Rose'],
  [C.ATLAS_A17, C.A17_VARIANTS, 'The Camphor Tree'], [C.ATLAS_A18, C.ATLAS_A18_VARIANTS, 'The Doll in the Pocket'],
  [C.ATLAS_A19, C.A19_VARIANTS, 'The Dragon Who Fell'], [C.ATLAS_A20, C.ATLAS_A20_VARIANTS, 'The Weeping'],
  [C.ATLAS_A21, C.A21_VARIANTS, 'The Flower Field'], [C.ATLAS_A22, C.A22_VARIANTS, 'The Candle'],
  [C.ATLAS_A23, C.A23_VARIANTS, 'Remember Who You Are'], [C.ATLAS_A24, C.ATLAS_A24_VARIANTS, 'The Law of the Jungle'],
  [C.ATLAS_A25, C.ATLAS_A25_VARIANTS, 'The Nothing'], [C.ATLAS_A26, C.A26_VARIANTS, 'The Wall of Uruk'],
  [C.ATLAS_A27, C.ATLAS_A27_VARIANTS, 'The White-Haired Prince'], [C.ATLAS_A28, C.ATLAS_A28_VARIANTS, 'The Box of Stories'],
  [C.ATLAS_A29, C.ATLAS_A29_VARIANTS, 'The Honmoon'], [C.ATLAS_A30, C.ATLAS_A30_VARIANTS, 'The Word on the Brow'],
  [C.ATLAS_A31, C.A31_VARIANTS, 'The Hero Twins'],
];
const ARCADE: [Quest[], Scene[], string][] = [
  [C.ARCADE_PA1, C.PA1_VARIANTS, 'The Chao Altar'], [C.ARCADE_PA2, C.ARCADE_PA2_VARIANTS, 'The Clone Island'],
  [C.ARCADE_PA3, C.PA3_VARIANTS, 'The Hollow Kingdom'], [C.ARCADE_PA4, C.ARCADE_PA4_VARIANTS, 'Mercy'],
  [C.ARCADE_PA5, C.PA5_VARIANTS, 'The Hundred-Year Sleep'],
];
const STORYLINES: [string, Storyline[]][] = [
  ['hundred', [C.STORYLINE_HUNDRED]], ['logged', [C.STORYLINE_LOGGED]], ['beetle', [C.STORYLINE_BEETLE]], ['dawndusk', [C.STORYLINE_DAWN, C.STORYLINE_DUSK]],
];

const GROVE = "Hazel's Grove";
/** The chapter a side story opens in, read from its trigger text (0 = post-game, after the endings). */
const opensIn = (q: Quest) => (/post-game/i.test(q.trigger.when) ? 0 : Number(/chapter (\d+)|\bc(\d+)-/i.exec(q.trigger.when)?.slice(1).find(Boolean) ?? 0));
const units: Unit[] = [
  ...C.BOOKS.map((b): Unit => ({ path: `campaign/book-${b.n}`, title: `The campaign, Book ${b.n}: ${b.title}`, line: GROVE, kind: 'campaign' })),
  { path: 'campaign/triggered', title: 'The campaign: triggered scenes', line: GROVE, kind: 'campaign' },
  { path: 'campaign/endings', title: 'The campaign: endings', line: GROVE, kind: 'campaign' },
  ...[...SIDE_1_22.map((q): [Quest[], Scene[]] => [[q], []]), ...S23_31].map(([qs, vs]): Unit => {
    const q = qs[0]!;
    const n = Number(q.code.slice(1));
    const vars = n <= 22 ? SIDE_1_22_VARIANTS.filter((v) => v.id.startsWith(`s${n}-`) || VARIANT_OWNER.some(([p, s]) => v.id.startsWith(p) && s === q.code)) : vs;
    return { path: `side/S${pad(n)}`, title: `Side story ${q.code}: ${q.title}`, line: GROVE, kind: 'quests', quests: qs, variants: vars, edu: `learning/side/S${pad(n)}`, opens: opensIn(q) };
  }).sort((a, b) => a.path.localeCompare(b.path)),
  ...([
    ['python', 'Monty Python (Q1–Q20)', C.QUESTS_PYTHON, C.QUESTS_PYTHON_VARIANTS], ['bean', 'Mr. Bean (Q21–Q30)', C.QUESTS_BEAN, C.QUESTS_BEAN_VARIANTS],
    ['sunny', "It's Always Sunny (Q31–Q45, adults only)", C.QUESTS_SUNNY, C.QUESTS_SUNNY_VARIANTS], ['avatar', 'Avatar: The Last Airbender (Q46–Q65)', C.QUESTS_AVATAR, []],
    ['alice', 'Alice in Wonderland (Q66–Q75)', C.QUESTS_ALICE, C.QUESTS_ALICE_VARIANTS], ['holmes', 'Sherlock Holmes (Q76–Q85)', C.QUESTS_HOLMES, C.QUESTS_HOLMES_VARIANTS],
    ['hodja', 'Nasreddin Hodja (Q86–Q95)', C.QUESTS_HODJA, C.QUESTS_HODJA_VARIANTS],
  ] as [string, string, Quest[], Scene[]][]).map(([f, t, qs, vs]): Unit => ({ path: `fun/${f}`, title: `Fun quests: ${t}`, line: 'Fun quests', kind: 'quests', quests: qs, variants: vs, edu: `learning/fun/${f}` })),
  { path: 'neopia/line', title: 'Neopia line (NP1–NP13)', line: 'Neopia', kind: 'quests', quests: C.NEOPIA_LINE, variants: C.NEOPIA_LINE_VARIANTS },
  { path: 'neopia/quests', title: 'Neopia quests (NQ1–NQ32)', line: 'Neopia', kind: 'quests', quests: C.NEOPIA_QUESTS, variants: C.NEOPIA_QUESTS_VARIANTS },
  ...([
    ['ironman', 'Iron Man (IM1–IM15)', C.MV_IRONMAN, C.MV_IRONMAN_VARIANTS], ['cap', 'Captain America (CA1–CA10)', C.MV_CAP, C.MV_CAP_VARIANTS],
    ['doom', 'Doom and the Fantastic Four (FF1–FF10)', C.MV_DOOM, C.MV_DOOM_VARIANTS], ['ultron', 'Ultron (UL1–UL10)', C.MV_ULTRON, C.MV_ULTRON_VARIANTS],
    ['moonknight', 'Moon Knight (MK1–MK8)', C.MV_MOONKNIGHT, C.MV_MOONKNIGHT_VARIANTS], ['spawn', 'Spawn (SP1–SP8)', C.MV_SPAWN, C.MV_SPAWN_VARIANTS],
    ['dragonball', 'Dragon Ball (DB1–DB20)', C.MV_DRAGONBALL, C.MV_DRAGONBALL_VARIANTS], ['toystory', 'Toy Story (TS1–TS12)', C.MV_TOYSTORY, C.MV_TOYSTORY_VARIANTS],
    ['endgames', 'Endgames (E1–E6)', C.MV_ENDGAMES, C.MV_ENDGAMES_VARIANTS],
  ] as [string, string, Quest[], Scene[]][]).map(([f, t, qs, vs]): Unit => ({ path: `multiverse/${f}`, title: `Multiverse: ${t}`, line: 'Multiverse', kind: 'quests', quests: qs, variants: vs })),
  ...([[C.EXPANSION_E1, C.EXPANSION_E1_VARIANTS], [C.EXPANSION_E2, C.EXPANSION_E2_VARIANTS], [C.EXPANSION_E3, C.EXPANSION_E3_VARIANTS]] as [Quest[], Scene[]][]).map(
    ([qs, vs], i): Unit => ({ path: `expansions/E${i + 1}`, title: `Expansion E${i + 1}: ${qs[0]!.title}`, line: 'Expansions', kind: 'quests', quests: qs, variants: vs }),
  ),
  ...STORYLINES.map(([f, halves]): Unit => ({ path: `storylines/${f}`, title: `Storyline ${halves[0]!.code}: ${halves.length > 1 ? halves[0]!.title.split(':')[0]! : halves[0]!.title}`, line: 'Storylines', kind: 'storyline' })),
  ...ATLAS.map(([qs, vs, name], i): Unit => ({ path: `atlas/A${pad(i + 1)}/main`, title: `Atlas, page A${i + 1}: ${name}`, line: 'Atlas', kind: 'quests', quests: qs, variants: vs, edu: `atlas/A${pad(i + 1)}` })),
  ...ARCADE.map(([qs, vs, name], i): Unit => ({ path: `arcade/PA${i + 1}/main`, title: `Pixel's Arcade, cartridge PA${i + 1}: ${name}`, line: "Pixel's Arcade", kind: 'quests', quests: qs, variants: vs, edu: `arcade/PA${i + 1}` })),
  { path: 'lines/LB/main', title: 'Learning Grove line LB: Play (LB1–LB12)', line: 'Learning Grove lines', kind: 'quests', quests: C.LINE_LB, variants: C.LINE_LB_VARIANTS, edu: 'lines/LB' },
  { path: 'lines/LK/main', title: 'Learning Grove line LK: Mouse-Deer (LK1–LK10)', line: 'Learning Grove lines', kind: 'quests', quests: C.LINE_LK, variants: C.LINE_LK_VARIANTS, edu: 'lines/LK' },
  { path: 'battles/main', title: 'Battles: the Grove Circuit, Play-fight Day and the story battles', line: 'Battles', kind: 'quests', quests: [], variants: [...C.BATTLES_PLAYDAY_VARIANTS, ...C.BATTLES_CIRCUIT_VARIANTS, ...C.BATTLES_STORY_VARIANTS, ...C.BATTLES_STORY_LOGGED], edu: 'battles' },
  { path: 'lines/lang-hebrew/main', title: "Ori's Alef-Bet, Hebrew (LH1–LH6)", line: 'Learning Grove lines', kind: 'quests', quests: C.LANG_HEBREW, variants: [], edu: 'lines/lang-hebrew' },
  { path: 'lines/lang-hebrew/words', title: '', line: 'Learning Grove lines', kind: 'other' },
  { path: 'lines/lang-japanese/main', title: "Hana's Hiragana, Japanese (LJ1–LJ6)", line: 'Learning Grove lines', kind: 'quests', quests: C.LANG_JAPANESE, variants: [], edu: 'lines/lang-japanese' },
  { path: 'lines/lang-japanese/words', title: '', line: 'Learning Grove lines', kind: 'other' },
  { path: 'extras/readers', title: 'Readers: fortune teller, doctor, Aunt Wen, Island Mystic, the kings', line: 'Extras', kind: 'other' },
  { path: 'extras/results', title: 'Result lines for every result screen and Neopia freebie', line: 'Extras', kind: 'other' },
];

// ---------------------------------------------------------------- scene rendering
const allQuests = units.flatMap((u) => u.quests ?? []);
const speakerNames = new Map<string, string>();
// A page may name-plate a campaign speaker for itself (A21's "Keeper Fern"); that stays on its page.
for (const q of allQuests) for (const sp of q.speakers) if (!SPEAKERS[sp.id] && !C.CAMPAIGN_SPEAKERS[sp.id]) speakerNames.set(sp.id, sp.name);
const nameIn = (cast: { id: string; name: string }[], who: string) => cast.find((s) => s.id === who)?.name ?? SPEAKERS[who]?.name ?? C.CAMPAIGN_SPEAKERS[who]?.name ?? who;
const CAMPAIGN_CAST = Object.entries(C.CAMPAIGN_SPEAKERS).map(([id, v]) => ({ id, name: v.name }));

function scene(cast: { id: string; name: string }[], s: Scene, title: string, parent?: string): string[] {
  const md: string[] = [`#### <a id="${s.id}"></a>${title} \`${s.id}\``, ''];
  if (parent) md.push(questWide.has(s.id) ? `_Variant within ${questWide.get(s.id)}; it has no single parent scene._` : `_Variant of \`${parent}\`._`, '');
  for (const l of s.lines) {
    const n = nameIn(cast, l.who);
    md.push(n ? `**${n}**${l.mood && l.mood !== 'neutral' ? ` _(${l.mood})_` : ''}: ${l.text}  ` : `_${l.text}_  `);
  }
  if (s.choices?.length) {
    md.push('', '**Choices**', '');
    for (const c of s.choices) {
      md.push(`- **${c.label}**${c.set ? ` — sets \`${JSON.stringify(c.set)}\`` : ''}`);
      for (const l of c.then ?? []) { const n = nameIn(cast, l.who); md.push(`    - ${n ? `**${n}**: ` : ''}${l.text}`); }
    }
  }
  if (s.set) md.push('', `Sets \`${JSON.stringify(s.set)}\``);
  md.push('');
  return md;
}

/** Book file (after splitting) of every main scene id, for the Learning Grove links. */
const fileOf = new Map<string, string>();
/** Main scene id → its play position and quest, for ordering and grouping Learning Grove scenes. */
const placeOf = new Map<string, { unit: Unit; pos: number; quest?: string }>();

/**
 * Variant parents: the longest hyphen prefix of the id that names a scene, a variant, a step or a
 * quest in the same storyline. A step stands for its scene; a variant that names only its quest
 * goes after the quest's complete scene, noted as belonging to the quest.
 */
const questWide = new Map<string, string>();
function variantTree(qs: Quest[], vs: Scene[], extraScenes: string[] = []) {
  const target = new Map<string, string>();
  const quests = new Map<string, Quest>();
  for (const id of extraScenes) target.set(id, id);
  for (const q of qs) {
    quests.set(q.id, q); quests.set(q.code.toLowerCase(), q);
    for (const st of q.steps) { target.set(st.id, st.scene.id); target.set(st.scene.id, st.scene.id); if (st.done) target.set(st.done.id, st.done.id); }
    target.set(q.complete.id, q.complete.id);
  }
  for (const v of vs) target.set(v.id, v.id);
  const children = new Map<string, Scene[]>();
  const loose: Scene[] = [];
  for (const v of vs) {
    let parent = PARENT[v.id];
    for (let p = v.id; !parent && p.includes('-'); ) {
      p = p.slice(0, p.lastIndexOf('-'));
      parent = target.get(p);
      const q = parent ? undefined : quests.get(p);
      if (q) { parent = q.complete.id; questWide.set(v.id, q.code); }
    }
    if (parent) children.set(parent, [...(children.get(parent) ?? []), v]); else loose.push(v);
  }
  return { children, loose };
}

function questUnit(u: Unit): string[] {
  const qs = sorted(u.quests!);
  const cast = qs.flatMap((q) => q.speakers);
  const { children, loose } = variantTree(qs, u.variants ?? []);
  const order: string[] = [];
  const md: string[] = [`# ${u.title}`, ''];
  let quest: string | undefined;
  const put = (s: Scene, title: string, parent?: string) => {
    md.push(...scene(cast, s, title, parent));
    order.push(s.id); placeOf.set(s.id, { unit: u, pos: placeOf.size, ...(quest ? { quest } : {}) });
    for (const v of children.get(s.id) ?? []) put(v, 'Variant', s.id);
  };
  for (const q of qs) {
    quest = q.id;
    md.push(`## ${q.code}. ${q.title}`, '', `*${q.source}* · audience: ${q.audience} · where: ${q.trigger.where} · when: ${q.trigger.when}${q.requires?.length ? ` · requires: ${q.requires.join(', ')}` : ''}`, '');
    if (q.speakers.length) md.push('**Cast:** ' + q.speakers.map((s) => `${s.name}${s.basedOn ? ` (${s.basedOn})` : ''}`).join(', '), '');
    q.steps.forEach((st, i) => {
      md.push(`### Step ${i + 1}: ${st.goal}`, '', `Hint: ${st.hint} · check: \`${st.check}\``, '');
      put(st.scene, 'Scene');
      if (st.done) put(st.done, 'Done');
    });
    md.push(`### Complete`, '');
    put(q.complete, 'Complete');
    md.push('**Rewards**', '', ...q.rewards.map((r) => `- ${r.label} (${r.kind}): ${r.description}`), '');
    if (q.sets) md.push(`Sets on completion: \`${JSON.stringify(q.sets)}\``, '');
    if (q.childLines && Object.keys(q.childLines).length) md.push('**Learning Grove swaps**', '', ...Object.entries(q.childLines).map(([k, v]) => `- \`${k}\` → ${v}`), '');
    if (q.notes) md.push('**Notes:** ' + q.notes, '');
  }
  quest = undefined;
  if (loose.length) {
    md.push('## Variant scenes', '', 'Variants with no parent scene in this storyline (Grove-side, campaign-side or shared scenes).', '');
    for (const v of loose) put(v, 'Variant');
  }
  return md;
}

function campaignUnit(u: Unit): string[] {
  const cast = CAMPAIGN_CAST;
  const put = (md: string[], s: Scene, title: string) => {
    md.push(...scene(cast, s, title));
    if (C.CAMPAIGN_NOTES[s.id]) md.push(`> ${C.CAMPAIGN_NOTES[s.id]}`, '');
    placeOf.set(s.id, { unit: u, pos: placeOf.size });
  };
  const byId = new Map(C.CAMPAIGN_SCENES.map((s) => [s.id, s]));
  const book = /book-(\d+)$/.exec(u.path);
  if (book) {
    const b = C.BOOKS.find((x) => x.n === Number(book[1]))!;
    const md: string[] = [`# Hazel's Grove: ${u.title}`, ''];
    for (const n of b.chapters) {
      const ch = C.CAMPAIGN_CHAPTERS.find((c) => c.n === n)!;
      md.push(`## Chapter ${n}: ${ch.title}`, '', `Goal: ${ch.goalText} (\`${ch.goal}\`) · Hint: ${ch.hint}`, '');
      const ids = [ch.opening, ...C.CAMPAIGN_SCENES.map((s) => s.id).filter((id) => id.startsWith(`c${n}-`) && id !== ch.opening && id !== ch.closing), ch.closing];
      for (const id of ids) { const s = byId.get(id); if (s && !placeOf.has(id)) put(md, s, id === ch.opening ? 'Opening' : id === ch.closing ? 'Closing' : 'Scene'); }
    }
    return md;
  }
  if (u.path.endsWith('triggered')) {
    const md = [`# Hazel's Grove: ${u.title}`, '', 'Scenes the rules queue by id rather than by chapter.', ''];
    for (const s of C.CAMPAIGN_SCENES.filter((s) => s.id.startsWith('t-'))) put(md, s, 'Scene');
    return md;
  }
  const md = [`# Hazel's Grove: ${u.title}`, '', ...Object.entries(C.CAMPAIGN_ENDINGS).map(([id, e]) => `- **${e.title}** (\`${id}\`): ${e.how}`), ''];
  for (const s of C.CAMPAIGN_SCENES.filter((s) => s.id.startsWith('end-'))) put(md, s, 'Ending scene');
  const rest = C.CAMPAIGN_SCENES.filter((s) => !placeOf.has(s.id));
  if (rest.length) { md.push('## Other scenes', ''); for (const s of rest) put(md, s, 'Scene'); }
  return md;
}

function storylineUnit(u: Unit): string[] {
  const halves = STORYLINES.find(([f]) => u.path === `storylines/${f}`)![1];
  const md: string[] = [`# ${u.title}`, ''];
  for (const sl of halves) {
    const cast = sl.speakers;
    const chapterScenes = sl.chapters.flatMap((ch) => [ch.opening.id, ...(ch.beats ?? []).map((b) => b.scene.id), ch.closing.id]);
    const { children, loose } = variantTree([], sl.extra, chapterScenes);
    const put = (s: Scene, title: string, parent?: string) => {
      md.push(...scene(cast, s, title, parent));
      placeOf.set(s.id, { unit: u, pos: placeOf.size });
      for (const v of children.get(s.id) ?? []) put(v, s.id.startsWith('end-') ? 'Ending scene' : 'Variant', s.id);
    };
    if (halves.length > 1) md.push(`## ${sl.title}`, '');
    md.push(`*${sl.tagline}* · ${sl.source} · audience: ${sl.audience} · save id: \`${sl.id}\``, '');
    if (sl.speakers.length) md.push('**Cast:** ' + sl.speakers.map((s) => `${s.name}${s.basedOn ? ` (${s.basedOn})` : ''}`).join(', '), '');
    for (const ch of sl.chapters) {
      md.push(`### Chapter ${ch.n}: ${ch.title}`, '', `Goal: ${ch.goalText} (\`${ch.goal}\`) · Hint: ${ch.hint}`, '');
      put(ch.opening, 'Opening');
      for (const b of ch.beats ?? []) { md.push(`When \`${b.when}\`:`, ''); put(b.scene, 'Beat'); }
      put(ch.closing, 'Closing');
    }
    md.push('### Endings', '', ...Object.entries(sl.endings).map(([id, e]) => `- **${e.title}** (\`${id}\`): ${e.how}`), '');
    for (const s of loose) put(s, s.id.startsWith('end-') ? 'Ending scene' : 'Scene');
    if (sl.notes) md.push('**Notes:** ' + sl.notes, '');
  }
  return md;
}

function otherUnit(u: Unit): string[] {
  if (u.path.endsWith('/words')) {
    const course = u.path.includes('hebrew') ? C.HEBREW_COURSE : C.JAPANESE_COURSE;
    return [`# ${course.title}: word list and script primer`, '', course.notes, '', '| Word | Plain | Roman | English | Say it | Topic | First taught | Band | Notes | Audio |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
      ...course.vocab.map((w) => `| ${w.native} | ${w.plain ?? ''} | ${w.roman} | ${w.english} | ${w.sayIt} | ${w.topic} | ${w.quest} | ${w.band} | ${w.notes ?? ''} | \`${w.audio}\` |`),
      '', `## ${course.script.name} (${course.script.direction})`, '', '| Character | Name | Sound | Alt | Notes |', '| --- | --- | --- | --- | --- |', ...course.script.chars.map((c) => `| ${c.char} | ${c.name} | ${c.roman} | ${c.alt ?? ''} | ${c.notes ?? ''} |`), ''];
  }
  if (u.path.endsWith('readers')) {
    const md = ['# Readers', ''];
    for (const r of C.READERS) md.push(`## ${r.name} (\`${r.id}\`)`, '', `Where: ${r.where}`, '', '**Intro**', '', ...r.intro.map((l) => `- ${l.text}`), '', '| When | Reading | Learning Grove |', '| --- | --- | --- |', ...r.readings.map((x) => `| \`${x.when}\` | ${x.text} | ${x.childText ?? ''} |`), '', '**Outro**', '', ...r.outro.map((l) => `- ${l.text}`), '');
    return md;
  }
  const md = ['# Result lines', ''];
  for (const s of C.RESULT_SETS) md.push(`## ${s.id}`, '', s.screen, '', '| When | Text | Learning Grove |', '| --- | --- | --- |', ...s.lines.map((x) => `| \`${x.when}\` | ${x.text} | ${x.childText ?? ''} |`), '');
  return md;
}

// ---------------------------------------------------------------- the Learning Grove
const who = (id: string) => speakerNames.get(id) ?? SPEAKERS[id]?.name ?? C.CAMPAIGN_SPEAKERS[id]?.name ?? id;
const eduLine = (l: Pick<Line, 'who' | 'text'>) => { const n = who(l.who); return n ? `**${n}**: ${l.text}  ` : `_${l.text}_  `; };
function eduScene(e: EduScene, from: string, parent?: string): string[] {
  const target = fileOf.get(e.of);
  const link = target ? ` · [main](${posix.relative(posix.dirname(from), target)}#${e.of})` : '';
  const md: string[] = [`#### \`${e.id}\`${link}`, ''];
  if (parent) md.push(`_Variant of \`${parent}\`._`, '');
  e.lines.forEach((l, i) => {
    md.push(eduLine(l));
    for (const les of e.lessons.filter((x) => x.after === i)) {
      md.push('', `> **Lesson** (${les.domain}${les.standard ? `, ${les.standard}` : ''}, ${les.kind}): ${les.skill}  `);
      for (const p of les.prompt ?? []) md.push(`> ${eduLine(p)}`);
      for (const p of les.lines ?? []) md.push(`> ${eduLine(p)}`);
      for (const o of les.options ?? []) md.push(`> - ${o.best ? '✅ ' : ''}${o.label} → ${o.reply.map((r) => r.text).join(' ')}`);
      if (les.check) md.push(`> Check: \`${les.check}\``);
      md.push(`> _For grown-ups: ${les.parentNote}_`, '');
    }
  });
  if (e.choices?.length) {
    md.push('', '**Choices**', '');
    for (const c of e.choices) {
      md.push(`- **${c.label}**`);
      for (const l of c.then ?? []) md.push(`    - ${who(l.who) ? `**${who(l.who)}**: ` : ''}${l.text}`);
    }
    if (e.defaultChoice) md.push(`- _(left out in this band; plays as \`${e.defaultChoice}\`)_`);
  }
  md.push('');
  return md;
}
const bandHead = (band: EduBand) => {
  const info = C.EDU_BAND_INFO[band];
  return `${info.label} (ages ${info.ages}${info.readAloud ? ', read aloud' : ''})`;
};
/** A Learning Grove storyline file: its quests in play order, each edu scene in its main scene's place. */
function eduUnit(u: Unit, band: EduBand, eqs: EduQuest[], vars: EduScene[], from: string): string[] {
  const md: string[] = [`# Learning Grove · ${bandHead(band)}: ${u.title}`, ''];
  const pos = (e: EduScene) => placeOf.get(e.of)?.pos ?? Number.MAX_SAFE_INTEGER;
  const qOrder = (eq: EduQuest) => sorted(u.quests!).findIndex((q) => q.id === eq.of);
  const all = [...eqs.flatMap((q) => q.scenes), ...vars];
  const seen = new Set<string>();
  const mainOf = new Map(all.map((e) => [e.of, e]));
  for (const eq of [...eqs].sort((a, b) => qOrder(a) - qOrder(b))) {
    const orig = u.quests!.find((q) => q.id === eq.of);
    md.push(`## ${orig?.code ?? ''}. ${eq.title ?? orig?.title ?? eq.of}`, '');
    for (const [sid, g] of Object.entries(eq.goals)) md.push(`- \`${sid}\`: ${g.goal} · _${g.hint}_`);
    md.push('');
    const mine = all.filter((e) => !seen.has(e.id) && placeOf.get(e.of)?.quest === eq.of).sort((a, b) => pos(a) - pos(b));
    for (const e of mine) { seen.add(e.id); md.push(...eduScene(e, from, parentOf(e.of, mainOf))); }
    if (eq.glossary?.length) md.push('### Glossary', '', ...eq.glossary.map((g) => `- **${g.word}**: ${g.meaning}`), '');
    if (eq.notes) md.push('**Notes:** ' + eq.notes, '');
  }
  const rest = all.filter((e) => !seen.has(e.id)).sort((a, b) => pos(a) - pos(b));
  if (rest.length) {
    md.push('## Variant scenes', '', 'Versions of the variants with no parent scene in this storyline.', '');
    for (const e of rest) md.push(...eduScene(e, from));
  }
  return md;
}
/** The parent named in the main book for a variant, when this band has a version of it. */
const variantParent = new Map<string, string>();
const parentOf = (of: string, present: Map<string, EduScene>) => { const p = variantParent.get(of); return p && present.has(p) ? p : undefined; };

// ---------------------------------------------------------------- files, splitting, the index
const files = new Map<string, string[]>();
/** Unit path → its book files after splitting, per band ('main' for the main script). */
const filesOf = new Map<string, Map<string, string[]>>();
function emit(u: Unit, band: string, path: string, md: string[]) {
  while (md.length && md[md.length - 1] === '') md.pop();
  const parts = split(md);
  const names = parts.length === 1 ? [`${path}.md`] : parts.map((_, i) => `${path}-${i + 1}.md`);
  parts.forEach((p, i) => files.set(names[i]!, p));
  if (!filesOf.has(u.path)) filesOf.set(u.path, new Map());
  filesOf.get(u.path)!.set(band, names);
  return names;
}
/** Splits at `##` headings (then `###`) so that no part runs past CAP lines; parts after the first repeat the title. */
function split(md: string[], level = 2, title = md[0]!): string[][] {
  if (md.length <= CAP || level > 3) return [md];
  const mark = '#'.repeat(level) + ' ';
  const starts = md.map((l, i) => (l.startsWith(mark) ? i : -1)).filter((i) => i > 0);
  if (!starts.length) return [md];
  const sections = [md.slice(0, starts[0]), ...starts.map((s, i) => md.slice(s, starts[i + 1] ?? md.length))];
  const parts: string[][] = [];
  let cur: string[] = [];
  for (const sec of sections) {
    if (cur.length > 2 && cur.length + sec.length > CAP) { parts.push(cur); cur = [`${title} (continued)`, '']; }
    cur.push(...sec);
  }
  parts.push(cur);
  return parts.flatMap((p) => split(p, level + 1, title));
}

// Main scripts first, so the Learning Grove files can link to them.
for (const u of units) {
  const md = u.kind === 'quests' ? questUnit(u) : u.kind === 'campaign' ? campaignUnit(u) : u.kind === 'storyline' ? storylineUnit(u) : otherUnit(u);
  emit(u, 'main', u.path, md);
}
for (const [f, md] of files) for (const l of md) { const id = /^#### <a id="([^"]+)">/.exec(l)?.[1]; if (id && !fileOf.has(id)) fileOf.set(id, f); }
for (const u of units) {
  if (u.kind !== 'quests') continue;
  const { children } = variantTree(u.quests!, u.variants ?? []);
  for (const [p, vs] of children) for (const v of vs) variantParent.set(v.id, p);
}
const learningCampaign: Unit = { path: 'learning/campaign', title: 'the campaign', line: 'Learning Grove', kind: 'other' };
for (const band of C.EDU_BANDS) {
  const from = `learning/campaign/${band}.md`;
  const md: string[] = [`# Learning Grove · ${bandHead(band)}: the campaign`, ''];
  for (const c of C.EDU_CAMPAIGN[band]) {
    md.push(`## ${c.id}`, '');
    for (const [n, ch] of Object.entries(c.chapters)) md.push(`- Chapter ${n}${ch.title ? ` (${ch.title})` : ''}: ${ch.goalText} · ${ch.hint}`);
    md.push('');
    for (const e of c.scenes) md.push(...eduScene(e, from));
    if (c.endings) md.push('### Endings', '', ...Object.entries(c.endings).map(([id, e]) => `- **${e.title}** (\`${id}\`): ${e.how}`), '');
    if (c.glossary?.length) md.push('### Glossary', '', ...c.glossary.map((g) => `- **${g.word}**: ${g.meaning}`), '');
  }
  emit(learningCampaign, band, `learning/campaign/${band}`, md);
  for (const u of units.filter((x) => x.edu)) {
    const ids = new Set(u.quests!.map((q) => q.id));
    const eqs = C.EDU_QUESTS[band].filter((q) => ids.has(q.of));
    const vars = C.EDU_VARIANTS[band].filter((e) => placeOf.get(e.of)?.unit === u);
    if (!eqs.length && !vars.length) continue;
    emit(u, band, `${u.edu}/${band}`, eduUnit(u, band, eqs, vars, `${u.edu}/${band}.md`));
  }
  const homeless = C.EDU_VARIANTS[band].filter((e) => !placeOf.get(e.of)?.unit.edu);
  const strays = C.EDU_QUESTS[band].filter((q) => !allQuests.some((x) => x.id === q.of));
  if (homeless.length || strays.length) throw new Error(`${band}: Learning Grove scenes with no storyline: ${[...homeless.map((e) => e.id), ...strays.map((q) => q.id)].join(', ')}`);
}

// Source locations: `id: '<id>'` where a scene is written out; for builder-made Learning Grove scenes,
// the first quoted original id in that band's files.
const SRC = 'src/content';
const srcLines = readdirSync(SRC).filter((f) => f.endsWith('.ts')).sort().map((f) => [f, readFileSync(join(SRC, f), 'utf8').split('\n')] as const);
const declared = new Map<string, string>();
const quoted = new Map<string, string[]>();
const templated = new Map<string, string>();
for (const [f, ls] of srcLines) ls.forEach((l, i) => {
  for (const m of l.matchAll(/(id:\s*)?['"`]([a-z0-9][\w:.-]*)['"`]/g)) {
    const at = `${SRC}/${f}:${i + 1}`;
    if (m[1] && !declared.has(m[2]!)) declared.set(m[2]!, at);
    if (!quoted.has(m[2]!)) quoted.set(m[2]!, []);
    quoted.get(m[2]!)!.push(at);
  }
  // Ids built from a template (`s10-foot-${tag}`): the template's line.
  for (const m of l.matchAll(/`([a-z0-9][\w:.-]*-)\$\{/g)) if (!templated.has(m[1]!)) templated.set(m[1]!, `${SRC}/${f}:${i + 1}`);
});
/** An id built by code: the template that spells it, else the last quote of its base id (the builder call). */
const builtFrom = (id: string, ok: (at: string) => boolean) => {
  for (let p = id; p.includes('-'); ) { p = p.slice(0, p.lastIndexOf('-')); const t = templated.get(`${p}-`); if (t && ok(t)) return t; }
  for (let p = id; p.includes('-'); ) { p = p.slice(0, p.lastIndexOf('-')); const q = quoted.get(p)?.filter(ok); if (q?.length) return q[q.length - 1]!; }
  return '-';
};
const srcOf = (id: string) => {
  if (declared.has(id)) return declared.get(id)!;
  const edu = /^(sprout|reader):(.+)$/.exec(id);
  if (!edu) { const ok = (at: string) => !at.includes('/edu-'); return quoted.get(id)?.find(ok) ?? builtFrom(id, ok); }
  const ok = (at: string) => /\/(edu|lines)-/.test(at) && (at.includes(`-${edu[1]}`) || at.includes('/lines-'));
  return quoted.get(edu[2]!)?.find(ok) ?? builtFrom(edu[2]!, ok);
};
const tsv = ['scene\tbook\tsrc'];
const order = [...files.keys()];
for (const f of order) files.get(f)!.forEach((l, i) => { const id = /^#### (?:<a id="[^"]+"><\/a>)?[^`]*`([^`]+)`/.exec(l)?.[1]; if (id) tsv.push(`${id}\t${f}:${i + 1}\t${srcOf(id)}`); });

// The index: every storyline by line, its files and their lengths.
const link = (f: string) => `[${posix.basename(f)}](${f}) (${files.get(f)!.length})`;
const cell = (u: Unit | undefined, band: string) => (u && filesOf.get(u.path)?.get(band)?.map(link).join(', ')) || '';
const readme = [
  '# Grove script book', '',
  'Generated from `src/content/` by `tests/tools/script-book.ts`; never edit by hand. Rerun it after any content change and check with `--check`.', '',
  `One storyline per file, scenes in play order. Variants sit under their parent scene ("Variant of …"); variants with no parent close their storyline's file. Learning Grove versions are separate files, one per band, each scene linking to its main scene. No file runs past ${CAP} lines; longer ones split at their \`##\` headings into \`-1\`, \`-2\`. Each file is one review unit (\`docs/story-review/LOG.md\`).`, '',
  '`ids.tsv` maps every scene id to its book file:line and its source file:line. Line counts are in brackets.', '',
  'For one file per line to read straight through (gitignored): `npx tsx tests/tools/script-book.ts --whole script-book-whole`.', '',
];
const lines = [...new Set(units.map((u) => u.line))];
for (const line of lines) {
  const us = units.filter((u) => u.line === line);
  const hasEdu = us.some((u) => u.edu) || line === GROVE;
  readme.push(`## ${line}`, '', hasEdu ? '| Storyline | Script | Little Sprouts | Grove Readers |' : '| Storyline | Script |', hasEdu ? '| --- | --- | --- | --- |' : '| --- | --- |');
  for (const u of us) {
    const name = (u.title || (u.path.includes('hebrew') ? "Ori's Alef-Bet: word list and script primer" : "Hana's Hiragana: word list and script primer")) + (u.opens !== undefined ? ` · opens ${u.opens ? `in chapter ${u.opens}` : 'post-game'}` : '');
    readme.push(hasEdu ? `| ${name} | ${cell(u, 'main')} | ${cell(u, 'sprout')} | ${cell(u, 'reader')} |` : `| ${name} | ${cell(u, 'main')} |`);
  }
  if (line === GROVE) readme.push(`| Learning Grove: the campaign | | ${cell(learningCampaign, 'sprout')} | ${cell(learningCampaign, 'reader')} |`);
  readme.push('');
}

// ---------------------------------------------------------------- write
const writeOut = (root: string, rel: string, text: string) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
if (out === BOOK && existsSync(BOOK)) rmSync(BOOK, { recursive: true, force: true });
for (const [f, md] of files) writeOut(out, f, md.join('\n') + '\n');
writeOut(out, 'ids.tsv', tsv.join('\n') + '\n');
writeOut(out, 'README.md', readme.join('\n'));

// ---------------------------------------------------------------- --whole: one read-through per line
if (whole) {
  const book = (title: string, intro: string, parts: string[][]): string => {
    const toc = parts.map((p) => p[0]!.replace(/^# /, '')).map((t, i) => `${i + 1}. [${t}](#part-${i + 1})`);
    const body = parts.flatMap((p, i) => ['', `<a id="part-${i + 1}"></a>`, '', ...p.map((l) => (/^#{1,5} /.test(l) ? `#${l}` : l))]);
    return [`# ${title}`, '', intro, '', '## Contents', '', ...toc, ...body, ''].join('\n');
  };
  const mainOf = (u: Unit) => (filesOf.get(u.path)?.get('main') ?? []).map((f) => files.get(f)!);
  const bandOf = (u: Unit, band: string) => (filesOf.get(u.path)?.get(band) ?? []).map((f) => files.get(f)!);
  // Hazel's Grove: the campaign, each side story after the chapter it opens in, the post-game last.
  const grove = units.filter((u) => u.line === GROVE);
  const sides = grove.filter((u) => u.opens !== undefined);
  const parts: string[][] = [];
  for (const u of grove.filter((x) => x.path.startsWith('campaign/book-'))) {
    const md = mainOf(u)[0]!;
    const chapters = md.map((l, i) => (/^## Chapter (\d+)/.test(l) ? i : -1)).filter((i) => i >= 0);
    parts.push(md.slice(0, chapters[0]));
    chapters.forEach((s, i) => {
      const n = Number(/^## Chapter (\d+)/.exec(md[s]!)![1]);
      parts.push([`# ${md[s]!.slice(3)}`, '', ...md.slice(s + 1, chapters[i + 1] ?? md.length)]);
      for (const sd of sides.filter((x) => x.opens === n)) parts.push(...mainOf(sd));
    });
  }
  for (const u of grove.filter((x) => !x.path.startsWith('campaign/book-') && x.opens === undefined)) parts.push(...mainOf(u));
  for (const sd of sides.filter((x) => !x.opens)) parts.push(...mainOf(sd));
  const books: [string, string, string, string[][]][] = [
    ['hazels-grove', GROVE, 'The campaign in play order, with each side story placed after the chapter it opens in and the post-game stories last.', parts.filter((p) => p.length)],
    ...lines.filter((l) => l !== GROVE).map((l): [string, string, string, string[][]] => [l.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''), l, `Every ${l} storyline in play order.`, units.filter((u) => u.line === l).flatMap(mainOf)]),
    ...C.EDU_BANDS.map((band): [string, string, string, string[][]] => [`learning-grove-${band}`, `Learning Grove · ${bandHead(band)}`, 'The campaign, then every storyline with a version in this band, in book order.', [learningCampaign, ...units].flatMap((u) => bandOf(u, band))]),
  ];
  mkdirSync(whole, { recursive: true });
  for (const [f, title, intro, ps] of books) writeFileSync(join(whole, `${f}.md`), book(title, intro, ps));
  console.log(`--whole: ${books.length} read-throughs in ${whole}/`);
}

if (check) {
  // Every file in either tree, by '/'-separated path relative to its root.
  const walk = (root: string, dir = ''): string[] =>
    readdirSync(join(root, dir)).flatMap((f) => (statSync(join(root, dir, f)).isDirectory() ? walk(root, `${dir}${f}/`) : [`${dir}${f}`]));
  const fresh = new Set(walk(out));
  const committed = new Set(existsSync(BOOK) ? walk(BOOK) : []);
  const drift = [...new Set([...fresh, ...committed])].sort().filter((f) => !fresh.has(f) || !committed.has(f) || !readFileSync(join(out, f)).equals(readFileSync(join(BOOK, f))));
  rmSync(out, { recursive: true, force: true });
  for (const f of drift) console.log(`${!committed.has(f) ? 'missing' : !fresh.has(f) ? 'stale  ' : 'changed'}  ${BOOK}/${f}`);
  console.log(drift.length ? `script-book: ${drift.length} file(s) out of date; run npx tsx tests/tools/script-book.ts` : 'script-book: in sync');
  if (drift.length) process.exit(1);
}
