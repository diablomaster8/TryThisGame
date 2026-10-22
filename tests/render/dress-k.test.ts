import { describe, expect, it } from 'vitest';
import { SCENE_STAGES } from '../../src/config/scene-stages';
import { stageHides } from '../../src/config/stage-sets';
import { CG2_K, PLAQUE_OUTLINES } from '../../src/config/tuning-k';
import { memorialSpot } from '../../src/render/memorial-spot';
import { insideOutline, paintPlaqueSprite } from '../../src/render/paint/campaign-k';
import { createWorld } from '../../src/sim/world';
import type { Memorial } from '../../src/sim/types';

describe('package k: campaign landmark kits (H3, M4, M5, N7)', () => {
  it('gives every staged scene of the four campaigns its set', () => {
    const want: Record<string, string> = {
      'h-': 'fold',
      'l-': 'logged',
      'b-': 'beetle',
      'dawn-': 'dawndusk',
      'dusk-': 'dawndusk',
    };
    let n = 0;
    for (const [id, st] of Object.entries(SCENE_STAGES))
      for (const [prefix, set] of Object.entries(want))
        if (id.startsWith(prefix) && /-c\d+-(open|close)$/.test(id)) {
          expect(st.set, id).toBe(set);
          n++;
        }
    expect(n).toBeGreaterThan(60);
  });

  it('hides the Grove-only buildings per set, and the mill and well where they do not belong', () => {
    expect(stageHides({ set: 'fold' })).toContain('nursery');
    expect(stageHides({ set: 'fold' })).not.toContain('well');
    for (const set of ['logged', 'beetle'] as const) {
      expect(stageHides({ set })).toEqual(
        expect.arrayContaining(['cottage', 'dojo', 'windmill', 'well']),
      );
    }
    expect(stageHides({})).toEqual([]);
  });

  it('keeps the Beetle Road cart shut in chapter 2 and open in chapter 5', () => {
    expect(SCENE_STAGES['b-c2-open']?.props?.cart).toBe('shut');
    expect(SCENE_STAGES['b-c5-open']?.props?.cart).toBe('open');
    expect(SCENE_STAGES['b-c1-open']?.props?.banners).toBe('show');
  });

  it('draws four distinct carved silhouettes that fill most of their box', () => {
    const seen = new Set<string>();
    for (const name of Object.keys(PLAQUE_OUTLINES) as Array<keyof typeof PLAQUE_OUTLINES>) {
      const o = PLAQUE_OUTLINES[name];
      let inside = 0;
      for (let j = 0; j < 8; j++)
        for (let i = 0; i < 12; i++) if (insideOutline(o, (i + 0.5) / 12, (j + 0.5) / 8)) inside++;
      expect(inside, name).toBeGreaterThan(20);
      expect(inside, name).toBeLessThan(80);
      seen.add(Array.from(paintPlaqueSprite(name).data).join(''));
    }
    expect(seen.size).toBe(4);
    expect(CG2_K.plaque.creatures).toHaveLength(4);
  });

  it("keeps campaign memorials on their own marks and Hazel's where they stood", () => {
    const w = createWorld(1, 0);
    const mem = (i: number): Memorial => ({ id: `m${i}`, name: `n${i}`, pos: { x: 9, z: 9 } });
    w.memorials = [mem(0), mem(1), mem(2)];
    expect(memorialSpot(w, w.memorials[1]!)).toEqual({ x: 9, z: 9 });
    w.campaign = { storyline: 'hundred' } as unknown as typeof w.campaign;
    const a = memorialSpot(w, w.memorials[0]!);
    const b = memorialSpot(w, w.memorials[1]!);
    expect(a).not.toEqual(b);
    // Round the well, and stable when a flower is added.
    expect(Math.hypot(a.x - 3, a.z - 10)).toBeLessThan(3);
    w.memorials.push(mem(3));
    expect(memorialSpot(w, w.memorials[0]!)).toEqual(a);
    w.campaign = { storyline: 'dawn' } as unknown as typeof w.campaign;
    const d = memorialSpot(w, w.memorials[0]!);
    expect(Math.hypot(d.x + 4, d.z + 14)).toBeGreaterThan(3);
  });
});
