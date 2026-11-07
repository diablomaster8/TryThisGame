/**
 * Tuning: the render-3d-grove domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

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
   * HOT-3 (load time): the light sets not on screen link after the veil, in the background:
   * `linkMs` of each frame, `linkPack` stand-ins a compile call; `openAfterMs` is how long
   * `loadState` may go unasked before the scene counts the veil as gone.
   */
  boot: { linkMs: 10, linkPack: 6, openAfterMs: 1500 },
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
  grassCount: 12500,
  /** Grass grows this far from the centre on each axis (the heart, where play happens). */
  grassHalf: 44,
  /** R0132: the heart keeps full grass; past it the ring keeps this share, taller. */
  grassHeart: 30,
  grassWildShare: 0.4,
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
