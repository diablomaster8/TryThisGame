import * as THREE from 'three';
import { CG4_E4 } from '../config/tuning-e4';

/**
 * K46, Logged In's boot-up, for both renderers: a full-screen overlay that starts as a
 * dark grid and resolves outward from the centre into the meadow, an ordered dither along
 * its edge so it reads as pixels. It is a plain quad in clip space with its own shader (the
 * terrain shader and the post chain stay as they are), drawn last with no depth, and it
 * removes itself from the draw list when the reveal is done. The grid's cell and the edge
 * dither follow the render target's height, so the low-res pixel view gets chunky cells.
 */
const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform float uProgress;
uniform vec2 uRes;
uniform vec3 uBase;
uniform vec3 uLine;
uniform vec3 uEdge;
varying vec2 vUv;
float bayer(vec2 p) {
  vec2 q = mod(floor(p), 4.0);
  float i = q.x + q.y * 4.0;
  // The 4x4 ordered-dither matrix, written out (no array indexing in GLSL ES 1.00 loops).
  float v = 0.0;
  if (i < 0.5) v = 0.0; else if (i < 1.5) v = 8.0; else if (i < 2.5) v = 2.0; else if (i < 3.5) v = 10.0;
  else if (i < 4.5) v = 12.0; else if (i < 5.5) v = 4.0; else if (i < 6.5) v = 14.0; else if (i < 7.5) v = 6.0;
  else if (i < 8.5) v = 3.0; else if (i < 9.5) v = 11.0; else if (i < 10.5) v = 1.0; else if (i < 11.5) v = 9.0;
  else if (i < 12.5) v = 15.0; else if (i < 13.5) v = 7.0; else if (i < 14.5) v = 13.0; else v = 5.0;
  return (v + 0.5) / 16.0;
}
void main() {
  vec2 px = vUv * uRes;
  float cell = max(8.0, uRes.y / 19.0);
  vec2 c = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float r = length(c) / 0.75;
  float edge = uProgress * 1.75 - r;
  float cover = bayer(px / max(1.0, floor(uRes.y / 270.0))) * 0.2;
  if (edge > cover) discard;
  vec2 g = abs(fract(px / cell) - 0.5);
  float line = step(0.5 - 1.6 / cell, max(g.x, g.y));
  vec3 col = mix(uBase, uLine, line * 0.85);
  float ring = 1.0 - smoothstep(0.0, 0.22, abs(edge));
  col = mix(col, uEdge, ring * (0.35 + 0.65 * line));
  gl_FragColor = vec4(col, 1.0);
}`;

export class BootOverlay {
  private readonly mesh: THREE.Mesh;
  private readonly mat: THREE.ShaderMaterial;

  constructor(parent: THREE.Object3D) {
    this.mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uProgress: { value: 0 },
        uRes: { value: new THREE.Vector2(960, 540) },
        uBase: { value: new THREE.Color(CG4_E4.boot.base) },
        uLine: { value: new THREE.Color(CG4_E4.boot.line) },
        uEdge: { value: new THREE.Color(CG4_E4.boot.edge) },
      },
      depthTest: false,
      depthWrite: false,
      transparent: false,
      toneMapped: false,
      fog: false,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 9999;
    this.mesh.visible = false;
    this.mesh.name = 'e4-boot';
    // The size of whatever is being drawn into (the low-res target in the pixel view).
    this.mesh.onBeforeRender = (renderer) => {
      const rt = renderer.getRenderTarget();
      const v = this.mat.uniforms.uRes!.value as THREE.Vector2;
      if (rt) v.set(rt.width, rt.height);
      else renderer.getDrawingBufferSize(v);
    };
    parent.add(this.mesh);
  }

  /** The reveal at `t` seconds into the scene: shown while it runs, hidden before and after. */
  set(t: number, still: boolean): void {
    const { seconds, hold } = CG4_E4.boot;
    const p = (t - hold) / seconds;
    const on = !still && t >= 0 && p < 1;
    this.mesh.visible = on;
    if (!on) return;
    const k = Math.max(0, p);
    this.mat.uniforms.uProgress!.value = 1 - Math.pow(1 - k, 2.2);
  }

  get visible(): boolean {
    return this.mesh.visible;
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mat.dispose();
  }
}
