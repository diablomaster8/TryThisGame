# Credits and licences

What the Grove ships or builds with that it did not make itself, and under which terms. The
full licence texts are deployed with the site in `public/licences/` (served at `/licences/`),
because the fonts' licence asks that it travel with the font files.

## Shipped with the game

| What                                                                                                             | Used for                                                            | Licence                                                                | Text                                       |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| [three.js](https://threejs.org) 0.186.1, with its `examples/jsm` add-ons (MarchingCubes, post-processing passes) | The 3D renderer, the pixel pipeline's scene graph and both 3D modes | MIT, © 2010-2026 three.js authors                                      | `public/licences/three-MIT.txt`            |
| Klee One (via `@fontsource/klee-one` 5.3.0)                                                                      | Big kana and letters in the tracing game                            | SIL Open Font License 1.1, © 2020 The Klee Project Authors (Fontworks) | `public/licences/klee-one-OFL.txt`         |
| Noto Sans Hebrew (via `@fontsource/noto-sans-hebrew` 5.3.0)                                                      | Hebrew words in the language questlines                             | SIL Open Font License 1.1, © 2024 The Noto Project Authors             | `public/licences/noto-sans-hebrew-OFL.txt` |
| Noto Sans JP (via `@fontsource/noto-sans-jp` 5.3.0)                                                              | Japanese words in the language questlines                           | SIL Open Font License 1.1, © Google Inc.                               | `public/licences/noto-sans-jp-OFL.txt`     |

The fonts are loaded on first use (`src/ui/lang-fonts.ts`) and are not renamed or modified.

## Made for the project

- **Art, music, sound effects, story and code:** made for the Grove in this repository. The
  creatures and Keepers are generated in code (`src/render/`, `src/render3d/`, `src/samples/`);
  no sprite sheets, models or audio from any game are imported.
- **`public/audio/lang/placeholder.wav`:** a 0.45 s two-note sine chime (about 660 Hz, then
  880 Hz; 22.05 kHz mono), synthesised for the project when the language questlines were wired
  in (commit `8c8dbd7`, 2026-10-16). It stands in until native speakers record the course
  words (`public/audio/lang/README.md`). It contains no voice and no recorded source.

## Tools that are not shipped

- **Voice-over builder (`voiceover/`):** runs [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)
  (`hexgrad/Kokoro-82M`, Apache License 2.0) on the author's own machine to voice script
  lines. The model and its engine are downloaded by `make_voiceover.bat` into the user's
  folder and are never committed or deployed; the game never uses synthetic speech for the
  Hebrew and Japanese course words.
- **Build and test tools** (Vite, Vitest, TypeScript, ESLint, Prettier) are dev dependencies
  under their own MIT or Apache 2.0 licences and are not part of the deployed site.
