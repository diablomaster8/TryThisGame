/**
 * Command handlers: the campaign, side stories, quests and Learning Grove lessons (TECH-35, moved out of world.ts).
 */
import { react } from '../behavior';
import { applyCampaignCommand } from '../campaign';
import { creatorGrant, creatorTransform, creatorUnlock } from '../creator';
import { playFair } from '../epilogue';
import { tapFernStone } from '../fern-stone';
import { skipGoal } from '../goal-skips';
import { sawAntic } from '../antic-album';
import { startLesson, startVariantLesson } from '../kindergarten';
import { helpQuest } from '../kid-flow';
import { chooseCastHome } from '../line-rewards';
import { visit } from '../neighbourhood';
import { acceptQuest, debugOffer, declineQuest, shelveQuest, trackQuest } from '../quest-offers';
import { abandonLine } from '../story-book';
import type { Command, SimEvent, World } from '../types';
import { findNubbin } from '../world';
import type { Handlers } from './types';

function campaignGroup1(
  world: World,
  cmd: Extract<
    Command,
    {
      kind:
        | 'campaignStart'
        | 'sceneDone'
        | 'lineAct'
        | 'talk'
        | 'lightLantern'
        | 'debugChapter'
        | 'sideAct'
        | 'storylineStart'
        | 'storyArea'
        | 'storyAct';
    }
  >,
  events: SimEvent[],
): void {
  applyCampaignCommand(world, cmd, events);
  return;
}

export const handlers: Handlers = {
  startLesson(world, cmd, events) {
    const n = findNubbin(world, cmd.nubbinId);
    if (n && cmd.variant) startVariantLesson(world, n, cmd.variant, events);
    else if (n) startLesson(world, n, cmd.lesson, events);
    return;
  },
  sawAntic(world, cmd, events) {
    const n = findNubbin(world, cmd.nubbinId);
    if (n) sawAntic(world, n, events);
    return;
  },
  creatorUnlock(world, cmd, events) {
    creatorUnlock(world, cmd.code, events);
    return;
  },
  creatorGrant(world, cmd, events) {
    creatorGrant(world, cmd.pick, events);
    return;
  },
  creatorTransform(world, cmd, events) {
    creatorTransform(world, cmd.nubbinId, cmd.pick, events);
    return;
  },
  atlasFestival(world, cmd) {
    // The festival itself reads the Atlas; the Grove only remembers it was announced.
    if (!world.atlasFestivals.includes(cmd.id)) world.atlasFestivals.push(cmd.id);
    return;
  },
  visit(world, cmd, events) {
    visit(world, cmd.trainer, events);
    return;
  },
  campaignStart: campaignGroup1,
  sceneDone: campaignGroup1,
  lineAct: campaignGroup1,
  talk: campaignGroup1,
  lightLantern: campaignGroup1,
  debugChapter: campaignGroup1,
  sideAct: campaignGroup1,
  storylineStart: campaignGroup1,
  storyArea: campaignGroup1,
  storyAct: campaignGroup1,
  // Lane C r10 agent C (R0614, R0615): Story only pace skips the spine's goal.
  skipGoal(world, cmd, events) {
    skipGoal(world, events, cmd.line);
    return;
  },
  playFair(world) {
    playFair(world);
    return;
  },
  lineAbandon(world, cmd) {
    // Lane C r7 (R0643): leave a questline; the Grove keeps its Nubbins.
    abandonLine(world, cmd.line);
    return;
  },
  // Lane C r8 (R0602): the Open quest flow's answers (sim/quest-offers.ts).
  questAccept(world, cmd, events) {
    if (world.campaign) acceptQuest(world, world.campaign, cmd.id, cmd.shelve, events);
    return;
  },
  questHelp(world, cmd, events) {
    helpQuest(world, cmd.id, events);
    return;
  },
  questDecline(world, cmd) {
    if (world.campaign) declineQuest(world, world.campaign, cmd.id);
    return;
  },
  questShelve(world, cmd) {
    shelveQuest(world, cmd.id);
    return;
  },
  questTrack(world, cmd) {
    trackQuest(world, cmd.id, cmd.on);
    return;
  },
  linePitched(world, cmd) {
    const book = world.questBook;
    if (book && !(book.pitched ?? []).includes(cmd.id)) (book.pitched ??= []).push(cmd.id);
    return;
  },
  debugQuestOffer(world, cmd, events) {
    debugOffer(world, cmd.id, events);
    return;
  },
  // Lane C r9 (R0594): an ended line's Nubbin comes home or stays where the line lives.
  lineCastHome(world, cmd, events) {
    chooseCastHome(world, cmd.line, cmd.nubbinId, cmd.home, events);
    return;
  },
  storyProp(world, cmd, events) {
    // Nothing to change in the world: the side-story runner reads it in applyCommand.
    // R0313: except Fern's stone, a running gag of its own.
    tapFernStone(world, cmd.prop, events);
    return;
  },
  tapToy(world, cmd, events) {
    // R0322: a face only; the tap toy never touches needs or stats.
    const n = findNubbin(world, cmd.nubbinId);
    if (n && n.stage !== 'egg' && n.stage !== 'cocoon')
      react(n, cmd.beat === 'hiccup' ? 'surprised' : 'dizzy', world.timeMs, events);
    return;
  },
};
