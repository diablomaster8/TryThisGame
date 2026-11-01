import type { Piece } from './piece';
import { ROOTWAYS } from './rootways';
import { CLOISTER } from './cloister';
import { STORY_BEETLE } from './story-beetle';
import { SANDGLASS } from './sandglass';
import { FROSTBELL } from './frostbell';
import { GLOOM } from './gloom';

/**
 * Every tileset's pieces, by tileset id (R0144): the Rootways (Act I), the Cloister
 * Gardens (Act II, lane B r9), the Sandglass Ruins, the Frostbell Caves and the Gloom
 * (Acts III–V, lane B r10). An unknown tileset falls back to the Rootways.
 */
export const PIECES: Readonly<Record<string, readonly Piece[]>> = {
  rootways: ROOTWAYS,
  cloister: CLOISTER,
  sandglass: SANDGLASS,
  frostbell: FROSTBELL,
  gloom: GLOOM,
};

/** Authored story pieces (R0197), named by story floors, never drawn from a tileset pool. */
export const STORY_PIECES: readonly Piece[] = [...STORY_BEETLE];

/**
 * R0210: pieces made in the debug panel's editor, tried on new floors of their tileset.
 * Dev-only runtime state: never saved, and empty in normal play.
 */
const devPieces = new Map<string, Piece>();

export function setDevPiece(p: Piece | null, id?: string): void {
  if (p) devPieces.set(p.id, p);
  else if (id) devPieces.delete(id);
  else devPieces.clear();
}

export function devPieceList(): readonly Piece[] {
  return [...devPieces.values()];
}

export function piecesFor(tileset: string): readonly Piece[] {
  const base = PIECES[tileset] ?? ROOTWAYS;
  if (devPieces.size === 0) return base;
  const mine = [...devPieces.values()].filter((p) => p.tileset === tileset);
  return mine.length ? [...base, ...mine] : base;
}

/** Any piece by id: a tileset's, a story's, or one from the editor. */
export function pieceById(id: string): Piece | undefined {
  return (
    devPieces.get(id) ??
    STORY_PIECES.find((p) => p.id === id) ??
    Object.values(PIECES)
      .flat()
      .find((p) => p.id === id)
  );
}

export * from './piece';
