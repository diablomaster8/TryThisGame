import { describe, expect, it } from 'vitest';
import { HOLLOW } from '../../src/config/tuning';
import {
  actorFog,
  fogDraw,
  GEAR_POP,
  gearPopFrame,
  lootFog,
  packPlate,
  rarityGlyph,
} from '../../src/render/hollow-packs-pixel';
import { cellCentre, cellOf, floorOfRun, isExplored } from '../../src/sim/dungeon';
import type { PackMember } from '../../src/sim/dungeon-encounters';
import { FOG_HIDDEN, FOG_REMEMBERED, FOG_VISIBLE } from '../../src/sim/dungeon-sight';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** Lane B r8: the Pixel view's Hollow packs, plates, fog rule and gear pop (pure parts). */

const member = (mods: PackMember['mods']): PackMember => ({ species: 'x', level: 3, mods });

describe('packPlate', () => {
  it('gives plain packs no plate and special ones a shape glyph first', () => {
    expect(packPlate({ kind: 'normal', members: [member([])] })).toBeNull();
    const champ = packPlate({ kind: 'champion', members: [member(['zoomy'])] })!;
    expect(champ.glyph).toBe('◆');
    expect(champ.text).toBe('◆ » Zoomy');
    expect(packPlate({ kind: 'elite', members: [member(['zoomy', 'bigBiceps'])] })!.text).toBe(
      '◈ » Zoomy  ✊ Big Biceps',
    );
  });

  it('names a unique before its modifiers, under a ★', () => {
    const u = packPlate({ kind: 'unique', unique: 'sir-snorts', members: [member(['zoomy'])] })!;
    expect(u.text).toBe('★ Sir Snorts-a-Lot » Zoomy');
    // Colour backs the shape up, never replaces it.
    expect(u.colour).not.toBe(packPlate({ kind: 'champion', members: [member([])] })!.colour);
  });
});

describe('fogDraw', () => {
  it('hides actors out of sight and dims remembered loot', () => {
    expect(fogDraw('actor', FOG_VISIBLE, false)).toBe(1);
    expect(fogDraw('actor', FOG_REMEMBERED, false)).toBe(0);
    expect(fogDraw('actor', FOG_HIDDEN, false)).toBe(0);
    expect(fogDraw('loot', FOG_VISIBLE, false)).toBe(1);
    expect(fogDraw('loot', FOG_REMEMBERED, false)).toBe(HOLLOW.fog.remembered);
    expect(fogDraw('loot', FOG_HIDDEN, false)).toBe(0);
    // Under the open sky there is no fog.
    expect(fogDraw('actor', FOG_HIDDEN, true)).toBe(1);
  });

  it('agrees with the floor: the Keeper is seen, far unexplored cells are not', () => {
    const world = createWorld(11, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    const run = world.dungeon!;
    const f = floorOfRun(run);
    const k = world.keeper.pos;
    expect(actorFog(run, f, k, k)).toBe(1);
    let far = null as null | { x: number; y: number };
    for (let y = 0; y < f.rows && !far; y++)
      for (let x = 0; x < f.cols; x++)
        if (!isExplored(run, f, x, y)) {
          far = { x, y };
          break;
        }
    expect(far).not.toBeNull();
    expect(actorFog(run, f, k, cellCentre(f, far!))).toBe(0);
    expect(lootFog(run, f, k, far!)).toBe(0);
    expect(lootFog(run, f, k, cellOf(f, k))).toBe(1);
  });
});

describe('gear pickup pop', () => {
  it('rises, fades and ends; reduced motion keeps it still', () => {
    const a = gearPopFrame(0, false)!;
    const b = gearPopFrame(GEAR_POP.ms * 0.5, false)!;
    expect(b.y).toBeGreaterThan(a.y);
    expect(gearPopFrame(GEAR_POP.ms * 0.9, false)!.opacity).toBeLessThan(1);
    expect(gearPopFrame(GEAR_POP.ms, false)).toBeNull();
    expect(gearPopFrame(-1, false)).toBeNull();
    expect(gearPopFrame(0, true)!.y).toBe(gearPopFrame(GEAR_POP.ms * 0.5, true)!.y);
  });

  it('shows each rarity by its own shape', () => {
    const shapes = ['plain', 'shiny', 'fancy', 'legendary', 'set', 'charm'].map(
      (r) => rarityGlyph(r).glyph,
    );
    expect(new Set(shapes).size).toBe(6);
    expect(rarityGlyph('nope').glyph).toBe('●');
  });
});
