/**
 * C8: the Hush's ring of put-out lanterns and its colossus start when the scene's first
 * line shows, not when the scene is queued (a postcard hold or a slow fade can sit between
 * the two). The dialogue box is the one place that knows; this reads whether it is open.
 * Render-only: it never touches the world. Without a DOM (tests) the scene's own clock runs.
 */
export class LineClock {
  private id: string | null = null;
  private t = -1;

  /** Seconds since the scene's first line appeared, or -1 while it has not. */
  tick(id: string | null, sceneT: number, dt: number): number {
    if (id !== this.id) {
      this.id = id;
      this.t = -1;
    }
    if (this.t < 0) {
      if (lineShowing()) this.t = 0;
    } else this.t += dt;
    return typeof document === 'undefined' ? sceneT : this.t;
  }
}

function lineShowing(): boolean {
  if (typeof document === 'undefined') return true;
  const box = document.querySelector('.dialogue') as HTMLElement | null;
  return !!box && !box.hidden;
}
