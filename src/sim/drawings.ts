/**
 * R0743: a child's saved drawings, small PNG data URLs kept in the save. The UI sends
 * `saveDrawing`; this validates it and keeps only the newest `PAINT.maxDrawings`.
 */
import { PAINT } from '../config/tuning-more/kids-noticing';
import type { World } from './types';

const PREFIX = 'data:image/png;base64,';

export function saveDrawing(world: World, data: string): boolean {
  if (!data.startsWith(PREFIX) || data.length > PAINT.maxChars) return false;
  if (!/^[A-Za-z0-9+/=]+$/.test(data.slice(PREFIX.length))) return false;
  const list = (world.drawings ??= []);
  list.push(data);
  while (list.length > PAINT.maxDrawings) list.shift();
  return true;
}
