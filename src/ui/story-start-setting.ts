/**
 * Lane C round 11, helper "profiles" (R0627, CAMP-35): Settings → Story in a Hazel's Grove
 * Sandbox (a campaign slot with the story off). "Start Hazel's story" asks first, waits for
 * the story scripts, then sends `campaignStart`: the Grove, its Nubbins and its visitors stay
 * (sim/campaign.ts keeps `npcs` when there was no story), the letter comes to the gate, and
 * Moss waits on the hill as in any new story. Hidden everywhere else.
 */
import { PROFILE_TEXT } from '../config/strings-camp11-profiles';
import type { Game } from '../game';
import { currentSlot } from '../platform/storage';
import { loadStoryScripts } from '../sim/story-scenes';
import { confirmModal } from './confirm';
import { button, el } from './dom';

/** Is this world a Sandbox that can start the story? */
export function canStartStory(g: Game): boolean {
  return currentSlot().mode === 'campaign' && g.world.campaign === null && !g.world.edu;
}

export function mountStoryStartSetting(
  body: HTMLElement,
  game: () => Game | null,
): (g: Game) => void {
  const box = el('div', 'story-start');
  const text = el('span');
  text.append(
    el('strong', undefined, PROFILE_TEXT.storyOffHead),
    el('small', undefined, PROFILE_TEXT.storyOffHelp),
  );
  const status = el('p', 'help');
  status.setAttribute('role', 'status');
  const start = button(
    PROFILE_TEXT.startStory,
    () =>
      void confirmModal({
        title: PROFILE_TEXT.startStory,
        body: PROFILE_TEXT.startStoryAsk,
        confirm: PROFILE_TEXT.startStoryYes,
      }).then(async (ok) => {
        const g = game();
        if (!ok || !g || !canStartStory(g)) return;
        start.disabled = true;
        await loadStoryScripts().catch(() => undefined);
        g.send({ kind: 'campaignStart', flow: 'open' });
        status.textContent = PROFILE_TEXT.storyStarted;
      }),
    'btn btn-small btn-primary',
  );
  box.append(text, start);
  box.hidden = true;
  body.append(box, status);
  return (g: Game) => {
    box.hidden = !canStartStory(g);
    start.disabled = false;
    if (box.hidden) status.textContent = '';
  };
}
