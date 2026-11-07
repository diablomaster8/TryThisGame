import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * BS-01 (bug sweep 2026-11-06): a card opened while the title is up (Your saves moved, slot
 * rename, compare, visit) is appended after `.title` in the same layer. `.modal` is z-index 16
 * and `.title` is 20, so the card painted underneath and its buttons could not be clicked.
 */
const css = readFileSync(join(__dirname, '../../src/style.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

function zOf(selector: RegExp): number {
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (selector.test(m[1]!)) {
      const z = /z-index:\s*(\d+)/.exec(m[2]!);
      if (z) return Number(z[1]);
    }
  }
  return -1;
}

describe('title screen layering', () => {
  it('paints a modal or sheet opened over the title above the title', () => {
    const title = zOf(/^\s*\.title\s*$/);
    expect(title).toBeGreaterThan(0);
    expect(zOf(/\.title ~ \.modal/)).toBeGreaterThan(title);
    expect(zOf(/\.title ~ \.sheet/)).toBeGreaterThan(title);
  });
});
