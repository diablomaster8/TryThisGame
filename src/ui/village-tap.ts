import { VILLAGE_TEXT } from '../config/strings-world';
import { VILLAGE_PICK, type VillageService } from '../config/region-village';
import { villageRecruits } from '../sim/village';
import type { World } from '../sim/types';

/**
 * R0095 (WORLD-32): what tapping the village answers. The stall opens the shop and the gym
 * its menu; the other buildings and every recruit answer with a line. `id` is the part of the
 * pick id after `building:` (`village:<service>` or `village:r<i>`); false when it is not one.
 */
export function villageTap(
  id: string,
  world: World,
  open: { shop: () => void; gym: () => void },
  toast: (text: string) => void,
): boolean {
  if (!id.startsWith(VILLAGE_PICK)) return false;
  const what = id.slice(VILLAGE_PICK.length);
  if (what.startsWith('r')) {
    const r = villageRecruits(world)[Number(what.slice(1))];
    if (r) toast(VILLAGE_TEXT.recruitLine[r.role](r.name));
    return true;
  }
  const service = what as VillageService;
  if (service === 'stall') open.shop();
  else if (service === 'gym') open.gym();
  else if (service in VILLAGE_TEXT.lines)
    toast(VILLAGE_TEXT.lines[service as keyof typeof VILLAGE_TEXT.lines]);
  return true;
}
