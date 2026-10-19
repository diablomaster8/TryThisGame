import * as THREE from 'three';
import { GROVE, GROVE3D } from '../config/tuning';
import { WATER_LEVEL, groveHeight } from './terrain';

/**
 * The pond, the stream and the waterfall, painted rather than physical. Each water mesh is
 * a fine grid carrying the depth of the bed under every vertex (from the same heightfield
 * the ground is built from), so the colour runs from a clear turquoise at the edge to deep
 * blue in the middle and a band of foam traces the real shoreline, broken and moving. The
 * ripples are smooth noise in the shader (no texture to tile or to show its pattern from
 * above), with light bands on their crests; the sky shows at grazing angles, and the sun's
 * glint is a hard-edged spark, as the toon creatures are. It is one cheap unlit pass with no
 * refraction target; the light level follows the sky (`update`). The waterfall is a sheet of
 * streaks falling at its own speed with foam where it lands.
 */
export interface GroveWater {
  materials: THREE.ShaderMaterial[];
  fall: THREE.ShaderMaterial;
  update(t: number, sun: THREE.DirectionalLight, hemi: THREE.HemisphereLight): void;
}

const look = GROVE3D.water;

/** Uniforms every water shares, so one update moves them all. */
function sharedUniforms(): Record<string, THREE.IUniform> {
  return {
    uTime: { value: 0 },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunColor: { value: new THREE.Color('#fff6e4') },
    uLight: { value: 1 },
    uSky: { value: new THREE.Color(look.sky) },
    uShallow: { value: new THREE.Color(look.shallow) },
    uDeep: { value: new THREE.Color(look.deep) },
    uFoam: { value: new THREE.Color(look.foam) },
  };
}

const VERT = /* glsl */ `
  attribute float depth;
  varying float vDepth;
  varying vec3 vWorld;
  varying vec2 vUv;
  #include <fog_pars_vertex>
  void main() {
    vDepth = depth;
    vUv = uv;
    vec4 world = modelMatrix * vec4( position, 1.0 );
    vWorld = world.xyz;
    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`;

const COMMON = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uLight;
  uniform vec3 uSky;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  uniform vec3 uFoam;
  varying float vDepth;
  varying vec3 vWorld;
  varying vec2 vUv;
  #include <common>
  #include <fog_pars_fragment>
  float wHash( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
  float wNoise( vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f * f * ( 3.0 - 2.0 * f );
    return mix( mix( wHash( i ), wHash( i + vec2( 1.0, 0.0 ) ), u.x ),
                mix( wHash( i + vec2( 0.0, 1.0 ) ), wHash( i + vec2( 1.0, 1.0 ) ), u.x ), u.y );
  }`;

const SURFACE_FRAG = /* glsl */ `
  ${COMMON}
  uniform float uFlow;
  uniform float uMinAlpha;
  uniform float uDeepAt;
  uniform float uFoamWidth;
  // Two noise layers drifting across each other; the stream's run downstream as well.
  float waves( vec2 p ) {
    return wNoise( p * 0.9 + vec2( uTime * 0.25, uTime * ( 0.18 + uFlow ) ) ) * 0.62
         + wNoise( p * 2.1 + vec2( -uTime * 0.31, uTime * ( 0.27 + uFlow * 1.6 ) ) ) * 0.38;
  }
  void main() {
    vec2 p = vWorld.xz;
    float h = waves( p );
    float hx = waves( p + vec2( 0.08, 0.0 ) );
    float hz = waves( p + vec2( 0.0, 0.08 ) );
    vec3 n = normalize( vec3( ( h - hx ) * 2.4, 1.0, ( h - hz ) * 2.4 ) );
    vec3 v = normalize( cameraPosition - vWorld );
    float deep = smoothstep( 0.0, uDeepAt, vDepth );
    vec3 col = mix( uShallow, uDeep, deep );
    // The sky at grazing angles, as water does.
    float fres = pow( 1.0 - max( dot( n, v ), 0.0 ), 4.0 );
    col = mix( col, uSky, fres * 0.55 );
    // Light bands on the ripples' crests, stepped like the creatures' shading.
    col += uSky * smoothstep( 0.66, 0.7, h ) * 0.16;
    // The sun's spark: a hard core with a little soft halo.
    vec3 r = reflect( -v, n );
    float s = pow( max( dot( r, uSunDir ), 0.0 ), 220.0 );
    col += uSunColor * ( step( 0.35, s ) * 1.1 + s * 0.4 );
    col *= uLight;
    // Foam along the shore: a band over the shallowest water, its edge broken by a moving
    // pattern and breathing in and out a little.
    float wobble = wNoise( p * 2.6 + uTime * 0.2 ) - 0.5;
    float edge = vDepth + wobble * 0.16 - sin( uTime * 1.3 + p.x * 0.8 + p.y * 0.6 ) * 0.015;
    float foam = 1.0 - smoothstep( uFoamWidth * 0.75, uFoamWidth, edge );
    col = mix( col, uFoam * clamp( uLight * 1.3, 0.35, 1.2 ), foam * 0.92 );
    gl_FragColor = vec4( col, max( max( mix( ${look.edgeAlpha.toFixed(3)}, 0.94, deep ), foam ), uMinAlpha ) );
    #include <fog_fragment>
  }`;

const FALL_FRAG = /* glsl */ `
  ${COMMON}
  void main() {
    // Streaks falling down the sheet at their own speed, white where they bunch up.
    float s1 = wNoise( vec2( vUv.x * 9.0, vUv.y * 2.5 + uTime * 2.6 ) );
    float s2 = wNoise( vec2( vUv.x * 17.0 + 3.1, vUv.y * 4.0 + uTime * 3.7 ) );
    float streak = smoothstep( 0.5, 0.75, s1 * 0.6 + s2 * 0.4 );
    vec3 col = mix( mix( uShallow, uDeep, 0.25 ), uFoam, streak * 0.85 );
    // A white lip at the top and churned white at the foot.
    float lip = smoothstep( 0.9, 1.0, vUv.y );
    float foot = 1.0 - smoothstep( 0.0, 0.16, vUv.y );
    col = mix( col, uFoam, max( lip, foot ) * 0.9 );
    // Thinner and clearer at the sides.
    float side = smoothstep( 0.0, 0.12, vUv.x ) * smoothstep( 1.0, 0.88, vUv.x );
    gl_FragColor = vec4( col * uLight, ( 0.8 + streak * 0.2 ) * side );
    #include <fog_fragment>
  }`;

function waterShader(
  shared: Record<string, THREE.IUniform>,
  frag: string,
  extra: Record<string, THREE.IUniform> = {},
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog), ...shared, ...extra },
    vertexShader: VERT,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    fog: true,
    side: THREE.DoubleSide,
  });
}

/** Depth of the bed under each vertex, from the ground's own heightfield. */
function withDepth(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const depth = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++)
    depth[i] = WATER_LEVEL - groveHeight(pos.getX(i), pos.getZ(i));
  geo.setAttribute('depth', new THREE.BufferAttribute(depth, 1));
  return geo;
}

/** A disc in rings, so the depth and the foam follow the bed across it. */
function disc(cx: number, cz: number, r: number, rings = 16, segs = 72): THREE.BufferGeometry {
  const verts: number[] = [cx, WATER_LEVEL, cz];
  const uvs: number[] = [0.5, 0.5];
  const idx: number[] = [];
  for (let i = 1; i <= rings; i++) {
    const rr = (r * i) / rings;
    for (let j = 0; j < segs; j++) {
      const a = (j / segs) * Math.PI * 2;
      verts.push(cx + Math.cos(a) * rr, WATER_LEVEL, cz + Math.sin(a) * rr);
      uvs.push(0.5 + (Math.cos(a) * i) / rings / 2, 0.5 + (Math.sin(a) * i) / rings / 2);
    }
  }
  const at = (ring: number, j: number) => (ring === 0 ? 0 : 1 + (ring - 1) * segs + (j % segs));
  for (let j = 0; j < segs; j++) idx.push(0, at(1, j + 1), at(1, j));
  for (let i = 1; i < rings; i++)
    for (let j = 0; j < segs; j++) {
      const a = at(i, j);
      const b = at(i, j + 1);
      const c = at(i + 1, j);
      const d = at(i + 1, j + 1);
      idx.push(a, b, d, a, d, c);
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  return withDepth(geo);
}

/** A ribbon of the given width along a polyline, `across` cells wide, at the water level. */
function ribbon(
  line: ReadonlyArray<{ x: number; z: number }>,
  width: number,
  across = 6,
): THREE.BufferGeometry {
  const pts = line.map((p) => new THREE.Vector3(p.x, WATER_LEVEL, p.z));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  const n = pts.length * 6;
  const verts: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  const cols = across + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = curve.getPoint(t);
    const d = curve.getTangent(t);
    const nx = -d.z;
    const nz = d.x;
    const half = width * 0.5 + 0.35;
    for (let k = 0; k < cols; k++) {
      const s = (k / across) * 2 - 1;
      verts.push(p.x + nx * half * s, WATER_LEVEL, p.z + nz * half * s);
      uvs.push(k / across, t * n * 0.4);
    }
    if (i < n)
      for (let k = 0; k < across; k++) {
        const a = i * cols + k;
        idx.push(a, a + 1, a + cols, a + 1, a + cols + 1, a + cols);
      }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  return withDepth(geo);
}

/**
 * One water surface's own settings: how fast its ripples run downstream, the least it
 * hides of its bed, the depth it reads as deep at, and how deep its shore foam reaches.
 */
function surface(o: {
  flow?: number;
  minAlpha?: number;
  deepAt?: number;
  foamWidth?: number;
}): Record<string, THREE.IUniform> {
  return {
    uFlow: { value: o.flow ?? 0 },
    uMinAlpha: { value: o.minAlpha ?? 0 },
    uDeepAt: { value: o.deepAt ?? look.deepAt },
    uFoamWidth: { value: o.foamWidth ?? look.foamWidth },
  };
}

/** Point the shared uniforms at this frame's clock, sun and sky; returns the light level. */
function follow(
  shared: Record<string, THREE.IUniform>,
  t: number,
  sun: THREE.DirectionalLight,
  hemi: THREE.HemisphereLight,
): number {
  shared.uTime!.value = t;
  (shared.uSunDir!.value as THREE.Vector3)
    .subVectors(sun.position, sun.target.position)
    .normalize();
  (shared.uSunColor!.value as THREE.Color)
    .copy(sun.color)
    .multiplyScalar(Math.min(1.5, sun.intensity * 0.5));
  // Unlit water follows the sky's light: full by day, a moonlit third at night.
  const light = THREE.MathUtils.clamp(sun.intensity * 0.22 + hemi.intensity * 0.75, 0.3, 1.1);
  shared.uLight!.value = light;
  return light;
}

/** A painted water surface on its own, for a minigame's channel. */
export interface PaintedWater {
  material: THREE.ShaderMaterial;
  update(t: number, sun: THREE.DirectionalLight, hemi: THREE.HemisphereLight): void;
}

/** `minAlpha` 1 makes a deep channel solid water (the race's swim strips hide their bed). */
export function paintedWater(flow = 0, minAlpha = 0): PaintedWater {
  const shared = sharedUniforms();
  return {
    material: waterShader(shared, SURFACE_FRAG, surface({ flow, minAlpha })),
    update: (t, sun, hemi) => void follow(shared, t, sun, hemi),
  };
}

/**
 * A straight channel of water `width` across (a plane lying in x by z after the caller's
 * rotation), its depth running from the banks to `depth` mid-channel, so foam lines both
 * banks.
 */
export function channelGeometry(
  length: number,
  width: number,
  depth: number,
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(length, width, 1, 10);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const d = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const across = Math.abs(pos.getY(i)) / (width / 2);
    d[i] = depth * Math.sqrt(Math.max(0, 1 - across * across));
  }
  geo.setAttribute('depth', new THREE.BufferAttribute(d, 1));
  return geo;
}

export function buildGroveWater(scene: THREE.Object3D): GroveWater {
  const shared = sharedUniforms();

  const pondMat = waterShader(shared, SURFACE_FRAG, surface({}));
  const pond = new THREE.Mesh(disc(GROVE.pond.x, GROVE.pond.z, GROVE.pond.r + 0.5), pondMat);
  scene.add(pond);

  // The stream runs: its ripples drift downstream on top of the pond's idle drift.
  const streamMat = waterShader(
    shared,
    SURFACE_FRAG,
    surface({ flow: -0.05, ...GROVE3D.water.stream }),
  );
  for (const line of [GROVE.river.inflow, GROVE.river.outflow])
    scene.add(new THREE.Mesh(ribbon(line, GROVE.river.width), streamMat));

  // The waterfall: a cascade that hugs the hillside from the top down to the inflow's first
  // pool (art pass 2: it was one flat sheet hanging through the air above the slope, which
  // read as a pane of glass). A ribbon follows the ground a hand above it, narrowing to the
  // stream's width as it lands; v runs 1 at the lip to 0 at the foot, as the shader wants.
  const wf = GROVE.waterfall;
  const first = GROVE.river.inflow[0]!;
  const fallMat = waterShader(shared, FALL_FRAG);
  const dx = first.x - wf.x;
  const dz = first.z - wf.z;
  const len = Math.hypot(dx, dz);
  const ax = -dz / len;
  const az = dx / len;
  const ALONG = 28;
  const pos: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  for (let j = 0; j <= ALONG; j++) {
    const t = j / ALONG;
    const cx = wf.x + dx * t;
    const cz = wf.z + dz * t;
    const w = THREE.MathUtils.lerp(wf.width, GROVE.river.width * 0.9, t);
    for (let i = 0; i <= 3; i++) {
      const u = i / 3;
      const x = cx + ax * (u - 0.5) * w;
      const z = cz + az * (u - 0.5) * w;
      // A little proud of the slope, and never under the pool it falls into.
      const y = Math.max(groveHeight(x, z) + 0.12 * (1 - t) + 0.05, WATER_LEVEL + 0.04);
      pos.push(x, y, z);
      uv.push(u, 1 - t);
    }
  }
  for (let j = 0; j < ALONG; j++)
    for (let i = 0; i < 3; i++) {
      const a0 = j * 4 + i;
      index.push(a0, a0 + 4, a0 + 1, a0 + 1, a0 + 4, a0 + 5);
    }
  const sheetGeo = new THREE.BufferGeometry();
  sheetGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  sheetGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  sheetGeo.setAttribute(
    'depth',
    new THREE.Float32BufferAttribute(new Array(pos.length / 3).fill(1), 1),
  );
  sheetGeo.setIndex(index);
  sheetGeo.computeVertexNormals();
  const sheet = new THREE.Mesh(sheetGeo, fallMat);
  sheet.renderOrder = 1;
  scene.add(sheet);
  // Churned water where it lands: foam that swells and settles.
  const foamMat = new THREE.MeshBasicMaterial({
    color: look.foam,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const foam = new THREE.Mesh(new THREE.CircleGeometry(1.4, 24), foamMat);
  foam.rotation.x = -Math.PI / 2;
  foam.position.set(first.x, WATER_LEVEL + 0.03, first.z);
  scene.add(foam);

  return {
    materials: [pondMat, streamMat],
    fall: fallMat,
    update(t, sun, hemi) {
      const light = follow(shared, t, sun, hemi);
      foamMat.color.set(look.foam).multiplyScalar(Math.max(light, 0.35));
      const swell = 1 + Math.sin(t * 2.1) * 0.06;
      foam.scale.set(swell, swell, 1);
    },
  };
}
