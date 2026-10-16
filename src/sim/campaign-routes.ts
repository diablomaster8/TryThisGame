import { collectorRoute, mossInWorld, sableBonded, sableOf, seen, wispSaved } from './story-state';
import type { CampaignState, World } from './types';

/**
 * Where the campaign goes after each scene, read from CAMPAIGN_NOTES: the mid-chapter
 * scenes, the flag variants, the Long Night sequence and the ending's epilogue order.
 * Pure reads of the flags; the chapter machine in campaign.ts queues what these return.
 */

/** The scene that opens chapter `n`, after any variant swap; `before` plays first. */
export function openingFor(
  c: CampaignState,
  n: number,
  opening: string,
): { before: string[]; opening: string } {
  if (n === 6 && c.flags.s5Done) return { before: [], opening: 'c6-open-walked' };
  if (n === 9 && collectorRoute(c)) return { before: ['c9-partner'], opening: 'c9-open-sold' };
  return { before: [], opening };
}

/** The Moss scene after c10-dawn on the unmade routes. */
function mossAtDawn(c: CampaignState): string {
  if (c.flags.mossReturned) return 'c10-moss-stays';
  if (c.flags.stoneUnmadeBy === 'wisp')
    return c.flags.mossFaded ? 'c10-moss-fades' : 'c10-moss-stays';
  return 'c10-moss-mourned';
}

/** Scenes to queue, in order, once `scene` has been seen. */
export function followUps(world: World, c: CampaignState, scene: string): string[] {
  const f = c.flags;
  const bonded = sableBonded(world, c);
  switch (scene) {
    // ------------------------------------------------ book one
    case 'c4-close':
      return ['c4-tale'];
    case 'c4-tale':
      return ['c4-tale-2'];
    case 'c4-tale-2':
      return ['c4-tale-3'];
    case 'c4-tale-3':
      return ['c4-out'];
    // ------------------------------------------------ book two
    case 'c5-open':
      // The Races hook is awkward from the sim, so the note's fallback: straight after.
      return ['c5-circuit'];
    case 'c5-circuit':
      return f.corvinOffer === 'considered' ? ['c5-considered'] : [];
    case 'c5-close':
      return collectorRoute(c) ? ['c5-sold'] : [];
    case 'c7-open':
      return ['c7-stillness'];
    case 'c7-stillness':
      return ['c7-stillness-2'];
    case 'c7-stillness-2':
      return ['c7-stillness-3'];
    case 'c8-open':
      return [f.s4Done ? 'c8-ledge-s4' : 'c8-ledge'];
    case 'c8-close':
      return ['c8-nova'];
    // ------------------------------------------------ chapter 9
    case 'c9-open':
    case 'c9-open-sold': {
      const shard =
        f.corvin === 'reconciled'
          ? 'c9-shard-reconciled'
          : f.corvin === 'bargained'
            ? 'c9-shard-bargained'
            : collectorRoute(c)
              ? 'c9-shard-collector'
              : 'c9-shard-forced';
      return [shard];
    }
    case 'c9-shard-reconciled':
    case 'c9-shard-bargained':
    case 'c9-shard-forced':
    case 'c9-shard-collector':
      return sableOf(world, c) ? ['c9-sable'] : [];
    // ------------------------------------------------ chapter 10: the Long Night
    case 'c10-open':
      return bonded ? ['c10-sable-watch'] : [];
    case 'c10-vigil':
      return [
        ...(wispSaved(c) ? ['c10-vigil-wisp'] : []),
        ...(f.visitors ? ['c10-vigil-corvin'] : []),
      ];
    case 'c10-falls':
      return [bonded ? 'c10-bearer-sable' : 'c10-bearer-moss'];
    case 'c10-bearer-sable':
    case 'c10-bearer-moss':
      return ['c10-ledge'];
    case 'c10-ledge':
      return ['c10-edge'];
    case 'c10-edge':
      if (f.keptStone) return ['c10-kept'];
      return [f.stoneBearer === 'sable' ? 'c10-safe-sable' : 'c10-safe-moss'];
    case 'c10-kept':
      return [...(f.visitors ? ['c10-kept-lane'] : []), 'c10-close'];
    case 'c10-safe-sable':
    case 'c10-safe-moss':
      if (wispSaved(c)) return ['c10-wisp'];
      return [scene === 'c10-safe-sable' ? 'c10-moss-walks' : 'c10-moss-walks-bearer'];
    case 'c10-wisp':
      return ['c10-bank-wisp'];
    case 'c10-moss-walks':
    case 'c10-moss-walks-bearer':
      return [f.mossFaded ? 'c10-bank-moss-gone' : 'c10-bank-moss-returned'];
    case 'c10-bank-wisp':
    case 'c10-bank-moss-returned':
    case 'c10-bank-moss-gone':
      return ['c10-dawn'];
    case 'c10-dawn':
      return [...(f.visitors ? ['c10-dawn-lane'] : []), mossAtDawn(c)];
    case 'c10-dawn-lane':
      return [];
    case 'c10-moss-stays':
      return ['c10-close'];
    case 'c10-moss-fades':
    case 'c10-moss-mourned':
      return [...(bonded ? ['c10-moss-light'] : []), 'c10-close'];
    case 'c10-close':
      return f.s8Reunited ? ['c10-bramble'] : [];
    // ------------------------------------------------ chapter 11
    case 'c11-open': {
      const out: string[] = [];
      if (f.keptStone) out.push('c11-moss-kept');
      else if (seen(c, 'c10-moss-fades')) out.push('c11-moss-passed');
      else if (seen(c, 'c10-bank-moss-gone')) out.push('c11-moss-gone');
      else if (mossInWorld(c)) out.push('c11-moss-here');
      if (bonded) out.push('c11-sable');
      if (f.keptStone) out.push('c11-cold-hands');
      return out;
    }
    case 'c11-close':
      return seen(c, 's9-ask') && !f.keptStone ? ['c11-gate'] : [];
    // ------------------------------------------------ chapter 12
    case 'c12-open':
      if (f.hazel === 'told') return ['c12-foot-told'];
      if (f.hazel === 'secret') return ['c12-foot-secret'];
      return [];
    default:
      return [];
  }
}

/** Chapter 12's walk up the hill: S10's choice, or alone without it. */
export function walkScene(c: CampaignState): string {
  const w = c.flags.walk;
  return typeof w === 'string' && ['you', 'moss', 'sable', 'corvin'].includes(w)
    ? `c12-walk-${w}`
    : 'c12-walk-alone';
}

/**
 * The whole ending, in the notes' order: end-<id> → body variant → epilogues (wisp, gate,
 * visitors, mill, walk, cinder, told or secret, garden) → end-<id>-last.
 */
export function endingScenes(world: World, c: CampaignState, ending: string): string[] {
  const f = c.flags;
  const out: string[] = [];
  if (ending === 'hazels-grove')
    out.push(f.letThemGo ? 'end-hazels-grove-open' : 'end-hazels-grove');
  else out.push(`end-${ending}`);
  if (ending === 'collector') out.push(f.keptStone ? 'end-collector-kept' : 'end-collector-sold');
  if (ending === 'eternal-dawn')
    out.push(
      world.nubbins.some((n) => n.id === c.mossId)
        ? 'end-eternal-dawn-moss'
        : 'end-eternal-dawn-nomoss',
    );
  if (ending === 'moss-sleeps' && f.hushGarden) out.push('end-moss-sleeps-garden');
  // Wisp.
  if (wispSaved(c)) out.push(f.keptStone ? 'end-epi-wisp-kept' : `end-epi-wisp-${String(f.wisp)}`);
  else out.push(f.wisp === 'driven' ? 'end-epi-wisp-driven' : 'end-epi-wisp-none');
  // Corvin's gate.
  const gate = f.corvinGate;
  out.push(
    gate === 'family' || gate === 'guest' || gate === 'shut'
      ? `end-epi-gate-${gate}`
      : 'end-epi-gate-none',
  );
  // S23's visitors: exactly one.
  if (f.visitors)
    out.push(
      f.keptStone
        ? 'end-epi-visitors-kept'
        : f.cinder
          ? 'end-epi-visitors-cinder'
          : 'end-epi-visitors',
    );
  // S13's mill letter.
  if (f.millLetter === 'kept')
    out.push(seen(c, 's13-letter-given') ? 'end-epi-mill-kept' : 'end-epi-mill-kept-ungiven');
  else if (f.millLetter === 'burned' || f.millLetter === 'grave')
    out.push(`end-epi-mill-${f.millLetter}`);
  // Hazel's walk.
  const walk = f.walk;
  if (walk === 'moss') out.push(f.keptStone ? 'end-epi-walk-moss-stayed' : 'end-epi-walk-moss');
  else if (walk === 'you' || walk === 'sable' || walk === 'corvin')
    out.push(`end-epi-walk-${walk}`);
  else out.push('end-epi-walk-alone');
  // S19's Cinder.
  if (f.cinder === 'forgiven' || f.cinder === 'remembered') out.push(`end-epi-cinder-${f.cinder}`);
  // S10: did the valley know.
  if (f.hazel === 'told') out.push('end-epi-told');
  else if (f.hazel === 'secret') out.push('end-epi-secret');
  // S26's garden.
  if (f.hushGarden) out.push(ending === 'collector' ? 'end-epi-garden-cold' : 'end-epi-garden');
  out.push(`end-${ending}-last`);
  return out;
}
