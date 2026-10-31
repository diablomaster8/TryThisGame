/** Lane C round 7: questlines beside Hazel's Grove in one world (sim/story-book.ts). */
import { describe, expect, it } from 'vitest';
import { STORYLINE_CONTENT } from '../../src/sim/storyline-content';
import { counter } from '../../src/sim/storyline-checks';
import { storylineRule } from '../../src/sim/storyline-rules';
import { registerStorylines } from '../../src/sim/story-scenes';
import { hasRoom } from '../../src/sim/roster';
import { lineRefusal } from '../../src/sim/story-book';
import { deserialize, SAVE_VERSION, serialize, worldFingerprint } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { catchUp } from '../../src/sim/offline';
import { awayStories } from '../../src/ui/away-stories';
import { c, campaignWorld, playScenes, tick } from './campaign-driver';

registerStorylines(STORYLINE_CONTENT);

/** Hazel's Grove at chapter `n`, its opening played, with five grown Nubbins of the Keeper's. */
function hazelAt(n: number): { world: World; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'debugChapter', chapter: n }, events);
  playScenes(world, events);
  for (let i = 0; i < 5; i++)
    applyCommand(world, { kind: 'debugGive', what: 'egg', amount: 1 }, events);
  for (const nb of world.nubbins)
    if (nb.id !== c(world).mossId) {
      applyCommand(world, { kind: 'debugHatchNow', nubbinId: nb.id }, events);
      nb.stage = 'adult';
      nb.ageMs = 1e7;
    }
  return { world, events };
}

/** Lane C r10 agent A (R0605): walk into a questline's region (or back, with null). */
function enter(world: World, events: SimEvent[], region: string | null): void {
  applyCommand(world, { kind: 'storyRegion', region }, events);
}

function play(world: World, events: SimEvent[], seconds: number): string[] {
  const seen: string[] = [];
  for (let i = 0; i < seconds; i++) {
    tick(world, events, 1.1);
    seen.push(...playScenes(world, events));
  }
  return seen;
}

function snapshot(world: World): string[] {
  return world.nubbins.map((n) => `${n.id}:${n.stage}:${JSON.stringify(n.stats)}`);
}

describe('the story book runs lines beside Hazel', () => {
  it('Hazel chapter 8, the Hundred Days and the Beetle Road advance by their own goals', () => {
    // R0640: the Hollow opens at chapter 8; each line plays in its own region (R0605).
    const { world, events } = hazelAt(8);
    const before = snapshot(world);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'beetle' }, events);
    expect(c(world).storyline).toBeNull();
    expect(c(world).chapter).toBe(8);
    const h = world.lines.hundred!;
    const b = world.lines.beetle!;
    expect(h.chapter).toBe(1);
    expect(b.chapter).toBe(1);
    // The Keeper's Nubbins are all still there, unchanged; the Hundred Days adds its partner.
    for (const s of before) expect(snapshot(world)).toContain(s);
    expect(world.nubbins.length).toBe(before.length + 1);

    enter(world, events, 'fold');
    const seen = play(world, events, 150);
    expect(seen).toContain('h-c1-open');
    expect(seen).not.toContain('b-c1-open');
    // Hatching the Hundred Days' egg meets its chapter 1 goal, and only its.
    const egg = world.nubbins.find((n) => n.id === h.flags.cast)!;
    applyCommand(world, { kind: 'debugHatchNow', nubbinId: egg.id }, events);
    play(world, events, 150);
    expect(h.chapter).toBeGreaterThanOrEqual(2);
    expect(b.chapter).toBe(1);
    expect(c(world).chapter).toBe(8);
    enter(world, events, 'hollow');
    expect(play(world, events, 150)).toContain('b-c1-open');
    // Nobody's flags in anyone else's book.
    expect(c(world).flags.partnerId).toBeUndefined();
    expect(c(world).flags.area).toBeUndefined();
    expect(Object.keys(b.flags).some((k) => k.startsWith('hush') || k === 'partnerId')).toBe(false);
    expect(h.flags.partnerId).toBe(egg.id);
    // The chapter toast names the line.
    expect(events.some((e) => e.kind === 'chapter' && e.line === 'hundred')).toBe(true);
  });

  it('scenes never interleave: a line waits for an empty, rested spine queue', () => {
    const { world, events } = hazelAt(3);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    enter(world, events, 'fold');
    c(world).queue.push('t-ran-away');
    tick(world, events, 3);
    expect(c(world).queue).toEqual(['t-ran-away']);
    playScenes(world, events);
    play(world, events, 100);
    expect(c(world).seen).toContain('h-c1-open');
    expect(c(world).seen.indexOf('h-c1-open')).toBeGreaterThan(c(world).seen.indexOf('t-ran-away'));
  });

  it('lines respect the spine: not before chapter 3, not in the quiet chapters, two at once', () => {
    expect(lineRefusal(hazelAt(2).world, 'hundred')).toBe('early');
    expect(lineRefusal(hazelAt(10).world, 'hundred')).toBe('quiet');
    // R0640: then one region at a time.
    expect(lineRefusal(hazelAt(3).world, 'hundred')).toBeNull();
    expect(lineRefusal(hazelAt(4).world, 'logged')).toBe('early');
    expect(lineRefusal(hazelAt(5).world, 'logged')).toBeNull();
    expect(lineRefusal(hazelAt(5).world, 'beetle')).toBe('early');
    const { world, events } = hazelAt(8);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'beetle' }, events);
    expect(lineRefusal(world, 'hundred')).toBe('running');
    expect(lineRefusal(world, 'dawn')).toBe('cap');
    applyCommand(world, { kind: 'storylineStart', id: 'dawn' }, events);
    expect(world.lines.dawn).toBeUndefined();
  });

  it('line Nubbins count toward their own cap, not the roster', () => {
    const { world, events } = hazelAt(6);
    while (hasRoom(world))
      applyCommand(world, { kind: 'debugGive', what: 'egg', amount: 1 }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'logged' }, events);
    expect(world.lines.logged).toBeDefined();
    expect(hasRoom(world)).toBe(false);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    expect(world.lines.hundred).toBeDefined();
    // Three plus one is the cast cap: a third would be refused anyway by the line cap.
    expect(lineRefusal(world, 'dawn')).toBe('cap');
  });
});

describe('quiet chapters (R0612)', () => {
  it('a running line holds through chapters 9 to 11 and goes on at 12', () => {
    const { world, events } = hazelAt(8);
    applyCommand(world, { kind: 'storylineStart', id: 'beetle' }, events);
    applyCommand(world, { kind: 'debugChapter', chapter: 10 }, events);
    playScenes(world, events);
    play(world, events, 120);
    expect(world.lines.beetle!.seen).toEqual([]);
    applyCommand(world, { kind: 'debugChapter', chapter: 12 }, events);
    playScenes(world, events);
    play(world, events, 150);
    // R0597: and its scenes wait for the Keeper in the Hollow (R0605).
    expect(world.lines.beetle!.seen).toEqual([]);
    enter(world, events, 'hollow');
    play(world, events, 30);
    expect(world.lines.beetle!.seen).toContain('b-c1-open');
  });
});

describe('every line keeps its hands off the Keeper', () => {
  for (const id of ['hundred', 'logged', 'beetle', 'dawn', 'dusk']) {
    it(`${id} keeps every Nubbin, Moss included, with ids and stats unchanged`, () => {
      const { world, events } = hazelAt(8);
      const before = snapshot(world);
      expect(world.nubbins.some((n) => n.id === c(world).mossId)).toBe(true);
      applyCommand(world, { kind: 'storylineStart', id }, events);
      expect(world.lines[id]).toBeDefined();
      for (const s of before) expect(snapshot(world)).toContain(s);
    });
  }

  it("Dawn's chapter 3 reverts only the line's own Nubbin", () => {
    const { world, events } = hazelAt(8);
    applyCommand(world, { kind: 'storylineStart', id: 'dawn' }, events);
    const line = world.lines.dawn!;
    const cast = String(line.flags.cast);
    const egg = world.nubbins.find((n) => n.id === cast)!;
    applyCommand(world, { kind: 'debugHatchNow', nubbinId: egg.id }, events);
    tick(world, events, 1);
    expect(egg.stage).toBe('child');
    const theirs = world.nubbins.filter((n) => n.id !== cast).map((n) => `${n.id}:${n.stage}`);
    applyCommand(world, { kind: 'debugChapter', chapter: 3, line: 'dawn' }, events);
    expect(line.flags['dd-reverted']).toBe(cast);
    for (const s of theirs) expect(world.nubbins.map((n) => `${n.id}:${n.stage}`)).toContain(s);
  });

  it('Logged In recolours the Grove only while it runs; the unlocks and partners stay', () => {
    const { world, events } = hazelAt(5);
    const unlocks = { ...world.unlocks };
    const partners = [...world.partners];
    const grove = world.grove;
    applyCommand(world, { kind: 'storylineStart', id: 'logged' }, events);
    // R0601 (lane C r10 agent A): the server's tint is drawn only inside the server region.
    expect(world.grove).toBe(grove);
    enter(world, events, 'server');
    expect(world.grove).toBe('sun');
    expect(world.unlocks).toEqual(unlocks);
    applyCommand(world, { kind: 'debugChapter', chapter: 4, line: 'logged' }, events);
    enter(world, events, null);
    expect(world.grove).toBe(grove);
    enter(world, events, 'server');
    applyCommand(world, { kind: 'lineAbandon', line: 'logged' }, events);
    expect(world.lines.logged).toBeUndefined();
    expect(world.grove).toBe(grove);
    expect(world.partners).toEqual(partners);
    expect(world.unlocks).toEqual(unlocks);
    // Its scenes left the queue with it; its Nubbins stay in the Grove.
    expect(c(world).queue.some((s) => s.startsWith('l-'))).toBe(false);
    expect(world.nubbins.length).toBeGreaterThanOrEqual(partners.length);
  });
});

describe('away from the Grove (R0632)', () => {
  it('a 7-day catch-up with two lines running is quick and plays no line chapter off-screen', () => {
    const { world, events } = hazelAt(8);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'beetle' }, events);
    const chapters = [world.lines.hundred!.chapter, world.lines.beetle!.chapter];
    const t0 = performance.now();
    catchUp(world, 7 * 86_400_000, 7 * 86_400_000);
    expect(performance.now() - t0).toBeLessThan(3000);
    expect([world.lines.hundred!.chapter, world.lines.beetle!.chapter]).toEqual(chapters);
    // Whatever a line wanted to say waits for the Keeper in its own queue, and reaches the
    // spine's once the Keeper is in its region (R0597, R0605).
    const h = world.lines.hundred!;
    expect(c(world).queue.some((s) => s.startsWith('h-'))).toBe(false);
    enter(world, events, 'fold');
    playScenes(world, events);
    expect(play(world, events, 60).some((s) => s.startsWith('h-'))).toBe(true);
    for (const id of h.queue) expect(c(world).queue).toContain(id);
  });

  it('lane C r8: in the Open flow with 2 lines and 5 quests, still quick, nothing offered', () => {
    const { world, events } = hazelAt(8);
    world.settings.questFlow = 'open';
    world.settings.offlineAging.mode = 'indefinite';
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'beetle' }, events);
    for (const id of ['q01', 'q02', 'q03', 'q04', 'q05'])
      applyCommand(world, { kind: 'questAccept', id }, events);
    const entries = JSON.stringify(Object.keys(world.questBook!.entries).sort());
    const t0 = performance.now();
    const report = catchUp(world, 7 * 86_400_000, 7 * 86_400_000);
    expect(performance.now() - t0).toBeLessThan(3000);
    expect(report.simulatedMs).toBe(7 * 86_400_000);
    expect(report.events.some((e) => e.kind === 'questOffered' || e.kind === 'areaEntered')).toBe(
      false,
    );
    expect(JSON.stringify(Object.keys(world.questBook!.entries).sort())).toBe(entries);
    const stories = awayStories(world);
    expect(stories.some((l) => l.startsWith('The Hundred') || l.includes('chapter 1'))).toBe(true);
    expect(stories.at(-1)).toMatch(/quests under way/);
  });
});

describe('restarting a line (R0643)', () => {
  it('resets only that line; the Grove and the other line are untouched', () => {
    const { world, events } = hazelAt(8);
    applyCommand(world, { kind: 'storylineStart', id: 'beetle' }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    applyCommand(world, { kind: 'debugChapter', chapter: 2, line: 'beetle' }, events);
    play(world, events, 5);
    const hundred = JSON.stringify(world.lines.hundred);
    const spine = JSON.stringify({ ...c(world), queue: [], rest: null, seen: [], seenMs: {} });
    const nubs = snapshot(world);
    applyCommand(world, { kind: 'lineAbandon', line: 'beetle' }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'beetle' }, events);
    expect(world.lines.beetle!.chapter).toBe(1);
    expect(world.lines.beetle!.seen).toEqual([]);
    expect(JSON.stringify(world.lines.hundred)).toBe(hundred);
    expect(JSON.stringify({ ...c(world), queue: [], rest: null, seen: [], seenMs: {} })).toBe(
      spine,
    );
    expect(snapshot(world)).toEqual(nubs);
  });
});

describe('line counters start at the line (R0595)', () => {
  it('departures before Logged In never change its ending', () => {
    const { world, events } = hazelAt(5);
    for (let i = 0; i < 3; i++)
      c(world).flags['n:departed'] = Number(c(world).flags['n:departed'] ?? 0) + 1;
    applyCommand(world, { kind: 'storylineStart', id: 'logged' }, events);
    const line = world.lines.logged!;
    expect(counter(c(world), 'departed')).toBe(3);
    expect(counter(line, 'departed')).toBe(0);
    expect(storylineRule('logged')!.endingFor(world, line)).toBe('everyone-wakes');
  });

  it('a line reads Hazel only through spine:', () => {
    const { world, events } = hazelAt(4);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    c(world).flags.mossPetted = true;
    const line = world.lines.hundred!;
    expect(line.flags.mossPetted).toBeUndefined();
  });
});

describe('save v13', () => {
  it('a v12 save from main loads unchanged, with an empty story book', () => {
    const { world } = hazelAt(4);
    const json = JSON.parse(serialize(world, 1)) as { version: number; world: World };
    json.version = 12;
    delete (json.world as Partial<World>).lines;
    const back = deserialize(JSON.stringify(json));
    const same = deserialize(serialize(world, 1));
    expect(SAVE_VERSION).toBe(13);
    expect(back.version).toBe(13);
    expect(back.world.lines).toEqual({});
    // Identical apart from the new field (which the migration adds at the end of the world).
    const bare = (w: World): string => {
      const rest: Partial<World> = { ...w };
      delete rest.lines;
      return worldFingerprint(rest as World);
    };
    expect(bare(back.world)).toBe(bare(same.world));
    expect(back.world.campaign).toEqual(world.campaign);
  });

  it('running lines and their queued scenes survive a save', () => {
    const { world, events } = hazelAt(4);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    enter(world, events, 'fold');
    play(world, events, 3);
    tick(world, events, 30);
    const back = deserialize(serialize(world, 1)).world;
    expect(back.lines.hundred).toEqual(world.lines.hundred);
    expect(back.campaign!.queue).toEqual(world.campaign!.queue);
    // A queue that lost a line's scene gets it back.
    const json = JSON.parse(serialize(world, 1)) as { world: World };
    json.world.lines.hundred!.queue = ['h-c1-open'];
    json.world.lines.hundred!.seen = [];
    json.world.campaign!.queue = [];
    expect(deserialize(JSON.stringify(json)).world.campaign!.queue).toContain('h-c1-open');
  });
});
