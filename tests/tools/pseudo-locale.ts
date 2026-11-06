/**
 * R0345 (FUN-56): a pseudo-locale generator for the ICU catalogue. It accents the letters,
 * pads each run of literal text by about 40% and brackets the whole message, leaving the
 * placeholders, plural and select syntax and `#` untouched, so `fmt(pseudo(m), args)` is a
 * longer, accented copy of `fmt(m, args)`. `unpseudo` undoes it, which the round-trip test uses.
 */
const FROM = 'aeiouyAEIOUYcnsCNS';
const TO = 'àéîõüýÀÉÎÕÜÝçñšÇÑŠ';
export const PAD = '~';
export const GROWTH = 0.4;

function accentRun(text: string): string {
  let out = '';
  let letters = 0;
  for (const ch of text) {
    const at = FROM.indexOf(ch);
    out += at >= 0 ? TO[at] : ch;
    if (/\w/.test(ch)) letters++;
  }
  return out + (letters > 0 ? PAD.repeat(Math.ceil(text.length * GROWTH)) : '');
}

/** Closing index of the brace block that opens at `from`. */
function close(msg: string, from: number): number {
  let depth = 0;
  for (let i = from; i < msg.length; i++) {
    if (msg[i] === '{') depth++;
    else if (msg[i] === '}' && --depth === 0) return i;
  }
  throw new Error(`unclosed brace in: ${msg}`);
}

function body(msg: string): string {
  let out = '';
  let run = '';
  let i = 0;
  const flush = (): void => {
    out += accentRun(run);
    run = '';
  };
  while (i < msg.length) {
    const ch = msg[i]!;
    if (ch === '{') {
      flush();
      const end = close(msg, i);
      const inner = msg.slice(i + 1, end);
      const m = /^(\s*\w+\s*,\s*(?:plural|select)\s*,)([\s\S]*)$/.exec(inner);
      if (!m) out += `{${inner}}`;
      else {
        // Each `key {text}` option: keep the key, pseudo the text.
        let opts = '';
        const rest = m[2]!;
        let j = 0;
        while (j < rest.length) {
          const k = /^\s*[=\w]+\s*\{/.exec(rest.slice(j));
          if (!k) {
            opts += rest.slice(j);
            break;
          }
          const open = j + k[0].length - 1;
          const stop = close(rest, open);
          opts += rest.slice(j, open + 1) + body(rest.slice(open + 1, stop)) + '}';
          j = stop + 1;
        }
        out += `{${m[1]}${opts}}`;
      }
      i = end + 1;
    } else if (ch === '#') {
      flush();
      out += '#';
      i++;
    } else {
      run += ch;
      i++;
    }
  }
  flush();
  return out;
}

/** The pseudo-locale form of one ICU message. */
export function pseudo(msg: string): string {
  return `[${body(msg)}]`;
}

/** Undoes `pseudo` on a rendered string (outer brackets, padding and accents). */
export function unpseudo(rendered: string): string {
  let s = rendered.replace(/^\[/, '').replace(/\]$/, '').split(PAD).join('');
  let out = '';
  for (const ch of s) {
    const at = TO.indexOf(ch);
    out += at >= 0 ? FROM[at] : ch;
  }
  s = out;
  return s;
}

/** Sample arguments for every placeholder in a message: numbers for plurals, a word otherwise. */
export function sampleArgs(msg: string, n = 2): Record<string, string | number> {
  const args: Record<string, string | number> = {};
  for (const m of msg.matchAll(/\{\s*(\w+)\s*(?:,\s*(plural|select))?/g)) {
    const [, name, kind] = m;
    args[name!] = kind === 'plural' ? n : kind === 'select' ? 'other' : 'Word';
  }
  // A name used as a plural elsewhere stays numeric.
  for (const m of msg.matchAll(/\{\s*(\w+)\s*,\s*plural/g)) args[m[1]!] = n;
  return args;
}
