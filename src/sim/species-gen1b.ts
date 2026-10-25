import { GEN1B_EGGS } from '../config/tuning-pkb';
import type { EvolutionRule, Species, SpeciesStage } from './species';
import type { NubbinType } from './types';

/**
 * The second half of the first-generation pocket line (National Dex #77 to #151), whole
 * families, beside the baby and fossil lines already in `species.ts`. The fighting pair,
 * the kiss, plug and ember lines and the three fossils live there and are not repeated.
 * In-game names are our own (`config/strings-gen1b.ts`); `ref` is the inspiration, for
 * the artist only. Lines with two stages grow at the first evolution; three-stage lines
 * take their last form at the second. Single-stage species keep their look for life.
 * Rare and legendary species carry a small `eggWeight`, so they turn up only from eggs,
 * and seldom; nothing here touches the Eternal rules.
 */
const P = (
  id: string,
  ref: string,
  stage: SpeciesStage,
  type: NubbinType,
  evolve: EvolutionRule | null = null,
  eggWeight?: number,
): Species => ({
  id,
  family: 'pocket',
  ref,
  stage,
  type,
  evolve,
  ...(eggWeight !== undefined ? { eggWeight } : {}),
});
const to = (id: string): EvolutionRule => ({ kind: 'fixed', to: id });
const RARE = GEN1B_EGGS.rare;
const LEGEND = GEN1B_EGGS.legendary;

export const GEN1B_SPECIES: readonly Species[] = [
  P('emberfoal', 'Ponyta', 'baby', 'run', to('blazesteed')),
  P('blazesteed', 'Rapidash', 'final', 'run'),
  P('dawdlet', 'Slowpoke', 'baby', 'swim', to('dawdleshell')),
  P('dawdleshell', 'Slowbro', 'final', 'swim'),
  P('clinkbolt', 'Magnemite', 'baby', 'fly', to('clinktrio')),
  P('clinktrio', 'Magneton', 'final', 'fly'),
  P('leekbill', "Farfetch'd", 'baby', 'fly'),
  P('twinstrut', 'Doduo', 'baby', 'run', to('tristrut')),
  P('tristrut', 'Dodrio', 'final', 'run'),
  P('floepup', 'Seel', 'baby', 'swim', to('floeglide')),
  P('floeglide', 'Dewgong', 'final', 'swim'),
  P('gloplet', 'Grimer', 'baby', 'normal', to('glopheap')),
  P('glopheap', 'Muk', 'final', 'power'),
  P('clamlet', 'Shellder', 'baby', 'swim', to('clamfort')),
  P('clamfort', 'Cloyster', 'final', 'swim'),
  P('spooklet', 'Gastly', 'baby', 'fly', to('spookhand')),
  P('spookhand', 'Haunter', 'grown', 'fly', to('spookgrin')),
  P('spookgrin', 'Gengar', 'final', 'normal'),
  P('boulderwyrm', 'Onix', 'baby', 'power'),
  P('dozetrunk', 'Drowzee', 'baby', 'normal', to('dozeswing')),
  P('dozeswing', 'Hypno', 'final', 'normal'),
  P('pinchlet', 'Krabby', 'baby', 'swim', to('pinchking')),
  P('pinchking', 'Kingler', 'final', 'power'),
  P('sparkorb', 'Voltorb', 'baby', 'run', to('fizzorb')),
  P('fizzorb', 'Electrode', 'final', 'run'),
  P('seedclutch', 'Exeggcute', 'baby', 'normal', to('palmtrio')),
  P('palmtrio', 'Exeggutor', 'final', 'power'),
  P('bonecap', 'Cubone', 'baby', 'power', to('boneguard')),
  P('boneguard', 'Marowak', 'final', 'power'),
  P('lickalot', 'Lickitung', 'baby', 'normal'),
  P('smogpuff', 'Koffing', 'baby', 'fly', to('smogtwin')),
  P('smogtwin', 'Weezing', 'final', 'fly'),
  P('rockhorn', 'Rhyhorn', 'baby', 'power', to('drillhorn')),
  P('drillhorn', 'Rhydon', 'final', 'power'),
  P('eggtender', 'Chansey', 'baby', 'normal'),
  P('tanglet', 'Tangela', 'baby', 'normal'),
  P('pouchmum', 'Kangaskhan', 'baby', 'power'),
  P('snoutling', 'Horsea', 'baby', 'swim', to('snoutspine')),
  P('snoutspine', 'Seadra', 'final', 'swim'),
  P('silkfin', 'Goldeen', 'baby', 'swim', to('hornfin')),
  P('hornfin', 'Seaking', 'final', 'swim'),
  P('corestar', 'Staryu', 'baby', 'swim', to('prismstar')),
  P('prismstar', 'Starmie', 'final', 'swim'),
  P('wallmime', 'Mr. Mime', 'baby', 'normal'),
  P('sicklewing', 'Scyther', 'baby', 'run'),
  P('pinchbeetle', 'Pinsir', 'baby', 'power'),
  P('stampbull', 'Tauros', 'baby', 'run'),
  P('flopfish', 'Magikarp', 'baby', 'swim', to('stormwyrm')),
  P('stormwyrm', 'Gyarados', 'final', 'swim'),
  P('ferrysong', 'Lapras', 'baby', 'swim', null, RARE),
  P('copyblob', 'Ditto', 'baby', 'normal', null, RARE),
  // The evolution stone becomes the winning type: water, thunder or fire.
  P('fluffkit', 'Eevee', 'baby', 'normal', {
    kind: 'byType',
    map: { swim: 'tidefox', run: 'sparkfox', fly: 'sparkfox', power: 'flarefox' },
    fallback: 'flarefox',
  }),
  P('tidefox', 'Vaporeon', 'final', 'swim'),
  P('sparkfox', 'Jolteon', 'final', 'run'),
  P('flarefox', 'Flareon', 'final', 'power'),
  P('facetbird', 'Porygon', 'baby', 'normal'),
  P('snoozelump', 'Snorlax', 'baby', 'power', null, RARE),
  P('frostplume', 'Articuno', 'baby', 'fly', null, LEGEND),
  P('boltplume', 'Zapdos', 'baby', 'fly', null, LEGEND),
  P('blazeplume', 'Moltres', 'baby', 'fly', null, LEGEND),
  P('wyrmlet', 'Dratini', 'baby', 'swim', to('ribbonwyrm'), RARE),
  P('ribbonwyrm', 'Dragonair', 'grown', 'fly', to('hugwyrm')),
  P('hugwyrm', 'Dragonite', 'final', 'fly'),
  P('psyclone', 'Mewtwo', 'baby', 'power', null, LEGEND),
  P('whimsy', 'Mew', 'baby', 'fly', null, LEGEND),
];
