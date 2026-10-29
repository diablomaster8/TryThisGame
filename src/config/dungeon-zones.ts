import type { ActId } from './dungeon-acts';

/**
 * Act camps (R0152, DUNG-12): the authored hub map and who keeps each service, per act.
 * Every act uses the same 40×30 camp for now; each has its own cast and lines
 * (`HOLLOW_TOWN_LINES`, strings-dungeon.ts). The sim reads the map in `sim/dungeon-towns.ts`.
 *
 * Legend: `#` hedge or rock, `.` ground, `~` water, `T` a lantern (on the wall above),
 * `P` the road home, `G` the gate to the fields, `W` the waypoint stone, `S` the stash chest,
 * `V` vendor, `C` crafting table, `$` gamble stall, `H` hire board, `Q` quest-giver.
 */
export const TOWN_MAP: readonly string[] = [
  '########################################',
  '########################################',
  '##....T........T........T.............##',
  '##....................................##',
  '##....................................##',
  '##...........................~~~~~....##',
  '##......##..................~~~~~~~...##',
  '##......#..................~~~~~~~~~..##',
  '##..................C.......~~~~~~~...##',
  '##............V..............~~~~~....##',
  '###.......................$...........##',
  '##....................................##',
  '##.##.................................##',
  '##.#..................................##',
  '##..................................G.##',
  '##....................................##',
  '##....................................##',
  '##..........S.........................##',
  '##.........................H..........##',
  '##....................................##',
  '##....................................##',
  '##..................Q.................##',
  '##................................##..##',
  '##.....W..........................#...##',
  '##....................##..............##',
  '##..P.................#...............##',
  '##....................................##',
  '##....................................##',
  '########################################',
  '########################################',
];

export type ServiceKind = 'stash' | 'vendor' | 'craft' | 'gamble' | 'hire' | 'quest';

/** Map glyph of each service. */
export const SERVICE_GLYPH: Readonly<Record<string, ServiceKind>> = {
  S: 'stash',
  V: 'vendor',
  C: 'craft',
  $: 'gamble',
  H: 'hire',
  Q: 'quest',
};

/**
 * Who keeps each service in each act's camp: a trainer id (`sim/trainers.ts`) or `local`
 * (the act's own face, `HOLLOW_LOCALS`). The stash has no keeper.
 */
export const TOWN_CAST: Readonly<Record<ActId, Record<Exclude<ServiceKind, 'stash'>, string>>> = {
  rootways: { vendor: 'fern', craft: 'pixel', gamble: 'sparks', hire: 'ember', quest: 'local' },
  cloister: { vendor: 'clover', craft: 'local', gamble: 'nova', hire: 'ember', quest: 'dusty' },
  sandglass: { vendor: 'local', craft: 'pixel', gamble: 'sparks', hire: 'nova', quest: 'byte' },
  frostbell: { vendor: 'fern', craft: 'pixel', gamble: 'sparks', hire: 'local', quest: 'marina' },
  gloom: { vendor: 'clover', craft: 'pixel', gamble: 'nova', hire: 'local', quest: 'luna' },
};
