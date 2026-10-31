/**
 * TECH-66: on a phone, hand a save file or a Nubbin code to the system share sheet (Files,
 * Drive, Messages, AirDrop) instead of a download link, which iOS opens as text or buries in
 * Files. Anywhere the sheet cannot take a file, or on a desktop, it falls back to the
 * download. Closing the sheet is a choice, not a failure: nothing is downloaded then.
 */
import { downloadText } from './storage';

export type ShareResult = 'shared' | 'downloaded' | 'cancelled';

function phone(): boolean {
  try {
    return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  } catch {
    return false;
  }
}

function isAbort(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError';
}

/** Share a JSON file on a phone that can, else download it. */
export async function shareOrDownload(
  filename: string,
  text: string,
  title: string,
): Promise<ShareResult> {
  try {
    if (phone() && typeof navigator.share === 'function' && typeof File === 'function') {
      const file = new File([text], filename, { type: 'application/json' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title });
        return 'shared';
      }
    }
  } catch (err) {
    if (isAbort(err)) return 'cancelled';
    // Any other refusal (permissions, a too-large file): the download still works.
  }
  downloadText(filename, text);
  return 'downloaded';
}

/** Whether a text share sheet is on offer (a phone with the Web Share API). */
export function canShareText(): boolean {
  return phone() && typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/** Share a short text; false when the sheet failed or is not there (closing it counts as true). */
export async function shareText(text: string, title: string): Promise<boolean> {
  try {
    await navigator.share({ text, title });
    return true;
  } catch (err) {
    return isAbort(err);
  }
}
