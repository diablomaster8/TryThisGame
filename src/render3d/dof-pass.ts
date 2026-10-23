import * as THREE from 'three';
import type { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CG4_D4 } from '../config/tuning-d4';

/**
 * K21: depth of field for the close and over-the-shoulder story shots. One full-screen pass
 * straight after the scene's own draw, reading the depth that draw leaves in the composer's
 * target: each pixel past the focus distance (the speaker) is blurred by how far past it
 * is, with nine taps in two rings, so the busy background softens and the speaker stays
 * crisp. Pixels at the focus cost one depth read.
 *
 * It is off, and the depth textures are not even attached, on a phone unless `grove.dof` is
 * set to `on` (or the address has `?dof`); and it switches itself off while the frame rate
 * the pass measures is under `CG4_D4.dof.minFps`. Off, the composer skips it.
 */
const SHADER = {
  name: 'DepthOfField',
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    tDepth: { value: null as THREE.Texture | null },
    cameraNear: { value: 0.1 },
    cameraFar: { value: 1000 },
    uFocus: { value: 10 },
    uRamp: { value: CG4_D4.dof.ramp as number },
    uAmount: { value: 0 },
    uRadius: { value: CG4_D4.dof.radius as number },
    uTexel: { value: new THREE.Vector2(1 / 1024, 1 / 1024) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragmentShader: /* glsl */ `
    #include <common>
    #include <packing>
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float cameraNear;
    uniform float cameraFar;
    uniform float uFocus;
    uniform float uRamp;
    uniform float uAmount;
    uniform float uRadius;
    uniform vec2 uTexel;
    varying vec2 vUv;

    float cocAt( vec2 uv ) {
      float d = texture2D( tDepth, uv ).x;
      float dist = -perspectiveDepthToViewZ( d, cameraNear, cameraFar );
      return clamp( ( dist - uFocus ) / uRamp, 0.0, 1.0 ) * uAmount;
    }

    void main() {
      vec4 c = texture2D( tDiffuse, vUv );
      float coc = cocAt( vUv );
      if ( coc < 0.01 ) { gl_FragColor = c; return; }
      vec2 r = uTexel * uRadius * coc;
      vec3 sum = c.rgb;
      float wsum = 1.0;
      for ( int i = 0; i < 4; i++ ) {
        float a = 1.5708 * float( i ) + 0.7854;
        vec2 o = vec2( cos( a ), sin( a ) );
        // The outer ring, then an inner one half as far: two taps' worth of reach.
        vec2 p1 = vUv + o * r;
        vec2 p2 = vUv + o * r * 0.5;
        sum += texture2D( tDiffuse, p1 ).rgb + texture2D( tDiffuse, p2 ).rgb;
        wsum += 2.0;
      }
      gl_FragColor = vec4( sum / wsum, c.a );
    }`,
};

/** Whether this device gets the pass by default: not a phone, unless asked. */
function wanted(): boolean {
  try {
    const stored = localStorage.getItem('grove.dof');
    if (stored === 'on') return true;
    if (stored === 'off') return false;
  } catch {
    // Blocked storage: the default below stands.
  }
  try {
    if (new URLSearchParams(location.search).has('dof')) return true;
    const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    return !(coarse || innerWidth <= CG4_D4.dof.phoneWidth);
  } catch {
    return false;
  }
}

export class DofPass extends ShaderPass {
  /** Depth textures are attached to the composer's targets: the pass can run. */
  readonly available: boolean;
  private amount = 0;
  private fpsAvg = 60;
  private target = 0;

  private constructor(
    private readonly composer: EffectComposer,
    private readonly cam: THREE.PerspectiveCamera,
    available: boolean,
  ) {
    super(SHADER);
    this.available = available;
    this.enabled = false;
  }

  /**
   * Build the pass and put it straight after the scene's draw (call it right after adding the
   * RenderPass). On a device that does not get the pass nothing is attached.
   */
  static install(composer: EffectComposer, cam: THREE.PerspectiveCamera): DofPass {
    const available = wanted();
    const pass = new DofPass(composer, cam, available);
    if (available) {
      for (const t of [composer.renderTarget1, composer.renderTarget2]) {
        t.depthTexture = new THREE.DepthTexture(t.width, t.height);
      }
    }
    composer.addPass(pass);
    return pass;
  }

  /** Feed one frame's interval (ms): the pass measures its own frame rate. */
  tick(intervalMs: number): void {
    if (!(intervalMs > 0) || intervalMs > 250) return;
    this.fpsAvg += (1000 / intervalMs - this.fpsAvg) * 0.05;
  }

  /**
   * Say what the shot wants this frame: `close` is a close or over-the-shoulder shot, and
   * `focus` the distance from the camera to the speaker. `dt` is seconds; `instant` cuts.
   */
  setShot(close: boolean, focus: number, dt: number, instant: boolean): void {
    const c = CG4_D4.dof;
    const on = this.available && close && this.fpsAvg >= c.minFps;
    this.target = on ? 1 : 0;
    const step = instant ? 1 : Math.min(1, dt / c.easeS);
    this.amount += (this.target - this.amount) * step;
    if (Math.abs(this.target - this.amount) < 0.01) this.amount = this.target;
    this.enabled = this.amount > 0.01;
    const u = this.uniforms;
    u.uAmount!.value = this.amount;
    u.uFocus!.value = focus + c.focusPad;
    u.cameraNear!.value = this.cam.near;
    u.cameraFar!.value = this.cam.far;
  }

  override render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
    deltaTime: number,
    maskActive: boolean,
  ): void {
    // The scene's draw went into `readBuffer`, with its depth beside it.
    const depth = readBuffer.depthTexture;
    if (!depth) return;
    this.uniforms.tDepth!.value = depth;
    // The blur is sized for a 720 px tall frame and grows with the render target.
    this.uniforms.uRadius!.value = (CG4_D4.dof.radius * readBuffer.height) / 720;
    (this.uniforms.uTexel!.value as THREE.Vector2).set(1 / readBuffer.width, 1 / readBuffer.height);
    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive);
  }

  /** Whether the pass is blurring this frame (for the stage inspector and tests). */
  get active(): boolean {
    return this.enabled;
  }

  /** The composer this pass belongs to. */
  get owner(): EffectComposer {
    return this.composer;
  }
}
