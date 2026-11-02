/**
 * R0507 (TECH-64): `?audiolab` (dev only). Renders every sound effect through the real bus
 * graph offline, measures its peak and an approximate loudness (K-weighted mean square, ungated,
 * so a short effect reads quieter than its peak suggests), and lists them against the targets
 * in `SFX_TARGETS`. Songs are not rendered here yet: the score scheduler is tied to the live clock.
 */
import audioSrc from '../platform/audio.ts?raw';
import { renderSoundOffline, type SoundName } from '../platform/audio';
import { SFX_TARGETS } from '../config/tuning-r8d-audio';

/** Every name in the SoundName union, read from the source so the list never goes stale. */
export function soundNamesFromSource(src: string): string[] {
  const start = src.indexOf('export type SoundName =');
  const body = src.slice(start, src.indexOf(';', start));
  return [...body.matchAll(/\|\s*'([A-Za-z]+)'/g)].map((m) => m[1]!);
}

type Biquad = [number, number, number, number, number];

/** BS.1770 K-weighting: a high shelf then a 38 Hz high pass, for any sample rate. */
function kWeight(x: Float32Array, fs: number): Float32Array {
  const shelf = (): Biquad => {
    const f0 = 1681.974450955533;
    const G = 3.999843853973347;
    const Q = 0.7071752369554196;
    const K = Math.tan((Math.PI * f0) / fs);
    const Vh = Math.pow(10, G / 20);
    const Vb = Math.pow(Vh, 0.4996667741545416);
    const a0 = 1 + K / Q + K * K;
    return [
      (Vh + (Vb * K) / Q + K * K) / a0,
      (2 * (K * K - Vh)) / a0,
      (Vh - (Vb * K) / Q + K * K) / a0,
      (2 * (K * K - 1)) / a0,
      (1 - K / Q + K * K) / a0,
    ];
  };
  const hp = (): Biquad => {
    const f0 = 38.13547087602444;
    const Q = 0.5003270373238773;
    const K = Math.tan((Math.PI * f0) / fs);
    const a0 = 1 + K / Q + K * K;
    return [1, -2, 1, (2 * (K * K - 1)) / a0, (1 - K / Q + K * K) / a0];
  };
  const run = (inp: Float32Array, c: Biquad): Float32Array => {
    const out = new Float32Array(inp.length);
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    for (let i = 0; i < inp.length; i++) {
      const v = inp[i]!;
      const y = c[0] * v + c[1] * x1 + c[2] * x2 - c[3] * y1 - c[4] * y2;
      x2 = x1;
      x1 = v;
      y2 = y1;
      y1 = y;
      out[i] = y;
    }
    return out;
  };
  return run(run(x, shelf()), hp());
}

export interface Level {
  peakDb: number;
  lufs: number;
}

/** Peak (dBFS) and loudness over the sound's own length (trailing silence trimmed). */
export function measure(x: Float32Array, fs: number): Level | null {
  let peak = 0;
  let last = 0;
  for (let i = 0; i < x.length; i++) {
    const a = Math.abs(x[i]!);
    if (a > peak) peak = a;
    if (a > 1e-4) last = i;
  }
  if (peak < 1e-5) return null;
  const y = kWeight(x.subarray(0, last + 1), fs);
  let ms = 0;
  for (let i = 0; i < y.length; i++) ms += y[i]! * y[i]!;
  ms /= Math.max(1, y.length);
  return { peakDb: 20 * Math.log10(peak), lufs: -0.691 + 10 * Math.log10(ms || 1e-12) };
}

export function targetPeak(name: string): number {
  return SFX_TARGETS.ticks.includes(name) ? SFX_TARGETS.tickPeakDb : SFX_TARGETS.peakDb;
}

export async function runAudioLab(root: HTMLElement): Promise<void> {
  root.textContent = 'Rendering sounds...';
  const rows: string[] = [];
  const peaks: number[] = [];
  for (const name of soundNamesFromSource(audioSrc)) {
    const x = await renderSoundOffline(name as SoundName, 2.5);
    const m = x ? measure(x, 44100) : null;
    if (m) peaks.push(m.peakDb);
    const t = targetPeak(name);
    const off = m ? m.peakDb - t : 0;
    const ok = m ? Math.abs(off) <= SFX_TARGETS.tolerance : true;
    rows.push(
      `<tr${ok ? '' : ' style="background:#fdd"'}><td>${name}</td><td>${m ? m.peakDb.toFixed(1) : 'silent'}</td>` +
        `<td>${m ? m.lufs.toFixed(1) : ''}</td><td>${t}</td><td>${m ? (ok ? 'ok' : off > 0 ? 'loud' : 'quiet') : ''}</td></tr>`,
    );
  }
  root.innerHTML =
    '<h1>Audio lab</h1><p>Effect peaks and approximate LUFS through the real bus and compressor. ' +
    'Songs are not measured here yet. Median peak: ' + (peaks.sort((a, b) => a - b)[peaks.length >> 1] ?? 0).toFixed(1) + ' dBFS.</p><table border="1" cellpadding="4" style="border-collapse:collapse">' +
    '<tr><th>sound</th><th>peak dBFS</th><th>LUFS</th><th>target peak</th><th>verdict</th></tr>' +
    rows.join('') +
    '</table>';
  (window as unknown as { audioLabRows: number }).audioLabRows = rows.length;
}
