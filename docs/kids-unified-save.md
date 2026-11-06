# Learning Grove as a profile layer on the campaign save (R0726, KIDS-58)

Recommendation from the kids' side to CAMP, who own the save structure. Today the Learning
Grove is its own `SaveMode 'edu'` with three slots (`platform/storage.ts`). Maor wants one
campaign mode with more slots. What must survive, from the kids' side: a child profile,
band-filtered content, a progress record a grown-up can read, and a way to graduate into
the full campaign without losing Nubbins.

## Proposal

`edu` becomes a profile layer on the one campaign save.

```ts
world.profile = {
  kind: 'child' | 'adult';
  band: 'sprout' | 'reader' | null;   // null for adult
  name: string; icon: string; colour: string;   // KIDS-28 / KIDS-60 launcher tile
  // the grown-up's limits stay in world.edu (below)
};
world.edu   // learning progress, limits, words, items, daily minutes (unchanged shape)
```

- `world.edu` keeps everything it has now (games, ladder skills, items, words, `daily`, loss
  holds, rounds, read-aloud). Nothing moves, so the migration copies it untouched.
- The audience filter (`sim/audience.ts`) drives which scenes play: only `all` for a child
  profile. The same campaign flags drive both kinds of profile.
- Slot labels show the child's name (KIDS-28). Up to 6 child profiles (KIDS-60), each with
  its own limits and daily minutes.

## Locks a child profile keeps

- Mature content is unavailable (the setting is hidden and forced to Off).
- The title screen is locked behind the gate (KIDS-27), so a child cannot reach other slots.
- Story worlds (Atlas, Arcade, Multiverse, Neopia) are read-only, and the Multiverse does not
  exist for a child (it is `adult`).
- The shop has no chance rolls (KIDS-24): eggs and finishes are shown, never gambled.

## Graduation (KIDS-59)

A reader who turns 11, or finishes the reader campaign, can be switched to an adult profile
by a grown-up behind the gate ("Continue as a Keeper"). The save keeps the chapter, Nubbins
and keepsakes; `profile.kind` becomes `'adult'`, `storyLanguage` becomes `'standard'` from
the current chapter, Mature stays Off, and `edu` is set to null (the learning record can be
exported first as the progress sheet). A certificate keepsake is granted. Code:
`eduToCampaign(save)` in `sim/save.ts`.

## Migration

An old `edu` save becomes a campaign save with a child profile: `profile = { kind: 'child',
band: edu.band, name: edu.childName, ... }`, `edu` copied as is. A test deserialises a
current-version `edu` save, migrates it, and asserts the `edu` state is deep-equal.

## Touch points

`src/platform/storage.ts` (mode and slot count), `src/sim/save.ts` (migration, `eduToCampaign`),
`src/sim/audience.ts`, `src/sim/edu.ts`, `src/ui/title.ts`. Status: design only. CAMP's
save design should list the fields, the graduation migration and the locks above; the
migration test lands with their save change (it needs the `profile` field).
