// Every tunable number lives here. Nothing in this file is player-facing text
// (that is config/strings.ts).

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const RENDER = {
  /** Height of the low-res frame in pixels. Width follows the screen aspect ratio. */
  targetHeight: 540,
  /** The low-res target does the heavy lifting, so device pixel ratio is capped at 1. */
  maxPixelRatio: 1,
} as const;

/**
 * Pixel mode's light rig on top of the daylight table. The post pass now encodes sRGB
 * (review C, item 7); the table was tuned on the old linear output, so day light is lifted
 * until painted ground at noon sits near its painted colours, and night is held back so it
 * still reads as night.
 */
export const PIXEL_LIGHT = {
  dayGain: 1.35,
  nightGain: 0.85,
} as const;

/**
 * The pixel story camera (campaign graphics C2, H14): how a staged hour blends in, and how
 * far the frame lifts its subjects over the dialogue box.
 */
export const PIXEL_STAGE = {
  /** A staged hour blends over this long; reduced motion cuts. */
  hourBlendMs: 1000,
  /** Fraction of the view the subjects are lifted by, clear of the dialogue box. */
  boxLift: 0.11,
  /** How fast the camera eases to the scene's centre (per second, exponential). */
  followRate: 4,
} as const;

export const CAMERA = {
  /** Fixed downward tilt of the orbit camera, in degrees. */
  pitchDeg: 35,
  pitchRad: (35 * Math.PI) / 180,
  /** How long the camera turns to a Nubbin whose end-of-life moment is playing, in ms. */
  focusMs: 6000,
  /** The camera orbits in steps of this many degrees. */
  yawStepDeg: 45,
  /** Number of yaw steps in a full circle (360 / yawStepDeg). */
  yawSteps: 8,
  initialYawIndex: 1,
  /**
   * Zoom levels, expressed as low-res pixels per world unit. Integer ratios keep
   * pixel art crisp. Index 0 is the farthest view.
   */
  pixelsPerUnit: [16, 32] as const,
  /**
   * A closer step only story shots reach (campaign graphics 3): the push-in after a wide
   * shot, and close shots, which the near step could not show on a desktop already there.
   * Twice the near step, so the art stays on whole pixels. It sits at index
   * `pixelsPerUnit.length`; the player's own zoom never lands on it.
   */
  storyPixelsPerUnit: 64,
  initialZoomIndex: 1,
  /**
   * The zoom a phone starts at: the far one, so both eggs and the nearest trees are on screen
   * at the first look (review 2026-10-21, bug 25). Desktops keep `initialZoomIndex`.
   */
  phoneZoomIndex: 0,
  /** Distance from the orbit target. Only affects clipping for an orthographic camera. */
  distance: 60,
  near: 0.1,
  far: 200,
  /** Duration of the eased snap between yaw steps and zoom levels, in ms. */
  snapMs: 180,
  /** How quickly the orbit target follows the Keeper (fraction per second). */
  followRate: 6,
} as const;

/**
 * The 3D mode's sculpt grid per device. A first-run benchmark marches a small test surface
 * and picks the finest torso resolution whose opening build fits the budget; the save
 * keeps the answer in `settings.sculptRes`. Parts scale by the same share of their own grid.
 */
export const SCULPT_RES = {
  /** The resolution species are authored at (the torso default in `species.ts`). */
  authored: 104,
  /** The choices, finest first: desktop, mid, phone, slow phone. */
  steps: [104, 80, 64, 48] as const,
  /** Grid of the benchmark surface (the Nubbin's torso). */
  benchRes: 24,
  /**
   * How marching time grows with the grid: the narrow band and the per-vertex bake make
   * it nearer the square than the cube (2.84x from 64 to 104, measured 2026-10-16).
   */
  exponent: 2.2,
  /**
   * Marching work of an opening Grove (the Keeper and 8 Nubbins in 7 looks, 54 surfaces)
   * in benchmark surfaces at the benchmark's grid. The benchmark runs at boot, when it
   * reads about 3.5x slower than on an idle page (20 ms against 6 on Maor's PC); the
   * opening marched in 540 ms on 4 workers at grid 63 there, 2026-10-16.
   */
  openingWork: 15,
  /**
   * Marching time the opening may take, in ms. It runs in workers while the page builds
   * the scene and compiles its shaders (2.4 s on Maor's PC, several times that on a
   * phone), so time inside this is hidden; the cache makes it a one-off.
   */
  budgetMs: 3000,
} as const;

/** The full-3D Grove: its Lakitu camera, the heightfield and the dressing built from GROVE. */
/** The pixel sprite atlas (render/sprites/mega-atlas.ts). */
export const ATLAS = {
  /** Share of the atlas a repack leaves empty, so new sheets fit without another repack. */
  headroom: 0.25,
} as const;

/** Which adults get the extra motion clips, by stat level (both renderers). */
export const MOTION_CLIPS = {
  /** An adult at or above this Fly level flaps its wings when it moves. */
  flapLevel: 30,
  /** An adult at or above this Swim level swims a stroke in the pond; others wade. */
  swimLevel: 30,
} as const;

export const GROVE3D = {
  /**
   * The creature pool keeps at most this many spare rigs, and the marched surfaces of at
   * most this many looks; past that the least recently used go (an evolution, a hat or a
   * neighbour's visit leaves the old look behind). Evicted surfaces come back from the
   * IndexedDB cache when asked again.
   */
  poolSpares: 12,
  poolLooks: 40,
  /** The longest the 3D loading veil waits before showing the Grove with its stand-ins. */
  loadSafetyMs: 90_000,
  /**
   * Entering a place whose programs are still linking keeps the last frame up; after
   * `delayMs` it dims over `ms` (and brightens back as fast once the place draws).
   */
  placeFade: { delayMs: 60, ms: 180 },
  /** The tap ring grows to a thing's reach, up to this many times a Nubbin's ring. */
  highlightMaxScale: 3,
  /** The tap halo round a still prop: how far it stands out from the surface, world units. */
  haloRim: 0.1,
  /** The lamp the Keeper carries in the Hollow Below (the torches burn at about 16). */
  keeperLamp: 5,
  /** Downward tilt of the camera behind the Keeper, in degrees (gentler than the pixel 35°). */
  pitchDeg: 24,
  /** Orbit distance for each zoom level (index 0 is the farthest, as in CAMERA). */
  distance: [15, 8.5] as const,
  /** Where the camera looks: this far above the Keeper's feet. */
  lookHeight: 1.1,
  fovDeg: 42,
  /** In portrait the vertical field of view widens until the view is at least this wide,
   * in degrees; at 42 alone a phone held upright sees about 20 degrees across. */
  minHFovDeg: 34,
  near: 0.3,
  far: 260,
  /** Depth of the pond and the stream channel below the meadow. */
  pondDepth: 0.9,
  riverDepth: 0.5,
  /** Beyond this radius the field rises into a rim so the edge reads as a bowl. */
  rimStart: 42,
  rimHeight: 9,
  /** Instanced grass tufts (12 000 on the sample stage; fewer here for the bigger field). */
  grassCount: 9000,
  /** Grass grows this far from the centre on each axis (the heart, where play happens). */
  grassHalf: 30,
  /**
   * The Grove's grass tufts sink into the ground between these distances from the camera:
   * past them the painted meadow (`terrainLook`) carries the field, at a fraction of the cost.
   */
  grassFade: { from: 34, to: 46 },
  /** The painted meadow under the tufts (see `TerrainLook` in `samples/aaa-kit.ts`). */
  terrainLook: { lush: '#7fb05a', dry: '#c9b06a', patches: 0.55 },
  /**
   * The painted water (`render3d/water.ts`): turquoise over the shallows to blue where the
   * bed is deepAt below the surface, a foam band over the last foamWidth of depth at the
   * shore, and the sky's colour at grazing angles. Colours are sRGB.
   */
  water: {
    shallow: '#5ccfd2',
    deep: '#1d5ca6',
    foam: '#f2fbff',
    sky: '#bfe3ff',
    deepAt: 0.7,
    foamWidth: 0.14,
    edgeAlpha: 0.55,
    /** The stream's bed sits only just under the surface: a thin foam line and a shallow scale. */
    stream: { deepAt: 0.3, foamWidth: 0.05 },
  },
  /** Figure heights in world units: the species format sculpts at about 3 to 4 units. */
  keeperHeight: 1.6,
  nubbinHeight: 1.0,
  adultHeight: 1.2,
  /** Sun elevation at local noon, degrees, and the hours the sun rises and sets. */
  noonElevationDeg: 62,
  sunriseHour: 6,
  sunsetHour: 18.5,
  /** Bloom is on only while the sun is this low (golden hour), in degrees. */
  bloomBelowDeg: 16,
  /** Point lights the Grove may use at night, given to the lit lamps nearest the camera. */
  nightLamps: 4,
  /**
   * A creature mesh casts a shadow only with at least this many triangles: the body, head
   * and limbs do; eyes, lids, brows and mouths sit inside the head's shadow anyway and were
   * most of the shadow pass's draws (review C, item 6).
   */
  casterMinTris: 2500,
  /**
   * The Grove's creature look: the toon bands of Maor's "Chao World" line-up with a
   * light rim, and a dark outline sized on screen (`render3d/toon-outline.ts`). The width
   * is a share of the screen's height (0.0026 is about 2 px on an 800 px tall view),
   * capped in world units for creatures far away. Only parts of outlineMinTris or more get
   * one (bodies, heads, limbs, ears, tails): the eye's pieces carry the toon eye's own lash
   * line, and each hull is another draw, so a creature carries about six, not twenty.
   */
  toon: {
    on: true,
    rim: 0.45,
    sky: 0.55,
    outlineScreen: 0.0026,
    outlineMaxWorld: 0.035,
    outlineMinTris: 2500,
  },
  /**
   * The 3D Hollow's cave kit (`render3d/hollow.ts`): rock blocks are pushed about by a
   * world-space noise of `rockAmp` units (shared corners move together, so neighbours never
   * gap), textured from the world position every `rockTexel` units, tops tinted with moss.
   * Walls between the camera and the party sink to `cutHeight` of their height at
   * `cutPerSec` (a share of full height a second) and rise back the same way.
   */
  cave: {
    rockAmp: 0.34,
    rockTexel: 2.2,
    moss: { color: '#4c6744', amount: 0.42 },
    floorTexel: 2.6,
    floorAo: 0.2,
    cutHeight: 0.14,
    cutPerSec: 4,
    rubbleShare: 0.32,
    spikeShare: 0.12,
    /**
     * The colour script by depth (Hollow recommendations item 8), read by both renderers
     * through `bandFor` in `render/cave-bands.ts`. A band runs from its `from` floor to the
     * next band's. `background` doubles as the fog colour, so distance fades into a
     * readable mid-tone, never black. `hemiSky`/`hemiGround` are the cool-over-warm fill,
     * `key` the directional key, `torch` the torch lamps, `grade` the frame tint.
     * `rock`, `moss` and `crystal` tint the cave kit; `floor`, `rim` and `glow` are the
     * pixel painter's flagstone, wall-lip and baked-glow colours.
     */
    bands: [
      {
        from: 1,
        name: 'mossy earth',
        background: '#1c2a30',
        hemiSky: '#a9b8e6',
        hemiGround: '#6a5238',
        key: '#b4c4e8',
        torch: '#ffa850',
        grade: '#fff4e8',
        rock: '#8a7462',
        moss: '#5c8a4a',
        crystal: '#9ad0ff',
        floor: '#857d8c',
        rim: '#a494b4',
        glow: '#ffc070',
      },
      {
        from: 6,
        name: 'blue crystal grotto',
        background: '#16263a',
        hemiSky: '#9cc4ff',
        hemiGround: '#4a4a62',
        key: '#8ec8ff',
        torch: '#ffb468',
        grade: '#e8f2ff',
        rock: '#6a7690',
        moss: '#4a8a8a',
        crystal: '#6fd8f4',
        floor: '#7a8aa0',
        rim: '#8ed8ff',
        glow: '#9ad8ff',
      },
      {
        from: 11,
        name: 'amber fungus cavern',
        background: '#2a2218',
        hemiSky: '#d8c0a0',
        hemiGround: '#5a3e24',
        key: '#ffd09a',
        torch: '#ff9a40',
        grade: '#fff0dc',
        rock: '#8a6a4a',
        moss: '#9a8a3a',
        crystal: '#ffc86a',
        floor: '#8c7a62',
        rim: '#e0b070',
        glow: '#ffb050',
      },
      {
        from: 16,
        name: 'pastel prism depths',
        background: '#261e36',
        hemiSky: '#d0b8ff',
        hemiGround: '#5a4462',
        key: '#e0c8ff',
        torch: '#ffb0d0',
        grade: '#f8eeff',
        rock: '#7e6e94',
        moss: '#8a7ab8',
        crystal: '#ffb8f0',
        floor: '#8e84a6',
        rim: '#e0c0ff',
        glow: '#f0b0ff',
      },
    ],
    /**
     * The cave light rig (items 2, 3 and 7), built on review D's lift. Fills are scaled by
     * `depthFloor + (1 - depthFloor) * floor.light`, so deeper floors dim but stay readable.
     * Exactly four point lights, none casting shadows: the Keeper's lamp and three torch
     * lamps. A torch lamp keeps its torch until another is `hysteresis` units nearer, and a
     * swap fades out and back in at `fadePerSec` (a share of full a second), so it never pops.
     */
    light: {
      hemi: 2.8,
      env: 1.4,
      key: 0.8,
      depthFloor: 0.7,
      fogDensity: 0.012,
      exposure: 0.85,
      bloom: 0.5,
      bloomThreshold: 2.6,
      keeper: { color: '#fff0d0', intensity: 7, distance: 15, decay: 1.6, height: 1.8 },
      torch: { intensity: 22, distance: 12, decay: 2, flicker: 0.1 },
      hysteresis: 2,
      fadePerSec: 3,
      /**
       * Underground the frame governor sheds these, in this order, before it lowers the render
       * scale (`render3d/cave-shed.ts`); the Grove keeps its own order. A step nobody has
       * registered a hook for is a no-op. The shed steps aim at the phone target, not the
       * 30 fps floor: one is taken while the smoothed frame runs over `slowMs` (about 53 fps)
       * and given back, latest first, once it runs under `fastMs` (about 56 fps). The render
       * scale still answers only to `GROVE3D.governor`, so sharpness goes only to hold 30.
       */
      governor: { order: ['particles', 'triplanar', 'bloom'], slowMs: 19, fastMs: 17.8 },
      /**
       * Whether the sun's shadow pass runs underground. Off: the cave's key casts nothing
       * (the creatures keep their contact shadows), which drops a second draw of every caster.
       */
      sunShadow: false,
      /**
       * Hollow light (items 5, 6, 14, 15, 29 and 30, `render3d/hollow-light.ts`). `bake`: torch,
       * crystal and mushroom light baked into the floor and wall vertices (radius in world units,
       * strength a peak share, falloff quadratic). `sconce`: torches are wall sconces; `unlitShare`
       * of them start cold until the Keeper lights them. `flicker`: the baked torch light and the
       * flame sprites wander by `amp` (a slow sum of two sines, never a strobe; constant when
       * motion is reduced). `crystal`: shards per cluster and their size. `mushroom`: wall-foot
       * glow spots, at most `max` a floor. `cookie`: the Keeper's lamp as a ground disc and a wall
       * wash (the wash fades out `wallReach` units from the wall).
       */
      bake: {
        torch: { radius: 5.2, strength: 0.9, height: 1.3 },
        crystal: { radius: 3.4, strength: 0.5, crystalFloorRadius: 4.2, height: 0.7 },
        mushroom: { radius: 2.2, strength: 0.4, height: 0.3 },
      },
      sconce: {
        unlitShare: 0.35,
        height: 1.15,
        flameSize: 0.6,
        haloSize: 2.4,
        haloGlow: 0.45,
        pickRadius: 0.8,
      },
      flicker: { amp: 0.08, hz: 2.4 },
      crystal: { shards: [5, 8], height: [0.6, 1.9], width: [0.1, 0.2], tilt: 0.35, glow: 1 },
      mushroom: { share: 0.1, max: 18, spacing: 3, perSpot: 3, glow: 2.4 },
      cookie: {
        color: '#ffd9a0',
        groundRadius: 3.2,
        groundOpacity: 0.28,
        wallRadius: 2.2,
        wallOpacity: 0.3,
        wallReach: 2.4,
      },
    },
    /**
     * Underground framing (item 21): the radial vignette and a darker top edge, as if under
     * rock. The top shade starts `topFrom` up the frame (0 bottom, 1 top) and reaches `top`
     * at the edge. Above ground the vignette is `groundVignette` and there is no top shade.
     */
    atmos: {
      vignette: 0.6,
      top: 0.35,
      topFrom: 0.55,
      groundVignette: 0.35,
      /**
       * The air (items 16, 17, 22, 35, 36, 42, 43; `render3d/hollow-atmos.ts`). Shafts: cracks
       * in the ceiling, `perRoom` for each medium room up to `max`, one big one in the great
       * chamber; `alpha` is the beam's peak. Motes and spores: `perCell` over open cells up to
       * `moteMax`. Glow: the caustic over water. Drips: one per `perDrip` open cells (water
       * favoured), falling every `period` s with a ring after, heard within `hear` units.
       * Fog: low cards over basins and water. Stars: ceiling glow-worms (`glowCount` on the
       * glowworm floor). Bugs: glow-bugs by the walls' feet.
       */
      shafts: { perRoom: 0.5, max: 5, height: 6.5, width: 1.8, alpha: 0.2, greatScale: 1.7 },
      motes: { perCell: 0.22, moteMax: 260, size: 0.1, alpha: 0.5, spore: 0.3 },
      glow: { alpha: 0.26, scale: 1.3, speed: 0.5 },
      drips: {
        perDrip: 70,
        max: 16,
        period: [3, 6],
        fall: 0.45,
        ring: 1.6,
        hear: 9,
        size: 0.2,
        ringSize: 1.5,
        alpha: 1,
      },
      fog: { alpha: 0.2, height: 0.3, layers: 2, speed: 0.12 },
      stars: { count: 70, glowCount: 220, height: 4.6, range: 22, size: 0.14, alpha: 0.75 },
      bugs: { count: 50, glowCount: 80, size: 0.3, alpha: 1 },
    },
    /**
     * Readability (items 25 and 40, `render3d/hollow-pop.ts`, `render3d/crowd.ts`,
     * `ui/hollow-map.ts`). Loot and strays get a soft additive halo on the floor and a gentle
     * bob (the bob is a slow sway, not a pulse, and is off under reduced motion). Explored
     * rooms glow faintly on the floor. `map` sizes the minimap canvas.
     */
    read: {
      loot: { radius: 0.8, color: '#ffe9a8', opacity: 0.95, bob: 0.06, bobHz: 1.4, lift: 0.08 },
      stray: { color: '#c8a8ff', opacity: 0.75, bob: 0.05, bobHz: 1.1 },
      roomGlow: { color: '#7fe8ff', opacity: 0.06, lift: 0.03 },
      map: { cellPx: 6, maxPx: 240 },
    },
    /**
     * The set dressing (`render3d/hollow-dress*.ts`, items 18, 20, 23, 24, 26–28, 31–34, 44).
     * Shares are per candidate cell; reaches and sizes are world units; colours are sRGB.
     */
    dress: {
      /** Rounded stalactites on a wall lip over open ground, as a share of lip cells. */
      stalactiteShare: 0.1,
      /** Floor decals (cracks, puddles, pebbles, leaf litter) on level open cells. */
      decalShare: 0.16,
      decalSize: [0.55, 1.05] as const,
      /** Roots and vines hanging from the Grove above, at wall-side cells. */
      rootShare: 0.1,
      berriesPerRoot: 3,
      berry: '#ff9ad0',
      /** The worn path along the main room chain (item 27), baked into vertex colour. */
      path: { width: 1.3, wear: 0.45, color: '#c8ae86', wobble: 0.35 },
      /** Timber arches along the main path: at corridor mouths, then every 6–8 cells. */
      arch: { spacing: [6, 8] as const, height: 2.1, maxWidth: 3, lanternShare: 0.5 },
      /** Mine-cart rails on the longest dry corridor run of the main path, and the cart. */
      rails: { minLen: 6, maxLen: 14, gauge: 0.62 },
      /**
       * Stair portals (item 24): the warm daylight shaft up, the cool beam down, the chest's
       * gold pool. `breathe` is the beam's gentle swell (none under reduced motion).
       */
      portal: {
        up: '#ffdc9a',
        down: '#86c4ff',
        chest: '#ffd36a',
        lantern: '#ffc27a',
        height: 4.2,
        breathe: 0.18,
        breathePerSec: 0.5,
      },
      /** Murals (item 34): Nubbin glyphs on standing stones that glow as the Keeper nears. */
      mural: {
        count: [3, 6] as const,
        spacing: 7,
        reach: 3.4,
        fadePerSec: 1.6,
        dim: '#6a6478',
        lit: '#9ee8ff',
        litGain: 2.2,
      },
      /** The vista's painted chasm (item 31). */
      vista: { near: '#3a4a8a', mid: '#262c62', far: '#1a1c44', crystal: '#9ae8ff' },
      /**
       * Touch (item 44): the Keeper lights an unlit sconce within `sconceReach` (tap one to
       * walk over); a crystal chimes when the Keeper or a partner comes within `crystalReach`,
       * at most once each `chimeCooldown` seconds.
       */
      touch: { sconceReach: 1.5, crystalReach: 1.1, chimeCooldown: 2.5, flashSec: 0.9 },
      /** Loot's bob and turn (both still under reduced motion). */
      loot: { bob: 0.04, spin: 0.8 },
    },
    /**
     * The rock (`render3d/hollow-rock.ts`, items 1, 9 to 13 and 45). Walls stand
     * `wallHeight` tall (uneven by `wallVary`) and their tops lean `lean` units out over the
     * open ground, so a chamber reads as a vault; `vistaLip` is the height of the low lip
     * left where a vista opens onto the chasm. The floor is cut `floorSub` times finer than
     * a cell so a terrace edge is a short steep ledge (`ledge` is the share of the gap
     * between two cell centres it is steepest over) and `ledgeWear` brightens its upper lip
     * and shades its foot. `triplanarPower` sharpens the three-way blend. `wear` brightens
     * up-facing ridges and the top lip of a wall toward the band's rim colour; `moss` climbs
     * `foot` units up a wall, `wet` more where a wall faces water, and `fungus` is the glowing
     * speckle share; `wet` darkens, glosses and streaks rock within `radius` cells of water.
     * `tintMix` is how far the band's rock colour tints the texture. `looks` is one entry
     * per band: its painted texture, the strata (`freq` bands a unit, `amount` of pale
     * stripe, `warp` of the noise, `thick` 0..1 where the stripe starts) and fungus amount.
     * The bake (vertex colours and torch light for the bakers in `HollowCtx`) runs
     * `bakeMs` a frame.
     */
    rock: {
      wallHeight: 5.4,
      wallVary: 0.12,
      lean: 1.0,
      vistaLip: 0.45,
      wallRows: 6,
      floorSub: 3,
      ledge: [0.22, 0.78] as const,
      ledgeWear: 0.28,
      triplanarPower: 4,
      tintMix: 0.55,
      wear: { ridge: 0.5, lip: 0.55 },
      moss: { foot: 1.7, wet: 0.7, amount: 0.5, floor: 0.5 },
      wet: { radius: 2, darken: 0.3, rough: 0.28, drip: 0.45 },
      bakeMs: 3,
      looks: [
        { tex: 'sandstone', freq: 2.4, amount: 0.9, warp: 1.6, thick: 0.6, fungus: 0.0 },
        { tex: 'slate', freq: 4.6, amount: 1.0, warp: 0.9, thick: 0.5, fungus: 0.5 },
        { tex: 'amber', freq: 3.0, amount: 0.85, warp: 2.2, thick: 0.62, fungus: 0.6 },
        { tex: 'slate', freq: 3.4, amount: 0.9, warp: 1.4, thick: 0.6, fungus: 0.7 },
      ] as const,
    },
    /**
     * Pixel mode's Hollow (`render/paint/dungeon.ts`, `render/cave-ambience.ts`, items 37 to 39).
     * Walls stand `wallH` tall (the old ones were 1.4) and take their painted face from a strata
     * texture `faceW` x `faceH` px that covers `faceUnitsW` world units across. Walls between the
     * camera and the Keeper sink to `cutHeight` of their height inside a `cutWidth`-wide strip
     * (`cutSoft` is the soft edge, `cutExtra` extra reach). `landmarkScale` enlarges the landmark sprites; `sconceY` is the height of the wall
     * torches and their lamps. `vistaLip` and `vistaSink` are the lip and the chasm of a vista.
     * `ledge` is the lit lip and `ledgeShadow` the shadowed foot (px) of a terrace edge, and
     * `elevTint` the brightness per world unit of height. Ambience: `motes` drifting dust near the
     * Keeper, `drips` falling from wall lips and `embers` rising off torches, each with a spawn
     * rate a second; `reach` is how far from the Keeper they are made.
     */
    pixel: {
      wallH: 3.6,
      cutHeight: 0.2,
      cutWidth: 3.2,
      cutSoft: 1.2,
      cutExtra: 2.4,
      sconceY: 1.9,
      landmarkScale: 1.3,
      faceW: 192,
      faceH: 128,
      faceUnitsW: 5.333,
      vistaLip: 0.45,
      vistaSink: -1.1,
      ledge: 2,
      ledgeShadow: 5,
      elevTint: 0.22,
      ambience: {
        reach: 9,
        motes: { rate: 3, life: 5200, size: 0.16 },
        drips: { rate: 0.6, life: 1100, size: 0.3 },
        embers: { rate: 4, life: 2400, size: 0.42 },
      },
    },
  },
  /**
   * The painted sky (`render3d/sky.ts`): a zenith-to-horizon gradient per time of day, a
   * sun disc with a soft halo, a two-tone cloud layer drifting at `cloudSpeed`, and stars
   * at night. `golden` is the warm band the sun passes through under `goldenDeg`.
   */
  sky: {
    day: { zenith: '#3f86d8', horizon: '#bfe1f2', ground: '#9cc2a8' },
    golden: { zenith: '#4d6fb8', horizon: '#ffc27a', ground: '#c99a72' },
    night: { zenith: '#070b22', horizon: '#1d2a52', ground: '#0d1426' },
    rain: { zenith: '#7f93a8', horizon: '#c3cfd6', ground: '#9aa9a8' },
    goldenDeg: 16,
    cloudCover: 0.48,
    rainCover: 0.82,
    cloudSpeed: 0.006,
  },
  /**
   * Height fog over the Grove: the scene's exp² fog is thickest at `base` and thins to a
   * share `top` of itself by `base + falloff` units up, so the meadow sits in a haze while
   * the hills stand clear above it.
   */
  heightFog: { base: 0, falloff: 7, top: 0.3 },
  /**
   * Rain: how much it tints the grade (was 0.85/0.9/1, which read as a grey wash), its
   * fog's colour and density, how much sun gets through, and the falling streaks.
   */
  rain: {
    tint: [0.96, 0.98, 1.02] as const,
    saturation: 1.1,
    fog: '#a9bcc4',
    fogDensity: 0.0105,
    sun: 1.05,
    streaks: 1800,
    speed: 16,
  },
  /**
   * The frame-time governor: when the smoothed frame time stays above slowMs, the render
   * scale (backing-store pixels per CSS pixel) steps down by stepDown, never below
   * minRatio; when it stays under fastMs for upFrames frames it steps back up toward the
   * device ratio (capped at maxRatio). The canvas is scaled up smoothly, so a phone that
   * cannot hold 30 fps trades sharpness for frames instead of stuttering.
   */
  governor: {
    slowMs: 30,
    fastMs: 21,
    downFrames: 20,
    upFrames: 240,
    stepDown: 0.85,
    minRatio: 0.5,
    maxRatio: 1.5,
    smoothing: 0.1,
    /** A step down must bring the frame time under this share of what it was, or it is undone. */
    minGain: 0.92,
    /**
     * CPU savings the scene may step through once a slow frame is not fill-bound: 1 drops
     * the creature outlines, 2 the second grass pass and the dusk or cave bloom, 3 redraws the sun's
     * shadow only every fourth frame (`Grove3dScene.governRenderScale`).
     */
    cpuLevels: 3,
  },
  /** Camera shake in world units: a Nubbin landing, a tree shaken (pixel: 0.18 / 0.08). */
  shake: { landed: 0.12, tree: 0.05 },
  /** Height above a fruit tree's foot where its leaves burst from when shaken. */
  treeCrown: 3.0,
  /**
   * A crown in the camera's way (see crowns.ts): how much of it stays with the camera
   * inside it or with it between the camera and the Keeper, how fast it eases (per
   * second), and below which its branches and fruit hide. A trunk thins to `blocked` too
   * when the line to the Keeper passes within its radius plus `trunkMargin`.
   */
  /** `holeRadius`: the see-through circle round the Keeper, as a fraction of the screen height. */
  crownFade: {
    inside: 0,
    blocked: 0.2,
    rate: 10,
    innerBelow: 0.5,
    trunkMargin: 0.25,
    holeRadius: 0.16,
  },
  /**
   * Most a walk cycle is sped up to keep feet planted at the sim's speed (see gait.ts).
   * Walking needs 2.45 for the Keeper and 1.8 for a child; 4 keeps Fennel (3.9) planted.
   */
  maxCadence: 4,
  /** How deep a wading Keeper (Swim perk) sinks below the water surface, in world units. */
  wadeDepth: 0.38,
  /** Frame grades for the recoloured places (pixel: cream and lavender on lit materials). */
  groveTint: { sun: '#fff0d0', moon: '#d8c8ff', corvin: '#c4c8cc' },
  /** The dirt paths as polylines across the field (the pixel ground paints its own). */
  paths: [
    [
      [0, 4],
      [-3, 9],
      [-6.5, 11.5],
    ],
    [
      [0, 4],
      [4, 1],
      [9.6, -4.2],
      [14, -5],
    ],
    [
      [0, 4],
      [-1, -4],
      [-2.5, -15.5],
    ],
    [
      [0, 4],
      [3, 8],
    ],
  ] as ReadonlyArray<ReadonlyArray<readonly [number, number]>>,
  pathWidth: 1.1,
} as const;

export const TEST_SCENE = {
  groundSize: 32,
  /** Ground texture tiles per world unit. */
  groundTilesPerUnit: 1,
  /** Pixels per ground tile. */
  groundTilePx: 8,
  spriteSizePx: 32,
  /** World height of a 32px sprite. 2 units at 16 px/unit means 1:1 pixels at the near zoom. */
  spriteWorldHeight: 2,
} as const;

export const INPUT = {
  /** Horizontal two-finger travel (CSS px) that counts as a rotate swipe. */
  swipeThresholdPx: 40,
  /** Pinch distance ratios that count as zoom out / zoom in. */
  pinchOutRatio: 0.8,
  pinchInRatio: 1.25,
  /** Wheel delta (px) that counts as one zoom step. */
  wheelThreshold: 20,
  /** Pointer travel (CSS px) before a press becomes a drag instead of a tap. */
  dragThresholdPx: 10,
  /** Press duration (ms) under which a release counts as a tap. */
  tapMaxMs: 350,
  /** Pointer direction reversals per second that count as shaking a held egg. */
  shakeReversalsPerSecond: 4,
  /** Logo taps within this window open the debug panel. */
  tripleTapMs: 600,
  /**
   * A press this close (CSS px) to a Nubbin still lands on it: a wandering child is a small,
   * moving target, and a near miss would walk the Keeper instead of lifting it.
   */
  nubbinPickSlopPx: 16,
} as const;

/** The safety net for uncaught errors (`platform/error-watch.ts`). */
export const ERRORS = {
  /** Uncaught errors logged per page load; past this, a loop cannot flood the console. */
  maxLogged: 10,
  /** The gentle notice shows at most this often (ms)... */
  noticeGapMs: 60_000,
  /** ...and at most this many times per page load. */
  maxNotices: 3,
  /** How long the notice stays on screen (ms). */
  noticeMs: 6000,
} as const;

export const UI = {
  fpsUpdateMs: 1000,
  /** Mood bubble lifetime above a Nubbin, in ms. */
  bubbleMs: 1500,
  /** Hunger at or above this reads as full: the sheet's Feed holds the fruit back. */
  feedFullAt: 0.95,
  /** How long a toast stays, and a longer one for a how-to the player has to act on. */
  toastMs: 2600,
  toastLongMs: 5000,
  /** The Expedition's how-to-jump tip shows this long, or until the first jump. */
  tipMs: 5000,
} as const;

// ---------- simulation ----------

export const SIM = {
  /** Fixed sim step. 10 per second. */
  stepMs: 100,
  /** Fine steps allowed per rendered frame before the loop falls back to coarse steps. */
  maxStepsPerFrame: 400,
  /** Longest real gap one frame may feed the clock; anything longer is a pause. */
  maxFrameDeltaMs: 5000,
  /** Coarse step used for long catch-ups. */
  coarseStepMs: 1 * MINUTE,
  /** Absences longer than this are simulated in coarse steps. */
  coarseAfterMs: 3 * MINUTE,
  timeScales: [1, 10, 100, 1000] as const,
  autosaveMs: 30 * SECOND,
  /** Show a progress indicator when catch-up takes longer than this. */
  catchUpProgressMs: 500,
  /** Longest absence ever simulated, whatever the setting (review C, item 13): 30 days. */
  maxAwayMs: 30 * 24 * HOUR,
  /** Coarse steps run between checks of the clock during a long catch-up. */
  catchUpChunkSteps: 2000,
  /** Catch-up work done before the page gets a frame to paint the indicator. */
  catchUpSliceMs: 60,
  /** Sim time a live frame may carry over when it falls behind; the rest is dropped. */
  maxLiveBacklogMs: 120 * SECOND,
  /** Grove bounds: entities stay within ±half on both axes. */
  worldHalf: 46,
} as const;

/** Guards that keep a save from being lost by a bad load or import. */
export const SAVE_SAFETY = {
  /** Unreadable saves kept beside their slot, newest first, before a fresh start. */
  unreadableKept: 2,
  /** Bigger files are refused on import; a real save is a few tens of kB. */
  importMaxBytes: 5_000_000,
} as const;

/**
 * The grown-up gate (Mature content, the Learning Grove's grown-up area, erasing a Learning
 * Grove slot): a two-digit by one-digit product, beyond most 7–10 readers, then a held Enter.
 */
export const GROWN_UP_GATE = {
  /** The two-digit factor, never a multiple of ten. */
  bigRange: [13, 49] as const,
  smallRange: [6, 9] as const,
  /** Enter must be held this long, so a mashed key or a quick tap does not get through. */
  holdMs: 1200,
} as const;

export const OFFLINE = {
  defaultMode: 'capped' as const,
  defaultCapHours: 8,
  minCapHours: 1,
  maxCapHours: 720,
  defaultAllowDepartures: false,
} as const;

export const EGG = {
  startCount: 2,
  /** Roster cap: eggs plus Nubbins. */
  maxRoster: 8,
  hatchMs: 3 * MINUTE,
  /** Each shake while held takes this much off the hatch timer. */
  shakeBonusMs: 15 * SECOND,
  /** Minimum gap between shakes that count. */
  shakeCooldownMs: 250,
  /** A first hatch starts a little hungry so Feed works at once (TECH-01); a rebirth hatches full. */
  hatchHunger: 0.7,
  hatchEnergy: 1,
  /** Fruit in hand at the start, so the first Feed works without a tree trip (TECH-01). */
  startFruit: 2,
} as const;

export const NEEDS = {
  /** Hunger goes from 1 (full) to 0 (starving) in this time. */
  hungerFullToStarvingMs: 20 * MINUTE,
  /** Energy goes from 1 to 0 in this time. */
  energyFullToEmptyMs: 40 * MINUTE,
  napMs: 3 * MINUTE,
  /** Below this hunger the Nubbin looks for food. */
  hungryThreshold: 0.35,
  /** Below this hunger it is starving and loses happiness. */
  starvingThreshold: 0.1,
  starvingHappinessPerMinute: -2,
  happinessMin: -100,
  happinessMax: 100,
  happinessStart: 20,
  affectionMin: 0,
  affectionMax: 100,
  affectionStart: 10,
  petHappiness: 5,
  petAffection: 2,
  dropHappiness: -10,
  dropAffection: -3,
  /** One fruit restores this much hunger (0..1). */
  fruitHunger: 0.5,
  fruitHappiness: 3,
  fruitStaminaPoints: 10,
  /** Happiness drifts toward 0 by this much per minute when nothing else happens. */
  happinessDriftPerMinute: 0.5,
  /** Pets are only counted as a new kindness after this gap. */
  petCooldownMs: 2 * SECOND,
} as const;

export const TREES = {
  fruitIntervalMs: 4 * MINUTE,
  /** Shaking the tree takes this much off the fruit timer. */
  shakeBonusMs: 60 * SECOND,
  maxFruitOnGround: 6,
  /** Fruit lands within this radius of the trunk. */
  dropRadius: 1.6,
} as const;

export const LIFECYCLE = {
  childMs: 60 * MINUTE,
  cocoonMs: 30 * SECOND,
  adultMs: 5 * HOUR,
  /** How far into adult life the second evolution settles. */
  secondEvolutionMs: 60 * MINUTE,
  /** Lines with a champion stage take their final form this far into adult life. */
  thirdEvolutionMs: 3 * HOUR,
  /** A hatchling with a fixed rule to another baby grows into it after this long. */
  babyGrowthMs: 10 * MINUTE,
  /** Waiting end-of-life checks run this far apart once the Keeper is back, one cocoon at a time. */
  awaitingStaggerMs: 4 * SECOND,
  /** After the away screen closes, the first waiting check runs this much later. */
  awaitingAfterReleaseMs: 1 * SECOND,
} as const;

export const REBIRTH = {
  /** Lifetime average happiness needed to be reborn instead of departing. */
  minLifetimeHappiness: 30,
  minAffection: 40,
  /** Fraction of stat points carried into the next life. */
  keepPointsFraction: 0.1,
} as const;

export const ETERNAL = {
  minRebirths: 2,
  sunThreshold: 0.8,
  moonThreshold: -0.8,
  /** |alignment| at or under this counts as Eternal Neutral. */
  neutralBand: 0.1,
} as const;

export const PERSONALITY = {
  /** Thresholds on childhood care counts, checked in this order at evolution. */
  mischievousThrows: 5,
  cheerfulPets: 10,
  shyTotal: 3,
  lazyFeeds: 5,
  /** Idle multipliers by personality: greet, play, sit, swim. */
  multipliers: {
    cheerful: { greet: 1.6, play: 1.4, sit: 0.7, swim: 1.1 },
    shy: { greet: 0.3, play: 0.8, sit: 1.3, swim: 0.8 },
    mischievous: { greet: 1.0, play: 1.6, sit: 0.5, swim: 1.5 },
    lazy: { greet: 0.8, play: 0.6, sit: 2.2, swim: 0.5 },
  } as const,
} as const;

export const RACE = {
  /**
   * Longest real gap one frame may feed the race. The race runs fixed sim steps on real
   * time, so a slow phone (3 frames a second) sees the same race, only choppier; a longer
   * gap (the tab was hidden) is cut so the field does not jump to the finish.
   */
  maxFrameDeltaMs: 1000,
  /** Base speed in track units per second at level 0; stat levels add up to this much more. */
  baseSpeed: 2.0,
  statSpeedBonus: 3.0,
  /** Stamina pool at level 0 and the bonus at level 99, in seconds of effort. */
  staminaBase: 18,
  staminaBonus: 40,
  /** Stamina stretches drain at this multiple. */
  stretchDrain: 2.5,
  restMs: 1500,
  /** Fraction of the pool restored after a rest. */
  restRefill: 0.45,
  cheerBoost: 1.45,
  cheerMs: 1200,
  cheerCooldownMs: 3000,
  /** Rivals per tier (min, max) and how their stat levels scale with the tier. */
  rivals: [
    [4, 5],
    [5, 7],
    [6, 8],
  ] as const,
  rivalLevels: [
    [2, 14],
    [12, 36],
    [30, 70],
  ] as const,
  /** Prizes in Shells by placement, times the tier number. */
  prizes: [20, 10, 5] as const,
  hatChanceOnWin: 0.5,
  /** Hard cap so a race always ends. */
  maxMs: 120_000,
} as const;

export const CRITTERS = {
  mainStatPoints: 30,
  otherStatPoints: 10,
  leanNudge: 30,
  /** Giving a critter is a kindness too. */
  happiness: 8,
} as const;

export const ESSENCES = {
  statPoints: 50,
  leanNudge: 50,
  happiness: 5,
} as const;

export const STATS = {
  maxLevel: 99,
  pointsPerLevel: 100,
  gradeMultiplier: { E: 0.8, D: 0.9, C: 1.0, B: 1.1, A: 1.2, S: 1.35 } as const,
  /** Birth grade weights, low end heavy. */
  gradeWeights: { E: 30, D: 28, C: 22, B: 12, A: 6, S: 2 } as const,
} as const;

export const ALIGNMENT = {
  /** Every kind action moves alignment this far toward the active Keeper. */
  kindActionDelta: 0.01,
  sunThreshold: 0.5,
  moonThreshold: -0.5,
  /** Children show hints once they lean this far. */
  childHintThreshold: 0.15,
} as const;

export const TYPE_LEAN = {
  /** The leading type must beat the runner-up by this fraction or the adult is Normal. */
  leadMargin: 0.15,
  /** Lean gained after evolution needed for a second evolution to show. */
  secondMin: 40,
  /** A type needs at least this much lean to count at all; less than one critter. */
  minToCount: 20,
  /** Lean gained per second of swimming / flapping. Slow: an hour of play ≈ one critter. */
  trainingPerSecond: 0.02,
} as const;

export const BEHAVIOR = {
  /** World units per second. */
  walkSpeed: 1.4,
  swimSpeed: 0.8,
  arriveRadius: 0.25,
  /** SOUL-01: a toy counts as reached within this distance; it rolls, so the walk re-aims
   * each step. */
  toyReach: 0.7,
  /** A walk to a toy, fruit or ball gives up after this long (or 1.5× the walk time from where it
   * started, if longer) without arriving ... */
  approachTimeoutMs: 6 * SECOND,
  /** ... or when the distance has not dropped by progressMin within progressWindowMs. */
  progressMin: 0.2,
  progressWindowMs: 2 * SECOND,
  /** A toy or fruit given up on is not picked again for this long. */
  skipItemMs: 30 * SECOND,
  /** How long each state lasts, min and max, in ms. */
  wanderMs: [2 * SECOND, 6 * SECOND] as const,
  sitMs: [3 * SECOND, 8 * SECOND] as const,
  eatMs: 2 * SECOND,
  greetMs: 2 * SECOND,
  cryMs: 3 * SECOND,
  swimMs: [5 * SECOND, 12 * SECOND] as const,
  reactMs: 1200,
  /** How long a petted Nubbin leans into the hand before going back to its day. */
  petMs: 1800,
  /** The Nubbin notices the Keeper within this distance. */
  greetRadius: 2.2,
  greetChance: 0.35,
  swimChance: 0.15,
  sitChance: 0.3,
  /** Chance to go play with a toy when one is around. */
  playChance: 0.3,
  playMs: [4 * SECOND, 8 * SECOND] as const,
  playHappiness: 4,
  /** Hungry Nubbins only look for fruit within this distance. */
  foodSearchRadius: 30,
} as const;

export const KEEPER = {
  speed: 3.5,
  /** Running multiplies the walking speed. */
  runMultiplier: 1.8,
  arriveRadius: 0.2,
  /** Distance at which the Keeper can touch, pick up, shake or feed. */
  interactRadius: 1.4,
  /** Height a carried Nubbin floats at above the Keeper's feet. */
  carryHeight: 1.6,
} as const;

export const THROW = {
  /** Release speeds above this count as a throw; slower is a put-down. */
  minSpeed: 3,
  /** Releases slower than this are a gentle place: no penalty (TECH-02). Between this and
   * minSpeed is a drop, at dropScale of the full drop penalty. */
  placeMaxSpeed: 1.5,
  dropScale: 0.5,
  /** Release velocity is read from this last stretch of the drag, so a pointer held still
   * this long before letting go reads as speed 0. */
  placeStillMs: 120,
  maxSpeed: 12,
  gravity: 24,
  /** Upward speed added to a throw. */
  lift: 5,
  /** Held Nubbins float this high above the ground under the pointer. */
  holdHeight: 1.2,
} as const;

export const SHOP = {
  fruit: 5,
  egg: 60,
  /** Chance a bought egg is a rare colour. */
  rareEggChance: 0.15,
  /** Of the rare eggs: chance of a two-tone, and of a shiny. */
  twoToneChance: 0.3,
  shinyChance: 0.2,
  /** Chance a bought egg is a jewel (ruby, sapphire, ...); rolled before the rare colours. */
  jewelEggChance: 0.02,
  hat: 40,
  toy: 30,
  /** How many toys can lie in the Grove at once. */
  maxToys: 3,
} as const;

export const EXPEDITION = {
  durationMs: 50_000,
  /** Low-res view height; width follows the screen aspect, clamped. */
  viewH: 270,
  minViewW: 200,
  maxViewW: 480,
  /** In portrait, sky is added above the track up to this multiple of `viewH`. */
  maxHeadroom: 1.6,
  /** Pixels per second, ramping up a little over the run. */
  speed: 110,
  speedRamp: 0.8,
  /** The runner stands this far from the left edge, on this ground line. */
  runnerX: 72,
  groundY: 214,
  gravity: 1100,
  jumpVelocity: 360,
  /** Holding the jump cancels this much gravity for up to holdMaxMs. */
  holdGravityCancel: 650,
  holdMaxMs: 260,
  /** Rewards. */
  shellValue: 1,
  obstaclePenalty: 5,
  /** Spawn cadence in pixels of track. */
  patternGapPx: [140, 260] as const,
  essenceChance: 0.12,
  critterChance: 0.09,
  obstacleChance: 0.45,
  /** Seconds of invulnerability after a hit. */
  hitCooldownMs: 700,
} as const;

/**
 * The Expedition in Full 3D (G17): the same run (`run.ts`, in low-res pixels) drawn as a
 * side-on 3D track with a chase camera. Distances map through `unitsPerPx`: the runner
 * is `RUNNER_H` (26) pixels tall in the run and about one world unit tall as a rig.
 */
export const EXPEDITION3D = {
  unitsPerPx: 1 / 26,
  /**
   * The chase camera: how far it looks ahead of the runner along the track and how high,
   * its downward tilt, how many world units it frames top to bottom (the runner is one,
   * so about a sixth of the screen), the least it frames across in portrait (the lens
   * widens to keep that), and how fast it eases after the runner (per second).
   */
  camera: {
    lookAhead: 2.0,
    lookHeight: 1.4,
    pitchDeg: 12,
    height: 6.5,
    minSpan: 6,
    followRate: 7,
    fovDeg: 42,
  },
  /** The backdrop gradient behind everything, zenith to horizon, by theme. */
  backdrop: {
    meadow: { top: '#4a8ad8', bottom: '#d6e8f6' },
    hollow: { top: '#0b1030', bottom: '#2b3660' },
  },
  /** Parallax hills behind the track: depth (negative z is away), height and wavelength. */
  hills: [
    { z: -13, rise: 3.0, period: 12, color: '#5f8f4a' },
    { z: -26, rise: 6.5, period: 21, color: '#4b7a52' },
    { z: -44, rise: 11, period: 35, color: '#5a7f8a' },
  ],
  /** A ring of trees recycled along the track: how many, their spacing, depth and size. */
  trees: { count: 7, spacing: 9, z: -12, scale: 1.0 },
  /** Grass tufts: how many per tile, the tile length along the track and its depth. */
  grass: { count: 1200, span: 36, depth: 9 },
  /** The ground strip: how far it reaches toward the camera and away from it. */
  ground: { front: 24, back: 14 },
  /** The tiling scenery (ground, hills) reaches this far each side of the camera. */
  sceneryHalf: 30,
  /** Prop sizes in world units. */
  shellRadius: 0.17,
  essenceSize: 0.28,
  bubbleRadius: 0.36,
  /** The hour of day each theme's sky shows (the Hollow runs at night). */
  hour: { meadow: 10.5, hollow: 21.5 },
  /** Camera shake on a hit, world units (off under reduced motion). */
  shake: 0.07,
  /** How long the view may wait for the runner's rig before the run starts, ms. */
  rigWaitMs: 2500,
} as const;

/**
 * The races in Full 3D (G17): the sim's one-dimensional track (`sim/race.ts`) laid along
 * x with the lanes stacked away from the camera, each section built to read as itself.
 */
export const RACE3D = {
  /** World units per track unit (a course is 40 to 50 units long). */
  unitsPerTrack: 1.0,
  /** Depth between lanes, and the track's margin beyond the outer lanes. */
  laneGap: 2.1,
  margin: 1.6,
  /** A climb section rises this much over its length; the track stays up after it. */
  climbRise: 2.2,
  /** How high the racers fly over a gap, and how deep a swimmer sinks below the surface. */
  flyLift: 1.5,
  swimSink: 0.42,
  /** The swim channel: water level and bed depth below the track. */
  waterLevel: -0.3,
  channelDepth: 0.9,
  /** The gully under a fly section. */
  gapDepth: 2.6,
  /** How high the section signs stand over the track (above the name tags). */
  signHeight: 2.0,
  /** Ground shown before the start line, in track units, so the field lines up whole. */
  startPad: 3,
  camera: {
    lookAhead: 1.2,
    lookHeight: 0.5,
    // Low enough to read as a side view with faces (review 2026-10-21, bug 16), and the
    // lanes wide enough that each still sits clear above the one in front (review B,
    // bug 27): a lane gap shows as gap × sin(pitch) on screen.
    pitchDeg: 26,
    height: 10.5,
    minSpan: 7,
    followRate: 5,
    fovDeg: 42,
    /** The camera eases this far from the player toward the leader (0 follows the player). */
    leaderWeight: 0.3,
    /** The player never sits further left than this share of the half-width from centre. */
    playerKeep: 0.5,
  },
  /** Name tags over the racers: card size in world units and the text height in it. Tags
   * that would overlap on screen are nudged up by `gap` times the tag height. */
  nameTag: { width: 2.2, height: 0.5, fontPx: 56, gap: 1.1 },
  /** The backdrop gradient, zenith to horizon, and how deep the earth under the track goes. */
  backdrop: { top: '#4a8ad8', bottom: '#d6e8f6' },
  earthDepth: 30,
  /** How long the start may wait for the field's rigs before stand-ins run, ms. */
  rigWaitMs: 4000,
  /** Trees along the far side of the track: how many, spacing, depth past the last lane. */
  trees: { count: 8, spacing: 7, back: 3.5, scale: 0.85 },
  hour: 10.5,
  /** The cheer: sparkles round the player (none under reduced motion). */
  cheerBurst: { count: 18, spread: 0.5, speed: 1.2, rise: 1.4, lifeMs: 700 },
} as const;

export const GROVE = {
  /**
   * 96 units a side (2026-10-13, four times the earlier area). The old 48-unit heart
   * keeps every position; the outer ring is wilder: the north wood, the east ridge, the
   * south marsh along the stream, the west meadow.
   */
  size: 96,
  /** Centre and radius of the pond. */
  pond: { x: 7, z: 6, r: 5 },
  trees: [
    { x: -8, z: -5 },
    { x: 6, z: -12 },
    { x: -12, z: 7 },
    { x: 16, z: 12 },
    // The outer ring's fruit trees: the west meadow and the far orchard corner.
    { x: -32, z: 20 },
    { x: 28, z: 30 },
  ] as const,
  hills: [
    { x: -18, z: 13, r: 6, h: 2.6, ramp: { from: 260, to: 560 } },
    { x: 16, z: -16, r: 7, h: 3.4, ramp: { from: 160, to: 440 } },
    { x: -18, z: -15, r: 5, h: 2, ramp: { from: 40, to: 340 } },
    { x: 20, z: 4, r: 4, h: 1.5, ramp: { from: 290, to: 590 } },
    // The outer ring.
    { x: 36, z: -34, r: 8, h: 3.8, ramp: { from: 135, to: 435 } },
    { x: -36, z: 34, r: 7, h: 3, ramp: { from: 310, to: 610 } },
    { x: 38, z: 30, r: 5, h: 2, ramp: { from: 220, to: 520 } },
    { x: -38, z: -34, r: 6, h: 2.4, ramp: { from: 40, to: 340 } },
    { x: 2, z: -40, r: 5, h: 2.2, ramp: { from: 90, to: 390 } },
    { x: -34, z: -4, r: 4, h: 1.6, ramp: { from: 0, to: 300 } },
  ] as const,
  waterfall: { x: 16, z: -16, height: 3.4, width: 1.6 },
  /** Where the buildings stand and how wide their footprint is (walkers are kept out). */
  buildings: {
    cottage: { x: -7, z: 14, r: 2.8 },
    school: { x: -3, z: -18, r: 2.4 },
    dojo: { x: 18, z: -4, r: 3.4 },
    well: { x: 3, z: 10, r: 0.9 },
    windmill: { x: -16, z: -5, r: 2.0 },
  },
  /** The big rocks, tappable for stone and solid underfoot. */
  rocks: [
    { x: -7, z: 9, r: 0.7 },
    { x: 6, z: -9, r: 0.6 },
    { x: 13, z: -5, r: 0.5 },
    { x: -10, z: 10, r: 0.6 },
    // The outer ring.
    { x: -28, z: 8, r: 0.7 },
    { x: 30, z: 12, r: 0.6 },
    { x: -6, z: 34, r: 0.6 },
    { x: 20, z: -32, r: 0.7 },
    { x: -34, z: -20, r: 0.6 },
    { x: 36, z: 40, r: 0.5 },
    { x: -22, z: -40, r: 0.6 },
  ],
  /** The stream: from the waterfall pool into the pond, then out to the south edge. */
  river: {
    width: 2.2,
    inflow: [
      { x: 12.4, z: -10.4 },
      { x: 10.5, z: -6.5 },
      { x: 9.2, z: -3 },
      { x: 7.6, z: 0.4 },
    ],
    outflow: [
      { x: 8.2, z: 11.6 },
      { x: 9.5, z: 16 },
      { x: 11, z: 20 },
      { x: 12, z: 25 },
      // On through the south marsh to the far edge.
      { x: 12.6, z: 31 },
      { x: 11.2, z: 38 },
      { x: 12.5, z: 44 },
      { x: 12, z: 49 },
    ],
  },
  /** Where the path crosses the inflow. */
  bridge: { x: 9.6, z: -4.2 },
  keeperStart: { x: 0, z: 4 },
  eggSpots: [
    { x: -2, z: 1 },
    { x: 2, z: 0 },
  ] as const,
} as const;

/** Trust: how safe a Nubbin feels with its Keeper. Low trust turns it Shadow. */
export const TRUST = {
  start: 50,
  min: 0,
  max: 100,
  pet: 3,
  feed: 4,
  play: 2,
  throw: -8,
  drop: -3,
  /** Per minute while starving. */
  starvingPerMinute: -1.5,
  /** Per minute while crying unattended. */
  cryingPerMinute: -0.5,
  /** Slow natural settling toward the middle, per minute, while content. */
  settlePerMinute: 0.05,
  /** Below this a Nubbin turns Shadow: jaded, wary, keeps its distance. */
  shadowBelow: 15,
  /** A Shadow Nubbin that is brought back above this bonds: it loves again. */
  bondAbove: 70,
  /** Shadow Nubbins gain trust more slowly until they bond. */
  shadowGainScale: 0.6,
  /** Below this a Nubbin keeps away from the Keeper. */
  wary: 30,
  /** Keep-away radius. */
  avoidRadius: 4,
  /** A Nubbin below `runawayBelow` for this long leaves the Grove. */
  runawayBelow: 5,
  runawayAfterMs: 10 * 60_000,
  /** A stray returns to the Grove edge after this long, hoping to be found. */
  strayReturnMs: 20 * 60_000,
} as const;

/** Weather rolls on the sim clock; rain and snow change behaviour a little. */
export const WEATHER = {
  /** Clear spells last this long (ms), then a roll. */
  clearMs: [8 * 60_000, 20 * 60_000] as const,
  rainMs: [3 * 60_000, 8 * 60_000] as const,
  snowMs: [4 * 60_000, 10 * 60_000] as const,
  rainChance: 0.35,
  /** Winter rolls snow instead of rain. */
  /** Swim lean per second while out in the rain. */
  rainSwimLeanPerSecond: 0.01,
  /** Happiness per minute for Nubbins sheltering under a tree in the rain (they like it). */
  shelterHappinessPerMinute: 0.5,
} as const;

export const BREEDING = {
  heartFruit: 80,
  /** How long a fed adult looks for a partner. */
  courtMs: 90_000,
  /** Partner must be within this distance. */
  reach: 2.5,
  minAffection: 30,
  /** Chance a better grade is passed on per stat; else the average. */
  betterGradeChance: 0.5,
  shinyIfParentShiny: 0.35,
  shinyBase: 0.03,
} as const;

export const LESSONS = {
  price: 25,
  durationMs: 45_000,
  maxLevel: 3,
  /** Chance per idle choice that a schooled Nubbin performs. */
  performChance: 0.08,
  performMs: 4000,
  happiness: 6,
} as const;

export const SERVICES = {
  doctor: 15,
  fortune: 20,
} as const;

export const DECOR = {
  prices: {
    fence: 10,
    flowerbed: 15,
    bench: 25,
    statue: 60,
    pathTile: 5,
    lanternSmall: 20,
    nursery: 400,
    bathhouse: 450,
    workshop: 250,
    rockPile: 12,
    thicket: 18,
  } as const,
  maxPlaced: 60,
  /**
   * What each piece does to walkers (MOVE-04). Fences block Nubbins under Run or Fly 20,
   * which hop them; benches and rock piles can be stood on once the Keeper jumps; beds and
   * thickets are soft, so the Keeper pushes through slowly and Nubbins go round. Path tiles
   * have no entry: they are walked on.
   */
  colliders: {
    fence: { shape: { type: 'segment', len: 1.0, r: 0.08 }, top: 0.6, flags: ['hop'] },
    bench: { shape: { type: 'box', hw: 0.55, hd: 0.18 }, top: 0.44, flags: ['standable'] },
    statue: { shape: { type: 'circle', r: 0.35 }, top: 1.8, flags: ['solid'] },
    lanternSmall: { shape: { type: 'circle', r: 0.12 }, top: 1.0, flags: ['solid'] },
    flowerbed: { shape: { type: 'box', hw: 0.5, hd: 0.3 }, top: 0.3, flags: ['soft'] },
    rockPile: { shape: { type: 'circle', r: 0.45 }, top: 0.6, flags: ['hop', 'standable'] },
    thicket: { shape: { type: 'circle', r: 0.55 }, top: 0.9, flags: ['soft'] },
  } satisfies Record<string, { shape: ColliderShape; top: number; flags: readonly ColliderFlag[] }>,
} as const;

export const VISITS = {
  /** Each Keeper brings one story gift, once, ever; the neighbour host gives the same. */
  giftShells: 30,
  /** Saturday is lantern night. */
  lanternNightDay: 6,
} as const;

/** Orchards and crops. */
export const PLANTS = {
  /** Sim time per growth stage. */
  treeStageMs: 20 * 60_000,
  cropStageMs: 6 * 60_000,
  /** Grown trees drop a fruit this often. */
  treeFruitMs: 6 * 60_000,
  /** Water lost per minute without rain; growth stops when dry. */
  dryPerMinute: 0.02,
  rainRefill: true,
  /** Stat fruit adds this many points; Sun/Moon fruit nudge alignment this much. */
  fruitPoints: 40,
  fruitAlignment: 0.08,
  cropHarvest: 2,
  maxPlants: 24,
} as const;

export const TOYS = {
  prices: { ball: 30, radio: 60, blocks: 45, mirror: 40, tv: 90 } as const,
  maxPlaced: 6,
} as const;

/** Workshop recipes: what each costs in gathered materials and Shells. */
export const RECIPES = {
  fence: { wood: 2, stone: 0, reeds: 0, shells: 0 },
  bench: { wood: 4, stone: 0, reeds: 0, shells: 0 },
  pathTile: { wood: 0, stone: 1, reeds: 0, shells: 0 },
  statue: { wood: 0, stone: 6, reeds: 0, shells: 10 },
  lanternSmall: { wood: 2, stone: 1, reeds: 0, shells: 5 },
  flowerbed: { wood: 1, stone: 0, reeds: 2, shells: 0 },
  rockPile: { wood: 0, stone: 3, reeds: 0, shells: 0 },
  thicket: { wood: 3, stone: 0, reeds: 1, shells: 0 },
  nursery: { wood: 8, stone: 4, reeds: 2, shells: 80 },
  bathhouse: { wood: 6, stone: 8, reeds: 2, shells: 100 },
  workshop: { wood: 10, stone: 6, reeds: 0, shells: 60 },
  ball: { wood: 0, stone: 0, reeds: 2, shells: 0 },
  dye: { wood: 0, stone: 0, reeds: 1, shells: 5 },
} as const;

export const GATHER = {
  /** Chance a shaken tree also drops wood, and how much a stone or reed tap gives. */
  woodChance: 0.45,
  stonePerTap: 1,
  reedsPerTap: 1,
  tapCooldownMs: 8_000,
} as const;

/** Habitats: patches that draw wild creatures in. */
export const HABITAT = {
  /** Decor pieces that make each patch, and how many count as a full patch. */
  need: 3,
  /** Chance per sim minute of a visit when a patch is complete. */
  visitChancePerMinute: 0.15,
  visitMs: 4 * 60_000,
  /** Visits (or one feeding) before the creature settles. */
  settleVisits: 3,
  maxWild: 2,
} as const;

export const QUESTS = {
  /** Open requests on the board at once. */
  open: 3,
  baseShells: 20,
} as const;

export const ACHIEVEMENTS = {
  shells: 25,
} as const;

/** Festival multipliers by season. */
export const SEASONS = {
  spring: { eggPrice: 0.5, rareEgg: 2 },
  summer: { racePrize: 2 },
  autumn: { fruitInterval: 0.5 },
  winter: { lanternsAllDay: true },
} as const;

export const PERKS = {
  /** A bonded or well-loved adult of each type lends its Keeper a move. */
  minAffection: 70,
  runBonus: 2.4,
  wadeSpeed: 0.55,
  powerShakeFruit: 2,
  flyGlideSpeed: 1.3,
} as const;

export const PLOTS = {
  price: 300,
  rosterPerPlot: 4,
  max: 2,
} as const;

export const FRIENDS = {
  /** Friendship per minute spent within reach of another Nubbin. */
  perMinute: 2,
  reach: 2.2,
  buddyAt: 30,
  chatChance: 0.06,
  chatMs: 5000,
} as const;

export const SLED = {
  /** Chance per idle choice to go sledding in the snow. */
  chance: 0.12,
  durationMs: 7000,
} as const;

export const LANDMARKS = [
  { id: 'bridge', x: 9.6, z: -4.2 },
  { id: 'well', x: 3, z: 10 },
  { id: 'falls', x: 12.4, z: -10.4 },
  { id: 'cottage', x: -7, z: 12 },
  { id: 'dojo', x: 18, z: -2 },
  { id: 'school', x: -3, z: -16 },
  { id: 'oldTree', x: -8, z: -3 },
  { id: 'southBend', x: 11, z: 20 },
  { id: 'westHill', x: -12, z: 13 },
  // The outer ring.
  { id: 'northWood', x: -28, z: -30 },
  { id: 'eastRidge', x: 30, z: -24 },
  { id: 'southMarsh', x: 6, z: 38 },
  { id: 'westMeadow', x: -32, z: 16 },
  { id: 'farOrchard', x: 26, z: 34 },
] as const;

// ---------------------------------------------------------------- the Digimon-inspired ten

/** The village square: recruits raise prosperity; thresholds open the square's services. */
export const TOWN = {
  perRecruit: 12,
  max: 120,
  unlocks: { stall: 20, gym: 40, attendant: 60, fortune: 80, festival: 100 } as const,
  stallDiscount: 0.9,
  festivalPrize: 1.15,
} as const;

/** Care slips: a need ignored this long logs one; evolution and lifespan read them. */
export const SLIPS = {
  afterMs: 120_000,
  cooldownMs: 300_000,
  keep: 8,
  /** Each slip trims the adult span by this fraction, down to the floor. */
  lifespanPerSlip: 0.05,
  lifespanFloor: 0.75,
  /** Slips at evolution that mark the Grumpy / Sleepy looks. */
  moodyAt: 3,
} as const;

/** The training gym: timing games at four stations. */
export const GYM = {
  pointsPerHit: 6,
  energyCost: 0.15,
  restedBonus: 1.5,
  roundMs: 20_000,
  minHunger: 0.5,
  minEnergy: 0.5,
  /** Timing bar: a sweep this long, hit zone this wide (fraction). */
  sweepMs: 900,
  zone: 0.22,
} as const;

/** Partners and the merged form. */
export const PARTNERS = {
  followDistance: 4,
  bondPerMinute: 1,
  mergeMs: 60_000,
  minAffection: 60,
  twinePrice: 120,
  mergeLevelBonus: 2,
} as const;

/** Curfew by the real clock. */
/** The post-ending expansions E1–E3 (sim/side-rules-expansions.ts). */
export const EXPANSIONS = {
  /** E2: Dandy's adult span as a multiple of the usual one, so the whole life is twelve days of the clock. */
  novaSpanScale: 2.2,
  /** E2: the days Nova's visits are gated on. */
  novaDays: [4, 8, 11] as const,
  novaSlipsForVariant: 2,
  /** E3: dojo wins after the bracket goes up. */
  tournamentWins: 3,
} as const;

export const CURFEW = {
  nightFrom: 22,
  nightTo: 6,
  energyDrainMultiplier: 1.6,
  napChance: 0.5,
} as const;

/** Rebirth memories and the heirloom look. */
export const INHERITANCE = {
  heirloomGenerations: 3,
} as const;

/** The Keeper skill tree. */
export const SKILLS = {
  pointsPerAchievement: 1,
  pointsPerQuest: 1,
  /** Green Thumb shortens the time between fruit drops to this fraction. */
  greenThumbFruitInterval: 0.9,
} as const;

/** Scanning wild and neighbour species toward an egg. */
export const SCANS = {
  perArrival: 25,
  perMinutePresent: 2,
  perNeighbourVisit: 10,
  full: 100,
} as const;

/** Guard teams: a one-time run of missions and a seeded local board. */
export const TEAMS = {
  pointsPerMission: 10,
  rankEvery: 30,
  /** The team's missions, in order, each set once. */
  missions: [
    { kind: 'expeditions', target: 3 },
    { kind: 'raceWin', target: 1 },
    { kind: 'shells', target: 300 },
    { kind: 'karateWin', target: 1 },
  ],
} as const;

/** The Beetle Run: a cart through a seeded cave. */
export const TANK = {
  lanes: 3,
  speed: 6,
  lengthUnits: 240,
  cargo: 8,
  hazardEvery: [1.4, 2.6] as const,
  lootEvery: [1.0, 2.2] as const,
  stunMs: 700,
  bossBonus: 40,
} as const;

/** The Hollow Below: seeded cave floors under the Grove. */
export const DUNGEON = {
  /**
   * The pixel view's fill light underground: warm stone, whatever the hour above (cg5: the
   * night sky's blue at 1.5x turned the Beetle Road's torch-lit floor purple).
   */
  caveAmbient: '#9a7a5e',
  /** World units per grid cell. */
  cell: 1.5,
  baseCols: 34,
  baseRows: 24,
  growCols: 4,
  growRows: 2,
  maxCols: 54,
  maxRows: 36,
  maxDepth: 20,
  /** Loot spots per floor at depth 1, plus this much again per extra floor. */
  lootBase: 9,
  lootPerDepth: 1.5,
  lootMax: 20,
  straysBase: 2,
  straysPerDepth: 0.6,
  straysMax: 6,
  straySpeed: 1.5,
  strayFleeSpeed: 3.2,
  /** Shells a stray snatches when it bumps the Keeper. */
  straySnatch: 5,
  strayCooldownMs: 6000,
  wildPerFloor: 1,
  pickupRadius: 0.8,
  useRadius: 1.4,
  scanRadius: 2.2,
  chestShells: [30, 60] as const,
  chestEggChance: 0.25,
  partySize: 2,
  followDistance: 1.7,
  nubbinSpeed: 2.8,
  fetchRadius: 4,
  /** Floor light at depth 1 and how much each floor takes away. */
  lightBase: 0.9,
  lightPerDepth: 0.06,
  lightMin: 0.3,
  torchReach: 6,
  crystalReach: 4,
  lampReach: 4.5,
  /**
   * The generator new floors use. A run stores the version its current floor was made
   * with, so a saved run keeps its floor; version 1 is the old 34×24 cave and its numbers
   * above (baseCols..maxRows) must never change.
   */
  genVersion: 2,
  /** Version 2 layout: one great chamber, 2–4 medium rooms, small side rooms, wide tunnels. */
  layout: {
    baseCols: 48,
    baseRows: 34,
    growCols: 4,
    growRows: 2,
    maxCols: 72,
    maxRows: 48,
    /** Cells kept clear between a room and the grid edge. */
    margin: 3,
    /** Chance a cell starts open before the cellular-automata passes. */
    fill: 0.5,
    great: { w: [16, 22] as const, h: [12, 16] as const, edgeNoise: 0.22 },
    medium: { count: [2, 4] as const, w: [8, 12] as const, h: [6, 9] as const },
    small: { count: [1, 2] as const, w: [5, 7] as const, h: [5, 6] as const },
    /** Rooms keep this many cells apart when they can. */
    roomGap: 2,
    placeTries: 80,
    corridorWidth: [2, 3] as const,
    /** Chance of one extra tunnel that closes a loop. */
    loopChance: 0.6,
  },
  /** Version 2 visual elevation (item 19): the sim stays flat, actors sample the height. */
  elev: {
    /** One terrace step in world units, and the highest terrace. */
    step: 0.5,
    max: 1,
    noiseScale: 9,
    /** Water sits this far below the ground around it. */
    waterSink: 0.3,
    /** The pool basin room sits this far below the ground level. */
    basinDepth: 0.5,
    /** Cells around the stairs, the chest and the landmark kept level. */
    flatRadius: 2,
  },
  /** Version 2 water pockets: noise below this becomes water. */
  water: { threshold: 0.3, flooded: 0.5, poolRadius: 0.36 },
  /** Bridges and stepping stones over water runs (item 32). */
  crossing: { minLen: 2, maxLen: 7, bridgeFrom: 4, max: 6, spacing: 4 },
  /** Openings in the outer wall onto the chasm (item 31). */
  vista: { count: [1, 3] as const, maxDepth: 4, maxWidth: 3, spacing: 10 },
  /** The great chamber's landmark (item 18): cells kept clear of loot around it. */
  landmark: { clearRadius: 3, poolRadius: 1.8, stairsFrom: 5 },
  /** Rare special floors (item 41). */
  special: { minDepth: 3, chance: 0.12, crystalSpacing: 3, glowwormLight: 0.1 },
  /** The explored mask (item 40): cells within this many cells of the Keeper are seen. */
  explore: { radius: 4 },
} as const;

/**
 * The campaign's story clock (sim/campaign.ts, sim/side-stories.ts). The sim has no
 * time of day of its own, so a story day is a fixed span of sim time: dawn at its start,
 * dusk at `duskAt` of the way through. "The next dusk" is the next such point.
 */
export const STORY = {
  dayMs: 120_000,
  duskAt: 0.75,
  /** Story-day fractions: when morning ends, and the two night marks the waits use. */
  morningEndsAt: 0.5,
  midnightAt: 0.9,
  lateNightAt: 0.95,
  /** A "sit with them a while" step takes this long on the story clock. */
  shortWaitMs: 20_000,
  /** The nights between chapter 9's close and the Long Night (S23's three visitors). */
  nightsBeforeLongNight: 3,
  /** Story days in "a week later": a story day is two minutes, so a week is three. */
  weekDays: 3,
  /** How near a lantern post counts as having walked Moss to it. */
  lanternReach: 2.5,
  /** Chapter 10's vigil: total lit time to reach dawn, and the waves of cold. */
  vigilMs: 90_000,
  /** Fractions of the vigil at which a wave blows a lantern out (stream, then long grass). */
  vigilWaves: [0.3, 0.65],
  vigilLullAt: 0.5,
  /** Which lantern post each wave blows out (assumed mapping; the scene only names them). */
  vigilWaveLanterns: ['lantern-2', 'lantern-4'],
  /** Where Wisp settles as a stray: under the cottage step (canon 16). */
  wispHome: { x: -7, z: 10.4 },
  /** Ember's friendship for finding Ash's name (S6). */
  s6Friendship: 5,
  /** Shells Corvin asks in S27's buy-back, the same as c9-open's bargain. */
  buyBackShells: 200,
  /**
   * Pacing (review 2026-10-24, item 4). After any scene ends, the next unrelated one (a
   * chapter's opening or closing, another story's step, a fun-quest offer) waits this long
   * on the sim clock, so it scales with the time-scale. A scene's own follow-ups and the
   * same story's next beat are not held.
   */
  breatherMs: 60_000,
  /** Between two different side stories' or fun quests' scenes: a shorter gap. */
  sideGapMs: 20_000,
  /**
   * A chapter lasts at least this long from its opening before the next chapter begins.
   * The closing itself is not held by it: it answers the player's action (closingSettleMs).
   */
  goalMinMs: 90_000,
  /** After the goal is met, the closing waits only this long past the last scene. */
  closingSettleMs: 4_000,
  /** Goals met by a choice inside the opening scene: no minimum before the next chapter. */
  goalsInOpening: ['corvinChoice', 'finalChoice'] as readonly string[],
  /** Chapter scenes whose first line names a time of day wait for that part of the day. */
  sceneTime: {
    'c2-open': 'morning',
    'c2-corvin': 'afternoon',
    'c3-open': 'night',
    'c4-close': 'night',
    'c7-open': 'night',
    'c8-open': 'morning',
    'c12-open': 'morning',
  } as Readonly<Record<string, 'morning' | 'afternoon' | 'night'>>,
  /** The Grove's season in Hazel's Grove, chapter by chapter (index 0 is chapter 1). */
  chapterSeasons: [
    'spring',
    'spring',
    'summer',
    'summer',
    'summer',
    'summer',
    'summer',
    'autumn',
    'winter',
    'winter',
    'winter',
    'winter',
  ] as const,
  /** After the ending: the post-game spring (S27's egg sac, E1–E3). */
  postGameSeason: 'spring' as const,
  /**
   * Scene guests (campaign.ts): speakers never given a body beside the Keeper, because they
   * are a crowd, a voice, a memory or a feeling rather than someone at the gate.
   */
  guestSkip: [
    'you',
    'narrator',
    'chorus',
    'hazel',
    'kids',
    'worry',
    's29-children',
  ] as readonly string[],
  /** How far from the Keeper scene guests stand, and how far apart. */
  guestReach: 2.2,
  guestSpread: 0.9,
  /** At most this many guests stand in for one scene. */
  guestMax: 4,
} as const;

import type { StoryPropDef } from '../sim/story-props';
import type { ColliderFlag, ColliderShape } from './grove-layout';

/** Fun quests Q1-Q65 (sim/fun-quests.ts): how they offer themselves. */
export const FUN = {
  /** One at a time, and never in a chapter's first story day (the campaign speaks first). */
  maxOpen: 1,
  offerAfterMs: 120_000,
  /** After a fun quest opens, the next one is not offered for this long (no stacking). */
  offerGapMs: 240_000,
  /** Market days, as JavaScript weekdays (Wednesday and Saturday). */
  marketDays: [3, 6],
  /** "Midday" is this much of a story day either side of noon. */
  middayHalfWidth: 0.08,
  /** A Nubbin counts as tired below this energy. */
  tiredBelow: 0.3,
  /** "Some Swim" or "a Fly-leaning Nubbin": a stat at this level or more. */
  someStatLevel: 5,
} as const;

/** The Learning Grove's language courses (sim/lang.ts, CV3). */
export const LANG = {
  /** A course's next quest waits this long after the last one ends, then for a morning. */
  nextQuestAfterMs: 120_000,
  /** A word counts as learned once used, or once heard this many times. */
  learnedAfterHeard: 3,
  /** Nubbins this close to the Keeper react to a learned word, at most this many. */
  reactRadius: 9,
  reactMax: 3,
  /** Tracing (ui/trace.ts), on a 0-100 board: how far from a stroke still counts. */
  traceRadius: 14,
  /** Share of a stroke's points the finger must pass near, and of a letter's ink covered. */
  strokeCover: 0.7,
  inkCover: 0.5,
} as const;

/** The four lantern posts, lantern-1..4: pond, stream, wall and long grass. */
export const LANTERN_POSTS = [
  { id: 'lantern-1', x: -4, z: 4 },
  { id: 'lantern-2', x: 4, z: -3 },
  { id: 'lantern-3', x: 9, z: 7 },
  { id: 'lantern-4', x: -8, z: -6 },
] as const;

/**
 * The things the side stories point at (sim/story-props.ts says when each stands):
 * where it stands, how it is drawn, and which step checks a tap on it meets.
 */
export const STORY_PROPS: readonly StoryPropDef[] = [
  { id: 'old-trowel', kind: 'trowel', x: -6.2, z: 10.6, meets: ['old-trowel'] },
  { id: 'hatch-register', kind: 'register', x: -7.9, z: 10.7, meets: ['hatch-register'] },
  { id: 'hazels-lantern', kind: 'handLantern', x: -5.4, z: 11.2, meets: ['s24-hazels-lantern'] },
  { id: 'sunrise-shelf', kind: 'shelf', x: -8.6, z: 11.4, meets: ['sunrise-shelf'] },
  { id: 'flat-stone', kind: 'flatStone', x: -14.8, z: 13.6, meets: ['s24-hill'] },
  { id: 'hazels-bench', kind: 'oldBench', x: -2.4, z: 5.6, meets: ['hazel-bench'] },
  { id: 'corvins-chair', kind: 'chair', x: -1, z: 6.3, meets: [] },
  { id: 'lantern-shed', kind: 'shed', x: 6.4, z: -1.2, meets: ['s27-shed-window', 's7-minder'] },
  { id: 'old-barn', kind: 'barn', x: 15, z: 12, meets: ['s18-centre-case'] },
  {
    id: 'walled-garden-door',
    kind: 'gardenDoor',
    x: 10.6,
    z: 5.4,
    meets: ['s26-door', 's26-garden'],
  },
  { id: 'hush-bench', kind: 'oldBench', x: 12.2, z: 4.4, meets: ['s26-hush-bench', 'hush-bench'] },
];

/** The separate campaigns (sim/storyline.ts, sim/storyline-rules.ts). */
export const STORYLINES = {
  /** S1: the partner's adult span, as a multiple of the usual one (5 h × 72 ≈ 15 days). */
  hundredSpanScale: 72,
  /** S2: foes per bout and their levels by tier. */
} as const;

/** S3's fusion (sim/fusion.ts): what both partners must be sure of before they can agree. */
export const FUSION = {
  minAffection: 80,
  minTrust: 60,
  affectionGain: 10,
} as const;

/**
 * Full 3D readability (review 2026-10-21, bugs 10–17): the key-moment camera, the occluder
 * fade, the story staging, the Hollow's light and the memorial flower.
 */
export const READ3D = {
  /** A hatch, evolution, cocoon or rebirth: how long the camera frames the Nubbin. */
  focus: {
    ms: 5000,
    /** The orbit distance while framing, and where between Keeper (0) and Nubbin (1) it looks. */
    distance: 7,
    towardSubject: 0.55,
    /** The camera turns at most this far off the player's yaw to bring the Nubbin forward. */
    maxTurnRad: 1.4,
    /** Turned this far off the Keeper-to-Nubbin line: from the side, so both read, the Nubbin nearer. */
    sideRad: 1.15,
    pitchDeg: 20,
    lookUp: 1.3,
  },
  /** A story scene: the speakers framed together, the distance growing with their spread. */
  stage: {
    radius: 14,
    minDistance: 8.5,
    spreadK: 1.5,
    /** The hour a scene's dusk or night narration is lit at. */
    duskHour: 19.2,
    nightHour: 22.5,
    goldenHour: 17.8,
    morningHour: 7.5,
    /** C5: a speaker further than `radius` is drawn this far from the Keeper, facing them. */
    bringIn: 2.5,
    /** H8: fraction of the frame height the subjects are lifted by, clear of the dialogue box. */
    boxLift: 0.2,
    /** On a phone held upright the story camera stands no further back than this. */
    portraitMaxDistance: 12,
    /** …and frames at most this spread (units from the centre), narrowing the cast to fit. */
    portraitSpread: 3.5,
    /** H8 shot shapes: `wide` and `establish` stand back by this much over a two-shot. */
    wideK: 1.45,
    /** `establish` dollies in from this many times its distance, over `establishMs`. */
    establishFrom: 1.7,
    establishMs: 2000,
    /** `over`: the camera sits behind the Keeper, this far round off the line to the speaker. */
    overSideRad: 0.35,
    overDistance: 5.5,
    overPitchDeg: 16,
    /** `close` frames the speaker this far along from the Keeper (0) to the speaker (1). */
    closeToward: 0.7,
  },
  /** Lantern posts: how wide a post blocks, and the NPC's keep-off radius round each. */
  post: { r: 0.3, keepOff: 0.75 },
  /** The Hollow Below's wider camera (its light rig is `GROVE3D.cave.light`). */
  hollow: {
    distanceK: 1.2,
    pitchDeg: 42,
  },
  memorial: { height: 1.15, glow: 0.55 },
  /** Racers and the Expedition runner turn this far from side-on toward the camera. */
  faceTurn: 0.55,
} as const;

// The campaign-graphics packages (a–f) keep their own tunables beside this file.
export * from './tuning-a';
export * from './tuning-b';
export * from './tuning-c';
export * from './tuning-d';
export * from './tuning-e';
export * from './tuning-f';
export * from './tuning-p';
export * from './tuning-s';
export * from './tuning-k';
export * from './tuning-w';
export * from './tuning-x';
export * from './tuning-y';
export * from './tuning-u';
export * from './tuning-f2';
export * from './tuning-f4';
export * from './tuning-a1';
export * from './tuning-a2';
export * from './tuning-b4';
export * from './tuning-c4';
export * from './tuning-d4';
export * from './tuning-e4';
export * from './tuning-u4';
export * from './tuning-world';
export * from './tuning-hud-world';
export * from './tuning-dungeon';
export * from './tuning-move';
export * from './tuning-move-joy';
export * from './tuning-move-nub';
export * from './tuning-battle';
export * from './tuning-look';
export * from './tuning-fun';
export * from './tuning-tech';
export * from './tuning-kids';
export * from './tuning-fun-r7';
export * from './tuning-camp';
export * from './tuning-soul-r8';
export * from './tuning-look-r9e';
