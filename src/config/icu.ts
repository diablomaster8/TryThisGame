/**
 * R0345 (FUN-56): a small ICU MessageFormat formatter for the UI catalogue. It handles
 * `{name}`, `{n, plural, =0 {..} one {# x} other {# xs}}` (with `#` for the number, formatted
 * by `Intl.NumberFormat`) and `{k, select, a {..} other {..}}`, with `'{'` style quoting left
 * out on purpose (no catalogue string needs a literal brace). Plural categories come from
 * `Intl.PluralRules`, so another locale brings its own `few` and `many` forms with no code
 * change. English is the only catalogue today (`messages-en.ts`).
 */
export type MessageArgs = Record<string, string | number>;

interface Cursor {
  s: string;
  i: number;
}

let locale = 'en';

/** Sets the locale for plural rules and number formatting (the catalogue is swapped by the caller). */
export function setLocale(next: string): void {
  locale = next;
}

function block(c: Cursor): string {
  // At '{': returns the raw text up to the matching '}' and moves past it.
  let depth = 0;
  const start = c.i + 1;
  for (; c.i < c.s.length; c.i++) {
    if (c.s[c.i] === '{') depth++;
    else if (c.s[c.i] === '}' && --depth === 0) {
      const body = c.s.slice(start, c.i);
      c.i++;
      return body;
    }
  }
  throw new Error(`unclosed brace in message: ${c.s}`);
}

function splitTop(body: string, sep: string, limit: number): string[] {
  const out: string[] = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < body.length && out.length < limit - 1; i++) {
    const ch = body[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (ch === sep && depth === 0) {
      out.push(body.slice(from, i));
      from = i + 1;
    }
  }
  out.push(body.slice(from));
  return out;
}

function options(spec: string): Map<string, string> {
  const map = new Map<string, string>();
  const c: Cursor = { s: spec.trim(), i: 0 };
  while (c.i < c.s.length) {
    const m = /^\s*([=\w]+)\s*\{/.exec(c.s.slice(c.i));
    if (!m) break;
    c.i += m[0].length - 1;
    map.set(m[1]!, block(c));
  }
  return map;
}

function render(msg: string, args: MessageArgs, hash: number | null): string {
  let out = '';
  const c: Cursor = { s: msg, i: 0 };
  while (c.i < c.s.length) {
    const ch = c.s[c.i]!;
    if (ch === '#' && hash !== null) {
      out += new Intl.NumberFormat(locale).format(hash);
      c.i++;
    } else if (ch === '{') {
      const body = block(c);
      const [name, kind, rest] = splitTop(body, ',', 3).map((x) => x.trim()) as [
        string,
        string | undefined,
        string | undefined,
      ];
      const v = args[name];
      if (v === undefined) throw new Error(`missing argument ${name} in: ${msg}`);
      if (!kind) out += typeof v === 'number' ? new Intl.NumberFormat(locale).format(v) : v;
      else if (kind === 'plural') {
        const opts = options(rest ?? '');
        const n = Number(v);
        const pick =
          opts.get(`=${n}`) ??
          opts.get(new Intl.PluralRules(locale).select(n)) ??
          opts.get('other');
        out += render(pick ?? '', args, n);
      } else if (kind === 'select') {
        const opts = options(rest ?? '');
        out += render(opts.get(String(v)) ?? opts.get('other') ?? '', args, hash);
      } else throw new Error(`unknown format ${kind} in: ${msg}`);
    } else {
      out += ch;
      c.i++;
    }
  }
  return out;
}

/** Formats one ICU message. */
export function fmt(message: string, args: MessageArgs = {}): string {
  return render(message, args, null);
}
