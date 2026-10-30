# Fight design brief

The standing brief for Grove's bouts: the turn-based core (`src/sim/battle/`), the ATB
"Command" bout, doubles, and the grid tactics mode (`src/sim/battle/tactics/`). The full
recommendations are FIGHT-01 to FIGHT-100 in `recs-2026-10-27/`; this page holds the rules
every new move, foe or map must keep.

## Tone

- Every bout is a play-fight. Nobody is hurt, nobody faints, nothing dies. HP is "puff" for
  play, and running out of it means "tuckered out".
- Kid mode (Gentle bouts, the Learning Grove) can never be lost: 1 HP floor, a free cuddle,
  a hug at the end.
- No bout is ever a fail gate in the campaign, and none happens in chapters 9–11 except
  Corvin's garden, which the Keeper chooses (`src/sim/battle/contexts.ts`).

## Slapstick rules (recs FUN-74)

Comedy is cheapest when it is designed in, so these hold for every fight mode.

1. **Fumbles.** Any move can fumble: about one in twenty (`FUN_FUMBLE`, 5 %) trips over
   a daisy instead, with a comic animation and no damage. The nearest rival laughs so hard it
   loses its next action. The roll comes from a hash of the bout's seed, the turn and the
   combatant, so it never moves another roll and replays stay exact. Built in the turn core
   (`fumbles` in `turn.ts`); never on the Keeper's side of a gentle bout, never in Command
   bouts.
2. **Dizzy, not down.** A tuckered-out combatant is "too dizzy to continue": the spiral emote
   (💫), sitting down, then a nap under a leaf (ours) or a yawn and a wave home (theirs). No
   fainting, no lying flat with closed eyes in pain, no knock-out stars over a hurt face.
   Built on the turn screen.
3. **Every foe type talks back.** Each enemy type has one taunt (at the start) and one defeat
   line (when it toddles home). The seeded quips in `strings-battle.ts` (`foeHome`,
   `wildHome`) are the start; a new foe family ships with both lines.
4. **Push into the pond.** On a grid map, a knockback move that pushes a unit into deep water
   drops it in with a `splash`: it loses its next move climbing out, soggy, and is never
   hurt by the water itself. The push rules live with the terrain in
   `src/sim/battle/tactics/terrain.ts`; the sound is `splash` in `platform/audio.ts`.

## Sound

Hits sound by move type (Swim splash, Fly swish, Run patter, Power and Normal a wood block),
a Dizzy self-bonk boings, a tuckered Nubbin yawns. Turn bouts play `battle`, the Circuit
`circuit`, calm and gentle bouts `calm`. Nothing plays before the first tap.

## Checks

- `tests/sim/battle-r6.test.ts`: the fumble share and the rival's lost turn.
- `tests/sim/battle-balance.test.ts`: the balance harness, which runs with fumbles on.
