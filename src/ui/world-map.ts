/**
 * The drawn map (WORLD-02), replacing the old button grid. One DOM canvas serves both
 * renderers: the Grove's ground painted small (`render/map-paint.ts`), the Keeper as an arrow
 * with the camera's view as a soft wedge, the Nubbins as dots with their type's icon, and the
 * landmarks and region exits as label chips. Chips are laid out in screen space after every
 * pan or zoom so no two 44 px hit boxes overlap; a leader line ties each one to its spot.
 * A tab strip lists the regions found so far. The map only reads the world and sends commands.
 */
import '../world.css';
import type { StoryRegionId } from '../config/story-regions';
import { regionLine, storyRegionHere } from '../sim/story-regions';
import { hasStoryRegions, storyRegionPage, storyRegionTabs } from './map-regions';
import { REGIONS, type RegionId } from '../config/regions';
import { markAt } from '../config/stage-marks';
import { STAGE_SET_HIDES, type StageSet } from '../config/stage-sets';
import { STAT_ICONS, STORY_U4_TEXT, TITLE_CARD_TEXT, UI_TEXT } from '../config/strings';
import { TRAVEL_TEXT, WORLD_TEXT } from '../config/strings-world';
import { CG4_U4 } from '../config/tuning-u4';
import { GROVE } from '../config/tuning';
import { WORLD_MAP } from '../config/tuning-world';
import type { Game } from '../game';
import { MAP_PPU, paintGroveMap, toMapPx } from '../render/map-paint';
import { landmarkList } from '../sim/landmarks';
import { regionOf, regionsFound, travelBlock } from '../sim/regions';
import { travelMode } from '../sim/travel';
import type { NubbinType, World } from '../sim/types';
import { button, el, modal } from './dom';
import { playIris } from './travel-iris';
import { keepsakeLine } from './collection';
import { MAP_LAYER_TEXT } from '../config/strings-world';
import { MAP_LAYERS, mapOverlay, type MapLayer } from '../sim/map-overlays';

interface Chip {
  key: string;
  x: number;
  z: number;
  label: string;
  cls: string;
  node: HTMLButtonElement;
  w: number;
  h: number;
  /** Where the chip landed on the last layout, in view pixels. */
  at: { x: number; y: number } | null;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const TYPE_ICON: Record<NubbinType, string> = {
  normal: '⭐',
  swim: STAT_ICONS.swim,
  fly: STAT_ICONS.fly,
  run: STAT_ICONS.run,
  power: STAT_ICONS.power,
};

/** Whether two rectangles overlap, with a small gap counted as touching. */
export function overlaps(a: Rect, b: Rect, gap = 2): boolean {
  return (
    a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap
  );
}

/**
 * Place label boxes near their anchors without overlaps, inside the view. Greedy: the most
 * crowded anchors choose first, each tries below, above, right, left, then rings further out.
 * Returns the chosen top-left per box, or null for one with no anchor on screen.
 */
export function layoutChips(
  boxes: ReadonlyArray<{ ax: number; ay: number; w: number; h: number }>,
  viewW: number,
  viewH: number,
): Array<{ x: number; y: number } | null> {
  const out: Array<{ x: number; y: number } | null> = boxes.map(() => null);
  const placed: Rect[] = [];
  const crowd = boxes.map(
    (b) => boxes.filter((o) => Math.hypot(o.ax - b.ax, o.ay - b.ay) < WORLD_MAP.crowdPx).length,
  );
  const order = boxes
    .map((_, i) => i)
    .filter((i) => {
      const b = boxes[i]!;
      return b.ax >= 0 && b.ay >= 0 && b.ax <= viewW && b.ay <= viewH;
    })
    .sort((i, j) => crowd[j]! - crowd[i]! || boxes[i]!.ay - boxes[j]!.ay);
  for (const i of order) {
    const b = boxes[i]!;
    const cands: Array<{ x: number; y: number }> = [
      { x: b.ax - b.w / 2, y: b.ay + 6 },
      { x: b.ax - b.w / 2, y: b.ay - 6 - b.h },
      { x: b.ax + 8, y: b.ay - b.h / 2 },
      { x: b.ax - 8 - b.w, y: b.ay - b.h / 2 },
    ];
    for (let r = WORLD_MAP.ringPx; r <= WORLD_MAP.ringPx * WORLD_MAP.rings; r += WORLD_MAP.ringPx) {
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * Math.PI * 2;
        cands.push({ x: b.ax + Math.cos(a) * r - b.w / 2, y: b.ay + Math.sin(a) * r - b.h / 2 });
      }
    }
    let pick: { x: number; y: number } | null = null;
    for (const c of cands) {
      if (c.x < 0 || c.y < 0 || c.x + b.w > viewW || c.y + b.h > viewH) continue;
      const r = { x: c.x, y: c.y, w: b.w, h: b.h };
      if (placed.some((p) => overlaps(p, r))) continue;
      pick = c;
      break;
    }
    // Nothing near is free: take the nearest free spot anywhere in the view, and only if the
    // view is full, clamp the first choice in (it may overlap; the phone check catches it).
    if (!pick) {
      let best = Infinity;
      for (let y = 0; y + b.h <= viewH; y += 6) {
        for (let x = 0; x + b.w <= viewW; x += 6) {
          const d = Math.hypot(x + b.w / 2 - b.ax, y + b.h / 2 - b.ay);
          if (d >= best) continue;
          const r = { x, y, w: b.w, h: b.h };
          if (placed.some((p) => overlaps(p, r))) continue;
          best = d;
          pick = { x, y };
        }
      }
    }
    pick ??= {
      x: Math.min(Math.max(0, cands[0]!.x), viewW - b.w),
      y: Math.min(Math.max(0, cands[0]!.y), viewH - b.h),
    };
    placed.push({ x: pick.x, y: pick.y, w: b.w, h: b.h });
    out[i] = pick;
  }
  return out;
}

export class WorldMapPanel {
  private readonly dialog;
  private readonly tabs: HTMLDivElement;
  private readonly campaign: HTMLParagraphElement;
  private readonly view: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly lines: SVGSVGElement;
  private readonly chipLayer: HTMLDivElement;
  private readonly dotLayer: HTMLDivElement;
  private readonly keeper: HTMLDivElement;
  private readonly elsewhere: HTMLDivElement;
  private readonly sheet: HTMLDivElement;
  private chips: Chip[] = [];
  /** R0122: the overlay layer chips, which layers are on, and the counts line. */
  private readonly layerRow: HTMLDivElement;
  private readonly layerLine: HTMLParagraphElement;
  private readonly layersOn = new Set<MapLayer>(['quests', 'travel']);
  private tab: RegionId = 'grove';
  /** Lane C r10 agent A (R0650): the questline region page shown, or null for `tab`. */
  private storyTab: StoryRegionId | null = null;
  private storyTabs: HTMLElement | null = null;
  private zoom = 1;
  private panX = 0;
  private panY = 0;
  private painted = '';
  private timer: number | null = null;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private dragged = false;
  private lastTap = 0;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.map, UI_TEXT.close);
    this.dialog.root.classList.add('wm-modal');
    const body = this.dialog.body;
    this.tabs = el('div', 'wm-tabs');
    this.tabs.setAttribute('role', 'tablist');
    this.campaign = el('p', 'help map-campaign-title');
    this.view = el('div', 'wm-view');
    this.canvas = el('canvas', 'wm-ground');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.dotLayer = el('div', 'wm-dots');
    this.keeper = el('div', 'wm-keeper');
    this.keeper.setAttribute('role', 'img');
    this.keeper.setAttribute('aria-label', WORLD_TEXT.youAreHere);
    this.keeper.innerHTML = '<span class="wm-cone"></span><span class="wm-arrow"></span>';
    this.lines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.lines.classList.add('wm-lines');
    this.lines.setAttribute('aria-hidden', 'true');
    this.chipLayer = el('div', 'wm-chips');
    this.view.append(this.canvas, this.dotLayer, this.lines, this.keeper, this.chipLayer);
    const centre = button(WORLD_TEXT.centre, () => this.centre(), 'btn btn-small wm-centre');
    this.elsewhere = el('div', 'wm-elsewhere');
    this.sheet = el('div', 'wm-sheet');
    this.sheet.hidden = true;
    body.append(
      el('p', 'help', WORLD_TEXT.mapHelp),
      this.tabs,
      this.campaign,
      this.view,
      centre,
      this.elsewhere,
      this.sheet,
    );
    // R0122: overlay layers between the tabs and the map.
    this.layerRow = el('div', 'wm-layers');
    this.layerLine = el('p', 'wm-layer-line');
    body.insertBefore(this.layerRow, this.view);
    body.insertBefore(this.layerLine, this.view);
    this.bindGestures();
  }

  open(): void {
    // The Grove is the only region drawn so far, so the map always opens on it.
    this.tab = 'grove';
    // R0650: inside a questline's region the map opens on that region's page.
    const gw = this.game()?.world;
    this.storyTab = gw && hasStoryRegions(gw) ? storyRegionHere(gw) : null;
    this.zoom = 1;
    this.sheet.hidden = true;
    this.dialog.show();
    this.refresh();
    this.centre();
    if (this.timer === null) {
      this.timer = window.setInterval(() => {
        if (!this.dialog.isOpen()) {
          window.clearInterval(this.timer!);
          this.timer = null;
          return;
        }
        this.drawLive();
      }, WORLD_MAP.liveMs);
    }
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  refresh(): void {
    const g = this.game();
    if (!g) return;
    this.drawTabs(g.world);
    this.drawStoryTabs(g.world);
    const grove = this.tab === 'grove' && this.storyTab === null;
    this.view.hidden = !grove;
    this.elsewhere.hidden = grove;
    if (this.storyTab) {
      this.elsewhere.innerHTML = '';
      this.elsewhere.appendChild(
        storyRegionPage(
          g,
          this.storyTab,
          this.toast,
          () => this.close(),
          document.querySelector('.region-fade'),
        ),
      );
      return;
    }
    if (!grove) {
      this.drawElsewhere(g);
      return;
    }
    this.paint(g.world);
    this.buildChips(g);
    this.drawLayers(g);
    this.layout();
  }

  private drawTabs(w: World): void {
    this.tabs.innerHTML = '';
    const found = regionsFound(w);
    for (const id of found) {
      const b = button(
        WORLD_TEXT.regions[id],
        () => {
          this.tab = id;
          this.storyTab = null;
          this.sheet.hidden = true;
          this.refresh();
        },
        `btn btn-small wm-tab${id === this.tab ? ' btn-primary' : ''}`,
      );
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(id === this.tab));
      // R0122: a completion ring on each found region's tab.
      const pct = Math.round(mapOverlay(w, id).completion * 100);
      const ring = el('span', 'wm-ring');
      ring.style.setProperty('--pct', `${pct}`);
      ring.title = MAP_LAYER_TEXT.complete(pct);
      b.setAttribute('aria-label', `${WORLD_TEXT.regions[id]}, ${MAP_LAYER_TEXT.complete(pct)}`);
      b.appendChild(ring);
      this.tabs.appendChild(b);
    }
    // Built places not reached yet show as a fogged tab, so the world has edges to wonder at.
    for (const id of Object.keys(REGIONS) as RegionId[]) {
      if (!REGIONS[id].built || found.includes(id)) continue;
      const b = button(
        '?',
        () => this.toast(WORLD_TEXT.unknownRegion),
        'btn btn-small wm-tab wm-fog',
      );
      b.setAttribute('aria-label', WORLD_TEXT.unknownRegion);
      this.tabs.appendChild(b);
    }
    // R0091: the shown region's one-time collectibles.
    const old = this.tabs.nextElementSibling;
    if (old?.classList.contains('wm-keepsakes')) old.remove();
    this.tabs.after(el('p', 'wm-keepsakes', keepsakeLine(w, this.tab)));
  }

  /** Lane C r10 agent A (R0650): the questline regions' tabs, under the map's own. */
  private drawStoryTabs(w: World): void {
    this.storyTabs?.remove();
    this.storyTabs = null;
    if (!hasStoryRegions(w)) return;
    this.storyTabs = storyRegionTabs(
      w,
      this.storyTab,
      (r) => {
        this.storyTab = r;
        this.sheet.hidden = true;
        this.refresh();
      },
      this.toast,
    );
    this.tabs.after(this.storyTabs);
  }

  private drawElsewhere(g: Game): void {
    const w = g.world;
    const def = REGIONS[this.tab];
    this.elsewhere.innerHTML = '';
    this.elsewhere.appendChild(
      el('p', 'help', WORLD_TEXT.regionNotDrawn(WORLD_TEXT.regions[this.tab])),
    );
    if (regionOf(w.location) === this.tab) {
      this.elsewhere.appendChild(el('p', 'wm-here', `➤ ${WORLD_TEXT.youAreHere}`));
    }
    for (const e of def.exits) {
      const name = WORLD_TEXT.regions[e.to];
      const b = button(
        `➜ ${WORLD_TEXT.exitTo(name)}`,
        () => {
          const why = travelBlock(w, e.id);
          if (why) {
            this.toast(WORLD_TEXT.refused[why] ?? UI_TEXT.notFromHere);
            return;
          }
          g.send({ kind: 'travel', exit: e.id });
          this.toast(UI_TEXT.travelled);
          this.close();
        },
        'btn btn-small wm-exit-btn',
      );
      b.disabled = regionOf(w.location) !== this.tab;
      this.elsewhere.appendChild(b);
    }
  }

  /** Paint the ground once per tiles and season; the bitmap is reused for every pan and zoom. */
  private paint(w: World): void {
    const season = w.season === 'winter' ? 'winter' : null;
    const key = `${season}|${Object.keys(w.tiles).length}|${JSON.stringify(w.tiles).length}`;
    if (key === this.painted) return;
    this.painted = key;
    const p = paintGroveMap(w.tiles, season);
    this.canvas.width = p.width;
    this.canvas.height = p.height;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(p.width, p.height);
    img.data.set(p.rgba);
    ctx.putImageData(img, 0, 0);
  }

  private buildChips(g: Game): void {
    const w = g.world;
    this.chipLayer.innerHTML = '';
    this.chips = [];
    const names = UI_TEXT.landmarkNames as Record<string, string>;
    // K33: while a separate campaign runs, the Grove's own spots its set takes away go, and the
    // set's places are added.
    // Lane C r10 agent A (R0605): beside Hazel's Grove, the set of the region the Keeper is in.
    const story = w.campaign?.storyline ?? regionLine(w)?.storyline ?? null;
    const set = (story ? (CG4_U4.map.setOf as Record<string, StageSet>)[story] : undefined) ?? null;
    const hidden: readonly string[] = set ? STAGE_SET_HIDES[set] : [];
    this.campaign.hidden = !set;
    this.campaign.textContent = story
      ? STORY_U4_TEXT.mapCampaign(TITLE_CARD_TEXT.campaigns[story] ?? story)
      : '';
    const add = (
      key: string,
      x: number,
      z: number,
      label: string,
      cls: string,
      onTap: () => void,
    ): HTMLButtonElement => {
      const node = button(
        label,
        () => {
          if (this.dragged) return;
          onTap();
        },
        `wm-chip ${cls}`,
      );
      node.dataset.key = key;
      this.chipLayer.appendChild(node);
      this.chips.push({ key, x, z, label, cls, node, w: 0, h: 0, at: null });
      return node;
    };
    for (const id of set ? CG4_U4.map.marks[set] : []) {
      const m = markAt('grove', id);
      if (!m) continue;
      const name = STORY_U4_TEXT.landmarks[id] ?? id;
      add(`mark:${id}`, m.x, m.z, `◆ ${name}`, 'wm-mark', () =>
        this.openSheet(name, m.x, m.z, true, { pos: { x: m.x, z: m.z } }),
      );
    }
    for (const l of landmarkList()) {
      if (hidden.includes(l.id)) continue;
      const found = w.landmarks[l.id] !== undefined;
      const name = names[l.id] ?? l.id;
      const node = add(
        `landmark:${l.id}`,
        l.x,
        l.z,
        found ? `📍 ${name}` : '?',
        found ? 'wm-found' : 'wm-unfound',
        () =>
          found
            ? this.openSheet(name, l.x, l.z, true, { poi: l.id })
            : this.openSheet('?', l.x, l.z, false),
      );
      if (!found) node.setAttribute('aria-label', WORLD_TEXT.notFound);
    }
    for (const e of REGIONS.grove.exits) {
      // Ways to regions not built yet lead nowhere, so the map keeps quiet about them.
      if (!REGIONS[e.to].built) continue;
      const to = WORLD_TEXT.regions[e.to];
      add(
        `exit:${e.id}`,
        e.rect.x + e.rect.w / 2,
        e.rect.z + e.rect.h / 2,
        `➜ ${to}`,
        'wm-exit',
        () => this.toast(WORLD_TEXT.exitTo(to)),
      );
    }
  }

  /**
   * R0122 (WORLD-55): the layer toggles, the counts line for the layers that are on, and a
   * chip at every found keepsake and read trace. With Travel off the found landmarks' chips go.
   */
  private drawLayers(g: Game): void {
    const o = mapOverlay(g.world, this.tab);
    this.layerRow.innerHTML = '';
    for (const id of MAP_LAYERS) {
      const on = this.layersOn.has(id);
      const b = button(
        MAP_LAYER_TEXT.layers[id],
        () => {
          if (this.layersOn.has(id)) this.layersOn.delete(id);
          else this.layersOn.add(id);
          this.refresh();
        },
        `btn btn-small wm-layer${on ? ' btn-primary' : ''}`,
      );
      b.setAttribute('aria-pressed', String(on));
      this.layerRow.appendChild(b);
    }
    const parts: string[] = [];
    if (this.layersOn.has('quests'))
      parts.push(
        MAP_LAYER_TEXT.quests(
          o.quests.active.length,
          o.quests.available.length,
          o.quests.done.length,
        ),
      );
    if (this.layersOn.has('keepsakes'))
      parts.push(MAP_LAYER_TEXT.keepsakes(o.keepsakes.got, o.keepsakes.of));
    if (this.layersOn.has('traces')) parts.push(MAP_LAYER_TEXT.traces(o.traces.got, o.traces.of));
    if (this.layersOn.has('travel')) parts.push(MAP_LAYER_TEXT.travel(o.travel.length));
    this.layerLine.textContent = parts.join(' · ');
    this.layerLine.hidden = parts.length === 0;
    if (!this.layersOn.has('travel')) {
      for (const c of this.chips.filter((c) => c.cls === 'wm-found')) c.node.remove();
      this.chips = this.chips.filter((c) => c.cls !== 'wm-found');
    }
    const spot = (key: string, x: number, z: number, label: string): void => {
      const node = button(label, () => {}, 'wm-chip wm-spot');
      node.dataset.key = key;
      node.tabIndex = -1;
      node.setAttribute('aria-hidden', 'true');
      this.chipLayer.appendChild(node);
      this.chips.push({ key, x, z, label, cls: 'wm-spot', node, w: 0, h: 0, at: null });
    };
    if (this.layersOn.has('keepsakes'))
      for (const s of o.keepsakes.spots)
        spot(`keep:${s.id}`, s.x, s.z, MAP_LAYER_TEXT.keepsakeSpot);
    if (this.layersOn.has('traces'))
      for (const s of o.traces.spots) spot(`trace:${s.id}`, s.x, s.z, MAP_LAYER_TEXT.traceSpot);
  }

  /** The sheet for a tapped spot: its name, travel, and what asks there. */
  private openSheet(
    name: string,
    x: number,
    z: number,
    found: boolean,
    to: { poi?: string; pos?: { x: number; z: number } } = { pos: { x, z } },
  ): void {
    const g = this.game();
    if (!g) return;
    this.sheet.innerHTML = '';
    this.sheet.hidden = false;
    this.sheet.appendChild(el('h3', undefined, name));
    if (!found) {
      this.sheet.appendChild(el('p', 'help', WORLD_TEXT.notFound));
      return;
    }
    // R0102: with Auto-walk, a pin in the Grove is walked to (at a run), not hopped to.
    const walk = travelMode(g.world) === 'auto' && g.world.location === 'grove' && !!to.pos;
    const go = button(
      walk ? TRAVEL_TEXT.walkHere : WORLD_TEXT.travelHere,
      () => {
        const w = g.world;
        if (walk && to.pos) {
          this.close();
          g.send({ kind: 'travelAssist', pos: { ...to.pos } });
          return;
        }
        // R0074: never in the middle of a story scene.
        if (document.documentElement.classList.contains('dialogue-open')) {
          this.toast(WORLD_TEXT.travelBusy);
          return;
        }
        const where = regionOf(w.location);
        if (w.location === 'grove') {
          // Already home.
        } else if (where === 'lane' && !travelBlock(w, 'lane-gate')) {
          g.send({ kind: 'travel', exit: 'lane-gate' });
        } else {
          this.toast(UI_TEXT.notFromHere);
          return;
        }
        this.close();
        playIris(() => g.send({ kind: 'fastTravel', ...to }));
        this.toast(UI_TEXT.travelled);
      },
      'btn btn-primary wm-travel',
    );
    this.sheet.appendChild(go);
    go.focus();
  }

  private get scale(): number {
    const size = this.view.clientWidth || 1;
    return (size / (GROVE.size * MAP_PPU)) * this.zoom;
  }

  /** Keep the map covering the view. */
  private clampPan(): void {
    const size = this.view.clientWidth;
    const span = GROVE.size * MAP_PPU * this.scale;
    this.panX = Math.min(0, Math.max(size - span, this.panX));
    this.panY = Math.min(0, Math.max(size - span, this.panY));
  }

  private screen(x: number, z: number): { x: number; y: number } {
    return { x: toMapPx(x) * this.scale + this.panX, y: toMapPx(z) * this.scale + this.panY };
  }

  /** Centre on the Keeper (double-tap, the Find me button, and on open). */
  centre(): void {
    const g = this.game();
    if (!g || this.view.hidden) return;
    const size = this.view.clientWidth;
    const k = g.world.location === 'grove' ? g.world.keeper.pos : GROVE.keeperStart;
    const s = this.screen(k.x, k.z);
    this.panX += size / 2 - s.x;
    this.panY += size / 2 - s.y;
    this.layout();
  }

  private layout(): void {
    if (this.view.hidden) return;
    this.clampPan();
    const s = this.scale;
    const size = this.view.clientWidth;
    const span = GROVE.size * MAP_PPU * s;
    this.canvas.style.width = `${span}px`;
    this.canvas.style.height = `${span}px`;
    this.canvas.style.transform = `translate(${this.panX}px, ${this.panY}px)`;
    for (const c of this.chips) {
      c.node.hidden = false;
      c.node.style.left = '0px';
      c.node.style.top = '0px';
      c.w = c.node.offsetWidth;
      c.h = c.node.offsetHeight;
    }
    const anchors = this.chips.map((c) => ({ ...this.anchor(c), w: c.w, h: c.h }));
    const spots = layoutChips(anchors, size, size);
    let svg = '';
    this.chips.forEach((c, i) => {
      const p = spots[i] ?? null;
      c.at = p;
      c.node.hidden = !p;
      if (!p) return;
      c.node.style.left = `${p.x}px`;
      c.node.style.top = `${p.y}px`;
      const a = anchors[i]!;
      const nx = Math.min(Math.max(a.ax, p.x), p.x + c.w);
      const ny = Math.min(Math.max(a.ay, p.y), p.y + c.h);
      svg += `<circle cx="${a.ax}" cy="${a.ay}" r="3" class="wm-pin ${c.cls}"/>`;
      if (Math.hypot(nx - a.ax, ny - a.ay) > 6) {
        svg += `<line x1="${a.ax}" y1="${a.ay}" x2="${nx}" y2="${ny}"/>`;
      }
    });
    this.lines.setAttribute('viewBox', `0 0 ${size} ${size}`);
    this.lines.innerHTML = svg;
    this.drawLive();
  }

  private anchor(c: Chip): { ax: number; ay: number } {
    const p = this.screen(c.x, c.z);
    return { ax: p.x, ay: p.y };
  }

  /** The parts that move while the map is open: the Keeper and the Nubbins. */
  private drawLive(): void {
    const g = this.game();
    if (!g || this.view.hidden) return;
    const w = g.world;
    const home = w.location === 'grove';
    this.keeper.hidden = !home;
    if (home) {
      const p = this.screen(w.keeper.pos.x, w.keeper.pos.z);
      this.keeper.style.transform = `translate(${p.x}px, ${p.y}px)`;
      this.keeper.dataset.x = p.x.toFixed(2);
      this.keeper.dataset.y = p.y.toFixed(2);
      // facing is atan2(dx, dz): 0 faces +z (down the map). CSS rotates clockwise from up.
      const arrow = this.keeper.querySelector<HTMLElement>('.wm-arrow');
      if (arrow) arrow.style.transform = `rotate(${Math.PI - w.keeper.facing}rad)`;
      // The camera sits at +sin(yaw), +cos(yaw) from its target and looks back the other way.
      const cone = this.keeper.querySelector<HTMLElement>('.wm-cone');
      if (cone) cone.style.transform = `rotate(${-g.camera.currentYaw}rad)`;
    }
    this.dotLayer.innerHTML = '';
    if (!home) return;
    for (const n of w.nubbins) {
      if (n.stage === 'egg') continue;
      const p = this.screen(n.pos.x, n.pos.z);
      const type: NubbinType = n.form?.type ?? 'normal';
      const d = el('span', `wm-dot wm-t-${type}`, TYPE_ICON[type]);
      d.style.transform = `translate(${p.x}px, ${p.y}px)`;
      d.setAttribute('role', 'img');
      d.setAttribute('aria-label', WORLD_TEXT.nubbinDot(n.name));
      this.dotLayer.appendChild(d);
    }
  }

  private zoomAt(factor: number, cx: number, cy: number): void {
    const before = this.zoom;
    this.zoom = Math.min(WORLD_MAP.maxZoom, Math.max(1, this.zoom * factor));
    const k = this.zoom / before;
    this.panX = cx - (cx - this.panX) * k;
    this.panY = cy - (cy - this.panY) * k;
    this.layout();
  }

  private bindGestures(): void {
    const v = this.view;
    const local = (e: PointerEvent | WheelEvent) => {
      const r = v.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    v.addEventListener('pointerdown', (e) => {
      this.pointers.set(e.pointerId, local(e));
      if (this.pointers.size === 1) this.dragged = false;
    });
    v.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const now = local(e);
      if (this.pointers.size === 1) {
        const dx = now.x - prev.x;
        const dy = now.y - prev.y;
        if (!this.dragged && Math.hypot(dx, dy) < WORLD_MAP.dragSlopPx) return;
        if (!this.dragged) v.setPointerCapture(e.pointerId);
        this.dragged = true;
        this.panX += dx;
        this.panY += dy;
        this.pointers.set(e.pointerId, now);
        this.layout();
        return;
      }
      const others = [...this.pointers.entries()].filter(([id]) => id !== e.pointerId);
      const o = others[0]?.[1];
      if (!o) return;
      const before = Math.hypot(prev.x - o.x, prev.y - o.y);
      const after = Math.hypot(now.x - o.x, now.y - o.y);
      this.pointers.set(e.pointerId, now);
      this.dragged = true;
      if (before > 4) this.zoomAt(after / before, (now.x + o.x) / 2, (now.y + o.y) / 2);
    });
    const up = (e: PointerEvent) => {
      if (!this.pointers.delete(e.pointerId)) return;
      if (this.dragged || this.pointers.size > 0) return;
      const t = performance.now();
      if (t - this.lastTap < WORLD_MAP.doubleTapMs) {
        this.lastTap = 0;
        this.centre();
      } else this.lastTap = t;
    };
    v.addEventListener('pointerup', up);
    v.addEventListener('pointercancel', (e) => this.pointers.delete(e.pointerId));
    v.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const p = local(e);
        this.zoomAt(e.deltaY < 0 ? 1.25 : 0.8, p.x, p.y);
      },
      { passive: false },
    );
  }
}
