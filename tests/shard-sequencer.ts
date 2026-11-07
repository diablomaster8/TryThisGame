import { BaseSequencer, type TestSpecification } from 'vitest/node';
import { DEFAULT_WEIGHT, SHARD_WEIGHTS } from './shard-weights';

const slash = (p: string): string => p.replaceAll('\\', '/');

/**
 * `vitest run --shard=N/M` normally deals files out by a hash of their path, so a handful of
 * heavy scripted runs can land in one shard and leave the others idle. This sequencer deals
 * them out by weight instead (longest first, always into the lightest shard), using the
 * seconds in `shard-weights.ts`. Every shard computes the same split from the same list, so
 * together they still cover every file exactly once.
 */
export default class WeightedShardSequencer extends BaseSequencer {
  /** The file's path from the repo root, as `shard-weights.ts` lists it. */
  private rel(spec: TestSpecification): string {
    const root = slash(this.ctx.config.root).replace(/\/$/, '');
    const id = slash(spec.moduleId);
    return id.startsWith(`${root}/`) ? id.slice(root.length + 1) : id;
  }

  override async shard(files: TestSpecification[]): Promise<TestSpecification[]> {
    const shard = this.ctx.config.shard;
    if (!shard) return files;
    const items = files
      .map((spec) => {
        const rel = this.rel(spec);
        return { spec, rel, weight: SHARD_WEIGHTS[rel] ?? DEFAULT_WEIGHT };
      })
      .sort((a, b) => b.weight - a.weight || (a.rel < b.rel ? -1 : 1));
    const load = new Array<number>(shard.count).fill(0);
    const mine: TestSpecification[] = [];
    for (const item of items) {
      let lightest = 0;
      for (let i = 1; i < load.length; i++) if (load[i]! < load[lightest]!) lightest = i;
      load[lightest]! += item.weight;
      if (lightest === shard.index - 1) mine.push(item.spec);
    }
    return mine;
  }

  /**
   * Heaviest files first inside the shard as well. Vitest's own order (cached durations, else
   * file size) has nothing to go on in a fresh CI checkout, so a 76 s scripted run could start
   * last and hold the shard open long after the other workers went idle. Longest first, the
   * shard ends close to max(heaviest file, total / workers).
   */
  override async sort(files: TestSpecification[]): Promise<TestSpecification[]> {
    const sorted = await super.sort(files);
    const weight = (spec: TestSpecification): number =>
      SHARD_WEIGHTS[this.rel(spec)] ?? DEFAULT_WEIGHT;
    // Array.prototype.sort is stable: equal weights keep Vitest's order.
    return sorted.sort((a, b) => weight(b) - weight(a));
  }
}
