import type { SceneStage } from './story';
import { BEETLE_STAGES } from './scene-stages-beetle';
import { DAWNDUSK_STAGES } from './scene-stages-dawndusk';
import { HAZEL_STAGES } from './scene-stages-hazel';
import { HUNDRED_STAGES } from './scene-stages-hundred';
import { LOGGED_STAGES } from './scene-stages-logged';
import { PKG_P_STAGES } from './scene-stages-pkg-p';
import { PKG_S_STAGES } from './scene-stages-pkg-s';
import { PKG_K_STAGES } from './scene-stages-pkg-k';
import { PKG_W_STAGES } from './scene-stages-pkg-w';
import { PKG_X_STAGES } from './scene-stages-pkg-x';
import { PKG_Y_STAGES } from './scene-stages-pkg-y';
import { PKG_U_STAGES } from './scene-stages-pkg-u';
import { PKG_F4_STAGES } from './scene-stages-pkg-f4';
import { PKG_A1_STAGES } from './scene-stages-pkg-a1';
import { PKG_A2_STAGES } from './scene-stages-pkg-a2';
import { PKG_B4_STAGES } from './scene-stages-pkg-b4';
import { PKG_C4_STAGES } from './scene-stages-pkg-c4';
import { PKG_D4_STAGES } from './scene-stages-pkg-d4';
import { PKG_E4_STAGES } from './scene-stages-pkg-e4';
import { PKG_U4_STAGES } from './scene-stages-pkg-u4';

/**
 * Staging authored beside the scripts rather than in them (campaign graphics C1): a scene's
 * own `stage` wins, field by field, over its entry here. Keyed by scene id. One file per
 * campaign, merged here. Package E's `E_STAGES` (tuning-e.ts) sits under these: where a
 * field is set in both, this one wins, so entries leave out what E already seats. The second
 * pass's package overlays (`scene-stages-pkg-<pkg>.ts`, test data) sit under the content
 * files, field by field: where both set a field, the content file's wins.
 */
/**
 * Two stages over one scene: `top` wins field by field, and `props` and `lights` merge key by
 * key, so two packages can each add a prop or a light to the same scene.
 */
function layer(under: SceneStage | undefined, top: SceneStage): SceneStage {
  if (!under) return top;
  const out: SceneStage = { ...under, ...top };
  if (under.props && top.props) out.props = { ...under.props, ...top.props };
  if (under.lights && top.lights) out.lights = { ...under.lights, ...top.lights };
  return out;
}

/** The second pass's package overlays, layered in package order. */
const OVERLAYS: Readonly<Record<string, SceneStage>> = (() => {
  const out: Record<string, SceneStage> = {};
  for (const pkg of [
    PKG_P_STAGES,
    PKG_S_STAGES,
    PKG_K_STAGES,
    PKG_W_STAGES,
    PKG_X_STAGES,
    PKG_Y_STAGES,
    PKG_U_STAGES,
    PKG_F4_STAGES,
    PKG_A1_STAGES,
    PKG_A2_STAGES,
    PKG_B4_STAGES,
    PKG_C4_STAGES,
    PKG_D4_STAGES,
    PKG_E4_STAGES,
    PKG_U4_STAGES,
  ])
    for (const [id, st] of Object.entries(pkg)) out[id] = layer(out[id], st);
  return out;
})();

const CONTENT: Readonly<Record<string, SceneStage>> = {
  ...HAZEL_STAGES,
  ...HUNDRED_STAGES,
  ...LOGGED_STAGES,
  ...BEETLE_STAGES,
  ...DAWNDUSK_STAGES,
};

/** Overlays under content, field by field: a package may add a field to a content scene. */
function merged(): Record<string, SceneStage> {
  const out: Record<string, SceneStage> = { ...OVERLAYS };
  for (const [id, st] of Object.entries(CONTENT)) out[id] = layer(out[id], st);
  return out;
}

export const SCENE_STAGES: Readonly<Record<string, SceneStage>> = merged();
