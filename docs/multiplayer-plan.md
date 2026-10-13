# Logins and multiplayer: a plan (not built)

Grove is a static site with no server (CLAUDE.md). Everything in this plan needs a
backend, so nothing here is implemented. It is a recommendation for when Maor wants it.

## What people would actually use

In this kind of game, "multiplayer" means a few light things, not real-time play:

1. **Cloud save** so the same Grove opens on a phone and a PC.
2. **Visiting**: walk around a friend's Grove, pet their Nubbins, leave a gift.
3. **Trading and racing** Nubbins with friends (share codes already do this offline).
4. **Leaderboards** for races, karate belts and collection completion.
5. **Keeper accounts** so a name and a Grove are yours.

## Recommended shape

- **Backend:** Supabase (Postgres + Auth + Realtime + Storage) on the free tier, or
  Firebase. Both give login, a database and row-level security without running a server.
  Supabase is the better fit: SQL, row-level policies, and a free tier that covers a hobby
  game.
- **Auth:** email magic link and Google/Apple sign-in. No passwords stored by us. Kids
  and privacy: keep accounts optional; the game must keep working fully offline with the
  local save, and a login only adds sync and visiting.
- **Cloud save:** one row per account per slot (`free`, `campaign`) holding the save JSON
  (it is small, well under 200 KB) plus `savedAtWallMs`. On load: pick the newer of local
  and cloud by `savedAtWallMs`, and keep the offline catch-up exactly as it is. Conflicts
  resolve by newest, with the losing copy kept as a backup row for a week.
- **Visiting:** a friend's Grove is just their save JSON with the sim run read-only on the
  visitor's machine (the sim is deterministic, so a visitor can watch it tick from the
  saved state). Petting and gifts become **mailbox actions** written to the owner's row
  and applied as commands when the owner next opens the game (`giftReceived`,
  `pettedByVisitor`). No real-time sync needed.
- **Trading:** the existing share codes, with an optional server-side escrow so a trade
  removes from one account and adds to the other atomically (prevents duplication).
- **Leaderboards:** a `results` table (account, course, tier, time, nubbin snapshot)
  written after a race or bout, read into the Races and Karate menus.
- **Realtime (later):** Supabase Realtime for a "friend is visiting now" toast and a live
  race-ghost mode where both players run the same seed and see each other's progress.

## Effort and order

1. Supabase project, auth, a `saves` table with row-level security: a day.
2. Cloud save sync in `platform/storage.ts` behind a Settings toggle: a day.
3. Visiting (read-only Grove + mailbox): two to three days, mostly UI.
4. Leaderboards: a day.
5. Escrowed trades and live race ghosts: two days each.

## Costs and cautions

- An account system brings a privacy policy, data deletion on request and a children's
  data stance. Keep accounts optional and the offline game complete.
- Cheating: saves are client-generated, so leaderboards should store a replay seed and
  inputs and verify on read, or be labelled "friends only".
- The current save already has `savedAtWallMs` and version migrations, so the sync layer
  can be added without changing the sim.
