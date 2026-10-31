/**
 * Lane A round 10: the words for the fortune teller's reading (R0557) and the doctor's notes
 * (R0556), from the keys the sim picks (`sim/kindergarten.ts`). Pure, so tests can read it.
 */
import { DOCTOR_TEXT, FORTUNE_TEXT } from '../config/strings';
import type { DoctorNote, Reading } from '../sim/kindergarten';

type Flavour = Parameters<typeof FORTUNE_TEXT.revealYum>[0];
type Toy = Parameters<typeof FORTUNE_TEXT.revealToy>[0];

/** The reading's lines: the character, the road ahead, then the like it reveals. */
export function fortuneLines(r: Reading): string[] {
  const out: string[] = [];
  const c = r.character;
  out.push(
    c.kind === 'trait'
      ? FORTUNE_TEXT.trait[c.id]
      : (FORTUNE_TEXT.personality[c.id]?.[c.pick] ?? FORTUNE_TEXT.personality.cheerful![0]!),
  );
  out.push(FORTUNE_TEXT.band[r.band.id]?.[r.band.pick] ?? FORTUNE_TEXT.band.neutral![0]!);
  const v = r.reveal;
  if (!v) out.push(FORTUNE_TEXT.allKnown);
  else if (v.kind === 'yum') out.push(FORTUNE_TEXT.revealYum(v.taste as Flavour));
  else if (v.kind === 'toy') out.push(FORTUNE_TEXT.revealToy(v.toy as Toy));
  else out.push(FORTUNE_TEXT.revealBleh(v.taste as Flavour));
  return out;
}

export function doctorNoteText(note: DoctorNote, name: string): string {
  const N = DOCTOR_TEXT.notes;
  switch (note.id) {
    case 'buddy':
      return N.buddy(name, note.friend);
    case 'lean':
      return N.lean(name, DOCTOR_TEXT.leanPart[note.type] ?? DOCTOR_TEXT.leanPart.normal!);
    default:
      return N[note.id](name);
  }
}
