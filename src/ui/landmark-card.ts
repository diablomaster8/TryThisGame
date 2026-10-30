import '../world-hud.css';
import { LANDMARKS } from '../config/tuning';
import { UI_TEXT } from '../config/strings';
import { PLACES_TEXT } from '../config/strings-world';
import { COLLECTIBLES } from '../config/region-collectibles';
import { WORLD_TRACES } from '../content/world-traces';
import { ACHIEVEMENT_LIST } from '../sim/achievements';
import type { SimEvent, World } from '../sim/types';

/**
 * R0107 (WORLD-49): finding a landmark is a moment. A name card drops in at the top for 2 s
 * with the place's name in region lettering, one line about it and a "Fast travel unlocked"
 * chip; the Journal's Places page (`placesRows`) lists every found landmark with the traces
 * and keepsakes found nearby. A trace or keepsake belongs to the landmark it lies nearest.
 */
export function landmarkName(id: string): string {
  return (UI_TEXT.landmarkNames as Record<string, string>)[id] ?? id;
}

export function mountLandmarkCard(
  root: HTMLElement,
): (id: string, batch?: readonly SimEvent[]) => void {
  const card = document.createElement('div');
  card.className = 'landmark-card';
  card.setAttribute('role', 'status');
  card.hidden = true;
  const icon = document.createElement('span');
  icon.className = 'landmark-card-icon';
  const name = document.createElement('strong');
  name.className = 'landmark-card-name';
  const line = document.createElement('small');
  line.className = 'landmark-card-line';
  const chip = document.createElement('span');
  chip.className = 'landmark-card-chip';
  chip.textContent = PLACES_TEXT.fastTravel;
  const paid = document.createElement('span');
  paid.className = 'landmark-card-paid';
  card.append(icon, name, line, chip, paid);
  root.appendChild(card);
  let timer = 0;
  return (id, batch = []) => {
    // Say where any Shells that came with the find are from (a badge it earned).
    const badge = batch.find((e) => e.kind === 'achievement');
    const title = badge && ACHIEVEMENT_LIST.find((a) => a.id === badge.id)?.title;
    paid.textContent = badge && title ? PLACES_TEXT.paid(badge.shells, title) : '';
    paid.hidden = !paid.textContent;
    const art = PLACES_TEXT.art[id as keyof typeof PLACES_TEXT.art];
    icon.textContent = art ?? '★';
    name.textContent = landmarkName(id);
    line.textContent = PLACES_TEXT.lines[id as keyof typeof PLACES_TEXT.lines] ?? '';
    card.hidden = false;
    // Restart the drop-in for a second find inside the 2 s.
    card.classList.remove('landmark-card-in');
    void card.offsetWidth;
    card.classList.add('landmark-card-in');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      card.hidden = true;
      card.classList.remove('landmark-card-in');
    }, PLACES_TEXT.cardMs);
  };
}

/** The Grove landmark nearest a point. */
function nearestLandmark(x: number, z: number): string {
  let best: string = LANDMARKS[0]!.id;
  let d = Infinity;
  for (const l of LANDMARKS) {
    const e = Math.hypot(l.x - x, l.z - z);
    if (e < d) {
      d = e;
      best = l.id;
    }
  }
  return best;
}

export interface PlaceRow {
  id: string;
  name: string;
  art: string;
  traces: { found: number; of: number };
  finds: { found: number; of: number };
}

/** The Places page: found landmarks in the order they were found, with their counts. */
export function placesRows(world: World): PlaceRow[] {
  const flags = world.campaign?.flags ?? {};
  const collected = world.collected ?? {};
  const count = () => ({ found: 0, of: 0 });
  const traces = new Map<string, { found: number; of: number }>();
  const finds = new Map<string, { found: number; of: number }>();
  for (const t of WORLD_TRACES) {
    if (t.region !== 'grove' || !t.at) continue;
    const at = nearestLandmark(t.at.x, t.at.z);
    const c = traces.get(at) ?? count();
    c.of++;
    if (flags[`trace:${t.id}`]) c.found++;
    traces.set(at, c);
  }
  for (const k of COLLECTIBLES) {
    if (k.region !== 'grove') continue;
    const at = nearestLandmark(k.x, k.z);
    const c = finds.get(at) ?? count();
    c.of++;
    if (collected[k.id] !== undefined) c.found++;
    finds.set(at, c);
  }
  return LANDMARKS.filter((l) => world.landmarks[l.id] !== undefined)
    .sort((a, b) => world.landmarks[a.id]! - world.landmarks[b.id]!)
    .map((l) => ({
      id: l.id,
      name: landmarkName(l.id),
      art: PLACES_TEXT.art[l.id as keyof typeof PLACES_TEXT.art] ?? '★',
      traces: traces.get(l.id) ?? { found: 0, of: 0 },
      finds: finds.get(l.id) ?? { found: 0, of: 0 },
    }));
}

/** The Places page body, for the Journal's Places tab. */
export function renderPlaces(world: World): HTMLElement {
  const box = document.createElement('div');
  box.className = 'places-page';
  const rows = placesRows(world);
  const head = document.createElement('p');
  head.className = 'help';
  head.textContent = PLACES_TEXT.count(rows.length, LANDMARKS.length);
  box.appendChild(head);
  for (const r of rows) {
    const row = document.createElement('div');
    row.className = 'places-row';
    const art = document.createElement('span');
    art.className = 'places-art';
    art.textContent = r.art;
    art.setAttribute('aria-hidden', 'true');
    const text = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = r.name;
    const small = document.createElement('small');
    small.textContent = PLACES_TEXT.counts(r.traces, r.finds);
    text.append(name, small);
    row.append(art, text);
    box.appendChild(row);
  }
  return box;
}
