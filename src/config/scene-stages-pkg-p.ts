import type { SceneStage, StageCast } from './story';

/**
 * Campaign graphics 2, package p: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins field by
 * field), so these entries add only the `cast` the content files do not carry yet.
 *
 * For the content wave to keep and extend (C1): a cast entry on every storyline scene whose
 * speakers have no sim NPC, `{ who: 'h-ida', mark: 'gate', face: 'you' }` and so on, with
 * `carry` for N3 ('broom' Sorrel, 'egg' Ida, 'notebook' Vane, 'keys' Marigold). H9: `c12-open`
 * wants `place: 'festival'` (content has 'grove'). M13: `c11-open` wants
 * `shot: { kind: 'two', then: 'close', focus: ['hazel'] }`. C6 needs no data: Moss is grey
 * while he is on the hill (`mossOnHill`), or on a cast entry with `tint: 'weathered'`.
 */

/** H9: every Hazel Keeper on a mark of the festival ring, facing in. */
const FESTIVAL_RING: StageCast[] = [
  'corvin',
  'hazel',
  'fern',
  'marina',
  'sparks',
  'clover',
  'pixel',
  'luna',
  'ember',
  'byte',
  'dusty',
  'nova',
].map((who, i) => ({ who, mark: `festival-${i + 1}` }));

export const PKG_P_STAGES: Readonly<Record<string, SceneStage>> = {
  // The Hundred Days ch1: Ida on the one whole step past the gate.
  'h-c1-open': { cast: [{ who: 'h-ida', mark: 'gate-outside', face: 'you' }] },
  // The Hundred Days ch2: Ida hands the broom on; Sorrel is not in this scene, so Ida holds it.
  'h-c2-open': { cast: [{ who: 'h-ida', mark: 'fold-door-1', face: 'you', carry: 'broom' }] },
  // Dawn & Dusk ch6: Marigold in front of the houses, with her keys (the green itself is
  // hidden from the Keeper's side by the houses until the building fades land).
  'dawn-c6-open': {
    cast: [
      { who: 'd-marigold', mark: 'keeper-green', face: 'you', carry: 'keys' },
      { who: 'you', mark: 'green' },
    ],
  },
  // Hazel ch12: the festival crowd.
  'c12-open': { cast: FESTIVAL_RING },
};
