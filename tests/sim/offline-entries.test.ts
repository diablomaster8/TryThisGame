import { describe, expect, it } from 'vitest';
import { chunkStem } from '../../src/ui/offline-entries';

describe('R0520 offline entries', () => {
  it('asks the worker for a chunk stem under the deploy base', () => {
    expect(chunkStem('atlas-catalogue', '/grove/', 'https://x.github.io')).toBe(
      'https://x.github.io/grove/assets/atlas-catalogue-',
    );
    expect(chunkStem('neopia-catalogue', '/', 'http://localhost:5197')).toBe(
      'http://localhost:5197/assets/neopia-catalogue-',
    );
  });
});
