import { terrainArrays, type TerrainArrays } from './terrain-shape';

/**
 * The terrain worker: samples the Grove's heightfield, its normals and the rock/dirt
 * blend (`terrain-shape.ts`) and posts the buffers back, transferred rather than copied.
 * On the page this held the 3D scene's constructor for about 0.3 s.
 */
export interface TerrainReply {
  arrays: TerrainArrays | null;
  error?: string;
}

self.onmessage = () => {
  try {
    const arrays = terrainArrays();
    const transfer = [
      arrays.position.buffer,
      arrays.normal.buffer,
      arrays.uv.buffer,
      arrays.blend.buffer,
      arrays.index.buffer,
    ];
    const reply: TerrainReply = { arrays };
    self.postMessage(reply, { transfer });
  } catch (err) {
    const reply: TerrainReply = { arrays: null, error: String(err) };
    self.postMessage(reply);
  }
};
