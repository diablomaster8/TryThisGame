import { placeGrass, type GrassPlacement } from '../samples/grass-place';
import { groveGrassField } from './grass-field';

/**
 * The grass worker: scatters the Grove's tufts (height sampling, the keep-out tests and
 * the instance matrices) and posts the buffers back, transferred rather than copied. On
 * the page this held the 3D scene's constructor while it ran.
 */
export interface GrassReply {
  placement: GrassPlacement | null;
  error?: string;
}

self.onmessage = () => {
  try {
    const placement = placeGrass(groveGrassField());
    const transfer = [...placement.matrices, ...placement.colours].map((a) => a.buffer);
    const reply: GrassReply = { placement };
    self.postMessage(reply, { transfer });
  } catch (err) {
    const reply: GrassReply = { placement: null, error: String(err) };
    self.postMessage(reply);
  }
};
