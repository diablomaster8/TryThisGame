import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * TECH-79: every control stays 44 px or larger. A browser spec that opens every panel is the
 * full check; this one runs with the unit tests and stops the usual slip: a stylesheet rule
 * that sizes a button, select or settings row below 44 px, or a settings row built from
 * something other than a <label> (so the whole row is not the tap target).
 */
const MIN = 44;
const SRC = join(__dirname, '../../src');

function files(dir: string, ext: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith(ext))
    .map((f) => join(dir, f));
}

/** Innermost rule blocks of a stylesheet, comments dropped: [selector, body]. */
function rules(css: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (let m = re.exec(clean); m; m = re.exec(clean)) out.push([m[1]!.trim(), m[2]!]);
  return out;
}

/** A plain length in CSS px (rem and em at 16 px), or null for calc(), var() and the like. */
function px(v: string): number | null {
  const m = /^\s*([0-9.]+)(px|rem|em)\s*(!important)?\s*$/.exec(v);
  if (!m) return null;
  return m[2] === 'px' ? Number(m[1]) : Number(m[1]) * 16;
}

const CONTROL =
  /(\.btn\b|\.btn-[a-z-]+|(^|[\s,>+~])select\b|(^|[\s,>+~])button\b|\.(radio|check|field)-row)/;
/** The box inside a settings row is not the target: the row (a label) is. */
const IN_ROW = /\.(radio|check|field)-row\s+input\b/;

const sheets = files(SRC, '.css').map((f) => [f, readFileSync(f, 'utf8')] as const);

describe('tap targets (TECH-79)', () => {
  it('no stylesheet sizes a control under 44 px', () => {
    const small: string[] = [];
    for (const [file, css] of sheets) {
      for (const [selector, body] of rules(css)) {
        const parts = selector.split(',').filter((s) => CONTROL.test(s) && !IN_ROW.test(s));
        if (parts.length === 0) continue;
        for (const decl of body.split(';')) {
          const [prop, value] = decl.split(':').map((s) => s.trim());
          if (!prop || !value || !/^(min-)?(height|width)$/.test(prop)) continue;
          const v = px(value);
          if (v !== null && v < MIN)
            small.push(`${file}: ${parts.join(',')} { ${prop}: ${value} }`);
        }
      }
    }
    expect(small).toEqual([]);
  });

  it('the base rules hold every button, select and settings row at 44 px', () => {
    const css = sheets.find(([f]) => f.endsWith('style.css'))![1];
    const all = rules(css);
    const minOf = (sel: string, prop: string): number => {
      let best = 0;
      for (const [s, body] of all) {
        if (!s.split(',').some((p) => p.trim() === sel)) continue;
        const m = new RegExp(`(^|;)\\s*${prop}\\s*:\\s*([^;]+)`).exec(body);
        const v = m ? px(m[2]!) : null;
        if (v !== null) best = Math.max(best, v);
      }
      return best;
    };
    for (const sel of ['.btn', '.btn-small']) {
      expect(minOf(sel, 'min-height'), sel).toBeGreaterThanOrEqual(MIN);
      expect(minOf(sel, 'min-width'), sel).toBeGreaterThanOrEqual(MIN);
    }
    for (const sel of ['select', '.radio-row', '.check-row', '.field-row']) {
      expect(minOf(sel, 'min-height'), sel).toBeGreaterThanOrEqual(MIN);
    }
  });

  it('settings rows are labels, so the whole row is tappable', () => {
    const wrong: string[] = [];
    for (const file of files(SRC, '.ts')) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        const made = /el\('(\w+)', '(?:[\w-]+ )*(radio|check|field)-row\b/.exec(line);
        if (made && made[1] !== 'label') wrong.push(`${file}:${i + 1}`);
        if (/\.className = '(?:[\w-]+ )*(radio|check|field)-row\b/.test(line)) {
          const before = lines.slice(Math.max(0, i - 3), i).join('\n');
          if (!/createElement\('label'\)/.test(before)) wrong.push(`${file}:${i + 1}`);
        }
      });
    }
    expect(wrong).toEqual([]);
  });
});
