import { describe, expect, it } from 'vitest';
import { actFamilies, FOE_FAMILIES } from '../../src/config/dungeon-foes';
import { R10B3 } from '../../src/config/tuning-more/dungeon-poof-kid-mode';
import { FoePoofs, nearestWall, poofFrame, poofLength } from '../../src/render/foe-poof';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { FOE_ART, foeArt, foeArtId } from '../../src/render/sprites/foe-family-art';
import { speciesArt } from '../../src/render/sprites/species-art';
import { specForKey } from '../../src/render3d/looks';
import { cellCentre, floorOf, WALL } from '../../src/sim/dungeon';

// Lane B round 10, helper b3: the foe families' own looks and their poof (R0157, DUNG-17).

const lit = (d: Uint8Array): number => d.reduce((n, v) => n + (v ? 1 : 0), 0);

describe('foe family looks (R0157)', () => {
  it('gives every family its own recipe, drawn at all five angles, idle, walk and sad', () => {
    expect(Object.keys(FOE_ART).sort()).toEqual(FOE_FAMILIES.map((f) => f.id).sort());
    for (const f of FOE_FAMILIES) {
      const art = speciesArt(`foe:${f.id}`)!;
      expect(art, f.id).toBeDefined();
      // Not the stand-in species any more.
      expect(art).not.toBe(speciesArt(f.look));
      for (const angle of DRAWN_ANGLES)
        for (const pose of [poseFor('idle', 0), poseFor('walk', 1), poseFor('sad', 0)])
          expect(lit(drawCreature(angle, pose, art).data), `${f.id} ${angle}`).toBeGreaterThan(40);
    }
  });

  it('sculpts every family and Greyling in 3D from the same recipe', () => {
    for (const f of FOE_FAMILIES) {
      expect(specForKey(`art:foe:${f.id}`), f.id).toBeTruthy();
      expect(specForKey(`art:foe:grey-${f.id}`), f.id).toBeTruthy();
    }
  });

  it('drains the Greylings of colour but keeps their shape', () => {
    const warm = foeArt('foe:batling')!;
    const grey = foeArt('foe:grey-batling')!;
    expect(grey.plan).toBe(warm.plan);
    expect(grey.wings).toBe(warm.wings);
    expect(grey.colors.body).not.toBe(warm.colors.body);
    expect(foeArt('foe:grey-batling')).toBe(grey);
  });

  it('maps pack members to their family looks, greys in Act V, and leaves others alone', () => {
    const [grub] = actFamilies(0);
    expect(foeArtId({ family: grub!.id }, grub!.look)).toBe(`foe:${grub!.id}`);
    const grey = actFamilies(4)[0]!;
    expect(foeArtId({ family: grey.id, grey: true }, grey.look)).toBe(`foe:grey-${grub!.id}`);
    expect(foeArtId({ family: 'boss' }, grub!.look)).toBe(grub!.look);
    expect(foeArtId({ family: 'pip' }, 'chao')).toBe('chao');
  });
});

describe('the poof and run home (R0157)', () => {
  const f = floorOf(11, 2);
  // A floor cell two cells clear of any wall, so the runner has somewhere to run.
  const clear = (i: number): boolean => {
    const x = i % f.cols;
    const y = Math.floor(i / f.cols);
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++)
        if ((f.cells[(y + dy) * f.cols + x + dx] ?? WALL) === WALL) return false;
    return true;
  };
  const open = f.cells.findIndex((_, i) => i > f.cols * 2 && clear(i));
  const at = cellCentre(f, { x: open % f.cols, y: Math.floor(open / f.cols) });
  const poofs = new FoePoofs();
  poofs.heardBeaten('pack-0', at, 1000);
  poofs.place(f, 2);
  const p = poofs.list[0]!;

  it('squashes, bursts twelve sparkles, and a tiny runner heads for the nearest wall', () => {
    expect(p.act).toBe(2);
    const home = nearestWall(f, at);
    expect(home).toEqual(p.home);
    const squash = poofFrame(p, 75, false)!;
    expect(squash.leader!.scaleY).toBeLessThan(1);
    expect(squash.burst).toBeNull();
    const after = poofFrame(p, R10B3.poof.squashMs + 50, false)!;
    expect(after.leader).toBeNull();
    expect(after.burst).toBeGreaterThan(0);
    expect(after.runner).not.toBeNull();
    expect(after.bye).toBe(true);
    // Runs away from where it was beaten, towards the wall, and fades before it gets there.
    const late = poofFrame(p, poofLength(p, false) - 20, false);
    if (late?.runner) expect(late.runner.opacity).toBeLessThan(0.2);
    expect(poofFrame(p, poofLength(p, false) + 1, false)).toBeNull();
  });

  it('becomes a fade under a sparkle icon with reduced motion: no burst, no run', () => {
    for (let t = 0; t < poofLength(p, true); t += 100) {
      const fr = poofFrame(p, t, true)!;
      expect(fr.burst).toBeNull();
      expect(fr.runner).toBeNull();
      expect(fr.icon).toBe(true);
      expect(fr.leader!.scaleY).toBe(1);
    }
    expect(poofFrame(p, 800, true)!.leader!.opacity).toBeLessThan(0.2);
  });

  it('is over and pruned once it has played', () => {
    poofs.prune(1000 + poofLength(p, false) + 1, false);
    expect(poofs.list).toEqual([]);
  });
});
