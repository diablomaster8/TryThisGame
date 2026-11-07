import { describe, expect, it } from 'vitest';
import { carriedAttributes, planGraphicsSwap, type SwapState } from '../../src/graphics-swap';

/** R0509: a Graphics change swaps the renderer live; the reload path is the fallback. */
describe('planGraphicsSwap', () => {
  const base: SwapState = {
    running: 'pixel',
    wanted: '3d',
    crashed: false,
    catchingUp: false,
    renderPaused: false,
    forceReload: false,
  };

  it('does nothing when the renderer already matches', () => {
    expect(planGraphicsSwap({ ...base, wanted: 'pixel' })).toBe('none');
    expect(planGraphicsSwap({ ...base, running: '3d', crashed: true })).toBe('none');
  });

  it('swaps live both ways in normal play', () => {
    expect(planGraphicsSwap(base)).toBe('live');
    expect(planGraphicsSwap({ ...base, running: '3d', wanted: 'pixel' })).toBe('live');
  });

  it('falls back to the reload when a live swap is not safe', () => {
    for (const k of ['crashed', 'catchingUp', 'renderPaused', 'forceReload'] as const)
      expect(planGraphicsSwap({ ...base, [k]: true })).toBe('reload');
  });
});

describe('carriedAttributes', () => {
  it('keeps the id and aria attributes, drops the inline style and backing size', () => {
    const out = carriedAttributes([
      { name: 'id', value: 'game' },
      { name: 'aria-label', value: 'The Grove' },
      { name: 'tabindex', value: '0' },
      { name: 'style', value: 'image-rendering: auto; cursor: grab' },
      { name: 'width', value: '960' },
      { name: 'HEIGHT', value: '540' },
    ]);
    expect(out).toEqual([
      { name: 'id', value: 'game' },
      { name: 'aria-label', value: 'The Grove' },
      { name: 'tabindex', value: '0' },
    ]);
  });

  it('reads name and value through getters, as a DOM Attr has them', () => {
    // An Attr's name and value live on its prototype: a spread would copy neither.
    class FakeAttr {
      constructor(
        private readonly n: string,
        private readonly v: string,
      ) {}
      get name(): string {
        return this.n;
      }
      get value(): string {
        return this.v;
      }
    }
    expect(carriedAttributes([new FakeAttr('id', 'game')])).toEqual([
      { name: 'id', value: 'game' },
    ]);
  });
});
