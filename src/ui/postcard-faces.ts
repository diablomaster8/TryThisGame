/**
 * Lane E r10, R0705 (KIDS-37): Nova's postcard built around Ori's and Hana's faces, so a
 * child who can't read yet chooses between friends she can see. Each friend is a big portrait
 * card (the dialogue's pixel portrait, waving) that says hello in their language from its
 * clip ("shalom", "konnichiwa"); the course's quests show as a row of six stamps, filled as
 * each is done; and the word list is a 📚 picture button. The postcard text is read aloud.
 */
import '../kids-r10.css';
import { KIDS_R10_TEXT } from '../config/strings-kids-r10';
import type { LanguageCourse } from '../content/types';
import type { Game } from '../game';
import { playWord } from '../platform/lang-audio';
import { frameKey } from '../render/sprites/animations';
import { button, el } from './dom';
import { portraitFrame } from './dialogue';

/** Each friend: their speaker id in the scripts and the clip of their hello. */
export const POSTCARD_FRIENDS: Readonly<Record<string, { speaker: string; hello: string }>> = {
  hebrew: { speaker: 'ori', hello: 'he/shalom' },
  japanese: { speaker: 'hana', hello: 'ja/konnichiwa' },
};

/** Pure: the six stamps, true where that quest is done. */
export function stampsFor(quests: readonly string[], done: (q: string) => boolean): boolean[] {
  return quests.map((q) => done(q));
}

/** A friend's face as the dialogue draws it (happy), on a canvas CSS scales up. */
function face(g: Game, speaker: string): HTMLCanvasElement {
  const c = el('canvas', 'postcard-face');
  c.width = 64;
  c.height = 64;
  try {
    const { sheet, key } = portraitFrame(speaker, g, 'happy');
    const rect =
      sheet?.frames.get(key) ??
      sheet?.frames.get(frameKey('idle', 'front', 0)) ??
      sheet?.frames.values().next().value;
    const ctx = c.getContext('2d');
    if (sheet && rect && ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        sheet.texture.image as HTMLCanvasElement,
        rect.x,
        rect.y,
        rect.w,
        rect.h,
        0,
        0,
        64,
        64,
      );
    }
  } catch {
    // The card still names the friend and waves.
  }
  c.setAttribute('aria-hidden', 'true');
  return c;
}

export interface FriendCardParts {
  name: string;
  language: string;
  started: boolean;
  stamps: boolean[];
  onMeet: () => void;
  onWords: () => void;
}

/** One friend's card: the face (tap to meet or visit), the hello, the stamps and 📚. */
export function friendCard(g: Game, course: LanguageCourse, p: FriendCardParts): HTMLElement {
  const T = KIDS_R10_TEXT.postcard;
  const who = POSTCARD_FRIENDS[course.id];
  const card = el('div', 'postcard-friend');
  const meet = button('', p.onMeet, 'btn btn-primary postcard-meet');
  const pic = el('span', 'postcard-pic');
  if (who) pic.appendChild(face(g, who.speaker));
  pic.appendChild(el('span', 'postcard-wave', '👋'));
  meet.append(
    pic,
    el('strong', undefined, `🤝 ${p.started ? T.visit(p.name) : T.meet(p.name)}`),
    el('small', undefined, p.language),
  );
  meet.setAttribute('aria-label', p.started ? T.visit(p.name) : T.meet(p.name));
  const hello = button(
    `🔊 ${T.hello}`,
    () => {
      if (who) playWord(who.hello);
      pic.classList.remove('postcard-waving');
      void pic.offsetWidth;
      pic.classList.add('postcard-waving');
    },
    'btn postcard-hello',
  );
  hello.setAttribute('aria-label', T.helloLabel(p.name));
  const stamps = el('div', 'postcard-stamps');
  const done = p.stamps.filter(Boolean).length;
  stamps.setAttribute('role', 'img');
  stamps.setAttribute('aria-label', T.stamps(done, p.stamps.length));
  for (const s of p.stamps)
    stamps.appendChild(el('span', s ? 'postcard-stamp done' : 'postcard-stamp', s ? '★' : ''));
  const words = button(`📚 ${T.words}`, p.onWords, 'btn postcard-words');
  const row = el('div', 'postcard-row');
  row.append(hello, words);
  card.append(meet, stamps, row);
  return card;
}

/** Say hello from each friend in turn, after the postcard has been read. */
export function greetAll(courses: readonly LanguageCourse[], gapMs: number): void {
  courses.forEach((c, i) => {
    const who = POSTCARD_FRIENDS[c.id];
    if (who) window.setTimeout(() => playWord(who.hello), i * gapMs);
  });
}
