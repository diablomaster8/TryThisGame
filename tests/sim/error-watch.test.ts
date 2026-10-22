import { afterEach, describe, expect, it, vi } from 'vitest';
import { ERRORS } from '../../src/config/tuning';
import { watchErrors } from '../../src/platform/error-watch';

/**
 * The safety net for uncaught errors logs within a budget and shows its notice sparingly,
 * so an error in a loop can neither flood the console nor pile up notices (review D, 46).
 */

function fire(target: EventTarget, type: string, props: Record<string, unknown>): void {
  target.dispatchEvent(Object.assign(new Event(type), props));
}

afterEach(() => vi.restoreAllMocks());

describe('watchErrors', () => {
  it('logs within a budget and rate-limits the notice', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const target = new EventTarget();
    let t = 0;
    const notify = vi.fn();
    const watch = watchErrors(notify, target, () => t);
    for (let i = 0; i < 50; i++) fire(target, 'error', { message: 'boom', error: new Error('x') });
    expect(log).toHaveBeenCalledTimes(ERRORS.maxLogged);
    expect(notify).toHaveBeenCalledTimes(1);
    t += ERRORS.noticeGapMs;
    fire(target, 'unhandledrejection', { reason: new TypeError('y') });
    expect(notify).toHaveBeenCalledTimes(2);
    for (let i = 0; i < 10; i++) {
      t += ERRORS.noticeGapMs;
      fire(target, 'unhandledrejection', { reason: new TypeError('y') });
    }
    expect(notify).toHaveBeenCalledTimes(ERRORS.maxNotices);
    watch.dispose();
  });

  it('stays quiet for the browser saying no and for benign noise', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const target = new EventTarget();
    const notify = vi.fn();
    watchErrors(notify, target, () => 0);
    fire(target, 'unhandledrejection', { reason: new DOMException('no', 'NotAllowedError') });
    fire(target, 'error', {
      message: 'ResizeObserver loop completed with undelivered notifications.',
    });
    expect(notify).not.toHaveBeenCalled();
  });
});
