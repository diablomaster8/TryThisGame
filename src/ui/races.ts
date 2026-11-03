import { mergedLevels } from '../sim/partners';
import { COURSE_LABELS, NAMES, UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { RaceScreen } from '../minigames/race/screen';
import { COURSES, createRace, lookPrizesFor, metSpeciesOf, raceSeedFor } from '../sim/race';
import type { Nubbin } from '../sim/types';
import { button, el, modal } from './dom';
import { byteFooter } from './fun-toasts';
import { nextTip } from './tips';
import { createFunRun, funRunTip } from '../sim/fun-run';
import { speakLine } from './lesson';
import { raceBandId } from '../config/cosmetics-r11e'; /* Lane E r11, R0437 */

/** Pick a course and tier, then run the race with the selected (or first grown) Nubbin. */
export class RacesMenu {
  private readonly dialog;
  private readonly list: HTMLDivElement;
  readonly screen: RaceScreen;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
    private readonly runnerPick: () => Nubbin | null,
  ) {
    this.dialog = modal(parent, UI_TEXT.races, UI_TEXT.close);
    this.list = el('div', 'shop-list');
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.racesHelp));
    this.dialog.body.appendChild(this.list);
    this.screen = new RaceScreen(parent);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private refresh(): void {
    const g = this.game();
    if (!g) return;
    this.list.innerHTML = '';
    for (const course of COURSES) {
      const row = el('div', 'shop-row race-row');
      const text = el('div');
      const won = g.world.races[course.id] ?? 0;
      text.append(
        el('strong', undefined, COURSE_LABELS[course.id] ?? course.id),
        el('small', undefined, course.sections.map((s) => s.kind).join(' · ')),
      );
      const tiers = el('div', 'race-tiers');
      for (let tier = 1; tier <= 3; tier++) {
        const b = button(
          UI_TEXT.tierLabel(tier),
          () => this.startRace(course.id, tier),
          'btn btn-small',
        );
        b.disabled = tier > won + 1;
        if (tier <= won) b.classList.add('active');
        tiers.appendChild(b);
      }
      row.append(text, tiers);
      this.list.appendChild(row);
    }
  }

  /**
   * R0688: the Learning Grove's Fun Run, from Places. One short course, three friendly rivals
   * (the child's other Nubbins, then Fern's), no placings, a ribbon for everyone. It reports
   * `funRunDone` only (never `raceResult`), so no tier is touched.
   */
  funRun(): void {
    const g = this.game();
    if (!g?.world.edu) return;
    const runner = this.runnerPick();
    if (!runner) {
      this.toast(UI_TEXT.expeditionNeedsNubbin);
      return;
    }
    const race = createFunRun(g.world, runner, raceSeedFor(g.world, 'funrun', 1));
    g.renderPaused = true;
    const sheets = g.view.sheets;
    this.screen.footer = [];
    this.screen.tip = '';
    this.screen.friendlyTip = funRunTip(race);
    this.screen.friendlySpeak = (t) => {
      if (this.game()?.world.edu?.readAloud) speakLine(t);
    };
    this.screen.start(
      race,
      runner,
      sheets.forNubbin(runner),
      sheets,
      1,
      () => {
        g.renderPaused = false;
        if (race.finished) g.send({ kind: 'funRunDone', nubbinId: runner.id });
      },
      g.graphics,
      g.scene3d,
    );
  }

  private startRace(courseId: string, tier: number): void {
    const g = this.game();
    const course = COURSES.find((c) => c.id === courseId);
    if (!g || !course) return;
    const runner = this.runnerPick();
    if (!runner) {
      this.toast(UI_TEXT.expeditionNeedsNubbin);
      return;
    }
    this.close();
    // Fixed by the world until the race is run, so quitting cannot reroll the field.
    const seed = raceSeedFor(g.world, course.id, tier);
    const race = createRace(
      course,
      tier,
      runner,
      seed,
      mergedLevels(g.world, runner) ?? undefined,
      g.world.nubbins.map((n) => n.name),
      metSpeciesOf(g.world),
    );
    const hatRoll = ((seed * 9301 + 49297) % 233280) / 233280;
    g.renderPaused = true;
    const sheets = g.view.sheets;
    this.screen.footer = byteFooter(g.world);
    this.screen.tip = nextTip(g.world);
    // R0437: the runner wears the course's headband for the race (not kept afterwards).
    const band = raceBandId(course.id);
    const banded = band ? { ...runner, wear: { ...runner.wear, face: band } } : runner;
    this.screen.start(
      race,
      runner,
      sheets.forNubbin(banded),
      sheets,
      hatRoll,
      (outcome) => {
        g.renderPaused = false;
        const best = race.racers
          .filter((r) => !r.isPlayer && r.finishedAtMs !== null)
          .sort((a, b) => (a.finishedAtMs ?? 0) - (b.finishedAtMs ?? 0))[0];
        g.send({
          kind: 'raceResult',
          nubbinId: runner.id,
          ...(best ? { rival: { name: best.name, species: 'chao' } } : {}),
          course: course.id,
          tier,
          placement: outcome.placement,
          shells: outcome.shells,
          hat: outcome.hat,
        });
        if (outcome.shells > 0)
          this.toast(`${UI_TEXT.place(outcome.placement)} · +${outcome.shells} ${NAMES.currency}`);
      },
      g.graphics,
      g.scene3d,
      lookPrizesFor(g.world.keeper.alignment),
    );
  }
}
