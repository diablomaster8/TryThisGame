/**
 * TECH-52: Settings → Quality. "Auto (Medium)" names the tier this device reads as; a pinned
 * tier is a device choice kept in localStorage beside the save (`platform/device-tier.ts`), and
 * Full 3D picks it up on the next load (the shadow filter is linked into every program).
 */
import { QUALITY_TEXT } from '../config/strings';
import { tierForRes } from '../config/tuning-world';
import { PERF_TIERS } from '../config/tuning-r8d-perf';
import type { Game } from '../game';
import { readDeviceTier, readQualityOverride, writeQualityOverride } from '../platform/device-tier';

export function mountQualitySetting(body: HTMLElement, game: () => Game | null): (g: Game) => void {
  const row = document.createElement('label');
  row.className = 'field-row';
  const label = document.createElement('strong');
  label.textContent = QUALITY_TEXT.label;
  const sel = document.createElement('select');
  const auto = document.createElement('option');
  auto.value = 'auto';
  sel.appendChild(auto);
  for (const t of PERF_TIERS) {
    const o = document.createElement('option');
    o.value = t;
    o.textContent = QUALITY_TEXT.tier[t];
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => {
    const v = sel.value;
    writeQualityOverride(v === 'low' || v === 'mid' || v === 'high' ? v : 'auto');
  });
  row.append(label, sel);
  const help = document.createElement('div');
  help.className = 'help';
  help.textContent = QUALITY_TEXT.help;
  body.append(row, help);
  const sync = (g: Game): void => {
    const res = g.world.settings.sculptRes;
    const detected = readDeviceTier(
      g.pipeline.renderer.getContext(),
      g.scene3d && res !== null ? tierForRes(res) : undefined,
      'auto',
    );
    auto.textContent = QUALITY_TEXT.auto(QUALITY_TEXT.tier[detected.tier]);
    sel.value = readQualityOverride();
  };
  const g = game();
  if (g) sync(g);
  return sync;
}
