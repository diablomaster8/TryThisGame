/**
 * Prints the slowest test files of a Vitest JSON report (`--reporter=json --outputFile=...`).
 * On GitHub Actions each line is also a `::notice` annotation, so a run's slow files can be
 * read from the check-run annotations without downloading logs.
 *
 *   node tests/tools/slow-report.cjs report.json [top=25] [label] [skip=0]
 *
 * Wall time per file is the file's end minus its start as the runner saw it, so it includes
 * the worker start, the setup file and the imports as well as the tests themselves.
 */
const fs = require('node:fs');

const file = process.argv[2];
const top = Number(process.argv[3]) || 25;
const skip = Number(process.argv[5]) || 0;
const label = process.argv[4] || 'tests';
if (!file || !fs.existsSync(file)) {
  console.log(`slow-report: no report at ${file}`);
  process.exit(0);
}
const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = report.testResults.map((f) => ({
  name: f.name.replace(/\\/g, '/').replace(/^.*\/(tests\/)/, '$1'),
  wall: f.endTime - f.startTime,
  tests: f.assertionResults.length,
  inTests: f.assertionResults.reduce((a, t) => a + (t.duration || 0), 0),
}));
rows.sort((a, b) => b.wall - a.wall);
const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
const gha = Boolean(process.env.GITHUB_ACTIONS);
const first = Math.min(...report.testResults.map((f) => f.startTime));
const last = Math.max(...report.testResults.map((f) => f.endTime));
const head =
  `[${label}] ${rows.length} files, ${report.numTotalTests} tests ` +
  `(${report.numPassedTests} passed, ${report.numFailedTests} failed), ` +
  `span ${((last - first) / 1000).toFixed(0)} s, summed file wall ${(sum('wall') / 1000).toFixed(0)} s, ` +
  `summed test time ${(sum('inTests') / 1000).toFixed(0)} s`;
console.log(head);
if (gha) console.log(`::notice title=${label} totals::${head}`);
for (const r of rows.slice(skip, skip + top)) {
  const line = `${(r.wall / 1000).toFixed(1)} s (tests ${(r.inTests / 1000).toFixed(1)} s, n=${r.tests}) ${r.name}`;
  console.log(line);
  if (gha) console.log(`::notice title=${label} slow file::${line}`);
}
const failedFiles = report.testResults
  .filter((f) => f.status === 'failed')
  .map((f) => f.name.replace(/\\/g, '/').replace(/^.*\/(tests\/)/, '$1'));
if (failedFiles.length) {
  const line = `${failedFiles.length} failed files: ${failedFiles.join(' ')}`;
  console.log(line);
  if (gha) console.log(`::error title=${label} failed files::${line}`);
}
