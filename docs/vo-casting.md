# Voice-over casting sheet (R0344, FUN-55)

For recording Hazel's Grove. The script comes from the exporter:

```
npx tsx tests/tools/vo-export.ts > vo.csv
npx tsx tests/tools/vo-export.ts --who hazel
```

One row per line: `id, speaker, mood, text, note, audience`. A line keeps its own `id` when it
has one (`Line.id` in `src/config/story.ts`); otherwise the id is `<scene id>-<n>`, its place in
the scene, so ids hold while lines are edited but shift when lines are added or moved. Freeze
an id into the script (write `id:` on the line) before its take is recorded. A recorded take
is named in `Line.vo.take`; the director's note goes in `Line.vo.note` and lands in the CSV.

All voices are British-leaning, warm and unhurried. Nobody does a funny voice; the comedy
is in the timing. Read-aloud already gives each speaker a pitch and pace (`VOICE_TTS` in
`src/config/tuning-fun-r7.ts`) and those are a fair first guide to tempo.

Record first: Hazel's letter (`c1-letter-*`, her six lines) and the sprout band's chapter 1.

| Speaker | Who | Age | Tempo | Three reference lines |
| --- | --- | --- | --- | --- |
| narrator | Second person, present tense; a friend reading over your shoulder | adult | slow, plain, the dry line left dry | c1-letter-0 "Late spring. The road runs out a little before the Grove does." · c9-shard-collector-13 · c12-close-14 "In the morning it has gone out." |
| hazel | Gran; the absent heart. Never sentimental about herself | old | slow, amused, firm | c1-letter-27 "P.S. The gate sticks. Lift and push." · c11-gate-5 · c12-walk-alone-14 |
| moss | The last warden: dry, tender, fading. Old tales in a deeper register | very old | slowest in the cast; long pauses | c4-open-9 · c7-stillness-5 "Yes. It is cold. That is rather the point." · c12-walk-moss-12 |
| sparks | Loud and kind; the lantern wiring | adult | fast, shouted openers, then gentle | c1-close-5 "HEY. New Keeper. Don't move." · c4-close-12 · c11-open-6 |
| fern | Next door; self-deprecating; lost Bramble | adult | quick, under her breath | c1-letter-33 · c1-close-12 "That isn't how anything works." · c10-bramble-2 |
| marina | The tide pools; taught Hazel's Nubbins to swim | adult | even, a swimmer's breath | c2-open-4 · c8-ledge-s4-13 · c10-bank-moss-gone-14 |
| clover | The gentle ones; knits in grey | adult | soft, unhurried | c3-close-13 · c3-close-35 · c10-moss-stays-9 |
| pixel | Inventor; Byte's wife of twenty years | adult | brisk, technical, fond | c7-close-13 "Trust meter. For Sable. I built it last night." · c10-vigil-9 · c10-dawn-11 |
| luna | The night gardener; Sable's first friend | adult | quiet, warm, a little sleepy | c3-open-16 · c7-open-9 · c10-moss-light-4 |
| ember | Prickly; lost Ash to Corvin | adult | clipped, dry | c5-open-3 "Ember. I don't do small talk." · c5-open-24 · c10-kept-8 |
| byte | The sceptic; numbers and shoelaces | adult | deadpan, precise | c4-close-19 · c10-open-26 · c10-moss-stays-8 |
| dusty | The digger (they/them) | adult | cheerful, earthy, pleased with small things | c4-close-10 "That's Gerald. He's not with us." · c6-open-walked-6 · c10-lull-2 |
| nova | The traveller; guide to the Hollow | adult | breezy, then suddenly earnest | c8-open-5 · c8-ledge-s4-10 · c8-nova-6 |
| corvin | The fallen apprentice; courteous and cold | older adult | smooth, measured, never raised | c2-corvin-12 · c9-open-39 · c9-shard-collector-10 |

Not cast: Sable (her reactions are narrated; her one word is cast when that scene is recorded),
Nubbins (they never speak), and the player ("you", left unvoiced so the player is the
voice). Wisp's two voices, the hiss and the whisper, are sound design, not a casting role.

Playback is not wired yet: once a take exists, the dialogue plays `vo.take` for the line and
falls back to the device voice (`speakLine`) when the clip is missing.
