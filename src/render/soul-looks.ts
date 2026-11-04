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
import type { Nubbin, Personality } from '../sim/types';
import { GAIT, SHADOW_SOUL } from '../config/tuning-soul-r11';
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
  | 'smugRun'
  | 'tug'
  | 'callFruit'
  | 'rubEyes'
  // R0558 (lane A r11): eating, napping, swimming and crying by personality.
  | 'gulp'
  | 'nibble'
  | 'chomp'
  | 'curlUp'
  | 'sprawl'
  | 'splashSpin'
  | 'wadeEdge'
  | 'diveUp'
  | 'floatBack'
  | 'sniffle'
  | 'cryStomp'
  | 'cryWalk'
  // R0570 (lane A r11): the wander gaits.
  | 'skip'
  | 'smallSteps'
  | 'tiptoe'
  | 'shuffle'
  | 'march'
  | 'meander'
  // R0566 (lane A r11): a wary Shadow's sulk and watch, and the bond's walk-up hug.
  | 'sulk'
  | 'watchFar'
  | 'bondHug';

/** Which look a Nubbin's state and act show, or null. */
export function soulLookKind(n: Nubbin): SoulLookKind | null {
  const b = n.behavior;
  if (b.state === 'shelter') return b.target ? null : 'huddle';
  const id = b.itemId;
  // R0566 (lane A r11).
  if (b.state === 'sit' && id === 'sulk') return 'sulk';
  if (b.state === 'perform' && id === 'watchFar' && !b.target) return 'watchFar';
  if (b.state === 'perform' && id === 'bondHug' && !b.target) return 'bondHug';
  const flavour = stateFlavourLook(n);
  if (flavour) return flavour;
  // Lane A r9.
  if (b.state === 'sit' && id === 'groomSelf') return 'groomSelf';
  if (b.state === 'wander' && (id === 'hum' || id === 'inspect')) return id;
  if (b.state === 'perform' && id === 'giggle') return 'giggleFit';
  if (b.state === 'perform' && id === 'burp') return 'burp';
  if (b.state === 'perform' && id === 'peekTree' && !b.target) return 'peek';
  // R0545, R0542: a fruit held up over its head (snatched, shared or off to the stash).
  if (
    b.state === 'perform' &&
    (id?.startsWith('snatchRun:') || id?.startsWith('shareRun:') || id?.startsWith('hoardRun:'))
  )
    return 'smugRun';
  // Lane A r10: a flinch is a quick crouch (R0541); the cheerful twirl spins (R0553); a
  // lazy doze lies back (R0553).
  if (b.state === 'perform' && id === 'flinch' && !b.target) return 'huddle';
  if (b.state === 'perform' && id === 'twirl') return 'chaseTail';
  if (b.state === 'sit' && id === 'doze') return 'stargaze';
  // R0529 (lane A r11): the second four's quirks borrow the bodies above: a poke or a peer
  // leans in, a pat or a tended tree reaches up, a fruit offered is held high, a splash
  // stomps, a flex stretches tall, cloud gazing and daydreams lie back, a butterfly chase
  // sparkles.
  if ((b.state === 'perform' && id === 'poke') || (b.state === 'sit' && id === 'peer'))
    return 'inspect';
  if (b.state === 'perform' && (id?.startsWith('comfort:') || id === 'tend') && !b.target)
    return 'tug';
  if (b.state === 'perform' && id === 'offerFruit') return 'smugRun';
  if (b.state === 'perform' && id === 'splash' && !b.target) return 'stomp';
  if (b.state === 'perform' && id === 'flex') return 'stretch';
  if (b.state === 'sit' && (id === 'cloudGaze' || id === 'daydream')) return 'stargaze';
  if (b.state === 'wander' && id === 'butterfly') return 'fireflies';
  // R0558 (lane A r10): a lazy one lies back to eat.
  if (b.state === 'eat' && id === 'lieEat') return 'stargaze';
  // R0560: asking to be picked up too, arms up beside the Keeper (R0541: asking for more).
  if (b.state === 'perform' && id === 'askUp' && !b.target) return 'tug';
  if (b.state === 'sit' && (id === 'tug' || id === 'callFruit' || id === 'rubEyes')) return id;
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
  // R0570 (lane A r11): a plain wander walks its personality's gait.
  if (b.state === 'wander' && !id && b.target) return GAIT_LOOK[n.personality ?? 'curious'];
  return null;
}

/**
 * R0558 (lane A r11): the clip variants for eating, napping, swimming and crying, from the
 * act's name (sim/state-flavour.ts, sim/cry-soul.ts) or, where the sim needs none, the
 * personality: a shy one curls up to nap and wades at the edge, a lazy one sprawls and
 * floats on its back, a mischievous one dives and pops up, the cheerful and the bold splash
 * and spin.
 */
/** R0570: the gait each personality walks (curious and gentle stroll plainly). */
const GAIT_LOOK: Record<Personality, SoulLookKind | null> = {
  cheerful: 'skip',
  shy: 'smallSteps',
  mischievous: 'tiptoe',
  lazy: 'shuffle',
  curious: null,
  gentle: null,
  bold: 'march',
  dreamy: 'meander',
};

function stateFlavourLook(n: Nubbin): SoulLookKind | null {
  const b = n.behavior;
  const id = b.itemId;
  switch (b.state) {
    case 'eat':
      return id === 'gulp' || id === 'nibble' || id === 'chomp' ? id : null;
    case 'nap':
      if (id === 'nodOff') return null;
      return n.personality === 'shy' ? 'curlUp' : n.personality === 'lazy' ? 'sprawl' : null;
    case 'swim':
      // R0582 (lane A r11): splashing a friend in the water.
      if (id?.startsWith('splashFriend:')) return 'splashSpin';
      switch (n.personality) {
        case 'shy':
          return 'wadeEdge';
        case 'lazy':
          return 'floatBack';
        case 'mischievous':
          return 'diveUp';
        case 'cheerful':
        case 'bold':
          return 'splashSpin';
        default:
          return null;
      }
    case 'cry':
      if (id === 'sniffle' || id === 'cryStomp') return id;
      return id === 'cryToKeeper' && b.target ? 'cryWalk' : null;
    default:
      return null;
  }
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
  // R0558 (lane A r11).
  chomp: 900,
  splashSpin: 700,
  diveUp: 1800,
  cryStomp: 600,
  bondHug: 1200,
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
    case 'tug':
      // R0559: sat at the Keeper's feet, one hand up and tugging.
      out.clip = 'happy';
      out.frame = 0;
      out.pose3d = 'happy';
      out.sh = 1.04 + 0.04 * Math.max(0, wave(1.6)) * m;
      break;
    case 'callFruit':
      // Looking up into the tree, hopefully, with a little bounce.
      out.clip = 'surprised';
      out.frame = 0;
      out.pose3d = 'surprised';
      out.dy = 0.03 * Math.max(0, wave(1.2)) * m;
      break;
    case 'rubEyes':
      // Sat, rubbing its eyes: a slow side-to-side droop.
      out.clip = 'sit';
      out.frame = 0;
      out.pose3d = 'sit';
      out.sh = 0.95;
      out.dx = 0.02 * wave(1.4) * m;
      break;
    case 'chaseTail':
      // Round and round after its own tail: a small circle, happy.
      out.clip = 'walk';
      out.pose3d = 'walk';
      out.dx = 0.06 * Math.sin((ms / 1000) * Math.PI * 2 * 1.2) * m;
      out.dy = 0.02 * Math.abs(Math.cos((ms / 1000) * Math.PI * 2 * 1.2)) * m;
      break;
    // R0558 (lane A r11): the state flavours.
    case 'gulp':
      // Down in one: quick, deep bobs, puffed out wide.
      out.clip = 'eat';
      out.pose3d = 'eat';
      out.frame = Math.floor(ms / 90) % 2;
      out.sw = 1.06;
      out.sh = 1 - 0.06 * Math.abs(wave(4)) * m;
      break;
    case 'nibble':
      // Small, careful nibbles, drawn in on itself.
      out.clip = 'eat';
      out.pose3d = 'eat';
      out.frame = Math.floor(ms / 420) % 2;
      out.sw = 0.92;
      out.sh = 0.93;
      break;
    case 'chomp':
      // Happy chomps, bouncing on the spot between bites.
      out.clip = 'eat';
      out.pose3d = 'eat';
      out.dy = 0.05 * Math.abs(wave(1.6)) * m;
      out.sh = 1.03;
      break;
    case 'curlUp':
      // Curled up small and round, asleep.
      out.clip = 'sleep';
      out.pose3d = 'sleep';
      out.sw = 0.84;
      out.sh = 0.8;
      out.dy = -0.02;
      break;
    case 'sprawl':
      // Sprawled on its back, wide and flat, wherever it dropped.
      out.clip = 'sleep';
      out.pose3d = 'sleep';
      out.sw = 1.22;
      out.sh = 0.76;
      out.dy = -0.03;
      break;
    case 'splashSpin':
      // Splashing and spinning: the body turns side-on and back (narrow, wide) as it goes.
      out.sw = 1 - 0.25 * Math.abs(Math.sin((ms / 1000) * Math.PI * 1.4)) * m;
      out.dy = 0.03 * Math.abs(wave(1.4)) * m;
      break;
    case 'wadeEdge':
      // Only up to its tummy at the edge, a slow cautious bob.
      out.sh = 0.96;
      out.dy = 0.015 * wave(0.5) * m;
      break;
    case 'diveUp': {
      // Under for a moment (squashed low in the water), then pops up.
      const c = (ms % 1800) / 1800;
      const under = c > 0.45 && c < 0.75 ? 1 : 0;
      out.sh = 1 - 0.55 * under * (calm ? 0 : 1);
      out.dy = (under ? -0.2 : 0.04 * Math.max(0, Math.sin(c * Math.PI * 4))) * m;
      break;
    }
    case 'floatBack':
      // Floating on its back, drifting: the lie-back body on the water.
      out.clip = 'sit';
      out.frame = 0;
      out.pose3d = 'sit';
      out.sw = 1.14;
      out.sh = 0.8;
      out.dy = -0.04 + 0.01 * wave(0.4) * m;
      break;
    case 'sniffle':
      // Quiet sniffles: the sad frame, hunched, a small catch of the shoulders.
      out.clip = 'sad';
      out.frame = 0;
      out.pose3d = 'sad';
      out.sw = 0.95;
      out.sh = 0.94 + 0.02 * Math.max(0, wave(1.1)) * m;
      break;
    case 'cryStomp':
      // A short loud cry, then a cross little stomp.
      if (t < 0.6) {
        out.clip = 'cry';
        out.pose3d = 'sad';
      } else {
        out.clip = 'surprised';
        out.frame = 0;
        out.pose3d = 'surprised';
        out.dy = 0.08 * Math.abs(Math.sin((ms / 300) * Math.PI)) * m;
      }
      break;
    case 'cryWalk':
      // On its way to the Keeper, sniffling: a slow, drooping walk.
      out.clip = 'walk';
      out.pose3d = 'walk';
      out.sh = 0.95;
      break;
    // R0566 (lane A r11).
    case 'sulk':
      // Sat with its back to the Grove, facing a tree, hunched small.
      out.clip = 'sad';
      out.frame = 0;
      out.pose3d = 'sit';
      out.sw = 0.94;
      out.sh = 0.92;
      break;
    case 'watchFar':
      // Sat a way off, watching the Keeper, very still.
      out.clip = 'sit';
      out.frame = 0;
      out.pose3d = 'sit';
      out.sh = 0.97;
      break;
    case 'bondHug':
      // Up to the Keeper: a hesitation (small, unsure), then the hug.
      if (t < SHADOW_SOUL.bondHesitate) {
        out.clip = 'surprised';
        out.frame = 0;
        out.pose3d = 'surprised';
        out.sw = 0.94;
        out.sh = 0.94;
      } else {
        out.clip = 'love';
        out.pose3d = 'love';
        out.sh = 1 + 0.03 * Math.max(0, wave(1.5)) * m;
      }
      break;
    // R0570 (lane A r11): the gaits, laid over the walk clip (null keeps it).
    case 'skip': {
      // A skip: a big bounce every other step.
      const hop = Math.abs(Math.sin((ms / 1000) * Math.PI * 2.4));
      out.dy = GAIT.stepBob * GAIT.cheerful.bob * 2 * hop * m;
      out.sh = 1 + 0.03 * hop * m;
      break;
    }
    case 'smallSteps':
      // Small careful steps, a little hunched.
      out.sh = 0.97;
      out.dy = GAIT.stepBob * GAIT.shy.bob * Math.abs(wave(2.2)) * m;
      break;
    case 'tiptoe':
      // Up on its toes: tall and thin, hardly any bounce.
      out.sh = 1.05;
      out.sw = 0.96;
      out.dy = 0.02 + GAIT.stepBob * GAIT.mischievous.bob * Math.abs(wave(2.8)) * m;
      break;
    case 'shuffle':
      // A shuffle: low and wide, feet barely leaving the grass.
      out.sh = 0.94;
      out.sw = 1.05;
      out.dy = GAIT.stepBob * GAIT.lazy.bob * Math.abs(wave(1.2)) * m;
      break;
    case 'march':
      // A march: upright, chest out, a firm down-beat on every step.
      out.sh = 1.04;
      out.dy = GAIT.stepBob * GAIT.bold.bob * Math.max(0, wave(1.8)) * m;
      break;
    case 'meander':
      // Meandering: a slow, floaty bob.
      out.dy = GAIT.stepBob * GAIT.dreamy.bob * (1 + wave(0.8)) * m;
      break;
  }
  return out;
}
