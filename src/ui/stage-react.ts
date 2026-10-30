/**
 * R0303 (FUN-14) and R0368 (FUN-79): a stage actor reacts to a story line. A line's
 * `react` (or, for narration like "Your Nubbin sneezes", an inferred one) pops an emote
 * or a little particle burst over the actor for a moment. It is a DOM element projected
 * through whichever camera is drawing, like the bark bubbles, so the Pixel and Full 3D
 * stages show the same thing. Render-only: nothing here reaches the sim.
 */
import '../fun.css';
import * as THREE from 'three';
import type { Line, LineReaction } from '../config/story';
import { REACT_INFER } from '../config/story-react';
import type { Game } from '../game';
import { playSound, type SoundName } from '../platform/audio';
import { terraceY } from '../render/scene-stage';
import { viewRect } from '../render/stage-api';
import { standHeight } from '../render3d/terrain-shape';
import { el } from './dom';

const ICONS: Record<LineReaction, string> = {
  spark: '✨',
  heart: '💗',
  surprised: '❗',
  dizzy: '💫',
  happy: '🎵',
  sad: '💧',
  sneeze: '💨',
  giggle: '😆',
  hide: '🙈',
  lean: '💞',
  yawn: '💤',
  hiccup: '🫧',
};

/** The reaction a line plays: its own `react`, else one read from its narration. */
export function lineReaction(
  line: Pick<Line, 'who' | 'text' | 'react'>,
): { who: string; as: LineReaction; sound: SoundName | null } | null {
  if (line.react) return { ...line.react, sound: null };
  if (line.who !== 'narrator') return null;
  for (const [re, as, sound] of REACT_INFER)
    if (re.test(line.text)) return { who: 'nubbin', as, sound };
  return null;
}

const LIFT = 1.1;
const MS = 1400;

export class StageReact {
  private readonly root: HTMLDivElement;
  private who = 'nubbin';
  private until = 0;
  private raf = 0;
  private readonly v = new THREE.Vector3();

  constructor(parent: HTMLElement) {
    this.root = el('div', 'stage-react');
    this.root.setAttribute('aria-hidden', 'true');
    this.root.hidden = true;
    parent.appendChild(this.root);
  }

  /** Called as a line starts typing. `sfxPlayed`: the line brought its own sound. */
  play(g: Game, line: Line, sfxPlayed: boolean): void {
    const r = lineReaction(line);
    if (!r) return;
    if (r.sound && !sfxPlayed) playSound(r.sound);
    this.who = r.who;
    this.until = performance.now() + MS;
    this.root.dataset.as = r.as;
    this.root.textContent = '';
    // A spark (and a sneeze) is a burst of bits flying out; the rest is one emote.
    const burst = r.as === 'spark' || r.as === 'sneeze';
    if (burst) {
      for (let i = 0; i < 5; i++) {
        const bit = el('span', 'stage-react-bit', r.as === 'spark' || i > 0 ? '✨' : ICONS.sneeze);
        bit.style.setProperty('--a', `${i * 72 - 90}deg`);
        this.root.append(bit);
      }
    } else this.root.textContent = ICONS[r.as];
    this.root.classList.toggle('stage-react-still', g.reduceMotion);
    this.root.hidden = false;
    this.place(g);
    // Follow the actor each frame for the moment's length, then go.
    cancelAnimationFrame(this.raf);
    const frame = (now: number): void => {
      if (now >= this.until) {
        this.root.hidden = true;
        return;
      }
      this.place(g);
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  private place(g: Game): void {
    const pos = this.actorPos(g);
    if (!pos) {
      this.root.hidden = true;
      return;
    }
    const s3 = g.scene3d;
    const cam: THREE.Camera = s3 ? s3.camera : g.camera.camera;
    const ground =
      g.world.location === 'grove' ? (s3 ? standHeight(pos.x, pos.z) : terraceY(pos.x, pos.z)) : 0;
    const p = this.v.set(pos.x, ground + LIFT, pos.z).project(cam);
    const view = viewRect();
    const on = p.z <= 1 && p.z >= -1 && Math.abs(p.x) < 1.1 && Math.abs(p.y) < 1.1;
    this.root.style.visibility = on ? '' : 'hidden';
    this.root.style.left = `${view.x + ((p.x + 1) / 2) * view.w}px`;
    this.root.style.top = `${view.y + ((1 - p.y) / 2) * view.h}px`;
  }

  private actorPos(g: Game): { x: number; z: number } | null {
    const w = g.world;
    if (this.who === 'you') return w.keeper.pos;
    if (this.who === 'nubbin' || this.who === 'partner') {
      // The scene's Nubbin where the stage put it, while a stage is up.
      const partner = g.storyStager.active ? g.storyStager.partner : null;
      if (partner) return partner;
      const n = w.nubbins.find((x) => x.stage !== 'egg');
      return n ? n.pos : null;
    }
    const npc = w.npcs.find((x) => x.trainer === this.who);
    return npc ? npc.pos : null;
  }
}
