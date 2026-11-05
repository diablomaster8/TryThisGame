import { STORY_REGIONS, type StoryRegionId } from '../config/story-regions';
import { C11_TEXT } from '../config/strings';
import { linePitch } from '../content/pitches';
import { beatAllowed } from '../sim/camp11';
import { lineRefusal } from '../sim/story-book';
import { sideStory, storylineById } from '../sim/story-scenes';
import type { Command, SimEvent, World } from '../sim/types';
import { confirmModal } from './confirm';

/**
 * Lane C round 11, helper ui (R0611): on first walking into a questline's region the line is
 * pitched once, as a card with its tagline and a Questline tag, with Begin and Not now. It is
 * only a question: Not now changes nothing, and the line can still be begun from Journal →
 * Lines. Each line is pitched once, ever (`questBook.pitched`), and never when it cannot begin (too early,
 * running, the quiet chapters). The sim hears only the ordinary `storylineStart` command.
 */
const pitched = new Set<string>();

export function pitchLines(
  events: readonly SimEvent[],
  world: World,
  send: (cmd: Command) => void,
): void {
  for (const e of events) {
    if (e.kind !== 'storyRegionEntered') continue;
    const region = STORY_REGIONS[e.region as StoryRegionId];
    if (!region) continue;
    for (const id of region.lines) {
      const s = storylineById(id);
      if (
        !s ||
        pitched.has(id) ||
        world.questBook?.pitched?.includes(id) ||
        world.lines?.[id] ||
        lineRefusal(world, id) !== null
      )
        continue;
      pitched.add(id);
      send({ kind: 'linePitched', id });
      void confirmModal({
        title: `${C11_TEXT.pitchTag} · ${s.title}`,
        body: linePitch(s) ?? s.tagline,
        confirm: C11_TEXT.pitchBegin,
        cancel: C11_TEXT.pitchLater,
      }).then((ok) => {
        if (ok) send({ kind: 'storylineStart', id });
      });
      return;
    }
  }
}

/** Sim times of the arrival beats shown this session, for the cap. */
const beats: number[] = [];

/**
 * R0651: the beat before an offer card, in words: "Fern waves you over." At most a few an hour,
 * never within 10 s of another, never over a scene or a panel (`busy`), and quiet under reduced
 * motion's own rules since it is only a toast. A giver who is not in the story's cast is "Someone".
 */
export function arrivalBeat(
  events: readonly SimEvent[],
  world: World,
  busy: boolean,
  toast: (text: string) => void,
): void {
  for (const e of events) {
    if (e.kind !== 'questOffered') continue;
    if (!beatAllowed(beats, world.timeMs, busy)) return;
    beats.push(world.timeMs);
    const who = sideStory(e.quest)?.speakers.find((s) => s.kind !== 'keeper')?.name;
    toast(who ? C11_TEXT.beat(who) : C11_TEXT.beatSomeone);
    return;
  }
}
