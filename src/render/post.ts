import {
  HalfFloatType,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type WebGLRenderer,
} from 'three';

/**
 * The HD-2D pass. The scene is rendered to a low-res target, then one full-screen
 * shader adds a soft bloom on bright pixels, a gentle tilt-shift blur toward the top
 * and bottom rows, a vignette and a colour grade for the time of day. Everything runs
 * at frame resolution (about 540 rows), so it costs almost nothing on a phone. The scene
 * target is half float, so dark palette colours keep their steps through the linear stage,
 * and the pass ends with the sRGB encode the renderer would otherwise do itself.
 */
/**
 * Split-tone (campaign graphics 2, H11, M10), set per frame by package y's pixel dressing:
 * 0 is the plain tint multiply; 1 sends shadows to a cool blue and keeps the warm tint on
 * the highlights, so a dawn grade does not push the ground's hue.
 */
export const POST_SPLIT = { value: 0 };

export interface PostSettings {
  bloom: number;
  tilt: number;
  vignette: number;
  /** Grade tint and how much of it to mix in. */
  tint: Vector3;
  tintAmount: number;
}

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D tDiffuse;
uniform vec2 texel;
uniform float bloom;
uniform float tilt;
uniform float vignette;
uniform vec3 tint;
uniform float tintAmount;
uniform float split;
varying vec2 vUv;

vec3 sampleBlur(vec2 uv, float r) {
  vec3 c = vec3(0.0);
  c += texture2D(tDiffuse, uv + vec2(-r, -r) * texel).rgb;
  c += texture2D(tDiffuse, uv + vec2( r, -r) * texel).rgb;
  c += texture2D(tDiffuse, uv + vec2(-r,  r) * texel).rgb;
  c += texture2D(tDiffuse, uv + vec2( r,  r) * texel).rgb;
  c += texture2D(tDiffuse, uv + vec2( 0, -r) * texel).rgb;
  c += texture2D(tDiffuse, uv + vec2( 0,  r) * texel).rgb;
  c += texture2D(tDiffuse, uv + vec2(-r,  0) * texel).rgb;
  c += texture2D(tDiffuse, uv + vec2( r,  0) * texel).rgb;
  return c / 8.0;
}

void main() {
  vec3 base = texture2D(tDiffuse, vUv).rgb;
  // Tilt-shift: blur grows toward the top and bottom edges.
  float edge = abs(vUv.y - 0.5) * 2.0;
  float blurAmt = smoothstep(0.55, 1.0, edge) * tilt;
  vec3 blurred = sampleBlur(vUv, 3.0);
  vec3 col = mix(base, blurred, blurAmt);
  // Bloom: bright neighbours bleed a little.
  vec3 glow = sampleBlur(vUv, 4.0);
  float lum = dot(glow, vec3(0.299, 0.587, 0.114));
  col += glow * smoothstep(0.55, 1.0, lum) * bloom;
  // Grade.
  vec3 tone = tint;
  if (split > 0.0) {
    float l = dot(col, vec3(0.299, 0.587, 0.114));
    tone = mix(tint, mix(vec3(0.9, 0.98, 1.1), tint, smoothstep(0.18, 0.62, l)), split);
  }
  col = mix(col, col * tone, tintAmount);
  // Vignette.
  vec2 d = vUv - 0.5;
  float v = 1.0 - dot(d, d) * vignette;
  col *= clamp(v, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
  // The scene target holds linear light; the screen wants sRGB. Without this step the
  // palette came out dark and murky (review C, item 7).
  #include <colorspace_fragment>
}`;

export class PostPass {
  private target: WebGLRenderTarget;
  private readonly material: ShaderMaterial;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  enabled = true;

  constructor(width: number, height: number) {
    this.target = this.makeTarget(width, height);
    this.material = new ShaderMaterial({
      uniforms: {
        tDiffuse: { value: this.target.texture },
        texel: { value: new Vector2(1 / width, 1 / height) },
        bloom: { value: 0.35 },
        tilt: { value: 0.6 },
        vignette: { value: 0.35 },
        tint: { value: new Vector3(1, 1, 1) },
        tintAmount: { value: 0 },
        split: POST_SPLIT,
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
    });
    this.scene.add(new Mesh(new PlaneGeometry(2, 2), this.material));
  }

  private makeTarget(width: number, height: number): WebGLRenderTarget {
    const t = new WebGLRenderTarget(Math.max(1, width), Math.max(1, height), {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: true,
      stencilBuffer: false,
      type: HalfFloatType,
    });
    return t;
  }

  resize(width: number, height: number): void {
    this.target.dispose();
    this.target = this.makeTarget(width, height);
    this.material.uniforms.tDiffuse!.value = this.target.texture;
    (this.material.uniforms.texel!.value as Vector2).set(1 / width, 1 / height);
  }

  apply(s: Partial<PostSettings>): void {
    const u = this.material.uniforms;
    if (s.bloom !== undefined) u.bloom!.value = s.bloom;
    if (s.tilt !== undefined) u.tilt!.value = s.tilt;
    if (s.vignette !== undefined) u.vignette!.value = s.vignette;
    if (s.tint) (u.tint!.value as Vector3).copy(s.tint);
    if (s.tintAmount !== undefined) u.tintAmount!.value = s.tintAmount;
  }

  /** Render `scene` through the pass to the screen. */
  render(renderer: WebGLRenderer, scene: Scene, camera: OrthographicCamera): void {
    if (!this.enabled) {
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
      return;
    }
    renderer.setRenderTarget(this.target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.target.dispose();
    this.material.dispose();
  }
}
