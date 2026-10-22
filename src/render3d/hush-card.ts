import * as THREE from 'three';
import { CG2_W } from '../config/tuning-w';

/**
 * C8, Full 3D: the Hush's grey card with a fog-coloured rim. The mass is the stock soft
 * silhouette (render/dress-e.ts); a wider, paler copy of it painted first gives the edge the
 * colour of the fog it stands in, so it reads against the treeline instead of cutting a
 * dark hole in it.
 */
export function hushCardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 192;
  const g = c.getContext('2d')!;
  const blob = (x: number, y: number, rx: number, ry: number, a: number, rgb: string): void => {
    g.save();
    g.translate(x, y);
    g.scale(rx / ry, 1);
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, ry);
    grad.addColorStop(0, `rgba(${rgb},${a})`);
    grad.addColorStop(0.62, `rgba(${rgb},${a * 0.55})`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, ry, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  const rim = new THREE.Color(CG2_W.hush.rimColor);
  const rimRgb = `${Math.round(rim.r * 255)},${Math.round(rim.g * 255)},${Math.round(rim.b * 255)}`;
  const body = (grow: number, a: number, rgb: string): void => {
    blob(64, 120, 54 + grow, 54 + grow, a, rgb);
    blob(64, 88, 40 + grow, 46 + grow, a * 0.9, rgb);
    blob(64, 46, 24 + grow, 24 + grow, a, rgb);
  };
  body(7, 0.28, rimRgb);
  body(0, 1, '84,92,112');
  g.globalCompositeOperation = 'destination-in';
  const fade = g.createLinearGradient(0, 0, 0, 192);
  fade.addColorStop(0, 'rgba(0,0,0,1)');
  fade.addColorStop(0.55, 'rgba(0,0,0,1)');
  fade.addColorStop(0.95, 'rgba(0,0,0,0)');
  g.fillStyle = fade;
  g.fillRect(0, 0, 128, 192);
  return new THREE.CanvasTexture(c);
}
