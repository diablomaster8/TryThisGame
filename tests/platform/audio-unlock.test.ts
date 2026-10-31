import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * TECH-43: sound starts muted and only turns on after a gesture (the brief's rule), and a
 * hidden tab is silent. A fake AudioContext stands in: every node it makes is a permissive
 * proxy, so the mix graph builds without a real audio engine, and only the context's own
 * state, resume() and suspend() are real.
 */

/** A stand-in for any audio node, param or buffer: every property is another stand-in. */
function anything(): unknown {
  const fn = function () {};
  const p: unknown = new Proxy(fn, {
    get: (_t, key) => (key === Symbol.toPrimitive ? () => 0 : p),
    set: () => true,
    apply: () => p,
    construct: () => p as object,
  });
  return p;
}

class FakeContext {
  static made = 0;
  state: 'suspended' | 'running' | 'closed' = 'suspended';
  /** Whether resume() is honoured (a browser refuses it outside a gesture). */
  static allowResume = true;
  readonly listeners: (() => void)[] = [];
  resumes = 0;
  suspends = 0;
  sampleRate = 48000;
  currentTime = 0;
  constructor() {
    FakeContext.made += 1;
    return new Proxy(this, {
      get: (t, key) => (key in t ? t[key as keyof FakeContext] : anything()),
    });
  }
  addEventListener(_type: string, fn: () => void): void {
    this.listeners.push(fn);
  }
  resume(): Promise<void> {
    this.resumes += 1;
    if (!FakeContext.allowResume) return Promise.reject(new Error('not allowed'));
    this.state = 'running';
    return Promise.resolve();
  }
  suspend(): Promise<void> {
    this.suspends += 1;
    this.state = 'suspended';
    return Promise.resolve();
  }
}

let made: FakeContext[] = [];

beforeEach(() => {
  vi.resetModules();
  FakeContext.made = 0;
  FakeContext.allowResume = true;
  made = [];
  const Ctor = function (this: unknown) {
    const c = new FakeContext();
    made.push(c);
    return c;
  } as unknown as typeof AudioContext;
  vi.stubGlobal('window', {
    AudioContext: Ctor,
    setInterval: () => 1,
    clearInterval: () => undefined,
    setTimeout: () => 1,
    clearTimeout: () => undefined,
  });
});
afterEach(() => vi.unstubAllGlobals());

const audio = () => import('../../src/platform/audio');
const settle = () => new Promise((r) => setTimeout(r, 0));

describe('audio unlock (TECH-43)', () => {
  it('makes no context and stays locked before any gesture', async () => {
    const a = await audio();
    expect(a.isAudioUnlocked()).toBe(false);
    a.resumeAudio();
    a.suspendAudio();
    a.playSound('pet' as Parameters<typeof a.playSound>[0]);
    expect(FakeContext.made).toBe(0);
  });

  it('builds one context on the first gesture and unlocks once it runs', async () => {
    const a = await audio();
    a.unlockAudio();
    await settle();
    expect(FakeContext.made).toBe(1);
    expect(made[0]!.resumes).toBe(1);
    expect(a.isAudioUnlocked()).toBe(true);
    a.unlockAudio();
    expect(FakeContext.made).toBe(1);
  });

  it('stays locked while resume is refused, and the next gesture tries again', async () => {
    FakeContext.allowResume = false;
    const a = await audio();
    a.unlockAudio();
    await settle();
    expect(a.isAudioUnlocked()).toBe(false);
    FakeContext.allowResume = true;
    a.unlockAudio();
    await settle();
    expect(made[0]!.resumes).toBe(2);
    expect(a.isAudioUnlocked()).toBe(true);
  });

  it('suspends while the tab is hidden and resumes on show', async () => {
    const a = await audio();
    a.unlockAudio();
    await settle();
    const ctx = made[0]!;
    a.suspendAudio();
    expect(ctx.suspends).toBe(1);
    expect(ctx.state).toBe('suspended');
    // Hidden again (already suspended): nothing more to do.
    a.suspendAudio();
    expect(ctx.suspends).toBe(1);
    a.resumeAudio();
    await settle();
    expect(ctx.state).toBe('running');
    expect(ctx.resumes).toBe(2);
  });
});
