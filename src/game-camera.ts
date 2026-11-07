/** Game camera helpers (TECH-37): the pixel story camera, the Keeper follow and the per-frame aim, split out of game.ts. */
import { easeShift, NO_SHIFT } from './render/view-shift';
import { VIEW_SHIFT } from './config/tuning';
import { regionOf } from './sim/regions';
import { regionCameraFor } from './config/region-camera';
import { CAMERA, KEEPER, PIXEL_STAGE, STAGE2, STAGE4 } from './config/tuning';
import { walkLead, yawIndexToRadians, zoomPixelsPerUnit } from './render/camera';
import { clearYaw, fitPixel, speaksAsKeeper, stageObstacles } from './render/scene-stage';
import { PIXEL_BUILDINGS, safeRect, viewRect } from './render/stage-api';
import { stageHides } from './config/stage-sets';
import { applyTextScale } from './ui/text-scale';
import { applyAccess } from './ui/access-r10';
import { phoneDefault } from './ui/world-settings';
import { CAMERA_FOLLOW } from './config/tuning-sim';
import { PERCH } from './config/tuning-move';
import { DEBUG_OVERLAY, DebugOverlay } from './render/debug-colliders';
import { standTopAt } from './sim/obstacles';
import { deckY, groveHeight, hillHeight } from './sim/terrain';
import { runFloor } from './sim/dungeon';
import { terraceY } from './render/scene-stage';
import { cameraSubject, sheetShift } from './render/camera-subject';
import { coopAim } from './game-coop-camera';
import type { Game } from './game';

/** The share of the way an eased value moves this frame at `rate`/s (all of it under reduced motion). */
function reduce0(reduce: boolean, dtMs: number, rate: number): number {
  return reduce ? 1 : 1 - Math.exp((-rate * dtMs) / 1000);
}

/**
 * Follow the story queue for the pixel view and return the point to aim at while a scene
 * waits (the centroid of who is framed), or null to follow the Keeper. Holds the near zoom
 * for `two` and `close` shots, and for an unstaged scene whose cast stands close.
 */
export function stagePixelCamera(
  g: Game,
  nowMs: number,
  focused: boolean,
): { x: number; z: number; fitted: boolean } | null {
  const st = g.stager;
  g.stageFitKept = [];
  st.speaker = g.storySpeaker;
  if (st.update(g.world, nowMs)) {
    g.lastDaylightMs = -Infinity;
    // Campaign graphics 2: a set hides the Grove-only buildings, an exclusive stage all.
    // R0605 (lane C r10 agent A): a questline region's set hides them while the Keeper is in it.
    PIXEL_BUILDINGS.stageHidden = new Set([...stageHides(st.stage), ...st.regionHides()]);
    PIXEL_BUILDINGS.stageHidesAll = st.exclusive;
  }
  st.noteLine(g.storyLine, nowMs, g.storySpeaker);
  g.grove?.setBare(st.exclusive);
  if (g.scene3d) return null;
  // A shot that names its own focus (the green, a house, Moss) centres on that, not the Keeper.
  let points = st.active && !focused ? st.subjects(g.world) : [];
  // H5: after the first line, or on the first spoken one, a wide or establishing shot
  // pushes in (to `two` unless it says).
  const kind = st.shotKind();
  if (points.length < 2 && !kind) {
    g.camera.holdZoom(null, nowMs);
    g.camera.holdYaw(null, nowMs);
    return null;
  }
  // Review fix 2: of the 45° steps from the player's, the nearest that sees the cast and
  // whoever speaks past the houses.
  const who = st.speaker;
  const speaker =
    who && who !== 'narrator' && !speaksAsKeeper(g.world, who, st.stage)
      ? st.spotOf(g.world, who)
      : null;
  // K3: whoever speaks is never dropped from a fit.
  const seen = speaker ? [...points, { ...speaker, speaker: true }] : points;
  const base = g.camera.playerYawIndex;
  const order = [0, 1, -1, 2, -2, 3, -3, 4].map((k) => base + k);
  const yaws = order.map((i) => yawIndexToRadians(i));
  const mid = {
    x: seen.reduce((a, p) => a + p.x, 0) / Math.max(1, seen.length),
    z: seen.reduce((a, p) => a + p.z, 0) / Math.max(1, seen.length),
  };
  const obstacles = stageObstacles(g.world, (id) => PIXEL_BUILDINGS.isHidden(id));
  const best = clearYaw(yaws, seen, mid, g.camera.pitch, 60, obstacles);
  const turn = order[Math.max(0, yaws.indexOf(best))]!;
  g.camera.holdYaw(turn === base ? null : turn, nowMs);
  const yaw = yawIndexToRadians(turn);
  const ppu = CAMERA.pixelsPerUnit;
  const last = ppu.length - 1;
  // The story-only step past the player's nearest (campaign graphics 3).
  const story = ppu.length;
  const cur = g.camera.pixelsPerUnit;
  /** The view's width (world units) at zoom step `i`. */
  const widthAt = (i: number) => (g.camera.visibleWidth * cur) / zoomPixelsPerUnit(i);
  const first = st.stage.shot?.kind;
  // K9: in two speakers' exchange the view leans toward whoever speaks (the follow eases
  // it, a cut under reduced motion).
  const rev = st.reverse(g.world, g.camera.currentYaw, STAGE4.reverse.sideRad);
  const lean = (x: number, z: number): { x: number; z: number; fitted: false } => {
    const k = rev ? STAGE4.reverse.panToward : 0;
    return {
      x: x + ((rev?.at.x ?? x) - x) * k,
      z: z + ((rev?.at.z ?? z) - z) * k,
      fitted: false,
    };
  };
  if (st.pushedMs !== null && kind !== first && kind !== 'wide') {
    // H5 in pixel: the push-in, on the Keeper and whoever speaks: the story step when the
    // pair fit across it (a desktop is already on the near step, so the push showed
    // nothing), else the near step; on the speaker alone when the pair fit neither.
    if (speaker && !points.some((p) => p.x === speaker.x && p.z === speaker.z))
      points = [...points, speaker];
    const cx = points.reduce((a, p) => a + p.x, 0) / Math.max(1, points.length);
    const cz = points.reduce((a, p) => a + p.z, 0) / Math.max(1, points.length);
    const spread = Math.max(0, ...points.map((p) => Math.hypot(p.x - cx, p.z - cz)));
    const close = spread * 2.4 < widthAt(story);
    g.camera.holdZoom(close ? story : last, nowMs);
    if (!close && spread * 2.4 >= widthAt(last) && speaker)
      return { x: speaker.x, z: speaker.z, fitted: false };
    return lean(cx, cz);
  }
  if (points.length > 0 && st.fits()) {
    // H4: the nearest zoom step that fits every focus point inside the HUD-safe area.
    const views = ppu.map((p) => ({
      w: (g.camera.visibleWidth * cur) / p,
      h: (g.camera.visibleHeight * cur) / p,
    }));
    const v = viewRect();
    const s = safeRect();
    const fit = fitPixel(
      seen,
      yaw,
      g.camera.pitch,
      views,
      {
        x0: (s.x - v.x) / v.w,
        y0: (s.y - v.y) / v.h,
        x1: (s.x + s.w - v.x) / v.w,
        y1: (s.y + s.h - v.y) / v.h,
      },
      STAGE2.figureH,
      STAGE2.fitRadius,
    );
    g.camera.holdZoom(fit.zoom, nowMs);
    g.stageFitKept = fit.kept;
    return { x: fit.x, z: fit.z, fitted: true };
  }
  const cx = points.reduce((a, p) => a + p.x, 0) / points.length;
  const cz = points.reduce((a, p) => a + p.z, 0) / points.length;
  const spread = Math.max(...points.map((p) => Math.hypot(p.x - cx, p.z - cz)));
  // The near zoom only when the cast fits across it (a phone held upright is narrow).
  const fits = spread * 2.4 < widthAt(last);
  const near = kind === 'close' || ((kind === 'two' || !kind) && fits);
  // A close shot goes to the story step when its people fit across it.
  const closer = kind === 'close' && spread * 2.4 < widthAt(story);
  g.camera.holdZoom(closer ? story : near ? last : null, nowMs);
  return lean(cx, cz);
}

/**
 * Track the Keeper's ground height and look-ahead for the camera (MOVE-23). On the ground
 * the camera follows the floor the Keeper is drawn on (a terrace, a bench, the bridge);
 * through a jump it holds, unless the Keeper climbs well past where it took off.
 */
export function followKeeper(
  g: Game,
  kp: { x: number; z: number },
  dt: number,
  staged: boolean,
): void {
  const w = g.world;
  const k = w.keeper;
  const F = CAMERA_FOLLOW;
  // R11 d7: a drawn region's terraces carry the Keeper (its y is the ground there).
  if (w.location.startsWith('region:') && !runFloor(w)) g.groundY = k.y;
  else if (w.location !== 'grove' || runFloor(w)) g.groundY = 0;
  else {
    // The height Pixel draws the feet at; 3D keeps its own ground under the orbit target.
    const feet =
      deckY(kp.x, kp.z) !== null
        ? 0
        : Math.max(0, k.y - groveHeight(kp.x, kp.z) + hillHeight(kp.x, kp.z));
    if (k.grounded) g.groundY = feet;
    else if (feet > g.groundY + F.airSlack) g.groundY = feet - F.airSlack;
    else if (feet < g.groundY - F.airSlack) g.groundY = feet;
  }
  // MOVE-26: up on a rock (a standable top half a unit or more up), the look rises to open
  // the view; it settles back once the Keeper steps down.
  const top = w.location === 'grove' ? standTopAt(w, kp.x, kp.z) : -Infinity;
  const perched =
    k.grounded &&
    Math.abs(k.y - top) < 0.05 &&
    top - groveHeight(kp.x, kp.z) >= PERCH.minTop - 0.02;
  const pr = reduce0(g.reduceMotion, dt, PERCH.rate);
  g.perchLift += ((perched ? PERCH.lift : 0) - g.perchLift) * pr;
  if (g.scene3d) g.scene3d.perchLift = g.perchLift;
  const s = dt / 1000;
  let vx = 0;
  let vz = 0;
  if (g.lastKp && s > 0) {
    vx = (kp.x - g.lastKp.x) / s;
    vz = (kp.z - g.lastKp.z) / s;
  }
  g.lastKp = { x: kp.x, z: kp.z };
  const speed = Math.hypot(vx, vz);
  // A teleport is not a walk; nor is anything during a scene.
  const pace = staged || speed > KEEPER.speed * 4 ? 0 : speed / KEEPER.speed;
  // HOT-3b: the lead grows with the pace, so the Keeper stays centred at any speed.
  const lead = walkLead(F.lookAhead, pace, k.carrying !== null);
  const want = speed > 1e-6 ? lead / speed : 0;
  const e = reduce0(g.reduceMotion, dt, F.lookAheadRate);
  g.ahead.x += (vx * want - g.ahead.x) * e;
  g.ahead.z += (vz * want - g.ahead.z) * e;
}

/** The camera half of a frame: restage, follow the Keeper or the scene, ease the view. Returns the Keeper's drawn spot. */
export function driveCamera(g: Game, nowMs: number, dt: number): { x: number; z: number } {
  // A new place or a new scene at the head of the story queue (a debug chapter jump among
  // them) restages this frame: daylight, the story sets and the place's scenery.
  const headNow = `${g.world.location}|${g.world.campaign?.queue[0] ?? ''}`;
  if (headNow !== g.stageKey) {
    g.stageKey = headNow;
    g.lastDaylightMs = -Infinity;
  }

  // Camera follows the Keeper as drawn (interpolated between sim steps), so the
  // Keeper and the camera move together and nothing judders at the step rate.
  const kp = (g.scene3d ?? g.view).keeperDrawPos(g.world, g.clock.alpha);
  // While a held end-of-life check plays, look at that Nubbin, not the Keeper (review D, 1).
  const focused =
    g.focus && nowMs < g.focus.untilMs
      ? g.world.nubbins.find((n) => n.id === g.focus?.id)
      : undefined;
  if (!focused) g.focus = null;
  // A story scene in the pixel view: frame its cast, lifted clear of the dialogue box,
  // on the near zoom for two-shots and close shots (campaign graphics C2, H14).
  const staged = stagePixelCamera(g, nowMs, !!focused);
  // HOT-3: otherwise the Keeper, or the speaker while a dialogue line is up. Selecting a
  // Nubbin (its stats sheet) no longer moves the camera (it superseded HOT-1's aim).
  const st = g.stager;
  const talk =
    staged || focused
      ? null
      : cameraSubject(kp, g.storySpeaker, (who) =>
          speaksAsKeeper(g.world, who, st.stage) ? null : st.spotOf(g.world, who),
        );
  const talker = talk?.talker ? talk.at : null;
  // R18 d2 (R0140): two Keepers on one device: frame both, or follow the one moved last. A
  // scene, a focus or a speaker still wins (dialogue is the speaker, as before).
  const co = coopAim(g, nowMs, !!staged || !!focused || !!talker);
  const coAt = co?.at ?? null;
  const subject = focused ? focused.pos : (staged ?? talker ?? coAt ?? kp);
  // With a bottom sheet open on a phone, aim past the Keeper toward the camera, so the
  // Keeper and the Nubbin beside them sit in the clear top part (review C, item 22).
  // A fitted shot (H4) already sits inside the HUD-safe area.
  const liftK =
    staged && !staged.fitted ? Math.max(g.cameraLift, PIXEL_STAGE.boxLift) : g.cameraLift;
  const lift = (liftK * g.camera.visibleHeight) / Math.sin(CAMERA.pitchRad);
  const yaw = g.camera.currentYaw;
  // Aim right of the subject (along the camera's right vector) so a docked desktop sheet
  // on the right third leaves it in sight.
  const side = g.cameraSide * g.camera.visibleWidth;
  followKeeper(g, kp, dt, !!staged || !!focused || !!talker || !!coAt);
  const aimX =
    subject.x +
    Math.sin(yaw) * lift +
    Math.cos(yaw) * side +
    (staged || focused || talker || coAt ? 0 : g.ahead.x);
  const aimZ =
    subject.z +
    Math.cos(yaw) * lift -
    Math.sin(yaw) * side +
    (staged || focused || talker || coAt ? 0 : g.ahead.z);
  const rate = staged ? PIXEL_STAGE.followRate : (co?.rate ?? CAMERA.followRate);
  const held = !staged && !focused && !talker && nowMs < g.landmarkHoldUntil;
  // Reduced motion cuts to a scene or a new speaker instead of gliding there.
  const talkerKey = talker ? g.storySpeaker : null;
  const cutToTalker = !!talker && talkerKey !== g.talkerKey;
  g.talkerKey = talkerKey;
  const t = held
    ? 0
    : (staged || cutToTalker || co?.cut) && g.reduceMotion
      ? 1
      : 1 - Math.exp((-rate * dt) / 1000);
  // HOT-1/HOT-3: with the stats sheet open the Keeper (still the subject) sits in the part
  // of the screen the sheet leaves clear; a stalled frame cannot turn the glide into a jump.
  const shiftGoal =
    g.sheetFocus && !staged && !focused
      ? sheetShift(g.sheetFocus.shift, VIEW_SHIFT.clearMargin)
      : NO_SHIFT;
  const shiftT = g.reduceMotion
    ? 1
    : 1 - Math.exp((-rate * Math.min(dt, VIEW_SHIFT.maxEaseDtMs)) / 1000);
  g.viewShift = easeShift(g.viewShift, shiftGoal, shiftT);
  g.camera.viewShift = g.viewShift;
  if (g.scene3d) g.scene3d.viewShift = g.viewShift;
  g.camera.target.x += (aimX - g.camera.target.x) * t;
  g.camera.target.z += (aimZ - g.camera.target.z) * t;
  // Up and down with the ground under the Keeper, or the mark a scene frames (MOVE-23).
  const aimY =
    staged || focused || talker || coAt
      ? g.world.location === 'grove'
        ? terraceY(subject.x, subject.z)
        : coAt && g.world.location.startsWith('region:')
          ? g.world.keeper.y
          : 0
      : g.groundY + g.perchLift;
  const ty = reduce0(g.reduceMotion, dt, CAMERA_FOLLOW.groundRate);
  g.camera.target.y += (aimY - g.camera.target.y) * ty;
  // The Settings choice reaches both cameras and the Grove's idle motion at once.
  const reduce = g.reduceMotion;
  g.camera.reduceMotion = reduce;
  g.markReduceMotion();
  applyTextScale(g.world);
  // Lane E r10 (R0709, R0710): readable font, high contrast and Simple touch.
  applyAccess(g.world);
  if (g.scene3d) g.scene3d.reduceMotion = reduce;
  // R0073: "Zoom out when running" pulls the view out to the survey step on a long run.
  {
    const k = g.world.keeper;
    const moving = k.moveTarget !== null || k.input.x !== 0 || k.input.z !== 0;
    const on = phoneDefault(g.world.settings.surveyWhenRunning);
    g.camera.runTick(on && g.world.location === 'grove' && k.running && moving, nowMs);
  }
  // R0125: the region's Pixel zoom steps (Full 3D reads its pitch and distance itself).
  g.camera.setRegionZooms(regionCameraFor(regionOf(g.world.location)).zooms ?? null, nowMs);
  g.camera.update(nowMs);
  // MOVE-38: the collider, nav and ground-y overlays, only once a debug toggle was on.
  if (DEBUG_OVERLAY.colliders || DEBUG_OVERLAY.nav || DEBUG_OVERLAY.groundY || g.debugOverlay) {
    const scene = g.scene3d?.scene ?? g.grove?.scene;
    if (scene) {
      g.debugOverlay ??= new DebugOverlay(scene);
      g.debugOverlay.update(g.world, groveHeight);
    }
  }
  return kp;
}
