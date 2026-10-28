import type { Piece } from './piece';
import { ROOTWAYS } from './rootways';

/**
 * Every tileset's pieces, by tileset id (R0144). Act I's Rootways is the only one drawn so
 * far; the other acts fall back to it until their sets are authored (R0145).
 */
export const PIECES: Readonly<Record<string, readonly Piece[]>> = {
  rootways: ROOTWAYS,
};

export function piecesFor(tileset: string): readonly Piece[] {
  return PIECES[tileset] ?? ROOTWAYS;
}

export * from './piece';
