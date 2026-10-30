import { describe, expect, it } from 'vitest';
import { EGG, SIM } from '../../src/config/tuning';
import type { Command, Interaction, SimEvent } from '../../src/sim/types';
import { CRITTER_SPECIES } from '../../src/sim/critters';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/**
 * TECH-63: no care command is a silent no-op when the Nubbin is out of reach. With the
 * Keeper 20 units away, each one either sets the Keeper walking (an intent) or says why not
 * (`cantReach`).
 */
const ACTIONS: Interaction[] = ['tickle', 'hug', 'groom', 'tuckIn', 'praise', 'highFive'];

function farWorld() {
  const w = createWorld(7, 0);
  for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 2; i++) stepWorld(w, SIM.stepMs);
  const n = w.nubbins[0]!;
  n.pos = { x: w.keeper.pos.x + 20, z: w.keeper.pos.z };
  n.behavior.state = 'sit';
  return { w, n };
}

describe('TECH-63: care out of reach', () => {
  const cases: Array<[string, (id: string) => Command]> = [
    ['pet', (id) => ({ kind: 'pet', nubbinId: id })],
    ['pickUp', (id) => ({ kind: 'pickUp', nubbinId: id })],
    ['feed', (id) => ({ kind: 'feed', nubbinId: id })],
    ...ACTIONS.map(
      (a) =>
        [a, (id: string) => ({ kind: 'interact', nubbinId: id, action: a }) as Command] as [
          string,
          (id: string) => Command,
        ],
    ),
  ];
  for (const [name, cmd] of cases) {
    it(`${name} walks or says why`, () => {
      const { w, n } = farWorld();
      w.keeper.intent = null;
      const events: SimEvent[] = [];
      applyCommand(w, cmd(n.id), events);
      const said = events.some((e) => e.kind === 'cantReach');
      expect(w.keeper.intent !== null || said).toBe(true);
    });
  }

  it('gifts from the sheet reach a Nubbin at any distance', () => {
    const { w, n } = farWorld();
    const sp = CRITTER_SPECIES[0]!.id;
    w.inventory.critters[sp] = 1;
    w.inventory.essences.swim = 1;
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'giveCritter', nubbinId: n.id, species: sp }, events);
    applyCommand(w, { kind: 'giveEssence', nubbinId: n.id, type: 'swim' }, events);
    expect(events.map((e) => e.kind)).toEqual(
      expect.arrayContaining(['critterGiven', 'essenceGiven']),
    );
  });
});
