/**
 * Lane A round 5 (FUN): the toasts' voice by band. R0307 slip nudges say what helps; R0308
 * filters every toast in the Learning Grove's sprout band (icon first, eight words at most,
 * no mechanics, read aloud when read-aloud is on); R0311 gives pet-sheet actions a physical
 * line. Text lives in `config/strings-fun-r5.ts`.
 */
import { BYTE_WATCHES } from '../config/tuning';
import { byteWatches } from '../sim/byte-watches';
import {
  BYTE_WATCH_TEXT,
  EDU_TOASTS,
  FERN_STONE_TEXT,
  PET_LINES,
  SLIP_NUDGE,
  type ToastBand,
} from '../config/strings-fun-r5';
import { UI_TEXT, NAMES } from '../config/strings';
import { PET_TOASTS } from '../config/strings-look';
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
 * Lane E's per-action, per-personality pet lines (R0298, `PET_TOASTS`) as patterns, so this
 * wrapper knows which action a success toast was for. Beats that describe a state of their
 * own (hiccups, a Nubbin too awake to tuck in) are left exactly as lane E wrote them.
 */
const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const LANE_E_PETS: Array<{ re: RegExp; key: string }> = Object.entries(PET_TOASTS).flatMap(
  ([beat, set]) =>
    beat === 'hiccup' || beat === 'wideAwake'
      ? []
      : Object.values(set).map((tpl) => ({
          re: new RegExp(`^${escapeRe(tpl).replace('\\{n\\}', '(.+)')}$`),
          key: beat,
        })),
);

/**
 * R0311: a pet-sheet toast in the Nubbin's own physical voice. One toast per action, never
 * two: the refusal and the plain "liked that (tickle)" become one of three lines for the
 * band; a success toast from lane E's personality lines stays one of four in the main band
 * (theirs, then our three, in turn) and becomes our short line in the reader and sprout
 * bands. Null when `text` is not a pet toast. `turn` overrides the rotation (tests).
 */
export function petVoice(text: string, band: ToastBand, turn?: number): string | null {
  const liked = /^(.+) liked that \((.+)\)\.$/.exec(text);
  const refused = /^(.+) flinches away\. Not yet\.$/.exec(text);
  let name: string | undefined;
  let key: string | undefined;
  let personal = false;
  if (refused) {
    name = refused[1];
    key = 'refused';
  } else if (liked) {
    name = liked[1];
    key = Object.keys(PET_LINES).find((k) => k.toLowerCase() === liked[2]!.replace(/\s/g, ''));
  } else {
    for (const p of LANE_E_PETS) {
      const m = p.re.exec(text);
      if (!m) continue;
      name = m[1];
      key = p.key;
      personal = true;
      break;
    }
  }
  const lines = key ? PET_LINES[key]?.[band] : undefined;
  if (!name || !lines?.length) return null;
  const n = turn ?? petTurn.get(`${key}:${band}`) ?? 0;
  petTurn.set(`${key}:${band}`, n + 1);
  if (personal && band === 'main') {
    const k = n % (lines.length + 1);
    return k === 0 ? text : lines[k - 1]!.replaceAll('{n}', name);
  }
  return lines[n % lines.length]!.replaceAll('{n}', name);
}

/** R0313: Fern's stone's line for the `line`-th tap, with the cairn's count. */
export function fernStoneLine(world: World, line: number, stones: number): string {
  const t = FERN_STONE_TEXT;
  const pool = toastBand(world) === 'sprout' ? t.sprout : t.main;
  return `${pool[line % pool.length]!} ${t.count(stones)}`;
}

/**
 * R0314: the race card's footer lines for the race just run (it is not counted yet, so the
 * count is read one race ahead). Byte speaks when the count has just risen; past the cap the
 * card says two were retired. Empty before chapter 5.
 */
export function byteFooter(world: World): string[] {
  const c = world.campaign;
  const now = byteWatches(c, 1);
  if (now === null || !c) return [];
  const before = byteWatches(c, 0) ?? now;
  const t = BYTE_WATCH_TEXT;
  if (toastBand(world) === 'sprout') return [t.sprout(now)];
  const out = [t.footer(now)];
  if (now > before && t.milestones[now]) out.push(t.milestones[now]);
  else if (before === BYTE_WATCHES.cap && now === before) out.push(t.retired);
  return out;
}
