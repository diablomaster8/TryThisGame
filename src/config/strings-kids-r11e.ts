/** Round 11, lane E (kids): words for the Learning Grove's Grove-noticing moments (R0723). */
const NUMBER_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five'] as const;

export const NOTICING_TEXT = {
  /** "One, two, three apples!" for n fruit on the ground. */
  fruit: (n: number): string => {
    const words = NUMBER_WORDS.slice(1, n + 1).map((w) => w.toLowerCase());
    const list = words.map((w, i) => (i === 0 ? w[0]!.toUpperCase() + w.slice(1) : w)).join(', ');
    return `${list} ${n === 1 ? 'apple' : 'apples'}!`;
  },
  /** "What colour is Nono? Blue!" */
  egg: (name: string, colour: string): string => `What colour is ${name}? ${colour}!`,
  /** "Shake, shake, shake: three shakes!" for n shakes. */
  shakes: (n: number): string => {
    const word = (NUMBER_WORDS[Math.min(n, 5)] ?? 'Some').toLowerCase();
    return `${Array.from({ length: Math.min(n, 5) }, (_, i) => (i === 0 ? 'Shake' : 'shake')).join(', ')}: ${word} ${n === 1 ? 'shake' : 'shakes'}!`;
  },
} as const;
