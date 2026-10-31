import * as THREE from 'three';
import { EMOTE_SHAPES, type EmoteShape } from '../render/sprites/emote';
import { C, PALETTE } from '../render/sprites/palette';

/**
 * The emote ball over a Nubbin's head, drawn as smooth vector art for the 3D Grove (art
 * pass 2): the same shapes and colours as the pixel sheet (`render/sprites/emote.ts`),
 * painted with canvas paths at 128 px, a soft shading gradient and a round dark outline,
 * and filtered with mipmaps instead of nearest, so the ball stays crisp and round at any
 * zoom. Frame 1 bobs a little, as the pixel frame does.
 */
const S = 128;
const hex = (i: number): string => PALETTE[i]!;
const OUTLINE = hex(C.darkPlum);

function round(g: CanvasRenderingContext2D, width: number): void {
  g.lineJoin = 'round';
  g.lineCap = 'round';
  g.lineWidth = width;
}

/** Fill the current path with a top-lit gradient of `base`, then outline it. */
function paint(g: CanvasRenderingContext2D, base: string, cy: number, r: number): void {
  const grad = g.createRadialGradient(S / 2 - r * 0.35, cy - r * 0.45, r * 0.1, S / 2, cy, r * 1.3);
  const c = new THREE.Color(base);
  const light = c.clone().lerp(new THREE.Color('#ffffff'), 0.45);
  const dark = c.clone().multiplyScalar(0.78);
  grad.addColorStop(0, `#${light.getHexString()}`);
  grad.addColorStop(0.55, base);
  grad.addColorStop(1, `#${dark.getHexString()}`);
  g.fillStyle = grad;
  g.fill();
  round(g, 7);
  g.strokeStyle = OUTLINE;
  g.stroke();
}

/** A stroke drawn twice, wide and dark under narrow and coloured: a lettered outline. */
function inked(g: CanvasRenderingContext2D, color: string, width: number): void {
  round(g, width + 8);
  g.strokeStyle = OUTLINE;
  g.stroke();
  round(g, width);
  g.strokeStyle = color;
  g.stroke();
}

/** The neutral ball's saturated yellow, its highlight and rim (LOOK-17). */
const BALL = { base: '#ffd800', light: '#fff7a8', rim: '#d6a400' };

function shine(g: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  g.beginPath();
  g.ellipse(x, y, r, r * 0.7, -0.6, 0, Math.PI * 2);
  g.fillStyle = 'rgba(255,255,255,0.85)';
  g.fill();
}

function draw(g: CanvasRenderingContext2D, shape: EmoteShape, frame: number, tint: string): void {
  const cx = S / 2;
  const cy = S / 2 + (frame === 1 ? 6 : 0);
  g.beginPath();
  switch (shape) {
    case 'ball': {
      g.arc(cx, cy, 26, 0, Math.PI * 2);
      if (tint !== hex(C.sunYellow)) {
        paint(g, tint, cy, 26);
        shine(g, cx - 9, cy - 10, 7);
        break;
      }
      const grad = g.createRadialGradient(cx - 9, cy - 11, 2, cx, cy, 30);
      grad.addColorStop(0, BALL.light);
      grad.addColorStop(0.5, BALL.base);
      grad.addColorStop(1, BALL.rim);
      g.fillStyle = grad;
      g.fill();
      round(g, 7);
      g.strokeStyle = OUTLINE;
      g.stroke();
      shine(g, cx - 9, cy - 10, 7);
      break;
    }
    case 'heart':
      g.moveTo(cx, cy + 32);
      g.bezierCurveTo(cx - 44, cy + 4, cx - 40, cy - 30, cx - 18, cy - 30);
      g.bezierCurveTo(cx - 6, cy - 30, cx, cy - 20, cx, cy - 14);
      g.bezierCurveTo(cx, cy - 20, cx + 6, cy - 30, cx + 18, cy - 30);
      g.bezierCurveTo(cx + 40, cy - 30, cx + 44, cy + 4, cx, cy + 32);
      g.closePath();
      paint(g, hex(C.rose), cy, 34);
      shine(g, cx - 20, cy - 16, 7);
      break;
    case 'spiral': {
      g.arc(cx, cy, 30, 0, Math.PI * 2);
      paint(g, tint, cy, 30);
      g.beginPath();
      for (let i = 0; i <= 60; i++) {
        const a = (i / 60) * Math.PI * 4.2;
        const r = 2 + (i / 60) * 21;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      round(g, 6);
      g.strokeStyle = OUTLINE;
      g.stroke();
      break;
    }
    case 'fruit':
      // TECH-01: a red apple with a stalk and a leaf.
      g.arc(cx, cy + 4, 30, 0, Math.PI * 2);
      paint(g, hex(C.rose), cy + 4, 30);
      g.beginPath();
      g.moveTo(cx, cy - 24);
      g.lineTo(cx + 3, cy - 40);
      inked(g, hex(C.darkBark), 6);
      g.beginPath();
      g.ellipse(cx + 16, cy - 36, 12, 6, -0.4, 0, Math.PI * 2);
      paint(g, hex(C.leaf), cy - 36, 12);
      break;
    case 'exclaim':
      g.roundRect(cx - 9, cy - 38, 18, 48, 9);
      paint(g, hex(C.ember), cy - 14, 26);
      g.beginPath();
      g.arc(cx, cy + 26, 10, 0, Math.PI * 2);
      paint(g, hex(C.ember), cy + 26, 10);
      break;
    case 'question':
      g.arc(cx, cy - 16, 17, Math.PI * 1.05, Math.PI * 0.45, false);
      g.quadraticCurveTo(cx, cy - 2, cx, cy + 10);
      inked(g, tint, 12);
      g.beginPath();
      g.arc(cx, cy + 30, 8, 0, Math.PI * 2);
      paint(g, tint, cy + 30, 8);
      break;
    case 'halo':
      // A pale cyan-white ring with a gold rim, tipped toward the camera (LOOK-17).
      g.ellipse(cx, cy, 40, 17, 0, 0, Math.PI * 2);
      round(g, 20);
      g.strokeStyle = OUTLINE;
      g.stroke();
      round(g, 14);
      g.strokeStyle = '#e0a820';
      g.stroke();
      round(g, 8);
      g.strokeStyle = '#cfefff';
      g.stroke();
      break;
    case 'spiky': {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? 40 : 22;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      // Eight spikes on a deep purple core, each tipped red (LOOK-17).
      paint(g, '#3a1a4a', cy, 40);
      for (let i = 0; i < 16; i += 2) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        g.beginPath();
        g.arc(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, 6, 0, Math.PI * 2);
        g.fillStyle = '#c8304a';
        g.fill();
      }
      g.beginPath();
      g.arc(cx, cy, 20, 0, Math.PI * 2);
      paint(g, '#4a2460', cy, 20);
      shine(g, cx - 7, cy - 8, 5);
      break;
    }
    case 'zz':
      g.moveTo(cx - 30, cy - 26);
      g.lineTo(cx - 4, cy - 26);
      g.lineTo(cx - 30, cy);
      g.lineTo(cx - 4, cy);
      inked(g, hex(C.pale), 8);
      g.beginPath();
      g.moveTo(cx + 2, cy + 6);
      g.lineTo(cx + 30, cy + 6);
      g.lineTo(cx + 2, cy + 34);
      g.lineTo(cx + 30, cy + 34);
      inked(g, hex(C.pale), 8);
      break;
    case 'star':
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? 40 : 11;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      paint(g, hex(C.pale), cy, 40);
      g.beginPath();
      g.moveTo(cx - 16, cy - 16);
      g.lineTo(cx + 16, cy + 16);
      g.moveTo(cx - 16, cy + 16);
      g.lineTo(cx + 16, cy - 16);
      round(g, 4);
      g.strokeStyle = hex(C.lilacGrey);
      g.stroke();
      break;
    case 'puff':
      // Three grey lumps blown out sideways: a huff (lane A r8).
      g.beginPath();
      g.arc(cx - 18, cy + 8, 20, 0, Math.PI * 2);
      g.arc(cx + 8, cy - 8, 24, 0, Math.PI * 2);
      g.arc(cx + 26, cy + 14, 16, 0, Math.PI * 2);
      paint(g, hex(C.greyLight), cy, 34);
      break;
    case 'note':
      // A quaver: a round head and a flagged stem (lane A r8).
      g.beginPath();
      g.ellipse(cx - 12, cy + 22, 16, 12, -0.4, 0, Math.PI * 2);
      paint(g, hex(C.violet), cy + 22, 16);
      g.beginPath();
      g.moveTo(cx + 2, cy + 20);
      g.lineTo(cx + 2, cy - 36);
      g.quadraticCurveTo(cx + 30, cy - 26, cx + 26, cy - 4);
      inked(g, hex(C.violet), 8);
      break;
    // Lane A r10 (R0548, R0540): the new moods, the chat's pictures and the families' signs.
    case 'drop':
      g.moveTo(cx, cy - 38);
      g.bezierCurveTo(cx + 8, cy - 16, cx + 26, cy, cx + 24, cy + 14);
      g.arc(cx, cy + 14, 24, 0, Math.PI);
      g.bezierCurveTo(cx - 26, cy, cx - 8, cy - 16, cx, cy - 38);
      g.closePath();
      paint(g, hex(C.skyDeep), cy + 8, 28);
      shine(g, cx - 9, cy + 6, 6);
      break;
    case 'bulb':
      g.arc(cx, cy - 8, 28, 0, Math.PI * 2);
      paint(g, hex(C.sunYellow), cy - 8, 28);
      shine(g, cx - 10, cy - 18, 7);
      g.beginPath();
      g.roundRect(cx - 13, cy + 18, 26, 18, 5);
      paint(g, hex(C.greyLight), cy + 26, 14);
      break;
    case 'dots':
      for (let i = 0; i < 3; i++) {
        g.beginPath();
        g.arc(cx - 30 + i * 30, cy + 6, 11, 0, Math.PI * 2);
        const lit = i === frame + 1 || (frame === 0 && i === 0);
        paint(g, lit ? '#ffffff' : hex(C.lilacGrey), cy + 6, 11);
      }
      break;
    case 'sparkle': {
      const star = (x: number, y: number, r: number): void => {
        g.beginPath();
        g.moveTo(x, y - r);
        g.quadraticCurveTo(x, y, x + r, y);
        g.quadraticCurveTo(x, y, x, y + r);
        g.quadraticCurveTo(x, y, x - r, y);
        g.quadraticCurveTo(x, y, x, y - r);
        g.closePath();
        paint(g, hex(C.sunYellow), y, r);
      };
      star(cx, cy, 40);
      star(cx + (frame === 0 ? 30 : -30), cy - 30, 14);
      break;
    }
    case 'smirk':
      g.arc(cx, cy, 30, 0, Math.PI * 2);
      paint(g, hex(C.violet), cy, 30);
      g.beginPath();
      g.moveTo(cx - 16, cy - 8);
      g.lineTo(cx - 4, cy - 8);
      g.moveTo(cx + 6, cy - 6);
      g.lineTo(cx + 16, cy - 14);
      round(g, 6);
      g.strokeStyle = OUTLINE;
      g.stroke();
      g.beginPath();
      g.moveTo(cx - 12, cy + 14);
      g.quadraticCurveTo(cx + 6, cy + 18, cx + 18, cy + 6);
      round(g, 6);
      g.strokeStyle = '#ffffff';
      g.stroke();
      break;
    case 'zzbig': {
      const z = (x: number, y: number, w: number, col: string): void => {
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + w, y);
        g.lineTo(x, y + w);
        g.lineTo(x + w, y + w);
        inked(g, col, 7);
      };
      z(cx - 40, cy + 18, 16, hex(C.pale));
      z(cx - 14, cy - 4, 22, hex(C.pale));
      z(cx + 14, cy - 38, 28, '#ffffff');
      break;
    }
    case 'droop':
      // A soft ball sagging at the bottom, a drip running off it (never a broken heart).
      g.moveTo(cx - 26, cy);
      g.bezierCurveTo(cx - 26, cy - 34, cx + 26, cy - 34, cx + 26, cy);
      g.bezierCurveTo(cx + 30, cy + 24, cx - 30, cy + 24, cx - 26, cy);
      g.closePath();
      paint(g, hex(C.lilacGrey), cy, 28);
      g.beginPath();
      g.ellipse(cx + 18, cy + 30, 5, 8, 0, 0, Math.PI * 2);
      paint(g, hex(C.skyDeep), cy + 30, 8);
      break;
    case 'toyball':
      g.arc(cx, cy, 30, 0, Math.PI * 2);
      paint(g, '#ffffff', cy, 30);
      g.beginPath();
      g.moveTo(cx - 30, cy);
      g.quadraticCurveTo(cx, cy - 20, cx + 30, cy);
      g.quadraticCurveTo(cx, cy + 14, cx - 30, cy);
      g.fillStyle = hex(C.rose);
      g.fill();
      g.beginPath();
      g.arc(cx, cy, 30, 0, Math.PI * 2);
      round(g, 7);
      g.strokeStyle = OUTLINE;
      g.stroke();
      break;
    case 'keeper':
      g.arc(cx, cy + 8, 26, 0, Math.PI * 2);
      paint(g, hex(C.cream), cy + 8, 26);
      g.beginPath();
      g.roundRect(cx - 40, cy - 16, 80, 10, 5);
      g.roundRect(cx - 20, cy - 38, 40, 24, 6);
      paint(g, hex(C.roseDeep), cy - 20, 30);
      for (const dx of [-9, 9]) {
        g.beginPath();
        g.arc(cx + dx, cy + 8, 4, 0, Math.PI * 2);
        g.fillStyle = OUTLINE;
        g.fill();
      }
      break;
    case 'cloud':
      g.arc(cx - 20, cy + 2, 18, 0, Math.PI * 2);
      g.arc(cx + 4, cy - 10, 24, 0, Math.PI * 2);
      g.arc(cx + 26, cy + 6, 16, 0, Math.PI * 2);
      paint(g, '#f2f4f8', cy, 34);
      g.beginPath();
      g.ellipse(cx - 2, cy + 32, 5, 8, 0, 0, Math.PI * 2);
      paint(g, hex(C.skyDeep), cy + 32, 8);
      break;
    case 'pspark':
      g.moveTo(cx, cy - 22);
      g.lineTo(cx + 6, cy - 6);
      g.lineTo(cx + 22, cy);
      g.lineTo(cx + 6, cy + 6);
      g.lineTo(cx, cy + 22);
      g.lineTo(cx - 6, cy + 6);
      g.lineTo(cx - 22, cy);
      g.lineTo(cx - 6, cy - 6);
      g.closePath();
      paint(g, frame === 0 ? hex(C.sunYellow) : hex(C.sunLight), cy, 22);
      break;
    case 'dblink':
      if (frame === 0) {
        g.rect(cx - 14, cy - 14, 28, 28);
        paint(g, hex(C.leaf), cy, 16);
      } else {
        g.rect(cx - 5, cy - 5, 10, 10);
        paint(g, hex(C.leafDeep), cy, 6);
      }
      break;
    case 'none':
      break;
  }
}

/** Every emote frame as its own texture, keyed `shape:frame`; `shadow` uses the plum tint. */
export function vectorEmotes(shadow: boolean): Map<string, THREE.Texture> {
  const tint = hex(shadow ? C.plum : C.sunYellow);
  const out = new Map<string, THREE.Texture>();
  for (const shape of EMOTE_SHAPES)
    for (let f = 0; f < 2; f++) {
      const cv = document.createElement('canvas');
      cv.width = cv.height = S;
      const g = cv.getContext('2d');
      if (g) draw(g, shape, f, tint);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 2;
      out.set(`${shape}:${f}`, tex);
    }
  return out;
}
