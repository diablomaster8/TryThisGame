import { openSky } from '../cave-bands';
import {
  ClampToEdgeWrapping,
  DataTexture,
  LinearFilter,
  RedFormat,
  UnsignedByteType,
  Vector4,
  type Material,
} from 'three';
import { DUNGEON, HOLLOW } from '../../config/tuning';
import { cellOf, exploredMask, type Floor } from '../../sim/dungeon';
import { fogBytes, sightRadius } from '../../sim/dungeon-sight';
import type { DungeonRun, Vec2 } from '../../sim/types';

/**
 * The Hollow's fog of war on the GPU (R0153), shared by both renderers: one byte per cell
 * (`fogBytes` from the sim's explored mask) in a small linear-filtered texture, and a
 * shader patch that multiplies a material's final colour by the byte under the fragment's
 * world position. Patching the cave's own materials (rather than laying a dark plane over
 * the floor) keeps tall walls and props dark too, so a zoomed-out view never reads the
 * layout. The texture refills only when the mask or the Keeper's cell changes.
 */
export class FogField {
  /** Shared by every patched material; `uFogOn` 0 leaves the colour alone (above ground). */
  readonly uniforms = {
    uFogTex: { value: blank() },
    /** World x and z of the floor's corner, and 1 / its width and depth. */
    uFogMap: { value: new Vector4(0, 0, 1, 1) },
    uFogOn: { value: 0 },
  };
  private floor: Floor | null = null;
  private bytes = new Uint8Array(1);
  private key = '';

  /** Size the texture for a floor (or clear it). */
  setFloor(f: Floor | null): void {
    this.floor = f;
    this.key = '';
    this.uniforms.uFogOn.value = 0;
    if (!f) return;
    const cell = DUNGEON.cell;
    this.uniforms.uFogMap.value.set(
      (-f.cols / 2) * cell,
      (-f.rows / 2) * cell,
      1 / (f.cols * cell),
      1 / (f.rows * cell),
    );
    const old = this.uniforms.uFogTex.value;
    if (old.image.width !== f.cols || old.image.height !== f.rows) {
      this.bytes = new Uint8Array(f.cols * f.rows);
      this.uniforms.uFogTex.value = texture(this.bytes, f.cols, f.rows);
      old.dispose();
    }
  }

  /** Per frame: refill from the run's mask when it or the Keeper's cell changed. */
  update(run: DungeonRun | null, keeper: Vec2): void {
    const f = this.floor;
    // Camps and fields lie under the open sky: no fog of war (R0147).
    if (!run || !f || openSky(f)) {
      this.uniforms.uFogOn.value = 0;
      return;
    }
    this.uniforms.uFogOn.value = 1;
    const kc = cellOf(f, keeper);
    const key = `${run.explored.length}:${run.explored}:${kc.x},${kc.y}`;
    if (key === this.key) return;
    this.key = key;
    fogBytes(exploredMask(run, f), f.cols, f.rows, kc, sightRadius(run), HOLLOW.fog, this.bytes);
    this.uniforms.uFogTex.value.needsUpdate = true;
  }

  /**
   * Make a material fog-aware. Built-in materials get the world position after
   * `project_vertex` (so instancing and vertex displacement are honoured) and the multiply
   * before `dithering_fragment`; a ShaderMaterial gets both at the end of `main`. The
   * program key gains a suffix so the fogged program never collides with the plain one.
   */
  patch<M extends Material>(m: M): M {
    if (m.userData.groveFog) return m;
    m.userData.groveFog = true;
    const key = m.customProgramCacheKey();
    const prev = m.onBeforeCompile;
    const u = this.uniforms;
    m.onBeforeCompile = function (this: Material, sh, r) {
      prev.call(this, sh, r);
      Object.assign(sh.uniforms, u);
      sh.vertexShader = patchVertex(sh.vertexShader);
      sh.fragmentShader = patchFragment(sh.fragmentShader);
    };
    m.customProgramCacheKey = () => `${key}|grove-fog`;
    m.needsUpdate = true;
    return m;
  }
}

const VERT_HEAD = 'varying vec2 vGroveFogXZ;\n';
const FRAG_HEAD = `varying vec2 vGroveFogXZ;
uniform sampler2D uFogTex;
uniform vec4 uFogMap;
uniform float uFogOn;
`;
const FRAG_MUL = `gl_FragColor.rgb *= mix( 1.0, texture2D( uFogTex, ( vGroveFogXZ - uFogMap.xy ) * uFogMap.zw ).r, uFogOn );`;

/** The vertex half of the patch (exported for the tests). */
export function patchVertex(src: string): string {
  if (src.includes('#include <project_vertex>'))
    return (
      VERT_HEAD +
      src.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        {
          vec4 groveFogP = vec4( transformed, 1.0 );
          #ifdef USE_INSTANCING
            groveFogP = instanceMatrix * groveFogP;
          #endif
          vGroveFogXZ = ( modelMatrix * groveFogP ).xz;
        }`,
      )
    );
  return VERT_HEAD + atEnd(src, 'vGroveFogXZ = ( modelMatrix * vec4( position, 1.0 ) ).xz;');
}

/** The fragment half of the patch (exported for the tests). */
export function patchFragment(src: string): string {
  if (src.includes('#include <dithering_fragment>'))
    return (
      FRAG_HEAD +
      src.replace('#include <dithering_fragment>', `${FRAG_MUL}\n#include <dithering_fragment>`)
    );
  return FRAG_HEAD + atEnd(src, FRAG_MUL);
}

/** Insert a line before the last closing brace (the end of `main`). */
function atEnd(src: string, line: string): string {
  const i = src.lastIndexOf('}');
  return i < 0 ? src : `${src.slice(0, i)}  ${line}\n${src.slice(i)}`;
}

function texture(data: Uint8Array, w: number, h: number): DataTexture {
  const t = new DataTexture(data, w, h, RedFormat, UnsignedByteType);
  // Rows are `cols` bytes, which need not be a multiple of four.
  t.unpackAlignment = 1;
  // Linear filtering softens the cell edges into a gentle fall-off.
  t.magFilter = LinearFilter;
  t.minFilter = LinearFilter;
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

function blank(): DataTexture {
  return texture(new Uint8Array([255]), 1, 1);
}
