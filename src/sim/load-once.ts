/**
 * A load that runs once and is shared by every caller, but is never remembered when it
 * fails: a chunk that could not be fetched (offline, or a deploy removed it) is fetched
 * again on the next call instead of failing for the rest of the session.
 */
export function loadOnce<T>(load: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | null = null;
  return () => {
    if (pending) return pending;
    const p = load();
    pending = p;
    p.catch(() => {
      if (pending === p) pending = null;
    });
    return p;
  };
}
