/**
 * R0450 (TECH-08) and R0466 (TECH-24): the Grove's event-to-feedback table. `groveSfx` is the
 * old sound-only table for the moments that were silent. `FEEDBACK` is the new one: for a
 * SimEvent kind, a function from the event and a small context to `{ toast?, sfx? }`, so a
 * toast and its sound are decided in one place and a test can read them. `hud.ts` runs it
 * (`runFeedback`) before its own switch; kinds that need the HUD's panels or timers stay there.
 * `DECISION` (ui/event-decisions.ts) says, for every SimEvent kind, where it is decided.
 */
import { BOUT_TEXT_SHEET, moveName } from '../config/strings-battle';
import {
  BUSH_TEXT,
  HOP_LESSON_TEXT,
  LOOKOUT_TEXT,
  NAMES,
  POND_TEXT,
  STORYLINE_TEXT,
  TEN_TEXT,
  UI_TEXT,
  STAT_LABELS,
  EDU_TEXT,
} from '../config/strings';
import { cosmeticLabel } from '../config/cosmetics';
import { LOOK_UNLOCK_TEXT } from '../config/strings-look';
import { MOVE_R10_TEXT } from '../config/strings-move-r10';
import { LEVEL_TEXT } from '../config/strings-r13d3';
import { BORDER_TEXT } from '../config/strings-r9d2';
import { STORY_TEXT } from '../config/story';
import { ALBUM_TEXT, KINDER_R11 } from '../config/strings-soul-r11b';
import { KEEPER_JUMP_FX } from '../config/tuning-move';
import type { SoundName } from '../platform/audio';
import { ACHIEVEMENT_LIST } from '../sim/achievements';
import type { SimEvent, World } from '../sim/types';

export function groveSfx(e: SimEvent): SoundName | null {
  switch (e.kind) {
    case 'fruitDropped':
      return 'thup';
    case 'treeShaken':
      return 'rustle';
    case 'thrown':
      return 'whee';
    case 'ate':
      return 'nom';
    case 'cantReach':
      return 'hmm';
    default:
      return null;
  }
}

/** R0467: a badge as a chip for the hatch card ("🏅 Warm Hands +25 🐚"). */
export function badgeLine(id: string, shells: number): string {
  const title = ACHIEVEMENT_LIST.find((x) => x.id === id)?.title ?? id;
  return `🏅 ${title} +${shells} 🐚`;
}

/** What one event says and sounds like. Both parts are optional. */
export interface Feedback {
  toast?: string;
  sfx?: SoundName;
}

export interface FeedbackCtx {
  world: World;
}

type FeedbackFn<K extends SimEvent['kind']> = (
  e: Extract<SimEvent, { kind: K }>,
  ctx: FeedbackCtx,
) => Feedback | null;

export type FeedbackTable = { [K in SimEvent['kind']]?: FeedbackFn<K> };

const nameOf = (ctx: FeedbackCtx, id: string): string =>
  ctx.world.nubbins.find((x) => x.id === id)?.name ?? NAMES.creature;

/** The migrated kinds. A function that returns null says "nothing for this one". */
export const FEEDBACK: FeedbackTable = {
  reaction: (e) => (e.reaction === 'love' ? { sfx: 'pet' } : null),
  collected: () => ({ sfx: 'pickup' }),
  landed: () => ({ sfx: 'hit' }),
  keeperJumped: (e) => ({ sfx: e.air ? 'hopAir' : 'hop' }), // MOVE-21
  keeperLanded: (e) => ({ sfx: e.fall > KEEPER_JUMP_FX.plopFall ? 'plop' : 'pat' }),
  bonked: () => ({ sfx: 'bonk' }), // R0300 / R0299
  ballSplash: () => ({ sfx: 'splash' }), // R0293
  springBounced: (e) => (e.nubbinId ? null : { sfx: 'boing' }), // MOVE-57
  bushRustle: (e) => (e.found ? { sfx: 'pickup', toast: BUSH_TEXT.found } : null), // MOVE-43
  keeperDipped: (e) => (e.shells > 0 ? { sfx: 'pickup', toast: POND_TEXT.found(e.shells) } : null), // MOVE-65
  hopLesson: (e) => (e.stage === 'done' ? { toast: HOP_LESSON_TEXT.done } : null), // MOVE-58
  fallsKeepsake: () => ({ sfx: 'pickup', toast: MOVE_R10_TEXT.fallsKeepsake }), // R0026
  lookoutFind: (e) => ({
    sfx: 'pickup',
    toast:
      e.id === 'well'
        ? LOOKOUT_TEXT.well
        : e.critter
          ? LOOKOUT_TEXT.critter
          : LOOKOUT_TEXT.shells(e.shells),
  }), // MOVE-55
  lookedAround: (e) => (e.found ? null : { toast: LOOKOUT_TEXT.nothing }),
  borderPushed: (e) => ({ toast: e.edge === 'notYet' ? BORDER_TEXT.notYet : BORDER_TEXT.hedge }),
  // secondEvolved, speciesGrew and ascended get lane F's stage card in hud.ts (no toast).
  cocoonStarted: (e, c) =>
    e.cocoon === 'evolve'
      ? null
      : {
          toast:
            e.cocoon === 'rebirth'
              ? UI_TEXT.cocoonRebirth(nameOf(c, e.nubbinId))
              : UI_TEXT.cocoonDepart(nameOf(c, e.nubbinId)),
        },
  departed: (e) => ({ toast: UI_TEXT.departed(e.name), sfx: 'sad' }),
  moveLearned: (e, c) => ({
    toast: (e.slotted ? BOUT_TEXT_SHEET.learned : BOUT_TEXT_SHEET.swapIn)(
      nameOf(c, e.nubbinId),
      moveName(e.move),
    ),
  }),
  eternal: (e, c) => ({ toast: UI_TEXT.eternal(nameOf(c, e.nubbinId)) }),
  lookUnlocked: (e) => ({ toast: LOOK_UNLOCK_TEXT.unlocked(cosmeticLabel(e.look)), sfx: 'pickup' }),
  turnedShadow: (e, c) => ({ toast: STORY_TEXT.turnedShadow(nameOf(c, e.nubbinId)), sfx: 'sad' }),
  shadowBonded: (e, c) => ({
    toast: STORY_TEXT.shadowBonded(nameOf(c, e.nubbinId)),
    sfx: 'evolve',
  }),
  ranAway: (e) => ({ toast: STORY_TEXT.ranAway(e.name), sfx: 'sad' }),
  strayReturned: (e) => ({ toast: STORY_TEXT.strayReturned(e.name) }),
  degenerated: (e) => ({ toast: STORYLINE_TEXT.degenerated(e.name), sfx: 'sad' }),
  restored: (e) => ({ toast: STORYLINE_TEXT.restored(e.name), sfx: 'evolve' }),
  lanternLit: () => ({ toast: STORY_TEXT.lanternLit, sfx: 'pickup' }),
  called: (e) => ({ toast: UI_TEXT.called(e.count), sfx: 'tap' }),
  fetching: (e, c) => ({ toast: UI_TEXT.fetching(nameOf(c, e.nubbinId)) }),
  courting: (e, c) => ({ toast: UI_TEXT.courting(nameOf(c, e.nubbinId)) }),
  bred: () => ({ toast: UI_TEXT.bred, sfx: 'hatch' }),
  lessonDone: (e, c) => ({
    toast: e.variant
      ? KINDER_R11.done(nameOf(c, e.nubbinId), KINDER_R11.names[e.variant] ?? e.variant)
      : UI_TEXT.lessonDone(nameOf(c, e.nubbinId), UI_TEXT.lessonNames[e.lesson], e.level),
    sfx: 'win',
  }),
  albumStamp: (e) => ({ toast: ALBUM_TEXT.stamped(ALBUM_TEXT.names[e.entry] ?? e.entry) }),
  albumPrize: (e) => ({ toast: ALBUM_TEXT.prize(e.shells) }),
  crafted: (e) => {
    if (!e.ok) return { toast: UI_TEXT.needsMaterials };
    const name = (UI_TEXT.recipeNames as Record<string, string>)[e.recipe] ?? e.recipe;
    return { toast: UI_TEXT.crafted(name), sfx: 'buy' };
  },
  gathered: (e) => ({ toast: UI_TEXT.gathered(e.what, e.count), sfx: 'tap' }),
  toyPlaced: () => ({ toast: UI_TEXT.toyPlaced }),
  plotBought: (e) => (e.ok ? { toast: UI_TEXT.plotBought, sfx: 'buy' } : null),
  achievement: (e) => ({
    toast: UI_TEXT.achievement(
      ACHIEVEMENT_LIST.find((x) => x.id === e.id)?.title ?? e.id,
      e.shells,
    ),
    sfx: 'win',
  }),
  // R0450: a chime for every new level; the toast only on each fifth, so training stays quiet.
  levelUp: (e, ctx) => ({
    sfx: 'levelUp',
    ...(e.level % 5 === 0
      ? { toast: LEVEL_TEXT.levelUp(nameOf(ctx, e.nubbinId), STAT_LABELS[e.stat], e.level) }
      : {}),
  }),
  questDone: () => ({ toast: UI_TEXT.questDone, sfx: 'cheer' }),
  friendsMade: (e, c) => ({
    toast: UI_TEXT.friendsMade(nameOf(c, e.a), nameOf(c, e.b)),
  }),
  wildLeft: () => ({ toast: UI_TEXT.wildLeft }),
  wildSettled: (e, c) => ({ toast: UI_TEXT.wildSettled(nameOf(c, e.nubbinId)), sfx: 'hatch' }),
  eduStarted: () => ({ toast: EDU_TEXT.playHelp }),
  recruited: (e) => ({
    toast: TEN_TEXT.recruited(e.name, TEN_TEXT.roleNames[e.role] ?? e.role),
    sfx: 'buy',
  }),
  townGrew: (e) => ({
    toast: TEN_TEXT.townGrew(TEN_TEXT.unlockNames[e.unlock] ?? e.unlock),
    sfx: 'win',
  }),
  wellRaised: (e, c) => ({ toast: TEN_TEXT.wellRaised(nameOf(c, e.nubbinId)), sfx: 'win' }),
};

/** Pure: what one event gives, or null (it is decided elsewhere, or says nothing). */
export function feedbackFor(e: SimEvent, ctx: FeedbackCtx): Feedback | null {
  const fn = FEEDBACK[e.kind] as ((ev: SimEvent, c: FeedbackCtx) => Feedback | null) | undefined;
  return fn ? fn(e, ctx) : null;
}

/** Run a feedback: the HUD passes its toaster and `playSound`. Returns false when nothing was due. */
export function runFeedback(
  fb: Feedback | null,
  toast: (text: string) => void,
  play: (name: SoundName) => void,
): boolean {
  if (!fb) return false;
  if (fb.sfx) play(fb.sfx);
  if (fb.toast) toast(fb.toast);
  return true;
}
