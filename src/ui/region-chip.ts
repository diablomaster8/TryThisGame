/**
 * Lane C r10 agent A (R0605, CAMP-13): the questline regions' entrances. Standing at the Grove
 * gate, Pixel's workbench, the Hollow stairs or the green's shrine while that region's line
 * runs shows a "Go to …" chip; inside a region, its entrance shows "Back to the Grove". The
 * change is a short fade (a cut under reduced motion) and a `storyRegion` command. The chip
 * hides in dialogue with the other thumb buttons. It also turns the region events into toasts:
 * each region is announced once, by someone who would know, and never by a modal (R0640).
 */
import { STORY_REGION_IDS, STORY_REGIONS, type StoryRegionId } from '../config/story-regions';
import { STORY_REGION_TEXT } from '../config/strings';
import { STORY_REGION_TUNING } from '../config/tuning';
import { regionOfLine } from '../config/story-regions';
import {
  lineWaitsForRegion,
  regionLine,
  storyRegionBlock,
  storyRegionHere,
} from '../sim/story-regions';
import type { CampaignState, Command, SimEvent, World } from '../sim/types';
import { button, el } from './dom';

/** The Go-to choices where the Keeper stands: a region to enter, or null for the Grove. */
export function regionChoices(world: World): Array<StoryRegionId | null> {
  if (world.location !== 'grove') return [];
  const k = world.keeper.pos;
  const near = (r: StoryRegionId) =>
    Math.hypot(k.x - STORY_REGIONS[r].at.x, k.z - STORY_REGIONS[r].at.z) <=
    STORY_REGION_TUNING.entranceR;
  const here = storyRegionHere(world);
  if (here) return near(here) ? [null] : [];
  return STORY_REGION_IDS.filter((r) => near(r) && storyRegionBlock(world, r) === null);
}

/** R0597: "Waiting for you in the Fold" for a line whose region the Keeper is not in. */
export function regionWaitHint(world: World, line: CampaignState): string | null {
  if (!lineWaitsForRegion(world, line)) return null;
  const r = regionOfLine(line.storyline ?? '');
  return r ? STORY_REGION_TEXT.waits(STORY_REGION_TEXT.names[r] ?? r) : null;
}

/** R0605: inside a questline's region, that line's objective (`line:<id>:…`) goes first. */
export function regionFirst<T extends { key: string }>(world: World, list: T[]): T[] {
  const id = regionLine(world)?.storyline;
  if (!id) return list;
  const i = list.findIndex((o) => o.key.startsWith(`line:${id}:`));
  return i > 0 ? [list[i]!, ...list.slice(0, i), ...list.slice(i + 1)] : list;
}

/** Send a region change behind a short fade (a cut under reduced motion). */
export function goToRegion(
  send: (cmd: Command) => void,
  region: string | null,
  fade: HTMLElement | null,
): void {
  const reduce =
    document.documentElement.classList.contains('reduce-motion') ||
    (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce || !fade) {
    send({ kind: 'storyRegion', region });
    return;
  }
  fade.style.setProperty('--region-fade-ms', `${STORY_REGION_TUNING.fadeMs}ms`);
  fade.classList.add('on');
  setTimeout(() => {
    send({ kind: 'storyRegion', region });
    fade.classList.remove('on');
  }, STORY_REGION_TUNING.fadeMs);
}

export class RegionChip {
  readonly root: HTMLDivElement;
  readonly fade: HTMLDivElement;
  private key = '';

  constructor(
    parent: HTMLElement,
    private readonly send: (cmd: Command) => void,
  ) {
    this.root = el('div', 'region-chip') as HTMLDivElement;
    this.root.hidden = true;
    this.fade = el('div', 'region-fade') as HTMLDivElement;
    this.fade.setAttribute('aria-hidden', 'true');
    parent.appendChild(this.root);
    parent.appendChild(this.fade);
  }

  /** Per frame: rebuild only when the choices change. */
  update(world: World): void {
    const choices = regionChoices(world);
    const key = choices.map((c) => c ?? 'grove').join(',');
    if (key === this.key) return;
    this.key = key;
    this.root.innerHTML = '';
    this.root.hidden = choices.length === 0;
    for (const r of choices) {
      const label =
        r === null
          ? STORY_REGION_TEXT.back
          : STORY_REGION_TEXT.goTo(STORY_REGION_TEXT.names[r] ?? r);
      const b = button(label, () => goToRegion(this.send, r, this.fade), 'btn btn-primary');
      b.dataset.region = r ?? 'grove';
      this.root.appendChild(b);
    }
  }

  /** The region events as toasts. */
  onEvents(events: readonly SimEvent[], toast: (text: string) => void): void {
    for (const e of events) {
      if (e.kind === 'storyRegionOpened') {
        const line = STORY_REGION_TEXT.opened[e.region];
        if (line) toast(line);
      } else if (e.kind === 'storyRegionEntered') {
        toast(STORY_REGION_TEXT.entered(STORY_REGION_TEXT.names[e.region] ?? e.region));
      } else if (e.kind === 'storyRegionLeft') {
        toast(STORY_REGION_TEXT.left);
      } else if (e.kind === 'storyRegionRefused') {
        const why = STORY_REGION_TEXT.refused[e.reason];
        if (why) toast(why);
      }
    }
  }
}
