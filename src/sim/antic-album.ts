/**
 * R0564 (SOUL-47) and R0588 (SOUL-71), lane A round 11: the Antics album and the Fridge.
 *
 * The album stamps each quirk, antic and idle act the Keeper has actually watched: the
 * renderer-side UI reports a Nubbin that is in view while it does one (`sawAntic`), and the
 * sim stamps the page once, pays a one-time Shells prize at 10, 20 and 40 stamps, and says so
 * with an `albumStamp` event. Nothing is asked of the player twice: no chores, no streaks.
 *
 * The Fridge keeps up to 30 of the crayon doodles the drawing lessons leave, so the ones that
 * fade from the ground can be kept. Both live in optional world fields (no save bump).
 * Pure rules: no DOM, no Three.js, no rng.
 */
import { ALBUM } from '../config/tuning-soul-r11b';
import type { Nubbin, SimEvent, World } from './types';

/** The pages, in album order: the behaviour item that shows each. */
export const ALBUM_IDS: readonly string[] = [
  // The four antics.
  'trip',
  'sneeze',
  'hiccup',
  'chaseTail',
  // The personality quirks.
  'twirl',
  'sneak',
  'hideFace',
  'watch',
  'doze',
  'roam',
  'peer',
  'poke',
  'comfort',
  'offerFruit',
  'tend',
  'lead',
  'splash',
  'flex',
  'cloudGaze',
  'butterfly',
  'daydream',
  // Idle acts of the hour, the mood and the day.
  'yawn',
  'stretch',
  'stargaze',
  'harrumph',
  'nodOff',
  'hum',
  'burp',
  'groomSelf',
  'rubEyes',
  'inspect',
  'fireflies',
  'peekTree',
  'cottageHide',
  'sniffle',
  'tug',
  // Calls and flinches.
  'callKeeper',
  'callFruit',
  'cryStomp',
  'flinch',
];

export const isAlbumId = (id: string | null | undefined): boolean => !!id && ALBUM_IDS.includes(id);

export function stampCount(world: Pick<World, 'album'>): number {
  return Object.keys(world.album ?? {}).length;
}

/** The Shells prize paid on reaching `count` stamps, or 0 when it is not a prize count. */
export function prizeAt(count: number): number {
  return ALBUM.prizes[count] ?? 0;
}

/**
 * The renderer saw this Nubbin doing something. Stamps the page if it is new and returns
 * the id stamped, else null. Pays the prize once per milestone.
 */
export function sawAntic(world: World, n: Nubbin, events: SimEvent[]): string | null {
  const id = n.behavior.itemId;
  if (!isAlbumId(id) || n.stage === 'egg') return null;
  const album = (world.album ??= {});
  if (album[id!] !== undefined) return null;
  album[id!] = world.timeMs;
  const count = stampCount(world);
  events.push({ kind: 'albumStamp', nubbinId: n.id, entry: id!, count });
  const prize = prizeAt(count);
  const paid = (world.albumPaid ??= []);
  if (prize > 0 && !paid.includes(count)) {
    paid.push(count);
    world.inventory.shells += prize;
    events.push({ kind: 'albumPrize', count, shells: prize });
  }
  return id!;
}

/** Keep a doodle on the Fridge (the newest 30). Called when a drawing is made. */
export function pinDoodle(world: World, n: Nubbin, doodleId: number, now: number): void {
  const fridge = (world.fridge ??= []);
  fridge.push({ nubbinId: n.id, doodleId, atMs: now });
  if (fridge.length > ALBUM.fridgeMax) fridge.splice(0, fridge.length - ALBUM.fridgeMax);
}
