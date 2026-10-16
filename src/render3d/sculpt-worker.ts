import { sculptSurface, speciesSurfaces } from '../samples/species';
import { specForKey } from './looks';

/**
 * The sculpt worker: marches one surface of one look off the main thread. The page posts
 * a look key and a surface index; the worker rebuilds the spec from the key (specs hold
 * functions, so they cannot travel), marches that surface and posts the vertex arrays
 * back, transferred rather than copied.
 */
export interface SculptRequest {
  job: number;
  key: string;
  index: number;
}

export interface SculptReply {
  job: number;
  attrs: Array<{ name: string; array: Float32Array; itemSize: number }>;
  error?: string;
}

self.onmessage = (e: MessageEvent<SculptRequest>) => {
  const { job, key, index } = e.data;
  try {
    const spec = specForKey(key);
    const surface = speciesSurfaces(spec)[index];
    if (!surface) throw new Error(`no surface ${index} on ${key}`);
    const geo = sculptSurface(spec, surface);
    const attrs: SculptReply['attrs'] = [];
    for (const [name, attr] of Object.entries(geo.attributes)) {
      attrs.push({ name, array: attr.array as Float32Array, itemSize: attr.itemSize });
    }
    const reply: SculptReply = { job, attrs };
    self.postMessage(reply, { transfer: attrs.map((a) => a.array.buffer) });
  } catch (err) {
    const reply: SculptReply = { job, attrs: [], error: String(err) };
    self.postMessage(reply);
  }
};
