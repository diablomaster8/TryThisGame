import { SCENE_STAGES } from '../config/scene-stages';
import type { SceneStage } from '../config/story';
import { TITLE_CARD_TEXT } from '../config/strings';
import { E_STAGES } from '../config/tuning-e';
import { CG2_U } from '../config/tuning-u';
import { STAGE4 } from '../config/tuning-f4';
import type { Game } from '../game';
import { stageFlags } from '../render/scene-stage';
import { chapterDef } from '../sim/campaign';
import type { PlayScene } from '../sim/story-scenes';
import { chapterTitle, storylineOf } from '../sim/storyline';
import type { World } from '../sim/types';
import { ChapterOffer, chapterShot } from './chapter-photo';
import type { Dialogue } from './dialogue';
import { ItemCard } from './item-card';
import { Postcard } from './postcard';

/**
 * What the story dialogue shows besides its own box (campaign graphics 2, package u):
 * the item card (M9), the chapter postcard hold (N1) and the chapter photo offer (N6).
 * The dialogue calls these hooks; everything here is render-only and reads the world.
 */
export interface DialogueHooks {
  /** A Grove scene starts. Return true to hold its first line; call `release` when done. */
  open?(id: string, scene: PlayScene, release: () => void): boolean;
  /** The first line is up (after any hold). */
  shown?(): void;
  /** A tap during the hold. */
  skip?(): void;
  /** The scene ended (`id` null when it was dropped); `external` for a side save's scene. */
  close?(id: string | null, external: boolean): void;
}

/** The scene's resolved stage: the same merge the renderers use (render/scene-stage.ts). */
function stageOf(id: string, scene: PlayScene): SceneStage {
  return { ...E_STAGES[id], ...SCENE_STAGES[id], ...scene.stage };
}

interface ChapterScenes {
  opening: string;
  closing: string;
}

function chapterScenes(world: World): ChapterScenes | null {
  const c = world.campaign;
  if (!c) return null;
  const s = storylineOf(c);
  if (s) {
    const def = s.chapters.find((ch) => ch.n === c.chapter);
    return def ? { opening: def.opening.id, closing: def.closing.id } : null;
  }
  const def = chapterDef(c.chapter);
  return def ? { opening: def.opening, closing: def.closing } : null;
}

const isScene = (id: string, base: string): boolean => id === base || id.startsWith(`${base}-`);

export class StoryUi {
  private readonly card: ItemCard;
  private readonly postcard: Postcard;
  /** K15: the held letterbox of a grave scene. */
  private readonly letterbox: Postcard;
  private readonly offer: ChapterOffer;
  private item: string | null = null;
  private wait = 0;
  private readonly postcarded = new Set<string>();

  constructor(
    private readonly dialogue: Dialogue,
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    const root = dialogue.root;
    this.card = new ItemCard((root.querySelector('.dialogue-box') as HTMLElement | null) ?? root);
    this.postcard = new Postcard(root);
    this.letterbox = new Postcard(root, true);
    this.offer = new ChapterOffer(
      parent,
      () =>
        dialogue.isOpen ||
        document.querySelector(
          '.modal:not([hidden]), .sheet:not([hidden]), .celebrate:not([hidden])',
        ) !== null,
      () => this.game()?.reduceMotion ?? false,
    );
  }

  get hooks(): DialogueHooks {
    return {
      open: (id, scene, release) => this.open(id, scene, release),
      shown: () => this.shown(),
      skip: () => this.stopPostcard(),
      close: (id, external) => this.close(id, external),
    };
  }

  private open(id: string, scene: PlayScene, release: () => void): boolean {
    const g = this.game();
    if (!g) return false;
    const stage = stageOf(id, scene);
    this.item = stage.item ?? null;
    this.setGrave(stage.grave === true, g.reduceMotion);
    const flags = stageFlags(g.world, stage);
    const key = `${flags.campaign}:${flags.chapter}`;
    const opens = chapterScenes(g.world)?.opening;
    const opening = !!opens && isScene(id, opens);
    let hold = stage.hold;
    if (hold === undefined && opening && !this.postcarded.has(key)) hold = CG2_U.postcard.holdS;
    if (opening) this.postcarded.add(key);
    if (!hold || hold <= 0) return false;
    this.whenDrawn(g, () => this.postcard.begin(hold, g.reduceMotion, release));
    return true;
  }

  /** Run `go` once the view has drawn its first frames (Full 3D builds first), or at once. */
  private whenDrawn(g: Game, go: () => void): void {
    window.clearInterval(this.wait);
    if (!g.scene3d || g.scene3d.loadState().done) return go();
    const started = performance.now();
    this.wait = window.setInterval(() => {
      if (!g.scene3d?.loadState().done && performance.now() - started < 60000) return;
      window.clearInterval(this.wait);
      go();
    }, 150);
  }

  private stopPostcard(): void {
    window.clearInterval(this.wait);
    this.postcard.end();
  }

  private shown(): void {
    if (this.item) this.card.show(this.item, this.game()?.reduceMotion ?? false);
    else this.card.hide();
  }

  /**
   * K15: a grave scene holds the letterbox for its whole length and hides the HUD
   * (`html.story-grave`, style.css). There is no auto-advance to slow yet; a future one
   * multiplies its delay by `STAGE4.grave.delayK` while this class is on.
   */
  private setGrave(on: boolean, reduce: boolean): void {
    document.documentElement.classList.toggle('story-grave', on);
    if (on) this.letterbox.hold(STAGE4.grave.bar, reduce);
    else this.letterbox.end();
  }

  private close(id: string | null, external: boolean): void {
    this.setGrave(false, true);
    this.card.hide();
    this.stopPostcard();
    const g = this.game();
    if (!g || !id || external) return;
    const chapter = chapterScenes(g.world);
    if (!chapter || !isScene(id, chapter.closing)) return;
    const c = g.world.campaign;
    const title = c ? chapterTitle(c, c.chapter) : null;
    const canvas = g.captureFrame(CG2_U.photo.w * 3, CG2_U.photo.h * 3);
    if (!c || !title || !canvas) return;
    const flags = stageFlags(g.world, null);
    const shot = {
      canvas,
      chapter: c.chapter,
      title,
      campaign: TITLE_CARD_TEXT.campaigns[flags.half ?? flags.campaign] ?? flags.campaign,
    };
    chapterShot.set(shot);
    this.offer.offer(shot);
  }
}
