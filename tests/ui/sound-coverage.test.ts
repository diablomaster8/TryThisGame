import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createRun, jumpPressed, jumpReleased, stepRun } from '../../src/minigames/expedition/run';
import { ExpeditionSfx, type ExpeditionCue } from '../../src/minigames/expedition/sfx';
import { groveSfx } from '../../src/ui/event-feedback';
import type { SimEvent } from '../../src/sim/types';

/** R0450 (TECH-08): every effect is played somewhere, and an Expedition run is not silent. */
const AUDIO = 'src/platform/audio.ts';

function soundNames(): string[] {
  const src = readFileSync(AUDIO, 'utf8');
  const start = src.indexOf('export type SoundName =');
  const body = src.slice(start, src.indexOf(';', start));
  return [...body.matchAll(/\|\s*'([A-Za-z]+)'/g)].map((m) => m[1]!);
}

function sources(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) sources(p, out);
    else if (p.endsWith('.ts')) out.push(p.split('\\').join('/'));
  }
  return out;
}

describe('sound coverage', () => {
  it('every SoundName is referenced outside audio.ts by code that plays sounds', () => {
    const names = soundNames();
    expect(names.length).toBeGreaterThan(40);
    const users = sources('src')
      .filter((p) => p !== AUDIO)
      .map((p) => readFileSync(p, 'utf8'))
      .filter((t) => /playSound|SoundName/.test(t));
    const missing = names.filter((n) => !users.some((t) => t.includes(`'${n}'`)));
    expect(missing).toEqual([]);
  });

  it('a scripted Expedition run produces at least five distinct effects', () => {
    const run = createRun(7);
    const sfx = new ExpeditionSfx();
    const cues: ExpeditionCue[] = [];
    let jumps = 0;
    let heldMs = 0;
    while (!run.finished) {
      // Jump whenever on the ground: alternate a tap (50 ms) and a long hold (400 ms).
      if (run.onGround && !run.holding) {
        jumpPressed(run);
        jumps += 1;
        heldMs = 0;
      }
      if (run.holding && (heldMs += 25) >= (jumps % 2 ? 50 : 400)) jumpReleased(run);
      stepRun(run, 25);
      cues.push(...sfx.observe(run));
    }
    const kinds = new Set(cues.map((c) => ('sound' in c ? c.sound : 'chime')));
    expect([...kinds]).toEqual(expect.arrayContaining(['jump', 'jumpHigh', 'chime', 'fanfare']));
    expect(kinds.size).toBeGreaterThanOrEqual(5);
    // The shell chime climbs with a combo.
    const pitches = cues.flatMap((c) => ('chime' in c ? [c.chime] : []));
    expect(Math.max(...pitches)).toBeGreaterThan(0);
  });

  it('the Grove table sounds a throw, a fruit, a shaken tree, eating and a miss', () => {
    const ev = (kind: string) => ({ kind }) as unknown as SimEvent;
    expect(
      ['thrown', 'fruitDropped', 'treeShaken', 'ate', 'cantReach'].map((k) => groveSfx(ev(k))),
    ).toEqual(['whee', 'thup', 'rustle', 'nom', 'hmm']);
    expect(groveSfx(ev('hatched'))).toBeNull();
  });
});
