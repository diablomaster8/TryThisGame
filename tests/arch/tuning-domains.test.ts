import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * TECH-36: every satellite `src/config/tuning-*.ts` and `tuning-more/*.ts` file belongs to
 * exactly one domain index in `src/config/tuning-domains/`, so a new tuning file cannot be added without a home.
 */
const dir = 'src/config';
const files = [
  ...readdirSync(dir)
    .filter((f) => /^tuning-.*\.ts$/.test(f))
    .map((f) => f.slice(0, -3)),
  // The renamed pass satellites (tests/tools/rename-config.mjs) live in tuning-more/.
  ...readdirSync(`${dir}/tuning-more`)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => `tuning-more/${f.slice(0, -3)}`),
];

describe('tuning domains', () => {
  const owners = new Map<string, string[]>();
  for (const f of readdirSync(`${dir}/tuning-domains`)) {
    const text = readFileSync(`${dir}/tuning-domains/${f}`, 'utf8');
    for (const m of text.matchAll(/export \* from '\.\.\/(tuning-[^']+)';/g)) {
      owners.set(m[1]!, [...(owners.get(m[1]!) ?? []), f]);
    }
  }

  it('puts every tuning file in exactly one domain', () => {
    for (const f of files) expect(owners.get(f), f).toHaveLength(1);
  });

  it('names no file that does not exist', () => {
    for (const f of owners.keys()) expect(files, f).toContain(f);
  });
});
