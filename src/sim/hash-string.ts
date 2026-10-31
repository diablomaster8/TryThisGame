/** FNV-1a: a stable 32-bit hash of a string (seeds, picks by id). A leaf, so renderers and
 * workers can use it without loading the Hollow sim. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
