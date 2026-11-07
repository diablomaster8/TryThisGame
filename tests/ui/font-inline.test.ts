import { describe, expect, it } from 'vitest';
import config from '../../vite.config';

/**
 * BS-05 (bug sweep 2026-11-06): the CSP allows fonts from 'self' only, but Vite inlined the two
 * tiny Klee One subsets into the Learning Grove CSS as data: URIs, and the browser refused them
 * with a console error. Fonts must stay separate files.
 */
describe('build keeps fonts as files', () => {
  it('never inlines a font, and leaves other assets to the default limit', () => {
    const limit = config.build?.assetsInlineLimit;
    expect(typeof limit).toBe('function');
    const f = limit as (file: string) => boolean | undefined;
    for (const name of ['a.woff2', 'a.woff', 'a.ttf', 'a.OTF']) expect(f(`/x/${name}`)).toBe(false);
    expect(f('/x/a.png')).toBeUndefined();
  });
});
