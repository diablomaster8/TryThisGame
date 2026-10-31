import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

// The sculpt worker loads the looks and the species art. If its import graph reaches the sim
// world it also reaches the campaign ↔ side-story import cycle from the wrong end, and the
// worker dies on load (3D then sculpts on the page). Imports of types are erased, so skipped.
const ROOT = join(__dirname, '..', '..');
const IMPORT = /^(?:import|export)\s+(?!type\b)(?:[^;]*?from\s+)?'(\.[^']+)'/gms;

function graph(entry: string): Set<string> {
  const seen = new Set<string>();
  const walk = (file: string): void => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const m of readFileSync(join(ROOT, file), 'utf8').matchAll(IMPORT)) {
      const base = normalize(join(dirname(file), m[1]!))
        .split(sep)
        .join('/');
      const hit = [`${base}.ts`, `${base}/index.ts`, base].find((c) => existsSync(join(ROOT, c)));
      if (hit?.endsWith('.ts')) walk(hit);
    }
  };
  walk(entry);
  return seen;
}

describe('sculpt worker import graph', () => {
  it('never loads the sim world or the campaign', () => {
    const files = graph('src/render3d/sculpt-worker.ts');
    expect(files.size).toBeGreaterThan(10);
    expect(
      [...files].filter((f) => /^src\/sim\/(world|campaign|side-stories)\.ts$/.test(f)),
    ).toEqual([]);
  });
});
