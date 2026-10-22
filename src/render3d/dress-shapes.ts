import * as THREE from 'three';
import { keepsakeLook, type KeepsakeLook } from '../config/keepsake-looks';
import type { DressItem } from '../render/dress-d-rules';
import { shelfSlot } from '../render/dress-d-rules';
import type { Tex } from '../samples/aaa-kit';
import { Parts, arc, box, buildStoryProp, cyl, shellRow, sph } from './prop-kit';

/**
 * Kit-built models for package d's dressing items (campaign graphics M1, M2, M7, M12, M17,
 * N4) and the keepsakes on the shelf. See prop-kit.ts for how a prop is put together.
 */
const WOOD = '#9a6a3e';
const DARK = '#6a4428';
const STONE = '#b9b4aa';
const CREAM = '#f3ead2';
const IRON = '#4a4f58';
const BRASS = '#c8a24e';

/** The model for `item`, or null for a glint-only item. */
export function buildDressItem(tex: Tex, item: DressItem): THREE.Group | null {
  if (item.shape === 'none') return null;
  if (item.shape === 'chair') return buildStoryProp(tex, 'chair');
  if (item.shape === 'bench') return buildStoryProp(tex, 'oldBench');
  const P = new Parts(tex);
  switch (item.shape) {
    case 'kettle':
      P.add('plain', cyl(0.12, 0.15, 0.2), [0, 0.1, 0], IRON);
      P.add('plain', cyl(0.09, 0.1, 0.03), [0, 0.215, 0], IRON);
      P.add('plain', sph(0.025, 6, 4), [0, 0.245, 0], BRASS);
      P.add('plain', cyl(0.022, 0.04, 0.13), [0.15, 0.17, 0], IRON, [0, 0, -0.9]);
      P.add('plain', arc(0.11, 0.013, Math.PI), [0, 0.21, 0], '#2f333a');
      break;
    case 'cup':
      // Upturned: the open end is down, a handle at the side.
      P.add('plain', cyl(0.06, 0.08, 0.11), [0, 0.055, 0], '#e8e0d0');
      P.add('plain', cyl(0.082, 0.082, 0.014), [0, 0.03, 0], '#7a9ac0');
      P.add('plain', arc(0.04, 0.011, Math.PI * 1.4), [0.09, 0.06, 0], '#e8e0d0', [0, 0, -0.7]);
      break;
    case 'teacup':
      P.add('plain', cyl(0.1, 0.09, 0.014), [0, 0.007, 0], '#e8e0d0');
      P.add('plain', cyl(0.07, 0.05, 0.08), [0, 0.054, 0], '#e8e0d0');
      P.add('plain', cyl(0.062, 0.062, 0.004), [0, 0.092, 0], '#7a4a2a');
      P.add('plain', arc(0.04, 0.011, Math.PI * 1.4), [0.085, 0.055, 0], '#e8e0d0', [0, 0, -0.7]);
      break;
    case 'pie':
      P.add('plain', cyl(0.2, 0.17, 0.06), [0, 0.03, 0], '#c9b48a');
      P.add('plain', sph(0.19, 12, 6), [0, 0.06, 0], '#d9a45a', [0, 0, 0], [1, 0.45, 1]);
      for (let i = -1; i <= 1; i++) {
        P.add('plain', box(0.34, 0.012, 0.03, 0.005), [0, 0.142, i * 0.07], '#b9803c');
        P.add('plain', box(0.03, 0.012, 0.34, 0.005), [i * 0.07, 0.146, 0], '#b9803c');
      }
      break;
    case 'signpost':
      P.add('wood', box(0.1, 1.3, 0.1, 0.03), [0, 0.65, 0], WOOD);
      P.add('wood', box(0.62, 0.2, 0.05, 0.02), [0, 1.08, 0.06], '#8a5a34', [0, 0, 0.04]);
      P.add('wood', box(0.12, 0.12, 0.05, 0.01), [0.34, 1.08, 0.06], '#8a5a34', [
        0,
        0,
        Math.PI / 4 + 0.04,
      ]);
      P.add('stone', sph(0.16, 8, 6), [0, 0.04, 0], STONE, [0, 0, 0], [1.4, 0.45, 1.2]);
      if (item.n > 0) {
        // A ledge, the letter on it and a pebble holding it down.
        P.add('wood', box(0.5, 0.03, 0.3, 0.01), [0.25, 0.86, 0.17], DARK);
        P.add('plain', box(0.32, 0.014, 0.22, 0.004), [0.2, 0.885, 0.17], CREAM, [0, 0.25, 0]);
        P.add('plain', cyl(0.035, 0.035, 0.008, 8), [0.2, 0.9, 0.2], '#b04a3a');
        P.add('stone', sph(0.08, 7, 5), [0.33, 0.92, 0.13], '#9a968c', [0, 0, 0], [1.2, 0.7, 1]);
      }
      break;
    case 'eggShelf':
      P.add('wood', box(0.9, 0.045, 0.22, 0.015), [0, 0.55, 0], WOOD);
      for (const x of [-0.4, 0.4])
        for (const z of [-0.08, 0.08])
          P.add('wood', box(0.04, 0.55, 0.04, 0.012), [x, 0.275, z], DARK);
      P.add('wood', box(0.84, 0.03, 0.18, 0.01), [0, 0.2, 0], DARK);
      shellRow(P, 0.575, 0, item.n || 5);
      break;
    case 'board': {
      for (const x of [-0.72, 0.72]) P.add('wood', box(0.1, 1.7, 0.1, 0.03), [x, 0.85, 0], DARK);
      P.add('wood', box(1.56, 1.04, 0.07, 0.03), [0, 1.1, 0], WOOD);
      P.add('plain', box(1.38, 0.86, 0.03, 0.01), [0, 1.1, 0.045], '#c9a46a');
      P.add('wood', box(1.76, 0.07, 0.24, 0.02), [0, 1.74, 0], DARK);
      for (let i = 0; i < item.n; i++) {
        const x = ((i % 3) - 1) * 0.42;
        const y = 1.32 - Math.floor(i / 3) * 0.46;
        const tilt = ((i * 37) % 11) / 100 - 0.05;
        P.add('plain', box(0.3, 0.38, 0.012, 0.004), [x, y, 0.072], CREAM, [0, 0, tilt]);
        P.add('plain', box(0.2, 0.012, 0.004, 0.002), [x, y + 0.04, 0.08], '#8a7a62', [0, 0, tilt]);
        P.add('plain', box(0.16, 0.012, 0.004, 0.002), [x, y - 0.02, 0.08], '#8a7a62', [
          0,
          0,
          tilt,
        ]);
        P.add('plain', sph(0.022, 6, 4), [x, y + 0.16, 0.085], '#c84a3a');
      }
      break;
    }
    case 'shrine':
      P.add('stone', box(0.9, 0.18, 0.9, 0.05), [0, 0.09, 0], STONE);
      P.add('stone', box(0.66, 0.14, 0.66, 0.04), [0, 0.25, 0], '#a8a398');
      P.add('stone', box(0.2, 0.55, 0.2, 0.04), [0, 0.6, 0], '#a8a398');
      if (item.lit)
        P.add('glow', box(0.28, 0.28, 0.28, 0.03), [0, 1.0, 0], '#ffcf70', [0, 0, 0], [1, 1, 1], 2);
      else P.add('plain', box(0.28, 0.28, 0.28, 0.03), [0, 1.0, 0], '#9a9a88');
      for (const sx of [-1, 1])
        for (const sz of [-1, 1])
          P.add('wood', box(0.035, 0.32, 0.035, 0.01), [sx * 0.15, 1.0, sz * 0.15], DARK);
      P.add('stone', new THREE.ConeGeometry(0.34, 0.24, 4), [0, 1.28, 0], '#7a766c', [
        0,
        Math.PI / 4,
        0,
      ]);
      P.add('stone', sph(0.04, 6, 4), [0, 1.43, 0], '#a8a398');
      break;
    case 'bell': {
      for (const x of [-0.55, 0.55]) {
        P.add('wood', box(0.12, 1.5, 0.12, 0.03), [x, 0.75, 0], DARK);
        P.add('wood', box(0.1, 0.1, 0.5, 0.02), [x, 0.05, 0], '#58381f');
      }
      P.add('wood', box(1.3, 0.12, 0.14, 0.03), [0, 1.5, 0], WOOD);
      P.add('plain', cyl(0.04, 0.04, 0.12), [0, 1.4, 0], '#3a3a42');
      P.add('plain', cyl(0.1, 0.2, 0.3, 14), [0, 1.2, 0], BRASS);
      P.add('plain', sph(0.1, 10, 6), [0, 1.35, 0], BRASS);
      P.add('plain', sph(0.045, 6, 4), [0, 1.03, 0], '#7c6a46');
      // The rope: old and thin, or new, lighter and thicker with a knot.
      if (item.n > 0) {
        P.add('plain', cyl(0.03, 0.03, 0.6), [0, 0.7, 0.0], '#efe0b0');
        P.add('plain', sph(0.05, 6, 4), [0, 0.38, 0], '#efe0b0');
      } else P.add('plain', cyl(0.014, 0.014, 0.4), [0, 0.8, 0], '#8a7a5a');
      break;
    }
    case 'notebook':
      P.add('wood', box(0.2, 0.04, 0.28, 0.012), [0, 0.02, 0], '#6a3a2a', [0, 0.4, 0]);
      P.add('plain', box(0.18, 0.025, 0.26, 0.008), [0.005, 0.05, 0], CREAM, [0, 0.4, 0]);
      P.add('plain', box(0.02, 0.008, 0.22, 0.003), [0.06, 0.066, 0.02], '#b04a3a', [0, 0.4, 0]);
      break;
    case 'tin':
      P.add('plain', cyl(0.12, 0.12, 0.12), [0, 0.06, 0], '#8a8f98');
      P.add('plain', cyl(0.125, 0.125, 0.02), [0.04, 0.14, 0], '#6a6f78', [0, 0, 0.18]);
      for (let i = 0; i < 4; i++)
        P.add(
          'glow',
          new THREE.ConeGeometry(0.02, 0.08, 4),
          [-0.04 + i * 0.03, 0.15, 0.02 * (i % 2)],
          '#bfe8ff',
          [0.2 * (i - 1.5), 0, 0.15 * (i % 3)],
          [1, 1, 1],
          1.5,
        );
      break;
    case 'visor':
      P.add('plain', box(0.3, 0.07, 0.06, 0.025), [0, 0.1, 0], '#2a2f45');
      P.add(
        'glow',
        box(0.26, 0.028, 0.02, 0.008),
        [0, 0.1, 0.034],
        '#6ae0ff',
        [0, 0, 0],
        [1, 1, 1],
        1.6,
      );
      P.add('plain', arc(0.14, 0.014, Math.PI), [0, 0.1, -0.02], '#2a2f45', [Math.PI / 2, 0, 0]);
      P.add('stone', box(0.34, 0.06, 0.16, 0.02), [0, 0.03, 0], '#7a7a86');
      break;
    case 'lever':
      P.add('stone', box(0.4, 0.1, 0.3, 0.03), [0, 0.05, 0], '#7a766c');
      P.add('plain', box(0.26, 0.02, 0.05, 0.008), [0, 0.105, 0], '#2f333a');
      P.add('plain', cyl(0.025, 0.025, 0.7), [0.13, 0.42, 0], IRON, [0, 0, -0.35]);
      P.add('plain', sph(0.065, 8, 6), [0.25, 0.75, 0], '#c84a3a');
      break;
    case 'lens':
      P.add('plain', cyl(0.17, 0.17, 0.03, 16), [0, 0.03, 0], BRASS);
      P.add('plain', cyl(0.14, 0.14, 0.036, 16), [0, 0.03, 0], '#9fd6ea');
      P.add('plain', box(0.3, 0.004, 0.012, 0.002), [0, 0.052, 0], '#2f333a', [0, 0.6, 0]);
      P.add('plain', box(0.18, 0.004, 0.01, 0.002), [0.03, 0.052, 0.03], '#2f333a', [0, -0.5, 0]);
      break;
    case 'porchLight':
      P.add('wood', box(0.08, 1.1, 0.08, 0.025), [0, 0.55, 0], WOOD);
      P.add('wood', box(0.24, 0.05, 0.05, 0.015), [0.1, 1.08, 0], DARK);
      if (item.lit)
        P.add(
          'glow',
          box(0.15, 0.2, 0.15, 0.025),
          [0.2, 0.92, 0],
          '#ffc766',
          [0, 0, 0],
          [1, 1, 1],
          2,
        );
      else P.add('plain', box(0.15, 0.2, 0.15, 0.025), [0.2, 0.92, 0], '#c8c0a8');
      for (const sx of [-1, 1])
        for (const sz of [-1, 1])
          P.add('wood', box(0.015, 0.22, 0.015, 0.005), [0.2 + sx * 0.08, 0.92, sz * 0.08], DARK);
      P.add('wood', new THREE.ConeGeometry(0.13, 0.08, 4), [0.2, 1.06, 0], DARK, [
        0,
        Math.PI / 4,
        0,
      ]);
      break;
    case 'keepShelf': {
      P.add('wood', box(1.5, 1.22, 0.05, 0.015), [0, 0.62, -0.12], '#7c5532');
      for (const x of [-0.74, 0.74]) P.add('wood', box(0.05, 1.26, 0.3, 0.015), [x, 0.63, 0], DARK);
      for (const y of [0.28, 0.62, 0.96])
        P.add('wood', box(1.46, 0.04, 0.28, 0.012), [0, y, 0], WOOD);
      P.add('wood', box(1.62, 0.06, 0.36, 0.02), [0, 1.28, 0], DARK);
      (item.ids ?? []).forEach((id, i) => {
        const look = keepsakeLook(id);
        if (!look) return;
        const s = shelfSlot(i);
        keepsakeParts(P, look, s.x, s.y + 0.02, 0.02);
      });
      break;
    }
  }
  return P.flush();
}

/** One keepsake's shape standing at (x, y, z), a little under 0.22 units high. */
export function keepsakeParts(P: Parts, look: KeepsakeLook, x: number, y: number, z: number): void {
  const c = look.color;
  const a = look.accent;
  switch (look.shape) {
    case 'pages':
      P.add('plain', box(0.17, 0.03, 0.22, 0.008), [x, y + 0.015, z], c, [0, 0.2, 0]);
      P.add('plain', box(0.16, 0.025, 0.2, 0.008), [x + 0.005, y + 0.04, z], c, [0, -0.1, 0]);
      P.add('plain', box(0.02, 0.07, 0.22, 0.005), [x - 0.08, y + 0.035, z], a);
      break;
    case 'egg':
      P.add('plain', sph(0.07, 10, 8), [x, y + 0.09, z], c, [0, 0, 0], [1, 1.28, 1]);
      P.add('plain', box(0.1, 0.02, 0.1, 0.01), [x, y + 0.01, z], a);
      break;
    case 'seed':
      P.add('stone', sph(0.06, 8, 6), [x, y + 0.06, z], c, [0, 0, 0.3], [1.2, 1, 0.9]);
      P.add('stone', sph(0.03, 6, 4), [x + 0.03, y + 0.08, z + 0.04], a);
      break;
    case 'trowel':
      P.add(
        'plain',
        new THREE.ConeGeometry(0.05, 0.16, 4),
        [x, y + 0.03, z + 0.08],
        c,
        [-Math.PI / 2 + 0.1, 0, Math.PI / 4],
        [1, 1, 0.35],
      );
      P.add('wood', box(0.035, 0.035, 0.12, 0.012), [x, y + 0.03, z - 0.06], a);
      break;
    case 'letter':
      P.add('plain', box(0.2, 0.014, 0.14, 0.004), [x, y + 0.008, z], c, [0, 0.2, 0]);
      P.add('plain', cyl(0.02, 0.02, 0.006, 8), [x, y + 0.02, z], a);
      break;
    case 'toy':
      P.add('plain', sph(0.065, 8, 6), [x, y + 0.065, z], c, [0, 0, 0], [1, 0.9, 1]);
      P.add('plain', sph(0.05, 8, 6), [x, y + 0.15, z], c);
      for (const s of [-1, 1]) P.add('plain', sph(0.02, 5, 4), [x + s * 0.04, y + 0.2, z], a);
      break;
    case 'jar':
      P.add('plain', cyl(0.06, 0.06, 0.12), [x, y + 0.06, z], c);
      P.add('plain', cyl(0.065, 0.065, 0.025), [x, y + 0.135, z], a);
      break;
    case 'rock':
      P.add('stone', sph(0.08, 7, 5), [x, y + 0.05, z], c, [0, 0.4, 0], [1.2, 0.7, 1]);
      P.add('stone', sph(0.04, 6, 4), [x + 0.05, y + 0.08, z + 0.02], a);
      break;
    case 'cog':
      P.add('plain', cyl(0.07, 0.07, 0.025, 12), [x, y + 0.075, z], c, [Math.PI / 2, 0, 0]);
      for (let i = 0; i < 6; i++) {
        const t = (i / 6) * Math.PI * 2;
        P.add(
          'plain',
          box(0.03, 0.03, 0.025, 0.005),
          [x + Math.cos(t) * 0.08, y + 0.075 + Math.sin(t) * 0.08, z],
          a,
          [0, 0, t],
        );
      }
      break;
    case 'cheese':
      P.add('plain', cyl(0.09, 0.09, 0.07, 3), [x, y + 0.035, z], c, [0, 0.5, 0]);
      P.add('plain', sph(0.015, 5, 4), [x + 0.03, y + 0.075, z], a);
      break;
    case 'lantern':
      P.add('glow', box(0.1, 0.12, 0.1, 0.015), [x, y + 0.09, z], c, [0, 0, 0], [1, 1, 1], 1.4);
      P.add('wood', box(0.13, 0.025, 0.13, 0.008), [x, y + 0.02, z], a);
      P.add('wood', new THREE.ConeGeometry(0.08, 0.05, 4), [x, y + 0.175, z], a, [
        0,
        Math.PI / 4,
        0,
      ]);
      break;
    case 'flag':
      P.add('wood', cyl(0.008, 0.008, 0.2, 5), [x - 0.05, y + 0.1, z], a);
      P.add('plain', box(0.12, 0.08, 0.01, 0.004), [x + 0.01, y + 0.16, z], c);
      break;
    case 'sign':
      P.add('wood', cyl(0.01, 0.01, 0.16, 5), [x, y + 0.08, z], a);
      P.add('plain', box(0.14, 0.08, 0.015, 0.006), [x, y + 0.16, z], c);
      break;
    case 'cushion':
      P.add('plain', box(0.2, 0.07, 0.16, 0.03), [x, y + 0.035, z], c, [0, 0.2, 0]);
      P.add('plain', sph(0.015, 5, 4), [x, y + 0.075, z], a);
      break;
    case 'fruit':
      P.add('plain', sph(0.06, 8, 6), [x, y + 0.06, z], c);
      P.add('plain', box(0.05, 0.012, 0.025, 0.004), [x + 0.02, y + 0.13, z], a, [0, 0, 0.4]);
      break;
    case 'bottle':
      P.add('plain', cyl(0.05, 0.05, 0.11), [x, y + 0.055, z], c);
      P.add('plain', cyl(0.02, 0.025, 0.07), [x, y + 0.145, z], c);
      P.add('plain', cyl(0.025, 0.025, 0.02), [x, y + 0.19, z], a);
      break;
  }
}
