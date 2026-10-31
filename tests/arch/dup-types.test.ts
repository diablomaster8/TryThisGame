import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * TECH-39: an exported type name declared in two places lets an auto-import pick the wrong
 * one without a sound. `src/content` is left out (its story types are one family).
 *
 * The names below were already declared twice when the check landed, each pair in unrelated
 * corners (a battle `Cell` and a dungeon `Cell`, say). They are frozen here: a new duplicate
 * fails, and so does a listed name that stops being duplicated, so the list only shrinks.
 */
const LEGACY = [
  'Band',
  'Cell',
  'Clip',
  'Crest',
  'Expression',
  'KeeperColors',
  'Layout',
  'Look',
  'Mark',
  'Mood',
  'Objective',
  'Piece',
  'Placement',
  'Pt',
  'RecipeId',
  'SceneryKind',
  'Side',
  'Surface',
  'TileKind',
  'TraitId',
  'Walker',
];

const ROOT = join(__dirname, '..', '..', 'src');
const DECL = /^export (?:type|interface) ([A-Za-z0-9_]+)/gm;

function tsFiles(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (relative(ROOT, p) !== 'content') tsFiles(p, out);
    } else if (e.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

export function duplicateTypeNames(): Map<string, string[]> {
  const where = new Map<string, string[]>();
  for (const file of tsFiles(ROOT)) {
    for (const m of readFileSync(file, 'utf8').matchAll(DECL)) {
      const list = where.get(m[1]!) ?? [];
      list.push(relative(ROOT, file).replaceAll('\\', '/'));
      where.set(m[1]!, list);
    }
  }
  return new Map([...where].filter(([, files]) => files.length > 1));
}

describe('exported type names (TECH-39)', () => {
  const dups = duplicateTypeNames();

  it('declares no new duplicate exported type name outside src/content', () => {
    const fresh = [...dups].filter(([name]) => !LEGACY.includes(name));
    expect(fresh.map(([n, f]) => `${n}: ${f.join(', ')}`)).toEqual([]);
  });

  it('keeps the legacy list honest: every listed name is still duplicated', () => {
    expect(LEGACY.filter((n) => !dups.has(n))).toEqual([]);
  });

  it('has one Season, one Audience, one Quest and one Vec3 outside the story files', () => {
    for (const n of ['Season', 'Audience', 'Quest', 'Vec3']) expect(dups.has(n)).toBe(false);
  });
});
