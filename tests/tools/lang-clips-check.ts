/**
 * R0445: lists the course words with no recording. Run: npx tsx tests/tools/lang-clips-check.ts
 * Exits 0 always (missing clips are known and plainly reported); exits 1 only when a clip
 * claimed in RECORDED has no file, which would be a broken promise.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { HEBREW_COURSE } from '../../src/content/lang-hebrew';
import { JAPANESE_COURSE } from '../../src/content/lang-japanese';
import { RECORDED, missingClips } from '../../src/platform/lang-audio';

const ids = [...HEBREW_COURSE.vocab, ...JAPANESE_COURSE.vocab].map((w) => w.audio);
const missing = missingClips(ids);
const broken = [...RECORDED].filter((id) => !existsSync(join('public/audio/lang', `${id}.mp3`)));
console.log(`words: ${ids.length}, recorded: ${ids.length - missing.length}, missing: ${missing.length}`);
if (process.argv.includes('--list')) for (const m of missing) console.log(`  missing ${m}`);
for (const b of broken) console.log(`BROKEN: ${b} is in RECORDED but has no file`);
process.exit(broken.length ? 1 : 0);
