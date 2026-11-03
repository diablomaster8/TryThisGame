/**
 * R0346 (FUN-57): reads the logged playtest sessions in `docs/playtest-sessions/` (everything
 * but TEMPLATE.md) and applies the sheet's scoring rule: a moment marked N in 3 of 5 sessions
 * is reworked. Prints how many sessions each audience has (the check closes with one of each)
 * and lists the moments to rework. Run: `npx tsx tests/tools/playtest-tally.ts`.
 * The marks come from people watching people; nothing here makes them up.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

export type Mark = 'L' | 'S' | 'N' | 'C' | '-';
export interface Session {
  file: string;
  audience: string;
  marks: Map<number, Mark>;
}

const MARKS = new Set(['L', 'S', 'N', 'C', '-']);

/** Parses one session file; `null` when it is still the unfilled template (no audience chosen). */
export function parseSession(file: string, text: string): Session | null {
  const aud = /^Audience:\s*(.+)$/m.exec(text)?.[1]?.trim() ?? '';
  const audience = aud === 'adult' || aud === 'parent-child' ? aud : '';
  const marks = new Map<number, Mark>();
  for (const m of text.matchAll(/^\|\s*(\d+)\s*\|[^|]*\|\s*([A-Za-z-])\s*\|/gm)) {
    const mark = m[2]!.toUpperCase();
    if (MARKS.has(mark)) marks.set(Number(m[1]), mark as Mark);
  }
  if (!audience) return null;
  return { file, audience, marks };
}

/** The moments marked N in at least `need` of the sessions (3 of 5 by the sheet's rule). */
export function toRework(sessions: readonly Session[], need = 3): number[] {
  const nothing = new Map<number, number>();
  for (const s of sessions)
    for (const [n, mark] of s.marks) if (mark === 'N') nothing.set(n, (nothing.get(n) ?? 0) + 1);
  return [...nothing]
    .filter(([, c]) => c >= need)
    .map(([n]) => n)
    .sort((a, b) => a - b);
}

export function loadSessions(dir: string): Session[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'TEMPLATE.md')
    .map((f) => parseSession(f, fs.readFileSync(path.join(dir, f), 'utf8')))
    .filter((s): s is Session => s !== null);
}

if (process.argv[1] && /playtest-tally/.test(process.argv[1])) {
  const sessions = loadSessions(path.resolve('docs/playtest-sessions'));
  const by = (a: string): number => sessions.filter((s) => s.audience === a).length;
  console.log(`sessions logged: adult ${by('adult')}, parent-child ${by('parent-child')}`);
  const rework = toRework(sessions);
  console.log(
    rework.length ? `rework (N in 3+ sessions): ${rework.join(', ')}` : 'rework: none yet',
  );
  console.log(
    by('adult') > 0 && by('parent-child') > 0
      ? 'R0346 done-when met: one session per audience'
      : 'R0346 still open: needs a real session for each audience',
  );
}
