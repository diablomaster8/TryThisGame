import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fmt } from '../../src/config/icu';
import { MESSAGES_EN } from '../../src/config/messages-en';
import { pseudo, sampleArgs, unpseudo } from '../tools/pseudo-locale';

const modules = import.meta.glob('../../src/config/strings*.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
}

/** Static English labels passed straight to `button(X_TEXT.a.b, ...)` in the UI. */
function buttonLabels(): { ref: string; text: string }[] {
  const exports: Record<string, unknown> = {};
  for (const m of Object.values(modules)) Object.assign(exports, m);
  const seen = new Map<string, string>();
  for (const f of walk(path.resolve(__dirname, '../../src/ui'))) {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/\bbutton\(\s*([A-Z][A-Z0-9_]*_TEXT(?:\.\w+)+)\s*[,)]/g)) {
      const ref = m[1]!;
      const [root, ...rest] = ref.split('.');
      let v: unknown = exports[root!];
      for (const k of rest) v = (v as Record<string, unknown> | undefined)?.[k];
      if (typeof v === 'string') seen.set(ref, v);
    }
  }
  return [...seen].map(([ref, text]) => ({ ref, text }));
}

describe('pseudo-locale (R0345)', () => {
  it('every catalogue message round-trips through the pseudo-locale', () => {
    for (const [k, m] of Object.entries(MESSAGES_EN)) {
      for (const n of [0, 1, 2, 5]) {
        const args = sampleArgs(m, n);
        const plain = fmt(m, args);
        const fancy = fmt(pseudo(m), args);
        expect(unpseudo(fancy), `${k} n=${n}`).toBe(plain);
        expect(fancy.length, k).toBeGreaterThanOrEqual(plain.length);
      }
    }
  });

  it('pads literal text by about 40% and brackets it', () => {
    const out = fmt(pseudo('Restore backup'), {});
    expect(out.startsWith('[') && out.endsWith(']')).toBe(true);
    expect(out.length).toBeGreaterThanOrEqual(Math.ceil('Restore backup'.length * 1.4));
  });

  it('button labels stay within the length budget when expanded 40%', () => {
    const buttons = buttonLabels();
    expect(buttons.length).toBeGreaterThan(20);
    // Budget: 18 English characters (25 with +40%). The current over-budget count is a ceiling
    // that can only go down; a new long button label raises it and fails here.
    const over = buttons.filter((b) => b.text.length > 18).map((b) => b.ref);
    expect(over.length, `over-budget buttons: ${over.join(', ')}`).toBeLessThanOrEqual(
      OVER_CEILING,
    );
    for (const b of buttons)
      expect(pseudo(b.text).length, b.ref).toBeLessThanOrEqual(Math.ceil(b.text.length * 1.4) + 2);
  });
});

const OVER_CEILING = 19;
