/**
 * R0490 (TECH-49): Klee One now loads as Fontsource's numbered unicode-range slices
 * (vite.config.ts `woff2Only` drops its latin, cyrillic and greek faces). Every Japanese
 * character the content shows must fall inside one of those slices, or tracing would draw
 * it in the fallback face.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';

function ranges(css: string): [number, number][] {
  const out: [number, number][] = [];
  for (const m of css.matchAll(
    /\/\* klee-one-\[\d+\]-\d+-normal \*\/[^}]*unicode-range:([^;]+);/g,
  )) {
    for (const part of m[1]!.split(',')) {
      const [a, b] = part.trim().replace(/^U\+/i, '').split('-');
      const lo = parseInt(a!, 16);
      out.push([lo, b ? parseInt(b, 16) : lo]);
    }
  }
  return out;
}

function* files(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (p.endsWith('.ts')) yield p;
  }
}

/** Kana and CJK ideographs: the characters the Japanese lessons trace. */
const JAPANESE = /[぀-ヿ一-鿿]/gu;

it('every Japanese character in the content is inside a Klee One slice', () => {
  const sheet = readFileSync('node_modules/@fontsource/klee-one/400.css', 'utf8');
  const slices = ranges(sheet);
  expect(slices.length).toBeGreaterThan(50);
  const seen = new Set<number>();
  for (const f of [...files('src/content'), ...files('src/config')]) {
    for (const ch of readFileSync(f, 'utf8').match(JAPANESE) ?? []) seen.add(ch.codePointAt(0)!);
  }
  expect(seen.size).toBeGreaterThan(0);
  const missing = [...seen].filter((c) => !slices.some(([lo, hi]) => c >= lo && c <= hi));
  expect(missing.map((c) => String.fromCodePoint(c))).toEqual([]);
});
