import type { ChaoPose } from './chao';
import type { Anchors, CreatureSpec } from './creature';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';

/**
 * Extra kit parts for the generic creature drawer (creature.ts): the signature features
 * the base kit cannot say (a bulb or a shell on the back, a beak, a bill, a fan of tails,
 * butterfly wings, a mushroom cap, a second pair of arms...). A spec lists them in
 * `extras`; each carries its own colours (default: the spec's accent and accent2) and an
 * optional count. Both renderers read the same list: this file draws them in pixels, and
 * `render3d/art-species-extras.ts` sculpts them. Shared by every species file, so a new
 * kind added here should get a 3D twin there.
 *
 * Back-mounted parts are drawn behind the body from the front angles and over it from
 * the back ones; face and head parts are drawn after the face.
 */
export type ExtraKind =
  // back
  | 'bulb'
  | 'bud'
  | 'bloom'
  | 'backShell'
  | 'cannons'
  | 'backSpikes'
  | 'mushrooms'
  | 'hood'
  | 'foxTails'
  | 'butterflyWings'
  | 'insectWings'
  | 'batWings2'
  | 'fourArms'
  | 'leafArms'
  | 'lances'
  | 'angelWings'
  // face
  | 'trio'
  | 'beak'
  | 'longBeak'
  | 'bill'
  | 'nose'
  | 'snout'
  | 'buckTeeth'
  | 'fangs'
  | 'gape'
  | 'whiskers'
  | 'moustache'
  | 'coin'
  | 'drool'
  // head
  | 'cap'
  | 'bucketHat'
  | 'leafTuft'
  | 'bigFlower'
  | 'flowers'
  | 'plume'
  | 'hairs'
  | 'antennae'
  | 'crown'
  | 'mane'
  // body
  | 'swirl'
  | 'gems'
  | 'heart'
  | 'belt'
  | 'pads'
  | 'plates'
  | 'rocks'
  | 'skirt'
  | 'spoons'
  | 'stem'
  | 'tubes';

export interface Extra {
  kind: ExtraKind;
  /** Main colour (palette index); the spec's accent when absent. */
  c?: number;
  /** Second colour; the spec's accent2 when absent. */
  c2?: number;
  /** A count, for parts that come in numbers (tails). */
  n?: number;
}

/** Shorthand for spec files. */
export const ex = (kind: ExtraKind, c?: number, c2?: number, n?: number): Extra => ({
  kind,
  ...(c !== undefined ? { c } : {}),
  ...(c2 !== undefined ? { c2 } : {}),
  ...(n !== undefined ? { n } : {}),
});

const BACK_KINDS = new Set<ExtraKind>([
  'bulb',
  'bud',
  'bloom',
  'backShell',
  'cannons',
  'backSpikes',
  'mushrooms',
  'hood',
  'foxTails',
  'butterflyWings',
  'insectWings',
  'batWings2',
  'fourArms',
  'leafArms',
  'lances',
  'angelWings',
]);

/** Whether a kind is mounted on the back (and so drawn behind the body from the front). */
export const isBackExtra = (k: ExtraKind): boolean => BACK_KINDS.has(k);

type View = 'front' | 'quarter' | 'side' | 'back';
const viewOf = (a: Anchors): View =>
  a.back ? 'back' : a.face >= 1 ? 'side' : a.face > 0 ? 'quarter' : 'front';

/**
 * Draw the spec's extras for one layer. `behind` runs before the body; the front layer
 * runs after the face. Back parts take the behind layer from the front angles and the
 * front layer from the back angles, so they always sit on the far side of the body.
 */
export function drawExtras(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  pose: ChaoPose,
  behind: boolean,
): void {
  if (!spec.addons || spec.addons.length === 0) return;
  const v = viewOf(a);
  for (const e of spec.addons) {
    const back = isBackExtra(e.kind);
    // Extra limbs and the trio always sit behind the body, whatever the angle.
    const alwaysBehind = e.kind === 'fourArms' || e.kind === 'leafArms';
    const wantBehind = alwaysBehind ? true : back ? v !== 'back' : false;
    if (wantBehind !== behind) continue;
    drawOne(pc, a, spec, pose, e, v);
  }
}

function drawOne(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  pose: ChaoPose,
  e: Extra,
  v: View,
): void {
  const col = spec.colors;
  const c = e.c ?? col.accent;
  const c2 = e.c2 ?? col.accent2;
  const s = spec.size;
  const top = a.headCy - a.headRy;
  const hasBody = a.bodyRx > 0;
  // The torso to mount things on: the body, or the lower head for one-piece plans.
  const tx = hasBody ? a.bodyCx : a.headCx;
  const ty = hasBody ? a.bodyCy : a.headCy + Math.round(a.headRy * 0.35);
  const trx = hasBody ? a.bodyRx : a.headRx - 1;
  const tTop = hasBody ? a.bodyCy - a.bodyRy : a.headCy - 1;
  // Where the back is from the side (the drawer faces +x there).
  const backX = hasBody ? a.bodyCx - a.bodyRx : a.headCx - a.headRx + 2;
  const ey = a.headCy + (spec.plan === 'round' ? 0 : 1);
  const mx = a.headCx + (a.face > 0 ? 2 : 0);
  const my = ey + 4;
  const sideSign = (x: number) => (x < a.headCx ? -1 : 1);
  // Two shoulder points from the front and back, one (the near one) from the side.
  const pair = (dx: number): number[] =>
    v === 'side' ? [a.headCx - 1] : v === 'quarter' ? [tx - dx + 1, tx + dx] : [tx - dx, tx + dx];

  switch (e.kind) {
    case 'bulb': {
      const r = Math.max(3, a.headRx * 0.7);
      const [x, y] =
        v === 'back'
          ? [tx, ty - 1]
          : v === 'side'
            ? [backX, tTop]
            : [a.headCx - (v === 'quarter' ? 2 : 0), top - 1];
      pc.disc(x, y, r, c);
      pc.line(x - 1, y - r + 1, x - 2, y + r - 2, c2);
      pc.line(x + 2, y - r + 1, x + 2, y + r - 2, c2);
      pc.px(x - 1, y - r + 1, C.mint);
      break;
    }
    case 'bud': {
      const r = Math.max(3, a.headRx * 0.5);
      const [x, y] =
        v === 'back'
          ? [tx, ty - 2]
          : v === 'side'
            ? [backX + 1, tTop - 1]
            : [a.headCx - (v === 'quarter' ? 2 : 0), top + 1];
      // Four broad leaves splayed under a pink bud.
      for (const d of v === 'side' ? [-1] : [-1, 1]) {
        pc.tri(x, y + 2, x + d * (r + 5), y + 1, x + d * (r + 3), y + 5, c2);
        pc.tri(x, y + 1, x + d * (r + 4), y - 3, x + d * (r + 1), y + 3, c2);
      }
      pc.ellipse(x, y - 1, r * 0.8, r, c);
      pc.tri(x - 2, y - r + 1, x + 2, y - r + 1, x, y - r - 3, c);
      pc.line(x, y - r - 1, x, y + 1, C.rose);
      break;
    }
    case 'bloom': {
      const r = Math.max(5, a.headRx * 0.95);
      const [x, y] =
        v === 'back'
          ? [tx, ty - 3]
          : v === 'side'
            ? [backX + 1, tTop - 3]
            : [a.headCx - (v === 'quarter' ? 2 : 0), top];
      // Palm leaves below the petals, then five petals with pale spots round a centre.
      for (const d of v === 'side' ? [-1] : [-1, 1])
        pc.tri(x, y + 2, x + d * (r + 6), y + 5, x + d * (r + 2), y + 7, C.forest);
      for (let i = 0; i < 5; i++) {
        const t = -Math.PI / 2 + (i * Math.PI * 2) / 5;
        const px = x + Math.cos(t) * r * 0.7;
        const py = y + Math.sin(t) * r * 0.45;
        pc.ellipse(px, py, r * 0.42, r * 0.3, c);
        pc.px(Math.round(px), Math.round(py), C.pale);
      }
      pc.disc(x, y, 1.6, c2);
      break;
    }
    case 'backShell': {
      if (v === 'back') {
        pc.ellipse(tx, ty, trx + 2, (hasBody ? a.bodyRy : a.headRy * 0.7) + 1, c2);
        pc.ellipse(tx, ty, trx + 1, hasBody ? a.bodyRy : a.headRy * 0.7, c);
        pc.line(tx, ty - 3, tx, ty + 3, c2);
        pc.line(tx - 3, ty, tx + 3, ty, c2);
      } else if (v === 'side') {
        pc.ellipse(backX + 1, ty, 3.5 * s, (hasBody ? a.bodyRy : a.headRy * 0.7) + 1, c);
        pc.line(backX + 3, ty - 4, backX + 3, ty + 4, c2);
      } else {
        // A rim either side of the body.
        pc.ellipse(tx, ty, trx + 2, (hasBody ? a.bodyRy : a.headRy * 0.6) + 1, c2);
        pc.ellipse(tx, ty - 1, trx + 1.5, hasBody ? a.bodyRy : a.headRy * 0.6, c);
      }
      break;
    }
    case 'cannons': {
      // Beside the head (the body is narrower than it), so they show from the front.
      const xs =
        v === 'side'
          ? [a.headCx - 1]
          : v === 'back'
            ? [tx - trx + 1, tx + trx - 1]
            : [a.headCx - a.headRx, a.headCx + a.headRx - (v === 'quarter' ? 1 : 0)];
      for (const x of xs) {
        const d = v === 'side' ? 1 : sideSign(x);
        const y0 = v === 'back' ? tTop - 3 : a.headCy + a.headRy - 4;
        pc.rect(x - 1, y0, 3, 5, C.lilacGrey);
        pc.px(x + (v === 'side' ? 0 : -d), y0 + 1, C.pale);
        pc.ellipse(x + 0.5, y0, 1.6, 1, C.ink);
      }
      break;
    }
    case 'backSpikes': {
      if (v === 'side') {
        for (let i = 0; i < 4; i++) {
          const y = tTop - 3 + i * 3;
          pc.tri(backX + 1, y, backX + 1, y + 3, backX - 3, y + 1, c);
        }
      } else if (v === 'back') {
        for (const [dx, dy] of [
          [-3, -3],
          [3, -3],
          [0, 0],
          [-3, 3],
          [3, 3],
        ] as const)
          pc.tri(tx + dx - 1.5, ty + dy + 1, tx + dx + 1.5, ty + dy + 1, tx + dx, ty + dy - 3, c);
      } else {
        for (const d of [-1, 1]) {
          pc.tri(
            a.headCx + d * (a.headRx - 3),
            top + 3,
            a.headCx + d * (a.headRx - 1),
            top + 3,
            a.headCx + d * (a.headRx + 1),
            top - 2,
            c,
          );
          pc.tri(
            tx + d * (trx - 1),
            tTop + 1,
            tx + d * (trx + 1),
            tTop + 3,
            tx + d * (trx + 3),
            tTop - 1,
            c,
          );
        }
      }
      break;
    }
    case 'mushrooms': {
      const pts =
        v === 'side'
          ? [backX + 1]
          : v === 'back'
            ? [tx - 3, tx + 3]
            : [a.headCx - a.headRx, a.headCx + a.headRx];
      const y = v === 'back' ? ty - 2 : v === 'side' ? tTop - 1 : top + 1;
      for (const x of pts) {
        pc.ellipse(x, y, 3.6, 2.6, c);
        pc.px(x - 1, y - 1, c2);
        pc.px(x + 1, y, c2);
      }
      break;
    }
    case 'hood': {
      const cy = a.headCy + 2;
      if (v === 'back') {
        pc.ellipse(a.headCx, cy, a.headRx + 3, a.headRy + 3, col.body);
        pc.ellipse(a.headCx, cy + 1, a.headRx + 1, a.headRy + 1, col.shade);
      } else if (v === 'side') {
        pc.ellipse(a.headCx - 2, cy, 4, a.headRy + 3, col.body);
      } else {
        pc.ellipse(a.headCx, cy, a.headRx + 4, a.headRy + 3, col.body);
        // The face pattern on the flaps.
        for (const d of [-1, 1]) {
          pc.ellipse(a.headCx + d * (a.headRx + 1.5), cy, 1.8, 2.6, c);
          pc.px(a.headCx + d * (a.headRx + 1), cy + 3, c2);
        }
      }
      break;
    }
    case 'foxTails': {
      const n = e.n ?? 6;
      const ox = v === 'side' ? backX : tx;
      const oy = ty + 1;
      for (let i = 0; i < n; i++) {
        // A fan above the back: from the side it leans behind, otherwise it spreads.
        const span =
          v === 'side' ? [-Math.PI * 0.95, -Math.PI * 0.45] : [-Math.PI * 0.92, -Math.PI * 0.08];
        const t = span[0]! + ((span[1]! - span[0]!) * (i + 0.5)) / n;
        const len = Math.max(8 * s, (hasBody ? a.bodyRx : a.headRx) + 5) + (i % 2) * 1.5;
        const ex2 = ox + Math.cos(t) * len;
        const ey2 = oy + Math.sin(t) * len;
        pc.line(ox, oy, ex2, ey2, col.body);
        pc.disc(ex2, ey2, 1.8, col.body);
        pc.disc(ex2 + Math.cos(t) * 1.2, ey2 + Math.sin(t) * 1.2, 1.1, c2);
      }
      break;
    }
    case 'butterflyWings':
    case 'insectWings':
    case 'batWings2': {
      const raise = pose.wings === 1 ? 3 : 0;
      const y = a.headCy + a.headRy - 2 - raise;
      const wing = (x: number, d: number) => {
        if (e.kind === 'butterflyWings') {
          pc.ellipse(x + d * 5, y - 4, 5 * s, 4 * s, c);
          pc.ellipse(x + d * 4, y + 3, 3.5 * s, 3 * s, c);
          pc.ellipse(x + d * 6, y - 5, 2 * s, 1.6 * s, c2);
          pc.px(Math.round(x + d * 4), Math.round(y + 3), c2);
        } else if (e.kind === 'insectWings') {
          pc.ellipse(x + d * 4, y - 4, 3.5 * s, 2 * s, c);
          pc.ellipse(x + d * 3, y - 1, 2.5 * s, 1.5 * s, c);
          pc.thinLine(x, y - 2, x + d * 6, y - 5, c2);
        } else {
          // The lower pair of a four-winged flier.
          pc.tri(x, y + 4, x + d * 6, y + 1, x + d * 7, y + 8, c);
          pc.line(x + d * 2, y + 4, x + d * 6, y + 5, c2);
        }
      };
      if (v === 'side') wing(a.headCx - a.headRx + 2, -1);
      else {
        wing(a.headCx - (v === 'back' ? 2 : a.headRx - 2), -1);
        wing(a.headCx + (v === 'back' ? 2 : a.headRx - 2), 1);
      }
      break;
    }
    case 'angelWings': {
      // LOOK-41: Angemon's six wings: the base kit's pair plus a tall upper pair and a
      // small lower pair, white feathers fanning off the shoulders.
      const y = a.bodyRx > 0 ? a.bodyCy - a.bodyRy + 2 : a.headCy + 2;
      const lift = pose.wings === 1 ? 2 : 0;
      const wing = (x: number, d: number) => {
        pc.tri(x, y + 1, x + d * 8 * s, y - 11 * s - lift, x + d * 5, y + 2, c);
        pc.line(x + d, y - 1, x + d * Math.round(7 * s), y - Math.round(10 * s) - lift, c2);
        pc.tri(x, y + 4, x + d * 7 * s, y + 8 * s, x + d * 2, y + 6, c);
        pc.line(x + d, y + 5, x + d * Math.round(6 * s), y + Math.round(7 * s), c2);
      };
      if (v === 'side') wing(backX + 1, -1);
      else for (const x of pair(trx - 2)) wing(x, sideSign(x));
      break;
    }
    case 'trio': {
      // Two smaller copies of the head and body beside and behind the first.
      // Drawn over the first, lower down, each with its own outline so the three read apart.
      const r = a.headRx * 0.72;
      const ry = a.headRy * 0.75;
      for (const d of v === 'side' ? [-1] : [-1, 1]) {
        const x = a.headCx + d * (a.headRx * 0.85);
        const y = Math.min(a.feetY - ry, a.headCy + a.headRy * 0.6);
        pc.ellipse(x, y, r + 0.6, ry + 0.6, col.outline);
        pc.ellipse(x, y, r, ry, col.body);
        pc.ellipse(x + 1, y + 1, r - 1, ry - 1, col.shade);
        pc.ellipse(x, y, r - 1, ry - 1, col.body);
        if (v !== 'back') {
          pc.px(Math.round(x - 1), Math.round(y), col.eye);
          pc.px(Math.round(x + 1), Math.round(y), col.eye);
          pc.ellipse(x, y + 2, 1.4, 1, c);
        }
      }
      break;
    }
    case 'fourArms': {
      // `n` pairs (default one), below the kit's own arms; on a one-piece body they start
      // at the rim and reach well past it, since the head hides anything nearer.
      const half = hasBody ? trx : a.headRx - 1;
      const reach = hasBody ? 5 : 5.5;
      for (let i = 0; i < (e.n ?? 1); i++) {
        const sy = hasBody ? ty + 1 + i * 3 : a.headCy + i * 3;
        for (const x of v === 'side' ? [tx + 1] : [tx - half, tx + half]) {
          const d = v === 'side' ? 1 : sideSign(x);
          pc.line(x, sy, x + d * reach, sy + 3, col.body);
          pc.disc(x + d * reach, sy + 3, 1.7, col.body);
        }
      }
      break;
    }
    case 'leafArms': {
      const sy = hasBody ? a.bodyCy - 1 : a.headCy + 2;
      const half = hasBody ? Math.max(1, a.bodyRx - 1) : a.headRx - 1;
      for (const x of v === 'side' ? [tx + 1] : [tx - half, tx + half]) {
        const d = v === 'side' ? 1 : sideSign(x);
        pc.tri(x, sy, x + d * 6, sy - 3, x + d * 4, sy + 2, c);
        pc.thinLine(x, sy, x + d * 5, sy - 2, c2);
      }
      break;
    }
    case 'lances': {
      for (const x of pair(trx + 1)) {
        const d = v === 'side' ? 1 : sideSign(x);
        pc.tri(x - 1, ty - 1, x + 1, ty - 1, x + d * 2, ty + 7, c);
      }
      break;
    }
    case 'beak':
    case 'longBeak': {
      if (v === 'back') break;
      const len = e.kind === 'longBeak' ? 6 : 3;
      if (v === 'side') {
        const x = a.headCx + a.headRx - 1;
        pc.tri(x, ey + 1, x, ey + 4, x + len, ey + 3, c);
      } else if (v === 'quarter') {
        pc.tri(mx - 1, ey + 1, mx + 2, ey + 1, mx + 1 + len * 0.6, ey + 2 + len * 0.5, c);
      } else {
        pc.tri(mx - 2, ey + 2, mx + 2, ey + 2, mx, ey + 2 + len, c);
      }
      break;
    }
    case 'bill': {
      if (v === 'back') break;
      if (v === 'side') pc.ellipse(a.headCx + a.headRx, ey + 3, 3, 1.5, c);
      else pc.ellipse(mx, my - 1, v === 'quarter' ? 3 : 3.5, 1.8, c);
      break;
    }
    case 'nose':
    case 'snout': {
      if (v === 'back') break;
      const x = v === 'side' ? a.headCx + a.headRx - 1 : mx;
      pc.ellipse(x, my - 1.5, e.kind === 'snout' ? 2.4 : 1.6, e.kind === 'snout' ? 1.6 : 1.2, c);
      if (e.kind === 'snout') {
        pc.dot(x - 0.7, my - 1.5, c2);
        pc.dot(x + 0.7, my - 1.5, c2);
      }
      break;
    }
    case 'buckTeeth':
      if (v !== 'back' && v !== 'side') pc.rect(mx - 0.5, my + 1, 2, 2, c);
      break;
    case 'fangs':
      if (v !== 'back') {
        pc.tri(mx - 1.5, my + 0.5, mx - 0.5, my + 0.5, mx - 1, my + 2, C.white);
        if (v === 'front') pc.tri(mx + 0.5, my + 0.5, mx + 1.5, my + 0.5, mx + 1, my + 2, C.white);
      }
      break;
    case 'gape': {
      if (v === 'back') break;
      const x = v === 'side' ? a.headCx + a.headRx - 3 : mx;
      const w = v === 'side' ? 2.5 : a.headRx * 0.6;
      pc.ellipse(x, ey + 4, w, a.headRy * 0.5, c);
      pc.ellipse(x, ey + 5 + a.headRy * 0.2, w * 0.6, a.headRy * 0.22, c2);
      pc.tri(x - w + 1, ey + 2, x - w + 2, ey + 2, x - w + 1.5, ey + 4, C.white);
      pc.tri(x + w - 2, ey + 2, x + w - 1, ey + 2, x + w - 1.5, ey + 4, C.white);
      break;
    }
    case 'whiskers':
      if (v !== 'back') {
        for (const d of v === 'side' ? [1] : [-1, 1]) {
          const x = mx + d * 2;
          pc.thinLine(x, my - 1, x + d * 4, my - 2, c);
          pc.thinLine(x, my, x + d * 4, my + 1, c);
        }
      }
      break;
    case 'moustache':
      if (v !== 'back') {
        for (const d of v === 'side' ? [1] : [-1, 1]) {
          pc.line(mx + d, my - 1, mx + d * 3, my + 1, c);
          pc.line(mx + d * 3, my + 1, mx + d * 4, my + 4 * s, c);
        }
      }
      break;
    case 'coin': {
      if (v === 'back') break;
      const x = a.headCx + (v === 'side' ? a.headRx - 3 : v === 'quarter' ? 2 : 0);
      pc.disc(x, top + 2.5, 1.9, c2);
      pc.disc(x, top + 2.5, 1.2, c);
      break;
    }
    case 'bucketHat': {
      // A snowman's bucket hat (Yukidarumon, LOOK-41): a flat brim, a straight crown, a band.
      const w = Math.max(4, Math.round(a.headRx * 0.75));
      // Sunk into the crown of the head, so a tall species keeps the hat inside its frame.
      pc.rect(a.headCx - w, Math.max(0, top - 2), w * 2, 5, c);
      pc.rect(a.headCx - w, top + 1, w * 2, 2, c2);
      pc.ellipse(a.headCx, top + 3, a.headRx + 1, 1.3, c);
      break;
    }
    case 'cap': {
      const ry = a.headRy * 0.8 + 1;
      const cy = a.headCy - 1 - ry * 0.55;
      pc.ellipse(a.headCx, cy, a.headRx + 3, ry, c);
      pc.ellipse(a.headCx, cy + ry * 0.55, a.headRx + 3, 1.2, col.shade);
      for (const [dx, dy] of [
        [-4, -1],
        [2, -2],
        [4, 1],
        [-1, 1],
      ] as const)
        pc.disc(a.headCx + dx, cy + dy, 0.9, c2);
      break;
    }
    case 'leafTuft': {
      const n = e.n ?? 5;
      for (let i = 0; i < n; i++) {
        const t = -Math.PI / 2 + (i - (n - 1) / 2) * 0.45;
        const len = 7 * s;
        const x2 = a.headCx + Math.cos(t) * len;
        const y2 = top + 1 + Math.sin(t) * len;
        pc.tri(a.headCx - 1, top + 2, a.headCx + 1, top + 2, x2, y2, i % 2 ? c2 : c);
        pc.disc((a.headCx + x2) / 2, (top + 1 + y2) / 2, 1.5, i % 2 ? c2 : c);
      }
      break;
    }
    case 'bigFlower': {
      const r = a.headRx + 3;
      for (let i = 0; i < 5; i++) {
        const t = -Math.PI / 2 + (i * Math.PI * 2) / 5;
        const px = a.headCx + Math.cos(t) * r * 0.6;
        const py = top - 1 + Math.sin(t) * 2.5;
        pc.ellipse(px, py, r * 0.42, 2.6, c);
        pc.px(Math.round(px), Math.round(py), c2);
      }
      pc.disc(a.headCx, top - 1, 1.6, col.outline);
      break;
    }
    case 'flowers':
      for (const d of v === 'side' ? [-1] : [-1, 1]) {
        const x = a.headCx + d * (a.headRx - 3);
        pc.line(a.headCx, top + 1, x, top - 3, C.leaf);
        pc.disc(x, top - 3, 2.2, c);
        pc.px(x, top - 3, c2);
      }
      break;
    case 'plume': {
      const len = 7 * s;
      const d = v === 'side' ? -1 : 1;
      const x0 = a.headCx + (v === 'side' ? -1 : 0);
      if (v === 'front' || v === 'back') {
        for (const dd of [-1, 1])
          pc.tri(x0 - 1, top + 2, x0 + 1, top + 2, x0 + dd * 3, top - len, dd < 0 ? c : c2);
      } else {
        pc.tri(x0, top + 2, x0 + d * 2, top + 2, x0 + d * (len * 0.6), top - len, c);
        pc.tri(x0, top + 2, x0 + d * 3, top + 3, x0 + d * len, top - len * 0.5, c2);
      }
      break;
    }
    case 'hairs':
      for (const dx of [-2, 0, 2]) {
        pc.thinLine(a.headCx + dx * 0.5, top + 1, a.headCx + dx, top - 3, c);
      }
      break;
    case 'crown': {
      // A named unique's crown (R0156): a band with three points, a gem on the middle one.
      const w = Math.max(3, Math.round(a.headRx * 0.6));
      const y = Math.max(5, top + 1);
      pc.rect(a.headCx - w, y - 1, w * 2 + 1, 2, c);
      for (const d of [-1, 0, 1]) {
        const x = a.headCx + d * w;
        pc.tri(x - 1.5, y - 1, x + 1.5, y - 1, x, y - (d === 0 ? 5 : 4), c);
      }
      pc.px(a.headCx, y - 2, c2);
      break;
    }
    case 'antennae':
      for (const d of v === 'side' ? [1] : [-1, 1]) {
        const x = a.headCx + d * 2;
        pc.line(x, top + 1, x + d * 3, top - 5, c);
        pc.disc(x + d * 3, top - 5, 1, c2);
      }
      break;
    case 'mane':
      // A cream ruff under the chin and a tuft on the crown.
      if (v !== 'back')
        pc.ellipse(
          a.headCx + (a.face > 0 ? 1 : 0),
          a.headCy + a.headRy - 1,
          a.headRx * 0.65,
          2.6,
          c,
        );
      pc.disc(a.headCx + (v === 'side' ? -2 : 0), top + 1, 2.3, c);
      pc.px(a.headCx + (v === 'side' ? -4 : 2), top - 1, c);
      break;
    case 'swirl': {
      if (v === 'back') break;
      const x = tx + (a.face > 0 ? 1 : 0);
      const y = hasBody ? a.bodyCy + 1 : a.headCy + a.headRy * 0.5;
      const r = Math.max(2.5, (hasBody ? a.bodyRx : a.headRx) * 0.5);
      pc.disc(x, y, r, c2);
      // A spiral as three shrinking arcs.
      let ang = 0;
      let rr = r - 0.6;
      let px = x + rr;
      let py = y;
      while (rr > 0.4) {
        ang += 0.5;
        rr -= 0.12;
        const nx = x + Math.cos(ang) * rr;
        const ny = y + Math.sin(ang) * rr;
        pc.thinLine(px, py, nx, ny, c);
        px = nx;
        py = ny;
      }
      break;
    }
    case 'gems': {
      if (v === 'back') break;
      for (const d of v === 'side' ? [1] : [-1, 1])
        pc.disc(a.headCx + d * (a.headRx - 2.5), a.headCy - 1, 1.6, c);
      if (v !== 'side') pc.disc(a.headCx, a.headCy + a.headRy - 2, 1, c);
      break;
    }
    case 'heart':
      // A heart on the chest (Monzaemon, LOOK-41), seen from the front and the quarter.
      if (v === 'front' || v === 'quarter') {
        const hx = tx + (v === 'quarter' ? 1 : 0);
        pc.disc(hx - 1.2, ty - 1, 1.5, c);
        pc.disc(hx + 1.2, ty - 1, 1.5, c);
        pc.tri(hx - 2.6, ty - 0.6, hx + 2.6, ty - 0.6, hx, ty + 2.4, c);
      }
      break;
    case 'tubes':
      // LOOK-41: Andromon's exposed red tubes, looping from the chest to the hips.
      if (hasBody && v !== 'back')
        for (const d of v === 'side' ? [1] : [-1, 1]) {
          const x0 = a.bodyCx + d * (a.bodyRx - 2);
          pc.thinLine(x0, tTop + 2, x0 + d, a.bodyCy, c);
          pc.thinLine(x0 + d, a.bodyCy, x0, a.bodyCy + a.bodyRy - 2, c);
        }
      break;
    case 'drool':
      // LOOK-41: a drip off the open mouth (Numemon, Sukamon).
      if (v !== 'back') {
        const x = (v === 'side' ? a.headCx + a.headRx - 3 : mx) + 1;
        pc.thinLine(x, my + 1, x, my + 3, c);
        pc.disc(x, my + 4, 0.9, c);
      }
      break;
    case 'belt':
      if (hasBody)
        pc.rect(a.bodyCx - a.bodyRx + 1, a.bodyCy + a.bodyRy - 4, a.bodyRx * 2 - 2, 2, c);
      break;
    case 'pads':
      for (const x of v === 'side' ? [tx] : [tx - trx + 1, tx + trx - 1])
        pc.disc(x, tTop + 1, 2.3, c);
      break;
    case 'plates':
      if (v !== 'back') {
        for (let i = 0; i < 3; i++) {
          const y = a.headCy + 2 + i * 2.5;
          pc.thinLine(a.headCx - a.headRx + 2, y, a.headCx + a.headRx - 2, y + 0.5, c);
        }
      }
      break;
    case 'rocks':
      for (const [dx, dy] of [
        [-4, -3],
        [3, -4],
        [5, 1],
        [-5, 2],
        [1, 3],
      ] as const) {
        pc.px(a.headCx + Math.round(dx * s), a.headCy + Math.round(dy * s), c);
        pc.px(a.headCx + Math.round(dx * s) + 1, a.headCy + Math.round(dy * s), c);
      }
      // A knobbly rim: two bumps on the outline.
      pc.disc(a.headCx - a.headRx + 1, a.headCy - 2, 1.6, col.body);
      pc.disc(a.headCx + a.headRx - 1, a.headCy + 1, 1.6, col.body);
      break;
    case 'skirt':
      for (let i = -2; i <= 2; i++) {
        const x = tx + i * 2.2;
        pc.tri(x - 1.5, ty, x + 1.5, ty, x + i * 0.8, a.feetY - 1, i % 2 ? c2 : c);
      }
      break;
    case 'stem': {
      // Repaint a stalk's stem below the head (the head keeps the body colour).
      if (spec.plan !== 'stalk') break;
      const y0 = a.headCy + a.headRy;
      const h = a.bodyCy + a.bodyRy - y0;
      if (h > 0) {
        pc.rect(a.bodyCx - a.bodyRx, y0, a.bodyRx * 2, h, c2);
        pc.rect(a.bodyCx - a.bodyRx + 1, y0, a.bodyRx * 2 - 2, h, c);
      }
      pc.ellipse(a.bodyCx, a.feetY - 1, a.bodyRx + 3, 2, c2);
      break;
    }
    case 'spoons':
      if (v !== 'back') {
        for (const x of v === 'side' ? [tx + 3] : [tx - trx - 2, tx + trx + 2]) {
          pc.line(x, ty + 2, x, ty - 3, c);
          pc.ellipse(x, ty - 4, 1.2, 1.6, c);
        }
      }
      break;
  }
}
