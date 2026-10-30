/**
 * R0719 (KIDS-51): the child's own name in Learning Grove lines. `{child}` becomes the name the
 * grown-up typed, or "you"; `{child's}` becomes "Maya's", or "your". At the start of a line or
 * a sentence the fallback is capitalised. Pure, so the same text is shown and said.
 */
export function fillChild(text: string, name: string | undefined): string {
  if (!text.includes('{child')) return text;
  const n = name?.trim() ?? '';
  return text.replace(/\{child('s)?\}/g, (_m, poss: string | undefined, at: number) => {
    if (n) return poss ? `${n}'s` : n;
    const word = poss ? 'your' : 'you';
    const before = text.slice(0, at).trimEnd();
    const start = before === '' || /[.!?]$/.test(before);
    return start ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  });
}

/** The entry prompt's greeting: "Hello, Maya!" before the question, when a name is set. */
export function greet(say: string, name: string | undefined, hello: (n: string) => string): string {
  const n = name?.trim();
  return n ? `${hello(n)} ${say}` : say;
}
