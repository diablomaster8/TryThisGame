/**
 * localStorage behind try/catch. Private browsing, blocked storage and quota errors
 * must never crash the game; they just mean nothing is kept.
 *
 * Saves live in slots: three per mode (the campaign has eight, the Learning Grove six). Slot 1 of each mode keeps the key the game used before slots existed, so
 * nobody loses a Grove.
 */
import { C11_CHOICE_FLAGS, SAVE_SAFETY } from '../config/tuning';
import type { SideWorld } from '../sim/side-saves';
import { mirrorDelete, mirrorReadAll, mirrorWrite, newerCopy } from './save-mirror';
import { cleanSlotLabel } from '../sim/slot-label';
import type { SlotLabel } from '../sim/types';
import { backupOnWrite, dropCheckpoints, dropSlotStores } from './save-backups';
import {
  emptyIndex,
  loadIndexJson,
  parseIndex,
  storeIndex,
  withEntry,
  type SlotIndex,
} from './slot-index';
import { SAVE_LAYOUT } from '../config/tuning-camp11-save';
import {
  belongsInIdb,
  dropLive,
  forgetLive,
  liveLatest,
  preloadLive,
  resolveLive,
  writeLive,
} from './live-store';
import { archiveAllUnreadable, archiveUnreadable, putWithRoom, warnIfBig } from './save-room';
import {
  activateUnified,
  deactivateUnified,
  noteUnifiedLoad,
  readKey,
  unifiedActive,
  unifiedFlagOn,
  writeKey,
} from './unified-keys';
import { lastProfile } from './profiles';

export type SaveMode = 'free' | 'campaign' | 'edu' | StorylineMode;

/** The separate campaigns' modes (sim/storyline.ts): S1, S2, S3 and S4's two halves. */
export type StorylineMode = 'hundred' | 'logged' | 'beetle' | 'dawndusk';
export const STORYLINE_MODES: readonly StorylineMode[] = [
  'hundred',
  'logged',
  'beetle',
  'dawndusk',
];

export function isStorylineMode(mode: SaveMode): mode is StorylineMode {
  return (STORYLINE_MODES as readonly string[]).includes(mode);
}

export const SLOTS_PER_MODE = SAVE_LAYOUT.slotsPerMode;

/** R0621 (CAMP-29): Hazel's Grove has 8 slots; every other mode keeps 3. */
export function slotsFor(mode: SaveMode): number {
  if (mode === 'edu') return SAVE_LAYOUT.eduSlots;
  return mode === 'campaign' ? SAVE_LAYOUT.slotsPerProfile : SLOTS_PER_MODE;
}

/** The most slots any mode has. */
export const MAX_SLOTS = Math.max(
  SAVE_LAYOUT.slotsPerProfile,
  SLOTS_PER_MODE,
  SAVE_LAYOUT.eduSlots,
);

function clampIndex(slot: SaveSlot): number {
  return Math.max(1, Math.min(slotsFor(slot.mode), Math.floor(slot.index) || 1));
}

export interface SaveSlot {
  mode: SaveMode;
  /** 1-based. */
  index: number;
}

/**
 * R0626 (CAMP-34): who is playing. The Learning Grove's slots are the child profile `k1`;
 * every other slot belongs to the Keeper profile picked on the title (R0653, `p1` until one
 * is picked). Other Keeper profiles have slots only once the unified slots are on.
 */
export type ProfileId = string;

let keeper: ProfileId = 'p1';
/** R0653: the child profile whose Learning Grove slots are in play (`k1` until one is picked). */
let child: ProfileId = 'k1';
/** R0669: another profile's Grove open read-only, or null. */
let visiting: ProfileId | null = null;

export function profileOf(slot: SaveSlot): ProfileId {
  return slot.mode === 'edu' ? child : keeper;
}

/** The child profile whose Learning Grove slots the title and the game use. */
export function childProfile(): ProfileId {
  return child;
}

/**
 * R0653: play as another child profile. Its Learning Grove slots are unified slots like a
 * second Keeper's, so only `k1` exists before they are on. The slot index is rebuilt for it.
 */
export function setChildProfile(id: ProfileId): void {
  const next = /^k\d+$/.test(id) && (id === 'k1' || unifiedActive()) ? id : 'k1';
  if (next === child && indexProfileMatches()) return;
  child = next;
  try {
    rebuildSlotIndex();
  } catch {
    // Blocked storage: no index either.
  }
}

/** The Keeper profile whose slots the title and the game use. */
export function keeperProfile(): ProfileId {
  return keeper;
}

/**
 * R0653: play as another Keeper profile. The slot index is rebuilt for it, so the title shows
 * that profile's slots. Without the unified slots only `p1` exists.
 */
export function setKeeperProfile(id: ProfileId): void {
  const next = /^p\d+$/.test(id) && (id === 'p1' || unifiedActive()) ? id : 'p1';
  if (next === keeper && indexProfileMatches()) return;
  keeper = next;
  try {
    rebuildSlotIndex();
  } catch {
    // Blocked storage: no index either.
  }
}

/**
 * R0669 (CAMP-77): open another profile's slots read-only. While a visit is on, slots read
 * from that profile and every write (saves, erases, side saves) is refused, so neither save
 * changes. A reload ends it (it is never stored).
 */
export function beginVisit(profile: ProfileId): boolean {
  if (!unifiedActive() || !/^p\d+$/.test(profile) || profile === keeper) return false;
  visiting = profile;
  return true;
}

export function endVisit(): void {
  visiting = null;
}

export function visitingProfile(): ProfileId | null {
  return visiting;
}

/** The profile a slot is read from (a visit reads the visited Keeper's). */
function readerOf(slot: SaveSlot): ProfileId {
  return visiting && slot.mode !== 'edu' ? visiting : profileOf(slot);
}

/** R0598: a slot's key in a given profile, for reading or (claiming a free slot) writing. */
export function slotKeyFor(profile: ProfileId, slot: SaveSlot, write = false): string {
  const raw = legacySlotKey(slot);
  return write ? writeKey(profile, raw) : readKey(profile, raw);
}

/** R0669: a slot's summary in another profile (the title's Visit list). */
export function readSlotSummaryOf(profile: ProfileId, slot: SaveSlot): SaveSummary | null {
  try {
    const json = getSlotJson(slotKeyFor(profile, slot));
    return json === null ? null : summarize(json);
  } catch {
    return null;
  }
}

export function isChildProfile(profile: ProfileId): boolean {
  return profile.startsWith('k');
}

/** The modes a profile's slots come from. */
export function profileModes(profile: ProfileId): SaveMode[] {
  return isChildProfile(profile) ? ['edu'] : ['campaign', ...STORYLINE_MODES, 'free'];
}

/** A slot's save, with a big save's IndexedDB pointer (R0668) resolved. Throws if blocked. */
function getSlotJson(key: string): string | null {
  return resolveLive(key, localStorage.getItem(key));
}

/** A slot's save as text (null when empty or blocked), pointers resolved. Never throws. */
export function readSlotJson(slot: SaveSlot): string | null {
  try {
    return getSlotJson(slotKey(slot));
  } catch {
    return null;
  }
}

/**
 * Write a slot's save: in localStorage, or (R0668, flag on) in IndexedDB behind a pointer.
 * Frees archived unreadable copies and retries once on a full store (R0623). False when
 * nothing was written.
 */
function putSlotJson(key: string, json: string): boolean {
  warnIfBig(key, json);
  if (belongsInIdb(json)) {
    // R0668: the autosave on hide must survive the tab being killed before IndexedDB
    // answers, so a hidden page also writes the full text now (a stall nobody sees); the
    // pointer replaces it once IndexedDB holds the save.
    if (typeof document !== 'undefined' && document.hidden)
      putWithRoom(() => localStorage.setItem(key, json));
    void writeLive(key, json, (stub) => {
      putWithRoom(() => localStorage.setItem(key, stub));
    }).then((ok) => {
      // No IndexedDB after all: keep it the old way rather than only in this page.
      if (!ok && liveLatest(key, json)) putWithRoom(() => localStorage.setItem(key, json));
    });
    return true;
  }
  forgetLive(key);
  return putWithRoom(() => localStorage.setItem(key, json));
}

/** R0598: a save under any storage key, pointer resolved (null when empty or blocked). */
export function readKeyJson(key: string): string | null {
  try {
    return getSlotJson(key);
  } catch {
    return null;
  }
}

/** R0598: write a save under a storage key as a slot write does (room, big saves). */
export function writeKeyJson(key: string, json: string): boolean {
  try {
    return putSlotJson(key, json);
  } catch {
    return false;
  }
}

const LEGACY_KEYS: Record<SaveMode, string> = {
  free: 'grove.save.v1',
  campaign: 'grove.save.campaign',
  edu: 'grove.save.edu',
  hundred: 'grove.save.hundred',
  logged: 'grove.save.logged',
  beetle: 'grove.save.beetle',
  dawndusk: 'grove.save.dawndusk',
};

/** A slot's own key, as before the unified slots (the migration and the archive use it). */
export function legacySlotKey(slot: SaveSlot): string {
  const index = clampIndex(slot);
  return index === 1 ? LEGACY_KEYS[slot.mode] : `grove.save.${slot.mode}.${index}`;
}

/**
 * The key a slot is read from: its legacy key, or (R0598, once the unified slots are on) the
 * unified slot that holds it in the profile playing (or visited).
 */
export function slotKey(slot: SaveSlot): string {
  return slotKeyFor(readerOf(slot), slot);
}

/** The key a write to `slot` goes to (an unmapped slot claims a free unified slot first). */
function writeSlotKey(slot: SaveSlot): string {
  return slotKeyFor(profileOf(slot), slot, true);
}

let current: SaveSlot = { mode: 'free', index: 1 };

/** The key of the slot in play, worked out each time: a first write may move it (R0598). */
function saveKey(): string {
  return slotKey(current);
}

/** Which save the game reads and writes. */
export function setSaveSlot(slot: SaveSlot): void {
  current = { mode: slot.mode, index: slot.index };
}

export function currentSlot(): SaveSlot {
  return { ...current };
}

export function hasSave(slot: SaveSlot): boolean {
  try {
    return localStorage.getItem(slotKey(slot)) !== null;
  } catch {
    return false;
  }
}

/**
 * A slot's id for the mirror, the index, backups and checkpoints: `mode:index` for `p1` and
 * `k1` (as always), `<profile>/mode:index` for any other profile (R0653), so two Keepers'
 * Slot 1 never share a mirror or a checkpoint.
 */
function mirrorKey(slot: SaveSlot, profile: ProfileId = readerOf(slot)): string {
  const id = `${slot.mode}:${clampIndex(slot)}`;
  return profile === 'p1' || profile === 'k1' ? id : `${profile}/${id}`;
}

/**
 * Once at boot, before any slot is read: puts back any IndexedDB copy that is newer than
 * (or missing from) localStorage, which a browser may have cleared. Never throws.
 */
export async function restoreFromMirror(): Promise<number> {
  let restored = 0;
  // R0598: the unified slots (if the move has run) are mapped before any slot is read.
  // (activateUnified lives in unified-keys, so the title never waits on the migration chunk.)
  activateUnified();
  setKeeperProfile(lastProfile());
  // R0653: a child played last: their Learning Grove slots are the ones in play.
  setChildProfile(lastProfile());
  await bootStores();
  try {
    for (const { key, json } of await mirrorReadAll()) {
      const [owner, id] = key.includes('/') ? key.split('/', 2) : [null, key];
      const [mode, idx] = (id ?? '').split(':');
      const index = Number(idx);
      if (!mode || !(mode in LEGACY_KEYS) || !Number.isInteger(index)) continue;
      const slot = { mode: mode as SaveMode, index };
      const profile = owner ?? (mode === 'edu' ? 'k1' : 'p1');
      // Another Keeper's mirror needs that Keeper's slots, which exist only when mapped.
      if (owner && !unifiedActive()) continue;
      try {
        if (newerCopy(getSlotJson(slotKeyFor(profile, slot)), json) === 'mirror') {
          localStorage.setItem(slotKeyFor(profile, slot, true), json);
          restored += 1;
          if (profile === profileOf(slot)) indexWritten(slot, json, false);
        }
      } catch {
        // Blocked localStorage: nothing to restore into.
      }
    }
  } catch {
    // No mirror.
  }
  // R0598 stage B: the move itself (once), then keeping the copies current and step 8.
  if (!unifiedFlagOn()) {
    deactivateUnified();
  } else {
    const unified = await import('./migrate-unified').catch(() => null);
    try {
      if (unified && (await unified.bootUnified(Date.now()))) {
        await bootStores();
        rebuildSlotIndex();
      }
    } catch {
      // The legacy keys still hold every save; the game plays them.
    }
  }
  return restored;
}

export function clearSlot(slot: SaveSlot): boolean {
  if (visiting) return false;
  mirrorDelete(mirrorKey(slot));
  dropLive(slotKey(slot));
  void dropSlotStores(mirrorKey(slot));
  indexCleared(slot);
  clearThumb(slot);
  try {
    localStorage.removeItem(slotKey(slot));
    return true;
  } catch {
    return false;
  }
}

/** Copy one slot's save over another (same mode or not). */
export function copySlot(from: SaveSlot, to: SaveSlot): boolean {
  try {
    if (visiting) return false;
    const json = getSlotJson(slotKey(from));
    if (json === null) return false;
    if (!putSlotJson(writeSlotKey(to), json)) return false;
    mirrorWrite(mirrorKey(to), json);
    indexWritten(to, json, false);
    return true;
  } catch {
    return false;
  }
}

/**
 * Lane C r11 (R0618): put a save's JSON (a chapter checkpoint) into a slot, as a copy does.
 * False when nothing was written; the caller has already asked before filling a slot.
 */
export function writeSlotFrom(to: SaveSlot, json: string): boolean {
  try {
    if (visiting) return false;
    if (!putSlotJson(writeSlotKey(to), json)) return false;
    mirrorWrite(mirrorKey(to), json);
    indexWritten(to, json, false);
    return true;
  } catch {
    return false;
  }
}

/** What the title screen shows for a slot, read from the save without loading it. */
export interface SaveSummary {
  savedAtWallMs: number;
  nubbins: number;
  /** The first few Nubbin names. */
  names: string[];
  trainer: string | null;
  chapter: number | null;
  /** A separate campaign's id and its ending, once reached. */
  storyline: string | null;
  ending: string | null;
  eduAge: number | null;
  /** The Learning Grove band: a `reader` save shows 7–10, not its games' top age. */
  eduBand: string | null;
  /** Sim time lived in this Grove. */
  playMs: number;
  /** Lane C r8 (R0648): the questlines beside Hazel's Grove, and side stories and capers done. */
  lines?: Record<string, 'active' | 'done'>;
  questsDone?: number;
  /** Lane C r11 (R0667): the signature choices this slot made, `flag -> value`, for Compare. */
  choices?: Record<string, string>;
  /** Lane C r10 agent B (R0649): the slot's name and tag. */
  label?: SlotLabel;
  /* Lane E r9, R0696: the child's name, animal icon and colour tag (Learning Grove). */
  eduName?: string;
  eduIcon?: string;
  eduColour?: string;
  /** Lane E r10, R0735: a reader's age, 7 to 10, once a grown-up picked it. */
  eduReaderAge?: number;
}

/** R0648: the lines and the finished quests a save holds, read defensively from its JSON. */
function storySummary(
  w: Record<string, unknown>,
): Pick<SaveSummary, 'lines' | 'questsDone' | 'choices'> {
  const lines: Record<string, 'active' | 'done'> = {};
  const raw = (w.lines ?? {}) as Record<string, { ending?: unknown } | null>;
  if (raw && typeof raw === 'object')
    for (const [id, l] of Object.entries(raw))
      if (l && typeof l === 'object') lines[id] = typeof l.ending === 'string' ? 'done' : 'active';
  const c = (w.campaign ?? null) as { side?: unknown; fun?: unknown } | null;
  let questsDone = 0;
  for (const store of [c?.side, c?.fun])
    if (store && typeof store === 'object')
      for (const st of Object.values(store as Record<string, { status?: unknown }>))
        if (st?.status === 'done') questsDone += 1;
  // R0667: the signature choices, read from the spine's flags and every line's.
  const choices: Record<string, string> = {};
  const flagSets = [
    (c as { flags?: unknown } | null)?.flags,
    ...Object.values((w.lines ?? {}) as Record<string, { flags?: unknown } | null>).map(
      (l) => l?.flags,
    ),
  ];
  for (const flags of flagSets)
    if (flags && typeof flags === 'object')
      for (const k of C11_CHOICE_FLAGS) {
        const v = (flags as Record<string, unknown>)[k];
        if (v !== undefined && choices[k] === undefined) choices[k] = String(v);
      }
  return { lines, questsDone, choices };
}

/** Pure: a summary from a save's JSON, or null when it cannot be read. */
export function summarize(json: string): SaveSummary | null {
  try {
    const data = JSON.parse(json) as { savedAtWallMs?: unknown; world?: unknown };
    const w = (data.world ?? null) as Record<string, unknown> | null;
    if (!w || typeof w !== 'object') return null;
    const nubbins = Array.isArray(w.nubbins) ? (w.nubbins as Array<{ name?: unknown }>) : [];
    const campaign = (w.campaign ?? null) as {
      chapter?: unknown;
      storyline?: unknown;
      ending?: unknown;
    } | null;
    const edu = (w.edu ?? null) as {
      age?: unknown;
      band?: unknown;
      childName?: unknown;
      icon?: unknown;
      tagColour?: unknown;
      readerAge?: unknown;
    } | null;
    return {
      savedAtWallMs: typeof data.savedAtWallMs === 'number' ? data.savedAtWallMs : 0,
      nubbins: nubbins.length,
      names: nubbins
        .map((n) => (typeof n.name === 'string' ? n.name : ''))
        .filter((n) => n.length > 0)
        .slice(0, 3),
      trainer: typeof w.trainer === 'string' ? w.trainer : null,
      chapter: campaign && typeof campaign.chapter === 'number' ? campaign.chapter : null,
      storyline: campaign && typeof campaign.storyline === 'string' ? campaign.storyline : null,
      ending: campaign && typeof campaign.ending === 'string' ? campaign.ending : null,
      eduAge: edu && typeof edu.age === 'number' ? edu.age : null,
      eduBand: edu && typeof edu.band === 'string' ? edu.band : null,
      playMs: typeof w.timeMs === 'number' ? w.timeMs : 0,
      ...storySummary(w),
      ...labelOf(w),
      /* Lane E r9, R0696 */
      ...(edu && typeof edu.childName === 'string' && edu.childName.trim()
        ? { eduName: edu.childName.trim() }
        : {}),
      ...(edu && typeof edu.icon === 'string' ? { eduIcon: edu.icon } : {}),
      ...(edu && typeof edu.tagColour === 'string' ? { eduColour: edu.tagColour } : {}),
      /* Lane E r10, R0735 */
      ...(edu && typeof edu.readerAge === 'number' ? { eduReaderAge: edu.readerAge } : {}),
    };
  } catch {
    return null;
  }
}

export function readSlotSummary(slot: SaveSlot): SaveSummary | null {
  try {
    const json = getSlotJson(slotKey(slot));
    return json === null ? null : summarize(json);
  } catch {
    return null;
  }
}

/** Has storyline `id` reached an ending in any slot of `mode` (Dawn unlocks Dusk and back). */
export function storylineFinished(mode: SaveMode, id: string): boolean {
  const index_ = readSlotIndex();
  for (let index = 1; index <= slotsFor(mode); index++) {
    const s = index_.slots[slotId({ mode, index })]?.summary;
    if (s && s.storyline === id && s.ending !== null) return true;
  }
  return false;
}

export function readSave(): string | null {
  try {
    return getSlotJson(saveKey());
  } catch {
    return null;
  }
}

/** R0598 step 8: the slot in play loaded into a game (counted only for a unified slot). */
export function noteSlotLoaded(): number {
  return visiting ? 0 : noteUnifiedLoad(saveKey());
}

export function writeSave(json: string): boolean {
  try {
    // R0669: a visit never writes the Grove it looks at.
    if (visiting) return false;
    if (!putSlotJson(writeSlotKey(current), json)) return false;
    mirrorWrite(mirrorKey(current), json);
    indexWritten(current, json, true);
    backupOnWrite(mirrorKey(current), json, Date.now());
    return true;
  } catch {
    return false;
  }
}

export function clearSave(): boolean {
  if (visiting) return false;
  const SAVE_KEY = saveKey();
  mirrorDelete(mirrorKey(current));
  dropLive(SAVE_KEY);
  // A reset keeps the backups (a mis-tap can be undone) but its chapters start over.
  void dropCheckpoints(mirrorKey(current));
  indexCleared(current);
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

// ---------- unreadable saves ----------

/**
 * A save that fails to load (corrupt, or from a newer version of the game) is copied
 * beside its slot before the game starts fresh, so the autosave never destroys the only
 * copy. Fixed rotating keys rather than timestamps: no key listing is needed, and a
 * reload of the same broken save does not push an older copy out.
 */
export function unreadableKey(slot: SaveSlot, n: number): string {
  // `p1` and `k1` keep their copies beside the legacy key, where older copies already are.
  const profile = readerOf(slot);
  const base = profile === 'p1' || profile === 'k1' ? legacySlotKey(slot) : slotKey(slot);
  return `${base}.unreadable.${n}`;
}

/** Keep `json` as the newest unreadable copy for `slot`. False when storage refused it. */
export function backupUnreadable(slot: SaveSlot, json: string): boolean {
  if (visiting) return false;
  try {
    if (localStorage.getItem(unreadableKey(slot, 1)) === json) return true;
    for (let n = SAVE_SAFETY.unreadableKept; n > 1; n--) {
      const older = localStorage.getItem(unreadableKey(slot, n - 1));
      if (older !== null) localStorage.setItem(unreadableKey(slot, n), older);
    }
    localStorage.setItem(unreadableKey(slot, 1), json);
    // R0623: kept in IndexedDB too, so a full store can free it without losing it.
    void archiveUnreadable(unreadableKey(slot, 1), json);
    return true;
  } catch {
    return false;
  }
}

/** The unreadable copies kept for `slot`, newest first. */
export function readUnreadable(slot: SaveSlot): string[] {
  const out: string[] = [];
  for (let n = 1; n <= SAVE_SAFETY.unreadableKept; n++) {
    try {
      const json = localStorage.getItem(unreadableKey(slot, n));
      if (json !== null) out.push(json);
    } catch {
      // Blocked storage reads as nothing kept.
    }
  }
  return out;
}

/**
 * Pure: which mode a save's world belongs to, so an import cannot put a campaign into a
 * Learning Grove slot. The Learning Grove wins over its own story; a separate campaign
 * names its storyline (Dawn and Dusk share one mode); any other story is Hazel's Grove.
 */
export function modeOfWorld(world: {
  edu?: unknown;
  campaign?: { storyline?: unknown } | null;
}): SaveMode {
  if (world.edu) return 'edu';
  const campaign = world.campaign;
  if (!campaign) return 'free';
  const storyline = campaign.storyline;
  if (storyline === 'dawn' || storyline === 'dusk') return 'dawndusk';
  if (typeof storyline === 'string' && isStorylineMode(storyline as SaveMode)) {
    return storyline as StorylineMode;
  }
  return 'campaign';
}

/**
 * Calls `onChange` when another tab writes or clears the slot this tab plays (the browser
 * fires `storage` only in the other tabs). Returns a function that stops listening.
 */
export function watchOtherTabs(onChange: () => void): () => void {
  const listener = (e: StorageEvent): void => {
    // A null key means another tab cleared all of storage.
    if (e.key === saveKey() || e.key === null) onChange();
  };
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}

/**
 * Lane C r7 (R0658): say "this slot is mine" to every other tab of the game, at once rather
 * than after the first autosave. A tab already on the same slot hears it and calls `onTaken`
 * (it stops saving and says so); tabs on other slots ignore it. The newest tab wins, so two
 * tabs on one slot never both write. Without BroadcastChannel the storage-event watch above
 * still covers it.
 */
export function claimSlot(onTaken: () => void): () => void {
  // A visit only looks: the owner's tab keeps its slot.
  if (visiting || typeof BroadcastChannel === 'undefined') return () => undefined;
  let channel: BroadcastChannel;
  try {
    channel = new BroadcastChannel('grove-slots');
  } catch {
    return () => undefined;
  }
  const me = `${Date.now()}-${Math.floor(performance.now() * 1000)}`;
  channel.onmessage = (e: MessageEvent<{ key?: string; from?: string }>) => {
    if (e.data?.key === saveKey() && e.data.from !== me) onTaken();
  };
  try {
    channel.postMessage({ key: saveKey(), from: me });
  } catch {
    // A closed or unavailable channel leaves the storage-event watch in charge.
  }
  return () => channel.close();
}

export function storageAvailable(): boolean {
  try {
    const probe = `${saveKey()}.probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Offer a text file for download. */
export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Ask the user for a file and read it as text. Resolves null if cancelled. */
export function pickTextFile(accept = 'application/json,.json'): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      file
        .text()
        .then((t) => resolve(t))
        .catch(() => resolve(null));
    });
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

// ---------- device-wide preferences ----------

const GRAPHICS_KEY = 'grove.graphics';

/**
 * The renderer chosen on the title screen: a device-wide preference, because it is
 * picked before any save is open. The save's `settings.graphics` mirrors it.
 */
const RESUME_KEY = 'grove.resume';

/**
 * Remember the slot in play across one reload (a Graphics change), so the game comes back
 * to it instead of the title. Session storage: it never outlives the tab.
 */
export function markResumeSlot(slot: SaveSlot): void {
  // A visit is never resumed: the reload would land in the visitor's own slot.
  if (visiting) return;
  try {
    sessionStorage.setItem(RESUME_KEY, JSON.stringify(slot));
  } catch {
    // No session storage: the reload lands on the title, as before.
  }
}

/** R0669: whether a slot is marked to come back to (a visit begun in the game left one). */
export function hasResumeSlot(): boolean {
  try {
    return sessionStorage.getItem(RESUME_KEY) !== null;
  } catch {
    return false;
  }
}

/** The slot marked before a reload, once; null when there is none or it is not a real slot. */
export function takeResumeSlot(): SaveSlot | null {
  try {
    const raw = sessionStorage.getItem(RESUME_KEY);
    sessionStorage.removeItem(RESUME_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<SaveSlot>;
    if (typeof s.mode !== 'string' || !(s.mode in LEGACY_KEYS) || typeof s.index !== 'number')
      return null;
    const slot = { mode: s.mode as SaveMode, index: s.index };
    return hasSave(slot) ? slot : null;
  } catch {
    return null;
  }
}

/**
 * The renderer picked in this page's life. With storage blocked the pick cannot be written,
 * but the game it starts must still use it, not silently fall back to Pixel (review D, 13).
 */
let graphicsChoice: 'pixel' | '3d' | null = null;

export function readGraphicsPref(): 'pixel' | '3d' {
  if (graphicsChoice) return graphicsChoice;
  try {
    return localStorage.getItem(GRAPHICS_KEY) === '3d' ? '3d' : 'pixel';
  } catch {
    return 'pixel';
  }
}

export function writeGraphicsPref(mode: 'pixel' | '3d'): boolean {
  graphicsChoice = mode;
  try {
    localStorage.setItem(GRAPHICS_KEY, mode);
    return true;
  } catch {
    return false;
  }
}

// ---------- the side saves (canon 21, 29, 30) ----------

/**
 * The Atlas, Pixel's Arcade, the Multiverse and Neopia each keep one save of their own on this
 * device, apart from every Grove slot above. They may read a Grove save; nothing here
 * ever writes one.
 */
export type SideSave = SideWorld;

export const SIDE_SAVES: readonly SideSave[] = ['atlas', 'arcade', 'multiverse', 'neopia'];

/** The key side saves used before profiles; profile p1 reads it until it writes its own. */
export function legacySideKey(which: SideSave): string {
  return `grove.side.${which}`;
}

/** R0626 (CAMP-34): a profile's own side save, `grove.side.<world>.<profile>`. */
export function profileSideKey(which: SideSave, profile: ProfileId): string {
  return `grove.side.${which}.${profile}`;
}

/** The side save of the profile playing now. */
export function sideKey(which: SideSave): string {
  return profileSideKey(which, profileOf(current));
}

/** A child profile never has a Multiverse save (it is `adult`). */
function sideAllowed(which: SideSave, profile: ProfileId): boolean {
  return !(which === 'multiverse' && isChildProfile(profile));
}

export function readSide(which: SideSave): string | null {
  const profile = profileOf(current);
  if (!sideAllowed(which, profile)) return null;
  try {
    const own = localStorage.getItem(profileSideKey(which, profile));
    if (own !== null || profile !== 'p1') return own;
    // Profile p1 inherits the device-wide side save kept before profiles.
    return localStorage.getItem(legacySideKey(which));
  } catch {
    return null;
  }
}

export function writeSide(which: SideSave, json: string): boolean {
  const profile = profileOf(current);
  if (visiting) return false;
  if (!sideAllowed(which, profile)) return false;
  try {
    localStorage.setItem(profileSideKey(which, profile), json);
    return true;
  } catch {
    return false;
  }
}

export function clearSide(which: SideSave): boolean {
  const profile = profileOf(current);
  if (visiting) return false;
  try {
    localStorage.removeItem(profileSideKey(which, profile));
    // Else the old device-wide save would show through again.
    if (profile === 'p1') localStorage.removeItem(legacySideKey(which));
    return true;
  } catch {
    return false;
  }
}

/** Every Grove save on this device that a side save may read (never the Learning Grove). */
export function readGroveSaves(): string[] {
  const out: string[] = [];
  for (const mode of ['free', 'campaign'] as const) {
    for (let index = 1; index <= slotsFor(mode); index++) {
      try {
        const json = getSlotJson(slotKey({ mode, index }));
        if (json !== null) out.push(json);
      } catch {
        // Blocked storage reads as no save.
      }
    }
  }
  return out;
}

/** R0626: what the story worlds look at, per profile: the slot in play, or every slot. */
export type WorldsRead = 'slot' | 'every';

function worldsReadKey(profile: ProfileId): string {
  return `grove.worlds.read.${profile}`;
}

export function readWorldsRead(): WorldsRead {
  try {
    return localStorage.getItem(worldsReadKey(profileOf(current))) === 'every' ? 'every' : 'slot';
  } catch {
    return 'slot';
  }
}

export function writeWorldsRead(v: WorldsRead): boolean {
  try {
    localStorage.setItem(worldsReadKey(profileOf(current)), v);
    return true;
  } catch {
    return false;
  }
}

/**
 * R0626: the Grove saves a story world may read when it opens. By default only the slot in
 * play (so a variant follows the save being played); "every slot" is the old reading. The
 * Learning Grove reads none.
 */
export function readStoryWorldSaves(): string[] {
  if (current.mode === 'edu') return [];
  if (readWorldsRead() === 'every') return readGroveSaves();
  const json = readSlotJson(current);
  return json === null ? [] : [json];
}

/** Every slot key a profile owns, for backups and the big-save preload. */
export function slotKeysOf(modes: readonly SaveMode[]): Array<{ slot: SaveSlot; key: string }> {
  const out: Array<{ slot: SaveSlot; key: string }> = [];
  for (const mode of modes)
    for (let index = 1; index <= slotsFor(mode); index++)
      out.push({ slot: { mode, index }, key: slotKey({ mode, index }) });
  return out;
}

const ALL_MODES = Object.keys(LEGACY_KEYS) as SaveMode[];

/** At boot: big saves into memory (R0668), unreadable copies into IndexedDB (R0623). */
async function bootStores(): Promise<void> {
  try {
    // The legacy keys too: the unified move and its catch-up read them (R0598).
    const keys = new Set(
      slotKeysOf(ALL_MODES).flatMap(({ slot, key }) => [key, legacySlotKey(slot)]),
    );
    const entries = [...keys].map((key) => {
      try {
        return { key, raw: localStorage.getItem(key) };
      } catch {
        return { key, raw: null };
      }
    });
    await preloadLive(entries);
    await archiveAllUnreadable();
  } catch {
    // Either can fail alone; the game runs on localStorage.
  }
}

// ---------- the slot index (lane C r10 agent B: R0622, R0649) ----------

/** A slot's id in the index, the mirror and IndexedDB: `mode:index`. */
export function slotId(slot: SaveSlot): string {
  return mirrorKey(slot);
}

/** R0649: the label a save's world carries, as a summary field. */
function labelOf(w: Record<string, unknown>): Pick<SaveSummary, 'label'> {
  const label = cleanSlotLabel(w.slotLabel);
  return label ? { label } : {};
}

function indexWritten(slot: SaveSlot, json: string, played: boolean): void {
  const summary = summarize(json);
  if (!summary) return;
  const index = parseIndex(loadIndexJson()) ?? rebuildSlotIndex();
  storeIndex(withEntry(index, slotId(slot), { summary, bytes: json.length * 2 }, played));
}

/** R0622: a save put back by another path (the title's Recently erased) joins the index. */
export function indexRestored(slot: SaveSlot, json: string): void {
  try {
    indexWritten(slot, json, false);
  } catch {
    // Blocked storage: the next read rebuilds the index.
  }
}

function indexCleared(slot: SaveSlot): void {
  const index = parseIndex(loadIndexJson());
  // No index yet: the next read rebuilds it from the saves that are left.
  if (index) storeIndex(withEntry(index, slotId(slot), null));
}

const INDEX_PROFILE_KEY = 'grove.index.profile';

/** What the index is built for: the Keeper alone while the child is `k1` (as before), else both. */
function indexOwner(): string {
  return child === 'k1' ? keeper : `${keeper}|${child}`;
}

/** Was the slot index built for the Keeper profile in play (none recorded means `p1`). */
function indexProfileMatches(): boolean {
  try {
    return (localStorage.getItem(INDEX_PROFILE_KEY) ?? 'p1') === indexOwner();
  } catch {
    return true;
  }
}

/** Scan every slot's save and write a fresh index (the index was missing or broken). */
export function rebuildSlotIndex(): SlotIndex {
  let index = emptyIndex();
  // R0653: the index holds the slots of one Keeper profile; this says which.
  try {
    localStorage.setItem(INDEX_PROFILE_KEY, indexOwner());
  } catch {
    // Blocked: the index cannot be written either.
  }
  for (const mode of Object.keys(LEGACY_KEYS) as SaveMode[]) {
    for (let index_ = 1; index_ <= slotsFor(mode); index_++) {
      const slot = { mode, index: index_ };
      try {
        const json = getSlotJson(slotKey(slot));
        const summary = json === null ? null : summarize(json);
        if (json !== null && summary)
          index = withEntry(index, slotId(slot), { summary, bytes: json.length * 2 });
      } catch {
        // Blocked storage: an empty index.
      }
    }
  }
  storeIndex(index);
  return index;
}

/** The title's one read: the index, rebuilt by scanning only when missing or corrupt. */
export function readSlotIndex(): SlotIndex {
  return parseIndex(loadIndexJson()) ?? rebuildSlotIndex();
}

/**
 * R0649: name and tag a slot. The label goes into the save's world (so it travels with an
 * export and a backup) and into the index. Null clears it. False when nothing was written.
 */
export function labelSlot(slot: SaveSlot, label: SlotLabel | null): boolean {
  try {
    if (visiting) return false;
    const key = slotKey(slot);
    const json = getSlotJson(key);
    if (json === null) return false;
    const data = JSON.parse(json) as { world?: Record<string, unknown> };
    if (!data.world || typeof data.world !== 'object') return false;
    const clean = cleanSlotLabel(label);
    if (clean) data.world.slotLabel = clean;
    else delete data.world.slotLabel;
    const next = JSON.stringify(data);
    if (!putSlotJson(key, next)) return false;
    mirrorWrite(mirrorKey(slot), next);
    indexWritten(slot, next, false);
    return true;
  } catch {
    return false;
  }
}

// ---------- slot thumbnails (R0447) ----------

/** Largest thumbnail kept, as characters of the data URL (about 12 kB). */
export const THUMB_MAX_CHARS = 12000;

const thumbKey = (slot: SaveSlot): string => `grove.thumb.${slotId(slot)}`;

/** Keep a small picture of the Grove with a slot; false when too big or storage is blocked. */
export function writeThumb(slot: SaveSlot, dataUrl: string): boolean {
  if (dataUrl.length > THUMB_MAX_CHARS) return false;
  try {
    localStorage.setItem(thumbKey(slot), dataUrl);
    return true;
  } catch {
    return false;
  }
}

/** The slot's thumbnail, or null when it has none (only an image data URL is returned). */
export function readThumb(slot: SaveSlot): string | null {
  try {
    const v = localStorage.getItem(thumbKey(slot));
    return v && v.startsWith('data:image/') && v.length <= THUMB_MAX_CHARS ? v : null;
  } catch {
    return null;
  }
}

export function clearThumb(slot: SaveSlot): void {
  try {
    localStorage.removeItem(thumbKey(slot));
  } catch {
    // Blocked storage: nothing to remove.
  }
}
