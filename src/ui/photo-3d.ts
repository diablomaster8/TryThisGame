import * as THREE from 'three';
import { NAMES } from '../config/strings';
import { PHOTO3D_TEXT as T } from '../config/strings-photo3d';
import { PHOTO_STICKER_GLYPHS } from '../config/strings-look';
import { ALBUM } from '../config/tuning-look';
import { PHOTO3D } from '../config/tuning-photo3d';
import type { Game } from '../game';
import { addPhoto } from '../platform/photo-album';
import { reducedMotion } from '../platform/motion';
import {
  clampCam,
  FACE_SET,
  formation,
  PHOTO_FACES,
  PHOTO_POSES,
  rigPose,
  yawToward,
  type PhotoCam,
  type PhotoFace,
  type PhotoPose,
} from '../render3d/photo-cam';
import type { Nubbin } from '../sim/types';
import { button, el } from './dom';
import {
  drawFrame,
  drawStickers,
  filterCss,
  filterPixels,
  PHOTO_FILTERS,
  PHOTO_FRAMES,
  pixelate,
  stickerAt,
  type PhotoFilter,
  type PhotoFrame,
  type PhotoSticker,
} from './photo-look';
import './photo-3d.css';

/** The photo mode's sticker glyphs: the album's, plus the emote ball's plain ball and spiral. */
const GLYPHS = [...PHOTO_STICKER_GLYPHS.slice(0, 8), '●', '@'];

/** Save a finished photo: the download, and the album with a small thumbnail (R0425). */
export function savePhotoPng(c: HTMLCanvasElement, ids: string[], caption: string): void {
  const a = document.createElement('a');
  a.href = c.toDataURL('image/png');
  const t = document.createElement('canvas');
  t.width = ALBUM.thumbPx;
  t.height = Math.round((c.height / c.width) * ALBUM.thumbPx);
  const tc = t.getContext('2d');
  if (tc) {
    tc.imageSmoothingEnabled = true;
    tc.drawImage(c, 0, 0, t.width, t.height);
    void addPhoto({
      atWallMs: Date.now(),
      nubbinIds: ids,
      caption,
      thumb: t.toDataURL('image/png'),
      full: a.href,
    });
  }
  a.download = `${NAMES.game.toLowerCase()}-photo.png`;
  a.click();
}

/** Golden frame (LOOK-55): a finished book tab grants it, once and for good. */
export function goldenUnlocked(g: Game | null): boolean {
  return (g?.world.bookTabs?.length ?? 0) > 0;
}

function select<V extends string>(
  label: string,
  values: readonly V[],
  names: Record<string, string>,
  onChange: (v: V) => void,
): { wrap: HTMLLabelElement; input: HTMLSelectElement } {
  const wrap = el('label', 'photo3d-field');
  wrap.append(el('span', undefined, label));
  const input = el('select');
  for (const v of values) {
    const o = el('option', undefined, names[v] ?? v);
    o.value = v;
    input.appendChild(o);
  }
  input.addEventListener('change', () => onChange(input.value as V));
  wrap.appendChild(input);
  return { wrap, input };
}

function range(
  label: string,
  min: number,
  max: number,
  step: number,
  onInput: (v: number) => void,
): { wrap: HTMLLabelElement; input: HTMLInputElement; out: HTMLSpanElement } {
  const wrap = el('label', 'photo3d-field');
  const out = el('span', 'photo3d-out');
  wrap.append(el('span', undefined, label), out);
  const input = el('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.addEventListener('input', () => onInput(Number(input.value)));
  wrap.appendChild(input);
  return { wrap, input, out };
}

function check(label: string, onChange: (on: boolean) => void) {
  const wrap = el('label', 'photo3d-check');
  const input = el('input');
  input.type = 'checkbox';
  input.addEventListener('change', () => onChange(input.checked));
  wrap.append(input, el('span', undefined, label));
  return { wrap, input };
}

/**
 * R0412 (LOOK-56): the real 3D photo mode. Over the live Full 3D view: a free camera (drag to
 * orbit, pinch or wheel to zoom, two fingers to tilt, sliders for tilt, zoom and roll), the
 * subject's pose, face and gaze, a group of up to eight in a row or a circle, filters,
 * outlines, frames (the golden one once a book tab is finished), stickers, a soft background
 * and a time-of-day slider. Snap draws one 2× frame of the scene, lays the filter, frame and
 * stickers over it and offers it as a PNG. The sim goes on underneath; the subjects are only
 * drawn held where the mode puts them.
 */
export class Photo3dMode {
  private readonly root: HTMLDivElement;
  private readonly tint: HTMLDivElement;
  private readonly overlay: HTMLCanvasElement;
  private readonly pad: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly hint: HTMLParagraphElement;
  private readonly preview: HTMLDivElement;
  private readonly previewImg: HTMLImageElement;
  private readonly tiltR;
  private readonly zoomR;
  private readonly rollR;
  private readonly hourR;
  private readonly poseS;
  private readonly faceS;
  private readonly groupS;
  private readonly filterS;
  private readonly frameS;
  private readonly lookC;
  private readonly toonC;
  private readonly dofC;
  private readonly note: HTMLParagraphElement;

  private cam: PhotoCam = {
    target: { x: 0, y: 0, z: 0 },
    yaw: 0,
    tiltDeg: PHOTO3D.camera.tiltStart,
    dist: 3.5,
    rollDeg: 0,
    dof: false,
  };
  private pose: PhotoPose = 'own';
  private face: PhotoFace = 'own';
  private lookCam = false;
  private group: 'one' | 'row' | 'circle' = 'one';
  private filter: PhotoFilter = 'none';
  private frame: PhotoFrame = 'none';
  private toon = true;
  private hour: number | null = null;
  private stickers: PhotoSticker[] = [];
  private ids: string[] = [];
  private subject: string | null = null;
  private readonly lookPt = new THREE.Vector3();
  private shot: HTMLCanvasElement | null = null;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private drag: { sticker: number; moved: number } | null = null;
  private keys: ((e: KeyboardEvent) => void) | null = null;
  private resize: (() => void) | null = null;
  private readonly hud: HTMLElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly classic: () => void,
  ) {
    this.root = el('div', 'photo3d');
    this.root.hidden = true;
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-label', T.title);
    this.tint = el('div', 'photo3d-tint');
    this.overlay = el('canvas', 'photo3d-overlay');
    this.pad = el('div', 'photo3d-pad');
    this.pad.setAttribute('aria-label', T.help);
    this.hint = el('p', 'photo3d-hint', T.showHint);
    const top = el('div', 'photo3d-top');
    top.append(
      button(T.close, () => this.close(), 'btn'),
      button(T.hideUi, () => this.setUi(false), 'btn'),
      button('🖼', () => this.openClassic(), 'btn'),
      button(T.snap, () => this.snap(), 'btn btn-primary photo3d-snap'),
    );
    (top.children[2] as HTMLButtonElement).title = 'Card photo';
    this.panel = el('div', 'photo3d-panel');
    const k = PHOTO3D.camera;
    this.tiltR = range(T.tilt, k.tiltMin, k.tiltMax, 1, (v) => this.setCam({ tiltDeg: v }));
    this.zoomR = range(T.zoom, k.distMin, k.distMax, 0.1, (v) =>
      this.setCam({ dist: k.distMin + k.distMax - v }),
    );
    this.rollR = range(T.roll, -k.rollMax, k.rollMax, 1, (v) => this.setCam({ rollDeg: v }));
    this.hourR = range(T.hour, -0.5, 24, 0.5, (v) => this.setHour(v < 0 ? null : v));
    this.poseS = select(T.pose, PHOTO_POSES, T.poses, (v) => {
      this.pose = v;
      this.restage(false);
    });
    this.faceS = select(T.face, PHOTO_FACES, T.faces, (v) => {
      this.face = v;
      this.restage(false);
    });
    this.groupS = select(T.group, ['one', 'row', 'circle'] as const, T.groups, (v) => {
      this.group = v;
      this.restage(true);
    });
    this.filterS = select(T.filter, PHOTO_FILTERS, T.filters, (v) => {
      this.filter = v;
      this.tint.style.setProperty('backdrop-filter', filterCss(v));
      this.tint.style.setProperty('-webkit-backdrop-filter', filterCss(v));
      this.note.hidden = v !== 'pixelate';
    });
    this.frameS = select(T.frame, PHOTO_FRAMES, T.frames, (v) => {
      this.frame = v;
      this.paintOverlay();
    });
    this.lookC = check(T.lookAtCamera, (on) => {
      this.lookCam = on;
      this.restage(false);
    });
    this.toonC = check(T.toon, (on) => {
      this.toon = on;
      this.game()?.scene3d?.setPhotoOutlines(on);
    });
    this.dofC = check(T.dof, (on) => this.setCam({ dof: on }));
    this.note = el('p', 'help', T.pixelateNote);
    this.note.hidden = true;
    const stickers = el('div', 'photo3d-stickers');
    stickers.setAttribute('aria-label', T.stickers);
    for (const g of GLYPHS)
      stickers.appendChild(button(g, () => this.addSticker(g), 'btn btn-small photo3d-sticker'));
    stickers.appendChild(button(T.clear, () => this.clearStickers(), 'btn btn-small'));
    const rows = el('div', 'photo3d-grid');
    rows.append(
      this.groupS.wrap,
      this.poseS.wrap,
      this.faceS.wrap,
      this.filterS.wrap,
      this.frameS.wrap,
      this.tiltR.wrap,
      this.zoomR.wrap,
      this.rollR.wrap,
      this.hourR.wrap,
    );
    const checks = el('div', 'photo3d-checks');
    checks.append(this.lookC.wrap, this.toonC.wrap, this.dofC.wrap);
    this.panel.append(
      el('p', 'help', T.help),
      rows,
      checks,
      this.note,
      el('p', 'help', T.stickerHelp),
      stickers,
    );
    this.preview = el('div', 'photo3d-preview');
    this.preview.hidden = true;
    this.previewImg = el('img');
    this.previewImg.alt = T.preview;
    const pv = el('div', 'photo3d-preview-card');
    pv.append(
      el('h2', undefined, T.preview),
      this.previewImg,
      button(T.save, () => this.save(), 'btn btn-primary'),
      button(T.back, () => this.backFromPreview(), 'btn'),
    );
    this.preview.appendChild(pv);
    this.root.append(this.tint, this.overlay, this.pad, top, this.panel, this.hint, this.preview);
    // On the page itself, over the HUD's own stacking (its top bar would sit over ours); the
    // HUD hides while the mode is open, so the view is the photo.
    this.hud = parent;
    (parent.ownerDocument.body ?? parent).appendChild(this.root);
    this.bindPad();
  }

  isOpen(): boolean {
    return !this.root.hidden;
  }

  /** Open over the live 3D view, framing `subjectId` (or the first hatched Nubbin). */
  open(subjectId: string | null): boolean {
    const g = this.game();
    const s = g?.scene3d;
    if (!g || !s) return false;
    const n =
      (subjectId ? g.world.nubbins.find((x) => x.id === subjectId) : undefined) ??
      g.world.nubbins.find((x) => x.stage !== 'egg' && !!s.photoSpot(x.id));
    if (!n || !s.photoSpot(n.id)) return false;
    this.subject = n.id;
    const start = s.photoStart();
    this.cam = {
      target: { x: start.target.x, y: start.target.y, z: start.target.z },
      yaw: start.yaw,
      tiltDeg: PHOTO3D.camera.tiltStart,
      dist: 3.5,
      rollDeg: 0,
      dof: false,
    };
    this.pose = 'own';
    this.face = 'own';
    this.lookCam = false;
    this.group = 'one';
    this.filter = 'none';
    this.frame = 'none';
    this.toon = true;
    this.hour = null;
    this.stickers = [];
    this.syncControls();
    this.tint.style.removeProperty('backdrop-filter');
    this.tint.style.removeProperty('-webkit-backdrop-filter');
    this.note.hidden = true;
    this.dofC.input.disabled = !s.dofAvailable;
    (this.dofC.wrap.lastChild as HTMLElement).textContent = s.dofAvailable ? T.dof : T.dofOff;
    const golden = this.frameS.input.querySelector<HTMLOptionElement>('option[value="golden"]');
    if (golden) {
      golden.disabled = !goldenUnlocked(g);
      golden.textContent = golden.disabled ? `${T.frames.golden} 🔒` : (T.frames.golden ?? '');
      golden.title = golden.disabled ? T.goldenLocked : '';
    }
    this.restage(true);
    s.photo = this.cam;
    this.root.hidden = false;
    this.hud.style.visibility = 'hidden';
    this.preview.hidden = true;
    this.setUi(true);
    g.send({ kind: 'photoTaken', species: n.species });
    this.keys = (e) => this.onKey(e);
    window.addEventListener('keydown', this.keys, true);
    this.resize = () => this.paintOverlay();
    window.addEventListener('resize', this.resize);
    this.paintOverlay();
    (this.root.querySelector('.photo3d-snap') as HTMLButtonElement | null)?.focus({
      preventScroll: true,
    });
    return true;
  }

  close(): void {
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.hud.style.visibility = '';
    const s = this.game()?.scene3d;
    if (s) {
      s.photo = null;
      s.photoSubjects.clear();
      s.setPhotoHour(null);
      s.setPhotoOutlines(null);
    }
    if (this.keys) window.removeEventListener('keydown', this.keys, true);
    if (this.resize) window.removeEventListener('resize', this.resize);
    this.keys = this.resize = null;
    this.pointers.clear();
    this.drag = null;
  }

  private openClassic(): void {
    this.close();
    this.classic();
  }

  /** Keys while open: Escape backs out; every other key stays away from the Grove's controls. */
  private onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (!this.preview.hidden) this.backFromPreview();
      else this.close();
    }
    e.stopPropagation();
  }

  private setUi(on: boolean): void {
    this.root.classList.toggle('ui-hidden', !on);
    this.hint.hidden = on;
  }

  private setCam(p: Partial<PhotoCam>): void {
    Object.assign(this.cam, p);
    clampCam(this.cam);
    this.updateLook();
    this.syncControls();
  }

  private setHour(h: number | null): void {
    this.hour = h;
    this.game()?.scene3d?.setPhotoHour(h);
    this.hourR.out.textContent = h === null ? T.hourNow : T.hourAt(h);
  }

  private syncControls(): void {
    const k = PHOTO3D.camera;
    this.tiltR.input.value = String(Math.round(this.cam.tiltDeg));
    this.tiltR.out.textContent = `${Math.round(this.cam.tiltDeg)}°`;
    this.zoomR.input.value = String(k.distMin + k.distMax - this.cam.dist);
    this.zoomR.out.textContent = `${(this.cam.dist / 3).toFixed(1)} m`;
    this.rollR.input.value = String(Math.round(this.cam.rollDeg));
    this.rollR.out.textContent = `${Math.round(this.cam.rollDeg)}°`;
    this.hourR.input.value = String(this.hour ?? -0.5);
    this.hourR.out.textContent = this.hour === null ? T.hourNow : T.hourAt(this.hour);
    this.poseS.input.value = this.pose;
    this.faceS.input.value = this.face;
    this.groupS.input.value = this.group;
    this.filterS.input.value = this.filter;
    this.frameS.input.value = this.frame;
    this.lookC.input.checked = this.lookCam;
    this.toonC.input.checked = this.toon;
    this.dofC.input.checked = this.cam.dof;
  }

  /** The camera's spot, for the eyes to follow ("Look at the camera"). */
  private updateLook(): void {
    const c = this.cam;
    const t = THREE.MathUtils.degToRad(c.tiltDeg);
    this.lookPt.set(
      c.target.x + Math.sin(c.yaw) * Math.cos(t) * c.dist,
      c.target.y + Math.sin(t) * c.dist,
      c.target.z + Math.cos(c.yaw) * Math.cos(t) * c.dist,
    );
  }

  /** Who is in the shot, nearest the subject first, up to eight. */
  private cast(g: Game): Nubbin[] {
    const s = g.scene3d!;
    const main = g.world.nubbins.find((n) => n.id === this.subject);
    if (!main) return [];
    if (this.group === 'one') return [main];
    const others = g.world.nubbins
      .filter((n) => n.id !== main.id && n.stage !== 'egg' && n.stage !== 'cocoon')
      .filter((n) => !!s.photoSpot(n.id))
      .sort(
        (a, b) =>
          Math.hypot(a.pos.x - main.pos.x, a.pos.z - main.pos.z) -
          Math.hypot(b.pos.x - main.pos.x, b.pos.z - main.pos.z),
      );
    return [main, ...others].slice(0, PHOTO3D.group.max);
  }

  /**
   * Put the subjects where the mode holds them, in their pose and face. `place` lays out
   * the formation again and reframes the camera on it (a new group); otherwise only the
   * pose, face and gaze change.
   */
  private restage(place: boolean): void {
    const g = this.game();
    const s = g?.scene3d;
    if (!g || !s) return;
    const subjects = s.photoSubjects;
    const face = FACE_SET[this.face];
    const pose = rigPose(this.pose);
    const look = this.lookCam ? this.lookPt : null;
    if (place) {
      subjects.clear();
      const cast = this.cast(g);
      const spot = s.photoSpot(this.subject ?? '');
      const centre = spot ? { x: spot.feet.x, z: spot.feet.z } : (cast[0]?.pos ?? { x: 0, z: 0 });
      const kind = this.group === 'circle' ? 'circle' : 'row';
      const at =
        cast.length === 1
          ? [{ x: centre.x, z: centre.z }]
          : formation(kind, cast.length, centre, this.cam.yaw);
      // The camera's spot on the ground, for the faces to turn to.
      const cx = centre.x + Math.sin(this.cam.yaw) * 10;
      const cz = centre.z + Math.cos(this.cam.yaw) * 10;
      let mx = 0;
      let mz = 0;
      cast.forEach((n, i) => {
        const p = at[i]!;
        mx += p.x / cast.length;
        mz += p.z / cast.length;
        const yaw =
          this.group === 'circle' && i > 0
            ? Math.atan2(p.x - centre.x, p.z - centre.z)
            : yawToward(p.x, p.z, cx, cz);
        subjects.set(n.id, { x: p.x, z: p.z, yaw, wave: false, face: null, look: null });
      });
      this.ids = cast.map((n) => n.id);
      const span = cast.length > 1 ? (cast.length - 1) * PHOTO3D.group.spacing : 0;
      const tall = spot ? Math.max(0.6, spot.head.y - spot.feet.y) : 1;
      this.cam.target = {
        x: mx,
        y: s.groundAt(mx, mz) + Math.min(PHOTO3D.camera.lookUp, tall * 0.6),
        z: mz,
      };
      // A tall phone screen is narrow: a row needs the camera farther back to fit across.
      const wide = Math.max(1, 1 / ((innerWidth / Math.max(1, innerHeight)) * 1.2));
      this.cam.dist = this.group === 'one' ? 2.2 + tall * 1.4 : 2.5 + span * 0.9 * wide;
      clampCam(this.cam);
      this.updateLook();
      this.syncControls();
    }
    for (const sub of subjects.values()) {
      if (pose) sub.pose = pose;
      else delete sub.pose;
      sub.wave = this.pose === 'wave';
      sub.face = face;
      sub.look = look;
    }
  }

  private bindPad(): void {
    const p = this.pad;
    const share = (e: PointerEvent) => {
      const r = this.overlay.getBoundingClientRect();
      return { u: (e.clientX - r.left) / r.width, v: (e.clientY - r.top) / r.height, r };
    };
    p.addEventListener('pointerdown', (e) => {
      try {
        p.setPointerCapture(e.pointerId);
      } catch {
        // A pointer the browser no longer tracks: follow it without capture.
      }
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 1) {
        const { u, v, r } = share(e);
        const size = PHOTO3D.stickerSize * Math.min(r.width, r.height);
        this.drag = { sticker: stickerAt(this.stickers, u, v, r.width, r.height, size), moved: 0 };
      } else this.drag = null;
    });
    p.addEventListener('pointermove', (e) => {
      const was = this.pointers.get(e.pointerId);
      if (!was) return;
      const dx = e.clientX - was.x;
      const dy = e.clientY - was.y;
      const k = PHOTO3D.gesture;
      if (this.pointers.size === 1) {
        if (this.drag) this.drag.moved += Math.hypot(dx, dy);
        if (this.drag && this.drag.sticker >= 0) {
          const { u, v } = share(e);
          const st = this.stickers[this.drag.sticker];
          if (st) {
            st.u = Math.min(1, Math.max(0, u));
            st.v = Math.min(1, Math.max(0, v));
          }
          this.paintOverlay();
        } else if (!this.drag || this.drag.moved > k.tapPx) {
          this.setCam({
            yaw: this.cam.yaw - dx * k.yawPerPx,
            tiltDeg: this.cam.tiltDeg + dy * k.tiltPerPx,
          });
        }
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.entries()].map(([id, v]) =>
          id === e.pointerId ? null : v,
        );
        const other = a ?? b;
        if (other) {
          const before = Math.hypot(was.x - other.x, was.y - other.y);
          const after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
          const ratio = before > 4 ? after / before : 1;
          // Pinch zooms; the two fingers moving up or down together tilt (half each).
          this.setCam({
            dist: this.cam.dist / ratio,
            tiltDeg: this.cam.tiltDeg + (dy * k.tiltPerPx) / 2,
          });
        }
      }
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    });
    const up = (e: PointerEvent) => {
      if (!this.pointers.has(e.pointerId)) return;
      this.pointers.delete(e.pointerId);
      const d = this.drag;
      this.drag = null;
      if (!d || d.moved > PHOTO3D.gesture.tapPx) return;
      // A tap: takes a sticker off, or brings the hidden controls back.
      if (d.sticker >= 0) {
        this.stickers.splice(d.sticker, 1);
        this.paintOverlay();
      } else if (this.root.classList.contains('ui-hidden')) this.setUi(true);
    };
    p.addEventListener('pointerup', up);
    p.addEventListener('pointercancel', up);
    p.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.setCam({ dist: this.cam.dist * Math.pow(PHOTO3D.gesture.wheelStep, e.deltaY / 100) });
      },
      { passive: false },
    );
    this.hint.addEventListener('click', () => this.setUi(true));
  }

  private addSticker(glyph: string): void {
    if (this.stickers.length >= PHOTO3D.stickerMax) this.stickers.shift();
    // A loose spiral out from the middle so a row of taps does not stack.
    const i = this.stickers.length;
    const a = i * 2.4;
    const r = 0.06 + i * 0.025;
    this.stickers.push({ glyph, u: 0.5 + Math.cos(a) * r, v: 0.4 + Math.sin(a) * r });
    this.paintOverlay();
  }

  private clearStickers(): void {
    this.stickers = [];
    this.paintOverlay();
  }

  /** The live frame and stickers, over the 3D canvas at its own size. */
  private paintOverlay(): void {
    const canvas = this.game()?.scene3d?.renderer.domElement;
    const r = canvas?.getBoundingClientRect();
    const o = this.overlay;
    if (r && r.width > 0) {
      for (const e of [o, this.tint]) {
        e.style.left = `${r.left}px`;
        e.style.top = `${r.top}px`;
        e.style.width = `${r.width}px`;
        e.style.height = `${r.height}px`;
      }
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round((r?.width ?? innerWidth) * dpr));
    const h = Math.max(1, Math.round((r?.height ?? innerHeight) * dpr));
    if (o.width !== w || o.height !== h) {
      o.width = w;
      o.height = h;
    }
    const ctx = o.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    drawFrame(ctx, this.frame, w, h);
    drawStickers(ctx, this.stickers, w, h, PHOTO3D.stickerSize * Math.min(w, h));
  }

  /** Draw the photo: a 2× frame of the scene, then the filter, frame and stickers on top. */
  private snap(): void {
    const g = this.game();
    const s = g?.scene3d;
    if (!g || !s) return;
    const raw = s.photoShot(PHOTO3D.shot.scale, PHOTO3D.shot.maxSide);
    if (!raw) {
      this.hint.textContent = T.noScene;
      return;
    }
    const w = raw.width;
    const h = raw.height;
    const ctx = raw.getContext('2d');
    if (!ctx) return;
    if (this.filter === 'pixelate') pixelate(raw, Math.max(3, Math.round(Math.min(w, h) / 110)));
    else if (this.filter !== 'none') {
      const img = ctx.getImageData(0, 0, w, h);
      filterPixels(img.data, this.filter, Math.round(g.world.timeMs) % 9973);
      ctx.putImageData(img, 0, 0);
    }
    drawFrame(ctx, this.frame, w, h);
    drawStickers(ctx, this.stickers, w, h, PHOTO3D.stickerSize * Math.min(w, h));
    this.shot = raw;
    this.previewImg.src = raw.toDataURL('image/png');
    this.preview.hidden = false;
    if (!reducedMotion()) this.root.classList.add('flash');
    window.setTimeout(() => this.root.classList.remove('flash'), 200);
  }

  private save(): void {
    const g = this.game();
    if (!this.shot || !g) return;
    const names = this.ids
      .map((id) => g.world.nubbins.find((n) => n.id === id)?.name)
      .filter((x): x is string => !!x);
    savePhotoPng(this.shot, this.ids, T.caption(names));
    this.backFromPreview();
    this.hint.textContent = T.saved;
    this.hint.hidden = false;
    window.setTimeout(() => {
      this.hint.textContent = T.showHint;
      this.hint.hidden = !this.root.classList.contains('ui-hidden');
    }, 2000);
  }

  private backFromPreview(): void {
    this.preview.hidden = true;
    this.shot = null;
  }
}
