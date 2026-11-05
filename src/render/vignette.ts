import { RIDE_TEXT } from '../config/strings-r12d1';
import { RIDE_SCENE as RIDE } from '../config/tuning-r12d1';

/**
 * WORLD-69 (R12 lane D): a ride between distant places as a short side-on scene, the same in
 * both renderers: a low-res canvas over the game, scaled up pixelated like the world, showing
 * the Keeper's ferry crossing the night sea (or the cart on the ridge road) for `RIDE.ms`, then
 * the arrival. The first ride plays whole; later ones offer Skip (a 44 px button). Reduced
 * motion holds one still frame for a moment instead. Lazy: loaded on the first ride.
 */
export type RideKind = 'ferry' | 'cart';

const W = 160;
const H = 90;

function drawFerry(g: CanvasRenderingContext2D, t: number, still: boolean): void {
  // Night sky, a moon and stars.
  g.fillStyle = '#1b2a5c';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#2b3a74';
  g.fillRect(0, 34, W, 20);
  g.fillStyle = '#f3efe4';
  g.beginPath();
  g.arc(126, 18, 7, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#1b2a5c';
  g.beginPath();
  g.arc(129, 16, 6, 0, Math.PI * 2);
  g.fill();
  for (let i = 0; i < 24; i++) {
    g.fillStyle = (i + Math.floor(t * 4)) % 5 === 0 && !still ? '#ffffff' : '#9fb0e0';
    g.fillRect((i * 37) % W, (i * 11) % 32, 1, 1);
  }
  // The far shore behind, the Moon lands' spire ahead.
  g.fillStyle = '#15204a';
  g.fillRect(0, 50, 30 - t * 20, 6);
  g.fillRect(W - t * 40, 46, 60, 10);
  g.fillRect(W + 10 - t * 40, 34, 3, 14);
  // The sea, its waves rolling past.
  g.fillStyle = '#20366e';
  g.fillRect(0, 56, W, H - 56);
  g.fillStyle = '#4a6fb0';
  for (let x = 0; x < W + 8; x += 8) {
    const y = 58 + Math.round(Math.sin(x * 0.3 + t * (still ? 0 : 9)) * 1.5);
    g.fillRect((x - ((t * 60) % 8)) | 0, y, 5, 1);
    g.fillRect(((x * 1.7 + 3 - t * 30) % W) | 0, 70 + ((x / 8) % 3) * 6, 4, 1);
  }
  // The ferry: a hull, a cabin, a lantern, the Keeper at the rail, bobbing.
  const bx = 34 + t * 70;
  const by = 50 + (still ? 0 : Math.round(Math.sin(t * 8) * 1));
  g.fillStyle = '#6b4a2e';
  g.fillRect(bx - 16, by + 2, 32, 5);
  g.fillRect(bx - 18, by + 1, 4, 3);
  g.fillStyle = '#efe6d0';
  g.fillRect(bx - 4, by - 5, 12, 7);
  g.fillStyle = '#f2d34c';
  g.fillRect(bx + 9, by - 9, 2, 3);
  // The Keeper: a red cap, a yellow coat.
  g.fillStyle = '#c8392c';
  g.fillRect(bx - 12, by - 6, 4, 2);
  g.fillStyle = '#f0c8a0';
  g.fillRect(bx - 12, by - 4, 4, 2);
  g.fillStyle = '#e8b93a';
  g.fillRect(bx - 12, by - 2, 4, 4);
}

function drawCart(g: CanvasRenderingContext2D, t: number, still: boolean): void {
  g.fillStyle = '#9fd6f0';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#e8eef4';
  for (let i = 0; i < 4; i++) {
    const x = ((i * 50 - t * 20) % (W + 40)) + 20;
    g.beginPath();
    g.moveTo(x - 30, 60);
    g.lineTo(x, 18 + i * 4);
    g.lineTo(x + 30, 60);
    g.fill();
  }
  g.fillStyle = '#6f9e4a';
  g.fillRect(0, 60, W, H - 60);
  g.fillStyle = '#c8a878';
  g.fillRect(0, 66, W, 6);
  const cx = 30 + t * 90;
  const cy = 60 + (still ? 0 : Math.round(Math.abs(Math.sin(t * 12))));
  g.fillStyle = '#8a6a46';
  g.fillRect(cx - 12, cy - 2, 24, 6);
  g.fillStyle = '#3b2416';
  g.fillRect(cx - 9, cy + 4, 4, 4);
  g.fillRect(cx + 5, cy + 4, 4, 4);
  g.fillStyle = '#c8392c';
  g.fillRect(cx - 4, cy - 9, 4, 2);
  g.fillStyle = '#f0c8a0';
  g.fillRect(cx - 4, cy - 7, 4, 2);
  g.fillStyle = '#e8b93a';
  g.fillRect(cx - 4, cy - 5, 4, 3);
}

/**
 * Play a ride's scene over the page, then call `arrive` (once). `skippable` shows Skip from
 * the start (a ride taken before); a tap on it arrives at once.
 */
export function playRide(
  kind: RideKind,
  skippable: boolean,
  reduceMotion: boolean,
  arrive: () => void,
): void {
  const root = document.createElement('div');
  root.className = 'ride-vignette';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', RIDE_TEXT[kind]);
  root.style.cssText =
    'position:fixed;inset:0;z-index:60;background:#0d0a1a;display:flex;align-items:center;justify-content:center;';
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  c.style.cssText = 'width:100%;max-height:100%;aspect-ratio:16/9;image-rendering:pixelated;';
  root.appendChild(c);
  const cap = document.createElement('div');
  cap.textContent = RIDE_TEXT[kind];
  cap.style.cssText =
    'position:absolute;left:16px;right:16px;bottom:24px;text-align:center;color:#fff8e8;font:600 16px/1.3 system-ui,sans-serif;text-shadow:0 1px 2px #000;';
  root.appendChild(cap);
  let done = false;
  let raf = 0;
  const finish = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    root.remove();
    arrive();
  };
  if (skippable) {
    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'btn';
    skip.textContent = RIDE_TEXT.skip;
    skip.style.cssText =
      'position:absolute;top:16px;right:16px;min-width:88px;min-height:44px;font-size:16px;';
    skip.addEventListener('click', finish);
    root.appendChild(skip);
  }
  document.body.appendChild(root);
  const g = c.getContext('2d');
  const total = reduceMotion ? RIDE.stillMs : RIDE.ms;
  const start = performance.now();
  const frame = (now: number) => {
    if (done) return;
    const t = Math.min(1, (now - start) / total);
    if (g) (kind === 'ferry' ? drawFerry : drawCart)(g, reduceMotion ? 0.5 : t, reduceMotion);
    if (t >= 1) finish();
    else raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  // A hidden tab has no frames: arrive on time anyway.
  setTimeout(finish, total + 1500);
}
