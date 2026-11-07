/**
 * What a tap on the Grove does: a memorial, a building, a plant, a decoration or a Nubbin
 * (TECH-24: the HUD's onSelect hook, split out of hud.ts).
 */
import { UI_TEXT } from '../config/strings';
import { outerTapOf } from '../config/outer-ring';
import type { Game } from '../game';
import type { MemorialCard } from './collection';
import type { CuriosityWatch } from './curiosities';
import type { DecorateMenu } from './decorate';
import type { DungeonMenu } from './dungeon';
import type { GymMenu } from './gym';
import type { KarateMenu } from './karate';
import type { KindergartenMenu } from './kindergarten';
import type { EduScreen } from './edu';
import type { PocketMode } from './pocket';
import type { ShopMenu } from './shop';
import type { StatsSheet } from './stats-sheet';
import type { StoryShelf } from './atlas';
import { outerLine } from './outer-gag';
import { tapToy } from './tap-toy';
import { villageTap } from './village-tap';

export interface SelectCtx {
  game: () => Game | null;
  curiosities: CuriosityWatch;
  memorialCard: MemorialCard;
  kindergarten: KindergartenMenu;
  edu: EduScreen;
  karate: KarateMenu;
  pocket: PocketMode;
  sheet: StatsSheet;
  decorate: DecorateMenu;
  atlas: StoryShelf;
  cabinet: StoryShelf;
  rift: StoryShelf;
  neoGate: StoryShelf;
  dungeon: DungeonMenu;
  shop: ShopMenu;
  gym: GymMenu;
  toast: (text: string, ms?: number) => void;
}

export function handleSelect(c: SelectCtx, id: string | null): void {
  const { game, curiosities, memorialCard, kindergarten, karate, pocket, sheet, decorate } = c;
  const { edu } = c;
  const { atlas, cabinet, rift, neoGate, dungeon, shop, gym, toast } = c;

  const g = game();
  curiosities.onSelect(id); /* Lane E r9 */
  if (id?.startsWith('memorial:') && g) {
    const m = g.world.memorials.find((x) => x.id === id.slice('memorial:'.length));
    if (m) memorialCard.show(m);
    return;
  }
  if (id?.startsWith('building:') && g) {
    const which = id.slice('building:'.length);
    // R0742: in the Learning Grove the hut is the door to Play & learn.
    if (which === 'school') (g.world.edu ? edu : kindergarten).open();
    else if (which === 'dojo') karate.open();
    // R0527 (lane A r10): a Nubbin hiding inside is coaxed out by a tap on the door.
    else if (which === 'cottage' && g.world.nubbins.some((n) => n.cottageHide))
      g.send({ kind: 'coaxOut' });
    else if (which === 'cottage') pocket.open(sheet.selectedId);
    else if (which === 'workshop') decorate.open('workshop');
    // R0630: the doors to the story worlds, tapped in the Grove.
    else if (which === 'door-atlas') atlas.open();
    else if (which === 'door-cabinet') cabinet.open();
    else if (which === 'door-rift') rift.open();
    else if (which === 'door-gate') neoGate.open();
    else if (which === 'nursery') toast(UI_TEXT.nurseryTap);
    else if (which === 'bathhouse') toast(UI_TEXT.bathhouseTap);
    else if (which === 'host') g.send({ kind: 'neighbourGift' });
    else if (which === 'windmill') toast(UI_TEXT.windmillTap);
    else if (which === 'cave') dungeon.open();
    // R0072: an outer-ring piece answers with its line.
    // R0129: and a gag on later taps (`ui/outer-gag.ts`).
    else if (outerTapOf(which)) toast(outerLine(which, g.world) ?? '');
    // R0095: the village square's buildings and recruits.
    else villageTap(which, g.world, { shop: () => shop.open(), gym: () => gym.open() }, toast);
    return;
  }
  if (id?.startsWith('plant:') && g) {
    const p = g.world.plants.find((x) => x.id === id.slice('plant:'.length));
    if (!p) return;
    if (p.ripe) g.send({ kind: 'harvest', id: p.id });
    else if (p.water < 0.9) g.send({ kind: 'waterPlant', id: p.id });
    else toast(UI_TEXT.plantTap(p.stage, p.water, p.ripe));
    return;
  }
  if (id?.startsWith('decor:') && g) {
    g.send({ kind: 'removeDecor', id: id.slice('decor:'.length) });
    toast(UI_TEXT.decorPickedUp);
    return;
  }
  // R0322: repeated taps on a Nubbin squeak up the scale (ui/tap-toy.ts).
  if (id && g && g.world.nubbins.some((n) => n.id === id))
    tapToy(g, id, sheet.selectedId, performance.now());
  if (id) sheet.open(id);
  else sheet.close();
}
