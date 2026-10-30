import { describe, expect, it } from 'vitest';
import { EGG, FIRST_FEED, SIM, UI } from '../../src/config/tuning';
import { wantsFirstFruit } from '../../src/sim/first-feed';
import { applyFruit } from '../../src/sim/needs';
import { groveSuggestion } from '../../src/ui/objective';
import { createWorld, stepWorld } from '../../src/sim/world';

describe('TECH-01: the first fruit', () => {
  it('a new hatchling asks for its first fruit, and the chip says so', () => {
    const w = createWorld(5, 0);
    for (let i = 0; i < EGG.hatchMs / SIM.stepMs; i++) stepWorld(w, SIM.stepMs);
    const n = w.nubbins[0]!;
    expect(n.stage).toBe('child');
    expect(n.needs.hunger).toBeLessThan(UI.feedFullAt);
    expect(wantsFirstFruit(n)).toBe(true);
    const tip = groveSuggestion(w);
    expect(tip?.key).toBe('grove:firstFruit');
    expect(tip?.goal).toContain(n.name);
  });

  it('stops asking once fed, after a while, and never for a reborn Nubbin', () => {
    const w = createWorld(5, 0);
    for (let i = 0; i < EGG.hatchMs / SIM.stepMs; i++) stepWorld(w, SIM.stepMs);
    const [a, b] = w.nubbins;
    applyFruit(a!);
    expect(wantsFirstFruit(a!)).toBe(false);
    b!.rebirths = 1;
    expect(wantsFirstFruit(b!)).toBe(false);
    b!.rebirths = 0;
    b!.stageMs = FIRST_FEED.cueMs;
    expect(wantsFirstFruit(b!)).toBe(false);
  });
});

describe('TECH-02: the held ring', () => {
  it('is green when still, cream when moving fast, and a place eases down', async () => {
    const { HeldRing } = await import('../../src/render/held-ring');
    const { HELD_RING } = await import('../../src/config/tuning');
    const w = createWorld(5, 0);
    const n = w.nubbins[0]!;
    n.behavior.state = 'held';
    n.y = 1.2;
    const r = new HeldRing();
    r.frame(w, 0, false);
    r.frame(w, 60, false);
    expect(r.spot?.gentle).toBe(true);
    n.pos = { x: n.pos.x + 0.5, z: n.pos.z };
    r.frame(w, 100, false);
    expect(r.spot?.gentle).toBe(false);
    n.behavior.state = 'sit';
    n.y = 0;
    r.frame(w, 120, false);
    expect(r.spot).toBeNull();
    expect(r.lowerY(n.id, 120)).toBeCloseTo(1.2);
    expect(r.lowerY(n.id, 120 + HELD_RING.lowerMs / 2)).toBeGreaterThan(0);
    expect(r.lowerY(n.id, 120 + HELD_RING.lowerMs)).toBe(0);
  });
});

describe('TECH-03: the backup offer', () => {
  it('shows once, a week after first play, and never after an export', async () => {
    const store = new Map<string, string>();
    (globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    };
    const { backupOfferDue, noteBackupOffered, noteBackupExported } =
      await import('../../src/platform/backup-offer');
    const { BACKUP_OFFER } = await import('../../src/config/tuning');
    const week = BACKUP_OFFER.afterPlayMs;
    expect(backupOfferDue(1000)).toBe(false);
    expect(backupOfferDue(1000 + week - 1)).toBe(false);
    expect(backupOfferDue(1000 + week)).toBe(true);
    noteBackupOffered();
    expect(backupOfferDue(1000 + week * 2)).toBe(false);
    store.clear();
    backupOfferDue(0);
    noteBackupExported(5);
    expect(backupOfferDue(week * 3)).toBe(false);
    delete (globalThis as { localStorage?: unknown }).localStorage;
  });
});
