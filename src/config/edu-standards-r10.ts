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
  tracing: ['RF.K.1d', 'ELOF: Literacy'],
  // R0716 (KIDS-48): the reader band's games.
  times: ['3.OA.C.7', '3.OA.A.1', '3.OA.A.3'],
  timeMoney: ['2.MD.C.7', '3.MD.A.1', '2.MD.C.8'],
  numbers: ['2.NBT.A.1', '3.NF.A.1'],
  reading: ['RL.2.1', 'RL.3.3'],
  science: ['K-LS1-1', '2-PS1-1', '2-ESS2-3', '2-LS4-1'],
};
