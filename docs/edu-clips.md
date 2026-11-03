# Learning Grove listening clips (R0675)

Clip ids: `animal/<name>`, `word/<word>`, `phoneme/<first sound>`. `EDU_CLIPS` (config/edu.ts) maps each
id to the file a recording would have; `resolveClip(id)` (platform/edu-audio.ts) is the single lookup.
Order: recording (id listed in `EDU_RECORDED`) -> code-made recipe -> speech voice (words only). A
recording that fails to load falls back to the synth. Sound stays muted until the first tap, and
follows the effects switch.

| Kind | Files to add | Now | Would benefit from a real recording |
| --- | --- | --- | --- |
| Animals (16) | `public/audio/edu/animals/<name>.mp3` | synthesised (`edu-synth.ts`) | yes, all: synthetic calls are rough (cow, horse, lion, bear, dog most) |
| First sounds (about 24) | `public/audio/edu/phonemes/<sound>.mp3` | synthesised formant/noise recipes | yes, all, and first: stops (b d g k p t) and glides are only approximate; phonics needs clean sounds |
| Picture words (41) and reader words | `public/audio/edu/words/<word>.mp3` | device speech voice | yes, but lowest priority; speech is acceptable |

To add a recording: drop the mp3 at the path above and add the id to `EDU_RECORDED`.
Mono, 44.1 kHz, trimmed, peak about -3 dB.

The clap pad (`ui/edu-clap.ts`, `EduRound.clapPad`): each tap on the 🙌 pad counts a beat (dot + tick); it never marks the answer.
