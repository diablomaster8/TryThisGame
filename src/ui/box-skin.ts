import type { LookDef } from '../config/campaign-look';
import type { SceneStage } from '../config/story';
import { STORY_U4_TEXT } from '../config/strings';
import { CG4_U4 } from '../config/tuning-u4';
import { stageFlags, type StageFlags } from '../render/scene-stage';
import type { World } from '../sim/types';

/**
 * The dialogue box's skin per campaign (K20, campaign graphics 4). The look names a `box`
 * (CAMPAIGN_LOOK); this puts `box-<name>` on the dialogue root, where style.css draws the
 * frame and corner by shape: Logged In's terminal bevel and caret, the Beetle Road's
 * stamped ledger corner, Dawn & Dusk's half sun or half moon, the Hundred Days' day tally.
 * The one ornament element is a child of the box and ignores the pointer. Hazel's Grove has
 * no skin and keeps the plain box. Render-only.
 */
const CLASS = /(^|\s)box-\S+/g;

export function applyBoxSkin(
  root: HTMLElement,
  world: World,
  stage: SceneStage,
  resolve: (flags: StageFlags) => { key: string; look: LookDef },
): void {
  const flags = stageFlags(world, stage);
  const box = flags.campaign === 'hazel' ? undefined : resolve(flags).look.box;
  root.className = root.className.replace(CLASS, '');
  const holder = root.querySelector('.dialogue-box');
  let orn = holder?.querySelector<HTMLElement>(':scope > .box-orn') ?? null;
  if (!box || !holder) {
    orn?.remove();
    return;
  }
  root.classList.add(`box-${box}`);
  if (!orn) {
    orn = document.createElement('div');
    orn.className = 'box-orn';
    orn.setAttribute('aria-hidden', 'true');
    holder.appendChild(orn);
  }
  orn.replaceChildren();
  if (box === 'terminal') orn.textContent = '\u258c';
  if (box === 'tally') {
    const days = Math.min(CG4_U4.box.tallyMax, (flags.storyChapter ?? 0) + 1);
    orn.title = STORY_U4_TEXT.tally(days);
    for (let i = 0; i < days; i++) {
      const s = document.createElement('i');
      if (i % 5 === 4) s.className = 'slash';
      if (i % 5 === 0 && i > 0) s.className = 'gap';
      orn.appendChild(s);
    }
  }
}
