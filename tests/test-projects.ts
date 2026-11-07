import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Which test files run without the story scripts. `tests/setup-side-stories.ts` loads the
 * whole campaign and every side story (about 22 MB of script data) into each test worker.
 * With a fresh module cache per file (CI, `ISOLATE=1`) that is paid once per file, and was the
 * bulk of `npm test`. A file runs in the lean `unit` project, with no story registered,
 * unless it needs the scripts:
 *
 *  - it is listed in STORY_FILES (known to fail or to read the registry through other code), or
 *  - one of its relative imports or mocks names a story module (STORY_IMPORT).
 *
 * A new file is therefore lean by default. If it needs a story and fails with a missing
 * scene or quest, add it to STORY_FILES. VERIFIED_UNIT_FILES are lean whatever they import
 * (they passed with no story registered and never mentioned stories, TECH-42).
 *
 * Check a file with `npx vitest run --project unit <file>` or `--project stories <file>`.
 */
const VERIFIED_UNIT_FILES: readonly string[] = [
  'tests/platform/audio-unlock.test.ts',
  'tests/platform/game-input.test.ts',
  'tests/render/actors-motion.test.ts',
  'tests/render/art-colour.test.ts',
  'tests/render/camera.test.ts',
  'tests/render/cave-shed.test.ts',
  'tests/render/chunks.test.ts',
  'tests/render/clip-for.test.ts',
  'tests/render/cocoon.test.ts',
  'tests/render/compass.test.ts',
  'tests/render/critter-parts.test.ts',
  'tests/render/cry.test.ts',
  'tests/render/decor-turn.test.ts',
  'tests/render/dungeon-fog.test.ts',
  'tests/render/emote-spring.test.ts',
  'tests/render/footfall.test.ts',
  'tests/render/garden-kit.test.ts',
  'tests/render/gem-finish.test.ts',
  'tests/render/governor-geo.test.ts',
  'tests/render/governor.test.ts',
  'tests/render/grass-place.test.ts',
  'tests/render/grove-shed.test.ts',
  'tests/render/grown-up-gate.test.ts',
  'tests/render/hollow-dress.test.ts',
  'tests/render/hollow-light.test.ts',
  'tests/render/jump-button.test.ts',
  'tests/render/keeper-lean.test.ts',
  'tests/render/multi-heads.test.ts',
  'tests/render/near-pushers.test.ts',
  'tests/render/nubbin-gags.test.ts',
  'tests/render/nubbin-variants.test.ts',
  'tests/render/pixel-poses.test.ts',
  'tests/render/pmrem-ggx.test.ts',
  'tests/render/pool-evict.test.ts',
  'tests/render/governor-pin.test.ts',
  'tests/render/quad.test.ts',
  'tests/render/race-tags.test.ts',
  'tests/render/second-evolution-pixel.test.ts',
  'tests/render/serpent.test.ts',
  'tests/render/shiny-glint.test.ts',
  'tests/render/soul-r9.test.ts',
  'tests/render/species-cross.test.ts',
  'tests/render/species-gen1b-art.test.ts',
  'tests/render/static-freeze.test.ts',
  'tests/render/swim-style.test.ts',
  'tests/render/view-shift.test.ts',
  'tests/sim/alignment-boundary.test.ts',
  'tests/sim/battle-arena.test.ts',
  'tests/sim/battle-hollow-mods.test.ts',
  'tests/sim/battle-party.test.ts',
  'tests/sim/battle-progress.test.ts',
  'tests/sim/battle-rewards.test.ts',
  'tests/sim/battle-round3.test.ts',
  'tests/sim/battle-timing.test.ts',
  'tests/sim/battle-trials.test.ts',
  'tests/sim/border.test.ts',
  'tests/sim/bushes.test.ts',
  'tests/sim/care-reach.test.ts',
  'tests/sim/clock.test.ts',
  'tests/sim/collectibles.test.ts',
  'tests/sim/collection-book.test.ts',
  'tests/sim/collision-sweep.test.ts',
  'tests/sim/coop-motion.test.ts',
  'tests/sim/debug-commands.test.ts',
  'tests/sim/decorate-place.test.ts',
  'tests/sim/dungeon-acts.test.ts',
  'tests/sim/dungeon-arrival.test.ts',
  'tests/sim/dungeon-density.test.ts',
  'tests/sim/dungeon-foes.test.ts',
  'tests/sim/dungeon-gaps.test.ts',
  'tests/sim/dungeon-packs.test.ts',
  'tests/sim/dungeon-r8-deep-perf.test.ts',
  'tests/sim/dungeon-r8-seal-display.test.ts',
  'tests/sim/dungeon-shrines.test.ts',
  'tests/sim/dungeon-sight.test.ts',
  'tests/sim/dungeon-v2-snapshot.test.ts',
  'tests/sim/dungeon-v3.test.ts',
  'tests/sim/error-watch.test.ts',
  'tests/sim/expedition-fun.test.ts',
  'tests/sim/falls-shelf.test.ts',
  'tests/sim/field.test.ts',
  'tests/sim/flight.test.ts',
  'tests/sim/friends-away.test.ts',
  'tests/sim/fruit-bonk.test.ts',
  'tests/sim/fusion.test.ts',
  'tests/sim/gear.test.ts',
  'tests/sim/glide.test.ts',
  'tests/sim/graphics-pref.test.ts',
  'tests/sim/growth.test.ts',
  'tests/sim/hollow-roll.test.ts',
  'tests/sim/hollow-sounds.test.ts',
  'tests/sim/hop-course.test.ts',
  'tests/sim/hop-lesson.test.ts',
  'tests/sim/jump-fx.test.ts',
  'tests/sim/jump-play.test.ts',
  'tests/sim/jump-toys.test.ts',
  'tests/sim/keeper-accel.test.ts',
  'tests/sim/keeper-idle.test.ts',
  'tests/sim/layout-lint.test.ts',
  'tests/sim/local-time.test.ts',
  'tests/sim/lookout.test.ts',
  'tests/sim/mantle.test.ts',
  'tests/sim/minigame-slips.test.ts',
  'tests/sim/npc-yield.test.ts',
  'tests/sim/nubbin-hop.test.ts',
  'tests/sim/nubbin-steer.test.ts',
  'tests/sim/pair-play.test.ts',
  'tests/sim/personality-distinct.test.ts',
  'tests/sim/personality-lean.test.ts',
  'tests/sim/pond-dip.test.ts',
  'tests/sim/race-gags.test.ts',
  'tests/sim/region-clock.test.ts',
  'tests/sim/region-weather.test.ts',
  'tests/sim/region-wood.test.ts',
  'tests/sim/regions-jump.test.ts',
  'tests/sim/regions-parity.test.ts',
  'tests/sim/regions.test.ts',
  'tests/sim/remembrance.test.ts',
  'tests/sim/rng.test.ts',
  'tests/sim/roll.test.ts',
  'tests/sim/run-mode.test.ts',
  'tests/sim/run-now.test.ts',
  'tests/sim/save-mirror.test.ts',
  'tests/sim/save-size.test.ts',
  'tests/sim/separation.test.ts',
  'tests/sim/share-code.test.ts',
  'tests/sim/silly-names.test.ts',
  'tests/sim/slapstick.test.ts',
  'tests/sim/slot-trash.test.ts',
  'tests/sim/soul-bonds.test.ts',
  'tests/sim/soul-calling.test.ts',
  'tests/sim/soul-carry.test.ts',
  'tests/sim/soul-flavour.test.ts',
  'tests/sim/soul-jealousy.test.ts',
  'tests/sim/soul-memory.test.ts',
  'tests/sim/soul-snatch.test.ts',
  'tests/sim/soul-tidy.test.ts',
  'tests/sim/splat.test.ts',
  'tests/sim/surface-pace.test.ts',
  'tests/sim/tactics-ai.test.ts',
  'tests/sim/tactics-keeper.test.ts',
  'tests/sim/tactics-slice.test.ts',
  'tests/sim/tap-verdict.test.ts',
  'tests/sim/teams-join.test.ts',
  'tests/sim/tech-r7.test.ts',
  'tests/sim/terrace.test.ts',
  'tests/sim/throw-collide.test.ts',
  'tests/sim/toast-variants.test.ts',
  'tests/sim/travel.test.ts',
  'tests/sim/unreachable.test.ts',
  'tests/sim/village.test.ts',
  'tests/ui/album.test.ts',
  'tests/ui/biome-beds.test.ts',
  'tests/ui/bug-log.test.ts',
  'tests/ui/chirp-voice.test.ts',
  'tests/ui/frame-spikes.test.ts',
  'tests/ui/joystick-math.test.ts',
  'tests/ui/kid-sheet.test.ts',
  'tests/ui/music-levels.test.ts',
  'tests/ui/objective.test.ts',
  'tests/ui/press-kind.test.ts',
  'tests/ui/race-results.test.ts',
  'tests/ui/shake-hint.test.ts',
  'tests/ui/shake-meter.test.ts',
  'tests/ui/shake.test.ts',
  'tests/ui/share.test.ts',
  'tests/ui/sheet-tabs.test.ts',
  'tests/ui/sound-coverage.test.ts',
  'tests/ui/title-gate.test.ts',
];

/**
 * Files that need the story scripts although no import says so (they play the campaign or a
 * side story through the world, read the registry through other code, or check the scripts).
 * Measured in CI on 2026-11-06 by running every file with no story registered: these failed.
 */
export const STORY_FILES: readonly string[] = [
  'tests/render/scene-stage.test.ts',
  'tests/render/stage-foundation.test.ts',
  'tests/render/story-shots.test.ts',
  'tests/sim/access-r10.test.ts',
  'tests/sim/battle-story-replay.test.ts',
  'tests/sim/camp11-ui.test.ts',
  'tests/sim/campaign-micro.test.ts',
  'tests/sim/campaign-v2.test.ts',
  'tests/sim/campaign.test.ts',
  'tests/sim/chapter-home.test.ts',
  'tests/sim/choice-payoffs.test.ts',
  'tests/sim/edu-story.test.ts',
  'tests/sim/expansion-offers-r12.test.ts',
  'tests/sim/fun-pack-rules.test.ts',
  'tests/sim/fun-quests.test.ts',
  'tests/sim/goal-target.test.ts',
  'tests/sim/kid-flow-r12.test.ts',
  'tests/sim/kid-open-r13.test.ts',
  'tests/sim/lang.test.ts',
  'tests/sim/line-swaps.test.ts',
  'tests/sim/offer-approach-r12.test.ts',
  'tests/sim/pace-bot-r12.test.ts',
  'tests/sim/prop-reach.test.ts',
  'tests/sim/quest-lanes-r9.test.ts',
  'tests/sim/quest-offers.test.ts',
  'tests/sim/reachability.test.ts',
  'tests/sim/rest.test.ts',
  'tests/sim/side-ambient.test.ts',
  'tests/sim/side-stories-early.test.ts',
  'tests/sim/side-stories-late.test.ts',
  'tests/sim/side-stories-mid.test.ts',
  'tests/sim/side-story-audience.test.ts',
  'tests/sim/side-story-chunk.test.ts',
  'tests/sim/story-book.test.ts',
  'tests/sim/story-pace-r10.test.ts',
  'tests/sim/story-pacing.test.ts',
  'tests/sim/story-props.test.ts',
  'tests/sim/story-regions.test.ts',
  'tests/sim/story-rewards.test.ts',
  'tests/ui/guide.test.ts',
  'tests/ui/quest-minutes-r12.test.ts',
  'tests/ui/replay-choices-r12.test.ts',
];

/** A relative import, dynamic import or mock whose path names a story module. */
const STORY_IMPORT =
  /['"]\.{1,2}\/[^'"]*(story-scenes|side-stor|storyline|\/campaign|\/content\/|fun-quest|quest-|chapter|barks|audience|expansion|atlas|arcade|neopia|multiverse|goal|objective|story)[^'"]*['"]/i;

function allTestFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name).replace(/\\/g, '/');
    if (e.isDirectory()) out.push(...allTestFiles(p));
    else if (p.endsWith('.test.ts')) out.push(p);
  }
  return out.sort();
}

/** True if this test file needs the story scripts registered (see the header). */
export function needsStories(file: string): boolean {
  if (STORY_FILES.includes(file)) return true;
  if (VERIFIED_UNIT_FILES.includes(file)) return false;
  return STORY_IMPORT.test(readFileSync(file, 'utf8'));
}

/** Generator files that only write samples when asked (PREVIEW_* / MAKE_ICONS); `TOOLS=1` runs them. */
export const TOOL_FILES: readonly string[] = [
  'tests/tools/angles.test.ts',
  'tests/tools/buildings.test.ts',
  'tests/tools/env-combo.test.ts',
  'tests/tools/env-directions.test.ts',
  'tests/tools/env-fractal.test.ts',
  'tests/tools/env-samples.test.ts',
  'tests/tools/make-icons.test.ts',
  'tests/tools/preview.test.ts',
  'tests/tools/scenery.test.ts',
];

/**
 * R0484 (TECH-42, r11-d3): the projects run with `isolate: false` (one module cache per worker,
 * so three.js, the sim and the story scripts load once per worker instead of once per file).
 * These files leave or expect global state (stubbed browser APIs, module-level pools, the
 * goal chip's live state) and keep a fresh module cache each, in the `isolated` project.
 * `ISOLATE=1` runs everything isolated, as before.
 */
export const ISOLATED_FILES: readonly string[] = [
  'tests/platform/storage.test.ts', // the slot index state leaks in from other save tests
  'tests/render/pool-burst.test.ts',
  'tests/render/pool-shed.test.ts',
  'tests/sim/expansions.test.ts',
  'tests/sim/fun-r5.test.ts',
  'tests/sim/read-aloud.test.ts',
];

const ALL_TEST_FILES = allTestFiles('tests');

/** The lean project's files: everything that does not need the story scripts. */
export const UNIT_FILES: readonly string[] = ALL_TEST_FILES.filter(
  (f) => !needsStories(f) && !TOOL_FILES.includes(f) && !ISOLATED_FILES.includes(f),
);
