import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INPUT, THROW } from '../../src/config/tuning';
import { POINTER_INPUT } from '../../src/config/tuning-r9d3';
import { GameInput, type InputHost, type Placing } from '../../src/input/game-input';
import type { PickHit } from '../../src/render/picker';
import type { Command } from '../../src/sim/types';

/**
 * TECH-43: the pointer and keyboard layer, driven through a fake surface and a fake picker
 * (no DOM in Node). Taps, drags and throws, the long press, a second finger, keys and blur:
 * each is checked by the commands it sends.
 */

class FakeSurface extends EventTarget {
  style = { cursor: '' };
  setPointerCapture(): void {}
  getBoundingClientRect() {
    return { left: 0, top: 0, width: 400, height: 300 };
  }
}

function pointer(
  type: string,
  o: { id?: number; x?: number; y?: number; kind?: string; buttons?: number } = {},
): Event {
  const e = new Event(type);
  Object.assign(e, {
    pointerId: o.id ?? 1,
    pointerType: o.kind ?? 'mouse',
    isPrimary: (o.id ?? 1) === 1,
    clientX: o.x ?? 100,
    clientY: o.y ?? 100,
    buttons: o.buttons ?? 1,
  });
  return e;
}

function key(type: 'keydown' | 'keyup', k: string, repeat = false): Event {
  const e = new Event(type);
  Object.assign(e, {
    key: k,
    code: '',
    repeat,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    preventDefault: () => undefined,
  });
  return e;
}

let surface: FakeSurface;
let win: EventTarget;
let sent: Command[];
let selected: (string | null)[];
let hit: PickHit | null;
let placing: Placing;
let carrying: string | null;
let input: GameInput;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  win = new EventTarget();
  Object.assign(win, {
    setTimeout: (f: () => void, ms: number) => setTimeout(f, ms),
    clearTimeout: (t: number) => clearTimeout(t),
  });
  vi.stubGlobal('window', win);
  // keys.ts asks `instanceof` of the DOM element classes; none of these events has a target.
  for (const name of [
    'HTMLElement',
    'HTMLInputElement',
    'HTMLTextAreaElement',
    'HTMLSelectElement',
    'HTMLButtonElement',
    'HTMLAnchorElement',
  ])
    vi.stubGlobal(name, class {});
  surface = new FakeSurface();
  sent = [];
  selected = [];
  hit = null;
  placing = null;
  carrying = null;
  const host: InputHost = {
    camera: { currentYaw: 0, camera: {} as InputHost['camera']['camera'] },
    picker: {
      pick: () => hit,
      groundPoint: (x: number, y: number) => ({ x: x / 10, z: y / 10 }),
    } as unknown as InputHost['picker'],
    pickables: () => [],
    pickSprite: () => null,
    placing: () => placing,
    canGrab: () => true,
    carrying: () => carrying,
    send: (cmd) => sent.push(cmd),
    onSelect: (id) => selected.push(id),
  };
  input = new GameInput(surface as unknown as HTMLElement, host);
});

afterEach(() => {
  input.dispose();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const kinds = () => sent.map((c) => c.kind);
// The stop vector may come out as -0 (the yaw maths), so compare its length.
const lastInputLength = (): number => {
  const c = sent.filter((s) => s.kind === 'keeperInput').at(-1) as Extract<
    Command,
    { kind: 'keeperInput' }
  >;
  return Math.hypot(c.input.x, c.input.z);
};
const nubbin = (id = 'n1'): PickHit => ({ kind: 'nubbin', id, ground: { x: 1, z: 1 } });

function tap(o: Parameters<typeof pointer>[1] = {}): void {
  surface.dispatchEvent(pointer('pointerdown', o));
  vi.advanceTimersByTime(50);
  surface.dispatchEvent(pointer('pointerup', o));
}

describe('game input: taps (TECH-43)', () => {
  it('walks the Keeper on a ground tap and clears the selection', () => {
    hit = { kind: 'ground', id: 'grass', ground: { x: 3, z: 4 } };
    tap();
    expect(sent).toEqual([
      { kind: 'moveKeeperTo', pos: { x: 3, z: 4 } },
      { kind: 'select', id: null },
    ]);
    expect(selected).toEqual([null]);
  });

  it('selects a tapped Nubbin, and puts down the one being carried', () => {
    hit = nubbin();
    tap();
    expect(sent).toEqual([{ kind: 'select', id: 'n1' }]);
    expect(selected).toEqual(['n1']);
    sent = [];
    carrying = 'n1';
    tap();
    expect(sent).toEqual([{ kind: 'putDown' }]);
  });

  it('shakes a tapped tree and collects a tapped item', () => {
    hit = { kind: 'tree', id: 't2', ground: null };
    tap();
    hit = { kind: 'item', id: 'fruit-1', ground: null };
    tap();
    expect(sent).toEqual([
      { kind: 'shakeTree', treeId: 't2' },
      { kind: 'collect', itemId: 'fruit-1' },
    ]);
  });

  it('places the chosen piece on a ground tap while decorating', () => {
    hit = { kind: 'ground', id: 'grass', ground: { x: 2, z: 2 } };
    placing = { mode: 'decor', kind: 'bench' as never, yaw: 1 };
    tap();
    expect(sent).toEqual([{ kind: 'placeDecor', decor: 'bench', pos: { x: 2, z: 2 }, yaw: 1 }]);
  });

  it('does not count a slow press as a tap', () => {
    hit = { kind: 'ground', id: 'grass', ground: { x: 3, z: 4 } };
    surface.dispatchEvent(pointer('pointerdown'));
    vi.advanceTimersByTime(INPUT.tapMaxMs + 10);
    surface.dispatchEvent(pointer('pointerup'));
    expect(sent).toEqual([]);
  });
});

describe('game input: drags, throws and long presses (TECH-43)', () => {
  it('grabs a Nubbin past the drag threshold, drags it, and throws on release', () => {
    hit = nubbin();
    surface.dispatchEvent(pointer('pointerdown', { x: 100 }));
    surface.dispatchEvent(pointer('pointermove', { x: 103 }));
    expect(sent).toEqual([]);
    vi.advanceTimersByTime(16);
    surface.dispatchEvent(pointer('pointermove', { x: 110 }));
    vi.advanceTimersByTime(16);
    surface.dispatchEvent(pointer('pointermove', { x: 130 }));
    surface.dispatchEvent(pointer('pointerup', { x: 130 }));
    expect(kinds()).toEqual(['grab', 'drag', 'drag', 'release']);
    const release = sent.at(-1) as Extract<Command, { kind: 'release' }>;
    expect(release.vel.x).toBeGreaterThan(0);
    expect(Math.hypot(release.vel.x, release.vel.z)).toBeLessThanOrEqual(THROW.maxSpeed + 1e-9);
    expect(surface.style.cursor).toBe('');
  });

  it('puts a held Nubbin down gently when a second finger lands', () => {
    hit = nubbin();
    surface.dispatchEvent(pointer('pointerdown', { kind: 'touch' }));
    surface.dispatchEvent(pointer('pointermove', { kind: 'touch', x: 130 }));
    surface.dispatchEvent(pointer('pointerdown', { kind: 'touch', id: 2 }));
    expect(sent.at(-1)).toEqual({ kind: 'release', vel: { x: 0, z: 0 } });
  });

  it('lifts a Nubbin on a still touch held long enough, and the release is not a tap', () => {
    hit = nubbin();
    surface.dispatchEvent(pointer('pointerdown', { kind: 'touch' }));
    vi.advanceTimersByTime(POINTER_INPUT.longPressMs + 5);
    expect(sent).toEqual([{ kind: 'pickUp', nubbinId: 'n1' }]);
    surface.dispatchEvent(pointer('pointerup', { kind: 'touch' }));
    expect(sent).toEqual([{ kind: 'pickUp', nubbinId: 'n1' }]);
  });

  it('never long-presses with a mouse', () => {
    hit = nubbin();
    surface.dispatchEvent(pointer('pointerdown'));
    vi.advanceTimersByTime(POINTER_INPUT.longPressMs * 3);
    expect(sent).toEqual([]);
  });
});

describe('game input: keys (TECH-43)', () => {
  it('turns held keys into a camera-relative Keeper input, sent only on change', () => {
    win.dispatchEvent(key('keydown', 'w'));
    input.pollKeyboard();
    input.pollKeyboard();
    const moves = sent.filter((c) => c.kind === 'keeperInput');
    expect(moves).toHaveLength(1);
    const m = moves[0] as Extract<Command, { kind: 'keeperInput' }>;
    expect(m.input.x).toBeCloseTo(0);
    expect(m.input.z).toBeCloseTo(-1);
    win.dispatchEvent(key('keyup', 'w'));
    input.pollKeyboard();
    expect(lastInputLength()).toBe(0);
  });

  it('jumps on Space down and ends the jump on Space up', () => {
    win.dispatchEvent(key('keydown', ' '));
    win.dispatchEvent(key('keydown', ' ', true));
    win.dispatchEvent(key('keyup', ' '));
    expect(sent).toEqual([
      { kind: 'jump', down: true },
      { kind: 'jump', down: false },
    ]);
  });

  it('forgets held keys when the window loses focus', () => {
    win.dispatchEvent(key('keydown', 'd'));
    input.pollKeyboard();
    win.dispatchEvent(new Event('blur'));
    input.pollKeyboard();
    expect(lastInputLength()).toBe(0);
  });

  it('stops listening once disposed', () => {
    input.dispose();
    hit = nubbin();
    tap();
    win.dispatchEvent(key('keydown', ' '));
    expect(sent).toEqual([]);
  });
});
