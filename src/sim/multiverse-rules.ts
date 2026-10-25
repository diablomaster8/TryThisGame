/**
 * The Multiverse endgames' branches, as data the runner can ask (mv-endgames.ts header and
 * the E1 and E6 notes). A quest step has no condition field, so the steps that play only
 * on one path are named here by id; every other step always plays. The flags are the
 * whole Multiverse save's (`lineContext`), so E6 can read what E1 to E5 decided. Pure.
 */
import type { LineFlags } from './atlas';
import type { World } from './types';

/** A read-only fact the shelf adds: the save holds a reflection of a Grove Eternal (E6). */
export const REFLECTION_FLAG = 'mv-reflection';

/**
 * A read-only fact the shelf adds: the Grove owns the plush Nubbin from fun quest Q12
 * (Just Resting). The Toy Story line's header: without it, skip every line spoken by
 * `ts-plush` and every line whose text says "plush"; each scene reads cleanly without them.
 */
export const PLUSH_FLAG = 'mv-plush-owned';

/** The Grove keepsake that is the plush Nubbin. */
export const PLUSH_KEEPSAKE = 'plush-nubbin';

/** The scene that opens E6 (the reflection is made as it plays). */
export const E6_GATE_SCENE = 'mv-e6-gate';

/** E6's core, where the 'eternal' ending gives the reflection up. */
export const E6_CORE_SCENE = 'mv-e6-corescene';

const cw = (v: string) => (f: LineFlags) => f['mv-cw'] === v;
const doom = (v: string) => (f: LineFlags) => f['mv-doom'] === v;
const done = (e: string) => (f: LineFlags) => f[e] === true;
const mk = (v: string) => (f: LineFlags) => f['mv-e3'] === true && f['mv-mk'] === v;
const ending = (v: string) => (f: LineFlags) => f['mv-e6-ending'] === v;

const STEPS: Record<string, (f: LineFlags) => boolean> = {
  // E1: the registration path or the resistance path.
  'mv-e1-reg-s3': cw('registration'),
  'mv-e1-reg-s4': cw('registration'),
  'mv-e1-res-s3': cw('resistance'),
  'mv-e1-res-s4': cw('resistance'),
  // E6: the allies come from the earlier endgames' choices, the endings from the core.
  'mv-e6-ally-reg': cw('registration'),
  'mv-e6-ally-res': cw('resistance'),
  'mv-e6-doom-ally': doom('ally'),
  'mv-e6-doom-rival': doom('rival'),
  'mv-e6-mk-power': mk('power'),
  'mv-e6-mk-free': mk('free'),
  'mv-e6-goku': done('mv-e4'),
  'mv-e6-toys': done('mv-e5'),
  'mv-e6-end-trap': ending('trap'),
  'mv-e6-end-wish': ending('wish'),
  'mv-e6-end-eternal': ending('eternal'),
  'mv-e6-after-reg': cw('registration'),
  'mv-e6-after-res': cw('resistance'),
  'mv-e6-after-doom-ally': doom('ally'),
  'mv-e6-after-doom-rival': doom('rival'),
  'mv-e6-after-armageddon': done('mv-e3'),
  'mv-e6-after-goku': done('mv-e4'),
  'mv-e6-after-toys': done('mv-e5'),
};

export function multiverseStepLive(stepId: string, flags: LineFlags): boolean {
  return STEPS[stepId]?.(flags) ?? true;
}

/** E6's core: the wish needs E4's saved wish, the Eternal ending a reflection to give. */
export function multiverseChoiceLive(sceneId: string, choiceId: string, flags: LineFlags): boolean {
  if (sceneId !== E6_CORE_SCENE) return true;
  if (choiceId === 'wish') return flags['mv-wish'] === 'saved';
  if (choiceId === 'eternal') return flags[REFLECTION_FLAG] === true;
  return true;
}

/** Toy Story's plush lines, spoken only when the Grove owns the plush (TS1–TS12). */
export function multiverseLineLive(
  sceneId: string,
  line: { who: string; text: string },
  flags: LineFlags,
): boolean {
  if (!sceneId.startsWith('mv-ts') || flags[PLUSH_FLAG] === true) return true;
  return line.who !== 'ts-plush' && !/\bplush\b/i.test(line.text);
}

/** Whether the Grove holds the plush Nubbin (Q12's keepsake), read-only. */
export function ownsPlush(world: Pick<World, 'inventory'> | null | undefined): boolean {
  return world?.inventory.keepsakes.includes(PLUSH_KEEPSAKE) ?? false;
}
