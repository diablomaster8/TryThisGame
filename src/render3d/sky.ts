import * as THREE from 'three';
import { CG_A, GROVE3D } from '../config/tuning';
import type { Daylight } from '../render/daylight';
import type { WeatherKind } from '../sim/types';

/**
 * The sky, the sun and the light they give the 3D Grove, driven by the same Daylight
 * the pixel mode dims its sprites with. The sun's height follows the hour; the
 * environment map is rebuilt from the sky only when the sun has moved enough to
 * matter, because a PMREM bake costs a few milliseconds.
 *
 * Art pass 2: the sky is painted, not physical. A dome shades from the horizon to the
 * zenith in the hour's colours (`GROVE3D.sky`: day, golden hour, night, rain), the sun is a
 * disc in a soft halo, clouds are a two-tone layer that drifts with the clock and thickens
 * in rain, and stars come out at night. The scene's fog also thins with height
 * (`GROVE3D.heightFog`, patched into three's fog chunks once, below), so the meadow sits in
 * haze while the hills stand clear.
 */

const glsl = (n: number) => n.toFixed(4);

// Height fog: exp² fog scaled down with the fragment's height above the meadow. The world
// height comes from the view-space position (the view matrix is rigid), so every material
// that already takes fog gets it with no new uniform. Only exp² fog changes, and only the
// 3D Grove and its stage samples use exp² fog.
{
  const { base, falloff, top } = GROVE3D.heightFog;
  const C = THREE.ShaderChunk;
  if (!C.fog_vertex.includes('vFogHeight')) {
    C.fog_pars_vertex = C.fog_pars_vertex.replace(
      'varying float vFogDepth;',
      'varying float vFogDepth;\n\tvarying float vFogHeight;',
    );
    C.fog_vertex = C.fog_vertex.replace(
      'vFogDepth = - mvPosition.z;',
      'vFogDepth = - mvPosition.z;\n\tvFogHeight = ( transpose( mat3( viewMatrix ) ) * ( mvPosition.xyz - viewMatrix[ 3 ].xyz ) ).y;',
    );
    C.fog_pars_fragment = C.fog_pars_fragment.replace(
      'varying float vFogDepth;',
      'varying float vFogDepth;\n\tvarying float vFogHeight;',
    );
    C.fog_fragment = C.fog_fragment.replace(
      'float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );',
      `float fogLift = mix( 1.0, ${glsl(top)}, smoothstep( ${glsl(base)}, ${glsl(base + falloff)}, vFogHeight ) );
\t\tfloat fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogLift * vFogDepth * vFogDepth );`,
    );
  }
}

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vec4 world = modelMatrix * vec4( position, 1.0 );
    vDir = world.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * world;
    gl_Position.z = gl_Position.w; // always at the far plane
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uSunSize;
  uniform vec3 uCloudLit;
  uniform vec3 uCloudShade;
  uniform float uCover;
  uniform float uTime;
  uniform float uStars;
  uniform float uGain;
  varying vec3 vDir;

  float skyHash( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
  float skyNoise( vec2 p ) {
    vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
    return mix( mix( skyHash( i ), skyHash( i + vec2( 1, 0 ) ), f.x ),
                mix( skyHash( i + vec2( 0, 1 ) ), skyHash( i + vec2( 1, 1 ) ), f.x ), f.y );
  }
  float skyFbm( vec2 p ) {
    float v = 0.0; float a = 0.55;
    for ( int i = 0; i < 4; i++ ) { v += a * skyNoise( p ); p = p * 2.03 + 7.1; a *= 0.48; }
    return v;
  }

  void main() {
    vec3 dir = normalize( vDir );
    float h = dir.y;
    vec3 col = h >= 0.0
      ? mix( uHorizon, uZenith, pow( smoothstep( 0.0, 0.75, h ), 0.7 ) )
      : mix( uHorizon, uGround, smoothstep( 0.0, -0.2, h ) );
    float sd = max( dot( dir, uSunDir ), 0.0 );
    // A wide warm halo, a tighter glow, and the disc with a soft rim.
    col += uSunColor * ( pow( sd, 6.0 ) * 0.22 + pow( sd, 80.0 ) * 0.5 );
    col = mix( col, uSunColor * 2.2, smoothstep( 1.0 - uSunSize, 1.0 - uSunSize * 0.55, sd ) );
    // Stars, in cells on the dome, a few twinkling.
    if ( uStars > 0.0 && h > 0.0 ) {
      vec2 q = vec2( atan( dir.z, dir.x ) * 60.0, h * 120.0 );
      vec2 cell = floor( q );
      float r = skyHash( cell );
      float d = length( fract( q ) - 0.5 );
      float star = step( 0.985, r ) * smoothstep( 0.22, 0.0, d );
      star *= 0.6 + 0.4 * sin( uTime * 2.0 + r * 50.0 );
      col += vec3( 0.9, 0.95, 1.0 ) * star * uStars * smoothstep( 0.02, 0.2, h );
    }
    // Clouds: a layer seen through the dome, painted in two tones with a soft edge.
    if ( h > 0.0 ) {
      vec2 p = dir.xz / ( h + 0.12 ) * 0.9 + vec2( uTime, uTime * 0.4 );
      float n = skyFbm( p );
      float edge = 1.0 - uCover;
      float c = smoothstep( edge, edge + 0.16, n ) * smoothstep( 0.0, 0.14, h );
      // Only where there is cloud: the second sample is half the sky's cost.
      if ( c > 0.002 ) {
        // Sample toward the sun: where the cloud thins that way, its face is lit.
        float lit = skyFbm( p - uSunDir.xz * 0.35 );
        float shade = smoothstep( edge + 0.05, edge + 0.3, lit );
        vec3 cloud = mix( uCloudLit, uCloudShade, step( 0.5, shade * 0.6 + ( n - edge ) * 1.4 ) * 0.85 );
        // A rim where the sun is behind the cloud.
        cloud += uSunColor * pow( sd, 10.0 ) * ( 1.0 - c ) * 0.6;
        col = mix( col, cloud, c * 0.92 );
      }
    }
    gl_FragColor = vec4( col * uGain, 1.0 );
  }
`;

/** The painted dome's material; one for the sky in view and the one the PMREM bakes. */
function skyMaterial(): THREE.ShaderMaterial {
  const v3 = () => ({ value: new THREE.Color() });
  return new THREE.ShaderMaterial({
    name: 'PaintedSky',
    uniforms: {
      uZenith: v3(),
      uHorizon: v3(),
      uGround: v3(),
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uSunColor: v3(),
      uSunSize: { value: 0.0012 },
      uCloudLit: v3(),
      uCloudShade: v3(),
      uCover: { value: GROVE3D.sky.cloudCover },
      uTime: { value: 0 },
      uStars: { value: 0 },
      uGain: { value: 1.6 },
    },
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
}

const tmpA = new THREE.Color();
const tmpB = new THREE.Color();

/** The painted palette at a sun height and weather: zenith, horizon, ground. */
function palette(elevation: number, weather: WeatherKind): [THREE.Color, THREE.Color, THREE.Color] {
  const s = GROVE3D.sky;
  const toGold = THREE.MathUtils.smoothstep(elevation, -7, 2);
  const toDay = THREE.MathUtils.smoothstep(elevation, 4, s.goldenDeg + 10);
  const wet = weather === 'rain' ? 0.85 : weather === 'snow' ? 0.55 : 0;
  return (['zenith', 'horizon', 'ground'] as const).map((k) => {
    const c = new THREE.Color(s.night[k]).lerp(tmpA.set(s.golden[k]), toGold);
    c.lerp(tmpB.set(s.day[k]), toDay);
    if (wet) c.lerp(tmpA.set(s.rain[k]), wet * THREE.MathUtils.clamp(toGold * 1.2, 0.3, 1));
    return c;
  }) as [THREE.Color, THREE.Color, THREE.Color];
}

/** How golden the light is (0 by day and at night, 1 with the sun on the horizon). */
export function goldenness(elevation: number): number {
  const g = GROVE3D.sky.goldenDeg;
  return (
    THREE.MathUtils.smoothstep(elevation, -5, 1) *
    (1 - THREE.MathUtils.smoothstep(elevation, g * 0.5, g + 6))
  );
}

export class GroveSky {
  /** The painted dome (hidden underground and in the minigames that have their own). */
  readonly sky: THREE.Mesh;
  readonly sun = new THREE.DirectionalLight('#fff6e4', 2.4);
  readonly hemi = new THREE.HemisphereLight('#cfe0ff', '#3a5a2a', 0.3);
  readonly fog: THREE.FogExp2;
  private readonly sunDir = new THREE.Vector3(0, 1, 0);
  private readonly pmrem: THREE.PMREMGenerator;
  private readonly envScene = new THREE.Scene();
  private readonly material = skyMaterial();
  private bakedElevation = Infinity;
  private bakedWeather: WeatherKind | null = null;
  /** A blank environment of the baked one's shape, held until the first bake. */
  private placeholder: THREE.WebGLRenderTarget | null = null;
  /** The baked environment's target: disposing only its texture leaves the target counted. */
  private envTarget: THREE.WebGLRenderTarget | null = null;
  private warmed = false;
  private bakeWanted = false;
  /** Sun elevation in degrees, for the post stack (bloom at golden hour). */
  elevationDeg = 60;

  constructor(
    renderer: THREE.WebGLRenderer,
    private readonly scene: THREE.Scene,
  ) {
    const dome = new THREE.SphereGeometry(1, 40, 20);
    this.sky = new THREE.Mesh(dome, this.material);
    this.sky.scale.setScalar(200);
    this.sky.frustumCulled = false;
    this.sky.renderOrder = -1;
    this.sky.name = 'sky';
    scene.add(this.sky);
    const envSky = new THREE.Mesh(dome, this.material);
    envSky.scale.setScalar(200);
    envSky.frustumCulled = false;
    this.envScene.add(envSky);
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.warm(renderer);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -30;
    sc.right = 30;
    sc.top = 30;
    sc.bottom = -30;
    sc.near = 1;
    sc.far = 200;
    this.sun.shadow.bias = -0.0006;
    this.sun.shadow.normalBias = 0.03;
    this.sun.shadow.radius = 3;
    sc.updateProjectionMatrix();
    scene.add(this.sun, this.sun.target, this.hemi);
    this.fog = new THREE.FogExp2('#c9dcf0', 0.007);
    scene.fog = this.fog;
  }

  /** Sun elevation for a local hour: up at sunrise, highest at midday, under at night. */
  static elevationAt(hour: number): number {
    const { sunriseHour, sunsetHour, noonElevationDeg } = GROVE3D;
    const t = (hour - sunriseHour) / (sunsetHour - sunriseHour);
    return Math.sin(t * Math.PI) * noonElevationDeg;
  }

  /** Drift the clouds and twinkle the stars; every frame, from the scene's clock. */
  tick(t: number): void {
    this.material.uniforms.uTime!.value = t * GROVE3D.sky.cloudSpeed;
  }

  /** Apply the hour and the sim's daylight and weather; re-bakes the sky when needed. */
  set(hour: number, d: Daylight, weather: WeatherKind, focus: THREE.Vector3): void {
    const elevation = GroveSky.elevationAt(hour);
    this.elevationDeg = elevation;
    const night = elevation < -2;
    const gold = goldenness(elevation);
    const rain = weather === 'rain';
    // Sunlight sweeps east to west; at night the moon stands in for it, low and blue.
    const azimuth = 100 + ((hour - 6) / 12) * 140;
    const lit = night ? 25 : Math.max(3, elevation);
    this.sunDir.setFromSphericalCoords(
      1,
      THREE.MathUtils.degToRad(90 - lit),
      THREE.MathUtils.degToRad(night ? 300 : azimuth),
    );
    // The dome: the hour's colours, the sun (or the moon) where the light comes from.
    const u = this.material.uniforms;
    const [zenith, horizon, ground] = palette(elevation, weather);
    (u.uZenith!.value as THREE.Color).copy(zenith);
    (u.uHorizon!.value as THREE.Color).copy(horizon);
    (u.uGround!.value as THREE.Color).copy(ground);
    const skySun = (u.uSunDir!.value as THREE.Vector3).copy(this.sunDir);
    if (!night)
      skySun.setFromSphericalCoords(
        1,
        THREE.MathUtils.degToRad(90 - elevation),
        THREE.MathUtils.degToRad(azimuth),
      );
    const sunColor = u.uSunColor!.value as THREE.Color;
    if (night) sunColor.set('#9fb4e8').multiplyScalar(0.55);
    else
      sunColor
        .set('#fff1d2')
        .lerp(tmpA.set('#ffa04a'), gold)
        .multiplyScalar(rain ? 0.25 : 1);
    u.uSunSize!.value = night ? 0.0007 : 0.0012;
    u.uStars!.value = rain ? 0 : 1 - THREE.MathUtils.smoothstep(elevation, -8, -1);
    u.uCover!.value = rain ? GROVE3D.sky.rainCover : GROVE3D.sky.cloudCover;
    const cl = u.uCloudLit!.value as THREE.Color;
    const cs = u.uCloudShade!.value as THREE.Color;
    cl.set('#ffffff').lerp(tmpA.set('#ffd2a8'), gold);
    cs.copy(horizon)
      .lerp(tmpA.set('#8c9ab8'), 0.45)
      .lerp(tmpB.set('#d98a78'), gold * 0.5);
    if (night) {
      cl.set('#4a5680');
      cs.set('#222a48');
    }
    if (rain) {
      cl.set('#d4dbe0');
      cs.set('#97a3ad');
    }

    if (Math.abs(elevation - this.bakedElevation) > 2.5 || weather !== this.bakedWeather) {
      this.bakedElevation = elevation;
      this.bakedWeather = weather;
      if (this.warmed) this.bake();
      else this.bakeWanted = true;
    }
    // The sky map is soft fill only: at its old 0.7 it flooded every rough surface with the
    // sky's pale blue and washed the meadow to mint. The hemisphere carries the fill now,
    // green from the ground and blue from above, which keeps shapes and colours.
    // The painted dome is darker than the physical sky it replaced (whose sun disc lit the
    // whole map), so it gives a larger share.
    // At night the sky map and the hemisphere hold the unlit ground at about a fifth of full
    // brightness in a blue-violet, not near black (campaign graphics C3).
    this.scene.environmentIntensity = night
      ? CG_A.night.env
      : rain
        ? 0.85
        : elevation < 15
          ? 0.75
          : 0.95;

    // The golden hour is warm and bright, not dim: the sun keeps most of its strength and
    // takes on amber, and the fill warms with it.
    this.sun.color.set(night ? '#8fa8d8' : d.sunColor);
    if (!night) this.sun.color.lerp(tmpA.set('#ffc07a'), gold * 0.35);
    this.sun.intensity = night
      ? CG_A.night.moon
      : rain
        ? GROVE3D.rain.sun
        : THREE.MathUtils.lerp(1.9, 2.9, THREE.MathUtils.clamp(elevation / 30, 0, 1));
    this.sun.position.copy(this.sunDir).multiplyScalar(60).add(focus);
    this.sun.target.position.copy(focus);
    this.hemi.color.set(d.hemiColor);
    if (!night) this.hemi.color.lerp(tmpA.set('#ffd6a8'), gold * 0.4);
    else this.hemi.color.lerp(tmpA.set(CG_A.night.hemiColor), CG_A.night.hemiMix);
    this.hemi.intensity = night ? CG_A.night.hemi : rain ? 0.78 : 0.72 + gold * 0.1;
    // The fog takes the horizon's colour, so the far meadow melts into the painted sky.
    this.fog.color
      .copy(horizon)
      .lerp(tmpA.set(night ? '#1a2238' : '#fff0dc'), night ? 0.5 : 0.15 + gold * 0.4);
    if (rain) this.fog.color.set(GROVE3D.rain.fog);
    this.fog.density = rain ? GROVE3D.rain.fogDensity : elevation < 15 ? 0.008 : 0.006;
  }

  /** Whether the environment map has been baked once (the loading veil waits for it). */
  get ready(): boolean {
    return this.placeholder === null;
  }

  private bake(): void {
    this.bakeWanted = false;
    if (this.placeholder) {
      this.placeholder.dispose();
      this.placeholder = null;
    } else this.envTarget?.dispose();
    this.envTarget = this.pmrem.fromScene(this.envScene, 0.02);
    this.scene.environment = this.envTarget.texture;
  }

  /**
   * The first bake links four programs (the sky seen by the cube camera, the bake's
   * background box, its blur and GGX filters) and each one stalled the page at first use:
   * 70–115 ms on Maor's PC with the browser's shader cache warm, 305 ms cold. Compile
   * them with `compileAsync` instead and bake when they are linked; until then the scene
   * holds a blank target of the baked one's shape, so the scene's own programs key exactly
   * as they will after the bake. This reaches into PMREMGenerator internals, which is safe
   * only because three is pinned (0.186.1).
   */
  private warm(renderer: THREE.WebGLRenderer): void {
    const p = this.pmrem as unknown as PmremInternals;
    p._setSize(256); // fromScene's default size
    this.placeholder = p._allocateTargets();
    this.scene.environment = this.placeholder.texture;
    // The same background box fromScene would make on first use.
    p._backgroundBox = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        name: 'PMREM.Background',
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
      }),
    );
    const lod = p._lodMeshes[0]!.geometry;
    const filters = new THREE.Scene();
    filters.add(new THREE.Mesh(lod, p._blurMaterial), new THREE.Mesh(lod, p._ggxMaterial));
    const box = new THREE.Scene();
    box.add(p._backgroundBox);
    const cam = new THREE.PerspectiveCamera(90, 1, 0.1, 100);
    // Every bake pass draws into a linear target with no tone mapping, as these will.
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(this.placeholder);
    const done = [filters, box, this.envScene].map((s) => renderer.compileAsync(s, cam));
    renderer.setRenderTarget(prev);
    void Promise.all(done).then(() => {
      box.remove(p._backgroundBox!);
      this.warmed = true;
      if (this.bakeWanted) this.bake();
    });
  }

  dispose(): void {
    this.pmrem.dispose();
    this.placeholder?.dispose();
    this.envTarget?.dispose();
    this.scene.environment = null;
  }
}

/** The PMREMGenerator members the warm-up reaches (three 0.186.1). */
interface PmremInternals {
  _setSize(cubeSize: number): void;
  _allocateTargets(): THREE.WebGLRenderTarget;
  _lodMeshes: THREE.Mesh[];
  _blurMaterial: THREE.Material;
  _ggxMaterial: THREE.Material;
  _backgroundBox: THREE.Mesh | null;
}
