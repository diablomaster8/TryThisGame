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
    case 'ball':
      g.arc(cx, cy, 26, 0, Math.PI * 2);
      paint(g, tint, cy, 26);
      shine(g, cx - 9, cy - 10, 7);
      break;
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
      g.ellipse(cx, cy, 40, 17, 0, 0, Math.PI * 2);
      inked(g, hex(C.sunYellow), 12);
      g.beginPath();
      g.ellipse(cx, cy - 2, 34, 12, 0, Math.PI * 1.1, Math.PI * 1.9);
      round(g, 4);
      g.strokeStyle = hex(C.cream);
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
      paint(g, hex(C.plum), cy, 40);
      g.beginPath();
      g.arc(cx, cy, 20, 0, Math.PI * 2);
      paint(g, hex(C.moonPurple), cy, 20);
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
