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
  override async shard(files: TestSpecification[]): Promise<TestSpecification[]> {
    const shard = this.ctx.config.shard;
    if (!shard) return files;
    const root = slash(this.ctx.config.root).replace(/\/$/, '');
    const items = files
      .map((spec) => {
        const id = slash(spec.moduleId);
        const rel = id.startsWith(`${root}/`) ? id.slice(root.length + 1) : id;
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
}
