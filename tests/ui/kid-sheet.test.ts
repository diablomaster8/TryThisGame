import { describe, expect, it } from 'vitest';
import { resetAllowed, routeSettingsTap } from '../../src/ui/kid-sheet';

/** R0671: the ⚙ route and the reset gate in a Learning Grove, without a DOM. */
function route(answer: boolean) {
  const log: string[] = [];
  return {
    log,
    r: {
      openFull: () => log.push('full'),
      openQuick: () => log.push('quick'),
      ask: () => {
        log.push('ask');
        return Promise.resolve(answer);
      },
    },
  };
}

describe('Learning Grove settings gate (R0671)', () => {
  it('opens the full Settings at once outside a Learning Grove', async () => {
    const { log, r } = route(false);
    expect(await routeSettingsTap(false, r)).toBe(true);
    expect(log).toEqual(['full']);
  });

  it('opens only the sound sheet in a Learning Grove, with no gate', async () => {
    const { log, r } = route(true);
    expect(await routeSettingsTap(true, r)).toBe(false);
    expect(log).toEqual(['quick']);
  });

  it('asks the gate before the full Settings from the sheet, and stays shut on a no', async () => {
    const yes = route(true);
    expect(await routeSettingsTap(true, yes.r, true)).toBe(true);
    expect(yes.log).toEqual(['ask', 'full']);
    const no = route(false);
    expect(await routeSettingsTap(true, no.r, true)).toBe(false);
    expect(no.log).toEqual(['ask']);
  });

  it('gates Reset save before the confirm in a Learning Grove only', async () => {
    const order: string[] = [];
    const ask = (ok: boolean) => () => {
      order.push('ask');
      return Promise.resolve(ok);
    };
    const confirm = () => {
      order.push('confirm');
      return true;
    };
    expect(await resetAllowed(true, ask(false), confirm)).toBe(false);
    expect(order).toEqual(['ask']);
    order.length = 0;
    expect(await resetAllowed(true, ask(true), confirm)).toBe(true);
    expect(order).toEqual(['ask', 'confirm']);
    order.length = 0;
    expect(await resetAllowed(false, ask(false), confirm)).toBe(true);
    expect(order).toEqual(['confirm']);
  });
});
