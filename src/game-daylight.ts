/** Game daylight helpers (TECH-37): which hour the view is lit at and the sky it gets, split out of game.ts. */
import { Vector3 } from 'three';
import { REGIONS, regionHour } from './config/regions';
import { regionLook } from './render/region-look';
import { regionSky } from './sim/region-weather-live';
import { regionOf } from './sim/regions';
import { PIXEL_STAGE } from './config/tuning';
import { daylightAt, localHour } from './render/daylight';
import { litLanterns } from './sim/campaign';
import { resolveStage } from './render/scene-stage';
import type { Game } from './game';

/** R0094: the pale mist a fog spell greys the pixel picture toward. */
const FOG_TINT = new Vector3(0.88, 0.92, 0.96);

/**
 * The hour to light the pixel view at: a queued scene's staged hour, else `clock`. A
 * change of more than a quarter hour blends over `PIXEL_STAGE.hourBlendMs`; reduced
 * motion cuts. The clock's own slow drift is followed as it is.
 */
export function stagedHour(g: Game, clock: number, nowMs: number): number {
  const target = g.stager.hourOr(clock);
  if (g.drawnHour === null || g.reduceMotion) {
    g.hourBlend = null;
    g.drawnHour = target;
    return target;
  }
  const goal = g.hourBlend?.to ?? g.drawnHour;
  if (Math.abs(hourDelta(goal, target)) > 0.25)
    g.hourBlend = { from: g.drawnHour, to: target, startMs: nowMs };
  const b = g.hourBlend;
  if (b) {
    const t = Math.min(1, Math.max(0, (nowMs - b.startMs) / PIXEL_STAGE.hourBlendMs));
    g.drawnHour = (b.from + hourDelta(b.from, b.to) * t + 24) % 24;
    if (t >= 1) g.hourBlend = null;
  } else g.drawnHour = target;
  return g.drawnHour;
}

export function updateDaylight(g: Game, nowMs: number): void {
  // The sky changes slowly: re-evaluate every few seconds, or every frame of a blend.
  // A staged weather replaces the live one in the drawn scene (the package-f overlay draws
  // it), so a scene change refreshes at once.
  const sid = g.world.campaign?.queue[0] ?? null;
  if (sid !== g.weatherSid) {
    g.weatherSid = sid;
    g.lastDaylightMs = -Infinity;
  }
  // R0094/R0118: a drawn region has its own sky and season (sim/region-weather-live.ts).
  const sky = regionSky(g.world, localHour());
  regionLook.season = sky ? sky.season : null;
  regionLook.fog = sky ? sky.fog : 0;
  const wk = resolveStage(g.world)?.stage.weather ? 'clear' : sky ? sky.draw : g.world.weather.kind;
  const wInt = sky ? sky.intensity : g.world.weather.intensity;
  const blending = g.hourBlend !== null;
  const clock =
    g.hourOverride ?? regionHour(REGIONS[regionOf(g.world.location)].clock, localHour());
  const hour = g.scene3d ? clock : stagedHour(g, clock, nowMs);
  if (!blending && !g.hourBlend && nowMs - g.lastDaylightMs < 3000) return;
  g.lastDaylightMs = nowMs;
  const d = daylightAt(hour);
  const s = g.world.settings;
  const reduce = g.reduceMotion;
  if (g.scene3d) {
    g.scene3d.setLit(litLanterns(g.world));
    g.view.lanterns = () => g.scene3d!.lanternStates();
    g.scene3d.regionSky.fog = regionLook.fog;
    g.scene3d.regionSky.intensity = wInt;
    g.scene3d.setDaylight(clock, d, g.world.location, wk, s.particles);
    return;
  }
  if (!g.grove || !g.lowRes) return;
  g.grove.setLit(litLanterns(g.world));
  const grove = g.grove;
  g.view.lanterns = () => grove.lanternStates();
  const place = g.world.location.startsWith('visit:') ? 'grove' : g.world.location;
  g.grove.setLocation(place);
  g.grove.setDaylight(d, place, wk);
  g.view.location = g.world.location;
  g.view.setDaylight(d, reduce);
  g.view.lights = g.grove.lampsOn ? g.grove.lampSpots : [];
  g.view.setWeather(
    place === 'dungeon' || g.pixelGov?.sheds('weather') ? 'clear' : wk,
    wInt,
    g.pixelGov ? g.pixelGov.particles(s.particles) : s.particles,
    reduce,
  );
  // Rain greys the grade a little; snow brightens and cools it.
  const w = wk;
  let tint = w === 'rain' ? d.tint.clone().multiply(new Vector3(0.85, 0.9, 1.0)) : d.tint;
  let tintAmount = w === 'rain' ? Math.max(d.tintAmount, 0.35) : d.tintAmount;
  if (regionLook.fog > 0) {
    // A fog spell: the picture greys toward a pale mist.
    tint = tint.clone().lerp(FOG_TINT, regionLook.fog);
    tintAmount = Math.max(tintAmount, regionLook.fog * 0.6);
  }
  g.lowRes.postPass?.apply({
    tint,
    tintAmount,
    bloom: w === 'snow' ? d.bloom + 0.15 : d.bloom,
  });
}

/** Signed shortest way round the 24-hour clock from `a` to `b`, in hours. */
function hourDelta(a: number, b: number): number {
  return ((((b - a) % 24) + 36) % 24) - 12;
}
