/**
 * MOVE-63: the hop course's HUD. A chip shows the next flag and the running time during a
 * run; a toast greets the start, the finish (with its medal) and the hat. The best time and
 * its ghost are kept in a side save of their own, one per Grove slot, so the course never
 * writes the Grove save (the hat is the sim's one write). Storage may be missing: then the
 * course still runs and simply forgets.
 */
import '../move.css';
import '../fun.css';
import { HOP_COURSE_TEXT } from '../config/strings-move';
import { HOP_COURSE } from '../config/tuning-move';
import { currentSlot, slotKey } from '../platform/storage';
import { setHopGhost } from '../render/hop-course-view';
import { hopCourseRun, hopMedal } from '../sim/hop-course';
import type { SimEvent, World } from '../sim/types';
import { el } from './dom';

interface HopBest {
  ms: number;
  ghost: number[];
}

const key = (): string => `${slotKey(currentSlot())}.hop`;

function readBest(): HopBest | null {
  try {
    const raw = localStorage.getItem(key());
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<HopBest>;
    return typeof v.ms === 'number' && Array.isArray(v.ghost) ? { ms: v.ms, ghost: v.ghost } : null;
  } catch {
    return null;
  }
}

function writeBest(best: HopBest): void {
  try {
    localStorage.setItem(key(), JSON.stringify(best));
  } catch {
    // No storage: the best time lasts this session only.
  }
}

export class HopCourseChip {
  readonly root: HTMLDivElement;
  private best: HopBest | null = null;
  private loadedFor = '';

  constructor(parent: HTMLElement) {
    this.root = el('div', 'hop-lesson-chip hop-course-chip');
    this.root.setAttribute('role', 'status');
    this.root.hidden = true;
    parent.appendChild(this.root);
  }

  /** Read the side save for the slot in play (again when the slot changes). */
  private load(): void {
    const k = key();
    if (k === this.loadedFor) return;
    this.loadedFor = k;
    this.best = readBest();
    setHopGhost(this.best?.ghost ?? null);
  }

  /** Per frame: the next flag and the time while a run is under way. */
  update(world: World): void {
    this.load();
    const run = hopCourseRun(world);
    this.root.hidden = !run;
    if (!run) return;
    const t = HOP_COURSE_TEXT.time(world.timeMs - run.startMs);
    const flag = HOP_COURSE_TEXT.flag(run.next + 1, HOP_COURSE.flags.length);
    const best = this.best ? ` · ${HOP_COURSE_TEXT.best(this.best.ms)}` : '';
    const text = `${flag} · ${t}${best}`;
    if (this.root.textContent !== text) this.root.textContent = text;
  }

  /** A hop course event: what to toast, and a new best saved with its ghost. */
  onEvent(e: SimEvent, toast: (text: string) => void): void {
    if (e.kind !== 'hopCourse') return;
    this.load();
    if (e.stage === 'start') toast(HOP_COURSE_TEXT.started);
    else if (e.stage === 'gaveUp') toast(HOP_COURSE_TEXT.gaveUp);
    else if (e.stage === 'finish') {
      toast(HOP_COURSE_TEXT.finished(e.ms, HOP_COURSE_TEXT.medals[hopMedal(e.ms)]));
      if (!this.best || e.ms < this.best.ms) {
        if (this.best) toast(HOP_COURSE_TEXT.newBest);
        this.best = { ms: e.ms, ghost: e.ghost };
        writeBest(this.best);
        setHopGhost(e.ghost);
      }
      if (e.hat) toast(HOP_COURSE_TEXT.hatGot);
    }
  }
}
