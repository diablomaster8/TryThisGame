import type { TileKind } from '../sim/types';
import { paintGround, type GroundSeason } from './ground';

/**
 * Paints the Grove floor off the main thread: the field is big enough that the full
 * painting takes a couple of seconds, which would freeze the first frames. The scene
 * shows a quick low-res painting until this one arrives.
 */
export interface GroundJob {
  id: number;
  seed: number;
  tiles: Record<string, TileKind>;
  /** H8: the season to paint for; absent means the base ground. */
  season?: GroundSeason;
}

export interface GroundResult {
  id: number;
  width: number;
  height: number;
  rgba: Uint8Array;
}

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<GroundJob>) => void) | null;
  postMessage(message: GroundResult, transfer: Transferable[]): void;
};

scope.onmessage = (e: MessageEvent<GroundJob>) => {
  const { id, seed, tiles, season } = e.data;
  const p = paintGround(seed, tiles, undefined, season ?? null);
  scope.postMessage({ id, width: p.width, height: p.height, rgba: p.rgba }, [p.rgba.buffer]);
};
