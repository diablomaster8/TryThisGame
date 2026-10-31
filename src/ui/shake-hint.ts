/**
 * TECH-62: show, not tell, how to shake an egg. While an unready egg is selected and has not
 * been shaken yet, a looping ghost hand plays over it: tap, lift, shake. A sprout hears the
 * how-to once. It is a DOM overlay projected through `toScreen`, so it costs no draw calls and
 * works the same in Pixel and Full 3D. It reads the world and the camera and sends nothing.
 */
import { SHAKE_HINT_TEXT } from '../config/strings-r9d3';
import { SHAKE_HINT } from '../config/tuning-r9d3';
import type { Game } from '../game';
import { PIXEL_VIEW, toScreen } from '../render/stage-api';
import { textBandOf } from '../sim/story-scenes';
import type { Nubbin, World } from '../sim/types';
import { speakLine } from './lesson';

/** The selected egg the hint is for: unready, on the ground, never shaken. */
export function shakeHintEgg(world: World): Nubbin | null {
  const id = world.selected;
  if (!id || world.keeper.carrying === id) return null;
  const n = world.nubbins.find((x) => x.id === id);
  if (!n || n.stage !== 'egg' || n.hatchRemainingMs <= 0) return null;
  if (n.behavior.state === 'held' || (n.eggShakes ?? 0) > 0) return null;
  return n;
}

export class ShakeHint {
  readonly root: HTMLDivElement;
  private said = false;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'shake-hint';
    this.root.hidden = true;
    this.root.setAttribute('role', 'img');
    this.root.setAttribute('aria-label', SHAKE_HINT_TEXT.aria);
    const egg = document.createElement('span');
    egg.className = 'shake-hint-egg';
    egg.textContent = '🥚';
    const tap = document.createElement('span');
    tap.className = 'shake-hint-tap';
    tap.textContent = '👆';
    const hold = document.createElement('span');
    hold.className = 'shake-hint-hold';
    hold.textContent = '✊';
    this.root.append(egg, tap, hold);
    parent.appendChild(this.root);
  }

  /** Per frame; `busy` is anything covering the Grove, `guiding` the edu guide's own hand. */
  update(g: Game, busy: boolean, guiding: boolean): void {
    const egg = busy || guiding ? null : shakeHintEgg(g.world);
    const p = egg
      ? toScreen(g.scene3d?.camera ?? PIXEL_VIEW.camera, egg.pos.x, SHAKE_HINT.lift, egg.pos.z)
      : null;
    if (!egg || !p) {
      if (!this.root.hidden) this.root.hidden = true;
      return;
    }
    this.root.style.left = `${Math.round(p.x)}px`;
    this.root.style.top = `${Math.round(p.y - SHAKE_HINT.raisePx)}px`;
    if (this.root.hidden) {
      this.root.hidden = false;
      if (!this.said && textBandOf(g.world) === 'sprout' && g.world.edu?.readAloud) {
        this.said = true;
        speakLine(SHAKE_HINT_TEXT.say);
      }
    }
  }
}
