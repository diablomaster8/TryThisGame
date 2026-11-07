/**
 * R0485 (TECH-43): a recording stand-in for the Web Audio API, for tests of the platform audio
 * files. Unlike a permissive proxy it keeps what the code did: which nodes were made, what
 * connects to what, which sources started and stopped, and every automation call on every
 * param. Timers are captured so a test can run the music scheduler by hand.
 */

export interface ParamEvent {
  kind: 'set' | 'linear' | 'exp' | 'target' | 'cancel' | 'curve';
  value: number;
  time: number;
}

export class FakeParam {
  value = 0;
  events: ParamEvent[] = [];
  setValueAtTime(value: number, time: number): this {
    this.value = value;
    this.events.push({ kind: 'set', value, time });
    return this;
  }
  linearRampToValueAtTime(value: number, time: number): this {
    this.events.push({ kind: 'linear', value, time });
    return this;
  }
  exponentialRampToValueAtTime(value: number, time: number): this {
    this.events.push({ kind: 'exp', value, time });
    return this;
  }
  setTargetAtTime(value: number, time: number): this {
    this.events.push({ kind: 'target', value, time });
    return this;
  }
  setValueCurveAtTime(): this {
    this.events.push({ kind: 'curve', value: 0, time: 0 });
    return this;
  }
  cancelScheduledValues(time: number): this {
    this.events.push({ kind: 'cancel', value: 0, time });
    return this;
  }
  cancelAndHoldAtTime(time: number): this {
    return this.cancelScheduledValues(time);
  }
}

const PARAMS = new Set([
  'gain',
  'frequency',
  'detune',
  'Q',
  'delayTime',
  'threshold',
  'ratio',
  'knee',
  'attack',
  'release',
  'playbackRate',
  'pan',
]);

export class FakeNode {
  readonly out: FakeNode[] = [];
  started: number[] = [];
  stopped: number[] = [];
  disconnected = false;
  readonly props: Record<string, unknown> = {};
  private readonly params = new Map<string, FakeParam>();
  constructor(readonly kind: string) {
    return new Proxy(this, {
      get: (t, key) => {
        if (typeof key === 'string' && !(key in t) && PARAMS.has(key)) {
          let p = t.params.get(key);
          if (!p) t.params.set(key, (p = new FakeParam()));
          return p;
        }
        if (key in t) return t[key as keyof FakeNode];
        return t.props[key as string];
      },
      set: (t, key, value) => {
        // `node.gain.value = x` goes through the param; plain props (type, buffer) are kept.
        if (key in t) (t as unknown as Record<string | symbol, unknown>)[key] = value;
        else t.props[key as string] = value;
        return true;
      },
    });
  }
  connect<T extends FakeNode>(dest: T): T {
    this.out.push(dest);
    return dest;
  }
  disconnect(): void {
    this.disconnected = true;
    this.out.length = 0;
  }
  start(t = 0): void {
    this.started.push(t);
  }
  stop(t = 0): void {
    this.stopped.push(t);
  }
  /** The param called `name` (made on first use). */
  param(name: string): FakeParam {
    return (this as unknown as Record<string, FakeParam>)[name]!;
  }
  /** Whether `target` is reachable from this node along connections. */
  reaches(target: FakeNode, seen = new Set<FakeNode>()): boolean {
    if (this === target) return true;
    if (seen.has(this)) return false;
    seen.add(this);
    return this.out.some((n) => n.reaches(target, seen));
  }
}

export class FakeBuffer {
  private readonly data: Float32Array[];
  constructor(
    channels: number,
    readonly length: number,
    readonly sampleRate: number,
  ) {
    this.data = Array.from({ length: channels }, () => new Float32Array(length));
  }
  getChannelData(ch: number): Float32Array {
    return this.data[ch]!;
  }
}

export class FakeAudioContext {
  state: 'suspended' | 'running' | 'closed' = 'suspended';
  currentTime = 0;
  sampleRate = 48000;
  readonly destination = new FakeNode('destination');
  readonly nodes: FakeNode[] = [];
  readonly buffers: FakeBuffer[] = [];
  private readonly listeners: (() => void)[] = [];
  resumes = 0;
  suspends = 0;
  constructor() {
    return new Proxy(this, {
      get: (t, key) => {
        if (key in t) return t[key as keyof FakeAudioContext];
        if (typeof key === 'string' && key.startsWith('create')) {
          return () => {
            const n = new FakeNode(key.slice('create'.length));
            t.nodes.push(n);
            return n;
          };
        }
        return undefined;
      },
    });
  }
  createBuffer(channels: number, length: number, rate: number): FakeBuffer {
    const b = new FakeBuffer(channels, length, rate);
    this.buffers.push(b);
    return b;
  }
  addEventListener(_type: string, fn: () => void): void {
    this.listeners.push(fn);
  }
  resume(): Promise<void> {
    this.resumes += 1;
    this.state = 'running';
    this.listeners.forEach((f) => f());
    return Promise.resolve();
  }
  suspend(): Promise<void> {
    this.suspends += 1;
    this.state = 'suspended';
    this.listeners.forEach((f) => f());
    return Promise.resolve();
  }
  /** Nodes of one kind made so far, in order. */
  all(kind: string): FakeNode[] {
    return this.nodes.filter((n) => n.kind === kind);
  }
}

export interface Timers {
  intervals: Map<number, () => void>;
  timeouts: Map<number, { fn: () => void; ms: number }>;
  cleared: number[];
  /** Run every pending interval callback once. */
  tick(): void;
  /** Run and drop every pending timeout. */
  flush(): void;
}

/** Window/global timers that run only when the test says so. */
export function fakeTimers(): Timers {
  let id = 0;
  const t: Timers = {
    intervals: new Map(),
    timeouts: new Map(),
    cleared: [],
    tick: () => [...t.intervals.values()].forEach((f) => f()),
    flush: () => {
      const list = [...t.timeouts.entries()];
      t.timeouts.clear();
      list.forEach(([, v]) => v.fn());
    },
  };
  (t as unknown as Record<string, unknown>).api = {
    setInterval: (fn: () => void) => {
      t.intervals.set(++id, fn);
      return id;
    },
    clearInterval: (n: number) => {
      t.intervals.delete(n);
      t.cleared.push(n);
    },
    setTimeout: (fn: () => void, ms = 0) => {
      t.timeouts.set(++id, { fn, ms });
      return id;
    },
    clearTimeout: (n: number) => {
      t.timeouts.delete(n);
      t.cleared.push(n);
    },
  };
  return t;
}

export function timerApi(t: Timers): {
  setInterval: (fn: () => void) => number;
  clearInterval: (n: number) => void;
  setTimeout: (fn: () => void, ms?: number) => number;
  clearTimeout: (n: number) => void;
} {
  return (t as unknown as { api: ReturnType<typeof timerApi> }).api;
}
