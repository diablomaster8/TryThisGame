/**
 * Command handlers: the Learning Grove's settings, results and language course (TECH-35,
 * moved out of world.ts).
 */
import {
  clampRounds,
  eduEndBreak,
  eduLesson,
  eduResetSession,
  eduResult,
  eduSetAge,
  eduSetGame,
  eduSetName,
  eduSetReaderAge,
  eduSetSession,
  eduStart,
  eduStartBreak,
} from '../edu';
import { noteActivity } from '../edu-report';
import { eduSetLimits, eduUnlockLimits } from '../edu-limits';
import { eduSetTag } from '../edu-session';
import { langDueWave, langStart, langTeach, langTraced, noteWord, srsAnswer } from '../lang';
import { eduNotice } from '../edu-notice';
import { saveDrawing } from '../drawings';
import { funRunDone } from '../fun-run';
import { glowSolve } from '../dungeon-glow';
import { setLossHold } from '../loss-notice';
import type { Handlers } from './types';

export const handlers: Handlers = {
  eduSetCoPlay(world, cmd) {
    if (world.edu) world.edu.coPlay = cmd.mode;
    return;
  },
  eduSetUiLanguage(world, cmd) {
    // R0739: the Learning Grove's interface language.
    const langs: readonly string[] = ['en', 'he', 'es', 'ja'];
    if (world.edu && langs.includes(cmd.lang)) world.edu.uiLanguage = cmd.lang;
    return;
  },
  glowSolve(world, cmd, events) {
    glowSolve(world, cmd.depth, events);
    return;
  },
  funRunDone(world, cmd) {
    funRunDone(world, cmd.nubbinId);
    return;
  },
  langDueWave(world, cmd, events) {
    langDueWave(world, cmd.word, events);
    return;
  },
  langReview(world, cmd) {
    srsAnswer(world, cmd.word, cmd.right);
    return;
  },
  langTeach(world, cmd, events) {
    langTeach(world, cmd.nubbinId, cmd.word, events);
    return;
  },
  eduNotice(world, cmd) {
    eduNotice(world, cmd.item);
    return;
  },
  saveDrawing(world, cmd) {
    saveDrawing(world, cmd.data);
    return;
  },
  // Lane E r10 (R0694): a grown-up's choice for a loss chapter.
  eduLossHold(world, cmd) {
    setLossHold(world, cmd.chapter, cmd.hold);
    return;
  },
  // Lane E r10 (R0745): attention counters for the grown-up report.
  eduActivity(world, cmd) {
    noteActivity(world, cmd.game, cmd.what, cmd.ms);
    return;
  },
  eduStart(world, cmd, events) {
    eduStart(world, cmd.age, events, cmd.band);
    return;
  },
  eduSetBand(world, cmd) {
    if (world.edu) world.edu.band = cmd.band;
    return;
  },
  eduSetLanguage(world, cmd) {
    if (world.edu) world.edu.storyLanguage = cmd.language;
    return;
  },
  eduSetReadAloud(world, cmd) {
    if (world.edu) world.edu.readAloud = cmd.on;
    return;
  },
  eduSetRounds(world, cmd) {
    // Lane E r7, R0746.
    if (world.edu) world.edu.roundsPerGame = clampRounds(cmd.rounds);
    return;
  },
  eduSetAlwaysReborn(world, cmd) {
    // Lane E r7, R0691: the field only exists when on.
    if (world.edu) {
      if (cmd.on) world.edu.alwaysReborn = true;
      else delete world.edu.alwaysReborn;
    }
    return;
  },
  eduSetReadToMe(world, cmd) {
    if (world.edu) world.edu.readToMe = cmd.on;
    return;
  },
  /* Lane E r9 */
  eduSetAutoAdvance(world, cmd) {
    if (world.edu) {
      if (cmd.on) world.edu.autoAdvance = true;
      else delete world.edu.autoAdvance;
    }
    return;
  },
  langSkipWait(world) {
    if (world.edu) world.edu.langSkipAt = world.timeMs;
    return;
  },
  eduLesson(world, cmd) {
    eduLesson(world, cmd.id, cmd.best);
    return;
  },
  langStart(world, cmd) {
    langStart(world, cmd.course);
    return;
  },
  langWord(world, cmd, events) {
    noteWord(world, cmd.word, cmd.how, events);
    return;
  },
  langTraced(world, cmd, events) {
    // The step itself is met by the quest's rule in noteSideCommand, after this.
    langTraced(world, cmd.quest, events);
    return;
  },
  eduSetAge(world, cmd) {
    eduSetAge(world, cmd.age, cmd.resetGames);
    return;
  },
  /* Lane E r10, R0735 */
  eduSetReaderAge(world, cmd) {
    eduSetReaderAge(world, cmd.age);
    return;
  },
  eduTutorialSaid(world) {
    if (world.edu) world.edu.tutorialSaid = true;
    return;
  },
  eduSetGame(world, cmd) {
    eduSetGame(world, cmd.game, cmd.on);
    return;
  },
  eduSetSession(world, cmd) {
    eduSetSession(world, cmd.minutes);
    return;
  },
  eduSetName(world, cmd) {
    eduSetName(world, cmd.name);
    return;
  },
  /* Lane E r9, R0696 */
  eduSetTag(world, cmd) {
    eduSetTag(world, cmd.icon, cmd.colour);
    return;
  },
  eduResult(world, cmd, events) {
    eduResult(world, cmd.game, cmd.stars, events, cmd.item, cmd.first);
    return;
  },
  eduSetLimits(world, cmd) {
    // Lane E r8, R0695.
    eduSetLimits(world, cmd.limits);
    return;
  },
  eduUnlockLimits(world) {
    eduUnlockLimits(world, world.lastWallMs);
    return;
  },
  eduSetPlace(world, cmd) {
    // Lane E r8, R0680.
    if (world.edu) (world.edu.places ??= {})[cmd.place] = cmd.on;
    return;
  },
  eduResetSession(world) {
    eduResetSession(world);
    return;
  },
  eduStartBreak(world) {
    eduStartBreak(world);
    return;
  },
  eduEndBreak(world) {
    eduEndBreak(world);
    return;
  },
};
