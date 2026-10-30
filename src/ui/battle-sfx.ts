import type { SongName, SoundName } from '../platform/audio';
import { moveOf } from '../sim/battle/moves';
import type { BattleEvent, BattleState } from '../sim/battle/types';
import type { World } from '../sim/types';

/**
 * Battle sound (recs FIGHT-76): which sound effect each battle event plays, and which piece of
 * the score a bout plays under. Pure: the screen plays what this returns through
 * `platform/audio.ts`, which stays silent until the first tap, so a bout never makes a sound
 * before the Keeper has touched the game.
 *
 * Hits sound by the move's type: Swim splashes, Fly swishes, Run patters, and Power or Normal
 * knock a wood block. A Dizzy self-bonk boings and a tuckered-out Nubbin yawns.
 */
export function battleSfx(e: BattleEvent): SoundName | null {
  switch (e.k) {
    case 'hit': {
      const type = e.move ? moveOf(e.move).type : 'normal';
      if (type === 'swim') return 'splash';
      if (type === 'fly') return 'swish';
      if (type === 'run') return 'patter';
      return 'woodblock';
    }
    case 'boing':
      return 'boing';
    case 'tuckered':
      return 'yawn';
    default:
      return null;
  }
}

/** The piece a bout plays under: the Circuit's fanfare, a lullaby for calm bouts, else the battle. */
export function battleSong(s: BattleState | null | undefined): SongName {
  if (!s) return 'battle';
  const c = s.context;
  if (c.kind === 'circuit') return 'circuit';
  if (s.gentle || s.sides[1].some((f) => f.shadow || f.calm !== undefined)) return 'calm';
  return 'battle';
}

/** The song for whatever bout is live in `world`: a turn bout, else a tactics board. */
export function liveBattleSong(world: World | undefined): SongName {
  if (world?.battle && !world.battle.result) return battleSong(world.battle);
  if (world?.tactics?.objective.kind === 'calmBoss') return 'calm';
  return 'battle';
}
