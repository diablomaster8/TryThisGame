import type { Storyline } from '../content/types';
import { STORYLINE_HUNDRED } from '../content/storyline-hundred';
import { STORYLINE_LOGGED } from '../content/storyline-logged';

/**
 * The separate campaigns' scripts (S1–S4), as their own chunk: story-scenes.ts loads
 * and registers them with the campaign and side-story scripts so a save in one of
 * their modes finds every queued scene. Tests import it directly.
 */
export const STORYLINE_CONTENT: Storyline[] = [STORYLINE_HUNDRED, STORYLINE_LOGGED];
