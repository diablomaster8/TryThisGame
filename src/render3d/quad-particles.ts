import * as THREE from 'three';

/**
 * Camera-facing particle quads for the 3D Grove (art pass 2), in place of the square
 * `Points` sprites: each particle is one instance of a unit quad, turned in the screen
 * plane, drawn as an analytic shape with a soft edge (a soft dot, a four-point star, a
 * heart with a toon rim, a leaf with its midrib, a rain streak, a firefly's glow) and
 * faded by its own alpha. Additive and normal particles share one draw through
 * premultiplied alpha (an additive one writes no alpha).
 *
 * Three ways to move, all in the one program (`uMode`):
 * - `cpu`: positions written each frame (bursts, falling leaves);
 * - `fall`: written once, falling and wrapping in the vertex shader (rain, snow), so a
 *   downpour costs no CPU at all; the mesh follows the camera's focus;
 * - `hover`: written once, wandering and pulsing in the shader (fireflies).
 */
export type QuadShape = 'dot' | 'star' | 'heart' | 'leaf' | 'streak' | 'glow' | 'ring';

const SHAPE: Record<QuadShape, number> = {
  dot: 0,
  star: 1,
  heart: 2,
  leaf: 3,
  streak: 4,
  glow: 5,
  ring: 6,
};

export type QuadMode = 'cpu' | 'fall' | 'hover';
const MODE: Record<QuadMode, number> = { cpu: 0, fall: 1, hover: 2 };

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uMode;
  uniform float uSpeed;
  uniform float uHeight;
  uniform float uSway;
  attribute vec3 iPos;
  attribute vec4 iCol;
  attribute vec4 iMisc; // size x, size y, rotation, shape (+10 when additive)
  varying vec2 vUv;
  varying vec4 vCol;
  varying float vShape;
  varying float vAdd;
  void main() {
    vec3 p = iPos;
    float alpha = iCol.a;
    float ph = iPos.x * 3.17 + iPos.z * 1.73;
    if ( uMode > 0.5 && uMode < 1.5 ) {
      // Falling: each drop at its own speed, wrapping over the column's height.
      float rate = uSpeed * ( 0.8 + 0.4 * fract( ph * 7.13 ) );
      p.y = mod( iPos.y - uTime * rate, uHeight );
      p.x += sin( uTime * 0.9 + ph ) * uSway;
    } else if ( uMode > 1.5 ) {
      p += vec3( sin( uTime * 0.7 + ph ) * 0.6, sin( uTime * 1.3 + ph * 1.7 ) * 0.35, cos( uTime * 0.5 + ph ) * 0.6 );
      alpha *= 0.45 + 0.55 * max( sin( uTime * 2.3 + ph * 5.0 ), 0.0 );
    }
    vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
    float c = cos( iMisc.z );
    float s = sin( iMisc.z );
    vec2 q = position.xy * iMisc.xy;
    mvPosition.xy += vec2( c * q.x - s * q.y, s * q.x + c * q.y );
    gl_Position = projectionMatrix * mvPosition;
    vUv = position.xy * 2.0;
    vCol = vec4( iCol.rgb, alpha );
    vShape = mod( iMisc.w, 10.0 );
    vAdd = step( 9.5, iMisc.w );
  }
`;

const FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec4 vCol;
  varying float vShape;
  varying float vAdd;
  float dot2( vec2 v ) { return dot( v, v ); }
  float sdHeart( vec2 p ) {
    p.x = abs( p.x );
    if ( p.y + p.x > 1.0 ) return sqrt( dot2( p - vec2( 0.25, 0.75 ) ) ) - sqrt( 2.0 ) / 4.0;
    return sqrt( min( dot2( p - vec2( 0.0, 1.0 ) ), dot2( p - 0.5 * max( p.x + p.y, 0.0 ) ) ) ) * sign( p.x - p.y );
  }
  void main() {
    vec2 p = vUv;
    float r = length( p );
    float a = 0.0;
    vec3 col = vCol.rgb;
    if ( vShape < 0.5 ) {
      a = smoothstep( 1.0, 0.45, r );
    } else if ( vShape < 1.5 ) {
      float arms = max( 1.0 - abs( p.x ) * 7.0 - abs( p.y ) * 1.05, 0.0 )
                 + max( 1.0 - abs( p.y ) * 7.0 - abs( p.x ) * 1.05, 0.0 );
      a = clamp( arms + exp( -r * r * 9.0 ) * 0.8, 0.0, 1.0 );
    } else if ( vShape < 2.5 ) {
      float d = sdHeart( vec2( p.x * 0.78, p.y * 0.78 + 0.62 ) );
      a = smoothstep( 0.03, -0.03, d );
      col *= mix( 0.55, 1.0, smoothstep( -0.02, -0.1, d ) );
      col = mix( col, vec3( 1.0 ), smoothstep( 0.16, 0.0, length( p - vec2( -0.32, 0.22 ) ) ) * 0.7 );
    } else if ( vShape < 3.5 ) {
      float w = 0.5 * ( 1.0 - p.y * p.y );
      float d = abs( p.x ) - w;
      a = smoothstep( 0.06, -0.06, d ) * step( abs( p.y ), 0.98 );
      col *= 0.78 + 0.22 * smoothstep( 0.02, 0.1, abs( p.x ) ) * ( 0.85 + 0.15 * p.x );
    } else if ( vShape < 4.5 ) {
      a = exp( -p.x * p.x * 5.0 ) * smoothstep( 1.0, 0.1, abs( p.y ) );
    } else if ( vShape > 5.5 ) {
      a = smoothstep( 0.2, 0.0, abs( r - 0.8 ) );
    } else {
      a = exp( -r * r * 9.0 ) + exp( -r * r * 2.2 ) * 0.35;
      col *= 1.0 + exp( -r * r * 20.0 );
    }
    a = clamp( a * vCol.a, 0.0, 1.0 );
    if ( a < 0.004 ) discard;
    gl_FragColor = vec4( col * a, a * ( 1.0 - vAdd ) );
  }
`;

/** The clock every cloud reads (seconds); the scene advances it. */
export const PARTICLE_TIME = { value: 0 };

export class QuadCloud {
  readonly mesh: THREE.Mesh;
  readonly max: number;
  private readonly geo: THREE.InstancedBufferGeometry;
  private readonly pos: THREE.InstancedBufferAttribute;
  private readonly col: THREE.InstancedBufferAttribute;
  private readonly misc: THREE.InstancedBufferAttribute;
  readonly material: THREE.ShaderMaterial;
  /** Particles written since the last `flush` (cpu mode), or the full count (others). */
  n = 0;

  constructor(
    parent: THREE.Object3D,
    max: number,
    mode: QuadMode = 'cpu',
    o: { speed?: number; height?: number; sway?: number } = {},
  ) {
    this.max = max;
    const g = new THREE.InstancedBufferGeometry();
    const quad = new THREE.PlaneGeometry(1, 1);
    g.index = quad.index;
    g.setAttribute('position', quad.attributes.position!);
    this.pos = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    this.col = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4);
    this.misc = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4);
    if (mode === 'cpu')
      for (const a of [this.pos, this.col, this.misc]) a.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('iPos', this.pos);
    g.setAttribute('iCol', this.col);
    g.setAttribute('iMisc', this.misc);
    g.instanceCount = 0;
    this.geo = g;
    this.material = new THREE.ShaderMaterial({
      name: 'QuadParticles',
      uniforms: {
        uTime: PARTICLE_TIME,
        uMode: { value: MODE[mode] },
        uSpeed: { value: o.speed ?? 0 },
        uHeight: { value: o.height ?? 1 },
        uSway: { value: o.sway ?? 0 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    this.mesh = new THREE.Mesh(g, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;
    parent.add(this.mesh);
  }

  /** Write particle `i` (or the next one when `i` is omitted, in cpu mode). */
  set(
    x: number,
    y: number,
    z: number,
    c: { r: number; g: number; b: number },
    alpha: number,
    size: number,
    shape: QuadShape,
    o: { rot?: number; stretch?: number; additive?: boolean } = {},
    i = this.n++,
  ): void {
    if (i >= this.max) return;
    this.pos.setXYZ(i, x, y, z);
    this.col.setXYZW(i, c.r, c.g, c.b, alpha);
    this.misc.setXYZW(
      i,
      size,
      size * (o.stretch ?? 1),
      o.rot ?? 0,
      SHAPE[shape] + (o.additive ? 10 : 0),
    );
  }

  /** Draw what was written this frame (cpu mode) and start over. */
  flush(): void {
    const n = Math.min(this.n, this.max);
    this.n = 0;
    // Nothing alive and nothing drawn last frame: no upload at all (the usual frame).
    if (n === 0 && this.geo.instanceCount === 0) return;
    // Only the live range goes to the GPU, not the whole buffer.
    for (const a of [this.pos, this.col, this.misc]) {
      a.clearUpdateRanges();
      if (n) a.addUpdateRange(0, n * a.itemSize);
      a.needsUpdate = n > 0;
    }
    this.geo.instanceCount = n;
  }

  /** Upload once and draw `count` (fall and hover modes). */
  commit(count: number): void {
    this.pos.needsUpdate = true;
    this.col.needsUpdate = true;
    this.misc.needsUpdate = true;
    this.draw(count);
  }

  /** How many of the written particles to draw (rain thins with the weather). */
  draw(count: number): void {
    this.geo.instanceCount = Math.max(0, Math.min(count, this.max));
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.geo.dispose();
    this.material.dispose();
  }
}
