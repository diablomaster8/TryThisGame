import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * R0500 (TECH-59): one reduced-motion helper. The setting wins over the system query when it
 * says on or off; "system" follows the live query. No other source file reads the query.
 */
describe('platform/motion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  async function load(system: boolean) {
    const q = { matches: system };
    vi.stubGlobal('matchMedia', () => q);
    const m = await import('../../src/platform/motion');
    return { m, q };
  }

  it('combines the setting with the system query', async () => {
    const { m, q } = await load(true);
    expect(m.reducedMotion()).toBe(true);
    m.setMotionPref('off');
    expect(m.reducedMotion()).toBe(false);
    m.setMotionPref('system');
    q.matches = false;
    expect(m.reducedMotion()).toBe(false);
    m.setMotionPref('on');
    expect(m.reducedMotion()).toBe(true);
    expect(m.systemReducedMotion()).toBe(false);
  });

  it('reads false without matchMedia', async () => {
    vi.stubGlobal('matchMedia', undefined);
    const m = await import('../../src/platform/motion');
    expect(m.reducedMotion()).toBe(false);
  });

  it('is the only source file that reads the media query', () => {
    const src = join(__dirname, '../../src');
    const hits = readdirSync(src, { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('.ts') && !f.includes('content'))
      .filter((f) =>
        /matchMedia\(\s*['"`]\(prefers-reduced-motion/.test(readFileSync(join(src, f), 'utf8')),
      )
      .map((f) => f.replace(/\\/g, '/'));
    expect(hits).toEqual(['platform/motion.ts']);
  });
});
