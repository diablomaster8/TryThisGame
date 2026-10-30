# The Hollow Below: design and passes

The human-readable version of the Hollow rebuild (DUNG items of the 2026-10-27
recommendations, lane B). The detail lives in the code comments; this page says what the
Hollow is for, how it is put together, and which pass shipped what. Item ids (R0xxx) match
`recs-2026-10-27/STATUS.md`.

## What it is

A cosy, D2-shaped dungeon under the Grove. Five acts (Rootways, Cloister, Sandglass,
Frostbell, Gloom), each a camp, an outdoor field with side caves, and a dungeon a few levels
deep with a boss at the bottom that opens the next act. Beside them, the endless Deep Hollow
and today's shared Hollow. Nothing underground can be lost: losing a fight gets the giggles
and a walk back, banked finds never shrink, and the tumble home when everyone is out of puff
splits the sack between the satchel and the stash.

## How it is built

| Part | Where |
| --- | --- |
| Acts table, act floors, boss gate | `config/dungeon-acts.ts`, `sim/dungeon-acts.ts` |
| Generator v3/v4: pieces on a slot grid, platforming pass | `sim/dungeon-gen-v3.ts`, `sim/dungeon-pieces/`, `sim/dungeon-gaps.ts` |
| Packs, the fight hand-off, foe families, uniques | `sim/dungeon-encounters.ts`, `config/dungeon-foes.ts`, `sim/dungeon-uniques.ts` |
| Boss floors: big chest, celebration, next act's waypoint | `sim/dungeon-boss.ts` |
| Sleepy packs, warm losses, "Sneak past?" | `sim/dungeon-sleepy.ts` |
| Waypoints, the Homing Acorn, levels remembered | `sim/dungeon-travel.ts`, `sim/dungeon-levels.ts` |
| Camps, fields, side caves | `sim/dungeon-zones.ts`, `sim/dungeon-towns.ts`, `sim/dungeon-outdoor.ts` |
| Loot tiers, gear, the sack and the stash | `config/dungeon-loot.ts`, `sim/gear.ts`, `sim/dungeon-sack.ts` |
| The Mystery Basket stall | `sim/dungeon-gamble.ts` |
| Rumble rooms (tactics) and stray calm bouts | `sim/dungeon-rumble.ts`, `sim/dungeon-strays.ts` |
| Today's results and tuning numbers | `sim/dungeon-log.ts` |
| Menus, bar, panels | `ui/dungeon*.ts`, `ui/hollow-map.ts`, `ui/hollow-journal.ts` |

Fights belong to lane C (`sim/battle/`); the Hollow builds an `EncounterSpec` (foes, a 9×7
board, boss phases) and listens for `battleEnd` / `tacticsEnd` with source `hollow`.

## Passes

The recommended order (R0171) and where each stands on 2026-10-29:

- **H1 Paths and packs** (DUNG-01, 02, 06, 13, 22, 43, 53, 57, 67): rounds 1–3. Packs fight on
  lane C's core; fog in both renderers; strays as a chase; roster-free seeds (round 6).
- **H2 Bigger floors** (DUNG-03, 04, 18, 19, 21, 58, 51): rounds 1–3. Generator v3/v4,
  29 Rootways pieces, density, shrines, traps. Other acts' tilesets still borrow Rootways.
- **H3 Act I** (DUNG-05, 08–12, 16, 17, 20, 27, 28): rounds 1–6. Acts, waypoints, rerolls,
  the acorn, saved levels, camps, uniques, families, party picker; boss floors with the big
  chest and celebration (round 6). Party roles (DUNG-27) not started.
- **H4 Loot** (DUNG-23, 24, 29–35): rounds 5–6. Tiers, gear slots, the sack and stash, the
  basket stall. Sets and uniques (29), charms (30), the wheelbarrow (34) and the economy
  test (35) are next.
- **H5 Acts II–V** (DUNG-07, 47, 26, 36): fields and families done; tilesets, act quests and
  difficulty tiers open.
- **H6 Replay** (DUNG-38–46, 60): warm losses, End-trip confirm, today's results done
  (round 6); mercenaries, secrets, keys, speed mode, kid mode, Moo Meadow open.

Each pass ends with `npm run lint`, `npm test`, `npm run build` and a headless Edge smoke in
both renderers; its notes go in `PROGRESS.md` and then `docs/progress-archive.md`.

## Save fields

Save version 8 added `hollow.acts`; 9 the act seeds, waypoints and acorns; 10 camps, uniques
and the last party; 11 `world.gear`; 12 (round 6) `gear.stash`, `hollow.bossChests` (bosses
beaten before it count as paid), `hollow.today` and `hollow.stats`. Run fields (`sack`,
`packLosses`, `sneakUntil`, `keepers`) are optional and need no migration.
