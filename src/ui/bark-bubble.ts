/**
 * R0295 (FUN-06): a Keeper's line in a speech bubble over their head for a few seconds,
 * in both renderers. The bubble is a DOM element placed each frame by projecting the
 * Keeper's head through whichever camera is drawing; off screen it waits at the top.
 */
import '../fun.css';
import * as THREE from 'three';
import { BARK_BUBBLE } from '../config/tuning-fun';
import type { Game } from '../game';
import { terraceY } from '../render/scene-stage';
import { viewRect } from '../render/stage-api';
import { standHeight } from '../render3d/terrain-shape';
import { el } from './dom';

export class BarkBubble {
  private readonly root: HTMLDivElement;
  private readonly name: HTMLSpanElement;
  private readonly text: HTMLSpanElement;
  private npcId: string | null = null;
  private until = 0;
  private readonly v = new THREE.Vector3();

  /**
   * `docks`: a tapped Keeper's line docks at the edge when they are off screen; an ambient
   * line (R0296) just waits unseen instead.
   */
  constructor(
    parent: HTMLElement,
    private readonly docks = true,
  ) {
    this.root = el('div', 'bark-bubble');
    this.root.setAttribute('role', 'status');
    this.name = el('span', 'bark-name');
    this.text = el('span', 'bark-text');
    this.root.append(this.name, this.text);
    this.root.hidden = true;
    parent.appendChild(this.root);
  }

  /** Whether this bubble is up over Keeper `npcId` now. */
  showing(npcId: string): boolean {
    return !this.root.hidden && this.npcId === npcId;
  }

  /** R0296: the ambient look (a little smaller and paler). */
  ambient(): void {
    this.root.classList.add('bark-ambient');
  }

  show(npcId: string, name: string, line: string, nowMs: number): void {
    this.npcId = npcId;
    this.until = nowMs + BARK_BUBBLE.ms;
    this.name.textContent = name;
    this.text.textContent = line;
    this.root.hidden = false;
  }

  /** Per frame: follow the Keeper's head, and go after the time is up. */
  update(g: Game, nowMs: number): void {
    if (this.root.hidden) return;
    // R0353: a bubble may hang over a Nubbin too (Moss's dry reactions).
    const npc =
      g.world.npcs.find((n) => n.id === this.npcId) ??
      g.world.nubbins.find((n) => n.id === this.npcId);
    if (!npc || nowMs >= this.until) {
      this.root.hidden = true;
      return;
    }
    const s3 = g.scene3d;
    const cam: THREE.Camera = s3 ? s3.camera : g.camera.camera;
    const { x, z } = npc.pos;
    const ground = g.world.location === 'grove' ? (s3 ? standHeight(x, z) : terraceY(x, z)) : 0;
    const p = this.v.set(x, ground + BARK_BUBBLE.lift, z).project(cam);
    const view = viewRect();
    const on = p.z <= 1 && p.z >= -1 && Math.abs(p.x) < 1 && Math.abs(p.y) < 1;
    if (!this.docks) {
      this.root.style.visibility = on ? '' : 'hidden';
      if (!on) return;
    }
    this.root.classList.toggle('bark-docked', !on);
    if (!on) {
      this.root.style.left = '';
      this.root.style.top = '';
      return;
    }
    this.root.style.left = `${view.x + ((p.x + 1) / 2) * view.w}px`;
    this.root.style.top = `${view.y + ((1 - p.y) / 2) * view.h}px`;
  }
}

/**
 * R0296 / R0297: the Keepers' ambient lines (routines and passing chatter), several at once,
 * one bubble per Keeper, never docked. A Keeper tapped by the player still uses the main
 * bubble, which wins: an ambient line for the same Keeper waits its turn.
 */
export class AmbientBubbles {
  private readonly pool = new Map<string, BarkBubble>();

  constructor(
    private readonly parent: HTMLElement,
    private readonly main: BarkBubble,
  ) {}

  show(npcId: string, name: string, line: string, nowMs: number): void {
    if (this.main.showing(npcId)) return;
    let b = this.pool.get(npcId);
    if (!b) {
      b = new BarkBubble(this.parent, false);
      b.ambient();
      this.pool.set(npcId, b);
    }
    b.show(npcId, name, line, nowMs);
  }

  update(g: Game, nowMs: number): void {
    for (const b of this.pool.values()) b.update(g, nowMs);
  }
}
