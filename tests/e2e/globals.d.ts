/** The `?e2e` hooks the specs reach through `page.evaluate` (src/dev/e2e-api.ts, src/game.ts). */
interface GroveHandle {
  // The specs drive the whole Game object; typing it here would drag src/ into the spec build.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
interface Window {
  grove?: GroveHandle;
  gc?: () => void;
}
