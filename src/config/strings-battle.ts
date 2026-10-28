import type { BattleEvent, Combatant } from '../sim/battle/types';

/**
 * Every player-facing word of the battle screens, kept apart from `strings.ts` so the combat
 * lane can grow without touching the shared file; `strings.ts` re-exports it. The sim's log
 * holds events; `formatEvent` turns one into a line. Nobody is ever knocked out here: a
 * Nubbin at 0 HP is tuckered out and naps under a leaf blanket, and a rival yawns, waves and
 * toddles home (recs FIGHT-05).
 */
export type BattleLang = 'en' | 'he' | 'ja';

/** Rival names by slot. The dojo uses slots 0–2 (one per tier), party foes the rest. */
export const BATTLE_NAMES: Record<BattleLang, readonly string[]> = {
  en: ['Bramble', 'Tusk', 'Needle', 'Glitch', 'Proxy', 'Null', 'Daemon', 'Cursor', 'Packet'],
  he: ['אטד', 'ניב', 'מחט', 'גליץ׳', 'פרוקסי', 'נאל', 'דימון', 'סמן', 'חבילה'],
  ja: [
    'イバラ',
    'キバ',
    'ハリ',
    'グリッチ',
    'プロキシ',
    'ヌル',
    'デーモン',
    'カーソル',
    'パケット',
  ],
};

/** The first party-foe slot in `BATTLE_NAMES`. */
export const FOE_NAME_BASE = 3;

export function foeName(slot: number, lang: BattleLang = 'en'): string {
  const list = BATTLE_NAMES[lang];
  return list[slot] ?? list[slot % list.length] ?? 'Rival';
}

/** A combatant's shown name: an ally's own, a rival's from its slot. */
export function combatantName(c: Combatant, lang: BattleLang = 'en'): string {
  return c.name ?? foeName(c.foeName, lang);
}

export const BATTLE_TEXT = {
  partyTitle: 'Party bout',
  leave: 'Leave',
  left: 'You left the bout. No result recorded.',
  noParty: 'Nobody in the party has hatched yet.',
  round: (n: number, tier: number) => `Round ${n} · Tier ${tier}`,
  party: 'Your party',
  foes: 'Their side',
  hp: 'HP',
  guarding: 'guarding',
  tuckered: 'tuckered out',
  wentHome: 'went home',
  moves: { strike: 'Strike', guard: 'Guard', rally: 'Rally' } as Record<string, string>,
  who: 'Who? Tap a foe.',
  cancel: 'Back',
  partyWon: 'The party wins! Everyone on their side has toddled home.',
  partyLost: "Everyone's tuckered out. Snack break!",
  draw: 'A long bout. Everyone agrees to call it a draw.',
  done: 'Done',
  prize: (n: number, currency: string) => `+${n} ${currency}`,
  // The dojo.
  karateWon: (name: string) => `${name} wins the bout!`,
  karateLost: (name: string) => `${name} is tuckered out. Snack break, then try again.`,
  karateDraw: (name: string) => `${name} and the rival bow. A draw.`,
  tapMiddle: 'TAP IN THE MIDDLE',
  pow: 'POW!',
  hitWord: 'hit',
  miss: 'MISS',
  zzz: 'Zzz',
  bye: 'bye!',
  /** For screen readers: the bout's state in one line. */
  status: (a: string, ahp: number, b: string, bhp: number) => `${a} ${ahp} · ${b} ${bhp}`,
} as const;

/** One log event as a line, or null for events the log does not show. */
export function formatEvent(e: BattleEvent, name: (id: string) => string): string | null {
  switch (e.k) {
    case 'hit':
      return `${name(e.by)} bonks ${name(e.to)} for ${e.dmg}${e.guarded ? ' (guarded)' : ''}.`;
    case 'miss':
      return `${name(e.to)} slips aside.`;
    case 'guard':
      return `${name(e.by)} guards.`;
    case 'rally':
      return `${name(e.by)} rallies the party.`;
    case 'tuckered':
      return e.side === 0
        ? `${name(e.who)} is tuckered out and naps under a leaf.`
        : `${name(e.who)} yawns, waves and toddles home.`;
    case 'round':
      return null;
    case 'end':
      return null;
  }
}
