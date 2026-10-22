import { chapterStages } from './scene-stages-kit';
import type { SceneStage, StageCast } from './story';

/**
 * Dawn & Dusk: four houses round a green. The hour follows the half (M13): about 6.5 for
 * the dawn half and about 19 for the dusk half. Every scene of the two scripts is staged
 * here (campaign graphics 2, H2 and N2): openings, closings, beats and the endings. The
 * Keeper is never given a door mark: the houses stand tight round a small green, so the
 * stager's default Keeper mark for the `green` place (`PLACE_KEEPER`) stands. The twin
 * (Marigold by day, Ash by dusk) stands at the doors, the keys in hand where a latch is
 * the point; Vask keeps the west house, the dojo's side.
 */
export const DAWN_HOUR = 6.5;
export const DUSK_HOUR = 19;

/** Each chapter's shot, opening then closing (the same for both halves). */
type Shot = NonNullable<SceneStage['shot']>;
const SHOTS: ReadonlyArray<readonly [Shot, Shot]> = [
  [{ kind: 'establish' }, { kind: 'two' }],
  [{ kind: 'wide' }, { kind: 'two' }],
  [{ kind: 'two' }, { kind: 'close' }],
  [{ kind: 'wide' }, { kind: 'two' }],
  [{ kind: 'two' }, { kind: 'two' }],
  [{ kind: 'two' }, { kind: 'wide' }],
  [{ kind: 'wide' }, { kind: 'establish' }],
];

/** The green and its four houses, framed in the openings of chapters 1 and 3. */
const HOUSES = ['green', 'house-1', 'house-2', 'house-3', 'house-4'];

/** The four lamps and the windows, lit for the endings and the last light of chapter 7. */
const LIT: NonNullable<SceneStage['lights']> = {
  'lantern-1': 'lit',
  'lantern-2': 'lit',
  'lantern-3': 'lit',
  'lantern-4': 'lit',
  windows: 'lit',
};

/** A cast for a scene: `w` is this half's twin, `o` the other half's. */
type Cast = (w: string, o: string) => StageCast[];
const at = (who: string, mark: string, o: Partial<StageCast> = {}): StageCast => ({
  who,
  mark,
  face: 'you',
  ...o,
});
const KEYS = { carry: 'keys' } as const;
const VASK = 'd-vask';
const WEST = 'house-4-door';
const twinAt =
  (mark: string, o: Partial<StageCast> = {}): Cast =>
  (w) => [at(w, mark, o)];
const vaskAt =
  (mark = WEST): Cast =>
  () => [at(VASK, mark)];
const twinAndVask =
  (mark: string): Cast =>
  (w) => [at(w, mark), at(VASK, WEST)];

/** One scene's staging: its shot and who stands where. */
interface Row {
  shot: Shot;
  cast: Cast;
}

/** The chapters' [opening, closing] casts, in the same order as SHOTS. */
const CHAPTER_CASTS: ReadonlyArray<readonly [Cast | null, Cast | null]> = [
  [twinAt('house-1-door', KEYS), null],
  [twinAt('green-centre'), null],
  [twinAndVask('house-1-door'), vaskAt()],
  [twinAt('house-2-door'), null],
  [vaskAt(), vaskAt()],
  [twinAt('green-centre'), null],
  [vaskAt(), null],
];

/** Beats: `<half>-c<n>-<name>` by suffix. */
const BEATS: Record<string, Row> = {
  'c1-other': { shot: { kind: 'two' }, cast: twinAt('green-centre') },
  'c1-houses': {
    shot: { kind: 'wide', focus: ['house-1', 'house-2', 'house-3', 'house-4'] },
    cast: twinAt('house-1-door', KEYS),
  },
  'c2-visitor': {
    shot: { kind: 'wide', focus: ['green-centre'] },
    cast: twinAt('house-2-door'),
  },
  'c2-settled': { shot: { kind: 'wide' }, cast: twinAt('house-2-door') },
  'c2-book': { shot: { kind: 'close' }, cast: twinAt('green-centre') },
  'c3-egg': { shot: { kind: 'close' }, cast: twinAt('house-3-door') },
  'c3-dojo': { shot: { kind: 'two' }, cast: vaskAt() },
  'c4-page': { shot: { kind: 'two' }, cast: twinAt('green-centre') },
  'c4-second-house': { shot: { kind: 'two' }, cast: twinAt('house-2-door', KEYS) },
  'c5-dojo': { shot: { kind: 'two' }, cast: vaskAt() },
  'c5-grown': { shot: { kind: 'close' }, cast: twinAt('green-centre') },
  'c6-restored': { shot: { kind: 'close' }, cast: twinAt('green-centre') },
  'c6-wrong': { shot: { kind: 'close' }, cast: twinAt('green-centre') },
  'c7-after-right': { shot: { kind: 'two' }, cast: twinAt('green-centre') },
  'c7-after-wrong': { shot: { kind: 'two' }, cast: twinAt('green-centre') },
  'c7-black': { shot: { kind: 'two' }, cast: vaskAt() },
};

/** The three endings, each in the half's own light with the four lamps lit (N2). */
const ENDING_SHOT: Shot = { kind: 'wide', focus: HOUSES };
const ENDINGS: Record<string, { cast: Cast; props?: NonNullable<SceneStage['props']> }> = {
  'half-day': { cast: (w) => [at(w, 'green-centre'), at(VASK, WEST)] },
  'wrong-cause': { cast: (w) => [at(w, 'green-centre', { pose: 'sit' }), at(VASK, WEST)] },
  // Both twins on the green at once, the lamps strung between the houses.
  'whole-day': {
    cast: (w, o) => [at(w, 'house-1-door'), at(o, 'house-3-door'), at(VASK, WEST)],
    props: { lanternString: 'lit' },
  },
};

function half(prefix: 'dawn' | 'dusk'): Record<string, SceneStage> {
  const hour = prefix === 'dawn' ? DAWN_HOUR : DUSK_HOUR;
  const who = prefix === 'dawn' ? 'd-marigold' : 'd-ash';
  const other = prefix === 'dawn' ? 'd-ash' : 'd-marigold';
  const out: Record<string, SceneStage> = chapterStages(
    prefix,
    SHOTS.map(([o, c], i) => {
      const [oc, cc] = CHAPTER_CASTS[i] ?? [null, null];
      const open: SceneStage = {
        place: 'green',
        hour,
        shot: i === 0 || i === 2 ? { ...o, focus: HOUSES } : o,
        ...(oc ? { cast: oc(who, other) } : {}),
      };
      const close: SceneStage = {
        place: 'green',
        hour,
        shot: c,
        ...(cc ? { cast: cc(who, other) } : {}),
        ...(i === 6 ? { lights: LIT } : {}),
      };
      return [open, close];
    }),
  );
  for (const [name, r] of Object.entries(BEATS))
    out[`${prefix}-${name}`] = { place: 'green', hour, shot: r.shot, cast: r.cast(who, other) };
  for (const [name, e] of Object.entries(ENDINGS))
    out[`end-${prefix}-${name}`] = {
      place: 'green',
      hour,
      lights: LIT,
      shot: ENDING_SHOT,
      cast: e.cast(who, other),
      ...(e.props ? { props: e.props } : {}),
    };
  return out;
}

export const DAWNDUSK_STAGES: Readonly<Record<string, SceneStage>> = {
  ...half('dawn'),
  ...half('dusk'),
};
