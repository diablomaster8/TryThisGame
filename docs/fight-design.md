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

## Child-profile skin: the Friendly Match (R0747, KIDS-79)

A requirement for whoever builds the turn-based fight system (CAMP or COMBAT). A child
profile (`isChildProfile`, the Learning Grove) never sees fighting. It gets the same turn
engine under a "Friendly Match" skin:

- Actions are tricks: Splash, Twirl, Big Jump. Each is resolved from the same stats as the
  fight moves (Swim, Fly, Run, Power, Stamina), so growth still matters.
- The opponent giggles instead of losing HP. Its "fun meter" fills as tricks land. The
  skin's text and sounds never use hurt, hit, faint, defeat or knockout words.
- No knockouts, ever: a match ends when the fun meter is full or the turns run out, and the
  closing card always says "Everyone had fun!". Both sides get a prize; a rematch is offered.
- An optional learning twist doubles a trick's power: a sum (sprout counting up to 5,
  reader sums to 20), a rhyme, or a Hebrew or Japanese word from the courses. Skipping the
  twist is always fine, and a wrong answer only means a normal-power trick.
- The engine takes a `friendly: boolean` flag on the match. With it set, `defeat` is not a
  reachable state: damage is replaced by fun points, `matchResult()` can only return
  `'fun'`, and no event of kind `defeat` or `faint` is emitted. A sim test must assert this
  over a thousand seeded matches.
- Unavailable to a child profile: Mature content, chance-based prizes (KIDS-24), and any
  stake of Nubbins or Shells.

Built (round 13): `src/sim/battle/giggle.ts` is the Friendly Match sim: `startFriendlyMatch`,
`playTrick(trick, twist)` and `matchResult()`, which can only return `'fun'`. Tunables are in
`config/tuning-friendly-match.ts`; `tests/sim/friendly-match.test.ts` plays 1,000 seeded matches
and asserts no defeat is reachable. The screen, the trick buttons and the twist prompts are not
built yet. The module is separate from the pass-and-play `friendly` context in `friendly.ts`.
