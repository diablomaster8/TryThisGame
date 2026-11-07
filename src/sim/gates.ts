import type { ReadonlyWorld } from './readonly';
import { GATE_MAX_CHAPTER } from '../config/tuning-more/story-open-lines';
import { audienceAllowed } from './audience';
import type { World } from './types';

/**
 * R0613 (CAMP-21): a gate expression language for areas, lines and quests (the table is
 * `config/gates.ts`). Pure: `evalGate` reads a world and writes nothing, `parseGate` and
 * `checkGates` need no world at all, so the content checker can build the whole graph.
 */
type Term = { op: 'term'; key: string; args: string[] };
export type GateNode = Term | { op: 'not'; of: GateNode } | { op: 'and' | 'or'; items: GateNode[] };

const TERM_CHARS = /[A-Za-z0-9_.:<>=-]/;

export class GateSyntaxError extends Error {}

/** Parse `text` into a tree. Throws `GateSyntaxError` on anything it cannot read. */
export function parseGate(text: string): GateNode {
  let i = 0;
  const ws = (): void => {
    while (text[i] === ' ') i++;
  };
  const atom = (): GateNode => {
    ws();
    if (text[i] === '!') {
      i++;
      return { op: 'not', of: atom() };
    }
    if (text[i] === '(') {
      i++;
      const inner = or();
      ws();
      if (text[i] !== ')') throw new GateSyntaxError(`missing ) in "${text}"`);
      i++;
      return inner;
    }
    const start = i;
    while (i < text.length && TERM_CHARS.test(text[i]!)) i++;
    if (i === start) throw new GateSyntaxError(`expected a term at ${i} in "${text}"`);
    const [key, ...args] = text.slice(start, i).split(':');
    return { op: 'term', key: key!, args };
  };
  const list = (sep: string, op: 'and' | 'or', next: () => GateNode): GateNode => {
    const items = [next()];
    for (ws(); text[i] === sep; ws()) {
      i++;
      items.push(next());
    }
    return items.length === 1 ? items[0]! : { op, items };
  };
  const and = (): GateNode => list('&', 'and', atom);
  const or = (): GateNode => list('|', 'or', and);
  const tree = or();
  ws();
  if (i < text.length) throw new GateSyntaxError(`unexpected "${text[i]}" in "${text}"`);
  return tree;
}

/** `ch>=3`, `ch<5`, `ch=4`, `ch3` (bare: at least). Null when it is not a comparison. */
function compare(value: number, spec: string): boolean | null {
  const m = /^[a-z]+(>=|<=|>|<|=)?(\d+)$/.exec(spec);
  if (!m) return null;
  const n = Number(m[2]);
  switch (m[1]) {
    case '<=':
      return value <= n;
    case '>':
      return value > n;
    case '<':
      return value < n;
    case '=':
      return value === n;
    default:
      return value >= n;
  }
}

/** The spine's chapter number: 1 to 12, `GATE_MAX_CHAPTER` once it has ended, 0 with no campaign. */
export function spineChapter(world: ReadonlyWorld): number {
  const c = world.campaign;
  if (!c || c.storyline !== null) return 0;
  return c.ending !== null ? GATE_MAX_CHAPTER : c.chapter;
}

/** A side story's status in the spine's book ('done', 'open', 'closed'), or undefined. */
function sideStatus(world: World, id: string): string | undefined {
  const c = world.campaign;
  return (c?.side[id] ?? c?.fun[id])?.status;
}

type GateTable = Readonly<Record<string, string>>;

function evalTerm(world: World, t: Term, table: GateTable, seen: string[]): boolean {
  const [a, b] = t.args;
  switch (t.key) {
    case 'any':
      return true;
    case 'spine':
      if (a === 'ending')
        return b === undefined
          ? spineChapter(world) >= GATE_MAX_CHAPTER
          : world.campaign?.ending === b;
      return compare(spineChapter(world), a ?? '') ?? false;
    case 'ending': {
      const e = world.lines?.[a ?? '']?.ending ?? null;
      return b === undefined ? e !== null : e === b;
    }
    case 'quest':
      return sideStatus(world, a ?? '') === 'done';
    case 'flag': {
      const name = a ?? '';
      if (!name.startsWith('spine.')) return false;
      const v = world.campaign?.flags[name.slice(6)];
      return b === undefined ? Boolean(v) : String(v) === b;
    }
    case 'unlock':
      return Boolean((world.unlocks as unknown as Record<string, boolean>)[a ?? '']);
    case 'audience':
      return audienceAllowed(a === 'adult' ? 'adult' : 'teen', {
        matureContent: world.settings.matureContent,
        learningGrove: world.edu !== null,
      });
    case 'gate':
      return evalGateId(world, a ?? '', table, seen);
    default:
      return false;
  }
}

function evalNode(world: World, n: GateNode, table: GateTable, seen: string[]): boolean {
  switch (n.op) {
    case 'term':
      return evalTerm(world, n, table, seen);
    case 'not':
      return !evalNode(world, n.of, table, seen);
    case 'and':
      return n.items.every((x) => evalNode(world, x, table, seen));
    case 'or':
      return n.items.some((x) => evalNode(world, x, table, seen));
  }
}

/** Evaluate gate `id` of `table` (a cycle or an unknown id reads as closed, never loops). */
export function evalGateId(
  world: World,
  id: string,
  table: GateTable,
  seen: string[] = [],
): boolean {
  const text = table[id];
  if (text === undefined || seen.includes(id)) return false;
  return evalNode(world, parseGate(text), table, [...seen, id]);
}

/** Evaluate one expression string against a world. */
export function evalGate(world: World, text: string, table: GateTable = {}): boolean {
  return evalNode(world, parseGate(text), table, []);
}

/** Every term in a tree. */
export function gateTerms(n: GateNode): Term[] {
  switch (n.op) {
    case 'term':
      return [n];
    case 'not':
      return gateTerms(n.of);
    default:
      return n.items.flatMap(gateTerms);
  }
}

/** The `gate:<id>` references in a tree. */
export function gateRefs(n: GateNode): string[] {
  return gateTerms(n).flatMap((t) => (t.key === 'gate' && t.args[0] ? [t.args[0]] : []));
}

/** What the checker knows about the real content, to say which terms can ever be met. */
export interface GateUniverse {
  lines: ReadonlySet<string>;
  /** Ending ids by line id. */
  endings: Readonly<Record<string, readonly string[]>>;
  quests: ReadonlySet<string>;
  unlocks: ReadonlySet<string>;
}

export interface GateReport {
  /** Problems: syntax, unknown gate, cycle, a term the spine's ending can never reach. */
  problems: string[];
  /** One printable line per gate: `id = expr  -> refs`. */
  graph: string[];
  /** Gate ids in dependency order (every gate after the gates it names). */
  order: string[];
}

const KNOWN_KEYS = ['any', 'spine', 'ending', 'quest', 'flag', 'unlock', 'audience', 'gate'];

/**
 * Build the graph of `table` and check it: parse errors, `gate:` references to nothing, cycles,
 * and terms the spine's ending cannot reach (a chapter past the last, an unknown line, ending,
 * quest or unlock). Pure.
 */
export function checkGates(table: GateTable, universe?: GateUniverse): GateReport {
  const problems: string[] = [];
  const graph: string[] = [];
  const edges = new Map<string, string[]>();
  for (const [id, text] of Object.entries(table)) {
    let tree: GateNode;
    try {
      tree = parseGate(text);
    } catch (e) {
      problems.push(`gate ${id}: ${(e as Error).message}`);
      continue;
    }
    const refs = gateRefs(tree);
    edges.set(id, refs);
    graph.push(`${id} = ${text}${refs.length ? `  -> ${refs.join(', ')}` : ''}`);
    for (const r of refs) if (!(r in table)) problems.push(`gate ${id}: unknown gate "${r}"`);
    for (const t of gateTerms(tree)) {
      const [a, b] = t.args;
      if (!KNOWN_KEYS.includes(t.key)) problems.push(`gate ${id}: unknown term "${t.key}"`);
      if (t.key === 'spine' && a !== 'ending') {
        const m = /^[a-z]+(>=|<=|>|<|=)?(\d+)$/.exec(a ?? '');
        if (!m || Number(m[2]) >= GATE_MAX_CHAPTER + (m[1] === '<' ? 1 : 0))
          problems.push(`gate ${id}: the spine never reaches "${a}"`);
      }
      if (!universe) continue;
      if (
        t.key === 'ending' &&
        (!a || !universe.lines.has(a) || (b !== undefined && !universe.endings[a]?.includes(b)))
      )
        problems.push(`gate ${id}: no such line ending "${t.args.join(':')}"`);
      if (t.key === 'quest' && !universe.quests.has(a ?? ''))
        problems.push(`gate ${id}: no such quest "${a}"`);
      if (t.key === 'unlock' && !universe.unlocks.has(a ?? ''))
        problems.push(`gate ${id}: no such unlock "${a}"`);
    }
  }
  // Depth-first, in table order: a node met again while on the path is a cycle.
  const state = new Map<string, 1 | 2>();
  const order: string[] = [];
  const visit = (id: string, path: string[]): void => {
    if (state.get(id) === 2 || !edges.has(id)) return;
    if (state.get(id) === 1) {
      problems.push(`gate cycle: ${[...path.slice(path.indexOf(id)), id].join(' -> ')}`);
      return;
    }
    state.set(id, 1);
    for (const r of edges.get(id) ?? []) visit(r, [...path, id]);
    state.set(id, 2);
    order.push(id);
  };
  for (const id of edges.keys()) visit(id, []);
  return { problems, graph, order };
}
