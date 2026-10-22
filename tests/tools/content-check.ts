import { readFileSync } from 'node:fs';
import * as C from '../../src/content/index';
import { SPEAKERS } from '../../src/config/story';
import { speakerNameIn } from '../../src/sim/story-scenes';
import type { Quest } from '../../src/content/types';
import type { Scene } from '../../src/config/story';
import { STORY_NPC_LOOKS } from '../../src/config/npc-looks';
import { BEETLE_SPEAKERS } from '../../src/content/storyline-beetle';
import { DAWNDUSK_SPEAKERS } from '../../src/content/storyline-dawndusk';
import { HUNDRED_SPEAKERS } from '../../src/content/storyline-hundred';
import { LOGGED_SPEAKERS } from '../../src/content/storyline-logged';

const packs: Record<string, Quest[]> = {
  python: C.QUESTS_PYTHON, bean: C.QUESTS_BEAN, sunny: C.QUESTS_SUNNY, avatar: C.QUESTS_AVATAR,
  sideMain: C.SIDE_STORIES_MAIN, sideFun: C.SIDE_STORIES_FUN, sideFun2: C.SIDE_STORIES_FUN_2, new1: C.SIDE_STORIES_NEW_1, new2: C.SIDE_STORIES_NEW_2, new3: C.SIDE_STORIES_NEW_3, new4: C.SIDE_STORIES_NEW_4, npLine: C.NEOPIA_LINE, npQuests: C.NEOPIA_QUESTS,
  im: C.MV_IRONMAN, ca: C.MV_CAP, ff: C.MV_DOOM, ul: C.MV_ULTRON, mk: C.MV_MOONKNIGHT, sp: C.MV_SPAWN,
  langHe: C.LANG_HEBREW, langJa: C.LANG_JAPANESE, db: C.MV_DRAGONBALL, ts: C.MV_TOYSTORY, eg: C.MV_ENDGAMES,
  // Part L and Part M (only those with Learning Grove versions are in eduPacks; of the Arcade, PA1 since 2026-10-17)
  s23: C.SIDE_STORY_S23, s24: C.SIDE_STORY_S24, s25: C.SIDE_STORY_S25, s26: C.SIDE_STORY_S26, s27: C.SIDE_STORY_S27, s28: C.SIDE_STORY_S28, s29: C.SIDE_STORY_S29, s30: C.SIDE_STORY_S30, s31: C.SIDE_STORY_S31, a01: C.ATLAS_A01, a02: C.ATLAS_A02, a03: C.ATLAS_A03, a04: C.ATLAS_A04, a05: C.ATLAS_A05, a06: C.ATLAS_A06, a07: C.ATLAS_A07, a08: C.ATLAS_A08, a09: C.ATLAS_A09, a10: C.ATLAS_A10, a11: C.ATLAS_A11, a12: C.ATLAS_A12, a13: C.ATLAS_A13, a14: C.ATLAS_A14, a15: C.ATLAS_A15, a16: C.ATLAS_A16, a17: C.ATLAS_A17, a18: C.ATLAS_A18, a19: C.ATLAS_A19, a20: C.ATLAS_A20, a21: C.ATLAS_A21, a22: C.ATLAS_A22, a23: C.ATLAS_A23, a24: C.ATLAS_A24, a25: C.ATLAS_A25, a26: C.ATLAS_A26, a27: C.ATLAS_A27, a28: C.ATLAS_A28, a29: C.ATLAS_A29, a30: C.ATLAS_A30, a31: C.ATLAS_A31,
  alice: C.QUESTS_ALICE, holmes: C.QUESTS_HOLMES, hodja: C.QUESTS_HODJA,
  pa1: C.ARCADE_PA1, pa2: C.ARCADE_PA2, pa3: C.ARCADE_PA3, pa4: C.ARCADE_PA4, pa5: C.ARCADE_PA5,
  // Learning Grove lines (edu versions built in, so they are in eduPacks)
  lb: C.LINE_LB, lk: C.LINE_LK,
  // Plan G12 expansions (post-ending, main audience; never in eduPacks)
  e1: C.EXPANSION_E1, e2: C.EXPANSION_E2, e3: C.EXPANSION_E3,
};
const problems: string[] = [];
const questIds = new Set<string>(), sceneIds = new Map<string, string>(), codes = new Set<string>();
let quests = 0, scenes = 0, lines = 0, words = 0, long = 0, choices = 0;
const allQuests: Quest[] = Object.values(packs).flat();
for (const q of allQuests) codes.add(q.code);
const variantById = new Map<string, Scene>();
for (const [k, v] of Object.entries(C)) if (/VARIANTS$/.test(k) && Array.isArray(v)) for (const sc of v as Scene[]) if (sc && typeof sc === 'object' && 'lines' in sc) variantById.set(sc.id, sc);
const scenesOf = (q: Quest): Scene[] => [...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]), q.complete];
for (const [pack, list] of Object.entries(packs)) {
  for (const q of list) {
    quests++;
    if (questIds.has(q.id)) problems.push(`dup quest id ${q.id}`);
    questIds.add(q.id);
    const declared = new Set([...Object.keys(SPEAKERS), ...Object.keys(C.CAMPAIGN_SPEAKERS), ...q.speakers.map((s) => s.id)]);
    const sc = scenesOf(q);
    const byId = new Map(sc.map((s) => [s.id, s]));
    for (const s of sc) {
      scenes++;
      if (sceneIds.has(s.id)) problems.push(`dup scene id ${s.id} (${pack}, also ${sceneIds.get(s.id)})`);
      sceneIds.set(s.id, pack);
      const all = [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])];
      choices += s.choices?.length ?? 0;
      for (const l of all) {
        lines++; words += l.text.split(/\s+/).length;
        if (l.text.length > 160) long++;
        if (!declared.has(l.who)) problems.push(`${q.id}: undeclared speaker ${l.who}`);
      }
    }
    for (const k of Object.keys(q.childLines ?? {})) {
      const [sid, idx] = k.split('#');
      const s = byId.get(sid!) ?? variantById.get(sid!);
      if (!s || Number(idx) >= s.lines.length) problems.push(`${q.id}: bad childLines key ${k}`);
    }
    for (const r of q.requires ?? []) if (!codes.has(r) && !/^(mv-|np|q|s\d|rift|flag)/i.test(r)) problems.push(`${q.id}: requires unknown ${r}`);
  }
}
// ---- campaign
const campIds = new Set<string>();
const campSpeakers = new Set([...Object.keys(SPEAKERS), ...Object.keys(C.CAMPAIGN_SPEAKERS)]);
// Every `who` must reach a name plate, the way the dialogue box finds one: SPEAKERS, then
// the quest that owns the scene, its family (`a13`, `s24`), then any quest (speakerNameIn).
const questOfScene = new Map<string, Quest>();
for (const q of allQuests) for (const s of scenesOf(q)) if (!questOfScene.has(s.id)) questOfScene.set(s.id, q);
const mapped = (sceneId: string, who: string): boolean =>
  campSpeakers.has(who) || speakerNameIn(allQuests, sceneId, who, questOfScene.get(sceneId)) !== undefined;
for (const v of variantById.values()) {
  for (const l of [...v.lines, ...(v.choices ?? []).flatMap((c) => c.then ?? [])]) if (!mapped(v.id, l.who)) problems.push(`variant ${v.id}: unmapped speaker ${l.who}`);
}
let campLines = 0, campWords = 0;
for (const s of C.CAMPAIGN_SCENES) {
  if (campIds.has(s.id) || sceneIds.has(s.id)) problems.push(`campaign: dup scene id ${s.id}`);
  campIds.add(s.id);
  if (!C.CAMPAIGN_NOTES[s.id] && !/^c\d+-(open|close)$|^t-|^end-/.test(s.id)) problems.push(`campaign: no note for ${s.id}`);
  for (const l of [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])]) {
    campLines++; campWords += l.text.split(/\s+/).length;
    if (l.text.length > 160) long++;
    if (!campSpeakers.has(l.who)) problems.push(`campaign ${s.id}: undeclared speaker ${l.who}`);
  }
}
for (const v of [...C.SIDE_STORIES_MAIN_VARIANTS, ...C.SIDE_STORIES_NEW_3_VARIANTS, ...C.SIDE_STORIES_FUN_2_VARIANTS]) { if (campIds.has(v.id)) problems.push(`variant id clashes with campaign ${v.id}`); }
for (const v of C.SIDE_STORIES_MAIN_VARIANTS) if (sceneIds.has(v.id) && !v.id.startsWith('s')) problems.push(`variant clash ${v.id}`);
const NEW_VARIANTS = [...C.SIDE_STORY_S23_VARIANTS, ...C.SIDE_STORY_S24_VARIANTS, ...C.SIDE_STORY_S25_VARIANTS, ...C.SIDE_STORY_S26_VARIANTS, ...C.SIDE_STORY_S27_VARIANTS, ...C.SIDE_STORY_S28_VARIANTS, ...C.SIDE_STORY_S29_VARIANTS, ...C.SIDE_STORY_S30_VARIANTS, ...C.SIDE_STORY_S31_VARIANTS, ...C.ATLAS_A01_VARIANTS, ...C.ATLAS_A02_VARIANTS, ...C.ATLAS_A03_VARIANTS, ...C.ATLAS_A04_VARIANTS, ...C.ATLAS_A05_VARIANTS, ...C.A06_VARIANTS, ...C.ATLAS_A07_VARIANTS, ...C.ATLAS_A08_VARIANTS, ...C.ATLAS_A09_VARIANTS, ...C.A10_VARIANTS, ...C.A11_VARIANTS, ...C.A12_VARIANTS, ...C.A13_VARIANTS, ...C.A14_VARIANTS, ...C.ATLAS_A15_VARIANTS, ...C.ATLAS_A16_VARIANTS, ...C.A17_VARIANTS, ...C.ATLAS_A18_VARIANTS, ...C.A19_VARIANTS, ...C.ATLAS_A20_VARIANTS, ...C.A21_VARIANTS, ...C.A22_VARIANTS, ...C.A23_VARIANTS, ...C.ATLAS_A24_VARIANTS, ...C.ATLAS_A25_VARIANTS, ...C.A26_VARIANTS, ...C.ATLAS_A27_VARIANTS, ...C.ATLAS_A28_VARIANTS, ...C.ATLAS_A29_VARIANTS, ...C.ATLAS_A30_VARIANTS, ...C.A31_VARIANTS, ...C.PA1_VARIANTS, ...C.ARCADE_PA2_VARIANTS, ...C.PA3_VARIANTS, ...C.ARCADE_PA4_VARIANTS, ...C.PA5_VARIANTS, ...C.LINE_LB_VARIANTS, ...C.LINE_LK_VARIANTS, ...C.EXPANSION_E1_VARIANTS, ...C.EXPANSION_E2_VARIANTS, ...C.EXPANSION_E3_VARIANTS, ...C.NEOPIA_LINE_VARIANTS, ...C.NEOPIA_QUESTS_VARIANTS, ...C.MV_IRONMAN_VARIANTS, ...C.MV_CAP_VARIANTS, ...C.MV_DOOM_VARIANTS, ...C.MV_ULTRON_VARIANTS, ...C.MV_MOONKNIGHT_VARIANTS, ...C.MV_SPAWN_VARIANTS, ...C.MV_DRAGONBALL_VARIANTS, ...C.MV_TOYSTORY_VARIANTS, ...C.MV_ENDGAMES_VARIANTS];
for (const v of NEW_VARIANTS) { if (campIds.has(v.id) && !/^(c\d+|end)-/.test(v.id)) problems.push(`new variant id clashes with campaign ${v.id}`); if (sceneIds.has(v.id)) problems.push(`new variant id clashes with a quest scene ${v.id}`); }
{ const seenV = new Set<string>(); for (const v of NEW_VARIANTS) { if (seenV.has(v.id)) problems.push(`dup new variant ${v.id}`); seenV.add(v.id); } }

const ns = C.CAMPAIGN_CHAPTERS.map((c) => c.n).join(',');
if (ns !== '1,2,3,4,5,6,7,8,9,10,11,12') problems.push(`campaign: chapters ${ns}`);
for (const c of C.CAMPAIGN_CHAPTERS) for (const id of [c.opening, c.closing]) if (!campIds.has(id)) problems.push(`campaign: ch${c.n} missing scene ${id}`);
const endIds = ['hazels-grove', 'eternal-dawn', 'shadow-keeper', 'moss-sleeps', 'wild-grove', 'empty-lantern', 'collector', 'long-road'];
for (const e of endIds) {
  if (!C.CAMPAIGN_ENDINGS[e]) problems.push(`campaign: ending text missing ${e}`);
  if (!campIds.has(`end-${e}`)) problems.push(`campaign: ending scene missing end-${e}`);
}
// flags that cross files must be declared somewhere
const declaredFlags = new Set([...C.CAMPAIGN_FLAGS, ...C.SIDE_STORIES_MAIN_FLAGS, ...C.SIDE_STORIES_NEW_3_FLAGS]);
for (const f of ['wisp', 'corvinGate', 'hazel', 'walk', 's8Reunited', 's9Started', 'millLetter', 'cinder', 'keptStone', 'stoneBearer', 'stoneUnmadeBy', 'mossReturned', 'corvin'])
  if (!declaredFlags.has(f)) problems.push(`flag not declared in any FLAGS list: ${f}`);
console.log(JSON.stringify({ campaignScenes: campIds.size, campLines, campWords }));
// ---- educational versions (the Learning Grove language switch)
const styleMd = readFileSync(new URL('../../src/content/EDU-STYLE.md', import.meta.url), 'utf8').replace(/\n\s*/g, ' ');
const approved = new Set<string>();
for (const m of styleMd.matchAll(/`((?:ELOF|CASEL): [^`]+)`/g)) approved.add(m[1]!);
for (const m of styleMd.matchAll(/`(D2\.[^`]+)`/g)) approved.add(m[1]!);
for (const m of styleMd.matchAll(/\| ([A-Z0-9][A-Za-z0-9.-]+) \|/g)) approved.add(m[1]!);
const mainScenes = new Map<string, Scene>();
for (const s of C.CAMPAIGN_SCENES) mainScenes.set(s.id, s);
const eduPacks = { sideMain: 1, sideFun: 1, sideFun2: 1, new1: 1, new2: 1, new3: 1, new4: 1, python: 1, bean: 1, avatar: 1, langHe: 1, langJa: 1, lb: 1, lk: 1, s24: 1, s25: 1, s26: 1, s27: 1, s28: 1, s29: 1, s30: 1, s31: 1, a02: 1, a05: 1, a06: 1, a07: 1, a08: 1, a09: 1, a10: 1, a11: 1, a12: 1, a13: 1, a14: 1, a15: 1, a16: 1, a17: 1, a18: 1, a19: 1, a20: 1, a22: 1, a23: 1, a24: 1, a25: 1, a26: 1, a27: 1, a28: 1, a29: 1, a30: 1, a31: 1, pa1: 1 } as const;
for (const k of Object.keys(eduPacks)) for (const q of packs[k]!) for (const s of scenesOf(q)) mainScenes.set(s.id, s);
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
  (band === 'reader' && (/^a16-(16|17)(-|$)|^a16-grove-/.test(id) || /^a25-(1[5-9]|[2-9]\d)(-|$)|^a25-(margin-hazel|grove-ember)(-|$)/.test(id)));
for (const k of Object.keys(eduPacks)) for (const q of packs[k]!) if (q.audience !== 'all') if (!eduExempt('reader', q.id)) problems.push(`${q.id}: audience ${q.audience} in a Learning Grove pack`);
for (const s of [...C.SIDE_STORIES_MAIN_VARIANTS, ...C.SIDE_STORIES_NEW_3_VARIANTS, ...C.SIDE_STORIES_FUN_2_VARIANTS, ...C.LINE_LB_VARIANTS, ...C.LINE_LK_VARIANTS, ...C.SIDE_STORY_S24_VARIANTS, ...C.SIDE_STORY_S25_VARIANTS, ...C.SIDE_STORY_S26_VARIANTS, ...C.SIDE_STORY_S27_VARIANTS, ...C.SIDE_STORY_S28_VARIANTS, ...C.SIDE_STORY_S29_VARIANTS, ...C.SIDE_STORY_S30_VARIANTS, ...C.SIDE_STORY_S31_VARIANTS, ...C.ATLAS_A02_VARIANTS, ...C.ATLAS_A05_VARIANTS, ...C.A06_VARIANTS, ...C.ATLAS_A07_VARIANTS, ...C.ATLAS_A08_VARIANTS, ...C.ATLAS_A09_VARIANTS, ...C.A10_VARIANTS, ...C.A11_VARIANTS, ...C.A12_VARIANTS, ...C.A13_VARIANTS, ...C.A14_VARIANTS, ...C.ATLAS_A15_VARIANTS, ...C.ATLAS_A16_VARIANTS, ...C.A17_VARIANTS, ...C.ATLAS_A18_VARIANTS, ...C.A19_VARIANTS, ...C.ATLAS_A20_VARIANTS, ...C.A22_VARIANTS, ...C.A23_VARIANTS, ...C.ATLAS_A24_VARIANTS, ...C.ATLAS_A25_VARIANTS, ...C.A26_VARIANTS, ...C.ATLAS_A27_VARIANTS, ...C.ATLAS_A28_VARIANTS, ...C.ATLAS_A29_VARIANTS, ...C.ATLAS_A30_VARIANTS, ...C.A31_VARIANTS, ...C.PA1_VARIANTS]) mainScenes.set(s.id, s);
const eduTexts: { band: string; id: string; text: string }[] = [];
const edu: Record<string, { scenes: number; lessons: number; lines: number; words: number; byDomain: Record<string, number> }> = {};
for (const band of C.EDU_BANDS) {
  const st = (edu[band] = { scenes: 0, lessons: 0, lines: 0, words: 0, byDomain: {} as Record<string, number> });
  const all = [
    ...C.EDU_CAMPAIGN[band].flatMap((c) => c.scenes),
    ...C.EDU_QUESTS[band].flatMap((q) => q.scenes),
    ...C.EDU_VARIANTS[band],
  ];
  const seenOf = new Set<string>(), seenId = new Set<string>(), lessonIds = new Set<string>();
  for (const e of all) {
    st.scenes++;
    if (seenId.has(e.id)) problems.push(`edu ${band}: dup id ${e.id}`);
    seenId.add(e.id); seenOf.add(e.of);
    if (e.band !== band) problems.push(`edu ${e.id}: band ${e.band} in ${band}`);
    if (e.id !== `${band}:${e.of}`) problems.push(`edu ${e.id}: id should be ${band}:${e.of}`);
    const orig = mainScenes.get(e.of);
    if (!orig) { problems.push(`edu ${e.id}: no main scene ${e.of}`); continue; }
    const origChoices = new Set((orig.choices ?? []).map((c) => c.id));
    for (const c of e.choices ?? []) if (!origChoices.has(c.id)) problems.push(`edu ${e.id}: unknown choice ${c.id}`);
    const kept = new Set((e.choices ?? []).map((c) => c.id));
    const dropped = [...origChoices].filter((id) => !kept.has(id));
    if (dropped.length && !e.defaultChoice) problems.push(`edu ${e.id}: drops ${dropped.join(',')} with no defaultChoice`);
    if (e.defaultChoice && !origChoices.has(e.defaultChoice)) problems.push(`edu ${e.id}: bad defaultChoice ${e.defaultChoice}`);
    if (band === 'reader' && dropped.length) problems.push(`edu ${e.id}: reader drops choices ${dropped.join(',')}`);
    if (!e.lessons.length) problems.push(`edu ${e.id}: no lesson`);
    const texts = [...e.lines, ...(e.choices ?? []).flatMap((c) => c.then ?? [])];
    for (const l of e.lessons) {
      st.lessons++; st.byDomain[l.domain] = (st.byDomain[l.domain] ?? 0) + 1;
      if (lessonIds.has(l.id)) problems.push(`edu ${e.id}: dup lesson id ${l.id}`);
      lessonIds.add(l.id);
      if (l.after < -1 || l.after >= e.lines.length) problems.push(`edu ${e.id}: lesson ${l.id} after=${l.after} out of range`);
      if (l.standard && !approved.has(l.standard)) problems.push(`edu ${e.id}: unapproved standard ${l.standard}`);
      if (l.kind === 'ask' && !(l.options?.length)) problems.push(`edu ${e.id}: ask lesson ${l.id} has no options`);
      if (l.kind === 'do' && !l.check) problems.push(`edu ${e.id}: do lesson ${l.id} has no check`);
      texts.push(...(l.prompt ?? []), ...(l.lines ?? []), ...(l.options ?? []).flatMap((o) => o.reply));
    }
    for (const l of texts) {
      eduTexts.push({ band, id: e.id, text: l.text });
      st.lines++; st.words += l.text.split(/\s+/).length;
      if (!mapped(e.of, l.who)) problems.push(`edu ${e.id}: unmapped speaker ${l.who}`);
    }
  }
  // coverage: every main scene in scope has a version (Sunny, Neopia, Multiverse are out of scope)
  for (const id of mainScenes.keys()) if (!seenOf.has(id) && !eduExempt(band, id)) problems.push(`edu ${band}: missing ${id}`);
  // quests: goals for every step
  for (const q of C.EDU_QUESTS[band]) {
    const orig = allQuests.find((x) => x.id === q.of);
    if (!orig) { problems.push(`edu ${q.id}: no quest ${q.of}`); continue; }
    if (orig.audience !== 'all') problems.push(`edu ${q.id}: ${q.of} is audience ${orig.audience}, not allowed in the Learning Grove`);
    for (const step of orig.steps) if (!q.goals[step.id]) problems.push(`edu ${q.id}: no goal for ${step.id}`);
  }
  for (const c of C.EDU_CAMPAIGN[band]) for (const n of Object.keys(c.chapters)) if (!C.CAMPAIGN_CHAPTERS.some((ch) => ch.n === Number(n))) problems.push(`edu ${c.id}: bad chapter ${n}`);
}

// ---- lint (2026-10-14): rules that the review found broken. Problems fail the check; warnings are for a human.
const warnings: string[] = [];
const norm = (t: string): string => t.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
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
for (const e of eduTexts) { const n = norm(e.text); for (const x of quoted) if (n.includes(x.t) && !notQuotes.has(`${e.id}|${x.q}`)) problems.push(`edu ${e.id}: quotes the original (${x.q}): "${e.text}"`); }
// 2. One speaker id, one character: an id may not be shared between an all-ages quest and a main/teen/adult one.
const spk = new Map<string, { name: string; aud: string; q: string }>();
for (const q of allQuests) for (const sp of q.speakers) {
  const prev = spk.get(sp.id);
  if (!prev) spk.set(sp.id, { name: sp.name, aud: q.audience, q: q.id });
  else if (prev.name !== sp.name && (prev.aud === 'all') !== (q.audience === 'all')) problems.push(`speaker id ${sp.id} is "${prev.name}" (${prev.q}, ${prev.aud}) and "${sp.name}" (${q.id}, ${q.audience})`);
}
// 3. Pronouns (warnings): Sparks and Pixel are she/her, Dusty is they/them.
const allTexts: { id: string; text: string }[] = [
  ...allQuests.flatMap((q) => scenesOf(q).flatMap((s) => [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])].map((l) => ({ id: s.id, text: l.text })))),
  ...C.CAMPAIGN_SCENES.flatMap((s) => [...s.lines, ...(s.choices ?? []).flatMap((c) => c.then ?? [])].map((l) => ({ id: s.id, text: l.text }))),
  ...eduTexts,
];
for (const x of allTexts) {
  if (/\b(Sparks|Pixel)\b(?:(?!\b(?:Byte|Moss|Corvin|Clank|Wisp|Fossil|Tobin|he|He)\b)[^.!?“”])*\b(he|him|his|himself)\b/.test(x.text)) warnings.push(`pronoun? ${x.id}: ${x.text}`);
  if (/\bDusty\b[^.!?“”]*\b(he|she|him|her|his|hers)\b/i.test(x.text) && !/\b(Sable|Fern|Marina|Ember|Clover|Luna|Nova|Sparks|Pixel|Hazel|Fossil|Moss|Byte|Corvin|Wisp)\b/.test(x.text.replace(/\bDusty\b/g, ''))) warnings.push(`pronoun? ${x.id}: ${x.text}`);
}
// 4. No timers or farms (warnings): nothing once a day or once per visit.
for (const x of allTexts) if (/\b(once a day|once per day|once per visit|per visit|daily (quest|reward|freebie|chore|task)s?|come back tomorrow)\b/i.test(x.text)) warnings.push(`timer? ${x.id}: ${x.text}`);
// 5. Line caps (warnings): sprout ≤ 14 words, reader ≤ 30 words (EDU-STYLE).
for (const e of eduTexts) { const w = e.text.split(/\s+/).length; if ((e.band === 'sprout' && w > 14) || (e.band === 'reader' && w > 30)) warnings.push(`long ${e.id}: ${w} words`); }
for (const course of [C.HEBREW_COURSE, C.JAPANESE_COURSE]) {
  const ids = new Set<string>();
  for (const v of course.vocab) {
    if (ids.has(v.id)) problems.push(`${course.id}: dup vocab ${v.id}`);
    ids.add(v.id);
    if (!course.quests.includes(v.quest)) problems.push(`${course.id}: vocab ${v.id} names unknown quest ${v.quest}`);
  }
  for (const q of course.quests) if (!codes.has(q)) problems.push(`${course.id}: unknown quest ${q}`);
}
// 6. Every storyline speaker has a look of their own (C2): a portrait and a world figure that never
// fall back to the player's outfit, and an accessory shape no other storyline speaker shares.
const looksSeen = new Map<string, string>();
for (const sp of [...BEETLE_SPEAKERS, ...DAWNDUSK_SPEAKERS, ...HUNDRED_SPEAKERS, ...LOGGED_SPEAKERS]) {
  const look = STORY_NPC_LOOKS[sp.id];
  if (!look) { problems.push(`speaker ${sp.id} (${sp.name}) has no look in STORY_NPC_LOOKS`); continue; }
  const twin = looksSeen.get(look.accessory);
  if (twin) problems.push(`speakers ${twin} and ${sp.id} share the accessory ${look.accessory}`);
  looksSeen.set(look.accessory, sp.id);
}
console.log(JSON.stringify({ edu, hebrewWords: C.HEBREW_COURSE.vocab.length, japaneseWords: C.JAPANESE_COURSE.vocab.length }));
let readings = 0; for (const r of C.READERS) readings += r.readings.length;
let results = 0; for (const r of C.RESULT_SETS) results += r.lines.length;
console.log(JSON.stringify({ quests, scenes, lines, words, choices, long, readings, results, warnings: warnings.length, problems: problems.length }, null, 1));
console.log(problems.slice(0, 60).join('\n'));
if (process.argv.includes('--warnings')) console.log(warnings.join('\n'));
