/**
 * R0613 (CAMP-21): the open world's unlock graph, one readable gate per area, line or door. A gate
 * is an expression in the grammar of `sim/gates.ts`:
 *
 *   term  := key:arg   (`spine:ch>=3`, `spine:ending`, `ending:dawn`, `ending:dawn:whole-day`,
 *                       `quest:s5`, `flag:spine.mossFaded`, `unlock:sunGrove`, `audience:teen`,
 *                       `gate:<id>` for another gate, `any`)
 *   expr  := term (& term)* (| ...) with `!term` and `( ... )`; `&` binds tighter than `|`.
 *
 * The region chapters are the ones `STORY_REGION_TUNING.opensAt` uses (a test keeps them equal).
 * The Hollow Below opens at chapter 8, where the Hollow is first visited, as it always has; the
 * proposal's chapter 9 is left to the writers (see PROGRESS.md).
 */
export const GATES: Readonly<Record<string, string>> = {
  // Regions of the lines (sim/story-regions.ts): by the spine's chapter.
  fold: 'spine:ch>=3',
  server: 'spine:ch>=5',
  hollow: 'spine:ch>=8 | spine:ending',
  sunRegion: 'spine:ch>=6',
  moonRegion: 'spine:ch>=6',
  // The Groves: the first adult of the band opens them; the spine also does, in its turn.
  sunGrove: 'unlock:sunGrove | gate:sunRegion',
  moonGrove: 'ending:dawn | unlock:moonGrove',
  // The lines themselves open in their region.
  hundred: 'gate:fold',
  logged: 'gate:server',
  beetle: 'gate:hollow',
  dawn: 'gate:sunGrove',
  dusk: 'gate:moonGrove',
  // The Valley Fair: the spine has ended and two lines have (counted in sim/epilogue.ts).
  fair: 'spine:ending',
  // Doors to the story worlds: they read the Grove and never write it.
  atlas: 'any',
  arcade: 'any',
  neopia: 'any',
  rift: 'audience:adult',
};
