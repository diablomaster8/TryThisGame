/**
 * Lane A round 5 (FUN): the toasts' voice by band. R0307 slip nudges say what helps; R0308
 * filters every toast in the Learning Grove's sprout band (icon first, eight words at most,
 * no mechanics, read aloud when read-aloud is on); R0311 gives pet-sheet actions a physical
 * line. Text lives in `config/strings-fun-r5.ts`.
 */
import { EDU_TOASTS, PET_LINES, SLIP_NUDGE, type ToastBand } from '../config/strings-fun-r5';
import { UI_TEXT, NAMES } from '../config/strings';
import type { Game } from '../game';
import type { SlipKind, World } from '../sim/types';
import { speakLine } from './lesson';

/** The band a toast is written for: the Learning Grove's band, else the main game. */
export function toastBand(world: World): ToastBand {
  return world.edu ? world.edu.band : 'main';
}

/** R0307: the nudge for a slip about to happen or just logged. */
export function slipNudge(world: World, nubbinId: string, slip: SlipKind): string {
  const name = world.nubbins.find((x) => x.id === nubbinId)?.name ?? NAMES.creature;
  return SLIP_NUDGE[slip][toastBand(world)](name);
}

const words = (s: string): number => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/** R0308: a toast as the sprout band shows it, or null to leave it out. Pure, for tests. */
export function sproutToast(text: string): string | null {
  for (const [season, line] of Object.entries(UI_TEXT.festival)) {
    if (text === line) return EDU_TOASTS.festival[season] ?? null;
  }
  const visit = /^(.+) stopped by with (.+)!$/.exec(text);
  if (visit) {
    const gift = Object.entries(UI_TEXT.giftNames).find(([, g]) => g === visit[2])?.[0];
    const short = gift ? EDU_TOASTS.gifts[gift] : undefined;
    return short ? EDU_TOASTS.visitor(visit[1]!, short) : EDU_TOASTS.visitorHello(visit[1]!);
  }
  const hello = /^(.+) stopped by to say hello\.$/.exec(text);
  if (hello) return EDU_TOASTS.visitorHello(hello[1]!);
  // Mechanics never reach a pre-reader: multipliers, percentages, prices.
  if (/×\s?\d|\d\s?×|\b\d+x\b|%|twice as|half price|double /i.test(text)) return null;
  if (words(text) <= EDU_TOASTS.maxWords) return text;
  const first = /^[^.!?]+[.!?]/.exec(text)?.[0];
  return first && words(first) <= EDU_TOASTS.maxWords ? first : null;
}

/** R0308: wrap the HUD's toaster so the sprout band gets its own toasts, read aloud. */
export function bandToaster(
  toast: (text: string, ms?: number) => void,
  game: () => Game | null,
): (text: string, ms?: number) => void {
  return (text, ms) => {
    const world = game()?.world;
    // R0311: pet toasts get a physical line for the band first.
    if (world) text = petVoice(text, toastBand(world)) ?? text;
    if (!world || toastBand(world) !== 'sprout') {
      toast(text, ms);
      return;
    }
    const shown = sproutToast(text);
    if (!shown) return;
    toast(shown, ms);
    if (world.edu?.readAloud) speakLine(shown.replace(/^[^\p{L}\p{N}]+/u, ''));
  };
}

const petTurn = new Map<string, number>();

/**
 * R0311: a pet-sheet toast in the Nubbin's own physical voice ("liked that (tickle)" and the
 * refusal become one of three lines for the band, taken in turn). Null when `text` is not a
 * pet toast. `turn` overrides the rotation (tests).
 */
export function petVoice(text: string, band: ToastBand, turn?: number): string | null {
  const liked = /^(.+) liked that \((.+)\)\.$/.exec(text);
  const refused = /^(.+) flinches away\. Not yet\.$/.exec(text);
  const m = liked ?? refused;
  if (!m) return null;
  const key = refused
    ? 'refused'
    : Object.keys(PET_LINES).find((k) => k.toLowerCase() === m[2]!.replace(/\s/g, ''));
  const lines = key ? PET_LINES[key]?.[band] : undefined;
  if (!lines?.length) return null;
  const n = turn ?? petTurn.get(`${key}:${band}`) ?? 0;
  petTurn.set(`${key}:${band}`, n + 1);
  return lines[n % lines.length]!.replaceAll('{n}', m[1]!);
}
