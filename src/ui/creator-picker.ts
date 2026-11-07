import { EGG_COLOR_LABELS, NAMES, SPECIES_LABELS, TYPE_LABELS } from '../config/strings';
import { cosmeticLabel } from '../config/cosmetics';
import { CREATOR_TEXT, EVO_TEXT, GALLERY_TEXT, STAGE_NAMES } from '../config/strings-evo';
import { CreatorGallery } from './creator-gallery';
import type { Game } from '../game';
import {
  CREATOR_COLOURS,
  CREATOR_LOOKS,
  pickProblem,
  type CreatorPick,
  type CreatorStage,
} from '../sim/creator';
import { speciesByFamily, speciesOf, type Species } from '../sim/species';
import { NUBBIN_TYPES, type AlignmentBand, type NubbinType } from '../sim/types';
import { button, el, modal } from './dom';

type Family = 'chao' | 'pocket' | 'digi';
const FAMILIES: readonly Family[] = ['chao', 'pocket', 'digi'];
const BANDS: readonly AlignmentBand[] = ['sun', 'moon', 'neutral'];
const BAND_LABELS: Record<AlignmentBand, string> = {
  sun: NAMES.alignmentSun,
  moon: NAMES.alignmentMoon,
  neutral: NAMES.alignmentNeutral,
};

/** The stages a species offers (what `pickProblem` accepts, so the list never offers a dud). */
export function stagesFor(family: Family, s: Species | undefined): CreatorStage[] {
  if (family === 'chao') return ['egg', 'child', 'first', 'second', 'radiant', 'eternal'];
  const out: CreatorStage[] = ['egg'];
  if (s?.stage === 'baby') out.push('child');
  out.push('adult');
  if (family === 'pocket' && s && !s.evolve) out.push('radiant');
  return out;
}

function stageLabel(family: Family, stage: CreatorStage): string {
  if (stage === 'radiant') return family === 'chao' ? EVO_TEXT.chaosTier : STAGE_NAMES.radiant;
  if (stage === 'eternal') return STAGE_NAMES.eternal;
  return CREATOR_TEXT.stages[stage];
}

/**
 * Lane F r11 (EVO): the creator picker (Maor only). The sim checks `world.creator` itself on
 * `creatorGrant` and `creatorTransform`; this modal only builds the pick and sends it.
 */
export class CreatorPicker {
  private readonly dialog: ReturnType<typeof modal>;
  private family: Family = 'chao';
  private species = 'chao';
  private stage: CreatorStage = 'egg';
  private band: AlignmentBand = 'neutral';
  private type: NubbinType = 'normal';
  private second: NubbinType = 'normal';
  private eggColor = 'plain';
  private tone = '';
  private shiny = false;
  private look = '';
  private readonly form = el('div', 'creator-form');
  private readonly error = el('p', 'creator-error');
  private readonly grant: HTMLButtonElement;
  private readonly transform: HTMLButtonElement;
  private readonly note = el('p', 'help');
  /** The full-screen gallery, opened from the Gallery button. */
  readonly gallery: CreatorGallery;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, CREATOR_TEXT.title, 'Close');
    this.error.setAttribute('role', 'alert');
    this.note.setAttribute('role', 'status');
    this.grant = button(CREATOR_TEXT.grant, () => this.apply(false), 'btn btn-primary');
    this.transform = button(CREATOR_TEXT.transform, () => this.apply(true), 'btn');
    // The gallery takes the screen alone: the picker hides under it and comes back after.
    this.gallery = new CreatorGallery(parent, game, () => this.dialog.show());
    const actions = el('div', 'creator-actions');
    actions.append(
      this.grant,
      this.transform,
      button(
        GALLERY_TEXT.open,
        () => {
          this.dialog.hide();
          this.gallery.open();
        },
        'btn',
      ),
    );
    this.dialog.body.append(this.form, this.error, actions, this.note);
  }

  open(): void {
    this.render();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  /** The pick as currently set. */
  pick(): CreatorPick {
    const chao = this.family === 'chao';
    const p: CreatorPick = {
      species: this.species,
      stage: this.stage,
      eggColor: this.eggColor,
      tone: this.tone || null,
      shiny: this.shiny,
      look: chao && this.look ? this.look : null,
    };
    if (chao) {
      p.band = this.band;
      if (['first', 'second', 'radiant'].includes(this.stage)) {
        p.type = this.type;
        if (this.stage === 'second' || this.stage === 'radiant') p.second = this.second;
      }
    }
    return p;
  }

  private select<T extends string>(
    label: string,
    options: readonly { value: T; text: string }[],
    value: T,
    onChange: (v: T) => void,
  ): HTMLLabelElement {
    const wrap = el('label', 'creator-field');
    wrap.appendChild(el('span', undefined, label));
    const sel = el('select');
    for (const o of options) {
      const opt = el('option', undefined, o.text);
      opt.value = o.value;
      sel.appendChild(opt);
    }
    sel.value = value;
    sel.addEventListener('change', () => {
      onChange(sel.value as T);
      this.render();
    });
    wrap.appendChild(sel);
    return wrap;
  }

  private render(): void {
    const speciesList = this.family === 'chao' ? [speciesOf('chao')] : speciesByFamily(this.family);
    if (!speciesList.some((s) => s.id === this.species)) this.species = speciesList[0]!.id;
    const stages = stagesFor(this.family, speciesOf(this.species));
    if (!stages.includes(this.stage)) this.stage = stages[0]!;
    const chao = this.family === 'chao';
    const typeOpts = NUBBIN_TYPES.map((t) => ({ value: t, text: TYPE_LABELS[t] }));
    const colourOpts = CREATOR_COLOURS.map((c) => ({ value: c, text: EGG_COLOR_LABELS[c] ?? c }));
    const f = this.form;
    f.replaceChildren(
      this.select(
        CREATOR_TEXT.family,
        FAMILIES.map((v) => ({ value: v, text: CREATOR_TEXT.families[v] })),
        this.family,
        (v) => {
          this.family = v;
          this.species = v === 'chao' ? 'chao' : speciesByFamily(v)[0]!.id;
        },
      ),
      this.select(
        CREATOR_TEXT.species,
        speciesList.map((s) => ({ value: s.id, text: SPECIES_LABELS[s.id] ?? s.id })),
        this.species,
        (v) => (this.species = v),
      ),
      this.select(
        CREATOR_TEXT.stage,
        stages.map((v) => ({ value: v, text: stageLabel(this.family, v) })),
        this.stage,
        (v) => (this.stage = v),
      ),
    );
    if (chao) {
      f.appendChild(
        this.select(
          CREATOR_TEXT.band,
          BANDS.map((v) => ({ value: v, text: BAND_LABELS[v] })),
          this.band,
          (v) => (this.band = v),
        ),
      );
      if (['first', 'second', 'radiant'].includes(this.stage))
        f.appendChild(this.select(CREATOR_TEXT.type, typeOpts, this.type, (v) => (this.type = v)));
      if (this.stage === 'second' || this.stage === 'radiant')
        f.appendChild(
          this.select(CREATOR_TEXT.second, typeOpts, this.second, (v) => (this.second = v)),
        );
    }
    f.appendChild(
      this.select(CREATOR_TEXT.egg, colourOpts, this.eggColor, (v) => (this.eggColor = v)),
    );
    f.appendChild(
      this.select(
        CREATOR_TEXT.tone,
        [{ value: '', text: CREATOR_TEXT.none }, ...colourOpts],
        this.tone,
        (v) => (this.tone = v),
      ),
    );
    const shiny = el('label', 'creator-field creator-check');
    const box = el('input');
    box.type = 'checkbox';
    box.checked = this.shiny;
    box.addEventListener('change', () => {
      this.shiny = box.checked;
      this.render();
    });
    shiny.append(box, el('span', undefined, CREATOR_TEXT.shiny));
    f.appendChild(shiny);
    if (chao)
      f.appendChild(
        this.select(
          CREATOR_TEXT.look,
          [
            { value: '', text: CREATOR_TEXT.none },
            ...CREATOR_LOOKS.map((id) => ({ value: id, text: cosmeticLabel(id) })),
          ],
          this.look,
          (v) => (this.look = v),
        ),
      );
    this.updateButtons();
  }

  private updateButtons(): void {
    const why = pickProblem(this.pick());
    this.error.textContent = why ? CREATOR_TEXT.invalid(why) : '';
    const sel = this.game()?.world.selected ?? null;
    this.grant.disabled = !!why;
    this.transform.disabled = !!why || !sel;
    this.note.textContent = sel ? '' : CREATOR_TEXT.noSelection;
  }

  private apply(transform: boolean): void {
    const g = this.game();
    const pick = this.pick();
    if (!g || pickProblem(pick)) return;
    if (transform) {
      const id = g.world.selected;
      if (!id) return;
      g.send({ kind: 'creatorTransform', nubbinId: id, pick });
    } else {
      g.send({ kind: 'creatorGrant', pick });
    }
    this.note.textContent = CREATOR_TEXT.done(NAMES.creature);
  }
}
