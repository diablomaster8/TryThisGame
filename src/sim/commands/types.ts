import type { Command, SimEvent, World } from '../types';

/** One handler per command kind: `(world, cmd, events)`, with `cmd` narrowed to its kind. */
export type Handlers = {
  [K in Command['kind']]?: (
    world: World,
    cmd: Extract<Command, { kind: K }>,
    events: SimEvent[],
  ) => void;
};
