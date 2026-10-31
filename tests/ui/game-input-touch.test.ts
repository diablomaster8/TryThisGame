import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Command } from '../../src/sim/types';

/**
 * R0472 (TECH-30): GameInput driven at class level with fake pointer events. A second finger
 * cancels a Nubbin press (no lift, no tap, no throw); a long press on an item says what it is
 * and its release is not also a tap; a long press on a Nubbin lifts it gently.
 */
type Listener = (e: unknown) => void;

function fakeSurface() {
  const on = new Map<string, Listener[]>();
  const fired: CustomEvent[] = [];
  return {
    on,
    fired,
    style: { cursor: '' },
    addEventListener: (t: string, f: Listener) => on.set(t, [...(on.get(t) ?? []), f]),
    setPointerCapture: () => undefined,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 800 }),
    dispatchEvent: (e: CustomEvent) => (fired.push(e), true),
    emit(t: string, e: object) {
      for (const f of on.get(t) ?? []) f(e);
    },
  };
}

const ptr = (id: number, x: number, y: number, primary = true) => ({
  pointerId: id,
  pointerType: 'touch',
  isPrimary: primary,
  clientX: x,
  clientY: y,
  buttons: 1,
});

describe('GameInput touch gestures', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('window', {
      addEventListener: () => undefined,
      setTimeout: (f: () => void, ms: number) => setTimeout(f, ms),
      clearTimeout: (t: number) => clearTimeout(t),
    });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  async function make(kind: 'nubbin' | 'item') {
    const { GameInput } = await import('../../src/input/game-input');
    const surface = fakeSurface();
    const sent: Command[] = [];
    const hit = { kind, id: 'x1', ground: { x: 0, z: 0 } };
    const host = {
      camera: { currentYaw: 0, camera: {} },
      picker: { pick: () => hit },
      pickables: () => [],
      pickSprite: () => null,
      canGrab: () => true,
      send: (c: Command) => sent.push(c),
      onSelect: () => undefined,
      carrying: () => null,
    };
    // The host is a structural fake of InputHost: only what these gestures touch.
    new GameInput(surface as unknown as HTMLElement, host as never);
    return { surface, sent };
  }

  it('a second finger cancels a Nubbin press', async () => {
    const { surface, sent } = await make('nubbin');
    surface.emit('pointerdown', ptr(1, 100, 100));
    surface.emit('pointerdown', ptr(2, 200, 100, false));
    surface.emit('pointermove', ptr(1, 140, 100));
    vi.advanceTimersByTime(800);
    surface.emit('pointerup', ptr(2, 200, 100, false));
    surface.emit('pointerup', ptr(1, 140, 100));
    const kinds = sent.map((c) => c.kind);
    expect(kinds).not.toContain('pickUp');
    expect(kinds).not.toContain('grab');
    expect(kinds).not.toContain('select');
  });

  it('a long press on an item shows its card and the release is not a tap', async () => {
    const { surface, sent } = await make('item');
    surface.emit('pointerdown', ptr(1, 100, 100));
    vi.advanceTimersByTime(700);
    surface.emit('pointerup', ptr(1, 100, 100));
    expect(surface.fired.map((e) => e.type)).toEqual(['grove-inspect']);
    expect(surface.fired[0]!.detail).toMatchObject({ kind: 'item', id: 'x1', x: 100, y: 100 });
    expect(sent.map((c) => c.kind)).not.toContain('collect');
  });

  it('a short tap on an item still collects it', async () => {
    const { surface, sent } = await make('item');
    surface.emit('pointerdown', ptr(1, 100, 100));
    vi.advanceTimersByTime(120);
    surface.emit('pointerup', ptr(1, 101, 100));
    expect(surface.fired).toEqual([]);
    expect(sent.map((c) => c.kind)).toContain('collect');
  });

  it('a long press on a Nubbin lifts it gently', async () => {
    const { surface, sent } = await make('nubbin');
    surface.emit('pointerdown', ptr(1, 100, 100));
    vi.advanceTimersByTime(700);
    surface.emit('pointerup', ptr(1, 100, 100));
    expect(sent.map((c) => c.kind)).toEqual(['pickUp']);
  });
});

describe('long-press card lines', () => {
  it('names items and villagers, and drops what is gone', async () => {
    const { inspectLines } = await import('../../src/ui/press-info');
    const world = {
      items: [{ id: 'i1', kind: 'fruit' }],
      npcs: [
        { id: 'n1', trainer: 'fern' },
        { id: 'n2', trainer: 'corvin-guest' },
      ],
    } as never;
    expect(inspectLines(world, 'item', 'i1')?.[0]).toBe('Fruit');
    expect(inspectLines(world, 'npc', 'n1')?.[0]).toBe('Fern');
    expect(inspectLines(world, 'npc', 'n2')?.[1]).toMatch(/Tap to talk/);
    expect(inspectLines(world, 'item', 'gone')).toBeNull();
  });
});
