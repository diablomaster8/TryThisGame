/**
 * R0727: "Continue as a Keeper". A grown-up graduates a Learning Grove save into a main
 * campaign save: the same Nubbins, chapter, inventory and keepsakes, with Mature content
 * Off, `edu` set to null (so the story plays its standard text from the current chapter)
 * and a certificate keepsake. Pure: JSON in, JSON out; the caller writes it to a campaign
 * slot (`writeSlotFrom`) and leaves the Learning Grove slot as it was.
 */
import { deserialize, serialize } from './save';

export const CERTIFICATE_KEEPSAKE = 'certificate-keeper';

export function eduToCampaign(json: string, nowWallMs: number): string | null {
  const file = deserialize(json);
  const world = file.world;
  if (!world.edu) return null;
  world.edu = null;
  world.settings.matureContent = 'off';
  const keepsakes = (world.inventory.keepsakes ??= []);
  if (!keepsakes.includes(CERTIFICATE_KEEPSAKE)) keepsakes.push(CERTIFICATE_KEEPSAKE);
  return serialize(world, nowWallMs);
}
