/**
 * TECH-11: a headless play harness. A scripted Keeper drives the real sim through
 * `applyCommand` and `stepWorld` at the fixed 10 Hz step, the same calls the Game makes,
 * with no DOM. Specs in `tests/sim/play-harness.test.ts` use it for the standing smoke run
 * (first loop, reload, blocked storage, a long session) in the plain `vitest run` the CI
 * already shards; the browser half lives in `tests/e2e/`.
 */
import { SIM } from '../../src/config/tuning';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Command, SimEvent, World } from '../../src/sim/types';

export class Player {
  readonly events: SimEvent[] = [];
  /** Sim time played, in ms. */
  playedMs = 0;
  constructor(public world: World = createWorld(1, 0)) {}

  do(cmd: Command): this {
    applyCommand(this.world, cmd, this.events);
    return this;
  }

  /** Step the sim for `ms` of live play (wall clock set, so Keeper antics see real play). */
  play(ms: number, wallStart = 0): this {
    const steps = Math.ceil(ms / SIM.stepMs);
    for (let i = 0; i < steps; i++) {
      this.playedMs += SIM.stepMs;
      this.events.push(...stepWorld(this.world, SIM.stepMs, wallStart + this.playedMs));
    }
    return this;
  }

  /** Play until `pred` holds or `maxMs` pass; returns whether it held. */
  until(pred: () => boolean, maxMs: number): boolean {
    const end = this.playedMs + maxMs;
    while (this.playedMs < end) {
      if (pred()) return true;
      this.play(SIM.stepMs);
    }
    return pred();
  }

  saw(kind: SimEvent['kind']): boolean {
    return this.events.some((e) => e.kind === kind);
  }
}
