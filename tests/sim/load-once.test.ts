import { describe, expect, it } from 'vitest';
import { loadOnce } from '../../src/sim/load-once';

// The story chunks load through `loadOnce`: a failed chunk fetch must be tried again on the
// next call (the boot card's "Try again"), never remembered for the session.
describe('loadOnce', () => {
  it('shares one load between callers', async () => {
    let calls = 0;
    const load = loadOnce(() => Promise.resolve(++calls));
    const [a, b] = await Promise.all([load(), load()]);
    expect([a, b, await load()]).toEqual([1, 1, 1]);
    expect(calls).toBe(1);
  });

  it('tries again after a failure, then keeps the success', async () => {
    let calls = 0;
    const load = loadOnce(() =>
      ++calls === 1 ? Promise.reject(new Error('chunk 404')) : Promise.resolve(calls),
    );
    await expect(load()).rejects.toThrow('chunk 404');
    await Promise.resolve();
    expect(await load()).toBe(2);
    expect(await load()).toBe(2);
    expect(calls).toBe(2);
  });

  it('callers waiting on a failed load all see the failure', async () => {
    const load = loadOnce(() => Promise.reject(new Error('offline')));
    const results = await Promise.allSettled([load(), load()]);
    expect(results.map((r) => r.status)).toEqual(['rejected', 'rejected']);
  });
});
