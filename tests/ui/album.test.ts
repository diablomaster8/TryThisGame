import { describe, expect, it } from 'vitest';
import { prunable, type AlbumPhoto } from '../../src/platform/photo-album';

const photo = (id: number, kept = false): AlbumPhoto => ({
  id,
  atWallMs: id * 1000,
  nubbinIds: [],
  caption: '',
  thumb: '',
  full: '',
  ...(kept ? { kept: true } : {}),
});

describe('R0425 (LOOK-57) photo album', () => {
  it('drops photos past the newest few unless kept', () => {
    const all = Array.from({ length: 30 }, (_, i) => photo(i + 1, i === 2));
    const gone = prunable(all, 24);
    expect(gone.sort((a, b) => a - b)).toEqual([1, 2, 4, 5, 6]);
    expect(prunable(all.slice(0, 10), 24)).toEqual([]);
  });
});
