/**
 * Prints the quests per region (or story area): counts, then codes.
 * Run with `npx tsx tests/tools/where-report.ts`.
 */
import { REGION_ORDER, STORY_AREAS } from '../../src/config/regions';
import { areaOf } from '../../src/content/where-map';
import { packs } from './quest-packs';

const byArea = new Map<string, string[]>();
for (const q of Object.values(packs).flat()) {
  const a = areaOf(q);
  const key = a ? a.region : 'none';
  const list = byArea.get(key) ?? [];
  list.push(q.code);
  byArea.set(key, list);
}
const order = [...REGION_ORDER, ...STORY_AREAS, 'none'];
for (const key of order) {
  const codes = byArea.get(key);
  if (!codes) continue;
  console.log(`${key}: ${codes.length}`);
  console.log(`  ${codes.join(' ')}`);
}
