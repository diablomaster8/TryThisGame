import { SKILLS } from '../config/tuning';
import type { SimEvent, World } from './types';

/**
 * The Keeper's skill tree: points from badges and finished requests buy small permanent
 * perks in four branches. Each node is checked where it applies (`hasSkill`); the
 * profile shows the tree.
 */
export type SkillBranch = 'care' | 'garden' | 'games' | 'story';

export interface Skill {
  id: string;
  branch: SkillBranch;
  name: string;
  blurb: string;
  cost: number;
  /** Must be owned first. */
  requires?: string;
}

export const SKILL_LIST: Skill[] = [
  // Care
  { id: 'warmHands', branch: 'care', name: 'Warm hands', blurb: 'Eggs hatch 10% faster.', cost: 1 },
  {
    id: 'gentlePet',
    branch: 'care',
    name: 'Gentle pet',
    blurb: 'Petting gives more affection.',
    cost: 1,
    requires: 'warmHands',
  },
  {
    id: 'fullBowl',
    branch: 'care',
    name: 'Full bowl',
    blurb: 'Fruit fills hunger more.',
    cost: 2,
    requires: 'gentlePet',
  },
  {
    id: 'lullaby',
    branch: 'care',
    name: 'Lullaby',
    blurb: 'Naps restore energy faster.',
    cost: 2,
    requires: 'fullBowl',
  },
  {
    id: 'steadyHeart',
    branch: 'care',
    name: 'Steady heart',
    blurb: 'Moods fade toward calm sooner.',
    cost: 3,
    requires: 'lullaby',
  },
  {
    id: 'secondArm',
    branch: 'care',
    name: 'Second arm',
    blurb: 'Carry a Nubbin a little faster.',
    cost: 3,
    requires: 'steadyHeart',
  },
  // Garden
  {
    id: 'greenThumb',
    branch: 'garden',
    name: 'Green thumb',
    blurb: 'Trees drop fruit 10% sooner.',
    cost: 1,
  },
  {
    id: 'seedPocket',
    branch: 'garden',
    name: 'Seed pocket',
    blurb: 'Expeditions bring one more seed.',
    cost: 1,
    requires: 'greenThumb',
  },
  {
    id: 'thrift',
    branch: 'garden',
    name: 'Thrift',
    blurb: 'Workshop recipes cost fewer Shells.',
    cost: 2,
    requires: 'seedPocket',
  },
  {
    id: 'deepRoots',
    branch: 'garden',
    name: 'Deep roots',
    blurb: 'Plants dry out slower.',
    cost: 2,
    requires: 'thrift',
  },
  {
    id: 'stoneEye',
    branch: 'garden',
    name: 'Stone eye',
    blurb: 'Rocks give two stone.',
    cost: 3,
    requires: 'deepRoots',
  },
  {
    id: 'bigPlot',
    branch: 'garden',
    name: 'Big plot',
    blurb: 'One more garden plot allowed.',
    cost: 3,
    requires: 'stoneEye',
  },
  // Games
  { id: 'cheerLeader', branch: 'games', name: 'Cheer leader', blurb: 'Race prizes +10%.', cost: 1 },
  {
    id: 'lightFeet',
    branch: 'games',
    name: 'Light feet',
    blurb: 'Expedition Shells +10%.',
    cost: 1,
    requires: 'cheerLeader',
  },
  {
    id: 'thickSkin',
    branch: 'games',
    name: 'Thick skin',
    blurb: 'Karate fighters start with more HP.',
    cost: 2,
    requires: 'lightFeet',
  },
  {
    id: 'coachsWhistle',
    branch: 'games',
    name: "Coach's whistle",
    blurb: 'Gym rounds give more points.',
    cost: 2,
    requires: 'thickSkin',
  },
  {
    id: 'secondWind',
    branch: 'games',
    name: 'Second wind',
    blurb: 'Racers rest shorter.',
    cost: 3,
    requires: 'coachsWhistle',
  },
  {
    id: 'twinePull',
    branch: 'games',
    name: 'Twine pull',
    blurb: 'Merges last half a minute longer.',
    cost: 3,
    requires: 'secondWind',
  },
  // Story
  { id: 'kindWord', branch: 'story', name: 'Kind word', blurb: 'Trust grows 20% faster.', cost: 1 },
  {
    id: 'teachersPet',
    branch: 'story',
    name: "Teacher's pet",
    blurb: 'Lessons cost less.',
    cost: 1,
    requires: 'kindWord',
  },
  {
    id: 'goodNeighbour',
    branch: 'story',
    name: 'Good neighbour',
    blurb: 'Neighbour gifts are bigger.',
    cost: 2,
    requires: 'teachersPet',
  },
  {
    id: 'lanternKeeper',
    branch: 'story',
    name: 'Lantern keeper',
    blurb: 'Lit lanterns also calm the curfew drain.',
    cost: 2,
    requires: 'goodNeighbour',
  },
  {
    id: 'townCrier',
    branch: 'story',
    name: 'Town crier',
    blurb: 'Recruits bring more prosperity.',
    cost: 3,
    requires: 'lanternKeeper',
  },
  {
    id: 'oldFriend',
    branch: 'story',
    name: 'Old friend',
    blurb: 'Strays come home sooner.',
    cost: 3,
    requires: 'townCrier',
  },
];

export function hasSkill(world: World, id: string): boolean {
  return world.skills[id] === true;
}

export function canBuySkill(world: World, id: string): string | null {
  const s = SKILL_LIST.find((x) => x.id === id);
  if (!s) return 'unknown';
  if (world.skills[id]) return 'owned';
  if (s.requires && !world.skills[s.requires]) return 'locked';
  if (world.skillPoints < s.cost) return 'points';
  return null;
}

export function buySkill(world: World, id: string, events: SimEvent[]): boolean {
  if (canBuySkill(world, id)) return false;
  const s = SKILL_LIST.find((x) => x.id === id)!;
  world.skillPoints -= s.cost;
  world.skills[id] = true;
  events.push({ kind: 'skillBought', id });
  return true;
}

/** Points arrive with badges and claimed requests. */
export function stepSkillPoints(world: World, events: SimEvent[]): void {
  for (const e of events) {
    if (e.kind === 'achievement') world.skillPoints += SKILLS.pointsPerAchievement;
    else if (e.kind === 'questClaimed') world.skillPoints += SKILLS.pointsPerQuest;
  }
}
