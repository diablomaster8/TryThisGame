/**
 * Lane A round 10 (SOUL): the sounds of a lesson performed (R0525) and of two friends
 * chatting, turn about in their own voices with the pitch going up and down (R0540). Both
 * events come only from live play (the sim holds them back while catching up), and fast
 * time stays quiet so a ×100 Grove is not a wall of chirps.
 */
import { playChirp, playPerform } from '../platform/audio';
import { chirpVoice } from '../platform/chirp-voice';
import { instrumentOf } from '../sim/kindergarten';
import { speciesOf } from '../sim/species';
import type { SimEvent, World } from '../sim/types';

export function playSoulSounds(events: readonly SimEvent[], world: World, timeScale: number): void {
  if (timeScale > 10) return;
  for (const e of events) {
    if (e.kind === 'performStart') {
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (!n) continue;
      const voice = chirpVoice(n.id, n.personality);
      playPerform(e.lesson, e.level, instrumentOf(n), voice.pitch);
    } else if (e.kind === 'chatTurn') {
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (!n) continue;
      const voice = chirpVoice(n.id, n.personality);
      // Turn about: the first voice a little high, the answer a little low.
      const lift = e.turn % 2 === 0 ? 1.12 : 0.9;
      playChirp(speciesOf(n.species).family, e.topic !== 'puff', {
        ...voice,
        pitch: voice.pitch * lift,
        gain: voice.gain * 0.7,
      });
    }
  }
}
