/**
 * R0677 (KIDS-09): story choices and lesson options a child who cannot read can still make.
 * In the sprout band each button gets a big coloured number dot and a picture (the content's
 * `icon`, else a picture from its words via `config/choice-icons.ts`, else its number), fills
 * the row at 72 px or more, says its words on a long press, and the set is read out as it
 * appears, one speech call per option ("You can say: one, …" then "two, …"), each button
 * lit while it is said. A tap still picks.
 */
import { SPROUT_CHOICE_TEXT } from '../config/strings-kids';
import { EDU_VOICE } from '../config/tuning-kids';
import { resolveChoiceIcons } from '../config/choice-icons';
import { numberWord, spoken } from './edu-voice';
import { el } from './dom';
import { speakLine } from './lesson';
import { isAudioUnlocked } from '../platform/audio';
import { isVoiceOn } from '../platform/voices';

/** The line read as the choices appear, as one string. Pure, for the tests. */
export function choicesSpeech(labels: readonly string[]): string {
  return choicesSpeechParts(labels).join(' ');
}

/** The same, one part per option: the intro rides on the first. Pure, for the tests. */
export function choicesSpeechParts(labels: readonly string[]): string[] {
  return labels.map((l, i) => {
    const item = SPROUT_CHOICE_TEXT.item(numberWord(i + 1), spoken(l));
    return i === 0 ? `${SPROUT_CHOICE_TEXT.intro} ${item}` : item;
  });
}

/** The icon a lone choice shows: its own, or its place as a number. */
export function choiceIcon(icon: string | undefined, i: number): string {
  return icon ?? SPROUT_CHOICE_TEXT.numbers[i] ?? String(i + 1);
}

/** The speech hook, swappable in tests. */
type Say = (text: string, opts?: { onDone?: () => void }) => void;

/** A story choice is read on the story switch. */
const sayStory: Say = (text, opts) => {
  speakLine(text, { ...opts, channel: 'story' });
};

/**
 * Read a choice set out, one call per option, each starting when the last is done; `onItem`
 * hears which option is being said (-1 at the end). Stops if `alive` turns false.
 */
export function speakChoiceSet(
  labels: readonly string[],
  say: Say = sayStory,
  onItem: (i: number) => void = () => undefined,
  alive: () => boolean = () => true,
): void {
  const parts = choicesSpeechParts(labels);
  const next = (i: number): void => {
    if (!alive()) return onItem(-1);
    if (i >= parts.length) return onItem(-1);
    onItem(i);
    say(parts[i]!, { onDone: () => next(i + 1) });
  };
  next(0);
}

/** Dress already-built choice buttons for the sprout band and read the set out. */
export function sproutChoices(
  buttons: readonly HTMLButtonElement[],
  items: readonly { label: string; icon?: string | undefined }[],
  readAloud: boolean,
): void {
  const icons = resolveChoiceIcons(items);
  buttons.forEach((b, i) => {
    const item = items[i];
    if (!item) return;
    b.classList.add('sprout-choice', `sprout-choice-${i % 4}`);
    const dot = el('span', 'sprout-choice-dot', String(i + 1));
    dot.setAttribute('aria-hidden', 'true');
    const pic = icons[i]!.icon;
    const icon = el('span', 'sprout-choice-icon', pic);
    icon.setAttribute('aria-hidden', 'true');
    // A row of counting stars shrinks to stay inside the row.
    if (pic.startsWith('⭐') && pic.length > 2) icon.style.fontSize = '1.3rem';
    b.prepend(dot, icon);
    holdToSay(b, item.label);
  });
  if (!readAloud || items.length === 0) return;
  // The light follows the voice; with no voice it would sit on one option like a hint.
  const voiced = canSpeak();
  let lit: HTMLButtonElement | null = null;
  speakChoiceSet(
    items.map((x) => x.label),
    sayStory,
    (i) => {
      if (lit) lit.style.outline = '';
      lit = i >= 0 && voiced ? (buttons[i] ?? null) : null;
      if (lit) lit.style.outline = '4px solid #ffd85a';
    },
    // A picked or replaced set stops being read.
    () => buttons.every((b) => !b.disabled) && buttons.some((b) => b.isConnected),
  );
}

/** True when speakLine would actually be heard. */
function canSpeak(): boolean {
  try {
    return !!window.speechSynthesis && isAudioUnlocked() && isVoiceOn('story');
  } catch {
    return false;
  }
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
      speakLine(spoken(label), { channel: 'story' });
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
