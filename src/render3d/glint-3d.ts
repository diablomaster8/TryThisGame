import * as THREE from 'three';
import { DRESS_D } from '../config/tuning-d';

/**
 * The story items' star glints in Full 3D (campaign graphics H11): one instanced mesh, one
 * draw call, a camera-facing four-point star card over each glinting item. With motion it
 * bobs by `DRESS_D.glint.bob` and twinkles; with reduced motion it is the same star held
 * still, so the cue is its shape and never a flicker. The vertex shader turns each card to
 * the camera from the instance's position, so the mesh needs no per-frame camera work.
 */
export interface GlintPoint {
  /** The item's foot, in world units. */
  x: number;
  y: number;
  z: number;
  /** Where the star hangs, relative to the foot. */
  at: readonly [number, number, number];
}

/** The bob's height at `t` for an item standing at (x, z); 0 when `still`. */
export function glintBob(x: number, z: number, t: number, still: boolean): number {
  if (still) return 0;
  return Math.sin(t * DRESS_D.glint.speed + x * 1.7 + z * 2.3) * DRESS_D.glint.bob;
}

function starTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    const glow = g.createRadialGradient(32, 32, 0, 32, 32, 30);
    glow.addColorStop(0, 'rgba(255,248,214,0.55)');
    glow.addColorStop(1, 'rgba(255,248,214,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, 64, 64);
    // A hard four-point star: long arms north, east, south and west, short between.
    g.fillStyle = '#fffbe8';
    g.beginPath();
    const R = 29;
    const r = 6;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 - Math.PI / 2;
      const rad = i % 2 === 0 ? R : r;
      g.lineTo(32 + Math.cos(a) * rad, 32 + Math.sin(a) * rad);
    }
    g.closePath();
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Glints {
  readonly mesh: THREE.InstancedMesh;
  private readonly off: THREE.InstancedBufferAttribute;
  private readonly mat: THREE.ShaderMaterial;
  private readonly tex: THREE.CanvasTexture;
  private readonly m = new THREE.Matrix4();

  constructor(max = DRESS_D.glint.max) {
    this.tex = starTexture();
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: this.tex },
        uTime: { value: 0 },
        uStill: { value: 0 },
        uSize: { value: DRESS_D.glint.size },
        uTwinkle: { value: DRESS_D.glint.twinkle },
        uBob: { value: DRESS_D.glint.bob },
        uSpeed: { value: DRESS_D.glint.speed },
      },
      vertexShader: /* glsl */ `
        uniform float uTime, uStill, uSize, uTwinkle, uBob, uSpeed;
        attribute vec3 aOff;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 foot = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float ph = foot.x * 1.7 + foot.z * 2.3;
          float live = 1.0 - uStill;
          foot.xyz += aOff;
          foot.y += live * sin(uTime * uSpeed + ph) * uBob;
          float tw = 1.0 + live * uTwinkle * sin(uTime * 3.1 + ph * 1.3);
          vec4 mv = modelViewMatrix * foot;
          mv.xy += position.xy * uSize * tw;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        varying vec2 vUv;
        void main() {
          vec4 c = texture2D(uMap, vUv);
          gl_FragColor = vec4(c.rgb * 1.6, c.a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    });
    const geo = new THREE.PlaneGeometry(1, 1);
    this.off = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    this.off.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aOff', this.off);
    this.mesh = new THREE.InstancedMesh(geo, this.mat, max);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
    this.mesh.name = 'story-glints';
  }

  /** Lay the stars out for this frame. `time` is the shader clock; `still` is reduced motion. */
  set(points: readonly GlintPoint[], time: number, still: boolean): void {
    const n = Math.min(points.length, this.mesh.instanceMatrix.count);
    for (let i = 0; i < n; i++) {
      const p = points[i]!;
      this.m.makeTranslation(p.x, p.y, p.z);
      this.mesh.setMatrixAt(i, this.m);
      this.off.setXYZ(i, p.at[0], p.at[1], p.at[2]);
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.off.needsUpdate = true;
    this.mat.uniforms.uTime!.value = time;
    this.mat.uniforms.uStill!.value = still ? 1 : 0;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mat.dispose();
    this.tex.dispose();
  }
}
