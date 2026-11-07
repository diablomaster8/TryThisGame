/**
 * R0723: Grove noticing for sprouts. A fruit falling, an egg hatching or a tree being shaken
 * can get one short spoken line ("One, two, three apples!"), at most one per
 * `EDU_NOTICING.gapMs`. Each line sends `eduNotice` so the item grids see it; nothing is
 * right or wrong. Reads the world and the clock only; the HUD hands it the sim's events.
 * A fruit moment also lights that fruit (grove-noticed.ts), which the guide's hand points at.
 */
import { EGG_COLOR_LABELS } from '../config/strings';
import { NOTICING_TEXT } from '../config/strings-kids-r11e';
import { EDU_NOTICING } from '../config/tuning-more/kids-noticing';
import type { SimEvent, World } from '../sim/types';
import { noteFruitEaten, setNoticeHighlight } from './grove-noticed';

export interface Noticing {
  text: string;
  /** The item id logged in `edu.items`. */
  item: string;
  /** A fruit or tree to light up, when there is one. */
  highlight?: string;
}

export class EduNoticing {
  private lastMs = Number.NEGATIVE_INFINITY;
  private shakes = 0;
  private shakeTree = '';

  /** The moment for an event, or null: not a sprout, too soon, or nothing to say. */
  onEvent(e: SimEvent, world: World, nowMs: number): Noticing | null {
    // Real fruit eaten feeds the counting do-beat (`edu:count:fruit:N`) in every band.
    if (world.edu && e.kind === 'ate') noteFruitEaten();
    if (world.edu?.band !== 'sprout') return null;
    if (e.kind === 'treeShaken') {
      if (this.shakeTree !== e.treeId) this.shakes = 0;
      this.shakeTree = e.treeId;
      this.shakes += 1;
    }
    if (nowMs - this.lastMs < EDU_NOTICING.gapMs) return null;
    let found: Noticing | null = null;
    if (e.kind === 'fruitDropped') {
      const n = Math.min(
        world.items.filter((i) => i.kind === 'fruit').length,
        EDU_NOTICING.maxCount,
      );
      if (n > 0) found = { text: NOTICING_TEXT.fruit(n), item: `count:${n}`, highlight: e.itemId };
    } else if (e.kind === 'hatched') {
      const nub = world.nubbins.find((x) => x.id === e.nubbinId);
      if (nub) {
        const colour = EGG_COLOR_LABELS[nub.eggColor] ?? nub.eggColor;
        found = { text: NOTICING_TEXT.egg(nub.name, colour), item: `colour:${nub.eggColor}` };
      }
    } else if (e.kind === 'treeShaken' && this.shakes >= 2) {
      const n = Math.min(this.shakes, EDU_NOTICING.maxCount);
      found = { text: NOTICING_TEXT.shakes(n), item: `count:${n}` };
      this.shakes = 0;
    }
    if (found) {
      this.lastMs = nowMs;
      // The fruit being counted glows and gets the guide's hand (guide.ts).
      if (found.highlight) setNoticeHighlight(found.highlight, nowMs + EDU_NOTICING.highlightMs);
    }
    return found;
  }
}
