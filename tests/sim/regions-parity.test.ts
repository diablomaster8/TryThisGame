import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OUTER_PROPS } from '../../src/config/outer-ring';
import { VILLAGE } from '../../src/config/region-village';

/**
 * R0131 (WORLD-65): every placed piece in the world data has a drawing in both renderers.
 * A static check of the renderer sources, so adding a piece to the data without drawing it
 * in Pixel and in Full 3D fails here.
 */
const src = (p: string) => readFileSync(new URL(`../../src/${p}`, import.meta.url), 'utf8');

/** The top-level keys of an object literal `name = { key: ..., 'key-2': ..., short, }`. */
function keysOf(text: string, name: string): Set<string> {
  const start = text.indexOf(name);
  expect(start, `${name} not found`).toBeGreaterThanOrEqual(0);
  const rest = text.slice(start);
  const body = rest.slice(0, rest.indexOf('\n};'));
  const keys = new Set<string>();
  for (const m of body.matchAll(/^ {2}'?([a-z][a-z-]*)'?[:,(]/gm)) keys.add(m[1]!);
  return keys;
}

describe('R0131: renderer parity for the world data', () => {
  it('every outer-ring art has a pixel painter and a 3D piece', () => {
    const px = keysOf(src('render/paint/outer-ring.ts'), 'export const OUTER_PAINTERS');
    const three = keysOf(src('render3d/outer-ring.ts'), 'const BUILD');
    const ring3d = src('render3d/outer-ring.ts');
    const wild3d = src('render3d/wild.ts');
    const missing: string[] = [];
    for (const art of new Set(OUTER_PROPS.map((p) => p.art))) {
      if (!px.has(art)) missing.push(`pixel:${art}`);
      const drawn3d =
        three.has(art) || ring3d.includes(`p.art === '${art}'`) || wild3d.includes(`'${art}'`);
      if (!drawn3d) missing.push(`3d:${art}`);
    }
    expect(missing).toEqual([]);
  });

  it('every village service and dressing set is drawn in both renderers', () => {
    const px = src('render/paint/village.ts') + src('render/region-village.ts');
    const three = src('render3d/village-square.ts');
    const names = [...VILLAGE.buildings.map((b) => b.id), ...VILLAGE.dressing];
    const missing = names.flatMap((n) => [
      ...(px.includes(n) ? [] : [`pixel:${n}`]),
      ...(three.includes(n) ? [] : [`3d:${n}`]),
    ]);
    expect(missing).toEqual([]);
  });
});
