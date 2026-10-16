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
      this.scene.environment?.dispose();
      this.scene.environment = this.pmrem.fromScene(this.envScene, 0.02).texture;
    }
    this.scene.environmentIntensity = night
      ? 0.12
      : weather === 'rain'
        ? 0.4
        : elevation < 15
          ? 0.7
          : 0.7;

    this.sun.color.set(night ? '#8fa8d8' : d.sunColor);
    this.sun.intensity = night
      ? 0.35
      : weather === 'rain'
        ? 0.5
        : THREE.MathUtils.lerp(1.2, 2.6, THREE.MathUtils.clamp(elevation / 30, 0, 1));
    this.sun.position.copy(this.sunDir).multiplyScalar(60).add(focus);
    this.sun.target.position.copy(focus);
    this.hemi.color.set(d.hemiColor);
    this.hemi.intensity = night ? 0.12 : weather === 'rain' ? 0.5 : 0.25;
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

  dispose(): void {
    this.pmrem.dispose();
    this.scene.environment?.dispose();
  }
}
