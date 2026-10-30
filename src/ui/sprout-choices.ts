/**
 * R0677 (KIDS-09): story choices and lesson options a child who cannot read can still make.
 * In the sprout band each button gets a big coloured number dot and an icon (the content's
 * `icon`, or a number), fills the row at 72 px or more, says its words on a hold, and the set
 * is read out once as it appears: "You can say: one, …. Two, …". A tap still picks.
 */
import { SPROUT_CHOICE_TEXT } from '../config/strings-kids';
import { EDU_VOICE } from '../config/tuning-kids';
import { numberWord, spoken } from './edu-voice';
import { el } from './dom';
import { speakLine } from './lesson';

/** The line read as the choices appear. Pure, for the tests. */
export function choicesSpeech(labels: readonly string[]): string {
  const items = labels.map((l, i) => SPROUT_CHOICE_TEXT.item(numberWord(i + 1), spoken(l)));
  return [SPROUT_CHOICE_TEXT.intro, ...items].join(' ');
}

/** The icon a choice shows: its own, or its place as a number. */
export function choiceIcon(icon: string | undefined, i: number): string {
  return icon ?? SPROUT_CHOICE_TEXT.numbers[i] ?? String(i + 1);
}

/** Dress already-built choice buttons for the sprout band and read the set out. */
export function sproutChoices(
  buttons: readonly HTMLButtonElement[],
  items: readonly { label: string; icon?: string | undefined }[],
  readAloud: boolean,
): void {
  buttons.forEach((b, i) => {
    const item = items[i];
    if (!item) return;
    b.classList.add('sprout-choice', `sprout-choice-${i % 4}`);
    const dot = el('span', 'sprout-choice-dot', String(i + 1));
    dot.setAttribute('aria-hidden', 'true');
    const icon = el('span', 'sprout-choice-icon', choiceIcon(item.icon, i));
    icon.setAttribute('aria-hidden', 'true');
    b.prepend(dot, icon);
    holdToSay(b, item.label);
  });
  if (readAloud && items.length > 0) speakLine(choicesSpeech(items.map((x) => x.label)));
}

/** A hold says the option; the click that ends the hold does not pick it. */
function holdToSay(b: HTMLButtonElement, label: string): void {
  let timer = 0;
  let held = false;
  const cancel = () => {
    if (timer) window.clearTimeout(timer);
    timer = 0;
  };
  b.addEventListener('pointerdown', () => {
    held = false;
    cancel();
    timer = window.setTimeout(() => {
      timer = 0;
      held = true;
      speakLine(spoken(label));
    }, EDU_VOICE.holdMs);
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel'] as const)
    b.addEventListener(ev, cancel);
  b.addEventListener(
    'click',
    (e) => {
      if (!held) return;
      held = false;
      e.stopImmediatePropagation();
      e.preventDefault();
    },
    true,
  );
  b.addEventListener('contextmenu', (e) => e.preventDefault());
}
