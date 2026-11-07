# Learning Grove on the unified save: what shipped (R0726, KIDS-58)

This began as a recommendation from the kids' side to CAMP (the save owners). It is now
rewritten to describe what was built. What had to survive: a child profile, band-filtered
content, a progress record a grown-up can read, and a way to graduate into the full campaign
without losing Nubbins.

## What shipped: child profiles, not `world.profile`

The first proposal put a `world.profile = { kind, band, name, icon, colour }` field on the
save. **That field does not exist.** CAMP built the profile layer outside the world instead,
as a registry of profile ids:

- Keeper profiles are `p1`..`pN`, child profiles are `k1`..`kN` (`src/platform/profiles.ts`,
  at most `PROFILES.max` = 6 on the device, so up to 6 children). `p1` and `k1` always exist
  and can be renamed, never deleted. Name and avatar live in the registry
  (`grove.profiles.v1`), not in the save.
- `isChildProfile(id)` is `id.startsWith('k')` (`src/platform/storage.ts`).
  `profileModes('k…')` is `['edu']`; a Keeper profile gets `campaign`, the storylines and
  `free`. So a child profile's slots are Learning Grove saves and nothing else.
- Slots are unified keys `grove.<id>.slot.N` (`src/platform/unified-keys.ts`). `k1` keeps the
  legacy `grove.save.edu` key beside it. `setChildProfile('k2')` only works once unified slots
  are on; before that, only `k1` exists.
- The band, the grown-up's limits and the learning record are all still in `world.edu`
  (unchanged shape: games, ladder skills, items, words, `daily`, loss holds, rounds,
  read-aloud). The migration moves the save text untouched, so `edu` is identical.

## What a child profile locks

- Mature content is off for a child (graduation forces it to `'off'`; the audience filter,
  `sim/audience.ts`, plays only `all` scenes in the Learning Grove).
- The device can boot-lock to one Learning Grove slot (KIDS-27, `src/platform/kids-lock.ts`,
  `grove.kidsLock`), kept outside the save so `main.ts` reads it before any save loads.
- The Multiverse is not available to a child profile (`sideAllowed` in `storage.ts`: `adult`).
- The shop has no chance rolls (KIDS-24).
- Slot labels show the child's name (KIDS-28); each child has their own limits and minutes
  because those are in their own `world.edu`.

## Graduation (R0727, KIDS-59)

`eduToCampaign(json, nowWallMs)` in `src/sim/edu-graduate.ts` (not `sim/save.ts`). It reads
a Learning Grove save and returns a campaign save with the same Nubbins, chapter, inventory
and keepsakes, `world.edu = null`, Mature Off and a certificate keepsake
(`certificate-keeper`). It is pure: the caller writes the result to a Keeper campaign slot
and **the child's own slot is left as it was**, so the learning record (and its progress
sheet) is still there. It returns `null` for a save with no `edu`.

## Migration of an old `edu` save

At boot the one-time unified move copies `grove.save.edu` to `grove.k1.slot.1`, byte for
byte, keeping the legacy key (and an archive copy in IndexedDB) for three loads.
`tests/sim/save-unified-r12.test.ts` checks the bytes; `tests/sim/edu-unified-save.test.ts`
checks the `edu` block deep-equals after the move and after a graduated copy is made.

## Not built

- No `world.profile` field and no `profile.kind` in the save; a save does not know whether
  it belongs to a child. The profile id in its key says so.
- No `profile.kind = 'adult'` flip on graduation: the campaign copy is simply a Keeper save.
- The "up to 6 profiles" cap is the device-wide registry cap, shared by Keepers and children.

## Touch points

`src/platform/storage.ts` (profile ids, modes, slots), `src/platform/profiles.ts` (registry),
`src/platform/unified-keys.ts`, `src/platform/kids-lock.ts`, `src/sim/edu-graduate.ts`,
`src/sim/audience.ts`, `src/ui/graduate.ts`, `src/ui/title.ts`.
