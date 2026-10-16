/**
 * What the full-3D Grove does not draw yet. Each stub logs once, the first time the
 * pixel mode's feature would have shown, so a session's console lists exactly what the
 * 3D port still owes. PROGRESS.md keeps the same list.
 */
const seen = new Set<string>();

/** Log a missing 3D counterpart once per session; returns true the first time. */
export function stubOnce(name: string, detail?: string): boolean {
  if (seen.has(name)) return false;
  seen.add(name);
  console.info(`[3d stub] ${name}${detail ? `: ${detail}` : ''}`);
  return true;
}

/** The stubs that have fired so far, for the debug panel. */
export function stubsSeen(): string[] {
  return [...seen];
}
