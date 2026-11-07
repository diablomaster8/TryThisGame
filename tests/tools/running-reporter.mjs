/* global process */
/**
 * A tiny Vitest reporter for CI: it keeps `vitest-running.json` up to date with the test files
 * that have started and not yet finished. When a run hangs or is cancelled the JSON report is
 * never written, but this file still says which files were in flight;
 * `tests/tools/slow-report.cjs` prints it.
 *
 *   npx vitest run --reporter=default --reporter=./tests/tools/running-reporter.mjs
 */
import { writeFileSync } from 'node:fs';

export default class RunningReporter {
  running = new Map();

  flush() {
    try {
      const now = Date.now();
      const rows = [...this.running].map(([file, at]) => `${file} (${Math.round((now - at) / 1000)} s)`);
      writeFileSync(process.env.RUNNING_FILE || 'vitest-running.json', JSON.stringify(rows));
    } catch {
      // A reporter must never fail the run.
    }
  }

  onTestModuleStart(testModule) {
    this.running.set(testModule.relativeModuleId ?? testModule.moduleId, Date.now());
    this.flush();
  }

  onTestModuleEnd(testModule) {
    this.running.delete(testModule.relativeModuleId ?? testModule.moduleId);
    this.flush();
  }
}
