/**
 * MOVE-51: what the phone's jump button shows. A thumb player cannot watch the Keeper's
 * feet, so the button carries the jump's state: a ring that fills while it is held (the
 * held jump rises higher), a pip for the air jump that empties once it is spent, and a
 * feather while the Fly perk's glide is there. With something in hand it is the Shake
 * button, greyed and without the extras. It hides in dialogue (style.css).
 */
import '../move.css';
import { keeperGliding } from '../sim/keeper';
import { keeperPerks } from '../sim/perks';
import { JUMP_BUTTON } from '../config/tuning-move';
import type { World } from '../sim/types';

export interface JumpButtonState {
  /** How full the hold ring is, 0..1. */
  hold: number;
  /** The air-jump pip: there, spent, or not shown. */
  pip: 'ready' | 'spent' | 'none';
  /** The glide is there to use (Fly perk), and whether it is in use now. */
  feather: 'none' | 'ready' | 'gliding';
  /** Something is in hand: the button shakes it instead. */
  shake: boolean;
}

/** The button's state from the world, given how long the jump has been held (ms, or null). */
export function jumpButtonState(world: World, heldMs: number | null): JumpButtonState {
  const k = world.keeper;
  const shake = !!k.carrying || world.nubbins.some((n) => n.behavior.state === 'held');
  if (shake) return { hold: 0, pip: 'none', feather: 'none', shake };
  const hold = heldMs === null ? 0 : Math.min(1, heldMs / JUMP_BUTTON.ringMs);
  const pip = k.grounded || k.airJumps > 0 ? 'ready' : 'spent';
  const feather = !keeperPerks(world).glide ? 'none' : keeperGliding(world) ? 'gliding' : 'ready';
  return { hold, pip, feather, shake };
}

/** The button's parts: the glyph, the ring, the pip and the feather, built once. */
export class JumpButtonLook {
  private readonly glyph: HTMLSpanElement;
  private readonly ring: HTMLSpanElement;
  private readonly pip: HTMLSpanElement;
  private readonly feather: HTMLSpanElement;
  private heldSince: number | null = null;
  private last = '';

  constructor(private readonly btn: HTMLElement) {
    btn.textContent = '';
    const span = (cls: string, text = ''): HTMLSpanElement => {
      const s = document.createElement('span');
      s.className = cls;
      s.textContent = text;
      s.setAttribute('aria-hidden', 'true');
      btn.appendChild(s);
      return s;
    };
    this.ring = span('jump-ring');
    this.glyph = span('jump-glyph', '⤒');
    this.pip = span('jump-pip');
    this.feather = span('jump-feather', '🪶');
  }

  /** Set the glyph (⤒ or the shake egg) without losing the other parts. */
  setGlyph(text: string): void {
    if (this.glyph.textContent !== text) this.glyph.textContent = text;
  }

  /** Per frame: read the world and draw the state. Cheap when nothing changed. */
  update(world: World, nowMs: number): void {
    const held = world.keeper.jumpHeld;
    if (held && this.heldSince === null) this.heldSince = nowMs;
    else if (!held) this.heldSince = null;
    const s = jumpButtonState(world, this.heldSince === null ? null : nowMs - this.heldSince);
    const key = `${s.hold.toFixed(2)}|${s.pip}|${s.feather}|${s.shake}`;
    if (key === this.last) return;
    this.last = key;
    this.btn.style.setProperty('--jump-hold', s.hold.toFixed(2));
    this.btn.classList.toggle('jump-shake', s.shake);
    this.pip.hidden = s.pip === 'none';
    this.pip.classList.toggle('spent', s.pip === 'spent');
    this.feather.hidden = s.feather === 'none';
    this.feather.classList.toggle('gliding', s.feather === 'gliding');
    this.btn.dataset['jump'] = `${s.pip} ${s.feather}${s.shake ? ' shake' : ''}`;
  }
}
