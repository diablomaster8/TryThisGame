/**
 * R0709 (KIDS-41): the optional dyslexia-friendly reading font, Lexend (SIL OFL 1.1, self-hosted
 * from Fontsource at a pinned version). It is fetched only when the player picks it in Settings
 * or the grown-up area (or loads a save that already has it), so nobody else downloads it.
 */
let loading: Promise<unknown> | null = null;

/** Load Lexend's regular and bold sheets once; a failed fetch (offline) is retried next time. */
export function loadAccessFont(): Promise<unknown> {
  loading ??= Promise.all([
    import('@fontsource/lexend/400.css'),
    import('@fontsource/lexend/700.css'),
  ]).catch(() => {
    loading = null;
  });
  return loading;
}
