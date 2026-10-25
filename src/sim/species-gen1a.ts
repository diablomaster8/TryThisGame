import type { EvolutionRule, Species, SpeciesStage } from './species';
import type { NubbinType } from './types';

/**
 * The pocket line, part A: every first-generation family from National Dex #1 to #76
 * that the baby and fossil lines in species.ts do not already hold (the mouse, star and
 * puff lines are there). Whole families, so the three second-generation forms that
 * branch off them (Crobat, Bellossom, Politoed) are here too. Ids and in-game names are
 * our own; `ref` records the inspiration for the artist and is never shown.
 *
 * Three-stage families run baby → grown → final; two-stage ones baby → final, as the
 * existing lines do. Babies hatch from pocket-line eggs (trainers.ts reads every baby).
 */
const P = (
  id: string,
  ref: string,
  stage: SpeciesStage,
  type: NubbinType,
  evolve: EvolutionRule | null = null,
): Species => ({ id, family: 'pocket', ref, stage, type, evolve });
const to = (id: string): EvolutionRule => ({ kind: 'fixed', to: id });

export const GEN1A_SPECIES: readonly Species[] = [
  // ---- seed line ----
  P('bulblet', 'Bulbasaur', 'baby', 'normal', to('budback')),
  P('budback', 'Ivysaur', 'grown', 'normal', to('bloomback')),
  P('bloomback', 'Venusaur', 'final', 'power'),
  // ---- cinder line ----
  P('cinderkit', 'Charmander', 'baby', 'run', to('cinderclaw')),
  P('cinderclaw', 'Charmeleon', 'grown', 'run', to('cinderwing')),
  P('cinderwing', 'Charizard', 'final', 'fly'),
  // ---- shell-pup line ----
  P('shellpup', 'Squirtle', 'baby', 'swim', to('shellwave')),
  P('shellwave', 'Wartortle', 'grown', 'swim', to('shellcannon')),
  P('shellcannon', 'Blastoise', 'final', 'swim'),
  // ---- grub line ----
  P('leafgrub', 'Caterpie', 'baby', 'run', to('husklet')),
  P('husklet', 'Metapod', 'grown', 'normal', to('flutterwing')),
  P('flutterwing', 'Butterfree', 'final', 'fly'),
  // ---- sting line ----
  P('stinglet', 'Weedle', 'baby', 'run', to('husksting')),
  P('husksting', 'Kakuna', 'grown', 'normal', to('buzzlance')),
  P('buzzlance', 'Beedrill', 'final', 'fly'),
  // ---- peep line ----
  P('peeplet', 'Pidgey', 'baby', 'fly', to('peepwing')),
  P('peepwing', 'Pidgeotto', 'grown', 'fly', to('galeplume')),
  P('galeplume', 'Pidgeot', 'final', 'fly'),
  // ---- two-stage lines ----
  P('nibbler', 'Rattata', 'baby', 'run', to('gnawmaw')),
  P('gnawmaw', 'Raticate', 'final', 'run'),
  P('scrapwing', 'Spearow', 'baby', 'fly', to('spearbeak')),
  P('spearbeak', 'Fearow', 'final', 'fly'),
  P('coilet', 'Ekans', 'baby', 'run', to('hoodcoil')),
  P('hoodcoil', 'Arbok', 'final', 'power'),
  P('dustball', 'Sandshrew', 'baby', 'run', to('spinehide')),
  P('spinehide', 'Sandslash', 'final', 'power'),
  // ---- thorn lines ----
  P('thornbelle', 'Nidoran♀', 'baby', 'normal', to('thornmaid')),
  P('thornmaid', 'Nidorina', 'grown', 'power', to('thornqueen')),
  P('thornqueen', 'Nidoqueen', 'final', 'power'),
  P('thornbeau', 'Nidoran♂', 'baby', 'run', to('thornlad')),
  P('thornlad', 'Nidorino', 'grown', 'run', to('thornking')),
  P('thornking', 'Nidoking', 'final', 'power'),
  // ---- fox line ----
  P('kindlefox', 'Vulpix', 'baby', 'run', to('blazebrush')),
  P('blazebrush', 'Ninetales', 'final', 'run'),
  // ---- dusk line ----
  P('duskflit', 'Zubat', 'baby', 'fly', to('duskgape')),
  P('duskgape', 'Golbat', 'grown', 'fly', to('duskdart')),
  P('duskdart', 'Crobat', 'final', 'fly'),
  // ---- weed line: a Sun-side grown one blooms into the dancer, any other the big hat ----
  P('weedbud', 'Oddish', 'baby', 'normal', to('droopbud')),
  P('droopbud', 'Gloom', 'grown', 'normal', {
    kind: 'byBand',
    sun: 'sunbloom',
    moon: 'hatbloom',
    neutral: 'hatbloom',
  }),
  P('hatbloom', 'Vileplume', 'final', 'power'),
  P('sunbloom', 'Bellossom', 'final', 'normal'),
  // ---- more two-stage lines ----
  P('sporemite', 'Paras', 'baby', 'normal', to('sporeshroom')),
  P('sporeshroom', 'Parasect', 'final', 'power'),
  P('fuzzmite', 'Venonat', 'baby', 'normal', to('dustmoth')),
  P('dustmoth', 'Venomoth', 'final', 'fly'),
  P('burrowbud', 'Diglett', 'baby', 'run', to('burrowtrio')),
  P('burrowtrio', 'Dugtrio', 'final', 'run'),
  P('coinpaw', 'Meowth', 'baby', 'normal', to('gemcat')),
  P('gemcat', 'Persian', 'final', 'run'),
  P('muddleduck', 'Psyduck', 'baby', 'swim', to('bluebill')),
  P('bluebill', 'Golduck', 'final', 'swim'),
  P('huffling', 'Mankey', 'baby', 'power', to('grumpape')),
  P('grumpape', 'Primeape', 'final', 'power'),
  P('blazepup', 'Growlithe', 'baby', 'run', to('blazehound')),
  P('blazehound', 'Arcanine', 'final', 'run'),
  // ---- swirl line: a strong one grows into the brawler, any other into the singer ----
  P('swirlet', 'Poliwag', 'baby', 'swim', to('swirlwhirl')),
  P('swirlwhirl', 'Poliwhirl', 'grown', 'swim', {
    kind: 'byType',
    map: { power: 'swirlfist', run: 'swirlfist' },
    fallback: 'swirlcroak',
  }),
  P('swirlfist', 'Poliwrath', 'final', 'power'),
  P('swirlcroak', 'Politoed', 'final', 'swim'),
  // ---- three-stage lines ----
  P('drowsling', 'Abra', 'baby', 'normal', to('spoonseer')),
  P('spoonseer', 'Kadabra', 'grown', 'normal', to('spoonsage')),
  P('spoonsage', 'Alakazam', 'final', 'normal'),
  P('flexling', 'Machop', 'baby', 'power', to('flexbrute')),
  P('flexbrute', 'Machoke', 'grown', 'power', to('flexchamp')),
  P('flexchamp', 'Machamp', 'final', 'power'),
  P('bellsprig', 'Bellsprout', 'baby', 'normal', to('bellcup')),
  P('bellcup', 'Weepinbell', 'grown', 'normal', to('bellmaw')),
  P('bellmaw', 'Victreebel', 'final', 'power'),
  P('jellet', 'Tentacool', 'baby', 'swim', to('jellcrown')),
  P('jellcrown', 'Tentacruel', 'final', 'swim'),
  P('pebblefist', 'Geodude', 'baby', 'power', to('boulderfist')),
  P('boulderfist', 'Graveler', 'grown', 'power', to('rumbleboulder')),
  P('rumbleboulder', 'Golem', 'final', 'power'),
];
