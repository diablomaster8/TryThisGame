/**
 * Command handlers: the Keeper (movement, carrying, throwing, travel, settings) (TECH-35, moved out of world.ts).
 */
import { EGG, EGG_ANTICS, GROVE, THROW, TRUST } from '../../config/tuning';
import { confirmRift, sanitizeOfflineAging } from '../audience';
import { clampToWorld, putDown, react, startThrow } from '../behavior';
import { noteCampaign } from '../campaign';
import { rememberCare } from '../care-memory';
import { keeper2Act, keeper2Jump, setCoop } from '../coop';
import { findCuriosity } from '../curiosities';
import { setDungeonLoading } from '../dungeon';
import { festivalGagSeen } from '../festival-gags';
import { diaryPanel, diarySession, newDiary, shakeBonusMs } from '../grove-diary';
import { keeperJump, keeperStartRoll, rollAsked } from '../keeper';
import { teleport } from '../landmarks';
import { lookAround } from '../lookout';
import { applyDrop } from '../needs';
import { noteCare } from '../personality';
import { noteQuest } from '../quests';
import { clampToRegion } from '../region-walk';
import { travel } from '../regions';
import { cheerRide, endRide, startRide } from '../ride';
import { noteCheckpoint } from '../story-marks';
import { enterStoryRegion, leaveStoryRegion } from '../story-regions';
import { TRAINERS, trainerOf } from '../trainers';
import { fastTravel, travelAssist } from '../travel';
import { addTrust } from '../trust';
import { applyCommand, findNubbin, heldNubbin } from '../world';
import { throwSnowball } from '../snowballs';
import type { World } from '../types';
import type { Handlers } from './types';

/**
 * R0096 (R13 d1): with "the Grove dresses for you" on, the Grove takes the Keeper's colouring
 * once that side is unlocked, and goes back to its own when the setting is off.
 */
function dressGrove(world: World): void {
  if (!world.settings.groveDresses) return;
  const a = world.keeper.alignment;
  const open = a === 'sun' ? world.unlocks.sunGrove : world.unlocks.moonGrove;
  world.grove = open ? a : 'main';
}

export const handlers = {
  // Lane C r10 agent B (R0619): the game wrote this chapter's checkpoint.
  checkpointKept(world, cmd) {
    noteCheckpoint(world, cmd.key, cmd.id);
    return;
  },
  moveKeeperTo(world, cmd) {
    const k = world.keeper;
    k.moveTarget = { x: cmd.pos.x, z: cmd.pos.z };
    // R11 lane D: a drawn region has its own bounds.
    if (!clampToRegion(world, k.moveTarget)) clampToWorld(k.moveTarget);
    k.intent = null;
    return;
  },
  keeperInput(world, cmd) {
    const k = world.keeper;
    k.input = { x: cmd.input.x, z: cmd.input.z };
    return;
  },
  select(world, cmd) {
    world.selected = cmd.id;
    return;
  },
  grab(world, cmd, events) {
    const k = world.keeper;
    const now = world.timeMs;
    const n = findNubbin(world, cmd.nubbinId);
    if (!n || n.behavior.state === 'thrown') return;
    if (k.carrying === n.id) k.carrying = null;
    n.behavior.state = 'held';
    n.behavior.sinceMs = now;
    n.behavior.target = null;
    n.behavior.itemId = null;
    n.y = THROW.holdHeight;
    events.push({ kind: 'pickedUp', nubbinId: n.id });
    return;
  },
  drag(world, cmd) {
    const n = heldNubbin(world);
    if (!n) return;
    n.pos.x = cmd.pos.x;
    n.pos.z = cmd.pos.z;
    clampToWorld(n.pos);
    n.y = THROW.holdHeight;
    return;
  },
  snowball(world) {
    // R0113 (R13 d1): a snowball on the ridge's permanent snow.
    throwSnowball(world);
    return;
  },
  jump(world, cmd, events) {
    const k = world.keeper;
    // With an egg or a Nubbin in hand the jump button shakes it (MOVE-22).
    if (cmd.down && (heldNubbin(world) || k.carrying)) {
      applyCommand(world, { kind: 'shakeHeld' }, events);
      return;
    }
    // MOVE-64: a running jump with the stick pulled toward the camera is a roll.
    if (cmd.down && rollAsked(world) && keeperStartRoll(world, events)) return;
    keeperJump(world, cmd.down);
    return;
  },
  shakeHeld(world, cmd, events) {
    const k = world.keeper;
    const now = world.timeMs;
    const n = heldNubbin(world) ?? (k.carrying ? findNubbin(world, k.carrying) : undefined);
    if (!n) return;
    if (now - n.lastShakeMs < EGG.shakeCooldownMs) return;
    n.lastShakeMs = now;
    if (n.stage === 'egg') {
      n.hatchRemainingMs = Math.max(0, n.hatchRemainingMs - shakeBonusMs(world));
      // R0351: every third shake, a tiny foot pokes out of the bottom.
      n.eggShakes = (n.eggShakes ?? 0) + 1;
      const foot = n.eggShakes % EGG_ANTICS.footEvery === 0;
      events.push({
        kind: 'eggShaken',
        nubbinId: n.id,
        ...(foot ? { foot: true as const } : {}),
      });
    } else {
      react(n, 'dizzy', now, events);
    }
    return;
  },
  release(world, cmd, events) {
    const now = world.timeMs;
    const n = heldNubbin(world);
    if (!n) return;
    const speed = Math.hypot(cmd.vel.x, cmd.vel.z);
    if (speed >= THROW.minSpeed) {
      noteCare(n, 'throws');
      // R0541 (lane A r10): it remembers the throw (a flinch when the Keeper next walks up);
      // not a Learning Grove toss and catch, which it lands laughing.
      if (!world.edu) rememberCare(n, 'throw', now);
      // R0527: in the Learning Grove a throw is a toss and catch: no trust is lost.
      if (!world.edu) addTrust(n, TRUST.throw, events);
      noteCampaign(world, 'throw', n.id);
      startThrow(n, cmd.vel, now, events);
    } else if (speed < THROW.placeMaxSpeed) {
      // A gentle place costs nothing: moving a Nubbin somewhere nicer must not hurt it.
      putDown(n, now, events, 'happy');
    } else {
      if (n.stage !== 'egg') applyDrop(n, THROW.dropScale);
      rememberCare(n, 'drop', now);
      addTrust(n, TRUST.drop * THROW.dropScale, events, !!world.edu);
      putDown(n, now, events);
    }
    return;
  },
  switchKeeper(world, cmd) {
    const k = world.keeper;
    // Legacy toggle: the first trainer of the other side.
    const t = TRAINERS.find((x) => x.band === cmd.alignment);
    if (t) {
      world.trainer = t.id;
      k.alignment = t.band;
    }
    dressGrove(world);
    return;
  },
  setTrainer(world, cmd) {
    const k = world.keeper;
    const t = trainerOf(cmd.id);
    world.trainer = t.id;
    k.alignment = t.band;
    dressGrove(world);
    return;
  },
  setGrove(world, cmd) {
    if (cmd.grove === 'sun' && !world.unlocks.sunGrove) return;
    if (cmd.grove === 'moon' && !world.unlocks.moonGrove) return;
    world.grove = cmd.grove;
    return;
  },
  diaryNote(world, cmd) {
    // R0474: the private diary (sim/diary.ts).
    if (cmd.what === 'session') diarySession(world);
    else if (cmd.what === 'skip') (world.diary ??= newDiary()).scenesSkipped += 1;
    else if (cmd.what === 'loopSkip') (world.diary ??= newDiary()).loopSkipped = true;
    else diaryPanel(world, cmd.what.panel);
    return;
  },
  setTimeZone(world, cmd) {
    // TECH-45: whole minutes inside the real range (UTC-12 to UTC+14).
    const m = Math.round(cmd.offsetMin);
    if (Number.isFinite(m) && m >= -720 && m <= 840) world.tzOffsetMin = m;
    return;
  },
  setSettings(world, cmd) {
    // The menu validates the cap, but a NaN or out-of-range one must never reach catch-up.
    const next = { ...cmd.settings, offlineAging: { ...cmd.settings.offlineAging } };
    sanitizeOfflineAging(next.offlineAging, world.settings.offlineAging.capHours);
    // Lane C r8: a settings copy taken before the story began (a phone's first-launch
    // defaults) must not drop the quest flow it set; the menu always names one.
    if (next.questFlow === undefined && world.settings.questFlow !== undefined)
      next.questFlow = world.settings.questFlow;
    world.settings = next;
    dressGrove(world);
    return;
  },
  confirmRift(world) {
    confirmRift(world.settings);
    return;
  },
  // Lane E (R0332): a curiosity the UI spotted, logged once.
  curiosity(world, cmd, events) {
    findCuriosity(world, cmd.id, events);
    return;
  },
  setLoading(world, cmd) {
    setDungeonLoading(world, cmd.on);
    return;
  },
  setLocation(world, cmd, events) {
    const k = world.keeper;
    if (world.location !== cmd.location) {
      world.location = cmd.location;
      k.pos = { x: GROVE.keeperStart.x, z: GROVE.keeperStart.z };
      k.moveTarget = null;
      k.intent = null;
      events.push({ kind: 'located', location: cmd.location });
    }
    return;
  },
  setRunning(world, cmd) {
    const k = world.keeper;
    k.running = cmd.running;
    return;
  },
  setCoop(world, cmd, events) {
    setCoop(world, cmd.active, cmd.trainer, events);
    return;
  },
  keeper2Input(world, cmd) {
    if (world.keeper2) world.keeper2.input = { x: cmd.input.x, z: cmd.input.z };
    return;
  },
  keeper2Act(world, cmd, events) {
    keeper2Act(world, cmd.action, events);
    return;
  },
  keeper2Jump(world, cmd) {
    keeper2Jump(world, cmd.down);
    return;
  },
  lookAround(world, cmd, events) {
    lookAround(world, events);
    return;
  },
  roll(world, cmd, events) {
    keeperStartRoll(world, events, cmd.dir);
    return;
  },
  viewYaw(world, cmd) {
    if (Number.isFinite(cmd.yaw)) world.viewYaw = cmd.yaw;
    return;
  },
  travel(world, cmd, events) {
    travel(world, cmd.exit, events, cmd.sub);
    return;
  },
  // Lane C r10 agent A (R0605): a questline region's entrance, or back to the Grove.
  storyRegion(world, cmd, events) {
    if (cmd.region === null) leaveStoryRegion(world, events);
    else enterStoryRegion(world, cmd.region, events);
    return;
  },
  fastTravel(world, cmd, events) {
    fastTravel(world, cmd, events);
    return;
  },
  travelAssist(world, cmd) {
    travelAssist(world, cmd.pos);
    return;
  },
  ride(world, cmd, events) {
    // R0085: climb on (or get down off) a Nubbin.
    if (cmd.nubbinId) startRide(world, cmd.nubbinId, events);
    else endRide(world, events, 'down');
    return;
  },
  rideCheer(world) {
    cheerRide(world);
    return;
  },
  festivalGagSeen(world, cmd) {
    festivalGagSeen(world, cmd.season);
    return;
  },
  teleport(world, cmd) {
    teleport(world, cmd.pos);
    return;
  },
  photoTaken(world, cmd, events) {
    noteQuest(world, 'photo', events, cmd.species);
    return;
  },
} satisfies Handlers;
