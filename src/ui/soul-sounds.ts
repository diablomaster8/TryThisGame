/**
 * Lane A round 10 (SOUL): the sounds of a lesson performed (R0525) and of two friends
 * chatting, turn about in their own voices with the pitch going up and down (R0540). Both
 * events come only from live play (the sim holds them back while catching up), and fast
 * time stays quiet so a ×100 Grove is not a wall of chirps.
 */
import { playChirp, playJamLayer, playMotif, playPerform } from '../platform/audio';
import { chirpVoice } from '../platform/chirp-voice';
import { instrumentOf } from '../sim/kindergarten';
import { shownVariant } from '../sim/lesson-variants';
import { speciesOf } from '../sim/species';
import type { SimEvent, World } from '../sim/types';

const jamLessonIds = new Set(['singing', 'instrument', 'dance']);

export function playSoulSounds(events: readonly SimEvent[], world: World, timeScale: number): void {
  if (timeScale > 10) return;
  for (const e of events) {
    if (e.kind === 'performStart') {
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (!n) continue;
      const voice = chirpVoice(n.id, n.personality);
      const sv = shownVariant(n)?.id;
      // R0589: a plain song is the Nubbin's own motif; a friend near it sings a third above.
      if (e.lesson === 'singing' && !sv) {
        const mate = world.nubbins.some(
          (o) =>
            o !== n &&
            o.behavior.state === 'perform' &&
            o.behavior.itemId === 'singing' &&
            Math.hypot(o.pos.x - n.pos.x, o.pos.z - n.pos.z) < 6,
        );
        playMotif(n.seed, voice.pitch, mate);
      } else playPerform(e.lesson, e.level, instrumentOf(n), voice.pitch, sv);
      // R0555: a joiner layers its own instrument under whoever already plays.
      const playing = world.nubbins.filter(
        (o) =>
          o !== n &&
          o.behavior.state === 'perform' &&
          jamLessonIds.has(o.behavior.itemId ?? '') &&
          Math.hypot(o.pos.x - n.pos.x, o.pos.z - n.pos.z) < 6,
      ).length;
      if (playing > 0) playJamLayer(playing, instrumentOf(n), voice.pitch);
    } else if (e.kind === 'hum') {
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (n) playMotif(n.seed, chirpVoice(n.id, n.personality).pitch, false);
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
