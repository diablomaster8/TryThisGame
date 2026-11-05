/**
 * Command handlers: caring for a Nubbin (petting, feeding, naming, training, teams) (TECH-35, moved out of world.ts).
 */
import { dye, wearGlasses } from '../accessories';
import { tapCare } from '../access';
import { nudgeAlignment } from '../alignment';
import { react } from '../behavior';
import { noteNubbin } from '../collection';
import { coaxOut } from '../cottage-hide';
import { giveCritter, giveEssence } from '../critters';
import { noteSecondCare } from '../personality';
import { hasDerivedHat } from '../derived-unlocks';
import { newDiary } from '../grove-diary';
import { feedWild } from '../habitats';
import { setMemory } from '../inheritance';
import { keeperPutDown } from '../keeper';
import { holdEndOfLife } from '../lifecycle';
import { isFree } from '../nubbin';
import { merge, setPartner } from '../partners';
import { harvest, plant, waterPlant } from '../plants';
import { mayWear } from '../remembrance';
import { wearInSlot } from '../wear'; /* Lane E r11, R0400 */
import { cosmetic } from '../../config/cosmetics'; /* Lane E r11, R0400 */
import { convertScan } from '../scans';
import { holdSlips } from '../slips';
import { joinTeam } from '../teams';
import { addRecruit } from '../town';
import { addTrust, isWary } from '../trust';
import { findNubbin, withRng } from '../world';
import type { Handlers } from './types';

export const handlers: Handlers = {
  // Lane E r10 (R0710): Simple touch's one-tap care.
  tapCare(world, cmd, events) {
    tapCare(world, cmd.nubbinId, events);
    return;
  },
  pet(world, cmd) {
    const k = world.keeper;
    k.intent = { kind: 'pet', nubbinId: cmd.nubbinId };
    k.moveTarget = null;
    return;
  },
  pickUp(world, cmd) {
    const k = world.keeper;
    if (k.carrying) return;
    k.intent = { kind: 'pickUp', nubbinId: cmd.nubbinId };
    k.moveTarget = null;
    return;
  },
  putDown(world, cmd, events) {
    keeperPutDown(world, events);
    return;
  },
  feed(world, cmd) {
    const k = world.keeper;
    if (world.inventory.fruit <= 0) return;
    k.intent = { kind: 'feed', nubbinId: cmd.nubbinId };
    k.moveTarget = null;
    return;
  },
  coaxOut(world, cmd, events) {
    coaxOut(world, events);
    return;
  },
  shakeTree(world, cmd) {
    const k = world.keeper;
    k.intent = { kind: 'shakeTree', treeId: cmd.treeId };
    k.moveTarget = null;
    return;
  },
  collect(world, cmd) {
    const k = world.keeper;
    k.intent = { kind: 'collect', itemId: cmd.itemId };
    k.moveTarget = null;
    return;
  },
  giveCritter(world, cmd, events) {
    const k = world.keeper;
    const now = world.timeMs;
    const n = findNubbin(world, cmd.nubbinId);
    if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
    if ((world.inventory.critters[cmd.species] ?? 0) <= 0) return;
    const ok = withRng(world, (rng) => giveCritter(n, cmd.species, rng, events));
    if (!ok) return;
    world.inventory.critters[cmd.species] = (world.inventory.critters[cmd.species] ?? 0) - 1;
    noteSecondCare(n, 'curious');
    nudgeAlignment(n, k.alignment);
    react(n, 'love', now, events);
    return;
  },
  giveEssence(world, cmd, events) {
    const k = world.keeper;
    const now = world.timeMs;
    const n = findNubbin(world, cmd.nubbinId);
    if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
    if ((world.inventory.essences[cmd.type] ?? 0) <= 0) return;
    giveEssence(n, cmd.type, events);
    world.inventory.essences[cmd.type] = (world.inventory.essences[cmd.type] ?? 0) - 1;
    nudgeAlignment(n, k.alignment);
    react(n, 'happy', now, events);
    return;
  },
  wearHat(world, cmd, events) {
    const n = findNubbin(world, cmd.nubbinId);
    if (!n) return;
    if (cmd.hat && !world.inventory.hats.includes(cmd.hat) && !hasDerivedHat(cmd.hat)) return;
    if (!mayWear(n, cmd.hat)) return; /* Lane E r9, R0424 */
    // Lane E r11, R0400: an item for another slot goes to its own slot, not the hat.
    const slot = cmd.hat ? (cosmetic(cmd.hat)?.slot ?? 'hat') : 'hat';
    if (slot !== 'hat') {
      wearInSlot(world, n.id, slot, cmd.hat);
      noteNubbin(world, n, events);
      return;
    }
    n.hat = cmd.hat;
    // Lane E, R0411: the book notes the hat or look.
    noteNubbin(world, n, events);
    return;
  },
  wearSlot(world, cmd, events) {
    if (wearInSlot(world, cmd.nubbinId, cmd.slot, cmd.id)) {
      const n = findNubbin(world, cmd.nubbinId);
      if (n) noteNubbin(world, n, events);
    }
    return;
  },
  rename(world, cmd) {
    const n = findNubbin(world, cmd.nubbinId);
    if (n) n.name = cmd.name.trim().slice(0, 16) || n.name;
    // R0448: the first rename ends the guided loop's last step.
    if (n) (world.diary ??= newDiary()).firstNameMs ??= world.timeMs;
    return;
  },
  holdEndOfLife(world, cmd) {
    holdEndOfLife(world, cmd.hold);
    return;
  },
  giveHeartFruit(world, cmd) {
    const k = world.keeper;
    if (world.inventory.heartFruit <= 0) return;
    k.intent = { kind: 'heartFruit', nubbinId: cmd.nubbinId };
    k.moveTarget = null;
    return;
  },
  interact(world, cmd) {
    const k = world.keeper;
    k.intent = { kind: 'interact', nubbinId: cmd.nubbinId, action: cmd.action };
    k.moveTarget = null;
    return;
  },
  call(world, cmd, events) {
    const k = world.keeper;
    const now = world.timeMs;
    let count = 0;
    for (const n of world.nubbins) {
      if (cmd.nubbinId && n.id !== cmd.nubbinId) continue;
      if (!isFree(n) || isWary(n)) continue;
      if (n.behavior.state === 'lesson' || n.behavior.state === 'nap') continue;
      n.behavior.state = 'wander';
      n.behavior.sinceMs = now;
      n.behavior.untilMs = now + 8000;
      n.behavior.itemId = null;
      n.behavior.target = {
        x: k.pos.x + Math.sin(k.facing) * 1.2 + (count % 2 ? 0.8 : -0.8),
        z: k.pos.z + Math.cos(k.facing) * 1.2,
      };
      addTrust(n, 0.5, events);
      count += 1;
    }
    events.push({ kind: 'called', count });
    return;
  },
  playingWith(world, cmd) {
    holdSlips(world, cmd.nubbinId);
    return;
  },
  plant(world, cmd, events) {
    plant(world, cmd.plantKind, cmd.flavor, cmd.pos, events);
    return;
  },
  waterPlant(world, cmd, events) {
    waterPlant(world, cmd.id, events);
    return;
  },
  harvest(world, cmd, events) {
    withRng(world, (rng) => harvest(world, cmd.id, rng, events));
    return;
  },
  feedWild(world, cmd, events) {
    feedWild(world, cmd.id, events);
    return;
  },
  dye(world, cmd, events) {
    dye(world, cmd.nubbinId, cmd.slot, cmd.color, events);
    return;
  },
  wearGlasses(world, cmd) {
    wearGlasses(world, cmd.nubbinId, cmd.on);
    return;
  },
  wearBelt(world, cmd) {
    // Lane E r7, R0437: the belt is worn unless taken off; the field only exists when off.
    const n = world.nubbins.find((x) => x.id === cmd.nubbinId);
    if (!n) return;
    if (cmd.on) delete n.hideBelt;
    else n.hideBelt = true;
    return;
  },
  setPartner(world, cmd) {
    setPartner(world, cmd.slot, cmd.nubbinId);
    return;
  },
  merge(world, cmd, events) {
    merge(world, events);
    return;
  },
  setMemory(world, cmd) {
    setMemory(world, cmd.nubbinId, cmd.memory);
    return;
  },
  convertScan(world, cmd, events) {
    withRng(world, (rng) => convertScan(world, cmd.species, rng, events));
    return;
  },
  joinTeam(world, cmd, events) {
    joinTeam(world, cmd.team, events);
    return;
  },
  recruit(world, cmd, events) {
    addRecruit(world, cmd.name, cmd.species, events);
    return;
  },
};
