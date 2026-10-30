import { describe, expect, it } from 'vitest';
import { UPDATE_NOTICE } from '../../src/config/tuning-r8d-plat';
import { updateChipDue, type UpdateState } from '../../src/ui/update-ready';

const base: UpdateState = { waitingSince: 0, resumed: false, busy: false, online: true };

describe('R0496 update chip', () => {
  it('waits the full wait before offering itself', () => {
    expect(updateChipDue(base, UPDATE_NOTICE.waitMs - 1)).toBe(false);
    expect(updateChipDue(base, UPDATE_NOTICE.waitMs)).toBe(true);
  });
  it('shows at once on resume with a worker waiting', () => {
    expect(updateChipDue({ ...base, resumed: true }, 1)).toBe(true);
  });
  it('never shows with no waiting worker, while busy, or offline', () => {
    const late = UPDATE_NOTICE.waitMs * 2;
    expect(updateChipDue({ ...base, waitingSince: null, resumed: true }, late)).toBe(false);
    expect(updateChipDue({ ...base, busy: true, resumed: true }, late)).toBe(false);
    expect(updateChipDue({ ...base, online: false, resumed: true }, late)).toBe(false);
  });
});
