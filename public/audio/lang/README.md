# Language word clips (CV3)

Every Hebrew and Japanese course word has a clip id in `VocabItem.audio`, e.g. `he/shalom` or
`ja/konnichiwa`. Until a native speaker records it, the game plays `placeholder.wav`, a soft
two-note chime with no voice. Never use synthetic speech for these words.

To add a recording:

1. Save it as `public/audio/lang/<clip id>.mp3`, e.g. `public/audio/lang/he/shalom.mp3`
   (mono, 44.1 kHz, trimmed, peak around -3 dB).
2. Add the clip id to `RECORDED` in `src/platform/lang-audio.ts`.

`tests/sim/lang.test.ts` checks that every course word has a clip id and that every id in
`RECORDED` belongs to a course word.
