import type { Storyline } from '../content/types';
import { STORYLINE_HUNDRED } from '../content/storyline-hundred';
import { STORYLINE_LOGGED } from '../content/storyline-logged';
import { STORYLINE_BEETLE } from '../content/storyline-beetle';
import { STORYLINE_DAWN, STORYLINE_DUSK } from '../content/storyline-dawndusk';

/**
 * The separate campaigns' scripts (SL1–SL4), as their own chunk: story-scenes.ts loads
 * and registers them with the campaign and side-story scripts so a save in one of
 * their modes finds every queued scene. Tests import it directly.
 */
export const STORYLINE_CONTENT: Storyline[] = [
  STORYLINE_HUNDRED,
  STORYLINE_LOGGED,
  STORYLINE_BEETLE,
  STORYLINE_DAWN,
  STORYLINE_DUSK,
];
