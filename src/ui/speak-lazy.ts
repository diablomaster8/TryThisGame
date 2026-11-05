/**
 * R0446 (TECH-04, r12-d3): the title and the `?kids` picker read a line aloud through
 * `speakLine`, but `lesson.ts` reaches the sim (languages, behaviour, the world), so it loads
 * on the first spoken line instead of with the title. By then the boot prefetch has it.
 */
export function speakLater(text: string): void {
  import('./lesson').then(
    (m) => m.speakLine(text),
    () => undefined,
  );
}
