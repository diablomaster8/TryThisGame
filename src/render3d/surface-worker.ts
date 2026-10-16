import { paintJob, type PaintJob, type PaintedBytes } from '../samples/surface-paint';

/**
 * The texture worker: paints one of the Grove's surfaces or cards per request
 * (`surface-paint.ts`) and posts the bytes back, transferred rather than copied. Painting
 * all ten on the page held the 3D scene's constructor for about a second.
 */
export interface PaintRequest {
  id: number;
  job: PaintJob;
}

export interface PaintReply {
  id: number;
  bytes: PaintedBytes | null;
  error?: string;
}

self.onmessage = (e: MessageEvent<PaintRequest>) => {
  const { id, job } = e.data;
  try {
    const bytes = paintJob(job);
    const transfer = [bytes.albedo.buffer, ...(bytes.normal ? [bytes.normal.buffer] : [])];
    const reply: PaintReply = { id, bytes };
    self.postMessage(reply, { transfer });
  } catch (err) {
    const reply: PaintReply = { id, bytes: null, error: String(err) };
    self.postMessage(reply);
  }
};
