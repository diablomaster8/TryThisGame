/**
 * The language questlines' base scripts and courses (CV3). Only the Learning Grove's band
 * chunks carry them (every band needs them), so the main game never knows they exist.
 */
import { HEBREW_COURSE, LANG_HEBREW } from './lang-hebrew';
import { JAPANESE_COURSE, LANG_JAPANESE } from './lang-japanese';

export const EDU_LANG_QUESTS = [...LANG_HEBREW, ...LANG_JAPANESE];
export const EDU_LANG_COURSES = [HEBREW_COURSE, JAPANESE_COURSE];
