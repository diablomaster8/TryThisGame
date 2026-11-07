import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ACCESS_TEXT } from '../../src/config/strings-access-r10';
import { accessOf } from '../../src/sim/access';
import { createWorld } from '../../src/sim/world';

describe('dyslexia-friendly font option (R0709)', () => {
  it('resolves the saved choice and offers it in the settings list', () => {
    const w = createWorld(1, 0);
    expect(accessOf(w).font).toBe('default');
    w.settings.access = { font: 'dyslexia' };
    expect(accessOf(w).font).toBe('dyslexia');
    expect(Object.keys(ACCESS_TEXT.fonts)).toEqual(['default', 'readable', 'dyslexia']);
  });
  it('ships Lexend with its licence, pinned, and loads it only from the lazy loader', () => {
    expect(existsSync('public/licences/lexend-OFL.txt')).toBe(true);
    expect(readFileSync('public/licences/lexend-OFL.txt', 'utf8')).toContain(
      'SIL OPEN FONT LICENSE',
    );
    expect(readFileSync('CREDITS.md', 'utf8')).toContain('@fontsource/lexend');
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.dependencies['@fontsource/lexend']).toMatch(/^\d+\.\d+\.\d+$/);
    expect(pkg.devDependencies['axe-core']).toMatch(/^\d+\.\d+\.\d+$/);
    for (const f of ['src/ui/access-r10.ts', 'src/main.ts', 'src/ui/hud.ts']) {
      expect(readFileSync(f, 'utf8')).not.toMatch(/@fontsource\/lexend/);
    }
    expect(readFileSync('src/ui/access-font.ts', 'utf8')).toContain(
      "import('@fontsource/lexend/400.css')",
    );
  });
});
