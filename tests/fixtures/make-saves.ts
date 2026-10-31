/**
 * TECH-44: writes the fixture saves in tests/fixtures/saves/. Run once per save version
 * bump (`npx tsx tests/fixtures/make-saves.ts`) and commit the new files beside the old
 * ones; never rewrite an old fixture, since keeping old shapes loadable is their point.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SAVE_VERSION, serialize } from '../../src/sim/save';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

const WALL = Date.UTC(2026, 9, 31, 9);
const dir = join(import.meta.dirname, 'saves');

const fresh = createWorld(11, WALL);
writeFileSync(join(dir, `v${SAVE_VERSION}-fresh.json`), serialize(fresh, WALL) + '\n');

// A Grove twenty minutes in: both eggs hatched, a Nubbin petted and fed, fruit about.
const played = createWorld(12, WALL);
const events: SimEvent[] = [];
for (let t = 0; t < 20 * 60_000; t += 100) {
  stepWorld(played, 100, WALL + t);
  const n = played.nubbins.find((x) => x.stage !== 'egg');
  if (n && t % 60_000 === 0) applyCommand(played, { kind: 'pet', nubbinId: n.id }, events);
  if (n && t % 300_000 === 0) applyCommand(played, { kind: 'feed', nubbinId: n.id }, events);
}
writeFileSync(
  join(dir, `v${SAVE_VERSION}-played.json`),
  serialize(played, WALL + 20 * 60_000) + '\n',
);
