import { afterEach, describe, expect, it, vi } from 'vitest';
import { setAnticsLive, liveliness } from '../../src/sim/antics';
import { createWorld } from '../../src/sim/world';
import type { Nubbin } from '../../src/sim/types';

// R0567: the personality chip in the Learning Grove's sprout band is the face icon alone, with
// a read-aloud line; the reader band and the main game keep the word. A tiny fake DOM stands in
// for the browser (tests run in node).

class FakeNode {
  className = '';
  textContent = '';
  hidden = false;
  disabled = false;
  type = '';
  title = '';
  width = 0;
  height = 0;
  children: FakeNode[] = [];
  attrs: Record<string, string> = {};
  listeners: Record<string, Array<() => void>> = {};
  style: Record<string, string> = {};
  classList = { toggle: (): void => undefined, add: (): void => undefined };
  constructor(public tag: string) {}
  set innerHTML(_v: string) {
    this.children = [];
    this.textContent = '';
  }
  append(...c: FakeNode[]): void {
    this.children.push(...c);
  }
  appendChild(c: FakeNode): FakeNode {
    this.children.push(c);
    return c;
  }
  setAttribute(k: string, v: string): void {
    this.attrs[k] = v;
  }
  removeAttribute(k: string): void {
    delete this.attrs[k];
  }
  addEventListener(t: string, f: () => void): void {
    (this.listeners[t] ??= []).push(f);
  }
  click(): void {
    for (const f of this.listeners.click ?? []) f();
  }
  getContext(): null {
    return null;
  }
  texts(): string[] {
    return [this.textContent, ...this.children.flatMap((c) => c.texts())].filter(Boolean);
  }
}

afterEach(() => vi.unstubAllGlobals());

async function chip() {
  vi.stubGlobal('document', { createElement: (t: string) => new FakeNode(t) });
  const { PersonalityChip } = await import('../../src/ui/personality-chip');
  return new PersonalityChip();
}

function adult(): Nubbin {
  const n = structuredClone(createWorld(3, 0).nubbins[0]!);
  n.name = 'Pip';
  n.stage = 'adult';
  n.personality = 'shy';
  return n;
}

describe('R0567 personality chip', () => {
  it('sprout band: face icon only, no word, and a tap speaks the line', async () => {
    const c = await chip();
    const said: string[] = [];
    c.onSay = (t) => said.push(t);
    c.update(adult(), true);
    const root = c.root as unknown as FakeNode;
    expect(root.texts()).toEqual([]);
    expect(root.children.length).toBe(1);
    expect(root.attrs['aria-label']).toBe('Feeling: Shy');
    expect(c.say).toBe('Pip feels shy today.');
    root.click();
    expect(said).toEqual(['Pip feels shy today.']);
  });

  it('reader band and main game: icon, word and blurb, and a tap opens the card', async () => {
    const c = await chip();
    c.update(adult(), false);
    const root = c.root as unknown as FakeNode;
    expect(root.children.length).toBe(3);
    expect(root.texts().join(' ')).toContain('Shy');
    expect(c.say).toBe('');
    expect((c.details as unknown as FakeNode).hidden).toBe(true);
    root.click();
    expect((c.details as unknown as FakeNode).hidden).toBe(false);
  });
});

describe('R0567 antic multiplier in a Learning Grove', () => {
  it('both bands are lively by default (x1.5), the main game normal, a setting still wins', () => {
    setAnticsLive(true);
    const w = createWorld(5, 0);
    const base = liveliness(w);
    w.edu = { age: 'sprout', band: 'sprout' } as never;
    expect(liveliness(w)).toBeCloseTo(base * 1.5, 5);
    w.edu = { age: 'reader', band: 'reader' } as never;
    expect(liveliness(w)).toBeCloseTo(base * 1.5, 5);
    w.settings.liveliness = 'calm';
    expect(liveliness(w)).toBeLessThan(base);
  });
});
