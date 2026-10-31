/**
 * R0118 (WORLD-51): season-only drift in the Pixel Grove: blossom falling off the fruit trees
 * in spring, fireflies about the Keeper on summer nights, leaves coming down in autumn. They
 * are ordinary particles from the existing layer (one draw call, the same pool), made only
 * near the Keeper, like the Hollow's air (cave-ambience.ts). Reduced motion and "off" density
 * make none, so nothing flickers for anyone who asked for calm.
 */
import { GROVE } from '../config/tuning';
import { SEASON_DRIFT } from '../config/tuning-r9d4';
import type { Season } from '../sim/types';
import type { Particles } from './particles';

export class SeasonDrift {
  private lastMs = 0;
  private due = 0;

  update(
    p: Particles,
    season: Season | null,
    keeper: { x: number; z: number },
    nowMs: number,
    reduceMotion: boolean,
    density: 'full' | 'light' | 'off',
    night: boolean,
  ): void {
    const dt = this.lastMs === 0 ? 0 : Math.min(0.1, (nowMs - this.lastMs) / 1000);
    this.lastMs = nowMs;
    if (!season || season === 'winter' || reduceMotion || density === 'off' || dt === 0) return;
    if (season === 'summer' && !night) return;
    const d = SEASON_DRIFT[season];
    this.due += d.rate * (density === 'light' ? 0.4 : 1) * dt;
    while (this.due >= 1) {
      this.due -= 1;
      if (season === 'summer') {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * SEASON_DRIFT.reach * 0.5;
        p.burst(
          'firefly',
          keeper.x + Math.cos(a) * r,
          0.4 + Math.random(),
          keeper.z + Math.sin(a) * r,
          1,
          {
            spread: 0,
            speed: 0.15,
            rise: 0.05,
            lifeMs: d.life,
            size: d.size,
            fadeMs: 600,
          },
        );
        continue;
      }
      // Blossom and leaves fall from a fruit tree's crown near the Keeper.
      const near = GROVE.trees.filter(
        (t) => Math.hypot(t.x - keeper.x, t.z - keeper.z) < SEASON_DRIFT.reach,
      );
      const t = near[Math.floor(Math.random() * near.length)];
      if (!t) break;
      p.burst(d.kind, t.x, 2 + Math.random() * 0.8, t.z, 1, {
        spread: 1.1,
        speed: 0.25,
        rise: -0.1,
        lifeMs: d.life,
        size: d.size,
        fadeMs: 500,
      });
    }
  }
}
