import type { HollowModule } from './hollow-ctx';

/**
 * The Hollow's air: particles and fog. There is none yet (the scene owns the cave fog, in
 * `setDaylight`); this module has the shared shape so the atmosphere pass can land here
 * without touching `hollow.ts` beyond the call. Its owner adds the parameters it needs:
 * `build(floor, ctx)` and `update(t, keeper, frame)`.
 */
export class HollowAtmos implements HollowModule {
  build(): void {}

  dispose(): void {}

  update(): void {}
}
