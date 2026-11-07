import { describe, expect, it } from 'vitest';
import { INSTALL_BUSY, installShouldWait } from '../../src/ui/install-hint';

/**
 * BS-02 (bug sweep 2026-11-06): the one-time install card is z-index 900 and appeared 45 s in
 * over open panels (Roster, More, Races) and story scenes, hiding their buttons. It now waits
 * while a panel, sheet, story scene or celebration is open.
 */
describe('install card waits for a calm moment', () => {
  it('waits when something is open and offers when nothing is', () => {
    expect(installShouldWait(() => ({}))).toBe(true);
    expect(installShouldWait(() => null)).toBe(false);
  });

  it('watches every kind of open panel by its not-hidden state', () => {
    for (const part of ['.modal', '.sheet', '.dialogue', '.celebrate']) {
      expect(INSTALL_BUSY).toContain(`${part}:not([hidden])`);
    }
  });
});
