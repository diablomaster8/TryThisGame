import { describe, expect, it } from 'vitest';
import { PAINT } from '../../src/config/tuning-kids-r11e';
import { deserialize, serialize } from '../../src/sim/save';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld } from './campaign-driver';

const png = (n: number) => 'data:image/png;base64,AAAA' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[n]!;

describe('R0743 drawings', () => {
  it('keeps drawings through a save and caps the count, dropping the oldest', () => {
    const { world, events } = campaignWorld();
    for (let i = 0; i < PAINT.maxDrawings + 3; i++)
      applyCommand(world, { kind: 'saveDrawing', data: png(i) }, events);
    expect(world.drawings).toHaveLength(PAINT.maxDrawings);
    expect(world.drawings![0]).toBe(png(3));
    const back = deserialize(serialize(world, 1)).world;
    expect(back.drawings).toEqual(world.drawings);
  });
  it('refuses anything that is not a small PNG data URL', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'saveDrawing', data: 'http://x/y.png' }, events);
    applyCommand(
      world,
      { kind: 'saveDrawing', data: 'data:image/png;base64,' + 'A'.repeat(PAINT.maxChars) },
      events,
    );
    expect(world.drawings ?? []).toHaveLength(0);
  });
});
