import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { GROVE3D } from '../config/tuning';
import type { Daylight } from '../render/daylight';
import type { WeatherKind } from '../sim/types';

/**
 * The sky, the sun and the light they give the 3D Grove, driven by the same Daylight
 * the pixel mode dims its sprites with. The sun's height follows the hour; the
 * environment map is rebuilt from the sky only when the sun has moved enough to
 * matter, because a PMREM bake costs a few milliseconds.
 */
export class GroveSky {
  readonly sky = new Sky();
  readonly sun = new THREE.DirectionalLight('#fff6e4', 2.4);
  readonly hemi = new THREE.HemisphereLight('#cfe0ff', '#3a5a2a', 0.3);
  readonly fog: THREE.FogExp2;
  private readonly sunDir = new THREE.Vector3(0, 1, 0);
  private readonly pmrem: THREE.PMREMGenerator;
  private readonly envScene = new THREE.Scene();
  private readonly envSky: Sky;
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
    this.sky.scale.setScalar(900);
    scene.add(this.sky);
    this.envSky = new Sky();
    this.envSky.scale.setScalar(900);
    this.envScene.add(this.envSky);
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

  /** Apply the hour and the sim's daylight and weather; re-bakes the sky when needed. */
  set(hour: number, d: Daylight, weather: WeatherKind, focus: THREE.Vector3): void {
    const elevation = GroveSky.elevationAt(hour);
    this.elevationDeg = elevation;
    const night = elevation < -2;
    // Sunlight sweeps east to west; at night the moon stands in for it, low and blue.
    const azimuth = 100 + ((hour - 6) / 12) * 140;
    const lit = night ? 25 : Math.max(3, elevation);
    this.sunDir.setFromSphericalCoords(
      1,
      THREE.MathUtils.degToRad(90 - lit),
      THREE.MathUtils.degToRad(night ? 300 : azimuth),
    );
    const u = this.sky.material.uniforms;
    const skySun = this.sunDir.clone();
    if (night) skySun.y = -0.08;
    u.sunPosition!.value.copy(skySun);
    u.turbidity!.value = weather === 'rain' ? 14 : elevation < 15 ? 9 : 3.5;
    u.rayleigh!.value = weather === 'rain' ? 1.0 : elevation < 15 ? 3.2 : 1.6;
    u.mieCoefficient!.value = weather === 'rain' ? 0.05 : elevation < 15 ? 0.02 : 0.006;
    u.mieDirectionalG!.value = 0.85;
    const eu = this.envSky.material.uniforms;
    for (const k of ['sunPosition', 'turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG'])
      if (k === 'sunPosition') eu[k]!.value.copy(u[k]!.value);
      else eu[k]!.value = u[k]!.value;

    if (Math.abs(elevation - this.bakedElevation) > 2.5 || weather !== this.bakedWeather) {
      this.bakedElevation = elevation;
      this.bakedWeather = weather;
      if (this.warmed) this.bake();
      else this.bakeWanted = true;
    }
    // The sky map is soft fill only: at its old 0.7 it flooded every rough surface with the
    // sky's pale blue and washed the meadow to mint. The hemisphere carries the fill now,
    // green from the ground and blue from above, which keeps shapes and colours.
    this.scene.environmentIntensity = night
      ? 0.18
      : weather === 'rain'
        ? 0.35
        : elevation < 15
          ? 0.45
          : 0.38;

    this.sun.color.set(night ? '#8fa8d8' : d.sunColor);
    this.sun.intensity = night
      ? 0.6
      : weather === 'rain'
        ? 0.5
        : THREE.MathUtils.lerp(1.3, 2.9, THREE.MathUtils.clamp(elevation / 30, 0, 1));
    this.sun.position.copy(this.sunDir).multiplyScalar(60).add(focus);
    this.sun.target.position.copy(focus);
    this.hemi.color.set(d.hemiColor);
    this.hemi.intensity = night ? 0.32 : 0.6;
    const fogColor = night
      ? '#1a2238'
      : weather === 'rain'
        ? '#9aa6ad'
        : elevation < 15
          ? '#e8b58a'
          : '#c9dcf0';
    this.fog.color.set(fogColor);
    this.fog.density = weather === 'rain' ? 0.016 : elevation < 15 ? 0.009 : 0.006;
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
