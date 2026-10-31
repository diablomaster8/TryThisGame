/**
 * Lane E round 10 (R0717 KIDS-49): which standards each of the six Learning Grove games
 * practises (`EDU_ROUND_STANDARDS` in the recs). Each game makes a few kinds of round (a
 * colour hunt or a not-this-colour sort; counting, more or fewer, a little sum), so a game
 * lists every code its rounds touch. The plain-words labels are `STANDARD_LABELS`.
 */
import type { EduGameId } from './edu';

export const EDU_ROUND_STANDARDS: Readonly<Record<EduGameId, readonly string[]>> = {
  colours: ['ELOF: Scientific Reasoning', 'K.MD.B.3'],
  letters: ['RF.K.1d', 'RF.K.3a', 'ELOF: Literacy'],
  counting: ['K.CC.B.4', 'K.CC.B.5', 'K.CC.C.6', 'K.OA.A.1'],
  shapes: ['K.G.A.2'],
  sounds: ['RF.K.2', 'ELOF: Language and Communication'],
  animals: ['K-LS1-1', 'ELOF: Scientific Reasoning'],
};
