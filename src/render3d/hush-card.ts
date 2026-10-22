import * as THREE from 'three';
import { CG2_W } from '../config/tuning-w';

/**
 * C8, Full 3D: the Hush's card. A figure, not a column: a hooded head, broad shoulders and
 * long arms hanging at its sides, in a dark slate that stands out from the snow and the night
 * ground, with a soft fog-coloured rim so its edge reads against the treeline. Two small pale
 * glints for eyes give it a face without making it frightening. The foot fades into the ground.
 */
export function hushCardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 192;
  const g = c.getContext('2d')!;
  const figure = (): void => {
    g.beginPath();
    // Head and hood.
    g.ellipse(64, 34, 17, 20, 0, 0, Math.PI * 2);
    // Shoulders and body, widening to the hem.
    g.moveTo(30, 66);
    g.quadraticCurveTo(64, 44, 98, 66);
    g.quadraticCurveTo(106, 120, 100, 192);
    g.lineTo(28, 192);
    g.quadraticCurveTo(22, 120, 30, 66);
    // Arms, hanging a little apart from the body.
    g.moveTo(30, 64);
    g.quadraticCurveTo(10, 100, 14, 150);
    g.quadraticCurveTo(20, 158, 26, 150);
    g.quadraticCurveTo(28, 110, 40, 80);
    g.moveTo(98, 64);
    g.quadraticCurveTo(118, 100, 114, 150);
    g.quadraticCurveTo(108, 158, 102, 150);
    g.quadraticCurveTo(100, 110, 88, 80);
  };
  const rim = new THREE.Color(CG2_W.hush.rimColor);
  const rimRgb = `${Math.round(rim.r * 255)},${Math.round(rim.g * 255)},${Math.round(rim.b * 255)}`;
  // The rim: the same shape, blurred wider, in the fog's colour.
  g.filter = 'blur(4px)';
  g.fillStyle = `rgba(${rimRgb},0.7)`;
  g.strokeStyle = `rgba(${rimRgb},0.7)`;
  g.lineWidth = 6;
  figure();
  g.fill();
  g.stroke();
  // The body.
  g.filter = 'blur(1px)';
  g.fillStyle = 'rgb(44,50,66)';
  figure();
  g.fill();
  g.filter = 'none';
  // A faint lighter fold down the chest, so it is not a flat cut-out.
  const fold = g.createLinearGradient(40, 0, 88, 0);
  fold.addColorStop(0, 'rgba(120,132,156,0)');
  fold.addColorStop(0.5, 'rgba(120,132,156,0.22)');
  fold.addColorStop(1, 'rgba(120,132,156,0)');
  g.fillStyle = fold;
  g.fillRect(40, 60, 48, 132);
  // Two small pale glints under the hood.
  g.fillStyle = `rgba(${rimRgb},0.95)`;
  g.beginPath();
  g.ellipse(57, 37, 2.6, 2, 0, 0, Math.PI * 2);
  g.ellipse(71, 37, 2.6, 2, 0, 0, Math.PI * 2);
  g.fill();
  g.globalCompositeOperation = 'destination-in';
  const fade = g.createLinearGradient(0, 0, 0, 192);
  fade.addColorStop(0, 'rgba(0,0,0,1)');
  fade.addColorStop(0.62, 'rgba(0,0,0,1)');
  fade.addColorStop(0.98, 'rgba(0,0,0,0)');
  g.fillStyle = fade;
  g.fillRect(0, 0, 128, 192);
  const tex = new THREE.CanvasTexture(c);
  // Painted in sRGB: without this the slate is read as linear and lifts to a pale grey.
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
