/**
 * Named sculpt rules. A sculpt's colour, shade and fur hooks are functions, and functions
 * cannot be posted to a worker or hashed for a cache. So every hook a spec uses is made
 * by a rule registered here under a name: a factory (`defineRule`, e.g. `stripes` with
 * its axis, frequency and colour) or a one-off (`namedRule`, e.g. Fennel's fur). The
 * function a rule returns remembers its name and arguments, which is all a worker needs
 * to make the same function again on its side.
 *
 * Arguments must be plain data (numbers, strings, arrays, plain objects): they travel as
 * JSON. The registry fills as the species modules load, so a worker imports the same
 * modules the page does.
 */

/** A hook as data: the rule's name and the arguments its factory was called with. */
export interface RuleRef {
  rule: string;
  args: unknown[];
}

type Hook = (...args: never[]) => unknown;
type Factory = (...args: never[]) => Hook;

const factories = new Map<string, Factory>();
const refs = new WeakMap<Hook, RuleRef>();

/**
 * Register a rule factory. The returned factory is the one to call: each function it
 * makes is tagged with `{ rule: name, args }`.
 */
export function defineRule<A extends unknown[], F extends Hook>(
  name: string,
  factory: (...args: A) => F,
): (...args: A) => F {
  factories.set(name, factory as unknown as Factory);
  return (...args: A) => {
    const fn = factory(...args);
    refs.set(fn, { rule: name, args });
    return fn;
  };
}

/** Register a one-off hook under a name (a factory with no arguments). */
export function namedRule<F extends Hook>(name: string, fn: F): F {
  factories.set(name, (() => fn) as unknown as Factory);
  refs.set(fn, { rule: name, args: [] });
  return fn;
}

/** The data behind a hook, or null when it was not made by a registered rule. */
export function ruleRef(fn: Hook): RuleRef | null {
  return refs.get(fn) ?? null;
}

/** Make the hook a ref names. Throws for a rule this context has not registered. */
export function resolveRule<F extends Hook>(ref: RuleRef): F {
  const factory = factories.get(ref.rule);
  if (!factory) throw new Error(`unknown sculpt rule "${ref.rule}"`);
  return (factory as unknown as (...a: unknown[]) => F)(...ref.args);
}

/**
 * A rule factory's source text, folded into the cache hash so that editing a rule's code
 * invalidates the geometry baked with it.
 */
export function ruleSource(name: string): string {
  return factories.get(name)?.toString() ?? '';
}
