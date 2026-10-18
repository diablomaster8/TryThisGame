/**
 * Content ratings: which quest audiences a save may be offered, given the "Mature content"
 * setting and the save's mode, plus the rule that keeps fun quests out of chapters 9 to 11
 * and the one-time age confirmation before the Multiverse rift opens (canon 20, 23 and 37).
 * Pure functions over plain data. Lowering the setting only hides a quest: progress lives
 * elsewhere and is never touched here.
 */
import type { MatureContent, Settings } from './types';

export type Audience = 'all' | 'main' | 'teen' | 'adult';

export interface AudienceContext {
  matureContent: MatureContent;
  /**
   * True in a Learning Grove save (save mode 'edu'). The mode lands with CV4, so callers
   * pass false until then.
   */
  learningGrove: boolean;
}

/** Fun quests are Q1 to Q95; none may be offered, started or advanced in chapters 9 to 11. */
export const FUN_QUEST_BLOCKED_CHAPTERS = { first: 9, last: 11 } as const;

/** The last fun quest: Q66-Q95 are the Alice, Holmes and Hodja packs. */
export const FUN_QUEST_LAST = 95;

export function sanitizeMatureContent(value: unknown): MatureContent {
  return value === 'teen' || value === 'adult' ? value : 'off';
}

export function audienceAllowed(audience: Audience, ctx: AudienceContext): boolean {
  if (ctx.learningGrove) return audience === 'all';
  switch (audience) {
    case 'all':
    case 'main':
      return true;
    case 'teen':
      return ctx.matureContent === 'teen' || ctx.matureContent === 'adult';
    case 'adult':
      return ctx.matureContent === 'adult';
  }
}

export function isFunQuestCode(code: string): boolean {
  const m = /^Q(\d+)$/.exec(code);
  return m !== null && Number(m[1]) >= 1 && Number(m[1]) <= FUN_QUEST_LAST;
}

export function funQuestBlocked(chapter: number): boolean {
  return chapter >= FUN_QUEST_BLOCKED_CHAPTERS.first && chapter <= FUN_QUEST_BLOCKED_CHAPTERS.last;
}

/** Whether a quest may be offered, started or advanced right now. */
export function questAvailable(
  quest: { code?: string; audience: Audience },
  ctx: AudienceContext,
  chapter: number,
): boolean {
  if (!audienceAllowed(quest.audience, ctx)) return false;
  if (quest.code !== undefined && isFunQuestCode(quest.code) && funQuestBlocked(chapter))
    return false;
  return true;
}

/** Whether the Settings screen should show the Mature content control at all. */
export function matureControlVisible(ctx: Pick<AudienceContext, 'learningGrove'>): boolean {
  return !ctx.learningGrove;
}

/** The rift asks for an age confirmation until the player has given it once. */
export function riftNeedsConfirmation(settings: Pick<Settings, 'riftConfirmed'>): boolean {
  return !settings.riftConfirmed;
}

/** Confirming turns the 18+ position on and is remembered, so it is asked only once. */
export function confirmRift(settings: Settings): void {
  settings.riftConfirmed = true;
  settings.matureContent = 'adult';
}
