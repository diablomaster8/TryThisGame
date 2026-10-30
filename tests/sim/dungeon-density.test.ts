import { describe, expect, it } from 'vitest';
import { CHAMPION_MODS, DENSITY, PLATE_GLYPH } from '../../src/config/dungeon-foes';
import { ACTS } from '../../src/config/dungeon-acts';
import { actFloor } from '../../src/sim/dungeon-acts';
import { cellDist, FLOOR, floorOf } from '../../src/sim/dungeon';
import { familyMod, foeLevel } from '../../src/sim/dungeon-density';
import { waypointCell } from '../../src/sim/dungeon-levels';

// R0158 (pack density and placement) and R0155 (champion and elite modifiers) on version-4
// floors.

describe('pack density (R0158)', () => {
  it('keeps packs spaced, off the entry and waypoint, out of the nook, 4–6 fights a standard level', () => {
    let fights = 0;
    let floors = 0;
    for (let s = 0; s < 500; s++) {
      // Standard levels in the endless Hollow are depths 4–9.
      const depth = 4 + (s % 6);
      const f = floorOf(31_000 + s * 7_919, depth, 4);
      const packs = f.packs ?? [];
      const wp = waypointCell(f);
      for (const p of packs) {
        expect(f.cells[p.cell.y * f.cols + p.cell.x]).toBe(FLOOR);
        if (p.kind === 'boss') continue;
        expect(cellDist(p.cell, f.stairsUp)).toBeGreaterThanOrEqual(DENSITY.fromEntry);
        expect(cellDist(p.cell, wp)).toBeGreaterThanOrEqual(DENSITY.fromWaypoint);
        if (f.nook) expect(p.room).not.toBe(f.nook.room);
        for (const q of packs)
          if (q !== p && !p.guard && !q.guard)
            expect(cellDist(p.cell, q.cell)).toBeGreaterThanOrEqual(DENSITY.spacing);
      }
      // Every treasure room but the nook has its champion guard.
      f.layout?.pieces.forEach((pc, i) => {
        if (pc.role !== 'treasure' || i === f.nook?.room) return;
        const guard = packs.find((p) => p.guard && p.room === i);
        if (guard) expect(guard.kind).toBe('champion');
      });
      fights += packs.length;
      floors++;
    }
    const mean = fights / floors;
    expect(mean).toBeGreaterThanOrEqual(4);
    expect(mean).toBeLessThanOrEqual(6);
  }, 120_000);

  it('rolls normal 80%, champion 15%, elite 5% over 1,000 floors', () => {
    const n = { normal: 0, champion: 0, elite: 0 };
    for (let s = 0; n.normal + n.champion + n.elite < 4000 && s < 1000; s++) {
      const f = floorOf(90_000 + s * 104_729, 1 + (s % 3), 4);
      for (const p of f.packs ?? [])
        if (!p.guard && p.kind !== 'boss') n[p.kind as keyof typeof n]++;
    }
    const total = n.normal + n.champion + n.elite;
    expect(total).toBeGreaterThan(1500);
    expect(n.normal / total).toBeGreaterThan(0.76);
    expect(n.normal / total).toBeLessThan(0.84);
    expect(n.champion / total).toBeGreaterThan(0.12);
    expect(n.champion / total).toBeLessThan(0.18);
    expect(n.elite / total).toBeGreaterThan(0.03);
    expect(n.elite / total).toBeLessThan(0.07);
  }, 120_000);

  it('levels foes by act base, level in act and difficulty', () => {
    expect(foeLevel({ act: 0, level: 0, boss: false, difficulty: 'cosy' })).toBe(1);
    expect(foeLevel({ act: 2, level: 3, boss: false, difficulty: 'wild' })).toBe(16 + 3 + 70);
    // Act II, its second level (level in act 1).
    const f = actFloor(5, 1, ACTS[0]!.levels.length + 2, 4);
    const plain = f.packs!.find((p) => p.kind === 'normal')!;
    for (const m of plain.members) expect(m.level).toBeGreaterThanOrEqual(DENSITY.actBase[1] + 1);
  });
});

describe('champion and elite modifiers (R0155)', () => {
  it('gives a champion pack one shared modifier and an elite leader two or three with its family one', () => {
    let champions = 0;
    let elites = 0;
    for (let s = 0; s < 300 && (champions < 20 || elites < 8); s++) {
      const f = floorOf(4_000 + s * 7_919, 2, 4);
      for (const p of f.packs ?? []) {
        if (p.kind === 'champion') {
          champions++;
          const mod = p.members[0]!.mods;
          expect(mod).toHaveLength(1);
          for (const m of p.members) expect(m.mods).toEqual(mod);
        } else if (p.kind === 'elite') {
          elites++;
          const lead = p.members[0]!.mods;
          expect(lead.length).toBeGreaterThanOrEqual(2);
          expect(lead.length).toBeLessThanOrEqual(3);
          expect(new Set(lead).size).toBe(lead.length);
          expect(lead).toContain(familyMod(p.family));
        } else if (p.kind === 'normal') for (const m of p.members) expect(m.mods).toEqual([]);
      }
    }
    expect(champions).toBeGreaterThanOrEqual(20);
    expect(elites).toBeGreaterThanOrEqual(8);
  });

  it('names every modifier cosily, with an icon and a tell, and plates by shape', () => {
    expect(CHAMPION_MODS).toHaveLength(10);
    for (const m of CHAMPION_MODS) {
      expect(m.icon.length).toBeGreaterThan(0);
      expect(m.tell.length).toBeGreaterThan(0);
      expect(m.name).not.toMatch(/curse|blood|death|kill/i);
    }
    expect(new Set(Object.values(PLATE_GLYPH).filter(Boolean)).size).toBe(3);
  });
});
