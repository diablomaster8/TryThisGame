/**
 * Lane A round 8 (SOUL): the bodies for the new idle acts, shared by both renderers through
 * `PetBeats` (render/pet-reactions.ts), so a look is written once. The sim marks each act
 * with its state and `behavior.itemId`; this file says how it looks: a harrumph sits with
 * its back turned and puffs (R0532), a yawn stretches tall then sags, a sleepy one nods off
 * standing, a dawn stretch reaches up, a stargazer lies back (R0535), a sheltering one
 * huddles with its eyes open and shivers instead of sleeping, and in the rain the bold
 * stomp puddles and the cheeky catch drops on their tongues (R0534). Dusk firefly chases are
 * a walk with sparkles round them. Render-only: it reads the Nubbin and never writes it.
 */
import type { Nubbin } from '../sim/types';
import type { PetBeatPose } from './pet-reactions';

export type SoulLookKind =
  | 'harrumph'
  | 'yawn'
  | 'nodOff'
  | 'stretch'
  | 'stargaze'
  | 'huddle'
  | 'stomp'
  | 'raindrop'
  | 'fireflies'
  // R0544: the antics.
  | 'trip'
  | 'sneeze'
  | 'hiccup'
  | 'chaseTail'
  // Lane A r9: trait quirks (R0528), the full belly and its burp (R0546), the peek (R0543).
  | 'groomSelf'
  | 'hum'
  | 'inspect'
  | 'giggleFit'
  | 'burp'
  | 'full'
  | 'peek'
  | 'smugRun';

/** Which look a Nubbin's state and act show, or null. */
export function soulLookKind(n: Nubbin): SoulLookKind | null {
  const b = n.behavior;
  if (b.state === 'shelter') return b.target ? null : 'huddle';
  const id = b.itemId;
  // Lane A r9.
  if (b.state === 'sit' && id === 'groomSelf') return 'groomSelf';
  if (b.state === 'wander' && (id === 'hum' || id === 'inspect')) return id;
  if (b.state === 'perform' && id === 'giggle') return 'giggleFit';
  if (b.state === 'perform' && id === 'burp') return 'burp';
  if (b.state === 'perform' && id === 'peekTree' && !b.target) return 'peek';
  if (b.state === 'perform' && id?.startsWith('snatchRun:')) return 'smugRun';
  if (b.state === 'sit' && (id === 'harrumph' || id === 'yawn' || id === 'stretch')) return id;
  if (b.state === 'sit' && id === 'stargaze') return 'stargaze';
  if (b.state === 'nap' && id === 'nodOff') return 'nodOff';
  if (b.state === 'perform' && (id === 'stomp' || id === 'raindrop') && !b.target) return id;
  if (b.state === 'wander' && id === 'fireflies') return 'fireflies';
  if (
    b.state === 'perform' &&
    (id === 'trip' || id === 'sneeze' || id === 'hiccup' || id === 'chaseTail')
  )
    return id;
  // R0546: the full belly shows on whatever it does next on its feet (a waddle when walking).
  if (
    (n.fullUntilMs ?? 0) > b.sinceMs &&
    (b.state === 'wander' || b.state === 'sit' || b.state === 'greet' || b.state === 'findFood')
  )
    return 'full';
  return null;
}

/** How often each look throws up its particles, in ms (none: never). */
export const SOUL_BURST_MS: Partial<Record<SoulLookKind, number>> = {
  stomp: 650,
  raindrop: 900,
  fireflies: 450,
  harrumph: 1600,
  trip: 1600,
  sneeze: 1200,
  hiccup: 500,
  groomSelf: 700,
  hum: 700,
  giggleFit: 450,
  burp: 5000,
  smugRun: 500,
};

/** The waddle's sway. */
const n0Walk = (ms: number): number => 0.035 * Math.sin((ms / 1000) * Math.PI * 2 * 1.6);

/**
 * The body for a look `ms` into it (render time since the look began) and `t` (0..1) of the
 * act's sim span. `calm` (reduced motion) keeps the frames and drops the shakes and bobs.
 */
export function soulPose(kind: SoulLookKind, ms: number, t: number, calm: boolean): PetBeatPose {
  const out: PetBeatPose = {
    kind,
    clip: null,
    frame: null,
    pose3d: null,
    sw: 1,
    sh: 1,
    dx: 0,
    dy: 0,
    t,
  };
  const m = calm ? 0 : 1;
  const wave = (hz: number) => Math.sin((ms / 1000) * Math.PI * 2 * hz);
  switch (kind) {
    case 'harrumph':
      // Arms crossed, back to the Keeper (the sim turned it), a cross little puff now and then.
      out.clip = 'sit';
      out.frame = 0;
      out.pose3d = 'sit';
      out.sw = 1.04;
      out.sh = 0.97 + 0.02 * Math.max(0, wave(0.6)) * m;
      break;
    case 'yawn': {
      // Up tall with a surprised mouth, then a sag.
      const up = t < 0.5 ? Math.sin((t / 0.5) * Math.PI * 0.5) : 1 - (t - 0.5) / 0.5;
      out.clip = t < 0.6 ? 'surprised' : 'sit';
      out.frame = 0;
      out.pose3d = t < 0.6 ? 'surprised' : 'sit';
      out.sh = 1 + 0.1 * up;
      out.sw = 1 - 0.04 * up;
      break;
    }
    case 'stretch': {
      // The dawn stretch: tall and thin on its toes, held, and let go.
      const up = Math.sin(Math.min(1, t * 1.4) * Math.PI);
      out.clip = 'happy';
      out.frame = 0;
      out.pose3d = 'happy';
      out.sh = 1 + 0.12 * up;
      out.sw = 1 - 0.06 * up;
      out.dy = 0.04 * up;
      break;
    }
    case 'nodOff':
      // Asleep where it stood: the sleep frame, with a slow forward nod.
      out.clip = 'sleep';
      out.pose3d = 'sleep';
      out.dx = 0.03 * Math.max(0, wave(0.25)) * m;
      break;
    case 'stargaze':
      // Lying back, looking up: the sit frame laid low and wide.
      out.clip = 'sit';
      out.frame = 0;
      out.pose3d = 'sit';
      out.sh = 0.84;
      out.sw = 1.12;
      out.dy = -0.03;
      break;
    case 'huddle':
      // Sat hugging itself, eyes open, with a little shiver: never the sleep pose.
      out.clip = 'sit';
      out.frame = 0;
      out.pose3d = 'sit';
      out.sw = 0.94;
      out.sh = 0.95;
      out.dx = 0.015 * Math.sign(wave(9)) * m;
      break;
    case 'stomp': {
      // Two-footed stomps in a puddle.
      const hop = Math.abs(Math.sin((ms / 650) * Math.PI));
      out.clip = 'happy';
      out.pose3d = 'happy';
      out.dy = 0.1 * hop * m;
      out.sh = 1 - 0.06 * (1 - hop) * m;
      out.sw = 1 + 0.05 * (1 - hop) * m;
      break;
    }
    case 'raindrop':
      // Face up, mouth open, rocking to catch the drops.
      out.clip = 'surprised';
      out.frame = 0;
      out.pose3d = 'surprised';
      out.sh = 1.05;
      out.dx = 0.03 * wave(0.8) * m;
      break;
    case 'fireflies':
      // A walk: the renderers keep the walk and only add the sparkles.
      break;
    case 'trip': {
      // Face down for a beat (squashed flat, dizzy), then bounces back up.
      const down = t < 0.45;
      out.clip = down ? 'dizzy' : 'surprised';
      out.frame = 0;
      out.pose3d = down ? 'dizzy' : 'surprised';
      out.sh = down ? 0.72 : 1 + 0.06 * Math.sin(((t - 0.45) / 0.55) * Math.PI) * m;
      out.sw = down ? 1.18 : 1;
      out.dx = down ? 0.05 : 0;
      break;
    }
    case 'sneeze': {
      // A wind-up (tall, eyes shut), then the achoo: a hop backwards.
      const wind = t < 0.4;
      const hop = wind ? 0 : Math.sin(((t - 0.4) / 0.6) * Math.PI);
      out.clip = wind ? 'happy' : 'surprised';
      out.frame = 0;
      out.pose3d = wind ? 'happy' : 'surprised';
      out.sh = wind ? 1 + 0.08 * (t / 0.4) : 1;
      out.dy = 0.08 * hop * m;
      out.dx = -0.08 * hop * m;
      break;
    }
    case 'hiccup': {
      // Three little hops, a surprised face at the top of each.
      const hop = Math.max(0, Math.sin(t * Math.PI * 3));
      out.clip = hop > 0.5 ? 'surprised' : 'idle';
      out.frame = 0;
      out.pose3d = hop > 0.5 ? 'surprised' : 'idle';
      out.dy = hop * 0.1 * m;
      out.sh = 1 + hop * 0.05;
      break;
    }
    case 'groomSelf':
      // Tidying up: a quick side-to-side rub, eyes shut, a sparkle or two.
      out.clip = 'happy';
      out.frame = 0;
      out.pose3d = 'happy';
      out.dx = 0.03 * wave(2.5) * m;
      out.sw = 1 + 0.03 * Math.abs(wave(2.5)) * m;
      break;
    case 'hum':
    case 'inspect':
      // A walk: the renderers keep it; hum adds notes, inspect a little lean forward.
      if (kind === 'inspect') out.sh = 0.97;
      break;
    case 'giggleFit':
      // Rolled over on its back, kicking: laid low and wide, rocking, notes popping up.
      out.clip = 'happy';
      out.pose3d = 'happy';
      out.sh = 0.8;
      out.sw = 1.15;
      out.dy = -0.03;
      out.dx = 0.05 * wave(3) * m;
      break;
    case 'burp':
      // Puffed out, then the burp: a surprised face and a little hop.
      out.clip = t < 0.5 ? 'idle' : 'surprised';
      out.frame = 0;
      out.pose3d = t < 0.5 ? 'idle' : 'surprised';
      out.sw = 1.16 - 0.06 * Math.max(0, t - 0.5) * 2;
      out.dy = t > 0.5 ? 0.05 * Math.sin(((t - 0.5) / 0.5) * Math.PI) * m : 0;
      break;
    case 'full':
      // A round belly, and a side-to-side waddle when it walks.
      out.sw = 1.13;
      out.sh = 0.96;
      out.dx = n0Walk(ms) * m;
      break;
    case 'peek': {
      // R0543: tucked small and still behind the trunk for the first third, then leaning out
      // round it and back, slowly (the lean is the look, so it stays under reduced motion).
      if (t < 0.35) {
        out.clip = 'sit';
        out.frame = 0;
        out.pose3d = 'sit';
        out.sw = 0.9;
        out.sh = 0.88;
        break;
      }
      const lean = Math.max(0, Math.sin((ms / 2600) * Math.PI * 2));
      out.clip = 'idle';
      out.frame = 0;
      out.pose3d = 'idle';
      out.dx = 0.12 * lean;
      out.sh = 0.95;
      break;
    }
    case 'smugRun':
      // R0545: off at a trot with the fruit held up over its head, very pleased.
      out.clip = 'happy';
      out.pose3d = 'happy';
      out.sh = 1.06;
      out.dy = 0.03 * Math.abs(wave(3)) * m;
      break;
    case 'chaseTail':
      // Round and round after its own tail: a small circle, happy.
      out.clip = 'walk';
      out.pose3d = 'walk';
      out.dx = 0.06 * Math.sin((ms / 1000) * Math.PI * 2 * 1.2) * m;
      out.dy = 0.02 * Math.abs(Math.cos((ms / 1000) * Math.PI * 2 * 1.2)) * m;
      break;
  }
  return out;
}
