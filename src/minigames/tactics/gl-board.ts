/**
 * A tiny WebGL batcher for the Pixel tactics board (recs FIGHT-61): one shader, textured
 * quads in board pixels with a per-vertex tint, nearest-neighbour textures, premultiplied
 * alpha. Every `flush` is one `drawArrays`, so the board's frame is the map, the overlays and
 * the units: three draws at most. Lost contexts are rebuilt on restore.
 */

const VS = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_col;
uniform vec2 u_res;
varying vec2 v_uv;
varying vec4 v_col;
void main() {
  v_uv = a_uv;
  v_col = a_col;
  gl_Position = vec4(a_pos.x / u_res.x * 2.0 - 1.0, 1.0 - a_pos.y / u_res.y * 2.0, 0.0, 1.0);
}`;

const FS = `
precision mediump float;
uniform sampler2D u_tex;
varying vec2 v_uv;
varying vec4 v_col;
void main() {
  gl_FragColor = texture2D(u_tex, v_uv) * vec4(v_col.rgb, 1.0) * v_col.a;
}`;

/** Floats per vertex: x, y, u, v, r, g, b, a. */
const STRIDE = 8;

/** A texture fed from a canvas, re-uploaded when its owner bumps the version. */
export interface GlTexture {
  source: HTMLCanvasElement;
  version: number;
  tex: WebGLTexture | null;
  uploaded: number;
  width: number;
  height: number;
}

export class GlBoard {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram | null = null;
  private buf: WebGLBuffer | null = null;
  private res: WebGLUniformLocation | null = null;
  private data = new Float32Array(STRIDE * 6 * 64);
  private n = 0;
  private textures = new Set<GlTexture>();
  lost = false;
  /** drawArrays calls since the last `begin`. */
  draws = 0;

  private constructor(
    readonly canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
  ) {
    this.gl = gl;
    this.init();
    canvas.addEventListener('webglcontextlost', this.onLost);
    canvas.addEventListener('webglcontextrestored', this.onRestored);
  }

  /** A batcher on this canvas, or null where WebGL is missing (the Canvas 2D path then). */
  static create(canvas: HTMLCanvasElement): GlBoard | null {
    if (typeof WebGLRenderingContext === 'undefined') return null;
    const opts: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    };
    let gl: WebGLRenderingContext | null;
    try {
      gl =
        (canvas.getContext('webgl2', opts) as WebGLRenderingContext | null) ??
        (canvas.getContext('webgl', opts) as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }
    if (!gl) return null;
    const b = new GlBoard(canvas, gl);
    return b.prog ? b : null;
  }

  private onLost = (e: Event): void => {
    e.preventDefault();
    this.lost = true;
  };

  private onRestored = (): void => {
    this.lost = false;
    for (const t of this.textures) {
      t.tex = null;
      t.uploaded = -1;
    }
    this.init();
  };

  private init(): void {
    const gl = this.gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
    gl.bindAttribLocation(p, 0, 'a_pos');
    gl.bindAttribLocation(p, 1, 'a_uv');
    gl.bindAttribLocation(p, 2, 'a_col');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      this.prog = null;
      return;
    }
    this.prog = p;
    this.res = gl.getUniformLocation(p, 'u_res');
    this.buf = gl.createBuffer();
    gl.useProgram(p);
    gl.uniform1i(gl.getUniformLocation(p, 'u_tex'), 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    const bytes = STRIDE * 4;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, bytes, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, bytes, 8);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, bytes, 16);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  }

  /** A texture slot for a canvas (its pixels upload on first use and on each version bump). */
  texture(source: HTMLCanvasElement): GlTexture {
    const t: GlTexture = { source, version: 0, tex: null, uploaded: -1, width: 1, height: 1 };
    this.textures.add(t);
    return t;
  }

  release(t: GlTexture): void {
    if (t.tex && !this.lost) this.gl.deleteTexture(t.tex);
    t.tex = null;
    this.textures.delete(t);
  }

  /** Starts a frame: viewport to the canvas, cleared to a colour (0–1 rgb). */
  begin(r: number, g: number, b: number): void {
    const gl = this.gl;
    this.draws = 0;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(r, g, b, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.prog);
    gl.uniform2f(this.res, this.canvas.width, this.canvas.height);
  }

  /** Queues a quad: board rect, texel rect (u0 > u1 mirrors), tint and alpha. */
  quad(
    t: GlTexture,
    x: number,
    y: number,
    w: number,
    h: number,
    u0: number,
    v0: number,
    u1: number,
    v1: number,
    r = 1,
    g = 1,
    b = 1,
    a = 1,
  ): void {
    if (this.data.length < (this.n + 6) * STRIDE) {
      const grown = new Float32Array(this.data.length * 2);
      grown.set(this.data);
      this.data = grown;
    }
    const iw = 1 / t.width;
    const ih = 1 / t.height;
    const s0 = u0 * iw;
    const s1 = u1 * iw;
    const t0 = v0 * ih;
    const t1 = v1 * ih;
    const d = this.data;
    let o = this.n * STRIDE;
    const v = (px: number, py: number, s: number, tt: number) => {
      d[o] = px;
      d[o + 1] = py;
      d[o + 2] = s;
      d[o + 3] = tt;
      d[o + 4] = r;
      d[o + 5] = g;
      d[o + 6] = b;
      d[o + 7] = a;
      o += STRIDE;
    };
    v(x, y, s0, t0);
    v(x + w, y, s1, t0);
    v(x, y + h, s0, t1);
    v(x, y + h, s0, t1);
    v(x + w, y, s1, t0);
    v(x + w, y + h, s1, t1);
    this.n += 6;
  }

  /** Makes sure a texture's GPU copy matches its canvas (size included). */
  sync(t: GlTexture): void {
    t.width = t.source.width;
    t.height = t.source.height;
    if (t.tex && t.uploaded === t.version) return;
    const gl = this.gl;
    if (!t.tex) {
      t.tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } else gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.source);
    t.uploaded = t.version;
  }

  /** Draws everything queued since the last flush with one texture: one draw call. */
  flush(t: GlTexture): void {
    if (!this.n) return;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, this.data.subarray(0, this.n * STRIDE), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, this.n);
    this.draws++;
    this.n = 0;
  }

  /** Leaves the canvas transparent (the 3D board may take over) and frees the GPU side. */
  dispose(): void {
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
    if (this.lost) return;
    const gl = this.gl;
    for (const t of [...this.textures]) this.release(t);
    if (this.buf) gl.deleteBuffer(this.buf);
    if (this.prog) gl.deleteProgram(this.prog);
    this.buf = null;
    this.prog = null;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}
