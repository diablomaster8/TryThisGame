import { BIOME_REACTIONS } from '../config/region-wild';

/**
 * R13 d2 (R0121): the dev-only reaction gallery (`?reactions`): every biome with a reaction
 * table, one row each, a column per personality, so a missing or repeated line shows at a
 * glance. Never shipped (loaded only under `import.meta.env.DEV`).
 */
export function mountReactionGallery(): void {
  const root = document.createElement('div');
  root.id = 'reaction-gallery';
  root.style.cssText =
    'position:fixed;inset:0;z-index:99999;overflow:auto;background:#1b1a24;color:#eee;font:12px sans-serif;padding:8px';
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  let head = false;
  for (const [biome, set] of Object.entries(BIOME_REACTIONS)) {
    if (!set) continue;
    if (!head) {
      head = true;
      const tr = table.insertRow();
      tr.insertCell().textContent = 'biome';
      for (const p of Object.keys(set)) tr.insertCell().textContent = p;
    }
    const tr = table.insertRow();
    tr.insertCell().textContent = biome;
    for (const r of Object.values(set)) {
      const td = tr.insertCell();
      td.textContent = `${r.state}${r.hide ? ' (hides)' : ''}: ${r.line}`;
      td.style.cssText = 'border:1px solid #555;padding:4px;max-width:150px';
    }
  }
  root.append(table);
  document.body.append(root);
}
