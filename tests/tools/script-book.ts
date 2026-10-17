/** Renders the content pack as readable Markdown screenplays: npx tsx tests/tools/script-book.ts <outDir> */
import { mkdirSync, writeFileSync } from 'node:fs';
import * as C from '../../src/content/index';
import { SPEAKERS, type Scene } from '../../src/config/story';
import type { Quest } from '../../src/content/types';
const out = process.argv[2] ?? 'script-book';
mkdirSync(out, { recursive: true });
const packs: [string, string, Quest[]][] = [
  ['01-side-stories', "Hazel's Grove side stories (S1–S22)", [...C.SIDE_STORIES_FUN, ...C.SIDE_STORIES_MAIN, ...C.SIDE_STORIES_FUN_2, ...C.SIDE_STORIES_NEW_1, ...C.SIDE_STORIES_NEW_2, ...C.SIDE_STORIES_NEW_3, ...C.SIDE_STORIES_NEW_4].sort((a, b) => Number(a.code.slice(1)) - Number(b.code.slice(1)))],
  ['02-fun-python', 'Fun quests: Monty Python (Q1–Q20)', C.QUESTS_PYTHON],
  ['03-fun-bean', 'Fun quests: Mr. Bean (Q21–Q30)', C.QUESTS_BEAN],
  ['04-fun-sunny', "Fun quests: It's Always Sunny (Q31–Q45, adults only)", C.QUESTS_SUNNY],
  ['05-fun-avatar', 'Fun quests: Avatar: The Last Airbender (Q46–Q65)', C.QUESTS_AVATAR],
  ['06-neopia-line', 'Neopia line (NP1–NP13)', C.NEOPIA_LINE],
  ['07-neopia-quests', 'Neopia quests (NQ1–NQ32)', C.NEOPIA_QUESTS],
  ['08-mv-ironman', 'Multiverse: Iron Man (IM1–IM15)', C.MV_IRONMAN],
  ['09-mv-cap', 'Multiverse: Captain America (CA1–CA10)', C.MV_CAP],
  ['10-mv-doom', 'Multiverse: Doom and the Fantastic Four (FF1–FF10)', C.MV_DOOM],
  ['11-mv-ultron', 'Multiverse: Ultron (UL1–UL10)', C.MV_ULTRON],
  ['12-mv-moonknight', 'Multiverse: Moon Knight (MK1–MK8)', C.MV_MOONKNIGHT],
  ['13-mv-spawn', 'Multiverse: Spawn (SP1–SP8)', C.MV_SPAWN],
  ['14-mv-dragonball', 'Multiverse: Dragon Ball (DB1–DB20)', C.MV_DRAGONBALL],
  ['15-mv-toystory', 'Multiverse: Toy Story (TS1–TS12)', C.MV_TOYSTORY],
  ['16-mv-endgames', 'Multiverse: Endgames (E1–E6)', C.MV_ENDGAMES],
  ['19a-lang-hebrew', "Learning Grove: Ori's Alef-Bet, Hebrew (LH1–LH6)", C.LANG_HEBREW],
  ['19b-lang-japanese', "Learning Grove: Hana's Hiragana, Japanese (LJ1–LJ6)", C.LANG_JAPANESE],
];
const nameOf = (q: Quest, who: string) => q.speakers.find((s) => s.id === who)?.name ?? SPEAKERS[who]?.name ?? C.CAMPAIGN_SPEAKERS[who]?.name ?? who;
function scene(q: Quest, s: Scene, title: string): string {
  const out: string[] = [`#### ${title} \`${s.id}\``, ''];
  for (const l of s.lines) {
    const n = nameOf(q, l.who);
    out.push(n ? `**${n}**${l.mood && l.mood !== 'neutral' ? ` _(${l.mood})_` : ''}: ${l.text}  ` : `_${l.text}_  `);
  }
  if (s.choices?.length) {
    out.push('', '**Choices**', '');
    for (const c of s.choices) {
      out.push(`- **${c.label}**${c.set ? ` — sets \`${JSON.stringify(c.set)}\`` : ''}`);
      for (const l of c.then ?? []) { const n = nameOf(q, l.who); out.push(`    - ${n ? `**${n}**: ` : ''}${l.text}`); }
    }
  }
  if (s.set) out.push('', `Sets \`${JSON.stringify(s.set)}\``);
  return out.join('\n');
}
let index = '# Grove script book\n\nGenerated from `src/content/`. One file per pack.\n\n';
// ---- the campaign
{
  const camp = { id: 'campaign', speakers: Object.entries(C.CAMPAIGN_SPEAKERS).map(([id, v]) => ({ id, ...v })) } as unknown as Quest;
  const byId = new Map(C.CAMPAIGN_SCENES.map((s) => [s.id, s]));
  const md: string[] = ["# Hazel's Grove: the campaign", '', 'Three books, twelve chapters, eight endings. Canon: the story bible.', ''];
  const used = new Set<string>();
  const prefixOf = (n: number) => `c${n}-`;
  for (const b of C.BOOKS) {
    md.push(`## Book ${b.n}: ${b.title}`, '');
    for (const n of b.chapters) {
      const ch = C.CAMPAIGN_CHAPTERS.find((c) => c.n === n)!;
      md.push(`### Chapter ${n}: ${ch.title}`, '', `Goal: ${ch.goalText} (\`${ch.goal}\`) · Hint: ${ch.hint}`, '');
      const ids = [ch.opening, ...C.CAMPAIGN_SCENES.map((s) => s.id).filter((id) => id.startsWith(prefixOf(n)) && id !== ch.opening && id !== ch.closing), ch.closing];
      for (const id of ids) {
        const s = byId.get(id); if (!s || used.has(id)) continue; used.add(id);
        md.push(scene(camp, s, id === ch.opening ? 'Opening' : id === ch.closing ? 'Closing' : 'Scene'), '');
        if (C.CAMPAIGN_NOTES[id]) md.push(`> ${C.CAMPAIGN_NOTES[id]}`, '');
      }
    }
  }
  md.push('## Triggered scenes', '');
  for (const s of C.CAMPAIGN_SCENES.filter((s) => s.id.startsWith('t-'))) { used.add(s.id); md.push(scene(camp, s, 'Scene'), ''); if (C.CAMPAIGN_NOTES[s.id]) md.push(`> ${C.CAMPAIGN_NOTES[s.id]}`, ''); }
  md.push('## Endings', '');
  for (const [id, e] of Object.entries(C.CAMPAIGN_ENDINGS)) md.push(`- **${e.title}** (\`${id}\`): ${e.how}`);
  md.push('');
  for (const s of C.CAMPAIGN_SCENES.filter((s) => s.id.startsWith('end-'))) { used.add(s.id); md.push(scene(camp, s, 'Ending scene'), ''); if (C.CAMPAIGN_NOTES[s.id]) md.push(`> ${C.CAMPAIGN_NOTES[s.id]}`, ''); }
  const rest = C.CAMPAIGN_SCENES.filter((s) => !used.has(s.id));
  if (rest.length) { md.push('## Other scenes', ''); for (const s of rest) md.push(scene(camp, s, 'Scene'), ''); }
  writeFileSync(`${out}/00-campaign.md`, md.join('\n'));
  index += "- [Hazel's Grove: the campaign (12 chapters, 8 endings)](00-campaign.md)\n";
  const v: string[] = ['# Side-story variant scenes (S2, S9, S10, S13, S19)', ''];
  for (const s of [...C.SIDE_STORIES_MAIN_VARIANTS, ...C.SIDE_STORIES_FUN_2_VARIANTS, ...C.SIDE_STORIES_NEW_3_VARIANTS]) v.push(scene(camp, s, 'Variant'), '');
  writeFileSync(`${out}/01b-side-story-variants.md`, v.join('\n'));
  index += '- [Side-story variant scenes](01b-side-story-variants.md)\n';
}
// Packs printed with their variant scenes. Kept out of `packs` so the Learning Grove pages, which look
// quests up in `packs`, print exactly as before.
const S23_31 = [C.SIDE_STORY_S23, C.SIDE_STORY_S24, C.SIDE_STORY_S25, C.SIDE_STORY_S26, C.SIDE_STORY_S27, C.SIDE_STORY_S28, C.SIDE_STORY_S29, C.SIDE_STORY_S30, C.SIDE_STORY_S31];
const S23_31_VARIANTS = [C.SIDE_STORY_S23_VARIANTS, C.SIDE_STORY_S24_VARIANTS, C.SIDE_STORY_S25_VARIANTS, C.SIDE_STORY_S26_VARIANTS, C.SIDE_STORY_S27_VARIANTS, C.SIDE_STORY_S28_VARIANTS, C.SIDE_STORY_S29_VARIANTS, C.SIDE_STORY_S30_VARIANTS, C.SIDE_STORY_S31_VARIANTS];
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
const withVariants: [string, string, Quest[], Scene[]][] = [
  ['01c-side-stories-s23-s31', "Hazel's Grove side stories (S23–S31)", S23_31.flat(), S23_31_VARIANTS.flat()],
  ...ATLAS.map(([list, variants, name], i): [string, string, Quest[], Scene[]] => [`22-atlas-a${String(i + 1).padStart(2, '0')}`, `Atlas, page A${i + 1}: ${name}`, list, variants]),
  ...ARCADE.map(([list, variants, name], i): [string, string, Quest[], Scene[]] => [`23-arcade-pa${i + 1}`, `Pixel's Arcade, cartridge PA${i + 1}: ${name}`, list, variants]),
  ['24-line-lb', 'Learning Grove line LB: Play (LB1–LB12)', C.LINE_LB, C.LINE_LB_VARIANTS],
  ['25-line-lk', 'Learning Grove line LK: Mouse-Deer (LK1–LK10)', C.LINE_LK, C.LINE_LK_VARIANTS],
];
for (const [file, title, list, variants] of [...packs.map(([f, t, l]): [string, string, Quest[], Scene[]] => [f, t, l, []]), ...withVariants]) {
  const md: string[] = [`# ${title}`, ''];
  for (const q of list) {
    md.push(`## ${q.code}. ${q.title}`, '', `*${q.source}* · audience: ${q.audience} · where: ${q.trigger.where} · when: ${q.trigger.when}${q.requires?.length ? ` · requires: ${q.requires.join(', ')}` : ''}`, '');
    if (q.speakers.length) md.push('**Cast:** ' + q.speakers.map((s) => `${s.name}${s.basedOn ? ` (${s.basedOn})` : ''}`).join(', '), '');
    q.steps.forEach((st, i) => {
      md.push(`### Step ${i + 1}: ${st.goal}`, '', `Hint: ${st.hint} · check: \`${st.check}\``, '', scene(q, st.scene, 'Scene'), '');
      if (st.done) md.push(scene(q, st.done, 'Done'), '');
    });
    md.push(scene(q, q.complete, 'Complete'), '', '**Rewards**', '', ...q.rewards.map((r) => `- ${r.label} (${r.kind}): ${r.description}`), '');
    if (q.sets) md.push(`Sets on completion: \`${JSON.stringify(q.sets)}\``, '');
    if (q.childLines && Object.keys(q.childLines).length) md.push('**Learning Grove swaps**', '', ...Object.entries(q.childLines).map(([k, v]) => `- \`${k}\` → ${v}`), '');
    if (q.notes) md.push('**Notes:** ' + q.notes, '');
  }
  if (variants.length) {
    // Variant scenes may use any speaker in the pack, so name them from the whole cast.
    const cast = { speakers: list.flatMap((q) => q.speakers) } as unknown as Quest;
    md.push('## Variant scenes', '');
    for (const v of variants) md.push(scene(cast, v, 'Variant'), '');
  }
  writeFileSync(`${out}/${file}.md`, md.join('\n'));
  index += `- [${title}](${file}.md): ${list.length} quests${variants.length ? `, ${variants.length} variant scenes` : ''}\n`;
}
// ---- the Learning Grove (educational versions)
{
  type ES = import('../../src/content/types').EduScene;
  const allSpeakers = new Map<string, string>();
  for (const q of [...Object.values(packs).flatMap((p) => p[2]), ...withVariants.flatMap((p) => p[2])]) for (const sp of q.speakers) allSpeakers.set(sp.id, sp.name);
  const who = (id: string) => allSpeakers.get(id) ?? SPEAKERS[id]?.name ?? C.CAMPAIGN_SPEAKERS[id]?.name ?? id;
  const line = (l: { who: string; text: string; mood?: string }) => {
    const n = who(l.who);
    return n ? `**${n}**: ${l.text}  ` : `_${l.text}_  `;
  };
  const eduScene = (e: ES): string => {
    const out: string[] = [`#### \`${e.of}\``, ''];
    e.lines.forEach((l, i) => {
      out.push(line(l));
      for (const les of e.lessons.filter((x) => x.after === i)) {
        out.push('', `> **Lesson** (${les.domain}${les.standard ? `, ${les.standard}` : ''}, ${les.kind}): ${les.skill}  `);
        for (const p of les.prompt ?? []) out.push(`> ${line(p)}`);
        for (const p of les.lines ?? []) out.push(`> ${line(p)}`);
        for (const o of les.options ?? []) out.push(`> - ${o.best ? '✅ ' : ''}${o.label} → ${o.reply.map((r) => r.text).join(' ')}`);
        if (les.check) out.push(`> Check: \`${les.check}\``);
        out.push(`> _For grown-ups: ${les.parentNote}_`, '');
      }
    });
    if (e.choices?.length) {
      out.push('', '**Choices**', '');
      for (const c of e.choices) {
        out.push(`- **${c.label}**`);
        for (const l of c.then ?? []) out.push(`    - ${who(l.who) ? `**${who(l.who)}**: ` : ''}${l.text}`);
      }
      if (e.defaultChoice) out.push(`- _(left out in this band; plays as \`${e.defaultChoice}\`)_`);
    }
    return out.join('\n');
  };
  for (const band of C.EDU_BANDS) {
    const info = C.EDU_BAND_INFO[band];
    const head = `${info.label} (ages ${info.ages}${info.readAloud ? ', read aloud' : ''})`;
    const camp: string[] = [`# Learning Grove · ${head}: the campaign`, ''];
    for (const c of C.EDU_CAMPAIGN[band]) {
      camp.push(`## ${c.id}`, '');
      for (const [n, ch] of Object.entries(c.chapters)) camp.push(`- Chapter ${n}${ch.title ? ` (${ch.title})` : ''}: ${ch.goalText} · ${ch.hint}`);
      camp.push('');
      for (const e of c.scenes) camp.push(eduScene(e), '');
      if (c.endings) { camp.push('### Endings', ''); for (const [id, e] of Object.entries(c.endings)) camp.push(`- **${e.title}** (\`${id}\`): ${e.how}`); camp.push(''); }
      if (c.glossary?.length) { camp.push('### Glossary', '', ...c.glossary.map((g) => `- **${g.word}**: ${g.meaning}`), ''); }
    }
    const qs: string[] = [`# Learning Grove · ${head}: side stories and fun quests`, ''];
    for (const q of C.EDU_QUESTS[band]) {
      const orig = [...packs, ...withVariants].flatMap((p) => p[2]).find((x) => x.id === q.of);
      qs.push(`## ${orig?.code ?? ''}. ${q.title ?? orig?.title ?? q.of}`, '');
      for (const [sid, g] of Object.entries(q.goals)) qs.push(`- \`${sid}\`: ${g.goal} · _${g.hint}_`);
      qs.push('');
      for (const e of q.scenes) qs.push(eduScene(e), '');
      if (q.glossary?.length) qs.push('### Glossary', '', ...q.glossary.map((g) => `- **${g.word}**: ${g.meaning}`), '');
    }
    qs.push('## Variant scenes', '');
    for (const e of C.EDU_VARIANTS[band]) qs.push(eduScene(e), '');
    const n = band === 'sprout' ? '20' : '21';
    writeFileSync(`${out}/${n}a-edu-${band}-campaign.md`, camp.join('\n'));
    writeFileSync(`${out}/${n}b-edu-${band}-stories.md`, qs.join('\n'));
    index += `- [Learning Grove, ${head}: campaign](${n}a-edu-${band}-campaign.md)\n- [Learning Grove, ${head}: side stories and fun quests](${n}b-edu-${band}-stories.md)\n`;
  }
}
for (const course of [C.HEBREW_COURSE, C.JAPANESE_COURSE]) {
  const v: string[] = [`# ${course.title}: word list and script primer`, '', course.notes, '', '| Word | Plain | Roman | English | Say it | Topic | First taught | Band | Notes | Audio |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const w of course.vocab) v.push(`| ${w.native} | ${w.plain ?? ''} | ${w.roman} | ${w.english} | ${w.sayIt} | ${w.topic} | ${w.quest} | ${w.band} | ${w.notes ?? ''} | \`${w.audio}\` |`);
  v.push('', `## ${course.script.name} (${course.script.direction})`, '', '| Character | Name | Sound | Alt | Notes |', '| --- | --- | --- | --- | --- |', ...course.script.chars.map((c) => `| ${c.char} | ${c.name} | ${c.roman} | ${c.alt ?? ''} | ${c.notes ?? ''} |`));
  const f = course.lang === 'he' ? '19c-hebrew-words.md' : '19d-japanese-words.md';
  writeFileSync(`${out}/${f}`, v.join('\n'));
  index += `- [${course.title}: word list and script primer](${f})\n`;
}
const rd: string[] = ['# Readers', ''];
for (const r of C.READERS) {
  rd.push(`## ${r.name} (\`${r.id}\`)`, '', `Where: ${r.where}`, '', '**Intro**', '', ...r.intro.map((l) => `- ${l.text}`), '', '| When | Reading | Learning Grove |', '| --- | --- | --- |', ...r.readings.map((x) => `| \`${x.when}\` | ${x.text} | ${x.childText ?? ''} |`), '', '**Outro**', '', ...r.outro.map((l) => `- ${l.text}`), '');
}
writeFileSync(`${out}/17-readers.md`, rd.join('\n'));
const rs: string[] = ['# Result lines', ''];
for (const s of C.RESULT_SETS) rs.push(`## ${s.id}`, '', s.screen, '', '| When | Text | Learning Grove |', '| --- | --- | --- |', ...s.lines.map((x) => `| \`${x.when}\` | ${x.text} | ${x.childText ?? ''} |`), '');
writeFileSync(`${out}/18-results.md`, rs.join('\n'));
index += '- [Readers: fortune teller, doctor, Aunt Wen, Island Mystic, the kings](17-readers.md)\n- [Result lines for every result screen and Neopia freebie](18-results.md)\n';
writeFileSync(`${out}/README.md`, index);
