import { SCANS, STORY } from '../config/tuning';
import { audienceAllowed } from './audience';
import { bestFriend } from './friendships';
import { basePersonality } from './personality';
import { areRivals } from './rivals';
import { hasTrait, type TraitId } from './traits';
import { levelOf } from './stats';
import type { CampaignState, Nubbin, StatKey, World } from './types';

/**
 * The storyline goal grammar (content/types.ts `StorylineChapter.goal`): terms joined by
 * `|` (any) and `&` (all), each `key[:arg…][:cmp]` where cmp is `>=N`, `<=N`, `>N`, `<N`,
 * `=N` or a bare N (meaning at least N). Counters the runner folds from events live in
 * the flags as `n:<kind>`; the journal's Do-it button sets `act:<label>`.
 */
function cmp(value: number, spec: string | undefined): boolean {
  if (spec === undefined) return value > 0;
  const m = /^(>=|<=|>|<|=)?(-?\d+(?:\.\d+)?)$/.exec(spec);
  if (!m) return false;
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

/** The counter the runner keeps for an event kind. */
export function counter(c: CampaignState, kind: string): number {
  return Number(c.flags[`n:${kind}`] ?? 0) - Number(c.flags[`base:${kind}`] ?? 0);
}

/** The storyline's partner: the flagged one, else the first partner slot. */
export function storyPartner(world: World, c: CampaignState): Nubbin | undefined {
  const id = typeof c.flags.partnerId === 'string' ? c.flags.partnerId : world.partners[0];
  return id ? world.nubbins.find((n) => n.id === id) : undefined;
}

/**
 * R0584 (lane A r11): story content may read how a Nubbin was raised, never write it.
 * `personality:<id>` matches the exact personality or its base one (so `shy` also matches a
 * gentle-leaning shy), `trait:<id>`, `bestFriend:any` (it has a best friend) and `rival:any`
 * (it has a rival). Read-only: nothing here changes the world.
 */
function nubbinTerm(world: World, n: Nubbin, t: string[], key: string): boolean {
  const arg = t[1] ?? 'any';
  switch (key) {
    case 'personality':
      return n.personality
        ? arg === 'any' || n.personality === arg || basePersonality(n.personality) === arg
        : false;
    case 'trait':
      return arg === 'any' ? true : hasTrait(n, arg as TraitId);
    case 'bestFriend':
      return bestFriend(world, n) !== null;
    case 'rival':
      return world.nubbins.some((o) => o !== n && o.stage !== 'egg' && areRivals(n, o));
    default:
      return false;
  }
}

function partnerTerm(world: World, c: CampaignState, t: string[]): boolean {
  const p = storyPartner(world, c);
  if (!p) return false;
  switch (t[1]) {
    case 'adult':
      return p.stage === 'adult';
    case 'stage':
      return p.stage === t[2];
    case 'band':
      return p.form?.band === t[2];
    case 'type':
      return p.form?.type === t[2];
    case 'trust':
      return cmp(p.trust, t[2]);
    case 'affection':
      return cmp(p.needs.affection, t[2]);
    case 'happiness':
      return cmp(p.needs.happiness, t[2]);
    case 'slips':
      return cmp(p.slipCount, t[2]);
    case 'wellRaised':
      return p.wellRaised;
    case 'personality':
    case 'trait':
    case 'bestFriend':
    case 'rival':
      return nubbinTerm(world, p, t.slice(1), t[1] ?? '');
    case 'moody':
      return p.moody !== null;
    case 'level': {
      const block = p.stats[t[2] as StatKey];
      return block !== undefined && cmp(levelOf(block.points), t[3]);
    }
    case 'rebirths':
      return cmp(p.rebirths, t[2]);
    default:
      return false;
  }
}

function term(world: World, c: CampaignState, text: string): boolean {
  const t = text.trim().split(':');
  switch (t[0]) {
    case 'any':
      return true;
    case 'flag':
    case 'choice':
      return t.length > 2 ? String(c.flags[t[1]!]) === t[2] : Boolean(c.flags[t[1]!]);
    case 'act':
      return c.flags[`act:${t[1]}`] === true;
    case 'spine': {
      // R0595: Hazel's Grove's flags, read-only and by name, from a line beside it.
      const f = world.campaign?.flags ?? {};
      return t.length > 2 ? String(f[t[1]!]) === t[2] : Boolean(f[t[1]!]);
    }
    case 'seen':
      return c.seen.includes(t[1]!);
    case 'count':
      return cmp(counter(c, t[1]!), t[2]);
    case 'stat':
      return cmp(c.stats[t[1] as keyof typeof c.stats] ?? 0, t[2]);
    case 'prosperity':
      return cmp(world.town.prosperity, t[1]);
    case 'recruits':
      return cmp(world.town.recruits.length, t[1]);
    case 'shells':
      return cmp(world.inventory.shells, t[1]);
    case 'nubbins':
      return cmp(world.nubbins.length, t[1]);
    case 'adults':
      return cmp(world.nubbins.filter((n) => n.stage === 'adult').length, t[1]);
    case 'eggs':
      return cmp(world.nubbins.filter((n) => n.stage === 'egg').length, t[1]);
    case 'partner':
      return partnerTerm(world, c, t);
    case 'personality':
    case 'trait':
    case 'bestFriend':
    case 'rival': {
      const p = storyPartner(world, c);
      return p ? nubbinTerm(world, p, t, t[0]!) : false;
    }
    case 'days':
      return cmp(Math.floor((world.timeMs - c.chapterStartMs) / STORY.dayMs), t[1]);
    case 'area':
      return c.flags.area === t[1];
    case 'areas':
      return cmp(Object.keys(c.flags).filter((k) => k.startsWith('n:area:')).length, t[1]);
    case 'karate':
      if (t[1] === 'belt') return cmp(world.karate.belt, t[2]);
      if (t[1] === 'won') return cmp(counter(c, 'karateWon'), t[2]);
      return cmp(world.karate.wins, t[2]);
    case 'scan':
      return (world.scans[t[2] ?? ''] ?? 0) >= SCANS.full;
    case 'scans':
      return cmp(Object.values(world.scans).filter((v) => v >= SCANS.full).length, t[2] ?? t[1]);
    case 'tank':
      return cmp(t[1] === 'best' ? world.tank.best : world.tank.runs, t[2]);
    case 'hollow':
      return cmp(t[1] === 'best' ? world.hollow.best : world.hollow.runs, t[2]);
    case 'team':
      if (!world.team) return false;
      if (t[1] === 'joined') return true;
      return cmp(t[1] === 'rank' ? world.team.rank : world.team.points, t[2]);
    case 'twine':
      return cmp(world.inventory.twine, t[1]);
    case 'partners':
      return world.partners[0] !== null && world.partners[1] !== null;
    case 'merged':
      return world.merge !== null || counter(c, 'merged') > 0;
    case 'fused':
      return cmp(counter(c, 'fused'), t[1]);
    case 'grove':
      return world.grove === t[1];
    case 'location':
      return world.location === t[1];
    case 'mature':
      return audienceAllowed(t[1] === 'adult' ? 'adult' : 'teen', {
        matureContent: world.settings.matureContent,
        learningGrove: world.edu !== null,
      });
    default:
      return false;
  }
}

/** Is the check met now. Unknown keys read as not met, so a typo never skips a chapter. */
export function checkMet(world: World, c: CampaignState, check: string): boolean {
  return check.split('|').some((any) => any.split('&').every((all) => term(world, c, all)));
}

/** The `act:` label a check waits on, if it has one (for the journal's button). */
export function actLabel(check: string): string | null {
  for (const t of check.split(/[|&]/)) {
    const parts = t.trim().split(':');
    if (parts[0] === 'act' && parts[1]) return parts[1];
  }
  return null;
}
