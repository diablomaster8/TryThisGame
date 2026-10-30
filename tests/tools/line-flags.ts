/**
 * Lane C round 7 (R0595, CAMP-03): a questline's checks may name only its own flags. Each
 * line now keeps its own flags beside Hazel's Grove, so a `flag:` or `choice:` term naming a
 * flag the line never sets would read as never met (or, worse, was written for Hazel's).
 * Hazel's flags are read through `spine:<flag>`, explicitly. Content-check runs this; a
 * Vitest test feeds it a broken storyline.
 */
import type { Scene } from '../../src/config/story';
import type { Storyline } from '../../src/content/types';

/** The flags a storyline's scenes and choices set. */
function sceneFlags(s: Storyline): Set<string> {
  const out = new Set<string>();
  const scenes: Scene[] = [
    ...s.chapters.flatMap((ch) => [
      ch.opening,
      ch.closing,
      ...(ch.beats ?? []).map((b) => b.scene),
    ]),
    ...s.extra,
  ];
  for (const sc of scenes) {
    for (const k of Object.keys(sc.set ?? {})) out.add(k);
    for (const ch of sc.choices ?? []) for (const k of Object.keys(ch.set ?? {})) out.add(k);
  }
  return out;
}

/** The flag names a rule source writes (`c.flags.x =`, `c.flags['x'] =`, template prefixes). */
export function ruleFlags(source: string): Set<string> {
  const out = new Set<string>();
  for (const m of source.matchAll(/c\.flags(?:\.([A-Za-z_]\w*)|\['([^']+)'\]|\[`([^`$]+)\$\{)/g))
    out.add(m[1] ?? m[2] ?? `${m[3]}*`);
  return out;
}

/** Problems: each `flag:`/`choice:` term a line's checks use that the line never sets. */
export function lineFlagProblems(
  lines: readonly Storyline[],
  rules: Readonly<Record<string, Set<string>>>,
  hazel: ReadonlySet<string>,
): string[] {
  const problems: string[] = [];
  for (const s of lines) {
    const own = new Set([...sceneFlags(s), ...(rules[s.id] ?? [])]);
    const owns = (f: string): boolean =>
      own.has(f) || [...own].some((o) => o.endsWith('*') && f.startsWith(o.slice(0, -1)));
    const checks = s.chapters.flatMap((ch) => [ch.goal, ...(ch.beats ?? []).map((b) => b.when)]);
    for (const check of checks)
      for (const term of check.split(/[|&]/)) {
        const t = term.trim().split(':');
        if ((t[0] !== 'flag' && t[0] !== 'choice') || !t[1] || owns(t[1])) continue;
        problems.push(
          hazel.has(t[1])
            ? `${s.id}: reads Hazel's flag ${t[1]} (use spine:${t[1]})`
            : `${s.id}: reads flag ${t[1]}, which it never sets`,
        );
      }
  }
  return problems;
}
