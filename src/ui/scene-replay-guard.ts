/**
 * Stops a story scene from playing twice. The dialogue tells the sim `sceneDone`, but
 * commands apply on the next frame, so at a low frame rate the HUD can still see the
 * finished scene at the head of the campaign queue. The guard holds that scene back
 * until the head changes (the sim has caught up, or the queue emptied).
 */
export class SceneReplayGuard {
  private finished: string | null = null;

  /** The dialogue just finished this scene and sent `sceneDone` for it. */
  markFinished(sceneId: string): void {
    this.finished = sceneId;
  }

  /** Whether the queue head may be played now. Call it every check, even with no head. */
  shouldPlay(head: string | undefined): boolean {
    if (head !== this.finished) this.finished = null;
    return head !== undefined && head !== this.finished;
  }
}
