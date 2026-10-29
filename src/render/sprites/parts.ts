import type { DrawnAngle } from './angles';
import type { Layout } from './layout';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';

/**
 * Critter parts: the newest critter given sets the part in each slot. Every part is a
 * small parametric drawing so 26 species × 8 slots × 5 angles stay manageable. The
 * species → part mapping lives in sim/critters.ts; here part ids map to a shape + palette.
 * Ids a species no longer sets (`penguin-tail`, `parrot-back`) stay, for older saves.
 */
export interface PartStyle {
  shape: string;
  color: number;
  accent: number;
  /** Size of the drawing; a child wears its parts at 0.8 (LOOK-66). */
  k?: number;
}

export const PART_STYLES: Record<string, PartStyle> = {
  // Swim
  'penguin-arms': { shape: 'flipper', color: C.ink, accent: C.white },
  'penguin-tail': { shape: 'stub', color: C.ink, accent: C.white },
  'seal-arms': { shape: 'flipper', color: C.lilacGrey, accent: C.pale },
  'seal-tail': { shape: 'fin', color: C.lilacGrey, accent: C.pale },
  'otter-ears': { shape: 'round', color: C.bark, accent: C.sand },
  'otter-tail': { shape: 'long', color: C.bark, accent: C.wood },
  // Fly
  'peacock-back': { shape: 'feathers', color: C.teal, accent: C.violet },
  'peacock-ears': { shape: 'crest', color: C.teal, accent: C.mint },
  'parrot-back': { shape: 'wings', color: C.ember, accent: C.sunYellow },
  'parrot-ears': { shape: 'crest', color: C.ember, accent: C.sunYellow },
  'condor-back': { shape: 'wings', color: C.darkPlum, accent: C.dusk },
  'condor-ears': { shape: 'tuft', color: C.white, accent: C.pale },
  // Run
  'cheetah-ears': { shape: 'round', color: C.sand, accent: C.darkBark },
  'cheetah-tail': { shape: 'long', color: C.sand, accent: C.darkBark },
  'rabbit-ears': { shape: 'long', color: C.pale, accent: C.blush },
  'rabbit-tail': { shape: 'puff', color: C.white, accent: C.pale },
  'boar-ears': { shape: 'pointed', color: C.dusk, accent: C.plum },
  'boar-tail': { shape: 'stub', color: C.dusk, accent: C.plum },
  // Power
  'gorilla-arms': { shape: 'big', color: C.darkPlum, accent: C.dusk },
  'gorilla-ears': { shape: 'round', color: C.darkPlum, accent: C.dusk },
  'bear-ears': { shape: 'round', color: C.bark, accent: C.sand },
  'bear-arms': { shape: 'paw', color: C.bark, accent: C.sand },
  'tiger-ears': { shape: 'round', color: C.orange, accent: C.ink },
  'tiger-tail': { shape: 'long', color: C.orange, accent: C.ink },
  // Normal
  'sheep-ears': { shape: 'horn', color: C.cream, accent: C.sand },
  'sheep-tail': { shape: 'puff', color: C.pale, accent: C.white },
  'raccoon-ears': { shape: 'pointed', color: C.dusk, accent: C.ink },
  'raccoon-tail': { shape: 'bushy', color: C.dusk, accent: C.ink },
  'skunk-ears': { shape: 'pointed', color: C.ink, accent: C.white },
  'skunk-tail': { shape: 'bushy', color: C.ink, accent: C.white },
  // R0401: legs, horn, face and wings for the first fifteen.
  'penguin-legs': { shape: 'webbed', color: C.orange, accent: C.ember },
  'penguin-face': { shape: 'beak', color: C.orange, accent: C.ember },
  'otter-face': { shape: 'whiskers', color: C.sand, accent: C.darkBark },
  'parrot-wings': { shape: 'wings', color: C.ember, accent: C.sunYellow },
  'parrot-face': { shape: 'hook', color: C.sunYellow, accent: C.sunDeep },
  'parrot-tail': { shape: 'plume', color: C.ember, accent: C.teal },
  'condor-wings': { shape: 'wings', color: C.darkPlum, accent: C.dusk },
  'cheetah-legs': { shape: 'paw', color: C.sand, accent: C.darkBark },
  'rabbit-legs': { shape: 'bigfoot', color: C.pale, accent: C.blush },
  'boar-horn': { shape: 'tusks', color: C.cream, accent: C.sand },
  'boar-legs': { shape: 'hoof', color: C.dusk, accent: C.ink },
  'tiger-arms': { shape: 'paw', color: C.orange, accent: C.ink },
  'raccoon-face': { shape: 'mask', color: C.dusk, accent: C.ink },
  // R0402: the nine new wild critters.
  'bonefish-ears': { shape: 'crest', color: C.pale, accent: C.greyDeep },
  'bonefish-tail': { shape: 'fin', color: C.pale, accent: C.greyDeep },
  'turtle-back': { shape: 'shell', color: C.leafDeep, accent: C.leafLight },
  'turtle-legs': { shape: 'flipper', color: C.leaf, accent: C.leafLight },
  'swallow-wings': { shape: 'wings', color: C.nightBlue, accent: C.white },
  'swallow-tail': { shape: 'fork', color: C.nightBlue, accent: C.white },
  'bat-wings': { shape: 'bat', color: C.darkPlum, accent: C.violet },
  'bat-ears': { shape: 'pointed', color: C.darkPlum, accent: C.violet },
  'deer-horn': { shape: 'antlers', color: C.wood, accent: C.bark },
  'deer-legs': { shape: 'hoof', color: C.wood, accent: C.darkBark },
  'deer-tail': { shape: 'puff', color: C.white, accent: C.sand },
  'monkey-arms': { shape: 'paw', color: C.bark, accent: C.sand },
  'monkey-ears': { shape: 'round', color: C.bark, accent: C.sand },
  'monkey-tail': { shape: 'long', color: C.bark, accent: C.sand },
  'unicorn-horn': { shape: 'unihorn', color: C.sunYellow, accent: C.white },
  'unicorn-legs': { shape: 'hoof', color: C.white, accent: C.lavender },
  'unicorn-tail': { shape: 'bushy', color: C.lavender, accent: C.violetLight },
  'wolf-ears': { shape: 'pointed', color: C.greyDeep, accent: C.greyLight },
  'wolf-tail': { shape: 'bushy', color: C.greyDeep, accent: C.greyLight },
  'wolf-face': { shape: 'snout', color: C.greyLight, accent: C.ink },
  'koala-ears': { shape: 'fluffy', color: C.greyLight, accent: C.pale },
  'koala-face': { shape: 'nose', color: C.ink, accent: C.greyDeep },
  // The Hollow's two rare critters.
  'phoenix-wings': { shape: 'flame', color: C.ember, accent: C.sunYellow },
  'phoenix-tail': { shape: 'plume', color: C.ember, accent: C.sunYellow },
  'phoenix-ears': { shape: 'crest', color: C.sunYellow, accent: C.ember },
  'dragon-horn': { shape: 'horns', color: C.cream, accent: C.sand },
  'dragon-wings': { shape: 'bat', color: C.leafDeep, accent: C.leaf },
  'dragon-tail': { shape: 'long', color: C.leaf, accent: C.leafDeep },
};

export function partStyle(id: string | null): PartStyle | null {
  return id ? (PART_STYLES[id] ?? null) : null;
}

// ---------- ears (on the head, drawn after the head, before the face) ----------

export function drawEars(pc: PixelCanvas, angle: DrawnAngle, L: Layout, s: PartStyle): void {
  const k = s.k ?? 1;
  const top = L.headCy - L.headRy;
  const left = L.headCx - L.headRx + 2;
  const right = L.headCx + L.headRx - 2;
  // Where the two ears sit for each angle (x positions); the back hides nothing.
  const spots: Array<[number, number]> =
    angle === 'front' || angle === 'back'
      ? [
          [left, top + 1],
          [right, top + 1],
        ]
      : angle === 'side'
        ? [[L.headCx - 2, top]]
        : [
            [left + 1, top + 1],
            [right - 1, top + 2],
          ];
  for (const [x, y] of spots) {
    switch (s.shape) {
      case 'round':
        pc.disc(x, y, 2.4 * k, s.color);
        pc.px(x, y, s.accent);
        break;
      case 'long':
        pc.ellipse(x, y - 4 * k, 1.6 * k, 5 * k, s.color);
        pc.ellipse(x, y - 4 * k, 0.8 * k, 3 * k, s.accent);
        break;
      case 'pointed':
        pc.tri(x - 2 * k, y + k, x + 2 * k, y + k, x, y - 4 * k, s.color);
        pc.px(x, y - k, s.accent);
        break;
      case 'horn':
        pc.disc(x, y, 2.2 * k, s.color);
        pc.px(x, y, s.accent);
        pc.px(x - k, y - k, s.accent);
        pc.px(x + k, y + k, s.accent);
        break;
      case 'crest':
        if (x !== spots[0]?.[0] && spots.length > 1) break; // one crest only
        for (let i = -1; i <= 1; i++) {
          pc.line(L.headCx, top - k, L.headCx + i * 3, top - 5 * k - Math.abs(i), s.color);
          pc.px(L.headCx + i * 3, top - 5 * k - Math.abs(i), s.accent);
        }
        break;
      case 'fluffy':
        // A koala's big round ear with a pale fluffy middle.
        pc.disc(x, y - k, 3 * k, s.color);
        pc.disc(x, y - k, 1.6 * k, s.accent);
        break;
      case 'tuft':
        if (x !== spots[0]?.[0] && spots.length > 1) break;
        pc.disc(L.headCx - 1, top - k, 2.2 * k, s.color);
        pc.disc(L.headCx + 2, top - 2 * k, 1.6 * k, s.accent);
        break;
    }
  }
}

// ---------- tail (behind the body from the front, in front from the back) ----------

export function drawTail(pc: PixelCanvas, angle: DrawnAngle, L: Layout, s: PartStyle): void {
  const k = s.k ?? 1;
  // Anchor: the lower back of the body.
  let x = L.bodyCx;
  const y = L.bodyCy + 2;
  let dir: 1 | -1 = -1;
  switch (angle) {
    case 'front':
      x = L.bodyCx + L.bodyRx - 1;
      dir = 1;
      break;
    case 'frontQuarter':
      x = L.bodyCx - L.bodyRx + 1;
      dir = -1;
      break;
    case 'side':
      x = L.bodyCx - L.bodyRx;
      dir = -1;
      break;
    case 'backQuarter':
      x = L.bodyCx - 1;
      dir = -1;
      break;
    case 'back':
      x = L.bodyCx;
      dir = 1;
      break;
  }
  switch (s.shape) {
    case 'puff':
      pc.disc(x + dir * 2 * k, y, 2.4 * k, s.color);
      pc.px(x + dir * 2 * k - 1, y - k, s.accent);
      break;
    case 'stub':
      pc.tri(x, y - 2 * k, x, y + 2 * k, x + dir * 4 * k, y, s.color);
      pc.px(x + dir * 2 * k, y, s.accent);
      break;
    case 'fin':
      pc.tri(x, y - k, x + dir * 5 * k, y - 4 * k, x + dir * 5 * k, y + 3 * k, s.color);
      pc.px(x + dir * 3 * k, y, s.accent);
      break;
    case 'long': {
      pc.line(x, y, x + dir * 4 * k, y + k, s.color);
      pc.line(x + dir * 4 * k, y + k, x + dir * 7 * k, y - 3 * k, s.color);
      pc.line(x + dir * 7 * k, y - 3 * k, x + dir * 7 * k, y - 6 * k, s.color);
      pc.px(x + dir * 5 * k, y - k, s.accent);
      pc.px(x + dir * 7 * k, y - 5 * k, s.accent);
      break;
    }
    case 'fork':
      // A swallow's forked tail: two long points with pale tips.
      pc.tri(x, y - k, x, y + k, x + dir * 6 * k, y - 3 * k, s.color);
      pc.tri(x, y - k, x, y + k, x + dir * 6 * k, y + 3 * k, s.color);
      pc.px(x + dir * 6 * k, y - 3 * k, s.accent);
      pc.px(x + dir * 6 * k, y + 3 * k, s.accent);
      break;
    case 'plume':
      // Three long tail feathers fanning down and out, tipped with the accent.
      for (let i = -1; i <= 1; i++) {
        const ex = x + dir * (6 + Math.abs(i)) * k;
        const ey = y + (1 + i * 2.5) * k;
        pc.line(x, y, ex, ey, s.color);
        pc.px(ex, ey, s.accent);
      }
      break;
    case 'bushy':
      pc.ellipse(x + dir * 4 * k, y - k, 3.5 * k, 2.6 * k, s.color);
      pc.line(x + dir * 2 * k, y - 3 * k, x + dir * 2 * k, y + k, s.accent);
      pc.line(x + dir * 6 * k, y - 3 * k, x + dir * 6 * k, y + k, s.accent);
      break;
  }
}

// ---------- arms (replace the default stubby arms) ----------

export function drawArmPart(
  pc: PixelCanvas,
  sx: number,
  sy: number,
  hx: number,
  hy: number,
  dir: 1 | -1,
  s: PartStyle,
): void {
  const k = s.k ?? 1;
  switch (s.shape) {
    case 'flipper':
      pc.line(sx, sy, hx, hy, s.color);
      pc.ellipse(hx + dir, hy + k, 2.6 * k, 1.4 * k, s.color);
      pc.px(hx + dir, hy + k, s.accent);
      break;
    case 'paw':
      pc.line(sx, sy, hx, hy, s.color);
      pc.disc(hx, hy, 2.2 * k, s.color);
      pc.px(hx, hy + k, s.accent);
      pc.px(hx + dir, hy, s.accent);
      break;
    case 'big':
      pc.line(sx, sy, hx, hy, s.color);
      pc.line(sx, sy + k, hx, hy + k, s.color);
      pc.disc(hx + dir, hy + k, 2.8 * k, s.color);
      pc.px(hx + dir, hy + k, s.accent);
      break;
  }
}

// ---------- back (replaces the default little wings) ----------

export function drawBack(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  s: PartStyle,
  raise: number,
  frontLayer: boolean,
): void {
  const k = s.k ?? 1;
  const y = L.headCy + L.headRy - 2 - raise;
  const showBehind = angle === 'front' || angle === 'frontQuarter' || angle === 'side';
  if (s.shape === 'shell') {
    drawShell(pc, angle, L, s, frontLayer);
    return;
  }
  if (showBehind === frontLayer) return;
  const wing = (cx: number, dir: 1 | -1, size: number) => {
    if (s.shape === 'bat') {
      // A membrane wing: a wide triangle, its trailing edge nicked between the fingers.
      const tx = cx + dir * (size + 3) * k;
      pc.tri(cx, y + 2 * k, tx, y - size, tx, y + 3 * k, s.color);
      pc.line(cx, y + k, tx, y - size, s.accent);
      pc.line(cx, y + k, cx + dir * (size + 1) * k, y + 3 * k, s.accent);
      pc.erase(cx + dir * (size + 2) * k, y + 3 * k);
      return;
    }
    if (s.shape === 'feathers') {
      for (let i = 0; i < 3; i++) {
        const ex = cx + dir * (size + i * 2);
        const ey = y - size - 2 + i * 3;
        pc.line(cx, y + k, ex, ey, s.color);
        pc.disc(ex, ey, 1.2 * k, s.accent);
        pc.px(ex, ey, C.ink);
      }
    } else {
      pc.tri(
        cx,
        y + 2 * k,
        cx + dir * (size + 1) * k,
        y - size,
        cx + dir * (size + 3) * k,
        y + 3 * k,
        s.color,
      );
      pc.line(cx + dir, y + k, cx + dir * (size + 1) * k, y - size + 2, s.accent);
      if (s.shape === 'flame') {
        // A phoenix's wing burns at its tips.
        pc.px(cx + dir * (size + 1) * k, y - size, s.accent);
        pc.px(cx + dir * (size + 3) * k, y + 2 * k, s.accent);
        pc.px(cx + dir * (size + 2) * k, y - size + 2, C.sunLight);
      }
    }
  };
  const big = 5;
  const small = 4;
  switch (angle) {
    case 'front':
      wing(L.headCx - L.headRx + 1, -1, small);
      wing(L.headCx + L.headRx - 1, 1, small);
      break;
    case 'frontQuarter':
      wing(L.headCx - L.headRx + 1, -1, big);
      wing(L.headCx + L.headRx - 2, 1, small - 1);
      break;
    case 'side':
      wing(L.headCx - L.headRx + 1, -1, big);
      break;
    case 'backQuarter':
      wing(L.headCx - 3, -1, big);
      wing(L.headCx + 4, 1, small);
      break;
    case 'back':
      wing(L.headCx - 2, -1, big);
      wing(L.headCx + 2, 1, big);
      break;
  }
}

/** A turtle's shell: a domed oval over the back, its rim peeking past the body in front. */
function drawShell(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  s: PartStyle,
  frontLayer: boolean,
): void {
  const k = s.k ?? 1;
  const back = angle === 'back' || angle === 'backQuarter';
  const cy = L.bodyCy - 1;
  if (back && frontLayer) {
    pc.ellipse(L.bodyCx, cy, (L.bodyRx + 1) * k, (L.bodyRy + 1) * k, s.color);
    pc.ellipse(L.bodyCx, cy, 2.2 * k, 1.8 * k, s.accent);
    for (const dx of [-1, 1]) pc.disc(L.bodyCx + dx * 3.5 * k, cy + 1.5 * k, 1.2 * k, s.accent);
  } else if (!back && !frontLayer) {
    const dx = angle === 'side' ? -2 : 0;
    pc.ellipse(L.bodyCx + dx, cy, (L.bodyRx + 1.5) * k, (L.bodyRy + 0.5) * k, s.color);
  }
}

// ---------- legs (R0401: over the stock feet) ----------

/** Where the two feet stand for each angle, as the stock feet do (`chao.ts` drawFeet). */
export function footSpots(
  angle: DrawnAngle,
  L: Layout,
  step: number,
  tucked: boolean,
): Array<[number, number]> {
  const y = L.feetY;
  if (angle === 'side')
    return [
      [L.bodyCx - 1 + step * 2, y],
      [L.bodyCx + 2 - step * 2, y],
    ];
  const spread = angle === 'front' || angle === 'back' ? 4 : 3;
  return [
    [L.bodyCx - spread, y + (tucked ? 0 : step)],
    [L.bodyCx + spread, y + (tucked ? 0 : -step)],
  ];
}

export function drawLegPart(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  s: PartStyle,
  step: number,
  tucked: boolean,
): void {
  const k = s.k ?? 1;
  const fwd = angle === 'side' ? 1 : 0;
  for (const [x, y] of footSpots(angle, L, step, tucked)) {
    switch (s.shape) {
      case 'webbed':
        pc.ellipse(x + fwd, y, 3 * k, 1.4 * k, s.color);
        for (const dx of [-2, 0, 2]) pc.px(x + fwd + dx * k, y + k, s.accent);
        break;
      case 'hoof':
        pc.rect(x - 1.5 * k, y - 3 * k, 3 * k, 3 * k, s.color);
        pc.ellipse(x, y, 2 * k, 1.3 * k, s.accent);
        break;
      case 'bigfoot':
        pc.ellipse(x + fwd * 2, y, 3.6 * k, 1.5 * k, s.color);
        pc.ellipse(x + fwd * 2, y + 0.5, 1.6 * k, 0.8 * k, s.accent);
        break;
      case 'flipper':
        pc.ellipse(x + fwd, y, 3.4 * k, 1.3 * k, s.color);
        pc.thinLine(x - 2 * k, y, x + 2 * k, y, s.accent);
        break;
      default:
        // paw: a round paw with three toe pads.
        pc.ellipse(x, y, 2.8 * k, 1.7 * k, s.color);
        for (const dx of [-1, 0, 1]) pc.px(x + fwd + dx * k, y + k, s.accent);
    }
  }
}

// ---------- horn (R0401: on the forehead; tusks by the mouth) ----------

/** The forehead point for each angle; the horn grows from here. */
function forehead(angle: DrawnAngle, L: Layout): [number, number] {
  const dx =
    angle === 'side' ? 3 : angle === 'frontQuarter' ? 1.5 : angle === 'backQuarter' ? -1 : 0;
  return [L.headCx + dx, L.headCy - L.headRy + 3];
}

/**
 * The horn slot. From the back views it goes on before the head (only the tips show above
 * it); from the front, after the head. Tusks sit by the mouth and show only from the front.
 */
export function drawHorn(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  s: PartStyle,
  frontLayer: boolean,
): void {
  const back = angle === 'back' || angle === 'backQuarter';
  if (back === frontLayer) return;
  const k = s.k ?? 1;
  const [x, y] = forehead(angle, L);
  const pair = angle === 'side' ? [-1] : [-1, 1];
  switch (s.shape) {
    case 'tusks': {
      if (back) return;
      const my = L.headCy + 5;
      const xs =
        angle === 'side'
          ? [L.headCx + 5]
          : angle === 'frontQuarter'
            ? [L.headCx, L.headCx + 4]
            : [L.headCx - 3, L.headCx + 3];
      for (const tx of xs) {
        const dir = tx <= L.headCx ? -1 : 1;
        pc.tri(tx, my - k, tx + dir * 1.5 * k, my - k, tx + dir * 2 * k, my - 4 * k, s.color);
        pc.px(tx + dir * 2 * k, my - 4 * k, s.accent);
      }
      break;
    }
    case 'antlers':
      for (const dir of pair) {
        const bx = (angle === 'side' ? L.headCx - 1 : L.headCx) + dir * 3 * k;
        const by = L.headCy - L.headRy + 2;
        pc.line(bx, by, bx + dir * 3 * k, by - 6 * k, s.color);
        pc.line(bx + dir * k, by - 3 * k, bx + dir * 4 * k, by - 4 * k, s.color);
        pc.line(bx + dir * 2 * k, by - 5 * k, bx, by - 8 * k, s.color);
        pc.px(bx + dir * 3 * k, by - 6 * k, s.accent);
      }
      break;
    case 'horns':
      // A dragon's pair, swept back off the brow.
      for (const dir of pair) {
        const bx = angle === 'side' ? L.headCx : L.headCx + dir * 3 * k;
        const by = L.headCy - L.headRy + 3;
        const tx = angle === 'side' ? bx - 4 * k : bx + dir * 2 * k;
        pc.tri(bx - 1.2 * k, by, bx + 1.2 * k, by, tx, by - 6 * k, s.color);
        pc.px(tx, by - 6 * k, s.accent);
      }
      break;
    default: {
      // unihorn: one spiral horn straight up from the brow, banded with the accent.
      const lean = angle === 'side' ? 2 : 0;
      pc.tri(x - 1.6 * k, y, x + 1.6 * k, y, x + lean * k, y - 8 * k, s.color);
      for (let i = 1; i <= 3; i++) pc.px(x + (lean * k * i) / 4, y - 2 * i * k, s.accent);
    }
  }
}

// ---------- face (R0401: a beak, snout, nose, whiskers or mask) ----------

/**
 * The face slot, shown from the front three angles. A mask goes under the eyes
 * (`over` false), everything else over the mouth (`over` true).
 */
export function drawFacePart(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  s: PartStyle,
  over: boolean,
): void {
  if (angle === 'back' || angle === 'backQuarter') return;
  if ((s.shape === 'mask') === over) return;
  const k = s.k ?? 1;
  const side = angle === 'side';
  const mx = side ? L.headCx + 6 : angle === 'frontQuarter' ? L.headCx + 2 : L.headCx;
  const my = L.headCy + 5;
  switch (s.shape) {
    case 'beak':
    case 'hook':
      if (side) {
        pc.tri(mx - 2, my - 2 * k, mx - 2, my + 1.5 * k, mx + 4 * k, my, s.color);
        pc.thinLine(mx - 2, my, mx + 3 * k, my, s.accent);
        if (s.shape === 'hook') pc.px(mx + 3 * k, my + k, s.accent);
      } else {
        pc.tri(mx - 2.5 * k, my - 1.5 * k, mx + 2.5 * k, my - 1.5 * k, mx, my + 2.5 * k, s.color);
        pc.thinLine(mx - 2 * k, my - 0.5, mx + 2 * k, my - 0.5, s.accent);
        if (s.shape === 'hook') pc.px(mx, my + 2.5 * k, s.accent);
      }
      break;
    case 'whiskers':
      pc.ellipse(mx, my - 1, 1.2 * k, 0.9 * k, s.accent);
      for (const dir of side ? [1] : [-1, 1])
        for (const dy of [-0.5, 1])
          pc.thinLine(mx + dir * 2, my + dy - 1, mx + dir * 6 * k, my + dy * 2 - 1, s.accent);
      break;
    case 'snout':
      pc.ellipse(mx + (side ? 1 : 0), my - 0.5, (side ? 3 : 2.6) * k, 1.8 * k, s.color);
      pc.ellipse(mx + (side ? 3 : 0), my - 1.5, 1.1 * k, 0.8 * k, s.accent);
      break;
    case 'nose':
      pc.ellipse(mx + (side ? 1 : 0), my - 1.5, 1.8 * k, 2.2 * k, s.color);
      pc.dot(mx + (side ? 1 : 0) - 0.6, my - 2.6, s.accent);
      break;
    default: {
      // mask: a dark band across the eyes, drawn before them.
      const cx = side ? L.headCx + 3 : angle === 'frontQuarter' ? L.headCx + 2 : L.headCx;
      pc.ellipse(cx, L.headCy + 1.5, (side ? 3.5 : 7.5) * k, 2.4 * k, s.color);
      break;
    }
  }
}
