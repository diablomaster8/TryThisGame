/**
 * Which stock scenery sprites the pixel view skips (campaign graphics C6, C7). The Fold's
 * ruined buildings and Dawn & Dusk's crest houses stand where the cottage, school and dojo
 * stand, so the story dressing in `dress-b.ts` names the kinds to hide and draws its own.
 * `world-view.ts` asks `isSceneryHidden` for each sprite in its scenery loop. Render-only
 * state: it never touches the world.
 */
let hidden: ReadonlySet<string> = new Set();

export function setHiddenScenery(kinds: ReadonlySet<string>): void {
  hidden = kinds;
}

export function isSceneryHidden(kind: string): boolean {
  return hidden.size > 0 && hidden.has(kind);
}
