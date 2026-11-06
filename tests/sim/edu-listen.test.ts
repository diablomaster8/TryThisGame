import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { listenOnce, setListenOptIn, setListenStub } from '../../src/platform/listen';

interface Inst {
  onsoundstart: (() => void) | null;
  onresult: (() => void) | null;
}

const store = new Map<string, string>();
const fakeWindow = {
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
  setTimeout: (f: () => void, ms: number) => setTimeout(f, ms),
  clearTimeout: (t: number) => clearTimeout(t),
};

describe('R0744 optional listening', () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal('window', fakeWindow);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    setListenStub(null);
    setListenOptIn(false);
  });

  it('never calls the API while the opt-in is off', () => {
    const made = vi.fn();
    class Stub {
      constructor() {
        made();
      }
      start(): void {}
      abort(): void {}
    }
    setListenStub(Stub as never);
    expect(listenOnce(() => undefined)).toBe(false);
    expect(made).not.toHaveBeenCalled();
  });

  it('reports voice once when opted in and the stub fires', () => {
    let inst: Inst | null = null;
    class Stub {
      onspeechstart: (() => void) | null = null;
      onsoundstart: (() => void) | null = null;
      onresult: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor() {
        inst = this as unknown as Inst;
      }
      start(): void {}
      abort(): void {}
    }
    setListenStub(Stub as never);
    setListenOptIn(true);
    const heard = vi.fn();
    expect(listenOnce(heard)).toBe(true);
    const i = inst as unknown as Inst;
    i.onsoundstart!();
    i.onresult!();
    expect(heard).toHaveBeenCalledTimes(1);
  });
});
