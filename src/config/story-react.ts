/**
 * R0368 (FUN-79): narration that makes the scene's Nubbin react when the line sets no
 * `react` of its own ("Your Nubbin sneezes" plays the sneeze). Pure data, shared by the
 * dialogue (`ui/stage-react.ts`) and the content checker, which lists every match.
 */
import type { LineReaction } from './story';

export const REACT_INFER: ReadonlyArray<
  [RegExp, LineReaction, 'sneeze' | 'hiccup' | 'giggle' | null]
> = [
  [/\byour Nubbin sneezes\b/i, 'sneeze', 'sneeze'],
  [/\byour Nubbin hiccups\b/i, 'hiccup', 'hiccup'],
  [/\byour Nubbin (giggles|laughs)\b/i, 'giggle', 'giggle'],
  [/\byour Nubbin (hides|tucks)\b/i, 'hide', null],
  [/\byour Nubbin (leans|presses|snuggles|nuzzles)\b/i, 'lean', null],
  [/\byour Nubbin (yawns|dozes)\b/i, 'yawn', null],
  [/\byour Nubbin (bounces|hops|jumps|claps|spins)\b/i, 'happy', null],
  [/\byour Nubbin (sniffles|whimpers|droops)\b/i, 'sad', null],
  [/\byour Nubbin (gasps|jumps back|stares)\b/i, 'surprised', null],
];
