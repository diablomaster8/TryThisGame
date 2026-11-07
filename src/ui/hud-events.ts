import { personalityCardLines } from '../content/edu-personality-cards';
/**
 * The HUD's reaction to sim events (TECH-24, R0466): the toasts, sounds, panels and chips each
 * SimEvent kind causes. It was the body of `hooks.onEvents` in `mountHud`; the HUD hands it
 * the parts it needs in one `EventCtx`. Newer kinds are decided in `event-feedback.ts`.
 */
import { TRAINER_LABELS as TL } from '../config/strings';
import { UI_FX_TEXT } from '../config/strings-ui';
import { ACTS } from '../config/dungeon-acts';
import { STORY_TEXT } from '../config/story';
import {
  GEAR_TEXT,
  GUARDIAN_TEXT,
  HOLLOW_ZONE_TEXT,
  RUMBLE_TEXT,
  SHRINE_TEXT,
  TRAP_TEXT,
  UNIQUE_RESULT_TEXT,
  UNIQUE_TEXT,
} from '../config/strings-dungeon';
import { requestLine } from '../config/strings-fun-r6';
import { GENTLE_HANDS, LOCKED_TEXT, MOSS_WATCH, SIT_TEXT } from '../config/strings-fun-r7';
import { SECRETS_R9B_TEXT } from '../config/strings-hollow-r9-b';
import { EDU_REBORN_TEXT } from '../config/strings-kids';
import { REMEMBRANCE_TEXT } from '../config/strings-look-r9e';
import { petToast } from '../config/strings-look';
import { MOVE_TEXT } from '../config/strings-move';
import { R10B4_TEXT } from '../config/strings-r10b4';
import {
  PHOTO_FRAME_TEXT,
  REGION_GAG_TEXT,
  SEASON_KEEPSAKE_TEXT,
  WILD_NUBBIN_TEXT,
} from '../config/strings-r12d2';
import { REGION_LIFE_TEXT } from '../config/strings-r11d8';
import { CAVE_TEXT } from '../config/strings-r17d1';
import { SHORE_FOLK_TEXT, SHORE_PLAY_TEXT } from '../config/strings-r13d1';
import {
  ACT_TEXT,
  CAMP_TEXT,
  DUNGEON_TEXT,
  EDU_TEXT,
  HAT_LABELS,
  HOLLOW_R6_TEXT,
  HOLLOW_R7_TEXT,
  HOLLOW_TEXT,
  LANG_TEXT,
  NAMES,
  PERSONALITY_LABELS,
  SPECIES_LABELS,
  STAT_LABELS,
  TEN_TEXT,
  TRAINER_LABELS,
  UI_TEXT,
} from '../config/strings';
import { UNREACHABLE } from '../config/tuning-move';
import type { Game } from '../game';
import { ExpeditionScreen } from '../minigames/expedition/screen';
import { TankScreen } from '../minigames/tank/screen';
import { playChirp, playHollowCue, playSound, setSoundEnabled } from '../platform/audio';
import { noteEventKinds } from '../platform/bug-log';
import { buzz, hapticFor } from '../platform/haptics';
import { armPersistRequest } from '../platform/persist';
import { evolveFlash } from '../render/evolve-reveal';
import { toastBeat } from '../render/pet-reactions';
import { clockText } from '../sim/dungeon-log';
import { firstMinuteQuiet } from '../sim/first-loop';
import { langWord } from '../sim/lang';
import { SKILL_LIST } from '../sim/skills';
import { speciesOf } from '../sim/species';
import { storylineById } from '../sim/story-scenes';
import { chapterTitle } from '../sim/storyline';
import type { SimEvent } from '../sim/types';
import { BackupNudge } from './backup-nudge';
import { AmbientBubbles, BarkBubble } from './bark-bubble';
import { Celebration } from './celebration';
import { keepsakeToast, keyLabel } from './collection';
import { CuriosityWatch } from './curiosities';
import { gearGlyph, gearName } from './dungeon-gear';
import { itemsToast } from './dungeon-items';
import { DungeonMenu } from './dungeon';
import { EduScreen } from './edu';
import { badgeLine, feedbackFor, groveSfx, runFeedback } from './event-feedback';
import { fernStoneLine, slipNudge, toastBand } from './fun-toasts';
import { gateShutToast } from './gate-toast';
import { GymMenu } from './gym';
import { HatchCard } from './hatch-card';
import { floorsToast } from './hollow-floors-r8';
import { hollowKidVoice } from './hollow-kid-voice';
import { hollowCueFor } from './hollow-sounds';
import { HopCourseChip } from './hop-course';
import { KarateMenu } from './karate';
import { mountLandmarkCard } from './landmark-card';
import { speakLine } from './lesson';
import { EduNoticing } from './edu-noticing'; /* R0723 */
import { arrivalBeat, pitchLines } from './line-pitch';
import { mossReaction } from './moss-watch';
import { noteHowTo } from './objective';
import { OfferCard } from './offer-card';
import { RacesMenu } from './races';
import { RegionChip } from './region-chip';
import { rideToast } from './ride-toasts';
import { ShopMenu } from './shop';
import { shyLine } from './shy-lines';
import { soulSound, soulToast } from './soul-toasts';
import { hintToast, secretToasts, traceToasts } from './world-hints-ui';

let lastUnreachableToast = -Infinity;

/**
 * The sim's `cantReach` event (a care walk that stalled), checked by its kind as a string so
 * this compiles before the sim branch that adds the event type is merged.
 */
function cantReachToast(
  e: { kind: string; targetId?: string },
  g: Game,
  toast: (text: string) => void,
): boolean {
  if (e.kind !== 'cantReach') return false;
  const n = e.targetId ? g.world.nubbins.find((x) => x.id === e.targetId) : undefined;
  toast(UI_FX_TEXT.cantReach(n?.name ?? UI_FX_TEXT.cantReachThere));
  return true;
}

/** What the handler reads from the HUD; every member is built once in `mountHud`. */
export interface EventCtx {
  ambientBubbles: AmbientBubbles;
  backupNudge: BackupNudge;
  barkBubble: BarkBubble;
  celebration: Celebration;
  curiosities: CuriosityWatch;
  dungeon: DungeonMenu;
  edu: EduScreen;
  expedition: ExpeditionScreen;
  game: () => Game | null;
  gym: GymMenu;
  hatchCard: HatchCard;
  heldQuiet: string[];
  hopCourse: HopCourseChip;
  karate: KarateMenu;
  landmarkCard: ReturnType<typeof mountLandmarkCard>;
  locationLabel: (loc: string) => string;
  noticing: EduNoticing;
  offerCard: OfferCard;
  races: RacesMenu;
  regionChip: RegionChip;
  shop: ShopMenu;
  tank: TankScreen;
  toast: (text: string, ms?: number) => void;
  /** Mutable counters the HUD and this handler share. */
  hs: HudState;
}

export interface HudState {
  strayLine: number;
  heldFestival: string | null;
}

export function handleHudEvents(c: EventCtx, events: SimEvent[]): void {
  const {
    ambientBubbles,
    backupNudge,
    barkBubble,
    celebration,
    curiosities,
    dungeon,
    edu,
    expedition,
    game,
    gym,
    hatchCard,
    heldQuiet,
    hopCourse,
    karate,
    landmarkCard,
    locationLabel,
    noticing,
    offerCard,
    races,
    regionChip,
    shop,
    tank,
    toast,
    hs,
  } = c;
  const g = game();
  if (!g) return;
  setSoundEnabled(g.world.settings.sound);
  curiosities.onEvents(events);
  /* Lane E r9, R0424: a friend of a departed Nubbin keeps its flower. */
  for (const e of events)
    if (e.kind === 'remembrance') {
      const who = g.world.nubbins.find((x) => x.id === e.nubbinId);
      if (who) toast(REMEMBRANCE_TEXT.given(who.name, e.friend));
    }
  noteEventKinds(events);
  // TECH-15: a buzz for the moments that have one.
  for (const e of events) {
    const h = hapticFor(e);
    if (h) buzz(h, g.world.settings, document.documentElement.classList.contains('reduce-motion'));
  }
  backupNudge.onEvents(events);
  // Lane B r8: the Scout's "!" and the boss scroll (ui/hollow-scroll.ts).
  dungeon.onEvents(events, g.world, toast);
  // Lane B r8 (floors): secrets, puzzles, part shortcuts, the boss door (ui/hollow-floors-r8.ts).
  for (const e of events) {
    const t = floorsToast(g.world, e);
    if (t) toast(t);
  }
  hollowKidVoice(g.world, events, toast); /* Lane B r10 (R0188): kid mode's read-aloud. */
  offerCard.onEvents(events);
  regionChip.onEvents(events, toast);
  pitchLines(events, g.world, (cmd) => g.send(cmd));
  arrivalBeat(events, g.world, document.documentElement.classList.contains('dialogue-open'), toast);
  for (const e of events) {
    // R0319: the chip's how-to steps tick off on their events.
    noteHowTo(g.world, e.kind);
    // R0199 (lane B r7): the Hollow's encounter cues.
    const cue = hollowCueFor(e, g.world);
    if (cue) playHollowCue(cue);
    // R0351: a shaken egg says a muffled "hey" from inside; the foot gag squeaks.
    if (e.kind === 'eggShaken') playSound(e.foot ? 'squeak' : 'eggHey');
    // R0531: the personality locks in: a line on the evolution card, with the reason.
    if (e.kind === 'personalityLocked') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      celebration.addLine(
        `${LOCKED_TEXT.grewUp(n?.name ?? NAMES.creature, PERSONALITY_LABELS[e.personality])} ${LOCKED_TEXT.cause[e.cause]}`,
      );
      // R0591: the Learning Grove reader's personality card, once per personality.
      if (e.card)
        for (const l of personalityCardLines(e.personality, n?.name ?? NAMES.creature))
          celebration.addLine(l);
    }
    // R0527: in the Learning Grove a throw gets a picture hint.
    if (e.kind === 'thrown' && g.world.edu) toast(GENTLE_HANDS);
    // R0353: Moss saw that.
    const moss = mossReaction(g.world, e);
    if (moss) ambientBubbles.show(moss.mossId, MOSS_WATCH.name, moss.line, performance.now());
    // Lane A r8: a first taste reaction, a grumpy refusal, a moody look cleared.
    const soul = soulToast(g.world, e);
    if (soul) toast(soul);
    const soulSnd = soulSound(e);
    if (soulSnd) playSound(soulSnd);
    // R0352: rule three, noticed once a Nubbin sits down beside the sitting Keeper.
    if (e.kind === 'sitBeside') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      if (n) toast(SIT_TEXT[toastBand(g.world)].replaceAll('{n}', n.name));
    }
    // R0450 (TECH-08): the Grove's quiet moments get their sounds.
    const groveSnd = groveSfx(e);
    if (groveSnd) playSound(groveSnd);
    if (cantReachToast(e as unknown as { kind: string; targetId?: string }, g, toast)) continue;
    // R11 d7: a shut gate says what opens it.
    const shut = gateShutToast(e);
    if (shut) {
      toast(shut);
      continue;
    }
    // R0085/R0088: riding and the swim tow.
    const ride = rideToast(e, g.world);
    if (ride) {
      toast(ride);
      continue;
    }
    // R0723: a sprout's Grove noticing, spoken and rate-limited.
    const noticed = noticing.onEvent(e, g.world, performance.now());
    if (noticed) {
      speakLine(noticed.text);
      toast(noticed.text);
      g.send({ kind: 'eduNotice', item: noticed.item });
    }
    // R0467: a badge earned with the hatch rides on the hatch card as a chip.
    if (e.kind === 'achievement' && hatchCard.foldBadge(badgeLine(e.id, e.shells))) continue;
    // R0466 (TECH-24): the plain toast-and-sound kinds are one table (ui/event-feedback.ts).
    if (runFeedback(feedbackFor(e, { world: g.world }), toast, playSound)) continue;
    if (e.kind === 'hatched') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      hatchCard.add(n, n?.name ?? NAMES.creature);
      playSound('hatch');
      armPersistRequest();
    } else if (e.kind === 'evolved') {
      celebration.show(e);
      evolveFlash(g.camera.reduceMotion);
      playSound('evolve');
    } else if (e.kind === 'hopCourse') {
      hopCourse.onEvent(e, toast);
    } else if (e.kind === 'moveUnreachable') {
      // MOVE-35: a gentle bonk every time, the words at most once a while.
      playSound('bonk');
      const now = performance.now();
      if (now - lastUnreachableToast >= UNREACHABLE.toastEveryMs) {
        lastUnreachableToast = now;
        toast(e.jump ? MOVE_TEXT.jumpUpThere : MOVE_TEXT.cantGoThere);
      }
    } else if (e.kind === 'secondEvolved' || e.kind === 'speciesGrew' || e.kind === 'ascended') {
      // Lane F r11 (EVO): the later stages get the card (and not a toast as well).
      celebration.showStage(e);
      if (e.kind === 'ascended') evolveFlash(g.camera.reduceMotion);
    } else if (e.kind === 'reborn') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      // R0691: a sprout hears a gentle line about the glowing cocoon and the new egg.
      if (g.world.edu?.band === 'sprout' && g.world.edu.readAloud)
        speakLine(EDU_REBORN_TEXT.say(n?.name ?? NAMES.creature));
      else toast(UI_TEXT.reborn(n?.name ?? NAMES.creature));
    } else if (e.kind === 'bought') {
      shop.onBought(e.ok, e.reason, e.item);
      if (e.ok) playSound('buy');
    } else if (e.kind === 'chapter' && e.line) {
      // Lane C r7 (R0596): a questline beside Hazel's Grove names itself.
      const line = g.world.lines[e.line];
      const title = line ? chapterTitle(line, e.chapter) : null;
      const name = storylineById(e.line)?.title ?? e.line;
      if (title !== null) toast(CAMP_TEXT.lineChapter(name, e.chapter, title));
    } else if (e.kind === 'lineEnded') {
      const s = storylineById(e.line);
      toast(CAMP_TEXT.lineEnded(s?.title ?? e.line, s?.endings[e.ending]?.title ?? e.ending));
    } else if (e.kind === 'chapter') {
      const title = chapterTitle(g.world.campaign, e.chapter);
      if (title !== null) toast(STORY_TEXT.chapterStarted(e.chapter, title));
    } else if (e.kind === 'langReact' && events.find((x) => x.kind === 'langReact') === e) {
      // One caption per word, for the nearest Nubbin; the faces show on every one.
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      toast(
        LANG_TEXT.reacted(
          n?.name ?? NAMES.creature,
          LANG_TEXT.gestures[e.gesture] ?? '',
          langWord(e.word)?.roman ?? e.word,
        ),
      );
    } else if (e.kind === 'talked') {
      const npc = g.world.npcs.find((x) => x.id === e.npcId);
      const name = npc ? (TRAINER_LABELS[npc.trainer]?.name ?? npc.trainer) : '';
      // R0295: the Keeper's own line in a bubble over their head.
      if (e.bark) barkBubble.show(e.npcId, name, e.bark, performance.now());
      else toast(STORY_TEXT.talkedTo(name));
    } else if (e.kind === 'interacted') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      const name = n?.name ?? NAMES.creature;
      // FUN-09: each action and personality has its own line.
      // R0350: a Shadow Nubbin still earning trust says how close it came.
      const shy = n ? shyLine(n, e.ok, e.action, toastBand(g.world)) : null;
      toast(
        shy ??
          (e.ok && n
            ? petToast(name, toastBeat(n, e.action, g.world.timeMs), n.personality)
            : e.ok
              ? UI_TEXT.interacted(name, e.action)
              : UI_TEXT.interactRefused(name)),
      );
      if (e.ok) playSound('pet');
    } else if (e.kind === 'weather') {
      // No sky underground or inside a minigame (review 2026-10-21, bug 20).
      const loc = g.world.location;
      if (
        loc === 'hollow' ||
        loc === 'dungeon' ||
        expedition.isOpen ||
        races.screen.isOpen ||
        karate.screen.isOpen ||
        gym.screen.isOpen ||
        tank.isOpen
      )
        continue;
      toast(
        e.weather === 'rain'
          ? UI_TEXT.weatherRain
          : e.weather === 'snow'
            ? UI_TEXT.weatherSnow
            : UI_TEXT.weatherClear,
      );
    } else if (e.kind === 'visitor') {
      const who = TL[e.trainer]?.name ?? e.trainer;
      // R0467: in a new save's first minute the visitor waits for the hatch to finish.
      const visit = e.gift
        ? UI_TEXT.visitor(who, UI_TEXT.giftNames[e.gift])
        : UI_TEXT.visitorNoGift(who);
      if (firstMinuteQuiet(g.world)) heldQuiet.push(visit);
      else toast(visit);
      if (e.gift) playSound('buy');
    } else if (e.kind === 'lanternNight') {
      toast(UI_TEXT.lanternNight);
    } else if (e.kind === 'decorPlaced') {
      toast(UI_TEXT.decorPlaced);
      playSound('pickup');
    } else if (e.kind === 'decorRefused') {
      toast(UI_TEXT.decorRefused[e.reason]);
    } else if (e.kind === 'firstSeen') {
      if (!hatchCard.foldFirstSeen()) toast(UI_TEXT.firstSeen(keyLabel(e.key)));
    } else if (e.kind === 'received') {
      toast(e.ok ? UI_TEXT.received(e.name) : UI_TEXT.receiveFull);
    } else if (e.kind === 'traded') {
      toast(UI_TEXT.traded(e.name));
    } else if (e.kind === 'dungeonEntered') {
      toast(
        e.cave
          ? (CAVE_TEXT.entered[e.cave] ?? DUNGEON_TEXT.entered(false))
          : e.camp
            ? HOLLOW_ZONE_TEXT.campEntered
            : DUNGEON_TEXT.entered(e.daily),
      );
    } else if (e.kind === 'descended') {
      toast(DUNGEON_TEXT.descended(e.depth));
      playSound('pickup');
    } else if (e.kind === 'dungeonLeft') {
      // R0115: a small cave comes back out into the region, not "home".
      toast(
        e.cave ? CAVE_TEXT.left(e.items, e.shells) : DUNGEON_TEXT.left(e.depth, e.shells, e.items),
      );
    } else if (e.kind === 'dungeonFound') {
      const who = e.by ? (g.world.nubbins.find((x) => x.id === e.by)?.name ?? null) : null;
      toast(DUNGEON_TEXT.found(who, DUNGEON_TEXT.lootName(e.loot, e.amount, e.param)));
      playSound('pickup');
    } else if (e.kind === 'chestOpened') {
      toast(DUNGEON_TEXT.chest(e.shells, e.egg));
      playSound('buy');
    } else if (e.kind === 'strayFed') {
      // R0326: the strays' comic lines rotate.
      const fed = HOLLOW_R6_TEXT.strayLines.fed;
      toast(
        e.ok && e.name ? fed[hs.strayLine++ % fed.length]!(e.name) : DUNGEON_TEXT.strayNeedsFruit,
      );
    } else if (e.kind === 'strayStartled') {
      const lines = HOLLOW_R6_TEXT.strayLines.snatch;
      toast(lines[hs.strayLine++ % lines.length]!(e.shells));
    } else if (e.kind === 'packBeaten') {
      // Monster packs (lane B, R0146).
      toast(HOLLOW_TEXT.packBeaten(e.shells));
    } else if (e.kind === 'partyGiggles') {
      toast(HOLLOW_R6_TEXT.giggles);
      // Lane B r10 (R0155): a Snack Thief took a fruit.
      if (e.snack) toast(R10B4_TEXT.snackThief);
    } else if (e.kind === 'speedSplit') {
      // Lane B round 7: speed runs (R0187).
      const d =
        e.delta === undefined
          ? ''
          : HOLLOW_R7_TEXT.delta(e.delta <= 0, clockText(Math.abs(e.delta)));
      toast(HOLLOW_R7_TEXT.split(e.n, clockText(e.ms), d));
    } else if (e.kind === 'speedFinish') {
      toast(HOLLOW_R7_TEXT.finish(clockText(e.ms), e.best));
    } else if (e.kind === 'hollowWearable') {
      // Lane B round 7: a boss's keepsake (R0206).
      toast(
        HOLLOW_R7_TEXT.wearableGiven(
          HOLLOW_R7_TEXT.wearables[e.id as keyof typeof HOLLOW_R7_TEXT.wearables] ??
            SECRETS_R9B_TEXT.wearables[e.id] ??
            e.id,
        ),
      );
    } else if (e.kind === 'hollowTier' || e.kind === 'hollowTierOpened') {
      // Lane B round 7: difficulty tiers (R0179).
      const name = HOLLOW_R7_TEXT.tiers[e.tier].name;
      toast(
        e.kind === 'hollowTier' ? HOLLOW_R7_TEXT.tierPicked(name) : HOLLOW_R7_TEXT.tierOpened(name),
      );
    } else if (e.kind === 'picnicRest' || e.kind === 'picnicTent' || e.kind === 'deepBottom') {
      // Lane B round 7: Gran's Picnic (R0204).
      toast(HOLLOW_R7_TEXT[e.kind]);
      if (e.kind === 'picnicRest') playSound('buy');
    } else if (e.kind === 'packFled') {
      toast(HOLLOW_TEXT.packFled);
    } else if (e.kind === 'strayShooed') {
      // Lane B round 3: strays as a chase (R0162).
      const n = e.by ? g.world.nubbins.find((x) => x.id === e.by) : undefined;
      toast(HOLLOW_TEXT.strayShooed(n?.name ?? ''));
    } else if (e.kind === 'trailShell') {
      playSound('pickup');
    } else if (e.kind === 'shrineUsed') {
      // Lane B round 3: shrines (R0159).
      const k = SHRINE_TEXT.kinds[e.shrine];
      if (k) toast(SHRINE_TEXT.used(k.name, k.does));
    } else if (e.kind === 'shrineFaded') {
      const k = SHRINE_TEXT.kinds[e.shrine];
      if (k) toast(SHRINE_TEXT.faded(k.name));
    } else if (e.kind === 'trapSprung') {
      // Lane B round 3: traps (R0161).
      toast(e.wire ? R10B4_TEXT.bellWire : (TRAP_TEXT.sprung[e.trap] ?? ''));
    } else if (e.kind === 'trapSpotted') {
      toast(TRAP_TEXT.spotted);
    } else if (e.kind === 'hollowFell') {
      // Lane B round 3: a Hollow fall pops the Keeper back (R0031).
      toast(e.water ? HOLLOW_TEXT.fellWater : HOLLOW_TEXT.fellChasm);
    } else if (e.kind === 'uniqueBeaten') {
      // Lane B round 4: a named unique beaten (R0156).
      const name = UNIQUE_TEXT[e.id]?.name ?? '';
      toast(e.bonus ? UNIQUE_RESULT_TEXT.firstWin(name, e.bonus) : UNIQUE_RESULT_TEXT.again(name));
    } else if (e.kind === 'guardianHall') {
      toast(GUARDIAN_TEXT[e.phase]);
    } else if (e.kind === 'rumbleRoom') {
      // Lane B round 5: rumble rooms (R0257, R0282) and the stray's choice (R0281).
      const p = RUMBLE_TEXT.prefix[e.prefix] ?? '';
      if (e.phase === 'start') toast(RUMBLE_TEXT.start(p));
      else if (e.phase === 'lost') toast(RUMBLE_TEXT.lost);
      else {
        const l = e.loot;
        const what =
          l?.kind === 'hat'
            ? RUMBLE_TEXT.loot.hat(l.param)
            : l?.kind === 'critter'
              ? RUMBLE_TEXT.loot.critter(l.param)
              : RUMBLE_TEXT.loot.shells(l?.amount ?? 0);
        toast(`${RUMBLE_TEXT.won(p)} ${what}`);
        playSound('buy');
      }
    } else if (e.kind === 'gearFound') {
      toast(GEAR_TEXT.found(gearGlyph(e.item), gearName(e.item)));
    } else if (e.kind === 'hollowItems') {
      // Lane B round 8: charms, keys, chains, wheelbarrow mixes and the Pillow Fort.
      toast(itemsToast(e));
    } else if (e.kind === 'haulBanked') {
      // Lane B round 6: the haul card (R0175), boss card (R0160), losses and sleepy packs.
      if (e.items > 0) {
        toast(HOLLOW_R6_TEXT.banked(e.items));
        playSound('buy');
      }
    } else if (e.kind === 'bossCelebration') {
      const boss = ACT_TEXT[ACTS[e.act]?.id ?? '']?.boss ?? '';
      celebration.showLines(HOLLOW_R6_TEXT.bossTitle(boss), [
        HOLLOW_R6_TEXT.bossBody,
        HOLLOW_R6_TEXT.bossChest(gearGlyph(e.item), gearName(e.item)),
        ...(e.next ? [HOLLOW_R6_TEXT.bossNext] : []),
      ]);
      playSound('evolve');
    } else if (e.kind === 'sneakOffer') {
      toast(HOLLOW_R6_TEXT.sneakAsk);
    } else if (e.kind === 'sneakPast') {
      toast(HOLLOW_R6_TEXT.sneakDone);
    } else if (e.kind === 'tiptoe') {
      toast(HOLLOW_R6_TEXT.tiptoe(e.shells));
      playSound('pickup');
    } else if (e.kind === 'packWoke') {
      const lazy = g.world.dungeon?.party
        .map((id) => g.world.nubbins.find((x) => x.id === id))
        .find((x) => x?.personality === 'lazy');
      toast(e.yawn && lazy ? HOLLOW_R6_TEXT.yawned(lazy.name) : HOLLOW_R6_TEXT.woke);
    } else if (e.kind === 'tumbleHome') {
      toast(
        e.kept + e.camp > 0
          ? `${HOLLOW_R6_TEXT.tumble} ${HOLLOW_R6_TEXT.tumbleKept(e.kept, e.camp)}`
          : HOLLOW_R6_TEXT.tumble,
      );
      playSound('splash');
    } else if (e.kind === 'basketOpened') {
      toast(
        e.ok && e.item
          ? HOLLOW_R6_TEXT.basketOpened(gearGlyph(e.item), gearName(e.item))
          : HOLLOW_R6_TEXT.basketShort,
      );
      if (e.ok) playSound('buy');
    } else if (e.kind === 'strayKing') {
      toast(HOLLOW_R6_TEXT.strayLines.king(HAT_LABELS[e.hat] ?? e.hat));
      playSound('buy');
    } else if (e.kind === 'strayAsk') {
      toast(RUMBLE_TEXT.strayAsk);
      playSound('sneak'); /* R0326 (lane E r10) */
    } else if (e.kind === 'strayCalmed') {
      toast(e.ok ? RUMBLE_TEXT.calmed(e.shells) : RUMBLE_TEXT.calmFailed);
    } else if (e.kind === 'bossGuard') {
      toast(HOLLOW_TEXT.bossGuard);
    } else if (e.kind === 'bossBeaten') {
      const act = ACTS[e.act];
      toast(HOLLOW_TEXT.bossBeaten(act ? (ACT_TEXT[act.id]?.boss ?? '') : ''));
      playSound('buy');
      // Lane B round 2: waypoints, new paths and the Homing Acorn.
    } else if (e.kind === 'waypointActivated') {
      toast(HOLLOW_TEXT.waypointActivated);
    } else if (e.kind === 'waypointArrived') {
      toast(HOLLOW_TEXT.waypointArrived);
    } else if (e.kind === 'actsRerolled') {
      toast(e.ok ? HOLLOW_TEXT.newPathsDone : HOLLOW_TEXT.newPathsLater);
    } else if (e.kind === 'acornsBought') {
      toast(e.ok ? HOLLOW_TEXT.acornsBought(g.world.hollow.acorns) : HOLLOW_TEXT.acornsShort);
      if (e.ok) playSound('buy');
    } else if (e.kind === 'acornFound') {
      toast(HOLLOW_TEXT.acornFound);
    } else if (e.kind === 'acornPortal') {
      toast(e.camp ? HOLLOW_ZONE_TEXT.acornCamp : HOLLOW_TEXT.acornPortal(e.free));
      playSound('pickup');
    } else if (e.kind === 'portalReturned') {
      toast(HOLLOW_TEXT.portalReturned);
    } else if (e.kind === 'wildScanned') {
      toast(DUNGEON_TEXT.wildScanned(keyLabel(e.species)));
    } else if (e.kind === 'located') {
      toast(locationLabel(e.location));
    } else if (e.kind === 'karate') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      if (e.won) toast(`${n?.name ?? NAMES.creature}: ${UI_TEXT.belt(e.belt)}`);
    } else if (e.kind === 'planted') {
      toast(UI_TEXT.planted);
      playSound('pickup');
    } else if (e.kind === 'watered') {
      toast(UI_TEXT.watered);
    } else if (e.kind === 'harvested') {
      toast(UI_TEXT.harvested(e.count, UI_TEXT.flavorNames[e.flavor]));
      playSound('buy');
    } else if (e.kind === 'plantGrew') {
      if (e.stage === 3) toast(UI_TEXT.plantGrew);
    } else if (e.kind === 'questClaimed') {
      toast(UI_TEXT.questClaimed(e.shells, e.egg));
      playSound('buy');
      // R0327 (FUN-38): the asker says thank you in their own voice.
      const q = g.world.quests.find((x) => x.id === e.id);
      const thanks = q ? requestLine(q.template, q.from, !TRAINER_LABELS[q.from], 'thanks') : null;
      if (thanks) toast(thanks);
    } else if (e.kind === 'wildArrived') {
      toast(UI_TEXT.wildArrived(SPECIES_LABELS[e.species] ?? e.species));
      playChirp(speciesOf(e.species).family);
    } else if (e.kind === 'eduResult') {
      // R0686: the results card shows the Shells and the sticker; no toast over a round.
      if (!edu.isOpen()) toast(e.sticker ? EDU_TEXT.sticker : EDU_TEXT.eduResultToast(e.stars));
    } else if (e.kind === 'slip') {
      // R0307: say what helps; the "(A slip.)" tag is on the stats sheet only.
      toast(slipNudge(g.world, e.nubbinId, e.slip));
    } else if (e.kind === 'slipSoon') {
      toast(slipNudge(g.world, e.nubbinId, e.slip));
    } else if (e.kind === 'restSoon' || e.kind === 'graceStarted' || e.kind === 'graceKept') {
      const name = g.world.nubbins.find((x) => x.id === e.nubbinId)?.name ?? NAMES.creature;
      toast(TEN_TEXT[e.kind](name));
    } else if (e.kind === 'npcBark') {
      const npc = g.world.npcs.find((x) => x.id === e.npcId);
      const name = npc ? (TRAINER_LABELS[npc.trainer]?.name ?? npc.trainer) : '';
      ambientBubbles.show(e.npcId, name, e.text, performance.now());
    } else if (e.kind === 'fernStone') {
      toast(fernStoneLine(g.world, e.line, e.stones));
      playSound('pop');
    } else if (e.kind === 'trained') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      toast(TEN_TEXT.trained(n?.name ?? NAMES.creature, STAT_LABELS[e.stat], e.points, e.rested));
      playSound('cheer');
    } else if (e.kind === 'merged') {
      const a = g.world.nubbins.find((x) => x.id === e.a);
      const b = g.world.nubbins.find((x) => x.id === e.b);
      toast(TEN_TEXT.merged(a?.name ?? NAMES.creature, b?.name ?? NAMES.creature));
      playSound('evolve');
    } else if (e.kind === 'unmerged') {
      toast(TEN_TEXT.unmerged);
    } else if (e.kind === 'curfew') {
      toast(e.night ? TEN_TEXT.curfewOn : TEN_TEXT.curfewOff);
    } else if (e.kind === 'skillBought') {
      toast(TEN_TEXT.skillBought(SKILL_LIST.find((s) => s.id === e.id)?.name ?? e.id));
      playSound('buy');
    } else if (e.kind === 'scanFull') {
      toast(TEN_TEXT.scanFull(SPECIES_LABELS[e.species] ?? e.species));
      playSound('pickup');
    } else if (e.kind === 'converted') {
      toast(TEN_TEXT.converted(SPECIES_LABELS[e.species] ?? e.species));
      playSound('hatch');
    } else if (e.kind === 'teamJoined') {
      toast(TEN_TEXT.teamJoined(TEN_TEXT.teamNames[e.team] ?? e.team));
    } else if (e.kind === 'missionDone') {
      toast(TEN_TEXT.missionDone);
      playSound('win');
    } else if (e.kind === 'tankDone') {
      toast(e.won ? TEN_TEXT.tankWon(e.shells, e.wood, e.stone) : TEN_TEXT.tankLost(e.shells));
      playSound(e.won ? 'win' : 'sad');
    } else if (e.kind === 'wildFed') {
      toast(UI_TEXT.wildFed);
      playSound('pet');
    } else if (e.kind === 'visiting') {
      if (e.trainer) toast(UI_TEXT.visitingNow(TL[e.trainer]?.name ?? e.trainer));
    } else if (e.kind === 'neighbourGift') {
      if (e.ok) {
        toast(UI_TEXT.neighbourGiftGot(TL[e.trainer]?.name ?? e.trainer, e.shells));
        playSound('buy');
      } else toast(UI_TEXT.giftTaken);
    } else if (e.kind === 'keepsakeFound' || e.kind === 'collectionSetDone') {
      // R0091: one-time collectibles and their sets.
      toast(keepsakeToast(e, game()?.world));
      playSound('pickup');
    } else if (e.kind === 'regionCritter') {
      // R0120: a region's critter, taken by walking up to it.
      toast(REGION_LIFE_TEXT.critter(e.species));
      playSound('pickup');
    } else if (e.kind === 'regionGag') {
      // R0137: a weather gag, shown only in the weather that opens it.
      toast(
        SEASON_KEEPSAKE_TEXT[e.id] ??
          (e.first ? (REGION_GAG_TEXT[e.id]?.first ?? '') : (REGION_GAG_TEXT[e.id]?.again ?? '')),
      );
    } else if (e.kind === 'wildNubbin') {
      // R0120: a region's shy wild Nubbin, noticed or befriended.
      toast(e.state === 'met' ? WILD_NUBBIN_TEXT.met(e.name) : WILD_NUBBIN_TEXT.friend(e.name));
      playSound(e.state === 'met' ? 'tickOpen' : 'win');
    } else if (e.kind === 'gateOpened') {
      // R0110: a stat gate gave way to the right partner.
      toast(REGION_LIFE_TEXT.gate);
      playSound('pickup');
    } else if (e.kind === 'castleDown') {
      // R0097: a Power partner flattened a sandcastle.
      toast(SHORE_PLAY_TEXT.castleDown(e.shells));
      playSound('pickup');
    } else if (e.kind === 'castleRebuilt') {
      toast(SHORE_PLAY_TEXT.rebuilt);
    } else if (e.kind === 'folkGreet') {
      // R0097: a Kettleby local has a word.
      const f = SHORE_FOLK_TEXT[e.id as keyof typeof SHORE_FOLK_TEXT];
      if (f) toast(`${f.name}: ${f.line}`);
    } else if (e.kind === 'companionReacts') {
      // R0121: a partner's reaction to a new place (the picture is the sprite).
      const n = game()?.world.nubbins.find((x) => x.id === e.id);
      if (n && e.first)
        toast(
          REGION_LIFE_TEXT.companion(n.name, 'is taking it all in.') + REGION_LIFE_TEXT.firstVisit,
        );
    } else if (e.kind === 'photoSpot') {
      // R0138: a framed vista; the camera is the Photo button.
      toast(e.first ? PHOTO_FRAME_TEXT.first(e.region) : PHOTO_FRAME_TEXT.again);
    } else if (e.kind === 'traceFound') {
      // R0090: a small remembered thing in the world.
      for (const line of traceToasts(e.id, game()?.world)) toast(line);
      playSound('tickOpen');
    } else if (e.kind === 'worldHint') {
      // R0127 (lane D r9): a mechanic taught once, in the world.
      const t = hintToast(e.id, game()?.world);
      if (t) toast(t);
    } else if (e.kind === 'secretFound') {
      // R0111 (lane D r9): the region's secret, found with its Old Key.
      for (const line of secretToasts(e.region)) toast(line);
      playSound('win');
    } else if (e.kind === 'landmarkFound') {
      landmarkCard(e.id, events);
      playSound('pickup');
    } else if (e.kind === 'festival') {
      // The calendar's festival waits for any story scene to finish, so "Autumn harvest"
      // never sits on top of a scene that says it is late spring (review C, item 16).
      hs.heldFestival = UI_TEXT.festival[e.season];
    } else if (e.kind === 'coop') {
      toast(e.active ? UI_TEXT.coopOn : UI_TEXT.coopOff);
    } else if (e.kind === 'coopGag') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      toast(
        e.gag === 'spin'
          ? UI_TEXT.coopSpin(n?.name ?? NAMES.creature)
          : e.gag === 'avalanche'
            ? UI_TEXT.coopAvalanche
            : UI_TEXT.coopBow,
      );
    } else if (e.kind === 'dyed') {
      const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
      toast(UI_TEXT.dyed(n?.name ?? NAMES.creature, e.slot));
    }
  }
}
