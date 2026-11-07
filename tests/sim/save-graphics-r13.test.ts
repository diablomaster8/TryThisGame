import { afterEach, describe, expect, it, vi } from 'vitest';
import { adoptLegacyGraphics } from '../../src/platform/storage';
import { deserialize, SAVE_VERSION, serialize } from '../../src/sim/save';
import { createWorld } from '../../src/sim/world';

/** R0509 (TECH-67): graphics is a device preference; the save no longer carries it. */
function stubStorage(initial: Record<string, string> = {}): Map<string, string> {
  const m = new Map(Object.entries(initial));
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  });
  return m;
}

function v15(graphics: string): string {
  const raw = JSON.parse(serialize(createWorld(3, 0), 0)) as {
    version: number;
    world: { settings: Record<string, unknown> };
  };
  raw.version = 15;
  raw.world.settings.graphics = graphics;
  return JSON.stringify(raw);
}

afterEach(() => vi.unstubAllGlobals());

describe('graphics is a device preference (R0509)', () => {
  it('is at save version 16 or later', () => {
    expect(SAVE_VERSION).toBeGreaterThanOrEqual(16);
  });

  it('a new save has no graphics field', () => {
    const raw = JSON.parse(serialize(createWorld(3, 0), 0)) as {
      world: { settings: Record<string, unknown> };
    };
    expect('graphics' in raw.world.settings).toBe(false);
  });

  it('migrating a v15 save drops its graphics field', () => {
    const file = deserialize(v15('3d'));
    expect(file.version).toBe(SAVE_VERSION);
    expect('graphics' in file.world.settings).toBe(false);
  });

  it('a device with no choice adopts an old save’s 3D once', () => {
    const m = stubStorage();
    adoptLegacyGraphics(v15('3d'));
    expect(m.get('grove.graphics')).toBe('3d');
  });

  it('a device that has chosen keeps its choice when an old 3D save arrives', () => {
    const m = stubStorage({ 'grove.graphics': 'pixel' });
    adoptLegacyGraphics(v15('3d'));
    expect(m.get('grove.graphics')).toBe('pixel');
  });

  it('a current save never changes the device choice', () => {
    const m = stubStorage();
    adoptLegacyGraphics(serialize(createWorld(3, 0), 0));
    expect(m.has('grove.graphics')).toBe(false);
  });
});
