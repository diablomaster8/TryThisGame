import { readFileSync, readdirSync, statSync } from 'node:fs';
import { REACT_INFER } from '../../src/config/story-react';
import * as C from '../../src/content/index';
import { OUTER_PROPS } from '../../src/config/outer-ring';
import { SPEAKERS } from '../../src/config/story';
import { speakerNameIn } from '../../src/sim/story-scenes';
import type { Quest } from '../../src/content/types';
import type { Scene } from '../../src/config/story';
import { STORY_NPC_LOOKS, STORY_ONLY_LOOKS, storyId } from '../../src/config/npc-looks';
import { TRAINERS, type TrainerLook } from '../../src/sim/trainers';
import { BEETLE_SPEAKERS } from '../../src/content/storyline-beetle';
import { DAWNDUSK_SPEAKERS } from '../../src/content/storyline-dawndusk';
import { HUNDRED_SPEAKERS } from '../../src/content/storyline-hundred';
import { LOGGED_SPEAKERS } from '../../src/content/storyline-logged';
import { packs } from './quest-packs';
import { areaOf } from '../../src/content/where-map';
import { REGIONS, STORY_AREAS } from '../../src/config/regions';
import { comedyReport } from './comedy-report';

const problems: string[] = [];
const questIds = new Set<string>(),
  sceneIds = new Map<string, string>(),
  codes = new Set<string>();
let quests = 0,
  scenes = 0,
  lines = 0,
  words = 0,
  long = 0,
  choices = 0;
const allQuests: Quest[] = Object.values(packs).flat();
for (const q of allQuests) codes.add(q.code);
const variantById = new Map<string, Scene>();
for (const [k, v] of Object.entries(C))
  if (/VARIANTS$/.test(k) && Array.isArray(v))
    for (const sc of v as Scene[])
      if (sc && typeof sc === 'object' && 'lines' in sc) variantById.set(sc.id, sc);
const scenesOf = (q: Quest): Scene[] => [
  ...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]),
  q.complete,
];
for (const [pack, list] of Object.entries(packs)) {
  for (const q of list) {
    quests++;
    if (questIds.has(q.id)) problems.push(`dup quest id ${q.id}`);
    questIds.add(q.id);
    const declared = new Set([
      ...Object.keys(SPEAKERS),
      ...Object.keys(C.CAMPAIGN_SPEAKERS),
      ...q.speakers.map((s) => s.id),
    ]);
    const sc = scenesOf(q);
    const byId = new Map(sc.map((s) => [s.id, s]));
    for (const s of sc) {
      scenes++;
      if (sceneIds.has(s.id))
        problems.push(`dup scene id ${s.id} (${pack}, also ${sceneIds.get(s.id)})`);
      sceneIds.set(s.id, pack);
      const all = [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])];
      choices += s.choices?.length ?? 0;
      for (const l of all) {
        lines++;
        words += l.text.split(/\s+/).length;
        if (l.text.length > 160) long++;
        if (!declared.has(l.who)) problems.push(`${q.id}: undeclared speaker ${l.who}`);
      }
    }
    for (const k of Object.keys(q.childLines ?? {})) {
      const [sid, idx] = k.split('#');
      const s = byId.get(sid!) ?? variantById.get(sid!);
      if (!s || Number(idx) >= s.lines.length) problems.push(`${q.id}: bad childLines key ${k}`);
    }
    for (const r of q.requires ?? [])
      if (!codes.has(r) && !/^(mv-|np|q|s\d|rift|flag)/i.test(r))
        problems.push(`${q.id}: requires unknown ${r}`);
  }
}
// ---- campaign
const campIds = new Set<string>();
const campSpeakers = new Set([...Object.keys(SPEAKERS), ...Object.keys(C.CAMPAIGN_SPEAKERS)]);
// Every `who` must reach a name plate, the way the dialogue box finds one: SPEAKERS, then
// the quest that owns the scene, its family (`a13`, `s24`), then any quest (speakerNameIn).
const questOfScene = new Map<string, Quest>();
for (const q of allQuests)
  for (const s of scenesOf(q)) if (!questOfScene.has(s.id)) questOfScene.set(s.id, q);
const mapped = (sceneId: string, who: string): boolean =>
  campSpeakers.has(who) ||
  speakerNameIn(allQuests, sceneId, who, questOfScene.get(sceneId)) !== undefined;
for (const v of variantById.values()) {
  for (const l of [...v.lines, ...(v.choices ?? []).flatMap((c) => c.then ?? [])])
    if (!mapped(v.id, l.who)) problems.push(`variant ${v.id}: unmapped speaker ${l.who}`);
}
// K7: a line's canned gesture (render only) is one of five.
const GESTURES = new Set<string>(['nod', 'shrug', 'point', 'down', 'chest']);
for (const v of variantById.values())
  for (const l of [...v.lines, ...(v.choices ?? []).flatMap((c) => c.then ?? [])])
    if (l.gesture !== undefined && !GESTURES.has(l.gesture))
      problems.push(`variant ${v.id}: unknown gesture ${String(l.gesture)}`);
let campLines = 0,
  campWords = 0;
for (const s of C.CAMPAIGN_SCENES) {
  if (campIds.has(s.id) || sceneIds.has(s.id)) problems.push(`campaign: dup scene id ${s.id}`);
  campIds.add(s.id);
  if (!C.CAMPAIGN_NOTES[s.id] && !/^c\d+-(open|close)$|^t-|^end-/.test(s.id))
    problems.push(`campaign: no note for ${s.id}`);
  for (const l of [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])]) {
    campLines++;
    campWords += l.text.split(/\s+/).length;
    if (l.text.length > 160) long++;
    if (!campSpeakers.has(l.who)) problems.push(`campaign ${s.id}: undeclared speaker ${l.who}`);
    if (l.gesture !== undefined && !GESTURES.has(l.gesture))
      problems.push(`campaign ${s.id}: unknown gesture ${String(l.gesture)}`);
  }
}
for (const v of [
  ...C.SIDE_STORIES_MAIN_VARIANTS,
  ...C.SIDE_STORIES_NEW_3_VARIANTS,
  ...C.SIDE_STORIES_FUN_2_VARIANTS,
]) {
  if (campIds.has(v.id)) problems.push(`variant id clashes with campaign ${v.id}`);
}
for (const v of C.SIDE_STORIES_MAIN_VARIANTS)
  if (sceneIds.has(v.id) && !v.id.startsWith('s')) problems.push(`variant clash ${v.id}`);
const NEW_VARIANTS = [
  ...C.QUESTS_PYTHON_VARIANTS,
  ...C.QUESTS_BEAN_VARIANTS,
  ...C.QUESTS_SUNNY_VARIANTS,
  ...C.SIDE_STORY_S23_VARIANTS,
  ...C.SIDE_STORY_S24_VARIANTS,
  ...C.SIDE_STORY_S25_VARIANTS,
  ...C.SIDE_STORY_S26_VARIANTS,
  ...C.SIDE_STORY_S27_VARIANTS,
  ...C.SIDE_STORY_S28_VARIANTS,
  ...C.SIDE_STORY_S29_VARIANTS,
  ...C.SIDE_STORY_S30_VARIANTS,
  ...C.SIDE_STORY_S31_VARIANTS,
  ...C.ATLAS_A01_VARIANTS,
  ...C.BATTLES_CIRCUIT_VARIANTS,
  ...C.BATTLES_PLAYDAY_VARIANTS,
  ...C.BATTLES_STORY_VARIANTS,
  ...C.ATLAS_A02_VARIANTS,
  ...C.ATLAS_A03_VARIANTS,
  ...C.ATLAS_A04_VARIANTS,
  ...C.ATLAS_A05_VARIANTS,
  ...C.A06_VARIANTS,
  ...C.ATLAS_A07_VARIANTS,
  ...C.ATLAS_A08_VARIANTS,
  ...C.ATLAS_A09_VARIANTS,
  ...C.A10_VARIANTS,
  ...C.A11_VARIANTS,
  ...C.A12_VARIANTS,
  ...C.A13_VARIANTS,
  ...C.A14_VARIANTS,
  ...C.ATLAS_A15_VARIANTS,
  ...C.ATLAS_A16_VARIANTS,
  ...C.A17_VARIANTS,
  ...C.ATLAS_A18_VARIANTS,
  ...C.A19_VARIANTS,
  ...C.ATLAS_A20_VARIANTS,
  ...C.A21_VARIANTS,
  ...C.A22_VARIANTS,
  ...C.A23_VARIANTS,
  ...C.ATLAS_A24_VARIANTS,
  ...C.ATLAS_A25_VARIANTS,
  ...C.A26_VARIANTS,
  ...C.ATLAS_A27_VARIANTS,
  ...C.ATLAS_A28_VARIANTS,
  ...C.ATLAS_A29_VARIANTS,
  ...C.ATLAS_A30_VARIANTS,
  ...C.A31_VARIANTS,
  ...C.PA1_VARIANTS,
  ...C.ARCADE_PA2_VARIANTS,
  ...C.PA3_VARIANTS,
  ...C.ARCADE_PA4_VARIANTS,
  ...C.PA5_VARIANTS,
  ...C.LINE_LB_VARIANTS,
  ...C.LINE_LK_VARIANTS,
  ...C.EXPANSION_E1_VARIANTS,
  ...C.EXPANSION_E2_VARIANTS,
  ...C.EXPANSION_E3_VARIANTS,
  ...C.NEOPIA_LINE_VARIANTS,
  ...C.NEOPIA_QUESTS_VARIANTS,
  ...C.MV_IRONMAN_VARIANTS,
  ...C.MV_CAP_VARIANTS,
  ...C.MV_DOOM_VARIANTS,
  ...C.MV_ULTRON_VARIANTS,
  ...C.MV_MOONKNIGHT_VARIANTS,
  ...C.MV_SPAWN_VARIANTS,
  ...C.MV_DRAGONBALL_VARIANTS,
  ...C.MV_TOYSTORY_VARIANTS,
  ...C.MV_ENDGAMES_VARIANTS,
];
for (const v of NEW_VARIANTS) {
  if (campIds.has(v.id) && !/^(c\d+|end)-/.test(v.id))
    problems.push(`new variant id clashes with campaign ${v.id}`);
  if (sceneIds.has(v.id)) problems.push(`new variant id clashes with a quest scene ${v.id}`);
}
{
  const seenV = new Set<string>();
  for (const v of NEW_VARIANTS) {
    if (seenV.has(v.id)) problems.push(`dup new variant ${v.id}`);
    seenV.add(v.id);
  }
}

const ns = C.CAMPAIGN_CHAPTERS.map((c) => c.n).join(',');
if (ns !== '1,2,3,4,5,6,7,8,9,10,11,12') problems.push(`campaign: chapters ${ns}`);
for (const c of C.CAMPAIGN_CHAPTERS)
  for (const id of [c.opening, c.closing])
    if (!campIds.has(id)) problems.push(`campaign: ch${c.n} missing scene ${id}`);
// R0319 (FUN-30): the goal chip stays within two lines on a phone.
for (const c of C.CAMPAIGN_CHAPTERS) {
  if (c.goalText.length > 60) problems.push(`chip: ch${c.n} goalText over 60 characters`);
  if (c.hint.length > 70) problems.push(`chip: ch${c.n} hint over 70 characters`);
  for (const s of c.howTo ?? [])
    if (s.text.length > 40) problems.push(`chip: ch${c.n} howTo step over 40: ${s.text}`);
}
const endIds = [
  'hazels-grove',
  'eternal-dawn',
  'shadow-keeper',
  'moss-sleeps',
  'wild-grove',
  'empty-lantern',
  'collector',
  'long-road',
];
for (const e of endIds) {
  if (!C.CAMPAIGN_ENDINGS[e]) problems.push(`campaign: ending text missing ${e}`);
  if (!campIds.has(`end-${e}`)) problems.push(`campaign: ending scene missing end-${e}`);
}
// flags that cross files must be declared somewhere
const declaredFlags = new Set([
  ...C.CAMPAIGN_FLAGS,
  ...C.SIDE_STORIES_MAIN_FLAGS,
  ...C.SIDE_STORIES_NEW_3_FLAGS,
]);
for (const f of [
  'wisp',
  'corvinGate',
  'hazel',
  'walk',
  's8Reunited',
  's9Started',
  'millLetter',
  'cinder',
  'keptStone',
  'stoneBearer',
  'stoneUnmadeBy',
  'mossReturned',
  'corvin',
])
  if (!declaredFlags.has(f)) problems.push(`flag not declared in any FLAGS list: ${f}`);
console.log(JSON.stringify({ campaignScenes: campIds.size, campLines, campWords }));
// ---- educational versions (the Learning Grove language switch)
const styleMd = readFileSync(
  new URL('../../src/content/EDU-STYLE.md', import.meta.url),
  'utf8',
).replace(/\n\s*/g, ' ');
const approved = new Set<string>();
for (const m of styleMd.matchAll(/`((?:ELOF|CASEL): [^`]+)`/g)) approved.add(m[1]!);
for (const m of styleMd.matchAll(/`(D2\.[^`]+)`/g)) approved.add(m[1]!);
for (const m of styleMd.matchAll(/\| ([A-Z0-9][A-Za-z0-9.-]+) \|/g)) approved.add(m[1]!);
const mainScenes = new Map<string, Scene>();
for (const s of C.CAMPAIGN_SCENES) mainScenes.set(s.id, s);
const eduPacks = {
  sideMain: 1,
  sideFun: 1,
  sideFun2: 1,
  new1: 1,
  new2: 1,
  new3: 1,
  new4: 1,
  python: 1,
  bean: 1,
  avatar: 1,
  langHe: 1,
  langJa: 1,
  lb: 1,
  lk: 1,
  s24: 1,
  s25: 1,
  s26: 1,
  s27: 1,
  s28: 1,
  s29: 1,
  s30: 1,
  s31: 1,
  a02: 1,
  a05: 1,
  a06: 1,
  a07: 1,
  a08: 1,
  a09: 1,
  a10: 1,
  a11: 1,
  a12: 1,
  a13: 1,
  a14: 1,
  a15: 1,
  a16: 1,
  a17: 1,
  a18: 1,
  a19: 1,
  a20: 1,
  a22: 1,
  a23: 1,
  a24: 1,
  a25: 1,
  a26: 1,
  a27: 1,
  a28: 1,
  a29: 1,
  a30: 1,
  a31: 1,
  pa1: 1,
} as const;
for (const k of Object.keys(eduPacks))
  for (const q of packs[k]!) for (const s of scenesOf(q)) mainScenes.set(s.id, s);
// only audience 'all' reaches the Learning Grove; 'main', 'teen' and 'adult' never do
// Intentional partial Learning Grove coverage (per the storyline outlines): a16 has no sprout version and its reader
// version stops at the well (A16-16, A16-17, their variants and the a16-grove-* scenes); a23 has no edu version of
// its main-audience quests A23-8 and A23-15; a25 is reader-only and covers Part One only (A25-1 to A25-14 and variant
// a25-13-empress-ash), so A25-15 onward, a25-margin-hazel and a25-grove-ember are left out; a29 is reader-only (every scene).
const eduExempt = (band: string, id: string): boolean =>
  /^a23-(08|15)(-|$)/.test(id) ||
  (band === 'sprout' &&
    /^(c5-sold|c9-shard-collector|c10-kept|c11-moss-kept|c11-cold-hands|end-collector-sold|end-collector-kept|end-epi-wisp-kept)$/.test(
      id,
    )) ||
  (band === 'sprout' && /^(a16|a25|a29)-/.test(id)) ||
  // Little Sprouts' PA1 gate always opens, so the locked-gate scenes never play there.
  (band === 'sprout' && /^pa1-(17-chao-locked|18-last-locked(-stood)?)$/.test(id)) ||
  (band === 'reader' &&
    (/^a16-(16|17)(-|$)|^a16-grove-/.test(id) ||
      /^a25-(1[5-9]|[2-9]\d)(-|$)|^a25-(margin-hazel|grove-ember)(-|$)/.test(id)));
for (const k of Object.keys(eduPacks))
  for (const q of packs[k]!)
    if (q.audience !== 'all')
      if (!eduExempt('reader', q.id))
        problems.push(`${q.id}: audience ${q.audience} in a Learning Grove pack`);
for (const s of [
  ...C.SIDE_STORIES_MAIN_VARIANTS,
  ...C.SIDE_STORIES_NEW_3_VARIANTS,
  ...C.SIDE_STORIES_FUN_2_VARIANTS,
  ...C.QUESTS_PYTHON_VARIANTS,
  ...C.QUESTS_BEAN_VARIANTS,
  ...C.LINE_LB_VARIANTS,
  ...C.LINE_LK_VARIANTS,
  ...C.SIDE_STORY_S24_VARIANTS,
  ...C.SIDE_STORY_S25_VARIANTS,
  ...C.SIDE_STORY_S26_VARIANTS,
  ...C.SIDE_STORY_S27_VARIANTS,
  ...C.SIDE_STORY_S28_VARIANTS,
  ...C.SIDE_STORY_S29_VARIANTS,
  ...C.SIDE_STORY_S30_VARIANTS,
  ...C.SIDE_STORY_S31_VARIANTS,
  ...C.ATLAS_A02_VARIANTS,
  ...C.ATLAS_A05_VARIANTS,
  ...C.A06_VARIANTS,
  ...C.ATLAS_A07_VARIANTS,
  ...C.ATLAS_A08_VARIANTS,
  ...C.ATLAS_A09_VARIANTS,
  ...C.A10_VARIANTS,
  ...C.A11_VARIANTS,
  ...C.A12_VARIANTS,
  ...C.A13_VARIANTS,
  ...C.A14_VARIANTS,
  ...C.ATLAS_A15_VARIANTS,
  ...C.ATLAS_A16_VARIANTS,
  ...C.A17_VARIANTS,
  ...C.ATLAS_A18_VARIANTS,
  ...C.A19_VARIANTS,
  ...C.ATLAS_A20_VARIANTS,
  ...C.A22_VARIANTS,
  ...C.A23_VARIANTS,
  ...C.ATLAS_A24_VARIANTS,
  ...C.ATLAS_A25_VARIANTS,
  ...C.A26_VARIANTS,
  ...C.ATLAS_A27_VARIANTS,
  ...C.ATLAS_A28_VARIANTS,
  ...C.ATLAS_A29_VARIANTS,
  ...C.ATLAS_A30_VARIANTS,
  ...C.A31_VARIANTS,
  ...C.PA1_VARIANTS,
  ...C.BATTLES_PLAYDAY_VARIANTS,
])
  mainScenes.set(s.id, s);
// maths: a maths lesson's right answer must use a number that the scene's narration or question gives (SR-20261023-525).
const maWords: Record<string, string> = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  twenty: '20',
  thirty: '30',
  forty: '40',
  fifty: '50',
  hundred: '100',
};
const maNums = (t: string): string[] =>
  [
    ...t
      .toLowerCase()
      .replace(/(\d),(?=\d{3}\b)/g, '$1')
      .matchAll(
        /\d+(?:\.\d+)?|\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred)\b/g,
      ),
  ].map((m) => maWords[m[0]] ?? m[0]);
const mathsWarn: string[] = [];
const mathsCheck = (
  sceneId: string,
  e: {
    lines: { text: string }[];
    choices?: { then?: { text: string }[] }[];
    lessons: { prompt?: { text: string }[]; lines?: { text: string }[] }[];
  },
  l: { id: string; options?: { label: string; best?: boolean }[] },
): void => {
  const best = l.options?.find((o) => o.best);
  if (!best) return;
  const want = maNums(best.label);
  if (!want.length) return;
  const scene = new Set(
    [
      ...e.lines,
      ...(e.choices ?? []).flatMap((c) => c.then ?? []),
      ...e.lessons.flatMap((x) => [...(x.prompt ?? []), ...(x.lines ?? [])]),
    ].flatMap((x) => maNums(x.text)),
  );
  // The answer may be a given number, or a sum, difference, product or quotient of two given numbers.
  const given = [...scene].map(Number);
  const derived = new Set<number>(given);
  for (const x of given)
    for (const y of given) {
      derived.add(x + y);
      derived.add(Math.abs(x - y));
      derived.add(x * y);
      if (y) derived.add(x / y);
    }
  // Two-step answers: combine any derived value with a third given number (e.g. 3 x 4 + 2, or 100 - 2 x 8).
  for (const d of [...derived])
    for (const z of given) {
      derived.add(d + z);
      derived.add(Math.abs(d - z));
      derived.add(d * z);
      if (z) derived.add(d / z);
    }
  if (want.some((n) => !derived.has(Number(n))))
    mathsWarn.push(
      `maths: ${sceneId} ${l.id}: right answer "${best.label}" is not in the scene text`,
    );
};
// A lesson must grow out of story the child has already read (SR-20261027-1305): one that
// quotes (in “…”) a scene line it plays before is flagged. `after` is the last line read.
const aheadWarn: string[] = [];
const aheadCheck = (
  sceneId: string,
  sceneLines: { text: string }[],
  l: { id: string; after: number; prompt?: { text: string }[]; lines?: { text: string }[] },
): void => {
  for (const t of [...(l.prompt ?? []), ...(l.lines ?? [])])
    for (const m of t.text.matchAll(/“([^”]{6,})”/g)) {
      const key = m[1]!.replace(/[.!?,]+$/, '').slice(0, 25);
      const at = sceneLines.findIndex((x) => x.text.includes(key));
      if (at > l.after)
        aheadWarn.push(
          `ahead: ${sceneId} ${l.id}: after=${l.after} quotes line ${at} “${m[1]!.slice(0, 40)}”`,
        );
    }
};
const eduTexts: { band: string; id: string; text: string }[] = [];
const edu: Record<
  string,
  {
    scenes: number;
    lessons: number;
    lines: number;
    words: number;
    byDomain: Record<string, number>;
  }
> = {};
for (const band of C.EDU_BANDS) {
  const st = (edu[band] = {
    scenes: 0,
    lessons: 0,
    lines: 0,
    words: 0,
    byDomain: {} as Record<string, number>,
  });
  const all = [
    ...C.EDU_CAMPAIGN[band].flatMap((c) => c.scenes),
    ...C.EDU_QUESTS[band].flatMap((q) => q.scenes),
    ...C.EDU_VARIANTS[band],
  ];
  const seenOf = new Set<string>(),
    seenId = new Set<string>(),
    lessonIds = new Set<string>();
  for (const e of all) {
    st.scenes++;
    if (seenId.has(e.id)) problems.push(`edu ${band}: dup id ${e.id}`);
    seenId.add(e.id);
    seenOf.add(e.of);
    if (e.band !== band) problems.push(`edu ${e.id}: band ${e.band} in ${band}`);
    if (e.id !== `${band}:${e.of}`) problems.push(`edu ${e.id}: id should be ${band}:${e.of}`);
    const orig = mainScenes.get(e.of);
    if (!orig) {
      problems.push(`edu ${e.id}: no main scene ${e.of}`);
      continue;
    }
    const origChoices = new Set((orig.choices ?? []).map((c) => c.id));
    for (const c of e.choices ?? [])
      if (!origChoices.has(c.id)) problems.push(`edu ${e.id}: unknown choice ${c.id}`);
    const kept = new Set((e.choices ?? []).map((c) => c.id));
    const dropped = [...origChoices].filter((id) => !kept.has(id));
    if (dropped.length && !e.defaultChoice)
      problems.push(`edu ${e.id}: drops ${dropped.join(',')} with no defaultChoice`);
    if (e.defaultChoice && !origChoices.has(e.defaultChoice))
      problems.push(`edu ${e.id}: bad defaultChoice ${e.defaultChoice}`);
    if (band === 'reader' && dropped.length)
      problems.push(`edu ${e.id}: reader drops choices ${dropped.join(',')}`);
    if (!e.lessons.length) problems.push(`edu ${e.id}: no lesson`);
    const texts = [...e.lines, ...(e.choices ?? []).flatMap((c) => c.then ?? [])];
    for (const l of e.lessons) {
      st.lessons++;
      st.byDomain[l.domain] = (st.byDomain[l.domain] ?? 0) + 1;
      if (lessonIds.has(l.id)) problems.push(`edu ${e.id}: dup lesson id ${l.id}`);
      lessonIds.add(l.id);
      if (l.after < -1 || l.after >= e.lines.length)
        problems.push(`edu ${e.id}: lesson ${l.id} after=${l.after} out of range`);
      if (l.standard && !approved.has(l.standard))
        problems.push(`edu ${e.id}: unapproved standard ${l.standard}`);
      if (l.kind === 'ask' && !l.options?.length)
        problems.push(`edu ${e.id}: ask lesson ${l.id} has no options`);
      if (l.kind === 'do' && !l.check) problems.push(`edu ${e.id}: do lesson ${l.id} has no check`);
      texts.push(
        ...(l.prompt ?? []),
        ...(l.lines ?? []),
        ...(l.options ?? []).flatMap((o) => o.reply),
      );
      if (l.domain === 'maths' && l.kind === 'ask') mathsCheck(e.id, e, l);
      aheadCheck(e.id, e.lines, l);
    }
    for (const l of texts) {
      eduTexts.push({ band, id: e.id, text: l.text });
      st.lines++;
      st.words += l.text.split(/\s+/).length;
      if (!mapped(e.of, l.who)) problems.push(`edu ${e.id}: unmapped speaker ${l.who}`);
    }
  }
  // coverage: every main scene in scope has a version (Sunny, Neopia, Multiverse are out of scope)
  for (const id of mainScenes.keys())
    if (!seenOf.has(id) && !eduExempt(band, id)) problems.push(`edu ${band}: missing ${id}`);
  // quests: goals for every step
  for (const q of C.EDU_QUESTS[band]) {
    const orig = allQuests.find((x) => x.id === q.of);
    if (!orig) {
      problems.push(`edu ${q.id}: no quest ${q.of}`);
      continue;
    }
    if (orig.audience !== 'all')
      problems.push(
        `edu ${q.id}: ${q.of} is audience ${orig.audience}, not allowed in the Learning Grove`,
      );
    for (const step of orig.steps)
      if (!q.goals[step.id]) problems.push(`edu ${q.id}: no goal for ${step.id}`);
  }
  for (const c of C.EDU_CAMPAIGN[band])
    for (const n of Object.keys(c.chapters))
      if (!C.CAMPAIGN_CHAPTERS.some((ch) => ch.n === Number(n)))
        problems.push(`edu ${c.id}: bad chapter ${n}`);
}

// ---- lint (2026-10-14): rules that the review found broken. Problems fail the check; warnings are for a human.
const warnings: string[] = [];
/** R0320: openers a sprout wrong-answer reply must not start with. */
const SPROUT_WRONG_OPENER =
  /^[“"‘']?(No\b|Nope|Wrong|That’s not|That's not|Not quite|Try again|Oops, no)/i;
const norm = (t: string): string =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
// 1. The Learning Grove never quotes the originals: no edu line may contain a line that a quest swaps out with childLines.
const quoted: { q: string; t: string }[] = [];
for (const q of allQuests) {
  const byId = new Map(scenesOf(q).map((s) => [s.id, s]));
  for (const k of Object.keys(q.childLines ?? {})) {
    const [sid, idx] = k.split('#');
    const t = byId.get(sid!)?.lines[Number(idx)]?.text;
    if (t && norm(t).length >= 12) quoted.push({ q: q.id, t: norm(t) });
  }
}
// Known false positives: an everyday phrase that one quest lifts and an unrelated edu line happens to use.
// pa5-01-wake#0 lifts "Open your eyes."; the Avatar sprout line "Open your eyes wide. Still dark!" is not a quote.
const notQuotes = new Set(['sprout:q47-nomads-done|pa5-01']);
for (const e of eduTexts) {
  const n = norm(e.text);
  for (const x of quoted)
    if (n.includes(x.t) && !notQuotes.has(`${e.id}|${x.q}`))
      problems.push(`edu ${e.id}: quotes the original (${x.q}): "${e.text}"`);
}
// 2. One speaker id, one character: an id may not be shared between an all-ages quest and a main/teen/adult one.
const spk = new Map<string, { name: string; aud: string; q: string }>();
for (const q of allQuests)
  for (const sp of q.speakers) {
    const prev = spk.get(sp.id);
    if (!prev) spk.set(sp.id, { name: sp.name, aud: q.audience, q: q.id });
    else if (prev.name !== sp.name && (prev.aud === 'all') !== (q.audience === 'all'))
      problems.push(
        `speaker id ${sp.id} is "${prev.name}" (${prev.q}, ${prev.aud}) and "${sp.name}" (${q.id}, ${q.audience})`,
      );
  }
// 3. Pronouns (warnings): Sparks and Pixel are she/her, Dusty is they/them.
const allTexts: { id: string; text: string }[] = [
  ...allQuests.flatMap((q) =>
    scenesOf(q).flatMap((s) =>
      [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])].map((l) => ({
        id: s.id,
        text: l.text,
      })),
    ),
  ),
  ...C.CAMPAIGN_SCENES.flatMap((s) =>
    [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])].map((l) => ({
      id: s.id,
      text: l.text,
    })),
  ),
  ...eduTexts,
];
for (const x of allTexts) {
  if (
    /\b(Sparks|Pixel)\b(?:(?!\b(?:Byte|Moss|Corvin|Clank|Wisp|Fossil|Tobin|he|He)\b)[^.!?“”])*\b(he|him|his|himself)\b/.test(
      x.text,
    )
  )
    warnings.push(`pronoun? ${x.id}: ${x.text}`);
  if (
    /\bDusty\b[^.!?“”]*\b(he|she|him|her|his|hers)\b/i.test(x.text) &&
    !/\b(Sable|Fern|Marina|Ember|Clover|Luna|Nova|Sparks|Pixel|Hazel|Fossil|Moss|Byte|Corvin|Wisp)\b/.test(
      x.text.replace(/\bDusty\b/g, ''),
    )
  )
    warnings.push(`pronoun? ${x.id}: ${x.text}`);
}
// 4. No timers or farms (warnings): nothing once a day or once per visit.
for (const x of allTexts)
  if (
    /\b(once a day|once per day|once per visit|per visit|daily (quest|reward|freebie|chore|task)s?|come back tomorrow)\b/i.test(
      x.text,
    )
  )
    warnings.push(`timer? ${x.id}: ${x.text}`);
// R0320 (FUN-31): a sprout wrong answer opens with a silly picture, never a "No" (warning).
for (const e of [
  ...C.EDU_CAMPAIGN.sprout.flatMap((c) => c.scenes),
  ...C.EDU_QUESTS.sprout.flatMap((q) => q.scenes),
  ...C.EDU_VARIANTS.sprout,
])
  for (const l of e.lessons)
    for (const o of l.kind === 'ask' && l.options?.some((x) => x.best) ? l.options : [])
      if (!o.best && SPROUT_WRONG_OPENER.test(o.reply[0]?.text ?? ''))
        warnings.push(`sprout-wrong-opener ${e.id} ${l.id}: ${o.reply[0]!.text}`);
// R0347 (FUN-58): no sarcasm aimed at the child in the Learning Grove (warning). Characters
// may tease each other; the words below talk down to a child (a wrong-answer reply that
// opens "No" is R0320's sprout-wrong-opener). Pixel's OBVIOUSLY sign is a name, in capitals.
// `--plant-sarcasm` adds a planted line to prove the rule fires.
{
  const SNARK = /\b([Nn]ice try|[Ss]eriously\?|[Ss]illy you|[Ss]illy billy|[Ww]rong again)(?=\W|$)/;
  const texts = process.argv.includes('--plant-sarcasm')
    ? [...eduTexts, { band: 'sprout', id: 'planted', text: 'Nice try! Obviously not.' }]
    : eduTexts;
  for (const x of texts)
    if (SNARK.test(x.text)) warnings.push(`sarcasm? ${x.band} ${x.id}: ${x.text}`);
}
// 5. Line caps (warnings): sprout ≤ 14 words, reader ≤ 30 words (EDU-STYLE).
for (const e of eduTexts) {
  const w = e.text.split(/\s+/).length;
  if ((e.band === 'sprout' && w > 14) || (e.band === 'reader' && w > 30))
    warnings.push(`long ${e.id}: ${w} words`);
}
for (const course of [C.HEBREW_COURSE, C.JAPANESE_COURSE]) {
  const ids = new Set<string>();
  for (const v of course.vocab) {
    if (ids.has(v.id)) problems.push(`${course.id}: dup vocab ${v.id}`);
    ids.add(v.id);
    if (!course.quests.includes(v.quest))
      problems.push(`${course.id}: vocab ${v.id} names unknown quest ${v.quest}`);
  }
  for (const q of course.quests)
    if (!codes.has(q)) problems.push(`${course.id}: unknown quest ${q}`);
}
// 6. Every storyline speaker has a look of their own (C2): a portrait and a world figure that never
// fall back to the player's outfit, and an accessory shape no other storyline speaker shares.
const looksSeen = new Map<string, string>();
for (const sp of [
  ...BEETLE_SPEAKERS,
  ...DAWNDUSK_SPEAKERS,
  ...HUNDRED_SPEAKERS,
  ...LOGGED_SPEAKERS,
]) {
  const look = STORY_NPC_LOOKS[sp.id];
  if (!look) {
    problems.push(`speaker ${sp.id} (${sp.name}) has no look in STORY_NPC_LOOKS`);
    continue;
  }
  const twin = looksSeen.get(look.accessory);
  if (twin) problems.push(`speakers ${twin} and ${sp.id} share the accessory ${look.accessory}`);
  looksSeen.set(look.accessory, sp.id);
}
// 7. K4: no speaker's look may equal a selectable trainer's look, or a player who chose that trainer
// stands beside a twin of themselves. Fern's story look (and Hazel's two ages) must differ from
// every trainer's, and Fern must actually be drawn by it (storyId).
const sameLook = (a: TrainerLook, b: TrainerLook): boolean =>
  (Object.keys(a) as (keyof TrainerLook)[]).every((k) => a[k] === b[k]);
const checked: Array<[string, TrainerLook]> = [
  ...[...BEETLE_SPEAKERS, ...DAWNDUSK_SPEAKERS, ...HUNDRED_SPEAKERS, ...LOGGED_SPEAKERS].flatMap(
    (sp): Array<[string, TrainerLook]> =>
      STORY_NPC_LOOKS[sp.id] ? [[sp.id, STORY_NPC_LOOKS[sp.id]!.trainer]] : [],
  ),
  ...Object.entries(STORY_ONLY_LOOKS).map(([id, l]): [string, TrainerLook] => [id, l.trainer]),
];
for (const [id, l] of checked)
  for (const t of TRAINERS)
    if (sameLook(l, t.look))
      problems.push(`speaker look ${id} equals the selectable trainer look ${t.id}`);
if (storyId('fern') === 'fern' || !STORY_ONLY_LOOKS[storyId('fern')])
  problems.push('Fern has no story-only look (K4)');
console.log(
  JSON.stringify({
    edu,
    hebrewWords: C.HEBREW_COURSE.vocab.length,
    japaneseWords: C.JAPANESE_COURSE.vocab.length,
  }),
);
let readings = 0;
for (const r of C.READERS) readings += r.readings.length;
let results = 0;
for (const r of C.RESULT_SETS) results += r.lines.length;
warnings.push(...mathsWarn);
warnings.push(...aheadWarn);
// 8. Choices are real (SR-20261027-1304): a fun-quest choice flag that no sim rule, UI or
// `requires` reads, and that its quest's notes don't call flavour, is a choice that changes
// nothing. One summary line plus up to 20 examples.
{
  const srcText: string[] = [];
  const walk = (dir: URL): void => {
    for (const name of readdirSync(dir)) {
      const u = new URL(name, dir);
      if (statSync(u).isDirectory()) {
        if (name !== 'content') walk(new URL(`${name}/`, dir));
      } else if (name.endsWith('.ts')) srcText.push(readFileSync(u, 'utf8'));
    }
  };
  walk(new URL('../../src/', import.meta.url));
  const code = srcText.join(String.fromCharCode(10));
  const required = new Set(allQuests.flatMap((q) => q.requires ?? []));
  const unread: string[] = [];
  for (const k of ['python', 'bean', 'sunny', 'avatar', 'alice', 'holmes', 'hodja'] as const)
    for (const q of packs[k]!) {
      const notes = q.notes ?? '';
      const isFlavour = /flavou?r/i.test(notes);
      const flagIds = new Map<string, string[]>();
      for (const s of scenesOf(q))
        for (const c of s.choices ?? [])
          for (const f of Object.keys(c.set ?? {}))
            flagIds.set(f, [...(flagIds.get(f) ?? []), c.id]);
      for (const [f, ids] of flagIds) {
        // `code` covers all of src/ bar content, so sim/choice-payoffs.ts and sim/story-scenes.ts reads count
        const read = required.has(f) || code.includes(`'${f}'`) || code.includes(`"${f}"`);
        const flavour =
          isFlavour && (notes.includes(f) || ids.some((id) => id && notes.includes(id)));
        if (!read && !flavour) unread.push(`${q.id}:${f}`);
      }
    }
  if (unread.length)
    warnings.push(
      `unread fun-quest choice flags: ${unread.length} (e.g. ${unread.slice(0, 20).join(', ')})`,
    );
}
// Every quest sits on the map: a region (with a real poi if one is given) or a story area.
let noArea = 0;
for (const q of allQuests) {
  const a = areaOf(q);
  if (!a) {
    noArea++;
    problems.push(`${q.id}: no area (add "${q.trigger.where}" to src/content/where-map.ts)`);
  } else if ((STORY_AREAS as readonly string[]).includes(a.region)) {
    if (a.poi) problems.push(`${q.id}: story area ${a.region} takes no poi (${a.poi})`);
  } else {
    const region = REGIONS[a.region as keyof typeof REGIONS];
    if (!region) problems.push(`${q.id}: unknown region ${a.region}`);
    else if (a.poi && !region.pois.some((p) => p.id === a.poi))
      problems.push(`${q.id}: poi ${a.poi} is not in region ${a.region}`);
  }
}
// 9. World traces (WORLD-26): narrator lines only, at most 100 characters and two sentences,
// childLines keyed to a real line, and at least three in every region that has any.
{
  const perRegion = new Map<string, number>();
  const ids = new Set<string>();
  for (const t of C.WORLD_TRACES) {
    if (ids.has(t.id)) problems.push(`dup trace id ${t.id}`);
    ids.add(t.id);
    if (!REGIONS[t.region]) problems.push(`${t.id}: unknown region ${t.region}`);
    perRegion.set(t.region, (perRegion.get(t.region) ?? 0) + 1);
    if (t.lines.length < 1 || t.lines.length > 2) problems.push(`${t.id}: 1–2 lines`);
    t.lines.forEach((l, i) => {
      if (l.who !== 'narrator') problems.push(`${t.id}#${i}: traces are the narrator's`);
      for (const text of [l.text, t.childLines[`${t.id}#${i}`]]) {
        if (text === undefined) continue;
        if (text.length > 100) problems.push(`${t.id}#${i}: over 100 characters`);
        if ((text.match(/[.!?](\s|$)/g) ?? []).length > 2)
          problems.push(`${t.id}#${i}: over two sentences`);
      }
    });
    for (const k of Object.keys(t.childLines)) {
      const [id, n] = k.split('#');
      if (id !== t.id || !t.lines[Number(n)]) problems.push(`${t.id}: childLines key ${k}`);
    }
  }
  for (const [region, n] of perRegion)
    if (n < 3) problems.push(`traces: ${region} has ${n}, needs at least 3`);
}
// 9b. World gags (R0129): the trace rules for lines, a real tappable outer-ring piece each, and
// at least three in every region that has any.
{
  const perRegion = new Map<string, number>();
  const ids = new Set<string>();
  for (const g of C.WORLD_GAGS) {
    if (ids.has(g.id)) problems.push(`dup gag id ${g.id}`);
    ids.add(g.id);
    if (!REGIONS[g.region]) problems.push(`${g.id}: unknown region ${g.region}`);
    perRegion.set(g.region, (perRegion.get(g.region) ?? 0) + 1);
    if (!OUTER_PROPS.some((p) => p.id === g.piece && p.tap))
      problems.push(`${g.id}: piece ${g.piece} is not a tappable outer-ring piece`);
    if (g.lines.length < 1 || g.lines.length > 2) problems.push(`${g.id}: 1–2 lines`);
    g.lines.forEach((l, i) => {
      if (l.who !== 'narrator') problems.push(`${g.id}#${i}: gags are the narrator's`);
      for (const text of [l.text, g.childLines[`${g.id}#${i}`]]) {
        if (text === undefined) continue;
        if (text.length > 100) problems.push(`${g.id}#${i}: over 100 characters`);
        if ((text.match(/[.!?](\s|$)/g) ?? []).length > 2)
          problems.push(`${g.id}#${i}: over two sentences`);
      }
    });
    for (const k of Object.keys(g.childLines)) {
      const [id, n] = k.split('#');
      if (id !== g.id || !g.lines[Number(n)]) problems.push(`${g.id}: childLines key ${k}`);
    }
  }
  for (const [region, n] of perRegion)
    if (n < 3) problems.push(`gags: ${region} has ${n}, needs at least 3`);
}
// 9c. Festival gags (R0359): four narrator lines a season, phone-short, two sentences at most.
for (const [season, scene] of Object.entries(C.FESTIVAL_GAGS)) {
  if (scene.id !== `festival-gag-${season}`)
    problems.push(`festival gag ${season}: id ${scene.id}`);
  if (scene.lines.length !== 4) problems.push(`${scene.id}: four lines`);
  scene.lines.forEach((l, i) => {
    if (l.who !== 'narrator') problems.push(`${scene.id}#${i}: festival gags are the narrator's`);
    if (l.text.length > 100) problems.push(`${scene.id}#${i}: over 100 characters`);
    if ((l.text.match(/[.!?](\s|$)/g) ?? []).length > 2)
      problems.push(`${scene.id}#${i}: over two sentences`);
  });
}
// ---- Keeper barks (R0295): known Keepers, sane chapter ranges, phone-short lines
for (const [who, sets] of Object.entries(C.BARKS)) {
  if (!TRAINERS.some((t) => t.id === who)) problems.push(`barks: unknown Keeper ${who}`);
  for (const s of sets) {
    if (s.from > s.to) problems.push(`barks: ${who} has chapters ${s.from}–${s.to}`);
    for (const l of s.lines) if (l.length > 160) problems.push(`barks: ${who} line too long: ${l}`);
  }
}
// ---- hint verbs (R0292): a hint names only verbs and modes the game has. There is no Give
// or Talk button (you tap a person) and no Photo mode; a step the game cannot see says
// "tap Do it in the Journal" instead.
{
  const dir = new URL('../../src/content/', import.meta.url);
  const bad =
    /\b(use|choose|with|tap) (Give|Talk|Inspect)\b|Photo mode|\bthen Give\b|\bGive (it|them) to\b/;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.ts')) continue;
    readFileSync(new URL(f, dir), 'utf8')
      .split('\n')
      .forEach((line, i) => {
        const m = /\bhint: '([^']*)'/.exec(line);
        if (m && bad.test(m[1]!)) problems.push(`hint-verb ${f}:${i + 1}: ${m[1]}`);
      });
  }
}
// ---- hint buttons (R0292, round 6): "press X", "choose X", "use X" or "tap X" names a button.
// X must be a Grove button, a choice label or speaker name in the same file, or the hint
// sends the player looking for something that is not there. A warning, for a writer to judge.
{
  const dir = new URL('../../src/content/', import.meta.url);
  const grove = new Set(
    'Do Pet Feed Swim Say Throw Wear Dress Karate Races Cheer Play Buy Sell Shake Walk Race Read Journal Atlas Map Settings Shop Workshop Craft Hug Tickle Praise Groom Sit Talk Sniff Gran Tobin Mirabel'.split(
      ' ',
    ),
  );
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts'));
  // Anyone who speaks anywhere in the content is a person you can tap, not a button.
  const people = new Set<string>();
  for (const f of files)
    for (const m of readFileSync(new URL(f, dir), 'utf8').matchAll(
      /\bwho: '([a-z][\w-]*)'|\b(?:name|speaker): '([A-Z][a-z]+)/g,
    ))
      people.add((m[1] ?? m[2]!).toLowerCase());
  for (const f of files) {
    const text = readFileSync(new URL(f, dir), 'utf8');
    text.split('\n').forEach((line, i) => {
      const m = /\bhint: '([^']*)'/.exec(line);
      if (!m) return;
      for (const b of m[1]!.matchAll(/\b(?:press|choose|use|tap|select) ([A-Z][A-Za-z]+)\b/gi)) {
        const w = b[1]!;
        if (w === w.toLowerCase() || grove.has(w) || people.has(w.toLowerCase())) continue;
        const known = new RegExp(`(label|text): '${w}\\b`);
        if (!known.test(text)) warnings.push(`hint-button? ${f}:${i + 1}: ${w}`);
      }
    });
  }
}
// R0677 (KIDS-09): sprout choices and ask options without an `icon` show a number instead.
// Counted, not listed: the aim is 0, and a writer adds icons file by file.
let sproutNoIcon = 0;
for (const e of [
  ...C.EDU_CAMPAIGN.sprout.flatMap((c) => c.scenes),
  ...C.EDU_QUESTS.sprout.flatMap((q) => q.scenes),
  ...C.EDU_VARIANTS.sprout,
]) {
  for (const c of e.choices ?? []) if (!c.icon) sproutNoIcon++;
  for (const l of e.lessons)
    for (const o of l.kind === 'ask' ? (l.options ?? []) : []) if (!o.icon) sproutNoIcon++;
}
console.log(
  JSON.stringify(
    {
      sproutNoIcon,
      quests,
      scenes,
      lines,
      words,
      choices,
      long,
      readings,
      results,
      warnings: warnings.length,
      noArea,
      problems: problems.length,
    },
    null,
    1,
  ),
);
console.log(problems.slice(0, 60).join('\n'));
if (process.argv.includes('--warnings')) console.log(warnings.join('\n'));
// R0309 (FUN-20): the joke-density report (tests/tools/comedy-report.ts), on request.
if (process.argv.includes('--comedy')) console.log(comedyReport());
// R0368 (FUN-79): the narration lines that make the scene's Nubbin react by inference
// (config/story-react.ts), listed for a writer to review.
if (process.argv.includes('--reactions')) {
  const dir = new URL('../../src/content/', import.meta.url);
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.ts')))
    readFileSync(new URL(f, dir), 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (!/who: 'narrator'|\bN\(/.test(line) || line.includes('react:')) return;
        const hit = REACT_INFER.find(([re]) => re.test(line));
        if (hit) console.log(`react ${hit[1]} ${f}:${i + 1}: ${line.trim().slice(0, 120)}`);
      });
}
