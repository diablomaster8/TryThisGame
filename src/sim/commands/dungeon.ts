/**
 * Command handlers: the Hollow, battles and Nubbin transfers (lane B owns the behaviour; this is only the dispatch) (TECH-35, moved out of world.ts).
 */
import { BATTLE } from '../../config/tuning-battle';
import { drawBattleCmd, resumeBattleCmd } from '../battle/resume';
import { grantKeepsake } from '../battle/rewards';
import { startGuardian, storyBoutChoice } from '../battle/story-bouts';
import { rumbleAct, rumbleClose, rumbleForfeit, startRumble } from '../battle/tactics/slice';
import { trialClear } from '../battle/tactics/trials';
import {
  actBattleCmd,
  forfeitBattleCmd,
  partyPrize,
  setBattlePrefsCmd,
  setSlotsCmd,
  startBattleCmd,
} from '../battle';
import { dismissFriend, hireFriend } from '../dungeon-friends';
import { gambleBasket } from '../dungeon-gamble';
import { itemsCommand } from '../dungeon-items';
import { setGuide, setHollowKid } from '../dungeon-kid';
import { setHollowParty } from '../dungeon-party';
import { takeActQuest } from '../dungeon-quests';
import { setHollowRole } from '../dungeon-roles';
import { takeFromStash } from '../dungeon-sack';
import { sneakPast } from '../dungeon-sleepy';
import { calmStray } from '../dungeon-strays';
import { setHollowTier } from '../dungeon-tiers';
import { townQuest, useStash } from '../dungeon-towns';
import { portalReturn, rerollActs, useAcorn, waypointTravel } from '../dungeon-travel';
import { enterMouth, enterTown } from '../dungeon-zones';
import { dungeonGo, encounterDone, enterDungeon, feedStray, leaveDungeon } from '../dungeon';
import { fuse } from '../fusion';
import { equipGear, unequipGear } from '../gear';
import { receiveNubbin, tradeAway } from '../share';
import type { Command, SimEvent, World } from '../types';
import { withRng } from '../world';
import type { Handlers } from './types';

// Lane B round 8, items: stash tabs (R0174), sockets (R0173), the wheelbarrow (R0177).
function dungeonGroup1(
  world: World,
  cmd: Extract<
    Command,
    {
      kind:
        | 'stashPut'
        | 'stashMove'
        | 'socketCharm'
        | 'unsocketCharms'
        | 'wheelbarrowMix'
        | 'enterHollowSecret';
    }
  >,
  events: SimEvent[],
): void {
  itemsCommand(world, cmd, events);
  return;
}

export const handlers: Handlers = {
  // Lane C: the battle core keeps the live bout in world.battle.
  battleStart(world, cmd, events) {
    startBattleCmd(world, cmd.context, events);
    return;
  },
  battleAct(world, cmd, events) {
    actBattleCmd(world, cmd.action, events);
    return;
  },
  battleSlots(world, cmd) {
    setSlotsCmd(world, cmd.nubbinId, cmd.slots);
    return;
  },
  battleForfeit(world, cmd, events) {
    forfeitBattleCmd(world, events);
    return;
  },
  battlePrefs(world, cmd) {
    setBattlePrefsCmd(world, cmd.prefs);
    return;
  },
  // Lane C: the grid-tactics rumble (recs FIGHT-65), kept in world.tactics.
  tacticsStart(world, cmd, events) {
    startRumble(world, events, {
      ...(cmd.depth !== undefined ? { depth: cmd.depth } : {}),
      ...(cmd.ids ? { ids: cmd.ids } : {}),
    });
    return;
  },
  tacticsAct(world, cmd, events) {
    rumbleAct(world, cmd.action, events);
    return;
  },
  tacticsForfeit(world, cmd, events) {
    rumbleForfeit(world, events);
    return;
  },
  tacticsClose(world) {
    rumbleClose(world);
    return;
  },
  trialClear(world, cmd, events) {
    trialClear(world, cmd.id, cmd.steps, events);
    return;
  },
  battleKeepsake(world, cmd) {
    if (cmd.id === 'playday-seen') grantKeepsake(world, cmd.id);
    return;
  },
  battleResume(world) {
    resumeBattleCmd(world);
    return;
  },
  battleDraw(world, cmd, events) {
    drawBattleCmd(world, events);
    return;
  },
  storyBout(world, cmd, events) {
    storyBoutChoice(world, cmd.id, cmd.fight, cmd.ids ?? [], events);
    return;
  },
  guardianStart(world, cmd, events) {
    startGuardian(world, events, {
      depth: cmd.depth,
      key: cmd.key,
      ...(cmd.ids ? { ids: cmd.ids } : {}),
    });
    return;
  },
  fuse(world, cmd, events) {
    const [a, b] = world.partners;
    if (a && b) fuse(world, a, b, events);
    return;
  },
  partyBoutResult(world, cmd, events) {
    // Lane C: the prize comes from the tier, never the screen (recs FIGHT-02).
    if (!Number.isInteger(cmd.tier) || cmd.tier < 1 || cmd.tier > BATTLE.prizes.party.length)
      return;
    const shells = cmd.won ? partyPrize(cmd.tier, true) : 0;
    world.inventory.shells += shells;
    events.push({ kind: 'partyBout', won: cmd.won, tier: cmd.tier, shells });
    return;
  },
  receiveNubbin(world, cmd, events) {
    receiveNubbin(world, cmd.nubbin, events);
    return;
  },
  tradeAway(world, cmd, events) {
    tradeAway(world, cmd.nubbinId, events);
    return;
  },
  enterDungeon(world, cmd, events) {
    withRng(world, (rng) => enterDungeon(world, cmd.daily, rng, events));
    return;
  },
  leaveDungeon(world, cmd, events) {
    leaveDungeon(world, events);
    return;
  },
  dungeonGo(world, cmd, events) {
    dungeonGo(world, cmd.to, events);
    return;
  },
  enterAct(world, cmd, events) {
    withRng(world, (rng) => enterDungeon(world, false, rng, events, undefined, cmd.act));
    return;
  },
  // Lane B round 4: act camps and fields (R0147, R0152).
  enterTown(world, cmd, events) {
    withRng(world, (rng) => enterTown(world, cmd.act, rng, events));
    return;
  },
  enterMouth(world, cmd, events) {
    enterMouth(world, events);
    return;
  },
  // Lane B round 5: the stray's choice (R0281).
  strayCalm(world, cmd, events) {
    calmStray(world, cmd.id, events);
    return;
  },
  equipGear(world, cmd) {
    equipGear(world, cmd.itemId, cmd.nubbinId);
    return;
  },
  unequipGear(world, cmd) {
    unequipGear(world, cmd.itemId);
    return;
  },
  stash(world, cmd, events) {
    useStash(world, cmd.amount, events);
    return;
  },
  townQuest(world, cmd, events) {
    townQuest(world, events);
    return;
  },
  setHollowParty(world, cmd) {
    setHollowParty(world, cmd.ids);
    return;
  },
  // Lane B round 6: sneak past (R0180), the Mystery Basket (R0176), the stash (R0174).
  packSneak(world, cmd, events) {
    sneakPast(world, cmd.packId, events);
    return;
  },
  gambleBasket(world, cmd, events) {
    withRng(world, (rng) => gambleBasket(world, cmd.slot, rng, events));
    return;
  },
  stashTake(world, cmd) {
    takeFromStash(world, cmd.itemId);
    return;
  },
  stashPut: dungeonGroup1,
  stashMove: dungeonGroup1,
  socketCharm: dungeonGroup1,
  unsocketCharms: dungeonGroup1,
  wheelbarrowMix: dungeonGroup1,
  enterHollowSecret: dungeonGroup1,
  // Lane B round 7: difficulty tiers (R0179).
  hollowTier(world, cmd, events) {
    setHollowTier(world, cmd.tier, events);
    return;
  },
  hollowSpeedRun(world, cmd) {
    // R0187: the speed-run toggle; off drops nothing.
    if (cmd.on) world.hollow.speedRun = true;
    else delete world.hollow.speedRun;
    return;
  },
  // Lane B round 8: party roles (R0167) and the Hollow guide (R0208).
  setHollowRole(world, cmd) {
    setHollowRole(world, cmd.id, cmd.role);
    return;
  },
  hollowGuide(world, cmd) {
    setGuide(world, cmd.on);
    return;
  },
  hollowKid(world, cmd) {
    setHollowKid(world, cmd.on);
    return;
  },
  // Lane B round 9 (helper c): act quests (R0166) and friends for hire (R0181).
  hollowR9(world, cmd, events) {
    if (cmd.what === 'quest') takeActQuest(world, cmd.id, events);
    else if (cmd.what === 'hire') hireFriend(world, cmd.id, events);
    else dismissFriend(world, events);
    return;
  },
  // Lane B round 2: waypoints, new paths and the Homing Acorn (R0148–R0150).
  waypointTravel(world, cmd, events) {
    withRng(world, (rng) => waypointTravel(world, cmd.id, rng, events));
    return;
  },
  rerollActs(world, cmd, events) {
    rerollActs(world, events);
    return;
  },
  useAcorn(world, cmd, events) {
    useAcorn(world, events);
    return;
  },
  portalReturn(world, cmd, events) {
    portalReturn(world, events);
    return;
  },
  encounterDone(world, cmd, events) {
    encounterDone(world, cmd.outcome, events);
    return;
  },
  feedStray(world, cmd, events) {
    feedStray(world, cmd.id, events);
    return;
  },
};
