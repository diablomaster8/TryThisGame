import { afterEach, describe, expect, it, vi } from 'vitest';

const downloads: string[] = [];
vi.mock('../../src/platform/storage', () => ({
  downloadText: (name: string) => void downloads.push(name),
}));
const { shareOrDownload, canShareText } = await import('../../src/platform/share');

/** TECH-66: the share sheet on a phone that can take the file, the download otherwise. */
describe('share or download', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    downloads.length = 0;
  });
  const stub = (coarse: boolean, share?: (d: unknown) => Promise<void>, files = true) => {
    vi.stubGlobal('matchMedia', () => ({ matches: coarse }));
    vi.stubGlobal('navigator', share ? { share, canShare: () => files } : {});
  };

  it('a phone that can share files gets the sheet with the file attached', async () => {
    const seen: unknown[] = [];
    stub(true, async (d) => void seen.push(d));
    expect(await shareOrDownload('g.json', '{}', 't')).toBe('shared');
    const sent = seen[0] as { files: File[] };
    expect(sent.files[0]?.name).toBe('g.json');
    expect(downloads).toEqual([]);
    expect(canShareText()).toBe(true);
  });

  it('desktop, no share API, or no file sharing: the download', async () => {
    stub(false, async () => undefined);
    expect(await shareOrDownload('a.json', '{}', 't')).toBe('downloaded');
    stub(true);
    expect(await shareOrDownload('b.json', '{}', 't')).toBe('downloaded');
    stub(true, async () => undefined, false);
    expect(await shareOrDownload('c.json', '{}', 't')).toBe('downloaded');
    expect(downloads).toEqual(['a.json', 'b.json', 'c.json']);
    stub(false, async () => undefined);
    expect(canShareText()).toBe(false);
  });

  it('closing the sheet downloads nothing; any other failure still downloads', async () => {
    const abort = Object.assign(new Error('x'), { name: 'AbortError' });
    stub(true, () => Promise.reject(abort));
    expect(await shareOrDownload('a.json', '{}', 't')).toBe('cancelled');
    stub(true, () => Promise.reject(new Error('NotAllowed')));
    expect(await shareOrDownload('b.json', '{}', 't')).toBe('downloaded');
    expect(downloads).toEqual(['b.json']);
  });
});
