import { BATTLE } from '../config/tuning-battle';
import { cheerRide, endRide, isRidden, startRide, stepRide } from './ride';
import { stepSwimTow } from './swim-tow';
import { festivalGagSeen } from './festival-gags';
import {
  actBattleCmd,
  forfeitBattleCmd,
  karatePrize,
  partyPrize,
  setBattlePrefsCmd,
  setSlotsCmd,
  startBattleCmd,
  stepBattleMoves,
} from './battle';
import { recordKarate } from './battle/rewards';
import { rumbleAct, rumbleClose, rumbleForfeit, startRumble } from './battle/tactics/slice';
import { startGuardian, storyBoutChoice } from './battle/story-bouts';
import { drawBattleCmd, holdBattleNeeds, resumeBattleCmd } from './battle/resume';
import { trialClear } from './battle/tactics/trials';
import { grantKeepsake } from './battle/rewards';
import { NUBBIN_NAMES } from '../config/strings';
import { EGG, GROVE, OFFLINE, SKILLS, THROW, TREES, TRUST } from '../config/tuning';
import { nudgeAlignment } from './alignment';
import { confirmRift, sanitizeOfflineAging } from './audience';
import { applyDrop, decayNeeds } from './needs';
import {
  clampToWorld,
  fruitOnHead,
  putDown,
  react,
  sampleAll,
  startThrow,
  updateBehavior,
} from './behavior';
import { WILD_CRITTERS, giveCritter, giveEssence } from './critters';
import {
  createKeeper,
  keeperJump,
  keeperPutDown,
  keeperStartRoll,
  rollAsked,
  updateKeeper,
} from './keeper';
import { noteCare } from './personality';
import { addTrust, isWary, stepTrust } from './trust';
import { createWeather, seasonOf, setWeather, stepWeather } from './weather';
import { stepBreeding } from './breeding';
import { payService, startLesson } from './kindergarten';
import { buyDecor, placeDecor, removeDecor } from './decorate';
import { noteNubbin, stepCollection } from './collection';
import { stepDaily } from './daily';
import { receiveNubbin, tradeAway } from './share';
import { harvest, plant, stepPlants, waterPlant } from './plants';
import { buyToy, craft, gather, placeToy, type RecipeId } from './craft';
import { paintTile } from './tiles';
import { buyPlot, hasRoom } from './roster';
import { claimQuest, noteQuest, queueQuestEvents, stepQuests } from './quests';
import { feedWild, stepHabitats } from './habitats';
import { neighbourGift, visit } from './neighbourhood';
import { dye, wearGlasses } from './accessories';
import { keeper2Act, keeper2Jump, setCoop, stepKeeper2 } from './coop';
import { stepLandmarks, teleport } from './landmarks';
import { travel } from './regions';
import { fastTravel, travelAssist } from './travel';
import { stepCollectibles } from './collectibles';
import { stepLittleGrove } from './little-grove';
import { stepFriendships } from './friendships';
import { stepSeasons, racePrizeMultiplier, fruitIntervalMultiplier } from './seasons';
import { stepAchievements } from './achievements';
import { applyCampaignCommand, noteCampaign, stepCampaign } from './campaign';
import { noteSideCommand } from './side-stories';
import { noteCampaignEvents } from './storyline';
import { abandonLine, noteLineEvents, stepLineQueue, stepStoryBook } from './story-book';
import { acceptQuest, declineQuest, shelveQuest, trackQuest } from './quest-offers';
import { langStart, langTraced, noteWord } from './lang';
import { stepNpcs } from './npcs';
import { separateBodies } from './separation';
import { lookAround } from './lookout';
import { stepPropReach } from './prop-reach';
import { stepHopLesson } from './hop-lesson';
import { stepHopCourse } from './hop-course';
import { addRewards, buy } from './shop';
import { SPECIES } from './species';
import { DEFAULT_TRAINER, rollEggSpecies, TRAINERS, trainerOf } from './trainers';
import {
  advanceStage,
  evolve,
  hatch,
  holdEndOfLife,
  keepEggshell,
  secondEvolve,
} from './lifecycle';
import { createEgg, EGG_COLORS, isFree, isHeld } from './nubbin';
import { Rng } from './rng';
import { addRecruit, festivalPrizeMultiplier, stepTown } from './town';
import { holdSlips, lifespanMs, stepSlips } from './slips';
import { tapFernStone } from './fern-stone';
import { trainResult } from './gym';
import { merge, setPartner, stepPartners } from './partners';
import { fuse } from './fusion';
import { stepCurfew } from './curfew';
import { buyAcorns, portalReturn, rerollActs, useAcorn, waypointTravel } from './dungeon-travel';
import { enterMouth, enterTown } from './dungeon-zones';
import { townBuy, townQuest, useStash } from './dungeon-towns';
import { setHollowParty } from './dungeon-party';
import {
  dungeonGo,
  encounterDone,
  enterDungeon,
  hollowBattleEnded,
  feedStray,
  inParty,
  leaveDungeon,
  setDungeonLoading,
  stepDungeon,
} from './dungeon';
import { calmStray } from './dungeon-strays';
import { sneakPast } from './dungeon-sleepy';
import { gambleBasket } from './dungeon-gamble';
import { takeFromStash } from './dungeon-sack';
import { equipGear, unequipGear } from './gear';
import { setMemory } from './inheritance';
import { buySkill, hasSkill, stepSkillPoints } from './skills';
import { convertScan, stepScans } from './scans';
import { joinTeam, stepTeams } from './teams';

/** Eggs hatch faster with the Warm hands skill, live and during catch-up alike. */
export function hatchSpeed(world: World): number {
  return hasSkill(world, 'warmHands') ? 1.1 : 1;
}
import { resolve } from './obstacles';
import { resolveNubbin } from './nubbin-hop';
import { courseById, prizeFor } from './race';
import { collideThrown } from './throw-collide';
import {
  eduResetSession,
  eduStartBreak,
  eduEndBreak,
  eduResult,
  eduSetAge,
  eduSetGame,
  eduSetName,
  eduSetSession,
  eduLesson,
  eduStart,
  stepEdu,
} from './edu';
import {
  NUBBIN_TYPES,
  type Command,
  type DyeColor,
  type Item,
  type Nubbin,
  type Settings,
  type SimEvent,
  type Tree,
  type Vec2,
  type World,
} from './types';
import { findCuriosity } from './curiosities';

export function defaultSettings(): Settings {
  return {
    offlineAging: {
      mode: OFFLINE.defaultMode,
      capHours: OFFLINE.defaultCapHours,
      allowOfflineDepartures: OFFLINE.defaultAllowDepartures,
    },
    matureContent: 'off',
    riftConfirmed: false,
    joystick: false,
    sound: true,
    music: true,
    musicVolume: 0.8,
    sfxVolume: 0.8,
    textSpeed: 'normal',
    screenShake: true,
    gentleJumps: false,
    particles: 'full',
    reducedMotion: 'system',
    jukebox: null,
    ambience: true,
    graphics: 'pixel',
    sculptRes: null,
  };
}

export function createWorld(seed: number, wallMs: number): World {
  const rng = Rng.fromSeed(seed);
  const world: World = {
    seed,
    rngState: 0,
    timeMs: 0,
    lastWallMs: wallMs,
    nubbins: [],
    items: [],
    trees: [],
    keeper: createKeeper(GROVE.keeperStart),
    inventory: {
      shells: 0,
      fruit: EGG.startFruit,
      critters: {},
      essences: {},
      hats: [],
      heartFruit: 0,
      decor: {},
      wood: 0,
      stone: 0,
      reeds: 0,
      seeds: {},
      dyes: {},
      toys: {},
      twine: 0,
      keepsakes: [],
    },
    settings: defaultSettings(),
    memorials: [],
    gatherReadyMs: 0,
    unlocks: { sunGrove: false, moonGrove: false },
    grove: 'main',
    races: {},
    raceRuns: 0,
    trainer: DEFAULT_TRAINER,
    nextId: 1,
    selected: null,
    strays: [],
    npcs: [],
    campaign: null,
    lines: {},
    weather: createWeather(),
    season: seasonOf(new Date(wallMs)),
    placed: [],
    seen: {},
    visits: { lastDay: '', count: 0, gifted: [] },
    location: 'grove',
    karate: { belt: 0, wins: 0, losses: 0 },
    plants: [],
    tiles: {},
    achievements: {},
    title: null,
    quests: [],
    questDay: '',
    plots: 0,
    wild: [],
    landmarks: {},
    coop: { active: false, trainer: 'nova' },
    keeper2: null,
    edu: null,
    town: { prosperity: 0, recruits: [] },
    partners: [null, null],
    merge: null,
    skillPoints: 0,
    skills: {},
    scans: {},
    team: null,
    night: false,
    tank: { runs: 0, best: 0 },
    dungeon: null,
    hollow: {
      runs: 0,
      best: 0,
      dailyDay: '',
      dailyDepth: 0,
      acts: [],
      actSeeds: [],
      rerollDay: '',
      waypoints: [],
      acorns: 0,
      portal: null,
      camp: { shells: 0, items: {}, questsPaid: [] },
      uniquesBeaten: [],
      lastParty: [],
      // Lane B round 6 (save version 12).
      bossChests: [],
      today: { day: '', deepest: 0, bestMs: 0, finds: 0 },
      stats: { levelMs: [], fights: [], losses: 0, pickups: {}, portals: 0 },
    },
    neighbours: {},
    festivalSeen: '',
    atlasFestivals: [],
  };
  for (const t of GROVE.trees) {
    world.trees.push({
      id: newId(world, 'tree'),
      pos: { x: t.x, z: t.z },
      fruitTimerMs: TREES.fruitIntervalMs / 2,
    });
  }
  for (let i = 0; i < EGG.startCount; i++) {
    const spot = GROVE.eggSpots[i] ?? { x: i * 2 - 1, z: 0 };
    const egg = createEgg(
      newId(world, 'nub'),
      spot,
      rng,
      'plain',
      rollEggSpecies(trainerOf(world.trainer), rng),
    );
    egg.name = uniqueName(world, egg.name, rng);
    world.nubbins.push(egg);
  }
  world.rngState = rng.state;
  return world;
}

/** Avoid two Nubbins sharing a random name. */
export function uniqueName(world: World, name: string, rng: Rng): string {
  const taken = new Set(world.nubbins.map((n) => n.name));
  if (!taken.has(name)) return name;
  const free = NUBBIN_NAMES.filter((n) => !taken.has(n));
  if (free.length > 0) return rng.pick(free);
  return `${name} ${world.nubbins.length + 1}`;
}

export function newId(world: World, prefix: string): string {
  const id = `${prefix}-${world.nextId}`;
  world.nextId += 1;
  return id;
}

export function findNubbin(world: World, id: string): Nubbin | undefined {
  return world.nubbins.find((n) => n.id === id);
}

/** Take the world's RNG, use it, and store the state back. */
export function withRng<T>(world: World, fn: (rng: Rng) => T): T {
  const rng = new Rng(world.rngState);
  const out = fn(rng);
  world.rngState = rng.state;
  return out;
}

// ---------- commands ----------

export function applyCommand(world: World, cmd: Command, events: SimEvent[]): void {
  const start = events.length;
  applyCommandInner(world, cmd, events);
  // Lane B: a Hollow bout that just ended finishes its encounter, calm bout or rumble room.
  if (world.dungeon && events.length > start) hollowBattleEnded(world, events.slice(start), events);
  // A side-story step waiting on this very action (a talk, a visit, a tap) is met.
  if (world.campaign) noteSideCommand(world, world.campaign, cmd);
  // Events from commands (a visit, a craft, a watering) count toward requests on the
  // next step, the same as events the step itself produces.
  if (events.length > start) {
    queueQuestEvents(world, events.slice(start));
    // The campaign counters (storyline goals, the expansions) see command events too.
    if (world.campaign) noteCampaignEvents(world, world.campaign, events.slice(start));
    // Lane C r7 (R0596): and every questline running beside Hazel's Grove.
    noteLineEvents(world, events.slice(start));
  }
}

function applyCommandInner(world: World, cmd: Command, events: SimEvent[]): void {
  const k = world.keeper;
  const now = world.timeMs;
  switch (cmd.kind) {
    case 'moveKeeperTo':
      k.moveTarget = { x: cmd.pos.x, z: cmd.pos.z };
      clampToWorld(k.moveTarget);
      k.intent = null;
      return;
    case 'keeperInput':
      k.input = { x: cmd.input.x, z: cmd.input.z };
      return;
    case 'select':
      world.selected = cmd.id;
      return;
    case 'pet':
      k.intent = { kind: 'pet', nubbinId: cmd.nubbinId };
      k.moveTarget = null;
      return;
    case 'pickUp':
      if (k.carrying) return;
      k.intent = { kind: 'pickUp', nubbinId: cmd.nubbinId };
      k.moveTarget = null;
      return;
    case 'putDown':
      keeperPutDown(world, events);
      return;
    case 'feed':
      if (world.inventory.fruit <= 0) return;
      k.intent = { kind: 'feed', nubbinId: cmd.nubbinId };
      k.moveTarget = null;
      return;
    case 'shakeTree':
      k.intent = { kind: 'shakeTree', treeId: cmd.treeId };
      k.moveTarget = null;
      return;
    case 'collect':
      k.intent = { kind: 'collect', itemId: cmd.itemId };
      k.moveTarget = null;
      return;
    case 'grab': {
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
    }
    case 'drag': {
      const n = heldNubbin(world);
      if (!n) return;
      n.pos.x = cmd.pos.x;
      n.pos.z = cmd.pos.z;
      clampToWorld(n.pos);
      n.y = THROW.holdHeight;
      return;
    }
    case 'jump':
      // With an egg or a Nubbin in hand the jump button shakes it (MOVE-22).
      if (cmd.down && (heldNubbin(world) || k.carrying)) {
        applyCommand(world, { kind: 'shakeHeld' }, events);
        return;
      }
      // MOVE-64: a running jump with the stick pulled toward the camera is a roll.
      if (cmd.down && rollAsked(world) && keeperStartRoll(world, events)) return;
      keeperJump(world, cmd.down);
      return;
    case 'shakeHeld': {
      const n = heldNubbin(world) ?? (k.carrying ? findNubbin(world, k.carrying) : undefined);
      if (!n) return;
      if (now - n.lastShakeMs < EGG.shakeCooldownMs) return;
      n.lastShakeMs = now;
      if (n.stage === 'egg') {
        n.hatchRemainingMs = Math.max(0, n.hatchRemainingMs - EGG.shakeBonusMs);
        events.push({ kind: 'eggShaken', nubbinId: n.id });
      } else {
        react(n, 'dizzy', now, events);
      }
      return;
    }
    case 'release': {
      const n = heldNubbin(world);
      if (!n) return;
      const speed = Math.hypot(cmd.vel.x, cmd.vel.z);
      if (speed >= THROW.minSpeed) {
        noteCare(n, 'throws');
        addTrust(n, TRUST.throw, events);
        noteCampaign(world, 'throw', n.id);
        startThrow(n, cmd.vel, now, events);
      } else if (speed < THROW.placeMaxSpeed) {
        // A gentle place costs nothing: moving a Nubbin somewhere nicer must not hurt it.
        putDown(n, now, events, 'happy');
      } else {
        if (n.stage !== 'egg') applyDrop(n, THROW.dropScale);
        addTrust(n, TRUST.drop * THROW.dropScale, events);
        putDown(n, now, events);
      }
      return;
    }
    case 'switchKeeper': {
      // Legacy toggle: the first trainer of the other side.
      const t = TRAINERS.find((x) => x.band === cmd.alignment);
      if (t) {
        world.trainer = t.id;
        k.alignment = t.band;
      }
      return;
    }
    case 'setTrainer': {
      const t = trainerOf(cmd.id);
      world.trainer = t.id;
      k.alignment = t.band;
      return;
    }
    case 'setGrove':
      if (cmd.grove === 'sun' && !world.unlocks.sunGrove) return;
      if (cmd.grove === 'moon' && !world.unlocks.moonGrove) return;
      world.grove = cmd.grove;
      return;
    case 'giveCritter': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
      if ((world.inventory.critters[cmd.species] ?? 0) <= 0) return;
      const ok = withRng(world, (rng) => giveCritter(n, cmd.species, rng, events));
      if (!ok) return;
      world.inventory.critters[cmd.species] = (world.inventory.critters[cmd.species] ?? 0) - 1;
      nudgeAlignment(n, k.alignment);
      react(n, 'love', now, events);
      return;
    }
    case 'giveEssence': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
      if ((world.inventory.essences[cmd.type] ?? 0) <= 0) return;
      giveEssence(n, cmd.type, events);
      world.inventory.essences[cmd.type] = (world.inventory.essences[cmd.type] ?? 0) - 1;
      nudgeAlignment(n, k.alignment);
      react(n, 'happy', now, events);
      return;
    }
    case 'addRewards': {
      const r = {
        ...cmd.rewards,
        shells: Math.round(cmd.rewards.shells * (hasSkill(world, 'lightFeet') ? 1.1 : 1)),
      };
      if (hasSkill(world, 'seedPocket')) {
        r.seeds = { ...(r.seeds ?? {}) };
        r.seeds.sun = (r.seeds.sun ?? 0) + 1;
      }
      addRewards(world, r, events);
      noteCampaign(world, 'expedition');
      return;
    }
    case 'buy':
      withRng(world, (rng) => buy(world, cmd.item, rng, events));
      return;
    case 'raceResult': {
      // The UI reports the result, so the sim checks it: a known course, a tier that is open,
      // no more shells than the placement pays, and a hat only for a win (review C, 28).
      const course = courseById(cmd.course);
      const won = world.races[cmd.course] ?? 0;
      if (!course || !Number.isInteger(cmd.tier) || cmd.tier < 1 || cmd.tier > Math.min(3, won + 1))
        return;
      world.raceRuns += 1;
      const shells = Math.min(Math.max(0, cmd.shells), prizeFor(cmd.placement, cmd.tier));
      const prize =
        racePrizeMultiplier(world) *
        festivalPrizeMultiplier(world) *
        (hasSkill(world, 'cheerLeader') ? 1.1 : 1);
      world.inventory.shells += Math.round(shells * prize);
      if (cmd.placement === 1) {
        noteQuest(world, 'race', events);
        events.push({
          kind: 'raceWon',
          nubbinId: cmd.nubbinId,
          course: cmd.course,
          tier: cmd.tier,
        });
        if (cmd.rival) addRecruit(world, cmd.rival.name, cmd.rival.species, events);
      }
      noteCampaign(world, 'raceEntered');
      if (cmd.hat && cmd.placement === 1 && !world.inventory.hats.includes(cmd.hat))
        world.inventory.hats.push(cmd.hat);
      if (cmd.placement === 1) {
        world.races[cmd.course] = Math.max(world.races[cmd.course] ?? 0, cmd.tier);
        noteCampaign(world, 'raceWin');
      }
      return;
    }
    case 'wearHat': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n) return;
      if (cmd.hat && !world.inventory.hats.includes(cmd.hat)) return;
      n.hat = cmd.hat;
      // Lane E, R0411: the book notes the hat or look.
      noteNubbin(world, n, events);
      return;
    }
    case 'setSettings': {
      // The menu validates the cap, but a NaN or out-of-range one must never reach catch-up.
      const next = { ...cmd.settings, offlineAging: { ...cmd.settings.offlineAging } };
      sanitizeOfflineAging(next.offlineAging, world.settings.offlineAging.capHours);
      // Lane C r8: a settings copy taken before the story began (a phone's first-launch
      // defaults) must not drop the quest flow it set; the menu always names one.
      if (next.questFlow === undefined && world.settings.questFlow !== undefined)
        next.questFlow = world.settings.questFlow;
      world.settings = next;
      return;
    }
    case 'confirmRift':
      confirmRift(world.settings);
      return;
    // Lane E (R0332): a curiosity the UI spotted, logged once.
    case 'curiosity':
      findCuriosity(world, cmd.id, events);
      return;
    case 'rename': {
      const n = findNubbin(world, cmd.nubbinId);
      if (n) n.name = cmd.name.trim().slice(0, 16) || n.name;
      return;
    }
    case 'debugGive':
      if (cmd.what === 'shells') world.inventory.shells += cmd.amount;
      else if (cmd.what === 'fruit') world.inventory.fruit += cmd.amount;
      else if (cmd.what === 'egg') {
        // Fill the roster for checks: free eggs of every family up to the cap.
        withRng(world, (rng) => {
          const babies = SPECIES.filter((s) => s.stage === 'baby');
          for (let i = 0; i < cmd.amount && hasRoom(world); i++) {
            const egg = createEgg(
              newId(world, 'nub'),
              { x: rng.float(-4, 4), z: rng.float(-3, 3) },
              rng,
              rng.pick(EGG_COLORS),
              rng.pick(babies).id,
            );
            egg.name = uniqueName(world, egg.name, rng);
            world.nubbins.push(egg);
          }
        });
      } else if (cmd.what === 'critter') {
        withRng(world, (rng) => {
          for (let i = 0; i < cmd.amount; i++) {
            const s = rng.pick(WILD_CRITTERS).id;
            world.inventory.critters[s] = (world.inventory.critters[s] ?? 0) + 1;
          }
        });
      } else {
        withRng(world, (rng) => {
          for (let i = 0; i < cmd.amount; i++) {
            const t = rng.pick(NUBBIN_TYPES);
            world.inventory.essences[t] = (world.inventory.essences[t] ?? 0) + 1;
          }
        });
      }
      return;
    case 'holdEndOfLife':
      holdEndOfLife(world, cmd.hold);
      return;
    case 'debugFillNeeds': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n) return;
      n.needs.hunger = 1;
      n.needs.energy = 1;
      return;
    }
    case 'debugForceEvolve': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
      if (n.stage === 'adult') {
        if (n.form && n.form.second === null) secondEvolve(n, events);
        return;
      }
      evolve(n, events, world);
      return;
    }
    case 'debugForceEndOfLife': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage !== 'adult') return;
      n.eternal = null;
      // The Nubbin's own lifespan: slips shorten it and some storylines lengthen it.
      n.stageMs = lifespanMs(n);
      return;
    }
    case 'giveHeartFruit':
      if (world.inventory.heartFruit <= 0) return;
      k.intent = { kind: 'heartFruit', nubbinId: cmd.nubbinId };
      k.moveTarget = null;
      return;
    case 'interact':
      k.intent = { kind: 'interact', nubbinId: cmd.nubbinId, action: cmd.action };
      k.moveTarget = null;
      return;
    case 'call': {
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
    }
    case 'playCatch': {
      const n = findNubbin(world, cmd.nubbinId);
      const toy = world.items.find((i) => i.kind === 'toy');
      if (!n || !toy || !isFree(n) || isWary(n)) return;
      // The ball flies from the Keeper's hands; the Nubbin runs after it.
      withRng(world, (rng) => {
        const a = k.facing + rng.float(-0.5, 0.5);
        toy.pos.x = k.pos.x + Math.sin(a) * rng.float(3, 5);
        toy.pos.z = k.pos.z + Math.cos(a) * rng.float(3, 5);
        clampToWorld(toy.pos);
      });
      n.behavior.state = 'fetch';
      n.behavior.sinceMs = now;
      delete n.behavior.progress;
      n.behavior.untilMs = now + 20_000;
      n.behavior.itemId = toy.id;
      n.behavior.target = { x: toy.pos.x, z: toy.pos.z };
      events.push({ kind: 'fetching', nubbinId: n.id });
      return;
    }
    case 'startLesson': {
      const n = findNubbin(world, cmd.nubbinId);
      if (n) startLesson(world, n, cmd.lesson, events);
      return;
    }
    case 'payService': {
      const n = findNubbin(world, cmd.nubbinId);
      if (n) payService(world, cmd.service, n, events);
      return;
    }
    case 'buyDecor':
      buyDecor(world, cmd.decor, events);
      return;
    case 'placeDecor':
      placeDecor(world, cmd.decor, cmd.pos, events, cmd.yaw ?? 0);
      return;
    case 'removeDecor':
      removeDecor(world, cmd.id);
      return;
    case 'karateResult': {
      // Lane C: kept one release for old screens and story tests. The Shells come from the
      // tier, never the screen (recs FIGHT-02); `battleStart` also checks the belt.
      if (!Number.isInteger(cmd.tier) || cmd.tier < 1 || cmd.tier > BATTLE.karate.tiers) return;
      world.battleRuns = (world.battleRuns ?? 0) + 1;
      world.inventory.shells += karatePrize(cmd.tier, cmd.won);
      recordKarate(world, cmd.nubbinId, cmd.won, cmd.tier, cmd.rival ?? null, events);
      return;
    }
    // Lane C: the battle core keeps the live bout in world.battle.
    case 'battleStart':
      startBattleCmd(world, cmd.context, events);
      return;
    case 'battleAct':
      actBattleCmd(world, cmd.action, events);
      return;
    case 'battleSlots':
      setSlotsCmd(world, cmd.nubbinId, cmd.slots);
      return;
    case 'battleForfeit':
      forfeitBattleCmd(world, events);
      return;
    case 'battlePrefs':
      setBattlePrefsCmd(world, cmd.prefs);
      return;
    // Lane C: the grid-tactics rumble (recs FIGHT-65), kept in world.tactics.
    case 'tacticsStart':
      startRumble(world, events, {
        ...(cmd.depth !== undefined ? { depth: cmd.depth } : {}),
        ...(cmd.ids ? { ids: cmd.ids } : {}),
      });
      return;
    case 'tacticsAct':
      rumbleAct(world, cmd.action, events);
      return;
    case 'tacticsForfeit':
      rumbleForfeit(world, events);
      return;
    case 'tacticsClose':
      rumbleClose(world);
      return;
    case 'trialClear':
      trialClear(world, cmd.id, cmd.steps, events);
      return;
    case 'battleKeepsake':
      if (cmd.id === 'playday-seen') grantKeepsake(world, cmd.id);
      return;
    case 'battleResume':
      resumeBattleCmd(world);
      return;
    case 'battleDraw':
      drawBattleCmd(world, events);
      return;
    case 'storyBout':
      storyBoutChoice(world, cmd.id, cmd.fight, cmd.ids ?? [], events);
      return;
    case 'guardianStart':
      startGuardian(world, events, {
        depth: cmd.depth,
        key: cmd.key,
        ...(cmd.ids ? { ids: cmd.ids } : {}),
      });
      return;
    case 'fuse': {
      const [a, b] = world.partners;
      if (a && b) fuse(world, a, b, events);
      return;
    }
    case 'partyBoutResult': {
      // Lane C: the prize comes from the tier, never the screen (recs FIGHT-02).
      if (!Number.isInteger(cmd.tier) || cmd.tier < 1 || cmd.tier > BATTLE.prizes.party.length)
        return;
      const shells = cmd.won ? partyPrize(cmd.tier, true) : 0;
      world.inventory.shells += shells;
      events.push({ kind: 'partyBout', won: cmd.won, tier: cmd.tier, shells });
      return;
    }
    case 'receiveNubbin':
      receiveNubbin(world, cmd.nubbin, events);
      return;
    case 'tradeAway':
      tradeAway(world, cmd.nubbinId, events);
      return;
    case 'enterDungeon':
      withRng(world, (rng) => enterDungeon(world, cmd.daily, rng, events));
      return;
    case 'leaveDungeon':
      leaveDungeon(world, events);
      return;
    case 'dungeonGo':
      dungeonGo(world, cmd.to, events);
      return;
    case 'setLoading':
      setDungeonLoading(world, cmd.on);
      return;
    case 'enterAct':
      withRng(world, (rng) => enterDungeon(world, false, rng, events, undefined, cmd.act));
      return;
    // Lane B round 4: act camps and fields (R0147, R0152).
    case 'enterTown':
      withRng(world, (rng) => enterTown(world, cmd.act, rng, events));
      return;
    case 'enterMouth':
      enterMouth(world, events);
      return;
    // Lane B round 5: the stray's choice (R0281).
    case 'strayCalm':
      calmStray(world, cmd.id, events);
      return;
    case 'equipGear':
      equipGear(world, cmd.itemId, cmd.nubbinId);
      return;
    case 'unequipGear':
      unequipGear(world, cmd.itemId);
      return;
    case 'stash':
      useStash(world, cmd.amount, events);
      return;
    case 'townBuy':
      townBuy(world, cmd.item, events);
      return;
    case 'townQuest':
      townQuest(world, events);
      return;
    case 'setHollowParty':
      setHollowParty(world, cmd.ids);
      return;
    // Lane B round 6: sneak past (R0180), the Mystery Basket (R0176), the stash (R0174).
    case 'packSneak':
      sneakPast(world, cmd.packId, events);
      return;
    case 'gambleBasket':
      withRng(world, (rng) => gambleBasket(world, cmd.slot, rng, events));
      return;
    case 'stashTake':
      takeFromStash(world, cmd.itemId);
      return;
    // Lane B round 2: waypoints, new paths and the Homing Acorn (R0148–R0150).
    case 'waypointTravel':
      withRng(world, (rng) => waypointTravel(world, cmd.id, rng, events));
      return;
    case 'rerollActs':
      rerollActs(world, events);
      return;
    case 'buyAcorns':
      buyAcorns(world, events);
      return;
    case 'useAcorn':
      useAcorn(world, events);
      return;
    case 'portalReturn':
      portalReturn(world, events);
      return;
    case 'encounterDone':
      encounterDone(world, cmd.outcome, events);
      return;
    case 'feedStray':
      feedStray(world, cmd.id, events);
      return;
    case 'atlasFestival':
      // The festival itself reads the Atlas; the Grove only remembers it was announced.
      if (!world.atlasFestivals.includes(cmd.id)) world.atlasFestivals.push(cmd.id);
      return;
    case 'setLocation':
      if (world.location !== cmd.location) {
        world.location = cmd.location;
        k.pos = { x: GROVE.keeperStart.x, z: GROVE.keeperStart.z };
        k.moveTarget = null;
        k.intent = null;
        events.push({ kind: 'located', location: cmd.location });
      }
      return;
    case 'debugWeather':
      withRng(world, (rng) => setWeather(world, cmd.weather, rng, events));
      return;
    case 'setRunning':
      k.running = cmd.running;
      return;
    case 'playingWith':
      holdSlips(world, cmd.nubbinId);
      return;
    case 'plant':
      plant(world, cmd.plantKind, cmd.flavor, cmd.pos, events);
      return;
    case 'waterPlant':
      waterPlant(world, cmd.id, events);
      return;
    case 'harvest':
      withRng(world, (rng) => harvest(world, cmd.id, rng, events));
      return;
    case 'buyToy':
      buyToy(world, cmd.toy, events);
      return;
    case 'placeToy':
      placeToy(world, cmd.toy, cmd.pos, events);
      return;
    case 'paintTile':
      paintTile(world, cmd.pos, cmd.tile, events);
      return;
    case 'craft': {
      const [recipe, dyeColor] = cmd.recipe.split(':');
      craft(world, recipe as RecipeId, events, dyeColor as DyeColor | undefined);
      return;
    }
    case 'gather':
      gather(world, cmd.what, events);
      return;
    case 'buyPlot':
      buyPlot(world, events);
      return;
    case 'setTitle':
      world.title = cmd.title;
      return;
    case 'claimQuest':
      withRng(world, (rng) => claimQuest(world, cmd.id, rng, events));
      return;
    case 'visit':
      visit(world, cmd.trainer, events);
      return;
    case 'neighbourGift':
      neighbourGift(world, events);
      return;
    case 'feedWild':
      feedWild(world, cmd.id, events);
      return;
    case 'dye':
      dye(world, cmd.nubbinId, cmd.slot, cmd.color, events);
      return;
    case 'wearGlasses':
      wearGlasses(world, cmd.nubbinId, cmd.on);
      return;
    case 'eduStart':
      eduStart(world, cmd.age, events, cmd.band);
      return;
    case 'eduSetBand':
      if (world.edu) world.edu.band = cmd.band;
      return;
    case 'eduSetLanguage':
      if (world.edu) world.edu.storyLanguage = cmd.language;
      return;
    case 'eduSetReadAloud':
      if (world.edu) world.edu.readAloud = cmd.on;
      return;
    case 'eduLesson':
      eduLesson(world, cmd.id, cmd.best);
      return;
    case 'langStart':
      langStart(world, cmd.course);
      return;
    case 'langWord':
      noteWord(world, cmd.word, cmd.how, events);
      return;
    case 'langTraced':
      // The step itself is met by the quest's rule in noteSideCommand, after this.
      langTraced(world, cmd.quest, events);
      return;
    case 'eduSetAge':
      eduSetAge(world, cmd.age, cmd.resetGames);
      return;
    case 'eduSetGame':
      eduSetGame(world, cmd.game, cmd.on);
      return;
    case 'eduSetSession':
      eduSetSession(world, cmd.minutes);
      return;
    case 'eduSetName':
      eduSetName(world, cmd.name);
      return;
    case 'eduResult':
      eduResult(world, cmd.game, cmd.stars, events);
      return;
    case 'eduResetSession':
      eduResetSession(world);
      return;
    case 'eduStartBreak':
      eduStartBreak(world);
      return;
    case 'eduEndBreak':
      eduEndBreak(world);
      return;
    case 'setPartner':
      setPartner(world, cmd.slot, cmd.nubbinId);
      return;
    case 'merge':
      merge(world, events);
      return;
    case 'trainResult':
      trainResult(world, cmd.nubbinId, cmd.stat, cmd.hits, events);
      return;
    case 'setMemory':
      setMemory(world, cmd.nubbinId, cmd.memory);
      return;
    case 'buySkill':
      buySkill(world, cmd.id, events);
      return;
    case 'convertScan':
      withRng(world, (rng) => convertScan(world, cmd.species, rng, events));
      return;
    case 'joinTeam':
      joinTeam(world, cmd.team, events);
      return;
    case 'tankResult': {
      world.inventory.shells += Math.max(0, cmd.shells);
      world.inventory.wood += Math.max(0, cmd.wood);
      world.inventory.stone += Math.max(0, cmd.stone);
      world.tank.runs += 1;
      world.tank.best = Math.max(world.tank.best, cmd.shells);
      events.push({
        kind: 'tankDone',
        shells: cmd.shells,
        wood: cmd.wood,
        stone: cmd.stone,
        won: cmd.won,
      });
      return;
    }
    case 'recruit':
      addRecruit(world, cmd.name, cmd.species, events);
      return;
    case 'setCoop':
      setCoop(world, cmd.active, cmd.trainer, events);
      return;
    case 'keeper2Input':
      if (world.keeper2) world.keeper2.input = { x: cmd.input.x, z: cmd.input.z };
      return;
    case 'keeper2Act':
      keeper2Act(world, cmd.action, events);
      return;
    case 'keeper2Jump':
      keeper2Jump(world, cmd.down);
      return;
    case 'lookAround':
      lookAround(world, events);
      return;
    case 'roll':
      keeperStartRoll(world, events, cmd.dir);
      return;
    case 'viewYaw':
      if (Number.isFinite(cmd.yaw)) world.viewYaw = cmd.yaw;
      return;
    case 'travel':
      travel(world, cmd.exit, events, cmd.sub);
      return;
    case 'fastTravel':
      fastTravel(world, cmd, events);
      break;
    case 'travelAssist':
      travelAssist(world, cmd.pos);
      return;
    case 'ride':
      // R0085: climb on (or get down off) a Nubbin.
      if (cmd.nubbinId) startRide(world, cmd.nubbinId, events);
      else endRide(world, events, 'down');
      return;
    case 'rideCheer':
      cheerRide(world);
      return;
    case 'festivalGagSeen':
      festivalGagSeen(world, cmd.season);
      return;
    case 'teleport':
      teleport(world, cmd.pos);
      return;
    case 'photoTaken':
      noteQuest(world, 'photo', events, cmd.species);
      return;
    case 'campaignStart':
    case 'sceneDone':
    case 'lineAct':
    case 'talk':
    case 'lightLantern':
    case 'debugChapter':
    case 'sideAct':
    case 'storylineStart':
    case 'storyArea':
    case 'storyAct':
      applyCampaignCommand(world, cmd, events);
      return;
    case 'lineAbandon':
      // Lane C r7 (R0643): leave a questline; the Grove keeps its Nubbins.
      abandonLine(world, cmd.line);
      return;
    // Lane C r8 (R0602): the Open quest flow's answers (sim/quest-offers.ts).
    case 'questAccept':
      if (world.campaign) acceptQuest(world, world.campaign, cmd.id, cmd.shelve, events);
      return;
    case 'questDecline':
      if (world.campaign) declineQuest(world, world.campaign, cmd.id);
      return;
    case 'questShelve':
      shelveQuest(world, cmd.id);
      return;
    case 'questTrack':
      trackQuest(world, cmd.id, cmd.on);
      return;
    case 'storyProp':
      // Nothing to change in the world: the side-story runner reads it in applyCommand.
      // R0313: except Fern's stone, a running gag of its own.
      tapFernStone(world, cmd.prop, events);
      return;
    case 'tapToy': {
      // R0322: a face only; the tap toy never touches needs or stats.
      const n = findNubbin(world, cmd.nubbinId);
      if (n && n.stage !== 'egg' && n.stage !== 'cocoon')
        react(n, cmd.beat === 'hiccup' ? 'surprised' : 'dizzy', world.timeMs, events);
      return;
    }
    case 'debugHatchNow': {
      const n = findNubbin(world, cmd.nubbinId);
      if (n && n.stage === 'egg') n.hatchRemainingMs = 0;
      return;
    }
  }
}

export function heldNubbin(world: World): Nubbin | undefined {
  return world.nubbins.find((n) => n.behavior.state === 'held');
}

// ---------- stepping ----------

/**
 * One fixed step with full fidelity. Returns the events that happened. `offline` is set by
 * catch-up for the leftover under a minute, so end-of-life checks follow the away rules.
 */
export function stepWorld(
  world: World,
  dtMs: number,
  wallMs?: number,
  offline = false,
  countPlay = true,
): SimEvent[] {
  const events: SimEvent[] = [];
  world.timeMs += dtMs;
  if (wallMs !== undefined) world.lastWallMs = wallMs;

  withRng(world, (rng) => {
    updateTrees(world, dtMs, rng, events);
    updateItems(world, dtMs);
    // Iterate a copy: a departure removes its Nubbin from the list.
    for (const n of [...world.nubbins]) {
      if (n.stage === 'egg') {
        if (!isHeld(n) && n.behavior.state !== 'thrown') {
          n.hatchRemainingMs -= dtMs * hatchSpeed(world);
        } else {
          n.hatchRemainingMs -= dtMs * hatchSpeed(world); // eggs still incubate while carried
        }
        if (n.hatchRemainingMs <= 0 && !isHeld(n) && n.behavior.state !== 'thrown') {
          hatch(n, events, world.timeMs);
          // Lane E, R0394: the eggshell goes in the hat box as the egg hatches.
          keepEggshell(n, world);
        }
        if (n.behavior.state === 'thrown') {
          updateBehavior(n, world, dtMs, rng, events);
          // MOVE-33: a thrown egg bounces off walls and never comes to rest inside one.
          if (n.behavior.state === 'thrown') collideThrown(world, n, events);
          else resolve(n.pos, world, 0.25, 'nubbin');
        }
        continue;
      }
      decayNeeds(n, dtMs);
      advanceStage(n, dtMs, events, world, offline);
      // Party members underground are moved by the Hollow step instead.
      // R0085: the ridden Nubbin is pinned under the Keeper by stepRide instead.
      if (world.nubbins.includes(n) && !inParty(world, n.id) && !isRidden(world, n.id)) {
        updateBehavior(n, world, dtMs, rng, events);
        // MOVE-33: a thrown Nubbin bonks off what is taller than it flies.
        if (n.behavior.state === 'thrown') collideThrown(world, n, events);
        resolveNubbin(n, world);
      }
    }
    // Keeper actions happen only in live play: catch-up never walks to or acts on a saved
    // intent (pet, feed, hug), and the intent waits for the Keeper to come back.
    if (!offline) {
      // R0085/R0088: the carrier follows the Keeper's step; a swimmer tows it through the pond.
      const fx = world.keeper.pos.x;
      const fz = world.keeper.pos.z;
      updateKeeper(world, dtMs, events);
      const moved = Math.hypot(world.keeper.pos.x - fx, world.keeper.pos.z - fz);
      stepRide(world, dtMs, moved, events);
      stepSwimTow(world);
    }
    // MOVE-56: walking up to a story prop with a reach meets its step, as a tap does.
    if (!offline) stepPropReach(world);
    // MOVE-58: the one-time hop lesson.
    if (!offline) stepHopLesson(world, events);
    // MOVE-63: the hop course's flags and timer.
    if (!offline) stepHopCourse(world, events);
    stepTrust(world, dtMs, events);
    stepNpcs(world, dtMs, rng, events);
    separateBodies(world, dtMs);
    stepWeather(world, dtMs, rng, events);
    stepBreeding(world, rng, events);
    if (wallMs !== undefined) {
      world.season = seasonOf(new Date(wallMs));
      stepDaily(world, wallMs, rng, events);
    }
    stepLineQueue(world, dtMs, events);
    stepCampaign(world, dtMs, events);
    stepStoryBook(world, dtMs, events);
    stepPlants(world, dtMs, rng, events);
    stepHabitats(world, dtMs, rng, events);
    stepKeeper2(world, dtMs, events);
    stepEdu(world, dtMs, offline || !countPlay ? undefined : wallMs, offline || !countPlay);
    stepSlips(world, dtMs, events);
    stepPartners(world, dtMs, events);
    stepCurfew(world, dtMs, wallMs, events);
    stepQuests(world, wallMs, rng, events);
    stepDungeon(world, dtMs, rng, events);
  });
  stepCollection(world, events);
  stepFriendships(world, dtMs, events);
  stepLandmarks(world, events);
  stepCollectibles(world, events);
  stepLittleGrove(world);
  stepSeasons(world, events);
  stepAchievements(world, events, dtMs);
  stepTown(world, events);
  stepScans(world, dtMs, events);
  stepSkillPoints(world, events);
  stepTeams(world, events);
  // Lane C: new moves join the kit (sim/battle/moves-sources.ts), in live play only.
  if (!offline) stepBattleMoves(world, dtMs, events);
  // Lane C round 6 (FIGHT-64, FIGHT-85): a live bout's party keeps its needs, offline too.
  holdBattleNeeds(world);

  // Lifetime happiness sampling, once a sim second.
  if (Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000)) {
    sampleAll(world);
  }
  return events;
}

/**
 * The time between fruit drops now: the season (autumn) and Green Thumb change it. Live play
 * and offline catch-up both read it, so time away grows the same fruit as time here.
 */
export function fruitIntervalMs(world: World): number {
  const thumb = hasSkill(world, 'greenThumb') ? SKILLS.greenThumbFruitInterval : 1;
  return TREES.fruitIntervalMs * fruitIntervalMultiplier(world) * thumb;
}

function updateTrees(world: World, dtMs: number, rng: Rng, events: SimEvent[]): void {
  for (const tree of world.trees) {
    tree.fruitTimerMs -= dtMs;
    if (tree.fruitTimerMs <= 0) {
      tree.fruitTimerMs += fruitIntervalMs(world);
      if (world.items.filter((i) => i.kind === 'fruit').length >= TREES.maxFruitOnGround) continue;
      dropFruit(world, tree, rng, events);
    }
  }
}

export function dropFruit(world: World, tree: Tree, rng: Rng, events: SimEvent[]): Item {
  const a = rng.float(0, Math.PI * 2);
  const r = rng.float(0.8, TREES.dropRadius);
  const item: Item = {
    id: newId(world, 'fruit'),
    kind: 'fruit',
    pos: { x: tree.pos.x + Math.cos(a) * r, z: tree.pos.z + Math.sin(a) * r },
    y: 2.4,
    vel: { x: 0, y: 0, z: 0 },
  };
  world.items.push(item);
  events.push({ kind: 'fruitDropped', treeId: tree.id, itemId: item.id });
  // R0300: a Nubbin under the tree may get it on the head.
  fruitOnHead(world, item, tree.pos, events);
  return item;
}

function updateItems(world: World, dtMs: number): void {
  const dt = dtMs / 1000;
  for (const item of world.items) {
    if (item.y > 0) {
      item.vel.y -= THROW.gravity * dt;
      item.y = Math.max(0, item.y + item.vel.y * dt);
      if (item.y === 0) item.vel.y = 0;
    }
  }
}

export function positionOf(world: World, id: string): Vec2 | null {
  return findNubbin(world, id)?.pos ?? world.items.find((i) => i.id === id)?.pos ?? null;
}
